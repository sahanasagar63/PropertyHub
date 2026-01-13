import { useState } from "react";
import { useNavigate } from "react-router-dom";
import indiaStates from "../data/indiaStates";

export default function CreateListing() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phone: "",
    category: "",
    type: "sale",
    price: "",
    cityType: "inside",
    distance: "",
    features: {},
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (e) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length < 1 || files.length > 8) {
      alert("Upload 1–8 images");
      return;
    }

    try {
      setLoading(true);

      const imgData = new FormData();
      files.forEach((file) => imgData.append("images", file));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: imgData,
      });

      const { urls } = await uploadRes.json();

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          imageUrls: urls,
        }),
      });

      if (!res.ok) throw new Error("Failed to create listing");

      alert("✅ Listing created successfully");
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-4">

      <input name="name" placeholder="Property Name" className="input" onChange={handleChange} required />
      <input name="description" placeholder="Description" className="input" onChange={handleChange} required />
      <input name="address" placeholder="Address" className="input" onChange={handleChange} required />

      {/* STATE */}
      <select
        name="state"
        className="input"
        value={formData.state}
        onChange={(e) =>
          setFormData({ ...formData, state: e.target.value, city: "" })
        }
        required
      >
        <option value="">Select State</option>
        {Object.keys(indiaStates).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* CITY */}
      <select
        name="city"
        className="input"
        value={formData.city}
        onChange={handleChange}
        disabled={!formData.state}
        required
      >
        <option value="">Select City</option>
        {formData.state &&
          indiaStates[formData.state].map((c) => (
            <option key={c}>{c}</option>
          ))}
      </select>

      {/* CITY TYPE */}
      <select
        name="cityType"
        className="input"
        value={formData.cityType}
        onChange={handleChange}
        required
      >
        <option value="inside">Inside City</option>
        <option value="outside">Outside City</option>
      </select>

      {/* DISTANCE (ONLY IF OUTSIDE CITY) */}
      {formData.cityType === "outside" && (
        <input
          type="number"
          placeholder="Distance from city (km)"
          className="input"
          onChange={(e) =>
            setFormData({
              ...formData,
              distance: `${e.target.value} km`,
            })
          }
          required
        />
      )}

      <input name="pincode" placeholder="Pincode" className="input" onChange={handleChange} />
      <input name="phone" placeholder="Phone" className="input" onChange={handleChange} required />

      {/* CATEGORY */}
      <select name="category" className="input" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="plot">Plot</option>
        <option value="farmhouse">Farmhouse</option>
        <option value="agricultural">Agricultural Land</option>
        <option value="store">Store / Shop</option>
      </select>

      <input name="price" placeholder="Price" className="input" onChange={handleChange} required />

      {/* ===== CATEGORY BASED FEATURES ===== */}

      {(formData.category === "house" || formData.category === "apartment") && (
        <>
          <input name="bedrooms" placeholder="Bedrooms" className="input" onChange={handleFeatureChange} />
          <input name="bathrooms" placeholder="Bathrooms" className="input" onChange={handleFeatureChange} />
          <input name="parking" placeholder="Parking (Yes/No)" className="input" onChange={handleFeatureChange} />
          <input name="furnished" placeholder="Furnished (Yes/No)" className="input" onChange={handleFeatureChange} />
          <input name="squareFeet" placeholder="Built-up Area (sqft)" className="input" onChange={handleFeatureChange} />
          <input name="balcony" placeholder="Balcony (Yes/No)" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "apartment" && (
        <>
          <input name="floor" placeholder="Floor" className="input" onChange={handleFeatureChange} />
          <input name="lift" placeholder="Lift (Yes/No)" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "villa" && (
        <>
          <input name="bedrooms" placeholder="Bedrooms" className="input" onChange={handleFeatureChange} />
          <input name="landArea" placeholder="Land Area (sqft)" className="input" onChange={handleFeatureChange} />
          <input name="garden" placeholder="Garden (Yes/No)" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "plot" && (
        <>
          <input name="plotArea" placeholder="Plot Area (sqft)" className="input" onChange={handleFeatureChange} />
          <input name="roadFacing" placeholder="Road Facing" className="input" onChange={handleFeatureChange} />
          <input name="layoutApproval" placeholder="Layout Approval" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "farmhouse" && (
        <>
          <input name="landArea" placeholder="Land Area" className="input" onChange={handleFeatureChange} />
          <input name="waterSource" placeholder="Water Source" className="input" onChange={handleFeatureChange} />
          <input name="fencing" placeholder="Fencing (Yes/No)" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "agricultural" && (
        <>
          <input name="landArea" placeholder="Land Area (acre)" className="input" onChange={handleFeatureChange} />
          <input name="soilType" placeholder="Soil Type" className="input" onChange={handleFeatureChange} />
          <input name="waterSource" placeholder="Water Source" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {formData.category === "store" && (
        <>
          <input name="shopType" placeholder="Best suited for" className="input" onChange={handleFeatureChange} />
          <input name="squareFeet" placeholder="Shop Area (sqft)" className="input" onChange={handleFeatureChange} />
          <input name="crowdArea" placeholder="Crowded Area (Yes/No)" className="input" onChange={handleFeatureChange} />
        </>
      )}

      {/* IMAGES */}
      <input type="file" multiple onChange={handleImageChange} />

      <button disabled={loading} className="bg-black text-white p-3 w-full">
        {loading ? "Uploading..." : "CREATE LISTING"}
      </button>
    </form>
  );
}