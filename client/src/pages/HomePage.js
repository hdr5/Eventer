import { useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../assets/styles/pages/homepageStyle.scss";

import img1 from "../assets/show.png";
import img2 from "../assets/wedding.png";
import img3 from "../assets/zoom.png";

const Homepage = ({ user }) => {

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (user) return <Dashboard user={user} />;

  return (
    <div className="homepage">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Where Events Become <span>Experiences</span>
          </h1>

          <p>
            Discover, create and manage unforgettable events
            with a powerful and elegant platform.
          </p>

          <div className="cta">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>
            <Link to="/login" className="ghost-btn">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE 1 */}
      <section className="feature reveal">
        <div className="feature-text">
          <h2>Discover Amazing Events</h2>
          <p>
            Explore concerts, conferences, meetups and more
            with a seamless browsing experience.
          </p>
        </div>
        <div className="feature-image">
          <img src={img1} alt="event" />
        </div>
      </section>

      {/* FEATURE 2 */}
      <section className="feature reveal reverse">
        <div className="feature-text">
          <h2>Create & Manage Easily</h2>
          <p>
            Build your own events, track participants,
            and control everything from one dashboard.
          </p>
        </div>
        <div className="feature-image">
          <img src={img2} alt="event" />
        </div>
      </section>

      {/* FEATURE 3 */}
      <section className="feature reveal">
        <div className="feature-text">
          <h2>Real-Time Interaction</h2>
          <p>
            Stay connected with live updates, smart tools,
            and smooth communication.
          </p>
        </div>
        <div className="feature-image">
          <img src={img3} alt="event" />
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bottom-cta">
        <h2>Ready to Build Your Next Event?</h2>
        <Link to="/register" className="primary-btn large">
          Create Your Event
        </Link>
      </section>

    </div>
  );
};

export default Homepage;