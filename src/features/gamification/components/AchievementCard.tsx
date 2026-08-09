import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Achievement } from "../../../domain/entities/Gamification";
import { useTheme } from "../../../theme";

export function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: Achievement;
  unlocked: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: unlocked ? 1 : 0.4,
        },
      ]}
    >
      <Text style={styles.icon}>{achievement.icon}</Text>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{achievement.title}</Text>
        <Text style={[styles.description, { color: theme.textMuted }]}>
          {achievement.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  icon: { fontSize: 28 },
  textBlock: { flex: 1, gap: 2 },
  title: { fontSize: 14, fontWeight: "700" },
  description: { fontSize: 12 },
});
