import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const toggleBlock = async (id) => {
    const res = await fetch(`/api/admin/users/block/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    const data = await res.json();

    setUsers(users.map(u =>
      u._id === id ? { ...u, isBlocked: data.isBlocked } : u
    ));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {users.map(u => (
        <div key={u._id} className="border p-4 rounded flex justify-between">
          <div>
            <p><b>Name:</b> {u.username}</p>
            <p><b>Email:</b> {u.email || "—"}</p>
            <p><b>Phone:</b> {u.phone || "—"}</p>
            <p><b>Address:</b> {u.address || "—"}</p>
            <p><b>Role:</b> {u.role}</p>
            <p>
              <b>Status:</b>{" "}
              <span className={u.isBlocked ? "text-red-600" : "text-green-600"}>
                {u.isBlocked ? "Blocked" : "Active"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => toggleBlock(u._id)}
              className="bg-yellow-500 text-white px-4 py-1 rounded"
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>

            {u.role !== "admin" && (
              <button
                onClick={() => deleteUser(u._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}