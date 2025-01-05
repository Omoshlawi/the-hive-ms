/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `HiveFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HiveFile_path_key" ON "HiveFile"("path");
