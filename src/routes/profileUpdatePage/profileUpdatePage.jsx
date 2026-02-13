import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate, Link } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Building2,
  Shield
} from "lucide-react";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0]
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-update-page">
      {/* Left Side - Avatar Upload */}
      <motion.div 
        className="avatar-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img 
              src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} 
              alt={currentUser.username} 
              className="avatar-image"
            />
            <div className="avatar-overlay">
              <Camera size={32} />
              <span>Change Photo</span>
            </div>
            <div className="avatar-ring" />
          </div>
          
          <UploadWidget
            uwConfig={{
              cloudName: "dfui2sgjw",
              uploadPreset: "estate",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatars",
            }}
            setState={setAvatar}
          />
          
          <p className="upload-hint">
            <Camera size={14} />
            Click to upload a new avatar
          </p>
        </div>

        {/* Quick Info Card */}
        <div className="quick-info-card">
          <div className="info-item">
            <Shield size={18} />
            <div className="info-content">
              <span className="info-label">Account Status</span>
              <span className="info-value verified">Verified</span>
            </div>
          </div>
          <div className="info-item">
            <User size={18} />
            <div className="info-content">
              <span className="info-label">Member Since</span>
              <span className="info-value">2024</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        className="form-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <Link to="/profile" className="back-link">
              <ArrowLeft size={18} />
              <span>Back to Profile</span>
            </Link>
            <h1>Edit Profile</h1>
            <p>Update your personal information and credentials</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="update-form">
            {/* Error Message */}
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">
                New Password
                <span className="optional-badge">Optional</span>
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <p className="input-hint">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfileUpdatePage;
