import React from 'react';
import { format } from 'date-fns';

const AppointmentCard = ({ appointment }) => {
if (!appointment) return null;

const formattedDate = appointment.date
? format(new Date(appointment.date), 'PPP')
: 'N/A';
const formattedTime = appointment.time || 'N/A';

return (
<div className="card shadow-sm mb-3">
<div className="card-body">
<h5 className="card-title">{appointment.doctorName || 'Doctor Unknown'}</h5>
<p className="card-text mb-1">
<strong>Date:</strong> {formattedDate}
</p>
<p className="card-text mb-1">
<strong>Time:</strong> {formattedTime}
</p>
<p className="card-text mb-0">
<strong>Your Serial:</strong> #{appointment.serial ?? 'N/A'}
</p>
</div>
</div>
);
};

export default React.memo(AppointmentCard);