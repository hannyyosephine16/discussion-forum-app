import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/api';

// Async thunks
export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAllThreads();
      return response.data.threads;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await apiService.getThreadDetail(threadId);
      return response.data.detailThread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const response = await apiService.createThread(threadData);
      return response.data.thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createComment = createAsyncThunk(
  'threads/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      console.log('Creating comment with:', { threadId, content }); // Debug
      const response = await apiService.createComment(threadId, content);
      console.log('Comment API response:', response); // Debug
      return { threadId, comment: response.data.comment };
    } catch (error) {
      console.error('Create comment error:', error); // Debug
      return rejectWithValue(error.message);
    }
  },
);

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, voteType }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;

      console.log('Voting thread:', { threadId, voteType, userId }); // Debug

      if (voteType === 1) {
        await apiService.upVoteThread(threadId);
      } else if (voteType === -1) {
        await apiService.downVoteThread(threadId);
      } else {
        await apiService.neutralVoteThread(threadId);
      }

      return { threadId, voteType, userId };
    } catch (error) {
      console.error('Vote thread error:', error); // Debug
      return rejectWithValue(error.message);
    }
  },
);

export const voteComment = createAsyncThunk(
  'threads/voteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;

      console.log('Voting comment:', { threadId, commentId, voteType, userId }); // Debug

      if (voteType === 1) {
        await apiService.upVoteComment(threadId, commentId);
      } else if (voteType === -1) {
        await apiService.downVoteComment(threadId, commentId);
      } else {
        await apiService.neutralVoteComment(threadId, commentId);
      }

      return { threadId, commentId, voteType, userId };
    } catch (error) {
      console.error('Vote comment error:', error); // Debug
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  threads: [],
  currentThread: null,
  filteredThreads: [],
  selectedCategory: 'all',
  categories: [],
  loading: false,
  error: null,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    clearCurrentThread: (state) => {
      state.currentThread = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (action.payload === 'all') {
        state.filteredThreads = state.threads;
      } else {
        state.filteredThreads = state.threads.filter(
          (thread) => thread.category === action.payload,
        );
      }
    },
    updateCategories: (state) => {
      const uniqueCategories = [...new Set(state.threads.map((thread) => thread.category))];
      state.categories = uniqueCategories;
    },
    // Optimistic updates for votes
    optimisticVoteThread: (state, action) => {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      
      if (thread) {
        // Ensure upVotesBy and downVotesBy are arrays
        thread.upVotesBy = thread.upVotesBy || [];
        thread.downVotesBy = thread.downVotesBy || [];
        
        // Remove user from all vote arrays first
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        
        // Add to appropriate array based on vote type
        if (voteType === 1) {
          thread.upVotesBy.push(userId);
        } else if (voteType === -1) {
          thread.downVotesBy.push(userId);
        }
      }

      // Update current thread if it's the same
      if (state.currentThread && state.currentThread.id === threadId) {
        state.currentThread.upVotesBy = state.currentThread.upVotesBy || [];
        state.currentThread.downVotesBy = state.currentThread.downVotesBy || [];
        
        state.currentThread.upVotesBy = state.currentThread.upVotesBy.filter((id) => id !== userId);
        state.currentThread.downVotesBy = state.currentThread.downVotesBy.filter((id) => id !== userId);
        
        if (voteType === 1) {
          state.currentThread.upVotesBy.push(userId);
        } else if (voteType === -1) {
          state.currentThread.downVotesBy.push(userId);
        }
      }
    },
    optimisticVoteComment: (state, action) => {
      const { commentId, voteType, userId } = action.payload;
      
      if (state.currentThread && state.currentThread.comments) {
        const comment = state.currentThread.comments.find((c) => c.id === commentId);
        if (comment) {
          // Ensure upVotesBy and downVotesBy are arrays
          comment.upVotesBy = comment.upVotesBy || [];
          comment.downVotesBy = comment.downVotesBy || [];
          
          // Remove user from all vote arrays first
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          
          // Add to appropriate array based on vote type
          if (voteType === 1) {
            comment.upVotesBy.push(userId);
          } else if (voteType === -1) {
            comment.downVotesBy.push(userId);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch threads cases
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
        state.filteredThreads = action.payload;
        
        // Update categories
        const uniqueCategories = [...new Set(action.payload.map((thread) => thread.category))];
        state.categories = uniqueCategories;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch thread detail cases
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create thread cases
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
        state.filteredThreads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create comment cases
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const { threadId, comment } = action.payload;
        
        console.log('Adding comment to state:', { threadId, comment }); // Debug
        
        if (state.currentThread && state.currentThread.id === threadId) {
          // Ensure comments array exists
          if (!state.currentThread.comments) {
            state.currentThread.comments = [];
          }
          state.currentThread.comments.push(comment);
        }
        
        // Update comment count in threads list
        const thread = state.threads.find((t) => t.id === threadId);
        if (thread) {
          thread.totalComments = (thread.totalComments || 0) + 1;
        }
        
        // Update filtered threads as well
        const filteredThread = state.filteredThreads.find((t) => t.id === threadId);
        if (filteredThread) {
          filteredThread.totalComments = (filteredThread.totalComments || 0) + 1;
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote thread cases
      .addCase(voteThread.fulfilled, (state, action) => {
        // Optimistic update was already applied, no need to update again
        console.log('Thread vote successful:', action.payload); // Debug
      })
      .addCase(voteThread.rejected, (state, action) => {
        state.error = action.payload;
        // TODO: Revert optimistic update on error
      })
      // Vote comment cases
      .addCase(voteComment.fulfilled, (state, action) => {
        // Optimistic update was already applied, no need to update again
        console.log('Comment vote successful:', action.payload); // Debug
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.error = action.payload;
        // TODO: Revert optimistic update on error
      });
  },
});

export const {
  clearCurrentThread,
  clearError,
  setSelectedCategory,
  updateCategories,
  optimisticVoteThread,
  optimisticVoteComment,
} = threadsSlice.actions;

export default threadsSlice.reducer;