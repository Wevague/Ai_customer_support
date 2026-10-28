/*
  Warnings:

  - You are about to drop the column `customerId` on the `SupportMessage` table. All the data in the column will be lost.
  - Added the required column `businessId` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupportSender" AS ENUM ('SHOPPER', 'AI', 'HUMAN');

-- DropForeignKey
ALTER TABLE "SupportMessage" DROP CONSTRAINT "SupportMessage_customerId_fkey";

-- AlterTable
ALTER TABLE "SupportMessage" DROP COLUMN "customerId",
ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "sender" "SupportSender" NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_ownerId_key" ON "Business"("ownerId");

-- CreateIndex
CREATE INDEX "SupportMessage_businessId_sessionId_createdAt_idx" ON "SupportMessage"("businessId", "sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
