// SafeJob NW - Works 100% offline
function createUser(){
  const name = document.getElementById('fullName').value.trim();
  const pin = document.getElementById('pin').value.trim();
  if(!name ||!pin){ alert('Please enter Full Name and 4-digit PIN'); return; }
  if(pin.length < 4){ alert('PIN must be 4 digits'); return; }
  localStorage.setItem('sj_name', name);
  localStorage.setItem('sj_pin', pin);
  alert('User created! Now Login');
}

function login(){
  const name = document.getElementById('fullName').value.trim();
  const pin = document.getElementById('pin').value.trim();
  const savedName = localStorage.getItem('sj_name');
  const savedPin = localStorage.getItem('sj_pin');
  if(!savedName){ alert('No user found. Please Create User first.'); return; }
  if(name!== savedName || pin!== savedPin){ alert('Name or PIN not correct. Try again.'); return; }
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('welcome-msg').innerText = `Hello, ${savedName} • Verified`;
  document.getElementById('greeting').innerText = `Qaphela, ${savedName}!`;
  showReports();
}

function logout(){
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('fullName').value = '';
  document.getElementById('pin').value = '';
}
function forgotPin(){
  const savedPin = localStorage.getItem('sj_pin');
  if(savedPin){ alert('Your PIN hint: ' + savedPin[0] + '***. If you forgot, create new user.'); }
  else { alert('No user saved yet.'); }
}
function showTab(tabName){
  document.querySelectorAll('[id^="tab-"]').forEach(el=>el.classList.add('hidden'));
  document.getElementById('tab-'+tabName).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
}

// SAFE OFFLINE CHECK - No need for scam links, we check keywords
function checkJob(){
  const text = document.getElementById('jobInput').value.toLowerCase();
  const resultBox = document.getElementById('result');
  if(!text){ resultBox.innerHTML = 'Please paste advert first.'; return; }

  let score = 0;
  let reasons = [];
  const redFlags = [
    ['pay r', 'pay money', 'upfront fee', 'registration fee', 'r200', 'r150', 'r300', 'uniform fee'],
    ['whatsapp only', 'whatsapp me', 'inbox me', 'no interview'],
    ['urgent', 'immediately', 'today only', 'limited'],
    ['gmail.com', 'yahoo.com', 'no company'],
    ['work from home and earn r', 'earn r5000 per day']
  ];
  if(text.includes('pay') || text.includes('fee') || text.includes('r200')){ score+=3; reasons.push('Asks for money'); }
  if(text.includes('whatsapp') &&!text.includes('co.za')){ score+=2; reasons.push('WhatsApp only contact'); }
  if(text.includes('gmail.com') || text.includes('yahoo')){ score+=1; reasons.push('Uses Gmail not company email'); }
  if(text.includes('urgent') || text.includes('immediately')){ score+=1; reasons.push('Pressure: urgent hiring'); }

  if(score >= 3){
    resultBox.className = 'result-box scam';
    resultBox.innerHTML = `🔴 <b>POSSIBLE SCAM - Qaphela!</b><br><br>Reasons: ${reasons.join(', ')}<br><br>Advice: Do not pay, do not go alone. Verify at Dept of Labour Rustenburg.`;
  } else if(score >=1){
    resultBox.className = 'result-box';
    resultBox.style.borderColor = 'orange'; resultBox.style.color = '#b45309';
    resultBox.innerHTML = `🟡 <b>Be Careful</b><br><br>Found: ${reasons.join(', ')}<br><br>Ask for company address and call them.`;
  } else {
    resultBox.className = 'result-box safe';
    resultBox.innerHTML = `🟢 <b>Looks Safer</b><br><br>No common scam signs found.<br>Still verify company address before you go.`;
  }
}

function reportScam(){
  const link = document.getElementById('reportLink').value.trim();
  if(!link){ alert('Paste number or link first'); return; }
  let reports = JSON.parse(localStorage.getItem('sj_reports') || '[]');
  reports.push({text:link, date:new Date().toLocaleString()});
  localStorage.setItem('sj_reports', JSON.stringify(reports));
  document.getElementById('reportLink').value='';
  showReports();
}
function showReports(){
  let reports = JSON.parse(localStorage.getItem('sj_reports') || '[]');
  const div = document.getElementById('reportList');
  if(!div) return;
  div.innerHTML = reports.map(r=>`<p style="background:#f1f5f9;padding:8px;border-radius:8px">⚠️ ${r.text}<br><small>${r.date}</small></p>`).join('');
}
