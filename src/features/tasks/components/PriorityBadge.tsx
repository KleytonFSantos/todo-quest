import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Priority } from "../../../domain/entities/Task";
import { palette } from "../../../theme/colors";

const LABEL: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const COLOR: Record<Priority, string> = {
  low: palette.priorityLow,
  medium: palette.priorityMedium,
  high: palette.priorityHigh,
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const color = COLOR[priority];
  return (
    <View style={[styles.badge, { backgroundColor: color + "26", borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{LABEL[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
