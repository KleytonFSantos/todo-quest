import { format, differenceInCalendarDays } from "date-fns";

/** yyyy-MM-dd, used as the canonical "day key" for streak calculations */
export function todayKey(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function daysBetweenKeys(a: string, b: string): number {
  return differenceInCalendarDays(new Date(b), new Date(a));
}
