import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/HomeScreen';
import SearchResultsScreen from './src/SearchResultsScreen';
import CameraScreen from './src/CameraScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="SearchResults" component={SearchResultsScreen} />
        <Tab.Screen name="CameraScreen" component={CameraScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
