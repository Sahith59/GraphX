import { NextResponse } from "next/server";
import { publicUser, users } from "../../lib/data";
import { attachSession } from "../../lib/session";

export async function POST(request: Request) {
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
