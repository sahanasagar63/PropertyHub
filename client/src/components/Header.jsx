import { FaSearch, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const [searchTerm, setSearchTerm] = useState("");

  /* 🔍 SEARCH */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  /* 🚪 LOGOUT */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        {/* LOGO */}
        <Link to="/">
          <h1 className="font-bold text-xl flex gap-1">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700">Hub</span>
          </h1>
        </Link>

        {/* SEARCH */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* NAVIGATION */}
        <ul className="flex gap-4 items-center">

          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {/* ❤️ WISHLIST (ONLY LOGGED IN) */}
          {currentUser && (
            <Link to="/wishlist" title="Wishlist">
              <FaHeart className="text-red-600 text-lg hover:scale-110 transition" />
            </Link>
          )}

          {/* USER */}
          {currentUser ? (
            <>
              <Link to="/profile">
                <img
                  src={
                    currentUser.photoURL ||
                    currentUser.avatar ||
                    "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                  }
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in">
              <li className="font-semibold text-slate-700 hover:underline">
                Sign in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}