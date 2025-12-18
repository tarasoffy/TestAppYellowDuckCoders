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

const PrimaryButton = ({
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
      style={[styles.base, styles.primary, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.textBase, styles.textPrimary, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default PrimaryButton

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primary: {
    backgroundColor: '#111',
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#fff',
  },
})