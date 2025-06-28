import React, { useState } from "react";
import PropTypes from "prop-types";

const SerialRequestModal = ({ show, onClose, onSubmit, currentSerial }) => {
const [reason, setReason] = useState("");

const handleSubmit = () => {
if (!reason.trim()) return;
onSubmit({ reason });
setReason("");
};

if (!show) return null;

return (
<div className="modal show d-block" tabIndex="-1" role="dialog">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content shadow-sm">
<div className="modal-header">
<h5 className="modal-title">🔁 Request to Shift Serial</h5>
<button type="button" className="btn-close" onClick={onClose}></button>
</div>
<div className="modal-body">
<p>
Your current serial: <strong>#{currentSerial}</strong>
</p>
<div className="form-group">
<label htmlFor="reason">Reason for shifting:</label>
<textarea
className="form-control mt-1"
id="reason"
rows="3"
value={reason}
onChange={(e) => setReason(e.target.value)}
placeholder="Explain briefly why you need to shift your serial..."
></textarea>
</div>
</div>
<div className="modal-footer">
<button type="button" className="btn btn-secondary" onClick={onClose} >
Cancel
</button>
<button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!reason.trim()} >
Submit Request
</button>
</div>
</div>
</div>
{/* Backdrop */}
<div className="modal-backdrop show"></div>
</div>
);
};

SerialRequestModal.propTypes = {
show: PropTypes.bool.isRequired,
onClose: PropTypes.func.isRequired,
onSubmit: PropTypes.func.isRequired,
currentSerial: PropTypes.number.isRequired,
};

export default SerialRequestModal;