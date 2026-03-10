"use client";
import { useState } from "react";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { Sparkles, Brain, AlignLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SummarizeFeature() {
    const [inputText, setInputText] = useState("");
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSummarize = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("https://mentor-mcg2.onrender.com/llm/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: inputText }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to summarize text");
            setSummaryData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to parse the summary string into bullet points beautifully
    const parseSummary = (text) => {
        const lines = text.split('\n');
        const points = [];
        let preamble = "";

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                points.push(trimmed.substring(1).trim());
            } else if (/^\d+\./.test(trimmed)) {
                // matches "1. point"
                const pointText = trimmed.replace(/^\d+\./, '').trim();
                points.push(pointText);
            } else if (trimmed !== "") {
                if (points.length === 0) {
                    preamble += (preamble ? " " : "") + trimmed;
                }
            }
        });

        // If no bullet points were found, we just split by sentences.
        if (points.length === 0) {
            const sentences = preamble.split(/(?<=\.)\s+/).filter(Boolean);
            return { preamble: "Here is the summary:", points: sentences };
        }

        return { preamble, points };
    };

    const parsed = summaryData ? parseSummary(summaryData.summary) : null;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Brain className="text-neon-purple" size={32} />
                    AI Text Summarizer
                </h1>
                <p className="text-zinc-500 mt-2">Paste any text or lesson content below, and our super-charged AI will extract the key points.</p>
            </div>

            <GlassCard className="p-6 border-zinc-800">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                        <AlignLeft size={16} /> Content to Summarize
                    </label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your long text, notes, or article here... Example: Artificial Intelligence (AI) is the broad concept of machines simulating human intelligence for problem-solving..."
                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl p-4 outline-none focus:border-neon-purple transition-all resize-none font-medium text-white shadow-inner min-h-[160px]"
                    />
                    <div className="flex justify-end">
                        <NeonButton
                            onClick={handleSummarize}
                            disabled={isLoading || !inputText.trim()}
                            variant="purple"
                            className="flex items-center gap-2 h-12 px-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate Summary
                                </>
                            )}
                        </NeonButton>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
                </div>
            </GlassCard>

            <AnimatePresence>
                {parsed && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 p-4 rounded-2xl border border-neon-blue/20 bg-neon-blue/5">
                            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">AI Generated Response</p>
                                <p className="text-white font-bold">{parsed.preamble || "Here are the key takeaways from the provided text:"}</p>
                            </div>
                            {summaryData.model && (
                                <span className="ml-auto px-3 py-1 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-black uppercase tracking-wider hidden sm:block">
                                    {summaryData.model}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parsed.points.map((point, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <GlassCard className="p-5 h-full group hover:border-neon-purple/40 transition-colors border-zinc-800/80 bg-zinc-900/20">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-black text-sm shrink-0 shadow-[0_0_10px_rgba(188,19,254,0.15)] group-hover:bg-neon-purple group-hover:text-white transition-all">
                                                {idx + 1}
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                                                {point}
                                            </p>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
