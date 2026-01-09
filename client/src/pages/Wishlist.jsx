import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setWishlist(data);
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  /* ================= REMOVE FROM WISHLIST ================= */
  const removeFromWishlist = async (listingId) => {
    try {
      const res = await fetch(`/api/wishlist/${listingId}`, {
        method: "POST", // toggle removes
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      setWishlist((prev) =>
        prev.filter((item) => item._id !== listingId)
      );
    } catch {
      alert("Failed to remove from wishlist");
    }
  };

  /* ================= STATES ================= */
  if (loading) return <p className="p-6">Loading...</p>;

  if (wishlist.length === 0)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">❤️ Your wishlist is empty</h2>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ❤️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls?.[0]}
                alt={listing.name}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            </Link>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg truncate">
                {listing.name}
              </h3>

              <p className="text-sm text-gray-600">
                {listing.city}
              </p>

              <p className="font-semibold text-orange-700">
                ₹ {Number(listing.price).toLocaleString("en-IN")}
              </p>

              {/* ❌ REMOVE */}
              <button
                onClick={() => removeFromWishlist(listing._id)}
                className="mt-2 flex items-center gap-2 text-red-600 hover:underline"
              >
                <FaTrash />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}