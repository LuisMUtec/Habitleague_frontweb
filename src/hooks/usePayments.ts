import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import type { Payment, PaymentData, PaymentStatus } from '../types';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment history
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getMyPayments();
      setPayments(response as Payment[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Process payment
  const processPayment = useCallback(async (paymentData: PaymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.processPayment(paymentData);
      setCurrentPayment(response as Payment);
      // Refresh payment history
      await fetchPayments();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]);

  // Get payment status for a challenge
  const getPaymentStatus = useCallback(async (challengeId: number): Promise<PaymentStatus> => {
    try {
      setError(null);
      const response = await paymentService.getPaymentStatusByChallenge(challengeId);
      return response as PaymentStatus;
    } catch (err: any) {
      setError(err.message || 'Failed to get payment status');
      throw err;
    }
  }, []);

  // Get payment by Stripe ID
  const getPaymentByStripeId = useCallback(async (stripePaymentId: string) => {
    try {
      setError(null);
      const response = await paymentService.getPaymentByStripeId(stripePaymentId);
      return response as Payment;
    } catch (err: any) {
      setError(err.message || 'Failed to get payment');
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    payments,
    currentPayment,
    loading,
    error,
    fetchPayments,
    processPayment,
    getPaymentStatus,
    getPaymentByStripeId,
    clearError
  };
}; 