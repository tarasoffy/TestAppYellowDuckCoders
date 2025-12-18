import { TAuthSession } from "../api/authStorage"

export const buildSessionFromMyself = (params: {
  domain: string
  email: string
  apiToken: string
  myself: { displayName?: string; emailAddress?: string; accountId?: string }
}): TAuthSession => ({
  domain: params.domain,
  email: params.email,
  apiToken: params.apiToken,
  displayName: params.myself.displayName ?? '',
  jiraEmail: params.myself.emailAddress ?? params.email,
  accountRef: params.myself.accountId ?? '',
})