import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  TextInput,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For typechecking notification settings
interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  time: string;
  enabled: boolean;
}

// Define initial notification settings
const initialNotificationSettings: NotificationSetting[] = [
  {
    id: '1',
    title: '起床呼吸',
    description: '早晨起床后腹式呼吸一分钟',
    time: '05:00',
    enabled: true,
  },
  {
    id: '2',
    title: '热身提醒',
    description: '执行今日热身动作',
    time: '05:10',
    enabled: true,
  },
  {
    id: '3',
    title: '饭后呼吸',
    description: '午餐后腹式呼吸',
    time: '12:30',
    enabled: true,
  },
  {
    id: '4',
    title: '工作间隙呼吸',
    description: '工作间隙深呼吸放松',
    time: '15:00',
    enabled: true,
  },
  {
    id: '5',
    title: '睡前呼吸',
    description: '睡前静躺腹式呼吸',
    time: '22:00',
    enabled: true,
  },
];

const SettingsScreen = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(initialNotificationSettings);
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [reminderTime, setReminderTime] = useState('05:00 AM');

  // Toggle notification setting
  const handleToggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
    
    // Here we would typically save to AsyncStorage and update system notifications
  };

  // Edit notification time
  const startEditingTime = (id: string, currentTime: string) => {
    setEditingNotificationId(id);
    setEditingTime(currentTime);
  };

  // Save edited time
  const saveEditedTime = () => {
    if (!editingNotificationId) return;
    
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === editingNotificationId 
          ? { ...setting, time: editingTime } 
          : setting
      )
    );
    
    setEditingNotificationId(null);
    setEditingTime('');
    
    // Here we would typically save to AsyncStorage and update system notifications
  };

  // Cancel time editing
  const cancelEditing = () => {
    setEditingNotificationId(null);
    setEditingTime('');
  };

  // Reset all settings to default
  const handleResetSettings = () => {
    setNotificationSettings(initialNotificationSettings);
    alert('已恢复默认设置');
    
    // Here we would typically save to AsyncStorage and update system notifications
  };

  // Export data (in a real app, this would create a file)
  const handleExportData = () => {
    // In a real implementation, this would generate a file
    alert('数据导出功能将在下一版本中实现');
  };

  // Notification setting item component
  const NotificationItem = ({ setting }: { setting: NotificationSetting }) => {
    const isEditing = setting.id === editingNotificationId;
    
    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{setting.title}</Text>
          <Text style={styles.notificationDescription}>{setting.description}</Text>
          
          {isEditing ? (
            <View style={styles.timeEditContainer}>
              <TextInput
                style={styles.timeInput}
                value={editingTime}
                onChangeText={setEditingTime}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]} 
                  onPress={saveEditedTime}
                >
                  <Text style={styles.editButtonText}>保存</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]} 
                  onPress={cancelEditing}
                >
                  <Text style={styles.editButtonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => startEditingTime(setting.id, setting.time)}
            >
              <Text style={styles.timeText}>{setting.time}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Switch
          value={setting.enabled}
          onValueChange={() => handleToggleNotification(setting.id)}
          trackColor={{ false: '#767577', true: '#3498db' }}
          thumbColor={setting.enabled ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    );
  };

  const toggleSetting = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'soundEffects':
        setSoundEffects(value);
        break;
      default:
        break;
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all your data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "All data has been cleared.");
            } catch (e) {
              Alert.alert("Error", "Failed to clear data.");
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      "Export Data",
      "Your data will be exported as a JSON file.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Export", 
          onPress: () => {
            // Implementation would go here
            Alert.alert("Success", "Data exported successfully.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Daily Reminder</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => toggleSetting('notifications', value)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notifications ? "#2e7d32" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="moon-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => toggleSetting('darkMode', value)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={darkMode ? "#2e7d32" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="volume-high-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={(value) => toggleSetting('soundEffects', value)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={soundEffects ? "#2e7d32" : "#f4f3f4"}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="time-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Reminder Time</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{reminderTime}</Text>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={exportData}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="download-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={clearAllData}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="trash-outline" size={24} color="#c62828" />
              <Text style={[styles.settingText, { color: '#c62828' }]}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#333" />
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.feedbackButton}>
          <Text style={styles.feedbackButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#777',
    marginRight: 5,
  },
  feedbackButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  feedbackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  timeText: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 5,
    fontWeight: 'bold',
  },
  timeEditContainer: {
    marginTop: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 