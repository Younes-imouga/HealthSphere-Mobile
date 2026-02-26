import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { ActivityIndicator, BackHandler, View, StyleSheet } from 'react-native';
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
        <BackHandlerWrapper />
        <AppNavigator />
        <AppLoader />
      </NavigationContainer>
    </WorkoutsProvider>
  );
}

function BackHandlerWrapper() {
  useEffect(() => {
    const backAction = () => {
      // Let React Navigation handle the back button by default
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return null;
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
