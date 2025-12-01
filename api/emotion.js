const express = require('express');
const router = express.Router();

// Emotion data (positive and negative emotions with intensities)
const emotionData = {
  positive: [
    { name: 'Joy', intensity: 'high', description: 'A feeling of great pleasure and happiness' },
    { name: 'Contentment', intensity: 'medium', description: 'A state of satisfaction with one\'s circumstances' },
    { name: 'Pride', intensity: 'medium', description: 'A feeling of satisfaction over one\'s achievements' },
    { name: 'Amusement', intensity: 'low', description: 'The state of being entertained or diverted' },
    { name: 'Hope', intensity: 'medium', description: 'A feeling of expectation and desire for a certain thing to happen' },
    { name: 'Gratitude', intensity: 'high', description: 'The quality of being thankful; readiness to show appreciation' },
    { name: 'Love', intensity: 'high', description: 'An intense feeling of deep affection' },
    { name: 'Peace', intensity: 'medium', description: 'Freedom from disturbance; tranquility' },
    { name: 'Excitement', intensity: 'high', description: 'A feeling of enthusiasm and eagerness' },
    { name: 'Inspired', intensity: 'medium', description: 'Filled with the urge to do or feel something' },
    { name: 'Cheerful', intensity: 'low', description: 'Noticeably happy and optimistic' },
    { name: 'Optimistic', intensity: 'medium', description: 'Hopeful and confident about the future' }
  ],
  negative: [
    { name: 'Anger', intensity: 'high', description: 'A strong feeling of annoyance, displeasure, or hostility' },
    { name: 'Anxiety', intensity: 'high', description: 'A feeling of worry, nervousness, or unease' },
    { name: 'Sadness', intensity: 'medium', description: 'The emotion of being sad; sorrow' },
    { name: 'Guilt', intensity: 'medium', description: 'A feeling of responsibility or remorse for some offense' },
    { name: 'Shame', intensity: 'high', description: 'A painful feeling of humiliation or distress' },
    { name: 'Frustration', intensity: 'medium', description: 'Feeling of being upset or annoyed as a result of inability to change something' },
    { name: 'Disgust', intensity: 'high', description: 'A feeling of revulsion or strong disapproval' },
    { name: 'Fear', intensity: 'high', description: 'An unpleasant emotion caused by the threat of danger' },
    { name: 'Envy', intensity: 'low', description: 'A feeling of discontented or resentful longing aroused by someone else\'s possessions' },
    { name: 'Loneliness', intensity: 'medium', description: 'Sadness because one has no friends or company' },
    { name: 'Disappointment', intensity: 'low', description: 'Sadness or displeasure caused by failure to fulfill hopes or expectations' },
    { name: 'Despair', intensity: 'high', description: 'Complete loss or absence of hope' }
  ]
};

// Get emotion data
router.get('/', (req, res) => {
  res.json(emotionData);
});

// Get specific emotion by name
router.get('/:name', (req, res) => {
  const emotionName = req.params.name.toLowerCase();
  
  for (const category in emotionData) {
    const emotion = emotionData[category].find(e => e.name.toLowerCase() === emotionName);
    if (emotion) {
      res.json({ ...emotion, category });
      return;
    }
  }
  
  res.status(404).json({ message: 'Emotion not found' });
});

// Get emotions by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  
  if (emotionData[category]) {
    res.json({ category, emotions: emotionData[category] });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

module.exports = router;