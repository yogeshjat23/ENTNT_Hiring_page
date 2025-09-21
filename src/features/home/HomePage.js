import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container-final">
      {/* These will be the floating background elements */}
      <div className="shape-blob one"></div>
      <div className="shape-blob two"></div>
      <div className="shape-blob three"></div>

      <div className="hero-content-box">
        <h1 className="hero-title-final">TalentFlow</h1>
        <p className="hero-subtitle-final">
          The modern, streamlined platform for managing your entire hiring pipeline.
        </p>
        <div className="hero-cta-buttons">
          <Link to="/jobs" className="cta-button">
            Manage Jobs
          </Link>
          <Link to="/candidates" className="cta-button secondary">
            View Candidates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;