// ================= SIDEB: the code that opens the B side of the roster =================
// Typing "SideB" in the menu adds the faces of route B to character select:
// Sorcerer's three magic minions, Knight B (burnt, no shield, broken sword), Light Warrior B
// (his face in the shadow, his cape in the wind) and the bizarre Fire Master of the bunker.
const sideBRoster = [
  { id: 'minionRed', name: 'Esbirro Rojo', type: 'sorcerer', variant: 'arcaneMinion', color: '#e53935' },
  { id: 'minionBlue', name: 'Esbirro Azul', type: 'sorcerer', variant: 'arcaneMinion', color: '#1e88e5' },
  { id: 'minionPurple', name: 'Esbirro Violeta', type: 'sorcerer', variant: 'arcaneMinion', color: '#8e24aa' },
  { id: 'minionYellow', name: 'Esbirro Amarillo', type: 'sorcerer', variant: 'arcaneMinion', color: '#ffb300' },
  { id: 'minionGreen', name: 'Esbirro Verde', type: 'sorcerer', variant: 'arcaneMinion', color: '#43a047' },
  { id: 'minionCyan', name: 'Esbirro Cian', type: 'sorcerer', variant: 'arcaneMinion', color: '#00acc1' },
  { id: 'knightB', name: 'Knight B', type: 'normal', variant: 'knight' },
  { id: 'lightWarriorB', name: 'Light Warrior B', type: 'lightWarrior', variant: 'omega' },
  { id: 'bizarre', name: 'Fire Master Bizarro', type: 'fireMaster', variant: 'frostFire' },
];
const sideBMinionR = {
  minionRed: { name: 'Estallido carmesi', cooldown: 300 },
  minionBlue: { name: 'Lluvia de esferas', cooldown: 300 },
  minionPurple: { name: 'Vacio', cooldown: 320 },
  minionYellow: { name: 'Rayo arcano', cooldown: 280 },
  minionGreen: { name: 'Raices', cooldown: 300 },
  minionCyan: { name: 'Ola de escarcha', cooldown: 280 },
};
// Knight B, as in chapter 5B level 7: he comes in half dead; at 1 HP he refuses to fall
const sideBKnightStandLimit = 12;
// Light Warrior B: stronger than the normal one... and his Omega, closer to the one of "Sin perdon"
const sideBLwHealth = 240;
const sideBLwDamage = 1.35;
const sideBLwOmegaHealth = 3000;
const sideBLwOmegaDamage = 1.7;
const sideBOrbCooldown = 90;
const sideBBlinkCooldown = 150;
let sideBCodeActive = false;
const sideBButtons = [];
const sideBPreviews = {};
let sideBFx = [];

function getSideBEntry(fighter) {
  return fighter && fighter.sideB ? sideBRoster.find((entry) => entry.id === fighter.sideB) || null : null;
}

function isSideBMinion(fighter) {
  return Boolean(fighter && fighter.sideB && sideBMinionR[fighter.sideB] && fighter.secretVariant === 'arcaneMinion');
}

// ---------- the buttons ----------
(function buildSideBButtons() {
  // (at the end of the roster)
  const anchor = document.getElementById('normalCharacterButton');
  const options = anchor ? anchor.parentElement.querySelectorAll(':scope > .character-option') : [];
  let after = options.length ? options[options.length - 1] : null;
  if (!after) return;
  sideBRoster.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-option sideb-option hidden';
    button.dataset.sideB = entry.id;
    button.innerHTML = `<span>${entry.name}</span><span class="character-preview sideb-preview" aria-hidden="true"></span>`;
    button.addEventListener('click', () => pickSideBCharacter(entry));
    after.insertAdjacentElement('afterend', button);
    after = button;
    sideBButtons.push(button);
  });
})();

// what makes each one of them what it is (on the fighter, after the normal pick)
function applySideBLook(fighter, entry) {
  fighter.sideB = entry.id;
  fighter.sideBEndured = false;
  if (entry.color) fighter.minionColor = entry.color;
  if (entry.id === 'bizarre') {
    fighter.frostFire = true;
    fighter.frostFire2 = true;
    fighter.obsidian = false;
    fighter.obsidianControl = true;
    fighter.miniFlametomb = true;
    fighter.knightBBizarre = true;
  }
  if (entry.id === 'lightWarriorB') fighter.capeWind = true;
}

// their stats, every fight (the normal reset takes some of their things away)
function prepareSideBFighter(fighter) {
  const entry = getSideBEntry(fighter);
  if (!entry) return;
  if (normalArcadeActive) {
    clearSideBFighter(fighter);
    return;
  }
  applySideBLook(fighter, entry);
  fighter.sideBBlinkGuard = 0;
  fighter.sideBOrbCooldown = 0;
  fighter.sideBBlinkCooldown = 0;
  fighter.sideBRCooldown = 0;
  fighter.knightBRiftCooldown = 0;
  if (isSideBMinion(fighter)) {
    fighter.setMaxHealth(95);
    fighter.damageMultiplier = 0.9;
  } else if (entry.id === 'knightB') {
    // as in the arcade: burnt, no shield, half a sword... and he comes out of the bunker half dead
    fighter.setMaxHealth(fighter.sideBBaseHealth || fighter.maxHealth);
    fighter.damageMultiplier = 1;
    fighter.moveSpeed = playerMoveSpeed;
    fighter.knightKneel = false;
    fighter.sideBLastStand = false;
    fighter.sideBWeak = 0;
    fighter.sideBLine = null;
    fighter.sideBBanner = 0;
    fighter.knightB7GauntletCd = 0;
    fighter.knightB7OathCd = 0;
    fighter.knightLungeCooldown = 0;
    fighter.health = Math.round(fighter.maxHealth * 0.45);
    return;
  } else if (entry.id === 'lightWarriorB') {
    fighter.sideBOmegaApplied = false;
    fighter.setMaxHealth(sideBLwHealth);
    fighter.damageMultiplier = sideBLwDamage;
  } else if (entry.id === 'bizarre') {
    fighter.setMaxHealth(150);
    fighter.damageMultiplier = 1.25;
    fighter.miniFlametombCooldown = 0;
  }
  fighter.health = fighter.maxHealth;
}

