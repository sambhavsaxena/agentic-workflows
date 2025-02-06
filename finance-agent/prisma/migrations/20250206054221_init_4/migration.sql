/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status";

-- DropEnum
DROP TYPE "MessageStatus";
