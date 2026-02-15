import "./card.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import apiRequest from "../../lib/apiRequest";
import { formatPriceCompact, getCurrencySymbol } from "../../lib/utils";
import { motion } from "framer-motion";
import { 
  Bed, 
  Bath, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Pencil, 
  Trash2,
  Building2,
  Home,
  Castle
} from "lucide-react";

// Property type icons
const propertyIcons = {
  apartment: Building2,
  house: Home,
  condo: Castle,
  land: MapPin,
};

function Card({ item, index = 0 }) {
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isOwner = currentUser && currentUser.id === item.userId;

  const PropertyIcon = propertyIcons[item.property] || Building2;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await apiRequest.delete("/posts/" + item.id);
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add save logic here
  };

  const handleChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add chat logic here
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/${item.id}`} className="card-link">
        {/* Image Container */}
        <div className="card-image">
          <img 
            src={item.images[0]} 
            alt={item.title} 
            loading="lazy"
          />
          <div className="image-overlay" />
          
          {/* Type Badge */}
          <div className={`type-badge ${item.type}`}>
            {item.type === 'buy' ? 'For Sale' : 'For Rent'}
          </div>

          {/* Property Type Icon */}
          <div className="property-icon">
            <PropertyIcon size={14} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <motion.button 
              className="action-btn save"
              onClick={handleSave}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Save property"
            >
              <Heart size={16} />
            </motion.button>
            <motion.button 
              className="action-btn chat"
              onClick={handleChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Message about property"
            >
              <MessageCircle size={16} />
            </motion.button>
          </div>

          {/* Price Badge */}
          <div className="price-badge">
            <span className="price">{getCurrencySymbol(item.currency)}{item.price?.toLocaleString()}</span>
            {item.type === 'rent' && <span className="period">/mo</span>}
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          {/* Title */}
          <h3 className="card-title">{item.title}</h3>

          {/* Location */}
          <div className="card-location">
            <MapPin size={14} />
            <span>{item.address}, {item.city}</span>
          </div>

          {/* Features */}
          <div className="card-features">
            <div className="feature">
              <Bed size={16} />
              <span>{item.bedroom} Beds</span>
            </div>
            <div className="feature">
              <Bath size={16} />
              <span>{item.bathroom} Baths</span>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="owner-actions">
              <Link 
                to={`/edit/${item.id}`} 
                className="owner-btn edit"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil size={14} />
                <span>Edit</span>
              </Link>
              <button 
                className="owner-btn delete"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default Card;
