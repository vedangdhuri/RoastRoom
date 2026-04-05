"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await signIn(email, password);
      toast.success("Welcome back! ⚔️");
      router.push("/lobby");
    } catch (err) {
      toast.error(err.message || "Sign in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="login-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="warrior@arena.gg"
        required
      />

      <Input
        id="login-password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-accent-red px-3 py-2 rounded-xl bg-accent-red/10 border border-accent-red/20"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <Button
        id="login-submit"
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Sign In ⚔️
      </Button>
    </form>
  );
}
