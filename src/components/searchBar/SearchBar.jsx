import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <div className="inputItem">
          <input
            type="text"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
          />
        </div>
        <div className="inputItem">
          <input
            type="number"
            name="minPrice"
            min={0}
            placeholder="Min Price"
            onChange={handleChange}
          />
        </div>
        <div className="inputItem">
          <input
            type="number"
            name="maxPrice"
            min={0}
            placeholder="Max Price"
            onChange={handleChange}
          />
        </div>
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="searchLink"
        >
          <button type="button">
            <img src="/search.png" alt="search" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;