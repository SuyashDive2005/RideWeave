import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Map,
  DollarSign,
  ShieldCheck,
  X,
  Navigation,
  Car,
  Plus,
  Minus,
  Calendar,
  ArrowRight,
  CheckCircle,
  SlidersHorizontal,
  Search,
} from "lucide-react";

interface Ride {
  id: string;
  driver: string;
  avatar: string;
  rating: number;
  reviews: number;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  totalSeats: number;
  fare: number;
  status: "active" | "completed" | "cancelled";
  vehicle: string;
  licensePlate: string;
  duration: string;
  distance: string;
}

const mockRides: Ride[] = [
  {
    id: "1",
    driver: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 4.8,
    reviews: 124,
    from: "Hinjewadi Phase 1",
    to: "Pune Railway Station",
    date: "Today",
    time: "7:30 AM",
    seats: 3,
    totalSeats: 4,
    fare: 150,
    status: "active",
    vehicle: "Hyundai i20",
    licensePlate: "MH12 AB 1234",
    duration: "45 min",
    distance: "18 km",
  },
  {
    id: "2",
    driver: "Rahul Desai",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4.9,
    reviews: 87,
    from: "Hinjewadi Phase 2",
    to: "Pune Railway Station",
    date: "Today",
    time: "7:45 AM",
    seats: 2,
    totalSeats: 3,
    fare: 130,
    status: "active",
    vehicle: "Maruti Swift",
    licensePlate: "MH12 CD 5678",
    duration: "50 min",
    distance: "19 km",
  },
  {
    id: "3",
    driver: "Sneha Kulkarni",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4.7,
    reviews: 203,
    from: "Hinjewadi Phase 3",
    to: "Shivajinagar",
    date: "Today",
    time: "8:00 AM",
    seats: 1,
    totalSeats: 4,
    fare: 120,
    status: "active",
    vehicle: "Tata Nexon",
    licensePlate: "MH12 EF 9012",
    duration: "55 min",
    distance: "22 km",
  },
  {
    id: "4",
    driver: "Amit Joshi",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5.0,
    reviews: 56,
    from: "Hinjewadi",
    to: "Kothrud",
    date: "Today",
    time: "8:15 AM",
    seats: 2,
    totalSeats: 3,
    fare: 180,
    status: "active",
    vehicle: "Toyota Fortuner",
    licensePlate: "MH12 GH 3456",
    duration: "40 min",
    distance: "15 km",
  },
  {
    id: "5",
    driver: "Meera Patil",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4.6,
    reviews: 41,
    from: "Hinjewadi",
    to: "Viman Nagar",
    date: "Today",
    time: "8:30 AM",
    seats: 3,
    totalSeats: 4,
    fare: 200,
    status: "active",
    vehicle: "Honda City",
    licensePlate: "MH12 IJ 7890",
    duration: "1 hr 10 min",
    distance: "28 km",
  },
  {
    id: "5",
    driver: "Meera Patil",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4.6,
    reviews: 41,
    from: "Hinjewadi",
    to: "Viman Nagar",
    date: "Today",
    time: "8:30 AM",
    seats: 3,
    totalSeats: 4,
    fare: 200,
    status: "active",
    vehicle: "Honda City",
    licensePlate: "MH12 IJ 7890",
    duration: "1 hr 10 min",
    distance: "28 km",
  },
];

