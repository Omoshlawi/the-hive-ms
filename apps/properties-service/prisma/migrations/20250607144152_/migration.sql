-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('Draft', 'Published');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "status" "PropertyStatus" NOT NULL DEFAULT 'Draft',
ALTER COLUMN "thumbnail" DROP NOT NULL;
