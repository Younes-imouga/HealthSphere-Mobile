import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme/constants';

import HomeScreen from '../screens/HomeScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  AddWorkout: undefined;
  WorkoutDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // 'slide_from_right' animation provides a much smoother "slide over" effect where
        // the previous screen stays visible, avoiding black/white flashes.
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: COLORS.background.secondary,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="AddWorkout" 
        component={AddWorkoutScreen} 
      />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
      />
    </Stack.Navigator>
  );
}
