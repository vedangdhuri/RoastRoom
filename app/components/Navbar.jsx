'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { disconnectSocket } from '../socket/socket';

const Navbar = () => {
    const { user } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        disconnectSocket();
        authService.logout();
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🔥</span>
                        <span className="font-display font-bold text-xl text-gradient">RoastRoom</span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        <Link href="/leaderboard" className="btn-ghost">
                            🏆 Leaderboard
                        </Link>

                        {user ? (
                            <>
                                <Link href="/lobby" className="btn-ghost">
                                    🎮 Arena
                                </Link>
                                <Link href="/dashboard" className="btn-ghost">
                                    <span className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
                                        {user.username?.[0]?.toUpperCase()}
                                    </span>
                                    <span className="hidden sm:inline">{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn-ghost">Login</Link>
                                <Link href="/register" className="btn-primary">
                                    Join Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
