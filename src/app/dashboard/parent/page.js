"use client";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { StudentCard } from "@/components/sections/StudentCard";
import { Plus, Search, Users, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { useGetStudentsByParentQuery } from "@/store/studentApi";
import { useGetLessonsQuery } from "@/store/lessonApi";
import Link from "next/link";

export default function ParentDashboard() {
    const { data: studentsResponse, isLoading: studentsLoading } = useGetStudentsByParentQuery();
    const { data: lessonsResponse, isLoading: lessonsLoading } = useGetLessonsQuery();

    const students = studentsResponse?.data || studentsResponse || [];
    const lessons = lessonsResponse?.data || lessonsResponse || [];

    const totalLessons = students.reduce((acc, student) => acc + (student.lessonAssigns?.length || 0), 0);

    const stats = [
        { label: "Active Students", value: students.length, icon: Users, color: "text-neon-orange", bg: "bg-neon-orange/10" },
        { label: "Enrollments", value: totalLessons, icon: BookOpen, color: "text-neon-blue", bg: "bg-neon-blue/10" },
        { label: "Available Courses", value: lessons.length, icon: Calendar, color: "text-neon-purple", bg: "bg-neon-purple/10" },
    ];

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="flex items-center gap-6 group hover:border-zinc-700 transition-all">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </GlassCard>
                ))}
            </section>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Students Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            My Students <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">{students.length}</span>
                        </h2>
                        <Link href="/dashboard/parent/register">
                            <NeonButton variant="orange" className="h-10 px-4 text-sm flex items-center gap-2">
                                <Plus size={16} /> Add Student
                            </NeonButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {studentsLoading ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="h-44 bg-zinc-900/50 animate-pulse rounded-3xl border border-zinc-800" />
                            ))
                        ) : students.length === 0 ? (
                            <GlassCard className="col-span-2 p-12 text-center border-dashed border-zinc-800">
                                <p className="text-zinc-500 italic">No students registered. Click "Add Student" to begin.</p>
                            </GlassCard>
                        ) : (
                            students.slice(0, 4).map((student) => (
                                <StudentCard
                                    key={student.id}
                                    name={`${student.firstName} ${student.lastName}`}
                                    age={student.age || "N/A"}
                                    lessonsCount={student.lessonAssigns?.length || 0}
                                />
                            ))
                        )}
                    </div>

                    <div className="pt-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Upcoming Tracking</h2>
                            <Link href="/dashboard/parent/students">
                                <button className="text-neon-blue text-sm hover:underline font-bold flex items-center gap-1 uppercase tracking-widest">
                                    View All <ArrowRight size={14} />
                                </button>
                            </Link>
                        </div>
                        <GlassCard className="p-0 overflow-hidden border-zinc-800">
                            <div className="divide-y divide-zinc-900">
                                {lessonsLoading ? (
                                    <div className="p-10 flex justify-center">
                                        <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : lessons.length === 0 ? (
                                    <div className="p-10 text-center text-zinc-600 italic">No courses available.</div>
                                ) : lessons.slice(0, 3).map((lesson) => (
                                    <div key={lesson.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-neon-blue group-hover:border-neon-blue/30 transition-all">
                                                {lesson.name?.charAt(0) || "L"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-neon-orange transition-colors">{lesson.name}</h4>
                                                <p className="text-sm text-zinc-500">Active Curriculum</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 text-[10px] font-bold uppercase tracking-wider mb-1">Live</span>
                                            <p className="text-xs text-zinc-600 font-medium">Updated Recently</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Explore Courses</h2>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                        <input
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-neon-blue transition-colors text-white placeholder:text-zinc-600"
                            placeholder="Find a track..."
                        />
                    </div>

                    <div className="space-y-4">
                        {lessons.slice(0, 4).map((lesson) => (
                            <GlassCard key={lesson.id} className="p-5 border-l-4 border-l-neon-orange hover:translate-x-1 transition-transform cursor-pointer group">
                                <h4 className="font-bold mb-1 text-white group-hover:text-neon-orange transition-colors">{lesson.name}</h4>
                                <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">{lesson.description}</p>
                                <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Open</span>
                                    <Link href="/dashboard/parent/assign">
                                        <button className="text-xs font-bold text-neon-blue hover:underline uppercase tracking-widest flex items-center gap-1">
                                            Enroll Now <ArrowRight size={14} />
                                        </button>
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
