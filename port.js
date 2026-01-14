/* Mobile Menu Toggle */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname){
    for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");  
   }
   event.currentTarget.classList.add("active-link");
   document.getElementById(tabname).classList.add("active-tab")
}





function sendMail(){
    let parms = {
    name : document.getElementById("name").value,
    message : document.getElementById("msg").value,
    phone : document.getElementById("ph_num").value,
    email : document.getElementById("email_id").value,
}
emailjs.send("service_3imse18","template_3tbpepl",parms).then(alert("Message Sent"));
}


/* ---------- STATE ---------- */
let guideStep = 0;
let guideActive = true;
let tourMode = "recruiter"; // recruiter | engineer
let voiceEnabled = true;

/* ---------- ELEMENTS ---------- */
let launcher, panel, log, input;

function initARESelements(){
  launcher = document.getElementById("ares-launcher");
  panel = document.getElementById("ares-panel");
  log = document.getElementById("ares-log");
  input = document.getElementById("ares-input");
  
  if(!launcher || !panel || !log || !input){
    console.error("ARES elements not found in DOM");
    return false;
  }
  return true;
}

/* ---------- ANALYTICS (PRIVACY SAFE) ---------- */
const analytics = {
  sectionsViewed: {},
  commandsUsed: {}
};

/* ---------- OPEN / CLOSE ---------- */
function toggleARES(){
  if(!panel) return;
  const isHidden = panel.classList.contains("hidden");
  panel.classList.toggle("hidden");
  
  if(isHidden){
    speak("ARES online. How may I assist?");
  } else {
    speak("Goodbye. ARES signing off.");
  }
}

/* ---------- LOG ---------- */
function write(text){
  const loader = document.getElementById("ares-loader");
  if(loader) loader.classList.add("hidden");
  log.innerHTML += `<div>> ${text}</div>`;
  log.scrollTop = log.scrollHeight;
  speak(text);
}

/* ---------- SHOW LOADER ---------- */
function showAresLoader(){
  const loader = document.getElementById("ares-loader");
  if(loader) loader.classList.remove("hidden");
}

function hideAresLoader(){
  const loader = document.getElementById("ares-loader");
  if(loader) loader.classList.add("hidden");
}

/* ---------- VOICE ---------- */
function speak(text){
  if(!voiceEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.0;
  u.pitch = 1.0;
  u.volume = 0.9;
  window.speechSynthesis.speak(u);
}

/* ---------- COMMAND INPUT ---------- */
function setupInputListener(){
  if(!input) return;
  input.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
      const cmd = input.value.toLowerCase();
      input.value="";
      handle(cmd);
    }
  });
}

/* ---------- HANDLE COMMAND ---------- */
function handle(cmd){
  guideActive = false;
  analytics.commandsUsed[cmd] = (analytics.commandsUsed[cmd] || 0) + 1;

  write(cmd);

  if(cmd==="about"){
    write("Kaustub Mocherla is a Computer Science student passionate about building secure tech solutions.");
    scrollToSection("about");
  }
  else if(cmd==="skills"){
    write("Core skills: Python, Java, C, HTML5, CSS, JavaScript, Bootstrap, AngularJS, MySQL, Git & Github.");
    scrollToSection("about");
  }
  else if(cmd==="projects"){
    write("Navigating to selected projects.");
    scrollToSection("projects");
  }
  else if(cmd==="resume"){
    window.open("Resume.pdf","_blank");
    write("Opening resume.");
  }
  else if(cmd==="contact"){
    write("Navigating to contact information.");
    scrollToSection("contact");
  }
  else{
    write("Unknown command. Try about, skills, projects, resume, contact.");
  }
}

/* ---------- SCROLL + TRACK ---------- */
function scrollToSection(id){
  const el = document.getElementById(id);
  if(el){
    el.scrollIntoView({behavior:"smooth"});
    analytics.sectionsViewed[id] = (analytics.sectionsViewed[id] || 0) + 1;
  }
}

/* ---------- TOUR FLOWS ---------- */
const guideFlowRecruiter = [
  { text: "Welcome. Initializing candidate profile." },
  { text: "This portfolio belongs to Kaustub Mocherla, Computer Science student and aspiring software engineer." },
  { text: "Highlighting core skills.", action: () => scrollToSection("about") },
  { text: "Next, selected projects with real-world impact.", action: () => scrollToSection("projects") },
  { text: "You may view the resume or contact details at any time." }
];

