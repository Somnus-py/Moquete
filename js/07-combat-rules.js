// Moquete - Reglas de combate: dano, variantes secretas, terrenos y eventos
// (parte 7 de 10; los archivos se cargan en orden desde index.html)

function rectangularCollision({ rectangle1, rectangle2 }) {
  const rectangle2X = rectangle2.position ? rectangle2.position.x : rectangle2.x;
  const rectangle2Y = rectangle2.position ? rectangle2.position.y : rectangle2.y;

  return (
    rectangle1.x < rectangle2X + rectangle2.width &&
    rectangle1.x + rectangle1.width > rectangle2X &&
    rectangle1.y < rectangle2Y + rectangle2.height &&
    rectangle1.y + rectangle1.height > rectangle2Y
  );
}

function getAttackDamage(attacker, isStrong = false) {
  if (attacker.characterType === 'ghost') return ghostDamage;
  if (attacker.characterType === 'lightWarrior') return getLightWarriorDamage(attacker, isStrong) * (1 + attacker.gamblerDamageBoost);
  if (attacker.characterType === 'divineGeneral') {
    const eventMultiplier = isAbsoluteAdaptationActive() ? 1.2 : 1;
    return (isStrong ? divineGeneralDamage * 2 : divineGeneralDamage) * getDivineBaseDamageMultiplier(attacker) * eventMultiplier;
  }
  if (attacker.characterType === 'tank') return getTankSecretDamage(attacker, tankDamage);
  if (attacker.characterType === 'reflecter' && !isStrong) return getReflecterDamage(attacker);
  if (attacker.characterType === 'normal') {
    const kaiokenMultiplier = isNormalKaioken(attacker) && attacker.kaiokenTimer > 0 ? kaiokenSecretDamageMultiplier : 1;
    return (isStrong ? heavyAttackDamage : attackDamage) * attacker.damageMultiplier * kaiokenMultiplier;
  }
  if (attacker.characterType === 'switcher' && !isStrong) {
    return switcherModeStats[attacker.getSwitcherMode()].damage * (1 + attacker.gamblerDamageBoost);
  }
  return (isStrong ? heavyAttackDamage : attackDamage) * attacker.damageMultiplier * (1 + attacker.gamblerDamageBoost);
}

function hasSecretVariant(fighter, variant, globalFlag = false) {
  return Boolean((fighter && fighter.secretVariant === variant) || globalFlag);
}

function isFireMasterOverheat(fighter) {
  if (isIceMaster(fighter)) return false;
  return hasSecretVariant(fighter, 'fireMasterOverheat', characterSecretModes.fireMasterOverheat);
}

function isSuperFireMaster(fighter) {
  return hasSecretVariant(fighter, 'superFireMaster');
}

function isSuperFireMasterUnlocked() {
  return Boolean(unlockedAchievements.superFireMasterUnlocked);
}

function syncSuperFireMasterUnlockUI() {
  if (!fireMasterCharacterButton) return;
  fireMasterCharacterButton.title = isSuperFireMasterUnlocked()
    ? 'Click izquierdo: Fire Master. Click derecho: Super Fire Master.'
    : 'Gana Mana Meltdown con Fire Master en menos de 45 segundos y con 80+ vida para desbloquear Super Fire Master.';
}

function getFireMasterHealth(fighter) {
  return isSuperFireMaster(fighter) ? superFireMasterHealth : 120;
}

function isTankIronWall(fighter) {
  return hasSecretVariant(fighter, 'tankIronwall', characterSecretModes.tankIronWall);
}

function isCowboyDeadeye(fighter) {
  return hasSecretVariant(fighter, 'cowboyDeadeye', characterSecretModes.cowboyDeadeye);
}

function getCowboyHealth(fighter) {
  return isCowboyDeadeye(fighter) ? deadeyeCowboyHealth : cowboyHealth;
}

function isNormalKaioken(fighter) {
  return hasSecretVariant(fighter, 'normalKaioken', characterSecretModes.normalKaioken);
}

function isReflecterMirrorLuck(fighter) {
  return hasSecretVariant(fighter, 'reflecterMirrorluck', characterSecretModes.reflecterMirrorLuck);
}

function isReflecterUpgrade(fighter) {
  return hasSecretVariant(fighter, 'reflecterUpgrade', characterSecretModes.reflecterUpgrade);
}

function isSwitcherPrism(fighter) {
  return hasSecretVariant(fighter, 'switcherPrism', characterSecretModes.switcherPrism);
}

function isDivineFullAdapt(fighter) {
  return hasSecretVariant(fighter, 'divineFullAdapt', characterSecretModes.divineFullAdapt);
}

function isLightWarriorOmega(fighter) {
  return hasSecretVariant(fighter, 'omega', characterSecretModes.lightWarriorOmega);
}

function getLightWarriorHealth(fighter) {
  return fighter && fighter.lightWarriorOmegaTransformed ? lightWarriorOmegaHealth : lightWarriorHealth;
}

function getLightWarriorDamage(fighter, isStrong = false) {
  const damage = isStrong ? lightWarriorDamage * 1.5 : lightWarriorDamage;
  return fighter && fighter.lightWarriorOmegaTransformed ? lightWarriorOmegaDamage * (isStrong ? 1.5 : 1) : damage;
}

function resetLightWarriorOmegaState(fighter) {
  if (!fighter || fighter.characterType !== 'lightWarrior') return;

  fighter.lightWarriorOmegaTransformed = false;
  fighter.lightWarriorOmegaStateTimer = 0;
  fighter.lightWarriorOmegaFlightUsesRemaining = lightWarriorOmegaFlightUsesMax;
  fighter.lightWarriorOmegaFlightChargeAvailable = true;
  fighter.lightWarriorOmegaFlightCharging = false;
  fighter.lightWarriorOmegaFlightChargeTimer = 0;
  fighter.lightWarriorOmegaFlightTraveling = false;
  fighter.lightWarriorOmegaFlightTimer = 0;
  fighter.lightWarriorOmegaFlightDirection = 1;
  fighter.secretVariant = isLightWarriorOmega(fighter) ? 'omega' : null;
  fighter.setMaxHealth(lightWarriorHealth);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = 1;
}

function getLightWarriorOmegaFlightUseCount(fighter) {
  if (!fighter || fighter.characterType !== 'lightWarrior') return 0;
  return lightWarriorOmegaFlightUsesMax - fighter.lightWarriorOmegaFlightUsesRemaining;
}

function getLightWarriorOmegaFlightSpeedMultiplier(fighter) {
  const usesUsed = getLightWarriorOmegaFlightUseCount(fighter);
  const firstUseSpeed = 0.45;
  const lastUseSpeed = 1;
  const progress = Math.max(0, Math.min(1, (usesUsed - 1) / (lightWarriorOmegaFlightUsesMax - 1)));
  return firstUseSpeed + (lastUseSpeed - firstUseSpeed) * progress;
}

function finishLightWarriorOmegaFlight(attacker, target, wasParried = false) {
  if (!attacker || attacker.characterType !== 'lightWarrior') return;

  attacker.lightWarriorOmegaFlightCharging = false;
  attacker.lightWarriorOmegaFlightTraveling = false;
  attacker.lightWarriorOmegaFlightTimer = 0;
  attacker.velocity.x = 0;
  attacker.velocity.y = 0;

  if (!wasParried && target && target.health > 0 && attacker.lightWarriorOmegaTransformed) {
    const targetCenterX = target.position.x + target.width / 2;
    const attackerCenterX = attacker.position.x + attacker.width / 2;
    applyDamage(attacker, target, lightWarriorOmegaFlightDamage, { isSpecial: true, damageType: 'omegaLightWarriorFlight' });
    target.velocity.x = getDebugKnockback((targetCenterX >= attackerCenterX ? -1 : 1) * 16, target);
    target.velocity.y = getDebugKnockback(-10, target);
  }
}

function tryParryLightWarriorOmegaFlight(attacker, target) {
  if (!attacker || !target || attacker.characterType !== 'lightWarrior' || !attacker.lightWarriorOmegaFlightTraveling) return false;

  const flightArea = {
    x: attacker.position.x - 55,
    y: attacker.position.y - 35,
    width: attacker.width + 110,
    height: attacker.height + 74,
  };

  const targetAttackArea = target.isAttacking ? target.attackArea : null;
  if (targetAttackArea && rectangularCollision({ rectangle1: targetAttackArea, rectangle2: flightArea })) {
    playSound('reflectShield');
    target.velocity.x = getDebugKnockback((target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? -1 : 1) * 12, target);
    target.velocity.y = getDebugKnockback(-6, target);
    attacker.velocity.x = 0;
    attacker.velocity.y = 0;
    attacker.lightWarriorOmegaFlightCharging = false;
    attacker.lightWarriorOmegaFlightTraveling = false;
    attacker.lightWarriorOmegaFlightTimer = 0;
    return true;
  }

  if (target.characterType === 'reflecter' && rectangularCopycatShieldCollision(target, flightArea)) {
    if (handleCopycatShieldHit(target, attacker)) {
      attacker.lightWarriorOmegaFlightCharging = false;
      attacker.lightWarriorOmegaFlightTraveling = false;
      attacker.lightWarriorOmegaFlightTimer = 0;
      return true;
    }
  }

  return false;
}

function activateLightWarriorOmegaFlight(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'lightWarrior' ||
    !attacker.lightWarriorOmegaTransformed ||
    attacker.lightWarriorOmegaFlightCharging ||
    attacker.lightWarriorOmegaFlightTraveling ||
    attacker.lightWarriorOmegaFlightUsesRemaining <= 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.lightWarriorOmegaFlightUsesRemaining -= 1;
  const shouldCharge = attacker.lightWarriorOmegaFlightChargeAvailable;
  attacker.lightWarriorOmegaFlightChargeAvailable = false;
  attacker.lightWarriorOmegaFlightCharging = shouldCharge;
  attacker.lightWarriorOmegaFlightChargeTimer = 0;
  attacker.lightWarriorOmegaFlightTraveling = !shouldCharge;
  attacker.lightWarriorOmegaFlightTimer = shouldCharge ? 0 : lightWarriorOmegaFlightDuration;
  attacker.lightWarriorOmegaFlightDirection = target && target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 1 : -1;
  attacker.velocity.x = 0;
  attacker.velocity.y = -1.8;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  recordSpecialUsed(attacker);
  playSound('gravityOrb');
  return true;
}

