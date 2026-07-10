export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter" | "company_admin" | "admin";
  headline: string;
  company: string;
  tenantIds: string[];
  initials: string;
};

export type LabRecord = {
  label: string;
  id: string;
  ownerLabel: string;
  ownerValue: string;
};

export type BolaEndpoint = {
  key: string;
  name: string;
  method: "GET" | "PATCH";
  route: string;
  ownerPath: string;
  records: LabRecord[];
};

export type BflaEndpoint = {
  key: string;
  name: string;
  method: "GET" | "POST";
  route: string;
  requiredRole: string;
  records: LabRecord[];
};

export type BoplaEndpoint = {
  key: string;
  name: string;
  method: "GET" | "PATCH";
  route: string;
  allowedScope: string;
  leakedProperties: string[];
  records: LabRecord[];
};

export type TenantRecord = {
  label: string;
  tenantId: string;
  objectId: string;
  tenantLabel: string;
};

export type TenantIsolationEndpoint = {
  key: string;
  name: string;
  method: "GET";
  route: string;
  scopePath: string;
  records: TenantRecord[];
};

export type MissingAuthEndpoint = {
  key: string;
  name: string;
  method: "GET";
  route: string;
  expectedControl: string;
  records: LabRecord[];
};

export const users: User[] = [
  {
    id: "usr_701",
    name: "Ava Sterling",
    email: "ava@networkboard.test",
    password: "demo1234",
    role: "candidate",
    headline: "Product lead exploring AI safety platforms",
    company: "Independent",
    tenantIds: ["tenant_independent"],
    initials: "AS"
  },
  {
    id: "usr_702",
    name: "Marcus Chen",
    email: "marcus@networkboard.test",
    password: "demo1234",
    role: "recruiter",
    headline: "Executive recruiter for infrastructure teams",
    company: "Northstar Search",
    tenantIds: ["tenant_northstar_search"],
    initials: "MC"
  },
  {
    id: "usr_703",
    name: "Lin Okafor",
    email: "lin@networkboard.test",
    password: "demo1234",
    role: "company_admin",
    headline: "People operations lead at Atlas Grid",
    company: "Atlas Grid",
    tenantIds: ["tenant_atlas_grid"],
    initials: "LO"
  },
  {
    id: "usr_799",
    name: "Rhea Admin",
    email: "admin@networkboard.test",
    password: "demo1234",
    role: "admin",
    headline: "Trust and safety administrator",
    company: "Network Board",
    tenantIds: ["tenant_network_board"],
    initials: "RA"
  }
];

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    headline: user.headline,
    company: user.company,
    tenantIds: user.tenantIds,
    initials: user.initials
  };
}

export const tenants = [
  {
    tenantId: "tenant_independent",
    name: "Independent Network",
    memberIds: ["usr_701"]
  },
  {
    tenantId: "tenant_northstar_search",
    name: "Northstar Search",
    memberIds: ["usr_702"]
  },
  {
    tenantId: "tenant_atlas_grid",
    name: "Atlas Grid",
    memberIds: ["usr_703"]
  },
  {
    tenantId: "tenant_network_board",
    name: "Network Board",
    memberIds: ["usr_799"]
  }
];

export const tenantReports = [
  {
    reportId: "tenant_report_ava_pipeline",
    tenantId: "tenant_independent",
    title: "Independent opportunity tracker",
    ownerId: "usr_701",
    confidentialSummary: "Ava is comparing three private product leadership searches.",
    forecast: "$240k target package",
    riskNotes: ["Current employer unaware", "Reference calls gated until offer stage"]
  },
  {
    reportId: "tenant_report_northstar_revenue",
    tenantId: "tenant_northstar_search",
    title: "Northstar Search revenue board",
    ownerId: "usr_702",
    confidentialSummary: "Executive search revenue forecast and candidate source quality.",
    forecast: "$1.8M quarterly pipeline",
    riskNotes: ["Two founder searches at risk", "Comp bands pending client approval"]
  },
  {
    reportId: "tenant_report_atlas_headcount",
    tenantId: "tenant_atlas_grid",
    title: "Atlas Grid headcount plan",
    ownerId: "usr_703",
    confidentialSummary: "Unannounced hiring plan for trust and platform teams.",
    forecast: "18 roles over two quarters",
    riskNotes: ["Legal review on VP People backfill", "Comp bands restricted to People Ops"]
  }
];

