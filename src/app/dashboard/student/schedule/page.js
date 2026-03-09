"use client";
import { useState } from "react";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { Calendar, BookOpen, Video, Clock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useGetLessonAssignToStudentQuery } from "@/store/lessonApi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StudentSchedulePage() {
    const [activeTab, setActiveTab] = useState("today");

    const { data: response, isLoading } = useGetLessonAssignToStudentQuery();
    const assignments = response?.data || response || [];
    const lessons = assignments.filter(a => a.lesson).map(a => a.lesson);

    // --- TODAY'S SESSIONS ---
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todaySessions = [];
    lessons.forEach(lesson => {
        (lesson.sessions || []).forEach(session => {
            const sessionDateStr = new Date(session.date).toISOString().split("T")[0];
            if (sessionDateStr === todayStr) {
                todaySessions.push({
                    ...session,
                    lessonName: lesson.name,
                    lessonId: lesson.id,
                    mentorName: lesson.mentor?.name,
                });
            }
        });
    });

    // --- NEW LESSONS (added in last 7 days, sorted newest first) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newLessons = [...lessons]
        .filter(l => l.createdAt && new Date(l.createdAt) >= sevenDaysAgo)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // If no createdAt available, just show all lessons sorted by id desc as "new"
    const displayNewLessons = newLessons.length > 0 ? newLessons : [...lessons].reverse();

    const tabs = [
        { id: "today", label: "Today's Sessions", icon: Calendar, count: todaySessions.length },
        { id: "new", label: "New Lessons", icon: Sparkles, count: displayNewLessons.length },
    ];

    const todayFormatted = today.toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">My Schedule</h1>
                <p className="text-zinc-500 mt-1">{todayFormatted}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl glass-card border border-zinc-800 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                                ? "bg-neon-orange/15 text-neon-orange border border-neon-orange/30 shadow-[0_0_12px_rgba(255,90,0,0.1)]"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id
                                ? "bg-neon-orange/20 text-neon-orange"
                                : "bg-zinc-800 text-zinc-500"
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center py-24"
                    >
                        <div className="w-12 h-12 border-4 border-neon-orange border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                ) : activeTab === "today" ? (
                    <motion.div
                        key="today"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {/* Today's date banner */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border border-neon-blue/20 bg-neon-blue/5">
                            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Showing sessions for</p>
                                <p className="text-white font-bold">{todayFormatted}</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-xs font-black uppercase tracking-wider">
                                {todaySessions.length} {todaySessions.length === 1 ? "Session" : "Sessions"}
                            </span>
                        </div>

                        {todaySessions.length === 0 ? (
                            <GlassCard className="p-16 text-center border-dashed border-zinc-800">
                                <Calendar className="mx-auto text-zinc-700 mb-4" size={52} />
                                <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled Today</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">
                                    You have no sessions scheduled for today. Enjoy your free time or catch up on your learning tracks!
                                </p>
                                <Link href="/dashboard/student/lessons" className="inline-block mt-6">
                                    <NeonButton variant="orange" className="h-10 px-6 text-sm">
                                        Browse My Courses
                                    </NeonButton>
                                </Link>
                            </GlassCard>
                        ) : (
                            <div className="space-y-4">
                                {todaySessions.map((session, i) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <GlassCard className="p-6 border-l-4 border-l-neon-blue group hover:border-neon-blue/40 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue font-black text-lg shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-black text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/20 uppercase tracking-widest">Live Today</span>
                                                        </div>
                                                        <h3 className="font-bold text-white text-lg group-hover:text-neon-blue transition-colors leading-tight">
                                                            {session.topic || "Session " + (i + 1)}
                                                        </h3>
                                                        {session.summary && (
                                                            <p className="text-zinc-500 text-sm mt-1 line-clamp-1">{session.summary}</p>
                                                        )}
                                                        <div className="flex flex-wrap items-center gap-4 mt-3">
                                                            <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                                                                <BookOpen size={13} />
                                                                {session.lessonName}
                                                            </span>
                                                            {session.mentorName && (
                                                                <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                                                                    <CheckCircle2 size={13} className="text-neon-green" />
                                                                    {session.mentorName}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                                                                <Clock size={13} />
                                                                {new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                                    <NeonButton variant="blue" className="h-10 px-5 text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                                                        <Video size={14} /> Join Now
                                                    </NeonButton>
                                                    <Link href={`/dashboard/student/lessons/${session.lessonId}`}>
                                                        <button className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                                                            View Track <ArrowRight size={12} />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="new"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {/* New lessons banner */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border border-neon-orange/20 bg-neon-orange/5">
                            <div className="w-10 h-10 rounded-xl bg-neon-orange/10 border border-neon-orange/20 flex items-center justify-center text-neon-orange shrink-0">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Recently Added</p>
                                <p className="text-white font-bold">Newly Assigned Learning Tracks</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full bg-neon-orange/10 text-neon-orange border border-neon-orange/20 text-xs font-black uppercase tracking-wider">
                                {displayNewLessons.length} Lessons
                            </span>
                        </div>

                        {displayNewLessons.length === 0 ? (
                            <GlassCard className="p-16 text-center border-dashed border-zinc-800">
                                <Sparkles className="mx-auto text-zinc-700 mb-4" size={52} />
                                <h3 className="text-xl font-bold text-white mb-2">No New Lessons</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">No lessons were recently added to your account.</p>
                            </GlassCard>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayNewLessons.map((lesson, i) => (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <Link href={`/dashboard/student/lessons/${lesson.id}`}>
                                            <GlassCard className="p-6 group hover:border-neon-orange/40 cursor-pointer transition-all duration-300 h-full border-zinc-800 relative overflow-hidden">
                                                {/* NEW badge */}
                                                <span className="absolute top-4 right-4 text-[9px] font-black text-neon-orange bg-neon-orange/10 border border-neon-orange/20 px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>

                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-black text-neon-orange group-hover:border-neon-orange/30 group-hover:scale-105 transition-all shrink-0">
                                                        {lesson.name?.charAt(0) || "C"}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-neon-orange transition-colors pr-8">
                                                            {lesson.name}
                                                        </h3>
                                                        {lesson.mentor && (
                                                            <p className="text-xs text-zinc-500 mt-1 font-medium">
                                                                Instructor: {lesson.mentor.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                                                    {lesson.description || "No description provided."}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                                                        <BookOpen size={13} />
                                                        {(lesson.sessions || []).length} Sessions
                                                    </div>
                                                    <span className="text-xs font-bold text-neon-orange flex items-center gap-1 uppercase tracking-widest">
                                                        Open Track <ArrowRight size={13} />
                                                    </span>
                                                </div>
                                            </GlassCard>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
