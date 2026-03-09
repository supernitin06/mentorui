"use client";
import { useState } from "react";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Plus, BookOpen, Users, Search, Filter, Edit2, Trash2, Calendar, Layout } from "lucide-react";
import {
    useGetLessonsByMentorQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation
} from "@/store/lessonApi";
import {
    useGetSessionsByLessonQuery,
    useCreateSessionMutation,
    useDeleteSessionMutation
} from "@/store/sessionApi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function MentorLessonsPage() {
    const { data: response, isLoading, isError } = useGetLessonsByMentorQuery();
    const [createLesson] = useCreateLessonMutation();
    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson, { isLoading: deletingLesson }] = useDeleteLessonMutation();
    const [createSession] = useCreateSessionMutation();
    const [deleteSession, { isLoading: deletingSession }] = useDeleteSessionMutation();

    const toast = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isSessionListOpen, setIsSessionListOpen] = useState(false);

    // Confirm delete state
    const [confirmLesson, setConfirmLesson] = useState(null);   // lesson to delete
    const [confirmSession, setConfirmSession] = useState(null); // session to delete

    const [editingLesson, setEditingLesson] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const [formData, setFormData] = useState({ name: "", description: "" });
    const [sessionFormData, setSessionFormData] = useState({ date: "", topic: "", summary: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const lessons = response?.data || response || [];

    const handleOpenModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson);
            setFormData({ name: lesson.name, description: lesson.description });
        } else {
            setEditingLesson(null);
            setFormData({ name: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleOpenSessionModal = (lesson) => {
        setSelectedLesson(lesson);
        setSessionFormData({ date: new Date().toISOString().split('T')[0], topic: "", summary: "" });
        setIsSessionModalOpen(true);
    };

    const handleViewSessions = (lesson) => {
        setSelectedLesson(lesson);
        setIsSessionListOpen(true);
    };

    const handleSessionSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSession({ lessonId: selectedLesson.id, ...sessionFormData }).unwrap();
            setIsSessionModalOpen(false);
            toast({ type: "success", message: "Session scheduled successfully!" });
        } catch (err) {
            toast({ type: "error", message: err?.data?.message || "Failed to create session." });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLesson) {
                await updateLesson({ id: editingLesson.id, ...formData }).unwrap();
                toast({ type: "success", message: `"${formData.name}" updated successfully!` });
            } else {
                await createLesson(formData).unwrap();
                toast({ type: "success", message: `Lesson "${formData.name}" created!` });
            }
            setIsModalOpen(false);
        } catch (err) {
            toast({ type: "error", message: err?.data?.message || "Failed to save lesson." });
        }
    };

    const handleDeleteLesson = async () => {
        try {
            await deleteLesson(confirmLesson.id).unwrap();
            toast({ type: "success", message: `"${confirmLesson.name}" deleted.` });
            setConfirmLesson(null);
        } catch (err) {
            toast({ type: "error", message: err?.data?.message || "Failed to delete lesson." });
        }
    };

    const handleDeleteSession = async () => {
        try {
            await deleteSession(confirmSession.id).unwrap();
            toast({ type: "success", message: "Session removed." });
            setConfirmSession(null);
        } catch (err) {
            toast({ type: "error", message: err?.data?.message || "Failed to delete session." });
        }
    };

    const filteredLessons = lessons.filter(l =>
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lesson Management</h1>
                    <p className="text-zinc-500 mt-1">Create and manage your courses and session details.</p>
                </div>
                <NeonButton onClick={() => handleOpenModal()} variant="blue" className="flex items-center gap-2 h-12 px-6">
                    <Plus size={20} /> Create New Lesson
                </NeonButton>
            </div>

            {/* Toolbar */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
                        <Layout size={18} />
                    </button>
                </div>
            </GlassCard>

            {/* Lessons List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : isError ? (
                <div className="p-10 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <p className="text-red-500">Failed to load lessons. Please try again later.</p>
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="p-20 text-center bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
                    <BookOpen size={48} className="mx-auto text-zinc-700 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-400">No lessons found</h3>
                    <p className="text-zinc-600 mt-2">Start by creating your first educational module.</p>
                    <NeonButton onClick={() => handleOpenModal()} variant="blue" className="mt-8 h-10 px-6">+ New Lesson</NeonButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredLessons.map((lesson) => (
                        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={lesson.id}>
                            <GlassCard className="group hover:border-neon-blue transition-all duration-500 overflow-hidden">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="lg:w-40 lg:h-32 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-5xl font-bold text-zinc-800 border border-zinc-800 group-hover:border-neon-blue/30 transition-colors">
                                        {lesson.name?.charAt(0) || "L"}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold group-hover:text-neon-blue transition-colors">{lesson.name}</h3>
                                                <p className="text-zinc-500 text-sm mt-1 max-w-2xl">{lesson.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(lesson)}
                                                    className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-neon-blue border border-zinc-800 hover:border-neon-blue/40 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmLesson(lesson)}
                                                    className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-500 border border-zinc-800 hover:border-red-500/40 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-6 pt-2">
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <Users size={16} className="text-neon-orange" />
                                                <span className="font-medium text-zinc-300">0</span> Students enrolled
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <Calendar size={16} className="text-neon-purple" />
                                                <span className="font-medium text-zinc-300">New</span> Added recently
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:border-l border-zinc-900 lg:pl-8 flex lg:flex-col gap-4">
                                        <button
                                            onClick={() => handleOpenSessionModal(lesson)}
                                            className="flex-1 lg:flex-none px-6 py-2.5 bg-neon-blue/10 text-neon-blue rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neon-blue/20 transition-colors"
                                        >
                                            Add Session
                                        </button>
                                        <button
                                            onClick={() => handleViewSessions(lesson)}
                                            className="flex-1 lg:flex-none px-6 py-2.5 bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-700 transition-colors"
                                        >
                                            Sessions
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Create/Edit Lesson Modal ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="h-1.5 w-full bg-neon-blue" />
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-2">{editingLesson ? "Edit Lesson" : "Create New Lesson"}</h2>
                                <p className="text-zinc-500 text-sm mb-8">Fill in the details below to initialize your educational module.</p>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Lesson Name</label>
                                        <input type="text" value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-neon-blue transition-colors"
                                            placeholder="e.g., Advanced Quantum Mechanics" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Description</label>
                                        <textarea rows={4} value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-neon-blue transition-colors resize-none"
                                            placeholder="Provide a comprehensive overview..." required />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)}
                                            className="flex-1 h-12 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors border border-zinc-800">
                                            Cancel
                                        </button>
                                        <NeonButton type="submit" variant="blue" className="flex-1 h-12">
                                            {editingLesson ? "Save Changes" : "Create Lesson"}
                                        </NeonButton>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Session List Modal ── */}
            <AnimatePresence>
                {isSessionListOpen && selectedLesson && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSessionListOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Sessions for {selectedLesson.name}</h2>
                                        <p className="text-zinc-500 text-sm">Review historical and upcoming class sessions.</p>
                                    </div>
                                    <button onClick={() => { setIsSessionListOpen(false); handleOpenSessionModal(selectedLesson); }}
                                        className="p-2.5 bg-neon-blue/10 text-neon-blue rounded-xl border border-neon-blue/20 hover:bg-neon-blue/20 transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                                    <SessionList
                                        lessonId={selectedLesson.id}
                                        onDelete={(session) => setConfirmSession(session)}
                                    />
                                </div>
                                <div className="mt-8">
                                    <button onClick={() => setIsSessionListOpen(false)}
                                        className="w-full h-12 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors border border-zinc-800">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Add Session Modal ── */}
            <AnimatePresence>
                {isSessionModalOpen && selectedLesson && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSessionModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="h-1.5 w-full bg-neon-purple shadow-[0_0_15px_#bf00ff]" />
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-2">Schedule New Session</h2>
                                <p className="text-zinc-500 text-sm mb-8">Add a topic and summary for this lesson's session.</p>
                                <form onSubmit={handleSessionSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Session Date</label>
                                        <input type="date" value={sessionFormData.date}
                                            onChange={(e) => setSessionFormData({ ...sessionFormData, date: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-neon-purple transition-colors"
                                            required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Topic Title</label>
                                        <input type="text" value={sessionFormData.topic}
                                            onChange={(e) => setSessionFormData({ ...sessionFormData, topic: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-neon-purple transition-colors"
                                            placeholder="e.g., Introduction to React Hooks" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Summary (Optional)</label>
                                        <textarea rows={3} value={sessionFormData.summary}
                                            onChange={(e) => setSessionFormData({ ...sessionFormData, summary: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-neon-purple transition-colors resize-none"
                                            placeholder="Briefly describe what will be covered..." />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsSessionModalOpen(false)}
                                            className="flex-1 h-12 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors border border-zinc-800">
                                            Cancel
                                        </button>
                                        <NeonButton type="submit" variant="purple" className="flex-1 h-12">Add Session</NeonButton>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Confirm Delete Lesson ── */}
            <ConfirmModal
                isOpen={!!confirmLesson}
                onClose={() => setConfirmLesson(null)}
                onConfirm={handleDeleteLesson}
                isLoading={deletingLesson}
                title="Delete Lesson?"
                message={`"${confirmLesson?.name}" and all its sessions will be permanently removed.`}
                confirmLabel="Delete Lesson"
            />

            {/* ── Confirm Delete Session ── */}
            <ConfirmModal
                isOpen={!!confirmSession}
                onClose={() => setConfirmSession(null)}
                onConfirm={handleDeleteSession}
                isLoading={deletingSession}
                title="Remove Session?"
                message={`"${confirmSession?.topic}" will be permanently removed from this lesson.`}
                confirmLabel="Remove Session"
            />
        </div>
    );
}

function SessionList({ lessonId, onDelete }) {
    const { data: response, isLoading } = useGetSessionsByLessonQuery(lessonId);
    const sessions = response?.data || response || [];

    if (isLoading) return <div className="text-center py-4 text-zinc-500">Loading sessions...</div>;
    if (sessions.length === 0) return (
        <div className="text-center py-10 bg-zinc-900/10 rounded-xl border border-dashed border-zinc-800 text-zinc-600">
            No sessions scheduled yet.
        </div>
    );

    return (
        <div className="space-y-3">
            {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-neon-purple/30 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500">
                            <span className="text-neon-purple uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-white text-lg leading-none">{new Date(session.date).getDate()}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-200">{session.topic}</h4>
                            <p className="text-xs text-zinc-500 line-clamp-1">{session.summary || "No summary provided."}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(session)}
                        className="p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
