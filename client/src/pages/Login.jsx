import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // NORMAL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password }
      );
      setMessage("Login successful");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/google",
        { idToken: credentialResponse.credential }
      );
      setMessage("Google login successful");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <hr />

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => setMessage("Google Login Failed")}
      />

      <p>{message}</p>
    </div>
  );
}