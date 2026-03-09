"use client";
import { useState, useEffect } from "react";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { Brain, Sparkles, RefreshCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Game elements: emojis for the memory match
const CARDS = ["🚀", "💡", "🧠", "🔥", "⚡", "⭐", "🎯", "🎲"];

export default function BrainGamesPage() {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    // Initialize game
    const initializeGame = () => {
        // duplicate and shuffle
        const shuffled = [...CARDS, ...CARDS]
            .sort(() => Math.random() - 0.5)
            .map((char, index) => ({ id: index, char }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setWon(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    // Handle card click
    const handleCardClick = (index) => {
        // Cannot click if won, if already flipped, if already solved, or if 2 are currently flipped
        if (won || flipped.includes(index) || solved.includes(index) || flipped.length >= 2) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((m) => m + 1);
            const firstIdx = newFlipped[0];
            const secondIdx = newFlipped[1];

            if (cards[firstIdx].char === cards[secondIdx].char) {
                // Match
                setSolved((s) => {
                    const newSolved = [...s, firstIdx, secondIdx];
                    if (newSolved.length === cards.length) {
                        setWon(true);
                    }
                    return newSolved;
                });
                setFlipped([]);
            } else {
                // No match, clear after delay
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Brain className="text-neon-purple" size={32} />
                    Brain Fresh Hub
                </h1>
                <p className="text-zinc-500 mt-2">Take a break from studying. Train your short-term memory with a quick match game!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Game Area */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-8 border-zinc-800 relative overflow-hidden">
                        {/* Status Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-900 flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Moves</span>
                                <span className="text-lg font-black text-neon-blue">{moves}</span>
                            </div>
                            <NeonButton onClick={initializeGame} variant="purple" className="flex items-center gap-2 px-4 py-2 h-auto text-xs">
                                <RefreshCcw size={14} /> Restart
                            </NeonButton>
                        </div>

                        {/* Win Screen Overlay */}
                        <AnimatePresence>
                            {won && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-neon-orange/30"
                                >
                                    <Trophy size={64} className="text-neon-orange mb-4 drop-shadow-[0_0_20px_rgba(255,90,0,0.5)] animate-bounce" />
                                    <h2 className="text-3xl font-black text-white mb-2">Memory Master!</h2>
                                    <p className="text-zinc-400 mb-6 font-medium">You completed the puzzle in {moves} moves.</p>
                                    <NeonButton onClick={initializeGame} variant="orange" className="h-12 px-8 text-sm font-bold uppercase tracking-widest">
                                        Play Again
                                    </NeonButton>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        <div className="grid grid-cols-4 gap-3 sm:gap-4">
                            {cards.map((card, idx) => {
                                const isFlipped = flipped.includes(idx) || solved.includes(idx);
                                const isSolved = solved.includes(idx);

                                return (
                                    <motion.div
                                        key={idx}
                                        onClick={() => handleCardClick(idx)}
                                        className={`relative aspect-square cursor-pointer rounded-2xl ${isSolved ? 'opacity-50' : 'hover:scale-105'
                                            } transition-all duration-300 transform-gpu`}
                                        style={{ perspective: 1000 }}
                                    >
                                        <motion.div
                                            className="w-full h-full relative"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Front of card (Hidden state) */}
                                            <div
                                                className={`absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-lg ${isFlipped ? 'hidden' : 'block'
                                                    }`}
                                                style={{ backfaceVisibility: 'hidden' }}
                                            >
                                                <div className="w-6 h-6 rounded-full border-4 border-zinc-700 opacity-20" />
                                            </div>

                                            {/* Back of card (Revealed state) */}
                                            <div
                                                className={`absolute inset-0 w-full h-full bg-zinc-950 border rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(188,19,254,0.15)] ${isSolved ? 'border-neon-green text-neon-green bg-green-900/10 shadow-[0_0_15px_rgba(0,255,0,0.1)]' : 'border-neon-purple/50'
                                                    }`}
                                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                            >
                                                {card.char}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <GlassCard className="p-6 border-zinc-800" style={{ background: 'linear-gradient(135deg, rgba(0,210,255,0.08), rgba(188,19,254,0.05))' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-neon-blue" size={24} />
                            <h3 className="font-bold text-white text-lg">Why play?</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-neon-blue font-bold">1.</span>
                                Sharpens short-term memory capacity.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-neon-blue font-bold">2.</span>
                                Provides a quick reset for your brain between intense study sessions.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-neon-blue font-bold">3.</span>
                                Boosts pattern recognition and concentration.
                            </li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-6 border-zinc-800">
                        <h3 className="font-bold text-zinc-300 text-sm uppercase tracking-widest mb-4">High Scores</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/50">
                                <span className="text-sm font-bold text-white flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> You</span>
                                <span className="text-xs font-black text-neon-orange">14 Moves</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/20">
                                <span className="text-sm font-medium text-zinc-400">Mentor Rahul</span>
                                <span className="text-xs font-bold text-zinc-600">18 Moves</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
