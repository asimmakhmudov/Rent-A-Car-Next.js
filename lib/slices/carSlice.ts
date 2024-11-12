import { createSlice, createAsyncThunk, PayloadAction, createAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Car {
    file?: any;
    token?: any;
    Authorization?: string | null;
    carData?: any;
    carSlot?: any;
    slots?: any
    images?: any;
    message?: string | null;
    errorCar?: string | null;
    cars?: any;
    car_id?: any;
    car_owner_id?: any;
    city_id?: number | null | string;
    color_id?: number | null | string;
    brand_id?: number | null | string;
    model_id?: number | null | string;
    car_number?: any;
    car_images?: any;
    description?: string;
    price?: number;
    vin?: any;
    year?: string;
    response?: any;
}

export interface CarState {
    allCars: Car;
    mycars?: Car;
    slots?: Car;
    token?: any;
    car_images?: any;
    isLoggedIn: boolean;
    isLoading: boolean;
    errorCar: string | null;
}


export const getAllCars = createAsyncThunk(
    'cars/getAllCars',
    async (car?: Car) => {
        try {
            const params = new URLSearchParams();
            if (car?.brand_id) params.append('brand_id', car.brand_id.toString());
            if (car?.model_id) params.append('model_id', car.model_id.toString());
            if (car?.year) params.append('year', car.year.toString());
            if (car?.city_id) params.append('city_id', car.city_id.toString());
            if (car?.color_id) params.append('color_id', car.color_id.toString());
            const response = await axios.get<Car>(params.toString() ? `${process.env.NEXT_PUBLIC_API_URL}/cars?${params}` : `${process.env.NEXT_PUBLIC_API_URL}/cars`);
            return response.data;
        } catch (errorCar: any) {
            return errorCar;
        }
    }
);

export const getCarData_by_ownerid = createAsyncThunk(
    'car/getCarData_by_ownerid',
    async (car: Car) => {
        try {
            const response = await axios.get<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/cars/owner/${car.car_owner_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${car.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            return errorCar
        }
    }
);

export const postCarData = createAsyncThunk(
    'car/postCarData',
    async (data: Car, { rejectWithValue }) => {
        try {
            const response = await axios.post<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/cars`,
                data.carData,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            return rejectWithValue(errorCar.response.data.message)
        }
    }
)

export const deleteCar = createAsyncThunk(
    'car/deleteCar',
    async (data: Car, { rejectWithValue }) => {
        try {
            const response = await axios.delete<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/cars/${data?.car_id?.car_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            return rejectWithValue(errorCar.response.data.message)
        }
    }
)

export const postCarPhotos = createAsyncThunk(
    'car/postCarPhotos',
    async (data: Car, { rejectWithValue }) => {
        try {
            const form = new FormData();

            for (let i = 0; i < data.images.length; i++) {
                form.append('images', data.images[i]);
            }

            form.append('car_owner_id', data.car_owner_id);
            form.append('car_id', data.car_id);

            const response = await axios.post<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-images`,
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
        catch (errorCar: any) {
            return rejectWithValue(errorCar.response.data.message)
        }
    }
)


export const getCarPhotos = createAsyncThunk(
    'car/getCarPhotos',
    async (car: Car) => {
        try {
            const response = await axios.get<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-images/${car.car_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${car.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            errorCar
        }
    }
);

export const resetCarImages = createAction('car/resetCarImages');

export const postCarSlots = createAsyncThunk(
    'car/postCarSlots',
    async (data: Car, { rejectWithValue }) => {
        try {
            const response = await axios.post<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-available-slots`,
                data.carSlot,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            return rejectWithValue(errorCar.response.data.message)
        }
    }
)


export const getCarSlots = createAsyncThunk(
    'car/getCarSlots',
    async (data: Car) => {
        try {
            const response = await axios.get<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-available-slots/${data.car_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            errorCar
        }
    }
);

export const deleteCarSlots = createAsyncThunk(
    'car/deleteCarSlots',
    async (data: Car) => {
        try {
            const response = await axios.delete<Car>(
                `${process.env.NEXT_PUBLIC_API_URL}/car-available-slots/${data.car_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.Authorization}`
                    }
                }
            );
            return response.data;
        }
        catch (errorCar: any) {
            errorCar
        }
    }
);

const carSlice = createSlice({
    name: 'car',
    initialState: {
        allCars: {} as Car,
        mycars: {} as Car,
        slots: {} as Car,
        token: {} as Car,
        car_images: {} as Car,
        isLoggedIn: false,
        isLoading: false,
        errorCar: null,
    } as CarState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCars.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(getAllCars.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as any;
            })
            .addCase(getAllCars.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allCars = action.payload;
            })
            .addCase(getCarPhotos.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(getCarPhotos.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(getCarPhotos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.car_images = action.payload;
            })
            .addCase(getCarSlots.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(getCarSlots.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(getCarSlots.fulfilled, (state, action) => {
                state.isLoading = false;
                state.slots = action.payload;
            })
            .addCase(resetCarImages, (state) => {
                state.car_images = {} as Car;
            })
            .addCase(getCarData_by_ownerid.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(getCarData_by_ownerid.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(getCarData_by_ownerid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mycars = action.payload;
            })
            .addCase(postCarSlots.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(postCarSlots.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(postCarSlots.fulfilled, (state, action) => {
                state.isLoading = false;
                state.slots = action.payload;
            })
            .addCase(postCarPhotos.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(postCarPhotos.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(postCarPhotos.fulfilled, (state: any, action) => {
                state.isLoading = false;
                const mergedPhotos = { ...state?.car_images?.car_images, ...action?.payload?.car_images };
                state.car_images.car_images = mergedPhotos;
            })
            .addCase(postCarData.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(postCarData.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(postCarData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mycars = action.payload;
            })
            .addCase(deleteCar.pending, (state) => {
                state.isLoading = true;
                state.errorCar = null;
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.isLoading = false;
                state.errorCar = action.payload as string;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mycars = action.payload;
            })
    }
});



export const carActions = carSlice.actions;
export default carSlice.reducer;
