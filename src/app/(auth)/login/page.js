"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useLoginStudentMutation } from "@/store/studentApi";
import { useLoginMentorMutation } from "@/store/mentorApi";
import { useLoginParentMutation } from "@/store/parentApi";
import { setCredentials, selectIsAuthenticated, selectCurrentRole } from "@/store/authSlice";

export default function LoginPage() {
    const [email, setEmail] = useState("nitin@example.com");
    const [password, setPassword] = useState("111111");
    const [role, setRole] = useState("parent"); // Default to parent
    const [error, setError] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentRole = useSelector(selectCurrentRole);

    useEffect(() => {
        if (isAuthenticated && currentRole) {
            router.replace(`/dashboard/${currentRole}`);
        }
    }, [isAuthenticated, currentRole, router]);

    const [loginStudent, { isLoading: isStudentLoading }] = useLoginStudentMutation();
    const [loginMentor, { isLoading: isMentorLoading }] = useLoginMentorMutation();
    const [loginParent, { isLoading: isParentLoading }] = useLoginParentMutation();

    const isLoading = isStudentLoading || isMentorLoading || isParentLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            let result;
            if (role === "student") {
                result = await loginStudent({ email, password }).unwrap();
            } else if (role === "mentor") {
                result = await loginMentor({ email, password }).unwrap();
            } else {
                result = await loginParent({ email, password }).unwrap();
            }

            const user = result.data?.user || result.data?.mentor || result.data?.parent || result.data;
            const token = result.data?.token || result.token;

            dispatch(setCredentials({
                user: user,
                token: token,
                role: role
            }));

            router.replace(`/dashboard/${role}`);
        } catch (err) {
            setError(err.data?.message || err.message || "Login failed. Connection error or invalid credentials.");
        }
    };

    const roles = [
        { id: "parent", label: "Parent", color: "text-neon-orange" },
        { id: "mentor", label: "Mentor", color: "text-neon-blue" },
        { id: "student", label: "Student", color: "text-neon-purple" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full z-0" />

            <GlassCard className="w-full max-w-md relative z-10 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-zinc-500">Enter your credentials to access Mentora</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-2 mb-8 bg-zinc-950/50 p-1 rounded-xl border border-zinc-800">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${role === r.id
                                ? "bg-zinc-800 text-white shadow-lg"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
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

                    <NeonButton
                        type="submit"
                        variant={role === "parent" ? "orange" : role === "mentor" ? "blue" : "purple"}
                        className="w-full h-12 flex items-center justify-center gap-2 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"} <ArrowRight size={18} />
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
