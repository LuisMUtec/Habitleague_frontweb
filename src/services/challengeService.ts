import { apiClient } from './apiClient';

export const challengeService = {
  getAllChallenges: () => apiClient.get('/challenges'),
  getChallengeById: (id: number) => apiClient.get(`/challenges/${id}`),
  createChallenge: (data: any) => apiClient.post('/challenges', data),
  joinChallenge: (id: number, data: any) => apiClient.post(`/challenges/${id}/join`, data),
  getParticipants: (id: number) => apiClient.get(`/challenges/${id}/participants`),
  getRequirementsStatus: (id: number) => apiClient.get(`/challenges/${id}/requirements-status`),
  getFeaturedChallenges: () => apiClient.get('/challenges/featured'),
  getPopularChallenges: () => apiClient.get('/challenges/popular'),
  getChallengesByCategory: (category: string) => apiClient.get(`/challenges/category/${category}`),
  getMyChallenges: () => apiClient.get('/challenges/my-challenges')
}; 