import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type TProps = {
  displayName: string
  email: string
  domain: string
}

const UserCard = ({ displayName, email, domain }: TProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.block}>
        <Text style={styles.label}>User</Text>
        <Text style={styles.value}>{displayName}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Domain</Text>
        <Text style={styles.value}>{domain}</Text>
      </View>
    </View>
  )
}

export default UserCard

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F3F3F3',
    gap: 12,
  },
  block: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b6b6b',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
})