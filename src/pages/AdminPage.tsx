import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"
import Pagination from "../components/Pagination"
import Spinner from "../components/Spinner"
import StatusBadge from "../components/StatusBadge"
import { getErrorMessage } from "../services/api"
import { jobService } from "../services/jobService"
import { userService } from "../services/userService"
import { useAppSelector } from "../store/hooks"
import type { AdminStats, Job, Pagination as PaginationInfo, User } from "../types"
import { formatBudget, formatDate } from "../utils/format"

type Tab = "overview" | "users" | "jobs"

const emptyPagination: PaginationInfo = { page: 1, limit: 10, total: 0, totalPages: 1 }

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card text-center">
      <p className="font-display text-3xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function OverviewTab() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    userService
      .stats()
      .then(setStats)
      .catch((e: unknown) => setError(getErrorMessage(e)))
  }, [])

  if (error) return <Alert message={error} />
  if (!stats) return <Spinner />

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total users" value={stats.users} />
      <StatCard label="Students" value={stats.students} />
      <StatCard label="Clients" value={stats.managers} />
      <StatCard label="Total jobs" value={stats.jobs} />
      <StatCard label="Open jobs" value={stats.openJobs} />
      <StatCard label="Applications" value={stats.applications} />
    </div>
  )
}

function UsersTab() {
  const { user: me } = useAppSelector((state) => state.auth)
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>(emptyPagination)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await userService.list({ search: search || undefined, page })
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    load()
  }, [load])

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const toggleBlock = async (target: User): Promise<void> => {
    setError(null)
    try {
      const updated = await userService.adminUpdate(target.id, { isBlocked: !target.isBlocked })
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const remove = async (target: User): Promise<void> => {
    if (!window.confirm(`Delete ${target.name} and everything they posted?`)) return
    setError(null)
    try {
      await userService.adminDelete(target.id)
      setUsers((prev) => prev.filter((u) => u.id !== target.id))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          className="input"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn-primary">Search</button>
      </form>
      <Alert message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const locked = u.role === "ADMIN" || u.id === me?.id
                return (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "MANAGER" ? "Client" : u.role === "USER" ? "Student" : "Admin"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                          u.isBlocked ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {locked ? (
                        <span className="text-xs text-slate-400">protected</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button className="btn-secondary btn-sm" onClick={() => toggleBlock(u)}>
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button className="btn-danger btn-sm" onClick={() => remove(u)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>(emptyPagination)
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("OPEN")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await jobService.list({ status, page, limit: 10 })
      setJobs(data.jobs)
      setPagination(data.pagination)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (job: Job): Promise<void> => {
    if (!window.confirm(`Remove "${job.title}"? This also deletes its applications.`)) return
    setError(null)
    try {
      await jobService.remove(job._id)
      setJobs((prev) => prev.filter((j) => j._id !== job._id))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-slate-600" htmlFor="job-status">
          Show
        </label>
        <select
          id="job-status"
          className="input w-40"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "OPEN" | "CLOSED")
            setPage(1)
          }}
        >
          <option value="OPEN">Open jobs</option>
          <option value="CLOSED">Closed jobs</option>
        </select>
      </div>
      <Alert message={error} />

      {loading ? (
        <Spinner />
      ) : jobs.length === 0 ? (
        <div className="card py-10 text-center text-slate-500">No jobs here.</div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const poster = typeof job.postedBy === "string" ? null : job.postedBy
            return (
              <div key={job._id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link to={`/jobs/${job._id}`} className="font-semibold hover:text-brand">
                    {job.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {job.category} &middot; {formatBudget(job.budget)}
                    {poster && <> &middot; by {poster.name}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={job.status} />
                  <button className="btn-danger btn-sm" onClick={() => remove(job)}>
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview")
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "jobs", label: "Job moderation" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin dashboard</h1>
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-brand text-brand-dark"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "jobs" && <JobsTab />}
    </div>
  )
}