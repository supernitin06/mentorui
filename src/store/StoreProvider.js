'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeAuth } from './authSlice';

export default function StoreProvider({ children }) {
    useEffect(() => {
        store.dispatch(initializeAuth());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
