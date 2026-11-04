import { useEffect } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import StatusBadge from "../components/StatusBadge"
import { fetchMyApplications, withdrawApplication } from "../store/applicationsSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { formatBudget, formatDate } from "../utils/format"

export default function MyApplicationsPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.applications)

  useEffect(() => {
    dispatch(fetchMyApplications())
  }, [dispatch])

  const handleWithdraw = (id: string): void => {
    if (window.confirm("Withdraw this application?")) {
      dispatch(withdrawApplication(id))
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My applications</h1>
      <Alert message={error} />

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="card py-12 text-center text-slate-500">
          You have not applied for any jobs yet.{" "}
          <Link to="/" className="font-medium text-brand hover:underline">
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((app) => (
            <div key={app._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-brand"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {app.job.category} &middot; {formatBudget(app.job.budget)} &middot; Applied{" "}
                    {formatDate(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-slate-600">
                {app.coverLetter}
              </p>
              {app.status === "PENDING" && (
                <button className="btn-secondary btn-sm mt-4" onClick={() => handleWithdraw(app._id)}>
                  Withdraw
                </button>
              )}
              {app.status === "ACCEPTED" && (
                <p className="mt-3 text-sm font-medium text-emerald-700">
                  Congratulations! The client accepted your application.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}