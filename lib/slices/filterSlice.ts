import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Filter {
    Authorization?: string | null;
    message?: string | null;
    error?: string | null;
    car_colors?: any;
    id?: number;
    code?: string | null;
    name?: string | null;
}

export interface FilterState {
    filter?: Filter;
    colors?: any;
    cities?: any;
    brands?: any;
    models?: any;
    allmodels?: any;
    token?: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
}

export const getColor = createAsyncThunk(
    'filter/getColor',
    async () => {
        try {
            const response = await axios.get<Filter>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-colors`
            );
            return response.data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

export const getCities = createAsyncThunk(
    'filter/getCities',
    async () => {
        try {
            const response = await axios.get<Filter>(
                `${process.env.NEXT_PUBLIC_API_URL}/cities`
            );
            return response.data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

export const getBrands = createAsyncThunk(
    'filter/getBrands',
    async () => {
        try {
            const response = await axios.get<Filter>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-brands`
            );
            return response.data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

export const getAllModels = createAsyncThunk(
    'filter/getAllModels',
    async () => {
        try {
            const response = await axios.get<Filter>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-brand-models`
            );
            return response.data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

export const getModels = createAsyncThunk(
    'filter/getModels',
    async (data: Filter) => {
        try {
            const response = await axios.get<Filter>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-brands/${data.id}/models`

            );
            return response.data;
        } catch (error: any) {
            return error.response.data.message;
        }
    }
);

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        colors: {} as FilterState,
        cities: {} as FilterState,
        brands: {} as FilterState,
        models: {} as FilterState,
        allmodels: {} as FilterState,
        token: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
    } as FilterState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getColor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getColor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getColor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colors = action.payload;
            })
            .addCase(getCities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCities.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getCities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cities = action.payload;
            })
            .addCase(getBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBrands.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getBrands.fulfilled, (state, action) => {
                state.isLoading = false;
                state.brands = action.payload;
            })
            .addCase(getModels.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getModels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getModels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.models = action.payload;
            })
            .addCase(getAllModels.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllModels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllModels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allmodels = action.payload;
            })
    }
});

export const filterActions = filterSlice.actions;
export default filterSlice.reducer;
