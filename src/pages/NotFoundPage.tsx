import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
      <p className="mt-1 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to jobs
      </Link>
    </div>
  )
}