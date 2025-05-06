import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const STORAGE_KEYS = {
  COMPLETED_EXERCISES: 'completedExercises',
  WEEKLY_ASSESSMENT: 'weeklyAssessment',
};

// Interface for storing completion data by date
interface CompletionData {
  [date: string]: string[]; // date -> array of completed exercise IDs
}

// Save completed exercises for a specific date
export const saveCompletedExercises = async (date: string, exerciseIds: string[]): Promise<void> => {
  try {
    // Get existing data
    const existingDataString = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_EXERCISES);
    let completionData: CompletionData = {};
    
    if (existingDataString) {
      completionData = JSON.parse(existingDataString);
    }
    
    // Update with new data for this date
    completionData[date] = exerciseIds;
    
    // Save back to storage
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_EXERCISES, JSON.stringify(completionData));
  } catch (error) {
    console.error('Error saving completed exercises:', error);
  }
};

// Get completed exercises for a specific date
export const getCompletedExercises = async (date: string): Promise<string[]> => {
  try {
    const existingDataString = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_EXERCISES);
    
    if (!existingDataString) {
      return [];
    }
    
    const completionData: CompletionData = JSON.parse(existingDataString);
    return completionData[date] || [];
  } catch (error) {
    console.error('Error getting completed exercises:', error);
    return [];
  }
};

// Get all completion data
export const getAllCompletionData = async (): Promise<CompletionData> => {
  try {
    const existingDataString = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_EXERCISES);
    
    if (!existingDataString) {
      return {};
    }
    
    return JSON.parse(existingDataString);
  } catch (error) {
    console.error('Error getting all completion data:', error);
    return {};
  }
};

// Save weekly assessment data
export const saveWeeklyAssessment = async (date: string, checkedItems: string[], notes: string): Promise<void> => {
  try {
    const existingDataString = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_ASSESSMENT);
    let assessmentData: { [date: string]: { checked: string[], notes: string } } = {};
    
    if (existingDataString) {
      assessmentData = JSON.parse(existingDataString);
    }
    
    assessmentData[date] = {
      checked: checkedItems,
      notes: notes
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_ASSESSMENT, JSON.stringify(assessmentData));
  } catch (error) {
    console.error('Error saving weekly assessment:', error);
  }
};

// Get weekly assessment for a specific date
export const getWeeklyAssessment = async (date: string): Promise<{ checked: string[], notes: string } | null> => {
  try {
    const existingDataString = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_ASSESSMENT);
    
    if (!existingDataString) {
      return null;
    }
    
    const assessmentData = JSON.parse(existingDataString);
    return assessmentData[date] || null;
  } catch (error) {
    console.error('Error getting weekly assessment:', error);
    return null;
  }
}; 