// Application state management
export const state = {
  currentHour: 1,
  completedActivities: [],
  spamKeywords: [],
  normalKeywords: [],
  dataset: {
    spam: [],
    normal: []
  },
  userDecisions: [],
  modelTrained: false,
  testResults: []
};

// Save state to localStorage
export function saveState() {
  try {
    localStorage.setItem('workshopState', JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

// Load state from localStorage
export function loadState() {
  try {
    const saved = localStorage.getItem('workshopState');
    if (saved) {
      Object.assign(state, JSON.parse(saved));
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
}

// Mark activity as complete
export function markActivityComplete(activityId) {
  if (!state.completedActivities.includes(activityId)) {
    state.completedActivities.push(activityId);
    saveState();
  }
}

// Check if activity is completed
export function isActivityCompleted(activityId) {
  return state.completedActivities.includes(activityId);
}

// Add spam keyword
export function addSpamKeyword(keyword) {
  const lower = keyword.toLowerCase().trim();
  if (lower && !state.spamKeywords.includes(lower)) {
    state.spamKeywords.push(lower);
    saveState();
    return true;
  }
  return false;
}

// Remove spam keyword
export function removeSpamKeyword(keyword) {
  const index = state.spamKeywords.indexOf(keyword.toLowerCase());
  if (index > -1) {
    state.spamKeywords.splice(index, 1);
    saveState();
  }
}

// Add training data
export function addTrainingData(text, category) {
  state.dataset[category].push({
    text: text,
    addedAt: new Date().toISOString()
  });
  saveState();
}

// Calculate spam probability based on keywords
export function calculateSpamProbability(text) {
  if (state.spamKeywords.length === 0) return 0;
  
  const lowerText = text.toLowerCase();
  let matches = 0;
  
  state.spamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      matches++;
    }
  });
  
  return Math.round((matches / state.spamKeywords.length) * 100);
}

// Reset state
export function resetState() {
  state.completedActivities = [];
  state.spamKeywords = [];
  state.normalKeywords = [];
  state.dataset = { spam: [], normal: [] };
  state.userDecisions = [];
  state.modelTrained = false;
  state.testResults = [];
  saveState();
}

// Initialize state on load
loadState();