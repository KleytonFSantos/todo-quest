import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ReportPeriod } from "../logic/reportAggregation";
import { useTheme } from "../../../theme";

const OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
];

export function PeriodSelector({
  value,
  onChange,
}: {
  value: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceAlt }]}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              selected && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={{ color: selected ? "#0F172A" : theme.textMuted, fontWeight: "700" }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 8,
    alignItems: "center",
  },
});
