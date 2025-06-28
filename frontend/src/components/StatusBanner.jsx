import React from "react";

const StatusBanner = ({ status, patientSerial }) => {
  if (!status) return null;

  const currentSerial = status.currentSerial ?? 0;
  const avgTime = status.avgTimePerPatient ?? "N/A";
  const doctorLateBy = status.doctorLateBy ?? 0;
  const doctorArrived = status.doctorArrived ?? false;

  const patientsRemaining = Math.max(patientSerial - currentSerial, 0);
  const isLate = doctorLateBy > 0;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-light">
        <strong>📊 Live Queue Status</strong>
      </div>
      <div className="card-body">
        <p className="mb-2">
          <strong>🧑‍⚕️ Current Patient:</strong> #{currentSerial}
        </p>
        <p className="mb-2">
          <strong>⏳ Patients Remaining:</strong> {patientsRemaining}
        </p>
        <p className="mb-2">
          <strong>📈 Avg. Time per Patient:</strong> {avgTime} min
        </p>
        <div className="mb-3">
          {isLate ? (
            <span className="badge bg-danger">
              ⏱ Doctor Late by {doctorLateBy} min
            </span>
          ) : (
            <span className="badge bg-success">✅ On Schedule</span>
          )}
        </div>

        <div>
          {doctorArrived ? (
            <span className="badge bg-primary">🩺 Doctor has arrived</span>
          ) : (
            <span className="badge bg-warning text-dark">
              🚪 Doctor not arrived yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
