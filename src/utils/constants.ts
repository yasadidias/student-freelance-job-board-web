import type { Day } from "../types"

export const JOB_CATEGORIES = [
  "Design",
  "Tutoring",
  "Data Entry",
  "Writing",
  "Development",
  "Other",
] as const

export const DAYS: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

export const DAY_LABELS: Record<Day, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
}

// The timetable shows 7am to 10pm (each cell = one hour)
export const HOURS: number[] = Array.from({ length: 16 }, (_, i) => i + 7)

// One colour per job category (all readable on white)
export const CATEGORY_COLORS: Record<string, string> = {
  Design: "#c2306f",
  Tutoring: "#15805a",
  "Data Entry": "#55657a",
  Writing: "#99600a",
  Development: "#2b50e6",
  Other: "#6d4bc3",
}