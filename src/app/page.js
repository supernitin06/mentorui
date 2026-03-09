"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Sparkles, Users, BookOpen, Rocket } from "lucide-react";
import { selectIsAuthenticated, selectCurrentRole } from "@/store/authSlice";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectCurrentRole);

  useEffect(() => {
    if (isAuthenticated && role) {
      router.replace(`/dashboard/${role}`);
    }
  }, [isAuthenticated, role, router]);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter cursor-pointer"
        >
          MENTORA<span className="text-neon-orange">.</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#mentors" className="hover:text-white transition-colors">Mentors</Link>
          <Link href="/dashboard/parent" className="hover:text-neon-orange transition-colors">Dashboard</Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-sm md:text-base font-medium hidden sm:block">
            Login
          </Link>
          <Link href="/signup">
            <NeonButton as="div" variant="orange" className="h-10 text-sm px-6">Get Started</NeonButton>
          </Link>

          {/* User Profile Dummy Icon */}
          <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center cursor-pointer hover:border-neon-blue transition-colors relative group ml-2">
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-green rounded-full border-2 border-black" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 group-hover:text-white transition-colors">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-4 md:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-neon-orange text-xs md:text-sm font-medium mb-10"
        >
          <Sparkles size={16} />
          <span>The Future of Personalized Mentorship</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight max-w-4xl leading-[1.1] px-2"
        >
          Elevate Your Learning with <span className="neon-text-orange italic">Neon Precision.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 md:mt-8 text-zinc-400 text-base md:text-xl max-w-2xl px-4"
        >
          Connect students with world-class mentors. Managed by parents, powered by technology, and designed for results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-4"
        >
          <Link href="/signup?role=parent" className="w-full sm:w-auto">
            <NeonButton as="div" variant="orange" className="h-14 px-10 text-lg w-full">I'm a Parent</NeonButton>
          </Link>
          <Link href="/signup?role=mentor" className="w-full sm:w-auto">
            <NeonButton as="div" variant="blue" className="h-14 px-10 text-lg w-full">I'm a Mentor</NeonButton>
          </Link>
        </motion.div>

        {/* Features Preview */}
        <section className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 rounded-xl bg-orange-500/10 text-neon-orange">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold">Parent Control</h3>
            <p className="text-zinc-500">Create student accounts, book lessons, and track progress all in one place.</p>
          </GlassCard>

          <GlassCard className="flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 rounded-xl bg-blue-500/10 text-neon-blue">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">Expert Mentors</h3>
            <p className="text-zinc-500">Learn from professionals who are passionate about teaching and sharing knowledge.</p>
          </GlassCard>

          <GlassCard className="flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 rounded-xl bg-purple-500/10 text-neon-purple">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-bold">Structured Lessons</h3>
            <p className="text-zinc-500">Detailed sessions with topics, summaries, and dates to keep every lesson on track.</p>
          </GlassCard>
        </section>

        {/* Dynamic Background Element */}
        <div className="mt-20 opacity-20 filter grayscale invert">
          <Rocket className="animate-bounce" size={48} />
        </div>
      </main>

      <footer className="mt-32 py-12 border-t border-zinc-900 text-center text-zinc-600">
        © 2026 Mentora Platform. Built with Neon Aesthetics.
      </footer>
    </div>
  );
}

