const styles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  ACCEPTED: "bg-emerald-100 text-emerald-900",
  REJECTED: "bg-red-100 text-red-900",
  OPEN: "bg-emerald-100 text-emerald-900",
  CLOSED: "bg-slate-200 text-slate-700",
}

const labels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  OPEN: "Open",
  CLOSED: "Closed",
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}