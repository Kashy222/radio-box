import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

const MIN_FREQ = 87.5;
const MAX_FREQ = 108.0;

const DEFAULT_STATIONS = [
  { freq: 91.1, name: 'Radio City', url_resolved: 'https://drive.uber.radio/uber/bollywood2000s/icecast.audio', stationuuid: 'ind-rc-911' },
  { freq: 91.9, name: 'Radio One', url_resolved: 'https://strmreg.1.fm/bombaybeats_mobile_mp3', stationuuid: 'ind-ro-919' },
  { freq: 92.7, name: 'BIG FM', url_resolved: 'https://strm112.1.fm/bombaybeats_mobile_mp3', stationuuid: 'ind-big-927' },
  { freq: 93.5, name: 'Red FM', url_resolved: 'https://funasia.streamguys1.com/live9', stationuuid: 'ind-red-935' },
  { freq: 94.3, name: 'Radio One Hits', url_resolved: 'https://strm112.1.fm/top40_mobile_mp3', stationuuid: 'ind-ro-943' },
  { freq: 95.0, name: 'Radio City Hits', url_resolved: 'https://server.mixify.in/listen/new_hits/radio.mp3', stationuuid: 'ind-rc-950' },
  { freq: 98.3, name: 'Radio Mirchi', url_resolved: 'https://eu8.fastcast4u.com/proxy/clyedupq/stream', stationuuid: 'ind-rm-983' },
  { freq: 100.1, name: 'AIR FM Gold', url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio', stationuuid: 'ind-gold-1001' },
  { freq: 101.4, name: 'AIR Akashvani', url_resolved: 'https://nl4.mystreaming.net/uber/bollywoodlove/icecast.audio', stationuuid: 'ind-air-1014' },
  { freq: 102.8, name: 'Vividh Bharati', url_resolved: 'https://a9oldhits-a9media.radioca.st/stream', stationuuid: 'ind-vb-1028' },
  { freq: 104.0, name: 'Fever FM', url_resolved: 'https://server.mixify.in/listen/old_hits/radio.mp3', stationuuid: 'ind-fever-1040' },
  { freq: 104.2, name: 'MY FM', url_resolved: 'https://nl4.mystreaming.net/uber/bollywoodlove/icecast.audio', stationuuid: 'ind-my-1042' },
  { freq: 104.8, name: 'Ishq FM', url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio', stationuuid: 'ind-ishq-1048' },
  { freq: 107.1, name: 'AIR FM Rainbow', url_resolved: 'https://drive.uber.radio/uber/bollywood2000s/icecast.audio', stationuuid: 'ind-rainbow-1071' }
];

const MUMBAI_STATIONS = [
  { freq: 91.1, name: 'Radio City Mumbai', url_resolved: 'https://drive.uber.radio/uber/bollywood2000s/icecast.audio', stationuuid: 'mum-rc-911' },
  { freq: 92.7, name: 'BIG FM Mumbai', url_resolved: 'https://strm112.1.fm/bombaybeats_mobile_mp3', stationuuid: 'mum-big-927' },
  { freq: 93.5, name: 'Red FM Mumbai', url_resolved: 'https://funasia.streamguys1.com/live9', stationuuid: 'mum-red-935' },
  { freq: 94.3, name: 'Radio One Mumbai', url_resolved: 'https://strm112.1.fm/top40_mobile_mp3', stationuuid: 'mum-ro-943' },
  { freq: 98.3, name: 'Radio Mirchi Mumbai', url_resolved: 'https://eu8.fastcast4u.com/proxy/clyedupq/stream', stationuuid: 'mum-rm-983' },
  { freq: 100.1, name: 'AIR FM Gold', url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio', stationuuid: 'mum-gold-1001' },
  { freq: 102.8, name: 'Vividh Bharati', url_resolved: 'https://a9oldhits-a9media.radioca.st/stream', stationuuid: 'mum-vb-1028' },
  { freq: 104.0, name: 'Fever FM Mumbai', url_resolved: 'https://server.mixify.in/listen/old_hits/radio.mp3', stationuuid: 'mum-fever-1040' },
  { freq: 104.8, name: 'Ishq FM Mumbai', url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio', stationuuid: 'mum-ishq-1048' },
  { freq: 107.1, name: 'AIR FM Rainbow', url_resolved: 'https://nl4.mystreaming.net/uber/bollywoodlove/icecast.audio', stationuuid: 'mum-rainbow-1071' }
];

const NASHIK_STATIONS = [
  { freq: 90.4, name: 'Radio Vishwas', url_resolved: 'https://puma.streemlion.com:4130/stream', stationuuid: 'nsk-rv-904' },
  { freq: 98.3, name: 'Radio Mirchi Nashik', url_resolved: 'https://eu8.fastcast4u.com/proxy/clyedupq/stream', stationuuid: 'nsk-rm-983' },
  { freq: 104.2, name: 'SMY FM Nashik', url_resolved: 'https://nl4.mystreaming.net/uber/bollywoodlove/icecast.audio', stationuuid: 'nsk-my-1042' }
];

const VolumeWedge = () => {
  const segments = [];
  const numSegments = 6;
  const startAngle = -90;
  const endAngle = 90;
  const totalAngle = endAngle - startAngle;
  const gap = 12; // degrees gap between segments
  const segmentAngle = (totalAngle - gap * (numSegments - 1)) / numSegments;
  
  for (let i = 0; i < numSegments; i++) {
    const sAngle = startAngle + i * (segmentAngle + gap);
    const eAngle = sAngle + segmentAngle;
    
    // thickness grows linearly
    const thickness = 2 + (12 * (i / (numSegments - 1)));
    const innerRadius = 65; 
    const outerRadius = innerRadius + thickness;
    
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    
    const describeArc = (x, y, innerR, outerR, startA, endA) => {
      const startOuter = polarToCartesian(x, y, outerR, startA);
      const endOuter = polarToCartesian(x, y, outerR, endA);
      const startInner = polarToCartesian(x, y, innerR, startA);
      const endInner = polarToCartesian(x, y, innerR, endA);
      
      const largeArcFlag = endA - startA <= 180 ? "0" : "1";
      
      return [
        "M", startOuter.x, startOuter.y,
        "A", outerR, outerR, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerR, innerR, 0, largeArcFlag, 0, startInner.x, startInner.y,
        "Z"
      ].join(" ");
    };
    
    segments.push(
      <path 
        key={i}
        d={describeArc(80, 80, innerRadius, outerRadius, sAngle, eAngle)}
        fill="#55585d"
      />
    );
  }
  
  return (
    <svg className="volume-wedge" width="160" height="160" style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
      {segments}
    </svg>
  );
};

function App() {
  const [currentCity, setCurrentCity] = useState('Detecting Location...');
  const [stations, setStations] = useState(DEFAULT_STATIONS);
  const [currentStation, setCurrentStation] = useState(DEFAULT_STATIONS[3]); // Red FM 93.5 as default
  
  const [frequency, setFrequency] = useState(93.5); // Start at 93.5 FM
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); // Track if audio is currently buffering
  const [isMono, setIsMono] = useState(false);
  const [isPowerOn, setIsPowerOn] = useState(false); // Power state defaults to off
  const [savedStations, setSavedStations] = useState(() => {
    try {
      const saved = localStorage.getItem('radioPresets');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure it's exactly 9 slots
        const filled = Array(9).fill(null);
        parsed.forEach((s, i) => { if (i < 9) filled[i] = s; });
        return filled;
      }
    } catch (e) {
      console.error('Failed to load presets', e);
    }
    return Array(9).fill(null);
  });

  useEffect(() => {
    try {
      localStorage.setItem('radioPresets', JSON.stringify(savedStations));
    } catch (e) {
      console.error('Failed to save presets', e);
    }
  }, [savedStations]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const audioRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      let _savedStations = [...savedStations];
      // Swap the contents of the two fixed slots
      const temp = _savedStations[dragItem.current];
      _savedStations[dragItem.current] = _savedStations[dragOverItem.current];
      _savedStations[dragOverItem.current] = temp;
      setSavedStations(_savedStations);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Geolocation logic
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown";
          
          if (city.toLowerCase().includes('mumbai') || city.toLowerCase().includes('bombay')) {
            setCurrentCity('Mumbai');
            setStations(MUMBAI_STATIONS);
          } else if (city.toLowerCase().includes('nashik') || city.toLowerCase().includes('nasik')) {
            setCurrentCity('Nashik');
            setStations(NASHIK_STATIONS);
          } else {
            setCurrentCity(city);
            setStations(DEFAULT_STATIONS);
          }
        } catch (err) {
          console.error("Geolocation fetch failed:", err);
          setCurrentCity('National');
        }
      }, (error) => {
        console.warn("Geolocation denied or error:", error);
        setCurrentCity('National');
      });
    } else {
      setCurrentCity('National');
    }
  }, []);
  
  // Web Audio Context
  const audioCtxRef = useRef(null);
  
  // Active volume controller
  const globalGainRef = useRef(null);
  
  // Nodes for Static Noise (Stereo)
  const staticGainRef = useRef(null);
  const staticSourceRef = useRef(null);
  const streamSourceRef = useRef(null);
  
  // Audio routing gains for custom stereo/mono matrix
  const routingGainsRef = useRef({
    leftToLeft: null,
    rightToRight: null,
    leftToRight: null,
    rightToLeft: null
  });

  // Track dragging for volume and horizontal slider handle
  const volumeTrackRef = useRef(null);
  const sliderTrackRef = useRef(null);
  const isDraggingVolume = useRef(false);
  const isDraggingSlider = useRef(false);
  const lastDragAngle = useRef(null);
  const accumulatedKnobAngle = useRef(0);
  const lastVolumeAngle = useRef(null);
  const accumulatedVolumeAngle = useRef(0);

  // Initialize Audio Element with CORS support
  if (!audioRef.current) {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.addEventListener('loadstart', () => setIsBuffering(true));
    audio.addEventListener('waiting', () => setIsBuffering(true));
    audio.addEventListener('playing', () => setIsBuffering(false));
    audio.addEventListener('canplay', () => setIsBuffering(false));
    audioRef.current = audio;
  }

  // Initialize Web Audio Context and custom stereo/mono matrix routing
  const initAudioContext = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Create a master volume controller
      const masterGain = ctx.createGain();
      masterGain.gain.value = 1.0;
      masterGain.connect(ctx.destination);
      globalGainRef.current = masterGain;

      // Setup custom Stereo/Mono routing matrix
      const splitter = ctx.createChannelSplitter(2);
      const merger = ctx.createChannelMerger(2);

      const routing = {
        leftToLeft: ctx.createGain(),
        rightToRight: ctx.createGain(),
        leftToRight: ctx.createGain(),
        rightToLeft: ctx.createGain()
      };

      // Set initial volumes
      routing.leftToLeft.gain.value = isMono ? 0.5 : 1.0;
      routing.rightToRight.gain.value = isMono ? 0.5 : 1.0;
      routing.leftToRight.gain.value = isMono ? 0.5 : 0.0;
      routing.rightToLeft.gain.value = isMono ? 0.5 : 0.0;

      // Connect splitter channels to gain matrix
      splitter.connect(routing.leftToLeft, 0);  // Left output
      splitter.connect(routing.leftToRight, 0); // Left output
      splitter.connect(routing.rightToLeft, 1); // Right output
      splitter.connect(routing.rightToRight, 1); // Right output

      // Connect gain matrix back into merger inputs
      routing.leftToLeft.connect(merger, 0, 0);  // Left input
      routing.rightToLeft.connect(merger, 0, 0); // Left input
      routing.leftToRight.connect(merger, 0, 1); // Right input
      routing.rightToRight.connect(merger, 0, 1); // Right input

      merger.connect(masterGain);
      routingGainsRef.current = routing;

      // Setup Stereo Static Noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const leftChannel = noiseBuffer.getChannelData(0);
      const rightChannel = noiseBuffer.getChannelData(1);
      
      for (let i = 0; i < bufferSize; i++) {
        leftChannel[i] = Math.random() * 2 - 1;
        rightChannel[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 1.5;

      const staticGain = ctx.createGain();
      staticGain.gain.value = 0; // Start silent

      whiteNoise.connect(filter);
      filter.connect(staticGain);
      staticGain.connect(splitter);

      whiteNoise.start();

      staticGainRef.current = staticGain;
      staticSourceRef.current = whiteNoise;

      // Route the HTML5 audio stream through our Stereo/Mono splitter node
      try {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(splitter);
        streamSourceRef.current = source;
      } catch (err) {
        console.warn("Could not route audio stream via Web Audio (CORS restriction). Fallback to direct stereo output.", err);
      }
    } catch (e) {
      console.error("Web Audio API not supported or failed to init:", e);
    }
  };

  // Toggle Mono/Stereo mode
  const toggleMono = (monoState) => {
    if (!isPowerOn) return;
    initAudioContext();
    setIsMono(monoState);

    const routing = routingGainsRef.current;
    if (routing.leftToLeft) {
      const now = audioCtxRef.current.currentTime;
      routing.leftToLeft.gain.setValueAtTime(monoState ? 0.5 : 1.0, now);
      routing.rightToRight.gain.setValueAtTime(monoState ? 0.5 : 1.0, now);
      routing.leftToRight.gain.setValueAtTime(monoState ? 0.5 : 0.0, now);
      routing.rightToLeft.gain.setValueAtTime(monoState ? 0.5 : 0.0, now);
    }
  };

  // Play a realistic mechanical click sound using the provided mp3
  const playClickSound = () => {
    try {
      const audio = new Audio('/button-press.mp3');
      audio.volume = 0.4; // Toned down to feel more realistic and less jarring
      audio.play().catch(e => console.warn("Audio play failed:", e));
    } catch (e) {
      console.warn("Click sound playback failed:", e);
    }
  };

  // Power switch toggle
  const togglePower = () => {
    playClickSound();
    const nextPowerState = !isPowerOn;
    setIsPowerOn(nextPowerState);
    
    if (nextPowerState) {
      // User interacted, we can initialize audio and play
      initAudioContext();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      
      const audio = audioRef.current;
      if (currentStation && currentStation.url_resolved) {
        setIsBuffering(true);
        audio.src = currentStation.url_resolved;
        if (stationVolume > 0) {
          audio.play().catch(e => console.log("Stream play failed:", e));
        }
      }
    } else {
      setIsPlaying(false);
      const audio = audioRef.current;
      if (audio) audio.pause();
      if (staticGainRef.current) {
        staticGainRef.current.gain.value = 0;
      }
    }
  };

  // Distribute stations across the FM band
  const stationFrequencies = useMemo(() => {
    return stations;
  }, [stations]);

  // Find closest station and calculate volumes
  const { closestStation, stationVolume, staticVolume } = useMemo(() => {
    if (stationFrequencies.length === 0) {
      return { closestStation: null, stationVolume: 0, staticVolume: 1.0 };
    }

    let closest = stationFrequencies[0];
    let minDiff = Math.abs(frequency - closest.freq);
    
    for (let i = 1; i < stationFrequencies.length; i++) {
      const diff = Math.abs(frequency - stationFrequencies[i].freq);
      if (diff < minDiff) {
        minDiff = diff;
        closest = stationFrequencies[i];
      }
    }

    const dist = Math.abs(frequency - closest.freq);
    let sVol = 0;
    let nVol = 1.0;

    if (dist < 0.08) {
      sVol = 1.0;
      nVol = 0.05;
    } else if (dist < 0.4) {
      const factor = (dist - 0.08) / (0.4 - 0.08);
      sVol = 1.0 - factor;
      nVol = 0.05 + 0.95 * factor;
    } else {
      sVol = 0.0;
      nVol = 1.0;
    }

    return { closestStation: closest, stationVolume: sVol, staticVolume: nVol };
  }, [frequency, stationFrequencies]);

  // Update current station state when closest station shifts
  useEffect(() => {
    if (closestStation) {
      if (!currentStation || closestStation.stationuuid !== currentStation.stationuuid) {
        setCurrentStation(closestStation);
      }
    }
  }, [closestStation, currentStation]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (!isPowerOn) return;
    initAudioContext();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);

    const audio = audioRef.current;
    if (newPlayingState) {
      if (currentStation && currentStation.url_resolved) {
        setIsBuffering(true);
        audio.src = currentStation.url_resolved;
        if (stationVolume > 0) {
          audio.play().catch(e => console.log("Stream play failed:", e));
        }
      }
    } else {
      audio.pause();
    }
  };

  // Adjust audio stream volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isPlaying && isPowerOn ? stationVolume * volume : 0;
  }, [stationVolume, volume, isPlaying, isPowerOn]);

  // Control static noise volume
  useEffect(() => {
    if (staticGainRef.current) {
      staticGainRef.current.gain.value = isPlaying && isPowerOn ? staticVolume * volume * 0.4 : 0;
    }
  }, [staticVolume, volume, isPlaying, isPowerOn]);

  // Update source when current station shifts
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && currentStation && currentStation.url_resolved && isPowerOn) {
      setIsBuffering(true);
      audio.src = currentStation.url_resolved;
      if (stationVolume > 0) {
        audio.play().catch(e => console.log("Stream play transition failed:", e));
      }
    }
  }, [currentStation, isPlaying, isPowerOn]);

  // Sync play state depending on tuning volume
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && isPowerOn) {
      if (stationVolume > 0 && audio.paused && currentStation) {
        audio.play().catch(e => console.log("Resume stream:", e));
      } else if (stationVolume === 0 && !audio.paused) {
        audio.pause();
      }
    }
  }, [stationVolume, currentStation, isPlaying, isPowerOn]);

  // Bottom Skip Prev and Next (Skips directly to previous/next saved/known station)
  const handlePrevStation = () => {
    if (!isPowerOn || stationFrequencies.length === 0) return;
    const currentIndex = stationFrequencies.findIndex(s => s.stationuuid === currentStation?.stationuuid);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = stationFrequencies.length - 1;
    const prevStation = stationFrequencies[prevIndex];
    setFrequency(prevStation.freq);
    setCurrentStation(prevStation);
    initAudioContext();
  };

  const handleNextStation = () => {
    if (!isPowerOn || stationFrequencies.length === 0) return;
    const currentIndex = stationFrequencies.findIndex(s => s.stationuuid === currentStation?.stationuuid);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= stationFrequencies.length) nextIndex = 0;
    const nextStation = stationFrequencies[nextIndex];
    setFrequency(nextStation.freq);
    setCurrentStation(nextStation);
    initAudioContext();
  };



  // Drag handlers for Rotary Volume Knob
  const handleVolumePointerDown = (e) => {
    if (!volumeTrackRef.current) return;
    isDraggingVolume.current = true;
    
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    let angle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    lastVolumeAngle.current = angle;
    accumulatedVolumeAngle.current = -90 + (volume * 180);
    
    e.preventDefault();
  };

  const updateVolume = (e) => {
    if (!volumeTrackRef.current || lastVolumeAngle.current === null) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    
    let angle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    let delta = angle - lastVolumeAngle.current;
    
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    lastVolumeAngle.current = angle;
    
    let newAngle = accumulatedVolumeAngle.current + delta;
    newAngle = Math.max(-90, Math.min(90, newAngle));
    accumulatedVolumeAngle.current = newAngle;
    
    const percent = (newAngle + 90) / 180;
    setVolume(percent);
    initAudioContext();
  };

  // Drag handlers for the main horizontal tuning slider
  const handleSliderPointerDown = (e) => {
    if (!sliderTrackRef.current) return;
    isDraggingSlider.current = true;
    
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    let angle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    lastDragAngle.current = angle;
    accumulatedKnobAngle.current = -135 + ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 270;
    
    e.preventDefault();
  };

  const updateKnobTuning = (e) => {
    if (!sliderTrackRef.current || lastDragAngle.current === null) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    
    let angle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    let delta = angle - lastDragAngle.current;
    
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    lastDragAngle.current = angle;
    
    let newAngle = accumulatedKnobAngle.current + delta;
    newAngle = Math.max(-135, Math.min(135, newAngle));
    accumulatedKnobAngle.current = newAngle;
    
    const percent = (newAngle + 135) / 270;
    const newFreq = MIN_FREQ + (percent * (MAX_FREQ - MIN_FREQ));
    const snapped = Math.round(newFreq * 10) / 10;
    setFrequency(snapped);
    initAudioContext();
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDraggingVolume.current) {
        updateVolume(e);
      }
      if (isDraggingSlider.current) {
        updateKnobTuning(e);
      }
    };

    const handlePointerUp = () => {
      isDraggingVolume.current = false;
      isDraggingSlider.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [frequency, isPowerOn]);

  // Compute position of the slider handle pointer
  const sliderPercent = ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;

  // Station saving actions
  const handleAddStation = () => {
    if (!isPowerOn) return;
    const isAlreadySaved = savedStations.some(s => s && Math.abs(s.freq - frequency) < 0.05);
    if (!isAlreadySaved) {
      const firstEmptyIndex = savedStations.findIndex(s => s === null);
      if (firstEmptyIndex !== -1) {
        const stationName = currentStation && Math.abs(currentStation.freq - frequency) < 0.15
          ? currentStation.name
          : `Preset ${frequency.toFixed(2)}`;
        const newStations = [...savedStations];
        newStations[firstEmptyIndex] = { freq: frequency, name: stationName };
        setSavedStations(newStations);
      } else {
        alert("All 9 preset slots are full! Please delete one first.");
      }
    }
  };

  const handleDeleteSaved = (indexToDelete, e) => {
    e.stopPropagation();
    const newStations = [...savedStations];
    newStations[indexToDelete] = null;
    setSavedStations(newStations);
  };

  const handleSelectSaved = (freq) => {
    setFrequency(freq);
    setIsMenuOpen(false);
    initAudioContext();
  };

  const scaleTicks = useMemo(() => {
    const ticks = [];
    const stepCount = Math.round((108.0 - 88.0) / 0.5);
    for (let i = 0; i <= stepCount; i++) {
      const val = 88.0 + i * 0.5;
      const isLabel = val === 90 || val === 95 || val === 100 || val === 105;
      ticks.push({ val, isLabel });
    }
    return ticks;
  }, []);

  // Determine active station name to display inside LCD Screen
  const activeDisplayName = useMemo(() => {
    const saved = savedStations.find(s => Math.abs(s.freq - frequency) < 0.05);
    if (saved) return saved.name;
    
    if (currentStation && Math.abs(currentStation.freq - frequency) < 0.15) {
      return currentStation.name;
    }
    
    return "------";
  }, [frequency, currentStation, savedStations]);

  // Find saved index (preset number)
  const savedIndex = useMemo(() => {
    return savedStations.findIndex(s => Math.abs(s.freq - frequency) < 0.05);
  }, [frequency, savedStations]);

  return (
    <div className="modern-retro-player-wrapper">
      <div className="player-body">
        
        <div className="player-upper-block">
          {/* HEADER BAR: Philips Logo & Brushed Power Button */}
          <div className="radio-header-bar">
            <div className="philips-logo-wrapper">
              <img src="/philips_logo.svg" alt="Philips Logo" className="philips-wordmark-logo" />
            </div>

            {/* On-Off Pill Power Switch Button with brushed metal style */}
            <div className="header-power-btn-pocket">
              <button 
                className={`header-power-btn-pill ${isPowerOn ? 'active' : ''}`}
                onClick={togglePower}
                aria-label="Power Button"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isPowerOn ? "#ffffff" : "#808287"} strokeWidth="3" strokeLinecap="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
                </svg>
              </button>
            </div>
          </div>

          {/* SECTION 1: Orange Display Screen */}
          <div className={`orange-display-screen ${isPowerOn ? 'on' : 'off'}`}>
            <div className="screen-reflection"></div>
            
            <div className="screen-inner-layout">
              <div className="lcd-city-badge">{currentCity}</div>
              {volume === 0 && (
                <div className="lcd-mute-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                  <span>MUTE</span>
                </div>
              )}
              
              {/* Info Group Wrapper */}
              <div className="lcd-info-group">
                {/* Frequency Readout Area */}
                <div className="lcd-frequency-row">
                  {/* Main digits in dot-matrix font */}
                  <div className="lcd-digits-container">
                    <span className="lcd-freq-numbers">{frequency.toFixed(2)}</span>
                    <span className="lcd-unit">MHz</span>
                  </div>
                </div>

                {/* Station Title */}
                <div className="lcd-station-title-box">
                  <div className="lcd-station-title">
                    {activeDisplayName !== "------" && isBuffering && isPlaying ? (
                      <div className="calibrating-container">
                        <div className="sliding-squares-loader left">
                          <div className="square"></div>
                          <div className="square"></div>
                          <div className="square"></div>
                        </div>
                        <span>TUNING</span>
                        <div className="sliding-squares-loader right">
                          <div className="square"></div>
                          <div className="square"></div>
                          <div className="square"></div>
                        </div>
                      </div>
                    ) : (
                      activeDisplayName
                    )}
                  </div>
                  {savedIndex !== -1 && (
                    <div className="lcd-preset-badge">
                      P-{String(savedIndex + 1).padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Tuner marking space inside the screen */}
              <div className="lcd-tuner-container">
                <div className="ruler-ticks-viewport">
                  {scaleTicks.map((tick, index) => (
                    <div key={index} className={`ruler-tick-item ${tick.isLabel ? 'labeled' : ''}`}>
                      {tick.isLabel && (
                        <span className="ruler-tick-num-lbl">
                          {tick.val}
                        </span>
                      )}
                      <div className="ruler-tick-line-mark" />
                    </div>
                  ))}
                  {/* Sliding tuner indicator needle */}
                  <div className="lcd-tuner-pointer" style={{ left: `${sliderPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Internal Saved Stations list screen overlay */}
            <div className={`saved-stations-overlay-screen ${isMenuOpen ? 'open' : 'closed'}`}>
              <div className="overlay-header">
                <span>Saved Stations</span>
                <button className="overlay-close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
              </div>
              <div className="overlay-list-scroll">
                {savedStations.map((station, index) => (
                  <div 
                    key={index} 
                    className={`saved-station-item-row ${station && Math.abs(station.freq - frequency) < 0.05 ? 'active' : ''} ${!station ? 'empty' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      dragItem.current = index;
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnter={(e) => {
                      dragOverItem.current = index;
                    }}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => station && handleSelectSaved(station.freq)}
                  >
                    <div className="saved-item-info">
                      <span className="saved-item-preset-id">P-0{index + 1}</span>
                      {station ? (
                        <>
                          <span className="saved-item-freq">{station.freq.toFixed(2)} MHz</span>
                          <span className="saved-item-name">{station.name}</span>
                        </>
                      ) : (
                        <span className="saved-item-empty-text">Empty Slot</span>
                      )}
                    </div>
                    {station && (
                      <button 
                        className="saved-item-delete-btn" 
                        onClick={(e) => handleDeleteSaved(index, e)}
                        aria-label="Delete saved station"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Rotary Knobs */}
        <div className={`rotary-knobs-section ${isPowerOn ? 'on' : 'off'}`}>
          <div className="rotary-tuning-knob-container">
            <div className="outer-ring-ticks">
              <div className="tick tick-1"></div>
              <div className="tick tick-2"></div>
              <div className="tick tick-3"></div>
              <div className="tick tick-4"></div>
              <div className="tick tick-5"></div>
              
              <div className="sub-tick sub-1"></div>
              <div className="sub-tick sub-2"></div>
              <div className="sub-tick sub-3"></div>
              <div className="sub-tick sub-4"></div>
              <div className="sub-tick sub-5"></div>
              <div className="sub-tick sub-6"></div>
              <div className="sub-tick sub-7"></div>
              <div className="sub-tick sub-8"></div>
            </div>
            
            <div 
              className="tuning-knob-base"
              ref={sliderTrackRef}
              onPointerDown={handleSliderPointerDown}
            >
              <div 
                className="knob-indicator-notch"
                style={{ transform: `rotate(${-135 + sliderPercent * 2.7}deg)` }}
              ></div>
            </div>
            
            <div className="tuning-knob-label">TUNING</div>
          </div>
          
          <div className="rotary-tuning-knob-container volume-knob-wrapper">
            <VolumeWedge />
            
            <div 
              className="tuning-knob-base"
              ref={volumeTrackRef}
              onPointerDown={handleVolumePointerDown}
            >
              <div 
                className="volume-indicator-triangle"
                style={{ transform: `rotate(${-90 + volume * 180}deg)` }}
              >
                <svg width="11" height="9" viewBox="0 0 11 9">
                  <polygon points="5.5,0 11,9 0,9" fill="#121315" />
                </svg>
              </div>
            </div>
            
            <div className="tuning-knob-label">VOL</div>
          </div>
        </div>

        {/* SECTION 3: Bottom action footer bar */}
        <div className="bottom-action-footer-bar">
          
          {/* Menu button ☰ */}
          <button 
            className={`footer-icon-btn menu-btn ${isMenuOpen ? 'active' : ''} ${isPowerOn ? '' : 'disabled'}`}
            onClick={() => isPowerOn && setIsMenuOpen(!isMenuOpen)}
            aria-label="Open Saved List"
          >
            ☰
          </button>

          {/* Centered Skip pill buttons |◀ and ▶| */}
          <div className={`footer-centered-pill ${isPowerOn ? '' : 'disabled'}`}>
            <button className="skip-btn prev" onClick={handlePrevStation} aria-label="Previous Station">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
              </svg>
            </button>
            <div className="pill-divider-line"></div>
            <button className="skip-btn next" onClick={handleNextStation} aria-label="Next Station">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M6 18V6l8.5 6zm10-12h2v12h-2z" />
              </svg>
            </button>
          </div>

          {/* Plus button + */}
          <button 
            className={`footer-icon-btn plus-btn ${isPowerOn ? '' : 'disabled'}`}
            onClick={handleAddStation}
            aria-label="Add current station"
          >
            +
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
