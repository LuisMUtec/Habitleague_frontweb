import { apiClient } from './apiClient';
import type { ApiResponse } from '../types';

// Habit Types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  target?: number;
  isActive?: boolean;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}

export interface CreateProgressRequest {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}

export class HabitService {
  // Get all habits
  async getHabits(): Promise<Habit[]> {
    const response = await apiClient.get<ApiResponse<Habit[]>>('/habits');
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get habits');
    }
  }

  // Get habit by ID
  async getHabitById(habitId: string): Promise<Habit> {
    const response = await apiClient.get<ApiResponse<Habit>>(`/habits/${habitId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get habit');
    }
  }

  // Create new habit
  async createHabit(habitData: CreateHabitRequest): Promise<Habit> {
    const response = await apiClient.post<ApiResponse<Habit>>('/habits', habitData);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create habit');
    }
  }

  // Update habit
  async updateHabit(habitId: string, habitData: UpdateHabitRequest): Promise<Habit> {
    const response = await apiClient.put<ApiResponse<Habit>>(`/habits/${habitId}`, habitData);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update habit');
    }
  }

  // Delete habit
  async deleteHabit(habitId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/habits/${habitId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to delete habit');
    }
  }

  // Get habit progress
  async getHabitProgress(habitId: string, startDate?: string, endDate?: string): Promise<HabitProgress[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get<ApiResponse<HabitProgress[]>>(`/habits/${habitId}/progress`, params);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get habit progress');
    }
  }

  // Create progress entry
  async createProgress(progressData: CreateProgressRequest): Promise<HabitProgress> {
    const response = await apiClient.post<ApiResponse<HabitProgress>>('/habits/progress', progressData);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create progress');
    }
  }

  // Update progress entry
  async updateProgress(progressId: string, progressData: Partial<CreateProgressRequest>): Promise<HabitProgress> {
    const response = await apiClient.put<ApiResponse<HabitProgress>>(`/habits/progress/${progressId}`, progressData);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update progress');
    }
  }

  // Delete progress entry
  async deleteProgress(progressId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/habits/progress/${progressId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to delete progress');
    }
  }

  // Get habit statistics
  async getHabitStats(habitId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    completionRate: number;
    averageValue?: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      currentStreak: number;
      longestStreak: number;
      totalCompletions: number;
      completionRate: number;
      averageValue?: number;
    }>>(`/habits/${habitId}/stats`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get habit statistics');
    }
  }

  // Get all habits with their progress for a specific date
  async getHabitsWithProgress(date: string): Promise<(Habit & { progress?: HabitProgress })[]> {
    const response = await apiClient.get<ApiResponse<(Habit & { progress?: HabitProgress })[]>>('/habits/with-progress', { date });
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get habits with progress');
    }
  }
}

export const habitService = new HabitService();
export default habitService; 