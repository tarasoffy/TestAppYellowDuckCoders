import React, { useCallback } from 'react'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import type { TChatMessage } from '../api/feedApi'

type TProps = {
  item: TChatMessage
  authHeader: string
  draft: string
  onChangeDraft: (v: string) => void
  onSend: () => void
  sending: boolean
}

const ChatMessageCard = ({
  item,
  authHeader,
  draft,
  onChangeDraft,
  onSend,
  sending,
}: TProps) => {
  const openLink = useCallback(async (url: string) => {
    try {
      const can = await Linking.canOpenURL(url)
      if (can) await Linking.openURL(url)
    } catch {}
  }, [])

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

      <Text style={[styles.muted, { marginTop: 8 }]}>WITH DESCRIPTION</Text>
      <Text style={styles.text}>{item.issueDescription || '—'}</Text>

      <Text style={[styles.muted, { marginTop: 8 }]}>ADDED COMMENT</Text>
      <Text style={styles.text}>{item.commentText}</Text>

      <Text style={[styles.muted, { marginTop: 8 }]}>ATTACHMENTS:</Text>
      {item.attachments.length === 0 ? (
        <Text style={styles.text}>—</Text>
      ) : (
        <View style={styles.attachmentsWrap}>
          {item.attachments.slice(0, 3).map(a => {
            if (!a.url) return null

            if (a.isImage) {
              return (
                <TouchableOpacity key={a.id} onPress={() => openLink(a.url!)} activeOpacity={0.85}>
                  <Image
                    source={{
                      uri: a.url,
                      headers: { Authorization: authHeader },
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Text style={styles.fileName}>{a.filename}</Text>
                </TouchableOpacity>
              )
            }

            return (
              <Text key={a.id} style={styles.linkText} onPress={() => openLink(a.url!)}>
                🔗 {a.filename}
              </Text>
            )
          })}
        </View>
      )}

      <View style={styles.replyWrap}>
        <TextInput
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Write a comment..."
          placeholderTextColor="#9a9a9a"
          style={styles.replyInput}
          multiline
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={sending}
          style={[styles.replyBtn, sending && styles.disabled]}
          activeOpacity={0.85}
        >
          <Text style={styles.replyBtnText}>{sending ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => openLink(item.jiraLink)} style={styles.linkBtn} activeOpacity={0.85}>
        <Text style={styles.jiraLink}>Jira link: {item.jiraLink}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChatMessageCard

const styles = StyleSheet.create({
  msg: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F3F3F3',
    marginBottom: 12,
  },
  muted: { fontSize: 12, color: '#6b6b6b' },
  bold: { fontWeight: '800', color: '#111' },
  text: { fontSize: 14, color: '#111', marginTop: 4 },

  attachmentsWrap: { marginTop: 6, gap: 8 },
  image: {
    width: 220,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#e6e6e6',
  },
  fileName: { marginTop: 4, fontSize: 12, color: '#6b6b6b' },
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
  replyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.6 },

  linkBtn: { marginTop: 10 },
  jiraLink: { fontSize: 12, textDecorationLine: 'underline', color: '#111' },
})