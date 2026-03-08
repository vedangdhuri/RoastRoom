'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { userService } from '../services/roomService';
import { useAuthStore } from '../store/authStore';

const BADGE_EMOJI = {
    first_win: '🥇', five_wins: '⭐', ten_wins: '🏆',
    roast_king: '🔥', debate_legend: '🎓', high_scorer: '💯',
};

const RankCard = ({ entry, myId }) => {
    const isMe = entry._id === myId;
    const medalColors = { 1: 'text-yellow-400', 2: 'text-gray-400', 3: 'text-orange-400' };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isMe ? 'bg-brand-600/10 border-brand-600/40' : 'bg-surface-200 border-white/5 hover:border-white/10'
                }`}
        >
            <div className={`w-8 text-center font-display font-bold text-lg ${medalColors[entry.rank] || 'text-gray-500'}`}>
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
            </div>

            <div className="w-10 h-10 rounded-full bg-brand-600/70 flex items-center justify-center font-bold">
                {entry.username?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{entry.username}</p>
                    {isMe && <span className="badge bg-brand-600/30 text-brand-300 text-xs">You</span>}
                    {entry.badges?.slice(0, 3).map((b) => (
                        <span key={b} title={b}>{BADGE_EMOJI[b] || '🏷'}</span>
                    ))}
                </div>
                <p className="text-xs text-gray-500">Level {entry.level} · {entry.wins} wins</p>
            </div>

            <div className="text-right">
                <p className="font-display font-bold text-brand-400 text-lg">{entry.xp?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XP</p>
            </div>
        </motion.div>
    );
};

export default function LeaderboardPage() {
    const { user } = useAuthStore();
    const [tab, setTab] = useState('global');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        userService.getLeaderboard(tab)
            .then(setData)
            .catch(() => toast.error('Failed to load leaderboard'))
            .finally(() => setLoading(false));
    }, [tab]);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <div className="text-center mb-8">
                <h1 className="font-display font-bold text-4xl mb-2">🏆 Leaderboard</h1>
                <p className="text-gray-400">Top debaters and roasters fighting for glory.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-dark-200 rounded-xl w-fit mx-auto">
                {['global', 'weekly'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {t === 'global' ? '🌍 All Time' : '📅 This Week'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin text-4xl">🏆</div>
                </div>
            ) : data.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">👀</p>
                    <p className="text-gray-400">No players ranked yet. Be first!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((entry, i) => (
                        <motion.div
                            key={entry._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <RankCard entry={entry} myId={user?._id} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
