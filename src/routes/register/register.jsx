import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { motion } from "framer-motion";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from "lucide-react";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      await apiRequest.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different handle.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Image */}
      <motion.div 
        className="auth-image-section"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-image-wrapper">
          <img src="/bg.png" alt="Luxury Real Estate" />
          <div className="image-overlay" />
          <div className="image-content">
            <h2>Start Your Journey</h2>
            <p>Join thousands finding their perfect property with PrimeNest.</p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        className="auth-form-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-form-container">
          {/* Logo */}
          <Link to="/" className="auth-logo">
            <div className="logo-icon">
              <Building2 size={24} />
            </div>
            <span className="logo-text">
              <span className="prime">Prime</span>
              <span className="nest">Nest</span>
            </span>
          </Link>

          {/* Form Header */}
          <div className="auth-header">
            <h1>Create account</h1>
            <p>Join PrimeNest and start your property search journey today.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {error && (
              <motion.div
                className="auth-error"
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
                  placeholder="Choose a username"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <div className="auth-switch">
            <p>
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
