import { AxiosError } from 'axios'

export const mapApiError = (e: unknown): string => {
  if (e && typeof e === 'object' && 'isAxiosError' in e) {
    const err = e as AxiosError
    const status = err.response?.status

    if (status === 400) return 'Bad request (400).'
    if (status === 401) return 'Unauthorized (401). Check email or API token.'
    if (status === 403) return 'Forbidden (403). You do not have access.'
    if (status === 404) return 'Not found (404).'
    if (status === 410) return 'Endpoint is gone (410).'
    if (status === 429) return 'Too many requests (429). Try again later.'
    if (status) return `Request failed (${status}).`

    return 'Network error. Check your connection.'
  }

  return 'Request failed.'
}