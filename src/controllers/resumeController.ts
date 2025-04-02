import {Request, Respone} from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { bucketName, s3Client } from '../config/s3Cofig';

// const bucketName = process.env.AWS_BUCKET_NAME

export const uploadResume = async (req:Request, res:Respone): Promise<void> =>{
    try {
    if(!req.file){
        res.status(400).json({message: 'No file uploaded'})
        return;
    }

    const file = req.file;
    const fileStream =fs.createReadStream(file.path)

    const fileName = `resumes/${Date.now()}-${file.originalname}`;

    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: file.mimetype
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      fs.unlinkSync(file.path);

      res.status(200).json({ 
        message: 'Resume uploaded successfully',
        fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`
      });


    } catch (error) {
        console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: (error as Error).message });
        
    }
}