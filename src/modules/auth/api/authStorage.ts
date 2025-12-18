import * as Keychain from 'react-native-keychain'

const SERVICE = 'jira_chat_auth'

export type TAuthSession = {
  domain: string
  email: string
  apiToken: string
  displayName: string
  jiraEmail: string
  accountRef: string
}

export const saveSession = async (session: TAuthSession) => {
  await Keychain.setGenericPassword('session', JSON.stringify(session), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  })
}

export const readSession = async (): Promise<TAuthSession | null> => {
  const res = await Keychain.getGenericPassword({ service: SERVICE })
  if (!res) return null

  try {
    return JSON.parse(res.password) as TAuthSession
  } catch {
    return null
  }
}

export const clearSession = async () => {
  await Keychain.resetGenericPassword({ service: SERVICE })
}