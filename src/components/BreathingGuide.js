import React, { useState, useEffect } from 'react';

const BreathingGuide = () => {
  const [isActive, setIsActive] = useState(false);
  const [breathingType, setBreathingType] = useState('circle');
  const [selectedPattern, setSelectedPattern] = useState('4-7-8'); // Default to evidence-based 4-7-8 pattern
  const [duration, setDuration] = useState(300); // in seconds (5 minutes default, based on research)
  const [timeLeft, setTimeLeft] = useState(300);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, etc.
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0); // Current phase in sequence
  const [currentPhaseProgress, setCurrentPhaseProgress] = useState(0); // Progress of current phase

  // Evidence-based breathing patterns
  const breathingPatterns = {
    '4-7-8': {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8 seconds - reduces anxiety and promotes sleep',
      phases: [
        { phase: 'inhale', duration: 4000 }, // 4 seconds
        { phase: 'hold', duration: 7000 },   // 7 seconds
        { phase: 'exhale', duration: 8000 }  // 8 seconds
      ],
      research: 'Based on Dr. Andrew Weil\'s technique, shown to activate parasympathetic nervous system'
    },
    'box': {
      name: 'Box Breathing',
      description: 'Equal count for inhale, hold, exhale, hold - improves focus and calmness',
      phases: [
        { phase: 'inhale', duration: 4000 }, // 4 seconds
        { phase: 'hold', duration: 4000 },   // 4 seconds
        { phase: 'exhale', duration: 4000 }, // 4 seconds
        { phase: 'hold', duration: 4000 }    // 4 seconds
      ],
      research: 'Used by military and first responders to manage stress and improve focus'
    },
    'coherent': {
      name: 'Coherent Breathing',
      description: 'Slow, rhythmic breathing at 5 breaths per minute - optimizes heart rate variability',
      phases: [
        { phase: 'inhale', duration: 6000 }, // 6 seconds
        { phase: 'exhale', duration: 6000 }  // 6 seconds
      ],
      research: 'Shown in research to improve heart rate variability and autonomic nervous system balance'
    },
    'alternate': {
      name: 'Alternate Nostril Breathing',
      description: 'Balance breath between nostrils - calms mind and balances nervous system',
      phases: [
        { phase: 'inhale_right', duration: 4000 }, // 4 seconds inhale right nostril
        { phase: 'hold', duration: 4000 },         // 4 seconds hold
        { phase: 'exhale_left', duration: 6000 },  // 6 seconds exhale left nostril
        { phase: 'hold', duration: 2000 }          // 2 seconds hold
      ],
      research: 'Ancient yoga technique shown to improve cognitive function and reduce stress'
    },
    'physiological': {
      name: 'Physiological Sigh',
      description: 'Double inhale with extended exhale - resets breathing pattern and reduces stress rapidly',
      phases: [
        { phase: 'inhale', duration: 1000 },    // 1 second first inhale
        { phase: 'inhale', duration: 1000 },    // 1 second second inhale (sigh)
        { phase: 'exhale', duration: 6000 }     // 6 seconds exhale
      ],
      research: 'Research shows this pattern rapidly resets CO2 levels and activates parasympathetic response'
    }
  };

  // Get current pattern configuration
  const currentPatternConfig = breathingPatterns[selectedPattern];

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      // Start with the first phase
      executeBreathingSequence();
    } else {
      setCurrentPhaseIndex(0);
      setPhase(currentPatternConfig.phases[0].phase);
    }
  }, [isActive, selectedPattern]);

  const executeBreathingSequence = () => {
    // Cycle through all phases in the current pattern
    const executePhase = (phaseIndex) => {
      if (!isActive) return;

      const currentPhase = currentPatternConfig.phases[phaseIndex];
      setPhase(currentPhase.phase);

      // Store timeout reference to be able to clear it
      const phaseTimeout = setTimeout(() => {
        // Move to next phase
        const nextPhaseIndex = (phaseIndex + 1) % currentPatternConfig.phases.length;
        executePhase(nextPhaseIndex);
      }, currentPhase.duration);

      // Store timeout for cleanup
      window.phaseTimeout = phaseTimeout;
    };

    // Start with current phase
    executePhase(currentPhaseIndex);
  };

  const cycleToNextPhase = () => {
    const nextPhaseIndex = (currentPhaseIndex + 1) % currentPatternConfig.phases.length;
    setCurrentPhaseIndex(nextPhaseIndex);
    setPhase(currentPatternConfig.phases[nextPhaseIndex].phase);
  };

  const startBreathing = () => {
    setIsActive(true);
    setTimeLeft(duration);
    setCurrentPhaseIndex(0);
    setPhase(currentPatternConfig.phases[0].phase);
  };

  const stopBreathing = () => {
    setIsActive(false);
    // Clear any pending timeouts
    if (window.phaseTimeout) {
      clearTimeout(window.phaseTimeout);
      window.phaseTimeout = null;
    }
    setCurrentPhaseIndex(0);
    setPhase('inhale');
  };

  const resetBreathing = () => {
    setIsActive(false);
    // Clear any pending timeouts
    if (window.phaseTimeout) {
      clearTimeout(window.phaseTimeout);
      window.phaseTimeout = null;
    }
    setTimeLeft(duration);
    setCurrentPhaseIndex(0);
    setPhase(currentPatternConfig.phases[0].phase);
  };

  const getVisual = () => {
    // Define visual properties based on the current phase
    let size, color;

    // Set size based on phase
    if (phase.includes('inhale')) {
      size = '120px'; // Expanding for inhale
      color = '#4a6fa5'; // Blue for inhale
    } else if (phase.includes('exhale')) {
      size = '80px'; // Contracting for exhale
      color = '#8e44ad'; // Purple for exhale
    } else if (phase === 'hold') {
      size = '100px'; // Stable size for hold
      color = '#3498db'; // Light blue for hold
    } else {
      // Fallback for any other phases
      size = '100px';
      color = '#95a5a6'; // Gray for undefined phases
    }

    if (breathingType === 'circle') {
      return (
        <div
          className="breathing-circle"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            transition: 'all 1s ease-in-out',
            margin: '0 auto'
          }}
        />
      );
    } else if (breathingType === 'cloud') {
      return (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50% 0 50% 50%',
            transition: 'all 1s ease-in-out',
            margin: '0 auto',
            transform: 'rotate(45deg)'
          }}
        />
      );
    } else if (breathingType === 'wave') {
      return (
        <div
          style={{
            height: '20px',
            width: '200px',
            backgroundColor: 'transparent',
            position: 'relative',
            margin: '40px auto'
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '10px',
              backgroundColor: color,
              transition: 'height 1s ease-in-out',
              height: phase.includes('inhale') ? '15px' : phase.includes('exhale') ? '5px' : '10px'
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="breathing-guide">
      <div className="breathing-controls">
        <div className="visual-container">
          {getVisual()}
        </div>

        <div className="instructions">
          <p>
            {phase.includes('inhale') ? 'Breathe in slowly...' :
             phase.includes('exhale') ? 'Breathe out slowly...' :
             phase === 'hold' ? 'Hold your breath...' :
             phase.includes('right') || phase.includes('left') ? 'Focus on one side...' :
             'Focus your breathing...'}
          </p>
          <p>Current Pattern: {currentPatternConfig.name}</p>
          <p>Time remaining: {timeLeft}s</p>
          <p className="pattern-description">{currentPatternConfig.description}</p>
        </div>

        <div className="control-buttons">
          {!isActive ? (
            <button className="btn" onClick={startBreathing}>Start</button>
          ) : (
            <button className="btn btn-secondary" onClick={stopBreathing}>Stop</button>
          )}
          <button className="btn btn-secondary" onClick={resetBreathing}>Reset</button>
        </div>

        <div className="options">
          <label>
            Breathing pattern:
            <select value={selectedPattern} onChange={(e) => setSelectedPattern(e.target.value)}>
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <option value={key} key={key}>{pattern.name}</option>
              ))}
            </select>
          </label>

          <label>
            Visual type:
            <select value={breathingType} onChange={(e) => setBreathingType(e.target.value)}>
              <option value="circle">Circle</option>
              <option value="cloud">Cloud</option>
              <option value="wave">Wave</option>
            </select>
          </label>

          <label>
            Duration (seconds):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 300)}
              min="30"
              max="600"
            />
          </label>
        </div>

        <div className="research-info">
          <p><strong>Research:</strong> {currentPatternConfig.research}</p>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;