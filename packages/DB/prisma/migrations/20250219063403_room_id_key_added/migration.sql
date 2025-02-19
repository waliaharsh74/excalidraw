/*
  Warnings:

  - Added the required column `roomId` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "roomId" INTEGER NOT NULL;
