// src/services/paymentService.ts
import apiService from './api'
import { API_CONFIG, buildApiUrl } from '../config/api'
import type { Payment, PaymentData } from '../types'

export const paymentService = {
  async processPayment(data: PaymentData): Promise<Payment> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.PROCESS_PAYMENT)
    return apiService.postText(url, data) as any
  },

  async getMyPayments(): Promise<Payment[]> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.MY_PAYMENTS)
    return apiService.getJSON<Payment[]>(url)
  },

  async getPaymentStatus(challengeId: string): Promise<{ hasPaid: boolean }> {
    const url = buildApiUrl(
      API_CONFIG.ENDPOINTS.PAYMENT_STATUS.replace(':challengeId', challengeId)
    ) // añade PAYMENT_STATUS: '/payments/challenge/:challengeId/status'
    return apiService.getJSON<{ hasPaid: boolean }>(url)
  },

  async getPaymentByStripeId(stripePaymentId: string): Promise<Payment> {
    const url = buildApiUrl(
      API_CONFIG.ENDPOINTS.PAYMENT_BY_STRIPE_ID.replace(':stripePaymentId', stripePaymentId)
    )
    return apiService.getJSON<Payment>(url)
  },
}
