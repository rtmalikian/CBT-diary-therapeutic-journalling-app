import React, { useState, useEffect } from 'react';

const ProgressiveMuscleRelaxation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds for tense phase
  const [phase, setPhase] = useState('pre-instruction'); // pre-instruction, tense, relax, between, finished
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('full-body');
  const [sessionHistory, setSessionHistory] = useState([]);

  // PMR instructions for different muscle groups
  const pmrInstructions = {
    'hands-fists': [
      { step: 0, instruction: "Make a tight fist with your right hand", phase: 'tense', duration: 5 },
      { step: 1, instruction: "Hold the tension in your right hand", phase: 'hold', duration: 5 },
      { step: 2, instruction: "Now relax your right hand completely", phase: 'relax', duration: 10 },
      { step: 3, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 4, instruction: "Make a tight fist with your left hand", phase: 'tense', duration: 5 },
      { step: 5, instruction: "Hold the tension in your left hand", phase: 'hold', duration: 5 },
      { step: 6, instruction: "Now relax your left hand completely", phase: 'relax', duration: 10 },
      { step: 7, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 }
    ],
    'arms-shoulders': [
      { step: 0, instruction: "Bend your right arm and make a fist, then flex your bicep", phase: 'tense', duration: 5 },
      { step: 1, instruction: "Hold the tension in your right arm", phase: 'hold', duration: 5 },
      { step: 2, instruction: "Now relax your right arm completely", phase: 'relax', duration: 10 },
      { step: 3, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 4, instruction: "Bend your left arm and make a fist, then flex your bicep", phase: 'tense', duration: 5 },
      { step: 5, instruction: "Hold the tension in your left arm", phase: 'hold', duration: 5 },
      { step: 6, instruction: "Now relax your left arm completely", phase: 'relax', duration: 10 },
      { step: 7, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 8, instruction: "Lift your shoulders up to your ears", phase: 'tense', duration: 5 },
      { step: 9, instruction: "Hold the tension in your shoulders", phase: 'hold', duration: 5 },
      { step: 10, instruction: "Now drop your shoulders and relax completely", phase: 'relax', duration: 10 },
      { step: 11, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 }
    ],
    'face-jaw': [
      { step: 0, instruction: "Tighten your facial muscles by scrunching your face", phase: 'tense', duration: 5 },
      { step: 1, instruction: "Hold the tension in your facial muscles", phase: 'hold', duration: 5 },
      { step: 2, instruction: "Now relax your facial muscles completely", phase: 'relax', duration: 10 },
      { step: 3, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 4, instruction: "Clench your jaw tightly", phase: 'tense', duration: 5 },
      { step: 5, instruction: "Hold the tension in your jaw", phase: 'hold', duration: 5 },
      { step: 6, instruction: "Now relax your jaw completely", phase: 'relax', duration: 10 },
      { step: 7, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 }
    ],
    'chest-back': [
      { step: 0, instruction: "Take a deep breath and hold it, expanding your chest", phase: 'tense', duration: 5 },
      { step: 1, instruction: "Continue holding your breath and chest tension", phase: 'hold', duration: 5 },
      { step: 2, instruction: "Now exhale slowly and relax your chest", phase: 'relax', duration: 10 },
      { step: 3, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 4, instruction: "Arch your back slightly to feel the muscles", phase: 'tense', duration: 5 },
      { step: 5, instruction: "Hold the tension in your back muscles", phase: 'hold', duration: 5 },
      { step: 6, instruction: "Return to normal position and relax your back", phase: 'relax', duration: 10 },
      { step: 7, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 }
    ],
    'full-body': [
      { step: 0, instruction: "Make a tight fist with your right hand", phase: 'tense', duration: 5 },
      { step: 1, instruction: "Hold the tension in your right hand", phase: 'hold', duration: 5 },
      { step: 2, instruction: "Now relax your right hand completely", phase: 'relax', duration: 10 },
      { step: 3, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 4, instruction: "Make a tight fist with your left hand", phase: 'tense', duration: 5 },
      { step: 5, instruction: "Hold the tension in your left hand", phase: 'hold', duration: 5 },
      { step: 6, instruction: "Now relax your left hand completely", phase: 'relax', duration: 10 },
      { step: 7, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 8, instruction: "Bend your right arm and make a fist, then flex your bicep", phase: 'tense', duration: 5 },
      { step: 9, instruction: "Hold the tension in your right arm", phase: 'hold', duration: 5 },
      { step: 10, instruction: "Now relax your right arm completely", phase: 'relax', duration: 10 },
      { step: 11, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 12, instruction: "Bend your left arm and make a fist, then flex your bicep", phase: 'tense', duration: 5 },
      { step: 13, instruction: "Hold the tension in your left arm", phase: 'hold', duration: 5 },
      { step: 14, instruction: "Now relax your left arm completely", phase: 'relax', duration: 10 },
      { step: 15, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 16, instruction: "Tighten your facial muscles by scrunching your face", phase: 'tense', duration: 5 },
      { step: 17, instruction: "Hold the tension in your facial muscles", phase: 'hold', duration: 5 },
      { step: 18, instruction: "Now relax your facial muscles completely", phase: 'relax', duration: 10 },
      { step: 19, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 20, instruction: "Clench your jaw tightly", phase: 'tense', duration: 5 },
      { step: 21, instruction: "Hold the tension in your jaw", phase: 'hold', duration: 5 },
      { step: 22, instruction: "Now relax your jaw completely", phase: 'relax', duration: 10 },
      { step: 23, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 24, instruction: "Take a deep breath and hold it, expanding your chest", phase: 'tense', duration: 5 },
      { step: 25, instruction: "Continue holding your breath and chest tension", phase: 'hold', duration: 5 },
      { step: 26, instruction: "Now exhale slowly and relax your chest", phase: 'relax', duration: 10 },
      { step: 27, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 },
      { step: 28, instruction: "Arch your back slightly to feel the muscles", phase: 'tense', duration: 5 },
      { step: 29, instruction: "Hold the tension in your back muscles", phase: 'hold', duration: 5 },
      { step: 30, instruction: "Return to normal position and relax your back", phase: 'relax', duration: 10 },
      { step: 31, instruction: "Notice the difference between tension and relaxation", phase: 'observe', duration: 5 }
    ]
  };

  const instructions = pmrInstructions[selectedMuscleGroup] || pmrInstructions['full-body'];

  // Handle the timer for each step
  useEffect(() => {
    let timer = null;

    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Move to next step when timer finishes
      if (currentStep < instructions.length - 1) {
        setCurrentStep(currentStep + 1);
        const nextInstruction = instructions[currentStep + 1];
        setTimeLeft(nextInstruction.duration);
        setPhase(nextInstruction.phase);
      } else {
        // Session completed
        setIsPlaying(false);
        setPhase('finished');
        // Add to session history
        const session = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          duration: instructions.reduce((sum, inst) => sum + inst.duration, 0),
          muscleGroup: selectedMuscleGroup,
          completed: true
        };
        setSessionHistory([session, ...sessionHistory]);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, timeLeft, currentStep, instructions, selectedMuscleGroup]);

  const startSession = () => {
    if (instructions.length > 0) {
      setCurrentStep(0);
      setTimeLeft(instructions[0].duration);
      setPhase(instructions[0].phase);
      setIsPlaying(true);
    }
  };

  const pauseSession = () => {
    setIsPlaying(false);
  };

  const resetSession = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPhase('pre-instruction');
    setTimeLeft(5);
  };

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      setTimeLeft(instructions[nextStepNum].duration);
      setPhase(instructions[nextStepNum].phase);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      setTimeLeft(instructions[prevStepNum].duration);
      setPhase(instructions[prevStepNum].phase);
    }
  };

  const currentInstruction = instructions[currentStep] || { instruction: 'Select a muscle group to begin', phase: 'start' };

  return (
    <div className="pmr-container" style={{ padding: '1rem' }}>
      <h2>Progressive Muscle Relaxation</h2>
      
      <div className="pmr-controls" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="muscle-group">Select Muscle Group:</label>
          <select
            id="muscle-group"
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            disabled={isPlaying}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="full-body">Full Body (Complete Session)</option>
            <option value="hands-fists">Hands & Fists</option>
            <option value="arms-shoulders">Arms & Shoulders</option>
            <option value="face-jaw">Face & Jaw</option>
            <option value="chest-back">Chest & Back</option>
          </select>
        </div>
      </div>
      
      <div className="pmr-instruction" style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        border: '2px solid #4a6fa5', 
        borderRadius: '8px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3 style={{ 
          color: phase === 'tense' ? '#e74c3c' : 
                 phase === 'relax' ? '#2ecc71' : 
                 phase === 'hold' ? '#f39c12' : '#4a6fa5',
          marginBottom: '1rem'
        }}>
          {currentInstruction.phase.charAt(0).toUpperCase() + currentInstruction.phase.slice(1)}
        </h3>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          {currentInstruction.instruction}
        </p>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4a6fa5' }}>
          {timeLeft}s
        </div>
      </div>
      
      <div className="pmr-progress" style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Step {currentStep + 1} of {instructions.length}</span>
          <span>{Math.round(((currentStep + 1) / instructions.length) * 100)}% Complete</span>
        </div>
        <div style={{ 
          height: '10px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '5px', 
          overflow: 'hidden' 
        }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${((currentStep + 1) / instructions.length) * 100}%`, 
              backgroundColor: '#4a6fa5',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
      
      <div className="pmr-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {!isPlaying ? (
          <button className="btn" onClick={startSession} disabled={phase === 'finished'}>
            {phase === 'finished' ? 'Session Complete' : 'Start Session'}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={pauseSession}>Pause</button>
        )}
        <button className="btn btn-secondary" onClick={resetSession}>Reset</button>
        <button className="btn btn-secondary" onClick={prevStep} disabled={currentStep === 0 || isPlaying}>
          Previous
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={nextStep} 
          disabled={currentStep >= instructions.length - 1 || isPlaying}
        >
          Next
        </button>
      </div>
      
      <div className="pmr-session-history" style={{ marginTop: '2rem' }}>
        <h3>Session History</h3>
        {sessionHistory.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessionHistory.map((session) => (
              <li 
                key={session.id} 
                style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #eee', 
                  borderRadius: '4px', 
                  marginBottom: '0.5rem' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{session.date}</span>
                  <span>{session.duration}s - {session.muscleGroup.replace('-', ' ')}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions completed yet.</p>
        )}
      </div>
      
      <div className="pmr-info" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>About Progressive Muscle Relaxation</h3>
        <p>Progressive muscle relaxation (PMR) is a technique that helps you relax by tensing and then releasing different muscle groups. This practice can reduce anxiety, stress, and muscle tension.</p>
        <p>The technique involves systematically tensing each muscle group for a few seconds, then relaxing it and noticing the difference between tension and relaxation.</p>
      </div>
    </div>
  );
};

export default ProgressiveMuscleRelaxation;