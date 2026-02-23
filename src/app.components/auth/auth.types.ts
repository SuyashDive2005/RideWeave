import React from "react";

export interface AuthFormProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  message: string;
  onLogin: () => void;
  onSignUp: () => void;
  onGoogleLogin: () => void;
}

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface StatCardProps {
  value: string;
  label: string;
}
