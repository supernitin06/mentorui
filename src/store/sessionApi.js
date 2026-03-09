import { apiSlice } from './apiSlice';

export const sessionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => '/sessions',
            providesTags: ['Session'],
        }),
        getSessionsByLesson: builder.query({
            query: (lessonId) => `/sessions/lesson/${lessonId}`,
            providesTags: ['Session'],
        }),
        createSession: builder.mutation({
            query: (data) => ({
                url: '/sessions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Session'],
        }),
        updateSession: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/sessions/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Session'],
        }),
        deleteSession: builder.mutation({
            query: (id) => ({
                url: `/sessions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),
    }),
});

export const {
    useGetSessionsQuery,
    useGetSessionsByLessonQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation
} = sessionApi;
