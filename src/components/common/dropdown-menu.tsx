import React from "react";
import { motion } from "framer-motion";

interface DropdownMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  position?: "left" | "right" | "auto";
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  position = "right",
  className = "",
}) => {
  const positionClass = position === "right" ? "right-0" : "left-0";

  return (
    <motion.div
      key="dropdown-menu"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute top-full ${positionClass} mt-2 w-56 bg-(--nav-surface) rounded-2xl shadow-(--nav-shadow) border border-(--nav-border) py-2 ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface DropdownItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  isDanger?: boolean;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  label,
  onClick,
  isDanger = false,
  className = "",
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 group ${
        isDanger
          ? "hover:bg-(--nav-danger-soft) transition-colors"
          : "hover:bg-(--nav-hover) transition-colors"
      } ${className}`}
    >
      {icon}
      <span
        className={`font-medium ${
          isDanger ? "text-(--nav-danger)" : "text-(--nav-text)"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
};

interface DropdownDividerProps {
  className?: string;
}

export const DropdownDivider: React.FC<DropdownDividerProps> = ({
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className={`border-t border-(--nav-border) my-2 ${className}`}
  />
);
