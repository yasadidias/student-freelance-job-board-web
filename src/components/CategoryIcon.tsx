import type { ReactNode } from "react"
import { CATEGORY_COLORS } from "../utils/constants"

// Small original line icons, one per job category. Drawn on a 24x24 grid.
const ICONS: Record<string, ReactNode> = {
  // pen nib
  Design: (
    <>
      <path d="M12 3l5 9-5 9-5-9 5-9z" />
      <circle cx="12" cy="12" r="1.6" />
      <path d="M12 13.6V21" />
    </>
  ),
  // open book
  Tutoring: (
    <>
      <path d="M3 5.5c3-1.2 6-1 9 1v13c-3-2-6-2.2-9-1v-13z" />
      <path d="M21 5.5c-3-1.2-6-1-9 1v13c3-2 6-2.2 9-1v-13z" />
    </>
  ),
  // table / rows
  "Data Entry": (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M3.5 15h17M9.5 4.5v15" />
    </>
  ),
  // pencil on a page
  Writing: (
    <>
      <path d="M5 4.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V6a1.5 1.5 0 0 1 1-1.5z" />
      <path d="M8 13h8M8 16.5h5" />
    </>
  ),
  // code brackets
  Development: (
    <>
      <path d="M8.5 7L3.5 12l5 5" />
      <path d="M15.5 7l5 5-5 5" />
      <path d="M13.2 5l-2.4 14" />
    </>
  ),
  // sparkle
  Other: (
    <>
      <path d="M12 3.5l2.2 5.3 5.3 2.2-5.3 2.2L12 18.5l-2.2-5.3L4.5 11l5.3-2.2L12 3.5z" />
      <path d="M18.5 17v3.5M16.75 18.75h3.5" />
    </>
  ),
}

interface Props {
  category: string
  /** "tile" = coloured rounded square (job cards). "bare" = icon only (filter chips). */
  variant?: "tile" | "bare"
  size?: number
}

export default function CategoryIcon({ category, variant = "tile", size = 44 }: Props) {
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other
  const shape = ICONS[category] ?? ICONS.Other

  if (variant === "bare") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {shape}
      </svg>
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: size, height: size, backgroundColor: `${color}14`, color }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shape}
      </svg>
    </span>
  )
}
