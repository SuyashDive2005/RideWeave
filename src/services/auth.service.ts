import { supabase } from "@/lib/supabase";
import { otpService } from "./otp.service";

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  /**
   * Sign up user with Supabase and create user record in database
   * Also sends OTP to phone for verification
   */
  async signUp(data: RegistrationData) {
    try {
      // 1. Create auth user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // 2. Create user record in our database
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
        })
        .select();

      if (dbError) {
        console.error("Insert Error Details:", {
          code: dbError.code,
          message: dbError.message,
          details: dbError.details,
        });
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log("User created in database:", userData);

      // 3. Create wallet for the user
      const { error: walletError } = await supabase.from("wallets").insert({
        user_id: authData.user.id,
        balance: 0,
      });

      if (walletError) {
        console.warn("Failed to create wallet:", walletError.message);
        // Don't throw here as user is already created
      }

      return {
        success: true,
        user: authData.user,
        userId: authData.user.id,
        message: "Registration successful!",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Sign in with email and password
   * Returns user info and requires phone verification if not already verified
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Sign in failed");
      }

      // Get user from database to check phone verification status
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, phone, phone_verified")
        .eq("id", data.user.id)
        .single();

      if (userError) {
        console.warn("Failed to fetch user data:", userError.message);
      }

      const phoneVerified = userData?.phone_verified || false;

      return {
        success: true,
        user: data.user,
        session: data.session,
        userId: data.user.id,
        message: "Sign in successful!",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(redirectUrl: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        url: data.url,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OAuth sign in failed";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Send OTP to phone number for verification (after signin/signup)
   */
  async sendPhoneVerificationOTP(phone: string) {
    try {
      const result = await otpService.sendOTP(phone);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send OTP";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Verify phone OTP and mark user as phone_verified
   */
  async verifyPhoneOTP(phone: string, otp: string, userId: string) {
    try {
      const result = await otpService.verifyOTP(phone, otp, userId);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to verify OTP";
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign out failed";
      return { success: false, error: message };
    }
  },
};
