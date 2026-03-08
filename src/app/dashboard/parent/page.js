"use client";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { StudentCard } from "@/components/sections/StudentCard";
import { Plus, Search, Filter, TrendingUp, Users, Calendar } from "lucide-react";
import { mockLessons } from "@/lib/mockData";

export default function ParentDashboard() {
    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Students", value: "2", icon: Users, color: "text-neon-orange", bg: "bg-orange-500/10" },
                    { label: "Booked Lessons", value: "12", icon: TrendingUp, color: "text-neon-blue", bg: "bg-blue-500/10" },
                    { label: "Next Session", value: "2h 15m", icon: Calendar, color: "text-neon-purple", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="flex items-center gap-6">
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

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Students Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            My Students <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg">2</span>
                        </h2>
                        <NeonButton variant="orange" className="h-10 px-4 text-sm flex items-center gap-2">
                            <Plus size={16} /> Add Student
                        </NeonButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StudentCard name="Alice Doe" age="10" lessonsCount="5" />
                        <StudentCard name="Bob Doe" age="8" lessonsCount="7" />
                    </div>

                    <div className="pt-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Upcoming Lessons</h2>
                            <button className="text-neon-blue text-sm hover:underline">View All</button>
                        </div>
                        <GlassCard className="p-0 overflow-hidden divide-y divide-zinc-900">
                            {mockLessons.map((lesson) => (
                                <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-neon-blue">
                                            {lesson.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold group-hover:text-neon-orange transition-colors">{lesson.title}</h4>
                                            <p className="text-sm text-zinc-500">Mentor: {lesson.mentorName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">Tomorrow</p>
                                        <p className="text-xs text-zinc-500">10:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </div>
                </div>

                {/* Sidebar / Recommended */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Explore Lessons</h2>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-neon-blue transition-colors"
                            placeholder="Search mentors..."
                        />
                    </div>

                    <div className="space-y-4">
                        {mockLessons.map((lesson) => (
                            <GlassCard key={lesson.id} className="p-4 border-l-4 border-l-neon-blue">
                                <h4 className="font-bold mb-1">{lesson.title}</h4>
                                <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{lesson.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-neon-orange">{lesson.price}</span>
                                    <button className="text-xs font-bold text-neon-blue hover:underline uppercase tracking-widest">Book Now</button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
