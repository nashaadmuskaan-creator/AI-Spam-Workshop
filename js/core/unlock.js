// Hour unlock logic with lock/unlock functionality

export function getUnlockedHour() {
  const unlocked = localStorage.getItem("unlockedHour");
  return unlocked ? parseInt(unlocked) : 1;
}

export function setUnlockedHour(hour) {
  localStorage.setItem("unlockedHour", hour.toString());
}

export function unlockWithCode(inputCode) {
  const codes = {
    "MACHINE-SIGHT": 2,
    "PROBABILITY-MATH": 3,
    "BIAS-ETHICS": 4
  };
  
  const hour = codes[inputCode.toUpperCase().trim()];
  
  if (hour) {
    const currentUnlocked = getUnlockedHour();
    if (hour > currentUnlocked) {
      setUnlockedHour(hour);
    }
    return hour;
  }
  
  return null;
}

export function isHourUnlocked(hour) {
  return hour <= getUnlockedHour();
}

export function unlockNextHour() {
  const current = getUnlockedHour();
  if (current < 4) {
    setUnlockedHour(current + 1);
    return current + 1;
  }
  return current;
}

export function unlockSpecificHour(hour) {
  if (hour >= 1 && hour <= 4) {
    setUnlockedHour(hour);
    return true;
  }
  return false;
}

export function lockHour(hour) {
  const currentUnlocked = getUnlockedHour();
  if (hour > 1 && hour <= currentUnlocked) {
    // Lock this hour and all hours after it
    setUnlockedHour(hour - 1);
    return true;
  }
  return false;
}

export function getUnlockCodeForHour(hour) {
  const codes = {
    2: "MACHINE-SIGHT",
    3: "PROBABILITY-MATH",
    4: "BIAS-ETHICS"
  };
  return codes[hour] || null;
}