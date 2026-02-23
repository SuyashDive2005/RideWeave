import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Car,
  MapPin,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleGetStartedClick = () => {
    if (loading) {
      return;
    }
    navigate(user ? "/rides" : "/login");
  };

  return (
    <div className="bg-(--background) dark:bg-(--home-dark-bg)">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen sm:h-screen sm:min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/road_photo_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            Share your journey, save your costs.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12"
          >
            The safest way for students to commute together
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-0"
          >
            <button
              onClick={() => navigate("/rides")}
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto bg-(--brand-2) text-white font-semibold rounded-full hover:bg-(--brand-1) transition-all shadow-lg hover:shadow-xl"
            >
              <Car className="w-5 h-5" />
              Book a Ride
            </button>
            <button
              onClick={() => navigate("/rides")}
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto bg-white/20 text-white font-semibold rounded-full border-2 border-white hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <Car className="w-5 h-5" />
              Offer a Ride
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex justify-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm text-white animate-bounce">
              <ChevronDown className="h-5 w-5" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 sm:py-16 md:py-20 bg-(--background) dark:bg-(--home-dark-bg)"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-(--nav-muted) text-base sm:text-lg mb-12 sm:mb-16">
            Simple steps from your home to destination
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Search Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-(--brand-2) flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-(--brand-2)" />
              </div>
              <h3 className="text-xl font-semibold text-(--nav-text) mb-2">
                Search
              </h3>
              <p className="text-(--nav-muted) text-sm sm:text-base">
                Find available rides near you
              </p>
            </motion.div>

            {/* Connect Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-(--brand-2) flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-(--brand-2)" />
              </div>
              <h3 className="text-xl font-semibold text-(--nav-text) mb-2">
                Connect
              </h3>
              <p className="text-(--nav-muted) text-sm sm:text-base">
                Meet and connect with riders
              </p>
            </motion.div>

            {/* Ride & Track Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-(--brand-2) flex items-center justify-center mb-6">
                <Car className="w-10 h-10 text-(--brand-2)" />
              </div>
              <h3 className="text-xl font-semibold text-(--nav-text) mb-2">
                Ride & Track
              </h3>
              <p className="text-(--nav-muted) text-sm sm:text-base">
                Enjoy safe rides with tracking
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How it Works & Why RideWeave Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 sm:py-16 md:py-20 bg-(--background) dark:bg-(--home-dark-bg)"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* How it Works - Left Column */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--nav-text) mb-6 sm:mb-8">
                How it Works
              </h2>

              {/* Recent Activity */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl sm:rounded-3xl bg-(--nav-surface) border border-(--nav-border) p-6 sm:p-8"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-(--nav-text) mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-(--nav-border)">
                    <div className="w-12 h-12 rounded-full bg-(--brand-2) flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-(--nav-text)">
                        Popular Route
                      </p>
                      <p className="text-sm text-(--nav-muted)">
                        Campus to Main Station
                      </p>
                      <p className="text-xs text-(--nav-muted) mt-1">
                        Started an hour ago
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/rides")}
                  className="mt-6 w-full py-2 border border-(--nav-border) rounded-lg text-(--nav-text) hover:bg-(--nav-hover) transition-colors font-semibold hover:border-(--brand-2) hover:text-(--brand-2)"
                >
                  View More
                </button>
              </motion.div>
            </div>

            {/* Why RideWeave - Right Column */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--nav-text) mb-6 sm:mb-8">
                Why RideWeave?
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Safety */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl sm:rounded-2xl bg-(--nav-surface) p-4 sm:p-6 border border-(--nav-border) hover:border-(--brand-2) transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-(--brand-2) flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-(--brand-2) mb-2">
                    Your Safety First
                  </h3>
                  <p className="text-xs sm:text-sm text-(--nav-muted)">
                    Verified riders and real-time tracking keep you safe on
                    every journey
                  </p>
                </motion.div>

                {/* Eco-Friendly */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl sm:rounded-2xl bg-(--nav-surface) p-4 sm:p-6 border border-(--nav-border) hover:border-(--brand-2) transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-(--brand-2) flex items-center justify-center mb-4">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-(--brand-2) mb-2">
                    Eco-Friendly Commute
                  </h3>
                  <p className="text-xs sm:text-sm text-(--nav-muted)">
                    Share rides and reduce carbon footprint while saving money
                  </p>
                </motion.div>

                {/* Community */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl sm:rounded-2xl bg-(--nav-surface) p-4 sm:p-6 border border-(--nav-border) hover:border-(--brand-2) transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-(--brand-2) flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-(--brand-2) mb-2">
                    Trust & Community
                  </h3>
                  <p className="text-xs sm:text-sm text-(--nav-muted)">
                    Join a community of trustworthy commuters making smart
                    travel choices
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 sm:py-16 md:py-20 text-center bg-(--background) dark:bg-(--home-dark-bg)"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--nav-text) mb-4 sm:mb-6">
            Ready to Start?
          </h2>
          <p className="text-(--nav-muted) text-base sm:text-lg mb-6 sm:mb-8">
            Join our community and save on your commute
          </p>
          <button
            onClick={handleGetStartedClick}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-(--brand-2) text-white font-semibold rounded-full hover:bg-(--brand-1) transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <Car className="w-5 h-5" />
            Get Started Now
          </button>
        </div>
      </motion.section>
    </div>
  );
}
