import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/api';

// Async thunks
export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getLeaderboards();
      return response.data.leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  leaderboards: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;