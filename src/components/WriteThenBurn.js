import React, { useState, useEffect } from 'react';

const WriteThenBurn = ({ bgColor = '#ffffff' }) => {
  const [text, setText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0); // 0 to 100
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showFireEffect, setShowFireEffect] = useState(false);

  const handleBurn = () => {
    if (!text.trim()) return;

    setIsBurning(true);
    setBurnProgress(0);
    setShowText(true);

    // Start the burn animation (2 seconds for the text to burn away)
    const startTime = Date.now();
    const duration = 2000; // 2 seconds for the fire to consume the text

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setBurnProgress(progress);

      // Start showing fire effects at around 10% progress
      if (progress > 10) {
        setShowFireEffect(true);
      }

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Text is completely burned, now clear it
        setTimeout(() => {
          setText('');
          setShowText(false);
          setIsDestroyed(true);
          setShowFireEffect(false); // Turn off direct fire effect on text box
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsBurning(false);
    setIsDestroyed(false);
    setBurnProgress(0);
    setText('');
    setShowText(true);
  };

  // Create only the slow vertical flame and smoke animation elements that appear after text disappears
  const renderVerticalFlames = () => {
    if (!isDestroyed) return null; // Show flames only after text is destroyed

    // Fixed number of flames for a calmer, slower animation
    const totalFlames = 12; // Reduced number for a calmer effect

    const flames = [];

    for (let i = 0; i < totalFlames; i++) {
      // Calculate size (consistent size for calm effect)
      const baseSize = 28; // Consistent larger size
      const currentSize = baseSize;

      // Position elements along the bottom of the text area
      const left = 15 + (Math.random() * 70); // Spread across width but not too wide

      // Animation properties - very slow and gentle
      const duration = 8.0 / 0.7; // Very slow speed (about 11 seconds to rise)
      const baseDelay = Math.random() * 2.5; // Random initial delay
      const delay = baseDelay + (i * 0.6); // Increased stagger for gentler appearance

      // Density of flames vs smoke (calm ratio)
      const smokeThreshold = 0.4; // 60% flames, 40% smoke for calming effect
      const isFlame = Math.random() > smokeThreshold;

      flames.push(
        <div
          key={`flame-${i}`}
          style={{
            position: 'absolute',
            left: `${left}%`,
            bottom: '0px', // Start from the bottom only
            fontSize: `${currentSize}px`, // Consistent larger size
            opacity: 0,
            animation: `verticalRise ${duration}s linear ${delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 10,
            animationPlayState: 'running'
          }}
        >
          {isFlame ? '🔥' : '☁️'}
        </div>
      );
    }

    return flames;
  };

  // Background color is now controlled globally through the main App component

  // Function to create a lighter shade of the selected color
  const createLighterShade = (hexColor) => {
    const cleanHex = hexColor.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    const newR = Math.min(255, Math.floor(r + (255 - r) * 0.15)); // 15% closer to white
    const newG = Math.min(255, Math.floor(g + (255 - g) * 0.15));
    const newB = Math.min(255, Math.floor(b + (255 - b) * 0.15));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const containerBgColor = createLighterShade(bgColor);

  return (
    <div className="write-then-burn-container" style={{
      padding: '25px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: containerBgColor, // Use calculated lighter shade of selected color
      borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
      margin: '20px 0',
      position: 'relative'
    }}>
      {/* Add CSS animations to the component */}
      <style>
        {`
          @keyframes verticalRise {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.6);
            }
            10% {
              opacity: 1;
              transform: translateY(-10px) scale(0.8);
            }
            40% {
              opacity: 1;
              transform: translateY(-28px) scale(1.0);
            }
            70% {
              opacity: 0.8;
              transform: translateY(-56px) scale(1.1);
            }
            100% {
              opacity: 0;
              transform: translateY(-84px) scale(1.2);
            }
          }

          @keyframes burnEffect {
            0% {
              opacity: 0.2;
              transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
              opacity: 0.2;
              transform: translate(-50%, -50%) scale(0.8);
            }
          }

          @keyframes flameFlicker {
            0% { opacity: 0.4; }
            25% { opacity: 0.8; }
            50% { opacity: 0.6; }
            75% { opacity: 0.9; }
            100% { opacity: 0.4; }
          }

          @keyframes emberGlow {
            0% {
              opacity: 0.6;
              transform: scale(0.6);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 0.6;
              transform: scale(0.8);
            }
          }

          @keyframes flameFlicker {
            0% { opacity: 0.4; }
            25% { opacity: 0.9; }
            50% { opacity: 0.6; }
            75% { opacity: 0.8; }
            100% { opacity: 0.4; }
          }
        `}
      </style>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#2c3e50',
          fontSize: '1.8em'
        }}>
          🔥 Write Then Burn
        </h2>
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#e74c3c',
          padding: '8px 15px', 
          borderRadius: '20px',
          fontSize: '0.9em',
          fontWeight: '600'
        }}>
          Private Mode
        </div>
      </div>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6',
        marginBottom: '25px',
        fontSize: '1.1em'
      }}>
        Write something sensitive and have it permanently destroy itself after viewing.
        Your thoughts will be completely unrecoverable once burned.
      </p>
      
      <div style={{ 
        position: 'relative', 
        marginBottom: '25px',
        height: (isBurning || isDestroyed) ? '200px' : 'auto'  // Maintain height during burn animation
      }}>
        {showText && (
          <textarea
            id="burn-textarea"
            value={text}
            onChange={(e) => {
              if (!isBurning && !isDestroyed) {
                setText(e.target.value);
              }
            }}
            placeholder="Write your private thoughts here... This content will be permanently destroyed after burning."
            rows={isBurning ? 8 : 10}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '16px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1.6',
              borderRadius: '10px',
              border: isBurning ? '2px solid #ff6b6b' : '2px solid #e0e0e0',
              backgroundColor: isBurning ? '#fff5f5' : '#ffffff', // Subtle red tint when burning
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.5s ease',
              resize: 'vertical',
              opacity: isBurning ? 1 - (burnProgress / 100) : 1, // Fade out during burning
              filter: isBurning ? `blur(${burnProgress / 100}px) brightness(${1.0 - (burnProgress / 300)})` : 'none', // Blur and dim
              position: 'relative',
              zIndex: 1,
              transform: 'none',
              animation: 'none'
            }}
            disabled={isBurning || isDestroyed}
            onFocus={(e) => {
              if (!isBurning && !isDestroyed) {
                e.target.style.borderColor = '#e74c3c';
                e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isBurning ? '#ff6b6b' : '#e0e0e0';
              e.target.style.boxShadow = 'none';
            }}
          />
        )}

        {/* Flame emoji overlay on the text box */}
        {showText && showFireEffect && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3,
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            {/* Animated flame emojis that grow larger */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '25%',
              fontSize: `${15 + (burnProgress * 0.3)}px`, // Grow as burn progresses
              opacity: burnProgress > 10 ? Math.min(1, (burnProgress - 10) / 90) : 0, // Fade in
              animation: 'flameFlicker 0.8s infinite',
              transform: 'translate(-50%, -50%)'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              top: '45%',
              left: '75%',
              fontSize: `${12 + (burnProgress * 0.25)}px`, // Grow as burn progresses
              opacity: burnProgress > 20 ? Math.min(1, (burnProgress - 20) / 80) : 0, // Fade in later
              animation: 'flameFlicker 1.0s infinite 0.2s',
              transform: 'translate(-50%, -50%)'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              top: '75%',
              left: '35%',
              fontSize: `${18 + (burnProgress * 0.4)}px`, // Grow as burn progresses
              opacity: burnProgress > 15 ? Math.min(1, (burnProgress - 15) / 85) : 0, // Fade in slightly later
              animation: 'flameFlicker 0.9s infinite 0.4s',
              transform: 'translate(-50%, -50%)'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '55%',
              fontSize: `${20 + (burnProgress * 0.35)}px`, // Grow as burn progresses
              opacity: burnProgress > 5 ? Math.min(1, (burnProgress - 5) / 95) : 0, // Fade in early
              animation: 'flameFlicker 0.7s infinite',
              transform: 'translate(-50%, -50%)'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              top: '65%',
              left: '85%',
              fontSize: `${10 + (burnProgress * 0.2)}px`, // Grow as burn progresses
              opacity: burnProgress > 25 ? Math.min(1, (burnProgress - 25) / 75) : 0, // Fade in later
              animation: 'flameFlicker 1.1s infinite 0.3s',
              transform: 'translate(-50%, -50%)'
            }}>🔥</div>
          </div>
        )}

        {/* Show only the slow vertical flames after text disappears */}
        {isDestroyed && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 2,
              overflow: 'hidden'
            }}
          >
            {renderVerticalFlames()}
          </div>
        )}
      </div>
      
      {!isDestroyed ? (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={handleBurn}
            disabled={!text.trim() || isBurning}
            style={{
              backgroundColor: isBurning ? '#95a5a6' : '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '6px',
              cursor: (!text.trim() || isBurning) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isBurning && text.trim()) {
                e.target.style.backgroundColor = '#c0392b';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isBurning && text.trim()) {
                e.target.style.backgroundColor = '#e74c3c';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isBurning ? (
              <span>🔥 Burning... {Math.round(burnProgress)}%</span>
            ) : (
              '🔥 Burn My Thoughts'
            )}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            disabled={isBurning}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '6px',
              cursor: isBurning ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease'
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px dashed #e74c3c',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>🔒</div>
          <p style={{ 
            fontSize: '1.3em', 
            fontWeight: '600', 
            color: '#e74c3c',
            marginBottom: '20px'
          }}>
            Your thoughts have been permanently destroyed
          </p>
          <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
            The content you wrote has been securely erased and cannot be recovered.
          </p>
          <button 
            className="btn" 
            onClick={handleReset}
            style={{
              backgroundColor: '#4a6fa5',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease'
            }}
          >
            Write Something New
          </button>
        </div>
      )}
      
      {isBurning && (
        <div style={{ marginTop: '25px' }}>
          <div style={{ 
            height: '12px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '6px', 
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
          }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${burnProgress}%`, 
                backgroundColor: '#e74c3c',
                transition: 'width 0.1s linear',
                background: `linear-gradient(90deg, #e74c3c 0%, #c0392b ${burnProgress}%, #f0f0f0 ${burnProgress}%)`,
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
              }}
            />
          </div>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '8px', 
            fontSize: '0.95em', 
            color: '#666',
            fontWeight: '500'
          }}>
            {Math.round(burnProgress)}% destroyed
          </div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '25px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px', 
        fontSize: '0.95em',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ 
          marginBottom: '12px', 
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '10px' }}>🔒</span> How Write Then Burn Works:
        </h4>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
          <li>Write sensitive thoughts that you want to process but not store</li>
          <li>Click "Burn My Thoughts" to permanently destroy it with animation</li>
          <li>Flames and smoke rise up after text disappears in a smooth animation</li>
          <li>Once burned, the content is completely unrecoverable</li>
          <li>No data is stored on any server - complete privacy guaranteed</li>
        </ul>
      </div>

      {/* The global color selector at the app level handles color changes for the entire site */}
    </div>
  );
};

export default WriteThenBurn;