function syncLightWarriorOmegaMusic() {
  const isLightWarriorOmegaActive = (player1.characterType === 'lightWarrior' && isLightWarriorOmega(player1)) || (player2.characterType === 'lightWarrior' && isLightWarriorOmega(player2));
  if (isLightWarriorOmegaActive) {
    playOmegaBattleTrack();
  } else {
    stopOmegaBattleTrack();
  }
}

function getOmegaTransformationCharacters() {
  const excluded = new Set(['lightWarrior', player2.characterType, 'divineGeneral']);
  const available = characterTypes.filter((characterType) => !excluded.has(characterType));
  return Array.from({ length: 6 }, () => available[Math.floor(Math.random() * available.length)]);
}

function startLightWarriorOmegaTransformation(attacker, playerNumber) {
  if (!isLightWarriorOmega(attacker) || lightWarriorOmegaTransformation || gameOver) return false;

  attacker.velocity.x = 0;
  attacker.velocity.y = -5;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  lightWarriorOmegaTransformation = {
    attacker,
    timer: 0,
    characters: getOmegaTransformationCharacters(),
  };
  clearQfPendingSpecial(playerNumber);
  clearFrPendingSpecial(playerNumber);
  playSound('fireBeam');
  return true;
}

function updateLightWarriorOmegaTransformation() {
  const transformation = lightWarriorOmegaTransformation;
  if (!transformation) return;

  const { attacker } = transformation;
  transformation.timer += 1;
  attacker.velocity.x = 0;
  attacker.velocity.y = transformation.timer < 70 ? -1.8 : 0;
  attacker.position.y = Math.max(80, attacker.position.y + attacker.velocity.y);
  attacker.isAttacking = false;

  if (transformation.timer >= lightWarriorOmegaAnnouncementTimer + lightWarriorOmegaActivationDelay) {
    attacker.lightWarriorOmegaTransformed = true;
    attacker.lightWarriorOmegaStateTimer = lightWarriorOmegaStateDuration;
    attacker.secretVariant = 'omegaTransformed';
    attacker.setMaxHealth(lightWarriorOmegaTransformationHealth);
    attacker.health = attacker.maxHealth;
    attacker.damageMultiplier = lightWarriorOmegaDamageMultiplier * 1.15;
    lightWarriorOmegaTransformation = null;
    updateHealthBars();
    updateCombatHudIdentity();
  }
}

function drawLightWarriorOmegaTransformation() {
  const transformation = lightWarriorOmegaTransformation;
  if (!transformation) return;

  const { attacker, timer, characters } = transformation;
  const progress = Math.min(1, timer / lightWarriorOmegaTransformationDuration);
  const centerX = attacker.position.x + attacker.width / 2;
  const centerY = attacker.position.y + attacker.height / 2;
  const rotation = timer * 0.16;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '900 25px Courier New, monospace';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 6;
  const phrase = timer < lightWarriorOmegaAnnouncementTimer ? 'CON SUS PODERES COMBINADOS SOY...' : 'OMEGA LIGHT WARRIOR!!';
  ctx.strokeText(phrase, canvas.width / 2, 190);
  ctx.fillText(phrase, canvas.width / 2, 190);

  if (timer >= lightWarriorOmegaAnnouncementTimer && timer <= lightWarriorOmegaAnnouncementTimer + lightWarriorOmegaActivationDelay) {
    const flashProgress = (timer - lightWarriorOmegaAnnouncementTimer) / lightWarriorOmegaActivationDelay;
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - flashProgress})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.translate(centerX, centerY);
  for (let index = 0; index < characters.length; index += 1) {
    const angle = rotation + (Math.PI * 2 * index) / characters.length;
    const radius = 96 + Math.sin(timer * 0.1 + index) * 12;
    ctx.save();
    ctx.rotate(angle);
    ctx.globalAlpha = 0.28 + progress * 0.18;
    ctx.fillStyle = switcherModeColors[characters[index]] || ['#42a5f5', '#ef5350', '#66bb6a', '#fdd835'][index % 4];
    ctx.fillRect(radius, -12, 24, 42);
    ctx.fillStyle = '#fff';
    ctx.fillRect(radius + 5, -25, 14, 12);
    ctx.restore();
  }
  ctx.restore();

  if (timer > lightWarriorOmegaTransformationDuration - lightWarriorOmegaFlashDuration) {
    const flashProgress = (timer - (lightWarriorOmegaTransformationDuration - lightWarriorOmegaFlashDuration)) / lightWarriorOmegaFlashDuration;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 0.95 - flashProgress)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function getDivineMaxHealth(fighter) {
  return isDivineFullAdapt(fighter) ? divineFullAdaptHealth : divineGeneralHealth;
}

function getDivineAdaptationStackLimit(fighter) {
  return isDivineFullAdapt(fighter) ? divineFullAdaptMaxStacks : divineGeneralMaxAdaptStacks;
}

function getRandomDivineFullAdaptStacks() {
  return divineFullAdaptMinStacks + Math.floor(Math.random() * (divineFullAdaptMaxStacks - divineFullAdaptMinStacks + 1));
}

function fillDivineAdaptations(fighter, stacks = null) {
  if (!fighter || fighter.characterType !== 'divineGeneral') return;

  if (!fighter.divineAdaptations) fighter.divineAdaptations = {};
  const stackLimit = getDivineAdaptationStackLimit(fighter);
  divineFullAdaptTypes.forEach((damageType) => {
    const resolvedStacks = stacks === null ? getRandomDivineFullAdaptStacks() : stacks;
    fighter.divineAdaptations[damageType] = Math.max(
      Math.max(0, Number(fighter.divineAdaptations[damageType]) || 0),
      Math.min(stackLimit, resolvedStacks)
    );
  });
}

function isPrismOverdriveActive() {
  return prismOverdrive.activeFrames > 0;
}

function isAbsoluteAdaptationActive() {
  return absoluteAdaptation.activeFrames > 0;
}

function getDivineAdaptCooldownMax(fighter = null) {
  const eventMultiplier = isAbsoluteAdaptationActive() ? 0.65 : 1;
  return getDebugCooldown(Math.round(divineGeneralAdaptCooldown * eventMultiplier), fighter);
}

function getDivineCounterCooldownMax(fighter = null) {
  const eventMultiplier = isAbsoluteAdaptationActive() ? 0.65 : 1;
  return getDebugCooldown(Math.round(divineGeneralCounterCooldown * eventMultiplier), fighter);
}

function getSwitcherAbilityCooldownMax(fighter) {
  const cooldownMultiplier = isPrismOverdriveActive()
    ? switcherPrismOverdriveCooldownMultiplier
    : isSwitcherPrism(fighter)
      ? switcherPrismCooldownMultiplier
      : 1;
  return getDebugCooldown(Math.round(switcherAbilityCooldown * cooldownMultiplier), fighter);
}

function syncSecretBodyModes() {
  document.body.classList.toggle('normal-kaioken-mode', characterSecretModes.normalKaioken);
  document.body.classList.toggle('reflecter-mirrorluck-mode', characterSecretModes.reflecterMirrorLuck);
  document.body.classList.toggle('reflecter-upgrade-mode', characterSecretModes.reflecterUpgrade);
  document.body.classList.toggle('switcher-prism-mode', characterSecretModes.switcherPrism);
}

function getReflecterDamage(fighter) {
  return isReflecterUpgrade(fighter) ? upgradedReflecterDamage : reflecterDamage;
}

function getReflecterHealth(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterHealth;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterHealth;
  return reflecterHealth;
}

function getReflecterShieldDuration(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterShieldDuration;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterShieldDuration;
  return reflecterShieldDuration;
}

function getReflecterShieldCooldown(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterShieldCooldown;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterShieldCooldown;
  return reflecterShieldCooldown;
}

function getReflecterCopyDamageMultiplier(fighter) {
  if (isReflecterUpgrade(fighter)) return 2;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterCopyDamageMultiplier;
  return 1;
}

function isBlueReflecter(fighter) {
  const color = String(fighter.baseColor || '').toLowerCase();
  return color === '#2196f3' || color === '#42a5f5' || color === 'blue';
}

function getReflecterLightColor(fighter) {
  if (isReflecterUpgrade(fighter) && isBlueReflecter(fighter)) return '#ff1744';
  if (isReflecterMirrorLuck(fighter)) return '#39ff88';
  return fighter.baseColor;
}

function formatDebugMultiplier(value) {
  return `${Number(value).toFixed(2).replace(/\.?0+$/, '')}x`;
}

function isDebugAffected(fighter) {
  if (!fighter || !fighter.characterType) return true;
  return debugAffectedCharacters[fighter.characterType] !== false;
}

function getDebugMultiplier(setting, fighter) {
  return isDebugAffected(fighter) ? debugSettings[setting] : 1;
}

function getDebugDamage(damage, fighter = null) {
  return damage * getDebugMultiplier('damageMultiplier', fighter);
}

function getDebugMaxHealth(baseMaxHealth, fighter = null) {
  return Math.max(1, Math.round(baseMaxHealth * getDebugMultiplier('healthMultiplier', fighter)));
}

function getDebugMoveSpeed(fighter) {
  const kaiokenMultiplier = isNormalKaioken(fighter) && fighter.characterType === 'normal' && fighter.kaiokenTimer > 0 ? kaiokenSecretSpeedMultiplier : 1;
  const chronoMultiplier = fighter.chronoSlowTimer > 0 ? chronoSlowFactor : 1;
  const icedMultiplier = (fighter.icedSlowTimer > 0 ? icedThugFrostSlowFactor : 1) * (fighter.scamWeakTimer > 0 ? scamWeakSpeedMultiplier : 1);
  const ghostMultiplier = fighter.characterType === 'ghost' && fighter.ghostPhaseTimer > 0 ? ghostPhaseSpeedMultiplier : 1;
  const lightWarriorMultiplier = fighter.characterType === 'lightWarrior' && fighter.lightWarriorSpeedTimer > 0 ? lightWarriorSpeedMultiplier : 1;
  return fighter.moveSpeed * getDebugMultiplier('moveMultiplier', fighter) * (1 + fighter.gamblerSpeedBoost) * kaiokenMultiplier * chronoMultiplier * icedMultiplier * ghostMultiplier * lightWarriorMultiplier;
}

function getDebugJumpSpeed(jumpSpeed, fighter = null) {
  return jumpSpeed * Math.sqrt(getDebugMultiplier('moveMultiplier', fighter));
}

