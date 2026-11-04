import type { Pagination as PaginationInfo } from "../types"

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (pagination.totalPages <= 1) return null
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        className="btn-secondary btn-sm"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        className="btn-secondary btn-sm"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  )
}