import React, { useState } from "react";
import "../assets/styles/pages/dashboardStyle.scss";
import UserDashboard from "../components/userDashboard";
import ProducerDashboard from "../components/producerDashboard";
import ImageUploader from "../components/ImageUploader";

const Dashboard = ({ user }) => {

 const [activeTab, setActiveTab] = useState('user');
 
  return (
    <div className="page-wrapper">
{/* <ImageUploader/> */}
      <header className="page-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here is your current status overview.</p>
      </header>
      {/* Tabs Navigation */}
      <nav className="dashboard-nav">
        <button
          className={activeTab === "user" ? "active" : ""}
          onClick={() => setActiveTab("user")}
        >
          Participant
        </button>
        <button
          className={activeTab === "producer" ? "active" : ""}
          onClick={() => setActiveTab("producer")}
        >
          Organizer
        </button>
      </nav>

      {/* Display relevant dashboard */}
      <main className="dashboard-main">
        {activeTab === "user" && <UserDashboard user={user} />}
        {activeTab === "producer" && <ProducerDashboard user={user} />}
      </main>
    </div>
  );
};

export default Dashboard;
