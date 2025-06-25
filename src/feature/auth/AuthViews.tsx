// src/features/auth/AuthViews.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks"; // Relative path
import { login, clearAuthError } from "./authSlice"; // Relative path
import { SAMPLE_CREDENTIALS } from "../../utils/constants"; // Relative path
import LoadingSpinner from "../../components/LoadingSpinner"; // Relative path (assuming you create this)

// --- Login Form Component ---
// This is a presentational component for the login form
export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState(SAMPLE_CREDENTIALS.username);
  const [password, setPassword] = useState(SAMPLE_CREDENTIALS.password);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions while loading
    if (error) dispatch(clearAuthError()); // Clear any previous error before new attempt
    dispatch(login({ username, password }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full flex flex-col space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>

      <div>
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs italic text-center">{error}</p>
      )}

      <button
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Login"}
      </button>

      <p className="text-center text-gray-500 text-xs">
        Sample Credentials: mor_2314 / 83r5^_
      </p>
    </form>
  );
};

// --- Login Page Component ---
// This component serves as the route entry point for the login view
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If a token exists (user is logged in), redirect to the products page
    if (token) {
      navigate("/dashboard", { replace: true }); // `replace: true` prevents going back to login with browser back button
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginForm />
    </div>
  );
};
