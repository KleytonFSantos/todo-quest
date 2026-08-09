import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Category } from "../../../domain/entities/Category";
import { useTheme } from "../../../theme";

interface Props {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (id: string | undefined) => void;
}

/**
 * Lets the user assign one of *their own* registered categories to a task.
 * Deliberately offers no free-text input here — categories only come from
 * what was cadastrado in Ajustes, per the product requirement.
 */
export function CategorySelector({ categories, selectedCategoryId, onSelect }: Props) {
  const theme = useTheme();

  if (categories.length === 0) {
    return (
      <Text style={[styles.emptyHint, { color: theme.textMuted }]}>
        Nenhuma categoria cadastrada ainda. Crie categorias em Ajustes → Categorias.
      </Text>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        onPress={() => onSelect(undefined)}
        style={[
          styles.chip,
          {
            borderColor: theme.border,
            backgroundColor: selectedCategoryId === undefined ? theme.primary : "transparent",
          },
        ]}
      >
        <Text
          style={{
            color: selectedCategoryId === undefined ? "#0F172A" : theme.textMuted,
            fontWeight: "600",
          }}
        >
          Sem categoria
        </Text>
      </Pressable>
      {categories.map((category) => {
        const selected = category.id === selectedCategoryId;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[
              styles.chip,
              {
                borderColor: category.color,
                backgroundColor: selected ? category.color : "transparent",
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={{ color: selected ? "#0F172A" : category.color, fontWeight: "600", maxWidth: 130 }}
            >
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyHint: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
