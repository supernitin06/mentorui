"use client";
import { useParams } from "next/navigation";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { useGetSessionsByLessonQuery } from "@/store/sessionApi";
import { useGetLessonByIdQuery } from "@/store/lessonApi";
import { Calendar, Video, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentLessonSessionsPage() {
    const { id } = useParams();
    const { data: lessonResponse, isLoading: lessonLoading } = useGetLessonByIdQuery(id);
    const { data: sessionsResponse, isLoading: sessionsLoading } = useGetSessionsByLessonQuery(id);

    const lesson = lessonResponse?.data || lessonResponse;
    const sessions = sessionsResponse?.data || sessionsResponse || [];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/student/lessons" className="p-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {lessonLoading ? "Loading Course..." : lesson?.name}
                    </h1>
                    <p className="text-zinc-500">Track your progress and attend upcoming sessions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sessions List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Course Curriculum
                        <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                            {sessions.length} Sessions
                        </span>
                    </h2>

                    <div className="space-y-4">
                        {sessionsLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800" />
                            ))
                        ) : sessions.length === 0 ? (
                            <GlassCard className="p-12 text-center border-dashed border-zinc-800">
                                <Video className="mx-auto text-zinc-700 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-white">No Sessions Scheduled</h3>
                                <p className="text-zinc-500 max-w-xs mx-auto mt-2">There are no sessions currently listed for this track. Please check back later or contact your mentor.</p>
                            </GlassCard>
                        ) : sessions.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard className="p-6 group hover:border-neon-blue/30 transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-neon-blue font-bold shrink-0 group-hover:border-neon-blue/30 transition-colors">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-neon-blue transition-colors">{session.topic}</h3>
                                                <p className="text-sm text-zinc-500 mt-1">{session.summary}</p>
                                                <div className="flex flex-wrap gap-4 mt-4">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                                                        <Calendar size={14} />
                                                        {session.date ? new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <NeonButton variant="blue" className="px-4 py-2 text-xs font-bold flex items-center gap-2 h-auto">
                                                <Video size={14} /> Join
                                            </NeonButton>
                                            <button className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-bold hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-2">
                                                <FileText size={14} /> Resources
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <GlassCard className="p-0 overflow-hidden border-zinc-800">
                        <div className="bg-zinc-950/50 p-6 border-b border-zinc-900">
                            <h3 className="font-bold text-white">Course Progress</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between font-bold text-sm">
                                <span className="text-zinc-500">Completed Sessions</span>
                                <span className="text-neon-blue text-lg">0 / {sessions.length}</span>
                            </div>
                            <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800">
                                <div className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
                            </div>
                            <div className="pt-4 border-t border-zinc-900">
                                <div className="flex items-center gap-3 text-sm text-zinc-400 bg-neon-green/5 p-4 rounded-xl border border-neon-green/10">
                                    <CheckCircle size={20} className="text-neon-green shrink-0" />
                                    <div>
                                        <p className="font-bold text-neon-green">Next Step</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">Attend your first scheduled session to begin tracking.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 border-zinc-800" style={{ background: 'linear-gradient(135deg, rgba(188,19,254,0.08), rgba(0,242,255,0.05))', borderColor: 'rgba(188,19,254,0.15)' }}>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            Instructor Info
                        </h3>
                        {lessonLoading ? (
                            <div className="h-10 bg-zinc-900/50 animate-pulse rounded-lg" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-orange to-neon-purple p-[2px]">
                                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white font-bold">
                                        {lesson?.mentor?.name?.charAt(0) || "M"}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{lesson?.mentor?.name}</p>
                                    <p className="text-neon-blue text-xs mt-0.5">{lesson?.mentor?.email}</p>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
