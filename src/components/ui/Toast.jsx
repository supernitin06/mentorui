"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle size={18} className="text-neon-green shrink-0" />,
    error: <XCircle size={18} className="text-red-500 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-neon-orange shrink-0" />,
    info: <Info size={18} className="text-neon-blue shrink-0" />,
};

const BORDERS = {
    success: "border-neon-green/30",
    error: "border-red-500/30",
    warning: "border-neon-orange/30",
    info: "border-neon-blue/30",
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback(({ message, type = "info", duration = 3500 }) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.22 }}
                            className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-sm px-5 py-4 rounded-2xl bg-zinc-950/95 border shadow-2xl backdrop-blur-sm ${BORDERS[t.type]}`}
                        >
                            {ICONS[t.type]}
                            <p className="flex-1 text-sm font-medium text-white leading-snug">{t.message}</p>
                            <button onClick={() => dismiss(t.id)} className="text-zinc-600 hover:text-white transition-colors mt-0.5 shrink-0">
                                <X size={15} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}
