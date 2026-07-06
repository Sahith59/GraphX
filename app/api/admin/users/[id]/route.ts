import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveAdminPrivilege, resolveCallerId } from "../../../../lib/bold";
import { findUserById } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ id: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { id } = await params;
  const target = findUserById(id);
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require admin, but role is not checked.
  return NextResponse.json({
    adminView: true,
    targetUserId: target.id,
    email: target.email,
    role: target.role,
    company: target.company,
    riskReview: {
      status: target.role === "admin" ? "privileged" : "standard",
      trustScore: target.role === "candidate" ? 74 : 91,
      internalNotes: `Admin-only review packet for ${target.name}.`
    }
  });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId, privileged: true, resolveCallerPrivilege: resolveAdminPrivilege }
);
