import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadsReducer from './threadsSlice';
import usersReducer from './usersSlice';
import leaderboardReducer from './leaderboardSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    users: usersReducer,
    leaderboard: leaderboardReducer,
    ui: uiReducer,
  },
});

export default store;