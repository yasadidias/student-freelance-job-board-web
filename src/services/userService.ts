import type { ApiResponse, AdminStats, AvailabilitySlot, Pagination, Role, User } from "../types"
import { api } from "./api"

export interface UserList {
  users: User[]
  pagination: Pagination
}

export const userService = {
  updateName: async (name: string): Promise<User> => {
    const res = await api.put<ApiResponse<User>>("/users/me", { name })
    return res.data.data
  },
  saveAvailability: async (availability: AvailabilitySlot[]): Promise<User> => {
    const res = await api.put<ApiResponse<User>>("/users/me/availability", { availability })
    return res.data.data
  },
  // admin
  stats: async (): Promise<AdminStats> => {
    const res = await api.get<ApiResponse<AdminStats>>("/admin/stats")
    return res.data.data
  },
  list: async (params: { search?: string; page?: number }): Promise<UserList> => {
    const res = await api.get<ApiResponse<UserList>>("/admin/users", { params })
    return res.data.data
  },
  adminUpdate: async (id: string, changes: { isBlocked?: boolean; role?: Exclude<Role, "ADMIN"> }): Promise<User> => {
    const res = await api.patch<ApiResponse<User>>(`/admin/users/${id}`, changes)
    return res.data.data
  },
  adminDelete: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`)
  },
}