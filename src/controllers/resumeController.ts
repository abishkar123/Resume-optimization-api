import {
  getuserbygmail,
  postResume,
  updateUserOptimizationHistory,
} from "../model/upload/UploadModel";
import { optimizeResumeAI } from "../services/aiService";
import { getFileFromS3, uploadFileToS3 } from "../services/s3Service";
import { extractTextFromFile } from "../services/textExtractionService";
import { catchAsync } from "../utils/catchAsync";

export const uploadResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error("Please upload a resume file");
  }

  const { fullname } = req.body;
  const email = (req as any).user?.email;

  if (!email) {
    throw new Error("User email not found in token");
  }

  if (!fullname) {
    throw new Error("Full name is required");
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
  const { fileUrl, targetRole, jobDescriptions } = req.body;
  const email = (req as any).user?.email;

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

  // Use default target role if not provided
  const role = targetRole || "General Professional";
  const jobDescs = jobDescriptions || [];

  // LangChain returns optimized resume as string
  const optimizedResume = await optimizeResumeAI(resumeText, role, jobDescs);

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
  const authEmail = (req as any).user?.email;

  if (!email) {
    throw new Error("Email is required");
  }

  if (email !== authEmail) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view this history",
    });
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
