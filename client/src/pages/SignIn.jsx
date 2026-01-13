import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signInSuccess } from "../redux/user/userSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const [formData, setFormData] = useState({
    identifier: "", // email OR phone
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Sign in failed");
        return;
      }

      dispatch(signInSuccess(data.user));
      toast.success("Signed in successfully");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Google login failed");
        return;
      }

      dispatch(signInSuccess(data.user));
      toast.success("Signed in with Google");
      navigate("/");
    } catch (err) {
      toast.error("Google sign in failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email or Phone"
          id="identifier"
          required
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <button className="bg-red-700 text-white p-3 rounded uppercase">
          Sign In
        </button>
      </form>

      <div className="flex justify-center my-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login failed")}
        />
      </div>

      <p className="text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link to="/sign-up" className="text-blue-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}