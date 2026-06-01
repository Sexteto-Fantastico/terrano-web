import api from "@/lib/axios";
import type { User } from "./users";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
  mustResetPassword?: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type DefinePasswordRequest = {
  password: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: response } = await api.post("/auth/login", data);
  return response;
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<{ message: string }> {
  const { data: response } = await api.post("/auth/forgot-password", data);
  return response;
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  const { data: response } = await api.post("/auth/reset-password", data);
  return response;
}

export async function definePassword(
  data: DefinePasswordRequest
): Promise<{ message: string }> {
  const { data: response } = await api.post("/auth/forgot-password", data);
  return response;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}
