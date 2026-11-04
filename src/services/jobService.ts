import type { ApiResponse, Job, Pagination } from "../types"
import { api } from "./api"

export interface JobQuery {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}

export interface JobInput {
  title: string
  description: string
  category: string
  budget: number
  deadline: string
  status?: "OPEN" | "CLOSED"
}

export interface JobList {
  jobs: Job[]
  pagination: Pagination
}

export const jobService = {
  list: async (query: JobQuery): Promise<JobList> => {
    const res = await api.get<ApiResponse<JobList>>("/jobs", { params: query })
    return res.data.data
  },
  get: async (id: string): Promise<Job> => {
    const res = await api.get<ApiResponse<Job>>(`/jobs/${id}`)
    return res.data.data
  },
  mine: async (): Promise<Job[]> => {
    const res = await api.get<ApiResponse<Job[]>>("/jobs/mine")
    return res.data.data
  },
  create: async (input: JobInput): Promise<Job> => {
    const res = await api.post<ApiResponse<Job>>("/jobs", input)
    return res.data.data
  },
  update: async (id: string, input: Partial<JobInput>): Promise<Job> => {
    const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, input)
    return res.data.data
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`)
  },
}