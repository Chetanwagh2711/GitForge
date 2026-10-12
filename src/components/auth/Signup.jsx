import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Signup = () => {
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const { setCurrentUser } = useAuth();
const navigate = useNavigate();

const handleSignup = async (e) => {
e.preventDefault();

try {
  setLoading(true);

  const res = await api.post("/signup", {
  email,
  password,
  username,
});

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userId", res.data.userId);
  setCurrentUser(res.data.userId);
  navigate("/dashboard", { replace: true });
} catch (err) {
  console.error("Signup Error:", err);
  alert(err.response?.data?.message || "Signup Failed!");
} finally {
  setLoading(false);
}


};

return ( <div className="login-wrapper"> <div className="login-logo-container"> <img className="logo-login" src={logo} alt="Logo" /> </div>


  <div className="login-box-wrapper">
    <div className="login-heading">
      <div style={{ padding: "8px" }}>
        <h2>Sign Up</h2>
      </div>
    </div>

    <form className="login-box" onSubmit={handleSignup}>
      <div>
        <label className="label" htmlFor="Username">
          Username
        </label>
        <input
          autoComplete="username"
          name="Username"
          id="Username"
          className="input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="Email">
          Email address
        </label>
        <input
          autoComplete="email"
          name="Email"
          id="Email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="Password">
          Password
        </label>
        <input
          autoComplete="new-password"
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
        {loading ? "Loading..." : "Signup"}
      </button>
    </form>

    <div className="pass-box">
      <p>
Already have an account? <Link to="/login">Login</Link>      </p>
    </div>
  </div>
</div>

);
};

export default Signup;
