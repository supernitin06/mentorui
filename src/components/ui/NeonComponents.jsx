"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const NeonButton = ({ children, className, variant = "orange", as = "button", ...props }) => {
    const variants = {
        orange: "border-neon-orange/40 bg-neon-orange/10 hover:bg-neon-orange hover:border-neon-orange text-neon-orange hover:text-white shadow-lg shadow-neon-orange/10",
        blue: "border-neon-blue/40 bg-neon-blue/10 hover:bg-neon-blue hover:border-neon-blue text-neon-blue hover:text-black shadow-lg shadow-neon-blue/10",
        purple: "border-neon-purple/40 bg-neon-purple/10 hover:bg-neon-purple hover:border-neon-purple text-neon-purple hover:text-white shadow-lg shadow-neon-purple/10",
    };

    const Component = as === "div" ? motion.div : motion.button;

    return (
        <Component
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
                "px-6 py-2 rounded-xl border font-bold transition-all duration-300 flex items-center justify-center",
                variants[variant] || variants.orange,
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};

export const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("glass-card p-6 rounded-2xl", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
