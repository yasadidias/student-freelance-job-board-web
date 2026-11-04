import type { ApiResponse } from "../types"
import { api } from "./api"

export interface CoverLetterResult {
  text: string
  source: "ai" | "template"
}

export const aiService = {
  coverLetter: async (jobId: string, notes?: string): Promise<CoverLetterResult> => {
    const res = await api.post<ApiResponse<CoverLetterResult>>("/ai/cover-letter", {
      jobId,
      notes: notes || undefined,
    })
    return res.data.data
  },
}