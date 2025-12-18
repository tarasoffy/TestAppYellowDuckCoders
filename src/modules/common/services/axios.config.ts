import axios, { AxiosError, AxiosInstance } from 'axios'
import { encode as b64encode } from 'base-64'
import { normalizeDomain } from '../utils/jira'

export type TApiSession = {
  domain: string
  email: string
  apiToken: string
}

const buildBaseUrl = (domain: string) => `https://${normalizeDomain(domain)}`

const buildAuthHeader = (email: string, apiToken: string) =>
  `Basic ${b64encode(`${email}:${apiToken}`)}`

export const createApiClient = (session: TApiSession): AxiosInstance => {
  const client = axios.create({
    baseURL: buildBaseUrl(session.domain),
    timeout: 15000,
    headers: {
      Accept: 'application/json',
      Authorization: buildAuthHeader(session.email.trim(), session.apiToken.trim()),
    },
  })

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )

  return client
}