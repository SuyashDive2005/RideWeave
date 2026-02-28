# 🚀 Supabase Real-time Ride Tracking Setup

Complete step-by-step guide to set up Supabase for real-time driver location tracking and ride status updates.

---

## ✅ Prerequisites

- Active Supabase project (free tier is fine!)
- Supabase URL and Anon Key (already in your `src/lib/supabase.ts`)
- This repository cloned and ready to use
- Basic understanding of SQL (not required, just copy-paste!)

---

## 📋 Setup Steps

### Step 1: Execute Database Migrations

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Copy Migration SQL**
   - Open `supabase-migrations.sql` in your project root
   - Copy all the contents

4. **Run the Query**
   - Paste into the Supabase SQL editor
   - Click **Run** button
   - Wait for the query to complete (should see ✓ success message)

**What this creates:**

- ✅ `driver_locations` table (stores driver GPS positions)
- ✅ Updates to `rides` table (adds ETA, distance, driver position fields)
- ✅ Helper functions for safe location updates
- ✅ Row-Level Security (RLS) policies for data protection

---

### Step 2: Enable Realtime for Tables

Realtime allows frontend to automatically sync when database changes:

1. **Open Replication Settings**
   - Go to **Database** → **Replication** in left sidebar

2. **Enable Realtime for `driver_locations`**
   - Find "driver_locations" in the table list
   - Click **Edit** button
   - Toggle **Realtime** switch ON
   - Click **Save**

3. **Enable Realtime for `rides`**
   - Find "rides" in the table list
   - Click **Edit** button
   - Toggle **Realtime** switch ON
   - Click **Save**

**Result:** Frontend components will now automatically receive live updates! ⚡

---

### Step 3: Add Sample Data (Optional)

Test the system with sample data:

1. **In SQL Editor**, create a new query:

```sql
-- Insert sample driver
INSERT INTO profiles (id, email, user_type, first_name, last_name)
VALUES (
  'driver-123-uuid',
  'driver@example.com',
  'driver',
  'John',
  'Doe'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample driver location
INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed)
VALUES (
  'driver-123-uuid',
  40.7128,
  -74.0060,
  45,
  25
);

-- Insert sample ride
INSERT INTO rides (id, rider_id, driver_id, pickup_latitude, pickup_longitude, drop_latitude, drop_longitude, status)
VALUES (
  'ride-123-uuid',
  'rider-user-uuid',
  'driver-123-uuid',
  40.7128,
  -74.0060,
  40.7580,
  -73.9855,
  'accepted'
) ON CONFLICT (id) DO NOTHING;
```

2. Click **Run**

---

## 🔌 Real-time Service Explained

### How Frontend Listens to Changes

Your frontend already has `src/services/websocket.service.ts` configured to:

1. **Listen to `driver_locations` table**

   ```typescript
   realtime.subscribeToDrvier(driverId, (location) => {
     // location.latitude, location.longitude updated automatically
   });
   ```

2. **Listen to `rides` table**
   ```typescript
   realtime.subscribeToRideUpdates(rideId, (ride) => {
     // ride.status, ride.eta_seconds, ride.distance_meters updated
   });
   ```

The magic: Changes in Supabase database instantly appear in frontend! ✨

---

## 🚗 How Driver App Sends Location

**Your driver app needs to send location updates.** Example to add to driver screen:

```typescript
import { supabase } from "@/lib/supabase";

// Call this every 5-10 seconds from driver app
async function updateMyLocation(latitude: number, longitude: number) {
  try {
    const { data, error } = await supabase.rpc("update_driver_location", {
      p_driver_id: currentUserId,
      p_latitude: latitude,
      p_longitude: longitude,
      p_heading: 0, // Direction driver is facing (0-360 degrees)
      p_speed: 0, // Speed in km/h
    });

    if (error) {
      console.error("Location update failed:", error);
    } else {
      console.log("Location updated successfully");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Example: Update location every 10 seconds
setInterval(() => {
  // Get current GPS position
  navigator.geolocation.getCurrentPosition((position) => {
    updateMyLocation(position.coords.latitude, position.coords.longitude);
  });
}, 10000);
```

---

## 🎯 How Riders See the Driver

**This is automatic in the rider's map!**

1. Rider selects a ride
2. `useInteractiveRideMap` hook calls `watchDriver(driverId)`
3. Frontend subscribes to that driver's location
4. **Every time driver location updates in database:**
   - Supabase Realtime sends notification
   - Driver marker smoothly animates
   - ETA/distance recalculates (if moving)
5. Rider sees live driver movement in real-time

---

## 📊 Database Schema Reference

### driver_locations Table

| Column       | Type      | Purpose                                |
| ------------ | --------- | -------------------------------------- |
| `id`         | uuid      | Unique ID                              |
| `driver_id`  | uuid      | Which driver (foreign key to profiles) |
| `latitude`   | numeric   | Current latitude                       |
| `longitude`  | numeric   | Current longitude                      |
| `heading`    | integer   | Direction (0-360°)                     |
| `speed`      | integer   | Speed in km/h                          |
| `created_at` | timestamp | When created                           |
| `updated_at` | timestamp | Last update time                       |

**Indexes:** `driver_id`, `updated_at` (for fast queries)

### rides Table Updates

These columns were **added** to the existing rides table:

| Column             | Type    | Purpose                                             |
| ------------------ | ------- | --------------------------------------------------- |
| `driver_latitude`  | numeric | Current driver lat (synced from driver_locations)   |
| `driver_longitude` | numeric | Current driver lng (synced from driver_locations)   |
| `eta_seconds`      | integer | ETA in seconds (calculated frontend or backend)     |
| `distance_meters`  | integer | Remaining distance (calculated frontend or backend) |

