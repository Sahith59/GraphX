import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../lib/bold";
import { dueDiligenceBriefings, findByKey } from "../../../lib/data";

type RouteContext = { params: Promise<{ briefingId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const { briefingId } = await params;
  const briefing = findByKey(dueDiligenceBriefings, "briefingId", briefingId);
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
