import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import EditProfileModal from "../components/EditProfileModal";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  if (!currentUser) return <Navigate to="/sign-in" />;

  const handleSaveProfile = async ({ phone, address }) => {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone, address }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    dispatch(signInSuccess(data.user));
  };

  return (
<div className="min-h-screen py-20 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Profile</h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <img
            src={
              currentUser.avatar ||
              "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
            }
            alt="profile"
            className="h-28 w-28 rounded-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-3 text-lg">
          <p><b>Username:</b> {currentUser.username}</p>
          {currentUser.email && <p><b>Email:</b> {currentUser.email}</p>}
          {currentUser.phone && <p><b>Phone:</b> {currentUser.phone}</p>}
          {currentUser.address && <p><b>Address:</b> {currentUser.address}</p>}
          <p><b>Role:</b> {currentUser.role}</p>
        </div>

        {/* SMALL EDIT PROFILE BUTTON */}
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ================= ACTION BUTTONS (OUTSIDE CARD) ================= */}
      <div className="max-w-md mx-auto mt-6 flex flex-col gap-4">
        <Link to="/create-listing">
          <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold">
            CREATE LISTING
          </button>
        </Link>

        <Link to="/my-listings">
          <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold">
            MY LISTINGS
          </button>
        </Link>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showModal && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}