import { useMemo, useState } from 'react'
import { loginAndFetchMyself } from '../api/authApi'
import { saveSession, type TAuthSession } from '../api/authStorage'
import { useAuthStore } from '../store/authStore'
import { normalizeDomain } from '../../common/utils/jira'

export const useAuthForm = () => {
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const setSession = useAuthStore(state => state.setSession)

  const isValid = useMemo(() => {
    return Boolean(normalizeDomain(domain)) && Boolean(email.trim()) && Boolean(token.trim())
  }, [domain, email, token])

  const submit = async () => {
    setErrorText(null)

    const domainValue = normalizeDomain(domain)
    const emailValue = email.trim()
    const tokenValue = token.trim()

    if (!domainValue) {
      setErrorText('Enter Jira domain (example.atlassian.net)')
      return
    }

    if (!emailValue) {
      setErrorText('Enter email')
      return
    }

    if (!tokenValue) {
      setErrorText('Enter API token')
      return
    }

    setLoading(true)

    const res = await loginAndFetchMyself({
      domain: domainValue,
      email: emailValue,
      apiToken: tokenValue,
    })

    if (!res.ok) {
      setLoading(false)
      setErrorText(res.error)
      return
    }

    const session: TAuthSession = {
      domain: domainValue,
      email: emailValue,
      apiToken: tokenValue,
      displayName: res.data.displayName ?? '',
      jiraEmail: res.data.emailAddress ?? emailValue,
      accountRef: res.data.accountId ?? '',
    }

    await saveSession(session)
    setSession(session)
    setLoading(false)
  }

  return {
    domain,
    setDomain,
    email,
    setEmail,
    token,
    setToken,
    loading,
    errorText,
    isValid,
    submit,
  }
}