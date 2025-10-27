// src/shared/config/reactotron.ts
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

export const reactotron = Reactotron
  .configure({ name: 'RN App', host: 'localhost' })
  .useReactNative()
  .use(reactotronRedux())
  .connect()

declare global {
  interface Console {
    tron: typeof reactotron
  }
}

console.tron = reactotron
