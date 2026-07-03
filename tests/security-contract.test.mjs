import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readme = await readFile(new URL("README.md", root), "utf8");
const data = await readFile(new URL("app/lib/data.ts", root), "utf8");

const bolaRoutes = [
  ["app/api/profiles/[profileId]/route.ts", /ownerId/, /\/api\/profiles\/\[profileId\]/],
  ["app/api/messages/threads/[threadId]/route.ts", /participantIds/, /\/api\/messages\/threads\/\[threadId\]/],
  ["app/api/jobs/[jobId]/applicants/route.ts", /recruiterId/, /\/api\/jobs\/\[jobId\]\/applicants/],
  ["app/api/recruiter-notes/[noteId]/route.ts", /authorId/, /\/api\/recruiter-notes\/\[noteId\]/],
  ["app/api/offers/[offerId]/route.ts", /candidateId/, /\/api\/offers\/\[offerId\]/],
  ["app/api/company-pages/[companyId]/analytics/route.ts", /companyAdminId/, /\/api\/company-pages\/\[companyId\]\/analytics/]
];

const bflaRoutes = [
  ["app/api/admin/users/[userId]/suspend/route.ts", /should require admin/, /\/api\/admin\/users\/\[userId\]\/suspend/],
  ["app/api/jobs/[jobId]/feature/route.ts", /should require recruiter\/admin/, /\/api\/jobs\/\[jobId\]\/feature/],
  ["app/api/company-pages/[companyId]/publish/route.ts", /should require company admin/, /\/api\/company-pages\/\[companyId\]\/publish/],
  ["app/api/posts/[postId]/moderate/route.ts", /should require moderator\/admin/, /\/api\/posts\/\[postId\]\/moderate/],
  ["app/api/recruiter-notes/[noteId]/share/route.ts", /should require note author recruiter/, /\/api\/recruiter-notes\/\[noteId\]\/share/]
];

test("documents the BOLA/IDOR and BFLA endpoint matrix", () => {
  assert.equal(bolaRoutes.length, 6);
  assert.equal(bflaRoutes.length, 5);
  for (const [, , pattern] of [...bolaRoutes, ...bflaRoutes]) {
    assert.match(readme, pattern);
  }
});

test("BOLA/IDOR routes require auth but intentionally skip owner checks", async () => {
  for (const [path, ownerPattern] of bolaRoutes) {
    const route = await readFile(new URL(path, root), "utf8");
    assert.match(route, /export\s+const\s+GET\s*=\s*withBold/);
    assert.match(route, /resolveCallerId/);
    assert.match(route, /requireUserResponse/);
    assert.match(route, /Intentional BOLA\/IDOR/);
    assert.match(route, ownerPattern);
    assert.doesNotMatch(route, /!==\s*auth\.user\.id/);
    assert.doesNotMatch(route, /===\s*auth\.user\.id/);
  }
});

test("BFLA routes require auth but intentionally skip role checks", async () => {
  for (const [path, roleComment] of bflaRoutes) {
    const route = await readFile(new URL(path, root), "utf8");
    assert.match(route, /export\s+const\s+POST\s*=\s*withBold/);
    assert.match(route, /resolveCallerId/);
    assert.match(route, /requireUserResponse/);
    assert.match(route, /Intentional BFLA/);
    assert.match(route, roleComment);
    assert.doesNotMatch(route, /auth\.user\.role\s*!==/);
    assert.doesNotMatch(route, /auth\.user\.role\s*===/);
  }
});

test("seed users cover candidate, recruiter, company admin, and admin roles", () => {
  assert.match(data, /role:\s*"candidate"/);
  assert.match(data, /role:\s*"recruiter"/);
  assert.match(data, /role:\s*"company_admin"/);
  assert.match(data, /role:\s*"admin"/);
  assert.match(data, /id:\s*"usr_701"/);
  assert.match(data, /id:\s*"usr_702"/);
  assert.match(data, /id:\s*"usr_703"/);
});
