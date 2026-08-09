import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useTheme } from "../../../theme";
import { useTasks } from "../hooks/useTasks";
import { useGamification } from "../../gamification/hooks/useGamification";
import { useCategories } from "../../categories/hooks/useCategories";
import { TaskList } from "../components/TaskList";
import { TaskFormModal } from "../components/TaskFormModal";
import { CategoryFilterBar } from "../../categories/components/CategoryFilterBar";
import { XPBar } from "../../gamification/components/XPBar";
import { StreakCounter } from "../../gamification/components/StreakCounter";
import { LevelUpModal } from "../../gamification/components/LevelUpModal";
import { AchievementUnlockedModal } from "../../gamification/components/AchievementUnlockedModal";
import { Task } from "../../../domain/entities/Task";

export function TasksScreen() {
  const theme = useTheme();
  const { pending, completed, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { categories } = useCategories();
  const {
    xp,
    currentStreak,
    pendingLevelUp,
    pendingAchievements,
    clearPendingLevelUp,
    clearPendingAchievements,
  } = useGamification();

  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);

  const filteredPending = useMemo(
    () => (activeCategoryId ? pending.filter((t) => t.categoryId === activeCategoryId) : pending),
    [pending, activeCategoryId]
  );
  const filteredCompleted = useMemo(
    () => (activeCategoryId ? completed.filter((t) => t.categoryId === activeCategoryId) : completed),
    [completed, activeCategoryId]
  );

  function openNewTaskForm() {
    setEditingTask(null);
    setFormVisible(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormVisible(true);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>TodoQuest</Text>
          <StreakCounter streak={currentStreak} />
        </View>
        <XPBar xp={xp} />
      </View>

      <View style={styles.filterBar}>
        <CategoryFilterBar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </View>

      <TaskList
        pending={filteredPending}
        completed={filteredCompleted}
        categories={categories}
        onToggle={toggleComplete}
        onPress={openEditForm}
        onLongPress={openEditForm}
      />

      <Pressable
        onPress={openNewTaskForm}
        style={[styles.fab, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <TaskFormModal
        visible={formVisible}
        editingTask={editingTask}
        onClose={() => setFormVisible(false)}
        onSubmit={(input) =>
          editingTask ? updateTask(editingTask.id, input) : addTask(input)
        }
        onDelete={deleteTask}
      />

      <LevelUpModal level={pendingLevelUp} onDismiss={clearPendingLevelUp} />
      <AchievementUnlockedModal
        achievements={pendingAchievements}
        onDismiss={clearPendingAchievements}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 26, fontWeight: "800" },
  filterBar: { paddingHorizontal: 20, paddingBottom: 12 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { fontSize: 30, color: "#0F172A", lineHeight: 32, fontWeight: "600" },
});
