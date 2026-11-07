// Moquete - Jophestar (el tipo que nadie invito)
// A tall, quiet guy in a long black coat, with a cap that melts into his hair.
// He fights next to his STAND: a ghost in bizarre clothes, of a different color every time it comes out.
// Q: calls the stand (for a while every hit he lands is followed by a punch of the stand)
// with the stand out:   F: the stand's barrage of punches   R: "Tiempo, detente" (the world goes grey, the rival can't move)
// without the stand:    F: flicks a coin                     R: "Yare yare..." (a stare that scares the rival: he hits softer)
// Chrono and him can both move in stopped time... and if both stop it at once, the two times crash.

const jophestarHealth = 150;
const jophestarDamageMultiplier = 1.6; // 5 * 1.6 = 8 per punch
const jophestarStandDuration = 420;
const jophestarStandCooldown = 600;
const jophestarFollowUpDamage = 4;
const jophestarBarrageCooldown = 480;
const jophestarBarrageFrames = 44;
const jophestarBarrageReach = 175;
const jophestarBarrageHitDamage = 1.9;
const jophestarBarrageFinalDamage = 5.5;
const jophestarTimeStopDuration = 240;
const jophestarTimeStopCooldown = 1700;
const jophestarCoinDamage = 7;
const jophestarCoinSpeed = 15;
const jophestarCoinCooldown = 300;
const jophestarGlareDuration = 300;
const jophestarGlareCooldown = 900;
const jophestarGlareDamageTaken = 0.7;
const jophestarClashFrames = 80;
const jophestarClashDamage = 6;

let jophestarCoins = [];
let jophestarClash = null;

// ---------- his sounds (made right here with Web Audio, on the effects volume) ----------
const jophSfx = (() => {
  const output = () => {
    const audio = ensureAudio();
    return audio ? { audio, destination: sfxGain || masterGain } : null;
  };
  const envelope = (audio, start, peak, attack, end) => {
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    return gain;
  };
  const tone = (out, { type = 'sine', from, to = null, start = 0, length, peak, attack = 0.005, filter = null }) => {
    const { audio, destination } = out;
    const t = audio.currentTime + start;
    const oscillator = audio.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, t);
    if (to) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + length);
    const gain = envelope(audio, t, peak, attack, t + length);
    let node = oscillator;
    if (filter) {
      const biquad = audio.createBiquadFilter();
      biquad.type = filter.type;
      biquad.frequency.setValueAtTime(filter.from, t);
      if (filter.to) biquad.frequency.exponentialRampToValueAtTime(filter.to, t + length);
      biquad.Q.value = filter.q || 1;
      node.connect(biquad);
      node = biquad;
    }
    node.connect(gain);
    gain.connect(destination);
    oscillator.start(t);
    oscillator.stop(t + length + 0.05);
    return oscillator;
  };
  const noise = (out, { start = 0, length, peak, type = 'lowpass', from = 1000, to = null, q = 1, attack = 0.004 }) => {
    const { audio, destination } = out;
    const t = audio.currentTime + start;
    const buffer = audio.createBuffer(1, Math.max(1, Math.floor(audio.sampleRate * length)), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = audio.createBufferSource();
    source.buffer = buffer;
    const biquad = audio.createBiquadFilter();
    biquad.type = type;
    biquad.frequency.setValueAtTime(from, t);
    if (to) biquad.frequency.exponentialRampToValueAtTime(to, t + length);
    biquad.Q.value = q;
    const gain = envelope(audio, t, peak, attack, t + length);
    source.connect(biquad);
    biquad.connect(gain);
    gain.connect(destination);
    source.start(t);
  };
  return {
    // a punch: a low thump and a dry crack on top
    punch(heavy = false) {
      const out = output();
      if (!out) return;
      tone(out, { from: heavy ? 150 : 170 + Math.random() * 50, to: heavy ? 36 : 55, length: heavy ? 0.32 : 0.12, peak: heavy ? 0.26 : 0.13 });
      noise(out, { length: heavy ? 0.16 : 0.05, peak: heavy ? 0.14 : 0.08, type: 'highpass', from: heavy ? 900 : 1500 + Math.random() * 600 });
      tone(out, { type: 'square', from: heavy ? 90 : 120, to: 40, length: 0.06, peak: 0.03, filter: { type: 'lowpass', from: 600 } });
      if (heavy) noise(out, { start: 0.02, length: 0.4, peak: 0.07, type: 'lowpass', from: 400, to: 80 });
    },
    // "ORA!": a growl through two moving formants (O... then A)
    ora(pitch = 1, big = false) {
      const out = output();
      if (!out) return;
      const { audio, destination } = out;
      const t = audio.currentTime;
      const length = big ? 0.42 : 0.17;
      const voice = audio.createOscillator();
      voice.type = 'sawtooth';
      voice.frequency.setValueAtTime(150 * pitch, t);
      voice.frequency.exponentialRampToValueAtTime((big ? 105 : 125) * pitch, t + length);
      const gain = envelope(audio, t, big ? 0.13 : 0.08, 0.01, t + length);
      [[450, 750], [800, 1250]].forEach(([vowelO, vowelA]) => {
        const formant = audio.createBiquadFilter();
        formant.type = 'bandpass';
        formant.Q.value = 7;
        formant.frequency.setValueAtTime(vowelO, t);
        formant.frequency.setValueAtTime(vowelO * 0.8, t + length * 0.35);
        formant.frequency.exponentialRampToValueAtTime(vowelA, t + length * 0.55);
        voice.connect(formant);
        formant.connect(gain);
      });
      gain.connect(destination);
      voice.start(t);
      voice.stop(t + length + 0.05);
    },
    // the stand comes out: an airy shimmer swelling up, and a deep whoom
    standSummon() {
      const out = output();
      if (!out) return;
      [220, 277.2, 329.6, 440, 554.4].forEach((frequency, index) => {
        tone(out, { from: frequency * (1 + (Math.random() - 0.5) * 0.01), length: 1.3, peak: 0.022, attack: 0.25 + index * 0.03 });
      });
      tone(out, { from: 95, to: 38, length: 0.7, peak: 0.16, attack: 0.03 });
      noise(out, { length: 0.45, peak: 0.05, type: 'bandpass', from: 600, to: 5000, q: 2, attack: 0.38 });
    },
    // a flicked coin: a metallic ping
    coin() {
      const out = output();
      if (!out) return;
      noise(out, { length: 0.03, peak: 0.05, type: 'highpass', from: 3000 });
      [2637, 3951, 5274].forEach((frequency, index) => tone(out, { type: 'sine', from: frequency, length: 0.55 - index * 0.12, peak: 0.03 - index * 0.007 }));
    },
    coinHit() {
      const out = output();
      if (!out) return;
      tone(out, { type: 'triangle', from: 1900, to: 1500, length: 0.18, peak: 0.05 });
      tone(out, { from: 160, to: 60, length: 0.1, peak: 0.08 });
    },
    // "Yare yare...": a menacing rumble that trembles (ゴゴゴ)
    glare() {
      const out = output();
      if (!out) return;
      const { audio, destination } = out;
      const t = audio.currentTime;
      const rumble = audio.createOscillator();
      rumble.type = 'sawtooth';
      rumble.frequency.setValueAtTime(52, t);
      const lowpass = audio.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 240;
      const gain = envelope(audio, t, 0.09, 0.2, t + 1.6);
      const tremolo = audio.createGain();
      tremolo.gain.value = 0.6;
      const lfo = audio.createOscillator();
      lfo.frequency.value = 7.5;
      const lfoDepth = audio.createGain();
      lfoDepth.gain.value = 0.4;
      lfo.connect(lfoDepth);
      lfoDepth.connect(tremolo.gain);
      rumble.connect(lowpass);
      lowpass.connect(tremolo);
      tremolo.connect(gain);
      gain.connect(destination);
      rumble.start(t);
      lfo.start(t);
      rumble.stop(t + 1.7);
      lfo.stop(t + 1.7);
      noise(out, { length: 1.4, peak: 0.04, type: 'lowpass', from: 160, attack: 0.3 });
    },
    // time stops: a crack, everything sinks down, a glassy ring... and a low hum while nothing moves
    timeStop(seconds) {
      const out = output();
      if (!out) return;
      noise(out, { length: 0.25, peak: 0.16, type: 'highpass', from: 1200 });
      tone(out, { type: 'sawtooth', from: 1300, to: 42, length: 1.4, peak: 0.08, attack: 0.01, filter: { type: 'lowpass', from: 6000, to: 260, q: 4 } });
      tone(out, { from: 70, to: 28, length: 1.2, peak: 0.22, attack: 0.01 });
      [1760, 2349, 3136].forEach((frequency, index) => tone(out, { from: frequency, length: 2.2 - index * 0.4, peak: 0.018, attack: 0.02, start: 0.15 }));
      // the hum of a world that stopped
      tone(out, { from: 55, length: seconds, peak: 0.03, attack: 0.6, start: 0.4 });
      tone(out, { from: 82.4, length: seconds, peak: 0.018, attack: 0.8, start: 0.4 });
    },
    // the clock that keeps ticking only for him
    tick(tock = false) {
      const out = output();
      if (!out) return;
      tone(out, { type: 'square', from: tock ? 1500 : 2200, length: 0.035, peak: 0.035, filter: { type: 'bandpass', from: tock ? 1500 : 2200, q: 12 } });
      noise(out, { length: 0.02, peak: 0.03, type: 'highpass', from: 4000 });
    },
    heartbeat() {
      const out = output();
      if (!out) return;
      tone(out, { from: 62, to: 40, length: 0.16, peak: 0.12 });
      tone(out, { from: 58, to: 38, length: 0.14, peak: 0.08, start: 0.19 });
    },
    // time moves again: everything rushes back up
    timeResume() {
      const out = output();
      if (!out) return;
      tone(out, { type: 'sawtooth', from: 45, to: 900, length: 0.7, peak: 0.07, attack: 0.3, filter: { type: 'lowpass', from: 250, to: 5000, q: 3 } });
      noise(out, { length: 0.6, peak: 0.07, type: 'bandpass', from: 300, to: 4000, q: 1.5, attack: 0.35 });
    },
    // two stopped times crashing: metal grinding, then a boom
    clashStart() {
      const out = output();
      if (!out) return;
      tone(out, { type: 'sawtooth', from: 900, to: 90, length: 0.8, peak: 0.06, filter: { type: 'lowpass', from: 4000, to: 400 } });
      tone(out, { type: 'sawtooth', from: 90, to: 900, length: 0.8, peak: 0.06, filter: { type: 'lowpass', from: 400, to: 4000 } });
      noise(out, { length: 0.3, peak: 0.12, type: 'highpass', from: 1500 });
    },
    clashGrind() {
      const out = output();
      if (!out) return;
      [523, 1397, 2489].forEach((frequency) => tone(out, { type: 'triangle', from: frequency * (0.95 + Math.random() * 0.1), length: 0.25, peak: 0.02 }));
    },
    clashBoom() {
      const out = output();
      if (!out) return;
      tone(out, { from: 90, to: 25, length: 1.1, peak: 0.3 });
      noise(out, { length: 1, peak: 0.16, type: 'lowpass', from: 2500, to: 90 });
      noise(out, { length: 0.2, peak: 0.12, type: 'highpass', from: 2000 });
    },
  };
})();

