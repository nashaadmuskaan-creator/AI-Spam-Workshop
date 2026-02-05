// Activity 3: When Rules Break
import { state, saveState } from '../core/state.js';

const testCases = [
  {
    message: "You can win this college scholarship competition!",
    hasSpamWord: "win",
    actualCategory: "normal",
    explanation: "The word 'win' appears, but this is legitimate information about a scholarship."
  },
  {
    message: "Click here to access your class notes",
    hasSpamWord: "click",
    actualCategory: "normal",
    explanation: "'Click here' is used, but it's a normal instruction for accessing educational content."
  },
  {
    message: "This is an urgent message about free pizza in the cafeteria",
    hasSpamWord: "urgent, free",
    actualCategory: "normal",
    explanation: "Contains spam words, but it's actually a helpful campus announcement."
  }
];

let currentCase = 0;

export function initActivity3(container) {
  currentCase = 0;
  renderCase(container);
}

function renderCase(container) {
  if (currentCase >= testCases.length) {
    showConclusion(container);
    return;
  }
  
  const testCase = testCases[currentCase];
  
  container.innerHTML = `
    <div class="think-prompt">
      Imagine you have this simple rule:<br>
      <strong>IF message contains "${testCase.hasSpamWord}" → Classify as SPAM</strong>
    </div>
    
    <div class="message-card">
      ${testCase.message}
    </div>
    
    <p style="text-align: center; margin: 24px 0; color: #64748b;">
      According to our rule, this message would be marked as <strong>SPAM</strong>.<br>
      Do you agree?
    </p>
    
    <div class="choice-grid">
      <button class="choice-btn" data-answer="spam">
        🚫 Yes, it's spam
      </button>
      <button class="choice-btn" data-answer="normal">
        ✅ No, it's normal
      </button>
    </div>
    
    <div class="result-reveal" id="result-box" style="display: none; margin-top: 24px;">
    </div>
  `;
  
  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(container, btn.dataset.answer, testCase));
  });
}

function handleAnswer(container, answer, testCase) {
  const resultBox = container.querySelector('#result-box');
  const isCorrect = answer === testCase.actualCategory;
  
  resultBox.innerHTML = `
    <h3>${isCorrect ? '✅ Exactly!' : '🤔 Think Again'}</h3>
    <p><strong>This message is actually ${testCase.actualCategory.toUpperCase()}.</strong></p>
    <p>${testCase.explanation}</p>
    
    <div class="insight-box" style="margin-top: 20px;">
      <h3>⚠️ The Problem</h3>
      <p>Simple rules break because <strong>words have different meanings in different contexts</strong>.</p>
      <p>A single rule like "contains 'win' = spam" catches real spam, but also blocks legitimate messages about competitions, achievements, or scholarships.</p>
    </div>
    
    <button class="primary-btn" id="next-case-btn">
      ${currentCase < testCases.length - 1 ? 'Next Example →' : 'See the Solution →'}
    </button>
  `;
  
  resultBox.style.display = 'block';
  
  // Hide choice buttons
  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.style.opacity = '0.3';
    btn.style.pointerEvents = 'none';
  });
  
  // Add event listener for next button
  resultBox.querySelector('#next-case-btn').addEventListener('click', () => {
    currentCase++;
    renderCase(container);
  });
}

function showConclusion(container) {
  container.innerHTML = `
    <div class="result-reveal">
      <h3>🎯 Key Insight</h3>
      <p>Rule-based systems are too rigid. They can't understand <strong>context</strong>, <strong>tone</strong>, or <strong>intent</strong>.</p>
    </div>
    
    <div class="insight-box">
      <h3>🧠 How AI Solves This</h3>
      <p>Instead of using one rule, AI:</p>
      <ol style="margin-left: 24px; color: #475569; line-height: 1.8;">
        <li><strong>Looks at many examples</strong> of both spam and normal messages</li>
        <li><strong>Finds patterns</strong> across all the examples</li>
        <li><strong>Learns which combinations</strong> of words and patterns indicate spam</li>
        <li><strong>Makes decisions</strong> based on probability, not fixed rules</li>
      </ol>
      <p style="margin-top: 16px;">
        This is called <strong>machine learning</strong> — teaching computers through examples instead of rules.
      </p>
    </div>
    
    <button class="primary-btn" id="continue-btn">
      Complete Hour 1 →
    </button>
  `;
  
  saveState();
  
  container.querySelector('#continue-btn').addEventListener('click', () => {
    // Dispatch activity complete event for activity 3
    const event = new CustomEvent('activityComplete', { detail: { activity: 3 } });
    document.dispatchEvent(event);
  });
}