import { useState, useRef, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { formatPrice, detectUserCurrency, getCurrencySymbol } from "../../lib/utils";

// Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

// Price Range Slider Component
function PriceRangeSlider({ min, max, onChange, currency }) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const sliderRef = useRef(null);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  
  const MIN_PRICE = 0;
  const MAX_PRICE = 10000000; // $10M

  useEffect(() => {
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 10000);
    setMinValue(value);
    minValRef.current = value;
    onChange({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 10000);
    setMaxValue(value);
    maxValRef.current = value;
    onChange({ min: minValue, max: value });
  };

  const getPercent = (value) => ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="priceRangeSlider">
      <div className="priceInputs">
        <div className="priceInput">
          <label>Min</label>
          <div className="inputWrapper">
            <span className="currencySymbol">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              value={minValue}
              onChange={handleMinChange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10000}
            />
          </div>
        </div>
        <span className="separator">—</span>
        <div className="priceInput">
          <label>Max</label>
          <div className="inputWrapper">
            <span className="currencySymbol">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              value={maxValue}
              onChange={handleMaxChange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10000}
            />
          </div>
        </div>
      </div>
      
      <div className="sliderContainer" ref={sliderRef}>
        <div className="sliderTrack"></div>
        <div 
          className="sliderRange"
          style={{
            left: `${getPercent(minValue)}%`,
            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
          }}
        ></div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10000}
          value={minValue}
          onChange={handleMinChange}
          className="thumb thumbMin"
          style={{ zIndex: minValue > MAX_PRICE - 100000 && "5" }}
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10000}
          value={maxValue}
          onChange={handleMaxChange}
          className="thumb thumbMax"
        />
      </div>

      <div className="pricePresets">
        <button onClick={() => onChange({ min: 0, max: 500000 })}>Under {formatPrice(500000, currency, { compact: true })}</button>
        <button onClick={() => onChange({ min: 500000, max: 1000000 })}>$500K - $1M</button>
        <button onClick={() => onChange({ min: 1000000, max: 5000000 })}>$1M - $5M</button>
        <button onClick={() => onChange({ min: 5000000, max: 10000000 })}>$5M+</button>
      </div>
    </div>
  );
}

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const currency = detectUserCurrency();

  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: parseInt(searchParams.get("minPrice")) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice")) || 10000000,
    bedroom: searchParams.get("bedroom") || "",
  });

  useEffect(() => {
    const filters = [];
    if (query.type) filters.push({ key: 'type', label: query.type === 'buy' ? 'For Sale' : 'For Rent' });
    if (query.city) filters.push({ key: 'city', label: query.city });
    if (query.property) filters.push({ key: 'property', label: query.property });
    if (query.minPrice > 0 || query.maxPrice < 10000000) {
      filters.push({ key: 'price', label: `${formatPrice(query.minPrice, currency, { compact: true })} - ${formatPrice(query.maxPrice, currency, { compact: true })}` });
    }
    if (query.bedroom) filters.push({ key: 'bedroom', label: `${query.bedroom}+ beds` });
    setActiveFilters(filters);
  }, [query, currency]);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriceChange = ({ min, max }) => {
    setQuery(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const handleFilter = () => {
    const params = {};
    Object.keys(query).forEach(key => {
      if (query[key] && query[key] !== "" && query[key] !== 0 && query[key] !== 10000000) {
        params[key] = query[key];
      }
    });
    setSearchParams(params);
  };

  const clearFilter = (key) => {
    let newQuery = { ...query };
    if (key === 'price') {
      newQuery.minPrice = 0;
      newQuery.maxPrice = 10000000;
    } else {
      newQuery[key] = "";
    }
    setQuery(newQuery);
  };

  const clearAllFilters = () => {
    setQuery({
      type: "",
      city: "",
      property: "",
      minPrice: 0,
      maxPrice: 10000000,
      bedroom: "",
    });
    setSearchParams({});
  };

  return (
    <div className="filter">
      <div className="filterHeader">
        <h1>
          Search results for <span>{searchParams.get("city") || "All Locations"}</span>
        </h1>
        {activeFilters.length > 0 && (
          <button className="clearAllBtn" onClick={clearAllFilters}>
            Clear all filters
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="activeFilters">
          {activeFilters.map((filter) => (
            <span key={filter.key} className="filterChip">
              {filter.label}
              <button onClick={() => clearFilter(filter.key)}>
                <CloseIcon />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Filter Bar */}
      <div className="filterBar">
        {/* Location */}
        <div className="filterItem locationInput">
          <label>Location</label>
          <div className="inputWrapper">
            <input
              type="text"
              name="city"
              placeholder="Enter city or area"
              onChange={handleChange}
              defaultValue={query.city}
            />
          </div>
        </div>

        {/* Type */}
        <div className="filterItem">
          <label>Type</label>
          <select name="type" onChange={handleChange} value={query.type}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <ChevronIcon />
        </div>

        {/* Property */}
        <div className="filterItem">
          <label>Property</label>
          <select name="property" onChange={handleChange} value={query.property}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
          <ChevronIcon />
        </div>

        {/* Bedrooms */}
        <div className="filterItem">
          <label>Bedrooms</label>
          <select name="bedroom" onChange={handleChange} value={query.bedroom}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <ChevronIcon />
        </div>

        {/* Search Button */}
        <button className="searchBtn" onClick={handleFilter}>
          <SearchIcon />
          <span>Search</span>
        </button>
      </div>

      {/* Expandable Price Filter */}
      <div className={`priceFilterSection ${expanded ? "expanded" : ""}`}>
        <button className="expandBtn" onClick={() => setExpanded(!expanded)}>
          <span>Price Range</span>
          <ChevronIcon />
        </button>
        
        {expanded && (
          <div className="priceFilterContent animate-fadeInUp">
            <PriceRangeSlider
              min={query.minPrice}
              max={query.maxPrice}
              onChange={handlePriceChange}
              currency={currency}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;
