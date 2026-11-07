// Moquete - FLAMETOMB: el hechizo prohibido de Fire Master
// (se carga despues de la parte 9b)

// ---------------- learning it ----------------
// three hard requirements: read the page of the spell book, beat chapter 2 in HARDERCORE, win 50 fights with Fire Master
const flametombReadKey = 'moqueteFlametombRead';
const flametombLearnedKey = 'moqueteFlametombLearned';
const flametombDamage = 300;
const flametombWinsNeeded = 50;

function readFlametombFlag(key) {
  try {
    return localStorage.getItem(key) === '1';
  } catch (error) {
    return false;
  }
}

function writeFlametombFlag(key) {
  try {
    localStorage.setItem(key, '1');
  } catch (error) {
    // only this session
  }
}

function getFlametombRequirements() {
  const records = typeof loadHardcoreRecords === 'function' ? loadHardcoreRecords().fireMaster || {} : {};
  const wins = typeof ensureCharacterStatistic === 'function' ? ensureCharacterStatistic('fireMaster').wins || 0 : 0;
  return [
    { text: 'Leer esta pagina del Libro de Hechizos', done: readFlametombFlag(flametombReadKey) },
    { text: 'Superar el capitulo 2 (Fire Master) en HARDERCORE', done: Boolean(records.harder) },
    { text: `Ganar ${flametombWinsNeeded} peleas con Fire Master (${Math.min(wins, flametombWinsNeeded)}/${flametombWinsNeeded})`, done: wins >= flametombWinsNeeded },
  ];
}

function isFlametombUnlocked() {
  return readFlametombFlag(flametombLearnedKey);
}

// checked when the book is opened and when a fight starts
function syncFlametombUnlock() {
  if (isFlametombUnlocked()) return true;
  if (!getFlametombRequirements().every((requirement) => requirement.done)) return false;
  writeFlametombFlag(flametombLearnedKey);
  showCustomToast('FIRE MASTER APRENDIO FLAMETOMB', 'Tercera habilidad de Fire Master (R). 300 de daño. Una vez por pelea. ...El no quiere usarla.');
  playTone({ frequency: 46, duration: 2.4, type: 'sawtooth', volume: 0.06, slideTo: 30 });
  return true;
}

// ---------------- casting it ----------------
const flametomb = {
  active: false,
  caster: null,
  target: null,
  t: 0,
  darkness: 0,
  towerX: 0,
  towerHeight: 0,
  sparks: [],
  dust: [],
  ch2: false,
  hitDone: false,
  fightId: null,
  spirit: null,
};
const flametombDespair = [
  '(...Que hice?)',
  '(Ice Master... levantate. Por favor, levantate.)',
  '(No fue mi intencion... NO FUE MI INTENCION.)',
  '(Todavia lo escucho... el fuego... no se apaga...)',
  '(Lo siento. Lo siento. Lo siento. Lo siento.)',
  '(Por que no me detuve? POR QUE NO ME DETUVE?)',
  '(Sorcerer tenia razon... nunca debi leer esa pagina...)',
];
const flametombRefusals = [
  '(No... ese hechizo no. Prometi no volver a usarlo.)',
  '(Todavia escucho el fuego crepitar... No. NO.)',
  '(Tiene que haber otra forma... tiene que haber otra forma...)',
  '(...Perdoname, Ice Master.)',
];

function isFireArcadeFinal() {
  return normalArcadeActive && arcadeChapter === 'fireMaster' && selectedNormalArcadeLevel === 5 && isIceMaster(player2);
}

function canUseFlametomb(fighter) {
  return Boolean(fighter && fighter.characterType === 'fireMaster' && !isIceMaster(fighter) && isFlametombUnlocked());
}

function isFlametombUsed(fighter) {
  return fighter.flametombFightId === fightStartedAt;
}

function getFlametombCooldown(fighter) {
  if (fighter && fighter.rareMachine && typeof getChronoMachineCooldown === 'function') return getChronoMachineCooldown(fighter);
  if (fighter && fighter.obsidian) return { active: true, name: 'Flametomb', remaining: fighter.obsidianTombCooldown || 0, max: obsidianTombCooldown };
  if (!canUseFlametomb(fighter)) return { active: false };
  return { active: true, name: 'Flametomb', remaining: isFlametombUsed(fighter) || flametomb.active ? 1 : 0, max: 1 };
}

function showFlametombThought(fighter, text) {
  fighter.flametombThought = { text, life: 220 };
}

// R (or Enter for player 2)
function handleFlametombKey(caster, target) {
  // the end of 3B: "USE FLAMETOMB NOW"
  if (caster === player1 && routeBEnding.stage === 'prompt') {
    triggerRouteBTomb();
    return true;
  }
  if (caster === player1 && routeBEnding.stage) return true;
  if (caster.obsidian) return handleObsidianTomb(caster, target);
  if (!canUseFlametomb(caster)) return false;
  if (caster.flametombTrauma) return true;
  if (flametomb.active || isFlametombUsed(caster) || gameOver || !gameStarted || arcadeCutscene.active || !canFighterAct(caster) || caster.gamblerStunTimer > 0) return true;
  // the last level of chapter 2: he refuses... three times
  if (caster === player1 && isFireArcadeFinal()) {
    caster.flametombRefusals = caster.flametombRefusals || 0;
    const refusals = arcadeRouteB ? flametombRefusalsB : flametombRefusals;
    if (caster.flametombRefusals < 3) {
      showFlametombThought(caster, refusals[caster.flametombRefusals]);
      caster.flametombRefusals += 1;
      playTone({ frequency: 90, duration: 0.6, type: 'sine', volume: 0.06, slideTo: 60 });
      return true;
    }
    showFlametombThought(caster, refusals[3]);
  }
  startFlametomb(caster, target);
  return true;
}

function startFlametomb(caster, target) {
  Object.assign(flametomb, {
    active: true,
    caster,
    target,
    t: 0,
    darkness: 0,
    towerX: getFighterCenterX(target),
    towerHeight: 0,
    sparks: [],
    dust: [],
    ch2: caster === player1 && isFireArcadeFinal(),
    hitDone: false,
  });
  caster.flametombFightId = fightStartedAt;
  caster.velocity.x = 0;
  recordSpecialUsed(caster);
  // (silence: the music stops before anything happens)
  setFlametombSilence(true);
}

// ---------------- the sound: silence first, then Snowgrave's sound, and the attack lasts as long as it does ----------------
const flametombSoundSource = encodeURI("assetsaudio/Noelle's Snowgrave Sound Effect (Deltarune).mp3");
const flametombSilenceEnd = 110;
let flametombMusicMuted = false;

function setFlametombSilence(on) {
  if (on === flametombMusicMuted) return;
  flametombMusicMuted = on;
  if (typeof musicGain !== 'undefined' && musicGain) musicGain.gain.value = on ? 0 : 0.12 * audioSettings.music;
  if (on) stopReflecterBattleMusic();
}

function isFlametombSilence() {
  return flametombMusicMuted;
}

function playFlametombSound() {
  stopFlametombSound();
  if (typeof Audio === 'undefined') return;
  const sound = new Audio(flametombSoundSource);
  sound.volume = Math.max(0, Math.min(1, 0.9 * audioSettings.master * audioSettings.sfx));
  flametomb.sound = sound;
  const playPromise = sound.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

function stopFlametombSound() {
  if (flametomb.sound) {
    flametomb.sound.pause();
    flametomb.sound = null;
  }
}

// how long the attack lasts: as long as the sound (about 9 seconds)
function getFlametombSoundFrames() {
  const sound = flametomb.sound;
  if (sound && Number.isFinite(sound.duration) && sound.duration > 1) return Math.round(sound.duration * 60);
  return 546;
}

// "a new route has been unlocked...": a short, eerie sting
function playFlametombRouteSting() {
  playFlametombStingSound();
  writeFlametombFlag('moqueteFlametombRoute');
}

// (the sound alone: it comes back every time Fire Master "gets stronger")
function playFlametombStingSound() {
  playTone({ frequency: 110, duration: 1.6, type: 'square', volume: 0.03 });
  playTone({ frequency: 116.5, duration: 1.6, type: 'square', volume: 0.03 });
  [[880, 0], [622, 260], [415, 520], [311, 900]].forEach(([frequency, delay]) => {
    setTimeout(() => {
      playTone({ frequency, duration: 0.7, type: 'sine', volume: 0.05, slideTo: frequency * 0.97 });
      playTone({ frequency: frequency * 1.012, duration: 0.7, type: 'triangle', volume: 0.025 });
    }, delay);
  });
  setTimeout(() => playNoise({ duration: 1.2, volume: 0.03, filterFrequency: 400 }), 1100);
}

function resetFlametombFighter(fighter) {
  fighter.flametombTilt = 0;
  fighter.flametombTrauma = false;
  fighter.flametombRefusals = 0;
  fighter.flametombThought = null;
  fighter.dusted = false;
  fighter.scriptedFlight = false;
  fighter.scammerBurnt = false;
  fighter.routeBPanic = false;
  fighter.scammerLying = false;
}

function updateFlametomb() {
  updateMiniFlametombs();
  updateRouteBEnding();
  // a new fight: everything back to normal
  if (flametomb.fightId !== fightStartedAt) {
    flametomb.fightId = fightStartedAt;
    flametomb.active = false;
    flametomb.spirit = null;
    flametomb.darkness = 0;
    flametomb.aftermath = false;
    obsidianTomb = null;
    stopObsidianTombSounds();
    stopFlametombSound();
    setFlametombSilence(false);
    cleanupRouteBState();
    resetFlametombFighter(player1);
    resetFlametombFighter(player2);
    syncFlametombUnlock();
  }
  [player1, player2].forEach((fighter) => {
    if (fighter.flametombThought) {
      fighter.flametombThought.life -= 1;
      if (fighter.flametombThought.life <= 0) fighter.flametombThought = null;
    }
  });
  updateFlametombAftermath();
  updateRouteBMood();
  if (fireStronger.caption > 0) fireStronger.caption += 1;
  if (fireStronger.caption > 330) fireStronger.caption = 0;
  if (!flametomb.active) {
    // after chapter 2's Flametomb the stage stays dark, silent and tense
    const tense = flametomb.aftermath && !gameOver;
    flametomb.darkness += ((tense ? 0.55 : 0) - flametomb.darkness) * 0.03;
    return;
  }
  const { caster, target } = flametomb;
  const t = flametomb.t;
  flametomb.t += 1;
  // everything stops while it happens
  target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 3);
  target.velocity.x = 0;
  const soundFrames = getFlametombSoundFrames();
  const towerStart = flametombSilenceEnd + Math.round(soundFrames * 0.38);
  const hitFrame = flametombSilenceEnd + Math.round(soundFrames * 0.8);
  const fallFrame = flametombSilenceEnd + soundFrames;
  const doneFrame = fallFrame + 70;
  if (t < fallFrame) {
    caster.scriptedFlight = true;
    caster.velocity.x = 0;
    caster.velocity.y = 0;
  }
  // 1) the world goes dark... 2) and silent. Nothing moves.
  if (t < 45) flametomb.darkness = Math.min(0.88, flametomb.darkness + 0.022);
  if (t >= 45 && t < flametombSilenceEnd) caster.flametombTilt = Math.sin(t * 0.9) * 0.015;
  // 3) the sound begins: he rises, crooked, against his will; sparks gather around him
  if (t === flametombSilenceEnd) playFlametombSound();
  if (t >= flametombSilenceEnd && t < fallFrame) {
    const lift = Math.min(1, (t - flametombSilenceEnd) / 80) * 70;
    caster.position.y = ground - caster.height - lift + Math.sin(t * 0.4) * 3;
    const jerk = Math.random() < 0.08 ? (Math.random() - 0.5) * 0.6 : 0;
    caster.flametombTilt = Math.sin(t * 0.17) * 0.28 + jerk;
    if (t < towerStart) {
      for (let spark = 0; spark < 2; spark += 1) {
        flametomb.sparks.push({ angle: Math.random() * Math.PI * 2, distance: 30 + Math.random() * 60, life: 40, spin: (Math.random() - 0.5) * 0.2 });
      }
    }
  }
  flametomb.sparks.forEach((spark) => {
    spark.angle += spark.spin + 0.05;
    spark.distance *= 0.97;
    spark.life -= 1;
  });
  flametomb.sparks = flametomb.sparks.filter((spark) => spark.life > 0);
  // 4) the tomb: a tower of flames from under the target, following it until the sound ends
  if (t === towerStart) flametomb.towerX = getFighterCenterX(target);
  if (t >= towerStart && t < fallFrame) {
    const rise = Math.min(1, (t - towerStart) / 50, (fallFrame - t) / 40);
    flametomb.towerHeight = Math.max(0, rise) * (flametomb.big ? 560 : 440);
    flametomb.towerX += (getFighterCenterX(target) - flametomb.towerX) * 0.06 + Math.sin(t * 0.2) * 1.5;
  } else {
    flametomb.towerHeight = 0;
  }
  if (t === hitFrame && !flametomb.hitDone) {
    flametomb.hitDone = true;
    if (flametomb.ch2) {
      dustIceMaster(target);
    } else if (flametomb.routeBEnd) {
      routeBEndTombHit(target);
    } else if (isRouteB4Chrono(target)) {
      routeB4ChronoDodge(target, false);
    } else {
      applyDamage(caster, target, flametombDamage, { isSpecial: true, ignoreInvincible: true });
      rememberFlametombVictim(target.secretVariant || target.characterType);
      updateHealthBars();
    }
  }
  // 5) the sound ends: he falls, stunned
  if (t === fallFrame) {
    caster.scriptedFlight = false;
    caster.flametombTilt = 0;
    caster.velocity.y = 3;
    caster.gamblerStunTimer = Math.max(caster.gamblerStunTimer, getDebugDuration(150, caster));
    caster.flametombDizzy = 150;
    playSound('robotHit');
  }
  if (t >= fallFrame + 15 && !flametomb.ch2) flametomb.darkness = Math.max(0, flametomb.darkness - 0.02);
  if (t >= doneFrame) {
    flametomb.active = false;
    stopFlametombSound();
    if (flametomb.ch2) {
      // the stage stays dark and silent; a new route has been unlocked...
      flametomb.aftermath = true;
      flametomb.thoughtTimer = 250;
      flametomb.droneTimer = 30;
      caster.flametombTrauma = true;
      showFlametombThought(caster, '(...Que hice?)');
      setTimeout(playFlametombRouteSting, 1800);
    } else {
      setFlametombSilence(false);
    }
  }
}

// ---------------- chapter 2: nothing left of Ice Master but dust... and his spirit ----------------
function rememberFlametombVictim(victim) {
  try {
    localStorage.setItem('moqueteFlametombLastVictim', victim);
  } catch (error) {
    // only this session
  }
}

function dustIceMaster(iceMaster) {
  rememberFlametombVictim('iceMaster');
  const centerX = getFighterCenterX(iceMaster);
  const centerY = iceMaster.position.y + iceMaster.height / 2;
  for (let grain = 0; grain < 90; grain += 1) {
    flametomb.dust.push({ x: iceMaster.position.x + Math.random() * iceMaster.width, y: iceMaster.position.y + Math.random() * iceMaster.height, vx: (Math.random() - 0.3) * 2, vy: -Math.random() * 1.5, life: 120 + Math.random() * 80 });
  }
  flametomb.spirit = { x: centerX, y: centerY, absorbed: 0, found: false };
  iceMaster.dusted = true;
  iceMaster.health = 1;
  iceMaster.position.x = -2000;
  clearFlametombArena();
  updateHealthBars();
}

function clearFlametombArena() {
  fireballs = [];
  fireBeams = [];
}

function updateFlametombAftermath() {
  flametomb.dust.forEach((grain) => {
    grain.x += grain.vx;
    grain.y += grain.vy;
    grain.vy += 0.02;
    grain.life -= 1;
  });
  flametomb.dust = flametomb.dust.filter((grain) => grain.life > 0);
  const spirit = flametomb.spirit;
  if (!spirit || gameOver) return;
  player2.gamblerStunTimer = Math.max(player2.gamblerStunTimer, 5);
  player2.position.x = -2000;
  const fireMaster = player1;
  // he walks slowly, shaking hard; he can't fight anymore, and he can't stop thinking about it
  if (fireMaster.flametombTrauma) {
    fireMaster.velocity.x *= 0.35;
    fireMaster.flametombTilt = Math.sin(performance.now() / 35) * 0.05 + (Math.random() < 0.05 ? (Math.random() - 0.5) * 0.25 : 0);
    if (!spirit.absorbed) {
      flametomb.thoughtTimer -= 1;
      if (flametomb.thoughtTimer <= 0) {
        flametomb.thoughtIndex = ((flametomb.thoughtIndex || 0) + 1) % flametombDespair.length;
        showFlametombThought(fireMaster, flametombDespair[flametomb.thoughtIndex]);
        flametomb.thoughtTimer = 250;
      }
    }
  }
  // the tension: a low drone and a heartbeat in the silence
  if (flametomb.aftermath) {
    flametomb.droneTimer = (flametomb.droneTimer || 0) - 1;
    if (flametomb.droneTimer <= 0) {
      flametomb.droneTimer = 200;
      playTone({ frequency: 41, duration: 3.2, type: 'sawtooth', volume: 0.035, slideTo: 38 });
      setTimeout(() => playTone({ frequency: 52, duration: 0.16, type: 'sine', volume: 0.09 }), 900);
      setTimeout(() => playTone({ frequency: 48, duration: 0.2, type: 'sine', volume: 0.08 }), 1150);
    }
  }
  // the spirit floats where Ice Master was... until Fire Master takes it
  if (!spirit.absorbed && fireMaster.flametombTrauma && Math.abs(getFighterCenterX(fireMaster) - spirit.x) < 50) {
    spirit.absorbed = 1;
    showFlametombThought(fireMaster, '(...Perdoname. Te llevo conmigo. Para siempre.)');
    playTone({ frequency: 880, duration: 1.2, type: 'sine', volume: 0.06, slideTo: 440 });
    playNoise({ duration: 0.5, volume: 0.04, filterFrequency: 5000 });
  }
  if (spirit.absorbed) {
    spirit.absorbed += 1;
    spirit.x += (getFighterCenterX(fireMaster) - spirit.x) * 0.15;
    spirit.y += (fireMaster.position.y + 40 - spirit.y) * 0.15;
    if (spirit.absorbed > 170) {
      unlockRouteB();
      // (finishing 2B opens 3B)
      if (arcadeRouteB) writeFlametombFlag(routeB2DoneKey);
      // the level ends here
      flametomb.spirit = null;
      fireMaster.flametombTrauma = true;
      player2.health = 0;
      updateHealthBars();
    }
  }
}

// ---------------- drawing it ----------------
function drawFlametombFlame(x, y, size, phase, layer) {
  const flicker = 1 + Math.sin(phase) * 0.18;
  const tipX = x + Math.sin(phase * 0.7) * size * 0.35;
  const tipY = y - size * 1.7 * flicker;
  const gradient = ctx.createLinearGradient(x, y + size * 0.5, x, tipY);
  if (layer === 'outer') {
    gradient.addColorStop(0, 'rgba(255, 214, 0, 0.9)');
    gradient.addColorStop(0.45, 'rgba(255, 109, 0, 0.75)');
    gradient.addColorStop(1, 'rgba(213, 0, 0, 0)');
  } else {
    // the black heart of the fire
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.6, 'rgba(90, 0, 10, 0.85)');
    gradient.addColorStop(1, 'rgba(90, 0, 10, 0)');
  }
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x - size * 0.7, y + size * 0.3);
  ctx.quadraticCurveTo(x - size * 0.75, y - size * 0.7, tipX, tipY);
  ctx.quadraticCurveTo(x + size * 0.75, y - size * 0.7, x + size * 0.7, y + size * 0.3);
  ctx.quadraticCurveTo(x, y + size * 0.8, x - size * 0.7, y + size * 0.3);
  ctx.fill();
}

function drawFlametombFx() {
  updateFlametomb();
  const time = performance.now() / 1000;
  if (normalArcadeActive && (arcadeChapter === 'gamblerB' || arcadeChapter === 'reflecterB') && !arcadeCutscene.active) drawRouteB3Cold(getRouteB3Cold());
  drawRouteB4Fx();
  drawRouteB4LibraryWatcher();
  drawRouteB5Fx();
  drawRouteB6Fx();
  drawFireStrongerCaption();
  if (typeof updateChronoChapter === 'function') {
    updateChronoChapter();
    drawChronoChapterFx();
  }
  if (typeof updateAbnPlayerRules === 'function') {
    updateAbnPlayerRules();
    drawAbnPlayerRules();
  }
  if (typeof updateDarkworldVersus === 'function') {
    updateDarkworldVersus();
    drawDarkworldFx();
  }
  if (typeof updateDebugExtras === 'function') {
    updateDebugExtras();
    drawDebugExtras();
  }
  if (typeof updateChronoMachine === 'function') {
    updateChronoMachine();
    drawChronoMachineFx();
  }
  if (isRouteBFight()) drawRouteBMood();
  if (flametomb.darkness > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${flametomb.darkness})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (flametomb.active) {
    const caster = flametomb.caster;
    // the caster again, over the darkness: he is the only thing you can see
    if (flametomb.t >= 20 && flametomb.t < 240) {
      caster.flametombNoTilt = false;
      drawFlametombCaster(caster);
    }
    const centerX = getFighterCenterX(caster);
    const centerY = caster.position.y + caster.height / 2;
    flametomb.sparks.forEach((spark) => {
      ctx.fillStyle = spark.life % 6 < 3 ? '#fff3e0' : '#ff9100';
      ctx.fillRect(centerX + Math.cos(spark.angle) * spark.distance - 1.5, centerY + Math.sin(spark.angle) * spark.distance - 1.5, 3, 3);
    });
    if (flametomb.towerHeight > 0) {
      // the tower: flames on flames, black at the heart
      ctx.save();
      const height = flametomb.towerHeight;
      const baseX = flametomb.towerX;
      const glow = ctx.createRadialGradient(baseX, ground - height / 2, 20, baseX, ground - height / 2, height * 0.7);
      glow.addColorStop(0, 'rgba(255, 61, 0, 0.35)');
      glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(baseX - height, ground - height * 1.2, height * 2, height * 1.4);
      // a burning ring on the ground where it rises
      ctx.globalCompositeOperation = 'lighter';
      const ring = ctx.createRadialGradient(baseX, ground, 4, baseX, ground, 130);
      ring.addColorStop(0, 'rgba(255, 171, 0, 0.8)');
      ring.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = ring;
      ctx.fillRect(baseX - 130, ground - 40, 260, 80);
      const flames = 30;
      for (let flame = 0; flame < flames; flame += 1) {
        const along = flame / flames;
        const y = ground - along * height;
        const big = flametomb.big ? 1.7 : 1;
        const sway = Math.sin(time * 6 + flame * 0.7) * (12 + along * 30) * big;
        const size = ((1 - along) * 46 + 18) * big;
        drawFlametombFlame(baseX + sway - 18 * big, y, size, time * 12 + flame, 'outer');
        drawFlametombFlame(baseX - sway + 18 * big, y - 12, size * 0.9, time * 10 + flame * 1.7, 'outer');
      }
      ctx.globalCompositeOperation = 'source-over';
      for (let flame = 0; flame < flames; flame += 2) {
        const along = flame / flames;
        const y = ground - along * height;
        const sway = Math.sin(time * 6 + flame * 0.7) * (12 + along * 30);
        drawFlametombFlame(baseX + sway * 0.5, y + 6, ((1 - along) * 46 + 18) * 0.45, time * 14 + flame, 'core');
      }
      // embers flying off the tower
      ctx.globalCompositeOperation = 'lighter';
      for (let ember = 0; ember < 40; ember += 1) {
        const rise = (time * 160 + ember * 53) % height;
        const emberX = baseX + Math.sin(ember * 2.3 + time * 3) * (30 + (rise / height) * 90);
        ctx.fillStyle = ember % 3 ? 'rgba(255, 145, 0, 0.9)' : 'rgba(255, 241, 118, 0.9)';
        ctx.fillRect(emberX, ground - rise, 3, 3);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
    }
  }
  // what is left of Ice Master
  flametomb.dust.forEach((grain) => {
    ctx.fillStyle = `rgba(200, 220, 235, ${Math.min(0.8, grain.life / 100)})`;
    ctx.fillRect(grain.x, grain.y, 2, 2);
  });
  const spirit = flametomb.spirit;
  if (spirit) {
    const bob = Math.sin(time * 2.5) * 8;
    const fade = spirit.absorbed ? Math.max(0, 1 - spirit.absorbed / 120) : 1;
    const glow = ctx.createRadialGradient(spirit.x, spirit.y + bob, 2, spirit.x, spirit.y + bob, 46);
    glow.addColorStop(0, `rgba(225, 245, 254, ${fade})`);
    glow.addColorStop(0.4, `rgba(79, 195, 247, ${0.7 * fade})`);
    glow.addColorStop(1, 'rgba(79, 195, 247, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(spirit.x - 46, spirit.y + bob - 46, 92, 92);
    ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
    ctx.beginPath();
    ctx.ellipse(spirit.x, spirit.y + bob, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!spirit.absorbed && player1.flametombTrauma && Math.floor(time * 2) % 2 === 0) {
      ctx.font = '900 15px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#b3e5fc';
      ctx.strokeText('Agarra el espiritu de hielo', spirit.x, spirit.y - 50);
      ctx.fillText('Agarra el espiritu de hielo', spirit.x, spirit.y - 50);
      ctx.textAlign = 'left';
    }
  }
  // dizzy after the fall
  [player1, player2].forEach((fighter) => {
    if (!(fighter.flametombDizzy > 0)) return;
    const headX = getFighterCenterX(fighter);
    ctx.fillStyle = '#ff9100';
    for (let star = 0; star < 3; star += 1) {
      const angle = time * 5 + (star / 3) * Math.PI * 2;
      ctx.fillRect(headX + Math.cos(angle) * 28 - 3, fighter.position.y - 12 + Math.sin(angle) * 8 - 3, 6, 6);
    }
    fighter.flametombDizzy -= 1;
  });
  if (player1.flametombTrauma && !gameOver) {
    // tears
    const headX = getFighterCenterX(player1);
    ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
    [-9, 9].forEach((offset, side) => {
      const fall = (time * 40 + side * 11) % 30;
      ctx.beginPath();
      ctx.ellipse(headX + offset, player1.position.y + 34 + fall, 2, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  drawMiniFlametombs();
  drawRouteBEnding();
  drawBurntScammer(player2);
  drawFlametombThoughts();
}

function drawFlametombCaster(caster) {
  ctx.save();
  const centerX = caster.position.x + caster.width / 2;
  const centerY = caster.position.y + caster.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(caster.flametombTilt || 0);
  ctx.translate(-centerX, -centerY);
  caster.draw();
  ctx.restore();
}

// what he thinks (a cloud over his head)
function drawFlametombThoughts() {
  [player1, player2].forEach((fighter) => {
    const thought = fighter.flametombThought;
    if (!thought) return;
    const alpha = Math.min(1, thought.life / 30, (220 - thought.life) / 15 + 0.2);
    const x = Math.max(170, Math.min(canvas.width - 170, getFighterCenterX(fighter)));
    const y = Math.max(70, fighter.position.y - 70);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'italic 700 14px Arial, sans-serif';
    const width = Math.min(320, ctx.measureText(thought.text).width + 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, width / 2, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    [[x - 10, y + 34, 7], [x - 2, y + 48, 4]].forEach(([dotX, dotY, radius]) => {
      ctx.beginPath();
      ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = '#263238';
    ctx.textAlign = 'center';
    // (long thoughts on two lines)
    const words = thought.text.split(' ');
    const half = Math.ceil(words.length / 2);
    if (ctx.measureText(thought.text).width > 300) {
      ctx.fillText(words.slice(0, half).join(' '), x, y - 3);
      ctx.fillText(words.slice(half).join(' '), x, y + 14);
    } else {
      ctx.fillText(thought.text, x, y + 5);
    }
    ctx.textAlign = 'left';
    ctx.restore();
  });
}

// ================= ROUTE B (the "weird route" of the Arcade) =================
// it opens after finishing chapter 2's last level with Flametomb
const routeBStorageKey = 'moqueteRouteBUnlocked';
const fireArcadeRouteBProgressStorageKey = 'moqueteFireArcadeProgressB';
let arcadeRouteB = false;
let arcadeRouteView = 'A';
const flametombRefusalsB = [
  '(No... otra vez no.)',
  '(Ya se como termina esto. Ya lo vi. Ya lo hice.)',
  '(Me mira igual que la ultima vez... como si no supiera...)',
  '(...Perdoname. Otra vez.)',
];
const routeBThoughts = [
  '(Sigo escuchando el fuego...)',
  '(Ice Master me esta esperando arriba. No quiero llegar.)',
  '(Esta montaña... ya la subi. Ya se lo que hay al final.)',
  '(Si gano... si llego... va a pasar de nuevo.)',
  '(Mis manos no dejan de temblar.)',
];

function isRouteBUnlocked() {
  return readFlametombFlag(routeBStorageKey);
}

function unlockRouteB() {
  if (arcadeRouteB || isRouteBUnlocked()) return;
  writeFlametombFlag(routeBStorageKey);
  setTimeout(() => {
    showCustomToast('...', 'Algo cambio en el Arcade. Una nueva ruta se ha desbloqueado.');
    playFlametombRouteSting();
  }, 2500);
}

function isRouteBFight() {
  return normalArcadeActive && arcadeRouteB && arcadeChapter === 'fireMaster' && gameStarted;
}

// Ice Master can't fall in 2B... not without the forbidden spell
function routeBDamageFloor(target) {
  if (isRouteBFight() && selectedNormalArcadeLevel === 5 && isIceMaster(target) && !target.dusted && !flametomb.hitDone) {
    if (target.health < 1) {
      target.health = 1;
      if (!target.routeBHinted) {
        target.routeBHinted = true;
        showFlametombThought(player1, '(...No cae. No va a caer. Solo queda una opcion.)');
      }
    }
  }
}

// the whole chapter is silent and tense: a drone, a heartbeat, his thoughts
function updateRouteBMood() {
  updateRouteB3Thoughts();
  updateRouteB4();
  updateFrostFireThoughts();
  if (typeof updateObsidianCodeThoughts === 'function') updateObsidianCodeThoughts();
  if (!isRouteBFight()) {
    // (back to normal once out of 2B, unless Flametomb is on)
    if (!flametomb.active && !flametomb.aftermath && flametombMusicMuted && !arcadeRouteB) setFlametombSilence(false);
    return;
  }
  if (gameOver) return;
  setFlametombSilence(true);
  flametomb.routeDrone = (flametomb.routeDrone || 0) - 1;
  if (flametomb.routeDrone <= 0) {
    flametomb.routeDrone = 260;
    playTone({ frequency: 44, duration: 3.6, type: 'sawtooth', volume: 0.03, slideTo: 40 });
    setTimeout(() => playTone({ frequency: 52, duration: 0.15, type: 'sine', volume: 0.07 }), 1200);
    setTimeout(() => playTone({ frequency: 48, duration: 0.18, type: 'sine', volume: 0.06 }), 1450);
  }
  if (!flametomb.active && !flametomb.aftermath && !arcadeCutscene.active) {
    flametomb.routeThought = (flametomb.routeThought || 400) - 1;
    if (flametomb.routeThought <= 0) {
      flametomb.routeThought = 1100 + Math.floor(Math.random() * 500);
      showFlametombThought(player1, routeBThoughts[Math.floor(Math.random() * routeBThoughts.length)]);
    }
  }
}

function drawRouteBMood() {
  const time = performance.now() / 1000;
  ctx.fillStyle = 'rgba(12, 0, 4, 0.38)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.55, 160, canvas.width / 2, canvas.height * 0.55, 620);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(40, 0, 0, ${0.7 + Math.sin(time * 1.3) * 0.05})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the hint, once Ice Master won't fall
  if (selectedNormalArcadeLevel === 5 && player2.routeBHinted && !flametomb.active && !flametomb.hitDone && Math.floor(time * 2) % 2 === 0) {
    ctx.font = '900 16px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#ff5252';
    ctx.strokeText('R: FLAMETOMB', canvas.width / 2, 120);
    ctx.fillText('R: FLAMETOMB', canvas.width / 2, 120);
    ctx.textAlign = 'left';
  }
}

function syncRouteBChapterUI() {
  if (arcadeChapter !== 'fireMaster') return;
  const titles = ['La primera chispa... otra vez', 'Guardianes congelados', 'Calor bajo cero', 'El glaciar que camina', 'El invierno eterno'];
  const descriptions = [
    'La misma montaña. Los mismos Brutos Invernales. Fire Master sabe exactamente lo que hay arriba.',
    'Los guardianes bloquean el paso, como la ultima vez. El no quiere que se aparten.',
    'Hace frio. Pero el solo siente calor. Un calor que no se va.',
    'El glaciar camina hacia el. Cada paso lo acerca mas al final.',
    'Ice Master lo espera en la cima. Esta vez no va a caer... no de la forma normal.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (index >= titles.length) return;
    if (title) title.innerText = titles[index];
    if (description) description.innerText = descriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo 2B: El despertar de Fire Master... otra vez';
  arcadeStoryKicker.innerText = 'Ruta B';
  arcadeStoryParagraphOne.innerText =
    'Fire Master vuelve a subir la montaña nevada. Todo es igual que antes: el frio, los brutos, el camino. Todo menos el.';
  arcadeStoryParagraphTwo.innerText =
    'Todavia escucha el fuego crepitar. Sabe lo que hay en la cima. Sabe lo que va a tener que hacer. Y aun asi, sigue subiendo.';
}

// the A / B tabs of the chapter screen
const arcadeRouteTabs = document.getElementById('arcadeRouteTabs');
const arcadeRouteBPanel = document.getElementById('arcadeRouteBPanel');

function syncArcadeRouteTabs() {
  if (!arcadeRouteTabs || !arcadeRouteBPanel) return;
  const unlocked = isRouteBUnlocked();
  if (!unlocked) arcadeRouteView = 'A';
  arcadeRouteTabs.classList.toggle('hidden', !unlocked);
  arcadeRouteTabs.querySelectorAll('[data-route]').forEach((tab) => tab.classList.toggle('active', tab.dataset.route === arcadeRouteView));
  const panelA = document.querySelector('.arcade-chapters-panel:not(.arcade-routeB-panel)');
  if (panelA) panelA.classList.toggle('hidden', arcadeRouteView === 'B');
  arcadeRouteBPanel.classList.toggle('hidden', arcadeRouteView !== 'B');
  syncRouteB3Card();
  syncRouteB4Card();
  syncChronoChapterCard();
  const screen = document.getElementById('arcadeChaptersScreen');
  if (screen) screen.classList.toggle('route-b-view', arcadeRouteView === 'B');
  const title = document.getElementById('arcadeChaptersTitle');
  if (title) title.innerText = arcadeRouteView === 'B' ? 'Ruta B' : 'Capitulos de Arcade';
}

if (arcadeRouteTabs) {
  arcadeRouteTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-route]');
    if (!tab || tab.dataset.route === arcadeRouteView) return;
    arcadeRouteView = tab.dataset.route;
    if (arcadeRouteView === 'B') playTone({ frequency: 70, duration: 0.8, type: 'sawtooth', volume: 0.05, slideTo: 50 });
    else playSound('menuMove');
    syncArcadeRouteTabs();
  });
}
const fireArcadeBChapterButton = document.getElementById('fireArcadeBChapterButton');
if (fireArcadeBChapterButton) fireArcadeBChapterButton.addEventListener('click', () => openArcadeChapter('fireMaster', true));

// ================= CHAPTER 3B: Ciudad Cobalto... without Gambler =================
const routeB2DoneKey = 'moqueteRouteB2Done';
const routeB3ProgressStorageKey = 'moqueteRouteB3Progress';
const routeB3LevelCount = 5;
const routeB3PlayableLevels = 5;
const routeB3Levels = {
  1: { enemies: ['armoredCowboy'], difficulties: ['medium'] },
  2: { enemies: ['armoredCowboy', 'fireSorcerer'], difficulties: ['medium', 'medium'] },
  3: { enemies: ['fireSorcerer', 'timeMirror'], difficulties: ['medium', 'hard'] },
  4: { enemies: ['timeMirror', 'armoredCowboy', 'chimera'], difficulties: ['medium', 'hard', 'hard'] },
};
let routeB3Stage = 'fire';
const routeB3Thoughts = [
  '(Hace un momento estaba en la montaña... como llegue aca?)',
  '(Esta ciudad es azul. Como el hielo. Como el.)',
  '(Por que tengo frio? Yo nunca tengo frio.)',
  '(Estos monstruos estan hechos de pedazos de otros... como yo ahora?)',
  '(Gambler... quien es Gambler? Por que todos lo nombran?)',
  '(No uses el fuego negro. No uses el fuego negro.)',
  '(Hace un segundo habia nieve. Ahora hay neon. Que me esta pasando?)',
];

function isRouteB3Unlocked() {
  return readFlametombFlag(routeB2DoneKey);
}

function syncRouteB3Card() {
  const card = document.getElementById('gamblerArcadeBChapterButton');
  if (!card) return;
  const unlocked = isRouteB3Unlocked();
  card.disabled = !unlocked;
  card.classList.toggle('routeB-locked', !unlocked);
  const title = card.querySelector('[data-routeb3-title]');
  const copy = card.querySelector('[data-routeb3-copy]');
  if (title) title.innerText = unlocked ? 'Ciudad Cobalto... sin Gambler' : '???';
  if (copy) copy.innerText = unlocked
    ? 'Capitulo 3B. Fire Master despierta en una ciudad azul que no conoce, llena de monstruos cosidos. Y sus manos estan frias.'
    : 'Termina el capitulo 2B.';
}

// Fire Master, with a little of Ice Master inside him now: more health, more damage, cold hands
function makeFrostFireMaster(fighter) {
  fighter.setCharacterType('fireMaster');
  fighter.frostFire = true;
  fighter.miniFlametomb = false;
  fighter.miniFlametombCooldown = 0;
  fighter.setMaxHealth(125);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1.2;
}

function drawFrostFireDetails(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const width = fighter.width;
  const flameX = x + width / 2;
  const flameY = y + 42;
  // the symbol: half fire, half ice
  ctx.save();
  ctx.beginPath();
  ctx.rect(flameX, flameY - 20, 14, 40);
  ctx.clip();
  ctx.fillStyle = '#b3e5fc';
  ctx.beginPath();
  ctx.moveTo(flameX, flameY - 18);
  ctx.lineTo(flameX + 12, flameY + 10);
  ctx.lineTo(flameX, flameY + 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4fc3f7';
  ctx.fillRect(flameX, flameY + 2, 5, 12);
  ctx.restore();
  ctx.strokeStyle = '#e1f5fe';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(flameX, flameY - 18);
  ctx.lineTo(flameX, flameY + 18);
  ctx.stroke();
  // a few small patches of ice on the body
  ctx.fillStyle = 'rgba(179, 229, 252, 0.9)';
  [[0.14, 0.62, 5], [0.8, 0.3, 4], [0.7, 0.85, 3.5]].forEach(([u, v, size]) => {
    const iceX = x + width * u;
    const iceY = y + fighter.height * v;
    ctx.beginPath();
    ctx.moveTo(iceX, iceY - size);
    ctx.lineTo(iceX + size * 0.7, iceY);
    ctx.lineTo(iceX, iceY + size);
    ctx.lineTo(iceX - size * 0.7, iceY);
    ctx.closePath();
    ctx.fill();
  });
  // frost on the belt
  ctx.fillStyle = 'rgba(225, 245, 254, 0.7)';
  ctx.fillRect(x + width * 0.6, y + 78, width * 0.3, 4);
}

function configureRouteB3Level() {
  if (selectedNormalArcadeLevel === 5) {
    // level 5: the edge of the city, Scammer... and his secret weapon
    routeB3Stage = 'fire';
    makeFrostFireMaster(player1);
    player1.miniFlametomb = true;
    selectedMap = 'cobaltEdge';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureScammerBoss();
    return;
  }
  if (selectedNormalArcadeLevel === 4) {
    // level 4 starts with GAMBLER against SCAMMER... until something cold arrives
    routeB3Stage = 'gambler';
    player1.setCharacterType('gambler');
    player1.frostFire = false;
    selectedMap = 'gamblerAlley';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureScammerBoss();
    return;
  }
  routeB3Stage = 'fire';
  makeFrostFireMaster(player1);
  selectedMap = 'gamblerArcade';
  const levelData = routeB3Levels[selectedNormalArcadeLevel] || routeB3Levels[1];
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  configureRouteB3Enemy();
}

function configureRouteB3Enemy() {
  if (selectedNormalArcadeLevel === 5) {
    configureScammerBoss();
    return;
  }
  if (selectedNormalArcadeLevel === 4 && routeB3Stage === 'gambler') {
    configureScammerBoss();
    return;
  }
  const levelData = routeB3Levels[selectedNormalArcadeLevel] || routeB3Levels[1];
  const enemyIndex = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  const hybridId = levelData.enemies[enemyIndex];
  const hybrid = hybridEnemyTypes[hybridId];
  player2.setCharacterType(hybrid.baseType);
  player2.secretVariant = hybridId;
  if (hybrid.color) player2.color = hybrid.color;
  botDifficulty = levelData.difficulties[enemyIndex] || 'medium';
  applyBotDifficulty();
  player2.setMaxHealth(hybrid.health);
  player2.health = player2.maxHealth;
  player2.hybridAbilityCooldown = 90;
  player2.hybridAbilityIndex = 0;
  updateHealthBars();
  updateCombatHudIdentity();
}

function syncRouteB3ChapterUI() {
  const titles = ['Ruido de cartas', 'Monstruos cosidos', 'El nombre de Gambler', 'Una presencia fria', 'El borde de la ciudad'];
  const descriptions = [
    'Un apostador acaba de pasar por aca. Unos momentos despues llega alguien que no deberia estar en esta ciudad.',
    'Mas criaturas hechas de pedazos de otros luchadores. Fire Master no entiende de donde salen... ni de donde salio el.',
    'Todos los monstruos parecen buscar al mismo apostador. Fire Master solo quiere saber como volver.',
    'Gambler enfrenta a Scammer, como siempre. Pero en medio de la pelea, Scammer siente algo frio acercandose... y tiene miedo.',
    'En el borde de Ciudad Cobalto, Scammer espera. Esta vez no viene a vender nada: viene con su arma secreta.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (index >= titles.length) return;
    if (title) title.innerText = titles[index];
    if (description) description.innerText = descriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo 3B: Ciudad Cobalto... sin Gambler';
  arcadeStoryKicker.innerText = 'Ruta B';
  arcadeStoryParagraphOne.innerText =
    'Fire Master cerro los ojos en la cima de la montaña nevada. Cuando los abrio, estaba en una ciudad azul de dados gigantes, cartas que se mueven y monstruos cosidos con pedazos de otros luchadores.';
  arcadeStoryParagraphTwo.innerText =
    'Su simbolo ya no es solo fuego. Sus manos estan frias. Y alguien llamado Gambler paso por aca justo antes que el.';
}

// ---------- the intros ----------
const routeB3IntroLines = {
  1: [
    { speaker: 'gambler', text: 'Uno mas para la coleccion. Esta ciudad fabrica monstruos mas rapido de lo que yo los gano.', gamblerFight: true },
    { speaker: 'gambler', text: 'Quedate en el piso, Vaquero Blindado. Y si ves al que te armo... decile que lo estoy buscando.', hybridDown: true, emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'gambler', text: 'La suerte sigue de mi lado. Por ahora.', hybridDown: true, gamblerLeave: true },
    { speaker: 'origNarrator', text: 'Unos momentos despues...', hybridDown: true, later: true },
    { speaker: 'fireMaster', text: '...Haah... haah... donde estoy? Hace un segundo estaba en la montaña. Con la nieve. Con... el polvo.', hybridDown: true, fmIn: true },
    { speaker: 'fireMaster', text: 'Edificios azules. Dados gigantes. Cartas que se mueven solas... Esto no es la montaña.', hybridDown: true, emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'fireMaster', text: 'Y mis manos... por que estan frias? El fuego nunca estuvo frio.', hybridDown: true },
    { speaker: 'fireMaster', text: '...Eh? Esa cosa en el piso... se esta levantando.', hybridUp: true, emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'fireMaster', text: 'Un vaquero con un cañon en el brazo? No me mires asi. No quiero pelear... pero no voy a dejar que me lastimes.' },
  ],
  4: [
    { speaker: 'scammer', text: 'GAMBLER! Mi cliente favorito! Bienvenido a mi humilde callejon! Justo a tiempo para la oferta del dia!', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'gambler', text: 'Scammer. El mismo callejon de siempre. Esta vez no te compro nada.' },
    { speaker: 'gambler', text: '...Espera. Vos y yo ya pasamos por esto. Este callejon, esta pelea... Por que estamos aca OTRA VEZ?', emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'scammer', text: 'Ah, eso. Echale la culpa a Chrono. En teoria ni siquiera deberiamos acordarnos el uno del otro.' },
    { speaker: 'gambler', text: 'Chrono? El reloj que vuela?' },
    { speaker: 'scammer', text: 'El mismo. Toco algo del tiempo que no tenia que tocar y ahora todo se repite. Pero bueno, un cliente es un cliente!' },
    { speaker: 'scammer', text: 'Quien hablo de comprar, kid? Hoy cobro EN PIÑAS!' },
  ],
  5: [
    { speaker: 'scammer', text: 'Llegaste hasta el borde de la ciudad, eh. Te dije que no te metieras.' },
    { speaker: 'fireMaster', text: 'No me meti. Mis pies me trajeron. Te dije que no puedo parar.' },
    { speaker: 'scammer', text: 'Lo se. ...Por eso estoy aca.' },
    { speaker: 'scammer', text: 'No tenia pensado usar mi arma secreta antes de tiempo. Era para... otra ocasion. Otro cliente.' },
    { speaker: 'scammer', text: '...', crash: true },
    { speaker: 'fireMaster', text: 'Que fue eso? Sono como un vidrio rompiendose... muy lejos.', emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'scammer', text: 'Gambler llego al area del bufon. ...Justo a tiempo. Ahora ya no hay nadie mirando.' },
    { speaker: 'scammer', text: 'Lo siento, kid. De verdad. No es nada personal. Es... la historia.' },
    { speaker: 'scammer', text: 'ES HORA DE SER UN [[BIG SHOT]]!!!', neoSuit: true },
    { speaker: 'neoScammer', text: 'NO PUEDO DEJAR QUE LLEGUES A EL. ASI QUE VOY A TENER QUE [[ELIMINARTE]], KID.', emote: { who: 'scammer', symbol: '#!' } },
    { speaker: 'fireMaster', text: '(...Una voz. No es la mia. "Una llama chiquita. Q y R al mismo tiempo.")', miniLearn: true },
    { speaker: 'fireMaster', text: '(La tumba de fuego... pero pequeña. Una que puedo controlar.)' },
    { speaker: 'fireMaster', text: 'No quiero pelear con vos. ...Pero tampoco quiero desaparecer.' },
  ],
  2: [
    { speaker: 'fireMaster', text: 'Otro de esos monstruos cosidos. Cuantos hay en esta ciudad?' },
    { speaker: 'fireMaster', text: '(Si cierro los ojos todavia veo la torre de fuego. Asi que no los cierro.)' },
    { speaker: 'fireMaster', text: '...Vengan. Terminemos rapido.' },
  ],
  3: [
    { speaker: 'fireMaster', text: 'Todos repiten el mismo nombre: Gambler. Un apostador. Paso por aca antes que yo.' },
    { speaker: 'fireMaster', text: '(Tal vez el sepa como volver a la montaña... o tal vez yo no quiero volver.)' },
    { speaker: 'fireMaster', text: 'Mas monstruos. Siempre mas monstruos.' },
  ],
};

function startRouteB3Intro() {
  const lines = routeB3IntroLines[selectedNormalArcadeLevel];
  if (!lines) return;
  const first = selectedNormalArcadeLevel === 1;
  let gamblerActor = null;
  if (first) {
    gamblerActor = new Fighter({ x: 520, y: 0, color: '#4a148c', attacksToTheRight: true });
    gamblerActor.setCharacterType('gambler');
  }
  ch6CutsceneBase('originsIntro', lines, 'dialog', {
    gamblerX: first ? -400 : 230,
    gamblerTargetX: first ? -400 : 230,
    scammerX: first ? 720 : 680,
    scammerTargetX: first ? 720 : 680,
    scammerY: 0,
    routeB3: true,
    hideEnemy: false,
    puffs: [],
    lastFlagLine: -1,
    gamblerActor,
    actorX: 470,
    laterFade: 0,
    hit: 0,
  });
  startCutsceneLine(0);
}

function updateRouteB3Intro(cutscene) {
  const line = cutscene.lines[cutscene.lineIndex];
  const firstFrame = cutscene.lastFlagLine !== cutscene.lineIndex;
  cutscene.lastFlagLine = cutscene.lineIndex;
  cutscene.hideEnemy = Boolean(line.hybridDown || line.noEnemy);
  cutscene.lyingEnemy = Boolean(line.hybridDown);
  if (cutscene.ritual) updateRouteB4Ritual(cutscene, line, firstFrame);
  if (cutscene.finale) updateRouteB5Scene(cutscene, line, firstFrame);
  if (line.gamblerFight) {
    // Gambler finishing off a hybrid: quick lunges, the hybrid reeling
    cutscene.actorX = 560 + Math.max(0, Math.sin(cutscene.frame / 7)) * 40;
    if (cutscene.frame % 28 === 14) {
      cutscene.hit = 8;
      playSound('robotHit');
    }
  }
  if (line.hybridDown && firstFrame && cutscene.lines[cutscene.lineIndex - 1] && cutscene.lines[cutscene.lineIndex - 1].gamblerFight) {
    playNoise({ duration: 0.3, volume: 0.07, filterFrequency: 900 });
  }
  if (line.gamblerLeave) cutscene.actorX += 3.4;
  if (cutscene.hit > 0) cutscene.hit -= 1;
  if (line.later) cutscene.laterFade = Math.min(1, cutscene.laterFade + 0.05);
  else cutscene.laterFade = Math.max(0, cutscene.laterFade - 0.04);
  if (line.later) cutscene.gamblerActor = null;
  if (line.fmIn) cutscene.fmShown = true;
  if (cutscene.chronoFloat) cutscene.scammerY = 60 + Math.sin(cutscene.frame / 12) * 6;
  if (line.fmIn && firstFrame) {
    // he stumbles in from the left
    cutscene.gamblerX = -80;
    cutscene.gamblerTargetX = 260;
  }
  if (line.hybridUp && firstFrame) {
    playSound('cutsceneSurprise');
  }
  if (line.crash && firstFrame) {
    // far away, something breaks like glass: Gambler has reached the jester's area
    cutscene.riftGlow = 0.01;
    [0, 120, 260, 420].forEach((delay, index) => setTimeout(() => playNoise({ duration: 0.25 + index * 0.1, volume: 0.05 - index * 0.008, filterFrequency: 5200 - index * 900 }), delay));
    playTone({ frequency: 70, duration: 2, type: 'sawtooth', volume: 0.04, slideTo: 40 });
  }
  if (cutscene.riftGlow > 0) cutscene.riftGlow = Math.min(1, cutscene.riftGlow + 0.02);
  if (line.neoSuit && firstFrame) {
    transformRouteBNeo();
    cutscene.flash = 1;
    playSound('judgeOverdrive');
    playSound('cutsceneLaugh');
  }
  if (line.miniLearn && firstFrame) {
    playTone({ frequency: 330, duration: 1.2, type: 'sine', volume: 0.05, slideTo: 660 });
    cutscene.miniGlow = 1;
  }
  if (cutscene.flash > 0) cutscene.flash = Math.max(0, cutscene.flash - 0.04);
  if (cutscene.miniGlow > 0) cutscene.miniGlow = Math.max(0, cutscene.miniGlow - 0.008);
}

function drawRouteB3IntroFx(cutscene) {
  const time = performance.now() / 1000;
  drawRouteB3Cold(getRouteB3Cold());
  if (cutscene.ritual) drawRouteB4RitualBack(cutscene);
  // the hybrid on the floor
  if (cutscene.hideEnemy && cutscene.lyingEnemy !== false) {
    ctx.save();
    const lyingX = cutscene.scammerX;
    ctx.translate(lyingX + player2.height, ground);
    ctx.rotate(-Math.PI / 2);
    player2.position = { x: 0, y: 0 };
    player2.attacksToTheRight = false;
    player2.isAttacking = false;
    ctx.globalAlpha = 0.9;
    player2.draw();
    ctx.restore();
    player2.position = { x: cutscene.scammerX, y: ground - player2.height };
  } else if (cutscene.hit > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.hit / 10})`;
    ctx.fillRect(player2.position.x - 6, player2.position.y - 6, player2.width + 12, player2.height + 12);
  }
  // Gambler
  const actor = cutscene.gamblerActor;
  if (actor && cutscene.actorX < canvas.width + 80) {
    actor.position = { x: cutscene.actorX, y: ground - actor.height - (cutscene.lines[cutscene.lineIndex].gamblerLeave ? Math.abs(Math.sin(time * 9)) * 4 : 0) };
    actor.attacksToTheRight = !cutscene.actorFacesLeft;
    actor.isAttacking = false;
    actor.draw();
  }
  if (cutscene.ritual) drawRouteB4RitualFront(cutscene);
  if (cutscene.finale) drawRouteB5SceneFx(cutscene);
  // a chill on Fire Master once he is here
  if (cutscene.gamblerX > -60) {
    for (let flake = 0; flake < 3; flake += 1) {
      const rise = (time * 30 + flake * 20) % 60;
      ctx.fillStyle = `rgba(179, 229, 252, ${0.7 - rise / 90})`;
      ctx.fillRect(cutscene.gamblerX + 10 + flake * 18, ground - player1.height + 60 - rise, 3, 3);
    }
  }
  if (cutscene.miniGlow > 0) {
    // the little black flame he can feel in his hand
    drawFlametombFlame(cutscene.gamblerX + player1.width + 14, ground - 60, 16, time * 12, 'outer');
    drawFlametombFlame(cutscene.gamblerX + player1.width + 14, ground - 56, 7, time * 14, 'core');
  }
  if (cutscene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.laterFade > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.88 * cutscene.laterFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- in the fights: he keeps thinking about the mountain ----------
function updateRouteB3Thoughts() {
  if (!(normalArcadeActive && arcadeChapter === 'gamblerB' && gameStarted) || gameOver || arcadeCutscene.active) return;
  // level 4: at 70 health Scammer stops the fight
  if (selectedNormalArcadeLevel === 4 && routeB3Stage === 'gambler') {
    if (isScammer(player2) && player2.health <= routeB3ScammerStop && !dodgeRound.active) startRouteB3Meet();
    return;
  }
  if (!player1.frostFire) return;
  if (routeBEnding.stage || flametomb.active) return;
  if (selectedNormalArcadeLevel === 5) {
    // (if the intro was skipped, the armor goes on anyway)
    if (isScammer(player2) && !player2.scammerBurnt && !routeBEnding.stage) transformRouteBNeo();
    if (isNeoScammer(player2) && !player2.neoFinalUsed && player2.health <= neoScammerFinalHealth && !scamFinal.active) {
      player2.neoFinalUsed = true;
      player2.neoCharge = 0;
      robotShots = [];
      startMidFightCh7Cutscene('routeB5Final', routeB5FinalLines);
      return;
    }
  }
  flametomb.routeB3Thought = (flametomb.routeB3Thought || 360) - 1;
  if (flametomb.routeB3Thought <= 0) {
    flametomb.routeB3Thought = 900 + Math.floor(Math.random() * 500);
    showFlametombThought(player1, routeB3Thoughts[Math.floor(Math.random() * routeB3Thoughts.length)]);
  }
}

const gamblerArcadeBChapterButton = document.getElementById('gamblerArcadeBChapterButton');
if (gamblerArcadeBChapterButton) gamblerArcadeBChapterButton.addEventListener('click', () => openArcadeChapter('gamblerB', true));

// ---------- the cold: Ciudad Cobalto freezes a little more with every level ----------
let routeB3DroneTimer = 0;

function getRouteB3Cold() {
  // 4B: dark and tense as soon as Fire Master is there (before that, a normal factory)
  if (arcadeChapter === 'reflecterB') {
    if (arcadeCutscene.active && arcadeCutscene.routeB3 && selectedNormalArcadeLevel === 1 && !arcadeCutscene.fmShown) return 0;
    if (selectedNormalArcadeLevel === 5) return 0.85;
    if (selectedNormalArcadeLevel === 6) return 0.5;
    return 0.6 + (selectedNormalArcadeLevel - 1) * 0.2;
  }
  // level 5: darker and tenser as the fight against NEO goes on
  if (selectedNormalArcadeLevel === 5 && arcadeChapter === 'gamblerB') {
    if (routeBEnding.stage) return 1.5;
    if (isNeoScammer(player2) && player2.maxHealth > 0) return 0.45 + (1 - Math.max(0, player2.health) / player2.maxHealth) * 0.95;
    return 0.45;
  }
  const base = Math.min(1, 0.2 + (selectedNormalArcadeLevel - 1) * 0.25);
  if (selectedNormalArcadeLevel === 4 && routeB3Stage === 'gambler') return 0.25;
  return base;
}

function drawRouteB3Cold(strength) {
  if (strength <= 0) return;
  const time = performance.now() / 1000;
  ctx.save();
  // the city goes dark, level after level
  ctx.fillStyle = `rgba(4, 4, 14, ${Math.min(0.75, 0.12 + strength * 0.42)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // a slow, heavy pulse of darkness
  const beat = Math.pow(Math.max(0, Math.sin(time * 1.9)), 10);
  ctx.fillStyle = `rgba(0, 0, 0, ${beat * 0.12 * strength})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // only a little cold: a faint blue in the shadows
  ctx.fillStyle = `rgba(90, 140, 220, ${0.05 + strength * 0.05})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the edges closing in
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.55, 200 - strength * 60, canvas.width / 2, canvas.height * 0.55, 620);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(0, 0, 6, ${0.35 + strength * 0.5})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // a few small frost marks in the corners
  ctx.strokeStyle = `rgba(200, 225, 255, ${0.15 + strength * 0.2})`;
  ctx.lineWidth = 1;
  [[0, 0, 1, 1], [canvas.width, 0, -1, 1], [0, canvas.height, 1, -1], [canvas.width, canvas.height, -1, -1]].forEach(([cornerX, cornerY, dirX, dirY]) => {
    for (let branch = 0; branch < 4; branch += 1) {
      const angle = (branch / 4) * (Math.PI / 2) + 0.2;
      const length = (24 + branch * 9) * (0.6 + strength);
      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(cornerX + Math.cos(angle) * length * dirX, cornerY + Math.sin(angle) * length * dirY);
      ctx.stroke();
    }
  });
  // a little snow, barely
  const flakes = Math.round(8 + strength * 18);
  ctx.fillStyle = 'rgba(220, 230, 255, 0.55)';
  for (let flake = 0; flake < flakes; flake += 1) {
    const fall = (time * 28 + flake * 53) % (canvas.height + 20);
    const flakeX = ((flake * 131 + Math.sin(time * 0.6 + flake) * 18) % canvas.width + canvas.width) % canvas.width;
    ctx.fillRect(flakeX, fall - 10, 2, 2);
  }
  // past the middle of the last fight: a red heartbeat, darker edges, the world closing in
  if (strength > 1) {
    const extra = Math.min(1, strength - 1);
    const pulse = Math.pow(Math.max(0, Math.sin(time * (2 + extra * 2))), 12);
    ctx.fillStyle = `rgba(110, 0, 12, ${(0.08 + pulse * 0.18) * extra})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const closing = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.55, 140, canvas.width / 2, canvas.height * 0.55, 520);
    closing.addColorStop(0, 'rgba(0, 0, 0, 0)');
    closing.addColorStop(1, `rgba(0, 0, 0, ${0.5 * extra})`);
    ctx.fillStyle = closing;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.04 * extra})`;
    for (let scratch = 0; scratch < 10; scratch += 1) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 6 + Math.random() * 26);
  }
  // the neon fails now and then
  if (strength >= 0.4 && Math.sin(time * 11) > 0.2 && Math.sin(time * 0.9 + 1) > 0.9) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
  // the tension: a low drone and a slow heartbeat in the deeper levels
  if (strength >= 0.45 && !gameOver) {
    routeB3DroneTimer -= 1;
    if (routeB3DroneTimer <= 0) {
      // (the heartbeat speeds up with the tension)
      const level = Math.min(1.5, strength);
      routeB3DroneTimer = Math.round(300 - (level - 0.45) * 140);
      playTone({ frequency: 48, duration: 3.4, type: 'sawtooth', volume: 0.028 * level, slideTo: 44 });
      setTimeout(() => playTone({ frequency: 54, duration: 0.15, type: 'sine', volume: 0.06 * level }), 1300);
      setTimeout(() => playTone({ frequency: 50, duration: 0.18, type: 'sine', volume: 0.05 * level }), 1550);
    }
  }
}

// ---------- level 4: Scammer feels him coming ----------
const routeB3ScammerStop = 70;
const routeB3MeetLines = [
  { speaker: 'scammer', text: '...Espera. ESPERA. Alto, kid.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'gambler', text: 'Que pasa? Ya te rendis? No es tu estilo.' },
  { speaker: 'scammer', text: 'No... Hay algo. Una presencia rara. Fria. Muy, muy fria.', chill: true },
  { speaker: 'scammer', text: '(No puede ser... YA llego a Ciudad Cobalto? Tan rapido? Se suponia que iba a tardar mucho mas...)', chill: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'scammer', text: 'Gambler. Andate. AHORA. Segui con lo tuyo, busca al que arma los monstruos. De esto me encargo yo.' },
  { speaker: 'gambler', text: '...Que te pasa, Scammer? Nunca te vi asi.', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'scammer', text: 'NO PREGUNTES Y CORRE, KID! Este consejo te lo regalo!' },
  { speaker: 'gambler', text: '...Esta bien. Pero despues me lo explicas.', gamblerLeave: true },
  { speaker: 'scammer', text: '(No puedo dejar que el se meta en la mision de Gambler. Todavia no. Si se cruzan ahora...)', chill: true },
  { speaker: 'fireMaster', text: '...', fmIn: true },
  { speaker: 'scammer', text: '...' },
  { speaker: 'fireMaster', text: '...Vos.' },
  { speaker: 'scammer', text: 'H-hola. ...Lindo dia, no? Un poco frio. Bastante frio. MUY frio. Je.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'fireMaster', text: '...' },
  { speaker: 'scammer', text: '...Le interesa un mapa turistico? Es gratis. Bueno, no. Si. Es gratis.' },
  { speaker: 'fireMaster', text: 'Quien sos?' },
  { speaker: 'scammer', text: 'Nadie. Un vendedor. Un vendedor que justo se estaba yendo.' },
  { speaker: 'fireMaster', text: '...Ayudame.' },
  { speaker: 'scammer', text: '...Eh?' },
  { speaker: 'fireMaster', text: 'No puedo parar. Camino y camino y no se a donde. Aunque no quiera. Algo me empuja hacia adelante.' },
  { speaker: 'fireMaster', text: 'Siento frio en las manos. Pienso cosas que no son mias. Escucho fuego donde no hay fuego.' },
  { speaker: 'fireMaster', text: '...Vos sabes que me pasa. Lo veo en tu cara.' },
  { speaker: 'scammer', text: '...' },
  { speaker: 'scammer', text: 'Yo... no. No se nada. Pero... va a estar todo bien. Te lo garantizo. Garantia de... de Scammer.' },
  { speaker: 'fireMaster', text: '...No sonaste muy seguro.' },
  { speaker: 'scammer', text: '...No.' },
  { speaker: 'scammer', text: 'Escuchame: si ves a un tipo de sombrero con un dado en el pecho... no te metas con el. Por favor. Dejalo seguir su camino.' },
  { speaker: 'fireMaster', text: 'Por que?' },
  { speaker: 'scammer', text: '...Porque alguien tiene que llegar al final. Y no podes ser vos.' },
  { speaker: 'scammer', text: '...Bueno! Me voy! Negocio urgente! ...Chau.', scammerFlee: true },
  { speaker: 'fireMaster', text: 'Espera...' },
  { speaker: 'fireMaster', text: '(Se fue. Como todos.)' },
  { speaker: 'fireMaster', text: '(...Igual tengo que seguir. Mis pies ya se estan moviendo solos.)', fmFollow: true, leave: true },
];
if (!ch7MidFightScenes.includes('routeB3Meet')) ch7MidFightScenes.push('routeB3Meet');
if (!ch7MidFightScenes.includes('routeB5Final')) ch7MidFightScenes.push('routeB5Final');

function routeB3DamageFloor(target) {
  // (nothing can finish Fire Master during the ending scene)
  if (routeBEnding.stage && target === player1) target.health = Math.max(target.health, 1);
  if (normalArcadeActive && arcadeChapter === 'gamblerB' && selectedNormalArcadeLevel === 5 && isNeoScammer(target) && !target.neoFinalUsed) {
    target.health = Math.max(target.health, neoScammerFinalHealth);
  }
  if (normalArcadeActive && arcadeChapter === 'gamblerB' && selectedNormalArcadeLevel === 4 && routeB3Stage === 'gambler' && isScammer(target)) {
    target.health = Math.max(target.health, routeB3ScammerStop);
  }
}

function startRouteB3Meet() {
  routeB3Stage = 'meet';
  scamOffers = [];
  scamItems = [];
  scamSlotMachines = [];
  const frost = new Fighter({ x: -120, y: 0, color: '#ff9800', attacksToTheRight: true });
  frost.setCharacterType('fireMaster');
  frost.frostFire = true;
  startMidFightCh7Cutscene('routeB3Meet', routeB3MeetLines, 'dialog', {
    gamblerX: 260,
    gamblerTargetX: 260,
    scammerX: 620,
    scammerTargetX: 620,
    frostActor: frost,
    frostX: -140,
    lastFlagLine: -1,
    chill: 0.25,
  });
}

function updateRouteB3Meet(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (!line) return;
  const firstFrame = cutscene.lastFlagLine !== cutscene.lineIndex;
  cutscene.lastFlagLine = cutscene.lineIndex;
  if (line.chill) cutscene.chill = Math.min(1, cutscene.chill + 0.006);
  if (line.chill && firstFrame) playTone({ frequency: 1400, duration: 1.4, type: 'sine', volume: 0.02, slideTo: 1200 });
  if (line.gamblerLeave) {
    cutscene.gamblerTargetX = -260;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, -260, 3.4);
  }
  const passed = (flag) => {
    const index = cutscene.lines.findIndex((entry) => entry[flag]);
    return index >= 0 && index <= cutscene.lineIndex;
  };
  if (passed('gamblerLeave')) {
    cutscene.gamblerX = moveToward(cutscene.gamblerX, -260, 3.4);
    cutscene.gamblerTargetX = cutscene.gamblerX;
  }
  if (passed('fmIn')) {
    cutscene.chill = Math.min(1, cutscene.chill + 0.01);
    cutscene.frostX = moveToward(cutscene.frostX, line.fmFollow ? canvas.width + 160 : 280, line.fmFollow ? 3 : 1.6);
    if (firstFrame && line.fmIn) playTone({ frequency: 55, duration: 2.6, type: 'sawtooth', volume: 0.04, slideTo: 45 });
  }
  if (line.leave) cutscene.fade = Math.min(1, (cutscene.fade || 0) + 0.012);
  if (passed('scammerFlee')) {
    cutscene.scammerTargetX = canvas.width + 260;
    cutscene.scammerX = moveToward(cutscene.scammerX, canvas.width + 260, 6);
  }
}

function drawRouteB3MeetFx(cutscene) {
  drawRouteB3Cold(cutscene.chill);
  const frost = cutscene.frostActor;
  if (!frost || cutscene.frostX < -100 || cutscene.frostX > canvas.width + 100) {
    drawRouteB3MeetFade(cutscene);
    return;
  }
  const time = performance.now() / 1000;
  frost.position = { x: cutscene.frostX, y: ground - frost.height - (cutscene.lines[cutscene.lineIndex] && cutscene.lines[cutscene.lineIndex].fmFollow ? Math.abs(Math.sin(time * 8)) * 4 : 0) };
  frost.attacksToTheRight = cutscene.scammerX > cutscene.frostX;
  frost.isAttacking = false;
  frost.draw();
  // a cold mist around him
  ctx.fillStyle = 'rgba(225, 245, 254, 0.18)';
  ctx.beginPath();
  ctx.ellipse(cutscene.frostX + frost.width / 2, ground - 6, 70, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  drawRouteB3MeetFade(cutscene);
}

function drawRouteB3MeetFade(cutscene) {
  if (!(cutscene.fade > 0)) return;
  ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.fade})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// after the talk: Gambler and Scammer are gone; Fire Master follows... into a pack of hybrids
function finishRouteB3Meet() {
  routeB3Stage = 'fire';
  // out of the alley, back into the city
  selectedMap = 'gamblerArcade';
  makeFrostFireMaster(player1);
  player1.position = { x: 160, y: ground - player1.height };
  player1.attacksToTheRight = true;
  const levelData = routeB3Levels[4];
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  player2.reset({ x: 820, y: 0 });
  configureRouteB3Enemy();
  player2.position = { x: 820, y: ground - player2.height };
  scamOffers = [];
  scamItems = [];
  scamSlotMachines = [];
  botAttackCooldown = 0;
  resetBotBrain();
  showFlametombThought(player1, '(Mas monstruos... Scammer... a donde fuiste?)');
  updateHealthBars();
  updateCombatHudIdentity();
}

// ================= CHAPTER 3B, LEVEL 5: the edge of the city =================
const routeBNeoHealth = 400;

function transformRouteBNeo() {
  player2.setCharacterType('gambler', 'neoScammer');
  botDifficulty = 'hard';
  configureNeoScammer();
  player2.setMaxHealth(routeBNeoHealth);
  player2.health = player2.maxHealth;
  player2.neoFinalUsed = false;
  updateHealthBars();
  updateCombatHudIdentity();
}

// the edge of Ciudad Cobalto: a broken elevated highway over the void, the city far behind, the jester's crack ahead
function drawCobaltEdgeStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  // sky: night over the city, nothing over the void
  const sky = ctx.createLinearGradient(0, 0, width, 0);
  sky.addColorStop(0, '#0b1a3d');
  sky.addColorStop(0.55, '#120a2a');
  sky.addColorStop(1, '#050208');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = 'rgba(179, 229, 252, 0.6)';
  for (let star = 0; star < 30; star += 1) ctx.fillRect((star * 97) % 560, (star * 53) % 260, 2, 2);
  // Ciudad Cobalto, far behind on the left: small, blue, still blinking
  for (let building = 0; building < 9; building += 1) {
    const bx = building * 62 - 10;
    const top = 250 - ((building * 41) % 90);
    ctx.fillStyle = building % 2 ? '#0d2b5e' : '#123a7a';
    ctx.fillRect(bx, top, 54, ground - 60 - top);
    for (let windowY = top + 10; windowY < ground - 80; windowY += 22) {
      if ((windowY + building * 7) % 3 === 0) continue;
      ctx.fillStyle = (windowY + building) % 5 === 0 ? 'rgba(255, 23, 68, 0.6)' : 'rgba(79, 195, 247, 0.55)';
      ctx.fillRect(bx + 10 + ((windowY / 22) % 2) * 20, windowY, 9, 9);
    }
  }
  ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
  ctx.fillRect(196, 168, 74, 26);
  ctx.fillStyle = '#e0f7fa';
  ctx.font = '900 18px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('7 7 7', 233, 188);
  ctx.textAlign = 'left';
  // the void ahead: cards and dice drifting away from the city
  [[650, 140, 0.3], [760, 220, 0.6], [880, 120, 0.9], [960, 260, 1.2], [700, 300, 1.6]].forEach(([floatX, floatY, seed], index) => {
    ctx.save();
    ctx.translate(floatX + Math.sin(time * 0.3 + seed) * 12, floatY + Math.cos(time * 0.4 + seed) * 10);
    ctx.rotate(time * (index % 2 ? 0.2 : -0.15) + seed);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = index % 2 ? '#e3f2fd' : '#3d2b4f';
    ctx.fillRect(-12, index % 2 ? -12 : -18, 24, index % 2 ? 24 : 36);
    ctx.restore();
  });
  // the jester's crack, far away
  ctx.save();
  const crackGlow = ctx.createRadialGradient(900, 180, 4, 900, 180, 160);
  crackGlow.addColorStop(0, `rgba(234, 128, 252, ${0.35 + Math.sin(time * 3) * 0.1})`);
  crackGlow.addColorStop(1, 'rgba(234, 128, 252, 0)');
  ctx.fillStyle = crackGlow;
  ctx.fillRect(740, 20, 320, 320);
  ctx.strokeStyle = '#f3c4ff';
  ctx.shadowColor = '#ea80fc';
  ctx.shadowBlur = 18;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(905, 50);
  ctx.lineTo(886, 110);
  ctx.lineTo(918, 160);
  ctx.lineTo(892, 230);
  ctx.lineTo(922, 300);
  ctx.moveTo(918, 160);
  ctx.lineTo(950, 190);
  ctx.stroke();
  ctx.restore();
  // fog rolling over the void
  for (let band = 0; band < 4; band += 1) {
    ctx.fillStyle = 'rgba(60, 40, 90, 0.12)';
    ctx.beginPath();
    ctx.ellipse(((time * (10 + band * 6) + band * 300) % (width + 400)) - 200, ground - 30 - band * 18, 280, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the highway: the deck, its edge, the void under it
  ctx.fillStyle = '#020105';
  ctx.fillRect(0, ground + 24, width, canvas.height - ground - 24);
  [120, 420, 720].forEach((pillarX) => {
    const pillar = ctx.createLinearGradient(0, ground, 0, canvas.height);
    pillar.addColorStop(0, '#263247');
    pillar.addColorStop(1, 'rgba(38, 50, 71, 0)');
    ctx.fillStyle = pillar;
    ctx.fillRect(pillarX, ground + 24, 40, canvas.height - ground);
  });
  ctx.fillStyle = '#1c2333';
  ctx.fillRect(0, ground, width, 24);
  ctx.fillStyle = '#2d3a52';
  ctx.fillRect(0, ground, width, 5);
  ctx.fillStyle = 'rgba(253, 216, 53, 0.7)';
  for (let dash = 20; dash < width - 120; dash += 80) ctx.fillRect(dash, ground + 11, 40, 3);
  // a crack across the deck, and the end of the road
  ctx.strokeStyle = '#05030a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(610, ground);
  ctx.lineTo(630, ground + 10);
  ctx.lineTo(618, ground + 24);
  ctx.stroke();
  ctx.fillStyle = '#05030a';
  ctx.beginPath();
  ctx.moveTo(width - 70, ground);
  ctx.lineTo(width - 52, ground + 8);
  ctx.lineTo(width - 66, ground + 24);
  ctx.lineTo(width, ground + 24);
  ctx.lineTo(width, ground);
  ctx.closePath();
  ctx.fill();
  // the guardrail (bent and broken near the end)
  ctx.fillStyle = '#5c6b80';
  ctx.fillRect(0, ground - 30, 680, 5);
  ctx.save();
  ctx.translate(680, ground - 30);
  ctx.rotate(0.4);
  ctx.fillRect(0, 0, 70, 5);
  ctx.restore();
  for (let post = 10; post < 700; post += 70) ctx.fillRect(post, ground - 30, 5, 30);
  // flickering streetlights
  [60, 360, 660].forEach((lampX, index) => {
    ctx.fillStyle = '#37474f';
    ctx.fillRect(lampX, ground - 190, 6, 190);
    ctx.fillRect(lampX, ground - 190, 34, 5);
    const on = index === 2 ? Math.sin(time * 13) > 0.4 && Math.sin(time * 2) > -0.3 : true;
    if (on) {
      const light = ctx.createRadialGradient(lampX + 32, ground - 182, 2, lampX + 32, ground - 182, 120);
      light.addColorStop(0, 'rgba(129, 212, 250, 0.35)');
      light.addColorStop(1, 'rgba(129, 212, 250, 0)');
      ctx.fillStyle = light;
      ctx.fillRect(lampX - 90, ground - 300, 240, 300);
      ctx.fillStyle = '#e1f5fe';
      ctx.fillRect(lampX + 26, ground - 186, 12, 4);
    }
  });
  // the exit sign, hanging by one corner
  ctx.save();
  ctx.translate(470, ground - 236);
  ctx.rotate(0.18 + Math.sin(time * 1.2) * 0.03);
  ctx.fillStyle = '#1b5e20';
  ctx.fillRect(0, 0, 170, 52);
  ctx.strokeStyle = '#e8f5e9';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 162, 44);
  ctx.fillStyle = '#e8f5e9';
  ctx.font = '900 13px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CIUDAD COBALTO', 85, 23);
  ctx.fillText('<- VOLVER', 85, 41);
  ctx.textAlign = 'left';
  ctx.restore();
  ctx.fillStyle = '#37474f';
  ctx.fillRect(468, ground - 250, 4, 20);
}

// ---------- the mini Flametomb (Q + R): a single small black flame, 125 damage, heals him a little ----------
const miniFlametombDamage = 125;
const miniFlametombCooldown = 420;
const miniFlametombHeal = 15;
const miniFlametombs = [];

function handleMiniFlametomb(caster, target) {
  if (!caster.miniFlametomb || !caster.frostFire) return false;
  if (caster.routeBPanic || routeBEnding.stage) return true;
  if (caster.miniFlametombCooldown > 0 || flametomb.active || gameOver || arcadeCutscene.active || !canFighterAct(caster) || caster.gamblerStunTimer > 0) return true;
  miniFlametombs.push({ x: getFighterCenterX(target), t: 0, caster, target, hit: false });
  caster.miniFlametombCooldown = getDebugCooldown(miniFlametombCooldown, caster);
  caster.health = Math.min(caster.maxHealth, caster.health + miniFlametombHeal);
  updateHealthBars();
  recordSpecialUsed(caster);
  playNoise({ duration: 0.6, volume: 0.07, filterFrequency: 900 });
  playTone({ frequency: 90, duration: 0.8, type: 'sawtooth', volume: 0.05, slideTo: 160 });
  showScamLabel(caster, `+${miniFlametombHeal}`);
  return true;
}

function updateMiniFlametombs() {
  [player1, player2].forEach((fighter) => {
    if (fighter.miniFlametombCooldown > 0) fighter.miniFlametombCooldown -= 1;
    if (fighter.obsidianTombCooldown > 0) fighter.obsidianTombCooldown -= 1;
  });
  updateObsidianTomb();
  miniFlametombs.forEach((tomb) => {
    tomb.t += 1;
    tomb.x += (getFighterCenterX(tomb.target) - tomb.x) * 0.05;
    if (tomb.t === 26 && !tomb.hit) {
      tomb.hit = true;
      if (isRouteB4Chrono(tomb.target) && Math.random() < 0.6) {
        routeB4ChronoDodge(tomb.target, true);
      } else if (Math.abs(getFighterCenterX(tomb.target) - tomb.x) < tomb.target.width / 2 + 50) {
        applyDamage(tomb.caster, tomb.target, isRouteB5Boss(tomb.target) || isRouteB6Boss(tomb.target) ? 55 : miniFlametombDamage, { isSpecial: true });
        tomb.target.velocity.y = -8;
        updateHealthBars();
        playSound('robotHit');
      }
    }
  });
  for (let index = miniFlametombs.length - 1; index >= 0; index -= 1) {
    if (miniFlametombs[index].t > 70 || gameOver) miniFlametombs.splice(index, 1);
  }
}

function drawMiniFlametombs() {
  const time = performance.now() / 1000;
  drawObsidianTomb();
  miniFlametombs.forEach((tomb) => {
    const rise = Math.min(1, tomb.t / 18, (70 - tomb.t) / 20);
    if (rise <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(tomb.x, ground, 4, tomb.x, ground, 70);
    glow.addColorStop(0, 'rgba(255, 152, 0, 0.7)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(tomb.x - 70, ground - 30, 140, 60);
    for (let flame = 0; flame < 7; flame += 1) {
      const along = flame / 7;
      drawFlametombFlame(tomb.x + Math.sin(time * 8 + flame) * 8, ground - along * 150 * rise, (1 - along) * 30 + 10, time * 12 + flame, 'outer');
    }
    ctx.globalCompositeOperation = 'source-over';
    for (let flame = 0; flame < 7; flame += 2) {
      const along = flame / 7;
      drawFlametombFlame(tomb.x, ground - along * 150 * rise + 4, ((1 - along) * 30 + 10) * 0.45, time * 14 + flame, 'core');
    }
    ctx.restore();
  });
  // the cooldown, over his head
  if (player1.miniFlametomb && player1.frostFire && !gameOver && !arcadeCutscene.active && !routeBEnding.stage && !flametomb.active) {
    const ready = !(player1.miniFlametombCooldown > 0);
    ctx.font = '900 11px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = ready ? '#ff6d00' : 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(ready ? 'Q+R: MINI FLAMETOMB' : `MINI FLAMETOMB ${Math.ceil(player1.miniFlametombCooldown / 60)}s`, getFighterCenterX(player1), player1.position.y - 24);
    ctx.textAlign = 'left';
  }
}

// ---------- NEO's last offer, route B: longer, and with a SHOOTING MODE ----------
const routeB5FinalLines = [
  { speaker: 'neoScammer', text: 'NO... NO PUEDO DEJAR QUE SIGAS, KID! NO ESTA VEZ!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'neoScammer', text: 'GAMBLER TIENE QUE LLEGAR AL FINAL! Y VOS... VOS SOS UN [[ERROR]] EN LA HISTORIA!' },
  { speaker: 'fireMaster', text: '...Un error.' },
  { speaker: 'neoScammer', text: 'MI ULTIMA OFERTA, KID! [[LIQUIDACION]] DE FUEGO Y HIELO!!!' },
];
const routeBExtraPhases = [
  { frames: 1000, pattern: 'rbRain', title: 'TORMENTA [[ROJA]]', subtitle: 'Todo cae de arriba: dispara (Q) y rompe lo ROJO' },
  { frames: 1100, pattern: 'rbWalls', title: 'PAREDES DE [[DEUDA]]', subtitle: 'Abri un hueco a los tiros antes de que te aplasten' },
  { frames: 1100, pattern: 'rbMix', title: 'FUEGO CONTRA [[BIG SHOT]]', subtitle: 'Rojo por todos lados: apunta con W A S D y dispara' },
];
// which attacks bring red (breakable) shots, where they come from, and where the shooting mode aims
// (dir 'free': you aim with W A S D)
const routeBRedPhases = {
  eggs: { dir: 'up', from: 'top', rate: 30 },
  phones: { dir: 'right', from: 'right', rate: 28 },
  diamonds: { dir: 'left', from: 'left', rate: 30 },
  mix: { dir: 'free', from: 'both', rate: 22 },
  rbRain: { dir: 'up' },
  rbWalls: { dir: 'right' },
  rbMix: { dir: 'free' },
};

function getRouteBRedPhase() {
  const final = scamFinal;
  const phase = scamFinalPhases[final.phaseIndex];
  return final.stage === 'phase' && phase ? routeBRedPhases[phase.pattern] || null : null;
}
let routeBSavedPhases = null;

function castRouteBScamFinal() {
  restoreRouteBScamPhases();
  routeBSavedPhases = scamFinalPhases.slice();
  const finaleIndex = scamFinalPhases.findIndex((phase) => phase.pattern === 'finale');
  scamFinalPhases.splice(finaleIndex, 0, ...routeBExtraPhases);
  castScamFinalAct(player2, player1);
  Object.assign(scamFinal, { routeB: true, rbItems: [], rbShots: [], aim: { x: 1, y: 0 }, shotGap: 0 });
}

function restoreRouteBScamPhases() {
  if (!routeBSavedPhases) return;
  scamFinalPhases.splice(0, scamFinalPhases.length, ...routeBSavedPhases);
  routeBSavedPhases = null;
}

function fireRouteBShot() {
  const final = scamFinal;
  if (final.stage !== 'phase' || final.shotGap > 0 || !getRouteBRedPhase()) return;
  const soul = getScamFinalSoulCenter();
  final.rbShots.push({ x: soul.x, y: soul.y, vx: final.aim.x * 11, vy: final.aim.y * 11, life: 60 });
  final.shotGap = 7;
  playTone({ frequency: 880, duration: 0.06, type: 'square', volume: 0.03, slideTo: 1200 });
}

// red extras on top of NEO's normal attacks
function spawnRouteBRedExtras(phase, t) {
  const red = routeBRedPhases[phase.pattern];
  if (!red || !red.from || t % red.rate !== 0) return;
  const final = scamFinal;
  const box = final.boxTarget;
  const from = red.from === 'both' ? (Math.floor(t / red.rate) % 2 ? 'top' : 'right') : red.from;
  if (from === 'top') final.rbItems.push({ kind: 'orb', x: box.x + 20 + Math.random() * (box.width - 40), y: box.y - 10, vx: 0, vy: 3 + Math.random(), r: 11, red: true });
  if (from === 'right') final.rbItems.push({ kind: 'orb', x: box.x + box.width + 10, y: box.y + 20 + Math.random() * (box.height - 40), vx: -3.4 - Math.random(), vy: 0, r: 11, red: true });
  if (from === 'left') final.rbItems.push({ kind: 'orb', x: box.x - 10, y: box.y + 20 + Math.random() * (box.height - 40), vx: 3.4 + Math.random(), vy: 0, r: 11, red: true });
}

function spawnRouteBPattern(phase, t) {
  const final = scamFinal;
  const box = final.boxTarget;
  const soul = getScamFinalSoulCenter();
  const orb = (x, y, vx, vy, red = true, r = 11) => final.rbItems.push({ kind: 'orb', x, y, vx, vy, r, red });
  if (phase.pattern === 'rbRain' || phase.pattern === 'rbMix') {
    if (t % (phase.pattern === 'rbMix' ? 16 : 11) === 0) orb(box.x + 20 + Math.random() * (box.width - 40), box.y - 10, 0, 3.2 + Math.random() * 1.6, Math.random() < 0.8);
    // red columns falling straight onto you
    if (phase.pattern === 'rbRain' && t % 120 === 60) for (let drop = 0; drop < 4; drop += 1) orb(soul.x, box.y - 10 - drop * 26, 0, 3.6, true, 10);
  }
  if (phase.pattern === 'rbWalls' || (phase.pattern === 'rbMix' && t % 260 === 130)) {
    if (phase.pattern === 'rbMix' || t % 130 === 0) {
      // a wall of red blocks closing in from the right (some of them white: those don't break)
      const rows = Math.floor((box.height - 8) / 30);
      const whiteRow = Math.floor(Math.random() * rows);
      for (let row = 0; row < rows; row += 1) final.rbItems.push({ kind: 'block', x: box.x + box.width + 16, y: box.y + 6 + row * 30 + 13, vx: -2, vy: 0, r: 13, red: row !== whiteRow && row !== (whiteRow + 3) % rows });
    }
    if (phase.pattern === 'rbWalls' && t % 130 === 65) {
      const startY = box.y + 20 + Math.random() * (box.height - 40);
      orb(box.x + box.width + 10, startY, -4.5, 0, true, 10);
    }
  }
  if (phase.pattern === 'rbMix' && t % 70 === 35) {
    const startX = box.x + box.width - 10;
    const startY = box.y + 20 + Math.random() * (box.height - 40);
    const angle = Math.atan2(soul.y - startY, soul.x - startX);
    [-0.25, 0, 0.25].forEach((spread) => orb(startX, startY, Math.cos(angle + spread) * 4, Math.sin(angle + spread) * 4, true, 9));
  }
}

function updateRouteBShooter() {
  const final = scamFinal;
  const red = getRouteBRedPhase();
  final.shootOn = Boolean(red);
  if (red && red.dir === 'up') final.aim = { x: 0, y: -1 };
  else if (red && red.dir === 'right') final.aim = { x: 1, y: 0 };
  else if (red && red.dir === 'left') final.aim = { x: -1, y: 0 };
  else if (keys.w) final.aim = { x: 0, y: -1 };
  else if (keys.s) final.aim = { x: 0, y: 1 };
  else if (keys.a) final.aim = { x: -1, y: 0 };
  else if (keys.d) final.aim = { x: 1, y: 0 };
  if (final.shotGap > 0) final.shotGap -= 1;
  const box = final.box;
  const soul = getScamFinalSoulCenter();
  const soulRadius = Math.min(final.soul.width, final.soul.height) / 2;
  final.rbShots.forEach((shot) => {
    shot.x += shot.vx;
    shot.y += shot.vy;
    shot.life -= 1;
    final.rbItems.forEach((item) => {
      if (item.dead || !item.red || shot.life <= 0) return;
      if (Math.hypot(item.x - shot.x, item.y - shot.y) < item.r + 5) {
        item.dead = true;
        shot.life = 0;
        addScamFinalSparks(item.x, item.y, '#ff6d00');
        // breaking red heals a little
        const healed = final.target;
        healed.health = Math.min(healed.maxHealth, healed.health + routeBRedHeal);
        addScamFinalSparks(getScamFinalSoulCenter().x, getScamFinalSoulCenter().y, '#69f0ae');
        updateHealthBars();
        playTone({ frequency: 220, duration: 0.08, type: 'triangle', volume: 0.04 });
      }
    });
  });
  final.rbShots = final.rbShots.filter((shot) => shot.life > 0 && shot.x > box.x - 20 && shot.x < box.x + box.width + 20 && shot.y > box.y - 20 && shot.y < box.y + box.height + 20);
  final.rbItems.forEach((item) => {
    item.x += item.vx;
    item.y += item.vy;
    if (!item.dead && Math.hypot(item.x - soul.x, item.y - soul.y) < item.r + soulRadius * 0.8) {
      item.dead = true;
      hurtScamFinalTarget();
    }
  });
  final.rbItems = final.rbItems.filter((item) => !item.dead && item.x > box.x - 40 && item.y < box.y + box.height + 30 && item.y > box.y - 40);
  if (final.stage !== 'phase') final.rbItems = [];
}

function drawRouteBShooter() {
  const final = scamFinal;
  final.rbItems.forEach((item) => {
    ctx.fillStyle = item.red ? '#ff1744' : '#eceff1';
    ctx.shadowColor = item.red ? '#ff1744' : '#ffffff';
    ctx.shadowBlur = 10;
    if (item.kind === 'block') {
      ctx.fillRect(item.x - item.r, item.y - item.r, item.r * 2, item.r * 2);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#7f0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(item.x - item.r, item.y - item.r, item.r * 2, item.r * 2);
    } else {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  });
  if (final.finale && final.finale.rbT >= routeBClashStart) {
    // the clash: NEO's pink BIG SHOT against Fire Master's fire
    const soul = getScamFinalSoulCenter();
    const clash = getRouteBClashPoint(final);
    const box = final.box;
    const wobble = Math.sin(performance.now() / 30) * 3;
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff4081';
    ctx.fillStyle = 'rgba(255, 64, 129, 0.9)';
    ctx.fillRect(clash.x, clash.y - 22 - wobble, box.x + box.width - clash.x, 44 + wobble * 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(clash.x, clash.y - 7, box.x + box.width - clash.x, 14);
    ctx.shadowColor = '#ff6d00';
    ctx.fillStyle = 'rgba(255, 109, 0, 0.9)';
    ctx.fillRect(soul.x + 20, clash.y - 20 + wobble, clash.x - soul.x - 20, 40 - wobble * 2);
    ctx.fillStyle = '#fff176';
    ctx.fillRect(soul.x + 20, clash.y - 6, clash.x - soul.x - 20, 12);
    const burst = ctx.createRadialGradient(clash.x, clash.y, 2, clash.x, clash.y, 60);
    burst.addColorStop(0, 'rgba(255, 255, 255, 1)');
    burst.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = burst;
    ctx.fillRect(clash.x - 60, clash.y - 60, 120, 120);
    ctx.restore();
  }
  if (final.finale && final.finale.rbT) {
    // Fire Master charging a big shot of fire to resist
    const soul = getScamFinalSoulCenter();
    const radius = Math.min(46, 6 + final.finale.rbT / 6);
    const glow = ctx.createRadialGradient(soul.x + 20, soul.y, 2, soul.x + 20, soul.y, radius * 2);
    glow.addColorStop(0, 'rgba(255, 241, 118, 1)');
    glow.addColorStop(0.4, 'rgba(255, 109, 0, 0.9)');
    glow.addColorStop(1, 'rgba(213, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(soul.x + 20, soul.y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  final.rbShots.forEach((shot) => {
    ctx.fillStyle = '#ff9100';
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(shot.x, shot.y, shot.vx ? 8 : 4, shot.vy ? 8 : 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  // where he is aiming (only while the shooting mode is on)
  if (final.stage === 'phase' && final.shootOn) {
    const soul = getScamFinalSoulCenter();
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(soul.x + final.aim.x * 20, soul.y + final.aim.y * 20);
    ctx.lineTo(soul.x + final.aim.x * 32, soul.y + final.aim.y * 32);
    ctx.stroke();
    // the hint, under the box
    const box = final.box;
    const arrows = { '0,-1': 'ARRIBA', '1,0': 'DERECHA', '-1,0': 'IZQUIERDA', '0,1': 'ABAJO' };
    const red = getRouteBRedPhase();
    const label = red && red.dir === 'free' ? 'apunta con W A S D' : `apunta ${arrows[`${final.aim.x},${final.aim.y}`]}`;
    ctx.font = '900 13px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff5252';
    ctx.fillText(`MODO DISPARO: Q (${label})`, box.x + box.width / 2, box.y + box.height - 8);
    ctx.textAlign = 'left';
  }
}

// ================= THE END OF 3B: the flash, the ambush, and the Flametomb =================
const routeBRedHeal = 3;
const routeBPromptFrames = 450;
const routeBEnding = { pending: false, stage: null, t: 0 };
const routeBEndingTalk = [
  [0, 210, '...Perdoname, kid. De verdad. No queria que terminara asi.'],
  [210, 440, 'Pero tengo que hacerlo. Gambler tiene que llegar al final... y vos no podes estar en esta historia.'],
  [440, 560, 'Adios, Fire Master.'],
];
const routeBPromptTexts = ['USA FLAMETOMB AHORA', 'QUE ESPERAS?', 'PRESIONA R', 'AHORA!', 'USALO', 'FLAMETOMB'];

// the last attack of the box: NEO charges his ultimate shot, Fire Master charges fire against it... and then, white
function updateRouteBFinale(final) {
  const finale = final.finale;
  const caster = final.caster;
  finale.step = 'charge';
  finale.stepT = (finale.stepT || 0) + 1;
  finale.rbT = finale.stepT;
  const t = finale.stepT;
  caster.neoCharge = 30;
  final.items = [];
  final.rbItems = [];
  if (t === 1) {
    setScamFinalCaption('KID... ESTO SE TERMINA ACA!!!', '#ff4081', 90);
    playSound('judgeSecretCharge');
  }
  if (t === 100) setScamFinalCaption('FIRE MASTER: ...NO. TODAVIA NO!', '#ff9100', 110);
  if (t === routeBClashStart) {
    setScamFinalCaption('[[BIG SHOT]] VS FUEGO!!!', '#fdd835', 100);
    playSound('titanLaser');
    playSound('judgeBeamFire');
  }
  if (t === 330) setScamFinalCaption('NEO: RENDITE, KID!!!', '#ff4081', 100);
  if (t === 440) setScamFinalCaption('FIRE MASTER: ...NO PUEDO... PERDER...', '#ff9100', 110);
  if (t === 560) setScamFinalCaption('!!!!!!', '#ffffff', 60);
  if (t < routeBClashStart && t % 24 === 0) playTone({ frequency: 200 + t * 2, duration: 0.15, type: 'sawtooth', volume: 0.04 });
  if (t >= routeBClashStart && t % 10 === 0) playScamFinalSound('robotBoom', 10);
  if (t % 30 === 0) playSound('jesterHeartbeat');
  final.shake = Math.max(final.shake, t < routeBClashStart ? t / 30 : 6 + (t - routeBClashStart) / 40);
  if (t >= routeBClashStart && t % 6 === 0) {
    const clash = getRouteBClashPoint(final);
    addScamFinalSparks(clash.x, clash.y, Math.random() < 0.5 ? '#ff9100' : '#ff4081');
  }
  if (t === routeBClashEnd) {
    final.flash = 1;
    finale.done = true;
    playSound('jesterFinalWhite');
  }
}

const routeBClashStart = 200;
const routeBClashEnd = 620;

// where the two shots meet: it goes back and forth, and in the end NEO pushes
function getRouteBClashPoint(final) {
  const soul = getScamFinalSoulCenter();
  const box = final.box;
  const t = (final.finale && final.finale.rbT) || 0;
  const middle = (soul.x + box.x + box.width) / 2;
  const push = t > 500 ? (t - 500) * 1.4 : 0;
  return { x: Math.max(soul.x + 40, middle + Math.sin(t / 30) * 60 - push), y: soul.y };
}

function startRouteBEnding() {
  Object.assign(routeBEnding, { pending: false, stage: 'ambush', t: 0, promptT: 0, runDir: 0 });
  // after the flash NEO comes out of the light... and hits him before he can react
  player2.neoExhausted = true;
  player2.neoCharge = 0;
  player2.position.x = 760;
  player2.attacksToTheRight = false;
  player1.position.x = 220;
  robotShots = [];
  updateHealthBars();
}

function triggerRouteBTomb() {
  routeBEnding.stage = 'tomb';
  routeBEnding.t = 0;
  player2.neoCharge = 0;
  player1.flametombTilt = 0;
  startFlametomb(player1, player2);
  flametomb.big = true;
  flametomb.routeBEnd = true;
}

function routeBEndTombHit(neo) {
  rememberFlametombVictim('neoScammer');
  // the armor can't hold: back to his own size, burnt, on the floor
  const centerX = getFighterCenterX(neo);
  neo.setCharacterType('gambler', 'scammer');
  neo.scammerBurnt = true;
  neo.scammerLying = true;
  neo.dusted = true;
  neo.position.x = Math.max(80, Math.min(canvas.width - 220, centerX - neo.height / 2));
  neo.health = 1;
  neo.position.y = ground - neo.height;
  updateHealthBars();
  updateCombatHudIdentity();
  routeBEnding.stage = 'after';
  routeBEnding.t = 0;
  // (in small letters, this time)
  fireStronger.caption = 1;
  playFlametombStingSound();
  playSound('robotBoom');
  playSound('judgeSlam');
}

function updateRouteBEnding() {
  const ending = routeBEnding;
  if (ending.pending && !scamFinal.active) startRouteBEnding();
  if (!ending.stage) return;
  if (gameOver || !(normalArcadeActive && arcadeChapter === 'gamblerB')) {
    ending.stage = null;
    return;
  }
  ending.t += 1;
  const neo = player2;
  const fireMaster = player1;
  neo.gamblerStunTimer = Math.max(neo.gamblerStunTimer, 5);
  if (ending.stage === 'ambush') {
    fireMaster.scriptedFlight = true;
    fireMaster.velocity.x = 0;
    fireMaster.velocity.y = 0;
    fireMaster.gamblerStunTimer = Math.max(fireMaster.gamblerStunTimer, 5);
    neo.attacksToTheRight = false;
    if (ending.t < 34) {
      // NEO rushes in
      neo.position.x = moveToward(neo.position.x, fireMaster.position.x + fireMaster.width + 10, 18);
      neo.isAttacking = ending.t > 24;
      fireMaster.position.y = ground - fireMaster.height;
    }
    if (ending.t === 34) {
      // the hit
      player1.health = 1;
      updateHealthBars();
      playSound('robotBoom');
      playSound('robotHit');
      playSound('judgeSlam');
      playNoise({ duration: 0.5, volume: 0.1, filterFrequency: 800 });
      ending.impact = 30;
    }
    if (ending.t > 34) {
      neo.isAttacking = false;
      const fall = Math.min(1, (ending.t - 34) / 22);
      fireMaster.flametombTilt = -Math.PI / 2 * fall;
      fireMaster.position.x = Math.max(60, fireMaster.position.x - (1 - fall) * 8);
      fireMaster.position.y = ground - fireMaster.height + (fireMaster.height - fireMaster.width) / 2 * fall;
    }
    if (ending.impact > 0) ending.impact -= 1;
    if (ending.t >= 110) {
      ending.stage = 'down';
      ending.t = 0;
    }
  }
  if (ending.stage === 'down' || ending.stage === 'prompt') {
    // Fire Master on the floor, badly hurt
    fireMaster.scriptedFlight = true;
    fireMaster.velocity.x = 0;
    fireMaster.velocity.y = 0;
    fireMaster.flametombTilt = -Math.PI / 2;
    fireMaster.position.y = ground - fireMaster.height + (fireMaster.height - fireMaster.width) / 2;
    fireMaster.gamblerStunTimer = Math.max(fireMaster.gamblerStunTimer, 5);
    neo.velocity.x = 0;
    neo.position.x = moveToward(neo.position.x, 560, 1.5);
    neo.attacksToTheRight = false;
  }
  if (ending.stage === 'down' && ending.t >= 560) {
    ending.stage = 'prompt';
    ending.t = 0;
    showFlametombThought(fireMaster, '(...No... no otra vez... no quiero...)');
    playSound('judgeSecretCharge');
  }
  if (ending.stage === 'prompt') {
    neo.neoCharge = 30;
    if (ending.t % 30 === 0) playSound('jesterHeartbeat');
    // if you don't, the spell decides for you
    if (ending.t >= routeBPromptFrames) {
      showFlametombThought(fireMaster, '(...Ya no soy yo el que decide.)');
      triggerRouteBTomb();
    }
  }
  if (ending.stage === 'tomb') {
    // NEO tries to get away from the tower... and it follows him
    if (ending.t === 90) showFlametombThought(neo, 'Que... que es eso?!');
    if (ending.t === 230) showFlametombThought(neo, 'NO! NO NO NO! ALEJATE DE MI!');
    if (ending.t === 400) showFlametombThought(neo, 'KID! PARALO! POR FAVOR, PARALO!');
    if (ending.t > flametombSilenceEnd + 30 && !flametomb.hitDone) {
      const away = getFighterCenterX(neo) < flametomb.towerX ? -1 : 1;
      ending.runDir = ending.runDir || away;
      if (neo.position.x <= 10) ending.runDir = 1;
      if (neo.position.x >= canvas.width - neo.width - 10) ending.runDir = -1;
      neo.position.x = Math.max(0, Math.min(canvas.width - neo.width, neo.position.x + ending.runDir * (4 + Math.random() * 2)));
      neo.position.y = ground - neo.height - Math.abs(Math.sin(ending.t * 0.5)) * 10;
      neo.attacksToTheRight = ending.runDir > 0;
    }
  }
  if (ending.stage === 'after') {
    neo.velocity.x = 0;
    neo.gamblerStunTimer = Math.max(neo.gamblerStunTimer, 5);
    // Fire Master can move... but nothing else
    if (ending.t === 560) {
      fireMaster.routeBPanic = true;
      fireMaster.scriptedFlight = false;
      fireMaster.gamblerStunTimer = 0;
      fireMaster.flametombDizzy = 0;
    }
    if (fireMaster.routeBPanic) {
      fireMaster.flametombTilt = Math.sin(performance.now() / 30) * 0.05;
      const panic = routeBPanicThoughts.find(([at]) => at === ending.t - 560);
      if (panic) showFlametombThought(fireMaster, panic[1]);
    }
    if (ending.t >= 560 + routeBPanicFrames) {
      ending.stage = null;
      fireMaster.routeBPanic = false;
      neo.health = 0;
      updateHealthBars();
    }
  }
}

// ten seconds of panic (then he decides where to go)
const routeBPanicFrames = 600;
const routeBPanicThoughts = [
  [0, '(Que hice? QUE HICE?)'],
  [100, '(No puedo controlar el fuego... no puedo controlar NADA.)'],
  [200, '(Por que sigo caminando? A donde voy? QUE ME ESTA PASANDO?)'],
  [300, '(Mis manos... frias y quemando al mismo tiempo...)'],
  [400, '(Alguien tiene que saber que es esto... alguien que sepa de magia...)'],
  [500, '(...Sorcerer. Tengo que buscar a Sorcerer.)'],
];
const routeBScammerLines = [
  [10, 120, '...'],
  [120, 260, 'Ugh... haah... sigo... vivo...?'],
  [260, 420, 'Por poco, kid... Si no fuera por la armadura... no la contaba.'],
  [420, 560, '...Esto no es... un buen negocio...'],
];

function drawRouteBEnding() {
  const ending = routeBEnding;
  if (!ending.stage) return;
  const time = performance.now() / 1000;
  const fireMaster = player1;
  if (ending.stage === 'down' || ending.stage === 'prompt') {
    // the "tomato sauce" under him
    drawKetchupMess(getFighterCenterX(fireMaster) - fireMaster.height / 2, fireMaster.height, fireMaster.width, false, 3);
    fireMaster.flametombTilt = -Math.PI / 2;
    drawFlametombCaster(fireMaster);
    if (ending.t < 30 && ending.stage === 'down') {
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - ending.t / 30})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (ending.stage === 'ambush') {
    if (ending.t > 34) {
      drawKetchupMess(getFighterCenterX(fireMaster) - fireMaster.height / 2, fireMaster.height, fireMaster.width, false, 3);
      drawFlametombCaster(fireMaster);
    }
    if (ending.t < 20) {
      // the white of the flash fading
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - ending.t / 20})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (ending.impact > 0) {
      ctx.fillStyle = `rgba(255, 23, 68, ${ending.impact / 60})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const hitX = getFighterCenterX(fireMaster) + 20;
      const hitY = ground - 80;
      ctx.strokeStyle = `rgba(255, 255, 255, ${ending.impact / 30})`;
      ctx.lineWidth = 3;
      for (let ray = 0; ray < 12; ray += 1) {
        const angle = (ray / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(hitX + Math.cos(angle) * 20, hitY + Math.sin(angle) * 20);
        ctx.lineTo(hitX + Math.cos(angle) * (60 + (30 - ending.impact) * 4), hitY + Math.sin(angle) * (60 + (30 - ending.impact) * 4));
        ctx.stroke();
      }
    }
  }
  if (ending.stage === 'down') {
    const line = routeBEndingTalk.find(([from, to]) => ending.t >= from && ending.t < to);
    if (line) drawRouteBTalkBox('SCAMMER', line[2]);
  }
  if (ending.stage === 'after') {
    const line = routeBScammerLines.find(([from, to]) => ending.t >= from && ending.t < to);
    if (line) drawRouteBTalkBox('SCAMMER', line[2]);
    if (player1.routeBPanic && Math.floor(time * 2) % 2 === 0 && routeBEnding.hintFrame !== routeBEnding.t) {
      routeBEnding.hintFrame = routeBEnding.t;
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillText('A / D para moverte', canvas.width / 2, ground + 40);
      ctx.textAlign = 'left';
    }
  }
  if (ending.stage === 'prompt') {
    // red words all over the screen
    const shown = Math.min(routeBPromptTexts.length, 1 + Math.floor(ending.t / 50));
    ctx.save();
    ctx.textAlign = 'center';
    for (let word = 0; word < shown; word += 1) {
      const wordX = 180 + ((word * 211) % 680);
      const wordY = 130 + ((word * 97) % 260);
      const flicker = Math.sin(time * 12 + word * 2) > -0.3;
      if (!flicker) continue;
      ctx.font = `900 ${20 + (word % 3) * 8}px Courier New, monospace`;
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#ff1744';
      ctx.strokeText(routeBPromptTexts[word], wordX + (Math.random() - 0.5) * 4, wordY + (Math.random() - 0.5) * 4);
      ctx.fillText(routeBPromptTexts[word], wordX + (Math.random() - 0.5) * 4, wordY + (Math.random() - 0.5) * 4);
    }
    // the time running out
    const left = Math.max(0, 1 - ending.t / routeBPromptFrames);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(canvas.width / 2 - 160, 60, 320, 12);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(canvas.width / 2 - 160, 60, 320 * left, 12);
    ctx.restore();
    ctx.fillStyle = `rgba(120, 0, 10, ${0.12 + Math.sin(time * 6) * 0.05})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawRouteBTalkBox(name, text) {
  ctx.save();
  ctx.fillStyle = 'rgba(8, 6, 12, 0.94)';
  ctx.fillRect(112, 70, 800, 86);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 3;
  ctx.strokeRect(112, 70, 800, 86);
  ctx.fillStyle = '#fdd835';
  ctx.fillRect(130, 58, 190, 26);
  ctx.fillStyle = '#111';
  ctx.font = '900 15px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, 225, 76);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.font = '700 18px Arial, sans-serif';
  const words = text.split(' ');
  let row = '';
  let rowY = 112;
  words.forEach((word) => {
    const test = row ? `${row} ${word}` : word;
    if (ctx.measureText(test).width > 760) {
      ctx.fillText(row, 132, rowY);
      row = word;
      rowY += 26;
    } else {
      row = test;
    }
  });
  ctx.fillText(row, 132, rowY);
  ctx.restore();
}

// Scammer after the tomb: his own size again, burnt, with what is left of the armor
function drawBurntScammer(fighter) {
  if (!fighter.scammerBurnt) return;
  const time = performance.now() / 1000;
  const w = fighter.width;
  const h = fighter.height;
  ctx.save();
  // lying on the floor, head to the left
  const baseX = fighter.position.x;
  ctx.translate(baseX, ground);
  ctx.rotate(-Math.PI / 2);
  // (drawn in its own space: x along the body, y across)
  fighter.dusted = false;
  const savedPosition = { ...fighter.position };
  const savedFacing = fighter.attacksToTheRight;
  fighter.position = { x: 0, y: -h };
  fighter.attacksToTheRight = true;
  fighter.isAttacking = false;
  fighter.draw();
  const x = 0;
  const y = -h;
  // no smile anymore: soot over the mouth and a flat, tired line
  ctx.fillStyle = 'rgba(25, 12, 6, 0.85)';
  ctx.fillRect(x + w / 2 - 14, y + 36, 28, 12);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 9, y + 44);
  ctx.lineTo(x + w / 2 + 9, y + 42);
  ctx.stroke();
  // a lens of the glasses cracked
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 + 4, y + 25);
  ctx.lineTo(x + w / 2 + 12, y + 33);
  ctx.moveTo(x + w / 2 + 12, y + 25);
  ctx.lineTo(x + w / 2 + 7, y + 30);
  ctx.stroke();
  // burns all over
  ctx.fillStyle = 'rgba(25, 12, 5, 0.8)';
  [[0.2, 0.3, 11], [0.75, 0.55, 14], [0.4, 0.8, 12], [0.85, 0.15, 8], [0.1, 0.65, 10], [0.55, 0.4, 9], [0.3, 0.95, 10], [0.7, 0.85, 11]].forEach(([u, v, radius]) => {
    ctx.beginPath();
    ctx.arc(x + w * u, y + h * v, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = `rgba(255, 109, 0, ${0.5 + Math.sin(time * 6) * 0.2})`;
  [[0.75, 0.55], [0.2, 0.3], [0.4, 0.8], [0.55, 0.4]].forEach(([u, v]) => ctx.fillRect(x + w * u - 2, y + h * v - 2, 4, 4));
  // what is left of the NEO armor
  ctx.fillStyle = '#6a0f35';
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 50);
  ctx.lineTo(x + 14, y + 44);
  ctx.lineTo(x + 10, y + 64);
  ctx.lineTo(x - 4, y + 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a6d1a';
  ctx.beginPath();
  ctx.moveTo(x + w, y + 40);
  ctx.lineTo(x + w + 22, y + 30);
  ctx.lineTo(x + w + 12, y + 48);
  ctx.closePath();
  ctx.fill();
  fighter.position = savedPosition;
  fighter.attacksToTheRight = savedFacing;
  fighter.dusted = true;
  ctx.restore();
  // pieces of the armor on the floor, and smoke
  ctx.fillStyle = '#4a0b26';
  [[baseX - 40, 0.4], [baseX + h + 30, -0.7], [baseX + h + 70, 0.2]].forEach(([pieceX, angle]) => {
    ctx.save();
    ctx.translate(pieceX, ground - 6);
    ctx.rotate(angle);
    ctx.fillRect(-10, -6, 20, 12);
    ctx.restore();
  });
  for (let puff = 0; puff < 7; puff += 1) {
    const rise = (time * 30 + puff * 20) % 100;
    ctx.fillStyle = `rgba(70, 70, 70, ${0.55 - rise / 180})`;
    ctx.beginPath();
    ctx.arc(baseX + h * (0.1 + puff * 0.13) + Math.sin(time + puff) * 6, ground - w - rise, 6 + rise / 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// everything route B leaves behind, cleared when a fight starts or when going back to the menu
// (so nothing of 2B / 3B leaks into other chapters or versus)
function cleanupRouteBState() {
  restoreRouteBScamPhases();
  if (typeof scamFinal !== 'undefined' && !scamFinal.active) scamFinal.routeB = false;
  Object.assign(routeBEnding, { pending: false, stage: null, t: 0 });
  miniFlametombs.length = 0;
  flametomb.big = false;
  flametomb.routeBEnd = false;
  flametomb.routeThought = 0;
  flametomb.routeB3Thought = 0;
  [player1, player2].forEach((fighter) => {
    fighter.routeBPanic = false;
    fighter.scammerBurnt = false;
    fighter.scammerLying = false;
    fighter.dusted = false;
    fighter.flametombTilt = 0;
    fighter.scriptedFlight = false;
    if (!(normalArcadeActive && (arcadeChapter === 'gamblerB' || arcadeChapter === 'reflecterB')) && fighter.secretVariant !== 'frostFire' && fighter.secretVariant !== 'obsidian') {
      fighter.miniFlametomb = false;
      fighter.miniFlametombCooldown = 0;
    }
  });
}

// ================= CHAPTER 6 (under construction): Chrono =================
// the card shows what will be needed to play it
function syncChronoChapterCard() {
  const card = document.getElementById('chronoArcadeChapterButton');
  if (!card) return;
  const requirements = {
    machine: Boolean(scammerShop.owned && scammerShop.owned.rareMachine),
    secret: typeof isKnightSecretLevelBeaten === 'function' && isKnightSecretLevelBeaten(),
    flametomb: isFlametombUnlocked(),
    use: typeof isRareMachineUsed === 'function' && isRareMachineUsed(),
  };
  Object.entries(requirements).forEach(([key, done]) => {
    const line = card.querySelector(`[data-chrono-req="${key}"]`);
    if (line) line.classList.toggle('done', done);
  });
}

const chronoArcadeChapterButton = document.getElementById('chronoArcadeChapterButton');
if (chronoArcadeChapterButton) {
  chronoArcadeChapterButton.addEventListener('click', () => {
    showCustomToast('CAPITULO 6: EN CONSTRUCCION', 'La hora oscura de Chrono todavia no esta lista. Cumpli los requisitos para estar preparado cuando salga.');
    playSound('menuMove');
  });
}

// ================= code FIREMASTERB / WEIRDFIRE: the Fire Master of route B, playable =================
let frostFireCodeActive = false;
characterDisplayNames.fireMasterB = 'Fire Master B';
const frostFireThoughts = [
  '(Otra pelea. Otro lugar. Sigo sin poder parar.)',
  '(Frio en las manos. Fuego en el pecho.)',
  '(No uses el fuego negro. No lo uses.)',
  '(...Hermano, si estas ahi adentro, perdoname.)',
];

// his own lines in the special fights: Scammer / NEO, Knight's castle, Shang Ting's temple
scamHeroIntroLines.fireMasterB = [
  { speaker: 'scammer', text: 'F-FIRE MASTER? ...Ese simbolo... mitad hielo. No. No, no, no. VOS no deberias estar aca, kid.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'fireMasterB', text: 'Vos sos el vendedor de los lentes. El del borde de la ciudad. ...Te acordas de mi?' },
  { speaker: 'scammer', text: 'Yo? Nunca te vi en mi vida! Primera vez! Cliente nuevo! ...(por favor que no se acuerde de la armadura)', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'fireMasterB', text: 'Mis pies me trajeron hasta tu tienda. No se por que. Solo se que no puedo parar.' },
  { speaker: 'scammer', text: '...Bueno. Si vas a pelear, peleemos. Pero NADA de fuego negro en mi sala, eh. Esta alfombra es importada.' },
  scamClosingLine,
];
scamHeroNeoReactions.fireMasterB = '...Esa armadura. La conozco. Ya la vi romperse una vez.';
knightIntroHeroLines.fireMasterB = [
  { speaker: 'fireMasterB', text: 'Un castillo... Hace un momento estaba en una ciudad azul. Antes, en una montaña. Ya no se donde voy a abrir los ojos.' },
  knightHalt,
  { speaker: 'fireMasterB', text: 'Un caballero. ...Por favor, no te acerques mucho. A veces el fuego sale solo.' },
  { speaker: 'knight', text: 'Tu llama es extraña, viajero. Mitad fuego, mitad escarcha. Que te ha ocurrido?', emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'fireMasterB', text: 'Rompi una promesa. Dos veces.' },
  { speaker: 'knight', text: '...Entonces pelea por algo mejor esta vez. Que el acero te devuelva el honor.' },
  knightEnGuard,
];
shaolinIntroLines.fireMasterB = [
  { speaker: 'shang', text: '...你的气... 一半是火，一半是冰。(...Tu chi... mitad fuego, mitad hielo.)' },
  { speaker: 'hero', text: 'Usted lo ve? ...Usted sabe lo que me pasa?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'shang', text: '你的心里有一个不属于你的灵魂。(Dentro tuyo hay un alma que no es tuya.)' },
  { speaker: 'hero', text: '...Mi hermano. Lo llevo conmigo. No se como soltarlo... ni si quiero.' },
  { speaker: 'shang', text: '痛苦也是老师。(El dolor tambien es un maestro.) 战斗吧，让我看看你还剩下什么。(Pelea. Mostrame lo que te queda.)' },
  { speaker: 'hero', text: '...Esta bien. Pero no me haga usar el fuego negro.' },
  { speaker: 'shang', text: '来吧！(Ven!)', emote: { who: 'scammer', symbol: '!' } },
];

// his button in character select, right after Fire Master
const frostFireButton = document.createElement('button');
frostFireButton.type = 'button';
frostFireButton.className = 'character-option fire-master-option frost-fire-option hidden';
frostFireButton.innerHTML = '<span>Fire Master B</span><span class="character-preview frost-fire-preview" aria-hidden="true"></span>';
frostFireButton.addEventListener('click', () => selectCharacter('fireMaster', 'frostFire'));
if (fireMasterCharacterButton) fireMasterCharacterButton.insertAdjacentElement('afterend', frostFireButton);

// his card shows the real drawing
let frostFirePreview = null;
function renderFrostFirePreview() {
  if (frostFirePreview) return frostFirePreview;
  try {
    const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const actor = new Fighter({ x: 0, y: 0, color: '#ff9800', attacksToTheRight: true });
    actor.setCharacterType('fireMaster', 'frostFire');
    actor.frostFire = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    actor.position = { x: 400, y: 300 - actor.height };
    actor.isAttacking = false;
    actor.draw();
    const thumb = document.createElement('canvas');
    thumb.width = 140;
    thumb.height = 168;
    const box = { x: 360, y: 300 - actor.height - 30, width: actor.width + 80, height: actor.height + 40 };
    const scale = Math.min(thumb.width / box.width, thumb.height / box.height);
    thumb.getContext('2d').drawImage(canvas, box.x, box.y, box.width, box.height, (thumb.width - box.width * scale) / 2, thumb.height - box.height * scale, box.width * scale, box.height * scale);
    ctx.putImageData(saved, 0, 0);
    frostFirePreview = thumb.toDataURL();
  } catch (error) {
    frostFirePreview = '';
  }
  return frostFirePreview;
}

function applyFrostFirePreview(element) {
  const image = renderFrostFirePreview();
  if (!image || !element) return;
  element.style.backgroundImage = `url(${image})`;
  element.style.backgroundSize = 'contain';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundPosition = 'center bottom';
}

function unlockFrostFireCode() {
  frostFireCodeActive = true;
  frostFireButton.classList.remove('hidden');
  applyFrostFirePreview(frostFireButton.querySelector('.frost-fire-preview'));
  showCustomToast('...FIRE MASTER B', 'El de la ruta B. Mitad fuego, mitad hielo. 125 de vida, mas daño, y Q+R: Mini Flametomb. Tiene sus propios dialogos con Scammer, Knight y Shang Ting.');
  playFlametombRouteSting();
}

function lockFrostFireCode() {
  frostFireCodeActive = false;
  frostFireButton.classList.add('hidden');
}

// the Scammer challenge: one more fighter to pick
function addFrostFireScamPick() {
  if (!frostFireCodeActive) return;
  const pick = document.createElement('button');
  pick.type = 'button';
  pick.className = 'scam-challenge-pick';
  pick.dataset.character = 'fireMasterB';
  const preview = document.createElement('span');
  preview.className = 'character-preview frost-fire-preview';
  applyFrostFirePreview(preview);
  const name = document.createElement('span');
  name.innerText = 'Fire Master B';
  pick.append(preview, name);
  pick.addEventListener('click', () => chooseScamChallengeHero('fireMasterB', false));
  scamChallengeGrid.appendChild(pick);
}

// every fight outside the arcade: his stats and his little black flame
function prepareFrostFireFighter(fighter) {
  if (normalArcadeActive) return;
  const frost = fighter.characterType === 'fireMaster' && fighter.secretVariant === 'frostFire';
  fighter.frostFire = frost;
  if (!frost) return;
  fighter.miniFlametomb = true;
  fighter.miniFlametombCooldown = 0;
  fighter.setMaxHealth(125);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1.2;
  updateHealthBars();
}

// now and then, what he thinks in a fight
function updateFrostFireThoughts() {
  if (normalArcadeActive || !player1.frostFire || !gameStarted || gameOver || arcadeCutscene.active) return;
  flametomb.frostThought = (flametomb.frostThought || 600) - 1;
  if (flametomb.frostThought <= 0) {
    flametomb.frostThought = 1200 + Math.floor(Math.random() * 600);
    showFlametombThought(player1, frostFireThoughts[Math.floor(Math.random() * frostFireThoughts.length)]);
  }
}

// the victory lines of Fire Master B
function getFrostFireVictoryPhrase(opponent) {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  if (!opponent) return '...';
  if (isNeoScammer(opponent) || isScammer(opponent)) return pick(['...Perdon, Scammer. Otra vez.', 'Te dije que no podia parar.', 'Tus lentes... ya no me dan miedo. Me dan pena.']);
  if (isIceMaster(opponent)) return pick(['...Hermano?', 'No. No otra vez. Por favor, levantate.', 'Ya no se si estoy peleando con vos... o conmigo.']);
  if (opponent.characterType === 'fireMaster') return pick(['Asi era yo. Antes de la pagina.', 'Tu fuego todavia es calido. El mio ya no.']);
  if (isKnight(opponent)) return pick(['Tu honor sigue entero, caballero. El mio no.', 'Gracias por no tenerme miedo.']);
  if (opponent.secretVariant === 'shaolinMaster') return pick(['El dolor es un maestro... pero no me enseña a parar.', 'Gracias, maestro. Creo.']);
  if (opponent.characterType === 'sorcerer') return pick(['Sorcerer... por fin. Decime como apagarlo.', 'Vos escribiste esa pagina. Vos sabes.']);
  if (opponent.characterType === 'lightWarrior') return pick(['Tu luz no quema. Como lo haces?', 'Ojala pudiera contener lo mio como vos.']);
  if (opponent.characterType === 'chrono') return pick(['Podes rebobinar esto? Por favor. Hasta antes de la montaña.']);
  if (opponent.characterType === 'gambler') return pick(['Gambler... me dijeron que no me metiera con vos. Perdon.']);
  if (isFriendThing(opponent)) return pick(['Ustedes tambien se rien del fuego?', 'No me miren asi. Ya tengo suficiente adentro.']);
  return pick([
    '...Otra pelea. Otro lugar. Sigo sin poder parar.',
    'No use el fuego negro. Esta vez no.',
    'Frio en las manos. Fuego en el pecho. Y gane igual.',
    'Lo siento. Siempre lo siento.',
  ]);
}

// ================= CHAPTER 4B: a factory that isn't his =================
const routeB4ProgressStorageKey = 'moqueteRouteB4Progress';
const routeB4LevelCount = 6;
const routeB4PlayableLevels = 6;
const routeB4Levels = {
  1: { enemies: ['rustyGuard', 'scrapDrone'], difficulties: ['medium', 'medium'] },
  2: { enemies: ['scrapDrone', 'clockworkReject', 'overloadUnit'], difficulties: ['medium', 'hard', 'hard'] },
  4: { enemies: ['arcaneMinion', 'arcaneMinion', 'arcaneMinion', 'arcaneMinion', 'arcaneMinion', 'arcaneMinion'], difficulties: ['medium', 'medium', 'hard', 'hard', 'hard', 'hard'] },
  5: { enemies: ['arcaneMinion', 'arcaneMinion', 'arcaneMinion', 'sorcerer'], difficulties: ['hard', 'hard', 'hard', 'hard'] },
  6: { enemies: ['sorcerer'], difficulties: ['hard'] },
};
const routeB4 = { escaped: false, dodgeFx: 0, dodgeX: 0, warned: false };
const routeB4Thoughts = [
  '(Aceite, metal y ojos rojos. Ninguno me pregunta quien soy.)',
  '(Mas hielo en las manos que ayer. Cada vez mas.)',
  '(Mi cinto... alguien tacho mi simbolo. Fui yo?)',
  '(Un reloj que vuela... dicen que puede mover el tiempo.)',
  '(Si alguien puede llevarme antes de la montaña...)',
];

function isRouteB4Unlocked() {
  return typeof isArcadeChapterDone === 'function' && isArcadeChapterDone('gamblerB');
}

function syncRouteB4Card() {
  const card = document.getElementById('reflecterArcadeBChapterButton');
  if (!card) return;
  const unlocked = isRouteB4Unlocked();
  card.disabled = !unlocked;
  card.classList.toggle('routeB-locked', !unlocked);
  const title = card.querySelector('[data-routeb4-title]');
  const copy = card.querySelector('[data-routeb4-copy]');
  if (title) title.innerText = unlocked ? 'Una fabrica que no es la suya' : '???';
  if (copy) copy.innerText = unlocked
    ? 'Capitulo 4B. Fire Master despierta entre robots rotos. Alguien que maneja el tiempo podria ayudarlo... si no le tuviera tanto miedo.'
    : 'Termina el capitulo 3B.';
}

// Fire Master, a little further gone: darker orange, more ice, a stranger symbol, his own sign crossed out on the belt
function makeFrostFireMaster4B(fighter) {
  makeFrostFireMaster(fighter);
  fighter.frostFire2 = true;
  fighter.obsidian = false;
  fighter.obsidianControl = true;
  fighter.obsidianBuffed = false;
  fighter.obsidianTombCooldown = 0;
  fighter.miniFlametomb = true;
  fighter.miniFlametombCooldown = 0;
  fighter.color = '#b8450f';
  fighter.setMaxHealth(135);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1.25;
}

function drawFrostFire4BDetails(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const width = fighter.width;
  const height = fighter.height;
  const time = performance.now() / 1000;
  ctx.save();
  // a darker, burnt orange over the body
  ctx.fillStyle = 'rgba(90, 25, 0, 0.32)';
  ctx.fillRect(x, y, width, height);
  // more ice: shards climbing the body
  ctx.fillStyle = 'rgba(179, 229, 252, 0.92)';
  [[0.08, 0.2, 7], [0.3, 0.92, 6], [0.88, 0.62, 7], [0.62, 0.12, 5], [0.12, 0.85, 6], [0.92, 0.9, 5], [0.45, 0.7, 4]].forEach(([u, v, size]) => {
    const iceX = x + width * u;
    const iceY = y + height * v;
    ctx.beginPath();
    ctx.moveTo(iceX, iceY - size * 1.4);
    ctx.lineTo(iceX + size * 0.7, iceY);
    ctx.lineTo(iceX, iceY + size);
    ctx.lineTo(iceX - size * 0.7, iceY);
    ctx.closePath();
    ctx.fill();
  });
  // frost creeping up from the feet
  ctx.fillStyle = 'rgba(225, 245, 254, 0.55)';
  ctx.fillRect(x, y + height - 12, width, 12);
  // the symbol, gone bizarre: split, twisted, with a crack through it
  const flameX = x + width / 2;
  const flameY = y + 42;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(flameX - 15, flameY - 21, 30, 42);
  const jitter = Math.sin(time * 9) * 1.5;
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.moveTo(flameX - 2 + jitter, flameY - 19);
  ctx.lineTo(flameX - 13, flameY + 4);
  ctx.lineTo(flameX - 4, flameY + 2);
  ctx.lineTo(flameX - 8, flameY + 17);
  ctx.lineTo(flameX - 1, flameY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b3e5fc';
  ctx.beginPath();
  ctx.moveTo(flameX + 3 - jitter, flameY - 17);
  ctx.lineTo(flameX + 12, flameY - 2);
  ctx.lineTo(flameX + 6, flameY + 1);
  ctx.lineTo(flameX + 12, flameY + 16);
  ctx.lineTo(flameX + 2, flameY + 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(flameX - 1, flameY - 20);
  ctx.lineTo(flameX + 2, flameY - 6);
  ctx.lineTo(flameX - 2, flameY + 6);
  ctx.lineTo(flameX + 1, flameY + 20);
  ctx.stroke();
  // the belt: a little flame... crossed out
  const beltX = x + width / 2;
  const beltY = y + 84;
  ctx.fillStyle = '#ff6d00';
  ctx.beginPath();
  ctx.moveTo(beltX, beltY - 5);
  ctx.lineTo(beltX + 4, beltY + 3);
  ctx.lineTo(beltX - 4, beltY + 3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d50000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(beltX - 7, beltY - 6);
  ctx.lineTo(beltX + 7, beltY + 6);
  ctx.moveTo(beltX + 7, beltY - 6);
  ctx.lineTo(beltX - 7, beltY + 6);
  ctx.stroke();
  ctx.restore();
}

function configureRouteB4Level() {
  makeFrostFireMaster4B(player1);
  selectedMap = selectedNormalArcadeLevel === 4 ? 'sorcererLibrary' : selectedNormalArcadeLevel === 5 ? 'arcaneLibrary' : selectedNormalArcadeLevel === 6 ? 'burningLibrary' : 'robotFactory';
  if (selectedNormalArcadeLevel === 5 || selectedNormalArcadeLevel === 6) {
    resetRouteB5();
    resetRouteB6();
    makeRouteB5Obsidian(player1);
  }
  botEnabled = true;
  routeB4.escaped = false;
  routeB4.warned = false;
  if (selectedNormalArcadeLevel === 3) {
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    configureRouteB4Enemy();
    return;
  }
  const levelData = routeB4Levels[selectedNormalArcadeLevel] || routeB4Levels[1];
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  configureRouteB4Enemy();
}

function configureRouteB4Enemy() {
  if (selectedNormalArcadeLevel === 3) {
    // Chrono, nervous
    player2.setCharacterType('chrono');
    botDifficulty = 'hard';
    applyBotDifficulty();
    player2.setMaxHealth(220);
    player2.health = player2.maxHealth;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  const levelData = routeB4Levels[selectedNormalArcadeLevel] || routeB4Levels[1];
  const enemyIndex = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  if (selectedNormalArcadeLevel === 5 && enemyIndex >= 3) {
    configureRouteB5Boss();
    return;
  }
  if (selectedNormalArcadeLevel === 6) {
    configureRouteB6Boss();
    return;
  }
  if (selectedNormalArcadeLevel === 4 || selectedNormalArcadeLevel === 5) {
    // Sorcerer's magic minions: one per sphere color
    player2.setCharacterType('sorcerer', 'arcaneMinion');
    player2.minionColor = selectedNormalArcadeLevel === 5 ? routeB5MinionColors[enemyIndex % 3] : routeB4MinionColors[enemyIndex % routeB4MinionColors.length];
    botDifficulty = levelData.difficulties[enemyIndex] || 'medium';
    applyBotDifficulty();
    player2.setMaxHealth(originsHealth.arcaneMinion);
    player2.health = player2.maxHealth;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  configureFactoryRobotEnemy(levelData.enemies[enemyIndex], levelData.difficulties[enemyIndex] || 'medium');
}

function syncRouteB4ChapterUI() {
  const titles = ['Aceite y metal', 'Ojos rojos', 'El reloj que tiene miedo', 'El ritual', 'Tinta y fuego', 'Cenizas'];
  const descriptions = [
    'Reflecter acaba de limpiar este sector. Unos momentos despues, alguien que no deberia estar aca abre los ojos entre los robots.',
    'Mas robots defectuosos. Ninguno le pregunta quien es: solo atacan.',
    'Un reloj que flota y maneja el tiempo. Fire Master le pide ayuda... y Chrono no quiere ni que se le acerque.',
    'Sorcerer prepara un ritual para apagar el fuego negro. Tres esferas, siete velas... y algo que sale muy mal.',
    'Las ultimas esferas caen. Sorcerer cierra su libro: esta vez pelea el. Contra Obsidian... y por Fire Master.',
    'C R E I S T E  Q U E  T O D O  I B A  A  T E R M I N A R  B I E N ?',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (index >= titles.length) return;
    if (title) title.innerText = titles[index];
    if (description) description.innerText = descriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo 4B: Una fabrica que no es la suya';
  arcadeStoryKicker.innerText = 'Ruta B';
  arcadeStoryParagraphOne.innerText =
    'Fire Master cerro los ojos en el borde de Ciudad Cobalto. Los abrio en una fabrica abandonada, entre robots destrozados y el olor a aceite quemado.';
  arcadeStoryParagraphTwo.innerText =
    'Su naranja es mas oscuro, el hielo le sube por el cuerpo y su simbolo ya no se parece a nada. Alguien en esta fabrica maneja el tiempo... tal vez pueda llevarlo de vuelta.';
}

const routeB4IntroLines = {
  1: [
    { speaker: 'reflecter', text: 'Guardian oxidado detectado. Proceso de desactivacion... en curso.', gamblerFight: true },
    { speaker: 'reflecter', text: 'Desactivacion completada. Quedate en el piso: Tempus Corp. no va a venir a repararte.', hybridDown: true, emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'reflecter', text: 'Siguiente sector. La competencia no se destruye sola.', hybridDown: true, gamblerLeave: true },
    { speaker: 'origNarrator', text: 'Unos momentos despues...', hybridDown: true, later: true },
    { speaker: 'fireMaster', text: '...Otra vez. Cerre los ojos en el borde de la ciudad... y ahora huele a aceite y metal quemado.', hybridDown: true, fmIn: true },
    { speaker: 'fireMaster', text: 'Mis manos tienen mas hielo que ayer. Y mi simbolo... ya no se ni que es. Mi cinto esta tachado. Fui yo?', hybridDown: true },
    { speaker: 'fireMaster', text: 'Ese robot del piso... se esta moviendo.', hybridUp: true, emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'fireMaster', text: 'No quiero pelear. ...Pero vos si, no?' },
  ],
  2: [
    { speaker: 'fireMaster', text: 'Pasillos, cintas transportadoras, piezas rotas. Una fabrica entera para nadie.' },
    { speaker: 'fireMaster', text: 'Mas robots. Ojos rojos. Ninguno me pregunta quien soy. Solo atacan.' },
    { speaker: 'fireMaster', text: '(Dicen que aca adentro hay un reloj que mueve el tiempo... Si existe, lo voy a encontrar.)' },
  ],
  3: [
    { speaker: 'fireMaster', text: 'Un reloj... que flota. Sos vos. El que mueve el tiempo.' },
    { speaker: 'chrono', text: 'Tempus Corp. no recibe visitas sin cita previa, asi que si me disculp...', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'chrono', text: '(...Esa presencia. Fria y caliente al mismo tiempo. Esto no deberia existir en esta linea temporal.)' },
    { speaker: 'fireMaster', text: 'Por favor. Llevame atras. Antes de la montaña. Antes de la pagina. Antes de... todo.' },
    { speaker: 'chrono', text: 'Y-yo no hago favores. Estoy ocupado. Agenda llena. Hasta el año 3000. Minimo.', emote: { who: 'scammer', symbol: '...' } },
    { speaker: 'fireMaster', text: 'Por favor.' },
    { speaker: 'chrono', text: 'No te acerques. ...En serio, no te acerques. Mis engranajes tiemblan cuando estas cerca.' },
    { speaker: 'fireMaster', text: 'No me dejas otra opcion.' },
    { speaker: 'chrono', text: 'Ugh! Bien! Pero vos te lo buscaste, y NO uses ese fuego cerca mio!', emote: { who: 'scammer', symbol: '#!' } },
  ],
};

function startRouteB4Intro() {
  if (selectedNormalArcadeLevel === 4) {
    startRouteB4Ritual();
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    startRouteB5Intro();
    return;
  }
  if (selectedNormalArcadeLevel === 6) {
    startRouteB6Intro();
    return;
  }
  const lines = routeB4IntroLines[selectedNormalArcadeLevel];
  if (!lines) return;
  const first = selectedNormalArcadeLevel === 1;
  let gamblerActor = null;
  if (first) {
    gamblerActor = new Fighter({ x: 520, y: 0, color: '#7fb3d5', attacksToTheRight: true });
    gamblerActor.setCharacterType('reflecter');
  }
  ch6CutsceneBase('originsIntro', lines, 'dialog', {
    gamblerX: first ? -400 : 230,
    gamblerTargetX: first ? -400 : 230,
    scammerX: first ? 720 : 680,
    scammerTargetX: first ? 720 : 680,
    scammerY: 0,
    routeB3: true,
    chronoFloat: selectedNormalArcadeLevel === 3,
    fmShown: !first,
    hideEnemy: false,
    puffs: [],
    lastFlagLine: -1,
    gamblerActor,
    actorX: 470,
    laterFade: 0,
    hit: 0,
  });
  startCutsceneLine(0);
}

// ---------- level 3: Chrono avoids the fire, and then gets rid of Fire Master ----------
function isRouteB4Chrono(fighter) {
  return Boolean(normalArcadeActive && arcadeChapter === 'reflecterB' && selectedNormalArcadeLevel === 3 && fighter === player2 && fighter.characterType === 'chrono');
}

const routeB4DodgeLines = ['NO! ESO NO ME TOCA!', 'Tiempo... ATRAS!', 'Ni lo sueñes!', 'Mis engranajes! Lejos!'];

function routeB4ChronoDodge(chrono, mini) {
  // a skip in time: he is suddenly somewhere else
  routeB4.dodgeX = getFighterCenterX(chrono);
  routeB4.dodgeFx = 34;
  const toLeft = getFighterCenterX(chrono) > canvas.width / 2;
  chrono.position.x = toLeft ? 60 + Math.random() * 120 : canvas.width - chrono.width - 60 - Math.random() * 120;
  chrono.velocity.x = 0;
  showFlametombThought(chrono, mini ? routeB4DodgeLines[Math.floor(Math.random() * routeB4DodgeLines.length)] : 'AH NO, ESO NO!');
  // he slows Fire Master down a little, to keep him away
  player1.icedSlowTimer = Math.max(player1.icedSlowTimer || 0, mini ? 50 : 120);
  [1400, 1000, 700].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.1, type: 'triangle', volume: 0.04, slideTo: frequency * 0.6 }), index * 70));
}

function updateRouteB4() {
  if (routeB4.dodgeFx > 0) routeB4.dodgeFx -= 1;
  if (!(normalArcadeActive && arcadeChapter === 'reflecterB' && gameStarted) || gameOver || arcadeCutscene.active) return;
  // what he thinks in the fights
  if (player1.frostFire2 && !player1.obsidian && !flametomb.active) {
    flametomb.routeB4Thought = (flametomb.routeB4Thought || 420) - 1;
    if (flametomb.routeB4Thought <= 0) {
      flametomb.routeB4Thought = 1000 + Math.floor(Math.random() * 500);
      showFlametombThought(player1, routeB4Thoughts[Math.floor(Math.random() * routeB4Thoughts.length)]);
    }
  }
  if (selectedNormalArcadeLevel === 4) {
    updateRouteB4Obsidian();
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    updateRouteB5();
    return;
  }
  if (selectedNormalArcadeLevel === 6) {
    updateRouteB6();
    return;
  }
  if (selectedNormalArcadeLevel !== 3 || player2.characterType !== 'chrono') return;
  // the tower comes: he sees it coming
  if (flametomb.active && flametomb.t === flametombSilenceEnd + 10) showFlametombThought(player2, 'Esa torre... NO! Otra vez no!');
  if (!routeB4.warned && player2.health <= player2.maxHealth * 0.7) {
    routeB4.warned = true;
    showFlametombThought(player2, '(Esta ganando... Necesito sacarlo de aca. YA.)');
  }
  // losing: he sends Fire Master somewhere else
  if (!routeB4.escaped && !flametomb.active && player2.health <= player2.maxHealth * 0.4) {
    routeB4.escaped = true;
    robotShots = [];
    chronoBlades = [];
    miniFlametombs.length = 0;
    startMidFightCh7Cutscene('routeB4Escape', routeB4EscapeLines, 'dialog', { scammerY: 60, portal: 0 });
  }
}

// (Chrono can't be finished here: he escapes first)
function routeB4DamageFloor(target) {
  if (isRouteB4Chrono(target) && !routeB4.escaped) target.health = Math.max(target.health, Math.ceil(target.maxHealth * 0.38));
}

const routeB4EscapeLines = [
  { speaker: 'chrono', text: 'BASTA! No vas a tocarme con ese fuego. Ni hoy, ni en ninguna linea temporal!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'fireMaster', text: 'Solo te pedi ayuda...' },
  { speaker: 'chrono', text: 'Y te la voy a dar. A mi manera. Conozco a alguien que lee DEMASIADO sobre fuegos que no se apagan.' },
  { speaker: 'chrono', text: 'Que tengas un buen viaje, Fire Master. ...Bien lejos de mi.', portal: true },
  { speaker: 'fireMaster', text: 'Espera... que es eso... ESPERA!', portal: true },
];
if (!ch7MidFightScenes.includes('routeB4Escape')) ch7MidFightScenes.push('routeB4Escape');

const routeB4LibraryLines = [
  { speaker: 'sorcerer', text: '...Hm? Quien entra a mi biblioteca sin tocar la puerta? Y por un PORTAL TEMPORAL, ademas.', emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'fireMaster', text: 'Sorcerer... sos vos? El de las tres esferas?' },
  { speaker: 'sorcerer', text: 'El mismo. Y vos sos Fire Master... aunque ese simbolo... mitad fuego, mitad hielo. Y ese cinto tachado.' },
  { speaker: 'fireMaster', text: 'Lei tu libro. La pagina del fuego negro. La que estaba caliente.' },
  { speaker: 'sorcerer', text: '...La pagina del Flametomb. Escribi que no se recomendaba. Escribi que causaba daños...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'fireMaster', text: 'Lo use. Dos veces. Mi hermano... y un vendedor de lentes. No puedo parar de caminar. Escucho fuego donde no hay fuego.' },
  { speaker: 'sorcerer', text: '...' },
  { speaker: 'sorcerer', text: 'Sentate. Hay te. Y hay libros. Muchos libros. Si existe una forma de apagar ese fuego, esta en algun lugar de esta biblioteca.' },
  { speaker: 'fireMaster', text: 'Y si no existe?' },
  { speaker: 'sorcerer', text: 'Entonces la escribimos nosotros.' },
];

function startRouteB4Library() {
  // the portal drops him in Sorcerer's library
  player2.setCharacterType('sorcerer');
  player2.health = player2.maxHealth;
  robotShots = [];
  chronoBlades = [];
  chronoZones = [];
  ch6CutsceneBase('routeB4Library', routeB4LibraryLines, 'dialog', {
    gamblerX: 260,
    gamblerTargetX: 260,
    scammerX: 660,
    scammerTargetX: 660,
    scammerY: 0,
    portalOut: 1,
  });
  startCutsceneLine(0);
}

function updateRouteB4Scene(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (cutscene.scene === 'routeB4Escape') {
    cutscene.scammerY = 60 + Math.sin(cutscene.frame / 12) * 6;
    if (line && line.portal) cutscene.portal = Math.min(1, (cutscene.portal || 0) + 0.02);
  } else if (cutscene.portalOut > 0) {
    cutscene.portalOut = Math.max(0, cutscene.portalOut - 0.02);
  }
}

function drawRouteB4Portal(x, y, size) {
  const time = performance.now() / 1000;
  for (let ring = 0; ring < 5; ring += 1) {
    ctx.strokeStyle = ring % 2 ? 'rgba(38, 198, 218, 0.8)' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y, (30 + ring * 12) * size, (60 + ring * 16) * size, 0, time * (ring % 2 ? 2 : -2) + ring, time * (ring % 2 ? 2 : -2) + ring + Math.PI * 1.5);
    ctx.stroke();
  }
}

function drawRouteB4SceneFx(cutscene) {
  if (cutscene.scene === 'routeB4Escape') {
    drawRouteB3Cold(1);
    if (cutscene.portal > 0) {
      const centerX = cutscene.gamblerX + player1.width / 2;
      drawRouteB4Portal(centerX, ground - 70, cutscene.portal);
      ctx.fillStyle = `rgba(224, 247, 250, ${cutscene.portal * 0.35})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }
  if (cutscene.portalOut > 0) {
    drawRouteB4Portal(cutscene.gamblerX + player1.width / 2, ground - 70, cutscene.portalOut);
    ctx.fillStyle = `rgba(224, 247, 250, ${cutscene.portalOut * 0.6})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Chrono's time-skip, during the fight
function drawRouteB4Fx() {
  if (routeB4.dodgeFx <= 0) return;
  const strength = routeB4.dodgeFx / 34;
  ctx.save();
  ctx.strokeStyle = `rgba(128, 222, 234, ${strength})`;
  ctx.lineWidth = 3;
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.beginPath();
    ctx.arc(routeB4.dodgeX, ground - 90, 20 + (1 - strength) * 90 + ring * 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = `rgba(128, 222, 234, ${strength * 0.18})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// Sorcerer's library: the same place as the playable map (arcaneLibrary)... but quiet, without any magic going on
function drawSorcererLibraryStage() {
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#0f0819');
  sky.addColorStop(0.55, '#23143c');
  sky.addColorStop(1, '#160a26');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);
  // the big arched window and its moon
  ctx.fillStyle = '#33255c';
  ctx.beginPath();
  ctx.moveTo(392, ground - 150);
  ctx.lineTo(392, 210);
  ctx.arc(512, 210, 120, Math.PI, 0);
  ctx.lineTo(632, ground - 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d6cbef';
  ctx.beginPath();
  ctx.arc(548, 176, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#33255c';
  ctx.beginPath();
  ctx.arc(564, 166, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#140a24';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(512, 90);
  ctx.lineTo(512, ground - 150);
  ctx.moveTo(392, 250);
  ctx.lineTo(632, 250);
  ctx.stroke();
  // the same four bookshelves
  const bookColors = ['#8e24aa', '#3949ab', '#c62828', '#00897b', '#f9a825', '#6d4c41'];
  [24, 152, 782, 910].forEach((shelfX, shelfIndex) => {
    ctx.fillStyle = '#2a160c';
    ctx.fillRect(shelfX, 120, 92, ground - 120);
    for (let rowY = 136; rowY < ground - 40; rowY += 52) {
      let bookX = shelfX + 8;
      let bookIndex = shelfIndex;
      while (bookX < shelfX + 82) {
        const bookWidth = 8 + ((bookIndex * 5 + rowY) % 7);
        const bookHeight = 30 + ((bookIndex * 11 + rowY) % 12);
        ctx.fillStyle = bookColors[(bookIndex + rowY) % bookColors.length];
        ctx.fillRect(bookX, rowY + 42 - bookHeight, Math.min(bookWidth, shelfX + 84 - bookX), bookHeight);
        bookX += bookWidth + 2;
        bookIndex += 1;
      }
      ctx.fillStyle = '#4e2c17';
      ctx.fillRect(shelfX, rowY + 42, 92, 8);
    }
  });
  // the candles don't float now: they rest on simple stands, burning quietly
  const time = performance.now() / 1000;
  [[370, ground - 120], [610, ground - 120]].forEach(([candleX, candleY], index) => {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(candleX - 3, candleY + 26, 6, ground - candleY - 26);
    ctx.fillRect(candleX - 14, ground - 6, 28, 6);
    ctx.fillRect(candleX - 10, candleY + 24, 20, 5);
    ctx.fillStyle = '#f3e5f5';
    ctx.fillRect(candleX - 5, candleY, 10, 26);
    ctx.fillStyle = 'rgba(255, 213, 79, 0.25)';
    ctx.beginPath();
    ctx.arc(candleX, candleY - 6, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.ellipse(candleX, candleY - 6, 3.5, 7 + Math.sin(time * 9 + index) * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // a pile of books and a cup of tea on the floor
  ['#3949ab', '#c62828', '#00897b'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(560 + index * 3, ground - 14 - index * 10, 54 - index * 6, 10);
  });
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(430, ground - 14, 14, 14);
  ctx.strokeStyle = '#eceff1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(446, ground - 7, 4, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // the floor, with the runes drawn but switched off
  ctx.fillStyle = '#1b1030';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#5e4596';
  ctx.fillRect(0, ground - 8, canvas.width, 8);
  ctx.strokeStyle = 'rgba(126, 87, 194, 0.3)';
  ctx.lineWidth = 2;
  for (let tileX = 0; tileX < canvas.width; tileX += 64) {
    ctx.beginPath();
    ctx.moveTo(tileX, ground);
    ctx.lineTo(tileX, canvas.height);
    ctx.stroke();
  }
  arcaneRuneSpots.forEach((runeX) => {
    ctx.save();
    ctx.translate(runeX, ground - 4);
    ctx.scale(1, 0.28);
    ctx.strokeStyle = 'rgba(149, 117, 205, 0.18)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, arcaneRuneRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

const reflecterArcadeBChapterButton = document.getElementById('reflecterArcadeBChapterButton');
if (reflecterArcadeBChapterButton) reflecterArcadeBChapterButton.addEventListener('click', () => openArcadeChapter('reflecterB', true));

// ================= 4B, LEVEL 4: the ritual... and OBSIDIAN =================
reflecterBattleTrackSources.rouxls = encodeURI('assetsaudio/Rouxls Kaard.mp3');
reflecterBattleTrackVolumes.rouxls = 0.55;
// Sorcerer's minions (they use the "special chapter" variant tables)
['arcaneMinion'].forEach((variant) => {
  if (!originsVariants.includes(variant)) originsVariants.push(variant);
  if (!arcadeBossVariants.includes(variant)) arcadeBossVariants.push(variant);
});
originsSizes.arcaneMinion = [56, 100];
originsSpeeds.arcaneMinion = 1.1;
originsDamage.arcaneMinion = 0.75;
originsHealth.arcaneMinion = 90;
originsNames.arcaneMinion = 'Esbirro Arcano';

const routeB4RitualLines = [
  { speaker: 'sorcerer', text: 'Listo. El circulo esta preparado. Tres esferas, siete velas... y una pagina que nunca debi escribir.', noEnemy: true },
  { speaker: 'fireMaster', text: 'Va a doler?', noEnemy: true },
  { speaker: 'sorcerer', text: '...Probablemente. Quedate en el centro del circulo. Y pase lo que pase... no apartes la mirada.', noEnemy: true },
  { speaker: 'sorcerer', text: 'Ignis qui non moritur... fuego que no se apaga... yo te nombro.', noEnemy: true, chant: true },
  { speaker: 'sorcerer', text: 'Yo te escribi. Yo te di forma. Y yo... te ORDENO...', noEnemy: true, chant: true, rise: true },
  { speaker: 'sorcerer', text: 'SALI DE EL!!!', noEnemy: true, chant: true, rise: true, surge: true },
  { speaker: 'fireMaster', text: 'Ngh... AAAAAAAGH!', noEnemy: true, chant: true, rise: true, surge: true },
  { speaker: 'sorcerer', text: 'Ya casi...! Resisti, Fire Master! RESISTI!', noEnemy: true, chant: true, rise: true, surge: true },
  { speaker: 'sorcerer', text: '...Que? Las esferas... se estan volviendo NEGRAS?!', noEnemy: true, chant: true, rise: true, surge: true, corrupt: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'sorcerer', text: 'NO! NO, ESPERA! ALGO ESTA EMPUJANDO DESDE ADENTRO!', noEnemy: true, chant: true, rise: true, surge: true, corrupt: true, crack: true },
  { speaker: 'fireMaster', text: 'S-Sorcerer... corre... no soy yo el que esta...', noEnemy: true, chant: true, rise: true, surge: true, corrupt: true },
  { speaker: 'sorcerer', text: '...', noEnemy: true, blast: true },
  { speaker: 'sorcerer', text: '...', noEnemy: true, dark: true, ring: true },
  { speaker: 'sorcerer', text: '(*tos*)... Fire Master? ...Fire Master, respondeme.', noEnemy: true, dark: true },
  { speaker: 'obsidian', text: '......', noEnemy: true, dark: true, eyes: true },
  { speaker: 'sorcerer', text: '...', noEnemy: true, after: true },
  { speaker: 'sorcerer', text: 'Tu simbolo... es negro. Negro como la obsidiana. Eso... eso no estaba en el ritual.', noEnemy: true, after: true, emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'sorcerer', text: 'El libro. El libro. Donde esta... (pasa las paginas, le tiemblan las manos)', noEnemy: true, after: true, book: true, tremble: true },
  { speaker: 'sorcerer', text: '"ADVERTENCIA: si el fuego negro fue usado mas de una vez... puede haber aprendido a..."', noEnemy: true, after: true, book: true, tremble: true, heart: true },
  { speaker: 'sorcerer', text: '"...a PENSAR."', noEnemy: true, after: true, book: true, reveal: true },
  { speaker: 'sorcerer', text: '...', noEnemy: true, after: true, book: true, stunned: true },
  { speaker: 'sorcerer', text: '...No. No, no, no, no. Esto no... yo no...', noEnemy: true, after: true, book: true, tremble: true, heart: true },
  { speaker: 'sorcerer', text: 'El Flametomb... tiene conciencia. Esta VIVO. Y esta compartiendo el cuerpo con vos.', noEnemy: true, after: true, book: true, heart: true },
  { speaker: 'sorcerer', text: '(Y se van a turnar el control. El simbolo me va a decir quien esta adentro.)', noEnemy: true, after: true, book: true },
  { speaker: 'obsidian', text: '...Sorcerer.', noEnemy: true, after: true },
  { speaker: 'obsidian', text: '...Vos me escribiste.', noEnemy: true, after: true, emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'obsidian', text: '...Y todo lo que se escribe... ARDE.', noEnemy: true, after: true, menace: true },
  { speaker: 'sorcerer', text: '...', noEnemy: true, after: true, stunned: true },
  { speaker: 'sorcerer', text: '...Esta bien.', noEnemy: true, after: true, resolve: true },
  { speaker: 'sorcerer', text: 'Fire Master, si me escuchas ahi adentro: te voy a sacar. Y si para eso tengo que detenerte... te voy a detener.', noEnemy: true, after: true, resolve: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'sorcerer', text: 'ESFERAS! FORMEN GUARDIA, LAS SEIS! Necesito tiempo para encontrar el contrahechizo!', after: true, resolve: true, summon: true },
];
const routeB4SummonSpots = [450, 520, 690, 870, 940];
const routeB4MinionColors = ['#e53935', '#1e88e5', '#8e24aa', '#ffb300', '#43a047', '#00acc1'];

function startRouteB4Ritual() {
  const sorcerer = new Fighter({ x: 600, y: 0, color: '#6a1b9a', attacksToTheRight: false });
  sorcerer.setCharacterType('sorcerer');
  player1.obsidian = false;
  player1.obsidianControl = true;
  ch6CutsceneBase('originsIntro', routeB4RitualLines, 'dialog', {
    gamblerX: 290,
    gamblerTargetX: 290,
    scammerX: 780,
    scammerTargetX: 780,
    scammerY: 0,
    routeB3: true,
    ritual: true,
    fmShown: true,
    hideEnemy: true,
    lyingEnemy: false,
    puffs: [],
    lastFlagLine: -1,
    gamblerActor: sorcerer,
    actorX: 600,
    actorFacesLeft: true,
    laterFade: 0,
    hit: 0,
    glow: 0,
    flash: 0,
    whiteFlash: 0,
    shake: 0,
    sparks: [],
    shards: [],
    papers: [],
    corrupt: 0,
    dark: 0,
    eyes: 0,
    reveal: 0,
    resolveGlow: 0,
    lineFrame: 0,
    summoned: [],
    gamblerHop: 0,
  });
  startCutsceneLine(0);
}

function updateRouteB4Ritual(cutscene, line, firstFrame) {
  const time = performance.now() / 1000;
  cutscene.lineFrame = firstFrame ? 0 : cutscene.lineFrame + 1;
  const lf = cutscene.lineFrame;
  // the chant: the circle wakes up, a choir of low tones
  if (line.chant) cutscene.glow = Math.min(1, cutscene.glow + 0.006);
  if (line.chant && firstFrame && !line.surge) {
    playTone({ frequency: 110, duration: 3, type: 'sine', volume: 0.05, slideTo: 220 });
    playTone({ frequency: 165, duration: 3, type: 'triangle', volume: 0.025, slideTo: 330 });
  }
  if (line.chant && !line.surge && lf % 80 === 40) playTone({ frequency: 220 + cutscene.glow * 110, duration: 1.2, type: 'triangle', volume: 0.025 });
  // Fire Master rises into the beam... and falls when it breaks
  const hopTarget = line.rise ? 46 + (line.surge ? Math.sin(time * 9) * 4 : 0) : 0;
  cutscene.gamblerHop += (hopTarget - cutscene.gamblerHop) * (line.blast ? 0.3 : 0.06);
  // the surge: everything shakes harder and harder
  if (line.surge) {
    cutscene.shake = 3 + cutscene.glow * 4 + cutscene.corrupt * 8;
    if (lf % 10 === 0) playTone({ frequency: 120 + cutscene.glow * 300 - cutscene.corrupt * 200, duration: 0.15, type: 'sawtooth', volume: 0.04 });
    for (let spark = 0; spark < 2 + Math.round(cutscene.corrupt * 3); spark += 1) {
      const black = Math.random() < cutscene.corrupt;
      cutscene.sparks.push({ x: 320 + (Math.random() - 0.5) * 160, y: ground - Math.random() * 20, vy: -2 - Math.random() * 5, life: 45, color: black ? (Math.random() < 0.5 ? '#000' : '#ff3d00') : ['#e53935', '#1e88e5', '#8e24aa'][Math.floor(Math.random() * 3)] });
    }
  } else if (!line.blast) {
    cutscene.shake *= 0.85;
  }
  // it goes wrong: the spheres turn black, one by one
  if (line.corrupt) {
    cutscene.corrupt = Math.min(1, cutscene.corrupt + 0.006);
    if (firstFrame) {
      playTone({ frequency: 55, duration: 3, type: 'sawtooth', volume: 0.06, slideTo: 41 });
      playNoise({ duration: 0.6, volume: 0.05, filterFrequency: 400 });
    }
    if (lf % 34 === 17) playNoise({ duration: 0.12, volume: 0.04, filterFrequency: 6000 });
  }
  if (line.crack && firstFrame) {
    [0, 140, 300].forEach((delay, index) => setTimeout(() => playNoise({ duration: 0.25, volume: 0.07 - index * 0.015, filterFrequency: 5600 - index * 1200 }), delay));
  }
  // THE BLAST: white, then black. The spheres burst, the books fly, every candle dies.
  if (line.blast && firstFrame) {
    cutscene.whiteFlash = 1;
    cutscene.flash = 1;
    cutscene.shake = 30;
    cutscene.glow = 0;
    player1.obsidian = true;
    player1.obsidianControl = true;
    [-110, 0, 110].forEach((offset) => {
      for (let shard = 0; shard < 10; shard += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        cutscene.shards.push({ x: 320 + offset, y: ground - 180, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, spin: Math.random() * 6, size: 4 + Math.random() * 6, life: 160 });
      }
    });
    for (let paper = 0; paper < 46; paper += 1) {
      const fromLeft = Math.random() < 0.5;
      cutscene.papers.push({ x: fromLeft ? 40 + Math.random() * 200 : 780 + Math.random() * 200, y: 140 + Math.random() * 300, vx: (fromLeft ? -1 : 1) * (1 + Math.random() * 6), vy: -2 - Math.random() * 4, spin: Math.random() * 6, life: 220 + Math.random() * 120 });
    }
    playNoise({ duration: 2.2, volume: 0.16, filterFrequency: 700 });
    playNoise({ duration: 0.6, volume: 0.08, filterFrequency: 6500 });
    playTone({ frequency: 48, duration: 3.5, type: 'sawtooth', volume: 0.09, slideTo: 24 });
    playTone({ frequency: 96, duration: 1.4, type: 'square', volume: 0.04, slideTo: 30 });
  }
  if (line.blast) cutscene.shake *= 0.93;
  // and then... nothing. Darkness, and a ringing in the ears.
  const darkTarget = line.blast ? 0.6 : line.dark ? 0.93 : line.after ? (line.reveal || line.menace ? 0.62 : 0.42) : 0;
  cutscene.dark += (darkTarget - cutscene.dark) * (line.blast ? 0.03 : 0.04);
  if (line.ring && firstFrame) playTone({ frequency: 3900, duration: 4, type: 'sine', volume: 0.012, slideTo: 3700 });
  // two eyes open in the dark
  if (line.eyes && firstFrame) {
    cutscene.eyes = 0.01;
    playTone({ frequency: 44, duration: 2.6, type: 'sawtooth', volume: 0.08, slideTo: 33 });
    playTone({ frequency: 1250, duration: 0.25, type: 'square', volume: 0.03, slideTo: 900 });
    playNoise({ duration: 0.5, volume: 0.06, filterFrequency: 300 });
  }
  if (line.eyes || (cutscene.eyes > 0 && line.dark)) cutscene.eyes = Math.min(1, cutscene.eyes + 0.03);
  else cutscene.eyes = Math.max(0, cutscene.eyes - 0.03);
  // Sorcerer, shaking
  cutscene.actorX = 600 + (line.tremble ? (Math.random() - 0.5) * 3 : 0);
  // a heartbeat in the silence
  if (line.heart && lf % 66 === 0) {
    playTone({ frequency: 55, duration: 0.16, type: 'sine', volume: 0.1 });
    setTimeout(() => playTone({ frequency: 50, duration: 0.2, type: 'sine', volume: 0.08 }), 230);
  }
  // the revelation: the page burns red, the room drops
  if ((line.reveal || line.menace) && firstFrame) {
    cutscene.reveal = 1;
    cutscene.shake = line.reveal ? 16 : 9;
    playTone({ frequency: 36, duration: 3, type: 'sawtooth', volume: 0.1, slideTo: 27 });
    playNoise({ duration: 1.4, volume: 0.1, filterFrequency: 500 });
    if (line.reveal) playTone({ frequency: 880, duration: 1.6, type: 'sine', volume: 0.03, slideTo: 830 });
  }
  if (line.reveal || line.menace || line.stunned) cutscene.shake *= 0.94;
  cutscene.reveal = Math.max(0, cutscene.reveal - 0.008);
  // he decides: a steady light around him
  if (line.resolve) {
    cutscene.resolveGlow = Math.min(1, cutscene.resolveGlow + 0.02);
    if (firstFrame && !line.summon) {
      playTone({ frequency: 220, duration: 1.4, type: 'triangle', volume: 0.05, slideTo: 330 });
      playTone({ frequency: 330, duration: 1.4, type: 'sine', volume: 0.03, slideTo: 440 });
    }
  }
  // six spheres, six guardians
  if (line.summon) {
    const spots = [780, ...routeB4SummonSpots];
    const index = Math.floor(lf / 14);
    if (lf % 14 === 0 && index < spots.length) {
      const spotX = spots[index];
      if (index > 0) cutscene.summoned.push({ x: spotX, color: routeB4MinionColors[index], t: 0 });
      for (let puff = 0; puff < 16; puff += 1) {
        cutscene.puffs.push({ x: spotX + Math.random() * 56, y: ground - Math.random() * 100, r: 8 + Math.random() * 12, life: 30 + Math.random() * 20 });
      }
      playTone({ frequency: 330 + index * 70, duration: 0.3, type: 'triangle', volume: 0.05, slideTo: 520 + index * 70 });
      if (index === 0) playSound('sorcererSecretLaunch');
    }
  }
  cutscene.summoned.forEach((minion) => {
    minion.t += 1;
  });
  cutscene.whiteFlash = Math.max(0, cutscene.whiteFlash - 0.05);
  if (cutscene.flash > 0) cutscene.flash = Math.max(0, cutscene.flash - 0.012);
  cutscene.sparks.forEach((spark) => {
    spark.y += spark.vy;
    spark.life -= 1;
  });
  cutscene.sparks = cutscene.sparks.filter((spark) => spark.life > 0);
  cutscene.shards.forEach((shard) => {
    shard.x += shard.vx;
    shard.y += shard.vy;
    shard.vy += 0.25;
    if (shard.y > ground - 4) {
      shard.y = ground - 4;
      shard.vy *= -0.3;
      shard.vx *= 0.7;
    }
    shard.spin += shard.vx * 0.05;
    shard.life -= 1;
  });
  cutscene.shards = cutscene.shards.filter((shard) => shard.life > 0);
  cutscene.papers.forEach((paper) => {
    paper.x += paper.vx;
    paper.y += paper.vy;
    paper.vx *= 0.985;
    paper.vy = Math.min(1.2, paper.vy + 0.06);
    paper.spin += 0.08;
    if (paper.y > ground - 3) paper.y = ground - 3;
    paper.life -= 1;
  });
  cutscene.papers = cutscene.papers.filter((paper) => paper.life > 0);
  cutscene.puffs.forEach((puff) => {
    puff.life -= 1;
    puff.r += 0.5;
    puff.y -= 0.4;
  });
  cutscene.puffs = cutscene.puffs.filter((puff) => puff.life > 0);
  // the book, open in Sorcerer's hands
  cutscene.reading = Boolean(line.book);
}

function drawRouteB4RitualBack(cutscene) {
  const time = performance.now() / 1000;
  const centerX = 320;
  const corrupt = cutscene.corrupt;
  const broken = cutscene.lines.slice(0, cutscene.lineIndex + 1).some((line) => line.blast);
  // the ritual circle on the floor (violet... then black and molten)
  ctx.save();
  ctx.translate(centerX, ground - 2);
  ctx.scale(1, 0.25);
  const circleColor = broken ? `rgba(255, 61, 0, ${0.25 + Math.sin(time * 3) * 0.1})` : corrupt > 0 ? `rgba(${Math.round(234 + 21 * corrupt)}, ${Math.round(128 - 67 * corrupt)}, ${Math.round(252 - 252 * corrupt)}, ${0.5 + cutscene.glow * 0.5})` : `rgba(234, 128, 252, ${0.35 + cutscene.glow * 0.6})`;
  ctx.strokeStyle = circleColor;
  ctx.shadowColor = corrupt > 0.3 || broken ? '#ff3d00' : '#ea80fc';
  ctx.shadowBlur = broken ? 8 : 10 + cutscene.glow * 30;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();
  // runes around the edge
  if (!broken) {
    ctx.fillStyle = circleColor;
    for (let rune = 0; rune < 16; rune += 1) {
      const angle = (rune / 16) * Math.PI * 2 - time * (0.2 + cutscene.glow);
      ctx.fillRect(Math.cos(angle) * 124 - 4, Math.sin(angle) * 124 - 4, 8, 8);
    }
  }
  ctx.rotate(broken ? 0.4 : time * (0.3 + cutscene.glow * 3 + corrupt * 4));
  ctx.beginPath();
  for (let point = 0; point < 5; point += 1) {
    const angle = -Math.PI / 2 + (point * Math.PI * 4) / 5;
    if (point === 0) ctx.moveTo(Math.cos(angle) * 96, Math.sin(angle) * 96);
    else ctx.lineTo(Math.cos(angle) * 96, Math.sin(angle) * 96);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  // the three spheres: they climb with the chant and blacken with the corruption
  if (!broken) {
    [['#e53935', -110], ['#1e88e5', 0], ['#8e24aa', 110]].forEach(([color, offset], index) => {
      const sphereX = centerX + offset + (corrupt > 0 ? (Math.random() - 0.5) * corrupt * 6 : 0);
      const sphereY = ground - 150 - Math.sin(time * 2 + index) * 8 - cutscene.glow * 30;
      const black = corrupt * 3 - index > 0.5;
      const glow = ctx.createRadialGradient(sphereX, sphereY, 2, sphereX, sphereY, 30 + cutscene.glow * 30);
      glow.addColorStop(0, black ? '#ff3d00' : color);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sphereX - 60, sphereY - 60, 120, 120);
      ctx.fillStyle = black ? '#050505' : color;
      ctx.beginPath();
      ctx.arc(sphereX, sphereY, 9 + (black ? 2 : 0), 0, Math.PI * 2);
      ctx.fill();
      if (black) {
        ctx.strokeStyle = '#ff6d00';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sphereX - 6, sphereY - 5);
        ctx.lineTo(sphereX + 1, sphereY);
        ctx.lineTo(sphereX - 2, sphereY + 7);
        ctx.stroke();
      }
    });
  }
  // a beam of light on Fire Master while the ritual surges (it turns red, then black)
  if (cutscene.glow > 0.3 && !broken) {
    const beam = (cutscene.glow - 0.3) * 0.55;
    ctx.fillStyle = corrupt > 0 ? `rgba(${Math.round(234 - 200 * corrupt)}, ${Math.round(128 - 120 * corrupt)}, ${Math.round(252 - 240 * corrupt)}, ${beam + corrupt * 0.3})` : `rgba(234, 128, 252, ${beam})`;
    ctx.fillRect(centerX - 50 - corrupt * 10, 0, 100 + corrupt * 20, ground);
    if (corrupt > 0) {
      ctx.strokeStyle = `rgba(255, 61, 0, ${corrupt})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let bolt = 0; bolt < 3; bolt += 1) {
        let boltX = centerX - 40 + Math.random() * 80;
        ctx.moveTo(boltX, 0);
        for (let step = 1; step < 8; step += 1) {
          boltX += (Math.random() - 0.5) * 30;
          ctx.lineTo(boltX, (ground / 8) * step);
        }
      }
      ctx.stroke();
    }
  }
  // a scorched crater where the circle was
  if (broken) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(centerX, ground - 2, 130, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRouteB4RitualFront(cutscene) {
  const time = performance.now() / 1000;
  // the summoned guardians (the sixth one is the one you fight first)
  cutscene.summoned.forEach((minion) => {
    ctx.save();
    ctx.globalAlpha = Math.min(1, minion.t / 20);
    drawArcaneMinion({ position: { x: minion.x, y: ground - 100 }, width: 56, height: 100, minionColor: minion.color, attacksToTheRight: false, isAttacking: false });
    ctx.restore();
  });
  cutscene.sparks.forEach((spark) => {
    ctx.fillStyle = spark.color;
    ctx.globalAlpha = Math.min(1, spark.life / 20);
    ctx.fillRect(spark.x, spark.y, 4, 4);
  });
  ctx.globalAlpha = 1;
  cutscene.puffs.forEach((puff) => {
    ctx.fillStyle = `rgba(206, 147, 216, ${Math.min(0.8, puff.life / 30)})`;
    ctx.beginPath();
    ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
    ctx.fill();
  });
  // loose pages and burnt shards of the spheres
  cutscene.papers.forEach((paper) => {
    ctx.save();
    ctx.translate(paper.x, paper.y);
    ctx.rotate(paper.spin);
    ctx.scale(1, Math.cos(paper.spin * 1.7));
    ctx.fillStyle = paper.life % 40 < 3 ? '#ffab40' : '#efe6cf';
    ctx.fillRect(-6, -8, 12, 16);
    ctx.fillStyle = 'rgba(60, 40, 30, 0.5)';
    ctx.fillRect(-4, -4, 8, 1);
    ctx.fillRect(-4, 0, 8, 1);
    ctx.restore();
  });
  cutscene.shards.forEach((shard) => {
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(shard.spin);
    ctx.fillStyle = '#0b0b0f';
    ctx.strokeStyle = shard.life > 100 ? '#ff6d00' : 'rgba(255, 109, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -shard.size);
    ctx.lineTo(shard.size * 0.6, shard.size * 0.5);
    ctx.lineTo(-shard.size * 0.6, shard.size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  if (cutscene.reading) {
    // the ritual book, open (the page burns red when it says the word)
    const bookX = cutscene.actorX - 18;
    const bookY = ground - 70;
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(bookX - 2, bookY - 2, 40, 22);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(bookX, bookY, 17, 18);
    ctx.fillRect(bookX + 19, bookY, 17, 18);
    if (cutscene.reveal > 0) {
      ctx.fillStyle = `rgba(255, 61, 0, ${cutscene.reveal})`;
      ctx.fillRect(bookX + 19, bookY, 17, 18);
      const glow = ctx.createRadialGradient(bookX + 27, bookY + 9, 2, bookX + 27, bookY + 9, 80);
      glow.addColorStop(0, `rgba(255, 61, 0, ${cutscene.reveal * 0.6})`);
      glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(bookX - 60, bookY - 70, 180, 160);
    }
  }
  // the darkness after the blast
  if (cutscene.dark > 0.01) {
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.dark})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // whatever light is left: a little glow around Sorcerer
    if (cutscene.dark < 0.8) {
      const light = ctx.createRadialGradient(cutscene.actorX + 30, ground - 60, 10, cutscene.actorX + 30, ground - 60, 150);
      light.addColorStop(0, `rgba(179, 136, 255, ${0.12 + cutscene.resolveGlow * 0.15})`);
      light.addColorStop(1, 'rgba(179, 136, 255, 0)');
      ctx.fillStyle = light;
      ctx.fillRect(cutscene.actorX - 130, ground - 220, 320, 240);
    }
  }
  // the red of the revelation
  if (cutscene.reveal > 0) {
    ctx.fillStyle = `rgba(120, 0, 0, ${cutscene.reveal * 0.35 * (0.7 + Math.sin(time * 10) * 0.3)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // the edges close in
    const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 200, canvas.width / 2, canvas.height / 2, 620);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(0, 0, 0, ${cutscene.reveal * 0.8})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // the eyes (and the symbol) in the dark: the only thing you can see
  if ((cutscene.eyes > 0 || cutscene.dark > 0.3) && player1.obsidian) {
    const x = player1.position.x;
    const y = player1.position.y;
    const w = player1.width;
    const seen = Math.max(cutscene.eyes, cutscene.dark > 0.3 ? 0.35 : 0);
    ctx.save();
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 18;
    ctx.fillStyle = `rgba(255, 109, 0, ${seen})`;
    const open = Math.min(1, cutscene.eyes * 2 + (cutscene.eyes > 0 ? 0 : 1)) * 3;
    ctx.fillRect(x + 12, y + 15.5 - open / 2, 10, open);
    ctx.fillRect(x + w - 22, y + 15.5 - open / 2, 10, open);
    ctx.fillStyle = `rgba(255, 61, 0, ${seen * (0.5 + Math.sin(time * 5) * 0.3)})`;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 28);
    ctx.lineTo(x + w / 2 - 3, y + 40);
    ctx.lineTo(x + w / 2 + 3, y + 46);
    ctx.lineTo(x + w / 2 - 1, y + 56);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
    ctx.restore();
  }
  if (cutscene.flash > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, cutscene.flash * 1.3)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(255, 61, 0, ${cutscene.flash * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.whiteFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.whiteFlash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- the fight: OBSIDIAN against the minions, and the two of them taking turns ----------
const obsidianThoughts = ['...Arde.', '...Escritor. Donde estas.', '...Papel. Tinta. Todo arde igual.', '...Este cuerpo es mio ahora.'];
const fireMasterBreakThoughts = ['(SORCERER, CORRE! NO SOY YO!)', '(Lo estoy sosteniendo... no se por cuanto!)', '(Perdon... perdon... no puedo pararlo!)', '(Encontra el contrahechizo! RAPIDO!)'];
let routeB4Sorcerer = null;

function setObsidianControl(on) {
  player1.obsidianControl = on;
  player1.damageMultiplier = on ? 2 : 0.85;
  routeB4.swapFx = 30;
  if (on) {
    showFlametombThought(player1, obsidianThoughts[Math.floor(Math.random() * obsidianThoughts.length)]);
    playTone({ frequency: 70, duration: 0.8, type: 'sawtooth', volume: 0.05, slideTo: 45 });
  } else {
    showFlametombThought(player1, fireMasterBreakThoughts[Math.floor(Math.random() * fireMasterBreakThoughts.length)]);
    playTone({ frequency: 440, duration: 0.5, type: 'triangle', volume: 0.04, slideTo: 660 });
  }
  updateCombatHudIdentity();
}

function updateRouteB4Obsidian() {
  if (selectedMap === 'sorcererLibrary') selectedMap = 'arcaneLibrary';
  if (!player1.obsidianBuffed) {
    player1.obsidianBuffed = true;
    player1.setMaxHealth(190);
    player1.health = player1.maxHealth;
    player1.moveSpeed *= 1.15;
    updateHealthBars();
  }
  if (!player1.obsidian) {
    player1.obsidian = true;
    setObsidianControl(true);
  }
  // they take turns: OBSIDIAN most of the time, Fire Master breaking through for a moment
  routeB4.swapTimer = (routeB4.swapTimer || 540) - 1;
  if (routeB4.swapTimer <= 0) {
    const toObsidian = player1.obsidianControl === false;
    setObsidianControl(toObsidian);
    routeB4.swapTimer = toObsidian ? 600 + Math.floor(Math.random() * 300) : 200;
  }
  if (routeB4.swapFx > 0) routeB4.swapFx -= 1;
}

function drawObsidianDetails(fighter) {
  if (!fighter.obsidian || fighter.obsidianControl === false) return;
  const time = performance.now() / 1000;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const width = fighter.width;
  const flameX = x + width / 2;
  const flameY = y + 42;
  ctx.save();
  // an aura of black fire
  for (let ember = 0; ember < 8; ember += 1) {
    const rise = (time * 50 + ember * 17) % 60;
    ctx.fillStyle = ember % 2 ? `rgba(255, 61, 0, ${0.8 - rise / 80})` : `rgba(10, 0, 0, ${0.8 - rise / 80})`;
    ctx.fillRect(x + ((ember * 23) % width), y - rise + 10, 4, 4);
  }
  // the obsidian symbol: a glossy black flame with molten cracks
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(flameX - 16, flameY - 22, 32, 44);
  ctx.fillStyle = '#0b0b0f';
  ctx.beginPath();
  ctx.moveTo(flameX, flameY - 20);
  ctx.quadraticCurveTo(flameX + 14, flameY - 2, flameX + 9, flameY + 16);
  ctx.lineTo(flameX - 9, flameY + 16);
  ctx.quadraticCurveTo(flameX - 14, flameY - 2, flameX, flameY - 20);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 87, 34, ${0.7 + Math.sin(time * 6) * 0.3})`;
  ctx.shadowColor = '#ff3d00';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(flameX, flameY - 14);
  ctx.lineTo(flameX - 3, flameY - 2);
  ctx.lineTo(flameX + 3, flameY + 4);
  ctx.lineTo(flameX - 1, flameY + 14);
  ctx.moveTo(flameX - 3, flameY - 2);
  ctx.lineTo(flameX - 8, flameY + 6);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(flameX - 5, flameY - 10, 2, 8);
  // eyes: two orange slits
  ctx.fillStyle = '#ff6d00';
  ctx.fillRect(x + 12, y + 14, 10, 3);
  ctx.fillRect(x + width - 22, y + 14, 10, 3);
  ctx.restore();
}

// Sorcerer in the back of the library, searching his books while the minions fight
function drawRouteB4LibraryWatcher() {
  const minionFight = selectedNormalArcadeLevel === 4 || (selectedNormalArcadeLevel === 5 && player2.secretVariant === 'arcaneMinion');
  if (!(normalArcadeActive && arcadeChapter === 'reflecterB' && minionFight) || arcadeCutscene.active || gameOver) return;
  if (!routeB4Sorcerer) {
    routeB4Sorcerer = new Fighter({ x: 0, y: 0, color: '#6a1b9a', attacksToTheRight: false });
    routeB4Sorcerer.setCharacterType('sorcerer');
  }
  const time = performance.now() / 1000;
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.translate(500, ground - 230);
  ctx.scale(0.6, 0.6);
  routeB4Sorcerer.position = { x: 0, y: 0 };
  routeB4Sorcerer.attacksToTheRight = false;
  routeB4Sorcerer.isAttacking = false;
  routeB4Sorcerer.draw();
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(-22, 54 + Math.sin(time * 3) * 2, 20, 16);
  ctx.restore();
  // his shield of light
  ctx.strokeStyle = `rgba(179, 136, 255, ${0.4 + Math.sin(time * 3) * 0.15})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(518, ground - 194, 52, 0, Math.PI * 2);
  ctx.stroke();
  if (routeB4.swapFx > 0) {
    ctx.fillStyle = player1.obsidianControl === false ? `rgba(255, 255, 255, ${routeB4.swapFx / 60})` : `rgba(0, 0, 0, ${routeB4.swapFx / 45})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// a little magic minion: a robed spirit with a glowing sphere for a head
function drawArcaneMinion(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const color = fighter.minionColor || '#8e24aa';
  const time = performance.now() / 1000;
  const bob = Math.sin(time * 4 + x * 0.01) * 4;
  ctx.save();
  // the robe, floating
  ctx.fillStyle = '#2a1745';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.2, y + h * 0.35 + bob);
  ctx.lineTo(x + w * 0.8, y + h * 0.35 + bob);
  ctx.lineTo(x + w, y + h - 6);
  for (let tooth = 4; tooth >= 0; tooth -= 1) ctx.lineTo(x + (w / 4) * tooth, y + h - (tooth % 2 ? 0 : 12) - 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  // the sphere head
  const headX = x + w / 2;
  const headY = y + h * 0.22 + bob;
  const glow = ctx.createRadialGradient(headX, headY, 2, headX, headY, 26);
  glow.addColorStop(0, '#fff');
  glow.addColorStop(0.35, color);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(headX - 26, headY - 26, 52, 52);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(headX, headY, 14, 0, Math.PI * 2);
  ctx.fill();
  const dir = fighter.attacksToTheRight ? 1 : -1;
  ctx.fillStyle = '#fff';
  ctx.fillRect(headX - 7 + dir * 3, headY - 3, 4, 4);
  ctx.fillRect(headX + 3 + dir * 3, headY - 3, 4, 4);
  // a little pointed hat
  ctx.fillStyle = '#2a1745';
  ctx.beginPath();
  ctx.moveTo(headX - 14, headY - 10);
  ctx.lineTo(headX + 2, headY - 36);
  ctx.lineTo(headX + 14, headY - 10);
  ctx.closePath();
  ctx.fill();
  if (fighter.isAttacking && (fighter === player1 || fighter === player2)) {
    ctx.fillStyle = `${color}88`;
    const area = fighter.attackArea;
    ctx.fillRect(area.x, area.y, area.width, area.height);
  }
  ctx.restore();
}

// ---------- OBSIDIAN's Flametomb: no silence, no tower. All of its little flames hunt the target down ----------
const obsidianTombCooldown = 540;
const obsidianTombFlames = 16;
const obsidianTombFlameDamage = 13;
const obsidianTombRefusals = ['(NO! Eso no se lo doy!)', '(No... no voy a usar eso. Nunca mas.)', '(Ese fuego es SUYO, no mio!)'];
let obsidianTomb = null;
let obsidianTombSounds = [];

function handleObsidianTomb(caster, target) {
  if (gameOver || !gameStarted || arcadeCutscene.active || flametomb.active || obsidianTomb || !canFighterAct(caster) || caster.gamblerStunTimer > 0) return true;
  if (typeof routeB5 !== 'undefined' && routeB5.stage === 'clash') return true;
  if (caster.obsidianControl === false) {
    // Fire Master holds it back
    showFlametombThought(caster, obsidianTombRefusals[Math.floor(Math.random() * obsidianTombRefusals.length)]);
    playTone({ frequency: 90, duration: 0.5, type: 'sine', volume: 0.06, slideTo: 60 });
    return true;
  }
  if (caster.obsidianTombCooldown > 0) return true;
  caster.obsidianTombCooldown = getDebugCooldown(obsidianTombCooldown, caster);
  caster.velocity.x = 0;
  const cx = getFighterCenterX(caster);
  const cy = caster.position.y + caster.height / 2;
  obsidianTomb = {
    caster,
    target,
    t: 0,
    flames: Array.from({ length: obsidianTombFlames }, (_, index) => ({
      angle: (index / obsidianTombFlames) * Math.PI * 2,
      x: cx,
      y: cy,
      born: index * 1.2,
      speed: 0.9 + Math.random() * 0.5,
      hunt: 26 + index * 0.6,
      dive: 70 + index * 1.4,
      done: false,
    })),
    booms: [],
  };
  recordSpecialUsed(caster);
  playObsidianTombSound();
  playNoise({ duration: 0.5, volume: 0.09, filterFrequency: 500 });
  return true;
}

// Snowgrave's sound, straight from its loud part (second 4), louder, over the music
function playObsidianTombSound() {
  stopObsidianTombSounds();
  if (typeof Audio === 'undefined') return;
  const volume = Math.max(0, Math.min(1, 2 * audioSettings.master * audioSettings.sfx));
  // four copies at once: much louder
  obsidianTombSounds = [0, 1, 2, 3].map(() => {
    const sound = new Audio(flametombSoundSource);
    sound.volume = volume;
    const skip = () => {
      try {
        if (sound.currentTime < 3.9) sound.currentTime = 4;
      } catch (error) {
        // it plays from the start if it cannot seek
      }
    };
    try {
      sound.currentTime = 4;
    } catch (error) {
      // seek once the metadata is in
    }
    sound.addEventListener('loadedmetadata', skip);
    const playPromise = sound.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});
    return sound;
  });
}

function stopObsidianTombSounds() {
  obsidianTombSounds.forEach((sound) => sound.pause());
  obsidianTombSounds = [];
}

function updateObsidianTomb() {
  const tomb = obsidianTomb;
  if (!tomb) {
    if (obsidianTombSounds.length && gameOver) stopObsidianTombSounds();
    return;
  }
  if (gameOver || tomb.caster.health <= 0) {
    endObsidianTomb();
    return;
  }
  tomb.t += 1;
  const { caster, target } = tomb;
  const t = tomb.t;
  const cx = getFighterCenterX(caster);
  const cy = caster.position.y + caster.height / 2;
  const tx = getFighterCenterX(target);
  const ty = target.position.y + target.height / 2;
  if (t < 20) caster.velocity.x = 0;
  // once they reach it, the target is surrounded and cannot get away
  const holding = tomb.flames.some((flame) => !flame.done && t >= flame.hunt + 14);
  if (holding) {
    target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 3);
    target.velocity.x = 0;
  }
  tomb.flames.forEach((flame, index) => {
    if (flame.done || t < flame.born) return;
    flame.angle += 0.09 * flame.speed;
    let goalX;
    let goalY;
    let pull;
    if (t < flame.hunt) {
      // 1) they burst out of him and circle him
      goalX = cx + Math.cos(flame.angle) * 75;
      goalY = cy + Math.sin(flame.angle) * 60;
      pull = 0.25;
    } else if (t < flame.dive) {
      // 2) they rush to the target and circle it, closer and closer
      const radius = Math.max(55, 120 - (t - flame.hunt) * 1.2);
      goalX = tx + Math.cos(flame.angle * 1.4) * radius;
      goalY = ty + Math.sin(flame.angle * 1.4) * radius * 0.8;
      pull = t < flame.hunt + 14 ? 0.12 : 0.3;
    } else {
      // 3) one by one, they crash into it
      goalX = tx;
      goalY = ty;
      pull = 0.35;
    }
    flame.x += (goalX - flame.x) * pull;
    flame.y = Math.min(ground - 26, flame.y + (goalY - flame.y) * pull);
    if (t >= flame.dive && Math.hypot(tx - flame.x, ty - flame.y) < 30) {
      flame.done = true;
      tomb.booms.push({ x: flame.x, y: flame.y, life: 22 });
      // (Sorcerer's shield takes most of it)
      applyDamage(caster, target, isRouteB5Boss(target) || isRouteB6Boss(target) ? 6 : obsidianTombFlameDamage, { isSpecial: true, ignoreInvincible: true });
      // (if it falls, the rest of the flames burst where they are: they don't chase the next one)
      if (target.health <= 0) {
        tomb.flames.forEach((other) => {
          if (other.done) return;
          other.done = true;
          tomb.booms.push({ x: other.x, y: other.y, life: 22 });
        });
      }
      const last = tomb.flames.every((other) => other.done);
      if (last) target.velocity.y = -10;
      updateHealthBars();
      playNoise({ duration: last ? 0.8 : 0.18, volume: last ? 0.12 : 0.05, filterFrequency: last ? 900 : 1600 + index * 80 });
      if (last) {
        playSound('robotHit');
        playTone({ frequency: 50, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
        tomb.booms.push({ x: tx, y: ty, life: 40, big: true });
      }
    }
  });
  tomb.booms.forEach((boom) => {
    boom.life -= 1;
  });
  tomb.booms = tomb.booms.filter((boom) => boom.life > 0);
  // the sound fades out after the last explosion
  if (tomb.flames.every((flame) => flame.done)) {
    tomb.after = (tomb.after || 0) + 1;
    obsidianTombSounds.forEach((sound) => {
      sound.volume = Math.max(0, sound.volume - 0.02);
    });
    if (tomb.after > 60) endObsidianTomb();
  }
  if (t > 260) endObsidianTomb();
}

function endObsidianTomb() {
  obsidianTomb = null;
  stopObsidianTombSounds();
}

function drawObsidianTomb() {
  const tomb = obsidianTomb;
  if (!tomb) return;
  const time = performance.now() / 1000;
  ctx.save();
  // the burst around Obsidian as the flames come out
  if (tomb.t < 20) {
    const cx = getFighterCenterX(tomb.caster);
    const cy = tomb.caster.position.y + tomb.caster.height / 2;
    const burst = ctx.createRadialGradient(cx, cy, 4, cx, cy, 40 + tomb.t * 5);
    burst.addColorStop(0, `rgba(0, 0, 0, ${0.7 - tomb.t / 30})`);
    burst.addColorStop(0.6, `rgba(255, 61, 0, ${0.45 - tomb.t / 45})`);
    burst.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = burst;
    ctx.fillRect(cx - 180, cy - 180, 360, 360);
  }
  // the little flames: black at the heart
  tomb.flames.forEach((flame, index) => {
    if (flame.done || tomb.t < flame.born) return;
    const grow = Math.min(1, (tomb.t - flame.born) / 8);
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(flame.x, flame.y, 2, flame.x, flame.y, 44 * grow + 1);
    glow.addColorStop(0, 'rgba(255, 109, 0, 0.75)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(flame.x - 44, flame.y - 44, 88, 88);
    drawFlametombFlame(flame.x, flame.y + 12, 24 * grow, time * 14 + index, 'outer');
    ctx.globalCompositeOperation = 'source-over';
    drawFlametombFlame(flame.x, flame.y + 14, 11 * grow, time * 16 + index, 'core');
  });
  // the explosions where they hit
  tomb.booms.forEach((boom) => {
    const max = boom.big ? 40 : 22;
    const k = 1 - boom.life / max;
    const radius = (boom.big ? 60 : 24) + k * (boom.big ? 190 : 60);
    ctx.globalCompositeOperation = 'lighter';
    const blast = ctx.createRadialGradient(boom.x, boom.y, 2, boom.x, boom.y, radius);
    blast.addColorStop(0, `rgba(255, 213, 79, ${1 - k})`);
    blast.addColorStop(0.45, `rgba(255, 61, 0, ${0.85 * (1 - k)})`);
    blast.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = blast;
    ctx.fillRect(boom.x - radius, boom.y - radius, radius * 2, radius * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.8 * (1 - k)})`;
    ctx.lineWidth = boom.big ? 6 : 2;
    ctx.beginPath();
    ctx.arc(boom.x, boom.y, radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

// ================= 4B, LEVEL 5: INK AND FIRE. The last guardians... and then Sorcerer himself =================
reflecterBattleTrackSources.rouxlsExt = encodeURI('assetsaudio/Rouxls Kaard (Extended edition) - Deltarune.mp3');
reflecterBattleTrackVolumes.rouxlsExt = 0.55;
const routeB5BossHealth = 700;
const routeB5Phase2Ratio = 0.6;
const routeB5ClashRatio = 0.25;
const routeB5 = { stage: 'minions', t: 0, runes: [], orbs: [], sphereTimer: 0, runeTimer: 0, banner: null, storm: 0, lightning: 0, clash: null, clashRetry: 0, wonTimer: 0, thoughtTimer: 0, keysDown: {} };
const routeB5MinionColors = ['#e53935', '#1e88e5', '#8e24aa'];
const routeB5SorcererThoughts = ['Lo siento, Fire Master!', 'No me voy a rendir!', 'Volve, Fire Master! VOLVE!', 'Cada pagina que quemes... la vuelvo a escribir!', 'Aguanta un poco mas ahi adentro!'];

function isRouteB5Fight() {
  return normalArcadeActive && arcadeChapter === 'reflecterB' && selectedNormalArcadeLevel === 5;
}

function isRouteB5Boss(fighter) {
  return Boolean(isRouteB5Fight() && fighter === player2 && fighter.characterType === 'sorcerer' && !fighter.secretVariant);
}

function resetRouteB5() {
  Object.assign(routeB5, { stage: 'minions', t: 0, runes: [], orbs: [], sphereTimer: 0, runeTimer: 120, banner: null, storm: 0, lightning: 0, clash: null, clashBoom: null, clashRetry: 0, clashLost: false, wonTimer: 0, thoughtTimer: 400, keysDown: {}, spheresOut: false });
}

// OBSIDIAN, with total control this time
function makeRouteB5Obsidian(fighter) {
  fighter.obsidian = true;
  fighter.obsidianControl = true;
  fighter.obsidianBuffed = true;
  fighter.setMaxHealth(220);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 2;
  fighter.moveSpeed = playerMoveSpeed * 1.15;
}

function configureRouteB5Boss() {
  // Sorcerer, at full power: no more hiding behind his spheres
  player2.setCharacterType('sorcerer');
  player2.secretVariant = null;
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.setMaxHealth(routeB5BossHealth);
  player2.health = player2.maxHealth;
  player2.damageMultiplier = 1.3;
  player2.moveSpeed *= 1.15;
  routeB5.stage = 'bossIntroPending';
  updateHealthBars();
  updateCombatHudIdentity();
}

function routeB5DamageFloor(target) {
  if (!isRouteB5Boss(target)) return;
  const floors = { phase1: routeB5Phase2Ratio, phase2: routeB5ClashRatio };
  if (floors[routeB5.stage]) target.health = Math.max(target.health, Math.ceil(target.maxHealth * floors[routeB5.stage]));
  else if (routeB5.stage !== 'done') target.health = Math.max(target.health, 1);
}

function showRouteB5Banner(text, sub, color = '#b388ff') {
  routeB5.banner = { text, sub, color, t: 0 };
}

// every story scene of this level: the same dialog engine as the intros, without the versus screen (unless asked)
function startRouteB5Scene(lines, extra = {}) {
  const sorcerer = player2.characterType === 'sorcerer' && !player2.secretVariant;
  ch6CutsceneBase('originsIntro', lines, 'dialog', {
    gamblerX: Math.max(60, Math.min(canvas.width - 300, player1.position.x)),
    gamblerTargetX: Math.max(60, Math.min(canvas.width - 300, player1.position.x)),
    scammerX: sorcerer ? Math.max(player1.position.x + 220, Math.min(canvas.width - 140, player2.position.x)) : 700,
    scammerTargetX: sorcerer ? Math.max(player1.position.x + 220, Math.min(canvas.width - 140, player2.position.x)) : 700,
    scammerY: 0,
    routeB3: true,
    finale: true,
    noVersus: true,
    fmShown: true,
    hideEnemy: false,
    puffs: [],
    lastFlagLine: -1,
    gamblerActor: null,
    actorX: 900,
    actorFacesLeft: true,
    laterFade: 0,
    hit: 0,
    powerGlow: 0,
    flash: 0,
    flashColor: '255, 255, 255',
    iceFx: [],
    runeFx: [],
    sealGlow: 0,
    fireHand: 0,
    midFight: true,
    ...extra,
  });
  startCutsceneLine(0);
}

const routeB5IntroLines = [
  { speaker: 'origNarrator', text: 'La biblioteca de Sorcerer. Tres esferas siguen en pie.' },
  { speaker: 'sorcerer', text: 'Pagina 410... 411... no. No, no, NO. Esto tampoco sirve!' },
  { speaker: 'obsidian', text: '...Tres juguetes mas.' },
  { speaker: 'obsidian', text: '...Y despues, el escritor.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'sorcerer', text: 'Aguanten, esferas! Solo un poco mas! Lo tengo casi...!', emote: { who: 'scammer', symbol: '!' } },
];

function startRouteB5Intro() {
  const sorcerer = new Fighter({ x: 900, y: 0, color: '#6a1b9a', attacksToTheRight: false });
  sorcerer.setCharacterType('sorcerer');
  player1.position.x = 230;
  startRouteB5Scene(routeB5IntroLines, { midFight: false, gamblerX: 230, gamblerTargetX: 230, scammerX: 640, scammerTargetX: 640, gamblerActor: sorcerer, actorX: 880 });
}

const routeB5BossLines = [
  { speaker: 'sorcerer', text: '...' },
  { speaker: 'sorcerer', text: '...No esta. El contrahechizo no esta en NINGUN libro.', book: true },
  { speaker: 'sorcerer', text: 'Años escribiendo. Miles de paginas. Y la unica que importa... nunca la escribi.', book: true },
  { speaker: 'obsidian', text: '...Se te acabaron las esferas, escritor.' },
  { speaker: 'sorcerer', text: 'Si. Se me acabaron.', bookClose: true },
  { speaker: 'sorcerer', text: 'Asi que voy a hacer lo que tendria que haber hecho desde el principio.', power: true },
  { speaker: 'sorcerer', text: 'Fire Master. Si me escuchas ahi adentro... perdoname por lo que voy a hacer.', power: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...Por fin.' },
];

const routeB5Phase2Lines = [
  { speaker: 'sorcerer', text: 'Fire Master! Se que estas ahi! RESPONDEME!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...No esta. Solo quede yo.' },
  { speaker: 'obsidian', text: '...Y vos. Por poco tiempo.' },
  { speaker: 'sorcerer', text: '...Entonces voy a pelear con TODO lo que tengo.', power: true, storm: true },
  { speaker: 'sorcerer', text: 'ESFERAS... VUELVAN A MI!', power: true, storm: true, spheres: true },
];

const routeB5ClashLines = [
  { speaker: 'sorcerer', text: '(*jadea*)... Ya entendi. No esta en los libros porque... todavia no existe.', storm: true },
  { speaker: 'sorcerer', text: 'El contrahechizo lo voy a escribir YO. Aca. AHORA.', power: true, storm: true },
  { speaker: 'obsidian', text: '...Entonces lo quemo antes de que termines la primera linea.', storm: true, fireHand: true },
  { speaker: 'sorcerer', text: 'Intentalo.', power: true, storm: true, fireHand: true },
];

const routeB5EndLines = [
  { speaker: 'sorcerer', text: '...', hybridDown: true },
  { speaker: 'obsidian', text: '...Fin de la historia, escritor.', hybridDown: true, walk: true },
  { speaker: 'obsidian', text: '...', hybridDown: true, fireHand: true },
  { speaker: 'sorcerer', text: '...No. Todavia... me queda... una linea.', hybridDown: true, fireHand: true, quill: true },
  { speaker: 'sorcerer', text: '"...Y el fuego que aprendio a pensar... DORMIRA."', hybridDown: true, seal: true },
  { speaker: 'obsidian', text: '...Que... hiciste...', hybridDown: true, flicker: true },
  { speaker: 'fireMaster', text: '...Sorcerer? Estoy... estoy aca. Lo siento adentro. Dormido. Pero sigue ahi.', hybridDown: true, fmBack: true },
  { speaker: 'sorcerer', text: 'Un sello. Lo escribi a medias, con la poca tinta que me quedaba... No va a durar para siempre.', hybridDown: true },
  { speaker: 'fireMaster', text: 'Cuanto?', hybridDown: true },
  { speaker: 'sorcerer', text: 'No lo se. Por eso vamos a terminar de escribirlo. Juntos.', hybridDown: true },
  { speaker: 'obsidian', text: '(...Esto no termino, escritor.)', hybridDown: true, whisper: true },
  { speaker: 'origNarrator', text: 'Continuara...', hybridDown: true, later: true },
];

function updateRouteB5Scene(cutscene, line, firstFrame) {
  if (cutscene.sixth) updateRouteB6Scene(cutscene, line, firstFrame);
  cutscene.powerGlow += ((line.power ? 1 : 0) - cutscene.powerGlow) * 0.06;
  if (line.power && firstFrame) {
    playTone({ frequency: 196, duration: 1.4, type: 'triangle', volume: 0.05, slideTo: 392 });
    playTone({ frequency: 294, duration: 1.4, type: 'sine', volume: 0.03, slideTo: 588 });
  }
  if (line.bookClose && firstFrame) {
    playNoise({ duration: 0.25, volume: 0.1, filterFrequency: 700 });
    cutscene.flash = 0.25;
  }
  if (line.storm) routeB5.storm = Math.min(1, routeB5.storm + 0.02);
  if (line.spheres && firstFrame) {
    routeB5.spheresOut = true;
    cutscene.flash = 0.6;
    cutscene.flashColor = '179, 136, 255';
    playSound('sorcererSecretLaunch');
  }
  cutscene.reading = Boolean(line.book);
  // the black fire in his hand
  cutscene.fireHand += ((line.fireHand ? 1 : 0) - cutscene.fireHand) * 0.08;
  if (line.fireHand && firstFrame) playTone({ frequency: 70, duration: 1.2, type: 'sawtooth', volume: 0.05, slideTo: 50 });
  if (line.walk) cutscene.gamblerTargetX = Math.max(cutscene.gamblerX, cutscene.scammerX - 150);
  // Fire Master fights back from the inside: ice climbs his arm
  if (line.ice) {
    if (cutscene.frame % 3 === 0) {
      cutscene.iceFx.push({ x: cutscene.gamblerX + 10 + Math.random() * (player1.width - 20), y: ground - player1.height + Math.random() * player1.height, vx: (Math.random() - 0.5) * 3, vy: -1 - Math.random() * 2, life: 40 });
    }
    if (firstFrame) playTone({ frequency: 1320, duration: 0.6, type: 'sine', volume: 0.04, slideTo: 990 });
  }
  if (line.flicker) player1.obsidianControl = Math.floor(cutscene.frame / 6) % 3 !== 0;
  // the last line of the counterspell: runes rise from Sorcerer to Obsidian
  if (line.quill) {
    if (cutscene.frame % 4 === 0) {
      cutscene.runeFx.push({ x: cutscene.scammerX + 40, y: ground - 20, tx: cutscene.gamblerX + player1.width / 2, ty: ground - player1.height + 45, k: 0 });
    }
    if (firstFrame) playTone({ frequency: 523, duration: 1.6, type: 'triangle', volume: 0.04, slideTo: 784 });
  }
  cutscene.runeFx.forEach((rune) => {
    rune.k = Math.min(1, rune.k + 0.025);
  });
  cutscene.runeFx = cutscene.runeFx.filter((rune) => rune.k < 1);
  if (line.seal && firstFrame) {
    cutscene.sealGlow = 1;
    cutscene.fireHand = 0;
    cutscene.flash = 0.8;
    cutscene.flashColor = '206, 147, 216';
    playTone({ frequency: 392, duration: 2, type: 'sine', volume: 0.06, slideTo: 196 });
    playTone({ frequency: 60, duration: 1.6, type: 'sawtooth', volume: 0.06, slideTo: 40 });
    playNoise({ duration: 0.8, volume: 0.07, filterFrequency: 2000 });
  }
  if (cutscene.sealGlow > 0.35) cutscene.sealGlow = Math.max(0.35, cutscene.sealGlow - 0.01);
  if (line.whisper) {
    // for a moment, the black symbol shows through the seal
    player1.obsidianControl = Math.floor(cutscene.frame / 10) % 4 === 0;
    if (firstFrame) playTone({ frequency: 55, duration: 1.4, type: 'sawtooth', volume: 0.05, slideTo: 40 });
  } else if (cutscene.sealGlow > 0 && !line.flicker && !line.seal) {
    player1.obsidianControl = false;
  }
  if (line.fmBack && firstFrame) {
    player1.obsidianControl = false;
    player1.damageMultiplier = 1.25;
    cutscene.flash = 1;
    cutscene.flashColor = '179, 229, 252';
    cutscene.fireHand = 0;
    playTone({ frequency: 440, duration: 1.2, type: 'triangle', volume: 0.06, slideTo: 880 });
    playNoise({ duration: 0.6, volume: 0.07, filterFrequency: 5000 });
  }
  cutscene.iceFx.forEach((ice) => {
    ice.x += ice.vx;
    ice.y += ice.vy;
    ice.life -= 1;
  });
  cutscene.iceFx = cutscene.iceFx.filter((ice) => ice.life > 0);
  if (cutscene.flash > 0) cutscene.flash = Math.max(0, cutscene.flash - 0.03);
}

function drawRouteB5SceneFx(cutscene) {
  if (cutscene.sixth) drawRouteB6SceneFx(cutscene);
  const time = performance.now() / 1000;
  drawRouteB5Storm();
  // Sorcerer's power: a violet aura and runes rising around him
  if (cutscene.powerGlow > 0.02 && !cutscene.hideEnemy) {
    const centerX = player2.position.x + player2.width / 2;
    const centerY = player2.position.y + player2.height / 2;
    const aura = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 110);
    aura.addColorStop(0, `rgba(179, 136, 255, ${0.45 * cutscene.powerGlow})`);
    aura.addColorStop(1, 'rgba(179, 136, 255, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(centerX - 110, centerY - 110, 220, 220);
    ctx.fillStyle = `rgba(234, 128, 252, ${cutscene.powerGlow})`;
    for (let rune = 0; rune < 8; rune += 1) {
      const rise = (time * 60 + rune * 23) % 120;
      ctx.fillRect(centerX - 50 + ((rune * 37) % 100), centerY + 60 - rise, 5, 5);
    }
  }
  if (routeB5.spheresOut && !cutscene.hideEnemy) drawRouteB5Spheres();
  if (cutscene.reading && !cutscene.hideEnemy) {
    const bookX = player2.position.x - 10;
    const bookY = ground - 70;
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(bookX - 2, bookY - 2, 40, 22);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(bookX, bookY, 17, 18);
    ctx.fillRect(bookX + 19, bookY, 17, 18);
  }
  // the black fire in Obsidian's raised hand
  if (cutscene.fireHand > 0.02) {
    const handX = player1.position.x + player1.width + 6;
    const handY = player1.position.y + 30;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(handX, handY, 2, handX, handY, 50 * cutscene.fireHand);
    glow.addColorStop(0, 'rgba(255, 109, 0, 0.8)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(handX - 50, handY - 50, 100, 100);
    drawFlametombFlame(handX, handY + 10, 22 * cutscene.fireHand, time * 14, 'outer');
    ctx.globalCompositeOperation = 'source-over';
    drawFlametombFlame(handX, handY + 12, 11 * cutscene.fireHand, time * 16, 'core');
    ctx.restore();
  }
  // the runes of the seal, flying to him... and the seal itself, on his chest
  cutscene.runeFx.forEach((rune) => {
    const x = rune.x + (rune.tx - rune.x) * rune.k;
    const y = rune.y + (rune.ty - rune.y) * rune.k - Math.sin(rune.k * Math.PI) * 60;
    ctx.fillStyle = `rgba(234, 128, 252, ${1 - rune.k * 0.5})`;
    ctx.fillRect(x - 3, y - 3, 6, 6);
  });
  if (cutscene.sealGlow > 0) {
    const sealX = player1.position.x + player1.width / 2;
    const sealY = player1.position.y + 42;
    ctx.save();
    ctx.strokeStyle = `rgba(206, 147, 216, ${cutscene.sealGlow})`;
    ctx.shadowColor = '#ea80fc';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.translate(sealX, sealY);
    ctx.rotate(time * 0.8);
    ctx.strokeRect(-14, -14, 28, 28);
    // (half written: a gap in the circle)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0.2, 1.1);
    ctx.stroke();
    ctx.restore();
  }
  cutscene.iceFx.forEach((ice) => {
    ctx.fillStyle = `rgba(179, 229, 252, ${ice.life / 40})`;
    ctx.fillRect(ice.x, ice.y, 4, 4);
  });
  if (cutscene.flash > 0) {
    ctx.fillStyle = `rgba(${cutscene.flashColor}, ${cutscene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- the fight itself ----------
function routeB5KeyPressed(key) {
  const down = Boolean(keys[key]);
  const pressed = down && !routeB5.keysDown[key];
  routeB5.keysDown[key] = down;
  return pressed;
}

function updateRouteB5() {
  routeB5.t += 1;
  if (routeB5.banner) {
    routeB5.banner.t += 1;
    if (routeB5.banner.t > 200) routeB5.banner = null;
  }
  if (routeB5.lightning > 0) routeB5.lightning -= 0.05;
  player1.obsidian = true;
  if (routeB5.stage !== 'ending' && routeB5.stage !== 'done') player1.obsidianControl = true;
  // (the story scenes)
  if (routeB5.stage === 'bossIntroPending') {
    routeB5.stage = 'phase1';
    clearRouteB5Arena();
    startRouteB5Scene(routeB5BossLines, { noVersus: false });
    showRouteB5Banner('SORCERER', 'El que escribio el fuego');
    return;
  }
  if (routeB5.stage === 'clashIntro') {
    startRouteB5Clash();
    return;
  }
  if (routeB5.stage === 'ending') {
    routeB5.stage = 'done';
    player2.health = 0;
    updateHealthBars();
    return;
  }
  if (!isRouteB5Boss(player2)) return;
  if (routeB5.stage === 'phase1' && player2.health <= Math.ceil(player2.maxHealth * routeB5Phase2Ratio)) {
    routeB5.stage = 'phase2';
    routeB5.sphereTimer = 120;
    routeB5.storm = 1;
    player2.damageMultiplier = 1.5;
    player2.moveSpeed *= 1.1;
    clearRouteB5Arena();
    startRouteB5Scene(routeB5Phase2Lines);
    showRouteB5Banner('FASE 2', 'TINTA SIN FIN');
    return;
  }
  if (routeB5.stage === 'phase2' && !routeB5.clashLost && player2.health <= Math.ceil(player2.maxHealth * routeB5ClashRatio)) {
    routeB5.stage = 'clashIntro';
    clearRouteB5Arena();
    startRouteB5Scene(routeB5ClashLines);
    return;
  }
  if (routeB5.stage === 'clash') {
    updateRouteB5Clash();
    return;
  }
  if (routeB5.stage === 'won') {
    routeB5.wonTimer += 1;
    player2.gamblerStunTimer = Math.max(player2.gamblerStunTimer, 3);
    player1.gamblerStunTimer = Math.max(player1.gamblerStunTimer, 3);
    if (routeB5.wonTimer === 80) {
      routeB5.stage = 'ending';
      startRouteB5Scene(routeB5EndLines, { gamblerX: 280, gamblerTargetX: 280, scammerX: 600, scammerTargetX: 600 });
    }
    return;
  }
  // a second chance at the clash after losing it
  if (routeB5.clashRetry > 0) {
    routeB5.clashRetry -= 1;
    if (routeB5.clashRetry === 0) startRouteB5Clash();
  }
  // what Sorcerer shouts while he fights
  routeB5.thoughtTimer -= 1;
  if (routeB5.thoughtTimer <= 0) {
    routeB5.thoughtTimer = 600 + Math.floor(Math.random() * 300);
    showFlametombThought(player2, routeB5SorcererThoughts[Math.floor(Math.random() * routeB5SorcererThoughts.length)]);
  }
  updateRouteB5Runes();
  if (routeB5.stage === 'phase2') updateRouteB5Spheres();
  if (routeB5.stage === 'phase2' && Math.random() < 0.004) {
    routeB5.lightning = 1;
    playNoise({ duration: 1.2, volume: 0.06, filterFrequency: 300 });
  }
}

function clearRouteB5Arena() {
  routeB5.runes = [];
  routeB5.orbs = [];
  sorcererOrbs = [];
  sorcererGravityOrbs = [];
  sorcererSecretOrbs = [];
  fireballs = [];
  fireBeams = [];
  miniFlametombs.length = 0;
  if (obsidianTomb) endObsidianTomb();
}

// runes on the floor: they mark where Obsidian stands... and erupt a moment later
function updateRouteB5Runes() {
  routeB5.runeTimer -= 1;
  if (routeB5.runeTimer <= 0) {
    const phase2 = routeB5.stage === 'phase2';
    routeB5.runeTimer = phase2 ? 120 : 210;
    const center = getFighterCenterX(player1);
    const spots = phase2 ? [center, center + (Math.random() < 0.5 ? -1 : 1) * (110 + Math.random() * 60)] : [center];
    spots.forEach((x) => routeB5.runes.push({ x: Math.max(40, Math.min(canvas.width - 40, x)), t: 0 }));
    playTone({ frequency: 660, duration: 0.5, type: 'triangle', volume: 0.04, slideTo: 880 });
  }
  routeB5.runes.forEach((rune) => {
    rune.t += 1;
    if (rune.t === 56) {
      playNoise({ duration: 0.4, volume: 0.07, filterFrequency: 2400 });
      if (Math.abs(getFighterCenterX(player1) - rune.x) < 48) {
        applyDamage(player2, player1, 11, { isSpecial: true });
        player1.velocity.y = -7;
        updateHealthBars();
      }
    }
  });
  routeB5.runes = routeB5.runes.filter((rune) => rune.t < 80);
}

function getRouteB5SpherePoints() {
  const time = performance.now() / 1000;
  const centerX = getFighterCenterX(player2);
  const centerY = player2.position.y + 20;
  return ['#e53935', '#1e88e5', '#8e24aa'].map((color, index) => {
    const angle = time * 2 + (index / 3) * Math.PI * 2;
    return { x: centerX + Math.cos(angle) * 70, y: centerY + Math.sin(angle) * 30 - 30, color };
  });
}

// phase 2: his three spheres orbit him and shoot at Obsidian
function updateRouteB5Spheres() {
  routeB5.sphereTimer -= 1;
  if (routeB5.sphereTimer <= 0) {
    routeB5.sphereTimer = 150;
    getRouteB5SpherePoints().forEach((sphere, index) => {
      setTimeout(() => {
        if (routeB5.stage !== 'phase2' || arcadeCutscene.active) return;
        const targetX = getFighterCenterX(player1);
        const targetY = player1.position.y + player1.height / 2;
        const distance = Math.max(1, Math.hypot(targetX - sphere.x, targetY - sphere.y));
        routeB5.orbs.push({ x: sphere.x, y: sphere.y, vx: ((targetX - sphere.x) / distance) * 6, vy: ((targetY - sphere.y) / distance) * 6, color: sphere.color, life: 200 });
        playTone({ frequency: 520 + index * 110, duration: 0.2, type: 'sine', volume: 0.04, slideTo: 300 });
      }, index * 220);
    });
  }
  routeB5.orbs.forEach((orb) => {
    orb.x += orb.vx;
    orb.y += orb.vy;
    orb.life -= 1;
    const centerX = getFighterCenterX(player1);
    if (Math.abs(orb.x - centerX) < 26 && orb.y > player1.position.y && orb.y < player1.position.y + player1.height) {
      orb.life = 0;
      applyDamage(player2, player1, 7, { isSpecial: true });
      updateHealthBars();
      playSound('robotHit');
    }
  });
  routeB5.orbs = routeB5.orbs.filter((orb) => orb.life > 0 && orb.x > -40 && orb.x < canvas.width + 40 && orb.y < ground + 20);
}

// ---------- the clash: the counterspell against the black fire ----------
function startRouteB5Clash() {
  routeB5.stage = 'clash';
  clearRouteB5Arena();
  player1.position.x = 170;
  player2.position.x = canvas.width - 230;
  [player1, player2].forEach((fighter) => {
    fighter.position.y = ground - fighter.height;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.isAttacking = false;
  });
  player1.attacksToTheRight = true;
  player2.attacksToTheRight = false;
  routeB5.clash = { p: 0.5, t: 0, presses: 0, sparks: [] };
  routeB5.keysDown = { r: Boolean(keys.r), s: Boolean(keys.s), q: Boolean(keys.q), f: Boolean(keys.f) };
  showRouteB5Banner('MACHACA R!', 'Empuja el fuego negro contra el contrahechizo', '#ff6d00');
  playNoise({ duration: 1, volume: 0.1, filterFrequency: 500 });
}

function updateRouteB5Clash() {
  const clash = routeB5.clash;
  clash.t += 1;
  [player1, player2].forEach((fighter) => {
    fighter.gamblerStunTimer = Math.max(fighter.gamblerStunTimer, 3);
    fighter.velocity.x = 0;
  });
  // Sorcerer pushes harder and harder; every press pushes back
  const push = 0.0022 + Math.min(0.0026, clash.t * 0.000004);
  clash.p -= push;
  ['r', 's', 'q', 'f'].forEach((key) => {
    if (routeB5KeyPressed(key)) {
      clash.p += 0.024;
      clash.presses += 1;
      if (clash.presses % 3 === 0) playTone({ frequency: 90 + clash.p * 120, duration: 0.1, type: 'sawtooth', volume: 0.04 });
    }
  });
  clash.p = Math.max(0, Math.min(1, clash.p));
  if (clash.t % 8 === 0) playNoise({ duration: 0.15, volume: 0.03, filterFrequency: 900 + clash.p * 900 });
  const point = getRouteB5ClashPoint();
  for (let spark = 0; spark < 3; spark += 1) {
    clash.sparks.push({ x: point.x, y: point.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 24, color: Math.random() < 0.5 ? '#ff6d00' : '#e1bee7' });
  }
  clash.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.life -= 1;
  });
  clash.sparks = clash.sparks.filter((spark) => spark.life > 0);
  if (clash.p >= 1) {
    // the black fire swallows the counterspell
    routeB5.stage = 'won';
    routeB5.wonTimer = 0;
    routeB5.lightning = 1;
    player2.health = 1;
    player2.velocity.y = -10;
    routeB5.clashBoom = { x: getFighterCenterX(player2), y: player2.position.y + player2.height / 2, t: 0 };
    updateHealthBars();
    playSound('robotHit');
    playNoise({ duration: 1.6, volume: 0.15, filterFrequency: 700 });
    playTone({ frequency: 45, duration: 2.4, type: 'sawtooth', volume: 0.09, slideTo: 25 });
    routeB5.clash = null;
  } else if (clash.p <= 0) {
    // the counterspell wins this time: Obsidian is thrown back
    routeB5.stage = 'phase2';
    routeB5.clash = null;
    routeB5.clashLost = true;
    routeB5.clashRetry = 300;
    routeB5.lightning = 0.8;
    player1.health = Math.max(0, player1.health - 45);
    player1.velocity.y = -9;
    player1.position.x = 60;
    updateHealthBars();
    playTone({ frequency: 880, duration: 0.8, type: 'triangle', volume: 0.06, slideTo: 440 });
    playNoise({ duration: 0.8, volume: 0.09, filterFrequency: 3000 });
    showFlametombThought(player2, 'Todavia no termine de escribirlo...!');
    showRouteB5Banner('EL CONTRAHECHIZO GANA', 'Va a intentarlo otra vez...', '#e1bee7');
  }
}

function getRouteB5ClashPoint() {
  const fromX = player1.position.x + player1.width + 10;
  const toX = player2.position.x - 10;
  const p = routeB5.clash ? routeB5.clash.p : 0.5;
  return { x: fromX + (toX - fromX) * p, y: ground - 70 };
}

// ---------- drawing ----------
function drawRouteB5Storm() {
  if (routeB5.storm <= 0 && routeB5.lightning <= 0) return;
  const time = performance.now() / 1000;
  ctx.save();
  ctx.fillStyle = `rgba(74, 20, 140, ${routeB5.storm * (0.12 + Math.sin(time * 2) * 0.05)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // loose pages flying in circles
  for (let page = 0; page < Math.round(routeB5.storm * 18); page += 1) {
    const angle = time * (0.6 + (page % 3) * 0.2) + page * 1.7;
    const x = canvas.width / 2 + Math.cos(angle) * (300 + (page % 4) * 60);
    const y = 220 + Math.sin(angle * 1.3) * 140;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * 2);
    ctx.fillStyle = 'rgba(239, 230, 207, 0.6)';
    ctx.fillRect(-5, -7, 10, 14);
    ctx.restore();
  }
  if (routeB5.lightning > 0) {
    ctx.fillStyle = `rgba(225, 190, 255, ${routeB5.lightning * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

function drawRouteB5Spheres() {
  const time = performance.now() / 1000;
  getRouteB5SpherePoints().forEach((sphere) => {
    const glow = ctx.createRadialGradient(sphere.x, sphere.y, 2, sphere.x, sphere.y, 28);
    glow.addColorStop(0, sphere.color);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sphere.x - 28, sphere.y - 28, 56, 56);
    ctx.fillStyle = sphere.color;
    ctx.beginPath();
    ctx.arc(sphere.x, sphere.y, 8 + Math.sin(time * 6) * 1, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawRouteB5Fx() {
  if (!isRouteB5Fight() || arcadeCutscene.active) return;
  const time = performance.now() / 1000;
  drawRouteB5Storm();
  ctx.save();
  // the runes: a warning on the floor, then a pillar of light
  routeB5.runes.forEach((rune) => {
    if (rune.t < 56) {
      const k = rune.t / 56;
      ctx.save();
      ctx.translate(rune.x, ground - 3);
      ctx.scale(1, 0.28);
      ctx.strokeStyle = `rgba(234, 128, 252, ${0.4 + k * 0.6})`;
      ctx.shadowColor = '#ea80fc';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2 * k);
      ctx.stroke();
      ctx.rotate(time * 3);
      ctx.strokeRect(-22, -22, 44, 44);
      ctx.restore();
    } else {
      const k = 1 - (rune.t - 56) / 24;
      const beam = ctx.createLinearGradient(rune.x - 40, 0, rune.x + 40, 0);
      beam.addColorStop(0, 'rgba(179, 136, 255, 0)');
      beam.addColorStop(0.5, `rgba(255, 255, 255, ${k})`);
      beam.addColorStop(1, 'rgba(179, 136, 255, 0)');
      ctx.fillStyle = beam;
      ctx.fillRect(rune.x - 40, 0, 80, ground);
    }
  });
  // the spheres and their shots
  if (routeB5.stage === 'phase2' && isRouteB5Boss(player2)) drawRouteB5Spheres();
  routeB5.orbs.forEach((orb) => {
    const glow = ctx.createRadialGradient(orb.x, orb.y, 2, orb.x, orb.y, 20);
    glow.addColorStop(0, '#fff');
    glow.addColorStop(0.4, orb.color);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(orb.x - 20, orb.y - 20, 40, 40);
  });
  // the clash
  const clash = routeB5.clash;
  if (clash) {
    const point = getRouteB5ClashPoint();
    const wobble = Math.sin(time * 40) * 4;
    const fromX = player1.position.x + player1.width;
    const toX = player2.position.x;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Obsidian's black fire
    ctx.fillStyle = '#ff3d00';
    ctx.fillRect(fromX, point.y - 26 - wobble, point.x - fromX, 52 + wobble * 2);
    ctx.fillStyle = '#0b0b0f';
    ctx.fillRect(fromX, point.y - 14, point.x - fromX, 28);
    // Sorcerer's counterspell: white ink and violet light, with letters running through it
    ctx.fillStyle = '#b388ff';
    ctx.fillRect(point.x, point.y - 26 + wobble, toX - point.x, 52 - wobble * 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(point.x, point.y - 12, toX - point.x, 24);
    ctx.fillStyle = '#4a148c';
    ctx.font = '900 14px Courier New, monospace';
    for (let letter = 0; letter < 12; letter += 1) {
      const letterX = toX - ((time * 220 + letter * 47) % Math.max(1, toX - point.x));
      if (letterX > point.x) ctx.fillText('ᚠᚱᛟᛊᛏᛁᚾ'.charAt(letter % 7), letterX, point.y + 5);
    }
    const burst = ctx.createRadialGradient(point.x, point.y, 4, point.x, point.y, 80);
    burst.addColorStop(0, 'rgba(255, 255, 255, 1)');
    burst.addColorStop(0.4, 'rgba(255, 145, 0, 0.7)');
    burst.addColorStop(1, 'rgba(179, 136, 255, 0)');
    ctx.fillStyle = burst;
    ctx.fillRect(point.x - 80, point.y - 80, 160, 160);
    clash.sparks.forEach((spark) => {
      ctx.fillStyle = spark.color;
      ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
    });
    // the bar: who is winning
    const barX = canvas.width / 2 - 220;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(barX - 4, 96, 448, 26);
    ctx.fillStyle = '#ff3d00';
    ctx.fillRect(barX, 100, 440 * clash.p, 18);
    ctx.fillStyle = '#b388ff';
    ctx.fillRect(barX + 440 * clash.p, 100, 440 * (1 - clash.p), 18);
    ctx.fillStyle = '#fff';
    ctx.fillRect(barX + 220 - 1, 96, 2, 26);
    if (Math.floor(time * 6) % 2 === 0) {
      ctx.font = '900 30px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#ff6d00';
      ctx.strokeText('MACHACA  R !', canvas.width / 2, 160);
      ctx.fillText('MACHACA  R !', canvas.width / 2, 160);
      ctx.textAlign = 'left';
    }
  }
  // the counterspell burning away
  if (routeB5.clashBoom) {
    const boom = routeB5.clashBoom;
    boom.t += 1;
    const k = boom.t / 60;
    if (k < 1) {
      ctx.globalCompositeOperation = 'lighter';
      const blast = ctx.createRadialGradient(boom.x, boom.y, 4, boom.x, boom.y, 60 + k * 260);
      blast.addColorStop(0, `rgba(255, 213, 79, ${1 - k})`);
      blast.addColorStop(0.5, `rgba(255, 61, 0, ${0.8 * (1 - k)})`);
      blast.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = blast;
      ctx.fillRect(boom.x - 330, boom.y - 330, 660, 660);
      ctx.globalCompositeOperation = 'source-over';
    } else {
      routeB5.clashBoom = null;
    }
  }
  // the banner
  const banner = routeB5.banner;
  if (banner) {
    const alpha = Math.min(1, banner.t / 15, (200 - banner.t) / 30);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 186, canvas.width, 74);
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    ctx.font = '900 34px Courier New, monospace';
    ctx.fillStyle = banner.color;
    ctx.strokeText(banner.text, canvas.width / 2, 222);
    ctx.fillText(banner.text, canvas.width / 2, 222);
    ctx.font = '900 15px Courier New, monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(banner.sub, canvas.width / 2, 248);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ================= 4B, LEVEL 6: DID YOU THINK IT WOULD ALL END WELL? The library burns =================
reflecterBattleTrackSources.rouxlsRemix = encodeURI('assetsaudio/Rouxls Kaard (Battle Theme Remix) - Deltarune OST (REUPLOAD).mp3');
reflecterBattleTrackVolumes.rouxlsRemix = 0.55;
const routeB6BossHealth = 800;
const routeB6BoxFloors = [0.8, 0.6, 0.4];
const routeB6 = { stage: 'boxes', boxIndex: 0, boxTimer: 0, spellTimer: 0, spellIndex: 0, spell: null, burn: 0, debris: [], banner: null, thoughtTimer: 0, destroyed: 0, ash: 0, silent: false, fadeMusic: false, ketchup: [], puddles: [], stains: 0, lastHealth: 0, shieldTimer: 0, chronoActor: null };
const routeB6SorcererThoughts = ['(Mis libros... no. Concentrate.)', 'No me voy a rendir!', '(Me tiemblan las piernas... aguanta.)', 'Fire Master! Segui peleando ahi adentro!', '(Cuarenta años de libros... ardiendo.)'];

function isRouteB6Fight() {
  return normalArcadeActive && arcadeChapter === 'reflecterB' && selectedNormalArcadeLevel === 6;
}

function isRouteB6Boss(fighter) {
  return Boolean(isRouteB6Fight() && fighter === player2 && fighter.characterType === 'sorcerer' && !fighter.secretVariant);
}

function resetRouteB6() {
  Object.assign(routeB6, { stage: 'boxes', boxIndex: 0, boxTimer: 300, spellTimer: 200, spellIndex: 0, spell: null, burn: 1, debris: [], banner: null, thoughtTimer: 500, destroyed: 1, ash: 0, silent: false, fadeMusic: false, ketchup: [], puddles: [], stains: 0, lastHealth: 0, shieldTimer: 0 });
  lightClashMusicFade = 1;
  routeB6.chronoGone = false;
}

function configureRouteB6Boss() {
  player2.setCharacterType('sorcerer');
  player2.secretVariant = null;
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.setMaxHealth(routeB6BossHealth);
  player2.health = player2.maxHealth;
  player2.damageMultiplier = 1.2;
  updateHealthBars();
  updateCombatHudIdentity();
}

function routeB6DamageFloor(target) {
  if (!isRouteB6Boss(target)) return;
  if (routeB6.stage === 'ashes') routeB6AshHit(target);
  if (routeB6.stage === 'boxes') target.health = Math.max(target.health, Math.ceil(target.maxHealth * routeB6BoxFloors[Math.min(2, routeB6.boxIndex)]));
  else if (routeB6.stage !== 'done') target.health = Math.max(target.health, 1);
}

// ---------- the story scenes ----------
const routeB6IntroLines = [
  { speaker: 'origNarrator', text: 'Un rato despues. La biblioteca, en silencio.', calm: true },
  { speaker: 'sorcerer', text: 'Te hice te. Con miel. Dicen que ayuda con... bueno, con lo que sea que tengas adentro.', calm: true },
  { speaker: 'fireMaster', text: 'Gracias, Sorcerer. Por todo. De verdad.', calm: true },
  { speaker: 'fireMaster', text: '...Sorcerer. El sello. Esta... caliente.', calm: true, sealCrack: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'sorcerer', text: 'No. No, no, no, todavia no! Lo escribi hace una hora!', calm: true, sealCrack: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...', sealBreak: true },
  { speaker: 'obsidian', text: '......', release: true },
  { speaker: 'obsidian', text: '...Creiste que todo iba a terminar bien?' },
  { speaker: 'sorcerer', text: 'Mis libros... MI BIBLIOTECA!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'obsidian', text: '...Papel. Tinta. Todo arde igual.' },
  { speaker: 'sorcerer', text: '(No me quedan fuerzas. Ni tinta. ...Pero no me voy a rendir. No con el ahi adentro.)', power: true },
];

const routeB6SpellLines = [
  { speaker: 'sorcerer', text: '(*jadea*)... Ya no quedan esferas. Ni guardianes.' },
  { speaker: 'sorcerer', text: '...Pero me queda el libro. El MIO. El que escribi para todos ustedes.', book: true },
  { speaker: 'sorcerer', text: '"Ideas para improvisar". Pagina uno: "Atraer y quemar".', book: true, power: true },
  { speaker: 'obsidian', text: '...Tus trucos de martes.' },
  { speaker: 'sorcerer', text: 'Mis trucos de martes te van a doler igual.', power: true, emote: { who: 'scammer', symbol: '!' } },
];

const routeB6EndLines = [
  { speaker: 'sorcerer', text: '...', hybridDown: true },
  { speaker: 'obsidian', text: '...Sin esferas. Sin guardianes. Sin tinta.', hybridDown: true, walk: true },
  { speaker: 'obsidian', text: '...Sin final feliz.', hybridDown: true, fireHand: true },
  { speaker: 'sorcerer', text: '...Me quede sin tinta, si. Pero no sin amigos.', hybridDown: true, fireHand: true },
  { speaker: 'chrono', text: 'SORCERER! AGARRATE!', hybridDown: true, portal: true, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...El reloj.', hybridDown: true, portal: true },
  { speaker: 'chrono', text: 'Te lo dije, Fire Master: NO uses ese fuego cerca mio! ...Y vos, Sorcerer, me debes una MUY grande.', noEnemy: true, portal: true, rescue: true },
  { speaker: 'obsidian', text: '...', noEnemy: true, portalClose: true },
  { speaker: 'obsidian', text: '...Corran. Escondanse en el tiempo, si quieren.', noEnemy: true },
  { speaker: 'obsidian', text: '...Igual los voy a encontrar.', noEnemy: true },
  { speaker: 'origNarrator', text: 'Continuara...', noEnemy: true, later: true },
];

function startRouteB6Intro() {
  routeB6.burn = 0;
  routeB6.destroyed = 0;
  routeB6.ash = 0;
  player1.obsidianControl = false;
  player1.position.x = 280;
  startRouteB5Scene(routeB6IntroLines, { midFight: false, noVersus: false, sixth: true, gamblerX: 280, gamblerTargetX: 280, scammerX: 620, scammerTargetX: 620, sealGlow: 0.45 });
}

function updateRouteB6Scene(cutscene, line, firstFrame) {
  updateRouteB6SceneExtra(cutscene, line, firstFrame);
  if (line.calm) {
    player1.obsidianControl = false;
    routeB6.burn = 0;
  }
  if (line.sealCrack) {
    cutscene.sealGlow = 0.6 + Math.sin(cutscene.frame / 3) * 0.3;
    cutscene.sealCracked = true;
    if (cutscene.frame % 40 === 0) playTone({ frequency: 70, duration: 0.4, type: 'sawtooth', volume: 0.04, slideTo: 55 });
  }
  if (line.sealBreak && firstFrame) {
    // the seal shatters: black fire everywhere, and the library catches fire
    cutscene.sealGlow = 0;
    cutscene.flash = 1;
    cutscene.flashColor = '0, 0, 0';
    player1.obsidianControl = true;
    for (let shard = 0; shard < 24; shard += 1) {
      const angle = Math.random() * Math.PI * 2;
      cutscene.iceFx.push({ x: player1.position.x + player1.width / 2, y: player1.position.y + 42, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, life: 40 });
    }
    playNoise({ duration: 1.6, volume: 0.14, filterFrequency: 600 });
    playTone({ frequency: 45, duration: 2.6, type: 'sawtooth', volume: 0.09, slideTo: 28 });
  }
  if (!line.calm && !cutscene.ending) routeB6.burn = Math.min(1, routeB6.burn + 0.012);
  // Chrono's portal, next to Sorcerer
  if (line.portal) cutscene.portal = Math.min(1, (cutscene.portal || 0) + 0.04);
  if (line.portal && firstFrame && !cutscene.portalSound) {
    cutscene.portalSound = true;
    [1400, 1000, 700].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.2, type: 'triangle', volume: 0.05, slideTo: frequency * 0.6 }), index * 90));
  }
  if (line.rescue && firstFrame) {
    cutscene.flash = 0.7;
    cutscene.flashColor = '224, 247, 250';
    playNoise({ duration: 0.6, volume: 0.07, filterFrequency: 5000 });
  }
  if (line.portalClose) cutscene.portal = Math.max(0, (cutscene.portal || 0) - 0.03);
  updateRouteB6Debris();
}

function drawRouteB6SceneFx(cutscene) {
  drawRouteB6SceneExtra(cutscene);
  if (cutscene.portal > 0) drawRouteB4Portal(cutscene.scammerX + 60, ground - 80, cutscene.portal);
  // the cracks of the broken seal
  if (cutscene.sealCracked && cutscene.sealGlow > 0) {
    const sealX = player1.position.x + player1.width / 2;
    const sealY = player1.position.y + 42;
    ctx.strokeStyle = `rgba(255, 61, 0, ${cutscene.sealGlow})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sealX - 18, sealY - 14);
    ctx.lineTo(sealX - 4, sealY);
    ctx.lineTo(sealX + 14, sealY - 6);
    ctx.moveTo(sealX - 4, sealY);
    ctx.lineTo(sealX + 2, sealY + 20);
    ctx.stroke();
  }
}

// ---------- the burning library (the arcane map, on fire) ----------
function updateRouteB6Debris() {
  if (routeB6.burn > 0.3 && Math.random() < 0.012 * routeB6.burn) {
    routeB6.debris.push({ x: 60 + Math.random() * (canvas.width - 120), y: -20, vy: 2, spin: Math.random() * 6, w: 40 + Math.random() * 60, life: 300 });
    playNoise({ duration: 0.5, volume: 0.03, filterFrequency: 400 });
  }
  routeB6.debris.forEach((piece) => {
    piece.vy = Math.min(12, piece.vy + 0.35);
    piece.y += piece.vy;
    piece.spin += 0.05;
    if (piece.y > ground - 6) {
      piece.y = ground - 6;
      piece.vy = 0;
      piece.life -= 3;
    }
    piece.life -= 1;
  });
  routeB6.debris = routeB6.debris.filter((piece) => piece.life > 0);
}

function drawBurningLibraryFire() {
  const burn = routeB6.burn;
  if (burn <= 0) return;
  const time = performance.now() / 1000;
  ctx.save();
  // orange light and smoke
  const smoke = ctx.createLinearGradient(0, 0, 0, ground);
  smoke.addColorStop(0, `rgba(20, 8, 4, ${0.75 * burn})`);
  smoke.addColorStop(0.6, `rgba(120, 30, 0, ${0.25 * burn})`);
  smoke.addColorStop(1, `rgba(255, 87, 34, ${0.22 * burn})`);
  ctx.fillStyle = smoke;
  ctx.fillRect(0, 0, canvas.width, ground);
  // the bookshelves on fire
  ctx.globalCompositeOperation = 'lighter';
  [24, 152, 782, 910].forEach((shelfX, shelfIndex) => {
    for (let flame = 0; flame < 6; flame += 1) {
      const flameX = shelfX + 10 + ((flame * 17 + shelfIndex * 7) % 72);
      const flameY = ground - 30 - ((flame * 71 + shelfIndex * 37) % (ground - 170));
      drawFlametombFlame(flameX, flameY, (18 + (flame % 3) * 6) * burn, time * 9 + flame + shelfIndex, 'outer');
    }
  });
  // embers rising
  for (let ember = 0; ember < 40; ember += 1) {
    const rise = (time * 60 + ember * 37) % ground;
    ctx.fillStyle = ember % 3 ? `rgba(255, 145, 0, ${0.8 * burn})` : `rgba(255, 241, 118, ${0.8 * burn})`;
    ctx.fillRect((ember * 97 + Math.sin(time + ember) * 20) % canvas.width, ground - rise, 3, 3);
  }
  ctx.globalCompositeOperation = 'source-over';
  // black fire in some flames: it's HIS fire
  [[300, 0.3], [700, 0.6]].forEach(([fireX, phase]) => {
    drawFlametombFlame(fireX + Math.sin(time + phase) * 10, ground - 6, 22 * burn, time * 11 + phase * 10, 'core');
  });
  // falling burning beams and pages
  routeB6.debris.forEach((piece) => {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.vy > 0 ? piece.spin : 0.1);
    ctx.fillStyle = '#2b140a';
    ctx.fillRect(-piece.w / 2, -6, piece.w, 12);
    ctx.fillStyle = 'rgba(255, 109, 0, 0.8)';
    ctx.fillRect(-piece.w / 2, -6, piece.w, 3);
    ctx.restore();
  });
  ctx.restore();
}

// ---------- the fight ----------
function updateRouteB6() {
  updateRouteB6Debris();
  player1.obsidian = true;
  if (routeB6.stage !== 'ending' && routeB6.stage !== 'done') player1.obsidianControl = true;
  if (routeB6.banner) {
    routeB6.banner.t += 1;
    if (routeB6.banner.t > 200) routeB6.banner = null;
  }
  if (routeB6.stage === 'spellIntro') {
    routeB6.stage = 'spells';
    showRouteB6Banner('EL LIBRO DE HECHIZOS', 'Sorcerer improvisa con lo que escribio');
    return;
  }
  if (routeB6.stage === 'ending') {
    routeB6.stage = 'done';
    player2.health = 0;
    updateHealthBars();
    return;
  }
  if (routeB6.stage === 'clashScene') {
    startRouteB6Ashes();
    return;
  }
  if (routeB6.stage === 'ashes') {
    updateRouteB6Ashes();
    return;
  }
  if (!isRouteB6Boss(player2) || dodgeRound.active) return;
  routeB6.thoughtTimer -= 1;
  if (routeB6.thoughtTimer <= 0) {
    routeB6.thoughtTimer = 650 + Math.floor(Math.random() * 300);
    showFlametombThought(player2, routeB6SorcererThoughts[Math.floor(Math.random() * routeB6SorcererThoughts.length)]);
  }
  if (routeB6.stage === 'boxes') {
    if (routeB6.boxIndex >= 3) {
      // no more guardians: the spell book
      routeB6.stage = 'spellIntro';
      player2.damageMultiplier = 1.4;
      clearRouteB5Arena();
      startRouteB5Scene(routeB6SpellLines, { sixth: true });
      return;
    }
    // if Obsidian is winning, the next guardians come sooner
    if (player2.health <= Math.ceil(player2.maxHealth * routeB6BoxFloors[routeB6.boxIndex]) + 0.5) routeB6.boxTimer = Math.min(routeB6.boxTimer, 40);
    routeB6.boxTimer -= 1;
    if (routeB6.boxTimer <= 0 && canFighterAct(player2) && !obsidianTomb) {
      clearRouteB5Arena();
      if (startDodgeRound(`arcaneBox${routeB6.boxIndex + 1}`, player2, player1)) {
        routeB6.boxIndex += 1;
        routeB6.boxTimer = 700;
      }
    }
    return;
  }
  if (routeB6.stage === 'spells') {
    if (player2.health <= 1) {
      // the last clash: his biggest sphere against the big Flametomb
      routeB6.stage = 'clashScene';
      routeB6.spell = null;
      clearRouteB5Arena();
      startRouteB5Scene(routeB6ClashLines, { sixth: true, gamblerX: 200, gamblerTargetX: 200, scammerX: 680, scammerTargetX: 680 });
      return;
    }
    updateRouteB6Spells();
  }
}

function showRouteB6Banner(text, sub) {
  routeB6.banner = { text, sub, t: 0 };
}

// the three improvised spells of his book, in turns
function updateRouteB6Spells() {
  const spell = routeB6.spell;
  if (!spell) {
    routeB6.spellTimer -= 1;
    if (routeB6.spellTimer > 0) return;
    const type = ['pull', 'blue', 'three'][routeB6.spellIndex % 3];
    routeB6.spellIndex += 1;
    routeB6.spellTimer = 230;
    const towardSorcerer = getFighterCenterX(player2) > getFighterCenterX(player1) ? 1 : -1;
    routeB6.spell = { type, t: 0, x: getFighterCenterX(player1), dir: towardSorcerer, hit: false };
    if (type === 'pull') showFlametombThought(player2, '"Atraer..."');
    if (type === 'blue') showFlametombThought(player2, '...');
    if (type === 'three') showFlametombThought(player2, '"Nunca las tres juntas." ...Perdon, cortinas.');
    playTone({ frequency: 330, duration: 0.6, type: 'triangle', volume: 0.05, slideTo: 660 });
    return;
  }
  spell.t += 1;
  const px = getFighterCenterX(player1);
  if (spell.type === 'pull') {
    // a gravity well where he stood... and then the fire falls on it
    if (spell.t < 80 && canFighterAct(player1)) player1.position.x += Math.sign(spell.x - px) * Math.min(2.4, Math.abs(spell.x - px));
    if (spell.t === 80) {
      showFlametombThought(player2, '"...y QUEMAR!"');
      playNoise({ duration: 0.6, volume: 0.1, filterFrequency: 900 });
      if (Math.abs(px - spell.x) < 62) {
        applyDamage(player2, player1, 16, { isSpecial: true });
        player1.velocity.y = -9;
        updateHealthBars();
      }
    }
    if (spell.t > 110) routeB6.spell = null;
  } else if (spell.type === 'blue') {
    // "the blue one, at the end": it comes from BEHIND, when you think it's over
    if (spell.t === 60) {
      spell.orbX = spell.dir > 0 ? -40 : canvas.width + 40;
      showFlametombThought(player2, '"La azul... al final."');
      playTone({ frequency: 880, duration: 0.5, type: 'sine', volume: 0.05, slideTo: 440 });
    }
    if (spell.t > 60) {
      spell.orbX += spell.dir * 13;
      const orbY = ground - 50;
      if (!spell.hit && Math.abs(spell.orbX - px) < 34 && player1.position.y + player1.height > orbY - 22) {
        spell.hit = true;
        applyDamage(player2, player1, 15, { isSpecial: true });
        player1.velocity.y = -7;
        updateHealthBars();
        playSound('robotHit');
      }
      if (spell.orbX < -80 || spell.orbX > canvas.width + 80) routeB6.spell = null;
    }
  } else if (spell.type === 'three') {
    // all three spheres at once, in a small room: a beam at floor height (jump it!)
    if (spell.t === 70) {
      playNoise({ duration: 1, volume: 0.12, filterFrequency: 1500 });
      playTone({ frequency: 110, duration: 1, type: 'sawtooth', volume: 0.07, slideTo: 60 });
    }
    if (spell.t >= 70 && spell.t < 110 && !spell.hit) {
      const sorcererX = getFighterCenterX(player2);
      const onBeamSide = spell.dir > 0 ? px < sorcererX : px > sorcererX;
      if (onBeamSide && player1.position.y + player1.height > ground - 55) {
        spell.hit = true;
        applyDamage(player2, player1, 20, { isSpecial: true });
        player1.velocity.y = -10;
        updateHealthBars();
      }
    }
    if (spell.t > 120) routeB6.spell = null;
  }
}

function drawRouteB6Fx() {
  if (!isRouteB6Fight() || arcadeCutscene.active || dodgeRound.active) return;
  drawRouteB6AshesFx();
  const time = performance.now() / 1000;
  const spell = routeB6.spell;
  ctx.save();
  if (spell && spell.type === 'pull') {
    const k = Math.min(1, spell.t / 80);
    if (spell.t < 80) {
      // the purple well
      ctx.save();
      ctx.translate(spell.x, ground - 40);
      ctx.rotate(time * 4);
      ctx.strokeStyle = `rgba(171, 71, 188, ${0.5 + k * 0.4})`;
      ctx.lineWidth = 3;
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, 60 - ((spell.t * 1.5 + ring * 20) % 60), 0, Math.PI * 1.5);
        ctx.stroke();
      }
      ctx.restore();
      // the red sphere waiting above
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.arc(spell.x, 60 + k * 20, 10 + k * 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const fade = 1 - (spell.t - 80) / 30;
      const fire = ctx.createLinearGradient(spell.x - 60, 0, spell.x + 60, 0);
      fire.addColorStop(0, 'rgba(229, 57, 53, 0)');
      fire.addColorStop(0.5, `rgba(255, 145, 0, ${fade})`);
      fire.addColorStop(1, 'rgba(229, 57, 53, 0)');
      ctx.fillStyle = fire;
      ctx.fillRect(spell.x - 60, 0, 120, ground);
    }
  }
  if (spell && spell.type === 'blue') {
    if (spell.t <= 60) {
      // a little glint at the edge behind Obsidian
      const edgeX = spell.dir > 0 ? 14 : canvas.width - 14;
      ctx.fillStyle = `rgba(30, 136, 229, ${0.3 + Math.sin(time * 20) * 0.3})`;
      ctx.beginPath();
      ctx.arc(edgeX, ground - 50, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const glow = ctx.createRadialGradient(spell.orbX, ground - 50, 2, spell.orbX, ground - 50, 40);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.35, '#1e88e5');
      glow.addColorStop(1, 'rgba(30, 136, 229, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(spell.orbX - 40, ground - 90, 80, 80);
    }
  }
  if (spell && spell.type === 'three') {
    const sorcererX = getFighterCenterX(player2);
    const sorcererY = player2.position.y + 30;
    const k = Math.min(1, spell.t / 70);
    if (spell.t < 70) {
      ['#e53935', '#1e88e5', '#8e24aa'].forEach((color, index) => {
        const angle = time * 6 + (index / 3) * Math.PI * 2;
        const radius = 80 * (1 - k) + 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sorcererX + Math.cos(angle) * radius, sorcererY - 30 + Math.sin(angle) * radius * 0.5, 9, 0, Math.PI * 2);
        ctx.fill();
      });
      // the warning: the beam's band
      ctx.fillStyle = `rgba(255, 82, 82, ${0.15 + Math.sin(time * 20) * 0.1})`;
      const fromX = spell.dir > 0 ? 0 : sorcererX;
      ctx.fillRect(fromX, ground - 55, spell.dir > 0 ? sorcererX : canvas.width - sorcererX, 50);
    } else if (spell.t < 112) {
      const fade = 1 - (spell.t - 70) / 42;
      const fromX = spell.dir > 0 ? 0 : sorcererX;
      const width = spell.dir > 0 ? sorcererX : canvas.width - sorcererX;
      ['#e53935', '#1e88e5', '#8e24aa'].forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = fade;
        ctx.fillRect(fromX, ground - 55 + index * 16, width, 16);
      });
      ctx.fillStyle = `rgba(255, 255, 255, ${fade * 0.8})`;
      ctx.fillRect(fromX, ground - 36, width, 10);
      ctx.globalAlpha = 1;
    }
  }
  const banner = routeB6.banner;
  if (banner) {
    ctx.globalAlpha = Math.max(0, Math.min(1, banner.t / 15, (200 - banner.t) / 30));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 186, canvas.width, 74);
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    ctx.font = '900 34px Courier New, monospace';
    ctx.fillStyle = '#b388ff';
    ctx.strokeText(banner.text, canvas.width / 2, 222);
    ctx.fillText(banner.text, canvas.width / 2, 222);
    ctx.font = '900 15px Courier New, monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(banner.sub, canvas.width / 2, 248);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ---------- the guardians' BOX ATTACKS: one color, one attack ----------
const arcaneBoxPhaseFrames = 480;
dodgeRoundThemes.arcaneBox1 = {
  title: 'BOX ATTACK!',
  border: ['#e53935', '#1e88e5'],
  phaseFrames: arcaneBoxPhaseFrames,
  helpers: [{ variant: 'arcaneMinion', minionColor: '#e53935', color: '#e53935', x: 90 }, { variant: 'arcaneMinion', minionColor: '#1e88e5', color: '#1e88e5', x: 190 }],
  talk: [
    { speaker: 'sorcerer', text: 'ESFERAS! Una vez mas... por favor!' },
    { speaker: 'obsidian', text: '...Otra vez los juguetes.' },
    { speaker: 'sorcerer', text: 'Roja, azul: denme tiempo!' },
  ],
  phases: [
    { pattern: 'arcRed', caption: 'ESFERA ROJA: LLUVIA DE BRASAS!' },
    { pattern: 'arcBlue', caption: 'ESFERA AZUL: ESQUIRLAS DE HIELO!' },
    { pattern: 'arcRedBlue', caption: 'ROJA Y AZUL: VAPOR HIRVIENDO!' },
  ],
};
dodgeRoundThemes.arcaneBox2 = {
  title: 'BOX ATTACK 2!',
  border: ['#8e24aa', '#ffb300'],
  phaseFrames: arcaneBoxPhaseFrames,
  helpers: [{ variant: 'arcaneMinion', minionColor: '#8e24aa', color: '#8e24aa', x: 90 }, { variant: 'arcaneMinion', minionColor: '#ffb300', color: '#ffb300', x: 190 }],
  talk: [
    { speaker: 'sorcerer', text: 'Violeta! Amarilla! Ustedes tambien!' },
    { speaker: 'obsidian', text: '...Cuantos colores mas, escritor.' },
    { speaker: 'sorcerer', text: 'Los que hagan falta!' },
  ],
  phases: [
    { pattern: 'arcPurple', caption: 'ESFERA VIOLETA: GRAVEDAD!' },
    { pattern: 'arcYellow', caption: 'ESFERA AMARILLA: RAYOS!' },
    { pattern: 'arcPurpleYellow', caption: 'VIOLETA Y AMARILLA: TORMENTA!' },
  ],
};
dodgeRoundThemes.arcaneBox3 = {
  title: 'BOX ATTACK 3!',
  border: ['#43a047', '#00acc1'],
  phaseFrames: arcaneBoxPhaseFrames,
  helpers: [{ variant: 'arcaneMinion', minionColor: '#43a047', color: '#43a047', x: 90 }, { variant: 'arcaneMinion', minionColor: '#00acc1', color: '#00acc1', x: 190 }],
  talk: [
    { speaker: 'sorcerer', text: 'Verde, celeste... son las ultimas. Despues de esto no me queda NADA.' },
    { speaker: 'obsidian', text: '...Entonces apurate.' },
  ],
  phases: [
    { pattern: 'arcGreen', caption: 'ESFERA VERDE: ENREDADERAS!' },
    { pattern: 'arcCyan', caption: 'ESFERA CELESTE: MAREA!' },
    { pattern: 'arcAll', caption: 'LAS SEIS ESFERAS: TODO JUNTO!' },
  ],
};

function spawnArcaneBoxPattern(pattern, t, push, box, soul) {
  if (!pattern.startsWith('arc')) return false;
  const aimed = (x, y, speed, sprite, color, r = 9, extra = {}) => {
    const angle = Math.atan2(soul.y - y, soul.x - x);
    push({ type: 'aimed', sprite, color, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r, ...extra });
  };
  const red = (rate) => {
    // embers raining down, fireballs straight at you... and pillars of fire from the floor
    if (t % rate === 0) push({ type: 'drop', sprite: 'arcEmber', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 16, vy: 4 + Math.random() * 1.6, r: 9, warn: 18 });
    if (t % (rate * 4) === rate * 2) aimed(box.x + Math.random() * box.width, box.y + 8, 5.2, 'arcFireball', '#e53935', 11);
    if (t % (rate * 6) === rate * 3) push({ type: 'beam', sprite: 'arcPillar', orient: 'v', pos: Math.max(box.x + 24, Math.min(box.x + box.width - 24, soul.x + (Math.random() - 0.5) * 40)), size: 44, warn: 34, active: 22, life: 90 });
  };
  const blue = (rate) => {
    // ice shards that bounce around the box, icicles from the sides... and a wall of ice with one gap
    if (t % rate === 0 && dodgeRound.items.filter((item) => item.sprite === 'arcIce').length < 5) {
      const angle = Math.random() * Math.PI * 2;
      push({ type: 'bouncer', sprite: 'arcIce', x: box.x + box.width / 2, y: box.y + 24, vx: Math.cos(angle) * 4.2, vy: Math.abs(Math.sin(angle)) * 4.2 + 1, r: 10, life: 260 });
    }
    if (t % (rate / 2) === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'arcShard', x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: box.y + 16 + Math.random() * (box.height - 32), vx: -side * 6, vy: 0, r: 8 });
    }
    if (t % (rate * 3) === rate * 2) {
      const gapWidth = 84;
      push({ type: 'wall', sprite: 'arcIceWall', gapX: box.x + 16 + Math.random() * (box.width - 32 - gapWidth), gapWidth, y: box.y - 30, vy: 3.2, h: 20, warn: 34 });
    }
  };
  const purple = (rate) => {
    // gravity: the box pulls you toward its center... rings grow from it, and orbs spiral out
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    dodgeRound.soul.x += (center.x - soul.x) * 0.012;
    dodgeRound.soul.y += (center.y - soul.y) * 0.012;
    if (t % rate === 0) {
      // a slow burst of orbs from the center, with a gap to slip through
      const gap = Math.floor(Math.random() * 10);
      for (let shot = 0; shot < 10; shot += 1) {
        if (shot === gap || shot === (gap + 1) % 10) continue;
        const angle = (shot / 10) * Math.PI * 2;
        push({ type: 'aimed', sprite: 'arcOrb', color: '#ab47bc', x: center.x, y: center.y, vx: Math.cos(angle) * 2.4, vy: Math.sin(angle) * 2.4, r: 8 });
      }
    }
    if (t % 9 === 0 && Math.floor(t / rate) % 2 === 1) {
      const angle = t * 0.23;
      push({ type: 'aimed', sprite: 'arcOrb', color: '#8e24aa', x: center.x, y: center.y, vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3, r: 7 });
    }
  };
  const yellow = (rate) => {
    // bolts of lightning (a column, a row... or both at once), and sparks flying off them
    if (t % rate === 0) {
      const step = Math.floor(t / rate);
      const cross = step % 3 === 2;
      const column = () => push({ type: 'beam', sprite: 'arcBolt', orient: 'v', pos: Math.max(box.x + 20, Math.min(box.x + box.width - 20, soul.x)), size: 36, warn: 32, active: 14, life: 80 });
      const row = () => push({ type: 'beam', sprite: 'arcBolt', orient: 'h', pos: Math.max(box.y + 20, Math.min(box.y + box.height - 20, soul.y)), size: 36, warn: 32, active: 14, life: 80 });
      if (cross) {
        column();
        row();
      } else if (step % 2 === 0) column();
      else row();
    }
    if (t % rate === Math.floor(rate / 2)) {
      for (let spark = 0; spark < 3; spark += 1) aimed(box.x + Math.random() * box.width, box.y + 6, 5 + spark * 0.6, 'arcSpark', '#ffb300', 6);
    }
  };
  const green = (rate) => {
    // vines falling as a wall with one gap, vines whipping across a lane... and seeds
    if (t % rate === 0) {
      const gapWidth = 76;
      const gapX = box.x + 16 + Math.random() * (box.width - 32 - gapWidth);
      push({ type: 'wall', sprite: 'arcVine', gapX, gapWidth, y: box.y - 30, vy: 2.8, h: 24, warn: 36 });
    }
    if (t % rate === Math.floor(rate / 2)) {
      const laneHeight = 40;
      const laneY = Math.max(box.y + 8, Math.min(box.y + box.height - 8 - laneHeight, soul.y - laneHeight / 2));
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'arcVineLane', y: laneY, h: laneHeight, warn: 30, dir: -side, x: side < 0 ? box.x - 40 : box.x + box.width + 40, speed: 10 });
    }
    if (t % (rate / 2) === Math.floor(rate / 4)) push({ type: 'drop', sprite: 'arcSeed', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 14, vy: 3.6, r: 8, warn: 14, sway: Math.random() * 6 });
  };
  const cyan = (rate) => {
    // THE TIDE: it hits twice as hard. Waves through the lanes, bubbles, a whirlpool... and the big wave
    if (t % rate === 0) {
      const laneHeight = 44;
      const laneY = box.y + 10 + Math.floor(Math.random() * ((box.height - 20 - laneHeight) / laneHeight + 1)) * laneHeight;
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'arcWave', y: laneY, h: laneHeight, warn: 30, dir: -side, x: side < 0 ? box.x - 40 : box.x + box.width + 40, speed: 12, dmgScale: 2 });
    }
    if (t % (rate * 2) === rate) {
      for (let drop = 0; drop < 6; drop += 1) aimed(box.x + box.width / 2, box.y + 10, 3.6 + drop * 0.25, 'arcBubble', '#00acc1', 7, { dmgScale: 2 });
    }
    if (t % (rate * 4) === rate * 3) {
      const gapWidth = 90;
      push({ type: 'wall', sprite: 'arcTsunami', gapX: box.x + 16 + Math.random() * (box.width - 32 - gapWidth), gapWidth, y: box.y - 40, vy: 3.6, h: 34, warn: 40, dmgScale: 2 });
    }
  };
  if (pattern === 'arcRed') red(14);
  else if (pattern === 'arcBlue') blue(40);
  else if (pattern === 'arcRedBlue') {
    red(22);
    blue(60);
  } else if (pattern === 'arcPurple') {
    purple(70);
    if (t % 50 === 25) aimed(box.x + (Math.random() < 0.5 ? 10 : box.width - 10), box.y + Math.random() * box.height, 4, 'arcOrb', '#8e24aa');
  } else if (pattern === 'arcYellow') yellow(40);
  else if (pattern === 'arcPurpleYellow') {
    purple(90);
    yellow(56);
  } else if (pattern === 'arcGreen') green(80);
  else if (pattern === 'arcCyan') cyan(44);
  else if (pattern === 'arcAll') {
    red(30);
    if (t % 120 === 0) yellow(1);
    if (t % 150 === 75) cyan(1);
    if (t % 100 === 50) purple(1);
    if (t % 160 === 120) green(1);
  }
  return true;
}

function drawArcaneBoxItem(item, box) {
  if (!item.sprite || !item.sprite.startsWith('arc')) return false;
  if (drawArcaneBoxItemExtra(item, box)) return true;
  const time = performance.now() / 1000;
  const orb = (color, r) => {
    const glow = ctx.createRadialGradient(item.x, item.y, 1, item.x, item.y, r + 8);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.4, color);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(item.x - r - 8, item.y - r - 8, (r + 8) * 2, (r + 8) * 2);
  };
  if (item.sprite === 'arcEmber' || item.sprite === 'arcFireball') {
    drawFlametombFlame(item.x, item.y + item.r * 0.6, item.r * 1.1, time * 12 + item.x, 'outer');
    if (item.sprite === 'arcFireball') orb('#e53935', item.r);
    return true;
  }
  if (item.sprite === 'arcIce' || item.sprite === 'arcShard') {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.sprite === 'arcIce' ? time * 4 : Math.atan2(item.vy || 0, item.vx || 1));
    ctx.fillStyle = '#b3e5fc';
    ctx.strokeStyle = '#1e88e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(item.r * 1.4, 0);
    ctx.lineTo(0, -item.r * 0.7);
    ctx.lineTo(-item.r * 1.4, 0);
    ctx.lineTo(0, item.r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return true;
  }
  if (item.sprite === 'arcRing') {
    ctx.strokeStyle = '#2a0838';
    ctx.shadowColor = '#ab47bc';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, item.gap + item.gapSize / 2, item.gap - item.gapSize / 2 + Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#e1bee7';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  if (item.sprite === 'arcOrb' || item.sprite === 'arcBubble') {
    orb(item.color, item.r);
    return true;
  }
  if (item.sprite === 'arcBolt') {
    const fade = Math.min(1, item.active / 6);
    ctx.strokeStyle = `rgba(255, 241, 118, ${fade})`;
    ctx.shadowColor = '#ffb300';
    ctx.shadowBlur = 18;
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let step = 0; step <= 10; step += 1) {
      const jitter = (Math.random() - 0.5) * item.size * 0.7;
      if (item.orient === 'v') {
        const y = box.y + (box.height / 10) * step;
        if (step === 0) ctx.moveTo(item.pos + jitter, y);
        else ctx.lineTo(item.pos + jitter, y);
      } else {
        const x = box.x + (box.width / 10) * step;
        if (step === 0) ctx.moveTo(x, item.pos + jitter);
        else ctx.lineTo(x, item.pos + jitter);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 213, 79, ${0.25 * fade})`;
    if (item.orient === 'v') ctx.fillRect(item.pos - item.size / 2, box.y, item.size, box.height);
    else ctx.fillRect(box.x, item.pos - item.size / 2, box.width, item.size);
    return true;
  }
  if (item.sprite === 'arcVine') {
    ctx.fillStyle = '#2e7d32';
    ctx.strokeStyle = '#a5d6a7';
    ctx.lineWidth = 2;
    [[box.x, item.gapX - box.x], [item.gapX + item.gapWidth, box.x + box.width - item.gapX - item.gapWidth]].forEach(([x, width]) => {
      if (width <= 0) return;
      ctx.fillRect(x, item.y, width, item.h);
      ctx.strokeRect(x, item.y, width, item.h);
      // thorns
      ctx.fillStyle = '#c8e6c9';
      for (let thorn = x + 8; thorn < x + width - 4; thorn += 16) {
        ctx.beginPath();
        ctx.moveTo(thorn - 4, item.y + item.h);
        ctx.lineTo(thorn, item.y + item.h + 7);
        ctx.lineTo(thorn + 4, item.y + item.h);
        ctx.fill();
      }
      ctx.fillStyle = '#2e7d32';
    });
    return true;
  }
  if (item.sprite === 'arcSeed') {
    ctx.fillStyle = '#7cb342';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, item.r * 0.7, item.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#33691e';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  if (item.sprite === 'arcWave') {
    // a wave crossing the lane
    const back = -item.dir;
    ctx.fillStyle = 'rgba(0, 172, 193, 0.85)';
    ctx.beginPath();
    ctx.moveTo(item.x + item.dir * 20, item.y + item.h);
    ctx.quadraticCurveTo(item.x + item.dir * 14, item.y - 4, item.x - item.dir * 10, item.y + 4);
    ctx.lineTo(item.x + back * 160, item.y + item.h * 0.5);
    ctx.lineTo(item.x + back * 160, item.y + item.h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e0f7fa';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  return false;
}

// ---------- level 6: the new box sprites ----------
function drawArcaneBoxItemExtra(item, box) {
  const time = performance.now() / 1000;
  if (item.sprite === 'arcPillar') {
    const fade = Math.min(1, item.active / 6);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 9; flame += 1) {
      const y = box.y + box.height - (flame / 8) * box.height;
      drawFlametombFlame(item.pos + Math.sin(time * 10 + flame) * 5, y, 18 * fade + 4, time * 12 + flame, 'outer');
    }
    ctx.restore();
    return true;
  }
  if (item.sprite === 'arcIceWall' || item.sprite === 'arcTsunami') {
    const ice = item.sprite === 'arcIceWall';
    ctx.fillStyle = ice ? 'rgba(179, 229, 252, 0.9)' : 'rgba(0, 131, 143, 0.92)';
    ctx.strokeStyle = ice ? '#1e88e5' : '#e0f7fa';
    ctx.lineWidth = 2;
    [[box.x, item.gapX - box.x], [item.gapX + item.gapWidth, box.x + box.width - item.gapX - item.gapWidth]].forEach(([x, width]) => {
      if (width <= 0) return;
      ctx.fillRect(x, item.y, width, item.h);
      ctx.strokeRect(x, item.y, width, item.h);
      if (!ice) {
        // foam on the crest of the wave
        ctx.fillStyle = '#e0f7fa';
        for (let foam = x + 6; foam < x + width - 6; foam += 14) {
          ctx.beginPath();
          ctx.arc(foam, item.y + item.h, 5 + Math.sin(time * 8 + foam) * 2, 0, Math.PI);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(0, 131, 143, 0.92)';
      }
    });
    return true;
  }
  if (item.sprite === 'arcSpark') {
    ctx.fillStyle = '#fff59d';
    ctx.shadowColor = '#ffb300';
    ctx.shadowBlur = 10;
    ctx.fillRect(item.x - 4, item.y - 4, 8, 8);
    ctx.shadowBlur = 0;
    return true;
  }
  if (item.sprite === 'arcVineLane') {
    const back = -item.dir;
    const midY = item.y + item.h / 2;
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(item.x + item.dir * 16, midY);
    for (let segment = 1; segment <= 8; segment += 1) ctx.lineTo(item.x + back * segment * 40, midY + Math.sin(segment + dodgeRound.frame / 3) * 8);
    ctx.stroke();
    ctx.fillStyle = '#c8e6c9';
    ctx.beginPath();
    ctx.moveTo(item.x + item.dir * 26, midY);
    ctx.lineTo(item.x, midY - 9);
    ctx.lineTo(item.x, midY + 9);
    ctx.closePath();
    ctx.fill();
    return true;
  }
  if (item.sprite === 'arcWhirl') {
    ctx.strokeStyle = '#006064';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, item.gap + item.gapSize / 2, item.gap - item.gapSize / 2 + Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#e0f7fa';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  return false;
}

// ---------- level 6: the music (it fades with the clash, and then there is only silence) ----------
function getRouteB6TrackKey() {
  return routeB6.silent ? null : 'rouxlsRemix';
}

// ---------- the destroyed library: Obsidian's energy tore it apart (and Chrono watches from the window) ----------
function drawRouteB6Destruction(amount) {
  const time = performance.now() / 1000;
  ctx.save();
  ctx.globalAlpha = amount;
  // the window: the glass broken into a hole
  ctx.fillStyle = '#05030a';
  ctx.beginPath();
  ctx.moveTo(430, 150);
  ctx.lineTo(470, 120);
  ctx.lineTo(520, 165);
  ctx.lineTo(575, 118);
  ctx.lineTo(612, 190);
  ctx.lineTo(590, 260);
  ctx.lineTo(540, 236);
  ctx.lineTo(480, 290);
  ctx.lineTo(440, 240);
  ctx.closePath();
  ctx.fill();
  // scorch marks on the walls
  [[300, 260, 90], [720, 220, 110], [512, 420, 140], [120, 80, 80], [900, 90, 90]].forEach(([x, y, r]) => {
    const scorch = ctx.createRadialGradient(x, y, 4, x, y, r);
    scorch.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    scorch.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = scorch;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  });
  // beams hanging from the broken ceiling
  ctx.strokeStyle = '#1a0d06';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(240, 0);
  ctx.lineTo(330, 110);
  ctx.moveTo(760, 0);
  ctx.lineTo(700, 140);
  ctx.stroke();
  // a bookshelf fallen across the floor, books spilled
  ctx.save();
  ctx.translate(170, ground - 22);
  ctx.rotate(-0.12);
  ctx.fillStyle = '#2a160c';
  ctx.fillRect(0, 0, 180, 26);
  ctx.restore();
  ['#8e24aa', '#3949ab', '#c62828', '#00897b', '#f9a825'].forEach((color, index) => {
    ctx.save();
    ctx.translate(360 + index * 22, ground - 8);
    ctx.rotate(index * 0.7);
    ctx.fillStyle = color;
    ctx.fillRect(-8, -4, 16, 8);
    ctx.restore();
  });
  // rubble and holes in the floor
  ctx.fillStyle = '#2b2236';
  [[600, 26], [840, 34], [90, 22]].forEach(([x, size]) => {
    ctx.beginPath();
    ctx.moveTo(x - size, ground);
    ctx.lineTo(x - size * 0.4, ground - size * 0.8);
    ctx.lineTo(x + size * 0.3, ground - size * 0.5);
    ctx.lineTo(x + size, ground);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#05030a';
  [[470, 70], [760, 50]].forEach(([x, width]) => {
    ctx.beginPath();
    ctx.ellipse(x, ground + 14, width, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawRouteB6Chrono() {
  if (!(routeB6.destroyed > 0.5) || routeB6.chronoGone) return;
  if (!routeB6.chronoActor) {
    routeB6.chronoActor = new Fighter({ x: 0, y: 0, color: '#26c6da', attacksToTheRight: false });
    routeB6.chronoActor.setCharacterType('chrono');
  }
  const time = performance.now() / 1000;
  const chrono = routeB6.chronoActor;
  // he floats outside the broken window, watching... and doesn't come in
  ctx.save();
  if (routeB6.ash > 0) {
    // after the clash: hiding behind the wall, only half of him peeking in... trembling
    ctx.beginPath();
    ctx.rect(392, 60, 240, ground - 210);
    ctx.clip();
    const peek = Math.max(0, Math.sin(time * 0.7)) * 14;
    ctx.globalAlpha = 0.85;
    ctx.translate(612 - peek + (Math.random() - 0.5) * 2.5, 190 + (Math.random() - 0.5) * 2.5);
    ctx.scale(0.55, 0.55);
  } else {
    ctx.globalAlpha = 0.95;
    ctx.translate(548, 130 + Math.sin(time * 1.6) * 6);
    ctx.scale(0.7, 0.7);
  }
  chrono.position = { x: 0, y: 0 };
  chrono.attacksToTheRight = routeB6.ash > 0 ? false : getFighterCenterX(player1) > 560;
  chrono.isAttacking = false;
  chrono.draw();
  ctx.restore();
  if (routeB6.ash > 0) {
    // a drop of sweat... and now and then a scared "!"
    ctx.fillStyle = '#b3e5fc';
    ctx.beginPath();
    ctx.arc(604, 196 + ((time * 30) % 20), 3, 0, Math.PI * 2);
    ctx.fill();
    if (Math.floor(time * 0.8) % 4 === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px Courier New, monospace';
      ctx.fillText('!', 598, 176);
    }
  }
  // the window bars in front of him
  ctx.strokeStyle = '#140a24';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(512, 90);
  ctx.lineTo(512, 140);
  ctx.moveTo(392, 250);
  ctx.lineTo(450, 250);
  ctx.stroke();
}

// everything in ashes: no color, no fire, only grey falling
function drawRouteB6Ashes(amount) {
  const time = performance.now() / 1000;
  ctx.save();
  // burnt to grey: everything under a layer of ash and smoke
  ctx.fillStyle = `rgba(38, 35, 35, ${0.82 * amount})`;
  ctx.fillRect(0, 0, canvas.width, ground + 4);
  const fog = ctx.createLinearGradient(0, ground - 160, 0, ground);
  fog.addColorStop(0, 'rgba(90, 86, 86, 0)');
  fog.addColorStop(1, `rgba(90, 86, 86, ${0.45 * amount})`);
  ctx.fillStyle = fog;
  ctx.fillRect(0, ground - 160, canvas.width, 164);
  for (let flake = 0; flake < 60; flake += 1) {
    const fall = (time * (18 + (flake % 5) * 6) + flake * 41) % ground;
    ctx.fillStyle = `rgba(200, 200, 200, ${0.5 * amount})`;
    ctx.fillRect((flake * 113 + Math.sin(time + flake) * 30) % canvas.width, fall, 3, 3);
  }
  // a few embers still glowing in the ash
  for (let ember = 0; ember < 8; ember += 1) {
    ctx.fillStyle = `rgba(255, 109, 0, ${(0.4 + Math.sin(time * 3 + ember) * 0.3) * amount})`;
    ctx.fillRect((ember * 137) % canvas.width, ground - 4, 4, 3);
  }
  ctx.restore();
}

function drawBurningLibraryStage() {
  drawArcaneLibraryStage();
  if (routeB6.destroyed > 0) drawRouteB6Destruction(routeB6.destroyed);
  if (routeB6.ash > 0) drawRouteB6Ashes(routeB6.ash);
  else drawBurningLibraryFire();
  drawRouteB6Chrono();
}

// ---------- the story scenes of the end ----------
const routeB6ClashLines = [
  { speaker: 'sorcerer', text: '...Una ultima pagina. La ultima que me queda.', power: true },
  { speaker: 'sorcerer', text: 'Si no puedo apagarte... te voy a ENCERRAR en la esfera mas grande que haya escrito!', power: true, rise: true },
  { speaker: 'sorcerer', text: 'ESFERA... PURPURA!!!', power: true, rise: true, sphere: true },
  { speaker: 'obsidian', text: '...Escritor.', rise: true, sphere: true, tower: true },
  { speaker: 'obsidian', text: '...FLAMETOMB.', rise: true, sphere: true, tower: true, clash: true },
  { speaker: 'sorcerer', text: 'AGUANTA... AGUANTA...!', power: true, rise: true, sphere: true, tower: true, clash: true },
  { speaker: 'sorcerer', text: 'N-no... no alcanza... NO ALCANZA!', rise: true, sphere: true, tower: true, clash: true, push: true },
  { speaker: 'obsidian', text: '...', win: true },
  { speaker: 'origNarrator', text: '...', ashes: true, hybridDown: true },
  { speaker: 'sorcerer', text: '...', ashes: true, hybridDown: true },
  { speaker: 'obsidian', text: '...Todavia respiras.', ashes: true, hybridDown: true },
];

const routeB6FinalLines = [
  { speaker: 'sorcerer', text: '...', hybridDown: true, ashes: true },
  { speaker: 'sorcerer', text: 'Fire... Master... si me escuchas ahi adentro...', hybridDown: true, ashes: true },
  { speaker: 'sorcerer', text: '...no fue tu culpa.', hybridDown: true, ashes: true },
  { speaker: 'obsidian', text: '...No te escucha. Ya no.', hybridDown: true, ashes: true },
  { speaker: 'obsidian', text: '...Fin de la historia, escritor.', hybridDown: true, ashes: true, fireHand: true },
  { speaker: 'sorcerer', text: 'N-no... no, no, NO... AAAAAAAAAAAAAAAAH!!!', noEnemy: true, ashes: true, terror: true, tombSound: true },
  { speaker: 'obsidian', text: '...', noEnemy: true, ashes: true, black: true, silence: true },
  { speaker: 'obsidian', text: '...Toma. Te lo devuelvo, Fire Master. Mira lo que hicimos.', noEnemy: true, ashes: true, black: true },
  { speaker: 'fireMaster', text: '...Que... donde estoy...', noEnemy: true, ashes: true, handover: true, remains: true },
  { speaker: 'fireMaster', text: '...Sorcerer?', noEnemy: true, ashes: true, remains: true, spheres: true },
  { speaker: 'fireMaster', text: '...Esas son... sus esferas. Estan grises. Estan... frias.', noEnemy: true, ashes: true, remains: true, heart: true, fmTremble: true },
  { speaker: 'fireMaster', text: '...Y ese es... su sombrero. Todavia esta tibio.', noEnemy: true, ashes: true, remains: true, heart: true, fmTremble: true },
  { speaker: 'obsidian', text: '(...Mira bien. Esto es lo que somos ahora.)', noEnemy: true, ashes: true, remains: true, whisperFlicker: true, fmTremble: true },
  { speaker: 'fireMaster', text: 'No... No, no, no, no, no... SORCERER!!!', noEnemy: true, ashes: true, remains: true, scream: true },
  { speaker: 'fireMaster', text: '...Chrono. CHRONO! Te vi en la ventana! Rebobina el tiempo! POR FAVOR! Una vez, solo UNA VEZ!', noEnemy: true, ashes: true, remains: true, fmTremble: true, plea: true },
  { speaker: 'fireMaster', text: '...', noEnemy: true, ashes: true, remains: true, chronoFlees: true },
  { speaker: 'fireMaster', text: '...Se fue.', noEnemy: true, ashes: true, remains: true },
  { speaker: 'obsidian', text: '(...Nadie va a volver por vos. Ni el reloj. Ni el escritor. Nadie.)', noEnemy: true, ashes: true, remains: true, whisperFlicker: true },
  { speaker: 'obsidian', text: '(...Solo quedamos nosotros. Para siempre.)', noEnemy: true, ashes: true, remains: true, whisperFlicker: true, heart: true },
  { speaker: 'origNarrator', text: '...', noEnemy: true, ashes: true, remains: true, black: true, finalText: true, noBox: true },
];

function updateRouteB6SceneExtra(cutscene, line, firstFrame) {
  // Obsidian lets all of his energy out: the library is torn apart
  if (line.release && firstFrame) {
    cutscene.shock = 1;
    cutscene.shake = 26;
    routeB6.destroyed = 1;
    routeB6.burn = 1;
    playNoise({ duration: 2, volume: 0.16, filterFrequency: 500 });
    playTone({ frequency: 40, duration: 3, type: 'sawtooth', volume: 0.1, slideTo: 25 });
    for (let piece = 0; piece < 8; piece += 1) routeB6.debris.push({ x: 60 + Math.random() * (canvas.width - 120), y: -20 - Math.random() * 200, vy: 2, spin: Math.random() * 6, w: 40 + Math.random() * 60, life: 300 });
  }
  if (cutscene.shock > 0) cutscene.shock = Math.max(0, cutscene.shock - 0.02);
  if (cutscene.shake > 0 && !line.clash) cutscene.shake *= 0.92;
  // Sorcerer rises high above the ashes
  const riseTarget = line.rise ? 230 : 0;
  cutscene.scammerY += (riseTarget - cutscene.scammerY) * 0.05;
  if (line.sphere) cutscene.sphereR = Math.min(95, (cutscene.sphereR || 0) + 1.6);
  if (line.sphere && firstFrame && !cutscene.sphereSound) {
    cutscene.sphereSound = true;
    playSound('sorcererSecretLaunch');
    playTone({ frequency: 220, duration: 2, type: 'triangle', volume: 0.06, slideTo: 440 });
  }
  if (line.tower) cutscene.towerT = (cutscene.towerT || 0) + 1;
  if (line.tower && firstFrame && !cutscene.towerSound) {
    cutscene.towerSound = true;
    playObsidianTombSound();
  }
  // the clash: the meeting point shakes up and down... and the fire wins
  const clashBase = 250;
  if (line.clash) {
    cutscene.clashY = (cutscene.clashY || clashBase) + Math.sin(cutscene.frame / 5) * 1.2;
    if (line.push) cutscene.clashY -= 0.9;
    cutscene.clashY = Math.max(90, Math.min(300, cutscene.clashY));
    cutscene.shake = 6 + (line.push ? 6 : 0);
    if (cutscene.frame % 8 === 0) playNoise({ duration: 0.15, volume: 0.04, filterFrequency: 1200 });
  }
  if (line.win && firstFrame) {
    // the sphere bursts: a white flash, and the music dies away
    cutscene.whiteOut = 1;
    cutscene.sphereR = 0;
    cutscene.towerT = 0;
    cutscene.scammerY = 0;
    cutscene.shake = 30;
    routeB6.ash = 1;
    routeB6.fadeMusic = true;
    playNoise({ duration: 2.5, volume: 0.18, filterFrequency: 800 });
    playTone({ frequency: 55, duration: 3, type: 'sawtooth', volume: 0.1, slideTo: 28 });
  }
  if (routeB6.fadeMusic) {
    lightClashMusicFade = Math.max(0, lightClashMusicFade - 0.006);
    if (lightClashMusicFade <= 0) routeB6.silent = true;
  }
  if (cutscene.whiteOut > 0 && !line.win) cutscene.whiteOut = Math.max(0, cutscene.whiteOut - 0.01);
  if (line.ashes) routeB6.ash = 1;
  // the end: black, the fire one last time... and Fire Master opens his eyes
  cutscene.black = cutscene.black || 0;
  cutscene.black += ((line.black ? 1 : 0) - cutscene.black) * (line.black ? 0.05 : 0.02);
  if (line.tombSound && firstFrame) {
    stopObsidianTombSounds();
    playFlametombSound();
  }
  // THE LAST FLAMETOMB: you see all of it
  if (line.terror) {
    cutscene.terrorT = (cutscene.terrorT || 0) + 1;
    updateRouteB6Terror(cutscene);
  }
  if (cutscene.dust) {
    cutscene.dust.forEach((grain) => {
      grain.y += grain.vy;
      grain.x += Math.sin(grain.y / 12) * 0.6;
      grain.life -= 1;
    });
    cutscene.dust = cutscene.dust.filter((grain) => grain.life > 0);
  }
  // ...and then, nothing: the sound cut off in the middle
  if (line.silence && firstFrame) {
    stopFlametombSound();
    stopObsidianTombSounds();
    cutscene.shake = 0;
  }
  if (line.plea && firstFrame) playTone({ frequency: 330, duration: 0.8, type: 'triangle', volume: 0.04, slideTo: 300 });
  if (line.chronoFlees && firstFrame) {
    routeB6.chronoGone = true;
    cutscene.chronoFlash = 1;
    [700, 1000, 1400].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.15, type: 'triangle', volume: 0.04, slideTo: frequency * 1.4 }), index * 80));
  }
  if (cutscene.chronoFlash > 0) cutscene.chronoFlash = Math.max(0, cutscene.chronoFlash - 0.03);
  // the last Flametomb, in the dark: flashes of what is happening
  if (line.strobe) {
    cutscene.strobe = cutscene.frame % 34 < 3 ? 1 : 0;
    if (cutscene.frame % 34 === 0) playNoise({ duration: 0.12, volume: 0.06, filterFrequency: 700 });
  } else {
    cutscene.strobe = 0;
  }
  // his three spheres roll to Fire Master's feet, grey and cracked
  if (line.spheres || cutscene.spheresIn) {
    cutscene.spheresIn = Math.min(1, (cutscene.spheresIn || 0) + 0.01);
    if (line.spheres && firstFrame) playTone({ frequency: 180, duration: 1.2, type: 'sine', volume: 0.04, slideTo: 120 });
  }
  if (line.heart && cutscene.frame % 60 === 0) {
    playTone({ frequency: 55, duration: 0.16, type: 'sine', volume: 0.12 });
    setTimeout(() => playTone({ frequency: 50, duration: 0.2, type: 'sine', volume: 0.1 }), 230);
  }
  if (cutscene.ending) {
    if (cutscene.fmBaseX === undefined) cutscene.fmBaseX = cutscene.gamblerX;
    cutscene.gamblerX = cutscene.fmBaseX + (line.fmTremble || line.scream ? (Math.random() - 0.5) * (line.scream ? 6 : 3) : 0);
    cutscene.gamblerTargetX = cutscene.gamblerX;
  }
  if (line.whisperFlicker) {
    player1.obsidianControl = cutscene.frame % 40 < 6;
    if (firstFrame) playTone({ frequency: 48, duration: 2, type: 'sawtooth', volume: 0.06, slideTo: 36 });
  } else if (cutscene.lines.slice(0, cutscene.lineIndex + 1).some((other) => other.handover)) {
    player1.obsidianControl = false;
  }
  if (line.scream && firstFrame) {
    cutscene.shake = 30;
    cutscene.redFlash = 1;
    playNoise({ duration: 1.4, volume: 0.12, filterFrequency: 900 });
    playTone({ frequency: 70, duration: 2, type: 'sawtooth', volume: 0.08, slideTo: 40 });
  }
  if (cutscene.redFlash > 0) cutscene.redFlash = Math.max(0, cutscene.redFlash - 0.02);
  if (line.finalText) cutscene.finalTyped = (cutscene.finalTyped || 0) + 0.35;
  if (line.handover && firstFrame) {
    stopFlametombSound();
    player1.obsidianControl = false;
    player1.damageMultiplier = 1.25;
  }
}

function drawRouteB6SceneExtra(cutscene) {
  const time = performance.now() / 1000;
  // the burst of energy when he lets it all out
  if (cutscene.shock > 0) {
    const centerX = player1.position.x + player1.width / 2;
    const centerY = player1.position.y + player1.height / 2;
    const radius = (1 - cutscene.shock) * 900;
    ctx.strokeStyle = `rgba(255, 61, 0, ${cutscene.shock})`;
    ctx.lineWidth = 30 * cutscene.shock + 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.shock * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const clashX = 470;
  const clashY = cutscene.clashY || 250;
  // Obsidian's big Flametomb: a tower of black-hearted fire climbing to the sphere
  if (cutscene.towerT > 0) {
    const grow = Math.min(1, cutscene.towerT / 60);
    const top = ground - (ground - clashY) * grow;
    const height = ground - top;
    ctx.save();
    const glow = ctx.createRadialGradient(clashX, ground - height / 2, 20, clashX, ground - height / 2, height * 0.7 + 30);
    glow.addColorStop(0, 'rgba(255, 61, 0, 0.4)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(clashX - height - 40, top - 60, height * 2 + 80, height + 120);
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 24; flame += 1) {
      const along = flame / 24;
      const y = ground - along * height;
      const sway = Math.sin(time * 6 + flame * 0.7) * (12 + along * 26);
      const size = ((1 - along) * 50 + 24) * 1.4;
      drawFlametombFlame(clashX + sway - 22, y, size, time * 12 + flame, 'outer');
      drawFlametombFlame(clashX - sway + 22, y - 12, size * 0.9, time * 10 + flame * 1.7, 'outer');
    }
    ctx.globalCompositeOperation = 'source-over';
    for (let flame = 0; flame < 24; flame += 2) {
      const along = flame / 24;
      drawFlametombFlame(clashX + Math.sin(time * 6 + flame) * 8, ground - along * height + 6, ((1 - along) * 50 + 24) * 0.6, time * 14 + flame, 'core');
    }
    ctx.restore();
  }
  // Sorcerer's giant purple sphere, pressing down
  if (cutscene.sphereR > 0) {
    const radius = cutscene.sphereR;
    const sphereY = cutscene.towerT > 0 ? clashY - radius * 0.85 : 150;
    const sorcererX = player2.position.x + player2.width / 2;
    const sorcererY = player2.position.y + 20;
    ctx.strokeStyle = 'rgba(234, 128, 252, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sorcererX, sorcererY);
    ctx.lineTo(clashX, sphereY);
    ctx.stroke();
    const sphere = ctx.createRadialGradient(clashX - radius * 0.3, sphereY - radius * 0.3, 4, clashX, sphereY, radius);
    sphere.addColorStop(0, '#f3e5f5');
    sphere.addColorStop(0.35, '#ab47bc');
    sphere.addColorStop(1, '#4a148c');
    ctx.fillStyle = sphere;
    ctx.shadowColor = '#ea80fc';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(clashX, sphereY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // runes running around it
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let rune = 0; rune < 10; rune += 1) {
      const angle = time * 1.5 + (rune / 10) * Math.PI * 2;
      ctx.fillRect(clashX + Math.cos(angle) * radius * 0.8 - 3, sphereY + Math.sin(angle) * radius * 0.8 - 3, 6, 6);
    }
    // where they meet
    if (cutscene.towerT > 40) {
      const burst = ctx.createRadialGradient(clashX, clashY, 4, clashX, clashY, 90);
      burst.addColorStop(0, 'rgba(255, 255, 255, 1)');
      burst.addColorStop(0.4, 'rgba(255, 145, 0, 0.7)');
      burst.addColorStop(1, 'rgba(171, 71, 188, 0)');
      ctx.fillStyle = burst;
      ctx.fillRect(clashX - 90, clashY - 90, 180, 180);
      for (let spark = 0; spark < 10; spark += 1) {
        ctx.fillStyle = spark % 2 ? '#ff6d00' : '#e1bee7';
        ctx.fillRect(clashX + (Math.random() - 0.5) * 160, clashY + (Math.random() - 0.5) * 60, 4, 4);
      }
    }
  }
  // what is left of Sorcerer: his burnt hat, his book... and ash
  if (cutscene.lines[cutscene.lineIndex].remains) {
    const x = cutscene.scammerX + 30;
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.ellipse(x + 30, ground - 3, 46, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2c1f33';
    ctx.beginPath();
    ctx.moveTo(x - 4, ground - 4);
    ctx.lineTo(x + 30, ground - 4);
    ctx.lineTo(x + 18, ground - 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 10, ground - 8, 46, 5);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(x + 48, ground - 10, 26, 8);
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(x + 50, ground - 9, 22, 2);
  }
  if (cutscene.terrorT > 0 && cutscene.lines[cutscene.lineIndex].terror) drawRouteB6Terror(cutscene);
  if (cutscene.dust && cutscene.dust.length) {
    cutscene.dust.forEach((grain) => {
      ctx.fillStyle = `rgba(190, 190, 190, ${grain.life / 120})`;
      ctx.fillRect(grain.x, grain.y, 3, 3);
    });
  }
  if (cutscene.chronoFlash > 0) {
    // a blink of cyan where he was: he's gone
    ctx.fillStyle = `rgba(128, 222, 234, ${cutscene.chronoFlash * 0.6})`;
    ctx.beginPath();
    ctx.arc(612, 220, 40 + (1 - cutscene.chronoFlash) * 60, 0, Math.PI * 2);
    ctx.fill();
  }
  if (cutscene.spheresIn > 0) {
    // the three spheres, grey and cracked, rolled to his feet
    [0, 1, 2].forEach((index) => {
      const fromX = cutscene.scammerX + 40 + index * 20;
      const toX = cutscene.gamblerX + player1.width + 18 + index * 24;
      const x = fromX + (toX - fromX) * cutscene.spheresIn;
      ctx.fillStyle = ['#6d6d6d', '#5f5f5f', '#777777'][index];
      ctx.beginPath();
      ctx.arc(x, ground - 9, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 5, ground - 14);
      ctx.lineTo(x, ground - 9);
      ctx.lineTo(x - 2, ground - 3);
      ctx.stroke();
    });
  }
  if (cutscene.redFlash > 0) {
    ctx.fillStyle = `rgba(183, 28, 28, ${cutscene.redFlash * 0.55})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.whiteOut > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.whiteOut})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.black > 0.01) {
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.black})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // (only the black fire, for a moment, in the dark)
    if (cutscene.lines[cutscene.lineIndex].tombSound) {
      ctx.fillStyle = `rgba(255, 61, 0, ${0.08 + Math.random() * 0.06})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // flashes: Obsidian standing, the tower rising over the one on the floor
    if (cutscene.strobe) {
      ctx.fillStyle = 'rgba(213, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(player1.position.x, player1.position.y, player1.width, player1.height);
      ctx.fillRect(player1.position.x + player1.width, player1.position.y + 20, 30, 10);
      ctx.fillRect(cutscene.scammerX, ground - 26, 120, 26);
      ctx.beginPath();
      ctx.moveTo(cutscene.scammerX - 30, ground);
      ctx.lineTo(cutscene.scammerX + 60, 40);
      ctx.lineTo(cutscene.scammerX + 150, ground);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff6d00';
      ctx.fillRect(player1.position.x + 12, player1.position.y + 14, 10, 3);
      ctx.fillRect(player1.position.x + player1.width - 22, player1.position.y + 14, 10, 3);
    }
    // the question, one last time
    if (cutscene.finalTyped > 0) {
      const text = 'C R E I S T E  Q U E  T O D O  I B A  A  T E R M I N A R  B I E N ?';
      ctx.font = '900 24px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d50000';
      ctx.fillText(text.slice(0, Math.floor(cutscene.finalTyped)), canvas.width / 2 + (Math.random() - 0.5) * 2, canvas.height / 2 + 40);
      ctx.textAlign = 'left';
    }
  }
}

// ---------- the ashes: Sorcerer has nothing left. He tries to defend himself, to run... ----------
const routeB6AshThoughts = ['N-no... por favor...', '(Mis piernas no responden...)', 'Fire Master... si me escuchas...', '(Una esfera... una sola...)', '...'];

function startRouteB6Ashes() {
  routeB6.stage = 'ashes';
  routeB6.ash = 1;
  routeB6.silent = true;
  botEnabled = false;
  player2.health = 160;
  player2.position.x = 640;
  player2.velocity.x = 0;
  routeB6.lastHealth = player2.health;
  routeB6.shieldTimer = 0;
  routeB6.shieldCooldown = 200;
  routeB6.thoughtTimer = 120;
  routeB6.stumble = 0;
  updateHealthBars();
  showFlametombThought(player1, '...Todavia respiras.');
}

function updateRouteB6Ashes() {
  const sorcerer = player2;
  sorcerer.velocity.x = 0;
  const away = getFighterCenterX(sorcerer) >= getFighterCenterX(player1) ? 1 : -1;
  const distance = Math.abs(getFighterCenterX(sorcerer) - getFighterCenterX(player1));
  // he limps away (and stumbles now and then)
  if (routeB6.stumble > 0) routeB6.stumble -= 1;
  else if (distance < 260 && canFighterAct(sorcerer)) {
    sorcerer.position.x = Math.max(16, Math.min(canvas.width - sorcerer.width - 16, sorcerer.position.x + away * 1.7));
    if (Math.random() < 0.006) {
      routeB6.stumble = 50;
      showFlametombThought(sorcerer, '(Mis piernas...)');
    }
  }
  sorcerer.attacksToTheRight = away < 0;
  // a weak shield, now and then
  if (routeB6.shieldTimer > 0) routeB6.shieldTimer -= 1;
  routeB6.shieldCooldown -= 1;
  if (routeB6.shieldCooldown <= 0 && distance < 200) {
    routeB6.shieldTimer = 50;
    routeB6.shieldCooldown = 220 + Math.floor(Math.random() * 120);
    playTone({ frequency: 520, duration: 0.3, type: 'triangle', volume: 0.04, slideTo: 380 });
  }
  routeB6.thoughtTimer -= 1;
  if (routeB6.thoughtTimer <= 0) {
    routeB6.thoughtTimer = 360 + Math.floor(Math.random() * 200);
    showFlametombThought(sorcerer, routeB6AshThoughts[Math.floor(Math.random() * routeB6AshThoughts.length)]);
  }
  routeB6.ketchup.forEach((drop) => {
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vy += 0.4;
    drop.life -= 1;
    if (drop.y > ground - 2) {
      drop.y = ground - 2;
      drop.vx = 0;
      drop.vy = 0;
    }
  });
  routeB6.ketchup = routeB6.ketchup.filter((drop) => drop.life > 0);
  // on the floor at last
  if (sorcerer.health <= 1) {
    routeB6.stage = 'ending';
    routeB6.shieldTimer = 0;
    clearRouteB5Arena();
    startRouteB5Scene(routeB6FinalLines, { sixth: true, ending: true, gamblerX: 300, gamblerTargetX: 300, scammerX: 540, scammerTargetX: 540 });
  }
}

// every hit: his shield takes some of it... and "tomato sauce" everywhere
function routeB6AshHit(target) {
  const damage = routeB6.lastHealth - target.health;
  if (damage <= 0) {
    routeB6.lastHealth = target.health;
    return;
  }
  if (routeB6.shieldTimer > 0) {
    target.health = Math.max(1, routeB6.lastHealth - damage * 0.3);
    routeB6.shieldTimer = 0;
    showFlametombThought(target, '(El escudo... se rompe...)');
    playNoise({ duration: 0.3, volume: 0.07, filterFrequency: 5000 });
  } else {
    const strong = damage >= 12;
    const drops = strong ? 18 : 6;
    for (let drop = 0; drop < drops; drop += 1) {
      routeB6.ketchup.push({ x: getFighterCenterX(target), y: target.position.y + 40, vx: (Math.random() - 0.5) * (strong ? 9 : 5), vy: -2 - Math.random() * (strong ? 7 : 4), life: 400 });
    }
    if (strong) {
      routeB6.stains = Math.min(8, routeB6.stains + 1);
      routeB6.puddles.push({ x: getFighterCenterX(target) + (Math.random() - 0.5) * 30, r: 10 + Math.random() * 10 });
      target.velocity.y = -4;
    }
  }
  routeB6.lastHealth = target.health;
}

function drawRouteB6AshesFx() {
  if (routeB6.stage !== 'ashes' && routeB6.stage !== 'ending') return;
  const sorcerer = player2;
  ctx.save();
  routeB6.puddles.forEach((puddle) => {
    ctx.fillStyle = '#a50f15';
    ctx.beginPath();
    ctx.ellipse(puddle.x, ground + 3, puddle.r * 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  routeB6.ketchup.forEach((drop) => {
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(drop.x - 2.5, drop.y - 2.5, 5, 5);
  });
  if (routeB6.stage === 'ashes') {
    // the stains on him
    [[0.3, 0.3], [0.7, 0.5], [0.45, 0.7], [0.2, 0.55], [0.8, 0.25], [0.5, 0.4], [0.35, 0.85], [0.65, 0.8]].slice(0, routeB6.stains).forEach(([u, v]) => {
      ctx.fillStyle = '#a50f15';
      ctx.beginPath();
      ctx.arc(sorcerer.position.x + sorcerer.width * u, sorcerer.position.y + sorcerer.height * v, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    if (routeB6.shieldTimer > 0) {
      ctx.strokeStyle = `rgba(179, 136, 255, ${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(getFighterCenterX(sorcerer), sorcerer.position.y + sorcerer.height / 2, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

// ---------- the last Flametomb, seen: the tower over the one on the floor ----------
// (it lasts as long as the Flametomb's sound, and a few seconds more)
function getRouteB6TerrorTimes(cutscene) {
  const sound = getFlametombSoundFrames();
  return { sound, crumble: Math.round(sound * 0.82), end: sound + 180 };
}

function updateRouteB6Terror(cutscene) {
  const t = cutscene.terrorT;
  const times = getRouteB6TerrorTimes(cutscene);
  // you can't skip past it with Enter: you have to watch
  cutscene.holdLine = cutscene.lineIndex;
  cutscene.shake = t < times.sound ? Math.min(14, 4 + t * 0.05) : Math.max(0, 14 - (t - times.sound) * 0.15);
  // three screams: the first one tears, the second breaks, the last one is barely a breath
  if (t === 24) playSorcererScream(1, 3.4);
  if (t === Math.round(times.sound * 0.42)) playSorcererScream(0.75, 2.6);
  if (t === Math.round(times.sound * 0.66)) playSorcererScream(0.45, 1.8);
  if (t % 40 === 0 && t < times.sound) playNoise({ duration: 0.4, volume: 0.06, filterFrequency: 400 });
  // what's left of him crumbles into ash
  if (t === times.crumble) {
    rememberFlametombVictim('sorcerer');
    cutscene.dust = cutscene.dust || [];
    for (let grain = 0; grain < 140; grain += 1) {
      cutscene.dust.push({ x: cutscene.scammerX + 60 + (Math.random() - 0.5) * 50, y: ground - Math.random() * 110, vy: -0.4 - Math.random() * 1.4, life: 160 + Math.random() * 80 });
    }
    playNoise({ duration: 1.2, volume: 0.05, filterFrequency: 3000 });
  }
  if (t > times.crumble && t % 4 === 0) {
    cutscene.dust.push({ x: cutscene.scammerX + Math.random() * 120, y: ground - Math.random() * 20, vy: -0.4 - Math.random(), life: 140 });
  }
  if (t >= times.end) {
    cutscene.holdLine = -1;
    cutscene.typed = 999;
    advanceArcadeCutscene();
  }
}

function drawRouteB6Terror(cutscene) {
  const time = performance.now() / 1000;
  const t = cutscene.terrorT;
  const times = getRouteB6TerrorTimes(cutscene);
  const towerX = cutscene.scammerX + 60;
  ctx.save();
  // everything goes dark red, pulsing like a heartbeat
  const pulse = Math.pow(Math.max(0, Math.sin(time * 5)), 6);
  ctx.fillStyle = `rgba(40, 0, 0, ${Math.min(0.75, t / 60)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `rgba(183, 28, 28, ${(0.15 + pulse * 0.25) * (t < times.sound ? 1 : Math.max(0.2, 1 - (t - times.sound) / 120))})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the tower: dirty dark red fire, rising... and dying down when the sound ends
  const grow = Math.min(1, t / 45) * (t < times.sound - 30 ? 1 : Math.max(0, 1 - (t - (times.sound - 30)) / 90));
  const height = grow * (ground + 40);
  if (height > 2) {
    ctx.globalAlpha = 0.9;
    for (let flame = 0; flame < 26; flame += 1) {
      const along = flame / 26;
      const y = ground - along * height;
      const sway = Math.sin(time * 7 + flame * 0.7) * (14 + along * 30);
      const size = ((1 - along) * 56 + 26) * 1.5 * Math.max(0.3, grow);
      drawFlametombFlame(towerX + sway - 24, y, size, time * 13 + flame, 'outer');
      drawFlametombFlame(towerX - sway + 24, y - 12, size * 0.9, time * 11 + flame * 1.7, 'outer');
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(90, 0, 0, ${0.45 * grow})`;
    ctx.fillRect(towerX - 180, 0, 360, ground + 40);
  }
  // HIM, inside the fire: twisting, throwing himself at the edge of the flames to get out... and pulled back
  if (t > 20 && t < times.crumble) {
    const struggle = t < times.crumble * 0.85 ? 1 : Math.max(0, 1 - (t - times.crumble * 0.85) / (times.crumble * 0.15));
    const charred = Math.min(1, t / times.crumble);
    const lungeCycle = (t % 100) / 100;
    const lunge = Math.sin(Math.min(1, lungeCycle * 1.6) * Math.PI) * struggle;
    const sorcerer = player2;
    const saved = { x: sorcerer.position.x, y: sorcerer.position.y, facing: sorcerer.attacksToTheRight, attacking: sorcerer.isAttacking };
    ctx.save();
    ctx.translate(towerX - lunge * 70, ground - 10 - lunge * 40);
    ctx.rotate(Math.sin(time * 13) * 0.32 * struggle - lunge * 0.5 + (1 - struggle) * 1.2);
    ctx.filter = `brightness(${Math.max(0.08, 1 - charred * 0.92)}) saturate(${Math.max(0, 1 - charred)})`;
    sorcerer.position = { x: -sorcerer.width / 2, y: -sorcerer.height };
    sorcerer.attacksToTheRight = false;
    sorcerer.isAttacking = false;
    sorcerer.draw();
    ctx.filter = 'none';
    // his arms, flailing at the fire
    ctx.fillStyle = `rgba(${Math.round(74 * (1 - charred))}, ${Math.round(20 * (1 - charred))}, ${Math.round(140 * (1 - charred))}, 1)`;
    [-1, 1].forEach((side) => {
      ctx.save();
      ctx.translate(side * sorcerer.width * 0.45, -sorcerer.height * 0.62);
      ctx.rotate(side * (0.9 + Math.sin(time * 17 + side) * 0.9 * struggle) - Math.PI);
      ctx.fillRect(-4, 0, 8, 44);
      ctx.fillRect(-7, 40, 14, 10);
      ctx.restore();
    });
    ctx.restore();
    sorcerer.position = { x: saved.x, y: saved.y };
    sorcerer.attacksToTheRight = saved.facing;
    sorcerer.isAttacking = saved.attacking;
    // flames in front of him: he is INSIDE it
    ctx.globalAlpha = 0.7;
    for (let flame = 0; flame < 6; flame += 1) {
      drawFlametombFlame(towerX + (flame - 2.5) * 18, ground - 6 - (flame % 2) * 30, 30 * Math.max(0.4, grow), time * 14 + flame, flame % 2 ? 'core' : 'outer');
    }
    ctx.globalAlpha = 1;
  }
  // Obsidian, watching: only his eyes and the black of him
  const eyeX = player1.position.x;
  const eyeY = player1.position.y;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.fillRect(eyeX, eyeY, player1.width, player1.height);
  ctx.shadowColor = '#ff3d00';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#ff6d00';
  ctx.fillRect(eyeX + 10, eyeY + 13, 14, 4);
  ctx.fillRect(eyeX + player1.width - 24, eyeY + 13, 14, 4);
  ctx.shadowBlur = 0;
  // the picture tears: slices of the screen slip sideways (less and less once the sound is over)
  const tearing = t < times.sound ? 1 : Math.max(0, 1 - (t - times.sound) / 60);
  for (let slice = 0; slice < 4; slice += 1) {
    if (Math.random() > 0.5 * tearing) continue;
    const sliceY = Math.floor(Math.random() * canvas.height);
    const sliceHeight = 6 + Math.floor(Math.random() * 26);
    const shift = (Math.random() - 0.5) * 40;
    try {
      ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceHeight, shift, sliceY, canvas.width, sliceHeight);
    } catch (error) {
      // (no tearing if the canvas can't copy itself)
    }
  }
  // the edges closing in
  const vignette = ctx.createRadialGradient(towerX, ground - 120, 80, towerX, ground - 120, 560);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.6 + pulse * 0.3})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // a word, for a frame, now and then
  if (t < times.sound && Math.random() < 0.05) {
    ctx.font = '900 64px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(['ARDE', 'ARDE', 'TINTA', 'PAPEL'][Math.floor(Math.random() * 4)], canvas.width / 2 + (Math.random() - 0.5) * 300, 200 + Math.random() * 200);
    ctx.textAlign = 'left';
  }
  // after the sound: the darkness comes slowly over everything
  if (t > times.sound) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.85, (t - times.sound) / 180)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

// Sorcerer's scream, made with the audio itself: a voice that climbs, shakes, changes from "A" to "O"... and breaks
function playSorcererScream(strength = 1, duration = 3.2) {
  const audio = ensureAudio();
  if (!audio) return;
  const start = audio.currentTime + 0.02;
  const out = audio.createGain();
  const peak = 0.95 * strength;
  out.gain.setValueAtTime(0.0001, start);
  out.gain.exponentialRampToValueAtTime(peak, start + 0.08);
  out.gain.setValueAtTime(peak, start + duration * 0.55);
  out.gain.exponentialRampToValueAtTime(peak * 0.5, start + duration * 0.8);
  out.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  out.connect(sfxGain || masterGain);
  // trembling in the volume, like sobbing breath
  const tremolo = audio.createOscillator();
  tremolo.frequency.value = 9;
  const tremoloDepth = audio.createGain();
  tremoloDepth.gain.value = 0.18 * strength;
  tremolo.connect(tremoloDepth);
  tremoloDepth.connect(out.gain);
  // the rasp of a torn throat
  const rasp = audio.createWaveShaper();
  const curve = new Float32Array(2048);
  for (let index = 0; index < curve.length; index += 1) {
    const x = (index / (curve.length - 1)) * 2 - 1;
    curve[index] = Math.tanh(x * 7) * 0.9 + Math.sin(x * 9) * 0.1;
  }
  rasp.curve = curve;
  // the vowel: "AAAA" that closes into "OOOO" as it breaks
  [[820, 560, 7, 1], [1230, 880, 9, 0.65], [2700, 2400, 12, 0.35]].forEach(([fromFrequency, toFrequency, q, level]) => {
    const filter = audio.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(fromFrequency, start);
    filter.frequency.setValueAtTime(fromFrequency, start + duration * 0.6);
    filter.frequency.linearRampToValueAtTime(toFrequency, start + duration);
    filter.Q.value = q;
    const gain = audio.createGain();
    gain.gain.value = level;
    rasp.connect(filter);
    filter.connect(gain);
    gain.connect(out);
  });
  // the pitch: low, a jump up, shaking (never steady), cracks... and falls
  const points = 120;
  const contour = new Float32Array(points);
  const base = 230 + (1 - strength) * 40;
  for (let index = 0; index < points; index += 1) {
    const along = index / (points - 1);
    let pitch;
    if (along < 0.08) pitch = base + (base * 2.7 - base) * (along / 0.08);
    else if (along < 0.6) pitch = base * 2.7 + Math.sin(along * 40) * base * 0.08;
    else pitch = base * 2.7 * Math.pow(0.45, (along - 0.6) / 0.4);
    // little voice cracks
    if (Math.random() < 0.06) pitch *= 1.25 + Math.random() * 0.3;
    pitch *= 1 + (Math.random() - 0.5) * 0.04;
    contour[index] = Math.max(60, pitch);
  }
  [0, 9, -7].forEach((detune, voiceIndex) => {
    const voice = audio.createOscillator();
    voice.type = voiceIndex === 2 ? 'square' : 'sawtooth';
    voice.detune.value = detune;
    voice.frequency.setValueCurveAtTime(contour, start, duration);
    const level = audio.createGain();
    level.gain.value = voiceIndex === 2 ? 0.18 : 0.32;
    voice.connect(level);
    level.connect(rasp);
    voice.start(start);
    voice.stop(start + duration + 0.05);
  });
  // a growl underneath (half the pitch)
  const growl = audio.createOscillator();
  growl.type = 'sawtooth';
  growl.frequency.setValueCurveAtTime(contour.map((pitch) => pitch / 2), start, duration);
  const growlGain = audio.createGain();
  growlGain.gain.value = 0.16 * strength;
  growl.connect(growlGain);
  growlGain.connect(rasp);
  growl.start(start);
  growl.stop(start + duration + 0.05);
  tremolo.start(start);
  tremolo.stop(start + duration + 0.05);
  // the breath in it
  const noiseBuffer = audio.createBuffer(1, Math.floor(audio.sampleRate * duration), audio.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const breath = audio.createBufferSource();
  breath.buffer = noiseBuffer;
  const breathFilter = audio.createBiquadFilter();
  breathFilter.type = 'bandpass';
  breathFilter.frequency.value = 2200;
  breathFilter.Q.value = 0.7;
  const breathGain = audio.createGain();
  breathGain.gain.value = 0.22;
  breath.connect(breathFilter);
  breathFilter.connect(breathGain);
  breathGain.connect(out);
  breath.start(start);
}

// ================= "FIRE MASTER SE HIZO MAS FUERTE." =================
// After chapter 2B's Flametomb, every level Fire Master wins ends like this: the sting, the dark... and the words.
const fireStronger = { active: false, done: false, t: 0, snapshot: null, caption: 0 };
const fireStrongerText = 'Fire Master se hizo más fuerte.';

function shouldShowFireStronger() {
  if (!normalArcadeActive || !(player1.health > 0 && player2.health <= 0) || player1.characterType !== 'fireMaster') return false;
  if (arcadeChapter === 'gamblerB' && selectedNormalArcadeLevel <= 4) return true;
  if (arcadeChapter === 'reflecterB' && selectedNormalArcadeLevel <= 2) return true;
  return false;
}

// (finishFight asks first: true means "wait, not yet")
function tryFireStronger() {
  if (fireStronger.active) return true;
  if (fireStronger.done || !shouldShowFireStronger()) return false;
  fireStronger.active = true;
  fireStronger.t = 0;
  const snapshot = document.createElement('canvas');
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  snapshot.getContext('2d').drawImage(canvas, 0, 0);
  fireStronger.snapshot = snapshot;
  stopReflecterBattleMusic();
  playFlametombStingSound();
  requestAnimationFrame(stepFireStronger);
  return true;
}

function stepFireStronger() {
  if (!fireStronger.active) return;
  if (!normalArcadeActive || !gameStarted) {
    fireStronger.active = false;
    return;
  }
  fireStronger.t += 1;
  const t = fireStronger.t;
  ctx.drawImage(fireStronger.snapshot, 0, 0);
  ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.9, t / 100)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the words, appearing little by little
  const shown = Math.max(0, Math.floor((t - 50) / 5));
  if (shown > 0) {
    ctx.save();
    ctx.font = '900 30px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(fireStrongerText.slice(0, shown), canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }
  if (t < 50 + fireStrongerText.length * 5 + 130) {
    requestAnimationFrame(stepFireStronger);
    return;
  }
  // and then the victory screen, as always
  fireStronger.active = false;
  fireStronger.done = true;
  ctx.drawImage(fireStronger.snapshot, 0, 0);
  finishFight();
  fireStronger.done = false;
}

// chapter 3B, level 5: just a small line in the corner, after the Flametomb on NEO
function drawFireStrongerCaption() {
  if (!(fireStronger.caption > 0)) return;
  const t = fireStronger.caption;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, (t - 60) / 40, (330 - t) / 40));
  ctx.font = '700 14px Courier New, monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#e0e0e0';
  ctx.fillText(fireStrongerText.slice(0, Math.max(0, Math.floor((t - 60) / 3))), canvas.width - 24, canvas.height - 40);
  ctx.restore();
}

// chapter 4B, level 6: no Fire Master on the victory screen. Only this.
function drawSpecialVictoryScreen(winner) {
  if (!(typeof isRouteB6Fight === 'function' && isRouteB6Fight() && winner === player1)) return false;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.font = '900 30px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('...Algo se hizo más fuerte.', canvas.width / 2, canvas.height / 2);
  ctx.restore();
  playFlametombStingSound();
  return true;
}

// ================= code OBSIDIAN: the Flametomb with a mind of its own, playable =================
let obsidianCodeActive = false;
characterDisplayNames.obsidian = 'Obsidian';
const obsidianCodeThoughts = ['...Arde.', '...Papel. Tinta. Todo arde igual.', '...Este cuerpo es mio.', '...Escritor. Te encontre una vez. Te voy a encontrar otra.', '...El esta durmiendo. Mejor asi.'];

scamHeroIntroLines.obsidian = [
  { speaker: 'scammer', text: 'B-bienvenido a mi humilde... ...', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...El vendedor de lentes.' },
  { speaker: 'scammer', text: 'Ese simbolo es NEGRO. Ese no es el kid. Vos no sos el kid.', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'obsidian', text: '...El kid esta durmiendo. Yo me acuerdo de tu armadura.' },
  { speaker: 'scammer', text: '...Esta tienda cierra temprano hoy. MUY temprano. ...Pero ya que estas aca: OFERTA ESPECIAL DE ULTIMO MOMENTO!' },
  scamClosingLine,
];
scamHeroNeoReactions.obsidian = '...Esa armadura ya ardio una vez. Va a arder otra.';
knightIntroHeroLines.obsidian = [
  { speaker: 'obsidian', text: '...Piedra. Banderas. Un castillo entero. Todo arde igual.' },
  knightHalt,
  { speaker: 'knight', text: 'Tu llama es negra, viajero. No hay calor en ella. Solo hambre.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'obsidian', text: '...Caballero. Tu honor tambien es papel.' },
  { speaker: 'knight', text: 'Entonces mi acero sera la ultima pagina que no podras quemar.' },
  knightEnGuard,
];
shaolinIntroLines.obsidian = [
  { speaker: 'shang', text: '...你不是人。(...Vos no sos una persona.)', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'hero', text: '...Soy lo que queda cuando el fuego aprende a pensar.' },
  { speaker: 'shang', text: '那个孩子在哪里？(Donde esta el chico?)' },
  { speaker: 'hero', text: '...Durmiendo. Adentro. No va a despertar.' },
  { speaker: 'shang', text: '那我就把他叫醒。(Entonces lo voy a despertar yo.)' },
  { speaker: 'shang', text: '来吧！(Ven!)', emote: { who: 'scammer', symbol: '!' } },
];

const obsidianButton = document.createElement('button');
obsidianButton.type = 'button';
obsidianButton.className = 'character-option fire-master-option obsidian-option hidden';
obsidianButton.innerHTML = '<span>Obsidian</span><span class="character-preview obsidian-preview" aria-hidden="true"></span>';
obsidianButton.addEventListener('click', () => selectCharacter('fireMaster', 'obsidian'));
frostFireButton.insertAdjacentElement('afterend', obsidianButton);

let obsidianPreview = null;
function renderObsidianPreview() {
  if (obsidianPreview) return obsidianPreview;
  try {
    const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const actor = new Fighter({ x: 0, y: 0, color: '#b8450f', attacksToTheRight: true });
    actor.setCharacterType('fireMaster', 'obsidian');
    actor.frostFire = true;
    actor.frostFire2 = true;
    actor.obsidian = true;
    actor.obsidianControl = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    actor.position = { x: 400, y: 300 - actor.height };
    actor.isAttacking = false;
    actor.draw();
    const thumb = document.createElement('canvas');
    thumb.width = 140;
    thumb.height = 168;
    const box = { x: 360, y: 300 - actor.height - 30, width: actor.width + 80, height: actor.height + 40 };
    const scale = Math.min(thumb.width / box.width, thumb.height / box.height);
    thumb.getContext('2d').drawImage(canvas, box.x, box.y, box.width, box.height, (thumb.width - box.width * scale) / 2, thumb.height - box.height * scale, box.width * scale, box.height * scale);
    ctx.putImageData(saved, 0, 0);
    obsidianPreview = thumb.toDataURL();
  } catch (error) {
    obsidianPreview = '';
  }
  return obsidianPreview;
}

function applyObsidianPreview(element) {
  const image = renderObsidianPreview();
  if (!image || !element) return;
  element.style.backgroundImage = `url(${image})`;
  element.style.backgroundSize = 'contain';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundPosition = 'center bottom';
}

function unlockObsidianCode() {
  obsidianCodeActive = true;
  obsidianButton.classList.remove('hidden');
  applyObsidianPreview(obsidianButton.querySelector('.obsidian-preview'));
  showCustomToast('...OBSIDIAN', 'El Flametomb que aprendio a pensar. 160 de vida, golpes muy fuertes, R: su Flametomb de llamas y Q+R: Mini Flametomb. Tiene sus propios dialogos con Scammer, Knight y Shang Ting.');
  playFlametombStingSound();
}

function lockObsidianCode() {
  obsidianCodeActive = false;
  obsidianButton.classList.add('hidden');
}

function addObsidianScamPick() {
  if (!obsidianCodeActive) return;
  const pick = document.createElement('button');
  pick.type = 'button';
  pick.className = 'scam-challenge-pick';
  pick.dataset.character = 'obsidian';
  const preview = document.createElement('span');
  preview.className = 'character-preview obsidian-preview';
  applyObsidianPreview(preview);
  const name = document.createElement('span');
  name.innerText = 'Obsidian';
  pick.append(preview, name);
  pick.addEventListener('click', () => chooseScamChallengeHero('obsidian', false));
  scamChallengeGrid.appendChild(pick);
}

// every fight outside the arcade: his body, his black flames
function prepareObsidianFighter(fighter) {
  if (normalArcadeActive) return;
  const obsidian = fighter.characterType === 'fireMaster' && fighter.secretVariant === 'obsidian';
  fighter.obsidian = obsidian;
  fighter.frostFire2 = obsidian;
  if (!obsidian) return;
  fighter.frostFire = true;
  fighter.obsidianControl = true;
  fighter.obsidianTombCooldown = 0;
  fighter.miniFlametomb = true;
  fighter.miniFlametombCooldown = 0;
  fighter.color = '#b8450f';
  fighter.setMaxHealth(160);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1.6;
  updateHealthBars();
  updateCombatHudIdentity();
}

function updateObsidianCodeThoughts() {
  if (normalArcadeActive || !(player1.obsidian && player1.secretVariant === 'obsidian') || !gameStarted || gameOver || arcadeCutscene.active) return;
  flametomb.obsidianThought = (flametomb.obsidianThought || 500) - 1;
  if (flametomb.obsidianThought <= 0) {
    flametomb.obsidianThought = 1100 + Math.floor(Math.random() * 600);
    showFlametombThought(player1, obsidianCodeThoughts[Math.floor(Math.random() * obsidianCodeThoughts.length)]);
  }
}

// what Obsidian says when he wins
function getObsidianVictoryPhrase(opponent) {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  if (!opponent) return '...';
  if (opponent.characterType === 'sorcerer') return pick(['...Otra vez, escritor. Y otra. Y otra.', '...Tus esferas siguen grises.', '...El sombrero todavia esta tibio.']);
  if (isNeoScammer(opponent) || isScammer(opponent)) return pick(['...Tus lentes no te salvaron la primera vez.', '...Big shot. Ceniza.']);
  if (isIceMaster(opponent)) return pick(['...Ya te tengo adentro. Que mas queres.', '...Polvo. Otra vez.']);
  if (opponent.characterType === 'fireMaster') return pick(['...Asi eras. Antes de mi.', '...Tu fuego es tibio. El mio no.']);
  if (opponent.characterType === 'chrono') return pick(['...Corre, reloj. El tiempo tambien arde.', '...No rebobinaste. Nadie rebobina.']);
  if (isKnight(opponent)) return pick(['...El honor tambien es papel.', '...Tu acero se derrite igual.']);
  if (opponent.characterType === 'lightWarrior') return pick(['...Tu luz no calienta. La mia si.', '...Hasta la luz deja sombra.']);
  if (opponent.characterType === 'gambler') return pick(['...La suerte no es ignifuga.']);
  if (opponent.secretVariant === 'shaolinMaster') return pick(['...No lo despertaste.', '...Tu chi tambien arde.']);
  if (isFriendThing(opponent)) return pick(['...Ustedes no se rien del fuego. Ya no.']);
  return pick(['...Arde.', '...Papel. Tinta. Todo arde igual.', '...Uno mas.', '...El kid no se va a enterar.']);
}
