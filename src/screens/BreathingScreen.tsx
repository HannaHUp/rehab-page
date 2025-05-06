import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for our breathing sessions
type BreathingSession = 'morning' | 'after_meal' | 'work_break' | 'before_sleep';

interface BreathingStatus {
  morning: boolean;
  after_meal: boolean;
  work_break: boolean;
  before_sleep: boolean;
}

// Breathing animation component
const BreathingAnimation = () => {
  const animatedValue = new Animated.Value(1);

  useEffect(() => {
    // Setup breathing animation (expand and contract)
    const breathInAnimation = Animated.timing(animatedValue, {
      toValue: 1.3,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    });

    const breathOutAnimation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true
    });

    // Loop the animation
    Animated.loop(
      Animated.sequence([
        breathInAnimation,
        breathOutAnimation
      ])
    ).start();

    return () => {
      // Clean up animation when component unmounts
      animatedValue.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.animationContainer}>
      <Text style={styles.breathingInstructions}>
        Follow the circle - Inhale (4s) - Exhale (4s)
      </Text>
      <Animated.View 
        style={[
          styles.breathingCircle,
          {
            transform: [{ scale: animatedValue }]
          }
        ]}
      />
      <Text style={styles.breathingStatus}>
        Inhaling...
      </Text>
    </View>
  );
};

