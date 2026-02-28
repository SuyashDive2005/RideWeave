import { Car, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface DriverTrackingProps {
  driverName?: string;
  driverAvatar?: string;
  rating?: number;
  reviews?: number;
  vehicleName?: string;
  licensePlate?: string;
  currentAddress?: string;
  eta?: string;
  distance?: string;
  status?: "arriving" | "in_ride" | "completed";
  onCancel?: () => void;
}

export function DriverTracking({
  driverName = "Driver",
  driverAvatar,
  rating = 5.0,
  reviews = 0,
  vehicleName,
  licensePlate,
  currentAddress,
  eta,
  distance,
  status = "arriving",
  onCancel,
}: DriverTrackingProps) {
  const statusConfig = {
    arriving: {
      label: "Driver is arriving",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      icon: Car,
    },
    in_ride: {
      label: "Ride in progress",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      icon: CheckCircle,
    },
    completed: {
      label: "Ride completed",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-4"
    >
      {/* Status badge */}
      <div
        className={`${config.bgColor} rounded-lg px-4 py-2 flex items-center gap-2`}
      >
        <StatusIcon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Driver info */}
      <div className="flex items-center gap-4">
        {driverAvatar ? (
          <img
            src={driverAvatar}
            alt={driverName}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
            <Car className="w-8 h-8 text-slate-400" />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {driverName}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {rating.toFixed(1)} ★
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      {vehicleName && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Vehicle:</span> {vehicleName}
          </p>
          {licensePlate && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">License:</span>{" "}
              <code className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded font-mono text-xs">
                {licensePlate}
              </code>
            </p>
          )}
        </div>
      )}

      {/* Current location */}
      {currentAddress && (
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Current Location
            </p>
            <p className="text-sm text-slate-900 dark:text-white font-medium line-clamp-2">
              {currentAddress}
            </p>
          </div>
        </div>
      )}

      {/* ETA and Distance */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
        {eta && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ETA
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {eta}
            </p>
          </div>
        )}
        {distance && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Distance
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {distance}
            </p>
          </div>
        )}
      </div>

      {/* Cancel button */}
      {status !== "completed" && onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-4 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          Cancel Ride
        </button>
      )}
    </motion.div>
  );
}
