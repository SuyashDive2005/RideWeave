import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useCallback, useState } from "react";
import L from "leaflet";
import { LocateFixed, Loader2 } from "lucide-react";
import { type MapCanvasProps } from "@/lib/map-config";
import { useGeolocation } from "@/hooks/use-geolocation";

type ClickHandler = (lat: number, lng: number) => void;

interface InteractiveMapCanvasProps extends MapCanvasProps {
  onMapClick?: ClickHandler;
  onPickupSet?: ClickHandler;
  onDropSet?: ClickHandler;
  pickupPoint?: [number, number] | null;
  dropPoint?: [number, number] | null;
  routeCoordinates?: Array<[number, number]> | null;
  driverLocation?: [number, number] | null;
  showPickupMarker?: boolean;
  showDropMarker?: boolean;
  autoZoom?: boolean;
}

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:30px;height:30px;border-radius:9999px;background:rgba(0,188,180,0.20);border:1px solid rgba(0,188,180,0.35);"></div>
      <div style="position:absolute;width:16px;height:16px;border-radius:9999px;background:#00bcb4;border:3px solid #ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.25);"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Component to handle map interactions
function MapInteraction({
  onMapClick,
  pickupPoint,
  dropPoint,
  routeCoordinates,
  driverLocation,
  userLocation,
  autoZoom,
}: {
  onMapClick?: ClickHandler;
  pickupPoint?: [number, number] | null;
  dropPoint?: [number, number] | null;
  routeCoordinates?: Array<[number, number]> | null;
  driverLocation?: [number, number] | null;
  userLocation?: [number, number] | null;
  autoZoom?: boolean;
}) {
  const map = useMap();

  const handleClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    [onMapClick],
  );

  // Auto-zoom to user's current location only
  useEffect(() => {
    if (autoZoom && userLocation) {
      const maxZoom = map.getMaxZoom();
      const targetZoom = Number.isFinite(maxZoom) ? Math.min(maxZoom, 19) : 19;

      map.flyTo(userLocation, targetZoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [map, pickupPoint, dropPoint, driverLocation, userLocation, autoZoom]);

  useEffect(() => {
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, handleClick]);

  return null;
}

function MapViewController({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      const maxZoom = map.getMaxZoom();
      const targetZoom = Number.isFinite(maxZoom) ? Math.min(maxZoom, 19) : 19;

      map.flyTo(center, targetZoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [map, center]);

  return null;
}

export const MapCanvas = (props: InteractiveMapCanvasProps) => {
  const {
    title = "Map",
    center = [17.385, 78.4856],
    zoom = 5,
    userLocation = null,
    onMapClick,
    pickupPoint = null,
    dropPoint = null,
    routeCoordinates = null,
    driverLocation = null,
    showPickupMarker = true,
    showDropMarker = true,
    autoZoom = true,
  } = props;

  const [localUserLocation, setLocalUserLocation] = useState<
    [number, number] | null
  >(userLocation);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    userLocation || center,
  );
  const {
    location: serviceLocation,
    loading: locating,
    error: locationError,
    requestLocation,
  } = useGeolocation();

  const effectiveUserLocation = localUserLocation || userLocation;

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setLocalUserLocation(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (serviceLocation) {
      setLocalUserLocation(serviceLocation);
      setMapCenter(serviceLocation);
    }
  }, [serviceLocation]);

  const handleLocateUser = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* Map container */}
      <div className="flex-1 w-full relative">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <MapViewController center={mapCenter} />

          <MapInteraction
            onMapClick={onMapClick}
            pickupPoint={pickupPoint}
            dropPoint={dropPoint}
            routeCoordinates={routeCoordinates}
            driverLocation={driverLocation}
            userLocation={effectiveUserLocation}
            autoZoom={autoZoom}
          />

          {/* OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User's current location marker */}
          {effectiveUserLocation && (
            <Marker position={effectiveUserLocation} icon={userLocationIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Click hint overlay */}
        {onMapClick && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-slate-700 dark:text-slate-200 z-10">
            Click on map to set location
          </div>
        )}

        <button
          type="button"
          onClick={handleLocateUser}
          disabled={locating}
          title="Locate me"
          className="absolute top-3 left-14 z-[1000] h-10 w-10 rounded-full bg-[#00bcb4] text-white shadow-xl border border-[#00bcb4] hover:bg-[#00a9a2] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LocateFixed className="h-5 w-5" />
          )}
        </button>

        {locationError && (
          <div className="absolute top-14 left-14 z-[1000] bg-red-500/90 text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-52">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
};
