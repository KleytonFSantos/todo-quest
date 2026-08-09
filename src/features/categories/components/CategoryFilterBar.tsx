import React from "react";
import { Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Category } from "../../../domain/entities/Category";
import { useTheme } from "../../../theme";

interface Props {
  categories: Category[];
  /** undefined = "Todas" (no filter applied) */
  activeCategoryId: string | undefined;
  onSelect: (id: string | undefined) => void;
}

/** Horizontal filter bar shown on the Tasks screen once the user has at least one category. */
export function CategoryFilterBar({ categories, activeCategoryId, onSelect }: Props) {
  const theme = useTheme();

  if (categories.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        onPress={() => onSelect(undefined)}
        style={[
          styles.chip,
          {
            borderColor: theme.border,
            backgroundColor: activeCategoryId === undefined ? theme.primary : "transparent",
          },
        ]}
      >
        <Text
          style={{
            color: activeCategoryId === undefined ? "#0F172A" : theme.textMuted,
            fontWeight: "600",
          }}
        >
          Todas
        </Text>
      </Pressable>
      {categories.map((category) => {
        const selected = category.id === activeCategoryId;
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
  row: { gap: 8, paddingRight: 20 },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
