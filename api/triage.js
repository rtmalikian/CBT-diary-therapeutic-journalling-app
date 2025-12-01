const express = require('express');
const router = express.Router();

// Crisis keywords and phrases for detection
const crisisKeywords = {
  selfHarm: [
    'kill myself', 'end my life', 'suicide', 'self-harm', 
    'hurt myself', 'no reason to live', 'better off dead',
    'want to die', 'take my life', 'harm myself'
  ],
  harmOthers: [
    'kill someone', 'hurt someone', 'violence', 'murder',
    'attack someone', 'hurt people', 'kill people', 'harm others'
  ],
  elderAbuse: [
    'abuse', 'neglect', 'elder abuse', 'hurt elderly',
    'elderly abuse', 'neglect elderly', 'hurt senior'
  ],
  childAbuse: [
    'child abuse', 'hurt child', 'abuse child', 'child neglect',
    'neglect child', 'hurt children', 'abuse children'
  ]
};

// Crisis resources by category
const crisisResources = {
  general: [
    { name: 'National Suicide Prevention Lifeline', contact: '988', description: '24/7 crisis support' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', description: 'Free, 24/7 crisis counseling' },
    { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233', description: 'Confidential support' }
  ],
  selfHarm: [
    { name: 'National Suicide Prevention Lifeline', contact: '988', description: '24/7 crisis support' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', description: 'Free, 24/7 crisis counseling' },
    { name: 'Trevor Project (LGBTQ+)', contact: '1-866-488-7386', description: 'LGBTQ+ suicide prevention' }
  ],
  harmOthers: [
    { name: 'Local Police Emergency', contact: '911', description: 'Immediate danger to others' },
    { name: 'Local Crisis Intervention', contact: 'Find local services', description: 'For threats of harm to others' }
  ],
  elderAbuse: [
    { name: 'Elder Abuse Hotline', contact: '1-800-677-1116', description: 'Report elder abuse' },
    { name: 'Adult Protective Services', contact: 'Local services', description: 'Varies by location' }
  ],
  childAbuse: [
    { name: 'Childhelp National Child Abuse Hotline', contact: '1-800-422-4453', description: '24/7 support' },
    { name: 'Report to CPS', contact: 'Local Child Protective Services', description: 'Varies by location' }
  ]
};

// Analyze text for crisis indicators
function analyzeCrisisText(text) {
  const lowerText = text.toLowerCase();
  const detectedCategories = [];
  
  // Check for each category of crisis keywords
  for (const [category, keywords] of Object.entries(crisisKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        detectedCategories.push(category);
        break; // Don't add the same category multiple times
      }
    }
  }
  
  // Determine risk level based on detected categories
  let riskLevel = 'low';
  if (detectedCategories.some(cat => ['selfHarm', 'harmOthers'].includes(cat))) {
    riskLevel = 'high';
  } else if (detectedCategories.length > 0) {
    riskLevel = 'medium';
  }
  
  // Return analysis results
  return {
    detectedCategories,
    riskLevel,
    hasCrisisIndicators: detectedCategories.length > 0,
    resources: detectedCategories.length > 0 
      ? [...new Set(detectedCategories.flatMap(cat => crisisResources[cat] || crisisResources.general))]
      : crisisResources.general
  };
}

// Endpoint to analyze text for crisis indicators
router.post('/analyze', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required for analysis' });
  }
  
  const analysis = analyzeCrisisText(text);
  
  res.json({
    analysis,
    message: analysis.hasCrisisIndicators 
      ? `Crisis indicators detected (${analysis.riskLevel} risk). Resources provided.` 
      : 'No crisis indicators detected'
  });
});

// Get crisis resources
router.get('/resources', (req, res) => {
  res.json(crisisResources);
});

// Get crisis resources by category
router.get('/resources/:category', (req, res) => {
  const category = req.params.category;
  
  if (crisisResources[category]) {
    res.json({ category, resources: crisisResources[category] });
  } else {
    res.status(404).json({ message: 'Resource category not found' });
  }
});

// Simulate a crisis check on a journal entry
router.post('/safety-check', (req, res) => {
  const { entry } = req.body;
  
  if (!entry) {
    return res.status(400).json({ message: 'Journal entry is required for safety check' });
  }
  
  const analysis = analyzeCrisisText(entry);
  
  // Prepare response based on risk level
  let response = {
    isSafe: !analysis.hasCrisisIndicators,
    riskLevel: analysis.riskLevel,
    detectedCategories: analysis.detectedCategories,
    resources: analysis.resources
  };
  
  // For high-risk situations, add additional warnings
  if (analysis.riskLevel === 'high') {
    response.urgent = true;
    response.warning = 'This content indicates potential immediate danger. Please contact emergency services at 911 if you or someone else is in immediate danger.';
  }
  
  res.json(response);
});

module.exports = router;