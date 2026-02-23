import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      if (!loading && user) {
        try {
          // Check if user exists in our database
          const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single();

          // User doesn't exist in database (new Google OAuth user) - create record
          if (fetchError?.code === "PGRST116") {
            const { error: insertError } = await supabase.from("users").insert({
              id: user.id,
              name:
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "User",
              email: user.email!,
              phone: "", // Empty initially - can be added in profile later
              phone_verified: false,
            });

            if (insertError) {
              console.error("Failed to create user record:", insertError);
              navigate("/login", { replace: true });
              return;
            }

            // Create wallet for new user
            const { error: walletError } = await supabase
              .from("wallets")
              .insert({
                user_id: user.id,
                balance: 0,
              });

            if (walletError) {
              console.warn("Failed to create wallet:", walletError.message);
            }
          } else if (fetchError && fetchError?.code !== "PGRST116") {
            console.error("Failed to fetch user data:", fetchError);
            navigate("/login", { replace: true });
            return;
          }

          // User exists or just created - proceed to dashboard
          navigate("/", { replace: true });
        } catch (error) {
          console.error("Auth callback error:", error);
          navigate("/login", { replace: true });
        }
      } else if (!loading && !user) {
        // OAuth failed or user cancelled
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [user, loading, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="flex items-center justify-center min-h-screen bg-(--auth-bg)"
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-(--auth-border) border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-(--auth-text)">Completing sign in...</p>
      </div>
    </motion.div>
  );
};

export default AuthCallback;
