import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Coins } from "lucide-react";

const types = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" }
];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    params.set("type", query.type);
    if (query.city) params.set("city", query.city);
    if (query.minPrice) params.set("minPrice", query.minPrice);
    if (query.maxPrice) params.set("maxPrice", query.maxPrice);
    return `/list?${params.toString()}`;
  };

  return (
    <div className="search-bar">
      {/* Type Toggle */}
      <div className="search-type-toggle">
        {types.map((type) => (
          <motion.button
            key={type.value}
            onClick={() => switchType(type.value)}
            className={`type-btn ${query.type === type.value ? "active" : ""}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Search Form */}
      <div className="search-form">
        {/* Location Input */}
        <div className="search-field location">
          <MapPin size={18} className="field-icon" />
          <input
            type="text"
            name="city"
            placeholder="Enter city or area"
            value={query.city}
            onChange={handleChange}
          />
        </div>

        {/* Divider */}
        <div className="field-divider" />

        {/* Min Price */}
        <div className="search-field price">
          <label className="field-label">Min</label>
          <Coins size={18} className="field-icon" />
          <input
            type="number"
            name="minPrice"
            min={0}
            placeholder="Min"
            value={query.minPrice}
            onChange={handleChange}
          />
        </div>

        {/* Divider */}
        <div className="field-divider" />

        {/* Max Price */}
        <div className="search-field price">
          <label className="field-label">Max</label>
          <Coins size={18} className="field-icon" />
          <input
            type="number"
            name="maxPrice"
            min={0}
            placeholder="Max"
            value={query.maxPrice}
            onChange={handleChange}
          />
        </div>

        {/* Search Button */}
        <Link to={buildSearchUrl()} className="search-btn-link">
          <motion.button
            type="button"
            className="search-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
            <span>Search</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default SearchBar;
