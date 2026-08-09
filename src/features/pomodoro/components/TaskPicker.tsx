import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Task } from "../../../domain/entities/Task";
import { useTheme } from "../../../theme";

interface Props {
  tasks: Task[];
  linkedTaskId: string | null;
  onSelect: (id: string | null) => void;
}

/** Lets the user dedicate the current Pomodoro session to one open task. */
export function TaskPicker({ tasks, linkedTaskId, onSelect }: Props) {
  const theme = useTheme();

  if (tasks.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textMuted }]}>Focar em qual tarefa?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pressable
          onPress={() => onSelect(null)}
          style={[
            styles.chip,
            {
              borderColor: theme.border,
              backgroundColor: linkedTaskId === null ? theme.primary : "transparent",
            },
          ]}
        >
          <Text style={{ color: linkedTaskId === null ? "#0F172A" : theme.textMuted, fontWeight: "600" }}>
            Livre
          </Text>
        </Pressable>
        {tasks.map((task) => {
          const selected = task.id === linkedTaskId;
          return (
            <Pressable
              key={task.id}
              onPress={() => onSelect(task.id)}
              style={[
                styles.chip,
                {
                  borderColor: theme.border,
                  backgroundColor: selected ? theme.primary : "transparent",
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: selected ? "#0F172A" : theme.text, fontWeight: "600", maxWidth: 140 }}
              >
                {task.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600" },
  row: { gap: 8, paddingRight: 20 },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
