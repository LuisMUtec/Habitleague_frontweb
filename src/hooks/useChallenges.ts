// src/hooks/useChallenges.ts
import { useState, useCallback } from 'react'
import { apiService } from '../services/api'
import { buildApiUrl, API_CONFIG } from '../config/api'
import type { Challenge } from '../types'

export function useChallenges() {
  const [featured, setFeatured] = useState<Challenge[]>([])
  const [popular, setPopular] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFeatured = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GET_CHALLENGES + '/featured')
      const resp = await apiService.getJSON<{ data: Challenge[] }>(url)
      setFeatured(resp.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPopular = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GET_CHALLENGES + '/popular')
      const resp = await apiService.getJSON<{ data: Challenge[] }>(url)
      setPopular(resp.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    featuredChallenges: featured,
    popularChallenges: popular,
    loading,
    error,
    fetchFeaturedChallenges: fetchFeatured,
    fetchPopularChallenges: fetchPopular
  }
}
