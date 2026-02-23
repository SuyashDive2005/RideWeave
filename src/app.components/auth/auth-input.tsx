import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AuthInputProps } from "@/app.components/auth/auth.types";

export const AuthInput: React.FC<AuthInputProps> = ({ label, ...props }) => {
  const isPasswordField = props.type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : props.type;

  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-(--auth-text)"
        htmlFor={props.id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className="h-11 w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) px-4 text-sm text-(--auth-input-text) placeholder:text-(--auth-input-placeholder) shadow-sm focus:outline-none focus:ring-2 focus:ring-(--auth-ring) transition-all pr-12"
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--auth-muted) hover:text-(--auth-text) transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
