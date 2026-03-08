"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would call the API
        window.location.href = "/dashboard/parent";
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full z-0" />

            <GlassCard className="w-full max-w-md relative z-10 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-zinc-500">Enter your credentials to access Mentora</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <NeonButton type="submit" variant="orange" className="w-full h-12 flex items-center justify-center gap-2 mt-4">
                        Login <ArrowRight size={18} />
                    </NeonButton>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-neon-orange hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