function getDebugCooldown(cooldown, fighter = null) {
  // the spirits of Robledal (chapter 5, level 7) shorten the cooldowns a little
  const spirits = fighter && fighter.spiritCount > 0 ? spiritCooldownMultiplier : 1;
  return Math.max(0, Math.round(cooldown * getDebugMultiplier('cooldownMultiplier', fighter) * spirits));
}

function getDebugDuration(duration, fighter = null) {
  return Math.max(0, Math.round(duration * getDebugMultiplier('durationMultiplier', fighter)));
}

function getDebugKnockback(value, fighter = null) {
  return value * getDebugMultiplier('knockbackMultiplier', fighter);
}

function getDebugGravity(fighter = null) {
  return gravity * getDebugMultiplier('gravityMultiplier', fighter);
}

function getDebugProjectileSpeed(speed, fighter = null) {
  return speed * getDebugMultiplier('projectileMultiplier', fighter);
}

function getGamblerLuckWaveDuration(fighter = null) {
  return getDebugDuration(gamblerLuckWaveDuration, fighter);
}

function getGamblerLuckWaveProgress(timer, fighter = null) {
  const duration = Math.max(1, getGamblerLuckWaveDuration(fighter));
  return Math.max(0, Math.min(1, 1 - timer / duration));
}

function getFireMasterSecretDamage(attacker, damage) {
  if (isIceMaster(attacker)) return damage * iceMasterAbilityDamageMultiplier;
  if (isSuperFireMaster(attacker)) {
    if (damage === fireballDamage) return superFireballDamage;
    if (damage === fireBeamDamage) return superFireBeamDamage;
  }
  return isFireMasterOverheat(attacker) ? damage * 1.35 : damage;
}

function getFireMasterSecretCooldown(attacker, cooldown) {
  return isFireMasterOverheat(attacker) ? cooldown * 0.7 : cooldown;
}

function getTankSecretDamage(attacker, damage) {
  return isTankIronWall(attacker) ? damage + 20 : damage;
}

function getCowboySecretDamage(attacker, damage) {
  return isCowboyDeadeye(attacker) ? damage + 4 : damage;
}

function getCowboySecretBurstShots(attacker) {
  return isCowboyDeadeye(attacker) ? cowboyBurstShots + 6 : cowboyBurstShots;
}

function shuffleCharacterTypes() {
  const availableTypes = getSelectableCharacterTypes();
  let shuffled = [...availableTypes];
  do {
    shuffled = [...availableTypes];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
  } while (shuffled.length > 1 && shuffled.some((characterType, index) => characterType === availableTypes[index]));

  return availableTypes.reduce((mix, characterType, index) => {
    mix[characterType] = shuffled[index];
    return mix;
  }, {});
}

function updateBlindCharacterLabels() {
  characterButtons.forEach(({ button, originalName }) => {
    const label = button.querySelector('span:first-child');
    label.innerText = blindMode ? 'guess who' : originalName;
  });
}

function applyBlindFighterLook(fighter) {
  fighter.width = 60;
  fighter.height = 120;
  fighter.moveSpeed = playerMoveSpeed;
  fighter.damageMultiplier = 1;
  fighter.attackDuration = 12;
  fighter.attackBox = {
    offset: { x: fighter.attacksToTheRight ? fighter.width : -70, y: 20 },
    width: 70,
    height: 30,
  };
  fighter.setMaxHealth(100);
  fighter.color = '#f5f5f5';
  fighter.attackColor = 'rgba(245, 245, 245, 0.65)';
}

function activateBlindMode() {
  blindMode = true;
  blindCharacterMix = shuffleCharacterTypes();
  document.body.classList.add('blind-mode');
  updateBlindCharacterLabels();
}

function deactivateBlindMode() {
  blindMode = false;
  blindCharacterMix = {};
  document.body.classList.remove('blind-mode');
  updateBlindCharacterLabels();
}

function unlockDarkRoomMap() {
  darkRoomUnlocked = true;
  darkRoomMapButton.classList.remove('hidden');
}

function lockDarkRoomMap() {
  darkRoomUnlocked = false;
  darkRoomMapButton.classList.add('hidden');
  if (selectedMap === 'darkRoom') {
    selectedMap = 'foundry';
  }
}

function clearActiveCodes() {
  if (typeof lockOriginsCodes === 'function') lockOriginsCodes();
  Object.keys(characterSecretModes).forEach((secretKey) => {
    characterSecretModes[secretKey] = false;
  });
  deactivateBlindMode();
  lockDarkRoomMap();
  lockArcadeBosses();
  lockNeoScammerCode();
  lockMedievalCode();
  lockMagicTownCode();
  syncSecretBodyModes();

  [player1, player2].forEach((fighter) => {
    const wasArcadeBoss = isArcadeBossFighter(fighter);
    fighter.secretVariant = null;
    if (wasArcadeBoss) fighter.setCharacterType(fighter.characterType);
    fighter.lightWarriorOmegaTransformed = false;
    fighter.lightWarriorOmegaStateTimer = 0;
    if (fighter.characterType === 'normal') {
      fighter.kaiokenTimer = 0;
      fighter.kaiokenCooldown = 0;
      fighter.kaiokenComboCooldown = 0;
      fighter.kaiokenComboHitsRemaining = 0;
      fighter.kaiokenComboTimer = 0;
      fighter.kaiokenComboVisualTimer = 0;
      fighter.setMaxHealth(100);
    } else if (fighter.characterType === 'reflecter') {
      fighter.setCharacterType('reflecter');
    } else if (fighter.characterType === 'tank') {
      fighter.setCharacterType('tank');
    } else if (fighter.characterType === 'switcher') {
      fighter.setCharacterType('switcher');
    } else if (fighter.characterType === 'divineGeneral') {
      fighter.setCharacterType('divineGeneral');
    }
    fighter.divineWorldCutCooldown = 0;
    fighter.divineWorldCutCharging = false;
  });

  resetDebugSettings();
  updateCooldownIndicators();
}

function handleCopycatShieldHit(defender, attacker) {
  if (
    !defender ||
    !attacker ||
    defender.characterType !== 'reflecter' ||
    defender.copycatShieldTimer <= 0
  ) {
    return false;
  }

  defender.copycatShieldTimer = 0;
  if (attacker.characterType === 'sorcerer') {
    triggerArcaneRift();
  }
  playSound('reflectShield');
  replicateAbility(defender, attacker);
  return true;
}

function getCopycatShieldBounds(defender) {
  const extraX = isReflecterUpgrade(defender) ? 54 : 24;
  const extraY = isReflecterUpgrade(defender) ? 40 : 18;
  return {
    position: {
      x: defender.position.x - extraX,
      y: defender.position.y - extraY,
    },
    width: defender.width + extraX * 2,
    height: defender.height + extraY * 2,
  };
}

function rectangularCopycatShieldCollision(defender, rectangle) {
  if (!defender || defender.characterType !== 'reflecter' || defender.copycatShieldTimer <= 0) return false;
  return rectangularCollision({ rectangle1: rectangle, rectangle2: getCopycatShieldBounds(defender) });
}

function replicateAbility(copycat, source) {
  fightAchievementFlags.copiedAbilityUsedBy = copycat;
  switch (source.characterType) {
    case 'fireMaster':
      copyFireMasterAbility(copycat, source);
      break;
    case 'tank':
      copyTankAbility(copycat, source);
      break;
    case 'cowboy':
      copyCowboyAbility(copycat, source);
      break;
    case 'lightWarrior':
      copyLightWarriorAbility(copycat, source);
      break;
    case 'switcher':
      copySwitcherAbility(copycat, source);
      break;
    case 'sorcerer':
      copySorcererAbility(copycat, source);
      break;
    case 'gambler':
      copyGamblerAbility(copycat);
      break;
    case 'chrono':
      copyChronoAbility(copycat, source);
      break;
    case 'divineGeneral':
      activateDivineAdaptation(copycat, true);
      break;
    case 'reflecter':
      activateCopycatShield(copycat);
      break;
    default:
      copyNormalAbility(copycat, source);
      break;
  }
}

function copyNormalAbility(copycat, source) {
  copycat.health = Math.min(copycat.maxHealth, copycat.health + reflecterHealAmount * getReflecterCopyDamageMultiplier(copycat));
  if (isReflecterUpgrade(copycat) && source && source.characterType === 'normal') {
    applyDamage(copycat, source, 20, { isSpecial: true, damageType: 'mirrorStrike' });
  }
}

function getJackpotAuraColors(fighter) {
  if (fighter.characterType === 'reflecter') {
    const lightColor = getReflecterLightColor(fighter);
    return {
      outer: hexToRgba(lightColor, 0.95),
      primary: hexToRgba(lightColor, 0.88),
      glow: hexToRgba(lightColor, 0.3),
      spark: 'rgba(227, 242, 253, 0.82)',
    };
  }

  return {
    outer: 'rgba(180, 255, 190, 0.95)',
    primary: 'rgba(0, 255, 90, 0.86)',
    glow: 'rgba(0, 255, 90, 0.28)',
    spark: 'rgba(200, 255, 120, 0.74)',
  };
}

function getOpponent(fighter) {
  return fighter === player1 ? player2 : player1;
}

function canFighterAct(fighter) {
  return (
    fighter &&
    lightWarriorOmegaTransformation?.attacker !== fighter &&
    fighter.chronoTimeStopTimer <= 0 &&
    fighter.divineAdaptTimer <= 0 &&
    !fighter.divineWorldCutCharging &&
    !fighter.lightWarriorRadiantPunchCharging &&
    !fighter.superFireKamehamehaCharging &&
    !fighter.lightWarriorBeamCharging
  );
}

function getPlayerStats(fighter) {
  return fighter === player1 ? fightStats.player1 : fightStats.player2;
}

function resetFightStats() {
  const freshStats = createEmptyFightStats();
  const freshAchievementFlags = createEmptyFightAchievementFlags();
  Object.assign(fightStats.player1, freshStats.player1);
  Object.assign(fightStats.player2, freshStats.player2);
  Object.assign(fightAchievementFlags, freshAchievementFlags);
  fightStartedAt = performance.now();
  currentFightStatisticsRecorded = false;
}

function recordSpecialUsed(attacker) {
  getPlayerStats(attacker).specialsUsed += 1;
}

function getDamageType(attacker, isSpecial, explicitDamageType) {
  if (explicitDamageType) return explicitDamageType;
  if (!isSpecial) return 'melee';
  if (!attacker) return 'special';

  switch (attacker.characterType) {
    case 'fireMaster':
      return 'fire';
    case 'cowboy':
      return 'ballistic';
    case 'tank':
      return 'shell';
    case 'sorcerer':
      return 'arcane';
    case 'chrono':
      return 'temporal';
    case 'ghost':
      return 'spirit';
    case 'gambler':
      return 'luck';
    case 'switcher':
      return 'prism';
    case 'monkey':
      return 'banana';
    default:
      return 'special';
  }
}

