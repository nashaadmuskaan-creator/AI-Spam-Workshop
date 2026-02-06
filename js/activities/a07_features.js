// Activity 7: Feature Selection - Choosing Important Words
import { state, saveState } from '../core/state.js';

const sampleMessages = [
  { text: "FREE PRIZE! Click now to claim your reward!", category: "spam" },
  { text: "Can you send me the homework for tomorrow?", category: "normal" },
  { text: "URGENT: Your account needs verification immediately!", category: "spam" },
  { text: "Meeting moved to 3 PM in Room 204", category: "normal" },
  { text: "Congratulations! You've won $1000! Act fast!", category: "spam" }
];

let selectedFeatures = new Set();
let confidenceScore = 0;

export function initActivity7(container) {
  selectedFeatures = new Set();
  confidenceScore = 0;
  renderActivity(container);
}

function renderActivity(container) {
  // Extract all unique words from sample messages
  const allWords = new Set();
  sampleMessages.forEach(msg => {
    const words = msg.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) allWords.add(word);
    });
  });

  const wordArray = Array.from(allWords).sort();

  container.innerHTML = `
    <div class="think-prompt">
      Do all words matter equally when detecting spam? Which words carry more weight?
    </div>

    <div class="interaction-area">
      <h3>Sample Messages:</h3>
      <div style="background: white; padding: 20px; border-radius: 12px; margin: 16px 0;">
        ${sampleMessages.map((msg, idx) => `
          <div style="padding: 12px; margin: 8px 0; border-left: 4px solid ${msg.category === 'spam' ? '#ef4444' : '#10b981'}; background: ${msg.category === 'spam' ? '#fef2f2' : '#f0fdf4'}; border-radius: 8px;">
            <strong>${msg.category === 'spam' ? '🚫 SPAM' : '✅ NORMAL'}:</strong> ${msg.text}
          </div>
        `).join('')}
      </div>

      <h3 style="margin-top: 24px;">Select words you think are MOST important for detecting spam:</h3>
      <p style="color: #64748b; font-size: 0.9rem;">Click on words to select them as features. Choose 5-8 words.</p>
      
      <div id="word-selector" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; padding: 20px; background: white; border-radius: 12px;">
        ${wordArray.map(word => `
          <button 
            class="word-select-btn" 
            data-word="${word}"
            style="padding: 10px 16px; border: 2px solid #e2e8f0; background: white; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
          >
            ${word}
          </button>
        `).join('')}
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <p style="font-weight: 600; font-size: 1.1rem;">
          Selected Features: <span id="feature-count" style="color: var(--accent);">0</span>
        </p>
      </div>

      <button class="primary-btn" id="test-features-btn" style="display: none; margin-top: 16px; width: 100%;">
        Test These Features
      </button>
    </div>

    <div id="results-section" style="display: none;"></div>

    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 8 →
    </button>
  `;

  setupEventListeners(container);
}

function setupEventListeners(container) {
  const wordButtons = container.querySelectorAll('.word-select-btn');
  const testBtn = container.querySelector('#test-features-btn');
  const continueBtn = container.querySelector('#continue-btn');
  const featureCount = container.querySelector('#feature-count');

  wordButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const word = btn.dataset.word;
      
      if (selectedFeatures.has(word)) {
        selectedFeatures.delete(word);
        btn.style.background = 'white';
        btn.style.borderColor = '#e2e8f0';
        btn.style.color = '#334155';
      } else {
        selectedFeatures.add(word);
        btn.style.background = 'var(--accent)';
        btn.style.borderColor = 'var(--accent)';
        btn.style.color = 'white';
      }

      featureCount.textContent = selectedFeatures.size;

      // Show test button when at least 5 features selected
      if (selectedFeatures.size >= 5) {
        testBtn.style.display = 'block';
      } else {
        testBtn.style.display = 'none';
      }
    });
  });

  testBtn.addEventListener('click', () => showResults(container));
  continueBtn.addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 7 } });
    document.dispatchEvent(event);
  });
}

function showResults(container) {
  // Calculate confidence based on selected features
  const importantWords = ['free', 'prize', 'click', 'urgent', 'won', 'claim', 'act', 'fast', 'congratulations'];
  const selectedImportant = Array.from(selectedFeatures).filter(w => importantWords.includes(w));
  
  confidenceScore = Math.min(95, 50 + (selectedImportant.length * 8));

  const resultsSection = container.querySelector('#results-section');
  resultsSection.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>🎯 Model Confidence</h3>
      <div class="probability-display">
        <div class="probability-label">Classification Confidence</div>
        <div class="probability-number">${confidenceScore}%</div>
        <p style="color: #64748b; margin-top: 8px;">
          You selected ${selectedImportant.length} high-impact features
        </p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h4 style="color: var(--accent); margin-bottom: 12px;">Feature Importance:</h4>
        ${Array.from(selectedFeatures).map(word => {
          const importance = importantWords.includes(word) ? 'High' : 'Medium';
          const color = importantWords.includes(word) ? '#10b981' : '#f59e0b';
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="font-weight: 500;">${word}</span>
              <span style="color: ${color}; font-weight: 600;">${importance}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="insight-box" style="margin-top: 24px;">
      <h3>💡 Understanding Features</h3>
      <p><strong>Some words carry more weight than others.</strong></p>
      <p>Words like "free", "prize", "urgent", and "click" appear much more often in spam than in normal messages. These become <strong>strong features</strong> that increase the model's confidence.</p>
      <p>Other words like "the", "and", "is" appear equally in both spam and normal messages, so they're less useful as features.</p>
      <p style="margin-top: 16px;"><strong>This is called feature importance</strong> — identifying which data points matter most for making accurate predictions.</p>
    </div>
  `;

  resultsSection.style.display = 'block';
  container.querySelector('#continue-btn').style.display = 'block';
  
  // Smooth scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}