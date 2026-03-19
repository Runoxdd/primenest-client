import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Form */}
      <motion.div 
        className="auth-form-section"
        initial={{ opacity: 0, x: -20 }}
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
            <h1>Welcome back</h1>
            <p>Sign in to access your account and continue your property search.</p>
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
                <Mail size={18} className="input-icon" />
                <input
                  id="username"
                  name="username"
                  required
                  minLength={3}
                  maxLength={20}
                  type="text"
                  placeholder="Enter your username"
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
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" name="remember" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Register */}
          <div className="auth-switch">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div 
        className="auth-image-section"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-image-wrapper">
          <img src="/bg.png" alt="PrimeNest Luxury View" />
          <div className="image-overlay" />
          <div className="image-content">
            <h2>Find Your Dream Home</h2>
            <p>Discover premium properties with AI-powered recommendations.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
