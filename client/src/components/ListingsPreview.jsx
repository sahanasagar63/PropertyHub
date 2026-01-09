import { useEffect, useState } from "react";
import ListingItem from "./ListingItem";

export default function ListingsPreview() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings/search");
        const data = await res.json();
        setListings(data.slice(0, 6)); // show latest 6 listings
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-lg">
        Loading latest properties...
      </p>
    );
  }

  if (listings.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600">
        No properties available yet.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">
        Latest Properties
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}