'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services/roomService';
import toast from 'react-hot-toast';

const XPProgressBar = ({ xp, level }) => {
    const baseXP = level * level * 100;
    const nextLevelXP = (level + 1) * (level + 1) * 100;
    const progressPattern = Math.min(((xp - baseXP) / (nextLevelXP - baseXP)) * 100, 100);

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Level {level}</span>
                <span>{xp} / {nextLevelXP} XP</span>
            </div>
            <div className="h-4 w-full bg-dark-200 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPattern}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand-600 to-orange-500 relative"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0iTTAgNDBsNDAtNDBWMGwtNDAgNDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] animate-shimmer" />
                </motion.div>
            </div>
        </div>
    );
};

const BADGE_EMOJI = {
    first_win: '🥇', five_wins: '⭐', ten_wins: '🏆',
    roast_king: '🔥', debate_legend: '🎓', high_scorer: '💯'
};
const BADGE_DESC = {
    first_win: 'First Victory', five_wins: '5 Wins', ten_wins: '10 Wins',
    roast_king: 'Roast Master', debate_legend: 'Debate Scholar', high_scorer: 'Max Score'
};

const DashboardPage = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        Promise.all([userService.getDashboard(), userService.getProfile()])
            .then(([dashData, profData]) => {
                setStats(dashData);
                setHistory(profData.matchHistory || []);
            })
            .catch((e) => toast.error('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-2xl font-bold text-brand-400">
                    {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                    <h1 className="font-display font-bold text-3xl">Profile & Stats</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-white font-semibold">{user.username}</span></p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Level Card */}
                <div className="card border-brand-500/20 bg-brand-900/10">
                    <h3 className="font-semibold text-gray-300 mb-2">Progression</h3>
                    <div className="flex items-end gap-3 mb-2">
                        <span className="font-display font-bold text-5xl text-white">{user.level || 1}</span>
                        <span className="text-brand-400 font-medium mb-1 border px-2 py-0.5 rounded border-brand-500/30 bg-brand-500/10">Level</span>
                    </div>
                    <XPProgressBar xp={user.xp || 0} level={user.level || 1} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="card p-5 text-center flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Wins</p>
                        <p className="font-display font-bold text-4xl">{user.wins || 0}</p>
                    </div>
                    <div className="card p-5 text-center flex flex-col justify-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Win Rate</p>
                        <p className="font-display font-bold text-4xl text-green-400">
                            {loading ? '...' : `${stats?.winRate || 0}%`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="card">
                <h2 className="font-display font-bold text-xl mb-4">Earned Badges</h2>
                {user.badges?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {user.badges.map(b => (
                            <div key={b} className="flex items-center gap-2 px-3 py-2 bg-dark-200 border border-white/5 rounded-lg group hover:border-brand-500/50 transition-colors">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{BADGE_EMOJI[b]}</span>
                                <span className="text-sm font-medium">{BADGE_DESC[b]}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Play matches and win to earn badges.</p>
                )}
            </div>

            {/* Match History */}
            <div className="card">
                <h2 className="font-display font-bold text-xl mb-4">Recent Matches</h2>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading history...</p>
                    ) : history.length === 0 ? (
                        <p className="text-gray-500 text-sm">No matches played yet.</p>
                    ) : (
                        history.map((match) => {
                            const isWinner = match.winner?.toString() === user._id;
                            return (
                                <div key={match._id} className="flex items-center justify-between p-4 bg-dark-200 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-2xl ${isWinner ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'grayscale'}`}>
                                            {isWinner ? '🏆' : '💀'}
                                        </span>
                                        <div>
                                            <p className="font-medium">{isWinner ? 'Victory' : 'Defeat'}</p>
                                            <p className="text-xs text-gray-500">{new Date(match.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                                            {isWinner ? '+100' : '+40'} XP
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