function clearSideBFighter(fighter) {
  if (!fighter || !fighter.sideB) return;
  if (fighter.sideB === 'bizarre') fighter.knightBBizarre = false;
  if (fighter.sideB === 'lightWarriorB') fighter.capeWind = false;
  if (fighter.sideB === 'knightB') {
    fighter.moveSpeed = playerMoveSpeed;
    fighter.knightKneel = false;
  }
  fighter.sideB = null;
  fighter.sideBEndured = false;
  fighter.sideBLastStand = false;
  fighter.sideBWeak = 0;
  fighter.sideBBlinkGuard = 0;
}

function pickSideBCharacter(entry) {
  if (!sideBCodeActive || normalArcadeActive) return;
  const fighter = characterSelectionPlayer === 1 ? player1 : player2;
  // (the code opens them: the usual locks do not apply)
  const saved = {
    bosses: arcadeBossesUnlocked,
    lw: window.isLightWarriorUnlocked,
    knight: window.isKnightUnlocked,
    rift: window.isRiftLostCharacter,
    blind: blindMode,
  };
  arcadeBossesUnlocked = true;
  window.isLightWarriorUnlocked = () => true;
  window.isKnightUnlocked = () => true;
  if (typeof saved.rift === 'function') window.isRiftLostCharacter = () => false;
  blindMode = false;
  const before = characterSelectionPlayer;
  try {
    selectCharacter(entry.type, entry.variant);
  } finally {
    arcadeBossesUnlocked = saved.bosses;
    window.isLightWarriorUnlocked = saved.lw;
    window.isKnightUnlocked = saved.knight;
    if (typeof saved.rift === 'function') window.isRiftLostCharacter = saved.rift;
    blindMode = saved.blind;
  }
  // (the pick did not go through)
  if (fighter.characterType !== entry.type || (entry.variant && fighter.secretVariant !== entry.variant)) return;
  fighter.sideBBaseHealth = fighter.maxHealth;
  fighter.sideBBaseDamage = fighter.damageMultiplier || 1;
  applySideBLook(fighter, entry);
  playSideBPickSound(entry, before);
}

function playSideBPickSound(entry) {
  if (entry.id === 'knightB') {
    playTone({ frequency: 110, duration: 0.6, type: 'sawtooth', volume: 0.04, slideTo: 70 });
  } else if (entry.id === 'lightWarriorB') {
    playTone({ frequency: 520, duration: 0.5, type: 'triangle', volume: 0.04, slideTo: 260 });
  } else if (entry.id === 'bizarre') {
    playTone({ frequency: 180, duration: 0.5, type: 'square', volume: 0.03, slideTo: 90 });
    playTone({ frequency: 1300, duration: 0.3, type: 'triangle', volume: 0.02, slideTo: 1900 });
  } else {
    playTone({ frequency: 660, duration: 0.25, type: 'sine', volume: 0.04, slideTo: 990 });
  }
}

// ---------- the previews (drawn with the real drawings, once) ----------
function buildSideBPreviews() {
  let saved = null;
  try {
    saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    return;
  }
  const thumb = document.createElement('canvas');
  thumb.width = 140;
  thumb.height = 168;
  const thumbCtx = thumb.getContext('2d');
  sideBButtons.forEach((button) => {
    const entry = sideBRoster.find((item) => item.id === button.dataset.sideB);
    if (!entry) return;
    try {
      if (!sideBPreviews[entry.id]) {
        const actor = new Fighter({ x: 0, y: 0, color: '#9e9e9e', attacksToTheRight: true });
        actor.setCharacterType(entry.type, entry.variant);
        applySideBLook(actor, entry);
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        actor.position = { x: 400, y: 300 - actor.height };
        actor.attacksToTheRight = true;
        actor.isAttacking = false;
        actor.draw();
        ctx.restore();
        const box = { x: 360, y: 300 - actor.height - 40, width: actor.width + 80, height: actor.height + 50 };
        const scale = Math.min(thumb.width / box.width, thumb.height / box.height);
        thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
        thumbCtx.drawImage(canvas, box.x, box.y, box.width, box.height, (thumb.width - box.width * scale) / 2, thumb.height - box.height * scale, box.width * scale, box.height * scale);
        sideBPreviews[entry.id] = thumb.toDataURL();
      }
      const preview = button.querySelector('.sideb-preview');
      preview.style.backgroundImage = `url(${sideBPreviews[entry.id]})`;
      preview.style.backgroundSize = 'contain';
      preview.style.backgroundRepeat = 'no-repeat';
      preview.style.backgroundPosition = 'center bottom';
    } catch (error) {
      // (without a preview the button still works)
    }
  });
  ctx.putImageData(saved, 0, 0);
}

function syncSideBButtons() {
  sideBButtons.forEach((button) => {
    button.classList.toggle('hidden', !sideBCodeActive);
    button.disabled = !sideBCodeActive || normalArcadeActive;
    button.classList.toggle('arcade-disabled', normalArcadeActive);
  });
  if (typeof buildSideBMapButtons === 'function') {
    buildSideBMapButtons();
    document.querySelectorAll('.sideb-map').forEach((button) => button.classList.toggle('hidden', !sideBCodeActive));
  }
}

function unlockSideBCode() {
  sideBCodeActive = true;
  if (typeof unlockAchievement === 'function') unlockAchievement('codeBreaker');
  syncSideBButtons();
  buildSideBPreviews();
  buildSideBMapPreviews();
  showCustomToast('SIDE B', 'La otra cara de la historia ya se puede elegir: los seis Esbirros Arcanos, Knight B (tal como en "Un verdadero heroe": quemado, sin escudo, media espada... y a 1 de vida se niega a caer), Light Warrior B (mas fuerte, y con su propio Omega: dos habilidades a la vez) y el Fire Master Bizarro. Y sus lugares: la biblioteca, el bosque sin luz, el bunker, la plataforma... (y el techo del farol, con Light Warrior B, tiene otro cielo).');
  playTone({ frequency: 98, duration: 1.6, type: 'sawtooth', volume: 0.05, slideTo: 49 });
  playTone({ frequency: 1567, duration: 0.6, type: 'triangle', volume: 0.025, slideTo: 784 });
}

