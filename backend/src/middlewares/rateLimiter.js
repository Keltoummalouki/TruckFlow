import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 tentatives
    message: { success: false, message: "Too many login attempts, try again later" }
});

// lets one hundred requests in {max}.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});