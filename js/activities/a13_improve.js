// Activity 13: Bias & Ethics - Understanding AI Responsibility
import { state, saveState } from '../core/state.js';

const scenarios = [
  {
    title: "Biased Training Data",
    situation: "Your spam detector was trained mostly on English spam emails. Now it's being used in a Spanish-speaking school.",
    question: "What will happen?",
    options: [
      { text: "It will work perfectly", correct: false },
      { text: "It will miss Spanish spam or flag normal Spanish messages", correct: true },
      { text: "It will automatically learn Spanish", correct: false }
    ],
    explanation: "AI can only recognize patterns it was trained on. If it never saw Spanish messages, it won't know how to classify them correctly. This is called training bias.",
    lesson: "AI trained on one population may fail when used on another."
  },
  {
    title: "False Positives Impact",
    situation: "Your school's AI spam filter blocks a message about a scholarship opportunity because it contains the word 'free.'",
    question: "Who is responsible for this mistake?",
    options: [
      { text: "The AI is responsible", correct: false },
      { text: "The people who built and deployed the AI", correct: true },
      { text: "The student who missed the scholarship", correct: false }
    ],
    explanation: "AI is a tool. Humans decide how to build it, what data to train it on, and where to deploy it. When AI makes mistakes, the responsibility lies with its creators and users.",
    lesson: "Humans, not AI, are responsible for AI's impacts."
  },
  {
    title: "Improving the Model",
    situation: "Your AI keeps misclassifying messages from students who use informal slang as spam.",
    question: "What's the best solution?",
    options: [
      { text: "Tell students to stop using slang", correct: false },
      { text: "Add more diverse training examples with slang", correct: true },
      { text: "Increase the AI's confidence threshold", correct: false }
    ],
    explanation: "The problem is that the training data doesn't represent how students actually communicate. Adding diverse examples that include slang will help the AI learn these patterns.",
    lesson: "Diverse, representative training data reduces bias."
  }
];

let currentScenario = 0;
let correctAnswers = 0;

export function initActivity13(container) {
  currentScenario = 0;
  correctAnswers = 0;
  renderScenario(container);
}

function renderScenario(container) {
  if (currentScenario >= scenarios.length) {
    showFinalReflection(container);
    return;
  }

  const scenario = scenarios[currentScenario];

  container.innerHTML = `
    <div class="think-prompt">
      What happens when AI makes mistakes? Who's responsible? Let's explore real ethical questions.
    </div>

    <div class="interaction-area">
      <div style="background: white; padding: 28px; border-radius: 12px; margin-bottom: 24px;">
        <div style="background: linear-gradient(135deg, #f3e8ff, #e9d5ff); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #6b21a8; margin-bottom: 12px;">
            Scenario ${currentScenario + 1}: ${scenario.title}
          </h3>
          <p style="color: #581c87; font-size: 1.05rem; line-height: 1.7;">
            ${scenario.situation}
          </p>
        </div>

        <p style="font-weight: 600; font-size: 1.1rem; margin: 24px 0 16px 0; color: #334155;">
          ${scenario.question}
        </p>

        <div id="options-container" style="display: grid; gap: 12px;">
          ${scenario.options.map((option, idx) => `
            <button 
              class="option-btn"
              data-idx="${idx}"
              style="padding: 16px 20px; border: 2px solid #e2e8f0; background: white; border-radius: 10px; text-align: left; cursor: pointer; transition: all 0.2s; font-size: 1rem;"
            >
              ${option.text}
            </button>
          `).join('')}
        </div>

        <div id="feedback" style="display: none; margin-top: 24px;"></div>
      </div>
    </div>

    <button class="primary-btn" id="next-btn" style="display: none; margin-top: 24px;">
      ${currentScenario < scenarios.length - 1 ? 'Next Scenario →' : 'See Final Insights →'}
    </button>
  `;

  setupEventListeners(container, scenario);
}

function setupEventListeners(container, scenario) {
  const optionButtons = container.querySelectorAll('.option-btn');
  const nextBtn = container.querySelector('#next-btn');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      handleAnswer(container, scenario, idx);
    });
  });

  nextBtn.addEventListener('click', () => {
    currentScenario++;
    renderScenario(container);
  });
}

