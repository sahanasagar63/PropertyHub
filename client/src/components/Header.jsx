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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    dispatch(signOutSuccess());
    navigate("/");
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-xl">
            <span className="text-slate-500">Property</span>{" "}
            <span className="text-slate-700">Hub</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/"><li>Home</li></Link>
          <Link to="/about"><li>About</li></Link>

          {currentUser && (
            <Link to="/wishlist"><FaHeart className="text-red-600" /></Link>
          )}

          {currentUser?.role === "admin" && (
            <Link to="/admin">
              <li className="text-purple-700 font-semibold">Admin</li>
            </Link>
          )}

          {currentUser ? (
            <>
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Link>
              <button onClick={handleLogout} className="text-red-600 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in"><li>Sign in</li></Link>
          )}
        </ul>
      </div>
    </header>
  );
}