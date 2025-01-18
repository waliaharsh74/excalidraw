/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId",
ALTER COLUMN "lastName" SET NOT NULL;
