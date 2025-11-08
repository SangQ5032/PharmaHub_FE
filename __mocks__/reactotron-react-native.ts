// __mocks__/reactotron-react-native.ts

const reactotron = {
  configure: () => reactotron,
  useReactNative: () => reactotron,
  connect: () => reactotron,
  clear: () => {},
  log: () => {},
};

export default reactotron;