function getDivineAdaptedDamage(target, damage, damageType) {
  if (!target || !target.divineAdaptations) return damage;

  const stacks = Math.max(0, Number(target.divineAdaptations[damageType]) || 0);
  if (stacks <= 0) return damage;

  const reduction = Math.min(divineGeneralAdaptReduction * stacks, divineGeneralAdaptReduction * divineGeneralMaxAdaptStacks);
  return damage * (1 - reduction);
}

function recordDivineAdaptation(target, damageType) {
  if (!target || !target.divineAdaptations || target.divineAdaptTimer <= 0) return;

  const currentStacks = Math.max(0, Number(target.divineAdaptations[damageType]) || 0);
  target.divineAdaptations[damageType] = Math.min(getDivineAdaptationStackLimit(target), currentStacks + 1);
}

function getDivineTotalAdaptationStacks(fighter) {
  if (!fighter || !fighter.divineAdaptations) return 0;

  return Object.values(fighter.divineAdaptations).reduce(
    (total, stacks) => total + Math.max(0, Number(stacks) || 0),
    0
  );
}

function getDivineBaseDamageMultiplier(fighter) {
  return 1 + getDivineTotalAdaptationStacks(fighter) * divineGeneralAdaptReduction;
}

function getDivineWorldCutDamage(fighter) {
  const stacks = getDivineTotalAdaptationStacks(fighter);
  if (stacks <= 0) return 0;
  return stacks * divineWorldCutDamagePerStack;
}

function getDominantDivineAdaptation(fighter) {
  if (!fighter || !fighter.divineAdaptations) return null;

  return Object.entries(fighter.divineAdaptations).reduce((best, [damageType, stacks]) => {
    const normalizedStacks = Math.max(0, Number(stacks) || 0);
    if (normalizedStacks <= 0) return best;
    if (!best || normalizedStacks > best.stacks) return { damageType, stacks: normalizedStacks };
    return best;
  }, null);
}

function getDivineCounterType(attacker, target) {
  const dominantAdaptation = getDominantDivineAdaptation(attacker);
  if (dominantAdaptation) return dominantAdaptation.damageType;
  return getDamageType(target, true, null);
}

function getDivineCounterFamily(counterType) {
  if (counterType.includes('fire')) return 'fire';
  if (counterType.includes('bullet') || counterType.includes('ballistic')) return 'ballistic';
  if (counterType.includes('shell')) return 'shell';
  if (counterType.includes('arcane') || counterType.includes('gravity')) return 'arcane';
  if (counterType.includes('temporal')) return 'temporal';
  if (counterType.includes('spirit') || counterType.includes('ghost')) return 'spirit';
  if (counterType.includes('luck')) return 'luck';
  if (counterType.includes('prism')) return 'prism';
  return 'melee';
}

function getDivineAdaptationStacksByFamily(fighter, family) {
  if (!fighter || !fighter.divineAdaptations) return 0;

  return Object.entries(fighter.divineAdaptations).reduce((total, [damageType, stacks]) => {
    if (getDivineCounterFamily(damageType) !== family) return total;
    return total + Math.max(0, Number(stacks) || 0);
  }, 0);
}

function applyDamage(attacker, target, damage, { isSpecial = false, ignoreDebug = false, ignoreInvincible = false, recordStats = true, damageType = null } = {}) {
  if (!ignoreInvincible && target.gamblerInvincibleTimer > 0) return 0;
  if (!ignoreInvincible && target.ghostPhaseTimer > 0) return 0;

  // Shang Ting's iron mountain stance
  if (tryShaolinCounter(target, attacker)) return 0;
  const resolvedDamageType = getDamageType(attacker, isSpecial, damageType);
  if (!ignoreInvincible && target.characterType === 'divineGeneral' && target.divineAdaptTimer > 0) {
    recordDivineAdaptation(target, resolvedDamageType);
    return 0;
  }

  const icedThugArmorMultiplier = target.secretVariant === 'icedThug'
    ? fireArcadeMiniBossDamageTakenMultiplier
    : isIceMaster(target)
      ? iceMasterDamageTakenMultiplier
      : (hybridEnemyTypes[target.secretVariant] && hybridEnemyTypes[target.secretVariant].damageTakenMultiplier) || 1;
  const frostVulnerabilityMultiplier = target.icedVulnerableTimer > 0 ? icedThugFrostVulnerability : 1;
  const scamMultiplier = (target.scamVulnerableTimer > 0 ? scamVulnerableMultiplier : 1) * (attacker && attacker.scamWeakTimer > 0 ? scamWeakDamageMultiplier : 1);
  const omegariusArmorMultiplier = (target.omegariusArmorPlus ? omegariusArmorPlusDamageTaken : 1) * (target.secretVariant === 'neoScammer' ? neoScammerDamageTaken : 1);
  // the Knight's shield wall stops most of the damage
  // (the Knight in the middle of his Juicio del Rey has super armor)
  const knightShieldMultiplier = (target.knightShieldTimer > 0 ? knightShieldDamageTaken : 1) * (target.mochiShieldTimer > 0 ? 0.5 : 1) * (target.knightSlam ? knightSlamArmor : 1);
  if (target.knightShieldTimer > 0 && damage > 0) {
    target.knightBlockFlash = 14;
    playSound('robotHit');
  }
  // the spirits of Robledal (chapter 5, level 7) also protect whoever carries them
  // (with all six spirits, after Light Warrior gives his away, even more)
  const spiritArmorMultiplier = target.spiritCount > 3 ? omegaSpiritArmor : target.spiritCount > 0 ? spiritDamageTakenMultiplier : 1;
  const spiritPowerMultiplier = attacker && attacker.spiritCount > 3 ? omegaSpiritDamageBoost : 1;
  // level 8: Knight takes Shadow Jester's hits better
  const riftArmorMultiplier = target.riftResolve ? riftKnightArmor : 1;
  // the big friend of the special chapter barely feels the hits
  const bigFriendArmorMultiplier = target.secretVariant === 'bigFriend' ? bigFriendDamageTaken : 1;
  const targetDamageMultiplier = icedThugArmorMultiplier * frostVulnerabilityMultiplier * scamMultiplier * omegariusArmorMultiplier * knightShieldMultiplier * spiritArmorMultiplier * spiritPowerMultiplier * riftArmorMultiplier * bigFriendArmorMultiplier;
  const adaptedDamage = getDivineAdaptedDamage(target, damage * targetDamageMultiplier, resolvedDamageType);
  const previousHealth = Math.max(0, target.health);
  const healthBeforeHit = target.health;
  target.health = Math.max(0, target.health - (ignoreDebug ? adaptedDamage : getDebugDamage(adaptedDamage, attacker)));
  originsDamageFloor(target);
  routeBDamageFloor(target);
  routeB3DamageFloor(target);
  // Scammer's vampire fangs: player 1 drinks 10% of the damage dealt
  if (attacker === player1 && target !== attacker && scammerShop.owned.vampireFangs && attacker.health > 0) {
    attacker.health = Math.min(attacker.maxHealth, attacker.health + (healthBeforeHit - target.health) * 0.1);
  }
  // chapter 5, level 7: Light Warrior holds on until his last BOX ATTACK is over
  if (target === player2 && typeof isLightBoxFight === 'function' && isLightBoxFight() && !target.lightFinaleDone) {
    target.health = Math.max(target.health, target.maxHealth * lightWarriorBoxFloorRatio);
  }
  // ...and OMEGA LIGHT WARRIOR only falls with the clash
  if (target === player2 && omegaKickFight.active && !omegaKickFight.won) target.health = Math.max(target.health, 1);
  if (target === player2 && typeof isRiftFight === 'function' && isRiftFight()) target.health = Math.max(target.health, 1);
  if (jesterNeedsFinalAct(target)) target.health = Math.max(1, target.health);
  if (isCh6ProtectedChrono(target)) target.health = Math.max(1, target.health);
  // the Bestia del Musgo never falls before Light Warrior shows up
  if (target.secretVariant === 'mossBeast' && normalArcadeActive && !target.mossRescued) target.health = Math.max(1, target.health);
  // the sheriff stays at 1 health: first until his last stand starts, then for the whole 25 seconds
  if (target.sheriffBadge && normalArcadeActive && arcadeChapter === 'knight' && !target.sheriffStandOver) target.health = Math.max(1, target.health);
  // during the last stand every hit on the sheriff gives Knight a little health back
  if (target.sheriffStandActive && target.sheriffBadge && normalArcadeActive && attacker === player1 && previousHealth > 0) {
    const heal = target.sheriffFurious ? sheriffFuriousHealPerHit : sheriffStandHealPerHit;
    attacker.health = Math.min(attacker.maxHealth, attacker.health + heal);
    attacker.sheriffHealFx = 20;
    attacker.sheriffHealAmount = heal;
  }
  // Mochi never falls before calling the chef
  if (target.secretVariant === 'mochiMouse' && normalArcadeActive && !target.mochiChefCalled) target.health = Math.max(1, target.health);
  // the guard of the farol does not fall in the fight itself (his end is in the scene at 10%)
  if (target.secretVariant === 'lanternGuard' && normalArcadeActive && !target.guardFallen) target.health = Math.max(1, target.health);
  // the dark captain never falls before making his offer
  if (target.secretVariant === 'darkKnightBoss' && normalArcadeActive && !target.darkDealDone) target.health = Math.max(1, target.health);
  // Omegarius never lets the sparring end before it has stopped to help Reflecter
  if (isOmegariusMercyPending(target)) target.health = Math.max(1, target.health);
  // Omegarius cannot fall in the middle of its secret ability
  if (target.omegariusSecretActive) target.health = Math.max(1, target.health);
  // NEO SCAMMER holds on at 10 health until his ULTIMA OFERTA
  if (target.secretVariant === 'neoScammer' && scamChallenge.active && !target.neoFinalUsed) target.health = Math.max(neoScammerFinalHealth, target.health);
  // Omegarius holds on at 10 health until it has used its final act
  // (in versus only when the bot plays it, so a human Omegarius is never stuck at 10)
  if (isOmegarius(target) && (isOmegariusSparring() || (target === player2 && botEnabled)) && !target.omegariusFinalUsed) target.health = Math.max(omegariusFinalHealth, target.health);
  const actualDamage = previousHealth - target.health;

  if (actualDamage > 0) {
    recordDivineAdaptation(target, resolvedDamageType);
  }

  if (actualDamage > 0 && recordStats) {
    const stats = getPlayerStats(attacker);
    const targetStats = getPlayerStats(target);
    stats.damageDealt += actualDamage;
    targetStats.damageTaken += actualDamage;
    stats.hitsLanded += 1;
    if (isSpecial) {
      stats.specialsLanded += 1;
    }
    if (attacker.characterType === 'chrono' && target.chronoTimeStopTimer > 0) {
      fightAchievementFlags.timeStopDamageBy = attacker;
    }
  }

  return actualDamage;
}

