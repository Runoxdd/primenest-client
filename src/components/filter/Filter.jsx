import { useState, useRef, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { formatPrice, detectUserCurrency, getCurrencySymbol } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  ChevronDown, 
  MapPin, 
  Home, 
  Building2, 
  Castle,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

// Property type icons mapping
const propertyIcons = {
  apartment: Building2,
  house: Home,
  condo: Castle,
  land: MapPin,
};

// Custom Price Range Slider Component
function PriceRangeSlider({ min, max, onChange, currency }) {
  const [values, setValues] = useState([min, max]);
  const MIN_PRICE = 0;
  const MAX_PRICE = 500000000; // 500M Naira

  useEffect(() => {
    setValues([min, max]);
  }, [min, max]);

  const handleValueChange = (newValues) => {
    setValues(newValues);
  };

  const handleValueCommit = (newValues) => {
    onChange({ min: newValues[0], max: newValues[1] });
  };

  const formatValue = (value) => {
    if (value >= 1000000) {
      return `${getCurrencySymbol(currency)}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${getCurrencySymbol(currency)}${(value / 1000).toFixed(0)}K`;
    }
    return `${getCurrencySymbol(currency)}${value}`;
  };

  const presets = [
    { label: `Under ${formatValue(10000000)}`, min: 0, max: 10000000 },
    { label: `${formatValue(10000000)} - ${formatValue(50000000)}`, min: 10000000, max: 50000000 },
    { label: `${formatValue(50000000)} - ${formatValue(100000000)}`, min: 50000000, max: 100000000 },
    { label: `${formatValue(100000000)}+`, min: 100000000, max: 500000000 },
  ];

  return (
    <div className="price-slider">
      {/* Price Inputs */}
      <div className="price-inputs">
        <div className="price-input-group">
          <label>Min Price</label>
          <div className="price-input">
            <span className="currency">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              value={values[0]}
              onChange={(e) => {
                const newMin = Math.min(Number(e.target.value), values[1] - 10000);
                setValues([newMin, values[1]]);
                onChange({ min: newMin, max: values[1] });
              }}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10000}
            />
          </div>
        </div>
        <div className="price-separator">—</div>
        <div className="price-input-group">
          <label>Max Price</label>
          <div className="price-input">
            <span className="currency">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              value={values[1]}
              onChange={(e) => {
                const newMax = Math.max(Number(e.target.value), values[0] + 10000);
                setValues([values[0], newMax]);
                onChange({ min: values[0], max: newMax });
              }}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10000}
            />
          </div>
        </div>
      </div>

      {/* Radix Slider */}
      <div className="slider-wrapper">
        <Slider.Root
          className="slider-root"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10000}
          value={values}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" aria-label="Min price" />
          <Slider.Thumb className="slider-thumb" aria-label="Max price" />
        </Slider.Root>
      </div>

      {/* Price Presets */}
      <div className="price-presets">
        {presets.map((preset, index) => (
          <button
            key={index}
            className={`preset-btn ${values[0] === preset.min && values[1] === preset.max ? 'active' : ''}`}
            onClick={() => {
              setValues([preset.min, preset.max]);
              onChange({ min: preset.min, max: preset.max });
            }}
          >
            {preset.label}
          </button>
        ))}
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
    maxPrice: parseInt(searchParams.get("maxPrice")) || 500000000,
    bedroom: searchParams.get("bedroom") || "",
  });

  useEffect(() => {
    const filters = [];
    if (query.type) filters.push({ key: 'type', label: query.type === 'buy' ? 'For Sale' : 'For Rent' });
    if (query.city) filters.push({ key: 'city', label: query.city });
    if (query.property) filters.push({ key: 'property', label: query.property.charAt(0).toUpperCase() + query.property.slice(1) });
    if (query.minPrice > 0 || query.maxPrice < 500000000) {
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
      if (query[key] && query[key] !== "" && query[key] !== 0 && query[key] !== 500000000) {
        params[key] = query[key];
      }
    });
    setSearchParams(params);
  };

  const clearFilter = (key) => {
    let newQuery = { ...query };
    if (key === 'price') {
      newQuery.minPrice = 0;
      newQuery.maxPrice = 500000000;
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
      maxPrice: 500000000,
      bedroom: "",
    });
    setSearchParams({});
  };

  return (
    <div className="filter">
      {/* Filter Header */}
      <div className="filter-header">
        <div className="header-content">
          <h1>
            Search results for <span>{searchParams.get("city") || "All Locations"}</span>
          </h1>
          {activeFilters.length > 0 && (
            <motion.button 
              className="clear-all-btn"
              onClick={clearAllFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear all
            </motion.button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div 
            className="active-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {activeFilters.map((filter, index) => (
              <motion.span
                key={filter.key}
                className="filter-chip"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                {filter.label}
                <button onClick={() => clearFilter(filter.key)}>
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Filter Bar */}
      <div className="filter-bar">
        {/* Location */}
        <div className="filter-item location">
          <label>Location</label>
          <div className="input-wrapper">
            <MapPin size={16} className="input-icon" />
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
        <div className="filter-item select">
          <label>Type</label>
          <div className="select-wrapper">
            <select name="type" onChange={handleChange} value={query.type}>
              <option value="">Any</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {/* Property */}
        <div className="filter-item select">
          <label>Property</label>
          <div className="select-wrapper">
            <select name="property" onChange={handleChange} value={query.property}>
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="filter-item select">
          <label>Bedrooms</label>
          <div className="select-wrapper">
            <select name="bedroom" onChange={handleChange} value={query.bedroom}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {/* Search Button */}
        <motion.button 
          className="search-btn"
          onClick={handleFilter}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search size={18} />
          <span>Search</span>
        </motion.button>
      </div>

      {/* Expandable Price Filter */}
      <div className={`price-section ${expanded ? "expanded" : ""}`}>
        <motion.button 
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.98 }}
        >
          <SlidersHorizontal size={16} />
          <span>Price Range</span>
          <ChevronDown size={16} className={`expand-icon ${expanded ? 'rotated' : ''}`} />
        </motion.button>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="price-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PriceRangeSlider
                min={query.minPrice}
                max={query.maxPrice}
                onChange={handlePriceChange}
                currency={currency}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Filter;