---

## 🔐 Security (RLS Policies)

The migrations set up Row-Level Security:

| Table              | Who Can     | Action                            |
| ------------------ | ----------- | --------------------------------- |
| `driver_locations` | **Driver**  | INSERT their own location         |
| `driver_locations` | **Rider**   | SELECT public driver locations    |
| `driver_locations` | **Driver**  | UPDATE own location               |
| `rides`            | **Both**    | SELECT if they're rider or driver |
| `rides`            | **Backend** | UPDATE via trusted functions      |

✅ Drivers can't see each other's locations
✅ Riders can only see their assigned driver
✅ All location updates are logged

---

## 🐛 Troubleshooting

### Problem: Real-time updates not showing

**Check 1: Is Realtime enabled?**

```sql
-- Run in SQL Editor to verify
SELECT table_name, is_realtime, status
FROM pg_tables
WHERE table_name IN ('driver_locations', 'rides');
```

**Check 2: Are subscriptions working?**

- Open browser DevTools (F12)
- Check Console tab for errors
- Look for "Realtime subscription" messages

**Check 3: Is data actually updating?**

- Go to Supabase Dashboard → Table Editor
- Click `driver_locations` table
- Manually insert a row with new coordinates
- Rider's map should update immediately

### Problem: Driver locations not being saved

**Check 1: Are you calling the RPC function correctly?**

```typescript
// ✅ CORRECT
await supabase.rpc("update_driver_location", {
  p_driver_id: "uuid-here",
  p_latitude: 40.7128,
  p_longitude: -74.006,
});

// ❌ WRONG - wrong parameter names
await supabase.rpc("update_driver_location", {
  driver_id: "uuid-here", // Missing 'p_' prefix
  latitude: 40.7128, // Missing 'p_' prefix
});
```

**Check 2: Is your driver_id valid?**

- Must be an existing user UUID from `profiles` table
- Not just any string!

### Problem: Permission denied errors

**RLS policy issue.** Run this to check:

```sql
-- Check if user can insert to driver_locations
SELECT * FROM driver_locations LIMIT 1;

-- If error, check RLS policies
SELECT * FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'driver_locations';
```

### Problem: High latency / slow updates

**Optimization tips:**

1. Increase Supabase plan (Pro/Team for higher throughput)
2. Use narrower realtime filters
3. Batch updates (don't send every millisecond)
4. Use Edge Functions for geographic queries

---

## 📚 Example: Complete Driver Location Flow

**Full example from driver screen to rider map:**

```typescript
// ===== DRIVER SIDE =====
import { supabase } from "@/lib/supabase";

function DriverScreen() {
  const userId = useAuth().userId; // Get current driver

  useEffect(() => {
    // Send location every 5 seconds
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await supabase.rpc("update_driver_location", {
          p_driver_id: userId,
          p_latitude: position.coords.latitude,
          p_longitude: position.coords.longitude,
          p_heading: Math.floor(Math.random() * 360), // Mock heading
          p_speed: Math.floor(Math.random() * 60),    // Mock speed
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  return <div>Driver Location: Sending updates...</div>;
}

// ===== RIDER SIDE =====
import { useInteractiveRideMap } from "@/hooks/use-interactive-ride-map";

function RiderScreen() {
  const { driverLocation, watchDriver } = useInteractiveRideMap();

  useEffect(() => {
    // Start watching driver
    const ride = activeRide; // From your app state
    watchDriver(ride.driver_id);
  }, []);

  return (
    <div>
      {driverLocation && (
        <p>
          Driver is at: {driverLocation.latitude}, {driverLocation.longitude}
          <br />
          Speed: {driverLocation.speed} km/h
        </p>
      )}
    </div>
  );
}
```

**Result:** Driver moves → Database updates → Realtime notifies → Rider sees movement! ⚡

---

## 🎓 Understanding the Architecture

```
Driver's Phone              Supabase Database           Rider's Phone
────────────                 ─────────────              ────────────
  GPS reads                                            Map renders
    ↓                                                      ↑
  Call RPC ──→ update_driver_location() ────→ driver_locations table
              (updates database)                            ↑
                                         Realtime Listeners ↑
                                                      ↑ Updates flow back
                                                      │
                                                    Auto-animate
                                                    marker on map
```

**Key insight:** Database is the source of truth. Supabase automatically notifies all connected clients when data changes.

---

## ✨ Next: Custom Features

Once basic setup works, you can add:

1. **Distance Calculation**

   ```sql
   SELECT distance_km FROM rides
   WHERE id = 'ride-id'
   USING ST_Distance_Sphere() -- PostGIS extension
   ```

2. **Estimated Route**

   ```sql
   SELECT * FROM calculate_route(
     start_lat, start_lng,
     end_lat, end_lng
   );
   ```

3. **Driver Matching Algorithm**

   ```sql
   SELECT * FROM find_nearest_drivers(
     pickup_lat,
     pickup_lng,
     max_distance_km := 5
   );
   ```

4. **Ride History & Analytics**
   ```sql
   SELECT COUNT(*), AVG(distance_meters), AVG(duration_seconds)
   FROM rides
   WHERE rider_id = 'user-id'
   AND created_at > NOW() - INTERVAL '30 days'
   ```

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Realtime Info:** https://supabase.com/docs/guides/realtime
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **This Project:** Check INTERACTIVE_MAP_GUIDE.md

---

**You're all set!** 🎉 Your ride-sharing app now has real-time capabilities!
