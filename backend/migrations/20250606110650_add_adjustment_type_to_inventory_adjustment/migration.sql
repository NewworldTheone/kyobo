/*
  Warnings:

  - Added the required column `adjustmentType` to the `InventoryAdjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryAdjustment" ADD COLUMN     "adjustmentType" TEXT NOT NULL;
