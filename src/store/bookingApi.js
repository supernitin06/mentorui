import { apiSlice } from './apiSlice';

export const bookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: () => '/bookings',
            providesTags: ['Booking'],
        }),
        getBookingsByStudent: builder.query({
            query: (studentId) => `/bookings/student/${studentId}`,
            providesTags: ['Booking'],
        }),
        createBooking: builder.mutation({
            query: (data) => ({
                url: '/bookings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Booking', 'Student'],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useGetBookingsByStudentQuery,
    useCreateBookingMutation
} = bookingApi;
