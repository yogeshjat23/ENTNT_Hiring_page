import React from 'react';
import './Loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner-box">
        <div className="cube-face front"></div>
        <div className="cube-face back"></div>
        <div className="cube-face top"></div>
        <div className="cube-face bottom"></div>
        <div className="cube-face left"></div>
        <div className="cube-face right"></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;