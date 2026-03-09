import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api',
        credentials: 'include', // Rely entirely on cookies for authentication
    }),
    tagTypes: ['Student', 'Mentor', 'Parent', 'Lesson', 'Session'],
    endpoints: (builder) => ({}), // Split into feature-specific files
});
