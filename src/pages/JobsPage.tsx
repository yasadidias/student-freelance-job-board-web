import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"
import CategoryIcon from "../components/CategoryIcon"
import HeroTimetable from "../components/HeroTimetable"
import HowItWorks from "../components/HowItWorks"
import { EmptyIllustration } from "../components/Illustrations"
import JobCard from "../components/JobCard"
import Pagination from "../components/Pagination"
import Spinner from "../components/Spinner"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchJobs } from "../store/jobsSlice"
import { JOB_CATEGORIES } from "../utils/constants"

export default function JobsPage() {
  const dispatch = useAppDispatch()
  const { items, pagination, loading, error } = useAppSelector((state) => state.jobs)
  const { user } = useAppSelector((state) => state.auth)

  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)

  // wait 400ms after the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    dispatch(
      fetchJobs({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: 8,
      })
    )
  }, [dispatch, search, category, page])

  const clearFilters = (): void => {
    setSearchInput("")
    setSearch("")
    setCategory("")
    setPage(1)
  }

  return (
    <div>
      <section className="hero-grid overflow-hidden rounded-2xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl">
              Paid work that fits around your lectures.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
              Browse small freelance jobs from local clients. Mark the hours you are free, and clients see exactly
              when you can start.
            </p>

            <div className="mt-7 max-w-md">
              <label htmlFor="job-search" className="sr-only">
                Search jobs
              </label>
              <input
                id="job-search"
                className="w-full rounded-md bg-white px-4 py-3 text-sm text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hl"
                placeholder="Search by job title or description"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {!user && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to="/register" className="btn-hl">
                  Create a free account
                </Link>
                <Link to="/login" className="text-sm font-semibold text-white underline underline-offset-4 hover:text-hl">
                  I already have one
                </Link>
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <HeroTimetable />
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["", ...JOB_CATEGORIES].map((c) => {
          const active = category === c
          return (
            <button
              key={c || "all"}
              aria-pressed={active}
              onClick={() => {
                setCategory(c)
                setPage(1)
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-ink"
              }`}
            >
              {c && <CategoryIcon category={c} variant="bare" size={16} />}
              {c || "All jobs"}
            </button>
          )
        })}
      </div>

      <div className="mb-3 mt-6 flex items-baseline justify-between">
        <h2 className="text-xl font-bold">Open jobs</h2>
        {!loading && (
          <p className="text-sm text-slate-500">
            {pagination.total} {pagination.total === 1 ? "job" : "jobs"}
          </p>
        )}
      </div>

      <Alert message={error} />

      {loading ? (
        <Spinner label="Loading jobs..." />
      ) : items.length === 0 ? (
        <div className="card py-10 text-center">
          <EmptyIllustration />
          <p className="mt-2 font-semibold">No jobs match that search.</p>
          <p className="mt-1 text-sm text-slate-500">Try a different word, or show every category.</p>
          <button className="btn-secondary mt-4" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <HowItWorks showSignup={!user} />
    </div>
  )
}
