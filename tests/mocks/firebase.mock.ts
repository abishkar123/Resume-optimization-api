/**
 * Mock Firebase Admin SDK
 */
export const mockFirebaseAdmin = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
};

/**
 * Create mock Firebase token
 */
export const createMockFirebaseToken = (overrides = {}) => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

/**
 * Mock Firebase verification success
 */
export const mockFirebaseVerifySuccess = (token = createMockFirebaseToken()) => {
  return jest.fn().mockResolvedValue(token);
};

/**
 * Mock Firebase verification failure
 */
export const mockFirebaseVerifyError = () => {
  return jest.fn().mockRejectedValue(new Error('Invalid token'));
};
