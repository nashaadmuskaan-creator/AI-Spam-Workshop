// Activity 9: Training the Model
import { state, saveState } from '../core/state.js';

let isTraining = false;
let trainingProgress = 0;

export function initActivity9(container) {
  isTraining = false;
  trainingProgress = 0;
  renderActivity(container);
}

function renderActivity(container) {
  const hasData = state.dataset.spam.length > 0 && state.dataset.normal.length > 0;
  const dataCount = state.dataset.spam.length + state.dataset.normal.length;

  container.innerHTML = `
    <div class="think-prompt">
      What will happen when we press "Train Model"? Think about what the AI is doing behind the scenes.
    </div>

    <div class="interaction-area">
      ${hasData ? `
        <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="margin-bottom: 16px;">📊 Your Training Data:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="text-align: center; padding: 20px; background: #fef2f2; border-radius: 10px;">
              <p style="font-size: 2.5rem; font-weight: 700; color: #dc2626;">${state.dataset.spam.length}</p>
              <p style="color: #991b1b; font-weight: 600;">Spam Examples</p>
            </div>
            <div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 10px;">
              <p style="font-size: 2.5rem; font-weight: 700; color: #16a34a;">${state.dataset.normal.length}</p>
              <p style="color: #166534; font-weight: 600;">Normal Examples</p>
            </div>
          </div>
          <p style="text-align: center; margin-top: 16px; color: #64748b;">
            Total: <strong>${dataCount} training examples</strong>
          </p>
        </div>
      ` : `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 10px;">
          <p style="color: #92400e; font-weight: 600;">⚠️ No training data found!</p>
          <p style="color: #78350f; margin-top: 8px;">You need to create training examples first. Go back to Activity 4 to add spam and normal messages.</p>
        </div>
      `}

      <div style="text-align: center; margin: 32px 0;">
        <button 
          class="primary-btn" 
          id="train-btn" 
          style="font-size: 1.2rem; padding: 20px 48px; ${!hasData ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
          ${!hasData ? 'disabled' : ''}
        >
          🚀 Train Model
        </button>
      </div>

      <div id="training-visualization" style="display: none;"></div>
    </div>

    <div id="results-section" style="display: none;"></div>

    <button class="primary-btn" id="continue-btn" style="display: none; margin-top: 24px;">
      Continue to Activity 10 →
    </button>
  `;

  if (hasData) {
    setupEventListeners(container);
  }
}

function setupEventListeners(container) {
  const trainBtn = container.querySelector('#train-btn');
  const continueBtn = container.querySelector('#continue-btn');

  trainBtn.addEventListener('click', () => startTraining(container));
  continueBtn.addEventListener('click', () => {
    const event = new CustomEvent('activityComplete', { detail: { activity: 9 } });
    document.dispatchEvent(event);
  });
}

async function startTraining(container) {
  const trainBtn = container.querySelector('#train-btn');
  const vizSection = container.querySelector('#training-visualization');
  
  trainBtn.disabled = true;
  trainBtn.style.opacity = '0.5';
  
  vizSection.innerHTML = `
    <div style="background: white; padding: 32px; border-radius: 16px; margin-top: 24px;">
      <h3 style="text-align: center; margin-bottom: 24px;">🧠 Training in Progress...</h3>
      
      <div style="background: #f1f5f9; height: 24px; border-radius: 12px; overflow: hidden; margin-bottom: 16px;">
        <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, var(--accent), #06b6d4); width: 0%; transition: width 0.3s ease; border-radius: 12px;"></div>
      </div>
      
      <p id="training-status" style="text-align: center; color: #64748b; font-weight: 600;">
        Initializing...
      </p>

      <div id="training-steps" style="margin-top: 24px;">
      </div>
    </div>
  `;
  
  vizSection.style.display = 'block';

  const steps = [
    { progress: 20, status: 'Tokenizing messages...', detail: 'Breaking text into individual words' },
    { progress: 40, status: 'Counting word frequencies...', detail: 'Creating vocabulary from training data' },
    { progress: 60, status: 'Calculating feature weights...', detail: 'Learning which words are important' },
    { progress: 80, status: 'Building probability tables...', detail: 'Computing spam/normal likelihoods' },
    { progress: 100, status: 'Training complete!', detail: 'Model is ready to classify messages' }
  ];

  const progressBar = vizSection.querySelector('#progress-bar');
  const statusText = vizSection.querySelector('#training-status');
  const stepsDiv = vizSection.querySelector('#training-steps');

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const step = steps[i];
    progressBar.style.width = step.progress + '%';
    statusText.textContent = step.status;
    
    stepsDiv.innerHTML += `
      <div style="padding: 12px; margin: 8px 0; background: #f0f9ff; border-left: 4px solid var(--accent); border-radius: 8px; animation: fadeIn 0.5s;">
        <p style="font-weight: 600; color: var(--accent);">✓ ${step.status}</p>
        <p style="color: #64748b; font-size: 0.9rem; margin-top: 4px;">${step.detail}</p>
      </div>
    `;
    
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  
  state.modelTrained = true;
  saveState();
  
  showResults(container);
}

function showResults(container) {
  const resultsSection = container.querySelector('#results-section');
  
  resultsSection.innerHTML = `
    <div class="result-reveal" style="margin-top: 32px;">
      <h3>🎉 Model Training Complete!</h3>
      
      <div style="background: white; padding: 32px; border-radius: 16px; text-align: center; margin: 20px 0;">
        <div style="font-size: 5rem; margin-bottom: 16px;">🧠</div>
        <p style="font-size: 1.3rem; font-weight: 700; color: var(--accent); margin-bottom: 8px;">
          Model Status: READY
        </p>
        <p style="color: #64748b;">
          Your AI spam detector is now trained and ready to classify new messages!
        </p>
      </div>

      <div style="background: white; padding: 24px; border-radius: 12px; margin-top: 20px;">
        <h4 style="margin-bottom: 16px;">What the model learned:</h4>
        <ul style="margin-left: 20px; color: #475569; line-height: 1.8;">
          <li>Vocabulary of ${Object.keys(getVocabulary()).length} unique words</li>
          <li>Patterns from ${state.dataset.spam.length + state.dataset.normal.length} training examples</li>
          <li>Word frequency distributions for spam vs. normal</li>
          <li>Probability calculations for classification</li>
        </ul>
      </div>
    </div>

    <div class="insight-box">
      <h3>💡 What Training Really Means</h3>
      <p><strong>Training is pattern memorization, not understanding.</strong></p>
      <p>The AI didn't "learn" what spam means. It:</p>
      <ol style="margin-left: 24px; color: #475569; line-height: 1.8; margin-top: 12px;">
        <li>Counted which words appear in your spam examples</li>
        <li>Counted which words appear in your normal examples</li>
        <li>Built statistical tables to compare new messages</li>
        <li>Will now classify based on similarity to training data</li>
      </ol>
      <p style="margin-top: 16px;">
        <strong>Key insight:</strong> AI can only recognize patterns it has seen before. 
        It won't know what to do with completely new types of messages.
      </p>
    </div>
  `;

  resultsSection.style.display = 'block';
  container.querySelector('#continue-btn').style.display = 'block';
  
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function getVocabulary() {
  const vocab = new Set();
  
  [...state.dataset.spam, ...state.dataset.normal].forEach(item => {
    const words = item.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) vocab.add(word);
    });
  });
  
  return Array.from(vocab);
}