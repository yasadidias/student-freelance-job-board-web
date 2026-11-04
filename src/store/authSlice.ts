import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { api, getErrorMessage } from "../services/api"
import { tokenStorage } from "../services/tokenStorage"
import type { ApiResponse, Role, User } from "../types"

interface LoginData {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
  role: Exclude<Role, "ADMIN">
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  // false while we are still checking a saved token on page load
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: tokenStorage.getAccess() === null,
}

export const login = createAsyncThunk<User, LoginInput, { rejectValue: string }>(
  "auth/login",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<LoginData>>("/auth/login", input)
      const { user, accessToken, refreshToken } = res.data.data
      tokenStorage.set(accessToken, refreshToken)
      return user
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const register = createAsyncThunk<User, RegisterInput, { rejectValue: string }>(
  "auth/register",
  async (input, { rejectWithValue }) => {
    try {
      await api.post("/auth/register", input)
      // log the new user in straight away
      const res = await api.post<ApiResponse<LoginData>>("/auth/login", {
        email: input.email,
        password: input.password,
      })
      const { user, accessToken, refreshToken } = res.data.data
      tokenStorage.set(accessToken, refreshToken)
      return user
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Called once when the app opens: restores the user from the saved token
export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<User>>("/auth/me")
      return res.data.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      tokenStorage.clear()
      state.user = null
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.initialized = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Login failed"
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.initialized = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Registration failed"
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.initialized = true
      })
      .addCase(fetchMe.rejected, (state) => {
        tokenStorage.clear()
        state.user = null
        state.initialized = true
      })
  },
})

export const { logout, clearAuthError, setUser } = authSlice.actions
export default authSlice.reducer