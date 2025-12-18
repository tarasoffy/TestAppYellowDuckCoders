import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Auth from '../auth'
import Home from '../home'
import Chat from '../chat'
import { ERoutes } from './typing/enums'
import { useAuthStore } from '../auth/store/authStore'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AppTabs = () => {
  return (
    <Tab.Navigator initialRouteName={ERoutes.Home} screenOptions={{ headerShown: false }}>
      <Tab.Screen name={ERoutes.Home} component={Home} />
      <Tab.Screen name={ERoutes.Chat} component={Chat} />
    </Tab.Navigator>
  )
}

const RootNavigation = () => {
  const isAuth = useAuthStore(state => state.isAuth)
  const isLoading = useAuthStore(state => state.isLoading)
  const init = useAuthStore(state => state.init)

  useEffect(() => {
    init()
  }, [init])

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuth ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <Stack.Screen name={ERoutes.Auth} component={Auth} />
      )}
    </Stack.Navigator>
  )
}

export default RootNavigation