import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ title: 'Add workout' }} />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
        options={{ title: 'Workout details' }}
      />
    </Stack.Navigator>
  );
}
