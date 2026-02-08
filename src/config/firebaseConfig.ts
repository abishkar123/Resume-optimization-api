import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// For local development, you should download your service account key JSON 
// and set the path in GOOGLE_APPLICATION_CREDENTIALS environment variable.
// Alternatively, we can initialize with project ID if running in a Google environment.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            projectId: process.env.GOOGLE_PROJECT_ID || "resume-optimization-b0f27",
        });
        console.log("Firebase Admin initialized");
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

export const auth = admin.auth();