function lockSideBCode() {
  sideBCodeActive = false;
  syncSideBButtons();
  if (!normalArcadeActive && isSideBMap(selectedMap)) selectedMap = 'foundry';
  clearSideBFighter(player1);
  clearSideBFighter(player2);
}

// ---------- the minions' Q / F / R ----------
function getSideBDirection(fighter, target) {
  if (!target) return fighter.attacksToTheRight ? 1 : -1;
  return getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
}

function castSideBOrb(fighter, target) {
  if (fighter.sideBOrbCooldown > 0) return false;
  const direction = getSideBDirection(fighter, target);
  sideBFx.push({ kind: 'orb', owner: fighter, x: getFighterCenterX(fighter) + direction * 26, y: fighter.position.y + 24, vx: direction * 8, life: 110, color: fighter.minionColor, damage: 8 });
  fighter.sideBOrbCooldown = getDebugCooldown(sideBOrbCooldown, fighter);
  recordSpecialUsed(fighter);
  playTone({ frequency: 740, duration: 0.18, type: 'sine', volume: 0.04, slideTo: 1100 });
  return true;
}

function castSideBBlink(fighter, target) {
  if (fighter.sideBBlinkCooldown > 0) return false;
  const direction = fighter.attacksToTheRight ? 1 : -1;
  const fromX = getFighterCenterX(fighter);
  fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + direction * 190));
  fighter.velocity.x = 0;
  fighter.sideBBlinkGuard = 14;
  sideBFx.push({ kind: 'puff', x: fromX, y: fighter.position.y + fighter.height / 2, life: 22, color: fighter.minionColor });
  sideBFx.push({ kind: 'puff', x: getFighterCenterX(fighter), y: fighter.position.y + fighter.height / 2, life: 16, color: fighter.minionColor });
  fighter.sideBBlinkCooldown = getDebugCooldown(sideBBlinkCooldown, fighter);
  recordSpecialUsed(fighter);
  playTone({ frequency: 1200, duration: 0.15, type: 'triangle', volume: 0.03, slideTo: 300 });
  return true;
}

function castSideBR(fighter, target) {
  const power = sideBMinionR[fighter.sideB];
  if (!power || fighter.sideBRCooldown > 0) return false;
  const color = fighter.minionColor;
  const cx = getFighterCenterX(fighter);
  if (fighter.sideB === 'minionRed') {
    // a ring of red fire around it
    sideBFx.push({ kind: 'burst', owner: fighter, x: cx, y: fighter.position.y + fighter.height / 2, radius: 10, life: 26, color, hit: false });
    playNoise({ duration: 0.35, volume: 0.06, filterFrequency: 700 });
    playTone({ frequency: 160, duration: 0.4, type: 'sawtooth', volume: 0.04, slideTo: 60 });
  } else if (fighter.sideB === 'minionBlue') {
    // three spheres falling over the rival
    [0, 18, 36].forEach((delay, index) => {
      sideBFx.push({ kind: 'drop', owner: fighter, x: getFighterCenterX(target) + (index - 1) * 50, y: -30 - index * 10, vy: 0, wait: delay, life: 140, color, damage: 7 });
    });
    playTone({ frequency: 880, duration: 0.6, type: 'sine', volume: 0.035, slideTo: 440 });
  } else if (fighter.sideB === 'minionYellow') {
    // a bolt from above, where the rival stands (a moment to dodge it)
    sideBFx.push({ kind: 'bolt', owner: fighter, x: getFighterCenterX(target), warn: 32, life: 16, color, damage: 15, hit: false });
    playTone({ frequency: 1800, duration: 0.5, type: 'square', volume: 0.025, slideTo: 2400 });
  } else if (fighter.sideB === 'minionGreen') {
    // roots crawling along the floor: whoever they catch stays rooted
    const direction = getSideBDirection(fighter, target);
    sideBFx.push({ kind: 'roots', owner: fighter, x: cx + direction * 20, from: cx, dir: direction, life: 70, color, damage: 10, hit: false });
    playNoise({ duration: 0.5, volume: 0.04, filterFrequency: 300 });
  } else if (fighter.sideB === 'minionCyan') {
    // a wave of frost along the ground: it slows down
    const direction = getSideBDirection(fighter, target);
    sideBFx.push({ kind: 'frost', owner: fighter, x: cx + direction * 30, dir: direction, life: 80, color, damage: 9, hit: false });
    playTone({ frequency: 1400, duration: 0.6, type: 'triangle', volume: 0.03, slideTo: 500 });
  } else {
    // a void in front of it: it pulls... and then closes
    const direction = getSideBDirection(fighter, target);
    sideBFx.push({ kind: 'void', owner: fighter, x: Math.max(40, Math.min(canvas.width - 40, cx + direction * 150)), y: ground - 70, life: 70, color, damage: 12 });
    playTone({ frequency: 70, duration: 1.1, type: 'sine', volume: 0.06, slideTo: 40 });
  }
  fighter.sideBRCooldown = getDebugCooldown(power.cooldown, fighter);
  recordSpecialUsed(fighter);
  return true;
}

function sideBHit(owner, target, damage, push) {
  if (!target || target === owner || gameOver) return false;
  if (typeof handleCopycatShieldHit === 'function' && handleCopycatShieldHit(target, owner)) return true;
  applyDamage(owner, target, damage, { isSpecial: true });
  if (push) {
    target.velocity.x = push.x;
    if (push.y) target.velocity.y = push.y;
  }
  playSound('robotHit');
  return true;
}

