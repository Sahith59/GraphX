import { currentUser } from "./session";
import { findByKey, recruiterNotes } from "./data";

export async function resolveCallerId() {
  const user = await currentUser();
  return user?.id ?? null;
}

async function callerRole() {
  const user = await currentUser();
  return user?.role ?? null;
}

export async function resolveAdminPrivilege() {
  return (await callerRole()) === "admin";
}

export async function resolveRecruiterPrivilege() {
  const role = await callerRole();
  return role === "recruiter" || role === "admin";
}

export async function resolveCompanyAdminPrivilege() {
  return (await callerRole()) === "company_admin";
}

export async function resolveNoteAuthorRecruiterPrivilege(request: Request) {
  const user = await currentUser();
  if (!user || user.role !== "recruiter") return false;

  const noteId = new URL(request.url).pathname.split("/").at(-2);
  const note = noteId ? findByKey(recruiterNotes, "noteId", noteId) : null;
  return note?.authorId === user.id;
}
