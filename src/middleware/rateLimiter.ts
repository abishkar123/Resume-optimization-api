import rateLimit from "express-rate-limit";

// General rate limiter for all API requests
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: "error",
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

// Strict rate limiter for AI-intensive routes (e.g., resume optimization)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 optimizations per hour to control costs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "You have reached your hourly limit for AI optimizations. Please try again later.",
    },
});

// Stricter rate limiter for uploads
export const uploadLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5, // Limit each IP to 5 uploads per 30 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Too many upload attempts. Please try again after 30 minutes.",
    },
});
