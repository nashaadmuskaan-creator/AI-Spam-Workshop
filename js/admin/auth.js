// Admin authentication logic

const ADMIN_PASSWORD = "teachAI2026";

export function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem("isAdmin", "true");
    sessionStorage.setItem("adminLoginTime", Date.now().toString());
    window.location.href = "admin/index.html";
    return true;
  } else {
    alert("❌ Incorrect teacher password. Please try again.");
    return false;
  }
}

export function isAdmin() {
  const admin = sessionStorage.getItem("isAdmin");
  const loginTime = sessionStorage.getItem("adminLoginTime");
  
  // Session expires after 4 hours
  if (admin === "true" && loginTime) {
    const now = Date.now();
    const elapsed = now - parseInt(loginTime);
    const fourHours = 4 * 60 * 60 * 1000;
    
    if (elapsed < fourHours) {
      return true;
    } else {
      adminLogout();
      return false;
    }
  }
  
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem("isAdmin");
  sessionStorage.removeItem("adminLoginTime");
  window.location.href = "../index.html";
}

export function requireAdmin() {
  if (!isAdmin()) {
    alert("⚠️ Teacher access required. Redirecting to login...");
    window.location.href = "../index.html";
    return false;
  }
  return true;
}