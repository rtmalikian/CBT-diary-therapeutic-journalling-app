import React, { useState, useEffect } from 'react';

const Journal = ({ bgColor = '#f9f3e0' }) => { // Accept bgColor prop from parent
  const [entry, setEntry] = useState('');
  const [prompt, setPrompt] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [mood, setMood] = useState(5); // 1-10 scale
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');

  // Create lighter shade for the paper effect
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

  // Create darker shade for lines
  const createDarkerShade = (hexColor) => {
    // Remove the '#' if present
    const cleanHex = hexColor.replace('#', '');

    // Parse the RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Reduce each component by 10% to create darker lines
    const newR = Math.max(0, Math.floor(r * 0.75));
    const newG = Math.max(0, Math.floor(g * 0.75));
    const newB = Math.max(0, Math.floor(b * 0.75));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Calculate the paper colors based on the selected background
  const paperBgColor = createLighterShade(bgColor);
  const paperLinesColor = createDarkerShade(bgColor);

  // Load initial data from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('journalDraft');
    if (savedDraft) {
      setEntry(savedDraft);
    }

    const savedMood = localStorage.getItem('journalMood');
    if (savedMood) {
      setMood(parseInt(savedMood));
    }

    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setSavedEntries(JSON.parse(savedEntries));
    }

    // Generate daily prompt
    const prompts = [
      "What happened today that affected your mood?",
      "What thought patterns did you notice today?",
      "What are three things you're grateful for today?",
      "What challenge did you face and how did you handle it?",
      "What is one thing you could have handled differently today?",
      "What are some positive changes you've noticed in yourself recently?",
      "What situation made you feel anxious today and why?",
      "What accomplishment, no matter how small, are you proud of today?",
      "What negative thought did you challenge today?",
      "What self-care activity did you engage in today?"
    ];

    const aiPrompt = prompts[new Date().getDate() % prompts.length];
    setPrompt(aiPrompt);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (entry.trim() !== '') {
        localStorage.setItem('journalDraft', entry);
        localStorage.setItem('journalMood', mood.toString());
        setIsAutoSaved(true);
        setAutoSaveMessage('Draft saved automatically');

        // Clear message after 3 seconds
        setTimeout(() => {
          setIsAutoSaved(false);
          setAutoSaveMessage('');
        }, 3000);
      }
    }, 2000); // Save 2 seconds after user stops typing

    return () => clearTimeout(autoSave);
  }, [entry, mood]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content: entry,
      mood: mood,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...savedEntries];
    setSavedEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    setEntry('');
    setMood(5);
    localStorage.removeItem('journalDraft'); // Clear draft after saving
    localStorage.removeItem('journalMood');

    // In a real app, you would save to a database
    console.log('Journal entry saved:', newEntry);

    // Check for crisis indicators in the entry
    checkForCrisisIndicators(entry);
  };

  const checkForCrisisIndicators = async (text) => {
    try {
      // In a real app, this would call our triage API
      console.log('Checking entry for crisis indicators...', text);
    } catch (error) {
      console.error('Error checking crisis indicators:', error);
    }
  };

  const insertEmotionAtCursor = (emotionName) => {
    const textArea = document.getElementById('journal-entry');
    const cursorPosition = textArea.selectionStart;
    const textBefore = entry.substring(0, cursorPosition);
    const textAfter = entry.substring(textArea.selectionEnd);

    const newEntryText = `${textBefore}${emotionName} ${textAfter}`;
    setEntry(newEntryText);
  };

  return (
    <div className="journal-container" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: paperBgColor, // Use lighter shade of the selected color
      background: `linear-gradient(${paperBgColor} 0%, ${paperBgColor} 90%, ${paperLinesColor} 90%, ${paperLinesColor} 100%)`, // Use calculated line color
      backgroundSize: '100% 40px',
      borderRadius: '12px',
      padding: '30px',
      margin: '20px 0',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${paperLinesColor}` // Use calculated border color
    }}>
      {/* Notebook lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `repeating-linear-gradient(
          transparent,
          transparent 39px,
          #e8d8b9 39px,
          #e8d8b9 40px
        )`,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #d4c8a9',
          paddingBottom: '15px',
          position: 'relative'
        }}>
          <h2 style={{
            margin: 0,
            color: '#5d4037',
            fontSize: '1.8em',
            fontFamily: "'Georgia', serif",
            fontWeight: 'bold',
            textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
          }}>
            📝 Daily Journal
          </h2>
          <div style={{
            backgroundColor: '#d4c8a9',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '0.9em',
            fontWeight: '600',
            color: '#5d4037',
            border: '1px solid #bca47e'
          }}>
            Today
          </div>
        </div>

        <div style={{
          marginBottom: '25px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          border: '1px solid #d4c8a9',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#5d4037', fontFamily: "'Georgia', serif" }}>
            <span style={{ fontSize: '1.2em', marginRight: '8px' }}>💡</span>
            Today's writing prompt:
          </p>
          <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: '#6d4c41' }}>
            "{prompt}"
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div className="form-group">
            <label htmlFor="journal-entry" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#5d4037',
              fontFamily: "'Georgia', serif"
            }}>
              Your thoughts:
            </label>
            <textarea
              id="journal-entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              rows="12"
              placeholder="Write about your day, thoughts, and feelings..."
              style={{
                width: '100%',
                padding: '15px 15px 15px 40px', // Extra left padding for margin simulation
                fontSize: '16px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                lineHeight: '1.6',
                border: '2px solid #d4c8a9',
                borderRadius: '4px',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                resize: 'vertical',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 2
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8d6e63';
                e.target.style.boxShadow = '0 0 0 3px rgba(141, 110, 99, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d4c8a9';
                e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
              onContextMenu={(e) => {
                // This will be handled by the EmotionWheel component via event listeners
              }}
            />
          </div>

          {/* Auto-save indicator */}
          {isAutoSaved && (
            <div style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: '4px',
              fontSize: '0.9em',
              border: '1px solid #a5d6a7'
            }}>
              ✅ {autoSaveMessage}
            </div>
          )}

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: '600',
              color: '#5d4037',
              fontFamily: "'Georgia', serif"
            }}>
              Mood: <span style={{ color: mood <= 3 ? '#e74c3c' : mood <= 6 ? '#f39c12' : '#2ecc71', fontWeight: 'bold' }}>{mood}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right,
                  #e74c3c 0%, #e74c3c 10%,
                  #f39c12 10%, #f39c12 60%,
                  #2ecc71 60%, #2ecc71 100%)`,
                outline: 'none',
                WebkitAppearance: 'none',
                border: '1px solid #ddd'
              }}
              onInput={(e) => setMood(parseInt(e.target.value))}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8em',
              color: '#666',
              marginTop: '5px'
            }}>
              <span>1 (Very Bad)</span>
              <span>10 (Very Good)</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#8d6e63',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease, transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6d4c41';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#8d6e63';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Save Entry
            </button>

            <div style={{
              fontSize: '0.9em',
              color: '#7f8c8d',
              fontStyle: 'italic'
            }}>
              All changes auto-saved
            </div>
          </div>
        </form>

        <div className="past-entries" style={{
          borderTop: '2px solid #d4c8a9',
          paddingTop: '25px',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            marginBottom: '20px',
            color: '#5d4037',
            fontSize: '1.3em',
            fontFamily: "'Georgia', serif",
            fontWeight: 'bold'
          }}>Past Entries</h3>
          {savedEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {savedEntries.map((item) => (
                <div
                  key={item.id}
                  className="entry-preview"
                  style={{
                    padding: '20px',
                    border: '1px solid #d4c8a9',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <h4 style={{ margin: 0, color: '#5d4037', fontFamily: "'Georgia', serif" }}>{item.date}</h4>
                    <span style={{
                      backgroundColor: item.mood <= 3 ? '#ffebee' : item.mood <= 6 ? '#fff3e0' : '#e8f5e9',
                      color: item.mood <= 3 ? '#e74c3c' : item.mood <= 6 ? '#f39c12' : '#2ecc71',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '0.9em',
                      border: `1px solid ${item.mood <= 3 ? '#ffcdd2' : item.mood <= 6 ? '#ffe0b2' : '#c8e6c9'}`
                    }}>
                      Mood: {item.mood}/10
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    lineHeight: '1.6',
                    color: '#5d4037',
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: "'Georgia', serif"
                  }}>
                    {item.content.substring(0, 150)}{item.content.length > 150 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              textAlign: 'center',
              color: '#8d6e63',
              fontStyle: 'italic',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              border: '1px dashed #d4c8a9'
            }}>
              No entries yet. Start by writing your first journal entry!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;