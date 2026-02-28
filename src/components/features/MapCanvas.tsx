import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useCallback, useState } from "react";
import L from "leaflet";
import { blueIcon, type MapCanvasProps } from "@/lib/map-config";
import { Locate } from "lucide-react";

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

// Create custom markers for pickup and drop points
const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

  // Auto-zoom to fit all points
  useEffect(() => {
    if (autoZoom && (pickupPoint || dropPoint || driverLocation)) {
      const bounds = L.latLngBounds([]);

      if (pickupPoint) bounds.extend(pickupPoint);
      if (dropPoint) bounds.extend(dropPoint);
      if (driverLocation) bounds.extend(driverLocation);
      if (userLocation) bounds.extend(userLocation);

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
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

// Component to capture map instance
function MapInstanceCapture({ setMapInstance }: { setMapInstance: (map: L.Map) => void }) {
  const map = useMap();
  
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  
  return null;
}

// Smooth animation for moving markers
function AnimatedMarker({
  position,
  icon,
  label,
}: {
  position: [number, number];
  icon: L.Icon;
  label?: string;
}) {
  const map = useMap();
  const markerRef = useCallback(
    (marker: any) => {
      if (marker) {
        marker.setLatLng(position);
      }
    },
    [position],
  );

  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      {label && <Popup>{label}</Popup>}
    </Marker>
  );
}

export const MapCanvas = (props: InteractiveMapCanvasProps) => {
  const {
    title = "Map",
    center = [17.385, 78.4856],
    zoom = 5,
    markers = [],
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

  const [mapCenter, setMapCenter] = useState<[number, number]>(
    userLocation || center,
  );
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isRecentering, setIsRecentering] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const handleRecenter = useCallback(() => {
    if (mapInstance && userLocation) {
      setIsRecentering(true);
      mapInstance.flyTo(userLocation, 15, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
      setTimeout(() => setIsRecentering(false), 1500);
    }
  }, [mapInstance, userLocation]);

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
          <MapInstanceCapture setMapInstance={setMapInstance} />
          <MapInteraction
            onMapClick={onMapClick}
            pickupPoint={pickupPoint}
            dropPoint={dropPoint}
            routeCoordinates={routeCoordinates}
            driverLocation={driverLocation}
            userLocation={userLocation}
            autoZoom={autoZoom}
          />

          {/* OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Route polyline */}
          {routeCoordinates && routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              color="#2563eb"
              weight={4}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}

          {/* User's current location marker */}
          {userLocation && (
            <Marker position={userLocation} icon={blueIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Pickup point marker */}
          {pickupPoint && showPickupMarker && (
            <Marker position={pickupPoint} icon={pickupIcon}>
              <Popup>Pickup Point</Popup>
            </Marker>
          )}

          {/* Drop point marker */}
          {dropPoint && showDropMarker && (
            <Marker position={dropPoint} icon={dropIcon}>
              <Popup>Drop Point</Popup>
            </Marker>
          )}

          {/* Driver location marker with smooth animation */}
          {driverLocation && (
            <AnimatedMarker
              position={driverLocation}
              icon={driverIcon}
              label="Your Driver"
            />
          )}

          {/* Additional ride markers */}
          {markers.map((marker, idx) => (
            <Marker key={idx} position={[marker.lat, marker.lng]}>
              {marker.label && <Popup>{marker.label}</Popup>}
            </Marker>
          ))}
        </MapContainer>

        {/* Recenter to user location button */}
        {userLocation && (
          <button
            onClick={handleRecenter}
            disabled={isRecentering}
            className="absolute bottom-6 right-4 z-[1000] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full shadow-lg p-3 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200 dark:border-slate-700"
            title="Go to my location"
            aria-label="Recenter map to my location"
          >
            <Locate 
              className={`w-6 h-6 ${isRecentering ? 'animate-spin text-blue-500' : ''}`}
              strokeWidth={2.5}
            />
          </button>
        )}

        {/* Click hint overlay */}
        {onMapClick && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-slate-700 dark:text-slate-200 z-10">
            Click on map to set location
          </div>
        )}
      </div>
    </div>
  );
};
