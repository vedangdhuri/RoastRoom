'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { useRoomStore } from '../../../store/roomStore';
import { useGameStore } from '../../../store/gameStore';
import { getSocket } from '../../../socket/socket';
import { roomService } from '../../../services/roomService';

// ── Sub-components ────────────────────────────────────────────────
const RoundTimer = ({ timeLeft, maxTime }) => {
    const pct = Math.max(0, (timeLeft / maxTime) * 100);
    const danger = timeLeft <= 10;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative w-20 h-20 ${danger ? 'animate-pulse-fast' : ''}`}>
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1c1c2a" strokeWidth="8" />
                    <circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke={danger ? '#ef4444' : '#ff2020'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-display font-bold text-xl ${danger ? 'text-red-400' : 'text-white'}`}>
                        {timeLeft}
                    </span>
                </div>
            </div>
            <span className="text-xs text-gray-500">seconds</span>
        </div>
    );
};

const ChatMessage = ({ msg, myId }) => {
    const isMe = msg.userId === myId;
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
        >
            <div className="w-8 h-8 rounded-full bg-brand-600/70 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {msg.username?.[0]?.toUpperCase()}
            </div>
            <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <span className="text-xs text-gray-500">{msg.username}</span>
                <div
                    className={`px-3 py-2 rounded-xl text-sm ${msg.isArgument
                            ? isMe
                                ? 'bg-brand-600 text-white border border-brand-500'
                                : 'bg-blue-900/50 text-blue-100 border border-blue-700/30'
                            : isMe
                                ? 'bg-surface-100 text-gray-200'
                                : 'bg-dark-200 text-gray-300'
                        }`}
                >
                    {msg.isArgument && (
                        <span className="block text-xs font-bold mb-1 opacity-70">
                            {isMe ? '⚔️ Your Argument' : '🎯 Their Argument'}
                        </span>
                    )}
                    {msg.message}
                </div>
            </div>
        </motion.div>
    );
};

const ScoreCard = ({ scoreData, onClose }) => {
    if (!scoreData) return null;
    const { username, scores } = scoreData;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="card max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-display font-bold text-lg mb-1">🤖 AI Verdict</h3>
                <p className="text-sm text-gray-400 mb-4">Score for <span className="font-semibold text-white">{username}</span></p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { label: 'Logic', val: scores.logic, color: 'text-blue-400' },
                        { label: 'Creativity', val: scores.creativity, color: 'text-purple-400' },
                        { label: 'Clarity', val: scores.clarity, color: 'text-green-400' },
                        { label: 'Humor', val: scores.humor, color: 'text-yellow-400' },
                    ].map((s) => (
                        <div key={s.label} className="bg-dark-200 rounded-lg p-3 text-center">
                            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.val}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-brand-600/10 border border-brand-600/30 rounded-xl mb-4">
                    <span className="font-semibold text-sm">Total Score</span>
                    <span className="font-display font-bold text-2xl text-brand-400">{scores.total}/40</span>
                </div>
                {scores.feedback && (
                    <p className="text-xs text-gray-400 italic border-t border-white/10 pt-3">
                        💬 "{scores.feedback}"
                    </p>
                )}
                <button onClick={onClose} className="btn-primary w-full mt-4">Got it!</button>
            </div>
        </motion.div>
    );
};

