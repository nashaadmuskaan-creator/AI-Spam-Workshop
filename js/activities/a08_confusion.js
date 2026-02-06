// Activity 8: When Meaning Breaks - Testing AI's semantic limits
import { state, saveState } from '../core/state.js';

const testMessages = [
  {
    text: "I'm SO excited to win this academic competition!",
    type: "excitement",
    actualCategory: "normal",
    explanation: "This is genuine excitement about a legitimate achievement, but AI sees 'win' and might classify it as spam."
  },
  {
    text: "Yeah, right. Like I totally believe you won a million dollars. 🙄",
    type: "sarcasm",
    actualCategory: "normal",
    explanation: "This is sarcasm mocking spam messages, but AI can't detect tone and might think it's actual spam."
  },
  {
    text: "Click the link below to access today's lecture slides",
    type: "instruction",
    actualCategory: "normal",
    explanation: "A normal instruction using 'click', but AI might flag it as spam due to the keyword."
  },
  {
    text: "Free study group sessions every Tuesday!",
    type: "announcement",
    actualCategory: "normal",
    explanation: "The word 'free' triggers spam detection, but this is a helpful campus announcement."
  }
];

let testedMessages = 0;
let aiFailures = 0;

export function initActivity8(container) {
  testedMessages = 0;
  aiFailures = 0;
  renderActivity(container);
}

function renderActivity(container) {
  container.innerHTML = `
    <div class="think-prompt">
      Does AI understand jokes, sarcasm, or emotions? Let's test what happens when meaning matters.
    </div>

    <div class="interaction-area">
      <h3>Test these tricky messages:</h3>
      <p style="color: #64748b; margin-bottom: 20px;">
        These messages use spam-like words but have different meanings. 
        First, YOU decide if it's spam. Then see what AI thinks.
      </p>

      <div id="message-tests"></div>
    </div>

    <div id="summary-section" style="display: none;"></div>

    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 9 →
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

      <p style="font-weight: 600; margin-bottom: 12px; color: #475569;">
        What do YOU think this message is?
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <button class="choice-btn" data-idx="${idx}" data-choice="spam">
          🚫 Spam
        </button>
        <button class="choice-btn" data-idx="${idx}" data-choice="normal">
          ✅ Normal
        </button>
      </div>

      <div class="result-box" id="result-${idx}" style="display: none;"></div>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const choice = btn.dataset.choice;
      handleChoice(container, idx, choice);
    });
  });
}

function handleChoice(container, idx, userChoice) {
  const msg = testMessages[idx];
  const resultBox = container.querySelector(`#result-${idx}`);
  const testCard = container.querySelector(`#test-${idx}`);
  
  // Simple AI classification (keyword-based)
  const spamWords = ['win', 'free', 'click', 'prize'];
  const textLower = msg.text.toLowerCase();
  const hasSpamWord = spamWords.some(word => textLower.includes(word));
  const aiPrediction = hasSpamWord ? 'spam' : 'normal';
  const aiConfidence = hasSpamWord ? 78 : 85;

  const aiIsWrong = aiPrediction !== msg.actualCategory;
  if (aiIsWrong) aiFailures++;

  testedMessages++;

  // Disable buttons
  testCard.querySelectorAll('.choice-btn').forEach(btn => {
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
  });

  resultBox.innerHTML = `
    <div style="background: ${aiIsWrong ? '#fef2f2' : '#f0fdf4'}; padding: 20px; border-radius: 10px; margin-top: 16px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px;">
        <div>
          <p style="font-weight: 600; color: #64748b; font-size: 0.9rem;">YOUR ANSWER</p>
          <p style="font-size: 1.2rem; font-weight: 700; color: ${userChoice === msg.actualCategory ? '#10b981' : '#ef4444'};">
            ${userChoice === msg.actualCategory ? '✅ Correct' : '❌ Incorrect'}
          </p>
          <p style="font-size: 0.95rem;">You said: ${userChoice}</p>
        </div>
        <div>
          <p style="font-weight: 600; color: #64748b; font-size: 0.9rem;">AI PREDICTION</p>
          <p style="font-size: 1.2rem; font-weight: 700; color: ${aiIsWrong ? '#ef4444' : '#10b981'};">
            ${aiIsWrong ? '❌ Wrong' : '✅ Correct'}
          </p>
          <p style="font-size: 0.95rem;">AI said: ${aiPrediction} (${aiConfidence}%)</p>
        </div>
      </div>

      <div style="border-top: 2px solid ${aiIsWrong ? '#fecaca' : '#bbf7d0'}; padding-top: 16px;">
        <p style="font-weight: 600; margin-bottom: 8px;">Actually: ${msg.actualCategory.toUpperCase()}</p>
        <p style="color: #475569; line-height: 1.6;">${msg.explanation}</p>
      </div>

      ${aiIsWrong ? `
        <div style="background: #fff1f2; border-left: 4px solid #ef4444; padding: 12px; margin-top: 12px; border-radius: 6px;">
          <p style="font-weight: 600; color: #b91c1c;">⚠️ AI Failed Because:</p>
          <p style="color: #7f1d1d; font-size: 0.95rem;">It detected spam keywords but couldn't understand <strong>${msg.type}</strong>.</p>
        </div>
      ` : ''}
    </div>
  `;

  resultBox.style.display = 'block';

  // Show summary when all tested
  if (testedMessages === testMessages.length) {
    showSummary(container);
  }
}

function showSummary(container) {
  const summarySection = container.querySelector('#summary-section');
  const failureRate = Math.round((aiFailures / testMessages.length) * 100);

  summarySection.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>📊 AI Performance Summary</h3>
      
      <div style="background: white; padding: 32px; border-radius: 16px; text-align: center; margin: 20px 0;">
        <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 12px;">AI Failed On:</p>
        <p style="font-size: 4rem; font-weight: 700; color: ${aiFailures > 1 ? '#ef4444' : '#f59e0b'}; line-height: 1;">
          ${aiFailures}/${testMessages.length}
        </p>
        <p style="font-size: 1.1rem; color: #64748b; margin-top: 12px;">messages (${failureRate}% error rate)</p>
      </div>
    </div>

    <div class="insight-box">
      <h3>💡 Why AI Struggles with Meaning</h3>
      <p><strong>AI understands patterns, not feelings or intent.</strong></p>
      
      <div style="margin: 20px 0;">
        <p style="font-weight: 600; margin-bottom: 8px;">What AI CAN'T detect:</p>
        <ul style="margin: 8px 0 8px 20px; color: #475569; line-height: 1.8;">
          <li><strong>Sarcasm</strong> — "Yeah, sure you won a million dollars 🙄"</li>
          <li><strong>Tone</strong> — Excitement vs. manipulation</li>
          <li><strong>Context</strong> — "Click here" in a classroom vs. a scam</li>
          <li><strong>Emotion</strong> — Genuine enthusiasm vs. fake urgency</li>
        </ul>
      </div>

      <p style="margin-top: 16px;">
        AI only sees word frequencies and patterns. It has <strong>no semantic understanding</strong>. 
        This is why human judgment is still essential for complex decisions.
      </p>
    </div>
  `;

  summarySection.style.display = 'block';
  container.querySelector('#continue-btn').style.display = 'block';
  
  setTimeout(() => {
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  container.querySelector('#continue-btn').addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 8 } });
    document.dispatchEvent(event);
  });
}