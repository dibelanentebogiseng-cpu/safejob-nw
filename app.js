document.addEventListener('contextmenu',e=>e.preventDefault());
const DEFAULT_PIN="2468";
function showCreate(){
  document.getElementById('login-form').style.display='none';
  document.getElementById('create-form').style.display='block';
}
function showLogin(){
  document.getElementById('create-form').style.display='none';
  document.getElementById('login-form').style.display='block';
}
function createUser(){
  let name=document.getElementById('newName').value;
  let area=document.getElementById('newArea').value;
  let pin=document.getElementById('newPin').value;
  let cpin=document.getElementById('confirmPin').value;
  if(!name||!area||!pin){alert('Please fill all fields');return}
  if(pin!==cpin){alert('PINs dont match');return}
  if(pin.length<4){alert('PIN must be 4 digits');return}
  localStorage.setItem('safejob_user',JSON.stringify({name,area,pin}));
  alert('✅ Account created for '+name+'! Now Login with your PIN');
  showLogin();
}
function forgotPin(){
  let u=JSON.parse(localStorage.getItem('safejob_user')||'null');
  if(u){alert('🔑 Your PIN is: '+u.pin+'\nName: '+u.name);}else{alert('Default account: Ntebogiseng Dibelane\nPIN: 2468\nOr create new user');}
}
function login(){
  let pin=document.getElementById('loginPin').value;
  let nameIn=document.getElementById('loginName').value;
  let saved=JSON.parse(localStorage.getItem('safejob_user')||'null');
  let validPin=saved?saved.pin:DEFAULT_PIN;
  let validName=saved?saved.name:"Ntebogiseng Dibelane";
  let validArea=saved?saved.area:"Rustenburg";
  if(pin===validPin){
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    document.getElementById('welcomeName').innerText="Welcome, "+(nameIn||validName);
    document.getElementById('welcomeArea').innerText=validArea;
  }else{alert('Wrong PIN! Try 2468 or create new user');}
}
function logout(){document.getElementById('main-screen').classList.remove('active');document.getElementById('login-screen').classList.add('active');}
function openSection(s){
  document.querySelectorAll('.section').forEach(el=>el.classList.remove('active-sec'));
  document.querySelectorAll('.m-tab').forEach(b=>b.classList.remove('active-m'));
  document.getElementById('sec-'+s).classList.add('active-sec');
  event.target.classList.add('active-m');
}
function toggleDrop(id){let el=document.getElementById(id);el.style.display=el.style.display==='none'?'block':'none';}
function checkLink(){
  let link=document.getElementById('jobLink').value.toLowerCase();
  let res=document.getElementById('result');
  if(!link){res.innerHTML="<p style='color:red'>Paste link!</p>";return}
  if(link.includes('whatsapp')&&link.includes('fee')||link.includes('pay')&&link.includes('job')){res.innerHTML="<p style='color:red;font-weight:bold'>❌ SCAM! Don't pay!</p>";}
  else if(link.includes('pnet')||link.includes('indeed')||link.includes('shoprite')){res.innerHTML="<p style='color:green;font-weight:bold'>✅ REAL - 5/5 - People got interview</p>";}
  else{res.innerHTML="<p style='color:orange'>⚠️ Check company site directly</p>";}
}
function filterStories(t){document.querySelectorAll('.filter-btns button').forEach(b=>b.classList.remove('active-filter'));event.target.classList.add('active-filter');document.querySelectorAll('.story').forEach(s=>{s.style.display=(t==='all'||s.dataset.type===t)?'block':'none'});}
function addStory(){let n=prompt("Name & Area:");let l=prompt("Link:");let r=prompt("Got Interview/Job/Attended:");if(!n)return;let type=r.toLowerCase().includes('job')?'job':r.toLowerCase().includes('attended')?'attended':'interview';let d=document.createElement('div');d.className='story';d.dataset.type=type;d.innerHTML=`<b>${n}</b><p class="s-link">${l}</p><div class="s-badge ${type}">✔ ${r.toUpperCase()}</div>`;document.getElementById('stories-list').prepend(d);}
window.onload=()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js')}