const SeatDots = ({
  total,
  available,
}: {
  total: number;
  available: number;
}) => (
  <div className="flex gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < available ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"
        }`}
      />
    ))}
  </div>
);

// Extracted ride card component for reuse in both desktop sidebar and mobile sheet
function RideCard({
  ride,
  idx,
  selectedRide,
  onSelect,
}: {
  ride: Ride;
  idx: number;
  selectedRide?: Ride | null;
  onSelect?: () => void;
}) {
  return (
    <motion.div
      key={ride.id}
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ delay: idx * 0.04 }}
      onClick={onSelect}
      className={`rounded-2xl p-4 cursor-pointer border transition-all ${
        selectedRide?.id === ride.id
          ? "bg-[var(--brand-2-soft)] border-[var(--brand-2)] shadow-md shadow-[var(--brand-2-soft)]"
          : "bg-[var(--background)] border-[var(--nav-border)] hover:border-[var(--brand-2)] hover:shadow-sm"
      }`}
    >
      {/* Driver row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={ride.avatar}
            alt={ride.driver}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate text-[var(--nav-text)]">
            {ride.driver}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-[var(--nav-text)]">
              {ride.rating}
            </span>
            <span className="text-xs text-[var(--nav-muted)]">
              · {ride.reviews}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-black text-[var(--brand-2)] dark:drop-shadow-[var(--brand-2)]">
            ₹{ride.fare}
          </p>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-[var(--nav-text)]">
            {ride.from}
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-[var(--nav-muted)]" />
        <div className="flex-1 min-w-0 text-right">
          <p className="font-semibold truncate text-[var(--nav-text)]">
            {ride.to}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[var(--nav-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            {ride.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            {ride.seats} seats
          </span>
        </div>
        <SeatDots total={ride.totalSeats} available={ride.seats} />
      </div>
    </motion.div>
  );
}

export default function Rides() {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookingStep, setBookingStep] = useState<
    "detail" | "confirm" | "booked"
  >("detail");
  const [seats, setSeats] = useState(1);
  const [offerSeats, setOfferSeats] = useState("1");
  const [offerVehicleType, setOfferVehicleType] = useState("");
  const [offerVehicleName, setOfferVehicleName] = useState("");
  const [offerLicensePlate, setOfferLicensePlate] = useState("");
  const [offerFare, setOfferFare] = useState("");
  const [offerDistance, setOfferDistance] = useState("");
  const [publishedRides, setPublishedRides] = useState<Ride[]>([]);

  const [filterActive, setFilterActive] = useState(true);
  const [showRidesList, setShowRidesList] = useState(false);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "publish" | "my-rides">(
    "browse",
  );
  const [searchSource, setSearchSource] = useState("");
  const [searchDestination, setSearchDestination] = useState("");

  const handlePublish = () => {
    if (
      !offerVehicleType ||
      !offerVehicleName ||
      !offerLicensePlate ||
      !offerFare
    )
      return;
    const newRide: Ride = {
      id: String(Date.now()),
      driver: "You",
      avatar: "https://i.pravatar.cc/150?img=15",
      rating: 5.0,
      reviews: 0,
      from: "Your Location",
      to: "Destination",
      date: new Date().toISOString().split("T")[0],
      time: "TBD",
      seats: parseInt(offerSeats),
      totalSeats: parseInt(offerSeats),
      fare: parseFloat(offerFare),
      status: "active",
      vehicle: offerVehicleName,
      licensePlate: offerLicensePlate,
      duration: "TBD",
      distance: offerDistance || "TBD",
    };
    setPublishedRides((prev) => [newRide, ...prev]);
    setOfferVehicleType("");
    setOfferVehicleName("");
    setOfferLicensePlate("");
    setOfferFare("");
    setOfferDistance("");
  };

  const allRides = [...publishedRides, ...mockRides];

  // Filter rides based on search and status
  const filteredRides = allRides.filter((ride) => {
    const matchesSource = ride.from
      .toLowerCase()
      .includes(searchSource.toLowerCase());
    const matchesDestination = ride.to
      .toLowerCase()
      .includes(searchDestination.toLowerCase());
    const matchesStatus = !filterActive || ride.status === "active";
    return matchesSource && matchesDestination && matchesStatus;
  });

  // Tabs configuration
  const tabs = [
    { id: "browse", label: "Browse Rides", icon: Map },
    { id: "publish", label: "Offer a Ride", icon: MapPin },
    {
      id: "my-rides",
      label: "My Rides",
      icon: CheckCircle,
      badge: publishedRides.length,
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-[var(--background)]">
      {/* Top Navigation with Tabs */}
      <div className="pt-8 pb-4 px-3 sm:px-6 flex items-start justify-start bg-[var(--background)]">
        <div className="flex items-center gap-1 rounded-2xl p-1 border ml-0 mr-auto bg-[var(--nav-surface)] border-[var(--nav-border)] shadow-[0_12px_30px_oklch(0_0_0_/_0.08)]">
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  activeTab === tab.id
                    ? "text-[var(--brand-2)] bg-[var(--brand-2-soft)] border-[var(--brand-2)]"
                    : "text-[var(--nav-muted)] bg-transparent border-transparent"
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-red-500">
                      {tab.badge}
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* === BROWSE RIDES TAB === */}
        {activeTab === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row w-full overflow-hidden lg:items-start"
          >
            {/* LEFT: Rides List - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:flex w-[420px] shrink-0 flex-col border-b lg:border-b-0 lg:border-r overflow-hidden bg-[var(--nav-surface)] border-[var(--nav-border)] lg:h-[640px]">
              {/* Header with Search */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--nav-border)]">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-1 text-[var(--nav-text)]">
                    Available Rides
                  </h3>
                  <p className="text-xs text-[var(--nav-muted)]">
                    {filteredRides.length} rides found
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl border text-sm bg-[var(--nav-input-bg)] border-[var(--nav-input-border)]">
                    <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      placeholder="From (source)"
                      value={searchSource}
                      onChange={(e) => setSearchSource(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[var(--nav-text)] placeholder-[var(--nav-muted)]"
                      title="Search by source location"
                    />
                  </div>
                  <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl border text-sm bg-[var(--nav-input-bg)] border-[var(--nav-input-border)]">
                    <Navigation className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      placeholder="To (destination)"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[var(--nav-text)] placeholder-[var(--nav-muted)]"
                      title="Search by destination location"
                    />
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="px-6 py-3 flex items-center gap-2 border-b border-[var(--nav-border)]">
                <button
                  onClick={() => setFilterActive(!filterActive)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all border-[var(--nav-border)] ${
                    filterActive
                      ? "bg-[var(--brand-2-soft)] text-[var(--brand-2)]"
                      : "bg-[var(--nav-input-bg)] text-[var(--nav-muted)]"
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3 inline mr-1" />
                  Active Only
                </button>
              </div>

              {/* Desktop Rides List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 rides-scrollbar flex flex-col gap-3">
                {filteredRides.length > 0 ? (
                  filteredRides.map((ride, idx) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      idx={idx}
                      selectedRide={selectedRide}
                      onSelect={() => {
                        setSelectedRide(ride);
                        setBookingStep("detail");
                        setSeats(1);
                      }}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--nav-muted)]">
                    <p className="text-sm">No rides found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Rides bottom sheet modal */}
            <AnimatePresence>
              {showRidesList && (
                <motion.div
                  key="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowRidesList(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showRidesList && (
                <motion.div
                  key="rides-sheet"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 lg:hidden max-h-[85vh] bg-[var(--nav-surface)] border-t border-[var(--nav-border)] rounded-t-3xl shadow-2xl z-50"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-[var(--nav-surface)] border-b border-[var(--nav-border)] px-6 py-4 rounded-t-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--nav-text)]">
                          Available Rides
                        </h3>
                        <p className="text-xs text-[var(--nav-muted)]">
                          {filteredRides.length} rides found
                        </p>
                      </div>
                      <button
                        onClick={() => setShowRidesList(false)}
                        className="p-2 hover:bg-[var(--brand-2-soft)] rounded-lg transition-colors"
                        title="Close rides list"
                      >
                        <X className="w-5 h-5 text-[var(--nav-text)]" />
                      </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl border text-sm bg-[var(--nav-input-bg)] border-[var(--nav-input-border)]">
                        <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <input
                          type="text"
                          placeholder="From (source)"
                          value={searchSource}
                          onChange={(e) => setSearchSource(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-[var(--nav-text)] placeholder-[var(--nav-muted)]"
                          title="Search by source location"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl border text-sm bg-[var(--nav-input-bg)] border-[var(--nav-input-border)]">
                        <Navigation className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <input
                          type="text"
                          placeholder="To (destination)"
                          value={searchDestination}
                          onChange={(e) => setSearchDestination(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-[var(--nav-text)] placeholder-[var(--nav-muted)]"
                          title="Search by destination location"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scrollable rides list */}
                  <div className="overflow-y-auto max-h-[calc(85vh-60px)] scrollbar-hide">
                    <motion.div
                      className="px-4 py-4 space-y-3"
                      initial="hidden"
                      animate="show"
                      variants={{
                        show: {
                          transition: {
                            staggerChildren: 0.03,
                          },
                        },
                      }}
                    >
                      {filteredRides.length > 0 ? (
                        filteredRides.map((ride, idx) => (
                          <RideCard
                            key={ride.id}
                            ride={ride}
                            idx={idx}
                            selectedRide={selectedRide}
                            onSelect={() => {
                              setSelectedRide(ride);
                              setBookingStep("detail");
                              setSeats(1);
                              setShowRidesList(false);
                            }}
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 text-[var(--nav-muted)]">
                          <p className="text-sm">No rides found</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CENTER: Map - Always visible on desktop */}
            <div className="hidden lg:flex flex-1 h-[640px] flex-col relative overflow-hidden rounded-2xl border-2 m-4 border-[var(--brand-2)] bg-white dark:bg-slate-900">
              {/* Map placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-50 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600">
                {/* Grid lines for map feel */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Fake road lines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 100 600 Q 300 400 500 300 Q 700 200 900 150"
                    stroke="white"
                    className="dark:stroke-slate-400"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 100 600 Q 300 400 500 300 Q 700 200 900 150"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-600"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 350 Q 200 340 400 360 Q 600 380 800 400 Q 900 410 1100 380"
                    stroke="white"
                    className="dark:stroke-slate-400"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 350 Q 200 340 400 360 Q 600 380 800 400 Q 900 410 1100 380"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-600"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 200 0 Q 250 200 300 400 Q 350 500 400 700"
                    stroke="white"
                    className="dark:stroke-slate-400"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 200 0 Q 250 200 300 400 Q 350 500 400 700"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-600"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Route path (highlighted) */}
                {selectedRide && (
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 180 550 Q 350 380 520 280 Q 680 200 840 160"
                      stroke="#3b82f6"
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray="12,6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* Pin markers */}
                <div className="absolute left-[17%] top-[72%]">
                  <div className="relative">
                    <div className="w-8 h-8 bg-[var(--brand-2)] rounded-full flex items-center justify-center shadow-[var(--brand-2-soft)] ring-4 ring-white">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full text-white bg-[var(--brand-2)]">
                      Hinjewadi
                    </div>
                  </div>
                </div>

                <div className="absolute right-[20%] top-[22%]">
                  <div className="relative">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-300 ring-4 ring-white">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full text-white bg-emerald-600">
                      Pune Station
                    </div>
                  </div>
                </div>

                {/* Floating car icons for active rides */}
                {[
                  { left: "30%", top: "58%", rot: "-30deg" },
                  { left: "50%", top: "42%", rot: "-40deg" },
                  { left: "65%", top: "35%", rot: "-35deg" },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: pos.left, top: pos.top }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      delay: i * 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-[var(--brand-2-soft)]">
                      <Car className="w-4 h-4 text-[var(--brand-2)]" />
                    </div>
                  </motion.div>
                ))}

                {/* Center "Set on Map" badge if no ride selected */}
                {!selectedRide && (
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 border border-white dark:bg-slate-700/90 dark:border-slate-600">
                    <Navigation className="w-8 h-8 text-[var(--brand-2)]" />
                    <p className="font-semibold text-slate-700 text-sm dark:text-slate-100">
                      Select a ride to view route
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-300">
                      or click to set a pickup point
                    </p>
                  </div>
                )}
              </div>

              {/* Map top controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2">
                  <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-md flex items-center gap-2 text-xs font-medium text-slate-600 border border-white dark:bg-slate-700/90 dark:text-slate-200 dark:border-slate-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live · {mockRides.length} active rides
                  </div>
                </div>
                {selectedRide && (
                  <div className="pointer-events-auto bg-[var(--brand-2)] text-white rounded-xl px-4 py-2 shadow-md text-xs font-semibold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedRide.duration} · {selectedRide.distance}
                  </div>
                )}
              </div>

              {/* Mobile floating "Browse Rides" button */}
              <motion.button
                onClick={() => setShowRidesList(true)}
                className="absolute bottom-4 right-4 pointer-events-auto lg:hidden bg-[var(--brand-2)] hover:bg-[var(--brand-2)]/90 text-white rounded-full shadow-lg p-3 flex items-center gap-2 font-medium text-sm transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4 text-white" />
                Browse Rides
              </motion.button>
            </div>

            {/* Mobile: Toggleable Map */}
            <AnimatePresence>
              {showMapOnMobile && (
                <motion.div
                  key="mobile-map"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="lg:hidden px-4 pb-4"
                >
                  <div className="w-full h-64 sm:h-80 rounded-2xl border-2 border-[var(--brand-2)] overflow-hidden relative bg-white dark:bg-slate-900">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-50 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600">
                      {selectedRide && (
                        <svg className="absolute inset-0 w-full h-full">
                          <path
                            d="M 180 550 Q 350 380 520 280 Q 680 200 840 160"
                            stroke="#3b82f6"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray="12,6"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {!selectedRide && (
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 border border-white dark:bg-slate-700/90 dark:border-slate-600">
                          <Navigation className="w-8 h-8 text-[var(--brand-2)]" />
                          <p className="font-semibold text-slate-700 text-sm dark:text-slate-100">
                            Select a ride to view route
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile inline rides list */}
            <div className="lg:hidden px-4 pb-6">
              <div className="rounded-2xl border bg-[var(--nav-surface)] border-[var(--nav-border)]">
                <div className="px-4 py-4 border-b border-[var(--nav-border)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--nav-text)]">
                        Available Rides
                      </h3>
                      <p className="text-xs text-[var(--nav-muted)]">
                        {
                          allRides.filter(
                            (r) => !filterActive || r.status === "active",
                          ).length
                        }{" "}
                        rides near you
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowMapOnMobile(!showMapOnMobile)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg text-xs font-medium transition-all border bg-[var(--nav-input-bg)] border-[var(--nav-border)] hover:bg-[var(--brand-2-soft)] text-[var(--nav-muted)] hover:text-[var(--brand-2)]"
                      title="Toggle map"
                    >
                      {showMapOnMobile ? (
                        <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      ) : (
                        <Map className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      )}
                    </motion.button>
                    <button
                      onClick={() => setFilterActive(!filterActive)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all border-[var(--nav-border)] ${
                        filterActive
                          ? "bg-[var(--brand-2-soft)] text-[var(--brand-2)]"
                          : "bg-[var(--nav-input-bg)] text-[var(--nav-muted)]"
                      }`}
                    >
                      <SlidersHorizontal className="w-3 h-3 inline mr-1" />
                      Active Only
                    </button>
                  </div>
                </div>

                <div
                  className={`overflow-y-auto px-4 py-4 rides-scrollbar flex flex-col gap-3 ${
                    showMapOnMobile ? "max-h-[240px]" : "max-h-[360px]"
                  }`}
                >
                  {filterActive
                    ? mockRides
                        .filter((ride) => ride.status === "active")
                        .map((ride, idx) => (
                          <RideCard
                            key={ride.id}
                            ride={ride}
                            idx={idx}
                            selectedRide={selectedRide}
                            onSelect={() => {
                              setSelectedRide(ride);
                              setBookingStep("detail");
                              setSeats(1);
                            }}
                          />
                        ))
                    : mockRides.map((ride, idx) => (
                        <RideCard
                          key={ride.id}
                          ride={ride}
                          idx={idx}
                          selectedRide={selectedRide}
                          onSelect={() => {
                            setSelectedRide(ride);
                            setBookingStep("detail");
                            setSeats(1);
                          }}
                        />
                      ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* === PUBLISH RIDE TAB === */}
        {activeTab === "publish" && (
          <motion.div
            key="publish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div className="max-w-2xl mx-auto px-6 py-8">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-2-soft)]">
                    <MapPin className="w-6 h-6 text-[var(--brand-2)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--nav-text)]">
                      Publish a Ride
                    </h2>
                    <p className="text-sm text-[var(--nav-muted)]">
                      Earn money by offering spare seats on your journey
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Form Card */}
              <div className="rounded-3xl p-8 border bg-[var(--nav-surface)] border-[var(--nav-border)]">
                <div className="space-y-6">
                  {/* Vehicle Type */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <Car className="inline w-4 h-4 mr-2" />
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sedan, SUV, Hatchback"
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerVehicleType}
                      onChange={(e) => setOfferVehicleType(e.target.value)}
                    />
                  </div>

                  {/* Vehicle Name */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <Car className="inline w-4 h-4 mr-2" />
                      Vehicle Name/Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maruti Swift, Honda City"
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerVehicleName}
                      onChange={(e) => setOfferVehicleName(e.target.value)}
                    />
                  </div>

                  {/* License Plate */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <Car className="inline w-4 h-4 mr-2" />
                      License Plate Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MH12 AB 1234"
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerLicensePlate}
                      onChange={(e) => setOfferLicensePlate(e.target.value)}
                    />
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <Users className="inline w-4 h-4 mr-2" />
                      Available Seats
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerSeats}
                      onChange={(e) => setOfferSeats(e.target.value)}
                      title="Select number of available seats"
                    >
                      {[1, 2].map((n) => (
                        <option key={n} value={n}>
                          {n} seat{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Fare */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <DollarSign className="inline w-4 h-4 mr-2" />
                      Total Ride Fare (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 300"
                      min="0"
                      step="10"
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerFare}
                      onChange={(e) => setOfferFare(e.target.value)}
                    />
                    <p className="text-xs text-[var(--nav-muted)] mt-2">
                      💡 The total fare for the entire ride to be distributed
                      among riders.
                    </p>
                  </div>

                  {/* Distance */}
                  <div>
                    <label className="text-sm font-semibold block mb-3 text-[var(--nav-text)]">
                      <Navigation className="inline w-4 h-4 mr-2" />
                      Estimated Distance (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18 km"
                      className="w-full px-4 py-3 rounded-2xl border outline-none bg-[var(--nav-input-bg)] border-[var(--nav-input-border)] text-[var(--nav-text)] input-glow"
                      value={offerDistance}
                      onChange={(e) => setOfferDistance(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePublish}
                    disabled={
                      !offerVehicleType ||
                      !offerVehicleName ||
                      !offerLicensePlate ||
                      !offerFare
                    }
                    className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--brand-2)]"
                  >
                    <Plus className="inline w-5 h-5 mr-2" />
                    Publish Ride
                  </motion.button>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: DollarSign,
                    title: "Earn Money",
                    desc: "Get paid for each seat",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Safe & Verified",
                    desc: "All passengers verified",
                  },
                  {
                    icon: Star,
                    title: "Build Rating",
                    desc: "Grow your reputation",
                  },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-2xl p-6 border text-center bg-[var(--nav-surface)] border-[var(--nav-border)]"
                  >
                    <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[var(--brand-2-soft)]">
                      <benefit.icon className="w-5 h-5 text-[var(--brand-2)]" />
                    </div>
                    <p className="font-semibold text-sm text-[var(--nav-text)]">
                      {benefit.title}
                    </p>
                    <p className="text-xs mt-2 text-[var(--nav-muted)]">
                      {benefit.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* === MY RIDES TAB === */}
        {activeTab === "my-rides" && (
          <motion.div
            key="my-rides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-2-soft)]">
                    <CheckCircle className="w-6 h-6 text-[var(--brand-2)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--nav-text)]">
                      Your Published Rides
                    </h2>
                    <p className="text-sm text-[var(--nav-muted)]">
                      Manage and track your active rides
                    </p>
                  </div>
                </div>
              </div>

              {publishedRides.length === 0 ? (
                // Empty State
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border-2 border-dashed p-16 text-center border-[var(--nav-border)] bg-gradient-to-b from-[var(--nav-surface)] to-[var(--background)]"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--brand-2-soft)]">
                    <Car className="w-8 h-8 text-[var(--brand-2)]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-[var(--nav-text)]">
                    No published rides yet
                  </h3>
                  <p className="text-sm mb-8 text-[var(--nav-muted)] max-w-md mx-auto">
                    Turn your daily commute into extra income. Share your
                    journey and earn instantly.
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                    {[
                      { icon: DollarSign, text: "Earn ₹50-200 per seat" },
                      { icon: ShieldCheck, text: "Safe & verified riders" },
                      { icon: Star, text: "Build your ratings" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[var(--background)] border border-[var(--nav-border)]"
                      >
                        <item.icon className="w-5 h-5 text-[var(--brand-2)] mx-auto mb-2" />
                        <p className="text-xs font-medium text-[var(--nav-text)]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("publish")}
                    className="px-8 py-3 rounded-2xl text-white font-bold inline-block bg-[var(--brand-2)]"
                  >
                    <Plus className="inline w-5 h-5 mr-2" />
                    Publish Your First Ride
                  </motion.button>
                </motion.div>
              ) : (
                // Published Rides Grid
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedRides.map((ride, idx) => (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-2xl p-6 border overflow-hidden group bg-[var(--nav-surface)] border-emerald-200"
                    >
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-semibold text-[var(--nav-text)]">
                            Active
                          </span>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--brand-2-soft)] text-[var(--brand-2)]">
                          ₹{ride.fare}/seat
                        </span>
                      </div>

                      {/* Route */}
                      <div className="mb-4">
                        <p className="text-sm font-bold mb-1 text-[var(--nav-text)]">
                          {ride.from}
                        </p>
                        <div className="flex items-center gap-2 mb-1 text-xs text-[var(--nav-muted)]">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                          <span>{ride.distance}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                          <span>{ride.duration}</span>
                        </div>
                        <p className="text-sm font-bold text-[var(--nav-text)]">
                          {ride.to}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { icon: Calendar, label: ride.date },
                          { icon: Clock, label: ride.time },
                          { icon: Users, label: `${ride.seats} seats` },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="rounded-lg p-2 text-center text-xs bg-[var(--background)]"
                          >
                            <item.icon className="w-4 h-4 mx-auto mb-1 text-[var(--brand-2)]" />
                            <p className="font-semibold text-[var(--nav-text)]">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all border-[var(--nav-border)] text-[var(--nav-text)]">
                          View Details
                        </button>
                        <button className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-red-500">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedRide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRide(null)}
              className="fixed inset-0 z-40 bg-[var(--nav-bg)] opacity-20"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%", x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: "100%", x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:right-6 lg:left-auto lg:top-1/2 lg:-translate-y-1/2 z-50 w-full lg:w-[520px] max-h-[85vh] lg:max-h-[auto] overflow-y-auto shadow-2xl bg-[var(--nav-surface)] rounded-t-3xl lg:rounded-3xl border-t lg:border border-[var(--nav-border)]"
            >
              <div className="p-5">
                {/* Header - Compact */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <img
                        src={selectedRide.avatar}
                        alt={selectedRide.driver}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--brand-2-soft)]"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-[var(--nav-text)]">
                          {selectedRide.driver}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-[var(--nav-text)]">
                          {selectedRide.rating}
                        </span>
                        <span className="text-xs text-[var(--nav-muted)]">
                          ({selectedRide.reviews} trips)
                        </span>
                      </div>
                      <p className="text-xs text-[var(--nav-muted)]">
                        {selectedRide.vehicle} • {selectedRide.licensePlate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRide(null)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                    title="Close booking"
                  >
                    <X className="w-3.5 h-3.5 text-[var(--nav-text)] dark:hover:text-black" />
                  </button>
                </div>

                {/* Route */}
                <div className="mb-4 p-3 rounded-2xl bg-[var(--background)] border border-[var(--nav-border)]">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[var(--brand-2)]" />
                      <div className="w-0.5 h-8 bg-[var(--nav-border)] my-1" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--nav-muted)] mb-1">
                        PICKUP
                      </p>
                      <p className="text-sm font-bold text-[var(--nav-text)] truncate">
                        {selectedRide.from}
                      </p>
                      <p className="text-xs text-[var(--nav-muted)] mt-2 mb-1">
                        DROP
                      </p>
                      <p className="text-sm font-bold text-[var(--nav-text)] truncate">
                        {selectedRide.to}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time, Duration, Distance */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-lg p-3 bg-[var(--background)] border border-[var(--nav-border)] text-center">
                    <p className="text-[10px] font-semibold text-[var(--nav-muted)] uppercase mb-1">
                      Departure
                    </p>
                    <p className="text-xs font-bold text-[var(--nav-text)]">
                      {selectedRide.time}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 bg-[var(--background)] border border-[var(--nav-border)] text-center">
                    <p className="text-[10px] font-semibold text-[var(--nav-muted)] uppercase mb-1">
                      Duration
                    </p>
                    <p className="text-xs font-bold text-[var(--nav-text)]">
                      {selectedRide.duration}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 bg-[var(--background)] border border-[var(--nav-border)] text-center">
                    <p className="text-[10px] font-semibold text-[var(--nav-muted)] uppercase mb-1">
                      Distance
                    </p>
                    <p className="text-xs font-bold text-[var(--nav-text)]">
                      {selectedRide.distance}
                    </p>
                  </div>
                </div>

                {/* Available Seats */}
                <div className="rounded-xl p-3 mb-4 bg-[var(--background)] border border-[var(--nav-border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--nav-muted)]">
                        Available Seating
                      </p>
                      <p className="text-xs text-[var(--nav-muted)] mt-0.5">
                        {selectedRide.seats} of {selectedRide.totalSeats} seats
                        open
                      </p>
                    </div>
                    <SeatDots
                      total={selectedRide.totalSeats}
                      available={selectedRide.seats}
                    />
                  </div>
                </div>

                {/* Passengers & Departures */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl p-3 bg-[var(--background)] border border-[var(--nav-border)]">
                    <p className="text-[10px] font-semibold text-[var(--nav-muted)] uppercase mb-2">
                      Passengers
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSeats(Math.max(1, seats - 1))}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-slate-100 transition-colors border-[var(--nav-border)]"
                        title="Decrease passengers"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-bold text-sm text-[var(--nav-text)]">
                        {seats}
                      </span>
                      <button
                        onClick={() =>
                          setSeats(Math.min(selectedRide.seats, seats + 1))
                        }
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-slate-100 transition-colors border-[var(--nav-border)]"
                        title="Increase passengers"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl p-3 bg-[var(--background)] border border-[var(--nav-border)]">
                    <p className="text-[10px] font-semibold text-[var(--nav-muted)] uppercase mb-2">
                      Departures
                    </p>
                    <p className="text-xs font-bold text-[var(--nav-text)]">
                      {selectedRide.seats} of 4 seats open
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="rounded-2xl p-4 mb-6 border bg-[var(--brand-2-soft)] border-[var(--brand-2)]">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-[var(--brand-2)]">
                      ₹{selectedRide.fare} × {seats} seat{seats > 1 ? "s" : ""}
                    </p>
                    <p className="font-bold text-lg text-[var(--brand-2)]">
                      ₹{selectedRide.fare * seats}
                    </p>
                  </div>
                  <p className="text-[10px] text-[var(--brand-2)]">
                    No hidden charges · Paid to driver
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {bookingStep === "detail" && (
                    <motion.button
                      key="book"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBookingStep("confirm")}
                      className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg bg-[var(--brand-2)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-2)]/50"
                    >
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        Book {seats} Seat{seats > 1 ? "s" : ""} · ₹
                        {selectedRide.fare * seats}
                      </motion.div>
                    </motion.button>
                  )}

                  {bookingStep === "confirm" && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-3"
                    >
                      <p className="text-center text-sm font-semibold text-[var(--nav-text)]">
                        Confirm your booking?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setBookingStep("detail")}
                          className="flex-1 py-3 rounded-2xl border font-semibold text-sm border-[var(--nav-border)] text-[var(--nav-text)]"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setBookingStep("booked")}
                          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm bg-emerald-500"
                        >
                          Confirm Booking
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === "booked" && (
                    <motion.div
                      key="booked"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      </motion.div>
                      <p className="font-bold text-xl text-[var(--nav-text)]">
                        Ride Confirmed!
                      </p>
                      <p className="text-sm mt-2 mb-6 text-[var(--nav-muted)]">
                        {selectedRide.driver} will pick you up at <br />
                        <span className="font-semibold text-[var(--nav-text)]">
                          {selectedRide.time}
                        </span>
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRide(null)}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--brand-2)]"
                      >
                        Done
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
