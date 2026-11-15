// Moquete - codes for the arcade machine's VHS screen
// Type one while you watch the tape (or use the "CANAL" button): nothing happens... until the third
// figure comes close. Then the fair melts into another place:
//   suffering   a small world: dark green grass, brown mountains, a burger place, a circus, a door with a
//               keypad... and bodies around it (half censored). One of them is an alien, for some reason.
//   path        a long grey path floating in a blue sky; the third figure, far, far away. Now and then the
//               sky turns red. Sometimes it is the entrance to a grey maze instead, under a cloudy sky.
//   imagination the same small world, happy and without bodies... but it is clearly an illusion.
//   woods       a dead forest in black fog, and red eyes far away.
//   hell        the inside of a house turned into an unfinished hell: infernal zombies, missing textures,
//               and at the end, a portal you can barely notice.

const vhsCodeNames = ['suffering', 'path', 'imagination', 'woods', 'hell'];
const vhsCode = { active: null, buffer: '', layer: null, flash: 0, pathMaze: false, redUntil: 0, zombies: null };

function setVhsCode(code) {
  vhsCode.active = code;
  vhsCode.flash = 90;
  vhsCode.pathMaze = code === 'path' && Math.random() < 0.3;
  vhsCode.zombies = null;
  vhsCode.woodsWatch = 0;
  vhsCode.woodsFigure = 0;
  vhsCode.woodsFreeze = 0;
  playTone({ frequency: 1760, duration: 0.05, type: 'square', volume: 0.025 });
  playTone({ frequency: 880, duration: 0.12, type: 'square', volume: 0.025, delay: 0.06 });
  playNoise({ duration: 0.15, volume: 0.03, filterFrequency: 3000 });
  // the third figure comes soon
  arcadeVhs.forceEvil = true;
  if (!arcadeVhs.visitors.length) arcadeVhs.nextVisit = Math.min(arcadeVhs.nextVisit, 60);
}

// ---------- typing the codes while the tape plays ----------
window.addEventListener('keydown', (event) => {
  if (!arcadeVhs.overlay) return;
  if (event.key === 'Escape') return;
  // (while the tape is on, the menu's own codes stay quiet)
  event.stopPropagation();
  if (!/^[a-zA-Z]$/.test(event.key)) return;
  vhsCode.buffer = (vhsCode.buffer + event.key.toLowerCase()).slice(-16);
  const found = vhsCodeNames.find((code) => vhsCode.buffer.endsWith(code));
  if (found) {
    vhsCode.buffer = '';
    setVhsCode(found);
  }
}, true);

(function hookVhsCodes() {
  // a "CANAL" button on the screen (on a phone there is no keyboard)
  const baseNotes = addArcadeVhsNotes;
  addArcadeVhsNotes = function addArcadeVhsNotesAndChannel(overlay, ...args) {
    const result = baseNotes.call(this, overlay, ...args);
    vhsCode.active = null;
    vhsCode.buffer = '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vhs-channel';
    button.innerHTML = '&#9636; Canal';
    button.addEventListener('click', () => {
      const typed = window.prompt('Canal:');
      const code = String(typed || '').trim().toLowerCase();
      if (vhsCodeNames.includes(code)) setVhsCode(code);
      else if (code) playNoise({ duration: 0.3, volume: 0.04, filterFrequency: 1500 });
    });
    overlay.appendChild(button);
    return result;
  };

  // the third figure, alone, when a code is waiting for him
  const baseVisitor = updateArcadeVhsVisitor;
  updateArcadeVhsVisitor = function updateArcadeVhsVisitorWithCode(...args) {
    if (arcadeVhs.forceEvil && !arcadeVhs.visitors.length) {
      arcadeVhs.nextVisit -= 1;
      if (arcadeVhs.nextVisit <= 0) {
        arcadeVhs.forceEvil = false;
        arcadeVhs.visitors.push(makeArcadeVhsVisitor('evil', 240, Math.random() < 0.5));
        playTone({ frequency: 55, duration: 2, type: 'sawtooth', volume: 0.025, slideTo: 41 });
      }
      return undefined;
    }
    return baseVisitor.apply(this, args);
  };

  // the channel shows up on the OSD
  const baseDraw = drawArcadeVhs;
  drawArcadeVhs = function drawArcadeVhsWithChannel(...args) {
    const result = baseDraw.apply(this, args);
    if (vhsCode.active && arcadeVhs.canvas) {
      const c = arcadeVhs.canvas.getContext('2d');
      const index = vhsCodeNames.indexOf(vhsCode.active) + 1;
      if (vhsCode.flash > 0) vhsCode.flash -= 1;
      if (vhsCode.flash > 0 || arcadeVhs.evilMix > 0.3) {
        c.save();
        c.font = '700 16px "Courier New", monospace';
        c.textAlign = 'right';
        c.fillStyle = arcadeVhs.evilMix > 0.3 ? 'rgba(255, 82, 82, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        c.shadowColor = 'rgba(0, 0, 0, 0.6)';
        c.shadowBlur = 3;
        if (vhsCode.flash > 0 ? Math.floor(vhsCode.flash / 10) % 2 === 0 : true) c.fillText(`CH-0${index}`, arcadeVhs.canvas.width - 18, 28);
        c.restore();
      }
    }
    return result;
  };
})();

// ---------- the other worlds (drawn on their own layer, then faded in over the fair) ----------
function drawArcadeVhsCodeWorld(c, W, H, t) {
  const code = vhsCode.active;
  const k = arcadeVhs.evilMix;
  if (!code || k < 0.03) return;
  if (!vhsCode.layer) {
    vhsCode.layer = document.createElement('canvas');
    vhsCode.layer.width = W;
    vhsCode.layer.height = H;
  }
  const layer = vhsCode.layer;
  const l = layer.getContext('2d');
  l.clearRect(0, 0, W, H);
  if (code === 'suffering') drawVhsSmallWorld(l, W, H, t, false);
  else if (code === 'imagination') drawVhsImagination(l, W, H, t);
  else if (code === 'path') drawVhsPath(l, W, H, t);
  else if (code === 'woods') drawVhsWoods(l, W, H, t);
  else if (code === 'hell') drawVhsHell(l, W, H, t);
  // the third figure walks into these worlds too (not into the woods, and only far away on the path)
  if (code === 'suffering' || code === 'imagination' || code === 'hell') {
    arcadeVhs.visitors.slice().sort((a, b) => a.scale - b.scale).forEach((v) => {
      if (v.t >= 0) drawArcadeVhsFigure(l, v, H);
    });
  }
  const fade = Math.min(1, (k - 0.03) / 0.6);
  c.save();
  // (it comes in with a tear, line by line)
  if (fade < 1) {
    for (let y = 0; y < H; y += 6) {
      if (Math.random() < fade) c.drawImage(layer, 0, y, W, 6, (Math.random() - 0.5) * (1 - fade) * 30, y, W, 6);
    }
  } else {
    c.drawImage(layer, 0, 0);
  }
  c.restore();
}

