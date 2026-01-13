import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) return <Navigate to="/sign-in" />;
  if (currentUser.role !== "admin") return <Navigate to="/" />;

  return children;
}