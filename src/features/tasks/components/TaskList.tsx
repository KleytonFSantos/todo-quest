import React, { useMemo } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { Task } from "../../../domain/entities/Task";
import { Category } from "../../../domain/entities/Category";
import { useTheme } from "../../../theme";
import { TaskItem } from "./TaskItem";

interface Props {
  pending: Task[];
  completed: Task[];
  categories: Category[];
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
}

export function TaskList({ pending, completed, categories, onToggle, onPress, onLongPress }: Props) {
  const theme = useTheme();

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const sections = [
    { title: `A fazer (${pending.length})`, data: pending },
    { title: `Concluídas (${completed.length})`, data: completed },
  ].filter((s) => s.data.length > 0);

  if (sections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🗒️</Text>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Nenhuma tarefa ainda. Toque em + para criar a primeira!
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>
          {section.title}
        </Text>
      )}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          category={item.categoryId ? categoryById.get(item.categoryId) : undefined}
          onToggle={onToggle}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});
