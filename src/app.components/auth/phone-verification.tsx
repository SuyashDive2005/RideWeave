import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Loader } from "lucide-react";
import { otpService } from "@/services/otp.service";
import { supabase } from "@/lib/supabase";
import { isValidPhone } from "@/utils/validation";

interface PhoneVerificationProps {
  onVerified: () => void;
  userId?: string;
  initialPhone?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onVerified,
  userId,
  initialPhone = "",
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "info",
  );
  const [step, setStep] = useState<"phone" | "verify">(
    initialPhone ? "verify" : "phone",
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setMessage("Please enter your phone number");
      setMessageType("error");
      return;
    }

    if (!isValidPhone(phone)) {
      setMessage("Please enter a valid phone number (at least 10 digits)");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    // If user doesn't have a phone yet (Google OAuth case), save it
    if (userId && !initialPhone) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ phone })
        .eq("id", userId);

      if (updateError) {
        setMessage("Failed to save phone number");
        setMessageType("error");
        setLoading(false);
        return;
      }
    }

    const result = await otpService.sendOTP(phone);

    if (result.success) {
      setMessage("OTP sent successfully! Check your phone.");
      setMessageType("success");
      setStep("verify");
      setOtp("");
      setTimeLeft(600); // 10 minutes
      setCanResend(false);
    } else {
      setMessage(result.error || "Failed to send OTP");
      setMessageType("error");
    }

    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setMessage("Please enter the OTP");
      setMessageType("error");
      return;
    }

    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await otpService.verifyOTP(phone, otp, userId);

    if (result.success) {
      setMessage("Phone verified successfully! ");
      setMessageType("success");
      setTimeout(() => {
        onVerified();
      }, 1500);
    } else {
      setMessage(result.error || "Failed to verify OTP");
      setMessageType("error");
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const result = await otpService.resendOTP(phone);

    if (result.success) {
      setMessage("New OTP sent! Check your phone.");
      setMessageType("success");
      setTimeLeft(600);
      setCanResend(false);
    } else {
      setMessage(result.error || "Failed to resend OTP");
      setMessageType("error");
    }

    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
        </h2>

        {step === "phone" ? (
          // Phone Input Step
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white outline-none transition"
                disabled={loading}
              />
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg text-sm ${
                  messageType === "error"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {message}
              </motion.div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        ) : (
          // OTP Verification Step
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Phone: <span className="font-semibold">{phone}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter OTP (6 digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white outline-none transition text-center text-2xl tracking-widest"
                disabled={loading}
              />
            </div>

            {timeLeft > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Expires in {formatTime(timeLeft)}</span>
              </div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg text-sm ${
                  messageType === "error"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {message}
              </motion.div>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setStep("phone");
                  setMessage("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Change Number
              </button>

              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Resend in {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          📱 We'll send a 6-digit OTP to verify your phone number. This helps
          keep your account secure.
        </p>
      </div>
    </motion.div>
  );
};

export default PhoneVerification;
