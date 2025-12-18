import { useCallback, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { useAuthStore } from '../../auth/store/authStore'
import { fetchChatFeed, type TChatMessage } from '../api/feedApi'
import { addComment } from '../api/commentsApi'

type TMode = 'init' | 'refresh'

export const useChatFeed = () => {
  const isFocused = useIsFocused()
  const session = useAuthStore(state => state.session)

  const [messages, setMessages] = useState<TChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [sendingId, setSendingId] = useState<string | null>(null)

  const load = useCallback(
    async (mode: TMode = 'init') => {
      if (!session) return

      setErrorText(null)
      if (mode === 'refresh') setRefreshing(true)
      else setLoading(true)

      try {
        const data = await fetchChatFeed(session)
        setMessages(data)
        setLastUpdated(Date.now())
      } catch (e: any) {
        setErrorText(e?.message ?? 'Failed to load chat.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [session],
  )

  useEffect(() => {
    if (!session) return
    load('init')
  }, [session, load])

  useEffect(() => {
    if (!session) return
    if (!isFocused) return

    const intervalMs = 20000
    const id = setInterval(() => {
      if (loading || refreshing) return
      load('refresh')
    }, intervalMs)

    return () => clearInterval(id)
  }, [session, isFocused, loading, refreshing, load])

  const setDraft = useCallback((messageId: string, value: string) => {
    setDrafts(prev => ({ ...prev, [messageId]: value }))
  }, [])

  const sendComment = useCallback(
    async (messageId: string, issueKey: string) => {
      if (!session) return

      const text = (drafts[messageId] ?? '').trim()
      if (!text) return

      try {
        setSendingId(messageId)
        await addComment({ session, issueKey, text })
        setDraft(messageId, '')
        await load('refresh')
      } catch (e: any) {
        setErrorText(e?.message ?? 'Failed to send comment.')
      } finally {
        setSendingId(null)
      }
    },
    [session, drafts, setDraft, load],
  )

  return {
    session,
    messages,
    loading,
    refreshing,
    errorText,
    lastUpdated,
    drafts,
    sendingId,
    load,
    setDraft,
    sendComment,
  }
}