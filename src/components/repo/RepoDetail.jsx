import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api";
import "./repo.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newFile, setNewFile] = useState("");

  const loadRepo = async () => {
    try {
      const res = await api.get(`/repo/${id}`);
      setRepo(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Could not load repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepo();
  }, [id]);

  const isOwner = repo && String(repo.owner?._id) === String(userId);

  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!newFile.trim()) return;
    try {
      await api.put(`/repo/update/${id}`, { content: newFile });
      setNewFile("");
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.error || "Could not add file.");
    }
  };

  const handleToggle = async () => {
    try {
      await api.patch(`/repo/toggle/${id}`);
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.error || "Could not change visibility.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this repository permanently?")) return;
    try {
      await api.delete(`/repo/delete/${id}`);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete repository.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-page"><p>Loading...</p></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="repo-page"><p className="repo-error">{error}</p></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-page">
        <div className="repo-header">
          <h2>
            {repo.owner?.username} / {repo.name}
          </h2>
          <span className="repo-badge">
            {repo.visibility ? "Public" : "Private"}
          </span>
        </div>

        <p className="repo-desc">{repo.description || "No description."}</p>

        {isOwner && (
          <div className="repo-actions">
            <button onClick={handleToggle}>
              Make {repo.visibility ? "Private" : "Public"}
            </button>
            <button className="danger" onClick={handleDelete}>
              Delete repository
            </button>
          </div>
        )}

        <h3>Files</h3>
        {repo.content.length === 0 ? (
          <p>No files yet.</p>
        ) : (
          <ul className="repo-files">
            {repo.content.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        )}

        {isOwner && (
          <form className="repo-add-file" onSubmit={handleAddFile}>
            <input
              type="text"
              placeholder="Add a file name, e.g. README.md"
              value={newFile}
              onChange={(e) => setNewFile(e.target.value)}
            />
            <button type="submit">Add file</button>
          </form>
        )}
      </div>
    </>
  );
};

export default RepoDetail;