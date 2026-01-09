import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

export default function ListingItem({ listing }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const image =
    listing.imageUrls?.length > 0
      ? listing.imageUrls[0]
      : "https://images.unsplash.com/photo-1568605114967-8130f3a36994";

  const listingId = listing._id || listing.id;

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // 🔥 prevent card click
    e.preventDefault();

    try {
      const res = await fetch(`/api/wishlist/${listingId}`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/sign-in");
        return;
      }

      setSaved(!saved);
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow hover:shadow-xl transition w-full">

      {/* ❤️ WISHLIST */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 text-xl z-10"
      >
        {saved ? (
          <FaHeart className="text-red-600" />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-red-500" />
        )}
      </button>

      <Link to={`/listing/${listingId}`}>
        <div className="relative">
          <img
            src={image}
            alt={listing.name}
            className="h-48 w-full object-cover rounded-t-lg"
          />

          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            {listing.type === "rent" ? "RENT" : "BUY"}
          </span>
        </div>

        <div className="p-4 space-y-1">
          <h3 className="font-bold text-lg truncate">
            {listing.name}
          </h3>

          <p className="flex items-center text-sm text-gray-600">
            <MdLocationOn className="text-green-600 mr-1" />
            {listing.city}
          </p>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.address}
          </p>

          <p className="font-semibold mt-2 text-orange-700">
            ₹ {Number(listing.price).toLocaleString("en-IN")}
          </p>
        </div>
      </Link>
    </div>
  );
}