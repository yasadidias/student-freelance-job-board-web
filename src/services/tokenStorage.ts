// Keeps the JWT tokens in localStorage so the user stays logged in after a refresh.
const ACCESS_KEY = "sfjb_access_token"
const REFRESH_KEY = "sfjb_refresh_token"

export const tokenStorage = {
  getAccess: (): string | null => localStorage.getItem(ACCESS_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),
  set: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
  },
  clear: (): void => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}