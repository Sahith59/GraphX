import { NextResponse } from "next/server";
import { findByKey, recruiterNotes } from "../../../lib/data";
import { requireUserResponse } from "../../../lib/session";

type RouteContext = { params: Promise<{ noteId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { noteId } = await params;
  const note = findByKey(recruiterNotes, "noteId", noteId);
  if (!note) return NextResponse.json({ error: "Recruiter note not found." }, { status: 404 });

  // Intentional BOLA/IDOR for BoLD testing: authorId is not compared to caller.
  return NextResponse.json({ ...note, requestedBy: auth.user });
}
