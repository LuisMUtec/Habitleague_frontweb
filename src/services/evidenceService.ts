import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api';
import { replaceUrlParams } from '../config/api';
import { isLocationWithinTolerance } from '../utils/locationUtils';
import type {
  EvidenceResponse,
  SubmitEvidenceRequest,
  SubmitEvidenceResponse,
  DailySubmissionStatus,
  EvidenceStatsResponse,
  Challenge
} from '../types';

export const evidenceService = {
  // Enviar evidencia diaria
  submitEvidence: (request: SubmitEvidenceRequest): Promise<SubmitEvidenceResponse> => {
    console.log('🔄 Submitting evidence for challenge:', request.challengeId);
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBMIT_EVIDENCE, request);
  },

  // Obtener todas las evidencias del usuario
  getMyEvidences: (): Promise<EvidenceResponse[]> => {
    console.log('🔄 Loading user evidences...');
    return apiClient.get(API_CONFIG.ENDPOINTS.MY_EVIDENCES);
  },

  // Obtener evidencia específica por ID
  getEvidenceById: (evidenceId: number): Promise<EvidenceResponse> => {
    console.log('🔄 Loading evidence details for ID:', evidenceId);
    const url = replaceUrlParams(API_CONFIG.ENDPOINTS.EVIDENCE_BY_ID, { evidenceId: evidenceId.toString() });
    return apiClient.get(url);
  },

  // Obtener evidencias por challenge específico
  getEvidencesByChallenge: (challengeId: number): Promise<EvidenceResponse[]> => {
    console.log('🔄 Loading evidences for challenge:', challengeId);
    const url = replaceUrlParams(API_CONFIG.ENDPOINTS.EVIDENCES_BY_CHALLENGE, { challengeId: challengeId.toString() });
    return apiClient.get(url);
  },

  // Verificar estado de envío diario
  getDailySubmissionStatus: (challengeId: number): Promise<DailySubmissionStatus> => {
    console.log('🔄 Checking daily submission status for challenge:', challengeId);
    const url = replaceUrlParams(API_CONFIG.ENDPOINTS.DAILY_STATUS, { challengeId: challengeId.toString() });
    return apiClient.get(url);
  },

  // Obtener estadísticas de evidencias
  getMyEvidenceStats: (): Promise<EvidenceStatsResponse> => {
    console.log('🔄 Loading evidence statistics...');
    return apiClient.get(API_CONFIG.ENDPOINTS.EVIDENCE_STATS);
  },

  // Health check del servicio de evidencias
  healthCheck: (): Promise<any> => {
    console.log('🔄 Checking evidence service health...');
    return apiClient.get(API_CONFIG.ENDPOINTS.EVIDENCE_HEALTH);
  },

  // Subir imagen de evidencia (simulado - en producción usarías un servicio de upload)
  uploadEvidenceImage: async (_file: File): Promise<string> => {
    console.log('🔄 Uploading evidence image...');
    
    // Simulación de upload - en producción esto iría a un servicio como AWS S3
    // NOTA: Cualquier imagen es aceptada sin validación AI
    return new Promise((resolve) => {
      setTimeout(() => {
        const uploadServiceUrl = import.meta.env.VITE_UPLOAD_SERVICE_URL || 'https://example.com';
        const fakeImageUrl = `${uploadServiceUrl}/evidence-images/${Date.now()}.jpg`;
        console.log('✅ Image uploaded and accepted (no AI validation):', fakeImageUrl);
        resolve(fakeImageUrl);
      }, 1000); // Reducido a 1 segundo para mejor UX
    });
  },

  // Obtener ubicación actual del usuario
  getCurrentLocation: (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Current location:', { latitude, longitude });
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('❌ Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Validar ubicación del usuario contra la ubicación del challenge
  validateLocation: (
    challenge: Challenge,
    userLat: number,
    userLon: number
  ): { isValid: boolean; distance: number; toleranceRadius: number } => {
    if (!challenge.location) {
      console.warn('⚠️ Challenge has no location data');
      return { isValid: true, distance: 0, toleranceRadius: 0 };
    }

    const distance = isLocationWithinTolerance(
      challenge.location.latitude,
      challenge.location.longitude,
      userLat,
      userLon,
      challenge.location.toleranceRadius
    );

    const actualDistance = Math.sqrt(
      Math.pow(challenge.location.latitude - userLat, 2) + 
      Math.pow(challenge.location.longitude - userLon, 2)
    ) * 111000; // Aproximación simple: 1 grado ≈ 111km

    console.log('📍 Location validation:', {
      challengeLocation: {
        lat: challenge.location.latitude,
        lng: challenge.location.longitude,
        toleranceRadius: challenge.location.toleranceRadius
      },
      userLocation: { lat: userLat, lng: userLon },
      distance: actualDistance,
      toleranceRadius: challenge.location.toleranceRadius,
      isValid: distance
    });

    return {
      isValid: distance,
      distance: actualDistance,
      toleranceRadius: challenge.location.toleranceRadius
    };
  }
}; 