// --- helpers
function vhsCensor(c, x, y, w, h, t) {
  // a mosaic of muddy squares, and a black bar across
  const size = 5;
  for (let px = 0; px < w; px += size) {
    for (let py = 0; py < h; py += size) {
      const shade = 60 + ((px * 7 + py * 13 + Math.floor(t / 20) * 3) % 50);
      c.fillStyle = `rgb(${shade + 30}, ${shade}, ${shade - 10})`;
      c.fillRect(x + px, y + py, size, size);
    }
  }
  c.fillStyle = '#000';
  c.fillRect(x - 2, y + h / 2 - 3, w + 4, 6);
}

function vhsLyingBody(c, x, y, color, flip, t, censorPart = 1) {
  const dir = flip ? -1 : 1;
  c.fillStyle = color;
  c.fillRect(x, y, 22 * dir, 7);
  c.fillRect(x + 22 * dir, y - 1, 7 * dir, 8);
  c.fillRect(x - 12 * dir, y + 1, 12 * dir, 3);
  c.fillRect(x - 12 * dir, y + 4, 12 * dir, 3);
  const left = flip ? x - 22 * censorPart : x;
  vhsCensor(c, left, y - 3, 30 * censorPart, 12, t);
}

function vhsArches(c, x, y, color, broken) {
  c.strokeStyle = color;
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(x - 14, y + 18);
  c.quadraticCurveTo(x - 14, y - 8, x - 7, y - 8);
  c.quadraticCurveTo(x, y - 8, x, y + 6);
  if (!broken) {
    c.quadraticCurveTo(x, y - 8, x + 7, y - 8);
    c.quadraticCurveTo(x + 14, y - 8, x + 14, y + 18);
  } else {
    c.moveTo(x + 2, y - 2);
    c.lineTo(x + 9, y - 6);
    c.moveTo(x + 13, y + 4);
    c.lineTo(x + 14, y + 18);
  }
  c.stroke();
}

