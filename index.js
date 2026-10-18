let song = document.getElementById("song");
let btn = document.getElementById("btn");
let playtime = document.getElementById("playtime");
let progress = document.getElementById("progress");
let songphoto = document.getElementById("songimage");

btn.addEventListener("click", function () {
  if (song.paused) {
    song.play();
  } else {
    song.pause();
  }
});

song.addEventListener("play", function () {
  btn.innerHTML = "&#9208;";
  songphoto.classList.add("rotating");
  songphoto.classList.remove("paused");
});

song.addEventListener("pause", function () {
  btn.innerHTML = "&#9654;";
  songphoto.classList.add("paused");
});

song.addEventListener("timeupdate", function () {
  let minutes = Math.floor(song.currentTime / 60);
  let seconds = Math.floor(song.currentTime % 60);
  playtime.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;

  if (song.duration) {
    progress.style.width = (song.currentTime / song.duration) * 100 + "%";
  }
});

const unlockEvents = ["pointerdown", "touchstart", "keydown"];

function removeUnlockListeners() {
  unlockEvents.forEach(function (evt) {
    document.removeEventListener(evt, unlockAudio);
  });
}

function unlockAudio(e) {
  removeUnlockListeners();
  if (e.target && btn.contains(e.target)) return;
  song.play();
}

function tryAutoplay() {
  let attempt = song.play();
  if (attempt !== undefined) {
    attempt.catch(function () {
      unlockEvents.forEach(function (evt) {
        document.addEventListener(evt, unlockAudio);
      });
    });
  }
}

window.addEventListener("load", function () {
  let loader = document.getElementById("loader");

  setTimeout(function () {
    loader.classList.add("hidden");
    tryAutoplay();
    startFireworks();   // <-- added
  }, 2500);
});


const fwCanvas = document.getElementById("fireworks");
const fw = fwCanvas.getContext("2d");
const colors = ["#ff8fb3", "#D96C93", "#c9b6ff", "#9fd8ff", "#ffd6e5", "#ffe08a", "#ffffff"];
let rockets = [];
let sparks = [];
let fwRunning = false;
let autoTimer = null;

function resizeFw() {
  const dpr = window.devicePixelRatio || 1;
  fwCanvas.width = window.innerWidth * dpr;
  fwCanvas.height = window.innerHeight * dpr;
  fw.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeFw();
window.addEventListener("resize", resizeFw);

function launchRocket(targetX, targetY) {
  const w = window.innerWidth, h = window.innerHeight;
  rockets.push({
    x: targetX ?? Math.random() * w * 0.8 + w * 0.1,
    y: h,
    targetY: targetY ?? Math.random() * h * 0.4 + h * 0.08,
    speed: 7 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function explode(x, y, color) {
  const count = 60 + Math.floor(Math.random() * 30);
  const shapeHearts = Math.random() < 0.2;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    let vx, vy;
    if (shapeHearts) {
      // heart-shaped burst
      const t = angle;
      vx = (16 * Math.pow(Math.sin(t), 3)) / 5;
      vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 5;
    } else {
      const power = 2 + Math.random() * 3.5;
      vx = Math.cos(angle) * power;
      vy = Math.sin(angle) * power;
    }
    sparks.push({
      x, y, vx, vy,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      color: Math.random() < 0.7 ? color : colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function fwLoop() {
  // fade old frames so particles leave trails (keeps the canvas transparent)
  fw.globalCompositeOperation = "destination-out";
  fw.fillStyle = "rgba(0, 0, 0, 0.22)";
  fw.fillRect(0, 0, window.innerWidth, window.innerHeight);
  fw.globalCompositeOperation = "lighter";

  rockets = rockets.filter(function (r) {
    r.y -= r.speed;
    fw.fillStyle = r.color;
    fw.beginPath();
    fw.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
    fw.fill();
    if (r.y <= r.targetY) {
      explode(r.x, r.y, r.color);
      return false;
    }
    return true;
  });

  sparks = sparks.filter(function (s) {
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.04;        // gravity
    s.vx *= 0.985;
    s.life -= s.decay;
    if (s.life <= 0) return false;
    fw.globalAlpha = s.life;
    fw.fillStyle = s.color;
    fw.beginPath();
    fw.arc(s.x, s.y, 2, 0, Math.PI * 2);
    fw.fill();
    fw.globalAlpha = 1;
    return true;
  });

  requestAnimationFrame(fwLoop);
}

function startFireworks() {
  if (fwRunning) return;
  fwRunning = true;
  fwLoop();
  // opening salvo, then a steady show
  for (let i = 0; i < 4; i++) setTimeout(launchRocket, i * 350);
  autoTimer = setInterval(function () {
    launchRocket();
    if (Math.random() < 0.4) setTimeout(launchRocket, 250);
  }, 1400);
}

// Tap anywhere to fire one at that spot
document.addEventListener("pointerdown", function (e) {
  if (!fwRunning) return;
  launchRocket(e.clientX, Math.max(e.clientY - 80, 40));
});


