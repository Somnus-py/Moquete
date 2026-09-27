// Moquete - Controles, bot, menus e inicio del juego
// (parte 10 de 10; los archivos se cargan en orden desde index.html)

function handleGamblerSpecialKey(attacker, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'gambler') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      activateGamblerLoadedDice(attacker);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'gambler', () => {
    if (specialType === 'roll') {
      activateGamblerRoll(attacker);
    } else {
      activateGamblerLuckIncrementer(attacker);
    }
  });
  return true;
}

function queueQfPendingSpecial(playerNumber, attacker, characterType, action) {
  clearQfPendingSpecial(playerNumber);

  const pending = {
    timerId: window.setTimeout(() => {
      if (!gameOver && attacker.characterType === characterType && canFighterAct(attacker)) {
        action();
      }
      setQfPendingSpecial(playerNumber, null);
    }, qfComboWindow),
  };

  setQfPendingSpecial(playerNumber, pending);
}

function clearQfPendingSpecial(playerNumber) {
  const pending = getQfPendingSpecial(playerNumber);
  if (!pending) return;

  window.clearTimeout(pending.timerId);
  setQfPendingSpecial(playerNumber, null);
}

function getQfPendingSpecial(playerNumber) {
  return playerNumber === 1 ? player1QfPendingSpecial : player2QfPendingSpecial;
}

function setQfPendingSpecial(playerNumber, pending) {
  if (playerNumber === 1) {
    player1QfPendingSpecial = pending;
  } else {
    player2QfPendingSpecial = pending;
  }
}

function handleLightWarriorFrSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'lightWarrior') return false;

  if (comboPressed) {
    if (getFrPendingSpecial(playerNumber)) {
      clearFrPendingSpecial(playerNumber);
    }
    startLightWarriorRadiantPunchCharge(attacker);
    return true;
  }

  queueFrPendingSpecial(playerNumber, attacker, () => {
    if (specialType === 'speed') {
      activateLightWarriorSpeed(attacker);
    } else {
      activateLightWarriorSolarFlash(attacker, target);
    }
  });
  return true;
}

function handleLightWarriorQfSpecialKey(attacker, target, comboPressed, playerNumber) {
  if (attacker.characterType !== 'lightWarrior') return false;

  if (comboPressed) {
    activateLightWarriorBeam(attacker, target);
    return true;
  }

  return false;
}

function queueFrPendingSpecial(playerNumber, attacker, action) {
  clearFrPendingSpecial(playerNumber);

  const pending = {
    timerId: window.setTimeout(() => {
      if (!gameOver && attacker.characterType === 'lightWarrior' && canFighterAct(attacker)) {
        action();
      }
      setFrPendingSpecial(playerNumber, null);
    }, qfComboWindow),
  };

  setFrPendingSpecial(playerNumber, pending);
}

function clearFrPendingSpecial(playerNumber) {
  const pending = getFrPendingSpecial(playerNumber);
  if (!pending) return;

  window.clearTimeout(pending.timerId);
  setFrPendingSpecial(playerNumber, null);
}

function getFrPendingSpecial(playerNumber) {
  return playerNumber === 1 ? player1FrPendingSpecial : player2FrPendingSpecial;
}

function setFrPendingSpecial(playerNumber, pending) {
  if (playerNumber === 1) {
    player1FrPendingSpecial = pending;
  } else {
    player2FrPendingSpecial = pending;
  }
}

function handleSorcererSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (!canFighterAct(attacker)) {
    return false;
  }

  if (attacker.characterType !== 'sorcerer') {
    return false;
  }

  if (comboPressed) {
    clearSorcererPendingSpecial(playerNumber);
    launchSorcererSecretOrb(attacker, target, true);
    return true;
  }

  queueSorcererPendingSpecial(attacker, target, specialType, playerNumber);
  return true;
}

function queueSorcererPendingSpecial(attacker, target, specialType, playerNumber) {
  clearSorcererPendingSpecial(playerNumber);

  const pending = {
    timerId: window.setTimeout(() => {
      if (!gameOver && attacker.characterType === 'sorcerer') {
        if (specialType === 'orb') {
          launchSorcererOrb(attacker, target);
        } else {
          launchSorcererGravityOrb(attacker, target);
        }
      }
      setSorcererPendingSpecial(playerNumber, null);
    }, sorcererSecretComboWindow),
  };

  setSorcererPendingSpecial(playerNumber, pending);
}

function clearSorcererPendingSpecial(playerNumber) {
  const pending = getSorcererPendingSpecial(playerNumber);
  if (pending) {
    window.clearTimeout(pending.timerId);
    setSorcererPendingSpecial(playerNumber, null);
  }
}

function getSorcererPendingSpecial(playerNumber) {
  return playerNumber === 1 ? player1SorcererPendingSpecial : player2SorcererPendingSpecial;
}

function setSorcererPendingSpecial(playerNumber, pending) {
  if (playerNumber === 1) {
    player1SorcererPendingSpecial = pending;
  } else {
    player2SorcererPendingSpecial = pending;
  }
}

function launchSorcererSecretOrb(attacker, target, comboPressed) {
  if (!canFighterAct(attacker)) return false;
  if (
    !comboPressed ||
    attacker.characterType !== 'sorcerer' ||
    attacker.sorcererSecretOrbCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const alreadyCharging = sorcererSecretOrbs.some(
    (sorcererSecretOrb) => sorcererSecretOrb.attacker === attacker && !sorcererSecretOrb.launched
  );
  if (alreadyCharging) {
    return true;
  }

  sorcererSecretOrbs.push(new SorcererSecretOrb({ attacker, target }));
  recordSpecialUsed(attacker);
  attacker.sorcererSecretOrbCooldown = getDebugCooldown(sorcererSecretOrbCooldown, attacker);
  playSound('sorcererSecretCharge');
  return true;
}

function activateCopycatShield(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'reflecter' ||
    attacker.copycatShieldCooldown > 0 ||
    attacker.copycatShieldTimer > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.copycatShieldTimer = getDebugDuration(getReflecterShieldDuration(attacker), attacker);
  recordSpecialUsed(attacker);
  attacker.copycatShieldCooldown = getDebugCooldown(getReflecterShieldCooldown(attacker), attacker);
  playSound('reflectShield');
}

function activateKaioken(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    !isNormalKaioken(attacker) ||
    attacker.characterType !== 'normal' ||
    attacker.kaiokenCooldown > 0 ||
    attacker.kaiokenTimer > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.kaiokenBaseMaxHealth = attacker.baseMaxHealth;
  attacker.kaiokenTimer = getDebugDuration(kaiokenSecretDuration, attacker);
  attacker.kaiokenCooldown = getDebugCooldown(kaiokenCooldown, attacker);
  attacker.setMaxHealth(attacker.kaiokenBaseMaxHealth + kaiokenSecretHealthBoost);
  attacker.health = Math.min(attacker.maxHealth, attacker.health + getDebugMaxHealth(kaiokenSecretHealthBoost, attacker));
  recordSpecialUsed(attacker);
}

function activateKaiokenCombo(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'normal' ||
    attacker.kaiokenTimer <= 0 ||
    attacker.kaiokenComboCooldown > 0 ||
    attacker.kaiokenComboHitsRemaining > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.kaiokenComboHitsRemaining = isNormalKaioken(attacker) ? kaiokenSecretComboHits : kaiokenComboHits;
  attacker.kaiokenComboTimer = 0;
  attacker.kaiokenComboCooldown = getDebugCooldown(kaiokenComboCooldown, attacker);
  recordSpecialUsed(attacker);
}

function strikeKaiokenCombo(attacker, target) {
  if (!target) return;

  const direction = target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 1 : -1;
  const comboArea = {
    x: direction > 0 ? attacker.position.x + attacker.width - 4 : attacker.position.x - 92,
    y: attacker.position.y + 18,
    width: 96,
    height: 82,
  };

  attacker.attacksToTheRight = direction > 0;
  attacker.attackBox = {
    offset: { x: direction > 0 ? attacker.width - 4 : -92, y: 18 },
    width: 96,
    height: 82,
  };
  attacker.isAttacking = true;
  attacker.kaiokenComboVisualTimer = 3;
  attacker.attackTimer = Math.max(attacker.attackTimer, attacker.attackDuration - 3);
  const comboDamage = isNormalKaioken(attacker) ? kaiokenSecretComboDamage : kaiokenComboDamage;
  attacker.currentAttackDamage = comboDamage;

  if (rectangularCopycatShieldCollision(target, comboArea) || rectangularCollision({ rectangle1: comboArea, rectangle2: target })) {
    if (!handleCopycatShieldHit(target, attacker)) {
      applyDamage(attacker, target, comboDamage, { isSpecial: true, damageType: 'meleeCombo' });
      target.velocity.x = getDebugKnockback(direction > 0 ? 9 : -9, target);
      target.velocity.y = Math.min(target.velocity.y, getDebugKnockback(-5, target));
    }
  }
}

function copyFireMasterAbility(copycat, source) {
  const target = source;
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 34;
  const startY = copycat.position.y + 44;

  fireballs.push(new Fireball({ x: startX, y: startY, direction, target, attacker: copycat, damageMultiplier: getReflecterCopyDamageMultiplier(copycat) }));
}

function copyTankAbility(copycat, source) {
  const target = source;
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 28;
  const startY = copycat.position.y + 84;

  tankShells.push(
    new TankShell({
      x: startX,
      y: startY,
      direction,
      target,
      attacker: copycat,
      damage: getTankSecretDamage(source, tankShellDamage) * getReflecterCopyDamageMultiplier(copycat),
    })
  );
}

function copyCowboyAbility(copycat, source) {
  copycat.target = source;
  copycat.cowboyBurstShotsRemaining = getCowboySecretBurstShots(source) * getReflecterCopyDamageMultiplier(copycat);
  copycat.cowboyBurstTimer = 0;
}

function copyLightWarriorAbility(copycat, source) {
  const target = source;
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 28;
  const startY = copycat.position.y + 44;
  const copiedShots = Math.max(1, Math.round(lightWarriorBurstShots * getReflecterCopyDamageMultiplier(copycat)));

  for (let i = 0; i < copiedShots; i += 1) {
    lightShots.push(new LightShot({ x: startX - direction * i * 12, y: startY + (i % 3) * 12, direction, target, attacker: copycat }));
  }
}

function copySwitcherAbility(copycat, source) {
  const originalModeIndex = copycat.switcherModeIndex;
  const originalCopyMultiplier = copycat.reflecterCopyDamageMultiplier || 1;
  copycat.switcherModeIndex = source.switcherModeIndex;
  copycat.characterType = 'switcher';
  copycat.reflecterCopyDamageMultiplier = getReflecterCopyDamageMultiplier(copycat);
  activateSwitcherAbility(copycat, true);
  copycat.characterType = 'reflecter';
  copycat.switcherModeIndex = originalModeIndex;
  copycat.reflecterCopyDamageMultiplier = originalCopyMultiplier;
}

function copySorcererAbility(copycat, source) {
  launchSorcererOrb(copycat, source, true, getReflecterCopyDamageMultiplier(copycat));
}

function copyChronoAbility(copycat, source) {
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = source.position.x + source.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 42;
  const startY = copycat.position.y + copycat.height / 2 - 7;

  chronoBlades.push(new ChronoBlade({ x: startX, y: startY, target: source, attacker: copycat }));
  recordSpecialUsed(copycat);
  playSound('sorcererOrb');
}

function copyGamblerAbility(copycat) {
  const copiedLuckChance = isReflecterMirrorLuck(copycat) ? 0.88 + Math.random() * 0.12 : Math.random();
  const symbols = rollGamblerSymbols(copiedLuckChance);
  copycat.gamblerRollNumbers = symbols;
  copycat.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, copycat);
  copycat.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(copycat);
  recordSpecialUsed(copycat);
  playSound('slotRoll');
  applyGamblerRollEffect(copycat, symbols);
}

