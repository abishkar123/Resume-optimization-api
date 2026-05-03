export const mockExtractPDFSuccess = (text = "Extracted PDF text") => {
  return jest.fn().mockResolvedValue(text);
};

export const mockExtractWordSuccess = (text = "Extracted Word text") => {
  return jest.fn().mockResolvedValue(text);
};

export const mockExtractionError = () => {
  return jest.fn().mockRejectedValue(new Error("Failed to extract text"));
};

export const mockAIOptimizeSuccess = (optimizedText = "Optimized resume text") => {
  return jest.fn().mockResolvedValue({
    success: true,
    optimizedText,
    summary: "Improved resume summary",
    bullets: ["• Improved measurable impact", "• Strengthened ATS keywords"],
    keywords: {
      technical: ["TypeScript", "Node.js"],
      soft_skills: ["Communication", "Leadership"],
    },
  });
};

export const mockAITimeout = () => {
  return jest.fn().mockRejectedValue(new Error("AI service timeout"));
};

export const mockAIError = (message = "AI service error") => {
  return jest.fn().mockRejectedValue(new Error(message));
};
