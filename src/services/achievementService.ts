import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api';

export interface UserAchievement {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  unlockedAt?: string;
  category?: string;
  points?: number;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const achievementService = {
  getMyAchievements: () => apiClient.get(API_CONFIG.ENDPOINTS.MY_ACHIEVEMENTS),
}; 