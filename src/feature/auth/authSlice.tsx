import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api";
import type { LoginCredentials, AuthResponse } from "../../types";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    localStorage.setItem("authToken", response.token);
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Login failed. Please check your credentials.";
    return rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("authToken");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.token = action.payload.token;
        }
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.token = null;
          state.error =
            action.payload || "An unknown error occurred during login.";
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