// --- SUFFERING (and the base of IMAGINATION): a small world floating in the sky
function drawVhsSmallWorld(c, W, H, t, happy) {
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, happy ? '#5ec4ff' : '#3c454c');
  sky.addColorStop(1, happy ? '#e6f8ff' : '#7a7f74');
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  if (happy) {
    // a smiling sun and a rainbow
    c.fillStyle = '#ffeb3b';
    c.beginPath();
    c.arc(400, 60, 26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#5d4037';
    c.fillRect(390, 54, 4, 4);
    c.fillRect(406, 54, 4, 4);
    c.strokeStyle = '#5d4037';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(400, 62, 9, 0.2, Math.PI - 0.2);
    c.stroke();
    ['#ef5350', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc'].forEach((color, band) => {
      c.strokeStyle = color;
      c.lineWidth = 5;
      c.beginPath();
      c.arc(140, 200, 120 - band * 5, Math.PI, 0);
      c.stroke();
    });
  } else {
    // heavy, still clouds
    c.fillStyle = 'rgba(40, 44, 46, 0.6)';
    for (let cloud = 0; cloud < 4; cloud += 1) {
      c.beginPath();
      c.ellipse(60 + cloud * 120, 50 + (cloud % 2) * 20, 70, 16, 0, 0, Math.PI * 2);
      c.fill();
    }
  }
  // the island's underside: rock tapering into the void
  c.fillStyle = happy ? '#8d6e63' : '#4e3b31';
  c.beginPath();
  c.moveTo(50, 250);
  c.quadraticCurveTo(140, 330, 240, 350);
  c.quadraticCurveTo(340, 330, 430, 250);
  c.closePath();
  c.fill();
  // brown mountains at the back of the island
  [[110, 70], [190, 95], [280, 80], [370, 65]].forEach(([x, height], index) => {
    c.fillStyle = index % 2 ? (happy ? '#a1887f' : '#5d4037') : (happy ? '#8d6e63' : '#6d4c41');
    c.beginPath();
    c.moveTo(x - 60, 200);
    c.lineTo(x, 200 - height);
    c.lineTo(x + 60, 200);
    c.closePath();
    c.fill();
    if (happy) {
      c.fillStyle = '#fafafa';
      c.beginPath();
      c.moveTo(x - 12, 200 - height + 20);
      c.lineTo(x, 200 - height);
      c.lineTo(x + 12, 200 - height + 20);
      c.closePath();
      c.fill();
    }
  });
  // the grass on top
  c.fillStyle = happy ? '#5cc85a' : '#1f3b1f';
  c.beginPath();
  c.ellipse(240, 230, 200, 42, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = happy ? '#4caf50' : '#17301a';
  for (let tuft = 0; tuft < 40; tuft += 1) c.fillRect(70 + ((tuft * 47) % 340), 205 + ((tuft * 13) % 46), 3, 2);
  // the burger place, with its golden arches
  c.fillStyle = happy ? '#e53935' : '#7f1d1d';
  c.fillRect(70, 196, 70, 36);
  c.fillStyle = happy ? '#ffca28' : '#6d5a1a';
  c.fillRect(66, 190, 78, 8);
  c.fillStyle = happy ? '#b3e5fc' : '#263238';
  c.fillRect(80, 206, 20, 14);
  c.fillRect(108, 206, 20, 14);
  c.fillStyle = happy ? '#5d4037' : '#1b1b1b';
  c.fillRect(98, 214, 12, 18);
  c.fillStyle = '#9e9e9e';
  c.fillRect(150, 170, 3, 50);
  vhsArches(c, 151, 160, happy ? '#ffc107' : '#8a6d1a', !happy);
  // the circus tent
  const stripesA = happy ? '#e53935' : '#5a2323';
  const stripesB = happy ? '#fafafa' : '#7d7d72';
  for (let stripe = 0; stripe < 6; stripe += 1) {
    c.fillStyle = stripe % 2 ? stripesA : stripesB;
    c.beginPath();
    c.moveTo(330, 160);
    c.lineTo(290 + stripe * 13.3, 232);
    c.lineTo(290 + (stripe + 1) * 13.3, 232);
    c.closePath();
    c.fill();
  }
  if (!happy) {
    // a torn flap
    c.fillStyle = '#1f3b1f';
    c.beginPath();
    c.moveTo(352, 232);
    c.lineTo(344, 214);
    c.lineTo(338, 232);
    c.closePath();
    c.fill();
  }
  c.strokeStyle = '#5d4037';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(330, 160);
  c.lineTo(330, 144);
  c.stroke();
  c.fillStyle = happy ? '#ffeb3b' : '#5a5a3a';
  c.beginPath();
  c.moveTo(330, 144);
  c.lineTo(344, 148 + Math.sin(t / 10) * (happy ? 2 : 0.3));
  c.lineTo(330, 152);
  c.closePath();
  c.fill();
  // the door with a code, standing alone on the grass
  c.fillStyle = happy ? '#b0bec5' : '#455a64';
  c.fillRect(224, 196, 30, 44);
  c.strokeStyle = happy ? '#78909c' : '#263238';
  c.lineWidth = 3;
  c.strokeRect(224, 196, 30, 44);
  c.fillStyle = '#212121';
  c.fillRect(246, 214, 6, 10);
  const led = happy ? '#66bb6a' : Math.floor(t / 25) % 2 ? '#ff1744' : '#4a0010';
  c.fillStyle = led;
  c.fillRect(247, 215, 4, 2);
  c.fillStyle = '#9e9e9e';
  for (let key = 0; key < 4; key += 1) c.fillRect(247 + (key % 2) * 2, 219 + Math.floor(key / 2) * 2, 1, 1);
  if (happy) {
    ['#f06292', '#ffeb3b', '#ba68c8'].forEach((color, flower) => {
      c.fillStyle = color;
      c.beginPath();
      c.arc(222 + flower * 15, 242, 3, 0, Math.PI * 2);
      c.fill();
    });
    return;
  }
  // the bodies (half censored) ...and an alien
  vhsLyingBody(c, 110, 244, '#8d6e63', false, t, 0.7);
  vhsLyingBody(c, 190, 252, '#a1887f', true, t, 0.6);
  vhsLyingBody(c, 280, 246, '#795548', false, t, 0.8);
  vhsLyingBody(c, 360, 240, '#8d6e63', true, t, 0.5);
  vhsLyingBody(c, 300, 212, '#6d4c41', false, t, 0.6);
  // the alien: green, a big head, black eyes
  c.fillStyle = '#7cb342';
  c.fillRect(392, 222, 24, 6);
  c.beginPath();
  c.ellipse(424, 222, 9, 7, 0.3, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#111';
  c.beginPath();
  c.ellipse(427, 220, 3, 1.6, 0.4, 0, Math.PI * 2);
  c.ellipse(421, 222, 3, 1.6, 0.4, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#7cb342';
  c.fillRect(382, 223, 10, 2);
  c.fillRect(382, 227, 10, 2);
  vhsCensor(c, 386, 218, 22, 12, t);
  // flies
  c.fillStyle = '#111';
  for (let fly = 0; fly < 10; fly += 1) {
    const baseX = [120, 200, 290, 365, 410][fly % 5];
    c.fillRect(baseX + Math.sin(t / 6 + fly * 2) * 10, 236 + Math.cos(t / 5 + fly) * 6, 1.5, 1.5);
  }
}

// --- IMAGINATION: the same place, happy... but it doesn't hold
function drawVhsImagination(c, W, H, t) {
  drawVhsSmallWorld(c, W, H, t, false);
  if (!vhsCode.happyLayer) {
    vhsCode.happyLayer = document.createElement('canvas');
    vhsCode.happyLayer.width = W;
    vhsCode.happyLayer.height = H;
  }
  const happy = vhsCode.happyLayer.getContext('2d');
  happy.clearRect(0, 0, W, H);
  drawVhsSmallWorld(happy, W, H, t, true);
  // balloons and confetti
  ['#ef5350', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'].forEach((color, index) => {
    const bx = 60 + index * 90;
    const by = 120 - ((t * 0.4 + index * 50) % 140);
    happy.strokeStyle = '#ffffff';
    happy.lineWidth = 1;
    happy.beginPath();
    happy.moveTo(bx, by + 10);
    happy.lineTo(bx + Math.sin(t / 20 + index) * 3, by + 26);
    happy.stroke();
    happy.fillStyle = color;
    happy.beginPath();
    happy.ellipse(bx, by, 8, 10, 0, 0, Math.PI * 2);
    happy.fill();
  });
  c.drawImage(vhsCode.happyLayer, 0, 0);
  // ...the illusion tears: for a moment, pieces of the real place show through
  const tears = Math.random() < 0.18 ? 1 + Math.floor(Math.random() * 3) : 0;
  for (let tear = 0; tear < tears; tear += 1) {
    const tx = Math.random() * (W - 80);
    const ty = 150 + Math.random() * 110;
    const tw = 30 + Math.random() * 90;
    const th = 4 + Math.random() * 16;
    c.save();
    c.beginPath();
    c.rect(tx, ty, tw, th);
    c.clip();
    drawVhsSmallWorld(c, W, H, t, false);
    c.restore();
  }
  // and the colors never sit still
  c.save();
  c.globalCompositeOperation = 'overlay';
  c.fillStyle = `hsla(${(t * 3) % 360}, 80%, 60%, 0.08)`;
  c.fillRect(0, 0, W, H);
  c.restore();
}

// --- PATH: a long floating path... and him, far away
function drawVhsPath(c, W, H, t) {
  if (vhsCode.pathMaze) {
    drawVhsMaze(c, W, H, t);
    return;
  }
  // (now and then the sky turns red)
  if (arcadeVhs.t > vhsCode.redUntil && Math.random() < 0.0015) vhsCode.redUntil = arcadeVhs.t + 120 + Math.random() * 120;
  const red = arcadeVhs.t < vhsCode.redUntil;
  // simple: a flat sky, a big flat path, nothing else
  c.fillStyle = red ? '#b71c1c' : '#3d8fe0';
  c.fillRect(0, 0, W, H);
  c.fillStyle = red ? '#d32f2f' : '#6fb2f0';
  c.fillRect(0, 170, W, H - 170);
  // the path: very wide under us, reaching the horizon
  const vx = W / 2;
  const vy = 170;
  const edge = H - 56;
  c.fillStyle = red ? '#5a5a5a' : '#8c8c8c';
  c.beginPath();
  c.moveTo(80, edge);
  c.lineTo(vx - 4, vy);
  c.lineTo(vx + 4, vy);
  c.lineTo(W - 80, edge);
  c.closePath();
  c.fill();
  // its thick side: it floats, there is only sky under it
  c.fillStyle = red ? '#3a3a3a' : '#5e5e5e';
  c.fillRect(80, edge, W - 160, 20);
  // far, far away... the third figure. You almost can't see him.
  if (Math.random() < 0.97) {
    c.fillStyle = 'rgba(25, 8, 35, 0.8)';
    c.fillRect(vx - 1, vy - 6, 2, 6);
    c.fillRect(vx - 1.5, vy - 8, 3, 2);
  }
}

function drawVhsMaze(c, W, H, t) {
  const sky = c.createLinearGradient(0, 0, 0, H * 0.5);
  sky.addColorStop(0, '#6d6d6d');
  sky.addColorStop(1, '#a8a8a8');
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(80, 80, 80, 0.55)';
  for (let cloud = 0; cloud < 7; cloud += 1) {
    c.beginPath();
    c.ellipse(((cloud * 83 + t * 0.12) % (W + 120)) - 60, 30 + (cloud % 3) * 22, 60, 14, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#2f2f2f';
  c.fillRect(0, 170, W, H - 170);
  // the walls of the maze, and its entrance right in front
  c.fillStyle = '#8a8a8a';
  c.fillRect(20, 100, 180, 90);
  c.fillRect(280, 100, 180, 90);
  c.fillStyle = '#777';
  c.fillRect(20, 100, 180, 6);
  c.fillRect(280, 100, 180, 6);
  c.fillStyle = '#6a6a6a';
  for (let brick = 0; brick < 24; brick += 1) c.fillRect(24 + (brick % 6) * 30 + (brick > 11 ? 260 : 0), 116 + Math.floor((brick % 12) / 6) * 30, 22, 2);
  // the opening, and the dark corridor inside
  c.fillStyle = '#1a1a1a';
  c.fillRect(200, 112, 80, 78);
  c.fillStyle = '#5a5a5a';
  c.fillRect(214, 126, 52, 64);
  c.fillStyle = '#121212';
  c.fillRect(226, 140, 28, 50);
  // the floor leading in
  c.fillStyle = '#3a3a3a';
  c.beginPath();
  c.moveTo(150, H);
  c.lineTo(200, 190);
  c.lineTo(280, 190);
  c.lineTo(330, H);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(160, 160, 160, 0.12)';
  c.fillRect(0, 160, W, 40);
}

// --- WOODS: a dead forest in black fog, and red eyes far away
function drawVhsWoods(c, W, H, t) {
  // the camera breathes, slowly, like someone holding it is afraid
  const breath = Math.sin(t / 55) * 1.5;
  const stutter = vhsCode.woodsFreeze > 0;
  if (stutter) vhsCode.woodsFreeze -= 1;
  else if (Math.random() < 0.004) vhsCode.woodsFreeze = 8 + Math.random() * 14;
  const time = stutter ? vhsCode.woodsFrozenAt : t;
  if (!stutter) vhsCode.woodsFrozenAt = t;
  c.save();
  c.translate(Math.sin(time / 80) * 2, breath);
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#070807');
  sky.addColorStop(1, '#141814');
  c.fillStyle = sky;
  c.fillRect(-10, -10, W + 20, H + 20);
  // three rows of bare trees: far ones grey in the fog, near ones black
  // (now and then one of them is not where it was a moment ago)
  if (Math.random() < 0.003) vhsCode.woodsShift = { row: Math.floor(Math.random() * 3), tree: Math.floor(Math.random() * 7), dx: (Math.random() - 0.5) * 40, until: t + 90 };
  const shift = vhsCode.woodsShift && t < vhsCode.woodsShift.until ? vhsCode.woodsShift : null;
  [['#262b26', 16, 0.6, 210], ['#131613', 11, 0.85, 240], ['#040504', 7, 1.2, 290]].forEach(([color, count, size, base], row) => {
    for (let tree = 0; tree < count; tree += 1) {
      const x = ((tree * 97 + row * 41) % (W + 40)) - 20 + (shift && shift.row === row && shift.tree === tree ? shift.dx : 0);
      const height = (120 + ((tree * 53) % 80)) * size;
      c.fillStyle = color;
      c.fillRect(x, base - height, 6 * size, height + 80);
      c.strokeStyle = color;
      c.lineWidth = 2 * size;
      c.beginPath();
      c.moveTo(x + 3 * size, base - height * 0.6);
      c.lineTo(x - 18 * size, base - height * 0.8);
      c.moveTo(x + 3 * size, base - height * 0.45);
      c.lineTo(x + 22 * size, base - height * 0.7);
      c.stroke();
    }
  });
  c.fillStyle = '#090b09';
  c.fillRect(-10, 280, W + 20, H - 270);
  // something standing between the trees... only for a moment, and only if you look
  if (vhsCode.woodsFigure > 0) {
    vhsCode.woodsFigure -= 1;
    c.fillStyle = 'rgba(0, 0, 0, 0.85)';
    const fx = vhsCode.woodsFigureX;
    c.fillRect(fx, 196, 6, 34);
    c.fillRect(fx - 1, 188, 8, 9);
  } else if (Math.random() < 0.002) {
    vhsCode.woodsFigure = 10 + Math.random() * 20;
    vhsCode.woodsFigureX = 60 + Math.random() * (W - 120);
  }
  // the red eyes: they never blink at the right moment, and they get a little closer the longer you watch
  vhsCode.woodsWatch = Math.min(1, (vhsCode.woodsWatch || 0) + 0.0006);
  const near = vhsCode.woodsWatch;
  const blink = Math.floor(time / 7) % 37 === 0;
  if (!blink) {
    c.save();
    c.shadowColor = '#ff1744';
    c.shadowBlur = 6 + near * 8;
    c.fillStyle = '#ff1744';
    const size = 3 + near * 3;
    const ex = 300 + Math.sin(time / 500) * 14;
    const ey = 214 + near * 10;
    c.fillRect(ex, ey, size, size * 0.7);
    c.fillRect(ex + 6 + near * 6, ey, size, size * 0.7);
    c.restore();
  }
  // and sometimes a second pair, somewhere else
  if (Math.sin(time / 170) > 0.93) {
    c.fillStyle = 'rgba(255, 23, 68, 0.7)';
    c.fillRect(110, 226, 2, 2);
    c.fillRect(115, 226, 2, 2);
  }
  // the black fog, drifting, thicker near the edges
  for (let bank = 0; bank < 7; bank += 1) {
    const fx = ((bank * 130 + time * (0.25 + bank * 0.04)) % (W + 300)) - 150;
    const fy = 230 + (bank % 3) * 30;
    const fog = c.createRadialGradient(fx, fy, 10, fx, fy, 170);
    fog.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    fog.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = fog;
    c.fillRect(-10, -10, W + 20, H + 20);
  }
  c.restore();
  // the dark closes in from the edges, pulsing like a slow heartbeat
  const beat = Math.pow(Math.max(0, Math.sin(t / 26)), 8);
  const dark = c.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 300);
  dark.addColorStop(0, 'rgba(0, 0, 0, 0)');
  dark.addColorStop(1, `rgba(0, 0, 0, ${0.75 + beat * 0.2})`);
  c.fillStyle = dark;
  c.fillRect(0, 0, W, H);
  if (stutter) {
    // the tape hesitates on this part
    c.fillStyle = 'rgba(255, 255, 255, 0.05)';
    c.fillRect(0, (t * 9) % H, W, 3);
  }
  // sounds: twigs snapping, a low breath, the heartbeat
  if (arcadeVhs.evilMix > 0.6) {
    if (Math.random() < 0.004) playNoise({ duration: 0.05, volume: 0.04, filterFrequency: 2200 + Math.random() * 1500 });
    if (Math.random() < 0.0015) playTone({ frequency: 70, duration: 1.6, type: 'sawtooth', volume: 0.018, slideTo: 52 });
    if (t % 52 === 0) {
      playTone({ frequency: 55, duration: 0.12, type: 'sine', volume: 0.05 });
      playTone({ frequency: 48, duration: 0.12, type: 'sine', volume: 0.04, delay: 0.18 });
    }
  }
}

// --- HELL: the inside of a house, burning... and not finished
function drawVhsHell(c, W, H, t) {
  // the back wall and the ceiling
  c.fillStyle = '#3a0d0d';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#4a1414';
  for (let stripe = 0; stripe < 16; stripe += 2) c.fillRect(stripe * 30, 60, 30, 150);
  c.fillStyle = '#1a0505';
  c.fillRect(0, 0, W, 60);
  // the floor: wooden planks in perspective, cracked with lava
  c.fillStyle = '#4e2a16';
  c.beginPath();
  c.moveTo(0, H);
  c.lineTo(60, 210);
  c.lineTo(420, 210);
  c.lineTo(W, H);
  c.closePath();
  c.fill();
  c.strokeStyle = '#2f170a';
  c.lineWidth = 1;
  for (let plank = 0; plank <= 10; plank += 1) {
    c.beginPath();
    c.moveTo(60 + plank * 36, 210);
    c.lineTo(plank * 48, H);
    c.stroke();
  }
  c.save();
  c.shadowColor = '#ff6d00';
  c.shadowBlur = 10;
  c.strokeStyle = `rgba(255, ${120 + Math.sin(t / 8) * 40}, 0, 0.9)`;
  c.lineWidth = 2;
  [[[90, 300], [130, 280], [150, 300], [200, 270]], [[260, 330], [300, 300], [340, 320], [380, 290]], [[180, 240], [220, 230], [250, 245]]].forEach((crack) => {
    c.beginPath();
    crack.forEach(([x, y], index) => (index ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
  });
  c.restore();
  // a window with a red sky, and a door
  c.fillStyle = '#ff5722';
  c.fillRect(70, 90, 60, 50);
  c.fillStyle = '#b71c1c';
  c.fillRect(70, 120, 60, 20);
  c.strokeStyle = '#2b1208';
  c.lineWidth = 4;
  c.strokeRect(70, 90, 60, 50);
  c.beginPath();
  c.moveTo(100, 90);
  c.lineTo(100, 140);
  c.stroke();
  c.fillStyle = '#2b1208';
  c.fillRect(190, 110, 40, 100);
  // ...the parts nobody finished: missing textures, bare polygons, notes left behind
  for (let square = 0; square < 36; square += 1) {
    c.fillStyle = (square + Math.floor(square / 6)) % 2 ? '#ff00ff' : '#000000';
    c.fillRect(300 + (square % 6) * 10, 70 + Math.floor(square / 6) * 10, 10, 10);
  }
  c.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(380, 60);
  c.lineTo(460, 60);
  c.lineTo(460, 200);
  c.lineTo(380, 60);
  c.lineTo(380, 200);
  c.lineTo(460, 200);
  c.stroke();
  c.fillStyle = 'rgba(255, 255, 255, 0.6)';
  c.font = '8px "Courier New", monospace';
  c.textAlign = 'left';
  c.fillText('TEX_MISSING', 300, 140);
  c.fillText('TODO: infierno', 384, 214);
  // flames along the wall
  for (let flame = 0; flame < 16; flame += 1) {
    const fx = flame * 30 + 10;
    const fh = 12 + Math.abs(Math.sin(t / 6 + flame)) * 16;
    c.fillStyle = flame % 2 ? '#ff6d00' : '#ffab00';
    c.beginPath();
    c.moveTo(fx - 8, 212);
    c.quadraticCurveTo(fx, 212 - fh * 1.4, fx + 8, 212);
    c.closePath();
    c.fill();
  }
  // the portal at the very end, in the dark corner: almost invisible
  c.save();
  c.globalAlpha = 0.12 + Math.sin(t / 20) * 0.04;
  c.strokeStyle = '#b388ff';
  c.lineWidth = 2;
  for (let ring = 0; ring < 3; ring += 1) {
    c.beginPath();
    c.ellipse(452, 178, 6 + ring * 3, 12 + ring * 4, Math.sin(t / 30 + ring), 0, Math.PI * 2);
    c.stroke();
  }
  c.restore();
  // the infernal zombies, shuffling around
  if (!vhsCode.zombies) vhsCode.zombies = [[90, 1], [230, -1], [340, 1], [160, -1]].map(([x, dir], index) => ({ x, dir, y: 250 + index * 18, speed: 0.15 + Math.random() * 0.2 }));
  vhsCode.zombies.forEach((zombie, index) => {
    zombie.x += zombie.dir * zombie.speed;
    if (zombie.x < 30 || zombie.x > 440) zombie.dir *= -1;
    const s = 0.7 + (zombie.y - 250) / 120;
    const sway = Math.sin(t / 12 + index) * 2;
    const x = zombie.x;
    const y = zombie.y;
    c.fillStyle = '#5d1a12';
    c.fillRect(x - 7 * s, y - 34 * s, 14 * s, 22 * s);
    c.fillStyle = '#8b2a1c';
    c.fillRect(x - 6 * s + sway, y - 46 * s, 12 * s, 12 * s);
    c.fillStyle = '#3e0d08';
    c.fillRect(x - 6 * s, y - 12 * s, 5 * s, 12 * s);
    c.fillRect(x + 1 * s, y - 12 * s, 5 * s, 12 * s);
    // arms forward
    c.fillStyle = '#8b2a1c';
    c.fillRect(x + zombie.dir * 6 * s, y - 32 * s, zombie.dir * 12 * s, 4 * s);
    c.save();
    c.shadowColor = '#ffea00';
    c.shadowBlur = 6;
    c.fillStyle = '#ffea00';
    c.fillRect(x - 3 * s + sway, y - 42 * s, 2 * s, 2 * s);
    c.fillRect(x + 1.5 * s + sway, y - 42 * s, 2 * s, 2 * s);
    c.restore();
    // little horns
    c.fillStyle = '#2b0705';
    c.fillRect(x - 6 * s + sway, y - 49 * s, 2 * s, 3 * s);
    c.fillRect(x + 4 * s + sway, y - 49 * s, 2 * s, 3 * s);
  });
  // the heat in the air
  const heat = c.createLinearGradient(0, 0, 0, H);
  heat.addColorStop(0, 'rgba(255, 60, 0, 0.05)');
  heat.addColorStop(1, 'rgba(255, 60, 0, 0.18)');
  c.fillStyle = heat;
  c.fillRect(0, 0, W, H);
}

// ---------- the three visitors, closer to their reference pictures ----------
// (feet at y = 0). Each one is as blocky as in his picture: Zapatito is all sharp cubes,
// LucaDoming2 has softer edges and thinner limbs, TheEnd is the roundest and slimmest.
const vhsFigureShapes = {
  soldier: { head: [40, 46, 7], torso: [46, 56, 5], arm: [14, 52, 5], leg: [18, 40, 4] },
  red: { head: [44, 46, 0], torso: [54, 56, 0], arm: [22, 56, 0], leg: [21, 40, 0] },
  evil: { head: [38, 44, 11], torso: [44, 56, 8], arm: [13, 52, 6], leg: [17, 40, 6] },
};

function vhsRoundBlock(c, x, y, w, h, color, radius, shade = 0.2) {
  const r = Math.min(radius, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
  c.fillStyle = color;
  c.fill();
  c.save();
  c.clip();
  c.fillStyle = `rgba(0, 0, 0, ${shade})`;
  c.fillRect(x + w * 0.72, y, w * 0.28 + 1, h);
  c.fillStyle = 'rgba(255, 255, 255, 0.14)';
  c.fillRect(x, y, w, Math.max(2, h * 0.07));
  c.restore();
  c.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  c.lineWidth = 1.5;
  c.stroke();
}

function vhsCamoFill(c, x, y, w, h, colors, seed) {
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  for (let blot = 0; blot < Math.floor((w * h) / 60); blot += 1) {
    c.fillStyle = colors[blot % colors.length];
    c.fillRect(x + ((blot * 37 + seed * 13) % Math.max(1, w)) - 2, y + ((blot * 23 + seed * 7) % Math.max(1, h)) - 2, 6 + (blot % 3) * 2, 4 + (blot % 2) * 3);
  }
  c.restore();
}

// Zapatito's face: a flat picture stuck onto the cube (made once)
let vhsZapatitoFace = null;
function getZapatitoFace() {
  if (vhsZapatitoFace) return vhsZapatitoFace;
  const face = document.createElement('canvas');
  face.width = 80;
  face.height = 72;
  const f = face.getContext('2d');
  // (a cut-out that left a little of its background around the edges)
  f.fillStyle = 'rgba(150, 70, 60, 0.35)';
  f.fillRect(0, 0, 80, 72);
  // eyebrows: thick, one raised
  f.fillStyle = '#1a0d0a';
  f.beginPath();
  f.moveTo(10, 22); f.quadraticCurveTo(20, 12, 34, 18); f.lineTo(34, 22); f.quadraticCurveTo(20, 17, 10, 26); f.closePath();
  f.moveTo(46, 16); f.quadraticCurveTo(58, 6, 70, 14); f.lineTo(70, 18); f.quadraticCurveTo(58, 11, 46, 20); f.closePath();
  f.fill();
  // eyes: half-closed, looking sideways
  [[22, 32], [58, 28]].forEach(([ex, ey]) => {
    f.fillStyle = '#f3ece6';
    f.beginPath();
    f.ellipse(ex, ey, 9, 5, 0, 0, Math.PI * 2);
    f.fill();
    f.fillStyle = '#3b2314';
    f.beginPath();
    f.arc(ex + 3, ey + 1, 3.5, 0, Math.PI * 2);
    f.fill();
    f.fillStyle = '#000';
    f.beginPath();
    f.arc(ex + 3, ey + 1, 1.6, 0, Math.PI * 2);
    f.fill();
    // heavy upper lids
    f.fillStyle = 'rgba(90, 30, 25, 0.95)';
    f.fillRect(ex - 10, ey - 6, 20, 5);
    f.strokeStyle = '#1a0d0a';
    f.lineWidth = 1.5;
    f.beginPath();
    f.moveTo(ex - 9, ey - 1);
    f.quadraticCurveTo(ex, ey - 3, ex + 9, ey - 1);
    f.stroke();
  });
  // a little nose shade
  f.strokeStyle = 'rgba(40, 10, 8, 0.6)';
  f.lineWidth = 1.5;
  f.beginPath();
  f.moveTo(40, 34); f.lineTo(37, 46); f.lineTo(42, 47);
  f.stroke();
  // the smirk: crooked, with a dimple
  f.strokeStyle = '#1a0606';
  f.lineWidth = 2.5;
  f.beginPath();
  f.moveTo(24, 56);
  f.quadraticCurveTo(44, 62, 60, 50);
  f.stroke();
  f.fillStyle = 'rgba(255, 255, 255, 0.85)';
  f.beginPath();
  f.moveTo(38, 58); f.quadraticCurveTo(48, 59, 56, 53); f.lineTo(54, 56); f.quadraticCurveTo(46, 61, 38, 60); f.closePath();
  f.fill();
  f.strokeStyle = 'rgba(40, 10, 8, 0.7)';
  f.lineWidth = 1.2;
  f.beginPath();
  f.moveTo(62, 47); f.quadraticCurveTo(65, 50, 62, 53);
  f.stroke();
  vhsZapatitoFace = face;
  return face;
}

function drawArcadeVhsFigureDetailed(c, v, H) {
  const s = v.scale;
  const shape = vhsFigureShapes[v.kind] || vhsFigureShapes.soldier;
  const walking = v.phase === 'walk' || v.phase === 'leave';
  const bob = walking ? Math.abs(Math.sin(v.t / 8)) * 4 : Math.sin(v.t / 20) * 1.5;
  const baseY = H * 0.86 + Math.max(0, (s - 0.55) / 1.05) * (H + 70 - H * 0.86);
  const press = v.phase === 'play' ? Math.sin(v.t / 3 + v.spot) * 3 : 0;
  const step = walking ? Math.sin(v.t / 6) * 6 : 0;
  const swing = walking ? Math.sin(v.t / 6) * 0.35 : 0;
  c.fillStyle = 'rgba(0, 0, 0, 0.25)';
  c.beginPath();
  c.ellipse(v.x, baseY, 34 * s, 7 * s, 0, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.translate(v.x, baseY - bob);
  c.scale(s, s);
  if (v.phase === 'walk') c.scale(v.dir, 1);
  const [headW, headH, headR] = shape.head;
  const [torsoW, torsoH, torsoR] = shape.torso;
  const [armW, armH, armR] = shape.arm;
  const [legW, legH, legR] = shape.leg;
  const torsoTop = -40 - torsoH;
  const headTop = torsoTop - headH;
  // legs (and shoes)
  const legs = (color, shoe, sole, pattern) => {
    [[-legW - 1, step], [1, -step]].forEach(([lx, dy]) => {
      vhsRoundBlock(c, lx, -legH + dy, legW, legH, color, legR);
      if (pattern) vhsCamoFill(c, lx, -legH + dy, legW, legH - 9, pattern, lx > 0 ? 2 : 1);
      if (shoe) {
        vhsRoundBlock(c, lx - 1, -10 + dy, legW + 3, 10, shoe, Math.min(legR + 2, 5), 0.12);
        c.fillStyle = sole;
        c.fillRect(lx - 1, -2 + dy, legW + 3, 2);
      }
    });
  };
  // arms hang from the shoulders and swing while walking (hands at the end)
  const arms = (color, hand, pattern) => {
    [-1, 1].forEach((side) => {
      c.save();
      c.translate(side * (torsoW / 2 + armW / 2), torsoTop + 3 + (side < 0 ? press : -press));
      c.rotate(side * swing * -1);
      vhsRoundBlock(c, -armW / 2, -2, armW, armH, color, armR);
      if (pattern) vhsCamoFill(c, -armW / 2, -2, armW, armH - 11, pattern, side + 5);
      if (hand) vhsRoundBlock(c, -armW / 2, armH - 12, armW, 11, hand, armR, 0.12);
      c.restore();
    });
  };
  const head = (color) => vhsRoundBlock(c, -headW / 2, headTop, headW, headH, color, headR, 0.16);
  if (v.kind === 'soldier') {
    // LUCADOMING2
    const camo = ['#2a3320', '#5b6b3a', '#6d5a33', '#1d241a'];
    c.save();
    c.rotate(-0.55);
    vhsRoundBlock(c, 24, -168, 8, 112, '#d4a72c', 3, 0.18);
    c.fillStyle = '#fff3b0';
    c.fillRect(26, -166, 2, 100);
    vhsRoundBlock(c, 16, -60, 24, 6, '#8d6e1a', 2, 0.1);
    vhsRoundBlock(c, 25, -56, 6, 16, '#5d4037', 2, 0.1);
    c.restore();
    legs('#1d241a', '#fafafa', '#bdbdbd', ['#2d3a22', '#0f120d', '#3a3220']);
    // the red shirt with its golden emblem, under the open camo jacket
    vhsRoundBlock(c, -torsoW / 2, torsoTop, torsoW, torsoH, '#b71c1c', torsoR);
    c.fillStyle = '#ffb300';
    c.beginPath();
    c.moveTo(-2, torsoTop + 10); c.lineTo(9, torsoTop + 20); c.lineTo(4, torsoTop + 22); c.lineTo(11, torsoTop + 36);
    c.lineTo(-4, torsoTop + 26); c.lineTo(1, torsoTop + 24); c.lineTo(-9, torsoTop + 16);
    c.closePath();
    c.fill();
    [-1, 1].forEach((side) => {
      const x = side < 0 ? -torsoW / 2 : torsoW / 2 - 14;
      vhsRoundBlock(c, x, torsoTop, 14, torsoH, '#3d4a2a', side < 0 ? torsoR : torsoR, 0.15);
      vhsCamoFill(c, x, torsoTop, 14, torsoH, camo, side + 3);
    });
    arms('#3d4a2a', '#f2c79a', camo);
    // a rainbow crystal in one hand
    ['#e040fb', '#40c4ff', '#69f0ae', '#ffd740'].forEach((color, index) => {
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(-torsoW / 2 - armW + index * 3, torsoTop + armH + 2 + press);
      c.lineTo(-torsoW / 2 - armW + 4 + index * 3, torsoTop + armH - 8 + press);
      c.lineTo(-torsoW / 2 - armW + 8 + index * 3, torsoTop + armH + 2 + press);
      c.closePath();
      c.fill();
    });
    // the green scarf
    c.fillStyle = '#2e7d32';
    c.fillRect(-15, torsoTop - 2, 30, 7);
    c.fillStyle = '#43a047';
    c.beginPath();
    c.moveTo(-6, torsoTop + 4); c.lineTo(0, torsoTop + 16); c.lineTo(6, torsoTop + 4);
    c.closePath();
    c.fill();
    head('#f2c79a');
    // sunglasses and a sideways smile
    c.fillStyle = '#212121';
    c.fillRect(-17, headTop + 18, 34, 3);
    const lens = c.createLinearGradient(0, headTop + 18, 0, headTop + 30);
    lens.addColorStop(0, '#3949ab');
    lens.addColorStop(1, '#b388ff');
    c.fillStyle = lens;
    c.fillRect(-16, headTop + 19, 14, 11);
    c.fillRect(2, headTop + 19, 14, 11);
    c.fillStyle = 'rgba(255, 255, 255, 0.45)';
    c.fillRect(-14, headTop + 21, 4, 3);
    c.fillRect(4, headTop + 21, 4, 3);
    c.strokeStyle = '#3e2723';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-6, headTop + 37);
    c.quadraticCurveTo(2, headTop + 42, 9, headTop + 35);
    c.stroke();
    // the hair: a big, layered, swept-back mop with lighter strands, and sideburns
    const hairTop = headTop - 9;
    const hair = c.createLinearGradient(0, hairTop, 0, headTop + 16);
    hair.addColorStop(0, '#5d4037');
    hair.addColorStop(1, '#2e1d17');
    c.fillStyle = hair;
    c.beginPath();
    c.moveTo(-headW / 2 - 3, headTop + 22);
    c.quadraticCurveTo(-headW / 2 - 6, hairTop + 12, -12, hairTop + 2);
    c.quadraticCurveTo(-2, hairTop - 6, 10, hairTop - 2);
    c.quadraticCurveTo(headW / 2 + 6, hairTop + 4, headW / 2 + 3, headTop + 20);
    c.lineTo(headW / 2 - 2, headTop + 12);
    // the front: locks falling over the forehead, swept to one side
    c.quadraticCurveTo(12, headTop + 4, 6, headTop + 12);
    c.quadraticCurveTo(2, headTop + 4, -4, headTop + 10);
    c.quadraticCurveTo(-8, headTop + 3, -14, headTop + 11);
    c.lineTo(-headW / 2 + 2, headTop + 14);
    c.closePath();
    c.fill();
    c.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    c.lineWidth = 1.5;
    c.stroke();
    // strands
    c.strokeStyle = '#8d6e63';
    c.lineWidth = 1.5;
    [[-16, 6, -6, -4], [-8, 4, 4, -6], [0, 6, 14, -2], [8, 8, 18, 4], [-20, 14, -14, 4]].forEach(([x1, y1, x2, y2]) => {
      c.beginPath();
      c.moveTo(x1, hairTop + y1 + 8);
      c.quadraticCurveTo((x1 + x2) / 2, hairTop + Math.min(y1, y2), x2, hairTop + y2 + 8);
      c.stroke();
    });
    c.fillStyle = 'rgba(255, 255, 255, 0.12)';
    c.fillRect(-10, hairTop + 2, 14, 3);
    c.fillStyle = '#3e2723';
    c.fillRect(-headW / 2, headTop + 12, 4, 16);
    c.fillRect(headW / 2 - 4, headTop + 12, 4, 16);
  } else if (v.kind === 'red') {
    // ZAPATITO: sharp cubes, and a face that is just a picture stuck on
    legs('#151515', '#0d0d0d', '#262626');
    vhsRoundBlock(c, -torsoW / 2, torsoTop, torsoW, torsoH, '#8e1616', 0);
    arms('#e01b1b', '#e01b1b');
    head('#7d1b1b');
    c.save();
    c.translate(0, headTop + 23);
    c.rotate(-0.035);
    c.drawImage(getZapatitoFace(), -18, -17, 36, 33);
    c.restore();
    // the jar-robot sitting on his shoulder
    const jx = torsoW / 2 + 2;
    vhsRoundBlock(c, jx, torsoTop - 22, 10, 18, '#2b2b2b', 0, 0.1);
    c.fillStyle = 'rgba(255, 213, 79, 0.5)';
    c.fillRect(jx + 2, torsoTop - 18, 6, 10);
    vhsRoundBlock(c, jx - 1, torsoTop - 27, 12, 5, '#c9a227', 0, 0.1);
    c.strokeStyle = '#1a1a1a';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(jx + 1, torsoTop - 4); c.lineTo(jx - 4, torsoTop + 3);
    c.moveTo(jx + 4, torsoTop - 4); c.lineTo(jx + 2, torsoTop + 3);
    c.moveTo(jx + 7, torsoTop - 4); c.lineTo(jx + 9, torsoTop + 3);
    c.moveTo(jx + 10, torsoTop - 4); c.lineTo(jx + 15, torsoTop + 3);
    c.stroke();
  } else if (v.kind === 'evil') {
    // EHEGGEUYS / THE END: rounder and slimmer; arms down, walking like anyone else
    const flicker = 0.5 + Math.sin(v.t / 5) * 0.2;
    const aura = c.createRadialGradient(0, -80, 10, 0, -80, 120);
    aura.addColorStop(0, `rgba(80, 0, 120, ${flicker})`);
    aura.addColorStop(1, 'rgba(20, 0, 30, 0)');
    c.fillStyle = aura;
    c.fillRect(-130, -210, 260, 230);
    legs('#141414', '#8d8d8d', '#e0e0e0');
    c.fillStyle = '#2b2b2b';
    c.fillRect(-legW - 1, -legH, legW * 2 + 2, 4);
    // the Argentina shirt
    c.save();
    c.beginPath();
    c.rect(-torsoW / 2, torsoTop, torsoW, torsoH);
    c.clip();
    vhsRoundBlock(c, -torsoW / 2, torsoTop, torsoW, torsoH, '#ffffff', torsoR);
    for (let stripe = 0; stripe < 5; stripe += 2) {
      c.fillStyle = '#74acdf';
      c.fillRect(-torsoW / 2 + stripe * (torsoW / 5), torsoTop, torsoW / 5, torsoH);
    }
    c.fillStyle = 'rgba(0, 0, 0, 0.16)';
    c.fillRect(torsoW / 2 - torsoW * 0.28, torsoTop, torsoW * 0.28, torsoH);
    c.restore();
    c.fillStyle = '#111';
    c.beginPath();
    c.moveTo(-9, torsoTop); c.lineTo(0, torsoTop + 8); c.lineTo(9, torsoTop);
    c.closePath();
    c.fill();
    c.fillStyle = '#1a237e';
    c.fillRect(7, torsoTop + 10, 6, 7);
    c.fillStyle = '#ffd54f';
    c.fillRect(-13, torsoTop + 12, 8, 3);
    arms('#1c1c1c', '#f0c8a0');
    head('#f0c8a0');
    // brown hair under purple flames
    c.fillStyle = '#5d3a1a';
    c.fillRect(-headW / 2 + 1, headTop - 6, headW - 2, 14);
    c.fillStyle = '#9c27b0';
    c.fillRect(-headW / 2 + 1, headTop - 10, headW - 2, 6);
    c.fillStyle = '#b388ff';
    [-15, -6, 3, 11].forEach((spike, index) => {
      c.beginPath();
      c.moveTo(spike, headTop - 8);
      c.lineTo(spike + 4, headTop - 28 - Math.sin(v.t / 6 + index) * 3);
      c.lineTo(spike + 9, headTop - 8);
      c.closePath();
      c.fill();
    });
    // the neon headphones and their band
    c.strokeStyle = '#212121';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(0, headTop + 16, headW / 2 + 3, Math.PI * 1.05, Math.PI * 1.95);
    c.stroke();
    c.save();
    c.shadowColor = '#76ff03';
    c.shadowBlur = 8;
    vhsRoundBlock(c, -headW / 2 - 6, headTop + 10, 8, 22, '#76ff03', 3, 0.1);
    c.shadowColor = '#ff4081';
    vhsRoundBlock(c, headW / 2 - 2, headTop + 10, 8, 22, '#ff4081', 3, 0.1);
    c.restore();
    // dark eyes above the black mask
    c.fillStyle = '#212121';
    c.fillRect(-11, headTop + 16, 6, 5);
    c.fillRect(5, headTop + 16, 6, 5);
    c.fillStyle = `rgba(206, 147, 216, ${0.3 + flicker * 0.5})`;
    c.fillRect(-10, headTop + 17, 2, 2);
    c.fillRect(6, headTop + 17, 2, 2);
    vhsRoundBlock(c, -16, headTop + 26, 32, 15, '#0d0d0d', 5, 0.05);
    c.fillStyle = '#ff4081';
    c.fillRect(-13, headTop + 32, 3, 3);
    c.fillStyle = '#76ff03';
    c.fillRect(10, headTop + 32, 3, 3);
  }
  c.restore();
}

drawArcadeVhsFigure = drawArcadeVhsFigureDetailed;
