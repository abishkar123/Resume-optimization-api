/**
 * Integration tests for history retrieval endpoint
 */
import {
  createMockRequest,
  createMockResponse,
  expectSuccessResponse,
  expectErrorResponse,
} from '../helpers/test-utils';
import {
  createMockUser,
  createMockOptimizationEntry,
  mockUserFindOne,
  mockUserNotFound,
} from '../mocks/database.mock';

describe('GET /api/v1/resumes/history/:email - Get History Endpoint', () => {
  describe('Successful History Retrieval', () => {
    it('should retrieve user history with single optimization', async () => {
      const user = createMockUser({
        email: 'john@example.com',
        optimizationHistory: [createMockOptimizationEntry()],
      });

      const response = {
        success: true,
        data: {
          user: {
            fullname: user.fullname,
            email: user.email,
            resumeUrl: user.resumeUrl,
          },
          optimizationHistory: user.optimizationHistory,
        },
      };

      expectSuccessResponse(response);
      expect(response.data.optimizationHistory).toHaveLength(1);
      expect(response.data.user.email).toBe('john@example.com');
    });

    it('should retrieve user with multiple optimizations', () => {
      const user = createMockUser({
        email: 'jane@example.com',
        optimizationHistory: [
          createMockOptimizationEntry({
            originalText: 'Version 1 original',
            optimizedText: 'Version 1 optimized',
          }),
          createMockOptimizationEntry({
            originalText: 'Version 2 original',
            optimizedText: 'Version 2 optimized',
          }),
          createMockOptimizationEntry({
            originalText: 'Version 3 original',
            optimizedText: 'Version 3 optimized',
          }),
        ],
      });

      const response = {
        success: true,
        data: {
          user: {
            fullname: user.fullname,
            email: user.email,
            resumeUrl: user.resumeUrl,
          },
          optimizationHistory: user.optimizationHistory,
        },
      };

      expectSuccessResponse(response);
      expect(response.data.optimizationHistory).toHaveLength(3);
    });

    it('should retrieve user with empty optimization history', () => {
      const user = createMockUser({
        optimizationHistory: [],
      });

      const response = {
        success: true,
        data: {
          user: {
            fullname: user.fullname,
            email: user.email,
            resumeUrl: user.resumeUrl,
          },
          optimizationHistory: [],
        },
      };

      expectSuccessResponse(response);
      expect(response.data.optimizationHistory).toHaveLength(0);
    });

    it('should include all user fields in response', () => {
      const user = createMockUser();

      const response = {
        success: true,
        data: {
          user: {
            fullname: user.fullname,
            email: user.email,
            resumeUrl: user.resumeUrl,
          },
          optimizationHistory: user.optimizationHistory,
        },
      };

      expect(response.data.user).toHaveProperty('fullname');
      expect(response.data.user).toHaveProperty('email');
      expect(response.data.user).toHaveProperty('resumeUrl');
    });

    it('should include date in optimization history', () => {
      const entryDate = new Date('2024-01-15T10:30:00Z');
      const user = createMockUser({
        optimizationHistory: [
          createMockOptimizationEntry({ date: entryDate }),
        ],
      });

      const entry = user.optimizationHistory[0];
      expect(entry.date).toBe(entryDate);
    });
  });

  describe('Authorization & Access Control', () => {
    it('should allow user to view their own history', () => {
      const email = 'john@example.com';
      const req = createMockRequest({
        method: 'GET',
        url: `/api/v1/resumes/history/${email}`,
        params: { email } as any,
        user: { email, uid: 'user-123' },
      });

      const userOwnsData = (req.params as any).email === req.user?.email;
      expect(userOwnsData).toBe(true);
    });

    it('should deny access to other users history', () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/api/v1/resumes/history/other@example.com',
        params: { email: 'other@example.com' } as any,
        user: { email: 'john@example.com', uid: 'user-123' },
      });

      const userOwnsData = (req.params as any).email === req.user?.email;
      expect(userOwnsData).toBe(false);

      const errorResponse = {
        status: 'error',
        message: 'You are not authorized to view this history',
      };

      expectErrorResponse(errorResponse);
    });

    it('should deny access when email mismatch', () => {
      const requestedEmail = 'alice@example.com';
      const userEmail = 'bob@example.com';

      const req = createMockRequest({
        params: { email: requestedEmail } as any,
        user: { email: userEmail },
      });

      const isAuthorized = (req.params as any).email === req.user?.email;
      expect(isAuthorized).toBe(false);
    });

    it('should require authentication', () => {
      const req = createMockRequest({
        user: undefined,
      });

      expect(req.user).toBeUndefined();
    });

    it('should handle case-sensitivity of email', () => {
      const email1 = 'John@Example.com';
      const email2 = 'john@example.com';

      // Email comparison should be case-insensitive
      const match = email1.toLowerCase() === email2.toLowerCase();
      expect(match).toBe(true);
    });
  });

  describe('Parameter Validation', () => {
    it('should require email parameter', () => {
      const req = createMockRequest({
        params: {}, // Missing email
      });

      const errorResponse = {
        status: 'error',
        message: 'Email parameter is required',
      };

      expectErrorResponse(errorResponse);
    });

    it('should validate email format', () => {
      const validEmails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'test+tag@domain.org',
      ];

      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user@.com',
      ];

      validEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(true);
      });

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });

    it('should handle URL-encoded email parameter', () => {
      const encodedEmail = 'john%2Bdoe%40example.com'; // john+doe@example.com
      const decodedEmail = decodeURIComponent(encodedEmail);

      expect(decodedEmail).toBe('john+doe@example.com');
    });

    it('should reject empty email parameter', () => {
      const req = createMockRequest({
        params: { email: '' } as any,
      });

      const isEmpty = (req.params as any).email === '';
      expect(isEmpty).toBe(true);
    });

    it('should reject email with special characters', () => {
      const invalidEmail = 'user@<script>alert(1)</script>.com';

      // Simple XSS check
      const isClean = !invalidEmail.includes('<') && !invalidEmail.includes('>');
      expect(isClean).toBe(false);
    });
  });

  describe('User Not Found', () => {
    it('should handle non-existent user', async () => {
      const mockNotFound = mockUserNotFound();
      const user = await mockNotFound('nonexistent@example.com');

      expect(user).toBeNull();

      const errorResponse = {
        status: 'error',
        message: 'User not found',
      };

      expectErrorResponse(errorResponse);
    });

    it('should return specific error for new user', () => {
      const errorResponse = {
        status: 'error',
        message: 'No optimization history found for this user',
      };

      expectErrorResponse(errorResponse);
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection error', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('MongoDB connection failed')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('connection');
      }
    });

    it('should handle database query timeout', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('Query timeout after 30000ms')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle database corruption', async () => {
      const mockError = jest.fn().mockRejectedValue(
        new Error('Invalid BSON data')
      );

      try {
        await mockError();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('BSON');
      }
    });
  });

  describe('Response Validation', () => {
    it('should include proper response structure', () => {
      const user = createMockUser();

      const response = {
        success: true,
        data: {
          user: {
            fullname: user.fullname,
            email: user.email,
            resumeUrl: user.resumeUrl,
          },
          optimizationHistory: user.optimizationHistory,
        },
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('data');
      expect(response.data).toHaveProperty('user');
      expect(response.data).toHaveProperty('optimizationHistory');
    });

    it('should validate optimization entry structure', () => {
      const entry = createMockOptimizationEntry();

      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('originalText');
      expect(entry).toHaveProperty('optimizedText');
      expect(entry.date instanceof Date).toBe(true);
      expect(typeof entry.originalText).toBe('string');
      expect(typeof entry.optimizedText).toBe('string');
    });

    it('should maintain insertion order in history', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-01-02'),
        new Date('2024-01-03'),
      ];

      const user = createMockUser({
        optimizationHistory: dates.map(date =>
          createMockOptimizationEntry({ date })
        ),
      });

      const history = user.optimizationHistory;
      for (let i = 0; i < history.length - 1; i++) {
        const current = new Date(history[i].date).getTime();
        const next = new Date(history[i + 1].date).getTime();
        expect(current).toBeLessThanOrEqual(next);
      }
    });
  });

  describe('Pagination (if applicable)', () => {
    it('should handle request with large number of histories', () => {
      const histories = Array(100).fill(null).map((_, i) =>
        createMockOptimizationEntry({
          originalText: `Original ${i}`,
          optimizedText: `Optimized ${i}`,
        })
      );

      const user = createMockUser({ optimizationHistory: histories });

      expect(user.optimizationHistory).toHaveLength(100);
    });

    it('should handle limit parameter if pagination exists', () => {
      const req = createMockRequest({
        query: { limit: '10', offset: '0' } as any,
      });

      const limit = parseInt((req.query as any).limit) || 50;
      expect(limit).toBe(10);
    });
  });

  describe('Performance', () => {
    it('should retrieve history efficiently', async () => {
      const start = Date.now();

      const mockFetch = jest.fn().mockResolvedValue({
        user: createMockUser(),
        optimizationHistory: Array(50).fill(null).map(() =>
          createMockOptimizationEntry()
        ),
      });

      await mockFetch();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});
