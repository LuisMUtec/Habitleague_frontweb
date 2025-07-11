import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import { apiService } from '../services/api'
import { buildApiUrl } from '../config/api'
import type { Payment } from '../types'

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

  const getStatusColor = (hasPaid: boolean) => {
    return hasPaid ? 'text-green-600' : 'text-red-600'
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
    if (status === 'SUCCEEDED') return 'COMPLETED';
    return status;
  };

  if (loading) {
    return (
          <div className="min-h-screen bg-[#F1EADA]">
      <Header active="payments" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-[#AAA396]">Loading payments...</p>
        </div>
      </main>
    </div>
    )
  }

  if (error) {
    return (
          <div className="min-h-screen bg-[#F1EADA]">
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
          <h1 className="text-3xl font-bold text-[#584738] mb-2">My Payments</h1>
          <p className="text-[#AAA396]">Track all your challenge payments and their status</p>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#F7F4F2] rounded-2xl shadow p-8">
              <svg className="w-16 h-16 text-[#AAA396] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-medium text-[#584738] mb-2">No payments yet</h3>
              <p className="text-[#AAA396] mb-6">You haven't made any payments yet. Join a challenge to see your payment history here.</p>
              <button
                onClick={() => window.location.href = '/challenges'}
                className="px-6 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738]"
              >
                Browse Challenges
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-[#F7F4F2] rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Payment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#CEC1A8] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#584738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#584738]">
                          Challenge Payment
                        </h3>
                        <p className="text-sm text-[#AAA396]">
                          ID: {payment.stripePaymentId || payment.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#584738]">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-sm text-[#AAA396]">
                        {payment.currency}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex justify-end">
                      <div className="text-left w-full">
                        <h4 className="text-sm font-medium text-[#584738] mb-2">Payment Details</h4>
                        <div className="space-y-6 text-sm text-[#AAA396]">
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
                            <span className={`font-medium ${getStatusColor(mapPaymentStatus(payment.status) === 'COMPLETED')}`}>
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
                      className="px-4 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738] text-sm"
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
          <div className="mt-8 bg-[#F7F4F2] rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-[#584738] mb-4">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#584738]">{payments.length}</p>
                <p className="text-sm text-[#AAA396]">Total Payments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter(p => mapPaymentStatus(p.status) === 'COMPLETED').length}
                </p>
                <p className="text-sm text-[#AAA396]">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#584738]">
                  {formatCurrency(
                    payments.reduce((sum, p) => sum + p.amount, 0),
                    payments[0]?.currency || 'USD'
                  )}
                </p>
                <p className="text-sm text-[#AAA396]">Total Amount</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PaymentsPage 