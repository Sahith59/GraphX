import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveCallerId } from "../../../../lib/bold";
import { findByKey, recruiterNotes } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ noteId: string }> };

async function _bold_POST(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { noteId } = await params;
  const note = findByKey(recruiterNotes, "noteId", noteId);
  if (!note) return NextResponse.json({ error: "Recruiter note not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require note author recruiter, but role/author is not checked.
  return NextResponse.json({
    action: "share_recruiter_note",
    noteId: note.noteId,
    authorId: note.authorId,
    performedBy: auth.user,
    status: "simulated_shared"
  });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId }
);
