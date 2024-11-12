import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = 'token';

export interface User {
    email?: string;
    name?: string;
    surname?: string;
    password?: string;
    phone_number?: string;
    account_type?: number;
    tin?: string,
    address?: string,
    map_location?: string,
    website?: string,
    user_id?: number,
    profile?: any,
    Authorization?: string | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    isVerified: boolean | null;
}

export interface SigninResponse {
    user: User;
    token: string;
    profile?: any;
}

export interface SignupResponse {
    user: User;
    token: string;
    profile?: any;
}

export interface VerifyResponse {
    user: User;
    token: string;
    profile?: any;
}

export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const response = await axios.post<SigninResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/signin`,
            userData
        );
        const token = response.data.token;
        Cookies.set('token', token, { expires: 1 / 24 });
        return response.data;
    } catch (error: any) {
        return error;
    }
};
export const signupUser = async (userData: User) => {
    try {
        const response = await axios.post<SignupResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/signup`,
            userData
        );
        return response.data;
    } catch (error: any) {
        return error
    }
};


export const logoutUser = async (): Promise<void> => {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signout`);
        window.location.href = '/auth/signin';
    } catch (error: any) {
        return error
    }
};


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
    } as AuthState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoggedIn = !!action.payload;
            state.isVerified = action.payload ? action.payload.profile?.is_verified : null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            localStorage.removeItem(token);
            window.location.href = '/auth';
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        signinRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signinSuccess: (state, action: PayloadAction<SigninResponse>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
            localStorage.setItem(token, action.payload.token);
        },
        signinFail: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signupRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signupSuccess: (state, action: PayloadAction<SignupResponse>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
            localStorage.setItem(token, action.payload.token);
        },
        signupFail: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    setUser,
    logout,
    setLoading,
    setError,
    clearError,
    signinRequest,
    signinSuccess,
    signinFail,
    signupRequest,
    signupSuccess,
    signupFail,
} = authSlice.actions;

export const authActions = authSlice.actions;
export default authSlice.reducer;