function resetDesertCowboyDuel() {
  desertCowboyDuel.requiredStillFrames =
    desertCowboyDuelMinStillFrames +
    Math.floor(Math.random() * (desertCowboyDuelMaxStillFrames - desertCowboyDuelMinStillFrames + 1));
  desertCowboyDuel.stillFrames = 0;
  desertCowboyDuel.countdownFrames = 0;
  desertCowboyDuel.active = false;
  desertCowboyDuel.p1BulletAvailable = false;
  desertCowboyDuel.p2BulletAvailable = false;
}

function resetTankClash() {
  tankClash.closeFrames = 0;
  tankClash.active = false;
  tankClash.alertFrames = 0;
  tankClash.p1ShellAvailable = false;
  tankClash.p2ShellAvailable = false;
}

function resetArcaneRift() {
  arcaneRift.activeFrames = 0;
  arcaneRift.alertFrames = 0;
}

function resetMirrorCollapse() {
  mirrorCollapse.activeFrames = 0;
  mirrorCollapse.alertFrames = 0;
}

function resetCasinoRoyale() {
  casinoRoyale.triggered = false;
  casinoRoyale.activeFrames = 0;
  casinoRoyale.alertFrames = 0;
  casinoLuckyTileIndex = 2;
  casinoTileShiftTimer = casinoTileShiftFrames;
}

function resetManaMeltdown() {
  manaMeltdown.triggered = false;
  manaMeltdown.activeFrames = 0;
  manaMeltdown.alertFrames = 0;
}

function resetPrismOverdrive() {
  prismOverdrive.player1Uses = 0;
  prismOverdrive.player2Uses = 0;
  prismOverdrive.activeFrames = 0;
  prismOverdrive.alertFrames = 0;
}

function resetAbsoluteAdaptation() {
  absoluteAdaptation.triggered = false;
  absoluteAdaptation.activeFrames = 0;
  absoluteAdaptation.alertFrames = 0;
}

function resetFightEvents() {
  resetDesertCowboyDuel();
  resetTankClash();
  resetArcaneRift();
  resetMirrorCollapse();
  resetCasinoRoyale();
  resetManaMeltdown();
  resetPrismOverdrive();
  resetAbsoluteAdaptation();
  resetMapTerrainState();
}

function isDesertCowboyDuelMatch() {
  return (
    selectedMap === 'desert' &&
    player1.characterType === 'cowboy' &&
    player2.characterType === 'cowboy' &&
    !botEnabled
  );
}

function isFighterStill(fighter) {
  return Math.abs(fighter.velocity.x) < 0.05 && Math.abs(fighter.velocity.y) < 0.05;
}

function isDesertCowboyDuelPreparing() {
  return isDesertCowboyDuelMatch() && !desertCowboyDuel.active;
}

function isDesertCowboyDuelVisualActive() {
  return (
    isDesertCowboyDuelMatch() &&
    (desertCowboyDuel.stillFrames > 0 || desertCowboyDuel.countdownFrames > 0 || desertCowboyDuel.active)
  );
}

function isTankClashMatch() {
  return selectedMap === 'military' && player1.characterType === 'tank' && player2.characterType === 'tank';
}

function updateTankClash() {
  if (!isTankClashMatch() || gameOver) {
    resetTankClash();
    return;
  }

  if (tankClash.alertFrames > 0) tankClash.alertFrames -= 1;
  if (tankClash.active) return;

  const p1CenterX = player1.position.x + player1.width / 2;
  const p2CenterX = player2.position.x + player2.width / 2;
  const closeEnough = Math.abs(p1CenterX - p2CenterX) < 210;
  const bothGrounded = player1.velocity.y === 0 && player2.velocity.y === 0;

  if (closeEnough && bothGrounded) {
    tankClash.closeFrames += 1;
    if (tankClash.closeFrames >= tankClashRequiredFrames) {
      tankClash.active = true;
      tankClash.alertFrames = 210;
      fightAchievementFlags.tankClashActive = true;
      tankClash.p1ShellAvailable = true;
      tankClash.p2ShellAvailable = true;
      player1.tankShellCooldown = 0;
      player2.tankShellCooldown = 0;
    }
  } else {
    tankClash.closeFrames = 0;
  }
}

function isArcaneRiftMatch() {
  return (
    selectedMap === 'neon' &&
    ((player1.characterType === 'sorcerer' && player2.characterType === 'reflecter') ||
      (player1.characterType === 'reflecter' && player2.characterType === 'sorcerer'))
  );
}

function triggerArcaneRift() {
  if (!isArcaneRiftMatch()) return;

  arcaneRift.activeFrames = getDebugDuration(arcaneRiftDuration);
  arcaneRift.alertFrames = 210;
  player1.sorcererOrbCooldown = 0;
  player1.sorcererGravityCooldown = 0;
  player1.copycatShieldCooldown = 0;
  player2.sorcererOrbCooldown = 0;
  player2.sorcererGravityCooldown = 0;
  player2.copycatShieldCooldown = 0;
}

function updateArcaneRift() {
  if (!isArcaneRiftMatch() || gameOver) {
    resetArcaneRift();
    return;
  }

  if (arcaneRift.activeFrames > 0) arcaneRift.activeFrames -= 1;
  if (arcaneRift.alertFrames > 0) arcaneRift.alertFrames -= 1;
}

function getArcaneRiftOrbDamage() {
  return arcaneRift.activeFrames > 0 ? arcaneRiftOrbDamage : sorcererOrbDamage;
}

function isMirrorCollapseMatch() {
  return (
    (player1.characterType === 'sorcerer' && player2.characterType === 'reflecter') ||
    (player1.characterType === 'reflecter' && player2.characterType === 'sorcerer')
  );
}

function triggerMirrorCollapse(reflecter, sorcerer) {
  if (!isMirrorCollapseMatch()) return;

  mirrorCollapse.activeFrames = getDebugDuration(mirrorCollapseDuration);
  mirrorCollapse.alertFrames = 210;
  if (reflecter) reflecter.copycatShieldCooldown = 0;
  if (sorcerer) {
    sorcerer.sorcererSecretOrbCooldown = 0;
    sorcerer.sorcererGravityCooldown = 0;
  }
}

function updateMirrorCollapse() {
  if (!isMirrorCollapseMatch() || gameOver) {
    resetMirrorCollapse();
    return;
  }

  if (mirrorCollapse.activeFrames > 0) mirrorCollapse.activeFrames -= 1;
  if (mirrorCollapse.alertFrames > 0) mirrorCollapse.alertFrames -= 1;
}

function getSorcererSecretOrbDamage(orb) {
  const mirrorMultiplier = orb && orb.mirrorCollapsed ? mirrorCollapseSecretDamageMultiplier : 1;
  return sorcererSecretOrbDamage * mirrorMultiplier;
}

function isCasinoRoyaleMatch() {
  return selectedMap === 'casino' && player1.characterType === 'gambler' && player2.characterType === 'gambler' && !botEnabled;
}

function triggerCasinoRoyale() {
  casinoRoyale.triggered = true;
  casinoRoyale.activeFrames = getDebugDuration(casinoRoyaleDuration);
  casinoRoyale.alertFrames = 210;
  fightAchievementFlags.casinoRoyaleActive = true;
  [player1, player2].forEach((fighter) => {
    fighter.gamblerLuckBonus = Math.min(gamblerLuckCap, fighter.gamblerLuckBonus + casinoRoyaleLuckBonus);
    fighter.gamblerRollCooldown = 0;
    fighter.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(fighter);
  });
}

function updateCasinoRoyale() {
  if (!isCasinoRoyaleMatch() || gameOver) {
    if (!isCasinoRoyaleMatch()) resetCasinoRoyale();
    return;
  }

  if (casinoRoyale.activeFrames > 0) casinoRoyale.activeFrames -= 1;
  if (casinoRoyale.alertFrames > 0) casinoRoyale.alertFrames -= 1;
  if (casinoRoyale.triggered) return;

  if (player1.gamblerLuckBonus >= casinoRoyaleRequiredLuck && player2.gamblerLuckBonus >= casinoRoyaleRequiredLuck) {
    triggerCasinoRoyale();
  }
}

function isManaMeltdownMatch() {
  return (
    selectedMap === 'foundry' &&
    ((player1.characterType === 'fireMaster' && player2.characterType === 'sorcerer') ||
      (player1.characterType === 'sorcerer' && player2.characterType === 'fireMaster'))
  );
}

function triggerManaMeltdown() {
  manaMeltdown.triggered = true;
  manaMeltdown.activeFrames = getDebugDuration(manaMeltdownDuration);
  manaMeltdown.alertFrames = 210;
  fightAchievementFlags.manaMeltdownActive = true;
  player1.specialCooldown = 0;
  player1.fireBeamCooldown = 0;
  player1.sorcererOrbCooldown = 0;
  player1.sorcererGravityCooldown = 0;
  player2.specialCooldown = 0;
  player2.fireBeamCooldown = 0;
  player2.sorcererOrbCooldown = 0;
  player2.sorcererGravityCooldown = 0;
}

function updateManaMeltdown() {
  if (!isManaMeltdownMatch() || gameOver) {
    if (!isManaMeltdownMatch()) resetManaMeltdown();
    return;
  }

  if (manaMeltdown.activeFrames > 0) manaMeltdown.activeFrames -= 1;
  if (manaMeltdown.alertFrames > 0) manaMeltdown.alertFrames -= 1;
  if (manaMeltdown.triggered) return;

  const firePressure = fireballs.length > 0 || fireBeams.length > 0;
  const magicPressure = sorcererOrbs.length > 0 || sorcererGravityOrbs.length > 0 || sorcererSecretOrbs.length > 0;
  if (firePressure && magicPressure) {
    triggerManaMeltdown();
  }
}

