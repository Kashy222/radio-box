import React, { useState, useEffect, useRef } from 'react';
import './Knob.css';

const Knob = ({ 
  size = 84, 
  value = 0, // 0 to 1
  onChange, 
  minAngle = -150, 
  maxAngle = 150,
  hasIndicator = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef(null);

  const calculateValueFromAngle = (angle) => {
    const clampedAngle = Math.max(minAngle, Math.min(maxAngle, angle));
    return (clampedAngle - minAngle) / (maxAngle - minAngle);
  };

  const calculateAngleFromValue = (val) => {
    return minAngle + val * (maxAngle - minAngle);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle > 180) angle -= 360;

      // Prevent jumping from max to min
      const currentAngle = calculateAngleFromValue(value);
      if (angle < -120 && currentAngle > 100) {
        angle = maxAngle;
      } else if (angle > 120 && currentAngle < -100) {
        angle = minAngle;
      }

      const newValue = calculateValueFromAngle(angle);
      if (onChange) onChange(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, maxAngle, minAngle, onChange, value]);

  const currentAngle = calculateAngleFromValue(value);

  return (
    <div 
      className="braun-knob"
      ref={knobRef}
      style={{ 
        width: size, 
        height: size,
        transform: `rotate(${currentAngle}deg)`
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Visual top indicator line (only for volume) */}
      {hasIndicator && <div className="knob-pointer-line"></div>}
      
      {/* Specular highlights on the metallic surface */}
      <div className="knob-shading"></div>
    </div>
  );
};

export default Knob;
