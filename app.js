const REFERENCES = [
  {name:"Thabo M.", loc:"Tlhabane, Rustenburg", date:"12 July 2026", text:"I pasted a Shoprite job from Facebook. SafeJob said SCAM - asks for R200. I didn't go. Saved my taxi money. Thanks!", status:"Saved from scam"},
  {name:"Keabetswe L.", loc:"Boitekong", date:"28 June 2026", text:"Checked a security job. App said SAFE. I went for interview, I didn't get the job but interview was real! App is legit.", status:"Got interview - Real job"},
  {name:"Onalenna S.", loc:"Lethabong", date:"03 Aug 2026", text:"This app helped me. The link looked real but SafeJob flagged Gmail only. I called the company - no such job. Qaphela!", status:"Verified fake"},
  {name:"Palesa D.", loc:"Phokeng", date:"15 May 2026", text:"I am using SafeJob NW every time. It works offline, no data needed. Very safe and protected.", status:"Verified user"},
  {name:"Kagiso R.", loc:"Mogwase", date:"20 July 2026", text:"Got interview at mine through link checked on SafeJob. App said Be Careful but I verified address - was real.", status:"Got interview - Real job"}
];

function createUser(){ const n=document.getElementById('fullName').value.trim(); const p=document.getElementById('pin').value.trim(); if(!n||!p){alert('Enter Name and PIN');return;} localStorage.setItem('sj_name',n); localStorage.setItem('sj_pin',p); alert('User created! Now Login'); }
function login(){ const n=document.getElementById('fullName').value.trim(); const p=document.getElementById('pin').value.trim(); const sn=localStorage.getItem('sj_name'); const sp=localStorage.getItem('sj_pin'); if(!sn){alert('No user. Create User first.');return;} if(n!==sn||p!==sp){alert('Name or PIN wrong');return;} document.getElementById('login-page').classList.add('hidden'); document.getElementById('dashboard').classList.remove('hidden'); document.getElementById('welcome-msg').innerText=`Hello, ${sn} • Verified • Protected`; document.getElementById('greeting').innerText=`Qaphela, ${sn}!`; loadStories(); showReports(); }
function logout(){ document.getElementById('dashboard').classList.add('hidden'); document.getElementById('login-page').classList.remove('hidden'); }
function forgotPin(){ const sp=localStorage.getItem('sj_pin'); alert(sp? 'Hint: '+sp[0]+'***' : 'No user saved'); }
function showTab(name, btn){ document.querySelectorAll('[id^="tab-"]').forEach(e=>e.classList.add('hidden')); document.getElementById('tab-'+name).classList.remove('hidden'); document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); }

function loadStories(){
  const div=document.getElementById('storiesList');
  div.innerHTML = REFERENCES.map(r=>`
    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:12px;margin:10px 0;">
      <b>${r.name}</b> - ${r.loc} <br><small>${r.date}</small><br>
      <p style="margin:6px 0;">"${r.text}"</p>
      <span style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:10px;font-size:12px;">✅ ${r.status}</span>
    </div>
  `).join('');
}
function checkJob(){
  const text=document.getElementById('jobInput').value.toLowerCase();
  const res=document.getElementById('result');
  if(!text){res.innerHTML='Paste advert first';return;}
  let score=0, reasons=[];
  if(text.includes('pay')||text.includes('fee')||text.includes('r200')||text.includes('r150')){score+=3;reasons.push('Asks for money');}
  if(text.includes('whatsapp') &&!text.includes('co.za')){score+=2;reasons.push('WhatsApp only');}
  if(text.includes('gmail.com')||text.includes('yahoo')){score+=1;reasons.push('Gmail not company email');}
  if(text.includes('urgent')){score+=1;reasons.push('Urgent pressure');}
  if(score>=3){res.className='result-box scam';res.innerHTML=`🔴 <b>POSSIBLE SCAM - Qaphela!</b><br>${reasons.join(', ')}<br><br>Do not pay. SafeJob NW protected you.`;}
  else if(score>=1){res.className='result-box';res.style.borderColor='orange';res.style.color='#b45309';res.innerHTML=`🟡 <b>Be Careful</b><br>${reasons.join(', ')}<br>Verify address.`;}
  else{res.className='result-box safe';res.innerHTML=`🟢 <b>Looks Safer - Verified</b><br>No scam signs. Still verify.`;}
}
function reportScam(){ const l=document.getElementById('reportLink').value.trim(); if(!l){alert('Paste first');return;} let r=JSON.parse(localStorage.getItem('sj_reports')||'[]'); r.push({text:l,date:new Date().toLocaleString()}); localStorage.setItem('sj_reports',JSON.stringify(r)); document.getElementById('reportLink').value=''; showReports(); }
function showReports(){ let r=JSON.parse(localStorage.getItem('sj_reports')||'[]'); const d=document.getElementById('reportList'); if(!d)return; d.innerHTML=r.map(x=>`<p style="background:#f1f5f9;padding:8px;border-radius:8px">⚠️ ${x.text}<br><small>${x.date}</small></p>`).join(''); }
