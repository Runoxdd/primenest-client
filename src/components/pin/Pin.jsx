import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import { Bed, Bath } from "lucide-react";

function Pin({ item }) {
  const formatPrice = (price, currency) => {
    const curr = currency || 'NGN';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popup-container">
          <div className="popup-image">
            <img src={item.images[0]} alt={item.title} />
            <div className="type-badge">{item.type}</div>
          </div>
          <div className="popup-content">
            <Link to={`/${item.id}`} className="popup-title">
              {item.title}
            </Link>
            <div className="popup-details">
              <div className="detail-item">
                <Bed size={14} />
                <span>{item.bedroom} Beds</span>
              </div>
              <div className="detail-item">
                <Bath size={14} />
                <span>{item.bathroom} Baths</span>
              </div>
            </div>
            <div className="popup-price">
              {formatPrice(item.price, item.currency)}
              {item.type === "rent" && <span className="price-period">/mo</span>}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
