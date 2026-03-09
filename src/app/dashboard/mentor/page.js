"use client";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { useGetLessonsByMentorQuery } from "@/store/lessonApi";
import { useGetStudentsByMentorQuery } from "@/store/studentApi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MentorDashboard() {
    const { data: lessonsResponse, isLoading: lessonsLoading } = useGetLessonsByMentorQuery();
    const { data: studentsResponse, isLoading: studentsLoading } = useGetStudentsByMentorQuery();

    const lessons = lessonsResponse?.data || lessonsResponse || [];
    const students = studentsResponse?.data || studentsResponse || [];

    const stats = [
        { label: "Total Students", value: students.length, icon: Users, color: "text-neon-blue", bg: "bg-neon-blue/10" },
        { label: "Lessons", value: lessons.length, icon: BookOpen, color: "text-neon-orange", bg: "bg-neon-orange/10" },
        { label: "Total Earnings", value: "$3,450", icon: DollarSign, color: "text-neon-green", bg: "bg-neon-green/10" },
        { label: "Avg Rating", value: "4.9", icon: TrendingUp, color: "text-neon-purple", bg: "bg-neon-purple/10" },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="flex flex-col gap-4 group hover:border-zinc-700 transition-all">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </section>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Lessons Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Active Learning Tracks</h2>
                        <Link href="/dashboard/mentor/lessons">
                            <NeonButton variant="blue" className="h-10 px-4 text-sm flex items-center gap-2">
                                <Plus size={16} /> Create Lesson
                            </NeonButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {(lessonsLoading || studentsLoading) ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800" />
                            ))
                        ) : lessons.length === 0 ? (
                            <GlassCard className="p-12 border border-dashed border-zinc-800 text-center">
                                <BookOpen className="mx-auto text-zinc-700 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-white">No tracks yet</h3>
                                <p className="text-zinc-500 max-w-xs mx-auto mt-1">Start by creating your first lesson for your students.</p>
                            </GlassCard>
                        ) : lessons.slice(0, 3).map((lesson) => (
                            <GlassCard key={lesson.id} className="group hover:border-neon-blue/40 transition-all duration-500 py-6 px-8 flex flex-col md:flex-row gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold text-neon-blue shrink-0 self-center md:self-start group-hover:border-neon-blue/30 transition-colors">
                                    {lesson.name?.charAt(0) || "L"}
                                </div>
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">{lesson.name}</h3>
                                        <span className="bg-neon-blue/10 text-neon-blue px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-center sm:self-auto border border-neon-blue/20">Live Course</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm line-clamp-1">{lesson.description}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                            <Users size={12} className="text-zinc-700" />
                                            Enrolled: {students.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-6 shrink-0">
                                    <Link href="/dashboard/mentor/lessons">
                                        <button className="text-neon-orange font-bold text-sm hover:underline flex items-center gap-1 uppercase tracking-widest">
                                            Manage <ArrowRight size={16} />
                                        </button>
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Schedule Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
                    <div className="space-y-4">
                        {students.length > 0 ? (
                            <div className="space-y-4">
                                {students.slice(0, 2).map((student, i) => (
                                    <GlassCard key={i} className="p-6 border-l-4 border-l-neon-purple">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-bold text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20 uppercase tracking-widest">Office Hours</span>
                                            <span className="text-[10px] font-bold text-zinc-500">10:00 AM</span>
                                        </div>
                                        <h4 className="font-bold text-white text-base">Progress Review</h4>
                                        <p className="text-xs font-medium text-zinc-500 mt-1">Learner: {student.firstName} {student.lastName}</p>
                                        <NeonButton variant="purple" className="w-full mt-6 h-10 text-xs font-bold uppercase tracking-widest">Launch Portal</NeonButton>
                                    </GlassCard>
                                ))}
                            </div>
                        ) : (
                            <GlassCard className="p-10 text-center border-dashed border-zinc-800">
                                <Calendar className="mx-auto text-zinc-700 mb-3" size={32} />
                                <p className="text-sm text-zinc-500 italic font-medium">No sessions scheduled for today</p>
                            </GlassCard>
                        )}

                        <GlassCard className="p-6 relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, rgba(0,242,255,0.1), rgba(188,19,254,0.15))', border: '1px solid rgba(0,242,255,0.15)' }}>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg text-white mb-1">Weekly Overview</h3>
                                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">You have 4 feedback reports pending for your active students.</p>
                                <NeonButton variant="blue" className="w-full h-10 text-xs font-bold uppercase tracking-widest">Review Now</NeonButton>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <TrendingUp size={100} />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