const guideFlowEngineer = [
  { text: "Initializing technical walkthrough." },
  { text: "Focus areas include web development, IoT systems, and network security." },
  { text: "Reviewing technical skill stack.", action: () => scrollToSection("about") },
  { text: "Exploring impactful projects.", action: () => scrollToSection("projects") },
  { text: "Use commands for deeper inspection." }
];

/* ---------- AUTO GUIDE ---------- */
function startAutoGuide(){
  if(!guideActive) return;

  const flow = tourMode === "recruiter"
    ? guideFlowRecruiter
    : guideFlowEngineer;

  if(guideStep >= flow.length) return;

  const step = flow[guideStep];
  write(step.text);

  if(step.action){
    setTimeout(step.action, 1200);
  }

  guideStep++;
  setTimeout(startAutoGuide, 4200);
}

/* ---------- CONTROLS ---------- */
function skipTour(){
  guideActive = false;
  write("Tour skipped. Manual mode enabled.");
}

function restartTour(){
  guideStep = 0;
  guideActive = true;
  write("Restarting guided tour.");
  startAutoGuide();
}

function toggleMode(){
  tourMode = tourMode === "recruiter" ? "engineer" : "recruiter";
  write(`Mode switched to ${tourMode}.`);
  document.querySelector("#ares-controls button:nth-child(3)").innerText =
    `Mode: ${tourMode.charAt(0).toUpperCase() + tourMode.slice(1)}`;
}

function toggleVoice(){
  voiceEnabled = !voiceEnabled;
  write(`Voice ${voiceEnabled ? "enabled" : "disabled"}.`);
  document.querySelector("#ares-controls button:nth-child(4)").innerText =
    `Voice: ${voiceEnabled ? "ON" : "OFF"}`;
}

/* ---------- AUTO START ---------- */
window.addEventListener("load", () => {
  if(!initARESelements()) return;
  
  launcher.onclick = toggleARES;
  setupInputListener();
  
  // Load voices
  if(window.speechSynthesis){
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
  
  // Hide page loader
  const pageLoader = document.getElementById("page-loader");
  if(pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add("hidden");
    }, 800);
  }
  
  setTimeout(() => {
    panel.classList.remove("hidden");
    startAutoGuide();
  }, 2000);
});

/* ---------- DEBUG ANALYTICS ---------- */
window.addEventListener("beforeunload", () => {
  console.log("ARES Analytics:", analytics);
});

/* ---------- BOOT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  write("ARES system initialized. Type help or wait for guided tour.");
});

/* ---------- VFX CANVAS (particles + mouse glow) ---------- */
const fx = document.getElementById("fx");
if(fx) {
  const ctx = fx.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  
  function resize() {
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = fx.width = Math.floor(window.innerWidth * DPR);
    H = fx.height = Math.floor(window.innerHeight * DPR);
  }
  window.addEventListener("resize", resize);
  resize();

  const particles = [];
  const PCOUNT = 100;
  for (let i = 0; i < PCOUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3 * DPR,
      vy: (Math.random() - 0.5) * 0.3 * DPR,
      r: (Math.random() * 1.8 + 0.6) * DPR,
      a: Math.random() * 0.6 + 0.15
    });
  }
  
  let mouse = { x: W * 0.5, y: H * 0.3 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * DPR;
    mouse.y = e.clientY * DPR;
  });

  function drawFX() {
    ctx.clearRect(0, 0, W, H);

    // Soft mouse glow (red theme)
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220 * DPR);
    g.addColorStop(0, "rgba(255, 0, 79, 0.08)");
    g.addColorStop(0.5, "rgba(255, 26, 26, 0.05)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Particles + links
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Attract to mouse
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
      if (dist < 260 * DPR) {
        p.vx += (dx / dist) * 0.0008 * DPR;
        p.vy += (dy / dist) * 0.0008 * DPR;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 79, ${p.a})`;
      ctx.fill();
    }

    // Links between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const max = (140 * DPR) * (140 * DPR);
        if (d2 < max) {
          const alpha = (1 - d2 / max) * 0.14;
          ctx.strokeStyle = `rgba(255, 26, 26, ${alpha})`;
          ctx.lineWidth = 1 * DPR;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawFX);
  }
  drawFX();
}
