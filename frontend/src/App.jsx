// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ServicesPage from "./pages/ServicesPage";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound"; // Optional
import CreateAppointment from "./components/CreateAppointment";
import AddDoctor from "./pages/AddDoctor";
import Appointment from "./pages/Appointment";
import AllPatientsDashboard from "./components/AllPatientDashboard";
import DoctorList from "./pages/DoctorList";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route redirects to /register */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}

          <Route path="/services" element={<ServicesPage />} />

          <Route path="/appointment" element={<Appointment />} />

          <Route
            path="/patientDashboard"
            element={
              <PrivateRoute>
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/doctorList"
            element={
              <PrivateRoute>
                <DoctorList />
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
            path="/admin/allPatientDashboard"
            element={
              <PrivateRoute>
                <AllPatientsDashboard />
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
          {/* 404 fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
