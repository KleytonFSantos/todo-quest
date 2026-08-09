import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Category } from "../../../domain/entities/Category";

export function CategoryChip({ category }: { category: Category }) {
  return (
    <View style={[styles.badge, { backgroundColor: category.color + "26", borderColor: category.color }]}>
      <Text style={[styles.text, { color: category.color }]} numberOfLines={1}>
        {category.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    maxWidth: 120,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
