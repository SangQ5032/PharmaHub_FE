// App.tsx
import './src/shared/config/reactotron' // init Reactotron (nếu bạn đã cấu hình)
import React from 'react'
import { AppRegistry, StatusBar, LogBox } from 'react-native'
import { Provider } from 'react-redux'
import { name as appName } from './app.json'
import AppNavigator from './src/app/navigation/AppNavigator'
import { store } from './src/app/store'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// Ignore noisy logs (tùy bạn có muốn giữ hay xóa)
LogBox.ignoreLogs([
  'Setting a timer', // ví dụ common RN timer warning
])

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* Nếu sau này dùng redux-persist: wrap <PersistGate> vào bên trong Provider */}
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" />
          <AppNavigator />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

AppRegistry.registerComponent(appName, () => App)

export default App
