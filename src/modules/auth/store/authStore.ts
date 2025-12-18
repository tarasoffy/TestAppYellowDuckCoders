import { create } from 'zustand'
import { readSession, clearSession } from '../api/authStorage'
import type { TAuthSession } from '../api/authStorage'

type TAuthState = {
  session: TAuthSession | null
  isAuth: boolean
  isLoading: boolean

  init: () => Promise<void>
  setSession: (session: TAuthSession) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<TAuthState>((set) => ({
  session: null,
  isAuth: false,
  isLoading: true,

  init: async () => {
    const session = await readSession()
    set({
      session,
      isAuth: !!session,
      isLoading: false,
    })
  },

  setSession: (session) => {
    set({ session, isAuth: true })
  },

  logout: async () => {
    await clearSession()
    set({ session: null, isAuth: false })
  },
}))