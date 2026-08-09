import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NewTaskInput, Priority, Task } from "../../../domain/entities/Task";
import { useTheme } from "../../../theme";
import { palette } from "../../../theme/colors";
import { useCategories } from "../../categories/hooks/useCategories";
import { CategorySelector } from "../../categories/components/CategorySelector";

interface Props {
  visible: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
  onDelete?: (id: string) => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};
const PRIORITY_COLOR: Record<Priority, string> = {
  low: palette.priorityLow,
  medium: palette.priorityMedium,
  high: palette.priorityHigh,
};

export function TaskFormModal({ visible, editingTask, onClose, onSubmit, onDelete }: Props) {
  const theme = useTheme();
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      setTitle(editingTask?.title ?? "");
      setNotes(editingTask?.notes ?? "");
      setPriority(editingTask?.priority ?? "medium");
      setCategoryId(editingTask?.categoryId);
    }
  }, [visible, editingTask]);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({ title, notes: notes.trim() || undefined, priority, categoryId });
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.heading, { color: theme.text }]}>
            {editingTask ? "Editar tarefa" : "Nova tarefa"}
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="O que você precisa fazer?"
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceAlt },
            ]}
            autoFocus
          />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas (opcional)"
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              styles.notesInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceAlt },
            ]}
            multiline
          />

          <Text style={[styles.label, { color: theme.textMuted }]}>Prioridade</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const selected = p === priority;
              const color = PRIORITY_COLOR[p];
              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityChip,
                    {
                      borderColor: color,
                      backgroundColor: selected ? color : "transparent",
                    },
                  ]}
                >
                  <Text style={{ color: selected ? "#0F172A" : color, fontWeight: "600" }}>
                    {PRIORITY_LABEL[p]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.textMuted }]}>Categoria</Text>
          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={setCategoryId}
          />

          <Pressable
            onPress={handleSubmit}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.primaryButtonText}>
              {editingTask ? "Salvar alterações" : "Adicionar tarefa"}
            </Text>
          </Pressable>

          {editingTask && onDelete && (
            <Pressable
              onPress={() => {
                onDelete(editingTask.id);
                onClose();
              }}
              style={styles.deleteButton}
            >
              <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
                Excluir tarefa
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityChip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontWeight: "600",
  },
});
