const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Parser } = require('json2csv');
/**
 * POST /upload
 * Upload CSV, parse it, store metadata and rows
 */
exports.uploadCsvFile = async (req, res) => {
  const { file } = req;
  const userId = req.user.id; // ✅ From JWT

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const rows = [];
  const headers = [];

  try {
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('headers', (csvHeaders) => {
        headers.push(...csvHeaders);
      })
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        try {
          const csvFile = await prisma.csvFile.create({
            data: {
              userId,
              fileName: file.filename,
              originalName: file.originalname,
              columnHeaders: headers,
              rowCount: rows.length,
            },
          });

          const formattedRows = rows.map((row, index) => ({
            rowData: row,
            rowIndex: index,
            rowDataId: row.id?.toString() || null, // Safely extract and stringify id
            csvFileId: csvFile.id,
          }));

          await prisma.csvRow.createMany({ data: formattedRows });
          // ✅ 3. Delete the file from the filesystem
          fs.unlink(file.path, (err) => {
            if (err) console.error('Failed to delete uploaded file:', err);
          });
          res.status(200).json({ message: 'CSV uploaded successfully', fileId: csvFile.id });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Failed to save CSV to database' });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process CSV' });
  }
};


/**
 * GET /files/:userId
 * Get all uploaded CSV files by user
 */
exports.getCsvFiles = async (req, res) => {
  const userId = req.user.id; // ✅ From JWT

  try {
    const files = await prisma.csvFile.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};


/**
 * GET /rows/:csvFileId
 * Get all rows for a specific CSV file
 */
exports.getCsvRows = async (req, res) => {
  const { csvFileId } = req.params;

  try {
    const rows = await prisma.csvRow.findMany({
      where: { csvFileId: parseInt(csvFileId) },
      orderBy: { rowIndex: 'asc' },
    });

    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rows' });
  }
};

// PATCH /api/rows/:rowDataId
exports.updateCsvRow = async (req, res) => {
  const rowDataId = req.params.rowId; // Match this to rowDataId in DB
  const updatedRowData = req.body.rowData;
  const userId = req.user.id;

  try {
    // Step 1: Find row using the non-unique rowDataId
    const row = await prisma.csvRow.findFirst({
      where: { rowDataId },
      include: {
        CsvFile: true,
      },
    });

    if (!row) {
      return res.status(404).json({ message: 'Row not found' });
    }

    // Step 2: Check if the user is authorized to update it
    if (row.CsvFile.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this row' });
    }

    // Step 3: Update rowData
    const updatedRow = await prisma.csvRow.update({
      where: { id: row.id },
      data: {
        rowData: updatedRowData,
      },
    });

    res.json({ message: 'Row updated successfully', row: updatedRow });
  } catch (err) {
    console.error('Error updating row:', err);
    res.status(500).json({ message: 'Failed to update row' });
  }
};

exports.deleteCsvFile = async (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const userId = req.user.id;

  try {
    // 1. Check if file exists and belongs to user
    const file = await prisma.csvFile.findUnique({
      where: { id: fileId },
      include: { CsvRows: true },
    });

    if (!file) {
      return res.status(404).json({ message: 'CSV file not found' });
    }

    if (file.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }

    // 2. Delete associated rows
    await prisma.csvRow.deleteMany({
      where: { csvFileId: fileId },
    });

    // 3. Delete the CSV file
    await prisma.csvFile.delete({
      where: { id: fileId },
    });

    res.json({ message: 'CSV file and associated rows deleted successfully' });
  } catch (err) {
    console.error('Error deleting CSV file:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.exportCsvFile = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Check if file exists and belongs to user
    const csvFile = await prisma.csvFile.findUnique({
      where: { id: parseInt(fileId) },
      include: {
        CsvRows: true,
      },
    });

    if (!csvFile || csvFile.userId !== userId) {
      return res.status(404).json({ message: 'File not found' });
    }

    const rows = csvFile?.CsvRows.map(r => r.rowData);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'No data to export' });
    }

    // 2. Convert to CSV
    const parser = new Parser({ fields: csvFile.columnHeaders });
    const csv = parser.parse(rows);

    // 3. Set headers for file download
    res.setHeader('Content-disposition', `attachment; filename=${csvFile.originalName || 'export.csv'}`);
    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export CSV' });
  }
};




