import { Request, Respone } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { bucketName, s3Client } from "../config/s3Cofig";
import { postResume } from "../model/upload/UploadModel";

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
