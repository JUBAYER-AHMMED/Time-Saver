import React, { useEffect, useState } from "react";
import instance from "../services/api";
import { useAuth } from "../context/AuthContext";

const AllPatientsDashboard = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      console.log("Where is taz?");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await instance.get("/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setLoading(true);
    setError(null);
    try {
      const res = await instance.get(`/api/appointments`, {
        params: {
          doctorId: selectedDoctor,
          date: selectedDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      setError("Failed to load appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await instance.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="container py-4">
      <h2>📋 All Patients Dashboard</h2>

      <div className="row my-3">
        <div className="col-md-4">
          <label>Doctor:</label>
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Date:</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={fetchAppointments}>
            🔍 See Appointments
          </button>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info">Loading appointments...</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {appointments.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Serial</th>
                <th>Patient</th>
                <th>Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.serial}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.time}</td>
                  <td>{appt.contact}</td>
                  <td>{appt.status}</td>
                  {appt.status == "pending" ? (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteAppointment(appt._id)}
                      >
                        Complete
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => deleteAppointment(appt._id)}
                      >
                        Visited
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPatientsDashboard;
