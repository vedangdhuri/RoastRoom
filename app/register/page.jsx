'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await authService.register(formData);
            toast.success('Account created! Welcome to RoastRoom ⚔️');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block">⚔️</span>
                    <h2 className="font-display font-bold text-3xl">Join the Arena</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="card">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                                placeholder="roastmaster99"
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                            <input
                                type="email"
                                required
                                className="input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg shadow-brand-500/20">
                            {loading ? 'Forging Profile...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
