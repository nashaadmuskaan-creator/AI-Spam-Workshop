// Utility helper functions

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function animateNumber(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      element.textContent = Math.round(end);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

export function fadeIn(element) {
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let opacity = 0;
  const timer = setInterval(() => {
    opacity += 0.05;
    element.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(timer);
    }
  }, 30);
}

export function fadeOut(element) {
  let opacity = 1;
  const timer = setInterval(() => {
    opacity -= 0.05;
    element.style.opacity = opacity;
    if (opacity <= 0) {
      element.style.display = 'none';
      clearInterval(timer);
    }
  }, 30);
}

export function showElement(element) {
  element.classList.remove('hidden');
  element.classList.add('fade-in');
}

export function hideElement(element) {
  element.classList.add('hidden');
}

export function highlightText(text, keywords) {
  let highlighted = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark style="background: #fef3c7; padding: 2px 4px;">$1</mark>');
  });
  return highlighted;
}

export function countWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

export function getWordFrequency(text) {
  const words = tokenize(text);
  const frequency = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return frequency;
}

export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

export function createConfetti() {
  const colors = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    confetti.style.transition = 'all 2s ease-out';
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.style.top = window.innerHeight + 'px';
      confetti.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}