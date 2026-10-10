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
  if (attacker === player1 && isCh6Level()) ch6RunClean = false;
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
  const profile = botDifficultySettings[botDifficulty] || botDifficultySettings.medium;
  if (!normalArcadeActive) return profile;
  const key = botDifficulty in botDifficultySettings ? botDifficulty : 'medium';
  if (!arcadeBotProfileCache[key]) {
    arcadeBotProfileCache[key] = {
      ...profile,
      attackDelay: Math.round(profile.attackDelay * arcadeBotProfileScale.attackDelay),
      reactionChance: profile.reactionChance * arcadeBotProfileScale.chance,
      dodgeChance: profile.dodgeChance * arcadeBotProfileScale.chance,
      specialChance: profile.specialChance * arcadeBotProfileScale.chance,
      strongAttackChance: profile.strongAttackChance * arcadeBotProfileScale.chance,
    };
  }
  return arcadeBotProfileCache[key];
}

function isOmegariusBot() {
  return Boolean(hybridEnemyTypes[player2.secretVariant] && hybridEnemyTypes[player2.secretVariant].model === 'bronze');
}

function getBotAttackRange() {
  if (player2.characterType === 'divineGeneral') return 150;
  // Omegarius is wider than a normal fighter, so it reaches a bit further
  if (isOmegariusBot() || isNeoScammer(player2) || (!normalArcadeActive && isFactoryRobot(player2))) return 82 + (player2.width - 60) / 2;
  if (player2.characterType === 'tank') return 128;
  if (classicBotAI) return 82;
  // the hit box starts at the bot's edge: it lands while the gap between both bodies is shorter than its width
  const boxWidth = player2.attackBox ? player2.attackBox.width : 70;
  return Math.max(82, player2.width / 2 + boxWidth + player1.width / 2 - 14);
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
        projectile,
        speed: Math.abs(projectile.velocity.x),
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
        projectile: orb,
        speed: 0,
      };
    }
  }

  return null;
}

