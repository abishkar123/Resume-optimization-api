/**
 * Unit tests for validators and utility functions
 */
describe('Validator Unit Tests', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('user@example.com')).toBe(true);
      expect(emailRegex.test('john.doe@company.co.uk')).toBe(true);
      expect(emailRegex.test('test+tag@domain.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('not-an-email')).toBe(false);
      expect(emailRegex.test('@example.com')).toBe(false);
      expect(emailRegex.test('user@')).toBe(false);
      expect(emailRegex.test('user@.com')).toBe(false);
    });

    it('should reject empty email', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('')).toBe(false);
    });

    it('should reject email with spaces', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('user @example.com')).toBe(false);
      expect(emailRegex.test('user@ example.com')).toBe(false);
    });

    it('should be case-insensitive for validation', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
      
      expect(emailRegex.test('USER@EXAMPLE.COM')).toBe(true);
      expect(emailRegex.test('User@Example.Com')).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const email = 'User@Example.COM';
      const normalized = email.toLowerCase();
      
      expect(normalized).toBe('user@example.com');
    });
  });

  describe('URL Validation', () => {
    it('should validate S3 URLs', () => {
      const s3Regex = /^https:\/\/.*\.s3.*\.amazonaws\.com\//;
      
      expect(s3Regex.test('https://bucket.s3.amazonaws.com/path/file.pdf')).toBe(true);
      expect(s3Regex.test('https://bucket.s3.us-west-2.amazonaws.com/path/file.pdf')).toBe(true);
    });

    it('should reject non-HTTPS URLs', () => {
      const s3Regex = /^https:\/\/.*\.s3.*\.amazonaws\.com\//;
      
      expect(s3Regex.test('http://bucket.s3.amazonaws.com/path/file.pdf')).toBe(false);
    });

    it('should reject non-S3 URLs', () => {
      const s3Regex = /^https:\/\/.*\.s3.*\.amazonaws\.com\//;
      
      expect(s3Regex.test('https://example.com/file.pdf')).toBe(false);
    });

    it('should validate URL structure', () => {
      const url = 'https://bucket.s3.amazonaws.com/key';
      const isValid = url.startsWith('https://') && url.includes('.s3');
      
      expect(isValid).toBe(true);
    });
  });

  describe('String Validators', () => {
    it('should validate non-empty string', () => {
      const isValid = (str: string) => Boolean(str && str.trim().length > 0);
      
      expect(isValid('hello')).toBe(true);
      expect(isValid('')).toBe(false);
      expect(isValid('   ')).toBe(false);
    });

    it('should validate string length', () => {
      const isValid = (str: string, min: number, max: number) => 
        str.length >= min && str.length <= max;
      
      expect(isValid('hello', 1, 10)).toBe(true);
      expect(isValid('hello', 10, 20)).toBe(false);
    });

    it('should trim whitespace', () => {
      const text = '  hello world  ';
      const trimmed = text.trim();
      
      expect(trimmed).toBe('hello world');
      expect(trimmed).not.toContain('  ');
    });

    it('should validate alphanumeric strings', () => {
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      
      expect(alphanumericRegex.test('abc123')).toBe(true);
      expect(alphanumericRegex.test('ABC123')).toBe(true);
      expect(alphanumericRegex.test('abc-123')).toBe(false);
    });

    it('should handle special characters', () => {
      const text = 'Hello © World ™';
      
      expect(text).toContain('©');
      expect(text).toContain('™');
    });
  });

  describe('File Name Validators', () => {
    it('should extract file extension', () => {
      const getExt = (filename: string) => filename.split('.').pop()?.toLowerCase() || '';
      
      expect(getExt('resume.pdf')).toBe('pdf');
      expect(getExt('document.docx')).toBe('docx');
      expect(getExt('file.doc')).toBe('doc');
    });

    it('should validate file extension', () => {
      const validExtensions = ['pdf', 'doc', 'docx'];
      const isValid = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        return validExtensions.includes(ext);
      };
      
      expect(isValid('resume.pdf')).toBe(true);
      expect(isValid('resume.docx')).toBe(true);
      expect(isValid('image.jpg')).toBe(false);
    });

    it('should handle files without extension', () => {
      const getExt = (filename: string) => filename.split('.').pop()?.toLowerCase() || '';
      
      expect(getExt('filename')).toBe('filename');
    });

    it('should handle files with multiple dots', () => {
      const getExt = (filename: string) => filename.split('.').pop()?.toLowerCase() || '';
      
      expect(getExt('my.resume.pdf')).toBe('pdf');
      expect(getExt('archive.tar.gz')).toBe('gz');
    });

    it('should sanitize filename', () => {
      const sanitize = (filename: string) => 
        filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      
      expect(sanitize('my resume.pdf')).toBe('my_resume.pdf');
      expect(sanitize('file@#$.doc')).toBe('file___.doc');
    });
  });

  describe('Number Validators', () => {
    it('should validate positive integers', () => {
      const isPositive = (num: number) => num > 0 && Number.isInteger(num);
      
      expect(isPositive(5)).toBe(true);
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-5)).toBe(false);
      expect(isPositive(5.5)).toBe(false);
    });

    it('should validate number range', () => {
      const isInRange = (num: number, min: number, max: number) => 
        num >= min && num <= max;
      
      expect(isInRange(50, 0, 100)).toBe(true);
      expect(isInRange(-5, 0, 100)).toBe(false);
      expect(isInRange(150, 0, 100)).toBe(false);
    });

    it('should validate file size', () => {
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const isValidSize = (size: number) => size <= maxSizeBytes;
      
      expect(isValidSize(1024 * 100)).toBe(true); // 100KB
      expect(isValidSize(6 * 1024 * 1024)).toBe(false); // 6MB
    });

    it('should parse string to number safely', () => {
      const parseNum = (str: string, defaultValue: number = 0) => {
        const num = parseInt(str, 10);
        return isNaN(num) ? defaultValue : num;
      };
      
      expect(parseNum('123')).toBe(123);
      expect(parseNum('abc')).toBe(0);
      expect(parseNum('abc', -1)).toBe(-1);
    });
  });

  describe('Array Validators', () => {
    it('should validate non-empty array', () => {
      const isValidArray = (arr: any) => Array.isArray(arr) && arr.length > 0;
      
      expect(isValidArray([1, 2, 3])).toBe(true);
      expect(isValidArray([])).toBe(false);
      expect(isValidArray('not an array')).toBe(false);
    });

    it('should validate array length', () => {
      const isValidLength = (arr: any[], min: number, max: number) => 
        arr.length >= min && arr.length <= max;
      
      expect(isValidLength([1, 2, 3], 1, 5)).toBe(true);
      expect(isValidLength([1], 2, 5)).toBe(false);
    });

    it('should filter out empty strings', () => {
      const arr = ['hello', '', 'world', '   '];
      const filtered = arr.filter(str => str && str.trim().length > 0);
      
      expect(filtered).toEqual(['hello', 'world']);
    });

    it('should remove duplicates', () => {
      const arr = [1, 2, 2, 3, 3, 3];
      const unique = [...new Set(arr)];
      
      expect(unique).toEqual([1, 2, 3]);
    });
  });

  describe('Object Validators', () => {
    it('should validate required fields', () => {
      const validateRequired = (obj: any, fields: string[]) => 
        fields.every(field => field in obj && obj[field] !== undefined && obj[field] !== null);
      
      const obj1 = { name: 'John', email: 'john@example.com' };
      const obj2 = { name: 'Jane' };
      
      expect(validateRequired(obj1, ['name', 'email'])).toBe(true);
      expect(validateRequired(obj2, ['name', 'email'])).toBe(false);
    });

    it('should validate object types', () => {
      const validateTypes = (obj: any, types: Record<string, string>) => 
        Object.entries(types).every(([key, type]) => typeof obj[key] === type);
      
      const obj = { name: 'John', age: 30, active: true };
      
      expect(validateTypes(obj, { name: 'string', age: 'number', active: 'boolean' })).toBe(true);
      expect(validateTypes(obj, { name: 'string', age: 'string' })).toBe(false);
    });

    it('should deeply validate nested objects', () => {
      const isValidUser = (obj: any) => {
        return Boolean(obj.id && typeof obj.id === 'number' &&
                obj.email && typeof obj.email === 'string' &&
                obj.profile && typeof obj.profile === 'object');
      };
      
      const valid = { id: 1, email: 'test@example.com', profile: { name: 'Test' } };
      const invalid = { id: 1, email: 'test@example.com' };
      
      expect(isValidUser(valid)).toBe(true);
      expect(isValidUser(invalid)).toBe(false);
    });
  });

  describe('Date/Time Validators', () => {
    it('should validate date format', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
      
      expect(dateRegex.test('2024-01-15')).toBe(true);
      expect(dateRegex.test('01-15-2024')).toBe(false);
    });

    it('should validate ISO date string', () => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      
      expect(isoRegex.test('2024-01-15T10:30:00Z')).toBe(true);
      expect(isoRegex.test('2024-01-15')).toBe(false);
    });

    it('should validate timestamp is recent', () => {
      const isRecent = (timestamp: number, maxAgeMs: number = 86400000) => // 24 hours
        Date.now() - timestamp < maxAgeMs;
      
      expect(isRecent(Date.now())).toBe(true);
      expect(isRecent(Date.now() - 1000 * 60 * 60 * 25)).toBe(false); // 25 hours old
    });

    it('should validate timestamp is valid', () => {
      const isValidTimestamp = (timestamp: number) => 
        typeof timestamp === 'number' && timestamp > 0;
      
      expect(isValidTimestamp(Date.now())).toBe(true);
      expect(isValidTimestamp(-1)).toBe(false);
      expect(isValidTimestamp(0)).toBe(false);
    });
  });

  describe('Response Validators', () => {
    it('should validate success response structure', () => {
      const validateSuccessResponse = (obj: any) => {
        return obj.success === true &&
               'message' in obj &&
               typeof obj.message === 'string';
      };
      
      const validResponse = { success: true, message: 'Operation successful', data: {} };
      const invalidResponse = { success: false, message: 'Error' };
      
      expect(validateSuccessResponse(validResponse)).toBe(true);
      expect(validateSuccessResponse(invalidResponse)).toBe(false);
    });

    it('should validate error response structure', () => {
      const validateErrorResponse = (obj: any) => {
        return obj.status === 'error' &&
               'message' in obj &&
               typeof obj.message === 'string';
      };
      
      const validError = { status: 'error', message: 'Something went wrong' };
      const invalidError = { status: 'error' };
      
      expect(validateErrorResponse(validError)).toBe(true);
      expect(validateErrorResponse(invalidError)).toBe(false);
    });

    it('should validate HTTP status code', () => {
      const isValidStatusCode = (code: number) => 
        code >= 100 && code < 600 && Number.isInteger(code);
      
      expect(isValidStatusCode(200)).toBe(true);
      expect(isValidStatusCode(404)).toBe(true);
      expect(isValidStatusCode(500)).toBe(true);
      expect(isValidStatusCode(600)).toBe(false);
      expect(isValidStatusCode(99)).toBe(false);
    });
  });

  describe('Security Validators', () => {
    it('should detect XSS attempts', () => {
      const hasXSS = (str: string) => 
        /<script|<iframe|<img|<svg|javascript:|onerror=/i.test(str);
      
      expect(hasXSS('<script>alert("xss")</script>')).toBe(true);
      expect(hasXSS('Hello World')).toBe(false);
      expect(hasXSS('<img onerror=alert(1)>')).toBe(true);
    });

    it('should detect SQL injection attempts', () => {
      const hasSQLInjection = (str: string) => 
        /('|--)|(DROP|DELETE|INSERT|UPDATE|SELECT)\s+(FROM|TABLE|INTO|VALUES)/i.test(str);
      
      expect(hasSQLInjection("'; DROP TABLE users;--")).toBe(true);
      expect(hasSQLInjection('Hello World')).toBe(false);
    });

    it('should sanitize user input', () => {
      const sanitize = (str: string) => 
        str.replace(/[<>'"]/g, '');
      
      expect(sanitize('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    });

    it('should escape special characters', () => {
      const escape = (str: string) => 
        str.replace(/[&<>"']/g, char => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char] || char));
      
      const result = escape('<div>"test"</div>');
      expect(result).toBe('&lt;div&gt;&quot;test&quot;&lt;/div&gt;');
    });
  });
});