const jophestarStandPatterns = ['hearts', 'stars', 'zigzag', 'dots'];
const jophestarStandHats = ['band', 'crown', 'horns', 'none'];
const jophestarStandExtras = ['scarf', 'pads', 'cape'];

const jophestarCharacterButton = document.getElementById('jophestarCharacterButton');

function isJophestar(fighter) {
  return Boolean(fighter && fighter.characterType === 'jophestar' && !fighter.secretVariant);
}

function pickJophestarRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// every time the stand comes out it wears something different
function rollJophestarStand(fighter) {
  const hue = Math.floor(Math.random() * 360);
  fighter.jophStand = {
    hue,
    accent: (hue + 140 + Math.floor(Math.random() * 80)) % 360,
    pattern: pickJophestarRandom(jophestarStandPatterns),
    hat: pickJophestarRandom(jophestarStandHats),
    extra: pickJophestarRandom(jophestarStandExtras),
  };
}

function resetJophestarState(fighter) {
  fighter.jophStandTimer = 0;
  fighter.jophStandCooldown = 0;
  fighter.jophBarrage = null;
  fighter.jophBarrageCooldown = 0;
  fighter.jophTimeStopTimer = 0;
  fighter.jophTimeStopCooldown = 0;
  fighter.jophFrozenTimer = 0;
  fighter.jophFollowUp = null;
  fighter.jophStandFade = 0;
  fighter.jophStandX = null;
  fighter.jophTexts = [];
  fighter.jophCoinCooldown = 0;
  fighter.jophGlareCooldown = 0;
  fighter.jophIntimidatedTimer = 0;
  // (caught in Chrono's stopped time, his stand drags him along)
  fighter.jophChronoResist = 0;
  // (Chrono, inside Jophestar's stopped time, still moves)
  fighter.jophMovingInStop = 0;
}

function isJophestarStandOut(fighter) {
  return fighter.jophStandTimer > 0 || Boolean(fighter.jophBarrage) || fighter.jophTimeStopTimer > 0 || fighter.jophChronoResist > 0;
}

function jophestarSay(fighter, text, size = 18, color = '#e1bee7') {
  if (!fighter.jophTexts) fighter.jophTexts = [];
  const facing = fighter.attacksToTheRight ? 1 : -1;
  fighter.jophTexts.push({
    text,
    x: fighter.position.x + fighter.width / 2 + facing * (40 + Math.random() * 50),
    y: fighter.position.y + 10 + Math.random() * 40,
    life: 40,
    size,
    color,
  });
}

function getJophestarFacing(attacker, target) {
  return target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 1 : -1;
}

// ---------- the abilities ----------
function summonJophestarStand(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!isJophestar(attacker) || attacker.jophStandCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;
  rollJophestarStand(attacker);
  attacker.jophStandTimer = getDebugDuration(jophestarStandDuration, attacker);
  attacker.jophStandCooldown = getDebugCooldown(jophestarStandCooldown, attacker);
  attacker.attacksToTheRight = getJophestarFacing(attacker, target) > 0;
  jophestarSay(attacker, '¡STAND!', 20, `hsl(${attacker.jophStand.hue}, 90%, 75%)`);
  jophSfx.standSummon();
  recordSpecialUsed(attacker);
  return true;
}

function flickJophestarCoin(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!isJophestar(attacker) || attacker.jophCoinCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;
  const direction = getJophestarFacing(attacker, target);
  attacker.attacksToTheRight = direction > 0;
  jophestarCoins.push({
    x: attacker.position.x + attacker.width / 2 + direction * 34,
    y: attacker.position.y + 40,
    vx: jophestarCoinSpeed * direction,
    life: 70,
    attacker,
    target,
    spin: 0,
  });
  attacker.jophCoinCooldown = getDebugCooldown(jophestarCoinCooldown, attacker);
  jophSfx.coin();
  recordSpecialUsed(attacker);
  return true;
}

function jophestarGlare(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!isJophestar(attacker) || attacker.jophGlareCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;
  attacker.attacksToTheRight = getJophestarFacing(attacker, target) > 0;
  target.jophIntimidatedTimer = getDebugDuration(jophestarGlareDuration, target);
  attacker.jophGlareCooldown = getDebugCooldown(jophestarGlareCooldown, attacker);
  // a calm moment also brings his stand back sooner
  attacker.jophStandCooldown = Math.max(0, attacker.jophStandCooldown - 180);
  jophestarSay(attacker, 'Yare yare...', 18, '#d1c4e9');
  jophSfx.glare();
  recordSpecialUsed(attacker);
  return true;
}

function launchJophestarBarrage(attacker, target) {
  if (isJophestar(attacker) && !isJophestarStandOut(attacker)) return flickJophestarCoin(attacker, target);
  if (!canFighterAct(attacker)) return false;
  if (!isJophestar(attacker) || attacker.jophBarrageCooldown > 0 || attacker.jophBarrage || attacker.gamblerStunTimer > 0 || gameOver) return false;
  attacker.attacksToTheRight = getJophestarFacing(attacker, target) > 0;
  attacker.jophBarrage = { timer: jophestarBarrageFrames, dir: attacker.attacksToTheRight ? 1 : -1, target };
  attacker.jophBarrageCooldown = getDebugCooldown(jophestarBarrageCooldown, attacker);
  recordSpecialUsed(attacker);
  return true;
}

function activateJophestarTimeStop(attacker, target) {
  if (isJophestar(attacker) && !isJophestarStandOut(attacker)) return jophestarGlare(attacker, target);
  if (!canFighterAct(attacker)) return false;
  if (!isJophestar(attacker) || attacker.jophTimeStopCooldown > 0 || attacker.jophTimeStopTimer > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;
  attacker.jophTimeStopCooldown = getDebugCooldown(jophestarTimeStopCooldown, attacker);
  recordSpecialUsed(attacker);
  // two stopped times at once: they crash
  if (attacker.jophChronoResist > 0 || (isJophestar(target) && target.jophTimeStopTimer > 0)) {
    startJophestarTimeClash(attacker, target);
    return true;
  }
  const duration = getDebugDuration(jophestarTimeStopDuration, attacker);
  attacker.jophTimeStopTimer = duration;
  attacker.jophTimeStopMax = duration;
  attacker.jophTimeStopTarget = target;
  if (target.characterType === 'chrono') {
    // Chrono lives in stopped time: he keeps moving, wrapped in his own aura
    target.jophMovingInStop = duration;
    jophestarSay(target, 'Detener el tiempo es MI trabajo.', 14, '#80deea');
  } else {
    // (the rival can't dodge it, but a ghost in phase or a jackpot still can't be touched)
    target.jophFrozenTimer = duration;
    target.jophFrozenY = target.position.y;
    target.gamblerStunTimer = Math.max(target.gamblerStunTimer || 0, duration);
  }
  jophSfx.timeStop(duration / 60);
  // dust frozen in the air, and the moment the clock stopped at
  attacker.jophDust = Array.from({ length: 46 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 0.8 + Math.random() * 2 }));
  attacker.jophStopAngle = Math.random() * Math.PI * 2;
  return true;
}

// ---------- the clash of two stopped times ----------
function startJophestarTimeClash(jophestar, rival) {
  // both stopped times break
  [jophestar, rival].forEach((fighter) => {
    fighter.jophTimeStopTimer = 0;
    fighter.jophChronoResist = 0;
    fighter.jophMovingInStop = 0;
    fighter.jophFrozenTimer = 0;
    fighter.chronoTimeStopTimer = 0;
  });
  const left = jophestar.position.x < rival.position.x ? jophestar : rival;
  const right = left === jophestar ? rival : jophestar;
  jophestarClash = {
    timer: jophestarClashFrames,
    x: (left.position.x + left.width + right.position.x) / 2,
    y: Math.min(left.position.y, right.position.y) + 50,
    left,
    right,
    leftColor: left === jophestar ? '#b388ff' : left.characterType === 'chrono' ? '#4dd0e1' : '#ffffff',
    rightColor: right === jophestar ? '#b388ff' : right.characterType === 'chrono' ? '#4dd0e1' : '#ffffff',
  };
  jophSfx.clashStart();
}

