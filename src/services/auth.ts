// src/services/auth.ts
import apiService from './api'
import { API_CONFIG } from '../config/api'
import type { UserRegistration, UserLogin } from '../types'

export interface RegisterResponse {
  token: string
}

export interface LoginResponse {
  token: string
}

export const authService = {
  /**
   * Registra un nuevo usuario. POST /api/auth/register
   * Devuelve el JWT en texto plano.
   */
  async register(userData: UserRegistration): Promise<RegisterResponse> {
    // Usamos directamente el endpoint; baseURL ya aplica proxy en dev
    const token = await apiService.postText(
      API_CONFIG.ENDPOINTS.REGISTER,
      userData
    )
    return { token }
  },

  /**
   * Autentica un usuario existente. POST /api/auth/login
   * Devuelve el JWT en texto plano.
   */
  async login(credentials: UserLogin): Promise<LoginResponse> {
    const token = await apiService.postText(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    )
    return { token }
  },

  // Para llamadas GET/JSON: apiService.getJSON<T>(API_CONFIG.ENDPOINTS.XYZ)
}
