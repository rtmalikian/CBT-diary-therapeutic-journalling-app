// AI/ML utilities for personalized writing prompts
// This simulates AI/ML functionality that could be enhanced with actual ML models

// Keywords that indicate certain themes in journal entries
const themeKeywords = {
  anxiety: ['worried', 'nervous', 'stressed', 'anxious', 'overwhelmed', 'panic', 'fear'],
  gratitude: ['thankful', 'grateful', 'appreciate', 'blessed', 'lucky', 'fortunate'],
  relationship: ['friend', 'family', 'partner', 'spouse', 'child', 'mother', 'father', 'sibling', 'colleague'],
  work: ['work', 'job', 'career', 'colleagues', 'boss', 'meeting', 'project', 'task'],
  health: ['health', 'doctor', 'tired', 'energy', 'sick', 'pain', 'medicine', 'exercise'],
  accomplishment: ['achieved', 'accomplished', 'succeeded', 'goal', 'milestone', 'progress', 'proud'],
  sadness: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'heartbroken', 'grief'],
  conflict: ['argued', 'fight', 'disagreement', 'problem', 'tension', 'dispute', 'frustrated'],
  growth: ['learned', 'improved', 'grew', 'developed', 'changed', 'better', 'evolved', 'insight']
};

// Generic prompts that can be personalized
const genericPrompts = [
  "What are you grateful for today?",
  "What challenge did you face and how did you handle it?",
  "What is one thing you could have handled differently today?",
  "What are some positive changes you've noticed in yourself recently?",
  "What situation made you feel anxious today and why?",
  "What accomplishment, no matter how small, are you proud of today?",
  "What negative thought did you challenge today?",
  "What self-care activity did you engage in today?",
  "What thought patterns did you notice today?",
  "How did your mood change throughout the day?"
];

// Mood-based prompts
const moodBasedPrompts = {
  low: [
    "What's one small thing that brought you a moment of joy today?",
    "What are three things you appreciate about yourself?",
    "What's a challenge you overcame in the past that gives you strength?",
    "What are some things you're looking forward to?"
  ],
  medium: [
    "What are you looking forward to tomorrow?",
    "What did you learn about yourself today?",
    "What would you like to improve about tomorrow?",
    "How did you grow today?"
  ],
  high: [
    "What contributed to your positive mood today?",
    "How can you maintain this positive energy?",
    "What are you most proud of from today?",
    "How can you share your positive energy with others?"
  ]
};

// Generate a personalized prompt based on previous entries
function generatePersonalizedPrompt(entries) {
  if (!entries || entries.length === 0) {
    // If no previous entries, return a random generic prompt
    return genericPrompts[Math.floor(Math.random() * genericPrompts.length)];
  }

  // Analyze the entries for common themes
  const allText = entries.map(entry => entry.content.toLowerCase()).join(' ');
  const detectedThemes = [];
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    let count = 0;
    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        count++;
      }
    }
    if (count > 0) {
      detectedThemes.push({ theme, count });
    }
  }
  
  // Sort themes by frequency
  detectedThemes.sort((a, b) => b.count - a.count);
  
  // Get the most common theme
  const mostCommonTheme = detectedThemes.length > 0 ? detectedThemes[0].theme : null;
  
  // Generate a prompt based on the detected theme
  if (mostCommonTheme) {
    switch (mostCommonTheme) {
      case 'anxiety':
        return "What strategies helped you manage your anxiety today? What worked well?";
      case 'gratitude':
        return "What made you feel most grateful recently? How can you cultivate more of these experiences?";
      case 'relationship':
        return "How are your relationships with others affecting your well-being? What changes could improve them?";
      case 'work':
        return "How is your work-life balance? What adjustments could help you feel more fulfilled?";
      case 'health':
        return "How is your physical health affecting your mental well-being? What steps can you take toward better health?";
      case 'accomplishment':
        return "What recent accomplishment are you most proud of? How can you build on this success?";
      case 'sadness':
        return "What brought you moments of happiness despite feeling down? What support do you need?";
      case 'conflict':
        return "How did you handle the conflict? What could you do differently in a similar situation?";
      case 'growth':
        return "What recent changes have contributed to your personal growth? How do you feel about this progress?";
      default:
        // If we can't match to a specific theme, return a random generic prompt
        return genericPrompts[Math.floor(Math.random() * genericPrompts.length)];
    }
  }
  
  // If no themes detected, return a random generic prompt
  return genericPrompts[Math.floor(Math.random() * genericPrompts.length)];
}

// Generate a prompt based on average mood
function generateMoodBasedPrompt(entries) {
  if (!entries || entries.length === 0) {
    return genericPrompts[Math.floor(Math.random() * genericPrompts.length)];
  }
  
  // Calculate average mood
  const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
  
  // Select mood category
  let moodCategory;
  if (avgMood <= 3) {
    moodCategory = 'low';
  } else if (avgMood <= 7) {
    moodCategory = 'medium';
  } else {
    moodCategory = 'high';
  }
  
  // Get mood-based prompt
  const prompts = moodBasedPrompts[moodCategory];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Main function to get personalized prompt
function getPersonalizedPrompt(entries, method = 'theme') {
  switch (method) {
    case 'theme':
      return generatePersonalizedPrompt(entries);
    case 'mood':
      return generateMoodBasedPrompt(entries);
    case 'hybrid':
      // Use both methods and randomly select
      const themePrompt = generatePersonalizedPrompt(entries);
      const moodPrompt = generateMoodBasedPrompt(entries);
      return Math.random() > 0.5 ? themePrompt : moodPrompt;
    default:
      return generatePersonalizedPrompt(entries);
  }
}

module.exports = {
  generatePersonalizedPrompt,
  generateMoodBasedPrompt,
  getPersonalizedPrompt
};