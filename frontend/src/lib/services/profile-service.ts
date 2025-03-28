import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export interface ProfileUpdateData {
  userId?: string;
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export interface ProfileUpdateResponse {
  user: UserProfile;
}

export async function getUserProfileAPI(userId: string) {
  try {
    const response = await axiosInstance.get<{ user: UserProfile }>(`/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user profile. Please try again.'
      );
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function updateProfileAPI(data: ProfileUpdateData) {
  try {
    const response = await axiosInstance.put<ProfileUpdateResponse>('/users/profile', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    }
    throw new Error('An unexpected error occurred');
  }
}