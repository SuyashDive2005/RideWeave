# ⚡ Prisma Migration Guide for Real-time Ride Tracking

## Option 1: Manual Schema Update (Recommended)

### Step 1: Update `prisma/schema.prisma`

#### A. Add `ARRIVING` status to enum:

Find this enum and add the `ARRIVING` line:

```prisma
enum SharedRideStatus {
  ASSIGNED
  ARRIVING     // <- ADD THIS
  ONGOING
  COMPLETED
  FAILED
  CANCELLED
}
```

#### B. Add tracking fields to SharedRide model:

Find the `SharedRide` model and add these 4 lines before `createdAt`:

```prisma
model SharedRide {
  // ... existing fields ...
  routePolyline  String?          @db.Text
  startedAt      DateTime?        @map("started_at")
  completedAt    DateTime?        @map("completed_at")
  // ADD THESE 4 LINES:
  driverLatitude  Decimal?        @map("driver_latitude") @db.Decimal(10, 8)
  driverLongitude Decimal?        @map("driver_longitude") @db.Decimal(11, 8)
  etaSeconds      Int?            @map("eta_seconds")
  distanceMeters  Int?            @map("distance_meters")
  createdAt      DateTime         @default(now()) @map("created_at")
  // ... rest of model ...
}
```

#### C. Add DriverLocation model at the END of the file:

```prisma
// Real-time driver location tracking
model DriverLocation {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  driverId  String   @map("driver_id") @db.Uuid
  latitude  Decimal  @db.Decimal(10, 8)
  longitude Decimal  @db.Decimal(11, 8)
  heading   Int?     @db.SmallInt // Direction in degrees (0-360)
  speed     Int?     @db.SmallInt // Speed in km/h
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  driver User @relation("DriverLocations", fields: [driverId], references: [id], onDelete: Cascade)

  @@index([driverId], map: "idx_driver_locations_driver")
  @@index([updatedAt], map: "idx_driver_locations_updated")
  @@map("driver_locations")
}
```

#### D. Update User model to add the relation:

Find the `User` model relations section and add this line at the end:

```prisma
model User {
  // ... existing fields ...

  // Relations:
  vehicles           Vehicle[]
  wallet             Wallet?
  // ... other relations ...
  reviewsGiven       Review[]            @relation("ReviewGiver")
  reviewsReceived    Review[]            @relation("ReviewReceiver")
  driverLocations    DriverLocation[]    @relation("DriverLocations")  // <- ADD THIS

  // ... rest of model ...
}
```

### Step 2: Generate Migration

```bash
npx prisma migrate dev --name add_realtime_tracking
```

This will:

- Create a migration file in `prisma/migrations/`
- Apply changes to your database
- Regenerate Prisma Client

### Step 3: Enable Supabase Realtime

1. Go to **Supabase Dashboard** → **Database** → **Replication**
2. Find `driver_locations` → Click **Edit** → Toggle **Realtime** ON
3. Find `shared_rides` → Click **Edit** → Toggle **Realtime** ON

---

## Option 2: Apply SQL Manually (if Prisma migration fails)

If Option 1 doesn't work, run this SQL in Supabase SQL Editor:

```sql
-- Add ARRIVING status
ALTER TYPE "SharedRideStatus" ADD VALUE IF NOT EXISTS 'ARRIVING';

-- Add real-time tracking fields
ALTER TABLE "shared_rides"
ADD COLUMN IF NOT EXISTS "driver_latitude" DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS "driver_longitude" DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS "eta_seconds" INTEGER,
ADD COLUMN IF NOT EXISTS "distance_meters" INTEGER;

-- Create driver_locations table
CREATE TABLE IF NOT EXISTS "driver_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "driver_id" UUID NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "heading" SMALLINT,
    "speed" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "driver_locations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "driver_locations_driver_id_fkey"
        FOREIGN KEY ("driver_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_driver_locations_driver" ON "driver_locations"("driver_id");
CREATE INDEX IF NOT EXISTS "idx_driver_locations_updated" ON "driver_locations"("updated_at");
```

Then run:

```bash
npx prisma db pull
npx prisma generate
```

---

## Verify Migration

Run this to check tables were created:

```bash
npx prisma studio
```

You should see:

- `driver_locations` table
- `shared_rides` has new columns: `driver_latitude`, `driver_longitude`, `eta_seconds`, `distance_meters`

---

## Next Steps

After migration completes:

1. ✅ **Test Real-time Updates**:
   Insert a test driver location:

   ```sql
   INSERT INTO driver_locations (driver_id, latitude, longitude)
   VALUES ('your-user-id', 18.5204, 73.8567);
   ```

2. ✅ **Update Your Code**:
   The real-time services are already configured to use these tables!

3. ✅ **Read Documentation**:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Full setup guide
   - [QUICK_START.md](./QUICK_START.md) - 5-minute quickstart

---

## Troubleshooting

### "Enum value already exists"

Skip the enum alteration, it's already added.

### "Cannot add value to enum"

PostgreSQL doesn't allow adding enum values in transactions. Run the ALTER TYPE command separately first:

```sql
ALTER TYPE "SharedRideStatus" ADD VALUE 'ARRIVING';
```

### "Relation does not exist"

Make sure you added `driverLocations` to the User model.

### "Prisma Client not updated"

Run: `npx prisma generate`

---

Done! 🎉
