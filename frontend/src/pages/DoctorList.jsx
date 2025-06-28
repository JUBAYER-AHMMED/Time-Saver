import React, { useEffect, useState } from "react";
import instance from "../services/api";
import { useAuth } from "../context/AuthContext";

const DoctorList = () => {
  const { token } = useAuth();
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      console.log("Where is taz?");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await instance.get("/api/doctors/doctorlist");
        setDoctorList(res.data);
        setLoading(true);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors", err);

        setError("Failed to Doctor List.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container py-4">
      <h2>📋 Doctor List</h2>

      {loading && (
        <div className="alert alert-info">Loading Doctor List...</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {doctorList.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>specialization</th>
                <th>availability</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {doctorList.map((dr) => (
                <tr key={dr._id}>
                  <td>{dr.name}</td>
                  <td>{dr.specialization}</td>
                  <td>{dr.availability}</td>
                  <td>{dr.announcement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
