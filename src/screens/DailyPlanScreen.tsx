import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Modal
} from 'react-native';
import { saveCompletedExercises, getCompletedExercises } from '../utils/storage';
import { Exercise, WEEKLY_EXERCISE_SCHEDULE } from '../constants/exercises';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Exercise card component props type
interface ExerciseCardProps {
  exercise: Exercise;
  onCheckIn: (id: string) => void;
  isCompleted: boolean;
}

// Exercise card component
const ExerciseCard = ({ exercise, onCheckIn, isCompleted }: ExerciseCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.timeText}>{exercise.time}</Text>
        <Text style={styles.nameText}>{exercise.name}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: exercise.image }} 
          style={styles.exerciseImage} 
          resizeMode="cover"
        />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{exercise.description}</Text>
          {exercise.sets && exercise.reps && (
            <Text style={styles.setsRepsText}>{exercise.sets} × {exercise.reps}</Text>
          )}
          <TouchableOpacity 
            style={[
              styles.checkInButton, 
              isCompleted && styles.completedButton
            ]}
            onPress={() => onCheckIn(exercise.id)}
          >
            <Text style={styles.checkInText}>
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Day of week mapping to English
const WEEKDAY_NAMES: { [key: string]: string } = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday"
};

// Workout descriptions based on day
const WORKOUT_DESCRIPTIONS: { [key: string]: string } = {
  "1": "Pendlay Row + Overhead Squat",
  "2": "Deadlift + DB B-Stance RDL",
  "3": "Snatch",
  "4": "Back Squat + Front Squat",
  "5": "Push Press",
  "6": "Active Recovery",
  "0": "Recovery & Self-Assessment"
};

// Daily Routine from 5am to bedtime
const DAILY_ROUTINE = [
  { time: "05:00", activity: "Wake up & Diaphragmatic Breathing" },
  { time: "05:10-05:30", activity: "Rehab Exercises" },
  { time: "06:00-07:00", activity: "CrossFit Workout" },
  { time: "08:00", activity: "Post-Meal Breathing" },
  { time: "12:00", activity: "Lunch Break Breathing" },
  { time: "15:00", activity: "Afternoon Break Breathing" },
  { time: "18:00", activity: "Post-Dinner Breathing" },
  { time: "21:30", activity: "Pre-Sleep Breathing" },
];

const DailyPlanScreen = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState('');
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([]);
  const [weekdayName, setWeekdayName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [weekViewVisible, setWeekViewVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get current date and day of week
        const date = new Date();
        const formattedDate = formatDate(date);
        const dayOfWeek = String(date.getDay()); // 0 is Sunday, 1 is Monday, etc.
        
        setCurrentDate(formattedDate);
        setCurrentDayOfWeek(dayOfWeek);
        setWeekdayName(WEEKDAY_NAMES[dayOfWeek]);
        setWorkoutDescription(WORKOUT_DESCRIPTIONS[dayOfWeek]);
        setSelectedDay(dayOfWeek);
        
        // Set exercises based on day of week
        setDailyExercises(WEEKLY_EXERCISE_SCHEDULE[dayOfWeek] || []);

        // Load completed exercises from storage
        const savedCompletedExercises = await getCompletedExercises(formattedDate);
        setCompletedExercises(savedCompletedExercises);
      } catch (error) {
        console.error('Failed to load data:', error);
        Alert.alert('Error', 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle check-in and save to storage
  const handleCheckIn = async (exerciseId: string) => {
    try {
      // Update local state
      const newCompletedExercises = [...completedExercises];
      
      // If already completed, remove it (toggle functionality)
      if (newCompletedExercises.includes(exerciseId)) {
        const updatedList = newCompletedExercises.filter(id => id !== exerciseId);
        setCompletedExercises(updatedList);
        // Save to storage
        await saveCompletedExercises(currentDate, updatedList);
      } else {
        // Otherwise, add it to completed list
        const updatedList = [...newCompletedExercises, exerciseId];
        setCompletedExercises(updatedList);
        // Save to storage
        await saveCompletedExercises(currentDate, updatedList);
      }
    } catch (error) {
      console.error('Failed to save completed exercise:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  // Change the selected day
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    setDailyExercises(WEEKLY_EXERCISE_SCHEDULE[day] || []);
    setWorkoutDescription(WORKOUT_DESCRIPTIONS[day]);
    setWeekViewVisible(false);
  };

  // Function to navigate to breathing screen
  const navigateToBreathing = () => {
    navigation.navigate('Breathing');
  };

  // Function to handle daily routine item click
  const handleRoutineItemClick = (activity: string) => {
    // Navigate based on the activity type
    if (activity.includes("Breathing")) {
      // Any activity containing "Breathing" goes to the breathing screen
      navigation.navigate('Breathing');
    } else if (activity.includes("Rehab Exercises")) {
      // Scroll to the exercises section
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else if (activity.includes("Workout")) {
      // Could navigate to a workout screen if available
      Alert.alert("Workout", "Opening your workout plan...");
    } else {
      // Default fallback
      Alert.alert("Activity", `Opening: ${activity}`);
    }
  };

  // Render week view modal
  const renderWeekView = () => {
    return (
      <Modal
        visible={weekViewVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWeekViewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Weekly Schedule</Text>
            
            {Object.keys(WEEKDAY_NAMES).map(day => (
              <TouchableOpacity 
                key={day} 
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.selectedDayButton
                ]}
                onPress={() => handleDayChange(day)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.selectedDayText
                ]}>
                  {WEEKDAY_NAMES[day]}: {WORKOUT_DESCRIPTIONS[day]}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setWeekViewVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Render daily routine timeline
  const renderDailyRoutine = () => {
    return (
      <View style={styles.routineSection}>
        <Text style={styles.sectionHeader}>Daily Routine</Text>
        {DAILY_ROUTINE.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.routineItem}
            onPress={() => handleRoutineItemClick(item.activity)}
          >
            <Text style={styles.routineTime}>{item.time}</Text>
            <Text style={styles.routineActivity}>{item.activity}</Text>
            <Ionicons name="chevron-forward" size={20} color="#2e7d32" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderWeekView()}
      
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate} {weekdayName}</Text>
        <Text style={styles.titleText}>Today's Rehab Plan</Text>
        <Text style={styles.subtitleText}>
          {workoutDescription}
        </Text>
        <Text style={styles.progressText}>
          Completed: {completedExercises.length}/{dailyExercises.length}
        </Text>
        
        <TouchableOpacity 
          style={styles.weekViewButton}
          onPress={() => setWeekViewVisible(true)}
        >
          <Text style={styles.weekViewButtonText}>View Week</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionHeader}>Today's Exercises</Text>
          {dailyExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.includes(exercise.id)}
              onCheckIn={handleCheckIn}
            />
          ))}
        </View>
        
        {renderDailyRoutine()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#3498db',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitleText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    fontStyle: 'italic',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  descriptionContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  setsRepsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  checkInButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#2ecc71',
  },
  checkInText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#3498db',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dayButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedDayButton: {
    backgroundColor: '#3498db',
  },
  dayButtonText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekViewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  weekViewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  exercisesSection: {
    marginBottom: 20,
  },
  routineSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  routineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  routineTime: {
    fontWeight: 'bold',
    width: 100,
    color: '#3498db',
  },
  routineActivity: {
    flex: 1,
    color: '#333',
  },
});

export default DailyPlanScreen; 