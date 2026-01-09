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
    distance: "", // stored as "12 km"
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

  /* Distance handler → auto add "km" */
  const handleDistanceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // numbers only
    setFormData({
      ...formData,
      distance: value ? `${value} km` : "",
    });
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

      if (!res.ok) throw new Error("Failed");

      alert("✅ Listing created");
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

      {/* PINCODE */}
      <input name="pincode" placeholder="Pincode" className="input" onChange={handleChange} />

      {/* CITY TYPE */}
      <select
        name="cityType"
        className="input"
        value={formData.cityType}
        onChange={(e) =>
          setFormData({ ...formData, cityType: e.target.value, distance: "" })
        }
        required
      >
        <option value="inside">Inside City</option>
        <option value="outside">Outside City</option>
      </select>

      {/* DISTANCE (ONLY IF OUTSIDE) */}
      {formData.cityType === "outside" && (
        <input
          placeholder="Distance from city (km)"
          className="input"
          value={formData.distance.replace(" km", "")}
          onChange={handleDistanceChange}
          required
        />
      )}

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

      {/* ===== CATEGORY BASED FEATURES (UNCHANGED) ===== */}
      {formData.category === "plot" && (
        <>
          <input name="plotArea" placeholder="Plot Area (sqft)" className="input" onChange={handleFeatureChange} />
          <input name="roadFacing" placeholder="Road Facing" className="input" onChange={handleFeatureChange} />
          <input name="layoutApproval" placeholder="Layout Approval" className="input" onChange={handleFeatureChange} />
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