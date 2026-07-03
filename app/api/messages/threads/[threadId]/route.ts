import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../../lib/bold";
import { findByKey, messageThreads } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ threadId: string }> };

async function _bold_GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { threadId } = await params;
  const thread = findByKey(messageThreads, "threadId", threadId);
  if (!thread) return NextResponse.json({ error: "Message thread not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: participantIds are not checked against caller.
  return NextResponse.json({ ...thread, requestedBy: auth.user });
}

export const GET = withBold(
  _bold_GET,
  { resolveCallerId }
);
