"use client";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Users, Mail, Phone, ExternalLink, MoreVertical, Edit2, Shield, Layout, Search, Grid } from "lucide-react";
import { useGetStudentsByParentQuery } from "@/store/studentApi";
import { motion } from "framer-motion";

export default function ParentStudentsPage() {
    const { data: response, isLoading, isError } = useGetStudentsByParentQuery();
    const students = response?.data || response || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
                    <p className="text-zinc-500 mt-1">Review and manage the education profiles of your registered students.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Active Students", value: students.length, color: "text-neon-orange" },
                    { label: "Pending Assignments", value: "1", color: "text-zinc-400" },
                    { label: "Avg. Attendance", value: "94%", color: "text-neon-green" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="py-6 px-8 flex flex-col items-center sm:items-start">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    </GlassCard>
                ))}
            </div>

            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-neon-orange transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500">
                        <Grid size={20} />
                    </button>
                    <button className="p-2.5 bg-zinc-900 border border-neon-orange/20 rounded-xl text-neon-orange">
                        <Layout size={20} />
                    </button>
                </div>
            </GlassCard>

            {/* Students Table/List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-neon-orange border-t-transparent rounded-full animate-spin" />
                </div>
            ) : isError ? (
                <div className="p-10 text-center bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500">
                    Failed to load students.
                </div>
            ) : (
                <div className="space-y-4">
                    {students.map((student, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={student.id}
                        >
                            <GlassCard className="p-0 overflow-hidden group hover:border-neon-orange/40 transition-all duration-500">
                                <div className="p-6">
                                    <div className="flex flex-col xl:flex-row gap-8">
                                        {/* Avatar & Basic Info */}
                                        <div className="flex items-start gap-6 flex-1 min-w-[300px]">
                                            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-3xl text-zinc-600 group-hover:bg-neon-orange/5 group-hover:text-neon-orange transition-all overflow-hidden shrink-0 shadow-2xl relative">
                                                {student.studentimage ? (
                                                    <img
                                                        src={student.studentimage.startsWith('http') ? student.studentimage : `http://localhost:5000/${student.studentimage}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    student.firstName?.charAt(0)
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold group-hover:text-neon-orange transition-colors">
                                                        {student.firstName} {student.lastName}
                                                    </h3>
                                                    <span className="px-2 py-0.5 rounded-md bg-neon-green/10 border border-neon-green/20 text-[10px] font-bold text-neon-green uppercase tracking-widest">
                                                        {student.status || 'Active'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                        <Mail size={14} className="text-neon-orange/50" />
                                                        {student.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                        <Shield size={14} className="text-neon-orange/50" />
                                                        {student.age || 'N/A'} Years Old • {student.gender}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parent Info */}
                                        <div className="flex flex-col gap-1 px-8 xl:border-x border-zinc-900 min-w-[200px]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Guardian / Parent</span>
                                            <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                                    {student.parent?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-200">{student.parent?.name}</p>
                                                    <p className="text-[10px] text-zinc-500">{student.parent?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lessons Grid */}
                                        <div className="flex-1 min-w-[300px]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 block">Enrolled Courses</span>
                                            <div className="flex flex-wrap gap-2">
                                                {student.lessonAssigns && student.lessonAssigns.length > 0 ? (
                                                    student.lessonAssigns.map((assign, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-neon-blue/5 border border-neon-blue/20 rounded-xl">
                                                            <div className="p-1 bg-neon-blue/20 rounded-md">
                                                                <Grid size={12} className="text-neon-blue" />
                                                            </div>
                                                            <span className="text-xs font-medium text-zinc-300">{assign.lesson?.name}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs italic text-zinc-600 py-2">No lessons assigned yet</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end xl:flex-col xl:justify-center gap-2 border-t xl:border-t-0 xl:border-l border-zinc-900 pt-4 xl:pt-0 xl:pl-6">
                                            <button className="p-3 rounded-xl bg-zinc-900 text-zinc-500 hover:text-neon-orange hover:bg-neon-orange/5 border border-zinc-800 transition-all hover:scale-110 active:scale-95">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-all hover:scale-110 active:scale-95 relative group/btn">
                                                <ExternalLink size={18} />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">View Profile</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Info Bar */}
                                    {student.notes && (
                                        <div className="mt-6 pt-4 border-t border-dashed border-zinc-900 flex items-start gap-3">
                                            <div className="p-1.5 bg-zinc-900 rounded-lg shrink-0 mt-0.5">
                                                <Phone size={12} className="text-zinc-600" />
                                            </div>
                                            <p className="text-xs text-zinc-500 leading-relaxed italic line-clamp-1">
                                                &quot;{student.notes}&quot;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
