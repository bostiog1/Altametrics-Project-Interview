import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import type { LoginCredentials, AuthResponse } from "../types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  },
};
