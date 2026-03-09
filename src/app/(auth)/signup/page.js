"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { useRegisterMentorMutation } from "@/store/mentorApi";
import { useRegisterParentMutation } from "@/store/parentApi";
import { setCredentials, selectIsAuthenticated, selectCurrentRole } from "@/store/authSlice";

export default function SignupPage() {
    const [role, setRole] = useState("parent");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentRole = useSelector(selectCurrentRole);

    useEffect(() => {
        if (isAuthenticated && currentRole) {
            router.replace(`/dashboard/${currentRole}`);
        }
    }, [isAuthenticated, currentRole, router]);

    const [registerMentor, { isLoading: isMentorLoading }] = useRegisterMentorMutation();
    const [registerParent, { isLoading: isParentLoading }] = useRegisterParentMutation();

    const isLoading = isMentorLoading || isParentLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);

            if (imageFile) {
                const fieldName = role === "mentor" ? "mentorimage" : "parentimage";
                formData.append(fieldName, imageFile);
            }

            if (role === "mentor") {
                formData.append("phone", "1234567890");
                formData.append("address", "Default Address");
                formData.append("specialization", "General");
                await registerMentor(formData).unwrap();
            } else {
                formData.append("phone", "1234567890");
                formData.append("address", "Default Address");
                formData.append("age", 30);
                formData.append("gender", "OTHER");
                await registerParent(formData).unwrap();
            }

            // After register, backend might not auto-login, so let's redirect to login
            router.replace("/login");
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative py-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full z-0" />

            <GlassCard className="w-full max-w-lg relative z-10 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Join Mentora</h1>
                    <p className="text-zinc-500">Choose your role and start your journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => { setRole("parent"); setImagePreview(null); setImageFile(null); }}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${role === "parent" ? "border-neon-orange bg-neon-orange/5 text-neon-orange" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${role === "parent" ? "bg-neon-orange/20" : "bg-zinc-900"}`}>
                            <User size={24} />
                        </div>
                        <span className="font-bold">Parent</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole("mentor"); setImagePreview(null); setImageFile(null); }}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${role === "mentor" ? "border-neon-blue bg-neon-blue/5 text-neon-blue" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${role === "mentor" ? "bg-neon-blue/20" : "bg-zinc-900"}`}>
                            <User size={24} />
                        </div>
                        <span className="font-bold">Mentor</span>
                    </button>
                </div>

                <div className="flex justify-center mb-8">
                    <label className="relative group cursor-pointer block">
                        <div className={`w-24 h-24 rounded-2xl bg-zinc-950 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${role === 'parent' ? 'border-neon-orange/30 group-hover:border-neon-orange' : 'border-neon-blue/30 group-hover:border-neon-blue'}`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <UserPlus size={24} className="mx-auto mb-1 text-zinc-600" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Avatar</span>
                                </div>
                            )}
                        </div>
                        <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-lg shadow-lg ${role === 'parent' ? 'bg-neon-orange text-black' : 'bg-neon-blue text-black'}`}>
                            <UserPlus size={14} />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-${role === 'parent' ? 'orange' : 'blue'} outline-none transition-colors`}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-${role === 'parent' ? 'orange' : 'blue'} outline-none transition-colors`}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:border-neon-${role === 'parent' ? 'orange' : 'blue'} outline-none transition-colors`}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <NeonButton
                        type="submit"
                        variant={role === "parent" ? "orange" : "blue"}
                        className="w-full h-12 flex items-center justify-center gap-2 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight size={18} />
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
