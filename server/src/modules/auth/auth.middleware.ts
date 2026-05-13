import type { Request, Response, NextFunction } from "express";
import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt.utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
    }
    // Augment Express.Request with our user shape
    interface Request {
      user?: UserPayload;
    }
  }
}

/** Hard-required auth — rejects when no valid token is present. */
const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Not authenticated");
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) throw ApiError.unauthorized("Not authenticated");

    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
};

const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  const token = header.slice("Bearer ".length).trim();
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email };
  } catch {
    // ignore — endpoint is public
  }
  next();
};

export { authenticate, optionalAuth };
