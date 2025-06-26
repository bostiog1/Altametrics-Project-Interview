import axios from "axios";
import type { LoginCredentials, AuthResponse } from "../types";

const API_BASE_URL = "https://fakestoreapi.com";

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginTest = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await authApiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};
