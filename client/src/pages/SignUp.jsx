import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
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

    if (!formData.email && !formData.phone) {
      toast.error("Please enter email or phone number");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      dispatch(signInSuccess(data.user));
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          required
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email (optional)"
          id="email"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="tel"
          placeholder="Phone number (optional)"
          id="phone"
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
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-blue-600">
          Sign in
        </Link>
      </p>
    </div>
  );
}