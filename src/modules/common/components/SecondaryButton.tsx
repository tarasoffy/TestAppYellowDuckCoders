import React from 'react'
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

type TProps = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SecondaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
}: TProps) => {
  const isDisabled = Boolean(disabled || loading)

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, styles.secondary, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.textBase, styles.textSecondary, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default SecondaryButton

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondary: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '700',
  },
  textSecondary: {
    color: '#111',
  },
})