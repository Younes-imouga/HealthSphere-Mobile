import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { useWorkoutsExercices } from "../context/WorkoutsExercicesContext";
import { BORDER_RADIUS, COLORS } from "../theme/constants";

export default function RefreshButton() {
  const { refetch, refreshing } = useWorkoutsExercices();

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <TouchableOpacity
      style={styles.refreshButton}
      onPress={handleRefresh}
      disabled={refreshing}
    >
      {refreshing ? (
        <ActivityIndicator size="small" color="#6366F1" />
      ) : (
        <Text style={styles.refreshIcon}>🔄</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshIcon: {
    fontSize: 20,
  },
});
