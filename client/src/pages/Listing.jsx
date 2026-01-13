import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AdminFooter from "../components/AdminFooter";
import AdminContactPopup from "../components/AdminContactPopup";

export default function Listing() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!listing) return <p className="p-6 text-red-600">Listing not found</p>;

  /* ✅ CLEAN PHONE NUMBER (VERY IMPORTANT) */
  const phone = listing.phone?.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${phone}?text=Hello,%20I%20am%20interested%20in%20this%20property`;

  return (
    <>
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
            </p>
          </div>

          <button
            onClick={() => setSaved(!saved)}
            className="text-2xl"
          >
            {saved ? (
              <FaHeart className="text-red-600" />
            ) : (
              <FaRegHeart className="text-gray-400" />
            )}
          </button>
        </div>

        {/* PRICE */}
        <p className="text-2xl font-semibold text-green-800">
          ₹ {Number(listing.price).toLocaleString("en-IN")}
        </p>

        {/* 📞 CONTACT BUTTONS */}
        <div className="flex flex-wrap gap-4 mt-6">

          {/* CALL OWNER */}
          <a
            href={`tel:${phone}`}
            className="bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            📞 Call Owner
          </a>

          {/* WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            💬 WhatsApp
          </a>

          {/* CONTACT ADMIN */}
          
        </div>
      </div>

      {/* ✅ FOOTER */}
      <AdminFooter />

      {/* ✅ ADMIN POPUP */}
      {showAdminPopup && (
        <AdminContactPopup onClose={() => setShowAdminPopup(false)} />
      )}
    </>
  );
}