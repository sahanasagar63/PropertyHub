import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";

export default function PrivateRoute() {
  return auth.currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}