-- CreateEnum
CREATE TYPE "KnowledgeSourceType" AS ENUM ('TEXT', 'DOCUMENT', 'IMAGE', 'WEBSITE');

-- CreateEnum
CREATE TYPE "KnowledgeSourceStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- DropIndex
DROP INDEX "SupportMessage_businessId_sessionId_createdAt_idx";

-- CreateTable
CREATE TABLE "KnowledgeSource" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "KnowledgeSourceType" NOT NULL,
    "status" "KnowledgeSourceStatus" NOT NULL DEFAULT 'PROCESSING',
    "title" TEXT,
    "sourceUrl" TEXT,
    "originalName" TEXT,
    "mimeType" TEXT,
    "storagePath" TEXT,
    "extractedText" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeSource_businessId_createdAt_idx" ON "KnowledgeSource"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportMessage_businessId_sessionId_idx" ON "SupportMessage"("businessId", "sessionId");

-- AddForeignKey
ALTER TABLE "KnowledgeSource" ADD CONSTRAINT "KnowledgeSource_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
