/**
 * Common test utilities and helpers
 */

/**
 * Create mock Express request
 */
export const createMockRequest = (overrides = {}) => {
  return {
    method: 'GET',
    url: '/api/v1/resumes',
    headers: {
      authorization: 'Bearer mock-token',
      'content-type': 'application/json',
    },
    body: {},
    params: {},
    query: {},
    user: {
      uid: 'test-user-123',
      email: 'test@example.com',
    },
    ...overrides,
  };
};

/**
 * Create mock Express response
 */
export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Create mock Express next function
 */
export const createMockNext = () => jest.fn();

/**
 * Create mock test file
 */
export const createMockFile = (overrides = {}) => ({
  fieldname: 'resume',
  originalname: 'resume.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  size: 1024 * 100, // 100KB
  buffer: Buffer.from('mock pdf content'),
  ...overrides,
});

/**
 * Verify response format
 */
export const expectSuccessResponse = (response: any, expectedMessage?: string) => {
  expect(response.success).toBe(true);
  if (expectedMessage) {
    expect(response.message).toContain(expectedMessage);
  }
};

/**
 * Verify error response format
 */
export const expectErrorResponse = (response: any, expectedStatus?: string) => {
  expect(response.status).toBe('error');
  if (expectedStatus) {
    expect(response.message).toBeDefined();
  }
};

/**
 * Create test file buffer
 */
export const createPDFBuffer = (content = 'Sample PDF content') => {
  return Buffer.from(`%PDF-1.4\n${content}`);
};

/**
 * Create test Word file buffer
 */
export const createWordBuffer = (content = 'Sample Word content') => {
  return Buffer.from(content);
};

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Reset all mocks
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
};
