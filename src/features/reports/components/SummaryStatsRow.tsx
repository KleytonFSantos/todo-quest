import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ReportSummary } from "../logic/reportAggregation";
import { useTheme } from "../../../theme";

export function SummaryStatsRow({ summary }: { summary: ReportSummary }) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Stat label="Concluídas" value={String(summary.totalCompleted)} theme={theme} />
      <Stat label="Média/período" value={summary.averagePerBucket.toFixed(1)} theme={theme} />
      <Stat label="Pomodoros" value={String(summary.pomodorosInvested)} theme={theme} />
    </View>
  );
}

function Stat({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    gap: 2,
  },
  value: { fontSize: 20, fontWeight: "800" },
  label: { fontSize: 11, textAlign: "center" },
});
