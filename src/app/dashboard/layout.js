"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Calendar,
    BookOpen,
    Settings,
    LogOut,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    const isParent = pathname.includes("/parent");

    const parentItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard/parent" },
        { icon: Users, label: "Students", href: "/dashboard/parent/students" },
        { icon: BookOpen, label: "Explore", href: "/dashboard/parent/explore" },
        { icon: Calendar, label: "Schedule", href: "/dashboard/parent/schedule" },
    ];

    const mentorItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard/mentor" },
        { icon: BookOpen, label: "Courses", href: "/dashboard/mentor/courses" },
        { icon: Users, label: "Students", href: "/dashboard/mentor/students" },
        { icon: Calendar, label: "Schedule", href: "/dashboard/mentor/schedule" },
    ];

    const menuItems = isParent ? parentItems : mentorItems;

    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 hidden md:flex flex-col p-6 space-y-8 glass-card border-l-0 border-t-0 border-b-0 rounded-none fixed h-full z-20">
                <div className="text-2xl font-bold tracking-tighter mb-4">
                    MENTORA<span className="text-neon-orange">.</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                pathname === item.href
                                    ? "bg-neon-orange/10 text-neon-orange border border-neon-orange/30"
                                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            )}
                        >
                            <item.icon size={20} className={cn(pathname === item.href ? "text-neon-orange" : "group-hover:text-neon-orange transition-colors")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-zinc-900 space-y-2">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen relative w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-zinc-500 font-medium">Welcome back,</h2>
                        <h1 className="text-2xl font-bold">John Doe 👋</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-neon-orange transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-orange rounded-full shadow-[0_0_8px_#ff5a00]" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-orange to-neon-purple p-[2px]">
                            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-xs uppercase">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
