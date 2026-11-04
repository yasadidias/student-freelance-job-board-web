import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import Logo from "./Logo"

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "border-brand text-ink"
      : "border-transparent text-slate-600 hover:text-ink"
  }`

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = (): void => {
    dispatch(logout())
    setOpen(false)
    navigate("/login")
  }

  const close = (): void => setOpen(false)

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" onClick={close} className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <Logo />
          Student Job Board
        </Link>

        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-slate-200 bg-white px-4 pb-4 pt-2 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:p-0`}
        >
          <NavLink to="/" end className={linkClass} onClick={close}>
            Browse jobs
          </NavLink>

          {user?.role === "USER" && (
            <>
              <NavLink to="/my-applications" className={linkClass} onClick={close}>
                My applications
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={close}>
                My free times
              </NavLink>
            </>
          )}
          {(user?.role === "MANAGER" || user?.role === "ADMIN") && (
            <NavLink to="/manage/jobs" className={linkClass} onClick={close}>
              My posted jobs
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={linkClass} onClick={close}>
              Admin
            </NavLink>
          )}

          {user ? (
            <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-3 md:mt-0 md:border-0 md:pl-2 md:pt-0">
              <Link to="/profile" onClick={close} className="text-sm font-medium text-ink">
                {user.name}
                <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                  {user.role === "MANAGER" ? "Client" : user.role === "USER" ? "Student" : "Admin"}
                </span>
              </Link>
              <button className="btn-secondary btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3 md:mt-0 md:border-0 md:pl-2 md:pt-0">
              <Link to="/login" className="btn-secondary btn-sm" onClick={close}>
                Log in
              </Link>
              <Link to="/register" className="btn-primary btn-sm" onClick={close}>
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}