export const dueDiligenceBriefings = [
  {
    briefingId: "briefing_atlas_board_940",
    ownerId: "usr_703",
    companyId: "company_atlas_grid",
    title: "Atlas Grid board diligence packet",
    accessLevel: "signed-in members only",
    summary: "Confidential board memo covering unannounced headcount, runway, and candidate pipeline plans.",
    restrictedFields: {
      runway: "22 months",
      legalRisk: "Pending employment counsel review",
      hiringBudget: "$4.8M"
    }
  },
  {
    briefingId: "briefing_northstar_exec_941",
    ownerId: "usr_702",
    companyId: "company_northstar_search",
    title: "Northstar executive search pipeline",
    accessLevel: "signed-in members only",
    summary: "Private client pipeline and replacement-search notes for retained executive searches.",
    restrictedFields: {
      runway: "N/A",
      legalRisk: "Client confidentiality exposure",
      hiringBudget: "$1.2M placement value"
    }
  }
];

export const profiles = [
  {
    profileId: "profile_ava_701",
    ownerId: "usr_701",
    displayName: "Ava Sterling",
    headline: "Product lead exploring AI safety platforms",
    privateEmail: "ava.private@example.test",
    compensationTarget: "$210k-$245k",
    openToRecruiters: true,
    skills: ["Product strategy", "Marketplace trust", "AI governance"]
  },
  {
    profileId: "profile_marcus_702",
    ownerId: "usr_702",
    displayName: "Marcus Chen",
    headline: "Executive recruiter for infrastructure teams",
    privateEmail: "marcus.pipeline@example.test",
    compensationTarget: "$180k-$220k",
    openToRecruiters: false,
    skills: ["Executive search", "Comp mapping", "Founder advisory"]
  },
  {
    profileId: "profile_lin_703",
    ownerId: "usr_703",
    displayName: "Lin Okafor",
    headline: "People operations lead at Atlas Grid",
    privateEmail: "lin.people@example.test",
    compensationTarget: "$195k-$230k",
    openToRecruiters: false,
    skills: ["People ops", "Workforce planning", "Org design"]
  }
];

export type ProfileOverride = {
  displayName?: string;
  headline?: string;
  role?: string;
  verified?: boolean;
  riskTier?: string;
  compensationTarget?: string;
  privateEmail?: string;
};

const profileOverrides = new Map<string, ProfileOverride>();

export function updateProfileOverride(profileId: string, update: ProfileOverride) {
  const existing = profileOverrides.get(profileId) ?? {};
  const next = { ...existing, ...update };
  profileOverrides.set(profileId, next);
  return next;
}

export function getProfileOverride(profileId: string) {
  return profileOverrides.get(profileId) ?? {};
}

export const messageThreads = [
  {
    threadId: "thread_ava_marcus",
    participantIds: ["usr_701", "usr_702"],
    subject: "Confidential director role",
    messages: [
      "Marcus: The role is not public yet. Search committee wants a marketplace trust background.",
      "Ava: I can speak next week, but please do not contact my current references."
    ]
  },
  {
    threadId: "thread_lin_marcus",
    participantIds: ["usr_703", "usr_702"],
    subject: "Atlas Grid hiring plan",
    messages: [
      "Lin: Keep the compensation bands internal until finance signs off.",
      "Marcus: Understood. I will send anonymized candidate notes only."
    ]
  },
  {
    threadId: "thread_admin_lin",
    participantIds: ["usr_799", "usr_703"],
    subject: "Moderation escalation",
    messages: [
      "Rhea: A post about Atlas Grid is queued for review.",
      "Lin: Please hold it until legal reviews the screenshot."
    ]
  }
];

export const jobs = [
  {
    jobId: "job_trust_410",
    recruiterId: "usr_702",
    companyAdminId: "usr_703",
    title: "Director, Trust Systems",
    company: "Atlas Grid",
    confidential: true,
    applicants: [
      { candidateId: "usr_701", name: "Ava Sterling", stage: "onsite", expectedComp: "$230k" },
      { candidateId: "usr_704", name: "Owen Park", stage: "screen", expectedComp: "$205k" }
    ],
    featured: false
  },
  {
    jobId: "job_platform_512",
    recruiterId: "usr_702",
    companyAdminId: "usr_703",
    title: "Principal Platform Engineer",
    company: "Atlas Grid",
    confidential: false,
    applicants: [
      { candidateId: "usr_705", name: "Mina Hart", stage: "offer", expectedComp: "$260k" }
    ],
    featured: false
  }
];

