import { useNavigate } from "react-router-dom";

const cities = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
];

export default function CityTiles() {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-100 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Select a City
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() =>
              navigate(`/search?searchTerm=${city}`)
            }
            className="bg-white rounded-xl shadow-md p-6 text-xl font-semibold hover:shadow-lg transition"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}