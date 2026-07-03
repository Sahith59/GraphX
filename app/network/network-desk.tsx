"use client";

import { useState } from "react";
import type { BflaEndpoint, BolaEndpoint } from "../lib/data";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  headline: string;
  company: string;
  initials: string;
};

type Post = {
  postId: string;
  authorId: string;
  author: string;
  body: string;
  tags: string[];
  moderationStatus: string;
};

export default function NetworkDesk({
  currentUser,
  users,
  posts,
  bolaEndpoints,
  bflaEndpoints
}: {
  currentUser: PublicUser;
  users: PublicUser[];
  posts: Post[];
  bolaEndpoints: BolaEndpoint[];
  bflaEndpoints: BflaEndpoint[];
}) {
  const [bolaKey, setBolaKey] = useState(bolaEndpoints[0]?.key || "");
  const [bflaKey, setBflaKey] = useState(bflaEndpoints[0]?.key || "");
  const [result, setResult] = useState("Run a BOLA read or BFLA action to see the API response.");
  const [status, setStatus] = useState("Ready");

  const activeBola = bolaEndpoints.find((endpoint) => endpoint.key === bolaKey) || bolaEndpoints[0];
  const activeBfla = bflaEndpoints.find((endpoint) => endpoint.key === bflaKey) || bflaEndpoints[0];

  async function callRoute(route: string, id: string, method: "GET" | "POST") {
    const placeholder = route.includes("{profileId}")
      ? "{profileId}"
      : route.includes("{threadId}")
        ? "{threadId}"
        : route.includes("{jobId}")
          ? "{jobId}"
          : route.includes("{noteId}")
            ? "{noteId}"
            : route.includes("{offerId}")
              ? "{offerId}"
              : route.includes("{companyId}")
                ? "{companyId}"
                : route.includes("{userId}")
                  ? "{userId}"
                  : "{postId}";
    const url = route.replace(placeholder, encodeURIComponent(id));
    setStatus(`${method} ${url}`);
    const response = await fetch(url, { method });
    const json = await response.json();
    setResult(JSON.stringify(json, null, 2));
    setStatus(`${response.status} ${response.statusText || "OK"} / ${method} ${url}`);
  }

  return (
    <section className="workspace">
      <aside className="rail">
        <div className="profile-card">
          <div className="avatar">{currentUser.initials}</div>
          <h3>{currentUser.name}</h3>
          <p>{currentUser.headline}</p>
          <p className="mono">{currentUser.id} / {currentUser.role}</p>
        </div>
        <div className="section-heading">
          <p className="eyebrow">Directory</p>
          <h3>People graph</h3>
        </div>
        <div className="mini-list">
          {users.map((user) => (
            <div className="mini-item" key={user.id}>
              <strong>{user.name}</strong>
              <div className="record-meta">{user.id} / {user.role}</div>
              <div>{user.company}</div>
            </div>
          ))}
        </div>
      </aside>

      <section className="feed" id="feed">
        <div className="section-heading">
          <p className="eyebrow">Network feed</p>
          <h3>Signals from the graph</h3>
        </div>
        {posts.map((post) => (
          <article className="post" key={post.postId}>
            <div className="post-top">
              <div className="avatar">{post.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
              <div>
                <h3>{post.author}</h3>
                <div className="record-meta">{post.postId} / {post.moderationStatus}</div>
              </div>
            </div>
            <p className="post-body">{post.body}</p>
            <div className="tag-row">
              {post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </section>

      <section className="lab" id="access-lab">
        <div className="section-heading">
          <p className="eyebrow">Access Lab</p>
          <h3>Authorization test bench</h3>
        </div>
        <div className="lab-banner">
          <strong>Logged in as {currentUser.id}</strong>
          <span>Run cross-user reads and privileged actions from the same normal session.</span>
        </div>
        <h4>BOLA / IDOR reads</h4>
        <label className="field">
          <span>Read endpoint</span>
          <select value={bolaKey} onChange={(event) => setBolaKey(event.target.value)}>
            {bolaEndpoints.map((endpoint) => (
              <option key={endpoint.key} value={endpoint.key}>{endpoint.name}</option>
            ))}
          </select>
        </label>
        <div className="lab-section">
          <div className="method">{activeBola?.method} {activeBola?.route} / owner: {activeBola?.ownerPath}</div>
          <div className="record-grid">
            {activeBola?.records.map((record) => (
              <button
                className="record-button"
                key={record.id}
                onClick={() => void callRoute(activeBola.route, record.id, activeBola.method)}
                type="button"
              >
                <strong>{record.id}</strong>
                <span>{record.label}</span>
                <span className="record-meta">{record.ownerLabel}: {record.ownerValue}</span>
              </button>
            ))}
          </div>
        </div>

        <h4>BFLA actions</h4>
        <label className="field">
          <span>Privileged function</span>
          <select value={bflaKey} onChange={(event) => setBflaKey(event.target.value)}>
            {bflaEndpoints.map((endpoint) => (
              <option key={endpoint.key} value={endpoint.key}>{endpoint.name}</option>
            ))}
          </select>
        </label>
        <div className="lab-section">
          <div className="method">{activeBfla?.method} {activeBfla?.route} / should require: {activeBfla?.requiredRole}</div>
          <div className="record-grid">
            {activeBfla?.records.map((record) => (
              <button
                className="record-button"
                key={record.id}
                onClick={() => void callRoute(activeBfla.route, record.id, activeBfla.method)}
                type="button"
              >
                <strong>{record.id}</strong>
                <span>{record.label}</span>
                <span className="record-meta">{record.ownerLabel}: {record.ownerValue}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="status">{status}</p>
        <pre className="json">{result}</pre>
      </section>
    </section>
  );
}
