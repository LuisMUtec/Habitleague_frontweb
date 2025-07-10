import { useState, useCallback } from 'react';
import { locationService } from '../services/locationService';
import type { Location, LocationData, LocationVerification } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current location from browser
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Fetch my location registrations
  const fetchMyRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getMyRegistrations();
      setMyRegistrations(response as Location[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch location registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get location for a specific challenge
  const getLocationByChallenge = useCallback(async (challengeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getLocationByChallenge(challengeId);
      setLocation(response as Location);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch challenge location');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Geocode address
  const geocode = useCallback(async (address: string) => {
    try {
      setError(null);
      const response = await locationService.geocode(address);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to geocode address');
      throw err;
    }
  }, []);

  // Verify proximity to challenge location
  const verifyProximity = useCallback(async (verificationData: LocationVerification) => {
    try {
      setError(null);
      const response = await locationService.verifyProximity(verificationData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to verify proximity');
      throw err;
    }
  }, []);

  // Register location for a challenge
  const registerLocation = useCallback(async (locationData: LocationData) => {
    try {
      setLoading(true);
      setError(null);
      // This would typically be part of the challenge join process
      // For now, we'll just update the local state
      const newLocation: Location = {
        id: Date.now(), // Temporary ID
        ...locationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLocation(newLocation);
      return newLocation;
    } catch (err: any) {
      setError(err.message || 'Failed to register location');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    location,
    myRegistrations,
    loading,
    error,
    getCurrentLocation,
    fetchMyRegistrations,
    getLocationByChallenge,
    geocode,
    verifyProximity,
    registerLocation,
    clearError
  };
}; 