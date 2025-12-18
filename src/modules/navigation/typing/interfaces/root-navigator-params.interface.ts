import { ParamListBase } from '@react-navigation/native'

import { ERoutes } from '../enums'

export interface IRootStackNavigatorParams extends ParamListBase {
  [ERoutes.Home]: undefined
  [ERoutes.Auth]: undefined
}
