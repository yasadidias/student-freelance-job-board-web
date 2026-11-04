import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import StatusBadge from "../components/StatusBadge"
import { getErrorMessage } from "../services/api"
import { jobService } from "../services/jobService"
import type { Job } from "../types"
import { formatBudget, formatDate } from "../utils/format"

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async (): Promise<void> => {
    try {
      setJobs(await jobService.mine())
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleStatus = async (job: Job): Promise<void> => {
    try {
      const status = job.status === "OPEN" ? "CLOSED" : "OPEN"
      await jobService.update(job._id, { status })
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status } : j)))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const remove = async (job: Job): Promise<void> => {
    if (!window.confirm(`Delete "${job.title}" and all its applications?`)) return
    try {
      await jobService.remove(job._id)
      setJobs((prev) => prev.filter((j) => j._id !== job._id))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My posted jobs</h1>
        <Link to="/manage/jobs/new" className="btn-primary">
          Post a new job
        </Link>
      </div>
      <Alert message={error} />

      {loading ? (
        <Spinner />
      ) : jobs.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="font-semibold">You have not posted any jobs yet.</p>
          <p className="mt-1 text-sm text-slate-500">Post your first job and students can start applying.</p>
          <Link to="/manage/jobs/new" className="btn-primary mt-4">
            Post a new job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-brand"
                  >
                    {job.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {job.category} &middot; {formatBudget(job.budget)} &middot; Due {formatDate(job.deadline)}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/manage/jobs/${job._id}/applications`} className="btn-primary btn-sm">
                  Applicants ({job.applicationCount ?? 0})
                </Link>
                <Link to={`/manage/jobs/${job._id}/edit`} className="btn-secondary btn-sm">
                  Edit
                </Link>
                <button className="btn-secondary btn-sm" onClick={() => toggleStatus(job)}>
                  {job.status === "OPEN" ? "Close job" : "Re-open job"}
                </button>
                <button className="btn-danger btn-sm" onClick={() => remove(job)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}