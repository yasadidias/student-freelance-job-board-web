import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import StatusBadge from "../components/StatusBadge"
import { getErrorMessage } from "../services/api"
import { aiService } from "../services/aiService"
import { applicationService } from "../services/applicationService"
import { jobService } from "../services/jobService"
import { useAppSelector } from "../store/hooks"
import type { Job } from "../types"
import { formatBudget, formatDate } from "../utils/format"

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [notes, setNotes] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiInfo, setAiInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    jobService
      .get(id)
      .then((data) => {
        if (!cancelled) setJob(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getErrorMessage(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleGenerate = async (): Promise<void> => {
    if (!job) return
    setAiLoading(true)
    setFormError(null)
    setAiInfo(null)
    try {
      const result = await aiService.coverLetter(job._id, notes)
      setCoverLetter(result.text)
      setAiInfo(
        result.source === "ai"
          ? "Written by AI. Please read it and edit it before sending."
          : "AI is not configured, so a simple template was used. Edit it before sending."
      )
    } catch (e) {
      setFormError(getErrorMessage(e))
    } finally {
      setAiLoading(false)
    }
  }

  const handleApply = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!job) return
    if (coverLetter.trim().length < 20) {
      setFormError("Cover letter must be at least 20 characters")
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      await applicationService.apply(job._id, coverLetter.trim())
      navigate("/my-applications")
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !job) {
    return (
      <div>
        <Alert message={error ?? "Job not found"} />
        <Link to="/" className="btn-secondary">
          Back to jobs
        </Link>
      </div>
    )
  }

  const poster = typeof job.postedBy === "string" ? null : job.postedBy
  const deadlinePassed = new Date(job.deadline).getTime() < Date.now()
  const canApply = job.status === "OPEN" && !deadlinePassed
  const isOwner = user && poster && user.id === poster._id

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm text-brand hover:underline">
        &larr; Back to jobs
      </Link>

      <article className="card mt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
            {job.category}
          </span>
          <StatusBadge status={job.status} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
          <span>
            Budget: <strong className="text-slate-900">{formatBudget(job.budget)}</strong>
          </span>
          <span>
            Deadline: <strong className="text-slate-900">{formatDate(job.deadline)}</strong>
          </span>
          {poster && <span>Posted by: {poster.name}</span>}
        </div>
        <p className="mt-5 whitespace-pre-line text-slate-700">{job.description}</p>
      </article>

      <section className="mt-6">
        {!user && (
          <div className="card text-center">
            <p className="mb-3 text-slate-600">Login as a student to apply for this job.</p>
            <Link to="/login" state={{ from: `/jobs/${job._id}` }} className="btn-primary">
              Login to apply
            </Link>
          </div>
        )}

        {user && user.role !== "USER" && (
          <div className="card flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">Only students can apply for jobs.</p>
            {(isOwner || user.role === "ADMIN") && (
              <Link to={`/manage/jobs/${job._id}/applications`} className="btn-primary btn-sm">
                View applicants
              </Link>
            )}
          </div>
        )}

        {user?.role === "USER" && !canApply && (
          <Alert type="info" message="This job is no longer accepting applications." />
        )}

        {user?.role === "USER" && canApply && (
          <form onSubmit={handleApply} className="card space-y-4">
            <h2 className="text-lg font-semibold">Apply for this job</h2>
            <Alert message={formError} />
            <Alert type="info" message={aiInfo} />

            <div>
              <label className="label" htmlFor="notes">
                Your skills / experience (optional - helps the AI)
              </label>
              <input
                id="notes"
                className="input"
                placeholder="e.g. I know Photoshop and made 3 logos for my uni club"
                value={notes}
                maxLength={500}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0" htmlFor="coverLetter">
                  Cover letter
                </label>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={handleGenerate}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Writing..." : "Write with AI"}
                </button>
              </div>
              <textarea
                id="coverLetter"
                className="input min-h-[180px]"
                placeholder="Tell the client why you are the right person for this job..."
                value={coverLetter}
                maxLength={2000}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <p className="mt-1 text-right text-xs text-slate-400">{coverLetter.length}/2000</p>
            </div>

            <p className="text-xs text-slate-500">
              The client will also see your weekly free times.{" "}
              <Link to="/profile" className="text-brand hover:underline">
                Update my free times
              </Link>
            </p>

            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}