import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityBucket } from "../logic/reportAggregation";
import { useTheme } from "../../../theme";

const TRACK_HEIGHT = 110;

export function ActivityBarChart({ buckets }: { buckets: ActivityBucket[] }) {
  const theme = useTheme();
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <View style={styles.row}>
      {buckets.map((bucket) => {
        const heightRatio = bucket.count / maxCount;
        return (
          <View key={bucket.key} style={styles.column}>
            <Text style={[styles.count, { color: theme.text }]}>
              {bucket.count > 0 ? bucket.count : ""}
            </Text>
            <View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}>
              {bucket.count > 0 && (
                <View
                  style={[
                    styles.bar,
                    { height: `${Math.max(heightRatio * 100, 6)}%`, backgroundColor: theme.primary },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.label, { color: theme.textMuted }]}>{bucket.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  count: {
    fontSize: 11,
    fontWeight: "700",
    height: 14,
  },
  track: {
    width: "70%",
    height: TRACK_HEIGHT,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
});
