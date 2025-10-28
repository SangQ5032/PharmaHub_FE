module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    'reactotron-react-native': '<rootDir>/__mocks__/reactotron-react-native.ts',
    'react-native-gesture-handler': '<rootDir>/__mocks__/react-native-gesture-handler.js',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@?react-navigation|@react-native|react-native|react-native-.*|@react-native-community/.*)"
  ],
};
