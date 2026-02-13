import "./card.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import apiRequest from "../../lib/apiRequest";
import { formatPriceCompact } from "../../lib/utils";

// Icons
const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const BathIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
    <line x1="10" x2="8" y1="5" y2="7"/>
    <line x1="2" x2="22" y1="12" y2="12"/>
    <line x1="7" x2="7" y1="19" y2="21"/>
    <line x1="17" x2="17" y1="19" y2="21"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isOwner = currentUser && currentUser.id === item.userId;

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

  return (
    <div className="card animate-fadeInUp">
      <Link to={`/${item.id}`} className="cardLink">
        {/* Image Container */}
        <div className="imageContainer">
          <img 
            src={item.images[0]} 
            alt={item.title} 
            loading="lazy"
          />
          <div className="imageOverlay"></div>
          
          {/* Price Badge */}
          <div className="priceBadge">
            <span className="price">{formatPriceCompact(item.price)}</span>
          </div>

          {/* Type Badge */}
          <div className={`typeBadge ${item.type}`}>
            {item.type === 'buy' ? 'For Sale' : 'For Rent'}
          </div>

          {/* Quick Actions */}
          <div className="quickActions">
            <button className="actionBtn save" onClick={(e) => e.preventDefault()}>
              <SaveIcon />
            </button>
            <button className="actionBtn chat" onClick={(e) => e.preventDefault()}>
              <ChatIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Title */}
          <h3 className="title">{item.title}</h3>

          {/* Location */}
          <div className="location">
            <LocationIcon />
            <span>{item.address}, {item.city}</span>
          </div>

          {/* Features */}
          <div className="features">
            <div className="feature">
              <BedIcon />
              <span>{item.bedroom} Beds</span>
            </div>
            <div className="feature">
              <BathIcon />
              <span>{item.bathroom} Baths</span>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="ownerActions">
              <Link 
                to={`/edit/${item.id}`} 
                className="ownerBtn edit"
                onClick={(e) => e.stopPropagation()}
              >
                <EditIcon />
                <span>Edit</span>
              </Link>
              <button 
                className="ownerBtn delete"
                onClick={handleDelete}
              >
                <DeleteIcon />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default Card;
