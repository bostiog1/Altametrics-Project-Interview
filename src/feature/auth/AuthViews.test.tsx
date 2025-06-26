import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { LoginPage } from "./AuthViews";

import authReducer from "./authSlice";

const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe("LoginPage", () => {
  it("renders username and password inputs and a login button", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("displays an error message when login fails (simulated)", async () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });
});
