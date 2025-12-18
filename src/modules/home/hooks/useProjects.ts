import { useCallback, useEffect, useState } from 'react'
import type { TAuthSession } from '../../auth/api/authStorage'
import { fetchProjects, TJiraProject } from '../api/projectsApi'

export const useProjects = (session: TAuthSession | null) => {
  const [projects, setProjects] = useState<TJiraProject[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const load = useCallback(async (mode: 'init' | 'refresh' = 'init') => {
    if (!session) return
    setErrorText(null)

    if (mode === 'refresh') setRefreshing(true)
    else setLoading(true)

    try {
      const data = await fetchProjects(session)
      setProjects(data)
    } catch (e: any) {
      setErrorText(e?.message ?? 'Failed to load projects.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [session])

  useEffect(() => {
    load('init')
  }, [load])

  return { projects, loading, refreshing, errorText, refresh: () => load('refresh') }
}