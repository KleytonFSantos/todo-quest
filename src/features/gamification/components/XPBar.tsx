import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { getLevelProgress } from "../logic/levelCurve";

export function XPBar({ xp }: { xp: number }) {
  const theme = useTheme();
  const { level, xpIntoLevel, xpForNextLevel, progressRatio } = getLevelProgress(xp);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.levelText, { color: theme.text }]}>Nível {level}</Text>
        <Text style={[styles.xpText, { color: theme.textMuted }]}>
          {xpIntoLevel} / {xpForNextLevel} XP
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.surfaceAlt }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.round(progressRatio * 100)}%`, backgroundColor: theme.primary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  levelText: { fontSize: 14, fontWeight: "700" },
  xpText: { fontSize: 12 },
  track: { height: 10, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
});
