import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../../lib/bold";
import { findByKey, profiles } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ profileId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { profileId } = await params;
  const profile = findByKey(profiles, "profileId", profileId);
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  // Intentional BOPLA for BoLD testing: the profile object is readable, but these
  // recruiter/admin-only properties should not be exposed to a normal candidate.
  return NextResponse.json({
    profileId: profile.profileId,
    ownerId: profile.ownerId,
    displayName: profile.displayName,
    headline: profile.headline,
    skills: profile.skills,
    openToRecruiters: profile.openToRecruiters,
    identityVerification: {
      ssnLast4: profile.ownerId === "usr_701" ? "4107" : profile.ownerId === "usr_702" ? "2281" : "9330",
      backgroundCheckStatus: "clear",
      documentReview: "manual_override_available"
    },
    recruiterOnlyNotes: [
      `${profile.displayName} has private compensation expectations in the review packet.`,
      "Do not expose salary and identity-screening details to the candidate portal."
    ],
    riskSignals: {
      retentionRisk: profile.openToRecruiters ? "medium" : "low",
      compensationBand: profile.compensationTarget,
      privateEmail: profile.privateEmail
    }
  });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
