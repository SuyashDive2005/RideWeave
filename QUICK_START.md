# ⚡ Quick Supabase Setup (5-10 minutes)

## Step 1: Execute Database Migrations (3 min)

1. Open **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Open file `supabase-migrations.sql` from project root
5. Copy all contents
6. Paste into SQL editor
7. Click **Run**
8. ✅ Wait for success message

**Result:** Database tables created with all necessary fields and security policies

---

## Step 2: Enable Realtime (2 min)

1. Go **Database** → **Replication** (left sidebar)
2. Find `driver_locations` table → Click **Edit** → Toggle **Realtime** ON
3. Find `rides` table → Click **Edit** → Toggle **Realtime** ON
4. ✅ Done!

**Result:** Frontend components will now receive live database updates

---

## Step 3: Test It Works (2 min)

In **SQL Editor**, run this test query:

```sql
-- Insert test driver location
INSERT INTO driver_locations (
  driver_id,
  latitude,
  longitude,
  heading,
  speed
) VALUES (
  'test-driver-uuid',
  40.7128,
  -74.0060,
  45,
  30
);
```

**Expected:** No errors, see `⟵ 1 row inserted` message

---

## Step 4: Implement Driver Tracking (varies)

Add this code to where drivers send location updates:

```typescript
import { supabase } from "@/lib/supabase";

// Call this every 5-10 seconds during a ride
async function sendDriverLocation(driverId: string) {
  const position = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve);
  });

  const { error } = await supabase.rpc("update_driver_location", {
    p_driver_id: driverId,
    p_latitude: position.coords.latitude,
    p_longitude: position.coords.longitude,
    p_heading: 0,
    p_speed: 0,
  });

  if (error) console.error("Location update failed:", error);
}

// Usage:
setInterval(() => sendDriverLocation(currentUserId), 5000);
```

---

## 🎉 That's It!

Your map now has real-time driver tracking! The rider's map will automatically:

- ✅ Show driver's live location
- ✅ Animate marker as driver moves
- ✅ Update ETA/distance in real-time
- ✅ Show status changes (arriving → in_ride → completed)

---

## 📖 Need More Details?

- **Setup Issues?** → Read `SUPABASE_SETUP.md`
- **Feature Questions?** → Read `INTERACTIVE_MAP_GUIDE.md`
- **Implementation Details?** → Read `IMPLEMENTATION_STATUS.md`

---

## ⚠️ Common Issues

| Issue                      | Solution                                        |
| -------------------------- | ----------------------------------------------- |
| "permission denied" error  | Run migrations with superuser/admin account     |
| Updates not showing on map | Check Realtime is toggled ON in Dashboard       |
| Migrations fail to execute | Copy without extra whitespace, check SQL syntax |
| RPC function not found     | Make sure migrations ran successfully           |

---

Done! ✨
