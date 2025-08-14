import { rateLimit, ipKeyGenerator } from "express-rate-limit";

//general rate limit for authentication endpoints
export const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, //2 minute
  max: 10, //attempts within a 2 min window
  message: "Too many requests, please try again later",
  standardHeaders: true, //return rate limit info in headers
  keyGenerator: (req) => {
    //use ip address + user agent to identify unique clients
    return `${ipKeyGenerator(req.ip)}-${
      req.headers["user-agent"] || "unknown-user-agent"
    }`;
  },
  legacyHeaders: false, //disable X-RateLimit headers
  trustProxy: true, //trust the X-Forwarded-For header
});

//rate limit for refresh token endpoint
export const refreshTokenLimit = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minute
  max: 30, //attempts within a 30 min window
  message: "Too many requests, please try again later",
  standardHeaders: true, //return rate limit info in headers
  keyGenerator: (req) => {
    //use ip address + user agent to identify unique clients
    return `${ipKeyGenerator(req.ip)}-${
      req.headers["user-agent"] || "unknown-user-agent"
    }`;
  },
  legacyHeaders: false, //disable X-RateLimit headers
  trustProxy: true, //trust the X-Forwarded-For header
});
