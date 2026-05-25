/*
  Warnings:

  - You are about to drop the column `date` on the `leave_requests` table. All the data in the column will be lost.
  - Added the required column `date_from` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_to` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Made the column `reason` on table `leave_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `leave_requests` DROP COLUMN `date`,
    ADD COLUMN `date_from` DATETIME(3) NOT NULL,
    ADD COLUMN `date_to` DATETIME(3) NOT NULL,
    ADD COLUMN `details` VARCHAR(191) NULL,
    ADD COLUMN `remark` VARCHAR(191) NULL DEFAULT '',
    MODIFY `reason` VARCHAR(191) NOT NULL;
