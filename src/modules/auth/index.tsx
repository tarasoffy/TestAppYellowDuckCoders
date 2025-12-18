import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AuthInput } from './components/AuthInput'
import { useAuthForm } from './hooks/useAuthForm'
import PrimaryButton from '../common/components/PrimaryButton'

const Auth = () => {
  const {
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
  } = useAuthForm()

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in to Jira</Text>

        <AuthInput
          label="Jira domain"
          placeholder="yourcompany.atlassian.net"
          autoCapitalize="none"
          autoCorrect={false}
          value={domain}
          onChangeText={setDomain}
        />

        <AuthInput
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          label="API token"
          placeholder="********"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={token}
          onChangeText={setToken}
        />

        {!!errorText && <Text style={styles.error}>{errorText}</Text>}

        <PrimaryButton
          title="Sign in"
          loading={loading}
          disabled={!isValid}
          onPress={submit}
        />
      </View>
    </SafeAreaView>
  )
}

export default Auth

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: '#c62828',
  },
})