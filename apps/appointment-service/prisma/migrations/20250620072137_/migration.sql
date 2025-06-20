/*
  Warnings:

  - You are about to drop the column `user` on the `AppointmentParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AppointmentParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId,personId]` on the table `AppointmentParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personId` to the `AppointmentParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AppointmentParticipant_appointmentId_userId_key";

-- AlterTable
ALTER TABLE "AppointmentParticipant" DROP COLUMN "user",
DROP COLUMN "userId",
ADD COLUMN     "person" JSONB,
ADD COLUMN     "personId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentParticipant_appointmentId_personId_key" ON "AppointmentParticipant"("appointmentId", "personId");
