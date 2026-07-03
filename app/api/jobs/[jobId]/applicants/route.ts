import { NextResponse } from "next/server";
import { findByKey, jobs } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ jobId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { jobId } = await params;
  const job = findByKey(jobs, "jobId", jobId);
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: recruiterId is not compared to caller.
  return NextResponse.json({
    jobId: job.jobId,
    title: job.title,
    recruiterId: job.recruiterId,
    companyAdminId: job.companyAdminId,
    applicants: job.applicants,
    requestedBy: auth.user
  });
}
