import React, { useState } from 'react';
import Knob from './Knob';
import './RadioBody.css';

const RadioBody = ({ children, volumeKnob, tunerKnob }) => {
  const [toneValue, setToneValue] = useState(0.5);

  return (
    <div className="radio-braun-wrapper">
      <div className="radio-braun-body">
        {/* Scale Display Overlay */}
        {children}

        {/* Knob Overlays on the bottom panel */}
        <div className="knob-slot volume-slot">
          {volumeKnob}
          <span className="knob-text-label volume-label">volume</span>
        </div>

        <div className="knob-slot tone-slot">
          <Knob 
            value={toneValue}
            onChange={(val) => setToneValue(val)}
            size={86}
          />
          <span className="knob-text-label tone-label">tone</span>
        </div>

        <div className="knob-slot tuner-slot">
          {tunerKnob}
          <span className="knob-text-label tuner-label">tuner</span>
        </div>

        {/* 
          Gray overlay block to hide the AM/FM/SW knobs/buttons at the bottom right.
          This hides the orange and black push buttons from the photo.
        */}
        <div className="buttons-hide-overlay"></div>
      </div>
    </div>
  );
};

export default RadioBody;
