import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Journal from './components/Journal';
import EmotionWheel from './components/EmotionWheel';
import BreathingGuide from './components/BreathingGuide';
import MoodTracker from './components/MoodTracker';
import ProgressiveMuscleRelaxation from './components/ProgressiveMuscleRelaxation';
import WriteThenBurn from './components/WriteThenBurn';
import './styles/main.css';

// Simple Modal Component - Defined in the same file to avoid import issues
const ModalWithFlipAnimation = ({
  isOpen,
  onClose,
  title,
  children,
  bgColor = '#ffffff', // Accept the base background color
}) => {
  if (!isOpen) return null;

  // Create a lighter shade for the modal background (same algorithm as main app)
  const createLighterShade = (hexColor) => {
    const cleanHex = hexColor.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    const newR = Math.min(255, Math.floor(r + (255 - r) * 0.15)); // 15% closer to white (same as main app)
    const newG = Math.min(255, Math.floor(g + (255 - g) * 0.15));
    const newB = Math.min(255, Math.floor(b + (255 - b) * 0.15));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Create a medium shade for the modal content background
  const modalBgColor = createLighterShade(bgColor);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside modal
        style={{
          position: 'relative',
          backgroundColor: modalBgColor, // Use calculated shade based on selected color
          borderRadius: '12px',
          padding: '25px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          animation: 'modalFadeIn 0.3s ease-out',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          paddingBottom: '10px',
          borderBottom: `1px solid ${bgColor}` // Use the base color for border
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5em',
            color: '#2c3e50',
            fontWeight: '600'
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.8em',
              cursor: 'pointer',
              color: '#7f8c8d',
              padding: '5px 10px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#e74c3c';
              e.target.style.backgroundColor = createLighterShade(bgColor); // Use matching background
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#7f8c8d';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('journal');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showPmr, setShowPmr] = useState(false);
  const [user, setUser] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff'); // Default to white
  const [nextBgColor, setNextBgColor] = useState('#ffffff'); // Next color for crossfade
  const [crossfadeProgress, setCrossfadeProgress] = useState(0); // Progress of crossfade (0 to 1)
  const [isCrossfading, setIsCrossfading] = useState(false); // Whether colors are crossfading

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('cbtUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check for saved color preference
    const savedColor = localStorage.getItem('calmingColor');
    if (savedColor) {
      setBgColor(savedColor);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cbtUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cbtUser');
  };

  // Function to create a lighter shade of a color
  const createLighterShade = (hexColor) => {
    // Remove the '#' if present
    const cleanHex = hexColor.replace('#', '');

    // Parse the RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Increase each component by 15% towards 255 (whitening effect)
    const newR = Math.min(255, Math.floor(r + (255 - r) * 0.15));
    const newG = Math.min(255, Math.floor(g + (255 - g) * 0.15));
    const newB = Math.min(255, Math.floor(b + (255 - b) * 0.15));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Function to create a darker shade for header
  const createDarkerShade = (hexColor) => {
    // Remove the '#' if present
    const cleanHex = hexColor.replace('#', '');

    // Parse the RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Reduce each component by 10%
    const newR = Math.max(0, Math.floor(r * 0.9));
    const newG = Math.max(0, Math.floor(g * 0.9));
    const newB = Math.max(0, Math.floor(b * 0.9));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Calming color options
  const calmingColors = [
    { name: 'Ocean Blue', value: '#e6f3ff', description: 'Soft blue like calm ocean waters' },
    { name: 'Sage Green', value: '#f5fffa', description: 'Natural green for relaxation' },
    { name: 'Lavender Mist', value: '#f0e6ff', description: 'Gentle purple for peace' },
    { name: 'Warm Beige', value: '#fdf0e0', description: 'Comforting neutral tone' }
  ];

  const handleColorChange = (colorValue) => {
    if (isCrossfading) return; // Prevent new transitions while already transitioning

    setNextBgColor(colorValue);
    setIsCrossfading(true);
    setCrossfadeProgress(0);

    // Start the crossfade animation
    const startTime = Date.now();
    const duration = 1000; // 1 second for crossfade

    const animateCrossfade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setCrossfadeProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animateCrossfade);
      } else {
        // Animation complete, update the background color
        setBgColor(colorValue);
        localStorage.setItem('calmingColor', colorValue);
        setIsCrossfading(false);
        setCrossfadeProgress(0);
      }
    };

    requestAnimationFrame(animateCrossfade);
  };

  // Calculate blended color during crossfade
  const calculateBlendedColor = (color1, color2, progress) => {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return { r, g, b };
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Calculate blended and lighter shades for containers
  const blendedBgColor = isCrossfading ?
    calculateBlendedColor(bgColor, nextBgColor, crossfadeProgress) :
    bgColor;

  const lighterBlendedColor = createLighterShade(blendedBgColor);

  return (
    <div className="app" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: blendedBgColor,
    }}>
      <header className="header" style={{
        backgroundColor: createDarkerShade(isCrossfading ?
          calculateBlendedColor(bgColor, nextBgColor, crossfadeProgress) :
          bgColor
        ), // Darker shade of the blended color during crossfade
        color: 'white',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            fontSize: '1.8rem',
            margin: '0 0 15px 0'
          }}>
            CBT Diary
          </h1>
          <nav className="nav" style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <a href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView('journal'); setShowBreathing(false); setShowPmr(false); }}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                backgroundColor: currentView === 'journal' ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = currentView === 'journal' ? 'rgba(255,255,255,0.2)' : 'transparent'}
            >
              Journal
            </a>
            <a href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView('mood'); setShowBreathing(false); setShowPmr(false); }}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                backgroundColor: currentView === 'mood' ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = currentView === 'mood' ? 'rgba(255,255,255,0.2)' : 'transparent'}
            >
              Mood Tracker
            </a>
            <a href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView('burn'); setShowBreathing(false); setShowPmr(false); }}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                backgroundColor: currentView === 'burn' ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = currentView === 'burn' ? 'rgba(255,255,255,0.2)' : 'transparent'}
            >
              Write Then Burn
            </a>
            <a href="#" 
              onClick={(e) => { e.preventDefault(); setShowBreathing(true); setCurrentView(''); setShowPmr(false); }}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Breathing
            </a>
            <a href="#" 
              onClick={(e) => { e.preventDefault(); setShowPmr(true); setCurrentView(''); setShowBreathing(false); }}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              PMR
            </a>
            {user ? (
              <a href="#" 
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Logout
              </a>
            ) : (
              <a href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentView('login'); setShowBreathing(false); setShowPmr(false); }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  backgroundColor: currentView === 'login' ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentView === 'login' ? 'rgba(255,255,255,0.2)' : 'transparent'}
              >
                Login
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content" style={{
        flex: 1,
        padding: '2rem 0',
        backgroundColor: lighterBlendedColor, // Lighter shade of the blended color during crossfade
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          {currentView === 'journal' && <Journal bgColor={bgColor} />}
          {currentView === 'mood' && <MoodTracker />}
          {currentView === 'burn' && <WriteThenBurn bgColor={bgColor} />}
          {currentView === 'login' && !user && (
            <div className="login-form" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              maxWidth: '400px',
              margin: '2rem auto',
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '1.5rem',
                color: '#2c3e50'
              }}>
                Login to CBT Diary
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin({ id: 1, name: 'User' });
              }}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="email" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>
                    Email:
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="password" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>
                    Password:
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    required 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn"
                  style={{
                    backgroundColor: '#4a6fa5',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3a5a80'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#4a6fa5'}
                >
                  Login
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Breathing Guide Modal */}
      <ModalWithFlipAnimation
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
        title="Deep Breathing Exercise"
        bgColor={bgColor} // Pass the selected background color for theming
      >
        <BreathingGuide />
      </ModalWithFlipAnimation>

      {/* Progressive Muscle Relaxation Modal */}
      <ModalWithFlipAnimation
        isOpen={showPmr}
        onClose={() => setShowPmr(false)}
        title="Progressive Muscle Relaxation"
        bgColor={bgColor} // Pass the selected background color for theming
      >
        <ProgressiveMuscleRelaxation />
      </ModalWithFlipAnimation>

      <EmotionWheel />

      {/* Global Calming Color Theme Selector - Bottom Right */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 10000,
        border: '1px solid #e0e0e0',
        maxWidth: '320px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: 'all 0.3s ease'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          Calming Colors
        </h4>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {calmingColors.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => handleColorChange(colorOption.value)}
              title={colorOption.description}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: colorOption.value,
                border: bgColor === colorOption.value ? '2px solid #333' : '1px solid #ccc',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.3)';
                e.target.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#7f8c8d',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          Click to change background
        </div>
      </div>

      <footer className="footer" style={{
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        textAlign: 'center',
        borderTop: '1px solid #dee2e6',
        marginTop: 'auto',
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            CBT Diary - Your Personal Cognitive Behavioral Therapy Tool
          </p>
          <p style={{ margin: '0.5rem 0', color: '#e74c3c', fontWeight: '600' }}>
            In case of emergency, please contact the National Suicide Prevention Lifeline at 988
          </p>
        </div>
      </footer>
    </div>
  );
};

// Updated for React 18
const root = createRoot(document.getElementById('root'));
root.render(<App />);