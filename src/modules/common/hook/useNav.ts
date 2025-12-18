import { useNavigation } from '@react-navigation/native'
import { TRootNavigationProp } from '../../navigation/typing/types/root-navigation.type'

export const useNav = () => {
  return useNavigation<TRootNavigationProp>()
}