function updateSideBFx() {
  const running = gameStarted && !gameOver && !(typeof arcadeCutscene !== 'undefined' && arcadeCutscene.active);
  [player1, player2].forEach((fighter) => {
    if (!fighter.sideB) return;
    ['sideBOrbCooldown', 'sideBBlinkCooldown', 'sideBRCooldown', 'sideBBlinkGuard'].forEach((key) => {
      if (fighter[key] > 0) fighter[key] -= 1;
    });
  });
  if (running) {
    sideBFx.forEach((fx) => {
      const target = fx.owner ? getOpponent(fx.owner) : null;
      if (fx.kind === 'orb') {
        fx.x += fx.vx;
        fx.life -= 1;
        if (target && rectangularCollision({ rectangle1: { x: fx.x - 12, y: fx.y - 12, width: 24, height: 24 }, rectangle2: target })) {
          fx.life = 0;
          sideBHit(fx.owner, target, fx.damage, { x: Math.sign(fx.vx) * 4 });
        }
      } else if (fx.kind === 'burst') {
        fx.radius += 7;
        fx.life -= 1;
        if (!fx.hit && target) {
          const dx = getFighterCenterX(target) - fx.x;
          const dy = target.position.y + target.height / 2 - fx.y;
          if (Math.hypot(dx, dy) < fx.radius + 30) {
            fx.hit = true;
            sideBHit(fx.owner, target, 14, { x: Math.sign(dx || 1) * 9, y: -7 });
          }
        }
      } else if (fx.kind === 'drop') {
        if (fx.wait > 0) {
          fx.wait -= 1;
        } else {
          fx.vy += 0.6;
          fx.y += fx.vy;
          fx.life -= 1;
          if (target && rectangularCollision({ rectangle1: { x: fx.x - 14, y: fx.y - 14, width: 28, height: 28 }, rectangle2: target })) {
            fx.life = 0;
            sideBHit(fx.owner, target, fx.damage, null);
          } else if (fx.y > ground) {
            fx.life = 0;
            sideBFx.push({ kind: 'puff', x: fx.x, y: ground - 6, life: 14, color: fx.color });
          }
        }
      } else if (fx.kind === 'void') {
        fx.life -= 1;
        if (target && fx.life > 12) {
          const dx = fx.x - getFighterCenterX(target);
          if (Math.abs(dx) < 300) target.position.x += Math.sign(dx) * Math.min(3.2, Math.abs(dx) * 0.08);
        }
        if (fx.life === 12 && target) {
          if (Math.abs(getFighterCenterX(target) - fx.x) < 90) sideBHit(fx.owner, target, fx.damage, { x: 0, y: -9 });
          playNoise({ duration: 0.3, volume: 0.06, filterFrequency: 400 });
        }
      } else if (fx.kind === 'bolt') {
        if (fx.warn > 0) {
          fx.warn -= 1;
          if (fx.warn === 0) playNoise({ duration: 0.25, volume: 0.07, filterFrequency: 3000 });
        } else {
          fx.life -= 1;
          if (!fx.hit && target && Math.abs(getFighterCenterX(target) - fx.x) < 40) {
            fx.hit = true;
            sideBHit(fx.owner, target, fx.damage, { x: 0, y: -6 });
          }
        }
      } else if (fx.kind === 'roots') {
        fx.x += fx.dir * 9;
        fx.life -= 1;
        if (!fx.hit && target && Math.abs(getFighterCenterX(target) - fx.x) < 30 && target.position.y + target.height > ground - 20) {
          fx.hit = true;
          fx.life = Math.min(fx.life, 50);
          fx.dir = 0;
          target.sideBRooted = 70;
          sideBHit(fx.owner, target, fx.damage, null);
        }
      } else if (fx.kind === 'frost') {
        fx.x += fx.dir * 10;
        fx.life -= 1;
        if (!fx.hit && target && Math.abs(getFighterCenterX(target) - fx.x) < 34 && target.position.y + target.height > ground - 50) {
          fx.hit = true;
          target.sideBChilled = 150;
          sideBHit(fx.owner, target, fx.damage, { x: fx.dir * 3 });
        }
      } else {
        fx.life -= 1;
      }
    });
    // rooted / chilled
    [player1, player2].forEach((fighter) => {
      if (fighter.sideBRooted > 0) {
        fighter.sideBRooted -= 1;
        fighter.velocity.x = 0;
      }
      if (fighter.sideBChilled > 0) {
        fighter.sideBChilled -= 1;
        fighter.velocity.x *= 0.5;
      }
    });
    sideBFx = sideBFx.filter((fx) => (fx.life > 0 || fx.warn > 0) && fx.x > -60 && fx.x < canvas.width + 60);
    // the bot uses them too
    const bot = player2;
    if (botEnabled && isSideBMinion(bot) && canFighterAct(bot) && Math.random() < 0.02) {
      const distance = Math.abs(getFighterCenterX(bot) - getFighterCenterX(player1));
      const options = [];
      if (!(bot.sideBOrbCooldown > 0) && distance > 140) options.push(() => castSideBOrb(bot, player1));
      if (!(bot.sideBRCooldown > 0)) options.push(() => castSideBR(bot, player1));
      if (!(bot.sideBBlinkCooldown > 0) && distance < 90 && bot.health < bot.maxHealth * 0.6) options.push(() => castSideBBlink(bot, player1));
      if (options.length) options[Math.floor(Math.random() * options.length)]();
    }
  } else if (!gameStarted) {
    sideBFx = [];
  }
  drawSideBFx();
}

