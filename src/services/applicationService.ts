import type {
  ApiResponse,
  ApplicationStatus,
  Job,
  JobApplication,
  MyApplication,
} from "../types"
import { api } from "./api"

export const applicationService = {
  apply: async (jobId: string, coverLetter: string): Promise<void> => {
    await api.post("/applications", { jobId, coverLetter })
  },
  mine: async (): Promise<MyApplication[]> => {
    const res = await api.get<ApiResponse<MyApplication[]>>("/applications/mine")
    return res.data.data
  },
  withdraw: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`)
  },
  forJob: async (jobId: string): Promise<{ job: Job; applications: JobApplication[] }> => {
    const res = await api.get<ApiResponse<{ job: Job; applications: JobApplication[] }>>(
      `/applications/job/${jobId}`
    )
    return res.data.data
  },
  setStatus: async (id: string, status: Exclude<ApplicationStatus, "PENDING">): Promise<void> => {
    await api.patch(`/applications/${id}/status`, { status })
  },
}