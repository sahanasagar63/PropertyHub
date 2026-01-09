// src/pages/UpdateListing.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage, serverTimestamp } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

export default function UpdateListing() {
  const { listingId } = useParams();
  const DEFAULT_PHONE = "6363640030";

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    phone: DEFAULT_PHONE,
    type: "rent",
    regularPrice: "",
    offer: false,
  });

  const [existingImages, setExistingImages] = useState([]); // [{url, path}, ...]
  const [newFiles, setNewFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const CATEGORIES = [
    { value: "house", label: "House" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
  ];

  useEffect(() => {
    if (!listingId) return;
    (async () => {
      try {
        const refDoc = doc(db, "listings", listingId);
        const snap = await getDoc(refDoc);
        if (!snap.exists()) {
          setMsg("Listing not found");
          return;
        }
        const data = snap.data();
        setFormData({
          name: data.name || "",
          category: data.category || "",
          address: data.address || "",
          phone: data.phone || DEFAULT_PHONE,
          type: data.type || "rent",
          regularPrice: data.regularPrice || "",
          offer: data.offer || false,
        });
        setExistingImages(Array.isArray(data.images) ? data.images : []);
      } catch (err) {
        console.error(err);
        setMsg("Error loading listing");
      }
    })();
  }, [listingId]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 8);
    setNewFiles(selected);
    setPreviewImages(selected.map((f) => URL.createObjectURL(f)));
  };

  const uploadFiles = async (filesArr) => {
    if (!filesArr || filesArr.length === 0) return [];
    const uploads = filesArr.map((file) => {
      return new Promise((resolve, reject) => {
        const filename = `${uuidv4()}-${file.name}`;
        const path = `listings/${filename}`;
        const r = ref(storage, path);
        const task = uploadBytesResumable(r, file);
        task.on(
          "state_changed",
          () => {},
          (err) => reject(err),
          async () => {
            try {
              const url = await getDownloadURL(task.snapshot.ref);
              resolve({ url, path: task.snapshot.ref.fullPath });
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });
    return Promise.all(uploads);
  };

  const deleteStorageObjects = async (images) => {
    if (!Array.isArray(images)) return;
    await Promise.all(
      images.map((img) => {
        if (!img.path) return Promise.resolve();
        const r = ref(storage, img.path);
        return deleteObject(r).catch((e) => console.warn("Delete failed", img.path, e.message || e));
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listingId) return;
    setLoading(true);
    setMsg("");
    try {
      const docRef = doc(db, "listings", listingId);

      let imagesToSave = existingImages;

      if (newFiles && newFiles.length > 0) {
        const uploaded = await uploadFiles(newFiles);
        // delete old files from storage (best-effort)
        await deleteStorageObjects(existingImages);
        imagesToSave = uploaded.map((u) => ({ url: u.url, path: u.path }));
      }

      await updateDoc(docRef, { ...formData, images: imagesToSave, updatedAt: serverTimestamp() });

      setMsg("Listing updated successfully.");
      setExistingImages(imagesToSave);
      setNewFiles([]);
      setPreviewImages([]);
    } catch (err) {
      console.error(err);
      setMsg("Error updating listing: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!listingId) {
    return <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">No listing selected.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center mb-6">Update Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-medium">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2" required />
        </div>

        <div>
          <label className="font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">-- Choose Category --</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">Address</label>
          <input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2 bg-gray-100" />
        </div>

        <div>
          <label className="font-medium">Phone (pre-filled)</label>
          <input name="phone" value={formData.phone} readOnly className="w-full border rounded-lg p-2 bg-gray-200 cursor-not-allowed" />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="font-medium">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="offer" checked={formData.offer} onChange={handleChange} />
            <label className="font-medium">Offer / Discount</label>
          </div>
        </div>

        <div>
          <label className="font-medium">Regular price (₹)</label>
          <input
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter amount in rupees"
          />
        </div>

        <div className="border p-4 rounded-lg">
          <label className="font-medium">Replace images (max 8)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="block mt-2" />

          <div className="mt-3">
            <div className="text-sm font-medium">Current images</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {existingImages.length === 0 && <div className="text-gray-500">No images</div>}
              {existingImages.map((img, i) => (
                <img key={i} src={img.url} alt={`existing-${i}`} className="h-24 w-36 object-cover rounded-md border" />
              ))}
            </div>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium">New images preview</div>
              <div className="flex gap-2 flex-wrap mt-2">
                {previewImages.map((src, i) => (
                  <img key={i} src={src} alt={`preview-${i}`} className="h-24 w-36 object-cover rounded-md border" />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>

        {msg && <p className="text-center text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}