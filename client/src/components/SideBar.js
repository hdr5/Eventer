import { useState } from "react";
import "../assets/styles/sideBar.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="logo">Eventer</div>
        <div className="profile">
          <div className="avatar-background"></div> {/* Glow Effect */}
          {/* <img src={avatar} alt="User" /> */}
          <p>Esther Howard</p>
          <span>PRO</span>
        </div>
        <nav>
          <ul>
            <li>Events</li>
            <li>Yields</li>
            <li>DEXes</li>
            <li>Analytics</li>
            <li>Settings</li>
          </ul>
        </nav>
        <button className="logout">Log out</button>
      </div>
  );
};

export default Sidebar;
