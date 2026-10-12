// import React, { useState, useEffect } from "react";
// import "./dashboard.css";
// import Navbar from "../Navbar";
// import api from "../../api";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [repositories, setRepositories] = useState([]);
//   const [suggestedRepositories, setSuggestedRepositories] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");

//     const loadDashboard = async () => {
//       try {
//         const [mine, all] = await Promise.all([
//           api.get(`/repo/user/${userId}`),
//           api.get("/repo/all"),
//         ]);

//         setRepositories(mine.data.repositories || []);

//         // Suggestions = public repos owned by other people
//         const others = (all.data || []).filter(
//           (r) => r.owner?._id !== userId && r.visibility !== false
//         );
//         setSuggestedRepositories(others);
//       } catch (err) {
//         console.error("Dashboard error:", err);
//         setError("Could not load repositories.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   const filtered = repositories.filter((repo) =>
//     (repo.name || "").toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       <Navbar />
//       <section id="dashboard">
//         <aside>
//           <h3>Suggested Repositories</h3>
//           {loading ? (
//             <p>Loading...</p>
//           ) : suggestedRepositories.length === 0 ? (
//             <p>No suggested repositories available.</p>
//           ) : (
//             suggestedRepositories.map((repo) => (
//               <div key={repo._id}>
//                <h4>
//   <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
// </h4>
//                 <p>{repo.description}</p>
//               </div>
//             ))
//           )}
//         </aside>

//         <main>
//           <h2>Your Repositories</h2>
//           <div id="search">
//             <input
//               type="text"
//               value={searchQuery}
//               placeholder="Search repositories..."
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {error && <p style={{ color: "red" }}>{error}</p>}

//           {loading ? (
//             <p>Loading your repositories...</p>
//           ) : filtered.length === 0 ? (
//             <div>
//               <h3>No Repositories Found</h3>
//               <p>Create your first repository to get started.</p>
//             </div>
//           ) : (
//             filtered.map((repo) => (
//               <div key={repo._id}>
//                 <h4>
//   <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
// </h4>
//                 <p>{repo.description}</p>
//               </div>
//             ))
//           )}
//         </main>

//         <aside>
//           <h3>Upcoming Events</h3>
//           <ul>
//             <li><p>Tech Conference - Dec 15</p></li>
//             <li><p>Developer Meetup - Dec 25</p></li>
//             <li><p>React Summit - Jan 5</p></li>
//           </ul>
//         </aside>
//       </section>
//     </>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import api from "../../api";

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString();
};

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const loadDashboard = async () => {
      try {
        const [mine, all] = await Promise.all([
          api.get(`/repo/user/${userId}`),
          api.get("/repo/all"),
        ]);

        setRepositories(mine.data.repositories || []);

        const others = (all.data || []).filter(
          (r) => r.owner?._id !== userId && r.visibility !== false
        );
        setSuggestedRepositories(others);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Could not load repositories.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const filtered = repositories.filter((repo) =>
    (repo.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="dash">
        {/* Left: suggested repositories */}
        <aside className="dash-side">
          <div className="dash-card">
            <h3 className="dash-card-title">Suggested repositories</h3>
            {loading ? (
              <p className="dash-muted">Loading...</p>
            ) : suggestedRepositories.length === 0 ? (
              <p className="dash-muted">No suggestions yet.</p>
            ) : (
              <ul className="dash-list">
                {suggestedRepositories.slice(0, 8).map((repo) => (
                  <li key={repo._id}>
                    <span className="dash-avatar">
                      {repo.owner?.username?.[0]?.toUpperCase() || "?"}
                    </span>
                    <div>
                      <Link to={`/repo/${repo._id}`} className="dash-link">
                        {repo.owner?.username}/{repo.name}
                      </Link>
                      {repo.description && (
                        <p className="dash-muted small">{repo.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Center: your repositories */}
        <main className="dash-main">
          <div className="dash-main-head">
            <h2>Your repositories</h2>
            <Link to="/create" className="dash-new-btn">
              New
            </Link>
          </div>

          <input
            className="dash-search"
            type="text"
            value={searchQuery}
            placeholder="Find a repository..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {error && <p className="dash-error">{error}</p>}

          {loading ? (
            <p className="dash-muted">Loading your repositories...</p>
          ) : filtered.length === 0 ? (
            <div className="dash-empty">
              <h3>
                {repositories.length === 0
                  ? "You don't have any repositories yet"
                  : "No matching repositories"}
              </h3>
              {repositories.length === 0 && (
                <Link to="/create" className="dash-new-btn">
                  Create your first repository
                </Link>
              )}
            </div>
          ) : (
            <ul className="dash-repos">
              {filtered.map((repo) => (
                <li key={repo._id} className="dash-repo">
                  <div className="dash-repo-top">
                    <Link to={`/repo/${repo._id}`} className="dash-repo-name">
                      {repo.name}
                    </Link>
                    <span className="dash-badge">
                      {repo.visibility ? "Public" : "Private"}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="dash-repo-desc">{repo.description}</p>
                  )}
                  <p className="dash-muted small">
                    Updated {timeAgo(repo.updatedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </main>

        {/* Right: events */}
        <aside className="dash-side">
          <div className="dash-card">
            <h3 className="dash-card-title">Upcoming events</h3>
            <ul className="dash-events">
              <li>
                <strong>Tech Conference</strong>
                <span className="dash-muted small">Dec 15</span>
              </li>
              <li>
                <strong>Developer Meetup</strong>
                <span className="dash-muted small">Dec 25</span>
              </li>
              <li>
                <strong>React Summit</strong>
                <span className="dash-muted small">Jan 5</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Dashboard;