export const Camera = jest.fn();
export const useCameraDevice = jest.fn(() => ({ devices: [], device: null }));
export const useCameraPermission = jest.fn(() => ({
  hasPermission: true,
  requestPermission: jest.fn(),
}));
export const useCodeScanner = jest.fn(() => ({ isActive: false }));
