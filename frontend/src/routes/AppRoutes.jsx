import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";


// ==========================================
// PAGES
// ==========================================
import LandingPage from "../pages/Landing/LandingPage";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import UserDashboard from "../pages/user/UserDashboard";
import SchedulePickup from "../pages/user/SchedulePickup";
import TrackPickup from "../pages/user/TrackPickup";
import PickupHistoryPage from "../pages/user/PickupHistoryPage";
import GreenPoints from "../pages/user/GreenPoints";
import LiveRates from "../pages/user/LiveRates";

import CollectorDashboard from "../pages/collector/CollectorDashboard";
import AvailableJobs from "../pages/collector/AvailableJobs";
import Earnings from "../pages/collector/Earnings";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageCollectors from "../pages/Admin/ManageCollectors";
import ManagePrices from "../pages/Admin/ManagePrices";
import ManagePickups from "../pages/Admin/ManagePickups";


// ==========================================
// PROTECTED ROUTE
// ==========================================
const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, loading, user } =
    useAuthContext();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "collector") {
      return <Navigate to="/collector/dashboard" />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};


// ==========================================
// PUBLIC ONLY ROUTE (Redirects if already logged in)
// ==========================================
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuthContext();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "collector") {
      return <Navigate to="/collector/dashboard" />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};


// ==========================================
// CATCH ALL ROUTE
// ==========================================
const CatchAllRoute = () => {
  const { isAuthenticated, loading, user } = useAuthContext();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (user?.role === "collector") {
    return <Navigate to="/collector/dashboard" />;
  }
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }
  return <Navigate to="/user/dashboard" />;
};


// ==========================================
// APP ROUTES
// ==========================================
const AppRoutes = () => {
  return (
    <Routes>

      {/* ===================================== */}
      {/* PUBLIC ROUTES */}
      {/* ===================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />


      {/* ===================================== */}
      {/* USER ROUTES */}
      {/* ===================================== */}

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule-pickup"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <SchedulePickup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track-pickup"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <TrackPickup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pickup-history"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <PickupHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/green-points"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <GreenPoints />
          </ProtectedRoute>
        }
      />

      <Route
  path="/live-rates"
  element={<LiveRates />}
/>


      {/* ===================================== */}
      {/* COLLECTOR ROUTES */}
      {/* ===================================== */}

      <Route
        path="/collector/dashboard"
        element={
          <ProtectedRoute allowedRoles={["collector"]}>
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/collector/jobs"
        element={
          <ProtectedRoute allowedRoles={["collector"]}>
            <AvailableJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/collector/earnings"
        element={
          <ProtectedRoute allowedRoles={["collector"]}>
            <Earnings />
          </ProtectedRoute>
        }
      />


      {/* ===================================== */}
      {/* ADMIN ROUTES */}
      {/* ===================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/collectors"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageCollectors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/prices"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManagePrices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pickups"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManagePickups />
          </ProtectedRoute>
        }
      />

      {/* CATCH ALL */}
      <Route
        path="*"
        element={<CatchAllRoute />}
      />

    </Routes>
  );
};

export default AppRoutes;