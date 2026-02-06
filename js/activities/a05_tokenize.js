// Activity 5: AI Cannot Read - Tokenization
import { state, saveState } from '../core/state.js';

let tokensShown = false;

export function initActivity5(container) {
  tokensShown = false;
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      How does a computer understand sentences? Can it read like you do?
    </div>
    
    <div class="interaction-area">
      <h3>Type a sentence and watch it break apart:</h3>
      <textarea 
        id="tokenize-input" 
        placeholder="Enter a sentence..."
        rows="3"
        style="width: 100%; margin: 12px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px;"
      ></textarea>
      <button class="primary-btn" id="tokenize-btn">Break Into Tokens</button>
      
      <div id="token-display" style="margin-top: 24px;"></div>
    </div>
    
    <div class="insight-box" style="margin-top: 24px; display: none;" id="tokenize-insight">
      <h3>💡 Key Insight</h3>
      <p><strong>AI does not see sentences. It only sees pieces.</strong></p>
      <p>Every word becomes a separate token. AI has no concept of grammar, meaning, or context — just individual word pieces.</p>
      <p style="margin-top: 16px;">This process is called <strong>tokenization</strong>. It's the first step in how AI processes language.</p>
    </div>
    
    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 6 →
    </button>
  `;

  setupEventListeners(container);
}

function setupEventListeners(container) {
  const tokenizeBtn = container.querySelector('#tokenize-btn');
  const input = container.querySelector('#tokenize-input');
  const continueBtn = container.querySelector('#continue-btn');

  tokenizeBtn.addEventListener('click', () => tokenizeText(container));
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) tokenizeText(container);
  });

  continueBtn.addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 5 } });
    document.dispatchEvent(event);
  });
}

function tokenizeText(container) {
  const input = container.querySelector('#tokenize-input');
  const text = input.value.trim();
  
  if (!text) {
    alert('Please enter a sentence first!');
    return;
  }

  const tokens = text.split(/\s+/);
  const display = container.querySelector('#token-display');
  const insight = container.querySelector('#tokenize-insight');
  const continueBtn = container.querySelector('#continue-btn');
  
  display.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 12px;">
      <h3 style="margin-bottom: 16px;">Tokens (${tokens.length} pieces):</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px;">
        ${tokens.map((token, idx) => `
          <div style="background: var(--accent); color: white; padding: 12px 20px; border-radius: 10px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.1); animation: fadeIn 0.3s ease ${idx * 0.1}s both;">
            ${escapeHtml(token)}
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px;">
        <p style="font-weight: 600; margin-bottom: 8px; color: #475569;">What happened:</p>
        <ol style="margin-left: 20px; color: #64748b; line-height: 1.8;">
          <li>Your sentence was split at spaces</li>
          <li>Each word became a separate "token"</li>
          <li>Punctuation stayed attached to words</li>
          <li>AI will process each token independently</li>
        </ol>
      </div>
    </div>
  `;

  insight.style.display = 'block';
  tokensShown = true;
  continueBtn.style.display = 'block';

  setTimeout(() => {
    display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);