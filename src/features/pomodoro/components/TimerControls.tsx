import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { TimerStatus } from "../../../domain/entities/Pomodoro";
import { useTheme } from "../../../theme";

interface Props {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({ status, onStart, onPause, onResume, onReset, onSkip }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Pressable onPress={onReset} style={[styles.secondaryButton, { borderColor: theme.border }]}>
        <Text style={[styles.secondaryText, { color: theme.textMuted }]}>Reiniciar</Text>
      </Pressable>

      {status === "running" ? (
        <Pressable
          onPress={onPause}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.primaryText}>Pausar</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={status === "paused" ? onResume : onStart}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.primaryText}>
            {status === "paused" ? "Continuar" : "Iniciar"}
          </Text>
        </Pressable>
      )}

      <Pressable onPress={onSkip} style={[styles.secondaryButton, { borderColor: theme.border }]}>
        <Text style={[styles.secondaryText, { color: theme.textMuted }]}>Pular</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  primaryButton: {
    flex: 1.4,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryText: { color: "#0F172A", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryText: { fontWeight: "600", fontSize: 14 },
});
