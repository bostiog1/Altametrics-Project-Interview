// src/features/auth/AuthViews.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // NEW: For testing components that use React Router
import { Provider } from "react-redux"; // NEW: For providing the Redux store
import { configureStore } from "@reduxjs/toolkit"; // NEW: For creating a mock store

// Import the component we're testing
import { LoginPage } from "./AuthViews";

// Import the reducer for the slice(s) used by the component
import authReducer from "./authSlice";

// Mock the Redux store for testing
// We create a minimal store with just the auth slice
const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers if the component you're testing relies on them
    },
  });
};

describe("LoginPage", () => {
  it("renders username and password inputs and a login button", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          {" "}
          {/* Mocks the browser's router */}
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // ASSERT: Check if the elements are present in the document
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    // CHANGE THIS LINE:
    // expect(screen.getByText(/login/i)).toBeInTheDocument();
    // TO THIS: Use getByRole for the heading, which is more specific
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument(); // <--- FIX HERE: Targets the <h2> heading
  });

  it("displays an error message when login fails (simulated)", async () => {
    // This test requires mocking API calls, which is a bit more advanced.
    // For a first test, we will skip *simulating* a failed login interaction,
    // but we can check if the error *display area* is initially empty.

    // ARRANGE: Render the LoginPage
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // ASSERT: Ensure the error message area is not visible initially
    // Using `queryByText` because we expect it *not* to be in the document
    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });

  // You could add a test here to simulate typing and clicking login,
  // but that would require mocking the `login` thunk and the `authApi.login` call,
  // which is a good next "small step" once you're comfortable with this basic setup.
});
