import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useWorkoutsExercices } from "../context/WorkoutsExercicesContext";
import { FONT_SIZES, SPACING } from "../theme/constants";

export default function SyncStatus() {
  const { isOnline, isSyncing } = useWorkoutsExercices();

  if (!isSyncing && isOnline) {
    return null; // Don't show anything when online and not syncing
  }

  return (
    <View style={[styles.container, !isOnline && styles.offline]}>
      {isSyncing ? (
        <>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.text}>Syncing...</Text>
        </>
      ) : (
        <Text style={styles.text}>📡 Offline Mode</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  offline: {
    backgroundColor: "#F59E0B",
  },
  text: {
    color: "#fff",
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
});