function rollGamblerSymbols(luckBonus = 0) {
  if (Math.random() < luckBonus) {
    const luckySymbols = ['3', '4', '5', '6', '7'];
    const luckySymbol = luckySymbols[Math.floor(Math.random() * luckySymbols.length)];
    return [luckySymbol, luckySymbol, luckySymbol];
  }

  const symbols = ['X', '1', '2', '3', '4', '5', '6', '7'];
  return Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
}

function rollLoadedDiceSymbols(gambler) {
  const jackpotChance = gamblerLoadedDiceJackpotChance + gambler.gamblerLuckBonus * 0.04;
  if (Math.random() < jackpotChance) {
    return ['7', '7', '7'];
  }

  const positiveSymbols = ['3', '4', '5', '6'];
  const symbol = positiveSymbols[Math.floor(Math.random() * positiveSymbols.length)];
  return [symbol, symbol, symbol];
}

function applyGamblerRollEffect(gambler, symbols) {
  const [first, second, third] = symbols;
  if (first !== second || second !== third) return;

  if (first === 'X') {
    gambler.gamblerStunTimer = getDebugDuration(gamblerStunDuration, gambler);
    applyDamage(gambler, gambler, 10, { ignoreDebug: true, ignoreInvincible: true, recordStats: false });
    return;
  }

  if (first === '1') {
    applyDamage(gambler, gambler, 5, { ignoreDebug: true, ignoreInvincible: true, recordStats: false });
    return;
  }

  if (first === '2') return;

  if (first === '3') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 20);
  } else if (first === '4') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 35);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.1);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '5') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 40);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.2);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '6') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 50);
    gambler.gamblerSpeedBoost = Math.max(gambler.gamblerSpeedBoost, 0.5);
    gambler.gamblerSpeedBoostTimer = getDebugDuration(gamblerSpeedBoostDuration, gambler);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.25);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '7') {
    const jackpotDuration = getDebugDuration(
      gamblerJackpotMinDuration + Math.floor(Math.random() * (gamblerJackpotMaxDuration - gamblerJackpotMinDuration + 1)),
      gambler
    );
    playSound('jackpotFanfare', { durationFrames: jackpotDuration });
    if (gambler.characterType === 'gambler') {
      unlockAchievement('jackpot');
    }
    gambler.gamblerSpeedBoost = Math.max(gambler.gamblerSpeedBoost, 1);
    gambler.gamblerSpeedBoostTimer = jackpotDuration;
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 1);
    gambler.gamblerDamageBoostTimer = jackpotDuration;
    gambler.gamblerInvincibleTimer = jackpotDuration;
  }
}

function activateGamblerLoadedDice(attacker) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'gambler' ||
    attacker.gamblerRollCooldown > 0 ||
    attacker.gamblerLuckCooldown > 0 ||
    attacker.gamblerStunTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  const symbols = rollLoadedDiceSymbols(attacker);
  attacker.gamblerLuckBonus = Math.min(gamblerLuckCap, attacker.gamblerLuckBonus + gamblerLoadedDiceLuckBonus);
  attacker.gamblerRollNumbers = symbols;
  attacker.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, attacker);
  attacker.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(attacker);
  attacker.gamblerRollCooldown = getDebugCooldown(gamblerRollCooldown, attacker);
  attacker.gamblerLuckCooldown = getDebugCooldown(gamblerLuckCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('slotRoll');
  applyGamblerRollEffect(attacker, symbols);
  return true;
}

function activateGamblerRoll(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'gambler' || attacker.gamblerRollCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) {
    return;
  }

  const symbols = rollGamblerSymbols(attacker.gamblerLuckBonus);
  attacker.gamblerRollNumbers = symbols;
  attacker.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, attacker);
  attacker.gamblerRollCooldown = getDebugCooldown(gamblerRollCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('slotRoll');
  applyGamblerRollEffect(attacker, symbols);
}

function activateGamblerLuckIncrementer(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'gambler' || attacker.gamblerLuckCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) {
    return;
  }

  attacker.gamblerLuckBonus = Math.min(gamblerLuckCap, attacker.gamblerLuckBonus + gamblerLuckStep);
  attacker.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(attacker);
  attacker.gamblerLuckCooldown = getDebugCooldown(gamblerLuckCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('gambler');
}

function cycleSwitcherMode(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'switcher' || attacker.switcherModeCooldown > 0 || gameOver) return;

  attacker.switcherModeIndex = (attacker.switcherModeIndex + 1) % switcherModes.length;
  attacker.switcherModeCooldown = getDebugCooldown(switcherModeCooldown, attacker);
  recordSpecialUsed(attacker);
  recordPrismSwitcherUse(attacker);
  attacker.moveSpeed = switcherModeStats[attacker.getSwitcherMode()].moveSpeed;
  attacker.attackColor = hexToRgba(attacker.getSwitcherModeColor(), 0.65);
  playSound('switcher');

  if (attacker.getSwitcherMode() !== 'yellow' && attacker.switcherArmorTimer <= 0) {
    attacker.setMaxHealth(switcherHealth);
  }
}

function activateSwitcherAbility(attacker, ignoreCooldown = false) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'switcher' ||
    (!ignoreCooldown && attacker.switcherAbilityCooldown > 0) ||
    gameOver
  ) {
    return;
  }

  const mode = attacker.getSwitcherMode();
  const target = attacker.target || getOpponent(attacker);
  const prism = isSwitcherPrism(attacker);
  const overdrive = isPrismOverdriveActive();

  if (mode === 'red') {
    useSwitcherRedStrike(attacker, target);
  } else if (mode === 'blue') {
    useSwitcherBlueDash(attacker, target);
  } else if (mode === 'green') {
    attacker.health = Math.min(attacker.maxHealth, attacker.health + (prism ? 50 : 35) + (overdrive ? 10 : 0));
  } else if (mode === 'yellow') {
    attacker.switcherArmorTimer = getDebugDuration(prism ? 480 : 360, attacker);
    attacker.setMaxHealth((prism ? 170 : 150) + (overdrive ? 15 : 0));
    attacker.moveSpeed = switcherModeStats.yellow.moveSpeed;
    attacker.health = Math.min(attacker.maxHealth, attacker.health + (prism ? 55 : 40));
  }

  if (!ignoreCooldown) {
    recordSpecialUsed(attacker);
    recordPrismSwitcherUse(attacker);
    attacker.switcherAbilityCooldown = getSwitcherAbilityCooldownMax(attacker);
  }
  playSound('switcher');
}

function useSwitcherRedStrike(attacker, target) {
  if (!target) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const blast = {
    x: direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 110,
    y: attacker.position.y + 36,
    width: 110,
    height: 54,
  };

  attacker.switcherRedStrikeArea = blast;
  attacker.switcherRedStrikeTimer = getDebugDuration(16, attacker);

  if (rectangularCollision({ rectangle1: blast, rectangle2: target })) {
    if (!handleCopycatShieldHit(target, attacker)) {
      const prismDamage = isSwitcherPrism(attacker) ? 8 : 0;
      const overdriveDamage = isPrismOverdriveActive() ? 5 : 0;
      applyDamage(attacker, target, (22 + prismDamage + overdriveDamage) * (attacker.reflecterCopyDamageMultiplier || 1), { isSpecial: true, damageType: 'prismStrike' });
      target.velocity.x = getDebugKnockback(direction > 0 ? 13 : -13, target);
      target.velocity.y = getDebugKnockback(-6, target);
    }
  }
}

function useSwitcherBlueDash(attacker, target) {
  const targetCenterX = target ? target.position.x + target.width / 2 : attacker.position.x + attacker.width;
  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  attacker.switcherDashDirection = direction;
  attacker.switcherDashTimer = getDebugDuration(isSwitcherPrism(attacker) ? 14 : 10, attacker);
  attacker.velocity.x = direction * (isPrismOverdriveActive() ? 25 : isSwitcherPrism(attacker) ? 22 : 18) * getDebugMultiplier('moveMultiplier', attacker);
  attacker.velocity.y = Math.min(attacker.velocity.y, isSwitcherPrism(attacker) ? -6 : -3);
}

function launchCowboyBurst(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'cowboy' ||
    attacker.cowboyBurstCooldown > 0 ||
    attacker.cowboyBurstShotsRemaining > 0 ||
    gameOver ||
    (isDesertCowboyDuelMatch() && !desertCowboyDuel.active)
  ) {
    return;
  }

  if (desertCowboyDuel.active) {
    const bulletKey = attacker === player1 ? 'p1BulletAvailable' : 'p2BulletAvailable';
    if (!desertCowboyDuel[bulletKey]) return;
    desertCowboyDuel[bulletKey] = false;
    attacker.cowboyBurstShotsRemaining = 1;
    attacker.cowboyBurstTimer = 0;
    recordSpecialUsed(attacker);
    attacker.cowboyBurstCooldown = getDebugCooldown(cowboyBurstCooldown, attacker);
    playSound('cowboyBurst');
    return;
  }

  attacker.cowboyBurstShotsRemaining = getCowboySecretBurstShots(attacker);
  attacker.cowboyBurstTimer = 0;
  recordSpecialUsed(attacker);
  attacker.cowboyBurstCooldown = getDebugCooldown(cowboyBurstCooldown, attacker);
  playSound('cowboyBurst');
}

