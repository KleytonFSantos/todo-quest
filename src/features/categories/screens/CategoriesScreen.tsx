import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Modal, SafeAreaView } from "react-native";
import { useTheme } from "../../../theme";
import { useCategories } from "../hooks/useCategories";
import { CategoryFormModal } from "../components/CategoryFormModal";
import { Category } from "../../../domain/entities/Category";

interface Props {
  visible: boolean;
  onClose: () => void;
}

/**
 * Full management screen for user-defined categories: create, rename,
 * recolor, delete. Presented as a full-screen modal from Ajustes so we
 * don't need a stack navigator on top of the bottom tabs.
 */
export function CategoriesScreen({ visible, onClose }: Props) {
  const theme = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  function openNewForm() {
    setEditingCategory(null);
    setFormVisible(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setFormVisible(true);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Categorias</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={[styles.closeText, { color: theme.primary }]}>Fechar</Text>
          </Pressable>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🏷️</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Nenhuma categoria ainda. Crie a primeira, como "Lar", "Estudo" ou "Trabalho".
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openEditForm(item)}
              style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
            </Pressable>
          )}
        />

        <Pressable
          onPress={openNewForm}
          style={[styles.fab, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>

        <CategoryFormModal
          visible={formVisible}
          editingCategory={editingCategory}
          onClose={() => setFormVisible(false)}
          onSubmit={(input) =>
            editingCategory ? updateCategory(editingCategory.id, input) : addCategory(input)
          }
          onDelete={deleteCategory}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "800" },
  closeText: { fontSize: 15, fontWeight: "600" },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  chevron: { fontSize: 18 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, textAlign: "center" },
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
