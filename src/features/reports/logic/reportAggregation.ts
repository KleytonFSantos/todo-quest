import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  format,
  isWithinInterval,
} from "date-fns";
import { Task } from "../../../domain/entities/Task";
import { Category } from "../../../domain/entities/Category";

export type ReportPeriod = "daily" | "weekly";

const DAILY_WINDOW_DAYS = 7;
const WEEKLY_WINDOW_WEEKS = 8;
const WEEK_STARTS_ON = 1; // Monday

export interface ActivityBucket {
  key: string;
  label: string;
  count: number;
}

export interface ReportRange {
  start: Date;
  end: Date;
}

/** The lookback window each period option represents, used to scope the whole report. */
export function getRangeForPeriod(period: ReportPeriod): ReportRange {
  const now = new Date();
  if (period === "daily") {
    return { start: startOfDay(subDays(now, DAILY_WINDOW_DAYS - 1)), end: endOfDay(now) };
  }
  return {
    start: startOfWeek(subWeeks(now, WEEKLY_WINDOW_WEEKS - 1), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(now, { weekStartsOn: WEEK_STARTS_ON }),
  };
}

export function completedInRange(tasks: Task[], range: ReportRange): Task[] {
  return tasks.filter(
    (t) =>
      t.completed &&
      t.completedAt &&
      isWithinInterval(new Date(t.completedAt), { start: range.start, end: range.end })
  );
}

/** Completed tasks that fall inside the lookback window for the given period. */
export function getCompletedTasksInPeriod(tasks: Task[], period: ReportPeriod): Task[] {
  return completedInRange(tasks, getRangeForPeriod(period));
}

/** One bar per day (last 7 days) or per week (last 8 weeks), counting completed tasks. */
export function getActivityBuckets(tasks: Task[], period: ReportPeriod): ActivityBucket[] {
  const now = new Date();
  const buckets: ActivityBucket[] = [];

  if (period === "daily") {
    for (let i = DAILY_WINDOW_DAYS - 1; i >= 0; i--) {
      const day = subDays(now, i);
      const range = { start: startOfDay(day), end: endOfDay(day) };
      buckets.push({
        key: format(day, "yyyy-MM-dd"),
        label: format(day, "dd/MM"),
        count: completedInRange(tasks, range).length,
      });
    }
    return buckets;
  }

  for (let i = WEEKLY_WINDOW_WEEKS - 1; i >= 0; i--) {
    const weekAnchor = subWeeks(now, i);
    const start = startOfWeek(weekAnchor, { weekStartsOn: WEEK_STARTS_ON });
    const end = endOfWeek(weekAnchor, { weekStartsOn: WEEK_STARTS_ON });
    buckets.push({
      key: format(start, "yyyy-MM-dd"),
      label: format(start, "dd/MM"),
      count: completedInRange(tasks, { start, end }).length,
    });
  }
  return buckets;
}

export interface CategoryBreakdownItem {
  /** null represents tasks with no category assigned */
  category: Category | null;
  count: number;
}

/** Completed-task counts grouped by category, for the tasks already scoped to a period. */
export function getCategoryBreakdown(
  tasksInPeriod: Task[],
  categories: Category[]
): CategoryBreakdownItem[] {
  const counts = new Map<string | null, number>();
  for (const task of tasksInPeriod) {
    const key = task.categoryId ?? null;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const items: CategoryBreakdownItem[] = categories
    .map((category) => ({ category, count: counts.get(category.id) ?? 0 }))
    .filter((item) => item.count > 0);

  const uncategorizedCount = counts.get(null) ?? 0;
  if (uncategorizedCount > 0) {
    items.push({ category: null, count: uncategorizedCount });
  }

  return items.sort((a, b) => b.count - a.count);
}

export interface ReportSummary {
  totalCompleted: number;
  pomodorosInvested: number;
  averagePerBucket: number;
  bestBucket: ActivityBucket | null;
}

export function getReportSummary(
  tasksInPeriod: Task[],
  buckets: ActivityBucket[]
): ReportSummary {
  const totalCompleted = tasksInPeriod.length;
  const pomodorosInvested = tasksInPeriod.reduce((sum, t) => sum + t.pomodorosSpent, 0);
  const averagePerBucket = buckets.length > 0 ? totalCompleted / buckets.length : 0;
  const bestBucket = buckets.reduce<ActivityBucket | null>((best, bucket) => {
    if (bucket.count === 0) return best;
    if (!best || bucket.count > best.count) return bucket;
    return best;
  }, null);

  return { totalCompleted, pomodorosInvested, averagePerBucket, bestBucket };
}

/** Applies the category filter (if any) on top of the tasks already in the selected period. */
export function filterByCategory(tasks: Task[], categoryId: string | undefined): Task[] {
  if (!categoryId) return tasks;
  return tasks.filter((t) => t.categoryId === categoryId);
}
