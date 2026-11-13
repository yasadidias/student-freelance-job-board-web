import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { FindJobIllustration, FreeHoursIllustration, GetHiredIllustration } from "./Illustrations"

interface Step {
  number: string
  title: string
  text: string
  picture: ReactNode
}

const STEPS: Step[] = [
  {
    number: "1",
    title: "Mark your free hours",
    text: "Fill in your weekly timetable once. Yellow cells show clients when you can actually work.",
    picture: <FreeHoursIllustration />,
  },
  {
    number: "2",
    title: "Find a job you like",
    text: "Search small jobs by category: design, tutoring, writing, data entry and more.",
    picture: <FindJobIllustration />,
  },
  {
    number: "3",
    title: "Apply and get hired",
    text: "Send a cover letter (the AI helper can draft one). You get an email when the client replies.",
    picture: <GetHiredIllustration />,
  },
]

export default function HowItWorks({ showSignup }: { showSignup: boolean }) {
  return (
    <section className="mt-14" aria-labelledby="how-heading">
      <h2 id="how-heading" className="text-2xl font-bold">
        How it works
      </h2>
      <p className="mt-1 text-sm text-slate-500">Three small steps from your timetable to your first paid job.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-36 overflow-hidden rounded-lg">{step.picture}</div>
            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-hl">
                {step.number}
              </span>
              <div>
                <h3 className="text-base font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSignup && (
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <h3 className="text-xl font-bold">Hiring a student for a small job?</h3>
            <p className="mt-1 text-sm text-white/80">Post it free, then read applications and see when each student is free.</p>
          </div>
          <Link to="/register" className="btn-hl shrink-0">
            Post your first job
          </Link>
        </div>
      )}
    </section>
  )
}
