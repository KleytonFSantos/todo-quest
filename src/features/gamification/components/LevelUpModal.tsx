import React, { useEffect } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../theme";

interface Props {
  level: number | null;
  onDismiss: () => void;
}

export function LevelUpModal({ level, onDismiss }: Props) {
  const theme = useTheme();

  useEffect(() => {
    if (level != null) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [level]);

  if (level == null) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.title, { color: theme.text }]}>Level Up!</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Você alcançou o nível {level}
          </Text>
          <Pressable
            onPress={onDismiss}
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, marginBottom: 12 },
  button: {
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: { color: "#0F172A", fontWeight: "700" },
});
