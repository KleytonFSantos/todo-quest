import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Switch, Pressable } from "react-native";
import { useTheme } from "../../../theme";
import { useSettingsStore } from "../../../state/useSettingsStore";
import { useCategories } from "../../categories/hooks/useCategories";
import { CategoriesScreen } from "../../categories/screens/CategoriesScreen";

const STEP_MINUTES: Record<"workMinutes" | "shortBreakMinutes" | "longBreakMinutes", number> = {
  workMinutes: 5,
  shortBreakMinutes: 1,
  longBreakMinutes: 5,
};

export function SettingsScreen() {
  const theme = useTheme();
  const pomodoro = useSettingsStore((s) => s.pomodoro);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const updatePomodoroConfig = useSettingsStore((s) => s.updatePomodoroConfig);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const { categories } = useCategories();
  const [categoriesVisible, setCategoriesVisible] = useState(false);

  function renderStepper(
    key: "workMinutes" | "shortBreakMinutes" | "longBreakMinutes",
    label: string
  ) {
    const value = pomodoro[key];
    const step = STEP_MINUTES[key];
    return (
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => updatePomodoroConfig({ [key]: Math.max(step, value - step) })}
            style={[styles.stepButton, { backgroundColor: theme.surfaceAlt }]}
          >
            <Text style={[styles.stepButtonText, { color: theme.text }]}>−</Text>
          </Pressable>
          <Text style={[styles.stepValue, { color: theme.text }]}>{value} min</Text>
          <Pressable
            onPress={() => updatePomodoroConfig({ [key]: value + step })}
            style={[styles.stepButton, { backgroundColor: theme.surfaceAlt }]}
          >
            <Text style={[styles.stepButtonText, { color: theme.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>

      <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>Pomodoro</Text>
      {renderStepper("workMinutes", "Foco")}
      {renderStepper("shortBreakMinutes", "Pausa curta")}
      {renderStepper("longBreakMinutes", "Pausa longa")}

      <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>Notificações</Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>Avisos do timer</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>Categorias</Text>
      <Pressable
        onPress={() => setCategoriesVisible(true)}
        style={[styles.row, { borderColor: theme.border }]}
      >
        <Text style={[styles.rowLabel, { color: theme.text }]}>Gerenciar categorias</Text>
        <Text style={[styles.rowValue, { color: theme.textMuted }]}>
          {categories.length} {categories.length === 1 ? "categoria" : "categorias"} ›
        </Text>
      </Pressable>

      <CategoriesScreen visible={categoriesVisible} onClose={() => setCategoriesVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 12 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 15, fontWeight: "500" },
  rowValue: { fontSize: 14, fontWeight: "500" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonText: { fontSize: 18, fontWeight: "700", lineHeight: 20 },
  stepValue: { fontSize: 14, fontWeight: "600", minWidth: 52, textAlign: "center" },
});
