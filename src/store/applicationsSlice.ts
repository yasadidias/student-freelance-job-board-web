import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getErrorMessage } from "../services/api"
import { applicationService } from "../services/applicationService"
import type { MyApplication } from "../types"

interface ApplicationsState {
  items: MyApplication[]
  loading: boolean
  error: string | null
}

const initialState: ApplicationsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchMyApplications = createAsyncThunk<MyApplication[], void, { rejectValue: string }>(
  "applications/fetchMine",
  async (_arg, { rejectWithValue }) => {
    try {
      return await applicationService.mine()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const withdrawApplication = createAsyncThunk<string, string, { rejectValue: string }>(
  "applications/withdraw",
  async (id, { rejectWithValue }) => {
    try {
      await applicationService.withdraw(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Could not load applications"
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload)
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.error = action.payload ?? "Could not withdraw application"
      })
  },
})

export default applicationsSlice.reducer