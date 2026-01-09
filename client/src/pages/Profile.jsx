import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="h-28 w-28 rounded-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-3 text-lg">
          <p>
            <b>Username:</b>{" "}
            {currentUser.username ||
              currentUser.email.split("@")[0]}
          </p>

          <p>
            <b>Email:</b> {currentUser.email}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 space-y-4">
          <Link to="/create-listing">
            <button className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold">
              CREATE LISTING
            </button>
          </Link>

          <Link to="/my-listings">
            <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold">
              MY LISTINGS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}