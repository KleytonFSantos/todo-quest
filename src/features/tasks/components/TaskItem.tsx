import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Task } from "../../../domain/entities/Task";
import { Category } from "../../../domain/entities/Category";
import { useTheme } from "../../../theme";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryChip } from "../../categories/components/CategoryChip";

interface Props {
  task: Task;
  category?: Category;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
}

export function TaskItem({ task, category, onToggle, onPress, onLongPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress(task)}
      onLongPress={() => onLongPress(task)}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={8}
        style={[
          styles.checkbox,
          {
            borderColor: task.completed ? theme.success : theme.textMuted,
            backgroundColor: task.completed ? theme.success : "transparent",
          },
        ]}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            task.completed && styles.titleCompleted,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <PriorityBadge priority={task.priority} />
          {category && <CategoryChip category={category} />}
          {task.pomodorosSpent > 0 && (
            <Text style={[styles.pomodoroCount, { color: theme.textMuted }]}>
              🍅 {task.pomodorosSpent}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  body: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pomodoroCount: {
    fontSize: 12,
  },
});
