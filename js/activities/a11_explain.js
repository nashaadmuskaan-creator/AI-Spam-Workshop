// Activity 11: Explaining the Decision - Model Interpretability
import { state, saveState } from '../core/state.js';

const testCases = [
  {
    text: "CONGRATULATIONS! You've won a FREE iPhone! Click now to claim your prize!",
    actualCategory: "spam",
    keywords: ["congratulations", "won", "free", "click", "claim", "prize"]
  },
  {
    text: "Can you help me with the math homework due tomorrow?",
    actualCategory: "normal",
    keywords: ["help", "homework", "tomorrow"]
  },
  {
    text: "URGENT: Your account will be suspended unless you verify immediately!",
    actualCategory: "spam",
    keywords: ["urgent", "suspended", "verify", "immediately"]
  }
];

let currentCase = 0;

export function initActivity11(container) {
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
      Why did AI choose this classification? Let's investigate the decision.
    </div>

    <div class="interaction-area">
      <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h3>Message to Analyze:</h3>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 16px 0; font-size: 1.1rem; line-height: 1.6;">
          "${testCase.text}"
        </div>
        
        <button class="primary-btn" id="classify-btn" style="width: 100%; margin-top: 16px;">
          Classify This Message
        </button>
      </div>

      <div id="classification-result" style="display: none;"></div>
      <div id="word-importance" style="display: none;"></div>
    </div>

    <button class="primary-btn" id="next-btn" style="display: none; margin-top: 24px;">
      ${currentCase < testCases.length - 1 ? 'Next Example →' : 'See Final Insights →'}
    </button>
  `;

  setupEventListeners(container, testCase);
}

function setupEventListeners(container, testCase) {
  const classifyBtn = container.querySelector('#classify-btn');
  const nextBtn = container.querySelector('#next-btn');

  classifyBtn.addEventListener('click', () => showClassification(container, testCase));
  nextBtn.addEventListener('click', () => {
    currentCase++;
    renderCase(container);
  });
}

function showClassification(container, testCase) {
  const resultDiv = container.querySelector('#classification-result');
  const classifyBtn = container.querySelector('#classify-btn');
  
  classifyBtn.disabled = true;
  classifyBtn.style.opacity = '0.5';

  // Calculate word weights
  const spamWords = ['free', 'win', 'won', 'prize', 'click', 'urgent', 'claim', 'congratulations', 'verify', 'suspended', 'immediately'];
  const words = testCase.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  const spamScore = words.filter(w => spamWords.includes(w)).length * 15;
  const probability = Math.min(95, Math.max(5, spamScore + 20));
  const prediction = probability > 50 ? 'spam' : 'normal';

  resultDiv.innerHTML = `
    <div style="background: ${prediction === 'spam' ? '#fef2f2' : '#f0fdf4'}; padding: 24px; border-radius: 12px; border: 2px solid ${prediction === 'spam' ? '#fecaca' : '#bbf7d0'}; margin-top: 24px;">
      <h3 style="text-align: center; margin-bottom: 16px;">AI Classification Result</h3>
      
      <div style="text-align: center; background: white; padding: 24px; border-radius: 10px;">
        <p style="font-size: 3rem; margin-bottom: 8px;">
          ${prediction === 'spam' ? '🚫' : '✅'}
        </p>
        <p style="font-size: 1.5rem; font-weight: 700; color: ${prediction === 'spam' ? '#dc2626' : '#16a34a'};">
          ${prediction === 'spam' ? 'SPAM' : 'NORMAL'}
        </p>
        <p style="font-size: 1.2rem; color: #64748b; margin-top: 8px;">
          Confidence: ${probability}%
        </p>
      </div>

      <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.7); border-radius: 8px;">
        <p style="font-weight: 600; margin-bottom: 8px; color: #475569;">
          But WHY did AI choose this? Let's look at the evidence...
        </p>
      </div>
    </div>
  `;

  resultDiv.style.display = 'block';

  setTimeout(() => {
    showWordImportance(container, testCase, words, spamWords);
  }, 1000);
}

function showWordImportance(container, testCase, words, spamWords) {
  const importanceDiv = container.querySelector('#word-importance');

  // Analyze each word
  const wordAnalysis = words.map(word => ({
    word,
    isSpamIndicator: spamWords.includes(word),
    weight: spamWords.includes(word) ? 'High' : 'Low',
    impact: spamWords.includes(word) ? '+15%' : '+0%'
  }));

  const highlightedText = testCase.text.split(/(\s+)/).map(segment => {
    const word = segment.toLowerCase().replace(/[^\w]/g, '');
    if (spamWords.includes(word)) {
      return `<mark style="background: #fef3c7; padding: 2px 6px; border-radius: 4px; border-bottom: 3px solid #f59e0b; font-weight: 600;">${segment}</mark>`;
    }
    return segment;
  }).join('');

  importanceDiv.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>🔍 Decision Explanation</h3>

      <div style="background: white; padding: 24px; border-radius: 12px; margin: 20px 0;">
        <h4 style="margin-bottom: 16px;">Highlighted Influential Words:</h4>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; font-size: 1.1rem; line-height: 1.8;">
          ${highlightedText}
        </div>
        <p style="color: #64748b; font-size: 0.9rem; margin-top: 12px;">
          ⚠️ Yellow highlighting shows words that increased the spam score
        </p>
      </div>

      <div style="background: white; padding: 24px; border-radius: 12px;">
        <h4 style="margin-bottom: 16px;">Word Impact Analysis:</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0;">
              <th style="text-align: left; padding: 12px; font-weight: 600;">Word</th>
              <th style="text-align: center; padding: 12px; font-weight: 600;">Weight</th>
              <th style="text-align: right; padding: 12px; font-weight: 600;">Impact</th>
            </tr>
          </thead>
          <tbody>
            ${wordAnalysis.filter(w => w.word.length > 2).map(analysis => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px; font-weight: 500;">${analysis.word}</td>
                <td style="padding: 12px; text-align: center;">
                  <span style="padding: 4px 12px; border-radius: 12px; background: ${analysis.isSpamIndicator ? '#fef3c7' : '#f1f5f9'}; color: ${analysis.isSpamIndicator ? '#92400e' : '#64748b'}; font-weight: 600; font-size: 0.85rem;">
                    ${analysis.weight}
                  </span>
                </td>
                <td style="padding: 12px; text-align: right; font-weight: 700; color: ${analysis.isSpamIndicator ? '#dc2626' : '#94a3b8'};">
                  ${analysis.impact}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid var(--accent);">
        <h4 style="color: var(--accent); margin-bottom: 12px;">🧮 How the Decision Was Made:</h4>
        <ol style="margin-left: 20px; color: #475569; line-height: 1.8;">
          <li>AI broke the message into individual words</li>
          <li>Each word was checked against learned spam patterns</li>
          <li>High-weight words (like "free", "win", "urgent") increased spam probability</li>
          <li>The total score determined the final classification</li>
        </ol>
      </div>
    </div>
  `;

  importanceDiv.style.display = 'block';
  container.querySelector('#next-btn').style.display = 'block';

  setTimeout(() => {
    importanceDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function showConclusion(container) {
  container.innerHTML = `
    <div class="result-reveal">
      <h3>🎓 Understanding Explainability</h3>
      <p>You've just done what's called <strong>model interpretability</strong> — explaining why AI made a decision.</p>
    </div>

    <div class="insight-box">
      <h3>💡 Why Explainability Matters</h3>
      
      <div style="margin: 20px 0;">
        <p style="font-weight: 600; margin-bottom: 12px;">Knowing WHY AI made a decision helps us:</p>
        <ul style="margin-left: 20px; color: #475569; line-height: 1.8;">
          <li><strong>Trust decisions</strong> — We can verify the reasoning makes sense</li>
          <li><strong>Catch errors</strong> — If AI relies on wrong features, we can spot it</li>
          <li><strong>Improve models</strong> — Understanding failures helps us fix them</li>
          <li><strong>Ensure fairness</strong> — We can check if AI uses biased patterns</li>
        </ul>
      </div>

      <div style="background: #fef3c7; padding: 16px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #f59e0b;">
        <p style="font-weight: 600; color: #92400e; margin-bottom: 8px;">⚠️ The Problem:</p>
        <p style="color: #78350f;">
          Many real-world AI systems are "black boxes" — even their creators can't fully explain 
          individual decisions. This makes it hard to trust AI in important situations like medical 
          diagnosis, loan approvals, or criminal justice.
        </p>
      </div>

      <p style="margin-top: 20px;">
        <strong>Key takeaway:</strong> Always ask "Why did AI decide this?" Good AI systems should 
        be able to explain their reasoning, just like humans should.
      </p>
    </div>

    <button class="primary-btn" id="continue-btn" style="margin-top: 24px;">
      Continue to Activity 12 →
    </button>
  `;

  saveState();

  container.querySelector('#continue-btn').addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 11 } });
    document.dispatchEvent(event);
  });
}