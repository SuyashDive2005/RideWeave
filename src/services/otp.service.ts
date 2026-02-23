import { supabase } from "@/lib/supabase";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get expiry time (current time + 10 minutes)
 */
function getExpiryTime(): Date {
  const now = new Date();
  return new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export const otpService = {
  /**
   * Send OTP to phone number
   * Generates OTP and stores in database
   */
  async sendOTP(phone: string) {
    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = phone.replace(/\D/g, "");

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = getExpiryTime();

      // Delete any existing OTP for this phone
      await supabase
        .from("phone_verifications")
        .delete()
        .eq("phone", cleanPhone);

      // Insert new OTP
      const { error } = await supabase.from("phone_verifications").insert({
        phone: cleanPhone,
        otp: otp,
        attempts: 0,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
      }

      // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
      // For testing, log to console
      console.log(
        `📱 OTP for ${cleanPhone}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} min)`,
      );

      return {
        success: true,
        message: `OTP sent to ${cleanPhone}`,
      };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send OTP",
      };
    }
  },

  /**
   * Verify OTP and mark phone as verified
   */
  async verifyOTP(phone: string, otp: string, userId?: string) {
    try {
      const cleanPhone = phone.replace(/\D/g, "");

      // Get OTP record
      const { data: verificationData, error: fetchError } = await supabase
        .from("phone_verifications")
        .select("*")
        .eq("phone", cleanPhone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !verificationData) {
        return {
          success: false,
          error: "OTP not found or expired",
        };
      }

      // Check if OTP has expired
      const expiresAt = new Date(verificationData.expires_at);
      if (new Date() > expiresAt) {
        return {
          success: false,
          error: "OTP has expired",
        };
      }

      // Check attempts
      if (verificationData.attempts >= MAX_OTP_ATTEMPTS) {
        return {
          success: false,
          error: "Too many incorrect attempts. Please request a new OTP.",
        };
      }

      // Verify OTP
      if (verificationData.otp !== otp.trim()) {
        // Increment attempts
        await supabase
          .from("phone_verifications")
          .update({
            attempts: verificationData.attempts + 1,
          })
          .eq("id", verificationData.id);

        const remainingAttempts =
          MAX_OTP_ATTEMPTS - (verificationData.attempts + 1);
        return {
          success: false,
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        };
      }

      // OTP is valid - Mark phone as verified if userId provided
      if (userId) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            phone_verified: true,
          })
          .eq("id", userId);

        if (updateError) {
          throw new Error(`Failed to update user: ${updateError.message}`);
        }
      }

      // Delete OTP record after successful verification
      await supabase
        .from("phone_verifications")
        .delete()
        .eq("id", verificationData.id);

      return {
        success: true,
        message: "Phone verified successfully",
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify OTP",
      };
    }
  },

  /**
   * Resend OTP to phone number
   */
  async resendOTP(phone: string) {
    try {
      const cleanPhone = phone.replace(/\D/g, "");

      // Get latest OTP request
      const { data: verificationData } = await supabase
        .from("phone_verifications")
        .select("created_at")
        .eq("phone", cleanPhone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Check rate limiting (can't resend within 30 seconds)
      if (verificationData) {
        const lastRequestTime = new Date(verificationData.created_at).getTime();
        const timeSinceLastRequest = Date.now() - lastRequestTime;

        if (timeSinceLastRequest < 30 * 1000) {
          return {
            success: false,
            error: `Please wait ${Math.ceil((30 * 1000 - timeSinceLastRequest) / 1000)} seconds before requesting a new OTP`,
          };
        }
      }

      // Send new OTP
      return this.sendOTP(cleanPhone);
    } catch (error) {
      console.error("Error resending OTP:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      };
    }
  },
};
