import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearAuthError } from "./authSlice";
import { SAMPLE_CREDENTIALS } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState(SAMPLE_CREDENTIALS.username);
  const [password, setPassword] = useState(SAMPLE_CREDENTIALS.password);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (error) dispatch(clearAuthError());
    dispatch(login({ username, password }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full flex flex-col space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Login
      </h2>

      <div>
        <label
          htmlFor="username"
          className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs italic text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }
           dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white`}
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Login"}
      </button>

      <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
        Sample Credentials: mor_2314 / 83r5^_
      </p>
    </form>
  );
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <LoginForm />
    </div>
  );
};
