import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import Screens (assuming they were scaffolded during MVP phase)
import DashboardScreen from '../screens/Dashboard';
import CampaignsScreen from '../screens/Campaigns';
import QuickVideoScreen from '../screens/QuickVideo';
import NotificationsScreen from '../screens/Notifications';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'Dashboard') iconName = 'home';
            else if (route.name === 'Campaigns') iconName = 'calendar';
            else if (route.name === 'QuickVideo') iconName = 'videocam';
            else if (route.name === 'Alerts') iconName = 'notifications';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2563eb', // Tailwind blue-600
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Campaigns" component={CampaignsScreen} />
        <Tab.Screen name="QuickVideo" component={QuickVideoScreen} />
        <Tab.Screen name="Alerts" component={NotificationsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
