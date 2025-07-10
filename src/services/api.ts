// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { API_CONFIG } from '../config/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      // En dev → '' + ruta → '/user/profile' será resuelta por el proxy '/api'
      // En prod → 'http://.../api' + '/user/profile'
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
    })

    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('Enviando Authorization header:', `Bearer ${token.substring(0, 20)}...`)
        } else {
          console.warn('No se encontró token en localStorage')
        }
        return config
      },
      error => Promise.reject(error)
    )

    this.api.interceptors.response.use(
      (res: AxiosResponse) => res,
      (err: AxiosError) => {
        console.error('Error en respuesta API:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        })
        
        // Crear un error más descriptivo
        let errorMessage = 'An error occurred'
        
        if (err.response?.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.'
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          // No redirigir automáticamente en login/register
          if (!err.config?.url?.includes('/auth/')) {
            window.location.href = '/login'
          }
        } else if (err.response?.status === 403) {
          errorMessage = 'Access denied. Please log in again.'
        } else if (err.response?.status === 404) {
          errorMessage = 'Resource not found.'
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (err.response?.data) {
          try {
            const errorData = JSON.parse(err.response.data as string)
            errorMessage = errorData.message || errorData.error || errorMessage
          } catch {
            errorMessage = err.response.data as string || errorMessage
          }
        }
        
        const enhancedError = new Error(errorMessage)
        ;(enhancedError as any).status = err.response?.status
        ;(enhancedError as any).originalError = err
        
        return Promise.reject(enhancedError)
      }
    )
  }

  public async postText(url: string, data?: any): Promise<string> {
    const response = await this.api.post<string>(url, data)
    return response.data
  }

  public async getJSON<T>(url: string): Promise<T> {
    const resp = await this.api.get<T>(url, { responseType: 'json' })
    return (resp as any).data
  }

  public async putJSON<T>(url: string, data?: any): Promise<T> {
    const resp = await this.api.put<T>(url, data, { responseType: 'json' })
    return (resp as any).data
  }

  public async patchJSON<T>(url: string, data?: any): Promise<T> {
    const resp = await this.api.patch<T>(url, data, { responseType: 'json' })
    return (resp as any).data
  }
}

export const apiService = new ApiService()
export default apiService
