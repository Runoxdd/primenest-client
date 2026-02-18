import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  User, 
  LogOut,
  Home,
  Building2,
  Info,
  Mail,
  LayoutDashboard,
  MessageCircle
} from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      updateUser(null); // This now also clears the token from localStorage
    } catch (err) {
      console.log(err);
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/list", label: "Listings", icon: Building2 },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <motion.div 
            className="logo-icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Building2 size={22} />
          </motion.div>
          <span className="logo-text">
            <span className="logo-prime">Prime</span>
            <span className="logo-nest">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <motion.button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* AI Button */}
          <NavLink to="/assistant" className="ai-btn">
            <motion.span 
              className="ai-btn-content"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={16} />
              <span className="ai-btn-text">AI Agent</span>
            </motion.span>
          </NavLink>

          {/* Auth / User */}
          {currentUser ? (
            <div className="user-section">
              <motion.button
                className="user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={currentUser.avatar || "/noavatar.jpg"} 
                  alt={currentUser.username} 
                />
                <span className="username">{currentUser.username}</span>
                {number > 0 && (
                  <span className="notification-badge">
                    {number > 9 ? "9+" : number}
                  </span>
                )}
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NavLink to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/messages" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <MessageCircle size={16} />
                      <span>Messages</span>
                      {number > 0 && <span className="dropdown-badge">{number}</span>}
                    </NavLink>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="btn-ghost">
                Sign in
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Sign up
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle */}
        <motion.button
  className="menu-toggle"
  onClick={() => setOpen(!open)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.9 }} // Slightly more dramatic tap for feedback
  aria-label="Toggle menu"
>
  {/* Increased size to 28 for better visibility */}
  {open ? <X size={28} /> : <Menu size={28} />}
</motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="mobile-menu-content">
                {/* Header */}
                <div className="mobile-menu-header">
                  <div className="mobile-brand">
                    <Building2 size={24} />
                    <span>PrimeNest</span>
                  </div>
                  <p>Premium Real Estate</p>
                </div>

                {/* Navigation Links */}
                <div className="mobile-nav-links">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={handleClose}
                        className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
                      >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                      </NavLink>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <NavLink
                      to="/assistant"
                      onClick={handleClose}
                      className="mobile-nav-link ai-link"
                    >
                      <Sparkles size={20} />
                      <span>AI Agent</span>
                    </NavLink>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="mobile-menu-footer">
                  {!currentUser ? (
                    <>
                      <NavLink to="/login" className="mobile-btn secondary" onClick={handleClose}>
                        Sign in
                      </NavLink>
                      <NavLink to="/register" className="mobile-btn primary" onClick={handleClose}>
                        Create Account
                      </NavLink>
                    </>
                  ) : (
                    <NavLink to="/profile" className="mobile-profile" onClick={handleClose}>
                      <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
                      <div className="profile-info">
                        <span className="profile-name">{currentUser.username}</span>
                        <span className="profile-label">My Dashboard</span>
                      </div>
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