const MatchResult = ({ result, myId, onLeave }) => {
    const isWinner = result.winner?.userId === myId;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-6xl mb-4"
                >
                    {isWinner ? '🏆' : '💀'}
                </motion.div>
                <h2 className="font-display font-bold text-3xl mb-1">
                    {isWinner ? 'You Won!' : 'You Lost!'}
                </h2>
                <p className="text-gray-400 mb-6">
                    Winner: <span className="font-semibold text-white">{result.winner?.username}</span>
                </p>

                <div className="space-y-3 mb-6">
                    {result.finalScores?.map((s) => (
                        <div key={s.userId} className="flex items-center justify-between p-3 bg-dark-200 rounded-xl">
                            <span className="font-medium">{s.username}</span>
                            <div className="text-right">
                                <p className="font-bold text-brand-400">{s.totalScore} pts</p>
                                <p className="text-xs text-green-400">+{s.xpEarned} XP</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={onLeave} className="btn-primary w-full">
                    Return to Lobby
                </button>
            </motion.div>
        </div>
    );
};

// ── Main GameRoom ─────────────────────────────────────────────────
export default function GameRoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const { currentRoom, messages, players, addMessage, setCurrentRoom, setPlayers, clearRoom } = useRoomStore();
    const { gameStatus, currentRound, maxRounds, topic, mode, currentTurn, timeLeft, isScoring, matchResult,
        initGame, setRound, setTimeLeft, setCurrentTurn, addRoundScore, setIsScoring, setMatchResult, resetGame } = useGameStore();

    const [inputMsg, setInputMsg] = useState('');
    const [typingUsers, setTypingUsers] = useState([]);
    const [latestScore, setLatestScore] = useState(null);
    const [playerScoresMap, setPlayerScoresMap] = useState({});
    const chatEndRef = useRef(null);
    const typingTimerRef = useRef(null);
    const socket = getSocket();

    const maxTime = mode === 'roast' ? 30 : 60;
    const isMyTurn = currentTurn === user?._id;

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Join room on mount
    useEffect(() => {
        if (!user || !roomId) return;

        // Fetch room data
        roomService.getRoomById(roomId)
            .then((room) => {
                setCurrentRoom(room);
                setPlayers(room.players || []);
            })
            .catch(() => toast.error('Room not found'));

        // Socket: join
        socket.emit('join-room', { roomId, userId: user._id, username: user.username });

        // Socket listeners
        const handlers = {
            'joined-room': ({ room }) => {
                setCurrentRoom(room);
                setPlayers(room.players || []);
            },
            'player-joined': ({ players: p }) => setPlayers(p),
            'player-left': ({ players: p, username }) => {
                setPlayers(p);
                addMessage({ id: Date.now(), userId: 'system', username: 'System', message: `${username} left the room.`, isArgument: false });
            },
            'game-start': ({ round, maxRounds: mr, topic: t, mode: m, currentTurn: ct }) => {
                initGame({ round, maxRounds: mr, topic: t, mode: m, currentTurn: ct });
                toast.success('⚔️ Battle started!');
            },
            'new-message': (msg) => addMessage(msg),
            'user-typing': ({ username, isTyping }) => {
                setTypingUsers((prev) =>
                    isTyping ? (prev.includes(username) ? prev : [...prev, username]) : prev.filter((u) => u !== username)
                );
            },
            'timer-tick': ({ timeLeft: tl }) => setTimeLeft(tl),
            'turn-change': ({ currentTurn: ct }) => setCurrentTurn(ct),
            'scoring-start': () => setIsScoring(true),
            'round-scored': (data) => {
                setIsScoring(false);
                addRoundScore(data);
                setLatestScore(data);
                setPlayerScoresMap((prev) => ({
                    ...prev,
                    [data.userId]: (prev[data.userId] || 0) + (data.scores?.total || 0),
                }));
            },
            'round-start': ({ round: r, maxRounds: mr, currentTurn: ct }) => {
                setRound({ round: r, maxRounds: mr, currentTurn: ct });
                toast(`Round ${r} 🥊`, { icon: '⏱' });
            },
            'round-timeout': () => {
                toast.error("Time's up!");
            },
            'match-result': (result) => setMatchResult(result),
            'player-disconnected': ({ username }) => {
                toast.error(`${username} disconnected — match ended.`);
            },
            'error': ({ message }) => toast.error(message),
        };

        Object.entries(handlers).forEach(([ev, fn]) => socket.on(ev, fn));

        return () => {
            Object.keys(handlers).forEach((ev) => socket.off(ev));
            clearRoom();
            resetGame();
        };
    }, [roomId, user?._id]);

    // Handle game-over — send aggregate
    useEffect(() => {
        if (gameStatus !== 'finished' || matchResult) return;
        const playerScores = Object.entries(playerScoresMap).map(([uid, total]) => {
            const p = players.find((pl) => pl.userId?.toString() === uid);
            return { userId: uid, username: p?.username || 'Unknown', totalScore: total, creativeScore: 5 };
        });
        socket.emit('game-over', { roomId, playerScores });
    }, [gameStatus, matchResult, playerScoresMap, players, roomId, socket]);

    const sendMessage = useCallback((isArgument = false) => {
        if (!inputMsg.trim()) return;
        if (isArgument && !isMyTurn) {
            toast.error("Not your turn!");
            return;
        }
        socket.emit('send-message', { roomId, userId: user._id, username: user.username, message: inputMsg.trim(), isArgument });
        setInputMsg('');
    }, [inputMsg, isMyTurn, roomId, user, socket]);

    const handleTyping = () => {
        socket.emit('typing', { roomId, username: user.username, isTyping: true });
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            socket.emit('typing', { roomId, username: user.username, isTyping: false });
        }, 1500);
    };

    const handleLeave = () => {
        socket.emit('leave-room', { roomId });
        clearRoom();
        resetGame();
        router.push('/lobby');
    };

    const handleNextRound = () => socket.emit('next-round', { roomId });

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 min-h-[calc(100vh-64px)]">

            {/* Score overlay */}
            <AnimatePresence>
                {latestScore && (
                    <ScoreCard scoreData={latestScore} onClose={() => setLatestScore(null)} />
                )}
            </AnimatePresence>

            {/* Match result overlay */}
            {matchResult && (
                <MatchResult result={matchResult} myId={user?._id} onLeave={handleLeave} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${mode === 'roast' ? 'bg-orange-900/40 text-orange-400' : 'bg-blue-900/40 text-blue-400'}`}>
                            {mode === 'roast' ? '🔥 Roast' : '🎓 Debate'}
                        </span>
                        <span className="badge bg-surface-100 text-gray-400 text-xs">
                            Round {currentRound || '—'}/{maxRounds}
                        </span>
                    </div>
                    <p className="font-semibold text-sm text-gray-200 max-w-md line-clamp-1">{topic || currentRoom?.topic}</p>
                </div>
                <button onClick={handleLeave} className="btn-ghost text-xs text-red-400">Leave</button>
            </div>

            <div className="flex gap-4 flex-1">

                {/* Chat panel */}
                <div className="flex-1 flex flex-col card p-0 overflow-hidden min-h-[500px]">
                    {/* Chat header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Battle Chat</h3>
                        {isScoring && (
                            <span className="flex items-center gap-1.5 text-xs text-brand-400 animate-pulse">
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                AI scoring...
                            </span>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {gameStatus === 'idle' && (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-3xl mb-2">⏳</p>
                                <p className="text-sm">Waiting for opponent to join...</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} msg={msg} myId={user?._id} />
                        ))}
                        {typingUsers.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex gap-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"
                                        />
                                    ))}
                                </span>
                                {typingUsers.join(', ')} typing...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/10 space-y-2">
                        <div className="flex gap-2">
                            <input
                                value={inputMsg}
                                onChange={(e) => { setInputMsg(e.target.value); handleTyping(); }}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(false)}
                                placeholder={gameStatus === 'active' ? 'Chat with your opponent...' : 'Waiting for game to start...'}
                                disabled={gameStatus === 'idle'}
                                maxLength={1000}
                                className="input flex-1"
                            />
                            <button onClick={() => sendMessage(false)} disabled={!inputMsg.trim() || gameStatus === 'idle'} className="btn-secondary px-3">
                                💬
                            </button>
                        </div>
                        {gameStatus === 'active' && (
                            <button
                                onClick={() => sendMessage(true)}
                                disabled={!inputMsg.trim() || !isMyTurn || isScoring}
                                className="btn-primary w-full text-sm"
                            >
                                {!isMyTurn ? "⏸ Opponent's Turn" : isScoring ? '🤖 AI Scoring...' : '⚔️ Submit as Argument'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Side panel */}
                <div className="w-64 flex flex-col gap-4 hidden md:flex">
                    {/* Timer */}
                    {gameStatus === 'active' && (
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Time Left</p>
                            <RoundTimer timeLeft={timeLeft} maxTime={maxTime} />
                            <p className={`text-xs mt-3 font-semibold ${isMyTurn ? 'text-brand-400' : 'text-gray-500'}`}>
                                {isMyTurn ? '⚔️ Your turn!' : '⏸ Wait…'}
                            </p>
                        </div>
                    )}

                    {/* Players */}
                    <div className="card">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Players</h3>
                        <div className="space-y-2">
                            {players.map((p) => (
                                <div key={p.userId} className={`flex items-center gap-2.5 p-2 rounded-lg ${currentTurn === p.userId?.toString() ? 'bg-brand-600/10 border border-brand-600/30' : 'bg-dark-200'}`}>
                                    <div className="w-8 h-8 rounded-full bg-brand-600/70 flex items-center justify-center text-xs font-bold">
                                        {p.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {p.username} {p.userId?.toString() === user?._id && <span className="text-xs text-gray-500">(you)</span>}
                                        </p>
                                        <p className="text-xs text-brand-400 font-semibold">
                                            {playerScoresMap[p.userId?.toString()] || 0} pts
                                        </p>
                                    </div>
                                    {currentTurn === p.userId?.toString() && <span className="text-xs text-brand-400">⚔️</span>}
                                </div>
                            ))}
                            {players.length < 2 && (
                                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-dark-200 opacity-50">
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600 text-xs">?</div>
                                    <p className="text-sm text-gray-600">Waiting...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next round button (host only) */}
                    {gameStatus === 'active' && currentRound < maxRounds && (
                        <button onClick={handleNextRound} className="btn-secondary text-sm">
                            Next Round →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
