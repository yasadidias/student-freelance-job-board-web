import { useEffect, useState } from "react"
import type { AvailabilitySlot, Day } from "../types"
import { DAYS, DAY_LABELS, HOURS } from "../utils/constants"
import { formatHour } from "../utils/format"

interface AvailabilityGridProps {
  value: AvailabilitySlot[]
  onChange?: (slots: AvailabilitySlot[]) => void
  readOnly?: boolean
}

// Weekly timetable: columns = days, rows = hours. Yellow = "I am free".
// Click an hour, or press and drag across several hours to paint them.
export default function AvailabilityGrid({ value, onChange, readOnly = false }: AvailabilityGridProps) {
  // null = not dragging, true = painting free hours, false = erasing
  const [paint, setPaint] = useState<boolean | null>(null)

  useEffect(() => {
    const stop = (): void => setPaint(null)
    window.addEventListener("mouseup", stop)
    return () => window.removeEventListener("mouseup", stop)
  }, [])

  const isFree = (day: Day, hour: number): boolean =>
    value.some((slot) => slot.day === day && slot.hour === hour)

  const setCell = (day: Day, hour: number, free: boolean): void => {
    if (readOnly || !onChange) return
    if (isFree(day, hour) === free) return
    if (free) {
      onChange([...value, { day, hour }])
    } else {
      onChange(value.filter((slot) => !(slot.day === day && slot.hour === hour)))
    }
  }

  // Select / clear a whole day column
  const toggleDay = (day: Day): void => {
    if (readOnly || !onChange) return
    const allFree = HOURS.every((hour) => isFree(day, hour))
    const others = value.filter((slot) => slot.day !== day)
    onChange(allFree ? others : [...others, ...HOURS.map((hour) => ({ day, hour }))])
  }

  return (
    <div className="select-none overflow-x-auto">
      <table className="w-full min-w-[480px] border-separate border-spacing-1 text-center text-xs">
        <thead>
          <tr>
            <th className="w-12" />
            {DAYS.map((day) => (
              <th key={day} className="font-semibold text-slate-600">
                {readOnly ? (
                  DAY_LABELS[day]
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    className="rounded px-1.5 py-0.5 hover:bg-slate-100"
                    title={`Select or clear all of ${DAY_LABELS[day]}`}
                  >
                    {DAY_LABELS[day]}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="pr-1 text-right text-slate-500">{formatHour(hour)}</td>
              {DAYS.map((day) => {
                const free = isFree(day, hour)
                return (
                  <td key={day}>
                    <button
                      type="button"
                      disabled={readOnly}
                      aria-label={`${DAY_LABELS[day]} ${formatHour(hour)}, ${free ? "free" : "busy"}`}
                      aria-pressed={free}
                      onMouseDown={() => {
                        const next = !free
                        setPaint(next)
                        setCell(day, hour, next)
                      }}
                      onMouseEnter={() => {
                        if (paint !== null) setCell(day, hour, paint)
                      }}
                      // keyboard (Enter / Space) clicks have detail 0; mouse clicks are handled above
                      onClick={(e) => {
                        if (e.detail === 0) setCell(day, hour, !free)
                      }}
                      className={`flex h-7 w-full items-center justify-center rounded ${
                        free ? "bg-hl" : "bg-slate-100"
                      } ${readOnly ? "cursor-default" : "cursor-pointer hover:ring-2 hover:ring-brand/40"}`}
                    >
                      {free && <span className="block h-1.5 w-1.5 rounded-full bg-ink" />}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-hl" /> Free
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-slate-100 ring-1 ring-slate-200" /> Busy
        </span>
      </div>
    </div>
  )
}