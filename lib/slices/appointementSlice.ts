import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Appointment {
    token?: any;
    data?: any;
    appointment?:any;
    type?: string;
    user_id?: number;
    Authorization?: string | null;
    message?: string | null;
    errorAppointments?: string | null;
    response?: any;
}

export interface AppointmentState {
    appointments: Appointment | undefined,
    token: Appointment,
    isLoading: boolean,
    errorAppointments: null | string,
}


export const postCarData = createAsyncThunk(
    'car/postCarData',
    async (appointment: Appointment, { rejectWithValue }) => {
        try {
            const response = await axios.post<Appointment>(
                `${process.env.NEXT_PUBLIC_API_URL}/cars`,
                appointment.data,
                {
                    headers: {
                        'Authorization': `Bearer ${appointment.Authorization}`
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


export const getAppointments = createAsyncThunk(
    'car/getAppointments',
    async (appointment: Appointment) => {
        try {
            const response = await axios.get<Appointment>(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointment.data}`,
                {
                    headers: {
                        'Authorization': `Bearer ${appointment.Authorization}`
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

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointments: {} as Appointment,
        token: {} as Appointment,
        isLoggedIn: false,
        isLoading: false,
        errorAppointments: null,
    } as AppointmentState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAppointments.pending, (state) => {
                state.isLoading = true;
                state.errorAppointments = null;
            })
            .addCase(getAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.errorAppointments = action.payload as string;
            })
            .addCase(getAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload;
            })
    }
});



export const appointmentActions = appointmentSlice.actions;
export default appointmentSlice.reducer;
