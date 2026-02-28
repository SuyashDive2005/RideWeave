-- Supabase Database Schema for Real-time Ride Tracking
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Driver Locations Table
-- Stores real-time driver location updates
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  heading integer,
  speed double precision,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Index for faster driver lookups
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_updated_at ON driver_locations(updated_at DESC);

-- Enable real-time for driver_locations
ALTER TABLE driver_locations REPLICA IDENTITY FULL;

-- 2. Rides Table (if not exists, update your existing table)
-- Add these columns to your existing rides table if they don't exist:
ALTER TABLE rides ADD COLUMN IF NOT EXISTS driver_latitude double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS driver_longitude double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS eta_seconds integer;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS distance_meters integer;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Enable real-time for rides table
ALTER TABLE rides REPLICA IDENTITY FULL;

-- 3. Function to update driver location
CREATE OR REPLACE FUNCTION update_driver_location(
  p_driver_id uuid,
  p_latitude double precision,
  p_longitude double precision,
  p_heading integer DEFAULT NULL,
  p_speed double precision DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed)
  VALUES (p_driver_id, p_latitude, p_longitude, p_heading, p_speed)
  ON CONFLICT (driver_id) DO UPDATE SET
    latitude = p_latitude,
    longitude = p_longitude,
    heading = COALESCE(p_heading, driver_locations.heading),
    speed = COALESCE(p_speed, driver_locations.speed),
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- 4. Function to update ride status
CREATE OR REPLACE FUNCTION update_ride_status(
  p_ride_id uuid,
  p_status text,
  p_driver_latitude double precision DEFAULT NULL,
  p_driver_longitude double precision DEFAULT NULL,
  p_eta_seconds integer DEFAULT NULL,
  p_distance_meters integer DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE rides SET
    status = p_status,
    driver_latitude = COALESCE(p_driver_latitude, driver_latitude),
    driver_longitude = COALESCE(p_driver_longitude, driver_longitude),
    eta_seconds = COALESCE(p_eta_seconds, eta_seconds),
    distance_meters = COALESCE(p_distance_meters, distance_meters),
    updated_at = now()
  WHERE id = p_ride_id;
END;
$$ LANGUAGE plpgsql;

-- 5. RLS Policies for driver_locations
CREATE POLICY "Drivers can insert their own location"
  ON driver_locations
  FOR INSERT
  WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Anyone can read driver locations"
  ON driver_locations
  FOR SELECT
  USING (true);

CREATE POLICY "Drivers can update their own location"
  ON driver_locations
  FOR UPDATE
  USING (driver_id = auth.uid());

-- Enable RLS
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for rides
CREATE POLICY "Users can read rides they created or booked"
  ON rides
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = driver_id
  );

CREATE POLICY "Users can update their own rides"
  ON rides
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = driver_id);

-- 7. Index for faster ride lookups
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_user_id ON rides(user_id);
