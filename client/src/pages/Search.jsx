import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const location = useLocation();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH LISTINGS ================= */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/search${location.search}`);
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>

      {loading && <p>Loading...</p>}

      {!loading && listings.length === 0 && (
        <p>No properties found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}