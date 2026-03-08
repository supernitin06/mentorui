export const mockLessons = [
    {
        id: 1,
        title: "Mastering React Animations",
        description: "Learn how to use Framer Motion to create stunning visual effects.",
        mentorId: "m1",
        mentorName: "Dr. Neon",
        price: "$49",
        sessions: [
            { id: "s1", date: "2026-04-10", topic: "Introduction to Motion", summary: "Basics of variants and transitions." },
            { id: "s2", date: "2026-04-12", topic: "Layout Animations", summary: "Using layoutId for magic move effects." }
        ]
    },
    {
        id: 2,
        title: "Vibrant UI Design",
        description: "Deep dive into color theory and accessibility for neon designs.",
        mentorId: "m2",
        mentorName: "Sarah Glow",
        price: "$59",
        sessions: [
            { id: "s3", date: "2026-04-15", topic: "Neon Color Theory", summary: "Choosing colors that pop." }
        ]
    }
];

export const mockUsers = {
    parent: { id: "p1", name: "John Doe", role: "parent", students: ["s1", "s2"] },
    mentor: { id: "m1", name: "Dr. Neon", role: "mentor" },
    student1: { id: "s1", name: "Alice Doe", parentId: "p1" },
    student2: { id: "s2", name: "Bob Doe", parentId: "p1" }
};
