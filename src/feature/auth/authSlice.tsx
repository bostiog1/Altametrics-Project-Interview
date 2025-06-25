// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // Type-only import
import { authApi } from "../../api"; // Regular value import (assuming this exports { login } or similar)
import type { LoginCredentials, AuthResponse, ApiError } from "../../types"; // Type-only import

// Define initial state for authentication
interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null; // Error type is string based on rejectValue
}

const initialState: AuthState = {
  // Attempt to load token from localStorage on app initialization
  token: localStorage.getItem("authToken"), // Using "authToken" as the key
  isLoading: false,
  error: null,
};

// Async Thunk for handling the login process
// It will dispatch pending, fulfilled, or rejected actions
export const login = createAsyncThunk<
  // Named `login`
  AuthResponse, // Fulfilled payload type
  LoginCredentials, // Argument type
  { rejectValue: string } // Rejected payload type is string
>(
  "auth/login", // Action type prefix
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials); // Call the API login function
      // On successful login, store the token in localStorage
      localStorage.setItem("authToken", response.token); // Store token with "authToken" key
      return response; // This payload will go to login.fulfilled
    } catch (error: any) {
      // Handle API errors and extract a user-friendly message
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      return rejectWithValue(errorMessage); // This payload will go to login.rejected (as a string)
    }
  }
);

const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    // Synchronous action to log out the user
    logout: (state) => {
      state.token = null; // Clear token from Redux state
      state.isLoading = false; // Reset loading state
      state.error = null; // Clear any error state
      localStorage.removeItem("authToken"); // Remove token from localStorage with "authToken" key
    },
    // Synchronous action to clear any login-related error messages
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  // Extra reducers to handle the lifecycle actions of the async thunk (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true; // Set loading to true
        state.error = null; // Clear any previous error
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false; // Loading finished
          state.token = action.payload.token; // Store the received token
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          // Action payload is string (from rejectWithValue) or undefined
          state.isLoading = false; // Loading finished
          state.token = null; // Ensure token is null on failure
          // Store the error message (action.payload is already a string here)
          state.error =
            action.payload || "An unknown error occurred during login.";
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions; // Export synchronous actions
export default authSlice.reducer; // Export the reducer itself

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit"; // Type-only import
// import { authApi } from "../../api"; // Regular value import
// import type { LoginCredentials, AuthResponse, ApiError } from "../../types"; // Type-only import

// interface AuthState {
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   // Attempt to load token from localStorage on app initialization
//   token: localStorage.getItem("authToken"),
//   isLoading: false,
//   error: null,
// };

// // Async Thunk for handling the login process
// // It will dispatch pending, fulfilled, or rejected actions
// export const login = createAsyncThunk<
//   AuthResponse,
//   LoginCredentials,
//   { rejectValue: string }
// >(
//   "auth/login", // Action type prefix
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await authApi.login(credentials);
//       // On successful login, store the token in localStorage
//       localStorage.setItem("authToken", response.token);
//       return response; // This payload will go to login.fulfilled
//     } catch (error: any) {
//       // Handle API errors and extract a user-friendly message
//       const errorMessage =
//         error.response?.data?.message ||
//         "Login failed. Please check your credentials.";
//       return rejectWithValue(errorMessage); // This payload will go to login.rejected
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth", // Name of the slice
//   initialState, // Initial state defined above
//   reducers: {
//     // Synchronous action to log out the user
//     logout: (state) => {
//       state.token = null; // Clear token from Redux state
//       localStorage.removeItem("authToken"); // Remove token from localStorage
//       // You might also clear other user-specific data here if any
//     },
//     // Synchronous action to clear any login-related error messages
//     clearAuthError: (state) => {
//       state.error = null;
//     },
//   },
//   // Extra reducers to handle the lifecycle actions of the async thunk (pending, fulfilled, rejected)
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.isLoading = true; // Set loading to true
//         state.error = null; // Clear any previous error
//       })
//       .addCase(
//         login.fulfilled,
//         (state, action: PayloadAction<AuthResponse>) => {
//           state.isLoading = false; // Loading finished
//           state.token = action.payload.token; // Store the received token
//         }
//       )
//       .addCase(
//         login.rejected,
//         (state, action: PayloadAction<string | undefined>) => {
//           state.isLoading = false; // Loading finished
//           state.token = null; // Ensure token is null on failure
//           state.error =
//             action.payload || "An unknown error occurred during login."; // Store the error message
//         }
//       );
//   },
// });

// export const { logout, clearAuthError } = authSlice.actions;
// export default authSlice.reducer;
