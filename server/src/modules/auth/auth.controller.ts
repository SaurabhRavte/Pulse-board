import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import ApiResponse from "../../common/utils/api-response";

/** Standard cookie options for the refresh token. */
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    return ApiResponse.created(res, "Registration successful", user);
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return ApiResponse.ok(res, "Login successful", { user, accessToken });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken } = await authService.refresh(token);
    return ApiResponse.ok(res, "Token refreshed", { accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.user!.id);
    res.clearCookie("refreshToken", { path: "/" });
    return ApiResponse.ok(res, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    return ApiResponse.ok(res, "User profile", user);
  } catch (err) {
    next(err);
  }
};

const clerkSync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.syncClerkUser(
      req.body,
    );
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return ApiResponse.ok(res, "Clerk session linked", { user, accessToken });
  } catch (err) {
    next(err);
  }
};

export { register, login, refreshToken, logout, getMe, clerkSync };
