"use client";
import { useState } from "react";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { Calendar, Users, Video, Clock, Bookmark, ArrowRight } from "lucide-react";
import { useGetLessonsByMentorQuery } from "@/store/lessonApi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MentorSchedulePage() {
    const [activeTab, setActiveTab] = useState("today");
    const { data: response, isLoading } = useGetLessonsByMentorQuery();

    // The query returns either { data: [...] } or the array itself depending on structure
    const lessons = response?.data || response || [];

    // --- AGGREGATE SESSIONS ---
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const allSessions = [];
    lessons.forEach(lesson => {
        if (lesson.sessions && Array.isArray(lesson.sessions)) {
            lesson.sessions.forEach(session => {
                allSessions.push({
                    ...session,
                    lessonId: lesson.id,
                    lessonName: lesson.name,
                });
            });
        }
    });

    const todaySessions = allSessions.filter(session => {
        if (!session.date) return false;
        const sessionDateStr = new Date(session.date).toISOString().split("T")[0];
        return sessionDateStr === todayStr;
    });

    const upcomingSessions = allSessions.filter(session => {
        if (!session.date) return false;
        const sessionDate = new Date(session.date);
        return sessionDate > today && sessionDate.toISOString().split("T")[0] !== todayStr;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const tabs = [
        { id: "today", label: "Today's Sessions", icon: Clock, count: todaySessions.length },
        { id: "upcoming", label: "Upcoming", icon: Calendar, count: upcomingSessions.length },
        { id: "all", label: "My Tracks", icon: Bookmark, count: lessons.length },
    ];

    const todayFormatted = today.toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Teaching Schedule</h1>
                <p className="text-zinc-500 mt-1">{todayFormatted}</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1 rounded-2xl glass-card border border-zinc-800 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                            ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/30 shadow-[0_0_12px_rgba(0,210,255,0.1)]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id
                            ? "bg-neon-blue/20 text-neon-blue"
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
                        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
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
                        {/* Banner */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border border-neon-blue/20 bg-neon-blue/5">
                            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Schedule</p>
                                <p className="text-white font-bold">Your classes for today</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-xs font-black uppercase tracking-wider hidden sm:block">
                                {todaySessions.length} {todaySessions.length === 1 ? "Session" : "Sessions"}
                            </span>
                        </div>

                        {todaySessions.length === 0 ? (
                            <GlassCard className="p-16 text-center border-dashed border-zinc-800">
                                <Clock className="mx-auto text-zinc-700 mb-4" size={52} />
                                <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled Today</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">
                                    You don't have any classes to teach today. Take some time to prepare upcoming materials!
                                </p>
                            </GlassCard>
                        ) : (
                            <div className="space-y-4">
                                {todaySessions.map((session, i) => (
                                    <motion.div key={session.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
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
                                                                <Bookmark size={13} />
                                                                {session.lessonName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                                    <NeonButton variant="blue" className="h-10 px-5 text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                                                        <Video size={14} /> Start Class
                                                    </NeonButton>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : activeTab === "upcoming" ? (
                    <motion.div
                        key="upcoming"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {upcomingSessions.length === 0 ? (
                            <GlassCard className="p-16 text-center border-dashed border-zinc-800">
                                <Calendar className="mx-auto text-zinc-700 mb-4" size={52} />
                                <h3 className="text-xl font-bold text-white mb-2">No Upcoming Classes</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">
                                    You don't have any classes scheduled beyond today. Head to the Lessons tab to add new sessions.
                                </p>
                                <Link href="/dashboard/mentor/lessons" className="inline-block mt-6">
                                    <NeonButton variant="blue" className="h-10 px-6 text-sm">
                                        Manage Lessons
                                    </NeonButton>
                                </Link>
                            </GlassCard>
                        ) : (
                            <div className="space-y-4">
                                {upcomingSessions.map((session, i) => (
                                    <motion.div key={session.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                        <GlassCard className="p-6 border-l-4 border-l-transparent group hover:border-zinc-700 transition-all border-zinc-800/80 bg-zinc-900/40">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-500 shrink-0">
                                                        <span className="text-neon-purple uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                                                        <span className="text-white text-lg leading-none">{new Date(session.date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-md group-hover:text-neon-purple transition-colors leading-tight">
                                                            {session.topic || "Untitled Session"}
                                                        </h3>
                                                        <p className="text-zinc-500 text-sm mt-1 mb-2 line-clamp-1">{session.summary || "No summary provided."}</p>
                                                        <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                                                            <Bookmark size={13} /> Track: {session.lessonName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Link href="/dashboard/mentor/lessons">
                                                        <button className="h-10 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs uppercase tracking-widest text-zinc-300 transition-colors">
                                                            Edit Session
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
                        key="all"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {lessons.length === 0 ? (
                            <GlassCard className="p-16 text-center border-dashed border-zinc-800">
                                <Bookmark className="mx-auto text-zinc-700 mb-4" size={52} />
                                <h3 className="text-xl font-bold text-white mb-2">No Learning Tracks</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">Create lessons and add sessions to build your teaching portfolio.</p>
                            </GlassCard>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {lessons.map((lesson, i) => (
                                    <motion.div key={lesson.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                                        <GlassCard className="p-6 group hover:border-neon-blue/30 transition-all duration-300 h-full border-zinc-800 flex flex-col">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-black text-neon-blue group-hover:border-neon-blue/30 group-hover:scale-105 transition-all shrink-0">
                                                    {lesson.name?.charAt(0) || "T"}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-neon-blue transition-colors">
                                                        {lesson.name}
                                                    </h3>
                                                    <p className="text-xs text-zinc-500 mt-1 font-medium">
                                                        {lesson.sessions?.length || 0} Total Sessions
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                                                {lesson.description || "No description."}
                                            </p>
                                            <div className="pt-4 border-t border-zinc-900 flex justify-end">
                                                <Link href="/dashboard/mentor/lessons">
                                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-neon-blue flex items-center gap-1 uppercase tracking-widest transition-colors">
                                                        Manage Track <ArrowRight size={14} />
                                                    </span>
                                                </Link>
                                            </div>
                                        </GlassCard>
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
