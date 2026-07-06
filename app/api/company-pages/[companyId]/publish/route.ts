import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId, resolveCompanyAdminPrivilege } from "../../../../lib/bold";
import { companyPages, findByKey } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ companyId: string }> };

async function _bold_POST(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { companyId } = await params;
  const company = findByKey(companyPages, "companyId", companyId);
  if (!company) return NextResponse.json({ error: "Company page not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require company admin, but role is not checked.
  return NextResponse.json({
    action: "publish_company_page",
    companyId: company.companyId,
    companyAdminId: company.companyAdminId,
    performedBy: auth.user,
    status: "simulated_published"
  });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId, privileged: true, resolveCallerPrivilege: resolveCompanyAdminPrivilege }
);
