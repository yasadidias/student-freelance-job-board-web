import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Alert from "../components/Alert"
import AvailabilityGrid from "../components/AvailabilityGrid"
import Spinner from "../components/Spinner"
import StatusBadge from "../components/StatusBadge"
import { getErrorMessage } from "../services/api"
import { applicationService } from "../services/applicationService"
import type { ApplicationStatus, Job, JobApplication } from "../types"
import { formatBudget, formatDate } from "../utils/format"

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>()

  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [openTimes, setOpenTimes] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    applicationService
      .forJob(id)
      .then((data) => {
        setJob(data.job)
        setApplications(data.applications)
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }, [id])

  const decide = async (
    application: JobApplication,
    status: Exclude<ApplicationStatus, "PENDING">
  ): Promise<void> => {
    setBusyId(application._id)
    setError(null)
    setMessage(null)
    try {
      await applicationService.setStatus(application._id, status)
      setApplications((prev) => prev.map((a) => (a._id === application._id ? { ...a, status } : a)))
      setMessage(`Application ${status.toLowerCase()}.`)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/manage/jobs" className="text-sm text-brand hover:underline">
        &larr; Back to my jobs
      </Link>

      {job && (
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-slate-500">
            {job.category} &middot; {formatBudget(job.budget)} &middot; Due {formatDate(job.deadline)} &middot;{" "}
            {applications.length} applicant(s)
          </p>
        </div>
      )}

      <Alert message={error} />
      <Alert type="success" message={message} />

      {applications.length === 0 && !error ? (
        <div className="card py-12 text-center text-slate-500">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{app.applicant.name}</p>
                  <p className="text-sm text-slate-500">
                    {app.applicant.email} &middot; Applied {formatDate(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {app.coverLetter}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {app.status === "PENDING" && (
                  <>
                    <button
                      className="btn-success btn-sm"
                      disabled={busyId === app._id}
                      onClick={() => decide(app, "ACCEPTED")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      disabled={busyId === app._id}
                      onClick={() => decide(app, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setOpenTimes(openTimes === app._id ? null : app._id)}
                >
                  {openTimes === app._id ? "Hide free times" : "View free times"}
                </button>
              </div>

              {openTimes === app._id && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {app.applicant.availability.length === 0 ? (
                    <p className="text-sm text-slate-500">This student has not added free times yet.</p>
                  ) : (
                    <AvailabilityGrid value={app.applicant.availability} readOnly />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}