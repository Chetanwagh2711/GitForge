import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api";
import "./repo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await api.post("/repo/create", {
        name,
        description,
        visibility: isPublic,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="repo-form-wrapper">
        <h2>Create a new repository</h2>

        <form className="repo-form" onSubmit={handleSubmit}>
          <label htmlFor="repo-name">Repository name *</label>
          <input
            id="repo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="repo-desc">Description (optional)</label>
          <textarea
            id="repo-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="repo-radio">
            <label>
              <input
                type="radio"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
              Private
            </label>
          </div>

          {error && <p className="repo-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create repository"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRepo;