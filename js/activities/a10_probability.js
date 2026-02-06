// Activity 10: Probability, Not Certainty
import { state, saveState } from '../core/state.js';

const testMessages = [
  { text: "Click here to claim your FREE prize now!", expected: "spam", confidence: "high" },
  { text: "Can you send me the notes from class?", expected: "normal", confidence: "high" },
  { text: "You might be interested in this opportunity", expected: "uncertain", confidence: "low" },
  { text: "Free coffee in the student lounge today", expected: "normal", confidence: "medium" },
  { text: "URGENT: Verify your student account", expected: "spam", confidence: "medium" }
];

let messagesTested = 0;

export function initActivity10(container) {
  messagesTested = 0;
  renderActivity(container);
}

function renderActivity(container) {
  if (!state.modelTrained) {
    container.innerHTML = `
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 10px;">
        <p style="color: #92400e; font-weight: 600;">⚠️ Model Not Trained!</p>
        <p style="color: #78350f; margin-top: 8px;">Complete Activity 9 first to train the model.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="think-prompt">
      Is AI ever 100% sure? What does it mean when AI says "85% spam"?
    </div>

    <div class="interaction-area">
      <h3>Test these messages and watch the probability scores:</h3>
      <p style="color: #64748b; margin-bottom: 20px;">
        For each message, the AI will show its confidence level. Pay attention to the percentages!
      </p>

      <div id="message-tests"></div>
    </div>

    <div id="summary-section" style="display: none;"></div>

    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Hour 4 →
    </button>
  `;

  renderMessageTests(container);
}

function renderMessageTests(container) {
  const testsContainer = container.querySelector('#message-tests');
  
  testsContainer.innerHTML = testMessages.map((msg, idx) => `
    <div class="message-test-card" id="test-${idx}" style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 2px solid #e2e8f0;">
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-size: 1.05rem;">
        "${msg.text}"
      </div>

      <button class="primary-btn" data-idx="${idx}" style="width: 100%;">
        🔍 Classify This Message
      </button>

      <div class="result-box" id="result-${idx}" style="display: none; margin-top: 20px;"></div>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.primary-btn[data-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      classifyMessage(container, idx);
    });
  });
}

function classifyMessage(container, idx) {
  const msg = testMessages[idx];
  const resultBox = container.querySelector(`#result-${idx}`);
  const testCard = container.querySelector(`#test-${idx}`);
  
  // Simple probability calculation based on keywords
  const spamWords = ['free', 'click', 'prize', 'urgent', 'claim', 'winner', 'verify'];
  const normalWords = ['class', 'notes', 'send', 'student', 'assignment'];
  
  const textLower = msg.text.toLowerCase();
  
  let spamScore = 0;
  let normalScore = 0;
  
  spamWords.forEach(word => {
    if (textLower.includes(word)) spamScore += 20;
  });
  
  normalWords.forEach(word => {
    if (textLower.includes(word)) normalScore += 20;
  });
  
  // Add some randomness for realism
  spamScore += Math.random() * 15;
  normalScore += Math.random() * 15;
  
  // Normalize to 100%
  const total = spamScore + normalScore;
  const spamProbability = total > 0 ? Math.round((spamScore / total) * 100) : 50;
  const normalProbability = 100 - spamProbability;
  
  const prediction = spamProbability > 50 ? 'spam' : 'normal';
  const confidence = Math.max(spamProbability, normalProbability);

  messagesTested++;

  // Disable button
  testCard.querySelector('button').disabled = true;
  testCard.querySelector('button').style.opacity = '0.5';

  resultBox.innerHTML = `
    <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 24px; border-radius: 12px;">
      <h4 style="text-align: center; margin-bottom: 20px; color: var(--accent);">AI Probability Distribution</h4>
      
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600;">🚫 Spam</span>
          <span style="font-weight: 700; color: #dc2626;">${spamProbability}%</span>
        </div>
        <div style="background: #f1f5f9; height: 32px; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #dc2626, #ef4444); height: 100%; width: ${spamProbability}%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
            ${spamProbability > 15 ? spamProbability + '%' : ''}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600;">✅ Normal</span>
          <span style="font-weight: 700; color: #16a34a;">${normalProbability}%</span>
        </div>
        <div style="background: #f1f5f9; height: 32px; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #16a34a, #22c55e); height: 100%; width: ${normalProbability}%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
            ${normalProbability > 15 ? normalProbability + '%' : ''}
          </div>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; background: white; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 8px;">AI Prediction:</p>
        <p style="font-size: 1.5rem; font-weight: 700; color: ${prediction === 'spam' ? '#dc2626' : '#16a34a'};">
          ${prediction === 'spam' ? '🚫 SPAM' : '✅ NORMAL'}
        </p>
        <p style="font-size: 1.1rem; color: #64748b; margin-top: 8px;">
          Confidence: ${confidence}%
        </p>
      </div>

      ${confidence < 70 ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 16px; border-radius: 6px;">
          <p style="font-weight: 600; color: #92400e;">⚠️ Low Confidence</p>
          <p style="color: #78350f; font-size: 0.9rem;">The AI isn't very sure about this one. This is an ambiguous message.</p>
        </div>
      ` : ''}
    </div>
  `;

  resultBox.style.display = 'block';

  // Show summary when all tested
  if (messagesTested === testMessages.length) {
    showSummary(container);
  }
}

function showSummary(container) {
  const summarySection = container.querySelector('#summary-section');

  summarySection.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>🎲 Understanding Probability</h3>
      
      <div style="background: white; padding: 32px; border-radius: 16px; margin: 20px 0;">
        <h4 style="margin-bottom: 20px; text-align: center;">Key Observations:</h4>
        
        <div style="display: grid; gap: 16px;">
          <div style="padding: 16px; background: #f0f9ff; border-radius: 10px; border-left: 4px solid #06b6d4;">
            <p style="font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">1. Never 100% Sure</p>
            <p style="color: #475569; font-size: 0.95rem;">AI always gives probabilities, not absolute certainty. Even "obvious" spam might be 95%, not 100%.</p>
          </div>

          <div style="padding: 16px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <p style="font-weight: 600; color: #92400e; margin-bottom: 8px;">2. Ambiguous Cases</p>
            <p style="color: #475569; font-size: 0.95rem;">Messages with mixed signals (like "free coffee") get probabilities close to 50%. The AI is genuinely uncertain.</p>
          </div>

          <div style="padding: 16px; background: #f0fdf4; border-radius: 10px; border-left: 4px solid #16a34a;">
            <p style="font-weight: 600; color: #14532d; margin-bottom: 8px;">3. Confidence Levels Matter</p>
            <p style="color: #475569; font-size: 0.95rem;">A prediction with 55% confidence is very different from 95% confidence. Always check the probability!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="insight-box">
      <h3>💡 Why Probabilities, Not Certainty?</h3>
      <p><strong>AI deals with uncertainty because language is ambiguous.</strong></p>
      
      <p style="margin-top: 16px;">Think about it:</p>
      <ul style="margin: 12px 0 12px 20px; color: #475569; line-height: 1.8;">
        <li>"Free coffee in the lounge" — Is "free" spam or helpful?</li>
        <li>"You won the science competition!" — Is "won" legitimate or fake?</li>
        <li>"Click here for class notes" — Is "click" educational or suspicious?</li>
      </ul>

      <p style="margin-top: 16px;">
        <strong>AI computes probabilities by comparing word patterns</strong> to its training data. 
        It's essentially saying: "Based on what I've seen before, this is X% likely to be spam."
      </p>

      <div style="background: #f0f9ff; padding: 16px; border-radius: 10px; margin-top: 20px; border-left: 4px solid var(--accent);">
        <p style="font-weight: 600; color: var(--accent); margin-bottom: 8px;">Important Takeaway:</p>
        <p style="color: #334155;">
          When you see "AI detected spam," remember: it's really saying "I calculated an 85% probability this is spam." 
          Understanding these probabilities helps you make better decisions about trusting AI.
        </p>
      </div>
    </div>
  `;

  summarySection.style.display = 'block';
  container.querySelector('#continue-btn').style.display = 'block';
  
  setTimeout(() => {
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  container.querySelector('#continue-btn').addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 10 } });
    document.dispatchEvent(event);
  });
}