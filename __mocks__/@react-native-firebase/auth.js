export default () => ({
  signInWithPhoneNumber: jest.fn().mockResolvedValue({
    verificationId: 'test-verification-id',
  }),
});
