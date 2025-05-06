import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Alert
} from 'react-native';
import { saveWeeklyAssessment, getWeeklyAssessment } from '../utils/storage';

// Define interface for foam roller areas
interface FoamRollerArea {
  id: string;
  name: string;
  description: string;
  image: string;
  timeToSpend: string;
  benefits: string;
}

// Props for the FoamRollerGuide component
interface FoamRollerGuideProps {
  area: FoamRollerArea;
}

// Updated weekend recovery areas based on the Rehab_Daily_Schedule.md file
const FOAM_ROLLER_AREAS: FoamRollerArea[] = [
  {
    id: '1',
    name: 'Left Lower Back',
    description: 'Deep muscles adjacent to the spine on the left side',
    timeToSpend: '1-2 minutes',
    benefits: 'Relieve excessive QL tension and overactivation',
    image: 'https://via.placeholder.com/150?text=Lower+Back'
  },
  {
    id: '2',
    name: 'Right Hip',
    description: 'Right hip and gluteal muscle group',
    timeToSpend: '1-2 minutes',
    benefits: 'Promote right hip mobility, reduce compensatory overactivity',
    image: 'https://via.placeholder.com/150?text=Hip'
  },
  {
    id: '3',
    name: 'Right Shoulder Area',
    description: 'Muscles around the right scapula',
    timeToSpend: '1-2 minutes',
    benefits: 'Relieve upper trapezius tension, optimize scapular position',
    image: 'https://via.placeholder.com/150?text=Shoulder'
  },
  {
    id: '4',
    name: 'Left Inner Hip',
    description: 'Left adductor muscle group',
    timeToSpend: '1-2 minutes',
    benefits: 'Help relax adductors, improve hip movement patterns',
    image: 'https://via.placeholder.com/150?text=Inner+Hip'
  }
];

// Interface for self-assessment checks
interface AssessmentCheck {
  id: string;
  question: string;
  description: string;
}

// Self-assessment checklist items
const ASSESSMENT_CHECKLIST: AssessmentCheck[] = [
  {
    id: '1',
    question: 'Is left-right glute activation symmetrical?',
    description: 'Do your left and right glutes feel similar during single-leg stands or bridges?'
  },
  {
    id: '2',
    question: 'Are your shoulders level?',
    description: 'Check in the mirror - is your right shoulder still elevated?'
  },
  {
    id: '3',
    question: 'Can you maintain neutral pelvis during squats?',
    description: 'Does your pelvis tilt or rotate to one side during squats?'
  },
  {
    id: '4',
    question: 'Do you have discomfort or tension in your lower back?',
    description: 'Particularly after training, how does your left lumbar region feel?'
  },
  {
    id: '5',
    question: 'Has your standing and walking posture improved?',
    description: 'Observe your natural standing weight distribution and symmetry while walking'
  }
];

// Component to display foam roller guide
const FoamRollerGuide = ({ area }: FoamRollerGuideProps) => {
  return (
    <View style={styles.guideCard}>
      <View style={styles.guideHeader}>
        <Text style={styles.guideName}>{area.name}</Text>
      </View>
      <View style={styles.guideContent}>
        <Image 
          source={{ uri: area.image }} 
          style={styles.guideImage} 
        />
        <View style={styles.guideInfo}>
          <Text style={styles.guideDescription}>{area.description}</Text>
          <Text style={styles.guideTime}>Recommended time: {area.timeToSpend}</Text>
          <Text style={styles.guideBenefits}>Benefits: {area.benefits}</Text>
        </View>
      </View>
    </View>
  );
};

// Component to display assessment check
const AssessmentItem = ({ item, onToggle, isSelected }: { 
  item: AssessmentCheck, 
  onToggle: (id: string) => void, 
  isSelected: boolean 
}) => {
  return (
    <TouchableOpacity 
      style={styles.checkItem} 
      onPress={() => onToggle(item.id)}
    >
      <View style={styles.checkHeader}>
        <View style={[
          styles.checkbox, 
          isSelected && styles.checkboxSelected
        ]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.checkQuestion}>{item.question}</Text>
      </View>
      <Text style={styles.checkDescription}>{item.description}</Text>
    </TouchableOpacity>
  );
};

const WeekendAssessmentScreen = () => {
  // State to track which assessment items are checked
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // State for notes
  const [notes, setNotes] = useState<string>('');
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Current date
  const [currentDate, setCurrentDate] = useState<string>('');

  // Get current date formatted as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const dateString = formatDate(today);
        setCurrentDate(dateString);
        
        // Load saved assessment data
        const savedAssessment = await getWeeklyAssessment(dateString);
        if (savedAssessment) {
          setCheckedItems(savedAssessment.checked);
          setNotes(savedAssessment.notes);
        }
      } catch (error) {
        console.error('Failed to load assessment data:', error);
        Alert.alert('Error', 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle function for assessment items
  const toggleCheck = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(itemId => itemId !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  // Save assessment data
  const handleSaveAssessment = async () => {
    try {
      await saveWeeklyAssessment(currentDate, checkedItems, notes);
      Alert.alert('Success', 'Assessment data saved');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  // Determine if it's weekend
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
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
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate} {isWeekend() ? "Weekend" : "Weekday"}</Text>
        <Text style={styles.titleText}>Weekend Recovery Assessment</Text>
        <Text style={styles.subtitleText}>Recovery & Self-Check</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foam Roller Guide</Text>
          <Text style={styles.sectionDescription}>
            Use a foam roller on the following areas for 1-2 minutes each to help with muscle recovery.
          </Text>
          
          {FOAM_ROLLER_AREAS.map(area => (
            <FoamRollerGuide key={area.id} area={area} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Self-Assessment Checklist</Text>
          <Text style={styles.sectionDescription}>
            Check the following items to assess your rehabilitation progress. This will help you understand asymmetries and areas that need attention.
          </Text>
          
          {ASSESSMENT_CHECKLIST.map(item => (
            <AssessmentItem 
              key={item.id} 
              item={item} 
              onToggle={toggleCheck}
              isSelected={checkedItems.includes(item.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress Notes</Text>
          <Text style={styles.progressPrompt}>
            Record areas that feel improved and issues that still need attention:
          </Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={6}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter your notes here..."
            placeholderTextColor="#aaa"
          />
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveAssessment}
          >
            <Text style={styles.saveButtonText}>Save Assessment</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#7851a9', // Purple theme for weekend assessment
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
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  guideCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    padding: 12,
  },
  guideHeader: {
    marginBottom: 10,
  },
  guideName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  guideContent: {
    flexDirection: 'row',
  },
  guideImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  guideInfo: {
    flex: 1,
    marginLeft: 12,
  },
  guideDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  guideTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7851a9',
    marginBottom: 5,
  },
  guideBenefits: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  checkItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7851a9',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7851a9',
  },
  checkMark: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 34,
  },
  progressPrompt: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  progressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    height: 150,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#7851a9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7851a9',
  },
});

export default WeekendAssessmentScreen; 