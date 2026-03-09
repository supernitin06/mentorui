"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Calendar,
    BookOpen,
    Settings,
    LogOut,
    Bell,
    PlusCircle,
    UserPlus,
    UserCheck,
    StickyNote,
    ClipboardList,
    Sparkles,
    Gamepad
} from "lucide-react";
import { cn } from "@/lib/utils";
import { selectCurrentRole, selectIsAuthenticated, logout, selectCurrentUser, selectIsAuthInitialized } from "@/store/authSlice";
import DrawNote from "@/components/DrawNote";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const role = useSelector(selectCurrentRole);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isInitialized = useSelector(selectIsAuthInitialized);
    const user = useSelector(selectCurrentUser);

    const [isDrawNoteOpen, setIsDrawNoteOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isInitialized, isAuthenticated, router]);

    // Show loading or nothing until we've checked the cookies
    if (!isInitialized || (!isAuthenticated && pathname !== '/login')) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-neon-orange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const parentItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard/parent" },
        { icon: UserPlus, label: "Register Student", href: "/dashboard/parent/register" },
        { icon: Users, label: "Student Management", href: "/dashboard/parent/students" },
        { icon: UserCheck, label: "Assign Lesson", href: "/dashboard/parent/assign" },
        { icon: Sparkles, label: "Summarize", href: "/dashboard/parent/summarize" },
    ];

    const mentorItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard/mentor" },
        { icon: ClipboardList, label: "Lesson Management", href: "/dashboard/mentor/lessons" },
        { icon: Calendar, label: "Schedule", href: "/dashboard/mentor/schedule" },
        { icon: Sparkles, label: "Summarize", href: "/dashboard/mentor/summarize" },
    ];

    const studentItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard/student" },
        { icon: BookOpen, label: "My Lessons", href: "/dashboard/student/lessons" },
        { icon: Calendar, label: "My Schedule", href: "/dashboard/student/schedule" },
        { icon: Sparkles, label: "Summarize", href: "/dashboard/student/summarize" },
        { icon: Gamepad, label: "Brain Fresh", href: "/dashboard/student/games" },
    ];

    const menuItems = role === "parent" ? parentItems : role === "mentor" ? mentorItems : studentItems;

    const handleLogout = () => {
        dispatch(logout());
        // Added clear cache out to remove previous user's data from Redux toolkit state
        dispatch({ type: 'api/resetApiState' });
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-[#050505]">
            <DrawNote isOpen={isDrawNoteOpen} onClose={() => setIsDrawNoteOpen(false)} />

            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 hidden md:flex flex-col p-6 space-y-8 glass-card border-l-0 border-t-0 border-b-0 rounded-none fixed h-full z-20">
                <div className="text-2xl font-black tracking-tighter mb-4 px-2">
                    MENTORA<span className="text-neon-orange">.</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-medium",
                                pathname === item.href
                                    ? "bg-neon-orange/10 text-neon-orange border border-neon-orange/30"
                                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/80"
                            )}
                        >
                            <item.icon size={20} className={cn(pathname === item.href ? "text-neon-orange" : "group-hover:text-neon-orange transition-colors")} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-zinc-900/80 space-y-1">
                    <button
                        onClick={() => setIsDrawNoteOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-neon-blue font-medium transition-colors group rounded-xl hover:bg-zinc-900/50"
                    >
                        <StickyNote size={20} className="group-hover:text-neon-blue transition-colors" />
                        <span>Quick Draw</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-500 font-medium transition-colors group rounded-xl hover:bg-zinc-900/50"
                    >
                        <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen relative w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-zinc-500 font-medium capitalize text-sm tracking-wider uppercase">{role} Dashboard</h2>
                        <h1 className="text-2xl font-bold text-white">{user?.name || user?.firstName || "User"} 👋</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsDrawNoteOpen(true)}
                            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-neon-blue transition-colors lg:hidden"
                        >
                            <StickyNote size={20} />
                        </button>
                        <button className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-neon-orange transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-orange rounded-full shadow-[0_0_8px_#ff5a00]" />
                        </button>
                        <div className="relative">
                            <div
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-orange to-neon-purple p-[2px] cursor-pointer hover:scale-105 transition-transform"
                            >
                                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-xs uppercase text-white">
                                    {(user?.name || user?.firstName || "U").substring(0, 2)}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        {/* Invisible backdrop to close dropdown when clicking outside */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-4 w-64 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl z-50 p-2"
                                        >
                                            <div className="p-4 border-b border-zinc-900 mb-2">
                                                <p className="font-bold text-white text-lg truncate leading-tight">{user?.name || user?.firstName || user?.lastName || "User"}</p>
                                                <p className="text-zinc-500 text-xs truncate mt-1">{user?.email || "No registered email"}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-neon-orange/10 border border-neon-orange/30 text-[10px] font-black uppercase tracking-widest text-neon-orange">
                                                        {role} Account
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Link
                                                    href={`/dashboard/${role}`}
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
                                                >
                                                    <Settings size={16} />
                                                    Account Settings
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                                                >
                                                    <LogOut size={16} />
                                                    Logout securely
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
