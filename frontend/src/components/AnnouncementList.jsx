import React from 'react';
import { format } from 'date-fns';

const AnnouncementList = ({ announcements }) => {
if (!announcements || announcements.length === 0) {
return (
<div className="alert alert-secondary text-center" role="status">
📭 No announcements yet.
</div>
);
}

return (
<div className="card shadow-sm mb-4">
<div className="card-header bg-light">
<strong>📢 Announcements</strong>
</div>
<ul className="list-group list-group-flush">
{announcements.map((ann) => (
<li key={ann.id} className="list-group-item">
<p className="mb-1">{ann.message}</p>
<div className="text-muted small">
{format(new Date(ann.createdAt), "PPpp")}
</div>
</li>
))}
</ul>
</div>
);
};

export default React.memo(AnnouncementList);