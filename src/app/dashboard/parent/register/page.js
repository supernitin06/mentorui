"use client";
import { useState } from "react";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { UserPlus, Mail, Lock, User, Phone, MapPin, Calendar, Image as ImageIcon, Camera, ArrowRight } from "lucide-react";
import { useRegisterStudentMutation } from "@/store/studentApi";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";

export default function ParentRegisterStudentPage() {
    const [registerStudent, { isLoading }] = useRegisterStudentMutation();
    const toast = useToast();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: "",
        gender: "Male",
        address: "",
        phone: "",
        dateOfBirth: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'age') {
                    data.append(key, Number(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (imageFile) {
                data.append("studentimage", imageFile);
            }

            await registerStudent(data).unwrap();

            toast({ type: "success", message: `Student "${formData.firstName} ${formData.lastName}" registered successfully!` });
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                age: "",
                gender: "Male",
                address: "",
                phone: "",
                dateOfBirth: "",
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            console.error(err);
            toast({ type: "error", message: err?.data?.message || "Failed to register student." });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Register New Student</h1>
                <p className="text-zinc-500 mt-2">Add a new student account to manage their mentorship and learning journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left side: Avatar Upload (Visual only for now) */}
                    <div className="lg:col-span-1">
                        <GlassCard className="p-8 flex flex-col items-center gap-6 text-center h-full">
                            <label className="relative group cursor-pointer block">
                                <div className="w-32 h-32 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:border-neon-orange/50 transition-all duration-500 overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={40} className="group-hover:scale-110 transition-transform" />
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-neon-orange p-2 rounded-xl shadow-[0_0_15px_#ff5a00]">
                                    <ImageIcon size={16} className="text-black" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <div>
                                <h3 className="font-bold text-white">Student Photo</h3>
                                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Recommended 400x400px.<br />PNG or JPG allowed.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                                className="mt-2 text-xs font-bold text-neon-orange hover:underline uppercase tracking-widest"
                            >
                                {imagePreview ? "Change Photo" : "Upload Photo"}
                            </button>
                        </GlassCard>
                    </div>

                    {/* Right side: Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="p-8 space-y-8">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all"
                                            placeholder="student@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Account Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 px-4 focus:border-neon-orange outline-none transition-all"
                                        placeholder="12"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 px-4 focus:border-neon-orange outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all"
                                        placeholder="+1 234 567 890"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-4 text-zinc-600" size={16} />
                                    <textarea
                                        name="address"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all resize-none"
                                        placeholder="123 Neon Street, Digital City, 90021"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                    <input
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 focus:border-neon-orange outline-none transition-all custom-calendar"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <NeonButton
                                    type="submit"
                                    variant="orange"
                                    className="w-full h-14 flex items-center justify-center gap-3 text-lg font-bold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Finalizing..." : "Register Student Account"} <ArrowRight size={20} />
                                </NeonButton>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </form>
        </div>
    );
}
