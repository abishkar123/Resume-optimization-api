import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
interface S3FileResponse {
  Body: Buffer;
  ContentType: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "resume-bucket.ai";

export const uploadFileToS3 = async (fileBuffer, fileName, contentType) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return {
      Location: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Function to retrieve a file from S3
export const getFileFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    const fileBuffer = await streamToBuffer(response.Body);

    return {
      Body: fileBuffer,
      ContentType: response.ContentType || determineContentType(fileKey),
    };
  } catch (error) {
    console.error("Error getting file from S3:", error);
    throw new Error(`Failed to retrieve file from S3: ${error.message}`);
  }
};

// Helper function to determine content type from file extension
function determineContentType(fileKey) {
  if (fileKey.toLowerCase().endsWith(".pdf")) {
    return "application/pdf";
  } else if (fileKey.toLowerCase().endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (fileKey.toLowerCase().endsWith(".doc")) {
    return "application/msword";
  }
  return "application/octet-stream";
}

// Helper function to convert the S3 stream to a buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};
