"use client";
import { GlassCard, NeonButton } from "@/components/ui/NeonComponents";
import { BookOpen, Calendar, Clock, Trophy, ArrowRight } from "lucide-react";
import { useGetLessonAssignToStudentQuery } from "@/store/lessonApi";
import Link from "next/link";
import { StudentTodoList, UpcomingAlarms, LearningStreak } from "@/components/DashboardWidgets";

export default function StudentDashboard() {
    const { data: response, isLoading } = useGetLessonAssignToStudentQuery();
    const assignments = response?.data || response || [];

    // Extract lesson from assignments
    const lessons = assignments.filter(a => a.lesson).map(a => a.lesson);

    // Calculate Today's Sessions
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = [];
    lessons.forEach(lesson => {
        if (lesson.sessions) {
            lesson.sessions.forEach(session => {
                const sessionDate = new Date(session.date).toISOString().split('T')[0];
                if (sessionDate === today) {
                    todaySessions.push({
                        ...session,
                        lessonName: lesson.name,
                        mentorName: lesson.mentor?.name
                    });
                }
            });
        }
    });

    const stats = [
        { label: "Enrolled Courses", value: lessons.length, icon: BookOpen, color: "text-neon-blue", bg: "bg-neon-blue/10" },
        { label: "Today's Sessions", value: todaySessions.length, icon: Calendar, color: "text-neon-orange", bg: "bg-neon-orange/10" },
        { label: "Hours Learned", value: "12.5h", icon: Clock, color: "text-neon-green", bg: "bg-neon-green/10" },
        { label: "Achievements", value: "3", icon: Trophy, color: "text-neon-purple", bg: "bg-neon-purple/10" },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="flex flex-col gap-4 group hover:border-zinc-700 transition-all">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </GlassCard>
                ))}
            </section>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Courses */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">My Learning Tracks</h2>
                        <Link href="/dashboard/student/lessons">
                            <button className="text-sm font-bold text-neon-blue hover:underline flex items-center gap-1 uppercase tracking-widest">
                                View All <ArrowRight size={14} />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-2xl border border-zinc-800" />
                            ))
                        ) : lessons.length === 0 ? (
                            <GlassCard className="p-12 border border-dashed border-zinc-800 text-center">
                                <BookOpen className="mx-auto text-zinc-700 mb-4" size={48} />
                                <p className="text-zinc-500 italic">You aren't enrolled in any courses yet. Your parent or mentor can assign lessons to you.</p>
                            </GlassCard>
                        ) : lessons.map((lesson) => (
                            <GlassCard key={lesson.id} className="group hover:border-neon-blue/40 transition-all duration-300 py-6 px-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-2xl text-neon-blue shrink-0 group-hover:border-neon-blue/40 transition-colors overflow-hidden relative">
                                    <img
                                        src={`https://source.unsplash.com/random/200x200/?education,learning,${lesson.name.split(' ')[0]}`}
                                        alt="Course Cover"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                                    <span className="absolute bottom-1 right-2 text-xs font-black text-white">{lesson.name?.charAt(0)}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">{lesson.name}</h3>
                                        <span className="bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Track</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm line-clamp-1">{lesson.description}</p>
                                    {lesson.mentor && (
                                        <p className="text-xs text-zinc-600 mt-2 font-medium">Mentor: {lesson.mentor.name}</p>
                                    )}
                                </div>
                                <div className="flex pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-zinc-900 w-full sm:w-auto pt-4 sm:pt-0 justify-center">
                                    <Link href={`/dashboard/student/lessons/${lesson.id}`}>
                                        <button className="text-sm font-bold text-neon-orange hover:underline flex items-center gap-1 uppercase tracking-widest">
                                            Open Track <ArrowRight size={16} />
                                        </button>
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Widgets */}
                <div className="space-y-6">
                    <LearningStreak />
                    <UpcomingAlarms />
                    <StudentTodoList />

                    <h2 className="text-xl font-bold text-white pt-4">Today's Sessions</h2>

                    {todaySessions.length === 0 ? (
                        <GlassCard className="p-8 text-center border-dashed border-zinc-800">
                            <Calendar className="mx-auto text-zinc-700 mb-3" size={32} />
                            <h3 className="font-bold text-white mb-1">No Classes Today</h3>
                            <p className="text-xs text-zinc-500 font-medium">Your calendar is clear for today!</p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-4">
                            {todaySessions.map((session, i) => (
                                <GlassCard key={i} className="p-6 border-l-4 border-l-neon-blue group">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20 uppercase tracking-widest">Live Now</span>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Today</span>
                                    </div>
                                    <h4 className="font-bold text-white text-base group-hover:text-neon-blue transition-colors line-clamp-1">{session.topic}</h4>
                                    <p className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-tight">{session.lessonName}</p>
                                    <NeonButton variant="blue" className="w-full mt-6 h-10 text-xs font-bold uppercase tracking-widest">Join Session</NeonButton>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
