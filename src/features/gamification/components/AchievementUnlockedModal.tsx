import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Achievement } from "../../../domain/entities/Gamification";
import { useTheme } from "../../../theme";

interface Props {
  achievements: Achievement[];
  onDismiss: () => void;
}

/** Shows one modal per pending achievement, one at a time. */
export function AchievementUnlockedModal({ achievements, onDismiss }: Props) {
  const theme = useTheme();
  const current = achievements[0];
  if (!current) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={styles.icon}>{current.icon}</Text>
          <Text style={[styles.label, { color: theme.primary }]}>Conquista desbloqueada</Text>
          <Text style={[styles.title, { color: theme.text }]}>{current.title}</Text>
          <Text style={[styles.description, { color: theme.textMuted }]}>
            {current.description}
          </Text>
          <Pressable
            onPress={onDismiss}
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.buttonText}>
              {achievements.length > 1 ? "Próxima" : "Legal!"}
            </Text>
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
    gap: 6,
  },
  icon: { fontSize: 44 },
  label: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  title: { fontSize: 20, fontWeight: "800", marginTop: 2 },
  description: { fontSize: 13, textAlign: "center", marginBottom: 10 },
  button: { borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  buttonText: { color: "#0F172A", fontWeight: "700" },
});
