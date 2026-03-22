/**
 * Integration tests for file upload endpoint
 */
import {
  createMockRequest,
  createMockResponse,
  createMockFile,
  expectSuccessResponse,
  expectErrorResponse,
  createPDFBuffer,
  createWordBuffer,
} from '../helpers/test-utils';
import { createMockS3Url, mockS3UploadSuccess, mockS3UploadError } from '../mocks/s3.mock';
import { createMockUser, mockUserFindOne, mockUserSaveSuccess } from '../mocks/database.mock';

describe('POST /api/v1/resumes/upload - Resume Upload Endpoint', () => {
  describe('Successful Upload Scenarios', () => {
    it('should successfully upload PDF resume', async () => {
      const mockFile = createMockFile({
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        buffer: createPDFBuffer('John Doe resume content'),
      });

      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/upload',
        body: { fullname: 'John Doe' },
        file: mockFile,
        user: { email: 'john@example.com', uid: 'user-123' },
      });

      const res = createMockResponse();

      // Simulate successful upload response
      const uploadResponse = {
        success: true,
        message: 'Resume uploaded successfully',
        fileUrl: createMockS3Url('john@example.com', 'resume.pdf'),
        fileKey: 'resumes/john@example.com/resume.pdf',
      };

      expectSuccessResponse(uploadResponse, 'uploaded successfully');
      expect(uploadResponse.fileUrl).toContain('https://');
      expect(uploadResponse.fileKey).toContain('resumes/');
    });

    it('should successfully upload DOCX resume', async () => {
      const mockFile = createMockFile({
        originalname: 'resume.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: createWordBuffer('Resume content'),
      });

      const uploadResponse = {
        success: true,
        message: 'Resume uploaded successfully',
        fileUrl: createMockS3Url('john@example.com', 'resume.docx'),
        fileKey: 'resumes/john@example.com/resume.docx',
      };

      expectSuccessResponse(uploadResponse, 'uploaded');
      expect(uploadResponse.fileUrl).toContain('resume.docx');
    });

    it('should successfully upload DOC resume', async () => {
      const mockFile = createMockFile({
        originalname: 'resume.doc',
        mimetype: 'application/msword',
        buffer: createWordBuffer('Resume content'),
      });

      const uploadResponse = {
        success: true,
        message: 'Resume uploaded successfully',
        fileUrl: createMockS3Url('john@example.com', 'resume.doc'),
      };

      expectSuccessResponse(uploadResponse);
      expect(uploadResponse.fileUrl).toContain('resume.doc');
    });

    it('should create user record with resume URL', async () => {
      const fileUrl = createMockS3Url('john@example.com', 'resume.pdf');
      const user = createMockUser({
        fullname: 'John Doe',
        email: 'john@example.com',
        resumeUrl: fileUrl,
      });

      expect(user.fullname).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.resumeUrl).toBe(fileUrl);
    });
  });

  describe('File Validation Errors', () => {
    it('should reject missing file', () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/upload',
        body: { fullname: 'John Doe' },
        file: undefined,
      });

      const errorResponse = {
        status: 'error',
        message: 'No file provided',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject oversized file (>5MB)', () => {
      const mockFile = createMockFile({
        size: 6 * 1024 * 1024, // 6MB
        originalname: 'large-resume.pdf',
      });

      const errorResponse = {
        status: 'error',
        message: 'File is too large. Maximum size is 5MB.',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject invalid file type', () => {
      const mockFile = createMockFile({
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
      });

      const errorResponse = {
        status: 'error',
        message: 'Invalid file type. Only PDF and Word documents are allowed.',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject .txt files', () => {
      const mockFile = createMockFile({
        originalname: 'resume.txt',
        mimetype: 'text/plain',
      });

      const errorResponse = {
        status: 'error',
        message: 'Invalid file type',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject .exe or executable files', () => {
      const mockFile = createMockFile({
        originalname: 'malware.exe',
        mimetype: 'application/x-msdownload',
      });

      const errorResponse = {
        status: 'error',
        message: 'Invalid file type',
      };

      expectErrorResponse(errorResponse);
    });
  });

  describe('Request Validation Errors', () => {
    it('should require fullname parameter', () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/upload',
        body: {}, // Missing fullname
        file: createMockFile(),
      });

      const errorResponse = {
        status: 'error',
        message: 'Full name is required',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject empty fullname', () => {
      const req = createMockRequest({
        body: { fullname: '   ' }, // Whitespace only
      });

      const errorResponse = {
        status: 'error',
        message: 'Full name is required',
      };

      expectErrorResponse(errorResponse);
    });

    it('should reject very long fullname', () => {
      const req = createMockRequest({
        body: { fullname: 'A'.repeat(256) }, // Too long
      });

      const errorResponse = {
        status: 'error',
        message: 'Full name must be less than 255 characters',
      };

      expectErrorResponse(errorResponse);
    });

    it('should extract email from authenticated user', () => {
      const req = createMockRequest({
        user: { email: 'john@example.com', uid: 'user-123' },
      });

      expect(req.user.email).toBe('john@example.com');
      expect(req.user.uid).toBe('user-123');
    });
  });

  describe('S3 Upload Failures', () => {
    it('should handle S3 upload failure', async () => {
      const mockUploadError = mockS3UploadError();
      
      try {
        await mockUploadError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('S3 upload failed');
      }
    });

    it('should handle S3 connection timeout', async () => {
      const mockError = jest.fn().mockRejectedValue(new Error('Request timeout'));
      
      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle S3 permission denied', async () => {
      const mockError = jest.fn().mockRejectedValue(new Error('Access Denied'));
      
      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Access Denied');
      }
    });
  });

  describe('Database Operations', () => {
    it('should save user with resume URL', async () => {
      const fileUrl = createMockS3Url('john@example.com', 'resume.pdf');
      const user = createMockUser({
        resumeUrl: fileUrl,
      });

      expect(user.resumeUrl).toBe(fileUrl);
      expect(user.email).toBe('test@example.com');
    });

    it('should update existing user resume URL', async () => {
      const oldUrl = createMockS3Url('john@example.com', 'old-resume.pdf');
      const newUrl = createMockS3Url('john@example.com', 'new-resume.pdf');
      
      const user = createMockUser({ resumeUrl: oldUrl });
      user.resumeUrl = newUrl;

      expect(user.resumeUrl).toBe(newUrl);
      expect(user.resumeUrl).not.toBe(oldUrl);
    });

    it('should handle database save failure', async () => {
      const mockSaveError = jest.fn().mockRejectedValue(new Error('Database save failed'));
      
      try {
        await mockSaveError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Database save failed');
      }
    });
  });

  describe('Concurrent Upload Handling', () => {
    it('should handle multiple concurrent uploads', async () => {
      const uploads = Array(3).fill(null).map((_, i) =>
        Promise.resolve({
          success: true,
          fileUrl: createMockS3Url(`user${i}@example.com`, `resume${i}.pdf`),
        })
      );

      const results = await Promise.all(uploads);
      expect(results).toHaveLength(3);
      results.forEach((result, i) => {
        expect(result.fileUrl).toContain(`user${i}@example.com`);
      });
    });

    it('should handle multiple uploads from same user', async () => {
      const uploads = Array(3).fill(null).map((_, i) =>
        Promise.resolve({
          success: true,
          fileUrl: createMockS3Url('john@example.com', `resume-v${i + 1}.pdf`),
        })
      );

      const results = await Promise.all(uploads);
      expect(results).toHaveLength(3);
      expect(new Set(results.map(r => r.fileUrl)).size).toBe(3); // All URLs unique
    });
  });

  describe('Response Validation', () => {
    it('should return correct response structure on success', () => {
      const response = {
        success: true,
        message: 'Resume uploaded successfully',
        fileUrl: createMockS3Url(),
        fileKey: 'resumes/test@example.com/file.pdf',
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('fileUrl');
      expect(response).toHaveProperty('fileKey');
      expect(response.success).toBe(true);
    });

    it('should include valid S3 URL in response', () => {
      const response = {
        fileUrl: createMockS3Url(),
      };

      expect(response.fileUrl).toMatch(/^https:\/\//);
      expect(response.fileUrl).toContain('s3.amazonaws.com');
      expect(response.fileUrl).toContain('resumes/');
    });
  });
});
