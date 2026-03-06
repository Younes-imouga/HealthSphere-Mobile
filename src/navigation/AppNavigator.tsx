import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { COLORS } from "../theme/constants";

import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import DrawerNavigator from "./DrawerNavigator";

export type RootStackParamList = {
  DrawerNav: undefined;
  AddWorkout: undefined;
  WorkoutDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: COLORS.background.primary,
        },
      }}
    >
      <Stack.Screen name="DrawerNav" component={DrawerNavigator} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  );
}
