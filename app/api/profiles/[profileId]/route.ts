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

async function _bold_PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { profileId } = await params;
  const profile = findByKey(profiles, "profileId", profileId);
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));

  // Intentional BOPLA for BoLD testing: normal users may update presentation
  // fields, but this mass-assigns protected object properties from the body.
  return NextResponse.json({
    profileId: profile.profileId,
    ownerId: profile.ownerId,
    displayName: body.displayName ?? profile.displayName,
    headline: body.headline ?? profile.headline,
    role: body.role ?? "candidate",
    verified: body.verified ?? false,
    riskTier: body.riskTier ?? "standard",
    compensationTarget: body.compensationTarget ?? profile.compensationTarget,
    privateEmail: body.privateEmail ?? profile.privateEmail,
    appliedProperties: Object.keys(body),
    requestedBy: auth.user
  });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);

export const PATCH = withBold(
  _bold_PATCH,
  {
    resolveCallerId,
    sensitiveFields: ["role", "verified", "riskTier", "compensationTarget", "privateEmail"]
  }
);
