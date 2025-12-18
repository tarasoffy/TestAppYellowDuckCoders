import { createApiClient } from '../../common/services/axios.config'
import type { TAuthSession } from '../../auth/api/authStorage'

export type TJiraComment = {
  id: string
  created: string
  author?: { displayName?: string }
  body?: any
}

type TJiraIssue = {
  id: string
  key: string
  fields: {
    summary?: string
    description?: any
    project?: { name?: string }
    comment?: { comments?: TJiraComment[] }
    attachment?: Array<{
      id: string
      filename: string
      mimeType?: string
      content?: string
    }>
  }
}

type TJiraSearchResponse = {
  issues: TJiraIssue[]
}

export type TAttachment = {
  id: string
  filename: string
  mimeType?: string
  url?: string
  isImage: boolean
}

export type TChatMessage = {
  id: string
  projectName: string
  authorName: string
  issueKey: string
  issueSummary: string
  issueDescription: string
  commentText: string
  createdAt: string
  attachments: TAttachment[]
  jiraLink: string
}

const normalizeDomain = (value: string) =>
  value.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')

const adfToText = (node: any): string => {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(adfToText).join('')
  if (node.type === 'text') return node.text ?? ''
  if (node.content) return node.content.map(adfToText).join('')
  return ''
}

const isImageMime = (mime?: string) => Boolean(mime && mime.startsWith('image/'))

export const fetchChatFeed = async (session: TAuthSession): Promise<TChatMessage[]> => {
  const api = createApiClient(session)

  const jql = 'project = DP ORDER BY updated DESC'

  const res = await api.get<TJiraSearchResponse>('/rest/api/3/search/jql', {
    params: {
      jql,
      maxResults: 25,
      fields: 'summary,description,project,comment,attachment',
    },
  })

  const domain = normalizeDomain(session.domain)
  const baseBrowse = `https://${domain}/browse/`

  const messages: TChatMessage[] = []

  for (const issue of res.data.issues ?? []) {
    const projectName = issue.fields.project?.name ?? '—'
    const issueKey = issue.key
    const issueSummary = issue.fields.summary ?? '—'
    const issueDescription = adfToText(issue.fields.description).trim()
    const jiraLink = `${baseBrowse}${issueKey}`

    const issueAttachments: TAttachment[] = (issue.fields.attachment ?? []).map(a => ({
      id: a.id,
      filename: a.filename,
      mimeType: a.mimeType,
      url: a.content,
      isImage: isImageMime(a.mimeType),
    }))

    const comments = issue.fields.comment?.comments ?? []
    for (const c of comments) {
      const commentText = adfToText(c.body).trim()
      if (!commentText) continue

      messages.push({
        id: `${issueKey}_${c.id}`,
        projectName,
        authorName: c.author?.displayName ?? 'Unknown',
        issueKey,
        issueSummary,
        issueDescription,
        commentText,
        createdAt: c.created,
        attachments: issueAttachments,
        jiraLink,
      })
    }
  }

  messages.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  return messages
}