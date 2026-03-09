"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * ConfirmModal — reusable dark confirmation dialog
 *
 * Props:
 *  isOpen      - boolean
 *  onClose     - () => void
 *  onConfirm   - () => void
 *  title       - string  (default "Are you sure?")
 *  message     - string
 *  confirmLabel - string (default "Delete")
 *  isLoading   - boolean
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmLabel = "Delete",
    isLoading = false,
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Red top bar */}
                        <div className="h-1.5 w-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />

                        <div className="p-8 space-y-6">
                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
                            >
                                <X size={16} />
                            </button>

                            {/* Icon + title */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={22} className="text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{title}</h2>
                                    <p className="text-zinc-500 text-sm mt-0.5">{message}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            {confirmLabel}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