function drawSideBFx() {
  if (!sideBFx.length) return;
  const time = performance.now() / 1000;
  ctx.save();
  sideBFx.forEach((fx) => {
    const color = fx.color || '#8e24aa';
    if (fx.kind === 'orb' || (fx.kind === 'drop' && fx.wait <= 0)) {
      const glow = ctx.createRadialGradient(fx.x, fx.y, 2, fx.x, fx.y, 22);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.4, color);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(fx.x - 22, fx.y - 22, 44, 44);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, 9, 0, Math.PI * 2);
      ctx.fill();
    } else if (fx.kind === 'drop') {
      // (where it will fall)
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(fx.x, ground - 2, 18, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (fx.kind === 'burst') {
      ctx.strokeStyle = color;
      ctx.globalAlpha = Math.max(0, fx.life / 26);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffcc80';
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, fx.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (fx.kind === 'void') {
      const size = fx.life > 12 ? 46 + Math.sin(time * 14) * 4 : 46 * (fx.life / 12) + 30 * (1 - fx.life / 12);
      const hole = ctx.createRadialGradient(fx.x, fx.y, 2, fx.x, fx.y, size);
      hole.addColorStop(0, '#000000');
      hole.addColorStop(0.55, '#12001f');
      hole.addColorStop(0.8, color);
      hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = hole;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea80fc';
      ctx.lineWidth = 2;
      for (let arm = 0; arm < 3; arm += 1) {
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, size * 0.7, time * 6 + arm * 2.1, time * 6 + arm * 2.1 + 1.1);
        ctx.stroke();
      }
    } else if (fx.kind === 'bolt') {
      if (fx.warn > 0) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4 + Math.sin(time * 30) * 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(fx.x, ground - 2, 36, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = Math.max(0, fx.life / 16);
        ctx.strokeStyle = '#fffde7';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(fx.x, 0);
        for (let step = 1; step <= 8; step += 1) ctx.lineTo(fx.x + Math.sin(step * 2.7 + fx.life) * 18, (ground / 8) * step);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    } else if (fx.kind === 'roots') {
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 5;
      ctx.globalAlpha = Math.min(1, fx.life / 15);
      const reach = fx.x - fx.from;
      ctx.beginPath();
      ctx.moveTo(fx.from, ground);
      for (let step = 1; step <= 10; step += 1) {
        const rx = fx.from + (reach * step) / 10;
        ctx.lineTo(rx, ground - 4 - Math.abs(Math.sin(rx * 0.2)) * 10);
      }
      ctx.stroke();
      ctx.fillStyle = color;
      for (let tip = 0; tip < 3; tip += 1) {
        ctx.beginPath();
        ctx.moveTo(fx.x - 6 + tip * 6, ground);
        ctx.lineTo(fx.x - 3 + tip * 6, ground - 26 - tip * 6);
        ctx.lineTo(fx.x + tip * 6, ground);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (fx.kind === 'frost') {
      ctx.globalAlpha = Math.min(1, fx.life / 15);
      for (let spike = 0; spike < 5; spike += 1) {
        const sx = fx.x - fx.dir * spike * 12;
        const tall = 34 - spike * 6;
        ctx.fillStyle = spike % 2 ? color : '#e0f7fa';
        ctx.beginPath();
        ctx.moveTo(sx - 7, ground);
        ctx.lineTo(sx, ground - tall);
        ctx.lineTo(sx + 7, ground);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (fx.kind === 'puff') {
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, fx.life / 22) * 0.7;
      for (let bit = 0; bit < 6; bit += 1) {
        const angle = bit * 1.05 + fx.life * 0.2;
        const spread = (22 - fx.life) * 2.2;
        ctx.beginPath();
        ctx.arc(fx.x + Math.cos(angle) * spread, fx.y + Math.sin(angle) * spread, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  });
  ctx.restore();
}

// ---------- Knight B: the same abilities as in "Un verdadero heroe" ----------
// Q: Estocada rota; F: Guantelete volador; R: Juramento (no shield anymore)
function castSideBKnightGauntlet(fighter, target) {
  if ((fighter.knightB7GauntletCd || 0) > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.attacksToTheRight = direction > 0;
  knightB7.gauntlets.push({ x: getFighterCenterX(fighter) + direction * 30, y: fighter.position.y + 56, dir: direction, out: 0, back: false, hit: false, owner: fighter, target });
  fighter.knightB7GauntletCd = Math.round(getDebugCooldown(knightB7GauntletCooldown, fighter) * getSideBKnightSlowness(fighter));
  recordSpecialUsed(fighter);
  playTone({ frequency: 300, duration: 0.25, type: 'square', volume: 0.04, slideTo: 600 });
  return true;
}

function castSideBKnightOath(fighter, target) {
  if ((fighter.knightB7OathCd || 0) > 0) return false;
  knightB7.pillars.push({ x: getFighterCenterX(target), warn: 40, life: 26, hit: false, owner: fighter, target });
  fighter.knightB7OathCd = Math.round(getDebugCooldown(knightB7OathCooldown, fighter) * getSideBKnightSlowness(fighter));
  fighter.velocity.x = 0;
  fighter.knightGlow = 30;
  recordSpecialUsed(fighter);
  playTone({ frequency: 520, duration: 0.6, type: 'triangle', volume: 0.05, slideTo: 1040 });
  return true;
}

function getSideBKnightSlowness(fighter) {
  return 1 + (fighter.sideBWeak || 0) * 0.12;
}

function saySideBKnight(fighter, text, color, life = 110) {
  fighter.sideBLine = { text, color, life, max: life };
}

// at 1 HP he will not fall: every blow after that makes him weaker and slower... until he cannot stand
function sideBKnightRefuse(fighter) {
  fighter.health = 1;
  if (!fighter.sideBLastStand) {
    fighter.sideBLastStand = true;
    fighter.sideBBanner = 160;
    saySideBKnight(fighter, '...Nadie esta mirando... Por eso tengo que hacerlo yo.', '#90caf9', 170);
    playTone({ frequency: 220, duration: 1, type: 'sawtooth', volume: 0.05, slideTo: 440 });
    if (typeof spawnKnightBSparks === 'function') spawnKnightBSparks(getFighterCenterX(fighter), fighter.position.y + fighter.height / 2, 24, 1.3);
  } else {
    fighter.sideBWeak += 1;
    fighter.moveSpeed = playerMoveSpeed * Math.max(0.25, 1 - fighter.sideBWeak * 0.09);
    saySideBKnight(fighter, knightB7StandLines[Math.min(knightB7StandLines.length - 1, fighter.sideBWeak - 1)], '#90caf9');
    playTone({ frequency: 70, duration: 0.4, type: 'sine', volume: 0.06 });
  }
  updateHealthBars();
}

function updateSideBKnights(running) {
  const knights = [player1, player2].filter((fighter) => fighter.sideB === 'knightB' && fighter.secretVariant === 'knight');
  if (!knights.length || (typeof isKnightB7Fight === 'function' && isKnightB7Fight())) return;
  if (running) {
    // (the chapter's own update only counts down player 1)
    ['knightB7GauntletCd', 'knightB7OathCd'].forEach((key) => {
      if (player2[key] > 0) player2[key] -= 1;
    });
    updateKnightB7Abilities();
  }
  knights.forEach((fighter) => {
    if (fighter.sideBLine) {
      const line = fighter.sideBLine;
      line.life -= 1;
      const alpha = Math.min(1, line.life / 20, (line.max - line.life) / 10 + 0.2);
      drawKnightB7Text(getFighterCenterX(fighter), fighter.position.y - 22, line.text, line.color, alpha, true);
      if (line.life <= 0) fighter.sideBLine = null;
    }
    if (fighter.sideBBanner > 0) {
      fighter.sideBBanner -= 1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, fighter.sideBBanner / 30, (160 - fighter.sideBBanner) / 15);
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
  });
}

// the faint blue light that refuses to go out
function drawSideBKnightStand(fighter) {
  if (!fighter.sideBLastStand) return;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const time = performance.now() / 1000;
  const pulse = (0.25 + Math.sin(time * 4) * 0.1) * Math.max(0.2, 1 - (fighter.sideBWeak || 0) / sideBKnightStandLimit);
  ctx.save();
  const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, 90);
  glow.addColorStop(0, `rgba(128, 216, 255, ${pulse})`);
  glow.addColorStop(1, 'rgba(128, 216, 255, 0)');
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(x - 70, y - 40, w + 140, h + 80);
  ctx.restore();
}

// ---------- Light Warrior B: his Omega, with the aura of "Sin perdon" ----------
function updateSideBLightWarriors() {
  [player1, player2].forEach((fighter) => {
    if (fighter.sideB !== 'lightWarriorB' || fighter.characterType !== 'lightWarrior') return;
    if (fighter.lightWarriorOmegaTransformed && !fighter.sideBOmegaApplied) {
      fighter.sideBOmegaApplied = true;
      fighter.setMaxHealth(sideBLwOmegaHealth);
      fighter.health = fighter.maxHealth;
      fighter.damageMultiplier = sideBLwOmegaDamage;
      updateHealthBars();
    } else if (!fighter.lightWarriorOmegaTransformed && fighter.sideBOmegaApplied) {
      // (the Omega wears off: back to the B side, not to the normal one)
      fighter.sideBOmegaApplied = false;
      const ratio = fighter.health / Math.max(1, fighter.maxHealth);
      fighter.setMaxHealth(sideBLwHealth);
      fighter.health = Math.max(1, Math.round(sideBLwHealth * Math.max(ratio, 0.5)));
      fighter.damageMultiplier = sideBLwDamage;
      updateHealthBars();
    }
  });
}

function drawSideBOmegaAura(fighter, layer) {
  if (typeof drawKnightB8OmegaAura !== 'function') return;
  // (always his own colors, never the moods of the farol)
  const moods = knightB8.omegaMoods;
  knightB8.omegaMoods = isSideBFarol() ? sideBFarol.moods : { normal: 1 };
  try {
    drawKnightB8OmegaAura(fighter, layer);
  } finally {
    knightB8.omegaMoods = moods;
  }
}

// ---------- the maps of route B ----------
// (two of them are the chapter's places "as they were": the dark forest and the refuge, without anyone inside)
const sideBMaps = [
  ['cobaltEdge', 'Borde de Cobalto'], ['sorcererLibrary', 'Biblioteca de Sorcerer'], ['burningLibrary', 'Biblioteca en Llamas'],
  ['sideBForest', 'Bosque sin Luz'], ['farolBridge', 'Puente al Farol'], ['robledalBunkerOut', 'Afueras del Bunker'],
  ['robledalBunkerHall', 'Pasillo del Bunker'], ['sideBRefuge', 'Refugio de Robledal'], ['knightBPlatform', 'Plataforma de Luz B'],
];
let sideBMapPreviewsBuilt = false;

function isSideBMap(map) {
  return sideBMaps.some(([id]) => id === map);
}

function buildSideBMapButtons() {
  const grid = document.querySelector('#mapScreen .map-grid');
  if (!grid || document.querySelector('.sideb-map')) return;
  sideBMaps.forEach(([map, name]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-option sideb-map hidden';
    button.dataset.map = map;
    button.innerHTML = `<span>${name}</span><span class="map-preview" aria-hidden="true"><span class="map-sky"></span><span class="map-platform"></span><span class="map-detail"></span></span>`;
    button.addEventListener('click', () => {
      if (sideBCodeActive) selectMap(map);
    });
    grid.appendChild(button);
  });
}

function buildSideBMapPreviews() {
  if (sideBMapPreviewsBuilt) return;
  sideBMapPreviewsBuilt = true;
  let saved = null;
  try {
    saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    return;
  }
  const savedMap = selectedMap;
  const thumb = document.createElement('canvas');
  const thumbCtx = thumb.getContext('2d');
  thumb.width = 360;
  thumb.height = 140;
  document.querySelectorAll('.sideb-map').forEach((button) => {
    try {
      selectedMap = button.dataset.map;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStage();
      ctx.restore();
      const sourceHeight = canvas.width * (thumb.height / thumb.width);
      thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
      thumbCtx.drawImage(canvas, 0, canvas.height - sourceHeight - 10, canvas.width, sourceHeight, 0, 0, thumb.width, thumb.height);
      const preview = button.querySelector('.map-preview');
      preview.style.backgroundImage = `url(${thumb.toDataURL()})`;
      preview.classList.add('rendered-preview');
    } catch (error) {
      // keep the simple preview
    }
  });
  selectedMap = savedMap;
  ctx.putImageData(saved, 0, 0);
}

// ---------- the top of the farol, with Light Warrior B: the sky of "Sin perdon" ----------
// It follows DAWN OF HOPES AND DREAMS as in the arcade: 0:53.5 pure light, 1:30 Celeste and Seto, 1:42 Mochi
// and the chef, 1:54 the sheriff, and after 2:06.7 a dimmed, hopeless sky (that stays). If another song
// was chosen, the same sky goes by on a clock
const sideBFarol = { moods: { normal: 1 }, target: 'normal', done: false, storm: 0, bolt: 0, frames: 0 };

function isSideBLwOnMap(map) {
  return selectedMap === map && !normalArcadeActive && [player1, player2].some((fighter) => fighter.sideB === 'lightWarriorB' && fighter.characterType === 'lightWarrior');
}

function isSideBFarol() {
  return isSideBLwOnMap('farolTop');
}

function resetSideBFarol() {
  Object.assign(sideBFarol, { moods: { normal: 1 }, target: 'normal', done: false, storm: 0, bolt: 0, frames: 0 });
}

function getSideBFarolNow() {
  const now = typeof getKnightB8SongNow === 'function' ? getKnightB8SongNow() : -1;
  if (now >= 0) return now;
  return 29 + ((sideBFarol.frames / 60) % (166.8 - 29));
}

function getSideBFarolTarget() {
  const now = getSideBFarolNow();
  if (now >= 53.5 && now < 89) return 'omega';
  if (now >= 90 && now < 101.5) return 'friends1';
  if (now >= 102 && now < 113.2) return 'friends2';
  if (now >= 114 && now < 126.7) return 'friends3';
  if (now >= 126.7) {
    sideBFarol.done = true;
    return 'dim';
  }
  if (now < 53.5) return sideBFarol.done ? 'dim' : 'normal';
  return sideBFarol.target;
}

function drawSideBFarolSky() {
  sideBFarol.target = getSideBFarolTarget();
  // (the arcade's drawing, borrowed for a moment with this fight's own sky)
  const keys = ['stage', 'omegaMoods', 'omegaMoodTarget', 'sequencesDone', 'omegaMoodOverride', 'stormFlash', 'stormBolt'];
  const saved = {};
  keys.forEach((key) => {
    saved[key] = knightB8[key];
  });
  const savedIs = window.isKnightB8;
  Object.assign(knightB8, { stage: 'p3', omegaMoods: sideBFarol.moods, omegaMoodTarget: sideBFarol.target, sequencesDone: sideBFarol.done, omegaMoodOverride: sideBFarol.target, stormFlash: sideBFarol.storm, stormBolt: sideBFarol.bolt });
  window.isKnightB8 = () => true;
  try {
    drawKnightB8FarolSky();
  } finally {
    window.isKnightB8 = savedIs;
    sideBFarol.moods = knightB8.omegaMoods;
    sideBFarol.storm = knightB8.stormFlash || 0;
    sideBFarol.bolt = knightB8.stormBolt || 0;
    keys.forEach((key) => {
      knightB8[key] = saved[key];
    });
  }
}

// ---------- every hook ----------
(function hookSideB() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  // the code itself
  wrap('handleMenuSecretInput', (base) => function handleMenuSecretInputWithSideB(event, ...rest) {
    const result = base.call(this, event, ...rest);
    if (menuSecretBuffer.replace(/[^a-z0-9]/g, '').endsWith('sideb')) {
      menuSecretBuffer = '';
      unlockSideBCode();
    }
    return result;
  });
  // (CLEAR takes it away like every other code)
  wrap('clearActiveCodes', (base) => function clearActiveCodesWithSideB(...args) {
    lockSideBCode();
    return base.apply(this, args);
  });
  wrap('openCharacterSelect', (base) => function openCharacterSelectWithSideB(...args) {
    const result = base.apply(this, args);
    syncSideBButtons();
    return result;
  });
  // any other pick (or a chapter that sets the character) forgets the B side
  const baseSetType = Fighter.prototype.setCharacterType;
  Fighter.prototype.setCharacterType = function setCharacterTypeForgettingSideB(...args) {
    if (this.sideB) clearSideBFighter(this);
    return baseSetType.apply(this, args);
  };
  // every fight: their stats
  wrap('resetFight', (base) => function resetFightWithSideB(...args) {
    const result = base.apply(this, args);
    sideBFx = [];
    resetSideBFarol();
    if (isSideBFarol()) reflecterBattleTrackStartOffsets.dawnHope = 29;
    if (isSideBLwOnMap('knightBPlatform')) reflecterBattleTrackStartOffsets.flowerDream = 0;
    if (!normalArcadeActive && typeof knightB7 !== 'undefined') {
      knightB7.gauntlets = [];
      knightB7.pillars = [];
    }
    prepareSideBFighter(player1);
    prepareSideBFighter(player2);
    if (player1.sideB || player2.sideB) {
      updateHealthBars();
      if (typeof updateCombatHudIdentity === 'function') updateCombatHudIdentity();
    }
    return result;
  });
  wrap('getCharacterDisplayName', (base) => function getCharacterDisplayNameWithSideB(fighter, ...rest) {
    const entry = getSideBEntry(fighter);
    if (entry && !normalArcadeActive) return entry.name;
    return base.call(this, fighter, ...rest);
  });
  // Knight B: his arcade abilities
  wrap('handleKnightKey', (base) => function handleKnightKeyWithSideB(fighter, target, slot, ...rest) {
    if (!(fighter && fighter.sideB === 'knightB' && fighter.secretVariant === 'knight' && !normalArcadeActive)) return base.call(this, fighter, target, slot, ...rest);
    if (!canFighterAct(fighter) || fighter.knightLungeTimer > 0 || gameOver) return true;
    if (slot === 0) {
      if (castKnightLunge(fighter, target)) fighter.knightLungeCooldown = Math.round(fighter.knightLungeCooldown * getSideBKnightSlowness(fighter));
    } else if (slot === 1) {
      castSideBKnightGauntlet(fighter, target);
    } else {
      castSideBKnightOath(fighter, target);
    }
    return true;
  });
  // the minions' Q / F / R, and the bizarre one's R: the crack of ice and fire
  wrap('handleOriginsCodeKey', (base) => function handleOriginsCodeKeyWithSideB(fighter, target, slot, ...rest) {
    if (isSideBMinion(fighter) && !normalArcadeActive) {
      if (!canFighterAct(fighter) || gameOver) return true;
      if (slot === 0) castSideBOrb(fighter, target);
      else if (slot === 1) castSideBBlink(fighter, target);
      else castSideBR(fighter, target);
      return true;
    }
    return base.call(this, fighter, target, slot, ...rest);
  });
  wrap('handleFlametombKey', (base) => function handleFlametombKeyWithSideB(caster, target, ...rest) {
    if (caster && caster.sideB === 'bizarre' && !normalArcadeActive && typeof castKnightBRift === 'function') {
      castKnightBRift(caster, target);
      return true;
    }
    return base.call(this, caster, target, ...rest);
  });
  wrap('getPlayerAbilityCooldowns', (base) => function getPlayerAbilityCooldownsWithSideB(player, ...rest) {
    if (isSideBMinion(player) && !normalArcadeActive) {
      const power = sideBMinionR[player.sideB];
      return {
        q: { active: true, name: 'Esfera arcana', remaining: player.sideBOrbCooldown || 0, max: getDebugCooldown(sideBOrbCooldown, player) },
        f: { active: true, name: 'Parpadeo', remaining: player.sideBBlinkCooldown || 0, max: getDebugCooldown(sideBBlinkCooldown, player) },
        r: { active: true, name: power.name, remaining: player.sideBRCooldown || 0, max: getDebugCooldown(power.cooldown, player) },
      };
    }
    if (player && player.sideB === 'knightB' && player.secretVariant === 'knight' && !normalArcadeActive) {
      return {
        q: { active: true, name: 'Estocada rota', remaining: player.knightLungeCooldown || 0, max: getDebugCooldown(knightLungeCooldown, player) },
        f: { active: true, name: 'Guantelete volador', remaining: player.knightB7GauntletCd || 0, max: getDebugCooldown(knightB7GauntletCooldown, player) },
        r: { active: true, name: 'Juramento', remaining: player.knightB7OathCd || 0, max: getDebugCooldown(knightB7OathCooldown, player) },
      };
    }
    const cooldowns = base.call(this, player, ...rest);
    if (player && player.sideB === 'bizarre' && !normalArcadeActive && cooldowns && typeof knightBRiftCooldown !== 'undefined') {
      cooldowns.r = { active: true, name: 'Grieta de hielo y fuego', remaining: player.knightBRiftCooldown || 0, max: getDebugCooldown(knightBRiftCooldown, player) };
    }
    return cooldowns;
  });
  // Knight B refuses to fall (once per fight); the minion's blink dodges; Light Warrior B takes a little life back
  wrap('applyDamage', (base) => function applyDamageWithSideB(attacker, target, damage, options, ...rest) {
    if (target && target.sideBBlinkGuard > 0) return 0;
    const endure = target && target.sideB === 'knightB' && target.secretVariant === 'knight' && !normalArcadeActive && (target.sideBWeak || 0) < sideBKnightStandLimit && target.health > 0;
    const dealt = base.call(this, attacker, target, damage, options, ...rest);
    if (endure && target.health <= 1 && dealt > 0) sideBKnightRefuse(target);
    if (attacker && attacker.sideB === 'lightWarriorB' && target !== attacker && dealt > 0 && attacker.health > 0 && !normalArcadeActive) {
      attacker.health = Math.min(attacker.maxHealth, attacker.health + dealt * 0.15);
      updateHealthBars();
    }
    return dealt;
  });
  // their projectiles, once per frame (and the bizarre one's cracks outside its chapter)
  wrap('updateMonkeyCoconuts', (base) => function updateMonkeyCoconutsWithSideB(...args) {
    const result = base.apply(this, args);
    updateSideBFx();
    const running = gameStarted && !gameOver && !(typeof arcadeCutscene !== 'undefined' && arcadeCutscene.active);
    if (running && isSideBFarol()) sideBFarol.frames += 1;
    if (!normalArcadeActive) {
      updateSideBKnights(running);
      updateSideBLightWarriors();
    }
    const bizarre = [player1, player2].some((fighter) => fighter.sideB === 'bizarre');
    if (bizarre && !normalArcadeActive && typeof updateKnightBRifts === 'function') {
      updateKnightBRifts();
      if (typeof drawKnightBSparks === 'function') drawKnightBSparks();
    } else if (!normalArcadeActive && [player1, player2].some((fighter) => fighter.sideB === 'knightB') && typeof drawKnightBSparks === 'function') {
      drawKnightBSparks();
    }
    return result;
  });
  // the maps: two of them are drawn here; the farol with Light Warrior B has the arcade's sky
  wrap('drawStage', (base) => function drawStageWithSideB(...args) {
    if (selectedMap === 'sideBForest') {
      selectedMap = 'enchantedForest';
      try {
        base.apply(this, args);
      } finally {
        selectedMap = 'sideBForest';
      }
      if (typeof drawKnightBGloom === 'function') drawKnightBGloom(true);
      return undefined;
    }
    if (selectedMap === 'sideBRefuge' && typeof drawKnightBBunkerInside === 'function') {
      drawKnightBBunkerInside();
      if (typeof drawKnightBGloom === 'function') drawKnightBGloom(false);
      return undefined;
    }
    if (isSideBFarol() && typeof drawKnightB8FarolSky === 'function') {
      drawSideBFarolSky();
      return undefined;
    }
    return base.apply(this, args);
  });
  // their music: DAWN OF HOPES AND DREAMS on the farol, A FLOWER'S DREAM on the platform (and its skies follow)
  wrap('getReflecterBattleTrackKey', (base) => function getReflecterBattleTrackKeyWithSideB(...args) {
    const chosen = typeof getVersusMusicChoice === 'function' && getVersusMusicChoice();
    if (!chosen && isSideBFarol()) return 'dawnHope';
    if (!chosen && isSideBLwOnMap('knightBPlatform')) return 'flowerDream';
    return base.apply(this, args);
  });
  wrap('syncLightWarriorOmegaMusic', (base) => function syncLightWarriorOmegaMusicWithSideB(...args) {
    if (isSideBFarol() || isSideBLwOnMap('knightBPlatform')) {
      if (typeof stopOmegaBattleTrack === 'function') stopOmegaBattleTrack();
      return undefined;
    }
    return base.apply(this, args);
  });
  // how they look
  const baseDraw = Fighter.prototype.draw;
  Fighter.prototype.draw = function drawWithSideB(...args) {
    const look = this.sideB;
    if (look === 'knightB' && this.secretVariant === 'knight') {
      const shield = this.knightShieldGone;
      const broken = this.knightSwordBroken;
      this.knightShieldGone = true;
      this.knightSwordBroken = true;
      const result = baseDraw.apply(this, args);
      this.knightShieldGone = shield;
      this.knightSwordBroken = broken;
      if (typeof drawKnightB7Burns === 'function') drawKnightB7Burns(this);
      drawSideBKnightStand(this);
      return result;
    }
    if (look === 'lightWarriorB' && this.characterType === 'lightWarrior') {
      this.capeWind = true;
      const omega = this.lightWarriorOmegaTransformed;
      if (omega) drawSideBOmegaAura(this, 'back');
      const result = baseDraw.apply(this, args);
      if (omega) drawSideBOmegaAura(this, 'front');
      else if (typeof drawKnightB8Shadow === 'function') drawKnightB8Shadow(this, true);
      return result;
    }
    return baseDraw.apply(this, args);
  };
  buildSideBMapButtons();
  syncSideBButtons();
})();
