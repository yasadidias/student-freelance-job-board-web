export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export const formatBudget = (amount: number): string =>
  `Rs. ${amount.toLocaleString("en-LK")}`

export const formatHour = (hour: number): string => {
  const suffix = hour >= 12 ? "pm" : "am"
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}${suffix}`
}

// date for <input type="date"> (yyyy-mm-dd)
export const toDateInput = (iso: string): string => iso.slice(0, 10)

export const tomorrowInput = (): string => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

// "Due in 5 days" for near deadlines, otherwise "Due 12 Nov 2026"
export const formatDeadline = (iso: string): string => {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (days < 0) return "Deadline passed"
  if (days === 0) return "Due today"
  if (days === 1) return "Due tomorrow"
  if (days <= 14) return `Due in ${days} days`
  return `Due ${formatDate(iso)}`
}