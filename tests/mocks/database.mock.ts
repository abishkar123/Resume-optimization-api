/**
 * Mock MongoDB/Mongoose operations
 */
export const mockUserModel = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

/**
 * Create mock user document
 */
export const createMockUser = (overrides = {}) => ({
  _id: 'mongo-id-123',
  fullname: 'Test User',
  email: 'test@example.com',
  resumeUrl: 'https://resume-bucket.s3.amazonaws.com/resumes/test@example.com/resume.pdf',
  optimizationHistory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn().mockResolvedValue({}),
  ...overrides,
});

/**
 * Mock successful user save
 */
export const mockUserSaveSuccess = () => {
  return jest.fn().mockResolvedValue(createMockUser());
};

/**
 * Mock user retrieval
 */
export const mockUserFindOne = (user = createMockUser()) => {
  return jest.fn().mockResolvedValue(user);
};

/**
 * Mock user not found
 */
export const mockUserNotFound = () => {
  return jest.fn().mockResolvedValue(null);
};

/**
 * Mock MongoDB connection error
 */
export const mockMongoError = () => {
  return jest.fn().mockRejectedValue(new Error('MongoDB connection failed'));
};

/**
 * Mock optimization history entry
 */
export const createMockOptimizationEntry = (overrides = {}) => ({
  date: new Date(),
  originalText: 'Original resume content',
  optimizedText: 'Optimized resume content with AI enhancements',
  ...overrides,
});
