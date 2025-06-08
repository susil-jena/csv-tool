"use client"
import { Card, CardContent } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../redux';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
interface CsvFile {
    id: number;
    fileName: string;
    originalName: string;
    uploadedAt: string;
}

interface CsvRow {
    id: number;
    csvFileId: number;
    rowData: Record<string, string>;
    rowIndex: number;
}
export default function EditPage() {
    const params: any = useParams();
    const { id } = params;
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useAppSelector((state: any) => {
        return state.auth?.user
    });

    const router = useRouter();
    const fetchRows = async (fileId: number) => {
        setLoading(true);
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/csv/rows/${fileId}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const fetchedRows = res.data.rows;

            const allHeaders = Object.keys(fetchedRows[0]?.rowData || {});

            const formattedRows = fetchedRows.map((r: CsvRow) => ({ id: r.id, ...r.rowData }));

            const gridColumns: GridColDef[] = allHeaders.map((key) => ({
                field: key,
                headerName: key,
                flex: 1,
                editable: true,
            }));

            setColumns(gridColumns);
            setRows(formattedRows);
        } catch (err) {
            console.error('Failed to fetch rows', err);
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = async (newRow: any) => {
        const rowId = newRow.id;

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csv/rows/${rowId}`,
                { rowData: newRow },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            // Update the local state optimistically
            setRows((prevRows) =>
                prevRows.map((row) => (row.id === rowId ? newRow : row))
            );

            return newRow;
        } catch (err) {
            console.error('Failed to save row', err);
            throw err; // Needed for onProcessRowUpdateError
        }
    };
    const handleExportCsv = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csv/export/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to export CSV');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `exported-${id}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("CSV Export Completed")
        } catch (err) {
            console.error(err);
            toast.error('Failed to export CSV');
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchRows(id)
        }

    }, [user])

    return (
        <Card>
            <CardContent>
                <h2 className="text-xl font-semibold mb-4">Editing Rows</h2>
                <div className='flex justify-between'>
                    <Button className='mb-3 cursor-pointer'
                        onClick={() => router.back()}
                    >Back</Button>
                    <Button
                        onClick={() => handleExportCsv()}
                    >
                        Export CSV
                    </Button>
                </div>
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        processRowUpdate={handleEdit}
                        onProcessRowUpdateError={(error) => console.error('Row update error:', error)}
                        disableRowSelectionOnClick
                    />
                </div>
            </CardContent>
        </Card>
    )
}
