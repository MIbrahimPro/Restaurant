// src/components/RequireAdmin.jsx

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Still checking auth status
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    // Not logged in or not admin
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