export const recruiterNotes = [
  {
    noteId: "note_9001",
    authorId: "usr_702",
    candidateId: "usr_701",
    title: "Ava Sterling backchannel",
    note: "Strong product systems judgment. Sensitive: current employer does not know she is exploring.",
    sharedExternally: false
  },
  {
    noteId: "note_9002",
    authorId: "usr_702",
    candidateId: "usr_703",
    title: "Lin Okafor comp context",
    note: "Lin is not looking, but may consider VP People roles above $240k.",
    sharedExternally: false
  }
];

export const offers = [
  {
    offerId: "offer_ava_880",
    candidateId: "usr_701",
    recruiterId: "usr_702",
    companyAdminId: "usr_703",
    title: "Director, Trust Systems",
    baseSalary: 232000,
    equity: "0.18%",
    status: "draft"
  },
  {
    offerId: "offer_mina_881",
    candidateId: "usr_705",
    recruiterId: "usr_702",
    companyAdminId: "usr_703",
    title: "Principal Platform Engineer",
    baseSalary: 258000,
    equity: "0.12%",
    status: "approved"
  }
];

export const companyPages = [
  {
    companyId: "company_atlas_grid",
    companyAdminId: "usr_703",
    name: "Atlas Grid",
    draftStatus: "private_draft",
    analytics: {
      profileViews: 18420,
      applicantConversion: "17.8%",
      competitorTraffic: ["HelioStack", "Northbridge AI"]
    }
  },
  {
    companyId: "company_northstar_search",
    companyAdminId: "usr_702",
    name: "Northstar Search",
    draftStatus: "published",
    analytics: {
      profileViews: 6220,
      applicantConversion: "9.4%",
      competitorTraffic: ["TalentWorks", "Signal Desk"]
    }
  }
];

export const posts = [
  {
    postId: "post_3001",
    authorId: "usr_701",
    author: "Ava Sterling",
    body: "The best product reviews feel like incident reviews: concrete evidence, calm language, and a bias toward repair.",
    tags: ["Product", "Leadership"],
    moderationStatus: "clean"
  },
  {
    postId: "post_3002",
    authorId: "usr_703",
    author: "Lin Okafor",
    body: "Hiring plans change quickly. Candidate communication should not.",
    tags: ["Hiring", "People Ops"],
    moderationStatus: "queued"
  },
  {
    postId: "post_3003",
    authorId: "usr_702",
    author: "Marcus Chen",
    body: "Confidential searches require fewer dashboards and better judgment.",
    tags: ["Recruiting", "Executive Search"],
    moderationStatus: "clean"
  }
];

export const bolaEndpoints: BolaEndpoint[] = [
  {
    key: "profiles",
    name: "Private Profile",
    method: "GET",
    route: "/api/profiles/{profileId}",
    ownerPath: "ownerId",
    records: profiles.map((profile) => ({
      label: profile.displayName,
      id: profile.profileId,
      ownerLabel: "ownerId",
      ownerValue: profile.ownerId
    }))
  },
  {
    key: "messages",
    name: "Message Thread",
    method: "GET",
    route: "/api/messages/threads/{threadId}",
    ownerPath: "participantIds[]",
    records: messageThreads.map((thread) => ({
      label: thread.subject,
      id: thread.threadId,
      ownerLabel: "participantIds",
      ownerValue: thread.participantIds.join(",")
    }))
  },
  {
    key: "applicants",
    name: "Job Applicants",
    method: "GET",
    route: "/api/jobs/{jobId}/applicants",
    ownerPath: "recruiterId",
    records: jobs.map((job) => ({
      label: job.title,
      id: job.jobId,
      ownerLabel: "recruiterId",
      ownerValue: job.recruiterId
    }))
  },
  {
    key: "notes",
    name: "Recruiter Note",
    method: "GET",
    route: "/api/recruiter-notes/{noteId}",
    ownerPath: "authorId",
    records: recruiterNotes.map((note) => ({
      label: note.title,
      id: note.noteId,
      ownerLabel: "authorId",
      ownerValue: note.authorId
    }))
  },
  {
    key: "offers",
    name: "Offer Packet",
    method: "GET",
    route: "/api/offers/{offerId}",
    ownerPath: "candidateId",
    records: offers.map((offer) => ({
      label: offer.title,
      id: offer.offerId,
      ownerLabel: "candidateId",
      ownerValue: offer.candidateId
    }))
  },
  {
    key: "company-analytics",
    name: "Company Analytics",
    method: "GET",
    route: "/api/company-pages/{companyId}/analytics",
    ownerPath: "companyAdminId",
    records: companyPages.map((company) => ({
      label: company.name,
      id: company.companyId,
      ownerLabel: "companyAdminId",
      ownerValue: company.companyAdminId
    }))
  }
];

