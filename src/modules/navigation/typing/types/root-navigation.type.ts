import { ERoutes } from '../enums'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IRootStackNavigatorParams } from '../interfaces/root-navigator-params.interface'

export type TRootNavigationProp = NativeStackNavigationProp<
  IRootStackNavigatorParams,
  ERoutes
>

export type TRootNavigationScreenRouteProp<TRouteKey extends ERoutes> =
  RouteProp<IRootStackNavigatorParams, TRouteKey>
