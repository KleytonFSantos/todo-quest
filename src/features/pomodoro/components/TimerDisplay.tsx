import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PomodoroPhase } from "../../../domain/entities/Pomodoro";
import { useTheme } from "../../../theme";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  work: "Foco",
  shortBreak: "Pausa curta",
  longBreak: "Pausa longa",
};

const PHASE_COLOR: Record<PomodoroPhase, string> = {
  work: "#F87171",
  shortBreak: "#34D399",
  longBreak: "#22D3EE",
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function TimerDisplay({
  phase,
  secondsRemaining,
}: {
  phase: PomodoroPhase;
  secondsRemaining: number;
}) {
  const theme = useTheme();
  const color = PHASE_COLOR[phase];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color + "22" }]}>
        <Text style={[styles.badgeText, { color }]}>{PHASE_LABEL[phase]}</Text>
      </View>
      <Text style={[styles.time, { color: theme.text }]}>{formatTime(secondsRemaining)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 16 },
  badge: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 },
  badgeText: { fontWeight: "700", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  time: { fontSize: 72, fontWeight: "200", fontVariant: ["tabular-nums"] },
});
