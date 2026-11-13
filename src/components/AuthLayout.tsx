import type { ReactNode } from "react"
import { AuthIllustration } from "./Illustrations"

const POINTS = [
  "Mark the hours you are free each week",
  "Clients see your timetable when you apply",
  "Get a short email when you are accepted",
]

// Shared shell for the login and register pages: a picture panel on the left, the form on the right.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
      <aside className="hero-grid hidden flex-col justify-between bg-ink p-8 text-white md:flex">
        <div>
          <h2 className="text-2xl font-bold leading-tight">Work that fits around your lectures.</h2>
          <ul className="mt-5 space-y-2.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-slate-200">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-hl text-ink">
                  <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true">
                    <path d="M2.5 6.3l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 h-52">
          <AuthIllustration />
        </div>
      </aside>
      <div className="p-6 sm:p-9">{children}</div>
    </div>
  )
}
