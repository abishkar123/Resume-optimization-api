import {
  getResumeForDownload,
  getuserbygmail,
  postResume,
  updateUserOptimizationHistory,
} from "../model/upload/UploadModel";
import { optimizeResumeai } from "../services/aiService";
import { getFileFromS3, uploadFileToS3 } from "../services/s3Service";
import { extractTextFromFile } from "../services/textExtractionService";
import { catchAsync } from "../utils/catchAsync";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createDocx } from "../utils/docxGenerator";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.8,
  topk: 40,
};

const model = "gemini-2.0-flash-lite-001";

export const uploadResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error("Please upload a resume file");
  }

  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new Error("Full name and email are required");
  }

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const fileKey = `resumes/${email}/${fileName}`;

  const uploadResult = await uploadFileToS3(
    req.file.buffer,
    fileKey,
    req.file.mimetype
  );

  const existingUser = await getuserbygmail(email);

  if (existingUser) {
    existingUser.fullname = fullname;
    existingUser.resumeUrl = uploadResult.Location;
    await existingUser.save();
  } else {
    await postResume({
      fullname,
      email,
      resumeUrl: uploadResult.Location,
    });
  }

  res.status(201).json({
    success: true,
    message: "Resume uploaded successfully",
    fileUrl: uploadResult.Location,
    fileKey: fileKey,
  });
});

export const optimizeResume = catchAsync(async (req, res) => {
  const { email, fileUrl } = req.body;

  if (!email || !fileUrl) {
    throw new Error("Email and file URL are required");
  }

  // Extract fileKey from the fileUrl
  const fileKey = fileUrl.split("amazonaws.com/")[1];

  if (!fileKey) {
    throw new Error("Invalid file URL");
  }

  const fileData = await getFileFromS3(fileKey);
  const resumeText = await extractTextFromFile(
    fileData.Body,
    fileData.ContentType
  );

  if (!resumeText) {
    throw new Error("Failed to extract text from the resume");
  }

  const optimizedResume = await optimizeResumeai(resumeText);

  // Save optimization history
  await updateUserOptimizationHistory(email, resumeText, optimizedResume);

  res.status(201).json({
    success: true,
    message: "Resume optimized successfully",
    originalResume: resumeText,
    optimizedResume: optimizedResume,
  });
});

export const getUserHistory = catchAsync(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await getuserbygmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        fullname: user.fullname,
        email: user.email,
        resumeUrl: user.resumeUrl,
      },
      optimizationHistory: user.optimizationHistory,
    },
  });
});

export const downloadResume = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, type } = req.body;

      const resumeData = await getResumeForDownload(email);

      const formattedResume = await formatResumeWithAI(
        resumeData.fullname,
        resumeData.email,
        resumeData.originalText,
        resumeData.optimizedText
      );

      const docxBuffer = await createDocx(formattedResume);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${resumeData.fullname.replace(
          /\s+/g,
          "_"
        )}_Resume.docx`
      );

      res.send(docxBuffer);
    } catch (error) {
      console.error("Error in downloadResume:", error);
      next({
        message: error.message || "Failed to generate resume document",
        errorCode: 500,
      });
    }
  }
);

async function formatResumeWithAI(
  fullname: string,
  email: string,
  originalText: string,
  optimizedText: string
) {
  try {
    const chat = ai.chats.create({
      model: model,
      config: generationConfig,
    });

    // System instruction
    const systemInstruction = {
      message: `You are a resume creation assistant. Your job is to analyze raw text and convert it into a well-formatted, professional resume in a Microsoft Word (.docx) document. Formatting Guidelines: Font Family: Use Calibri or Arial Font Color: Black Alignment: Left-aligned except for name and section headings (centered or bolded) Font Sizes by Section: SectionFont SizeFont StyleFull Name (Header)20 ptBold, CenteredContact Information11 ptRegular, CenteredSection Headings (e.g., Skills)14 ptBold, UppercaseSubheadings (e.g., Job Titles)12 ptBoldBody Text (e.g., descriptions)11 ptRegularDates11 ptItalic Structure: If available, organize the resume using these sections in the following order: Full Name and Contact Information Professional Summary Skills Work Experience Education Certifications Projects References (optional) Rules: Do not use asterisks (*) or bullet symbols like •. Use clean formatting only. Do not add any extra comments or information outside the resume content. Ensure consistent spacing and formatting throughout the document. Only return the resume content, formatted for use in a Word document.`,
    };

    // User inputs
    const userInput1 = {
      message: `Resume data:\nName: ${fullname}\nEmail: ${email}\nOriginal Text: ${originalText}\nOptimized Text: ${optimizedText}`,
    };

    const userInput2 = {
      message: `Convert the above resume data into a properly formatted resume according to the instructions. Format it so it's ready to be inserted into a Word document.`,
    };

    // Send messages
    await chat.sendMessage(systemInstruction);
    await chat.sendMessage(userInput1);
    const response = await chat.sendMessage(userInput2);

    return response.text;
  } catch (error) {
    console.error("Error formatting resume with AI:", error);
    throw new Error(`AI formatting error: ${error.message || "Unknown error"}`);
  }
}
