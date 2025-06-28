// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PatientDashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [currentSerial, setCurrentSerial] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false); // Determine based on user role

//   useEffect(() => {
//     // Fetch data on component mount
//     fetchAppointments();
//     fetchAnnouncements();
//     fetchDoctors();
//     fetchCurrentSerial();
//     checkUserRole();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const res = await axios.get("/api/appointments");
//       setAppointments(res.data);
//     } catch (err) {
//       console.error("Error fetching appointments:", err);
//     }
//   };

//   const fetchAnnouncements = async () => {
//     try {
//       const res = await axios.get("/api/announcements");
//       setAnnouncements(res.data);
//     } catch (err) {
//       console.error("Error fetching announcements:", err);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       const res = await axios.get("/api/doctors");
//       setDoctors(res.data);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//     }
//   };

//   const fetchCurrentSerial = async () => {
//     try {
//       const res = await axios.get("/api/appointments/current-serial");
//       setCurrentSerial(res.data.serial);
//     } catch (err) {
//       console.error("Error fetching current serial:", err);
//     }
//   };

//   const checkUserRole = () => {
//     // Implement logic to check if the user is an admin
//     // For example, decode JWT token or fetch user info
//     const userRole = localStorage.getItem("userRole");
//     setIsAdmin(userRole === "admin");
//   };

//   const handleAddAnnouncement = async (message) => {
//     try {
//       await axios.post("/api/announcements", { message });
//       fetchAnnouncements();
//     } catch (err) {
//       console.error("Error adding announcement:", err);
//     }
//   };

//   const handleUpdateDoctorStatus = async (doctorId, status) => {
//     try {
//       await axios.patch(`/api/doctors/${doctorId}/status`, { status });
//       fetchDoctors();
//     } catch (err) {
//       console.error("Error updating doctor status:", err);
//     }
//   };

//   const handleAdvanceSerial = async () => {
//     try {
//       await axios.patch("/api/appointments/advance");
//       fetchCurrentSerial();
//       fetchAppointments();
//     } catch (err) {
//       console.error("Error advancing serial:", err);
//     }
//   };

//   const handleMarkAsVisited = async (appointmentId) => {
//     try {
//       await axios.patch(`/api/appointments/${appointmentId}/visit`);
//       fetchAppointments();
//     } catch (err) {
//       console.error("Error marking appointment as visited:", err);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Patient Dashboard</h2>

//       {/* Announcements */}
//       <section className="mb-4">
//         <h4>Announcements</h4>
//         <ul className="list-group">
//           {announcements.map((announcement) => (
//             <li key={announcement._id} className="list-group-item">
//               {announcement.message}
//             </li>
//           ))}
//         </ul>
//         {isAdmin && (
//           <div className="mt-3">
//             <input
//               type="text"
//               className="form-control mb-2"
//               placeholder="New announcement"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleAddAnnouncement(e.target.value);
//                   e.target.value = "";
//                 }
//               }}
//             />
//           </div>
//         )}
//       </section>

//       {/* Doctor Status */}
//       <section className="mb-4">
//         <h4>Doctor Status</h4>
//         <ul className="list-group">
//           {doctors.map((doctor) => (
//             <li
//               key={doctor._id}
//               className="list-group-item d-flex justify-content-between align-items-center"
//             >
//               {doctor.name} - {doctor.status}
//               {isAdmin && (
//                 <select
//                   value={doctor.status}
//                   onChange={(e) =>
//                     handleUpdateDoctorStatus(doctor._id, e.target.value)
//                   }
//                   className="form-select w-auto"
//                 >
//                   <option value="sitting">Sitting</option>
//                   <option value="unavailable">Unavailable</option>
//                 </select>
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* Current Serial */}
//       <section className="mb-4">
//         <h4>Current Serial Number: {currentSerial || "N/A"}</h4>
//         {isAdmin && (
//           <button className="btn btn-primary" onClick={handleAdvanceSerial}>
//             Advance Serial
//           </button>
//         )}
//       </section>

//       {/* Appointments */}
//       <section>
//         <h4>Your Appointments</h4>
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Serial</th>
//               <th>Doctor</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Status</th>
//               {isAdmin && <th>Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((appointment) => (
//               <tr key={appointment._id}>
//                 <td>{appointment.serial}</td>
//                 <td>{appointment.doctor.name}</td>
//                 <td>{new Date(appointment.date).toLocaleDateString()}</td>
//                 <td>{appointment.time}</td>
//                 <td>{appointment.status}</td>
//                 {isAdmin && (
//                   <td>
//                     {appointment.status !== "visited" && (
//                       <button
//                         className="btn btn-success btn-sm"
//                         onClick={() => handleMarkAsVisited(appointment._id)}
//                       >
//                         Mark as Visited
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// };

// export default PatientDashboard;

import React, { useEffect, useState } from "react";
import instance from "../services/api";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [doctorStatus, setDoctorStatus] = useState("");
  const [doctorName, setDoctorName] = useState("");

  const [currentSerial, setCurrentSerial] = useState(null);
  const [remainingPatients, setRemainingPatients] = useState([]);
  const [announcement, setAnnouncement] = useState("");

  const [updateText, setUpdateText] = useState("");

  const contact = localStorage.getItem("clinic_patient_contact");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch today’s appointment for this patient
        const res = await instance.get(
          `/api/appointments/today?contact=${contact}`
        );
        const data = res.data;
        setAppointment(data);
        console.log("res:", res);
        console.log("data:", data);
        console.log("doctorID:", data.doctor);

        // 2. Fetch doctor’s current status
        const doctorStatusRes = await instance.get(
          `/api/appointments/doctor-status/${data.doctor}`
        );
        setDoctorName(doctorStatusRes.data.doctorName);
        setDoctorStatus(doctorStatusRes.data.status);
        setAnnouncement(doctorStatusRes.data.announcement || "");

        // 3. Fetch current visiting serial & remaining list
        const serialRes = await instance.get(
          `/api/appointments/current-serial/${data.doctor}`
        );
        // console.log("serial:", serialRes.data);
        setCurrentSerial(serialRes.data.currentSerial);
        setRemainingPatients(serialRes.data.remainingPatients);

        // 4. Optional: Check if user is admin (based on localStorage/email)
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, []);

  if (!appointment)
    return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div className="container mt-5 ">
      <h2 className="text-center mb-4">Patient Dashboard</h2>

      <div className="card p-4">
        <h5>Your Info</h5>
        <p>
          <strong>Name:</strong> {appointment.patient}
        </p>
        <p>
          <strong>Serial:</strong> {appointment.serial}
        </p>
        <p>
          <strong>Doctor:</strong> {doctorName}
        </p>
        <p>
          <strong>Appointment Date:</strong> {appointment.date}
        </p>
      </div>

      <div className="card p-4 mt-4">
        <h5>Doctor Status</h5>
        <p>
          <strong>Status:</strong> {doctorStatus}
        </p>
        <p>
          <strong>Announcement:</strong> {announcement || "None"}
        </p>
        <p>
          <strong>Current Serial Visiting:</strong> {currentSerial}
        </p>
        <p>
          <strong>Remaining:</strong> {remainingPatients.length}
        </p>
      </div>
      <center>
        {" "}
        <button className="btn btn-danger">Cancel Your Appointment</button>
      </center>
    </div>
  );
};

export default PatientDashboard;
