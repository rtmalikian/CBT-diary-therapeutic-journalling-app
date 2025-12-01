import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [note, setNote] = useState('');
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'trend'

  // Initialize with sample data
  useEffect(() => {
    // In a real app, fetch from API
    const sampleData = [
      { date: new Date(Date.now() - 6*86400000).toISOString().split('T')[0], mood: 6, note: 'Average day' },
      { date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], mood: 7, note: 'Feeling optimistic' },
      { date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], mood: 5, note: 'Stressful day at work' },
      { date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], mood: 8, note: 'Great day with friends' },
      { date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], mood: 4, note: 'Feeling anxious about upcoming event' },
      { date: new Date(Date.now() - 1*86400000).toISOString().split('T')[0], mood: 6, note: 'Getting better' },
      { date: new Date().toISOString().split('T')[0], mood: 7, note: 'Overall good day' }
    ];
    setMoodEntries(sampleData);
  }, []);

  const handleSaveMood = () => {
    if (currentMood < 1 || currentMood > 10) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      note: note
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setNote('');
    console.log('Mood entry saved:', newEntry);
  };

  // Calculate mood statistics
  const calculateStats = () => {
    if (moodEntries.length === 0) return null;

    const moods = moodEntries.map(entry => entry.mood);
    const avgMood = (moods.reduce((sum, mood) => sum + mood, 0) / moods.length).toFixed(1);
    const minMood = Math.min(...moods);
    const maxMood = Math.max(...moods);
    const latestMood = moodEntries[0]?.mood || 0;

    // Calculate 7-day trend
    let trend = 'neutral';
    if (moodEntries.length >= 2) {
      const recentMood = moodEntries[0]?.mood || 0;
      const previousMood = moodEntries[1]?.mood || 0;
      if (recentMood > previousMood) trend = 'positive';
      else if (recentMood < previousMood) trend = 'negative';
    }

    return { avgMood, minMood, maxMood, latestMood, trend };
  };

  const stats = calculateStats();

  // Prepare data for chart visualization
  const moodChartData = moodEntries
    .map(entry => ({ date: entry.date, mood: entry.mood }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort chronologically

  // Render chart based on selected type
  const renderChart = () => {
    if (moodChartData.length === 0) return <p>No data to display</p>;

    if (chartType === 'line') {
      return (
        <div className="mood-chart" style={{ height: '200px', width: '100%', position: 'relative', marginTop: '20px' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${moodChartData.length * 40} 220`}>
            {/* Y-axis labels */}
            <text x="5" y="20" fontSize="12" fill="#666">10</text>
            <text x="5" y="115" fontSize="12" fill="#666">5</text>
            <text x="5" y="210" fontSize="12" fill="#666">1</text>

            {/* Grid lines */}
            <line x1="40" y1="20" x2={moodChartData.length * 40} y2="20" stroke="#eee" />
            <line x1="40" y1="115" x2={moodChartData.length * 40} y2="115" stroke="#eee" />
            <line x1="40" y1="210" x2={moodChartData.length * 40} y2="210" stroke="#eee" />

            {/* Mood line */}
            {moodChartData.map((point, index) => {
              if (index === 0) return null; // Skip first point for line
              const prevPoint = moodChartData[index - 1];
              const x1 = 40 + (index - 1) * 40;
              const y1 = 220 - (prevPoint.mood * 20); // Scale mood to fit chart
              const x2 = 40 + index * 40;
              const y2 = 220 - (point.mood * 20);

              return (
                <line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#4a6fa5"
                  strokeWidth="2"
                />
              );
            })}

            {/* Mood points */}
            {moodChartData.map((point, index) => {
              const x = 40 + index * 40;
              const y = 220 - (point.mood * 20);

              return (
                <g key={`point-${index}`}>
                  <circle cx={x} cy={y} r="5" fill={point.mood <= 3 ? '#e74c3c' : point.mood <= 6 ? '#f39c12' : '#2ecc71'} />
                  <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#333">{point.mood}</text>
                  <text x={x} y="235" textAnchor="middle" fontSize="10" fill="#666">
                    {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className="mood-chart" style={{ height: '200px', width: '100%', position: 'relative', marginTop: '20px' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${moodChartData.length * 35} 220`}>
            {/* Y-axis labels */}
            <text x="5" y="20" fontSize="12" fill="#666">10</text>
            <text x="5" y="115" fontSize="12" fill="#666">5</text>
            <text x="5" y="210" fontSize="12" fill="#666">1</text>

            {/* Grid lines */}
            <line x1="30" y1="20" x2={moodChartData.length * 35} y2="20" stroke="#eee" />
            <line x1="30" y1="115" x2={moodChartData.length * 35} y2="115" stroke="#eee" />
            <line x1="30" y1="210" x2={moodChartData.length * 35} y2="210" stroke="#eee" />

            {/* Mood bars */}
            {moodChartData.map((point, index) => {
              const x = 35 + index * 35;
              const height = point.mood * 20;
              const y = 220 - height;

              return (
                <g key={`bar-${index}`}>
                  <rect
                    x={x}
                    y={y}
                    width="20"
                    height={height}
                    fill={point.mood <= 3 ? '#e74c3c' : point.mood <= 6 ? '#f39c12' : '#2ecc71'}
                    opacity="0.7"
                  />
                  <text x={x + 10} y={y - 5} textAnchor="middle" fontSize="10" fill="#333">
                    {point.mood}
                  </text>
                  <text x={x + 10} y="235" textAnchor="middle" fontSize="10" fill="#666">
                    {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    } else { // trend
      // Calculate trend direction based on recent data
      let trendDirection = 0; // 0 = no change, 1 = up, -1 = down
      if (moodChartData.length >= 2) {
        const currentMood = moodChartData[moodChartData.length - 1].mood;
        const pastMood = moodChartData[0].mood;
        if (pastMood < currentMood) trendDirection = 1;
        else if (pastMood > currentMood) trendDirection = -1;
      }

      return (
        <div className="trend-container" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>
            {trendDirection === 1 ? '↗️' : trendDirection === -1 ? '↘️' : '→'}
          </div>
          <h3>
            {trendDirection === 1 ? 'Improving Trend' :
             trendDirection === -1 ? 'Declining Trend' : 'Stable Trend'}
          </h3>
          <p>
            {trendDirection === 1 ? 'Your mood has been improving over the past week' :
             trendDirection === -1 ? 'Your mood has been declining over the past week' :
             'Your mood has been relatively stable over the past week'}
          </p>
        </div>
      );
    }
  };

  // Calculate weekly average by day of week
  const getWeeklyAverage = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMoods = Array(7).fill().map(() => []);

    moodEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
      dayMoods[dayIndex].push(entry.mood);
    });

    return days.map((day, index) => {
      if (dayMoods[index].length === 0) return { day, avg: 0, count: 0 };
      const avg = dayMoods[index].reduce((sum, mood) => sum + mood, 0) / dayMoods[index].length;
      return { day, avg: parseFloat(avg.toFixed(1)), count: dayMoods[index].length };
    });
  };

  const weeklyData = getWeeklyAverage();

  return (
    <div className="mood-tracker-container" style={{ padding: '1rem' }}>
      <h2>Mood Tracker</h2>

      {/* Mood Statistics */}
      {stats && (
        <div className="mood-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          margin: '1rem 0',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a6fa5' }}>{stats.latestMood}</div>
            <div>Latest Mood</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{stats.avgMood}</div>
            <div>Average Mood</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.minMood}</div>
            <div>Lowest Mood</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{stats.maxMood}</div>
            <div>Highest Mood</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: stats.trend === 'positive' ? '#2ecc71' : stats.trend === 'negative' ? '#e74c3c' : '#95a5a6'
            }}>
              {stats.trend === 'positive' ? '↗' : stats.trend === 'negative' ? '↘' : '→'}
            </div>
            <div>Trend</div>
          </div>
        </div>
      )}

      {/* Mood Input */}
      <div className="mood-input" style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h3>How are you feeling today?</h3>
        <div className="mood-scale" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '1rem 0'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              className={`mood-btn ${currentMood === num ? 'selected' : ''}`}
              onClick={() => setCurrentMood(num)}
              style={{
                backgroundColor: num <= 3 ? '#e74c3c' : num <= 6 ? '#f39c12' : '#2ecc71',
                color: 'white',
                border: currentMood === num ? '2px solid #333' : 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                margin: '0 5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="mood-note">Add a note:</label>
          <textarea
            id="mood-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How are you feeling? What's contributing to your mood?"
            rows="3"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          className="btn"
          onClick={handleSaveMood}
          style={{ marginTop: '1rem' }}
        >
          Save Mood
        </button>
      </div>

      {/* Visualization Controls */}
      <div className="visualization-controls" style={{ marginBottom: '1rem' }}>
        <h3>Mood Visualization</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${chartType === 'line' ? 'btn-active' : 'btn-secondary'}`}
            onClick={() => setChartType('line')}
            style={{
              backgroundColor: chartType === 'line' ? '#4a6fa5' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Line Chart
          </button>
          <button
            className={`btn ${chartType === 'bar' ? 'btn-active' : 'btn-secondary'}`}
            onClick={() => setChartType('bar')}
            style={{
              backgroundColor: chartType === 'bar' ? '#4a6fa5' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Bar Chart
          </button>
          <button
            className={`btn ${chartType === 'trend' ? 'btn-active' : 'btn-secondary'}`}
            onClick={() => setChartType('trend')}
            style={{
              backgroundColor: chartType === 'trend' ? '#4a6fa5' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Trend Analysis
          </button>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Weekly Average by Day */}
      <div className="weekly-breakdown" style={{ marginTop: '2rem' }}>
        <h3>Weekly Mood Average</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {weeklyData.map((dayData, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                margin: '0.5rem',
                padding: '0.5rem',
                border: '1px solid #eee',
                borderRadius: '4px',
                minWidth: '80px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{dayData.day}</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: dayData.avg <= 3 ? '#e74c3c' : dayData.avg <= 6 ? '#f39c12' : '#2ecc71'
              }}>
                {dayData.avg > 0 ? dayData.avg : '--'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {dayData.count} entries
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood History */}
      <div className="mood-history" style={{ marginTop: '2rem' }}>
        <h3>Recent Mood History</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {moodEntries.length > 0 ? (
            moodEntries.map((entry, index) => (
              <div
                key={index}
                className="mood-entry"
                style={{
                  marginBottom: '0.5rem',
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="entry-date" style={{ fontWeight: 'bold' }}>
                      {new Date(entry.date).toDateString()}
                    </span>
                    <span
                      className="entry-mood"
                      style={{
                        marginLeft: '1rem',
                        color: entry.mood <= 3 ? '#e74c3c' : entry.mood <= 6 ? '#f39c12' : '#2ecc71',
                        fontWeight: 'bold'
                      }}
                    >
                      Mood: {entry.mood}/10
                    </span>
                  </div>
                </div>
                <p className="entry-note" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                  "{entry.note}"
                </p>
              </div>
            ))
          ) : (
            <p>No mood entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;