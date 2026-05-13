import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import crypto from "node:crypto";
import ApiError from "./api-error";

const ACCESS_SECRET: Secret = (process.env.JWT_ACCESS_SECRET ||
  "dev-access-secret-change-me") as Secret;
const REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET ||
  "dev-refresh-secret-change-me") as Secret;

const ACCESS_TTL: SignOptions["expiresIn"] =
  (process.env.JWT_ACCESS_TTL as SignOptions["expiresIn"]) || "15m";
const REFRESH_TTL: SignOptions["expiresIn"] =
  (process.env.JWT_REFRESH_TTL as SignOptions["expiresIn"]) || "7d";

export interface AccessTokenPayload {
  id: string;
  email: string;
}

export interface RefreshTokenPayload {
  id: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });

export const generateRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }
};

/** SHA-256 hash used to store refresh tokens / fingerprint IPs in DB. */
export const hashString = (input: string): string =>
  crypto.createHash("sha256").update(input).digest("hex");
