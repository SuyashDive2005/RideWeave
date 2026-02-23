import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--brand-2) dark:bg-(--nav-bg) mt-8">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="RideWeave"
                className="h-10 w-10 rounded-full"
              />
              <span className="text-white font-semibold text-lg">
                RideWeave
              </span>
            </div>
            <p className="text-white/80 text-sm mb-6">
              Share your journey, save your costs. The safest way to commute
              together.
            </p>
            {/* Social icons removed */}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/")}
                className="text-white/80 hover:text-white transition-colors text-sm text-left font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/rides")}
                className="text-white/80 hover:text-white transition-colors text-sm text-left font-medium"
              >
                Find a Ride
              </button>
              <button
                onClick={() => navigate("/rides")}
                className="text-white/80 hover:text-white transition-colors text-sm text-left font-medium"
              >
                Offer a Ride
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="text-white/80 hover:text-white transition-colors text-sm text-left font-medium"
              >
                My Profile
              </button>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/support")}
                className="text-white/80 hover:text-white transition-colors text-sm text-left font-medium"
              >
                Help & Support
              </button>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Terms & Conditions
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80 text-sm">+91 8149323525</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80 text-sm">suyash.pict@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80 text-sm">
                    Pict, Dhanakawadi, Katraj
                  </p>
                  <p className="text-white/80 text-sm">Pune 411043, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm text-center">
              © {currentYear} RideWeave. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
