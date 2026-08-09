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
import { Category, NewCategoryInput } from "../../../domain/entities/Category";
import { useTheme } from "../../../theme";
import { CATEGORY_COLOR_SWATCHES } from "../colorSwatches";

interface Props {
  visible: boolean;
  editingCategory: Category | null;
  onClose: () => void;
  onSubmit: (input: NewCategoryInput) => void;
  onDelete?: (id: string) => void;
}

export function CategoryFormModal({ visible, editingCategory, onClose, onSubmit, onDelete }: Props) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [color, setColor] = useState(CATEGORY_COLOR_SWATCHES[0]);

  useEffect(() => {
    if (visible) {
      setName(editingCategory?.name ?? "");
      setColor(editingCategory?.color ?? CATEGORY_COLOR_SWATCHES[0]);
    }
  }, [visible, editingCategory]);

  function handleSubmit() {
    if (!name.trim()) return;
    onSubmit({ name, color });
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
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Lar, Estudo, Trabalho..."
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceAlt },
            ]}
            autoFocus
          />

          <Text style={[styles.label, { color: theme.textMuted }]}>Cor</Text>
          <View style={styles.swatchRow}>
            {CATEGORY_COLOR_SWATCHES.map((swatch) => (
              <Pressable
                key={swatch}
                onPress={() => setColor(swatch)}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch },
                  color === swatch && styles.swatchSelected,
                ]}
              />
            ))}
          </View>

          <Pressable
            onPress={handleSubmit}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.primaryButtonText}>
              {editingCategory ? "Salvar alterações" : "Criar categoria"}
            </Text>
          </Pressable>

          {editingCategory && onDelete && (
            <Pressable
              onPress={() => {
                onDelete(editingCategory.id);
                onClose();
              }}
              style={styles.deleteButton}
            >
              <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
                Excluir categoria
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: "#0F172A",
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
