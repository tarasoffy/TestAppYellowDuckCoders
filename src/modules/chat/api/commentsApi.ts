import { createApiClient } from '../../common/services/axios.config'
import type { TAuthSession } from '../../auth/api/authStorage'
import { mapApiError } from '../../common/services/apiError'

type TParams = {
  session: TAuthSession
  issueKey: string
  text: string
}

export const addComment = async ({ session, issueKey, text }: TParams) => {
  try {
    const api = createApiClient(session)

    const body = {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text }],
          },
        ],
      },
    }

    await api.post(`/rest/api/3/issue/${issueKey}/comment`, body)
  } catch (e) {
    throw new Error(mapApiError(e))
  }
}