import bcrypt from "bcrypt";
import ApiError from "../../common/utils/api-error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashString,
} from "../../common/utils/jwt.utils";
import UserModel from "./auth.model";
import type { User } from "../../common/db/schema";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ClerkSyncInput {
  clerkId: string;
  email: string;
  name: string;
}

const toPublic = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const register = async ({ name, email, password }: RegisterInput) => {
  const existing = await UserModel.findByEmail(email);
  if (existing) throw ApiError.conflict("Email already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  return toPublic(user);
};

const login = async ({ email, password }: LoginInput) => {
  const user = await UserModel.findByEmail(email);

  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized("Invalid email or password");

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  await UserModel.updateRefreshToken(user.id, hashString(refreshToken));

  return { user: toPublic(user), accessToken, refreshToken };
};

const refresh = async (token: string | undefined) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");

  const decoded = verifyRefreshToken(token);

  const user = await UserModel.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  if (user.refreshTokenHash !== hashString(token)) {
    throw ApiError.unauthorized("Invalid refresh token, please log in again");
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  return { accessToken };
};

const logout = async (userId: string) => {
  await UserModel.updateRefreshToken(userId, null);
};

const getMe = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return toPublic(user);
};

const syncClerkUser = async ({ clerkId, email, name }: ClerkSyncInput) => {
  let user = await UserModel.findByClerkId(clerkId);

  if (!user) {
    const byEmail = await UserModel.findByEmail(email);
    if (byEmail) {
      user = byEmail;
    } else {
      user = await UserModel.create({
        name,
        email: email.toLowerCase(),
        clerkId,
      });
    }
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });
  await UserModel.updateRefreshToken(user.id, hashString(refreshToken));

  return { user: toPublic(user), accessToken, refreshToken };
};

export { register, login, refresh, logout, getMe, syncClerkUser };
