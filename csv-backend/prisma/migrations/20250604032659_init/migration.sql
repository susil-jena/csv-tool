-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvFile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columnHeaders" TEXT[],
    "rowCount" INTEGER NOT NULL,

    CONSTRAINT "CsvFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvRow" (
    "id" SERIAL NOT NULL,
    "csvFileId" INTEGER NOT NULL,
    "rowData" JSONB NOT NULL,
    "rowIndex" INTEGER NOT NULL,

    CONSTRAINT "CsvRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CsvFile" ADD CONSTRAINT "CsvFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CsvRow" ADD CONSTRAINT "CsvRow_csvFileId_fkey" FOREIGN KEY ("csvFileId") REFERENCES "CsvFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
