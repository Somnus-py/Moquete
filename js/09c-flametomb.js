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
  playTone({ frequency: 110, duration: 1.6, type: 'square', volume: 0.03 });
  playTone({ frequency: 116.5, duration: 1.6, type: 'square', volume: 0.03 });
  [[880, 0], [622, 260], [415, 520], [311, 900]].forEach(([frequency, delay]) => {
    setTimeout(() => {
      playTone({ frequency, duration: 0.7, type: 'sine', volume: 0.05, slideTo: frequency * 0.97 });
      playTone({ frequency: frequency * 1.012, duration: 0.7, type: 'triangle', volume: 0.025 });
    }, delay);
  });
  setTimeout(() => playNoise({ duration: 1.2, volume: 0.03, filterFrequency: 400 }), 1100);
  writeFlametombFlag('moqueteFlametombRoute');
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
  if (normalArcadeActive && arcadeChapter === 'gamblerB' && !arcadeCutscene.active) drawRouteB3Cold(getRouteB3Cold());
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
  cutscene.hideEnemy = Boolean(line.hybridDown);
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
  // the hybrid on the floor
  if (cutscene.hideEnemy) {
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
    actor.attacksToTheRight = true;
    actor.isAttacking = false;
    actor.draw();
  }
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
  });
  miniFlametombs.forEach((tomb) => {
    tomb.t += 1;
    tomb.x += (getFighterCenterX(tomb.target) - tomb.x) * 0.05;
    if (tomb.t === 26 && !tomb.hit) {
      tomb.hit = true;
      if (Math.abs(getFighterCenterX(tomb.target) - tomb.x) < tomb.target.width / 2 + 50) {
        applyDamage(tomb.caster, tomb.target, miniFlametombDamage, { isSpecial: true });
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
    if (!(normalArcadeActive && arcadeChapter === 'gamblerB')) {
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
