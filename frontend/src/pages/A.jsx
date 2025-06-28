// //  // Admin: update doctor status
//   const updateDoctorStatus = async (newStatus) => {
//     try {
//       await instance.patch(`/api/doctor/${appointment.doctor._id}/status`, {
//         availability: newStatus,
//         announcement: updateText,
//       });
//       alert("Status updated");
//       setDoctorStatus(newStatus);
//       setAnnouncement(updateText);
//       setUpdateText("");
//     } catch (err) {
//       alert("Failed to update status");
//     }
//   };

//   // Admin: mark a serial as visited
//   const markVisited = async (id) => {
//     try {
//       await instance.patch(`/api/appointments/${id}/visited`);
//       alert("Marked as visited");
//       window.location.reload();
//     } catch (err) {
//       alert("Failed to mark as visited");
//     }
//   };
 







// 
// 
// 
//  {isAdmin && (
//         <div className="card p-4 mt-4 bg-light">
//           <h5>Admin Controls</h5>

//           <div className="mb-3">
//             <label>Announcement Message</label>
//             <input
//               type="text"
//               className="form-control"
//               value={updateText}
//               onChange={(e) => setUpdateText(e.target.value)}
//               placeholder="Doctor is 10 minutes late"
//             />
//           </div>

//           <div className="d-flex gap-2 mb-3">
//             <button
//               className="btn btn-success"
//               onClick={() => updateDoctorStatus("available")}
//             >
//               Mark Available
//             </button>
//             <button
//               className="btn btn-warning"
//               onClick={() => updateDoctorStatus("late")}
//             >
//               Mark Late
//             </button>
//             <button
//               className="btn btn-danger"
//               onClick={() => updateDoctorStatus("unavailable")}
//             >
//               Mark Unavailable
//             </button>
//           </div>

//           <h6 className="mt-4">Mark Patient as Visited</h6>
//           <ul className="list-group">
//             {remainingPatients.map((p) => (
//               <li
//                 key={p._id}
//                 className="list-group-item d-flex justify-content-between align-items-center"
//               >
//                 {p.serial}. {p.patient}
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => markVisited(p._id)}
//                 >
//                   Mark Visited
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}