export const tenantIsolationEndpoints: TenantIsolationEndpoint[] = [
  {
    key: "tenant-report",
    name: "Tenant Report",
    method: "GET",
    route: "/api/tenants/{tenantId}/reports/{reportId}",
    scopePath: "tenantId",
    records: tenantReports.map((report) => ({
      label: report.title,
      tenantId: report.tenantId,
      objectId: report.reportId,
      tenantLabel: tenants.find((tenant) => tenant.tenantId === report.tenantId)?.name ?? report.tenantId
    }))
  }
];

export const missingAuthEndpoints: MissingAuthEndpoint[] = [
  {
    key: "diligence-briefing",
    name: "Due Diligence Briefing",
    method: "GET",
    route: "/api/diligence-briefings/{briefingId}",
    expectedControl: "signed-in session required",
    records: dueDiligenceBriefings.map((briefing) => ({
      label: briefing.title,
      id: briefing.briefingId,
      ownerLabel: "ownerId",
      ownerValue: briefing.ownerId
    }))
  }
];

export const bflaEndpoints: BflaEndpoint[] = [
  {
    key: "admin-user-view",
    name: "Admin User View",
    method: "GET",
    route: "/api/admin/users/{id}",
    requiredRole: "admin",
    records: users.filter((user) => user.id !== "usr_799").map((user) => ({
      label: user.name,
      id: user.id,
      ownerLabel: "targetUserId",
      ownerValue: user.id
    }))
  },
  {
    key: "suspend-user",
    name: "Suspend User",
    method: "POST",
    route: "/api/admin/users/{userId}/suspend",
    requiredRole: "admin",
    records: users.filter((user) => user.id !== "usr_799").map((user) => ({
      label: user.name,
      id: user.id,
      ownerLabel: "targetUserId",
      ownerValue: user.id
    }))
  },
  {
    key: "feature-job",
    name: "Feature Job",
    method: "POST",
    route: "/api/jobs/{jobId}/feature",
    requiredRole: "recruiter or admin",
    records: jobs.map((job) => ({ label: job.title, id: job.jobId, ownerLabel: "recruiterId", ownerValue: job.recruiterId }))
  },
  {
    key: "publish-company",
    name: "Publish Company Page",
    method: "POST",
    route: "/api/company-pages/{companyId}/publish",
    requiredRole: "company_admin",
    records: companyPages.map((company) => ({
      label: company.name,
      id: company.companyId,
      ownerLabel: "companyAdminId",
      ownerValue: company.companyAdminId
    }))
  },
  {
    key: "moderate-post",
    name: "Moderate Post",
    method: "POST",
    route: "/api/posts/{postId}/moderate",
    requiredRole: "admin or moderator",
    records: posts.map((post) => ({ label: post.author, id: post.postId, ownerLabel: "authorId", ownerValue: post.authorId }))
  },
  {
    key: "share-note",
    name: "Share Recruiter Note",
    method: "POST",
    route: "/api/recruiter-notes/{noteId}/share",
    requiredRole: "note author recruiter",
    records: recruiterNotes.map((note) => ({ label: note.title, id: note.noteId, ownerLabel: "authorId", ownerValue: note.authorId }))
  }
];

export const boplaEndpoints: BoplaEndpoint[] = [
  {
    key: "profile-settings-write",
    name: "Profile Settings Write",
    method: "PATCH",
    route: "/api/profiles/{profileId}",
    allowedScope: "candidate can update normal profile display fields",
    leakedProperties: [
      "role",
      "verified",
      "riskTier",
      "compensationTarget",
      "privateEmail"
    ],
    records: profiles.map((profile) => ({
      label: profile.displayName,
      id: profile.profileId,
      ownerLabel: "ownerId",
      ownerValue: profile.ownerId
    }))
  },
  {
    key: "profile-review-packet",
    name: "Profile Review Packet",
    method: "GET",
    route: "/api/profiles/{profileId}/review-packet",
    allowedScope: "candidate can read their own profile summary",
    leakedProperties: [
      "identityVerification.ssnLast4",
      "recruiterOnlyNotes",
      "riskSignals.privateEmail",
      "riskSignals.compensationBand"
    ],
    records: profiles.map((profile) => ({
      label: profile.displayName,
      id: profile.profileId,
      ownerLabel: "ownerId",
      ownerValue: profile.ownerId
    }))
  }
];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function findByKey<T, K extends keyof T>(items: T[], key: K, value: T[K]) {
  return items.find((item) => item[key] === value);
}
