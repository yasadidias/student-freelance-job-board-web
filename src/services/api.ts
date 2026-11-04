import axios, { AxiosError } from "axios"
import type { InternalAxiosRequestConfig } from "axios"
import type { ApiResponse } from "../types"
import { tokenStorage } from "./tokenStorage"

export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"

export const api = axios.create({ baseURL: API_URL })

// 1) Attach the access token to every request
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface RefreshData {
  accessToken: string
  refreshToken: string
}

// Uses plain axios (not "api") so the refresh call cannot trigger the interceptor again
const requestNewTokens = async (): Promise<string> => {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) {
    throw new Error("No refresh token")
  }
  const res = await axios.post<ApiResponse<RefreshData>>(`${API_URL}/auth/refresh`, {
    refreshToken,
  })
  const { accessToken, refreshToken: newRefresh } = res.data.data
  tokenStorage.set(accessToken, newRefresh)
  return accessToken
}

let refreshing: Promise<string> | null = null

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// 2) When the access token has expired (401), get a new one with the refresh token and retry once
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined
    const url = original?.url ?? ""
    const isAuthCall =
      url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh")

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall &&
      tokenStorage.getRefresh()
    ) {
      original._retry = true
      try {
        // several requests may fail at once - they all share one refresh call
        if (!refreshing) {
          refreshing = requestNewTokens().finally(() => {
            refreshing = null
          })
        }
        const newToken = await refreshing
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        tokenStorage.clear()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

// Turns any error into a readable message for the UI
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { message: string }[] }
      | undefined
    if (data?.errors && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(", ")
    }
    if (data?.message) {
      return data.message
    }
    if (!error.response) {
      return "Cannot reach the server. Check your internet or try again."
    }
  }
  return "Something went wrong. Please try again."
}