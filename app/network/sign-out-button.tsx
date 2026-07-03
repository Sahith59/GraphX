"use client";

import { useState } from "react";

export default function SignOutButton({ initials }: { initials: string }) {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button className="nav-pill nav-button" disabled={pending} onClick={() => void signOut()} type="button">
      {pending ? "Signing out" : `Sign out ${initials}`}
    </button>
  );
}
