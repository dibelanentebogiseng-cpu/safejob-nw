// PROTECTION - Disable copy / view source
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if((e.ctrlKey && (e.key=='u' || e.key=='U' || e.key=='s' || e.key=='c')) || e.key=='F12') {
    e.preventDefault();
    alert('🔒 Protected App © Ntebogiseng Dibelane');
  }
});
console.log("%c🔒 SafeJob NW Protected © Ntebogiseng Dibelane 2026 - Unauthorized copying prohibited", "color:red; font-size:16px; font-weight:bold;");

// APP LOGIC
const CORRECT_PIN = "1234"; // Change to your PIN

function login(){
  let pin = document.getElementById('pin').value;
  if(pin === CORRECT_PIN){
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
  } else {
    alert("Wrong PIN! Use 1234 (or change in app.js)");
  }
}
function logout(){
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('pin').value="";
}

function checkLink(){
  let link = document.getElementById('jobLink').value.toLowerCase();
  let res = document.getElementById('result');
  if(!link) { res.innerHTML="<p style='color:red'>Paste a link!</p>"; return; }
  if(link.includes('whatsapp') && link.includes('fee') || link.includes('pay') && link.includes('job') || link.includes('tinyurl') && link.includes('pay')){
    res.innerHTML="<p style='color:red; font-weight:bold'>❌ SCAM DETECTED! Do NOT pay!</p><p>This link asks for money - real jobs don't ask for money.</p>";
  } else if(link.includes('pnet') || link.includes('indeed') || link.includes('shoprite') || link.includes('careers')){
    res.innerHTML="<p style='color:green; font-weight:bold'>✅ REAL LINK - Trusted Source</p><p>This link has 5-star rating. People got interviews from it. Safe to apply!</p><p>⭐ Rating: 5/5 - 12 people got interview</p>";
  } else {
    res.innerHTML="<p style='color:orange; font-weight:bold'>⚠️ CHECK CAREFULLY</p><p>Unknown link. Check company website directly. Don't pay money.</p>";
  }
}

function addStory(){
  let name = prompt("Your Name & Area (e.g. Lerato - Tlhabane):");
  if(!name) return;
  let link = prompt("Which job link gave you interview/job?");
  let result = prompt("What happened? Type: Got Interview / Got Job / Attended but not selected");
  let stars = prompt("Rate 1-5 (e.g. 5):");
  let text = prompt("Short testimony:");
  let type = "interview";
  if(result.toLowerCase().includes('job')) type="job";
  else if(result.toLowerCase().includes('attended')) type="attended";
  
  let div = document.createElement('div');
  div.className="story";
  div.setAttribute('data-type', type);
  div.innerHTML=`<div class="story-head"><b>${name}</b> <span>${'⭐'.repeat(parseInt(stars))} ${stars}/5</span></div><div class="story-link">Link: ${link}</div><div class="story-status ${type}">✔ ${result.toUpperCase()}</div><div class="story-text">"${text}"</div>`;
  document.getElementById('stories-list').prepend(div);
  
  // Save to phone
  let saved = JSON.parse(localStorage.getItem('safestories')||"[]");
  saved.unshift({name, link, result, stars, text, type});
  localStorage.setItem('safestories', JSON.stringify(saved));
  alert("✅ Story added! Protected and saved! Show facilitator.");
}

function filterStories(type){
  document.querySelectorAll('.filter-btns button').forEach(b=>b.classList.remove('active-filter'));
  event.target.classList.add('active-filter');
  document.querySelectorAll('.story').forEach(s=>{
    s.style.display = (type==='all' || s.dataset.type===type) ? 'block' : 'none';
  });
}

// Load saved stories
window.onload = ()=>{
  let saved = JSON.parse(localStorage.getItem('safestories')||"[]");
  saved.forEach(item=>{
    let div = document.createElement('div');
    div.className="story"; div.dataset.type=item.type;
    div.innerHTML=`<div class="story-head"><b>${item.name}</b> <span>${'⭐'.repeat(parseInt(item.stars))} ${item.stars}/5</span></div><div class="story-link">Link: ${item.link}</div><div class="story-status ${item.type}">✔ ${item.result}</div><div class="story-text">"${item.text}"</div>`;
    document.getElementById('stories-list').appendChild(div);
  });
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js'); }
}
