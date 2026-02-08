import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseConfig";

export const authenticateUser = async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            status: "error",
            message: "No token provided. Authorization header must be 'Bearer <token>'",
        });
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
        };
        next();
    } catch (error: any) {
        console.error("Firebase Auth Error:", error.code, error.message);
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token",
        });
    }
};
