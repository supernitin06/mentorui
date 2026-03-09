import { apiSlice } from './apiSlice';

export const studentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        loginStudent: builder.mutation({
            query: (credentials) => ({
                url: '/students/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerStudent: builder.mutation({
            query: (data) => ({
                url: '/students/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Student'],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/students/${id}`, // Assuming this is the endpoint
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Student'],
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Student'],
        }),
        getStudents: builder.query({
            query: () => '/students',
            providesTags: ['Student'],
        }),
        getStudentsByParent: builder.query({
            query: () => '/students/getstudentbyparent',
            providesTags: ['Student'],
        }),
        getStudentsByMentor: builder.query({
            query: () => '/students/getstudentbymentor',
            providesTags: ['Student'],
        }),
    }),
});

export const {
    useLoginStudentMutation,
    useRegisterStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useGetStudentsQuery,
    useGetStudentsByParentQuery,
    useGetStudentsByMentorQuery,
} = studentApi;
