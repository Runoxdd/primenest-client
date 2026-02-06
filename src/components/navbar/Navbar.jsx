import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, NavLink } from "react-router-dom"; // Added NavLink
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  const handleClose = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div className="left">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="PrimeNest Logo" />
            <span className="prime">Prime<span>Nest</span></span>
          </Link>
          <div className="navLinks">
            <NavLink to="/" end className="navlinksmini">Home</NavLink>
            <NavLink to="/assistant" className="aiAgentLink"> AI Agent</NavLink>
            <NavLink to="/about" className="navlinksmini">About</NavLink>
            <NavLink to="/contact" className="navlinksmini">Contact</NavLink>
          </div>
        </div>

        <div className="right">
          {currentUser ? (
            <div className="user">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" className="userAvatar" />
              <span className="username">{currentUser.username}</span>
              
              <NavLink to="/profile" className="profileBtn">
                <span>Dashboard</span>
                {number > 0 && (
                  <div className="notificationBadge">
                    {number > 9 ? "9+" : number}
                  </div>
                )}
              </NavLink>
            </div>
          ) : (
            <div className="authButtons">
              <NavLink to="/login" className="loginBtn">Sign in</NavLink>
              <NavLink to="/register" className="registerBtn">Sign up</NavLink>
            </div>
          )}
          
          <div className="menuIcon" onClick={() => setOpen((prev) => !prev)}>
            <img
              src={open ? "/close.png" : "/menu.png"}
              alt="Toggle Menu"
            />
          </div>
        </div>
        
        {open && <div className="menuOverlay" onClick={handleClose}></div>}

        <div className={open ? "menu active" : "menu"}>
            <div className="menuHeader">
               <span className="prime">Prime<span>Nest</span></span>
               <p>Premium Real Estate</p>
            </div>

            <div className="menuLinks">
                <NavLink to="/" end onClick={handleClose}>Home</NavLink>
                <NavLink to="/assistant" className="mobileAiLink" onClick={handleClose}>AI Agent</NavLink>
                <NavLink to="/about" onClick={handleClose}>About</NavLink>
                <NavLink to="/contact" onClick={handleClose}>Contact</NavLink>
                
                <div className="separator"></div>

                {!currentUser ? (
                  <>
                    <NavLink to="/login" className="signin" onClick={handleClose}>Sign in</NavLink>
                    <NavLink to="/register" className="signupBtn" onClick={handleClose}>Create Account</NavLink>
                  </>
                ) : (
                    <NavLink to="/profile" className="dashboardLink" onClick={handleClose}>My Dashboard</NavLink>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;