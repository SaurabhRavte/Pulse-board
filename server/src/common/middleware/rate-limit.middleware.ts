import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

interface Bucket {
  count: number;
  resetAt: number;
}

interface Options {
  windowMs: number;
  max: number;

  keyGenerator?: (req: Request) => string;
  message?: string;
}

const createRateLimiter = ({
  windowMs,
  max,
  keyGenerator,
  message = "Too many requests, please try again later",
}: Options) => {
  const store = new Map<string, Bucket>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, windowMs).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator ? keyGenerator(req) : `${req.ip}:${req.path}`;
    const now = Date.now();

    let bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader(
      "X-RateLimit-Reset",
      String(Math.ceil(bucket.resetAt / 1000)),
    );

    if (bucket.count > max) {
      return next(ApiError.tooManyRequests(message));
    }
    next();
  };
};

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many auth attempts — slow down",
});

export const submitResponseLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many submissions — please wait a moment",
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
});

export default createRateLimiter;
