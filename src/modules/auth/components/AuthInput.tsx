import React from 'react'
import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native'

type TProps = {
  label: string
  errorText?: string | null
} & TextInputProps

export const AuthInput = ({ label, errorText, ...props }: TProps) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#9a9a9a"
        {...props}
      />
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#6b6b6b' },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 12,
    color: '#111',
    backgroundColor: '#fff',
  },
  error: { color: '#c62828', fontSize: 12 },
})