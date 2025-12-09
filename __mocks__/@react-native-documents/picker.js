// Mock for @react-native-documents/picker
// This mock is used during Jest tests since the native module is not available

export const pick = jest.fn(() => {
  return Promise.resolve([
    {
      uri: 'file:///mock/path/to/file.xlsx',
      name: 'mock-file.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1024,
    },
  ]);
});

export default {
  pick,
};

