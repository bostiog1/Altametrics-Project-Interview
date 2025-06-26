import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import * as authApi from "../../api";
import type { AuthResponse } from "../../types";

vi.mock("../../api", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

const mockAuthApiLogin = vi.mocked(authApi.authApi.login);

describe("authSlice", () => {
  const setupStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  };

  beforeEach(() => {
    mockAuthApiLogin.mockReset();
    localStorage.clear();
  });

  it("should handle login.pending and login.fulfilled when login is successful", async () => {
    const store = setupStore();
    const mockAuthResponse: AuthResponse = {
      token: "mock-jwt-token",
    };
    const credentials = { username: "testuser", password: "testpassword" };

    mockAuthApiLogin.mockResolvedValue(mockAuthResponse);

    const resultAction = await store.dispatch(login(credentials));

    expect(mockAuthApiLogin).toHaveBeenCalledWith(credentials);

    expect(login.fulfilled.match(resultAction)).toBe(true);
    expect(resultAction.payload).toEqual(mockAuthResponse);

    const authState = store.getState().auth;
    expect(authState.token).toBe("mock-jwt-token");
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toBeNull();

    expect(localStorage.getItem("authToken")).toBe("mock-jwt-token");
  });

  it("should handle login.pending and login.rejected when login fails", async () => {
    const store = setupStore();
    const mockErrorMessage = "Login failed. Please check your credentials.";
    const credentials = { username: "wronguser", password: "wrongpassword" };

    mockAuthApiLogin.mockRejectedValue({
      response: {
        data: { message: mockErrorMessage },
        status: 401,
      },
      message: "Request failed with status code 401",
    });

    const resultAction = await store.dispatch(login(credentials));

    expect(mockAuthApiLogin).toHaveBeenCalledWith(credentials);

    expect(login.rejected.match(resultAction)).toBe(true);
    expect(resultAction.payload).toBe(mockErrorMessage);
    expect(resultAction.error.message).toBe("Rejected");

    const authState = store.getState().auth;
    expect(authState.token).toBeNull();
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toBe(mockErrorMessage);

    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("should handle logout action correctly", () => {
    const store = setupStore();
    store.dispatch(login.fulfilled({ token: "initial-token" }));
    localStorage.setItem("authToken", "initial-token");

    expect(store.getState().auth.token).toBe("initial-token");
    expect(localStorage.getItem("authToken")).toBe("initial-token");

    store.dispatch(logout());

    const authState = store.getState().auth;
    expect(authState.token).toBeNull();
    expect(authState.error).toBeNull();
    expect(authState.isLoading).toBe(false);
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
