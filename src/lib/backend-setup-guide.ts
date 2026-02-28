/**
 * SUPABASE REAL-TIME SETUP GUIDE
 *
 * This guide explains how to set up the interactive map with Supabase real-time
 * PostgreSQL change detection. No Node.js backend server needed!
 *
 * ## Step 1: Set Up Database Tables
 *
 * Run the SQL in `supabase-migrations.sql` in your Supabase SQL Editor:
 * 1. Go to supabase.com → Your Project → SQL Editor
 * 2. Create a new query
 * 3. Copy & paste the contents of supabase-migrations.sql
 * 4. Run the query
 *
 * This creates:
 * - driver_locations table (real-time driver positions)
 * - Updates to rides table (status, ETA, distance)
 * - RLS policies (security)
 * - Helper functions (update_driver_location, update_ride_status)
 *
 * ## Step 2: Enable Realtime in Supabase Dashboard
 *
 * 1. Go to to Supabase Dashboard → Your Project → Database
 * 2. Click "Replication" in the left sidebar
 * 3. Click "Edit" next to "driver_locations"
 * 4. Enable real-time
 * 5. Click "Edit" next to "rides"
 * 6. Enable real-time
 *
 * ## Step 3: Use the Services in Your App
 *
 * # Example 1: Update Driver Location (Driver App)
 *
 * ```typescript
 * import { supabase } from "@/lib/supabase";
 *
 * async function updateDriverLocation(lat: number, lng: number) {
 *   const { error } = await supabase.rpc("update_driver_location", {
 *     p_driver_id: userId,
 *     p_latitude: lat,
 *     p_longitude: lng,
 *   });
 *
 *   if (error) console.error("Location update failed:", error);
 * }
 * ```
 *
 * # Example 2: Watch Driver Location (Rider App)
 *
 * ```typescript
 * import { useRideMap } from "@/hooks/use-ride-map";
 *
 * function RiderMap() {
 *   const { driverLocation, watchDriver } = useRideMap();
 *
 *   // Start watching driver
 *   watchDriver("driver-uuid-here");
 *
 *   // driverLocation automatically updates!
 *   console.log(driverLocation);
 * }
 * ```
 *
 * # Example 3: Update Ride Status (Backend Function or Driver App)
 *
 * ```typescript
 * async function updateRideStatus(
 *   rideId: string,
 *   status: "arriving" | "in_ride" | "completed"
 * ) {
 *   const { error } = await supabase.rpc("update_ride_status", {
 *     p_ride_id: rideId,
 *     p_status: status,
 *     p_driver_latitude: currentLat,
 *     p_driver_longitude: currentLng,
 *     p_eta_seconds: 300, // 5 minutes
 *     p_distance_meters: 2500,
 *   });
 * }
 * ```
 *
 * ## Step 4: Frontend Integration
 *
 * The map automatically subscribes to real-time updates:
 *
 * ```typescript
 * import { useInteractiveRideMap } from "@/hooks/use-interactive-ride-map";
 * import { MapCanvas } from "@/components/features/MapCanvas";
 *
 * function RidesPage() {
 *   const {
 *     userLocation,
 *     pickupPoint,
 *     dropPoint,
 *     route,
 *     driverLocation,      // Updates automatically from Supabase!
 *     rideStatus,          // Updates automatically from Supabase!
 *     handleMapClick,
 *   } = useInteractiveRideMap();
 *
 *   return (
 *     <MapCanvas
 *       userLocation={userLocation}
 *       pickupPoint={pickupPoint}
 *       dropPoint={dropPoint}
 *       routeCoordinates={route?.coordinates}
 *       driverLocation={driverLocation}  // Real-time updates
 *       onMapClick={handleMapClick}
 *       autoZoom={true}
 *     />
 *   );
 * }
 * ```
 *
 * ## Architecture
 *
 * ```
 * Driver App                        Rider App
 *     │                                 │
 *     ├─→ updateDriverLocation()       │
 *     │                                 │
 *     │   (calls RPC function)         │
 *     │                                 │
 *     ↓                                 ↓
 *   Supabase Database ←─── Real-time PostgreSQL Changes ───→ Map Updates
 *   ├─ driver_locations              (via Supabase.js)
 *   └─ rides table
 * ```
 *
 * ## Key Features
 *
 * ✅ No separate backend server needed
 * ✅ Automatic database change detection
 * ✅ Secure with RLS policies
 * ✅ Scales automatically
 * ✅ Built-in authentication integration
 * ✅ Works offline with Supabase offline mode
 *
 * ## Troubleshooting
 *
 * ### Real-time updates not working?
 * 1. Check Realtime is enabled in Supabase Dashboard
 * 2. Check browser console for errors
 * 3. Verify RLS policies aren't blocking reads
 * 4. Test with Supabase Studio SQL preview
 *
 * ### High latency?
 * 1. Use more specific supabase.channel() filters
 * 2. Increase Supabase plan for higher throughput
 * 3. Batch updates instead of sending every location change
 *
 * ### Complex calculations needed?
 * Create Supabase Edge Functions for distance/ETA calculation:
 * - Use PostgreSQL PostGIS extension for geo queries
 * - Call Supabase Functions from your app
 */

export const SupabaseRealtimeGuide = {
  description: "Complete guide for setting up Supabase real-time ride tracking",
  requirements: [
    "Supabase project (supabase.com)",
    "Database tables set up (see supabase-migrations.sql)",
    "Realtime enabled in Supabase Dashboard",
  ],
  features: [
    "Real-time driver location tracking",
    "Live ride status updates",
    "Automatic PostgreSQL change detection",
    "No backend server needed",
    "Secure with RLS policies",
  ],
  sqlSetup: "See supabase-migrations.sql in project root",
};
