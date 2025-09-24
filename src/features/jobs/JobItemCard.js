import React, { useRef, useEffect } from 'react';

const JobItemCard = ({ job, index, children, isDragging }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    
    if (isDragging) {
      card.style.transform = '';
      return; 
    }

    
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

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]); 

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