const express = require('express');
const router = express.Router();

// Mock journal entries database (in a real app, this would be a real database)
let journalEntries = [
  { 
    id: 1, 
    userId: 1, 
    date: new Date().toISOString().split('T')[0], 
    content: 'Today was a good day. I felt happy and accomplished.', 
    mood: 8,
    emotions: ['joy', 'contentment']
  }
];

// Get all journal entries for a user
router.get('/', (req, res) => {
  const userId = req.query.userId || 1; // In a real app, get from token
  const userEntries = journalEntries.filter(entry => entry.userId === userId);
  res.json({ entries: userEntries });
});

// Get journal entries for AI prompt analysis (last 10 entries)
router.get('/for-ai-analysis/:userId', (req, res) => {
  const userId = parseInt(req.params.userId) || 1; // In a real app, get from token
  const userEntries = [...journalEntries]
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
    .slice(0, 10); // Get last 10 entries

  res.json({ entries: userEntries });
});

// Create a new journal entry
router.post('/', (req, res) => {
  const { content, mood, emotions } = req.body;
  const userId = req.body.userId || 1; // In a real app, get from token
  
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  
  const newEntry = {
    id: journalEntries.length + 1,
    userId,
    date: new Date().toISOString().split('T')[0],
    content,
    mood: mood || 5,
    emotions: emotions || []
  };
  
  journalEntries.push(newEntry);
  res.status(201).json({ message: 'Journal entry created', entry: newEntry });
});

// Update a journal entry
router.put('/:id', (req, res) => {
  const entryId = parseInt(req.params.id);
  const { content, mood, emotions } = req.body;
  
  const entryIndex = journalEntries.findIndex(entry => entry.id === entryId);
  if (entryIndex === -1) {
    return res.status(404).json({ message: 'Entry not found' });
  }
  
  // In a real app, verify the user owns this entry
  journalEntries[entryIndex] = {
    ...journalEntries[entryIndex],
    content: content || journalEntries[entryIndex].content,
    mood: mood !== undefined ? mood : journalEntries[entryIndex].mood,
    emotions: emotions || journalEntries[entryIndex].emotions
  };
  
  res.json({ message: 'Journal entry updated', entry: journalEntries[entryIndex] });
});

// Delete a journal entry
router.delete('/:id', (req, res) => {
  const entryId = parseInt(req.params.id);
  
  const entryIndex = journalEntries.findIndex(entry => entry.id === entryId);
  if (entryIndex === -1) {
    return res.status(404).json({ message: 'Entry not found' });
  }
  
  // In a real app, verify the user owns this entry
  journalEntries.splice(entryIndex, 1);
  res.json({ message: 'Journal entry deleted' });
});

module.exports = router;