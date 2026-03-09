"use client";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/NeonComponents";
import { CheckCircle2, Circle, Flame, Bell, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StudentTodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: "Review advanced geometry notes", completed: false },
        { id: 2, text: "Complete physics module 4", completed: false },
        { id: 3, text: "Read Chapter 2 for English Literature", completed: true },
    ]);
    const [newTodo, setNewTodo] = useState("");

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos([{ id: Date.now(), text: newTodo, completed: false }, ...todos]);
        setNewTodo("");
    };

    const removeTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <GlassCard className="p-6 relative overflow-hidden group border-zinc-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">Daily To-Do List</h3>
                <span className="text-xs bg-neon-orange/10 text-neon-orange px-2 py-1 rounded-md font-bold">
                    {todos.filter(t => t.completed).length}/{todos.length} Done
                </span>
            </div>

            <form onSubmit={addTodo} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-neon-orange transition-colors text-white"
                />
                <button type="submit" className="bg-neon-orange text-black p-2 rounded-xl flex items-center justify-center hover:bg-neon-orange/90 transition-colors">
                    <Plus size={18} strokeWidth={3} />
                </button>
            </form>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {todos.map(todo => (
                        <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl hover:border-zinc-700 transition-colors group/item"
                        >
                            <button onClick={() => toggleTodo(todo.id)} className="text-zinc-500 hover:text-neon-orange transition-colors shrink-0">
                                {todo.completed ? <CheckCircle2 className="text-neon-orange" size={20} /> : <Circle size={20} />}
                            </button>
                            <span className={`text-sm flex-1 truncate transition-all ${todo.completed ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                                {todo.text}
                            </span>
                            <button onClick={() => removeTodo(todo.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all shrink-0">
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {todos.length === 0 && (
                    <p className="text-center text-zinc-500 text-sm py-4 italic">You're all caught up!</p>
                )}
            </div>
        </GlassCard>
    );
}

export function UpcomingAlarms() {
    const alarms = [
        { id: 1, title: "Physics Live Class", time: "10:00 AM", type: "class" },
        { id: 2, title: "Math Assignment Due", time: "11:59 PM", type: "deadline" },
    ];

    return (
        <GlassCard className="p-6 border-zinc-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Bell className="text-neon-blue" size={20} /> Upcoming Reminders
                </h3>
            </div>
            <div className="space-y-3">
                {alarms.map(alarm => (
                    <div key={alarm.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-neon-blue/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] ${alarm.type === 'class' ? 'bg-neon-blue' : 'bg-neon-purple'}`} />
                            <p className="text-sm font-medium text-zinc-200">{alarm.title}</p>
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase bg-zinc-950 px-2 py-1 rounded text-zinc-400 border border-zinc-800">
                            {alarm.time}
                        </span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

export function LearningStreak() {
    return (
        <GlassCard className="p-0 overflow-hidden relative border-zinc-800" style={{ background: 'linear-gradient(135deg, rgba(255,90,0,0.08), rgba(255,0,128,0.05))' }}>
            <div className="p-6 relative z-10 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg text-white mb-1">Learning Streak</h3>
                    <p className="text-xs text-zinc-400">You're on fire! Keep it up 🔥</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                        <Flame size={48} className="text-neon-orange drop-shadow-[0_0_15px_rgba(255,90,0,0.4)] animate-pulse" />
                    </div>
                    <div>
                        <span className="text-4xl font-black text-white">12</span>
                        <span className="text-sm font-bold text-neon-orange uppercase tracking-widest ml-1">Days</span>
                    </div>
                </div>
            </div>

            {/* 7-day mini calendar indicator */}
            <div className="bg-zinc-950/40 p-4 border-t border-zinc-900 flex justify-between px-6">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const isDone = i < 5; // 5 days completed
                    const isToday = i === 5;
                    return (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-500">{day}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isDone
                                    ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/40'
                                    : isToday
                                        ? 'bg-zinc-800 text-white border-zinc-600 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                        : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                                }`}>
                                {isDone ? '✓' : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
