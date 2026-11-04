import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "../store/hooks"
import type { Role } from "../types"
import Spinner from "./Spinner"

interface ProtectedRouteProps {
  roles?: Role[]
  children: ReactNode
}

// Only lets logged-in users (with an allowed role) see the page
export default function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user, initialized } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized) return <Spinner />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return <>{children}</>
}