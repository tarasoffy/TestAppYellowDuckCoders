import React, { useCallback, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { encode as b64encode } from 'base-64'

import { useChatFeed } from './hooks/useChatFeed'
import type { TChatMessage } from './api/feedApi'

const Chat = () => {
  const {
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
  } = useChatFeed()

  const authHeader = useMemo(() => {
    if (!session) return ''
    return `Basic ${b64encode(`${session.email}:${session.apiToken}`)}`
  }, [session])

  const openLink = useCallback(async (url: string) => {
    const can = await Linking.canOpenURL(url)
    if (can) Linking.openURL(url)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: TChatMessage }) => {
      const draftValue = drafts[item.id] ?? ''
      const isSending = sendingId === item.id

      return (
        <View style={styles.msg}>
          <Text style={styles.muted}>
            IN PROJECT <Text style={styles.bold}>{item.projectName}</Text>
          </Text>
          <Text style={styles.muted}>
            BY <Text style={styles.bold}>{item.authorName}</Text>
          </Text>
          <Text style={styles.muted}>
            IN CARD <Text style={styles.bold}>{item.issueKey}</Text> — {item.issueSummary}
          </Text>

          <Text style={[styles.muted, styles.sectionTop]}>WITH DESCRIPTION</Text>
          <Text style={styles.text}>{item.issueDescription || '-'}</Text>

          <Text style={[styles.muted, styles.sectionTop]}>ADDED COMMENT</Text>
          <Text style={styles.text}>{item.commentText}</Text>

          <Text style={[styles.muted, styles.sectionTop]}>ATTACHMENTS:</Text>

          {item.attachments.length === 0 ? (
            <Text style={styles.text}>-</Text>
          ) : (
            <View style={styles.attachWrap}>
              {item.attachments.slice(0, 3).map(a => {
                if (!a.url) return null

                if (a.isImage) {
                  return (
                    <TouchableOpacity key={a.id} onPress={() => openLink(a.url!)}>
                      <Image
                        source={{ uri: a.url, headers: { Authorization: authHeader } }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                      <Text style={styles.fileName}>{a.filename}</Text>
                    </TouchableOpacity>
                  )
                }

                return (
                  <Text
                    key={a.id}
                    style={styles.linkText}
                    onPress={() => openLink(a.url!)}
                  >
                    🔗 {a.filename}
                  </Text>
                )
              })}
            </View>
          )}

          <View style={styles.replyWrap}>
            <TextInput
              value={draftValue}
              onChangeText={(v) => setDraft(item.id, v)}
              placeholder="Write a comment..."
              placeholderTextColor="#9a9a9a"
              style={styles.replyInput}
              multiline
            />
            <TouchableOpacity
              onPress={() => sendComment(item.id, item.issueKey)}
              disabled={isSending}
              style={[styles.replyBtn, isSending && styles.replyBtnDisabled]}
            >
              <Text style={styles.replyBtnText}>
                {isSending ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => openLink(item.jiraLink)} style={styles.linkBtn}>
            <Text style={styles.jiraLink}>Jira link: {item.jiraLink}</Text>
          </TouchableOpacity>
        </View>
      )
    },
    [authHeader, drafts, openLink, sendingId, sendComment, setDraft],
  )

  if (!session) {
    return (
      <View style={styles.center}>
        <Text>No session found</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}

      {!!lastUpdated && (
        <Text style={styles.updated}>
          Updated: {new Date(lastUpdated).toLocaleTimeString()}
        </Text>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load('refresh')} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerEmpty}>
            <Text style={styles.emptyText}>No comments yet</Text>
          </View>
        }
      />
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 24 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerEmpty: { paddingTop: 24, alignItems: 'center' },

  error: { color: '#c62828', marginBottom: 10 },
  updated: { color: '#6b6b6b', marginBottom: 8, fontSize: 12 },
  emptyText: { color: '#6b6b6b' },

  msg: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F3F3F3',
    marginBottom: 12,
  },

  muted: { fontSize: 12, color: '#6b6b6b' },
  bold: { fontWeight: '800', color: '#111' },
  text: { fontSize: 14, color: '#111', marginTop: 4 },
  sectionTop: { marginTop: 8 },

  attachWrap: { marginTop: 6, gap: 8 },

  image: {
    width: 220,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#e6e6e6',
  },
  fileName: { marginTop: 4, fontSize: 12, color: '#6b6b6b' },

  linkBtn: { marginTop: 10 },
  jiraLink: { fontSize: 12, textDecorationLine: 'underline', color: '#111' },
  linkText: { fontSize: 12, textDecorationLine: 'underline', color: '#111' },

  replyWrap: { marginTop: 10, gap: 8 },
  replyInput: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111',
    backgroundColor: '#fff',
  },
  replyBtn: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  replyBtnDisabled: { opacity: 0.7 },
  replyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})