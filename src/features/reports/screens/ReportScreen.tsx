import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../../../theme";
import { useActivityReport } from "../hooks/useActivityReport";
import { PeriodSelector } from "../components/PeriodSelector";
import { ActivityBarChart } from "../components/ActivityBarChart";
import { SummaryStatsRow } from "../components/SummaryStatsRow";
import { CategoryBreakdownList } from "../components/CategoryBreakdownList";
import { CategoryFilterBar } from "../../categories/components/CategoryFilterBar";

const PERIOD_HINT: Record<"daily" | "weekly", string> = {
  daily: "Últimos 7 dias",
  weekly: "Últimas 8 semanas",
};

export function ReportScreen() {
  const theme = useTheme();
  const {
    period,
    setPeriod,
    categoryId,
    setCategoryId,
    categories,
    buckets,
    summary,
    categoryBreakdown,
    hasAnyCompletedTask,
  } = useActivityReport();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Relatório</Text>

        <PeriodSelector value={period} onChange={setPeriod} />

        <CategoryFilterBar
          categories={categories}
          activeCategoryId={categoryId}
          onSelect={setCategoryId}
        />

        {!hasAnyCompletedTask ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Conclua tarefas para começar a ver seu progresso aqui.
            </Text>
          </View>
        ) : (
          <>
            <SummaryStatsRow summary={summary} />

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Atividade</Text>
                <Text style={[styles.cardHint, { color: theme.textMuted }]}>
                  {PERIOD_HINT[period]}
                </Text>
              </View>
              <ActivityBarChart buckets={buckets} />
            </View>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Por categoria</Text>
              <CategoryBreakdownList items={categoryBreakdown} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 16 },
  title: { fontSize: 26, fontWeight: "800" },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardHint: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, textAlign: "center" },
});
