import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

export const bucketName = (
  process.env.AWS_BUCKET_NAME || "resume-bucket.ai"
).trim();

export const s3Client = new S3Client({
  region: (process.env.AWS_REGION || "ap-southeast-2").trim(),
  credentials: {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || "").trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || "").trim(),
  },
});

export const getFile = async (fileUrl: string): Promise<Buffer> => {
  const key = fileUrl.includes("amazonaws.com")
    ? fileUrl.split("/").slice(3).join("/")
    : fileUrl;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const { Body } = await s3Client.send(command);
    const stream = Body as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error("S3 download error:", error);
    throw new Error("Failed to retrieve file from S3");
  }
};
