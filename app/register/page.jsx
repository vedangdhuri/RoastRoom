"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-orange/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-brand-700/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-orange to-brand-600 items-center justify-center text-2xl mb-5 shadow-lg shadow-accent-orange/20">
            🔥
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Join the Arena</h1>
          <p className="text-gray-500 text-sm">
            Create your account and start battling
          </p>
        </div>

        <div className="card-glass p-8">
          <RegisterForm />

          <div className="mt-6 pt-5 border-t border-white/[0.04] text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
