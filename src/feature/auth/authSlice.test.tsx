// src/features/auth/authSlice.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
// FIX 1: Import `login` (not `loginUser`) as exported in authSlice.ts
import authReducer, { login, logout } from "./authSlice"; // Corrected import
// Import the entire `authApi` module to mock its `login` function
import * as authApi from "../../api";
import type { AuthResponse } from "../../types";

// Mock the `authApi` module. This is crucial: we don't want actual network requests during tests!
vi.mock("../../api", () => ({
  authApi: {
    // Mock the `authApi` object and its methods
    login: vi.fn(), // Mock the `login` method specifically
  },
}));

// Type the mock function for better TypeScript support
const mockAuthApiLogin = vi.mocked(authApi.authApi.login);

describe("authSlice", () => {
  // Helper function to create a fresh store for each test
  const setupStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  };

  beforeEach(() => {
    // Reset mocks before each test to ensure test isolation
    mockAuthApiLogin.mockReset(); // Reset the specific mocked API function
    // Clear localStorage for consistent test runs across tests
    localStorage.clear();
  });

  it("should handle login.pending and login.fulfilled when login is successful", async () => {
    const store = setupStore();
    // FIX 2: Remove `userId` as `AuthResponse` typically only has `token` from FakeStoreAPI
    const mockAuthResponse: AuthResponse = {
      token: "mock-jwt-token",
    };
    const credentials = { username: "testuser", password: "testpassword" };

    // ARRANGE: Mock the API call to return a successful response
    mockAuthApiLogin.mockResolvedValue(mockAuthResponse); // This makes `authApi.login` return our mock response

    // ACT: Dispatch the async thunk `login`
    const resultAction = await store.dispatch(login(credentials));

    // ASSERT: Check the state and dispatched actions
    // Verify the API function was called with correct credentials
    expect(mockAuthApiLogin).toHaveBeenCalledWith(credentials);

    // Verify the `login.fulfilled` action was dispatched correctly
    expect(login.fulfilled.match(resultAction)).toBe(true);
    expect(resultAction.payload).toEqual(mockAuthResponse);

    // Verify the Redux state was updated correctly
    const authState = store.getState().auth;
    expect(authState.token).toBe("mock-jwt-token");
    expect(authState.isLoading).toBe(false);
    expect(authState.error).toBeNull();

    // Verify localStorage persistence
    expect(localStorage.getItem("authToken")).toBe("mock-jwt-token");
  });

  it("should handle login.pending and login.rejected when login fails", async () => {
    const store = setupStore();
    // Define the mock error message as a string, matching your thunk's `rejectValue` type
    const mockErrorMessage = "Login failed. Please check your credentials.";
    const credentials = { username: "wronguser", password: "wrongpassword" };

    // ARRANGE: Mock the API call to throw an error (simulating an Axios error response)
    mockAuthApiLogin.mockRejectedValue({
      response: {
        data: { message: mockErrorMessage },
        status: 401,
      },
      message: "Request failed with status code 401", // Mimic Axios error structure for consistency
    });

    // ACT: Dispatch the async thunk `login`
    const resultAction = await store.dispatch(login(credentials));

    // ASSERT: Check the state and dispatched actions
    expect(mockAuthApiLogin).toHaveBeenCalledWith(credentials);

    // Verify the `login.rejected` action was dispatched correctly
    expect(login.rejected.match(resultAction)).toBe(true);
    // Verify the `payload` of the rejected action matches the error message string
    expect(resultAction.payload).toBe(mockErrorMessage);
    // Redux Toolkit's `rejected` action includes an `error` object with a generic message like "Rejected"
    expect(resultAction.error.message).toBe("Rejected");

    // Verify the Redux state was updated correctly
    const authState = store.getState().auth;
    expect(authState.token).toBeNull(); // Token should be null on failure
    expect(authState.isLoading).toBe(false);
    // Verify the error state contains the specific error message string
    expect(authState.error).toBe(mockErrorMessage);

    // Verify localStorage is cleared on failed login
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("should handle logout action correctly", () => {
    const store = setupStore();
    // Set an initial state with a token to simulate a logged-in user
    // Use the `login.fulfilled` action to set up the state properly
    store.dispatch(login.fulfilled({ token: "initial-token" }));
    // Also set localStorage to reflect the initial logged-in state
    localStorage.setItem("authToken", "initial-token");

    // Verify initial state
    expect(store.getState().auth.token).toBe("initial-token");
    expect(localStorage.getItem("authToken")).toBe("initial-token");

    // ARRANGE & ACT: Dispatch the `logout` action
    store.dispatch(logout());

    // ASSERT: Verify the token is cleared from state and localStorage
    const authState = store.getState().auth;
    expect(authState.token).toBeNull();
    expect(authState.error).toBeNull(); // Ensure error state is also cleared on logout
    expect(authState.isLoading).toBe(false); // Ensure loading state is reset
    expect(localStorage.getItem("authToken")).toBeNull(); // Verify localStorage cleared
  });
});
// // src/features/auth/authSlice.test.ts
// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer, { loginUser, logout } from "./authSlice"; // Import reducer and thunks/actions
// import { loginTest } from "../../api/authApi"; // Import the actual API function to mock it
// import type { AuthResponse } from "../../types";

// // Mock the entire authApi module or just the 'login' function
// // This is crucial: we don't want actual network requests during tests!
// vi.mock("../../api/authApi", () => ({
//   login: vi.fn(), // Mock the login function
// }));

// const mockLogin = vi.mocked(loginTest); // Type the mock function for better TypeScript support

// describe("authSlice", () => {
//   // Helper function to create a fresh store for each test
//   const setupStore = () => {
//     return configureStore({
//       reducer: {
//         auth: authReducer,
//       },
//     });
//   };

//   beforeEach(() => {
//     // Reset mocks before each test to ensure test isolation
//     mockLogin.mockReset();
//   });

//   it("should handle loginUser.pending and loginUser.fulfilled when login is successful", async () => {
//     const store = setupStore();
//     const mockAuthResponse: AuthResponse = {
//       token: "mock-jwt-token",
//       userId: 1,
//     };
//     const credentials = { username: "testuser", password: "testpassword" };

//     // ARRANGE: Mock the API call to return a successful response
//     mockLogin.mockResolvedValue(mockAuthResponse); // This makes the 'login' function return our mock response

//     // ACT: Dispatch the async thunk
//     const resultAction = await store.dispatch(loginUser(credentials));

//     // ASSERT: Check the state and dispatched actions
//     // Check if the login API function was called with correct credentials
//     expect(mockLogin).toHaveBeenCalledWith(credentials);

//     // Check if the loginUser.fulfilled action was dispatched correctly
//     expect(loginUser.fulfilled.match(resultAction)).toBe(true);
//     expect(resultAction.payload).toEqual(mockAuthResponse);

//     // Check if the Redux state was updated correctly
//     const authState = store.getState().auth;
//     expect(authState.token).toBe("mock-jwt-token");
//     expect(authState.isLoading).toBe(false);
//     expect(authState.error).toBeNull();
//   });

//   it("should handle loginUser.pending and loginUser.rejected when login fails", async () => {
//     const store = setupStore();
//     const mockError = { message: "Invalid credentials", status: 401 };
//     const credentials = { username: "wronguser", password: "wrongpassword" };

//     // ARRANGE: Mock the API call to throw an error
//     mockLogin.mockRejectedValue(mockError); // This makes the 'login' function throw an error

//     // ACT: Dispatch the async thunk
//     const resultAction = await store.dispatch(loginUser(credentials));

//     // ASSERT: Check the state and dispatched actions
//     expect(mockLogin).toHaveBeenCalledWith(credentials);

//     // Check if the loginUser.rejected action was dispatched correctly
//     expect(loginUser.rejected.match(resultAction)).toBe(true);
//     expect(resultAction.payload).toEqual(mockError); // Payload should be the error
//     expect(resultAction.error.message).toBe("Rejected"); // Redux Toolkit uses 'Rejected' for generic errors

//     // Check if the Redux state was updated correctly
//     const authState = store.getState().auth;
//     expect(authState.token).toBeNull(); // Token should remain null
//     expect(authState.isLoading).toBe(false);
//     expect(authState.error).toEqual(mockError);
//   });

//   it("should handle logout action correctly", () => {
//     const store = setupStore();
//     // Set an initial state with a token
//     store.dispatch({
//       type: "auth/loginUser/fulfilled",
//       payload: { token: "initial-token", userId: 1 },
//     });
//     expect(store.getState().auth.token).toBe("initial-token");

//     // ARRANGE & ACT: Dispatch the logout action
//     store.dispatch(logout());

//     // ASSERT: Check if the token is cleared and state is reset
//     const authState = store.getState().auth;
//     expect(authState.token).toBeNull();
//     expect(authState.error).toBeNull();
//     expect(authState.isLoading).toBe(false);
//   });
// });
