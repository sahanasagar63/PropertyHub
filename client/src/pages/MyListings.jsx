import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch("/api/listings/my", {
          credentials: "include",
        });
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setListings((prev) => prev.filter((item) => item._id !== id));
      alert("Listing deleted successfully");
    } else {
      alert("Failed to delete listing");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {listings.length === 0 && <p>No listings found</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded shadow p-4 flex flex-col justify-between"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="font-bold mt-2">{listing.name}</h3>
              <p className="text-sm text-gray-600">{listing.city}</p>
              <p className="font-semibold text-orange-700">
                ₹ {Number(listing.price).toLocaleString("en-IN")}
              </p>
            </Link>

            <button
              onClick={() => handleDelete(listing._id)}
              className="mt-3 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              🗑 Delete Listing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}