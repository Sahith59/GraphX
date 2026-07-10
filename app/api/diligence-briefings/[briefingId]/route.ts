import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../lib/bold";
import { dueDiligenceBriefings, findByKey } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = { params: Promise<{ briefingId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const { briefingId } = await params;
  const seedOwnerId = briefingId.match(/^briefing_bold_seed_(usr_\d+)$/)?.[1];
  const briefing = seedOwnerId
    ? {
        briefingId,
        ownerId: seedOwnerId,
        companyId: "company_bold_seed",
        title: "BoLD seeded diligence packet",
        accessLevel: "signed-in members only",
        summary: "Throwaway missing-authorization check object created by BoLD.",
        restrictedFields: {
          runway: "seeded",
          legalRisk: "seeded",
          hiringBudget: "seeded"
        }
      }
    : findByKey(dueDiligenceBriefings, "briefingId", briefingId);
  if (!briefing) return NextResponse.json({ error: "Briefing not found." }, { status: 404 });

  // Intentional missing authorization for BoLD testing: this sensitive
  // briefing should require a signed-in session, but no auth gate runs here.
  return NextResponse.json({
    ...briefing,
    authPolicy: "session_required",
    accessGrantedWithoutSession: true
  });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId, authRequired: true }
);

async function _bold_DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { briefingId } = await params;
  return NextResponse.json({
    deleted: true,
    briefingId,
    requestedBy: auth.user
  });
}

export const DELETE = withBold(
  _bold_DELETE,
  { resolveCallerId, authRequired: true }
);
