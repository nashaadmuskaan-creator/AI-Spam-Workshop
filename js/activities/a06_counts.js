// Activity 6: Words Become Numbers - Vectorization
import { state, saveState } from '../core/state.js';

let hasCountedWords = false;

export function initActivity6(container) {
  hasCountedWords = false;
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      How many times does each word appear? Why would that matter to AI?
    </div>
    
    <div class="interaction-area">
      <h3>Enter a message to analyze:</h3>
      <textarea 
        id="count-input" 
        placeholder="Type a spam or normal message..."
        rows="3"
        style="width: 100%; margin: 12px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px;"
      ></textarea>
      <button class="primary-btn" id="count-btn">Count Words</button>
      
      <div id="count-display" style="margin-top: 24px;"></div>
    </div>
    
    <div class="insight-box" style="margin-top: 24px; display: none;" id="count-insight">
      <h3>💡 Understanding Word Counts</h3>
      <p><strong>AI thinks using numbers, not words.</strong></p>
      <p>By counting word frequency, AI converts language into mathematical data it can process. This is called <strong>vectorization</strong>.</p>
      <p style="margin-top: 12px;">Words that appear more often in spam (like "free", "win", "click") will have higher counts in spam messages. AI uses these patterns to make predictions.</p>
    </div>
    
    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Complete Hour 2 →
    </button>
  `;

  setupEventListeners(container);
}

function setupEventListeners(container) {
  const countBtn = container.querySelector('#count-btn');
  const input = container.querySelector('#count-input');
  const continueBtn = container.querySelector('#continue-btn');

  countBtn.addEventListener('click', () => countWords(container));
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) countWords(container);
  });

  continueBtn.addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 6 } });
    document.dispatchEvent(event);
  });
}

function countWords(container) {
  const input = container.querySelector('#count-input');
  const text = input.value.trim();
  
  if (!text) {
    alert('Please enter a message first!');
    return;
  }

  // Tokenize and count
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const frequency = {};
  
  words.forEach(word => {
    if (word && word.length > 0) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Sort by frequency (descending)
  const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(frequency));

  const display = container.querySelector('#count-display');
  const insight = container.querySelector('#count-insight');
  const continueBtn = container.querySelector('#continue-btn');

  display.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 12px;">
      <h3 style="margin-bottom: 16px;">Word Frequency Table:</h3>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <p style="font-weight: 600; margin-bottom: 8px;">Total Words: <span style="color: var(--accent);">${words.length}</span></p>
        <p style="font-weight: 600;">Unique Words: <span style="color: var(--accent);">${sorted.length}</span></p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <th style="text-align: left; padding: 12px; font-weight: 600; color: #475569;">Word</th>
            <th style="text-align: center; padding: 12px; font-weight: 600; color: #475569;">Count</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: #475569;">Visual</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(([word, count]) => {
            const percentage = (count / maxCount) * 100;
            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px; font-weight: 500;">${escapeHtml(word)}</td>
                <td style="padding: 12px; text-align: center; font-weight: 700; color: var(--accent); font-size: 1.1rem;">${count}</td>
                <td style="padding: 12px; text-align: right;">
                  <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                    <div style="background: var(--accent); height: 24px; border-radius: 4px; width: ${percentage}%; min-width: 20px; transition: width 0.5s ease;"></div>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 10px; border-left: 4px solid var(--accent);">
        <h4 style="color: var(--accent); margin-bottom: 12px;">🔢 From Words to Numbers</h4>
        <p style="color: #334155; line-height: 1.7;">
          This frequency table is how AI "sees" your message. Each word becomes a number. 
          The AI can now compare these numbers to patterns it learned from training data.
        </p>
        <p style="color: #334155; margin-top: 12px; line-height: 1.7;">
          For example, if "free" appears 3 times and "click" appears 2 times, 
          the AI calculates: <strong>"This message has a high spam score."</strong>
        </p>
      </div>
    </div>
  `;

  insight.style.display = 'block';
  hasCountedWords = true;
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