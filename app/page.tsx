import AuthPanel from "./network/auth-panel";
import NetworkDesk from "./network/network-desk";
import SignOutButton from "./network/sign-out-button";
import { bflaEndpoints, bolaEndpoints, boplaEndpoints, missingAuthEndpoints, posts, publicUser, tenantIsolationEndpoints, users } from "./lib/data";
import { currentUser } from "./lib/session";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="shell">
      <header className="masthead">
        <div className="brand">
          <div className="sigil">NB</div>
          <div>
            <h1>Network Board</h1>
            <p>Private professional graph / BoLD App 6</p>
          </div>
        </div>
        <nav className="nav" aria-label="Network sections">
          <a className="nav-pill" href="#feed">Feed</a>
          <a className="nav-pill" href="#access-lab">Access Lab</a>
          {user ? (
            <SignOutButton initials={user.initials} />
          ) : (
            <span className="nav-pill">Session required</span>
          )}
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">LinkedIn-style test app</p>
          <h2>Professional graph, private doors, broken controls.</h2>
          <p className="lede">
            A working network clone for testing object-level and function-level authorization. Sign in as one member,
            inspect another member's private data, cross tenant boundaries, expose restricted properties, then invoke privileged actions from an ordinary account.
          </p>
          <div className="stats">
            <div className="stat">
              <strong>{bolaEndpoints.length}</strong>
              <span className="mono">BOLA / IDOR routes</span>
            </div>
            <div className="stat">
              <strong>{bflaEndpoints.length}</strong>
              <span className="mono">BFLA actions</span>
            </div>
            <div className="stat">
              <strong>{boplaEndpoints.length}</strong>
              <span className="mono">BOPLA route</span>
            </div>
            <div className="stat">
              <strong>{tenantIsolationEndpoints.length}</strong>
              <span className="mono">tenant route</span>
            </div>
            <div className="stat">
              <strong>{missingAuthEndpoints.length}</strong>
              <span className="mono">missing-auth route</span>
            </div>
            <div className="stat">
              <strong>{users.length}</strong>
              <span className="mono">seed identities</span>
            </div>
          </div>
        </div>
        {!user ? (
          <AuthPanel />
        ) : (
          <div className="panel session-panel">
            <div className="session-top">
              <div className="avatar compact">{user.initials}</div>
              <div>
                <p className="eyebrow">Active session</p>
                <h3>{user.name}</h3>
              </div>
            </div>
            <p className="status">{user.id} / {user.role}</p>
            <p className="session-copy">{user.headline}</p>
            <div className="session-metrics">
              <span><strong>{bolaEndpoints.length}</strong> object reads</span>
              <span><strong>{tenantIsolationEndpoints.length}</strong> tenant read</span>
              <span><strong>{boplaEndpoints.length}</strong> property leak</span>
              <span><strong>{missingAuthEndpoints.length}</strong> missing-auth read</span>
              <span><strong>{bflaEndpoints.length}</strong> privileged actions</span>
            </div>
          </div>
        )}
      </section>

      {user ? (
        <NetworkDesk
          currentUser={user}
          users={users.map(publicUser)}
          posts={posts}
          bolaEndpoints={bolaEndpoints}
          bflaEndpoints={bflaEndpoints}
          boplaEndpoints={boplaEndpoints}
          missingAuthEndpoints={missingAuthEndpoints}
          tenantIsolationEndpoints={tenantIsolationEndpoints}
        />
      ) : null}
    </main>
  );
}
