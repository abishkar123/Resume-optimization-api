import { Request, Respone } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { bucketName, getFile, s3Client } from "../config/s3Cofig";
import { getuserbygmail, postResume } from "../model/upload/UploadModel";
import User from "../model/upload/userSchema";
import { extractTextFromPDF } from "../utils/pdfparser";
import { optimizeResume } from "../services/optimizeResume";

// const bucketName = process.env.AWS_BUCKET_NAME

export const uploadResume = async (
  req: Request,
  res: Respone
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ status: "error", message: "No file uploaded" });
      return;
    }

    const file = req.file;
    const fileStream = fs.createReadStream(file.path);

    const fileName = `resumes/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    fs.unlinkSync(file.path);

    const result = (await postResume({
      ...req.body,
      resumeUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
    })) as { resumeUrl: string } & typeof result;

    res.status(201).json({
      status: "sucess",
      message: "Resume uploaded successfully",
      fileUrl: result.resumeUrl,
      resume: result,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Error uploading file",
      error: (error as Error).message,
    });
  }
};

export const optimizeUserResume = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log(email);
    // Find user in MongoDB
    const user = await getuserbygmail(email);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get resume from S3
    const resumeBuffer = await getFile(user.resumeUrl);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(resumeBuffer);

    // Get optimized resume from AI service
    const optimizedResume = await optimizeResume(resumeText);

    console.log(optimizedResume);
    // Save optimization history
    user.optimizationHistory.push({
      date: new Date(),
      originalText: resumeText,
      optimizedText: optimizedResume,
    });

    await user.save();

    res.json({
      success: true,
      originalResume: resumeText,
      optimizedResume,
      user: {
        fullName: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Resume optimization failed:", error);
    res
      .status(500)
      .json({ error: "Resume optimization failed", details: error.message });
  }
};
