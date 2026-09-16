// PROTECTION
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{if((e.ctrlKey&&(e.key=='u'||e.key=='s'||e.key=='c'))||e.key=='F12'){e.preventDefault();alert('🔒 Protected © Ntebogiseng')}});
const DEFAULT_PIN="2468";
let currentUser=JSON.parse(localStorage.getItem('safejob_user')||'null');

function showLoginTab(t){
  document.getElementById('tab-login').classList.toggle('tab-active',t==='login');
  document.getElementById('tab-create').classList.toggle('tab-active',t==='create');
  document.getElementById('login-form').style.display=t==='login'?'block':'none';
  document.getElementById('create-form').style.display=t==='create'?'block':'none';
}
function createUser(){
  let name=document.getElementById('newName').value;
  let area=document.getElementById('newArea').value;
  let pin=document.getElementById('newPin').value;
  let cpin=document.getElementById('confirmPin').value;
  if(!name||!area||!pin){alert('Fill all fields');return}
  if(pin!==cpin){alert('PINs dont match');return}
  if(pin.length!==4){alert('PIN must be 4 digits');return}
  localStorage.setItem('safejob_user',JSON.stringify({name,area,pin}));
  alert('✅ Account created! Now login with PIN '+pin);
  showLoginTab('login');
}
function forgotPin(){
  let u=JSON.parse(localStorage.getItem('safejob_user')||'null');
  if(u){alert('Your PIN is: '+u.pin+'\nName: '+u.name);}else{alert('No account found. Default PIN is 2468 for Ntebogiseng Dibelane. Click Create User to make new.')}
}
function login(){
  let nameIn=document.getElementById('loginName').value;
  let pin=document.getElementById('loginPin').value;
  let saved=JSON.parse(localStorage.getItem('safejob_user')||'null');
  let validPin = saved? saved.pin : DEFAULT_PIN;
  let validName = saved? saved.name : "Ntebogiseng Dibelane";
  let validArea = saved? saved.area : "Rustenburg";
  if(pin===validPin){
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    document.getElementById('welcomeName').innerText="Welcome, "+(nameIn||validName);
    document.getElementById('welcomeArea').innerText=validArea;
  }else{alert('Wrong PIN! Default is 2468. Or create new user.')}
}
function logout(){document.getElementById('main-screen').classList.remove('active');document.getElementById('login-screen').classList.add('active');}
function openSection(s){
  document.querySelectorAll('.section').forEach(el=>el.classList.remove('active-sec'));
  document.querySelectorAll('.m-tab').forEach(b=>b.classList.remove('active-m'));
  document.getElementById('sec-'+s).classList.add('active-sec');
  event.target.classList.add('active-m');
}
function toggleDrop(id){
  let el=document.getElementById(id);
  el.style.display=el.style.display==='none'?'block':'none';
}
function checkLink(){
  let link=document.getElementById('jobLink').value.toLowerCase();
  let res=document.getElementById('result');
  if(!link){res.innerHTML="<p style='color:red'>Paste link!</p>";return}
  if(link.includes('whatsapp')&&link.includes('fee')||link.includes('pay')&&link.includes('job')){
    res.innerHTML="<p style='color:red;font-weight:bold'>❌ SCAM! Don't pay!</p>";
  }else if(link.includes('pnet')||link.includes('indeed')||link.includes('shoprite')||link.includes('careers')){
    res.innerHTML="<p style='color:green;font-weight:bold'>✅ REAL - 5/5 - 12 got interview</p>";
  }else{res.innerHTML="<p style='color:orange'>⚠️ Check carefully - verify company site</p>"}
}
function filterStories(t){
  document.querySelectorAll('.filter-btns button').forEach(b=>b.classList.remove('active-filter'));
  event.target.classList.add('active-filter');
  document.querySelectorAll('.story').forEach(s=>{s.style.display=(t==='all'||s.dataset.type===t)?'block':'none'});
}
function addStory(){
  let name=prompt("Name & Area:");let link=prompt("Link that worked:");let result=prompt("Got Interview / Got Job / Attended:");let stars=prompt("Rate 1-5:");let text=prompt("Testimony:");
  if(!name)return;let type=result.toLowerCase().includes('job')?'job':result.toLowerCase().includes('attended')?'attended':'interview';
  let div=document.createElement('div');div.className='story';div.dataset.type=type;
  div.innerHTML=`<b>${name}</b> <span class="stars">${'⭐'.repeat(parseInt(stars))} ${stars}/5</span><p class="s-link">${link}</p><div class="s-badge ${type}">✔ ${result.toUpperCase()}</div><p class="s-text">"${text}"</p>`;
  document.getElementById('stories-list').prepend(div);
}
window.onload=()=>{if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js')}}
