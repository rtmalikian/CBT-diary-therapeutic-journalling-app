const express = require('express');
const router = express.Router();

// Breathing exercise data
const breathingExercises = [
  {
    id: 1,
    name: '4-7-8 Breathing',
    description: 'Inhale for 4 counts, hold for 7 counts, exhale for 8 counts',
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    },
    durationOptions: [60, 120, 300] // in seconds
  },
  {
    id: 2,
    name: 'Box Breathing',
    description: 'Equal counts for inhale, hold, exhale, and hold',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      hold2: 4
    },
    durationOptions: [60, 120, 300]
  },
  {
    id: 3,
    name: 'Diaphragmatic Breathing',
    description: 'Focus on breathing deeply into your diaphragm',
    pattern: {
      inhale: 5,
      exhale: 5
    },
    durationOptions: [60, 120, 300]
  }
];

// Get all breathing exercises
router.get('/', (req, res) => {
  res.json({ exercises: breathingExercises });
});

// Get specific breathing exercise by ID
router.get('/:id', (req, res) => {
  const exerciseId = parseInt(req.params.id);
  const exercise = breathingExercises.find(e => e.id === exerciseId);
  
  if (exercise) {
    res.json(exercise);
  } else {
    res.status(404).json({ message: 'Exercise not found' });
  }
});

// Get breathing exercise by name
router.get('/name/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const exercise = breathingExercises.find(e => 
    e.name.toLowerCase().includes(name) || name.includes(e.name.toLowerCase())
  );
  
  if (exercise) {
    res.json(exercise);
  } else {
    res.status(404).json({ message: 'Exercise not found' });
  }
});

// Get default breathing settings
router.get('/default/settings', (req, res) => {
  res.json({
    defaultExercise: breathingExercises[0],
    defaultDuration: 60,
    defaultVisual: 'circle'
  });
});

module.exports = router;