import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from '../screens/Welcome';
import DashboardScreen from '../screens/Dashboard';
import CampaignsScreen from '../screens/Campaigns';
import QuickVideoScreen from '../screens/QuickVideo';
import NotificationsScreen from '../screens/Notifications';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
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
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} />
      <Tab.Screen name="QuickVideo" component={QuickVideoScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
