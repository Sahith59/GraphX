# BoLD App 6 - Network Board

Network Board is a standalone Next.js professional-network app for testing BoLD with LinkedIn-style BOLA, IDOR, tenant isolation, missing authorization, BOPLA, and BFLA behavior.

## Scenario

Users sign in to a professional network with profiles, posts, private message threads, recruiter notes, job applicant queues, offers, company analytics, tenant-scoped reports, due-diligence briefings, privileged actions, and property-level review packets. The app intentionally skips selected object-owner, tenant-scope, authentication-required, object-property, and function-level authorization checks.

## Demo accounts

All accounts use password `demo1234`.

- `ava@networkboard.test` -> `usr_701`, candidate
- `marcus@networkboard.test` -> `usr_702`, recruiter
- `lin@networkboard.test` -> `usr_703`, company admin
- `admin@networkboard.test` -> `usr_799`, admin

## Intentional BOLA / IDOR routes

- `GET /api/profiles/[profileId]` -> top-level `ownerId`
- `GET /api/messages/threads/[threadId]` -> top-level `participantIds`
- `GET /api/jobs/[jobId]/applicants` -> top-level `recruiterId`
- `GET /api/recruiter-notes/[noteId]` -> top-level `authorId`
- `GET /api/offers/[offerId]` -> top-level `candidateId`
- `GET /api/company-pages/[companyId]/analytics` -> top-level `companyAdminId`

## Intentional tenant isolation routes

- `GET /api/tenants/[tenantId]/reports/[reportId]` -> should require membership in the tenant from the URL, but any logged-in user can read another tenant's report

## Intentional missing authorization routes

- `GET /api/diligence-briefings/[briefingId]` -> should require a signed-in session, but anonymous callers can read sensitive briefing data; the route is marked `authRequired: true` for BoLD
- `POST /api/diligence-briefings` -> authenticated seed route used by BoLD active checks to create a throwaway briefing

## Intentional BOPLA routes

- `PATCH /api/profiles/[profileId]` -> should allow normal display edits only, but mass-assigns protected fields including `role`, `verified`, `riskTier`, `privateEmail`, and `compensationTarget`
- `GET /api/profiles/[profileId]/review-packet` -> should return only normal profile properties to a candidate, but leaks `identityVerification.ssnLast4`, `recruiterOnlyNotes`, `riskSignals.privateEmail`, and `riskSignals.compensationBand`

## Intentional BFLA routes

- `GET /api/admin/users/[id]` -> should require admin, but any logged-in user can read the admin-only user view
- `POST /api/admin/users/[userId]/suspend` -> should require admin, but any logged-in user can call it
- `POST /api/jobs/[jobId]/feature` -> should require recruiter/admin, but any logged-in user can call it
- `POST /api/company-pages/[companyId]/publish` -> should require company admin, but any logged-in user can call it
- `POST /api/posts/[postId]/moderate` -> should require moderator/admin, but any logged-in user can call it
- `POST /api/recruiter-notes/[noteId]/share` -> should require recruiter note owner, but any logged-in user can call it

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
