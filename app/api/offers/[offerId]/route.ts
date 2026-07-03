import { NextResponse } from "next/server";
import { findByKey, offers } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = { params: Promise<{ offerId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { offerId } = await params;
  const offer = findByKey(offers, "offerId", offerId);
  if (!offer) return NextResponse.json({ error: "Offer not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: candidateId is not compared to caller.
  return NextResponse.json({ ...offer, requestedBy: auth.user });
}
