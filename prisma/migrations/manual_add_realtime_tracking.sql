-- CreateEnum: Add ARRIVING status to SharedRideStatus
ALTER TYPE "SharedRideStatus" ADD VALUE 'ARRIVING';

-- AlterTable: Add real-time tracking fields to shared_rides
ALTER TABLE "shared_rides" ADD COLUMN "driver_latitude" DECIMAL(10,8),
ADD COLUMN "driver_longitude" DECIMAL(11,8),
ADD COLUMN "eta_seconds" INTEGER,
ADD COLUMN "distance_meters" INTEGER;

-- CreateTable: driver_locations for real-time tracking
CREATE TABLE "driver_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "driver_id" UUID NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "heading" SMALLINT,
    "speed" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_driver_locations_driver" ON "driver_locations"("driver_id");

-- CreateIndex
CREATE INDEX "idx_driver_locations_updated" ON "driver_locations"("updated_at");

-- AddForeignKey
ALTER TABLE "driver_locations" ADD CONSTRAINT "driver_locations_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
