import { createApiClient } from '../../common/services/axios.config'
import type { TAuthSession } from '../../auth/api/authStorage'

export type TJiraProject = {
  id: string
  key: string
  name: string
  projectTypeKey?: string
  style?: string
}

type TJiraProjectsResponse = {
  values?: TJiraProject[]
}

export const fetchProjects = async (session: TAuthSession): Promise<TJiraProject[]> => {
  const api = createApiClient(session)

  const res = await api.get<TJiraProjectsResponse>('/rest/api/3/project/search', {
    params: { maxResults: 100 },
  })

  return res.data.values ?? []
}