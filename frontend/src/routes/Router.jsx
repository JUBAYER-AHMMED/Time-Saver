// src/routes/Router.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import PatientDashboard from "../pages/PatientDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound"; // Optional 404 page

import { useAuth } from "../context/AuthContext";
import CreateAppointment from "../components/CreateAppointment";
import AddDoctor from "../pages/AddDoctor";

// A wrapper to protect routes that need authentication
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/patient"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/create-appointment"
          element={
            <PrivateRoute>
              <CreateAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-doctor"
          element={
            <PrivateRoute>
              <AddDoctor />
            </PrivateRoute>
          }
        />

        {/* Redirect root to login or dashboard based on auth */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/patient" replace />
            </PrivateRoute>
          }
        />

        {/* Catch all - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
