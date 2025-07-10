// src/components/payments/PaymentForm.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaymentContext } from '../../context/PaymentContext'

export const PaymentForm: React.FC = () => {
  const { processPayment } = usePaymentContext()
  const [challengeId, setChallengeId] = useState<number>(0)
  const [amount, setAmount]           = useState<number>(0)
  const [error, setError]             = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (challengeId <= 0 || amount <= 0) {
      setError('Debes indicar un challengeId y un monto válidos')
      return
    }
    setLoading(true)
    try {
      const resp = await processPayment({ challengeId, amount, currency: 'USD', paymentMethodId: 'card', cardLast4: '1234', cardBrand: 'Visa' })
      // una vez procesado, vas a la página de estado
      navigate(`/payments/status/${resp.stripePaymentId}`)
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold">Proceso de Pago</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Challenge ID</label>
        <input
          type="number"
          value={challengeId}
          onChange={e => setChallengeId(Number(e.target.value))}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Monto</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? 'Procesando…' : 'Pagar'}
      </button>
    </form>
  )
}
