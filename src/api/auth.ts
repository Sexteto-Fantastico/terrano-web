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
  /** Required only for a voluntary change, not for the forced first access. */
  currentPassword?: string;
};

export type DefinePasswordResponseDto = LoginResponseDto & { message: string };

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

// Changing the password revokes every session, so the API answers with a fresh one.
export async function definePassword(
  data: DefinePasswordRequestDto
): Promise<DefinePasswordResponseDto> {
  const { data: response } = await api.post("/auth/define-password", data);
  return response;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
