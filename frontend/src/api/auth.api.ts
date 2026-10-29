import { apiRequest } from '../api'

export type LoginRequest = {
  identifier: string
  password: string
}

export type LoginResponse = {
  message: string
  accessToken: string
}

export function loginApi(data: LoginRequest) {
  return apiRequest<LoginResponse>('/customers/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export type RegisterRequest = {
  fullName: string
  email?: string
  phone?: string
  password: string
}

export type RegisterResponse = {
  message: string
}

export function registerApi(data: RegisterRequest) {
  return apiRequest<RegisterResponse>('/customers/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
