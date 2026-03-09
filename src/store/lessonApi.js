import { apiSlice } from './apiSlice';

export const lessonApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLessons: builder.query({
            query: () => '/lessons',
            providesTags: ['Lesson'],
        }),
        getLessonById: builder.query({
            query: (id) => `/lessons/${id}`,
            providesTags: ['Lesson'],
        }),
        createLesson: builder.mutation({
            query: (data) => ({
                url: '/lessons',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Lesson'],
        }),
        updateLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/lessons/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Lesson'],
        }),
        deleteLesson: builder.mutation({
            query: (id) => ({
                url: `/lessons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Lesson'],
        }),
        getLessonsByMentor: builder.query({
            query: () => '/lessons/getlessonbymentor',
            providesTags: ['Lesson'],
        }),
        getLessonsByStudent: builder.query({
            query: () => '/lessons/getlessonbystudent',
            providesTags: ['Lesson'],
        }),
        getLessonAssignToStudent: builder.query({
            query: () => '/lessons/getlessonassigntostudent',
            providesTags: ['Lesson'],
        }),
    }),
});

export const {
    useGetLessonsQuery,
    useGetLessonByIdQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useGetLessonsByMentorQuery,
    useGetLessonsByStudentQuery,
    useGetLessonAssignToStudentQuery,
} = lessonApi;
