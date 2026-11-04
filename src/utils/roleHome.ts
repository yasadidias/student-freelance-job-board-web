import type { Role } from "../types"

// Where each role lands after login
export const homeFor = (role: Role): string => {
  if (role === "ADMIN") return "/admin"
  if (role === "MANAGER") return "/manage/jobs"
  return "/"
}