function updateJophestarClash() {
  const clash = jophestarClash;
  if (!clash) return;
  clash.timer -= 1;
  const passed = jophestarClashFrames - clash.timer;
  // the two times push against each other... then throw both of them back
  if (passed < 50) {
    [clash.left, clash.right].forEach((fighter) => {
      fighter.velocity.x = 0;
    });
    if (passed % 6 === 0) jophSfx.clashGrind();
  }
  if (passed === 50) {
    clash.left.velocity.x = getDebugKnockback(-12, clash.left);
    clash.right.velocity.x = getDebugKnockback(12, clash.right);
    clash.left.velocity.y = clash.right.velocity.y = -6;
    applyDamage(clash.right, clash.left, jophestarClashDamage, { isSpecial: true, damageType: 'timeClash' });
    applyDamage(clash.left, clash.right, jophestarClashDamage, { isSpecial: true, damageType: 'timeClash' });
    jophSfx.clashBoom();
  }
  if (clash.timer <= 0) jophestarClash = null;
}

function drawJophestarClash() {
  const clash = jophestarClash;
  if (!clash) return;
  const passed = jophestarClashFrames - clash.timer;
  const time = performance.now() / 1000;
  const shake = passed < 50 ? (Math.random() - 0.5) * 6 : 0;
  ctx.save();
  // the world flickers between grey and inside out
  ctx.globalCompositeOperation = passed % 8 < 4 ? 'saturation' : 'difference';
  ctx.globalAlpha = passed < 50 ? 0.55 : Math.max(0, (jophestarClashFrames - passed) / 30) * 0.4;
  ctx.fillStyle = passed % 8 < 4 ? '#808080' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // two clocks pushing against each other
  const push = passed < 50 ? Math.sin(passed * 0.5) * 6 : 0;
  [[-1, clash.leftColor], [1, clash.rightColor]].forEach(([side, color]) => {
    const clockX = clash.x + side * (46 - push * side) + shake;
    const clockY = clash.y + shake;
    ctx.save();
    ctx.globalAlpha = passed < 50 ? 0.9 : Math.max(0, 1 - (passed - 50) / 20);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(clockX, clockY, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (let mark = 0; mark < 12; mark += 1) {
      const angle = mark * (Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(clockX + Math.cos(angle) * 32, clockY + Math.sin(angle) * 32);
      ctx.lineTo(clockX + Math.cos(angle) * 38, clockY + Math.sin(angle) * 38);
      ctx.stroke();
    }
    // the hands spin the wrong way, faster and faster
    const spin = side * time * (6 + passed * 0.3);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(clockX, clockY);
    ctx.lineTo(clockX + Math.cos(spin) * 28, clockY + Math.sin(spin) * 28);
    ctx.moveTo(clockX, clockY);
    ctx.lineTo(clockX + Math.cos(spin / 12) * 18, clockY + Math.sin(spin / 12) * 18);
    ctx.stroke();
    ctx.restore();
  });
  // sparks where they touch
  if (passed < 56) {
    ctx.save();
    for (let spark = 0; spark < 10; spark += 1) {
      const angle = Math.random() * Math.PI * 2;
      const reach = 10 + Math.random() * (passed < 50 ? 34 : 120);
      ctx.strokeStyle = Math.random() < 0.5 ? clash.leftColor : clash.rightColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(clash.x, clash.y);
      ctx.lineTo(clash.x + Math.cos(angle) * reach, clash.y + Math.sin(angle) * reach);
      ctx.stroke();
    }
    if (passed >= 50) {
      ctx.globalAlpha = Math.max(0, 1 - (passed - 50) / 8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(clash.x, clash.y, 30 + (passed - 50) * 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = Math.min(1, clash.timer / 15);
  ctx.font = "900 32px Impact, 'Arial Black', sans-serif";
  ctx.textAlign = 'center';
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#1a0f24';
  const titleX = canvas.width / 2 + shake;
  ctx.strokeText('¡CHOQUE DE TIEMPO!', titleX, canvas.height * 0.36);
  const gradient = ctx.createLinearGradient(titleX - 160, 0, titleX + 160, 0);
  gradient.addColorStop(0, clash.leftColor);
  gradient.addColorStop(1, clash.rightColor);
  ctx.fillStyle = gradient;
  ctx.fillText('¡CHOQUE DE TIEMPO!', titleX, canvas.height * 0.36);
  ctx.restore();
}

// ---------- coins, the stare and moving in stopped time (drawn over everything) ----------
function updateJophestarCoins() {
  jophestarCoins.forEach((coin) => {
    coin.x += coin.vx;
    coin.life -= 1;
    coin.spin += 0.5;
    const target = coin.target;
    if (target && target.health > 0 && coin.x > target.position.x && coin.x < target.position.x + target.width && coin.y > target.position.y && coin.y < target.position.y + target.height) {
      applyDamage(coin.attacker, target, jophestarCoinDamage, { isSpecial: true, damageType: 'coin' });
      target.velocity.x = getDebugKnockback(Math.sign(coin.vx) * 4, target);
      jophSfx.coinHit();
      coin.life = 0;
    }
    if (coin.x < -20 || coin.x > canvas.width + 20) coin.life = 0;
  });
  jophestarCoins = jophestarCoins.filter((coin) => coin.life > 0);
}

function drawJophestarCoins() {
  jophestarCoins.forEach((coin) => {
    const squash = Math.abs(Math.cos(coin.spin));
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 236, 179, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(coin.x - Math.sign(coin.vx) * 26, coin.y);
    ctx.lineTo(coin.x, coin.y);
    ctx.stroke();
    ctx.fillStyle = '#ffca28';
    ctx.strokeStyle = '#8d6e00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(coin.x, coin.y, 6 * squash + 1, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawJophestarStatusMarks(fighter) {
  const time = performance.now() / 1000;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const cx = x + fighter.width / 2;
  // scared by the stare: sweat drops and blue lines over the head
  if (fighter.jophIntimidatedTimer > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, fighter.jophIntimidatedTimer / 30);
    ctx.strokeStyle = 'rgba(66, 165, 245, 0.85)';
    ctx.lineWidth = 2;
    for (let line = 0; line < 4; line += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 8 + line * 14, y - 4);
      ctx.lineTo(x + 8 + line * 14, y + 16);
      ctx.stroke();
    }
    ctx.fillStyle = '#90caf9';
    const drop = (time * 1.4) % 1;
    ctx.beginPath();
    ctx.ellipse(x + fighter.width + 6, y + 10 + drop * 18, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // moving inside stopped time: a turning clock aura
  const moving = fighter.jophMovingInStop > 0 || fighter.jophChronoResist > 0;
  if (moving) {
    const color = fighter.jophChronoResist > 0 ? `hsl(${fighter.jophStand ? fighter.jophStand.hue : 270}, 90%, 72%)` : '#4dd0e1';
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(cx, y + fighter.height / 2, fighter.width * 0.9, fighter.height * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (let mark = 0; mark < 12; mark += 1) {
      const angle = mark * (Math.PI / 6) + time * 0.8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * fighter.width * 0.8, y + fighter.height / 2 + Math.sin(angle) * fighter.height * 0.55);
      ctx.lineTo(cx + Math.cos(angle) * fighter.width * 0.92, y + fighter.height / 2 + Math.sin(angle) * fighter.height * 0.64);
      ctx.stroke();
    }
    const hand = time * 4;
    ctx.beginPath();
    ctx.moveTo(cx, y + fighter.height / 2);
    ctx.lineTo(cx + Math.cos(hand) * fighter.width * 0.7, y + fighter.height / 2 + Math.sin(hand) * fighter.height * 0.5);
    ctx.stroke();
    ctx.restore();
  }
}

// Chrono's stopped time, while Jophestar's stand drags him through it (Chrono's own effect only shows on frozen fighters)
function drawJophestarResistTint() {
  if (![player1, player2].some((fighter) => fighter.jophChronoResist > 0)) return;
  ctx.save();
  ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(224, 247, 250, 0.14)';
  ctx.lineWidth = 1;
  for (let lineX = -40; lineX < canvas.width; lineX += 80) {
    ctx.beginPath();
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX + 120, canvas.height);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- every frame ----------
function updateJophestarFighter(fighter, opponent) {
  if (!fighter) return;
  if (fighter.jophFrozenTimer > 0) {
    fighter.jophFrozenTimer -= 1;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    if (typeof fighter.jophFrozenY === 'number') fighter.position.y = fighter.jophFrozenY;
  }
  if (fighter.jophTexts && fighter.jophTexts.length) {
    fighter.jophTexts.forEach((text) => {
      text.life -= 1;
      text.y -= 0.6;
    });
    fighter.jophTexts = fighter.jophTexts.filter((text) => text.life > 0);
  }
  if (fighter.jophIntimidatedTimer > 0) fighter.jophIntimidatedTimer -= 1;
  if (fighter.jophMovingInStop > 0) fighter.jophMovingInStop -= 1;
  if (!isJophestar(fighter)) return;
  ['jophStandCooldown', 'jophBarrageCooldown', 'jophTimeStopCooldown', 'jophCoinCooldown', 'jophGlareCooldown'].forEach((key) => {
    if (fighter[key] > 0) fighter[key] -= 1;
  });
  if (fighter.jophChronoResist > 0) {
    fighter.jophChronoResist -= 1;
    if (fighter.jophChronoResist === 0) jophestarSay(fighter, '...El tiempo sigue.', 13, '#e0e0e0');
  }
  if (fighter.jophStandTimer > 0) fighter.jophStandTimer -= 1;
  const target = opponent;

  // the stand's punch right after one of his own
  if (fighter.jophFollowUp) {
    fighter.jophFollowUp.timer -= 1;
    if (fighter.jophFollowUp.timer <= 0) {
      const followTarget = fighter.jophFollowUp.target;
      fighter.jophFollowUp = null;
      if (followTarget && followTarget.health > 0 && !gameOver) {
        applyDamage(fighter, followTarget, jophestarFollowUpDamage, { isSpecial: true, damageType: 'stand' });
        jophestarSay(fighter, 'ORA!', 16);
        jophSfx.punch();
        jophSfx.ora(1.1);
      }
    }
  }

  // the barrage
  if (fighter.jophBarrage) {
    const barrage = fighter.jophBarrage;
    barrage.timer -= 1;
    fighter.attacksToTheRight = barrage.dir > 0;
    if (barrage.timer % 4 === 0 && barrage.timer > 0) {
      const hitTarget = barrage.target || target;
      const fighterCenter = fighter.position.x + fighter.width / 2;
      const targetCenter = hitTarget.position.x + hitTarget.width / 2;
      const reach = (targetCenter - fighterCenter) * barrage.dir;
      const overlapY = hitTarget.position.y < fighter.position.y + fighter.height && hitTarget.position.y + hitTarget.height > fighter.position.y;
      const last = barrage.timer <= 4;
      if (reach > -10 && reach < jophestarBarrageReach && overlapY && hitTarget.health > 0) {
        applyDamage(fighter, hitTarget, last ? jophestarBarrageFinalDamage : jophestarBarrageHitDamage, { isSpecial: true, damageType: 'stand' });
        if (!hitTarget.jophFrozenTimer) hitTarget.position.x = Math.max(0, Math.min(canvas.width - hitTarget.width, hitTarget.position.x + barrage.dir * (last ? 26 : 2)));
        jophSfx.punch(last);
      } else {
        // (punching the air still sounds)
        jophSfx.punch(false);
      }
      if (barrage.timer % 8 === 0 || last) {
        jophestarSay(fighter, last ? 'ORAAA!' : 'ORA', last ? 24 : 15 + Math.random() * 5);
        jophSfx.ora(0.9 + Math.random() * 0.25, last);
      }
    }
    if (barrage.timer <= 0) fighter.jophBarrage = null;
  }

  // the stopped time
  if (fighter.jophTimeStopTimer > 0) {
    fighter.jophTimeStopTimer -= 1;
    const left = fighter.jophTimeStopTimer;
    const passed = (fighter.jophTimeStopMax || jophestarTimeStopDuration) - left;
    if (left > 0 && left % 30 === 0) jophSfx.tick(left % 60 === 0);
    if (left > 0 && passed % 60 === 0) jophSfx.heartbeat();
    // he counts the seconds that pass for nobody else
    if (left > 20 && passed > 0 && passed % 60 === 0) {
      const second = passed / 60;
      jophestarSay(fighter, `${second} segundo${second > 1 ? 's' : ''}`, 15, '#e0e0e0');
    }
    if (left === 22) jophSfx.timeResume();
    if (left === 0) {
      jophestarSay(fighter, 'El tiempo vuelve a moverse.', 13, '#e0e0e0');
      const frozen = fighter.jophTimeStopTarget;
      if (frozen) {
        frozen.jophFrozenTimer = 0;
        frozen.jophMovingInStop = 0;
      }
      fighter.jophTimeStopTarget = null;
    }
  }

  // the stand floats in (and out) smoothly
  const out = isJophestarStandOut(fighter);
  fighter.jophStandFade = Math.max(0, Math.min(1, (fighter.jophStandFade || 0) + (out ? 0.1 : -0.06)));
  const facing = fighter.attacksToTheRight ? 1 : -1;
  const center = fighter.position.x + fighter.width / 2;
  const goalX = fighter.jophBarrage ? center + facing * (fighter.width / 2 + 34) : center - facing * 46;
  fighter.jophStandX = typeof fighter.jophStandX === 'number' ? fighter.jophStandX + (goalX - fighter.jophStandX) * 0.3 : goalX;
}

function updateJophestar() {
  if (typeof player1 === 'undefined' || typeof player2 === 'undefined') return;
  updateJophestarFighter(player1, player2);
  updateJophestarFighter(player2, player1);
  updateJophestarCoins();
  updateJophestarClash();
  // (drawn after both fighters: the punches and the shouts go in front of the rival)
  [player1, player2].forEach((fighter) => {
    if (isJophestar(fighter) && fighter.jophTimeStopTimer > 0) drawJophestarTimeStopOverlay(fighter);
  });
  drawJophestarResistTint();
  drawJophestarCoins();
  [player1, player2].forEach((fighter) => {
    if (isJophestar(fighter) && fighter.jophBarrage) drawJophestarStand(fighter);
    drawJophestarStatusMarks(fighter);
    drawJophestarTexts(fighter);
  });
  drawJophestarClash();
}

// ---------- drawing: Jophestar himself ----------
function drawJophestarDetails(fighter) {
  // his look: a black coat with a tall zipped collar that hides his mouth, crossed straps,
  // an hourglass pendant, and a cap whose back melts into his hair (a fringe hides one eye)
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const cx = x + w / 2;
  const time = performance.now() / 1000;
  const facing = fighter.attacksToTheRight ? 1 : -1;
  const back = facing > 0 ? x : x + w;
  const front = facing > 0 ? x + w : x;
  const coat = '#121218';
  const coatLight = '#262633';
  const violet = '#9575cd';
  const silver = '#cfd8dc';
  const moving = Math.abs(fighter.velocity.x) > 0.4;

  // trousers and tall boots with violet soles
  ctx.fillStyle = '#0d0d12';
  ctx.fillRect(x + 7, y + 92, w - 14, h - 92);
  ctx.fillStyle = '#050508';
  ctx.fillRect(cx - 1, y + 96, 2, h - 100);
  ctx.fillStyle = '#1b1b22';
  ctx.fillRect(x + 5, y + h - 16, 21, 14);
  ctx.fillRect(x + w - 26, y + h - 16, 21, 14);
  ctx.fillStyle = violet;
  ctx.fillRect(x + 5, y + h - 3, 21, 3);
  ctx.fillRect(x + w - 26, y + h - 3, 21, 3);
  ctx.fillStyle = silver;
  ctx.fillRect(x + 8, y + h - 12, 4, 2);
  ctx.fillRect(x + w - 12, y + h - 12, 4, 2);

  // the coat: open at the bottom in two long flaps, lined in violet
  const sway = Math.sin(time * 2.6) * 2 + (moving ? -facing * 5 : 0);
  ctx.fillStyle = coat;
  ctx.fillRect(x, y + 34, w, 62);
  ctx.fillStyle = '#4a2a75';
  ctx.beginPath();
  ctx.moveTo(cx - 5, y + 90);
  ctx.lineTo(cx + 5, y + 90);
  ctx.lineTo(cx + 9, y + h - 10);
  ctx.lineTo(cx - 9, y + h - 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x, y + 90);
  ctx.lineTo(cx - 5, y + 90);
  ctx.lineTo(cx - 8, y + h - 10);
  ctx.lineTo(x + (facing > 0 ? sway : 0) - 2, y + h - 6);
  ctx.closePath();
  ctx.moveTo(cx + 5, y + 90);
  ctx.lineTo(x + w, y + 90);
  ctx.lineTo(x + w + (facing < 0 ? sway : 0) + 2, y + h - 6);
  ctx.lineTo(cx + 8, y + h - 10);
  ctx.closePath();
  ctx.fill();
  // a soft shine along his back
  ctx.fillStyle = coatLight;
  ctx.fillRect(back + (facing > 0 ? 2 : -6), y + 38, 4, 52);
  // two straps crossing his chest, with silver rings
  ctx.strokeStyle = '#2e2e3c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 44);
  ctx.lineTo(x + w - 6, y + 82);
  ctx.moveTo(x + w - 4, y + 44);
  ctx.lineTo(x + 6, y + 82);
  ctx.stroke();
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, y + 63, 3.5, 0, Math.PI * 2);
  ctx.stroke();
  // a belt with a violet buckle
  ctx.fillStyle = '#1e1e28';
  ctx.fillRect(x + 1, y + 84, w - 2, 5);
  ctx.fillStyle = violet;
  ctx.fillRect(cx - 4, y + 83, 8, 7);
  ctx.fillStyle = coat;
  ctx.fillRect(cx - 1.5, y + 85, 3, 3);
  // the hourglass pendant, swinging on a silver cord
  const swing = Math.sin(time * 2.2) * 2;
  const glassX = cx + facing * 12 + swing;
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + facing * 4, y + 40);
  ctx.lineTo(glassX, y + 52);
  ctx.stroke();
  ctx.fillStyle = silver;
  ctx.fillRect(glassX - 4, y + 52, 8, 1.5);
  ctx.fillRect(glassX - 4, y + 63, 8, 1.5);
  ctx.fillStyle = 'rgba(179, 136, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(glassX - 3, y + 54);
  ctx.lineTo(glassX + 3, y + 54);
  ctx.lineTo(glassX, y + 58);
  ctx.lineTo(glassX + 3, y + 62);
  ctx.lineTo(glassX - 3, y + 62);
  ctx.lineTo(glassX, y + 58);
  ctx.closePath();
  ctx.fill();
  // fingerless gloves
  ctx.fillStyle = '#1b1b22';
  ctx.fillRect(x - 3, y + 78, 8, 10);
  ctx.fillRect(x + w - 5, y + 78, 8, 10);
  ctx.fillStyle = '#e3bd96';
  ctx.fillRect(x - 3, y + 86, 8, 3);
  ctx.fillRect(x + w - 5, y + 86, 8, 3);

  // the tall zipped collar, hiding his mouth (a little higher on the front side)
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 40);
  ctx.lineTo(back + facing * 6, y + 26);
  ctx.lineTo(front - facing * 6, y + 22);
  ctx.lineTo(x + w - 4, y + 40);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = coatLight;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = violet;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(cx + facing * 4, y + 25);
  ctx.lineTo(cx + facing * 4, y + 44);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = silver;
  ctx.fillRect(cx + facing * 4 - 1.5, y + 24, 3, 4);

  // the face: only a strip shows between the fringe and the collar
  ctx.fillStyle = '#e8bf98';
  ctx.fillRect(x + 11, y + 12, w - 22, 14);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.fillRect(x + 11, y + 12, w - 22, 4);
  // one eye: calm, violet, half closed
  const eyeX = cx + facing * 7;
  ctx.fillStyle = '#111';
  ctx.fillRect(eyeX - 6, y + 15, 12, 2);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(eyeX - 5, y + 18, 10, 3.5);
  ctx.fillStyle = fighter.jophTimeStopTimer > 0 ? '#e1bee7' : '#7e57c2';
  ctx.fillRect(eyeX - 1 + facing * 2, y + 18, 4, 3.5);
  if (fighter.jophTimeStopTimer > 0 || fighter.jophStandFade > 0.5) {
    ctx.save();
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#d1c4e9';
    ctx.fillRect(eyeX - 1 + facing * 2, y + 18, 4, 3.5);
    ctx.restore();
  }

  // the cap: its back melts into his hair, and the hair falls in front of the other eye
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 12);
  ctx.lineTo(x + 7, y);
  ctx.quadraticCurveTo(cx, y - 9, x + w - 7, y);
  ctx.lineTo(x + w - 4, y + 12);
  ctx.closePath();
  ctx.fill();
  // the shaggy hair spilling out of the back, swept by the wind
  ctx.beginPath();
  ctx.moveTo(cx - facing * 2, y - 3);
  for (let lock = 0; lock < 4; lock += 1) {
    const reach = 12 + lock * 5 + Math.sin(time * 2.5 + lock) * 2;
    ctx.lineTo(back - facing * reach, y + 2 + lock * 7);
    ctx.lineTo(back - facing * (reach - 10), y + 6 + lock * 7);
  }
  ctx.lineTo(back + facing * 6, y + 30);
  ctx.lineTo(back + facing * 8, y + 6);
  ctx.closePath();
  ctx.fill();
  // the fringe over his face
  const fringeX = cx - facing * 7;
  ctx.beginPath();
  ctx.moveTo(fringeX - 13, y + 10);
  ctx.lineTo(fringeX + 13, y + 10);
  ctx.lineTo(fringeX + 8, y + 24);
  ctx.lineTo(fringeX + 3, y + 17);
  ctx.lineTo(fringeX - 2, y + 26);
  ctx.lineTo(fringeX - 6, y + 17);
  ctx.lineTo(fringeX - 11, y + 22);
  ctx.closePath();
  ctx.fill();
  // a short, stiff visor
  ctx.fillStyle = '#08080c';
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 8);
  ctx.lineTo(x + w - 6, y + 8);
  ctx.lineTo(front + facing * 3, y + 12);
  ctx.lineTo(back - facing * 0, y + 12);
  ctx.closePath();
  ctx.fill();
  // a violet stripe around the cap and a stitched silver hourglass
  ctx.fillStyle = violet;
  ctx.fillRect(x + 6, y + 5, w - 12, 2);
  ctx.strokeStyle = silver;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - 3, y - 4);
  ctx.lineTo(cx + 3, y - 4);
  ctx.lineTo(cx - 3, y + 3);
  ctx.lineTo(cx + 3, y + 3);
  ctx.closePath();
  ctx.stroke();
  // a little shine on the black
  ctx.strokeStyle = 'rgba(149, 117, 205, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 1);
  ctx.quadraticCurveTo(cx, y - 5, x + w - 14, y - 1);
  ctx.stroke();
}

// "ゴゴゴ" around him while the stand is out, and what the stand shouts
function drawJophestarTexts(fighter) {
  const time = performance.now() / 1000;
  if (isJophestar(fighter) && (fighter.jophStandFade > 0.3 || fighter.jophGlareCooldown > jophestarGlareCooldown - 90)) {
    ctx.save();
    ctx.globalAlpha = 0.55 * Math.max(fighter.jophStandFade, fighter.jophGlareCooldown > jophestarGlareCooldown - 90 ? 1 : 0);
    ctx.fillStyle = '#9575cd';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    [[-34, 18], [fighter.width + 32, 40], [-26, 70]].forEach(([offsetX, offsetY], index) => {
      const shake = Math.sin(time * 9 + index * 2) * 1.5;
      ctx.save();
      ctx.translate(fighter.position.x + offsetX + shake, fighter.position.y + offsetY + Math.sin(time * 2 + index) * 3);
      ctx.rotate(-0.15 + index * 0.12);
      ctx.fillText('ゴ', 0, 0);
      ctx.restore();
    });
    ctx.restore();
  }
  (fighter.jophTexts || []).forEach((text) => {
    ctx.save();
    ctx.globalAlpha = Math.min(1, text.life / 14);
    ctx.font = `900 ${text.size}px Impact, 'Arial Black', sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1a0f24';
    ctx.strokeText(text.text, text.x, text.y);
    ctx.fillStyle = text.color;
    ctx.fillText(text.text, text.x, text.y);
    ctx.restore();
  });
}

// ---------- drawing: the stand ----------
function drawJophestarStandPattern(stand, x, y, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = `hsl(${stand.hue}, 85%, 82%)`;
  ctx.strokeStyle = `hsl(${stand.hue}, 85%, 82%)`;
  ctx.lineWidth = 1.5;
  if (stand.pattern === 'zigzag') {
    ctx.beginPath();
    for (let step = 0; step <= width / 4; step += 1) ctx.lineTo(x + step * 4, y + height / 2 + (step % 2 ? -height / 3 : height / 3));
    ctx.stroke();
  } else {
    for (let spot = 0; spot < width / 8; spot += 1) {
      const spotX = x + 4 + spot * 8;
      const spotY = y + height / 2;
      ctx.beginPath();
      if (stand.pattern === 'hearts') {
        ctx.arc(spotX - 1.2, spotY - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(spotX + 1.2, spotY - 1, 1.5, 0, Math.PI * 2);
        ctx.moveTo(spotX - 2.6, spotY - 0.5);
        ctx.lineTo(spotX, spotY + 2.6);
        ctx.lineTo(spotX + 2.6, spotY - 0.5);
      } else if (stand.pattern === 'stars') {
        for (let point = 0; point < 10; point += 1) {
          const radius = point % 2 ? 1.2 : 3;
          const angle = -Math.PI / 2 + point * (Math.PI / 5);
          ctx.lineTo(spotX + Math.cos(angle) * radius, spotY + Math.sin(angle) * radius);
        }
      } else {
        ctx.arc(spotX, spotY, 1.6, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawJophestarStand(fighter) {
  const stand = fighter.jophStand;
  const fade = fighter.jophStandFade || 0;
  if (!stand || fade <= 0.02 || typeof fighter.jophStandX !== 'number') return;
  const time = performance.now() / 1000;
  const facing = fighter.attacksToTheRight ? 1 : -1;
  const cx = fighter.jophStandX;
  const top = fighter.position.y + (fighter.jophBarrage ? -8 : -22) + Math.sin(time * 2.2) * 3;
  const skin = `hsl(${stand.hue}, 55%, 58%)`;
  const skinDark = `hsl(${stand.hue}, 50%, 38%)`;
  const hair = `hsl(${stand.hue}, 60%, 24%)`;
  const cloth = `hsl(${stand.accent}, 75%, 50%)`;
  const clothDark = `hsl(${stand.accent}, 70%, 32%)`;
  const barrage = Boolean(fighter.jophBarrage);
  ctx.save();
  ctx.globalAlpha = fade * 0.92;
  // its aura
  const aura = ctx.createRadialGradient(cx, top + 50, 8, cx, top + 50, 70);
  aura.addColorStop(0, `hsla(${stand.hue}, 90%, 65%, 0.35)`);
  aura.addColorStop(1, `hsla(${stand.hue}, 90%, 65%, 0)`);
  ctx.fillStyle = aura;
  ctx.fillRect(cx - 70, top - 20, 140, 140);
  // a cape behind the shoulders
  if (stand.extra === 'cape') {
    ctx.fillStyle = clothDark;
    ctx.beginPath();
    ctx.moveTo(cx - 22, top + 30);
    ctx.lineTo(cx + 22, top + 30);
    ctx.lineTo(cx + 26 - facing * 10, top + 92 + Math.sin(time * 3) * 4);
    ctx.lineTo(cx - 26 - facing * 10, top + 96 + Math.sin(time * 3 + 1) * 4);
    ctx.closePath();
    ctx.fill();
  }
  // two long ribbons trailing from the back of its head
  ctx.strokeStyle = hair;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  [0, 1].forEach((ribbon) => {
    ctx.beginPath();
    ctx.moveTo(cx - facing * 8, top + 8 + ribbon * 4);
    ctx.bezierCurveTo(cx - facing * 26, top + 4 + Math.sin(time * 4 + ribbon) * 5, cx - facing * 34, top + 26 + ribbon * 6, cx - facing * (46 + ribbon * 4), top + 18 + ribbon * 10 + Math.sin(time * 4 + ribbon + 1) * 5);
    ctx.stroke();
  });
  ctx.lineCap = 'butt';
  // a ghost's tail instead of legs
  const tail = ctx.createLinearGradient(0, top + 66, 0, top + 124);
  tail.addColorStop(0, skinDark);
  tail.addColorStop(1, `hsla(${stand.hue}, 50%, 38%, 0)`);
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(cx - 14, top + 66);
  ctx.lineTo(cx + 14, top + 66);
  ctx.quadraticCurveTo(cx + 10, top + 100, cx - facing * 6 + Math.sin(time * 3) * 6, top + 124);
  ctx.quadraticCurveTo(cx - 8, top + 96, cx - 14, top + 66);
  ctx.fill();
  // a round, bell-shaped phantom body
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.moveTo(cx - 12, top + 26);
  ctx.quadraticCurveTo(cx - 28, top + 40, cx - 18, top + 70);
  ctx.lineTo(cx + 18, top + 70);
  ctx.quadraticCurveTo(cx + 28, top + 40, cx + 12, top + 26);
  ctx.closePath();
  ctx.fill();
  // ...wearing a harlequin vest: diamonds of two colors
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 14, top + 32);
  ctx.quadraticCurveTo(cx - 24, top + 46, cx - 16, top + 64);
  ctx.lineTo(cx + 16, top + 64);
  ctx.quadraticCurveTo(cx + 24, top + 46, cx + 14, top + 32);
  ctx.closePath();
  ctx.clip();
  for (let row = 0; row < 4; row += 1) {
    for (let col = -3; col <= 3; col += 1) {
      ctx.fillStyle = (row + col) % 2 === 0 ? cloth : clothDark;
      const diamondX = cx + col * 8 + (row % 2) * 4;
      const diamondY = top + 34 + row * 9;
      ctx.beginPath();
      ctx.moveTo(diamondX, diamondY - 5);
      ctx.lineTo(diamondX + 4, diamondY);
      ctx.lineTo(diamondX, diamondY + 5);
      ctx.lineTo(diamondX - 4, diamondY);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
  // a frilled collar
  ctx.fillStyle = '#fafafa';
  for (let frill = -2; frill <= 2; frill += 1) {
    ctx.beginPath();
    ctx.arc(cx + frill * 6, top + 29, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // the bizarre clothes: a belt with a pattern, a loincloth, wristbands...
  ctx.fillStyle = cloth;
  ctx.fillRect(cx - 15, top + 62, 30, 8);
  drawJophestarStandPattern(stand, cx - 15, top + 62, 30, 8);
  ctx.fillStyle = clothDark;
  ctx.beginPath();
  ctx.moveTo(cx - 7, top + 70);
  ctx.lineTo(cx + 7, top + 70);
  ctx.lineTo(cx + Math.sin(time * 3) * 3, top + 88);
  ctx.closePath();
  ctx.fill();
  if (stand.extra === 'pads') {
    [-1, 1].forEach((side) => {
      ctx.fillStyle = cloth;
      ctx.beginPath();
      ctx.ellipse(cx + side * 25, top + 30, 10, 7, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = clothDark;
      ctx.beginPath();
      ctx.moveTo(cx + side * 25, top + 22);
      ctx.lineTo(cx + side * 30, top + 14);
      ctx.lineTo(cx + side * 31, top + 24);
      ctx.closePath();
      ctx.fill();
    });
  }
  if (stand.extra === 'scarf') {
    ctx.fillStyle = cloth;
    ctx.fillRect(cx - 12, top + 25, 24, 6);
    ctx.beginPath();
    ctx.moveTo(cx - facing * 8, top + 27);
    ctx.quadraticCurveTo(cx - facing * 30, top + 30 + Math.sin(time * 5) * 4, cx - facing * 44, top + 22 + Math.sin(time * 5 + 1) * 5);
    ctx.lineTo(cx - facing * 40, top + 32);
    ctx.quadraticCurveTo(cx - facing * 26, top + 38, cx - facing * 4, top + 31);
    ctx.closePath();
    ctx.fill();
  }
  // the head: a white theater mask, one eye a little clock, the other a glowing slit
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(cx, top + 14, 12, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.ellipse(cx + facing * 2, top + 14, 9.5, 11.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = skinDark;
  ctx.lineWidth = 1;
  ctx.stroke();
  const clockEyeX = cx + facing * 6;
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(clockEyeX, top + 11, 3.2, 0, Math.PI * 2);
  ctx.moveTo(clockEyeX, top + 11);
  ctx.lineTo(clockEyeX + Math.cos(time * 3) * 2.6, top + 11 + Math.sin(time * 3) * 2.6);
  ctx.stroke();
  ctx.save();
  ctx.shadowColor = `hsl(${stand.hue}, 100%, 70%)`;
  ctx.shadowBlur = 6;
  ctx.fillStyle = `hsl(${stand.hue}, 100%, 60%)`;
  ctx.fillRect(cx - facing * 3 - 3, top + 10, 6, 2);
  ctx.restore();
  // a painted smile, stitched shut
  ctx.strokeStyle = '#212121';
  ctx.beginPath();
  ctx.moveTo(cx + facing * 2 - 5, top + 19);
  ctx.quadraticCurveTo(cx + facing * 2, top + 23, cx + facing * 2 + 5, top + 19);
  for (let stitch = -1; stitch <= 1; stitch += 1) {
    ctx.moveTo(cx + facing * 2 + stitch * 3, top + 19.5);
    ctx.lineTo(cx + facing * 2 + stitch * 3, top + 22.5);
  }
  ctx.stroke();
  // and on the head... something bizarre
  if (stand.hat === 'band') {
    ctx.fillStyle = cloth;
    ctx.fillRect(cx - 11, top + 4, 22, 4);
    ctx.beginPath();
    ctx.moveTo(cx - facing * 11, top + 5);
    ctx.lineTo(cx - facing * 24, top + 2 + Math.sin(time * 6) * 3);
    ctx.lineTo(cx - facing * 22, top + 9 + Math.sin(time * 6 + 1) * 3);
    ctx.closePath();
    ctx.fill();
  } else if (stand.hat === 'crown') {
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(cx - 10, top + 2);
    [-10, -5, 0, 5, 10].forEach((spikeX, index) => {
      ctx.lineTo(cx + spikeX, top - (index % 2 ? 2 : 8));
      ctx.lineTo(cx + spikeX + 2.5, top + 2);
    });
    ctx.closePath();
    ctx.fill();
  } else if (stand.hat === 'horns') {
    ctx.strokeStyle = cloth;
    ctx.lineWidth = 3;
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(cx + side * 7, top + 4);
      ctx.quadraticCurveTo(cx + side * 16, top - 4, cx + side * 12, top - 12);
      ctx.stroke();
    });
  }
  // no arms: two big white gloves float beside it... and become a storm of fists in the barrage
  const glove = (gloveX, gloveY, size) => {
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = skinDark;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(gloveX, gloveY, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = cloth;
    ctx.fillRect(gloveX - facing * (size + 3) - 2.5, gloveY - size * 0.7, 5, size * 1.4);
    drawJophestarStandPattern(stand, gloveX - facing * (size + 3) - 2.5, gloveY - size * 0.7, 5, size * 1.4);
  };
  if (barrage) {
    for (let fist = 0; fist < 8; fist += 1) {
      const reach = 16 + Math.random() * 48;
      const fistX = cx + facing * reach;
      const fistY = top + 26 + Math.random() * 40;
      ctx.strokeStyle = `hsla(${stand.hue}, 70%, 75%, 0.45)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fistX - facing * 22, fistY);
      ctx.lineTo(fistX - facing * 8, fistY);
      ctx.stroke();
      glove(fistX, fistY, 5.5);
    }
  } else {
    const bob = Math.sin(time * 3) * 3;
    glove(cx - 27, top + 46 + bob, 6.5);
    glove(cx + 27, top + 46 - bob, 6.5);
  }
  ctx.restore();
}

// ---------- the world in grey while time is stopped ----------
function getJophestarStopFade(fighter) {
  const max = fighter.jophTimeStopMax || jophestarTimeStopDuration;
  const passed = max - fighter.jophTimeStopTimer;
  return { passed, left: fighter.jophTimeStopTimer, fade: Math.min(1, passed / 18) * Math.min(1, fighter.jophTimeStopTimer / 22) };
}

function drawJophestarTimeStopWave(fighter) {
  const { fade } = getJophestarStopFade(fighter);
  const time = performance.now() / 1000;
  ctx.save();
  // the colors drain out of everything drawn so far
  ctx.globalCompositeOperation = 'saturation';
  ctx.globalAlpha = fade;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // a huge clock in the sky, stopped: its second hand trembles, stuck
  const clockX = canvas.width / 2;
  const clockY = canvas.height * 0.42;
  const radius = Math.min(canvas.width, canvas.height) * 0.36;
  const angle = fighter.jophStopAngle || 0;
  ctx.save();
  ctx.globalAlpha = 0.22 * fade;
  ctx.strokeStyle = '#d1c4e9';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(clockX, clockY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(clockX, clockY, radius * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  for (let mark = 0; mark < 60; mark += 1) {
    const markAngle = mark * (Math.PI / 30);
    const inner = radius * (mark % 5 === 0 ? 0.78 : 0.85);
    ctx.lineWidth = mark % 5 === 0 ? 4 : 1.5;
    ctx.beginPath();
    ctx.moveTo(clockX + Math.cos(markAngle) * inner, clockY + Math.sin(markAngle) * inner);
    ctx.lineTo(clockX + Math.cos(markAngle) * radius * 0.9, clockY + Math.sin(markAngle) * radius * 0.9);
    ctx.stroke();
  }
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(angle * 0.3) * radius * 0.45, clockY + Math.sin(angle * 0.3) * radius * 0.45);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(angle) * radius * 0.68, clockY + Math.sin(angle) * radius * 0.68);
  ctx.stroke();
  const stuck = angle + 1.3 + Math.sin(time * 40) * 0.015;
  ctx.strokeStyle = '#b388ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(stuck) * radius * 0.82, clockY + Math.sin(stuck) * radius * 0.82);
  ctx.stroke();
  ctx.restore();
  // dust hanging still in the air
  ctx.save();
  ctx.globalAlpha = 0.55 * fade;
  ctx.fillStyle = '#ffffff';
  (fighter.jophDust || []).forEach((speck) => {
    ctx.beginPath();
    ctx.arc(speck.x, speck.y, speck.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// ...and after the fighters: a violet shade, dark corners, the wave going out (and back in), the title
function drawJophestarTimeStopOverlay(fighter) {
  const { passed, left, fade } = getJophestarStopFade(fighter);
  const cx = fighter.position.x + fighter.width / 2;
  const cy = fighter.position.y + fighter.height / 2;
  const reach = Math.hypot(canvas.width, canvas.height);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.fillStyle = 'rgba(40, 20, 80, 0.16)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, reach * 0.6);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(10, 4, 20, 0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // the sphere that turns everything inside out: it grows over the whole screen... and pulls back into him
  const waveRadius = passed <= 22 ? (passed / 22) * reach : passed <= 44 ? ((44 - passed) / 22) * reach : left < 22 ? ((22 - left) / 22) * reach : 0;
  if (waveRadius > 2) {
    ctx.save();
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = left < 22 ? 0.55 : 0.85;
    ctx.beginPath();
    ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.lineWidth = 6;
    [['#b388ff', 0], ['#ffd54f', 10], ['#4dd0e1', 20]].forEach(([color, offset]) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, waveRadius - offset), 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }
  if (passed > 10 && passed < 100) {
    const pop = Math.min(1, (passed - 10) / 8);
    ctx.save();
    ctx.globalAlpha = Math.min(1, (100 - passed) / 20);
    ctx.translate(canvas.width / 2, canvas.height * 0.36);
    ctx.scale(0.6 + pop * 0.4, 0.6 + pop * 0.4);
    ctx.font = "900 40px Impact, 'Arial Black', sans-serif";
    ctx.textAlign = 'center';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1a0f24';
    ctx.strokeText('¡TIEMPO, DETENTE!', 0, 0);
    const shine = ctx.createLinearGradient(-200, 0, 200, 0);
    shine.addColorStop(0, '#b388ff');
    shine.addColorStop(0.5, '#ffffff');
    shine.addColorStop(1, '#ffd54f');
    ctx.fillStyle = shine;
    ctx.fillText('¡TIEMPO, DETENTE!', 0, 0);
    ctx.restore();
  }
  // a ring around him shows how much stopped time is left
  if (left > 0) {
    const max = fighter.jophTimeStopMax || jophestarTimeStopDuration;
    ctx.save();
    ctx.globalAlpha = 0.8 * fade;
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, fighter.position.y - 22, 9, -Math.PI / 2, -Math.PI / 2 + (left / max) * Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

(function hookJophestarDrawing() {
  const baseDraw = Fighter.prototype.draw;
  Fighter.prototype.draw = function drawWithJophestar(...args) {
    if (isJophestar(this)) {
      if (this.jophTimeStopTimer > 0) {
        drawJophestarTimeStopWave(this);
        // (the grey covers what was drawn before: if Chrono was already drawn, draw him again in color)
        const mover = this.jophTimeStopTarget;
        if (mover && mover.jophMovingInStop > 0 && mover === player1 && this === player2) baseDraw.call(mover);
      }
      // the stand floats behind him (while it punches, it is drawn in front of everything)
      if (!this.jophBarrage) drawJophestarStand(this);
      return baseDraw.apply(this, args);
    }
    const result = baseDraw.apply(this, args);
    // a frozen rival stays grey
    if (this.jophFrozenTimer > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'saturation';
      ctx.fillStyle = '#808080';
      ctx.fillRect(this.position.x - 6, this.position.y - 26, this.width + 12, this.height + 30);
      ctx.restore();
    }
    return result;
  };
})();

// ---------- hooks into the game ----------
(function hookJophestarIntoTheGame() {
  const baseSetType = Fighter.prototype.setCharacterType;
  Fighter.prototype.setCharacterType = function setCharacterTypeWithJophestar(characterType, secretVariant = null) {
    const result = baseSetType.call(this, characterType, secretVariant);
    resetJophestarState(this);
    if (characterType === 'jophestar' && !this.secretVariant) {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = jophestarDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 30 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(jophestarHealth);
      this.color = '#14141b';
      this.attackColor = 'rgba(149, 117, 205, 0.6)';
    }
    return result;
  };

  const baseReset = Fighter.prototype.reset;
  Fighter.prototype.reset = function resetWithJophestar(...args) {
    const result = baseReset.apply(this, args);
    resetJophestarState(this);
    jophestarCoins = [];
    jophestarClash = null;
    return result;
  };

  // every hit he lands while his stand is out gets an extra punch from it
  const baseApplyDamage = applyDamage;
  applyDamage = function applyDamageWithStand(attacker, target, damage, options = {}) {
    // a rival scared by "Yare yare" hits softer
    const scared = attacker && attacker !== target && attacker.jophIntimidatedTimer > 0;
    const dealt = baseApplyDamage(attacker, target, scared ? damage * jophestarGlareDamageTaken : damage, options);
    if (isJophestar(attacker) && !options.isSpecial && attacker.jophStandTimer > 0 && damage > 0 && target !== attacker && !attacker.jophFollowUp) {
      attacker.jophFollowUp = { timer: 8, target };
    }
    return dealt;
  };

  // Chrono stops time on Jophestar: his stand drags him through it (and if Jophestar had stopped it too, they crash)
  const baseChronoTimeStop = activateChronoTimeStop;
  activateChronoTimeStop = function activateChronoTimeStopAgainstStand(attacker, target) {
    if (!isJophestar(target)) return baseChronoTimeStop(attacker, target);
    if (!canFighterAct(attacker) || attacker.characterType !== 'chrono' || attacker.chronoTimeStopCooldown > 0 || gameOver) return baseChronoTimeStop(attacker, target);
    if (target.jophTimeStopTimer > 0) {
      attacker.chronoTimeStopCooldown = getDebugCooldown(chronoTimeStopCooldown, attacker);
      recordSpecialUsed(attacker);
      startJophestarTimeClash(target, attacker);
      return true;
    }
    const used = baseChronoTimeStop(attacker, target);
    if (used && target.chronoTimeStopTimer > 0) {
      if (!isJophestarStandOut(target) || !target.jophStand) rollJophestarStand(target);
      target.jophChronoResist = target.chronoTimeStopTimer;
      target.chronoTimeStopTimer = 0;
      jophestarSay(target, '¡Mi Stand tambien se mueve aca!', 14, `hsl(${target.jophStand.hue}, 90%, 75%)`);
    }
    return used;
  };

  const baseUpdate = updateMonkeyCoconuts;
  updateMonkeyCoconuts = function updateMonkeyCoconutsAndJophestar(...args) {
    const result = baseUpdate.apply(this, args);
    updateJophestar();
    return result;
  };

  const baseCooldowns = getPlayerAbilityCooldowns;
  getPlayerAbilityCooldowns = function getPlayerAbilityCooldownsWithJophestar(player) {
    if (isJophestar(player)) {
      const standOut = isJophestarStandOut(player);
      return {
        q: { active: true, name: 'Invocar Stand', remaining: player.jophStandCooldown, max: getDebugCooldown(jophestarStandCooldown, player) },
        f: standOut
          ? { active: true, name: 'Rafaga ORA ORA', remaining: player.jophBarrageCooldown, max: getDebugCooldown(jophestarBarrageCooldown, player) }
          : { active: true, name: 'Moneda', remaining: player.jophCoinCooldown, max: getDebugCooldown(jophestarCoinCooldown, player) },
        r: standOut
          ? { active: true, name: 'Tiempo, detente', remaining: player.jophTimeStopCooldown, max: getDebugCooldown(jophestarTimeStopCooldown, player) }
          : { active: true, name: 'Yare yare', remaining: player.jophGlareCooldown, max: getDebugCooldown(jophestarGlareCooldown, player) },
      };
    }
    return baseCooldowns(player);
  };

  const baseHealth = getCharacterMaxHealth;
  getCharacterMaxHealth = function getCharacterMaxHealthWithJophestar(characterType, fighter = null) {
    if (characterType === 'jophestar' && !(fighter && fighter.secretVariant)) return jophestarHealth;
    return baseHealth(characterType, fighter);
  };

  const baseRange = getBotPreferredRange;
  getBotPreferredRange = function getBotPreferredRangeWithJophestar(...args) {
    if (isJophestar(player2)) return 140;
    return baseRange.apply(this, args);
  };

  if (jophestarCharacterButton) jophestarCharacterButton.addEventListener('click', () => selectCharacter('jophestar'));

  characterDisplayNames.jophestar = 'Jophestar';
  victoryPhrases.jophestar = {
    default: [
      'Yare yare... que pelea mas aburrida.',
      'Nadie me invito. Igual gane.',
      'Tu error fue pelear contra alguien con un fantasma raro atras.',
      'Ni lo vi venir. Ah, no, eso fuiste vos.',
    ],
    chrono: ['Detener el tiempo es facil. Lo dificil es no aburrirse mientras.'],
    ghost: ['Un fantasma contra otro. El mio se viste mejor.'],
    monkey: ['...Ni pregunto por que hay un mono.'],
  };
})();

// the bot: barrage up close, time stop to open the guard, and the stand whenever it can
function useJophestarBot(bot, rival, profile, absDistance, closePressure) {
  if (!isJophestarStandOut(bot)) {
    if (bot.jophStandCooldown === 0 && absDistance < 520 && shouldBotUseSpecial(profile, 0.8)) return summonJophestarStand(bot, rival);
    if (bot.jophGlareCooldown === 0 && absDistance < 480 && shouldBotUseSpecial(profile, 0.4)) return jophestarGlare(bot, rival);
    if (bot.jophCoinCooldown === 0 && absDistance > 140 && absDistance < 720 && shouldBotUseSpecial(profile, 0.7)) return flickJophestarCoin(bot, rival);
    return false;
  }
  if (bot.jophTimeStopCooldown === 0 && absDistance < 420 && shouldBotUseSpecial(profile, 0.55)) {
    return activateJophestarTimeStop(bot, rival);
  }
  if (bot.jophBarrageCooldown === 0 && absDistance < jophestarBarrageReach - 15 && shouldBotUseSpecial(profile, closePressure ? 1 : 0.85)) {
    return launchJophestarBarrage(bot, rival);
  }
  if (bot.jophStandCooldown === 0 && !isJophestarStandOut(bot) && absDistance < 520 && shouldBotUseSpecial(profile, 0.8)) {
    return summonJophestarStand(bot, rival);
  }
  return false;
}

// ================= unlocking him: the uninvited guy =================
// Before that he doesn't exist: not in the character select (not even locked), not in the guide, not in the wardrobe.
// Only Statistics knows about him... and tells you to find the way.
// The way: stay on the title screen without touching ANYTHING. Something menacing starts to show up: ゴ ゴ ゴ.
// Catch every ゴ before they fade... and he walks in, uninvited.
const jophestarUnlockKey = 'moqueteJophestarUnlocked';
const jophestarIdleNeeded = 45000;
const jophestarMenaceCount = 5;
const jophestarMenaceTime = 15000;
const jophestarMenace = { lastInput: performance.now(), active: false, caught: 0, timer: null, elements: [] };

function isJophestarUnlocked() {
  try {
    return localStorage.getItem(jophestarUnlockKey) === '1';
  } catch (error) {
    return false;
  }
}

function syncJophestarUnlockUI() {
  const unlocked = isJophestarUnlocked();
  if (jophestarCharacterButton) {
    jophestarCharacterButton.classList.toggle('hidden', !unlocked);
    jophestarCharacterButton.disabled = !unlocked;
  }
  const guideEntry = document.getElementById('jophestarGuideEntry');
  if (guideEntry) guideEntry.classList.toggle('hidden', !unlocked);
  // the statistics row: there, but a mystery
  const row = document.querySelector('[data-stats-character="jophestar"]');
  if (row) {
    row.classList.toggle('joph-locked-row', !unlocked);
    let hint = row.querySelector('.joph-stats-hint');
    if (!unlocked && !hint) {
      hint = document.createElement('small');
      hint.className = 'joph-stats-hint';
      hint.textContent = 'Encontra la manera de desbloquearlo. ゴゴゴ...';
      row.querySelector('.stats-character').appendChild(hint);
    }
    if (unlocked && hint) hint.remove();
  }
}

(function hideJophestarUntilUnlocked() {
  const baseSelectable = getSelectableCharacterTypes;
  getSelectableCharacterTypes = function getSelectableCharacterTypesWithoutJophestar(...args) {
    const list = baseSelectable.apply(this, args);
    return isJophestarUnlocked() ? list : list.filter((type) => type !== 'jophestar');
  };
  const baseSelect = selectCharacter;
  selectCharacter = function selectCharacterIfJophestarCame(characterType, ...rest) {
    if (characterType === 'jophestar' && !rest[0] && !isJophestarUnlocked()) return;
    return baseSelect.call(this, characterType, ...rest);
  };
  const baseOmega = getOmegaTransformationCharacters;
  getOmegaTransformationCharacters = function getOmegaTransformationCharactersWithoutJophestar(...args) {
    if (isJophestarUnlocked()) return baseOmega.apply(this, args);
    return baseOmega.apply(this, args).map((type) => (type === 'jophestar' ? 'normal' : type));
  };
  // (Statistics redraws its rows and then calls this one)
  const baseRiftSync = syncRiftLostCharacters;
  syncRiftLostCharacters = function syncRiftLostAndJophestar(...args) {
    const result = baseRiftSync.apply(this, args);
    syncJophestarUnlockUI();
    return result;
  };
  syncJophestarUnlockUI();
})();

function isJophestarMenaceStage() {
  const title = document.getElementById('titleScreen');
  if (!title || title.classList.contains('hidden') || gameStarted) return false;
  // (nothing else open on top of the menu)
  return !document.querySelector('.vhs-overlay, .wardrobe-overlay, .joph-arrival');
}

function noteJophestarMenuInput() {
  if (jophestarMenace.active) return;
  jophestarMenace.lastInput = performance.now();
}
['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'].forEach((type) => window.addEventListener(type, noteJophestarMenuInput, { passive: true }));

function clearJophestarMenace(fade) {
  clearTimeout(jophestarMenace.timer);
  jophestarMenace.elements.forEach((element) => {
    if (fade) {
      element.classList.add('fading');
      setTimeout(() => element.remove(), 700);
    } else {
      element.remove();
    }
  });
  jophestarMenace.elements = [];
  jophestarMenace.active = false;
  jophestarMenace.caught = 0;
  jophestarMenace.lastInput = performance.now();
}

function startJophestarMenace() {
  jophestarMenace.active = true;
  jophestarMenace.caught = 0;
  playTone({ frequency: 55, duration: 2.2, type: 'sawtooth', volume: 0.03 });
  for (let index = 0; index < jophestarMenaceCount; index += 1) {
    setTimeout(() => {
      if (!jophestarMenace.active) return;
      const menace = document.createElement('button');
      menace.type = 'button';
      menace.className = 'joph-menace';
      menace.textContent = 'ゴ';
      menace.setAttribute('aria-label', 'ゴ');
      menace.style.left = `${8 + Math.random() * 80}vw`;
      menace.style.top = `${10 + Math.random() * 72}vh`;
      menace.style.setProperty('--size', `${38 + Math.random() * 34}px`);
      menace.style.setProperty('--tilt', `${(Math.random() - 0.5) * 40}deg`);
      menace.addEventListener('click', (event) => {
        event.stopPropagation();
        if (menace.classList.contains('caught')) return;
        menace.classList.add('caught');
        jophestarMenace.caught += 1;
        playTone({ frequency: 180 + jophestarMenace.caught * 70, duration: 0.18, type: 'square', volume: 0.03 });
        setTimeout(() => menace.remove(), 400);
        if (jophestarMenace.caught >= jophestarMenaceCount) {
          clearTimeout(jophestarMenace.timer);
          jophestarMenace.elements = [];
          jophestarMenace.active = false;
          setTimeout(startJophestarArrival, 500);
        }
      });
      document.body.appendChild(menace);
      jophestarMenace.elements.push(menace);
      playTone({ frequency: 70 + index * 8, duration: 0.4, type: 'sawtooth', volume: 0.025 });
    }, index * 650);
  }
  // too slow: the menace fades away (try again some other time)
  jophestarMenace.timer = setTimeout(() => clearJophestarMenace(true), jophestarMenaceTime);
}

setInterval(() => {
  if (isJophestarUnlocked()) return;
  if (!isJophestarMenaceStage()) {
    if (jophestarMenace.active) clearJophestarMenace(false);
    jophestarMenace.lastInput = performance.now();
    return;
  }
  if (!jophestarMenace.active && performance.now() - jophestarMenace.lastInput >= jophestarIdleNeeded) startJophestarMenace();
}, 1000);

// a small picture of him (with his stand) drawn by the real game code
function renderJophestarPortrait() {
  const mini = document.createElement('canvas');
  mini.width = 200;
  mini.height = 190;
  try {
    const saved = ctx.getImageData(0, 0, 200, 190);
    ctx.clearRect(0, 0, 200, 190);
    const actor = new Fighter({ x: 0, y: 0, color: '#14141b', attacksToTheRight: true });
    actor.setCharacterType('jophestar');
    rollJophestarStand(actor);
    actor.position = { x: 110, y: 180 - actor.height };
    actor.jophStandFade = 1;
    actor.jophStandX = 82;
    actor.jophStandTimer = 1;
    actor.draw();
    mini.getContext('2d').drawImage(canvas, 0, 0, 200, 190, 0, 0, 200, 190);
    ctx.putImageData(saved, 0, 0);
  } catch (error) {
    // (no picture)
  }
  return mini;
}

function startJophestarArrival() {
  try {
    localStorage.setItem(jophestarUnlockKey, '1');
  } catch (error) {
    // (he still came, for this session)
  }
  const overlay = document.createElement('div');
  overlay.className = 'joph-arrival';
  overlay.innerHTML = '<div class="joph-arrival-menace"><span>ゴ</span><span>ゴ</span><span>ゴ</span><span>ゴ</span></div><div class="joph-arrival-figure"></div><p class="joph-arrival-line"></p><b class="joph-arrival-title hidden">JOPHESTAR SE UNIO A LA PELEA</b><small class="joph-arrival-hint hidden">(nadie lo invito)</small>';
  overlay.querySelector('.joph-arrival-figure').appendChild(renderJophestarPortrait());
  document.body.appendChild(overlay);
  playNoise({ duration: 0.8, volume: 0.05, filterFrequency: 400 });
  playTone({ frequency: 82, duration: 1.6, type: 'sawtooth', volume: 0.035 });
  const lines = ['...', 'Yare yare.', 'Tanto ruido en este menu... y nadie me invito.', 'Igual vine.'];
  const lineElement = overlay.querySelector('.joph-arrival-line');
  let index = 0;
  const next = () => {
    if (index < lines.length) {
      lineElement.textContent = lines[index];
      playTone({ frequency: 140 + index * 20, duration: 0.12, type: 'square', volume: 0.02 });
      index += 1;
      setTimeout(next, index === 1 ? 1500 : 1900);
      return;
    }
    overlay.querySelector('.joph-arrival-title').classList.remove('hidden');
    overlay.querySelector('.joph-arrival-hint').classList.remove('hidden');
    playSound('achievement');
    syncJophestarUnlockUI();
    overlay.addEventListener('click', () => {
      overlay.classList.add('closing');
      setTimeout(() => overlay.remove(), 500);
      jophestarMenace.lastInput = performance.now();
    });
  };
  setTimeout(next, 1400);
}
