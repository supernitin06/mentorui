import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        isInitialized: false // Crucial: starts as false
    },
    reducers: {
        initializeAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token') || Cookies.get('token');
                const role = localStorage.getItem('role') || Cookies.get('role');
                const userStr = localStorage.getItem('user') || Cookies.get('user');

                if (token && role) {
                    state.token = token;
                    state.role = role;
                    state.isAuthenticated = true;
                    try {
                        if (userStr) state.user = JSON.parse(userStr);
                    } catch (e) {
                        console.error("Failed to parse user data", e);
                    }
                }
                state.isInitialized = true;
            }
        },
        setCredentials: (state, action) => {
            const { user, token, role } = action.payload;
            state.user = user;
            state.token = token;
            state.role = role;
            state.isAuthenticated = true;
            state.isInitialized = true;

            if (typeof window !== 'undefined') {
                // Save to LocalStorage
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('user', JSON.stringify(user));

                // Keep cookies for backend-side compatibility if needed
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('role', role, { expires: 7 });
                Cookies.set('user', JSON.stringify(user), { expires: 7 });
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');

                Cookies.remove('token');
                Cookies.remove('role');
                Cookies.remove('user');
            }
        },
    },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state) => state.auth.isInitialized;
