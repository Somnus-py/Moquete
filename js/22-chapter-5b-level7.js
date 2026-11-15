// Moquete - Capitulo 5B, niveles 7 (Un verdadero heroe) y 8 (Sin perdon)
// Fire Master leaves the bunker to look for more survivors (sorry, and at the same time feeling nothing).
// Knight, burnt, without his shield and with half a sword, comes out after him. He cannot win... and he
// knows it. He fights anyway. At 1 HP he refuses to fall; every blow makes him weaker and slower, until he
// cannot stand. Then Light Warrior arrives: heals him with something from the bunker and, without a word,
// knocks Fire Master out. Cut.

const knightB7 = { phase: 'intro', scene: null, end: null, lastStand: false, weak: 0, vulnerable: 0, regens: 0, ended: false, gauntlets: [], pillars: [], lines: [], banner: 0, escalate: 0, fightT: 0, fade: 0, flash: 0 };
const knightB7GauntletCooldown = 150;
const knightB7OathCooldown = 420;
const knightB7WeakLimit = 12;
reflecterBattleTrackSources.trueHero = encodeURI('assetsaudio/098. Battle Against A True Hero (UNDERTALE Soundtrack) - Toby Fox.mp3');
reflecterBattleTrackVolumes.trueHero = 0.55;
reflecterBattleTrackSources.undyneEnd = encodeURI("assetsaudio/Undyne's End (Neutral Death) _ Undertale (1).mp3");
reflecterBattleTrackVolumes.undyneEnd = 0.6;

function isKnightB7() {
  return isKnightBChapter() && selectedNormalArcadeLevel === 7;
}

function isKnightB7Fight() {
  return isKnightB7() && knightB7.phase === 'fight';
}

function configureKnightB7() {
  knightBSolo.active = false;
  document.body.classList.remove('knightb-solo');
  selectedMap = 'robledalBunkerOut';
  botEnabled = true;
  normalArcadeEnemyIndex = 1;
  normalArcadeEnemiesRemaining = 0;
  player1.knightB7Look = true;
  if (typeof resetKnightState === 'function') resetKnightState(player1);
  player1.moveSpeed = playerMoveSpeed;
  player1.damageMultiplier = 1;
  player1.knightKneel = false;
  player1.gamblerStunTimer = 0;
  // (he comes out of the bunker half dead)
  player1.health = Math.round(player1.maxHealth * 0.45);
  makeBizarreFireMaster(player2);
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.setMaxHealth(420);
  player2.health = player2.maxHealth;
  player2.gamblerStunTimer = 0;
  Object.assign(knightB7, { pause: null, burning: 0, embers: [], end: null, lastStand: false, weak: 0, vulnerable: 0, regens: 0, ended: false, gauntlets: [], pillars: [], lines: [], banner: 0, escalate: 0, fightT: 0, flash: 0 });
  updateHealthBars();
  updateCombatHudIdentity();
}

// ---------- Knight, as he is now: burnt, cracked, no shield, half a sword ----------
function drawKnightB7Burns(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const time = performance.now() / 1000;
  ctx.save();
  if (fighter.knightKneel) {
    // (kneeling: the drawing is squashed down to the floor)
    ctx.translate(0, h * 0.2);
    ctx.translate(x, y);
    ctx.scale(1, 0.8);
    ctx.translate(-x, -y);
  }
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(150, 118, 102)';
  ctx.fillRect(x - 2, y - 12, w + 4, h + 12);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(10, 6, 4, 0.45)';
  [[0.05, 0.06, 0.45, 0.12], [0.55, 0.36, 0.4, 0.16], [0.04, 0.55, 0.3, 0.2], [0.5, 0.74, 0.45, 0.14]].forEach(([a, b, c, d]) => ctx.fillRect(x + a * w, y + b * h, c * w, d * h));
  const edge = `rgba(255, 120, 40, ${0.35 + Math.sin(time * 3) * 0.15})`;
  [[[x + w - 12, y], [x + w, y], [x + w, y + 14], [x + w - 5, y + 9]], [[x + 16, y + 50], [x + 27, y + 46], [x + 32, y + 57], [x + 22, y + 64]]].forEach((points) => {
    ctx.beginPath();
    points.forEach(([px, py], index) => (index ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.fillStyle = '#0d0705';
    ctx.fill();
    ctx.strokeStyle = edge;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  [[[x + 6, y + 30], [x + 14, y + 36], [x + 11, y + 44]], [[x + w - 4, y + 42], [x + w - 15, y + 48], [x + w - 11, y + 58]], [[x + 12, y + 96], [x + 22, y + 102], [x + 18, y + 110]]].forEach((line) => {
    line.forEach(([px, py], index) => (index ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  });
  ctx.stroke();
  // the last stand: a faint blue light that refuses to go out
  if (knightB7.lastStand && fighter === player1 && !knightB7.end) {
    const pulse = 0.25 + Math.sin(time * 4) * 0.1;
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, 90);
    glow.addColorStop(0, `rgba(128, 216, 255, ${pulse * Math.max(0.2, 1 - knightB7.weak / knightB7WeakLimit)})`);
    glow.addColorStop(1, 'rgba(128, 216, 255, 0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glow;
    ctx.fillRect(x - 70, y - 40, w + 140, h + 80);
  }
  ctx.restore();
}

function makeKnightB7Knight(x) {
  const knight = new Fighter({ x: 0, y: 0, color: '#42a5f5', attacksToTheRight: false });
  knight.setCharacterType('normal', 'knight');
  knight.knightB7Look = true;
  knight.position = { x, y: ground - knight.height };
  return knight;
}

function makeKnightB7Fire(x) {
  const fire = new Fighter({ x: 0, y: 0, color: '#b8450f', attacksToTheRight: false });
  makeBizarreFireMaster(fire);
  fire.position = { x, y: ground - fire.height };
  return fire;
}

function drawKnightB7Text(x, y, text, color, alpha, italic, size = 15) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.font = italic ? `italic ${size}px Georgia, serif` : `900 ${size}px 'Courier New', monospace`;
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
  const cx = Math.max(120, Math.min(canvas.width - 120, x));
  ctx.strokeText(text, cx, y);
  ctx.fillStyle = color;
  ctx.fillText(text, cx, y);
  ctx.restore();
}

function drawKnightB7Voice(text, t, life, y = 150) {
  if (t < 0 || t > life) return;
  const typed = text.slice(0, Math.floor(t / 2));
  const alpha = Math.min(1, (life - t) / 30);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "900 26px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillText(typed, canvas.width / 2 + 3, y + 3);
  ctx.fillStyle = `rgba(255, 23, 68, ${0.75 + Math.random() * 0.25})`;
  ctx.fillText(typed, canvas.width / 2 + (Math.random() - 0.5) * 3, y);
  ctx.restore();
}

// ---------- the opening ----------
const knightB7Thoughts = [
  [80, '...Hay mas. En las granjas del norte. En el camino.'],
  [250, '...Lo siento.'],
  [360, '...No. No siento nada.'],
  [460, 'No siento... nada.'],
];
const knightB7Lines = [
  { who: 'knight', text: '...Alto.' },
  { who: 'knight', text: '...ALTO!' },
  { who: 'fireMaster', text: '...Knight.', turn: true },
  { who: 'fireMaster', text: 'Deberias estar muerto. Te vi caer.' },
  { who: 'fireMaster', text: 'Volve adentro. Es inutil pelear. No podes ganarme... nadie puede.' },
  { who: 'voice', text: '¿O de verdad crees que vas a sobrevivir una segunda vez?' },
  { who: 'knight', text: '...No tengo escudo. Mi espada esta rota. Apenas me puedo mantener en pie.' },
  { who: 'knight', text: 'Pero en mi pueblo... me llaman heroe.' },
  { who: 'knight', text: 'Y los heroes hacen lo correcto. Incluso cuando nadie esta mirando.' },
  { who: 'fireMaster', text: '...Entonces veni.', possessed: true },
];

function drawKnightB7Dialog(line, typed) {
  const text = line.text.slice(0, typed);
  const red = line.who === 'voice' || line.possessed;
  ctx.save();
  if (line.who === 'voice') ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
  const boxY = 24;
  ctx.fillStyle = line.who === 'voice' ? 'rgba(20, 0, 4, 0.92)' : 'rgba(8, 8, 12, 0.88)';
  ctx.fillRect(40, boxY, canvas.width - 80, 100);
  ctx.strokeStyle = red ? '#ff1744' : '#e0e0e0';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, boxY, canvas.width - 80, 100);
  const names = { knight: 'KNIGHT', fireMaster: 'FIRE MASTER', voice: '? ? ?' };
  ctx.fillStyle = red ? '#ff1744' : line.who === 'knight' ? '#90caf9' : '#ff8a65';
  ctx.font = "900 15px 'Courier New', monospace";
  ctx.textAlign = 'left';
  ctx.fillText(names[line.who], 62, boxY + 26);
  if (red) {
    ctx.font = "900 21px 'Courier New', monospace";
    ctx.fillStyle = `rgba(255, 23, 68, ${0.8 + Math.random() * 0.2})`;
  } else {
    ctx.font = line.who === 'fireMaster' ? "italic 19px Georgia, serif" : "700 18px 'Courier New', monospace";
    ctx.fillStyle = line.who === 'fireMaster' ? '#d7ccc8' : '#fafafa';
  }
  wrapNoteText(text, canvas.width - 160).forEach((row, index) => ctx.fillText(row, 62, boxY + 54 + index * 24));
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#757575';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER / CLICK', canvas.width - 56, boxY + 92);
  ctx.restore();
}

// the versus banner, as always: Knight's blue against Fire Master's burnt orange
function drawKnightB7Versus(frame) {
  const width = canvas.width;
  const slide = Math.min(1, frame / 18);
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, width, canvas.height);
  const leftX = -width + slide * width;
  const rightX = width - slide * (width / 2);
  const leftBar = ctx.createLinearGradient(leftX, 0, leftX + width / 2, 0);
  leftBar.addColorStop(0, '#0d1b46');
  leftBar.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = leftBar;
  ctx.fillRect(leftX, 200, width / 2, 110);
  const rightBar = ctx.createLinearGradient(rightX, 0, rightX + width / 2, 0);
  rightBar.addColorStop(0, '#b8450f');
  rightBar.addColorStop(1, '#3a1400');
  ctx.fillStyle = rightBar;
  ctx.fillRect(rightX, 200, width / 2, 110);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(width / 2 - 2, 200, 4, 110 * slide);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.font = '900 38px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.strokeText('KNIGHT  VS  FIRE MASTER', width / 2, 250);
  ctx.fillText('KNIGHT  VS  FIRE MASTER', width / 2, 250);
  if (frame > 40) {
    ctx.fillStyle = '#fdd835';
    ctx.font = '900 30px Courier New, monospace';
    ctx.strokeText('A PELEAR!', width / 2, 292);
    ctx.fillText('A PELEAR!', width / 2, 292);
  }
  ctx.restore();
}

function startKnightB7Intro() {
  if (knightB7.phase === 'fight') return;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  const scene = { f: 0, stage: 'walk', line: 0, typed: 0, lineT: 0, versus: 0, fire: makeKnightB7Fire(690), knight: makeKnightB7Knight(700), knightOut: false, voice: null };
  scene.fire.attacksToTheRight = false;
  knightB7.scene = scene;
  scene.advance = (event) => {
    if (event.type === 'keydown' && !['Enter', ' ', 'Escape'].includes(event.key)) return;
    if (event.type === 'keydown') event.preventDefault();
    if (event.key === 'Escape') {
      finishKnightB7Intro();
      return;
    }
    if (scene.stage !== 'talk') return;
    const line = knightB7Lines[scene.line];
    if (!line) return;
    if (scene.typed < line.text.length) scene.typed = line.text.length;
    else knightB7NextLine();
  };
  window.addEventListener('keydown', scene.advance);
  canvas.addEventListener('pointerdown', scene.advance);
  document.body.classList.add('knightb-ending');
  if (typeof startKnightBWind === 'function') startKnightBWind();
  requestAnimationFrame(tickKnightB7Intro);
}

function knightB7NextLine() {
  const scene = knightB7.scene;
  scene.line += 1;
  scene.typed = 0;
  scene.lineT = 0;
  playSound('menuMove');
  const line = knightB7Lines[scene.line];
  if (line && line.turn) scene.fire.attacksToTheRight = true;
  if (line && line.who === 'voice') {
    playTone({ frequency: 45, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    playNoise({ duration: 0.6, volume: 0.05, filterFrequency: 500 });
  }
}

function tickKnightB7Intro() {
  const scene = knightB7.scene;
  if (!scene || scene.done) return;
  scene.f += 1;
  const f = scene.f;
  if (typeof updateKnightBWind === 'function') updateKnightBWind();
  const fire = scene.fire;
  const knight = scene.knight;
  // ---------- what happens ----------
  if (scene.stage === 'walk') {
    // out of the bunker, slowly, toward the road
    if (f > 30) fire.position.x = Math.max(250, fire.position.x - 0.8);
    if (f % 40 === 0 && fire.position.x > 250) playSound('cutsceneStep');
    if (f === 1) playNoise({ duration: 0.9, volume: 0.06, filterFrequency: 300 });
    if (f === 560) {
      scene.knightOut = true;
      playNoise({ duration: 0.9, volume: 0.07, filterFrequency: 300 });
    }
    if (scene.knightOut) {
      knight.position.x = Math.max(620, knight.position.x - 0.6);
      knight.velocity.x = knight.position.x > 620 ? -0.6 : 0;
    }
    if (f > 680) {
      scene.stage = 'talk';
      fire.velocity.x = 0;
    }
  } else if (scene.stage === 'talk') {
    const line = knightB7Lines[scene.line];
    if (line) {
      if (f % 2 === 0) scene.typed = Math.min(line.text.length, scene.typed + 1);
      scene.lineT += 1;
      if (scene.typed >= line.text.length && scene.lineT > line.text.length * 2 + 170) knightB7NextLine();
    } else {
      scene.stage = 'versus';
      scene.versus = 0;
      playSound('menuMove');
    }
  } else if (scene.stage === 'versus') {
    scene.versus += 1;
    if (scene.versus > 120) {
      finishKnightB7Intro();
      return;
    }
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawKnightBBunkerOutside();
  // the door, open while they come out
  if (f < 120 || (f > 540 && f < 680)) {
    ctx.fillStyle = '#050505';
    ctx.fillRect(612, ground - 198, 184, 198);
  }
  fire.isAttacking = false;
  drawBizarreFireMaster(fire, 1);
  if (scene.knightOut) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * 1.2, 0);
    knight.isAttacking = false;
    knight.attacksToTheRight = false;
    knight.draw();
    ctx.restore();
  }
  drawKnightBGloom(false);
  // what he tells himself while he walks... and the voice
  knightB7Thoughts.forEach(([at, text]) => {
    const t = f - at;
    if (t >= 0 && t < 150) drawKnightB7Text(fire.position.x + fire.width / 2, fire.position.y - 26, text.slice(0, Math.floor(t / 2)), '#bdbdbd', Math.min(1, (150 - t) / 25), true);
  });
  drawKnightB7Voice('Bien. Sigamos.', f - 500, 120);
  if (scene.stage === 'talk' && knightB7Lines[scene.line]) drawKnightB7Dialog(knightB7Lines[scene.line], scene.typed);
  if (scene.stage === 'versus') drawKnightB7Versus(scene.versus);
  requestAnimationFrame(tickKnightB7Intro);
}

function finishKnightB7Intro() {
  const scene = knightB7.scene;
  if (!scene) return;
  scene.done = true;
  window.removeEventListener('keydown', scene.advance);
  canvas.removeEventListener('pointerdown', scene.advance);
  document.body.classList.remove('knightb-ending');
  if (typeof stopKnightBWind === 'function') stopKnightBWind();
  knightB7.scene = null;
  knightB7.phase = 'fight';
  knightB7.fade = 50;
  player1.position = { x: 640, y: ground - player1.height };
  player2.position = { x: 260, y: ground - player2.height };
  player1.attacksToTheRight = false;
  reflecterBattleMusic.restart = true;
  gameStarted = true;
  gameOver = false;
  animate();
}

// ---------- his abilities now: no shield ----------
// Q: Estocada rota (the old lunge, with half a sword); F: Guantelete volador (his gauntlet, thrown, comes
// back); R: Juramento (the broken sword in the ground: a pillar of blue light under the enemy)
function knightB7Slowness() {
  return 1 + knightB7.weak * 0.12;
}

function castKnightB7Gauntlet(fighter, target) {
  if ((fighter.knightB7GauntletCd || 0) > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.attacksToTheRight = direction > 0;
  knightB7.gauntlets.push({ x: getFighterCenterX(fighter) + direction * 30, y: fighter.position.y + 56, dir: direction, out: 0, back: false, hit: false, owner: fighter, target });
  fighter.knightB7GauntletCd = Math.round(getDebugCooldown(knightB7GauntletCooldown, fighter) * knightB7Slowness());
  recordSpecialUsed(fighter);
  playTone({ frequency: 300, duration: 0.25, type: 'square', volume: 0.04, slideTo: 600 });
  return true;
}

function castKnightB7Oath(fighter, target) {
  if ((fighter.knightB7OathCd || 0) > 0) return false;
  knightB7.pillars.push({ x: getFighterCenterX(target), warn: 40, life: 26, hit: false, owner: fighter, target });
  fighter.knightB7OathCd = Math.round(getDebugCooldown(knightB7OathCooldown, fighter) * knightB7Slowness());
  fighter.velocity.x = 0;
  fighter.knightGlow = 30;
  recordSpecialUsed(fighter);
  playTone({ frequency: 520, duration: 0.6, type: 'triangle', volume: 0.05, slideTo: 1040 });
  return true;
}

function updateKnightB7Abilities() {
  const time = performance.now() / 1000;
  ['knightB7GauntletCd', 'knightB7OathCd'].forEach((key) => {
    if (player1[key] > 0) player1[key] -= 1;
  });
  knightB7.gauntlets.forEach((glove) => {
    const owner = glove.owner;
    if (!glove.back) {
      glove.x += glove.dir * 11;
      glove.out += 11;
      if (glove.out > 380 || glove.x < 0 || glove.x > canvas.width) glove.back = true;
    } else {
      const home = getFighterCenterX(owner);
      glove.x += Math.sign(home - glove.x) * 13;
      glove.y += (owner.position.y + 56 - glove.y) * 0.2;
      if (Math.abs(home - glove.x) < 14) glove.done = true;
    }
    const target = glove.target;
    if (!glove.hit && glove.x > target.position.x - 8 && glove.x < target.position.x + target.width + 8 && glove.y > target.position.y && glove.y < target.position.y + target.height) {
      glove.hit = true;
      glove.back = true;
      applyDamage(owner, target, 11, { isSpecial: true, damageType: 'knightGauntlet' });
      target.velocity.x = getDebugKnockback(6 * glove.dir, target);
      target.velocity.y = getDebugKnockback(-4, target);
      playSound('robotHit');
    }
    // the gauntlet, with a trail of cold blue light
    ctx.save();
    ctx.fillStyle = 'rgba(128, 216, 255, 0.35)';
    ctx.fillRect(glove.x - glove.dir * 30 - 15, glove.y - 3, 30, 6);
    drawKnightB7Gauntlet(glove.x, glove.y, glove.back ? -glove.dir : glove.dir);
    ctx.restore();
  });
  knightB7.gauntlets = knightB7.gauntlets.filter((glove) => !glove.done);
  knightB7.pillars.forEach((pillar) => {
    if (pillar.warn > 0) {
      pillar.warn -= 1;
      ctx.save();
      ctx.strokeStyle = `rgba(128, 216, 255, ${0.5 + Math.sin(time * 20) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(pillar.x, ground - 2, 46, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(128, 216, 255, 0.5)';
      ctx.fillRect(pillar.x - 2, ground - 22, 4, 20);
      ctx.fillRect(pillar.x - 9, ground - 16, 18, 3);
      ctx.restore();
      if (pillar.warn === 0) playNoise({ duration: 0.4, volume: 0.06, filterFrequency: 2400 });
      return;
    }
    pillar.life -= 1;
    const grow = Math.min(1, (26 - pillar.life) / 5);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const beam = ctx.createLinearGradient(pillar.x - 40, 0, pillar.x + 40, 0);
    beam.addColorStop(0, 'rgba(128, 216, 255, 0)');
    beam.addColorStop(0.5, `rgba(225, 245, 254, ${0.9 * grow})`);
    beam.addColorStop(1, 'rgba(128, 216, 255, 0)');
    ctx.fillStyle = beam;
    ctx.fillRect(pillar.x - 40, ground - 420 * grow, 80, 420 * grow);
    ctx.restore();
    const target = pillar.target;
    if (!pillar.hit && pillar.life > 4 && Math.abs(getFighterCenterX(target) - pillar.x) < 46 && target.position.y + target.height > ground - 200) {
      pillar.hit = true;
      applyDamage(pillar.owner, target, 18, { isSpecial: true, damageType: 'knightOath' });
      target.velocity.y = getDebugKnockback(-12, target);
      playSound('judgeLight');
    }
  });
  knightB7.pillars = knightB7.pillars.filter((pillar) => pillar.warn > 0 || pillar.life > 0);
}

function drawKnightB7Gauntlet(x, y, dir) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = '#8a8580';
  ctx.fillRect(-7, -6, 14, 12);
  ctx.strokeRect(-7, -6, 14, 12);
  ctx.fillStyle = '#6f6a66';
  [-6, -2, 2].forEach((fy) => {
    ctx.fillRect(7, fy, 8, 3.4);
    ctx.strokeRect(7, fy, 8, 3.4);
  });
  ctx.fillStyle = '#3a2a22';
  ctx.fillRect(-4, -3, 4, 4);
  ctx.restore();
}

// ---------- the fire: at some point, everything around them starts to burn ----------
function updateKnightB7Fire() {
  if (!knightB7.burning && (knightB7.fightT > 1500 || player2.health < player2.maxHealth * 0.65)) {
    knightB7.burning = 1;
    sayKnightB7('Que arda todo.', '#ff1744', 150, 'voice');
    playNoise({ duration: 2, volume: 0.1, filterFrequency: 700 });
    playTone({ frequency: 40, duration: 2, type: 'sawtooth', volume: 0.07, slideTo: 70 });
  }
  if (!knightB7.burning) return;
  knightB7.burning += 1;
  const grow = Math.min(1, knightB7.burning / 150);
  const time = performance.now() / 1000;
  // low flames along the front of the ground (under their feet, never over them)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let flame = 0; flame < 22; flame += 1) {
    const fx = flame * 48 + Math.sin(flame * 3.1) * 10;
    const size = (12 + ((flame * 7) % 9)) * grow;
    drawFlametombFlame(fx, canvas.height - 4, size, time * 10 + flame * 1.7, 'outer');
  }
  ctx.restore();
  // embers, rising everywhere; and the crackling
  if (Math.random() < 0.5 * grow) knightB7.embers.push({ x: Math.random() * canvas.width, y: ground + 20, vx: (Math.random() - 0.5) * 0.8, vy: -1 - Math.random() * 2, life: 90 + Math.random() * 60 });
  knightB7.embers.forEach((ember) => {
    ember.x += ember.vx + Math.sin(time * 3 + ember.y / 30) * 0.4;
    ember.y += ember.vy;
    ember.life -= 1;
    ctx.fillStyle = ember.life % 6 < 3 ? `rgba(255, 213, 79, ${Math.min(1, ember.life / 40)})` : `rgba(255, 112, 67, ${Math.min(1, ember.life / 40)})`;
    ctx.fillRect(ember.x, ember.y, 2.5, 2.5);
  });
  knightB7.embers = knightB7.embers.filter((ember) => ember.life > 0);
  if (Math.random() < 0.06 * grow) playNoise({ duration: 0.08 + Math.random() * 0.1, volume: 0.02, filterFrequency: 2000 + Math.random() * 2000 });
  // the night goes orange
  ctx.fillStyle = `rgba(255, 87, 34, ${0.08 * grow + Math.sin(time * 7) * 0.015 * grow})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// behind them: the field, the fence and the bunker's walls on fire
function drawKnightB7BackFire() {
  const grow = Math.min(1, knightB7.burning / 150);
  const time = performance.now() / 1000;
  ctx.save();
  const sky = ctx.createLinearGradient(0, ground - 260, 0, ground);
  sky.addColorStop(0, 'rgba(255, 87, 34, 0)');
  sky.addColorStop(1, `rgba(255, 87, 34, ${0.35 * grow})`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, ground - 260, canvas.width, 260);
  for (let puff = 0; puff < 8; puff += 1) {
    const px = ((puff * 140 + time * 12) % (canvas.width + 200)) - 100;
    const py = ground - 180 - (puff % 3) * 50 - Math.sin(time + puff) * 10;
    ctx.fillStyle = `rgba(30, 24, 24, ${0.35 * grow})`;
    ctx.beginPath();
    ctx.ellipse(px, py, 90, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'lighter';
  for (let flame = 0; flame < 30; flame += 1) {
    const fx = flame * 35 + Math.sin(flame * 2.3) * 12;
    const tall = (26 + ((flame * 13) % 30)) * grow;
    drawFlametombFlame(fx, ground - 6, tall, time * 9 + flame * 1.3, 'outer');
  }
  ctx.globalCompositeOperation = 'source-over';
  for (let flame = 0; flame < 30; flame += 3) drawFlametombFlame(flame * 35 + 8, ground - 4, 12 * grow, time * 11 + flame, 'core');
  ctx.restore();
}

// ---------- 1 HP: he will not fall ----------
const knightB7StandLines = ['...No... voy a caer...', 'Todavia... puedo...', '...Por Robledal...', '...Por Celeste... por Seto...', '...Por el chef... por Mochi...', '...Por el sheriff...', '...un paso... mas...', '...lo prometi...', '...no... todavia...', '...no...', '...', '...'];

function sayKnightB7(text, color, life = 120, who = 'knight') {
  knightB7.lines = knightB7.lines.filter((line) => line.who !== who);
  knightB7.lines.push({ text, color, life, max: life, who });
}

// at 1 HP everything stops: he drops to his knees. Fire Master told him so; the voice laughs at him...
// and he gets up one last time
const knightB7PauseScript = [
  [70, 'fm', '...Te lo dije.'],
  [210, 'fm', 'Te dije que era inutil, Knight.'],
  [350, 'voice', 'JA. JAJAJA. ¿Este es el heroe?'],
  [500, 'voice', 'Mira como tiembla. Nadie esta mirando. Nadie va a venir.'],
  [660, 'knight', '...Nadie... esta mirando...'],
  [800, 'knight', '...Por eso... tengo que hacerlo yo.'],
];

function startKnightB7Pause() {
  knightB7.pause = { t: 0 };
  knightB7.gauntlets = [];
  knightB7.pillars = [];
  player1.knightKneel = true;
  [player1, player2].forEach((fighter) => {
    fighter.gamblerStunTimer = 999999;
    fighter.velocity.x = 0;
  });
  stopReflecterBattleMusic();
  playTone({ frequency: 60, duration: 1.4, type: 'sine', volume: 0.08, slideTo: 40 });
}

function updateKnightB7Pause() {
  const pause = knightB7.pause;
  pause.t += 1;
  const t = pause.t;
  player1.velocity.x = 0;
  player2.velocity.x = 0;
  player1.health = 1;
  knightB7PauseScript.forEach(([at, who, text]) => {
    if (t !== at) return;
    if (who === 'voice') {
      sayKnightB7(text, '#ff1744', 150, 'voice');
      playTone({ frequency: 45, duration: 0.9, type: 'sawtooth', volume: 0.06, slideTo: 30 });
      // (the laugh)
      if (text.startsWith('JA')) [0, 0.18, 0.36, 0.54].forEach((delay) => playTone({ frequency: 120, duration: 0.12, type: 'sawtooth', volume: 0.04, delay }));
    } else {
      sayKnightB7(text, who === 'knight' ? '#90caf9' : '#bdbdbd', 150, who === 'knight' ? 'knight' : 'fm');
      playSound('menuMove');
    }
  });
  if (t > 740 && t < 860) {
    // he gets up, slowly, with a light that should not be there
    const k = (t - 740) / 120;
    const x = getFighterCenterX(player1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(x, player1.position.y + 60, 10, x, player1.position.y + 60, 60 + k * 80);
    glow.addColorStop(0, `rgba(179, 229, 252, ${0.5 * k})`);
    glow.addColorStop(1, 'rgba(128, 216, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 160, player1.position.y - 100, 320, 320);
    ctx.restore();
    if (t === 780) {
      player1.knightKneel = false;
      playTone({ frequency: 262, duration: 1.6, type: 'triangle', volume: 0.05, slideTo: 392 });
    }
  }
  if (t >= 900) {
    knightB7.pause = null;
    player1.gamblerStunTimer = 0;
    player2.gamblerStunTimer = 0;
    player1.knightKneel = false;
    enterKnightB7LastStand();
    reflecterBattleMusic.restart = true;
  }
}

function enterKnightB7LastStand() {
  knightB7.lastStand = true;
  knightB7.banner = 160;
  knightB7.flash = 0.5;
  playTone({ frequency: 392, duration: 1.2, type: 'triangle', volume: 0.05 });
  playTone({ frequency: 523, duration: 1.4, type: 'triangle', volume: 0.04, delay: 0.25 });
}

function weakenKnightB7() {
  knightB7.weak += 1;
  const k = Math.max(0.25, 1 - knightB7.weak * 0.09);
  player1.moveSpeed = playerMoveSpeed * k;
  sayKnightB7(knightB7StandLines[Math.min(knightB7StandLines.length - 1, knightB7.weak - 1)], '#90caf9', 110);
  playTone({ frequency: 70, duration: 0.4, type: 'sine', volume: 0.06 });
  if (knightB7.weak >= knightB7WeakLimit && !knightB7.vulnerable) {
    // he cannot stand anymore
    knightB7.vulnerable = 1;
    player1.knightKneel = true;
    player1.gamblerStunTimer = 999999;
    player1.velocity.x = 0;
  }
}

function updateKnightB7Fight() {
  const time = performance.now() / 1000;
  knightB7.fightT += 1;
  // (as the fight drags on, the fire burns hotter)
  if (knightB7.fightT % 900 === 0) knightB7.escalate += 0.25;
  if (player1.health < 1) player1.health = 1;
  if (player2.health < 1) player2.health = 1;
  updateKnightB7Fire();
  if (knightB7.pause) updateKnightB7Pause();
  else updateKnightB7Abilities();
  if (knightB7.vulnerable && !knightB7.end) {
    knightB7.vulnerable += 1;
    player1.knightKneel = true;
    if (knightB7.vulnerable === 2) sayKnightB7('...', '#90caf9', 200);
    if (knightB7.vulnerable > 80) startKnightB7Ending();
  }
  // words over their heads
  knightB7.lines.forEach((line) => {
    line.life -= 1;
    const who = line.who === 'knight' ? player1 : player2;
    const alpha = Math.min(1, line.life / 20, (line.max - line.life) / 10 + 0.2);
    if (line.who === 'voice') drawKnightB7Voice(line.text, line.max - line.life, line.max, 250);
    else drawKnightB7Text(getFighterCenterX(who), who.position.y - 22, line.text, line.color, alpha, true);
  });
  knightB7.lines = knightB7.lines.filter((line) => line.life > 0);
  if (knightB7.banner > 0) {
    knightB7.banner -= 1;
    const alpha = Math.min(1, knightB7.banner / 30, (160 - knightB7.banner) / 15);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 150, canvas.width, 60);
    ctx.font = "900 34px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0d1b46';
    ctx.fillStyle = '#b3e5fc';
    ctx.strokeText('ULTIMA ESPERANZA', canvas.width / 2, 192);
    ctx.fillText('ULTIMA ESPERANZA', canvas.width / 2, 192);
    ctx.restore();
  }
  if (knightB7.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${knightB7.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    knightB7.flash = Math.max(0, knightB7.flash - 0.03);
  }
  if (knightB7.fade > 0) {
    knightB7.fade -= 1;
    ctx.fillStyle = `rgba(0, 0, 0, ${knightB7.fade / 50})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // the weaker he is, the darker it gets around him
  if (knightB7.lastStand) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.3, knightB7.weak * 0.035)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (time < 0) return;
}

// ---------- the end: Light Warrior ----------
function startKnightB7Ending() {
  if (knightB7.end) return;
  player1.gamblerStunTimer = 999999;
  player2.gamblerStunTimer = 999999;
  const knight = makeKnightB7Knight(player1.position.x);
  knight.knightKneel = true;
  knight.attacksToTheRight = getFighterCenterX(player2) > getFighterCenterX(player1);
  const fire = makeKnightB7Fire(player2.position.x);
  fire.attacksToTheRight = !knight.attacksToTheRight;
  const lw = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: true });
  lw.setCharacterType('lightWarrior');
  lw.position = { x: -200, y: ground - lw.height };
  knightB7.end = { t: 0, knight, fire, lw, side: knight.attacksToTheRight ? 1 : -1, sparks: [], rings: [], flash: 0, shake: 0, black: 0, heal: 0, startHealth: player1.health, lwIn: false, artifact: null };
  knightB7.lines = [];
  document.body.classList.add('knightb-ending');
  knightB7.end.raf = requestAnimationFrame(tickKnightB7Ending);
}

function drawKnightB7Artifact(x, y, glow, time) {
  // the bunker's emergency kit: a small white box with a red cross... and a light inside
  ctx.save();
  ctx.translate(x, y + Math.sin(time * 3) * 2);
  if (glow > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const light = ctx.createRadialGradient(0, 0, 4, 0, 0, 70);
    light.addColorStop(0, `rgba(200, 255, 200, ${0.7 * glow})`);
    light.addColorStop(1, 'rgba(120, 255, 160, 0)');
    ctx.fillStyle = light;
    ctx.fillRect(-70, -70, 140, 140);
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.fillStyle = '#f5f5f5';
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 2;
  ctx.fillRect(-14, -10, 28, 20);
  ctx.strokeRect(-14, -10, 28, 20);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-3, -7, 6, 14);
  ctx.fillRect(-7, -3, 14, 6);
  ctx.fillStyle = '#37474f';
  ctx.font = "700 7px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('N.1', 0, 17);
  ctx.restore();
}

function tickKnightB7Ending() {
  const end = knightB7.end;
  if (!end || end.over) return;
  end.t += 1;
  const t = end.t;
  const time = performance.now() / 1000;
  const { knight, fire, lw } = end;
  const side = end.side;
  const knightX = knight.position.x + knight.width / 2;
  // ---------- what happens ----------
  if (t < 250) {
    // he walks to the kneeling knight; the fire gathers in his hand
    const goal = knightX + side * 120 - fire.width / 2;
    if (Math.abs(fire.position.x - goal) > 1) {
      fire.position.x += Math.sign(goal - fire.position.x) * 0.9;
      if (t % 36 === 0) playSound('cutsceneStep');
    }
    if (t === 40) end.voice = { text: 'Se acabo, heroe.', t: 0, life: 140 };
    if (t === 150) playTone({ frequency: 60, duration: 2, type: 'sawtooth', volume: 0.05, slideTo: 240 });
  }
  if (t === 250) {
    // a flash... and he is there
    end.flash = 1;
    end.shake = 30;
    end.lwIn = true;
    lw.position.x = knightX + side * 60 - lw.width / 2;
    lw.attacksToTheRight = side > 0;
    end.rings.push({ x: lw.position.x + lw.width / 2, r: 10, life: 50 });
    fire.position.x += side * 50;
    playNoise({ duration: 1.2, volume: 0.2, filterFrequency: 1400 });
    playTone({ frequency: 46, duration: 1.4, type: 'sawtooth', volume: 0.12, slideTo: 24 });
    for (let spark = 0; spark < 40; spark += 1) end.sparks.push({ x: getFighterCenterX(fire), y: fire.position.y + 40, vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 6, life: 40 });
    stopReflecterBattleMusic();
  }
  if (t === 330) end.fmSay = { text: '...Vos.', t: 0 };
  if (t === 400) {
    // he turns to Knight, and takes something out: the bunker's emergency kit
    lw.attacksToTheRight = side < 0;
    end.artifact = { x: lw.position.x + lw.width / 2 - side * 20, y: lw.position.y + 60 };
  }
  if (end.artifact && t > 400 && t < 470) {
    end.artifact.x += (knightX - end.artifact.x) * 0.05;
    end.artifact.y += (knight.position.y - 10 - end.artifact.y) * 0.05;
  }
  if (t >= 470 && t < 600) {
    // the light of the kit: the burns close, the health comes back
    end.heal = Math.min(1, (t - 470) / 110);
    player1.health = Math.round(end.startHealth + (player1.maxHealth - end.startHealth) * end.heal);
    updateHealthBars();
    if (t % 6 === 0) end.sparks.push({ x: knightX + (Math.random() - 0.5) * 60, y: ground - Math.random() * 30, vx: 0, vy: -1.2, life: 60, heal: true });
    if (t === 470) playTone({ frequency: 523, duration: 2, type: 'sine', volume: 0.05, slideTo: 784 });
  }
  if (t === 600) {
    knight.knightKneel = false;
    end.artifact = null;
  }
  if (t === 640) end.knightSay = { text: '...Light... Warrior...', t: 0 };
  if (t === 720) {
    lw.attacksToTheRight = side > 0;
    end.voice = { text: '¿Otro heroe? ¿Uno mas?', t: 0, life: 140 };
  }
  if (t === 820) {
    // gone... and in front of him
    end.rings.push({ x: lw.position.x + lw.width / 2, r: 4, life: 20 });
    lw.position.x = getFighterCenterX(fire) - side * 56 - lw.width / 2;
    playTone({ frequency: 1800, duration: 0.12, type: 'triangle', volume: 0.05 });
  }
  if (t === 828) {
    // one blow
    end.flash = 1;
    playNoise({ duration: 0.5, volume: 0.25, filterFrequency: 1800 });
    playTone({ frequency: 60, duration: 0.6, type: 'square', volume: 0.12, slideTo: 30 });
  }
  if (t >= 830) end.black = 1;
  if (t > 960) {
    finishKnightB7Ending();
    return;
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (end.shake > 0) {
    end.shake -= 1;
    ctx.translate((Math.random() - 0.5) * Math.min(12, end.shake), (Math.random() - 0.5) * Math.min(8, end.shake));
  }
  drawKnightBBunkerOutside();
  // the fire in his hand, growing
  fire.isAttacking = t >= 826 && t < 830;
  drawBizarreFireMaster(fire, 1);
  if (t > 120 && t < 250) {
    const grow = (t - 120) / 130;
    const hx = getFighterCenterX(fire) - side * 30;
    const hy = fire.position.y + 40;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(hx, hy, 2, hx, hy, 20 + grow * 60);
    glow.addColorStop(0, `rgba(255, 213, 79, ${0.9 * grow})`);
    glow.addColorStop(0.5, `rgba(255, 61, 0, ${0.6 * grow})`);
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(hx - 90, hy - 90, 180, 180);
    ctx.restore();
    if (typeof drawFlametombFlame === 'function') drawFlametombFlame(hx, hy, 10 + grow * 18, time * 14, 'outer');
  }
  ctx.save();
  ctx.translate((Math.random() - 0.5) * (end.heal >= 1 ? 0.3 : 1.6), 0);
  knight.isAttacking = false;
  knight.draw();
  ctx.restore();
  if (end.lwIn && t < 830) {
    lw.isAttacking = t >= 826;
    lw.draw();
    if (typeof drawKnightBLwShadow === 'function') drawKnightBLwShadow(lw, 1);
  }
  if (end.artifact) drawKnightB7Artifact(end.artifact.x, end.artifact.y, t > 460 ? 1 : 0.4, time);
  if (end.heal > 0 && end.heal < 1) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const light = ctx.createRadialGradient(knightX, knight.position.y + 60, 10, knightX, knight.position.y + 60, 110);
    light.addColorStop(0, `rgba(200, 255, 210, ${0.45 * Math.sin(end.heal * Math.PI)})`);
    light.addColorStop(1, 'rgba(120, 255, 160, 0)');
    ctx.fillStyle = light;
    ctx.fillRect(knightX - 110, knight.position.y - 50, 220, 220);
    ctx.restore();
  }
  end.rings.forEach((ring) => {
    ring.life -= 1;
    ring.r += 22;
    ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, ring.life / 50)})`;
    ctx.lineWidth = 2 + ring.life / 8;
    ctx.beginPath();
    ctx.ellipse(ring.x, ground - 60, ring.r, ring.r * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  end.rings = end.rings.filter((ring) => ring.life > 0);
  end.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    if (!spark.heal) spark.vy += 0.25;
    spark.life -= 1;
    ctx.fillStyle = spark.heal ? `rgba(185, 246, 202, ${spark.life / 60})` : spark.life % 4 < 2 ? '#fff3e0' : '#ff9100';
    ctx.fillRect(spark.x - 1.5, spark.y - 1.5, 3, 3);
  });
  end.sparks = end.sparks.filter((spark) => spark.life > 0);
  ctx.restore();
  drawKnightBGloom(false);
  if (end.voice) {
    end.voice.t += 1;
    drawKnightB7Voice(end.voice.text, end.voice.t, end.voice.life);
  }
  if (end.fmSay && end.fmSay.t < 150) {
    end.fmSay.t += 1;
    drawKnightB7Text(getFighterCenterX(fire), fire.position.y - 24, end.fmSay.text, '#bdbdbd', Math.min(1, (150 - end.fmSay.t) / 25), true);
  }
  if (end.knightSay && end.knightSay.t < 160) {
    end.knightSay.t += 1;
    drawKnightB7Text(knightX, knight.position.y - 24, end.knightSay.text.slice(0, Math.floor(end.knightSay.t / 3)), '#90caf9', Math.min(1, (160 - end.knightSay.t) / 25), true);
  }
  if (end.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${end.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    end.flash = Math.max(0, end.flash - 0.04);
  }
  if (end.black) {
    // (cut)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  end.raf = requestAnimationFrame(tickKnightB7Ending);
}

function finishKnightB7Ending() {
  const end = knightB7.end;
  if (!end || end.over) return;
  end.over = true;
  cancelAnimationFrame(end.raf);
  document.body.classList.remove('knightb-ending');
  knightB7.ended = true;
  player1.knightKneel = false;
  player1.gamblerStunTimer = 0;
  player1.health = player1.maxHealth;
  player2.health = 0;
  updateHealthBars();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  finishFight();
}

// ---------- hooks ----------
(function hookChapterFiveBLevelSeven() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  wrap('configureKnightBLevel', (base) => function configureKnightBLevelWith7(...args) {
    if (selectedNormalArcadeLevel === 7) {
      player1.setCharacterType('normal', 'knight');
      configureKnightB7();
      return undefined;
    }
    return base.apply(this, args);
  });
  wrap('configureKnightBEnemy', (base) => function configureKnightBEnemyWith7(...args) {
    if (selectedNormalArcadeLevel === 7) return undefined;
    return base.apply(this, args);
  });
  // the bizarre Fire Master keeps his fan of fire and his echoing beam here too
  wrap('isKnightBBunkerFight', (base) => function isKnightBBunkerFightWith7(...args) {
    return base.apply(this, args) || isKnightB7Fight();
  });
  wrap('getReflecterBattleTrackKey', (base) => function getReflecterBattleTrackKeyWith7(...args) {
    if (isKnightB7() && !(typeof getVersusMusicChoice === 'function' && getVersusMusicChoice())) {
      if (knightB7.phase !== 'fight' || knightB7.end || knightB7.pause) return null;
      return knightB7.lastStand ? 'undyneEnd' : 'trueHero';
    }
    return base.apply(this, args);
  });
  wrap('handleKnightKey', (base) => function handleKnightKeyWith7(fighter, target, slot, ...rest) {
    if (!(isKnightB7Fight() && fighter === player1)) return base.call(this, fighter, target, slot, ...rest);
    if (!canFighterAct(fighter) || fighter.knightLungeTimer > 0 || knightB7.vulnerable || knightB7.end) return true;
    if (slot === 0) {
      if (castKnightLunge(fighter, target)) fighter.knightLungeCooldown = Math.round(fighter.knightLungeCooldown * knightB7Slowness());
    } else if (slot === 1) {
      castKnightB7Gauntlet(fighter, target);
    } else {
      castKnightB7Oath(fighter, target);
    }
    return true;
  });
  wrap('getPlayerAbilityCooldowns', (base) => function getPlayerAbilityCooldownsWith7(player, ...rest) {
    if (player === player1 && isKnightB7() && player.secretVariant === 'knight') {
      return {
        q: { active: true, name: 'Estocada rota', remaining: player.knightLungeCooldown || 0, max: getDebugCooldown(knightLungeCooldown, player) },
        f: { active: true, name: 'Guantelete volador', remaining: player.knightB7GauntletCd || 0, max: getDebugCooldown(knightB7GauntletCooldown, player) },
        r: { active: true, name: 'Juramento', remaining: player.knightB7OathCd || 0, max: getDebugCooldown(knightB7OathCooldown, player) },
      };
    }
    return base.call(this, player, ...rest);
  });
  wrap('applyDamage', (base) => function applyDamageWith7(attacker, target, damage, options = {}, ...rest) {
    if (!isKnightB7Fight()) return base.call(this, attacker, target, damage, options, ...rest);
    if (knightB7.end || knightB7.pause) return 0;
    if (target === player1) {
      if (knightB7.vulnerable) return 0;
      // he takes very little... but he has very little
      const wasStanding = knightB7.lastStand;
      const dealt = base.call(this, attacker, target, damage * 0.2 * (1 + knightB7.escalate), options, ...rest);
      if (player1.health <= 1) {
        player1.health = 1;
        if (!wasStanding) startKnightB7Pause();
        else weakenKnightB7();
        updateHealthBars();
      }
      return dealt;
    }
    if (target === player2) {
      // the weaker he gets, the less his blows do
      const k = Math.max(0.2, 1 - knightB7.weak * 0.09);
      const dealt = base.call(this, attacker, target, damage * k, options, ...rest);
      if (player2.health <= player2.maxHealth * 0.15) {
        // he cannot be beaten: the fire closes his wounds
        player2.health = Math.round(player2.maxHealth * 0.6);
        knightB7.regens += 1;
        knightB7.flash = 0.35;
        sayKnightB7(knightB7.regens % 2 ? '¿Creiste que podias ganar?' : 'Todavia no lo entendes.', '#ff1744', 150, 'voice');
        playTone({ frequency: 50, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 120 });
        updateHealthBars();
      }
      return dealt;
    }
    return base.call(this, attacker, target, damage, options, ...rest);
  });
  wrap('drawKnightBBunkerOutside', (base) => function drawKnightBBunkerOutsideWith7(...args) {
    const result = base.apply(this, args);
    if (isKnightB7() && knightB7.burning) drawKnightB7BackFire();
    return result;
  });
  wrap('finishFight', (base) => function finishFightWith7(...args) {
    if (isKnightB7() && knightB7.phase === 'fight' && !knightB7.ended) return undefined;
    return base.apply(this, args);
  });
  wrap('updateMonkeyCoconuts', (base) => function updateMonkeyCoconutsWith7(...args) {
    const result = base.apply(this, args);
    if (isKnightB7Fight() && !knightB7.end) updateKnightB7Fight();
    return result;
  });
  wrap('returnToMenu', (base) => function returnToMenuWith7(...args) {
    if (knightB7.end && !knightB7.end.over) {
      knightB7.end.over = true;
      cancelAnimationFrame(knightB7.end.raf);
      document.body.classList.remove('knightb-ending');
    }
    if (knightB7.scene) {
      knightB7.scene.done = true;
      window.removeEventListener('keydown', knightB7.scene.advance);
      canvas.removeEventListener('pointerdown', knightB7.scene.advance);
      document.body.classList.remove('knightb-ending');
      knightB7.scene = null;
    }
    knightB7.phase = 'intro';
    knightB7.pause = null;
    knightB7.burning = 0;
    player1.moveSpeed = playerMoveSpeed;
    player1.knightKneel = false;
    return base.apply(this, args);
  });
  // Knight, as he is in this level
  const baseDraw = Fighter.prototype.draw;
  Fighter.prototype.draw = function drawKnightB7Look(...args) {
    if (!(this.knightB7Look && this.secretVariant === 'knight' && isKnightB7())) return baseDraw.apply(this, args);
    const shield = this.knightShieldGone;
    const broken = this.knightSwordBroken;
    this.knightShieldGone = true;
    this.knightSwordBroken = true;
    const result = baseDraw.apply(this, args);
    this.knightShieldGone = shield;
    this.knightSwordBroken = broken;
    drawKnightB7Burns(this);
    return result;
  };
})();

// ================= LEVEL 8: Sin perdon =================
// Fire Master wakes up in the ash. A little further on, Light Warrior is waiting: the same face, but darker,
// his cape in the wind. He tries to reach him (why? you could stop it; was it worth it?)... Fire Master
// does not care: "he" makes him do it. Light Warrior thinks, looks at us for a moment, and decides: if a
// fight is what we want, a fight we will get. And no forgiveness for the bunker. He takes Fire Master up,
// far from Robledal, up to the platform of light.
const knightB8 = { phase: 'intro', scene: null, outro: null, outroDone: false };
reflecterBattleTrackSources.flowerDream = encodeURI("assetsaudio/A FLOWER'S DREAM - Deltarune Chapter 5_ Alternate Weird Route.mp3");
reflecterBattleTrackVolumes.flowerDream = 0.6;

function isKnightB8() {
  return isKnightBChapter() && selectedNormalArcadeLevel === 8;
}

function isKnightB8Fight() {
  return isKnightB8() && knightB8.phase === 'fight';
}

function configureKnightB8() {
  knightBSolo.active = false;
  document.body.classList.remove('knightb-solo');
  selectedMap = knightB8.phase === 'fight' ? 'knightBPlatform' : 'robledalBunkerOut';
  botEnabled = true;
  normalArcadeEnemyIndex = 1;
  normalArcadeEnemiesRemaining = 0;
  makeBizarreFireMaster(player1);
  player1.setMaxHealth(220);
  player1.health = player1.maxHealth;
  player2.setCharacterType('lightWarrior');
  player2.knightB8Look = true;
  player2.capeWind = true;
  botDifficulty = 'hard';
  applyBotDifficulty();
  // (this time he does not hold back)
  player2.setMaxHealth(1000);
  player2.health = player2.maxHealth;
  player2.damageMultiplier = 1.25;
  player2.moveSpeed = playerMoveSpeed * 1.15;
  player2.gamblerStunTimer = 0;
  player2.knightB8BoxIndex = 0;
  player2.knightB8BoxTimer = knightB8BoxFirstDelay;
  knightB8Pyres = [];
  knightB8Embers = [];
  knightB8.inBox = false;
  knightB8.healFx = null;
  knightB8.fireHealFx = null;
  knightB8.hope = 0;
  knightB8.outro = null;
  knightB8.outroDone = false;
  knightB8.cs = null;
  knightB8.lwLit = false;
  knightB8.superTombDone = false;
  knightB8.superTombIn = 0;
  knightB8.p2StartHealth = null;
  knightB8.omegaTitle = 0;
  knightB8.clashIn = 0;
  player1.knightB8Super = false;
  const checkpoint = knightB8.checkpoint || 'p1';
  knightB8.stage = checkpoint;
  reflecterBattleTrackStartOffsets.dawnHope = 0;
  knightB8LwAttacks = [];
  knightB8SuperFlametombs = [];
  knightB8.lwAttackTimer = undefined;
  knightB8.blind = 0;
  knightB8.lwCombo = null;
  knightB8.drainFx = 0;
  knightB8.kicks = null;
  knightB8.kick75 = false;
  knightB8.kick50 = false;
  knightB8.finaleIn = 0;
  knightB8.finaleDone = false;
  knightB8.sequencesDone = false;
  knightB8.omegaMoods = { normal: 1 };
  knightB8.omegaMoodTarget = 'normal';
  player2.scriptedFlight = false;
  if (checkpoint === 'climb' && knightB8.phase === 'fight') {
    knightB8.stage = 'p1';
    selectedMap = 'knightBPlatform';
    player2.knightB8BoxIndex = knightB8BoxCount;
    player1.health = Math.round(player1.maxHealth * 0.5);
    knightB8.pendingClimb = true;
  } else if (checkpoint !== 'p1' && knightB8.phase === 'fight') {
    // (a retry after the climb starts on top of the Gran Farol)
    selectedMap = 'farolTop';
    player2.knightB8BoxIndex = knightB8BoxCount;
    makeKnightB8Super(player1);
    player2.health = Math.round(player2.maxHealth * 0.8);
    if (checkpoint === 'p3') {
      knightB8.superTombDone = true;
      applyKnightB8Omega(player2);
      reflecterBattleTrackStartOffsets.dawnHope = 29;
      reflecterBattleMusic.restart = true;
    }
  }
  updateHealthBars();
  updateCombatHudIdentity();
}

// his face: the same shadow as on the radio... deeper
function drawKnightB8Shadow(lw, stare) {
  if (typeof drawKnightBLwShadow === 'function') drawKnightBLwShadow(lw, 1);
  const x = lw.position.x;
  const y = lw.position.y;
  const w = lw.width;
  ctx.save();
  const shade = ctx.createLinearGradient(0, y - 8, 0, y + 80);
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  shade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(x - 2, y - 8, w + 4, 88);
  if (stare) {
    // two pinpoints of light in the dark lenses
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(x + 19.5, y + 20, 2, 2);
    ctx.fillRect(x + w - 21.5, y + 20, 2, 2);
  }
  ctx.restore();
}

// the morning after the fire, outside the bunker: ash and smoke
function drawKnightB8Ash(time) {
  ctx.save();
  ctx.fillStyle = 'rgba(40, 30, 30, 0.35)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let flake = 0; flake < 40; flake += 1) {
    const fx = ((flake * 97 + time * 30) % (canvas.width + 40)) - 20;
    const fy = ((flake * 61 + time * 18) % ground);
    ctx.fillStyle = flake % 5 ? 'rgba(200, 200, 200, 0.5)' : 'rgba(255, 140, 60, 0.7)';
    ctx.fillRect(fx, fy, 2, 2);
  }
  ctx.restore();
}

const knightB8Lines = [
  { who: 'lw', text: '...Despertaste.' },
  { who: 'lw', text: 'Knight esta adentro. Vivo. Le di lo ultimo que quedaba en el botiquin del refugio.' },
  { who: 'lw', text: 'Antes de venir aca, baje al bunker. Vi el polvo. Vi los dibujos de los chicos en la pared.' },
  { who: 'lw', text: '¿Por que, Fire Master? ¿Por que ellos?' },
  { who: 'lw', text: 'Te conozco. Te vi pelear por otros. Se que podes pararlo... se que todavia podes.' },
  { who: 'lw', text: 'Decime que esto vale la pena. Decime que todo ese polvo... valio la pena.' },
  { who: 'fireMaster', text: '...No soy yo, Light Warrior.' },
  { who: 'fireMaster', text: 'El me obliga. El decide. Yo solo... miro.' },
  { who: 'fireMaster', text: 'Y ya ni siquiera me importa.' },
  { who: 'voice', text: 'Ni siquiera le importa. ¿Lo escuchaste, heroe?' },
  { who: 'lw', text: '...', think: true },
  { who: 'lw', text: '...', us: true },
  { who: 'lw', text: '...Asi que eso es lo que quieren. Una pelea.', us: true },
  { who: 'lw', text: 'Entonces van a tener una pelea.', us: true },
  { who: 'lw', text: 'Pero no esperen perdon. No por el bunker. No por ellos. Nunca.', us: true },
  { who: 'lw', text: '...Aca no. Robledal ya sufrio suficiente.' },
];

function drawKnightB8Dialog(line, typed) {
  const text = line.text.slice(0, typed);
  const voice = line.who === 'voice';
  ctx.save();
  if (voice) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
  const boxY = 24;
  ctx.fillStyle = voice ? 'rgba(20, 0, 4, 0.92)' : 'rgba(8, 8, 12, 0.9)';
  ctx.fillRect(40, boxY, canvas.width - 80, 100);
  ctx.strokeStyle = voice ? '#ff1744' : line.who === 'lw' ? '#fdd835' : '#e0e0e0';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, boxY, canvas.width - 80, 100);
  const names = { lw: 'LIGHT WARRIOR', fireMaster: 'FIRE MASTER', voice: '? ? ?' };
  ctx.fillStyle = voice ? '#ff1744' : line.who === 'lw' ? '#fdd835' : '#ff8a65';
  ctx.font = "900 15px 'Courier New', monospace";
  ctx.textAlign = 'left';
  ctx.fillText(names[line.who], 62, boxY + 26);
  if (voice) {
    ctx.font = "900 21px 'Courier New', monospace";
    ctx.fillStyle = `rgba(255, 23, 68, ${0.8 + Math.random() * 0.2})`;
  } else if (line.who === 'fireMaster') {
    ctx.font = "italic 19px Georgia, serif";
    ctx.fillStyle = '#bcaaa4';
  } else {
    ctx.font = "700 18px 'Courier New', monospace";
    ctx.fillStyle = '#fff8e1';
  }
  wrapNoteText(text, canvas.width - 160).forEach((row, index) => ctx.fillText(row, 62, boxY + 54 + index * 24));
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#757575';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER / CLICK', canvas.width - 56, boxY + 92);
  ctx.restore();
}

function drawKnightB8Versus(frame) {
  const width = canvas.width;
  const slide = Math.min(1, frame / 18);
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, width, canvas.height);
  const leftX = -width + slide * width;
  const rightX = width - slide * (width / 2);
  const leftBar = ctx.createLinearGradient(leftX, 0, leftX + width / 2, 0);
  leftBar.addColorStop(0, '#3a1400');
  leftBar.addColorStop(1, '#b8450f');
  ctx.fillStyle = leftBar;
  ctx.fillRect(leftX, 200, width / 2, 110);
  const rightBar = ctx.createLinearGradient(rightX, 0, rightX + width / 2, 0);
  rightBar.addColorStop(0, '#c9a227');
  rightBar.addColorStop(1, '#3d3000');
  ctx.fillStyle = rightBar;
  ctx.fillRect(rightX, 200, width / 2, 110);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(width / 2 - 2, 200, 4, 110 * slide);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.font = '900 38px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.strokeText('FIRE MASTER  VS  LIGHT WARRIOR', width / 2, 250);
  ctx.fillText('FIRE MASTER  VS  LIGHT WARRIOR', width / 2, 250);
  if (frame > 40) {
    ctx.fillStyle = '#fdd835';
    ctx.font = '900 30px Courier New, monospace';
    ctx.strokeText('SIN PERDON', width / 2, 292);
    ctx.fillText('SIN PERDON', width / 2, 292);
  }
  ctx.restore();
}

function startKnightB8Intro() {
  if (knightB8.phase === 'fight') return;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  const fire = new Fighter({ x: 0, y: 0, color: '#b8450f', attacksToTheRight: true });
  makeBizarreFireMaster(fire);
  fire.position = { x: 230, y: ground - fire.height };
  const lw = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: false });
  lw.setCharacterType('lightWarrior');
  lw.capeWind = true;
  lw.position = { x: 720, y: ground - lw.height };
  const scene = { f: 0, stage: 'wake', line: 0, typed: 0, lineT: 0, t: 0, fire, lw, peak: false, flash: 0 };
  knightB8.scene = scene;
  scene.advance = (event) => {
    if (event.type === 'keydown' && !['Enter', ' ', 'Escape'].includes(event.key)) return;
    if (event.type === 'keydown') event.preventDefault();
    if (event.key === 'Escape') {
      finishKnightB8Intro();
      return;
    }
    if (scene.stage !== 'talk') return;
    const line = knightB8Lines[scene.line];
    if (!line) return;
    if (scene.typed < line.text.length) scene.typed = line.text.length;
    else knightB8NextLine();
  };
  window.addEventListener('keydown', scene.advance);
  canvas.addEventListener('pointerdown', scene.advance);
  document.body.classList.add('knightb-ending');
  if (typeof startKnightBWind === 'function') startKnightBWind();
  requestAnimationFrame(tickKnightB8Intro);
}

function knightB8NextLine() {
  const scene = knightB8.scene;
  scene.line += 1;
  scene.typed = 0;
  scene.lineT = 0;
  playSound('menuMove');
  const line = knightB8Lines[scene.line];
  if (line && line.who === 'voice') {
    playTone({ frequency: 45, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    playNoise({ duration: 0.6, volume: 0.05, filterFrequency: 500 });
  }
  if (line && line.us && !knightB8Lines[scene.line - 1].us) playTone({ frequency: 70, duration: 1.6, type: 'sine', volume: 0.07 });
  if (!line) {
    scene.stage = 'rise';
    scene.t = 0;
  }
}

function tickKnightB8Intro() {
  const scene = knightB8.scene;
  if (!scene || scene.done) return;
  scene.f += 1;
  scene.t += 1;
  const t = scene.t;
  const time = performance.now() / 1000;
  const { fire, lw } = scene;
  if (typeof updateKnightBWind === 'function') updateKnightBWind();
  let fireRot = 0;
  // ---------- what happens ----------
  if (scene.stage === 'wake') {
    // lying in the ash... he opens his eyes and gets up
    const up = Math.max(0, Math.min(1, (t - 140) / 80));
    fireRot = (-Math.PI / 2) * (1 - up);
    if (t === 160) playNoise({ duration: 0.4, volume: 0.04, filterFrequency: 500 });
    if (t > 260) {
      scene.stage = 'walk';
      scene.t = 0;
    }
  } else if (scene.stage === 'walk') {
    fire.position.x = Math.min(420, fire.position.x + 1);
    fire.velocity.x = fire.position.x < 420 ? 1 : 0;
    if (t % 36 === 0 && fire.position.x < 420) playSound('cutsceneStep');
    if (t > 230) {
      scene.stage = 'talk';
      scene.t = 0;
      fire.velocity.x = 0;
    }
  } else if (scene.stage === 'talk') {
    const line = knightB8Lines[scene.line];
    if (line) {
      if (scene.f % 2 === 0) scene.typed = Math.min(line.text.length, scene.typed + 1);
      scene.lineT += 1;
      if (scene.typed >= line.text.length && scene.lineT > line.text.length * 2 + (line.text === '...' ? 130 : 170)) knightB8NextLine();
    }
  } else if (scene.stage === 'rise') {
    // he rises... takes Fire Master... and both go up, far from Robledal
    if (t < 70) {
      lw.position.y = ground - lw.height - Math.min(90, t * 1.5);
      if (t === 1) playTone({ frequency: 220, duration: 1.4, type: 'sine', volume: 0.05, slideTo: 660 });
    } else if (t < 80) {
      lw.position.x += (fire.position.x + fire.width + 4 - lw.position.x) * 0.4;
      lw.position.y += (fire.position.y - lw.position.y) * 0.4;
      if (t === 78) {
        scene.flash = 0.6;
        playNoise({ duration: 0.4, volume: 0.12, filterFrequency: 1600 });
      }
    } else if (t < 140) {
      lw.position.y -= 10;
      fire.position.y -= 10;
      if (t === 80) playNoise({ duration: 1, volume: 0.1, filterFrequency: 900 });
    } else if (t === 140) {
      scene.flash = 1;
      scene.stage = 'land';
      scene.t = 0;
      scene.peak = true;
      fire.position = { x: 260, y: -200 };
      lw.position = { x: 720, y: -300 };
      fire.attacksToTheRight = true;
      lw.attacksToTheRight = false;
      fire.vy = 0;
    }
  } else if (scene.stage === 'land') {
    // he is thrown down onto the rock; Light Warrior comes down slowly
    if (fire.position.y < ground - fire.height) {
      fire.vy += 0.9;
      fire.position.y = Math.min(ground - fire.height, fire.position.y + fire.vy);
      if (fire.position.y >= ground - fire.height) {
        scene.shake = 20;
        playNoise({ duration: 0.6, volume: 0.15, filterFrequency: 500 });
        playTone({ frequency: 50, duration: 0.6, type: 'square', volume: 0.08, slideTo: 30 });
      }
    }
    lw.position.y = Math.min(ground - lw.height, lw.position.y + 3);
    if (t > 180) {
      scene.stage = 'versus';
      scene.t = 0;
    }
  } else if (scene.stage === 'versus' && t > 130) {
    finishKnightB8Intro();
    return;
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (scene.shake > 0) {
    scene.shake -= 1;
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
  }
  if (scene.peak) drawKnightB8Platform();
  else {
    drawKnightBBunkerOutside();
    drawKnightB8Ash(time);
  }
  ctx.save();
  if (fireRot) {
    const pivot = fire.position.x + fire.width / 2;
    ctx.translate(0, -(fire.width / 2) * (fireRot / (-Math.PI / 2)));
    ctx.translate(pivot, ground);
    ctx.rotate(fireRot);
    ctx.translate(-pivot, -ground);
  }
  fire.isAttacking = false;
  drawBizarreFireMaster(fire, 1);
  ctx.restore();
  if (scene.stage === 'rise' && t < 70) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const cx = lw.position.x + lw.width / 2;
    const aura = ctx.createRadialGradient(cx, lw.position.y + 60, 10, cx, lw.position.y + 60, 90);
    aura.addColorStop(0, `rgba(255, 241, 118, ${0.5 * t / 70})`);
    aura.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(cx - 100, lw.position.y - 40, 200, 220);
    ctx.restore();
  }
  lw.isAttacking = false;
  const line = scene.stage === 'talk' ? knightB8Lines[scene.line] : null;
  lw.eyeLook = line && line.think ? 1 : 0;
  lw.draw();
  drawKnightB8Shadow(lw, false);
  if (!scene.peak) drawKnightBGloom(false);
  if (scene.stage === 'wake' && t > 60 && t < 200) drawKnightB7Text(fire.position.x + 60, ground - 50, t < 130 ? '...' : '...¿Que...?', '#bdbdbd', Math.min(1, (200 - t) / 25), true);
  // he looks at us
  if (line && line.us) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const old = { ...lw.position };
    ctx.translate(canvas.width / 2, canvas.height * 0.98);
    ctx.scale(3.8, 3.8);
    lw.position = { x: -lw.width / 2, y: -lw.height };
    lw.eyeLook = 0;
    lw.draw();
    drawKnightB8Shadow(lw, true);
    lw.position = old;
    ctx.restore();
  }
  ctx.restore();
  if (line) drawKnightB8Dialog(line, scene.typed);
  if (scene.stage === 'versus') drawKnightB8Versus(t);
  if (scene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${scene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    scene.flash = Math.max(0, scene.flash - 0.03);
  }
  requestAnimationFrame(tickKnightB8Intro);
}

function finishKnightB8Intro() {
  const scene = knightB8.scene;
  if (!scene) return;
  scene.done = true;
  window.removeEventListener('keydown', scene.advance);
  canvas.removeEventListener('pointerdown', scene.advance);
  document.body.classList.remove('knightb-ending');
  if (typeof stopKnightBWind === 'function') stopKnightBWind();
  knightB8.scene = null;
  knightB8.phase = 'fight';
  selectedMap = 'knightBPlatform';
  player1.position = { x: 260, y: ground - player1.height };
  player2.position = { x: 720, y: ground - player2.height };
  player1.attacksToTheRight = true;
  player2.attacksToTheRight = false;
  reflecterBattleMusic.restart = true;
  gameStarted = true;
  gameOver = false;
  animate();
}

// when he falls: on one knee, his cape still in the wind
function startKnightB8Outro(done) {
  knightB8.outro = { t: 0, done };
  stopReflecterBattleMusic();
  player1.gamblerStunTimer = 999999;
  document.body.classList.add('knightb-ending');
  knightB8.outro.raf = requestAnimationFrame(tickKnightB8Outro);
}

function tickKnightB8Outro() {
  const outro = knightB8.outro;
  if (!outro || outro.over) return;
  outro.t += 1;
  const t = outro.t;
  stopReflecterBattleMusic();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (selectedMap === 'farolTop') drawFarolTopStage(0);
  else drawKnightB8Platform();
  player1.isAttacking = false;
  drawBizarreFireMaster(player1, 1);
  const lw = player2;
  ctx.save();
  const pivot = lw.position.x + lw.width / 2;
  ctx.translate(pivot, ground);
  ctx.scale(1, 0.84);
  ctx.translate(-pivot, -ground);
  lw.isAttacking = false;
  lw.draw();
  drawKnightB8Shadow(lw, false);
  ctx.restore();
  if (t > 60 && t < 230) drawKnightB7Text(pivot, lw.position.y + 10, '...Esto no termina aca, Fire Master.', '#fff59d', Math.min(1, (230 - t) / 25), false);
  if (t > 250) drawKnightB7Voice('Ya veremos.', t - 250, 140, 200);
  if (t > 380) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (t - 380) / 40)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (t > 440) {
    outro.over = true;
    document.body.classList.remove('knightb-ending');
    knightB8.outroDone = true;
    player1.gamblerStunTimer = 0;
    if (outro.done) outro.done();
    return;
  }
  outro.raf = requestAnimationFrame(tickKnightB8Outro);
}

(function hookChapterFiveBLevelEight() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  wrap('configureKnightBLevel', (base) => function configureKnightBLevelWith8(...args) {
    if (selectedNormalArcadeLevel === 8) {
      configureKnightB8();
      return undefined;
    }
    return base.apply(this, args);
  });
  wrap('configureKnightBEnemy', (base) => function configureKnightBEnemyWith8(...args) {
    if (selectedNormalArcadeLevel === 8) return undefined;
    return base.apply(this, args);
  });
  wrap('isKnightBBunkerFight', (base) => function isKnightBBunkerFightWith8(...args) {
    return base.apply(this, args) || isKnightB8Fight();
  });
  wrap('getReflecterBattleTrackKey', (base) => function getReflecterBattleTrackKeyWith8(...args) {
    if (isKnightB8() && !(typeof getVersusMusicChoice === 'function' && getVersusMusicChoice())) {
      return getKnightB8MusicKey();
    }
    return base.apply(this, args);
  });
  wrap('drawStage', (base) => function drawStageWith8(...args) {
    if (selectedMap === 'farolTop' && isKnightB8()) {
      drawKnightB8FarolSky();
      return undefined;
    }
    if (selectedMap === 'knightBPlatform') {
      drawKnightB8Platform();
      return undefined;
    }
    return base.apply(this, args);
  });
  wrap('finishFight', (base) => function finishFightWith8(...args) {
    if (knightB8.outro && !knightB8.outro.over) return undefined;
    if (isKnightB8() && knightB8.cs) return undefined;
    if (isKnightB8Fight() && knightB8.stage !== 'p3' && player2.health <= 0) {
      player2.health = Math.max(1, player2.maxHealth * 0.1);
      if (knightB8.stage === 'p2') guardKnightB8FarolHealth();
      gameOver = false;
      return undefined;
    }
    if (isKnightB8Fight() && !knightB8.outroDone && !gameOver && player2.health <= 0 && player1.health > 0) {
      startKnightB8Outro(() => base.apply(this, args));
      return undefined;
    }
    return base.apply(this, args);
  });
  wrap('returnToMenu', (base) => function returnToMenuWith8(...args) {
    if (knightB8.scene) {
      knightB8.scene.done = true;
      window.removeEventListener('keydown', knightB8.scene.advance);
      canvas.removeEventListener('pointerdown', knightB8.scene.advance);
      knightB8.scene = null;
    }
    if (knightB8.outro && !knightB8.outro.over) {
      knightB8.outro.over = true;
      cancelAnimationFrame(knightB8.outro.raf);
    }
    if (knightB8.cs) {
      knightB8.cs.over = true;
      cancelAnimationFrame(knightB8.cs.raf);
      if (knightB8.cs.sound) knightB8.cs.sound.pause();
      knightB8.cs = null;
    }
    document.body.classList.remove('knightb-ending');
    knightB8.phase = 'intro';
    knightB8.kicks = null;
    if (player2.scriptedFlight && isKnightB8()) player2.scriptedFlight = false;
    lightClashMusicFade = 1;
    player2.capeWind = false;
    player2.knightB8Look = false;
    return base.apply(this, args);
  });
  // Light Warrior in this level: his face always in the shadow
  const baseDraw = Fighter.prototype.draw;
  Fighter.prototype.draw = function drawKnightB8Look(...args) {
    const superFire = this === player1 && this.knightB8Super && isKnightB8();
    const omega = this === player2 && this.lightWarriorOmegaTransformed && isKnightB8();
    if (superFire) drawKnightB8SuperAura(this, 'back');
    if (omega) drawKnightB8OmegaAura(this, 'back');
    const result = baseDraw.apply(this, args);
    if (superFire) drawKnightB8SuperAura(this, 'front');
    if (omega) drawKnightB8OmegaAura(this, 'front');
    if (this.knightB8Look && this === player2 && this.characterType === 'lightWarrior' && isKnightB8() && !this.lightWarriorOmegaTransformed && !knightB8.lwLit) drawKnightB8Shadow(this, false);
    return result;
  };
})();

// ---------- level 8: the platform of light... as it is tonight ----------
// a cloudy sky, close to dusk. But at three moments of A FLOWER'S DREAM (1:28-1:52, 2:38-3:08, 3:43-4:32)
// the sky clears and turns soft and warm: hope, calm, in spite of everything
const knightB8HopeWindows = [[88, 112], [158, 188], [223, 272]];


function drawKnightB8Platform() {
  drawLightSkyStage();
  const width = canvas.width;
  const time = performance.now() / 1000;
  const moodIndex = getKnightB8MoodIndex();
  knightB8.moods = (knightB8.moods || [0, 0, 0]).map((value, index) => value + ((moodIndex === index + 1 ? 1 : 0) - value) * 0.02);
  const [moodSun, moodAurora, moodRain] = knightB8.moods;
  const hope = Math.max(moodSun, moodAurora, moodRain);
  const skyBottom = ground - 40;
  ctx.save();
  // a cloudy sky, close to dusk
  const dusk = ctx.createLinearGradient(0, 0, 0, skyBottom);
  dusk.addColorStop(0, 'rgba(46, 40, 64, 0.88)');
  dusk.addColorStop(0.55, 'rgba(110, 82, 98, 0.82)');
  dusk.addColorStop(0.85, 'rgba(201, 130, 90, 0.7)');
  dusk.addColorStop(1, 'rgba(201, 130, 90, 0)');
  ctx.fillStyle = dusk;
  ctx.fillRect(0, 0, width, skyBottom);
  for (let band = 0; band < 4; band += 1) {
    ctx.fillStyle = `rgba(${70 + band * 12}, ${64 + band * 10}, ${84 + band * 8}, 0.55)`;
    for (let puff = -1; puff < 9; puff += 1) {
      const px = ((puff * 150 + band * 60 + time * (5 + band * 2)) % (width + 300)) - 150;
      ctx.beginPath();
      ctx.ellipse(px, 50 + band * 55, 120, 26 + band * 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // hope: the clouds open, a soft clear sky, warm light, petals in the wind
  if (moodSun > 0.01) {
    ctx.globalAlpha = moodSun;
    const clear = ctx.createLinearGradient(0, 0, 0, skyBottom);
    clear.addColorStop(0, '#86b9e8');
    clear.addColorStop(0.55, '#f3c6b0');
    clear.addColorStop(1, '#ffe7b3');
    ctx.fillStyle = clear;
    ctx.fillRect(0, 0, width, skyBottom);
    const sun = ctx.createRadialGradient(760, skyBottom - 70, 10, 760, skyBottom - 70, 260);
    sun.addColorStop(0, 'rgba(255, 252, 230, 0.95)');
    sun.addColorStop(0.18, 'rgba(255, 236, 179, 0.7)');
    sun.addColorStop(1, 'rgba(255, 236, 179, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(500, skyBottom - 330, 520, 330);
    // soft rays
    ctx.globalCompositeOperation = 'lighter';
    for (let ray = 0; ray < 7; ray += 1) {
      const angle = Math.PI + 0.25 + ray * 0.32 + Math.sin(time * 0.3 + ray) * 0.03;
      ctx.fillStyle = `rgba(255, 245, 210, ${0.06 * moodSun})`;
      ctx.beginPath();
      ctx.moveTo(760, skyBottom - 70);
      ctx.lineTo(760 + Math.cos(angle - 0.05) * 900, skyBottom - 70 + Math.sin(angle - 0.05) * 900);
      ctx.lineTo(760 + Math.cos(angle + 0.05) * 900, skyBottom - 70 + Math.sin(angle + 0.05) * 900);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    for (let puff = -1; puff < 8; puff += 1) {
      const px = ((puff * 170 + time * 4) % (width + 300)) - 150;
      ctx.fillStyle = 'rgba(255, 246, 235, 0.75)';
      ctx.beginPath();
      ctx.ellipse(px, 90 + (puff % 3) * 40, 90, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (moodAurora > 0.01) drawKnightB8AuroraSky(moodAurora, skyBottom, time);
  if (moodRain > 0.01) drawKnightB8RainSky(moodRain, skyBottom, time);
  // Robledal, down below: a red glow and a column of smoke through the clouds (softer when the sky clears)
  const ember = (1 - hope * 0.7);
  const fire = ctx.createRadialGradient(210, ground - 50, 4, 210, ground - 50, 120);
  fire.addColorStop(0, `rgba(255, 61, 0, ${(0.55 + Math.sin(time * 5) * 0.08) * ember})`);
  fire.addColorStop(1, 'rgba(255, 61, 0, 0)');
  ctx.fillStyle = fire;
  ctx.fillRect(90, ground - 170, 240, 240);
  for (let puff = 0; puff < 7; puff += 1) {
    const rise = (time * 14 + puff * 40) % 280;
    ctx.fillStyle = `rgba(35, 28, 32, ${0.55 * (1 - rise / 280) * ember})`;
    ctx.beginPath();
    ctx.ellipse(210 + Math.sin(time * 0.7 + puff) * 14 + rise * 0.25, ground - 60 - rise, 26 + rise * 0.15, 14 + rise * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the platform: stretches of it go dark (not while the sky is clear)...
  for (let segment = 30; segment < width - 30; segment += 60) {
    if (Math.sin(time * 6 + segment * 0.37) > 0.55 + hope) {
      ctx.fillStyle = 'rgba(10, 6, 14, 0.75)';
      ctx.fillRect(segment, ground, 60, 14);
    }
  }
  // ...and it is cracked
  ctx.strokeStyle = 'rgba(15, 8, 20, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  [120, 330, 505, 690, 880].forEach((cx, index) => {
    ctx.moveTo(cx, ground);
    ctx.lineTo(cx + 8, ground + 5);
    ctx.lineTo(cx - 4 + index, ground + 9);
    ctx.lineTo(cx + 10, ground + 14);
  });
  ctx.stroke();
  drawKnightB8MoodParticles(knightB8.moods, time);
  if (moodSun > 0.01) {
    // a warm light over the platform, and petals drifting by
    ctx.fillStyle = `rgba(255, 224, 178, ${0.12 * moodSun})`;
    ctx.fillRect(0, 0, width, canvas.height);
    for (let petal = 0; petal < 26; petal += 1) {
      const px = ((petal * 113 + time * (30 + (petal % 5) * 6)) % (width + 60)) - 30;
      const py = (petal * 47 + time * 16 + Math.sin(time * 2 + petal) * 20) % ground;
      ctx.save();
      ctx.globalAlpha = moodSun * 0.85;
      ctx.translate(px, py);
      ctx.rotate(time * 2 + petal);
      ctx.fillStyle = petal % 3 ? '#f8bbd0' : '#fffde7';
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  // ash (less of it when the sky clears)
  for (let flake = 0; flake < Math.round(36 * (1 - hope * 0.8)); flake += 1) {
    const fx = ((flake * 97 + time * 24) % (width + 40)) - 20;
    const fy = (flake * 61 + time * 20) % ground;
    ctx.fillStyle = flake % 6 ? 'rgba(190, 190, 200, 0.45)' : 'rgba(255, 112, 67, 0.7)';
    ctx.fillRect(fx, fy, 2, 2);
  }
  ctx.restore();
}

// ---------- his BOX ATTACKS: alone this time, with his dead friends' attacks ----------
const knightB8BoxFirstDelay = 600;
const knightB8BoxInterval = 1000;
const knightB8BoxCount = 4;
dodgeRoundThemes.knightB8Box1 = {
  title: 'BOX ATTACK',
  border: ['#fff59d', '#4fc3f7'],
  charged: true,
  dashColor: '255, 112, 40',
  // (the parry only works on what is NOT his light, and nothing marks which ones)
  hiddenParry: true,
  // (precision: the dash finds the parryable attacks, and bends toward them while it slides)
  parryAssist: true,
  parryHeal: 0.06,
  noTargetHeal: true,
  tier: 1,
  phaseFrames: 600,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'BOX ATTACK. ...Esta vez no tengo a nadie a quien llamar.' },
    { speaker: 'lightWarrior', text: 'Celeste tiraba los cuchillos asi. Desde arriba. Riendose.' },
    { speaker: 'lightWarrior', text: 'Y Seto... Seto nunca soltaba sus libros.' },
  ],
  phases: [
    { pattern: 'kb8Knives', caption: 'LOS CUCHILLOS DE CELESTE... CASI' },
    { pattern: 'kb8Books', caption: 'LOS LIBROS DE SETO, CON LUZ' },
  ],
};
dodgeRoundThemes.knightB8Box2 = {
  title: 'BOX ATTACK',
  border: ['#fff59d', '#ff8a65'],
  charged: true,
  dashColor: '255, 112, 40',
  // (the parry only works on what is NOT his light, and nothing marks which ones)
  hiddenParry: true,
  // (precision: the dash finds the parryable attacks, and bends toward them while it slides)
  parryAssist: true,
  parryHeal: 0.06,
  noTargetHeal: true,
  tier: 2,
  phaseFrames: 680,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'El chef me guardaba sopa. Siempre. Aunque llegara tarde.' },
    { speaker: 'lightWarrior', text: 'Mochi entrenaba todas las mananas. Todas.' },
  ],
  phases: [
    { pattern: 'kb8Pastry', caption: 'LOS PASTELES DEL CHEF' },
    { pattern: 'kb8Gloves', caption: 'LOS GUANTES DE MOCHI' },
    { pattern: 'kb8Cake', caption: 'EL PASTEL QUE NADIE VA A TERMINAR' },
  ],
};
dodgeRoundThemes.knightB8Box3 = {
  title: 'BOX ATTACK',
  border: ['#fff59d', '#ff7043'],
  charged: true,
  dashColor: '255, 112, 40',
  // (the parry only works on what is NOT his light, and nothing marks which ones)
  hiddenParry: true,
  // (precision: the dash finds the parryable attacks, and bends toward them while it slides)
  parryAssist: true,
  parryHeal: 0.06,
  noTargetHeal: true,
  tier: 3,
  phaseFrames: 760,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'El sheriff decia que la ley es la ley. Que alguien tiene que hacerla cumplir.' },
    { speaker: 'lightWarrior', text: 'Hoy me toca a mi.' },
  ],
  phases: [
    { pattern: 'kb8Bullets', caption: 'LAS BALAS DEL SHERIFF' },
    { pattern: 'kb8Stars', caption: 'LA ESTRELLA DEL SHERIFF' },
    { pattern: 'kb8Judgment', caption: 'EL ULTIMO JUICIO DEL SHERIFF' },
  ],
};
dodgeRoundThemes.knightB8Box4 = {
  title: 'BOX ATTACK FINAL',
  border: ['#ffffff', '#fdd835'],
  charged: true,
  dashColor: '255, 112, 40',
  // (the parry only works on what is NOT his light, and nothing marks which ones)
  hiddenParry: true,
  // (precision: the dash finds the parryable attacks, and bends toward them while it slides)
  parryAssist: true,
  parryHeal: 0.06,
  noTargetHeal: true,
  tier: 4,
  phaseFrames: 720,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'Esta es mia. ...Y de todos ellos.' },
    { speaker: 'lightWarrior', text: 'No te voy a dejar salir de aca hasta que entiendas lo que hiciste.' },
  ],
  phases: [
    { pattern: 'kb8Combo1', caption: 'POR ROBLEDAL' },
    { pattern: 'kb8Spiral', caption: 'ESPIRAL DE LUZ' },
    { pattern: 'kb8Crown', caption: 'LA CORONA QUE SE CIERRA' },
    { pattern: 'kb8Combo2', caption: 'POR EL BUNKER' },
    { pattern: 'kb8Meteors', caption: 'ESTRELLAS QUE CAEN' },
    { pattern: 'kb8Maze', caption: 'EL LABERINTO DE LUZ' },
    { pattern: 'kb8Combo3', caption: 'POR TODOS ELLOS' },
  ],
};


// the patterns of his BOX ATTACKS in this fight: his friends' attacks, imitated (a little off, with light
// in them)... and in the last one only his own, all together
function spawnKnightB8BoxPattern(pattern, t, rawPush, box, soul) {
  if (!pattern.startsWith('kb8')) return false;
  const round = dodgeRound;
  const speedUp = 1 + 0.12 * ((round.config.tier || 1) - 1);
  const push = (item) => {
    // his friends' attacks can be parried; his light cannot
    item.blue = ['drop', 'side', 'aimed', 'bouncer'].includes(item.type) && Boolean(item.sprite) && item.sprite !== 'lightOrb';
    if (item.vx) item.vx *= speedUp;
    if (item.vy) item.vy *= speedUp;
    if (item.speed) item.speed *= speedUp;
    rawPush(item);
  };
  const fromRight = box.x + box.width - 10;
  const lightShot = (x, y, angle, speed = 5.5, extra = {}) => push({ type: 'aimed', sprite: 'lightOrb', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 9, ...extra });
  const beam = (orient, pos, extra = {}) => push({ type: 'beam', orient, pos, size: 34, warn: 34, active: 20, life: 80, ...extra });
  const ring = (extra = {}) => push({ type: 'ring', x: box.x + box.width / 2, y: box.y + box.height / 2, radius: 8, speed: 2.6, gap: Math.random() * Math.PI * 2, gapSize: 1.1, life: 400, ...extra });
  const disc = (extra = {}) => push({ type: 'disc', r: 15, warn: 26, life: 420, bounces: 5, blue: false, ...extra });
  const bouncingDisc = () => {
    const corner = Math.floor(Math.random() * 4);
    const x = corner % 2 === 0 ? box.x + 24 : box.x + box.width - 24;
    const y = corner < 2 ? box.y + 24 : box.y + box.height - 24;
    const angle = Math.atan2(soul.y - y, soul.x - x) + (Math.random() - 0.5) * 0.6;
    disc({ x, y, vx: Math.cos(angle) * 4.4, vy: Math.sin(angle) * 4.4 });
  };
  const boomerang = () => disc({ x: box.x + box.width + 20, y: soul.y, vx: -8.5, vy: 0, boomerang: true, pull: 0.12, warn: 22 });
  const clampX = (x) => Math.max(box.x + 20, Math.min(box.x + box.width - 20, x));
  const clampY = (y) => Math.max(box.y + 20, Math.min(box.y + box.height - 20, y));
  const sideItem = (sprite, speed, r, extra = {}) => {
    const side = Math.random() < 0.5 ? -1 : 1;
    push({ type: 'side', sprite, x: side < 0 ? box.x - 22 : box.x + box.width + 22, y: box.y + 22 + Math.random() * (box.height - 44), vx: -side * speed, vy: 0, r, ...extra });
  };
  const bulletRow = (fromLeft, rows = 7, speed = 7) => {
    const gap = Math.floor(Math.random() * (rows - 1));
    for (let row = 0; row < rows; row += 1) {
      if (row === gap || row === gap + 1) continue;
      push({ type: 'side', sprite: 'bullet', x: fromLeft ? box.x - 20 : box.x + box.width + 20, y: box.y + 20 + row * ((box.height - 40) / (rows - 1)), vx: fromLeft ? speed : -speed, vy: 0, r: 8 });
    }
  };
  // CELESTE: her knives... and every third fan, they are made of light; a column where they cross
  if (pattern === 'kb8Knives') {
    if (t % 22 === 0) sideItem('knife', 5.6 + Math.random() * 1.4, 10);
    if (t % 60 === 30) {
      const startY = box.y + 12;
      const base = Math.atan2(soul.y - startY, soul.x - fromRight);
      const light = Math.floor(t / 60) % 3 === 2;
      [-0.25, 0, 0.25].forEach((spread) => (light ? lightShot(fromRight, startY, base + spread, 5.2) : push({ type: 'aimed', sprite: 'knife', x: fromRight, y: startY, vx: Math.cos(base + spread) * 5, vy: Math.sin(base + spread) * 5, r: 9 })));
    }
    if (t % 150 === 110) beam('v', clampX(soul.x));
    return true;
  }
  // SETO: his books... and pages that glow; now and then a ring of light, like a page turning
  if (pattern === 'kb8Books') {
    if (t % 32 === 0) sideItem('book', 4.2, 13, { wave: Math.random() * 6 });
    if (t % 18 === 9) push({ type: 'drop', sprite: Math.random() < 0.4 ? 'lightOrb' : 'page', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 16, vy: 3.6 + Math.random(), r: 8, warn: 16, sway: Math.random() * 6 });
    if (t % 130 === 70) ring({ speed: 2.2 });
    return true;
  }
  // THE CHEF: the pastries fall... with orbs of light among them, and light shots instead of cream
  if (pattern === 'kb8Pastry') {
    if (t % 16 === 0) push({ type: 'drop', sprite: Math.random() < 0.3 ? 'lightOrb' : 'pastry', x: box.x + 20 + Math.random() * (box.width - 40), y: box.y - 20, vy: 4.4 + Math.random() * 1.5, r: 11, warn: 22 });
    if (t % 70 === 35) lightShot(fromRight, box.y + 10, Math.atan2(soul.y - box.y - 10, soul.x - fromRight), 5.4);
    return true;
  }
  // MOCHI: the gloves from the sides... and his dash, now a disc of light along the lane
  if (pattern === 'kb8Gloves') {
    if (t % 28 === 0) sideItem('glove', 5.8 + Math.random() * 2, 13);
    if (t % 90 === 45) boomerang();
    if (t % 120 === 100) beam('h', clampY(soul.y));
    return true;
  }
  // THE CAKE: the giant cake with one gap... and a column of light falling where the gap is
  if (pattern === 'kb8Cake') {
    if (t % 100 === 0) {
      const gapWidth = 84;
      const gapX = box.x + 20 + Math.random() * (box.width - 40 - gapWidth);
      push({ type: 'wall', sprite: 'cake', gapX, gapWidth, y: box.y - 40, vy: 3.2, h: 34, warn: 40 });
      round.knightB8Gap = gapX + gapWidth / 2;
    }
    if (t % 100 === 70 && round.knightB8Gap) beam('v', clampX(round.knightB8Gap + (Math.random() < 0.5 ? -70 : 70)), { warn: 26 });
    if (t % 48 === 24) sideItem('glove', 7, 13);
    return true;
  }
  // THE SHERIFF: the rows of bullets, from both sides, and light shots between them
  if (pattern === 'kb8Bullets') {
    if (t % 40 === 0) bulletRow(Math.floor(t / 40) % 2 === 1, 7, 7);
    if (t % 80 === 60) lightShot(fromRight, box.y + 16, Math.atan2(soul.y - box.y - 16, soul.x - fromRight), 5.8);
    return true;
  }
  // his star: the star bouncing... and rings of light behind it
  if (pattern === 'kb8Stars') {
    if (t % 50 === 0 && round.items.filter((item) => item.type === 'bouncer').length < 4) {
      const angle = Math.random() * Math.PI * 2;
      push({ type: 'bouncer', sprite: 'star', x: box.x + box.width / 2, y: box.y + 24, vx: Math.cos(angle) * 4.8, vy: Math.abs(Math.sin(angle)) * 4.8 + 1, r: 13, life: 300 });
    }
    if (t % 110 === 55) ring({ speed: 2.4 });
    return true;
  }
  // the last judgment: the big revolver... under a rain of light
  if (pattern === 'kb8Judgment') {
    if (t === 1) push({ type: 'revolver', x: box.x + box.width - 48, y: box.y + box.height / 2, angle: Math.PI, cycle: 0, life: 440 });
    if (t % 18 === 0) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 14 + Math.random() * (box.width - 28), y: box.y - 14, vy: 4 + Math.random(), r: 8, warn: 14 });
    if (t % 90 === 45) bulletRow(true, 6, 6.4);
    return true;
  }
  // ONLY HIS: everything together, and harder
  if (pattern === 'kb8Combo1') {
    if (t % 24 === 0) {
      const startY = box.y + 20 + Math.random() * (box.height - 40);
      const base = Math.atan2(soul.y - startY, soul.x - fromRight);
      [-0.32, 0, 0.32].forEach((spread) => lightShot(fromRight, startY, base + spread, 6));
    }
    if (t % 46 === 23) beam(Math.random() < 0.5 ? 'v' : 'h', Math.random() < 0.5 ? clampX(soul.x) : clampY(soul.y), { warn: 28 });
    if (t % 75 === 40 && round.items.filter((item) => item.type === 'disc' && !item.boomerang).length < 3) bouncingDisc();
    return true;
  }
  if (pattern === 'kb8Combo2') {
    if (t === 1) push({ type: 'sphere', x: box.x + 30, y: box.y + 34, vx: 1.2, r: 24, rate: 20, warn: 30, life: 480 });
    if (t % 85 === 0) ring({ speed: 2.8, gapSize: 1 });
    if (t % 11 === 0) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 14 + Math.random() * (box.width - 28), y: box.y - 14, vy: 5 + Math.random() * 1.5, r: 8, warn: 12 });
    if (t % 100 === 60) boomerang();
    return true;
  }
  // a spiral: two arms of light turning from the top of the box
  if (pattern === 'kb8Spiral') {
    if (t % 6 === 0) {
      const cx = box.x + box.width / 2;
      const cy = box.y + 12;
      const turn = Math.sin(t / 34) * 1.25;
      [Math.PI / 2 + turn, Math.PI / 2 - turn].forEach((angle) => lightShot(cx, cy, angle, 3.6));
    }
    if (t % 120 === 90) beam('h', clampY(soul.y), { warn: 30 });
    return true;
  }
  // a crown of light around you that closes in (with a gap to slip through)
  if (pattern === 'kb8Crown') {
    if (t % 85 === 0) {
      const count = 14;
      const gap = Math.floor(Math.random() * count);
      for (let orb = 0; orb < count; orb += 1) {
        if (orb === gap || orb === (gap + 1) % count) continue;
        const angle = (orb / count) * Math.PI * 2;
        const ox = soul.x + Math.cos(angle) * 170;
        const oy = soul.y + Math.sin(angle) * 170;
        lightShot(ox, oy, angle + Math.PI, 2.6);
      }
    }
    if (t % 85 === 50) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 14 + Math.random() * (box.width - 28), y: box.y - 14, vy: 4.4, r: 8, warn: 12 });
    return true;
  }
  // falling stars: diagonal streaks of light, and columns now and then
  if (pattern === 'kb8Meteors') {
    if (t % 10 === 0) {
      const fromLeft = Math.floor(t / 180) % 2 === 0;
      const sx = fromLeft ? box.x - 40 + Math.random() * box.width * 0.7 : box.x + box.width * 0.3 + Math.random() * box.width * 0.7 + 40;
      lightShot(sx, box.y - 12, Math.atan2(5.4, fromLeft ? 3 : -3), 6.2, { r: 8 });
    }
    if (t % 75 === 40) beam('v', clampX(soul.x), { warn: 30 });
    return true;
  }
  // the maze: walls of light that sweep across the box, each with one opening
  if (pattern === 'kb8Maze') {
    if (t % 28 === 0) {
      const columns = 8;
      const step = (box.width - 40) / (columns - 1);
      const column = Math.floor(t / 28) % columns;
      const sweepRight = Math.floor(t / (28 * columns)) % 2 === 0;
      const index = sweepRight ? column : columns - 1 - column;
      if (index % 2 === 0) beam('v', box.x + 20 + index * step, { size: 26, warn: 30, active: 16 });
    }
    if (t % 140 === 70) beam('h', clampY(soul.y), { size: 28, warn: 34 });
    if (t % 45 === 20) lightShot(fromRight, box.y + 20 + Math.random() * (box.height - 40), Math.PI, 4.6);
    return true;
  }
  if (pattern === 'kb8Combo3') {
    if (t % 48 === 0) {
      beam('v', clampX(soul.x), { size: 30 });
      beam('h', clampY(soul.y), { size: 30 });
    }
    if (t % 60 === 30 && round.items.filter((item) => item.type === 'disc' && !item.boomerang).length < 3) bouncingDisc();
    if (t % 20 === 10) lightShot(fromRight, box.y + 20 + Math.random() * (box.height - 40), Math.PI + (Math.random() - 0.5) * 0.5, 6.4);
    if (t % 110 === 80) ring({ speed: 3, gapSize: 0.95 });
    return true;
  }
  return false;
}

function updateKnightB8Boxes() {
  if (!isKnightB8Fight() || !gameStarted || gameOver || knightB8.outro || knightB8.stage !== 'p1') return;
  const lw = player2;
  if (knightB8.clashIn > 0 && !dodgeRound.active) {
    knightB8.clashIn -= 1;
    if (knightB8.clashIn === 0) {
      startKnightB8Clash();
      return;
    }
  }
  const inBox = dodgeRound.active && String(dodgeRound.theme || '').startsWith('knightB8Box');
  if (inBox) {
    knightB8.inBox = true;
    return;
  }
  if (knightB8.inBox) {
    // the box is over: the light comes back to him
    knightB8.inBox = false;
    const before = lw.health;
    lw.health = Math.min(lw.maxHealth, lw.health + lw.maxHealth * 0.2);
    knightB8.healFx = { amount: Math.round(lw.health - before), life: 80 };
    const fireBefore = player1.health;
    player1.health = Math.min(player1.maxHealth, player1.health + player1.maxHealth * 0.18);
    knightB8.fireHealFx = { amount: Math.round(player1.health - fireBefore), life: 80 };
    playTone({ frequency: 70, duration: 1, type: 'sawtooth', volume: 0.05, slideTo: 140 });
    updateHealthBars();
    playTone({ frequency: 523, duration: 0.8, type: 'sine', volume: 0.05, slideTo: 784 });
    if (lw.knightB8BoxIndex >= knightB8BoxCount) {
      // the last BOX ATTACK is over: the clash, right away (no time for a blow in between)
      startKnightB8Clash();
      return;
    }
  }
  if (knightB8.healFx && knightB8.healFx.life > 0) {
    const fx = knightB8.healFx;
    fx.life -= 1;
    const cx = lw.position.x + lw.width / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(cx, lw.position.y + 60, 10, cx, lw.position.y + 60, 90);
    glow.addColorStop(0, `rgba(255, 245, 157, ${0.4 * fx.life / 80})`);
    glow.addColorStop(1, 'rgba(255, 245, 157, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 90, lw.position.y - 30, 180, 180);
    ctx.restore();
    drawKnightB7Text(cx, lw.position.y - 16 - (80 - fx.life) * 0.3, `+${fx.amount}`, '#fff59d', Math.min(1, fx.life / 20), false, 20);
  }
  if (knightB8.fireHealFx && knightB8.fireHealFx.life > 0) {
    const fx = knightB8.fireHealFx;
    fx.life -= 1;
    const cx = player1.position.x + player1.width / 2;
    ctx.save();
    const glow = ctx.createRadialGradient(cx, player1.position.y + 60, 10, cx, player1.position.y + 60, 90);
    glow.addColorStop(0, `rgba(120, 0, 10, ${0.5 * fx.life / 80})`);
    glow.addColorStop(0.5, `rgba(255, 61, 0, ${0.25 * fx.life / 80})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 90, player1.position.y - 30, 180, 180);
    ctx.restore();
    drawKnightB7Text(cx, player1.position.y - 16 - (80 - fx.life) * 0.3, `+${fx.amount}`, '#ff7043', Math.min(1, fx.life / 20), false, 20);
  }
  if (dodgeRound.active) return;
  if (typeof lw.knightB8BoxIndex !== 'number') {
    lw.knightB8BoxIndex = 0;
    lw.knightB8BoxTimer = knightB8BoxFirstDelay;
  }
  if (lw.knightB8BoxIndex >= knightB8BoxCount) return;
  // (he will not fall while he still has attacks left to give them)
  if (lw.health <= lw.maxHealth * 0.1 + 0.5) {
    lw.health = Math.max(lw.health, lw.maxHealth * 0.1);
    lw.knightB8BoxTimer = Math.min(lw.knightB8BoxTimer, 60);
  }
  if (!canFighterAct(lw)) return;
  lw.knightB8BoxTimer -= 1;
  if (lw.knightB8BoxTimer > 0) return;
  if (startDodgeRound(`knightB8Box${lw.knightB8BoxIndex + 1}`, lw, player1)) {
    lw.knightB8BoxIndex += 1;
    lw.knightB8BoxTimer = knightB8BoxInterval;
    knightB8.inBox = true;
  }
}

// ---------- Fire Master here: less ice, more black fire ----------
// Q: Llamarada negra (the fan, in black fire); F: Rayo del abismo (the beam and its echo, black and red);
// R: Pira negra (three geysers of black fire walking toward the enemy, leaving the ground burning)
const knightB8PyreCooldown = 420;
const knightB8PyreDamage = 9;
let knightB8Pyres = [];
let knightB8Embers = [];

function castKnightB8Pyre(caster, target) {
  if (!canFighterAct(caster) || (caster.knightB8PyreCd || 0) > 0 || gameOver) return false;
  const from = getFighterCenterX(caster);
  const to = getFighterCenterX(target);
  const dir = to >= from ? 1 : -1;
  const geysers = caster.knightB8Super ? 5 : 3;
  Array.from({ length: geysers }, (_, index) => index).forEach((index) => {
    const k = (index + 1) / geysers;
    knightB8Pyres.push({ x: from + dir * 90 + (to - from - dir * 90) * k, warn: 22 + index * 14, life: 30, burn: 150, hit: false, caster, target });
  });
  caster.knightB8PyreCd = getDebugCooldown(knightB8PyreCooldown, caster);
  recordSpecialUsed(caster);
  playTone({ frequency: 70, duration: 0.8, type: 'sawtooth', volume: 0.06, slideTo: 40 });
  return true;
}

function updateKnightB8Pyres() {
  if (player1.knightB8PyreCd > 0) player1.knightB8PyreCd -= 1;
  const time = performance.now() / 1000;
  knightB8Pyres.forEach((pyre, index) => {
    const target = pyre.target;
    if (pyre.warn > 0) {
      pyre.warn -= 1;
      ctx.save();
      ctx.fillStyle = `rgba(120, 0, 10, ${0.35 + Math.sin(time * 20) * 0.2})`;
      ctx.beginPath();
      ctx.ellipse(pyre.x, ground - 2, 40, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(20, 10, 10, 0.6)';
      ctx.fillRect(pyre.x - 2 + Math.sin(time * 9) * 4, ground - 20 - (pyre.warn % 10), 4, 10);
      ctx.restore();
      if (pyre.warn === 0) {
        playNoise({ duration: 0.4, volume: 0.08, filterFrequency: 600 });
        playTone({ frequency: 55, duration: 0.4, type: 'square', volume: 0.05, slideTo: 30 });
      }
      return;
    }
    if (pyre.life > 0) {
      pyre.life -= 1;
      const grow = Math.min(1, (30 - pyre.life) / 5);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let flame = 0; flame < 6; flame += 1) drawFlametombFlame(pyre.x + Math.sin(time * 12 + flame) * 8, ground - flame * 26 * grow, (34 - flame * 4) * grow, time * 14 + flame + index, 'outer');
      ctx.globalCompositeOperation = 'source-over';
      for (let flame = 0; flame < 6; flame += 1) drawFlametombFlame(pyre.x, ground - flame * 26 * grow + 6, (20 - flame * 2) * grow, time * 16 + flame, 'core');
      ctx.restore();
      if (!pyre.hit && pyre.life > 6 && Math.abs(getFighterCenterX(target) - pyre.x) < 42 && target.position.y + target.height > ground - 170) {
        pyre.hit = true;
        applyDamage(pyre.caster, target, knightB8PyreDamage, { isSpecial: true, damageType: 'blackPyre' });
        target.velocity.y = getDebugKnockback(-9, target);
        target.velocity.x = getDebugKnockback(getFighterCenterX(target) >= pyre.x ? 4 : -4, target);
      }
      return;
    }
    // the ground keeps burning a while
    pyre.burn -= 1;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = -2; flame <= 2; flame += 1) drawFlametombFlame(pyre.x + flame * 14, ground, 9 * Math.min(1, pyre.burn / 30), time * 12 + flame, 'outer');
    ctx.restore();
    if (pyre.burn % 30 === 0 && Math.abs(getFighterCenterX(target) - pyre.x) < 40 && target.position.y + target.height >= ground - 4) {
      applyDamage(pyre.caster, target, 1.5, { isSpecial: false, damageType: 'blackPyreBurn' });
    }
  });
  knightB8Pyres = knightB8Pyres.filter((pyre) => pyre.warn > 0 || pyre.life > 0 || pyre.burn > 0);
  knightB8Embers.forEach((ember) => {
    ember.x += ember.vx;
    ember.y += ember.vy;
    ember.life -= 1;
    ctx.fillStyle = ember.life % 4 < 2 ? `rgba(255, 87, 34, ${ember.life / 30})` : `rgba(20, 10, 10, ${ember.life / 30})`;
    ctx.fillRect(ember.x, ember.y, 3, 3);
  });
  knightB8Embers = knightB8Embers.filter((ember) => ember.life > 0);
}

// the shot: a ball of black fire, red at the edges, trailing smoke
function drawKnightB8DarkBall(ball) {
  const time = performance.now() / 1000;
  const cx = ball.position.x + ball.width / 2;
  const cy = ball.position.y + ball.height / 2;
  const right = ball.velocity.x > 0;
  if (Math.random() < 0.6) knightB8Embers.push({ x: cx - (right ? 1 : -1) * 10, y: cy + (Math.random() - 0.5) * 8, vx: (right ? -1 : 1) * Math.random(), vy: -Math.random(), life: 30 });
  ctx.save();
  for (let ghost = 3; ghost >= 1; ghost -= 1) {
    ctx.fillStyle = `rgba(20, 12, 14, ${0.16 * ghost})`;
    ctx.beginPath();
    ctx.arc(cx - (right ? 1 : -1) * ghost * 12, cy + Math.sin(time * 9 + ghost) * 3, ball.height / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30);
  glow.addColorStop(0, 'rgba(255, 61, 0, 0.5)');
  glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 30, cy - 30, 60, 60);
  ctx.translate(cx, cy);
  ctx.rotate((right ? 1 : -1) * Math.PI / 2);
  drawFlametombFlame(0, 6, 15, time * 14, 'outer');
  drawFlametombFlame(0, 7, 10, time * 16, 'core');
  ctx.restore();
}

// the beam: black and deep red, with a molten thread and smoke along its edges
function drawKnightB8DarkBeam(beam) {
  const time = performance.now() / 1000;
  const x = beam.position.x;
  const y = beam.position.y;
  const w = beam.width;
  const h = beam.height;
  ctx.save();
  ctx.shadowColor = '#ff3d00';
  ctx.shadowBlur = 14;
  for (let segment = 0; segment < w; segment += 10) {
    const jag = Math.sin(time * 20 + segment) * 3;
    ctx.fillStyle = Math.floor(segment / 10 + time * 8) % 3 ? '#0b0507' : '#7f0000';
    ctx.fillRect(x + segment, y + jag, 10, h);
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(255, 112, 67, ${0.7 + Math.sin(time * 15) * 0.3})`;
  ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
  ctx.fillStyle = 'rgba(30, 20, 24, 0.5)';
  for (let puff = 0; puff < w; puff += 26) ctx.fillRect(x + puff + Math.sin(time * 5 + puff) * 4, y - 6 - Math.random() * 4, 14, 5);
  ctx.restore();
}

(function hookChapterFiveBLevelEightMore() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  wrap('spawnLightBoxPattern', (base) => function spawnLightBoxPatternWith8(pattern, t, push, box, soul, ...rest) {
    if (spawnKnightB8BoxPattern(pattern, t, push, box, soul)) return true;
    return base.call(this, pattern, t, push, box, soul, ...rest);
  });
  // (the parryable ones look like any other)
  wrap('drawDodgeItem', (base) => function drawDodgeItemHidden(item, ...rest) {
    if (item && item.blue && dodgeRound.config && dodgeRound.config.hiddenParry) {
      item.blue = false;
      try {
        return base.call(this, item, ...rest);
      } finally {
        item.blue = true;
      }
    }
    return base.call(this, item, ...rest);
  });
  wrap('getCharacterDisplayName', (base) => function getCharacterDisplayNameWith8(fighter, ...rest) {
    if (fighter === player1 && fighter.knightB8Super && isKnightB8()) return 'Super Fire Master (B)';
    return base.call(this, fighter, ...rest);
  });
  // Q: five black fireballs instead of three; F: the beam with two echoes; and a burning aura around him
  wrap('launchFireball', (base) => function launchFireballSuper(attacker, target, ...rest) {
    const before = fireballs.length;
    const result = base.call(this, attacker, target, ...rest);
    if (attacker === player1 && attacker.knightB8Super && isKnightB8Fight() && fireballs.length > before) {
      const first = fireballs[before];
      const direction = Math.sign(first.velocity.x) || 1;
      [-1.4, 1.4].forEach((drift) => {
        const echo = new Fireball({ x: first.position.x, y: first.position.y - 24 + (drift > 0 ? 40 : 0), direction, target, attacker, damageMultiplier: 0.6 });
        echo.drift = drift;
        fireballs.push(echo);
      });
    }
    return result;
  });
  wrap('launchFireBeam', (base) => function launchFireBeamSuper(attacker, target, ...rest) {
    const before = fireBeams.length;
    const result = base.call(this, attacker, target, ...rest);
    if (attacker === player1 && attacker.knightB8Super && isKnightB8Fight() && fireBeams.length > before) {
      const beam = fireBeams[before];
      knightBPendingBeams.push({ attacker, target, direction: Math.sign(beam.velocity.x) || 1, timer: 24 });
    }
    return result;
  });
  wrap('drawBizarreFireball', (base) => function drawBizarreFireballDark(ball, ...rest) {
    if (ball && ball.attacker && ball.attacker === player1 && isKnightB8()) return drawKnightB8DarkBall(ball);
    return base.call(this, ball, ...rest);
  });
  wrap('drawBizarreFireBeam', (base) => function drawBizarreFireBeamDark(beam, ...rest) {
    if (beam && beam.attacker && beam.attacker === player1 && isKnightB8()) return drawKnightB8DarkBeam(beam);
    return base.call(this, beam, ...rest);
  });
  wrap('handleFlametombKey', (base) => function handleFlametombKeyWith8(caster, target, ...rest) {
    if (isKnightB8Fight() && caster === player1) return caster.knightB8Super ? castKnightB8SuperFlametomb(caster, target) : castKnightB8Pyre(caster, target);
    return base.call(this, caster, target, ...rest);
  });
  wrap('getPlayerAbilityCooldowns', (base) => function getPlayerAbilityCooldownsWith8(player, ...rest) {
    const cooldowns = base.call(this, player, ...rest);
    if (player === player1 && isKnightB8() && player.knightBBizarre && cooldowns) {
      if (cooldowns.q) cooldowns.q.name = 'Llamarada negra';
      if (cooldowns.f) cooldowns.f.name = 'Rayo del abismo';
      cooldowns.r = player.knightB8Super
        ? { active: true, name: 'Super Flametomb', remaining: player.knightB8SuperTombCd || 0, max: getDebugCooldown(knightB8SuperFlametombCooldown, player) }
        : { active: true, name: 'Pira negra', remaining: player.knightB8PyreCd || 0, max: getDebugCooldown(knightB8PyreCooldown, player) };
    }
    return cooldowns;
  });
  // (he will not fall while he still has BOX ATTACKS left)
  wrap('applyDamage', (base) => function applyDamageWith8(attacker, target, damage, ...rest) {
    if (isKnightB8() && knightB8.cs) return 0;
    const lwArmor = { p1: 0.6, p2: 0.75, p3: 0.55 }[knightB8.stage] || 0.6;
    // (SUPER FIRE MASTER (B) hits half again as hard, his specials too)
    const superHit = attacker === player1 && player1.knightB8Super ? 2 : 1;
    const scaled = target === player2 && attacker === player1 && isKnightB8Fight() ? damage * lwArmor * superHit : damage;
    const lwBefore = target === player2 ? player2.health : 0;
    const dealt = base.call(this, attacker, target, scaled, ...rest);
    if (target === player2 && attacker === player1 && player1.knightB8Super && isKnightB8Fight()) {
      const taken = lwBefore - player2.health;
      if (taken > 0) {
        player1.health = Math.min(player1.maxHealth, player1.health + taken * 0.3);
        knightB8.drainFx = 24;
        updateHealthBars();
      }
    }
    if (target === player2 && isKnightB8Fight() && knightB8.stage === 'p1') player2.health = Math.max(player2.health, player2.maxHealth * 0.1);
    if (target === player2 && isKnightB8Fight() && knightB8.stage === 'p2') guardKnightB8FarolHealth();
    if (target === player2 && isKnightB8Fight() && knightB8.stage === 'p3' && player2.health <= 500 && !knightB8.finaleDone) {
      player2.health = 500;
      if (!knightB8.finaleIn) knightB8.finaleIn = 1;
      updateHealthBars();
    }
    return dealt;
  });
  wrap('updateMonkeyCoconuts', (base) => function updateMonkeyCoconutsWith8(...args) {
    const result = base.apply(this, args);
    if (isKnightB8Fight() && !knightB8.outro && !knightB8.cs) {
      if (knightB8.stage === 'p3' && !knightB8.finaleDone && player2.health <= 500) {
        player2.health = Math.max(player2.health, 500);
        if (!knightB8.finaleIn) knightB8.finaleIn = 1;
      }
      if (knightB8.finaleIn && !knightB8.kicks) {
        knightB8.finaleIn = 0;
        knightB8.finaleDone = true;
        startKnightB8Finale();
        return result;
      }
      if (knightB8.pendingClimb && gameStarted && !gameOver) {
        knightB8.pendingClimb = false;
        startKnightB8Cs('climb', makeKnightB8Climb());
        return result;
      }
      if (knightB8.stage === 'p2') guardKnightB8FarolHealth();
      // the super Flametomb: only after a good while on top of the farol (45 s at least; then when he has
      // taken a real beating, or at 80 s)
      if (knightB8.stage === 'p2' && !knightB8.superTombDone) {
        if (typeof knightB8.p2StartHealth !== 'number') {
          knightB8.p2StartHealth = player2.health;
          knightB8.p2Frames = 0;
        }
        knightB8.p2Frames += 1;
        const beaten = knightB8.p2StartHealth - player2.health >= player2.maxHealth * 0.15;
        if (knightB8.p2Frames > 45 * 60 && (beaten || knightB8.p2Frames > 80 * 60)) {
          knightB8.superTombDone = true;
          knightB8.superTombIn = 30;
        }
      }
      if (knightB8.superTombIn > 0) {
        knightB8.superTombIn -= 1;
        if (knightB8.superTombIn === 0) startKnightB8SuperTomb();
      }
      updateKnightB8Boxes();
      updateKnightB8Pyres();
      updateKnightB8SuperFlametombs();
      if (knightB8.stage === 'p3' && player2.lightWarriorOmegaTransformed && !knightB8.kicks) {
        if (!knightB8.kick75 && player2.health <= player2.maxHealth * 0.75) {
          knightB8.kick75 = true;
          startKnightB8Kicks(1);
        } else if (!knightB8.kick50 && player2.health <= player2.maxHealth * 0.5) {
          knightB8.kick50 = true;
          startKnightB8Kicks(2);
        }
      }
      if (knightB8.kicks) updateKnightB8Kicks();
      else if (!dodgeRound.active) updateKnightB8LwAttacks();
      // SUPER FIRE MASTER (B) burns whoever stands too close
      if (player1.knightB8Super && Math.abs(getFighterCenterX(player1) - getFighterCenterX(player2)) < 130 && knightB8.fightFrame % 30 === 0) {
        applyDamage(player1, player2, 6, { isSpecial: false, damageType: 'superAura' });
      }
      knightB8.fightFrame = (knightB8.fightFrame || 0) + 1;
      if (knightB8.drainFx > 0) {
        // (the fire takes back what it burns: a red glow over him)
        knightB8.drainFx -= 1;
        const cx = getFighterCenterX(player1);
        const glow = ctx.createRadialGradient(cx, player1.position.y + 60, 6, cx, player1.position.y + 60, 70);
        glow.addColorStop(0, `rgba(255, 82, 82, ${0.4 * knightB8.drainFx / 24})`);
        glow.addColorStop(1, 'rgba(255, 82, 82, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cx - 70, player1.position.y - 10, 140, 140);
      }
      if (knightB8.omegaTitle > 0) {
        knightB8.omegaTitle -= 1;
        drawKnightB7Text(canvas.width / 2, 200, 'OMEGA LIGHT WARRIOR', '#fff59d', Math.min(1, knightB8.omegaTitle / 30), false, 44);
      }
    }
    return result;
  });
})();

// ================= LEVEL 8, AFTER HIS LAST BOX ATTACK =================
// a clash; Fire Master's Firenado; the climb up the discs with the black fire rising behind; the blow that
// sends him to the top of the Gran Farol; SUPER FIRE MASTER (B); the super Flametomb... and OMEGA.
reflecterBattleTrackSources.dawnHope = encodeURI('assetsaudio/Deltarune - KNIGHT v FLOWERMAN_ Dawn of Hopes and Dreams (Flowery VS. Knight Theme).mp3');
reflecterBattleTrackVolumes.dawnHope = 0.6;
reflecterBattleTrackLoops.dawnHope = { start: 29, end: 166.8 };

function getKnightB8MusicKey() {
  if (knightB8.phase !== 'fight' || knightB8.outro) return null;
  const cs = knightB8.cs;
  if (cs && cs.kind === 'superTomb') return cs.music ? 'dawnHope' : null;
  if (knightB8.stage === 'p3') return 'dawnHope';
  return 'flowerDream';
}

function makeKnightB8Super(fighter) {
  fighter.knightB8Super = true;
  fighter.setMaxHealth(300);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 2.4;
  updateHealthBars();
  updateCombatHudIdentity();
}

function applyKnightB8Omega(fighter) {
  applyOmegaFinalForm(fighter);
  fighter.setMaxHealth(10000);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1.45;
  fighter.capeWind = false;
  knightB8.lwLit = true;
  updateHealthBars();
  updateCombatHudIdentity();
}

// SUPER FIRE MASTER (B): scorched ground under him, a malevolent aura with black rays, an afterimage...
// and over him a crown of black fire, burning eyes, cracks of lava and black embers rising
function drawKnightB8SuperAura(fighter, layer) {
  const time = performance.now() / 1000;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const facing = fighter.attacksToTheRight ? 1 : -1;
  ctx.save();
  if (layer === 'back') {
    const scorch = ctx.createRadialGradient(cx, y + h, 4, cx, y + h, 80);
    scorch.addColorStop(0, 'rgba(10, 0, 0, 0.7)');
    scorch.addColorStop(0.7, 'rgba(120, 10, 0, 0.35)');
    scorch.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = scorch;
    ctx.beginPath();
    ctx.ellipse(cx, y + h, 80, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
    aura.addColorStop(0, `rgba(140, 0, 30, ${0.6 + Math.sin(time * 4) * 0.1})`);
    aura.addColorStop(0.5, 'rgba(70, 0, 60, 0.4)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(cx - 150, cy - 160, 300, 320);
    // black rays turning, like thorns
    ctx.fillStyle = 'rgba(15, 0, 8, 0.7)';
    for (let ray = 0; ray < 10; ray += 1) {
      const angle = time * 0.7 + (ray / 10) * Math.PI * 2;
      const reach = 120 + Math.sin(time * 3 + ray) * 20;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle - 0.08) * 45, cy + Math.sin(angle - 0.08) * 60);
      ctx.lineTo(cx + Math.cos(angle) * reach, cy + Math.sin(angle) * reach * 1.15);
      ctx.lineTo(cx + Math.cos(angle + 0.08) * 45, cy + Math.sin(angle + 0.08) * 60);
      ctx.closePath();
      ctx.fill();
    }
    // a red afterimage, a step behind
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(x - facing * (10 + Math.sin(time * 5) * 4), y + 4, w, h - 4);
  } else {
    // cracks of lava over the body
    ctx.strokeStyle = `rgba(255, 112, 40, ${0.75 + Math.sin(time * 6) * 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    [[0.2, 0.35, 0.45, 0.48, 0.3, 0.62], [0.75, 0.3, 0.6, 0.45, 0.78, 0.6], [0.35, 0.75, 0.55, 0.82, 0.45, 0.95]].forEach(([ax, ay, bx, by, ex, ey]) => {
      ctx.moveTo(x + w * ax, y + h * ay);
      ctx.lineTo(x + w * bx, y + h * by);
      ctx.lineTo(x + w * ex, y + h * ey);
    });
    ctx.stroke();
    // burning eyes
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(cx + facing * 4 - 4, y + 22, 8, 3);
    ctx.fillRect(cx + facing * 18 - 4, y + 22, 8, 3);
    ctx.shadowBlur = 0;
    // the crown of black fire
    ctx.globalCompositeOperation = 'lighter';
    [-18, -9, 0, 9, 18].forEach((dx, index) => drawFlametombFlame(cx + dx, y + 4, 9 + (index % 2 ? 0 : 5), time * 13 + index * 1.3, 'outer'));
    [[-w / 2 - 4, 0.9], [w / 2 + 4, 0.9]].forEach(([dx, at], index) => drawFlametombFlame(cx + dx, y + h * at + 10, 15, time * 12 + index * 1.7, 'outer'));
    ctx.globalCompositeOperation = 'source-over';
    [-12, 0, 12].forEach((dx, index) => drawFlametombFlame(cx + dx, y + 6, 6, time * 15 + index, 'core'));
    // black embers rising off him
    for (let ember = 0; ember < 10; ember += 1) {
      const rise = (time * 60 + ember * 23) % 120;
      ctx.fillStyle = ember % 3 ? `rgba(20, 5, 8, ${1 - rise / 120})` : `rgba(255, 87, 34, ${1 - rise / 120})`;
      ctx.fillRect(x + ((ember * 17) % w), y + h * 0.4 - rise, 3, 3);
    }
  }
  ctx.restore();
}

// OMEGA LIGHT WARRIOR, here: blinding, and threatening. A pulsing core of light, blades of light turning
// around him, a halo, shards orbiting, lightning crackling
function drawKnightB8OmegaAura(fighter, layer) {
  const time = performance.now() / 1000;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const pal = getKnightB8AuraPalette();
  const core3 = pal.core.join(', ');
  const accent3 = pal.accent.join(', ');
  ctx.save();
  if (layer === 'back') {
    ctx.globalCompositeOperation = 'lighter';
    const pulse = (0.75 + Math.sin(time * 5) * 0.2) * pal.power;
    const core = ctx.createRadialGradient(cx, cy, 10, cx, cy, 190 * Math.min(1.3, pal.power));
    core.addColorStop(0, `rgba(255, 255, 255, ${0.55 * pulse})`);
    core.addColorStop(0.35, `rgba(${core3}, ${0.35 * pulse})`);
    core.addColorStop(1, `rgba(${accent3}, 0)`);
    ctx.fillStyle = core;
    ctx.fillRect(cx - 200, cy - 200, 400, 400);
    // blades of light, turning
    for (let blade = 0; blade < 12; blade += 1) {
      const angle = -time * 1.4 + (blade / 12) * Math.PI * 2;
      const reach = 150 + (blade % 2 ? 0 : 40) + Math.sin(time * 6 + blade) * 12;
      ctx.fillStyle = blade % 2 ? `rgba(${accent3}, ${0.35 * pal.power})` : `rgba(${core3}, ${0.3 * pal.power})`;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle - 0.06) * 50, cy + Math.sin(angle - 0.06) * 60);
      ctx.lineTo(cx + Math.cos(angle) * reach, cy + Math.sin(angle) * reach);
      ctx.lineTo(cx + Math.cos(angle + 0.06) * 50, cy + Math.sin(angle + 0.06) * 60);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(${core3}, ${0.45 + Math.sin(time * 9) * 0.25})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120 + Math.sin(time * 4) * 6, 140, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.globalCompositeOperation = 'lighter';
    // a halo
    ctx.strokeStyle = `rgba(${accent3}, ${0.8 + Math.sin(time * 7) * 0.2})`;
    ctx.shadowColor = `rgb(${core3})`;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, y - 14, 30, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // shards orbiting
    for (let shard = 0; shard < 6; shard += 1) {
      const angle = time * 2.2 + (shard / 6) * Math.PI * 2;
      const sx = cx + Math.cos(angle) * 78;
      const sy = cy + Math.sin(angle) * 34;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(sx, sy - 9);
      ctx.lineTo(sx + 4, sy);
      ctx.lineTo(sx, sy + 9);
      ctx.lineTo(sx - 4, sy);
      ctx.closePath();
      ctx.fill();
    }
    // lightning, now and then
    if (Math.random() < 0.18) {
      const angle = Math.random() * Math.PI * 2;
      drawKnightB8Bolt(cx, cy, cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120, 'rgba(255, 253, 231, 0.85)', 2);
    }
  }
  ctx.restore();
}

// ---------- cutscenes of this part (they stop the fight and run on their own) ----------
function startKnightB8Cs(kind, init = {}) {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  fireballs = [];
  fireBeams = [];
  lightShots = [];
  knightB8Pyres = [];
  knightB8LwAttacks = [];
  knightB8SuperFlametombs = [];
  knightB8.kicks = null;
  player2.scriptedFlight = false;
  knightB8.cs = { kind, t: 0, prev: {}, ...init };
  document.body.classList.toggle('knightb-ending', kind !== 'climb');
  knightB8.cs.raf = requestAnimationFrame(tickKnightB8Cs);
}

function switchKnightB8Cs(kind, init = {}) {
  const old = knightB8.cs;
  if (old) {
    old.over = true;
    cancelAnimationFrame(old.raf);
  }
  knightB8.cs = { kind, t: 0, prev: {}, ...init };
  document.body.classList.toggle('knightb-ending', kind !== 'climb');
  knightB8.cs.raf = requestAnimationFrame(tickKnightB8Cs);
}

function endKnightB8Cs(stage) {
  const cs = knightB8.cs;
  if (cs) {
    cs.over = true;
    cancelAnimationFrame(cs.raf);
  }
  knightB8.cs = null;
  document.body.classList.remove('knightb-ending');
  knightB8.stage = stage;
  knightB8.checkpoint = stage;
  player1.gamblerStunTimer = 0;
  player2.gamblerStunTimer = 0;
  player1.velocity.x = 0;
  player1.velocity.y = 0;
  player2.velocity.x = 0;
  player2.velocity.y = 0;
  // (the music of each part is already playing: it must not start over)
  reflecterBattleMusic.restart = false;
  lightClashMusicFade = 1;
  gameStarted = true;
  gameOver = false;
  animate();
}

function tickKnightB8Cs() {
  const cs = knightB8.cs;
  if (!cs || cs.over) return;
  cs.t += 1;
  const pressed = {};
  ['q', 'f', 'r', 'w'].forEach((key) => {
    pressed[key] = !!keys[key] && !cs.prev[key];
    cs.prev[key] = !!keys[key];
  });
  cs.pressed = pressed;
  updateReflecterBattleMusic();
  const handlers = { clash: tickKnightB8Clash, firenado: tickKnightB8Firenado, climb: tickKnightB8Climb, farol: tickKnightB8Farol, superTomb: tickKnightB8SuperTomb, finale: tickKnightB8Finale };
  handlers[cs.kind](cs);
  if (knightB8.cs === cs && !cs.over) cs.raf = requestAnimationFrame(tickKnightB8Cs);
}

function drawKnightB8Actor(fighter, x, y, facing, rot = 0, attacking = false) {
  fighter.position = { x, y };
  fighter.attacksToTheRight = facing > 0;
  fighter.isAttacking = attacking;
  ctx.save();
  if (rot) {
    const pivot = x + fighter.width / 2;
    ctx.translate(0, -(fighter.width / 2) * Math.abs(rot / (Math.PI / 2)));
    ctx.translate(pivot, ground);
    ctx.rotate(rot);
    ctx.translate(-pivot, -ground);
  }
  fighter.draw();
  ctx.restore();
}

function drawKnightB8Say(x, y, text, color, alpha, italic = true) {
  drawKnightB7Text(x, y, text, color, alpha, italic);
}

// ---------- 1) the clash: his light against the black fire (hammer Q / F / R) ----------
function startKnightB8Clash() {
  startKnightB8Cs('clash', { balance: 0, presses: 0, boom: 0, sparks: [], rings: [], kick: 0 });
}

// the black fire, from x1 to x2 (left to right)
function drawKnightB8FireStream(x1, x2, y, time) {
  if (x2 <= x1) return;
  ctx.save();
  const glow = ctx.createLinearGradient(0, y - 46, 0, y + 46);
  glow.addColorStop(0, 'rgba(255, 61, 0, 0)');
  glow.addColorStop(0.5, 'rgba(255, 61, 0, 0.35)');
  glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x1, y - 46, x2 - x1, 92);
  ctx.beginPath();
  for (let x = x1; x <= x2; x += 8) ctx.lineTo(x, y - 17 - Math.sin(time * 18 + x * 0.08) * 4 - Math.sin(x * 0.31 + time * 9) * 2);
  for (let x = x2; x >= x1; x -= 8) ctx.lineTo(x, y + 17 + Math.sin(time * 16 + x * 0.07) * 4 + Math.sin(x * 0.27 + time * 11) * 2);
  ctx.closePath();
  const body = ctx.createLinearGradient(0, y - 20, 0, y + 20);
  body.addColorStop(0, '#6b0010');
  body.addColorStop(0.5, '#060103');
  body.addColorStop(1, '#6b0010');
  ctx.fillStyle = body;
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 112, 67, ${0.75 + Math.sin(time * 20) * 0.25})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = x1; x <= x2; x += 6) ctx.lineTo(x, y + Math.sin(time * 24 + x * 0.12) * 3);
  ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  for (let x = x1 + 10; x < x2 - 10; x += 26) {
    drawFlametombFlame(x, y - 12, 9 + Math.sin(x + time * 7) * 2, time * 14 + x, 'outer');
    drawFlametombFlame(x + 13, y + 26, 7, time * 12 + x, 'outer');
  }
  ctx.restore();
}

// the light, from x2 back to x1 (right to left), with pulses running toward the clash
function drawKnightB8LightStream(x1, x2, y, time) {
  if (x2 <= x1) return;
  ctx.save();
  const glow = ctx.createLinearGradient(0, y - 46, 0, y + 46);
  glow.addColorStop(0, 'rgba(255, 241, 118, 0)');
  glow.addColorStop(0.5, 'rgba(255, 241, 118, 0.4)');
  glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x1, y - 46, x2 - x1, 92);
  const body = ctx.createLinearGradient(0, y - 18, 0, y + 18);
  body.addColorStop(0, 'rgba(253, 216, 53, 0.5)');
  body.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  body.addColorStop(1, 'rgba(253, 216, 53, 0.5)');
  ctx.fillStyle = body;
  ctx.beginPath();
  for (let x = x1; x <= x2; x += 10) ctx.lineTo(x, y - 15 - Math.sin(time * 10 + x * 0.05) * 2);
  for (let x = x2; x >= x1; x -= 10) ctx.lineTo(x, y + 15 + Math.sin(time * 10 + x * 0.05) * 2);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  for (let pulse = 0; pulse < 6; pulse += 1) {
    const px = x2 - ((time * 520 + pulse * 97) % (x2 - x1));
    const ring = ctx.createRadialGradient(px, y, 2, px, y, 26);
    ring.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    ring.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = ring;
    ctx.fillRect(px - 26, y - 26, 52, 52);
  }
  for (let mote = 0; mote < 14; mote += 1) {
    const mx = x1 + ((mote * 67 + time * 300) % (x2 - x1));
    ctx.fillStyle = 'rgba(255, 253, 231, 0.9)';
    ctx.fillRect(mx, y + Math.sin(time * 9 + mote) * 24, 3, 3);
  }
  ctx.restore();
}

// a jagged bolt between two points
function drawKnightB8Bolt(x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const steps = 7;
  for (let step = 1; step < steps; step += 1) {
    const k = step / steps;
    ctx.lineTo(x1 + (x2 - x1) * k + (Math.random() - 0.5) * 22, y1 + (y2 - y1) * k + (Math.random() - 0.5) * 22);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function tickKnightB8Clash(cs) {
  const t = cs.t;
  const time = performance.now() / 1000;
  const y = ground - 72;
  if (t === 1) playTone({ frequency: 80, duration: 1.2, type: 'sawtooth', volume: 0.06, slideTo: 300 });
  if (t > 80 && !cs.boom) {
    if (cs.pressed.q || cs.pressed.f || cs.pressed.r) {
      cs.balance += 0.045;
      cs.presses += 1;
      cs.kick = 8;
      playTone({ frequency: 90 + Math.random() * 40, duration: 0.08, type: 'sawtooth', volume: 0.035 });
    }
    cs.balance -= 0.0042 + Math.max(0, cs.balance) * 0.004;
    cs.balance = Math.max(-1, Math.min(1, cs.balance));
    if (t % 5 === 0) playNoise({ duration: 0.09, volume: 0.035, filterFrequency: 1200 + cs.balance * 400 });
    if (t % 18 === 0) cs.rings.push({ r: 16, life: 26 });
    if (Math.abs(cs.balance) >= 1 || t > 580) {
      cs.boom = 1;
      cs.won = cs.balance > 0;
      cs.boomX = 480 + cs.balance * 260;
      playNoise({ duration: 1.6, volume: 0.25, filterFrequency: 1200 });
      playTone({ frequency: 44, duration: 1.6, type: 'sawtooth', volume: 0.13, slideTo: 22 });
      if (cs.won) player2.health = Math.max(player2.maxHealth * 0.1, player2.health - player2.maxHealth * 0.09);
      else player1.health = Math.max(1, player1.health - player1.maxHealth * 0.12);
      updateHealthBars();
      for (let bit = 0; bit < 90; bit += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 11;
        cs.sparks.push({ x: cs.boomX, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 30 + Math.random() * 30, fire: bit % 2 === 0 });
      }
      [0, 6, 12].forEach((delay) => cs.rings.push({ r: 10, life: 40, delay, big: true }));
    }
  }
  if (cs.boom) cs.boom += 1;
  if (cs.kick > 0) cs.kick -= 1;
  if (cs.boom > 120) {
    switchKnightB8Cs('firenado', {});
    return;
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  const shake = cs.boom ? Math.max(0, 16 - cs.boom * 0.3) : 1.5 + cs.kick * 0.6;
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake * 0.6);
  drawKnightB8Platform();
  const mid = cs.boom ? cs.boomX : 480 + cs.balance * 260;
  // the world goes dark around them; lines rushing to the clash
  ctx.fillStyle = 'rgba(5, 2, 10, 0.55)';
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  for (let line = 0; line < 26; line += 1) {
    const angle = line * 2.39 + Math.floor(time * 12) * 0.7;
    const from = 620 + (line % 5) * 40;
    const to = 220 + ((time * 400 + line * 37) % 160);
    ctx.beginPath();
    ctx.moveTo(mid + Math.cos(angle) * from, y + Math.sin(angle) * from * 0.6);
    ctx.lineTo(mid + Math.cos(angle) * to, y + Math.sin(angle) * to * 0.6);
    ctx.stroke();
  }
  const fmX = 170 - Math.max(0, -cs.balance) * 50 - (cs.boom ? Math.min(1, cs.boom / 14) * 70 : 0);
  const lwX = 790 + Math.max(0, cs.balance) * 50 + (cs.boom ? Math.min(1, cs.boom / 14) * 70 : 0);
  // their auras
  [[fmX, 'rgba(160, 0, 20, 0.55)'], [lwX, 'rgba(255, 241, 118, 0.5)']].forEach(([ax, color]) => {
    const aura = ctx.createRadialGradient(ax, y, 10, ax, y, 120);
    aura.addColorStop(0, color);
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(ax - 120, y - 120, 240, 240);
  });
  drawKnightB8Actor(player1, fmX - player1.width / 2, ground - player1.height, 1, 0, t > 80);
  drawKnightB8Actor(player2, lwX - player2.width / 2, ground - player2.height, -1, 0, t > 80);
  if (t > 80 && !cs.boom) {
    drawKnightB8FireStream(fmX + 26, mid, y, time);
    drawKnightB8LightStream(mid, lwX - 26, y, time);
    // where they meet: a ball of white fire, lightning, rings of pressure
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const size = 62 + Math.sin(time * 30) * 8 + cs.kick * 2;
    const core = ctx.createRadialGradient(mid, y, 4, mid, y, size);
    core.addColorStop(0, 'rgba(255, 255, 255, 1)');
    core.addColorStop(0.35, 'rgba(255, 213, 79, 0.8)');
    core.addColorStop(0.7, 'rgba(255, 61, 0, 0.45)');
    core.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = core;
    ctx.fillRect(mid - size, y - size, size * 2, size * 2);
    for (let bolt = 0; bolt < 4; bolt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const reach = 70 + Math.random() * 80;
      drawKnightB8Bolt(mid, y, mid + Math.cos(angle) * reach, y + Math.sin(angle) * reach * 0.7, bolt % 2 ? 'rgba(255, 245, 157, 0.8)' : 'rgba(255, 82, 40, 0.8)', 2);
    }
    ctx.restore();
    if (Math.random() < 0.9) cs.sparks.push({ x: mid, y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 22, fire: Math.random() < 0.5 });
  }
  cs.rings.forEach((ring) => {
    if (ring.delay > 0) {
      ring.delay -= 1;
      return;
    }
    ring.life -= 1;
    ring.r += ring.big ? 24 : 7;
    ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, ring.life / (ring.big ? 40 : 26)) * 0.8})`;
    ctx.lineWidth = ring.big ? 6 : 2;
    ctx.beginPath();
    ctx.ellipse(mid, y, ring.r, ring.r * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  cs.rings = cs.rings.filter((ring) => ring.life > 0);
  cs.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.97;
    spark.vy *= 0.97;
    spark.life -= 1;
    ctx.fillStyle = spark.fire ? (spark.life % 4 < 2 ? '#ff5722' : '#1a0505') : (spark.life % 4 < 2 ? '#ffffff' : '#fff59d');
    ctx.fillRect(spark.x, spark.y, 3, 3);
  });
  cs.sparks = cs.sparks.filter((spark) => spark.life > 0);
  ctx.restore();
  // the struggle, on top
  if (t < 80) {
    const pop = 1 + Math.max(0, (20 - t) / 20);
    ctx.save();
    ctx.translate(canvas.width / 2, 190);
    ctx.scale(pop, pop);
    drawKnightB7Text(0, 0, 'CHOQUE!', '#fff59d', Math.min(1, t / 8), false, 52);
    ctx.restore();
  }
  if (t > 80 && !cs.boom) {
    const barX = 252;
    const barW = 520;
    const marker = barX + barW / 2 + cs.balance * barW / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 6, 118, barW + 12, 30);
    const fire = ctx.createLinearGradient(barX, 0, marker, 0);
    fire.addColorStop(0, '#2a0005');
    fire.addColorStop(1, '#ff3d00');
    ctx.fillStyle = fire;
    ctx.fillRect(barX, 124, marker - barX, 18);
    const light = ctx.createLinearGradient(marker, 0, barX + barW, 0);
    light.addColorStop(0, '#fffde7');
    light.addColorStop(1, '#c9a227');
    ctx.fillStyle = light;
    ctx.fillRect(marker, 124, barX + barW - marker, 18);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(marker, 116);
    ctx.lineTo(marker + 9, 133);
    ctx.lineTo(marker, 150);
    ctx.lineTo(marker - 9, 133);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    drawKnightB7Text(barX + 70, 110, 'FIRE MASTER', '#ff7043', 1, false, 14);
    drawKnightB7Text(barX + barW - 80, 110, 'LIGHT WARRIOR', '#fff59d', 1, false, 14);
    ctx.save();
    const pulse = 1 + (cs.kick > 0 ? 0.12 : Math.sin(time * 12) * 0.04);
    ctx.translate(canvas.width / 2, 186);
    ctx.scale(pulse, pulse);
    drawKnightB7Text(0, 0, 'MACHACA  Q / F / R !', '#ff7043', 1, false, 26);
    ctx.restore();
  }
  if (cs.boom) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - cs.boom / 45)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (cs.boom > 35) drawKnightB7Text(canvas.width / 2, 190, cs.won ? 'EL FUEGO GANA EL CHOQUE!' : 'LA LUZ GANA EL CHOQUE...', cs.won ? '#ff7043' : '#fff59d', Math.min(1, (cs.boom - 35) / 15, (120 - cs.boom) / 20), false, 28);
  }
}

// ---------- 2) FIRENADO: a tornado of black fire ----------
// a funnel: narrow at the ground, wide above, black inside, with bands of fire climbing around it
function drawKnightB8Funnel(cx, baseY, height, time, alpha = 1, topWidth = 320) {
  if (height <= 4) return;
  const steps = 30;
  const shape = (along) => ({
    half: 18 + Math.pow(along, 1.4) * topWidth / 2 + Math.sin(time * 3 + along * 9) * 5,
    sway: Math.sin(time * 1.3 + along * 3) * along * 36,
  });
  ctx.save();
  ctx.globalAlpha = alpha;
  const glow = ctx.createRadialGradient(cx, baseY - height * 0.45, 10, cx, baseY - height * 0.45, Math.max(60, height * 0.75));
  glow.addColorStop(0, 'rgba(200, 30, 0, 0.35)');
  glow.addColorStop(1, 'rgba(200, 30, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - height, baseY - height * 1.3, height * 2, height * 1.5);
  ctx.beginPath();
  for (let index = 0; index <= steps; index += 1) {
    const along = index / steps;
    const { half, sway } = shape(along);
    ctx.lineTo(cx + sway - half, baseY - along * height);
  }
  for (let index = steps; index >= 0; index -= 1) {
    const along = index / steps;
    const { half, sway } = shape(along);
    ctx.lineTo(cx + sway + half, baseY - along * height);
  }
  ctx.closePath();
  const body = ctx.createLinearGradient(cx - topWidth / 2, 0, cx + topWidth / 2, 0);
  body.addColorStop(0, '#47000a');
  body.addColorStop(0.3, '#0a0205');
  body.addColorStop(0.7, '#0a0205');
  body.addColorStop(1, '#47000a');
  ctx.fillStyle = body;
  ctx.fill();
  // the bands of fire spiralling up (only the side facing us burns bright)
  ctx.globalCompositeOperation = 'lighter';
  for (let band = 0; band < 6; band += 1) {
    for (let index = 0; index <= steps * 3; index += 1) {
      const along = index / (steps * 3);
      const { half, sway } = shape(along);
      const phase = time * 5 - along * 16 + band * (Math.PI / 3);
      const facing = Math.cos(phase);
      if (facing < 0) continue;
      ctx.fillStyle = `rgba(255, ${80 + Math.round(facing * 90)}, 30, ${0.25 + facing * 0.55})`;
      ctx.fillRect(cx + sway + Math.sin(phase) * half - 2, baseY - along * height - 2, 5, 4);
    }
  }
  // flames licking the edges
  for (let index = 2; index <= steps; index += 3) {
    const along = index / steps;
    const { half, sway } = shape(along);
    drawFlametombFlame(cx + sway - half, baseY - along * height + 6, 8 + along * 12, time * 12 + index, 'outer');
    drawFlametombFlame(cx + sway + half, baseY - along * height + 6, 8 + along * 12, time * 13 + index * 2, 'outer');
  }
  ctx.globalCompositeOperation = 'source-over';
  // rocks and embers caught in it
  for (let bit = 0; bit < 18; bit += 1) {
    const along = (bit * 0.061 + time * 0.12) % 1;
    const { half, sway } = shape(along);
    const angle = time * 4 + bit * 1.9;
    const bx = cx + sway + Math.cos(angle) * half * 1.08;
    const by = baseY - along * height + Math.sin(angle) * 6;
    ctx.fillStyle = bit % 3 ? '#140808' : '#ff7043';
    ctx.fillRect(bx, by, bit % 3 ? 5 : 3, bit % 3 ? 4 : 3);
  }
  // black smoke spreading from the top
  const topY = baseY - height;
  const topHalf = shape(1).half;
  for (let puff = 0; puff < 7; puff += 1) {
    const spread = ((time * 30 + puff * 40) % 160) / 160;
    ctx.fillStyle = `rgba(20, 10, 14, ${0.6 * (1 - spread)})`;
    ctx.beginPath();
    ctx.ellipse(cx + shape(1).sway + (puff % 2 ? 1 : -1) * (topHalf * 0.6 + spread * 160), topY - spread * 40, 50 + spread * 50, 20 + spread * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// a slab of light (the platforms Light Warrior makes)
function drawKnightB8Shard(x, y, w, kind, time, alpha = 1, crumble = 0) {
  ctx.save();
  ctx.globalAlpha = alpha * (crumble > 0 && Math.floor(crumble / 4) % 2 ? 0.55 : 1);
  const under = ctx.createRadialGradient(x, y + 6, 4, x, y + 6, w * 0.7);
  under.addColorStop(0, 'rgba(255, 241, 118, 0.35)');
  under.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = under;
  ctx.fillRect(x - w * 0.7, y - w * 0.3, w * 1.4, w * 0.8);
  const slab = ctx.createLinearGradient(0, y, 0, y + 12);
  slab.addColorStop(0, kind === 'crumble' ? '#ffe0b2' : '#fffde7');
  slab.addColorStop(1, kind === 'moving' ? '#80deea' : '#fdd835');
  ctx.fillStyle = slab;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + 2);
  ctx.lineTo(x - w / 2 + 8, y);
  ctx.lineTo(x + w / 2 - 8, y);
  ctx.lineTo(x + w / 2, y + 2);
  ctx.lineTo(x + w / 2 - 12, y + 12);
  ctx.lineTo(x - w / 2 + 12, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + 8, y + 1);
  ctx.lineTo(x + w / 2 - 8, y + 1);
  ctx.stroke();
  ctx.strokeStyle = `rgba(201, 162, 39, ${0.6 + Math.sin(time * 3 + x) * 0.3})`;
  for (let rune = -1; rune <= 1; rune += 1) {
    ctx.beginPath();
    ctx.arc(x + rune * w * 0.28, y + 6, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (crumble > 0) {
    ctx.strokeStyle = 'rgba(60, 30, 0, 0.8)';
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x - 2, y + 7);
    ctx.lineTo(x + 8, y + 12);
    ctx.stroke();
  }
  ctx.restore();
}

function tickKnightB8Firenado(cs) {
  const t = cs.t;
  const time = performance.now() / 1000;
  if (t === 30) playTone({ frequency: 50, duration: 3, type: 'sawtooth', volume: 0.09, slideTo: 220 });
  if (t > 90 && t % 8 === 0) playNoise({ duration: 0.3, volume: 0.07, filterFrequency: 400 + (t % 3) * 200 });
  const grow = Math.max(0, Math.min(1, (t - 90) / 90));
  const height = grow * 720;
  const fmX = 300;
  // Light Warrior: pushed by the wind... then up the slabs he makes
  const shards = [[720, ground - 120], [600, ground - 230], [760, ground - 340], [640, ground - 450], [780, ground - 560]];
  let lwX = 760 + Math.min(1, Math.max(0, (t - 100) / 50)) * 40;
  let lwFeet = ground;
  if (t > 190) {
    const hop = (t - 190) / 22;
    const index = Math.min(shards.length - 1, Math.floor(hop));
    const k = hop - Math.floor(hop);
    const from = index === 0 ? [lwX, ground] : shards[index - 1];
    const to = shards[index];
    lwX = from[0] + (to[0] - from[0]) * k;
    lwFeet = from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 50;
    if (hop >= shards.length) lwFeet = shards[shards.length - 1][1] - (hop - shards.length) * 80;
  }
  if (t > 330) {
    switchKnightB8Cs('climb', makeKnightB8Climb());
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (t > 90) ctx.translate((Math.random() - 0.5) * (3 + grow * 5), (Math.random() - 0.5) * (2 + grow * 3));
  drawKnightB8Platform();
  // the sky turns red with it
  ctx.fillStyle = `rgba(90, 0, 10, ${0.4 * grow})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  // the ground cracks under him
  if (t > 20) {
    const k = Math.min(1, (t - 20) / 40);
    ctx.strokeStyle = `rgba(255, 87, 34, ${0.9 * k})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let crack = 0; crack < 6; crack += 1) {
      const dir = crack % 2 ? 1 : -1;
      ctx.moveTo(fmX, ground + 2);
      ctx.lineTo(fmX + dir * (30 + crack * 22) * k, ground + 4 + (crack % 3) * 3);
      ctx.lineTo(fmX + dir * (50 + crack * 30) * k, ground + 2 + (crack % 2) * 6);
    }
    ctx.stroke();
    const under = ctx.createRadialGradient(fmX, ground, 4, fmX, ground, 140 * k);
    under.addColorStop(0, 'rgba(255, 61, 0, 0.6)');
    under.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = under;
    ctx.fillRect(fmX - 150, ground - 80, 300, 120);
  }
  // embers spiralling into him before it rises
  if (t > 40 && t < 130) {
    for (let ember = 0; ember < 30; ember += 1) {
      const k = ((t - 40) * 0.02 + ember * 0.033) % 1;
      const angle = ember * 2.4 + time * 6;
      const radius = 260 * (1 - k);
      ctx.fillStyle = ember % 3 ? '#ff7043' : '#1a0505';
      ctx.fillRect(fmX + Math.cos(angle) * radius, ground - 70 + Math.sin(angle) * radius * 0.5, 4, 4);
    }
  }
  // his slabs of light
  if (t > 160) {
    shards.forEach(([sx, sy], index) => {
      const form = Math.max(0, Math.min(1, (t - 160 - index * 6) / 18));
      if (form > 0) drawKnightB8Shard(sx, sy, 104 * form, 'solid', time, form);
    });
  }
  drawKnightB8Funnel(fmX, ground, height, time, 1, 60 + 300 * grow);
  drawKnightB8Actor(player1, fmX - player1.width / 2, ground - player1.height, 1, 0, t > 20 && t < 120);
  drawKnightB8Actor(player2, lwX - player2.width / 2, lwFeet - player2.height, -1);
  ctx.restore();
  if (t > 12 && t < 120) drawKnightB8Say(fmX, ground - player1.height - 30, '...Firenado.', '#ff8a65', Math.min(1, (120 - t) / 20, (t - 12) / 10));
  if (t > 90 && t < 230) {
    ctx.save();
    const pop = 1 + Math.max(0, (110 - t) / 20) * 0.6;
    ctx.translate(canvas.width / 2 + (Math.random() - 0.5) * 3, 170);
    ctx.scale(pop, pop);
    drawKnightB7Text(0, 0, 'F I R E N A D O', '#ff3d00', Math.min(1, (t - 90) / 10, (230 - t) / 20), false, 48);
    ctx.restore();
  }
  if (t > 200 && t < 320) drawKnightB8Say(lwX, Math.max(70, lwFeet - player2.height - 20), 'Arriba!', '#fff59d', Math.min(1, (320 - t) / 20), false);
}

// ---------- 3) the climb: up his slabs of light, after him, with the Firenado rising below ----------
function makeKnightB8Climb() {
  const discs = buildFarolClimbDiscs();
  discs.forEach((disc) => { disc.form = 1; });
  const topY = discs[discs.length - 1].y - 104;
  return {
    discs,
    topY,
    top: { x1: 690, x2: 1010, y: topY, kind: 'top' },
    floor: { x1: 0, x2: canvas.width, y: ground, kind: 'floor' },
    cam: 0,
    fm: { x: 280, y: ground, vx: 0, vy: 0, grounded: true, on: null, safe: null, jumpHeld: false, facing: 1, invuln: 0, kb: 0 },
    lw: { x: 760, y: ground - 300 },
    lwSide: 1,
    fire: ground + 40,
    shots: [],
    spears: [],
    slashes: [],
    caption: { text: 'A / D moverse  -  W saltar  -  seguilo hasta arriba!', life: 200 },
    strike: 0,
  };
}

function getKnightB8ClimbPlatforms(cs) {
  const platforms = [cs.floor, cs.top];
  cs.discs.forEach((disc) => {
    if (disc.gone > 0) return;
    platforms.push({ x1: disc.x - disc.w / 2, x2: disc.x + disc.w / 2, y: disc.y, kind: disc.kind, disc });
  });
  return platforms;
}

function hurtKnightB8Climber(cs, direction) {
  const fm = cs.fm;
  if (fm.invuln > 0 || cs.lost) return;
  if (player1.health <= 1) {
    cs.endure = (typeof cs.endure === 'number' ? cs.endure : 10) - 1;
    if (cs.endure <= 0) {
      cs.lost = 1;
      fm.vy = -6;
      fm.grounded = false;
      fm.on = null;
      playTone({ frequency: 120, duration: 1.2, type: 'sawtooth', volume: 0.06, slideTo: 40 });
      return;
    }
  }
  player1.health = Math.max(1, player1.health - player1.maxHealth * 0.04);
  fm.invuln = 45;
  fm.kb = direction * 4;
  playSound('judgeFinalHurt');
  updateHealthBars();
}

// the sky as they go up: dusk below, night above, clouds passing down
function drawKnightB8ClimbSky(cs, time) {
  const width = canvas.width;
  const progress = Math.max(0, Math.min(1, -cs.cam / Math.max(1, -(cs.topY - 150))));
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const mix = (a, b) => a.map((value, index) => Math.round(value + (b[index] - value) * progress));
  const top = mix([70, 40, 80], [8, 8, 30]);
  const bottom = mix([210, 110, 80], [60, 30, 90]);
  sky.addColorStop(0, `rgb(${top.join(',')})`);
  sky.addColorStop(1, `rgb(${bottom.join(',')})`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 80; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${progress * (0.3 + 0.4 * Math.abs(Math.sin(time + star)))})`;
    ctx.fillRect((star * 131) % width, (((star * 59 - cs.cam * 0.1) % canvas.height) + canvas.height) % canvas.height, 2, 2);
  }
  // clouds, drifting down past us as we rise
  for (let layer = 0; layer < 3; layer += 1) {
    const speed = 0.25 + layer * 0.2;
    ctx.fillStyle = `rgba(${150 - layer * 30}, ${110 - layer * 20}, ${150 - layer * 10}, ${0.35 + layer * 0.12})`;
    for (let puff = 0; puff < 6; puff += 1) {
      const px = ((puff * 210 + layer * 90 + time * (8 + layer * 5)) % (width + 300)) - 150;
      const py = ((((puff * 170 + layer * 60) - cs.cam * speed) % (canvas.height + 200)) + canvas.height + 200) % (canvas.height + 200) - 100;
      ctx.beginPath();
      ctx.ellipse(px, py, 130 - layer * 20, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function tickKnightB8Climb(cs) {
  const t = cs.t;
  const time = performance.now() / 1000;
  const fm = cs.fm;
  const lw = cs.lw;
  if (fm.invuln > 0) fm.invuln -= 1;
  cs.discs.forEach((disc) => {
    if (disc.kind === 'moving') {
      const nextX = Math.max(70, Math.min(760, disc.baseX + Math.sin(t * 0.025 + disc.seed) * 62));
      disc.dx = nextX - disc.x;
      disc.x = nextX;
    }
    if (disc.gone > 0) {
      disc.gone -= 1;
      if (disc.gone === 0) disc.crumble = 0;
    } else if (disc.crumble > 0) {
      disc.crumble += 1;
      if (disc.crumble > 50) {
        disc.gone = 160;
        if (fm.on && fm.on.disc === disc) {
          fm.on = null;
          fm.grounded = false;
        }
      }
    }
  });
  const fmCenter = { x: fm.x + player1.width / 2, y: fm.y - player1.height / 2 };
  if (cs.lost) {
    cs.lost += 1;
    fm.vy = Math.min(14, fm.vy + 0.5);
    fm.y += fm.vy;
    fm.x += fm.kb * 0.5;
    if (cs.lost > 100) {
      cs.over = true;
      cancelAnimationFrame(cs.raf);
      knightB8.cs = null;
      document.body.classList.remove('knightb-ending');
      knightB8.checkpoint = 'climb';
      player1.health = 0;
      player1.position = { x: 260, y: ground - player1.height };
      player2.position = { x: 760, y: ground - player2.height };
      updateHealthBars();
      gameStarted = true;
      gameOver = false;
      animate();
      return;
    }
  } else if (!cs.strike) {
    const move = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    if (move) fm.facing = move;
    fm.kb *= 0.88;
    fm.vx = move * farolClimbSpeed + fm.kb;
    const jumpKey = keys.w || keys.ArrowUp;
    if (jumpKey && !fm.jumpHeld && fm.grounded) {
      fm.vy = farolClimbJump;
      fm.grounded = false;
      fm.on = null;
      playSound('cutsceneStep');
    }
    fm.jumpHeld = jumpKey;
    if (fm.on && fm.on.disc && fm.on.disc.kind === 'moving') fm.x += fm.on.disc.dx;
    fm.vy = Math.min(15, fm.vy + farolClimbGravity);
    const previousFeet = fm.y;
    fm.x = Math.max(0, Math.min(canvas.width - player1.width, fm.x + fm.vx));
    fm.y += fm.vy;
    fm.grounded = false;
    if (fm.vy >= 0) {
      const centerX = fm.x + player1.width / 2;
      for (const platform of getKnightB8ClimbPlatforms(cs)) {
        if (previousFeet <= platform.y + 1 && fm.y >= platform.y && centerX > platform.x1 - 10 && centerX < platform.x2 + 10) {
          fm.y = platform.y;
          fm.vy = 0;
          fm.grounded = true;
          fm.on = platform;
          if (platform.kind === 'crumble' && platform.disc.crumble === 0) platform.disc.crumble = 1;
          break;
        }
      }
    }
    // the Firenado rises behind him... and if he falls into it, it throws him back up
    const rise = cs.fire - fm.y > 330 ? 1.6 : 0.55;
    cs.fire = Math.max(cs.topY + 160, cs.fire - rise);
    if (fm.y >= cs.fire - 6 && fm.vy >= 0) {
      fm.y = cs.fire - 6;
      fm.vy = farolClimbJump * 1.25;
      fm.grounded = false;
      fm.on = null;
      playNoise({ duration: 0.3, volume: 0.06, filterFrequency: 700 });
    }
    if (fm.grounded && fm.on && fm.on.kind === 'top') {
      cs.strike = 1;
      fm.vx = 0;
    }
    // Light Warrior, always above him, attacking
    const progress = Math.max(0, Math.min(1, (ground - fm.y) / (ground - cs.topY)));
    if (t % 300 === 0 || (lw.x < 80 && cs.lwSide < 0) || (lw.x > canvas.width - 140 && cs.lwSide > 0)) cs.lwSide *= -1;
    const targetX = Math.max(40, Math.min(canvas.width - 100, fm.x + cs.lwSide * 240));
    lw.x += (targetX - lw.x) * 0.04;
    lw.y += (Math.max(cs.topY, fm.y - 260) + Math.sin(t / 30) * 20 - lw.y) * 0.05;
    const lwCenter = { x: lw.x + player2.width / 2, y: lw.y - player2.height / 2 };
    // a fan of light orbs (five, leaving trails)
    const orbRate = Math.round(130 - progress * 40);
    if (t > 60 && t % orbRate === 0) {
      const aim = Math.atan2(fmCenter.y - lwCenter.y, fmCenter.x - lwCenter.x);
      [-0.4, -0.2, 0, 0.2, 0.4].forEach((spread) => cs.shots.push({ x: lwCenter.x, y: lwCenter.y, vx: Math.cos(aim + spread) * 4.6, vy: Math.sin(aim + spread) * 4.6, r: 8, life: 220, trail: [] }));
      playSound('judgeLight');
    }
    // spears of light falling around him (they warn first)
    if (t > 150 && t % Math.round(260 - progress * 70) === 0) {
      [-110, 0, 110].forEach((offset, index) => cs.spears.push({ x: fmCenter.x + offset, warn: 46 + index * 8, y: cs.cam - 60, vy: 15 }));
      playTone({ frequency: 880, duration: 0.25, type: 'triangle', volume: 0.04 });
    }
    // a crescent of light that sweeps across at his height
    if (t > 260 && t % Math.round(400 - progress * 100) === 200) {
      const fromLeft = fmCenter.x > canvas.width / 2;
      cs.slashes.push({ y: fmCenter.y, warn: 40, x: fromLeft ? -60 : canvas.width + 60, vx: fromLeft ? 9 : -9 });
    }
    const touches = (x, y, rx, ry = rx) => x + rx > fm.x + 6 && x - rx < fm.x + player1.width - 6 && y + ry > fm.y - player1.height + 6 && y - ry < fm.y - 4;
    cs.shots.forEach((shot) => {
      shot.life -= 1;
      shot.trail.push({ x: shot.x, y: shot.y });
      if (shot.trail.length > 6) shot.trail.shift();
      shot.x += shot.vx;
      shot.y += shot.vy;
      if (touches(shot.x, shot.y, shot.r)) {
        hurtKnightB8Climber(cs, shot.vx >= 0 ? 1 : -1);
        shot.life = 0;
      }
    });
    cs.shots = cs.shots.filter((shot) => shot.life > 0 && shot.x > -80 && shot.x < canvas.width + 80);
    cs.spears.forEach((spear) => {
      if (spear.warn > 0) {
        spear.warn -= 1;
        spear.y = cs.cam - 60;
        return;
      }
      spear.y += spear.vy;
      if (touches(spear.x, spear.y, 7, 36)) {
        hurtKnightB8Climber(cs, 0);
        spear.y = 1e9;
      }
    });
    cs.spears = cs.spears.filter((spear) => spear.warn > 0 || spear.y < cs.cam + canvas.height + 100);
    cs.slashes.forEach((slash) => {
      if (slash.warn > 0) {
        slash.warn -= 1;
        return;
      }
      slash.x += slash.vx;
      if (touches(slash.x, slash.y, 22, 30)) {
        hurtKnightB8Climber(cs, Math.sign(slash.vx));
        slash.x = -1e9;
      }
    });
    cs.slashes = cs.slashes.filter((slash) => slash.warn > 0 || (slash.x > -120 && slash.x < canvas.width + 120));
    const camTarget = Math.max(cs.topY - 150, Math.min(0, fm.y - 330));
    cs.cam += (camTarget - cs.cam) * 0.1;
  } else {
    // 4) at the top: one blow, as hard as he can... to the Gran Farol
    cs.strike += 1;
    const s = cs.strike;
    cs.shots = [];
    cs.spears = [];
    cs.slashes = [];
    lw.x += (fm.x + 150 - lw.x) * 0.12;
    lw.y += (fm.y - lw.y) * 0.12;
    if (s === 2) cs.lwSay = { text: '...Basta.', life: 70 };
    if (s === 40) playTone({ frequency: 200, duration: 0.8, type: 'sine', volume: 0.06, slideTo: 1200 });
    if (s === 80) {
      cs.flash = 1;
      cs.ring = 1;
      playNoise({ duration: 1, volume: 0.26, filterFrequency: 1600 });
      playTone({ frequency: 50, duration: 0.9, type: 'square', volume: 0.12, slideTo: 25 });
      fm.vx = -16;
      fm.vy = -10;
    }
    if (s > 80) {
      fm.x += fm.vx;
      fm.y += fm.vy;
    }
    if (s > 130) cs.white = Math.min(1, (s - 130) / 30);
    if (s > 175) {
      selectedMap = 'farolTop';
      switchKnightB8Cs('farol', { fx: 260, fy: -260, fvy: 0, lx: 760, ly: -320, line: null, typed: 0, lineT: 0 });
      return;
    }
  }
  if (cs.caption) cs.caption.life -= 1;
  if (cs.lwSay) cs.lwSay.life -= 1;
  // ---------- drawing ----------
  const cam = cs.cam;
  drawKnightB8ClimbSky(cs, time);
  // the Firenado, behind everything: its mouth is the fire rising after him
  const fireY = cs.fire - cam;
  const funnelBase = canvas.height + 260;
  drawKnightB8Funnel(470, funnelBase, Math.max(40, funnelBase - fireY), time, 0.95, 980);
  cs.discs.forEach((disc) => {
    if (disc.gone > 0) return;
    const shake = disc.crumble > 0 ? (Math.random() - 0.5) * 4 : 0;
    drawKnightB8Shard(disc.x + shake, disc.y - cam, disc.w, disc.kind, time, 1, disc.crumble);
  });
  drawKnightB8Shard((cs.top.x1 + cs.top.x2) / 2, cs.top.y - cam, cs.top.x2 - cs.top.x1, 'solid', time);
  // warnings and attacks
  cs.spears.forEach((spear) => {
    if (spear.warn > 0) {
      ctx.strokeStyle = `rgba(255, 213, 79, ${0.35 + Math.sin(t / 2) * 0.25})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(spear.x, 0);
      ctx.lineTo(spear.x, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    const sy = spear.y - cam;
    ctx.save();
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.moveTo(spear.x, sy + 40);
    ctx.lineTo(spear.x + 6, sy - 10);
    ctx.lineTo(spear.x, sy - 44);
    ctx.lineTo(spear.x - 6, sy - 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 241, 118, 0.35)';
    ctx.fillRect(spear.x - 2, sy - 120, 4, 80);
    ctx.restore();
  });
  cs.slashes.forEach((slash) => {
    const sy = slash.y - cam;
    if (slash.warn > 0) {
      ctx.fillStyle = `rgba(255, 213, 79, ${0.25 + Math.sin(t / 2) * 0.2})`;
      ctx.fillRect(0, sy - 30, canvas.width, 60);
      return;
    }
    ctx.save();
    ctx.translate(slash.x, sy);
    ctx.scale(Math.sign(slash.vx), 1);
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 253, 231, 0.95)';
    ctx.beginPath();
    ctx.arc(-10, 0, 36, -Math.PI / 2, Math.PI / 2);
    ctx.arc(-24, 0, 30, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  // Light Warrior: wings of light while he flies
  const lwScreenY = lw.y - cam - player2.height;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const flap = Math.sin(time * 6) * 0.25;
  [-1, 1].forEach((side) => {
    ctx.save();
    ctx.translate(lw.x + player2.width / 2, lwScreenY + 40);
    ctx.rotate(side * (0.5 + flap));
    ctx.fillStyle = 'rgba(255, 249, 196, 0.35)';
    ctx.beginPath();
    ctx.ellipse(side * 50, -10, 52, 16, side * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  const aura = ctx.createRadialGradient(lw.x + player2.width / 2, lwScreenY + 60, 6, lw.x + player2.width / 2, lwScreenY + 60, 90);
  aura.addColorStop(0, 'rgba(255, 249, 196, 0.4)');
  aura.addColorStop(1, 'rgba(255, 249, 196, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(lw.x - 70, lwScreenY - 40, player2.width + 140, player2.height + 100);
  ctx.restore();
  drawKnightB8Actor(player2, lw.x, lwScreenY, fm.x > lw.x ? 1 : -1, 0, cs.strike > 70 && cs.strike < 90);
  cs.shots.forEach((shot) => {
    shot.trail.forEach((point, index) => {
      ctx.fillStyle = `rgba(255, 241, 118, ${(index / shot.trail.length) * 0.4})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y - cam, shot.r * (index / shot.trail.length), 0, Math.PI * 2);
      ctx.fill();
    });
    const y = shot.y - cam;
    const glow = ctx.createRadialGradient(shot.x, y, 1, shot.x, y, shot.r + 7);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.45, 'rgba(255, 241, 118, 0.95)');
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(shot.x, y, shot.r + 7, 0, Math.PI * 2);
    ctx.fill();
  });
  if (!(fm.invuln > 0 && Math.floor(fm.invuln / 4) % 2 === 0)) drawKnightB8Actor(player1, fm.x, fm.y - cam - player1.height, fm.facing);
  // the mouth of the Firenado: a sea of black fire under him
  if (fireY < canvas.height + 60) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height + 20);
    for (let x = 0; x <= canvas.width; x += 16) ctx.lineTo(x, fireY + Math.sin(time * 4 + x * 0.03) * 8 + Math.sin(time * 7 + x * 0.09) * 4);
    ctx.lineTo(canvas.width, canvas.height + 20);
    ctx.closePath();
    const sea = ctx.createLinearGradient(0, fireY - 10, 0, fireY + 140);
    sea.addColorStop(0, '#5a0008');
    sea.addColorStop(0.2, '#0c0305');
    sea.addColorStop(1, '#000000');
    ctx.fillStyle = sea;
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 24; flame += 1) {
      const x = flame * 44 + Math.sin(flame * 3.1) * 10;
      drawFlametombFlame(x, fireY + 8 + Math.sin(time * 4 + x * 0.03) * 8, 18 + (flame * 7) % 12, time * 11 + flame, 'outer');
    }
    for (let ember = 0; ember < 20; ember += 1) {
      const rise = (time * 60 + ember * 31) % 160;
      ctx.fillStyle = `rgba(255, 112, 67, ${1 - rise / 160})`;
      ctx.fillRect((ember * 53) % canvas.width, fireY - rise, 3, 3);
    }
    ctx.restore();
  }
  // the blow: a ring of light where it lands
  if (cs.ring) {
    cs.ring += 1;
    ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, 1 - cs.ring / 30)})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(fm.x + player1.width / 2, fm.y - cam - 60, cs.ring * 14, cs.ring * 9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (cs.strike > 20 && cs.strike < 80) {
    // the light gathering in his fist
    const k = (cs.strike - 20) / 60;
    const fx = lw.x + player2.width / 2 - 30;
    const fy = lwScreenY + 60;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const fist = ctx.createRadialGradient(fx, fy, 2, fx, fy, 20 + k * 60);
    fist.addColorStop(0, 'rgba(255, 255, 255, 1)');
    fist.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = fist;
    ctx.fillRect(fx - 90, fy - 90, 180, 180);
    ctx.restore();
  }
  // how high: a meter on the right
  const progress = Math.max(0, Math.min(1, (ground - fm.y) / (ground - cs.topY)));
  const fireProgress = Math.max(0, Math.min(1, (ground - cs.fire) / (ground - cs.topY)));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(canvas.width - 38, 120, 18, 300);
  ctx.fillStyle = '#7f0000';
  ctx.fillRect(canvas.width - 38, 120 + 300 * (1 - fireProgress), 18, 300 * fireProgress);
  ctx.fillStyle = '#ff7043';
  ctx.fillRect(canvas.width - 42, 120 + 300 * (1 - progress) - 3, 26, 6);
  ctx.strokeStyle = '#fff59d';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 38, 120, 18, 300);
  if (cs.lwSay && cs.lwSay.life > 0) drawKnightB8Say(lw.x + player2.width / 2, lwScreenY - 18, cs.lwSay.text, '#fff59d', Math.min(1, cs.lwSay.life / 15), false);
  if (cs.caption && cs.caption.life > 0) drawKnightB7Text(canvas.width / 2, 170, cs.caption.text, '#ff8a65', Math.min(1, cs.caption.life / 20), false, 20);
  if (player1.health <= 1 && !cs.lost) {
    const left = typeof cs.endure === 'number' ? cs.endure : 10;
    drawKnightB7Text(canvas.width / 2, 120, 'AGUANTE', '#ff7043', 1, false, 16);
    for (let pip = 0; pip < 10; pip += 1) {
      ctx.fillStyle = pip < left ? '#ff5722' : 'rgba(60, 20, 20, 0.7)';
      ctx.fillRect(canvas.width / 2 - 100 + pip * 20, 130, 14, 10);
    }
  }
  if (cs.lost) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.8, cs.lost / 100)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cs.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cs.flash = Math.max(0, cs.flash - 0.05);
  }
  if (cs.white) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.white})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- 5) the top of the Gran Farol: "here it all ends"... SUPER FIRE MASTER (B) ----------
const knightB8FarolLines = [
  [150, { who: 'lw', text: 'Aqui termina todo, Fire Master.' }],
  [330, { who: 'lw', text: 'Por Robledal. Por el bunker. Por Knight.' }],
  [500, { who: 'fireMaster', text: '...No.' }],
  [620, { who: 'voice', text: 'MAS. NECESITAMOS MAS FUEGO.' }],
];

function tickKnightB8Farol(cs) {
  const t = cs.t;
  const time = performance.now() / 1000;
  // he crashes onto the top; Light Warrior comes down
  if (cs.fy < ground - player1.height) {
    cs.fvy += 0.9;
    cs.fy = Math.min(ground - player1.height, cs.fy + cs.fvy);
    if (cs.fy >= ground - player1.height) {
      cs.shake = 24;
      player1.health = Math.max(1, Math.round(player1.maxHealth * 0.25));
      updateHealthBars();
      playNoise({ duration: 0.7, volume: 0.16, filterFrequency: 500 });
    }
  }
  cs.ly = Math.min(ground - player2.height, cs.ly + 3);
  knightB8FarolLines.forEach(([at, line]) => {
    if (t === at) {
      cs.line = line;
      cs.typed = 0;
      playSound('menuMove');
      if (line.who === 'voice') playTone({ frequency: 45, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    }
  });
  if (cs.line && cs.line.text && t % 2 === 0) cs.typed = Math.min(cs.line.text.length, cs.typed + 1);
  if (t === 760) {
    cs.line = null;
    playTone({ frequency: 40, duration: 3, type: 'sawtooth', volume: 0.08, slideTo: 90 });
  }
  if (t === 900) {
    cs.flash = 1;
    makeKnightB8Super(player1);
    playNoise({ duration: 1.2, volume: 0.2, filterFrequency: 800 });
  }
  if (t > 1080) {
    player1.position = { x: cs.fx, y: ground - player1.height };
    player2.position = { x: cs.lx, y: ground - player2.height };
    player1.attacksToTheRight = true;
    player2.attacksToTheRight = false;
    // (up here he still has most of his strength)
    player2.health = Math.max(player2.health, Math.round(player2.maxHealth * 0.7));
    knightB8.p2StartHealth = null;
    updateHealthBars();
    endKnightB8Cs('p2');
    return;
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (cs.shake > 0) {
    cs.shake -= 1;
    ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6);
  }
  drawFarolTopStage(0);
  // down until he gets up (at "...No.")
  const rise = Math.max(0, Math.min(1, (t - 470) / 80));
  const lying = cs.fy >= ground - player1.height ? (-Math.PI / 2) * (1 - rise) : 0;
  if (t > 760 && t < 900) {
    // the magic: the fire turns on itself around him, darker and darker
    const k = (t - 760) / 140;
    const cx = cs.fx + player1.width / 2;
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * k})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 10; flame += 1) {
      const angle = time * 6 + (flame / 10) * Math.PI * 2;
      drawFlametombFlame(cx + Math.cos(angle) * (90 - k * 50), ground - 60 + Math.sin(angle) * 50, 12 + k * 10, time * 12 + flame, 'outer');
    }
    ctx.restore();
  }
  drawKnightB8Actor(player1, cs.fx, cs.fy, 1, lying);
  drawKnightB8Actor(player2, cs.lx, cs.ly, -1);
  ctx.restore();
  if (cs.line) drawKnightB8Dialog(cs.line, cs.typed);
  if (cs.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cs.flash = Math.max(0, cs.flash - 0.03);
  }
  if (t > 900 && t < 1080) drawKnightB7Text(canvas.width / 2, 190, 'SUPER FIRE MASTER (B)', '#ff3d00', Math.min(1, (t - 900) / 20, (1080 - t) / 20), false, 40);
}

// ---------- 6) the super Flametomb (KNIGHT v FLOWERMAN starts with it)... he falls... a white flash... ----------
// and, from 0:17.5 to 0:29.5 of the song, a black screen where Light Warrior writes to Fire Master
const knightB8OmegaWords = [
  [17.8, '...Tenes suerte, Fire Master.'],
  [20.0, 'Despues de todo esto, ya no me queda tanta energia.'],
  [22.6, 'Asi que no va a durar mucho.'],
  [24.6, 'Pero preparate de todos modos.'],
  [26.3, 'Para OMEGA LIGHT WARRIOR.'],
];

function startKnightB8SuperTomb() {
  startKnightB8Cs('superTomb', { fx: player1.position.x, lx: player2.position.x, sound: null, music: false, musicAt: 0, dark: 0, typedChars: 0 });
}

// where the song is (the real track if it is playing; if not, counted in frames)
function getKnightB8SongTime(cs) {
  if (!cs.musicAt) return -1;
  const tracks = reflecterBattleMusic && reflecterBattleMusic.tracks;
  const track = tracks && tracks.dawnHope;
  if (track && reflecterBattleMusic.current === 'dawnHope' && !track.paused && track.currentTime > 0.05) {
    cs.songClock = track.currentTime;
    return track.currentTime;
  }
  return (cs.t - cs.musicAt) / 60;
}

// a flash so bright it hurts: loud, torn, saturated
function playKnightB8FlashBurst() {
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (!audio || !out) return;
  const now = audio.currentTime;
  const length = 1.6;
  const shaper = audio.createWaveShaper();
  const curve = new Float32Array(2048);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i * 2) / curve.length - 1;
    curve[i] = ((3 + 200) * x * 20 * (Math.PI / 180)) / (Math.PI + 200 * Math.abs(x));
  }
  shaper.curve = curve;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(1, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  shaper.connect(gain);
  gain.connect(out);
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * length), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  const bright = audio.createBiquadFilter();
  bright.type = 'highpass';
  bright.frequency.value = 900;
  noise.connect(bright);
  bright.connect(shaper);
  noise.start(now);
  [[3200, 'sawtooth'], [2400, 'square'], [1200, 'sawtooth']].forEach(([frequency, type]) => {
    const osc = audio.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + length);
    const level = audio.createGain();
    level.gain.value = 0.5;
    osc.connect(level);
    level.connect(shaper);
    osc.start(now);
    osc.stop(now + length + 0.05);
  });
}

function tickKnightB8SuperTomb(cs) {
  const t = cs.t;
  const time = performance.now() / 1000;
  const lwCenter = cs.lx + player2.width / 2;
  // the song starts as he begins the super Flametomb
  if (t === 40) {
    cs.music = true;
    cs.musicAt = t;
    reflecterBattleTrackStartOffsets.dawnHope = 0;
    reflecterBattleMusic.restart = true;
    lightClashMusicFade = 1;
  }
  const song = getKnightB8SongTime(cs);
  if (t === 8) cs.fmSay = { text: '...Se acabo, heroe.', life: 110 };
  cs.dark = Math.min(0.8, t / 90);
  // the tower (with the deep Flametomb sound under the music)
  if (song >= 0.5 && !cs.towerAt) {
    cs.towerAt = t;
    if (typeof Audio !== 'undefined' && typeof flametombSoundSource !== 'undefined') {
      const sound = new Audio(flametombSoundSource);
      sound.preservesPitch = false;
      sound.mozPreservesPitch = false;
      sound.webkitPreservesPitch = false;
      sound.playbackRate = 0.72;
      sound.volume = Math.max(0, Math.min(1, 0.7 * audioSettings.master * audioSettings.sfx));
      const promise = sound.play();
      if (promise && promise.catch) promise.catch(() => {});
      cs.sound = sound;
    }
  }
  const towerOn = cs.towerAt && song < 9;
  if (song >= 9 && !cs.fallen) {
    cs.fallen = t;
    player2.health = Math.max(1, Math.round(player2.maxHealth * 0.05));
    updateHealthBars();
  }
  if (cs.sound && song >= 9) cs.sound.volume = Math.max(0, cs.sound.volume - 0.02);
  if (song >= 10.2 && !cs.fmTurned) {
    cs.fmTurned = true;
    cs.fmSay = { text: '...', life: 120 };
  }
  // he gets up... fast... and a white flash covers everything
  const stir = song >= 13 ? Math.min(1, (song - 13) / 1.5) : 0;
  if (song >= 14.5 && !cs.flashed) {
    cs.flashed = true;
    cs.white = 1;
    if (cs.sound) cs.sound.pause();
    applyKnightB8Omega(player2);
    playNoise({ duration: 1.4, volume: 0.2, filterFrequency: 2400 });
  }
  if (cs.white && song < 17.5) cs.white = Math.max(0.78, cs.white - 0.004);
  // 0:28 - 0:29: the music goes down... and the flash
  if (song >= 28 && song < 29.4) lightClashMusicFade = 0.6;
  if (song >= 28.4 && !cs.burst) {
    cs.burst = 1;
    playKnightB8FlashBurst();
    playKnightB8FlashBurst();
    playNoise({ duration: 1.2, volume: 0.45 });
  }
  if (song >= 29.4) lightClashMusicFade = 1;
  if (song >= 29.5) {
    // straight into the fight (his name stays on screen for a moment)
    lightClashMusicFade = 1;
    knightB8.omegaTitle = 110;
    player1.position = { x: cs.fx, y: ground - player1.height };
    player2.position = { x: cs.lx, y: ground - player2.height };
    endKnightB8Cs('p3');
    return;
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (towerOn) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
  drawFarolTopStage(0);
  ctx.fillStyle = `rgba(0, 0, 0, ${song >= 29.5 ? 0.2 : cs.dark})`;
  ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);
  drawKnightB8Actor(player1, cs.fx, ground - player1.height, cs.lx > cs.fx ? 1 : -1, 0, towerOn);
  let lwRot = 0;
  let lwY = ground - player2.height;
  if (cs.fallen && !cs.flashed) lwRot = (-Math.PI / 2) * Math.max(0, Math.min(1, (t - cs.fallen) / 20) - stir);
  if (stir > 0 && !cs.flashed) {
    const glow = ctx.createRadialGradient(lwCenter, ground - 60, 6, lwCenter, ground - 60, 60 + stir * 140);
    glow.addColorStop(0, `rgba(255, 253, 231, ${0.8 * stir})`);
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glow;
    ctx.fillRect(lwCenter - 220, ground - 280, 440, 360);
    ctx.restore();
  }
  if (cs.flashed && song < 29.5) lwY -= 30;
  drawKnightB8Actor(player2, cs.lx, lwY, cs.fx > cs.lx ? 1 : -1, lwRot);
  if (towerOn) {
    // the super Flametomb: a tower of black fire, bigger than any
    const k = Math.min(1, (t - cs.towerAt) / 50);
    const height = 620 * k;
    ctx.save();
    // a red glow around a column of black fire, with thin edges of flame
    const glow = ctx.createRadialGradient(lwCenter, ground - height * 0.45, 20, lwCenter, ground - height * 0.45, height * 0.6 + 40);
    glow.addColorStop(0, 'rgba(180, 20, 0, 0.55)');
    glow.addColorStop(1, 'rgba(180, 20, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lwCenter - height, ground - height * 1.1, height * 2, height * 1.2);
    ctx.beginPath();
    for (let step = 0; step <= 30; step += 1) {
      const along = step / 30;
      ctx.lineTo(lwCenter - (70 - along * 36) - Math.sin(time * 8 + along * 12) * 10, ground - along * height);
    }
    for (let step = 30; step >= 0; step -= 1) {
      const along = step / 30;
      ctx.lineTo(lwCenter + (70 - along * 36) + Math.sin(time * 7 + along * 11) * 10, ground - along * height);
    }
    ctx.closePath();
    const body = ctx.createLinearGradient(lwCenter - 70, 0, lwCenter + 70, 0);
    body.addColorStop(0, '#7f0000');
    body.addColorStop(0.3, '#050102');
    body.addColorStop(0.7, '#050102');
    body.addColorStop(1, '#7f0000');
    ctx.fillStyle = body;
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 22; flame += 1) {
      const along = flame / 22;
      const edge = 70 - along * 36;
      ctx.globalAlpha = 0.7;
      drawFlametombFlame(lwCenter - edge, ground - along * height, 16 + (1 - along) * 14, time * 12 + flame, 'outer');
      drawFlametombFlame(lwCenter + edge, ground - along * height - 10, 16 + (1 - along) * 14, time * 13 + flame * 2, 'outer');
    }
    ctx.globalAlpha = 1;
    for (let ember = 0; ember < 30; ember += 1) {
      const rise = (time * 220 + ember * 41) % height;
      ctx.fillStyle = ember % 3 ? 'rgba(255, 87, 34, 0.9)' : 'rgba(255, 213, 79, 0.9)';
      ctx.fillRect(lwCenter + Math.sin(ember * 2.1 + time * 3) * (40 + rise / height * 50), ground - rise, 3, 3);
    }
    ctx.restore();
  }
  ctx.restore();
  if (cs.fmSay && cs.fmSay.life > 0) {
    cs.fmSay.life -= 1;
    drawKnightB8Say(cs.fx + player1.width / 2, ground - player1.height - 28, cs.fmSay.text, '#bdbdbd', Math.min(1, cs.fmSay.life / 20));
  }
  if (cs.white > 0 && song < 17.5) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.white})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // the black screen, and his words being written on it
  if (song >= 17.5 && song < 29.5) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let total = 0;
    knightB8OmegaWords.forEach(([at, text], index) => {
      if (song < at) return;
      const last = index === knightB8OmegaWords.length - 1;
      const typed = text.slice(0, Math.floor((song - at) * 24));
      total += typed.length;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = last ? "900 34px 'Courier New', monospace" : "700 22px 'Courier New', monospace";
      ctx.fillStyle = last ? '#fff59d' : '#f5f5f5';
      if (last && song >= 28) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
      ctx.fillText(typed, canvas.width / 2, 170 + index * 52 + (last ? 20 : 0));
      ctx.restore();
    });
    if (total > cs.typedChars) {
      cs.typedChars = total;
      playTone({ frequency: 520 + Math.random() * 60, duration: 0.03, type: 'square', volume: 0.015 });
    }
    if (cs.burst) {
      cs.burst += 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - cs.burst / 50)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (song >= 29.5) drawKnightB7Text(canvas.width / 2, 190, 'OMEGA LIGHT WARRIOR', '#fff59d', Math.min(1, (song - 29.5) * 2, (31.2 - song) * 2), false, 44);
}

// ---------- the sky: a different weather for each of the three moments of the song ----------
// 1) the clouds open, a warm sun and petals; 2) a calm night with an aurora and a soft snowfall;
// 3) after the rain: a golden light, a rainbow and the last drops shining
function getKnightB8MoodIndex() {
  if (typeof knightB8.hopeOverride === 'number') return knightB8.hopeOverride;
  const tracks = reflecterBattleMusic && reflecterBattleMusic.tracks;
  const track = tracks && tracks.flowerDream;
  if (!track || reflecterBattleMusic.current !== 'flowerDream' || track.paused) return 0;
  const now = track.currentTime;
  return knightB8HopeWindows.findIndex(([from, to]) => now >= from && now < to) + 1;
}

function drawKnightB8AuroraSky(alpha, skyBottom, time) {
  const width = canvas.width;
  ctx.save();
  ctx.globalAlpha = alpha;
  const night = ctx.createLinearGradient(0, 0, 0, skyBottom);
  night.addColorStop(0, '#071630');
  night.addColorStop(0.6, '#13385a');
  night.addColorStop(1, '#3f6f8a');
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, width, skyBottom);
  for (let star = 0; star < 60; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.4 * Math.abs(Math.sin(time + star))})`;
    ctx.fillRect((star * 131) % width, (star * 47) % (skyBottom - 120), 2, 2);
  }
  ctx.globalCompositeOperation = 'lighter';
  [['105, 240, 174', 70, 0], ['128, 222, 234', 110, 1.7], ['179, 136, 255', 150, 3.1]].forEach(([color, baseY, phase]) => {
    for (let x = 0; x < width; x += 6) {
      const wave = Math.sin(x / 120 + time * 0.5 + phase) * 26 + Math.sin(x / 47 + time * 0.9) * 8;
      const tall = 50 + Math.sin(x / 80 + time + phase) * 20;
      const grad = ctx.createLinearGradient(0, baseY + wave - tall, 0, baseY + wave);
      grad.addColorStop(0, `rgba(${color}, 0)`);
      grad.addColorStop(1, `rgba(${color}, 0.18)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, baseY + wave - tall, 6, tall);
    }
  });
  ctx.restore();
}

function drawKnightB8RainSky(alpha, skyBottom, time) {
  const width = canvas.width;
  ctx.save();
  ctx.globalAlpha = alpha;
  const after = ctx.createLinearGradient(0, 0, 0, skyBottom);
  after.addColorStop(0, '#6f86b0');
  after.addColorStop(0.55, '#e9a77a');
  after.addColorStop(1, '#ffd79a');
  ctx.fillStyle = after;
  ctx.fillRect(0, 0, width, skyBottom);
  // a rainbow
  ['#ef5350', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#7e57c2'].forEach((color, band) => {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha * 0.35;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(width * 0.55, skyBottom + 80, 420 - band * 7, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
  });
  ctx.globalAlpha = alpha;
  // the clouds going away, lit gold from below
  for (let puff = -1; puff < 7; puff += 1) {
    const px = ((puff * 190 + time * 7) % (width + 300)) - 150;
    ctx.fillStyle = 'rgba(255, 214, 160, 0.6)';
    ctx.beginPath();
    ctx.ellipse(px, 70 + (puff % 2) * 50, 120, 24, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawKnightB8MoodParticles(moods, time) {
  const width = canvas.width;
  const [, aurora, rain] = moods;
  ctx.save();
  if (aurora > 0.01) {
    for (let flake = 0; flake < 50; flake += 1) {
      const fx = ((flake * 89 + Math.sin(time + flake) * 30 + time * 10) % (width + 40)) - 20;
      const fy = (flake * 53 + time * (22 + (flake % 4) * 6)) % ground;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * aurora})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 1.6 + (flake % 3) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (rain > 0.01) {
    ctx.strokeStyle = `rgba(255, 236, 179, ${0.55 * rain})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let drop = 0; drop < 40; drop += 1) {
      const dx = ((drop * 71 + time * 140) % (width + 60)) - 30;
      const dy = (drop * 97 + time * 420) % ground;
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx - 4, dy + 12);
    }
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 249, 196, ${0.1 * rain})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
  ctx.restore();
}

// on top of the farol Light Warrior cannot fall before the super Flametomb: if he is beaten down that far
// before it comes, it comes right then
function guardKnightB8FarolHealth() {
  const floor = Math.round(player2.maxHealth * 0.08);
  if (player2.health > floor) return;
  player2.health = floor;
  updateHealthBars();
  if (!knightB8.superTombDone) {
    knightB8.superTombDone = true;
    knightB8.superTombIn = 1;
  }
}

// ================= LEVEL 8: abilities of the last two fights =================
// ---------- SUPER FIRE MASTER (B), R: the Super Flametomb (the one of chapter 4B, in super version) ----------
// two dozen black flames burst out of him, circle him, run to the enemy, close around him and crash into
// him one by one... and the last one explodes
const knightB8SuperFlametombCooldown = 600;
let knightB8SuperFlametombs = [];

function castKnightB8SuperFlametomb(caster, target) {
  if (!canFighterAct(caster) || (caster.knightB8SuperTombCd || 0) > 0 || gameOver || knightB8SuperFlametombs.length) return false;
  const cx = getFighterCenterX(caster);
  const cy = caster.position.y + caster.height / 2;
  const count = 24;
  knightB8SuperFlametombs.push({
    caster,
    target,
    t: 0,
    booms: [],
    flames: Array.from({ length: count }, (_, index) => ({ angle: (index / count) * Math.PI * 2, x: cx, y: cy, born: index * 0.8, hunt: 26 + index * 0.4, dive: 70 + index * 2.2, done: false })),
    sound: typeof playKnightBTombSound === 'function' ? playKnightBTombSound(1) : null,
  });
  caster.knightB8SuperTombCd = getDebugCooldown(knightB8SuperFlametombCooldown, caster);
  caster.velocity.x = 0;
  recordSpecialUsed(caster);
  playNoise({ duration: 0.6, volume: 0.12, filterFrequency: 500 });
  playTone({ frequency: 45, duration: 1.4, type: 'sawtooth', volume: 0.08, slideTo: 30 });
  return true;
}

function updateKnightB8SuperFlametombs() {
  if (player1.knightB8SuperTombCd > 0) player1.knightB8SuperTombCd -= 1;
  if (typeof updateKnightBTombSounds === 'function') updateKnightBTombSounds();
  const time = performance.now() / 1000;
  knightB8SuperFlametombs.forEach((tomb) => {
    tomb.t += 1;
    const { caster, target } = tomb;
    const cx = getFighterCenterX(caster);
    const cy = caster.position.y + caster.height / 2;
    const tx = getFighterCenterX(target);
    const ty = target.position.y + target.height / 2;
    // once they reach him, he cannot get away
    if (tomb.flames.some((flame) => !flame.done && tomb.t >= flame.hunt + 14)) {
      target.gamblerStunTimer = Math.max(target.gamblerStunTimer || 0, 3);
      target.velocity.x = 0;
    }
    tomb.flames.forEach((flame, index) => {
      if (flame.done || tomb.t < flame.born) return;
      flame.angle += 0.1;
      let goalX;
      let goalY;
      let pull;
      if (tomb.t < flame.hunt) {
        goalX = cx + Math.cos(flame.angle) * 90;
        goalY = cy + Math.sin(flame.angle) * 70;
        pull = 0.25;
      } else if (tomb.t < flame.dive) {
        const radius = Math.max(60, 140 - (tomb.t - flame.hunt) * 1.3);
        goalX = tx + Math.cos(flame.angle * 1.4) * radius;
        goalY = ty + Math.sin(flame.angle * 1.4) * radius * 0.8;
        pull = 0.2;
      } else {
        goalX = tx;
        goalY = ty;
        pull = 0.38;
      }
      flame.x += (goalX - flame.x) * pull;
      flame.y = Math.min(ground - 20, flame.y + (goalY - flame.y) * pull);
      if (tomb.t >= flame.dive && Math.hypot(tx - flame.x, ty - flame.y) < 30) {
        flame.done = true;
        tomb.booms.push({ x: flame.x, y: flame.y, life: 22 });
        applyDamage(caster, target, 8, { isSpecial: true, ignoreInvincible: true, damageType: 'superFlametomb' });
        playNoise({ duration: 0.16, volume: 0.06, filterFrequency: 1400 + index * 50 });
      }
    });
    if (tomb.flames.every((flame) => flame.done) && !tomb.burst) {
      tomb.burst = true;
      tomb.booms.push({ x: tx, y: ty, life: 44, big: true });
      applyDamage(caster, target, 30, { isSpecial: true, ignoreInvincible: true, damageType: 'superFlametomb' });
      target.velocity.y = getDebugKnockback(-12, target);
      target.velocity.x = getDebugKnockback(tx >= cx ? 8 : -8, target);
      playSound('robotHit');
      playTone({ frequency: 46, duration: 1.4, type: 'sawtooth', volume: 0.1, slideTo: 26 });
      if (tomb.sound && typeof fadeKnightBTombSound === 'function') fadeKnightBTombSound(tomb.sound, 90);
    }
    if (tomb.burst) tomb.after = (tomb.after || 0) + 1;
    tomb.booms.forEach((boom) => { boom.life -= 1; });
    tomb.booms = tomb.booms.filter((boom) => boom.life > 0);
    // drawing: black flames, red at the edges, bigger than the old ones
    ctx.save();
    tomb.flames.forEach((flame, index) => {
      if (flame.done || tomb.t < flame.born) return;
      const grow = Math.min(1, (tomb.t - flame.born) / 8) * 1.35;
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(flame.x, flame.y, 2, flame.x, flame.y, 50 * grow + 1);
      glow.addColorStop(0, 'rgba(255, 61, 0, 0.6)');
      glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(flame.x - 70, flame.y - 70, 140, 140);
      drawFlametombFlame(flame.x, flame.y + 12, 22 * grow, time * 14 + index, 'outer');
      ctx.globalCompositeOperation = 'source-over';
      drawFlametombFlame(flame.x, flame.y + 14, 15 * grow, time * 16 + index, 'core');
    });
    tomb.booms.forEach((boom) => {
      const max = boom.big ? 44 : 22;
      const k = 1 - boom.life / max;
      const radius = (boom.big ? 70 : 26) + k * (boom.big ? 230 : 60);
      ctx.globalCompositeOperation = 'lighter';
      const blast = ctx.createRadialGradient(boom.x, boom.y, 2, boom.x, boom.y, radius);
      blast.addColorStop(0, `rgba(255, 213, 79, ${1 - k})`);
      blast.addColorStop(0.45, `rgba(255, 61, 0, ${0.85 * (1 - k)})`);
      blast.addColorStop(1, 'rgba(255, 61, 0, 0)');
      ctx.fillStyle = blast;
      ctx.fillRect(boom.x - radius, boom.y - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.85 * (1 - k)})`;
      ctx.lineWidth = boom.big ? 7 : 2;
      ctx.beginPath();
      ctx.arc(boom.x, boom.y, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  });
  knightB8SuperFlametombs = knightB8SuperFlametombs.filter((tomb) => !tomb.burst || tomb.after < 50 || tomb.booms.length);
}

// ---------- Light Warrior's own attacks in these fights ----------
// on top of the farol: Lanza solar, Columnas del farol, Destello cegador
// as OMEGA: Juicio omega, Lluvia de estrellas, Espadas de luz, Omega nova
let knightB8LwAttacks = [];

function knightB8LwHit(damage, pushX, pushY) {
  applyDamage(player2, player1, damage, { isSpecial: true, damageType: 'lwUnique' });
  player1.velocity.x = getDebugKnockback(pushX, player1);
  player1.velocity.y = getDebugKnockback(pushY, player1);
  playSound('judgeFinalHurt');
}

function knightB8FmBox() {
  return { x: player1.position.x, y: player1.position.y, w: player1.width, h: player1.height };
}

function knightB8PointHitsFm(x, y, r) {
  const box = knightB8FmBox();
  return x + r > box.x && x - r < box.x + box.w && y + r > box.y && y - r < box.y + box.h;
}

function startKnightB8LwAttack(kind) {
  const lx = getFighterCenterX(player2);
  const ly = player2.position.y + player2.height / 2;
  const fx = getFighterCenterX(player1);
  const fy = player1.position.y + player1.height / 2;
  const attack = { kind, t: 0 };
  if (kind === 'spear') Object.assign(attack, { x: lx, y: fy, dir: fx >= lx ? 1 : -1, charge: 32, hit: false });
  if (kind === 'columns') attack.columns = [-110, 0, 110].map((offset) => ({ x: Math.max(30, Math.min(canvas.width - 30, fx + offset)), hit: false }));
  if (kind === 'flash') Object.assign(attack, { x: lx, y: ly, charge: 40, hit: false });
  if (kind === 'judgment') {
    const mode = ['sweep', 'converge', 'scatter'][Math.floor(Math.random() * 3)];
    const dir = fx >= lx ? 1 : -1;
    if (mode === 'sweep') {
      attack.columns = Array.from({ length: 7 }, (_, index) => ({ x: lx + dir * (90 + index * 120), delay: index * 16, hit: false }));
    } else if (mode === 'converge') {
      // from both edges, closing in on you
      attack.columns = [];
      for (let index = 0; index < 5; index += 1) {
        attack.columns.push({ x: 50 + index * ((fx - 50) / 4), delay: index * 15, hit: false });
        attack.columns.push({ x: canvas.width - 50 - index * ((canvas.width - 50 - fx) / 4), delay: index * 15, hit: false });
      }
    } else {
      // here and there... and one right on you, last
      attack.columns = Array.from({ length: 6 }, () => ({ x: 60 + Math.random() * (canvas.width - 120), delay: Math.floor(Math.random() * 30), hit: false }));
      attack.columns.push({ x: fx, delay: 40, hit: false });
    }
    attack.columns = attack.columns.filter((column) => column.x > 10 && column.x < canvas.width - 10);
  }
  if (kind === 'stars') attack.stars = [];
  if (kind === 'stars') attack.homing = Math.random() < 0.5;
  if (kind === 'blades') {
    attack.volley = Math.random() < 0.5;
    attack.blades = Array.from({ length: attack.volley ? 8 : 6 }, (_, index, list) => ({ angle: (index / (attack.volley ? 8 : 6)) * Math.PI * 2, fired: false, x: lx, y: ly, vx: 0, vy: 0, done: false }));
  }
  if (kind === 'blink') {
    // PASO RADIANTE: he appears at your side... and strikes
    const side = fx >= lx ? 1 : -1;
    Object.assign(attack, { toX: Math.max(20, Math.min(canvas.width - 20 - player2.width, fx + side * 90 - player2.width / 2)), hit: false });
  }
  if (kind === 'cross') Object.assign(attack, { x: fx, y: fy, hit: false });
  if (kind === 'nova') Object.assign(attack, { x: lx, y: ly, charge: 90, hit: false, radius: 240 });
  knightB8LwAttacks.push(attack);
  playTone({ frequency: 660, duration: 0.4, type: 'triangle', volume: 0.05, slideTo: 990 });
}

function updateKnightB8LwAttacks() {
  const time = performance.now() / 1000;
  const omega = player2.lightWarriorOmegaTransformed;
  // choosing the next one
  if ((knightB8.stage === 'p2' || knightB8.stage === 'p3') && canFighterAct(player2) && !gameOver) {
    knightB8.lwAttackTimer = (knightB8.lwAttackTimer === undefined ? 200 : knightB8.lwAttackTimer) - 1;
    if (knightB8.lwAttackTimer <= 0 && knightB8LwAttacks.length < 2) {
      let kind;
      if (omega) {
        // close: the nova and the cross; far: he comes to you, or reaches you from afar
        const distance = Math.abs(getFighterCenterX(player1) - getFighterCenterX(player2));
        const weights = distance < 200
          ? { nova: 3, cross: 2, blades: 1, stars: 1, judgment: 1, blink: 0 }
          : distance > 450
            ? { blink: 3, judgment: 2, blades: 2, stars: 2, cross: 1, nova: 0 }
            : { nova: 1, cross: 1, blades: 1, stars: 1, judgment: 1, blink: 1 };
        delete weights[knightB8.lastLwAttack];
        const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
        let roll = Math.random() * total;
        kind = Object.keys(weights).find((key) => (roll -= weights[key]) < 0) || 'judgment';
      } else {
        const options = ['spear', 'columns', 'flash'].filter((option) => option !== knightB8.lastLwAttack);
        kind = options[Math.floor(Math.random() * options.length)];
      }
      knightB8.lastLwAttack = kind;
      startKnightB8LwAttack(kind);
      knightB8.lwAttackTimer = omega ? 180 : 260;
    }
    // combos: after appearing at your side, sometimes the nova comes right away
    if (knightB8.lwCombo) {
      knightB8.lwCombo.in -= 1;
      if (knightB8.lwCombo.in <= 0) {
        startKnightB8LwAttack(knightB8.lwCombo.kind);
        knightB8.lwCombo = null;
      }
    }
  }
  knightB8LwAttacks.forEach((attack) => {
    attack.t += 1;
    const t = attack.t;
    ctx.save();
    if (attack.kind === 'spear') {
      // LANZA SOLAR: a long spear of light, thrown straight at him
      if (t <= attack.charge) {
        attack.x = getFighterCenterX(player2);
        const glow = ctx.createRadialGradient(attack.x, attack.y, 2, attack.x, attack.y, 10 + t * 1.5);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(attack.x - 70, attack.y - 70, 140, 140);
        ctx.fillStyle = `rgba(255, 213, 79, ${0.2 + Math.sin(t / 2) * 0.15})`;
        ctx.fillRect(0, attack.y - 6, canvas.width, 12);
      } else {
        attack.x += attack.dir * 15;
        ctx.translate(attack.x, attack.y);
        ctx.scale(attack.dir, 1);
        ctx.shadowColor = '#fff59d';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#fffde7';
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.lineTo(-10, -7);
        ctx.lineTo(-90, 0);
        ctx.lineTo(-10, 7);
        ctx.closePath();
        ctx.fill();
        if (!attack.hit && knightB8PointHitsFm(attack.x, attack.y, 16)) {
          attack.hit = true;
          knightB8LwHit(14, attack.dir * 9, -5);
        }
        if (attack.x < -120 || attack.x > canvas.width + 120) attack.done = true;
      }
    } else if (attack.kind === 'columns' || attack.kind === 'judgment') {
      // COLUMNAS DEL FAROL / JUICIO OMEGA: pillars of light (the omega ones sweep across the whole top)
      const warn = attack.kind === 'judgment' ? 30 : 50;
      let alive = false;
      attack.columns.forEach((column) => {
        const local = t - (column.delay || 0);
        if (local < 0) {
          alive = true;
          return;
        }
        if (local < warn) {
          alive = true;
          ctx.strokeStyle = `rgba(255, 213, 79, ${0.4 + Math.sin(local / 2) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(column.x - 26, 0, 52, ground);
          ctx.setLineDash([]);
        } else if (local < warn + 22) {
          alive = true;
          const k = 1 - (local - warn) / 22;
          const beam = ctx.createLinearGradient(column.x - 34, 0, column.x + 34, 0);
          beam.addColorStop(0, 'rgba(255, 241, 118, 0)');
          beam.addColorStop(0.5, `rgba(255, 255, 255, ${0.95 * k})`);
          beam.addColorStop(1, 'rgba(255, 241, 118, 0)');
          ctx.fillStyle = beam;
          ctx.fillRect(column.x - 34, 0, 68, ground);
          if (local === warn) playNoise({ duration: 0.25, volume: 0.06, filterFrequency: 2600 });
          if (!column.hit && Math.abs(getFighterCenterX(player1) - column.x) < 34) {
            column.hit = true;
            knightB8LwHit(attack.kind === 'judgment' ? 16 : 12, getFighterCenterX(player1) >= column.x ? 5 : -5, -8);
          }
        }
      });
      if (!alive) attack.done = true;
    } else if (attack.kind === 'flash') {
      // DESTELLO CEGADOR: he lights up... and a ring of light bursts out of him
      attack.x = getFighterCenterX(player2);
      if (t <= attack.charge) {
        const glow = ctx.createRadialGradient(attack.x, attack.y, 4, attack.x, attack.y, 30 + t * 2);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(attack.x - 140, attack.y - 140, 280, 280);
      } else {
        const radius = (t - attack.charge) * 16;
        ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, 1 - radius / 300)})`;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(attack.x, attack.y, radius, radius * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        const distance = Math.abs(getFighterCenterX(player1) - attack.x);
        if (!attack.hit && Math.abs(distance - radius) < 24) {
          attack.hit = true;
          knightB8LwHit(10, getFighterCenterX(player1) >= attack.x ? 10 : -10, -6);
          player1.gamblerStunTimer = Math.max(player1.gamblerStunTimer || 0, 30);
          knightB8.blind = 40;
        }
        if (radius > 300) attack.done = true;
      }
    } else if (attack.kind === 'stars') {
      // LLUVIA DE ESTRELLAS: falling stars across the whole top of the farol
      if (t < 100 && t % 4 === 0) attack.stars.push({ x: Math.random() * (canvas.width + 200) - 100, y: -20, vx: 3.5, vy: 9, spin: Math.random() * 6, hit: false });
      attack.stars.forEach((star) => {
        if (attack.homing && star.y < ground - 120) star.vx += Math.sign(getFighterCenterX(player1) - star.x) * 0.25;
        star.vx = Math.max(-7, Math.min(7, star.vx));
        star.x += star.vx;
        star.y += star.vy;
        star.spin += 0.3;
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.spin);
        ctx.fillStyle = '#fffde7';
        ctx.shadowColor = '#fff59d';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let point = 0; point < 8; point += 1) {
          const radius = point % 2 ? 4 : 11;
          ctx.lineTo(Math.cos((point / 8) * Math.PI * 2) * radius, Math.sin((point / 8) * Math.PI * 2) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = 'rgba(255, 241, 118, 0.3)';
        ctx.fillRect(star.x - star.vx * 4, star.y - star.vy * 4, 3, 30);
        if (!star.hit && knightB8PointHitsFm(star.x, star.y, 10)) {
          star.hit = true;
          star.y = 1e9;
          knightB8LwHit(6, 2, -3);
        }
      });
      attack.stars = attack.stars.filter((star) => star.y < ground + 20);
      if (t > 100 && !attack.stars.length) attack.done = true;
    } else if (attack.kind === 'blades') {
      // ESPADAS DE LUZ: six blades turn around him... and fly at you, one after another
      const lx = getFighterCenterX(player2);
      const ly = player2.position.y + player2.height / 2;
      attack.blades.forEach((blade, index) => {
        if (!blade.fired) {
          blade.angle += 0.12;
          blade.x = lx + Math.cos(blade.angle) * 70;
          blade.y = ly + Math.sin(blade.angle) * 50;
          if (t > 60 + (attack.volley ? 0 : index * 12)) {
            blade.fired = true;
            const spread = attack.volley ? (index - (attack.blades.length - 1) / 2) * 0.12 : 0;
            const aim = Math.atan2(player1.position.y + player1.height / 2 - blade.y, getFighterCenterX(player1) - blade.x) + spread;
            blade.vx = Math.cos(aim) * 14;
            blade.vy = Math.sin(aim) * 14;
            playTone({ frequency: 1200, duration: 0.1, type: 'triangle', volume: 0.04 });
          }
        } else if (!blade.done) {
          blade.x += blade.vx;
          blade.y += blade.vy;
          if (knightB8PointHitsFm(blade.x, blade.y, 10)) {
            blade.done = true;
            knightB8LwHit(8, Math.sign(blade.vx) * 5, -3);
          }
          if (blade.x < -60 || blade.x > canvas.width + 60 || blade.y > ground + 30 || blade.y < -60) blade.done = true;
        }
        if (blade.done) return;
        const angle = blade.fired ? Math.atan2(blade.vy, blade.vx) : blade.angle + Math.PI / 2;
        ctx.save();
        ctx.translate(blade.x, blade.y);
        ctx.rotate(angle);
        ctx.shadowColor = '#fff59d';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(26, 0);
        ctx.lineTo(0, -5);
        ctx.lineTo(-18, 0);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      if (attack.blades.every((blade) => blade.done)) attack.done = true;
    } else if (attack.kind === 'blink') {
      // PASO RADIANTE: a spark where he will appear... a flash... a slash of light
      if (t <= 30) {
        ctx.globalCompositeOperation = 'lighter';
        const glow = ctx.createRadialGradient(attack.toX + player2.width / 2, ground - 60, 2, attack.toX + player2.width / 2, ground - 60, 20 + t * 2);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(attack.toX - 80, ground - 160, player2.width + 160, 200);
      }
      if (t === 30) {
        player2.position.x = attack.toX;
        player2.attacksToTheRight = getFighterCenterX(player1) > getFighterCenterX(player2);
        playTone({ frequency: 1800, duration: 0.12, type: 'triangle', volume: 0.05 });
        knightB8.blinkFlash = 8;
      }
      if (t >= 38 && t < 50) {
        const cx = getFighterCenterX(player2);
        const dir = player2.attacksToTheRight ? 1 : -1;
        ctx.strokeStyle = `rgba(255, 253, 231, ${1 - (t - 38) / 12})`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx + dir * 30, player2.position.y + 60, 80, dir > 0 ? -1.1 : Math.PI - 1.1, dir > 0 ? 1.1 : Math.PI + 1.1);
        ctx.stroke();
        if (!attack.hit && Math.abs(getFighterCenterX(player1) - cx) < 130) {
          attack.hit = true;
          knightB8LwHit(14, dir * 10, -6);
        }
      }
      if (t === 40 && Math.random() < 0.35) knightB8.lwCombo = { kind: 'nova', in: 30 };
      if (t > 52) attack.done = true;
    } else if (attack.kind === 'cross') {
      // CRUZ DE LUZ: a column and a beam crossing right where you are
      if (t <= 40) {
        ctx.strokeStyle = `rgba(255, 213, 79, ${0.4 + Math.sin(t / 2) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(attack.x - 28, 0, 56, ground);
        ctx.strokeRect(0, attack.y - 24, canvas.width, 48);
        ctx.setLineDash([]);
      } else if (t <= 62) {
        const k = 1 - (t - 40) / 22;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(255, 253, 231, ${0.9 * k})`;
        ctx.fillRect(attack.x - 28, 0, 56, ground);
        ctx.fillRect(0, attack.y - 24, canvas.width, 48);
        if (t === 41) playNoise({ duration: 0.3, volume: 0.08, filterFrequency: 2600 });
        const fmCx = getFighterCenterX(player1);
        const fmTop = player1.position.y;
        const inColumn = Math.abs(fmCx - attack.x) < 34;
        const inBeam = attack.y + 24 > fmTop && attack.y - 24 < fmTop + player1.height;
        if (!attack.hit && (inColumn || inBeam)) {
          attack.hit = true;
          knightB8LwHit(15, fmCx >= attack.x ? 6 : -6, -7);
        }
      } else {
        attack.done = true;
      }
    } else if (attack.kind === 'nova') {
      // OMEGA NOVA: he gathers all his light... get away from him
      attack.x = getFighterCenterX(player2);
      attack.y = player2.position.y + player2.height / 2;
      if (t <= attack.charge) {
        const k = t / attack.charge;
        ctx.strokeStyle = `rgba(255, 82, 82, ${0.4 + Math.sin(t / 2) * 0.3})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 6]);
        ctx.beginPath();
        ctx.ellipse(attack.x, ground - 10, attack.radius, 26, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        const glow = ctx.createRadialGradient(attack.x, attack.y, 4, attack.x, attack.y, 40 + k * 120);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        glow.addColorStop(1, 'rgba(255, 213, 79, 0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = glow;
        ctx.fillRect(attack.x - 200, attack.y - 200, 400, 400);
        if (t === attack.charge) {
          playNoise({ duration: 1.2, volume: 0.22, filterFrequency: 2000 });
          playTone({ frequency: 60, duration: 1, type: 'sawtooth', volume: 0.1, slideTo: 30 });
          if (!attack.hit && Math.abs(getFighterCenterX(player1) - attack.x) < attack.radius) {
            attack.hit = true;
            knightB8LwHit(40, getFighterCenterX(player1) >= attack.x ? 14 : -14, -12);
          }
        }
      } else {
        const k = (t - attack.charge) / 30;
        ctx.globalCompositeOperation = 'lighter';
        const blast = ctx.createRadialGradient(attack.x, attack.y, 10, attack.x, attack.y, attack.radius * (0.6 + k));
        blast.addColorStop(0, `rgba(255, 255, 255, ${1 - k})`);
        blast.addColorStop(0.5, `rgba(255, 213, 79, ${0.7 * (1 - k)})`);
        blast.addColorStop(1, 'rgba(255, 213, 79, 0)');
        ctx.fillStyle = blast;
        ctx.fillRect(attack.x - 400, attack.y - 400, 800, 800);
        if (k >= 1) attack.done = true;
      }
    }
    ctx.restore();
  });
  knightB8LwAttacks = knightB8LwAttacks.filter((attack) => !attack.done);
  if (knightB8.blinkFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${knightB8.blinkFlash / 12})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    knightB8.blinkFlash -= 1;
  }
  if (knightB8.blind > 0) {
    // blinded for a moment
    ctx.fillStyle = `rgba(255, 255, 255, ${knightB8.blind / 50})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    knightB8.blind -= 1;
  }
}

// on the climb, W / arrow up / space jump (the game does not keep W pressed outside its own modes)
window.addEventListener('keydown', (event) => {
  if (knightB8.cs && knightB8.cs.kind === 'finale') {
    const map = { w: 'w', W: 'w', ArrowUp: 'w', s: 's', S: 's', ArrowDown: 's', a: 'a', A: 'a', ArrowLeft: 'a', d: 'd', D: 'd', ArrowRight: 'd' };
    if (map[event.key]) {
      keys[map[event.key]] = true;
      event.preventDefault();
    }
    return;
  }
  if (!knightB8.cs || knightB8.cs.kind !== 'climb') return;
  if (['w', 'W', 'ArrowUp', ' '].includes(event.key)) {
    keys.w = true;
    event.preventDefault();
  }
  if (['a', 'A'].includes(event.key)) keys.a = true;
  if (['d', 'D'].includes(event.key)) keys.d = true;
});
window.addEventListener('keyup', (event) => {
  if (['s', 'S', 'ArrowDown'].includes(event.key) && knightB8.cs && knightB8.cs.kind === 'finale') keys.s = false;
  if (['ArrowLeft'].includes(event.key)) keys.a = false;
  if (['ArrowRight'].includes(event.key)) keys.d = false;
  if (['w', 'W', 'ArrowUp', ' '].includes(event.key)) keys.w = false;
  if (['a', 'A'].includes(event.key)) keys.a = false;
  if (['d', 'D'].includes(event.key)) keys.d = false;
});

// ================= OMEGA's flying kicks (at 75% and at 50% of his health) =================
// five kicks, more precise and stronger than the ones of chapter 5, each one more dangerous than the last.
// They are parried the same way: hit (S) right when he arrives. He gets back up faster. From the second kick
// on, clones of light dive first: more of them, and stronger, the further into the kicks (and in the second
// round, more still)
function getKnightB8CloneFighter() {
  if (!knightB8.cloneFighter) {
    const clone = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: true });
    clone.setCharacterType('lightWarrior');
    clone.lightWarriorOmegaTransformed = true;
    clone.lightWarriorOmegaStateTimer = 1e9;
    clone.secretVariant = 'omegaTransformed';
    knightB8.cloneFighter = clone;
  }
  return knightB8.cloneFighter;
}

function startKnightB8Kicks(wave) {
  knightB8.kicks = { active: true, wave, kick: 0, stage: 'rise', frame: 0, side: getFighterCenterX(player2) > canvas.width / 2 ? 1 : -1, lock: null, trail: [], dust: [], waves: [], clones: [], hit: false, flash: 0, caption: { text: wave === 1 ? 'OMEGA LIGHT WARRIOR: PATADAS VOLADORAS!' : 'OMEGA LIGHT WARRIOR: PATADAS VOLADORAS... OTRA VEZ, MAS FUERTE!', life: 150 } };
  knightB8LwAttacks = [];
  player2.scriptedFlight = true;
  player2.velocity.x = 0;
  player2.velocity.y = 0;
  playSound('judgeFinalStart');
}

function getKnightB8KickStats(kick, wave) {
  const extra = wave - 1;
  return {
    charge: Math.max(36, 80 - kick * 9 - extra * 8),
    speed: 20 + kick * 1.6 + extra * 2,
    damage: 70 + kick * 12 + extra * 15,
    rest: Math.max(12, 32 - kick * 5 - extra * 4),
    stun: Math.max(28, 70 - kick * 8 - extra * 8),
    clones: kick === 0 ? 0 : kick + extra,
    cloneDamage: 20 + kick * 6 + extra * 8,
  };
}

function knightB8KickParryBox(x, y, w, h) {
  const reach = omegaKickParryReach;
  return { x: x - 20 - reach, y: y - reach, width: w + 40 + reach * 2, height: h + reach * 2 };
}

function updateKnightB8Kicks() {
  const k = knightB8.kicks;
  if (!k || !k.active) return;
  const lw = player2;
  const time = performance.now() / 1000;
  const stats = getKnightB8KickStats(k.kick, k.wave);
  k.frame += 1;
  if (k.caption) k.caption.life -= 1;
  const fmCenter = { x: getFighterCenterX(player1), y: player1.position.y + player1.height / 2 };
  const hover = (side) => ({ x: side > 0 ? canvas.width - 150 : 90, y: 110 });
  const moveTo = (point, ease) => {
    lw.position.x += (point.x - lw.position.x) * ease;
    lw.position.y += (point.y - lw.position.y) * ease;
  };
  lw.velocity.x = 0;
  lw.velocity.y = 0;
  lw.isAttacking = false;
  lw.scriptedFlight = true;
  lw.attacksToTheRight = fmCenter.x > getFighterCenterX(lw);
  const swingFresh = player1.isAttacking && (player1.attackTimer || 0) <= omegaKickParryWindow;
  const burst = (x, y, count, parry) => {
    for (let spark = 0; spark < count; spark += 1) {
      const angle = Math.random() * Math.PI * 2;
      k.dust.push({ x, y, vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7 - 2, life: 30, parry });
    }
  };

  if (k.stage === 'rise') {
    moveTo(hover(k.side), 0.12);
    if (k.frame > 28) {
      k.stage = 'charge';
      k.frame = 0;
      k.lock = null;
      // the clones of light: across the sky, each one with its own target
      k.clones = Array.from({ length: stats.clones }, (_, index) => {
        const spread = (index + 1) / (stats.clones + 1);
        return { x: 60 + spread * (canvas.width - 180), y: 70 + (index % 2) * 50, lock: null, state: 'hover', diveAt: stats.charge - (stats.clones - index) * 12, speed: stats.speed * 0.95, done: false };
      });
      k.caption = { text: k.kick === 0 && k.wave === 1 ? 'GOLPEA (S) JUSTO CUANDO LLEGUE PARA HACERLE PARRY' : `PATADA  ${k.kick + 1} / 5${stats.clones ? `   -   ${stats.clones} CLON${stats.clones > 1 ? 'ES' : ''} DE LUZ!` : ''}`, life: 110 };
    }
  } else if (k.stage === 'charge') {
    const point = hover(k.side);
    moveTo({ x: point.x, y: point.y + Math.sin(k.frame / 6) * 4 }, 0.15);
    if (k.frame % 10 === 0) playSound('omegaKickCharge', { pitch: k.frame / stats.charge });
    // precise: it follows you until the very last moment
    if (k.frame < stats.charge - 12 || !k.lock) k.lock = { x: fmCenter.x, y: ground - lw.height / 2 };
    if (k.frame >= stats.charge) {
      playSound('omegaKickLaunch');
      k.hit = false;
      k.stage = 'dive';
      k.frame = 0;
    }
  } else if (k.stage === 'dive') {
    const center = { x: getFighterCenterX(lw), y: lw.position.y + lw.height / 2 };
    // (and it still bends a little toward you on the way down)
    if (Math.hypot(k.lock.x - center.x, k.lock.y - center.y) > 140) k.lock.x += (fmCenter.x - k.lock.x) * 0.12;
    const dx = k.lock.x - center.x;
    const dy = k.lock.y - center.y;
    const distance = Math.hypot(dx, dy) || 1;
    const step = Math.min(distance, stats.speed);
    lw.position.x += (dx / distance) * step;
    lw.position.y += (dy / distance) * step;
    k.trail.push({ x: lw.position.x, y: lw.position.y, life: 14 });
    const kickBox = { x: lw.position.x - 20, y: lw.position.y, width: lw.width + 40, height: lw.height };
    if (!k.hit && swingFresh && rectangularCollision({ rectangle1: knightB8KickParryBox(lw.position.x, lw.position.y, lw.width, lw.height), rectangle2: player1 })) {
      // PARRY
      k.hit = true;
      k.parries = (k.parries || 0) + 1;
      k.bounce = { from: { x: lw.position.x, y: lw.position.y }, dir: dx >= 0 ? -1 : 1 };
      k.flash = 12;
      burst(fmCenter.x, player1.position.y + 40, 30, true);
      applyDamage(player1, lw, omegaKickParryDamage, { isSpecial: true });
      k.caption = { text: 'PARRY! ...PERO SE LEVANTA RAPIDO', life: 100 };
      playSound('judgeParry');
      playSound('omegaKickImpact');
      k.stage = 'stunned';
      k.frame = 0;
      return;
    }
    if (!k.hit && rectangularCollision({ rectangle1: kickBox, rectangle2: player1 })) {
      k.hit = true;
      applyDamage(lw, player1, stats.damage, { isSpecial: true, damageType: 'omegaLightWarriorFlight' });
      player1.velocity.x = dx >= 0 ? 13 : -13;
      player1.velocity.y = -10;
    }
    if (distance <= stats.speed) {
      lw.position.y = ground - lw.height;
      playSound('omegaKickImpact');
      k.waves.push({ x: getFighterCenterX(lw), life: 40 });
      burst(getFighterCenterX(lw), ground, 26, false);
      k.stage = 'impact';
      k.frame = 0;
    }
  } else if (k.stage === 'stunned') {
    const bounce = k.bounce;
    if (k.frame <= 20) {
      const t = k.frame / 20;
      lw.position.x = Math.max(0, Math.min(canvas.width - lw.width, bounce.from.x + bounce.dir * 150 * t));
      lw.position.y = bounce.from.y - Math.sin(t * Math.PI) * 80 + (ground - lw.height - bounce.from.y) * t;
    } else {
      lw.position.y = ground - lw.height;
    }
    if (k.frame > stats.stun) knightB8NextKick();
  } else if (k.stage === 'impact') {
    lw.position.y = ground - lw.height;
    if (k.frame > stats.rest) knightB8NextKick();
  }
  if (!knightB8.kicks) return;

  // the clones: they dive first
  k.clones.forEach((clone) => {
    if (clone.done) return;
    const w = lw.width;
    const h = lw.height;
    if (clone.state === 'hover') {
      clone.y += Math.sin((k.frame + clone.x) / 6) * 0.6;
      clone.lock = { x: fmCenter.x, y: ground - h / 2 };
      if (k.stage === 'charge' && k.frame >= clone.diveAt) {
        clone.state = 'dive';
        playTone({ frequency: 1400, duration: 0.15, type: 'triangle', volume: 0.04, slideTo: 700 });
      }
      return;
    }
    const center = { x: clone.x + w / 2, y: clone.y + h / 2 };
    if (Math.hypot(clone.lock.x - center.x, clone.lock.y - center.y) > 140) clone.lock.x += (fmCenter.x - clone.lock.x) * 0.1;
    const dx = clone.lock.x - center.x;
    const dy = clone.lock.y - center.y;
    const distance = Math.hypot(dx, dy) || 1;
    const step = Math.min(distance, clone.speed);
    clone.x += (dx / distance) * step;
    clone.y += (dy / distance) * step;
    if (swingFresh && rectangularCollision({ rectangle1: knightB8KickParryBox(clone.x, clone.y, w, h), rectangle2: player1 })) {
      clone.done = true;
      burst(clone.x + w / 2, clone.y + h / 2, 20, true);
      playSound('judgeParry');
      return;
    }
    if (rectangularCollision({ rectangle1: { x: clone.x - 10, y: clone.y, width: w + 20, height: h }, rectangle2: player1 })) {
      clone.done = true;
      applyDamage(lw, player1, stats.cloneDamage, { isSpecial: true, damageType: 'omegaLightClone' });
      player1.velocity.x = dx >= 0 ? 8 : -8;
      player1.velocity.y = -6;
      burst(clone.x + w / 2, clone.y + h / 2, 18, false);
      return;
    }
    if (distance <= clone.speed) {
      clone.done = true;
      k.waves.push({ x: clone.x + w / 2, life: 26 });
      burst(clone.x + w / 2, ground, 14, false);
    }
  });

  // ---------- drawing ----------
  ctx.save();
  k.trail.forEach((ghost) => {
    ghost.life -= 1;
    ctx.fillStyle = `rgba(255, 249, 196, ${ghost.life / 22})`;
    ctx.fillRect(ghost.x + 8, ghost.y + 10, lw.width - 16, lw.height - 20);
  });
  k.trail = k.trail.filter((ghost) => ghost.life > 0);
  const lwCenter = { x: getFighterCenterX(lw), y: lw.position.y + lw.height / 2 };
  if (k.stage === 'charge') {
    const power = Math.min(1, k.frame / stats.charge);
    const aura = ctx.createRadialGradient(lwCenter.x, lwCenter.y + 30, 4, lwCenter.x, lwCenter.y + 30, 40 + power * 120);
    aura.addColorStop(0, `rgba(255, 255, 255, ${0.5 + power * 0.4})`);
    aura.addColorStop(0.5, `rgba(255, 213, 79, ${0.3 + power * 0.3})`);
    aura.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(lwCenter.x - 170, lwCenter.y - 140, 340, 340);
    if (k.lock) {
      const locked = k.frame >= stats.charge - 12;
      ctx.strokeStyle = locked ? `rgba(255, 255, 255, ${0.6 + Math.sin(time * 30) * 0.4})` : 'rgba(255, 82, 82, 0.6)';
      ctx.lineWidth = locked ? 3 : 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(lwCenter.x, lwCenter.y);
      ctx.lineTo(k.lock.x, k.lock.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(k.lock.x, ground, 50, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // the clones of light
  const clone = getKnightB8CloneFighter();
  k.clones.forEach((ghost) => {
    if (ghost.done) return;
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(time * 12 + ghost.x) * 0.1;
    clone.position = { x: ghost.x, y: ghost.y };
    clone.attacksToTheRight = fmCenter.x > ghost.x;
    clone.isAttacking = false;
    clone.draw();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(ghost.x + lw.width / 2, ghost.y + lw.height / 2, 4, ghost.x + lw.width / 2, ghost.y + lw.height / 2, 80);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(ghost.x - 60, ghost.y - 40, lw.width + 120, lw.height + 80);
    ctx.restore();
    if (ghost.state === 'hover') {
      ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(ghost.x + lw.width / 2, ghost.y + lw.height / 2);
      ctx.lineTo(ghost.lock.x, ghost.lock.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  if (k.stage === 'stunned' && k.frame > 20) {
    for (let star = 0; star < 3; star += 1) {
      const angle = time * 5 + star * ((Math.PI * 2) / 3);
      ctx.fillStyle = '#fff59d';
      ctx.font = '900 16px Courier New, monospace';
      ctx.fillText('*', lwCenter.x + Math.cos(angle) * 28 - 4, lw.position.y - 10 + Math.sin(angle) * 8);
    }
  }
  k.waves.forEach((wave) => {
    wave.life -= 1;
    const grow = 1 - wave.life / 40;
    ctx.strokeStyle = `rgba(255, 249, 196, ${wave.life / 40})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(wave.x, ground, 30 + grow * 260, 8 + grow * 30, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  k.waves = k.waves.filter((wave) => wave.life > 0);
  k.dust.forEach((mote) => {
    mote.x += mote.vx;
    mote.y += mote.vy;
    mote.vy += 0.2;
    mote.life -= 1;
    ctx.fillStyle = mote.parry ? `rgba(255, 112, 40, ${Math.min(1, mote.life / 20)})` : `rgba(255, 241, 118, ${Math.min(1, mote.life / 20)})`;
    ctx.fillRect(mote.x, mote.y, 4, 4);
  });
  k.dust = k.dust.filter((mote) => mote.life > 0);
  if (k.flash > 0) {
    k.flash -= 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${k.flash / 16})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
  drawKnightB7Text(canvas.width / 2, 160, `PATADAS: ${k.kick} / 5`, '#fff59d', 1, false, 14);
  if (k.caption && k.caption.life > 0) drawKnightB7Text(canvas.width / 2, 192, k.caption.text, '#fff59d', Math.min(1, k.caption.life / 20), false, 20);
}

function knightB8NextKick() {
  const k = knightB8.kicks;
  k.kick += 1;
  k.clones = [];
  k.side *= -1;
  if (k.kick >= 5) {
    // the five are done: back to the fight
    knightB8.kicks = null;
    player2.scriptedFlight = false;
    player2.velocity.x = 0;
    player2.velocity.y = 0;
    knightB8.lwAttackTimer = 120;
    return;
  }
  k.stage = 'rise';
  k.frame = 0;
}

// ================= OMEGA's sky: it follows DAWN OF HOPES AND DREAMS =================
// 0:53.5-1:29 a sky of pure light (him); 1:30-1:41.5 Celeste and Seto; 1:42-1:53.2 Mochi and the chef;
// 1:54-2:06.7 the sheriff; after that, until the end of the song, a dimmed, hopeless sky (and from then on
// the "normal" sky stays like that too). His aura takes the same colors
const knightB8OmegaMoods = ['normal', 'omega', 'friends1', 'friends2', 'friends3', 'dim'];
const knightB8OmegaPalettes = {
  normal: { core: [255, 235, 59], accent: [255, 213, 79] },
  omega: { core: [255, 255, 255], accent: [255, 241, 118] },
  friends1: { core: [79, 195, 247], accent: [149, 117, 205] },
  friends2: { core: [244, 143, 177], accent: [255, 248, 225] },
  friends3: { core: [229, 57, 53], accent: [255, 179, 0] },
  dim: { core: [170, 165, 140], accent: [120, 115, 100] },
};

function getKnightB8SongNow() {
  const tracks = reflecterBattleMusic && reflecterBattleMusic.tracks;
  const track = tracks && tracks.dawnHope;
  if (!track || reflecterBattleMusic.current !== 'dawnHope' || track.paused) return -1;
  return track.currentTime;
}

function getKnightB8OmegaMoodTarget() {
  if (typeof knightB8.omegaMoodOverride === 'string') return knightB8.omegaMoodOverride;
  if (knightB8.stage !== 'p3') return 'normal';
  const now = getKnightB8SongNow();
  if (now < 0) return null;
  if (now >= 53.5 && now < 89) return 'omega';
  if (now >= 90 && now < 101.5) return 'friends1';
  if (now >= 102 && now < 113.2) return 'friends2';
  if (now >= 114 && now < 126.7) return 'friends3';
  if (now >= 126.7) {
    knightB8.sequencesDone = true;
    return 'dim';
  }
  if (now < 53.5) return knightB8.sequencesDone ? 'dim' : 'normal';
  // (the short gaps between them keep the last one)
  return null;
}

function updateKnightB8OmegaMood() {
  const target = getKnightB8OmegaMoodTarget();
  if (target) knightB8.omegaMoodTarget = target;
  const goal = knightB8.omegaMoodTarget || 'normal';
  knightB8.omegaMoods = knightB8.omegaMoods || { normal: 1 };
  knightB8OmegaMoods.forEach((mood) => {
    const value = knightB8.omegaMoods[mood] || 0;
    knightB8.omegaMoods[mood] = value + ((mood === goal ? 1 : 0) - value) * 0.03;
  });
}

function getKnightB8AuraPalette() {
  const moods = knightB8.omegaMoods || { normal: 1 };
  const mix = (part) => [0, 1, 2].map((index) => {
    let total = 0;
    let weight = 0;
    knightB8OmegaMoods.forEach((mood) => {
      const w = moods[mood] || 0;
      total += knightB8OmegaPalettes[mood][part][index] * w;
      weight += w;
    });
    return Math.round(total / Math.max(0.0001, weight));
  });
  return { core: mix('core'), accent: mix('accent'), power: 1 + (moods.omega || 0) * 0.5 - (moods.dim || 0) * 0.45 };
}

// the top of the Gran Farol, with the sky of the moment over it
function drawKnightB8FarolSky() {
  drawFarolTopStage(0);
  if (!isKnightB8()) return;
  updateKnightB8OmegaMood();
  const moods = knightB8.omegaMoods;
  const time = performance.now() / 1000;
  const width = canvas.width;
  const skyBottom = ground - 60;
  const layer = (mood, stops, extra) => {
    const w = moods[mood] || 0;
    if (w < 0.01) return;
    ctx.save();
    ctx.globalAlpha = w * 0.72;
    const sky = ctx.createLinearGradient(0, 0, 0, skyBottom);
    stops.forEach(([at, color]) => sky.addColorStop(at, color));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, skyBottom);
    ctx.globalAlpha = w;
    extra(w);
    ctx.restore();
  };
  // his: a sky of pure light, rays turning around the farol
  layer('omega', [[0, '#fff8d6'], [0.5, '#ffe082'], [1, '#ffb300']], (w) => {
    ctx.globalCompositeOperation = 'lighter';
    for (let ray = 0; ray < 14; ray += 1) {
      const angle = time * 0.25 + (ray / 14) * Math.PI * 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * w})`;
      ctx.beginPath();
      ctx.moveTo(width / 2, 120);
      ctx.lineTo(width / 2 + Math.cos(angle - 0.06) * 900, 120 + Math.sin(angle - 0.06) * 900);
      ctx.lineTo(width / 2 + Math.cos(angle + 0.06) * 900, 120 + Math.sin(angle + 0.06) * 900);
      ctx.closePath();
      ctx.fill();
    }
    for (let mote = 0; mote < 30; mote += 1) {
      const rise = (time * 50 + mote * 31) % skyBottom;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * w})`;
      ctx.fillRect((mote * 97) % width, skyBottom - rise, 3, 3);
    }
  });
  // Celeste and Seto: her light blue, his purple... and pages in the wind
  layer('friends1', [[0, '#1a237e'], [0.5, '#4fc3f7'], [1, '#9575cd']], (w) => {
    for (let page = 0; page < 14; page += 1) {
      const px = ((page * 131 + time * 30) % (width + 60)) - 30;
      const py = (page * 53 + Math.sin(time + page) * 30 + time * 12) % skyBottom;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(Math.sin(time * 2 + page) * 0.6);
      ctx.fillStyle = page % 3 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(229, 57, 53, 0.8)';
      ctx.fillRect(-6, -4, 12, 8);
      ctx.restore();
    }
  });
  // Mochi and the chef: pink and cream, little cakes floating
  layer('friends2', [[0, '#f48fb1'], [0.55, '#ffe0e9'], [1, '#fff8e1']], (w) => {
    for (let cake = 0; cake < 12; cake += 1) {
      const px = ((cake * 151 + time * 18) % (width + 60)) - 30;
      const py = 60 + ((cake * 71 + Math.sin(time * 1.5 + cake) * 14) % (skyBottom - 120));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(px, py, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f06292';
      ctx.beginPath();
      ctx.arc(px, py - 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // the sheriff: a red and gold sunset, and his stars
  layer('friends3', [[0, '#4e1a0a'], [0.55, '#e65100'], [1, '#ffb300']], (w) => {
    for (let star = 0; star < 10; star += 1) {
      const px = (star * 113 + 40) % width;
      const py = 40 + ((star * 67) % (skyBottom - 100)) + Math.sin(time * 2 + star) * 6;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(time * 0.8 + star);
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 ? 4 : 10;
        ctx.lineTo(Math.cos((point / 10) * Math.PI * 2) * radius, Math.sin((point / 10) * Math.PI * 2) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });
  // the end of the song: grey, dim, hopeless. A storm closing in, cold rain, far lightning, the farol failing
  const dim = moods.dim || 0;
  if (dim > 0.01) {
    ctx.save();
    ctx.globalAlpha = dim;
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = 'rgb(128, 128, 128)';
    ctx.fillRect(0, 0, width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(14, 16, 22, 0.5)';
    ctx.fillRect(0, 0, width, canvas.height);
    // far lightning, now and then, behind the clouds
    knightB8.stormFlash = Math.max(0, (knightB8.stormFlash || 0) - 1);
    if (!knightB8.stormFlash && Math.random() < 0.006) {
      knightB8.stormFlash = 14;
      knightB8.stormBolt = 80 + Math.random() * (width - 160);
      playNoise({ duration: 1.4, volume: 0.03, filterFrequency: 180, delay: 0.4 });
    }
    if (knightB8.stormFlash > 0) {
      ctx.fillStyle = `rgba(200, 210, 230, ${0.18 * (knightB8.stormFlash / 14)})`;
      ctx.fillRect(0, 0, width, skyBottom);
      if (knightB8.stormFlash > 8) drawKnightB8Bolt(knightB8.stormBolt, 0, knightB8.stormBolt + (Math.random() - 0.5) * 60, 150, 'rgba(220, 230, 255, 0.6)', 2);
    }
    // heavy clouds rolling over
    for (let band = 0; band < 3; band += 1) {
      ctx.fillStyle = `rgba(${30 + band * 10}, ${32 + band * 10}, ${40 + band * 10}, ${0.75 - band * 0.12})`;
      for (let cloud = -1; cloud < 7; cloud += 1) {
        const cx = ((cloud * 200 + band * 70 + time * (6 + band * 3)) % (width + 300)) - 150;
        ctx.beginPath();
        ctx.ellipse(cx, 20 + band * 45, 170, 40 - band * 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // the farol's light, failing
    const fail = 0.35 + Math.max(0, Math.sin(time * 13) * Math.sin(time * 5.3)) * 0.25;
    ctx.fillStyle = `rgba(10, 10, 14, ${fail})`;
    ctx.beginPath();
    ctx.ellipse(width / 2, 180, 130, 170, 0, 0, Math.PI * 2);
    ctx.fill();
    // cold rain, slanted
    ctx.strokeStyle = 'rgba(170, 180, 200, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let drop = 0; drop < 70; drop += 1) {
      const dx = ((drop * 71 + time * 160) % (width + 80)) - 40;
      const dy = (drop * 97 + time * 520) % canvas.height;
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx - 6, dy + 16);
    }
    ctx.stroke();
    // a low grey mist over the stones
    const mist = ctx.createLinearGradient(0, ground - 80, 0, canvas.height);
    mist.addColorStop(0, 'rgba(120, 125, 140, 0)');
    mist.addColorStop(1, 'rgba(120, 125, 140, 0.35)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, ground - 80, width, canvas.height - ground + 80);
    ctx.restore();
  }
}

// ================= THE END: at 500 he finishes it =================
// one blow sends Fire Master up into the sky, where he has to dodge his light for a long while (a "semi box
// attack", free in the whole screen); he falls, tries to heal himself with his fire... Omega clashes with
// him: even, for a while... then the fire loses, and the OMEGA beam
const knightB8FinaleWords = ['...Se termino, Fire Master.'];

function startKnightB8Finale() {
  startKnightB8Cs('finale', {
    step: 'launch', stepT: 0, fmX: player1.position.x, fmY: ground - player1.height, lwX: player2.position.x, lwY: ground - player2.height,
    sky: null, balance: 0, sparks: [], rings: [], white: 0, flash: 0,
  });
}

function knightB8FinaleStep(cs, step) {
  cs.step = step;
  cs.stepT = 0;
}

function tickKnightB8Finale(cs) {
  cs.stepT += 1;
  const s = cs.stepT;
  const time = performance.now() / 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (cs.step === 'launch') {
    // he is in front of you... and one blow sends you up
    cs.lwX += (cs.fmX + 70 - cs.lwX) * 0.2;
    if (s === 24) {
      cs.flash = 1;
      playNoise({ duration: 0.9, volume: 0.26, filterFrequency: 1600 });
      playTone({ frequency: 60, duration: 0.8, type: 'square', volume: 0.12, slideTo: 30 });
    }
    if (s > 24) cs.fmY -= (s - 24) * 1.4;
    drawKnightB8FarolSky();
    drawKnightB8Actor(player2, cs.lwX, cs.lwY, -1, 0, s > 18 && s < 30);
    drawKnightB8Actor(player1, cs.fmX, cs.fmY, 1);
    if (s > 70) {
      cs.white = Math.min(1, (s - 70) / 20);
      if (s > 92) {
        knightB8FinaleStep(cs, 'sky');
        cs.sky = { x: canvas.width / 2, y: 420, invuln: 0, shots: [], beams: [], rings: [], spears: [] };
        cs.white = 1;
      }
    }
  } else if (cs.step === 'sky') {
    tickKnightB8FinaleSky(cs, s, time);
  } else if (cs.step === 'fall') {
    // back down onto the farol
    cs.fmY = Math.min(ground - player1.height, -200 + s * s * 0.25);
    if (cs.fmY >= ground - player1.height && !cs.landed) {
      cs.landed = true;
      cs.shake = 20;
      playNoise({ duration: 0.7, volume: 0.16, filterFrequency: 500 });
    }
    drawKnightB8FarolSky();
    drawKnightB8Actor(player2, cs.lwX, ground - player2.height, -1);
    drawKnightB8Actor(player1, cs.fmX, cs.fmY, 1, cs.landed ? -0.5 : 0);
    if (s > 90) knightB8FinaleStep(cs, 'regen');
  } else if (cs.step === 'regen') {
    // he tries to heal himself with his fire
    const k = Math.min(1, s / 150);
    if (s % 6 === 0 && s < 150) {
      player1.health = Math.min(player1.maxHealth, player1.health + player1.maxHealth * 0.02);
      updateHealthBars();
    }
    if (s === 10) cs.say = { who: 'fm', text: '...Todavia... no.', life: 120 };
    if (s === 130) cs.say = { who: 'lw', text: 'No.', life: 90 };
    drawKnightB8FarolSky();
    const cx = cs.fmX + player1.width / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 12; flame += 1) {
      const angle = time * 5 + (flame / 12) * Math.PI * 2;
      drawFlametombFlame(cx + Math.cos(angle) * (80 - k * 30), ground - 60 + Math.sin(angle) * 40, 12 + k * 8, time * 12 + flame, 'outer');
    }
    ctx.restore();
    if (s > 130) cs.lwX += (cs.fmX + 420 - cs.lwX) * 0.1;
    drawKnightB8Actor(player2, cs.lwX, ground - player2.height, -1);
    drawKnightB8Actor(player1, cs.fmX, ground - player1.height, 1, -0.5 * (1 - k));
    if (s > 190) {
      // both go up into the air
      knightB8FinaleStep(cs, 'airclash');
      cs.flash = 0.7;
      playNoise({ duration: 0.6, volume: 0.12, filterFrequency: 900 });
    }
  } else if (cs.step === 'airclash') {
    // in the air, blow against blow: they rush at each other again and again. Even... until the last one
    tickKnightB8AirClash(cs, s, time);
  } else if (cs.step === 'megabeam') {
    tickKnightB8MegaBeam(cs, s, time);
  } else if (cs.step === 'end') {
    // back on the farol: only him, looking at the smoke on the horizon
    drawKnightB8FarolSky();
    const smoke = ctx.createRadialGradient(80, ground - 120, 4, 80, ground - 120, 140);
    smoke.addColorStop(0, 'rgba(255, 112, 40, 0.35)');
    smoke.addColorStop(1, 'rgba(255, 112, 40, 0)');
    ctx.fillStyle = smoke;
    ctx.fillRect(0, ground - 260, 260, 260);
    for (let puff = 0; puff < 6; puff += 1) {
      const rise = (time * 20 + puff * 30) % 200;
      ctx.fillStyle = `rgba(40, 34, 40, ${0.5 * (1 - rise / 200)})`;
      ctx.beginPath();
      ctx.ellipse(80 + rise * 0.2, ground - 120 - rise, 20 + rise * 0.2, 10 + rise * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    cs.lwY = Math.min(ground - player2.height, (typeof cs.lwY === 'number' ? cs.lwY : -160) + 8);
    drawKnightB8Actor(player2, 700, cs.lwY, -1);
    if (s > 60 && s < 260) drawKnightB7Text(730, ground - player2.height - 24, knightB8FinaleWords[0], '#fff59d', Math.min(1, (s - 60) / 20, (260 - s) / 20), false);
    if (s > 240) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (s - 240) / 50)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (s > 310) {
      finishKnightB8Finale(cs);
      return;
    }
  }
  if (cs.say && cs.say.life > 0) {
    cs.say.life -= 1;
    const fm = cs.say.who === 'fm';
    drawKnightB7Text(fm ? cs.fmX + player1.width / 2 : cs.lwX + player2.width / 2, ground - 150, cs.say.text, fm ? '#ff8a65' : '#fff59d', Math.min(1, cs.say.life / 15), fm);
  }
  if (cs.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cs.flash = Math.max(0, cs.flash - 0.05);
  }
  if (cs.white > 0 && cs.step === 'launch') {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.white})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// up in the sky: dodge his light (W A S D, in any direction) for a long while, in six waves
const knightB8SkyWaves = [
  { name: 'LLUVIA DE LUZ', color: '#fff59d' },
  { name: 'COLUMNAS DEL CIELO', color: '#ffe082' },
  { name: 'ANILLOS DEL ALBA', color: '#fffde7' },
  { name: 'LANZAS Y ESPIRAL', color: '#fff176' },
  { name: 'PLUMAS DE LUZ', color: '#ffffff' },
  { name: 'EL JUICIO DEL CIELO', color: '#ffd54f' },
];
const knightB8SkyWaveFrames = 330;

function drawKnightB8SkyBackdrop(time, shake = 0) {
  const width = canvas.width;
  updateKnightB8OmegaMood();
  const pal = getKnightB8AuraPalette();
  const back = ctx.createLinearGradient(0, 0, 0, canvas.height);
  back.addColorStop(0, `rgb(${pal.core.map((value) => Math.round(value * 0.32)).join(',')})`);
  back.addColorStop(0.6, '#1a1238');
  back.addColorStop(1, '#0a0618');
  ctx.fillStyle = back;
  ctx.fillRect(-20, -20, width + 40, canvas.height + 40);
  for (let star = 0; star < 70; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.4 * Math.abs(Math.sin(time + star))})`;
    ctx.fillRect((star * 131) % width, (star * 59 + time * 6) % canvas.height, 2, 2);
  }
  // clouds rushing past (he is still going up), three layers
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.fillStyle = `rgba(${200 - layer * 40}, ${190 - layer * 40}, ${230 - layer * 30}, ${0.08 + layer * 0.06})`;
    for (let cloud = 0; cloud < 6; cloud += 1) {
      const cx = ((cloud * 190 + layer * 70) % (width + 260)) - 130;
      const cy = (((cloud * 140 + layer * 90) + time * (80 + layer * 90)) % (canvas.height + 160)) - 80;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 150 - layer * 25, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // the light of Omega pouring from above
  const shine = ctx.createRadialGradient(width / 2, -40, 20, width / 2, -40, 520);
  shine.addColorStop(0, `rgba(${pal.core.join(',')}, 0.35)`);
  shine.addColorStop(1, `rgba(${pal.core.join(',')}, 0)`);
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, width, canvas.height);
}

function tickKnightB8FinaleSky(cs, s, time) {
  const sky = cs.sky;
  const width = canvas.width;
  const length = knightB8SkyWaves.length * knightB8SkyWaveFrames;
  sky.trail = sky.trail || [];
  sky.feathers = sky.feathers || [];
  sky.hitFx = sky.hitFx || 0;
  if (sky.invuln > 0) sky.invuln -= 1;
  const moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  const moveY = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
  const norm = Math.hypot(moveX, moveY) || 1;
  sky.x = Math.max(30, Math.min(width - 30, sky.x + (moveX / norm) * 5.6));
  sky.y = Math.max(170, Math.min(canvas.height - 40, sky.y + (moveY / norm) * 5.6));
  const lw = { x: width / 2 + Math.sin(s / 70) * 280, y: 84 + Math.sin(s / 23) * 8 };
  const wave = Math.min(knightB8SkyWaves.length - 1, Math.floor(s / knightB8SkyWaveFrames));
  const local = s - wave * knightB8SkyWaveFrames;
  if (local === 1) {
    sky.banner = { text: knightB8SkyWaves[wave].name, color: knightB8SkyWaves[wave].color, life: 110 };
    playTone({ frequency: 520 + wave * 80, duration: 0.5, type: 'triangle', volume: 0.05, slideTo: 900 + wave * 80 });
  }
  const hurt = () => {
    if (sky.invuln > 0) return;
    sky.invuln = 40;
    sky.hitFx = 14;
    player1.health = Math.max(1, player1.health - player1.maxHealth * 0.03);
    updateHealthBars();
    playSound('judgeFinalHurt');
  };
  const near = (x, y, r) => Math.hypot(x - sky.x, y - sky.y) < r + 13;
  const aimFan = (count, spread, speed) => {
    const aim = Math.atan2(sky.y - lw.y, sky.x - lw.x);
    for (let index = 0; index < count; index += 1) {
      const angle = aim + (index - (count - 1) / 2) * spread;
      sky.shots.push({ x: lw.x, y: lw.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 8 });
    }
    playSound('judgeLight');
  };
  // what he throws, wave by wave
  if (s < length - 50 && local > 40) {
    if (wave === 0) {
      if (s % 7 === 0) sky.shots.push({ x: Math.random() * width, y: -10, vx: (Math.random() - 0.5) * 1.2, vy: 5 + Math.random() * 2.5, r: 8 });
      if (local % 55 === 0) aimFan(5, 0.16, 5.6);
    } else if (wave === 1) {
      if (local % 34 === 0) sky.beams.push({ orient: Math.random() < 0.5 ? 'v' : 'h', pos: Math.random() < 0.65 ? (Math.random() < 0.5 ? sky.x : sky.y) : 100 + Math.random() * (width - 200), warn: 34, active: 18 });
      if (local % 90 === 45) sky.beams.push({ orient: 'v', pos: sky.x, warn: 30, active: 16 }, { orient: 'h', pos: sky.y, warn: 30, active: 16 });
    } else if (wave === 2) {
      if (local % 60 === 0) sky.rings.push({ x: lw.x, y: lw.y, r: 10, gap: Math.atan2(sky.y - lw.y, sky.x - lw.x) + (Math.random() - 0.5) * 2.2, life: 280, speed: 3.4 });
      if (local % 60 === 30) aimFan(3, 0.25, 5);
    } else if (wave === 3) {
      if (local % 26 === 0) [-1, 1].forEach((side) => sky.spears.push({ x: sky.x + side * (50 + Math.random() * 90), y: -40, warn: 28 }));
      if (local % 5 === 0) {
        const angle = local * 0.21;
        [angle, angle + Math.PI].forEach((dir) => sky.shots.push({ x: lw.x, y: lw.y, vx: Math.cos(dir) * 3.6, vy: Math.abs(Math.sin(dir)) * 3.6 + 0.6, r: 6 }));
      }
    } else if (wave === 4) {
      // feathers that follow you (they turn slowly, and fade)
      if (local % 22 === 0) sky.feathers.push({ x: lw.x + (Math.random() - 0.5) * 80, y: lw.y + 20, vx: (Math.random() - 0.5) * 4, vy: 2, life: 200 });
      if (s % 9 === 0) sky.shots.push({ x: Math.random() * width, y: -10, vx: 0, vy: 4.5, r: 6 });
    } else {
      if (s % 8 === 0) sky.shots.push({ x: Math.random() * width, y: -10, vx: 0, vy: 5.5, r: 7 });
      if (local % 50 === 0) sky.beams.push({ orient: Math.random() < 0.5 ? 'v' : 'h', pos: Math.random() < 0.5 ? sky.x : sky.y, warn: 30, active: 16 });
      if (local % 80 === 40) sky.rings.push({ x: lw.x, y: lw.y, r: 10, gap: Math.atan2(sky.y - lw.y, sky.x - lw.x) + (Math.random() - 0.5) * 2, life: 280, speed: 3.8 });
      if (local % 30 === 15) sky.feathers.push({ x: lw.x, y: lw.y + 20, vx: (Math.random() - 0.5) * 5, vy: 2, life: 160 });
    }
  }
  sky.shots.forEach((shot) => {
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (near(shot.x, shot.y, shot.r)) {
      hurt();
      shot.y = 1e9;
    }
  });
  sky.shots = sky.shots.filter((shot) => shot.y < canvas.height + 30 && shot.y > -60 && shot.x > -60 && shot.x < width + 60);
  sky.feathers.forEach((feather) => {
    feather.life -= 1;
    const aim = Math.atan2(sky.y - feather.y, sky.x - feather.x);
    feather.vx += Math.cos(aim) * 0.16;
    feather.vy += Math.sin(aim) * 0.16;
    const speed = Math.hypot(feather.vx, feather.vy);
    if (speed > 4.2) {
      feather.vx *= 4.2 / speed;
      feather.vy *= 4.2 / speed;
    }
    feather.x += feather.vx;
    feather.y += feather.vy;
    if (near(feather.x, feather.y, 7)) {
      hurt();
      feather.life = 0;
    }
  });
  sky.feathers = sky.feathers.filter((feather) => feather.life > 0);
  sky.beams.forEach((beam) => {
    if (beam.warn > 0) {
      beam.warn -= 1;
      if (beam.warn === 0) playNoise({ duration: 0.2, volume: 0.05, filterFrequency: 2600 });
      return;
    }
    beam.active -= 1;
    const inside = beam.orient === 'v' ? Math.abs(sky.x - beam.pos) < 30 : Math.abs(sky.y - beam.pos) < 30;
    if (inside) hurt();
  });
  sky.beams = sky.beams.filter((beam) => beam.warn > 0 || beam.active > 0);
  sky.rings.forEach((ring) => {
    ring.r += ring.speed || 3.2;
    ring.life -= 1;
    const distance = Math.hypot(sky.x - ring.x, sky.y - ring.y);
    const angle = Math.atan2(sky.y - ring.y, sky.x - ring.x);
    const diff = Math.abs(((angle - ring.gap + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (Math.abs(distance - ring.r) < 10 && diff > 0.45) hurt();
  });
  sky.rings = sky.rings.filter((ring) => ring.life > 0 && ring.r < 1300);
  sky.spears.forEach((spear) => {
    if (spear.warn > 0) {
      spear.warn -= 1;
      return;
    }
    spear.y += 17;
    if (Math.abs(spear.x - sky.x) < 12 && Math.abs(spear.y - sky.y) < 40) {
      hurt();
      spear.y = 1e9;
    }
  });
  sky.spears = sky.spears.filter((spear) => spear.warn > 0 || spear.y < canvas.height + 60);
  // ---------- drawing ----------
  ctx.save();
  if (sky.hitFx > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
  drawKnightB8SkyBackdrop(time);
  player2.position = { x: lw.x - player2.width / 2, y: lw.y - player2.height / 2 };
  player2.attacksToTheRight = sky.x > lw.x;
  player2.isAttacking = local % 55 < 8;
  player2.draw();
  sky.beams.forEach((beam) => {
    ctx.save();
    if (beam.warn > 0) {
      ctx.fillStyle = `rgba(255, 82, 82, ${0.08 + Math.sin(s / 2) * 0.05})`;
      ctx.strokeStyle = `rgba(255, 82, 82, ${0.5 + Math.sin(s / 2) * 0.3})`;
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 2;
      if (beam.orient === 'v') {
        ctx.fillRect(beam.pos - 30, 0, 60, canvas.height);
        ctx.strokeRect(beam.pos - 30, 0, 60, canvas.height);
      } else {
        ctx.fillRect(0, beam.pos - 30, width, 60);
        ctx.strokeRect(0, beam.pos - 30, width, 60);
      }
    } else {
      const k = beam.active / 18;
      ctx.globalCompositeOperation = 'lighter';
      const grad = beam.orient === 'v' ? ctx.createLinearGradient(beam.pos - 40, 0, beam.pos + 40, 0) : ctx.createLinearGradient(0, beam.pos - 40, 0, beam.pos + 40);
      grad.addColorStop(0, 'rgba(255, 241, 118, 0)');
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${k})`);
      grad.addColorStop(1, 'rgba(255, 241, 118, 0)');
      ctx.fillStyle = grad;
      if (beam.orient === 'v') ctx.fillRect(beam.pos - 40, 0, 80, canvas.height);
      else ctx.fillRect(0, beam.pos - 40, width, 80);
    }
    ctx.restore();
  });
  sky.rings.forEach((ring) => {
    ctx.save();
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(255, 249, 196, 0.9)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.r, ring.gap + 0.45, ring.gap + Math.PI * 2 - 0.45);
    ctx.stroke();
    ctx.restore();
  });
  sky.spears.forEach((spear) => {
    if (spear.warn > 0) {
      ctx.strokeStyle = 'rgba(255, 213, 79, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(spear.x, 0);
      ctx.lineTo(spear.x, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    ctx.save();
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.moveTo(spear.x, spear.y + 40);
    ctx.lineTo(spear.x + 6, spear.y - 10);
    ctx.lineTo(spear.x, spear.y - 44);
    ctx.lineTo(spear.x - 6, spear.y - 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  sky.feathers.forEach((feather) => {
    ctx.save();
    ctx.translate(feather.x, feather.y);
    ctx.rotate(Math.atan2(feather.vy, feather.vx));
    ctx.globalAlpha = Math.min(1, feather.life / 30);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.8)';
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();
    ctx.restore();
  });
  sky.shots.forEach((shot) => {
    const glow = ctx.createRadialGradient(shot.x, shot.y, 1, shot.x, shot.y, shot.r + 7);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.45, 'rgba(255, 241, 118, 0.95)');
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.r + 7, 0, Math.PI * 2);
    ctx.fill();
  });
  // Fire Master, tumbling, a trail of black fire behind him
  sky.trail.push({ x: sky.x, y: sky.y, life: 16 });
  sky.trail.forEach((point) => {
    point.life -= 1;
    ctx.fillStyle = point.life % 4 < 2 ? `rgba(255, 87, 34, ${point.life / 20})` : `rgba(20, 5, 8, ${point.life / 20})`;
    ctx.fillRect(point.x - 4 + Math.sin(point.life) * 4, point.y + 20 - (16 - point.life), 6, 6);
  });
  sky.trail = sky.trail.filter((point) => point.life > 0);
  if (!(sky.invuln > 0 && Math.floor(sky.invuln / 4) % 2 === 0)) {
    ctx.save();
    ctx.translate(sky.x, sky.y);
    ctx.rotate(Math.sin(time * 3) * 0.3 + moveX * 0.25);
    ctx.scale(0.7, 0.7);
    player1.position = { x: -player1.width / 2, y: -player1.height / 2 };
    player1.attacksToTheRight = true;
    player1.isAttacking = false;
    player1.draw();
    ctx.restore();
  }
  ctx.fillStyle = '#ff7043';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sky.x, sky.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  if (sky.hitFx > 0) {
    sky.hitFx -= 1;
    const vignette = ctx.createRadialGradient(width / 2, canvas.height / 2, 200, width / 2, canvas.height / 2, width * 0.7);
    vignette.addColorStop(0, 'rgba(183, 28, 28, 0)');
    vignette.addColorStop(1, `rgba(183, 28, 28, ${sky.hitFx / 28})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, canvas.height);
  }
  if (s < 160) drawKnightB7Text(width / 2, 230, 'ESQUIVA SU LUZ  (W A S D)', '#fff59d', Math.min(1, (160 - s) / 20), false, 20);
  if (sky.banner && sky.banner.life > 0) {
    sky.banner.life -= 1;
    const pop = 1 + Math.max(0, (sky.banner.life - 90) / 20) * 0.4;
    ctx.save();
    ctx.translate(width / 2, 196);
    ctx.scale(pop, pop);
    drawKnightB7Text(0, 0, sky.banner.text, sky.banner.color, Math.min(1, sky.banner.life / 20), false, 30);
    ctx.restore();
  }
  // waves and time left
  for (let index = 0; index < knightB8SkyWaves.length; index += 1) {
    const done = index < wave ? 1 : index === wave ? local / knightB8SkyWaveFrames : 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(width / 2 - 180 + index * 61, 132, 56, 8);
    ctx.fillStyle = '#fff59d';
    ctx.fillRect(width / 2 - 180 + index * 61, 132, 56 * done, 8);
  }
  if (cs.white > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cs.white})`;
    ctx.fillRect(0, 0, width, canvas.height);
    cs.white = Math.max(0, cs.white - 0.03);
  }
  if (s > length) {
    knightB8FinaleStep(cs, 'fall');
    cs.fmX = 220;
    cs.lwX = 760;
  }
}

function finishKnightB8Finale(cs) {
  cs.over = true;
  cancelAnimationFrame(cs.raf);
  knightB8.cs = null;
  document.body.classList.remove('knightb-ending');
  knightB8.outroDone = true;
  knightB8.finaleDone = true;
  player2.scriptedFlight = false;
  player1.health = Math.max(1, player1.health);
  player2.health = 0;
  updateHealthBars();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  finishFight();
}

// ---------- the clash in the air: blow against blow ----------
// six exchanges. In each one they gather power apart (hammer Q / F / R), rush at each other and their fists
// meet in the middle: a flash, a shockwave... even. The sixth, Omega puts everything into it
function tickKnightB8AirClash(cs, s, time) {
  const width = canvas.width;
  const clash = cs.air || (cs.air = { round: 0, phase: 'apart', t: 0, power: 0, rings: [], sparks: [], lines: [], shake: 0, flash: 0, results: [] });
  clash.t += 1;
  const total = 6;
  const last = clash.round === total - 1;
  const centerY = 300;
  const leftHome = 170;
  const rightHome = width - 170;
  let fmX = leftHome;
  let lwX = rightHome;
  if (clash.phase === 'apart') {
    if (cs.pressed.q || cs.pressed.f || cs.pressed.r) {
      clash.power = Math.min(1, clash.power + 0.09);
      playTone({ frequency: 120 + clash.power * 200, duration: 0.06, type: 'sawtooth', volume: 0.03 });
    }
    const gather = Math.max(26, 64 - clash.round * 7);
    if (clash.t >= gather) {
      clash.phase = 'rush';
      clash.t = 0;
      playSound('omegaKickLaunch');
    }
  } else if (clash.phase === 'rush') {
    const k = Math.min(1, clash.t / 12);
    fmX = leftHome + (width / 2 - 34 - leftHome) * k * k;
    lwX = rightHome + (width / 2 + 34 - rightHome) * k * k;
    if (k >= 1) {
      clash.phase = 'impact';
      clash.t = 0;
      clash.flash = last ? 1 : 0.7;
      clash.shake = last ? 30 : 16;
      clash.rings.push({ r: 20, life: 34 }, { r: 6, life: 40, delay: 6 });
      for (let spark = 0; spark < (last ? 120 : 60); spark += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 12;
        clash.sparks.push({ x: width / 2, y: centerY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 30 + Math.random() * 20, fire: Math.random() < 0.5 });
      }
      playNoise({ duration: last ? 1.4 : 0.6, volume: last ? 0.26 : 0.18, filterFrequency: 1600 });
      playTone({ frequency: 55, duration: 0.7, type: 'square', volume: 0.1, slideTo: 30 });
      clash.results.push(last ? 'lw' : 'even');
    }
  } else if (clash.phase === 'impact') {
    fmX = width / 2 - 34;
    lwX = width / 2 + 34;
    if (clash.t > (last ? 30 : 16)) {
      clash.phase = last ? 'thrown' : 'recoil';
      clash.t = 0;
    }
  } else if (clash.phase === 'recoil') {
    const k = Math.min(1, clash.t / 18);
    fmX = width / 2 - 34 + (leftHome - width / 2 + 34) * k;
    lwX = width / 2 + 34 + (rightHome - width / 2 - 34) * k;
    if (k >= 1) {
      clash.round += 1;
      clash.phase = 'apart';
      clash.t = 0;
      clash.power = 0;
    }
  } else if (clash.phase === 'thrown') {
    // the last one: Fire Master is thrown far, far away
    lwX = width / 2 + 34;
    if (clash.t > 70) {
      knightB8FinaleStep(cs, 'megabeam');
      cs.beam = { t: 0 };
      return;
    }
  }
  // ---------- drawing ----------
  ctx.save();
  if (clash.shake > 0) {
    clash.shake -= 1;
    ctx.translate((Math.random() - 0.5) * clash.shake, (Math.random() - 0.5) * clash.shake * 0.6);
  }
  drawKnightB8SkyBackdrop(time);
  // speed lines toward the middle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  for (let line = 0; line < 30; line += 1) {
    const angle = line * 2.39 + Math.floor(time * 10) * 0.6;
    const from = 640 + (line % 4) * 40;
    const to = 230 + ((time * 400 + line * 31) % 140);
    ctx.beginPath();
    ctx.moveTo(width / 2 + Math.cos(angle) * from, centerY + Math.sin(angle) * from * 0.6);
    ctx.lineTo(width / 2 + Math.cos(angle) * to, centerY + Math.sin(angle) * to * 0.6);
    ctx.stroke();
  }
  // their auras: the more he gathers, the bigger his
  const fmAura = ctx.createRadialGradient(fmX, centerY, 10, fmX, centerY, 90 + clash.power * 70);
  fmAura.addColorStop(0, `rgba(160, 0, 20, ${0.5 + clash.power * 0.3})`);
  fmAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fmAura;
  ctx.fillRect(fmX - 170, centerY - 170, 340, 340);
  const lwPower = 0.6 + clash.round * 0.08 + (last ? 0.6 : 0);
  const lwAura = ctx.createRadialGradient(lwX, centerY, 10, lwX, centerY, 90 + lwPower * 70);
  lwAura.addColorStop(0, `rgba(255, 241, 118, ${0.45 + lwPower * 0.2})`);
  lwAura.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = lwAura;
  ctx.fillRect(lwX - 200, centerY - 200, 400, 400);
  const punching = clash.phase === 'rush' || clash.phase === 'impact';
  if (clash.phase !== 'thrown' || clash.t < 4) {
    const bob = clash.phase === 'apart' ? Math.sin(time * 5) * 6 : 0;
    drawKnightB8Actor(player1, fmX - player1.width / 2, centerY - player1.height / 2 + bob, 1, 0, punching);
  } else {
    // flying away: smaller and smaller, toward the horizon on the left
    const k = Math.min(1, clash.t / 60);
    const fx = width / 2 - 34 - k * 480;
    const fy = centerY - k * 120;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(-k * 8);
    ctx.scale(1 - k * 0.85, 1 - k * 0.85);
    player1.position = { x: -player1.width / 2, y: -player1.height / 2 };
    player1.isAttacking = false;
    player1.draw();
    ctx.restore();
    ctx.fillStyle = 'rgba(255, 87, 34, 0.5)';
    for (let trail = 0; trail < 8; trail += 1) ctx.fillRect(fx + trail * 18 * (1 - k * 0.6), fy + trail * 4, 6, 6);
  }
  drawKnightB8Actor(player2, lwX - player2.width / 2, centerY - player2.height / 2 + (clash.phase === 'apart' ? Math.sin(time * 5 + 1) * 6 : 0), -1, 0, punching || clash.phase === 'thrown');
  // the meeting point
  if (clash.phase === 'impact') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const size = (last ? 160 : 100) * (1 - clash.t / 40);
    const blast = ctx.createRadialGradient(width / 2, centerY, 4, width / 2, centerY, size);
    blast.addColorStop(0, 'rgba(255, 255, 255, 1)');
    blast.addColorStop(0.4, last ? 'rgba(255, 241, 118, 0.85)' : 'rgba(255, 152, 0, 0.8)');
    blast.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = blast;
    ctx.fillRect(width / 2 - size, centerY - size, size * 2, size * 2);
    for (let bolt = 0; bolt < 5; bolt += 1) {
      const angle = Math.random() * Math.PI * 2;
      drawKnightB8Bolt(width / 2, centerY, width / 2 + Math.cos(angle) * 140, centerY + Math.sin(angle) * 100, bolt % 2 ? 'rgba(255, 245, 157, 0.85)' : 'rgba(255, 82, 40, 0.85)', 3);
    }
    ctx.restore();
  }
  clash.rings.forEach((ring) => {
    if (ring.delay > 0) {
      ring.delay -= 1;
      return;
    }
    ring.life -= 1;
    ring.r += last ? 30 : 18;
    ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, ring.life / 34)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(width / 2, centerY, ring.r, ring.r * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  clash.rings = clash.rings.filter((ring) => ring.life > 0);
  clash.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.96;
    spark.vy *= 0.96;
    spark.life -= 1;
    ctx.fillStyle = spark.fire ? (spark.life % 4 < 2 ? '#ff5722' : '#1a0505') : (spark.life % 4 < 2 ? '#ffffff' : '#fff59d');
    ctx.fillRect(spark.x, spark.y, 3, 3);
  });
  clash.sparks = clash.sparks.filter((spark) => spark.life > 0);
  ctx.restore();
  // the score of the exchanges, and the prompt
  for (let index = 0; index < total; index += 1) {
    const result = clash.results[index];
    ctx.fillStyle = result === 'lw' ? '#fff59d' : result === 'even' ? '#ff7043' : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2 - 75 + index * 30, 132, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  if (clash.phase === 'apart') {
    drawKnightB7Text(width / 2, 176, 'MACHACA  Q / F / R !', '#ff7043', 0.75 + Math.sin(time * 12) * 0.25, false, 24);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(fmX - 40, centerY + 80, 80, 8);
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(fmX - 40, centerY + 80, 80 * clash.power, 8);
  }
  if (clash.phase === 'impact' && !last) drawKnightB7Text(width / 2, 210, 'PAREJOS!', '#ffffff', 1, false, 30);
  if (clash.phase === 'thrown' && clash.t > 10) drawKnightB7Text(width / 2, 210, 'OMEGA LO MANDA A VOLAR!', '#fff59d', Math.min(1, (clash.t - 10) / 15), false, 30);
  if (clash.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${clash.flash})`;
    ctx.fillRect(0, 0, width, canvas.height);
    clash.flash = Math.max(0, clash.flash - 0.06);
  }
}

// ---------- the giant beam: Fire Master far away, Omega gathering everything he has ----------
function tickKnightB8MegaBeam(cs, s, time) {
  const width = canvas.width;
  const target = { x: 150, y: 210 };
  const lwX = width - 220;
  const lwY = 360;
  const charge = 150;
  if (s === 1) playTone({ frequency: 90, duration: 2.6, type: 'sawtooth', volume: 0.08, slideTo: 600 });
  if (s === charge) {
    playKnightB8FlashBurst();
    playNoise({ duration: 2, volume: 0.3, filterFrequency: 1200 });
    playTone({ frequency: 36, duration: 2.4, type: 'sawtooth', volume: 0.14, slideTo: 22 });
  }
  if (s === charge + 80) {
    playNoise({ duration: 2.2, volume: 0.3, filterFrequency: 600 });
    player1.health = Math.max(1, Math.round(player1.maxHealth * 0.05));
    updateHealthBars();
  }
  ctx.save();
  if (s > charge - 40 && s < charge + 160) ctx.translate((Math.random() - 0.5) * (s > charge ? 14 : 5), (Math.random() - 0.5) * (s > charge ? 10 : 3));
  drawKnightB8SkyBackdrop(time);
  // the world goes dark around the light he gathers
  ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.55, s / 120)})`;
  ctx.fillRect(-20, -20, width + 40, canvas.height + 40);
  // Fire Master, a tiny figure far away, burning
  if (s < charge + 90) {
    const glow = ctx.createRadialGradient(target.x, target.y, 2, target.x, target.y, 30);
    glow.addColorStop(0, 'rgba(255, 87, 34, 0.9)');
    glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(target.x - 30, target.y - 30, 60, 60);
    ctx.save();
    ctx.translate(target.x, target.y);
    ctx.scale(0.22, 0.22);
    player1.position = { x: -player1.width / 2, y: -player1.height / 2 };
    player1.isAttacking = false;
    player1.draw();
    ctx.restore();
  }
  drawKnightB8Actor(player2, lwX - player2.width / 2, lwY - player2.height / 2, -1, 0, s > charge - 20 && s < charge + 120);
  const handX = lwX - 50;
  const handY = lwY - 10;
  if (s < charge) {
    // the light gathering: a sphere growing, rings closing on it, motes rushing in
    const k = s / charge;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const orb = ctx.createRadialGradient(handX, handY, 2, handX, handY, 20 + k * 110);
    orb.addColorStop(0, 'rgba(255, 255, 255, 1)');
    orb.addColorStop(0.4, `rgba(255, 241, 118, ${0.6 + k * 0.3})`);
    orb.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = orb;
    ctx.fillRect(handX - 160, handY - 160, 320, 320);
    for (let ring = 0; ring < 3; ring += 1) {
      const r = 220 - ((s * 3 + ring * 70) % 210);
      ctx.strokeStyle = `rgba(255, 253, 231, ${0.5 * (1 - r / 220)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(handX, handY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let mote = 0; mote < 40; mote += 1) {
      const angle = mote * 2.4 + time;
      const radius = 340 * (1 - ((s * 0.02 + mote / 40) % 1));
      ctx.fillStyle = 'rgba(255, 249, 196, 0.9)';
      ctx.fillRect(handX + Math.cos(angle) * radius, handY + Math.sin(angle) * radius, 3, 3);
    }
    ctx.restore();
    drawKnightB7Text(width / 2, 120, 'O M E G A', '#fff59d', Math.min(1, s / 30), false, 50);
  } else if (s < charge + 140) {
    // the beam, from his hands to the horizon
    const local = s - charge;
    const open = Math.min(1, local / 8) * (1 - Math.max(0, (local - 110) / 30));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const angle = Math.atan2(target.y - handY, target.x - handX);
    const length = Math.hypot(target.x - handX, target.y - handY);
    ctx.translate(handX, handY);
    ctx.rotate(angle);
    [[140, 'rgba(255, 213, 79, 0.25)'], [90, 'rgba(255, 241, 118, 0.5)'], [50, 'rgba(255, 253, 231, 0.85)'], [22, 'rgba(255, 255, 255, 1)']].forEach(([thick, color]) => {
      const t = thick * open;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -t);
      ctx.lineTo(length + 40, -t * 0.45);
      ctx.lineTo(length + 40, t * 0.45);
      ctx.lineTo(0, t);
      ctx.closePath();
      ctx.fill();
    });
    // spirals of light around it
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * open})`;
    ctx.lineWidth = 3;
    for (let spiral = 0; spiral < 2; spiral += 1) {
      ctx.beginPath();
      for (let along = 0; along <= length; along += 12) {
        const wobble = Math.sin(along * 0.05 - time * 20 + spiral * Math.PI) * 90 * open * (1 - along / (length * 1.6));
        ctx.lineTo(along, wobble);
      }
      ctx.stroke();
    }
    ctx.restore();
    // where it lands: a dome of light on the horizon
    if (local > 20) {
      const k = Math.min(1, (local - 20) / 90);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const dome = ctx.createRadialGradient(target.x, target.y, 10, target.x, target.y, 60 + k * 380);
      dome.addColorStop(0, `rgba(255, 255, 255, ${1 - k * 0.3})`);
      dome.addColorStop(0.4, `rgba(255, 241, 118, ${0.8 - k * 0.3})`);
      dome.addColorStop(1, 'rgba(255, 213, 79, 0)');
      ctx.fillStyle = dome;
      ctx.fillRect(target.x - 460, target.y - 460, 920, 920);
      ctx.restore();
    }
    drawKnightB7Text(width / 2, 120, 'LIGHT WARRIOR OMEGA: RAYO FINAL', '#fff59d', Math.min(1, local / 10, (140 - local) / 20), false, 30);
  }
  ctx.restore();
  // the flash when it lands, and the white fading out
  if (s >= charge + 75 && s < charge + 170) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (s - charge - 75) / 10) * (1 - Math.max(0, (s - charge - 120) / 50))})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
  if (s > charge + 170) {
    knightB8FinaleStep(cs, 'end');
    cs.lwY = -160;
  }
}

// ================= the secret level of chapter 5B (the 9th): "?" =================
// it appears after beating level 8... and only for someone who has played, outside the arcade, with
// Fire Master B or with Obsidian
const knightBSecretFireKey = 'moqueteKnightBSecretFire';
const knightBSecretLevel = 9;

function hasPlayedKnightBSecretFire() {
  try {
    return localStorage.getItem(knightBSecretFireKey) === '1';
  } catch (error) {
    return false;
  }
}

function isKnightBSecretUnlocked() {
  return typeof isArcadeChapterDone === 'function' && isArcadeChapterDone('knightB') && hasPlayedKnightBSecretFire();
}

function syncKnightBSecretButton() {
  const button = document.querySelector(`[data-arcade-level="${knightBSecretLevel}"]`);
  if (!button || arcadeChapter !== 'knightB') return;
  const open = isKnightBSecretUnlocked();
  button.classList.toggle('hidden', !open);
  button.classList.add('arcade-level-secret');
  const title = button.querySelector('.arcade-level-copy strong');
  const description = button.querySelector('.arcade-level-copy span');
  if (title) title.innerText = '?';
  if (description) description.innerText = 'Falta uno.';
  const beaten = typeof isKnightB9Beaten === 'function' && isKnightB9Beaten();
  button.disabled = !open;
  button.classList.toggle('locked', !open);
  button.classList.remove('coming-soon');
  button.classList.toggle('completed', open && beaten);
  const status = button.querySelector('.arcade-level-status');
  if (status) status.textContent = !open ? 'BLOQUEADO' : beaten ? 'SUPERADO' : 'SECRETO';
}

(function hookChapterFiveBSecret() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  // a fight outside the arcade with Fire Master B or Obsidian: remembered
  wrap('startGame', (base) => function startGameRememberingFire(...args) {
    const result = base.apply(this, args);
    try {
      const fire = [player1, player2].some((fighter) => fighter && (fighter.secretVariant === 'frostFire' || fighter.secretVariant === 'obsidian'));
      if (!normalArcadeActive && fire) localStorage.setItem(knightBSecretFireKey, '1');
    } catch (error) {
      // (without storage it is not remembered)
    }
    return result;
  });
  wrap('syncNormalArcadeLevels', (base) => function syncNormalArcadeLevelsWithSecret(...args) {
    const result = base.apply(this, args);
    syncKnightBSecretButton();
    return result;
  });
  wrap('syncKnightBChapterUI', (base) => function syncKnightBChapterUIWithSecret(...args) {
    const result = base.apply(this, args);
    syncKnightBSecretButton();
    return result;
  });
})();

// ================= SECRET LEVEL "?" =================
// weeks later: Robledal being rebuilt by Light Warrior and the explorers; others come to look at what
// happened; Knight resting by a lake at sunset... and Fire Master, there. He found "a way to fix it all".
// And then he tells him what is going on with him, and with this world
const knightB9 = { scene: null };
const knightB9BeatenKey = 'moqueteKnightBSecretBeaten';

function isKnightB9() {
  return isKnightBChapter() && selectedNormalArcadeLevel === knightBSecretLevel;
}

function isKnightB9Beaten() {
  try {
    return localStorage.getItem(knightB9BeatenKey) === '1';
  } catch (error) {
    return false;
  }
}

function makeKnightB9Actor(type, variant, x, facing) {
  const actor = new Fighter({ x: 0, y: 0, color: '#9e9e9e', attacksToTheRight: facing > 0 });
  if (variant) actor.setCharacterType(type, variant);
  else actor.setCharacterType(type);
  actor.position = { x, y: ground - actor.height };
  actor.attacksToTheRight = facing > 0;
  return actor;
}

function startKnightB9Scene() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  stopReflecterBattleMusic();
  const scene = {
    t: 0,
    part: 'rebuild',
    partT: 0,
    lw: makeKnightB9Actor('lightWarrior', null, 520, -1),
    workers: [
      { pose: 'stand', x: 180, lit: true, cloth: '#8d6e63', hair: '#3e2723', skin: '#e0ac69', prop: 'plank' },
      { pose: 'stand', x: 320, lit: true, cloth: '#43a047', hair: '#fdd835', skin: '#ffdbac', prop: 'axe' },
      { pose: 'stand', x: 700, lit: true, cloth: '#3949ab', hair: '#212121', skin: '#c68642', prop: 'crate' },
      { pose: 'stand', x: 850, lit: true, cloth: '#ad1457', hair: '#6d4c41', skin: '#f1c27d', prop: 'stone' },
    ],
    visitors: [makeKnightB9Actor('reflecter', null, 300, 1), makeKnightB9Actor('gambler', null, 420, 1), makeKnightB9Actor('ghost', null, 860, -1)],
    knight: makeKnightB9Actor('normal', 'knight', 330, 1),
    fire: makeKnightB9Actor('fireMaster', null, 700, -1),
    line: null,
    typed: 0,
    lineT: 0,
  };
  makeBizarreFireMaster(scene.fire);
  scene.fire.position = { x: 700, y: ground - scene.fire.height };
  scene.fire.attacksToTheRight = false;
  scene.knight.knightShieldGone = true;
  knightB9.scene = scene;
  scene.skip = (event) => {
    if (event.key === 'Escape') finishKnightB9Scene();
  };
  window.addEventListener('keydown', scene.skip);
  document.body.classList.add('knightb-ending');
  requestAnimationFrame(tickKnightB9Scene);
}

// the parts, with their lines (frames from the start of each part)
const knightB9Script = {
  rebuild: [
    [20, 'narrator', 'Semanas despues.'],
    [170, 'narrator', 'Robledal enterro a los suyos. Lo poco que quedo de ellos.'],
    [360, 'lw', 'El sheriff. Decia que la ley es la ley... y se paro frente a el igual. Solo.'],
    [560, 'lw', 'Celeste y Seto. Nunca me dejaron leer tranquilo. Ojala pudieran volver a molestarme.'],
    [780, 'lw', 'El chef. Y Mochi. Me guardaban sopa aunque llegara tarde.'],
    [940, 'lw', '...Esta vez llegue tarde de verdad.'],
    [1080, 'lw', 'Y el guardia. Y todos los demas. Cada nombre de estas piedras.'],
    [1240, 'lw', '...Perdon. No estuve.'],
  ],
  hill: [
    [30, 'narrator', 'Otros vinieron despues. A mirar. A preguntar.'],
    [210, 'reflecter', '...Aca fue. Todo el pueblo estaba adentro.'],
    [380, 'gambler', 'Ni la peor apuesta de mi vida lo hubiera visto venir.'],
    [550, 'ghost', 'Hay algo raro en este lugar. Como si... no terminara de existir.'],
    [720, 'reflecter', '...Las paredes estan quemadas desde adentro.'],
    [880, 'narrator', 'Nadie encontro respuestas.'],
  ],
  lake: [
    [60, 'knight', '(...El agua no se mueve. Ni el viento.)'],
    [260, 'knight', '(Tampoco duermo. Cada vez que cierro los ojos, la puerta del bunker...)'],
    [520, 'knight', '!'],
    [600, 'knight', '...VOS.'],
    [760, 'fire', 'Espera.'],
    [880, 'fire', 'Encontre una forma, Knight. De arreglarlo. Todo.'],
    [1060, 'fire', 'De mejorarlo. Je. JE. je je je je.', true],
    [1240, 'knight', '...¿De que estas hablando?'],
    [1400, 'fire', 'Dejame contarte que es lo que pasa conmigo. Con este mundo.'],
  ],
  after: [
    [60, 'fire', 'Al final del lago. Ahi termina todo. Y empieza lo de verdad.'],
    [300, 'fire', '¿Venis?'],
    [460, 'knight', '(...¿Quien nos esta mirando?)'],
  ],
  drag: [],
};
const knightB9PartLength = { rebuild: 1440, hill: 1060, lake: 1600, truth: 0, after: 600 };
const knightB9Names = { narrator: '', lw: 'LIGHT WARRIOR', reflecter: 'REFLECTER', gambler: 'GAMBLER', ghost: 'GHOST', knight: 'KNIGHT', fire: 'FIRE MASTER' };

function drawKnightB9Box(line, typed) {
  const glitch = line.glitch;
  ctx.save();
  const boxY = 24;
  ctx.fillStyle = 'rgba(6, 6, 10, 0.85)';
  ctx.fillRect(40, boxY, canvas.width - 80, 96);
  ctx.strokeStyle = glitch ? '#ff1744' : line.who === 'narrator' ? '#757575' : '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, boxY, canvas.width - 80, 96);
  const name = knightB9Names[line.who];
  if (name) {
    ctx.fillStyle = line.who === 'fire' ? '#ff8a65' : line.who === 'knight' ? '#90caf9' : '#fdd835';
    ctx.font = "900 14px 'Courier New', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(name, 60, boxY + 24);
  }
  ctx.font = line.who === 'narrator' ? "italic 19px Georgia, serif" : "700 18px 'Courier New', monospace";
  ctx.fillStyle = line.who === 'narrator' ? '#bdbdbd' : '#fafafa';
  let text = line.text.slice(0, typed);
  if (glitch) {
    ctx.fillStyle = Math.random() < 0.5 ? '#ff5252' : '#fafafa';
    text = text.split('').map((char) => (Math.random() < 0.08 ? '#$%&?'[Math.floor(Math.random() * 5)] : char)).join('');
  }
  ctx.textAlign = 'left';
  wrapNoteText(text, canvas.width - 140).forEach((row, index) => ctx.fillText(row, 60 + (glitch ? (Math.random() - 0.5) * 3 : 0), boxY + (name ? 50 : 42) + index * 24));
  ctx.restore();
}

// ---------- the places ----------
function drawKnightB9Plaza(time) {
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#8ec5ea');
  sky.addColorStop(1, '#fde3c4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = 'rgba(255, 245, 210, 0.8)';
  ctx.beginPath();
  ctx.arc(840, 110, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9db88a';
  ctx.beginPath();
  ctx.moveTo(0, ground - 140);
  [[180, ground - 200], [380, ground - 150], [600, ground - 210], [820, ground - 160], [1024, ground - 190]].forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.fill();
  // the houses: one finished, two in frames, one still burnt
  const house = (x, stage) => {
    if (stage === 'burnt') {
      ctx.fillStyle = '#3e3533';
      ctx.fillRect(x, ground - 90, 120, 90);
      ctx.fillStyle = '#1d1716';
      ctx.fillRect(x + 20, ground - 120, 14, 30);
      ctx.fillRect(x + 80, ground - 104, 10, 14);
      return;
    }
    if (stage === 'done') {
      ctx.fillStyle = '#d7b98e';
      ctx.fillRect(x, ground - 120, 140, 120);
      ctx.fillStyle = '#a1462e';
      ctx.beginPath();
      ctx.moveTo(x - 12, ground - 120);
      ctx.lineTo(x + 70, ground - 180);
      ctx.lineTo(x + 152, ground - 120);
      ctx.fill();
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(x + 56, ground - 60, 28, 60);
      ctx.fillStyle = '#90caf9';
      ctx.fillRect(x + 16, ground - 96, 24, 20);
      return;
    }
    // a frame of beams, a scaffold
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 5;
    ctx.strokeRect(x, ground - 130, 140, 130);
    ctx.beginPath();
    ctx.moveTo(x, ground - 130);
    ctx.lineTo(x + 70, ground - 190);
    ctx.lineTo(x + 140, ground - 130);
    ctx.moveTo(x + 70, ground - 130);
    ctx.lineTo(x + 70, ground);
    ctx.moveTo(x, ground - 65);
    ctx.lineTo(x + 140, ground - 65);
    ctx.stroke();
    ctx.fillStyle = '#d7b98e';
    ctx.fillRect(x + 4, ground - 60, 62, 60);
    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 20, ground - 150, 10, 150);
    ctx.strokeRect(x - 20, ground - 90, 60, 6);
  };
  house(40, 'done');
  house(250, 'frame');
  house(600, 'frame');
  house(820, 'burnt');
  // planks and stones
  ctx.fillStyle = '#a1887f';
  for (let plank = 0; plank < 4; plank += 1) ctx.fillRect(460, ground - 8 - plank * 6, 90, 5);
  ctx.fillStyle = '#9e9e9e';
  [[780, 8], [795, 12], [808, 7]].forEach(([sx, up]) => {
    ctx.beginPath();
    ctx.ellipse(sx, ground - up, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // new bunting across the square
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.quadraticCurveTo(width / 2, 150, width, 90);
  ctx.stroke();
  for (let flag = 0; flag < 16; flag += 1) {
    const fx = flag * 66 + 20;
    const fy = 90 + Math.sin((fx / width) * Math.PI) * 58;
    ctx.fillStyle = ['#ef5350', '#fdd835', '#42a5f5', '#66bb6a'][flag % 4];
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 14, fy);
    ctx.lineTo(fx + 7, fy + 16 + Math.sin(time * 3 + flag) * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#c2a27c';
  ctx.fillRect(0, ground, width, canvas.height - ground);
}

function drawKnightB9Lake(time, edge = 0, sunset = 0) {
  const width = canvas.width;
  const horizon = 300;
  const sunY = horizon + sunset * 26;
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#3a2756');
  sky.addColorStop(0.55, '#c2556b');
  sky.addColorStop(1, '#ffb36b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);
  // the sun, half under the water
  const sun = ctx.createRadialGradient(640, sunY, 10, 640, sunY, 160);
  sun.addColorStop(0, 'rgba(255, 220, 150, 0.95)');
  sun.addColorStop(0.25, 'rgba(255, 170, 100, 0.6)');
  sun.addColorStop(1, 'rgba(255, 140, 90, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(480, horizon - 160, 320, 200);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, horizon);
  ctx.clip();
  ctx.fillStyle = '#ffd59a';
  ctx.beginPath();
  ctx.arc(640, sunY, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = `rgba(30, 10, 40, ${sunset * 0.35})`;
  ctx.fillRect(0, 0, width, horizon);
  // the far shore: a line of dark trees
  ctx.fillStyle = '#2a1830';
  for (let tree = 0; tree < 22; tree += 1) {
    const tx = tree * 50 - 10;
    const tall = 30 + (tree % 4) * 12;
    ctx.beginPath();
    ctx.moveTo(tx - 16, horizon);
    ctx.lineTo(tx, horizon - tall);
    ctx.lineTo(tx + 16, horizon);
    ctx.fill();
  }
  // the lake: still, too still, the sun broken on it
  const water = ctx.createLinearGradient(0, horizon, 0, ground);
  water.addColorStop(0, '#d9846a');
  water.addColorStop(0.4, '#6b3a5c');
  water.addColorStop(1, '#2c1b33');
  ctx.fillStyle = water;
  ctx.fillRect(0, horizon, width, ground - horizon);
  for (let streak = 0; streak < 12; streak += 1) {
    ctx.fillStyle = `rgba(255, 210, 150, ${0.5 - streak * 0.035})`;
    const w = 90 - streak * 6;
    ctx.fillRect(640 - w / 2, horizon + 6 + streak * 9, w, 2);
  }
  // the edge at the end of the lake (only when he speaks of it)
  if (edge > 0) {
    ctx.save();
    ctx.globalAlpha = edge;
    for (let crack = 0; crack < 30; crack += 1) {
      const cx = 900 + crack * 4;
      ctx.fillStyle = crack % 2 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 23, 68, 0.6)';
      ctx.fillRect(cx + (Math.random() - 0.5) * 6, horizon - 60 + Math.random() * 120, 2, 10 + Math.random() * 30);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(1000, horizon - 120, 40, 260);
    ctx.restore();
  }
  // the near shore, with reeds
  ctx.fillStyle = '#1d1322';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.beginPath();
  ctx.moveTo(0, ground);
  for (let x = 0; x <= width; x += 40) ctx.lineTo(x, ground - 6 - Math.sin(x * 0.05) * 4);
  ctx.lineTo(width, ground + 10);
  ctx.lineTo(0, ground + 10);
  ctx.fill();
  ctx.strokeStyle = '#2f1f2b';
  ctx.lineWidth = 2;
  for (let reed = 0; reed < 30; reed += 1) {
    const rx = (reed * 37) % width;
    const sway = Math.sin(time * 1.2 + reed) * 3;
    ctx.beginPath();
    ctx.moveTo(rx, ground);
    ctx.quadraticCurveTo(rx + sway, ground - 30, rx + sway * 2, ground - 50 - (reed % 3) * 10);
    ctx.stroke();
  }
}

// the long shadows of the trees across them
function drawKnightB9Shadows(time) {
  ctx.save();
  ctx.fillStyle = 'rgba(18, 8, 26, 0.6)';
  [[230, 0.35], [520, 0.5], [760, 0.3]].forEach(([x, tilt], index) => {
    const sway = Math.sin(time * 0.6 + index) * 6;
    ctx.beginPath();
    ctx.moveTo(x + sway, 0);
    ctx.lineTo(x + 70 + sway, 0);
    ctx.lineTo(x + 70 - ground * tilt, ground);
    ctx.lineTo(x - ground * tilt, ground);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

// ---------- the truth: a black screen, figures, fractures, maps... and his voice ----------
const knightB9MonologueSource = encodeURI('assetsaudio/Deltarune Chapter 5 Weird Route OST - Monologue.mp3');
const knightB9TruthLength = 100;
// (each moment starts at its second of the song; the song lasts about 93.5 s, the last moment stays after it)
const knightB9Truth = [
  { at: 0, kind: 'void', text: '...Knight. Cerra los ojos un segundo. Y escucha.' },
  { at: 6.5, kind: 'fight', text: 'Antes vivíamos normal. Peleábamos. Nos dábamos moquetes... y al otro día, de pie otra vez.' },
  { at: 13, kind: 'reset', text: 'Ganar. Perder. Volver a empezar. Siempre volver a empezar.' },
  { at: 19.5, kind: 'routine', text: 'Las mismas caras. Los mismos lugares. Las mismas palabras cada vez que alguien gana.' },
  { at: 26, kind: 'timeline', text: 'Pero esta... no es la línea original. Alguien la partió. Esta es la otra.' },
  { at: 32.5, kind: 'choice', text: 'En algún lado, alguien eligió la otra puerta. Y el mundo se dio vuelta.' },
  { at: 39, kind: 'control', text: 'Alguien nos mueve, Knight. Alguien aprieta las teclas. Alguien elige por nosotros.' },
  { at: 45.5, kind: 'paint', text: 'Los mapas. El bosque. El pueblo. Todo es pintura sobre la nada.' },
  { at: 52, kind: 'save', text: 'Cuando caemos, volvemos. El lo intenta otra vez. Nosotros no nos acordamos de nada.' },
  { at: 58.5, kind: 'false', text: 'Nuestras vidas son falsas.' },
  { at: 65, kind: 'deny', text: '...No. No, no lo son. Yo senti el fuego. Yo los escuche gritar. FUE REAL.', red: true },
  { at: 71.5, kind: 'him', text: '...¿O fue el? ¿El que apreto la R?', red: true },
  { at: 78, kind: 'fire', text: 'Este fuego... no es mio. El me lo dio. Yo solo lo sostuve. Yo solo... mire.' },
  { at: 84.5, kind: 'edge', text: 'Al final de ese lago hay un borde. Y mas alla... esta la verdad.' },
  { at: 91, kind: 'come', text: 'Vamos a ver quien nos mira.' },
];

function getKnightB9TruthItem(song) {
  let index = 0;
  knightB9Truth.forEach((item, itemIndex) => {
    if (song >= item.at) index = itemIndex;
  });
  const next = knightB9Truth[index + 1] ? knightB9Truth[index + 1].at : knightB9TruthLength;
  return { index, local: Math.floor((song - knightB9Truth[index].at) * 60), duration: Math.round((next - knightB9Truth[index].at) * 60) };
}

function drawKnightB9Figure(x, y, scale, alpha, crack = 0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2 / scale;
  ctx.fillStyle = '#060606';
  ctx.fillRect(-30, -120, 60, 120);
  ctx.strokeRect(-30, -120, 60, 120);
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(-14, -98, 6, 6);
  ctx.fillRect(8, -98, 6, 6);
  if (crack > 0) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${crack})`;
    ctx.beginPath();
    ctx.moveTo(-30, -60);
    ctx.lineTo(-6, -70);
    ctx.lineTo(4, -40);
    ctx.lineTo(30, -50);
    ctx.moveTo(-6, -70);
    ctx.lineTo(-10, -118);
    ctx.stroke();
  }
  ctx.restore();
}

function drawKnightB9Truth(index, local, time, duration) {
  const width = canvas.width;
  const cx = width / 2;
  const fade = Math.max(0, Math.min(1, local / 40, (duration - local) / 40));
  const item = knightB9Truth[index];
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.save();
  ctx.globalAlpha = fade;
  if (item.kind === 'void') {
    // nothing. A point of light, breathing
    const breathe = 0.5 + Math.sin(local / 30) * 0.5;
    const glow = ctx.createRadialGradient(cx, 300, 1, cx, 300, 10 + breathe * 30);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 60, 240, 120, 120);
  } else if (item.kind === 'routine') {
    // the same screen, again and again: someone wins
    for (let copy = 0; copy < 4; copy += 1) {
      const k = ((local / 90) + copy * 0.25) % 1;
      ctx.save();
      ctx.globalAlpha = fade * (1 - k);
      ctx.translate(cx, 300);
      ctx.scale(0.6 + k * 0.8, 0.6 + k * 0.8);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(-150, -60, 300, 120);
      ctx.textAlign = 'center';
      ctx.font = "900 22px 'Courier New', monospace";
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText('JUGADOR 1 GANA', 0, -8);
      ctx.font = "700 14px 'Courier New', monospace";
      ctx.fillStyle = '#9e9e9e';
      ctx.fillText('Reiniciar pelea', 0, 30);
      ctx.restore();
    }
  } else if (item.kind === 'choice') {
    // two doors; one of them opens... red
    [[cx - 150, false], [cx + 150, true]].forEach(([dx, chosen]) => {
      const open = chosen ? Math.min(1, Math.max(0, (local - 90) / 90)) : 0;
      ctx.strokeStyle = chosen ? '#ff1744' : '#9e9e9e';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx - 50, 200, 100, 180);
      ctx.fillStyle = chosen ? `rgba(255, 23, 68, ${0.15 + open * 0.6})` : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(dx - 50, 200, 100 * (1 - open * 0.8), 180);
      drawKnightB7Text(dx, 410, chosen ? 'B' : 'A', chosen ? '#ff1744' : '#9e9e9e', 1, false, 22);
    });
    if (local > 120) {
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.7)';
      ctx.beginPath();
      ctx.moveTo(0, 300 + Math.sin(local / 7) * 4);
      for (let x = 0; x < width; x += 30) ctx.lineTo(x, 300 + (Math.random() - 0.5) * 40);
      ctx.stroke();
    }
  } else if (item.kind === 'save') {
    // a fall, a button, and back again: the count of tries going up
    const cycle = (local % 80) / 80;
    ctx.save();
    if (cycle > 0.3 && cycle < 0.6) {
      ctx.translate(cx, 380);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-cx, -380);
    }
    drawKnightB9Figure(cx, 380, 1, cycle > 0.6 && cycle < 0.7 ? 0.3 : 1);
    ctx.restore();
    const pressed = cycle > 0.55 && cycle < 0.62;
    ctx.fillStyle = pressed ? '#ff1744' : '#1a1a1a';
    ctx.fillRect(cx - 90, 430, 180, 36);
    ctx.strokeStyle = '#e0e0e0';
    ctx.strokeRect(cx - 90, 430, 180, 36);
    drawKnightB7Text(cx, 454, 'REINTENTAR', '#e0e0e0', 1, false, 16);
    drawKnightB7Text(cx, 180, `INTENTO ${1 + Math.floor(local / 80) * 7}`, '#616161', 0.9, false, 16);
  } else if (item.kind === 'fire') {
    // a figure holding a flame that is not his, strings going up from it
    const grow = Math.min(1, local / 200);
    drawKnightB9Figure(cx, 420, 1.2, 1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawFlametombFlame(cx, 300, 20 + grow * 40, time * 12, 'outer');
    ctx.globalCompositeOperation = 'source-over';
    drawFlametombFlame(cx, 302, 10 + grow * 20, time * 14, 'core');
    ctx.restore();
    ctx.strokeStyle = 'rgba(224, 224, 224, 0.5)';
    ctx.lineWidth = 1;
    [-16, 0, 16].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx, 0);
      ctx.lineTo(cx + dx, 250 - grow * 20);
      ctx.stroke();
    });
  } else if (item.kind === 'fight') {
    // two figures, trading blows, playful
    const swing = Math.sin(local / 8);
    drawKnightB9Figure(cx - 80 + swing * 10, 380, 1, 1);
    drawKnightB9Figure(cx + 80 - swing * 10, 380, 1, 1);
    if (Math.floor(local / 24) % 2 === 0) drawKnightB7Text(cx + (Math.floor(local / 24) % 4 ? 30 : -30), 230, 'MOQUETE!', '#e0e0e0', 0.8, false, 18);
  } else if (item.kind === 'reset') {
    // one falls... and is standing again. Over and over
    const cycle = (local % 60) / 60;
    const fallen = cycle > 0.4 && cycle < 0.8;
    ctx.save();
    if (fallen) {
      ctx.translate(cx, 380);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-cx, -380);
    }
    drawKnightB9Figure(cx, 380, 1, 1);
    ctx.restore();
    if (fallen) drawKnightB7Text(cx, 220, 'K.O.', '#9e9e9e', 1, false, 40);
    drawKnightB7Text(cx, 160, `RONDA ${1 + Math.floor(local / 60)}`, '#616161', 0.8, false, 14);
  } else if (item.kind === 'timeline') {
    // the line of time... and where it splits
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(cx, 320);
    ctx.stroke();
    const grow = Math.min(1, local / 120);
    ctx.globalAlpha = fade * (1 - grow * 0.7);
    ctx.beginPath();
    ctx.moveTo(cx, 320);
    ctx.lineTo(cx + 380 * grow, 240);
    ctx.stroke();
    drawKnightB7Text(cx + 300, 220, 'ORIGINAL', '#9e9e9e', 1, false, 14);
    ctx.globalAlpha = fade;
    ctx.strokeStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(cx, 320);
    for (let step = 0; step <= 20; step += 1) ctx.lineTo(cx + step * 19 * grow, 320 + step * 4 * grow + (Math.random() - 0.5) * 6);
    ctx.stroke();
    drawKnightB7Text(cx + 300, 430, 'RUTA B', '#ff1744', grow, false, 16);
    for (let node = 0; node < 5; node += 1) {
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(110 + node * 80, 316, 8, 8);
    }
  } else if (item.kind === 'control') {
    // strings from above... the keys... and a hand that is not a hand
    for (let string = 0; string < 3; string += 1) {
      const fx = cx - 160 + string * 160;
      const pull = Math.sin(local / 15 + string) * 10;
      ctx.strokeStyle = 'rgba(224, 224, 224, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx, 0);
      ctx.lineTo(fx, 200 + pull);
      ctx.stroke();
      drawKnightB9Figure(fx, 300 + pull, 0.8, 1);
    }
    const keyLabels = ['A', 'D', 'W', 'S', 'Q', 'F', 'R'];
    keyLabels.forEach((label, keyIndex) => {
      const pressed = Math.floor(local / 9 + keyIndex * 3) % 7 === 0;
      const kx = cx - 210 + keyIndex * 60;
      ctx.fillStyle = pressed ? '#ff1744' : '#1a1a1a';
      ctx.fillRect(kx, 380 + (pressed ? 4 : 0), 44, 40);
      ctx.strokeStyle = '#e0e0e0';
      ctx.strokeRect(kx, 380 + (pressed ? 4 : 0), 44, 40);
      drawKnightB7Text(kx + 22, 407 + (pressed ? 4 : 0), label, '#e0e0e0', 1, false, 18);
    });
    // the cursor
    const px = cx + Math.sin(local / 40) * 200;
    const py = 120 + Math.cos(local / 30) * 30;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py + 34);
    ctx.lineTo(px + 9, py + 26);
    ctx.lineTo(px + 16, py + 40);
    ctx.lineTo(px + 22, py + 37);
    ctx.lineTo(px + 15, py + 23);
    ctx.lineTo(px + 26, py + 23);
    ctx.closePath();
    ctx.fill();
  } else if (item.kind === 'paint') {
    // the places, peeling off: under them, nothing but a grid
    const places = [['#2e7d32', 'BOSQUE'], ['#c2a27c', 'PUEBLO'], ['#4a4f52', 'BUNKER'], ['#7b3f8c', 'FAROL']];
    places.forEach(([color, name], placeIndex) => {
      const px = 120 + placeIndex * 200;
      const py = 200;
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      for (let g = 0; g <= 160; g += 20) {
        ctx.beginPath();
        ctx.moveTo(px + g, py);
        ctx.lineTo(px + g, py + 160);
        ctx.moveTo(px, py + g);
        ctx.lineTo(px + 160, py + g);
        ctx.stroke();
      }
      const peel = Math.max(0, Math.min(1, (local - 40 - placeIndex * 40) / 120));
      ctx.fillStyle = color;
      ctx.fillRect(px, py, 160, 160 * (1 - peel));
      ctx.strokeStyle = '#e0e0e0';
      ctx.strokeRect(px, py, 160, 160);
      drawKnightB7Text(px + 80, py + 190, name, '#9e9e9e', 1, false, 14);
    });
  } else if (item.kind === 'false') {
    // all of them, in a row... cracking like glass
    for (let figure = 0; figure < 7; figure += 1) {
      const crack = Math.max(0, Math.min(1, (local - 60 - figure * 15) / 60));
      drawKnightB9Figure(140 + figure * 125, 400 + crack * crack * (figure % 2 ? 10 : 0), 0.85, 1 - crack * 0.5, crack);
    }
  } else if (item.kind === 'deny') {
    // fire, screams... red
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let flame = 0; flame < 14; flame += 1) drawFlametombFlame(80 + flame * 66, 470, 30 + (flame % 3) * 10, time * 12 + flame, 'outer');
    ctx.restore();
    for (let scream = 0; scream < 8; scream += 1) {
      ctx.strokeStyle = 'rgba(255, 82, 82, 0.6)';
      ctx.beginPath();
      const sx = 100 + scream * 110 + (Math.random() - 0.5) * 6;
      ctx.moveTo(sx, 260);
      ctx.lineTo(sx + (Math.random() - 0.5) * 10, 380);
      ctx.stroke();
    }
  } else if (item.kind === 'him') {
    // an eye, opening, in the middle of everything
    const open = Math.min(1, local / 120);
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.ellipse(cx, 300, 160, 70 * open, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(cx + Math.sin(local / 50) * 30, 300, 40 * open, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx + Math.sin(local / 50) * 30, 300, 16 * open, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.kind === 'edge') {
    // the lake... and the edge of the world at the end of it
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 340);
    ctx.lineTo(820, 340);
    ctx.stroke();
    for (let line = 0; line < 8; line += 1) {
      ctx.strokeStyle = `rgba(224, 224, 224, ${0.4 - line * 0.04})`;
      ctx.beginPath();
      ctx.moveTo(60 + line * 30, 360 + line * 22);
      ctx.lineTo(820 - line * 30, 360 + line * 22);
      ctx.stroke();
    }
    for (let bit = 0; bit < 80; bit += 1) {
      ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#ff1744';
      ctx.fillRect(830 + Math.random() * 160, 200 + Math.random() * 280, 3, 3 + Math.random() * 12);
    }
  } else if (item.kind === 'come') {
    // him, turning to look... at us
    drawKnightB9Figure(cx, 430, 1.6, 1);
    ctx.fillStyle = '#b2ebf2';
    ctx.fillRect(cx - 24, 430 - 158, 12, 10);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(cx + 12, 430 - 158, 12, 10);
  }
  ctx.restore();
  // his voice: written slowly, letters that do not stay still
  const typed = item.text.slice(0, Math.floor(Math.max(0, local - 20) / 3));
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.font = "700 19px 'Courier New', monospace";
  ctx.textAlign = 'center';
  const rows = wrapNoteText(typed, width - 200);
  rows.forEach((row, rowIndex) => {
    const shaken = row.split('').map((char) => (Math.random() < 0.025 ? '#%&?'[Math.floor(Math.random() * 4)] : char)).join('');
    ctx.fillStyle = item.red ? (Math.random() < 0.3 ? '#ffffff' : '#ff5252') : (Math.random() < 0.04 ? '#ff1744' : '#d6d6d6');
    ctx.fillText(shaken, cx + (item.red ? (Math.random() - 0.5) * 4 : 0), canvas.height - 70 + rowIndex * 26);
  });
  ctx.restore();
  // grain
  for (let grain = 0; grain < 60; grain += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * width, Math.random() * canvas.height, 2, 2);
  }
}

// ---------- the scene ----------
function tickKnightB9Scene() {
  const scene = knightB9.scene;
  if (!scene || scene.done) return;
  scene.t += 1;
  scene.partT += 1;
  const t = scene.partT;
  const time = performance.now() / 1000;
  const script = knightB9Script[scene.part] || [];
  script.forEach(([at, who, text, glitch]) => {
    if (t === at) {
      scene.line = { who, text, glitch };
      scene.typed = 0;
      if (who !== 'narrator') playSound('menuMove');
      if (glitch) playTone({ frequency: 45, duration: 1.2, type: 'sawtooth', volume: 0.06, slideTo: 30 });
    }
  });
  if (scene.line && t % 2 === 0) scene.typed = Math.min(scene.line.text.length, scene.typed + 1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (scene.part === 'rebuild') {
    // THE FUNERAL: a cemetery on the hill, a grey day, rain. Light Warrior remembers them
    drawKnightB9Funeral(time, t, () => scene.workers.forEach((worker, index) => {
      // the explorers, heads down, behind the stones
      worker.x = [165, 255, 700, 790][index];
      worker.back = true;
      worker.lit = true;
      worker.scared = false;
      ctx.save();
      ctx.translate(worker.x, ground);
      ctx.rotate(index % 2 ? 0.04 : -0.04);
      ctx.translate(-worker.x, -ground);
      const prop = worker.prop;
      worker.prop = null;
      worker.dropped = true;
      drawKnightBLwHelper(worker, index, time);
      worker.prop = prop;
      ctx.restore();
    }));
    const lw = scene.lw;
    lw.position.x = 470;
    lw.attacksToTheRight = true;
    lw.isAttacking = false;
    lw.knightKneel = false;
    ctx.save();
    if (t > 1180) {
      // on one knee, the flowers in front of the stone
      const pivot = lw.position.x + lw.width / 2;
      ctx.translate(pivot, ground);
      ctx.scale(1, 0.84);
      ctx.translate(-pivot, -ground);
    }
    lw.draw();
    ctx.restore();
    if (t > 1200) {
      ['#f48fb1', '#fff59d', '#ffffff', '#90caf9', '#ef5350'].forEach((color, index) => {
        ctx.fillStyle = '#558b2f';
        ctx.fillRect(574 + index * 6, ground - 16, 2, 16);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(575 + index * 6, ground - 18, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    if (t % 240 === 30 && t < 900) playTone({ frequency: 196, duration: 3, type: 'sine', volume: 0.05, slideTo: 190 });
    // the rain over everything
    ctx.strokeStyle = 'rgba(190, 200, 215, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let drop = 0; drop < 80; drop += 1) {
      const dx = ((drop * 71 + time * 90) % (canvas.width + 60)) - 30;
      const dy = (drop * 97 + time * 480) % canvas.height;
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx - 3, dy + 14);
    }
    ctx.stroke();
  } else if (scene.part === 'hill') {
    drawKnightBBunkerOutside();
    // an overcast day over the hill
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(110, 115, 130, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    // burnt marks around the door, ash on the ground
    const scorch = ctx.createRadialGradient(704, ground - 90, 20, 704, ground - 90, 150);
    scorch.addColorStop(0, 'rgba(20, 14, 12, 0.45)');
    scorch.addColorStop(1, 'rgba(20, 14, 12, 0)');
    ctx.fillStyle = scorch;
    ctx.fillRect(554, ground - 240, 300, 240);
    ctx.fillStyle = '#7b7b7b';
    [[560, 14], [600, 8], [820, 12], [880, 6]].forEach(([ax, w]) => {
      ctx.beginPath();
      ctx.ellipse(ax, ground, w * 3, w * 0.6, 0, Math.PI, 0);
      ctx.fill();
    });
    for (let flake = 0; flake < 24; flake += 1) {
      ctx.fillStyle = 'rgba(160, 160, 160, 0.6)';
      ctx.fillRect(((flake * 97 + time * 30) % (canvas.width + 40)) - 20, (flake * 53 + time * 12) % ground, 2, 2);
    }
    scene.visitors.forEach((visitor, index) => {
      visitor.isAttacking = false;
      if (index < 2) {
        const goal = 400 + index * 120;
        if (visitor.position.x < goal) {
          visitor.position.x = Math.min(goal, visitor.position.x + 0.8);
          visitor.velocity.x = 0.8;
        } else visitor.velocity.x = 0;
        visitor.attacksToTheRight = true;
      } else {
        visitor.position.y = ground - visitor.height - 10 - Math.sin(time * 2) * 6;
      }
      visitor.draw();
    });
    drawKnightB9Birds(time, '#3a3a40');
  } else if (scene.part === 'lake' || scene.part === 'after') {
    const edge = scene.part === 'after' ? Math.min(1, t / 120) : 0;
    const sunset = scene.part === 'lake' ? Math.min(1, t / 1600) : 1;
    drawKnightB9Lake(time, edge, sunset);
    drawKnightB9Birds(time, '#2a1830');
    // fireflies, as it gets darker
    for (let fly = 0; fly < 14; fly += 1) {
      const glow = (0.3 + 0.7 * Math.abs(Math.sin(time * 1.5 + fly))) * sunset;
      ctx.fillStyle = `rgba(255, 241, 118, ${glow * 0.8})`;
      ctx.fillRect(100 + ((fly * 131) % 820) + Math.sin(time + fly) * 20, ground - 40 - ((fly * 37) % 120) + Math.cos(time * 0.8 + fly) * 10, 3, 3);
    }
    if (scene.part === 'lake' && t > 380 && t < 620) {
      // where he comes out: rings on the water
      const k = (t - 380) / 240;
      ctx.strokeStyle = `rgba(255, 200, 160, ${0.5 * (1 - k)})`;
      ctx.lineWidth = 2;
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath();
        ctx.ellipse(730, ground - 4, 30 + k * 160 + ring * 30, 6 + k * 16 + ring * 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Knight: sitting by the water... then up
    const knight = scene.knight;
    knight.isAttacking = false;
    if (scene.part === 'lake') {
      knight.knightKneel = t < 520;
      if (t > 600 && t < 745) knight.position.x = Math.min(500, knight.position.x + 1.2);
      if (t >= 745 && t < 775) knight.position.x = Math.max(450, knight.position.x - 2);
      if (t > 1240 && t < 1320) knight.position.x = Math.max(430, knight.position.x - 1);
      knight.attacksToTheRight = true;
      knight.isAttacking = t > 600 && t < 640;
    } else {
      knight.knightKneel = false;
      knight.attacksToTheRight = t < 440 ? true : false;
    }
    knight.draw();
    // Fire Master: out of the shadow, slowly
    const fire = scene.fire;
    let fireAlpha = 1;
    if (scene.part === 'lake') fireAlpha = Math.max(0, Math.min(1, (t - 380) / 140));
    if (scene.part === 'after' && t > 300) fire.position.x = Math.min(880, fire.position.x + 0.8);
    fire.attacksToTheRight = scene.part === 'after' && t > 120 && t < 300 ? true : false;
    if (scene.part === 'after' && t > 300 && t < 360) fire.attacksToTheRight = false;
    if (fireAlpha > 0) drawBizarreFireMaster(fire, fireAlpha);
    if (scene.part === 'lake' && t > 740 && t < 860) {
      // "wait": a wall of black fire rises between them
      const k = Math.min(1, (t - 740) / 20) * Math.min(1, (860 - t) / 30);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let flame = 0; flame < 7; flame += 1) drawFlametombFlame(600, ground - flame * 22 * k, 18 * k, time * 12 + flame, 'outer');
      ctx.restore();
      for (let flame = 0; flame < 7; flame += 2) drawFlametombFlame(600, ground - flame * 22 * k + 4, 9 * k, time * 14 + flame, 'core');
      if (t === 741) playNoise({ duration: 0.5, volume: 0.08, filterFrequency: 600 });
    }
    drawKnightB9Shadows(time);
    if (scene.part === 'after' && t > 9999) {
      // the world, coming apart at the edges
      for (let slice = 0; slice < 6; slice += 1) {
        const sy = Math.random() * canvas.height;
        ctx.drawImage(canvas, 0, sy, canvas.width, 12, (Math.random() - 0.5) * 40, sy, canvas.width, 12);
      }
    }
  } else if (scene.part === 'drag') {
    if (tickKnightB9Drag(scene, time) === 'done') return;
    updateKnightBWind();
    requestAnimationFrame(tickKnightB9Scene);
    return;
  } else if (scene.part === 'truth') {
    if (!scene.music) {
      scene.musicAt = t;
      if (typeof Audio !== 'undefined') {
        const music = new Audio(knightB9MonologueSource);
        music.volume = Math.max(0, Math.min(1, 0.75 * audioSettings.master * audioSettings.music));
        const promise = music.play();
        if (promise && promise.catch) promise.catch(() => {});
        scene.music = music;
      } else {
        scene.music = { paused: true };
      }
    }
    const playing = scene.music && !scene.music.paused && scene.music.currentTime > 0.05;
    const song = playing ? scene.music.currentTime : (t - scene.musicAt) / 60;
    // (after the song: a few more seconds of the last words, in silence)
    const ended = !playing && scene.music && scene.music.ended;
    const clock = ended ? Math.max(song, (scene.music.duration || 93.5) + (t - (scene.endedAt || (scene.endedAt = t))) / 60) : song;
    const { index: truthIndex, local, duration } = getKnightB9TruthItem(clock);
    if (clock >= knightB9TruthLength) {
      scene.part = 'after';
      scene.partT = 0;
      scene.line = null;
      scene.fire.position.x = 640;
      scene.knight.position.x = 430;
      requestAnimationFrame(tickKnightB9Scene);
      return;
    }
    const index = truthIndex;
    if (scene.lastTruth !== index) {
      scene.lastTruth = index;
      playNoise({ duration: 1.2, volume: 0.015, filterFrequency: 500 });
    }
    if (local % 4 === 0 && local > 20 && local < 20 + knightB9Truth[index].text.length * 3) playTone({ frequency: 300 + Math.random() * 60, duration: 0.03, type: 'square', volume: 0.01 });
    drawKnightB9Truth(index, local, time, duration);
  }
  // fades between the parts, and the lines
  const length = knightB9PartLength[scene.part];
  if (length && scene.part !== 'truth') {
    if (t < 40) {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - t / 40})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (t > length - 50) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (t - length + 50) / 40)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (scene.line) drawKnightB9Box(scene.line, scene.typed);
    if (t >= length) {
      const order = { rebuild: 'hill', hill: 'lake', lake: 'truth', after: 'drag' };
      scene.part = order[scene.part];
      scene.partT = 0;
      scene.line = null;
      if (scene.part === 'lake') startKnightBWind();
      if (scene.part === 'truth') stopKnightBWind();
      if (scene.part === 'drag') {
        startKnightB9Drag(scene);
        requestAnimationFrame(tickKnightB9Scene);
        return;
      }
    }
  }
  if (scene.part === 'lake' || scene.part === 'after') updateKnightBWind();
  ctx.save();
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.textAlign = 'right';
  ctx.fillText('ESC: saltar', canvas.width - 16, 20);
  ctx.restore();
  requestAnimationFrame(tickKnightB9Scene);
}

function finishKnightB9Scene(watched) {
  const scene = knightB9.scene;
  if (!scene || scene.done) return;
  scene.done = true;
  window.removeEventListener('keydown', scene.skip);
  if (scene.choiceKey) window.removeEventListener('keydown', scene.choiceKey);
  if (scene.choiceClick) canvas.removeEventListener('pointerdown', scene.choiceClick);
  document.body.classList.remove('knightb-ending');
  if (typeof stopKnightBWind === 'function') stopKnightBWind();
  if (scene.music && scene.music.pause) scene.music.pause();
  knightB9.scene = null;
  try {
    localStorage.setItem(knightB9BeatenKey, '1');
  } catch (error) {
    // (not remembered)
  }
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (typeof returnToMenu === 'function') returnToMenu();
  if (typeof showCustomToast === 'function') showCustomToast('?', watched ? 'Capitulo 7B...' : 'Falta uno.');
}

(function hookChapterFiveBSecretLevel() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  wrap('isArcadeLevelComingSoon', (base) => function isArcadeLevelComingSoonWith9(level, ...rest) {
    if (arcadeChapter === 'knightB' && level === knightBSecretLevel) return false;
    return base.call(this, level, ...rest);
  });
  wrap('configureKnightBLevel', (base) => function configureKnightBLevelWith9(...args) {
    if (selectedNormalArcadeLevel === knightBSecretLevel) {
      player1.setCharacterType('normal', 'knight');
      player2.setCharacterType('fireMaster');
      selectedMap = 'villagePlaza';
      botEnabled = true;
      normalArcadeEnemyIndex = 1;
      normalArcadeEnemiesRemaining = 0;
      return undefined;
    }
    return base.apply(this, args);
  });
  wrap('configureKnightBEnemy', (base) => function configureKnightBEnemyWith9(...args) {
    if (selectedNormalArcadeLevel === knightBSecretLevel) return undefined;
    return base.apply(this, args);
  });
  wrap('getReflecterBattleTrackKey', (base) => function getReflecterBattleTrackKeyWith9(...args) {
    if (isKnightB9()) return null;
    return base.apply(this, args);
  });
  wrap('finishFight', (base) => function finishFightWith9(...args) {
    if (isKnightB9() && knightB9.scene) return undefined;
    return base.apply(this, args);
  });
  wrap('returnToMenu', (base) => function returnToMenuWith9(...args) {
    const scene = knightB9.scene;
    if (scene && !scene.done) {
      scene.done = true;
      if (scene.music && scene.music.pause) scene.music.pause();
      if (scene.choiceKey) window.removeEventListener('keydown', scene.choiceKey);
      if (scene.choiceClick) canvas.removeEventListener('pointerdown', scene.choiceClick);
      window.removeEventListener('keydown', scene.skip);
      document.body.classList.remove('knightb-ending');
      knightB9.scene = null;
    }
    return base.apply(this, args);
  });
})();

// a little memorial at the end of the square: a stone, flowers... and the children's drawing of the knight
function drawKnightB9Memorial(time) {
  const x = 930;
  ctx.fillStyle = '#8e8e8e';
  ctx.fillRect(x - 18, ground - 50, 36, 50);
  ctx.beginPath();
  ctx.arc(x, ground - 50, 18, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#5f5f5f';
  ctx.fillRect(x - 10, ground - 44, 20, 3);
  ctx.fillRect(x - 10, ground - 36, 20, 3);
  ['#f48fb1', '#fff59d', '#90caf9', '#ef5350'].forEach((color, index) => {
    ctx.fillStyle = '#558b2f';
    ctx.fillRect(x - 30 + index * 9, ground - 14, 2, 14);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - 29 + index * 9, ground - 16 + Math.sin(time * 2 + index) * 0.8, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.save();
  ctx.translate(x + 26, ground - 22);
  ctx.rotate(0.1);
  ctx.fillStyle = '#ffccbc';
  ctx.fillRect(-11, -9, 22, 18);
  ctx.strokeStyle = '#1e88e5';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-4, -6, 8, 12);
  ctx.restore();
}

function drawKnightB9Birds(time, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let bird = 0; bird < 5; bird += 1) {
    const bx = ((bird * 170 + time * 26) % (canvas.width + 120)) - 60;
    const by = 70 + (bird % 3) * 26 + Math.sin(time + bird) * 6;
    const flap = Math.sin(time * 8 + bird) * 4;
    ctx.beginPath();
    ctx.moveTo(bx - 8, by - flap);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + 8, by - flap);
    ctx.stroke();
  }
}

// ================= after the monologue: he takes Knight with his fire... and the lake =================
// a choice every time (go with him or not); whatever you choose, deeper and deeper: the surface of the lake,
// then its bottom (where Robledal's things lie), then the edge of the world. The sound of Route B louder
// each time... until it is a new sound, torn, wild. The white comes in (the choices and the words still
// show through it)... and then, black
const knightB9Rounds = [
  { place: 'surface', talk: [['fire', 'Vamos, Knight. Al borde.'], ['knight', '¿Que...? ¡Esto es fuego! ¡Solta-!']], question: '¿Acompañarlo?', yes: [['knight', '...Esta bien. Voy.']], no: [['knight', '¡NO! ¡Soltame!'], ['fire', 'No era una pregunta.']] },
  { place: 'surface', talk: [['fire', 'Mas adentro. Ya casi se ve el borde.'], ['knight', '(El agua no esta fria... esta quemando.)'], ['fire', 'Mira el sol, Knight. No se mueve. Nunca se movio.']], question: '¿Seguir?', yes: [['knight', '(...¿Por que dije que si?)']], no: [['fire', 'JA. "No". Como si pudieras elegir.', true]] },
  { place: 'surface', talk: [['fire', '¿LO VES? ¿LO VES?! ESTA AHI, KNIGHT! JAJAJAJA!', true], ['knight', '(No... no puedo respirar...)']], question: '¿Seguir?', yes: [['fire', 'ESO. ESO ES. MAS.', true]], no: [['fire', 'NO EXISTE EL NO. EL NUNCA TE DEJO ELEGIR.', true]] },
  { place: 'deep', talk: [['knight', '(...blub...)'], ['fire', 'Escucha, Knight. Aca abajo no hay musica. No hay nada.'], ['knight', '(...¿donde estamos?...)']], question: '¿Seguir bajando?', yes: [['fire', 'Mas. Mas abajo.']], no: [['fire', 'Aca abajo no se dice que no.', true]] },
  { place: 'deep', talk: [['fire', 'Mira. El cartel de Robledal. La puerta del bunker. Todo tirado aca abajo, como basura.'], ['knight', '(...esto no es real... no puede ser real...)'], ['fire', 'Nada lo es. Por eso no duele. JE. JE JE.', true]], question: '¿Seguir?', yes: [['knight', '(...)']], no: [['fire', 'Tus "no" son de el. Tus "si" tambien.', true]] },
  { place: 'deep', talk: [['knight', '(...blub... ayuda...)'], ['knight', '(...¿me vas a sacar de aca?...)']], question: '¿Lo vas a salvar?', yes: [['fire', 'Nadie salva a nadie. Nunca.', true]], no: [['fire', 'Nadie salva a nadie. Nunca.', true]], morph: true },
  { place: 'edge', talk: [['fire', 'EL BORDE. EL BORDE, KNIGHT. MIRA PARA AFUERA.', true], ['knight', '(...hay algo... del otro lado...)']], question: '¿MAS?', frenzyChoice: true },
  { place: 'edge', frenzy: true, question: '¿MAS?' },
  { place: 'edge', frenzy: true, question: '¿MAS?' },
  { place: 'edge', frenzy: true, question: 'MAS MAS MAS' },
];

function startKnightB9Drag(scene) {
  scene.part = 'drag';
  scene.partT = 0;
  scene.line = null;
  scene.drag = { round: 0, phase: 'grab', t: 0, water: 0, waterGoal: 0, white: 0, distort: 0, chain: 0, choice: null, queue: [], laughs: [], level: 0, place: 'surface', placeFade: 1, bits: [] };
  scene.knight.position.x = 430;
  scene.fire.position.x = 600;
  scene.choiceKey = (event) => {
    const choice = scene.drag && scene.drag.choice;
    if (!choice || choice.done) return;
    if (['a', 'A', 'ArrowLeft'].includes(event.key)) choice.sel = 0;
    if (['d', 'D', 'ArrowRight'].includes(event.key)) choice.sel = 1;
    if (['Enter', ' ', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
      pickKnightB9Choice(scene, choice.sel);
    }
  };
  scene.choiceClick = (event) => {
    const choice = scene.drag && scene.drag.choice;
    if (!choice || choice.done) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    pickKnightB9Choice(scene, x < canvas.width / 2 ? 0 : 1);
  };
  window.addEventListener('keydown', scene.choiceKey);
  canvas.addEventListener('pointerdown', scene.choiceClick);
}

// the Route B sound, torn apart: its notes crushed into a chord, a falling scream, a rumble under it all
function playKnightB9RouteScream(intensity) {
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (!audio || !out) return;
  const now = audio.currentTime;
  const length = 2.2 + intensity * 0.2;
  const shaper = audio.createWaveShaper();
  const curve = new Float32Array(4096);
  const drive = 300 + intensity * 150;
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i * 2) / curve.length - 1;
    // (crushed: steps, like a broken speaker)
    const stepped = Math.round(x * 12) / 12;
    curve[i] = ((3 + drive) * stepped * 20 * (Math.PI / 180)) / (Math.PI + drive * Math.abs(stepped));
  }
  shaper.curve = curve;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.min(0.9, 0.45 + intensity * 0.1), now + 0.02);
  gain.gain.setValueAtTime(Math.min(0.9, 0.45 + intensity * 0.1), now + length * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  shaper.connect(gain);
  gain.connect(out);
  const lfo = audio.createOscillator();
  lfo.frequency.value = 9 + intensity * 3;
  const depth = audio.createGain();
  depth.gain.value = 40 + intensity * 20;
  lfo.connect(depth);
  // the four notes of the sting, all at once, falling apart
  [880, 622, 415, 311].forEach((frequency, index) => {
    const osc = audio.createOscillator();
    osc.type = index % 2 ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(frequency * 1.02, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + length);
    depth.connect(osc.frequency);
    osc.connect(shaper);
    osc.start(now);
    osc.stop(now + length + 0.05);
  });
  // a scream: a voice going up and then breaking down
  const scream = audio.createOscillator();
  scream.type = 'sawtooth';
  scream.frequency.setValueAtTime(400, now);
  scream.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
  scream.frequency.exponentialRampToValueAtTime(90, now + length);
  depth.connect(scream.frequency);
  scream.connect(shaper);
  scream.start(now);
  scream.stop(now + length + 0.05);
  // the rumble underneath
  const sub = audio.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(48, now);
  sub.frequency.exponentialRampToValueAtTime(26, now + length);
  const subGain = audio.createGain();
  subGain.gain.value = 0.6;
  sub.connect(subGain);
  subGain.connect(out);
  sub.start(now);
  sub.stop(now + length + 0.05);
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * length), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  const band = audio.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1800;
  noise.connect(band);
  band.connect(shaper);
  noise.start(now);
  lfo.start(now);
  lfo.stop(now + length + 0.05);
}

// once, twice, more of the usual sound... and from the fifth on, the new one
function playKnightB9Sting(level) {
  if (level < 5) {
    const copies = Math.min(4, level);
    for (let copy = 0; copy < copies; copy += 1) setTimeout(() => playFlametombStingSound(), copy * 50);
    if (level >= 3) playNoise({ duration: 1.2, volume: 0.05 * (level - 2), filterFrequency: 900 });
    return;
  }
  playKnightB9RouteScream(level - 4);
  if (level >= 7) setTimeout(() => playKnightB9RouteScream(level - 4), 180);
}

function pickKnightB9Choice(scene, sel) {
  const drag = scene.drag;
  const choice = drag.choice;
  const round = knightB9Rounds[drag.round];
  if (!choice || choice.done) return;
  if (round.morph && sel === 1 && !choice.morphed) {
    // "no"... is not an answer. The button turns into something else
    choice.morphed = true;
    choice.options[1] = 'MAS';
    choice.morphT = 0;
    playTone({ frequency: 60, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    setTimeout(() => {
      if (scene.drag === drag && !choice.done) pickKnightB9Choice(scene, 1);
    }, 1100);
    return;
  }
  choice.done = true;
  drag.level += 1;
  playKnightB9Sting(drag.level);
  drag.flash = Math.min(1, 0.3 + drag.level * 0.08);
  drag.shake = 10 + drag.level * 4;
  drag.phase = 'react';
  drag.t = 0;
  drag.queue = round.frenzy || round.frenzyChoice ? [] : (sel === 0 ? round.yes : round.no).slice();
  drag.line = null;
}

function knightB9Say(scene, entry) {
  scene.drag.line = { who: entry[0], text: entry[1], glitch: Boolean(entry[2]), t: 0 };
  playSound('menuMove');
}

// ---------- the places ----------
function drawKnightB9Deep(time, drag) {
  const width = canvas.width;
  const deep = ctx.createLinearGradient(0, 0, 0, canvas.height);
  deep.addColorStop(0, '#3b2a55');
  deep.addColorStop(0.5, '#1d1838');
  deep.addColorStop(1, '#09060f');
  ctx.fillStyle = deep;
  ctx.fillRect(0, 0, width, canvas.height);
  // light from far above, in shafts
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let shaft = 0; shaft < 5; shaft += 1) {
    const sx = 120 + shaft * 190 + Math.sin(time * 0.4 + shaft) * 30;
    const shaftGrad = ctx.createLinearGradient(sx, 0, sx + 60, 400);
    shaftGrad.addColorStop(0, 'rgba(255, 190, 150, 0.16)');
    shaftGrad.addColorStop(1, 'rgba(255, 190, 150, 0)');
    ctx.fillStyle = shaftGrad;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + 40, 0);
    ctx.lineTo(sx + 140, 420);
    ctx.lineTo(sx + 60, 420);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // what lies at the bottom: the sign of Robledal, the door of the bunker, a drawing, seaweed
  ctx.fillStyle = '#150f1c';
  ctx.beginPath();
  ctx.moveTo(0, ground + 10);
  for (let x = 0; x <= width; x += 30) ctx.lineTo(x, ground - 6 + Math.sin(x * 0.03) * 8);
  ctx.lineTo(width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.fill();
  ctx.save();
  ctx.translate(170, ground - 30);
  ctx.rotate(-0.35);
  ctx.fillStyle = '#4e3a2c';
  ctx.fillRect(-6, -10, 8, 50);
  ctx.fillRect(-60, -46, 120, 34);
  ctx.fillStyle = '#c8b39a';
  ctx.font = "900 15px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('ROBLEDAL', 0, -24);
  ctx.restore();
  ctx.save();
  ctx.translate(820, ground - 40);
  ctx.rotate(0.25);
  ctx.fillStyle = '#3a3f44';
  ctx.fillRect(-60, -70, 120, 140);
  ctx.strokeStyle = '#8d8d8d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(560 + Math.sin(time * 0.7) * 20, 200 + Math.sin(time * 0.5) * 30);
  ctx.rotate(Math.sin(time * 0.6) * 0.5);
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#ffccbc';
  ctx.fillRect(-14, -11, 28, 22);
  ctx.strokeStyle = '#1e88e5';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-5, -8, 10, 15);
  ctx.restore();
  ctx.strokeStyle = '#2b3d2a';
  ctx.lineWidth = 3;
  for (let weed = 0; weed < 14; weed += 1) {
    const wx = (weed * 79) % width;
    ctx.beginPath();
    ctx.moveTo(wx, ground);
    for (let seg = 1; seg <= 6; seg += 1) ctx.lineTo(wx + Math.sin(time * 1.5 + weed + seg * 0.6) * 8, ground - seg * 16);
    ctx.stroke();
  }
  // things drifting up
  for (let mote = 0; mote < 30; mote += 1) {
    const rise = (time * 20 + mote * 37) % canvas.height;
    ctx.fillStyle = 'rgba(220, 220, 255, 0.35)';
    ctx.fillRect((mote * 113) % width + Math.sin(time + mote) * 6, canvas.height - rise, 2, 2);
  }
}

function drawKnightB9Edge(time, drag) {
  const width = canvas.width;
  ctx.fillStyle = '#020203';
  ctx.fillRect(0, 0, width, canvas.height);
  // the lake's sky, upside down, far above
  const inverted = ctx.createLinearGradient(0, 0, 0, 120);
  inverted.addColorStop(0, '#ffb36b');
  inverted.addColorStop(0.5, '#c2556b');
  inverted.addColorStop(1, 'rgba(58, 39, 86, 0)');
  ctx.fillStyle = inverted;
  ctx.fillRect(0, 0, width, 120);
  // a floor that is only a grid
  ctx.strokeStyle = 'rgba(230, 230, 230, 0.35)';
  ctx.lineWidth = 1;
  for (let line = 0; line < 12; line += 1) {
    const y = ground - 40 + line * line * 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let column = -10; column <= 10; column += 1) {
    ctx.beginPath();
    ctx.moveTo(width / 2 + column * 30, ground - 40);
    ctx.lineTo(width / 2 + column * 160, canvas.height);
    ctx.stroke();
  }
  // pieces of the places, floating: the forest, the square, the bunker, the farol
  ['#2e7d32', '#c2a27c', '#4a4f52', '#7b3f8c', '#1e3a8a'].forEach((color, index) => {
    const px = ((index * 230 + time * 12 * (index % 2 ? 1 : -1)) % (width + 200) + width + 200) % (width + 200) - 100;
    const py = 150 + (index % 3) * 70 + Math.sin(time * 0.8 + index) * 20;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(Math.sin(time * 0.3 + index) * 0.4);
    ctx.fillStyle = color;
    ctx.fillRect(-40, -26, 80, 52);
    ctx.strokeStyle = '#e0e0e0';
    ctx.strokeRect(-40, -26, 80, 52);
    ctx.restore();
  });
  // the crack: the edge of the world, getting wider
  const open = Math.min(1, 0.2 + drag.round / 10);
  const crackX = width - 120;
  const crack = ctx.createLinearGradient(crackX - 80 * open, 0, crackX + 80 * open, 0);
  crack.addColorStop(0, 'rgba(255, 255, 255, 0)');
  crack.addColorStop(0.5, `rgba(255, 255, 255, ${0.9})`);
  crack.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = crack;
  ctx.fillRect(crackX - 80 * open, 0, 160 * open, canvas.height);
  for (let bit = 0; bit < 60; bit += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#ff1744';
    ctx.fillRect(crackX - 120 + Math.random() * 240, Math.random() * canvas.height, 2, 4 + Math.random() * 18);
  }
}

function tickKnightB9Drag(scene, time) {
  const drag = scene.drag;
  drag.t += 1;
  const t = drag.t;
  const round = knightB9Rounds[Math.min(drag.round, knightB9Rounds.length - 1)];
  if (drag.line) drag.line.t += 1;
  // ---------- what happens ----------
  if (drag.phase === 'grab') {
    // chains of black fire wrap around him
    drag.chain = Math.min(1, t / 90);
    if (t === 10) playNoise({ duration: 0.8, volume: 0.08, filterFrequency: 600 });
    if (t > 100) {
      drag.phase = 'talk';
      drag.t = 0;
      drag.queue = round.talk.slice();
    }
  } else if (drag.phase === 'talk' || drag.phase === 'react') {
    if (round.frenzy && drag.phase === 'talk') {
      drag.phase = 'choose';
      drag.t = 0;
    } else if (!drag.line || drag.line.t > drag.line.text.length * 2 + 90) {
      if (drag.queue.length) knightB9Say(scene, drag.queue.shift());
      else if (drag.phase === 'talk') {
        drag.line = null;
        drag.phase = 'choose';
        drag.t = 0;
      } else {
        drag.line = null;
        drag.phase = 'pull';
        drag.t = 0;
        if (round.place === 'surface') drag.waterGoal = Math.min(1.1, drag.waterGoal + 0.38);
      }
    }
  } else if (drag.phase === 'choose') {
    if (drag.choice) {
      drag.choice.t += 1;
      if (drag.choice.morphed) drag.choice.morphT += 1;
      // (if nobody answers, it answers itself)
      const wait = round.frenzy ? 140 - drag.round * 8 : 600;
      if (!drag.choice.done && drag.choice.t > wait) pickKnightB9Choice(scene, 0);
    }
  } else if (drag.phase === 'pull') {
    // deeper: both of them, toward the edge
    const long = round.frenzy ? 90 : 300;
    if (round.place === 'surface') {
      scene.fire.position.x = Math.min(900, scene.fire.position.x + 0.6);
      scene.knight.position.x = Math.min(scene.fire.position.x - 90, scene.knight.position.x + 0.6);
    }
    if (t % 30 === 0) playNoise({ duration: 0.4, volume: 0.04, filterFrequency: 400 });
    if (drag.round >= 5) drag.white = Math.min(0.9, drag.white + 0.0012 * (drag.round - 3));
    drag.distort = Math.min(1, Math.max(0, drag.round - 2) / 6);
    if (t > long) {
      drag.round += 1;
      drag.choice = null;
      if (drag.round >= knightB9Rounds.length) {
        drag.phase = 'whiteout';
        drag.t = 0;
      } else {
        const next = knightB9Rounds[drag.round];
        if (next.place !== drag.place) {
          // a new place: everything goes dark for a moment
          drag.place = next.place;
          drag.placeFade = 1;
          playNoise({ duration: 1, volume: 0.08, filterFrequency: 300 });
          scene.knight.position.x = 420;
          scene.fire.position.x = 560;
        }
        drag.phase = 'talk';
        drag.t = 0;
        drag.queue = (next.talk || []).slice();
      }
    }
  } else if (drag.phase === 'whiteout') {
    drag.white = Math.min(1, drag.white + 0.012);
    if (t % 24 === 0) playKnightB9Sting(8);
    if (t > 150) {
      drag.phase = 'black';
      drag.t = 0;
      if (typeof stopObsidianTombSounds === 'function') stopObsidianTombSounds();
    }
  } else if (drag.phase === 'black') {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const typeLine = (text, at, y, size, color) => {
      if (t < at) return;
      const typed = text.slice(0, Math.floor((t - at) / 4));
      ctx.save();
      ctx.font = `700 ${size}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.fillText(typed, canvas.width / 2, y);
      ctx.restore();
      if ((t - at) % 4 === 0 && typed.length < text.length && t > at) playTone({ frequency: 640, duration: 0.02, type: 'square', volume: 0.012 });
    };
    typeLine('Cargando...', 120, 280, 22, '#bdbdbd');
    typeLine('Introduciendo capitulo 7B', 300, 320, 22, '#e0e0e0');
    if (t > 560) {
      finishKnightB9Scene(true);
      return 'done';
    }
    return null;
  }
  drag.water += (drag.waterGoal - drag.water) * 0.03;
  if (drag.placeFade > 0) drag.placeFade = Math.max(0, drag.placeFade - 0.015);
  // ---------- drawing ----------
  ctx.save();
  if (drag.shake > 0) {
    drag.shake -= 1;
    ctx.translate((Math.random() - 0.5) * drag.shake, (Math.random() - 0.5) * drag.shake * 0.6);
  }
  const place = drag.place;
  if (place === 'surface') drawKnightB9Lake(time, 1, 1);
  else if (place === 'deep') drawKnightB9Deep(time, drag);
  else drawKnightB9Edge(time, drag);
  const knight = scene.knight;
  const fire = scene.fire;
  const fear = drag.round + 1;
  const floating = place !== 'surface';
  const bob = floating ? Math.sin(time * 1.5) * 10 : 0;
  // Knight, dragged: shaking more and more
  ctx.save();
  ctx.translate((Math.random() - 0.5) * fear * 1.1, bob - (floating ? 60 : 0));
  knight.knightKneel = false;
  knight.attacksToTheRight = true;
  knight.isAttacking = false;
  const kx = knight.position.x + knight.width / 2;
  ctx.translate(kx, ground);
  ctx.rotate((floating ? 0.4 : 0.12) + Math.sin(time * 9) * 0.03 * fear);
  ctx.translate(-kx, -ground);
  knight.draw();
  ctx.restore();
  // Fire Master: madder and madder (his fire still burns, even down there)
  ctx.save();
  ctx.translate((Math.random() - 0.5) * fear * 1.4, (Math.random() - 0.5) * fear * 0.7 + bob * 0.6 - (floating ? 60 : 0));
  fire.attacksToTheRight = drag.round >= 2 ? Math.sin(time * (2 + drag.round)) > 0 : true;
  fire.isAttacking = false;
  drawBizarreFireMaster(fire, 1);
  ctx.restore();
  // the chains of black fire, from his hand to Knight
  if (drag.chain > 0) {
    const fx = fire.position.x + 10;
    const fy = fire.position.y + 60 + bob * 0.6 - (floating ? 60 : 0);
    const tx = kx;
    const ty = knight.position.y + 60 + bob - (floating ? 60 : 0);
    const reach = drag.chain;
    ctx.save();
    for (let strand = 0; strand < 3; strand += 1) {
      ctx.strokeStyle = strand === 1 ? 'rgba(255, 87, 34, 0.9)' : 'rgba(20, 5, 8, 0.9)';
      ctx.lineWidth = strand === 1 ? 2 : 5;
      ctx.beginPath();
      for (let step = 0; step <= 20; step += 1) {
        const k = (step / 20) * reach;
        ctx.lineTo(fx + (tx - fx) * k, fy + (ty - fy) * k + Math.sin(time * 10 + step + strand * 2) * 6);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'lighter';
    if (reach >= 1) [0, 1, 2].forEach((ring) => drawFlametombFlame(tx - 20 + ring * 20, ty + 10 + ring * 14, 8, time * 12 + ring, 'outer'));
    ctx.restore();
  }
  // the water, climbing up them (on the surface)
  if (place === 'surface' && drag.water > 0.01) {
    const height = drag.water * (knight.height + 30);
    const top = ground - height;
    ctx.save();
    ctx.fillStyle = 'rgba(70, 30, 70, 0.62)';
    ctx.beginPath();
    ctx.moveTo(0, ground + 40);
    for (let x = 0; x <= canvas.width; x += 16) ctx.lineTo(x, top + Math.sin(time * 3 + x * 0.04) * 4);
    ctx.lineTo(canvas.width, ground + 40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 200, 160, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 16) ctx.lineTo(x, top + Math.sin(time * 3 + x * 0.04) * 4);
    ctx.stroke();
    ctx.restore();
  }
  if (place === 'deep' || (place === 'surface' && drag.water > 0.85)) {
    // bubbles from him
    for (let bubble = 0; bubble < 8; bubble += 1) {
      const rise = (time * 40 + bubble * 23) % 120;
      ctx.strokeStyle = 'rgba(220, 230, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(kx + Math.sin(time * 3 + bubble) * 8, knight.position.y + 20 - rise + bob - (floating ? 60 : 0), 3 + (bubble % 3), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (place === 'surface') drawKnightB9Shadows(time);
  // laughter, all over the screen, as he loses himself
  if (drag.round >= 2 && Math.random() < 0.015 * drag.round) drag.laughs.push({ x: 80 + Math.random() * (canvas.width - 160), y: 140 + Math.random() * 280, life: 50, size: 14 + Math.random() * 20 });
  drag.laughs.forEach((laugh) => {
    laugh.life -= 1;
    drawKnightB7Text(laugh.x, laugh.y, 'JA', `rgba(255, 23, 68, ${laugh.life / 50})`, 1, false, laugh.size);
  });
  drag.laughs = drag.laughs.filter((laugh) => laugh.life > 0);
  ctx.restore();
  // distortion: slices of the world sliding, a red ghost of everything
  if (drag.distort > 0) {
    for (let slice = 0; slice < Math.round(drag.distort * 14); slice += 1) {
      const sy = Math.random() * canvas.height;
      const h = 6 + Math.random() * 20;
      ctx.drawImage(canvas, 0, sy, canvas.width, h, (Math.random() - 0.5) * 80 * drag.distort, sy, canvas.width, h);
    }
    ctx.save();
    ctx.globalAlpha = 0.18 * drag.distort;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(canvas, 6 * drag.distort, 0);
    ctx.restore();
  }
  if (drag.placeFade > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${drag.placeFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (drag.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${drag.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drag.flash = Math.max(0, drag.flash - 0.04);
  }
  // the white: over the world... but not over the words and the choice
  if (drag.white > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${drag.white})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // what they say
  if (drag.line) drawKnightB9Box(drag.line, Math.min(drag.line.text.length, Math.floor(drag.line.t / 2)));
  // the choice
  if (drag.phase === 'choose' && (!drag.choice || drag.choice.round !== drag.round)) {
    drag.choice = { round: drag.round, options: round.frenzy || round.frenzyChoice ? ['MAS', 'MAS'] : ['SI', 'NO'], sel: 0, t: 0, done: false };
  }
  if (drag.phase === 'choose' && drag.choice) {
    const choice = drag.choice;
    const red = round.frenzy || round.frenzyChoice;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, canvas.height - 190, canvas.width, 150);
    drawKnightB7Text(canvas.width / 2, canvas.height - 150, round.question, red ? '#ff1744' : '#ffffff', 1, false, red ? 30 : 24);
    choice.options.forEach((label, index) => {
      const bx = canvas.width / 2 + (index === 0 ? -170 : 30);
      const by = canvas.height - 120;
      const selected = choice.sel === index;
      const morphing = index === 1 && choice.morphed && choice.morphT < 60;
      ctx.fillStyle = selected ? (red ? '#b71c1c' : '#ffffff') : 'rgba(30, 30, 36, 0.95)';
      ctx.fillRect(bx + (morphing ? (Math.random() - 0.5) * 10 : 0), by, 140, 48);
      ctx.strokeStyle = red ? '#ff1744' : '#e0e0e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, 140, 48);
      let text = label;
      if (morphing) text = Math.random() < 0.5 ? 'NO' : ['N#', 'M%S', 'MAS', '??'][Math.floor(Math.random() * 4)];
      ctx.font = "900 22px 'Courier New', monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = selected && !red ? '#111' : '#ffffff';
      ctx.fillText(text, bx + 70, by + 32);
    });
    if (!red) drawKnightB7Text(canvas.width / 2, canvas.height - 50, 'A / D elegir  -  ENTER confirmar', '#9e9e9e', 0.8, false, 12);
    ctx.restore();
  }
  return null;
}

// the cemetery of Robledal: a grey sky, a big stone in the middle and a stone for each of them
const knightB9Graves = [
  { x: 120, name: 'SHERIFF' }, { x: 210, name: 'CELESTE' }, { x: 300, name: 'SETO' }, { x: 660, name: 'CHEF' },
  { x: 740, name: 'MOCHI' }, { x: 830, name: 'GUARDIA' }, { x: 920, name: '' },
];

function drawKnightB9Funeral(time, t, behindStones) {
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#4a5060');
  sky.addColorStop(1, '#9aa0aa');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let band = 0; band < 3; band += 1) {
    ctx.fillStyle = `rgba(${60 + band * 15}, ${64 + band * 15}, ${75 + band * 15}, 0.7)`;
    for (let cloud = -1; cloud < 7; cloud += 1) {
      ctx.beginPath();
      ctx.ellipse(((cloud * 200 + band * 60 + time * (4 + band * 2)) % (width + 300)) - 150, 30 + band * 40, 160, 34, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // the hill and a bare tree
  ctx.fillStyle = '#56624f';
  ctx.beginPath();
  ctx.moveTo(0, ground - 70);
  ctx.quadraticCurveTo(width / 2, ground - 140, width, ground - 60);
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.fill();
  ctx.strokeStyle = '#2f2a2a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(60, ground - 70);
  ctx.lineTo(70, ground - 230);
  ctx.moveTo(68, ground - 170);
  ctx.lineTo(20, ground - 230);
  ctx.moveTo(70, ground - 200);
  ctx.lineTo(120, ground - 260);
  ctx.stroke();
  ctx.fillStyle = '#4b5747';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  if (behindStones) behindStones();
  // the small stones, each with its name, a candle and a flower
  knightB9Graves.forEach((grave, index) => {
    const gx = grave.x;
    ctx.fillStyle = '#8b8f94';
    ctx.fillRect(gx - 22, ground - 62, 44, 62);
    ctx.beginPath();
    ctx.arc(gx, ground - 62, 22, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#5c6066';
    ctx.lineWidth = 2;
    ctx.strokeRect(gx - 22, ground - 62, 44, 62);
    ctx.fillStyle = '#3e4146';
    ctx.font = "700 9px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(grave.name || '...', gx, ground - 44);
    ctx.fillRect(gx - 1, ground - 78, 2, 12);
    ctx.fillRect(gx - 6, ground - 74, 12, 2);
    const flame = 0.6 + Math.sin(time * 8 + index) * 0.25;
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(gx + 14, ground - 12, 4, 10);
    ctx.fillStyle = `rgba(255, 183, 77, ${flame})`;
    ctx.beginPath();
    ctx.ellipse(gx + 16, ground - 16, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ['#f48fb1', '#90caf9', '#fff59d'][index % 3];
    ctx.beginPath();
    ctx.arc(gx - 14, ground - 6, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  // the big stone in the middle: for all of them
  ctx.fillStyle = '#a3a7ad';
  ctx.fillRect(520, ground - 120, 120, 120);
  ctx.beginPath();
  ctx.moveTo(520, ground - 120);
  ctx.lineTo(580, ground - 150);
  ctx.lineTo(640, ground - 120);
  ctx.fill();
  ctx.strokeStyle = '#6b6f75';
  ctx.lineWidth = 3;
  ctx.strokeRect(520, ground - 120, 120, 120);
  ctx.fillStyle = '#3e4146';
  ctx.font = "900 12px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('ROBLEDAL', 580, ground - 92);
  ctx.font = "700 9px 'Courier New', monospace";
  ctx.fillText('NO LOS OLVIDAMOS', 580, ground - 74);
  // the children's drawing of the knight, leaning against it
  ctx.save();
  ctx.translate(624, ground - 18);
  ctx.rotate(0.12);
  ctx.fillStyle = '#ffccbc';
  ctx.fillRect(-12, -10, 24, 20);
  ctx.strokeStyle = '#1e88e5';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-4, -7, 8, 13);
  ctx.restore();
  ctx.textAlign = 'left';
  // a grey veil
  ctx.fillStyle = 'rgba(40, 44, 54, 0.18)';
  ctx.fillRect(0, 0, width, canvas.height);
}