function dodgeBotThreat(threat, profile) {
  if (!threat) return false;
  // one decision per projectile: rerolling every frame made the bot dodge almost everything
  if (!botBrain.decided.has(threat.projectile)) botBrain.decided.set(threat.projectile, Math.random() < profile.dodgeChance);
  if (!botBrain.decided.get(threat.projectile)) return false;

  const botCenterX = player2.position.x + player2.width / 2;
  const awayDirection = threat.centerX < botCenterX ? 1 : -1;
  if (threat.type === 'gravity') {
    // walk out of the pull (jumping into it is worse)
    player2.velocity.x = getBotMoveSpeed() * awayDirection;
    if (isBotCornered(awayDirection) && player2.velocity.y === 0) botJump(-awayDirection);
    return true;
  }

  // jump just in time: a bit earlier the faster it comes (an easy bot is sloppier)
  const brain = getBotBrainSettings();
  const jumpDistance = 24 + threat.speed * 6 + (1 - brain.jumpTiming) * (Math.random() - 0.3) * 120;
  if (threat.distance > jumpDistance || player2.velocity.y !== 0) return false;
  // melee fighters jump over it toward the player; ranged ones jump in place to keep their spacing
  const toward = getFighterCenterX(player1) >= botCenterX ? 1 : -1;
  botJump(isRangedBot() ? 0 : toward);
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

  // the upgraded Chrono rewinds everything when the last 10 seconds went badly for him
  if (isChronoRival(player2) && player2.chronoRivalRewindCooldown === 0 && getChronoRewindGain() >= chronoRivalRewindMinGain) {
    if (castChronoTotalRewind(player2)) return true;
  }

  if (isOmegarius(player2)) return updateOmegariusBotSpecials(profile, absDistance);
  if (isNeoScammer(player2)) return updateNeoScammerBotSpecials(profile, absDistance);
  if (isKnight(player2) || isDarkKnight(player2)) return updateKnightBotSpecials(profile, absDistance);
  if (isRobledalKid(player2)) return updateRobledalKidBotSpecials(profile, absDistance);
  if (isMochi(player2)) return updateMochiBotSpecials(profile, absDistance);
  if (player2.secretVariant === 'chefBoss') return updateChefBossBotSpecials(profile, absDistance);
  if (player2.secretVariant === 'lanternGuard') return updateLanternGuardBotSpecials(profile, absDistance);
  if (player2.secretVariant === 'shaolinMaster') return updateShaolinBotSpecials(profile, absDistance);
  if (isPolice(player2)) return updatePoliceBotSpecials(profile, absDistance);
  if (isFriendThing(player2)) return updateFriendBotSpecials(profile, absDistance);
  if (isMossBeast(player2)) return !(player2.mossRootCooldown > 0) && shouldBotUseSpecial(profile, 0.6) ? castMossRoots(player2, player1) : false;

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
    !(isChronoRival(player2) && player2.health > player2.maxHealth / 2) &&
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

// the guard: the halberd sweep up close, the thrust from mid range, the lantern flash now and then
function updateLanternGuardBotSpecials(profile, absDistance) {
  const guard = player2;
  if (guard.guardGap > 0 || guard.guardSweepTimer > 0 || guard.guardThrustTimer > 0 || guard.guardFallen) return false;
  if (!(guard.guardSweepCooldown > 0) && absDistance < 170 && shouldBotUseSpecial(profile, 0.8)) return castGuardSweep(guard);
  if (!(guard.guardThrustCooldown > 0) && absDistance > 140 && absDistance < 360 && shouldBotUseSpecial(profile, 0.6)) return castGuardThrust(guard);
  if (!(guard.guardFlashCooldown > 0) && absDistance < 280 && shouldBotUseSpecial(profile, 0.4)) return castGuardFlash(guard, player1);
  return false;
}

// the furious chef: the pot when Knight is close, the rolling pin from mid range, pastry bombs whenever ready
function updateChefBossBotSpecials(profile, absDistance) {
  const chef = player2;
  if (chef.chefGap > 0) return false;
  if (!(chef.chefPotCooldown > 0) && absDistance < 150 && shouldBotUseSpecial(profile, 0.8)) return castChefPot(chef, player1);
  if (!(chef.chefPinCooldown > 0) && absDistance > 120 && shouldBotUseSpecial(profile, 0.6)) return castChefPin(chef, player1);
  if (!(chef.chefRainCooldown > 0) && shouldBotUseSpecial(profile, 0.5)) return castChefRain(chef, player1);
  return false;
}

// Mochi: rushes in with his flurry, uppercuts when close, eats a crumb of cake when hurt
function updateMochiBotSpecials(profile, absDistance) {
  const mochi = player2;
  if (mochi.mochiGap > 0 || mochi.mochiFlurryTimer > 0 || mochi.mochiUppercutTimer > 0) return false;
  if (!(mochi.mochiCakeCooldown > 0) && mochi.health < mochi.maxHealth * 0.5 && shouldBotUseSpecial(profile, 0.5)) return castMochiCake(mochi);
  if (!(mochi.mochiUppercutCooldown > 0) && absDistance < 110 && shouldBotUseSpecial(profile, 0.7)) return castMochiUppercut(mochi);
  if (!(mochi.mochiFlurryCooldown > 0) && absDistance < 320 && shouldBotUseSpecial(profile, 0.6)) return castMochiFlurry(mochi);
  return false;
}

// Celeste and Seto: they play with whatever trick is ready
function updateRobledalKidBotSpecials(profile, absDistance) {
  const kid = player2;
  if (kid.robledalGap > 0 || kid.celesteBlinkTimer > 0) return false;
  const ready = [];
  if (kid.secretVariant === 'celesteGirl') {
    if (!(kid.celesteThrowCooldown > 0) && absDistance > 120) ready.push(() => castCelesteThrow(kid, player1));
    if (!(kid.celesteBlinkCooldown > 0)) ready.push(() => castCelesteBlink(kid));
    if (!(kid.celesteRainCooldown > 0)) ready.push(() => castCelesteRain(kid, player1));
  } else {
    if (!(kid.setoTopCooldown > 0)) ready.push(() => castSetoTop(kid, player1));
    if (!(kid.setoBalloonCooldown > 0) && absDistance > 100) ready.push(() => castSetoBalloon(kid, player1));
    if (!(kid.setoBoxCooldown > 0) && absDistance < 260) ready.push(() => castSetoBox(kid, player1));
  }
  if (!ready.length || !shouldBotUseSpecial(profile, 0.6)) return false;
  return ready[Math.floor(Math.random() * ready.length)]();
}

// the Knight bot: shield against a hit coming in, the leap when close, the lunge from mid range
function updateKnightBotSpecials(profile, absDistance) {
  const knight = player2;
  if (knight.knightLungeTimer > 0 || knight.knightShieldTimer > 0 || knight.knightSlam || knight.knightGap > 0) return false;
  const threatened = (player1.isAttacking && absDistance < 170) || robotShots.some((shot) => shot.active && shot.attacker === player1);
  if (threatened && !(knight.knightShieldCooldown > 0) && shouldBotUseSpecial(profile, 0.9)) return castKnightShield(knight);
  if (!(knight.knightSlamCooldown > 0) && absDistance < 230 && shouldBotUseSpecial(profile, 0.5)) return castKnightSlam(knight, player1);
  if (!(knight.knightLungeCooldown > 0) && absDistance > 130 && absDistance < 380 && shouldBotUseSpecial(profile, 0.6)) return castKnightLunge(knight, player1);
  return false;
}

function updateNeoScammerBotSpecials(profile, absDistance) {
  const neo = player2;
  if (neo.neoCharge > 0 || neo.neoGap > 0 || neo.neoExhausted) return false;
  const ready = [];
  if (!(neo.neoBigShotCooldown > 0) && absDistance > 140) ready.push(() => startNeoBigShot(neo, player1));
  if (!(neo.neoPipisCooldown > 0)) ready.push(() => castNeoPipis(neo, player1));
  if (!(neo.neoHeadsCooldown > 0)) ready.push(() => castNeoHeads(neo, player1));
  if (!ready.length || !shouldBotUseSpecial(profile, 0.7)) return false;
  // unpredictable: any of the ready abilities, at random
  return ready[Math.floor(Math.random() * ready.length)]();
}

function updateOmegariusBotSpecials(profile, absDistance) {
  const omegarius = player2;
  if (omegarius.omegariusSecretActive || omegarius.omegariusExhausted) return false;
  // the final act, as soon as it is down to 10 health
  if (isOmegariusFinalUnlocked(omegarius)) return castOmegariusFinalAct(omegarius, player1);
  if (omegarius.hybridAbilityCooldown > 0 || omegarius.omegariusParryTimer > 0 || omegarius.omegariusBeamCharge > 0) return false;
  if (robotShots.some((shot) => shot.kind === 'hammer' && shot.attacker === omegarius)) return false;
  // the secret ability, as soon as it is down to 100 health
  if (!omegarius.omegariusSecretUsed && omegarius.health <= omegariusSecretHealth) return startOmegariusSecret(omegarius, player1);
  // the energy shot, from a distance, once it is unlocked
  if (omegarius.health <= omegariusBeamUnlockHealth && !(omegarius.omegariusBeamCooldown > 0) && absDistance > 150 && shouldBotUseSpecial(profile, 0.6)) {
    return startOmegariusBeam(omegarius, player1);
  }
  // the parry when Reflecter comes close (especially when he is about to hit)
  if (!(omegarius.omegariusParryCooldown > 0) && absDistance < 160 && (player1.isAttacking || Math.random() < 0.3) && shouldBotUseSpecial(profile, 0.7)) {
    return raiseOmegariusParry(omegarius);
  }
  // the hammer boomerang when Reflecter keeps his distance
  if (!(omegarius.omegariusThrowCooldown > 0) && absDistance > 140 && shouldBotUseSpecial(profile, 0.8)) {
    return throwOmegariusHammer(omegarius, player1);
  }
  return false;
}

// ---------- the bot's brain ----------
// The bot no longer rerolls everything every frame: it "thinks" every few frames (its reaction time),
// picks a plan and sticks to it for a while: approach, footsies right at the edge of your reach,
// pressure, hit and run, punishing a whiffed swing, jumping in. It reads your swings, notices when it
// lands a hit or gets hit, does not let itself be cornered and times its jumps over projectiles.
const botBrainSettings = {
  easy: { think: 28, react: 16, whiffPunish: 0.15, evade: 0.1, footsies: 0.2, pressure: 0.2, jumpIn: 0.04, combo: 0.1, hitAndRun: 0.15, jumpTiming: 0.35, escape: 0.15 },
  medium: { think: 16, react: 9, whiffPunish: 0.45, evade: 0.35, footsies: 0.42, pressure: 0.38, jumpIn: 0.1, combo: 0.35, hitAndRun: 0.3, jumpTiming: 0.75, escape: 0.45 },
  hard: { think: 8, react: 4, whiffPunish: 0.85, evade: 0.7, footsies: 0.55, pressure: 0.5, jumpIn: 0.16, combo: 0.6, hitAndRun: 0.45, jumpTiming: 1, escape: 0.8 },
};
const botBrain = {};

function resetBotBrain() {
  Object.assign(botBrain, {
    plan: 'approach',
    planTimer: 0,
    thinkTimer: 0,
    reactTimer: -1,
    decided: new WeakMap(),
    stepIn: false,
    jumped: false,
    kite: true,
    playerWasAttacking: false,
    lastPlayerHealth: null,
    lastBotHealth: null,
  });
}
resetBotBrain();

// in the arcade the enemies are a little less sharp (slower to react, read you less often)
const arcadeBotBrainScale = { time: 1.7, chance: 0.55 };
// and their basic stats too: slower swings, fewer dodges, specials and strong hits
const arcadeBotProfileScale = { attackDelay: 1.3, chance: 0.75 };
const arcadeBotProfileCache = {};
const arcadeBotBrainCache = {};

function getBotBrainSettings() {
  const settings = botBrainSettings[botDifficulty] || botBrainSettings.medium;
  if (!normalArcadeActive) return settings;
  const key = botDifficulty in botBrainSettings ? botDifficulty : 'medium';
  if (!arcadeBotBrainCache[key]) {
    const softer = {};
    Object.entries(settings).forEach(([name, value]) => {
      softer[name] = name === 'think' || name === 'react' ? Math.round(value * arcadeBotBrainScale.time) : value * arcadeBotBrainScale.chance;
    });
    arcadeBotBrainCache[key] = softer;
  }
  return arcadeBotBrainCache[key];
}

function setBotPlan(plan, frames) {
  botBrain.plan = plan;
  botBrain.planTimer = frames;
  botBrain.jumped = false;
  botBrain.stepIn = false;
}

function isRangedBot() {
  return ['cowboy', 'lightWarrior', 'fireMaster', 'sorcerer', 'chrono'].includes(player2.characterType);
}

// bosses built to always walk in and hit keep their old straightforward pattern
function usesSimpleBotMovement() {
  return isOmegariusBot() || isNeoScammer(player2) || (!normalArcadeActive && isFactoryRobot(player2));
}

function getPlayerReachOnBot() {
  return player1.width / 2 + (player1.attackBox ? player1.attackBox.width : 70) + player2.width / 2;
}

// is there a wall behind the bot if it keeps going this way (-1 left / 1 right)?
function isBotCornered(direction) {
  return direction < 0 ? player2.position.x < 50 : player2.position.x + player2.width > canvas.width - 50;
}

function botMove(direction, speedFactor = 1) {
  player2.velocity.x = direction * getBotMoveSpeed() * speedFactor;
}

function botJump(directionX = 0) {
  if (player2.velocity.y !== 0) return false;
  player2.velocity.y = getDebugJumpSpeed(-13, player2);
  if (directionX) player2.velocity.x = directionX * getBotMoveSpeed();
  return true;
}

function botTryAttack(profile, brain, { strong = false, delayFactor = 1 } = {}) {
  if (botAttackCooldown > 0 || player2.isAttacking) return false;
  const useStrong = player2.strongAttackCooldown === 0 && (strong || Math.random() < profile.strongAttackChance);
  player2.attack(useStrong);
  if (!player2.isAttacking) return false;
  botAttackCooldown = getDebugCooldown(Math.round(profile.attackDelay * delayFactor), player2);
  // after a swing: keep the string going, get out, or go back to playing the edge of the range
  if (botBrain.plan === 'pressure' && Math.random() < brain.combo + 0.15) {
    botAttackCooldown = Math.round(botAttackCooldown * 0.45);
    return true;
  }
  const roll = Math.random();
  if (roll < brain.combo) botAttackCooldown = Math.round(botAttackCooldown * 0.35);
  else if (roll < brain.combo + brain.hitAndRun) setBotPlan('retreat', 16 + Math.floor(Math.random() * 18));
  else if (roll < brain.combo + brain.hitAndRun + brain.footsies) setBotPlan('footsies', 40 + Math.floor(Math.random() * 40));
  return true;
}

// what is the player doing? a swing starting, a hit landed, a hit taken
function readPlayerForBot(brain, absDistance) {
  const playerReach = getPlayerReachOnBot();
  if (player1.isAttacking && !botBrain.playerWasAttacking) botBrain.reactTimer = brain.react;
  botBrain.playerWasAttacking = player1.isAttacking;
  if (botBrain.reactTimer > 0) {
    botBrain.reactTimer -= 1;
  } else if (botBrain.reactTimer === 0) {
    botBrain.reactTimer = -1;
    if (absDistance > playerReach + 4 && Math.random() < brain.whiffPunish) {
      // he swung at the air: go in while he recovers
      setBotPlan('punish', 36);
    } else if (absDistance <= playerReach + 50 && player1.isAttacking && Math.random() < brain.evade) {
      setBotPlan('evade', Math.max(6, (player1.attackDuration || 12) - (player1.attackTimer || 0) + 6));
    }
  }
  const playerDrop = botBrain.lastPlayerHealth === null ? 0 : botBrain.lastPlayerHealth - player1.health;
  const botDrop = botBrain.lastBotHealth === null ? 0 : botBrain.lastBotHealth - player2.health;
  botBrain.lastPlayerHealth = player1.health;
  botBrain.lastBotHealth = player2.health;
  // landed a real hit up close: press the advantage
  if (playerDrop >= 3 && absDistance < 200 && botBrain.plan !== 'pressure' && Math.random() < brain.pressure + 0.2) setBotPlan('pressure', 45);
  // took a real hit: back off (or, if it is smart, play the edge of the range and wait for a whiff)
  if (botDrop >= 3 && botBrain.plan !== 'punish' && botBrain.plan !== 'pressure' && Math.random() < 0.6) {
    setBotPlan(Math.random() < brain.evade ? 'footsies' : 'retreat', 22 + Math.floor(Math.random() * 16));
  }
}

function chooseBotPlan(brain, absDistance) {
  const lowBot = player2.health < player2.maxHealth * 0.3;
  const lowPlayer = player1.health < player1.maxHealth * 0.3;
  const playerCornered = player1.position.x < 60 || player1.position.x + player1.width > canvas.width - 60;
  if ((lowPlayer || playerCornered) && Math.random() < brain.pressure + 0.2) return setBotPlan('pressure', 60);
  if (absDistance > 170 && absDistance < 320 && Math.random() < brain.jumpIn) return setBotPlan('jumpIn', 60);
  const roll = Math.random();
  const footsies = Math.min(0.85, brain.footsies * (lowBot ? 1.4 : 1));
  if (roll < footsies) return setBotPlan('footsies', 50 + Math.floor(Math.random() * 50));
  if (roll < footsies + brain.pressure) return setBotPlan('pressure', 40 + Math.floor(Math.random() * 30));
  return setBotPlan('approach', 30);
}

function runBotPlan(profile, brain, toward, absDistance) {
  const inRange = absDistance <= getBotAttackRange();
  const playerReach = getPlayerReachOnBot();
  if (botBrain.planTimer > 0) botBrain.planTimer -= 1;
  const planOver = botBrain.planTimer <= 0;

  if (botBrain.plan === 'evade') {
    // step out of his swing; with a wall behind, jump over him instead
    if (isBotCornered(-toward)) {
      if (!botJump(toward) && inRange) botTryAttack(profile, brain);
    } else {
      botMove(-toward);
    }
    if (planOver) setBotPlan(Math.random() < brain.whiffPunish ? 'punish' : 'footsies', 36);
    return;
  }

  if (botBrain.plan === 'retreat') {
    if (isBotCornered(-toward)) {
      // nowhere to go: fight back, or (sometimes) leap over
      player2.velocity.x = 0;
      if (inRange) botTryAttack(profile, brain);
      else if (absDistance < 160 && Math.random() < brain.escape * 0.05) botJump(toward);
    } else {
      botMove(-toward);
    }
    if (planOver) chooseBotPlan(brain, absDistance);
    return;
  }

  if (botBrain.plan === 'punish') {
    if (inRange) {
      player2.velocity.x = 0;
      if (botTryAttack(profile, brain, { strong: true, delayFactor: 0.6 })) setBotPlan('pressure', 30);
    } else {
      botMove(toward);
    }
    if (planOver) setBotPlan('approach', 20);
    return;
  }

  if (botBrain.plan === 'jumpIn') {
    if (!botBrain.jumped) {
      if (botJump(toward)) botBrain.jumped = true;
      return;
    }
    if (player2.velocity.y !== 0) {
      botMove(toward);
      if (inRange) botTryAttack(profile, brain, { delayFactor: 0.6 });
      return;
    }
    setBotPlan('pressure', 30);
    return;
  }

  if (botBrain.plan === 'footsies') {
    // dance just outside his reach and step in to poke
    const edge = playerReach + 14;
    if (inRange && (botBrain.stepIn || !player1.isAttacking)) {
      player2.velocity.x = 0;
      if (botTryAttack(profile, brain)) botBrain.stepIn = false;
    } else if (botBrain.stepIn) {
      botMove(toward);
    } else if (absDistance < edge - 8) {
      if (isBotCornered(-toward)) botBrain.stepIn = true;
      else botMove(-toward, 0.75);
    } else if (absDistance > edge + 36) {
      botMove(toward, 0.75);
    } else {
      // small shuffles at the edge so it does not stand there like a statue
      player2.velocity.x = Math.sin(performance.now() / 260 + player2.position.x) > 0.6 ? toward * getBotMoveSpeed() * 0.4 : 0;
    }
    if (planOver) chooseBotPlan(brain, absDistance);
    return;
  }

  if (botBrain.plan === 'pressure') {
    if (inRange) {
      player2.velocity.x = 0;
      botTryAttack(profile, brain, { delayFactor: 0.6 });
    } else {
      botMove(toward);
    }
    if (planOver) chooseBotPlan(brain, absDistance);
    return;
  }

  // approach
  if (inRange) {
    player2.velocity.x = 0;
    botTryAttack(profile, brain);
  } else {
    botMove(toward);
  }
  if (planOver && absDistance < 260) chooseBotPlan(brain, absDistance);
}

// the old pattern, kept for the bosses designed around it
function updateBotMovementSimple(profile, distanceX, absDistance) {
  const attackRange = getBotAttackRange();
  const moveSpeed = getBotMoveSpeed();
  if (absDistance > attackRange) {
    player2.velocity.x = distanceX > 0 ? moveSpeed : -moveSpeed;
    return;
  }
  player2.velocity.x = 0;
  if (botAttackCooldown === 0) {
    player2.attack(player2.strongAttackCooldown === 0 && Math.random() < profile.strongAttackChance);
    botAttackCooldown = getDebugCooldown(profile.attackDelay, player2);
  }
}

function updateBotMovement(profile, distanceX, absDistance, thinking) {
  if (usesSimpleBotMovement()) {
    updateBotMovementSimple(profile, distanceX, absDistance);
    return;
  }
  const brain = getBotBrainSettings();
  const toward = distanceX > 0 ? 1 : -1;
  readPlayerForBot(brain, absDistance);
  if (thinking) {
    botBrain.kite = Math.random() < profile.spacingChance;
    if (botBrain.planTimer <= 0) chooseBotPlan(brain, absDistance);
    if (botBrain.plan === 'footsies' && Math.random() < 0.35) botBrain.stepIn = true;
  }

  // shooters keep their distance (and get out of corners instead of being pinned there)
  if (isRangedBot() && botBrain.plan !== 'punish' && botBrain.plan !== 'evade') {
    const preferredRange = getBotPreferredRange();
    const inRange = absDistance <= getBotAttackRange();
    if (botBrain.kite && absDistance < preferredRange) {
      if (!isBotCornered(-toward)) {
        botMove(-toward);
        if (inRange) botTryAttack(profile, brain);
        return;
      }
      // cornered: leap over and run to the other side, or stand and fight
      if (thinking && absDistance < 170 && Math.random() < brain.escape) {
        botJump(toward);
        return;
      }
      runBotPlan(profile, brain, toward, absDistance);
      return;
    }
    if (absDistance > preferredRange + 50) {
      botMove(toward);
      return;
    }
    // at a good distance: hold it (shuffling a little), and hit back if he comes close
    if (inRange) {
      player2.velocity.x = 0;
      botTryAttack(profile, brain);
    } else {
      player2.velocity.x = Math.sin(performance.now() / 400) > 0.5 ? -toward * getBotMoveSpeed() * 0.4 : 0;
    }
    return;
  }

  runBotPlan(profile, brain, toward, absDistance);
}

function updateBotJumping(profile, thinking) {
  if (player2.velocity.y !== 0 || !thinking) return;
  // he is up in the air above: jump to meet him
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
  // OMEGA LIGHT WARRIOR is flying his kicks (a script moves him)
  if (player2.scriptedFlight) return;
  // Omegarius stands still behind its shield or while it charges the energy shot
  if (isNeoScammer(player2) && (player2.neoCharge > 0 || player2.neoExhausted)) {
    player2.velocity.x = 0;
    return;
  }
  if (isOmegarius(player2) && (player2.omegariusParryTimer > 0 || player2.omegariusBeamCharge > 0 || player2.omegariusSecretActive || player2.omegariusExhausted)) {
    player2.velocity.x = 0;
    if (player2.omegariusParryTimer > 0) player2.attacksToTheRight = getFighterCenterX(player1) >= getFighterCenterX(player2);
    return;
  }

  if (botAttackCooldown > 0) {
    botAttackCooldown -= 1;
  }

  const profile = getBotDifficultyProfile();
  const brain = getBotBrainSettings();
  const playerCenter = player1.position.x + player1.width / 2;
  const botCenter = player2.position.x + player2.width / 2;
  const distanceX = playerCenter - botCenter;
  const absDistance = Math.abs(distanceX);
  const threat = getIncomingBotProjectileThreat(profile);
  // it thinks every few frames: that is its reaction time
  botBrain.thinkTimer -= 1;
  const thinking = botBrain.thinkTimer <= 0;
  if (thinking) botBrain.thinkTimer = brain.think + Math.floor(Math.random() * (brain.think / 2));

  if (Math.random() < profile.reactionChance) {
    updateBotSpecials(profile, absDistance, threat);
  }

  // the "classic bot" setting: the older AI, rerolling every frame
  if (classicBotAI) {
    if (dodgeBotThreatClassic(threat, profile)) {
      updateBotJumpingClassic(profile);
      return;
    }
    updateBotMovementClassic(profile, distanceX, absDistance);
    updateBotJumpingClassic(profile);
    return;
  }

  if (dodgeBotThreat(threat, profile)) return;

  updateBotMovement(profile, distanceX, absDistance, thinking);
  updateBotJumping(profile, thinking);
}

function startGame() {
  // (a clash may have faded the music out in the last fight)
  lightClashMusicFade = 1;
  jesterIntro.active = false;
  jesterOutroPlayed = false;
  chronoOutroPlayed = false;
  ch6OutroPlayed = false;
  reflecterBattleMusic.restart = true;
  jesterLosePlayed = false;
  cancelJesterImpatience();
  jesterFinal.active = false;
  omegariusFinal.active = false;
  scamFinal.active = false;
  dodgeRound.active = false;
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
  if (arcadeChapter === 'knight') {
    configureKnightArcadeLevel();
    return;
  }
  if (arcadeChapter === 'origins') {
    configureOriginsLevel();
    return;
  }
  if (arcadeChapter === 'gamblerB') {
    configureRouteB3Level();
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
  if (arcadeChapter === 'knight') {
    configureKnightArcadeEnemy();
    return;
  }
  if (arcadeChapter === 'origins') {
    configureOriginsEnemy();
    return;
  }
  if (arcadeChapter === 'gamblerB') {
    configureRouteB3Enemy();
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
  resetBotBrain();
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
  if (arcadeBossVariants.includes(secretVariant) && secretVariant !== 'scammer' && secretVariant !== 'neoScammer' && secretVariant !== 'knight' && secretVariant !== 'shaolinMaster' && !(magicTownCodeActive && magicTownVariants.includes(secretVariant)) && !arcadeBossesUnlocked) return;
  if (secretVariant === 'knight' && !isKnightUnlocked()) return;
  if (secretVariant === 'shaolinMaster' && !isShaolinUnlocked()) return;
  if (magicTownVariants.includes(secretVariant) && !magicTownCodeActive && !arcadeBossesUnlocked) return;
  if (chapterFourBossVariants.includes(secretVariant) && !arcadeBossesUnlocked) return;
  if (secretVariant === 'neoScammer' && !neoScammerCodeActive) return;

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
  // the Templo Shaolin against the bot: Shang Ting
  if (mapName === 'shaolinTemple' && botEnabled && !normalArcadeActive) {
    startShaolinChallenge();
    return;
  }
  // the Castillo de Valdoria against the bot: the Knight is waiting at the gate
  if (mapName === 'medievalCastle' && botEnabled && !normalArcadeActive) {
    startKnightChallenge();
    return;
  }
  selectedMap = mapName;
  configureNormalArcadeLevel();
  mapScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  startGame();
}

function openCharacterSelect() {
  syncMonkeyUnlockUI();
  syncKnightUnlockUI();
  syncShaolinUnlockUI();
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
  magicTownCharacterButtons.forEach((button) => {
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
  syncShopUnlocks();
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
  const playableLevels = chapter === 'gambler' ? gamblerArcadePlayableLevels : chapter === 'reflecter' ? reflecterArcadePlayableLevels : chapter === 'knight' ? knightArcadePlayableLevels : totalLevels;
  let completedLevels = Math.min(playableLevels, highestLevel - 1);
  if (chapter === 'normal' && unlockedAchievements.normalArcadeCompleted) completedLevels = totalLevels;
  if (chapter === 'fireMaster' && unlockedAchievements.fireArcadeCompleted) completedLevels = totalLevels;
  if (chapter === 'gambler' && unlockedAchievements.gamblerArcadeCompleted) completedLevels = totalLevels;
  if (chapter === 'reflecter' && unlockedAchievements.reflecterArcadeCompleted) completedLevels = totalLevels;
  // the last level never moves the saved progress forward: a finished chapter counts all of its levels
  if (isArcadeChapterDone(chapter)) completedLevels = Math.max(completedLevels, playableLevels);
  return { completedLevels, playableLevels, totalLevels };
}

function syncArcadeChapterProgress() {
  syncArcadeRouteTabs();
  ['origins', 'normal', 'fireMaster', 'gambler', 'reflecter', 'knight'].forEach((chapter) => {
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

function useHybridAbility(attacker, target, forcedIndex = null) {
  const hybrid = hybridEnemyTypes[attacker.secretVariant];
  if (!hybrid || attacker.hybridAbilityCooldown > 0 || !canFighterAct(attacker) || attacker.gamblerStunTimer > 0 || gameOver) return false;
  if (forcedIndex !== null) attacker.hybridAbilityIndex = forcedIndex;

  // Omegarius needs its hammer back before any other attack
  if (hybrid.model === 'bronze' && robotShots.some((shot) => shot.kind === 'hammer' && shot.attacker === attacker)) return false;
  const abilityList = attacker.judgeOverdrive && hybrid.overdriveAbilities ? hybrid.overdriveAbilities : hybrid.abilities;
  if (!abilityList.length) return false;
  let ability = abilityList[attacker.hybridAbilityIndex % abilityList.length];
  attacker.hybridAbilityIndex += 1;
  // T-0 only rewinds when 3 seconds ago it had noticeably more health than now
  const rewindPoint = attacker.robotHistory && attacker.robotHistory[0];
  if (ability === 'rewind' && (!rewindPoint || !(rewindPoint.health - attacker.health >= 8))) {
    ability = abilityList[attacker.hybridAbilityIndex % abilityList.length];
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
  } else if (ability === 'laserEyes') {
    // a sweeping laser from the eyes, low over the floor: jump over it
    const eyeX = direction > 0 ? attacker.position.x + attacker.width - 30 : attacker.position.x + 30;
    const beamY = ground - 58;
    const width = direction > 0 ? canvas.width - eyeX : eyeX;
    robotShots.push(new RobotShot({ kind: 'laser', x: direction > 0 ? eyeX : 0, y: beamY, direction, attacker, target, width, timer: 70 }));
    attacker.robotLaserCharge = 46;
    playSound('titanLaserCharge');
  } else if (ability === 'fistSlam') {
    const fistX = Math.max(10, Math.min(canvas.width - 40, targetCenterX - 15));
    robotShots.push(new RobotShot({ kind: 'drop', variant: 'fist', x: fistX, y: ground - 30, attacker, target, timer: 60 }));
    playSound('robotCharge');
  } else if (ability === 'missileSwarm') {
    for (let missile = 0; missile < 5; missile += 1) {
      const missileX = Math.max(10, Math.min(canvas.width - 40, targetCenterX - 15 + (missile - 2) * 90 + (Math.random() - 0.5) * 30));
      robotShots.push(new RobotShot({ kind: 'drop', variant: 'missile', x: missileX, y: ground - 30, attacker, target, timer: 44 + missile * 9 }));
    }
    playSound('titanMissile');
  } else if (ability === 'hammerThrow') {
    robotShots.push(new RobotShot({ kind: 'hammer', x: attackerCenterX - 23, y: Math.max(attacker.position.y + 40, ground - 110), direction, attacker, target, velocityX: getDebugProjectileSpeed(13, attacker) * direction }));
    attacker.attacksToTheRight = direction > 0;
    playSound('judgeThrow');
  } else if (ability === 'hammerQuake') {
    // slams the hammer: two gold shockwaves run out to both sides
    [-1, 1].forEach((side) => {
      robotShots.push(new RobotShot({ kind: 'discharge', variant: 'gold', x: attackerCenterX - 17, y: ground - 30, direction: side, attacker, target, velocityX: getDebugProjectileSpeed(10, attacker) * side }));
    });
    attacker.robotSlamFlash = 14;
    attacker.judgeSwing = 18;
    playSound('judgeQuake');
  } else if (ability === 'hammerDash') {
    attacker.robotChargeTimer = robotChargeFrames;
    attacker.robotChargeDirection = direction;
    attacker.robotChargeHit = false;
    attacker.attacksToTheRight = direction > 0;
    playSound('judgeThrow');
  } else if (ability === 'judgmentRain') {
    // three gold hammers fall around the opponent
    [-110, 0, 110].forEach((offset, index) => {
      const dropX = Math.max(10, Math.min(canvas.width - 40, targetCenterX - 15 + offset + (Math.random() - 0.5) * 30));
      robotShots.push(new RobotShot({ kind: 'drop', variant: 'hammer', x: dropX, y: ground - 30, attacker, target, timer: 50 + index * 12 }));
    });
    attacker.judgeSwing = 18;
    playSound('judgeCore');
  } else if (ability === 'coreBeam') {
    // overdrive only: a gold beam from the core, low over the floor (jump over it)
    const coreX = direction > 0 ? attacker.position.x + attacker.width - 20 : attacker.position.x + 20;
    const width = direction > 0 ? canvas.width - coreX : coreX;
    robotShots.push(new RobotShot({ kind: 'laser', variant: 'gold', x: direction > 0 ? coreX : 0, y: ground - 58, direction, attacker, target, width, timer: 64 }));
    attacker.robotLaserCharge = 40;
    playSound('titanLaserCharge');
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
  attacker.hybridAbilityCooldown = getDebugCooldown(Math.round(hybrid.cooldown * (attacker.judgeOverdrive ? 0.7 : 1)), attacker);
  return true;
}

function getArcadeChapterHero() {
  if (arcadeChapter === 'fireMaster' || arcadeChapter === 'gamblerB') return 'fireMaster';
  if (arcadeChapter === 'gambler') return 'gambler';
  if (arcadeChapter === 'reflecter') return 'reflecter';
  return 'normal';
}

function getArcadeChapterMap() {
  if (arcadeChapter === 'fireMaster') return 'fireArcade';
  if (arcadeChapter === 'gambler' || arcadeChapter === 'gamblerB') return 'gamblerArcade';
  if (arcadeChapter === 'reflecter') return 'robotFactory';
  if (arcadeChapter === 'knight') return 'enchantedForest';
  if (arcadeChapter === 'origins') return 'originsMarket';
  return 'normalArcade';
}

function getArcadeChapterLevelCount() {
  if (arcadeChapter === 'gambler') return gamblerArcadeLevelCount;
  if (arcadeChapter === 'reflecter') return reflecterArcadeLevelCount;
  if (arcadeChapter === 'knight') return knightArcadeLevelCount;
  if (arcadeChapter === 'origins') return originsLevelCount;
  if (arcadeChapter === 'gamblerB') return routeB3LevelCount;
  return 5;
}

function getArcadeProgressStorageKey() {
  if (arcadeChapter === 'fireMaster' && arcadeRouteB) return fireArcadeRouteBProgressStorageKey;
  if (arcadeChapter === 'fireMaster') return fireArcadeProgressStorageKey;
  if (arcadeChapter === 'gamblerB') return routeB3ProgressStorageKey;
  if (arcadeChapter === 'gambler') return gamblerArcadeProgressStorageKey;
  if (arcadeChapter === 'reflecter') return reflecterArcadeProgressStorageKey;
  if (arcadeChapter === 'knight') return knightArcadeProgressStorageKey;
  if (arcadeChapter === 'origins') return originsArcadeProgressStorageKey;
  return normalArcadeProgressStorageKey;
}

// '1' = unlocked, '2' = beaten
function isReflecterSecretLevelUnlocked() {
  try {
    return ['1', '2'].includes(localStorage.getItem(reflecterSecretLevelStorageKey));
  } catch (error) {
    return false;
  }
}

function isReflecterSecretLevelBeaten() {
  try {
    return localStorage.getItem(reflecterSecretLevelStorageKey) === '2';
  } catch (error) {
    return false;
  }
}

function markReflecterSecretLevelBeaten() {
  try {
    localStorage.setItem(reflecterSecretLevelStorageKey, '2');
  } catch (error) {
    // only lasts this session if storage is blocked
  }
}

function unlockReflecterSecretLevel() {
  if (isReflecterSecretLevelUnlocked()) return false;
  try {
    localStorage.setItem(reflecterSecretLevelStorageKey, '1');
  } catch (error) {
    // the unlock only lasts this session if storage is blocked
  }
  return true;
}

function showCustomToast(title, description) {
  if (!achievementToast || !achievementToastTitle || !achievementToastDescription) return;
  achievementToastTitle.innerText = title;
  achievementToastDescription.innerText = description;
  achievementToast.classList.remove('hidden');
  achievementToast.classList.add('show');
  if (achievementToastTimer) clearTimeout(achievementToastTimer);
  achievementToastTimer = setTimeout(() => {
    achievementToast.classList.remove('show');
    achievementToastTimer = setTimeout(() => achievementToast.classList.add('hidden'), 220);
  }, 3600);
}

// the three requirements of the secret level 8 of chapter 5
function getKnightSecretLevelRequirements() {
  return [
    { label: 'Nivel secreto del capitulo 4 desbloqueado', done: isReflecterSecretLevelUnlocked() },
    { label: 'Tener la Maquina Rara', done: Boolean(scammerShop.owned && scammerShop.owned.rareMachine) },
    { label: 'Knight desbloqueado (Castillo de Valdoria)', done: isKnightUnlocked() },
  ];
}

function isKnightSecretLevelBeaten() {
  try {
    return localStorage.getItem(knightSecretBeatenStorageKey) === '1';
  } catch (error) {
    return false;
  }
}

function isKnightSecretLevelUnlocked() {
  return getKnightSecretLevelRequirements().every((requirement) => requirement.done);
}

function isArcadeLevelComingSoon(level) {
  if (arcadeChapter === 'gamblerB') return level > routeB3PlayableLevels;
  if (arcadeChapter === 'knight' && level === knightSecretLevel) return isKnightSecretLevelUnlocked() && !knightSecretLevelReady;
  if (arcadeChapter === 'reflecter') return level > reflecterArcadePlayableLevels && level !== 7;
  if (arcadeChapter === 'knight') return level > knightArcadePlayableLevels;
  return arcadeChapter === 'gambler' && level > gamblerArcadePlayableLevels;
}

function configureChronoRival() {
  player2.setCharacterType('chrono');
  player2.secretVariant = 'chronoRival';
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.setMaxHealth(chronoRivalHealth);
  player2.health = player2.maxHealth;
  player2.damageMultiplier = chronoRivalDamageMultiplier;
  player2.chronoRivalRewindCooldown = 0;
  player2.chronoAuraBoost = 0;
  player2.chronoAscentDone = false;
  chronoRivalHistory = [];
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureCh6Chrono() {
  player2.setCharacterType('chrono');
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureReflecterArcadeLevel() {
  const levelData = reflecterArcadeLevels[selectedNormalArcadeLevel] || reflecterArcadeLevels[1];
  player1.setCharacterType('reflecter');
  selectedMap = 'robotFactory';
  ch6Stage = 'robots';
  if (selectedNormalArcadeLevel === 7) {
    // secret level: the hidden sector and Omegarius. Reflecter wears the armor Omegarius gives him (+50 health).
    selectedMap = 'factoryHidden';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    player1.omegariusArmor = true;
    player1.setMaxHealth(getReflecterHealth(player1) + omegariusArmorHealth);
    player1.health = player1.maxHealth;
    configureFactoryRobotEnemy('omegarius', 'hard');
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureChronoRival();
    return;
  }
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  configureReflecterArcadeEnemy();
}

function configureReflecterArcadeEnemy() {
  if (selectedNormalArcadeLevel === 7) {
    configureFactoryRobotEnemy('omegarius', 'hard');
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    configureChronoRival();
    return;
  }
  const levelData = reflecterArcadeLevels[selectedNormalArcadeLevel] || reflecterArcadeLevels[1];
  const enemyIndex = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  configureFactoryRobotEnemy(levelData.enemies[enemyIndex], levelData.difficulties[enemyIndex] || 'medium');
}

function configureFactoryRobotEnemy(robotId, difficulty) {
  const robot = hybridEnemyTypes[robotId];
  player2.setCharacterType(robot.baseType);
  player2.secretVariant = robotId;
  botDifficulty = difficulty;
  applyBotDifficulty();
  applyFactoryRobotSetup(player2, robot);
  updateHealthBars();
  updateCombatHudIdentity();
}

// a chapter 4 robot's stats and a clean state for a new fight (either player)
function applyFactoryRobotSetup(fighter, robot) {
  if (robot.color) fighter.color = robot.color;
  fighter.moveSpeed = playerMoveSpeed * (robot.moveSpeedMultiplier || 1);
  fighter.setMaxHealth(robot.health);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = robot.damageMultiplier || 1;
  if (robot.size) {
    fighter.width = robot.size.width;
    fighter.height = robot.size.height;
    fighter.position.y = Math.min(fighter.position.y, ground - fighter.height);
  }
  Object.assign(fighter, {
    hybridAbilityCooldown: 90,
    hybridAbilityIndex: 0,
    robotHistory: [],
    robotMagnetTimer: 0,
    robotRewindFlash: 0,
    robotChargeTimer: 0,
    robotSlamFlash: 0,
    robotLaserCharge: 0,
    judgeOverdrive: false,
    judgeOverdriveFlash: 0,
    judgeSwing: 0,
    omegariusThrowCooldown: 120,
    omegariusParryCooldown: 180,
    omegariusBeamCooldown: 0,
    omegariusParryTimer: 0,
    omegariusParryFlash: 0,
    omegariusBeamCharge: 0,
    omegariusMercyDone: false,
    omegariusExcitedDone: false,
    omegariusSecretUsed: false,
    omegariusSecretActive: false,
    omegariusBeamSecret: false,
    omegariusFinalUsed: false,
    omegariusExhausted: false,
  });
  getOpponent(fighter).omegariusPushTimer = 0;
  resetFactoryRobotGlitch(fighter);
}

// versus with bossrush: the chapter 4 bosses keep their arcade stats
function prepareVersusBossFighter(fighter) {
  if (isFactoryRobot(fighter)) {
    applyFactoryRobotSetup(fighter, hybridEnemyTypes[fighter.secretVariant]);
  } else if (isKnight(fighter)) {
    resetKnightState(fighter);
  } else if (isNeoScammer(fighter)) {
    // a fresh NEO SCAMMER for each versus fight
    Object.assign(fighter, { neoBigShotCooldown: 90, neoPipisCooldown: 150, neoHeadsCooldown: 220, neoCharge: 0, neoGap: 60, neoTiredDone: false, neoTired: false, neoFinalUsed: false, neoExhausted: false, neoBroken: false, neoUltimateUsed: false });
  } else if (isChronoRival(fighter)) {
    fighter.setMaxHealth(chronoRivalHealth);
    fighter.health = fighter.maxHealth;
    fighter.damageMultiplier = chronoRivalDamageMultiplier;
    fighter.chronoRivalRewindCooldown = 0;
    fighter.chronoAuraBoost = 0;
    // the drag to the roof only happens in the arcade
    fighter.chronoAscentDone = true;
  }
}

// a human playing a chapter 4 robot: slots 0/1/2 are Q/F/R (player 1) or / . Enter (player 2)
function handleFactoryRobotKey(fighter, target, slot, held) {
  if (!isFactoryRobot(fighter)) return false;
  if (isOmegarius(fighter)) {
    // 2nd + 3rd key: secret energy shot; 1st + 2nd key: final act
    if ((slot === 1 && held[2]) || (slot === 2 && held[1])) {
      startOmegariusSecret(fighter, target);
      return true;
    }
    if ((slot === 0 && held[1]) || (slot === 1 && held[0])) {
      castOmegariusFinalAct(fighter, target);
      return true;
    }
    if (slot === 0 && !(fighter.omegariusThrowCooldown > 0)) throwOmegariusHammer(fighter, target);
    if (slot === 1 && !(fighter.omegariusParryCooldown > 0) && !fighter.omegariusBeamCharge) raiseOmegariusParry(fighter);
    if (slot === 2 && !(fighter.omegariusBeamCooldown > 0)) startOmegariusBeam(fighter, target);
    return true;
  }
  const robot = hybridEnemyTypes[fighter.secretVariant];
  if (robot.abilities.length) useHybridAbility(fighter, target, slot % robot.abilities.length);
  return true;
}

function syncKnightArcadeChapterUI() {
  const levelTitles = ['Un bosque que no asusta', 'Sombras en el camino', 'Amigos muy entusiastas', 'Un baño muy merecido', 'Se busca: caballero', 'El guardian de la luz', 'La luz contra la sombra'];
  const levelDescriptions = [
    'El rey envio a Knight al Bosque Lumina, un lugar magico del que circulan rumores terribles. Dicen que es aterrador... aunque quizas no tanto.',
    'Un pueblo enorme asoma en el horizonte... pero la Orden Sombria custodia el camino: cuatro caballeros oscuros y su capitan.',
    'Robledal por fin. Light Warrior dejo una nota: sus amigos del pueblo son un poco locos, adoran las caras nuevas... y adoran pelear.',
    'Las Aguas Termales del Loto: jacuzzis, faroles y pasteles magicos. Un lugar perfecto para descansar... si no fuera por su pequeño campeon.',
    'Junto a la prision de Robledal espera el nuevo sheriff del pueblo. Y en su pared hay un cartel de SE BUSCA... con una cara conocida.',
    'El Gran Farol esta cerca. Pero alguien lo cuida noche y dia... y Knight ya no esta seguro de lo que vino a hacer.',
    'Light Warrior protege el farol. Todavia podes darte la vuelta... pero si seguis avanzando, los espiritus de Robledal van a elegir un bando.',
  ];
  // the secret level 8: a checklist of its requirements until they are all met
  const requirements = getKnightSecretLevelRequirements();
  if (requirements.every((requirement) => requirement.done)) {
    levelTitles.push('Detras del telon');
    levelDescriptions.push('Al pie del farol, Knight por fin puede descansar... pero alguien vino a cobrar una deuda. Y no viene solo.');
  } else {
    levelTitles.push('??? (nivel secreto)');
    levelDescriptions.push(`Requisitos:  ${requirements.map((requirement) => `${requirement.done ? '[X]' : '[ ]'} ${requirement.label}`).join('   ')}`);
  }
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (title) title.innerText = levelTitles[index];
    if (description) description.innerText = levelDescriptions[index];
  });
  arcadeLevelsTitle.innerText = 'Capitulo de Knight';
  arcadeStoryKicker.innerText = 'Una mision encantada';
  arcadeStoryParagraphOne.innerText =
    'Despues de su derrota en Valdoria, Knight juro hacerse mas fuerte. Su primera mision fuera del castillo lo lleva al Bosque Lumina: un lugar magico y misterioso del que todos hablan con miedo.';
  arcadeStoryParagraphTwo.innerText =
    'Dicen que nadie vuelve igual despues de entrar... pero tal vez los rumores no cuenten toda la verdad.';
}

function configureKnightArcadeLevel() {
  if (!isKnight(player1)) player1.setCharacterType('normal', 'knight');
  resetKnightState(player1);
  player1.spiritCount = 0;
  player2.spiritCount = 0;
  player2.eyeLook = undefined;
  player1.setMaxHealth(getArcadeBossVariantHealth(player1));
  player1.health = player1.maxHealth;
  player1.riftResolve = false;
  player1.damageMultiplier = 1;
  if (selectedNormalArcadeLevel === knightSecretLevel) {
    // the secret level: SHADOW JESTER at the foot of the farol, the rift still open behind him
    selectedMap = 'farolRift';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    player1.knightPossessed = false;
    player1.riftResolve = true;
    player1.damageMultiplier = riftKnightDamage;
    player2.duoActive = false;
    player2.sheriffBadge = false;
    player2.setCharacterType('gambler', 'shadowJester');
    botDifficulty = 'hard';
    applyBotDifficulty();
    player2.setMaxHealth(riftJesterHealth);
    player2.health = player2.maxHealth;
    player2.damageMultiplier = riftJesterDamage;
    // (his final act belongs to Gambler's chapter)
    player2.jesterFinalActUsed = true;
    player2.riftFinalStarted = false;
    riftClash.active = false;
    riftTerrainBroken = false;
    lightClashMusicFade = 1;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (selectedNormalArcadeLevel === 7) {
    // high above Robledal: Light Warrior, both with three spirits of the town
    selectedMap = 'lightSkyPlatform';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    player1.knightPossessed = false;
    player1.spiritCount = 3;
    player2.fleeTaunt = false;
    omegaKickFight.active = false;
    player2.scriptedFlight = false;
    lightClashMusicFade = 1;
    player1.setMaxHealth(playableKnightHealth + spiritKnightHealthBonus * 3);
    player1.health = player1.maxHealth;
    player2.duoActive = false;
    player2.sheriffBadge = false;
    player2.setCharacterType('lightWarrior');
    player2.setColor('#fdd835');
    botDifficulty = 'hard';
    applyBotDifficulty();
    player2.spiritCount = 3;
    player2.lightBoxIndex = 0;
    player2.lightBoxTimer = lightBoxFirstDelay;
    player2.setMaxHealth(lightWarriorHealth + spiritLightHealthBonus * 3);
    player2.health = player2.maxHealth;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (selectedNormalArcadeLevel === 6) {
    // the foot of the Gran Farol: its guard
    selectedMap = 'lanternHill';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    player1.knightPossessed = false;
    configureKnightArcadeEnemy();
    return;
  }
  if (selectedNormalArcadeLevel === 5) {
    // the jail of Robledal: the new sheriff
    selectedMap = 'robledalJail';
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureKnightArcadeEnemy();
    return;
  }
  if (selectedNormalArcadeLevel === 4) {
    // the hot springs: Mochi, powered up by the chef's magic cake (every tub whole again)
    selectedMap = 'hotSprings';
    hotSpringTubsBroken = [false, false, false, false];
    knightChefFuryDone = false;
    knightSpaOutroPlayed = false;
    normalArcadeEnemiesRemaining = 0;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureKnightArcadeEnemy();
    return;
  }
  if (selectedNormalArcadeLevel === 3) {
    // the village square: Celeste, then her friend Seto
    selectedMap = 'villagePlaza';
    normalArcadeEnemiesRemaining = knightArcadeLevels[3].enemies.length - 1;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureKnightArcadeEnemy();
    return;
  }
  if (selectedNormalArcadeLevel === 2) {
    // the road to Robledal: four dark knights and their captain, one after the other
    selectedMap = 'villageRoad';
    normalArcadeEnemiesRemaining = knightArcadeLevels[2].enemies.length - 1;
    normalArcadeEnemyIndex = 1;
    botEnabled = true;
    configureKnightArcadeEnemy();
    return;
  }
  selectedMap = 'enchantedForest';
  normalArcadeEnemiesRemaining = 0;
  normalArcadeEnemyIndex = 1;
  botEnabled = true;
  player2.setCharacterType('normal', 'mossBeast');
  botDifficulty = 'medium';
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  Object.assign(player2, { mossRootCooldown: 150, mossRoots: [], mossRescued: false });
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureKnightArcadeEnemy() {
  const levelData = knightArcadeLevels[selectedNormalArcadeLevel];
  if (!levelData) return;
  const enemyIndex = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  const enemy = levelData.enemies[enemyIndex];
  player2.duoActive = false;
  player2.duoPartnerActor = null;
  player2.sheriffBadge = false;
  if (enemy === 'sheriffCowboy') {
    // Cowboy himself, now with a sheriff's star and a little more health
    player2.setCharacterType('cowboy');
    player2.setColor('#c62828');
    player2.sheriffBadge = true;
    botDifficulty = levelData.difficulties[enemyIndex] || 'hard';
    applyBotDifficulty();
    player2.setMaxHealth(sheriffCowboyHealth);
    player2.health = player2.maxHealth;
    Object.assign(player2, { sheriffStandStarted: false, sheriffStandActive: false, sheriffStandOver: false, sheriffStandTimer: 0, sheriffFurious: false, sheriffJusticeChecked: false });
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  player2.setCharacterType('normal', enemy === 'robledalDuo' ? 'celesteGirl' : enemy);
  botDifficulty = levelData.difficulties[enemyIndex] || 'medium';
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  resetKnightState(player2);
  resetRobledalKid(player2);
  player2.darkDealDone = false;
  if (enemy === 'robledalDuo') setupRobledalDuo(player2);
  if (enemy === 'mochiMouse') resetMochi(player2);
  if (enemy === 'lanternGuard') resetLanternGuard(player2);
  updateHealthBars();
  updateCombatHudIdentity();
}

function syncReflecterArcadeChapterUI() {
  const levelTitles = ['Acceso restringido', 'Linea de montaje', 'Control de calidad', 'Deposito de descartes', 'Colision temporal', 'El piso cuatro', 'Sector oculto'];
  const levelDescriptions = [
    'La puerta trasera de la Planta 7 sigue custodiada. Un Dron de Chatarra: poca vida... y muchas fallas.',
    'La cinta transportadora todavia se mueve sola. Un Dron de Chatarra y un enorme Guardia Oxidado, con canon y escudo antidisturbios, bloquean el paso.',
    'Aca terminaban los robots que no pasaban las pruebas: el Prototipo T-0, una copia fallida de Chrono que puede rebobinarse 3 segundos atras, y una Unidad Sobrecargada.',
    'Tres descartes y, al fondo, la Ensambladora Defectuosa: una maquina gigante que se armo a si misma con restos de las demas. 240 de vida.',
    'Explosiones en el fondo de la fabrica... El viejo rival de Reflecter volvio, mejorado por Tempus Corp.: mas vida, mas dano, un poder para retroceder el tiempo... y ganas de llevarte hasta el techo.',
    'Chrono no se rindio. Todas las unidades de la Planta 7 despiertan a la vez... y algo enorme espera en el piso cuatro.',
    'Chrono te arrastra a una parte de la Planta 7 que ni el conocia... Alguien estuvo encerrado ahi durante años. Jefe secreto.',
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
  if (arcadeLevelSixButton) arcadeLevelSixButton.classList.toggle('hidden', arcadeChapter !== 'gambler' && arcadeChapter !== 'reflecter' && arcadeChapter !== 'knight' && arcadeChapter !== 'origins');
  const knightSecretButton = document.querySelector(`[data-arcade-level="${knightSecretLevel}"]`);
  if (knightSecretButton) {
    knightSecretButton.classList.toggle('hidden', arcadeChapter !== 'knight' && arcadeChapter !== 'origins');
    // in the special chapter the 8th level is the last normal one
    knightSecretButton.classList.toggle('arcade-level-secret', arcadeChapter !== 'origins');
  }
  // the 9th level only exists in the special chapter (its secret)
  const originsSecretButton = document.querySelector(`[data-arcade-level="${originsSecretLevel}"]`);
  if (originsSecretButton) originsSecretButton.classList.toggle('hidden', arcadeChapter !== 'origins');
  const secretLevelButton = document.querySelector('[data-arcade-level="7"]');
  if (secretLevelButton) {
    secretLevelButton.classList.toggle('hidden', !(arcadeChapter === 'knight' || arcadeChapter === 'origins' || (arcadeChapter === 'reflecter' && isReflecterSecretLevelUnlocked())));
    // in chapter 5 the 7th level is a normal one, not a secret
    secretLevelButton.classList.toggle('arcade-level-secret', arcadeChapter !== 'knight' && arcadeChapter !== 'origins');
  }
  if (arcadeChapter === 'knight') {
    syncKnightArcadeChapterUI();
    return;
  }
  if (arcadeChapter === 'origins') {
    syncOriginsChapterUI();
    return;
  }
  if (arcadeChapter === 'gamblerB') {
    syncRouteB3ChapterUI();
    return;
  }
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

function openArcadeChapter(chapter = 'normal', routeB = false) {
  arcadeChapter = chapter;
  arcadeRouteB = routeB;
  arcadeChaptersScreen.classList.add('hidden');
  arcadeLevelsScreen.classList.remove('hidden');
  syncArcadeChapterUI();
  if (arcadeRouteB) syncRouteBChapterUI();
  syncNormalArcadeLevels();
  syncHardcorePanel();
  // (route B has no hardcore)
  const hardcorePanel = document.getElementById('hardcorePanel');
  if (hardcorePanel) hardcorePanel.classList.toggle('hidden', arcadeRouteB);
  document.body.classList.toggle('arcade-route-b', arcadeRouteB);
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
    // the secret level 7 of chapter 4 has its own unlock (a clean run of level 6), not the normal progress
    const originsSecret = arcadeChapter === 'origins' && level === originsSecretLevel;
    const secretLevel = (arcadeChapter === 'reflecter' && level === 7) || (arcadeChapter === 'knight' && level === knightSecretLevel) || originsSecret;
    const knightSecret = arcadeChapter === 'knight' && level === knightSecretLevel;
    const unlocked = knightSecret
      ? isKnightSecretLevelUnlocked() && knightSecretLevelReady
      : originsSecret
        ? isOriginsSecretUnlocked()
        : secretLevel
        ? isReflecterSecretLevelUnlocked()
        : level <= highestLevel && !comingSoon;
    const finalLevelDone = level === getChapterFinalLevel(arcadeChapter) && isArcadeChapterDone(arcadeChapter);
    const completed = knightSecret ? isKnightSecretLevelBeaten() : originsSecret ? isOriginsSecretBeaten() : secretLevel ? isReflecterSecretLevelBeaten() : !comingSoon && (level < highestLevel || finalLevelDone);
    levelButton.disabled = !unlocked;
    levelButton.classList.toggle('locked', !unlocked);
    levelButton.classList.toggle('coming-soon', comingSoon);
    levelButton.classList.toggle('completed', completed);
    const status = levelButton.querySelector('.arcade-level-status');
    if (status) {
      status.textContent = comingSoon ? 'PROXIMAMENTE' : unlocked ? (completed ? 'SUPERADO' : secretLevel ? 'SECRETO' : 'DISPONIBLE') : 'BLOQUEADO';
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
      isFactoryRobot(player2) ||
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
  if (isFactoryRobot(fighter)) return hybridEnemyTypes[fighter.secretVariant].health;
  if (isChronoRival(fighter)) return chronoRivalHealth;
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
assemblerCharacterButton.addEventListener('click', () => selectCharacter('normal', 'defectiveAssembler'));
chronoBoostCharacterButton.addEventListener('click', () => selectCharacter('chrono', 'chronoRival'));
titanCharacterButton.addEventListener('click', () => selectCharacter('normal', 'titanUnit'));
omegariusCharacterButton.addEventListener('click', () => selectCharacter('normal', 'omegarius'));
neoScammerCharacterButton.addEventListener('click', () => selectCharacter('gambler', 'neoScammer'));
knightCharacterButton.addEventListener('click', () => selectCharacter('normal', 'knight'));
magicTownCharacterButtons.forEach((button) => {
  button.addEventListener('click', () => selectCharacter('normal', button.dataset.magicVariant));
});
if (shaolinCharacterButton) shaolinCharacterButton.addEventListener('click', () => selectCharacter('normal', 'shaolinMaster'));
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
// chapter 5 is still under construction
knightArcadeChapterButton.addEventListener('click', () => openArcadeChapter('knight'));
if (originsChapterButton) originsChapterButton.addEventListener('click', () => openArcadeChapter('origins'));
normalArcadeLevelButtons.forEach((levelButton) => {
  levelButton.addEventListener('click', () => {
    if (levelButton.disabled) return;
    // a single level from the menu is never part of a hardcore run
    endHardcoreRun();
    startArcadeLevel(Number(levelButton.dataset.arcadeLevel));
  });
});

function startArcadeLevel(level) {
    const levelButton = document.querySelector(`[data-arcade-level="${level}"]`);
    selectedNormalArcadeLevel = level;
    normalArcadeActive = true;
    if (isArcadeLevelComingSoon(selectedNormalArcadeLevel)) return;
    player1.setCharacterType(getArcadeChapterHero());
    if (arcadeChapter === 'knight') player1.setCharacterType('normal', 'knight');
    if (arcadeChapter === 'origins') makeYoungScammer(player1);
    player1.frostFire = false;
    if (arcadeChapter === 'gamblerB') makeFrostFireMaster(player1);
    player2.setCharacterType('normal');
    selectedMap = getArcadeChapterMap();
    normalArcadeLevelButtons.forEach((button) => button.classList.remove('selected'));
    levelButton.classList.add('selected');
    // a fresh attempt at the secret-level requirement starts every time level 6 is entered from this menu
    if (arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 6) ch6RunClean = true;
    startGame();
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 5) startGamblerScammerCutscene();
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 6) startJesterIntro();
    if (arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 5) startChronoRivalCutscene();
    if (arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 6) startCh6IntroCutscene();
    if (arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 7) startCh7IntroCutscene();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 1) startKnightForestIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 2) startKnightVillageIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 3) startKnightPlazaIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 4) startKnightSpaIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 5) startKnightJailIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 6) startKnightGuardIntro();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === 7) startKnightApproach();
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === knightSecretLevel) startKnightRiftIntro();
    if (arcadeChapter === 'origins') startOriginsIntro();
    if (arcadeChapter === 'gamblerB') startRouteB3Intro();
}
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
if (classicBotToggle) {
  classicBotToggle.checked = classicBotAI;
  classicBotToggle.addEventListener('change', () => {
    classicBotAI = classicBotToggle.checked;
    try {
      localStorage.setItem(classicBotStorageKey, classicBotAI ? '1' : '0');
    } catch (error) {
      // the setting still works for this session
    }
    resetBotBrain();
  });
}
restartButton.addEventListener('click', () => (hardcoreRun.pending ? continueHardcore() : resetFight()));
menuButton.addEventListener('click', () => {
  endHardcoreRun();
  returnToMenu();
});
document.querySelectorAll('[data-hardcore]').forEach((button) => {
  button.addEventListener('click', () => startHardcoreRun(button.dataset.hardcore));
});

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

syncKnightUnlockUI();

// ---------- the classic bot (the AI from before the bot's brain) ----------
function dodgeBotThreatClassic(threat, profile) {
  if (!threat || Math.random() > profile.dodgeChance) return false;

  const botCenterX = player2.position.x + player2.width / 2;
  const dodgeDirection = threat.centerX < botCenterX ? 1 : -1;
  player2.velocity.x = getBotMoveSpeed() * dodgeDirection;

  if (player2.velocity.y === 0 && (threat.type === 'projectile' || Math.random() < 0.55)) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }

  return true;
}

function updateBotMovementClassic(profile, distanceX, absDistance) {
  const attackRange = getBotAttackRange();
  const preferredRange = getBotPreferredRange();
  const moveSpeed = getBotMoveSpeed();
  const canPlaySpacing = Math.random() < profile.spacingChance;

  if (isRangedBot() && absDistance < preferredRange && canPlaySpacing) {
    player2.velocity.x = distanceX > 0 ? -moveSpeed : moveSpeed;
    return;
  }

  // Omegarius always closes in until it can hit (other bots wait a little outside their range)
  const approachSlack = usesSimpleBotMovement() ? 0 : 24;
  if (absDistance > Math.max(attackRange, preferredRange) || absDistance > attackRange + approachSlack) {
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

function updateBotJumpingClassic(profile) {
  if (player2.velocity.y !== 0) return;

  const playerAbove = player1.position.y + player1.height < player2.position.y;
  if (playerAbove && Math.random() < profile.reactionChance) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }
}

// Shang Ting: the stance against a swing, a hundred fists up close, the palm from afar, the crane kick in between
function updateShaolinBotSpecials(profile, absDistance) {
  const master = player2;
  if (!master.shaolinPalms) resetShaolin(master);
  if (isShaolinBusy(master)) return true;
  // every move that makes sense right now, then one of them at random (so he mixes all four)
  const options = [];
  if (player1.isAttacking && absDistance < 170 && !(master.shaolinStanceCooldown > 0)) options.push(() => castShaolinStance(master));
  if (absDistance < 170 && !(master.shaolinFistsCooldown > 0)) options.push(() => castShaolinFists(master), () => castShaolinFists(master));
  if (absDistance > 180 && !(master.shaolinPalmCooldown > 0)) options.push(() => castShaolinPalm(master));
  if (absDistance > 110 && absDistance < 420 && !(master.shaolinCraneCooldown > 0) && master.velocity.y === 0) options.push(() => castShaolinCrane(master, player1), () => castShaolinCrane(master, player1));
  if (!options.length || !shouldBotUseSpecial(profile, 0.08)) return false;
  return options[Math.floor(Math.random() * options.length)]();
}

// ---------- HARDCORE mode ----------
// the last level of each chapter, without its secret level
function getChapterFinalLevel(chapter) {
  if (chapter === 'gambler') return gamblerArcadePlayableLevels;
  if (chapter === 'reflecter') return reflecterArcadePlayableLevels;
  if (chapter === 'knight') return knightArcadePlayableLevels;
  if (chapter === 'origins') return originsLevelCount;
  if (chapter === 'gamblerB') return routeB3PlayableLevels;
  return 5;
}

function isArcadeChapterDone(chapter) {
  const chapterAchievements = { normal: 'normalArcadeCompleted', fireMaster: 'fireArcadeCompleted', gambler: 'gamblerArcadeCompleted', reflecter: 'reflecterArcadeCompleted', origins: 'originsCompleted' };
  if (chapterAchievements[chapter] && unlockedAchievements[chapterAchievements[chapter]]) return true;
  try {
    if (localStorage.getItem(`moqueteChapterDone_${chapter}`) === '1') return true;
  } catch (error) {
    // fall back to the rewards
  }
  return Boolean(coinWallet.arcadeLevels && coinWallet.arcadeLevels[`${chapter}-${getChapterFinalLevel(chapter)}`]);
}

function markArcadeChapterDone(chapter) {
  try {
    localStorage.setItem(`moqueteChapterDone_${chapter}`, '1');
  } catch (error) {
    // the reward record still counts
  }
}

function loadHardcoreRecords() {
  try {
    return JSON.parse(localStorage.getItem(hardcoreStorageKey) || '{}') || {};
  } catch (error) {
    return {};
  }
}

function syncHardcorePanel() {
  const panel = document.getElementById('hardcorePanel');
  if (!panel) return;
  const unlocked = isArcadeChapterDone(arcadeChapter);
  const records = loadHardcoreRecords()[arcadeChapter] || {};
  panel.classList.toggle('locked', !unlocked);
  document.getElementById('hardcoreStatus').innerText = unlocked
    ? `${getChapterFinalLevel(arcadeChapter)} niveles seguidos, sin volver al menu. Se pierde todo al quedarse sin vidas.`
    : 'Termina el capitulo para desbloquearlo (los niveles secretos no cuentan).';
  panel.querySelectorAll('[data-hardcore]').forEach((button) => {
    button.disabled = !unlocked;
    const best = button.querySelector('[data-hardcore-best]');
    const done = Boolean(records[button.dataset.hardcore]);
    button.classList.toggle('completed', done);
    if (best) best.innerText = done ? 'SUPERADO' : unlocked ? `Premio: ${hardcoreRewards[button.dataset.hardcore].toLocaleString('es-ES')} monedas` : 'BLOQUEADO';
  });
}

function startHardcoreRun(mode) {
  if (!isArcadeChapterDone(arcadeChapter)) return;
  Object.assign(hardcoreRun, { active: true, mode, chapter: arcadeChapter, lives: mode === 'harder' ? 1 : 3, carry: null, pending: null });
  playSound('judgeFinalStart');
  startArcadeLevel(1);
}

function endHardcoreRun() {
  Object.assign(hardcoreRun, { active: false, pending: null, carry: null });
  if (restartButton) restartButton.innerText = 'Reiniciar pelea';
}

// called at the end of every fight of a run
function hardcoreAfterFight(won) {
  const run = hardcoreRun;
  // (a fight only counts once)
  if (run.pending) return;
  const finalLevel = getChapterFinalLevel(run.chapter);
  if (won) {
    if (selectedNormalArcadeLevel >= finalLevel) {
      run.pending = 'done';
      const records = loadHardcoreRecords();
      const chapterRecords = records[run.chapter] || {};
      const firstTime = !chapterRecords[run.mode];
      chapterRecords[run.mode] = true;
      records[run.chapter] = chapterRecords;
      try {
        localStorage.setItem(hardcoreStorageKey, JSON.stringify(records));
      } catch (error) {
        // only this session
      }
      if (firstTime) awardCoins(hardcoreRewards[run.mode]);
      victoryTitle.innerText = run.mode === 'harder' ? 'HARDERCORE SUPERADO!' : 'HARDCORE SUPERADO!';
      restartButton.innerText = 'Volver al menu';
      showCustomToast(run.mode === 'harder' ? 'HARDERCORE SUPERADO' : 'HARDCORE SUPERADO', firstTime ? `Capitulo completo sin caer. +${hardcoreRewards[run.mode].toLocaleString('es-ES')} monedas.` : 'Lo hiciste otra vez. Leyenda.');
      playSound('achievement');
      return;
    }
    if (run.mode === 'harder') run.carry = player1.health;
    run.pending = 'next';
    restartButton.innerText = `Siguiente nivel (${selectedNormalArcadeLevel + 1}/${finalLevel})`;
    return;
  }
  run.lives -= 1;
  if (run.lives > 0) {
    run.pending = 'retry';
    restartButton.innerText = `Reintentar nivel (${run.lives} ${run.lives === 1 ? 'vida' : 'vidas'})`;
    return;
  }
  run.pending = 'over';
  victoryTitle.innerText = run.mode === 'harder' ? 'HARDERCORE PERDIDO' : 'HARDCORE PERDIDO';
  restartButton.innerText = 'Volver al menu';
}

function continueHardcore() {
  const run = hardcoreRun;
  const pending = run.pending;
  run.pending = null;
  restartButton.innerText = 'Reiniciar pelea';
  if (pending === 'done' || pending === 'over') {
    endHardcoreRun();
    returnToMenu();
    return;
  }
  const level = pending === 'next' ? selectedNormalArcadeLevel + 1 : selectedNormalArcadeLevel;
  const keep = { ...run };
  returnToMenu();
  Object.assign(hardcoreRun, keep, { active: true, pending: null });
  arcadeChapter = keep.chapter;
  startArcadeLevel(level);
}
