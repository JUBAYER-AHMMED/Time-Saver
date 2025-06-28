import React, { useState, useEffect } from "react";
import instance from "../services/api";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    time: "",
    contact: "",
    doctor: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await instance.post(
        "/api/auth/appointmentByPatient",
        formData
      );

      const password = response.data.patientPassword;

      localStorage.setItem("clinic_password", password);
      localStorage.setItem("clinic_patient_contact", formData.contact);
      localStorage.setItem("clinic_patient_name", formData.patient);

      setGeneratedPassword(password);

      alert(`Appointment booked successfully! Your password: ${password}`);
      navigate("/patientDashboard");
    } catch (err) {
      console.error("Appointment error:", err);
      setError(err.response?.data?.error || "Failed to book appointment.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="col-md-6 offset-md-3">
        <input
          type="text"
          name="patient"
          placeholder="Patient Name"
          className="form-control mb-3"
          value={formData.patient}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="form-control mb-3"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          className="form-control mb-3"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          className="form-control mb-3"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <select
          name="doctor"
          className="form-select mb-3"
          value={formData.doctor}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-success w-100">
          Book Appointment
        </button>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </form>

      {generatedPassword && (
        <div className="alert alert-info mt-4 text-center">
          <strong>Your password:</strong> {generatedPassword}
        </div>
      )}
    </div>
  );
};

export default Appointment;
