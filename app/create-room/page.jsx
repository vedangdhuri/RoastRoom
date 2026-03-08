'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { roomService } from '../../services/roomService';
import { useAuthStore } from '../../store/authStore';

const TOPIC_SUGGESTIONS = [
    "Is water wet?",
    "Pineapple on pizza: Genus or Sin?",
    "Who would win: 1 billion lions or the sun?",
    "Hot dogs are technically sandwiches.",
    "Describe your opponent's fashion sense."
];

export default function CreateRoomPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: `${user?.username || 'Player'}'s Arena`,
        mode: 'debate',
        topic: '',
        isPrivate: false,
        maxRounds: 3
    });

    const handleSuggestTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        setFormData(prev => ({ ...prev, topic: randomTopic }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.topic.trim()) return toast.error('Please provide a topic');

        setLoading(true);
        try {
            const room = await roomService.createRoom(formData);
            toast.success('Room created!');
            router.push(`/room/${room.roomId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="font-display font-bold text-4xl mb-2">Configure Your Match</h1>
                <p className="text-gray-400">Set the rules and invite challengers.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Room Name</label>
                        <input
                            type="text"
                            required
                            maxLength={30}
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Mode Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">Game Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.mode === 'debate'
                                    ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500'
                                    : 'bg-dark-200 border-white/10 hover:border-white/20'
                                }`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="debate"
                                    className="hidden"
                                    checked={formData.mode === 'debate'}
                                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                />
                                <div className="text-2xl mb-2">🎓</div>
                                <h3 className="font-bold mb-1">Debate</h3>
                                <p className="text-xs text-gray-400">Formal arguments. Scored heavily on logic and clarity. (60s timer)</p>
                            </label>

                            <label className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.mode === 'roast'
                                    ? 'bg-orange-900/20 border-orange-500 ring-1 ring-orange-500'
                                    : 'bg-dark-200 border-white/10 hover:border-white/20'
                                }`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="roast"
                                    className="hidden"
                                    checked={formData.mode === 'roast'}
                                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                />
                                <div className="text-2xl mb-2">🔥</div>
                                <h3 className="font-bold mb-1">Roast</h3>
                                <p className="text-xs text-gray-400">No holds barred. Scored on creativity and humor. (30s timer)</p>
                            </label>
                        </div>
                    </div>

                    {/* Topic */}
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-sm font-medium text-gray-300">Topic / Premise</label>
                            <button
                                type="button"
                                onClick={handleSuggestTopic}
                                className="text-xs text-brand-400 hover:text-brand-300"
                            >
                                Surprise me 🎲
                            </button>
                        </div>
                        <textarea
                            required
                            maxLength={150}
                            rows={3}
                            className="input resize-none"
                            placeholder="e.g., Explain why cats are superior to dogs..."
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary px-8 ${formData.mode === 'roast' ? 'bg-orange-600 hover:bg-orange-500 glow-red' : 'bg-blue-600 hover:bg-blue-500'}`}
                        >
                            {loading ? 'Igniting...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
