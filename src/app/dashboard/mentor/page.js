"use client";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Plus, BookOpen, Clock, Users, DollarSign, Calendar } from "lucide-react";
import { mockLessons } from "@/lib/mockData";

export default function MentorDashboard() {
    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Students", value: "48", icon: Users, color: "text-neon-blue", bg: "bg-blue-500/10" },
                    { label: "Lessons", value: "5", icon: BookOpen, color: "text-neon-orange", bg: "bg-orange-500/10" },
                    { label: "Total Earnings", value: "$1,240", icon: DollarSign, color: "text-neon-green", bg: "bg-green-500/10" },
                    { label: "Rating", value: "4.9", icon: Calendar, color: "text-neon-purple", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="flex flex-col gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </GlassCard>
                ))}
            </section>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Lessons Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">My Courses</h2>
                        <NeonButton variant="blue" className="h-10 px-4 text-sm flex items-center gap-2">
                            <Plus size={16} /> Create Lesson
                        </NeonButton>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {mockLessons.map((lesson) => (
                            <GlassCard key={lesson.id} className="group hover:border-neon-blue transition-all duration-500">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-32 h-32 rounded-xl bg-zinc-900 flex items-center justify-center text-4xl font-bold text-zinc-800">
                                        {lesson.title.charAt(0)}
                                    </div>
                                    <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6 mt-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <h3 className="text-lg md:text-xl font-bold group-hover:text-neon-blue transition-colors">{lesson.title}</h3>
                                                <span className="bg-neon-blue/10 text-neon-blue px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider self-start">Active</span>
                                            </div>
                                            <p className="text-zinc-500 text-sm line-clamp-2">{lesson.description}</p>
                                            <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
                                                <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400">
                                                    <Users size={16} className="text-neon-orange" />
                                                    <span>12 Students</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400">
                                                    <Clock size={16} className="text-neon-blue" />
                                                    <span>3 Sessions</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col justify-between items-center sm:items-end gap-4 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-4 sm:pt-0 sm:pl-4">
                                            <button className="text-zinc-300 hover:text-white text-sm font-medium">Edit</button>
                                            <button className="text-neon-blue font-bold text-sm">View Stats</button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Upcoming Sessions Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Upcoming Sessions</h2>
                    <div className="space-y-4">
                        {[
                            { topic: "React Basics", time: "10:00 AM", student: "Alice Doe" },
                            { topic: "State Management", time: "02:30 PM", student: "Bob Smith" },
                        ].map((session, i) => (
                            <GlassCard key={i} className="p-4 bg-zinc-950/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-neon-purple uppercase tracking-tighter">Live Session</span>
                                    <span className="text-xs text-zinc-500">{session.time}</span>
                                </div>
                                <h4 className="font-bold text-white">{session.topic}</h4>
                                <p className="text-sm text-zinc-500">with {session.student}</p>
                                <NeonButton variant="purple" className="w-full mt-4 h-9 text-xs">Join Call</NeonButton>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
