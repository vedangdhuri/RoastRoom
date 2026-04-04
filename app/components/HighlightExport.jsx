'use client';

import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';

/**
 * Generates a stylised match highlight card and allows users
 * to download & share it on social media.
 */
export default function HighlightExport({ matchResult, topic, mode }) {
    const cardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    const winner = matchResult?.winner;
    const loser = matchResult?.finalScores?.find(
        (s) => s.userId !== winner?.userId,
    );
    const peoplesChamp = matchResult?.peoplesChamp;
    const crowdWinner = matchResult?.crowdWinner;

    const handleExport = useCallback(async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#0a0a14',
            });

            const link = document.createElement('a');
            link.download = `roastroom-highlight-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    }, []);

    const shareToTwitter = useCallback(() => {
        const text = encodeURIComponent(
            `🔥 ${winner?.username} just ${mode === 'roast' ? 'roasted' : 'debated'} their way to victory on RoastRoom!\n\nTopic: "${topic}"\nScore: ${winner?.totalScore || '—'} pts\n\n${peoplesChamp ? `🏅 The crowd picked ${crowdWinner?.username} — People's Champ!\n\n` : ''}Join the arena 👇`,
        );
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    }, [winner, topic, mode, peoplesChamp, crowdWinner]);

    if (!matchResult || !winner) return null;

    return (
        <div className="space-y-4">
            {/* The exportable card */}
            <div
                ref={cardRef}
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                    background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 50%, #0f0f23 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* Decorative glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{
                        background: mode === 'roast'
                            ? 'radial-gradient(circle, #ff4500, transparent)'
                            : 'radial-gradient(circle, #3b82f6, transparent)',
                    }}
                />

                {/* Header */}
                <div className="relative z-10 text-center mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
                        {mode === 'roast' ? '🔥 Roast Battle' : '🎓 Debate Match'}
                    </p>
                    <h3 className="font-bold text-lg text-white leading-tight max-w-xs mx-auto">
                        "{topic}"
                    </h3>
                </div>

                {/* VS Card */}
                <div className="relative z-10 flex items-center justify-center gap-4 mb-5">
                    {/* Winner */}
                    <div className="text-center flex-1">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl font-bold text-black mb-2 shadow-lg shadow-yellow-500/30">
                            {winner.username?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-bold text-white text-sm">{winner.username}</p>
                        <p className="text-yellow-400 font-bold text-lg">{matchResult.finalScores?.find(s => s.userId === winner.userId)?.totalScore || 0} pts</p>
                        <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 rounded-full">
                            🏆 Winner
                        </span>
                    </div>

                    {/* VS divider */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-black text-gray-600">VS</span>
                    </div>

                    {/* Loser */}
                    <div className="text-center flex-1">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-xl font-bold text-white mb-2">
                            {loser?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <p className="font-bold text-gray-300 text-sm">{loser?.username || 'Opponent'}</p>
                        <p className="text-gray-400 font-bold text-lg">{loser?.totalScore || 0} pts</p>
                        {peoplesChamp && crowdWinner?.userId === loser?.userId && (
                            <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 rounded-full">
                                🏅 People's Champ
                            </span>
                        )}
                    </div>
                </div>

                {/* People's Champ banner */}
                {peoplesChamp && (
                    <div className="relative z-10 text-center py-2 px-4 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4">
                        <p className="text-xs text-purple-300">
                            🏅 The crowd voted for <span className="font-bold text-purple-200">{crowdWinner?.username}</span> — People's Champ!
                        </p>
                    </div>
                )}

                {/* Branding */}
                <div className="relative z-10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">
                        RoastRoom
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    disabled={isExporting}
                    className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2"
                >
                    {isExporting ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Exporting...
                        </>
                    ) : (
                        <>📸 Save Image</>
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={shareToTwitter}
                    className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                >
                    🐦 Share on X
                </motion.button>
            </div>
        </div>
    );
}
