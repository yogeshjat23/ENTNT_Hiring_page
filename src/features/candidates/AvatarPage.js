import React from 'react';
import './ProfileAvatar.css';

// Helper function to get initials from a name
const getInitials = (name = '') => {
  const allNames = name.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      // CORRECTED: Use proper string concatenation
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
};

// Helper function to generate a color based on the name
const generateColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // CORRECTED: Use a template literal with backticks ``
  const color = `hsl(${hash % 360}, 75%, 60%)`;
  return color;
};

const ProfileAvatar = ({ name }) => {
  const initials = getInitials(name);
  const backgroundColor = generateColor(name);

  return (
    <div className="profile-avatar" style={{ backgroundColor }}>
      <span>{initials}</span>
    </div>
  );
};

export default ProfileAvatar;