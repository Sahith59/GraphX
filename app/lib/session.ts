import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { findUserById, publicUser } from "./data";

const COOKIE_NAME = "network_board_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "network-board-local-secret";

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

export async function currentUser() {
  const cookieStore = await cookies();
  const userId = decodeSession(cookieStore.get(COOKIE_NAME)?.value);
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
