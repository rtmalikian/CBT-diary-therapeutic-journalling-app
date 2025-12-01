import React, { useState, useEffect, useRef } from 'react';

const EmotionWheel = () => {
  const [showWheel, setShowWheel] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0); // Shared rotation for both wheels
  const wheelRef = useRef(null);

  // Inner wheel emotions - core/simple emotion terms
  const innerEmotions = {
    positive: [
      { name: 'Happy', synonyms: ['Joyful', 'Elated', 'Delighted', 'Cheerful', 'Pleased', 'Thrilled', 'Blissful', 'Radiant'] },
      { name: 'Calm', synonyms: ['Peaceful', 'Tranquil', 'Serene', 'Relaxed', 'Restful', 'Balanced', 'Harmonious', 'Undisturbed'] },
      { name: 'Proud', synonyms: ['Accomplished', 'Satisfied', 'Confident', 'Esteemed', 'Successful', 'Fulfilled', 'Valued', 'Appreciated'] },
      { name: 'Grateful', synonyms: ['Thankful', 'Appreciative', 'Obliged', 'Endebted', 'Owing', 'Recognized', 'Valued', 'Respected'] },
      { name: 'Loved', synonyms: ['Cared', 'Adored', 'Treasured', 'Cherished', 'Valued', 'Esteemed', 'Treasured', 'Admired'] },
      { name: 'Hopeful', synonyms: ['Optimistic', 'Confident', 'Assured', 'Encouraged', 'Anticipatory', 'Confident', 'Upbeat', 'Encouraged'] }
    ],
    negative: [
      { name: 'Sad', synonyms: ['Unhappy', 'Miserable', 'Depressed', 'Down', 'Blue', 'Gloomy', 'Melancholy', 'Sorrowful'] },
      { name: 'Angry', synonyms: ['Furious', 'Irate', 'Enraged', 'Incensed', 'Vexed', 'Infuriated', 'Provoked', 'Agitated'] },
      { name: 'Anxious', synonyms: ['Worried', 'Nervous', 'Tense', 'Apprehensive', 'Uneasy', 'Restless', 'Troubled', 'Distressed'] },
      { name: 'Guilt', synonyms: ['Remorseful', 'Ashamed', 'Regretful', 'Contrite', 'Penitent', 'Sorrowful', 'Self-reproaching', 'Self-condemning'] },
      { name: 'Scared', synonyms: ['Frightened', 'Terrified', 'Alarmed', 'Panicked', 'Afraid', 'Anxious', 'Dreadful', 'Timorous'] },
      { name: 'Lonely', synonyms: ['Isolated', 'Alone', 'Desolate', 'Abandoned', 'Separated', 'Solitary', 'Detached', 'Shut-off'] }
    ]
  };

  const allInnerEmotions = [...innerEmotions.positive, ...innerEmotions.negative];

  // Handle right-click to show emotion wheel
  useEffect(() => {
    const handleRightClick = (e) => {
      // Check if the right-click happened in the journal area
      if (e.target.id === 'journal-entry' || e.target.classList.contains('journal-container')) {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setShowWheel(true);
      }
    };

    document.addEventListener('contextmenu', handleRightClick);
    return () => document.removeEventListener('contextmenu', handleRightClick);
  }, []);

  // Hide wheel when clicking elsewhere
  useEffect(() => {
    const handleClick = (e) => {
      if (wheelRef.current && !wheelRef.current.contains(e.target)) {
        setShowWheel(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handle mouse wheel to rotate the entire wheel
  useEffect(() => {
    const handleWheel = (e) => {
      if (!showWheel) return;

      e.preventDefault();
      // Slow down rotation to 20% of original speed (2 degrees per scroll instead of 10)
      const delta = e.deltaY > 0 ? 2 : -2;

      // Update the single rotation value
      setWheelRotation(prev => (prev + delta) % 360);
    };

    if (showWheel) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel, { passive: false });
    }
  }, [showWheel]);

  // Handle emotion selection
  const handleEmotionClick = (emotionName) => {
    // Find the journal textarea and insert the emotion at cursor position
    const textArea = document.getElementById('journal-entry');
    if (textArea) {
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;
      const textBefore = textArea.value.substring(0, startPos);
      const textAfter = textArea.value.substring(endPos);

      const newText = textBefore + emotionName + ' ' + textAfter;
      textArea.value = newText;

      // Set cursor position after the inserted text
      textArea.setSelectionRange(startPos + emotionName.length + 1, startPos + emotionName.length + 1);

      // Trigger input event to update React state
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    setShowWheel(false);
  };

  // Get emotions to show based on selected category
  const getEmotionsToShow = () => {
    if (selectedCategory === 'positive') return innerEmotions.positive;
    if (selectedCategory === 'negative') return innerEmotions.negative;
    return allInnerEmotions;
  };

  const emotionsToShow = getEmotionsToShow();

  // Calculate position for radial layout
  const calculatePosition = (index, total, radius) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle
    };
  };

  // Calculate readable rotation for text
  const calculateRotation = (angle) => {
    let rotation = (angle * 180 / Math.PI) + 90; // Align with our start point

    // Adjust so text is always readable left-to-right
    if (rotation > 90 && rotation < 270) {
      rotation += 180;
    }

    return ((rotation + 360) % 360);
  };

  // Determine color based on emotion category
  const getColorByCategory = (emotionName) => {
    // Check if emotion is in positive or negative category
    const isInPositive = [...innerEmotions.positive]
                          .some(e => e.name === emotionName);
    return isInPositive ? '#2ecc71' : '#e74c3c';
  };

  return (
    <>
      {showWheel && (
        <div
          ref={wheelRef}
          className="emotion-wheel-container"
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '50%',
            padding: '10px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            zIndex: 10000,
            fontSize: '12px'
          }}
        >
          <div style={{ 
            position: 'absolute', 
            top: '-50px', 
            width: '100%', 
            textAlign: 'center' 
          }}>
            <h3>Emotion Wheel</h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '5px', 
              marginTop: '5px' 
            }}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '3px 8px',
                  fontSize: '10px',
                  background: selectedCategory === 'all' ? '#4a6fa5' : '#ddd',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: selectedCategory === 'all' ? 'white' : '#333'
                }}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('positive')}
                style={{
                  padding: '3px 8px',
                  fontSize: '10px',
                  background: selectedCategory === 'positive' ? '#2ecc71' : '#ddd',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: selectedCategory === 'positive' ? 'white' : '#333'
                }}
              >
                Positive
              </button>
              <button
                onClick={() => setSelectedCategory('negative')}
                style={{
                  padding: '3px 8px',
                  fontSize: '10px',
                  background: selectedCategory === 'negative' ? '#e74c3c' : '#ddd',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: selectedCategory === 'negative' ? 'white' : '#333'
                }}
              >
                Negative
              </button>
            </div>
            <div style={{ fontSize: '9px', marginTop: '3px', color: '#666' }}>
              <button 
                style={{
                  fontSize: '9px',
                  padding: '2px 6px',
                  margin: '2px',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  cursor: 'default'
                }}
              >
                Wheels rotating: {Math.round(wheelRotation)}°
              </button>
            </div>
          </div>

          {/* Dual ring emotion display */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Outer wheel (4 synonyms per inner emotion) */}
            <div 
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${wheelRotation}deg)`,
                width: '280px',
                height: '280px',
                border: '2px solid #eee',
                borderRadius: '50%',
                transition: 'transform 0.1s ease-out'
              }}
            >
              {emotionsToShow.map((emotion, index) => {
                const totalEmotions = emotionsToShow.length;
                
                // Calculate the center angle for this emotion sector
                const centerAngle = (index / totalEmotions) * 2 * Math.PI - Math.PI / 2;
                
                // Select 4 synonyms for this emotion sector
                const synonymsToDisplay = emotion.synonyms.slice(0, 4);
                
                return synonymsToDisplay.map((synonym, synonymIndex) => {
                  // Spread synonyms around the center angle (in a small sector)
                  const offset = (synonymIndex - 1.5) * (Math.PI / 10); // Divide sector for 4 synonyms
                  const angle = centerAngle + offset;
                  
                  // Position at outer radius
                  const outerRadius = 130;
                  const x = Math.cos(angle) * outerRadius;
                  const y = Math.sin(angle) * outerRadius;
                  
                  const rotation = calculateRotation(angle);
                  
                  return (
                    <button
                      key={`outer-${index}-${synonymIndex}`}
                      className="emotion-btn outer-synonym"
                      onClick={() => handleEmotionClick(synonym)}
                      onMouseEnter={() => setHoveredEmotion({name: synonym, description: `Synonym for ${emotion.name}: ${emotion.synonyms.join(', ')}`, source: 'outer'})}
                      onMouseLeave={() => setHoveredEmotion(null)}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px - 30px)`,
                        top: `calc(50% + ${y}px - 15px)`,
                        width: '60px',
                        height: '30px',
                        backgroundColor: getColorByCategory(emotion.name), // Use same color as parent emotion
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `rotate(${rotation}deg)`,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        zIndex: 1
                      }}
                      title={`${synonym} - synonym for ${emotion.name}`}
                    >
                      {synonym}
                    </button>
                  );
                });
              })}
            </div>

            {/* Inner wheel (core emotions) */}
            <div 
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${wheelRotation}deg)`,
                width: '180px',
                height: '180px',
                border: '2px dashed #ddd',
                borderRadius: '50%',
                transition: 'transform 0.1s ease-out'
              }}
            >
              {emotionsToShow.map((emotion, index) => {
                const pos = calculatePosition(index, emotionsToShow.length, 80);
                const rotation = calculateRotation(pos.angle);

                return (
                  <button
                    key={`inner-${index}`}
                    className="emotion-btn inner-emotion"
                    onClick={() => handleEmotionClick(emotion.name)}
                    onMouseEnter={() => setHoveredEmotion({name: emotion.name, description: `Core emotion with synonyms: ${emotion.synonyms.slice(0, 4).join(', ')}`, source: 'inner'})}
                    onMouseLeave={() => setHoveredEmotion(null)}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${pos.x}px - 25px)`,
                      top: `calc(50% + ${pos.y}px - 12px)`,
                      width: '50px',
                      height: '24px',
                      backgroundColor: getColorByCategory(emotion.name),
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `rotate(${rotation}deg)`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      zIndex: 2
                    }}
                    title={`Core emotion. Synonyms: ${emotion.synonyms.slice(0, 4).join(', ')}`}
                  >
                    {emotion.name}
                  </button>
                );
              })}
            </div>

            {/* Center button to close */}
            <button
              onClick={() => setShowWheel(false)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#95a5a6',
                color: 'white',
                cursor: 'pointer',
                zIndex: 3,
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              X
            </button>
          </div>

          {/* Hover description panel */}
          {hoveredEmotion && (
            <div style={{
              position: 'absolute',
              bottom: '-90px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px',
              width: '280px',
              textAlign: 'center',
              fontSize: '10px',
              zIndex: 4
            }}>
              <strong>{hoveredEmotion.name}:</strong> {hoveredEmotion.description}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EmotionWheel;