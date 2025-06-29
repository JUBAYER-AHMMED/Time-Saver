// src/pages/AddDoctor.jsx
import React, { useState } from "react";
import axios from "axios";
import instance from "../services/api";
const AddDoctor = () => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await instance.post(
        "/api/admin/doctors",
        {
          name,
          specialization,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);
      setMessage(`Doctor "${res.data.name}" added successfully!`);
      setName("");
      setSpecialization("");
    } catch (err) {
      setMessage(
        "Error adding doctor: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Doctor</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Doctor Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Specialization</label>
          <input
            type="text"
            className="form-control"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
