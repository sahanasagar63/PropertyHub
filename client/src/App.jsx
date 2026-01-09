import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import MyListings from "./pages/MyListings";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";





export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />

        {/* Auth pages */}
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

        {/* Logged-in pages (no protection yet, OK for now) */}
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />

      </Routes>
    </BrowserRouter>
  );
}