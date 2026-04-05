"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

/**
 * useAuth – thin hook over authStore with computed helpers.
 * Components should import this instead of useAuthStore directly.
 */
export function useAuth() {
  const {
    user,
    profile,
    session,
    loading,
    error,
    initialize,
    signIn,
    signUp,
    signOut,
    clearError,
  } = useAuthStore();

  // Derived values
  const isAuthenticated = !!user;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  // XP needed for next level (based on level = FLOOR(SQRT(xp/100)))
  const nextLevelXP = (level + 1) * (level + 1) * 100;
  const currentLevelXP = level * level * 100;
  const xpProgress = Math.min(
    Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100),
    100
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    profile,
    session,
    loading,
    error,
    isAuthenticated,
    xp,
    level,
    xpProgress,
    nextLevelXP,
    signIn,
    signUp,
    signOut,
    clearError,
  };
}

/**
 * useRequireAuth – redirects to /login if user is not authenticated.
 * Use in protected pages.
 */
export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  const redirect = useCallback(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  return { user, loading, isAuthenticated: !!user };
}
