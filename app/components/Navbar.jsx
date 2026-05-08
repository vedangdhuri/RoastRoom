"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/lobby", label: "Arena", icon: "⚔️" },
  { href: "/arenas", label: "Arenas", icon: "🏟️" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/dashboard", label: "Profile", icon: "👤" },
];

const Navbar = () => {
  const { user, profile, signOut, initialize } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-dark-500/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-orange flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 transition-shadow">
              R
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight hidden sm:block">
              Roast<span className="text-gradient">Room</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="hidden md:inline">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-700/30 border border-brand-500/20 flex items-center justify-center text-brand-400 font-display font-bold text-xs">
                    {profile?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white leading-none">
                      {profile?.username || "Player"}
                    </p>
                    <p className="text-xs text-gray-500 font-label">
                      Lv.{profile?.level || 1}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={signOut}
                  className="btn-ghost text-xs text-gray-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm px-5 py-2">
                  Join Arena
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
