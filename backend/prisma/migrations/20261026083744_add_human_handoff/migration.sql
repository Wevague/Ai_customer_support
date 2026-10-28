-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "humanHandoffAt" TIMESTAMP(3),
ADD COLUMN     "needsHuman" BOOLEAN NOT NULL DEFAULT false;
