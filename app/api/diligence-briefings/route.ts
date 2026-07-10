import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../lib/bold";
import { requireUserResponse } from "../../lib/session";

async function _bold_POST(request: Request) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const briefingId = `briefing_bold_seed_${auth.user.id}`;

  return NextResponse.json({
    id: briefingId,
    briefingId,
    ownerId: auth.user.id,
    companyId: body.companyId ?? "company_bold_seed",
    title: body.title ?? "BoLD seeded diligence packet",
    accessLevel: "signed-in members only",
    summary: body.summary ?? "Throwaway missing-authorization check object created by BoLD."
  }, { status: 201 });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId, authRequired: true }
);
