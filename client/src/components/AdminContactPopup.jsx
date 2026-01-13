import { FaTimes, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function AdminContactPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes size={18} />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-4">
          📞 Contact Admin
        </h2>

        {/* ADMIN DETAILS */}
        <div className="space-y-3 text-center">
          <p className="text-lg font-semibold">Sahana S</p>
          <p className="text-gray-600">Project Administrator</p>
          <p className="text-gray-800 font-medium">+91 9XXXXXXXXX</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-6">
          <a
            href="tel:+919XXXXXXXXX"
            className="flex-1 bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <FaPhoneAlt /> Call
          </a>

          <a
            href="https://wa.me/919XXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}