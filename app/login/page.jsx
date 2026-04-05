"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-brand-700/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-accent-orange/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-orange items-center justify-center text-white font-display font-bold text-2xl mb-5 shadow-lg shadow-brand-600/20">
            R
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Enter the arena and continue your streak
          </p>
        </div>

        <div className="card-glass p-8">
          <LoginForm />

          <div className="mt-6 pt-5 border-t border-white/[0.04] text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Join the Arena
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
