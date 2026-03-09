import { apiSlice } from './apiSlice';

export const mentorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        loginMentor: builder.mutation({
            query: (credentials) => ({
                url: '/mentors/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerMentor: builder.mutation({
            query: (data) => ({
                url: '/mentors/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Mentor'],
        }),
        getMentors: builder.query({
            query: () => '/mentors',
            providesTags: ['Mentor'],
        }),
    }),
});

export const {
    useLoginMentorMutation,
    useRegisterMentorMutation,
    useGetMentorsQuery
} = mentorApi;
