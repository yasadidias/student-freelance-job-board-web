import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getErrorMessage } from "../services/api"
import { jobService } from "../services/jobService"
import type { JobList, JobQuery } from "../services/jobService"
import type { Job, Pagination } from "../types"

interface JobsState {
  items: Job[]
  pagination: Pagination
  loading: boolean
  error: string | null
}

const initialState: JobsState = {
  items: [],
  pagination: { page: 1, limit: 9, total: 0, totalPages: 1 },
  loading: false,
  error: null,
}

export const fetchJobs = createAsyncThunk<JobList, JobQuery, { rejectValue: string }>(
  "jobs/fetch",
  async (query, { rejectWithValue }) => {
    try {
      return await jobService.list(query)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.jobs
        state.pagination = action.payload.pagination
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Could not load jobs"
      })
  },
})

export default jobsSlice.reducer