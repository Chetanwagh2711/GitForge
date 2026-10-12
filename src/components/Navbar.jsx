import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import logo from "../assets/github-mark-white.svg";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <nav>
      <Link to="/dashboard">
        <div>
          <img src={logo} alt="GitHub Logo" />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div>
        <Link to="/create">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p>Profile</p>
        </Link>
        <p className="nav-logout" onClick={handleLogout}>
          Logout
        </p>
      </div>
    </nav>
  );
};

export default Navbar;