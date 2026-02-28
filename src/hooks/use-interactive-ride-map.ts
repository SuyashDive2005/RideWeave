// Example implementation hook showing how to use all interactive map features
import { useState, useEffect, useCallback } from "react";
import { useRideMap } from "@/hooks/use-ride-map";
import { getRealtimeService } from "@/services/websocket.service";

export function useInteractiveRideMap() {
  const rideMap = useRideMap();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const realtime = getRealtimeService();

  // Request user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          rideMap.setUserLocation(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        (error) => {
          console.warn("Geolocation error:", error);
        },
      );
    }
  }, [rideMap]);

  // Handle map click to set pickup or drop points
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      // If no pickup point, set it
      if (!rideMap.pickupPoint) {
        rideMap.setPickupPoint(lat, lng);
      }
      // If pickup exists but no drop point, set it
      else if (!rideMap.dropPoint) {
        rideMap.setDropPoint(lat, lng);
      }
      // If both exist, replace drop point
      else {
        rideMap.setDropPoint(lat, lng);
      }
    },
    [rideMap],
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      realtime.disconnect();
    };
  }, [realtime]);

  // Watch selected ride driver
  const selectRide = useCallback(
    (rideId: string, driverId: string) => {
      // Stop watching previous driver
      if (selectedRideId) {
        rideMap.stopWatchingDriver();
      }
      // Watch new driver
      setSelectedRideId(rideId);
      rideMap.watchDriver(driverId);
    },
    [selectedRideId, rideMap],
  );

  return {
    ...rideMap,
    handleMapClick,
    selectRide,
    selectedRideId,
    realtimeConnected: realtime.isConnected(),
  };
}
