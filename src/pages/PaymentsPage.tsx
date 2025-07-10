import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import { apiService } from '../services/api'
import { buildApiUrl } from '../config/api'
import type { Payment } from '../types'
import { PaymentStatus } from '../types'

interface PaymentWithStatus extends Payment {
  challengeStatus?: {
    hasPaid: boolean
    challengeId: number
  }
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildApiUrl('/payments/my-payments')
      const data = await apiService.getJSON<Payment[]>(url)
      setPayments(data.map(payment => ({ ...payment, challengeStatus: undefined })))
    } catch (err: any) {
      setError(err.message || 'Error loading payments')
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentStatus = async (challengeId: number) => {
    setStatusLoading(prev => ({ ...prev, [challengeId]: true }))
    try {
      const url = buildApiUrl(`/payments/challenge/${challengeId}/status`)
      const data = await apiService.getJSON<{ hasPaid: boolean; challengeId: number }>(url)
      
      setPayments(prev => prev.map(payment => 
        payment.challengeId === challengeId 
          ? { ...payment, challengeStatus: data }
          : payment
      ))
    } catch (err: any) {
      console.error(`Error fetching status for challenge ${challengeId}:`, err)
      // Mostrar error en la UI para este challenge específico
      setPayments(prev => prev.map(payment => 
        payment.challengeId === challengeId 
          ? { ...payment, challengeStatus: { hasPaid: false, challengeId } }
          : payment
      ))
    } finally {
      setStatusLoading(prev => ({ ...prev, [challengeId]: false }))
    }
  }

  const getStatusColor = (hasPaid: boolean) => {
    return hasPaid ? 'text-green-600' : 'text-red-600'
  }

  const getStatusText = (hasPaid: boolean) => {
    return hasPaid ? 'Completed' : 'Pending'
  }

  const getStatusIcon = (hasPaid: boolean) => {
    return hasPaid ? (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  // Mapea el estado del backend a los valores esperados por el frontend
  const mapPaymentStatus = (status: string) => {
    if (status === 'SUCCEEDED') return PaymentStatus.COMPLETED;
    return status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="payments" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading payments...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="payments" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPayments}
              className="px-6 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738]"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1EADA]">
      <Header active="payments" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Payments</h1>
          <p className="text-gray-600">Track all your challenge payments and their status</p>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any payments yet. Join a challenge to see your payment history here.</p>
              <button
                onClick={() => window.location.href = '/challenges'}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                Browse Challenges
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Payment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Challenge Payment
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {payment.stripePaymentId || payment.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.currency}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex justify-end">
                      <div className="text-left w-full">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
                        <div className="space-y-6 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Challenge ID:</span>
                            <span className="font-medium">{payment.challengeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-medium">{payment.cardBrand} •••• {payment.cardLast4}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium">{formatDate(payment.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={`font-medium ${getStatusColor(mapPaymentStatus(payment.status) === PaymentStatus.COMPLETED)}`}>
                              {mapPaymentStatus(payment.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => window.open(`/challenges/${payment.challengeId}`, '_blank')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      View Challenge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {payments.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                <p className="text-sm text-gray-600">Total Payments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter(p => mapPaymentStatus(p.status) === PaymentStatus.COMPLETED).length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    payments.reduce((sum, p) => sum + p.amount, 0),
                    payments[0]?.currency || 'USD'
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PaymentsPage 