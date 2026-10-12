import React, { useEffect } from "react";
import {
  useNavigate,
  useRoutes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const isAuthenticated = Boolean(token && userId);

  // Restore authentication state after refresh
  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser !== userId) {
        setCurrentUser(userId);
      }
    } else {
      if (currentUser) {
        setCurrentUser(null);
      }
    }
  }, [isAuthenticated, userId, currentUser, setCurrentUser]);

  // Redirect users based on authentication
  useEffect(() => {
    const publicRoutes = ["/login", "/signup", "/auth"];

    if (isAuthenticated) {
      // Redirect logged-in users to dashboard
      if (
        publicRoutes.includes(location.pathname) ||
        location.pathname === "/"
      ) {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // Redirect unauthenticated users to login
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // Public route component
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  // Application routes
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Navigate
          to={isAuthenticated ? "/dashboard" : "/login"}
          replace
        />
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/auth",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
  path: "/create",
  element: (
    <ProtectedRoute>
      <CreateRepo />
    </ProtectedRoute>
  ),
},
{
  path: "/repo/:id",
  element: (
    <ProtectedRoute>
      <RepoDetail />
    </ProtectedRoute>
  ),
},
    {
      path: "*",
      element: (
        <Navigate
          to={isAuthenticated ? "/dashboard" : "/login"}
          replace
        />
      ),
    },
  ]);

  return routes;
};

export default ProjectRoutes;