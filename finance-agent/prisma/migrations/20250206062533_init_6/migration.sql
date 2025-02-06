/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "messagesSent" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Message";
