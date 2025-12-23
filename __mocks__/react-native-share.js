module.exports = {
  default: {
    open: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    shareSingle: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
  },
  Share: {
    open: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    shareSingle: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
  },
};

