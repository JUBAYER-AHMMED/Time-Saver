import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/api";
import { useAuth } from "../context/AuthContext";
import AnnouncementList from "../components/AnnouncementList";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchAnnouncements = async () => {
      try {
        const res = await instance.get("/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (err) {
        setError("Failed to load announcements.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [token]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛠️ Admin Dashboard</h2>

      {loading && (
        <div className="alert alert-info">Loading announcements...</div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <AnnouncementList announcements={announcements} />

          {/* Admin Control Section */}
          <div className="card mt-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Admin Controls</h5>
              <p className="card-text text-muted">
                Manage clinic operations and appointments.
              </p>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation("/admin/create-appointment")}
                >
                  📅 Create Appointment
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleNavigation("/admin/allPatientDashboard")}
                >
                  👤 View Patient Dashboard
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => handleNavigation("/admin/visited-status")}
                >
                  ✅ Update Patient Visited Status
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => handleNavigation("/admin/doctor-availability")}
                >
                  🩺 Edit Doctor Availability
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="container mt-4">
        <h2>Admin Dashboard</h2>
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/admin/add-doctor">➕ Add New Doctor</Link>
          </li>
          {/* You can add more links like view doctors, appointments, etc. */}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
