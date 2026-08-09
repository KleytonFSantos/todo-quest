import React from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { useTheme } from "../../../theme";
import { useGamification } from "../hooks/useGamification";
import { XPBar } from "../components/XPBar";
import { StreakCounter } from "../components/StreakCounter";
import { AchievementCard } from "../components/AchievementCard";

export function ProgressScreen() {
  const theme = useTheme();
  const {
    xp,
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalPomodorosCompleted,
    achievements,
  } = useGamification();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.achievement.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Progresso</Text>

            <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <XPBar xp={xp} />
              <View style={styles.statsRow}>
                <Stat label="Sequência" value={String(currentStreak)} theme={theme} extra={<StreakCounter streak={currentStreak} />} />
                <Stat label="Recorde" value={`${longestStreak} dias`} theme={theme} />
              </View>
              <View style={styles.statsRow}>
                <Stat label="Tarefas concluídas" value={String(totalTasksCompleted)} theme={theme} />
                <Stat label="Pomodoros" value={String(totalPomodorosCompleted)} theme={theme} />
              </View>
            </View>

            <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>Conquistas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AchievementCard achievement={item.achievement} unlocked={item.unlocked} />
        )}
      />
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
  theme,
  extra,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
  extra?: React.ReactNode;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
        {extra}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { gap: 16, paddingTop: 12, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800" },
  statsCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 16 },
  statsRow: { flexDirection: "row", gap: 20 },
  stat: { flex: 1, gap: 4 },
  statLabel: { fontSize: 12 },
  statValueRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statValue: { fontSize: 18, fontWeight: "700" },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
  },
});
