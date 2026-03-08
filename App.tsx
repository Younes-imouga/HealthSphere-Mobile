import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WorkoutsProvider, useWorkouts } from "./src/context/WorkoutsContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { ExercicesProvider } from "./src/context/ExerciceContext";

function AppLoader() {
  const { loading } = useWorkouts();
  if (!loading) return null;
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#6366F1" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WorkoutsProvider>
        <ExercicesProvider>
          <NavigationContainer>
            <AppNavigator />
            <AppLoader />
          </NavigationContainer>
        </ExercicesProvider>
      </WorkoutsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F8F9FC",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