function getElementalEventDamage(attacker, damage) {
  if (
    manaMeltdown.activeFrames > 0 &&
    (attacker.characterType === 'fireMaster' || attacker.characterType === 'sorcerer')
  ) {
    return damage * manaMeltdownDamageMultiplier;
  }

  return damage;
}

function isPrismOverdriveMatch() {
  return selectedMap === 'neon' && player1.characterType === 'switcher' && player2.characterType === 'switcher';
}

function triggerPrismOverdrive() {
  prismOverdrive.activeFrames = getDebugDuration(prismOverdriveDuration);
  prismOverdrive.alertFrames = 210;
  fightAchievementFlags.prismOverdriveActive = true;
  unlockAchievement('prismDriver');
  player1.switcherAbilityCooldown = 0;
  player2.switcherAbilityCooldown = 0;
}

function recordPrismSwitcherUse(attacker) {
  if (!isPrismOverdriveMatch() || gameOver || isPrismOverdriveActive() || attacker.characterType !== 'switcher') return;

  if (attacker === player1) {
    prismOverdrive.player1Uses += 1;
  } else if (attacker === player2) {
    prismOverdrive.player2Uses += 1;
  }

  if (prismOverdrive.player1Uses >= prismOverdriveRequiredUses && prismOverdrive.player2Uses >= prismOverdriveRequiredUses) {
    triggerPrismOverdrive();
  }
}

function updatePrismOverdrive() {
  if (!isPrismOverdriveMatch() || gameOver) {
    if (!isPrismOverdriveMatch()) resetPrismOverdrive();
    return;
  }

  if (prismOverdrive.activeFrames > 0) prismOverdrive.activeFrames -= 1;
  if (prismOverdrive.alertFrames > 0) prismOverdrive.alertFrames -= 1;
}

function isAbsoluteAdaptationMatch() {
  return (
    selectedMap === 'darkRoom' &&
    ((player1.characterType === 'divineGeneral' && player2.characterType === 'chrono') ||
      (player1.characterType === 'chrono' && player2.characterType === 'divineGeneral'))
  );
}

function getAbsoluteAdaptationFighters() {
  const divine = player1.characterType === 'divineGeneral' ? player1 : player2.characterType === 'divineGeneral' ? player2 : null;
  const chrono = player1.characterType === 'chrono' ? player1 : player2.characterType === 'chrono' ? player2 : null;
  return { divine, chrono };
}

function triggerAbsoluteAdaptation() {
  if (!isAbsoluteAdaptationMatch()) return;

  const { divine, chrono } = getAbsoluteAdaptationFighters();
  absoluteAdaptation.triggered = true;
  absoluteAdaptation.activeFrames = getDebugDuration(absoluteAdaptationDuration);
  absoluteAdaptation.alertFrames = 210;

  fillDivineAdaptations(divine, 2);
  if (divine) {
    divine.divineAdaptCooldown = 0;
    divine.divineCounterCooldown = 0;
    divine.divineAdaptTimer = Math.max(divine.divineAdaptTimer, getDebugDuration(60, divine));
  }
  if (chrono) {
    chrono.chronoBladeCooldown = 0;
    chrono.chronoSlowCooldown = 0;
    chrono.chronoTimeStopCooldown = 0;
  }
  playSound('secretOrb');
}

function updateAbsoluteAdaptation() {
  if (!isAbsoluteAdaptationMatch() || gameOver) {
    if (!isAbsoluteAdaptationMatch()) resetAbsoluteAdaptation();
    return;
  }

  if (absoluteAdaptation.activeFrames > 0) absoluteAdaptation.activeFrames -= 1;
  if (absoluteAdaptation.alertFrames > 0) absoluteAdaptation.alertFrames -= 1;
  if (absoluteAdaptation.triggered) return;

  const { divine } = getAbsoluteAdaptationFighters();
  if (divine && getDivineTotalAdaptationStacks(divine) >= absoluteAdaptationRequiredStacks) {
    triggerAbsoluteAdaptation();
  }
}

function getFighterCenterX(fighter) {
  return fighter.position.x + fighter.width / 2;
}

function isFighterGrounded(fighter) {
  return fighter.position.y + fighter.height >= ground - 1 && Math.abs(fighter.velocity.y) < 0.1;
}

function isCenterInRange(fighter, minX, maxX) {
  const centerX = getFighterCenterX(fighter);
  return centerX >= minX && centerX <= maxX;
}

function applyTerrainMoveModifiers() {
  if (selectedMap === 'alpha') return;

  [player1, player2].forEach((fighter) => {
    if (!isFighterGrounded(fighter)) return;

    if (
      selectedMap === 'desert' &&
      (isCenterInRange(fighter, 0, 250) || isCenterInRange(fighter, 760, canvas.width))
    ) {
      fighter.velocity.x *= 0.88;
    } else if (selectedMap === 'neon' && isCenterInRange(fighter, 364, 660)) {
      fighter.velocity.x *= 1.35;
    } else if (
      selectedMap === 'clockTower' &&
      fighter.characterType !== 'chrono' &&
      isCenterInRange(fighter, clockTowerZoneStart, clockTowerZoneEnd)
    ) {
      fighter.velocity.x *= clockTowerSlowFactor;
    } else if (
      selectedMap === 'military' &&
      (isCenterInRange(fighter, 64, 282) || isCenterInRange(fighter, 714, 952))
    ) {
      fighter.velocity.x *= 0.72;
    }
  });
}

function updateCasinoTerrain() {
  if (selectedMap !== 'casino') return;

  casinoTileShiftTimer -= 1;
  if (casinoTileShiftTimer <= 0) {
    casinoLuckyTileIndex = (casinoLuckyTileIndex + 1) % 5;
    casinoTileShiftTimer = casinoTileShiftFrames;
  }

  const tileWidth = canvas.width / 5;
  const tileStart = casinoLuckyTileIndex * tileWidth;
  const tileEnd = tileStart + tileWidth;

  [player1, player2].forEach((fighter) => {
    if (!isFighterGrounded(fighter) || fighter.terrainEffectCooldown > 0 || !isCenterInRange(fighter, tileStart, tileEnd)) {
      return;
    }

    if (fighter.characterType === 'gambler') {
      fighter.gamblerLuckBonus = Math.min(gamblerLuckCap, fighter.gamblerLuckBonus + 0.08);
      fighter.gamblerRollCooldown = Math.max(0, fighter.gamblerRollCooldown - 90);
      fighter.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(fighter);
    } else {
    fighter.health = Math.min(fighter.maxHealth, fighter.health + getDebugMaxHealth(4, fighter));
    }
    fighter.terrainEffectCooldown = terrainEffectCooldownFrames;
  });
}

function resetMapTerrainState() {
  arcaneRuneIndex = 1;
  arcaneRuneTimer = arcaneRuneShiftFrames;
  ruinsEruption.timer = ruinsEruptionInterval;
  ruinsEruption.warnTimer = 0;
  ruinsEruption.flashTimer = 0;
  jungleBananas = [];
  jungleBananaTimer = 240;
}

function reduceFighterAbilityCooldowns(fighter, amount) {
  const ignoredCooldowns = ['terrainEffectCooldown', 'basicAttackCooldown', 'strongAttackCooldown', 'tankAttackCooldown'];
  Object.keys(fighter).forEach((key) => {
    if (!key.endsWith('Cooldown') || ignoredCooldowns.includes(key)) return;
    if (typeof fighter[key] !== 'number' || fighter[key] <= 0) return;
    fighter[key] = Math.max(0, fighter[key] - amount);
  });
}

function updateArcaneLibraryTerrain() {
  if (selectedMap !== 'arcaneLibrary') return;

  arcaneRuneTimer -= 1;
  if (arcaneRuneTimer <= 0) {
    const nextSpots = arcaneRuneSpots.map((spot, index) => index).filter((index) => index !== arcaneRuneIndex);
    arcaneRuneIndex = nextSpots[Math.floor(Math.random() * nextSpots.length)];
    arcaneRuneTimer = arcaneRuneShiftFrames;
  }

  const runeX = arcaneRuneSpots[arcaneRuneIndex];
  [player1, player2].forEach((fighter) => {
    if (!isFighterGrounded(fighter) || fighter.terrainEffectCooldown > 0) return;
    if (!isCenterInRange(fighter, runeX - arcaneRuneRadius, runeX + arcaneRuneRadius)) return;
    const bonus = fighter.characterType === 'sorcerer' ? 2 : 1;
    reduceFighterAbilityCooldowns(fighter, arcaneRuneCooldownReduction * bonus);
    fighter.terrainEffectCooldown = terrainEffectCooldownFrames;
  });
}

function updateAncientRuinsTerrain() {
  if (selectedMap !== 'ancientRuins' || gameOver) return;

  if (ruinsEruption.flashTimer > 0) ruinsEruption.flashTimer -= 1;

  if (ruinsEruption.warnTimer > 0) {
    ruinsEruption.warnTimer -= 1;
    if (ruinsEruption.warnTimer === 0) strikeRuinsEruption();
    return;
  }

  ruinsEruption.timer -= 1;
  if (ruinsEruption.timer <= 0) {
    const markedFighter = Math.random() < 0.5 ? player1 : player2;
    ruinsEruption.x = Math.max(ruinsEruptionHalfWidth, Math.min(canvas.width - ruinsEruptionHalfWidth, getFighterCenterX(markedFighter)));
    ruinsEruption.warnTimer = ruinsEruptionWarning;
    ruinsEruption.timer = ruinsEruptionInterval;
  }
}

function strikeRuinsEruption() {
  ruinsEruption.flashTimer = 26;
  playSound('tankShell');
  [player1, player2].forEach((fighter) => {
    if (fighter.health <= 0 || fighter.characterType === 'divineGeneral') return;
    if (!isCenterInRange(fighter, ruinsEruption.x - ruinsEruptionHalfWidth, ruinsEruption.x + ruinsEruptionHalfWidth)) return;
    applyDamage(getOpponent(fighter), fighter, ruinsEruptionDamage, { isSpecial: true, recordStats: false, damageType: 'ruinsEruption' });
    fighter.velocity.y = getDebugKnockback(-8, fighter);
  });
}

