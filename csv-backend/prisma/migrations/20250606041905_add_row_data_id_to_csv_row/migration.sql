-- AlterTable
ALTER TABLE "CsvRow" ADD COLUMN     "rowDataId" TEXT;

-- CreateIndex
CREATE INDEX "CsvRow_rowDataId_idx" ON "CsvRow"("rowDataId");
