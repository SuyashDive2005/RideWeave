import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth.context";
import { authService } from "@/services/auth.service";
import { isValidEmail, getPasswordErrorMessage } from "@/utils/validation";
import { AuthHero } from "@/app.components/auth/auth-hero";
import { AuthForm } from "@/app.components/auth/auth-form";

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    // Validate email format
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const result = await authService.signIn(email, password);

    if (result.success) {
      setMessage("Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMessage(result.error || "Login failed");
    }

    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");

    // Validate all fields first
    if (!name.trim()) {
      setMessage("Please enter your name");
      setLoading(false);
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordError = getPasswordErrorMessage(password);
    if (passwordError) {
      setMessage(passwordError);
      setLoading(false);
      return;
    }

    const result = await authService.signUp({
      name,
      email,
      password,
    });

    if (result.success) {
      setMessage("Account created successfully! Logging you in...");
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage(result.error || "Registration failed");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    const redirectUrl = `${window.location.origin}/auth/callback`;
    const result = await authService.signInWithGoogle(redirectUrl);

    if (!result.success) {
      setMessage(result.error || "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="min-h-screen bg-(--auth-bg)"
    >
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <AuthHero />
        <div className="flex items-center justify-center px-6 py-12">
          <AuthForm
            mode={mode}
            onModeChange={setMode}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            message={message}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onGoogleLogin={handleGoogleLogin}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
