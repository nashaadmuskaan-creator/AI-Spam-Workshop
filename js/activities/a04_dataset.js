// Activity 4: Creating Training Data
// Goal: Understand training data as the AI's foundation

import { state, saveState } from '../core/state.js';

export function initActivity4(container) {
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      If you were teaching someone to spot spam, what examples would you show them?
      Think about what makes a good example.
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0;">
      
      <!-- Spam Column -->
      <div style="background: #fef2f2; padding: 24px; border-radius: 14px;">
        <h4 style="color: #dc2626; margin-bottom: 16px;">🚫 Spam Examples</h4>
        <textarea 
          id="spam-input" 
          placeholder="Write an example spam message..."
          rows="3"
          style="width: 100%; margin-bottom: 12px; border: 2px solid #fecaca; border-radius: 8px; padding: 10px;"
        ></textarea>
        <button class="primary-btn" id="add-spam-btn" style="width: 100%; background: linear-gradient(135deg, #dc2626, #b91c1c);">
          Add to Spam List
        </button>
        
        <div id="spam-list" style="margin-top: 20px; min-height: 100px;">
          ${renderDataList('spam')}
        </div>
      </div>
      
      <!-- Normal Column -->
      <div style="background: #f0fdf4; padding: 24px; border-radius: 14px;">
        <h4 style="color: #16a34a; margin-bottom: 16px;">✅ Normal Examples</h4>
        <textarea 
          id="normal-input" 
          placeholder="Write an example normal message..."
          rows="3"
          style="width: 100%; margin-bottom: 12px; border: 2px solid #bbf7d0; border-radius: 8px; padding: 10px;"
        ></textarea>
        <button class="primary-btn" id="add-normal-btn" style="width: 100%; background: linear-gradient(135deg, #16a34a, #15803d);">
          Add to Normal List
        </button>
        
        <div id="normal-list" style="margin-top: 20px; min-height: 100px;">
          ${renderDataList('normal')}
        </div>
      </div>
      
    </div>
    
    <div style="text-align: center; padding: 20px; background: white; border-radius: 12px;">
      <p style="font-weight: 600; margin-bottom: 8px;">Dataset Progress:</p>
      <p style="font-size: 1.2rem;">
        <span style="color: #dc2626; font-weight: 700;" id="spam-count">${state.dataset.spam.length}</span> spam + 
        <span style="color: #16a34a; font-weight: 700;" id="normal-count">${state.dataset.normal.length}</span> normal = 
        <span style="color: var(--accent); font-weight: 700;" id="total-count">${state.dataset.spam.length + state.dataset.normal.length}</span> total examples
      </p>
      <p style="color: #64748b; font-size: 0.9rem; margin-top: 8px;">
        Tip: Try to create at least 5 examples of each type
      </p>
    </div>
    
    <div id="understanding-stage"></div>
  `;
  
  setupEventListeners(container);
  
  // Show understanding if enough data
  if (state.dataset.spam.length >= 5 && state.dataset.normal.length >= 5) {
    showUnderstanding(container);
  }
}

function setupEventListeners(container) {
  container.querySelector('#add-spam-btn').addEventListener('click', () => {
    addExample(container, 'spam');
  });
  
  container.querySelector('#add-normal-btn').addEventListener('click', () => {
    addExample(container, 'normal');
  });
  
  // Enter key support
  container.querySelector('#spam-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) addExample(container, 'spam');
  });
  
  container.querySelector('#normal-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) addExample(container, 'normal');
  });
}

function addExample(container, type) {
  const input = container.querySelector(`#${type}-input`);
  const text = input.value.trim();
  
  if (!text) {
    alert('Please write a message first!');
    return;
  }
  
  if (text.length < 10) {
    alert('Please write a more detailed example (at least 10 characters)');
    return;
  }
  
  state.dataset[type].push({
    text: text,
    addedAt: new Date().toISOString()
  });
  
  saveState();
  input.value = '';
  
  // Re-render just the lists and counts
  updateLists(container);
  
  // Show understanding after enough examples
  if (state.dataset.spam.length >= 5 && state.dataset.normal.length >= 5) {
    showUnderstanding(container);
  }
}

function updateLists(container) {
  container.querySelector('#spam-list').innerHTML = renderDataList('spam');
  container.querySelector('#normal-list').innerHTML = renderDataList('normal');
  container.querySelector('#spam-count').textContent = state.dataset.spam.length;
  container.querySelector('#normal-count').textContent = state.dataset.normal.length;
  container.querySelector('#total-count').textContent = 
    state.dataset.spam.length + state.dataset.normal.length;
}

function renderDataList(type) {
  if (state.dataset[type].length === 0) {
    return '<p style="color: #94a3b8; font-style: italic; font-size: 0.9rem;">No examples yet...</p>';
  }
  
  return state.dataset[type]
    .map((item, idx) => `
      <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; font-size: 0.9rem;">
        <strong>${idx + 1}.</strong> ${escapeHtml(item.text)}
      </div>
    `)
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showUnderstanding(container) {
  const understandingDiv = container.querySelector('#understanding-stage');
  
  if (understandingDiv.innerHTML) return; // Already shown
  
  understandingDiv.innerHTML = `
    <div class="result-reveal fade-in" style="margin-top: 32px;">
      <h3>💡 You just created "Training Data"!</h3>
      
      <div style="background: white; padding: 24px; border-radius: 12px; margin: 20px 0;">
        <p style="font-size: 1.05rem;">
          <strong>These examples are the AI's memory.</strong> Everything the AI knows comes from data like this.
        </p>
        
        <div style="margin: 20px 0;">
          <p style="font-weight: 600; margin-bottom: 8px;">What you just created:</p>
          <ul style="margin: 8px 0; padding-left: 20px; color: #475569;">
            <li><strong>Labeled data</strong> — Each example is marked as spam or normal</li>
            <li><strong>Diverse examples</strong> — Different types of spam and normal messages</li>
            <li><strong>Training set</strong> — The foundation the AI will learn from</li>
          </ul>
        </div>
        
        <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent); margin-top: 16px;">
          <p style="font-weight: 600; color: var(--accent); margin-bottom: 8px;">
            Important Insight:
          </p>
          <p>
            AI doesn't "understand" messages like humans do. It will only recognize patterns 
            similar to what it sees in these examples. The quality and variety of your 
            training data determines how well the AI performs!
          </p>
        </div>
      </div>
      
      <button class="primary-btn" id="continue-to-5" style="margin-top: 24px; width: 100%;">
        Continue to Activity 5 →
      </button>
    </div>
  `;

  // Add event listener for continue button
  container.querySelector('#continue-to-5').addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 4 } });
    document.dispatchEvent(event);
  });
}