function updateJungleTerrain() {
  if (selectedMap !== 'jungle' || gameOver) return;

  jungleBananaTimer -= 1;
  if (jungleBananaTimer <= 0 && jungleBananas.length < jungleBananaMaxActive) {
    jungleBananas.push({ x: 90 + Math.random() * (canvas.width - 180), y: 150, velocityY: 0, width: 26, height: 18, landed: false });
    jungleBananaTimer = jungleBananaInterval;
  }

  jungleBananas.forEach((banana) => {
    if (!banana.landed) {
      banana.velocityY += 0.4;
      banana.y += banana.velocityY;
      if (banana.y + banana.height >= ground) {
        banana.y = ground - banana.height;
        banana.landed = true;
      }
    }

    [player1, player2].forEach((fighter) => {
      if (banana.picked || fighter.health <= 0) return;
      if (!rectangularCollision({ rectangle1: banana, rectangle2: fighter })) return;
      const isMonkey = fighter.characterType === 'monkey';
      const heal = getDebugMaxHealth(isMonkey ? jungleBananaMonkeyHeal : jungleBananaHeal, fighter);
      fighter.health = Math.min(fighter.maxHealth, fighter.health + heal);
      if (isMonkey) reduceFighterAbilityCooldowns(fighter, 60);
      banana.picked = true;
      playSound('menuSelect');
    });
  });

  jungleBananas = jungleBananas.filter((banana) => !banana.picked);
}

function updateTerrainInteractions() {
  if (selectedMap === 'alpha') return;

  updateCasinoTerrain();
  updateArcaneLibraryTerrain();
  updateAncientRuinsTerrain();
  updateJungleTerrain();
}

function updateDesertCowboyDuel() {
  if (!isDesertCowboyDuelMatch() || gameOver) {
    resetDesertCowboyDuel();
    return;
  }

  if (desertCowboyDuel.active) return;

  if (desertCowboyDuel.countdownFrames > 0) {
    desertCowboyDuel.countdownFrames -= 1;
    if (desertCowboyDuel.countdownFrames === 0) {
      desertCowboyDuel.active = true;
      desertCowboyDuel.p1BulletAvailable = true;
      desertCowboyDuel.p2BulletAvailable = true;
      player1.cowboyBurstShotsRemaining = 0;
      player2.cowboyBurstShotsRemaining = 0;
      player1.cowboyBurstCooldown = 0;
      player2.cowboyBurstCooldown = 0;
    }
    return;
  }

  if (isFighterStill(player1) && isFighterStill(player2)) {
    desertCowboyDuel.stillFrames += 1;
    if (desertCowboyDuel.stillFrames >= desertCowboyDuel.requiredStillFrames) {
      desertCowboyDuel.countdownFrames = desertCowboyDuelCountdownFrames;
    }
  } else {
    desertCowboyDuel.stillFrames = 0;
  }
}

function getDesertCowboyDuelMessage() {
  if (!isDesertCowboyDuelMatch() || gameOver || desertCowboyDuel.active) return null;

  if (desertCowboyDuel.countdownFrames > 0) {
    const secondsLeft = Math.max(1, Math.ceil(desertCowboyDuel.countdownFrames / 60));
    return {
      title: 'Solo requerira una bala para acabar con el otro.',
      subtitle: secondsLeft === 1 ? 'LISTOS... DISPARA' : `LISTOS... ${secondsLeft}`,
    };
  }

  return null;
}

function drawDesertCowboyDuelAlert() {
  const message = getDesertCowboyDuelMessage();
  if (!message) return;

  ctx.save();
  ctx.fillStyle = 'rgba(17, 17, 17, 0.82)';
  ctx.fillRect(210, 184, 604, 96);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 5;
  ctx.strokeRect(210, 184, 604, 96);
  ctx.fillStyle = '#fff';
  ctx.font = '900 22px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(message.title, canvas.width / 2, 222);
  ctx.font = '900 24px Courier New, monospace';
  ctx.fillText(message.subtitle, canvas.width / 2, 254);
  ctx.restore();
}

function drawTankClashAlert() {
  if (tankClash.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(20, 24, 18, 0.86)';
  ctx.fillRect(252, 184, 520, 90);
  ctx.strokeStyle = '#ffeb3b';
  ctx.lineWidth = 5;
  ctx.strokeRect(252, 184, 520, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHOQUE DE TITANES', canvas.width / 2, 220);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('El proximo canon de cada Tank queda sobrecargado.', canvas.width / 2, 250);
  ctx.restore();
}

function drawArcaneRiftAlert() {
  if (arcaneRift.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(12, 8, 28, 0.88)';
  ctx.fillRect(234, 184, 556, 90);
  ctx.strokeStyle = '#ce93d8';
  ctx.lineWidth = 5;
  ctx.strokeRect(234, 184, 556, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RUPTURA ARCANA', canvas.width / 2, 220);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('La magia reflejada potencia las esferas rojas.', canvas.width / 2, 250);
  ctx.restore();
}

function drawMirrorCollapseAlert() {
  if (mirrorCollapse.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(7, 13, 32, 0.9)';
  ctx.fillRect(224, 294, 576, 86);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 5;
  ctx.strokeRect(224, 294, 576, 86);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 2;
  ctx.strokeRect(236, 306, 552, 62);
  ctx.fillStyle = '#fff';
  ctx.font = '900 24px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COLAPSO ESPEJO', canvas.width / 2, 328);
  ctx.font = '900 15px Courier New, monospace';
  ctx.fillText('La esfera secreta reflejada vuelve inestable el duelo.', canvas.width / 2, 356);
  ctx.restore();
}

function drawCasinoRoyaleAlert() {
  if (casinoRoyale.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(4, 20, 12, 0.88)';
  ctx.fillRect(242, 184, 540, 90);
  ctx.strokeStyle = '#66ff80';
  ctx.lineWidth = 5;
  ctx.strokeRect(242, 184, 540, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CASINO ROYALE', canvas.width / 2, 220);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Ambos Gambler ganan suerte y ruleta lista.', canvas.width / 2, 250);
  ctx.restore();
}

function drawManaMeltdownAlert() {
  if (manaMeltdown.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(36, 12, 8, 0.88)';
  ctx.fillRect(232, 184, 560, 90);
  ctx.strokeStyle = '#ff8f00';
  ctx.lineWidth = 5;
  ctx.strokeRect(232, 184, 560, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MANA MELTDOWN', canvas.width / 2, 220);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Fuego y magia hacen mas dano temporalmente.', canvas.width / 2, 250);
  ctx.restore();
}

function drawPrismOverdriveAlert() {
  if (prismOverdrive.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(8, 14, 28, 0.88)';
  ctx.fillRect(232, 184, 560, 90);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 5;
  ctx.strokeRect(232, 184, 560, 90);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 2;
  ctx.strokeRect(244, 196, 536, 66);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PRISM OVERDRIVE', canvas.width / 2, 220);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Switcher acelera sus cambios y habilidades.', canvas.width / 2, 250);
  ctx.restore();
}

function drawAbsoluteAdaptationAlert() {
  if (absoluteAdaptation.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(5, 7, 12, 0.9)';
  ctx.fillRect(216, 294, 592, 92);
  ctx.strokeStyle = '#e0f7fa';
  ctx.lineWidth = 5;
  ctx.strokeRect(216, 294, 592, 92);
  ctx.strokeStyle = '#ce93d8';
  ctx.lineWidth = 2;
  ctx.strokeRect(230, 308, 564, 64);
  ctx.fillStyle = '#fff';
  ctx.font = '900 25px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ABSOLUTE ADAPTATION', canvas.width / 2, 330);
  ctx.font = '900 15px Courier New, monospace';
  ctx.fillText('Divine entiende el tiempo; Chrono recupera sus herramientas.', canvas.width / 2, 358);
  ctx.restore();
}

function formatFightDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getVictoryPhrase(fighter, opponent) {
  if (fighter.fleeTaunt) return 'Creiste que iba a ser asi de facil?';
  if (fighter.flametombTrauma) return '...Lo siento. Lo siento mucho.';
  if (fighter.secretVariant === 'frostFire') return getFrostFireVictoryPhrase(opponent);
  if (fighter.frostFire && (isNeoScammer(opponent) || opponent.scammerBurnt)) return '...Perdon, Scammer. No podia parar.';
  if (fighter.frostFire) return ['...Ni siquiera se donde estoy.', 'Mis manos siguen frias.', 'Gambler... quien sea que seas... donde estas?'][Math.floor(Math.random() * 3)];
  if (fighter.youngScammer) return pickOriginsWinPhrase(opponent);
  if (isFriendThing(fighter)) return fighter.secretVariant === 'bigFriend' ? 'JE. JE. JE.' : 'Je je je... je.';
  if (isPolice(fighter)) return originsPolicePhrases[Math.floor(Math.random() * originsPolicePhrases.length)];
  if (fighter.secretVariant === 'angryCustomer') return 'Y AHORA QUIERO DOS REEMBOLSOS!';
  if (fighter.secretVariant === 'shaolinMaster') {
    const shaolinPhrases = ['你还需要练习。(Te falta practicar.)', '承让。(Fue un honor... para vos.)', '回去练功吧。(Volve a entrenar.)'];
    return shaolinPhrases[Math.floor(Math.random() * shaolinPhrases.length)];
  }
  if (opponent && opponent.secretVariant === 'shaolinMaster') {
    if (fighter.characterType === 'monkey') return '谢谢指教，师父！(Gracias por la leccion, maestro!)';
    if (fighter.characterType === 'sorcerer') return 'Fue un honor, maestro. ...谢谢指教.';
    return 'No entendi nada de lo que dijo... pero gane!';
  }
  if (fighter.characterType === 'lightWarrior' && Math.random() < 0.01) {
    return 'Jarona!';
  }

  if (isKnight(fighter)) {
    // chapter 5: the win came thanks to Light Warrior
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 8) return '(Continuara...)';
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 7) return '...Gracias, Light Warrior.';
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 6) return '...Que hice?';
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 5) return 'Una recompensa por mi cabeza... Alguien me quiere fuera del camino.';
    // level 4 ends in the alley, with the new order from the Orden Sombria
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 4) return 'Destruir el Gran Farol... Que estoy haciendo?';
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 3) return 'Que pueblo tan... energico. Necesito descansar.';
    if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 2) return 'Un trato es un trato... por ahora.';
    if (normalArcadeActive && arcadeChapter === 'knight') return 'Gracias, guerrero de luz... La proxima la gano yo solo.';
    const knightPhrases = ['Por Valdoria! El honor sigue intacto.', 'Mi espada nunca descansa.', 'Una victoria digna de un caballero.'];
    return knightPhrases[Math.floor(Math.random() * knightPhrases.length)];
  }

  if (isShadowJester(fighter)) {
    const jesterPhrases = ['JA JA JA! OTRA RONDA, OTRA RONDA!', 'EL CAOS SIEMPRE GANA LA PARTIDA!', 'QUE DIVERTIDO! VOLVAMOS A JUGAR!'];
    return jesterPhrases[Math.floor(Math.random() * jesterPhrases.length)];
  }

  if (isScammer(fighter)) {
    const scamPhrases = [
      'Gracias por su compra! No se aceptan devoluciones.',
      'AHORA ES TU OPORTUNIDAD DE SER UN [[BIG SHOT]]!',
      'Tu suerte ahora es mia. Oferta por tiempo limitado.',
    ];
    return scamPhrases[Math.floor(Math.random() * scamPhrases.length)];
  }

  if (isIceMaster(fighter)) {
    const icePhrases = ['Tu fuego se apago antes de llegar a la cima.', 'El invierno siempre gana.', 'Quedate quieto, el hielo hara el resto.'];
    return icePhrases[Math.floor(Math.random() * icePhrases.length)];
  }

  if (isIceMaster(opponent) && fighter.characterType === 'fireMaster') {
    const meltPhrases = ['Ningun hielo resiste una llama de verdad.', 'La montaña ya no es tuya, Ice Master.'];
    return meltPhrases[Math.floor(Math.random() * meltPhrases.length)];
  }

  const phraseSet = victoryPhrases[fighter.characterType] || victoryPhrases.normal;
  const phrases = phraseSet[opponent.characterType] || phraseSet.default || victoryPhrases.normal.default;
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, currentY);
  }
}

