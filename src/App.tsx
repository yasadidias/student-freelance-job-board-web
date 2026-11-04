import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminPage from "./pages/AdminPage"
import JobApplicationsPage from "./pages/JobApplicationsPage"
import JobDetailsPage from "./pages/JobDetailsPage"
import JobFormPage from "./pages/JobFormPage"
import JobsPage from "./pages/JobsPage"
import LoginPage from "./pages/LoginPage"
import ManageJobsPage from "./pages/ManageJobsPage"
import MyApplicationsPage from "./pages/MyApplicationsPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import RegisterPage from "./pages/RegisterPage"
import { tokenStorage } from "./services/tokenStorage"
import { fetchMe } from "./store/authSlice"
import { useAppDispatch } from "./store/hooks"

export default function App() {
  const dispatch = useAppDispatch()

  // If a token was saved earlier, load the logged-in user when the app opens
  useEffect(() => {
    if (tokenStorage.getAccess()) {
      dispatch(fetchMe())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Student only */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute roles={["USER"]}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Client (and admin) */}
          <Route
            path="/manage/jobs"
            element={
              <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
                <ManageJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/jobs/new"
            element={
              <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
                <JobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/jobs/:id/edit"
            element={
              <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
                <JobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/jobs/:id/applications"
            element={
              <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
                <JobApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}