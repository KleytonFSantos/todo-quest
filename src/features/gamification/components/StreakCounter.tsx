import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";

export function StreakCounter({ streak }: { streak: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme.surfaceAlt }]}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={[styles.text, { color: theme.text }]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emoji: { fontSize: 14 },
  text: { fontSize: 13, fontWeight: "700" },
});
