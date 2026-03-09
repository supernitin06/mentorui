import { apiSlice } from './apiSlice';

export const parentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        loginParent: builder.mutation({
            query: (credentials) => ({
                url: '/parents/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerParent: builder.mutation({
            query: (data) => ({
                url: '/parents/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Parent'],
        }),
        getParents: builder.query({
            query: () => '/parents',
            providesTags: ['Parent'],
        }),
        assignLesson: builder.mutation({
            query: (data) => ({
                url: '/parents/assign-lesson',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Student', 'Lesson'],
        }),
        removeLesson: builder.mutation({
            query: (data) => ({
                url: '/parents/remove-lesson',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Student', 'Lesson'],
        }),
    }),
});

export const {
    useLoginParentMutation,
    useRegisterParentMutation,
    useGetParentsQuery,
    useAssignLessonMutation,
    useRemoveLessonMutation,
} = parentApi;
