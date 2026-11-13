import { Link, Outlet } from "react-router-dom"
import Logo from "./Logo"
import Navbar from "./Navbar"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-ink">
            <Logo size={24} />
            Student Job Board
          </Link>
          <p className="text-center">Small jobs for students, paid work that fits around lectures.</p>
          <p className="text-xs">ITS2020 Rapid Application Development</p>
        </div>
      </footer>
    </div>
  )
}
