import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { findUserByEmail, publicUser } from "../../lib/data";
import { attachSession } from "../../lib/session";

async function _bold_POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "");
  const password = String(body.password || "");
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid Network Board credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ user: publicUser(user) });
  attachSession(response, user.id);
  return response;
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
