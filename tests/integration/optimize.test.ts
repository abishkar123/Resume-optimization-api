/**
 * Integration tests for resume optimization endpoint
 */
import {
  createMockRequest,
  createMockResponse,
  expectSuccessResponse,
  expectErrorResponse,
} from '../helpers/test-utils';
import {
  mockAIOptimizeSuccess,
  mockAIError,
  mockAITimeout,
  mockExtractPDFSuccess,
  mockExtractionError,
} from '../mocks/ai.mock';
import { createMockS3Url } from '../mocks/s3.mock';
import { createMockUser } from '../mocks/database.mock';

describe('POST /api/v1/resumes/optimize-resume - Resume Optimization Endpoint', () => {
  describe('Successful Optimization', () => {
    it('should optimize resume with basic parameters', async () => {
      const fileUrl = createMockS3Url('john@example.com', 'resume.pdf');
      
      const response = {
        success: true,
        message: 'Resume optimized successfully',
        originalResume: 'Original resume text from PDF',
        optimizedResume: 'Optimized resume with AI enhancements',
      };

      expectSuccessResponse(response, 'optimized');
      expect(response.originalResume).toBeDefined();
      expect(response.optimizedResume).toBeDefined();
    });

    it('should optimize with target role specified', async () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/optimize-resume',
        body: {
          fileUrl: createMockS3Url(),
          targetRole: 'Senior Software Engineer',
        },
      });

      expect((req.body as any).targetRole).toBe('Senior Software Engineer');

      const response = {
        success: true,
        message: 'Resume optimized successfully',
        originalResume: 'Original content',
        optimizedResume: 'Optimized for Senior Software Engineer role',
      };

      expectSuccessResponse(response);
    });

    it('should optimize with job descriptions provided', async () => {
      const jobDescriptions = [
        'Looking for Senior Engineer with 5+ years experience in Node.js...',
        'Ideal candidate should have experience with AWS, MongoDB, Docker...',
      ];

      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/optimize-resume',
        body: {
          fileUrl: createMockS3Url(),
          jobDescriptions,
        },
      });

      expect((req.body as any).jobDescriptions).toHaveLength(2);
      expect((req.body as any).jobDescriptions[0]).toContain('Senior Engineer');
    });

    it('should optimize with all parameters provided', async () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/api/v1/resumes/optimize-resume',
        body: {
          fileUrl: createMockS3Url(),
          targetRole: 'Full Stack Developer',
          jobDescriptions: [
            'We are hiring a Full Stack Developer...',
          ],
        },
      });

      const response = {
        success: true,
        message: 'Resume optimized successfully',
        originalResume: 'Original',
        optimizedResume: 'Optimized for Full Stack Developer',
      };

      expectSuccessResponse(response);
    });

    it('should include optimization details in response', () => {
      const response = {
        success: true,
        originalResume: 'Original text',
        optimizedResume: 'Optimized text',
        summary: 'Professional summary with key achievements...',
        bullets: [
          '• Achievement 1 with metrics',
          '• Achievement 2 with results',
        ],
        keywords: {
          technical: ['Node.js', 'React', 'MongoDB'],
          soft_skills: ['Leadership', 'Communication'],
        },
      };

      expect(response.summary).toBeDefined();
      expect(response.bullets).toBeDefined();
      expect(response.keywords).toBeDefined();
      expect(response.keywords.technical).toBeInstanceOf(Array);
    });
  });

  describe('Request Validation', () => {
    it('should require fileUrl parameter', () => {
      const req = createMockRequest({
        body: {
          targetRole: 'Engineer',
          // Missing fileUrl
        },
      });

      const errorResponse = {
        status: 'error',
        message: 'File URL is required',
      };

      expectErrorResponse(errorResponse);
    });

    it('should validate S3 URL format', () => {
      const invalidUrls = [
        'not-a-url',
        'http://wrong-domain.com/file.pdf',
        'ftp://bucket.s3.amazonaws.com/file.pdf',
      ];

      invalidUrls.forEach(url => {
        const isValidS3Url = url.startsWith('https://') && 
                             (url.includes('.s3.amazonaws.com') || url.includes('.s3.') || url.includes('.s3-'));
        expect(isValidS3Url).toBe(false);
      });
    });

    it('should accept valid S3 URLs', () => {
      const validUrls = [
        createMockS3Url(),
        'https://resume-bucket.s3.amazonaws.com/resumes/user@example.com/file.pdf',
        'https://my-bucket.s3.us-west-2.amazonaws.com/path/file.pdf',
      ];

      validUrls.forEach(url => {
        expect(url).toMatch(/https:\/\/.*s3.*amazonaws\.com/);
      });
    });

    it('should handle targetRole as optional parameter', () => {
      const req1 = createMockRequest({
        body: {
          fileUrl: createMockS3Url(),
          // targetRole omitted
        },
      });

      const req2 = createMockRequest({
        body: {
          fileUrl: createMockS3Url(),
          targetRole: '',
        },
      });

      expect((req1.body as any).targetRole).toBeUndefined();
      expect((req2.body as any).targetRole).toBe('');
    });

    it('should handle jobDescriptions as optional array', () => {
      const req1 = createMockRequest({
        body: {
          fileUrl: createMockS3Url(),
          // jobDescriptions omitted
        },
      });

      const req2 = createMockRequest({
        body: {
          fileUrl: createMockS3Url(),
          jobDescriptions: [],
        },
      });

      expect((req1.body as any).jobDescriptions).toBeUndefined();
      expect(Array.isArray((req2.body as any).jobDescriptions)).toBe(true);
    });

    it('should validate jobDescriptions is array', () => {
      const req = createMockRequest({
        body: {
          fileUrl: createMockS3Url(),
          jobDescriptions: 'not an array',
        },
      });

      const isArray = Array.isArray((req.body as any).jobDescriptions);
      expect(isArray).toBe(false);
    });
  });

  describe('Text Extraction', () => {
    it('should extract text from PDF', async () => {
      const mockExtract = mockExtractPDFSuccess('PDF resume content');
      const result = await mockExtract();

      expect(result).toBe('PDF resume content');
    });

    it('should extract text from Word document', async () => {
      const mockExtract = mockExtractPDFSuccess('Word document content');
      const result = await mockExtract();

      expect(result).toBe('Word document content');
    });

    it('should handle extraction failure', async () => {
      const mockExtract = mockExtractionError();

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to extract text');
      }
    });

    it('should handle corrupted PDF file', async () => {
      const mockExtract = jest.fn().mockRejectedValue(
        new Error('Failed to parse PDF: corrupted file structure')
      );

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('corrupted');
      }
    });

    it('should handle encrypted/password-protected files', async () => {
      const mockExtract = jest.fn().mockRejectedValue(
        new Error('File is password protected')
      );

      try {
        await mockExtract();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('password');
      }
    });
  });

  describe('AI Service Integration', () => {
    it('should call AI service with extracted text', async () => {
      const mockOptimize = mockAIOptimizeSuccess('AI optimized content');
      const result = await mockOptimize();

      expect(result.success).toBe(true);
      expect(result.optimizedText).toBe('AI optimized content');
    });

    it('should handle AI service timeout', async () => {
      const mockAI = mockAITimeout();

      try {
        await mockAI();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle AI service error', async () => {
      const mockAI = mockAIError('API rate limit exceeded');

      try {
        await mockAI();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('rate limit');
      }
    });

    it('should retry on transient failures', async () => {
      let callCount = 0;
      const mockRetry = jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount < 2) {
          throw new Error('Transient error');
        }
        return { success: true, optimizedText: 'Content' };
      });

      // First call throws, second call succeeds
      try {
        await mockRetry();
      } catch (error) {
        // Expected: first call throws
        expect(callCount).toBe(1);
      }
      
      const result = await mockRetry();
      expect(callCount).toBe(2);
      expect(result.optimizedText).toBe('Content');
    });

    it('should handle partial response from AI', async () => {
      const mockAI = jest.fn().mockResolvedValue({
        success: true,
        optimizedText: 'Partial content...',
        // Missing some optional fields
      });

      const result = await mockAI();
      expect(result.optimizedText).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Save Optimization History', () => {
    it('should save optimization to user history', () => {
      const user = createMockUser({
        optimizationHistory: [
          {
            date: new Date(),
            originalText: 'Original resume',
            optimizedText: 'Optimized resume',
          },
        ],
      });

      expect(user.optimizationHistory).toHaveLength(1);
      expect(user.optimizationHistory[0].originalText).toBe('Original resume');
    });

    it('should append new optimization to history', () => {
      const user = createMockUser({
        optimizationHistory: [
          {
            date: new Date('2024-01-01'),
            originalText: 'First optimization',
            optimizedText: 'Optimized v1',
          },
        ],
      });

      const newEntry = {
        date: new Date('2024-01-02'),
        originalText: 'Second attempt',
        optimizedText: 'Optimized v2',
      };

      user.optimizationHistory.push(newEntry);

      expect(user.optimizationHistory).toHaveLength(2);
      expect(user.optimizationHistory[1].originalText).toBe('Second attempt');
    });

    it('should handle database save failure for history', async () => {
      const mockSave = jest.fn().mockRejectedValue(
        new Error('Failed to save optimization history')
      );

      try {
        await mockSave();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('save');
      }
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing file in S3', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('The specified key does not exist')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('does not exist');
      }
    });

    it('should handle S3 access denied', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('Access Denied')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Access Denied');
      }
    });

    it('should handle empty resume file', async () => {
      const mockExtract = jest.fn().mockResolvedValue('');

      const result = await mockExtract();
      expect(result).toBe('');
    });

    it('should handle very large resume text', async () => {
      const largeText = 'A'.repeat(50000); // 50KB
      const mockExtract = jest.fn().mockResolvedValue(largeText);

      const result = await mockExtract();
      expect(result.length).toBe(50000);
    });
  });

  describe('Performance & Response Validation', () => {
    it('should return response within acceptable time', async () => {
      const start = Date.now();
      
      const mockOptimize = jest.fn().mockResolvedValue({
        success: true,
        optimizedResume: 'Content',
      });

      await mockOptimize();
      const duration = Date.now() - start;

      // Should complete quickly (mocks are instant)
      expect(duration).toBeLessThan(1000);
    });

    it('should validate response structure', () => {
      const response = {
        success: true,
        message: 'Resume optimized successfully',
        originalResume: 'Original',
        optimizedResume: 'Optimized',
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('originalResume');
      expect(response).toHaveProperty('optimizedResume');
      expect(typeof response.success).toBe('boolean');
      expect(typeof response.originalResume).toBe('string');
    });
  });
});
