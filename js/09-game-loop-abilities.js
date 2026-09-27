// Moquete - Bucle principal, HUD, habilidades y Shadow Jester
// (parte 9 de 10; los archivos se cargan en orden desde index.html)

function animate() {
  animationId = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (arcadeCutscene.active) {
    updateAndDrawArcadeCutscene();
    return;
  }
  if (jesterIntro.active) {
    updateJesterIntro();
    return;
  }
  if (jesterFinal.active) {
    updateJesterFinalAct();
    return;
  }
  drawStage();

  if (!gameStarted) {
    player1.draw();
    player2.draw();
    return;
  }

  updateMovements();
  updateBot();
  applyTerrainMoveModifiers();
  player1.update();
  player2.update();
  updateTerrainInteractions();
  updateDesertCowboyDuel();
  updateTankClash();
  updateArcaneRift();
  updateMirrorCollapse();
  updateCasinoRoyale();
  updateManaMeltdown();
  updatePrismOverdrive();
  updateAbsoluteAdaptation();
  updateFireballs();
  updateFireBeams();
  updateLightShots();
  updateSuperFireKamehamehaCharges();
  updateSuperFireKamehamehas();
  updateLightWarriorOmegaTransformation();
  drawLightWarriorOmegaTransformation();
  updateTankShells();
  updateArcadeBossShockwaves();
  updateCowboyBullets();
  updateSorcererOrbs();
  updateSorcererGravityOrbs();
  updateSorcererSecretOrbs();
  updateChronoBlades();
  updateChronoZones();
  updateIcedThugFrostFields();
  updateIcedThugBlades();
  updateMonkeyPeels();
  updateMonkeyBananas();
  updateMonkeyCoconuts();
  updateScamOffers();
  updateScamItems();
  updateScamSlotMachines();
  updateJesterEffects();
  updateFactoryRobots();
  updateDivineWorldCutCharges();
  updateDivineWorldCuts();

  if (
    player1.isAttacking &&
    player1.kaiokenComboVisualTimer <= 0 &&
    rectangularCopycatShieldCollision(player2, player1.attackArea)
  ) {
    if (handleCopycatShieldHit(player2, player1)) {
      player1.isAttacking = false;
      player1.lightWarriorRadiantPunchAttackActive = false;
      return;
    }
  }

  if (
    player1.isAttacking &&
    player1.kaiokenComboVisualTimer <= 0 &&
    rectangularCollision({ rectangle1: player1.attackArea, rectangle2: player2 })
  ) {
    if (handleCopycatShieldHit(player2, player1)) {
      player1.isAttacking = false;
      player1.lightWarriorRadiantPunchAttackActive = false;
      return;
    }

    applyDamage(player1, player2, player1.currentAttackDamage, {
      isSpecial: player1.lightWarriorRadiantPunchAttackActive,
      damageType: player1.lightWarriorRadiantPunchAttackActive ? 'radiantPunch' : 'melee',
    });
    player2.velocity.x = getDebugKnockback(8, player2);
    player2.velocity.y = getDebugKnockback(-8, player2);
    player1.isAttacking = false;
    player1.lightWarriorRadiantPunchAttackActive = false;
  }

  if (
    player1.characterType === 'lightWarrior' &&
    player1.lightWarriorOmegaFlightTraveling &&
    player1.target === player2 &&
    tryParryLightWarriorOmegaFlight(player1, player2)
  ) {
    finishLightWarriorOmegaFlight(player1, player2, true);
    return;
  }

  if (
    player2.characterType === 'lightWarrior' &&
    player2.lightWarriorOmegaFlightTraveling &&
    player2.target === player1 &&
    tryParryLightWarriorOmegaFlight(player2, player1)
  ) {
    finishLightWarriorOmegaFlight(player2, player1, true);
    return;
  }

  if (
    player2.isAttacking &&
    player2.kaiokenComboVisualTimer <= 0 &&
    rectangularCopycatShieldCollision(player1, player2.attackArea)
  ) {
    if (handleCopycatShieldHit(player1, player2)) {
      player2.isAttacking = false;
      player2.lightWarriorRadiantPunchAttackActive = false;
      return;
    }
  }

  if (
    player2.isAttacking &&
    player2.kaiokenComboVisualTimer <= 0 &&
    rectangularCollision({ rectangle1: player2.attackArea, rectangle2: player1 })
  ) {
    if (handleCopycatShieldHit(player1, player2)) {
      player2.isAttacking = false;
      player2.lightWarriorRadiantPunchAttackActive = false;
      return;
    }

    applyDamage(player2, player1, player2.currentAttackDamage, {
      isSpecial: player2.lightWarriorRadiantPunchAttackActive,
      damageType: player2.lightWarriorRadiantPunchAttackActive ? 'radiantPunch' : 'melee',
    });
    player1.velocity.x = getDebugKnockback(-8, player1);
    player1.velocity.y = getDebugKnockback(-8, player1);
    player2.isAttacking = false;
    player2.lightWarriorRadiantPunchAttackActive = false;
  }

  drawDarkRoomLightingOverlay();
  drawChronoTimeStopEffect();
  updateHealthBars();
  drawDesertCowboyDuelAlert();
  drawTankClashAlert();
  drawArcaneRiftAlert();
  drawMirrorCollapseAlert();
  drawCasinoRoyaleAlert();
  drawManaMeltdownAlert();
  drawPrismOverdriveAlert();
  drawAbsoluteAdaptationAlert();
  drawJesterWhiteFade();
  if (jesterNeedsFinalAct(player2) && player2.health <= 0) player2.health = 1;

  if (player1.health <= 0 || player2.health <= 0) {
    cancelAnimationFrame(animationId);
    animationId = null;
    finishFight();
    return;
  }
}

function updateHealthBars() {
  const health1Value = Math.ceil(Math.max(0, player1.health));
  const health2Value = Math.ceil(Math.max(0, player2.health));
  const health1Progress = Math.min(100, (health1Value / player1.maxHealth) * 100);
  const health2Progress = Math.min(100, (health2Value / player2.maxHealth) * 100);
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');

  bar1.style.setProperty('--progress', `${health1Progress}%`);
  bar2.style.setProperty('--progress', `${health2Progress}%`);
  document.getElementById('health1').innerText = health1Value;
  document.getElementById('health2').innerText = health2Value;
  updateCombatHudIdentity();
  updateCooldownIndicators();
}

function getCharacterDisplayName(fighter) {
  if (fighter.characterType === 'lightWarrior' && fighter.lightWarriorOmegaTransformed) return 'OMEGA LIGHT WARRIOR!!';
  const baseName = characterDisplayNames[fighter.characterType] || 'Normal';
  if (isHybridEnemy(fighter)) return hybridEnemyTypes[fighter.secretVariant].name;
  if (isScammer(fighter)) return fighter.scammerRage ? 'Scammer Furioso' : 'Scammer';
  if (isShadowJester(fighter)) return 'Shadow Jester';
  if (fighter.secretVariant === 'arcadeBoss') return normalArcadeBossName;
  if (fighter.secretVariant === 'icedThug') return fireArcadeMiniBossName;
  if (isIceMaster(fighter)) return fireArcadeBossName;
  if (fighter.characterType === 'normal' && isNormalKaioken(fighter) && fighter.kaiokenTimer > 0) return 'Kaioken';
  if (fighter.characterType === 'fireMaster' && isSuperFireMaster(fighter)) return 'Super Fire Master';
  if (fighter.characterType === 'fireMaster' && isFireMasterOverheat(fighter)) return 'Fire Master+';
  if (fighter.characterType === 'tank' && isTankIronWall(fighter)) return 'Iron Tank';
  if (fighter.characterType === 'reflecter' && isReflecterUpgrade(fighter)) return 'Reflecter EX';
  if (fighter.characterType === 'reflecter' && isReflecterMirrorLuck(fighter)) return 'Mirror Luck';
  if (fighter.characterType === 'switcher' && isSwitcherPrism(fighter)) return 'Prism Switcher';
  if (fighter.characterType === 'cowboy' && isCowboyDeadeye(fighter)) return 'Deadeye Cowboy';
  if (fighter.characterType === 'divineGeneral' && isDivineFullAdapt(fighter)) return 'Full Adapt';
  return baseName;
}

function updateCombatHudIdentity() {
  p1Portrait.dataset.character = player1.characterType;
  p2Portrait.dataset.character = player2.characterType;
  p1Portrait.dataset.variant = player1.secretVariant || '';
  p2Portrait.dataset.variant = player2.secretVariant || '';
  p1CharacterName.innerText = getCharacterDisplayName(player1);
  let p2Name = getCharacterDisplayName(player2);
  if (normalArcadeActive && (arcadeChapter === 'gambler' || arcadeChapter === 'reflecter')) {
    p2Name = getCharacterDisplayName(player2);
  } else if (normalArcadeActive && selectedNormalArcadeLevel === 5) {
    p2Name = arcadeChapter === 'fireMaster' ? fireArcadeBossName : normalArcadeBossName;
  } else if (normalArcadeActive && isFireArcadeMiniBoss()) {
    p2Name = fireArcadeMiniBossName;
  } else if (normalArcadeActive && arcadeChapter === 'fireMaster' && selectedNormalArcadeLevel >= 1 && selectedNormalArcadeLevel <= 3) {
    p2Name = fireArcadeBruteName;
  } else if (normalArcadeActive && selectedNormalArcadeLevel >= 1 && selectedNormalArcadeLevel <= 4) {
    p2Name = normalArcadeEnemyName;
  }
  p2CharacterName.innerText = p2Name;
  p1HudTag.innerText = 'P1';
  p2HudTag.innerText = botEnabled ? `Bot ${botDifficultyDisplayNames[botDifficulty] || 'media'}` : 'P2';
}

function updateCooldownIndicators() {
  updatePlayerCooldownIndicators(player1, {
    q: document.getElementById('p1CooldownQ'),
    f: document.getElementById('p1CooldownF'),
    r: document.getElementById('p1CooldownR'),
  });
  updatePlayerCooldownIndicators(player2, {
    q: document.getElementById('p2CooldownQ'),
    f: document.getElementById('p2CooldownF'),
    r: document.getElementById('p2CooldownR'),
  });
}

function updatePlayerCooldownIndicators(player, elements) {
  const cooldowns = getPlayerAbilityCooldowns(player);
  updateCooldownChip(elements.q, cooldowns.q);
  updateCooldownChip(elements.f, cooldowns.f);
  updateCooldownChip(elements.r, cooldowns.r || { active: false });
}

function updateCooldownChip(element, cooldown) {
  if (!element) return;
  const inactiveCooldown = { active: false };
  const currentCooldown = cooldown || inactiveCooldown;

  element.classList.toggle('disabled', !currentCooldown.active);
  if (!currentCooldown.active) {
    element.classList.remove('cooling');
    element.style.setProperty('--ready', '0%');
    element.title = 'Sin habilidad';
    return;
  }

  const readyPercent =
    currentCooldown.max <= 0 ? 100 : Math.max(0, Math.min(100, ((currentCooldown.max - currentCooldown.remaining) / currentCooldown.max) * 100));
  const isCooling = currentCooldown.remaining > 0;

  element.classList.toggle('cooling', isCooling);
  element.style.setProperty('--ready', `${readyPercent}%`);
  element.title = isCooling ? `${currentCooldown.name}: recargando` : `${currentCooldown.name}: listo`;
}

function getPlayerAbilityCooldowns(player) {
  if (isShadowJester(player)) {
    return {
      q: { active: true, name: 'Cartas de poker', remaining: player.jesterSuitCooldown, max: getDebugCooldown(jesterSuitCooldown, player) },
      f: { active: true, name: 'Caos, caos', remaining: player.jesterChaosCooldown, max: getDebugCooldown(jesterChaosCooldown, player) },
      r: { active: true, name: 'Guadana del bufon', remaining: player.jesterScytheCooldown, max: getDebugCooldown(jesterScytheCooldown, player) },
    };
  }
  if (isScammer(player)) {
    return {
      q: { active: true, name: 'Oferta irresistible', remaining: player.scammerOfferCooldown, max: getScammerCooldown(scammerOfferCooldown, player) },
      f: { active: true, name: 'Mercancia trucha', remaining: player.scammerItemCooldown, max: getScammerCooldown(scammerItemCooldown, player) },
      r: { active: true, name: 'Tragamonedas del cielo', remaining: player.scammerSlotCooldown, max: getScammerCooldown(scammerSlotCooldown, player) },
    };
  }
  if (player.secretVariant === 'arcadeBoss') {
    return {
      q: { active: true, name: 'Onda de choque', remaining: player.arcadeBossShockwaveCooldown, max: getDebugCooldown(normalArcadeBossShockwaveCooldown, player) },
      f: { active: false },
    };
  }
  if (isIcedThug(player)) {
    return {
      q: { active: true, name: 'Campo gelido', remaining: player.icedThugFrostFieldCooldown, max: getDebugCooldown(icedThugFrostFieldCooldown, player) },
      f: { active: true, name: 'Cuchilla de hielo', remaining: player.icedThugBladeCooldown, max: getDebugCooldown(icedThugBladeCooldown, player) },
    };
  }
  switch (player.characterType) {
    case 'monkey':
      return {
        q: { active: true, name: 'Pistola banana', remaining: player.monkeyBananaCooldown, max: getDebugCooldown(monkeyBananaCooldown, player) },
        f: { active: true, name: 'Cascara de banana', remaining: player.monkeyPeelCooldown, max: getDebugCooldown(monkeyPeelCooldown, player) },
        r: { active: true, name: 'Lluvia de cocos', remaining: player.monkeyCoconutCooldown, max: getDebugCooldown(monkeyCoconutCooldown, player) },
      };
    case 'normal':
      return {
        q:
          isNormalKaioken(player) && player.kaiokenTimer > 0
            ? { active: true, name: 'Combo Kaioken', remaining: player.kaiokenComboCooldown, max: getDebugCooldown(kaiokenComboCooldown, player) }
            : { active: false },
        f: isNormalKaioken(player)
          ? { active: true, name: 'Kaioken', remaining: player.kaiokenCooldown, max: getDebugCooldown(kaiokenCooldown, player) }
          : { active: false },
      };
    case 'fireMaster':
      return {
        q: {
          active: true,
          name: isIceMaster(player) ? 'Bola de hielo' : 'Bola de fuego',
          remaining: player.specialCooldown,
          max: Math.max(
            getDebugCooldown(getFireMasterSecretCooldown(player, fireballCooldown), player),
            isSuperFireMaster(player) ? getDebugCooldown(superFireKamehamehaChargeDuration + superFireKamehamehaDuration, player) : 0
          ),
        },
        f: {
          active: true,
          name: isIceMaster(player) ? 'Rayo helado' : 'Fire beam',
          remaining: player.fireBeamCooldown,
          max: Math.max(
            getDebugCooldown(getFireMasterSecretCooldown(player, fireBeamCooldown), player),
            isSuperFireMaster(player) ? getDebugCooldown(superFireKamehamehaChargeDuration + superFireKamehamehaDuration, player) : 0
          ),
        },
      };
    case 'lightWarrior':
      return {
        q: {
          active: true,
          name: 'Rafaga de luz',
          remaining: Math.max(player.lightWarriorBurstCooldown, player.lightWarriorBurstShotsRemaining > 0 ? getDebugCooldown(lightWarriorBurstCooldown, player) : 0),
          max: getDebugCooldown(lightWarriorBurstCooldown, player),
        },
        f: {
          active: true,
          name: 'Velocidad luminosa',
          remaining: Math.max(player.lightWarriorSpeedCooldown, player.lightWarriorSpeedTimer, player.lightWarriorRadiantPunchCooldown),
          max: Math.max(
            getDebugDuration(lightWarriorSpeedDuration, player) + getDebugCooldown(lightWarriorSpeedCooldown, player),
            getDebugCooldown(lightWarriorRadiantPunchCooldown, player)
          ),
        },
        r: {
          active: true,
          name: 'Destello solar',
          remaining: Math.max(player.lightWarriorSolarFlashCooldown, player.lightWarriorSolarFlashTimer, player.lightWarriorRadiantPunchCooldown),
          max: Math.max(
            getDebugCooldown(lightWarriorSolarFlashCooldown, player),
            getDebugDuration(lightWarriorSolarFlashVisualDuration, player),
            getDebugCooldown(lightWarriorRadiantPunchCooldown, player)
          ),
        },
      };
    case 'tank':
      return {
        q: { active: true, name: 'Canon', remaining: player.tankShellCooldown, max: getDebugCooldown(tankShellCooldown, player) },
        f: { active: false },
      };
    case 'cowboy':
      return {
        q: {
          active: true,
          name: 'Rafaga',
          remaining: Math.max(player.cowboyBurstCooldown, player.cowboyBurstShotsRemaining > 0 ? getDebugCooldown(cowboyBurstCooldown, player) : 0),
          max: getDebugCooldown(cowboyBurstCooldown, player),
        },
        f: { active: false },
      };
    case 'reflecter':
      return {
        q: {
          active: true,
          name: isReflecterUpgrade(player) ? 'Escudo avanzado' : 'Escudo reflector',
          remaining: player.copycatShieldCooldown,
          max: getDebugCooldown(getReflecterShieldCooldown(player), player),
        },
        f: { active: false },
      };
    case 'switcher':
      return {
        q: { active: true, name: 'Cambiar modo', remaining: player.switcherModeCooldown, max: getDebugCooldown(switcherModeCooldown, player) },
        f: { active: true, name: 'Habilidad de modo', remaining: player.switcherAbilityCooldown, max: getSwitcherAbilityCooldownMax(player) },
      };
    case 'sorcerer':
      return {
        q: {
          active: true,
          name: 'Esfera roja',
          remaining: Math.max(player.sorcererOrbCooldown, player.sorcererSecretOrbCooldown),
          max: Math.max(getDebugCooldown(sorcererOrbCooldown, player), getDebugCooldown(sorcererSecretOrbCooldown, player)),
        },
        f: {
          active: true,
          name: 'Esfera gravitatoria',
          remaining: Math.max(player.sorcererGravityCooldown, player.sorcererSecretOrbCooldown),
          max: Math.max(getDebugCooldown(sorcererGravityCooldown, player), getDebugCooldown(sorcererSecretOrbCooldown, player)),
        },
      };
    case 'gambler':
      return {
        q: { active: true, name: 'Ruleta', remaining: player.gamblerRollCooldown, max: getDebugCooldown(gamblerRollCooldown, player) },
        f: { active: true, name: 'Luck Incrementer', remaining: player.gamblerLuckCooldown, max: getDebugCooldown(gamblerLuckCooldown, player) },
      };
    case 'chrono':
      return {
        q: { active: true, name: 'Cuchilla temporal', remaining: player.chronoBladeCooldown, max: getDebugCooldown(chronoBladeCooldown, player) },
        f: { active: true, name: 'Campo lento', remaining: player.chronoSlowCooldown, max: getDebugCooldown(chronoSlowCooldown, player) },
      };
    case 'ghost':
      return {
        q: {
          active: true,
          name: 'Fase',
          remaining: Math.max(player.ghostPhaseCooldown, player.ghostPhaseTimer),
          max: getDebugDuration(ghostPhaseDuration, player) + getDebugCooldown(ghostPhaseCooldown, player),
        },
        f: { active: false },
      };
    case 'divineGeneral':
      return {
        q: {
          active: true,
          name: 'Adaptacion',
          remaining: Math.max(player.divineAdaptCooldown, player.divineAdaptTimer, player.divineWorldCutCooldown),
          max: Math.max(
            getDebugDuration(divineGeneralAdaptDuration, player) + getDivineAdaptCooldownMax(player),
            getDebugCooldown(divineWorldCutCooldown, player)
          ),
        },
        f: {
          active: true,
          name: 'Contra adaptativa',
          remaining: Math.max(player.divineCounterCooldown, player.divineWorldCutCooldown),
          max: Math.max(getDivineCounterCooldownMax(player), getDebugCooldown(divineWorldCutCooldown, player)),
        },
      };
    default:
      return {
        q: { active: false },
        f: { active: false },
      };
  }
}

