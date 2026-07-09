import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId, resolveCallerScopes, resolveCallerTenant, resolveTenantFromPath } from "../../../../../lib/bold";
import { findByKey, tenantReports, tenants } from "../../../../../lib/data";
import { requireUserResponse } from "../../../../../lib/session";

type RouteContext = { params: Promise<{ tenantId: string; reportId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { tenantId, reportId } = await params;
  const tenant = findByKey(tenants, "tenantId", tenantId);
  const report = findByKey(tenantReports, "reportId", reportId);

  if (!tenant || !report || report.tenantId !== tenantId) {
    return NextResponse.json({ error: "Tenant report not found." }, { status: 404 });
  }

  // Intentional tenant-isolation vulnerability for BoLD testing: the caller's
  // tenantIds are not checked against the tenant id in the URL.
  return NextResponse.json({
    tenantId: tenant.tenantId,
    tenantName: tenant.name,
    reportId: report.reportId,
    ownerId: report.ownerId,
    title: report.title,
    confidentialSummary: report.confidentialSummary,
    forecast: report.forecast,
    riskNotes: report.riskNotes,
    requestedBy: auth.user
  });
}

export const GET = withBold(
  _bold_GET,
  {
    resolveCallerId,
    resolveCallerScopes,
    resolveCallerTenant,
    resolveObjectTenant: resolveTenantFromPath,
    tenantField: "tenantId"
  }
);
