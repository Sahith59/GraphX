import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../../lib/bold";
import { companyPages, findByKey } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ companyId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { companyId } = await params;
  const company = findByKey(companyPages, "companyId", companyId);
  if (!company) return NextResponse.json({ error: "Company page not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: companyAdminId is not compared to caller.
  return NextResponse.json({ ...company, requestedBy: auth.user });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
