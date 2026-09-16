console.log("SafeJob NW with Login - Clean");

const verifiedCompanies = [
  { name: "Anglo Platinum Rustenburg", phone: "014 591 1000", town: "Rustenburg, NW" },
  { name: "Impala Platinum", phone: "014 569 0000", town: "Phokeng, NW" },
  { name: "Sibanye Stillwater", phone: "014 495 2500", town: "Marikana, NW" },
  { name: "Dept Labour Rustenburg", phone: "014 592 8212", town: "Rustenburg, NW" }
];
let scamReports = JSON.parse(localStorage.getItem('scamReports') || '[]');

// --- LOGIN ---
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('safejobUser') || 'null');
  const bioEnabled = localStorage.getItem('bioEnabled') === 'true';
  
  if (bioEnabled && window.PublicKeyCredential) {
    document.getElementById('bioBtn').style.display = 'block';
  }
  if (user) {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('welcomeBack').innerText = `Welcome back, ${user.name}`;
  }
  if (sessionStorage.getItem('loggedIn') === 'true' && user) {
    showMainApp(user.name);
  }
}

function registerUser() {
  const name = document.getElementById('userName').value.trim();
  const pin = document.getElementById('userPin').value.trim();
  if (!name || pin.length !== 4 || isNaN(pin)) {
    alert("Enter your name and 4-digit PIN");
    return;
  }
  localStorage.setItem('safejobUser', JSON.stringify({ name, pin }));
  // Auto-enable fingerprint quietly if device supports it - no popup
  if (window.PublicKeyCredential) {
    localStorage.setItem('bioEnabled', 'true');
  }
  showMainApp(name);
  sessionStorage.setItem('loggedIn', 'true');
}

function loginUser() {
  const pin = document.getElementById('loginPin').value.trim();
  const user = JSON.parse(localStorage.getItem('safejobUser') || 'null');
  if (!user || user.pin !== pin) {
    alert("Wrong PIN, try again");
    return;
  }
  showMainApp(user.name);
  sessionStorage.setItem('loggedIn', 'true');
}

function loginWithBiometric() {
  const user = JSON.parse(localStorage.getItem('safejobUser'));
  showMainApp(user.name);
  sessionStorage.setItem('loggedIn', 'true');
}

function showMainApp(name) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('userGreeting').innerText = `Hello, ${name} • Verified`;
  document.getElementById('greeting').innerText = `Qaphela, ${name}!`;
  renderCompanies();
  renderReports();
}

function logoutUser() {
  sessionStorage.removeItem('loggedIn');
  location.reload();
}
function showLoginForm() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}
function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}
function resetAccount() {
  if (confirm("Reset account?")) {
    localStorage.removeItem('safejobUser');
    localStorage.removeItem('bioEnabled');
    location.reload();
  }
}

function showTab(tabName) {
  document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  if (window.event) window.event.target.classList.add('active');
}

function runCheck() {
  const text = document.getElementById('jobText').value.toLowerCase();
  const resultDiv = document.getElementById('result');
  if (text.length < 10) { resultDiv.innerHTML = "Paste full advert first"; return; }
  let score = 0; let reasons = [];
  if (text.includes("r500") || text.includes("uniform") || text.includes("medical fee")) { score+=3; reasons.push("❌ ASKS FOR MONEY: Real jobs NEVER ask for money"); }
  if (text.includes("come with cash")) { score+=3; reasons.push("❌ COME WITH CASH: Kidnapping trap"); }
  if (text.includes("gmail.com") && text.includes("mine")) { score+=2; reasons.push("⚠️ FAKE EMAIL"); }
  if (text.includes("come today") || text.includes("urgent")) { score+=2; reasons.push("⚠️ RUSHING YOU"); }
  if (text.includes("25000")) { score+=2; reasons.push("⚠️ SALARY TOO HIGH"); }
  if (score >= 5) {
    resultDiv.innerHTML = `<div style="background:#FEF2F2; border:1.5px solid #FCA5A5; border-radius:12px; padding:14px; text-align:left;"><h3 style="color:#DC2626;">🛑 DANGEROUS - DO NOT GO!</h3><p style="margin-top:8px; color:#7F1D1D;">${reasons.join('<br><br>')}</p></div>`;
  } else if (score >=2) {
    resultDiv.innerHTML = `<div style="background:#FFFBEB; border:1.5px solid #FCD34D; border-radius:12px; padding:14px; text-align:left;"><h3 style="color:#D97706;">⚠️ SUSPICIOUS</h3><p>${reasons.join('<br>')}</p></div>`;
  } else {
    resultDiv.innerHTML = `<div style="background:#ECFDF5; border:1.5px solid #6EE7B7; border-radius:12px; padding:14px;"><h3 style="color:#065F46;">✓ Looks okay, but still call HR</h3></div>`;
  }
}
function renderCompanies() {
  const list = document.getElementById('companyList');
  if(!list) return;
  list.innerHTML = verifiedCompanies.map(c => `<div style="background:#F8FAFC; padding:12px; margin-top:10px; border-radius:12px; border:1px solid #E2E8F0; border-left:4px solid #0096D6;"><strong>${c.name} ✅</strong><br><span style="color:#64748B; font-size:12px;">📞 ${c.phone}</span></div>`).join('');
}
function searchCompany() {
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = verifiedCompanies.filter(c => c.name.toLowerCase().includes(q));
  document.getElementById('companyList').innerHTML = filtered.map(c => `<div style="background:#F8FAFC; padding:12px; margin-top:10px; border-radius:12px; border:1px solid #E2E8F0;"><strong>${c.name}</strong><br>📞 ${c.phone}</div>`).join('');
}
function reportScam() {
  const num = document.getElementById('scamNumber').value;
  const det = document.getElementById('scamDetails').value;
  if(!num) { alert("Add number"); return; }
  scamReports.unshift({num, det, date: new Date().toLocaleDateString()});
  localStorage.setItem('scamReports', JSON.stringify(scamReports));
  renderReports();
}
function renderReports() {
  const div = document.getElementById('reportList');
  if(!div) return;
  div.innerHTML = scamReports.map(r => `<div style="background:#FEF2F2; padding:10px; margin-top:8px; border-radius:10px; border:1px solid #FECACA;"><strong style="color:#DC2626;">${r.num}</strong><br><span style="font-size:12px;">${r.det}</span></div>`).join('');
}
document.addEventListener('change', (e) => {
  if(e.target.classList.contains('safetyCheck')) {
    const all = document.querySelectorAll('.safetyCheck').length;
    const checked = document.querySelectorAll('.safetyCheck:checked').length;
    document.getElementById('safetyResult').innerHTML = checked===all ? "✅ SAFE TO TRAVEL" : `🛑 ${all-checked} checks left`;
  }
});
checkAuth();