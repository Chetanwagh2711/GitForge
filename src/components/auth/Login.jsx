import React, { useState } from "react";
import api from "../../api";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/login", {
  email,
  password,
});
      console.log("Login Response:", res.data);

      if (res.status === 200 && res.data.token) {
        // Store authentication details
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        // Update authentication context
        setCurrentUser(res.data.userId);

        // Redirect to dashboard after successful login
        navigate("/dashboard", { replace: true });
      } else {
        alert("Login failed: Invalid server response");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-logo-container">
        <img
          className="logo-login"
          src={logo}
          alt="Logo"
        />
      </div>

      <div className="login-box-wrapper">

        <div className="login-heading">
          <div style={{ padding: "8px" }}>
            <h2>Sign In</h2>
          </div>
        </div>

        <form className="login-box" onSubmit={handleLogin}>

          <div>
            <label className="label" htmlFor="Email">
              Email address
            </label>

            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="div">
            <label className="label" htmlFor="Password">
              Password
            </label>

            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <div className="pass-box">
          <p>
            New to GitHub?{" "}
            <Link to="/signup">Create an account</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;