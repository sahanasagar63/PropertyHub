import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then(res => res.json())
      .then(setUsers);

    fetch("/api/admin/listings", { credentials: "include" })
      .then(res => res.json())
      .then(setListings);
  }, []);

  const deleteUser = async (id) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers(users.filter(u => u._id !== id));
  };

  const deleteListing = async (id) => {
    await fetch(`/api/admin/listings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setListings(listings.filter(l => l._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold">🧑‍💼 Admin Panel</h1>

      {/* USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Users</h2>
        {users.map(u => (
          <div key={u._id} className="flex justify-between border-b py-2">
            <span>{u.email}</span>
            <button
              onClick={() => deleteUser(u._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* LISTINGS */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Listings</h2>
        {listings.map(l => (
          <div key={l._id} className="flex justify-between border-b py-2">
            <span>{l.name}</span>
            <button
              onClick={() => deleteListing(l._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}