function handleAnswer(container, scenario, selectedIdx) {
  const feedbackDiv = container.querySelector('#feedback');
  const optionButtons = container.querySelectorAll('.option-btn');
  const selectedOption = scenario.options[selectedIdx];
  
  const isCorrect = selectedOption.correct;
  if (isCorrect) correctAnswers++;

  // Disable all buttons and show correct/incorrect
  optionButtons.forEach((btn, idx) => {
    btn.style.pointerEvents = 'none';
    
    if (scenario.options[idx].correct) {
      btn.style.borderColor = '#10b981';
      btn.style.background = '#f0fdf4';
      btn.style.fontWeight = '600';
    } else if (idx === selectedIdx && !isCorrect) {
      btn.style.borderColor = '#ef4444';
      btn.style.background = '#fef2f2';
    } else {
      btn.style.opacity = '0.5';
    }
  });

  feedbackDiv.innerHTML = `
    <div style="background: ${isCorrect ? '#f0fdf4' : '#fef2f2'}; padding: 20px; border-radius: 10px; border-left: 4px solid ${isCorrect ? '#10b981' : '#ef4444'};">
      <h4 style="color: ${isCorrect ? '#065f46' : '#991b1b'}; margin-bottom: 12px;">
        ${isCorrect ? '✓ Correct!' : '✗ Not Quite'}
      </h4>
      <p style="color: ${isCorrect ? '#047857' : '#7f1d1d'}; line-height: 1.7; margin-bottom: 16px;">
        ${scenario.explanation}
      </p>
      <div style="background: rgba(255,255,255,0.7); padding: 14px; border-radius: 8px; margin-top: 12px;">
        <p style="font-weight: 600; color: #475569; margin-bottom: 6px;">Key Lesson:</p>
        <p style="color: #334155; font-weight: 500;">${scenario.lesson}</p>
      </div>
    </div>
  `;

  feedbackDiv.style.display = 'block';
  container.querySelector('#next-btn').style.display = 'block';

  setTimeout(() => {
    feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function showFinalReflection(container) {
  const score = correctAnswers;
  const total = scenarios.length;

  container.innerHTML = `
    <div class="result-reveal">
      <h3>🎓 Ethics Score: ${score}/${total}</h3>
      <p>You've completed all ethical scenarios. Now let's reflect on what this means.</p>
    </div>

    <div class="insight-box" style="margin-top: 24px;">
      <h3>⚖️ Core Principles of AI Ethics</h3>

      <div style="margin: 24px 0;">
        <div style="padding: 20px; background: white; border-radius: 10px; margin-bottom: 16px; border-left: 4px solid var(--accent);">
          <h4 style="color: var(--accent); margin-bottom: 8px;">1. Bias is Inevitable</h4>
          <p style="color: #475569; line-height: 1.7;">
            AI learns from data created by humans. If that data reflects human biases (conscious or unconscious), 
            the AI will learn and amplify those biases. There's no such thing as "neutral" AI.
          </p>
        </div>

        <div style="padding: 20px; background: white; border-radius: 10px; margin-bottom: 16px; border-left: 4px solid var(--accent);">
          <h4 style="color: var(--accent); margin-bottom: 8px;">2. Humans Are Responsible</h4>
          <p style="color: #475569; line-height: 1.7;">
            AI doesn't make decisions — it produces outputs based on patterns. Humans decide what to build, 
            how to train it, and where to deploy it. When AI causes harm, the responsibility lies with people, not machines.
          </p>
        </div>

        <div style="padding: 20px; background: white; border-radius: 10px; margin-bottom: 16px; border-left: 4px solid var(--accent);">
          <h4 style="color: var(--accent); margin-bottom: 8px;">3. Mistakes Have Real Impact</h4>
          <p style="color: #475569; line-height: 1.7;">
            A spam filter's mistake might mean a student misses a scholarship. A facial recognition error 
            could lead to wrongful arrest. AI decisions affect real people's lives.
          </p>
        </div>

        <div style="padding: 20px; background: white; border-radius: 10px; margin-bottom: 16px; border-left: 4px solid var(--accent);">
          <h4 style="color: var(--accent); margin-bottom: 8px;">4. Improvement Requires Diversity</h4>
          <p style="color: #475569; line-height: 1.7;">
            Better AI comes from diverse teams building it and diverse data training it. 
            If everyone building AI looks the same and thinks the same, they'll miss important problems.
          </p>
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #f3e8ff, #e9d5ff); padding: 32px; border-radius: 16px; margin-top: 32px;">
      <h3 style="color: #6b21a8; margin-bottom: 16px; text-align: center;">
        🎯 Final Student Takeaway
      </h3>
      <div style="background: white; padding: 24px; border-radius: 12px;">
        <p style="font-size: 1.15rem; line-height: 1.8; color: #334155; text-align: center; margin-bottom: 16px;">
          <strong>"AI decides spam by comparing word patterns from past messages and choosing the most likely option."</strong>
        </p>
        <p style="color: #64748b; text-align: center;">
          But now you also know: AI doesn't understand meaning, can be fooled, carries biases, 
          and requires human responsibility.
        </p>
      </div>
    </div>

    <div style="background: white; padding: 28px; border-radius: 12px; margin-top: 32px; text-align: center;">
      <h3 style="color: var(--accent); margin-bottom: 16px;">✨ Questions to Keep Asking</h3>
      <ul style="text-align: left; margin: 20px auto; max-width: 600px; color: #475569; line-height: 2;">
        <li>Who built this AI and what data did they use?</li>
        <li>Can the AI explain its decisions?</li>
        <li>Who is affected if the AI makes a mistake?</li>
        <li>Does the AI work equally well for everyone?</li>
        <li>Should AI be making this decision at all?</li>
      </ul>
      <p style="margin-top: 24px; color: #64748b; font-style: italic;">
        These questions make you an informed, critical user of AI technology.
      </p>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 40px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 16px;">
      <h2 style="font-size: 2.5rem; margin-bottom: 16px;">🎉</h2>
      <h2 style="color: #065f46; margin-bottom: 12px;">Workshop Complete!</h2>
      <p style="font-size: 1.2rem; color: #047857;">
        You've completed all 13 activities and understand how AI spam detection really works.
      </p>
    </div>

    <button class="primary-btn" id="finish-btn" style="margin-top: 32px; width: 100%; padding: 20px; font-size: 1.2rem;">
      🏠 Return to Home
    </button>
  `;

  saveState();

  container.querySelector('#finish-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}