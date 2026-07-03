import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../lib/bold";
import { findByKey, offers } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = { params: Promise<{ offerId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { offerId } = await params;
  const offer = findByKey(offers, "offerId", offerId);
  if (!offer) return NextResponse.json({ error: "Offer not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: candidateId is not compared to caller.
  return NextResponse.json({ ...offer, requestedBy: auth.user });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
