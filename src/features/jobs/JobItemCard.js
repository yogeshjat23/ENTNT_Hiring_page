import React, { useRef, useEffect } from 'react';

// Accept the new isDragging prop
const JobItemCard = ({ job, index, children, isDragging }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Reset transform style if dragging starts, letting the library take over.
    if (isDragging) {
      card.style.transform = '';
      return; // Exit the effect early
    }

    // This part now only runs when the card is NOT being dragged
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const mouseX = x - width / 2;
      const mouseY = y - height / 2;

      const rotateX = (mouseY / height) * -25;
      const rotateY = (mouseX / width) * 25;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    // Add event listeners only when not dragging
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to remove listeners
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]); // Re-run this effect whenever the isDragging state changes

  return (
    <div
      ref={cardRef}
      className={`job-item ${job.status}`}
      style={{ '--i': index, transformStyle: 'preserve-3d' }}
    >
      <div className="job-item-content">
        {children}
      </div>
    </div>
  );
};