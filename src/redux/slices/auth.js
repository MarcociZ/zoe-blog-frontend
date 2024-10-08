import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchAuth = createAsyncThunk('/auth/fetchAuth',
    async (params) => {
        try {
            const { data } = await axios.post('/auth/login', params);
            return data;
        } catch (err) {
            const loginError = {
                name: "Login error",
                message: err.response.data.message
            };
            throw loginError;
        }
    });

export const fetchRegister = createAsyncThunk('/auth/fetchRegister',
    async (params) => {
        try {
            const { data } = await axios.post('/auth/register', params);
            return data;
        } catch (err) {
            const customError = {
                name: "Register error",
                message: err.response.data.message
            };
            throw customError;
        }
    });

export const fetchAuthMe = createAsyncThunk('/auth/fetchAuthMe',
    async () => {
        try {
            const { data } = await axios.get('/auth/me');
            return data;
        } catch (err) {
            const authError = {
                name: "Authentication error",
                message: err.response.data.message
            };
            throw authError;
        }
    });

const initialState = {
    auth: {
        data: null,
        status: "loading"
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.data = null;
                state.status = 'error';
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.data = null;
                state.status = 'error';
            })
            .addCase(fetchRegister.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action;
            })
    }
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
