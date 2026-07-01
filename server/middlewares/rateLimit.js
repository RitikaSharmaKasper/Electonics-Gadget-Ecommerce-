import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const getIP = (req) => req.ip;

const getKey = (req, prefix) => {
  if (req.user?.userId) {
    return `${prefix}:user:${req.user.userId}`;
  }
  return `${prefix}:ip:${getIP(req)}`;
};

// Global Limiter
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => getKey(req, "global"),

  skip: (req) => {
    const path = req.path;
    return (
      path.includes("/auth/login") ||
      path.includes("/auth/register") ||
      path.includes("/auth/forgot-password") ||
      path.includes("/auth/reset-password")
    );
  },

  message: {
    success: false,
    message: "Too many requests, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

// Login Limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  keyGenerator: (req) => {
    const identifier = (req.body?.identifier || "").toLowerCase().trim();
    return `login:${identifier || getIP(req)}`;
  },

  message: {
    success: false,
    message: "Too many login attempts. Try again in 1 minute.",
    code: "LOGIN_RATE_LIMIT",
  },
});

// Sensitive Limiter
export const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => getKey(req, "sensitive"),

  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
    code: "SENSITIVE_RATE_LIMIT",
  },
});

// General Limiter
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => getKey(req, "general"),

  message: {
    success: false,
    message: "Too many requests, please slow down.",
    code: "GENERAL_RATE_LIMIT",
  },
});

// Speed Limiter
export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,

  keyGenerator: (req) => `speed:${getIP(req)}`,
});