function isTimeStoppedByChrono(fighter) {
  return fighter && fighter.chronoTimeStopTimer > 0;
}

function updateProjectileIfNotTimeStopped(projectile) {
  if (isTimeStoppedByChrono(projectile.attacker)) {
    projectile.draw();
    return false;
  }

  projectile.update();
  return true;
}

function updateFireballs() {
  fireballs.forEach((fireball) => {
    if (!updateProjectileIfNotTimeStopped(fireball)) return;

    if (
      fireball.active &&
      (rectangularCopycatShieldCollision(fireball.target, fireball) ||
        rectangularCollision({ rectangle1: fireball, rectangle2: fireball.target }))
    ) {
      if (handleCopycatShieldHit(fireball.target, fireball.attacker)) {
        fireball.active = false;
        return;
      }

      applyDamage(
        fireball.attacker,
        fireball.target,
        getElementalEventDamage(fireball.attacker, getFireMasterSecretDamage(fireball.attacker, fireballDamage) * fireball.damageMultiplier),
        { isSpecial: true, damageType: 'fireProjectile' }
      );
      applyIceMasterSlow(fireball.attacker, fireball.target, iceMasterShardSlowDuration);
      fireball.target.velocity.x = getDebugKnockback(fireball.velocity.x > 0 ? 10 : -10, fireball.target);
      fireball.target.velocity.y = getDebugKnockback(-7, fireball.target);
      fireball.active = false;
    }
  });

  fireballs = fireballs.filter((fireball) => fireball.active);
}

function updateFireBeams() {
  fireBeams.forEach((fireBeam) => {
    if (!updateProjectileIfNotTimeStopped(fireBeam)) return;

    if (
      fireBeam.active &&
      (rectangularCopycatShieldCollision(fireBeam.target, fireBeam) ||
        rectangularCollision({ rectangle1: fireBeam, rectangle2: fireBeam.target }))
    ) {
      if (handleCopycatShieldHit(fireBeam.target, fireBeam.attacker)) {
        fireBeam.active = false;
        return;
      }

      applyDamage(
        fireBeam.attacker,
        fireBeam.target,
        getElementalEventDamage(fireBeam.attacker, getFireMasterSecretDamage(fireBeam.attacker, fireBeamDamage) * fireBeam.damageMultiplier),
        { isSpecial: true, damageType: 'fireBeam' }
      );
      applyIceMasterSlow(fireBeam.attacker, fireBeam.target, iceMasterBeamSlowDuration);
      fireBeam.target.velocity.x = getDebugKnockback(fireBeam.velocity.x > 0 ? 18 : -18, fireBeam.target);
      fireBeam.target.velocity.y = getDebugKnockback(-10, fireBeam.target);
      fireBeam.active = false;
    }
  });

  fireBeams = fireBeams.filter((fireBeam) => fireBeam.active);
}

function updateLightShots() {
  lightShots.forEach((lightShot) => {
    if (!updateProjectileIfNotTimeStopped(lightShot)) return;

    if (
      lightShot.active &&
      (rectangularCopycatShieldCollision(lightShot.target, lightShot) ||
        rectangularCollision({ rectangle1: lightShot, rectangle2: lightShot.target }))
    ) {
      if (handleCopycatShieldHit(lightShot.target, lightShot.attacker)) {
        lightShot.active = false;
        return;
      }

      const shotDamage = isLightWarriorOmega(lightShot.attacker) ? lightWarriorShotDamage * lightWarriorOmegaDamageMultiplier : lightWarriorShotDamage;
      applyDamage(lightShot.attacker, lightShot.target, shotDamage, { isSpecial: true, damageType: 'lightShot' });
      lightShot.target.velocity.x = getDebugKnockback(lightShot.velocity.x > 0 ? 8 : -8, lightShot.target);
      lightShot.target.velocity.y = getDebugKnockback(-4, lightShot.target);
      lightShot.active = false;
    }
  });

  lightShots = lightShots.filter((lightShot) => lightShot.active);
}

function updateSuperFireKamehamehaCharges() {
  superFireKamehamehaCharges.forEach((charge) => charge.update());
  superFireKamehamehaCharges = superFireKamehamehaCharges.filter((charge) => charge.active);
}

function updateSuperFireKamehamehas() {
  superFireKamehamehas.forEach((beam) => {
    beam.update();
    if (
      beam.active &&
      beam.target &&
      rectangularCollision({ rectangle1: beam, rectangle2: beam.target }) &&
      beam.damageTickTimer <= 0
    ) {
      applyDamage(
        beam.attacker,
        beam.target,
        beam.omega
          ? lightWarriorOmegaDamage * 4
          : beam.lightWarrior
            ? lightWarriorBeamTickDamage * (isLightWarriorOmega(beam.attacker) ? lightWarriorOmegaDamageMultiplier : 1)
            : superFireKamehamehaTickDamage,
        {
        isSpecial: true,
        damageType: beam.omega ? 'omegaLightWarriorFinisher' : 'superFireKamehameha',
        }
      );
      beam.damageTickTimer = beam.lightWarrior ? lightWarriorBeamTickInterval : superFireKamehamehaTickInterval;
      beam.target.velocity.x = getDebugKnockback(beam.direction * 3, beam.target);
    }
  });

  superFireKamehamehas = superFireKamehamehas.filter((beam) => beam.active);
}

function updateTankShells() {
  tankShells.forEach((tankShell) => {
    if (!updateProjectileIfNotTimeStopped(tankShell)) return;

    if (
      tankShell.active &&
      (rectangularCopycatShieldCollision(tankShell.target, tankShell) ||
        rectangularCollision({ rectangle1: tankShell, rectangle2: tankShell.target }))
    ) {
      if (handleCopycatShieldHit(tankShell.target, tankShell.attacker)) {
        tankShell.active = false;
        return;
      }

      applyDamage(tankShell.attacker, tankShell.target, tankShell.damage, { isSpecial: true, damageType: 'tankShell' });
      tankShell.target.velocity.x = getDebugKnockback(tankShell.velocity.x > 0 ? 14 : -14, tankShell.target);
      tankShell.target.velocity.y = getDebugKnockback(-8, tankShell.target);
      tankShell.active = false;
    }
  });

  tankShells = tankShells.filter((tankShell) => tankShell.active);
}

function updateArcadeBossShockwaves() {
  arcadeBossShockwaves.forEach((shockwave) => shockwave.update());
  arcadeBossShockwaves = arcadeBossShockwaves.filter((shockwave) => shockwave.active);
}

function updateCowboyBullets() {
  cowboyBullets.forEach((cowboyBullet) => {
    if (!updateProjectileIfNotTimeStopped(cowboyBullet)) return;

    if (
      cowboyBullet.active &&
      (rectangularCopycatShieldCollision(cowboyBullet.target, cowboyBullet) ||
        rectangularCollision({ rectangle1: cowboyBullet, rectangle2: cowboyBullet.target }))
    ) {
      if (handleCopycatShieldHit(cowboyBullet.target, cowboyBullet.attacker)) {
        cowboyBullet.active = false;
        return;
      }

      const actualDamage = applyDamage(cowboyBullet.attacker, cowboyBullet.target, cowboyBullet.damage, {
        isSpecial: true,
        ignoreDebug: cowboyBullet.fixedDamage,
        damageType: 'bullet',
      });
      if (actualDamage > 0 && cowboyBullet.fixedDamage && desertCowboyDuel.active) {
        fightAchievementFlags.duelShotHitBy = cowboyBullet.attacker;
      }
      cowboyBullet.target.velocity.x = getDebugKnockback(cowboyBullet.velocity.x > 0 ? 4 : -4, cowboyBullet.target);
      cowboyBullet.active = false;
    }
  });

  cowboyBullets = cowboyBullets.filter((cowboyBullet) => cowboyBullet.active);
}

function updateSorcererOrbs() {
  sorcererOrbs.forEach((sorcererOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererOrb)) return;

    if (
      sorcererOrb.active &&
      (rectangularCopycatShieldCollision(sorcererOrb.target, sorcererOrb) ||
        rectangularCollision({ rectangle1: sorcererOrb, rectangle2: sorcererOrb.target }))
    ) {
      if (handleCopycatShieldHit(sorcererOrb.target, sorcererOrb.attacker)) {
        sorcererOrb.active = false;
        return;
      }

      applyDamage(
        sorcererOrb.attacker,
        sorcererOrb.target,
        getElementalEventDamage(sorcererOrb.attacker, getArcaneRiftOrbDamage() * sorcererOrb.damageMultiplier),
        { isSpecial: true, damageType: 'arcaneOrb' }
      );
      sorcererOrb.target.velocity.x = getDebugKnockback(sorcererOrb.velocity.x > 0 ? 16 : -16, sorcererOrb.target);
      sorcererOrb.target.velocity.y = getDebugKnockback(-8, sorcererOrb.target);
      sorcererOrb.active = false;
    }
  });

  sorcererOrbs = sorcererOrbs.filter((sorcererOrb) => sorcererOrb.active);
}

function updateSorcererGravityOrbs() {
  sorcererGravityOrbs.forEach((sorcererGravityOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererGravityOrb)) return;
  });

  sorcererGravityOrbs = sorcererGravityOrbs.filter((sorcererGravityOrb) => sorcererGravityOrb.active);
}

function updateSorcererSecretOrbs() {
  sorcererSecretOrbs.forEach((sorcererSecretOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererSecretOrb)) return;

    if (
      sorcererSecretOrb.active &&
      sorcererSecretOrb.launched &&
      rectangularCollision({ rectangle1: sorcererSecretOrb, rectangle2: sorcererSecretOrb.target })
    ) {
      if (reflectSorcererSecretOrb(sorcererSecretOrb)) {
        sorcererSecretOrb.active = false;
        return;
      }

      applyDamage(sorcererSecretOrb.attacker, sorcererSecretOrb.target, getElementalEventDamage(sorcererSecretOrb.attacker, getSorcererSecretOrbDamage(sorcererSecretOrb)), {
        isSpecial: true,
        damageType: 'arcaneSecret',
      });
      sorcererSecretOrb.target.velocity.x = getDebugKnockback(sorcererSecretOrb.velocity.x > 0 ? 22 : -22, sorcererSecretOrb.target);
      sorcererSecretOrb.target.velocity.y = getDebugKnockback(-12, sorcererSecretOrb.target);
      sorcererSecretOrb.active = false;
    }
  });

  sorcererSecretOrbs = sorcererSecretOrbs.filter((sorcererSecretOrb) => sorcererSecretOrb.active);
}

function updateChronoBlades() {
  chronoBlades.forEach((chronoBlade) => {
    if (!updateProjectileIfNotTimeStopped(chronoBlade)) return;
    const bladeCollisionArea = getChronoBladeCollisionArea(chronoBlade);

    if (
      chronoBlade.active &&
      (rectangularCopycatShieldCollision(chronoBlade.target, bladeCollisionArea) ||
        rectangularCollision({ rectangle1: bladeCollisionArea, rectangle2: chronoBlade.target }))
    ) {
      if (handleCopycatShieldHit(chronoBlade.target, chronoBlade.attacker)) {
        chronoBlade.active = false;
        return;
      }

      const wasAlreadySlowed = chronoBlade.target.chronoSlowTimer > 0;
      applyDamage(chronoBlade.attacker, chronoBlade.target, chronoBladeDamage, { isSpecial: true, damageType: 'temporalBlade' });
      chronoBlade.target.chronoSlowTimer = Math.max(chronoBlade.target.chronoSlowTimer, getDebugDuration(chronoBladeSlowDuration, chronoBlade.target));
      if (wasAlreadySlowed) {
        chronoBlade.target.chronoMarkTimer = getDebugDuration(chronoMarkDuration, chronoBlade.target);
        chronoBlade.target.chronoMarkedBy = chronoBlade.attacker;
      }
      chronoBlade.target.velocity.x = getDebugKnockback(chronoBlade.velocity.x > 0 ? 9 : -9, chronoBlade.target);
      chronoBlade.target.velocity.y = getDebugKnockback(-5, chronoBlade.target);
      chronoBlade.active = false;
    }
  });

  chronoBlades = chronoBlades.filter((chronoBlade) => chronoBlade.active);
}