function shootCowboyBullet(attacker, target) {
  if (!target) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 18;
  const startY = attacker.position.y + 54;
  const isDuelShot = desertCowboyDuel.active;
  const damage = desertCowboyDuel.active
    ? desertCowboyDuelDamage
    : getCowboySecretDamage(attacker, cowboyBulletDamage);

  cowboyBullets.push(
    new CowboyBullet({ x: startX, y: startY, direction, target, attacker, damage, fixedDamage: isDuelShot })
  );
}

function getBotDifficultyProfile() {
  return botDifficultySettings[botDifficulty] || botDifficultySettings.medium;
}

function getBotAttackRange() {
  if (player2.characterType === 'divineGeneral') return 150;
  return player2.characterType === 'tank' ? 128 : 82;
}

function getBotMoveSpeed() {
  return getDebugMoveSpeed(player2);
}

function getBotPreferredRange() {
  if (player2.characterType === 'cowboy') return 390;
  if (player2.characterType === 'lightWarrior') return 360;
  if (player2.characterType === 'chrono') return 340;
  if (player2.characterType === 'sorcerer') return 360;
  if (player2.characterType === 'fireMaster') return 320;
  if (player2.characterType === 'monkey') return 300;
  if (player2.characterType === 'divineGeneral') return 135;
  if (player2.characterType === 'tank') return 118;
  if (player2.characterType === 'switcher') {
    const mode = player2.getSwitcherMode();
    if (mode === 'blue') return 260;
    if (mode === 'red') return 120;
    return 190;
  }
  return 150;
}

function getIncomingBotProjectileThreat(profile) {
  const botLeft = player2.position.x;
  const botRight = player2.position.x + player2.width;
  const botTop = player2.position.y;
  const botBottom = player2.position.y + player2.height;
  const projectiles = [
    ...fireballs,
    ...fireBeams,
    ...lightShots,
    ...tankShells,
    ...cowboyBullets,
    ...sorcererOrbs,
    ...sorcererSecretOrbs,
    ...chronoBlades,
    ...divineWorldCuts,
  ];

  for (const projectile of projectiles) {
    if (!projectile.active || projectile.target !== player2 || !projectile.velocity) continue;

    const projectileLeft = projectile.position.x;
    const projectileRight = projectile.position.x + projectile.width;
    const projectileTop = projectile.position.y;
    const projectileBottom = projectile.position.y + projectile.height;
    const overlapsY = projectileBottom > botTop + 8 && projectileTop < botBottom - 12;
    const approachingFromLeft = projectile.velocity.x > 0 && projectileRight <= botLeft;
    const approachingFromRight = projectile.velocity.x < 0 && projectileLeft >= botRight;
    const distance = approachingFromLeft ? botLeft - projectileRight : projectileLeft - botRight;

    if ((approachingFromLeft || approachingFromRight) && overlapsY && distance <= profile.reactionDistance) {
      return {
        type: 'projectile',
        centerX: projectile.position.x + projectile.width / 2,
        distance,
      };
    }
  }

  for (const orb of sorcererGravityOrbs) {
    if (!orb.active || orb.target !== player2) continue;

    const botCenterX = player2.position.x + player2.width / 2;
    const distance = Math.abs(orb.centerX - botCenterX);
    if (distance < 180 && Math.abs(orb.centerY - (player2.position.y + player2.height / 2)) < 160) {
      return {
        type: 'gravity',
        centerX: orb.centerX,
        distance,
      };
    }
  }

  return null;
}

function dodgeBotThreat(threat, profile) {
  if (!threat || Math.random() > profile.dodgeChance) return false;

  const botCenterX = player2.position.x + player2.width / 2;
  const dodgeDirection = threat.centerX < botCenterX ? 1 : -1;
  player2.velocity.x = getBotMoveSpeed() * dodgeDirection;

  if (player2.velocity.y === 0 && (threat.type === 'projectile' || Math.random() < 0.55)) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }

  return true;
}

function shouldBotUseSpecial(profile, multiplier = 1) {
  return Math.random() < Math.min(0.98, profile.specialChance * multiplier);
}

function updateBotSwitcher(profile, absDistance) {
  if (player2.characterType !== 'switcher' || player2.switcherAbilityCooldown > 0) return false;

  const currentMode = player2.getSwitcherMode();
  let wantedMode = 'red';

  if (player2.health < player2.maxHealth * 0.42) {
    wantedMode = 'green';
  } else if (absDistance > 230) {
    wantedMode = 'blue';
  } else if (player2.health < player2.maxHealth * 0.68 && profile.reactionChance > 0.7) {
    wantedMode = 'yellow';
  }

  if (currentMode !== wantedMode && Math.random() < profile.reactionChance) {
    cycleSwitcherMode(player2);
    return true;
  }

  if (currentMode === wantedMode && shouldBotUseSpecial(profile)) {
    activateSwitcherAbility(player2);
    return true;
  }

  return false;
}

