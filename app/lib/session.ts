import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { findUserById, publicUser } from "./data";

const COOKIE_NAME = "network_board_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "network-board-local-secret";
const DEMO_BEARER_USERS: Record<string, string> = {
  "graphx-admin-bfla-token": "usr_799",
  "graphx-recruiter-bfla-token": "usr_702",
  "graphx-company-admin-bfla-token": "usr_703",
  "graphx-candidate-bfla-token": "usr_701"
};

function sign(value: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function encodeSession(userId: string) {
  return `${userId}.${sign(userId)}`;
}

function decodeSession(value?: string) {
  if (!value) return null;
  const [userId, signature] = value.split(".");
  if (!userId || !signature) return null;
  const expected = sign(userId);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return userId;
}

async function userIdFromBearerToken() {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  return token ? DEMO_BEARER_USERS[token] ?? null : null;
}

export async function currentUser() {
  const cookieStore = await cookies();
  const userId = decodeSession(cookieStore.get(COOKIE_NAME)?.value) ?? (await userIdFromBearerToken());
  if (!userId) return null;
  const user = findUserById(userId);
  return user ? publicUser(user) : null;
}

export function attachSession(response: NextResponse, userId: string) {
  response.cookies.set(COOKIE_NAME, encodeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function requireUserResponse() {
  const user = await currentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Sign in before opening Network Board data." }, { status: 401 })
    };
  }
  return { user, response: null };
}
