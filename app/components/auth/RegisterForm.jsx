"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signUp, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (username.length < 3)
      return toast.error("Username must be at least 3 characters");
    if (password !== confirm)
      return toast.error("Passwords don't match");

    try {
      await signUp(email, password, username);
      toast.success("Account created! Welcome to the Arena 🔥");
      router.push("/lobby");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="register-username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="DragonSlayer"
        minLength={3}
        required
      />
      <Input
        id="register-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="warrior@arena.gg"
        required
      />
      <Input
        id="register-password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        minLength={6}
        required
      />
      <Input
        id="register-confirm"
        type="password"
        label="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
        required
        error={confirm && password !== confirm ? "Passwords don't match" : ""}
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
        id="register-submit"
        type="submit"
        variant="secondary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Create Account 🔥
      </Button>
    </form>
  );
}
