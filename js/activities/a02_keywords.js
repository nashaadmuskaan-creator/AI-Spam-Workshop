// Activity 2: Keyword Radar - Manual Feature Selection
import { state, addSpamKeyword, removeSpamKeyword, calculateSpamProbability, saveState } from '../core/state.js';

let messagesTested = 0;

export function initActivity2(container) {
  messagesTested = 0;
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      What words do you see often in spam messages? Think of 5-7 words before typing.
    </div>
    
    <div class="interaction-area">
      <div class="input-group">
        <input 
          type="text" 
          id="keyword-input" 
          placeholder="Type a spam word (e.g., free, win, click)"
        >
        <button class="primary-btn" id="add-kw-btn">
          Add Word
        </button>
      </div>
      
      <div class="keyword-display" id="keyword-list">
        ${renderKeywordList()}
      </div>
    </div>
    
    <div class="result-reveal" style="${state.spamKeywords.length > 0 ? '' : 'display: none;'}" id="test-section">
      <h3>🧪 Test Your Keywords</h3>
      <p>Type a message and see how many spam keywords it contains:</p>
      
      <textarea 
        id="test-message" 
        placeholder="Enter a message to test..."
        rows="3"
        style="width: 100%; margin: 12px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px;"
      ></textarea>
      
      <button class="secondary-btn" id="test-msg-btn">
        Test Message
      </button>
      
      <div id="test-result" style="margin-top: 20px;"></div>
    </div>
    
    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 3 →
    </button>
  `;
  
  setupEventListeners(container);
}

function setupEventListeners(container) {
  const addBtn = container.querySelector('#add-kw-btn');
  const input = container.querySelector('#keyword-input');
  const testBtn = container.querySelector('#test-msg-btn');
  const continueBtn = container.querySelector('#continue-btn');
  
  addBtn.addEventListener('click', () => addKeyword(container));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addKeyword(container);
  });
  
  if (testBtn) {
    testBtn.addEventListener('click', () => testMessage(container));
  }
  
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      // Dispatch the activityComplete event for activity 2
      const event = new CustomEvent('activityComplete', { detail: { activity: 2 } });
      document.dispatchEvent(event);
    });
  }
}

function renderKeywordList() {
  if (state.spamKeywords.length === 0) {
    return '<div class="empty-state">No keywords yet. Add some words you think indicate spam!</div>';
  }
  
  return state.spamKeywords.map(keyword => `
    <span class="keyword-tag">
      ${keyword}
      <span class="remove" onclick="window.removeKeywordHandler('${keyword}')" style="cursor: pointer; margin-left: 8px; font-weight: bold;">×</span>
    </span>
  `).join('');
}

function addKeyword(container) {
  const input = container.querySelector('#keyword-input');
  const keyword = input.value.trim();
  
  if (!keyword) {
    alert('Please type a keyword first!');
    return;
  }
  
  if (addSpamKeyword(keyword)) {
    input.value = '';
    renderActivity(container);
    input.focus();
  } else {
    alert('This keyword already exists!');
  }
}

window.removeKeywordHandler = function(keyword) {
  removeSpamKeyword(keyword);
  const container = document.getElementById('activity-2-content');
  renderActivity(container);
};

function testMessage(container) {
  const textarea = container.querySelector('#test-message');
  const message = textarea.value.trim();
  
  if (!message) {
    alert('Please enter a message to test!');
    return;
  }
  
  const probability = calculateSpamProbability(message);
  const matchedKeywords = state.spamKeywords.filter(kw => 
    message.toLowerCase().includes(kw)
  );
  
  messagesTested++;
  
  const resultDiv = container.querySelector('#test-result');
  resultDiv.innerHTML = `
    <div class="probability-display">
      <div class="probability-label">Spam Probability</div>
      <div class="probability-number">${probability}%</div>
      <p style="color: #64748b; margin-top: 8px;">
        Found ${matchedKeywords.length} spam keyword${matchedKeywords.length !== 1 ? 's' : ''}
      </p>
      ${matchedKeywords.length > 0 ? `
        <div style="margin-top: 16px; text-align: left;">
          <strong>Matched words:</strong> ${matchedKeywords.join(', ')}
        </div>
        <div style="margin-top: 12px; padding: 16px; background: #f8fafc; border-radius: 12px; text-align: left;">
          ${highlightKeywords(message, matchedKeywords)}
        </div>
      ` : ''}
    </div>
    
    <div class="insight-box" style="margin-top: 24px;">
      <h3>💡 Understanding the Score</h3>
      <p>The spam probability is calculated by counting how many of your keywords appear in the message.</p>
      <p><strong>This is a simple version of what AI does!</strong> Real AI systems look at thousands of patterns, not just keyword matches.</p>
    </div>
  `;
  
  // Show continue button after testing at least one message
  const continueBtn = container.querySelector('#continue-btn');
  if (continueBtn && messagesTested > 0) {
    continueBtn.style.display = 'block';
    // Scroll to it smoothly
    setTimeout(() => {
      continueBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }
}

function highlightKeywords(text, keywords) {
  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, '<mark style="background: #fef3c7; padding: 2px 4px; border-radius: 3px;">$1</mark>');
  });
  return result;
}