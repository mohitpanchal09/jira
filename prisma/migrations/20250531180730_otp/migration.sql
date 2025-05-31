-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" INTEGER,
ADD COLUMN     "otpCreatedAt" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
