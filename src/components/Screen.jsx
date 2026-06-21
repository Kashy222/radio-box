import React from 'react';
import './Screen.css';

const Screen = ({ stationName, frequency, isTuned }) => {
  const minFreq = 88.0;
  const maxFreq = 108.0;
  
  // Horizontal sweep of the green needle across the FM scale
  const percent = ((frequency - minFreq) / (maxFreq - minFreq)) * 100;

  return (
    <div className="braun-scale-overlay">
      {/* Centered watermark station name */}
      <div className={`scale-station-watermark ${isTuned ? 'active' : ''}`}>
        {isTuned ? stationName : "TUNING STATIC..."}
      </div>

      {/* Vertical Green Needle */}
      <div className="tuner-needle-line" style={{ left: `${percent}%` }}></div>
    </div>
  );
};

export default Screen;
