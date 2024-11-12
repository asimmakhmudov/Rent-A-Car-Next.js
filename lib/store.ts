'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import filterReducer from './slices/filterSlice';
import carReducer from './slices/carSlice';
import appointmentReducer from './slices/appointementSlice';

export const store = configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      filter: filterReducer,
      car: carReducer,
      appointment: appointmentReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore  = typeof store