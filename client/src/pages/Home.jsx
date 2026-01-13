import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CityTiles from "../components/CityTiles";
import ListingsPreview from "../components/ListingsPreview";
import AdminFooter from "../components/AdminFooter";
import AdminContactPopup from "../components/AdminContactPopup";

export default function Home() {
  const navigate = useNavigate();

  const [type, setType] = useState("sale");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [showAdminPopup, setShowAdminPopup] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) params.set("searchTerm", searchTerm);
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative h-[80vh] bg-hero bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-4">

          <h1 className="text-white text-4xl md:text-5xl font-bold text-center">
            Properties in India 🇮🇳
          </h1>

          <p className="text-white/90 mt-3 text-lg">
            Buy • Rent • Sell properties across India
          </p>

          {/* SEARCH CARD */}
          <div className="bg-white w-full max-w-4xl mt-8 rounded-xl p-6 shadow-lg">

            <input
              type="text"
              placeholder="Search by city or address"
              className="w-full border rounded-lg px-4 py-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <select
                className="border rounded-lg px-4 py-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>

              <select
                className="border rounded-lg px-4 py-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="farmhouse">Farmhouse</option>
                <option value="store">Commercial / Store</option>
              </select>

              <select
                className="border rounded-lg px-4 py-3"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-orange-600 text-white w-full mt-6 py-3 rounded-lg"
            >
              SEARCH
            </button>
            

          </div>
        </div>
      </div>

      <CityTiles />
      <ListingsPreview />

      {/* ✅ FOOTER */}
      <AdminFooter />
      {showAdminPopup && (
  <AdminContactPopup onClose={() => setShowAdminPopup(false)} />
)}
    </>
  );
}