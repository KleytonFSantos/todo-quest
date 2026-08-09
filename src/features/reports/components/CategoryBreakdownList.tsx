import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CategoryBreakdownItem } from "../logic/reportAggregation";
import { useTheme } from "../../../theme";

export function CategoryBreakdownList({ items }: { items: CategoryBreakdownItem[] }) {
  const theme = useTheme();

  if (items.length === 0) {
    return (
      <Text style={[styles.empty, { color: theme.textMuted }]}>
        Nenhuma tarefa concluída neste período ainda.
      </Text>
    );
  }

  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <View style={styles.list}>
      {items.map((item) => {
        const color = item.category?.color ?? theme.textMuted;
        const label = item.category?.name ?? "Sem categoria";
        const ratio = total > 0 ? item.count / total : 0;
        return (
          <View key={item.category?.id ?? "uncategorized"} style={styles.row}>
            <View style={styles.labelRow}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
                {label}
              </Text>
              <Text style={[styles.count, { color: theme.textMuted }]}>{item.count}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}>
              <View
                style={[styles.fill, { width: `${Math.max(ratio * 100, 4)}%`, backgroundColor: color }]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  row: { gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { flex: 1, fontSize: 14, fontWeight: "600" },
  count: { fontSize: 13, fontWeight: "700" },
  track: { height: 8, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
  empty: { fontSize: 14, fontStyle: "italic", paddingVertical: 8 },
});
