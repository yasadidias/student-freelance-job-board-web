export type Role = "ADMIN" | "MANAGER" | "USER"

export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"

export interface AvailabilitySlot {
  day: Day
  hour: number
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  isBlocked: boolean
  availability: AvailabilitySlot[]
  createdAt: string
}

export type JobStatus = "OPEN" | "CLOSED"

export interface Poster {
  _id: string
  name: string
  email: string
}

export interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: number
  deadline: string
  status: JobStatus
  postedBy: Poster | string
  createdAt: string
  applicationCount?: number
}

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED"

export interface JobSummary {
  _id: string
  title: string
  category: string
  budget: number
  deadline: string
  status: JobStatus
}

// An application as seen by the student (job is populated)
export interface MyApplication {
  _id: string
  job: JobSummary
  coverLetter: string
  status: ApplicationStatus
  createdAt: string
}

export interface Applicant {
  _id: string
  name: string
  email: string
  availability: AvailabilitySlot[]
}

// An application as seen by the client (applicant is populated)
export interface JobApplication {
  _id: string
  applicant: Applicant
  coverLetter: string
  status: ApplicationStatus
  createdAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AdminStats {
  users: number
  managers: number
  students: number
  jobs: number
  openJobs: number
  applications: number
}