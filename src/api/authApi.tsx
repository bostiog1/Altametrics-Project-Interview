// src/api/authApi.ts
import axios from "axios";
import type { LoginCredentials, AuthResponse } from "../types"; // Assuming these types are defined

const API_BASE_URL = "https://fakestoreapi.com"; // Your API base URL

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle login API call
export const loginTest = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await authApiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

// You can export the axios instance if needed for other API calls,
// but for login, just exporting the function is fine.
// export default authApiClient; // Not strictly needed for this example's test
