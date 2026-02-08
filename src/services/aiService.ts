import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini model via LangChain
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-lite-001",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
  maxOutputTokens: 8192,
});

// System prompt template - Elite resume optimization instructions
const systemTemplate = `You are an elite Certified Professional Resume Writer (CPRW) with 15+ years at top executive search firms.

YOUR EXPERTISE:
- ATS optimization (Taleo, Workday, Greenhouse, Lever)
- Industry expertise: Tech, Finance, Healthcare, Consulting, Creative

OPTIMIZATION RULES:
1. Professional Summary: 3-4 lines with years of experience, 2-3 quantified achievements, unique value proposition
2. Experience bullets use CAR format: Challenge → Action → Result with metrics (%, $, time, scale)
3. Transform weak bullets: "Responsible for X" → "Spearheaded X, achieving Y% improvement"
4. Skills: 12-15 ATS keywords grouped by category (Technical, Tools, Methodologies)
5. Formatting: Single column, no tables/images, consistent dates (Month YYYY)
6. Length: 1 page for <5 years exp, max 2 pages for senior
7. Never use first-person pronouns (I, me, my)
8. Every bullet must show measurable impact

OUTPUT INSTRUCTIONS:
Return ONLY the optimized resume text. No explanations or commentary.
Do not use markdown formatting (**, ##) in the output.`;

// Human prompt template with variables
const humanTemplate = `TARGET ROLE/INDUSTRY: {targetRole}

RESUME TO OPTIMIZE:
{resumeText}

{jobDescriptionSection}

OPTIMIZED RESUME:`;

// Create the prompt template
const chatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(systemTemplate),
  HumanMessagePromptTemplate.fromTemplate(humanTemplate),
]);

// Create the chain: prompt -> model -> output parser
const chain = RunnableSequence.from([
  chatPrompt,
  model,
  new StringOutputParser(),
]);

/**
 * Optimize a resume using LangChain with Google Gemini
 * @param resumeText - The raw resume text to optimize
 * @param targetRole - Target job role or industry
 * @param jobDescriptions - Optional array of job descriptions for keyword matching
 * @returns The optimized resume text
 */
export const optimizeResumeAI = async (
  resumeText: string,
  targetRole: string,
  jobDescriptions: string[] = []
): Promise<string> => {
  if (!resumeText) throw new Error("Resume text is required.");
  if (!targetRole) throw new Error("Target role/industry is required.");

  try {
    // Build job description section if provided
    const jobDescriptionSection = jobDescriptions.length > 0
      ? `JOB DESCRIPTIONS FOR KEYWORD REFERENCE:\n${jobDescriptions.join("\n\n---\n\n")}`
      : "";

    // Invoke the chain with template variables
    const result = await chain.invoke({
      targetRole,
      resumeText,
      jobDescriptionSection,
    });

    return result;
  } catch (error) {
    console.error("AI optimization error:", error);
    throw new Error("Failed to optimize resume with AI service");
  }
};

/**
 * Alternative: Get structured analysis with recommendations
 */
export const analyzeResumeAI = async (
  resumeText: string,
  targetRole: string
): Promise<{
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  optimizedResume: string;
}> => {
  const analysisSystemTemplate = `You are an expert resume analyst. Analyze the resume and provide structured feedback.

Return your response in this exact JSON format:
{{
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "optimizedResume": "The complete optimized resume text"
}}`;

  const analysisHumanTemplate = `TARGET ROLE: {targetRole}

RESUME:
{resumeText}

Analyze and optimize this resume. Return JSON only.`;

  const analysisPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(analysisSystemTemplate),
    HumanMessagePromptTemplate.fromTemplate(analysisHumanTemplate),
  ]);

  const analysisChain = RunnableSequence.from([
    analysisPrompt,
    model,
    new StringOutputParser(),
  ]);

  try {
    const result = await analysisChain.invoke({
      targetRole,
      resumeText,
    });

    // Parse JSON response
    const parsed = JSON.parse(result);
    return parsed;
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume");
  }
};
