// OSRM API wrapper for routing and distance calculation
export interface RouteResult {
  distance: number; // meters
  duration: number; // seconds
  geometry: Array<[number, number]>; // [lng, lat] coordinates
}

export interface RouteInfo {
  distance: string; // formatted distance
  duration: string; // formatted duration/ETA
  durationSeconds: number;
  coordinates: Array<[number, number]>;
}

export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): Promise<RouteInfo | null> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`,
    );
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMinutes = Math.ceil(route.duration / 60);

      return {
        distance: `${distanceKm} km`,
        duration: `${durationMinutes} min`,
        durationSeconds: route.duration,
        coordinates: route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]], // Convert [lng, lat] to [lat, lng]
        ),
      };
    }
    return null;
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
}

export async function calculateDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): Promise<number | null> {
  const route = await getRoute(startLat, startLng, endLat, endLng);
  return route ? route.durationSeconds : null;
}

export function formatETA(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 1) return "< 1 min";
  return `${minutes} min`;
}

export function formatDistance(meters: number): string {
  if (meters > 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}
