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
    <footer className="bg-(--brand-2) dark:bg-(--nav-bg) mt-20">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Car className="w-6 h-6 text-(--brand-2)" />
              </div>
              <span className="text-xl font-bold text-white">RideWeave</span>
            </div>
            <p className="text-white/80 text-sm mb-6">
              Share your journey, save your costs. The safest way to commute
              together.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-(--brand-2) hover:border-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-(--brand-2) hover:border-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-(--brand-2) hover:border-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-(--brand-2) hover:border-white transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
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
