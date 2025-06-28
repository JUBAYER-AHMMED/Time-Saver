// src/pages/ServicesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/api";

import { useAuth } from "../context/AuthContext";

const ServicesPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [manualPassword, setManualPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    if (!user) {
      setError("User data is missing. Please log in again.");
    }

    setLoading(false);
  }, [token, user]);

  const handleDashboardAccess = async () => {
    const savedPassword = localStorage.getItem("password");

    if (savedPassword && user?.email) {
      try {
        await instance.post("/api/auth/verify-patient-password", {
          password: savedPassword,
        });
        navigate("/patientDashboard");
      } catch (err) {
        alert("Saved password is invalid. Please enter it manually.");
        localStorage.removeItem("password");
      }
    }
  };

  const handleManualPasswordSubmit = async () => {
    try {
      await instance.post("/api/auth/verify-patient-password", {
        password: manualPassword,
      });
      localStorage.setItem("password", manualPassword);
      navigate("/patientDashboard");
    } catch (err) {
      alert("Wrong password.");
    }
  };

  const handleBookAppointment = () => {
    navigate("/appointment"); // ensure this route exists
  };

  const handleDoctorList = () => {
    navigate("/doctorList"); // ensure this route exists
  };
  

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container text-center mt-5">
      <h2>Book Your Doctor Appointment</h2>
      <p>Choose your next step:</p>
      {/* {user?.role !== "patient" ? ( */}

      <div className="d-flex flex-column">
        <button className="btn btn-success" onClick={handleBookAppointment}>
          Book Appointment
        </button>
        <button
          className="btn btn-primary  mt-1"
          onClick={handleDashboardAccess}
        >
          Go to Patient Dashboard
        </button>
        <button
          className="btn btn-warning mt-1 "
          onClick={handleDoctorList}
        >
          Doctor List
        </button>
      </div>

      {!localStorage.getItem("password") && (
        <div className="mt-4">
          <p>Already have an appointment?</p>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter your password"
            value={manualPassword}
            onChange={(e) => setManualPassword(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={handleManualPasswordSubmit}
          >
            Submit Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
