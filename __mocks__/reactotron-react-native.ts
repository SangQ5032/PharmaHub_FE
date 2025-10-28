// __mocks__/reactotron-react-native.ts

const reactotron = {
  configure: () => reactotron,
  use: () => reactotron,
  useReactNative: () => reactotron,   // Thêm dòng này
  connect: () => reactotron,
  clear: () => {},
  log: () => {},
};

export const reactotronRedux = () => {};
export default reactotron;
