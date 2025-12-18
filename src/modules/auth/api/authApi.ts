import { createApiClient } from '../../common/services/axios.config'
import { mapApiError } from '../../common/services/apiError'

export type TMyselfResponse = {
  accountId?: string
  displayName?: string
  emailAddress?: string
}

type TLoginParams = {
  domain: string
  email: string
  apiToken: string
}

export const loginAndFetchMyself = async (params: TLoginParams) => {
  try {
    const api = createApiClient(params)
    const res = await api.get<TMyselfResponse>('/rest/api/3/myself')
    return { ok: true as const, data: res.data }
  } catch (e) {
    return { ok: false as const, error: mapApiError(e) }
  }
}