"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eraser, Pencil, Download, Trash2 } from "lucide-react";

export default function DrawNote({ isOpen, onClose }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#00f2ff"); // Neon blue
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth * 0.8;
            canvas.height = window.innerHeight * 0.7;
            const ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
        }
    }, [isOpen]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const download = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "note.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Toolbar */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Quick Notes</h3>
                                <div className="h-6 w-[1px] bg-zinc-800" />
                                <div className="flex gap-2">
                                    <button onClick={() => setColor("#00f2ff")} className={`w-6 h-6 rounded-full bg-[#00f2ff] ${color === "#00f2ff" ? "ring-2 ring-white" : ""}`} />
                                    <button onClick={() => setColor("#ff5a00")} className={`w-6 h-6 rounded-full bg-[#ff5a00] ${color === "#ff5a00" ? "ring-2 ring-white" : ""}`} />
                                    <button onClick={() => setColor("#bd00ff")} className={`w-6 h-6 rounded-full bg-[#bd00ff] ${color === "#bd00ff" ? "ring-2 ring-white" : ""}`} />
                                    <button onClick={() => setColor("#ffffff")} className={`w-6 h-6 rounded-full bg-white ${color === "#ffffff" ? "ring-2 ring-white" : ""}`} />
                                </div>
                                <div className="h-6 w-[1px] bg-zinc-800" />
                                <button onClick={clearCanvas} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Clear">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={download} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors">
                                    <Download size={16} /> Save
                                </button>
                                <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Canvas Area */}
                        <div className="relative flex-1 bg-zinc-950 cursor-crosshair">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
