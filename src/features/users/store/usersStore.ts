import { create } from 'zustand'

import type { User } from '@/shared/types'

interface UsersState {
  users: User[]
  isLoading: boolean
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  removeUser: (id: number) => void
  setLoading: (loading: boolean) => void
}

export const useUsersStore = create<UsersState>()((set) => ({
  users: [],
  isLoading: false,
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
