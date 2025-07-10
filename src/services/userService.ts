import { apiClient } from './apiClient';
import type { User, ApiResponse } from '../types';

export class UserService {
  // Get user profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get profile');
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/user/profile', profileData);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update profile');
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(file: File, onProgress?: (progress: number) => void): Promise<{ profilePhotoUrl: string }> {
    const response = await apiClient.uploadFile<ApiResponse<{ profilePhotoUrl: string }>>('/user/upload-photo', file, onProgress);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to upload photo');
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/user/${userId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get user');
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/user/search', { query });
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to search users');
    }
  }

  // Get user friends
  async getUserFriends(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/user/friends');
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get friends');
    }
  }

  // Add friend
  async addFriend(friendId: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/user/friends', { friendId });
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to add friend');
    }
  }

  // Remove friend
  async removeFriend(friendId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/user/friends/${friendId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to remove friend');
    }
  }
}

export const userService = new UserService();
export default userService; 