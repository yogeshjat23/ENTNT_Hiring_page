import React, { useRef, useEffect } from 'react';

const JobItemCard = ({ job, index, children }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const mouseX = x - width / 2;
      const mouseY = y - height / 2;

      // Adjust the divisor for more/less tilt effect
      const rotateX = (mouseY / height) * -25;
      const rotateY = (mouseX / width) * 25;

      // Set CSS variables for the glare effect
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Apply the 3D transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to remove event listeners
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    // This div is now the interactive card
    <div
      ref={cardRef}
      className={`job-item ${job.status}`}
      style={{ '--i': index, transformStyle: 'preserve-d' }}
    >
      <div className="job-item-content">
        {children}
      </div>
    </div>
  );
};

export default JobItemCard;