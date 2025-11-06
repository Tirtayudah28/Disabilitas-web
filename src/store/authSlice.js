// src/store/authSlice.js - PASTIKAN SEPERTI INI
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk untuk login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, userType }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email && password) {
        let userData = {};
        
        if (userType === 'employer') {
          userData = {
            id: '2',
            email,
            fullName: 'PT Tech Inklusif',
            userType: 'employer',
            companyName: 'PT Tech Inklusif',
            industry: 'Technology',
            profileCompletion: 85
          };
        } else {
          userData = {
            id: '1',
            email,
            fullName: 'Ahmad Surya',
            userType: 'candidate',
            disabilityType: 'Tuna Netra',
            profileCompletion: 75
          };
        }
        
        const token = 'mock-jwt-token-' + Date.now();
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { user: userData, token };
      } else {
        throw new Error('Email dan password harus diisi');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;