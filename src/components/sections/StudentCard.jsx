import { GlassCard } from "@/components/ui/NeonComponents";
import { User, BookOpen, Clock } from "lucide-react";

export const StudentCard = ({ name, age, lessonsCount }) => {
    return (
        <GlassCard className="flex flex-col gap-4 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-neon-orange border border-orange-500/20 group-hover:bg-neon-orange group-hover:text-white transition-all duration-500">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-zinc-500 text-sm">Student · {age} years</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
                <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Lessons</span>
                    <span className="text-neon-blue font-bold flex items-center gap-1">
                        <BookOpen size={14} /> {lessonsCount}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Next Class</span>
                    <span className="text-white font-medium flex items-center gap-1">
                        <Clock size={14} /> Tomorrow
                    </span>
                </div>
            </div>
        </GlassCard>
    );
};
