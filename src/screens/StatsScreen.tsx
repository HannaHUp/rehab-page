import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { getAllCompletionData } from '../utils/storage';
import { WEEKLY_EXERCISE_SCHEDULE } from '../constants/exercises';

// Helper function to get the current week dates
const getCurrentWeekDates = () => {
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Calculate the date of Monday (start of the week)
  const monday = new Date(today);
  monday.setDate(monday.getDate() - day + (day === 0 ? -6 : 1)); // Adjust for Sunday
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    weekDates.push(formattedDate);
  }
  
  return weekDates;
};

// Mock data for completed exercises and breathing sessions
type ExerciseData = {
  completed: number;
  total: number;
};

type ExerciseDataRecord = {
  [key: string]: ExerciseData;
};

const MOCK_EXERCISE_DATA: ExerciseDataRecord = {
  '2025-05-01': { completed: 3, total: 4 },
  '2025-05-02': { completed: 4, total: 4 },
  '2025-05-03': { completed: 2, total: 4 },
  '2025-05-04': { completed: 3, total: 4 },
  '2025-05-05': { completed: 4, total: 4 },
};

const MOCK_BREATHING_DATA: ExerciseDataRecord = {
  '2025-05-01': { completed: 2, total: 4 },
  '2025-05-02': { completed: 3, total: 4 },
  '2025-05-03': { completed: 4, total: 4 },
  '2025-05-04': { completed: 3, total: 4 },
  '2025-05-05': { completed: 2, total: 4 },
};

type NotesRecord = {
  [key: string]: string;
};

const MOCK_NOTES: NotesRecord = {
  '2025-05-01': '今天右髋稍微紧张',
  '2025-05-02': '左腰比之前轻松',
  '2025-05-03': '今天完成了所有呼吸练习，感觉很好',
  '2025-05-04': '右肩活动度增加',
  '2025-05-05': '',
};

// Calendar component
type MarkedDates = {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    completionRate: number;
  };
};

type CalendarProps = {
  markedDates: MarkedDates;
  onSelectDate: (date: string) => void;
};

const SimpleCalendar = ({ markedDates, onSelectDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate array of day numbers for the calendar
  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days: (number | null)[] = Array(firstDay).fill(null); // Empty cells for days before the 1st
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Handle date selection
  const handleSelectDate = (day: number) => {
    const dateString = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(dateString);
    onSelectDate(dateString);
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Get color based on completion rate
  const getCompletionColor = (date: string) => {
    if (!markedDates[date]) return '';
    
    const completionRate = markedDates[date].completionRate;
    
    if (completionRate === 1) return '#2ecc71'; // Fully completed (green)
    if (completionRate >= 0.5) return '#f39c12'; // Partially completed (orange)
    return '#e74c3c'; // Low completion (red)
  };
  
  // Month names for header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <Text style={styles.calendarNavButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.calendarMonthTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.calendarNavButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysOfWeekContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarDaysContainer}>
        {generateDays().map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.emptyDay} />;
          }
          
          const dateString = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isMarked = markedDates[dateString]?.marked || false;
          const completionColor = getCompletionColor(dateString);
          const isSelected = dateString === selectedDate;
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.calendarDay, 
                isSelected && styles.selectedDay
              ]}
              onPress={() => handleSelectDate(day)}
            >
              <Text style={[
                styles.calendarDayText,
                isSelected && styles.selectedDayText
              ]}>
                {day}
              </Text>
              {isMarked && <View style={[styles.dateDot, { backgroundColor: completionColor }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#3498db',
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  statsCard: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  calendarCard: {
    margin: 15,
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  calendarContainer: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarNavButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    padding: 10,
  },
  calendarMonthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  calendarDayText: {
    fontSize: 14,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
  },
  selectedDay: {
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  legendCard: {
    margin: 15,
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

const StatsScreen = () => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [completionRate, setCompletionRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [totalCompletedDays, setTotalCompletedDays] = useState(0);

  // Generate marked dates based on completion data
  const generateMarkedDates = async () => {
    try {
      setLoading(true);
      
      // Get all completion data
      const completionData = await getAllCompletionData();
      
      const newMarkedDates: MarkedDates = {};
      let currentStreak = 0;
      let completedDaysCount = 0;
      
      // Process each date
      Object.entries(completionData).forEach(([date, completedExercises]) => {
        // Get day of week for this date
        const dateObj = new Date(date);
        const dayOfWeek = String(dateObj.getDay());
        
        // Get expected exercises for this day
        const expectedExercises = WEEKLY_EXERCISE_SCHEDULE[dayOfWeek] || [];
        
        // Calculate completion rate
        const completionRate = expectedExercises.length > 0 
          ? completedExercises.length / expectedExercises.length 
          : 0;
        
        // Mark the date
        newMarkedDates[date] = {
          marked: completedExercises.length > 0,
          dotColor: getColorForCompletionRate(completionRate),
          completionRate
        };
        
        // Count completed days
        if (completionRate > 0) {
          completedDaysCount++;
        }
      });
      
      // Calculate current streak
      currentStreak = calculateStreak(completionData);
      
      setMarkedDates(newMarkedDates);
      setStreakCount(currentStreak);
      setTotalCompletedDays(completedDaysCount);
      setLoading(false);
    } catch (error) {
      console.error('Failed to generate marked dates:', error);
      setLoading(false);
    }
  };

  // Calculate streak of consecutive days with exercise completion
  const calculateStreak = (completionData: { [date: string]: string[] }): number => {
    const dates = Object.keys(completionData)
      .filter(date => completionData[date].length > 0)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Sort in descending order
    
    if (dates.length === 0) return 0;
    
    // Check if today or yesterday has exercises
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = formatDateString(today);
    const yesterdayStr = formatDateString(yesterday);
    
    // If neither today nor yesterday has exercises, streak is 0
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      return 0;
    }
    
    let streak = 1;
    
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const previous = new Date(dates[i + 1]);
      
      // Check if these dates are consecutive
      const diffTime = Math.abs(current.getTime() - previous.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Format date as YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Get color based on completion rate
  const getColorForCompletionRate = (rate: number): string => {
    if (rate >= 1) return '#2ecc71'; // Green for 100%
    if (rate >= 0.7) return '#f39c12'; // Orange for 70%+
    if (rate >= 0.4) return '#e67e22'; // Dark orange for 40%+
    return '#e74c3c'; // Red for < 40%
  };

  // Handle date selection
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setCompletionRate(markedDates[date]?.completionRate || 0);
  };

  // Load data when component mounts
  useEffect(() => {
    generateMarkedDates();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Rehabilitation Stats</Text>
        <Text style={styles.subtitleText}>Track Your Progress</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalCompletedDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {selectedDate ? `${Math.round((markedDates[selectedDate]?.completionRate || 0) * 100)}%` : '-'}
            </Text>
            <Text style={styles.statLabel}>Selected Date</Text>
          </View>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <Text style={styles.cardTitle}>Daily Completion</Text>
        <SimpleCalendar 
          markedDates={markedDates} 
          onSelectDate={handleSelectDate}
        />
      </View>

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
            <Text style={styles.legendText}>Fully Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
            <Text style={styles.legendText}>Partially Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Minimal Completion</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatsScreen; 