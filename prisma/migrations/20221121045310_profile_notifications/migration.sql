-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "identityStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "reasonCodes" TEXT[];
