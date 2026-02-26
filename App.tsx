import 'react-native-gesture-handler';

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { WorkoutsProvider, useWorkouts } from './src/context/WorkoutsContext';

function AppLoader() {
  const { loading } = useWorkouts();
  if (!loading) return null;
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#00E5A0" />
    </View>
  );
}

export default function App() {
  return (
    <WorkoutsProvider>
      <NavigationContainer>
        <AppNavigator />
        <AppLoader />
      </NavigationContainer>
    </WorkoutsProvider>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0B0E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
