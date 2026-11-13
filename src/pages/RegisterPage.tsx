import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alert from "../components/Alert"
import AuthLayout from "../components/AuthLayout"
import { clearAuthError, register } from "../store/authSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { homeFor } from "../utils/roleHome"

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"USER" | "MANAGER">("USER")
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (user) navigate(homeFor(user.role), { replace: true })
  }, [user, navigate])

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setFormError("Password must be at least 8 characters with a letter and a number")
      return
    }
    setFormError(null)
    dispatch(register({ name: name.trim(), email: email.trim(), password, role }))
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm text-slate-500">It takes less than a minute.</p>
        <Alert message={formError ?? error} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="label">I am a...</span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "USER", title: "Student", text: "I want to find jobs" },
                  { value: "MANAGER", title: "Client", text: "I want to post jobs" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  aria-pressed={role === option.value}
                  className={`rounded-lg border p-3 text-left ${
                    role === option.value
                      ? "border-brand bg-brand-soft ring-2 ring-brand/25"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-semibold">{option.title}</span>
                  <span className="block text-xs text-slate-500">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
              autoComplete="name"
            />
          </div>
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
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-slate-400">At least 8 characters, with a letter and a number.</p>
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
