import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Import our screens
import DailyPlanScreen from './src/screens/DailyPlanScreen';
import BreathingScreen from './src/screens/BreathingScreen';
import StatsScreen from './src/screens/StatsScreen';
import WeekendAssessmentScreen from './src/screens/WeekendAssessmentScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Create tab navigator type
type TabParamList = {
  Daily: undefined;
  Breathing: undefined;
  Stats: undefined;
  Weekend: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap | undefined;

              if (route.name === 'Daily') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Breathing') {
                iconName = focused ? 'fitness' : 'fitness-outline';
              } else if (route.name === 'Stats') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              } else if (route.name === 'Weekend') {
                iconName = focused ? 'body' : 'body-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              // You can return any component here
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2e7d32',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            // Add web-specific styles for better appearance on web
            ...(Platform.OS === 'web' && {
              tabBarStyle: {
                height: 60,
                paddingBottom: 10,
                paddingTop: 10
              }
            })
          })}
        >
          <Tab.Screen 
            name="Daily" 
            component={DailyPlanScreen} 
            options={{ 
              title: "Daily Plan",
              tabBarLabel: "Daily"
            }} 
          />
          <Tab.Screen 
            name="Breathing" 
            component={BreathingScreen} 
            options={{ 
              title: "Breathing",
              tabBarLabel: "Breathing"
            }} 
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen} 
            options={{ 
              title: "Statistics",
              tabBarLabel: "Stats"
            }} 
          />
          <Tab.Screen 
            name="Weekend" 
            component={WeekendAssessmentScreen} 
            options={{ 
              title: "Weekend Assessment",
              tabBarLabel: "Weekend"
            }} 
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ 
              title: "Settings",
              tabBarLabel: "Settings"
            }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
