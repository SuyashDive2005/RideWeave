import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context";

export const useNavbar = () => {
  const [ridesDropdownOpen, setRidesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileRidesOpen, setMobileRidesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ridesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ridesRef.current && !ridesRef.current.contains(target)) {
        setRidesDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleRidesClick = () => {
    setRidesDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen((prev) => !prev);
    setRidesDropdownOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleSignOutClick = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleCreateRideClick = () => {
    navigate("/rides/create");
    setMobileMenuOpen(false);
  };

  const handleRidesNavClick = () => {
    if (loading) {
      return;
    }
    navigate(user ? "/rides" : "/login");
    setMobileMenuOpen(false);
  };

  const handleFindRideClick = () => {
    navigate("/rides/find");
    setMobileMenuOpen(false);
  };

  const handleRideStatusClick = () => {
    navigate("/rides/waiting");
    setMobileMenuOpen(false);
  };

  const handleRideHistoryClick = () => {
    navigate("/rides/history");
    setMobileMenuOpen(false);
  };

  const handleServiceToggleClick = () => {
    navigate("/service-toggle");
    setMobileMenuOpen(false);
  };

  const handleProviderDashboardClick = () => {
    navigate("/provider");
    setMobileMenuOpen(false);
  };

  const handleProfileClickNav = () => {
    navigate("/profile");
    setMobileMenuOpen(false);
  };

  const handleWalletClick = () => {
    navigate("/wallet");
    setMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    setMobileMenuOpen(false);
  };

  const handleSupportClick = () => {
    navigate("/support");
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();
    if (!query) {
      return;
    }
    navigate(`/rides?destination=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  const userInitial =
    user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U";

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return {
    // State
    ridesDropdownOpen,
    profileDropdownOpen,
    mobileMenuOpen,
    mobileRidesOpen,
    setMobileMenuOpen,
    setMobileRidesOpen,
    searchQuery,
    setSearchQuery,
    // Refs
    ridesRef,
    profileRef,
    // Auth/User
    user,
    loading,
    signOut,
    userInitial,
    userName,
    // Handlers
    handleRidesClick,
    handleProfileClick,
    handleHomeClick,
    handleSignInClick,
    handleSignOutClick,
    handleCreateRideClick,
    handleRidesNavClick,
    handleFindRideClick,
    handleRideStatusClick,
    handleRideHistoryClick,
    handleServiceToggleClick,
    handleProviderDashboardClick,
    handleProfileClickNav,
    handleWalletClick,
    handleSettingsClick,
    handleSupportClick,
    handleSearchSubmit,
  };
};
