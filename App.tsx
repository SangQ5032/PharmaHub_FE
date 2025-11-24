// App.tsx
import './src/shared/config/reactotron'
import React from 'react'
import { AppRegistry, StatusBar, LogBox } from 'react-native'
import { name as appName } from './app.json'
import AppNavigator from './src/app/navigation/AppNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from './src/app/providers/AuthProvider'

LogBox.ignoreLogs(['Setting a timer'])

const queryClient = new QueryClient()

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" />
            <AppNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

AppRegistry.registerComponent(appName, () => App)

export default App
