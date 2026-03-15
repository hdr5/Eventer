import { useEffect, useState, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authActions";
import { eventCategories } from '../utils/eventCategories';
import "../assets/styles/header.scss";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Header = ({ logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const user = useSelector(state => state.auth.currentUser);

  // Refs to detect outside clicks
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const categoryRef = useRef(null);

useEffect(() => {

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMenuOpen(false)
    }
  }

  const handleClickOutside = (event) => {

    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
    }

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false)
    }

    if (
      categoryRef.current &&
      !categoryRef.current.contains(event.target)
    ) {
      setIsCategoryOpen(false)
    }

  }

  window.addEventListener("resize", handleResize)
  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    window.removeEventListener("resize", handleResize)
    document.removeEventListener("mousedown", handleClickOutside)
  }

}, [])

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Cloudinary Avatar URL עם fallback
  const avatarUrl = user?.avatarUrl || '/uploads/avatar.jpg';

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img src={logo} alt="App Logo" className="logo" />
        </Link>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <div className="dropdown-container" ref={categoryRef}>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setIsCategoryOpen(!isCategoryOpen);
              }}
            >
              Events
            </Link>
            {isCategoryOpen && (
              <div className="dropdown-menu open">
                <Link to={`/events`} onClick={() => setIsCategoryOpen(false)}>All</Link>
                {eventCategories.length > 0 ? (
                  eventCategories.map((category, index) => (
                    <Link key={index} to={`/events?category=${category}`} onClick={() => setIsCategoryOpen(false)}>
                      {category}
                    </Link>
                  ))
                ) : (
                  <p>No categories found</p>
                )}
              </div>
            )}
          </div>
          <Link to="/users">Users</Link>
        </nav>
      </div>

      {/* Hamburger Menu */}
      <button
        ref={hamburgerRef}
        className={`hamburger ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav ref={menuRef} className={`menu ${isMenuOpen ? "show" : ""}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link></li>
          <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
          <li><Link to="/notifications" onClick={() => setIsMenuOpen(false)}>Notifications</Link></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      {/* User Info */}
      {user ? (
        <div className="dashboard-user">
          <i className="fa fa-bell"></i>

          {/* Avatar Dropdown */}
          <div className="avatar-dropdown" ref={dropdownRef}>
            <img
              ref={avatarRef}
              src={avatarUrl} // ← Cloudinary URL או ברירת מחדל
              alt="User Profile"
              className="user-avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)}> <PermIdentityOutlinedIcon className="icon" />Profile</Link>
              <Link to="/settings" onClick={() => setIsDropdownOpen(false)}> <SettingsOutlinedIcon className="icon" />Settings</Link>
              <Link to="/events?filter=favorites" onClick={() => setIsDropdownOpen(false)}> <FavoriteBorderIcon className="icon" />Favorites</Link>
              <Link to="/myEvents" onClick={() => setIsDropdownOpen(false)}> <CalendarMonthOutlinedIcon className="icon" />Your Events</Link>
              <Link to="/notifications" onClick={() => setIsDropdownOpen(false)}> <NotificationsOutlinedIcon className="icon" />Notifications</Link>
              <button onClick={handleLogout}>Logout →</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login">Log In</Link>
          <Link to="/register"><button className="button">Sign Up</button></Link>
        </div>
      )}
    </header>
  );
};

export default Header;
