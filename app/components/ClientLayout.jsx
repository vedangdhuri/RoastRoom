'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { useAuthStore } from '../store/authStore';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientLayout({ children }) {
    const [mounted, setMounted] = useState(false);
    const { user } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    // Handle protected routes
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const authRoutes = ['/login', '/register'];
        const protectedRoutes = ['/dashboard', '/lobby', '/create-room', '/room'];

        const isProteced = protectedRoutes.some((route) => pathname.startsWith(route));
        const isAuthRoute = authRoutes.includes(pathname);

        if (isProteced && !user) {
            router.push('/login');
        }

        if (isAuthRoute && user) {
            router.push('/lobby');
        }
    }, [user, pathname, router, mounted]);

    if (!mounted) return null; // Avoid hydration mismatch on initial render

    return (
        <div className="min-h-screen bg-dark-300 flex flex-col font-sans text-gray-100 antialiased dark">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#2a2a3e',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
        </div>
    );
}