function drawVictoryCharacter(fighter, x, y, scale = 1) {
  if (isShadowJester(fighter) || isKnight(fighter) || isMossBeast(fighter) || isDarkKnight(fighter) || isRobledalKid(fighter) || isMochi(fighter) || fighter.secretVariant === 'chefBoss' || fighter.secretVariant === 'lanternGuard' || fighter.secretVariant === 'shaolinMaster' || originsVariants.includes(fighter.secretVariant) || fighter.youngScammer) {
    // Shadow Jester, Knight and the Bestia del Musgo use their real sprite on the result screen
    const savedPosition = { ...fighter.position };
    const savedFacing = fighter.attacksToTheRight;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    fighter.position = { x: 0, y: 0 };
    fighter.attacksToTheRight = true;
    fighter.isAttacking = false;
    fighter.draw();
    ctx.restore();
    fighter.position = savedPosition;
    fighter.attacksToTheRight = savedFacing;
    return;
  }
  const width = fighter.characterType === 'tank' ? 96 * scale : 58 * scale;
  const height = fighter.characterType === 'tank' ? 150 * scale : 118 * scale;
  const bodyColor = fighter.characterType === 'switcher' ? fighter.getSwitcherModeColor() : fighter.color;

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(x + width * 0.16, y + height * 0.1, width * 0.2, height * 0.78);

  if (fighter.characterType === 'fireMaster') {
    if (isSuperFireMaster(fighter)) {
      ctx.fillStyle = '#ff8f00';
      ctx.fillRect(x + width * 0.12, y + height * 0.32, width * 0.76, height * 0.3);
      ctx.fillStyle = '#e65100';
      ctx.beginPath();
      ctx.moveTo(x + width * 0.16, y + height * 0.3);
      ctx.lineTo(x + width * 0.5, y + height * 0.52);
      ctx.lineTo(x + width * 0.3, y + height * 0.66);
      ctx.lineTo(x + width * 0.12, y + height * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + width * 0.84, y + height * 0.3);
      ctx.lineTo(x + width * 0.5, y + height * 0.52);
      ctx.lineTo(x + width * 0.7, y + height * 0.66);
      ctx.lineTo(x + width * 0.88, y + height * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.fillRect(x, y + height * 0.62, width, height * 0.11);
      ctx.fillStyle = '#ff6d00';
      ctx.beginPath();
      ctx.moveTo(x + width * 0.5, y + height * 0.63);
      ctx.lineTo(x + width * 0.61, y + height * 0.71);
      ctx.lineTo(x + width * 0.5, y + height * 0.75);
      ctx.lineTo(x + width * 0.39, y + height * 0.71);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f2c46d';
      ctx.beginPath();
      ctx.moveTo(x - width * 0.28, y + height * 0.06);
      ctx.lineTo(x + width * 0.5, y - height * 0.22);
      ctx.lineTo(x + width * 1.28, y + height * 0.06);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#6d4c1f';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();
      ctx.fillStyle = '#8d5d1d';
      ctx.fillRect(x - width * 0.2, y + height * 0.04, width * 1.4, height * 0.06);
    } else if (isIceMaster(fighter)) {
      ctx.fillStyle = '#3f3fc8';
      ctx.fillRect(x, y + height * 0.58, width, height * 0.14);
      ctx.fillStyle = '#9ff4ff';
      ctx.beginPath();
      ctx.moveTo(x + width * 0.2, y);
      ctx.lineTo(x + width * 0.32, y - height * 0.16);
      ctx.lineTo(x + width * 0.44, y);
      ctx.lineTo(x + width * 0.56, y - height * 0.2);
      ctx.lineTo(x + width * 0.68, y);
      ctx.lineTo(x + width * 0.8, y - height * 0.14);
      ctx.lineTo(x + width * 0.86, y);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(x + width * 0.25, y - height * 0.16, width * 0.5, height * 0.16);
      ctx.fillStyle = '#d84315';
      ctx.fillRect(x + width * 0.36, y - height * 0.09, width * 0.28, height * 0.09);
    }
  } else if (fighter.characterType === 'tank') {
    ctx.fillStyle = '#2f3526';
    ctx.fillRect(x + width * 0.08, y + height * 0.12, width * 0.84, height * 0.2);
    ctx.fillStyle = '#c9b458';
    ctx.fillRect(x + width * 0.7, y + height * 0.18, width * 0.52, height * 0.08);
    ctx.fillStyle = '#222';
    ctx.fillRect(x + width * 0.08, y + height * 0.82, width * 0.84, height * 0.12);
  } else if (fighter.characterType === 'cowboy') {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x - width * 0.12, y - height * 0.08, width * 1.24, height * 0.09);
    ctx.fillRect(x + width * 0.2, y - height * 0.2, width * 0.6, height * 0.13);
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(x + width, y + height * 0.36, width * 0.4, height * 0.08);
  } else if (fighter.characterType === 'reflecter') {
    ctx.strokeStyle = 'rgba(144, 202, 249, 0.82)';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(x - width * 0.18, y + height * 0.12, width * 1.36, height * 0.68);
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(x + width * 0.36, y + height * 0.34, width * 0.28, height * 0.18);
  } else if (fighter.characterType === 'switcher') {
    ctx.fillStyle = fighter.getSwitcherModeColor();
    ctx.fillRect(x - width * 0.1, y + height * 0.22, width * 1.2, height * 0.12);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + width * 0.18, y + height * 0.12, width * 0.64, height * 0.08);
  } else if (fighter.characterType === 'sorcerer') {
    ctx.fillStyle = '#6a1b9a';
    ctx.fillRect(x - width * 0.12, y - height * 0.08, width * 1.24, height * 0.08);
    ctx.fillRect(x + width * 0.2, y - height * 0.24, width * 0.6, height * 0.18);
    ctx.fillStyle = '#ce93d8';
    ctx.beginPath();
    ctx.arc(x + width * 1.16, y + height * 0.34, width * 0.16, 0, Math.PI * 2);
    ctx.fill();
  } else if (isScammer(fighter)) {
    ctx.fillStyle = '#111';
    ctx.fillRect(x - width * 0.1, y - height * 0.1, width * 1.2, height * 0.16);
    ctx.fillRect(x, y + height * 0.42, width, height * 0.38);
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.arc(x + width * 0.32, y + height * 0.24, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(x + width * 0.68, y + height * 0.24, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(x + width * 0.9, y + height * 0.5, width * 0.3, height * 0.1);
  } else if (fighter.characterType === 'gambler') {
    ctx.fillStyle = '#111';
    ctx.fillRect(x - width * 0.14, y - height * 0.08, width * 1.28, height * 0.08);
    ctx.fillRect(x + width * 0.2, y - height * 0.22, width * 0.6, height * 0.16);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + width * 0.22, y - height * 0.13, width * 0.56, height * 0.04);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - width * 0.1, y + height * 0.36, width * 0.34, height * 0.22);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(x - width * 0.04, y + height * 0.42, width * 0.2, height * 0.08);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + width * 0.84, y + height * 0.34, width * 0.24, height * 0.16);
  } else if (fighter.characterType === 'monkey') {
    ctx.fillStyle = '#7b4a26';
    ctx.beginPath();
    ctx.arc(x - width * 0.08, y + height * 0.22, width * 0.18, 0, Math.PI * 2);
    ctx.arc(x + width * 1.08, y + height * 0.22, width * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2c89b';
    ctx.beginPath();
    ctx.ellipse(x + width * 0.5, y + height * 0.28, width * 0.4, height * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe135';
    ctx.fillRect(x + width * 0.9, y + height * 0.44, width * 0.34, height * 0.08);
  }

  ctx.fillStyle = '#111';
  ctx.fillRect(x + width * 0.2, y + height * 0.18, width * 0.16, height * 0.06);
  ctx.fillRect(x + width * 0.64, y + height * 0.18, width * 0.16, height * 0.06);
}

function drawVictoryTaunt(winner, loser) {
  const phrase = getVictoryPhrase(winner, loser);
  const characterX = 90;
  const characterY = ground - 168;
  const bubbleX = 190;
  const bubbleY = ground - 242;
  const bubbleWidth = 430;
  const bubbleHeight = 100;

  drawVictoryCharacter(winner, characterX, characterY, 1.25);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 4;
  ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
  ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);

  ctx.beginPath();
  ctx.moveTo(bubbleX + 38, bubbleY + bubbleHeight);
  ctx.lineTo(characterX + 70, characterY + 34);
  ctx.lineTo(bubbleX + 96, bubbleY + bubbleHeight);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#111';
  ctx.font = '900 22px Arial';
  ctx.textAlign = 'left';
  drawWrappedText(phrase, bubbleX + 22, bubbleY + 40, bubbleWidth - 44, 26);
}

function drawGear(x, y, radius, teeth, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  for (let tooth = 0; tooth < teeth; tooth += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * tooth) / teeth);
    ctx.fillRect(-radius * 0.14, -radius - radius * 0.22, radius * 0.28, radius * 0.4);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

