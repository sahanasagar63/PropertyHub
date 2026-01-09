import { useEffect, useState } from "react";

export default function AdminReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("/api/reports", { credentials: "include" })
      .then(res => res.json())
      .then(setReports);
  }, []);

  const resolve = async (id) => {
    await fetch(`/api/reports/${id}/resolve`, {
      method: "PATCH",
      credentials: "include",
    });

    setReports(reports.map(r =>
      r._id === id ? { ...r, status: "resolved" } : r
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🚨 Abuse Reports</h1>

      {reports.map(r => (
        <div key={r._id} className="border p-4 mb-4 rounded">
          <p><b>Listing:</b> {r.listingRef?.name}</p>
          <p><b>User:</b> {r.reportedBy?.email}</p>
          <p><b>Reason:</b> {r.reason}</p>
          <p><b>Status:</b> {r.status}</p>

          {r.status === "pending" && (
            <button
              onClick={() => resolve(r._id)}
              className="mt-2 text-green-600"
            >
              Mark Resolved
            </button>
          )}
        </div>
      ))}
    </div>
  );
}