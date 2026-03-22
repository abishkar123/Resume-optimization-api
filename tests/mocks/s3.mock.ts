/**
 * Mock AWS S3 operations
 */
export const mockS3Client = {
  send: jest.fn(),
};

/**
 * Mock S3 upload success
 */
export const mockS3UploadSuccess = (fileKey = 'resumes/test@example.com/file.pdf') => {
  return jest.fn().mockResolvedValue({
    Location: `https://resume-bucket.s3.amazonaws.com/${fileKey}`,
    Key: fileKey,
    ETag: '"abc123"',
  });
};

/**
 * Mock S3 upload failure
 */
export const mockS3UploadError = () => {
  return jest.fn().mockRejectedValue(new Error('S3 upload failed'));
};

/**
 * Mock S3 download (get object)
 */
export const mockS3GetObject = (content = 'Sample resume content') => {
  return jest.fn().mockResolvedValue({
    Body: {
      transformToString: jest.fn().mockResolvedValue(content),
    },
  });
};

/**
 * Mock S3 get object error
 */
export const mockS3GetObjectError = () => {
  return jest.fn().mockRejectedValue(new Error('Failed to retrieve object from S3'));
};

/**
 * Create mock S3 URL
 */
export const createMockS3Url = (email = 'test@example.com', filename = 'resume.pdf') => {
  return `https://resume-bucket.s3.amazonaws.com/resumes/${email}/${filename}`;
};
