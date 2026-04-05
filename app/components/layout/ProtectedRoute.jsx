"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

/**
 * ProtectedRoute – wraps children and redirects to /login if unauthenticated.
 * Shows a loading spinner while auth state is initializing.
 */
export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, loading, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-label">Loading arena...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
