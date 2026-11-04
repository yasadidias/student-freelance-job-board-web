import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import { getErrorMessage } from "../services/api"
import { jobService } from "../services/jobService"
import { JOB_CATEGORIES } from "../utils/constants"
import { toDateInput, tomorrowInput } from "../utils/format"

// Used for both "post a new job" and "edit a job"
export default function JobFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>(JOB_CATEGORIES[0])
  const [budget, setBudget] = useState("")
  const [deadline, setDeadline] = useState(tomorrowInput())
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("OPEN")

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    jobService
      .get(id)
      .then((job) => {
        setTitle(job.title)
        setDescription(job.description)
        setCategory(job.category)
        setBudget(String(job.budget))
        setDeadline(toDateInput(job.deadline))
        setStatus(job.status)
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    if (title.trim().length < 5) return setError("Title must be at least 5 characters")
    if (description.trim().length < 20) return setError("Description must be at least 20 characters")
    if (budget === "" || Number(budget) < 0) return setError("Enter a valid budget")

    setSaving(true)
    try {
      const input = {
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        deadline,
      }
      if (id) {
        await jobService.update(id, { ...input, status })
      } else {
        await jobService.create(input)
      }
      navigate("/manage/jobs")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/manage/jobs" className="text-sm text-brand hover:underline">
        &larr; Back to my jobs
      </Link>
      <form onSubmit={handleSubmit} className="card mt-4 space-y-4">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit job" : "Post a new job"}</h1>
        <Alert message={error} />

        <div>
          <label className="label" htmlFor="title">
            Job title
          </label>
          <input
            id="title"
            className="input"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design a logo for my coffee shop"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input min-h-[160px]"
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work, what you expect and any requirements (at least 20 characters)"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="budget">
              Budget (Rs.)
            </label>
            <input
              id="budget"
              type="number"
              min={0}
              className="input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="deadline">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              className="input"
              value={deadline}
              min={tomorrowInput()}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>

        {isEdit && (
          <div>
            <label className="label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="input sm:w-48"
              value={status}
              onChange={(e) => setStatus(e.target.value as "OPEN" | "CLOSED")}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Post job"}
          </button>
          <Link to="/manage/jobs" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}