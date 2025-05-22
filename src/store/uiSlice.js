import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  loadingMessage: '',
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { setLoading, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;