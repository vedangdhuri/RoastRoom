'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { roomService } from '../services/roomService';
import toast from 'react-hot-toast';

const LobbyPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchRooms = () => {
        setLoading(true);
        roomService.getRooms()
            .then(setRooms)
            .catch(() => toast.error('Failed to load rooms'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleJoin = (roomId) => {
        router.push(`/room/${roomId}`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-4xl mb-2">The Arena Lobby</h1>
                    <p className="text-gray-400">Find a match or create your own room to start battling.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchRooms} className="btn-secondary" title="Refresh list">
                        ↻
                    </button>
                    <Link href="/create-room" className="btn-primary glow-red">
                        + Create Room
                    </Link>
                </div>
            </div>

            {/* Room Grid */}
            {loading && rooms.length === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin text-4xl">⚔️</div>
                </div>
            ) : rooms.length === 0 ? (
                <div className="card text-center py-20 border-dashed border-white/20">
                    <p className="text-5xl mb-4">👻</p>
                    <h3 className="font-display font-bold text-xl mb-2">It's quiet in here...</h3>
                    <p className="text-gray-400 mb-6">No public rooms available right now.</p>
                    <Link href="/create-room" className="btn-primary">
                        Be the first to host
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => {
                        const isFull = room.players.length >= 2;
                        const isFinished = room.status === 'finished';

                        return (
                            <div
                                key={room.roomId}
                                className="card flex flex-col hover:-translate-y-1 hover:border-brand-500/30 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-2">
                                        <span className={`badge ${room.mode === 'roast' ? 'bg-orange-900/40 text-orange-400' : 'bg-blue-900/40 text-blue-400'}`}>
                                            {room.mode === 'roast' ? '🔥 Roast' : '🎓 Debate'}
                                        </span>
                                        <span className="badge bg-surface-100 text-gray-300">
                                            {room.players.length}/2
                                        </span>
                                    </div>
                                    {isFinished && <span className="text-xs text-red-400 font-semibold uppercase">Ended</span>}
                                    {room.status === 'active' && <span className="text-xs text-brand-400 font-semibold uppercase animate-pulse">Live</span>}
                                </div>

                                <h3 className="font-display font-bold text-lg mb-1 truncate">{room.name}</h3>
                                <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">
                                    <span className="font-semibold text-gray-300">Topic:</span> {room.topic}
                                </p>

                                <button
                                    onClick={() => handleJoin(room.roomId)}
                                    disabled={isFull && room.status !== 'active'}
                                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${isFull
                                        ? 'bg-surface-100 hover:bg-surface-200 text-gray-300'
                                        : 'bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-white border border-brand-500/30'
                                        }`}
                                >
                                    {isFinished ? 'View Results' : isFull ? 'Spectate' : 'Join Match'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LobbyPage;
