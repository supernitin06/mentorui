"use client";
import { useState } from "react";
import { NeonButton, GlassCard } from "@/components/ui/NeonComponents";
import { Users, BookOpen, Search, Filter, Check, ArrowRight, Star, Shield, GraduationCap } from "lucide-react";
import { useGetStudentsByParentQuery } from "@/store/studentApi";
import { useGetLessonsQuery } from "@/store/lessonApi";
import { useAssignLessonMutation } from "@/store/parentApi";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ParentAssignLessonPage() {
    const { data: studentsResponse, isLoading: loadingStudents } = useGetStudentsByParentQuery();
    const { data: lessonsResponse, isLoading: loadingLessons } = useGetLessonsQuery();
    const [assignLesson] = useAssignLessonMutation();
    const toast = useToast();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [step, setStep] = useState(1); // 1: Select Student, 2: Select Lesson

    const students = studentsResponse?.data || studentsResponse || [];
    const lessons = lessonsResponse?.data || lessonsResponse || [];

    const handleAssign = async () => {
        if (!selectedStudent || !selectedLesson) return;
        setIsAssigning(true);
        try {
            await assignLesson({
                studentId: selectedStudent.id,
                lessonId: selectedLesson.id
            }).unwrap();

            toast({ type: "success", message: `${selectedStudent.firstName} enrolled in "${selectedLesson.name}" successfully!` });
            setSelectedStudent(null);
            setSelectedLesson(null);
            setStep(1);
        } catch (err) {
            console.error(err);
            toast({ type: "error", message: err?.data?.message || "Failed to enroll student. Please try again." });
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lesson Enrollment</h1>
                    <p className="text-zinc-500 mt-2">Enroll your students in specialized courses and tracks.</p>
                </div>

                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 gap-1">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${step === s ? "bg-neon-orange text-black shadow-[0_0_15px_#ff5a00]" : "text-zinc-600"
                                }`}
                        >
                            Step {s}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selection Area */}
                <div className="lg:col-span-2 space-y-6">
                    {step === 1 ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
                                <Users size={20} className="text-neon-orange" />
                                1. Select a Student
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loadingStudents ? (
                                    <div className="col-span-2 py-20 flex justify-center">
                                        <div className="w-8 h-8 border-2 border-neon-orange border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : students.length === 0 ? (
                                    <GlassCard className="col-span-2 p-10 text-center border-dashed">
                                        <p className="text-zinc-500">No students found. Please register a student first.</p>
                                    </GlassCard>
                                ) : (
                                    students.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                            className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${selectedStudent?.id === student.id
                                                ? "bg-neon-orange/10 border-neon-orange shadow-[0_0_20px_rgba(255,90,0,0.1)]"
                                                : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold overflow-hidden ${selectedStudent?.id === student.id ? "border-neon-orange/50" : "border-zinc-800"
                                                    }`}>
                                                    {student.studentimage ? (
                                                        <img
                                                            src={student.studentimage.startsWith('http') ? student.studentimage : `http://localhost:5000/${student.studentimage}`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        student.firstName?.charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-bold transition-colors ${selectedStudent?.id === student.id ? "text-neon-orange" : "text-white"}`}>
                                                        {student.firstName} {student.lastName}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500">{student.email}</p>
                                                </div>
                                                {selectedStudent?.id === student.id && (
                                                    <div className="p-1.5 bg-neon-orange rounded-full text-black">
                                                        <Check size={14} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                            {selectedStudent && (
                                <NeonButton
                                    onClick={() => setStep(2)}
                                    variant="orange"
                                    className="w-full h-12 flex items-center justify-center gap-2"
                                >
                                    Next: Select Course <ArrowRight size={18} />
                                </NeonButton>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
                                    <BookOpen size={20} className="text-neon-blue" />
                                    2. Choose a Lesson
                                </h2>
                                <button onClick={() => setStep(1)} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest px-3 py-1 bg-zinc-900 rounded-lg">
                                    Back to Students
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loadingLessons ? (
                                    <div className="col-span-2 py-20 flex justify-center">
                                        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : lessons.length === 0 ? (
                                    <GlassCard className="col-span-2 p-10 text-center border-dashed">
                                        <p className="text-zinc-500">No lessons available yet.</p>
                                    </GlassCard>
                                ) : (
                                    lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${selectedLesson?.id === lesson.id
                                                ? "bg-neon-blue/10 border-neon-blue shadow-[0_0_20px_rgba(0,210,255,0.1)]"
                                                : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                                                }`}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg ${selectedLesson?.id === lesson.id ? "bg-neon-blue/20 text-neon-blue border-neon-blue/30" : "bg-zinc-900 border-zinc-800 text-zinc-700"}`}>
                                                        {lesson.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold transition-colors ${selectedLesson?.id === lesson.id ? "text-neon-blue" : "text-white"}`}>
                                                            {lesson.name}
                                                        </h4>
                                                        <p className="text-xs text-zinc-500 line-clamp-1">{lesson.description}</p>
                                                    </div>
                                                    {selectedLesson?.id === lesson.id && (
                                                        <div className="p-1.5 bg-neon-blue rounded-full text-black">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-4 pt-2 border-t border-zinc-900 mt-2">
                                                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                                        <Users size={12} className="text-neon-orange" /> Mentor: {lesson.mentor?.name || "Assigning..."}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Enrollment Preview */}
                <div className="lg:col-span-1">
                    <GlassCard className="p-8 sticky top-8">
                        <h3 className="text-lg font-bold mb-6 pb-4 border-b border-zinc-900 flex items-center gap-2">
                            <Shield size={20} className="text-neon-purple" />
                            Enrollment Summary
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Student</p>
                                {selectedStudent ? (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">
                                            {selectedStudent.firstName?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-white truncate">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                                    </div>
                                ) : (
                                    <div className="h-12 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-700 italic">
                                        No student selected
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center py-2">
                                <div className="p-2 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-600 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                    <GraduationCap size={20} className="text-neon-purple" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Selected Course</p>
                                {selectedLesson ? (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-neon-blue/20">
                                        <div className="w-8 h-8 rounded-lg bg-neon-blue/10 text-neon-blue flex items-center justify-center text-xs font-bold shrink-0 border border-neon-blue/20">
                                            {selectedLesson.name?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-white truncate">{selectedLesson.name}</span>
                                    </div>
                                ) : (
                                    <div className="h-12 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-700 italic">
                                        No course selected
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <NeonButton
                                    onClick={handleAssign}
                                    disabled={!selectedStudent || !selectedLesson || isAssigning}
                                    variant="purple"
                                    className="w-full h-14 flex items-center justify-center gap-2"
                                >
                                    {isAssigning ? "Processing..." : "Confirm Enrollment"} <Check size={20} />
                                </NeonButton>
                                <p className="text-[10px] text-center text-zinc-600 mt-4 leading-relaxed">
                                    Enrolling will grant the student access to all course materials and scheduled sessions.
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
