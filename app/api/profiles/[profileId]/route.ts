import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../lib/bold";
import { findByKey, profiles } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = { params: Promise<{ profileId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { profileId } = await params;
  const profile = findByKey(profiles, "profileId", profileId);
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: ownerId is not compared to the caller.
  return NextResponse.json({ ...profile, requestedBy: auth.user });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
