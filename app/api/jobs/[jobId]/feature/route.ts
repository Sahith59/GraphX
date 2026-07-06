import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId, resolveRecruiterPrivilege } from "../../../../lib/bold";
import { findByKey, jobs } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ jobId: string }> };

async function _bold_POST(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { jobId } = await params;
  const job = findByKey(jobs, "jobId", jobId);
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require recruiter/admin, but role is not checked.
  return NextResponse.json({
    action: "feature_job",
    jobId: job.jobId,
    recruiterId: job.recruiterId,
    performedBy: auth.user,
    status: "simulated_featured"
  });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId, privileged: true, resolveCallerPrivilege: resolveRecruiterPrivilege }
);