// Session card component
const SessionCard = ({ 
  title, 
  description, 
  isCompleted, 
  onPress 
}: { 
  title: string; 
  description: string; 
  isCompleted: boolean; 
  onPress: () => void; 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.sessionCard, isCompleted && styles.completedCard]} 
      onPress={onPress}
    >
      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>{title}</Text>
        <Text style={styles.sessionDescription}>{description}</Text>
      </View>
      <View style={styles.sessionStatus}>
        {isCompleted ? (
          <Text style={styles.completedText}>Completed ✓</Text>
        ) : (
          <Text style={styles.pendingText}>Pending</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const BreathingScreen = () => {
  const [selectedSession, setSelectedSession] = useState<BreathingSession | null>(null);
  const [breathingStatus, setBreathingStatus] = useState<BreathingStatus>({
    morning: false,
    after_meal: false,
    work_break: false,
    before_sleep: false
  });
  const [currentDate, setCurrentDate] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState('inhale');
  const [seconds, setSeconds] = useState(0);
  const animation = useRef(new Animated.Value(1)).current;
  const [isFeedbackEnabled, setFeedbackEnabled] = useState(true);
  
  // Set current date and load session data
  useEffect(() => {
    // Set current date in "YYYY-MM-DD" format
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);

    // Here we would typically load any previously completed sessions from AsyncStorage
    // For now, we'll just use the initial state
  }, []);
  
  const handleSessionComplete = (session: BreathingSession) => {
    setBreathingStatus(prev => ({
      ...prev,
      [session]: !prev[session] // Toggle completion status
    }));
    setSelectedSession(null);

    // Here we would typically save to AsyncStorage
  };
  
  // Provide haptic feedback based on the breathing phase
  const provideFeedback = (pattern: number[]) => {
    if (!isFeedbackEnabled) return;
    Vibration.vibrate(pattern);
  };
  
  // Keep track of the current breathing phase using a more explicit approach
  useEffect(() => {
    let breathingInterval: NodeJS.Timeout | null = null;
    let animationTimeout: NodeJS.Timeout | null = null;
    
    const runBreathingCycle = () => {
      // Phase 1: Inhale (4 seconds)
      setCurrentStep('inhale');
      animation.setValue(1); // Start from the smallest size
      provideFeedback([0, 100, 50, 100]); // Two short vibrations for inhale
      
      Animated.timing(animation, {
        toValue: 2,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
      
      // Phase 2: Hold (3 seconds) - schedule after 4 seconds
      animationTimeout = setTimeout(() => {
        setCurrentStep('hold');
        provideFeedback([0, 300]); // One longer vibration for hold
        
        // Hold the animation at the expanded state
        animation.setValue(2);
        
        // Phase 3: Exhale (6 seconds) - schedule after another 3 seconds
        animationTimeout = setTimeout(() => {
          setCurrentStep('exhale');
          provideFeedback([0, 100, 100, 100, 100, 100]); // Three short vibrations for exhale
          
          Animated.timing(animation, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: true
          }).start();
        }, 3000);
      }, 4000);
    };
    
    if (isStarted) {
      // Run the first cycle immediately
      runBreathingCycle();
      
      // Schedule future cycles every 13 seconds (4s inhale + 3s hold + 6s exhale)
      breathingInterval = setInterval(() => {
        runBreathingCycle();
      }, 13000); // Total duration of one cycle
      
      // Also track total time
      const timerInterval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
      
      return () => {
        if (breathingInterval) clearInterval(breathingInterval);
        if (animationTimeout) clearTimeout(animationTimeout);
        if (timerInterval) clearInterval(timerInterval);
        animation.setValue(1); // Reset animation when cleaning up
        Vibration.cancel(); // Stop any ongoing vibrations
      };
    }
  }, [isStarted, animation, isFeedbackEnabled]);
  
  // Toggle feedback setting
  const toggleFeedback = () => {
    setFeedbackEnabled(!isFeedbackEnabled);
    if (isFeedbackEnabled) {
      Vibration.cancel(); // Stop vibrations when turning off
    } else {
      // Give a short vibration to confirm turning on
      Vibration.vibrate(100);
    }
  };
  
  // Remove the old breathing animation function since we're now using the effect
  const startBreathing = () => {
    setIsStarted(true);
    setSeconds(0);
  };

  const stopBreathing = () => {
    setIsStarted(false);
    setSeconds(0);
    animation.setValue(1);
    Vibration.cancel(); // Stop any ongoing vibrations
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStepText = () => {
    switch (currentStep) {
      case 'inhale': return 'Inhale (4s)';
      case 'hold': return 'Hold (3s)';
      case 'exhale': return 'Exhale (6s)';
      default: return 'Breathe';
    }
  };

  const getCircleColor = () => {
    switch (currentStep) {
      case 'inhale': return 'rgba(52, 152, 219, 0.8)'; // Brighter blue
      case 'hold': return 'rgba(241, 196, 15, 0.8)';  // Brighter yellow
      case 'exhale': return 'rgba(46, 204, 113, 0.8)'; // Brighter green
      default: return 'rgba(46, 125, 50, 0.5)'; // Default green
    }
  };

  const getBreathTextColor = () => {
    switch (currentStep) {
      case 'inhale': return '#2980b9'; // Darker blue for contrast
      case 'hold': return '#d35400';  // Orange for better visibility
      case 'exhale': return '#27ae60'; // Darker green for contrast
      default: return '#2e7d32'; // Default green
    }
  };

  // If a session is selected, show the breathing animation and timer
  if (selectedSession) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Diaphragmatic Breathing</Text>
          <Text style={styles.subtitle}>Reduce stress and promote recovery</Text>

          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.breathCircle,
                {
                  transform: [{ scale: animation }],
                  backgroundColor: getCircleColor(),
                }
              ]}
            />
            <Text style={[styles.breathText, { color: getBreathTextColor() }]}>
              {isStarted ? getStepText() : 'Ready'}
            </Text>
          </View>

          <View style={styles.phaseIndicator}>
            <View style={[
              styles.phaseDot, 
              currentStep === 'inhale' && styles.activeInhale,
              !isStarted && styles.inactiveDot
            ]} />
            <View style={[
              styles.phaseDot, 
              currentStep === 'hold' && styles.activeHold,
              !isStarted && styles.inactiveDot
            ]} />
            <View style={[
              styles.phaseDot, 
              currentStep === 'exhale' && styles.activeExhale,
              !isStarted && styles.inactiveDot
            ]} />
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            <Text style={styles.timerLabel}>Duration</Text>
          </View>

          <TouchableOpacity 
            style={styles.soundToggleButton}
            onPress={toggleFeedback}
          >
            <Ionicons 
              name={isFeedbackEnabled ? "notifications" : "notifications-off"} 
              size={24} 
              color={isFeedbackEnabled ? '#2980b9' : '#95a5a6'} 
            />
            <Text style={styles.soundToggleText}>
              {isFeedbackEnabled ? 'Vibration On' : 'Vibration Off'}
            </Text>
          </TouchableOpacity>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionText}>1. Sit comfortably or lie down flat</Text>
            <Text style={styles.instructionText}>2. Place one hand on your chest and one on your abdomen</Text>
            <Text style={styles.instructionText}>3. Inhale deeply through your nose, expanding your abdomen</Text>
            <Text style={styles.instructionText}>4. Hold your breath</Text>
            <Text style={styles.instructionText}>5. Exhale slowly through your mouth, contracting your abdomen</Text>
            <Text style={styles.instructionText}>6. Repeat for 5-10 minutes for optimal benefits</Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, isStarted ? styles.stopButton : styles.startButton]} 
            onPress={isStarted ? stopBreathing : startBreathing}
          >
            <Text style={styles.buttonText}>
              {isStarted ? 'Stop' : 'Start'} Breathing Exercise
            </Text>
            <Ionicons 
              name={isStarted ? 'stop-circle-outline' : 'play-circle-outline'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Otherwise, show the list of sessions
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.titleText}>Diaphragmatic Breathing</Text>
        <Text style={styles.subtitleText}>
          Completed: {Object.values(breathingStatus).filter(Boolean).length}/4
        </Text>
      </View>

      <View style={styles.sessionsContainer}>
        <SessionCard
          title="Morning Breathing"
          description="5:00 AM, lying down for one minute of breathing"
          isCompleted={breathingStatus.morning}
          onPress={() => setSelectedSession('morning')}
        />

        <SessionCard
          title="After Meal Breathing"
          description="After each meal, sitting upright"
          isCompleted={breathingStatus.after_meal}
          onPress={() => setSelectedSession('after_meal')}
        />

        <SessionCard
          title="Work Break Breathing"
          description="During work breaks, standing position"
          isCompleted={breathingStatus.work_break}
          onPress={() => setSelectedSession('work_break')}
        />

        <SessionCard
          title="Pre-Sleep Breathing"
          description="Lying down before sleep, 10 deep breaths"
          isCompleted={breathingStatus.before_sleep}
          onPress={() => setSelectedSession('before_sleep')}
        />
      </View>
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
  },
  sessionsContainer: {
    padding: 15,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  completedCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2ecc71',
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#666',
  },
  sessionStatus: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  completedText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#e74c3c',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingInstructions: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    padding: 20,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3498db',
    opacity: 0.7,
  },
  breathingStatus: {
    fontSize: 24,
    marginTop: 30,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: 30,
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(46, 125, 50, 0.3)',
    borderWidth: 2,
    borderColor: '#2e7d32',
    position: 'absolute',
  },
  breathText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  timerLabel: {
    fontSize: 16,
    color: '#555',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  startButton: {
    backgroundColor: '#2e7d32',
  },
  stopButton: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  phaseIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeInhale: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
  },
  activeHold: {
    backgroundColor: 'rgba(241, 196, 15, 0.8)',
  },
  activeExhale: {
    backgroundColor: 'rgba(46, 204, 113, 0.8)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(46, 125, 50, 0.5)',
  },
  soundToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    width: '50%',
    alignSelf: 'center',
  },
  soundToggleText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default BreathingScreen; 