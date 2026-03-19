import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { getCurrencySymbol } from "../../lib/utils";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Heart, 
  MessageSquare, 
  Bed, 
  Bath, 
  Maximize,
  Building2,
  PawPrint,
  DollarSign,
  GraduationCap,
  Bus,
  UtensilsCrossed,
  Wrench,
  User,
  Shield,
  ArrowLeft,
  Loader2
} from "lucide-react";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      setSaved((prev) => !prev);
    }
  };

  const handleContact = async () => {
    // Prevent multiple clicks
    if (isCreatingChat) return;
    
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.id === post.userId) {
      alert("You cannot start a conversation with yourself.");
      return;
    }

    setIsCreatingChat(true);
    try {
      const res = await apiRequest.post("/chats", { receiverId: post.userId });
      // Navigate to messages page instead of profile
      navigate("/messages");
    } catch (err) {
      console.error("Error creating chat:", err);
      // Still navigate to messages - chat might already exist
      navigate("/messages");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const formatPrice = (price, currency = "NGN") => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price?.toLocaleString()}`;
  };

  return (
    <div className="single-page">
      {/* Image Gallery */}
      <motion.div 
        className="gallery-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Slider images={post.images} />
      </motion.div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Left Column - Details */}
        <motion.div 
          className="details-column"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Header */}
          <div className="property-header">
            <div className="header-top">
              <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            </div>

            <div className="property-title-section">
              <span className="type-badge">{post.type === 'buy' ? 'For Sale' : 'For Rent'}</span>
              <h1>{post.title}</h1>
              {post.status === "delisted" && (
                <div className="delisted-alert">
                  <ShieldAlert size={18} />
                  <span>This property has been delisted by an administrator.</span>
                </div>
              )}
              <div className="location">
                <MapPin size={18} />
                <span>{post.address}</span>
              </div>
            </div>

            <div className="price-section">
              <span className="price">{formatPrice(post.price, post.currency)}</span>
              {post.type === "rent" && <span className="price-period">/month</span>}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat">
              <Bed size={20} />
              <div className="stat-info">
                <span className="stat-value">{post.bedroom}</span>
                <span className="stat-label">Bedrooms</span>
              </div>
            </div>
            <div className="stat">
              <Bath size={20} />
              <div className="stat-info">
                <span className="stat-value">{post.bathroom}</span>
                <span className="stat-label">Bathrooms</span>
              </div>
            </div>
            <div className="stat">
              <Maximize size={20} />
              <div className="stat-info">
                <span className="stat-value">{post.postDetail.size}</span>
                <span className="stat-label">Sq Ft</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>About this property</h2>
            <div
              className="description-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            />
          </div>
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div 
          className="sidebar-column"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Agent Card */}
          <div className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                <img src={post.user.avatar || "/noavatar.jpg"} alt={post.user.username} />
              </div>
              <div className="agent-info">
                <h3>{post.user.username}</h3>
                <span className="agent-badge">
                  <Shield size={14} />
                  Verified Agent
                </span>
              </div>
            </div>
            <motion.button 
              className="contact-button"
              onClick={handleContact}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isCreatingChat}
            >
              {isCreatingChat ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  <span>Contact Agent</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Property Details */}
          <div className="details-card">
            <h3>Property Details</h3>
            
            <div className="detail-section">
              <h4>
                <Wrench size={16} />
                Utilities
              </h4>
              <p>{post.postDetail.utilities === "owner" ? "Managed by Owner" : "Managed by Tenant"}</p>
            </div>

            <div className="detail-section">
              <h4>
                <PawPrint size={16} />
                Pet Policy
              </h4>
              <p>{post.postDetail.pet === "allowed" ? "Pets Allowed" : "No Pets Allowed"}</p>
            </div>

            <div className="detail-section">
              <h4>
                <DollarSign size={16} />
                Income Requirement
              </h4>
              <p>{post.postDetail.income}</p>
            </div>
          </div>

          {/* Nearby Amenities */}
          <div className="amenities-card">
            <h3>Nearby</h3>
            <div className="amenities-grid">
              <div className="amenity">
                <GraduationCap size={18} />
                <div className="amenity-info">
                  <span className="amenity-label">School</span>
                  <span className="amenity-distance">
                    {post.postDetail.school > 999 
                      ? `${(post.postDetail.school / 1000).toFixed(1)}km` 
                      : `${post.postDetail.school}m`}
                  </span>
                </div>
              </div>
              <div className="amenity">
                <Bus size={18} />
                <div className="amenity-info">
                  <span className="amenity-label">Transit</span>
                  <span className="amenity-distance">{post.postDetail.bus}m</span>
                </div>
              </div>
              <div className="amenity">
                <UtensilsCrossed size={18} />
                <div className="amenity-info">
                  <span className="amenity-label">Dining</span>
                  <span className="amenity-distance">{post.postDetail.restaurant}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="map-card">
            <h3>Location</h3>
            <div className="map-wrapper">
              <Map items={[post]} />
            </div>
          </div>

          {/* Save Button (Mobile) */}
          <motion.button 
            className={`mobile-save-button ${saved ? "saved" : ""}`}
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
            <span>{saved ? "Saved" : "Save Property"}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default SinglePage;
