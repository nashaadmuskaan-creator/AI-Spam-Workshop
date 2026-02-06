// Activity 12: Breaking the AI
import { state, saveState } from '../core/state.js';

let attempts = [];
let successfulBreaks = 0;

export function initActivity12(container) {
  attempts = [];
  successfulBreaks = 0;
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      Can we trick the AI? Try to craft messages that fool the spam detector!
    </div>

    <div class="interaction-area">
      <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h3 style="margin-bottom: 16px;">🎯 Your Challenge:</h3>
        <p style="color: #475569; line-height: 1.7;">
          Create messages that break the AI's classification. Try to:
        </p>
        <ul style="margin: 12px 0 20px 20px; color: #475569; line-height: 1.8;">
          <li><strong>Spam that looks normal</strong> — Write actual spam but hide the spam words</li>
          <li><strong>Normal that looks like spam</strong> — Use spam words in a legitimate way</li>
        </ul>
      </div>

      <div style="background: white; padding: 24px; border-radius: 12px;">
        <h3 style="margin-bottom: 16px;">Craft Your Message:</h3>
        
        <div style="margin-bottom: 20px;">
          <label style="font-weight: 600; color: #475569; display: block; margin-bottom: 8px;">
            What is this message ACTUALLY?
          </label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <label style="padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="actual-type" value="spam" id="actual-spam">
              <span>🚫 Actually Spam</span>
            </label>
            <label style="padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="actual-type" value="normal" id="actual-normal">
              <span>✅ Actually Normal</span>
            </label>
          </div>
        </div>

        <textarea 
          id="crafted-message" 
          placeholder="Write your tricky message here... Try to fool the AI!"
          rows="4"
          style="width: 100%; margin: 16px 0; border: 2px solid #e2e8f0; border-radius: 10px; padding: 16px; font-size: 1rem;"
        ></textarea>

        <button class="primary-btn" id="test-message-btn" style="width: 100%;">
          🔍 Test This Message
        </button>
      </div>

      <div id="test-results"></div>

      <div id="attempts-log" style="margin-top: 24px;"></div>
    </div>

    <div id="summary-section" style="display: none;"></div>

    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 13 →
    </button>
  `;

  setupEventListeners(container);
}

function setupEventListeners(container) {
  const testBtn = container.querySelector('#test-message-btn');
  const continueBtn = container.querySelector('#continue-btn');

  // Style radio buttons
  container.querySelectorAll('input[name="actual-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      container.querySelectorAll('label').forEach(label => {
        label.style.borderColor = '#e2e8f0';
        label.style.background = 'white';
      });
      e.target.parentElement.style.borderColor = 'var(--accent)';
      e.target.parentElement.style.background = 'rgba(139, 92, 246, 0.05)';
    });
  });

  testBtn.addEventListener('click', () => testMessage(container));
  continueBtn.addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 12 } });
    document.dispatchEvent(event);
  });
}

function testMessage(container) {
  const messageInput = container.querySelector('#crafted-message');
  const actualType = container.querySelector('input[name="actual-type"]:checked');
  
  if (!actualType) {
    alert('Please select what this message actually is (spam or normal)');
    return;
  }

  if (!messageInput.value.trim()) {
    alert('Please write a message to test!');
    return;
  }

  const message = messageInput.value.trim();
  const actual = actualType.value;

  // Simple AI classification
  const spamWords = ['free', 'win', 'won', 'prize', 'click', 'urgent', 'claim', 'congratulations', 'verify'];
  const textLower = message.toLowerCase();
  const spamWordCount = spamWords.filter(w => textLower.includes(w)).length;
  
  const spamProbability = Math.min(95, Math.max(5, 20 + (spamWordCount * 15) + (Math.random() * 10)));
  const aiPrediction = spamProbability > 50 ? 'spam' : 'normal';
  
  const fooledAI = aiPrediction !== actual;
  if (fooledAI) successfulBreaks++;

  attempts.push({
    message,
    actual,
    aiPrediction,
    fooledAI,
    spamProbability
  });

  showTestResult(container, message, actual, aiPrediction, spamProbability, fooledAI);
  updateAttemptsLog(container);

  // Show summary after 3 attempts
  if (attempts.length >= 3) {
    showSummary(container);
  }
}

function showTestResult(container, message, actual, aiPrediction, probability, fooledAI) {
  const resultsDiv = container.querySelector('#test-results');

  resultsDiv.innerHTML = `
    <div class="result-reveal" style="margin-top: 24px;">
      <h3>${fooledAI ? '🎉 You Fooled the AI!' : '❌ AI Was Not Fooled'}</h3>

      <div style="background: ${fooledAI ? '#f0fdf4' : '#fef2f2'}; padding: 24px; border-radius: 12px; margin-top: 16px; border: 2px solid ${fooledAI ? '#bbf7d0' : '#fecaca'};">
        <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-weight: 600; margin-bottom: 8px;">Your Message:</p>
          <p style="font-size: 1.05rem; color: #334155;">"${message}"</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="background: white; padding: 16px; border-radius: 8px;">
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">Actually:</p>
            <p style="font-size: 1.3rem; font-weight: 700; color: ${actual === 'spam' ? '#dc2626' : '#16a34a'};">
              ${actual === 'spam' ? '🚫 SPAM' : '✅ NORMAL'}
            </p>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px;">
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">AI Predicted:</p>
            <p style="font-size: 1.3rem; font-weight: 700; color: ${aiPrediction === 'spam' ? '#dc2626' : '#16a34a'};">
              ${aiPrediction === 'spam' ? '🚫 SPAM' : '✅ NORMAL'}
            </p>
            <p style="font-size: 0.9rem; color: #64748b; margin-top: 4px;">${probability.toFixed(1)}% confidence</p>
          </div>
        </div>

        ${fooledAI ? `
          <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="font-weight: 600; color: #065f46; margin-bottom: 8px;">✓ Success!</p>
            <p style="color: #047857;">
              You successfully created a message where the AI's prediction didn't match reality. 
              This shows AI's limitations in understanding context and intent.
            </p>
          </div>
        ` : `
          <div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="font-weight: 600; color: #92400e; margin-bottom: 8px;">Try Again</p>
            <p style="color: #78350f;">
              The AI correctly classified this message. Try using different strategies to fool it!
            </p>
          </div>
        `}
      </div>
    </div>
  `;

  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateAttemptsLog(container) {
  const logDiv = container.querySelector('#attempts-log');

  if (attempts.length === 0) return;

  logDiv.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 12px;">
      <h4 style="margin-bottom: 16px;">Your Attempts (${attempts.length}):</h4>
      ${attempts.map((attempt, idx) => `
        <div style="padding: 12px; margin: 8px 0; background: ${attempt.fooledAI ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border-left: 4px solid ${attempt.fooledAI ? '#10b981' : '#ef4444'};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">#${idx + 1}</span>
            <span style="font-weight: 700; color: ${attempt.fooledAI ? '#10b981' : '#ef4444'};">
              ${attempt.fooledAI ? '✓ Fooled AI' : '✗ AI Correct'}
            </span>
          </div>
          <p style="font-size: 0.9rem; color: #64748b; margin-top: 4px;">
            Actually: ${attempt.actual} | AI said: ${attempt.aiPrediction}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

function showSummary(container) {
  const summarySection = container.querySelector('#summary-section');
  const successRate = Math.round((successfulBreaks / attempts.length) * 100);

  summarySection.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>📊 Breaking AI Summary</h3>

      <div style="background: white; padding: 32px; border-radius: 16px; text-align: center; margin: 20px 0;">
        <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 12px;">You Successfully Fooled AI:</p>
        <p style="font-size: 4rem; font-weight: 700; color: ${successfulBreaks > 0 ? '#10b981' : '#64748b'}; line-height: 1;">
          ${successfulBreaks}/${attempts.length}
        </p>
        <p style="font-size: 1.1rem; color: #64748b; margin-top: 12px;">${successRate}% success rate</p>
      </div>
    </div>

    <div class="insight-box">
      <h3>💡 What This Teaches Us</h3>
      <p><strong>AI doesn't understand intention — it only matches patterns.</strong></p>

      <div style="margin: 20px 0;">
        <p style="font-weight: 600; margin-bottom: 12px;">Common ways to fool spam detectors:</p>
        <ul style="margin-left: 20px; color: #475569; line-height: 1.8;">
          <li><strong>Spelling variations</strong> — "Fr33" instead of "Free"</li>
          <li><strong>Space insertion</strong> — "C l i c k h e r e"</li>
          <li><strong>Synonym swapping</strong> — "Complimentary" instead of "Free"</li>
          <li><strong>Context hiding</strong> — Legitimate-sounding setup followed by spam</li>
        </ul>
      </div>

      <div style="background: #fef2f2; padding: 16px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ef4444;">
        <p style="font-weight: 600; color: #991b1b; margin-bottom: 8px;">⚠️ Real-World Problem:</p>
        <p style="color: #7f1d1d;">
          Spammers use these exact tricks to bypass filters. This is why spam detection is a 
          constant arms race — as AI gets better, spammers find new ways to fool it.
        </p>
      </div>

      <p style="margin-top: 20px;">
        <strong>This is called adversarial AI</strong> — deliberately crafting inputs to make AI fail. 
        Understanding how AI breaks helps us build better, more robust systems.
      </p>
    </div>
  `;

  summarySection.style.display = 'block';
  container.querySelector('#continue-btn').style.display = 'block';

  setTimeout(() => {
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}