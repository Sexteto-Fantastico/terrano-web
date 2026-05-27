import api from "@/lib/axios";
import type { User } from "./users";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  expiresAt: string;
  mustResetPassword?: boolean;
};

export type ForgotPasswordRequestDto = {
  email: string;
};

export type ResetPasswordRequestDto = {
  token: string;
  password: string;
};

export type DefinePasswordRequestDto = {
  password: string;
};

export async function login(data: LoginRequestDto): Promise<LoginResponseDto> {
  const { data: response } = await api.post("/auth/login", data);
  return response;
}

export async function forgotPassword(
  data: ForgotPasswordRequestDto
): Promise<{ message: string }> {
  const { data: response } = await api.post("/auth/forgot-password", data);
  return response;
}

export async function resetPassword(
  data: ResetPasswordRequestDto
): Promise<{ message: string }> {
  const { data: response } = await api.post("/auth/reset-password", data);
  return response;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function definePassword(
  data: DefinePasswordRequestDto
): Promise<{ message: string }> {
  const { data: response } = await api.patch("/auth/password", data);
  return response;
}