function updateBotSpecials(profile, absDistance, threat) {
  const closePressure = absDistance < 180;
  const lowHealth = player2.health < player2.maxHealth * 0.45;

  // factory robots only use their own robot abilities (never the base character's kit)
  if (isFactoryRobot(player2)) {
    if (player2.hybridAbilityCooldown === 0 && absDistance < 760 && shouldBotUseSpecial(profile, 0.85)) return useHybridAbility(player2, player1);
    return false;
  }

  if (
    player2.arcadeBossVariant &&
    player2.arcadeBossShockwaveCooldown === 0 &&
    absDistance < 680 &&
    shouldBotUseSpecial(profile, 0.72)
  ) {
    launchArcadeBossShockwave(player2, player1);
    return true;
  }

  if (isShadowJester(player2)) {
    if (isJesterSecretUnlocked(player2, 'final') && !player2.jesterFinalActUsed) return castJesterFinalAct(player2, player1);
    if (player2.jesterChaosTeleports > 0) return false;
    if (player2.jesterStormCooldown === 0 && isJesterSecretUnlocked(player2, 'storm') && shouldBotUseSpecial(profile, 0.6)) return castJesterScytheStorm(player2, player1);
    if (player2.jesterRingCooldown === 0 && isJesterSecretUnlocked(player2, 'ring') && shouldBotUseSpecial(profile, 0.6)) return castJesterSuitRing(player2, player1);
    if (player2.jesterScytheCooldown === 0 && absDistance < 650 && shouldBotUseSpecial(profile, 0.7)) return throwJesterScythe(player2, player1);
    if (player2.jesterChaosCooldown === 0 && shouldBotUseSpecial(profile, 0.55)) return startJesterChaos(player2, player1);
    if (player2.jesterSuitCooldown === 0 && shouldBotUseSpecial(profile, 0.85)) return castJesterSuits(player2, player1);
    return false;
  }

  if (isScammer(player2)) {
    if (player2.scammerSlotCooldown === 0 && shouldBotUseSpecial(profile, 0.55)) {
      return dropScamSlotMachine(player2, player1);
    }
    if (player2.scammerItemCooldown === 0 && shouldBotUseSpecial(profile, 0.8)) {
      return throwScamItems(player2, player1);
    }
    if (player2.scammerOfferCooldown === 0 && absDistance > 150 && absDistance < 720 && shouldBotUseSpecial(profile, 0.9)) {
      return launchScamOffer(player2, player1);
    }
    return false;
  }

  if (
    isHybridEnemy(player2) &&
    player2.hybridAbilityCooldown === 0 &&
    absDistance > 110 &&
    absDistance < 720 &&
    shouldBotUseSpecial(profile, 0.85)
  ) {
    if (useHybridAbility(player2, player1)) return true;
  }

  if (player2.characterType === 'monkey') {
    if (player2.monkeyCoconutCooldown === 0 && absDistance < 720 && shouldBotUseSpecial(profile, 0.6)) {
      return summonMonkeyCoconuts(player2, player1);
    }
    if (player2.monkeyPeelCooldown === 0 && (closePressure || absDistance < 320) && shouldBotUseSpecial(profile, closePressure ? 1 : 0.5)) {
      return dropMonkeyPeel(player2, player1);
    }
    if (player2.monkeyBananaCooldown === 0 && absDistance > 120 && absDistance < 700 && shouldBotUseSpecial(profile, 0.9)) {
      return launchMonkeyBanana(player2, player1);
    }
    return false;
  }

  if (isIcedThug(player2)) {
    if (
      player2.icedThugFrostFieldCooldown === 0 &&
      absDistance < 420 &&
      shouldBotUseSpecial(profile, closePressure ? 1.1 : 0.7)
    ) {
      return activateIcedThugFrostField(player2, player1);
    }
    if (
      player2.icedThugBladeCooldown === 0 &&
      absDistance > 140 &&
      absDistance < 760 &&
      shouldBotUseSpecial(profile, 0.8)
    ) {
      return launchIcedThugBlade(player2, player1);
    }
    return false;
  }

  if (
    player2.characterType === 'reflecter' &&
    player2.copycatShieldCooldown === 0 &&
    player2.copycatShieldTimer === 0 &&
    (threat || closePressure) &&
    shouldBotUseSpecial(profile, threat ? 1.25 : 0.75)
  ) {
    activateCopycatShield(player2);
    return true;
  }

  if (
    player2.characterType === 'normal' &&
    isNormalKaioken(player2) &&
    player2.kaiokenTimer > 0 &&
    player2.kaiokenComboCooldown === 0 &&
    player2.kaiokenComboHitsRemaining === 0 &&
    absDistance < 150 &&
    shouldBotUseSpecial(profile, 1.2)
  ) {
    activateKaiokenCombo(player2);
    return true;
  }

  if (
    player2.characterType === 'normal' &&
    isNormalKaioken(player2) &&
    player2.kaiokenCooldown === 0 &&
    player2.kaiokenTimer === 0 &&
    absDistance < 360 &&
    (lowHealth || shouldBotUseSpecial(profile, 0.6))
  ) {
    activateKaioken(player2);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.specialCooldown === 0 &&
    player2.fireBeamCooldown === 0 &&
    absDistance < 620 &&
    shouldBotUseSpecial(profile, 0.45)
  ) {
    launchInfernoSplit(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.fireBeamCooldown === 0 &&
    absDistance < 680 &&
    shouldBotUseSpecial(profile, 0.75)
  ) {
    launchFireBeam(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.specialCooldown === 0 &&
    absDistance < 540 &&
    shouldBotUseSpecial(profile)
  ) {
    launchFireball(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'lightWarrior' &&
    player2.lightWarriorSolarFlashCooldown === 0 &&
    absDistance < lightWarriorSolarFlashRange &&
    shouldBotUseSpecial(profile, closePressure ? 0.85 : 0.35)
  ) {
    activateLightWarriorSolarFlash(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'lightWarrior' &&
    player2.lightWarriorSpeedCooldown === 0 &&
    (lowHealth || closePressure || shouldBotUseSpecial(profile, 0.35))
  ) {
    activateLightWarriorSpeed(player2);
    return true;
  }

  if (
    player2.characterType === 'lightWarrior' &&
    player2.lightWarriorBurstCooldown === 0 &&
    player2.lightWarriorBurstShotsRemaining === 0 &&
    absDistance < 680 &&
    shouldBotUseSpecial(profile)
  ) {
    launchLightWarriorBarrage(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'tank' &&
    player2.tankShellCooldown === 0 &&
    absDistance < 620 &&
    shouldBotUseSpecial(profile, absDistance > 140 ? 1 : 0.45)
  ) {
    launchTankShell(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'cowboy' &&
    player2.cowboyBurstCooldown === 0 &&
    player2.cowboyBurstShotsRemaining === 0 &&
    absDistance < 740 &&
    shouldBotUseSpecial(profile, absDistance > 120 ? 1 : 0.55)
  ) {
    launchCowboyBurst(player2);
    return true;
  }

  if (
    player2.characterType === 'sorcerer' &&
    player2.sorcererGravityCooldown === 0 &&
    absDistance < 540 &&
    shouldBotUseSpecial(profile, closePressure ? 0.9 : 0.45)
  ) {
    launchSorcererGravityOrb(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'sorcerer' &&
    player2.sorcererOrbCooldown === 0 &&
    absDistance < 780 &&
    shouldBotUseSpecial(profile)
  ) {
    launchSorcererOrb(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoTimeStopCooldown === 0 &&
    absDistance < 360 &&
    shouldBotUseSpecial(profile, closePressure ? 0.6 : 0.25)
  ) {
    activateChronoTimeStop(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoSlowCooldown === 0 &&
    absDistance < 420 &&
    shouldBotUseSpecial(profile, closePressure ? 0.95 : 0.45)
  ) {
    activateChronoSlow(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoBladeCooldown === 0 &&
    absDistance < 690 &&
    shouldBotUseSpecial(profile)
  ) {
    launchChronoBlade(player2, player1);
    return true;
  }

  if (updateBotSwitcher(profile, absDistance)) return true;

  if (
    player2.characterType === 'ghost' &&
    player2.ghostPhaseCooldown === 0 &&
    player2.ghostPhaseTimer === 0 &&
    (closePressure || lowHealth || shouldBotUseSpecial(profile, 0.5))
  ) {
    activateGhostPhase(player2);
    return true;
  }

  if (
    player2.characterType === 'divineGeneral' &&
    player2.divineCounterCooldown === 0 &&
    player2.divineAdaptTimer === 0 &&
    (closePressure || getDominantDivineAdaptation(player2)) &&
    shouldBotUseSpecial(profile, closePressure ? 0.85 : 0.45)
  ) {
    activateDivineCounter(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'divineGeneral' &&
    player2.divineAdaptCooldown === 0 &&
    player2.divineAdaptTimer === 0 &&
    (threat || closePressure || lowHealth) &&
    shouldBotUseSpecial(profile, threat ? 1.1 : 0.45)
  ) {
    activateDivineAdaptation(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerRollCooldown === 0 &&
    player2.gamblerLuckCooldown === 0 &&
    player2.gamblerStunTimer === 0 &&
    shouldBotUseSpecial(profile, lowHealth ? 0.75 : 0.35 + player2.gamblerLuckBonus)
  ) {
    activateGamblerLoadedDice(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerLuckCooldown === 0 &&
    player2.gamblerLuckBonus < gamblerLuckCap &&
    (lowHealth || shouldBotUseSpecial(profile, 0.45))
  ) {
    activateGamblerLuckIncrementer(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerRollCooldown === 0 &&
    shouldBotUseSpecial(profile, 0.35 + player2.gamblerLuckBonus)
  ) {
    activateGamblerRoll(player2);
    return true;
  }

  return false;
}

function updateBotMovement(profile, distanceX, absDistance) {
  const attackRange = getBotAttackRange();
  const preferredRange = getBotPreferredRange();
  const moveSpeed = getBotMoveSpeed();
  const canPlaySpacing = Math.random() < profile.spacingChance;
  const rangedBot =
    player2.characterType === 'cowboy' ||
    player2.characterType === 'lightWarrior' ||
    player2.characterType === 'fireMaster' ||
    player2.characterType === 'sorcerer' ||
    player2.characterType === 'chrono';

  if (rangedBot && absDistance < preferredRange && canPlaySpacing) {
    player2.velocity.x = distanceX > 0 ? -moveSpeed : moveSpeed;
    return;
  }

  if (absDistance > Math.max(attackRange, preferredRange) || absDistance > attackRange + 24) {
    player2.velocity.x = distanceX > 0 ? moveSpeed : -moveSpeed;
    return;
  }

  player2.velocity.x = 0;

  if (botAttackCooldown === 0 && absDistance <= attackRange) {
    const shouldUseStrongAttack =
      player2.strongAttackCooldown === 0 &&
      Math.random() < profile.strongAttackChance;
    player2.attack(shouldUseStrongAttack);
    botAttackCooldown = getDebugCooldown(profile.attackDelay, player2);
  }
}

function updateBotJumping(profile) {
  if (player2.velocity.y !== 0) return;

  const playerAbove = player1.position.y + player1.height < player2.position.y;
  if (playerAbove && Math.random() < profile.reactionChance) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }
}

function updateBot() {
  if (!botEnabled || !gameStarted || gameOver) return;
  if (!canFighterAct(player2)) {
    player2.velocity.x = 0;
    return;
  }
  if (player2.gamblerStunTimer > 0) {
    player2.velocity.x = 0;
    return;
  }

  if (botAttackCooldown > 0) {
    botAttackCooldown -= 1;
  }

  const profile = getBotDifficultyProfile();
  const playerCenter = player1.position.x + player1.width / 2;
  const botCenter = player2.position.x + player2.width / 2;
  const distanceX = playerCenter - botCenter;
  const absDistance = Math.abs(distanceX);
  const threat = getIncomingBotProjectileThreat(profile);

  if (Math.random() < profile.reactionChance) {
    updateBotSpecials(profile, absDistance, threat);
  }

  if (dodgeBotThreat(threat, profile)) {
    updateBotJumping(profile);
    return;
  }

  updateBotMovement(profile, distanceX, absDistance);
  updateBotJumping(profile);
}

function startGame() {
  jesterIntro.active = false;
  jesterOutroPlayed = false;
  jesterLosePlayed = false;
  cancelJesterImpatience();
  jesterFinal.active = false;
  jesterWhiteFade = 0;
  stopJesterTracks();
  scammerOutroPlayed = false;
  pendingFightTime = null;
  arcadeCutscene.active = false;
  document.body.classList.remove('arcade-cutscene');
  if (selectedMap === 'darkRoom') {
    unlockAchievement('darkRoom');
  }
  stopMenuMusic();
  stopJackpotTrack();
  syncLightWarriorOmegaMusic();
  mainMenu.classList.add('hidden');
  document.body.classList.remove('menu-open');
  resetFight();
  if (normalArcadeActive) {
    configureNormalArcadeLevel();
    updateHealthBars();
    updateCombatHudIdentity();
  }
}

function configureNormalArcadeLevel() {
  if (!normalArcadeActive) return;
  if (arcadeChapter === 'gambler') {
    configureGamblerArcadeLevel();
    return;
  }
  if (arcadeChapter === 'reflecter') {
    configureReflecterArcadeLevel();
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 0;
    player1.setCharacterType(arcadeChapter === 'fireMaster' ? 'fireMaster' : 'normal');
    player2.setCharacterType(arcadeChapter === 'fireMaster' ? 'fireMaster' : 'normal');
    configureNormalArcadeBoss();
    return;
  }
  player1.setCharacterType(arcadeChapter === 'fireMaster' ? 'fireMaster' : 'normal');
  player2.setCharacterType(arcadeChapter === 'fireMaster' ? getFireArcadeEnemyType() : 'normal');
  normalArcadeEnemiesRemaining = selectedNormalArcadeLevel >= 3 ? selectedNormalArcadeLevel === 3 ? 1 : 4 : 0;
  if (isFireArcadeMiniBoss()) normalArcadeEnemiesRemaining = 0;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  configureNormalArcadeEnemy();
}

function configureFireArcadeBoss() {
  player2.setCharacterType('fireMaster', 'iceMaster');
  player2.health = player2.maxHealth;
  botEnabled = true;
  botDifficulty = 'hard';
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureNormalArcadeBoss() {
  if (arcadeChapter === 'fireMaster') {
    configureFireArcadeBoss();
    return;
  }
  player2.setCharacterType('normal', 'arcadeBoss');
  player2.health = player2.maxHealth;
  player2.arcadeBossShockwaveCooldown = 0;
  botEnabled = true;
  botDifficulty = 'hard';
  updateHealthBars();
  updateCombatHudIdentity();
}

function getNormalArcadeEnemyDifficulty() {
  if (selectedNormalArcadeLevel === 1) return 'easy';
  if (selectedNormalArcadeLevel === 2 || selectedNormalArcadeLevel === 3) return 'medium';
  if (normalArcadeEnemyIndex === 1) return 'easy';
  if (normalArcadeEnemyIndex <= 3) return 'medium';
  return 'hard';
}

function getFireArcadeEnemyType() {
  return 'normal';
}

function isFireArcadeMiniBoss() {
  return arcadeChapter === 'fireMaster' && selectedNormalArcadeLevel === 4;
}

function getFireArcadeBruteHealth() {
  return fireArcadeBruteHealthByLevel[selectedNormalArcadeLevel] || fireArcadeBruteHealthByLevel[1];
}

function getFireArcadeBruteDamageMultiplier() {
  return fireArcadeBruteDamageMultiplierByLevel[selectedNormalArcadeLevel] || fireArcadeBruteDamageMultiplierByLevel[1];
}

function configureNormalArcadeEnemy() {
  if (arcadeChapter === 'gambler') {
    configureGamblerArcadeEnemy();
    return;
  }
  if (arcadeChapter === 'reflecter') {
    configureReflecterArcadeEnemy();
    return;
  }
  player2.arcadeBossVariant = false;
  const fireArcadeBrute = arcadeChapter === 'fireMaster' && selectedNormalArcadeLevel <= 3;
  const fireArcadeMiniBoss = isFireArcadeMiniBoss();
  if (arcadeChapter === 'fireMaster') player2.setCharacterType(getFireArcadeEnemyType());
  botDifficulty = fireArcadeMiniBoss ? 'hard' : getNormalArcadeEnemyDifficulty();
  player2.secretVariant = fireArcadeMiniBoss ? 'icedThug' : fireArcadeBrute ? 'iceBrute' : null;
  player2.setColor(fireArcadeMiniBoss ? '#77dcf2' : fireArcadeBrute ? '#123761' : arcadeChapter === 'fireMaster' ? '#8bdbea' : '#606060');
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  if (fireArcadeMiniBoss) {
    player2.setCharacterType('normal', 'icedThug');
    player2.health = player2.maxHealth;
  } else if (fireArcadeBrute || selectedNormalArcadeLevel === 1) {
    player2.setMaxHealth(fireArcadeBrute ? getFireArcadeBruteHealth() : normalArcadeEnemyHealth);
    player2.health = player2.maxHealth;
    player2.damageMultiplier = fireArcadeBrute ? getFireArcadeBruteDamageMultiplier() : normalArcadeEnemyDamageMultiplier;
  }
  updateHealthBars();
  updateCombatHudIdentity();
}

function startNextNormalArcadeEnemy() {
  normalArcadeEnemiesRemaining -= 1;
  normalArcadeEnemyIndex += 1;
  player1.health = Math.min(player1.maxHealth, player1.health + 20);
  player2.reset({ x: 820, y: 0 });
  configureNormalArcadeEnemy();
  botAttackCooldown = 0;
  fireballs = [];
  fireBeams = [];
  lightShots = [];
  superFireKamehamehaCharges = [];
  superFireKamehamehas = [];
  tankShells = [];
  cowboyBullets = [];
  sorcererOrbs = [];
  sorcererGravityOrbs = [];
  sorcererSecretOrbs = [];
  chronoBlades = [];
  chronoZones = [];
  icedThugBlades = [];
  icedThugFrostFields = [];
  monkeyBananas = [];
  monkeyPeels = [];
  monkeyCoconuts = [];
  scamOffers = [];
  scamItems = [];
  scamSlotMachines = [];
  jesterSuits = [];
  jesterBombs = [];
  jesterScythes = [];
  jesterAfterimages = [];
  robotShots = [];
  divineWorldCutCharges = [];
  divineWorldCuts = [];
  arcadeBossShockwaves = [];
  resetKeys();
  restartPanel.classList.add('hidden');
  gameStarted = true;
  gameOver = false;
  animate();
}

function startOldDaysGame() {
  deactivateBlindMode();
  resetDebugSettings();
  player1.setCharacterType('normal');
  player2.setCharacterType('normal');
  selectedMap = 'alpha';
  characterSelectionPlayer = 1;
  startGame();
}

function getSelectableCharacterTypes() {
  return characterTypes.filter(
    (characterType) =>
      (!hiddenCharacterTypes.includes(characterType) ||
        (characterType === 'divineGeneral' && isDivineGeneralUnlocked()) ||
        (characterType === 'monkey' && isMonkeyUnlocked())) &&
      (characterType !== 'lightWarrior' || isLightWarriorUnlocked()) &&
      (characterType !== 'ghost' || isGhostUnlocked()) &&
      (characterType !== 'divineGeneral' || isDivineGeneralUnlocked())
  );
}

function getVisibleStatisticsCharacterTypes() {
  return characterTypes.filter(
    (characterType) =>
      !hiddenCharacterTypes.includes(characterType) ||
      (characterType === 'divineGeneral' && isDivineGeneralUnlocked()) ||
      (characterType === 'monkey' && (isMonkeyUnlocked() || ensureCharacterStatistic('monkey').played > 0))
  );
}

function selectCharacter(characterType, secretVariant = null) {
  if (secretVariant === 'superFireMaster' && !isSuperFireMasterUnlocked()) return;
  if (secretVariant === 'scammer' && !isScammerUnlocked()) return;
  if (arcadeBossVariants.includes(secretVariant) && secretVariant !== 'scammer' && !arcadeBossesUnlocked) return;

  const selectedCharacterType = blindMode ? blindCharacterMix[characterType] || characterType : characterType;
  const selectedSecretVariant = blindMode
    ? null
    : secretVariant || (selectedCharacterType === 'lightWarrior' && characterSecretModes.lightWarriorOmega ? 'omega' : null);
  if (selectedCharacterType === 'lightWarrior' && !isLightWarriorUnlocked()) return;
  if (selectedCharacterType === 'ghost' && !isGhostUnlocked()) return;
  if (selectedCharacterType === 'divineGeneral' && !isDivineGeneralUnlocked()) return;
  if (selectedCharacterType === 'monkey' && !isMonkeyUnlocked()) return;
  if (characterSelectionPlayer === 1) {
    player1.setCharacterType(selectedCharacterType, selectedSecretVariant);
    if (blindMode) applyBlindFighterLook(player1);
    if (normalArcadeActive) {
      player2.setCharacterType(arcadeChapter === 'fireMaster' ? 'normal' : 'normal');
      openMapSelect();
      return;
    }
    characterSelectionPlayer = 2;
    characterSelectTitle.innerText = 'Personaje Jugador 2';
    characterScreen.classList.add('selecting-player2');
    characterButtons.forEach(({ button }) => {
      button.disabled = button.classList.contains('locked');
      button.classList.toggle('arcade-disabled', false);
    });
    return;
  }

  player2.setCharacterType(selectedCharacterType, selectedSecretVariant);
  if (blindMode) applyBlindFighterLook(player2);
  openMapSelect();
}

function selectRandomCharacter() {
  const selectableCharacters = getSelectableCharacterTypes();
  if (selectableCharacters.length === 0) return;

  const randomCharacter = selectableCharacters[Math.floor(Math.random() * selectableCharacters.length)];
  selectCharacter(randomCharacter);
}

function openMapSelect() {
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  mapScreen.classList.remove('hidden');
}

function closeMapSelect() {
  mapScreen.classList.add('hidden');
  characterScreen.classList.remove('hidden');
  characterSelectionPlayer = 2;
  characterSelectTitle.innerText = 'Personaje Jugador 2';
  characterScreen.classList.add('selecting-player2');
}

function selectMap(mapName) {
  selectedMap = mapName;
  configureNormalArcadeLevel();
  mapScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  startGame();
}

function openCharacterSelect() {
  syncMonkeyUnlockUI();
  syncScammerUnlockUI();
  characterSelectionPlayer = 1;
  characterSelectTitle.innerText = 'Personaje Jugador 1';
  characterScreen.classList.remove('selecting-player2');
  characterButtons.forEach(({ button, characterType }) => {
    const arcadeDisabled = normalArcadeActive && characterType !== 'normal';
    button.disabled = arcadeDisabled || button.classList.contains('locked');
    button.classList.toggle('arcade-disabled', arcadeDisabled);
  });
  arcadeBossCharacterButtons.forEach((button) => {
    button.disabled = normalArcadeActive;
    button.classList.toggle('arcade-disabled', normalArcadeActive);
  });
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  characterScreen.classList.remove('hidden');
}

function closeCharacterSelect() {
  deactivateBlindMode();
  if (normalArcadeActive) {
    normalArcadeActive = false;
    characterScreen.classList.add('hidden');
    arcadeLevelsScreen.classList.remove('hidden');
    syncNormalArcadeLevels();
    return;
  }
  characterSelectionPlayer = 1;
  characterScreen.classList.remove('selecting-player2');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSettings() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  settingsScreen.classList.remove('hidden');
}

function closeSettings() {
  settingsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openGameModes() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  gameModesScreen.classList.remove('hidden');
}

function closeGameModes() {
  gameModesScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function getArcadeChapterProgress(chapter) {
  const previousChapter = arcadeChapter;
  arcadeChapter = chapter;
  const highestLevel = getNormalArcadeHighestLevel();
  const totalLevels = getArcadeChapterLevelCount();
  arcadeChapter = previousChapter;
  const playableLevels = chapter === 'gambler' ? gamblerArcadePlayableLevels : chapter === 'reflecter' ? reflecterArcadePlayableLevels : totalLevels;
  let completedLevels = Math.min(playableLevels, highestLevel - 1);
  if (chapter === 'normal' && unlockedAchievements.normalArcadeCompleted) completedLevels = totalLevels;
  if (chapter === 'fireMaster' && unlockedAchievements.fireArcadeCompleted) completedLevels = totalLevels;
  if (chapter === 'gambler' && unlockedAchievements.gamblerArcadeCompleted) completedLevels = totalLevels;
  return { completedLevels, playableLevels, totalLevels };
}

function syncArcadeChapterProgress() {
  ['normal', 'fireMaster', 'gambler', 'reflecter'].forEach((chapter) => {
    const { completedLevels, playableLevels, totalLevels } = getArcadeChapterProgress(chapter);
    const fill = document.querySelector(`[data-chapter-fill="${chapter}"]`);
    const text = document.querySelector(`[data-chapter-progress="${chapter}"]`);
    const badge = document.querySelector(`[data-chapter-badge="${chapter}"]`);
    const pendingLevels = totalLevels - playableLevels;
    if (fill) fill.style.width = `${(completedLevels / totalLevels) * 100}%`;
    if (text) {
      text.innerText = `${completedLevels}/${totalLevels} niveles${pendingLevels > 0 ? ` - ${pendingLevels} proximamente` : ''}`;
    }
    if (badge) {
      const completed = completedLevels >= totalLevels;
      const playableDone = completedLevels >= playableLevels;
      badge.innerText = completed ? 'COMPLETADO' : playableDone ? 'EN ESPERA' : completedLevels > 0 ? 'EN CURSO' : 'NUEVO';
      badge.dataset.state = completed ? 'done' : playableDone ? 'waiting' : completedLevels > 0 ? 'progress' : 'new';
    }
  });
}

function openArcadeLevels() {
  gameModesScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.remove('hidden');
  normalArcadeActive = false;
  syncArcadeChapterProgress();
  arcadeChaptersScreen.querySelector('.arcade-chapters-panel').scrollTop = 0;
}

function isHybridEnemy(fighter) {
  return Boolean(fighter && hybridEnemyTypes[fighter.secretVariant]);
}

function useHybridAbility(attacker, target) {
  const hybrid = hybridEnemyTypes[attacker.secretVariant];
  if (!hybrid || attacker.hybridAbilityCooldown > 0 || !canFighterAct(attacker) || attacker.gamblerStunTimer > 0 || gameOver) return false;

  let ability = hybrid.abilities[attacker.hybridAbilityIndex % hybrid.abilities.length];
  attacker.hybridAbilityIndex += 1;
  // T-0 only rewinds when 3 seconds ago it had noticeably more health than now
  const rewindPoint = attacker.robotHistory && attacker.robotHistory[0];
  if (ability === 'rewind' && (!rewindPoint || !(rewindPoint.health - attacker.health >= 8))) {
    ability = hybrid.abilities[attacker.hybridAbilityIndex % hybrid.abilities.length];
    attacker.hybridAbilityIndex += 1;
  }
  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const frontX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x;

  if (ability === 'discharge') {
    robotShots.push(new RobotShot({ kind: 'discharge', x: direction > 0 ? frontX : frontX - 34, y: ground - 30, direction, attacker, target, velocityX: getDebugProjectileSpeed(8.5, attacker) * direction }));
    playSound('robotDischarge');
  } else if (ability === 'rivetShot') {
    robotShots.push(new RobotShot({ kind: 'rivet', x: direction > 0 ? frontX + 10 : frontX - 36, y: attacker.position.y + 60, direction, attacker, target, velocityX: getDebugProjectileSpeed(12, attacker) * direction }));
    playSound('robotRivet');
  } else if (ability === 'tickBomb') {
    const bombX = Math.max(20, Math.min(canvas.width - 50, targetCenterX - 15));
    robotShots.push(new RobotShot({ kind: 'tickBomb', x: bombX, y: ground - 30, attacker, target }));
    playSound('robotTick');
  } else if (ability === 'rewind') {
    // back to where it was 3 seconds ago, with the health it had at that moment
    const history = attacker.robotHistory || [];
    const past = history[0];
    if (past) {
      jesterAfterimages.push({ x: attacker.position.x, y: attacker.position.y, width: attacker.width, height: attacker.height, life: 30 });
      attacker.position.x = past.x;
      attacker.position.y = past.y;
      if (Number.isFinite(past.health)) attacker.health = Math.min(attacker.maxHealth, Math.max(attacker.health, past.health));
    }
    attacker.robotRewindFlash = 24;
    attacker.robotHistory = [];
    playSound('robotRewind');
    updateHealthBars();
  } else if (ability === 'scrapBarrage') {
    const pieces = hybrid.scrapPieces || 3;
    for (let index = 0; index < pieces; index += 1) {
      const distance = Math.abs(targetCenterX - attackerCenterX);
      const spread = index - (pieces - 1) / 2;
      robotShots.push(new RobotShot({
        kind: 'scrap',
        x: attackerCenterX - 10,
        y: attacker.position.y + 20,
        direction,
        attacker,
        target,
        // flight time to chest height is ~54 frames, so aim the middle piece at the target and spread the others
        velocityX: direction * (distance / 54 + spread * 1.1),
        velocityY: -9 - Math.abs(spread) * 0.6,
      }));
    }
    playSound('robotScrap');
  } else if (ability === 'dualDischarge') {
    // slams the floor: two sparks run out to both sides
    [-1, 1].forEach((side) => {
      robotShots.push(new RobotShot({ kind: 'discharge', x: attackerCenterX - 17, y: ground - 30, direction: side, attacker, target, velocityX: getDebugProjectileSpeed(9.5, attacker) * side }));
    });
    attacker.robotSlamFlash = 14;
    playSound('robotBoom');
    playSound('robotDischarge');
  } else if (ability === 'shieldCharge') {
    // the guard raises its riot shield and charges at the opponent
    attacker.robotChargeTimer = robotChargeFrames;
    attacker.robotChargeDirection = direction;
    attacker.robotChargeHit = false;
    attacker.attacksToTheRight = direction > 0;
    playSound('robotCharge');
  } else if (ability === 'magnetPull') {
    attacker.robotMagnetTimer = 75;
    playSound('robotMagnet');
  } else if (ability === 'tankShell') {
    tankShells.push(new TankShell({ x: direction > 0 ? frontX : frontX - 28, y: attacker.position.y + 30, direction, target, attacker, damage: hybridTankShellDamage }));
    playSound('tankShell');
  } else if (ability === 'fireball') {
    fireballs.push(new Fireball({ x: direction > 0 ? frontX : frontX - 34, y: attacker.position.y + 44, direction, target, attacker, damageMultiplier: hybridFireballDamageMultiplier }));
    playSound('fireball');
  } else if (ability === 'chronoBlade') {
    chronoBlades.push(new ChronoBlade({ x: direction > 0 ? frontX : frontX - 42, y: attacker.position.y + attacker.height / 2 - 7, target, attacker }));
    playSound('sorcererOrb');
  }
  recordSpecialUsed(attacker);
  attacker.hybridAbilityCooldown = getDebugCooldown(hybrid.cooldown, attacker);
  return true;
}

function getArcadeChapterHero() {
  if (arcadeChapter === 'fireMaster') return 'fireMaster';
  if (arcadeChapter === 'gambler') return 'gambler';
  if (arcadeChapter === 'reflecter') return 'reflecter';
  return 'normal';
}

function getArcadeChapterMap() {
  if (arcadeChapter === 'fireMaster') return 'fireArcade';
  if (arcadeChapter === 'gambler') return 'gamblerArcade';
  if (arcadeChapter === 'reflecter') return 'robotFactory';
  return 'normalArcade';
}

function getArcadeChapterLevelCount() {
  if (arcadeChapter === 'gambler') return gamblerArcadeLevelCount;
  if (arcadeChapter === 'reflecter') return reflecterArcadeLevelCount;
  return 5;
}

function getArcadeProgressStorageKey() {
  if (arcadeChapter === 'fireMaster') return fireArcadeProgressStorageKey;
  if (arcadeChapter === 'gambler') return gamblerArcadeProgressStorageKey;
  if (arcadeChapter === 'reflecter') return reflecterArcadeProgressStorageKey;
  return normalArcadeProgressStorageKey;
}

function isArcadeLevelComingSoon(level) {
  if (arcadeChapter === 'reflecter') return level > reflecterArcadePlayableLevels;
  return arcadeChapter === 'gambler' && level > gamblerArcadePlayableLevels;
}

function configureReflecterArcadeLevel() {
  const levelData = reflecterArcadeLevels[selectedNormalArcadeLevel] || reflecterArcadeLevels[1];
  player1.setCharacterType('reflecter');
  selectedMap = 'robotFactory';
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  configureReflecterArcadeEnemy();
}

function configureReflecterArcadeEnemy() {
  const levelData = reflecterArcadeLevels[selectedNormalArcadeLevel] || reflecterArcadeLevels[1];
  const enemyIndex = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  const robotId = levelData.enemies[enemyIndex];
  const robot = hybridEnemyTypes[robotId];
  player2.setCharacterType(robot.baseType);
  player2.secretVariant = robotId;
  if (robot.color) player2.color = robot.color;
  botDifficulty = levelData.difficulties[enemyIndex] || 'medium';
  applyBotDifficulty();
  player2.setMaxHealth(robot.health);
  player2.health = player2.maxHealth;
  if (robot.damageMultiplier) player2.damageMultiplier = robot.damageMultiplier;
  if (robot.size) {
    player2.width = robot.size.width;
    player2.height = robot.size.height;
    player2.position.y = Math.min(player2.position.y, ground - player2.height);
  }
  player2.hybridAbilityCooldown = 90;
  player2.hybridAbilityIndex = 0;
  player2.robotHistory = [];
  player2.robotMagnetTimer = 0;
  player2.robotRewindFlash = 0;
  player2.robotChargeTimer = 0;
  player2.robotSlamFlash = 0;
  resetFactoryRobotGlitch(player2);
  updateHealthBars();
  updateCombatHudIdentity();
}

function syncReflecterArcadeChapterUI() {
  const levelTitles = ['Acceso restringido', 'Linea de montaje', 'Control de calidad', 'Deposito de descartes', 'En construccion', 'En construccion'];
  const levelDescriptions = [
    'La puerta trasera de la Planta 7 sigue custodiada. Un Dron de Chatarra: poca vida... y muchas fallas.',
    'La cinta transportadora todavia se mueve sola. Un Dron de Chatarra y un enorme Guardia Oxidado, con canon y escudo antidisturbios, bloquean el paso.',
    'Aca terminaban los robots que no pasaban las pruebas: el Prototipo T-0, una copia fallida de Chrono que puede rebobinarse 3 segundos atras, y una Unidad Sobrecargada.',
    'Tres descartes y, al fondo, la Ensambladora Defectuosa: una maquina gigante que se armo a si misma con restos de las demas. 240 de vida.',
    'Este sector de la fabrica todavia esta en construccion.',
    'Este sector de la fabrica todavia esta en construccion.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (title) title.innerText = levelTitles[index];
    if (description) description.innerText = levelDescriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo de Reflecter';
  arcadeStoryKicker.innerText = 'La fabrica abandonada';
  arcadeStoryParagraphOne.innerText =
    'Prisma Dynamics, la empresa que creo a Reflecter, lo envio a una mision secreta: entrar a la Planta 7 de Tempus Corp., la empresa rival que creo a Chrono. La fabrica esta abandonada hace años... pero sus maquinas siguen encendidas.';
  arcadeStoryParagraphTwo.innerText =
    'Adentro solo quedan robots defectuosos y fallidos que se traban, chispean y atacan sin control. La orden es clara: destruirlos a todos. Aprovecha cuando fallan: se quedan congelados unos segundos.';
}

function getGamblerArcadeLuck() {
  return Math.min(gamblerLuckCap, selectedNormalArcadeLevel * gamblerArcadeLuckPerLevel);
}

function configureScammerBoss() {
  player2.setCharacterType('gambler', 'scammer');
  botDifficulty = 'hard';
  applyBotDifficulty();
  if (isDebugModified()) {
    player2.scammerRage = true;
    player2.setMaxHealth(scammerRageHealth);
    player2.moveSpeed *= scammerRageSpeedMultiplier;
    player2.damageMultiplier *= scammerRageDamageMultiplier;
    player2.color = '#e53935';
  }
  player2.health = player2.maxHealth;
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureGamblerArcadeLevel() {
  const levelData = gamblerArcadeLevels[selectedNormalArcadeLevel] || gamblerArcadeLevels[1];
  player1.setCharacterType('gambler');
  player1.gamblerLuckBonus = Math.max(player1.gamblerLuckBonus, getGamblerArcadeLuck());
  if (selectedNormalArcadeLevel === 6) {
    selectedMap = 'jesterRift';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    player2.setCharacterType('gambler', 'shadowJester');
    botDifficulty = 'hard';
    applyBotDifficulty();
    player2.health = player2.maxHealth;
    // Gambler starts with his full luck; Shadow Jester steals 50 of it a moment into the fight
    jesterLuckStealTimer = jesterLuckStealDuration;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    selectedMap = 'gamblerAlley';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureScammerBoss();
    return;
  }
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  configureGamblerArcadeEnemy();
}

function configureGamblerArcadeEnemy() {
  if (selectedNormalArcadeLevel === 6) return;
  if (selectedNormalArcadeLevel === 5) {
    configureScammerBoss();
    return;
  }
  const levelData = gamblerArcadeLevels[selectedNormalArcadeLevel] || gamblerArcadeLevels[1];
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

function syncGamblerArcadeChapterUI() {
  const levelTitles = ['Primera apuesta', 'Doble o nada', 'Cartas marcadas', 'Todo al rojo', 'El callejon del estafador', 'El que reparte las cartas'];
  const levelDescriptions = [
    'Un Vaquero Blindado bloquea la entrada a Ciudad Cobalto: balas de Cowboy y un canon de Living Tank. Suerte inicial +10%.',
    'Dos mezclas seguidas: el Vaquero Blindado y un Mago Ardiente que lanza orbes y bolas de fuego. Suerte inicial +20%.',
    'El Mago Ardiente vuelve con un Espejo Temporal que copia habilidades y lanza cuchillas de Chrono. Suerte inicial +30%.',
    'Tres mezclas y, al final, la Quimera: blindaje de tanque, fuego y tiempo en un solo cuerpo. Suerte inicial +40%.',
    'Un callejon oscuro, un contenedor de basura... y alguien que quiere venderte algo. Scammer: 185 de vida y muchas "ofertas". Suerte inicial +50%.',
    'La ciudad esta en silencio... demasiado silencio. Alguien estuvo jugando con todos desde el principio. Suerte inicial +60%.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (title) title.innerText = levelTitles[index];
    if (description) description.innerText = levelDescriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo de Gambler';
  arcadeStoryKicker.innerText = 'La ciudad de las apuestas';
  arcadeStoryParagraphOne.innerText =
    'Gambler llego a Ciudad Cobalto, una ciudad azul donde las calles se mezclan como cartas barajadas. Alguien esta fusionando luchadores en criaturas imposibles y apuesta con sus vidas.';
  arcadeStoryParagraphTwo.innerText =
    'Cada nivel superado le devuelve un poco de su suerte: empieza cada pelea con mas LUCK. Pero cuanto mas avanza, mas se deforma y oscurece la ciudad... como si alguien no quisiera que llegue al final.';
}

function syncArcadeChapterUI() {
  if (arcadeLevelSixButton) arcadeLevelSixButton.classList.toggle('hidden', arcadeChapter !== 'gambler' && arcadeChapter !== 'reflecter');
  if (arcadeChapter === 'gambler') {
    syncGamblerArcadeChapterUI();
    return;
  }
  if (arcadeChapter === 'reflecter') {
    syncReflecterArcadeChapterUI();
    return;
  }
  const fireChapter = arcadeChapter === 'fireMaster';
  const levelTitles = fireChapter
    ? ['La primera chispa', 'Guardianes congelados', 'Calor bajo cero', 'El glaciar que camina', 'El invierno eterno']
    : ['Nivel 1', 'El escondite', 'Zona de riesgo', 'La emboscada', 'Jefe de la banda'];
  const levelDescriptions = fireChapter
    ? [
        'Enfrentate a un Bruto Invernal debilitado y recupera tu primera chispa.',
        'Los Brutos Invernales bloquearon el paso. Derrotalos y abre la fortaleza.',
        'La fortaleza roba energia de fuego. Supera a otra banda de Brutos Invernales antes de que te rodeen.',
        'Mitad guardia, mitad montaña. Los golpes le rebotan y el suelo se congela bajo tus pies. Quedarse quieto es morir.',
        'Ice Master robo tu fuego y lo volvio hielo. Solo uno de los dos va a bajar de esta montaña.',
      ]
    : [
        'El comienzo del caos. Enfrentate a Bruto Gris, un enemigo controlado por IA con menos vida y daño que Normal.',
        'La banda cerro las salidas. Derrota a sus guardianes y abrete paso.',
        'Los rivales mas duros protegen el centro de operaciones criminal.',
        'Normal quedo rodeado. Solo una victoria perfecta le permitira continuar.',
        'El jefe rojo espera al final. Tiene 140 de vida y una onda de choque capaz de lanzar a Normal.',
      ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (title) title.innerText = levelTitles[index];
    if (description) description.innerText = levelDescriptions[index];
  });
  arcadeLevelsTitle.innerText = fireChapter ? 'Capitulo de Fire Master' : 'Capitulo de Normal';
  arcadeStoryKicker.innerText = fireChapter ? 'El despertar del fuego' : 'El comienzo del caos';
  arcadeStoryParagraphOne.innerText = fireChapter
    ? 'Fire Master descubrio que una fortaleza helada estaba drenando la energia de los barrios. Para recuperar su poder, debe abrirse paso entre guardianes de hielo y fuego robado.'
    : 'Normal se encontro con un grupo criminal que estaba aterrorizando los barrios de la ciudad. Intentaron secuestrarlo para obligarlo a trabajar para ellos, pero Normal se resistio y decidio acabar con la banda golpe a golpe.';
  arcadeStoryParagraphTwo.innerText = fireChapter
    ? 'Al final de la fortaleza espera Ice Master, un rival capaz de apagar cualquier llama. Solo el fuego de Fire Master puede romper el invierno.'
    : 'Ahora debe atravesar su primer escondite y demostrar que una buena pelea puede ser el principio de una gran historia.';
}

function openArcadeChapter(chapter = 'normal') {
  arcadeChapter = chapter;
  arcadeChaptersScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.remove('hidden');
  syncArcadeChapterUI();
  syncNormalArcadeLevels();
}

function closeArcadeChapters() {
  arcadeChaptersScreen.classList.add('hidden');
  gameModesScreen.classList.remove('hidden');
}

function closeArcadeLevels() {
  arcadeLevelsScreen.classList.add('hidden');
  arcadeChaptersScreen.classList.remove('hidden');
  syncArcadeChapterProgress();
}

function getNormalArcadeHighestLevel() {
  try {
    const savedLevel = Number(localStorage.getItem(getArcadeProgressStorageKey()) || 1);
    return Math.min(getArcadeChapterLevelCount(), Math.max(1, Number.isFinite(savedLevel) ? savedLevel : 1));
  } catch (error) {
    return 1;
  }
}

function syncNormalArcadeLevels() {
  const highestLevel = getNormalArcadeHighestLevel();
  normalArcadeLevelButtons.forEach((levelButton) => {
    const level = Number(levelButton.dataset.arcadeLevel);
    const comingSoon = isArcadeLevelComingSoon(level);
    const unlocked = level <= highestLevel && !comingSoon;
    levelButton.disabled = !unlocked;
    levelButton.classList.toggle('locked', !unlocked);
    levelButton.classList.toggle('coming-soon', comingSoon);
    levelButton.classList.toggle('completed', !comingSoon && level < highestLevel);
    const status = levelButton.querySelector('.arcade-level-status');
    if (status) {
      status.textContent = comingSoon ? 'PROXIMAMENTE' : unlocked ? (level < highestLevel ? 'SUPERADO' : 'DISPONIBLE') : 'BLOQUEADO';
    }
  });
}

function unlockNextNormalArcadeLevel(completedLevel) {
  const nextLevel = Math.min(getArcadeChapterLevelCount(), Number(completedLevel) + 1);
  try {
    if (nextLevel > getNormalArcadeHighestLevel()) {
      localStorage.setItem(getArcadeProgressStorageKey(), String(nextLevel));
    }
  } catch (error) {
    // Progress remains available for the current session if storage is blocked.
  }
  syncNormalArcadeLevels();
}

function openGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  guideScreen.classList.remove('hidden');
}

function closeGuide() {
  guideScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openAchievements() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  achievementsScreen.classList.remove('hidden');
}

function closeAchievements() {
  achievementsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openStatistics() {
  syncStatisticsUI();
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  statsScreen.classList.remove('hidden');
}

function closeStatistics() {
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openInfo() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  infoScreen.classList.remove('hidden');
}

function closeInfo() {
  infoScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openOpinion() {
  if (!codexOpinionUnlocked) return;

  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  opinionScreen.classList.remove('hidden');
}

function closeOpinion() {
  opinionScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openDebug() {
  unlockAchievement('debug');
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  debugScreen.classList.remove('hidden');
}

function closeDebug() {
  debugScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openOldDays() {
  unlockAchievement('oldDays');
  deactivateBlindMode();
  titleScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.remove('hidden');
}

function closeOldDays() {
  oldDaysScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSecretGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  gameModesScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  secretGuideScreen.classList.remove('hidden');
}

function closeSecretGuide() {
  secretGuideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSecretCharacters() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.remove('hidden');
}

function closeSecretCharacters() {
  secretCharactersScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openEventGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.remove('hidden');
}

function closeEventGuide() {
  eventGuideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function syncDebugControls() {
  debugControls.forEach(({ input, output, setting }) => {
    input.value = debugSettings[setting];
    output.innerText = formatDebugMultiplier(debugSettings[setting]);
  });
  debugAffectedCharacterInputs.forEach((input) => {
    input.checked = debugAffectedCharacters[input.dataset.debugCharacter] !== false;
  });
  if (debugRestoreAttackSpamInput) {
    debugRestoreAttackSpamInput.checked = debugSettings.restoreAttackSpam;
  }
  if (debugAffectAllInput) {
    debugAffectAllInput.checked = Array.from(debugAffectedCharacterInputs).every((input) => input.checked);
  }
}

function applyDebugSettings() {
  player1.setMaxHealth(player1.baseMaxHealth);
  player2.setMaxHealth(player2.baseMaxHealth);
  updateHealthBars();
  syncDebugControls();
}

function resetDebugSettings() {
  Object.assign(debugSettings, defaultDebugSettings);
  Object.keys(debugAffectedCharacters).forEach((characterType) => {
    debugAffectedCharacters[characterType] = true;
  });
  applyDebugSettings();
}

function toggleSimpleTop() {
  const showingSimple = !categoryTopSimple.classList.contains('hidden');
  categoryTopSimple.classList.toggle('hidden', showingSimple);
  categoryTopDetailed.classList.toggle('hidden', !showingSimple);
  simpleTopButton.innerText = showingSimple ? 'Version simplificada' : 'Version detallada';
}

function updateBotSetting() {
  botEnabled = botToggle.checked;
  player2Instructions.innerText = botEnabled
    ? 'Jugador 2: bot activado'
    : 'Jugador 2: flechas mover/saltar, flecha abajo atacar, Shift golpe fuerte, / especial 1, . especial 2';

  applyBotDifficulty();

  if (botEnabled) {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
  }
}

function updateBotDifficulty() {
  const selectedDifficulty = document.querySelector('input[name="botDifficulty"]:checked');
  botDifficulty = selectedDifficulty ? selectedDifficulty.value : 'medium';
  applyBotDifficulty();
}

function applyBotDifficulty() {
  const difficultySettings = botDifficultySettings[botDifficulty];
  if (botEnabled) {
    player2.setMaxHealth(
      isArcadeBossFighter(player2) ||
      player2.characterType === 'monkey' ||
      player2.characterType === 'tank' ||
      player2.characterType === 'cowboy' ||
      player2.characterType === 'lightWarrior' ||
      player2.characterType === 'reflecter' ||
      player2.characterType === 'switcher' ||
      player2.characterType === 'sorcerer' ||
      player2.characterType === 'gambler' ||
      player2.characterType === 'chrono' ||
      player2.characterType === 'ghost' ||
      player2.characterType === 'divineGeneral'
        ? getCharacterMaxHealth(player2.characterType, player2)
        : difficultySettings.maxHealth
    );
  } else {
    player2.setMaxHealth(getCharacterMaxHealth(player2.characterType, player2));
  }
  updateHealthBars();
}

function getCharacterMaxHealth(characterType, fighter = null) {
  if (isArcadeBossFighter(fighter)) return getArcadeBossVariantHealth(fighter);
  if (characterType === 'monkey') return monkeyHealth;
  if (characterType === 'fireMaster') return getFireMasterHealth(fighter);
  if (characterType === 'lightWarrior') return lightWarriorHealth;
  if (characterType === 'tank') return isTankIronWall(fighter) ? 260 : 200;
  if (characterType === 'cowboy') return getCowboyHealth(fighter);
  if (characterType === 'reflecter') return getReflecterHealth(fighter);
  if (characterType === 'switcher') return switcherHealth;
  if (characterType === 'sorcerer') return sorcererHealth;
  if (characterType === 'gambler') return gamblerHealth;
  if (characterType === 'chrono') return chronoHealth;
  if (characterType === 'ghost') return ghostHealth;
  if (characterType === 'divineGeneral') return getDivineMaxHealth(fighter);
  return 100;
}

function updatePlayerColor(player, color, cssVariable) {
  player.setColor(color);
  document.documentElement.style.setProperty(cssVariable, color);
}

player1ColorInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updatePlayerColor(player1, input.value, '--player1');
  });
});

player2ColorInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updatePlayerColor(player2, input.value, '--player2');
  });
});

botDifficultyInputs.forEach((input) => {
  input.addEventListener('change', updateBotDifficulty);
});

[
  { input: masterVolumeControl, output: masterVolumeValue, setting: 'master' },
  { input: musicVolumeControl, output: musicVolumeValue, setting: 'music' },
  { input: sfxVolumeControl, output: sfxVolumeValue, setting: 'sfx' },
].forEach(({ input, output, setting }) => {
  if (!input || !output) return;
  input.addEventListener('input', () => {
    audioSettings[setting] = clampAudioVolume(input.value);
    output.innerText = formatAudioVolume(audioSettings[setting]);
    saveAudioSetting(setting);
    applyAudioSettings();
  });
});

debugControls.forEach(({ input, output, setting }) => {
  input.addEventListener('input', () => {
    debugSettings[setting] = Number(input.value);
    output.innerText = formatDebugMultiplier(debugSettings[setting]);
    applyDebugSettings();
  });
});

if (debugAffectAllInput) {
  debugAffectAllInput.addEventListener('change', () => {
    debugAffectedCharacterInputs.forEach((input) => {
      input.checked = debugAffectAllInput.checked;
      debugAffectedCharacters[input.dataset.debugCharacter] = input.checked;
    });
    applyDebugSettings();
  });
}

debugAffectedCharacterInputs.forEach((input) => {
  input.addEventListener('change', () => {
    debugAffectedCharacters[input.dataset.debugCharacter] = input.checked;
    if (debugAffectAllInput) {
      debugAffectAllInput.checked = Array.from(debugAffectedCharacterInputs).every((targetInput) => targetInput.checked);
    }
    applyDebugSettings();
  });
});

mapOptionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectMap(button.dataset.map);
  });
});

mainMenu.addEventListener('click', handleMenuAudioInteraction);
mainMenu.addEventListener('pointerover', (event) => {
  const hoveredButton = event.target && event.target.closest ? event.target.closest('button') : null;
  if (hoveredButton && !hoveredButton.contains(event.relatedTarget)) {
    playSound('menuMove');
  }
});

playButton.addEventListener('click', openCharacterSelect);
oldDaysPlayButton.addEventListener('click', startOldDaysGame);
oldDaysBackButton.addEventListener('click', closeOldDays);
normalCharacterButton.addEventListener('click', () => selectCharacter('normal'));
lightWarriorCharacterButton.addEventListener('click', () => selectCharacter('lightWarrior'));
fireMasterCharacterButton.addEventListener('click', () => selectCharacter('fireMaster'));
fireMasterCharacterButton.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  selectCharacter('fireMaster', 'superFireMaster');
});
tankCharacterButton.addEventListener('click', () => selectCharacter('tank'));
cowboyCharacterButton.addEventListener('click', () => selectCharacter('cowboy'));
reflecterCharacterButton.addEventListener('click', () => selectCharacter('reflecter'));
switcherCharacterButton.addEventListener('click', () => selectCharacter('switcher'));
sorcererCharacterButton.addEventListener('click', () => selectCharacter('sorcerer'));
gamblerCharacterButton.addEventListener('click', () => selectCharacter('gambler'));
chronoCharacterButton.addEventListener('click', () => selectCharacter('chrono'));
ghostCharacterButton.addEventListener('click', () => selectCharacter('ghost'));
divineGeneralCharacterButton.addEventListener('click', () => selectCharacter('divineGeneral'));
monkeyCharacterButton.addEventListener('click', () => selectCharacter('monkey'));
scammerCharacterButton.addEventListener('click', () => selectCharacter('gambler', 'scammer'));
gangBossCharacterButton.addEventListener('click', () => selectCharacter('normal', 'arcadeBoss'));
icedThugCharacterButton.addEventListener('click', () => selectCharacter('normal', 'icedThug'));
iceMasterCharacterButton.addEventListener('click', () => selectCharacter('fireMaster', 'iceMaster'));
shadowJesterCharacterButton.addEventListener('click', () => selectCharacter('gambler', 'shadowJester'));
randomCharacterButton.addEventListener('click', selectRandomCharacter);
characterBackButton.addEventListener('click', closeCharacterSelect);
mapBackButton.addEventListener('click', closeMapSelect);
settingsButton.addEventListener('click', openSettings);
gameModesButton.addEventListener('click', openGameModes);
arcadeModeButton.addEventListener('click', openArcadeLevels);
normalArcadeChapterButton.addEventListener('click', () => openArcadeChapter('normal'));
fireArcadeChapterButton.addEventListener('click', () => openArcadeChapter('fireMaster'));
gamblerArcadeChapterButton.addEventListener('click', () => openArcadeChapter('gambler'));
reflecterArcadeChapterButton.addEventListener('click', () => openArcadeChapter('reflecter'));
normalArcadeLevelButtons.forEach((levelButton) => {
  levelButton.addEventListener('click', () => {
    if (levelButton.disabled) return;
    selectedNormalArcadeLevel = Number(levelButton.dataset.arcadeLevel);
    normalArcadeActive = true;
    if (isArcadeLevelComingSoon(selectedNormalArcadeLevel)) return;
    player1.setCharacterType(getArcadeChapterHero());
    player2.setCharacterType('normal');
    selectedMap = getArcadeChapterMap();
    normalArcadeLevelButtons.forEach((button) => button.classList.remove('selected'));
    levelButton.classList.add('selected');
    startGame();
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 5) startGamblerScammerCutscene();
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 6) startJesterIntro();
  });
});
guideButton.addEventListener('click', openGuide);
achievementsButton.addEventListener('click', openAchievements);
statsButton.addEventListener('click', openStatistics);
infoButton.addEventListener('click', openInfo);
opinionButton.addEventListener('click', openOpinion);
backButton.addEventListener('click', closeSettings);
gameModesBackButton.addEventListener('click', closeGameModes);
arcadeChaptersBackButton.addEventListener('click', closeArcadeChapters);
arcadeLevelsBackButton.addEventListener('click', closeArcadeLevels);
guideBackButton.addEventListener('click', closeGuide);
achievementsBackButton.addEventListener('click', closeAchievements);
statsBackButton.addEventListener('click', closeStatistics);
secretTrashButton.addEventListener('click', openScammerDumpster);
scammerIntroDialog.addEventListener('click', advanceScammerIntro);
scammerShopBackButton.addEventListener('click', closeScammerShop);
shopScammer.addEventListener('click', talkToShopScammer);
shopScammer.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    talkToShopScammer();
  }
});
window.addEventListener('keydown', (event) => {
  if (scammerIntroScreen.classList.contains('hidden')) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advanceScammerIntro();
  } else if (event.key === 'Escape') {
    finishScammerIntro();
  }
});
statsResetButton.addEventListener('click', resetPersistentStatistics);
infoBackButton.addEventListener('click', closeInfo);
opinionBackButton.addEventListener('click', closeOpinion);
debugBackButton.addEventListener('click', closeDebug);
debugResetButton.addEventListener('click', resetDebugSettings);
debugRestoreAttackSpamInput.addEventListener('change', () => {
  debugSettings.restoreAttackSpam = debugRestoreAttackSpamInput.checked;
  syncDebugControls();
});
secretGuideBackButton.addEventListener('click', closeSecretGuide);
secretCharactersBackButton.addEventListener('click', closeSecretCharacters);
eventGuideBackButton.addEventListener('click', closeEventGuide);
simpleTopButton.addEventListener('click', toggleSimpleTop);
botToggle.addEventListener('change', updateBotSetting);
restartButton.addEventListener('click', resetFight);
menuButton.addEventListener('click', returnToMenu);

syncShopBadges();
loadAudioSettings();
syncAudioSettingsUI();
syncDebugControls();
applyLanguage();
syncCodexOpinionUI();
migrateUnlocksFromExistingAchievements();
syncAchievementsUI();
syncStatisticsUI();
syncCoinWalletUI();
syncMonkeyUnlockUI();
syncScammerUnlockUI();
updateHealthBars();
animate();
