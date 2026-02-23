import React from "react";
import {
  Home,
  Car,
  Search,
  ChevronDown,
  User,
  Wallet,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import {
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from "../common/dropdown-menu";
import { useNavbar } from "@/hooks/use-navbar";

const Navbar: React.FC = () => {
  const {
    profileDropdownOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    profileRef,
    user,
    loading,
    userInitial,
    userName,
    handleProfileClick,
    handleHomeClick,
    handleSignInClick,
    handleSignOutClick,
    handleCreateRideClick,
    handleProfileClickNav,
    handleWalletClick,
    handleSettingsClick,
    handleSupportClick,
  } = useNavbar();

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-7xl">
        <div className="bg-(--nav-bg) backdrop-blur-md shadow-(--nav-shadow) rounded-full px-4 sm:px-7 py-3 sm:py-4 border border-(--nav-border)">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Logo */}
            <div className="shrink-0">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleHomeClick}
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-9 h-9 sm:w-12 sm:h-12 object-contain"
                />
                <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-(--brand-1) via-(--brand-2) to-(--brand-3) bg-clip-text text-transparent">
                  RideWeave
                </span>
              </div>
            </div>

            {/* Search — hidden on mobile */}
            <div className="hidden md:flex grow max-w-md">
              <div className="grow max-w-md -ml-8 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-5 text-(--nav-muted)" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    className="w-full pl-10 pr-4 py-2.5 bg-(--nav-input-bg) border border-(--nav-input-border) text-(--nav-text) placeholder:text-(--nav-input-placeholder) rounded-full focus:outline-none focus:ring-2 focus:ring-(--nav-ring) focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {/* Home */}
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-(--nav-hover) transition-colors"
              >
                <Home className="w-5 h-5 text-(--nav-text)" />
                <span className="font-medium text-(--nav-text)">Home</span>
              </button>

              {/* Rides */}
              <button
                onClick={handleCreateRideClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-(--nav-hover) transition-colors"
              >
                <Car className="w-5 h-5 text-(--nav-text)" />
                <span className="font-medium text-(--nav-text)">Rides</span>
              </button>

              {/* Theme Toggler */}
              <AnimatedThemeToggler
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-(--nav-surface) border border-(--nav-border) text-(--brand-1) hover:bg-(--brand-2-soft) transition-colors [&_svg]:h-5 [&_svg]:w-5"
                aria-label="Toggle theme"
              />

              {/* Profile */}
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-5 h-5 border-2 border-(--nav-border) border-t-(--brand-2) rounded-full animate-spin"></div>
                  <span className="text-(--nav-muted)">Loading...</span>
                </div>
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full bg-(--nav-surface-muted) border border-(--nav-border) shadow-sm hover:bg-(--nav-surface) transition-colors"
                  >
                    <div className="w-8 h-8 bg-(--nav-surface) border border-(--nav-border) rounded-full flex items-center justify-center">
                      <span className="text-(--nav-text) text-sm font-semibold">
                        {userInitial}
                      </span>
                    </div>
                    <span className="font-medium text-(--nav-text)">
                      {userName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-(--nav-muted) transition-transform ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <DropdownMenu
                        isOpen={profileDropdownOpen}
                        position="right"
                      >
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.08,
                                delayChildren: 0.05,
                              },
                            },
                          }}
                        >
                          <DropdownItem
                            label="My Profile"
                            onClick={handleProfileClickNav}
                            icon={
                              <div className="w-8 h-8 bg-(--brand-1-soft) rounded-full flex items-center justify-center group-hover:bg-(--brand-1-soft-strong) transition-colors">
                                <User className="w-4 h-4 text-(--brand-1)" />
                              </div>
                            }
                          />
                          <DropdownItem
                            label="Wallet"
                            onClick={handleWalletClick}
                            icon={
                              <div className="w-8 h-8 bg-(--brand-2-soft) rounded-full flex items-center justify-center group-hover:bg-(--brand-2-soft-strong) transition-colors">
                                <Wallet className="w-4 h-4 text-(--brand-2)" />
                              </div>
                            }
                          />
                          <DropdownDivider />
                          <DropdownItem
                            label="Settings"
                            onClick={handleSettingsClick}
                            icon={
                              <div className="w-8 h-8 bg-(--nav-surface-muted) rounded-full flex items-center justify-center group-hover:bg-(--nav-surface-strong) transition-colors">
                                <svg
                                  className="w-4 h-4 text-(--nav-text)"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                            }
                          />
                          <DropdownItem
                            label="Help & Support"
                            onClick={handleSupportClick}
                            icon={
                              <div className="w-8 h-8 bg-(--nav-surface-muted) rounded-full flex items-center justify-center group-hover:bg-(--nav-surface-strong) transition-colors">
                                <svg
                                  className="w-4 h-4 text-(--nav-text)"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            }
                          />
                          <DropdownDivider />
                          <DropdownItem
                            label="Logout"
                            isDanger={true}
                            onClick={handleSignOutClick}
                            icon={
                              <div className="w-8 h-8 bg-(--nav-danger-soft) rounded-full flex items-center justify-center group-hover:bg-(--nav-danger-soft-strong) transition-colors">
                                <svg
                                  className="w-4 h-4 text-(--nav-danger)"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                              </div>
                            }
                          />
                        </motion.div>
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="flex items-center gap-2 px-4 py-2.5 bg-(--brand-warm) hover:bg-(--brand-warm-hover) text-white rounded-full transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Right: Theme + Hamburger */}
            <div className="flex md:hidden items-center gap-2 ml-auto">
              <AnimatedThemeToggler
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-(--nav-surface) border border-(--nav-border) text-(--brand-1) hover:bg-(--brand-2-soft) transition-colors [&_svg]:h-4 [&_svg]:w-4"
                aria-label="Toggle theme"
              />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-(--nav-surface) border border-(--nav-border) text-(--nav-text) hover:bg-(--nav-hover) transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-transparent md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: 16, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-25 right-8 z-50 w-11/12 max-w-md md:hidden"
            >
              <div className="bg-(--nav-bg) backdrop-blur-md border border-(--nav-border) rounded-3xl shadow-2xl overflow-hidden">
                {/* User info */}
                {!loading && user && (
                  <div className="px-5 pt-5 pb-4 border-b border-(--nav-border) flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-(--nav-surface) border-2 border-(--nav-border) rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-(--nav-text) text-2xl font-bold">
                        {userInitial}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-(--nav-text) text-lg leading-tight">
                        {userName}
                      </p>
                      <p className="text-(--nav-muted) text-sm mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                <div className="p-3 flex flex-col gap-1">
                  <button
                    onClick={handleHomeClick}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-(--nav-hover) transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-(--brand-1-soft) rounded-full flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4 text-(--brand-1)" />
                    </div>
                    <span className="font-medium text-(--nav-text)">Home</span>
                  </button>

                  {/* Rides */}
                  <button
                    onClick={handleCreateRideClick}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-(--nav-hover) transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-(--brand-2-soft) rounded-full flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4 text-(--brand-2)" />
                    </div>
                    <span className="font-medium text-(--nav-text)">Rides</span>
                  </button>

                  {/* Profile items */}
                  {!loading && user && (
                    <>
                      <div className="my-1 border-t border-(--nav-border)" />
                      {[
                        {
                          label: "My Profile",
                          Icon: User,
                          colorSoft: "--brand-1-soft",
                          color: "--brand-1",
                          onClick: handleProfileClickNav,
                        },
                        {
                          label: "Wallet",
                          Icon: Wallet,
                          colorSoft: "--brand-2-soft",
                          color: "--brand-2",
                          onClick: handleWalletClick,
                        },
                      ].map(({ label, Icon, colorSoft, color, onClick }) => (
                        <button
                          key={label}
                          onClick={onClick}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-(--nav-hover) transition-colors text-left"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: `var(${colorSoft})` }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: `var(${color})` }}
                            />
                          </div>
                          <span className="font-medium text-(--nav-text)">
                            {label}
                          </span>
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Settings & Help */}
                {!loading && user && (
                  <div className="p-3 flex flex-col gap-1 border-t border-(--nav-border)">
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-(--nav-hover) transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-(--nav-surface-muted) rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-(--nav-text)"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-(--nav-text)">
                        Settings
                      </span>
                    </button>
                    <button
                      onClick={handleSupportClick}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-(--nav-hover) transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-(--nav-surface-muted) rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-(--nav-text)"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-(--nav-text)">
                        Help & Support
                      </span>
                    </button>
                  </div>
                )}

                {/* Bottom action */}
                <div className="p-3 pt-0">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="w-4 h-4 border-2 border-(--nav-border) border-t-(--brand-2) rounded-full animate-spin" />
                      <span className="text-(--nav-muted) text-sm">
                        Loading...
                      </span>
                    </div>
                  ) : user ? (
                    <button
                      onClick={() => {
                        handleSignOutClick();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-(--nav-danger-soft) hover:bg-(--nav-danger-soft-strong) transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10">
                        <svg
                          className="w-4 h-4 text-(--nav-danger)"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-(--nav-danger)">
                        Logout
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSignInClick}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-(--brand-warm) hover:bg-(--brand-warm-hover) text-white rounded-2xl transition-colors font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
