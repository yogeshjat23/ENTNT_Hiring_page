import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilePlus, FiClipboard, FiUsers, FiAward, FiUser } from 'react-icons/fi';
import Lottie from 'lottie-react';
import runningManAnimation from '../../assets/running-man.json'; 
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container-4d">
      <div className="animation-scene">
          <div className="running-man-path">
          <Lottie animationData={runningManAnimation} className="running-man-lottie" />
        </div>
        <div className="stage-zone apply-zone">
          <FiFilePlus size={30} />
          <span>Apply</span>
        </div>
        <div className="stage-zone assess-zone">
          <FiUsers size={30} />
        
          <span>Interview</span>
        </div>
        <div className="stage-zone interview-zone">
           <FiAward size={30} /> 
          <span> Hired </span>
        </div>
        <div className="stage-zone hired-zone">
         
            <FiClipboard size={30} />
          <span>Assessment</span>
        </div>
      </div>

      <div className="hero-content-box">
        <h1 className="hero-title-final">TalentFlow</h1>
        <p className="hero-subtitle-final">
          Visualize your entire hiring journey, from start to finish.
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
