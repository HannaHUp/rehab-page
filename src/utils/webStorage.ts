import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localStorage for web and AsyncStorage for native
const storage = Platform.OS === 'web' ? {
  getItem: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return;
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return;
  }
} : AsyncStorage;

// Save completed exercises to storage
export const saveCompletedExercises = async (date: string, exerciseIds: string[]): Promise<void> => {
  try {
    const key = `completed_exercises_${date}`;
    await storage.setItem(key, JSON.stringify(exerciseIds));
  } catch (error) {
    console.error('Error saving completed exercises:', error);
    throw error;
  }
};

// Get completed exercises from storage
export const getCompletedExercises = async (date: string): Promise<string[]> => {
  try {
    const key = `completed_exercises_${date}`;
    const savedExercises = await storage.getItem(key);
    return savedExercises ? JSON.parse(savedExercises) : [];
  } catch (error) {
    console.error('Error getting completed exercises:', error);
    return [];
  }
};

// Save any data to storage
export const saveData = async (key: string, data: any): Promise<void> => {
  try {
    await storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// Get data from storage
export const getData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const savedData = await storage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error('Error getting data:', error);
    return defaultValue;
  }
};

// Remove data from storage
export const removeData = async (key: string): Promise<void> => {
  try {
    await storage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}; 