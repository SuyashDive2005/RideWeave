import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_MESSAGES, useRotatingMessage } from "@/hooks/auth.hooks";
import type { StatCardProps } from "./auth.types";

export const AuthHero: React.FC = () => {
  const { index, message } = useRotatingMessage(HERO_MESSAGES, 3600);

  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-(--auth-hero-bg) text-(--auth-hero-text) px-12 py-16">
      {/* Background Accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-(--auth-hero-accent-1) blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-(--auth-hero-accent-2) blur-3xl" />

      {/* Animated Path SVG */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <svg className="h-full w-full" viewBox="0 0 720 720" fill="none">
          <motion.path
            d="M60 640C160 520 210 520 300 420C390 320 420 220 520 180C600 150 660 170 700 210"
            stroke="var(--brand-2)"
            strokeWidth="2"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [120, 0] }}
            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Logo Area */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-(--brand-1-soft) flex items-center justify-center">
          <span className="text-lg font-semibold text-(--brand-2)">RW</span>
        </div>
        <p className="text-2xl font-semibold">RideWeave</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8 max-w-md">
        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            Everything about your ride stays in sync.
          </h1>
          <p className="mt-3 text-lg text-(--auth-hero-muted)">
            Dispatch, payments, and live routes update instantly.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="rounded-3xl border border-(--brand-1-soft-strong) bg-(--brand-1-soft) p-6 backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <p className="text-lg font-medium">{message}</p>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4">
          <StatCard value="12m" label="Pickup ETA now" />
          <StatCard value="42" label="Active rides" />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <motion.div
    className="rounded-2xl border border-(--brand-1-soft-strong) bg-(--brand-1-soft) p-5"
    whileHover={{ y: -4 }}
  >
    <p className="text-2xl font-semibold">{value}</p>
    <p className="mt-2 text-sm text-(--auth-hero-muted)">{label}</p>
  </motion.div>
);
