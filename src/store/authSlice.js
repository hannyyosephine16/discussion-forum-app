import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/api';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      apiService.setAuthToken(response.data.token);
      
      // Get user profile after login
      const profileResponse = await apiService.getOwnProfile();
      return {
        token: response.data.token,
        user: profileResponse.data.user,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getOwnProfile = createAsyncThunk(
  'auth/getOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getOwnProfile();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  token: apiService.getAuthToken(),
  isAuthenticated: !!apiService.getAuthToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      apiService.removeAuthToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get profile cases
      .addCase(getOwnProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getOwnProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If getting profile fails, likely token is invalid
        if (action.payload.includes('unauthorized')) {
          apiService.removeAuthToken();
          state.token = null;
          state.isAuthenticated = false;
          state.user = null;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;