import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useNotificationStore } from "../../lib/notificationStore";

// Icons
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
  </svg>
);

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navContainer">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logoIcon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logoText">
            <span className="prime">Prime</span>
            <span className="nest">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navLinks">
          <NavLink to="/" end className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Home
          </NavLink>
          <NavLink to="/list" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Listings
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
            Contact
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="right">
          {/* Theme Toggle */}
          <button className="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* AI Button */}
          <NavLink to="/assistant" className="aiButton">
            <SparkleIcon />
            <span>AI Agent</span>
          </NavLink>

          {/* Auth / User */}
          {currentUser ? (
            <div className="userSection">
              <NavLink to="/profile" className="userButton">
                <img src={currentUser.avatar || "/noavatar.jpg"} alt={currentUser.username} />
                <span className="username">{currentUser.username}</span>
                {number > 0 && (
                  <span className="notificationBadge">
                    {number > 9 ? "9+" : number}
                  </span>
                )}
              </NavLink>
            </div>
          ) : (
            <div className="authButtons">
              <NavLink to="/login" className="loginBtn">Sign in</NavLink>
              <NavLink to="/register" className="registerBtn">Sign up</NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="menuToggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {open && <div className="menuOverlay" onClick={handleClose}></div>}

        {/* Mobile Menu */}
        <div className={`mobileMenu ${open ? "open" : ""}`}>
          <div className="mobileMenuContent">
            <div className="mobileMenuHeader">
              <span className="brandName">PrimeNest</span>
              <p>Premium Real Estate</p>
            </div>

            <div className="mobileNavLinks">
              <NavLink to="/" end onClick={handleClose}>Home</NavLink>
              <NavLink to="/list" onClick={handleClose}>Listings</NavLink>
              <NavLink to="/assistant" className="aiLink" onClick={handleClose}>
                <SparkleIcon /> AI Agent
              </NavLink>
              <NavLink to="/about" onClick={handleClose}>About</NavLink>
              <NavLink to="/contact" onClick={handleClose}>Contact</NavLink>
            </div>

            <div className="mobileMenuFooter">
              {!currentUser ? (
                <>
                  <NavLink to="/login" className="mobileLoginBtn" onClick={handleClose}>Sign in</NavLink>
                  <NavLink to="/register" className="mobileRegisterBtn" onClick={handleClose}>Create Account</NavLink>
                </>
              ) : (
                <NavLink to="/profile" className="mobileProfileBtn" onClick={handleClose}>
                  <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
                  <span>My Dashboard</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
