import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LiveRideUpdate {
  rideId: string;
  driverId: string;
  status: "accepted" | "arriving" | "in_ride" | "completed" | "cancelled";
  driverLocation: DriverLocation;
  currentETA?: number; // seconds
  distance?: number; // meters
}

type LocationCallback = (location: DriverLocation) => void;
type RideUpdateCallback = (update: LiveRideUpdate) => void;

export class RideRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private locationCallbacks: Map<string, LocationCallback> = new Map();
  private rideUpdateCallbacks: Set<RideUpdateCallback> = new Set();

  // Subscribe to driver location updates
  subscribeToDrvier(driverId: string, callback: LocationCallback): void {
    this.locationCallbacks.set(driverId, callback);

    // Listen to driver_locations table for this driver
    const channel = supabase
      .channel(`driver:${driverId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          const location: DriverLocation = {
            driverId,
            lat: payload.new?.latitude || payload.old?.latitude,
            lng: payload.new?.longitude || payload.old?.longitude,
            heading: payload.new?.heading,
            speed: payload.new?.speed,
            timestamp: Date.now(),
          };
          callback(location);
        },
      )
      .subscribe();

    this.channels.set(`driver:${driverId}`, channel);
  }

  // Unsubscribe from driver location updates
  unsubscribeFromDriver(driverId: string): void {
    const channel = this.channels.get(`driver:${driverId}`);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(`driver:${driverId}`);
      this.locationCallbacks.delete(driverId);
    }
  }

  // Subscribe to ride status updates
  subscribeToRideUpdates(callback: RideUpdateCallback): void {
    this.rideUpdateCallbacks.add(callback);

    // Listen to rides table for status changes
    const channel = supabase
      .channel("rides:all")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
        },
        (payload) => {
          const rideUpdate: LiveRideUpdate = {
            rideId: payload.new?.id,
            driverId: payload.new?.driver_id,
            status: payload.new?.status,
            driverLocation: {
              driverId: payload.new?.driver_id,
              lat: payload.new?.driver_latitude,
              lng: payload.new?.driver_longitude,
              timestamp: Date.now(),
            },
            currentETA: payload.new?.eta_seconds,
            distance: payload.new?.distance_meters,
          };
          callback(rideUpdate);
        },
      )
      .subscribe();

    this.channels.set("rides:all", channel);
  }

  // Unsubscribe from ride updates
  unsubscribeFromRideUpdates(callback: RideUpdateCallback): void {
    this.rideUpdateCallbacks.delete(callback);

    if (this.rideUpdateCallbacks.size === 0) {
      const channel = this.channels.get("rides:all");
      if (channel) {
        supabase.removeChannel(channel);
        this.channels.delete("rides:all");
      }
    }
  }

  // Disconnect all subscriptions
  disconnect(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.locationCallbacks.clear();
    this.rideUpdateCallbacks.clear();
  }

  isConnected(): boolean {
    return this.channels.size > 0;
  }
}

// Singleton instance
let realtimeInstance: RideRealtimeService | null = null;

export function getRealtimeService(): RideRealtimeService {
  if (!realtimeInstance) {
    realtimeInstance = new RideRealtimeService();
  }
  return realtimeInstance;
}
