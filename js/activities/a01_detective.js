// Activity 1: Human Detective - Spam Classification
import { state, saveState } from '../core/state.js';

let currentIndex = 0;
let messages = [
  { text: "🎁 Congratulations! You've won a FREE iPhone! Click here to claim now!", category: "spam" },
  { text: "Hi, can we reschedule tomorrow's class to 3 PM?", category: "normal" },
  { text: "URGENT: Your account will be suspended. Verify now at bit.ly/verify123", category: "spam" },
  { text: "The homework is due on Friday. Let me know if you have questions.", category: "normal" },
  { text: "Limited time offer! Buy now and get 90% discount!!!", category: "spam" },
  { text: "Thanks for your help with the project yesterday!", category: "normal" },
  { text: "Click this link to claim your prize money NOW!", category: "spam" },
  { text: "The library will be closed this weekend for maintenance.", category: "normal" }
];

export function initActivity1(container) {
  currentIndex = 0;
  state.userDecisions = [];
  renderActivity(container);
}

function renderActivity(container) {
  if (currentIndex >= messages.length) {
    showResults(container);
    return;
  }
  
  const message = messages[currentIndex];
  
  container.innerHTML = `
    <div class="think-prompt">
      Think like a detective. What clues make this spam or normal?
    </div>
    
    <div class="message-card">
      ${message.text}
    </div>
    
    <div class="choice-grid">
      <button class="choice-btn" data-choice="spam">
        🚫 Spam
      </button>
      <button class="choice-btn" data-choice="normal">
        ✅ Normal
      </button>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${(currentIndex / messages.length) * 100}%"></div>
    </div>
    
    <p style="text-align: center; color: #64748b; margin-top: 16px;">
      Message ${currentIndex + 1} of ${messages.length}
    </p>
  `;
  
  // Add click handlers
  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleChoice(container, btn.dataset.choice));
  });
}

function handleChoice(container, choice) {
  const message = messages[currentIndex];
  
  // Store decision
  state.userDecisions.push({
    message: message.text,
    userChoice: choice,
    actualCategory: message.category
  });
  
  currentIndex++;
  
  // Smooth transition
  container.style.transition = 'opacity 0.2s';
  container.style.opacity = '0.3';
  setTimeout(() => {
    renderActivity(container);
    container.style.opacity = '1';
  }, 200);
}

function showResults(container) {
  const correct = state.userDecisions.filter(d => d.userChoice === d.actualCategory).length;
  const total = state.userDecisions.length;
  
  container.innerHTML = `
    <div class="result-reveal">
      <h3>🎯 You made ${total} decisions!</h3>
      <p>You got ${correct} out of ${total} correct.</p>
    </div>
    
    <div class="insight-box">
      <h3>💡 What just happened?</h3>
      <p><strong>You didn't use magic. You used patterns.</strong></p>
      <p>Your brain noticed:</p>
      <ul style="margin: 16px 0 16px 24px; color: #475569;">
        <li>Certain words appearing repeatedly</li>
        <li>Urgent or pushy language</li>
        <li>Too-good-to-be-true promises</li>
        <li>The overall "feeling" of the message</li>
      </ul>
      <p style="margin-top: 16px;">
        <strong>This is exactly what AI does</strong> — but AI can't feel or understand. 
        It only sees patterns in data.
      </p>
    </div>
    
    <button class="primary-btn" id="continue-btn" style="margin-top: 24px;">
      Continue to Activity 2 →
    </button>
  `;
  
  saveState();
  
  // Show next activity when clicked
  container.querySelector('#continue-btn').addEventListener('click', () => {
    document.getElementById('activity-2').scrollIntoView({ behavior: 'smooth' });
    const event = new CustomEvent('activityComplete', { detail: { activity: 1 } });
    document.dispatchEvent(event);
  });
}