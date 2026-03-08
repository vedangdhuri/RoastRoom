'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const LandingPage = () => {
    const { user } = useAuthStore();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 font-semibold text-sm"
                >
                    🔥 The Ultimate Roasting Arena
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight"
                >
                    Win Arguments. <br />
                    <span className="text-gradient">Destroy Egos.</span> <br />
                    Earn XP.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    Join real-time debate and roast battles. Outsmart your opponents, get scored by AI in real-time, and climb the global leaderboard.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {user ? (
                        <Link href="/lobby" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto glow-red">
                            Enter the Arena ⚔️
                        </Link>
                    ) : (
                        <>
                            <Link href="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto glow-red">
                                Start Battling Now
                            </Link>
                            <Link href="/leaderboard" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                                View Leaderboard
                            </Link>
                        </>
                    )}
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="w-full bg-dark-200 py-20 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">How It Works</h2>
                        <p className="text-gray-400 text-lg">Three simple steps to establish your dominance.</p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: '🎯',
                                title: 'Pick a Topic & Mode',
                                desc: 'Choose between intellectual debates or ruthless comedy roasts. Set the topic and challenge the lobby.'
                            },
                            {
                                icon: '⏱️',
                                title: 'Battle in Real-Time',
                                desc: 'Take turns dropping your best arguments before the timer runs out. Use logic or sheer disrespect.'
                            },
                            {
                                icon: '🤖',
                                title: 'AI Judgment',
                                desc: 'Our impartial GPT-4o judge scores every response on logic, humor, and clarity to determine the true winner.'
                            }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={item} className="card hover:border-brand-500/30 transition-colors">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats/CTA Section */}
            <section className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-500/10 blur-[100px]" />
                    <h2 className="font-display font-bold text-3xl mb-6 relative z-10">Think you have what it takes?</h2>
                    <p className="text-gray-300 mb-8 relative z-10 max-w-lg mx-auto">
                        Every win earns you XP. Level up, unlock badges, and cement your legacy on the global leaderboard.
                    </p>
                    <div className="relative z-10">
                        <Link href={user ? '/lobby' : '/register'} className="btn-primary px-8 py-3">
                            {user ? 'Find a Match' : 'Create Free Account'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
