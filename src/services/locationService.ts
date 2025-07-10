import { apiClient } from './apiClient';

export const locationService = {
  getMyRegistrations: () => apiClient.get('/location/my-registrations'),
  getLocationByChallenge: (challengeId: number) => apiClient.get(`/location/challenge/${challengeId}`),
  geocode: (address: string) => apiClient.get('/location/geocode', { address }),
  verifyProximity: (data: any) => apiClient.post('/location/verify-proximity', data)
}; 