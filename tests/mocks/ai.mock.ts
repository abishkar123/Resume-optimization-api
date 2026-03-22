/**
 * Mock AI/LLM services (Google Gemini)
 */
export const mockAIService = {
  optimizeResume: jest.fn(),
};

/**
 * Mock successful AI optimization
 */
export const mockAIOptimizeSuccess = (optimizedContent = 'AI-optimized resume') => {
  return jest.fn().mockResolvedValue({
    success: true,
    optimizedText: optimizedContent,
    summary: 'Professional Summary (3-4 lines)',
    bullets: [
      '• Achieved 50% performance improvement through database optimization',
      '• Led cross-functional team of 5 engineers on critical infrastructure project',
      '• Implemented automated testing increasing code coverage from 60% to 95%',
    ],
    keywords: {
      technical: ['TypeScript', 'Node.js', 'MongoDB', 'AWS'],
      soft_skills: ['Leadership', 'Communication', 'Problem-solving'],
    },
  });
};

/**
 * Mock AI service timeout
 */
export const mockAITimeout = () => {
  return jest.fn().mockRejectedValue(new Error('AI service timeout'));
};

/**
 * Mock AI service error
 */
export const mockAIError = (message = 'AI service failed') => {
  return jest.fn().mockRejectedValue(new Error(message));
};

/**
 * Mock text extraction services
 */
export const mockTextExtraction = {
  extractFromPDF: jest.fn(),
  extractFromWord: jest.fn(),
};

/**
 * Mock PDF extraction success
 */
export const mockExtractPDFSuccess = (text = 'Sample resume content from PDF') => {
  return jest.fn().mockResolvedValue(text);
};

/**
 * Mock Word extraction success
 */
export const mockExtractWordSuccess = (text = 'Sample resume content from Word') => {
  return jest.fn().mockResolvedValue(text);
};

/**
 * Mock extraction failure
 */
export const mockExtractionError = () => {
  return jest.fn().mockRejectedValue(new Error('Failed to extract text from file'));
};
