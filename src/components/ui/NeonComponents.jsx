"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const NeonButton = ({ children, className, variant = "orange", as = "button", ...props }) => {
    const variants = {
        orange: "border-neon-orange text-neon-orange shadow-[0_0_10px_rgba(255,90,0,0.3)] hover:shadow-[0_0_20px_rgba(255,90,0,0.5)]",
        blue: "border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.3)] hover:shadow-[0_0_20px_rgba(0,242,255,0.5)]",
        purple: "border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)] hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]",
    };

    const Component = as === "div" ? motion.div : motion.button;

    return (
        <Component
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-2 rounded-full border bg-transparent font-medium transition-all duration-300 flex items-center justify-center",
                variants[variant],
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
            className={cn("glass-card p-6 neon-border", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
