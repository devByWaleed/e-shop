import React from "react";

const STYLES = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-amber-100 text-amber-700",
    closed: "bg-orange-100 text-orange-700",
    deleted: "bg-gray-200 text-gray-600",
};

const LABELS = {
    active: "Active",
    suspended: "Suspended",
    closed: "Closed",
    deleted: "Deleted",
};

const StatusBadge = ({ status = "active" }) => (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STYLES[status] || STYLES.active}`}>
        {LABELS[status] || LABELS.active}
    </span>
);

export default StatusBadge;