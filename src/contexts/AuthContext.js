// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Auth state structure
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth actions
const AuthActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AuthActions.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AuthActions.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token with backend
          // const user = await verifyToken(token);
          // dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: { user, token } });
          
          // For demo, we'll use mock user
          const mockUser = {
            id: '1',
            email: 'demo@inklusikerja.id',
            fullName: 'Ahmad Surya',
            userType: 'candidate',
            disabilityType: 'Tuna Netra',
            profileCompletion: 75
          };
          
          dispatch({ 
            type: AuthActions.LOGIN_SUCCESS, 
            payload: { user: mockUser, token } 
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: AuthActions.LOGIN_FAILURE, payload: 'Token expired' });
        }
      } else {
        dispatch({ type: AuthActions.LOGIN_FAILURE, payload: null });
      }
    };

    checkAuthStatus();
  }, []);

  // Auth actions
  const login = async (email, password) => {
    dispatch({ type: AuthActions.LOGIN_START });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - replace with actual API call
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          fullName: 'Ahmad Surya',
          userType: 'candidate',
          disabilityType: 'Tuna Netra',
          profileCompletion: 75,
          accessibilityNeeds: ['Screen Reader', 'High Contrast']
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('token', token);
        dispatch({ 
          type: AuthActions.LOGIN_SUCCESS, 
          payload: { user: mockUser, token } 
        });
        
        return { success: true };
      } else {
        throw new Error('Email dan password harus diisi');
      }
    } catch (error) {
      dispatch({ 
        type: AuthActions.LOGIN_FAILURE, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: AuthActions.LOGIN_START });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: '1',
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.userType,
        disabilityType: userData.disabilityType,
        accessibilityNeeds: userData.accessibilityNeeds,
        profileCompletion: 25 // New user
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', token);
      dispatch({ 
        type: AuthActions.LOGIN_SUCCESS, 
        payload: { user: mockUser, token } 
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ 
        type: AuthActions.LOGIN_FAILURE, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AuthActions.LOGOUT });
  };

  const updateUser = (userData) => {
    dispatch({ 
      type: AuthActions.UPDATE_USER, 
      payload: userData 
    });
  };

  const clearError = () => {
    dispatch({ type: AuthActions.CLEAR_ERROR });
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;