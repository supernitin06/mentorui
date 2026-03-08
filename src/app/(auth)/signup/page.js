"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Mail, Lock, User, UserGroup, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [role, setRole] = useState("parent");

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative py-20">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full z-0" />

            <GlassCard className="w-full max-w-lg relative z-10 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Join Mentora</h1>
                    <p className="text-zinc-500">Choose your role and start your journey</p>
                </div>

                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => setRole("parent")}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${role === "parent" ? "border-neon-orange bg-neon-orange/5 text-neon-orange" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${role === "parent" ? "bg-neon-orange/20" : "bg-zinc-900"}`}>
                            <User size={24} />
                        </div>
                        <span className="font-bold">Parent</span>
                    </button>
                    <button
                        onClick={() => setRole("mentor")}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${role === "mentor" ? "border-neon-blue bg-neon-blue/5 text-neon-blue" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${role === "mentor" ? "bg-neon-blue/20" : "bg-zinc-900"}`}>
                            <User size={24} />
                        </div>
                        <span className="font-bold">Mentor</span>
                    </button>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-orange outline-none transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-orange outline-none transition-colors"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-orange outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <NeonButton variant={role === "parent" ? "orange" : "blue"} className="w-full h-12 flex items-center justify-center gap-2 mt-4">
                        Create Account <ArrowRight size={18} />
                    </NeonButton>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-neon-orange hover:underline font-medium">
                        Login
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
