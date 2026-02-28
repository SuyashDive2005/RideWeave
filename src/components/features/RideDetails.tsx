import { useState, useCallback } from "react";
import { Search, MapPin, Clock, Navigation } from "lucide-react";
import { forwardGeocode } from "@/services/geocoding.service";

interface RideDetailsProps {
  pickupAddress?: string;
  dropAddress?: string;
  distance?: string;
  duration?: string;
  onPickupSearch?: (lat: number, lng: number, address: string) => void;
  onDropSearch?: (lat: number, lng: number, address: string) => void;
}

export function RideDetails({
  pickupAddress = "Tap map to set pickup",
  dropAddress = "Tap map to set drop",
  distance,
  duration,
  onPickupSearch,
  onDropSearch,
}: RideDetailsProps) {
  const [pickupQuery, setPickupQuery] = useState("");
  const [dropQuery, setDropQuery] = useState("");
  const [pickupResults, setPickupResults] = useState<any[]>([]);
  const [dropResults, setDropResults] = useState<any[]>([]);
  const [showPickupResults, setShowPickupResults] = useState(false);
  const [showDropResults, setShowDropResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const handlePickupSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPickupResults([]);
      return;
    }

    setSearching(true);
    const results = await forwardGeocode(query);
    setPickupResults(results);
    setShowPickupResults(true);
    setSearching(false);
  }, []);

  const handleDropSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setDropResults([]);
      return;
    }

    setSearching(true);
    const results = await forwardGeocode(query);
    setDropResults(results);
    setShowDropResults(true);
    setSearching(false);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-4">
      {/* Pickup Location */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-500" />
          Pickup Location
        </label>
        <div className="relative">
          <div className="flex items-center gap-2 border rounded-xl px-4 py-3 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search pickup location..."
              value={pickupQuery}
              onChange={(e) => {
                setPickupQuery(e.target.value);
                handlePickupSearch(e.target.value);
              }}
              onFocus={() =>
                pickupResults.length > 0 && setShowPickupResults(true)
              }
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Pickup search results */}
          {showPickupResults && pickupResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
              {pickupResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPickupQuery(result.display_name);
                    setShowPickupResults(false);
                    onPickupSearch?.(
                      result.lat,
                      result.lng,
                      result.display_name,
                    );
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-600 border-b dark:border-slate-600 last:border-b-0 transition"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {result.display_name.split(",")[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {result.display_name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {pickupAddress}
        </p>
      </div>

      {/* Drop Location */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          Drop Location
        </label>
        <div className="relative">
          <div className="flex items-center gap-2 border rounded-xl px-4 py-3 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drop location..."
              value={dropQuery}
              onChange={(e) => {
                setDropQuery(e.target.value);
                handleDropSearch(e.target.value);
              }}
              onFocus={() => dropResults.length > 0 && setShowDropResults(true)}
              className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Drop search results */}
          {showDropResults && dropResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
              {dropResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDropQuery(result.display_name);
                    setShowDropResults(false);
                    onDropSearch?.(result.lat, result.lng, result.display_name);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-600 border-b dark:border-slate-600 last:border-b-0 transition"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {result.display_name.split(",")[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {result.display_name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {dropAddress}
        </p>
      </div>

      {/* Distance and ETA */}
      {distance && duration && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              Distance
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {distance}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ETA
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {duration}
            </p>
          </div>
        </div>
      )}

      {searching && (
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Searching...
          </p>
        </div>
      )}
    </div>
  );
}