function getChronoBladeCollisionArea(chronoBlade) {
  const minX = Math.min(chronoBlade.previousPosition.x, chronoBlade.position.x);
  const minY = Math.min(chronoBlade.previousPosition.y, chronoBlade.position.y);
  const maxX = Math.max(
    chronoBlade.previousPosition.x + chronoBlade.width,
    chronoBlade.position.x + chronoBlade.width
  );
  const maxY = Math.max(
    chronoBlade.previousPosition.y + chronoBlade.height,
    chronoBlade.position.y + chronoBlade.height
  );

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function updateIcedThugBlades() {
  icedThugBlades.forEach((iceBlade) => {
    if (!updateProjectileIfNotTimeStopped(iceBlade)) return;
    const bladeCollisionArea = getChronoBladeCollisionArea(iceBlade);

    if (
      iceBlade.active &&
      (rectangularCopycatShieldCollision(iceBlade.target, bladeCollisionArea) ||
        rectangularCollision({ rectangle1: bladeCollisionArea, rectangle2: iceBlade.target }))
    ) {
      if (handleCopycatShieldHit(iceBlade.target, iceBlade.attacker)) {
        iceBlade.active = false;
        return;
      }

      applyDamage(iceBlade.attacker, iceBlade.target, icedThugBladeDamage, { isSpecial: true, damageType: 'iceBlade' });
      iceBlade.target.icedSlowTimer = Math.max(iceBlade.target.icedSlowTimer, getDebugDuration(icedThugBladeSlowDuration, iceBlade.target));
      iceBlade.target.velocity.x = getDebugKnockback(iceBlade.velocity.x > 0 ? 6 : -6, iceBlade.target);
      iceBlade.target.velocity.y = getDebugKnockback(-3, iceBlade.target);
      iceBlade.active = false;
    }
  });

  icedThugBlades = icedThugBlades.filter((iceBlade) => iceBlade.active);
}

function updateIcedThugFrostFields() {
  icedThugFrostFields.forEach((frostField) => {
    if (isTimeStoppedByChrono(frostField.attacker)) {
      frostField.draw();
      return;
    }
    frostField.update();
  });

  icedThugFrostFields = icedThugFrostFields.filter((frostField) => frostField.active);
}

function launchMonkeyBanana(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (attacker.characterType !== 'monkey' || attacker.monkeyBananaCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 30;
  const startY = attacker.position.y + 46;

  monkeyBananas.push(new MonkeyBanana({ x: startX, y: startY, direction, target, attacker }));
  playSound('cowboyBurst');
  recordSpecialUsed(attacker);
  attacker.monkeyBananaCooldown = getDebugCooldown(monkeyBananaCooldown, attacker);
  return true;
}

function dropMonkeyPeel(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (attacker.characterType !== 'monkey' || attacker.monkeyPeelCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const peelX = direction > 0 ? attacker.position.x + attacker.width + 40 : attacker.position.x - 74;
  const ownPeels = monkeyPeels.filter((peel) => peel.attacker === attacker);
  if (ownPeels.length >= monkeyPeelMaxActive) ownPeels[0].active = false;

  monkeyPeels.push(new MonkeyPeel({ x: peelX, attacker, target }));
  playSound('menuSelect');
  recordSpecialUsed(attacker);
  attacker.monkeyPeelCooldown = getDebugCooldown(monkeyPeelCooldown, attacker);
  return true;
}

function summonMonkeyCoconuts(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (attacker.characterType !== 'monkey' || attacker.monkeyCoconutCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) return false;

  const targetCenterX = target.position.x + target.width / 2;
  [-40, 0, 40].forEach((offset, index) => {
    monkeyCoconuts.push(
      new MonkeyCoconut({
        x: Math.max(20, Math.min(canvas.width - 20, targetCenterX + offset)),
        delay: 24 + index * 22,
        attacker,
        target,
      })
    );
  });
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.monkeyCoconutCooldown = getDebugCooldown(monkeyCoconutCooldown, attacker);
  return true;
}

function updateMonkeyBananas() {
  monkeyBananas.forEach((banana) => {
    if (!updateProjectileIfNotTimeStopped(banana)) return;

    if (
      banana.active &&
      (rectangularCopycatShieldCollision(banana.target, banana) ||
        rectangularCollision({ rectangle1: banana, rectangle2: banana.target }))
    ) {
      if (handleCopycatShieldHit(banana.target, banana.attacker)) {
        banana.active = false;
        return;
      }

      applyDamage(banana.attacker, banana.target, monkeyBananaDamage, { isSpecial: true, damageType: 'banana' });
      banana.target.velocity.x = getDebugKnockback(banana.velocity.x > 0 ? 8 : -8, banana.target);
      banana.target.velocity.y = getDebugKnockback(-5, banana.target);
      banana.active = false;
    }
  });

  monkeyBananas = monkeyBananas.filter((banana) => banana.active);
}

function updateMonkeyPeels() {
  monkeyPeels.forEach((peel) => {
    if (isTimeStoppedByChrono(peel.attacker)) {
      peel.draw();
      return;
    }
    peel.update();
    const target = peel.target;
    if (!peel.active || peel.armTimer > 0 || !target || target.health <= 0) return;
    const onGround = target.position.y + target.height >= ground - 4;
    if (onGround && rectangularCollision({ rectangle1: peel, rectangle2: target })) {
      applyDamage(peel.attacker, target, monkeyPeelDamage, { isSpecial: true, damageType: 'banana' });
      target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(monkeyPeelStunDuration, target));
      target.velocity.y = getDebugKnockback(-9, target);
      target.velocity.x = 0;
      playSound('tankShell');
      peel.active = false;
    }
  });

  monkeyPeels = monkeyPeels.filter((peel) => peel.active);
}

function updateMonkeyCoconuts() {
  monkeyCoconuts.forEach((coconut) => {
    if (isTimeStoppedByChrono(coconut.attacker)) {
      coconut.draw();
      return;
    }
    coconut.update();
    if (!coconut.active || coconut.delay > 0) return;
    const collisionArea = getChronoBladeCollisionArea(coconut);
    if (rectangularCollision({ rectangle1: collisionArea, rectangle2: coconut.target })) {
      if (handleCopycatShieldHit(coconut.target, coconut.attacker)) {
        coconut.active = false;
        return;
      }
      applyDamage(coconut.attacker, coconut.target, monkeyCoconutDamage, { isSpecial: true, damageType: 'banana' });
      coconut.target.velocity.y = getDebugKnockback(3, coconut.target);
      coconut.active = false;
    }
  });

  monkeyCoconuts = monkeyCoconuts.filter((coconut) => coconut.active);
}

function updateChronoZones() {
  chronoZones.forEach((chronoZone) => {
    if (isTimeStoppedByChrono(chronoZone.attacker)) {
      chronoZone.draw();
      return;
    }
    chronoZone.update();
  });

  chronoZones = chronoZones.filter((chronoZone) => chronoZone.active);
}

function updateDivineWorldCutCharges() {
  divineWorldCutCharges.forEach((charge) => charge.update());
  divineWorldCutCharges = divineWorldCutCharges.filter((charge) => charge.active);
}

function updateDivineWorldCuts() {
  divineWorldCuts.forEach((worldCut) => {
    if (!updateProjectileIfNotTimeStopped(worldCut)) return;

    if (
      worldCut.active &&
      worldCut.target &&
      rectangularCollision({ rectangle1: worldCut, rectangle2: worldCut.target })
    ) {
      const actualDamage = applyDamage(worldCut.attacker, worldCut.target, worldCut.damage, {
        isSpecial: true,
        damageType: 'divineWorldCut',
        ignoreInvincible: true,
      });
      if (actualDamage > 0) {
        worldCut.target.velocity.x = getDebugKnockback(worldCut.direction * 24, worldCut.target);
        worldCut.target.velocity.y = getDebugKnockback(-10, worldCut.target);
      }
      worldCut.active = false;
    }
  });

  divineWorldCuts = divineWorldCuts.filter((worldCut) => worldCut.active);
}

function drawChronoTimeStopEffect() {
  const stoppedFighters = [player1, player2].filter((fighter) => fighter.chronoTimeStopTimer > 0);
  if (stoppedFighters.length === 0) return;

  const pulse = (Math.sin(performance.now() * 0.012) + 1) / 2;
  ctx.save();
  ctx.fillStyle = `rgba(6, 182, 212, ${0.08 + pulse * 0.04})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(224, 247, 250, 0.16)';
  ctx.lineWidth = 1;
  for (let x = -40; x < canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 120, canvas.height);
    ctx.stroke();
  }

  stoppedFighters.forEach((fighter) => {
    const progress = fighter.chronoTimeStopTimer / chronoTimeStopDuration;
    const centerX = fighter.position.x + fighter.width / 2;
    const centerY = fighter.position.y + fighter.height / 2;
    const radius = Math.max(fighter.width, fighter.height) * (0.72 + pulse * 0.08);

    ctx.fillStyle = `rgba(224, 247, 250, ${0.1 + progress * 0.08})`;
    ctx.fillRect(fighter.position.x - 18, fighter.position.y - 18, fighter.width + 36, fighter.height + 36);

    ctx.strokeStyle = 'rgba(224, 247, 250, 0.92)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(38, 198, 218, 0.72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const inner = radius - 8;
      const outer = radius + 8;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - radius * 0.58);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * 0.44, centerY + radius * 0.25);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const offset = i * 22 - 44;
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 28, centerY + offset);
      ctx.lineTo(centerX - radius * 0.35, centerY + offset - 14);
      ctx.lineTo(centerX + radius * 0.25, centerY + offset + 8);
      ctx.lineTo(centerX + radius + 30, centerY + offset - 10);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function reflectSorcererSecretOrb(sourceOrb) {
  const defender = sourceOrb.target;
  const originalAttacker = sourceOrb.attacker;

  if (
    !defender ||
    !originalAttacker ||
    defender.characterType !== 'reflecter' ||
    defender.copycatShieldTimer <= 0
  ) {
    return false;
  }

  defender.copycatShieldTimer = 0;
  triggerArcaneRift();
  triggerMirrorCollapse(defender, originalAttacker);

  const reflectedOrb = new SorcererSecretOrb({ attacker: defender, target: originalAttacker });
  reflectedOrb.size = sourceOrb.size * 1.18;
  reflectedOrb.finalSize = sourceOrb.finalSize * 1.18;
  reflectedOrb.position = { ...sourceOrb.position };
  reflectedOrb.chargeTimer = 0;
  reflectedOrb.launched = true;
  reflectedOrb.speed = sourceOrb.speed * 1.08;
  reflectedOrb.mirrorCollapsed = true;

  const targetCenterX = originalAttacker.position.x + originalAttacker.width / 2;
  const targetCenterY = originalAttacker.position.y + originalAttacker.height / 2;
  const distanceX = targetCenterX - reflectedOrb.centerX;
  const distanceY = targetCenterY - reflectedOrb.centerY;
  const distance = Math.max(1, Math.hypot(distanceX, distanceY));

  reflectedOrb.velocity.x = (distanceX / distance) * reflectedOrb.speed;
  reflectedOrb.velocity.y = (distanceY / distance) * reflectedOrb.speed;
  sorcererSecretOrbs.push(reflectedOrb);
  playSound('sorcererSecretLaunch');
  return true;
}

function handleMenuSecretInput(event) {
  const targetTag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
  if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;
  if (event.key.length !== 1) return;

  menuSecretBuffer = `${menuSecretBuffer}${event.key.toLowerCase()}`.slice(-32);
  const normalizedSecretBuffer = menuSecretBuffer.replace(/[^a-z0-9]/g, '');

  if (normalizedSecretBuffer.endsWith('secretguide1')) {
    menuSecretBuffer = '';
    openSecretGuide();
  } else if (normalizedSecretBuffer.endsWith('secretguide2')) {
    menuSecretBuffer = '';
    openEventGuide();
  } else if (normalizedSecretBuffer.endsWith('cheater')) {
    menuSecretBuffer = '';
    openDebug();
  } else if (normalizedSecretBuffer.endsWith('codex')) {
    menuSecretBuffer = '';
    unlockCodexOpinion();
  } else if (normalizedSecretBuffer.endsWith('old')) {
    menuSecretBuffer = '';
    openOldDays();
  } else if (normalizedSecretBuffer.endsWith('blind')) {
    menuSecretBuffer = '';
    activateBlindMode();
  } else if (normalizedSecretBuffer.endsWith('overheat')) {
    menuSecretBuffer = '';
    characterSecretModes.fireMasterOverheat = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('ironwall')) {
    menuSecretBuffer = '';
    characterSecretModes.tankIronWall = true;
    unlockAchievement('codeBreaker');
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'tank') {
        fighter.setCharacterType('tank', fighter.secretVariant);
      }
    });
    updateHealthBars();
  } else if (normalizedSecretBuffer.endsWith('deadeye')) {
    menuSecretBuffer = '';
    characterSecretModes.cowboyDeadeye = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('mirrorluck')) {
    menuSecretBuffer = '';
    characterSecretModes.reflecterMirrorLuck = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('kaioken')) {
    menuSecretBuffer = '';
    characterSecretModes.normalKaioken = true;
    unlockAchievement('codeBreaker');
    updateCooldownIndicators();
  } else if (normalizedSecretBuffer.endsWith('upgrade')) {
    menuSecretBuffer = '';
    characterSecretModes.reflecterUpgrade = true;
    unlockAchievement('codeBreaker');
    syncSecretBodyModes();
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'reflecter') {
        fighter.setCharacterType('reflecter', fighter.secretVariant);
      }
    });
    updateHealthBars();
  } else if (normalizedSecretBuffer.endsWith('prism')) {
    menuSecretBuffer = '';
    characterSecretModes.switcherPrism = true;
    unlockAchievement('codeBreaker');
    syncSecretBodyModes();
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'switcher') {
        fighter.setCharacterType('switcher', fighter.secretVariant);
      }
    });
    updateCooldownIndicators();
  } else if (normalizedSecretBuffer.endsWith('fulladapt')) {
    menuSecretBuffer = '';
    if (!isDivineGeneralUnlocked()) return;
    characterSecretModes.divineFullAdapt = true;
    unlockAchievement('codeBreaker');
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'divineGeneral') {
        fighter.secretVariant = 'divineFullAdapt';
        fighter.setMaxHealth(getDivineMaxHealth(fighter));
        fighter.health = fighter.maxHealth;
        fillDivineAdaptations(fighter);
        fighter.divineAdaptCooldown = 0;
        fighter.divineCounterCooldown = 0;
        fighter.divineWorldCutCooldown = 0;
      }
    });
    syncDivineGeneralUnlockUI();
    updateCooldownIndicators();
  } else if (
    normalizedSecretBuffer.endsWith('omega') ||
    normalizedSecretBuffer.endsWith('lightwarrior1') ||
    normalizedSecretBuffer.endsWith('lightwarrior') ||
    normalizedSecretBuffer.endsWith('omegalightwarrior')
  ) {
    menuSecretBuffer = '';
    characterSecretModes.lightWarriorOmega = true;
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'lightWarrior') {
        fighter.secretVariant = 'omega';
        fighter.lightWarriorOmegaTransformed = false;
        fighter.lightWarriorOmegaStateTimer = 0;
        fighter.setMaxHealth(lightWarriorHealth);
        fighter.health = fighter.maxHealth;
        fighter.damageMultiplier = 1;
      }
    });
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('bossrush')) {
    menuSecretBuffer = '';
    unlockArcadeBosses();
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('lightsout')) {
    menuSecretBuffer = '';
    unlockDarkRoomMap();
  } else if (normalizedSecretBuffer.endsWith('clear')) {
    menuSecretBuffer = '';
    clearActiveCodes();
  }
}

window.addEventListener('keydown', (event) => {
  if (document.body.classList.contains('menu-open')) {
    startMenuMusic();
    handleMenuSecretInput(event);
  }

  if (jesterIntro.active && !['a', 'd', 'w', 'A', 'D', 'W'].includes(event.key)) return;

  if (arcadeCutscene.active) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advanceArcadeCutscene();
    } else if (event.key === 'Escape') {
      endArcadeCutscene();
    }
    return;
  }

  if (!gameStarted) return;

  if (jesterFinal.active) {
    const movementKeys = { a: 'a', A: 'a', d: 'd', D: 'd', w: 'w', W: 'w', s: 's', S: 's', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown' };
    if (movementKeys[event.key]) {
      keys[movementKeys[event.key]] = true;
      if (event.key.startsWith('Arrow')) event.preventDefault();
    }
    return;
  }

  switch (event.key) {
    case 'a':
      keys.a = true;
      break;
    case 'd':
      keys.d = true;
      break;
    case 'w':
      if (canFighterAct(player1) && player1.gamblerStunTimer <= 0 && player1.velocity.y === 0) player1.velocity.y = getDebugJumpSpeed(-14, player1);
      break;
    case 's':
      player1.attack();
      break;
    case 'e':
    case 'E':
      player1.attack(true);
      break;
    case 'q':
    case 'Q':
      if (keys.q) break;
      keys.q = true;
      if (isScammer(player1)) {
        launchScamOffer(player1, player2);
        break;
      }
      if (handleJesterAbilityKey(player1, player2, 'q', keys)) break;
      if (keys.f && keys.r && startLightWarriorOmegaTransformation(player1, 1)) break;
      if (handleLightWarriorQfSpecialKey(player1, player2, keys.f, 1)) break;
      if (handleChronoSpecialKey(player1, player2, 'blade', keys.f, 1)) break;
      if (handleGamblerSpecialKey(player1, 'roll', keys.f, 1)) break;
      if (handleFireMasterSpecialKey(player1, player2, 'fireball', keys.f, 1)) break;
      if (handleDivineSpecialKey(player1, player2, 'adapt', keys.f, 1)) break;
      activateKaiokenCombo(player1);
      if (handleSorcererSpecialKey(player1, player2, 'orb', keys.f, 1)) break;
      cycleSwitcherMode(player1);
      launchFireball(player1, player2);
      launchTankShell(player1, player2);
      launchCowboyBurst(player1);
      launchLightWarriorBarrage(player1, player2);
      launchSorcererOrb(player1, player2);
      activateCopycatShield(player1);
      activateGamblerRoll(player1);
      launchChronoBlade(player1, player2);
      activateGhostPhase(player1);
      launchArcadeBossShockwave(player1, player2);
      activateIcedThugFrostField(player1, player2);
      launchMonkeyBanana(player1, player2);
      break;
    case 'f':
    case 'F':
      if (keys.f) break;
      keys.f = true;
      if (isScammer(player1)) {
        throwScamItems(player1, player2);
        break;
      }
      if (handleJesterAbilityKey(player1, player2, 'f', keys)) break;
      if (keys.q && keys.r && startLightWarriorOmegaTransformation(player1, 1)) break;
      if (player1.characterType === 'lightWarrior' && player1.lightWarriorOmegaTransformed && !player1.lightWarriorOmegaFlightCharging && !player1.lightWarriorOmegaFlightTraveling) {
        if (activateLightWarriorOmegaFlight(player1, player2)) break;
      }
      if (handleLightWarriorQfSpecialKey(player1, player2, keys.q, 1)) break;
      if (handleChronoSpecialKey(player1, player2, 'slow', keys.q, 1)) break;
      if (handleGamblerSpecialKey(player1, 'luck', keys.q, 1)) break;
      if (handleFireMasterSpecialKey(player1, player2, 'beam', keys.q, 1)) break;
      if (handleDivineSpecialKey(player1, player2, 'counter', keys.q, 1)) break;
      if (handleLightWarriorFrSpecialKey(player1, player2, 'speed', keys.r, 1)) break;
      if (handleSorcererSpecialKey(player1, player2, 'gravity', keys.q, 1)) break;
      launchFireBeam(player1, player2);
      launchSorcererGravityOrb(player1, player2);
      activateSwitcherAbility(player1);
      activateGamblerLuckIncrementer(player1);
      activateLightWarriorSpeed(player1);
      activateKaioken(player1);
      activateChronoSlow(player1, player2);
      launchIcedThugBlade(player1, player2);
      dropMonkeyPeel(player1, player2);
      break;
    case 'r':
    case 'R':
      if (gameOver) {
        resetFight();
        break;
      }
      if (keys.r) break;
      keys.r = true;
      if (isScammer(player1)) {
        dropScamSlotMachine(player1, player2);
        break;
      }
      if (handleJesterAbilityKey(player1, player2, 'r', keys)) break;
      if (keys.q && keys.f && startLightWarriorOmegaTransformation(player1, 1)) break;
      if (player1.characterType === 'lightWarrior' && player1.lightWarriorOmegaTransformed && !player1.lightWarriorOmegaFlightCharging && !player1.lightWarriorOmegaFlightTraveling) {
        if (activateLightWarriorOmegaFlight(player1, player2)) break;
      }
      if (handleLightWarriorFrSpecialKey(player1, player2, 'flash', keys.f, 1)) break;
      activateLightWarriorSolarFlash(player1, player2);
      summonMonkeyCoconuts(player1, player2);
      break;
    case 'ArrowLeft':
      if (!botEnabled) keys.ArrowLeft = true;
      break;
    case 'ArrowRight':
      if (!botEnabled) keys.ArrowRight = true;
      break;
    case 'ArrowUp':
      if (!botEnabled && canFighterAct(player2) && player2.gamblerStunTimer <= 0 && player2.velocity.y === 0) player2.velocity.y = getDebugJumpSpeed(-14, player2);
      break;
    case 'ArrowDown':
      if (!botEnabled) player2.attack();
      break;
    case 'Shift':
      if (!botEnabled) player2.attack(true);
      break;
    case '/':
      if (keys.slash) break;
      keys.slash = true;
      if (!botEnabled && isScammer(player2)) {
        launchScamOffer(player2, player1);
        break;
      }
      if (!botEnabled && handleJesterAbilityKey(player2, player1, 'q', { q: keys.slash, f: keys.period, r: keys.enter })) break;
      if (keys.period && keys.enter && startLightWarriorOmegaTransformation(player2, 2)) break;
      if (!botEnabled) {
        if (handleLightWarriorQfSpecialKey(player2, player1, keys.period, 2)) break;
        if (handleChronoSpecialKey(player2, player1, 'blade', keys.period, 2)) break;
        if (handleGamblerSpecialKey(player2, 'roll', keys.period, 2)) break;
        if (handleFireMasterSpecialKey(player2, player1, 'fireball', keys.period, 2)) break;
        if (handleDivineSpecialKey(player2, player1, 'adapt', keys.period, 2)) break;
        activateKaiokenCombo(player2);
        if (handleSorcererSpecialKey(player2, player1, 'orb', keys.period, 2)) break;
        launchFireball(player2, player1);
        launchTankShell(player2, player1);
        launchCowboyBurst(player2);
        launchLightWarriorBarrage(player2, player1);
        launchSorcererOrb(player2, player1);
        activateCopycatShield(player2);
        cycleSwitcherMode(player2);
        activateGamblerRoll(player2);
        launchChronoBlade(player2, player1);
        activateGhostPhase(player2);
        launchArcadeBossShockwave(player2, player1);
        activateIcedThugFrostField(player2, player1);
        launchMonkeyBanana(player2, player1);
      }
      break;
    case '.':
      if (keys.period) break;
      keys.period = true;
      if (!botEnabled && isScammer(player2)) {
        throwScamItems(player2, player1);
        break;
      }
      if (!botEnabled && handleJesterAbilityKey(player2, player1, 'f', { q: keys.slash, f: keys.period, r: keys.enter })) break;
      if (keys.slash && keys.enter && startLightWarriorOmegaTransformation(player2, 2)) break;
      if (!botEnabled) {
        if (player2.characterType === 'lightWarrior' && player2.lightWarriorOmegaTransformed && !player2.lightWarriorOmegaFlightCharging && !player2.lightWarriorOmegaFlightTraveling) {
          if (activateLightWarriorOmegaFlight(player2, player1)) break;
        }
        if (handleLightWarriorQfSpecialKey(player2, player1, keys.slash, 2)) break;
        if (handleChronoSpecialKey(player2, player1, 'slow', keys.slash, 2)) break;
        if (handleGamblerSpecialKey(player2, 'luck', keys.slash, 2)) break;
        if (handleFireMasterSpecialKey(player2, player1, 'beam', keys.slash, 2)) break;
        if (handleDivineSpecialKey(player2, player1, 'counter', keys.slash, 2)) break;
        if (handleLightWarriorFrSpecialKey(player2, player1, 'speed', keys.enter, 2)) break;
        if (handleSorcererSpecialKey(player2, player1, 'gravity', keys.slash, 2)) break;
        launchFireBeam(player2, player1);
        launchSorcererGravityOrb(player2, player1);
        activateSwitcherAbility(player2);
        activateGamblerLuckIncrementer(player2);
        activateLightWarriorSpeed(player2);
        activateKaioken(player2);
        activateChronoSlow(player2, player1);
        launchIcedThugBlade(player2, player1);
        dropMonkeyPeel(player2, player1);
      }
      break;
    case 'Enter':
      if (keys.enter) break;
      keys.enter = true;
      if (!botEnabled && isScammer(player2)) {
        dropScamSlotMachine(player2, player1);
        break;
      }
      if (!botEnabled && handleJesterAbilityKey(player2, player1, 'r', { q: keys.slash, f: keys.period, r: keys.enter })) break;
      if (keys.slash && keys.period && startLightWarriorOmegaTransformation(player2, 2)) break;
      if (!botEnabled) {
        if (player2.characterType === 'lightWarrior' && player2.lightWarriorOmegaTransformed && !player2.lightWarriorOmegaFlightCharging && !player2.lightWarriorOmegaFlightTraveling) {
          if (activateLightWarriorOmegaFlight(player2, player1)) break;
        }
        if (handleLightWarriorFrSpecialKey(player2, player1, 'flash', keys.period, 2)) break;
        activateLightWarriorSolarFlash(player2, player1);
        summonMonkeyCoconuts(player2, player1);
      }
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a = false;
      break;
    case 'd':
      keys.d = false;
      break;
    case 'w':
    case 'W':
      keys.w = false;
      break;
    case 's':
    case 'S':
      keys.s = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp = false;
      break;
    case 'ArrowDown':
      keys.ArrowDown = false;
      break;
    case 'q':
    case 'Q':
      keys.q = false;
      break;
    case 'f':
    case 'F':
      keys.f = false;
      finishLightWarriorRadiantPunchCharge(player1);
      break;
    case 'r':
    case 'R':
      keys.r = false;
      finishLightWarriorRadiantPunchCharge(player1);
      break;
    case '/':
      keys.slash = false;
      break;
    case '.':
      keys.period = false;
      finishLightWarriorRadiantPunchCharge(player2);
      break;
    case 'Enter':
      keys.enter = false;
      finishLightWarriorRadiantPunchCharge(player2);
      break;
    case 'ArrowLeft':
      keys.ArrowLeft = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight = false;
      break;
  }
});

function updateMovements() {
  if (player1.lightWarriorOmegaFlightTraveling) {
  } else if (player1.gamblerStunTimer > 0 || player1.divineWorldCutCharging || player1.lightWarriorRadiantPunchCharging || player1.superFireKamehamehaCharging || player1.lightWarriorOmegaFlightCharging) {
    player1.velocity.x = 0;
  } else if (keys.a) {
    player1.velocity.x = -getDebugMoveSpeed(player1);
  } else if (keys.d) {
    player1.velocity.x = getDebugMoveSpeed(player1);
  } else {
    player1.velocity.x = 0;
  }

  if (botEnabled) {
    return;
  }

  if (player2.lightWarriorOmegaFlightTraveling) {
  } else if (player2.gamblerStunTimer > 0 || player2.divineWorldCutCharging || player2.lightWarriorRadiantPunchCharging || player2.superFireKamehamehaCharging || player2.lightWarriorOmegaFlightCharging) {
    player2.velocity.x = 0;
  } else if (keys.ArrowLeft) {
    player2.velocity.x = -getDebugMoveSpeed(player2);
  } else if (keys.ArrowRight) {
    player2.velocity.x = getDebugMoveSpeed(player2);
  } else {
    player2.velocity.x = 0;
  }
}

function launchFireball(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'fireMaster' || attacker.specialCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 34;
  const startY = attacker.position.y + 44;

  fireballs.push(new Fireball({ x: startX, y: startY, direction, target, attacker }));
  playSound('fireball');
  recordSpecialUsed(attacker);
  attacker.specialCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, fireballCooldown), attacker);
}

function launchFireBeam(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'fireMaster' || attacker.fireBeamCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 90;
  const startY = attacker.position.y + 36;

  fireBeams.push(new FireBeam({ x: startX, y: startY, direction, target, attacker }));
  playSound('fireBeam');
  recordSpecialUsed(attacker);
  attacker.fireBeamCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, fireBeamCooldown), attacker);
}

function launchLightWarriorBarrage(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'lightWarrior' ||
    attacker.lightWarriorBurstCooldown > 0 ||
    attacker.lightWarriorBurstShotsRemaining > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.lightWarriorBurstShotsRemaining = lightWarriorBurstShots;
  attacker.lightWarriorBurstTimer = 0;
  attacker.lightWarriorBurstCooldown = getDebugCooldown(lightWarriorBurstCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('fireball');
}

function shootLightWarriorShot(attacker, target) {
  if (!target) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 28;
  const shotIndex = lightWarriorBurstShots - attacker.lightWarriorBurstShotsRemaining;
  const startY = attacker.position.y + 34 + (shotIndex % 3) * 15;

  lightShots.push(new LightShot({ x: startX, y: startY, direction, target, attacker }));
}

function activateLightWarriorSpeed(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'lightWarrior' || attacker.lightWarriorSpeedCooldown > 0 || gameOver) return;

  attacker.lightWarriorSpeedTimer = getDebugDuration(lightWarriorSpeedDuration, attacker);
  attacker.lightWarriorSpeedCooldown = attacker.lightWarriorSpeedTimer + getDebugCooldown(lightWarriorSpeedCooldown, attacker);
  attacker.health = Math.min(attacker.maxHealth, attacker.health + getDebugDamage(lightWarriorHealAmount, attacker));
  recordSpecialUsed(attacker);
  playSound('switcher');
}

function activateLightWarriorSolarFlash(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'lightWarrior' || attacker.lightWarriorSolarFlashCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const attackerCenterY = attacker.position.y + attacker.height / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const targetCenterY = target.position.y + target.height / 2;
  const distance = Math.hypot(targetCenterX - attackerCenterX, targetCenterY - attackerCenterY);
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;

  attacker.lightWarriorSolarFlashCooldown = getDebugCooldown(lightWarriorSolarFlashCooldown, attacker);
  attacker.lightWarriorSolarFlashTimer = getDebugDuration(lightWarriorSolarFlashVisualDuration, attacker);
  recordSpecialUsed(attacker);
  playSound('gravityOrb');

  if (distance > lightWarriorSolarFlashRange) return;
  if (handleCopycatShieldHit(target, attacker)) return;

  const flashDamage = isLightWarriorOmega(attacker) ? lightWarriorSolarFlashDamage * lightWarriorOmegaDamageMultiplier : lightWarriorSolarFlashDamage;
  const actualDamage = applyDamage(attacker, target, flashDamage, { isSpecial: true, damageType: 'lightFlash' });
  if (actualDamage > 0) {
    target.velocity.x = getDebugKnockback(direction * 15, target);
    target.velocity.y = getDebugKnockback(-8, target);
  }
}

function getLightWarriorRadiantPunchChargeProgress(attacker) {
  if (!attacker) return 0;
  return Math.max(0, Math.min(1, attacker.lightWarriorRadiantPunchChargeTimer / lightWarriorRadiantPunchMaxCharge));
}

function getLightWarriorRadiantPunchDamage(attacker) {
  const progress = getLightWarriorRadiantPunchChargeProgress(attacker);
  const damage = Math.round(
    lightWarriorRadiantPunchMinDamage +
      (lightWarriorRadiantPunchMaxDamage - lightWarriorRadiantPunchMinDamage) * progress
  );
  return isLightWarriorOmega(attacker) ? Math.round(damage * lightWarriorOmegaDamageMultiplier) : damage;
}

function startLightWarriorRadiantPunchCharge(attacker) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'lightWarrior' ||
    attacker.lightWarriorRadiantPunchCooldown > 0 ||
    attacker.lightWarriorSpeedCooldown > 0 ||
    attacker.lightWarriorSolarFlashCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.lightWarriorRadiantPunchCharging = true;
  attacker.lightWarriorRadiantPunchChargeTimer = 0;
  attacker.lightWarriorRadiantPunchReadyTimer = 0;
  attacker.lightWarriorRadiantPunchDamage = 0;
  attacker.lightWarriorRadiantPunchAttackActive = false;
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  attacker.lightWarriorRadiantPunchCooldown = getDebugCooldown(lightWarriorRadiantPunchCooldown, attacker);
  attacker.lightWarriorSpeedCooldown = Math.max(attacker.lightWarriorSpeedCooldown, attacker.lightWarriorRadiantPunchCooldown);
  attacker.lightWarriorSolarFlashCooldown = Math.max(attacker.lightWarriorSolarFlashCooldown, attacker.lightWarriorRadiantPunchCooldown);
  recordSpecialUsed(attacker);
  playSound('gravityOrb');
  return true;
}

function finishLightWarriorRadiantPunchCharge(attacker) {
  if (!attacker || !attacker.lightWarriorRadiantPunchCharging) return false;

  attacker.lightWarriorRadiantPunchCharging = false;
  attacker.lightWarriorRadiantPunchDamage = getLightWarriorRadiantPunchDamage(attacker);
  attacker.lightWarriorRadiantPunchReadyTimer = getDebugDuration(lightWarriorRadiantPunchReadyDuration, attacker);
  playSound('switcher');
  return true;
}

function launchInfernoSplit(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'fireMaster' ||
    attacker.specialCooldown > 0 ||
    attacker.fireBeamCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 90;
  const fireballX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 34;
  const baseY = attacker.position.y + 42;
  const fireballOffsets = [-28, 0, 28];

  fireballOffsets.forEach((offset) => {
    fireballs.push(
      new Fireball({
        x: fireballX,
        y: baseY + offset,
        direction,
        target,
        attacker,
        damageMultiplier: infernoSplitFireballDamageMultiplier,
      })
    );
  });
  fireBeams.push(
    new FireBeam({
      x: startX,
      y: attacker.position.y + 36,
      direction,
      target,
      attacker,
      damageMultiplier: infernoSplitBeamDamageMultiplier,
    })
  );

  playSound('fireBeam');
  recordSpecialUsed(attacker);
  attacker.specialCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, infernoSplitCooldown), attacker);
  attacker.fireBeamCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, infernoSplitCooldown), attacker);
  return true;
}

function activateSuperFireKamehameha(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'fireMaster' ||
    !isSuperFireMaster(attacker) ||
    attacker.specialCooldown > 0 ||
    attacker.fireBeamCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.specialCooldown = getDebugCooldown(superFireKamehamehaChargeDuration + superFireKamehamehaDuration, attacker);
  attacker.fireBeamCooldown = attacker.specialCooldown;
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  attacker.superFireKamehamehaCharging = true;
  superFireKamehamehaCharges.push(new SuperFireKamehamehaCharge({ attacker, target }));
  recordSpecialUsed(attacker);
  playSound('fireball');
  return true;
}

function activateLightWarriorBeam(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'lightWarrior' ||
    attacker.lightWarriorRadiantPunchCooldown > 0 ||
    attacker.lightWarriorSolarFlashCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.lightWarriorRadiantPunchCooldown = getDebugCooldown(lightWarriorBeamChargeDuration + lightWarriorBeamDuration, attacker);
  attacker.lightWarriorSolarFlashCooldown = attacker.lightWarriorRadiantPunchCooldown;
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  attacker.lightWarriorBeamCharging = true;
  superFireKamehamehaCharges.push(new SuperFireKamehamehaCharge({
    attacker,
    target,
    lightWarrior: true,
    omega: attacker.lightWarriorOmegaTransformed,
  }));
  recordSpecialUsed(attacker);
  playSound(attacker.lightWarriorOmegaTransformed ? 'gravityOrb' : 'fireball');
  return true;
}

function launchTankShell(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'tank' || attacker.tankShellCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 28;
  const startY = attacker.position.y + 84;
  const shellKey = attacker === player1 ? 'p1ShellAvailable' : 'p2ShellAvailable';
  const empowered = tankClash.active && tankClash[shellKey];
  const damage = empowered ? tankClashShellDamage : getTankSecretDamage(attacker, tankShellDamage);

  if (empowered) tankClash[shellKey] = false;
  if (tankClash.active && !tankClash.p1ShellAvailable && !tankClash.p2ShellAvailable) {
    tankClash.active = false;
    tankClash.closeFrames = 0;
  }
  tankShells.push(new TankShell({ x: startX, y: startY, direction, target, attacker, damage, empowered }));
  playSound('tankShell');
  recordSpecialUsed(attacker);
  attacker.tankShellCooldown = getDebugCooldown(tankShellCooldown, attacker);
}

function launchArcadeBossShockwave(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!attacker.arcadeBossVariant || attacker.arcadeBossShockwaveCooldown > 0 || gameOver) return false;

  arcadeBossShockwaves.push(new ArcadeBossShockwave({ target, attacker }));
  attacker.arcadeBossShockwaveCooldown = getDebugCooldown(normalArcadeBossShockwaveCooldown, attacker);
  playSound('tankShell');
  recordSpecialUsed(attacker);
  return true;
}

function launchSorcererOrb(attacker, target, ignoreCooldown = false, damageMultiplier = 1) {
  if (!canFighterAct(attacker)) return;
  if (
    (attacker.characterType !== 'sorcerer' && !ignoreCooldown) ||
    (!ignoreCooldown && attacker.sorcererOrbCooldown > 0) ||
    gameOver
  ) {
    return;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 36;
  const startY = attacker.position.y + 42;

  sorcererOrbs.push(new SorcererOrb({ x: startX, y: startY, direction, target, attacker, damageMultiplier }));
  playSound('sorcererOrb');
  if (!ignoreCooldown) {
    recordSpecialUsed(attacker);
    attacker.sorcererOrbCooldown = getDebugCooldown(sorcererOrbCooldown, attacker);
  }
}

function launchSorcererGravityOrb(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'sorcerer' ||
    attacker.sorcererGravityCooldown > 0 ||
    gameOver
  ) {
    return;
  }

  const size = attacker.width * 3;
  const targetCenterX = target.position.x + target.width / 2;
  const targetCenterY = target.position.y + target.height / 2;
  const x = Math.max(0, Math.min(canvas.width - size, targetCenterX - size / 2));
  const y = Math.max(64, Math.min(ground - size, targetCenterY - size / 2));

  sorcererGravityOrbs.push(new SorcererGravityOrb({ x, y, target, attacker }));
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.sorcererGravityCooldown = getDebugCooldown(sorcererGravityCooldown, attacker);
}

function getScammerCooldown(baseCooldown, attacker) {
  return Math.round(getDebugCooldown(baseCooldown, attacker) * (attacker.scammerRage ? scammerRageCooldownMultiplier : 1));
}

function getScammerDamage(baseDamage, attacker) {
  return baseDamage * (attacker && attacker.scammerRage ? scammerRageDamageMultiplier : 1);
}

function isScammer(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'scammer');
}

function canScammerAct(attacker) {
  return isScammer(attacker) && canFighterAct(attacker) && attacker.gamblerStunTimer <= 0 && !gameOver;
}

function launchScamOffer(attacker, target) {
  if (!canScammerAct(attacker) || attacker.scammerOfferCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(attacker) ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 30;
  scamOffers.push(new ScamOffer({ x: startX, y: attacker.position.y + 50, direction, target, attacker }));
  playSound('menuSelect');
  recordSpecialUsed(attacker);
  attacker.scammerOfferCooldown = getScammerCooldown(scammerOfferCooldown, attacker);
  return true;
}

function throwScamItems(attacker, target) {
  if (!canScammerAct(attacker) || attacker.scammerItemCooldown > 0) return false;
  const kinds = ['goldRock', 'fakeWatch', 'fakeDiamond', 'fakeBill'];
  const origins = ['top', 'left', 'right', 'self'];
  for (let index = 0; index < 3; index += 1) {
    scamItems.push(
      new ScamItem({
        origin: origins[Math.floor(Math.random() * origins.length)],
        kind: kinds[Math.floor(Math.random() * kinds.length)],
        delay: 14 + index * (8 + Math.floor(Math.random() * 14)),
        target,
        attacker,
      })
    );
  }
  playSound('cutsceneCash');
  recordSpecialUsed(attacker);
  attacker.scammerItemCooldown = getScammerCooldown(scammerItemCooldown, attacker);
  return true;
}

function dropScamSlotMachine(attacker, target) {
  if (!canScammerAct(attacker) || attacker.scammerSlotCooldown > 0) return false;
  if (scamSlotMachines.some((machine) => machine.attacker === attacker)) return false;
  scamSlotMachines.push(new ScamSlotMachine({ x: getFighterCenterX(target), attacker, target }));
  playSound('cutsceneQuestion');
  recordSpecialUsed(attacker);
  attacker.scammerSlotCooldown = getScammerCooldown(scammerSlotCooldown, attacker);
  return true;
}

function addScamCooldown(fighter, keys, amount) {
  keys.forEach((key) => {
    if (typeof fighter[key] === 'number') fighter[key] = Math.max(fighter[key], 0) + getDebugCooldown(amount, fighter);
  });
}

function showScamLabel(fighter, text) {
  fighter.scamLabel = text;
  fighter.scamLabelTimer = 80;
}

function applyScamDebuff(target, scammer, strength = 1) {
  if (!target || target.health <= 0 || target === scammer) return;
  const duration = getDebugDuration(Math.round(scamDebuffDuration * strength), target);
  const cooldownPenalty = Math.round(120 * strength);

  if (isScammer(target)) {
    const stolen = Math.round(5 * strength);
    target.health = Math.max(1, target.health - stolen);
    scammer.health = Math.min(scammer.maxHealth, scammer.health + stolen);
    showScamLabel(target, 'ESTAFA ENTRE ESTAFADORES');
    return;
  }

  switch (target.characterType) {
    case 'gambler':
      target.gamblerLuckBonus = Math.max(0, (target.gamblerLuckBonus || 0) - 0.1 * strength);
      showScamLabel(target, `-${Math.round(10 * strength)}% SUERTE`);
      break;
    case 'fireMaster':
      addScamCooldown(target, ['specialCooldown', 'fireBeamCooldown'], cooldownPenalty);
      showScamLabel(target, 'MATAFUEGOS TRUCHO');
      break;
    case 'tank':
      target.scamVulnerableTimer = Math.max(target.scamVulnerableTimer || 0, duration);
      showScamLabel(target, 'BLINDAJE DE CARTON');
      break;
    case 'cowboy':
      addScamCooldown(target, ['cowboyBurstCooldown'], cooldownPenalty);
      showScamLabel(target, 'BALAS DE FOGUEO');
      break;
    case 'reflecter':
      addScamCooldown(target, ['copycatShieldCooldown'], Math.round(cooldownPenalty * 1.4));
      showScamLabel(target, 'ESPEJO EMPANADO');
      break;
    case 'switcher':
      target.switcherModeIndex = Math.floor(Math.random() * switcherModes.length);
      addScamCooldown(target, ['switcherAbilityCooldown'], Math.round(cooldownPenalty * 0.8));
      showScamLabel(target, 'CAMBIO DE MODO FORZADO');
      break;
    case 'sorcerer':
      addScamCooldown(target, ['sorcererOrbCooldown', 'sorcererGravityCooldown'], cooldownPenalty);
      showScamLabel(target, 'VARITA DE PLASTICO');
      break;
    case 'chrono':
      target.chronoSlowTimer = Math.max(target.chronoSlowTimer, Math.round(duration * 0.5));
      showScamLabel(target, 'RELOJ FALSO: ATRASA');
      break;
    case 'ghost':
      addScamCooldown(target, ['ghostPhaseCooldown'], Math.round(cooldownPenalty * 1.4));
      showScamLabel(target, 'EXORCISMO EN OFERTA');
      break;
    case 'lightWarrior':
      addScamCooldown(target, ['lightWarriorBurstCooldown', 'lightWarriorSpeedCooldown', 'lightWarriorSolarFlashCooldown'], Math.round(cooldownPenalty * 0.8));
      showScamLabel(target, 'LAMPARITA QUEMADA');
      break;
    case 'divineGeneral':
      Object.keys(target.divineAdaptations || {}).forEach((damageType) => {
        target.divineAdaptations[damageType] = Math.max(0, target.divineAdaptations[damageType] - Math.ceil(strength));
      });
      showScamLabel(target, 'ADAPTACION ESTAFADA');
      break;
    case 'monkey':
      addScamCooldown(target, ['monkeyBananaCooldown', 'monkeyPeelCooldown'], cooldownPenalty);
      target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, Math.round(duration * 0.4));
      showScamLabel(target, 'BANANA PODRIDA');
      break;
    default:
      target.scamWeakTimer = Math.max(target.scamWeakTimer || 0, duration);
      showScamLabel(target, 'CONTRATO BASURA: -STATS');
      break;
  }
}

function applyScamSlotEffect(fighter, effect, scammer) {
  if (!fighter || fighter.health <= 0) return;
  const isVictim = fighter !== scammer;
  if (effect === 'benefit') {
    fighter.health = Math.min(fighter.maxHealth, fighter.health + getDebugMaxHealth(scammerSlotEffectHeal, fighter));
  } else if (effect === 'harm') {
    const source = fighter === scammer ? getOpponent(fighter) : scammer;
    applyDamage(source, fighter, getScammerDamage(scammerSlotEffectDamage, scammer), { isSpecial: true, recordStats: false, damageType: 'scam' });
    fighter.velocity.y = getDebugKnockback(-5, fighter);
    if (isVictim) applyScamDebuff(fighter, scammer, 1);
  } else {
    fighter.position.x = 40 + Math.random() * (canvas.width - 80 - fighter.width);
    fighter.velocity.y = getDebugKnockback(-6, fighter);
    fighter.gamblerStunTimer = Math.max(fighter.gamblerStunTimer, 30);
    Object.keys(fighter).forEach((key) => {
      if (!key.endsWith('Cooldown') || ['terrainEffectCooldown', 'basicAttackCooldown', 'strongAttackCooldown'].includes(key)) return;
      if (typeof fighter[key] !== 'number') return;
      fighter[key] = Math.floor(Math.random() * 360);
    });
  }
  if (isVictim) applyScamDebuff(fighter, scammer, 1);
}

function updateScamSlotMachines() {
  scamSlotMachines.forEach((machine) => {
    if (isTimeStoppedByChrono(machine.attacker)) {
      machine.draw();
      return;
    }
    machine.update();
  });
  scamSlotMachines = scamSlotMachines.filter((machine) => machine.active);
}

function updateScamOffers() {
  scamOffers.forEach((offer) => {
    if (!updateProjectileIfNotTimeStopped(offer)) return;
    if (
      offer.active &&
      (rectangularCopycatShieldCollision(offer.target, offer) || rectangularCollision({ rectangle1: offer, rectangle2: offer.target }))
    ) {
      if (handleCopycatShieldHit(offer.target, offer.attacker)) {
        offer.active = false;
        return;
      }
      applyDamage(offer.attacker, offer.target, getScammerDamage(scammerOfferDamage, offer.attacker), { isSpecial: true, damageType: 'scam' });
      applyScamDebuff(offer.target, offer.attacker, scammerOfferLuckSteal / 0.1);
      offer.attacker.health = Math.min(offer.attacker.maxHealth, offer.attacker.health + getDebugMaxHealth(scammerOfferHeal, offer.attacker));
      offer.target.velocity.x = getDebugKnockback(offer.velocity.x > 0 ? 6 : -6, offer.target);
      offer.target.velocity.y = getDebugKnockback(-4, offer.target);
      offer.active = false;
    }
  });
  scamOffers = scamOffers.filter((offer) => offer.active);
}

function updateScamItems() {
  scamItems.forEach((item) => {
    if (isTimeStoppedByChrono(item.attacker)) {
      item.draw();
      return;
    }
    item.update();
    if (!item.active || item.delay > 0) return;
    const area = getChronoBladeCollisionArea(item);
    if (
      rectangularCopycatShieldCollision(item.target, area) ||
      rectangularCollision({ rectangle1: area, rectangle2: item.target })
    ) {
      if (handleCopycatShieldHit(item.target, item.attacker)) {
        item.active = false;
        return;
      }
      applyDamage(item.attacker, item.target, getScammerDamage(scammerItemDamage, item.attacker), { isSpecial: true, damageType: 'scam' });
      applyScamDebuff(item.target, item.attacker, scammerItemLuckSteal / 0.1);
      item.target.velocity.x = getDebugKnockback(item.velocity.x > 0 ? 5 : -5, item.target);
      item.target.velocity.y = getDebugKnockback(-3, item.target);
      item.active = false;
    }
  });
  scamItems = scamItems.filter((item) => item.active);
}

function isShadowJester(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'shadowJester');
}

function canJesterAct(attacker) {
  return isShadowJester(attacker) && canFighterAct(attacker) && attacker.gamblerStunTimer <= 0 && !gameOver;
}

function castJesterSuits(attacker, target) {
  if (!canJesterAct(attacker) || attacker.jesterSuitCooldown > 0) return false;
  const centerX = getFighterCenterX(target);
  const centerY = target.position.y + target.height / 2;
  const kinds = ['heart', 'diamond', 'spade', 'club'];
  const count = 6;
  const offset = Math.random() * Math.PI;
  for (let index = 0; index < count; index += 1) {
    const angle = offset + (Math.PI * 2 * index) / count;
    jesterSuits.push(
      new JesterSuit({
        x: centerX + Math.cos(angle) * 230 - 11,
        y: Math.min(ground - 30, centerY + Math.sin(angle) * 200) - 11,
        kind: kinds[index % kinds.length],
        delay: 34 + index * 3,
        launchSound: index === 0,
        aimX: centerX,
        aimY: centerY,
        speed: 7.5,
        damage: jesterSuitDamage,
        target,
        attacker,
      })
    );
  }
  playSound('jesterLaugh');
  playSound('jesterSuitSummon');
  recordSpecialUsed(attacker);
  attacker.jesterSuitCooldown = getDebugCooldown(jesterSuitCooldown, attacker);
  return true;
}

function isJesterSecretUnlocked(attacker, secret) {
  if (!isShadowJester(attacker)) return false;
  if (secret === 'final') return attacker.health <= jesterFinalUnlockHealth;
  return attacker.health <= (secret === 'storm' ? jesterStormUnlockHealth : jesterRingUnlockHealth);
}

function castJesterSuitRing(attacker, target) {
  if (!canJesterAct(attacker) || !isJesterSecretUnlocked(attacker, 'ring') || attacker.jesterRingCooldown > 0) return false;
  if (jesterBombs.some((effect) => effect instanceof JesterSuitRing && effect.attacker === attacker)) return false;
  jesterBombs.push(new JesterSuitRing({ attacker, target }));
  playSound('jesterLaugh');
  playSound('jesterSuitSummon');
  recordSpecialUsed(attacker);
  attacker.jesterRingCooldown = getDebugCooldown(jesterRingCooldown, attacker);
  return true;
}

function castJesterScytheStorm(attacker, target) {
  if (!canJesterAct(attacker) || !isJesterSecretUnlocked(attacker, 'storm') || attacker.jesterStormCooldown > 0) return false;
  if (jesterBombs.some((effect) => effect instanceof JesterScytheStorm && effect.attacker === attacker)) return false;
  jesterBombs.push(new JesterScytheStorm({ attacker, target }));
  playSound('jesterLaugh');
  playSound('jesterScytheThrow');
  recordSpecialUsed(attacker);
  attacker.jesterStormCooldown = getDebugCooldown(jesterStormCooldown, attacker);
  return true;
}

// Human controls for Shadow Jester. Pressing two ability keys together fires a secret:
// ability 1 + 2 (Q+F / "/"+".") = ring of suits, ability 1 + 3 (Q+R / "/"+Enter) = scythe storm.
function handleJesterAbilityKey(attacker, target, slot, held) {
  if (!isShadowJester(attacker)) return false;
  if ((slot === 'f' && held.r) || (slot === 'r' && held.f)) {
    if (castJesterFinalAct(attacker, target)) return true;
  }
  if ((slot === 'q' && held.r) || (slot === 'r' && held.q)) {
    if (castJesterScytheStorm(attacker, target)) return true;
  }
  if ((slot === 'q' && held.f) || (slot === 'f' && held.q)) {
    if (castJesterSuitRing(attacker, target)) return true;
  }
  if (slot === 'q') castJesterSuits(attacker, target);
  if (slot === 'f') startJesterChaos(attacker, target);
  if (slot === 'r') throwJesterScythe(attacker, target);
  return true;
}

function updateJesterSecretUnlocks(fighter) {
  const tier = fighter.health <= jesterStormUnlockHealth ? 2 : fighter.health <= jesterRingUnlockHealth ? 1 : 0;
  if (tier > fighter.jesterSecretTier && fighter.health > 0) {
    fighter.jesterSecretTier = tier;
    fighter.jesterUnlockTimer = 120;
    fighter.jesterUnlockText = tier === 2 ? 'TORMENTA DE GUADANAS!' : 'ANILLO DE CARTAS!';
    playSound('jesterUnlock');
  }
  if (fighter.jesterUnlockTimer > 0) {
    const alpha = Math.min(1, fighter.jesterUnlockTimer / 25);
    const rise = (120 - fighter.jesterUnlockTimer) / 4;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.font = '900 14px Courier New, monospace';
    ctx.fillStyle = '#fdd835';
    const x = Math.max(120, Math.min(canvas.width - 120, getFighterCenterX(fighter)));
    ctx.strokeText('NUEVO TRUCO DESBLOQUEADO', x, fighter.position.y - 60 - rise);
    ctx.fillText('NUEVO TRUCO DESBLOQUEADO', x, fighter.position.y - 60 - rise);
    ctx.font = '900 22px Courier New, monospace';
    ctx.fillStyle = '#ea80fc';
    ctx.strokeText(fighter.jesterUnlockText, x, fighter.position.y - 36 - rise);
    ctx.fillText(fighter.jesterUnlockText, x, fighter.position.y - 36 - rise);
    ctx.restore();
  }
}

function jesterNeedsFinalAct(fighter) {
  return Boolean(fighter && fighter === player2 && isShadowJester(fighter) && botEnabled && !fighter.jesterFinalActUsed);
}

function clearJesterProjectiles() {
  jesterSuits = [];
  jesterBombs = [];
  jesterScythes = [];
  jesterAfterimages = [];
  robotShots = [];
}

function startJesterTiredScene() {
  player2.jesterTiredShown = true;
  player2.jesterChaosTeleports = 0;
  clearJesterProjectiles();
  let gamblerX = Math.max(60, Math.min(canvas.width - 260, player1.position.x));
  let jesterX = Math.max(gamblerX + 200, Math.min(canvas.width - 100, player2.position.x));
  if (player2.position.x < player1.position.x) {
    jesterX = Math.max(60, Math.min(canvas.width - 260, player2.position.x));
    gamblerX = Math.max(jesterX + 200, Math.min(canvas.width - 100, player1.position.x));
  }
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'jesterTired',
    lines: jesterTiredLines,
    phase: 'dialog',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: player1.position.x,
    gamblerTargetX: gamblerX,
    gamblerHop: 0,
    scammerX: player2.position.x,
    scammerY: 0,
    scammerTargetX: jesterX,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
  });
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneAngry');
  startCutsceneLine(0);
}

function castJesterFinalAct(attacker, target) {
  if (jesterFinal.active || !canJesterAct(attacker) || !isJesterSecretUnlocked(attacker, 'final') || attacker.jesterFinalActUsed) return false;
  attacker.jesterFinalActUsed = true;
  attacker.jesterChaosTeleports = 0;
  clearJesterProjectiles();
  recordSpecialUsed(attacker);
  const soulWidth = Math.round(target.width * 0.3);
  const soulHeight = Math.round(target.height * 0.3);
  Object.assign(jesterFinal, {
    active: true,
    frame: 0,
    caster: attacker,
    target,
    soul: { x: getFighterCenterX(target) - soulWidth / 2, y: target.position.y + target.height / 2, width: soulWidth, height: soulHeight },
    scythes: [],
    flashes: [],
    invulnerable: 0,
    nextSpawn: 0,
    sweep: 0,
    giant: null,
    shake: 0,
    hits: 0,
    lastSounds: {},
    saved: { casterX: attacker.position.x, casterY: attacker.position.y },
  });
  resetKeys();
  playSound('jesterUnlock');
  playSound('jesterLaugh');
  playSound('jesterFinalShrink');
  return true;
}

function playJesterFinalSound(name, gap = 5) {
  jesterFinal.lastSounds = jesterFinal.lastSounds || {};
  if (jesterFinal.frame - (jesterFinal.lastSounds[name] ?? -999) < gap) return;
  jesterFinal.lastSounds[name] = jesterFinal.frame;
  playSound(name);
}

function getJesterFinalFloor() {
  return canvas.height - 40;
}

function spawnJesterFinalScythe(x, { warn = 40, speed = 9, drift = 0, wobble = 0 } = {}) {
  jesterFinal.scythes.push({
    x: Math.max(40, Math.min(canvas.width - 40, x)),
    y: -70,
    warn,
    speed,
    drift,
    wobble,
    wobblePhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    size: 1.7,
  });
  playJesterFinalSound('jesterFinalWarn', 6);
}

function updateJesterFinalPattern(rainFrame) {
  const final = jesterFinal;
  if (rainFrame < final.nextSpawn) return;
  const soulCenterX = final.soul.x + final.soul.width / 2;
  if (rainFrame < 400) {
    // simple: one scythe at a time, sweeping across the screen and back
    const columns = 8;
    const step = final.sweep % (columns * 2 - 2);
    const column = step < columns ? step : columns * 2 - 2 - step;
    spawnJesterFinalScythe(80 + column * ((canvas.width - 160) / (columns - 1)), { warn: 40, speed: 9 });
    final.sweep += 1;
    final.nextSpawn = rainFrame + 48;
  } else if (rainFrame < 800) {
    // mirrored pairs closing in from the sides, plus one at the player now and then
    const offset = 90 + (final.sweep % 5) * 85;
    spawnJesterFinalScythe(offset, { warn: 32, speed: 11 });
    spawnJesterFinalScythe(canvas.width - offset, { warn: 32, speed: 11 });
    if (final.sweep % 3 === 0) spawnJesterFinalScythe(soulCenterX, { warn: 36, speed: 10 });
    final.sweep += 1;
    final.nextSpawn = rainFrame + 38;
  } else {
    // madness: random count, speed, drift and wobble
    const count = 1 + Math.floor(Math.random() * 3);
    for (let index = 0; index < count; index += 1) {
      const aimed = Math.random() < 0.35;
      spawnJesterFinalScythe(aimed ? soulCenterX + (Math.random() - 0.5) * 80 : 40 + Math.random() * (canvas.width - 80), {
        warn: 16 + Math.floor(Math.random() * 14),
        speed: 10 + Math.random() * 6,
        drift: Math.random() < 0.45 ? (Math.random() - 0.5) * 7 : 0,
        wobble: Math.random() < 0.4 ? 3 + Math.random() * 4 : 0,
      });
    }
    final.nextSpawn = rainFrame + 14 + Math.floor(Math.random() * 16);
  }
}

function drawJesterFinalScythe(x, y, rotation, size, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.rotate(rotation);
  ctx.shadowColor = '#ea80fc';
  ctx.shadowBlur = 14;
  ctx.strokeStyle = '#7c4dff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(24, 0);
  ctx.stroke();
  [1, -1].forEach((side) => {
    ctx.fillStyle = '#e1d5ff';
    ctx.beginPath();
    ctx.moveTo(side * 22, -4);
    ctx.quadraticCurveTo(side * 34, -30, side * 4, -34);
    ctx.quadraticCurveTo(side * 24, -20, side * 15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fdd835';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  ctx.restore();
}

function hurtJesterFinalTarget() {
  const final = jesterFinal;
  if (final.invulnerable > 0) return;
  const target = final.target;
  // percentage damage: 10% of the current health, so it can never finish you off on its own
  const damage = target.health * jesterFinalDamagePercent;
  if (target.health > 1) {
    target.health = Math.max(1, target.health - damage);
    const targetStats = getPlayerStats(target);
    const casterStats = getPlayerStats(final.caster);
    targetStats.damageTaken += damage;
    casterStats.damageDealt += damage;
  }
  final.invulnerable = 45;
  final.hits += 1;
  final.shake = 10;
  playSound('jesterScytheHit');
  playSound('jesterFinalHurt');
  updateHealthBars();
}

function moveJesterFinalSoul() {
  const final = jesterFinal;
  const soul = final.soul;
  const speed = 6.5;
  let moveX = 0;
  let moveY = 0;
  if (final.target === player1) {
    moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    moveY = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
  } else if (!botEnabled) {
    moveX = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    moveY = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
  } else {
    // simple dodge for a bot-controlled target: step away from the closest scythe overhead
    const centerX = soul.x + soul.width / 2;
    const threat = final.scythes.find((scythe) => Math.abs(scythe.x - centerX) < 70);
    if (threat) moveX = threat.x > centerX ? -1 : 1;
    moveY = soul.y < getJesterFinalFloor() - 120 ? 1 : 0;
  }
  const length = Math.hypot(moveX, moveY) || 1;
  soul.x += (moveX / length) * speed;
  soul.y += (moveY / length) * speed;
  soul.x = Math.max(20, Math.min(canvas.width - 20 - soul.width, soul.x));
  soul.y = Math.max(70, Math.min(getJesterFinalFloor() - soul.height, soul.y));
}

function drawJesterFinalSoul(scale) {
  const final = jesterFinal;
  const target = final.target;
  const soul = final.soul;
  if (final.invulnerable > 0 && Math.floor(final.invulnerable / 4) % 2 === 0) return;
  const savedPosition = { ...target.position };
  const savedFacing = target.attacksToTheRight;
  const centerX = soul.x + soul.width / 2;
  const centerY = soul.y + soul.height / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(179, 136, 255, 0.18)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 26 * (scale / 0.3), 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  target.position = { x: -target.width / 2, y: -target.height / 2 };
  target.attacksToTheRight = true;
  target.isAttacking = false;
  target.draw();
  ctx.restore();
  target.position = savedPosition;
  target.attacksToTheRight = savedFacing;
}

function finishJesterFinalAct() {
  const final = jesterFinal;
  const target = final.target;
  const caster = final.caster;
  final.active = false;
  target.position.x = Math.max(20, Math.min(canvas.width - 20 - target.width, final.soul.x + final.soul.width / 2 - target.width / 2));
  target.position.y = ground - target.height;
  target.velocity.x = 0;
  target.velocity.y = 0;
  caster.position.x = final.saved.casterX;
  caster.position.y = ground - caster.height;
  caster.velocity.x = 0;
  caster.velocity.y = 0;
  // the final act drains him: he's left hanging on by a thread
  caster.health = jesterFinalHealthAfter;
  clearJesterProjectiles();
  resetKeys();
  jesterWhiteFade = 50;
  playSound('jesterFinalReturn');
  updateHealthBars();
}

function drawJesterWhiteFade() {
  if (jesterWhiteFade <= 0) return;
  ctx.fillStyle = `rgba(255, 255, 255, ${jesterWhiteFade / 50})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  jesterWhiteFade -= 1;
}

function updateJesterFinalAct() {
  const final = jesterFinal;
  final.frame += 1;
  const frame = final.frame;
  const rainStart = jesterFinalIntroFrames;
  const giantStart = rainStart + jesterFinalRainFrames;
  const whiteStart = giantStart + jesterFinalGiantFrames;
  const endFrame = whiteStart + jesterFinalWhiteFrames;
  if (final.invulnerable > 0) final.invulnerable -= 1;
  final.shake *= 0.88;

  if (frame > rainStart * 0.6) moveJesterFinalSoul();

  if (frame >= rainStart && frame < giantStart - 60) updateJesterFinalPattern(frame - rainStart);

  const soul = final.soul;
  const soulCenterX = soul.x + soul.width / 2;
  const soulCenterY = soul.y + soul.height / 2;
  const floor = getJesterFinalFloor();
  final.scythes.forEach((scythe) => {
    if (scythe.warn > 0) {
      scythe.warn -= 1;
      if (scythe.warn === 0) playJesterFinalSound('jesterFinalFall', 6);
      return;
    }
    scythe.y += scythe.speed;
    scythe.x += scythe.drift + (scythe.wobble ? Math.sin(scythe.wobblePhase + scythe.y / 40) * scythe.wobble : 0);
    if (scythe.x < 30 || scythe.x > canvas.width - 30) scythe.drift *= -1;
    scythe.rotation += 0.35;
    const reach = 30 * scythe.size;
    if (Math.abs(scythe.x - soulCenterX) < reach * 0.75 + soul.width / 2 && Math.abs(scythe.y - soulCenterY) < reach * 0.6 + soul.height / 2) {
      hurtJesterFinalTarget();
    }
    if (scythe.y >= floor - 10) {
      scythe.landed = true;
      final.flashes.push({ x: scythe.x, life: 26 });
      final.shake = Math.max(final.shake, 5);
      playJesterFinalSound('jesterFinalImpact', 4);
    }
  });
  final.scythes = final.scythes.filter((scythe) => !scythe.landed);

  if (frame === giantStart) {
    final.giant = { x: soulCenterX, y: -260 };
    playSound('jesterLaugh');
  }
  if (final.giant && frame < whiteStart) {
    const giantProgress = (frame - giantStart) / jesterFinalGiantFrames;
    final.giant.x += (soulCenterX - final.giant.x) * 0.04;
    final.giant.y = -260 + Math.pow(giantProgress, 1.5) * (soulCenterY + 170);
    final.shake = Math.max(final.shake, 2 + giantProgress * 10);
    if ((frame - giantStart) % 18 === 0) playSound('jesterFinalRumble');
    if ((frame - giantStart) % 14 === 7) playSound('jesterFinalGiantSpin');
    const beatEvery = giantProgress < 0.6 ? 40 : 22;
    if ((frame - giantStart) % beatEvery === 0) playSound('jesterHeartbeat');
  }
  if (frame === whiteStart) playSound('jesterFinalWhite');
  if (frame >= endFrame) {
    finishJesterFinalAct();
    return;
  }

  // ----- drawing -----
  ctx.save();
  ctx.translate((Math.random() - 0.5) * final.shake, (Math.random() - 0.5) * final.shake);
  const introProgress = Math.min(1, frame / (rainStart * 0.6));
  drawJesterRiftStage();
  ctx.fillStyle = `rgba(0, 0, 0, ${introProgress})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);

  if (introProgress >= 1) {
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floor);
    ctx.lineTo(canvas.width, floor);
    ctx.stroke();
  }

  // Jester watches from above, laughing
  const caster = final.caster;
  const savedPosition = { ...caster.position };
  caster.position = { x: canvas.width / 2 - caster.width / 2, y: 64 + Math.sin(frame / 12) * 4 };
  caster.attacksToTheRight = true;
  caster.isAttacking = false;
  ctx.save();
  ctx.globalAlpha = 0.45 * introProgress;
  caster.draw();
  ctx.restore();
  caster.position = savedPosition;
  if (frame % 150 > 110 && frame < giantStart) {
    ctx.fillStyle = 'rgba(234, 128, 252, 0.8)';
    ctx.font = '900 20px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JA JA JA!', canvas.width / 2 + 90, 110);
  }

  final.flashes.forEach((flash) => {
    const alpha = flash.life / 26;
    const radius = 30 + (26 - flash.life) * 6;
    const glow = ctx.createRadialGradient(flash.x, floor, 0, flash.x, floor, radius);
    glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    glow.addColorStop(0.4, `rgba(234, 128, 252, ${alpha * 0.6})`);
    glow.addColorStop(1, 'rgba(234, 128, 252, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(flash.x - radius, floor - radius, radius * 2, radius * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
    ctx.fillRect(flash.x - 6, 0, 12, floor);
    flash.life -= 1;
  });
  final.flashes = final.flashes.filter((flash) => flash.life > 0);

  final.scythes.forEach((scythe) => {
    if (scythe.warn > 0) {
      const blink = Math.floor(scythe.warn / 4) % 2 === 0;
      ctx.strokeStyle = blink ? 'rgba(255, 64, 129, 0.75)' : 'rgba(255, 64, 129, 0.3)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(scythe.x, 0);
      ctx.lineTo(scythe.x, floor);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff4081';
      ctx.font = '900 22px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', scythe.x, 30);
      return;
    }
    drawJesterFinalScythe(scythe.x, scythe.y, scythe.rotation, scythe.size);
  });

  const shrink = Math.min(1, frame / 40);
  drawJesterFinalSoul(1 - shrink * 0.7);

  if (final.giant && frame < whiteStart) {
    drawJesterFinalScythe(final.giant.x, final.giant.y, Math.sin(frame / 10) * 0.3, 6.5);
  }

  if (frame < rainStart + 60) {
    const titleAlpha = frame < rainStart ? Math.min(1, frame / 30) : 1 - (frame - rainStart) / 60;
    ctx.globalAlpha = Math.max(0, titleAlpha);
    ctx.fillStyle = '#ea80fc';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 6;
    ctx.font = '900 52px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText('ACTO FINAL', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('ACTO FINAL', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '700 16px Courier New, monospace';
    ctx.fillStyle = '#fff';
    const controls = final.target === player1 ? 'W A S D' : 'FLECHAS';
    ctx.fillText(`Movete libremente con ${controls}`, canvas.width / 2, canvas.height / 2 + 16);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  if (frame >= whiteStart) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (frame - whiteStart) / 18)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startJesterChaos(attacker, target) {
  if (!canJesterAct(attacker) || attacker.jesterChaosCooldown > 0 || attacker.jesterChaosTeleports > 0) return false;
  attacker.jesterChaosTeleports = 3;
  attacker.jesterChaosTimer = 1;
  attacker.jesterChaosTarget = target;
  playSound('jesterLaugh');
  recordSpecialUsed(attacker);
  attacker.jesterChaosCooldown = getDebugCooldown(jesterChaosCooldown, attacker);
  return true;
}

function throwJesterScythe(attacker, target) {
  if (!canJesterAct(attacker) || attacker.jesterScytheCooldown > 0) return false;
  if (jesterScythes.some((scythe) => scythe.attacker === attacker)) return false;
  jesterScythes.push(new JesterScythe({ attacker, target }));
  playSound('jesterScytheThrow');
  recordSpecialUsed(attacker);
  attacker.jesterScytheCooldown = getDebugCooldown(jesterScytheCooldown, attacker);
  return true;
}

function hitWithJesterProjectile(projectile, target, damage) {
  const area = getChronoBladeCollisionArea(projectile);
  if (!rectangularCopycatShieldCollision(target, area) && !rectangularCollision({ rectangle1: area, rectangle2: target })) return false;
  if (handleCopycatShieldHit(target, projectile.attacker)) return 'blocked';
  applyDamage(projectile.attacker, target, damage, { isSpecial: true, damageType: 'chaos' });
  playSound(projectile instanceof JesterScythe ? 'jesterScytheHit' : 'jesterSuitHit');
  target.velocity.x = getDebugKnockback(getFighterCenterX(target) >= projectile.position.x ? 6 : -6, target);
  target.velocity.y = getDebugKnockback(-4, target);
  return true;
}

function drawJesterLuckSteal() {
  if (jesterLuckStealTimer <= 0 || !gameStarted || gameOver) return;
  // a leftover timer from an abandoned Jester fight must never play in another fight
  if (!isShadowJester(player2) || player1.characterType !== 'gambler') {
    jesterLuckStealTimer = 0;
    return;
  }
  jesterLuckStealTimer -= 1;
  const gambler = player1;
  const jester = player2;
  const age = jesterLuckStealDuration - jesterLuckStealTimer;
  if (age === jesterLuckStealStart) {
    playSound('jesterLaugh');
    playSound('jesterLuckSteal');
  }
  if (age === jesterLuckStealHit) {
    gambler.gamblerLuckBonus = Math.max(0, gambler.gamblerLuckBonus - jesterLuckSteal);
    playSound('jesterSuitHit');
  }
  if (age < jesterLuckStealStart) return;
  const fade = Math.min(1, jesterLuckStealTimer / 30);
  ctx.save();
  // Jester reaches for it: a purple aura grows around him
  const pull = Math.min(1, (age - jesterLuckStealStart) / 20);
  ctx.globalAlpha = 0.35 * pull * fade;
  ctx.fillStyle = '#d500f9';
  ctx.beginPath();
  ctx.ellipse(getFighterCenterX(jester), jester.position.y + jester.height / 2, jester.width * 0.9, jester.height * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // clovers and chips fly from Gambler into Shadow Jester
  for (let index = 0; index < 9; index += 1) {
    const progress = (age - jesterLuckStealStart - index * 4) / 45;
    if (progress <= 0 || progress >= 1) continue;
    const fromX = getFighterCenterX(gambler);
    const fromY = gambler.position.y + 30;
    const toX = getFighterCenterX(jester);
    const toY = jester.position.y + 40;
    const x = fromX + (toX - fromX) * progress;
    const y = fromY + (toY - fromY) * progress - Math.sin(progress * Math.PI) * 90;
    ctx.globalAlpha = 1;
    ctx.fillStyle = index % 2 ? '#fdd835' : '#66bb6a';
    ctx.font = '900 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(index % 2 ? '$' : '\u2663', x, y);
  }
  if (age >= jesterLuckStealHit) {
    const since = age - jesterLuckStealHit;
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#ea80fc';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.font = '900 26px Courier New, monospace';
    ctx.textAlign = 'center';
    const textY = gambler.position.y - 70 - Math.min(20, since / 3);
    ctx.strokeText('-50 SUERTE', getFighterCenterX(gambler), textY);
    ctx.fillText('-50 SUERTE', getFighterCenterX(gambler), textY);
    ctx.fillStyle = '#fdd835';
    ctx.font = '900 18px Courier New, monospace';
    ctx.strokeText('GRACIAS! JA JA!', getFighterCenterX(jester), jester.position.y - 24);
    ctx.fillText('GRACIAS! JA JA!', getFighterCenterX(jester), jester.position.y - 24);
  }
  ctx.restore();
}

function updateJesterEffects() {
  drawJesterLuckSteal();
  [player1, player2].forEach((fighter) => {
    if (isShadowJester(fighter) && gameStarted && !gameOver) updateJesterSecretUnlocks(fighter);
  });
  if (
    isShadowJester(player2) && botEnabled && isJesterArcadeFight() && gameStarted && !gameOver &&
    !player2.jesterTiredShown && player2.health > 0 && player2.health <= jesterTiredHealth
  ) {
    startJesterTiredScene();
    return;
  }
  [player1, player2].forEach((fighter) => {
    if (!isShadowJester(fighter) || fighter.jesterChaosTeleports <= 0 || gameOver) return;
    if (isTimeStoppedByChrono(fighter)) return;
    fighter.jesterChaosTimer -= 1;
    if (fighter.jesterChaosTimer > 0) return;
    jesterBombs.push(new JesterBomb({ x: getFighterCenterX(fighter), attacker: fighter, target: fighter.jesterChaosTarget || getOpponent(fighter) }));
    jesterAfterimages.push({ x: fighter.position.x, y: fighter.position.y, width: fighter.width, height: fighter.height, life: 30 });
    fighter.position.x = 60 + Math.random() * (canvas.width - 120 - fighter.width);
    fighter.velocity.y = -6;
    playSound('jesterTeleport');
    fighter.jesterChaosTeleports -= 1;
    fighter.jesterChaosTimer = 26;
  });

  jesterAfterimages.forEach((ghost) => {
    ghost.life -= 1;
    ctx.fillStyle = `rgba(123, 31, 162, ${ghost.life / 60})`;
    ctx.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
  });
  jesterAfterimages = jesterAfterimages.filter((ghost) => ghost.life > 0);

  jesterBombs.forEach((bomb) => {
    if (isTimeStoppedByChrono(bomb.attacker)) {
      bomb.draw();
      return;
    }
    bomb.update();
  });
  jesterBombs = jesterBombs.filter((bomb) => bomb.active);

  jesterSuits.forEach((suit) => {
    if (isTimeStoppedByChrono(suit.attacker)) {
      suit.draw();
      return;
    }
    suit.update();
    if (!suit.active || suit.delay > 0) return;
    // ring suits share a short grace window so a full ring can't land every single card
    if (suit.ringSuit && suit.target.jesterRingHitTimer > 0) return;
    if (hitWithJesterProjectile(suit, suit.target, suit.damage)) {
      suit.active = false;
      if (suit.ringSuit) suit.target.jesterRingHitTimer = jesterRingHitGrace;
    }
  });
  jesterSuits = jesterSuits.filter((suit) => suit.active);

  jesterScythes.forEach((scythe) => {
    if (isTimeStoppedByChrono(scythe.attacker)) {
      scythe.draw();
      return;
    }
    scythe.update();
    const passHit = scythe.returning ? 'hitBack' : 'hitOut';
    if (scythe.active && !scythe[passHit]) {
      const result = hitWithJesterProjectile(scythe, scythe.target, jesterScytheDamage);
      if (result === 'blocked') scythe.active = false;
      else if (result) scythe[passHit] = true;
    }
  });
  jesterScythes = jesterScythes.filter((scythe) => scythe.active);
}

function getRealityShards() {
  if (realityShards) return realityShards;
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const columns = 5;
  const rows = 3;
  const points = [];
  for (let row = 0; row <= rows; row += 1) {
    points.push([]);
    for (let column = 0; column <= columns; column += 1) {
      let x = (canvas.width / columns) * column;
      let y = (canvas.height / rows) * row;
      if (column > 0 && column < columns) x += (random() - 0.5) * 120;
      if (row > 0 && row < rows) y += (random() - 0.5) * 90;
      points[row].push([x, y]);
    }
  }
  const shards = [];
  const edges = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const polygon = [points[row][column], points[row][column + 1], points[row + 1][column + 1], points[row + 1][column]];
      const centerX = polygon.reduce((sum, point) => sum + point[0], 0) / 4;
      const centerY = polygon.reduce((sum, point) => sum + point[1], 0) / 4;
      const awayX = centerX - canvas.width / 2;
      const awayY = centerY - canvas.height / 2;
      const length = Math.max(1, Math.hypot(awayX, awayY));
      const strength = 10 + random() * 16;
      shards.push({
        polygon,
        centerX,
        centerY,
        driftX: (awayX / length) * strength,
        driftY: (awayY / length) * strength * (row === rows - 1 ? 0.25 : 1),
        rotation: (random() - 0.5) * 0.08,
        seed: random() * 10,
      });
      polygon.forEach((point, index) => {
        const next = polygon[(index + 1) % 4];
        const onBorder = (point[0] === next[0] && (point[0] === 0 || point[0] === canvas.width)) || (point[1] === next[1] && (point[1] === 0 || point[1] === canvas.height));
        if (!onBorder) edges.push([point, next]);
      });
    }
  }
  const impactX = canvas.width * 0.68;
  const impactY = canvas.height * 0.45;
  edges.sort((a, b) => Math.hypot((a[0][0] + a[1][0]) / 2 - impactX, (a[0][1] + a[1][1]) / 2 - impactY) - Math.hypot((b[0][0] + b[1][0]) / 2 - impactX, (b[0][1] + b[1][1]) / 2 - impactY));
  realityShards = { shards, edges };
  return realityShards;
}

function applyRealityFracture(progress, shatter = 0, drawBehind = null) {
  if (progress <= 0) return;
  const { shards, edges } = getRealityShards();
  if (!fractureCanvas) {
    fractureCanvas = document.createElement('canvas');
    fractureCanvas.width = canvas.width;
    fractureCanvas.height = canvas.height;
  }
  const fractureContext = fractureCanvas.getContext('2d');
  fractureContext.clearRect(0, 0, canvas.width, canvas.height);
  fractureContext.drawImage(canvas, 0, 0);
  const time = performance.now() / 1000;
  if (drawBehind) {
    drawBehind();
  } else {
    const voidGradient = ctx.createRadialGradient(canvas.width * 0.68, canvas.height * 0.45, 20, canvas.width * 0.68, canvas.height * 0.45, canvas.width);
    voidGradient.addColorStop(0, '#2a0845');
    voidGradient.addColorStop(1, '#05010a');
    ctx.fillStyle = voidGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(206, 147, 216, 0.8)';
    for (let star = 0; star < 30; star += 1) {
      const twinkle = (Math.sin(time * 3 + star) + 1) / 2;
      ctx.globalAlpha = twinkle;
      ctx.fillRect((star * 97) % canvas.width, (star * 53) % canvas.height, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  const shardProgress = Math.min(1, progress * 1.1);
  shards.forEach((shard) => {
    const bob = Math.sin(time * 1.4 + shard.seed) * 3 * shardProgress;
    const offsetX = shard.driftX * shardProgress * (1 + shatter * 22);
    const offsetY = shard.driftY * shardProgress + bob + shatter * shatter * (700 + shard.seed * 60);
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - shatter * 1.1);
    ctx.translate(shard.centerX + offsetX, shard.centerY + offsetY);
    ctx.rotate(shard.rotation * shardProgress + shatter * (shard.seed - 5) * 0.35);
    ctx.translate(-shard.centerX, -shard.centerY);
    ctx.beginPath();
    shard.polygon.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(fractureCanvas, 0, 0);
    ctx.restore();
  });

  if (shatter > 0) return;
  const visibleEdges = Math.ceil(edges.length * progress);
  ctx.save();
  ctx.lineCap = 'round';
  edges.slice(0, visibleEdges).forEach(([from, to]) => {
    ctx.strokeStyle = 'rgba(213, 0, 249, 0.35)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(234, 128, 252, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  ctx.restore();
}

function drawJesterRiftStage() {
  drawJesterVoidStage();
}

// Ciudad Cobalto after the fight: bent by Jester's deformations, with rubble and cracks left behind.
function drawCobaltAftermathStage() {
  gamblerCityCorruptionOverride = 0.45;
  drawGamblerArcadeStage();
  gamblerCityCorruptionOverride = null;
  const time = performance.now() / 1000;
  ctx.save();
  // cracks in the sky, like the ones from the rift
  ctx.strokeStyle = 'rgba(234, 128, 252, 0.35)';
  ctx.lineWidth = 3;
  [[[120, 0], [180, 70], [150, 140], [230, 210]], [[780, 0], [740, 60], [800, 120], [770, 190]], [[470, 0], [520, 40], [500, 90]]].forEach((crack) => {
    ctx.beginPath();
    crack.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  });
  // floating debris that never came back down
  [[300, 170, 26], [640, 140, 18], [880, 230, 22], [90, 250, 16]].forEach(([x, y, size], index) => {
    const bob = Math.sin(time * 1.2 + index) * 6;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.rotate(time * 0.3 + index);
    ctx.fillStyle = '#1a2440';
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.7);
    ctx.strokeStyle = 'rgba(130, 177, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-size / 2, -size / 2, size, size * 0.7);
    ctx.restore();
  });
  // rubble piles and cracked street
  [[70, 60], [250, 40], [560, 70], [900, 55]].forEach(([x, width]) => {
    ctx.fillStyle = '#141b30';
    ctx.beginPath();
    ctx.moveTo(x - width, ground);
    ctx.lineTo(x - width * 0.4, ground - 18);
    ctx.lineTo(x, ground - 28);
    ctx.lineTo(x + width * 0.5, ground - 14);
    ctx.lineTo(x + width, ground);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2a3658';
    ctx.fillRect(x - 10, ground - 22, 14, 8);
    ctx.fillRect(x + 8, ground - 14, 10, 6);
  });
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(360, ground);
  ctx.lineTo(390, ground + 20);
  ctx.lineTo(372, ground + 38);
  ctx.moveTo(700, ground);
  ctx.lineTo(680, ground + 26);
  ctx.stroke();
  // lingering smoke
  for (let puff = 0; puff < 5; puff += 1) {
    const rise = (time * 18 + puff * 40) % 200;
    ctx.fillStyle = `rgba(120, 130, 160, ${0.18 * (1 - rise / 200)})`;
    ctx.beginPath();
    ctx.arc(250 + puff * 3 + Math.sin(time + puff) * 8, ground - 30 - rise, 14 + rise / 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJesterVoidDisc(x, y, radius, tilt, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, tilt);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = '#2979ff';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#0d1b4d';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#448aff';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(130, 177, 255, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.66, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.33, 0, Math.PI * 2);
  ctx.stroke();
  ctx.rotate(angle);
  const spokes = 8;
  for (let spoke = 0; spoke < spokes; spoke += 1) {
    const spokeAngle = (spoke / spokes) * Math.PI * 2;
    ctx.strokeStyle = spoke % 2 ? 'rgba(68, 138, 255, 0.5)' : 'rgba(0, 229, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(Math.cos(spokeAngle) * radius * 0.33, Math.sin(spokeAngle) * radius * 0.33);
    ctx.lineTo(Math.cos(spokeAngle) * radius, Math.sin(spokeAngle) * radius);
    ctx.stroke();
    ctx.fillStyle = '#82b1ff';
    ctx.beginPath();
    ctx.arc(Math.cos(spokeAngle + 0.4) * radius * 0.83, Math.sin(spokeAngle + 0.4) * radius * 0.83, radius * 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJesterVoidStage() {
  const time = performance.now() / 1000;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let star = 0; star < 40; star += 1) {
    const twinkle = (Math.sin(time * 2 + star * 1.7) + 1) / 2;
    ctx.fillStyle = `rgba(130, 177, 255, ${0.15 + twinkle * 0.5})`;
    ctx.fillRect((star * 131) % canvas.width, (star * 71) % 440, 2, 2);
  }

  const floaters = [
    { x: 150, y: 150, r: 70, speed: 0.6, orbit: 18 },
    { x: 860, y: 120, r: 90, speed: -0.45, orbit: 24 },
    { x: 510, y: 70, r: 46, speed: 1.1, orbit: 12 },
    { x: 320, y: 310, r: 54, speed: -0.9, orbit: 16 },
    { x: 720, y: 300, r: 62, speed: 0.75, orbit: 20 },
    { x: 960, y: 360, r: 38, speed: 1.3, orbit: 10 },
    { x: 60, y: 380, r: 44, speed: -1.2, orbit: 14 },
  ];
  floaters.forEach((disc, index) => {
    const x = disc.x + Math.cos(time * 0.5 + index) * disc.orbit;
    const y = disc.y + Math.sin(time * 0.7 + index * 2) * disc.orbit;
    const tilt = 0.35 + Math.abs(Math.sin(time * 0.4 + index)) * 0.4;
    drawJesterVoidDisc(x, y, disc.r, tilt, time * disc.speed, 0.55);
  });

  // main circular arena the fighters stand on
  drawJesterVoidDisc(canvas.width / 2, ground + 22, 520, 0.09, time * 0.35, 1);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
  ctx.fillRect(0, ground - 2, canvas.width, 3);

  // faint suit symbols drifting in the dark
  ctx.save();
  ctx.font = '900 26px Arial';
  ctx.textAlign = 'center';
  ['\u2660', '\u2665', '\u2666', '\u2663'].forEach((suit, index) => {
    const x = (index * 283 + time * 30 * (index % 2 ? 1 : -1)) % (canvas.width + 60);
    const wrappedX = x < -30 ? x + canvas.width + 60 : x;
    ctx.fillStyle = `rgba(68, 138, 255, ${0.18 + 0.1 * Math.sin(time + index)})`;
    ctx.fillText(suit, wrappedX, 220 + Math.sin(time * 0.8 + index) * 90);
  });
  ctx.restore();
}

function startJesterIntro() {
  jesterIntroDone = true;
  stopJesterTracks();
  loadJesterDialogBuffer();
  Object.assign(jesterIntro, { active: true, phase: 'idle', frame: 0, progress: 0, shake: 0 });
  document.body.classList.add('arcade-cutscene');
  player2.position.x = canvas.width + 400;
}

function updateJesterIntro() {
  const intro = jesterIntro;
  intro.frame += 1;
  updateMovements();
  player1.update();

  if (intro.phase === 'idle' && intro.frame >= jesterIntroIdleFrames) {
    intro.phase = 'fracture';
    intro.frame = 0;
    intro.progress = 0.12;
    intro.shake = 14;
    playSound('realityCrack');
  } else if (intro.phase === 'fracture') {
    if (intro.frame % 42 === 0) {
      intro.progress = Math.min(1, intro.progress + 0.15);
      intro.shake = 10 + intro.progress * 8;
      playSound('realityCrack');
    }
    if (intro.progress >= 1 && intro.frame % 42 === 30) {
      intro.phase = 'shatter';
      intro.frame = 0;
      intro.shake = 26;
      playSound('realityShatter');
    }
  } else if (intro.phase === 'shatter' && intro.frame >= 60) {
    intro.phase = 'reveal';
    intro.frame = 0;
  } else if (intro.phase === 'reveal') {
    if (intro.frame === 50) playSound('jesterLaugh');
    if (intro.frame === 40) playJesterTrack('dialog');
    if (intro.frame >= 130) {
      intro.active = false;
      startJesterCutscene();
      return;
    }
  }
  intro.shake *= intro.phase === 'shatter' ? 0.95 : 0.9;

  const jesterX = 760 - player2.width / 2;
  const drawWaitingJester = () => {
    player2.position.x = jesterX;
    player2.position.y = ground - player2.height - Math.abs(Math.sin(performance.now() / 260)) * 4;
    player2.attacksToTheRight = false;
    player2.isAttacking = false;
    player2.draw();
  };

  ctx.save();
  ctx.translate((Math.random() - 0.5) * intro.shake, (Math.random() - 0.5) * intro.shake);
  if (intro.phase === 'shatter') {
    drawGamblerArcadeStage();
    applyRealityFracture(1, Math.min(1, intro.frame / 55), () => {
      drawJesterVoidStage();
      drawWaitingJester();
    });
  } else if (intro.phase === 'reveal') {
    drawJesterVoidStage();
    drawWaitingJester();
  } else {
    drawGamblerArcadeStage();
    if (intro.phase !== 'idle') applyRealityFracture(intro.progress);
  }

  // Gambler reacts: trembling once the world starts cracking
  const fear = intro.phase === 'idle' ? 0 : intro.phase === 'fracture' ? 1 + intro.progress * 1.5 : 3;
  const realX = player1.position.x;
  player1.position.x += (Math.random() - 0.5) * fear * 2;
  player1.draw();
  if (fear > 0) drawScaredSweat(player1, fear);
  player1.position.x = realX;
  let emote = null;
  if (intro.phase === 'fracture' && intro.frame < 50 && intro.progress <= 0.12) emote = { symbol: '!', timer: 70 - intro.frame };
  else if (intro.phase === 'fracture' && intro.progress >= 0.5 && intro.progress < 0.7) emote = { symbol: '?!', timer: 40 };
  else if (intro.phase === 'shatter') emote = { symbol: '!!', timer: Math.max(1, 70 - intro.frame) };
  else if (intro.phase === 'reveal' && intro.frame < 60) emote = { symbol: '...', timer: 40 };
  if (emote) drawCutsceneEmote(player1, emote.symbol, emote.timer);

  if (intro.phase === 'reveal' && intro.frame > 50) {
    ctx.fillStyle = '#82b1ff';
    ctx.font = '900 28px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JA JA JA JA!', jesterX + player2.width / 2 + Math.sin(intro.frame / 3) * 6, ground - player2.height - 30);
  }
  ctx.restore();

  if (intro.phase === 'shatter' && intro.frame < 14) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.85 - intro.frame / 16})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (intro.phase === 'reveal' && intro.frame < 30) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.6 - intro.frame / 50})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startJesterCutscene() {
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'jester',
    lines: jesterCutsceneLines,
    phase: 'dialog',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: player1.position.x,
    gamblerTargetX: Math.min(player1.position.x, 460),
    gamblerHop: 0,
    scammerX: 760 - player2.width / 2,
    scammerY: 0,
    scammerTargetX: 700,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
  });
  playJesterTrack('dialog');
  startCutsceneLine(0);
}

function isIcedThug(fighter) {
  return hasSecretVariant(fighter, 'icedThug');
}

function isArcadeBossFighter(fighter) {
  return Boolean(fighter && arcadeBossVariants.includes(fighter.secretVariant));
}

function getArcadeBossVariantHealth(fighter) {
  if (!fighter) return 100;
  if (fighter.secretVariant === 'arcadeBoss') return normalArcadeBossHealth;
  if (fighter.secretVariant === 'icedThug') return fireArcadeMiniBossHealth;
  if (fighter.secretVariant === 'iceMaster') return iceMasterHealth;
  if (fighter.secretVariant === 'scammer') return scammerHealth;
  if (fighter.secretVariant === 'shadowJester') return shadowJesterHealth;
  return 100;
}

function unlockArcadeBosses() {
  arcadeBossesUnlocked = true;
  arcadeBossCharacterButtons.forEach((button) => button.classList.remove('hidden'));
  arcadeMapButtons.forEach((button) => button.classList.remove('hidden'));
}

function lockArcadeBosses() {
  arcadeBossesUnlocked = false;
  arcadeBossCharacterButtons.forEach((button) => button.classList.add('hidden'));
  arcadeMapButtons.forEach((button) => button.classList.add('hidden'));
  if (!normalArcadeActive && ['normalArcade', 'fireArcade', 'gamblerArcade', 'gamblerAlley', 'jesterRift', 'cobaltAftermath'].includes(selectedMap)) {
    selectedMap = 'foundry';
  }
}

function isIceMaster(fighter) {
  return Boolean(fighter && fighter.characterType === 'fireMaster' && fighter.secretVariant === 'iceMaster');
}

function applyIceMasterSlow(attacker, target, duration) {
  if (!isIceMaster(attacker) || !target) return;
  target.icedSlowTimer = Math.max(target.icedSlowTimer, getDebugDuration(duration, target));
}

function launchIcedThugBlade(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!isIcedThug(attacker) || attacker.icedThugBladeCooldown > 0 || gameOver) return false;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 38;
  const startY = attacker.position.y + attacker.height / 2 - 8;

  icedThugBlades.push(new IcedThugBlade({ x: startX, y: startY, target, attacker }));
  playSound('sorcererOrb');
  recordSpecialUsed(attacker);
  attacker.icedThugBladeCooldown = getDebugCooldown(icedThugBladeCooldown, attacker);
  return true;
}

function activateIcedThugFrostField(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (!isIcedThug(attacker) || attacker.icedThugFrostFieldCooldown > 0 || gameOver) return false;

  icedThugFrostFields.push(new IcedThugFrostField({ attacker, target }));
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.icedThugFrostFieldCooldown = getDebugCooldown(icedThugFrostFieldCooldown, attacker);
  return true;
}

function launchChronoBlade(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'chrono' || attacker.chronoBladeCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 42;
  const startY = attacker.position.y + attacker.height / 2 - 7;

  chronoBlades.push(new ChronoBlade({ x: startX, y: startY, target, attacker }));
  playSound('sorcererOrb');
  recordSpecialUsed(attacker);
  attacker.chronoBladeCooldown = getDebugCooldown(chronoBladeCooldown, attacker);
}

function activateChronoSlow(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'chrono' || attacker.chronoSlowCooldown > 0 || gameOver) return;

  chronoZones.push(new ChronoZone({ attacker, target }));
  detonateChronoMark(attacker, target);
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.chronoSlowCooldown = getDebugCooldown(chronoSlowCooldown, attacker);
}

function detonateChronoMark(attacker, target) {
  if (!target || target.chronoMarkedBy !== attacker || target.chronoMarkTimer <= 0) return;

  const actualDamage = applyDamage(attacker, target, chronoMarkDamage, { isSpecial: true, damageType: 'temporalMark' });
  if (actualDamage > 0) {
    target.velocity.x = getDebugKnockback(target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 12 : -12, target);
    target.velocity.y = getDebugKnockback(-9, target);
  }
  target.chronoMarkTimer = 0;
  target.chronoMarkedBy = null;
}

function activateChronoTimeStop(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (attacker.characterType !== 'chrono' || attacker.chronoTimeStopCooldown > 0 || gameOver) return false;

  target.chronoTimeStopTimer = Math.max(target.chronoTimeStopTimer, getDebugDuration(chronoTimeStopDuration, target));
  target.velocity.x = 0;
  target.velocity.y = 0;
  target.isAttacking = false;
  target.attackTimer = 0;
  attacker.chronoTimeStopCooldown = getDebugCooldown(chronoTimeStopCooldown, attacker);
  attacker.chronoBladeCooldown = Math.max(attacker.chronoBladeCooldown, getDebugCooldown(chronoBladeCooldown, attacker));
  attacker.chronoSlowCooldown = Math.max(attacker.chronoSlowCooldown, getDebugCooldown(chronoSlowCooldown, attacker));
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  return true;
}

function activateGhostPhase(attacker) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'ghost' ||
    attacker.ghostPhaseCooldown > 0 ||
    attacker.ghostPhaseTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.ghostPhaseTimer = getDebugDuration(ghostPhaseDuration, attacker);
  attacker.ghostPhaseCooldown = attacker.ghostPhaseTimer + getDebugCooldown(ghostPhaseCooldown, attacker);
  attacker.ghostPhaseContactTimer = 0;
  recordSpecialUsed(attacker);
  playSound('reflectShield');
  return true;
}

function activateDivineAdaptation(attacker, ignoreCharacterType = false) {
  if (!canFighterAct(attacker)) return false;
  if (
    (!ignoreCharacterType && attacker.characterType !== 'divineGeneral') ||
    attacker.divineAdaptCooldown > 0 ||
    attacker.divineAdaptTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.divineAdaptTimer = getDebugDuration(divineGeneralAdaptDuration, attacker);
  attacker.divineAdaptCooldown = attacker.divineAdaptTimer + getDivineAdaptCooldownMax(attacker);
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  recordSpecialUsed(attacker);
  playSound('reflectShield');
  return true;
}

function tryActivateDivineCharacterCounter(attacker, target, direction) {
  const fireStacks = getDivineAdaptationStacksByFamily(attacker, 'fire');
  const shellStacks = getDivineAdaptationStacksByFamily(attacker, 'shell');
  const ballisticStacks = getDivineAdaptationStacksByFamily(attacker, 'ballistic');
  const prismStacks = getDivineAdaptationStacksByFamily(attacker, 'prism');
  const arcaneStacks = getDivineAdaptationStacksByFamily(attacker, 'arcane');
  const luckStacks = getDivineAdaptationStacksByFamily(attacker, 'luck');

  if (target.characterType === 'fireMaster' && fireStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, fireStacks);
    const damage = 18 + stacks * 5;
    const heal = 8 + stacks * 3;
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineFireJudgment' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + heal);
    target.specialCooldown = Math.max(target.specialCooldown, getDebugCooldown(180, target));
    target.fireBeamCooldown = Math.max(target.fireBeamCooldown, getDebugCooldown(220, target));
    target.velocity.x = getDebugKnockback(direction * (12 + stacks), target);
    target.velocity.y = getDebugKnockback(-8 - stacks, target);
    playSound('fireball');
    return true;
  }

  if (target.characterType === 'tank' && shellStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, shellStacks);
    const damage = 16 + stacks * 4;
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineArmorBreak' });
    target.tankShellCooldown = Math.max(target.tankShellCooldown, getDebugCooldown(260, target));
    target.tankAttackCooldown = Math.max(target.tankAttackCooldown, 38 + stacks * 4);
    target.velocity.x = getDebugKnockback(direction * (18 + stacks * 2), target);
    target.velocity.y = getDebugKnockback(-10, target);
    attacker.velocity.x = -direction * 8 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('tankShell');
    return true;
  }

  if (target.characterType === 'cowboy' && ballisticStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, ballisticStacks);
    const damage = 14 + stacks * 4;
    target.cowboyBurstShotsRemaining = 0;
    target.cowboyBurstCooldown = Math.max(target.cowboyBurstCooldown, getDebugCooldown(240, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineBulletReturn' });
    target.velocity.x = getDebugKnockback(direction * (16 + stacks), target);
    target.velocity.y = getDebugKnockback(-5 - Math.floor(stacks / 2), target);
    attacker.velocity.x = -direction * 10 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('cowboyBurst');
    return true;
  }

  if (target.characterType === 'switcher' && prismStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, prismStacks);
    const damage = 13 + stacks * 4;
    target.switcherDashTimer = 0;
    target.switcherRedStrikeTimer = 0;
    target.switcherRedStrikeArea = null;
    target.switcherArmorTimer = 0;
    target.setMaxHealth(switcherHealth);
    target.switcherAbilityCooldown = Math.max(target.switcherAbilityCooldown, getDebugCooldown(220 + stacks * 18, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divinePrismLock' });
    attacker.velocity.x = -direction * (10 + stacks) * getDebugMultiplier('moveMultiplier', attacker);
    target.velocity.x = getDebugKnockback(direction * (14 + stacks), target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('switcher');
    return true;
  }

  if (target.characterType === 'sorcerer' && arcaneStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, arcaneStacks);
    const damage = 15 + stacks * 4;
    target.sorcererOrbCooldown = Math.max(target.sorcererOrbCooldown, getDebugCooldown(240 + stacks * 20, target));
    target.sorcererGravityCooldown = Math.max(target.sorcererGravityCooldown, getDebugCooldown(280 + stacks * 24, target));
    target.sorcererSecretOrbCooldown = Math.max(target.sorcererSecretOrbCooldown, getDebugCooldown(320 + stacks * 30, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineArcaneSeal' });
    target.velocity.x = getDebugKnockback(direction * (9 + stacks), target);
    target.velocity.y = getDebugKnockback(-12 - stacks, target);
    playSound('sorcererOrb');
    return true;
  }

  if (target.characterType === 'gambler' && luckStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, luckStacks);
    const damage = 12 + stacks * 4;
    target.gamblerLuckBonus = Math.max(0, (target.gamblerLuckBonus || 0) - (0.12 + stacks * 0.04));
    target.gamblerRollCooldown = Math.max(target.gamblerRollCooldown, getDebugCooldown(180 + stacks * 18, target));
    target.gamblerLuckCooldown = Math.max(target.gamblerLuckCooldown, getDebugCooldown(220 + stacks * 20, target));
    target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(36 + stacks * 8, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineLuckBreak' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 5 + stacks * 2);
    target.velocity.x = getDebugKnockback(direction * (8 + stacks), target);
    target.velocity.y = getDebugKnockback(-5, target);
    playSound('gambler');
    return true;
  }

  return false;
}

function activateDivineCounter(attacker, target, ignoreCharacterType = false) {
  if (!canFighterAct(attacker)) return false;
  if (
    (!ignoreCharacterType && attacker.characterType !== 'divineGeneral') ||
    attacker.divineCounterCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const distance = Math.abs(attackerCenterX - targetCenterX);
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const counterType = getDivineCounterType(attacker, target);
  const counterFamily = getDivineCounterFamily(counterType);
  const adaptedStacks = getDominantDivineAdaptation(attacker)?.stacks || 0;
  const damageBonus = Math.min(10, adaptedStacks * 2);

  attacker.divineCounterCooldown = getDivineCounterCooldownMax(attacker);
  attacker.attacksToTheRight = direction > 0;
  recordSpecialUsed(attacker);

  if (distance > divineGeneralCounterRange) {
    attacker.velocity.x = direction * 18 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('switcher');
    return true;
  }

  if (tryActivateDivineCharacterCounter(attacker, target, direction)) return true;

  if (counterFamily === 'temporal') {
    attacker.chronoTimeStopTimer = 0;
    target.chronoTimeStopTimer = Math.max(target.chronoTimeStopTimer, getDebugDuration(45 + adaptedStacks * 8, target));
    target.velocity.x = 0;
    target.velocity.y = 0;
    applyDamage(attacker, target, 10 + damageBonus, { isSpecial: true, damageType: 'divineTemporal' });
    playSound('gravityOrb');
    return true;
  }

  if (counterFamily === 'luck') {
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 8 + adaptedStacks);
    target.gamblerLuckBonus = Math.max(0, (target.gamblerLuckBonus || 0) - 0.2);
    applyDamage(attacker, target, 11 + damageBonus, { isSpecial: true, damageType: 'divineLuck' });
    target.velocity.x = getDebugKnockback(direction * 8, target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('gambler');
    return true;
  }

  if (counterFamily === 'spirit') {
    target.ghostPhaseTimer = 0;
    target.ghostPhaseContactTimer = 0;
    applyDamage(attacker, target, 13 + damageBonus, { isSpecial: true, damageType: 'divineSpirit', ignoreInvincible: true });
    target.velocity.x = getDebugKnockback(direction * 11, target);
    target.velocity.y = getDebugKnockback(-7, target);
    playSound('reflectShield');
    return true;
  }

  if (counterFamily === 'fire') {
    applyDamage(attacker, target, 18 + damageBonus, { isSpecial: true, damageType: 'divineFire' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 6 + adaptedStacks);
    target.velocity.x = getDebugKnockback(direction * 13, target);
    target.velocity.y = getDebugKnockback(-9, target);
    playSound('fireball');
    return true;
  }

  if (counterFamily === 'ballistic') {
    applyDamage(attacker, target, 16 + damageBonus, { isSpecial: true, damageType: 'divineBallistic' });
    target.cowboyBurstShotsRemaining = 0;
    target.velocity.x = getDebugKnockback(direction * 15, target);
    target.velocity.y = getDebugKnockback(-5, target);
    playSound('cowboyBurst');
    return true;
  }

  if (counterFamily === 'shell') {
    applyDamage(attacker, target, 15 + damageBonus, { isSpecial: true, damageType: 'divineShell' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 10 + adaptedStacks);
    target.velocity.x = getDebugKnockback(direction * 17, target);
    target.velocity.y = getDebugKnockback(-8, target);
    playSound('tankShell');
    return true;
  }

  if (counterFamily === 'arcane') {
    applyDamage(attacker, target, 14 + damageBonus, { isSpecial: true, damageType: 'divineArcane' });
    target.velocity.x = getDebugKnockback(direction * 9, target);
    target.velocity.y = getDebugKnockback(-14, target);
    playSound('sorcererOrb');
    return true;
  }

  if (counterFamily === 'prism') {
    applyDamage(attacker, target, 15 + damageBonus, { isSpecial: true, damageType: 'divinePrism' });
    attacker.velocity.x = -direction * 12 * getDebugMultiplier('moveMultiplier', attacker);
    target.velocity.x = getDebugKnockback(direction * 14, target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('switcher');
    return true;
  }

  applyDamage(attacker, target, 20 + damageBonus, { isSpecial: true, damageType: 'divineMelee' });
  target.velocity.x = getDebugKnockback(direction * 14, target);
  target.velocity.y = getDebugKnockback(-8, target);
  playSound('reflectShield');
  return true;
}

function activateDivineWorldCut(attacker, target, ignoreCharacterType = false) {
  if (!canFighterAct(attacker)) return false;
  if (
    (!ignoreCharacterType && attacker.characterType !== 'divineGeneral') ||
    attacker.divineWorldCutCooldown > 0 ||
    attacker.divineAdaptTimer > 0 ||
    getDivineTotalAdaptationStacks(attacker) <= 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.divineWorldCutCooldown = getDebugCooldown(divineWorldCutCooldown, attacker);
  attacker.divineAdaptCooldown = Math.max(attacker.divineAdaptCooldown, attacker.divineWorldCutCooldown);
  attacker.divineCounterCooldown = Math.max(attacker.divineCounterCooldown, attacker.divineWorldCutCooldown);
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  divineWorldCutCharges.push(new DivineWorldCutCharge({ attacker, target }));
  recordSpecialUsed(attacker);
  playSound('gravityOrb');
  return true;
}

function handleDivineSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'divineGeneral') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      activateDivineWorldCut(attacker, target);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'divineGeneral', () => {
    if (specialType === 'adapt') {
      activateDivineAdaptation(attacker);
    } else {
      activateDivineCounter(attacker, target);
    }
  });
  return true;
}

function handleFireMasterSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'fireMaster') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      if (isSuperFireMaster(attacker)) {
        activateSuperFireKamehameha(attacker, target);
      } else {
        launchInfernoSplit(attacker, target);
      }
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'fireMaster', () => {
    if (specialType === 'fireball') {
      launchFireball(attacker, target);
    } else {
      launchFireBeam(attacker, target);
    }
  });
  return true;
}

function handleChronoSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'chrono') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      activateChronoTimeStop(attacker, target);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'chrono', () => {
    if (specialType === 'blade') {
      launchChronoBlade(attacker, target);
    } else {
      activateChronoSlow(attacker, target);
    }
  });
  return true;
}


// Chapter 4 robots are defective: every few seconds they glitch and freeze for a moment.
function isFactoryRobot(fighter) {
  return Boolean(fighter && hybridEnemyTypes[fighter.secretVariant] && hybridEnemyTypes[fighter.secretVariant].robot);
}

function resetFactoryRobotGlitch(fighter) {
  const robot = hybridEnemyTypes[fighter.secretVariant];
  const [minFrames, maxFrames] = robot.glitchEvery;
  fighter.robotGlitchCooldown = minFrames + Math.floor(Math.random() * (maxFrames - minFrames));
  fighter.robotGlitchTimer = 0;
}

function hitWithRobotShot(shot, target, damage) {
  const area = getChronoBladeCollisionArea(shot);
  if (!rectangularCopycatShieldCollision(target, area) && !rectangularCollision({ rectangle1: area, rectangle2: target })) return false;
  if (handleCopycatShieldHit(target, shot.attacker)) return 'blocked';
  applyDamage(shot.attacker, target, damage, { isSpecial: true, damageType: shot.kind === 'discharge' ? 'electric' : 'robot' });
  target.velocity.x = getDebugKnockback(getFighterCenterX(target) >= shot.position.x ? 5 : -5, target);
  target.velocity.y = getDebugKnockback(-4, target);
  playSound(shot.kind === 'discharge' ? 'robotDischarge' : 'robotHit');
  return true;
}

function updateRobotShots() {
  robotShots.forEach((shot) => {
    shot.update();
    if (!shot.active || gameOver) return;
    const target = shot.target;
    if (shot.kind === 'tickBomb') {
      if (shot.exploded > 0 || shot.timer > 0) return;
      shot.exploded = 18;
      playSound('robotBoom');
      const distance = Math.abs(getFighterCenterX(target) - (shot.position.x + shot.width / 2));
      const onFloor = target.position.y + target.height >= ground - 60;
      if (distance < 90 && onFloor && !handleCopycatShieldHit(target, shot.attacker)) {
        applyDamage(shot.attacker, target, robotTickBombDamage, { isSpecial: true, damageType: 'robot' });
        target.velocity.y = getDebugKnockback(-9, target);
      }
      return;
    }
    const damage = shot.kind === 'discharge' ? robotDischargeDamage : shot.kind === 'rivet' ? robotRivetDamage : robotScrapDamage;
    const result = hitWithRobotShot(shot, target, damage);
    if (result) shot.active = false;
    if (result === true && shot.kind === 'discharge') target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 16);
  });
  robotShots = robotShots.filter((shot) => shot.active);
}

function updateFactoryRobots() {
  if (gameOver || !gameStarted) return;
  updateRobotShots();
  [player1, player2].forEach((fighter) => {
    if (!isFactoryRobot(fighter) || fighter.health <= 0) return;
    const robot = hybridEnemyTypes[fighter.secretVariant];
    // T-0 remembers where it was (and how much health it had) 3 seconds ago so it can rewind there
    fighter.robotHistory = fighter.robotHistory || [];
    fighter.robotHistory.push({ x: fighter.position.x, y: fighter.position.y, health: fighter.health });
    if (fighter.robotHistory.length > 180) fighter.robotHistory.shift();
    if (fighter.robotRewindFlash > 0) fighter.robotRewindFlash -= 1;
    if (fighter.robotSlamFlash > 0) fighter.robotSlamFlash -= 1;
    // the guard's shield charge: it rushes forward and rams whoever is in the way
    if (fighter.robotChargeTimer > 0) {
      fighter.robotChargeTimer -= 1;
      fighter.gamblerStunTimer = 0;
      fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + fighter.robotChargeDirection * robotChargeSpeed));
      const opponent = getOpponent(fighter);
      if (!fighter.robotChargeHit && rectangularCollision({ rectangle1: { x: fighter.position.x - 6, y: fighter.position.y, width: fighter.width + 12, height: fighter.height }, rectangle2: opponent })) {
        fighter.robotChargeHit = true;
        fighter.robotChargeTimer = 0;
        if (!handleCopycatShieldHit(opponent, fighter)) {
          applyDamage(fighter, opponent, robotChargeDamage, { isSpecial: true, damageType: 'robot' });
          opponent.velocity.x = getDebugKnockback(fighter.robotChargeDirection * 13, opponent);
          opponent.velocity.y = getDebugKnockback(-7, opponent);
          opponent.gamblerStunTimer = Math.max(opponent.gamblerStunTimer, 22);
        }
        playSound('robotHit');
        playKick({ volume: 0.26 });
      }
    }
    // the assembler's magnet drags the opponent towards its claw
    if (fighter.robotMagnetTimer > 0) {
      fighter.robotMagnetTimer -= 1;
      const opponent = getOpponent(fighter);
      const pull = getFighterCenterX(fighter) - getFighterCenterX(opponent);
      if (Math.abs(pull) > fighter.width / 2 + opponent.width / 2 + 10) opponent.position.x += Math.sign(pull) * 3.2;
    }
    if (fighter.robotGlitchTimer > 0) {
      fighter.robotGlitchTimer -= 1;
      return;
    }
    if (typeof fighter.robotGlitchCooldown !== 'number') resetFactoryRobotGlitch(fighter);
    fighter.robotGlitchCooldown -= 1;
    if (fighter.robotGlitchCooldown <= 0) {
      resetFactoryRobotGlitch(fighter);
      fighter.robotGlitchTimer = robot.glitchFrames;
      fighter.gamblerStunTimer = Math.max(fighter.gamblerStunTimer, robot.glitchFrames);
      fighter.velocity.x = 0;
      fighter.isAttacking = false;
      playSound('robotGlitch');
    }
  });
}
