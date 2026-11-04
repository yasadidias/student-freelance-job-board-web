import { Link } from "react-router-dom"
import type { Job } from "../types"
import { CATEGORY_COLORS } from "../utils/constants"
import { formatBudget, formatDeadline } from "../utils/format"
import StatusBadge from "./StatusBadge"

export default function JobCard({ job }: { job: Job }) {
  const poster = typeof job.postedBy === "string" ? null : job.postedBy
  const color = CATEGORY_COLORS[job.category] ?? "#6d4bc3"

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand sm:p-5"
    >
      <span aria-hidden="true" className="w-1 shrink-0 self-stretch rounded-full" style={{ backgroundColor: color }} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold" style={{ color }}>
          {job.category}
        </p>
        <h3 className="mt-0.5 text-lg font-semibold leading-snug text-ink group-hover:text-brand">{job.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{job.description}</p>
        {poster && <p className="mt-2 text-xs text-slate-500">Posted by {poster.name}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className="font-display text-lg font-bold text-ink">{formatBudget(job.budget)}</p>
        <p className="mt-1 text-xs text-slate-500">{formatDeadline(job.deadline)}</p>
        {job.status === "CLOSED" && (
          <div className="mt-2">
            <StatusBadge status="CLOSED" />
          </div>
        )}
      </div>
    </Link>
  )
}