import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import api from "../../api";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, repoRes] = await Promise.all([
          api.get(`/userProfile/${userId}`),
          api.get(`/repo/user/${userId}`),
        ]);
        setUser(userRes.data);
        setEmail(userRes.data.email);
        setRepos(repoRes.data.repositories || []);
      } catch (err) {
        console.error("Cannot load profile:", err);
        setMessage("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.put(`/updateProfile/${userId}`, { email });
      setUser(res.data);
      setMessage("Email updated.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update email.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page-wrapper"><p>Loading...</p></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image">
            {user?.username?.[0]?.toUpperCase()}
          </div>

          <div className="name">
            <h3>{user?.username}</h3>
          </div>

          <p className="profile-email">{user?.email}</p>

          <div className="follower">
            <p>{repos.length} Repositories</p>
          </div>

          <form className="profile-email-form" onSubmit={handleSaveEmail}>
            <label htmlFor="email">Change email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Save</button>
          </form>

          {message && <p className="profile-message">{message}</p>}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />

          <h4>Your Repositories</h4>
          {repos.length === 0 ? (
            <p>
              No repositories yet. <Link to="/create">Create one</Link>.
            </p>
          ) : (
            <ul className="profile-repos">
              {repos.map((repo) => (
                <li key={repo._id}>
                  <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                  <span className="repo-badge">
                    {repo.visibility ? "Public" : "Private"}
                  </span>
                  <p>{repo.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;