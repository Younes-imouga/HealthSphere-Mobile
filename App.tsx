import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { WorkoutsProvider } from './src/context/WorkoutsContext';

export default function App() {
  return (
    <WorkoutsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </WorkoutsProvider>
  );
}
