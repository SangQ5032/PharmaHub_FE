module.exports = {
  default: {
    print: jest.fn(() => Promise.resolve()),
    printToFile: jest.fn(() => Promise.resolve({ uri: 'file://mock.pdf' })),
    selectPrinter: jest.fn(() => Promise.resolve()),
  },
};

