import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { publicUser, users } from "../../lib/data";
import { attachSession } from "../../lib/session";

async function _bold_POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "New Networker").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || password.length < 6) {
    return NextResponse.json({ error: "Use an email and a password with at least 6 characters." }, { status: 400 });
  }

  const existing = users.find((user) => user.email.toLowerCase() === email);
  const user =
    existing || {
      id: `usr_${820 + users.length}`,
      name,
      email,
      password,
      role: "candidate" as const,
      headline: "New member building a professional graph",
      company: "Network Board",
      tenantIds: [`tenant_${820 + users.length}`],
      initials: name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    };

  if (!existing) users.push(user);

  const response = NextResponse.json({ user: publicUser(user) });
  attachSession(response, user.id);
  return response;
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
