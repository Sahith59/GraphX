"use client";

import { useState } from "react";

const demoUsers = [
  ["Ava", "ava@networkboard.test"],
  ["Marcus", "marcus@networkboard.test"],
  ["Lin", "lin@networkboard.test"],
  ["Admin", "admin@networkboard.test"]
];

export default function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Ava Sterling");
  const [email, setEmail] = useState("ava@networkboard.test");
  const [password, setPassword] = useState("demo1234");
  const [status, setStatus] = useState("All demo accounts use password demo1234.");

  async function submit() {
    setStatus(mode === "login" ? "Opening session..." : "Creating member...");
    const response = await fetch(`/api/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Authentication failed.");
      return;
    }
    window.location.reload();
  }

  return (
    <section className="panel">
      <h3>Member access</h3>
      <div className="tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
          Login
        </button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">
          Signup
        </button>
      </div>
      {mode === "signup" ? (
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="field">
        <span>Password</span>
        <input value={password} type="password" onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="primary" onClick={() => void submit()} type="button">
        {mode === "login" ? "Enter network" : "Create account"}
      </button>
      <p className="status">{status}</p>
      <div className="mini-list">
        {demoUsers.map(([label, demoEmail]) => (
          <button className="record-button" key={demoEmail} onClick={() => setEmail(demoEmail)} type="button">
            <strong>{label}</strong>
            <span className="record-meta">{demoEmail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
