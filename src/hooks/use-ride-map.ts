import { useState, useCallback, useEffect } from "react";
import { getRoute, RouteInfo } from "@/services/routing.service";
import {
  reverseGeocode,
  forwardGeocode,
  Address,
} from "@/services/geocoding.service";
import {
  getRealtimeService,
  DriverLocation,
  LiveRideUpdate,
} from "@/services/websocket.service";

export interface RidePoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface RideMapState {
  pickupPoint: RidePoint | null;
  dropPoint: RidePoint | null;
  route: RouteInfo | null;
  userLocation: RidePoint | null;
  selectedDriverId: string | null;
  driverLocation: DriverLocation | null;
  rideStatus: LiveRideUpdate | null;
  loading: boolean;
  error: string | null;
}

export function useRideMap() {
  const [state, setState] = useState<RideMapState>({
    pickupPoint: null,
    dropPoint: null,
    route: null,
    userLocation: null,
    selectedDriverId: null,
    driverLocation: null,
    rideStatus: null,
    loading: false,
    error: null,
  });

  const realtime = getRealtimeService();

  // Set pickup point
  const setPickupPoint = useCallback(async (lat: number, lng: number) => {
    setState((prev) => ({ ...prev, loading: true }));
    const address = await reverseGeocode(lat, lng);
    setState((prev) => ({
      ...prev,
      pickupPoint: {
        lat,
        lng,
        address: address?.display_name,
      },
      loading: false,
    }));
  }, []);

  // Set drop point and calculate route
  const setDropPoint = useCallback(async (lat: number, lng: number) => {
    setState((prev) => ({ ...prev, loading: true }));
    const address = await reverseGeocode(lat, lng);

    setState((prev) => {
      const newDropPoint = {
        lat,
        lng,
        address: address?.display_name,
      };
      return { ...prev, dropPoint: newDropPoint };
    });

    // Calculate route if we have both points
    setState((prev) => {
      if (prev.pickupPoint) {
        getRoute(prev.pickupPoint.lat, prev.pickupPoint.lng, lat, lng).then(
          (route) => {
            if (route) {
              setState((s) => ({ ...s, route, loading: false }));
            } else {
              setState((s) => ({
                ...s,
                error: "Could not calculate route",
                loading: false,
              }));
            }
          },
        );
      }
      return prev;
    });
  }, []);

  // Search for place
  const searchPlace = useCallback(async (query: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const results = await forwardGeocode(query);
    setState((prev) => ({ ...prev, loading: false }));
    return results;
  }, []);

  // Watch driver location
  const watchDriver = useCallback(
    (driverId: string) => {
      setState((prev) => ({ ...prev, selectedDriverId: driverId }));

      realtime.subscribeToDrvier(driverId, (location: DriverLocation) => {
        setState((prev) => ({ ...prev, driverLocation: location }));
      });
    },
    [realtime],
  );

  // Stop watching driver
  const stopWatchingDriver = useCallback(() => {
    if (state.selectedDriverId) {
      realtime.unsubscribeFromDriver(state.selectedDriverId);
      setState((prev) => ({
        ...prev,
        selectedDriverId: null,
        driverLocation: null,
      }));
    }
  }, [realtime, state.selectedDriverId]);

  // Subscribe to ride updates
  useEffect(() => {
    const handleRideUpdate = (update: LiveRideUpdate) => {
      setState((prev) => ({ ...prev, rideStatus: update }));
    };

    realtime.subscribeToRideUpdates(handleRideUpdate);

    return () => {
      realtime.unsubscribeFromRideUpdates(handleRideUpdate);
    };
  }, [realtime]);

  // Set user's current location
  const setUserLocation = useCallback(async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    setState((prev) => ({
      ...prev,
      userLocation: {
        lat,
        lng,
        address: address?.display_name,
      },
    }));
  }, []);

  return {
    ...state,
    setPickupPoint,
    setDropPoint,
    searchPlace,
    watchDriver,
    stopWatchingDriver,
    setUserLocation,
  };
}
