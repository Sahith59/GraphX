import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { currentUser } from "../../lib/session";

async function _bold_GET() {
  const user = await currentUser();
  return NextResponse.json({ user });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
