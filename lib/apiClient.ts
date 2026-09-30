import { LoginDto, RegisterDto, AuthResponse } from "./auth-types";
import { getMemoryAccessToken } from "./auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getMemoryAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const hasJson = contentType && contentType.includes("application/json");
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (Array.isArray(data?.messages) ? data.messages.join(", ") : null) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};
