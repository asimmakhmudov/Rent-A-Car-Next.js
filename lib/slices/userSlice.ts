import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface User {
    user_id?: number;
    account_type_id?: number;
    account_type?: string;
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    map_location?: string;
    image?: string | null;
    tin?: string;
    website?: string;
    address?: string;
    profile?: any;
    payload?: any;
    is_verified?: boolean;
    file?: any;
    updatedData?: any;
    verifyData?: any;
    verify_type?: string;
    token?: any;
    Authorization?: string | null;
    message?: string | null;
    error?: string | null;
}

export interface UserState {
    user: User;
    profile?: any; 
    token?: any;
    images?: any;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
}

export const getUserType = createAsyncThunk(
    'user/getUserType',
    async (data: User, { rejectWithValue }) => {
        try {
            const response = await axios.get<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/profile`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
); 

export const getUser = createAsyncThunk(
    'user/getUser',
    async (data: User, { rejectWithValue, getState }) => {
        try {
            const response = await axios.get<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/${data.account_type}/${data.user_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

export const getProfilePhoto = createAsyncThunk(
    'user/getProfilePhoto',
    async (data: User, { rejectWithValue }) => {
        try {
            const response = await axios.get<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/profile-image`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

export const postProfilePhoto = createAsyncThunk(
    'user/postProfilePhoto',
    async (data: User, { rejectWithValue }) => {
        try {
            const form = new FormData();
            form.append('file', data.file);

            const response = await axios.post<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/profile-image`,
                form,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response.data.message)
        }
    }
)



export const verifyUser = createAsyncThunk(
    'user/verifyUser',
    async (data: User, { rejectWithValue, getState }) => {
        try {
            const response = await axios.post<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/${data?.verify_type}`,
                data.verifyData,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data
        }
        catch (error: any) {
            return rejectWithValue(error.response.data.message)
        }
    }
)


export const putUser = createAsyncThunk(
    'user/putUser',
    async (data: User, { rejectWithValue }) => {
        try {
            const response = await axios.put<User>(
                `${process.env.NEXT_PUBLIC_API_URL}/${data.account_type}/${String(data.user_id)}`,
                data.updatedData,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    },
                }
            )
            return response.data
        }
        catch (error: any) {
            return rejectWithValue(error.response.data.message)
        }
    }
)


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {} as User,
        token: {} as User,
        images: {} as User,
        isLoggedIn: false,
        isLoading: false,
        error: null,
    } as UserState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserType.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserType.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getUserType.fulfilled, (state, action: PayloadAction<User | null>) => {
                state.isLoading = false;
                const mergedProfile = { ...state.user.profile, ...action?.payload?.profile };
                state.user.profile = mergedProfile;
                state.isLoggedIn = true;
            })
            .addCase(getProfilePhoto.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfilePhoto.fulfilled, (state: any, action) => {
                state.isLoading = false;
                state.images = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(getProfilePhoto.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state: any, action) => {
                state.isLoading = false;
                const mergedProfile = { ...state.user.profile, ...action.payload.profile };
                state.user.profile = mergedProfile;
                state.isLoggedIn = true;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(putUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(putUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(putUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            // .addCase(getRefreshToken.pending, (state) => {
            //     state.isLoading = true;
            //     state.error = null;
            // })
            // .addCase(getRefreshToken.rejected, (state, action) => {
            //     state.isLoading = false;
            //     state.error = action.payload as string;
            // })
            // .addCase(getRefreshToken.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.token = action.payload;
            // })
    }
});



export const userActions = userSlice.actions;
export default userSlice.reducer;
