import { Link } from "react-router-dom"
import type { Job } from "../types"
import { CATEGORY_COLORS } from "../utils/constants"
import { formatBudget, formatDeadline } from "../utils/format"
import CategoryIcon from "./CategoryIcon"
import StatusBadge from "./StatusBadge"

export default function JobCard({ job }: { job: Job }) {
  const poster = typeof job.postedBy === "string" ? null : job.postedBy
  const color = CATEGORY_COLORS[job.category] ?? CATEGORY_COLORS.Other

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md hover:shadow-brand/10 sm:p-5"
    >
      <CategoryIcon category={job.category} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold" style={{ color }}>
          {job.category}
        </p>
        <h3 className="mt-0.5 text-lg font-semibold leading-snug text-ink group-hover:text-brand">{job.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{job.description}</p>
        {poster && (
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand"
            >
              {poster.name.charAt(0).toUpperCase()}
            </span>
            Posted by {poster.name}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="rounded-md bg-hl/40 px-2 py-0.5 font-display text-base font-bold text-ink">{formatBudget(job.budget)}</p>
        <p className="mt-1.5 text-xs text-slate-500">{formatDeadline(job.deadline)}</p>
        {job.status === "CLOSED" && (
          <div className="mt-2">
            <StatusBadge status="CLOSED" />
          </div>
        )}
      </div>
    </Link>
  )
}
