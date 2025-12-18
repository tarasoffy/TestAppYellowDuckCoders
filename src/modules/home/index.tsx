import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useAuthStore } from '../auth/store/authStore'
import UserCard from './components/UserCard'
import PrimaryButton from '../common/components/PrimaryButton'
import SecondaryButton from '../common/components/SecondaryButton'
import { fetchProjects, type TJiraProject } from './api/projectsApi'

const Home = () => {
  const session = useAuthStore(state => state.session)
  const logout = useAuthStore(state => state.logout)

  const [projects, setProjects] = useState<TJiraProject[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const loadProjects = useCallback(
    async (mode: 'init' | 'refresh' = 'init') => {
      if (!session) return

      setErrorText(null)
      if (mode === 'refresh') setRefreshing(true)
      else setLoading(true)

      try {
        const data = await fetchProjects(session)
        setProjects(data)
      } catch (e: any) {
        setErrorText(e?.message ?? 'Failed to load projects.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [session],
  )

  useEffect(() => {
    loadProjects('init')
  }, [loadProjects])

  const onLogout = async () => {
    await logout()
  }

  const renderHeader = () => {
    if (!session) return null

    return (
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>

        <UserCard
          displayName={session.displayName}
          email={session.jiraEmail}
          domain={session.domain}
        />

        <View style={styles.row}>
          <PrimaryButton title="Sync projects" onPress={() => loadProjects('refresh')} />
          <SecondaryButton title="Logout" onPress={onLogout} />
        </View>

        {!!errorText && <Text style={styles.error}>{errorText}</Text>}

        <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: TJiraProject }) => {
    return (
      <View style={styles.projectItem}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectMeta}>
          {item.key} • {item.projectTypeKey ?? '—'}
          {item.style ? ` • ${item.style}` : ''}
        </Text>
      </View>
    )
  }

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
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadProjects('refresh')} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No projects found (or no access).</Text>
          </View>
        }
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    gap: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  error: {
    color: '#c62828',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  listContent: {
    paddingBottom: 24,
  },
  empty: {
    paddingTop: 16,
  },
  emptyText: {
    color: '#6b6b6b',
  },
  projectItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  projectMeta: {
    fontSize: 12,
    color: '#6b6b6b',
    marginTop: 2,
  },
})