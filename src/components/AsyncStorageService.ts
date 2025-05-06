/**
 * AsyncStorage Service
 * 
 * This module provides utility functions for saving and retrieving data
 * from AsyncStorage.
 */

// Note: Since we're having issues installing the AsyncStorage package,
// this file serves as a placeholder for the implementation.
// In a real app, we would import AsyncStorage and implement these methods.

// Mock storage for testing without AsyncStorage package
const mockStorage: Record<string, string> = {};

// Exercise check-in data
export interface ExerciseCheckIn {
  id: string;
  date: string;
  time: string;
  completed: boolean;
  note?: string;
}

// Breathing session check-in data
export interface BreathingCheckIn {
  date: string;
  morning: boolean;
  after_meal: boolean;
  work_break: boolean;
  before_sleep: boolean;
}

// Weekend assessment data
export interface WeekendAssessment {
  date: string;
  rightHipFeeling: string;
  leftBackFeeling: string;
  rightShoulderFeeling: string;
  improvements: string;
}

// Notification settings
export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  time: string;
  enabled: boolean;
}

/**
 * Save exercise check-in data
 */
export const saveExerciseCheckIn = async (checkIn: ExerciseCheckIn): Promise<void> => {
  try {
    const key = `exercise_${checkIn.date}_${checkIn.id}`;
    mockStorage[key] = JSON.stringify(checkIn);
    // In a real implementation:
    // await AsyncStorage.setItem(key, JSON.stringify(checkIn));
    console.log('Saved exercise check-in:', key);
  } catch (error) {
    console.error('Error saving exercise check-in:', error);
  }
};

/**
 * Get exercise check-ins for a specific date
 */
export const getExerciseCheckIns = async (date: string): Promise<ExerciseCheckIn[]> => {
  try {
    // In a real implementation, we would use AsyncStorage.getAllKeys() 
    // and filter keys that match the pattern
    const result: ExerciseCheckIn[] = [];
    
    // For now, just check our mock storage
    Object.keys(mockStorage).forEach(key => {
      if (key.startsWith(`exercise_${date}`)) {
        try {
          const data = JSON.parse(mockStorage[key]);
          result.push(data);
        } catch (e) {
          console.error('Error parsing stored data:', e);
        }
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting exercise check-ins:', error);
    return [];
  }
};

/**
 * Save breathing check-in data
 */
export const saveBreathingCheckIn = async (checkIn: BreathingCheckIn): Promise<void> => {
  try {
    const key = `breathing_${checkIn.date}`;
    mockStorage[key] = JSON.stringify(checkIn);
    // In a real implementation:
    // await AsyncStorage.setItem(key, JSON.stringify(checkIn));
    console.log('Saved breathing check-in:', key);
  } catch (error) {
    console.error('Error saving breathing check-in:', error);
  }
};

/**
 * Get breathing check-in for a specific date
 */
export const getBreathingCheckIn = async (date: string): Promise<BreathingCheckIn | null> => {
  try {
    const key = `breathing_${date}`;
    const data = mockStorage[key];
    
    // In a real implementation:
    // const data = await AsyncStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting breathing check-in:', error);
    return null;
  }
};

/**
 * Save weekend assessment data
 */
export const saveWeekendAssessment = async (assessment: WeekendAssessment): Promise<void> => {
  try {
    const key = `assessment_${assessment.date}`;
    mockStorage[key] = JSON.stringify(assessment);
    // In a real implementation:
    // await AsyncStorage.setItem(key, JSON.stringify(assessment));
    console.log('Saved weekend assessment:', key);
  } catch (error) {
    console.error('Error saving weekend assessment:', error);
  }
};

/**
 * Get weekend assessment for a specific date
 */
export const getWeekendAssessment = async (date: string): Promise<WeekendAssessment | null> => {
  try {
    const key = `assessment_${date}`;
    const data = mockStorage[key];
    
    // In a real implementation:
    // const data = await AsyncStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting weekend assessment:', error);
    return null;
  }
};

/**
 * Save user note for a specific date
 */
export const saveUserNote = async (date: string, note: string): Promise<void> => {
  try {
    const key = `note_${date}`;
    mockStorage[key] = note;
    // In a real implementation:
    // await AsyncStorage.setItem(key, note);
    console.log('Saved user note:', key);
  } catch (error) {
    console.error('Error saving user note:', error);
  }
};

/**
 * Get user note for a specific date
 */
export const getUserNote = async (date: string): Promise<string> => {
  try {
    const key = `note_${date}`;
    const note = mockStorage[key];
    
    // In a real implementation:
    // const note = await AsyncStorage.getItem(key);
    
    return note || '';
  } catch (error) {
    console.error('Error getting user note:', error);
    return '';
  }
};

/**
 * Save notification settings
 */
export const saveNotificationSettings = async (settings: NotificationSetting[]): Promise<void> => {
  try {
    mockStorage['notification_settings'] = JSON.stringify(settings);
    // In a real implementation:
    // await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
    console.log('Saved notification settings');
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSetting[]> => {
  try {
    const data = mockStorage['notification_settings'];
    
    // In a real implementation:
    // const data = await AsyncStorage.getItem('notification_settings');
    
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return [];
  }
};

/**
 * Clear all stored data (for testing)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    // Clear our mock storage
    Object.keys(mockStorage).forEach(key => {
      delete mockStorage[key];
    });
    
    // In a real implementation:
    // await AsyncStorage.clear();
    
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}; 