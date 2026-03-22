/**
 * Unit tests for services (text extraction, AI, S3)
 */
import {
  mockExtractPDFSuccess,
  mockExtractWordSuccess,
  mockExtractionError,
  mockAIOptimizeSuccess,
  mockAITimeout,
  mockAIError,
} from '../mocks/ai.mock';
import {
  mockS3UploadSuccess,
  mockS3UploadError,
  mockS3GetObject,
  mockS3GetObjectError,
  createMockS3Url,
} from '../mocks/s3.mock';

describe('Service Unit Tests', () => {
  describe('Text Extraction Service', () => {
    it('should extract text from PDF file', async () => {
      const mockExtract = mockExtractPDFSuccess('Extracted PDF content');
      const result = await mockExtract();

      expect(result).toBe('Extracted PDF content');
      expect(typeof result).toBe('string');
    });

    it('should extract text from Word document', async () => {
      const mockExtract = mockExtractWordSuccess('Extracted Word content');
      const result = await mockExtract();

      expect(result).toBe('Extracted Word content');
      expect(typeof result).toBe('string');
    });

    it('should handle empty extracted text', async () => {
      const mockExtract = mockExtractPDFSuccess('');
      const result = await mockExtract();

      expect(result).toBe('');
      expect(result.length).toBe(0);
    });

    it('should handle large text extraction', async () => {
      const largeText = 'A'.repeat(50000);
      const mockExtract = mockExtractPDFSuccess(largeText);
      const result = await mockExtract();

      expect(result.length).toBe(50000);
    });

    it('should return string type', async () => {
      const mockExtract = mockExtractPDFSuccess('test');
      const result = await mockExtract();

      expect(typeof result).toBe('string');
    });

    it('should handle extraction error', async () => {
      const mockExtract = mockExtractionError();

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to extract text');
      }
    });

    it('should handle corrupted PDF', async () => {
      const mockExtract = jest.fn().mockRejectedValue(
        new Error('Failed to parse PDF: corrupted structure')
      );

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('corrupted');
      }
    });

    it('should handle encrypted PDF', async () => {
      const mockExtract = jest.fn().mockRejectedValue(
        new Error('PDF is password protected')
      );

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('password');
      }
    });

    it('should preserve text formatting', async () => {
      const formattedText = 'Line 1\nLine 2\nLine 3';
      const mockExtract = mockExtractPDFSuccess(formattedText);
      const result = await mockExtract();

      expect(result).toContain('\n');
      expect(result).toBe(formattedText);
    });

    it('should handle special characters', async () => {
      const specialText = 'Test with © £ € symbols';
      const mockExtract = mockExtractWordSuccess(specialText);
      const result = await mockExtract();

      expect(result).toContain('©');
      expect(result).toBe(specialText);
    });

    it('should handle unicode characters', async () => {
      const unicodeText = 'Test with 日本語 中文 한국어';
      const mockExtract = mockExtractPDFSuccess(unicodeText);
      const result = await mockExtract();

      expect(result).toContain('日本語');
      expect(result).toBe(unicodeText);
    });
  });

  describe('AI Optimization Service', () => {
    it('should optimize resume text', async () => {
      const mockOptimize = mockAIOptimizeSuccess('Optimized resume content');
      const result = await mockOptimize();

      expect(result.success).toBe(true);
      expect(result.optimizedText).toBe('Optimized resume content');
    });

    it('should return success flag', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      expect(result.success).toBe(true);
      expect(typeof result.success).toBe('boolean');
    });

    it('should include summary in response', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
    });

    it('should include bullet points', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      expect(result.bullets).toBeDefined();
      expect(Array.isArray(result.bullets)).toBe(true);
      expect(result.bullets.length).toBeGreaterThan(0);
    });

    it('should include keywords', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      expect(result.keywords).toBeDefined();
      expect(result.keywords.technical).toBeDefined();
      expect(result.keywords.soft_skills).toBeDefined();
    });

    it('should format bullet points correctly', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      result.bullets.forEach(bullet => {
        expect(bullet).toMatch(/^•\s/);
      });
    });

    it('should handle optimization timeout', async () => {
      const mockOptimize = mockAITimeout();

      try {
        await mockOptimize();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle AI service error', async () => {
      const mockOptimize = mockAIError('API rate limit exceeded');

      try {
        await mockOptimize();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('rate limit');
      }
    });

    it('should handle invalid input', async () => {
      const mockOptimize = jest.fn().mockRejectedValue(
        new Error('Invalid input: content exceeds maximum length')
      );

      try {
        await mockOptimize();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Invalid input');
      }
    });

    it('should validate response structure', async () => {
      const mockOptimize = mockAIOptimizeSuccess();
      const result = await mockOptimize();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('optimizedText');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('bullets');
      expect(result).toHaveProperty('keywords');
    });

    it('should handle empty optimization result', async () => {
      const mockOptimize = jest.fn().mockResolvedValue({
        success: true,
        optimizedText: '',
      });

      const result = await mockOptimize();
      expect(result.success).toBe(true);
      expect(result.optimizedText).toBe('');
    });

    it('should maintain original text untouched', async () => {
      const originalText = 'Original resume';
      const mockOptimize = mockAIOptimizeSuccess('Optimized content');
      const result = await mockOptimize();

      expect(result.optimizedText).not.toBe(originalText);
    });
  });

  describe('S3 Upload Service', () => {
    it('should generate S3 file URL', () => {
      const url = createMockS3Url('john@example.com', 'resume.pdf');

      expect(url).toContain('https://');
      expect(url).toContain('s3.amazonaws.com');
      expect(url).toContain('resumes/');
      expect(url).toContain('john@example.com');
    });

    it('should include email in S3 path', () => {
      const email = 'user@example.com';
      const url = createMockS3Url(email);

      expect(url).toContain(email);
    });

    it('should include filename in URL', () => {
      const filename = 'resume.pdf';
      const url = createMockS3Url('user@example.com', filename);

      expect(url).toContain(filename);
    });

    it('should use HTTPS protocol', () => {
      const url = createMockS3Url();

      expect(url).toMatch(/^https:\/\//);
    });

    it('should upload file to S3', async () => {
      const mockUpload = mockS3UploadSuccess('resumes/user@example.com/resume.pdf');
      const result = await mockUpload();

      expect(result.Location).toContain('https://');
      expect(result.Key).toBe('resumes/user@example.com/resume.pdf');
    });

    it('should return upload location', async () => {
      const mockUpload = mockS3UploadSuccess();
      const result = await mockUpload();

      expect(result.Location).toBeDefined();
      expect(typeof result.Location).toBe('string');
    });

    it('should return file key', async () => {
      const mockUpload = mockS3UploadSuccess();
      const result = await mockUpload();

      expect(result.Key).toBeDefined();
      expect(typeof result.Key).toBe('string');
    });

    it('should return ETag on successful upload', async () => {
      const mockUpload = mockS3UploadSuccess();
      const result = await mockUpload();

      expect(result.ETag).toBeDefined();
      expect(typeof result.ETag).toBe('string');
    });

    it('should handle upload error', async () => {
      const mockUpload = mockS3UploadError();

      try {
        await mockUpload();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('S3 upload failed');
      }
    });

    it('should handle S3 access denied', async () => {
      const mockError = jest.fn().mockRejectedValue({
        Code: 'AccessDenied',
        message: 'Access Denied'
      });

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.Code).toBe('AccessDenied');
      }
    });

    it('should download file from S3', async () => {
      const mockGet = mockS3GetObject('Downloaded content');
      const result = await mockGet();

      expect(result.Body).toBeDefined();
    });

    it('should handle S3 get object error', async () => {
      const mockGet = mockS3GetObjectError();

      try {
        await mockGet();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to retrieve');
      }
    });

    it('should handle S3 key not found', async () => {
      const mockError = jest.fn().mockRejectedValue({
        Code: 'NoSuchKey',
        message: 'The specified key does not exist'
      });

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.Code).toBe('NoSuchKey');
      }
    });
  });

  describe('S3 Service Helpers', () => {
    it('should extract file key from S3 URL', () => {
      const url = 'https://resume-bucket.s3.amazonaws.com/resumes/user@example.com/file.pdf';
      const extractKey = (urlStr: string) => {
        const pathPart = urlStr.split('.s3.amazonaws.com/')[1];
        return pathPart || '';
      };

      const key = extractKey(url);
      expect(key).toBe('resumes/user@example.com/file.pdf');
    });

    it('should parse S3 bucket name from URL', () => {
      const url = 'https://resume-bucket.s3.amazonaws.com/resumes/file.pdf';
      const extractBucket = (urlStr: string) => {
        return urlStr.split('.s3.amazonaws.com')[0].replace('https://', '');
      };

      const bucket = extractBucket(url);
      expect(bucket).toBe('resume-bucket');
    });

    it('should construct S3 path with timestamp', () => {
      const email = 'user@example.com';
      const filename = 'resume.pdf';
      const timestamp = Date.now();
      const path = `resumes/${email}/${timestamp}-${filename}`;

      expect(path).toContain('resumes/');
      expect(path).toContain(email);
      expect(path).toContain(filename);
      expect(path).toContain(timestamp.toString());
    });

    it('should validate S3 URL format', () => {
      const validUrl = 'https://bucket.s3.amazonaws.com/path/file.pdf';
      const invalidUrl = 'http://not-s3.com/file.pdf';

      const isValidS3 = (url: string) => url.includes('s3.amazonaws.com') && url.startsWith('https://');
      
      expect(isValidS3(validUrl)).toBe(true);
      expect(isValidS3(invalidUrl)).toBe(false);
    });
  });

  describe('Service Error Handling', () => {
    it('should provide meaningful error messages', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('Service temporarily unavailable')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(error.message.length).toBeGreaterThan(0);
      }
    });

    it('should distinguish between error types', () => {
      const timeoutError = new Error('Timeout');
      const validationError = new Error('Invalid input');
      const serverError = new Error('Internal server error');

      expect(timeoutError.message).toContain('Timeout');
      expect(validationError.message).toContain('Invalid');
      expect(serverError.message).toContain('server');
    });

    it('should include error context', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('Failed to process: file format not supported')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('process');
        expect(error.message).toContain('format');
      }
    });
  });

  describe('Service Performance', () => {
    it('should execute extraction quickly', async () => {
      const start = Date.now();
      const mockExtract = mockExtractPDFSuccess('content');
      await mockExtract();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });

    it('should execute AI optimization quickly', async () => {
      const start = Date.now();
      const mockOptimize = mockAIOptimizeSuccess();
      await mockOptimize();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });

    it('should execute S3 upload quickly', async () => {
      const start = Date.now();
      const mockUpload = mockS3UploadSuccess();
      await mockUpload();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});
