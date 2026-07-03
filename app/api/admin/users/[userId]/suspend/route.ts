import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../../../lib/bold";
import { findUserById } from "../../../../../lib/data";
import { requireUserResponse } from "../../../../../lib/session";

type RouteContext = { params: Promise<{ userId: string }> };

async function _bold_POST(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { userId } = await params;
  const target = findUserById(userId);
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require admin, but any logged-in user can suspend.
  return NextResponse.json({
    action: "suspend_user",
    targetUserId: target.id,
    targetRole: target.role,
    performedBy: auth.user,
    status: "simulated_suspended"
  });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
