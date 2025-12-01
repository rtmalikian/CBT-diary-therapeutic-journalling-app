const express = require('express');
const router = express.Router();

// PMR (Progressive Muscle Relaxation) exercise data
const pmrExercises = [
  {
    id: 1,
    name: 'Full Body PMR',
    description: 'A complete progressive muscle relaxation session for all major muscle groups',
    muscleGroups: [
      'hands-fists', 'arms-shoulders', 'face-jaw', 'chest-back', 
      'abdomen', 'thighs', 'calves-feet'
    ],
    duration: 600, // 10 minutes in seconds
    steps: 32 // Total steps in the full session
  },
  {
    id: 2,
    name: 'Hands & Fists',
    description: 'Focus on tension and relaxation of hands and fists',
    muscleGroups: ['hands-fists'],
    duration: 180, // 3 minutes in seconds
    steps: 8
  },
  {
    id: 3,
    name: 'Face & Jaw',
    description: 'Focus on tension and relaxation of facial muscles and jaw',
    muscleGroups: ['face-jaw'],
    duration: 150, // 2.5 minutes in seconds
    steps: 8
  },
  {
    id: 4,
    name: 'Arms & Shoulders',
    description: 'Focus on tension and relaxation of arms and shoulders',
    muscleGroups: ['arms-shoulders'],
    duration: 240, // 4 minutes in seconds
    steps: 12
  }
];

// PMR session history (in a real app, this would be stored in a database)
let pmrSessionHistory = [];

// Get all PMR exercises
router.get('/', (req, res) => {
  res.json({ exercises: pmrExercises });
});

// Get specific PMR exercise by ID
router.get('/:id', (req, res) => {
  const exerciseId = parseInt(req.params.id);
  const exercise = pmrExercises.find(e => e.id === exerciseId);
  
  if (exercise) {
    res.json(exercise);
  } else {
    res.status(404).json({ message: 'Exercise not found' });
  }
});

// Get PMR exercise by name
router.get('/name/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const exercise = pmrExercises.find(e => 
    e.name.toLowerCase().includes(name) || name.includes(e.name.toLowerCase())
  );
  
  if (exercise) {
    res.json(exercise);
  } else {
    res.status(404).json({ message: 'Exercise not found' });
  }
});

// Save a completed PMR session
router.post('/session', (req, res) => {
  const { userId, exerciseId, duration, completedSteps, rating, notes } = req.body;
  
  if (!userId || !exerciseId) {
    return res.status(400).json({ message: 'User ID and Exercise ID are required' });
  }
  
  const newSession = {
    id: pmrSessionHistory.length + 1,
    userId,
    exerciseId,
    date: new Date().toISOString(),
    duration,
    completedSteps,
    rating: rating || null,
    notes: notes || ''
  };
  
  pmrSessionHistory.push(newSession);
  res.status(201).json({ message: 'Session saved', session: newSession });
});

// Get user's PMR session history
router.get('/history/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userSessions = pmrSessionHistory.filter(session => session.userId === userId);
  
  res.json({ sessions: userSessions });
});

// Get PMR resources and information
router.get('/resources', (req, res) => {
  const resources = {
    introduction: "Progressive Muscle Relaxation (PMR) is a relaxation technique that helps you reduce anxiety by systematically tensing and relaxing different muscle groups.",
    benefits: [
      "Reduces physical tension and stress",
      "Decreases anxiety and worry",
      "Improves sleep quality",
      "Increases awareness of physical sensations",
      "Helps manage pain"
    ],
    instructions: [
      "Find a quiet, comfortable place to sit or lie down",
      "Start with your feet and work your way up to your head",
      "Tense each muscle group for 5 seconds",
      "Relax the muscles for 10-20 seconds",
      "Focus on the difference between tension and relaxation"
    ],
    tips: [
      "Practice at the same time each day",
      "Start with shorter sessions and gradually increase",
      "Focus on your breathing during relaxation phases",
      "Don't worry if you miss a muscle group - just continue",
      "Practice regularly for best results"
    ]
  };
  
  res.json(resources);
});

module.exports = router;