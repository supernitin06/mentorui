"use client";
import { GlassCard } from "@/components/ui/NeonComponents";
import { BookOpen, Search, ArrowRight, Clock } from "lucide-react";
import { useGetLessonAssignToStudentQuery } from "@/store/lessonApi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentLessonsPage() {
    const { data: response, isLoading } = useGetLessonAssignToStudentQuery();
    const assignments = response?.data || response || [];
    const lessons = assignments.filter(a => a.lesson).map(a => a.lesson);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Courses</h1>
                    <p className="text-zinc-500 mt-1">Access all your active learning assignments.</p>
                </div>
            </div>

            <GlassCard className="p-4 flex">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                        type="text"
                        placeholder="Search for a subject..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-neon-blue transition-colors text-white placeholder:text-zinc-600 text-sm"
                    />
                </div>
            </GlassCard>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center p-20 border border-zinc-800 border-dashed rounded-3xl glass-card">
                        <BookOpen className="text-zinc-700 mx-auto mb-4" size={48} />
                        <h2 className="text-xl font-bold text-white">No Assignments Yet</h2>
                        <p className="text-zinc-500 mt-2">Check back here when you've been registered into a course track.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lessons.map((lesson, i) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/dashboard/student/lessons/${lesson.id}`}>
                                    <GlassCard className="p-0 group hover:border-neon-orange/40 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,0,0.07)] transition-all duration-300 flex flex-col h-full overflow-hidden border-zinc-800">
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-neon-orange group-hover:border-neon-orange/30 group-hover:scale-105 transition-all shrink-0">
                                                    {lesson.name?.charAt(0) || "C"}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-white leading-tight group-hover:text-neon-orange transition-colors">{lesson.name}</h3>
                                                    {lesson.mentor && (
                                                        <p className="text-xs font-medium text-zinc-500">Instructor: {lesson.mentor.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">{lesson.description}</p>
                                        </div>
                                        <div className="border-t border-zinc-900 bg-zinc-950/40 p-4 flex justify-between items-center group-hover:bg-neon-orange/5 transition-colors">
                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                                                <Clock size={14} /> Tracking Active
                                            </div>
                                            <button className="text-sm font-bold text-neon-orange flex items-center gap-1 uppercase tracking-widest">
                                                Open <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
