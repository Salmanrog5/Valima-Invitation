const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('openInvitation');
const audio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const petalLayer = document.getElementById('petalLayer');
const glitterLayer = document.getElementById('glitterLayer');

let audioStarted = false;

function setAudioButton(isPlaying){
  if(!audioToggle) return;
  audioToggle.textContent = isPlaying ? '❚❚' : '▶';
  audioToggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

async function startAudioFromGesture(){
  if(!audio) return;
  try{
    audio.volume = .55;
    audio.muted = false;
    if(!audioStarted) audio.currentTime = 0;
    await audio.play();
    audioStarted = true;
    setAudioButton(true);
  }catch(err){
    console.warn('Audio playback blocked until user interaction.', err);
    setAudioButton(false);
  }
}

function buildPetals(){
  if(!petalLayer || petalLayer.children.length) return;
  const count = window.innerWidth < 600 ? 20 : 34;
  for(let i=0;i<count;i++){
    const p=document.createElement('span');
    p.className='petal'+(Math.random()>.75?' white':'');
    p.style.left=(Math.random()*100)+'%';
    p.style.setProperty('--w',(7+Math.random()*11)+'px');
    p.style.setProperty('--duration',(9+Math.random()*9)+'s');
    p.style.setProperty('--delay',(-Math.random()*14)+'s');
    p.style.setProperty('--drift4',((-60+Math.random()*120))+'px');
    petalLayer.appendChild(p);
  }
}

function buildGlitter(){
  if(!glitterLayer || glitterLayer.children.length) return;
  const count = window.innerWidth < 600 ? 26 : 48;
  for(let i=0;i<count;i++){
    const s=document.createElement('span');
    s.className='sparkle'+(Math.random()>.72?' star':'');
    s.style.left=(Math.random()*100)+'%';
    s.style.top=(Math.random()*100)+'%';
    s.style.setProperty('--s',(2+Math.random()*4)+'px');
    s.style.setProperty('--twinkle',(1.2+Math.random()*2.2)+'s');
    s.style.setProperty('--delay',(-Math.random()*3)+'s');
    glitterLayer.appendChild(s);
  }
}

function startDecorations(){
  buildPetals();
  buildGlitter();
  requestAnimationFrame(()=>{
    petalLayer?.classList.add('active');
    glitterLayer?.classList.add('active');
  });
}

function revealAll(){
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'), i*90);
  });
}

if(openButton){
  openButton.addEventListener('click', ()=>{
    // Open immediately: audio.play() can remain pending on mobile browsers.
    if(cover) cover.style.display='none';
    if(invitation) invitation.classList.remove('hidden');
    window.scrollTo(0,0);
    startDecorations();
    revealAll();
    // Audio is optional and must never block navigation.
    void startAudioFromGesture();
  });
}

if(audioToggle){
  audioToggle.addEventListener('click', async ()=>{
    if(!audio) return;
    if(audio.paused) await startAudioFromGesture();
    else{
      audio.pause();
      setAudioButton(false);
    }
  });
}

audio?.addEventListener('play',()=>setAudioButton(true));
audio?.addEventListener('pause',()=>setAudioButton(false));

const weddingDate = new Date('2026-11-30T19:30:00+05:30').getTime();
function updateCountdown(){
  let distance = weddingDate - Date.now();
  if(distance < 0) distance = 0;
  const vals = {
    days:Math.floor(distance/86400000),
    hours:Math.floor((distance%86400000)/3600000),
    minutes:Math.floor((distance%3600000)/60000),
    seconds:Math.floor((distance%60000)/1000)
  };
  Object.entries(vals).forEach(([id,val])=>{
    const el=document.getElementById(id);
    if(el) el.textContent=String(val).padStart(2,'0');
  });
}
updateCountdown();
setInterval(updateCountdown,1000);

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{
  revealAll();
}


