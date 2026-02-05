# 🧠 AI Spam Detective Lab

## A 4-Hour Workshop: Understand AI by Building It

This interactive workshop teaches students how AI systems work by having them recreate the logic of a spam detection system themselves — pattern recognition, feature extraction, training, and ethical considerations.

---

## 🎯 Core Design Philosophy

**Students don't learn ABOUT AI. They BECOME the AI.**

Every activity follows the THINK → TRY → SEE → UNDERSTAND loop:
1. Students predict or decide first
2. They perform the action
3. They observe what happens
4. Only then is the concept revealed

---

## 🚀 Quick Start

### Option 1: Open Locally
1. Download this repository
2. Open `index.html` in a web browser
3. Choose Student or Teacher mode

### Option 2: Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages → Deploy from "main" branch
4. Access at `https://username.github.io/repo-name`

### Option 3: Use any static server
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## 🧑‍🏫 Teacher Quick Guide

### Access Teacher Dashboard
- Password: `teachAI2026`
- Change in `/data/config.json`

### Unlock Codes
- Hour 2: `MACHINE-SIGHT`
- Hour 3: `PROBABILITY-MATH`
- Hour 4: `BIAS-ETHICS`

### Timing
- Each hour: ~60 minutes
- Total workshop: 4 hours
- Can be done over multiple days

---

## 📁 Project Structure

```
ai-spam-workshop/
├── index.html                    # Landing page
├── student/                      # Student interface
│   ├── hour1.html               # Hour 1: Human Thinking
│   ├── hour2.html               # Hour 2: Machine Perception
│   ├── hour3.html               # Hour 3: Probability
│   └── hour4.html               # Hour 4: Ethics
├── admin/
│   └── index.html               # Teacher dashboard
├── css/                         # All styling
├── js/
│   ├── core/                    # State management
│   ├── activities/              # Activity logic
│   └── admin/                   # Teacher functions
└── data/                        # Configuration & messages
```

---

## 🎓 Learning Outcomes

Students will understand:
1. AI learns from patterns, not rules
2. AI processes numbers, not meaning
3. AI gives probabilities, not certainty
4. Bias comes from training data
5. Humans are responsible for AI

---

## 🔧 Customization

### Change Colors
Edit `/css/theme.css`:
```css
--hour1: #10b981;  /* Your color */
```

### Add Messages
Edit `/data/starterMessages.json`

### Change Codes
Edit `/data/config.json`

---

## 📊 What Each Hour Teaches

**Hour 1**: Pattern recognition (students classify spam manually)  
**Hour 2**: Machine perception (tokenization, numbers)  
**Hour 3**: Probability math (training, percentages)  
**Hour 4**: Ethics & bias (breaking AI, responsibility)

---

## 🐛 Troubleshooting

- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Use Chrome/Firefox/Safari (not IE)
- Enable JavaScript

---

## 📄 License

Open for educational use. Share and modify freely!

---

**Goal**: Make students AI-literate, not AI experts. They should question AI, understand its limits, and think critically about its use in society.