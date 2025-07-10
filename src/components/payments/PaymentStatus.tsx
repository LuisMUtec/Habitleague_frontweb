// src/components/payments/PaymentStatus.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePaymentContext } from '../../context/PaymentContext'

export const PaymentStatus: React.FC = () => {
  const { stripePaymentId } = useParams<{ stripePaymentId: string }>()
  const { getPaymentByStripeId } = usePaymentContext()
  const [status, setStatus] = useState<'paid' | 'pending' | 'failed' | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!stripePaymentId) return
    getPaymentByStripeId(stripePaymentId)
      .then(res => {
        // Map enum PaymentStatus to local string type
        let mapped: 'paid' | 'pending' | 'failed';
        switch (res.status) {
          case 'COMPLETED':
            mapped = 'paid';
            break;
          case 'PENDING':
            mapped = 'pending';
            break;
          case 'FAILED':
          case 'REFUNDED':
            mapped = 'failed';
            break;
          default:
            mapped = 'failed';
        }
        setStatus(mapped);
      })
      .catch(err => {
        setError(err.message || 'No se pudo obtener el estado')
      })
      .finally(() => setLoading(false))
  }, [stripePaymentId, getPaymentByStripeId])

  if (loading) return <p>Cargando estado…</p>
  if (error)   return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold">Estado del Pago</h2>
      <p>
        <strong>ID de pago:</strong> {stripePaymentId}
      </p>
      <p>
        <strong>Estado:</strong>{' '}
        {status === 'paid'
          ? '✅ Pagado'
          : status === 'pending'
          ? '⏳ Pendiente'
          : '❌ Fallido'}
      </p>
    </div>
  )
}
