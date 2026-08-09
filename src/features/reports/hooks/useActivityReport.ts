import { useMemo, useState } from "react";
import { useTaskStore } from "../../../state/useTaskStore";
import { useCategoryStore } from "../../../state/useCategoryStore";
import {
  ReportPeriod,
  getActivityBuckets,
  getCategoryBreakdown,
  getCompletedTasksInPeriod,
  getReportSummary,
  filterByCategory,
} from "../logic/reportAggregation";

/**
 * Facade hook for the activity report/dashboard: owns the period + category
 * filter UI state and derives every chart/summary value with useMemo so the
 * screen never touches raw store data or aggregation logic directly.
 */
export function useActivityReport() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const tasksInPeriod = useMemo(
    () => getCompletedTasksInPeriod(tasks, period),
    [tasks, period]
  );

  const filteredTasks = useMemo(
    () => filterByCategory(tasksInPeriod, categoryId),
    [tasksInPeriod, categoryId]
  );

  const buckets = useMemo(
    () => getActivityBuckets(filterByCategory(tasks, categoryId), period),
    [tasks, categoryId, period]
  );

  const summary = useMemo(
    () => getReportSummary(filteredTasks, buckets),
    [filteredTasks, buckets]
  );

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(tasksInPeriod, categories),
    [tasksInPeriod, categories]
  );

  return {
    period,
    setPeriod,
    categoryId,
    setCategoryId,
    categories,
    buckets,
    summary,
    categoryBreakdown,
    hasAnyCompletedTask: tasks.some((t) => t.completed),
  };
}
