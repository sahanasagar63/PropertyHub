import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function Listing() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  /* ================= FETCH LISTING ================= */
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setListing(data);
      } catch {
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  /* ================= CHECK WISHLIST ================= */
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setSaved(data.some((item) => item._id === listingId));
      } catch {}
    };
    checkWishlist();
  }, [listingId]);

  /* ================= TOGGLE WISHLIST ================= */
  const toggleWishlist = async () => {
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

  /* ================= STATES ================= */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!listing) return <p className="p-6 text-red-600">Listing not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* 🖼 IMAGE SLIDER */}
      {listing.imageUrls?.length > 0 && (
        <ImageSlider images={listing.imageUrls} />
      )}

      {/* TITLE + WISHLIST */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{listing.name}</h1>
          <p className="text-gray-700">
            {listing.address}, {listing.city}
            {listing.pincode && ` – ${listing.pincode}`}
          </p>
        </div>

        <button
          onClick={toggleWishlist}
          className="text-2xl"
          title="Add to Wishlist"
        >
          {saved ? (
            <FaHeart className="text-red-600" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* PRICE */}
      <p className="text-2xl font-semibold text-green-800">
        ₹ {Number(listing.price).toLocaleString("en-IN")}
        {listing.type === "rent" && " / month"}
      </p>

      {/* BASIC DETAILS */}
      <div className="bg-white p-4 rounded shadow grid sm:grid-cols-2 gap-4">
        <p><b>Category:</b> {listing.category}</p>
        <p><b>Type:</b> {listing.type}</p>
        <p><b>City:</b> {listing.city}</p>
        <p><b>Phone:</b> {listing.phone}</p>
        <p>
          <b>City Type:</b>{" "}
          {listing.cityType === "inside" ? "Inside City" : "Outside City"}
        </p>
        {listing.cityType === "outside" && listing.distance && (
          <p><b>Distance:</b> {listing.distance} km</p>
        )}
      </div>

      {/* ✅ PROPERTY FEATURES (AUTO – ALL CATEGORIES) */}
      {listing.features && Object.keys(listing.features).length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Property Features</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(listing.features).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between border-b pb-1"
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-xl font-bold">Description</h2>
        <p className="text-gray-700">{listing.description}</p>
      </div>

      {/* 🚨 REPORT ABUSE */}
      <button
        onClick={async () => {
          const reason = prompt("Reason for reporting?");
          if (!reason) return;

          await fetch(`/api/reports/${listing._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ reason }),
          });

          alert("Report submitted");
        }}
        className="border border-red-500 text-red-600 px-6 py-3 rounded hover:bg-red-50"
      >
        🚨 Report Abuse
      </button>

      {/* 📞 CONTACT */}
      <div className="flex gap-4">
        <a
          href={`tel:${listing.phone}`}
          className="bg-green-700 text-white px-6 py-3 rounded"
        >
          📞 Call Owner
        </a>

        <a
          href={`https://wa.me/91${listing.phone}`}
          target="_blank"
          rel="noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded"
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}