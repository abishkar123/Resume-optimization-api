import {
  getuserbygmail,
  postResume,
  updateUserOptimizationHistory,
} from "../model/upload/UploadModel";
import { optimizeResumeai } from "../services/aiService";
import { getFileFromS3, uploadFileToS3 } from "../services/s3Service";
import { extractTextFromFile } from "../services/textExtractionService";
import { catchAsync } from "../utils/catchAsync";

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
