import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Alert from "../components/Alert"
import { clearAuthError, login } from "../store/authSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { homeFor } from "../utils/roleHome"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  // already logged in (or just logged in) -> go to the right page
  useEffect(() => {
    if (user) navigate(from ?? homeFor(user.role), { replace: true })
  }, [user, from, navigate])

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    dispatch(login({ email: email.trim(), password }))
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-500">Login to apply for jobs or manage your postings.</p>
        <Alert message={error} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          New here?{" "}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}