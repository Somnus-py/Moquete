// Moquete - Bucle principal, HUD, habilidades y Shadow Jester
// (parte 9 de 10; los archivos se cargan en orden desde index.html)

function animate() {
  animationId = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateReflecterBattleMusic();
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
  if (omegariusFinal.active) {
    updateOmegariusFinalAct();
    return;
  }
  if (scamFinal.active) {
    updateScamFinalAct();
    return;
  }
  if (dodgeRound.active) {
    updateDodgeRound();
    return;
  }
  if (farolClimb.active) {
    updateFarolClimb();
    return;
  }
  if (omegaKickFight.active && (omegaKickFight.stage === 'clash' || omegaKickFight.stage === 'clashWin')) {
    updateOmegaClash();
    return;
  }
  if (riftClash.active) {
    updateRiftClash();
    return;
  }
  updateLightBoxAttacks();
  updateOmegaKickFight();
  if (isRiftFight() && !player2.riftFinalStarted && gameStarted && !gameOver && !arcadeCutscene.active && player2.health <= riftFinalHealth) {
    startKnightRiftAngry();
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
    if (tryOmegariusParry(player2, player1)) {
      player1.isAttacking = false;
      player1.lightWarriorRadiantPunchAttackActive = false;
      return;
    }
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
    if (tryOmegariusParry(player1, player2)) {
      player2.isAttacking = false;
      player2.lightWarriorRadiantPunchAttackActive = false;
      return;
    }
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
  drawChronoRewindFx();
  drawSheriffLastStandFx();
  drawSpiritOrbsFx();
  drawOmegaKickFx();
  drawShaolinFx();
  drawPoliceFx();
  drawYoungScammerFx();
  drawFriendFx();
  drawFlametombFx();
  if (typeof drawTempusFightTimer === 'function') drawTempusFightTimer();
  drawHardcoreHud();
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
  if (fighter.secretVariant === 'neoScammer') return 'NEO SCAMMER';
  if (fighter.secretVariant === 'knight') return 'Knight';
  if (fighter.secretVariant === 'mossBeast') return 'Bestia del Musgo';
  if (fighter.secretVariant === 'darkKnight') return 'Caballero Oscuro';
  if (fighter.duoActive) return fighter.secretVariant === 'celesteGirl' ? 'Celeste (y Seto)' : 'Seto (y Celeste)';
  if (fighter.secretVariant === 'celesteGirl') return 'Celeste';
  if (fighter.secretVariant === 'mochiMouse') return fighter.mochiPowered ? 'Mochi (potenciado)' : 'Mochi';
  if (fighter.secretVariant === 'chefBoss') return 'Chef Furioso';
  if (fighter.secretVariant === 'lanternGuard') return 'Guardia del Farol';
  if (fighter.secretVariant === 'shaolinMaster') return 'Shang Ting';
  if (fighter.secretVariant === 'frostFire') return 'Fire Master B';
  if (originsNames[fighter.secretVariant]) return originsNames[fighter.secretVariant];
  if (fighter.characterType === 'cowboy' && fighter.sheriffBadge) return 'Sheriff Cowboy';
  if (fighter.secretVariant === 'setoBoy') return 'Seto';
  if (fighter.secretVariant === 'darkKnightBoss') return 'Capitan Oscuro';
  if (isScammer(fighter)) return fighter.scammerRage ? 'Scammer Furioso' : 'Scammer';
  if (isShadowJester(fighter)) return 'Shadow Jester';
  if (isChronoRival(fighter)) return 'Chrono Potenciado';
  if (fighter.secretVariant === 'arcadeBoss') return normalArcadeBossName;
  if (fighter.secretVariant === 'icedThug') return fireArcadeMiniBossName;
  if (isIceMaster(fighter)) return fireArcadeBossName;
  if (fighter.characterType === 'normal' && isNormalKaioken(fighter) && fighter.kaiokenTimer > 0) return 'Kaioken';
  if (fighter.characterType === 'fireMaster' && isSuperFireMaster(fighter)) return 'Super Fire Master';
  if (fighter.characterType === 'fireMaster' && isFireMasterOverheat(fighter)) return 'Fire Master+';
  if (fighter.characterType === 'tank' && isTankIronWall(fighter)) return 'Iron Tank';
  if (fighter.characterType === 'reflecter' && isReflecterUpgrade(fighter)) return 'Reflecter 2.0';
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
  if (isKnight(player) || isDarkKnight(player)) {
    return {
      q: { active: true, name: 'Estocada', remaining: player.knightLungeCooldown || 0, max: getDebugCooldown(knightLungeCooldown, player) },
      f: { active: true, name: 'Muro de escudo', remaining: player.knightShieldCooldown || 0, max: getDebugCooldown(knightShieldCooldown, player) },
      r: { active: true, name: 'Juicio del rey', remaining: player.knightSlamCooldown || 0, max: getDebugCooldown(knightSlamCooldown, player) },
    };
  }
  if (isChronoRival(player)) {
    return {
      q: { active: true, name: 'Cuchilla temporal', remaining: player.chronoBladeCooldown, max: getDebugCooldown(chronoBladeCooldown, player) },
      f: { active: true, name: 'Campo lento', remaining: player.chronoSlowCooldown, max: getDebugCooldown(chronoSlowCooldown, player) },
      r: { active: true, name: 'Retroceso total', remaining: player.chronoRivalRewindCooldown || 0, max: getDebugCooldown(chronoRivalRewindCooldown, player) },
    };
  }
  if (isShadowJester(player)) {
    return {
      q: { active: true, name: 'Cartas de poker', remaining: player.jesterSuitCooldown, max: getDebugCooldown(jesterSuitCooldown, player) },
      f: { active: true, name: 'Caos, caos', remaining: player.jesterChaosCooldown, max: getDebugCooldown(jesterChaosCooldown, player) },
      r: { active: true, name: 'Guadana del bufon', remaining: player.jesterScytheCooldown, max: getDebugCooldown(jesterScytheCooldown, player) },
    };
  }
  if (player.youngScammer) return getYoungScammerCooldowns(player);
  if (isPolice(player) || isFriendThing(player)) return getOriginsCodeCooldowns(player);
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
        // the forbidden third spell, once it is learned
        r: getFlametombCooldown(player),
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
  } else if (normalizedSecretBuffer.endsWith('bigshot')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockNeoScammerCode();
  } else if (normalizedSecretBuffer.endsWith('magictown')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockMagicTownCode();
  } else if (normalizedSecretBuffer.endsWith('kungfutea')) {
    menuSecretBuffer = '';
    unlockShaolinCode();
  } else if (normalizedSecretBuffer.endsWith('medieval')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockMedievalCode();
  } else if (normalizedSecretBuffer.endsWith('bossrush')) {
    menuSecretBuffer = '';
    unlockArcadeBosses();
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('lightsout')) {
    menuSecretBuffer = '';
    unlockDarkRoomMap();
  } else if (normalizedSecretBuffer.endsWith('firemasterb') || normalizedSecretBuffer.endsWith('weirdfire')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockFrostFireCode();
  } else if (normalizedSecretBuffer.endsWith('911')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockOriginsCode('police');
  } else if (normalizedSecretBuffer.endsWith('friend')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockOriginsCode('friend');
  } else if (normalizedSecretBuffer.endsWith('salesman')) {
    menuSecretBuffer = '';
    unlockAchievement('codeBreaker');
    unlockOriginsCode('salesman');
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
    // level 7: Knight walks freely toward the farol (he cannot attack)
    if (arcadeCutscene.phase === 'approach' && event.key !== 'Escape') {
      if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') keys.a = true;
      if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') keys.d = true;
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advanceArcadeCutscene();
    } else if (event.key === 'Escape') {
      endArcadeCutscene();
    }
    return;
  }

  if (!gameStarted) return;

  if (dodgeRound.active) {
    if ((event.key === 'Enter' || event.key === ' ') && dodgeRound.stage === 'talk') {
      const line = dodgeRound.config.talk[dodgeRound.talkIndex];
      // first press shows the whole line, the second one goes on
      if (dodgeRound.talkFrame * 1.6 < line.text.length) dodgeRound.talkFrame = Math.ceil(line.text.length / 1.6);
      else dodgeRound.talkSkip = true;
      event.preventDefault();
      return;
    }
    if (event.key === 'q' || event.key === 'Q') keys.q = true;
  }
  if (riftClash.active && riftClash.stage === 'clash') {
    if ([' ', 'Enter', 's', 'S', 'q', 'Q'].includes(event.key)) {
      pressRiftClash();
      event.preventDefault();
    }
    return;
  }
  if (omegaKickFight.active && omegaKickFight.stage === 'clash') {
    if ([' ', 'Enter', 's', 'S', 'q', 'Q'].includes(event.key)) {
      pressOmegaClash();
      event.preventDefault();
    }
    return;
  }
  if (jesterFinal.active || omegariusFinal.active || scamFinal.active || dodgeRound.active || farolClimb.active) {
    // route B: NEO's box has a shooting mode (Q)
    if (scamFinal.active && scamFinal.routeB && (event.key === 'q' || event.key === 'Q') && !event.repeat) fireRouteBShot();
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
      if (player1.flametombTrauma || player1.routeBPanic) break;
      if (keys.r && handleMiniFlametomb(player1, player2)) break;
      if (handleNeoScammerKey(player1, player2, 0, [keys.q, keys.f, keys.r])) break;
      if (handleKnightKey(player1, player2, 0)) break;
      if (handleShaolinKey(player1, player2, 0, [keys.q, keys.f, keys.r])) break;
      if (handleOriginsCodeKey(player1, player2, 0)) break;
      if (handleMagicTownKey(player1, player2, 0)) break;
      if (handleFactoryRobotKey(player1, player2, 0, [keys.q, keys.f, keys.r])) break;
      if (handleYoungScammerKey(player1, player2, 'q')) break;
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
      if (player1.flametombTrauma || player1.routeBPanic) break;
      if (handleNeoScammerKey(player1, player2, 1, [keys.q, keys.f, keys.r])) break;
      if (handleKnightKey(player1, player2, 1)) break;
      if (handleShaolinKey(player1, player2, 1, [keys.q, keys.f, keys.r])) break;
      if (handleOriginsCodeKey(player1, player2, 1)) break;
      if (handleMagicTownKey(player1, player2, 1)) break;
      if (handleFactoryRobotKey(player1, player2, 1, [keys.q, keys.f, keys.r])) break;
      if (handleYoungScammerKey(player1, player2, 'f')) break;
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
        if (hardcoreRun.pending) continueHardcore();
        else resetFight();
        break;
      }
      if (keys.r) break;
      keys.r = true;
      if (keys.q && handleMiniFlametomb(player1, player2)) break;
      if (handleFlametombKey(player1, player2)) break;
      if (isChronoRival(player1)) {
        castChronoTotalRewind(player1);
        break;
      }
      if (handleNeoScammerKey(player1, player2, 2, [keys.q, keys.f, keys.r])) break;
      if (handleKnightKey(player1, player2, 2)) break;
      if (handleShaolinKey(player1, player2, 2, [keys.q, keys.f, keys.r])) break;
      if (handleOriginsCodeKey(player1, player2, 2)) break;
      if (handleMagicTownKey(player1, player2, 2)) break;
      if (handleFactoryRobotKey(player1, player2, 2, [keys.q, keys.f, keys.r])) break;
      if (handleYoungScammerKey(player1, player2, 'r')) break;
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
      if (!botEnabled && handleNeoScammerKey(player2, player1, 0, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleKnightKey(player2, player1, 0)) break;
      if (!botEnabled && handleShaolinKey(player2, player1, 0, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleOriginsCodeKey(player2, player1, 0)) break;
      if (!botEnabled && handleMagicTownKey(player2, player1, 0)) break;
      if (!botEnabled && handleFactoryRobotKey(player2, player1, 0, [keys.slash, keys.period, keys.enter])) break;
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
      if (!botEnabled && handleNeoScammerKey(player2, player1, 1, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleKnightKey(player2, player1, 1)) break;
      if (!botEnabled && handleShaolinKey(player2, player1, 1, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleOriginsCodeKey(player2, player1, 1)) break;
      if (!botEnabled && handleMagicTownKey(player2, player1, 1)) break;
      if (!botEnabled && handleFactoryRobotKey(player2, player1, 1, [keys.slash, keys.period, keys.enter])) break;
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
      if (!botEnabled && handleFlametombKey(player2, player1)) break;
      if (!botEnabled && isChronoRival(player2)) {
        castChronoTotalRewind(player2);
        break;
      }
      if (!botEnabled && handleNeoScammerKey(player2, player1, 2, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleKnightKey(player2, player1, 2)) break;
      if (!botEnabled && handleShaolinKey(player2, player1, 2, [keys.slash, keys.period, keys.enter])) break;
      if (!botEnabled && handleOriginsCodeKey(player2, player1, 2)) break;
      if (!botEnabled && handleMagicTownKey(player2, player1, 2)) break;
      if (!botEnabled && handleFactoryRobotKey(player2, player1, 2, [keys.slash, keys.period, keys.enter])) break;
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
  // (tired from opening a portal: no secret tricks)
  if (attacker.jesterWeakened) return false;
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
  if (fighter.jesterWeakened) return;
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
  if (fighter.secretVariant === 'neoScammer') return neoScammerHealth;
  if (fighter.secretVariant === 'knight') return knightChallenge.active && fighter === player2 ? knightHealth : playableKnightHealth;
  if (fighter.secretVariant === 'mossBeast') return mossBeastHealth;
  if (fighter.secretVariant === 'darkKnight') return darkKnightHealth;
  if (fighter.secretVariant === 'celesteGirl') return celesteHealth;
  if (fighter.secretVariant === 'mochiMouse') return mochiHealth;
  if (fighter.secretVariant === 'chefBoss') return chefBossHealth;
  if (fighter.secretVariant === 'lanternGuard') return lanternGuardHealth;
  if (originsHealth[fighter.secretVariant]) return originsHealth[fighter.secretVariant];
  if (fighter.secretVariant === 'shaolinMaster') return shaolinChallenge.active && fighter === player2 ? shaolinHealth : playableShaolinHealth;
  if (fighter.secretVariant === 'setoBoy') return setoHealth;
  if (fighter.secretVariant === 'darkKnightBoss') return darkKnightBossHealth;
  return 100;
}

function unlockArcadeBosses() {
  arcadeBossesUnlocked = true;
  arcadeBossCharacterButtons.forEach((button) => button.classList.remove('hidden'));
  arcadeMapButtons.forEach((button) => button.classList.remove('hidden'));
}

function unlockNeoScammerCode() {
  neoScammerCodeActive = true;
  neoScammerCharacterButton.classList.remove('hidden');
  scamShowroomMapButton.classList.remove('hidden');
  // after the achievement toast if one just popped up
  const delay = achievementToast && achievementToast.classList.contains('show') ? 3900 : 0;
  setTimeout(() => {
    showCustomToast('[[BIG SHOT]] ACTIVADO', 'NEO SCAMMER y la Sala de Ventas VIP ya se pueden elegir. AHORA ES TU [[OPORTUNIDAD]]!');
    playSound('cutsceneCash');
    playSound('cutsceneLaugh');
  }, delay);
}

function lockNeoScammerCode() {
  neoScammerCodeActive = false;
  neoScammerCharacterButton.classList.add('hidden');
  scamShowroomMapButton.classList.add('hidden');
  if (!normalArcadeActive && !scamChallenge.active && selectedMap === 'scamShowroom') selectedMap = 'foundry';
}

// a human playing NEO SCAMMER: BIG SHOT, [[PIPIS]] and chasing heads; the three at once is his ULTIMA OFERTA
function handleNeoScammerKey(fighter, target, slot, held = []) {
  if (!isNeoScammer(fighter)) return false;
  if (fighter.neoExhausted || !canFighterAct(fighter)) return true;
  if (held.length === 3 && held.every(Boolean)) {
    if (!fighter.neoUltimateUsed && !scamFinal.active) {
      fighter.neoUltimateUsed = true;
      fighter.neoCharge = 0;
      castScamFinalAct(fighter, target);
    }
    return true;
  }
  if (slot === 0) startNeoBigShot(fighter, target);
  else if (slot === 1) castNeoPipis(fighter, target);
  else castNeoHeads(fighter, target);
  return true;
}

function lockArcadeBosses() {
  arcadeBossesUnlocked = false;
  arcadeBossCharacterButtons.forEach((button) => button.classList.add('hidden'));
  arcadeMapButtons.forEach((button) => button.classList.add('hidden'));
  if (!normalArcadeActive && ['normalArcade', 'fireArcade', 'gamblerArcade', 'gamblerAlley', 'jesterRift', 'cobaltAftermath', 'robotFactory', 'factoryRoof', 'factoryVault', 'factoryHidden'].includes(selectedMap)) {
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
  // the upgraded Chrono keeps his time stop locked until he has lost more than half his health
  if (isChronoRival(attacker) && attacker.health > attacker.maxHealth / 2) return false;
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
  playSound(shot.kind === 'discharge' && shot.variant !== 'gold' ? 'robotDischarge' : 'robotHit');
  return true;
}

function updateRobotShots() {
  robotShots.forEach((shot) => {
    shot.update();
    if (!shot.active || gameOver) return;
    const target = shot.target;
    if (shot.kind === 'laser') {
      if (shot.timer === 24) {
        playSound('titanLaser');
        shot.attacker.robotLaserCharge = 0;
      }
      if (shot.timer > 24 || shot.hitDone) return;
      if (hitWithRobotShot(shot, target, titanLaserDamage)) shot.hitDone = true;
      return;
    }
    if (shot.kind === 'pipis') {
      // it hatches on impact (or when it lands) into a handful of little heads
      const result = hitWithRobotShot(shot, target, neoPipisDamage);
      if (result || shot.position.y + shot.height >= ground) {
        burstNeoPipis(shot);
        shot.active = false;
      }
      return;
    }
    if (shot.kind === 'neoHead') {
      if (hitWithRobotShot(shot, target, shot.variant === 'homing' ? neoHomingHeadDamage : neoBurstHeadDamage)) shot.active = false;
      return;
    }
    if (shot.kind === 'bigShot') {
      const result = hitWithRobotShot(shot, target, shot.variant === 'small' ? neoSmallShotDamage : neoBigShotDamage);
      if (result) shot.active = false;
      if (result === true) target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 20);
      return;
    }
    if (shot.kind === 'energy' && shot.secret) {
      updateOmegariusSecretShot(shot);
      return;
    }
    if (shot.kind === 'energy') {
      const area = getChronoBladeCollisionArea(shot);
      if (!shot.reflected && rectangularCopycatShieldCollision(shot.target, area) && shot.target.copycatShieldTimer > 0) {
        // Reflecter's shield bounces it back at Omegarius (it hurts him less than it would have hurt Reflecter)
        shot.target.copycatShieldTimer = 0;
        playSound('reflectShield');
        shot.reflected = true;
        shot.direction *= -1;
        shot.velocity.x *= -1.1;
        const owner = shot.attacker;
        shot.attacker = shot.target;
        shot.target = owner;
        return;
      }
      if (rectangularCollision({ rectangle1: area, rectangle2: shot.target })) {
        applyDamage(shot.attacker, shot.target, shot.reflected ? omegariusBeamReflectDamage : omegariusBeamDamage, { isSpecial: true, damageType: 'robot' });
        if (shot.target === player1) pushAwayFromOmegarius(shot.target, shot.direction, 12);
        shot.target.velocity.y = getDebugKnockback(-8, shot.target);
        shot.target.gamblerStunTimer = Math.max(shot.target.gamblerStunTimer, 30);
        playSound('judgeHammerHit');
        playSound('robotBoom');
        shot.active = false;
      }
      return;
    }
    if (shot.kind === 'hammer') {
      // one hit on the way out and one on the way back
      const hitKey = shot.returning ? 'hitBack' : 'hitOut';
      if (!shot[hitKey] && hitWithRobotShot(shot, target, judgeHammerThrowDamage)) shot[hitKey] = true;
      return;
    }
    if (shot.kind === 'drop') {
      if (shot.exploded > 0 || shot.timer > 0) return;
      shot.exploded = 18;
      const big = shot.variant === 'fist';
      const hammerDrop = shot.variant === 'hammer';
      const dealDrop = shot.variant === 'deal';
      playSound(hammerDrop ? 'judgeHammerHit' : 'robotBoom');
      if (big) playKick({ volume: 0.4 });
      const distance = Math.abs(getFighterCenterX(target) - (shot.position.x + shot.width / 2));
      const onFloor = target.position.y + target.height >= ground - (big ? 90 : 60);
      if (distance < (big ? 80 : hammerDrop ? 58 : dealDrop ? 52 : 48) && onFloor && !handleCopycatShieldHit(target, shot.attacker)) {
        applyDamage(shot.attacker, target, big ? titanFistDamage : hammerDrop ? judgeHammerDropDamage : dealDrop ? neoDealDamage : titanMissileDamage, { isSpecial: true, damageType: 'robot' });
        target.velocity.y = getDebugKnockback(big ? -11 : hammerDrop ? -8 : -6, target);
        if (big) target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 24);
        if (hammerDrop) target.gamblerStunTimer = Math.max(target.gamblerStunTimer, 14);
      }
      return;
    }
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

function recordChronoRivalHistory() {
  const rivals = [player1, player2].filter(isChronoRival);
  if (!rivals.length) return;
  // at half health Chrono drags Reflecter up through the factory to the roof (arcade only)
  if (normalArcadeActive && isChronoRival(player2) && !player2.chronoAscentDone && player2.health > 0 && player2.health <= player2.maxHealth / 2 && !arcadeCutscene.active) {
    startChronoAscent();
    return;
  }
  rivals.forEach((rival) => {
    if (rival.chronoRivalRewindCooldown > 0) rival.chronoRivalRewindCooldown -= 1;
  });
  chronoRivalHistory.push({
    p1: { x: player1.position.x, y: player1.position.y, health: player1.health },
    p2: { x: player2.position.x, y: player2.position.y, health: player2.health },
  });
  if (chronoRivalHistory.length > chronoRivalRewindFrames) chronoRivalHistory.shift();
}

// Chrono's third ability: everything goes back 10 seconds (both fighters' position and health).
function castChronoTotalRewind(attacker) {
  if (!isChronoRival(attacker) || attacker.chronoRivalRewindCooldown > 0 || !canFighterAct(attacker) || gameOver) return false;
  if (chronoRivalHistory.length < 60) return false;
  const past = chronoRivalHistory[0];
  [[player1, past.p1], [player2, past.p2]].forEach(([fighter, snapshot]) => {
    jesterAfterimages.push({ x: fighter.position.x, y: fighter.position.y, width: fighter.width, height: fighter.height, life: 30 });
    fighter.position.x = snapshot.x;
    fighter.position.y = snapshot.y;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.health = Math.min(fighter.maxHealth, snapshot.health);
  });
  chronoBlades = [];
  chronoZones = [];
  robotShots = [];
  chronoRivalHistory = [];
  attacker.chronoRivalRewindCooldown = getDebugCooldown(chronoRivalRewindCooldown, attacker);
  chronoRewindFx = 70;
  recordSpecialUsed(attacker);
  playSound('chronoTotalRewind');
  updateHealthBars();
  return true;
}

function getChronoRewindGain() {
  if (chronoRivalHistory.length < chronoRivalRewindFrames) return -Infinity;
  const past = chronoRivalHistory[0];
  // what Chrono gets back minus what Reflecter gets back
  return (past.p2.health - player2.health) - (past.p1.health - player1.health);
}

function isCh6Level() {
  return normalArcadeActive && arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 6;
}

function isCh6ProtectedChrono(fighter) {
  return Boolean(isCh6Level() && ch6Stage === 'chrono' && fighter === player2 && fighter.characterType === 'chrono');
}

function isOmegariusSparring() {
  return Boolean(normalArcadeActive && arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 7 && player2.secretVariant === 'omegarius');
}

function isOmegariusMercyPending(fighter) {
  return Boolean(fighter === player1 && isOmegariusSparring() && !player2.omegariusMercyDone);
}

function isOmegarius(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'omegarius');
}

// once Omegarius is fired up (250 health) its abilities come back faster
function getOmegariusCooldown(baseCooldown, attacker) {
  return getDebugCooldown(Math.round(baseCooldown * (attacker.judgeOverdrive ? omegariusExcitedCooldownMultiplier : 1)), attacker);
}

// 1) hammer boomerang
function throwOmegariusHammer(attacker, target) {
  if (robotShots.some((shot) => shot.kind === 'hammer' && shot.attacker === attacker)) return false;
  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const direction = target.position.x + target.width / 2 >= attackerCenterX ? 1 : -1;
  robotShots.push(new RobotShot({ kind: 'hammer', x: attackerCenterX - 23, y: Math.max(attacker.position.y + 40, ground - 110), direction, attacker, target, velocityX: getDebugProjectileSpeed(13, attacker) * direction }));
  attacker.attacksToTheRight = direction > 0;
  attacker.omegariusThrowCooldown = getOmegariusCooldown(omegariusThrowCooldown, attacker);
  attacker.hybridAbilityCooldown = 50;
  recordSpecialUsed(attacker);
  playSound('judgeThrow');
  return true;
}

// 2) parry: raises a bronze shield for a moment
function raiseOmegariusParry(attacker) {
  attacker.omegariusParryTimer = omegariusParryFrames;
  attacker.omegariusParryCooldown = getOmegariusCooldown(omegariusParryCooldown, attacker);
  attacker.hybridAbilityCooldown = 50;
  recordSpecialUsed(attacker);
  playSound('judgeShieldUp');
  return true;
}

// a melee hit on the raised shield: no damage to Omegarius, and a heavy counter that throws the attacker far away
function tryOmegariusParry(defender, attacker) {
  if (!isOmegarius(defender) || !(defender.omegariusParryTimer > 0)) return false;
  defender.omegariusParryTimer = 0;
  defender.omegariusParryFlash = 30;
  defender.judgeSwing = 18;
  const direction = getFighterCenterX(attacker) >= getFighterCenterX(defender) ? 1 : -1;
  defender.attacksToTheRight = direction > 0;
  applyDamage(defender, attacker, omegariusParryCounterDamage, { isSpecial: true, damageType: 'robot' });
  pushAwayFromOmegarius(attacker, direction, 20);
  attacker.velocity.y = getDebugKnockback(-11, attacker);
  attacker.gamblerStunTimer = Math.max(attacker.gamblerStunTimer, 40);
  playSound('judgeParry');
  playSound('judgeHammerHit');
  updateHealthBars();
  return true;
}

// 3) energy shot: charges on the hammer, then fires (locked until Omegarius is down to 400 health)
function startOmegariusBeam(attacker, target) {
  if (attacker.health > omegariusBeamUnlockHealth) return false;
  attacker.omegariusBeamCharge = omegariusBeamChargeFrames;
  attacker.omegariusBeamChargeTotal = omegariusBeamChargeFrames;
  attacker.omegariusBeamSecret = false;
  attacker.attacksToTheRight = target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2;
  attacker.omegariusBeamCooldown = getOmegariusCooldown(omegariusBeamCooldown, attacker);
  attacker.hybridAbilityCooldown = 70;
  recordSpecialUsed(attacker);
  playSound('judgeBeamCharge');
  return true;
}

function fireOmegariusBeam(attacker) {
  const target = getOpponent(attacker);
  const direction = attacker.attacksToTheRight ? 1 : -1;
  const head = getOmegariusHammerHead(attacker);
  const secret = Boolean(attacker.omegariusBeamSecret);
  const shot = new RobotShot({ kind: 'energy', x: direction > 0 ? head.x - 10 : head.x - 54, y: Math.min(head.y, ground - 70) - 22, direction, attacker, target, velocityX: getDebugProjectileSpeed(secret ? omegariusSecretSpeed : omegariusBeamSpeed, attacker) * direction });
  if (secret) {
    shot.secret = true;
    shot.owner = attacker;
    shot.volleys = 0;
    shot.width = 96;
    shot.height = 64;
    shot.position.x = direction > 0 ? head.x - 10 : head.x - 86;
    shot.position.y = ground - 112;
    shot.previousPosition = { ...shot.position };
    shot.life = 99999;
    playSound('judgeHammerHit');
    playKick({ volume: 0.4 });
  }
  robotShots.push(shot);
  playSound('judgeBeamFire');
}

// secret ability (. + Enter), only at 100 health or less and once per fight
function startOmegariusSecret(attacker, target) {
  if (attacker.omegariusSecretUsed || attacker.health > omegariusSecretHealth || attacker.omegariusBeamCharge > 0) return false;
  if (robotShots.some((shot) => shot.kind === 'hammer' && shot.attacker === attacker)) return false;
  attacker.omegariusSecretUsed = true;
  attacker.omegariusSecretActive = true;
  attacker.omegariusBeamSecret = true;
  attacker.omegariusBeamCharge = omegariusSecretChargeFrames;
  attacker.omegariusBeamChargeTotal = omegariusSecretChargeFrames;
  attacker.omegariusParryTimer = 0;
  attacker.attacksToTheRight = target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2;
  recordSpecialUsed(attacker);
  playSound('judgeSecretCharge');
  return true;
}

function endOmegariusSecret(attacker) {
  attacker.omegariusSecretActive = false;
  attacker.omegariusBeamSecret = false;
  attacker.hybridAbilityCooldown = Math.max(attacker.hybridAbilityCooldown, 90);
}

// the secret shot goes back and forth: Reflecter bounces it with his shield, Omegarius parries it back,
// and after Reflecter's fifth bounce Omegarius catches it and slams it into the floor
function updateOmegariusSecretShot(shot) {
  const omegarius = shot.owner;
  const defender = shot.target;
  const area = getChronoBladeCollisionArea(shot);
  const speedUp = () => {
    shot.direction *= -1;
    shot.velocity.x = shot.direction * (Math.abs(shot.velocity.x) + 1.2);
  };
  if (!shot.reflected) {
    if (rectangularCopycatShieldCollision(defender, area) && defender.copycatShieldTimer > 0) {
      defender.copycatShieldTimer = 0;
      defender.copycatShieldCooldown = Math.min(defender.copycatShieldCooldown || 0, omegariusSecretShieldCooldown);
      shot.reflected = true;
      shot.volleys += 1;
      speedUp();
      playSound('reflectShield');
      playSound('judgeParry');
      return;
    }
    if (rectangularCollision({ rectangle1: area, rectangle2: defender })) {
      applyDamage(omegarius, defender, omegariusSecretDamage, { isSpecial: true, damageType: 'robot' });
      pushAwayFromOmegarius(defender, shot.direction, 16);
      defender.velocity.y = getDebugKnockback(-10, defender);
      defender.gamblerStunTimer = Math.max(defender.gamblerStunTimer, 40);
      playSound('judgeHammerHit');
      playSound('robotBoom');
      shot.active = false;
      endOmegariusSecret(omegarius);
      updateHealthBars();
    }
    return;
  }
  if (rectangularCollision({ rectangle1: area, rectangle2: omegarius })) {
    if (shot.volleys < omegariusSecretVolleys) {
      // Omegarius parries it back
      shot.reflected = false;
      speedUp();
      omegarius.attacksToTheRight = shot.direction > 0;
      omegarius.omegariusParryTimer = 10;
      omegarius.omegariusParryFlash = 30;
      omegarius.judgeSwing = 18;
      playSound('judgeParry');
    } else {
      shot.active = false;
      startOmegariusSlamCutscene(shot);
    }
  }
}

// the player's horizontal speed is reset every frame, so a long knockback is applied as a push over several frames
function pushAwayFromOmegarius(fighter, direction, frames) {
  fighter.omegariusPushTimer = frames;
  fighter.omegariusPushDirection = direction;
}

function updateOmegarius(fighter) {
  const opponent = getOpponent(fighter);
  if (opponent.omegariusPushTimer > 0) {
    opponent.omegariusPushTimer -= 1;
    opponent.position.x = Math.max(0, Math.min(canvas.width - opponent.width, opponent.position.x + opponent.omegariusPushDirection * (6 + opponent.omegariusPushTimer)));
  }
  ['omegariusThrowCooldown', 'omegariusParryCooldown', 'omegariusBeamCooldown', 'omegariusParryTimer', 'omegariusParryFlash'].forEach((key) => {
    if (fighter[key] > 0) fighter[key] -= 1;
  });
  if (fighter.omegariusBeamCharge > 0) {
    fighter.omegariusBeamCharge -= 1;
    fighter.velocity.x = 0;
    if (fighter.omegariusBeamCharge === 0) fireOmegariusBeam(fighter);
  }
  if (fighter.omegariusSecretActive) {
    // Reflecter's shield barely has a cooldown during the secret ability
    if (opponent.characterType === 'reflecter') opponent.copycatShieldCooldown = Math.min(opponent.copycatShieldCooldown || 0, omegariusSecretShieldCooldown);
    const shotInPlay = robotShots.some((shot) => shot.secret && shot.owner === fighter && shot.active);
    if (fighter.omegariusBeamCharge === 0 && !shotInPlay && !arcadeCutscene.active) endOmegariusSecret(fighter);
  }
}

function updateFactoryRobots() {
  if (gameOver || !gameStarted) return;
  [player1, player2].forEach((fighter) => {
    if (isNeoScammer(fighter)) updateNeoScammer(fighter);
    if (isKnight(fighter) || isDarkKnight(fighter)) updateKnight(fighter);
    if (isMossBeast(fighter)) updateMossBeast(fighter);
    if (fighter.secretVariant === 'celesteGirl') updateCeleste(fighter);
    if (fighter.secretVariant === 'setoBoy') updateSeto(fighter);
    if (fighter.duoActive && isRobledalKid(fighter)) updateRobledalDuo(fighter);
    if (isMochi(fighter)) updateMochi(fighter);
    if (fighter.secretVariant === 'chefBoss') updateChefBoss(fighter);
    if (fighter.sheriffBadge) updateSheriffCowboy(fighter);
    if (fighter.secretVariant === 'lanternGuard') updateLanternGuard(fighter);
    if (fighter.secretVariant === 'shaolinMaster') updateShaolin(fighter);
    if (isPolice(fighter)) updatePolice(fighter);
    if (isFriendThing(fighter)) updateFriendThing(fighter);
    if (fighter.youngScammer) updateYoungScammer(fighter);
  });
  // NEO SCAMMER's scenes during the fight: tired at 200, his ULTIMA OFERTA at 10
  if (scamChallenge.active && scamChallenge.stage === 'neo' && isNeoScammer(player2) && player2.health > 0 && !arcadeCutscene.active && !scamFinal.active) {
    if (!player2.neoTiredDone && player2.health <= neoScammerTiredHealth && player2.health > neoScammerFinalHealth) {
      player2.neoTiredDone = true;
      player2.neoTired = true;
      player2.neoCharge = 0;
      robotShots = [];
      startMidFightCh7Cutscene('scamTired', scamTiredLines);
      return;
    }
    if (!player2.neoFinalUsed && player2.health <= neoScammerFinalHealth) {
      player2.neoFinalUsed = true;
      player2.neoTiredDone = true;
      player2.neoTired = true;
      player2.neoCharge = 0;
      robotShots = [];
      startMidFightCh7Cutscene('scamFinalStart', scamFinalStartLines);
      return;
    }
  }
  if (isOmegariusMercyPending(player1) && player1.health > 0 && player1.health <= omegariusMercyHealth && !arcadeCutscene.active) {
    startOmegariusMercyCutscene();
    return;
  }
  if (isOmegariusSparring() && !player2.omegariusExcitedDone && !player2.omegariusSecretActive && player2.health > 0 && player2.health <= omegariusExcitedHealth && !arcadeCutscene.active) {
    startOmegariusExcitedCutscene();
    return;
  }
  if (isCh6ProtectedChrono(player2) && player2.health <= ch6TitanTriggerHealth && !arcadeCutscene.active) {
    startCh6GiantCutscene();
    return;
  }
  if (player2.robotLaserCharge > 0) player2.robotLaserCharge -= 1;
  recordChronoRivalHistory();
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
    if (fighter.judgeSwing > 0) fighter.judgeSwing -= 1;
    if (isOmegarius(fighter)) updateOmegarius(fighter);
    if (fighter.judgeOverdriveFlash > 0) fighter.judgeOverdriveFlash -= 1;
    // the Juez de Bronce overloads its core at half health
    if (robot.overdriveAbilities && !fighter.judgeOverdrive && fighter.health <= fighter.maxHealth / 2) {
      fighter.judgeOverdrive = true;
      fighter.judgeOverdriveFlash = 70;
      fighter.damageMultiplier = (fighter.damageMultiplier || 1) * 1.1;
      fighter.hybridAbilityCooldown = Math.min(fighter.hybridAbilityCooldown, 40);
      playSound('judgeOverdrive');
    }
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

// ------------------------------------------------ Omegarius: ULTIMO ASALTO (final act, . + /) ------------------------------------------------
function isOmegariusFinalUnlocked(fighter) {
  return Boolean(isOmegarius(fighter) && !fighter.omegariusFinalUsed && fighter.health <= omegariusFinalHealth);
}

function castOmegariusFinalAct(attacker, target) {
  if (omegariusFinal.active || !isOmegariusFinalUnlocked(attacker) || attacker.omegariusSecretActive || gameOver) return false;
  attacker.omegariusFinalUsed = true;
  attacker.omegariusBeamCharge = 0;
  attacker.omegariusParryTimer = 0;
  attacker.robotChargeTimer = 0;
  attacker.judgeOverdrive = true;
  robotShots = [];
  target.copycatShieldTimer = 0;
  recordSpecialUsed(attacker);
  const soulWidth = Math.round(target.width * 0.3);
  const soulHeight = Math.round(target.height * 0.3);
  const box = { ...omegariusFinalBoxes.free };
  Object.assign(omegariusFinal, {
    active: true,
    frame: 0,
    caster: attacker,
    target,
    stage: 'intro',
    phaseIndex: -1,
    phaseFrame: 0,
    casterPos: { x: 800, y: ground - attacker.height },
    finale: null,
    caption: null,
    hitStop: 0,
    flash: 0,
    mode: 'free',
    box: { x: getFighterCenterX(target) - 30, y: target.position.y + 20, width: 60, height: 80 },
    boxTarget: box,
    soul: { x: box.x + 60, y: box.y + box.height / 2 - soulHeight / 2, width: soulWidth, height: soulHeight },
    shieldDir: 'right',
    items: [],
    sparks: [],
    invulnerable: 0,
    shake: 0,
    hits: 0,
    parries: 0,
    nextSpawn: 0,
    spawnCount: 0,
    banner: null,
    finaleResult: null,
    finaleFrame: 0,
    whiteFrame: 0,
    lastSounds: {},
  });
  resetKeys();
  playSound('judgeFinalStart');
  playSound('judgeOverdrive');
  return true;
}

function playOmegariusFinalSound(name, gap = 5) {
  const final = omegariusFinal;
  if (final.frame - (final.lastSounds[name] ?? -999) < gap) return;
  final.lastSounds[name] = final.frame;
  playSound(name);
}

function getOmegariusFinalCenter() {
  const box = omegariusFinal.boxTarget;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

const omegariusFinalDirections = {
  up: { x: 0, y: -1, angle: -Math.PI / 2 },
  down: { x: 0, y: 1, angle: Math.PI / 2 },
  left: { x: -1, y: 0, angle: Math.PI },
  right: { x: 1, y: 0, angle: 0 },
};

function startOmegariusFinalPhase(index) {
  const final = omegariusFinal;
  const phase = omegariusFinalPhases[index];
  final.stage = 'phase';
  final.phaseIndex = index;
  final.phaseFrame = 0;
  final.nextSpawn = 0;
  final.spawnCount = 0;
  final.items = final.items.filter((item) => item.type === 'returning');
  final.mode = phase.mode;
  final.boxTarget = { ...omegariusFinalBoxes[phase.mode] };
  const labels = {
    free: ['MODO LIBRE', 'Movete con W A S D y esquiva todo'],
    shield: ['MODO ESCUDO', 'No te podes mover: apunta el escudo con W A S D'],
  };
  final.banner = phase.pattern === 'finale'
    ? { title: 'EL ULTIMO GOLPE', subtitle: 'Devolvelo con el escudo, las veces que haga falta!', life: 130 }
    : phase.pattern === 'storm'
      ? { title: 'LLUVIA DE MARTILLOS', subtitle: 'Omegarius no para: esquivalos todos con W A S D!', life: 130 }
      : { title: labels[phase.mode][0], subtitle: labels[phase.mode][1], life: 110 };
  if (phase.pattern === 'storm') setOmegariusFinalCaption('MARTILLOS SIN PARAR!!', '#ffca28', 120);
  if (phase.pattern === 'finale') final.finale = { step: 'wait', t: 0, throws: 0, charge: 0, trail: [] };
  playSound('judgeFinalMode');
}

function setOmegariusFinalCaption(text, color = '#ffca28', life = 110) {
  omegariusFinal.caption = { text, color, life, maxLife: life };
}

// where Omegarius stands (or floats) during the giant hammer finale
function getOmegariusFinalPerch(spot) {
  const caster = omegariusFinal.caster;
  const center = getOmegariusFinalCenter();
  if (spot === 'up') return { x: center.x - caster.width / 2, y: 24 };
  if (spot === 'left') return { x: 80, y: ground - caster.height };
  return { x: 800, y: ground - caster.height };
}

function spawnOmegariusFinalStorm(y, speed) {
  const box = omegariusFinal.boxTarget;
  omegariusFinal.items.push({ type: 'storm', x: box.x + box.width + 30, y, vx: -speed, vy: 0, r: 15, rot: Math.random() * Math.PI * 2, spin: 0.5, warn: 0, life: 260 });
  omegariusFinalThrowPose();
  playOmegariusFinalSound('judgeThrow', 7);
}

function omegariusFinalThrowPose() {
  omegariusFinal.caster.judgeSwing = 18;
}

// free mode items
function spawnOmegariusFinalBoomerang(side, y, speed = 9) {
  const box = omegariusFinal.boxTarget;
  const startX = side < 0 ? box.x - 34 : box.x + box.width + 34;
  const velocityX = side < 0 ? speed : -speed;
  omegariusFinal.items.push({ type: 'boomerang', x: startX, y, vx: velocityX, vy: 0, ax: -velocityX / 58, r: 17, rot: 0, spin: 0.45, warn: 26, life: 150, side });
  omegariusFinalThrowPose();
  playOmegariusFinalSound('judgeThrow', 8);
}

function spawnOmegariusFinalRain(x) {
  const box = omegariusFinal.boxTarget;
  omegariusFinal.items.push({ type: 'rain', x, y: box.y - 30, vx: 0, vy: 7, r: 17, rot: Math.PI, spin: 0, warn: 28, life: 200 });
  playOmegariusFinalSound('judgeFinalWarn', 6);
}

function spawnOmegariusFinalWave(side) {
  const box = omegariusFinal.boxTarget;
  const gapHeight = 84;
  const gapY = box.y + 20 + Math.random() * (box.height - gapHeight - 40);
  omegariusFinal.items.push({ type: 'wave', x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: 0, vx: side < 0 ? 3.6 : -3.6, vy: 0, gapY, gapHeight, warn: 30, life: 220 });
  omegariusFinalThrowPose();
  playOmegariusFinalSound('judgeQuake', 10);
}

function spawnOmegariusFinalBouncer() {
  const box = omegariusFinal.boxTarget;
  const angle = Math.random() * Math.PI * 2;
  omegariusFinal.items.push({ type: 'bouncer', x: box.x + 40 + Math.random() * (box.width - 80), y: box.y + 30, vx: Math.cos(angle) * 3.6, vy: Math.abs(Math.sin(angle)) * 3.6 + 1, r: 16, rot: 0, spin: 0.3, warn: 30, life: 1000 });
  omegariusFinalThrowPose();
  playOmegariusFinalSound('judgeThrow', 8);
}

function spawnOmegariusFinalOrbs(count, spread) {
  const final = omegariusFinal;
  const box = final.boxTarget;
  const originX = box.x + box.width + 30;
  const originY = box.y + box.height / 2;
  const soulX = final.soul.x + final.soul.width / 2;
  const soulY = final.soul.y + final.soul.height / 2;
  const baseAngle = Math.atan2(soulY - originY, soulX - originX);
  for (let index = 0; index < count; index += 1) {
    const angle = baseAngle + (index - (count - 1) / 2) * spread;
    final.items.push({ type: 'orb', x: originX, y: originY, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, r: 11, warn: 0, life: 200 });
  }
  playOmegariusFinalSound('judgeBeamFire', 10);
}

function spawnOmegariusFinalBeam() {
  const final = omegariusFinal;
  const horizontal = Math.random() < 0.5;
  const soulX = final.soul.x + final.soul.width / 2;
  const soulY = final.soul.y + final.soul.height / 2;
  final.items.push({ type: 'beam', horizontal, pos: horizontal ? soulY : soulX, thickness: 34, warn: 46, fire: 24 });
  playOmegariusFinalSound('titanLaserCharge', 20);
}

// shield mode items: they fly in from one of the four sides towards the middle
function spawnOmegariusFinalIncoming(dir, kind = 'hammer', speed = 4.5, delay = 0) {
  omegariusFinal.items.push({ type: 'incoming', kind, dir, dist: kind === 'giant' ? 330 : 240, speed, r: kind === 'giant' ? 40 : kind === 'orb' ? 11 : 16, rot: 0, spin: kind === 'orb' ? 0 : 0.4, warn: delay });
  if (!delay) {
    omegariusFinalThrowPose();
    playOmegariusFinalSound(kind === 'orb' ? 'judgeBeamFire' : 'judgeThrow', 6);
  }
}

function randomOmegariusFinalDir(except = null) {
  const dirs = ['up', 'down', 'left', 'right'].filter((dir) => dir !== except);
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function spawnOmegariusFinalPattern(phase, t) {
  const final = omegariusFinal;
  if (t < final.nextSpawn) return;
  const box = final.boxTarget;
  const randomY = () => box.y + 24 + Math.random() * (box.height - 48);
  const randomX = () => box.x + 24 + Math.random() * (box.width - 48);
  final.spawnCount += 1;
  const count = final.spawnCount;
  if (phase.pattern === 'boomerangs') {
    // hammer boomerangs that come in from the sides and fly back out
    const side = Math.random() < 0.5 ? -1 : 1;
    spawnOmegariusFinalBoomerang(side, randomY(), 8 + Math.min(3, t / 300));
    if (t > 450 && count % 2 === 0) spawnOmegariusFinalBoomerang(-side, randomY(), 9);
    final.nextSpawn = t + (t > 450 ? 58 : 72);
  } else if (phase.pattern === 'singles') {
    // one hammer at a time from any side
    spawnOmegariusFinalIncoming(randomOmegariusFinalDir(), 'hammer', t > 450 ? 5.5 : 4.5);
    final.nextSpawn = t + (t > 450 ? 44 : 56);
  } else if (phase.pattern === 'rainWaves') {
    // falling hammers, and every so often a wall of energy with a gap
    spawnOmegariusFinalRain(randomX());
    if (count % 6 === 0) spawnOmegariusFinalWave(count % 12 === 0 ? 1 : -1);
    final.nextSpawn = t + (t > 450 ? 20 : 26);
  } else if (phase.pattern === 'mixed') {
    // hammers and fast energy orbs; later, two in a row from different sides
    const dir = randomOmegariusFinalDir();
    spawnOmegariusFinalIncoming(dir, count % 3 === 0 ? 'orb' : 'hammer', count % 3 === 0 ? 7.5 : 6);
    if (t > 450 && count % 2 === 0) spawnOmegariusFinalIncoming(randomOmegariusFinalDir(dir), 'hammer', 6, 18);
    final.nextSpawn = t + (t > 450 ? 46 : 40);
  } else if (phase.pattern === 'chaos') {
    // bouncing hammers the whole time, plus boomerangs, aimed orbs and sweeping beams
    if (count === 1) {
      spawnOmegariusFinalBouncer();
      spawnOmegariusFinalBouncer();
    }
    if (count % 3 === 0) spawnOmegariusFinalBoomerang(Math.random() < 0.5 ? -1 : 1, randomY(), 9);
    if (count % 4 === 1) spawnOmegariusFinalOrbs(3, 0.32);
    if (count % 7 === 5) spawnOmegariusFinalBeam();
    if (t > 600 && count === 30) spawnOmegariusFinalBouncer();
    final.nextSpawn = t + 30;
  } else if (phase.pattern === 'fury') {
    // fast: sometimes three in a row from the same side, sometimes a quick switch
    const dir = randomOmegariusFinalDir();
    const speed = t > 600 ? 8 : 7;
    if (count % 4 === 0) {
      spawnOmegariusFinalIncoming(dir, 'hammer', speed);
      spawnOmegariusFinalIncoming(dir, 'orb', speed + 1, 12);
      spawnOmegariusFinalIncoming(dir, 'hammer', speed, 24);
      final.nextSpawn = t + 58;
    } else {
      spawnOmegariusFinalIncoming(dir, count % 3 === 0 ? 'orb' : 'hammer', speed);
      if (count % 5 === 0) spawnOmegariusFinalIncoming(randomOmegariusFinalDir(dir), 'hammer', speed, 14);
      final.nextSpawn = t + 30;
    }
  } else if (phase.pattern === 'storm') {
    // hammers without a break from Omegarius's side, leaving a safe lane that slowly moves up and down,
    // plus a volley falling from above every so often
    const laneCenter = box.y + box.height / 2 + Math.sin(t / 70) * (box.height / 2 - 60);
    const laneHalf = t > 700 ? 42 : 52;
    let y = randomY();
    for (let tries = 0; tries < 8 && Math.abs(y - laneCenter) < laneHalf + 17; tries += 1) y = randomY();
    if (Math.abs(y - laneCenter) >= laneHalf + 17) spawnOmegariusFinalStorm(y, 6.5 + Math.min(2.5, t / 400));
    if (count % 45 === 0) {
      for (let drop = 0; drop < 4; drop += 1) spawnOmegariusFinalRain(randomX());
    }
    final.nextSpawn = t + (t > 700 ? 5 : 7);
  }
}

// ----- the giant hammer finale: rise, three throws from three sides (each one parried), a clash, and the blast -----
function launchOmegariusGiant(dir, radius, speed) {
  const final = omegariusFinal;
  const finale = final.finale;
  finale.step = 'incoming';
  finale.t = 0;
  finale.charge = 0;
  finale.throws += 1;
  final.items.push({ type: 'incoming', kind: 'giant', dir, dist: 290, speed, r: radius, rot: 0, spin: 0.25, warn: 0 });
  omegariusFinalThrowPose();
  final.shake = 24;
  playSound('judgeThrow');
  playSound('judgeHammerHit');
  playKick({ volume: 0.45 });
}

function onOmegariusGiantParried(item) {
  const final = omegariusFinal;
  const finale = final.finale;
  final.hitStop = 14;
  final.shake = 30;
  final.flash = 0.6;
  addOmegariusFinalSpark(item.x, item.y, '#26c6da');
  addOmegariusFinalSpark(item.x, item.y, '#ffffff');
  playSound('reflectShield');
  playSound('judgeHammerHit');
  final.items.push({ type: 'returning', x: item.x, y: item.y, r: item.r, rot: item.rot, warn: 0 });
  finale.step = 'return';
  finale.t = 0;
  setOmegariusFinalCaption(['PARRY!', 'OTRO PARRY!!', 'PARRY PERFECTO!!!'][Math.min(2, finale.throws - 1)], '#26c6da', 70);
}

function onOmegariusGiantReturned() {
  const final = omegariusFinal;
  const finale = final.finale;
  if (finale.throws < 3) {
    // it catches it... and throws it again from somewhere else
    final.shake = 22;
    playSound('judgeParry');
    playKick({ volume: 0.35 });
    setOmegariusFinalCaption(finale.throws === 1 ? 'JA! TODAVIA NO TERMINE!' : 'Y AHORA... DESDE ACA!', '#ffca28', 90);
    finale.step = 'reposition';
    finale.t = 0;
    finale.from = { ...final.casterPos };
    finale.trail = [];
    finale.nextDir = finale.throws === 1 ? 'right' : 'left';
  } else {
    // the third one comes back too strong: it slams into Omegarius's own hammer
    finale.step = 'clash';
    finale.t = 0;
    finale.clashSide = final.casterPos.x + final.caster.width / 2 < getOmegariusFinalCenter().x ? 1 : -1;
    finale.clashX = final.casterPos.x + final.caster.width / 2 + finale.clashSide * 50;
    finale.clashY = final.casterPos.y + final.caster.height / 2;
    finale.clashStartX = final.casterPos.x;
  }
}

function onOmegariusGiantHit() {
  const final = omegariusFinal;
  final.finaleResult = 'hit';
  final.shake = 36;
  final.flash = 0.5;
  final.finale.step = 'after';
  final.finale.t = 0;
  setOmegariusFinalCaption('JEJE... CASI, HERMANITO', '#ffca28', 120);
}

function updateOmegariusFinale() {
  const final = omegariusFinal;
  const finale = final.finale;
  const caster = final.caster;
  finale.t += 1;
  const t = finale.t;
  const floorY = ground - caster.height;
  if (finale.step === 'wait') {
    if (t >= 40) {
      finale.step = 'rise';
      finale.t = 0;
    }
  } else if (finale.step === 'rise') {
    // Omegarius jumps above the box and forges a giant hammer out of pure energy
    const perch = getOmegariusFinalPerch('up');
    const progress = Math.min(1, t / 140);
    const ease = 1 - Math.pow(1 - progress, 3);
    final.casterPos = { x: 800 + (perch.x - 800) * ease, y: floorY + (perch.y - floorY) * ease - Math.sin(progress * Math.PI) * 30 };
    finale.charge = Math.min(1, t / 170);
    final.shake = Math.max(final.shake, finale.charge * 7);
    if (t === 1) {
      playSound('judgeSecretCharge');
      setOmegariusFinalCaption('ESTE ES MI ULTIMO GOLPE, HERMANITO!', '#ffca28', 170);
    }
    if (t % 22 === 0) {
      playKick({ volume: 0.18 + finale.charge * 0.25 });
      playOmegariusFinalSound('judgeFinalWarn', 10);
    }
    if (t === 120) playSound('judgeCore');
    if (t >= 180) launchOmegariusGiant('up', 54, 2.8);
  } else if (finale.step === 'reposition') {
    // a jump to another side, leaving a trail, while a new giant hammer forms
    const to = getOmegariusFinalPerch(finale.nextDir);
    const progress = Math.min(1, t / 34);
    final.casterPos = { x: finale.from.x + (to.x - finale.from.x) * progress, y: finale.from.y + (to.y - finale.from.y) * progress - Math.sin(progress * Math.PI) * 80 };
    finale.charge = progress;
    if (t % 3 === 0) finale.trail.push({ ...final.casterPos, life: 18 });
    if (t >= 44) launchOmegariusGiant(finale.nextDir, finale.throws === 1 ? 60 : 66, finale.throws === 1 ? 3.8 : 5);
  } else if (finale.step === 'clash') {
    // the giant hammer keeps pushing: Omegarius is dragged back while it resists
    final.casterPos = { x: Math.max(10, Math.min(canvas.width - caster.width - 10, finale.clashStartX - finale.clashSide * Math.min(70, t * 0.8))), y: final.casterPos.y };
    const pos = final.casterPos;
    finale.clashX = pos.x + caster.width / 2 + finale.clashSide * 50 + (Math.random() - 0.5) * 10;
    finale.clashY = pos.y + caster.height / 2 + (Math.random() - 0.5) * 10;
    final.shake = Math.max(final.shake, 10 + t / 10);
    caster.judgeSwing = 18 - (t % 18);
    if (t % 6 === 0) {
      addOmegariusFinalSpark(finale.clashX, finale.clashY, t % 12 === 0 ? '#26c6da' : '#ffe082');
      playOmegariusFinalSound('judgeParry', 5);
    }
    if (t === 1) setOmegariusFinalCaption('NNNGH...! NO... VOY A... PERDER!', '#ffca28', 95);
    if (t >= 100) {
      finale.step = 'boom';
      finale.t = 0;
      final.shake = 50;
      final.flash = 1;
      ['#ffffff', '#ffe082', '#26c6da', '#ffca28'].forEach((color) => addOmegariusFinalSpark(finale.clashX, finale.clashY, color));
      caster.health = 1;
      caster.judgeSwing = 0;
      final.finaleResult = 'parried';
      // the giant hammer is blown away, spinning off the screen
      finale.flyaway = { x: finale.clashX + finale.clashSide * 40, y: finale.clashY, vx: finale.clashSide * 11, vy: -15, rot: finale.clashSide * -1.4, spin: finale.clashSide * 0.45 };
      playSound('judgeSlam');
      playSound('robotBoom');
      playSound('jesterGiantSlam');
      updateHealthBars();
      setOmegariusFinalCaption('DEVUELTO!', '#26c6da', 150);
    }
  } else if (finale.step === 'boom' || finale.step === 'after') {
    // Omegarius is knocked back and drops to the floor
    const knock = finale.step === 'boom' && t < 20 ? -finale.clashSide * (20 - t) * 0.6 : 0;
    final.casterPos = { x: Math.max(10, Math.min(canvas.width - caster.width - 10, final.casterPos.x + knock)), y: Math.min(floorY, final.casterPos.y + 6) };
    if (finale.flyaway) {
      finale.flyaway.x += finale.flyaway.vx;
      finale.flyaway.y += finale.flyaway.vy;
      finale.flyaway.vy += 0.35;
      finale.flyaway.rot += finale.flyaway.spin;
      if (finale.flyaway.y > canvas.height + 200) finale.flyaway = null;
    }
    if (t >= 150) finale.done = true;
  }
  finale.trail = (finale.trail || []).filter((ghost) => (ghost.life -= 1) > 0);
}

function drawOmegariusFinale() {
  const final = omegariusFinal;
  const finale = final.finale;
  const caster = final.caster;
  const pos = final.casterPos;
  const centerX = pos.x + caster.width / 2;
  (finale.trail || []).forEach((ghost) => {
    ctx.fillStyle = `rgba(255, 202, 40, ${ghost.life / 50})`;
    ctx.fillRect(ghost.x, ghost.y, caster.width, caster.height);
  });
  if (finale.charge > 0 && (finale.step === 'rise' || finale.step === 'reposition')) {
    // a giant hammer of energy forming next to it (under it while it floats over the box), spinning slowly
    const scale = 0.4 + finale.charge * 1.2;
    const floating = pos.y < ground - caster.height - 40;
    const formX = floating ? centerX : centerX + (centerX < canvas.width / 2 ? 90 : -90);
    const formY = floating ? pos.y + caster.height + 40 + 30 * scale : pos.y - 20;
    const glow = ctx.createRadialGradient(formX, formY, 0, formX, formY, 110 * scale);
    glow.addColorStop(0, `rgba(255, 248, 225, ${0.55 * finale.charge})`);
    glow.addColorStop(1, 'rgba(255, 202, 40, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(formX - 110 * scale, formY - 110 * scale, 220 * scale, 220 * scale);
    ctx.strokeStyle = 'rgba(255, 236, 179, 0.7)';
    ctx.lineWidth = 2;
    for (let ray = 0; ray < 10; ray += 1) {
      const angle = Math.random() * Math.PI * 2;
      const reach = 150 * (1 - finale.charge) + 40 + Math.random() * 40;
      ctx.beginPath();
      ctx.moveTo(formX + Math.cos(angle) * reach, formY + Math.sin(angle) * reach);
      ctx.lineTo(formX + Math.cos(angle) * reach * 0.5, formY + Math.sin(angle) * reach * 0.5);
      ctx.stroke();
    }
    ctx.save();
    ctx.globalAlpha = 0.45 + finale.charge * 0.55;
    ctx.translate(formX, formY);
    ctx.rotate(final.frame * 0.05);
    drawOmegariusHammer(0, 50 * scale, 0, scale, 2);
    ctx.restore();
  }
  if (finale.step === 'clash' && Number.isFinite(finale.clashX)) {
    // the returned hammer grinding against Omegarius's hammer
    const hot = Math.floor(final.frame / 3) % 2 === 0;
    const burst = ctx.createRadialGradient(finale.clashX, finale.clashY, 0, finale.clashX, finale.clashY, 90);
    burst.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    burst.addColorStop(0.4, hot ? 'rgba(38, 198, 218, 0.7)' : 'rgba(255, 202, 40, 0.7)');
    burst.addColorStop(1, 'rgba(255, 202, 40, 0)');
    ctx.fillStyle = burst;
    ctx.fillRect(finale.clashX - 90, finale.clashY - 90, 180, 180);
    const grind = Math.sin(finale.t / 3) * 0.25;
    const pulse = 1 + Math.sin(finale.t / 2) * 0.06;
    ctx.save();
    ctx.translate(finale.clashX + finale.clashSide * 40, finale.clashY);
    ctx.rotate(finale.clashSide * -1.4 + grind + (Math.random() - 0.5) * 0.1);
    drawOmegariusHammer(0, 60 * pulse, 0, (66 / 36) * pulse, 1.8);
    ctx.restore();
    // grinding marks on the floor from being pushed back
    ctx.strokeStyle = 'rgba(255, 202, 40, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(finale.clashStartX + caster.width / 2, ground - 2);
    ctx.lineTo(pos.x + caster.width / 2, ground - 2);
    ctx.stroke();
  }
  if (finale.flyaway) {
    ctx.save();
    ctx.translate(finale.flyaway.x, finale.flyaway.y);
    ctx.rotate(finale.flyaway.rot);
    drawOmegariusHammer(0, 60, 0, 66 / 36, 1.8);
    ctx.restore();
  }
}

function hurtOmegariusFinalTarget() {
  const final = omegariusFinal;
  if (final.invulnerable > 0) return;
  const target = final.target;
  // percentage damage: it can never finish Reflecter off on its own
  const damage = target.health * omegariusFinalDamagePercent;
  if (target.health > 1) {
    target.health = Math.max(1, target.health - damage);
    getPlayerStats(target).damageTaken += damage;
    getPlayerStats(final.caster).damageDealt += damage;
  }
  final.invulnerable = 45;
  final.hits += 1;
  final.shake = 10;
  playSound('judgeFinalHurt');
  playOmegariusFinalSound('judgeHammerHit', 4);
  updateHealthBars();
}

function addOmegariusFinalSpark(x, y, color = '#ffe082') {
  for (let spark = 0; spark < 10; spark += 1) {
    const angle = Math.random() * Math.PI * 2;
    omegariusFinal.sparks.push({ x, y, vx: Math.cos(angle) * (2 + Math.random() * 4), vy: Math.sin(angle) * (2 + Math.random() * 4), life: 20 + Math.random() * 12, color });
  }
}

function getOmegariusFinalInput() {
  const final = omegariusFinal;
  const pick = (up, down, left, right) => ({
    x: (right ? 1 : 0) - (left ? 1 : 0),
    y: (down ? 1 : 0) - (up ? 1 : 0),
    dir: up ? 'up' : down ? 'down' : left ? 'left' : right ? 'right' : null,
  });
  if (final.target === player1) return pick(keys.w, keys.s, keys.a, keys.d);
  if (!botEnabled) return pick(keys.ArrowUp, keys.ArrowDown, keys.ArrowLeft, keys.ArrowRight);
  // a bot inside the box: steps away from the closest danger and points the shield at the next hammer (misses some)
  const soul = final.soul;
  const soulX = soul.x + soul.width / 2;
  const soulY = soul.y + soul.height / 2;
  const next = final.items.filter((item) => item.type === 'incoming' && !(item.warn > 0)).sort((a, b) => a.dist - b.dist)[0];
  if (next && next.botMiss === undefined) next.botMiss = Math.random() < 0.2;
  let x = 0;
  let y = 0;
  const threat = final.items
    .filter((item) => item.type !== 'incoming' && item.type !== 'beam' && item.type !== 'wave' && !(item.warn > 0) && Number.isFinite(item.x))
    .sort((a, b) => Math.hypot(a.x - soulX, a.y - soulY) - Math.hypot(b.x - soulX, b.y - soulY))[0];
  if (threat && Math.hypot(threat.x - soulX, threat.y - soulY) < 90) {
    x = Math.sign(soulX - threat.x);
    y = Math.sign(soulY - threat.y);
  }
  return { x, y, dir: next && !next.botMiss ? next.dir : null };
}

function moveOmegariusFinalSoul() {
  const final = omegariusFinal;
  const soul = final.soul;
  const box = final.box;
  if (final.mode === 'free' && final.stage !== 'intro') {
    const input = getOmegariusFinalInput();
    const moveX = input.x;
    const moveY = input.y;
    const length = Math.hypot(moveX, moveY) || 1;
    soul.x += (moveX / length) * 5.2;
    soul.y += (moveY / length) * 5.2;
  } else {
    // shield mode (and the intro): the soul is pulled to the middle and stays there
    const center = getOmegariusFinalCenter();
    soul.x += (center.x - soul.width / 2 - soul.x) * 0.2;
    soul.y += (center.y - soul.height / 2 - soul.y) * 0.2;
    if (final.mode === 'shield') {
      const input = getOmegariusFinalInput();
      if (input.dir) final.shieldDir = input.dir;
    }
  }
  soul.x = Math.max(box.x + 4, Math.min(box.x + box.width - 4 - soul.width, soul.x));
  soul.y = Math.max(box.y + 4, Math.min(box.y + box.height - 4 - soul.height, soul.y));
}

function updateOmegariusFinalItems() {
  const final = omegariusFinal;
  const soul = final.soul;
  const soulX = soul.x + soul.width / 2;
  const soulY = soul.y + soul.height / 2;
  const soulRadius = Math.min(soul.width, soul.height) / 2;
  const box = final.box;
  const center = getOmegariusFinalCenter();
  final.items.forEach((item) => {
    if (item.warn > 0) {
      item.warn -= 1;
      if (item.type === 'incoming' && item.warn === 0) {
        omegariusFinalThrowPose();
        playOmegariusFinalSound(item.kind === 'orb' ? 'judgeBeamFire' : 'judgeThrow', 6);
      }
      return;
    }
    if (item.type === 'beam') {
      item.fire -= 1;
      if (item.fire === 23) playOmegariusFinalSound('titanLaser', 10);
      const inside = item.horizontal ? Math.abs(soulY - item.pos) < item.thickness / 2 + soulRadius : Math.abs(soulX - item.pos) < item.thickness / 2 + soulRadius;
      if (inside) hurtOmegariusFinalTarget();
      if (item.fire <= 0) item.done = true;
      return;
    }
    if (item.type === 'incoming') {
      item.dist -= item.speed;
      item.rot += item.spin;
      const dir = omegariusFinalDirections[item.dir];
      item.x = center.x + dir.x * item.dist;
      item.y = center.y + dir.y * item.dist;
      if (item.dist <= 34 + item.r * 0.5 && final.shieldDir === item.dir) {
        // parried!
        item.done = true;
        final.parries += 1;
        addOmegariusFinalSpark(item.x, item.y, '#26c6da');
        playOmegariusFinalSound('judgeParry', 3);
        if (item.kind === 'giant') onOmegariusGiantParried(item);
      } else if (item.dist <= 8) {
        item.done = true;
        if (item.kind === 'giant') final.invulnerable = 0;
        hurtOmegariusFinalTarget();
        if (item.kind === 'giant') {
          addOmegariusFinalSpark(item.x, item.y);
          onOmegariusGiantHit();
        }
      }
      return;
    }
    if (item.type === 'returning') {
      // the giant hammer flies back to Omegarius, wherever it is
      const pos = final.casterPos;
      const targetX = pos.x + final.caster.width / 2;
      const targetY = pos.y + final.caster.height / 2;
      item.x += (targetX - item.x) * 0.13;
      item.y += (targetY - item.y) * 0.13;
      item.rot += 0.6;
      if (Math.hypot(targetX - item.x, targetY - item.y) < 34) {
        item.done = true;
        onOmegariusGiantReturned();
      }
      return;
    }
    item.life -= 1;
    item.x += item.vx;
    item.y += item.vy;
    if (item.ax) item.vx += item.ax;
    if (item.spin) item.rot += item.spin;
    if (item.type === 'wave') {
      const inWall = Math.abs(soulX - item.x) < 14 + soulRadius;
      const inGap = soulY > item.gapY + soulRadius && soulY < item.gapY + item.gapHeight - soulRadius;
      if (inWall && !inGap) hurtOmegariusFinalTarget();
      if (item.x < box.x - 40 || item.x > box.x + box.width + 40) item.done = item.life < 180;
    } else {
      if (Math.hypot(item.x - soulX, item.y - soulY) < item.r + soulRadius) hurtOmegariusFinalTarget();
      if (item.type === 'bouncer') {
        if (item.x < box.x + item.r || item.x > box.x + box.width - item.r) {
          item.vx *= -1;
          item.x = Math.max(box.x + item.r, Math.min(box.x + box.width - item.r, item.x));
          playOmegariusFinalSound('judgeFinalWarn', 8);
        }
        if (item.y < box.y + item.r || item.y > box.y + box.height - item.r) {
          item.vy *= -1;
          item.y = Math.max(box.y + item.r, Math.min(box.y + box.height - item.r, item.y));
          playOmegariusFinalSound('judgeFinalWarn', 8);
        }
      }
      if (item.type === 'rain' && item.y > box.y + box.height + 10) {
        item.done = true;
        addOmegariusFinalSpark(item.x, box.y + box.height - 4);
        playOmegariusFinalSound('robotHit', 8);
      }
      if (item.type === 'boomerang' && item.life < 100 && (item.x < box.x - 60 || item.x > box.x + box.width + 60)) item.done = true;
      if (item.type === 'orb' && (item.x < box.x - 60 || item.y < box.y - 60 || item.y > box.y + box.height + 60)) item.done = true;
      if (item.type === 'storm' && item.x < box.x - 50) item.done = true;
    }
    if (item.life <= 0) item.done = true;
  });
  final.items = final.items.filter((item) => !item.done);
  final.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.92;
    spark.vy *= 0.92;
    spark.life -= 1;
  });
  final.sparks = final.sparks.filter((spark) => spark.life > 0);
}

function drawOmegariusFinalItem(item) {
  const final = omegariusFinal;
  const box = final.box;
  if (item.type === 'beam') {
    if (item.warn > 0) {
      ctx.strokeStyle = Math.floor(item.warn / 4) % 2 === 0 ? 'rgba(255, 202, 40, 0.8)' : 'rgba(255, 202, 40, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.strokeRect(item.horizontal ? box.x : item.pos - item.thickness / 2, item.horizontal ? item.pos - item.thickness / 2 : box.y, item.horizontal ? box.width : item.thickness, item.horizontal ? item.thickness : box.height);
      ctx.setLineDash([]);
    } else {
      ctx.shadowColor = '#ffca28';
      ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255, 202, 40, 0.85)';
      if (item.horizontal) ctx.fillRect(box.x, item.pos - item.thickness / 2, box.width, item.thickness);
      else ctx.fillRect(item.pos - item.thickness / 2, box.y, item.thickness, box.height);
      ctx.fillStyle = '#fff8e1';
      if (item.horizontal) ctx.fillRect(box.x, item.pos - 5, box.width, 10);
      else ctx.fillRect(item.pos - 5, box.y, 10, box.height);
      ctx.shadowBlur = 0;
    }
    return;
  }
  if (item.type === 'wave') {
    if (item.warn > 0) {
      ctx.fillStyle = Math.floor(item.warn / 4) % 2 === 0 ? 'rgba(255, 202, 40, 0.8)' : 'rgba(255, 202, 40, 0.3)';
      ctx.font = '900 26px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.vx > 0 ? '>>' : '<<', item.vx > 0 ? box.x + 24 : box.x + box.width - 24, item.gapY + item.gapHeight / 2 + 8);
      return;
    }
    ctx.shadowColor = '#ffca28';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(255, 202, 40, 0.85)';
    ctx.fillRect(item.x - 12, box.y, 24, item.gapY - box.y);
    ctx.fillRect(item.x - 12, item.gapY + item.gapHeight, 24, box.y + box.height - item.gapY - item.gapHeight);
    ctx.shadowBlur = 0;
    return;
  }
  if (item.warn > 0 && item.type !== 'incoming') {
    // warning marks at the edge of the box
    ctx.fillStyle = Math.floor(item.warn / 4) % 2 === 0 ? '#ffca28' : 'rgba(255, 202, 40, 0.3)';
    ctx.font = '900 24px Courier New, monospace';
    ctx.textAlign = 'center';
    if (item.type === 'rain') {
      ctx.fillText('!', item.x, box.y + 26);
      ctx.strokeStyle = 'rgba(255, 202, 40, 0.25)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(item.x, box.y);
      ctx.lineTo(item.x, box.y + box.height);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (item.type === 'boomerang') {
      ctx.fillText('!', item.side < 0 ? box.x + 14 : box.x + box.width - 14, item.y + 8);
    } else {
      ctx.fillText('!', item.x, item.y + 8);
    }
    return;
  }
  if (item.type === 'incoming' && item.warn > 0) return;
  if (item.type === 'orb' || item.kind === 'orb') {
    ctx.shadowColor = '#ffca28';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    return;
  }
  // hammers (boomerang, rain, bouncer, incoming, giant, returning)
  const scale = item.r / 36;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot || 0);
  drawOmegariusHammer(0, 50 * scale, 0, scale, item.kind === 'giant' || item.type === 'returning' ? 1.6 : 1.1);
  ctx.restore();
}

function drawOmegariusFinalSoul() {
  const final = omegariusFinal;
  const target = final.target;
  const soul = final.soul;
  const centerX = soul.x + soul.width / 2;
  const centerY = soul.y + soul.height / 2;
  if (final.mode === 'shield' && final.stage !== 'intro') {
    // Reflecter's shield, pointed where the player chose
    const dir = omegariusFinalDirections[final.shieldDir];
    ctx.save();
    ctx.strokeStyle = '#26c6da';
    ctx.shadowColor = '#26c6da';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, dir.angle - 0.75, dir.angle + 0.75);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (final.invulnerable > 0 && Math.floor(final.invulnerable / 4) % 2 === 0) return;
  const savedPosition = { ...target.position };
  const savedFacing = target.attacksToTheRight;
  ctx.save();
  ctx.fillStyle = 'rgba(38, 198, 218, 0.16)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(centerX, centerY);
  ctx.scale(0.3, 0.3);
  target.position = { x: -target.width / 2, y: -target.height / 2 };
  target.attacksToTheRight = true;
  target.isAttacking = false;
  target.draw();
  ctx.restore();
  target.position = savedPosition;
  target.attacksToTheRight = savedFacing;
}

function finishOmegariusFinalAct() {
  const final = omegariusFinal;
  const target = final.target;
  const caster = final.caster;
  final.active = false;
  target.position.x = 260;
  target.position.y = ground - target.height;
  target.velocity.x = 0;
  target.velocity.y = 0;
  caster.position.x = 660;
  caster.position.y = ground - caster.height;
  caster.velocity.x = 0;
  caster.velocity.y = 0;
  caster.judgeSwing = 0;
  // it gave everything: from now on it just waits for the last blow
  caster.omegariusExhausted = true;
  robotShots = [];
  resetKeys();
  updateHealthBars();
  if (isOmegariusSparring()) startMidFightCh7Cutscene('ch7FinalEnd', upgradeSceneLines(ch7FinalEndLines));
  else jesterWhiteFade = 50;
}

function updateOmegariusFinalAct() {
  const final = omegariusFinal;
  final.frame += 1;
  if (final.invulnerable > 0) final.invulnerable -= 1;
  final.shake *= 0.88;
  const caster = final.caster;
  if (caster.judgeSwing > 0) caster.judgeSwing -= 1;
  if (caster.omegariusParryFlash > 0) caster.omegariusParryFlash -= 1;

  if (final.stage === 'intro') {
    if (final.frame >= omegariusFinalIntroFrames) startOmegariusFinalPhase(0);
  } else if (final.stage === 'phase') {
    final.phaseFrame += 1;
    const phase = omegariusFinalPhases[final.phaseIndex];
    const phaseDone = phase.pattern === 'finale' ? Boolean(final.finale && final.finale.done) : final.phaseFrame >= phase.frames;
    if (phaseDone) {
      if (final.phaseIndex + 1 < omegariusFinalPhases.length) {
        startOmegariusFinalPhase(final.phaseIndex + 1);
      } else {
        final.stage = 'white';
        final.whiteFrame = 0;
        playSound('jesterFinalWhite');
        final.items = [];
      }
    } else if (phase.pattern === 'finale') {
      if (final.hitStop <= 0) updateOmegariusFinale();
    } else if (final.phaseFrame > omegariusFinalTransitionFrames && final.phaseFrame < phase.frames - 40) {
      spawnOmegariusFinalPattern(phase, final.phaseFrame - omegariusFinalTransitionFrames);
    }
  } else if (final.stage === 'white') {
    final.whiteFrame += 1;
    if (final.whiteFrame >= omegariusFinalWhiteFrames) {
      finishOmegariusFinalAct();
      return;
    }
  }

  // the box eases into its size for the current mode
  ['x', 'y', 'width', 'height'].forEach((key) => {
    final.box[key] += (final.boxTarget[key] - final.box[key]) * 0.14;
  });
  // hit stop: everything freezes for an instant on a big parry
  if (final.hitStop > 0) {
    final.hitStop -= 1;
  } else {
    moveOmegariusFinalSoul();
    updateOmegariusFinalItems();
  }
  final.flash *= 0.9;

  // ----- drawing -----
  const introProgress = Math.min(1, final.frame / 60);
  ctx.save();
  ctx.translate((Math.random() - 0.5) * final.shake, (Math.random() - 0.5) * final.shake);
  drawFactoryHiddenStage(4);
  ctx.fillStyle = `rgba(0, 0, 0, ${0.8 * introProgress})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  // Omegarius at the side (or wherever the finale takes it), throwing everything it has
  if (final.finale) drawOmegariusFinale();
  const savedPosition = { ...caster.position };
  caster.position = { ...final.casterPos };
  caster.attacksToTheRight = final.casterPos.x + caster.width / 2 < getOmegariusFinalCenter().x;
  caster.isAttacking = false;
  if (final.finale && final.casterPos.y < ground - caster.height - 4) {
    const aura = ctx.createRadialGradient(final.casterPos.x + caster.width / 2, final.casterPos.y + caster.height / 2, 10, final.casterPos.x + caster.width / 2, final.casterPos.y + caster.height / 2, 140);
    aura.addColorStop(0, 'rgba(255, 202, 40, 0.35)');
    aura.addColorStop(1, 'rgba(255, 202, 40, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(final.casterPos.x - 120, final.casterPos.y - 100, caster.width + 240, caster.height + 200);
  }
  caster.draw();
  caster.position = savedPosition;
  // the box
  const box = final.box;
  ctx.fillStyle = '#050302';
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeStyle = '#ffca28';
  ctx.shadowColor = '#ffca28';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 4;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.shadowBlur = 0;
  // items: clipped to the box in free mode, flying in from outside in shield mode
  ctx.save();
  if (final.mode === 'free') {
    ctx.beginPath();
    ctx.rect(box.x - 2, box.y - 2, box.width + 4, box.height + 4);
    ctx.clip();
  }
  final.items.filter((item) => item.type !== 'returning').forEach(drawOmegariusFinalItem);
  ctx.restore();
  drawOmegariusFinalSoul();
  final.items.filter((item) => item.type === 'returning').forEach(drawOmegariusFinalItem);
  final.sparks.forEach((spark) => {
    ctx.fillStyle = spark.color;
    ctx.globalAlpha = Math.min(1, spark.life / 20);
    ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
    ctx.globalAlpha = 1;
  });
  // counters
  ctx.font = '900 16px Courier New, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffca28';
  const phaseNumber = Math.max(0, final.phaseIndex) + 1;
  if (final.stage !== 'intro') ctx.fillText(`ASALTO ${Math.min(phaseNumber, omegariusFinalPhases.length)}/${omegariusFinalPhases.length}`, 24, 120);
  ctx.fillStyle = '#26c6da';
  if (final.parries > 0) ctx.fillText(`PARRIES: ${final.parries}`, 24, 142);
  // mode banner
  if (final.banner && final.banner.life > 0) {
    final.banner.life -= 1;
    ctx.globalAlpha = Math.min(1, final.banner.life / 20);
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = final.mode === 'shield' ? '#26c6da' : '#ffca28';
    ctx.font = '900 34px Courier New, monospace';
    const bannerY = box.y + box.height + 40;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(box.x + box.width / 2 - 300, bannerY - 32, 600, 60);
    ctx.fillStyle = final.mode === 'shield' ? '#26c6da' : '#ffca28';
    ctx.strokeText(final.banner.title, box.x + box.width / 2, bannerY);
    ctx.fillText(final.banner.title, box.x + box.width / 2, bannerY);
    ctx.font = '700 15px Courier New, monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(final.banner.subtitle, box.x + box.width / 2, bannerY + 20);
    ctx.globalAlpha = 1;
  }
  // title
  if (final.stage === 'intro') {
    ctx.globalAlpha = Math.min(1, final.frame / 30);
    ctx.fillStyle = '#ffca28';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 7;
    ctx.font = '900 54px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText('ULTIMO ASALTO', canvas.width / 2, 120);
    ctx.fillText('ULTIMO ASALTO', canvas.width / 2, 120);
    ctx.font = '700 16px Courier New, monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('Omegarius da todo lo que le queda. Aguanta dentro de la caja!', canvas.width / 2, 150);
    ctx.globalAlpha = 1;
  }
  if (final.caption && final.caption.life > 0) {
    // big shouted captions (Omegarius's lines and the parry calls)
    const caption = final.caption;
    caption.life -= 1;
    const age = caption.maxLife - caption.life;
    const pop = 1 + Math.max(0, (8 - age) / 10);
    ctx.save();
    ctx.globalAlpha = Math.min(1, caption.life / 15);
    ctx.translate(canvas.width / 2 + (Math.random() - 0.5) * (age < 10 ? 6 : 1), box.y - 24);
    ctx.scale(pop, pop);
    ctx.font = '900 30px Courier New, monospace';
    ctx.textAlign = 'center';
    const captionWidth = ctx.measureText(caption.text).width + 40;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-captionWidth / 2, -30, captionWidth, 42);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = caption.color;
    ctx.strokeText(caption.text, 0, 0);
    ctx.fillText(caption.text, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  if (final.flash > 0.02) {
    ctx.fillStyle = `rgba(255, 252, 240, ${final.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (final.stage === 'white') {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, final.whiteFrame / 18)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ------------------------------------------------ NEO SCAMMER ------------------------------------------------
// three unpredictable abilities inspired by Spamton NEO: a BIG SHOT that is never the same, [[PIPIS]] eggs and chasing heads
function isNeoScammer(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'neoScammer');
}

function setNeoScammerGap(attacker) {
  // irregular pauses between abilities, so the rhythm can't be learned
  attacker.neoGap = 40 + Math.floor(Math.random() * 60);
}

function updateNeoScammer(fighter) {
  ['neoBigShotCooldown', 'neoPipisCooldown', 'neoHeadsCooldown', 'neoGap'].forEach((key) => {
    if (fighter[key] > 0) fighter[key] -= 1;
  });
  if (fighter.neoCharge > 0) {
    fighter.neoCharge -= 1;
    fighter.velocity.x = 0;
    if (fighter.neoCharge === 0) fireNeoBigShot(fighter);
  }
}

// 1) BIG SHOT: charges the cannon arm... then either one huge shot or three smaller ones at different speeds
function startNeoBigShot(attacker, target) {
  if (attacker.neoCharge > 0 || attacker.neoBigShotCooldown > 0) return false;
  attacker.neoCharge = 45;
  attacker.attacksToTheRight = getFighterCenterX(target) >= getFighterCenterX(attacker);
  attacker.neoBigShotCooldown = getDebugCooldown(neoBigShotCooldown, attacker);
  setNeoScammerGap(attacker);
  recordSpecialUsed(attacker);
  playSound('judgeBeamCharge');
  return true;
}

function fireNeoBigShot(attacker) {
  const target = getOpponent(attacker);
  const direction = attacker.attacksToTheRight ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width + 30 : attacker.position.x - 86;
  if (Math.random() < 0.4) {
    [8, 11, 14].forEach((speed) => {
      robotShots.push(new RobotShot({ kind: 'bigShot', variant: 'small', x: startX, y: ground - 96, direction, attacker, target, velocityX: getDebugProjectileSpeed(speed, attacker) * direction }));
    });
  } else {
    robotShots.push(new RobotShot({ kind: 'bigShot', x: startX, y: ground - 100, direction, attacker, target, velocityX: getDebugProjectileSpeed(9 + Math.random() * 5, attacker) * direction }));
  }
  playSound('judgeBeamFire');
  playSound('cutsceneCash');
}

// 2) [[PIPIS]]: eggs thrown in an arc that hatch into little heads flying anywhere
function castNeoPipis(attacker, target) {
  if (attacker.neoPipisCooldown > 0) return false;
  const eggs = 1 + Math.floor(Math.random() * 2);
  const distance = getFighterCenterX(target) - getFighterCenterX(attacker);
  for (let egg = 0; egg < eggs; egg += 1) {
    robotShots.push(new RobotShot({
      kind: 'pipis',
      x: getFighterCenterX(attacker) - 11,
      y: attacker.position.y + 40,
      direction: Math.sign(distance) || 1,
      attacker,
      target,
      velocityX: distance / 52 + (Math.random() - 0.5) * 4,
      velocityY: -9 - Math.random() * 3,
    }));
  }
  attacker.neoPipisCooldown = getDebugCooldown(neoPipisCooldown, attacker);
  setNeoScammerGap(attacker);
  recordSpecialUsed(attacker);
  playSound('cutsceneLaugh');
  return true;
}

function burstNeoPipis(shot) {
  const centerX = shot.position.x + shot.width / 2;
  const centerY = Math.min(shot.position.y, ground - 30);
  const heads = 3 + Math.floor(Math.random() * 3);
  for (let head = 0; head < heads; head += 1) {
    const angle = Math.PI * (0.1 + Math.random() * 0.8);
    robotShots.push(new RobotShot({
      kind: 'neoHead',
      variant: 'burst',
      x: centerX - 12,
      y: centerY - 12,
      direction: Math.cos(angle) >= 0 ? 1 : -1,
      attacker: shot.attacker,
      target: shot.target,
      velocityX: Math.cos(angle) * (3 + Math.random() * 3),
      velocityY: -Math.sin(angle) * (5 + Math.random() * 3),
    }));
  }
  playSound('dumpsterBurst');
}

// 3) chasing heads: 2 or 3 heads that hunt the opponent for a couple of seconds
function castNeoHeads(attacker, target) {
  if (attacker.neoHeadsCooldown > 0) return false;
  const heads = 2 + Math.floor(Math.random() * 2);
  for (let head = 0; head < heads; head += 1) {
    robotShots.push(new RobotShot({
      kind: 'neoHead',
      variant: 'homing',
      x: getFighterCenterX(attacker) - 12 + (head - 1) * 30,
      y: attacker.position.y + 20,
      direction: 1,
      attacker,
      target,
      velocityX: (Math.random() - 0.5) * 6,
      velocityY: -4 - Math.random() * 2,
      timer: 120 + Math.floor(Math.random() * 50),
    }));
  }
  attacker.neoHeadsCooldown = getDebugCooldown(neoHeadsCooldown, attacker);
  setNeoScammerGap(attacker);
  recordSpecialUsed(attacker);
  playSound('cutsceneQuestion');
  playSound('robotMagnet');
  return true;
}

// ------------------------------------------------ NEO SCAMMER: ULTIMA OFERTA (final act) ------------------------------------------------
// the opponent is shrunk inside a box and moves freely to dodge Scammer's and NEO's attacks
function castScamFinalAct(attacker, target) {
  if (scamFinal.active) return false;
  robotShots = [];
  attacker.neoCharge = 0;
  const soulWidth = Math.round(target.width * 0.3);
  const soulHeight = Math.round(target.height * 0.3);
  const box = { ...scamFinalBox };
  Object.assign(scamFinal, {
    active: true,
    frame: 0,
    caster: attacker,
    target,
    stage: 'intro',
    phaseIndex: -1,
    phaseFrame: 0,
    box: { x: getFighterCenterX(target) - 30, y: target.position.y + 20, width: 60, height: 80 },
    boxTarget: box,
    soul: { x: box.x + box.width / 2 - soulWidth / 2, y: box.y + box.height / 2 - soulHeight / 2, width: soulWidth, height: soulHeight },
    items: [],
    sparks: [],
    invulnerable: 0,
    shake: 0,
    hits: 0,
    nextSpawn: 0,
    spawnCount: 0,
    banner: null,
    caption: null,
    flash: 0,
    whiteFrame: 0,
    finale: null,
    lastSounds: {},
    // (route B extras never carry over into another NEO fight)
    routeB: false,
    rbItems: [],
    rbShots: [],
    shootOn: false,
  });
  recordSpecialUsed(attacker);
  resetKeys();
  playSound('judgeFinalStart');
  playSound('cutsceneLaugh');
  return true;
}

function playScamFinalSound(name, gap = 5) {
  const final = scamFinal;
  if (final.frame - (final.lastSounds[name] ?? -999) < gap) return;
  final.lastSounds[name] = final.frame;
  playSound(name);
}

function setScamFinalCaption(text, color = '#fdd835', life = 110) {
  scamFinal.caption = { text, color, life, maxLife: life };
}

function startScamFinalPhase(index) {
  const final = scamFinal;
  const phase = scamFinalPhases[index];
  final.stage = 'phase';
  final.phaseIndex = index;
  final.phaseFrame = 0;
  final.nextSpawn = 0;
  final.spawnCount = 0;
  final.items = final.items.filter((item) => item.type !== 'spinner');
  final.banner = { title: phase.title, subtitle: phase.subtitle, life: 120 };
  if (phase.pattern === 'finale') final.finale = { t: 0, beams: 0, done: false };
  playSound('judgeFinalMode');
}

function getScamFinalSoulCenter() {
  const soul = scamFinal.soul;
  return { x: soul.x + soul.width / 2, y: soul.y + soul.height / 2 };
}

// ----- the attacks -----
function spawnScamEgg(x) {
  const box = scamFinal.boxTarget;
  scamFinal.items.push({ type: 'egg', x, y: box.y - 16, vx: (Math.random() - 0.5) * 1.5, vy: 2, r: 11, warn: 26, rot: 0 });
  playScamFinalSound('judgeFinalWarn', 6);
}

function spawnScamChaser(side, speed = 3.9) {
  const box = scamFinal.boxTarget;
  scamFinal.items.push({ type: 'chaser', x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: box.y + 30 + Math.random() * (box.height - 60), vx: side * -2, vy: 0, r: 11, warn: 0, timer: 130, life: 340, speed });
  playScamFinalSound('cutsceneQuestion', 10);
}

function spawnScamPhone() {
  const final = scamFinal;
  const box = final.boxTarget;
  const soul = getScamFinalSoulCenter();
  const edge = ['left', 'right', 'top', 'bottom'][Math.floor(Math.random() * 4)];
  const startX = edge === 'left' ? box.x - 24 : edge === 'right' ? box.x + box.width + 24 : box.x + 20 + Math.random() * (box.width - 40);
  const startY = edge === 'top' ? box.y - 24 : edge === 'bottom' ? box.y + box.height + 24 : box.y + 20 + Math.random() * (box.height - 40);
  // aimed at where you are right now
  const angle = Math.atan2(soul.y - startY, soul.x - startX);
  final.items.push({ type: 'phone', x: startX, y: startY, ox: startX, oy: startY, vx: Math.cos(angle) * 6.8, vy: Math.sin(angle) * 6.8, r: 12, warn: 20, rot: angle, life: 200 });
  playScamFinalSound('robotTick', 6);
}

function spawnScamTagWall(side) {
  const box = scamFinal.boxTarget;
  const gapIndex = Math.floor(Math.random() * 4);
  for (let row = 0; row < 4; row += 1) {
    if (row === gapIndex) continue;
    scamFinal.items.push({ type: 'tag', x: side < 0 ? box.x - 80 : box.x + box.width + 10, y: box.y + 14 + row * ((box.height - 28) / 4), w: 70, h: 26, vx: side < 0 ? 3.4 : -3.4, vy: 0, warn: 20, life: 260 });
  }
  playScamFinalSound('cutsceneCash', 20);
}

function spawnScamShot(y, speed) {
  const box = scamFinal.boxTarget;
  scamFinal.items.push({ type: 'shot', x: box.x + box.width + 20, y, vx: -speed, vy: 0, r: 10, warn: 0, life: 200 });
  playScamFinalSound('judgeBeamFire', 12);
}

function spawnScamDiamondFan(count, spread) {
  const final = scamFinal;
  const soul = getScamFinalSoulCenter();
  const originX = final.boxTarget.x + final.boxTarget.width + 40;
  const originY = final.boxTarget.y + final.boxTarget.height / 2 + (Math.random() - 0.5) * 120;
  const baseAngle = Math.atan2(soul.y - originY, soul.x - originX);
  for (let index = 0; index < count; index += 1) {
    const angle = baseAngle + (index - (count - 1) / 2) * spread;
    final.items.push({ type: 'diamond', x: originX, y: originY, vx: Math.cos(angle) * 5.2, vy: Math.sin(angle) * 5.2, r: 7, warn: 0, rot: angle, life: 220, pink: index % 2 === 0 });
  }
  playScamFinalSound('judgeThrow', 10);
}

function spawnScamSpinner() {
  const box = scamFinal.boxTarget;
  scamFinal.items.push({ type: 'spinner', x: box.x + box.width / 2, y: box.y + box.height / 2, angle: Math.random() * Math.PI, speed: 0.014, warn: 50, arms: 3 });
  playScamFinalSound('cutsceneCash', 10);
}

function spawnScamPattern(phase, t) {
  const final = scamFinal;
  if (phase.pattern.startsWith('rb')) {
    spawnRouteBPattern(phase, t);
    return;
  }
  if (final.routeB) spawnRouteBRedExtras(phase, t);
  if (t < final.nextSpawn) return;
  const box = final.boxTarget;
  const randomX = () => box.x + 24 + Math.random() * (box.width - 48);
  const randomY = () => box.y + 24 + Math.random() * (box.height - 48);
  final.spawnCount += 1;
  const count = final.spawnCount;
  const late = t > 400;
  if (phase.pattern === 'eggs') {
    // some eggs fall right above you
    spawnScamEgg(count % 3 === 0 ? Math.max(box.x + 20, Math.min(box.x + box.width - 20, getScamFinalSoulCenter().x)) : randomX());
    if (count % 2 === 0) spawnScamEgg(randomX());
    final.nextSpawn = t + (late ? 18 : 24);
  } else if (phase.pattern === 'chasers') {
    if (count % 3 === 1) {
      spawnScamChaser(-1);
      spawnScamChaser(1);
      spawnScamChaser(Math.random() < 0.5 ? -1 : 1, 4.4);
    } else {
      spawnScamEgg(randomX());
    }
    final.nextSpawn = t + (late ? 34 : 42);
  } else if (phase.pattern === 'phones') {
    spawnScamPhone();
    if (late) spawnScamPhone();
    if (count % 3 === 0) spawnScamTagWall(count % 6 === 0 ? -1 : 1);
    final.nextSpawn = t + (late ? 24 : 28);
  } else if (phase.pattern === 'lanes') {
    // a stream of small BIG SHOTS with a safe lane that drifts up and down (narrower and faster over time)
    const laneCenter = box.y + box.height / 2 + Math.sin(t / 65) * (box.height / 2 - 55);
    const laneHalf = late ? 34 : 44;
    let y = randomY();
    for (let tries = 0; tries < 8 && Math.abs(y - laneCenter) < laneHalf + 12; tries += 1) y = randomY();
    if (Math.abs(y - laneCenter) >= laneHalf + 12) spawnScamShot(y, 6.5 + Math.min(3, t / 280));
    if (count % 40 === 0) spawnScamEgg(randomX());
    final.nextSpawn = t + (late ? 4 : 6);
  } else if (phase.pattern === 'diamonds') {
    spawnScamDiamondFan(late ? 8 : 6, 0.15);
    if (count % 3 === 0) spawnScamChaser(Math.random() < 0.5 ? -1 : 1);
    final.nextSpawn = t + (late ? 28 : 38);
  } else if (phase.pattern === 'spinner') {
    if (count === 1) spawnScamSpinner();
    if (count % 2 === 0) spawnScamEgg(randomX());
    if (count % 3 === 0) spawnScamPhone();
    final.nextSpawn = t + (late ? 44 : 56);
  } else if (phase.pattern === 'mix') {
    // everything at once, at random
    const pick = Math.floor(Math.random() * 5);
    if (pick === 0) spawnScamEgg(randomX());
    else if (pick === 1) spawnScamPhone();
    else if (pick === 2) spawnScamDiamondFan(5, 0.18);
    else if (pick === 3) spawnScamChaser(Math.random() < 0.5 ? -1 : 1, 4.2);
    else spawnScamTagWall(Math.random() < 0.5 ? -1 : 1);
    if (count % 4 === 0) spawnScamEgg(randomX());
    final.nextSpawn = t + (late ? 18 : 24);
  }
}

// the last one: he charges, then three giant BIG SHOTS that fill the box except for a safe stripe
function getScamCannonMuzzle() {
  // NEO SCAMMER is drawn at x 800 facing left during the act: where his cannon points
  const caster = scamFinal.caster;
  return { x: 800 + caster.width / 2 - 34 - 70, y: ground - caster.height + 94 };
}

function shrinkScamFinalBox(amount) {
  const base = scamFinalBox;
  scamFinal.boxTarget = { x: base.x + amount, y: base.y + amount * 0.7, width: base.width - amount * 2, height: base.height - amount * 1.4 };
}

function getScamUltimateSafeSpot(item) {
  const box = scamFinal.box;
  return {
    x: box.x + box.width / 2 + Math.sin(item.t / 45) * (box.width / 2 - 50),
    y: box.y + box.height / 2 + Math.sin(item.t / 31) * (box.height / 2 - 45),
    r: 38,
  };
}

function updateScamFinale() {
  const final = scamFinal;
  // route B: Fire Master resists... until the white flash
  if (final.routeB) {
    updateRouteBFinale(final);
    return;
  }
  const finale = final.finale;
  const caster = final.caster;
  finale.t += 1;
  finale.step = finale.step || 'charge';
  finale.stepT = (finale.stepT || 0) + 1;
  const t = finale.stepT;
  const box = final.boxTarget;
  if (finale.step === 'charge') {
    // the room goes dark, a giant NEO SCAMMER looms behind the box and the energy gathers in his cannon
    if (t === 1) {
      setScamFinalCaption('KID... KID!! KIIIIID!!!', '#ff4081', 70);
      playSound('judgeSecretCharge');
    }
    if (t === 72) setScamFinalCaption('MI ULTIMO... Y MAS CARO... [[BIG SHOT]]!!!', '#fdd835', 90);
    if (t % 30 === 0) playSound('jesterHeartbeat');
    caster.neoCharge = 30;
    final.shake = Math.max(final.shake, t / 25);
    if (t >= 150) {
      finale.step = 'beams';
      finale.stepT = 0;
    }
  } else if (finale.step === 'beams') {
    // five giant shots; the box gets smaller with each one
    caster.neoCharge = 0;
    if (t % 100 === 1 && finale.beams < 5) {
      shrinkScamFinalBox((finale.beams + 1) * 11);
      const bandHeight = 74 - finale.beams * 7;
      const bandY = box.y + 10 + Math.random() * (box.height - bandHeight - 20);
      final.items.push({ type: 'finalShot', bandY, bandHeight, warn: finale.beams < 2 ? 56 : 46, fire: 32 });
      finale.beams += 1;
      final.recoil = 1;
      playSound('titanLaserCharge');
    }
    if (t % 40 === 0 && finale.beams < 5) spawnScamEgg(box.x + 24 + Math.random() * (box.width - 48));
    if (finale.beams >= 5 && !final.items.some((item) => item.type === 'finalShot') && t > 480) {
      finale.step = 'overload';
      finale.stepT = 0;
      final.items = [];
      setScamFinalCaption('[[ERROR]]... [[ERROR]]... NO ME IMPORTA!!! UN ULTIMO [[DEAL]]!!!', '#ff1744', 140);
      playSound('judgeOverdrive');
      playSound('cutsceneAngry');
    }
  } else if (finale.step === 'overload') {
    // he overheats and keeps charging anyway
    caster.neoCharge = 30;
    final.shake = Math.max(final.shake, 4 + t / 18);
    if (t % 20 === 0) playSound('jesterFinalRumble');
    if (t % 14 === 0) playSound('jesterHeartbeat');
    if (t === 100) setScamFinalCaption('AHORA ES TU OPORTUNIDAD DE SER UN [[BIG SHOT]]!!!', '#fdd835', 140);
    if (t >= 160) {
      finale.step = 'ultimate';
      finale.stepT = 0;
      final.items.push({ type: 'ultimate', warn: 60, fire: 240, t: 0 });
      playSound('judgeSecretCharge');
    }
  } else if (finale.step === 'ultimate') {
    // the ultimate BIG SHOT fills the box: only a small moving circle is safe
    caster.neoCharge = 30;
    if (!final.items.some((item) => item.type === 'ultimate')) {
      finale.step = 'break';
      finale.stepT = 0;
      caster.neoCharge = 0;
      caster.neoTired = true;
      caster.neoBroken = true;
      final.flash = 1;
      final.shake = 50;
      // his armor breaks apart
      const centerX = 800 + caster.width / 2;
      const centerY = ground - caster.height / 2;
      finale.pieces = [
        { color: '#7b1fa2', shape: [[0, 0], [-60, -40], [-70, 20], [-40, 50]] },
        { color: '#fdd835', shape: [[0, 0], [50, -44], [40, -8], [70, -12], [46, 30], [10, 40]] },
        { color: '#e91e63', shape: [[0, 0], [30, -6], [26, 26], [-6, 30]] },
        { color: '#e91e63', shape: [[0, 0], [-30, -6], [-26, 26], [6, 30]] },
        { color: '#ad1457', shape: [[0, -10], [50, -10], [50, 10], [0, 10]] },
        { color: '#ad1457', shape: [[0, 0], [20, 0], [14, 40], [-6, 36]] },
      ].map((piece, index) => ({ ...piece, x: centerX, y: centerY, vx: (index - 2.5) * 3.2 + (Math.random() - 0.5) * 3, vy: -10 - Math.random() * 6, spin: 0, spinSpeed: (Math.random() - 0.5) * 0.4 }));
      addScamFinalSparks(centerX, centerY, '#ffffff');
      addScamFinalSparks(centerX, centerY, '#fdd835');
      addScamFinalSparks(centerX, centerY, '#ff4081');
      setScamFinalCaption('[[BIG SHOT]]... [[big shot]]... [[b i g   s h o t]]...', '#f48fb1', 130);
      playSound('judgeSlam');
      playSound('robotBoom');
      playSound('jesterGiantSlam');
    }
  } else if (finale.step === 'break') {
    (finale.pieces || []).forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.45;
      piece.spin += piece.spinSpeed;
    });
    if (t % 12 === 0 && t < 70) addScamFinalSparks(800 + caster.width / 2 + (Math.random() - 0.5) * 60, ground - caster.height / 2 + (Math.random() - 0.5) * 80, Math.random() > 0.5 ? '#fdd835' : '#ffffff');
    if (t >= 120) finale.done = true;
  }
  if (final.recoil) final.recoil *= 0.85;
}

// behind the box: a giant NEO SCAMMER and rotating pink and yellow light
function drawScamFinaleBackdrop() {
  const final = scamFinal;
  const finale = final.finale;
  const caster = final.caster;
  const intensity = finale.step === 'charge' ? Math.min(1, finale.stepT / 150) : finale.step === 'break' ? Math.max(0, 1 - finale.stepT / 90) : 1;
  if (intensity <= 0) return;
  ctx.save();
  ctx.translate(canvas.width / 2, 260);
  ctx.rotate(final.frame * 0.004);
  for (let ray = 0; ray < 12; ray += 1) {
    ctx.fillStyle = ray % 2 === 0 ? `rgba(255, 64, 129, ${0.07 * intensity})` : `rgba(253, 216, 53, ${0.07 * intensity})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 700, (ray / 12) * Math.PI * 2, ((ray + 0.5) / 12) * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const savedPosition = { ...caster.position };
  const savedFacing = caster.attacksToTheRight;
  ctx.save();
  ctx.globalAlpha = (0.16 + (finale.step === 'ultimate' || finale.step === 'overload' ? 0.1 : 0)) * intensity;
  ctx.translate(canvas.width / 2 + (Math.random() - 0.5) * (finale.step === 'overload' ? 8 : 2), 250);
  ctx.scale(2.6, 2.6);
  caster.position = { x: -caster.width / 2, y: -caster.height / 2 };
  caster.attacksToTheRight = false;
  caster.isAttacking = false;
  caster.draw();
  ctx.restore();
  caster.position = savedPosition;
  caster.attacksToTheRight = savedFacing;
}

// in front: energy pouring into the cannon, and the pieces of his broken armor
function drawScamFinaleFront() {
  const final = scamFinal;
  const finale = final.finale;
  const muzzle = getScamCannonMuzzle();
  if (finale.step === 'charge' || finale.step === 'overload' || finale.step === 'ultimate') {
    const power = finale.step === 'charge' ? Math.min(1, finale.stepT / 150) : 1;
    ctx.strokeStyle = finale.step === 'overload' ? 'rgba(255, 23, 68, 0.7)' : 'rgba(255, 236, 179, 0.7)';
    ctx.lineWidth = 2;
    for (let ray = 0; ray < 10; ray += 1) {
      const angle = Math.random() * Math.PI * 2;
      const reach = 60 + Math.random() * 200 * (1.2 - power);
      ctx.beginPath();
      ctx.moveTo(muzzle.x + Math.cos(angle) * reach, muzzle.y + Math.sin(angle) * reach);
      ctx.lineTo(muzzle.x + Math.cos(angle) * reach * 0.35, muzzle.y + Math.sin(angle) * reach * 0.35);
      ctx.stroke();
    }
    const radius = 10 + power * 26 + (finale.step === 'overload' ? Math.random() * 12 : 0);
    const glow = ctx.createRadialGradient(muzzle.x, muzzle.y, 0, muzzle.x, muzzle.y, radius * 2);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    glow.addColorStop(0.4, 'rgba(253, 216, 53, 0.85)');
    glow.addColorStop(1, 'rgba(255, 64, 129, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(muzzle.x, muzzle.y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  if (finale.step === 'overload' && Math.floor(final.frame / 6) % 2 === 0) {
    ctx.fillStyle = '#ff1744';
    ctx.font = '900 18px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[[ERROR]]', muzzle.x + 40 + (Math.random() - 0.5) * 20, muzzle.y - 110 + (Math.random() - 0.5) * 20);
    ctx.fillText('[[SOBRECARGA]]', muzzle.x + 90 + (Math.random() - 0.5) * 20, muzzle.y - 60 + (Math.random() - 0.5) * 20);
  }
  (finale.pieces || []).forEach((piece) => drawNeoArmorPiece(piece, piece.x, piece.y));
}

function hurtScamFinalTarget() {
  const final = scamFinal;
  if (final.invulnerable > 0) return;
  const target = final.target;
  // percentage damage: it can never finish you off on its own
  const damage = target.health * scamFinalDamagePercent;
  if (target.health > 1) {
    target.health = Math.max(1, target.health - damage);
    getPlayerStats(target).damageTaken += damage;
    getPlayerStats(final.caster).damageDealt += damage;
  }
  final.invulnerable = scamFinalInvulnerableFrames;
  final.hits += 1;
  final.shake = 10;
  playSound('judgeFinalHurt');
  updateHealthBars();
}

function getScamFinalInput() {
  const final = scamFinal;
  const pick = (up, down, left, right) => ({ x: (right ? 1 : 0) - (left ? 1 : 0), y: (down ? 1 : 0) - (up ? 1 : 0) });
  if (final.target === player1) return pick(keys.w, keys.s, keys.a, keys.d);
  if (!botEnabled) return pick(keys.ArrowUp, keys.ArrowDown, keys.ArrowLeft, keys.ArrowRight);
  // a bot: follows the safe circle / the safe stripe, otherwise steps away from the closest danger
  const soul = getScamFinalSoulCenter();
  const toward = (x, y) => ({ x: Math.abs(x - soul.x) > 6 ? Math.sign(x - soul.x) : 0, y: Math.abs(y - soul.y) > 6 ? Math.sign(y - soul.y) : 0 });
  const ultimate = final.items.find((item) => item.type === 'ultimate');
  if (ultimate) {
    const safe = getScamUltimateSafeSpot(ultimate);
    return toward(safe.x, safe.y);
  }
  const beam = final.items.find((item) => item.type === 'finalShot');
  if (beam) return toward(soul.x, beam.bandY + beam.bandHeight / 2);
  let closest = null;
  let closestDistance = Infinity;
  final.items.forEach((item) => {
    if (item.warn > 0 || !Number.isFinite(item.x) || item.type === 'spinner') return;
    const itemX = item.w ? item.x + item.w / 2 : item.x;
    const itemY = item.h ? item.y + item.h / 2 : item.y;
    const distance = Math.hypot(itemX - soul.x, itemY - soul.y);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = { x: itemX, y: itemY };
    }
  });
  if (closest && closestDistance < 85) return { x: Math.sign(soul.x - closest.x), y: Math.sign(soul.y - closest.y) };
  const box = final.box;
  return toward(box.x + box.width / 2, box.y + box.height / 2);
}

function moveScamFinalSoul() {
  const final = scamFinal;
  const soul = final.soul;
  const box = final.box;
  if (final.stage === 'phase') {
    const input = getScamFinalInput();
    const moveX = input.x;
    const moveY = input.y;
    const length = Math.hypot(moveX, moveY) || 1;
    soul.x += (moveX / length) * 5.2;
    soul.y += (moveY / length) * 5.2;
  } else {
    soul.x += (box.x + box.width / 2 - soul.width / 2 - soul.x) * 0.2;
    soul.y += (box.y + box.height / 2 - soul.height / 2 - soul.y) * 0.2;
  }
  soul.x = Math.max(box.x + 4, Math.min(box.x + box.width - 4 - soul.width, soul.x));
  soul.y = Math.max(box.y + 4, Math.min(box.y + box.height - 4 - soul.height, soul.y));
}

function addScamFinalSparks(x, y, color = '#fdd835') {
  for (let spark = 0; spark < 8; spark += 1) {
    const angle = Math.random() * Math.PI * 2;
    scamFinal.sparks.push({ x, y, vx: Math.cos(angle) * (2 + Math.random() * 3), vy: Math.sin(angle) * (2 + Math.random() * 3), life: 18 + Math.random() * 10, color });
  }
}

function updateScamFinalItems() {
  const final = scamFinal;
  const box = final.box;
  const soul = getScamFinalSoulCenter();
  const soulRadius = Math.min(final.soul.width, final.soul.height) / 2;
  const touches = (x, y, r) => Math.hypot(x - soul.x, y - soul.y) < r + soulRadius;
  const spawned = [];
  final.items.forEach((item) => {
    if (item.warn > 0) {
      item.warn -= 1;
      return;
    }
    if (item.type === 'ultimate') {
      item.fire -= 1;
      item.t += 1;
      if (item.t === 1) {
        playSound('titanLaser');
        playSound('judgeBeamFire');
        final.flash = 0.5;
      }
      if (item.t % 8 === 0) {
        final.shake = Math.max(final.shake, 8);
        playScamFinalSound('robotBoom', 16);
      }
      const safe = getScamUltimateSafeSpot(item);
      if (Math.hypot(soul.x - safe.x, soul.y - safe.y) > safe.r - soulRadius * 0.5) hurtScamFinalTarget();
      if (item.fire <= 0) item.done = true;
      return;
    }
    if (item.type === 'finalShot') {
      item.fire -= 1;
      if (item.fire === 31) {
        playSound('titanLaser');
        playSound('judgeBeamFire');
        final.shake = 26;
        final.flash = 0.35;
      }
      const safe = soul.y - soulRadius > item.bandY && soul.y + soulRadius < item.bandY + item.bandHeight;
      if (!safe) hurtScamFinalTarget();
      if (item.fire <= 0) item.done = true;
      return;
    }
    if (item.type === 'spinner') {
      item.angle += item.speed;
      item.speed = Math.min(0.038, item.speed + 0.00003);
      const arms = item.arms || 2;
      for (let arm = 0; arm < arms; arm += 1) {
        const angle = item.angle + (arm * Math.PI * 2) / arms;
        for (let coin = 40; coin <= 170; coin += 32) {
          if (touches(item.x + Math.cos(angle) * coin, item.y + Math.sin(angle) * coin, 10)) hurtScamFinalTarget();
        }
      }
      return;
    }
    if (item.type === 'chaser' && item.timer > 0) {
      item.timer -= 1;
      const distanceX = soul.x - item.x;
      const distanceY = soul.y - item.y;
      const distance = Math.hypot(distanceX, distanceY) || 1;
      item.vx += ((distanceX / distance) * (item.speed || 3.4) - item.vx) * 0.07;
      item.vy += ((distanceY / distance) * (item.speed || 3.4) - item.vy) * 0.07;
    }
    if (item.type === 'egg') item.vy += 0.22;
    if (item.type === 'mini') item.vy += 0.22;
    item.x += item.vx;
    item.y += item.vy;
    if (item.life !== undefined) item.life -= 1;
    if (item.type === 'tag') {
      if (Math.abs(item.x + item.w / 2 - soul.x) < item.w / 2 + soulRadius && Math.abs(item.y + item.h / 2 - soul.y) < item.h / 2 + soulRadius) hurtScamFinalTarget();
    } else if (touches(item.x, item.y, item.r)) {
      hurtScamFinalTarget();
    }
    if (item.type === 'egg' && item.y >= box.y + box.height - 10) {
      // the egg hatches into little heads
      item.done = true;
      const heads = 3 + Math.floor(Math.random() * 2);
      for (let head = 0; head < heads; head += 1) {
        spawned.push({ type: 'mini', x: item.x, y: box.y + box.height - 14, vx: (Math.random() - 0.5) * 7, vy: -4 - Math.random() * 3.5, r: 8, warn: 0, life: 160, rot: 0 });
      }
      addScamFinalSparks(item.x, box.y + box.height - 10, '#f5f5f5');
      playScamFinalSound('dumpsterBurst', 8);
    }
    const margin = 90;
    if (item.x < box.x - margin || item.x > box.x + box.width + margin || item.y < box.y - margin || item.y > box.y + box.height + margin) {
      if (item.type !== 'egg' || item.y > box.y) item.done = item.type === 'chaser' ? item.timer <= 0 : true;
    }
    if (item.type === 'mini' && item.y > box.y + box.height + 10) item.done = true;
    if (item.life !== undefined && item.life <= 0) item.done = true;
  });
  final.items = final.items.filter((item) => !item.done).concat(spawned);
  final.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.92;
    spark.vy *= 0.92;
    spark.life -= 1;
  });
  final.sparks = final.sparks.filter((spark) => spark.life > 0);
}

function drawScamHeadIcon(x, y, scale, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f2f2f2';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2;
  ctx.fillRect(-11, -9, 22, 20);
  ctx.strokeRect(-11, -9, 22, 20);
  ctx.fillStyle = '#111';
  ctx.fillRect(-12, -13, 24, 5);
  ctx.fillStyle = '#f48fb1';
  ctx.beginPath();
  ctx.arc(-5, -1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdd835';
  ctx.beginPath();
  ctx.arc(5, -1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.fillRect(-6, 5, 12, 3);
  ctx.restore();
}

function drawScamFinalItem(item) {
  const box = scamFinal.box;
  if (item.type === 'ultimate') {
    const safe = getScamUltimateSafeSpot(item);
    if (item.warn > 0) {
      ctx.fillStyle = Math.floor(item.warn / 5) % 2 === 0 ? 'rgba(255, 23, 68, 0.25)' : 'rgba(255, 23, 68, 0.12)';
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = '#69f0ae';
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QUEDATE EN EL CIRCULO!', safe.x, safe.y - safe.r - 10);
    } else {
      // everything is BIG SHOT except the circle
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.arc(safe.x, safe.y, safe.r, 0, Math.PI * 2, true);
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 30;
      ctx.fillStyle = Math.floor(scamFinal.frame / 3) % 2 === 0 ? 'rgba(253, 216, 53, 0.95)' : 'rgba(255, 245, 157, 0.95)';
      ctx.fill('evenodd');
      ctx.restore();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      for (let streak = 0; streak < 6; streak += 1) {
        const streakY = box.y + Math.random() * box.height;
        ctx.beginPath();
        ctx.moveTo(box.x, streakY);
        ctx.lineTo(box.x + box.width, streakY + (Math.random() - 0.5) * 10);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = '#69f0ae';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(safe.x, safe.y, safe.r + Math.sin(scamFinal.frame / 5) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    return;
  }
  if (item.type === 'finalShot') {
    if (item.warn > 0) {
      const blink = Math.floor(item.warn / 5) % 2 === 0;
      ctx.fillStyle = blink ? 'rgba(255, 23, 68, 0.22)' : 'rgba(255, 23, 68, 0.1)';
      ctx.fillRect(box.x, box.y, box.width, item.bandY - box.y);
      ctx.fillRect(box.x, item.bandY + item.bandHeight, box.width, box.y + box.height - item.bandY - item.bandHeight);
      ctx.strokeStyle = '#69f0ae';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(box.x + 2, item.bandY, box.width - 4, item.bandHeight);
      ctx.setLineDash([]);
      ctx.fillStyle = '#69f0ae';
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ZONA SEGURA', box.x + box.width / 2, item.bandY + item.bandHeight / 2 + 5);
    } else {
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 30;
      ctx.fillStyle = 'rgba(253, 216, 53, 0.92)';
      ctx.fillRect(box.x, box.y, box.width, item.bandY - box.y);
      ctx.fillRect(box.x, item.bandY + item.bandHeight, box.width, box.y + box.height - item.bandY - item.bandHeight);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(box.x, box.y + (item.bandY - box.y) / 2 - 4, box.width, 8);
    }
    return;
  }
  if (item.type === 'spinner') {
    const alpha = item.warn > 0 ? 0.35 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    const arms = item.arms || 2;
    for (let arm = 0; arm < arms; arm += 1) {
      const angle = item.angle + (arm * Math.PI * 2) / arms;
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.x + Math.cos(angle) * 176, item.y + Math.sin(angle) * 176);
      ctx.stroke();
      for (let coin = 40; coin <= 170; coin += 32) {
        const coinX = item.x + Math.cos(angle) * coin;
        const coinY = item.y + Math.sin(angle) * coin;
        ctx.fillStyle = '#fdd835';
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coinX, coinY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.font = '900 11px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('$', coinX, coinY + 4);
      }
    }
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.arc(item.x, item.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  if (item.warn > 0) {
    ctx.fillStyle = Math.floor(item.warn / 4) % 2 === 0 ? '#ff4081' : 'rgba(255, 64, 129, 0.3)';
    ctx.font = '900 22px Courier New, monospace';
    ctx.textAlign = 'center';
    const markX = Math.max(box.x + 12, Math.min(box.x + box.width - 12, item.x + (item.w ? item.w / 2 : 0)));
    const markY = Math.max(box.y + 22, Math.min(box.y + box.height - 6, item.y + (item.h ? item.h / 2 : 0) + 8));
    ctx.fillText('!', markX, markY);
    return;
  }
  if (item.type === 'egg') {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.fillStyle = '#f5f5f5';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.arc(-3, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(3, 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (item.type === 'mini') {
    drawScamHeadIcon(item.x, item.y, 0.7, item.life * 0.2);
  } else if (item.type === 'chaser') {
    drawScamHeadIcon(item.x, item.y, 1, Math.sin(scamFinal.frame / 4) * 0.2);
    if (item.timer > 0) {
      ctx.strokeStyle = 'rgba(233, 30, 99, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(item.x, item.y, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (item.type === 'phone') {
    // a phone on a curly cord
    ctx.strokeStyle = '#ff80ab';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const steps = 14;
    for (let step = 0; step <= steps; step += 1) {
      const progress = step / steps;
      const cordX = item.ox + (item.x - item.ox) * progress + Math.sin(progress * 30) * 5;
      const cordY = item.oy + (item.y - item.oy) * progress + Math.cos(progress * 30) * 5;
      if (step === 0) ctx.moveTo(cordX, cordY);
      else ctx.lineTo(cordX, cordY);
    }
    ctx.stroke();
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rot + Math.PI / 2);
    ctx.fillStyle = '#e91e63';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.fillRect(-4, -14, 8, 28);
    ctx.fillRect(-9, -16, 18, 8);
    ctx.fillRect(-9, 8, 18, 8);
    ctx.strokeRect(-9, -16, 18, 8);
    ctx.strokeRect(-9, 8, 18, 8);
    ctx.restore();
  } else if (item.type === 'tag') {
    ctx.fillStyle = '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.fillRect(item.x, item.y, item.w, item.h);
    ctx.strokeRect(item.x, item.y, item.w, item.h);
    ctx.fillStyle = '#111';
    ctx.font = '900 10px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[[OFERTA]]', item.x + item.w / 2, item.y + item.h / 2 + 4);
  } else if (item.type === 'shot') {
    ctx.shadowColor = '#fdd835';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (item.type === 'diamond') {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rot);
    ctx.fillStyle = item.pink ? '#ff4081' : '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(0, 6);
    ctx.lineTo(-10, 0);
    ctx.lineTo(0, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawScamFinalSoul() {
  const final = scamFinal;
  if (final.invulnerable > 0 && Math.floor(final.invulnerable / 4) % 2 === 0) return;
  const target = final.target;
  const soul = final.soul;
  const center = getScamFinalSoulCenter();
  const savedPosition = { ...target.position };
  const savedFacing = target.attacksToTheRight;
  ctx.save();
  // (route B: the soul is red)
  ctx.fillStyle = final.routeB ? 'rgba(255, 23, 68, 0.35)' : 'rgba(255, 64, 129, 0.16)';
  ctx.beginPath();
  ctx.arc(center.x, center.y, 24, 0, Math.PI * 2);
  ctx.fill();
  if (final.routeB) {
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.translate(center.x, center.y);
  ctx.scale(0.3, 0.3);
  target.position = { x: -target.width / 2, y: -target.height / 2 };
  target.attacksToTheRight = true;
  target.isAttacking = false;
  target.draw();
  ctx.restore();
  target.position = savedPosition;
  target.attacksToTheRight = savedFacing;
  void soul;
}

function finishScamFinalAct() {
  const final = scamFinal;
  if (final.routeB) {
    restoreRouteBScamPhases();
    routeBEnding.pending = true;
  }
  const target = final.target;
  const caster = final.caster;
  final.active = false;
  target.position.x = 240;
  target.position.y = ground - target.height;
  target.velocity.x = 0;
  target.velocity.y = 0;
  caster.position.x = 660;
  caster.position.y = ground - caster.height;
  caster.velocity.x = 0;
  caster.velocity.y = 0;
  caster.neoCharge = 0;
  robotShots = [];
  resetKeys();
  if (!scamChallenge.active) {
    // versus: the fight simply goes on (and he keeps his armor)
    caster.neoBroken = false;
    caster.neoTired = false;
    jesterWhiteFade = 50;
    updateHealthBars();
    return;
  }
  // his best offer was rejected: he is hanging on by a thread and does not fight back anymore
  caster.health = 1;
  caster.neoExhausted = true;
  updateHealthBars();
  startMidFightCh7Cutscene('scamFinalEnd', scamFinalEndLines);
}

function updateScamFinalAct() {
  const final = scamFinal;
  final.frame += 1;
  if (final.invulnerable > 0) final.invulnerable -= 1;
  final.shake *= 0.88;
  final.flash *= 0.9;
  const caster = final.caster;

  if (final.stage === 'intro') {
    if (final.frame >= scamFinalIntroFrames) startScamFinalPhase(0);
  } else if (final.stage === 'phase') {
    final.phaseFrame += 1;
    const phase = scamFinalPhases[final.phaseIndex];
    const phaseDone = phase.pattern === 'finale' ? Boolean(final.finale && final.finale.done) : final.phaseFrame >= phase.frames;
    if (phaseDone) {
      if (final.phaseIndex + 1 < scamFinalPhases.length) {
        startScamFinalPhase(final.phaseIndex + 1);
      } else {
        final.stage = 'white';
        final.whiteFrame = 0;
        final.items = [];
        playSound('jesterFinalWhite');
      }
    } else if (phase.pattern === 'finale') {
      if (final.phaseFrame > 40) updateScamFinale();
    } else if (final.phaseFrame > scamFinalTransitionFrames && final.phaseFrame < phase.frames - 40) {
      spawnScamPattern(phase, final.phaseFrame - scamFinalTransitionFrames);
    }
  } else if (final.stage === 'white') {
    final.whiteFrame += 1;
    if (final.whiteFrame >= scamFinalWhiteFrames) {
      finishScamFinalAct();
      return;
    }
  }

  ['x', 'y', 'width', 'height'].forEach((key) => {
    final.box[key] += (final.boxTarget[key] - final.box[key]) * 0.14;
  });
  moveScamFinalSoul();
  updateScamFinalItems();
  if (final.routeB) updateRouteBShooter();

  // ----- drawing -----
  const introProgress = Math.min(1, final.frame / 60);
  ctx.save();
  ctx.translate((Math.random() - 0.5) * final.shake, (Math.random() - 0.5) * final.shake);
  // (route B: the edge of Ciudad Cobalto behind the box)
  if (final.routeB) drawCobaltEdgeStage();
  else drawScamShowroomStage();
  const finaleDark = final.finale && final.finale.step !== 'break' ? 0.14 : 0;
  ctx.fillStyle = `rgba(0, 0, 0, ${0.78 * introProgress + finaleDark})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  if (final.finale) drawScamFinaleBackdrop();
  // NEO SCAMMER at the side, throwing everything he has (pushed back a little by each giant shot)
  const savedPosition = { ...caster.position };
  caster.position = { x: 800 + (final.recoil || 0) * 26, y: ground - caster.height };
  caster.attacksToTheRight = false;
  caster.isAttacking = false;
  caster.draw();
  caster.position = savedPosition;
  // the box
  const box = final.box;
  ctx.fillStyle = '#070308';
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeStyle = final.finale ? `hsl(${(final.frame * 8) % 360}, 100%, 62%)` : Math.floor(final.frame / 20) % 2 === 0 ? '#ff4081' : '#fdd835';
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 12;
  ctx.lineWidth = 4;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x - 2, box.y - 2, box.width + 4, box.height + 4);
  ctx.clip();
  final.items.forEach(drawScamFinalItem);
  if (final.routeB) drawRouteBShooter();
  ctx.restore();
  drawScamFinalSoul();
  if (final.finale) drawScamFinaleFront();
  final.sparks.forEach((spark) => {
    ctx.fillStyle = spark.color;
    ctx.globalAlpha = Math.min(1, spark.life / 18);
    ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
    ctx.globalAlpha = 1;
  });
  // counter
  ctx.font = '900 16px Courier New, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fdd835';
  if (final.stage !== 'intro') ctx.fillText(`OFERTA ${Math.min(final.phaseIndex + 1, scamFinalPhases.length)}/${scamFinalPhases.length}`, 24, 120);
  // phase banner, under the box
  if (final.banner && final.banner.life > 0) {
    final.banner.life -= 1;
    const bannerY = box.y + box.height + 40;
    ctx.globalAlpha = Math.min(1, final.banner.life / 20);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(box.x + box.width / 2 - 300, bannerY - 32, 600, 60);
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = '#ff4081';
    ctx.font = '900 30px Courier New, monospace';
    ctx.strokeText(final.banner.title, box.x + box.width / 2, bannerY);
    ctx.fillText(final.banner.title, box.x + box.width / 2, bannerY);
    ctx.font = '700 15px Courier New, monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(final.banner.subtitle, box.x + box.width / 2, bannerY + 20);
    ctx.globalAlpha = 1;
  }
  // title
  if (final.stage === 'intro') {
    ctx.globalAlpha = Math.min(1, final.frame / 30);
    ctx.fillStyle = '#ff4081';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 7;
    ctx.font = '900 54px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText('ULTIMA OFERTA', canvas.width / 2, 120);
    ctx.fillText('ULTIMA OFERTA', canvas.width / 2, 120);
    ctx.font = '700 16px Courier New, monospace';
    ctx.fillStyle = '#fff';
    const dodgeKeys = final.target === player1 ? 'W A S D' : botEnabled ? '(el bot esquiva solo)' : 'las FLECHAS';
    ctx.fillText(`NEO SCAMMER te hizo chiquito! Esquiva todo con ${dodgeKeys}`, canvas.width / 2, 150);
    ctx.globalAlpha = 1;
  }
  // shouted captions, right above the box
  if (final.caption && final.caption.life > 0) {
    const caption = final.caption;
    caption.life -= 1;
    const age = caption.maxLife - caption.life;
    const pop = 1 + Math.max(0, (8 - age) / 10);
    ctx.save();
    ctx.globalAlpha = Math.min(1, caption.life / 15);
    ctx.translate(canvas.width / 2 + (Math.random() - 0.5) * (age < 10 ? 6 : 1), box.y - 24);
    ctx.scale(pop, pop);
    ctx.font = '900 28px Courier New, monospace';
    ctx.textAlign = 'center';
    const captionWidth = ctx.measureText(caption.text).width + 40;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-captionWidth / 2, -28, captionWidth, 40);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = caption.color;
    ctx.strokeText(caption.text, 0, 0);
    ctx.fillText(caption.text, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  if (final.flash > 0.02) {
    ctx.fillStyle = `rgba(255, 252, 240, ${final.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (final.stage === 'white') {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, final.whiteFrame / 18)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- KNIGHT ----------
function isKnight(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'knight');
}

function isKnightUnlocked() {
  return Boolean(unlockedAchievements.knightUnlocked);
}

function syncKnightUnlockUI() {
  if (!knightCharacterButton) return;
  knightCharacterButton.classList.toggle('hidden', !isKnightUnlocked());
  knightCharacterButton.disabled = normalArcadeActive;
  knightCharacterButton.classList.toggle('arcade-disabled', normalArcadeActive);
}

function unlockMedievalCode() {
  medievalCodeActive = true;
  medievalCastleMapButton.classList.remove('hidden');
  showCustomToast('MEDIEVAL ACTIVADO', 'Aparecio un mapa nuevo: el Castillo de Valdoria. Elegi una pelea contra el bot... alguien te espera en la puerta.');
  playSound('achievement');
}

function lockMedievalCode() {
  medievalCodeActive = false;
  medievalCastleMapButton.classList.add('hidden');
  if (!knightChallenge.active && selectedMap === 'medievalCastle') selectedMap = 'foundry';
}

// beating the Knight on his own castle: the reward, and the Knight unlocked for good
function rewardKnightChallenge() {
  const firstTime = !isKnightUnlocked();
  unlockAchievement('knightUnlocked');
  syncKnightUnlockUI();
  awardCoins(knightChallengeReward);
  setTimeout(() => {
    showCustomToast(
      firstTime ? 'KNIGHT DESBLOQUEADO' : 'GUARDIAN DERROTADO',
      firstTime
        ? `Venciste al guardian de Valdoria y reclamaste la recompensa (+${knightChallengeReward} monedas). Knight ahora se puede elegir.`
        : `+${knightChallengeReward} monedas de oro. El guardian de Valdoria acepta la derrota con honor.`,
    );
    playSound('achievement');
  }, 4000);
}

function resetKnightState(fighter) {
  Object.assign(fighter, {
    knightLungeCooldown: 60,
    knightShieldCooldown: 90,
    knightSlamCooldown: 180,
    knightLungeTimer: 0,
    knightShieldTimer: 0,
    knightSlam: null,
    knightWaves: [],
    knightImpact: 0,
    knightBlockFlash: 0,
    knightGap: 0,
    knightGlow: 0,
    knightKneel: false,
  });
}

function knightHit(attacker, target, area, damage, pushX, pushY) {
  if (!rectangularCopycatShieldCollision(target, area) && !rectangularCollision({ rectangle1: area, rectangle2: target })) return false;
  if (handleCopycatShieldHit(target, attacker)) return 'blocked';
  applyDamage(attacker, target, damage, { isSpecial: true });
  target.velocity.x = getDebugKnockback(pushX, target);
  target.velocity.y = getDebugKnockback(pushY, target);
  playSound('robotHit');
  return true;
}

function updateKnight(fighter) {
  ['knightLungeCooldown', 'knightShieldCooldown', 'knightSlamCooldown', 'knightBlockFlash', 'knightGap', 'knightImpact'].forEach((key) => {
    if (fighter[key] > 0) fighter[key] -= 1;
  });
  if (!fighter.knightWaves) fighter.knightWaves = [];
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  if (fighter.knightShieldTimer > 0) {
    // planted behind the shield: he does not slide while blocking
    fighter.knightShieldTimer -= 1;
    fighter.velocity.x = 0;
    if (fighter.knightShieldX === undefined) fighter.knightShieldX = fighter.position.x;
    fighter.position.x = fighter.knightShieldX;
  } else {
    fighter.knightShieldX = undefined;
  }
  // 1) Estocada: a fast lunge with the sword forward
  if (fighter.knightLungeTimer > 0) {
    fighter.knightLungeTimer -= 1;
    const direction = fighter.knightLungeDirection;
    fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + 15 * direction));
    // the lunge stops against the rival instead of going through him
    const front = direction > 0 ? fighter.position.x + fighter.width : fighter.position.x;
    const rivalEdge = direction > 0 ? target.position.x : target.position.x + target.width;
    if ((direction > 0 && front > rivalEdge + 10 && getFighterCenterX(fighter) < getFighterCenterX(target)) || (direction < 0 && front < rivalEdge - 10 && getFighterCenterX(fighter) > getFighterCenterX(target))) {
      fighter.position.x += direction > 0 ? rivalEdge + 10 - front : rivalEdge - 10 - front;
    }
    if (direction > 0 ? getFighterCenterX(fighter) >= getFighterCenterX(target) : getFighterCenterX(fighter) <= getFighterCenterX(target)) fighter.knightLungeTimer = 0;
    if (!fighter.knightLungeHit) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width - 10 : fighter.position.x - 64, y: fighter.position.y + 38, width: 74, height: 46 };
      if (knightHit(fighter, target, area, knightLungeDamage, 9 * direction, -5)) fighter.knightLungeHit = true;
    }
  }
  // 3) Juicio del Rey: the leap... and the landing
  if (fighter.knightSlam) {
    const slam = fighter.knightSlam;
    slam.frames += 1;
    // a fixed arc: hits and knockback cannot stop it or push it off course
    const progress = Math.min(1, slam.frames / knightSlamAirFrames);
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = slam.startY - 4 * knightSlamHeight * progress * (1 - progress);
    // it drifts toward where the target was standing, and lands on top of it
    const drift = Math.max(-5, Math.min(5, slam.targetX - getFighterCenterX(fighter)));
    fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + drift));
    if (progress >= 1) {
      fighter.position.y = slam.startY;
      fighter.knightSlam = null;
      const centerX = getFighterCenterX(fighter);
      fighter.knightImpact = 24;
      fighter.knightImpactX = centerX;
      breakHotSpringTub(fighter, centerX);
      // the waves only reach whoever was out of the impact
      const impactHit = Boolean(knightHit(fighter, target, { x: centerX - 90, y: ground - 70, width: 180, height: 70 }, knightSlamDamage, getFighterCenterX(target) >= centerX ? 8 : -8, -8));
      fighter.knightWaves.push({ x: centerX, dir: 1, life: 34, hit: impactHit }, { x: centerX, dir: -1, life: 34, hit: impactHit });
      playSound('robotBoom');
    }
  }
  fighter.knightWaves.forEach((wave) => {
    wave.x += wave.dir * 9;
    wave.life -= 1;
    if (!wave.hit && target.position.y + target.height >= ground - 12) {
      if (knightHit(fighter, target, { x: wave.x - 14, y: ground - 50, width: 28, height: 50 }, knightWaveDamage, wave.dir * 7, -6)) wave.hit = true;
    }
  });
  fighter.knightWaves = fighter.knightWaves.filter((wave) => wave.life > 0 && wave.x > -40 && wave.x < canvas.width + 40);
  // level 2: the dark captain stops the fight to make his offer
  if (fighter.secretVariant === 'darkKnightBoss' && fighter === player2 && normalArcadeActive && arcadeChapter === 'knight' && !fighter.darkDealDone && fighter.health > 0 && fighter.health <= fighter.maxHealth * darkKnightDealRatio && !gameOver) {
    startKnightDarkDeal();
  }
}

function isDarkKnight(fighter) {
  return Boolean(fighter && (fighter.secretVariant === 'darkKnight' || fighter.secretVariant === 'darkKnightBoss'));
}

function castKnightLunge(fighter, target) {
  if (fighter.knightLungeCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.attacksToTheRight = direction > 0;
  Object.assign(fighter, { knightLungeTimer: 14, knightLungeDirection: direction, knightLungeHit: false, knightGap: 40 });
  fighter.knightLungeCooldown = getDebugCooldown(knightLungeCooldown, fighter);
  recordSpecialUsed(fighter);
  playSound('chronoRam');
  return true;
}

function castKnightShield(fighter) {
  if (fighter.knightShieldCooldown > 0) return false;
  fighter.knightShieldTimer = knightShieldFrames;
  fighter.knightShieldCooldown = getDebugCooldown(knightShieldCooldown, fighter);
  fighter.knightGap = 30;
  recordSpecialUsed(fighter);
  playSound('judgeLight');
  return true;
}

function castKnightSlam(fighter, target) {
  if (fighter.knightSlamCooldown > 0 || fighter.position.y + fighter.height < ground - 2) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.attacksToTheRight = direction > 0;
  fighter.velocity.x = 0;
  fighter.velocity.y = 0;
  fighter.knightSlam = { frames: 0, direction, targetX: getFighterCenterX(target), startY: ground - fighter.height };
  fighter.knightSlamCooldown = getDebugCooldown(knightSlamCooldown, fighter);
  fighter.knightGap = 50;
  recordSpecialUsed(fighter);
  playSound('judgeOverdrive');
  return true;
}

// a human playing the Knight: Q / . Estocada, F / . Muro de escudo, R / Enter Juicio del Rey
function handleKnightKey(fighter, target, slot) {
  if (!isKnight(fighter) && !isDarkKnight(fighter)) return false;
  if (!canFighterAct(fighter) || fighter.knightLungeTimer > 0 || fighter.knightSlam) return true;
  if (slot === 0) castKnightLunge(fighter, target);
  else if (slot === 1) castKnightShield(fighter);
  else castKnightSlam(fighter, target);
  return true;
}

// ---------- the Bestia del Musgo (chapter 5, level 1) ----------
function isMossBeast(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'mossBeast');
}

function updateMossBeast(fighter) {
  if (fighter.mossRootCooldown > 0) fighter.mossRootCooldown -= 1;
  if (!fighter.mossRoots) fighter.mossRoots = [];
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  fighter.mossRoots.forEach((root) => {
    if (root.warn > 0) {
      root.warn -= 1;
      if (root.warn === 0) playSound('robotScrap');
      return;
    }
    root.life -= 1;
    if (!root.hit && root.life > 6) {
      if (knightHit(fighter, target, { x: root.x - 26, y: ground - 70, width: 52, height: 70 }, mossRootDamage, getFighterCenterX(target) >= root.x ? 4 : -4, -9)) root.hit = true;
    }
  });
  fighter.mossRoots = fighter.mossRoots.filter((root) => root.warn > 0 || root.life > 0);
  // a little under half of its health: Light Warrior's blast
  if (fighter === player2 && normalArcadeActive && arcadeChapter === 'knight' && !fighter.mossRescued && fighter.health > 0 && fighter.health <= fighter.maxHealth * mossBeastRescueRatio && !gameOver) {
    startKnightLightScene();
  }
}

// roots break out of the ground under the target (a glowing crack warns where)
function castMossRoots(fighter, target) {
  if (fighter.mossRootCooldown > 0) return false;
  const targetX = getFighterCenterX(target);
  fighter.mossRoots.push({ x: targetX, warn: mossRootWarnFrames, life: 24, hit: false });
  if (fighter.health <= fighter.maxHealth * 0.7) {
    fighter.mossRoots.push({ x: Math.max(30, Math.min(canvas.width - 30, targetX + (Math.random() < 0.5 ? -110 : 110))), warn: mossRootWarnFrames + 18, life: 24, hit: false });
  }
  fighter.mossRootCooldown = getDebugCooldown(mossRootCooldown, fighter);
  recordSpecialUsed(fighter);
  playSound('robotTick');
  return true;
}

// ---------- Light Warrior's friends in Robledal (chapter 5, level 3) ----------
function isRobledalKid(fighter) {
  return Boolean(fighter && (fighter.secretVariant === 'celesteGirl' || fighter.secretVariant === 'setoBoy'));
}

function resetRobledalKid(fighter) {
  Object.assign(fighter, {
    celesteThrowCooldown: 80,
    celesteBlinkCooldown: 200,
    celesteRainCooldown: 300,
    celesteKnives: [],
    celesteBlinkTimer: 0,
    celesteSlashFx: 0,
    celesteShowKnives: true,
    setoTopCooldown: 90,
    setoBalloonCooldown: 160,
    setoBoxCooldown: 260,
    setoToys: [],
    robledalGap: 0,
  });
}

function tickCooldowns(fighter, keys) {
  keys.forEach((key) => {
    if (fighter[key] > 0) fighter[key] -= 1;
  });
}

// Celeste: thrown knives, a giggling blink behind you, and a rain of knives
function updateCeleste(fighter) {
  tickCooldowns(fighter, ['celesteThrowCooldown', 'celesteBlinkCooldown', 'celesteRainCooldown', 'celesteSlashFx', 'robledalGap']);
  if (!fighter.celesteKnives) fighter.celesteKnives = [];
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  if (fighter.celesteBlinkTimer > 0) {
    fighter.celesteBlinkTimer -= 1;
    fighter.velocity.x = 0;
    if (fighter.celesteBlinkTimer === 0) {
      // pops up right behind the target and slashes
      const side = getFighterCenterX(target) >= canvas.width / 2 ? -1 : 1;
      const behind = getFighterCenterX(target) < getFighterCenterX(fighter) ? -1 : 1;
      const landing = target.position.x + (behind > 0 ? target.width + 8 : -fighter.width - 8);
      fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, landing || target.position.x + side * 80));
      fighter.attacksToTheRight = getFighterCenterX(target) >= getFighterCenterX(fighter);
      fighter.celesteSlashFx = 12;
      fighter.celesteSlashX = getFighterCenterX(fighter) + (fighter.attacksToTheRight ? 20 : -20);
      const area = { x: fighter.attacksToTheRight ? fighter.position.x + fighter.width - 10 : fighter.position.x - 56, y: fighter.position.y + 20, width: 66, height: 70 };
      knightHit(fighter, target, area, celesteBlinkDamage, fighter.attacksToTheRight ? 7 : -7, -5);
      playSound('chronoRam');
    }
  }
  fighter.celesteKnives.forEach((knife) => {
    if (knife.warn > 0) {
      knife.warn -= 1;
      return;
    }
    if (knife.stuck) {
      knife.life -= 1;
      return;
    }
    knife.x += knife.vx;
    knife.y += knife.vy;
    knife.life -= 1;
    if (knife.kind === 'rain' && knife.y >= ground - 6) {
      knife.y = ground - 6;
      knife.stuck = true;
      knife.life = 30;
      return;
    }
    if (!knife.hit && knightHit(fighter, target, { x: knife.x - 10, y: knife.y - 5, width: 20, height: 10 }, knife.damage, knife.vx >= 0 ? 3 : -3, -2)) {
      knife.hit = true;
      knife.life = 0;
    }
  });
  fighter.celesteKnives = fighter.celesteKnives.filter((knife) => knife.life > 0 && knife.x > -40 && knife.x < canvas.width + 40);
}

function castCelesteThrow(fighter, target) {
  if (fighter.celesteThrowCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  [-1.6, 0, 1.6].forEach((spread) => {
    fighter.celesteKnives.push({ kind: 'throw', x: getFighterCenterX(fighter) + direction * 24, y: fighter.position.y + 64, vx: 11 * direction, vy: spread, life: 90, damage: celesteThrowDamage, warn: 0 });
  });
  fighter.celesteThrowCooldown = getDebugCooldown(celesteThrowCooldown, fighter);
  fighter.robledalGap = 30;
  recordSpecialUsed(fighter);
  playSound('cutsceneLaugh');
  return true;
}

function castCelesteBlink(fighter) {
  if (fighter.celesteBlinkCooldown > 0) return false;
  fighter.celesteBlinkTimer = 22;
  fighter.celesteBlinkCooldown = getDebugCooldown(celesteBlinkCooldown, fighter);
  fighter.robledalGap = 50;
  recordSpecialUsed(fighter);
  playSound('cutsceneLaugh');
  return true;
}

function castCelesteRain(fighter, target) {
  if (fighter.celesteRainCooldown > 0) return false;
  const centerX = getFighterCenterX(target);
  [-120, -60, 0, 60, 120].forEach((offset, index) => {
    fighter.celesteKnives.push({ kind: 'rain', x: Math.max(20, Math.min(canvas.width - 20, centerX + offset)), y: -30, vx: 0, vy: 16, life: 120, damage: celesteRainDamage, warn: 32 + index * 5 });
  });
  fighter.celesteRainCooldown = getDebugCooldown(celesteRainCooldown, fighter);
  fighter.robledalGap = 50;
  recordSpecialUsed(fighter);
  playSound('robotTick');
  return true;
}

// Seto: a spinning top that bounces off the walls, a water balloon that leaves a slippery puddle,
// and a surprise box with a boxing glove inside
function updateSeto(fighter) {
  tickCooldowns(fighter, ['setoTopCooldown', 'setoBalloonCooldown', 'setoBoxCooldown', 'robledalGap']);
  if (!fighter.setoToys) fighter.setoToys = [];
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  const onGround = target.position.y + target.height >= ground - 12;
  fighter.setoToys.forEach((toy) => {
    toy.life -= 1;
    if (toy.kind === 'top') {
      toy.x += toy.vx;
      if (toy.x < 16 || toy.x > canvas.width - 16) toy.vx *= -1;
      if (toy.hitCooldown > 0) toy.hitCooldown -= 1;
      if (!toy.hitCooldown && onGround && knightHit(fighter, target, { x: toy.x - 14, y: ground - 30, width: 28, height: 30 }, setoTopDamage, toy.vx > 0 ? 4 : -4, -6)) toy.hitCooldown = 40;
    } else if (toy.kind === 'balloon') {
      toy.x += toy.vx;
      toy.y += toy.vy;
      toy.vy += 0.5;
      const direct = knightHit(fighter, target, { x: toy.x - 11, y: toy.y - 13, width: 22, height: 26 }, setoBalloonDamage, toy.vx > 0 ? 2 : -2, -2);
      if (direct || toy.y >= ground - 10) {
        toy.life = 0;
        fighter.setoToys.push({ kind: 'puddle', x: toy.x, life: 170 });
        playSound('bubblePop');
      }
    } else if (toy.kind === 'puddle') {
      if (onGround && Math.abs(getFighterCenterX(target) - toy.x) < 60) target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, 20);
    } else if (toy.kind === 'box') {
      if (toy.timer > 0) {
        toy.timer -= 1;
        // it pops early if the target walks up to it
        if (Math.abs(getFighterCenterX(target) - toy.x) < 60) toy.timer = Math.min(toy.timer, 6);
        if (toy.timer === 0) playSound('robotCharge');
      } else if (toy.pop > 0) {
        toy.pop -= 1;
        if (!toy.hit) {
          const reach = 80;
          const area = { x: toy.dir > 0 ? toy.x : toy.x - reach, y: ground - 60, width: reach, height: 40 };
          if (knightHit(fighter, target, area, setoBoxDamage, toy.dir * 12, -8)) toy.hit = true;
        }
        if (toy.pop === 0) toy.life = Math.min(toy.life, 20);
      }
    }
  });
  fighter.setoToys = fighter.setoToys.filter((toy) => toy.life > 0);
}

function castSetoTop(fighter, target) {
  if (fighter.setoTopCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  // book 1: a rune that rolls along the ground
  fighter.setoToys.push({ kind: 'top', x: getFighterCenterX(fighter) + direction * 30, vx: 6 * direction, life: 220, hitCooldown: 0 });
  fighter.setoTopCooldown = getDebugCooldown(setoTopCooldown, fighter);
  fighter.robledalGap = 30;
  recordSpecialUsed(fighter);
  playSound('sorcererOrb');
  return true;
}

function castSetoBalloon(fighter, target) {
  if (fighter.setoBalloonCooldown > 0) return false;
  const distance = getFighterCenterX(target) - getFighterCenterX(fighter);
  // book 2: an orb of magic water that leaves a slippery puddle
  fighter.setoToys.push({ kind: 'balloon', x: getFighterCenterX(fighter), y: fighter.position.y + 30, vx: distance / 40, vy: -10, life: 200 });
  fighter.setoBalloonCooldown = getDebugCooldown(setoBalloonCooldown, fighter);
  fighter.robledalGap = 30;
  recordSpecialUsed(fighter);
  playSound('sorcererOrb');
  return true;
}

function castSetoBox(fighter, target) {
  if (fighter.setoBoxCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  const boxX = Math.max(30, Math.min(canvas.width - 30, getFighterCenterX(fighter) + direction * 90));
  // book 3: a trap book on the floor with a ghostly fist inside
  fighter.setoToys.push({ kind: 'box', x: boxX, dir: direction, timer: 45, pop: 14, life: 160, hit: false });
  fighter.setoBoxCooldown = getDebugCooldown(setoBoxCooldown, fighter);
  fighter.robledalGap = 40;
  recordSpecialUsed(fighter);
  playSound('sorcererSecretCharge');
  return true;
}

// the team-up: one shared health bar, and Celeste and Seto swap places every few seconds
function setupRobledalDuo(fighter) {
  fighter.setCharacterType('normal', 'celesteGirl');
  resetRobledalKid(fighter);
  fighter.setMaxHealth(robledalDuoHealth);
  fighter.health = fighter.maxHealth;
  const partner = new Fighter({ x: 0, y: 0, color: '#66bb6a', attacksToTheRight: true });
  partner.setCharacterType('normal', 'setoBoy');
  Object.assign(fighter, { duoActive: true, duoTimer: robledalDuoTurnFrames, duoSwapFx: 0, duoPartnerActor: partner });
}

function updateRobledalDuo(fighter) {
  if (fighter.duoSwapFx > 0) fighter.duoSwapFx -= 1;
  if (arcadeCutscene.active || gameOver || fighter.health <= 0) return;
  fighter.duoTimer -= 1;
  // they only swap when the one fighting is not in the middle of a trick
  if (fighter.duoTimer > 0 || fighter.celesteBlinkTimer > 0) return;
  const health = fighter.health;
  const maxHealth = fighter.maxHealth;
  const bottom = fighter.position.y + fighter.height;
  const centerX = getFighterCenterX(fighter);
  const next = fighter.secretVariant === 'celesteGirl' ? 'setoBoy' : 'celesteGirl';
  fighter.duoPartnerActor.setCharacterType('normal', fighter.secretVariant);
  fighter.setCharacterType('normal', next);
  resetRobledalKid(fighter);
  fighter.setMaxHealth(maxHealth);
  fighter.health = health;
  fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, centerX - fighter.width / 2));
  fighter.position.y = bottom - fighter.height;
  fighter.duoTimer = robledalDuoTurnFrames;
  fighter.duoSwapFx = 24;
  playSound('cutsceneSurprise');
  updateHealthBars();
  updateCombatHudIdentity();
}

// ---------- Mochi, the hot springs boxing champion (chapter 5, level 4) ----------
function isMochi(fighter) {
  return Boolean(fighter && fighter.secretVariant === 'mochiMouse');
}

function resetMochi(fighter) {
  Object.assign(fighter, {
    mochiPowered: true,
    mochiFlurryCooldown: 80,
    mochiUppercutCooldown: 150,
    mochiCakeCooldown: 400,
    mochiFlurryTimer: 0,
    mochiUppercutTimer: 0,
    mochiUppercutHit: false,
    mochiCakeFx: 0,
    mochiGap: 0,
    mochiChefCalled: false,
    mochiChefHelp: false,
    mochiChefTimer: 0,
    mochiPastryTurn: 0,
    mochiPastries: [],
    mochiSplats: [],
    mochiShieldTimer: 0,
    mochiChefThrowFx: 0,
    mochiChefShout: '',
    mochiChefShoutTimer: 0,
  });
}

function updateMochi(fighter) {
  tickCooldowns(fighter, ['mochiFlurryCooldown', 'mochiUppercutCooldown', 'mochiCakeCooldown', 'mochiGap', 'mochiCakeFx', 'mochiShieldTimer', 'mochiChefThrowFx', 'mochiChefShoutTimer']);
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  // at 10% health: "CHEEEF!"
  if (fighter === player2 && normalArcadeActive && arcadeChapter === 'knight' && !fighter.mochiChefCalled && fighter.health > 0 && fighter.health <= fighter.maxHealth * mochiChefCallRatio && !gameOver) {
    startKnightMochiChef();
    return;
  }
  // the chef helps from his stall: one pastry for Mochi, the next one for Knight
  if (fighter.mochiChefHelp) {
    fighter.mochiChefTimer -= 1;
    if (fighter.mochiChefTimer <= 0) {
      fighter.mochiChefTimer = mochiChefThrowFrames;
      const kind = mochiPastryOrder[fighter.mochiPastryTurn % mochiPastryOrder.length];
      fighter.mochiPastryTurn += 1;
      const forMochi = kind === 'heal' || kind === 'shield';
      const goal = forMochi ? fighter : target;
      const startX = 900;
      const startY = ground - 170;
      const flight = kind === 'bomb' ? 60 : 46;
      // the meringue bomb is aimed at the floor under Knight
      const goalY = kind === 'bomb' ? ground - 10 : goal.position.y + goal.height / 2;
      fighter.mochiPastries.push({ kind, forMochi, flight, age: 0, x: startX, y: startY, vx: (getFighterCenterX(goal) - startX) / flight, vy: -9, gravity: (2 * (goalY - startY + 9 * flight)) / (flight * flight), life: 140 });
      fighter.mochiChefThrowFx = 22;
      fighter.mochiChefShout = mochiChefShouts[kind];
      fighter.mochiChefShoutTimer = 70;
      playSound('judgeThrow');
    }
  }
  (fighter.mochiPastries || []).forEach((pastry) => {
    pastry.age += 1;
    if (pastry.forMochi && pastry.age <= pastry.flight) {
      // it lands right where Mochi is when it comes down
      pastry.x += (getFighterCenterX(fighter) - pastry.x) / Math.max(1, pastry.flight - pastry.age + 1);
    } else {
      pastry.x += pastry.vx;
    }
    pastry.y += pastry.vy;
    pastry.vy += pastry.gravity;
    pastry.life -= 1;
    if (pastry.forMochi) {
      if (rectangularCollision({ rectangle1: { x: pastry.x - 14, y: pastry.y - 14, width: 28, height: 28 }, rectangle2: fighter })) {
        if (pastry.kind === 'shield') {
          fighter.mochiShieldTimer = mochiShieldFrames;
        } else {
          fighter.health = Math.min(fighter.maxHealth, fighter.health + mochiPastryHeal);
          updateHealthBars();
        }
        fighter.mochiCakeFx = 30;
        pastry.life = 0;
        playSound('judgeLight');
      }
    } else if (pastry.kind === 'bomb') {
      // the meringue bomb bursts on the floor and splashes everything around
      if (pastry.y >= ground - 10) {
        pastry.life = 0;
        fighter.mochiSplats.push({ x: pastry.x, life: 40 });
        knightHit(fighter, target, { x: pastry.x - 70, y: ground - 80, width: 140, height: 80 }, mochiCreamDamage, getFighterCenterX(target) >= pastry.x ? 5 : -5, -7);
        target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, 50);
        playSound('bubblePop');
      }
    } else if (knightHit(fighter, target, { x: pastry.x - 9, y: pastry.y - 9, width: 18, height: 18 }, mochiPastryDamage, pastry.vx > 0 ? 2 : -2, -3)) {
      // a sticky pastry: it slows Knight down for a moment
      target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, 80);
      pastry.life = 0;
    }
    if (pastry.y > ground + 10) pastry.life = 0;
  });
  if (fighter.mochiPastries) fighter.mochiPastries = fighter.mochiPastries.filter((pastry) => pastry.life > 0);
  (fighter.mochiSplats || []).forEach((splat) => {
    splat.life -= 1;
  });
  if (fighter.mochiSplats) fighter.mochiSplats = fighter.mochiSplats.filter((splat) => splat.life > 0);
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  // the flurry: he rushes in throwing jab after jab
  if (fighter.mochiFlurryTimer > 0) {
    fighter.mochiFlurryTimer -= 1;
    const gap = Math.abs(getFighterCenterX(target) - getFighterCenterX(fighter)) - (target.width + fighter.width) / 2;
    if (gap > 6) fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + direction * 7));
    if (fighter.mochiFlurryTimer % 6 === 0) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width - 6 : fighter.position.x - 40, y: fighter.position.y + 6, width: 46, height: 46 };
      if (knightHit(fighter, target, area, mochiJabDamage, direction * 1.5, -1.5)) playSound('robotHit');
    }
  }
  // the uppercut: a jump with the glove up
  if (fighter.mochiUppercutTimer > 0) {
    fighter.mochiUppercutTimer -= 1;
    if (!fighter.mochiUppercutHit) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width - 10 : fighter.position.x - 40, y: fighter.position.y - 30, width: 50, height: 80 };
      if (knightHit(fighter, target, area, mochiUppercutDamage, direction * 3, -13)) fighter.mochiUppercutHit = true;
    }
  }
}

function castMochiFlurry(fighter) {
  if (fighter.mochiFlurryCooldown > 0) return false;
  fighter.mochiFlurryTimer = 36;
  fighter.mochiFlurryCooldown = getDebugCooldown(mochiFlurryCooldown, fighter);
  fighter.mochiGap = 40;
  recordSpecialUsed(fighter);
  playSound('chronoRam');
  return true;
}

function castMochiUppercut(fighter) {
  if (fighter.mochiUppercutCooldown > 0 || fighter.position.y + fighter.height < ground - 2) return false;
  fighter.velocity.y = -13;
  fighter.mochiUppercutTimer = 18;
  fighter.mochiUppercutHit = false;
  fighter.mochiUppercutCooldown = getDebugCooldown(mochiUppercutCooldown, fighter);
  fighter.mochiGap = 30;
  recordSpecialUsed(fighter);
  playSound('judgeThrow');
  return true;
}

// a crumb of magic cake he kept in his shorts: a little bit of health back
function castMochiCake(fighter) {
  if (fighter.mochiCakeCooldown > 0 || fighter.health >= fighter.maxHealth) return false;
  fighter.health = Math.min(fighter.maxHealth, fighter.health + mochiCakeHeal);
  fighter.mochiCakeFx = 30;
  fighter.mochiCakeCooldown = getDebugCooldown(mochiCakeCooldown, fighter);
  fighter.mochiGap = 30;
  recordSpecialUsed(fighter);
  playSound('judgeLight');
  updateHealthBars();
  return true;
}

// Mochi at 10%: he calls the chef, who agrees to help... if nothing gets broken
function startKnightMochiChef() {
  const mochi = player2;
  mochi.mochiChefCalled = true;
  mochi.mochiChefHelp = true;
  mochi.mochiChefTimer = 60;
  mochi.mochiFlurryTimer = 0;
  mochi.mochiUppercutTimer = 0;
  [player1, player2].forEach((fighter) => {
    if (fighter.knightShieldTimer !== undefined) fighter.knightShieldTimer = 0;
    fighter.knightLungeTimer = 0;
    fighter.knightSlam = null;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  resetKeys();
  startMidFightCh7Cutscene('knightMochiChef', knightMochiChefLines, 'dialog', { secondRoundDone: false, cakeBurst: 0, pows: [], chefOut: false, damageText: null });
}

// level 4: Knight's Juicio del Rey landing on a hot tub breaks it... and the chef comes out to fight
function breakHotSpringTub(fighter, impactX) {
  if (fighter !== player1 || !normalArcadeActive || arcadeChapter !== 'knight' || selectedMap !== 'hotSprings') return;
  const index = hotSpringTubs.findIndex(([tubX, size], tubIndex) => !hotSpringTubsBroken[tubIndex] && Math.abs(impactX - tubX) <= 78 * size);
  if (index < 0) return;
  hotSpringTubsBroken[index] = true;
  playSound('robotBoom');
  playSound('bubblePop');
  if (!knightChefFuryDone && isMochi(player2) && player2.health > 0) startKnightChefFury();
}

function resetChefBoss(fighter) {
  Object.assign(fighter, {
    chefSpecialRoundDone: false,
    chefShots: [],
    chefRainCooldown: 120,
    chefPinCooldown: 60,
    chefPotCooldown: 200,
    chefGap: 0,
    chefMochiActor: null,
  });
}

function updateChefBoss(fighter) {
  tickCooldowns(fighter, ['chefRainCooldown', 'chefPinCooldown', 'chefPotCooldown', 'chefGap']);
  if (!fighter.chefShots) fighter.chefShots = [];
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  // losing to Knight, the chef calls Mochi: the special round of the house
  if (!fighter.chefSpecialRoundDone && fighter === player2 && normalArcadeActive && fighter.health > 0 && fighter.health <= fighter.maxHealth * chefSpecialRoundRatio && fighter.health / fighter.maxHealth < target.health / target.maxHealth && !gameOver) {
    fighter.chefSpecialRoundDone = true;
    fighter.chefShots = [];
    startDodgeRound('spa', fighter, target);
    return;
  }
  fighter.chefShots.forEach((shot) => {
    shot.life -= 1;
    if (shot.kind === 'rain') {
      if (shot.warn > 0) {
        shot.warn -= 1;
        return;
      }
      shot.y += 15;
      if (shot.y >= ground - 10) {
        shot.life = 0;
        knightHit(fighter, target, { x: shot.x - 34, y: ground - 70, width: 68, height: 70 }, chefRainDamage, getFighterCenterX(target) >= shot.x ? 4 : -4, -6);
        playSound('bubblePop');
      }
    } else if (shot.kind === 'pin') {
      // the rolling pin flies out and comes back to his hand
      shot.distance += shot.speed;
      if (shot.distance >= shot.range) shot.returning = true;
      if (shot.returning) {
        const dx = getFighterCenterX(fighter) - shot.x;
        shot.x += Math.sign(dx) * Math.min(Math.abs(dx), shot.speed);
        shot.y += (fighter.position.y + 60 - shot.y) * 0.15;
        if (Math.abs(dx) < 14) shot.life = 0;
      } else {
        shot.x += shot.dir * shot.speed;
      }
      const pass = shot.returning ? 'back' : 'out';
      if (!shot.hits[pass] && knightHit(fighter, target, { x: shot.x - 30, y: shot.y - 12, width: 60, height: 24 }, chefPinDamage, (shot.returning ? -shot.dir : shot.dir) * 5, -4)) shot.hits[pass] = true;
    }
  });
  fighter.chefShots = fighter.chefShots.filter((shot) => shot.life > 0);
}

function castChefRain(fighter, target) {
  if (fighter.chefRainCooldown > 0) return false;
  const centerX = getFighterCenterX(target);
  [-110, 0, 110, -55, 55].forEach((offset, index) => {
    fighter.chefShots.push({ kind: 'rain', x: Math.max(30, Math.min(canvas.width - 30, centerX + offset)), y: -30, warn: 30 + index * 8, life: 200 });
  });
  fighter.chefRainCooldown = getDebugCooldown(chefRainCooldown, fighter);
  fighter.chefGap = 50;
  recordSpecialUsed(fighter);
  playSound('judgeThrow');
  return true;
}

function castChefPin(fighter, target) {
  if (fighter.chefPinCooldown > 0 || fighter.chefShots.some((shot) => shot.kind === 'pin')) return false;
  const dir = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.chefShots.push({ kind: 'pin', x: getFighterCenterX(fighter) + dir * 30, y: fighter.position.y + 60, dir, speed: 11, distance: 0, range: 380, returning: false, hits: {}, life: 200 });
  fighter.chefPinCooldown = getDebugCooldown(chefPinCooldown, fighter);
  fighter.chefGap = 30;
  recordSpecialUsed(fighter);
  playSound('judgeThrow');
  return true;
}

// he slams a boiling pot on the floor: a splash of hot water all around him
function castChefPot(fighter, target) {
  if (fighter.chefPotCooldown > 0) return false;
  const centerX = getFighterCenterX(fighter);
  fighter.chefShots.push({ kind: 'splash', x: centerX, life: 26 });
  knightHit(fighter, target, { x: centerX - 130, y: ground - 90, width: 260, height: 90 }, chefPotDamage, getFighterCenterX(target) >= centerX ? 9 : -9, -9);
  target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, 50);
  fighter.chefPotCooldown = getDebugCooldown(chefPotCooldown, fighter);
  fighter.chefGap = 40;
  recordSpecialUsed(fighter);
  playSound('robotBoom');
  return true;
}

// ---------- the sheriff's last stand (chapter 5, level 5) ----------
function updateSheriffCowboy(fighter) {
  if (fighter !== player2 || !normalArcadeActive || arcadeChapter !== 'knight' || arcadeCutscene.active || gameOver) return;
  if (player1.sheriffHealFx > 0) player1.sheriffHealFx -= 1;
  // down to his last breath: he gets back up
  if (!fighter.sheriffStandStarted && fighter.health <= 1) {
    startKnightSheriffStand();
    return;
  }
  if (!fighter.sheriffJusticeChecked && !fighter.sheriffStandStarted && fighter.health <= fighter.maxHealth * 0.6) {
    fighter.sheriffJusticeChecked = true;
    if (Math.random() < knightSheriffJusticeChance) {
      startDodgeRound('sheriff', fighter, player1);
      return;
    }
  }
  if (!fighter.sheriffStandActive) return;
  fighter.health = 1;
  // furious: his burst reloads much faster
  if (fighter.sheriffFurious && fighter.cowboyBurstCooldown > sheriffFuriousBurstCooldown) fighter.cowboyBurstCooldown = sheriffFuriousBurstCooldown;
  fighter.sheriffStandTimer -= 1;
  if (fighter.sheriffStandTimer % 60 === 0 && fighter.sheriffStandTimer <= 5 * 60) playSound('menuMove');
  if (fighter.sheriffStandTimer <= 0) startKnightSheriffEnd();
}

// a red pulse over the whole screen, the countdown, and a "+" over Knight when he heals
function drawSheriffLastStandFx() {
  const sheriff = player2;
  if (!sheriff || !sheriff.sheriffStandActive || !sheriff.sheriffBadge || arcadeCutscene.active) return;
  if (!normalArcadeActive || arcadeChapter !== 'knight' || selectedNormalArcadeLevel !== 5) return;
  const time = performance.now() / 1000;
  const furious = sheriff.sheriffFurious;
  const pulse = 0.5 + Math.sin(time * (furious ? 9 : 5)) * 0.5;
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, furious ? 110 : 160, canvas.width / 2, canvas.height / 2, canvas.width * 0.72);
  vignette.addColorStop(0, 'rgba(183, 28, 28, 0)');
  vignette.addColorStop(1, `rgba(${furious ? 120 : 183}, 0, ${furious ? 10 : 28}, ${(furious ? 0.5 : 0.35) + pulse * 0.25})`);
  ctx.save();
  // furious: the whole screen shakes a little with his rage
  if (furious) ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
  ctx.fillStyle = `rgba(183, 28, 28, ${(furious ? 0.12 : 0.06) + pulse * 0.05})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the countdown
  const seconds = Math.max(0, Math.ceil(sheriff.sheriffStandTimer / 60));
  ctx.textAlign = 'center';
  ctx.font = '900 18px Courier New, monospace';
  ctx.fillStyle = '#ffcdd2';
  ctx.fillText(furious ? 'EL SHERIFF PERDIO LA CABEZA!' : 'ULTIMA RONDA DEL SHERIFF', canvas.width / 2, 130);
  ctx.font = `900 ${seconds <= 5 ? 46 + pulse * 8 : 42}px Courier New, monospace`;
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 5;
  ctx.strokeText(String(seconds), canvas.width / 2, 176);
  ctx.fillStyle = seconds <= 5 ? '#ff5252' : '#ffffff';
  ctx.fillText(String(seconds), canvas.width / 2, 176);
  if (player1.sheriffHealFx > 0) {
    ctx.fillStyle = `rgba(105, 240, 174, ${player1.sheriffHealFx / 20})`;
    ctx.font = '900 22px Courier New, monospace';
    ctx.fillText(`+${player1.sheriffHealAmount || sheriffStandHealPerHit}`, getFighterCenterX(player1), player1.position.y - 14 - (20 - player1.sheriffHealFx));
  }
  ctx.textAlign = 'left';
  ctx.restore();
}

// ---------- the dodge round (chapter 5, levels 4 and 5) ----------
function startDodgeRound(theme, caster, target) {
  if (dodgeRound.active) return false;
  const box = { ...dodgeRoundBox };
  const soulWidth = Math.round(target.width * 0.3);
  const soulHeight = Math.round(target.height * 0.3);
  Object.assign(dodgeRound, {
    active: true,
    theme,
    config: dodgeRoundThemes[theme],
    caster,
    target,
    stage: dodgeRoundThemes[theme].talk ? 'talk' : 'intro',
    frame: 0,
    age: 0,
    talkIndex: 0,
    talkFrame: 0,
    dash: { timer: 0, cooldown: 0, held: false, dirX: 1, dirY: 0, trail: [] },
    lastDirX: 1,
    lastDirY: 0,
    parries: 0,
    helperActors: null,
    phaseIndex: -1,
    phaseFrame: 0,
    box: { x: getFighterCenterX(target) - 30, y: target.position.y + 20, width: 60, height: 80 },
    boxTarget: box,
    soul: { x: box.x + box.width / 2 - soulWidth / 2, y: box.y + box.height / 2 - soulHeight / 2, width: soulWidth, height: soulHeight },
    items: [],
    sparks: [],
    invulnerable: 0,
    shake: 0,
    hits: 0,
    caption: null,
    outroFrame: 0,
    mochiActor: null,
  });
  robotShots = [];
  cowboyBullets = [];
  lightShots = [];
  fireBeams = [];
  fireballs = [];
  if (caster.mochiPastries) caster.mochiPastries = [];
  caster.cowboyBurstShotsRemaining = 0;
  resetKeys();
  playSound('judgeFinalStart');
  return true;
}

function dodgeRoundCaption(text, color = '#fdd835') {
  dodgeRound.caption = { text, color, life: 110 };
}

function getDodgeSoulCenter() {
  const soul = dodgeRound.soul;
  return { x: soul.x + soul.width / 2, y: soul.y + soul.height / 2 };
}

// the attacks of each pattern, spawned over the phase
function spawnDodgePattern(pattern, t) {
  const round = dodgeRound;
  const box = round.boxTarget;
  const soul = getDodgeSoulCenter();
  // a harder theme spawns each pattern twice, out of step (the giant cake half a cycle later)
  if (round.config.doubleSpawn && !round.doubling) {
    round.doubling = true;
    spawnDodgePattern(pattern, t + (pattern === 'giantCake' ? 47 : 11));
    round.doubling = false;
  }
  // in the charged mode some attacks come BLUE: they can be parried with the dash
  const blueTypes = ['drop', 'side', 'aimed'];
  const push = (item) => {
    const blue = item.blue !== undefined ? item.blue : Boolean(round.config.blueChance && blueTypes.includes(item.type) && Math.random() < round.config.blueChance);
    round.items.push({ life: 400, warn: 0, ...item, blue });
  };
  if (spawnLightBoxPattern(pattern, t, push, box, soul)) return;
  if (spawnFriendBoxPattern(pattern, t, push, box, soul)) return;
  if (spawnJesterFinalePattern(pattern, t, push, box, soul)) return;
  if (pattern === 'pastryRain') {
    if (t % 16 === 0) push({ type: 'drop', sprite: 'pastry', x: box.x + 20 + Math.random() * (box.width - 40), y: box.y - 20, vy: 4.2 + Math.random() * 1.5, r: 11, warn: 24 });
  } else if (pattern === 'glovePunches') {
    if (t % 26 === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'glove', x: side < 0 ? box.x - 30 : box.x + box.width + 30, y: box.y + 24 + Math.random() * (box.height - 48), vx: -side * (5.5 + Math.random() * 2), vy: 0, r: 13 });
    }
    if (t % 70 === 35) push({ type: 'aimed', sprite: 'cream', x: box.x + box.width - 10, y: box.y + 10, vx: (soul.x - (box.x + box.width - 10)) / 55, vy: (soul.y - (box.y + 10)) / 55, r: 10 });
  } else if (pattern === 'mouseDash') {
    // Mochi runs across a lane (it warns first)
    if (t % 60 === 0) {
      const laneHeight = 46;
      const laneY = box.y + 10 + Math.floor(Math.random() * ((box.height - 20 - laneHeight) / laneHeight + 1)) * laneHeight;
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'mouse', y: laneY, h: laneHeight, warn: 40, dir: -side, x: side < 0 ? box.x - 40 : box.x + box.width + 40, speed: 13 });
    }
    if (t % 40 === 20) push({ type: 'drop', sprite: 'pastry', x: box.x + 20 + Math.random() * (box.width - 40), y: box.y - 20, vy: 5, r: 11, warn: 20 });
  } else if (pattern === 'giantCake') {
    // a giant cake falls over the whole box, except a gap
    if (t % 95 === 0) {
      const gapWidth = 80;
      const gapX = box.x + 20 + Math.random() * (box.width - 40 - gapWidth);
      push({ type: 'wall', sprite: 'cake', gapX, gapWidth, y: box.y - 40, vy: 3.2, h: 34, warn: 40 });
    }
    if (t % 48 === 24) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'glove', x: side < 0 ? box.x - 30 : box.x + box.width + 30, y: box.y + box.height - 26, vx: -side * 7, vy: 0, r: 13 });
    }
  } else if (pattern === 'lawBullets') {
    // rows of fast bullets from the right, with one open gap per volley
    if (t % 28 === 0) {
      const rows = 8;
      const gap = Math.floor(Math.random() * (rows - 1));
      for (let row = 0; row < rows; row += 1) {
        if (row === gap || row === gap + 1) continue;
        push({ type: 'side', sprite: 'bullet', x: box.x + box.width + 20, y: box.y + 18 + row * ((box.height - 36) / (rows - 1)), vx: -7.6, vy: 0, r: 8 });
      }
    }
  } else if (pattern === 'starBounce') {
    if (t % 44 === 0 && round.items.filter((item) => item.type === 'bouncer').length < 6) {
      const angle = Math.random() * Math.PI * 2;
      push({ type: 'bouncer', sprite: 'star', x: box.x + box.width / 2, y: box.y + 24, vx: Math.cos(angle) * 4.8, vy: Math.abs(Math.sin(angle)) * 4.8 + 1, r: 13, life: 300 });
    }
  } else if (pattern === 'bigRevolver') {
    // a giant revolver in the middle of the box: it turns to aim at Knight and fires every short while
    if (t === 1) push({ type: 'revolver', x: box.x + box.width / 2, y: box.y + box.height / 2, angle: Math.PI, cycle: 0, life: dodgeRoundSheriffPhaseFrames });
  } else if (pattern === 'wantedRain') {
    if (t % 14 === 0) push({ type: 'drop', sprite: 'poster', x: box.x + 24 + Math.random() * (box.width - 48), y: box.y - 24, vy: 4.2 + Math.random(), r: 14, warn: 20, sway: Math.random() * 6 });
    if (t % 60 === 30) push({ type: 'aimed', sprite: 'bullet', x: box.x + box.width - 10, y: soul.y, vx: -9, vy: 0, r: 8 });
  } else if (pattern === 'crossfire') {
    // bullets from both sides at once, plus a couple of stars bouncing around
    if (t % 40 === 0) {
      const rows = 7;
      const gap = Math.floor(Math.random() * (rows - 1));
      const fromLeft = Math.floor(t / 40) % 2 === 0;
      for (let row = 0; row < rows; row += 1) {
        if (row === gap || row === gap + 1) continue;
        const rowY = box.y + 20 + row * ((box.height - 40) / (rows - 1));
        push({ type: 'side', sprite: 'bullet', x: fromLeft ? box.x - 20 : box.x + box.width + 20, y: rowY, vx: fromLeft ? 7 : -7, vy: 0, r: 8 });
      }
    }
    if (t % 120 === 60 && round.items.filter((item) => item.type === 'bouncer').length < 3) {
      push({ type: 'bouncer', sprite: 'star', x: box.x + 30, y: box.y + 30, vx: 4.4, vy: 3.6, r: 12, life: 260 });
    }
  } else if (pattern === 'judgment') {
    // crosshairs on Knight... then the shot, and volleys from the left
    if (t % 24 === 0) push({ type: 'crosshair', x: soul.x + (Math.random() - 0.5) * 30, y: soul.y + (Math.random() - 0.5) * 30, r: 30, warn: 32, life: 44 });
    if (t % 70 === 35) {
      const rows = 7;
      const gap = Math.floor(Math.random() * (rows - 1));
      for (let row = 0; row < rows; row += 1) {
        if (row === gap || row === gap + 1) continue;
        push({ type: 'side', sprite: 'bullet', x: box.x - 20, y: box.y + 20 + row * ((box.height - 40) / (rows - 1)), vx: 8, vy: 0, r: 8 });
      }
    }
  }
}

function hurtDodgeTarget() {
  const round = dodgeRound;
  if (round.invulnerable > 0) return;
  const target = round.target;
  const damage = target.health * dodgeRoundDamagePercent;
  if (target.health > 1) {
    target.health = Math.max(1, target.health - damage);
    getPlayerStats(target).damageTaken += damage;
    getPlayerStats(round.caster).damageDealt += damage;
  }
  round.invulnerable = dodgeRoundInvulnerableFrames;
  round.hits += 1;
  round.shake = 10;
  playSound('judgeFinalHurt');
  updateHealthBars();
}

function updateDodgeItems() {
  const round = dodgeRound;
  const box = round.box;
  const soul = round.soul;
  const center = getDodgeSoulCenter();
  const soulRadius = Math.min(soul.width, soul.height) * 0.45;
  const touches = (x, y, r) => Math.hypot(center.x - x, center.y - y) < r + soulRadius;
  const hit = (item) => {
    if (item.blue && round.dash.timer > 0) parryDodgeItem(item);
    else hurtDodgeTarget();
  };
  round.items.forEach((item) => {
    item.life -= 1;
    if (item.warn > 0) {
      item.warn -= 1;
      return;
    }
    if (item.type === 'drop') {
      item.y += item.vy;
      if (item.sway) item.x += Math.sin(round.frame / 8 + item.sway) * 1.2;
      if (touches(item.x, item.y, item.r)) hit(item);
      if (item.y > box.y + box.height + 30) item.life = 0;
    } else if (item.type === 'side' || item.type === 'aimed') {
      item.x += item.vx;
      item.y += item.vy;
      if (item.wave) item.y += Math.sin(round.frame / 7 + item.wave) * 2;
      if (touches(item.x, item.y, item.r)) hit(item);
      if (item.x < box.x - 60 || item.x > box.x + box.width + 60 || item.y < box.y - 60 || item.y > box.y + box.height + 60) item.life = 0;
    } else if (item.type === 'bouncer') {
      item.x += item.vx;
      item.y += item.vy;
      if (item.x < box.x + item.r || item.x > box.x + box.width - item.r) item.vx *= -1;
      if (item.y < box.y + item.r || item.y > box.y + box.height - item.r) item.vy *= -1;
      if (touches(item.x, item.y, item.r)) hit(item);
    } else if (item.type === 'lane') {
      item.x += item.dir * item.speed;
      if (Math.abs(center.x - item.x) < 30 && center.y > item.y && center.y < item.y + item.h) hurtDodgeTarget();
      if (item.x < box.x - 80 || item.x > box.x + box.width + 80) item.life = 0;
    } else if (item.type === 'wall') {
      item.y += item.vy;
      const inBand = center.y + soulRadius > item.y && center.y - soulRadius < item.y + item.h;
      const inGap = center.x - soulRadius > item.gapX && center.x + soulRadius < item.gapX + item.gapWidth;
      if (inBand && !inGap) hurtDodgeTarget();
      if (item.y > box.y + box.height + 40) item.life = 0;
    } else if (item.type === 'revolver') {
      // it turns toward Knight, locks on (a red line), and fires
      item.cycle += 1;
      const aim = Math.atan2(center.y - item.y, center.x - item.x);
      const locking = item.cycle > 26;
      if (!locking) {
        let delta = aim - item.angle;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        item.angle += delta * 0.18;
      }
      if (item.cycle >= 40) {
        item.cycle = 0;
        const muzzleX = item.x + Math.cos(item.angle) * 52;
        const muzzleY = item.y + Math.sin(item.angle) * 52;
        round.items.push({ type: 'aimed', sprite: 'bullet', x: muzzleX, y: muzzleY, vx: Math.cos(item.angle) * 10, vy: Math.sin(item.angle) * 10, r: 8, warn: 0, life: 120 });
        item.flash = 6;
        round.shake = Math.max(round.shake, 4);
        playSound('cowboyBurst');
      }
      if (item.flash > 0) item.flash -= 1;
    } else if (item.type === 'beam') {
      // a column (or row) of light, after its warning
      item.active -= 1;
      if (item.active <= 0) item.life = 0;
      const inside = item.orient === 'v' ? Math.abs(center.x - item.pos) < item.size / 2 + soulRadius * 0.6 : Math.abs(center.y - item.pos) < item.size / 2 + soulRadius * 0.6;
      if (inside) hurtDodgeTarget();
    } else if (item.type === 'giantScythe') {
      item.vy = Math.min(16, (item.vy || 1) + 0.6);
      item.y += item.vy;
      item.spin = (item.spin || 0) + 0.08;
      if (touches(item.x, item.y, item.r * 0.7)) hurtDodgeTarget();
      if (item.y + item.r * 0.4 >= box.y + box.height) {
        item.life = 0;
        riftTerrainBroken = true;
        round.shake = 26;
        round.groundBreak = 90;
        for (let chunk = 0; chunk < 60; chunk += 1) {
          const angle = -Math.PI * Math.random();
          const speed = 4 + Math.random() * 12;
          round.sparks.push({ x: item.x + (Math.random() - 0.5) * 80, y: box.y + box.height - 6, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 40 + Math.random() * 20, rock: true });
        }
        playSound('omegaKickImpact');
        playSound('judgeOverdrive');
        dodgeRoundCaption('EL TERRENO SE PARTE!', '#ff5252');
      }
    } else if (item.type === 'bomb') {
      // a joke bomb: it drops, sits there ticking... and bursts into shards
      if (item.y < item.stopY) item.y = Math.min(item.stopY, item.y + item.vy);
      else item.fuse -= 1;
      if (touches(item.x, item.y, item.r)) hurtDodgeTarget();
      if (item.fuse <= 0) {
        item.life = 0;
        for (let shard = 0; shard < 8; shard += 1) {
          const angle = (shard / 8) * Math.PI * 2 + round.frame * 0.1;
          round.items.push({ type: 'aimed', sprite: 'shard', x: item.x, y: item.y, vx: Math.cos(angle) * 4.2, vy: Math.sin(angle) * 4.2, r: 7, warn: 0, life: 160 });
        }
        round.shake = Math.max(round.shake, 4);
        playSound('omegaClashMiss');
      }
    } else if (item.type === 'disc') {
      // a cutting disc: it bounces around the box, or flies out and comes back like a boomerang
      item.spin = (item.spin || 0) + 0.4;
      if (item.boomerang) {
        item.vx += item.pull;
        item.x += item.vx;
        item.y += item.vy;
        if (item.x > box.x + box.width + 60 && item.vx > 0) item.life = 0;
      } else {
        item.x += item.vx;
        item.y += item.vy;
        if (item.x < box.x + item.r || item.x > box.x + box.width - item.r) {
          item.vx *= -1;
          item.bounces -= 1;
        }
        if (item.y < box.y + item.r || item.y > box.y + box.height - item.r) {
          item.vy *= -1;
          item.bounces -= 1;
        }
        if (item.bounces < 0) item.life = Math.min(item.life, 20);
      }
      if (touches(item.x, item.y, item.r)) hit(item);
    } else if (item.type === 'sphere') {
      // a big sphere of light crossing the top of the box slowly, raining light balls
      item.x += item.vx;
      if (item.x < box.x + 30 || item.x > box.x + box.width - 30) item.vx *= -1;
      item.y = box.y + 34 + Math.sin(round.frame / 20) * 6;
      item.fire = (item.fire || 0) + 1;
      const shoot = (angle, speed) => {
        const blue = Math.random() < (round.config.blueChance || 0);
        round.items.push({ type: 'aimed', sprite: 'lightOrb', x: item.x, y: item.y + 14, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 8, warn: 0, life: 200, blue });
      };
      if (item.fire % item.rate === 0) {
        const aim = Math.atan2(center.y - item.y, center.x - item.x);
        [-0.35, 0, 0.35].forEach((spread) => shoot(aim + spread, 4.2));
      }
      if (item.fire % 75 === 40) {
        for (let ray = 0; ray < 9; ray += 1) shoot(Math.PI * 0.12 + (ray / 8) * Math.PI * 0.76, 3.4);
        playSound('judgeLight');
      }
      if (touches(item.x, item.y, item.r)) hurtDodgeTarget();
    } else if (item.type === 'ring') {
      // a ring of light growing from a point, with one gap to slip through
      item.radius += item.speed;
      const distance = Math.hypot(center.x - item.x, center.y - item.y);
      let angle = Math.atan2(center.y - item.y, center.x - item.x) - item.gap;
      while (angle > Math.PI) angle -= Math.PI * 2;
      while (angle < -Math.PI) angle += Math.PI * 2;
      if (Math.abs(distance - item.radius) < 7 + soulRadius && Math.abs(angle) > item.gapSize / 2) hurtDodgeTarget();
      if (item.radius > 520) item.life = 0;
    } else if (item.type === 'crosshair') {
      if (!item.fired) {
        item.fired = true;
        playSound('cowboyBurst');
        if (touches(item.x, item.y, item.r * 0.7)) hurtDodgeTarget();
      }
    }
  });
  round.items = round.items.filter((item) => item.life > 0);
}

function moveDodgeSoul() {
  const round = dodgeRound;
  const soul = round.soul;
  const box = round.box;
  if (round.stage === 'phase' || (round.stage === 'finale' && round.finale.state === 'come')) {
    const moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const moveY = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    const length = Math.hypot(moveX, moveY) || 1;
    if (moveX || moveY) {
      round.lastDirX = moveX / length;
      round.lastDirY = moveY / length;
    }
    const dash = round.dash;
    if (round.config.charged) {
      // CHARGED MODE: hold Q to charge (everything slows down while you aim), let go to dash
      if (dash.cooldown > 0) dash.cooldown -= 1;
      if (!keys.q) dash.held = false;
      if (keys.q && !dash.held && !dash.charging && dash.timer === 0 && dash.cooldown === 0) {
        Object.assign(dash, { charging: true, charge: 0, held: true, manualAim: false, aimX: round.lastDirX, aimY: round.lastDirY });
        playSound('judgeLight');
      }
      if (dash.charging) {
        dash.charge += 1;
        if (moveX || moveY) {
          dash.aimX = moveX / length;
          dash.aimY = moveY / length;
          dash.manualAim = true;
        } else if (!dash.manualAim) {
          // no direction pressed: it aims by itself at the nearest blue attack
          const center = getDodgeSoulCenter();
          let best = null;
          round.items.forEach((item) => {
            if (!item.blue || item.warn > 0 || item.x === undefined) return;
            const distance = Math.hypot(item.x - center.x, item.y - center.y);
            if (!best || distance < best.distance) best = { item, distance };
          });
          if (round.finale && round.finale.state === 'come') {
            const distance = Math.hypot(round.finale.x - center.x, round.finale.y - center.y);
            best = { item: round.finale, distance };
          }
          if (best && best.distance > 1) {
            dash.aimX = (best.item.x - center.x) / best.distance;
            dash.aimY = (best.item.y - center.y) / best.distance;
            dash.aimTarget = best.item;
          } else {
            dash.aimTarget = null;
          }
        }
        if (!keys.q || dash.charge >= lightBoxChargeMaxFrames) {
          dash.charging = false;
          dash.timer = 1;
          dash.dirX = dash.aimX;
          dash.dirY = dash.aimY;
          dash.aimTarget = null;
          playSound('judgeOverdrive');
        }
        soul.x = Math.max(box.x + 4, Math.min(box.x + box.width - 4 - soul.width, soul.x));
        soul.y = Math.max(box.y + 4, Math.min(box.y + box.height - 4 - soul.height, soul.y));
        return;
      }
    }
    if (dash.timer > 0) {
      dash.timer += 1;
      soul.x += dash.dirX * lightBoxDashSpeed;
      soul.y += dash.dirY * lightBoxDashSpeed;
      dash.trail.push({ x: soul.x + soul.width / 2, y: soul.y + soul.height / 2, life: 10 });
      if (dash.timer > lightBoxDashFrames) {
        dash.timer = 0;
        dash.cooldown = lightBoxDashCooldown;
      }
    } else {
      soul.x += (moveX / length) * 5.2;
      soul.y += (moveY / length) * 5.2;
    }
  } else {
    soul.x += (box.x + box.width / 2 - soul.width / 2 - soul.x) * 0.2;
    soul.y += (box.y + box.height / 2 - soul.height / 2 - soul.y) * 0.2;
  }
  soul.x = Math.max(box.x + 4, Math.min(box.x + box.width - 4 - soul.width, soul.x));
  soul.y = Math.max(box.y + 4, Math.min(box.y + box.height - 4 - soul.height, soul.y));
}

function drawDodgeItem(item) {
  const round = dodgeRound;
  const box = round.box;
  ctx.save();
  if (item.warn > 0) {
    // warnings: a red marker where the attack is coming
    ctx.fillStyle = `rgba(255, 82, 82, ${0.35 + Math.sin(round.frame / 2) * 0.25})`;
    if (item.type === 'drop') ctx.fillRect(item.x - 12, box.y + 2, 24, 8);
    else if (item.type === 'lane') ctx.fillRect(box.x, item.y, box.width, item.h);
    else if (item.type === 'wall') {
      ctx.fillRect(box.x, box.y + 2, item.gapX - box.x, 8);
      ctx.fillRect(item.gapX + item.gapWidth, box.y + 2, box.x + box.width - item.gapX - item.gapWidth, 8);
    } else if (item.type === 'giantScythe') {
      // its huge shadow on the ground, and the path
      const grow = 1 - item.warn / 70;
      ctx.fillStyle = `rgba(255, 23, 68, ${0.25 + grow * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(item.x, box.y + box.height - 12, item.r * (0.4 + grow * 0.8), 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 82, 82, ${0.5 + Math.sin(round.frame / 2) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(item.x - item.r * 0.6, box.y, item.r * 1.2, box.height);
      ctx.setLineDash([]);
    } else if (item.meteor) {
      // the path of a falling scythe
      ctx.strokeStyle = `rgba(255, 82, 82, ${0.45 + Math.sin(round.frame / 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.x + item.vx * 90, item.y + item.vy * 90);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (item.type === 'disc' || item.type === 'sphere') {
      // where the disc (or the sun) is about to appear
      ctx.strokeStyle = `rgba(255, 82, 82, ${0.5 + Math.sin(round.frame / 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r + 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (item.type === 'beam') {
      ctx.strokeStyle = `rgba(255, 249, 196, ${0.4 + Math.sin(round.frame / 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      if (item.orient === 'v') {
        ctx.moveTo(item.pos - item.size / 2, box.y);
        ctx.lineTo(item.pos - item.size / 2, box.y + box.height);
        ctx.moveTo(item.pos + item.size / 2, box.y);
        ctx.lineTo(item.pos + item.size / 2, box.y + box.height);
      } else {
        ctx.moveTo(box.x, item.pos - item.size / 2);
        ctx.lineTo(box.x + box.width, item.pos - item.size / 2);
        ctx.moveTo(box.x, item.pos + item.size / 2);
        ctx.lineTo(box.x + box.width, item.pos + item.size / 2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (item.type === 'crosshair') {
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.9)';
      ctx.lineWidth = 2;
      const radius = item.r * (0.6 + item.warn / 38);
      ctx.beginPath();
      ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
      ctx.moveTo(item.x - radius - 6, item.y);
      ctx.lineTo(item.x + radius + 6, item.y);
      ctx.moveTo(item.x, item.y - radius - 6);
      ctx.lineTo(item.x, item.y + radius + 6);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }
  const spin = round.frame * 0.15;
  if (item.blue && item.x !== undefined) {
    // blue attacks glow: dash through them!
    const glow = ctx.createRadialGradient(item.x, item.y, 1, item.x, item.y, (item.r || 10) + 12);
    glow.addColorStop(0, 'rgba(64, 196, 255, 0.7)');
    glow.addColorStop(1, 'rgba(64, 196, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(item.x - (item.r || 10) - 12, item.y - (item.r || 10) - 12, ((item.r || 10) + 12) * 2, ((item.r || 10) + 12) * 2);
  }
  if (drawFriendBoxItem(item, box) || drawLightBoxItem(item, box, spin)) {
    ctx.restore();
    return;
  }
  if (item.type === 'revolver') {
    // the aiming line while it locks on
    if (item.cycle > 26) {
      ctx.strokeStyle = `rgba(255, 23, 68, ${0.4 + Math.sin(round.frame) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.x + Math.cos(item.angle) * 600, item.y + Math.sin(item.angle) * 600);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.translate(item.x, item.y);
    ctx.rotate(item.angle);
    if (Math.cos(item.angle) < 0) ctx.scale(1, -1);
    // barrel, cylinder, frame, hammer and grip
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(4, -7, 50, 12);
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(4, -7, 50, 3);
    ctx.fillStyle = '#455a64';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#263238';
    for (let chamber = 0; chamber < 6; chamber += 1) {
      const angle = chamber * (Math.PI / 3) + round.frame * 0.05;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 8, Math.sin(angle) * 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#37474f';
    ctx.fillRect(-14, -12, 8, 6);
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.moveTo(-10, 6);
    ctx.lineTo(4, 6);
    ctx.lineTo(-6, 36);
    ctx.lineTo(-22, 32);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(-10, 22, 3, 0, Math.PI * 2);
    ctx.fill();
    if (item.flash > 0) {
      ctx.fillStyle = `rgba(255, 235, 59, ${item.flash / 6})`;
      ctx.beginPath();
      ctx.arc(60, -1, 10 + item.flash * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (item.type === 'crosshair') {
    // the shot: a burst where the crosshair was
    ctx.fillStyle = `rgba(255, 235, 59, ${Math.max(0, item.life / 50)})`;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * 0.7 * (1.4 - item.life / 50), 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type === 'wall') {
    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(box.x, item.y, item.gapX - box.x, item.h);
    ctx.fillRect(item.gapX + item.gapWidth, item.y, box.x + box.width - item.gapX - item.gapWidth, item.h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(box.x, item.y - 6, item.gapX - box.x, 8);
    ctx.fillRect(item.gapX + item.gapWidth, item.y - 6, box.x + box.width - item.gapX - item.gapWidth, 8);
    ctx.fillStyle = '#e91e63';
    for (let cherry = box.x + 20; cherry < box.x + box.width; cherry += 46) {
      if (cherry > item.gapX - 8 && cherry < item.gapX + item.gapWidth + 8) continue;
      ctx.beginPath();
      ctx.arc(cherry, item.y - 8, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (item.type === 'lane') {
    // Mochi dashing across, gloves first
    ctx.translate(item.x, item.y + item.h / 2);
    ctx.scale(item.dir, 1);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(-70, -3, 50, 2);
    ctx.fillRect(-60, 6, 40, 2);
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(-16, -16, 30, 32);
    ctx.beginPath();
    ctx.arc(-8, -18, 7, 0, Math.PI * 2);
    ctx.arc(8, -18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.fillRect(-16, -12, 30, 3);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(20, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(4, -6, 3, 3);
  } else {
    ctx.translate(item.x, item.y);
    if (item.sprite === 'pastry' || item.sprite === 'cream') {
      ctx.rotate(spin);
      ctx.fillStyle = item.sprite === 'cream' ? '#fff8e1' : '#f48fb1';
      ctx.fillRect(-item.r, -item.r * 0.7, item.r * 2, item.r * 1.4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-item.r, -item.r * 0.9, item.r * 2, item.r * 0.4);
      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      ctx.arc(0, -item.r, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.sprite === 'glove') {
      ctx.scale(item.vx < 0 ? -1 : 1, 1);
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.arc(0, 0, item.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-item.r - 8, -6, 10, 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(-item.r - 26, -2, 16, 3);
    } else if (item.sprite === 'bullet') {
      ctx.scale(item.vx < 0 ? -1 : 1, 1);
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.ellipse(0, 0, item.r + 3, item.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(-item.r - 20, -1, 16, 2);
    } else if (item.sprite === 'star') {
      ctx.rotate(spin);
      ctx.fillStyle = '#fdd835';
      ctx.strokeStyle = '#8d6e00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 ? item.r * 0.45 : item.r;
        const angle = -Math.PI / 2 + point * (Math.PI / 5);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (item.sprite === 'poster') {
      ctx.rotate(Math.sin(round.frame / 6 + (item.sway || 0)) * 0.3);
      ctx.fillStyle = '#f3e5ab';
      ctx.fillRect(-12, -16, 24, 32);
      ctx.fillStyle = '#4e342e';
      ctx.font = '900 5px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SE BUSCA', 0, -9);
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(-5, -6, 10, 12);
      ctx.fillStyle = '#111';
      ctx.fillRect(-4, -3, 8, 2);
      ctx.fillStyle = '#b71c1c';
      ctx.fillText('$$$', 0, 13);
    }
  }
  ctx.restore();
}

function drawDodgeSoul() {
  const round = dodgeRound;
  if (round.invulnerable > 0 && Math.floor(round.invulnerable / 4) % 2 === 0) return;
  const target = round.target;
  const center = getDodgeSoulCenter();
  const savedPosition = { ...target.position };
  const savedFacing = target.attacksToTheRight;
  ctx.save();
  if (round.config.charged) {
    round.dash.trail.forEach((ghost) => {
      ctx.fillStyle = `rgba(64, 196, 255, ${ghost.life / 22})`;
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, 14, 0, Math.PI * 2);
      ctx.fill();
    });
    // the charge ring: full when the dash is ready
    const ready = round.dash.cooldown === 0 && round.dash.timer === 0;
    ctx.strokeStyle = ready ? 'rgba(64, 196, 255, 0.9)' : 'rgba(64, 196, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - round.dash.cooldown / lightBoxDashCooldown));
    ctx.stroke();
  }
  if (round.dash.charging) {
    // the aim: an arrow where the dash will go (and a mark on the blue attack it locked on)
    const dash = round.dash;
    const fill = Math.min(1, dash.charge / 20);
    ctx.strokeStyle = `rgba(64, 196, 255, ${0.5 + fill * 0.5})`;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 3;
    const tipX = center.x + dash.aimX * 80;
    const tipY = center.y + dash.aimY * 80;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(center.x + dash.aimX * 26, center.y + dash.aimY * 26);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.setLineDash([]);
    const angle = Math.atan2(dash.aimY, dash.aimX);
    ctx.beginPath();
    ctx.moveTo(tipX + Math.cos(angle) * 10, tipY + Math.sin(angle) * 10);
    ctx.lineTo(tipX + Math.cos(angle + 2.4) * 10, tipY + Math.sin(angle + 2.4) * 10);
    ctx.lineTo(tipX + Math.cos(angle - 2.4) * 10, tipY + Math.sin(angle - 2.4) * 10);
    ctx.closePath();
    ctx.fill();
    if (dash.aimTarget) {
      ctx.strokeStyle = '#40c4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dash.aimTarget.x, dash.aimTarget.y, (dash.aimTarget.r || 10) + 9 + Math.sin(round.age / 3) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    // the charge filling up (when it is full it goes by itself)
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (dash.charge / lightBoxChargeMaxFrames));
    ctx.stroke();
  }
  if (round.healFx > 0) {
    round.healFx -= 1;
    ctx.fillStyle = `rgba(105, 240, 174, ${round.healFx / 90})`;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 40 - round.healFx / 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = round.dash.timer > 0 ? 'rgba(64, 196, 255, 0.45)' : 'rgba(144, 202, 249, 0.18)';
  ctx.beginPath();
  ctx.arc(center.x, center.y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(center.x, center.y);
  ctx.scale(0.3, 0.3);
  target.position = { x: -target.width / 2, y: -target.height / 2 };
  target.attacksToTheRight = true;
  target.isAttacking = false;
  target.draw();
  ctx.restore();
  target.position = savedPosition;
  target.attacksToTheRight = savedFacing;
}

function finishDodgeRound() {
  const round = dodgeRound;
  round.active = false;
  const target = round.target;
  const caster = round.caster;
  target.position.x = 220;
  target.position.y = ground - target.height;
  target.velocity.x = 0;
  target.velocity.y = 0;
  caster.position.x = Math.min(canvas.width - caster.width - 40, 700);
  caster.position.y = ground - caster.height;
  caster.velocity.x = 0;
  caster.velocity.y = 0;
  robotShots = [];
  cowboyBullets = [];
  resetKeys();
  jesterWhiteFade = 40;
  updateHealthBars();
}

function updateDodgeRound() {
  const round = dodgeRound;
  const config = round.config;
  round.frame += 1;
  round.age += 1;
  if (round.invulnerable > 0) round.invulnerable -= 1;
  round.shake *= 0.88;
  if (round.caption) round.caption.life -= 1;
  round.dash.trail.forEach((ghost) => (ghost.life -= 1));
  round.dash.trail = round.dash.trail.filter((ghost) => ghost.life > 0);
  round.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    if (spark.rock) spark.vy += 0.4;
    spark.life -= 1;
  });
  round.sparks = round.sparks.filter((spark) => spark.life > 0);
  if (round.popups) {
    round.popups.forEach((popup) => {
      popup.life -= 1;
      popup.y -= 0.8;
    });
    round.popups = round.popups.filter((popup) => popup.life > 0);
  }
  if (round.stage === 'talk') {
    // a few lines before the attack (Enter skips)
    round.talkFrame += 1;
    const line = config.talk[round.talkIndex];
    if (round.talkSkip || round.talkFrame > line.text.length / 1.6 + 90) {
      round.talkSkip = false;
      round.talkIndex += 1;
      round.talkFrame = 0;
      if (round.talkIndex >= config.talk.length) {
        round.stage = 'intro';
        round.frame = 0;
      }
    }
  } else if (round.stage === 'intro') {
    if (round.frame === 1) dodgeRoundCaption(config.title, config.border[0]);
    if (round.frame >= 90) {
      round.stage = 'phase';
      round.phaseIndex = 0;
      round.phaseFrame = 0;
      dodgeRoundCaption(config.phases[0].caption, config.border[1]);
    }
  } else if (round.stage === 'phase') {
    // while the dash charges, time runs slower for the attacks
    round.timeAcc = (round.timeAcc || 0) + (round.dash.charging ? lightBoxSlowScale : 1);
    round.simSteps = 0;
    while (round.timeAcc >= 1 && round.stage === 'phase') {
      round.timeAcc -= 1;
      round.simSteps += 1;
      advanceDodgePhase(round, config);
    }
  } else if (round.stage === 'outro') {
    round.outroFrame += 1;
    if (round.outroFrame >= 70) {
      finishDodgeRound();
      if (config.onEnd === 'riftClash') startRiftClash();
      if (config.onEnd === 'friendBoxEnd') friendBoxEnd();
      return;
    }
  } else if (round.stage === 'finale') {
    if (updateLightFinale(round)) return;
  }
  ['x', 'y', 'width', 'height'].forEach((key) => {
    round.box[key] += (round.boxTarget[key] - round.box[key]) * 0.14;
  });
  moveDodgeSoul();
  const itemSteps = round.stage === 'phase' ? round.simSteps : 1;
  for (let step = 0; step < itemSteps; step += 1) updateDodgeItems();
  drawDodgeRound(round, config);
}

function advanceDodgePhase(round, config) {
  {
    round.phaseFrame += 1;
    const phase = config.phases[round.phaseIndex];
    const phaseFrames = phase.frames || config.phaseFrames || (round.theme === 'sheriff' ? dodgeRoundSheriffPhaseFrames : dodgeRoundPhaseFrames);
    if (round.phaseFrame >= phaseFrames) {
      if (round.phaseIndex + 1 < config.phases.length) {
        round.phaseIndex += 1;
        round.phaseFrame = 0;
        dodgeRoundCaption(config.phases[round.phaseIndex].caption, config.border[round.phaseIndex % 2]);
        playSound('judgeFinalStart');
      } else {
        if (config.finale) {
          startLightFinale(round);
          return;
        }
        round.stage = 'outro';
        round.outroFrame = 0;
        round.items = [];
        round.dash.charging = false;
        const cleared = round.hits === 0 ? 'SIN UN RASGUÑO!' : 'RONDA SUPERADA!';
        if (config.charged) {
          // the light of the spirits heals Knight
          const target = round.target;
          const before = target.health;
          target.health = Math.min(target.maxHealth, target.health + target.maxHealth * lightBoxHealRatio);
          round.healFx = 60;
          updateHealthBars();
          playSound('achievement');
          dodgeRoundCaption(`${cleared}  +${Math.round(target.health - before)} VIDA`, '#69f0ae');
        } else {
          dodgeRoundCaption(cleared, '#69f0ae');
        }
      }
    } else if (round.phaseFrame > 30 && round.phaseFrame < phaseFrames - 40) {
      spawnDodgePattern(phase.pattern, round.phaseFrame - 30);
    }
  }
}

function drawDodgeRound(round, config) {
  // ----- drawing -----
  const introProgress = Math.min(1, round.age / 50);
  ctx.save();
  ctx.translate((Math.random() - 0.5) * round.shake, (Math.random() - 0.5) * round.shake);
  drawStage();
  ctx.fillStyle = `rgba(0, 0, 0, ${0.72 * introProgress})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  // the attackers at the sides
  const caster = round.caster;
  const savedPosition = { ...caster.position };
  const savedFacing = caster.attacksToTheRight;
  caster.position = { x: 820, y: ground - caster.height };
  caster.attacksToTheRight = false;
  // (Light Warrior casts from afar: no punch flying toward a Knight who is inside the box)
  caster.isAttacking = !config.charged && round.theme !== 'jesterFinale' && Math.floor(round.frame / 12) % 3 === 0 && round.stage === 'phase';
  caster.draw();
  caster.position = savedPosition;
  caster.attacksToTheRight = savedFacing;
  caster.isAttacking = false;
  // Mochi joins the chef from the left
  if (round.theme === 'spa') {
    if (!round.mochiActor) {
      round.mochiActor = new Fighter({ x: 150, y: 0, color: '#9e9e9e', attacksToTheRight: true });
      round.mochiActor.setCharacterType('normal', 'mochiMouse');
      round.mochiActor.mochiPowered = true;
    }
    const mochi = round.mochiActor;
    mochi.position = { x: 150, y: ground - mochi.height - (round.stage === 'phase' ? Math.abs(Math.sin(round.frame / 5)) * 8 : 0) };
    mochi.attacksToTheRight = true;
    mochi.isAttacking = Math.floor(round.frame / 8) % 2 === 0 && round.stage === 'phase';
    mochi.draw();
  }
  if (config.helpers) drawLightBoxHelpers(round);
  // the box
  const box = round.box;
  ctx.fillStyle = '#0a0710';
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeStyle = config.border[Math.floor(round.frame / 20) % 2];
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 12;
  ctx.lineWidth = 4;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x - 2, box.y - 2, box.width + 4, box.height + 4);
  ctx.clip();
  if (round.dash.charging) {
    ctx.fillStyle = 'rgba(64, 196, 255, 0.1)';
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }
  round.items.forEach(drawDodgeItem);
  (round.popups || []).forEach((popup) => {
    ctx.fillStyle = `rgba(105, 240, 174, ${Math.min(1, popup.life / 15)})`;
    ctx.font = '900 16px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(popup.text, popup.x, popup.y);
    ctx.textAlign = 'left';
  });
  round.sparks.forEach((spark) => {
    if (spark.rock) {
      ctx.fillStyle = `rgba(95, 98, 131, ${Math.min(1, spark.life / 20)})`;
      ctx.fillRect(spark.x - 4, spark.y - 4, 8, 8);
      return;
    }
    ctx.fillStyle = `rgba(64, 196, 255, ${spark.life / 14})`;
    ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
  });
  if (round.groundBreak > 0) {
    // the floor of the box splits open
    round.groundBreak -= 1;
    const crack = Math.min(1, (90 - round.groundBreak) / 12);
    ctx.strokeStyle = '#ff5252';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 14;
    for (let fissure = 0; fissure < 7; fissure += 1) {
      const startX = box.x + box.width / 2 + (fissure - 3) * 30;
      ctx.beginPath();
      ctx.moveTo(startX, box.y + box.height);
      ctx.lineTo(startX + (fissure - 3) * 40 * crack, box.y + box.height - 60 * crack);
      ctx.lineTo(startX + (fissure - 3) * 90 * crack, box.y + box.height - (90 + fissure * 10) * crack);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  drawDodgeSoul();
  ctx.restore();
  // captions and the phase counter
  if (round.caption && round.caption.life > 0) {
    ctx.globalAlpha = Math.min(1, round.caption.life / 20);
    ctx.fillStyle = round.caption.color;
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.font = '900 26px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText(round.caption.text, canvas.width / 2, box.y - 24);
    ctx.fillText(round.caption.text, canvas.width / 2, box.y - 24);
    ctx.globalAlpha = 1;
  }
  if (round.stage === 'phase') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${round.phaseIndex + 1} / ${config.phases.length}   -   esquiva con W A S D`, canvas.width / 2, box.y + box.height + 26);
    if (config.charged) {
      ctx.fillStyle = '#40c4ff';
      ctx.font = '900 12px Courier New, monospace';
      const parries = round.parries > 0 ? `   PARRYS: ${round.parries}` : '';
      ctx.fillText(`mantene Q: camara lenta y apunta - solta Q: dash (parry a lo AZUL)${parries}`, canvas.width / 2, box.y + box.height + 44);
    }
  }
  if (round.finale) drawLightFinale(round);
  if (round.stage === 'talk') drawLightBoxTalk(round);
  ctx.textAlign = 'left';
  ctx.restore();
}

// ---------- the guard of the Gran Farol (chapter 5, level 6) ----------
function resetLanternGuard(fighter) {
  Object.assign(fighter, {
    guardSweepCooldown: 90,
    guardThrustCooldown: 60,
    guardFlashCooldown: 240,
    guardSweepTimer: 0,
    guardThrustTimer: 0,
    guardThrustHit: false,
    guardFlashFx: 0,
    guardGap: 0,
    guardFallen: false,
    guardFallScene: false,
    guardFallProgress: 1,
    guardDisarmed: false,
    guardLanternOut: false,
  });
}

function updateLanternGuard(fighter) {
  tickCooldowns(fighter, ['guardSweepCooldown', 'guardThrustCooldown', 'guardFlashCooldown', 'guardFlashFx', 'guardGap']);
  if (arcadeCutscene.active || fighter.guardFallen) return;
  const target = getOpponent(fighter);
  // at 10% the fight stops: Knight has second thoughts... and the darkness takes over
  if (fighter === player2 && normalArcadeActive && arcadeChapter === 'knight' && !fighter.guardFallScene && fighter.health <= fighter.maxHealth * guardFallRatio && !gameOver) {
    startKnightGuardFall();
    return;
  }
  const direction = fighter.attacksToTheRight ? 1 : -1;
  if (fighter.guardSweepTimer > 0) {
    fighter.guardSweepTimer -= 1;
    fighter.velocity.x = 0;
    if (fighter.guardSweepTimer === 8) {
      const area = { x: direction > 0 ? fighter.position.x + 10 : fighter.position.x - 140, y: fighter.position.y + 10, width: 190, height: 110 };
      knightHit(fighter, target, area, guardSweepDamage, direction * 10, -8);
      playSound('judgeThrow');
    }
  }
  if (fighter.guardThrustTimer > 0) {
    fighter.guardThrustTimer -= 1;
    fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + direction * 8));
    if (!fighter.guardThrustHit) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width : fighter.position.x - 110, y: fighter.position.y + 50, width: 110, height: 24 };
      if (knightHit(fighter, target, area, guardThrustDamage, direction * 7, -3)) fighter.guardThrustHit = true;
    }
  }
}

function castGuardSweep(fighter) {
  if (fighter.guardSweepCooldown > 0) return false;
  fighter.guardSweepTimer = 22;
  fighter.guardSweepCooldown = getDebugCooldown(guardSweepCooldown, fighter);
  fighter.guardGap = 40;
  recordSpecialUsed(fighter);
  return true;
}

function castGuardThrust(fighter) {
  if (fighter.guardThrustCooldown > 0) return false;
  fighter.guardThrustTimer = 16;
  fighter.guardThrustHit = false;
  fighter.guardThrustCooldown = getDebugCooldown(guardThrustCooldown, fighter);
  fighter.guardGap = 30;
  recordSpecialUsed(fighter);
  playSound('chronoRam');
  return true;
}

// the lantern on his belt flashes: it blinds and slows whoever is close
function castGuardFlash(fighter, target) {
  if (fighter.guardFlashCooldown > 0) return false;
  fighter.guardFlashFx = 26;
  if (Math.abs(getFighterCenterX(target) - getFighterCenterX(fighter)) < 300) {
    applyDamage(fighter, target, guardFlashDamage, { isSpecial: true });
    target.icedSlowTimer = Math.max(target.icedSlowTimer || 0, 90);
  }
  fighter.guardFlashCooldown = getDebugCooldown(guardFlashCooldown, fighter);
  fighter.guardGap = 30;
  recordSpecialUsed(fighter);
  playSound('judgeLight');
  return true;
}

// the spirits orbiting whoever carries them (chapter 5, level 7)
function drawSpiritOrbsFx() {
  const time = performance.now() / 1000;
  [player1, player2].forEach((fighter, owner) => {
    if (!fighter || !(fighter.spiritCount > 0) || arcadeCutscene.active) return;
    const colors = owner === 0 ? knightSpiritColors.slice(3) : knightSpiritColors.slice(0, 3);
    for (let spirit = 0; spirit < fighter.spiritCount; spirit += 1) {
      const angle = time * 2 + spirit * ((Math.PI * 2) / fighter.spiritCount);
      const orbX = getFighterCenterX(fighter) + Math.cos(angle) * 46;
      const orbY = fighter.position.y + fighter.height / 2 + Math.sin(angle) * 22;
      const glow = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, 12);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.4, hexToRgba(colors[spirit % colors.length], 0.9));
      glow.addColorStop(1, hexToRgba(colors[spirit % colors.length], 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// ---------- Light Warrior's BOX ATTACKS (chapter 5, level 7) ----------
function isLightBoxFight() {
  return normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 7 && player2.characterType === 'lightWarrior';
}

// every so often he pulls Knight into the box: five of them, in order
function updateLightBoxAttacks() {
  if (!isLightBoxFight() || !gameStarted || gameOver || arcadeCutscene.active || dodgeRound.active) return;
  const lightWarrior = player2;
  if (typeof lightWarrior.lightBoxIndex !== 'number') {
    lightWarrior.lightBoxIndex = 0;
    lightWarrior.lightBoxTimer = lightBoxFirstDelay;
  }
  if (lightWarrior.lightBoxIndex >= 5 || !canFighterAct(lightWarrior)) return;
  if (lightWarrior.health <= lightWarrior.maxHealth * lightWarriorBoxFloorRatio + 0.5) lightWarrior.lightBoxTimer = Math.min(lightWarrior.lightBoxTimer, 60);
  lightWarrior.lightBoxTimer -= 1;
  if (lightWarrior.lightBoxTimer > 0) return;
  if (startDodgeRound(`lightBox${lightWarrior.lightBoxIndex + 1}`, lightWarrior, player1)) {
    lightWarrior.lightBoxIndex += 1;
    lightWarrior.lightBoxTimer = lightBoxInterval;
  }
}

function parryDodgeItem(item) {
  const round = dodgeRound;
  item.life = 0;
  round.parries += 1;
  round.shake = Math.max(round.shake, 3);
  for (let spark = 0; spark < 8; spark += 1) {
    const angle = (spark / 8) * Math.PI * 2;
    round.sparks.push({ x: item.x, y: item.y, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, life: 14 });
  }
  // the parried light goes back to him
  const caster = round.caster;
  caster.health = Math.max(caster.maxHealth * lightWarriorBoxFloorRatio, caster.health - lightBoxParryDamage);
  // ...and a little of it heals Knight
  const target = round.target;
  const before = target.health;
  target.health = Math.min(target.maxHealth, target.health + target.maxHealth * lightBoxParryHealRatio);
  const healed = Math.round(target.health - before);
  if (healed > 0) {
    const center = getDodgeSoulCenter();
    round.popups = round.popups || [];
    round.popups.push({ x: center.x, y: center.y - 20, text: `+${healed}`, life: 40 });
  }
  playSound('judgeParry');
  updateHealthBars();
}

function spawnLightBoxPattern(pattern, t, push, box, soul) {
  const round = dodgeRound;
  const fromRight = box.x + box.width - 10;
  const lightShot = (x, y, angle, speed = 5.5, extra = {}) => push({ type: 'aimed', sprite: 'lightOrb', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 9, ...extra });
  const beam = (orient, pos, extra = {}) => push({ type: 'beam', orient, pos, size: 36, warn: 34, active: 20, life: 80, ...extra });
  const ring = (x, y, extra = {}) => push({ type: 'ring', x, y, radius: 8, speed: 2.6, gap: Math.random() * Math.PI * 2, gapSize: 1.1, life: 400, ...extra });
  const disc = (extra = {}) => push({ type: 'disc', r: 15, warn: 26, life: 420, bounces: 5, blue: Math.random() < 0.25, ...extra });
  const bouncingDisc = () => {
    const corner = Math.floor(Math.random() * 4);
    const x = corner % 2 === 0 ? box.x + 24 : box.x + box.width - 24;
    const y = corner < 2 ? box.y + 24 : box.y + box.height - 24;
    const angle = Math.atan2(soul.y - y, soul.x - x) + (Math.random() - 0.5) * 0.6;
    disc({ x, y, vx: Math.cos(angle) * 4.4, vy: Math.sin(angle) * 4.4 });
  };
  const boomerangDisc = () => disc({ x: box.x + box.width + 20, y: soul.y, vx: -8.5, vy: 0, boomerang: true, pull: 0.12, warn: 22 });
  // the sheriff's bullet rows (with one gap), from one side
  const bulletRow = (fromLeft, rows = 7, speed = 7) => {
    const gap = Math.floor(Math.random() * (rows - 1));
    for (let row = 0; row < rows; row += 1) {
      if (row === gap || row === gap + 1) continue;
      push({ type: 'side', sprite: 'bullet', x: fromLeft ? box.x - 20 : box.x + box.width + 20, y: box.y + 20 + row * ((box.height - 40) / (rows - 1)), vx: fromLeft ? speed : -speed, vy: 0, r: 8 });
    }
  };
  if (pattern === 'lawAndLight') {
    // COWBOY + LIGHT WARRIOR: bullet rows while columns of light close the gaps
    if (t % 44 === 0) bulletRow(false);
    if (t % 66 === 22) beam('v', Math.max(box.x + 20, Math.min(box.x + box.width - 20, soul.x + (Math.random() - 0.5) * 60)));
    if (t % 132 === 88) beam('h', soul.y);
    return true;
  }
  if (pattern === 'revolverPrism') {
    if (t === 1) push({ type: 'revolver', x: box.x + box.width - 48, y: box.y + box.height / 2, angle: Math.PI, cycle: 0, life: lightBoxPhaseFrames - 60 });
    if (t % 16 === 0) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 14 + Math.random() * (box.width - 28), y: box.y - 14, vy: 3.8 + Math.random(), r: 8, warn: 14 });
    if (t % 120 === 60) lightShot(fromRight, box.y + 20, Math.atan2(soul.y - box.y - 20, soul.x - fromRight), 5.5);
    return true;
  }
  if (pattern === 'crossfireRing') {
    if (t % 52 === 0) bulletRow(Math.floor(t / 52) % 2 === 0, 7, 6.6);
    if (t % 115 === 30) ring(box.x + box.width / 2, box.y + box.height / 2, { speed: 2.4 });
    if (t % 115 === 85 && round.items.filter((item) => item.type === 'bouncer').length < 2) {
      push({ type: 'bouncer', sprite: 'star', x: box.x + 30, y: box.y + 30, vx: 4, vy: 3.4, r: 12, life: 260 });
    }
    return true;
  }
  if (pattern === 'cuttingDiscs') {
    if (t % 55 === 0 && round.items.filter((item) => item.type === 'disc' && !item.boomerang).length < 4) bouncingDisc();
    if (t % 90 === 45) boomerangDisc();
    return true;
  }
  if (pattern === 'sunSphere') {
    if (t === 1) push({ type: 'sphere', x: box.x + 30, y: box.y + 34, vx: 1.1, r: 24, rate: 22, warn: 30, life: lightBoxPhaseFrames - 50 });
    if (t % 130 === 100) boomerangDisc();
    return true;
  }
  if (pattern === 'discStorm') {
    if (t % 70 === 0 && round.items.filter((item) => item.type === 'disc' && !item.boomerang).length < 3) bouncingDisc();
    if (t % 60 === 30) beam(Math.random() < 0.5 ? 'v' : 'h', Math.random() < 0.5 ? soul.x : soul.y);
    if (t % 140 === 100) boomerangDisc();
    return true;
  }
  if (pattern === 'chargedTutorial') {
    // slow blue knives straight at Knight: practice the parry
    if (t % 42 === 0) push({ type: 'side', sprite: 'knife', x: box.x + box.width + 20, y: soul.y, vx: -3.6, vy: 0, r: 10, blue: true });
    if (t % 84 === 63) push({ type: 'side', sprite: 'knife', x: box.x - 20, y: box.y + 30 + Math.random() * (box.height - 60), vx: 3.4, vy: 0, r: 10, blue: false });
  } else if (pattern === 'celesteKnives') {
    if (t % 20 === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'knife', x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: box.y + 20 + Math.random() * (box.height - 40), vx: -side * (5.5 + Math.random() * 1.5), vy: 0, r: 10 });
    }
    if (t % 64 === 32) {
      const startY = box.y + 12;
      const base = Math.atan2(soul.y - startY, soul.x - fromRight);
      [-0.22, 0, 0.22].forEach((spread) => push({ type: 'aimed', sprite: 'knife', x: fromRight, y: startY, vx: Math.cos(base + spread) * 5, vy: Math.sin(base + spread) * 5, r: 9 }));
    }
  } else if (pattern === 'setoBooks') {
    if (t % 30 === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'book', x: side < 0 ? box.x - 24 : box.x + box.width + 24, y: box.y + 30 + Math.random() * (box.height - 60), vx: -side * 4.2, vy: 0, r: 13, wave: Math.random() * 6 });
    }
    if (t % 18 === 9) push({ type: 'drop', sprite: 'page', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 16, vy: 3.6 + Math.random(), r: 8, warn: 16, sway: Math.random() * 6 });
  } else if (pattern === 'lightShots') {
    if (t % 26 === 0) {
      const startY = box.y + 20 + Math.random() * (box.height - 40);
      const base = Math.atan2(soul.y - startY, soul.x - fromRight);
      [-0.3, 0, 0.3].forEach((spread) => lightShot(fromRight, startY, base + spread));
    }
  } else if (pattern === 'lightBeams') {
    if (t % 42 === 0) beam('v', Math.max(box.x + 20, Math.min(box.x + box.width - 20, soul.x + (Math.random() - 0.5) * 80)));
    if (t % 84 === 42) beam('h', Math.max(box.y + 20, Math.min(box.y + box.height - 20, soul.y + (Math.random() - 0.5) * 60)));
    if (t % 30 === 15) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 14, vy: 4, r: 9, warn: 16 });
  } else if (pattern === 'radiantRing') {
    if (t % 80 === 0) ring(box.x + box.width / 2, box.y + box.height / 2);
    if (t % 24 === 12) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 14, vy: 4.4, r: 9, warn: 16 });
  } else if (pattern === 'prismRain') {
    if (t % 9 === 0) push({ type: 'drop', sprite: 'lightOrb', x: box.x + 14 + Math.random() * (box.width - 28), y: box.y - 14, vy: 5 + Math.random() * 1.5, r: 8, warn: 12 });
    if (t % 60 === 30) [box.x + 10, fromRight].forEach((cornerX) => lightShot(cornerX, box.y + 10, Math.atan2(soul.y - box.y - 10, soul.x - cornerX), 6));
  } else if (pattern === 'twinBeams') {
    if (t % 50 === 0) {
      // a cross of light on Knight
      beam('v', soul.x, { size: 32 });
      beam('h', soul.y, { size: 32 });
    }
    if (t % 50 === 25) {
      const third = box.width / 3;
      beam('v', box.x + third * (0.5 + Math.floor(Math.random() * 3)), { size: 40, warn: 30 });
    }
  } else if (pattern === 'finalLight') {
    if (t === 1) push({ type: 'sphere', x: box.x + box.width - 30, y: box.y + 34, vx: -0.9, r: 24, rate: 30, warn: 30, life: lightBoxPhaseFrames - 50 });
    if (t % 160 === 120) bouncingDisc();
    if (t % 95 === 0) ring(box.x + box.width / 2, box.y + box.height / 2, { speed: 3, gapSize: 1 });
    if (t % 40 === 20) beam('v', soul.x, { warn: 28 });
    if (t % 22 === 11) lightShot(fromRight, box.y + 20 + Math.random() * (box.height - 40), Math.PI + (Math.random() - 0.5) * 0.5, 6.2);
  } else {
    return false;
  }
  return true;
}

function drawLightBoxItem(item, box, spin) {
  const round = dodgeRound;
  if (drawJesterFinaleItem(item)) return true;
  if (item.type === 'disc') {
    // a spinning saw of light with teeth
    ctx.translate(item.x, item.y);
    ctx.rotate(item.spin || 0);
    ctx.fillStyle = item.blue ? '#4fc3f7' : '#fff59d';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let tooth = 0; tooth < 16; tooth += 1) {
      const angle = (tooth / 16) * Math.PI * 2;
      const radius = tooth % 2 ? item.r * 0.72 : item.r;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, item.r * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = item.blue ? '#0277bd' : '#f9a825';
    ctx.beginPath();
    ctx.arc(0, 0, item.r * 0.16, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (item.type === 'sphere') {
    // the wandering sun: a big sphere with turning rays
    const pulse = 1 + Math.sin(round.frame / 6) * 0.06;
    const halo = ctx.createRadialGradient(item.x, item.y, 4, item.x, item.y, item.r * 2.4);
    halo.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    halo.addColorStop(0.4, 'rgba(255, 241, 118, 0.6)');
    halo.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(item.x - item.r * 2.4, item.y - item.r * 2.4, item.r * 4.8, item.r * 4.8);
    ctx.strokeStyle = 'rgba(255, 249, 196, 0.8)';
    ctx.lineWidth = 3;
    for (let ray = 0; ray < 10; ray += 1) {
      const angle = round.frame * 0.04 + ray * (Math.PI / 5);
      ctx.beginPath();
      ctx.moveTo(item.x + Math.cos(angle) * item.r * 1.1, item.y + Math.sin(angle) * item.r * 1.1);
      ctx.lineTo(item.x + Math.cos(angle) * item.r * 1.7 * pulse, item.y + Math.sin(angle) * item.r * 1.7 * pulse);
      ctx.stroke();
    }
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff176';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * 0.6 * pulse, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (item.type === 'beam') {
    const fade = Math.min(1, item.active / 6);
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 18;
    ctx.fillStyle = `rgba(255, 249, 196, ${0.85 * fade})`;
    if (item.orient === 'v') ctx.fillRect(item.pos - item.size / 2, box.y, item.size, box.height);
    else ctx.fillRect(box.x, item.pos - item.size / 2, box.width, item.size);
    ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
    if (item.orient === 'v') ctx.fillRect(item.pos - item.size / 6, box.y, item.size / 3, box.height);
    else ctx.fillRect(box.x, item.pos - item.size / 6, box.width, item.size / 3);
    ctx.shadowBlur = 0;
    return true;
  }
  if (item.type === 'ring') {
    ctx.strokeStyle = '#fff59d';
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, item.gap + item.gapSize / 2, item.gap - item.gapSize / 2 + Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
    return true;
  }
  if (item.sprite === 'lightOrb') {
    const color = item.blue ? '64, 196, 255' : '255, 241, 118';
    const glow = ctx.createRadialGradient(item.x, item.y, 1, item.x, item.y, item.r + 6);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.45, `rgba(${color}, 0.95)`);
    glow.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r + 6, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (item.sprite === 'knife') {
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.atan2(item.vy || 0, item.vx || -1));
    ctx.fillStyle = item.blue ? '#81d4fa' : '#cfd8dc';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-2, -4);
    ctx.lineTo(-2, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-12, -2, 10, 4);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(-3, -5, 2, 10);
    return true;
  }
  if (item.sprite === 'book') {
    ctx.translate(item.x, item.y);
    const flap = Math.sin(round.frame / 3) * 6;
    ctx.fillStyle = item.blue ? '#4fc3f7' : '#7e57c2';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-13, -8 - flap);
    ctx.lineTo(-13, 8 - flap);
    ctx.closePath();
    ctx.moveTo(0, 0);
    ctx.lineTo(13, -8 - flap);
    ctx.lineTo(13, 8 - flap);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(-1, -6, 2, 12);
    return true;
  }
  if (item.sprite === 'page') {
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.sin(round.frame / 5 + (item.sway || 0)) * 0.5);
    ctx.fillStyle = item.blue ? '#b3e5fc' : '#fff8e1';
    ctx.fillRect(-7, -9, 14, 18);
    ctx.fillStyle = item.blue ? '#0277bd' : '#8d6e63';
    ctx.fillRect(-4, -5, 8, 1);
    ctx.fillRect(-4, -1, 8, 1);
    ctx.fillRect(-4, 3, 6, 1);
    return true;
  }
  if (item.blue && item.sprite) {
    // any other blue attack: drawn normally, with a blue ring around it
    ctx.strokeStyle = '#40c4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(item.x, item.y, (item.r || 10) + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  return false;
}

// the helpers he brought, at the side of the box (confused at first)
function drawLightBoxHelpers(round) {
  const config = round.config;
  if (!round.helperActors) {
    round.helperActors = config.helpers.map((helper) => {
      const actor = new Fighter({ x: helper.x, y: 0, color: helper.color, attacksToTheRight: true });
      if (helper.variant === 'cowboy') {
        actor.setCharacterType('cowboy');
        actor.setColor(helper.color);
        actor.sheriffBadge = Boolean(helper.sheriff);
      } else {
        actor.setCharacterType('normal', helper.variant);
      }
      if (helper.powered) actor.mochiPowered = true;
      if (helper.variant === 'chefBoss') actor.chefCalm = true;
      return { actor, helper };
    });
  }
  round.helperActors.forEach(({ actor, helper }, index) => {
    const bob = round.stage === 'phase' ? Math.abs(Math.sin(round.frame / 6 + index)) * 6 : 0;
    actor.position = { x: helper.x, y: ground - actor.height - bob };
    actor.attacksToTheRight = true;
    // (the cowboy's punch box would float in the air: he only bobs)
    actor.isAttacking = helper.variant !== 'cowboy' && round.stage === 'phase' && Math.floor((round.frame + index * 10) / 14) % 3 === 0;
    actor.draw();
    actor.isAttacking = false;
    if (helper.confused && round.stage === 'talk') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', helper.x + actor.width / 2 + Math.sin(round.age / 10 + index) * 4, actor.position.y - 14);
      ctx.textAlign = 'left';
    }
  });
}

function drawLightBoxTalk(round) {
  const line = round.config.talk[round.talkIndex];
  if (!line) return;
  const names = { lightWarrior: 'LIGHT WARRIOR', knight: 'KNIGHT', celeste: 'CELESTE', seto: 'SETO', mochi: 'MOCHI', chef: 'CHEF', cowboy: 'SHERIFF COWBOY', friend: '? ? ?', scammer: 'SCAMMER' };
  const accents = { lightWarrior: '#fff59d', knight: '#90caf9', celeste: '#4fc3f7', seto: '#66bb6a', mochi: '#ef5350', chef: '#ffcc80', cowboy: '#ff7043', friend: '#ff4fa3', scammer: '#fdd835' };
  const accent = accents[line.speaker] || '#ffffff';
  const shown = line.text.slice(0, Math.floor(round.talkFrame * 1.6));
  ctx.save();
  // (over the empty box: the health bars cover the top of the screen)
  const top = 250;
  ctx.fillStyle = 'rgba(8, 6, 12, 0.94)';
  ctx.fillRect(112, top, 800, 92);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(112, top, 800, 92);
  ctx.fillStyle = accent;
  ctx.fillRect(130, top - 12, 190, 26);
  ctx.fillStyle = '#111';
  ctx.font = '900 15px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(names[line.speaker] || line.speaker.toUpperCase(), 225, top + 6);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 18px Arial, sans-serif';
  // simple word wrap
  const words = shown.split(' ');
  let row = '';
  let rowY = top + 40;
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
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '700 12px Courier New, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER: seguir', 900, top + 86);
  ctx.restore();
}

// ---------- the finale of the last BOX ATTACK: a giant disc of light ----------
function startLightFinale(round) {
  const box = round.boxTarget;
  round.stage = 'finale';
  round.items = [];
  // it comes from Light Warrior's side
  round.finale = { frame: 0, timer: 0, state: 'come', x: box.x + box.width + 40, y: box.y + 60, r: 0, spin: 0, wave: 0, flash: 0 };
  dodgeRoundCaption('PARRYEALO!', '#40c4ff');
  playSound('judgeFinalStart');
}

// returns true when the round is over (the climb starts)
function updateLightFinale(round) {
  const finale = round.finale;
  finale.frame += 1;
  if (finale.flash > 0) finale.flash -= 1;
  const scale = round.dash.charging ? lightBoxSlowScale : 1;
  if (finale.state === 'come') {
    finale.r = Math.min(66, finale.r + 2 * scale);
    finale.spin += 0.22 * scale;
    if (finale.frame > 50) {
      // it slowly hunts Knight (faster and faster): the only way out is the parry
      const center = getDodgeSoulCenter();
      const dx = center.x - finale.x;
      const dy = center.y - finale.y;
      const distance = Math.hypot(dx, dy) || 1;
      const speed = (1.1 + Math.min(3.2, (finale.frame - 50) * 0.006)) * scale;
      finale.x += (dx / distance) * speed;
      finale.y += (dy / distance) * speed;
      if (distance < finale.r + 8) {
        const target = round.target;
        if (round.dash.timer > 0) {
          finale.state = 'parried';
          round.parries += 1;
          round.shake = 16;
          finale.flash = 30;
          for (let shard = 0; shard < 40; shard += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speedOut = 3 + Math.random() * 7;
            round.sparks.push({ x: finale.x, y: finale.y, vx: Math.cos(angle) * speedOut, vy: Math.sin(angle) * speedOut, life: 30 });
          }
          const before = target.health;
          target.health = Math.min(target.maxHealth, target.health + target.maxHealth * lightBoxHealRatio);
          updateHealthBars();
          const healed = Math.round(target.health - before);
          dodgeRoundCaption(healed > 0 ? `PARRY PERFECTO!  +${healed} VIDA` : 'PARRY PERFECTO!', '#69f0ae');
          playSound('judgeParry');
          playSound('achievement');
        } else {
          finale.state = 'failed';
          round.shake = 22;
          target.health = Math.min(target.health, 1);
          round.invulnerable = 60;
          updateHealthBars();
          dodgeRoundCaption('...TE DEJO CON 1 DE VIDA!', '#ff5252');
          playSound('judgeFinalHurt');
        }
        round.dash.charging = false;
      }
    }
  } else if (finale.state === 'parried' || finale.state === 'failed') {
    finale.timer += 1;
    if (finale.timer > 50) {
      // the shockwave
      finale.state = 'wave';
      finale.wave = 0;
      round.shake = 14;
      playSound('judgeOverdrive');
    }
  } else if (finale.state === 'wave') {
    finale.wave += 20;
    if (finale.wave > 1400) {
      finishDodgeRound();
      startFarolClimb();
      return true;
    }
  }
  return false;
}

function drawLightFinale(round) {
  const finale = round.finale;
  ctx.save();
  if (finale.state === 'come') {
    // the giant blue disc of light
    const glow = ctx.createRadialGradient(finale.x, finale.y, 4, finale.x, finale.y, finale.r * 1.8);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    glow.addColorStop(0.5, 'rgba(64, 196, 255, 0.55)');
    glow.addColorStop(1, 'rgba(64, 196, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(finale.x - finale.r * 1.8, finale.y - finale.r * 1.8, finale.r * 3.6, finale.r * 3.6);
    ctx.translate(finale.x, finale.y);
    ctx.rotate(finale.spin);
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    for (let tooth = 0; tooth < 28; tooth += 1) {
      const angle = (tooth / 28) * Math.PI * 2;
      const radius = tooth % 2 ? finale.r * 0.8 : finale.r;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e1f5fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, finale.r * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0288d1';
    ctx.lineWidth = 4;
    for (let spoke = 0; spoke < 6; spoke += 1) {
      const angle = spoke * (Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * finale.r * 0.45, Math.sin(angle) * finale.r * 0.45);
      ctx.lineTo(Math.cos(angle) * finale.r * 0.72, Math.sin(angle) * finale.r * 0.72);
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (finale.frame > 30) {
      ctx.fillStyle = `rgba(64, 196, 255, ${0.6 + Math.sin(finale.frame / 4) * 0.4})`;
      ctx.font = '900 16px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MANTENE Q, APUNTA AL DISCO Y SOLTA!', canvas.width / 2, round.box.y + round.box.height + 64);
    }
  } else if (finale.state === 'failed' && finale.timer < 20) {
    ctx.fillStyle = `rgba(255, 23, 68, ${0.45 * (1 - finale.timer / 20)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (finale.state === 'wave') {
    // the shockwave sweeps the whole screen
    const centerX = round.box.x + round.box.width / 2;
    const centerY = round.box.y + round.box.height / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.85, finale.wave / 1400)})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, finale.wave, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff59d';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(centerX, centerY, finale.wave, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (finale.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${finale.flash / 34})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

// ---------- the climb: a bridge of discs up to the top of the Gran Farol ----------
function buildFarolClimbDiscs() {
  const discs = [];
  let x = 470;
  let y = ground - 100;
  let direction = -1;
  for (let index = 0; index < 22; index += 1) {
    const wobble = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1;
    if (index > 0) {
      if (index % 3 === 0) direction *= -1;
      x += direction * (115 + wobble * 50);
      if (x < 90) {
        x = 180 - x;
        direction = 1;
      }
      if (x > 720) {
        x = 1440 - x;
        direction = -1;
      }
    }
    if (index === 20) x = 470;
    if (index === 21) x = 600;
    const kind = index < 2 || index >= 20 ? 'solid' : index % 5 === 3 ? 'moving' : index % 4 === 1 ? 'crumble' : 'solid';
    discs.push({ x, baseX: x, y, w: 104, kind, seed: index, crumble: 0, gone: 0, dx: 0 });
    y -= 102 + wobble * 12;
  }
  return discs;
}

function startFarolClimb() {
  const discs = buildFarolClimbDiscs();
  const topY = discs[discs.length - 1].y - 104;
  Object.assign(farolClimb, {
    active: true,
    stage: 'form',
    frame: 0,
    stageFrame: 0,
    discs,
    topY,
    top: { x1: 690, x2: 1010, y: topY, kind: 'top' },
    floor: { x1: 0, x2: canvas.width, y: ground, kind: 'floor' },
    cam: 0,
    knight: { x: 420, y: ground, vx: 0, vy: 0, kb: 0, grounded: true, facing: 1, invuln: 0, on: null, safe: null, jumpHeld: false },
    lw: { x: 760, y: ground - 260 },
    lwSide: 1,
    shots: [],
    beams: [],
    taunt: null,
    knightBubble: null,
    flash: 40,
    hits: 0,
  });
  robotShots = [];
  lightShots = [];
  resetKeys();
  player2.lightWarriorSpeedTimer = 0;
  playSound('judgeFinalStart');
}

function getFarolClimbPlatforms() {
  const climb = farolClimb;
  const platforms = [climb.floor, climb.top];
  climb.discs.forEach((disc) => {
    if (disc.gone > 0) return;
    platforms.push({ x1: disc.x - disc.w / 2, x2: disc.x + disc.w / 2, y: disc.y, kind: disc.kind, disc });
  });
  return platforms;
}

function hurtFarolClimbKnight(direction, ratio = farolClimbHitRatio) {
  const climb = farolClimb;
  const knight = climb.knight;
  if (knight.invuln > 0) return;
  player1.health = Math.max(1, player1.health - player1.maxHealth * ratio);
  knight.invuln = 50;
  // no knockback: a hit hurts, but it never throws Knight off his disc
  knight.kb = 0;
  climb.hits += 1;
  playSound('judgeFinalHurt');
  updateHealthBars();
}

function updateFarolClimb() {
  const climb = farolClimb;
  const knight = climb.knight;
  climb.frame += 1;
  climb.stageFrame += 1;
  if (climb.flash > 0) climb.flash -= 1;
  if (knight.invuln > 0) knight.invuln -= 1;
  const time = climb.frame;

  // the discs: forming, moving, crumbling
  climb.discs.forEach((disc, index) => {
    disc.form = climb.stage === 'form' ? Math.max(0, Math.min(1, (climb.stageFrame - index * 4) / 34)) : 1;
    if (disc.kind === 'moving') {
      const nextX = Math.max(70, Math.min(760, disc.baseX + Math.sin(time * 0.025 + disc.seed) * 62));
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
        if (knight.on && knight.on.disc === disc) {
          knight.on = null;
          knight.grounded = false;
        }
      }
    }
  });

  if (climb.stage === 'form') {
    if (climb.stageFrame === 1) climb.caption = { text: 'LOS DISCOS FORMAN UN PUENTE HASTA EL FAROL!', life: 150 };
    if (climb.stageFrame > 22 * 4 + 40) {
      climb.stage = 'pan';
      climb.stageFrame = 0;
    }
  } else if (climb.stage === 'pan') {
    // a look up to the top... and back down
    const up = Math.min(1, climb.stageFrame / 90);
    const down = Math.max(0, (climb.stageFrame - 110) / 70);
    const ease = (value) => value * value * (3 - 2 * value);
    climb.cam = (climb.topY - 140) * ease(up) * (1 - ease(Math.min(1, down)));
    if (climb.stageFrame > 180) {
      climb.stage = 'climb';
      climb.stageFrame = 0;
      climb.cam = 0;
      climb.knightBubble = { text: 'Ahora o nunca!', life: 90 };
      climb.caption = { text: 'A / D moverse  -  W saltar  -  llega a la cima!', life: 160 };
    }
  } else if (climb.stage === 'climb') {
    updateFarolClimbKnight();
    updateFarolClimbLightWarrior();
  } else if (climb.stage === 'top') {
    knight.vx = 0;
    if (climb.stageFrame === 1) {
      climb.caption = { text: 'LA CIMA DEL GRAN FAROL!', life: 120 };
      playSound('achievement');
    }
    if (climb.stageFrame > 70) {
      climb.active = false;
      startKnightFarolTop();
      return;
    }
  }
  if (climb.caption) climb.caption.life -= 1;
  if (climb.knightBubble) climb.knightBubble.life -= 1;
  if (climb.taunt) climb.taunt.life -= 1;

  // the camera follows Knight up
  if (climb.stage === 'climb' || climb.stage === 'top') {
    const target = Math.max(climb.topY - 150, Math.min(0, knight.y - 330));
    climb.cam += (target - climb.cam) * 0.1;
  }
  drawFarolClimb();
}

function updateFarolClimbKnight() {
  const climb = farolClimb;
  const knight = climb.knight;
  const move = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  if (move) knight.facing = move;
  knight.kb *= 0.88;
  knight.vx = move * farolClimbSpeed + knight.kb;
  const jumpKey = keys.w || keys.ArrowUp;
  if (jumpKey && !knight.jumpHeld && knight.grounded) {
    knight.vy = farolClimbJump;
    knight.grounded = false;
    knight.on = null;
    playSound('cutsceneStep');
  }
  knight.jumpHeld = jumpKey;
  if (knight.on && knight.on.disc && knight.on.disc.kind === 'moving') knight.x += knight.on.disc.dx;
  knight.vy = Math.min(15, knight.vy + farolClimbGravity);
  const previousFeet = knight.y;
  knight.x = Math.max(0, Math.min(canvas.width - player1.width, knight.x + knight.vx));
  knight.y += knight.vy;
  knight.grounded = false;
  if (knight.vy >= 0) {
    const centerX = knight.x + player1.width / 2;
    for (const platform of getFarolClimbPlatforms()) {
      if (previousFeet <= platform.y + 1 && knight.y >= platform.y && centerX > platform.x1 - 10 && centerX < platform.x2 + 10) {
        knight.y = platform.y;
        knight.vy = 0;
        knight.grounded = true;
        knight.on = platform;
        if (platform.kind === 'crumble' && platform.disc.crumble === 0) platform.disc.crumble = 1;
        if (platform.kind !== 'crumble') knight.safe = platform;
        break;
      }
    }
  }
  if (knight.grounded && knight.on && knight.on.kind === 'top') {
    climb.stage = 'top';
    climb.stageFrame = 0;
    return;
  }
  // fell off the screen: back to the last safe disc
  if (knight.y - climb.cam > canvas.height + 80) {
    const safe = knight.safe || climb.floor;
    if (safe.disc) {
      safe.disc.gone = 0;
      safe.disc.crumble = 0;
    }
    knight.x = (safe.disc ? safe.disc.x : 420) - player1.width / 2;
    knight.y = safe.disc ? safe.disc.y : ground;
    knight.vy = 0;
    knight.kb = 0;
    knight.invuln = 0;
    hurtFarolClimbKnight(0, farolClimbFallRatio);
    knight.vy = 0;
    knight.kb = 0;
  }
}

// Light Warrior flies around Knight trying to knock him down
function updateFarolClimbLightWarrior() {
  const climb = farolClimb;
  const knight = climb.knight;
  const lw = climb.lw;
  const time = climb.stageFrame;
  const progress = Math.max(0, Math.min(1, (ground - knight.y) / (ground - climb.topY)));
  if (time % 300 === 0 || (lw.x < 80 && climb.lwSide < 0) || (lw.x > canvas.width - 140 && climb.lwSide > 0)) climb.lwSide *= -1;
  const targetX = Math.max(40, Math.min(canvas.width - 100, knight.x + climb.lwSide * 240));
  lw.x += (targetX - lw.x) * 0.04;
  lw.y += (knight.y - 250 + Math.sin(time / 30) * 20 - lw.y) * 0.05;
  const lwCenter = { x: lw.x + player2.width / 2, y: lw.y - player2.height / 2 };
  const knightCenter = { x: knight.x + player1.width / 2, y: knight.y - player1.height / 2 };
  // a fan of light orbs
  const orbRate = Math.round(86 - progress * 30);
  if (time > 60 && time % orbRate === 0) {
    const aim = Math.atan2(knightCenter.y - lwCenter.y, knightCenter.x - lwCenter.x);
    [-0.25, 0, 0.25].forEach((spread) => climb.shots.push({ x: lwCenter.x, y: lwCenter.y, vx: Math.cos(aim + spread) * 4.6, vy: Math.sin(aim + spread) * 4.6, r: 9, life: 200, kind: 'orb' }));
    playSound('judgeLight');
  }
  // a column of light on Knight
  if (time > 120 && time % 230 === 0) climb.beams.push({ x: knightCenter.x, warn: 45, active: 18, w: 46 });
  // a disc sliding across at Knight's height
  if (time > 200 && time % 320 === 160) {
    const fromLeft = Math.random() < 0.5;
    climb.shots.push({ x: fromLeft ? -40 : canvas.width + 40, y: knightCenter.y - 10, vx: fromLeft ? 7 : -7, vy: 0, r: 15, life: 260, kind: 'disc', warn: 35 });
  }
  if (time % 320 === 40) climb.taunt = { text: farolClimbTaunts[Math.floor(time / 320) % farolClimbTaunts.length], life: 110 };

  const touchesKnight = (x, y, r) => x + r > knight.x + 6 && x - r < knight.x + player1.width - 6 && y + r > knight.y - player1.height + 6 && y - r < knight.y - 4;
  climb.shots.forEach((shot) => {
    shot.life -= 1;
    if (shot.warn > 0) {
      shot.warn -= 1;
      return;
    }
    shot.x += shot.vx;
    shot.y += shot.vy;
    shot.spin = (shot.spin || 0) + 0.4;
    if (touchesKnight(shot.x, shot.y, shot.r)) {
      hurtFarolClimbKnight(shot.vx >= 0 ? 1 : -1);
      shot.life = 0;
    }
  });
  climb.shots = climb.shots.filter((shot) => shot.life > 0 && shot.x > -80 && shot.x < canvas.width + 80);
  climb.beams.forEach((beam) => {
    if (beam.warn > 0) {
      beam.warn -= 1;
      return;
    }
    beam.active -= 1;
    if (Math.abs(knightCenter.x - beam.x) < beam.w / 2 + 14) hurtFarolClimbKnight(knightCenter.x < beam.x ? -1 : 1);
  });
  climb.beams = climb.beams.filter((beam) => beam.warn > 0 || beam.active > 0);
}

function drawFarolClimb() {
  const climb = farolClimb;
  const cam = climb.cam;
  const knight = climb.knight;
  drawFarolClimbBackdrop(climb);
  // the discs
  climb.discs.forEach((disc, index) => {
    if (disc.gone > 0 || disc.form <= 0) return;
    const fromX = canvas.width / 2;
    const fromY = ground - 60;
    const form = disc.form;
    const x = fromX + (disc.x - fromX) * form;
    const y = fromY + (disc.y - fromY) * form - Math.sin(form * Math.PI) * 60;
    const shake = disc.crumble > 0 ? (Math.random() - 0.5) * 4 : 0;
    drawFarolDisc(x + shake, y - cam, disc, index);
  });
  // the beams
  climb.beams.forEach((beam) => {
    ctx.save();
    if (beam.warn > 0) {
      ctx.strokeStyle = `rgba(255, 82, 82, ${0.4 + Math.sin(climb.frame / 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(beam.x - beam.w / 2, 0, beam.w, canvas.height);
      ctx.setLineDash([]);
    } else {
      ctx.shadowColor = '#fff59d';
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(255, 249, 196, 0.85)';
      ctx.fillRect(beam.x - beam.w / 2, 0, beam.w, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(beam.x - beam.w / 6, 0, beam.w / 3, canvas.height);
    }
    ctx.restore();
  });
  // Light Warrior, flying
  if (climb.stage !== 'top') {
    const lw = climb.lw;
    player2.position = { x: lw.x, y: lw.y - cam - player2.height };
    player2.attacksToTheRight = knight.x > lw.x;
    player2.isAttacking = false;
    player2.velocity.y = 0;
    const aura = ctx.createRadialGradient(lw.x + player2.width / 2, lw.y - cam - player2.height / 2, 6, lw.x + player2.width / 2, lw.y - cam - player2.height / 2, 90);
    aura.addColorStop(0, 'rgba(255, 249, 196, 0.45)');
    aura.addColorStop(1, 'rgba(255, 249, 196, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(lw.x - 70, lw.y - cam - player2.height - 60, player2.width + 140, player2.height + 120);
    player2.draw();
    if (climb.taunt && climb.taunt.life > 0) drawFarolBubble(lw.x + player2.width / 2, lw.y - cam - player2.height - 16, climb.taunt.text, '#fff59d');
  }
  // the shots
  climb.shots.forEach((shot) => {
    const y = shot.y - cam;
    ctx.save();
    if (shot.warn > 0) {
      ctx.fillStyle = `rgba(255, 82, 82, ${0.35 + Math.sin(climb.frame / 2) * 0.25})`;
      ctx.fillRect(0, y - 3, canvas.width, 6);
    } else if (shot.kind === 'disc') {
      ctx.translate(shot.x, y);
      ctx.rotate(shot.spin || 0);
      ctx.fillStyle = '#fff59d';
      ctx.beginPath();
      for (let tooth = 0; tooth < 16; tooth += 1) {
        const angle = (tooth / 16) * Math.PI * 2;
        const radius = tooth % 2 ? shot.r * 0.72 : shot.r;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, shot.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const glow = ctx.createRadialGradient(shot.x, y, 1, shot.x, y, shot.r + 6);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.45, 'rgba(255, 241, 118, 0.95)');
      glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(shot.x, y, shot.r + 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  // Knight
  const knightScreenY = knight.y - cam;
  if (!(knight.invuln > 0 && Math.floor(knight.invuln / 4) % 2 === 0)) {
    player1.position = { x: knight.x, y: knightScreenY - player1.height };
    player1.attacksToTheRight = knight.facing > 0;
    player1.isAttacking = false;
    player1.velocity.y = knight.grounded ? 0 : knight.vy;
    player1.draw();
  }
  if (climb.knightBubble && climb.knightBubble.life > 0) drawFarolBubble(knight.x + player1.width / 2, knightScreenY - player1.height - 16, climb.knightBubble.text, '#90caf9');
  // how high: a meter on the right
  const progress = Math.max(0, Math.min(1, (ground - knight.y) / (ground - climb.topY)));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(canvas.width - 34, 120, 14, 300);
  ctx.fillStyle = '#fff59d';
  ctx.fillRect(canvas.width - 34, 120 + 300 * (1 - progress), 14, 300 * progress);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 34, 120, 14, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FAROL', canvas.width - 27, 112);
  ctx.textAlign = 'left';
  if (climb.caption && climb.caption.life > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, climb.caption.life / 20);
    ctx.fillStyle = '#fff59d';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.font = '900 22px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText(climb.caption.text, canvas.width / 2, 180);
    ctx.fillText(climb.caption.text, canvas.width / 2, 180);
    ctx.restore();
  }
  if (climb.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${climb.flash / 40})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawFarolDisc(x, y, disc, index) {
  const time = performance.now() / 1000;
  const colors = { solid: ['#fff59d', '#fbc02d'], moving: ['#81d4fa', '#0288d1'], crumble: ['#ffcc80', '#e65100'] };
  const [top, side] = colors[disc.kind] || colors.solid;
  const fade = disc.crumble > 0 ? Math.max(0.3, 1 - disc.crumble / 60) : 1;
  ctx.save();
  ctx.globalAlpha = fade;
  const glow = ctx.createRadialGradient(x, y, 4, x, y, disc.w * 0.8);
  glow.addColorStop(0, 'rgba(255, 249, 196, 0.35)');
  glow.addColorStop(1, 'rgba(255, 249, 196, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - disc.w * 0.8, y - disc.w * 0.5, disc.w * 1.6, disc.w);
  ctx.fillStyle = side;
  ctx.beginPath();
  ctx.ellipse(x, y + 6, disc.w / 2, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.ellipse(x, y, disc.w / 2, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // the runes turning on top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (let rune = 0; rune < 5; rune += 1) {
    const angle = time * 1.5 + index + rune * ((Math.PI * 2) / 5);
    ctx.fillRect(x + Math.cos(angle) * disc.w * 0.36 - 2, y + Math.sin(angle) * 5 - 1, 4, 3);
  }
  if (disc.kind === 'crumble' && disc.crumble > 0) {
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 3);
    ctx.lineTo(x - 4, y + 4);
    ctx.lineTo(x + 14, y - 2);
    ctx.stroke();
  }
  if (disc.kind === 'moving') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(x - disc.w / 2 - 12, y - 1, 6, 2);
    ctx.fillRect(x + disc.w / 2 + 6, y - 1, 6, 2);
  }
  ctx.restore();
}

function drawFarolBubble(x, y, text, color) {
  ctx.save();
  ctx.font = '900 14px Courier New, monospace';
  const width = ctx.measureText(text).width + 18;
  const left = Math.max(6, Math.min(canvas.width - width - 6, x - width / 2));
  ctx.fillStyle = 'rgba(8, 6, 12, 0.9)';
  ctx.fillRect(left, y - 26, width, 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(left, y - 26, width, 24);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, left + width / 2, y - 9);
  ctx.restore();
}

// ---------- the final round: OMEGA LIGHT WARRIOR's flying kicks ----------
function startOmegaKickFight() {
  Object.assign(omegaKickFight, {
    active: true,
    won: false,
    stage: 'rise',
    frame: 0,
    kick: 0,
    side: 1,
    hover: null,
    lock: null,
    trail: [],
    waves: [],
    dust: [],
    hit: false,
    caption: { text: 'OMEGA LIGHT WARRIOR CARGA SU PATADA VOLADORA!', life: 150 },
    spiritOrbs: null,
    clash: null,
  });
  lightClashMusicFade = 1;
  player2.scriptedFlight = true;
  player2.velocity.x = 0;
  player2.velocity.y = 0;
}

function getOmegaHoverPoint(side) {
  return { x: side > 0 ? canvas.width - 150 : 90, y: 110 };
}

function setOmegaKickStage(stage) {
  omegaKickFight.stage = stage;
  omegaKickFight.frame = 0;
}

function updateOmegaKickFight() {
  const fight = omegaKickFight;
  if (!fight.active || !gameStarted || gameOver || arcadeCutscene.active) return;
  const lw = player2;
  fight.frame += 1;
  if (fight.caption) fight.caption.life -= 1;
  fight.waves.forEach((wave) => (wave.life -= 1));
  fight.waves = fight.waves.filter((wave) => wave.life > 0);
  fight.dust.forEach((mote) => {
    mote.x += mote.vx;
    mote.y += mote.vy;
    mote.vy += 0.2;
    mote.life -= 1;
  });
  fight.dust = fight.dust.filter((mote) => mote.life > 0);
  fight.trail.forEach((ghost) => (ghost.life -= 1));
  fight.trail = fight.trail.filter((ghost) => ghost.life > 0);
  const knightCenter = { x: getFighterCenterX(player1), y: player1.position.y + player1.height / 2 };
  const moveTo = (point, ease) => {
    lw.position.x += (point.x - lw.position.x) * ease;
    lw.position.y += (point.y - lw.position.y) * ease;
  };
  lw.isAttacking = false;
  lw.attacksToTheRight = knightCenter.x > getFighterCenterX(lw);

  if (fight.stage === 'rise') {
    // up to his first spot in the sky
    lw.scriptedFlight = true;
    fight.side = getFighterCenterX(lw) > canvas.width / 2 ? 1 : -1;
    moveTo(getOmegaHoverPoint(fight.side), 0.08);
    if (fight.frame > 45) setOmegaKickStage(fight.kick === omegaKickTotal - 1 ? 'clashCharge' : 'charge');
  } else if (fight.stage === 'charge' || fight.stage === 'clashCharge') {
    const clash = fight.stage === 'clashCharge';
    const chargeFrames = clash ? 130 : omegaKickChargeFrames;
    const hover = getOmegaHoverPoint(fight.side);
    moveTo({ x: hover.x, y: hover.y + Math.sin(fight.frame / 6) * 4 }, 0.15);
    if (fight.frame === 1) {
      fight.caption = clash
        ? { text: 'LA ULTIMA PATADA!... KNIGHT VA A SU ENCUENTRO!', life: 140 }
        : fight.kick === 0
          ? { text: 'PATADA VOLADORA! GOLPEA (S) JUSTO CUANDO LLEGUE PARA HACERLE PARRY', life: 150 }
          : { text: `PATADA VOLADORA  ${fight.kick + 1} / ${omegaKickTotal}`, life: 90 };
    }
    if (fight.frame % 10 === 0) playSound('omegaKickCharge', { pitch: fight.frame / chargeFrames });
    // it locks on where Knight is standing (moving away in time saves you)
    if (fight.frame === chargeFrames - omegaKickLockFrames || !fight.lock) fight.lock = { x: knightCenter.x, y: ground - lw.height / 2 };
    if (fight.frame < chargeFrames - omegaKickLockFrames) fight.lock = { x: knightCenter.x, y: ground - lw.height / 2 };
    if (clash) player1.knightGlow = Math.min(1, fight.frame / 60);
    if (fight.frame >= chargeFrames) {
      playSound('omegaKickLaunch');
      fight.hit = false;
      setOmegaKickStage(clash ? 'clashDive' : 'dive');
    }
  } else if (fight.stage === 'dive') {
    // down like a meteor, on the locked spot
    const center = { x: getFighterCenterX(lw), y: lw.position.y + lw.height / 2 };
    const dx = fight.lock.x - center.x;
    const dy = fight.lock.y - center.y;
    const distance = Math.hypot(dx, dy) || 1;
    const step = Math.min(distance, omegaKickSpeed);
    lw.position.x += (dx / distance) * step;
    lw.position.y += (dy / distance) * step;
    fight.trail.push({ x: lw.position.x, y: lw.position.y, life: 14 });
    const kickBox = { x: lw.position.x - 20, y: lw.position.y, width: lw.width + 40, height: lw.height };
    const parryBox = { x: kickBox.x - omegaKickParryReach, y: kickBox.y - omegaKickParryReach, width: kickBox.width + omegaKickParryReach * 2, height: kickBox.height + omegaKickParryReach * 2 };
    const swingFresh = player1.isAttacking && (player1.attackTimer || 0) <= omegaKickParryWindow;
    if (!fight.hit && swingFresh && rectangularCollision({ rectangle1: parryBox, rectangle2: player1 })) {
      // PARRY: the swing met the kick at the exact moment
      fight.hit = true;
      fight.kick += 1;
      fight.parries = (fight.parries || 0) + 1;
      fight.bounce = { from: { x: lw.position.x, y: lw.position.y }, dir: dx >= 0 ? -1 : 1 };
      fight.flash = 12;
      for (let spark = 0; spark < 30; spark += 1) {
        const angle = Math.random() * Math.PI * 2;
        fight.dust.push({ x: getFighterCenterX(player1), y: player1.position.y + 40, vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7 - 2, life: 30, parry: true });
      }
      applyDamage(player1, lw, omegaKickParryDamage, { isSpecial: true });
      fight.caption = { text: 'PARRY! OMEGA LIGHT WARRIOR QUEDA ATURDIDO!', life: 120 };
      playSound('judgeParry');
      playSound('omegaKickImpact');
      setOmegaKickStage('stunned');
      return;
    }
    if (!fight.hit && rectangularCollision({ rectangle1: kickBox, rectangle2: player1 })) {
      fight.hit = true;
      applyDamage(lw, player1, omegaKickDamage, { isSpecial: true, damageType: 'omegaLightWarriorFlight' });
      player1.velocity.x = dx >= 0 ? 12 : -12;
      player1.velocity.y = -9;
    }
    if (distance <= omegaKickSpeed) {
      lw.position.y = ground - lw.height;
      playSound('omegaKickImpact');
      fight.waves.push({ x: getFighterCenterX(lw), life: 40 });
      for (let mote = 0; mote < 26; mote += 1) {
        fight.dust.push({ x: getFighterCenterX(lw), y: ground, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 7, life: 30 + Math.random() * 20 });
      }
      fight.kick += 1;
      setOmegaKickStage('impact');
    }
  } else if (fight.stage === 'stunned') {
    const bounce = fight.bounce;
    if (fight.frame <= 24) {
      const t = fight.frame / 24;
      lw.position.x = Math.max(0, Math.min(canvas.width - lw.width, bounce.from.x + bounce.dir * 170 * t));
      lw.position.y = bounce.from.y - Math.sin(t * Math.PI) * 90 + (ground - lw.height - bounce.from.y) * t;
    } else {
      lw.position.y = ground - lw.height;
    }
    if (fight.frame === 25) {
      fight.waves.push({ x: getFighterCenterX(lw), life: 30 });
      playSound('omegaKickImpact');
    }
    if (fight.frame > omegaKickStunFrames) {
      fight.side *= -1;
      if (fight.kick === omegaKickBreakAfter && !fight.spiritOrbs) setOmegaKickStage('spiritsOut');
      else setOmegaKickStage('rise');
    }
  } else if (fight.stage === 'impact') {
    // a moment on the ground: the chance to hit him
    lw.position.y = ground - lw.height;
    if (fight.frame > 45) {
      fight.side *= -1;
      if (fight.kick === omegaKickBreakAfter && !fight.spiritOrbs) setOmegaKickStage('spiritsOut');
      else setOmegaKickStage('rise');
    }
  } else if (fight.stage === 'spiritsOut') {
    // he stops... and sends his spirits to Knight
    lw.position.y = ground - lw.height;
    if (fight.frame === 1) {
      fight.caption = { text: 'LIGHT WARRIOR: ESPIRITUS... VAYAN CON EL. QUE SEA UNA PELEA JUSTA!', life: 170 };
      fight.spiritOrbs = [0, 1, 2].map((index) => ({ x: getFighterCenterX(lw), y: lw.position.y + 20, start: 20 + index * 18, done: false, color: knightSpiritColors[index] }));
      playSound('judgeFinalStart');
    }
    fight.spiritOrbs.forEach((orb) => {
      if (orb.done || fight.frame < orb.start) return;
      orb.x += (knightCenter.x - orb.x) * 0.08;
      orb.y += (knightCenter.y - 40 - orb.y) * 0.08 + Math.sin((fight.frame - orb.start) / 5) * 1.5;
      if (Math.hypot(orb.x - knightCenter.x, orb.y - knightCenter.y + 40) < 12) {
        orb.done = true;
        player2.spiritCount = Math.max(0, player2.spiritCount - 1);
        player1.spiritCount += 1;
        playSound('judgeLight');
      }
    });
    if (fight.spiritOrbs.every((orb) => orb.done) && fight.frame > 90) {
      // the three new spirits: more health, all of it back
      player1.setMaxHealth(player1.maxHealth + spiritKnightHealthBonus * 3);
      player1.health = player1.maxHealth;
      updateHealthBars();
      fight.healFx = 60;
      fight.caption = { text: 'KNIGHT TIENE LOS 6 ESPIRITUS: VIDA COMPLETA, PEGA MAS FUERTE Y RESISTE MAS!', life: 170 };
      playSound('achievement');
      lw.scriptedFlight = false;
      setOmegaKickStage('brawl');
    }
  } else if (fight.stage === 'brawl') {
    // a short fight on the ground
    if (fight.frame >= omegaKickBreakFrames) {
      fight.caption = { text: 'OMEGA LIGHT WARRIOR VUELVE AL CIELO!', life: 110 };
      lw.velocity.x = 0;
      lw.velocity.y = 0;
      lw.isAttacking = false;
      setOmegaKickStage('rise');
    }
  } else if (fight.stage === 'clashDive') {
    // both fly at each other... and meet in the middle
    const meet = { x: canvas.width / 2, y: ground - 150 };
    moveTo({ x: meet.x + 10, y: meet.y - lw.height / 2 }, 0.16);
    player1.position.x += (meet.x - 70 - player1.position.x) * 0.16;
    player1.position.y += (meet.y - player1.height / 2 - player1.position.y) * 0.16;
    player1.velocity.x = 0;
    player1.velocity.y = 0;
    fight.trail.push({ x: lw.position.x, y: lw.position.y, life: 14 });
    if (fight.frame > 26) startOmegaClash();
  }
}

function drawOmegaKickFx() {
  const fight = omegaKickFight;
  if (!fight.active || gameOver) return;
  const lw = player2;
  const time = performance.now() / 1000;
  const lwCenter = { x: getFighterCenterX(lw), y: lw.position.y + lw.height / 2 };
  ctx.save();
  // the trail of the kick
  fight.trail.forEach((ghost) => {
    ctx.fillStyle = `rgba(255, 249, 196, ${ghost.life / 22})`;
    ctx.fillRect(ghost.x + 8, ghost.y + 10, lw.width - 16, lw.height - 20);
  });
  if (fight.stage === 'charge' || fight.stage === 'clashCharge') {
    const chargeFrames = fight.stage === 'clashCharge' ? 130 : omegaKickChargeFrames;
    const power = Math.min(1, fight.frame / chargeFrames);
    // the light gathering in his leg
    const aura = ctx.createRadialGradient(lwCenter.x, lwCenter.y + 30, 4, lwCenter.x, lwCenter.y + 30, 40 + power * 110);
    aura.addColorStop(0, `rgba(255, 255, 255, ${0.5 + power * 0.4})`);
    aura.addColorStop(0.5, `rgba(255, 213, 79, ${0.3 + power * 0.3})`);
    aura.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(lwCenter.x - 160, lwCenter.y - 130, 320, 320);
    for (let mote = 0; mote < 14; mote += 1) {
      const angle = mote * 0.45 + time * 3;
      const radius = 130 * (1 - ((time * 1.5 + mote / 14) % 1));
      ctx.fillStyle = 'rgba(255, 249, 196, 0.9)';
      ctx.fillRect(lwCenter.x + Math.cos(angle) * radius, lwCenter.y + 30 + Math.sin(angle) * radius, 3, 3);
    }
    // the lock-on: where he is going to land
    if (fight.lock && fight.stage === 'charge') {
      const locked = fight.frame >= chargeFrames - omegaKickLockFrames;
      ctx.strokeStyle = locked ? `rgba(255, 255, 255, ${0.6 + Math.sin(time * 30) * 0.4})` : 'rgba(255, 82, 82, 0.6)';
      ctx.lineWidth = locked ? 3 : 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(lwCenter.x, lwCenter.y);
      ctx.lineTo(fight.lock.x, fight.lock.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(fight.lock.x, ground, 50, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (fight.stage === 'stunned' && fight.frame > 24) {
    // dizzy: little stars turning over his head
    for (let star = 0; star < 3; star += 1) {
      const angle = time * 5 + star * ((Math.PI * 2) / 3);
      ctx.fillStyle = '#fff59d';
      ctx.font = '900 16px Courier New, monospace';
      ctx.fillText('*', lwCenter.x + Math.cos(angle) * 28 - 4, lw.position.y - 10 + Math.sin(angle) * 8);
    }
  }
  if (fight.flash > 0) {
    fight.flash -= 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${fight.flash / 16})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (fight.healFx > 0) {
    fight.healFx -= 1;
    const knightX = getFighterCenterX(player1);
    const knightY = player1.position.y + player1.height / 2;
    const heal = ctx.createRadialGradient(knightX, knightY, 4, knightX, knightY, 90);
    heal.addColorStop(0, `rgba(105, 240, 174, ${fight.healFx / 80})`);
    heal.addColorStop(1, 'rgba(105, 240, 174, 0)');
    ctx.fillStyle = heal;
    ctx.fillRect(knightX - 90, knightY - 90, 180, 180);
  }
  // shockwaves and dust where he lands
  fight.waves.forEach((wave) => {
    const grow = 1 - wave.life / 40;
    ctx.strokeStyle = `rgba(255, 249, 196, ${wave.life / 40})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(wave.x, ground, 30 + grow * 260, 8 + grow * 30, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
  fight.dust.forEach((mote) => {
    ctx.fillStyle = mote.parry ? `rgba(144, 202, 249, ${Math.min(1, mote.life / 20)})` : `rgba(255, 241, 118, ${Math.min(1, mote.life / 20)})`;
    ctx.fillRect(mote.x, mote.y, 4, 4);
  });
  // his spirits going to Knight
  if (fight.spiritOrbs && fight.stage === 'spiritsOut') {
    fight.spiritOrbs.forEach((orb) => {
      if (orb.done || fight.frame < orb.start) return;
      const glow = ctx.createRadialGradient(orb.x, orb.y, 1, orb.x, orb.y, 18);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.4, hexToRgba(orb.color, 0.9));
      glow.addColorStop(1, hexToRgba(orb.color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 18, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  // the kick counter and the captions
  ctx.textAlign = 'center';
  if (fight.stage !== 'brawl' && fight.stage !== 'spiritsOut') {
    ctx.fillStyle = '#fff59d';
    ctx.font = '900 14px Courier New, monospace';
    ctx.fillText(`PATADAS: ${fight.kick} / ${omegaKickTotal}`, canvas.width / 2, 160);
  }
  if (fight.stage === 'brawl') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px Courier New, monospace';
    ctx.fillText(`VUELVE AL CIELO EN ${Math.ceil((omegaKickBreakFrames - fight.frame) / 60)}`, canvas.width / 2, 160);
  }
  if (fight.caption && fight.caption.life > 0) {
    ctx.globalAlpha = Math.min(1, fight.caption.life / 20);
    ctx.fillStyle = '#fff59d';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.font = '900 20px Courier New, monospace';
    ctx.strokeText(fight.caption.text, canvas.width / 2, 192);
    ctx.fillText(fight.caption.text, canvas.width / 2, 192);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'left';
  ctx.restore();
}

// ---------- the clash: 5 timed presses ----------
function startOmegaClash() {
  const fight = omegaKickFight;
  setOmegaKickStage('clash');
  fight.clash = { round: 0, line: 0, target: 0.7, state: 'run', timer: 0, push: 0, sparks: [], rings: [{ radius: 20, life: 50 }], flash: 20, zoom: 0.15, age: 0, shout: { text: 'CHOQUE!', life: 60 }, fx: null };
  newOmegaClashRound();
  resetKeys();
  playSound('omegaKickImpact');
}

function newOmegaClashRound() {
  const clash = omegaKickFight.clash;
  clash.line = 0;
  clash.state = 'run';
  clash.timer = 0;
  // the silhouette lands somewhere in the second half of the bar
  clash.target = 0.55 + Math.random() * 0.33;
  clash.fx = null;
}

function pressOmegaClash() {
  const clash = omegaKickFight.clash;
  if (!clash || clash.state !== 'run') return;
  const trackWidth = 380;
  const lineX = clash.line * trackWidth;
  const targetX = clash.target * trackWidth;
  if (Math.abs(lineX - targetX) <= 17) {
    clash.state = 'good';
    clash.timer = 0;
    clash.shout = { text: omegaClashShouts[Math.min(clash.round, omegaClashShouts.length - 1)], life: 60 };
    clash.round += 1;
    clash.push += 1;
    clash.flash = 12;
    clash.zoom = 0.12;
    clash.rings.push({ radius: 20, life: 40 });
    for (let spark = 0; spark < 50; spark += 1) {
      const angle = Math.random() * Math.PI * 2;
      clash.sparks.push({ x: 0, y: 0, vx: Math.cos(angle) * (3 + Math.random() * 9), vy: Math.sin(angle) * (3 + Math.random() * 9), life: 34, blue: Math.random() < 0.5 });
    }
    playSound('omegaClashHit');
    playSound('omegaKickImpact');
  } else {
    missOmegaClash();
  }
}

function missOmegaClash() {
  const clash = omegaKickFight.clash;
  clash.state = 'miss';
  clash.timer = 0;
  clash.push = Math.max(-2, clash.push - 1);
  clash.flash = 6;
  clash.redFlash = 20;
  player1.health = Math.max(1, player1.health - player1.health * omegaClashMissRatio);
  updateHealthBars();
  playSound('omegaClashMiss');
}

function updateOmegaClash() {
  const fight = omegaKickFight;
  const clash = fight.clash;
  clash.rings = clash.rings || [];
  fight.frame += 1;
  clash.timer += 1;
  clash.age = (clash.age || 0) + 1;
  if (clash.flash > 0) clash.flash -= 1;
  if (clash.redFlash > 0) clash.redFlash -= 1;
  clash.zoom = (clash.zoom || 0) * 0.9;
  if (clash.shout) clash.shout.life -= 1;
  const slowMotion = clash.round >= 4 && fight.stage === 'clash' ? 0.35 : 1;
  clash.sparks.forEach((spark) => {
    spark.x += spark.vx * slowMotion;
    spark.y += spark.vy * slowMotion;
    spark.life -= slowMotion;
  });
  clash.sparks = clash.sparks.filter((spark) => spark.life > 0);
  clash.rings.forEach((ring) => {
    ring.radius += 14 * slowMotion;
    ring.life -= slowMotion;
  });
  clash.rings = clash.rings.filter((ring) => ring.life > 0);
  // constant sparks from the contact point
  if (clash.age % 2 === 0) {
    const angle = Math.random() * Math.PI * 2;
    clash.sparks.push({ x: 0, y: 0, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, life: 18, blue: Math.random() < 0.5 });
  }
  // the music fades away, round by round
  const fadeGoal = fight.stage === 'clashWin' ? 0 : Math.max(0, 1 - (clash.round + 1) * 0.2);
  lightClashMusicFade += (fadeGoal - lightClashMusicFade) * 0.03;
  // the last clash: a heartbeat in the silence
  if (fight.stage === 'clash' && clash.round >= 4 && clash.age % 52 === 0) playSound('omegaHeartbeat');
  if (fight.stage === 'clash') {
    if (clash.state === 'run') {
      clash.line += omegaClashSpeeds[Math.min(clash.round, omegaClashSpeeds.length - 1)] / 380;
      if (clash.line > 1) missOmegaClash();
    } else if (clash.state === 'good' && clash.timer > 45) {
      if (clash.round >= omegaClashSpeeds.length) {
        setOmegaKickStage('clashWin');
        clash.rings.push({ radius: 20, life: 80 });
        playSound('omegaKickImpact');
        playSound('judgeOverdrive');
        playSound('achievement');
      } else {
        newOmegaClashRound();
      }
    } else if (clash.state === 'miss' && clash.timer > 50) {
      newOmegaClashRound();
    }
  } else if (fight.stage === 'clashWin' && fight.frame > 130) {
    // the white flash clears... both are still standing, barely
    fight.won = true;
    fight.active = false;
    player2.scriptedFlight = false;
    player2.lightWarriorOmegaTransformed = false;
    player2.lightWarriorOmegaStateTimer = 0;
    player2.secretVariant = null;
    player2.damageMultiplier = 1;
    player2.spiritCount = 0;
    player1.knightGlow = 0;
    player1.health = 1;
    player2.health = 16;
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.isAttacking = false;
    });
    lightClashMusicFade = 0;
    updateHealthBars();
    updateCombatHudIdentity();
    startKnightFarolEnd();
    return;
  }
  drawOmegaClash();
}

function drawOmegaClash() {
  const fight = omegaKickFight;
  const clash = fight.clash;
  const time = performance.now() / 1000;
  const win = fight.stage === 'clashWin';
  const lastClash = clash.round >= 4 && !win;
  const meetX = canvas.width / 2 + clash.push * 14;
  const meetY = ground - 150;
  const shake = win ? Math.max(0, 14 - fight.frame / 8) : clash.flash > 0 ? 6 : lastClash ? 0.6 : 1.5;
  // the camera pushes in a little more with every clash (and jumps on each hit)
  const zoom = 1 + Math.min(4, clash.round) * 0.035 + (clash.zoom || 0);
  ctx.save();
  ctx.translate(meetX, meetY);
  ctx.scale(zoom, zoom);
  ctx.translate(-meetX, -meetY);
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawStage();
  // the screen goes darker every time
  const darkness = win ? 0.92 : [0.35, 0.5, 0.65, 0.8, 0.94][Math.min(4, clash.round)];
  ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
  ctx.fillRect(-200, -200, canvas.width + 400, canvas.height + 400);
  // two energies pushing: Knight's blue from the left, Light Warrior's gold from the right
  const blue = ctx.createLinearGradient(0, 0, meetX, 0);
  blue.addColorStop(0, 'rgba(66, 165, 245, 0)');
  blue.addColorStop(1, `rgba(66, 165, 245, ${lastClash ? 0.35 : 0.22})`);
  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.moveTo(-200, meetY - 220);
  ctx.lineTo(meetX, meetY - 18);
  ctx.lineTo(meetX, meetY + 18);
  ctx.lineTo(-200, meetY + 220);
  ctx.closePath();
  ctx.fill();
  const gold = ctx.createLinearGradient(canvas.width, 0, meetX, 0);
  gold.addColorStop(0, 'rgba(255, 213, 79, 0)');
  gold.addColorStop(1, `rgba(255, 213, 79, ${lastClash ? 0.35 : 0.22})`);
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(canvas.width + 200, meetY - 220);
  ctx.lineTo(meetX, meetY - 18);
  ctx.lineTo(meetX, meetY + 18);
  ctx.lineTo(canvas.width + 200, meetY + 220);
  ctx.closePath();
  ctx.fill();
  // speed lines rushing into the contact point
  const lineSpeed = lastClash ? 0.25 : 1;
  for (let streak = 0; streak < 26; streak += 1) {
    const fromLeft = streak % 2 === 0;
    const progress = (time * 1.6 * lineSpeed + streak * 0.137) % 1;
    const spread = ((streak * 53) % 300) - 150;
    const startX = fromLeft ? -100 : canvas.width + 100;
    const x = startX + (meetX - startX) * progress;
    const y = meetY + spread * (1 - progress);
    ctx.strokeStyle = fromLeft ? `rgba(144, 202, 249, ${0.5 * (1 - progress)})` : `rgba(255, 241, 118, ${0.5 * (1 - progress)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (fromLeft ? -40 : 40), y + spread * 0.04);
    ctx.stroke();
  }
  // the two of them, pushing
  const winPush = win ? Math.min(1, fight.frame / 50) : 0;
  player1.position = { x: meetX - 80 + winPush * 40, y: meetY - player1.height / 2 };
  player1.attacksToTheRight = true;
  player1.isAttacking = true;
  player1.knightGlow = 1;
  player1.draw();
  player1.isAttacking = false;
  player2.position = { x: meetX + 12 + winPush * 40, y: meetY - player2.height / 2 };
  player2.attacksToTheRight = false;
  player2.draw();
  // the contact point: light against steel, cracking the air
  const pulse = 1 + Math.sin(time * (lastClash ? 6 : 22)) * 0.12;
  const contact = ctx.createRadialGradient(meetX, meetY, 2, meetX, meetY, (90 + clash.round * 14) * pulse);
  contact.addColorStop(0, 'rgba(255, 255, 255, 1)');
  contact.addColorStop(0.35, 'rgba(255, 241, 118, 0.7)');
  contact.addColorStop(0.7, 'rgba(144, 202, 249, 0.35)');
  contact.addColorStop(1, 'rgba(144, 202, 249, 0)');
  ctx.fillStyle = contact;
  ctx.fillRect(meetX - 200, meetY - 200, 400, 400);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  for (let bolt = 0; bolt < 8; bolt += 1) {
    const angle = time * (lastClash ? 1.5 : 7) + bolt * 0.8;
    const length = 60 + clash.round * 12 + Math.sin(time * 13 + bolt) * 14;
    ctx.beginPath();
    ctx.moveTo(meetX, meetY);
    ctx.lineTo(meetX + Math.cos(angle) * length * 0.5 + (Math.random() - 0.5) * 8, meetY + Math.sin(angle) * length * 0.35);
    ctx.lineTo(meetX + Math.cos(angle) * length, meetY + Math.sin(angle) * length * 0.7);
    ctx.stroke();
  }
  clash.rings.forEach((ring) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${ring.life / 40})`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(meetX, meetY, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  clash.sparks.forEach((spark) => {
    ctx.fillStyle = spark.blue ? `rgba(144, 202, 249, ${spark.life / 30})` : `rgba(255, 249, 196, ${spark.life / 30})`;
    ctx.fillRect(meetX + spark.x, meetY + spark.y, 4, 4);
  });
  // in the last clash, a few words between them
  if (lastClash) {
    ctx.textAlign = 'center';
    ctx.font = 'italic 900 15px Courier New, monospace';
    ctx.fillStyle = 'rgba(144, 202, 249, 0.9)';
    ctx.fillText('...todavia no...', meetX - 90, meetY + 92);
    ctx.fillStyle = 'rgba(255, 241, 118, 0.9)';
    ctx.fillText('Demostrame tu luz, caballero!', meetX + 110, meetY + 116);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // (the interface does not zoom)
  ctx.save();
  if (!win) {
    if (clash.shout && clash.shout.life > 0) {
      const pop = Math.min(1, (60 - clash.shout.life) / 8);
      ctx.globalAlpha = Math.min(1, clash.shout.life / 15);
      ctx.textAlign = 'center';
      ctx.font = `900 ${Math.round(24 + pop * 18)}px Courier New, monospace`;
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#0d47a1';
      ctx.fillStyle = '#e3f2fd';
      ctx.strokeText(clash.shout.text, canvas.width / 2, ground - 20);
      ctx.fillText(clash.shout.text, canvas.width / 2, ground - 20);
      ctx.globalAlpha = 1;
    }
    // the box with the bar and the silhouette
    const boxX = canvas.width / 2 - 220;
    const boxY = 110;
    const trackX = boxX + 30;
    const trackY = boxY + 80;
    ctx.fillStyle = 'rgba(8, 6, 12, 0.92)';
    ctx.fillRect(boxX, boxY, 440, 150);
    ctx.strokeStyle = clash.state === 'miss' ? '#ff5252' : clash.state === 'good' ? '#69f0ae' : lastClash ? '#ffffff' : '#fff59d';
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, 440, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px Courier New, monospace';
    ctx.textAlign = 'center';
    const prompt = clash.state === 'good' ? 'BIEN!' : clash.state === 'miss' ? 'TE EMPUJA!... OTRA VEZ' : lastClash ? 'EL ULTIMO CHOQUE... ESPERA EL MOMENTO' : 'ESPACIO CUANDO LA LINEA TOQUE LA SILUETA';
    ctx.fillText(prompt, canvas.width / 2, boxY + 26);
    for (let pip = 0; pip < omegaClashSpeeds.length; pip += 1) {
      ctx.fillStyle = pip < clash.round ? '#69f0ae' : 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 48 + pip * 24, boxY + 44, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(trackX, trackY - 2, 380, 4);
    const targetX = trackX + clash.target * 380;
    ctx.fillStyle = clash.state === 'good' ? '#69f0ae' : '#90caf9';
    ctx.fillRect(targetX - 10, trackY - 34, 20, 18);
    ctx.fillRect(targetX - 13, trackY - 16, 26, 30);
    ctx.fillStyle = '#0a0710';
    ctx.fillRect(targetX - 7, trackY - 28, 14, 3);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(targetX - 17, trackY - 38, 34, 56);
    if (clash.state === 'run') {
      const lineX = trackX + clash.line * 380;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = lastClash ? '#90caf9' : '#ffffff';
      ctx.shadowBlur = lastClash ? 20 : 10;
      ctx.fillRect(lineX - 2, trackY - 44, 4, 66);
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 12px Courier New, monospace';
    ctx.fillText(`CHOQUE ${Math.min(clash.round + 1, omegaClashSpeeds.length)} / ${omegaClashSpeeds.length}`, canvas.width / 2, boxY + 140);
    ctx.textAlign = 'left';
  } else {
    // the final burst: the contact swells into a sphere of light that swallows everything
    const grow = Math.min(1, fight.frame / 45);
    const sphere = ctx.createRadialGradient(meetX, meetY, 4, meetX, meetY, 40 + grow * 900);
    sphere.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sphere.addColorStop(0.7, `rgba(255, 255, 255, ${grow})`);
    sphere.addColorStop(1, `rgba(255, 249, 196, ${grow * 0.6})`);
    ctx.fillStyle = sphere;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (fight.frame > 45) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (clash.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${clash.flash / 18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (clash.redFlash > 0) {
    ctx.fillStyle = `rgba(255, 23, 68, ${clash.redFlash / 60})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
  updateHealthBars();
}

// ---------- chapter 5, level 8: Shadow Jester's final act ----------
function isRiftFight() {
  return normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === knightSecretLevel && isShadowJester(player2);
}

function spawnJesterFinalePattern(pattern, t, push, box, soul) {
  const suits = ['spade', 'heart', 'diamond', 'club'];
  const suit = (extra) => push({ type: 'side', sprite: 'suit', suit: suits[Math.floor(Math.random() * 4)], r: 11, ...extra });
  // scythes falling like meteors into the lower-left corner (bigger and bigger)
  const meteor = (size, speed, warn = 0) => {
    const x = box.x + box.width * (0.55 + Math.random() * 0.6);
    const y = box.y - 40 - Math.random() * 60;
    const targetX = box.x + Math.random() * box.width * 0.55;
    const targetY = box.y + box.height * (0.45 + Math.random() * 0.55);
    const distance = Math.hypot(targetX - x, targetY - y);
    push({ type: 'side', sprite: 'scythe', meteor: true, x, y, vx: ((targetX - x) / distance) * speed, vy: ((targetY - y) / distance) * speed, r: size, warn, life: 300 });
  };
  const bomb = () => push({ type: 'bomb', sprite: 'bomb', x: box.x + 30 + Math.random() * (box.width - 60), y: box.y - 20, vy: 5, stopY: box.y + 40 + Math.random() * (box.height - 80), fuse: 45, r: 12, warn: 14, life: 400 });
  if (pattern === 'jesterDash') {
    // his clones dash across lanes (with a warning), and cards rain between them
    if (t % 50 === 0) {
      const laneHeight = 54;
      const lanes = Math.floor(box.height / laneHeight);
      const lane = Math.floor(Math.random() * lanes);
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'clone', y: box.y + lane * laneHeight, h: laneHeight, warn: 36, dir: -side, x: side < 0 ? box.x - 40 : box.x + box.width + 40, speed: 15 });
    }
    if (t % 22 === 11) suit({ type: 'drop', x: box.x + 20 + Math.random() * (box.width - 40), y: box.y - 16, vy: 4.4, warn: 14 });
    return true;
  }
  if (pattern === 'grandFinale') {
    const round = dodgeRound;
    if (t === 1) {
      // the box grows to the whole screen
      round.boxTarget = { ...grandFinaleBox };
      round.shake = 10;
      playSound('omegaKickImpact');
    }
    const big = round.boxTarget;
    const finaleFrames = 960 - 70;
    const giantAt = finaleFrames - 210;
    // a meteor of scythes from a corner of the big box
    const bigMeteor = (size, speed, fromLeft, warn = 0) => {
      const x = fromLeft ? big.x - 80 + Math.random() * big.width * 0.4 : big.x + big.width * (0.6 + Math.random() * 0.5);
      const y = big.y - 40 - Math.random() * 80;
      const targetX = fromLeft ? big.x + big.width * (0.45 + Math.random() * 0.55) : big.x + Math.random() * big.width * 0.55;
      const targetY = big.y + big.height * (0.4 + Math.random() * 0.6);
      const distance = Math.hypot(targetX - x, targetY - y);
      push({ type: 'side', sprite: 'scythe', meteor: true, x, y, vx: ((targetX - x) / distance) * speed, vy: ((targetY - y) / distance) * speed, r: size, warn, life: 320 });
    };
    if (t > 30 && t < giantAt) {
      const progress = t / giantAt;
      const rate = Math.max(4, Math.round(12 - progress * 8));
      if (t % rate === 0) {
        bigMeteor(16 + progress * 22, 9 + progress * 5, false);
        // halfway through, a second shower crosses from the other corner
        if (progress > 0.45 && Math.random() < 0.6) bigMeteor(14 + progress * 18, 9 + progress * 4, true);
      }
      if (t % Math.max(55, Math.round(110 - progress * 55)) === 0) bigMeteor(46 + progress * 20, 7, Math.random() < 0.5, 34);
      if (progress > 0.3 && t % 90 === 45) bomb();
    }
    // the end: the giant scythe
    if (t === giantAt) {
      const soulX = Math.max(big.x + 140, Math.min(big.x + big.width - 140, soul.x));
      push({ type: 'giantScythe', sprite: 'giantScythe', x: soulX, y: big.y - 140, vy: 1, r: 130, warn: 70, life: 400 });
      dodgeRoundCaption('LA GUADANA DEL TELON FINAL!', '#ce93d8');
      playSound('judgeFinalStart');
    }
    return true;
  }
  if (pattern === 'suitStorm') {
    if (t % 18 === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      suit({ x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: box.y + 20 + Math.random() * (box.height - 40), vx: -side * 5.6, vy: 0, wave: Math.random() * 6 });
    }
    if (t % 60 === 30) {
      const fromX = box.x + box.width - 10;
      const fromY = box.y + 10;
      const aim = Math.atan2(soul.y - fromY, soul.x - fromX);
      [-0.4, -0.2, 0, 0.2, 0.4].forEach((spread) => suit({ type: 'aimed', x: fromX, y: fromY, vx: Math.cos(aim + spread) * 4.8, vy: Math.sin(aim + spread) * 4.8 }));
    }
  } else if (pattern === 'jesterBombs') {
    if (t % 40 === 0) bomb();
    if (t % 45 === 20) {
      const side = Math.random() < 0.5 ? -1 : 1;
      suit({ x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: soul.y, vx: -side * 6, vy: 0 });
    }
  } else if (pattern === 'scytheMeteors') {
    // a real meteor shower: denser, faster and bigger as it goes
    const rate = Math.max(6, 14 - Math.floor(t / 45));
    if (t % rate === 0) {
      meteor(16 + Math.min(22, t / 16), 9 + t / 110);
      if (t > 120 && Math.random() < 0.4) meteor(14 + Math.min(16, t / 22), 10 + t / 110);
    }
    if (t % 100 === 50) meteor(44 + Math.min(16, t / 25), 6.5, 36);
  } else if (pattern === 'finalChaos') {
    if (t % 24 === 0) meteor(16 + Math.min(18, t / 20), 9);
    if (t % 140 === 70) meteor(44, 6.5, 32);
    if (t % 70 === 35) bomb();
    if (t % 32 === 16) {
      const side = Math.random() < 0.5 ? -1 : 1;
      suit({ x: side < 0 ? box.x - 20 : box.x + box.width + 20, y: box.y + 20 + Math.random() * (box.height - 40), vx: -side * 6.4, vy: 0 });
    }
  } else {
    return false;
  }
  return true;
}

function drawJesterFinaleItem(item) {
  const round = dodgeRound;
  if (item.sprite === 'clone') {
    // a purple afterimage of Shadow Jester dashing through
    ctx.save();
    ctx.translate(item.x, item.y + item.h / 2);
    ctx.scale(item.dir, 1);
    ctx.fillStyle = 'rgba(179, 136, 255, 0.35)';
    ctx.fillRect(-80, -4, 60, 3);
    ctx.fillRect(-70, 8, 50, 3);
    ctx.fillStyle = 'rgba(94, 53, 177, 0.9)';
    ctx.fillRect(-12, -10, 24, 26);
    ctx.fillStyle = '#ede7f6';
    ctx.beginPath();
    ctx.arc(0, -16, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7c4dff';
    ctx.beginPath();
    ctx.moveTo(-12, -22);
    ctx.lineTo(-6, -34);
    ctx.lineTo(0, -24);
    ctx.lineTo(6, -34);
    ctx.lineTo(12, -22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(2, -18, 3, 3);
    ctx.restore();
    return true;
  }
  if (item.sprite === 'giantScythe') {
    // the giant scythe of the final curtain
    ctx.save();
    ctx.shadowColor = '#7c4dff';
    ctx.shadowBlur = 30;
    ctx.translate(item.x, item.y);
    ctx.rotate(-0.6 + Math.sin(item.spin || 0) * 0.15);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(-item.r * 0.06, -item.r * 1.1, item.r * 0.12, item.r * 2.2);
    ctx.fillStyle = '#eceff1';
    ctx.strokeStyle = '#7c4dff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -item.r * 0.9, item.r, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.arc(0, -item.r * 0.55, item.r * 0.75, Math.PI * 0.9, Math.PI * 0.1, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    // a grinning mask on the blade
    ctx.fillStyle = '#311b92';
    ctx.beginPath();
    ctx.arc(0, -item.r * 0.25, item.r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(-item.r * 0.07, -item.r * 0.3, 5, 5);
    ctx.fillRect(item.r * 0.03, -item.r * 0.3, 5, 5);
    ctx.restore();
    return true;
  }
  if (item.sprite === 'scythe') {
    // a spinning scythe with a ghostly trail
    ctx.save();
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.35)';
    ctx.lineWidth = item.r * 0.6;
    ctx.beginPath();
    ctx.moveTo(item.x, item.y);
    ctx.lineTo(item.x - item.vx * 6, item.y - item.vy * 6);
    ctx.stroke();
    ctx.translate(item.x, item.y);
    ctx.rotate(round.frame * 0.35);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-item.r * 0.1, -item.r, item.r * 0.2, item.r * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.strokeStyle = '#7c4dff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -item.r * 0.9, item.r, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.arc(0, -item.r * 0.55, item.r * 0.75, Math.PI * 0.9, Math.PI * 0.1, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return true;
  }
  if (item.sprite === 'suit') {
    const colors = { spade: '#b388ff', heart: '#ff4081', diamond: '#ffd740', club: '#69f0ae' };
    const glyphs = { spade: 'S', heart: 'H', diamond: 'D', club: 'C' };
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.sin(round.frame / 6 + item.x) * 0.4);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(-9, -12, 18, 24);
    ctx.strokeStyle = colors[item.suit] || '#b388ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-9, -12, 18, 24);
    ctx.fillStyle = colors[item.suit] || '#b388ff';
    ctx.font = '900 13px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(glyphs[item.suit] || '?', 0, 5);
    ctx.restore();
    return true;
  }
  if (item.sprite === 'bomb') {
    ctx.save();
    const flash = item.y >= item.stopY && Math.floor(item.fuse / 5) % 2 === 0;
    ctx.fillStyle = flash ? '#ff5252' : '#212121';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b388ff';
    ctx.fillRect(item.x - 3, item.y - item.r - 6, 6, 6);
    ctx.fillStyle = '#ffd740';
    ctx.fillRect(item.x + 1, item.y - item.r - 12 - Math.random() * 3, 3, 3);
    // a painted grin on it
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * 0.5, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
    return true;
  }
  if (item.sprite === 'shard') {
    ctx.save();
    ctx.fillStyle = '#ce93d8';
    ctx.translate(item.x, item.y);
    ctx.rotate(round.frame * 0.3);
    ctx.fillRect(-5, -2, 10, 4);
    ctx.restore();
    return true;
  }
  return false;
}

// ---------- the rift clash: Knight's bar against Shadow Jester's bar ----------
const riftClashSpeeds = [6, 8, 10.5, 13, 1.6];
const riftJesterSpeeds = [7, 9.5, 12, 15, 2];

function startRiftClash() {
  Object.assign(riftClash, {
    active: true,
    stage: 'clash',
    frame: 0,
    round: 0,
    push: 0,
    knight: null,
    jester: null,
    state: 'run',
    timer: 0,
    sparks: [],
    rings: [{ radius: 20, life: 50 }],
    flash: 20,
    zoom: 0.15,
    shout: { text: 'CHOQUE!', life: 60 },
    jesterWins: 0,
    knightWins: 0,
  });
  newRiftClashRound();
  resetKeys();
  playSound('omegaKickImpact');
}

function newRiftClashRound() {
  riftClash.knight = { line: 0, target: 0.55 + Math.random() * 0.33, result: null };
  riftClash.jester = { line: 0, target: 0.5 + Math.random() * 0.35, result: null };
  riftClash.state = 'run';
  riftClash.timer = 0;
}

function pressRiftClash() {
  const knight = riftClash.knight;
  if (riftClash.state !== 'run' || knight.result) return;
  knight.result = Math.abs(knight.line - knight.target) * 380 <= 17 ? 'good' : 'miss';
  playSound(knight.result === 'good' ? 'omegaClashHit' : 'omegaClashMiss');
}

function resolveRiftClashRound() {
  const clash = riftClash;
  clash.state = 'result';
  clash.timer = 0;
  clash.round += 1;
  clash.jesterWins += 1;
  clash.flash = 12;
  clash.zoom = 0.12;
  clash.rings.push({ radius: 20, life: 40 });
  for (let spark = 0; spark < 40; spark += 1) {
    const angle = Math.random() * Math.PI * 2;
    clash.sparks.push({ x: 0, y: 0, vx: Math.cos(angle) * (3 + Math.random() * 8), vy: Math.sin(angle) * (3 + Math.random() * 8), life: 30, purple: Math.random() < 0.6 });
  }
  if (clash.knight.result === 'good') {
    clash.knightWins += 1;
    // Knight holds... but the jester never misses
    clash.shout = { text: ['AGUANTA!', 'NO RETROCEDAS!', 'SIGUE AHI!', 'RESISTE!', '...'][Math.min(4, clash.round - 1)], life: 60, knight: true };
  } else {
    clash.push = Math.min(4, clash.push + 1);
    player1.health = Math.max(1, player1.health - player1.health * omegaClashMissRatio);
    updateHealthBars();
    clash.shout = { text: 'TE EMPUJA!', life: 60 };
  }
  playSound('omegaKickImpact');
}

function updateRiftClash() {
  const clash = riftClash;
  clash.frame += 1;
  clash.timer += 1;
  if (clash.flash > 0) clash.flash -= 1;
  clash.zoom *= 0.9;
  if (clash.shout) clash.shout.life -= 1;
  const lastRound = clash.round >= 4 && clash.stage === 'clash';
  const slowMotion = lastRound ? 0.35 : 1;
  clash.sparks.forEach((spark) => {
    spark.x += spark.vx * slowMotion;
    spark.y += spark.vy * slowMotion;
    spark.life -= slowMotion;
  });
  clash.sparks = clash.sparks.filter((spark) => spark.life > 0);
  clash.rings.forEach((ring) => {
    ring.radius += 14 * slowMotion;
    ring.life -= slowMotion;
  });
  clash.rings = clash.rings.filter((ring) => ring.life > 0);
  if (clash.frame % 2 === 0) {
    const angle = Math.random() * Math.PI * 2;
    clash.sparks.push({ x: 0, y: 0, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, life: 18, purple: Math.random() < 0.6 });
  }
  // the music fades away, round by round
  const fadeGoal = clash.stage === 'end' ? 0 : Math.max(0, 1 - (clash.round + 1) * 0.2);
  lightClashMusicFade += (fadeGoal - lightClashMusicFade) * 0.03;
  if (lastRound && clash.frame % 52 === 0) playSound('omegaHeartbeat');
  if (clash.stage === 'clash') {
    if (clash.state === 'run') {
      const knight = clash.knight;
      const jester = clash.jester;
      if (!knight.result) {
        knight.line += riftClashSpeeds[clash.round] / 380;
        if (knight.line > 1) {
          knight.result = 'miss';
          playSound('omegaClashMiss');
        }
      }
      // his line stops exactly on his silhouette, every time
      if (!jester.result) {
        jester.line = Math.min(jester.target, jester.line + riftJesterSpeeds[clash.round] / 380);
        if (jester.line >= jester.target) {
          jester.result = 'good';
          playSound('jesterUnlock');
        }
      }
      if (knight.result && jester.result) resolveRiftClashRound();
    } else if (clash.state === 'result' && clash.timer > 50) {
      if (clash.round >= riftClashSpeeds.length) {
        clash.stage = 'end';
        clash.frame = 0;
        clash.shout = null;
        playSound('omegaKickImpact');
        playSound('judgeOverdrive');
      } else {
        newRiftClashRound();
      }
    }
  } else if (clash.stage === 'end' && clash.frame > 230) {
    // the curtain falls on Knight... and Shadow Jester comes to take him
    clash.active = false;
    lightClashMusicFade = 0;
    player1.knightGlow = 0;
    player1.position = { x: 300, y: ground - player1.height };
    player2.position = { x: 560, y: ground - player2.height };
    player1.health = 1;
    updateHealthBars();
    startKnightRiftAbduct();
    return;
  }
  drawRiftClash();
}

function drawRiftClash() {
  const clash = riftClash;
  const time = performance.now() / 1000;
  const end = clash.stage === 'end';
  const lastRound = clash.round >= 4 && !end;
  const meetX = canvas.width / 2 - clash.push * 22;
  const meetY = ground - 150;
  const zoom = 1 + Math.min(4, clash.round) * 0.035 + clash.zoom;
  ctx.save();
  ctx.translate(meetX, meetY);
  ctx.scale(zoom, zoom);
  ctx.translate(-meetX, -meetY);
  const shake = end ? Math.max(0, 14 - clash.frame / 8) : clash.flash > 0 ? 6 : 1.5;
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawStage();
  const darkness = end ? 0.94 : [0.35, 0.5, 0.65, 0.8, 0.94][Math.min(4, clash.round)];
  ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
  ctx.fillRect(-200, -200, canvas.width + 400, canvas.height + 400);
  // the two energies: Knight's blue, the jester's purple (it keeps winning ground)
  [[0, meetX, 'rgba(66, 165, 245, ', -200], [canvas.width, meetX, 'rgba(124, 77, 255, ', canvas.width + 200]].forEach(([fromX, toX, color, edge]) => {
    const energy = ctx.createLinearGradient(fromX, 0, toX, 0);
    energy.addColorStop(0, `${color}0)`);
    energy.addColorStop(1, `${color}${lastRound ? 0.35 : 0.24})`);
    ctx.fillStyle = energy;
    ctx.beginPath();
    ctx.moveTo(edge, meetY - 220);
    ctx.lineTo(toX, meetY - 18);
    ctx.lineTo(toX, meetY + 18);
    ctx.lineTo(edge, meetY + 220);
    ctx.closePath();
    ctx.fill();
  });
  // cards flying in from his side
  for (let card = 0; card < 10; card += 1) {
    const progress = (time * (lastRound ? 0.4 : 1.3) + card * 0.1) % 1;
    const x = canvas.width + 60 + (meetX - canvas.width - 60) * progress;
    const y = meetY + ((card * 67) % 260 - 130) * (1 - progress);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 4 + card);
    ctx.fillStyle = `rgba(250, 250, 250, ${0.7 * (1 - progress)})`;
    ctx.fillRect(-6, -8, 12, 16);
    ctx.restore();
  }
  const blast = end ? Math.min(1, clash.frame / 60) : 0;
  player1.position = { x: meetX - 80 - blast * 160, y: meetY - player1.height / 2 + blast * 60 };
  player1.attacksToTheRight = true;
  player1.isAttacking = !end;
  player1.knightGlow = end ? 0 : 1;
  player1.draw();
  player1.isAttacking = false;
  player2.position = { x: meetX + 12, y: meetY - player2.height / 2 };
  player2.attacksToTheRight = false;
  player2.draw();
  const pulse = 1 + Math.sin(time * (lastRound ? 6 : 22)) * 0.12;
  const contact = ctx.createRadialGradient(meetX, meetY, 2, meetX, meetY, (90 + clash.round * 14) * pulse);
  contact.addColorStop(0, 'rgba(255, 255, 255, 1)');
  contact.addColorStop(0.35, 'rgba(206, 147, 216, 0.7)');
  contact.addColorStop(0.7, 'rgba(144, 202, 249, 0.3)');
  contact.addColorStop(1, 'rgba(124, 77, 255, 0)');
  ctx.fillStyle = contact;
  ctx.fillRect(meetX - 200, meetY - 200, 400, 400);
  clash.rings.forEach((ring) => {
    ctx.strokeStyle = `rgba(206, 147, 216, ${ring.life / 40})`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(meetX, meetY, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  clash.sparks.forEach((spark) => {
    ctx.fillStyle = spark.purple ? `rgba(206, 147, 216, ${spark.life / 30})` : `rgba(144, 202, 249, ${spark.life / 30})`;
    ctx.fillRect(meetX + spark.x, meetY + spark.y, 4, 4);
  });
  if (lastRound) {
    ctx.textAlign = 'center';
    ctx.font = 'italic 900 15px Courier New, monospace';
    ctx.fillStyle = 'rgba(144, 202, 249, 0.9)';
    ctx.fillText('...no puedo... caer aca...', meetX - 100, meetY + 92);
    ctx.fillStyle = 'rgba(206, 147, 216, 0.95)';
    ctx.fillText('Shhh... ya casi termina, cariño. Jijiji.', meetX + 110, meetY + 116);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  ctx.save();
  if (!end) {
    if (clash.shout && clash.shout.life > 0) {
      ctx.globalAlpha = Math.min(1, clash.shout.life / 15);
      ctx.textAlign = 'center';
      ctx.font = '900 34px Courier New, monospace';
      ctx.lineWidth = 7;
      ctx.strokeStyle = clash.shout.knight ? '#0d47a1' : '#311b92';
      ctx.fillStyle = clash.shout.knight ? '#e3f2fd' : '#e1bee7';
      ctx.strokeText(clash.shout.text, canvas.width / 2, ground - 20);
      ctx.fillText(clash.shout.text, canvas.width / 2, ground - 20);
      ctx.globalAlpha = 1;
    }
    // two boxes: Knight's (left) and Shadow Jester's (right)
    const panel = (boxX, owner, bar, color, label, silhouette) => {
      const boxY = 100;
      const trackX = boxX + 20;
      const trackY = boxY + 74;
      const trackWidth = 380 * 0.85;
      ctx.fillStyle = 'rgba(8, 6, 12, 0.92)';
      ctx.fillRect(boxX, boxY, 370, 130);
      ctx.strokeStyle = bar.result === 'good' ? '#69f0ae' : bar.result === 'miss' ? '#ff5252' : color;
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, 370, 130);
      ctx.fillStyle = color;
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, boxX + 185, boxY + 22);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(trackX, trackY - 2, trackWidth, 4);
      const targetX = trackX + bar.target * trackWidth;
      ctx.fillStyle = bar.result === 'good' ? '#69f0ae' : color;
      silhouette(targetX, trackY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(targetX - 16, trackY - 38, 32, 56);
      if (!bar.result || owner === 'jester') {
        const lineX = trackX + Math.min(1, bar.line) * trackWidth;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fillRect(lineX - 2, trackY - 44, 4, 66);
        ctx.shadowBlur = 0;
      }
      // the rounds: the jester's pips fill every time
      for (let pip = 0; pip < 5; pip += 1) {
        const won = pip < (owner === 'jester' ? clash.jesterWins : clash.knightWins);
        ctx.fillStyle = won ? color : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(boxX + 137 + pip * 24, boxY + 40, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.textAlign = 'left';
    };
    panel(28, 'knight', clash.knight, '#90caf9', 'KNIGHT  -  ESPACIO EN LA SILUETA', (x, y) => {
      ctx.fillRect(x - 10, y - 34, 20, 18);
      ctx.fillRect(x - 13, y - 16, 26, 30);
    });
    panel(canvas.width - 398, 'jester', clash.jester, '#ce93d8', 'SHADOW JESTER', (x, y) => {
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 20);
      ctx.lineTo(x - 6, y - 36);
      ctx.lineTo(x, y - 22);
      ctx.lineTo(x + 6, y - 36);
      ctx.lineTo(x + 14, y - 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x - 12, y - 20, 24, 34);
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 12px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`CHOQUE ${Math.min(clash.round + 1, 5)} / 5`, canvas.width / 2, 250);
    ctx.textAlign = 'left';
  } else {
    // five out of five: the purple swallows everything
    const grow = Math.min(1, clash.frame / 45);
    const meetCenterX = canvas.width / 2 - clash.push * 22;
    const burst = ctx.createRadialGradient(meetCenterX, meetY, 4, meetCenterX, meetY, 40 + grow * 900);
    burst.addColorStop(0, 'rgba(255, 255, 255, 1)');
    burst.addColorStop(0.5, `rgba(124, 77, 255, ${grow})`);
    burst.addColorStop(1, `rgba(20, 0, 40, ${grow})`);
    ctx.fillStyle = burst;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (clash.frame > 45) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (clash.frame - 45) / 60)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.textAlign = 'center';
    if (clash.frame > 20 && clash.frame < 110) {
      ctx.font = 'italic 900 40px Courier New, monospace';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#1a0033';
      ctx.fillStyle = '#e1bee7';
      ctx.strokeText('CINCO DE CINCO! PERFECTO!', canvas.width / 2 + (Math.random() - 0.5) * 6, 200);
      ctx.fillText('CINCO DE CINCO! PERFECTO!', canvas.width / 2 + (Math.random() - 0.5) * 6, 200);
    }
    if (clash.frame > 120) {
      ctx.globalAlpha = Math.min(1, (clash.frame - 120) / 40);
      ctx.font = 'italic 900 26px Courier New, monospace';
      ctx.fillStyle = '#ce93d8';
      ctx.fillText('...Y cae el telon. Jijiji.', canvas.width / 2, canvas.height / 2);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'left';
  }
  if (clash.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${clash.flash / 18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
  updateHealthBars();
}

// ---------- SHANG TING, the Shaolin master (secret boss) ----------
function unlockShaolinCode() {
  if ((Number(scammerShop.owned.fortuneCookie) || 0) < shaolinCookiesNeeded) {
    // without the note this means nothing
    showCustomToast('功夫茶...?', 'Escribiste algo en chino... o eso parece. No paso nada. Tal vez te falta comer algo antes.');
    return;
  }
  unlockAchievement('codeBreaker');
  shaolinCodeActive = true;
  if (shaolinTempleMapButton) shaolinTempleMapButton.classList.remove('hidden');
  showCustomToast('功夫茶 (TE KUNG FU) ACTIVADO', 'Aparecio un mapa nuevo: el Templo Shaolin. Elegi una pelea contra el bot... un maestro te espera.');
  playSound('achievement');
}

function isShaolinForbiddenHero(fighter) {
  return fighter.characterType === 'divineGeneral' || fighter.characterType === 'lightWarrior' || isKnight(fighter) || fighter.secretVariant === 'shaolinMaster';
}

function resetShaolin(fighter) {
  // the boss starts with his moves recharging; a player can use them right away
  const boss = shaolinChallenge.active && fighter === player2;
  Object.assign(fighter, {
    shaolinPalmCooldown: boss ? 120 : 0,
    shaolinCraneCooldown: boss ? 200 : 0,
    shaolinStanceCooldown: boss ? 260 : 0,
    shaolinFistsCooldown: boss ? 220 : 0,
    shaolinPalmTimer: 0,
    shaolinCraneTimer: 0,
    shaolinStanceTimer: 0,
    shaolinFistsTimer: 0,
    shaolinPalms: [],
    shaolinShout: null,
    shaolinFury: false,
    shaolinCounterFlash: 0,
  });
}

function shaolinShout(fighter, text) {
  fighter.shaolinShout = { text, life: 80 };
}

function getShaolinCooldown(fighter, frames) {
  return getDebugCooldown(Math.round(frames * (fighter.shaolinFury ? 0.7 : 1)), fighter);
}

function updateShaolin(fighter) {
  if (!fighter.shaolinPalms) resetShaolin(fighter);
  tickCooldowns(fighter, ['shaolinPalmCooldown', 'shaolinCraneCooldown', 'shaolinStanceCooldown', 'shaolinFistsCooldown', 'shaolinCounterFlash']);
  if (fighter.shaolinShout) {
    fighter.shaolinShout.life -= 1;
    if (fighter.shaolinShout.life <= 0) fighter.shaolinShout = null;
  }
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  // below 40%: his chi burns hotter
  if (!fighter.shaolinFury && fighter.health <= fighter.maxHealth * 0.4) {
    fighter.shaolinFury = true;
    shaolinShout(fighter, '气功！(Chi Kung!)');
    playSound('judgeOverdrive');
  }
  // the chi palm: a moment of focus, then a wave of chi
  if (fighter.shaolinPalmTimer > 0) {
    fighter.shaolinPalmTimer -= 1;
    fighter.velocity.x = 0;
    fighter.attacksToTheRight = direction > 0;
    if (fighter.shaolinPalmTimer === 0) {
      fighter.shaolinPalms.push({ x: direction > 0 ? fighter.position.x + fighter.width : fighter.position.x - 40, y: fighter.position.y + 40, vx: direction * 9, life: 120 });
      playSound('judgeLight');
    }
  }
  fighter.shaolinPalms.forEach((palm) => {
    palm.x += palm.vx;
    palm.life -= 1;
    const area = { x: palm.x, y: palm.y, width: 40, height: 44 };
    if (rectangularCollision({ rectangle1: area, rectangle2: target })) {
      palm.life = 0;
      if (!handleCopycatShieldHit(target, fighter)) {
        applyDamage(fighter, target, 14, { isSpecial: true });
        target.velocity.x = getDebugKnockback(Math.sign(palm.vx) * 9, target);
        target.velocity.y = getDebugKnockback(-5, target);
        playSound('robotHit');
      }
    }
  });
  fighter.shaolinPalms = fighter.shaolinPalms.filter((palm) => palm.life > 0 && palm.x > -60 && palm.x < canvas.width + 60);
  // the crane kick: a spinning leap, up to three hits
  if (fighter.shaolinCraneTimer > 0) {
    fighter.shaolinCraneTimer -= 1;
    fighter.velocity.x = fighter.shaolinCraneDir * 6.5;
    const elapsed = 48 - fighter.shaolinCraneTimer;
    if (elapsed % 12 === 6) {
      const area = { x: fighter.position.x - 30, y: fighter.position.y + 50, width: fighter.width + 60, height: 80 };
      knightHit(fighter, target, area, 6, fighter.shaolinCraneDir * 6, -6);
    }
  }
  // the iron mountain stance: planted, waiting for a hit to counter
  if (fighter.shaolinStanceTimer > 0) {
    fighter.shaolinStanceTimer -= 1;
    fighter.velocity.x = 0;
    fighter.attacksToTheRight = direction > 0;
  }
  // a hundred fists
  if (fighter.shaolinFistsTimer > 0) {
    fighter.shaolinFistsTimer -= 1;
    const gap = Math.abs(getFighterCenterX(target) - getFighterCenterX(fighter));
    fighter.velocity.x = gap > 90 ? direction * 5 : 0;
    fighter.attacksToTheRight = direction > 0;
    if (fighter.shaolinFistsTimer % 6 === 0) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width - 10 : fighter.position.x - 80, y: fighter.position.y + 30, width: 90, height: 50 };
      knightHit(fighter, target, area, 2.5, direction * 1.5, -1);
    }
  }
}

function isShaolinBusy(fighter) {
  return fighter.shaolinPalmTimer > 0 || fighter.shaolinCraneTimer > 0 || fighter.shaolinStanceTimer > 0 || fighter.shaolinFistsTimer > 0;
}

function castShaolinPalm(fighter) {
  if (fighter.shaolinPalmCooldown > 0 || isShaolinBusy(fighter)) return false;
  fighter.shaolinPalmTimer = 22;
  fighter.shaolinPalmCooldown = getShaolinCooldown(fighter, 150);
  shaolinShout(fighter, '气掌！(Palma de chi!)');
  recordSpecialUsed(fighter);
  return true;
}

function castShaolinCrane(fighter, target) {
  if (fighter.shaolinCraneCooldown > 0 || isShaolinBusy(fighter) || fighter.velocity.y !== 0) return false;
  fighter.shaolinCraneTimer = 48;
  fighter.shaolinCraneDir = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.velocity.y = getDebugJumpSpeed(-14, fighter);
  fighter.shaolinCraneCooldown = getShaolinCooldown(fighter, 230);
  shaolinShout(fighter, '鹤踢！(Patada de la grulla!)');
  playSound('omegaKickLaunch');
  recordSpecialUsed(fighter);
  return true;
}

function castShaolinStance(fighter) {
  if (fighter.shaolinStanceCooldown > 0 || isShaolinBusy(fighter)) return false;
  fighter.shaolinStanceTimer = 55;
  fighter.shaolinStanceCooldown = getShaolinCooldown(fighter, 300);
  shaolinShout(fighter, '铁山！(Montaña de hierro!)');
  playSound('judgeLight');
  recordSpecialUsed(fighter);
  return true;
}

function castShaolinFists(fighter) {
  if (fighter.shaolinFistsCooldown > 0 || isShaolinBusy(fighter)) return false;
  fighter.shaolinFistsTimer = 60;
  fighter.shaolinFistsCooldown = getShaolinCooldown(fighter, 260);
  shaolinShout(fighter, '百拳！(Cien puños!)');
  recordSpecialUsed(fighter);
  return true;
}

// the stance: a hit that lands on him is turned back on the attacker
function tryShaolinCounter(target, attacker) {
  if (!target || !(target.shaolinStanceTimer > 0) || !attacker || attacker === target) return false;
  target.shaolinStanceTimer = 0;
  target.shaolinCounterFlash = 20;
  shaolinShout(target, '反击！(Contraataque!)');
  const direction = getFighterCenterX(attacker) >= getFighterCenterX(target) ? 1 : -1;
  applyDamage(target, attacker, 16, { isSpecial: true });
  attacker.velocity.x = getDebugKnockback(direction * 12, attacker);
  attacker.velocity.y = getDebugKnockback(-8, attacker);
  playSound('judgeParry');
  return true;
}

function drawShaolinFx() {
  [player1, player2].forEach((fighter) => {
    if (fighter.secretVariant !== 'shaolinMaster' || !fighter.shaolinPalms) return;
    const time = performance.now() / 1000;
    ctx.save();
    fighter.shaolinPalms.forEach((palm) => {
      const centerX = palm.x + 20;
      const centerY = palm.y + 22;
      const glow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 34);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      glow.addColorStop(0.4, 'rgba(255, 202, 40, 0.8)');
      glow.addColorStop(1, 'rgba(79, 195, 247, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(centerX - 36, centerY - 36, 72, 72);
      // a palm print of chi
      ctx.fillStyle = 'rgba(255, 248, 225, 0.9)';
      ctx.fillRect(centerX - 8, centerY - 4, 16, 16);
      for (let finger = 0; finger < 4; finger += 1) ctx.fillRect(centerX - 8 + finger * 4, centerY - 16 + Math.abs(finger - 1.5) * 2, 3, 12);
      ctx.fillStyle = 'rgba(79, 195, 247, 0.5)';
      ctx.fillRect(centerX - Math.sign(palm.vx) * 40, centerY - 2, Math.sign(palm.vx) * 26, 4);
    });
    if (fighter.shaolinStanceTimer > 0 || fighter.shaolinCounterFlash > 0) {
      const flash = fighter.shaolinCounterFlash > 0;
      ctx.strokeStyle = flash ? `rgba(255, 255, 255, ${fighter.shaolinCounterFlash / 20})` : `rgba(255, 202, 40, ${0.6 + Math.sin(time * 12) * 0.3})`;
      ctx.lineWidth = flash ? 6 : 3;
      ctx.beginPath();
      ctx.ellipse(getFighterCenterX(fighter), fighter.position.y + fighter.height / 2, 52 + (flash ? (20 - fighter.shaolinCounterFlash) * 3 : 0), 78, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fighter.shaolinCraneTimer > 0) {
      // a whirlwind of kicks: spinning arcs and white feathers
      const cx = getFighterCenterX(fighter);
      const cy = fighter.position.y + fighter.height - 30;
      for (let arc = 0; arc < 3; arc += 1) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 - arc * 0.2})`;
        ctx.lineWidth = 6 - arc * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 46 + arc * 12, time * 16 + arc, time * 16 + arc + Math.PI * 1.3);
        ctx.stroke();
      }
      for (let feather = 0; feather < 5; feather += 1) {
        const angle = time * 9 + feather * 1.3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * 60, cy + Math.sin(angle) * 30, 7, 3, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (fighter.shaolinFistsTimer > 0) {
      const direction = fighter.attacksToTheRight ? 1 : -1;
      for (let fist = 0; fist < 6; fist += 1) {
        const reach = 30 + Math.random() * 60;
        ctx.fillStyle = `rgba(255, 224, 178, ${0.4 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(getFighterCenterX(fighter) + direction * reach, fighter.position.y + 40 + Math.random() * 40, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (fighter.shaolinShout) {
      ctx.globalAlpha = Math.min(1, fighter.shaolinShout.life / 20);
      ctx.font = '900 15px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3e2723';
      ctx.fillStyle = '#ffca28';
      const half = ctx.measureText(fighter.shaolinShout.text).width / 2;
      const x = Math.max(half + 8, Math.min(canvas.width - half - 8, getFighterCenterX(fighter)));
      const y = fighter.position.y - 18 - (80 - fighter.shaolinShout.life) * 0.2;
      ctx.strokeText(fighter.shaolinShout.text, x, y);
      ctx.fillText(fighter.shaolinShout.text, x, y);
    }
    ctx.restore();
  });
}

// Shang Ting played by a person: Q chi palm, F crane kick, R iron mountain, Q+F together: a hundred fists (secret)
function handleShaolinKey(fighter, target, slot, held) {
  if (fighter.secretVariant !== 'shaolinMaster') return false;
  if (!fighter.shaolinPalms) resetShaolin(fighter);
  if (!canFighterAct(fighter)) return true;
  if ((slot === 0 && held[1]) || (slot === 1 && held[0])) {
    // the second key of the pair cancels the move the first one just started
    if (fighter.shaolinPalmTimer > 0) {
      fighter.shaolinPalmTimer = 0;
      fighter.shaolinPalmCooldown = 0;
    }
    if (fighter.shaolinCraneTimer > 0) {
      fighter.shaolinCraneTimer = 0;
      fighter.shaolinCraneCooldown = 0;
    }
    castShaolinFists(fighter);
    return true;
  }
  if (slot === 0) castShaolinPalm(fighter);
  else if (slot === 1) castShaolinCrane(fighter, target);
  else castShaolinStance(fighter);
  return true;
}

function isShaolinUnlocked() {
  try {
    return localStorage.getItem(shaolinUnlockStorageKey) === '1';
  } catch (error) {
    return false;
  }
}

function syncShaolinUnlockUI() {
  if (!shaolinCharacterButton) return;
  shaolinCharacterButton.classList.toggle('hidden', !isShaolinUnlocked());
  shaolinCharacterButton.disabled = normalArcadeActive;
  shaolinCharacterButton.classList.toggle('arcade-disabled', normalArcadeActive);
}

// the run's lives on screen
function drawHardcoreHud() {
  if (!hardcoreRun.active || !normalArcadeActive || gameOver) return;
  const harder = hardcoreRun.mode === 'harder';
  const maxLives = harder ? 1 : 3;
  const hearts = Array.from({ length: maxLives }, (_, index) => (index < hardcoreRun.lives ? '♥' : '♡')).join(' ');
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '900 14px Courier New, monospace';
  const label = `${harder ? 'HARDERCORE' : 'HARDCORE'}  ${hearts}  NIVEL ${selectedNormalArcadeLevel}/${getChapterFinalLevel(hardcoreRun.chapter)}`;
  const width = ctx.measureText(label).width + 24;
  ctx.fillStyle = 'rgba(20, 0, 0, 0.75)';
  ctx.fillRect(canvas.width / 2 - width / 2, 74, width, 24);
  ctx.strokeStyle = harder ? '#ff1744' : '#ff9100';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - width / 2, 74, width, 24);
  ctx.fillStyle = harder ? '#ff8a80' : '#ffd180';
  ctx.fillText(label, canvas.width / 2, 91);
  ctx.restore();
}

// ---------- MAGICTOWN: the people of chapter 5, playable ----------
function unlockMagicTownCode() {
  magicTownCodeActive = true;
  magicTownCharacterButtons.forEach((button) => button.classList.remove('hidden'));
  magicTownMapButtons.forEach((button) => button.classList.remove('hidden'));
  buildMagicTownPreviews();
  showCustomToast('MAGICTOWN ACTIVADO', 'Los habitantes de Robledal (y algunos que no son tan amables) ya se pueden elegir, junto con sus mapas. Q, F y R para sus habilidades.');
  playSound('achievement');
}

function lockMagicTownCode() {
  magicTownCodeActive = false;
  magicTownCharacterButtons.forEach((button) => button.classList.add('hidden'));
  magicTownMapButtons.forEach((button) => button.classList.add('hidden'));
  const mapIds = Array.from(magicTownMapButtons).map((button) => button.dataset.map);
  if (!normalArcadeActive && mapIds.includes(selectedMap)) selectedMap = 'foundry';
}

// each fight starts with their state ready and the cooldowns empty (when a person plays them)
function prepareMagicTownFighter(fighter) {
  const variant = fighter.secretVariant;
  if (!magicTownVariants.includes(variant)) return;
  if (variant === 'celesteGirl' || variant === 'setoBoy') resetRobledalKid(fighter);
  if (variant === 'mochiMouse') resetMochi(fighter);
  if (variant === 'chefBoss') resetChefBoss(fighter);
  if (variant === 'lanternGuard') resetLanternGuard(fighter);
  if (variant === 'darkKnight' || variant === 'darkKnightBoss') resetKnightState(fighter);
  if (fighter === player2 && botEnabled) return;
  // a regular dark knight is a weak minion in the arcade: a bit sturdier when you play him
  if (variant === 'darkKnight') {
    fighter.setMaxHealth(120);
    fighter.health = fighter.maxHealth;
  }
  Object.keys(fighter).forEach((key) => {
    if (/Cooldown$/.test(key) && typeof fighter[key] === 'number' && /^(celeste|seto|mochi|chef|guard|knight|moss)/.test(key)) fighter[key] = 0;
  });
}

function handleMagicTownKey(fighter, target, slot) {
  const variant = fighter.secretVariant;
  if (!magicTownVariants.includes(variant) || variant === 'darkKnight' || variant === 'darkKnightBoss') return false;
  if (!canFighterAct(fighter)) return true;
  if (variant === 'mossBeast') {
    if (!(fighter.mossRootCooldown > 0)) castMossRoots(fighter, target);
  } else if (variant === 'celesteGirl') {
    if (slot === 0 && !(fighter.celesteThrowCooldown > 0)) castCelesteThrow(fighter, target);
    if (slot === 1 && !(fighter.celesteBlinkCooldown > 0)) castCelesteBlink(fighter);
    if (slot === 2 && !(fighter.celesteRainCooldown > 0)) castCelesteRain(fighter, target);
  } else if (variant === 'setoBoy') {
    if (slot === 0 && !(fighter.setoTopCooldown > 0)) castSetoTop(fighter, target);
    if (slot === 1 && !(fighter.setoBalloonCooldown > 0)) castSetoBalloon(fighter, target);
    if (slot === 2 && !(fighter.setoBoxCooldown > 0)) castSetoBox(fighter, target);
  } else if (variant === 'mochiMouse') {
    if (slot === 0 && !(fighter.mochiFlurryCooldown > 0)) castMochiFlurry(fighter);
    if (slot === 1 && !(fighter.mochiUppercutCooldown > 0)) castMochiUppercut(fighter);
    if (slot === 2 && !(fighter.mochiCakeCooldown > 0)) castMochiCake(fighter);
  } else if (variant === 'chefBoss') {
    if (slot === 0 && !(fighter.chefPinCooldown > 0)) castChefPin(fighter, target);
    if (slot === 1 && !(fighter.chefPotCooldown > 0)) castChefPot(fighter, target);
    if (slot === 2 && !(fighter.chefRainCooldown > 0)) castChefRain(fighter, target);
  } else if (variant === 'lanternGuard') {
    if (slot === 0 && !(fighter.guardThrustCooldown > 0)) castGuardThrust(fighter);
    if (slot === 1 && !(fighter.guardSweepCooldown > 0)) castGuardSweep(fighter);
    if (slot === 2 && !(fighter.guardFlashCooldown > 0)) castGuardFlash(fighter, target);
  }
  return true;
}

// the roster and map previews of MAGICTOWN are rendered from the real game drawings
// (drawn on the game canvas for a moment, copied into small images, and the canvas is put back)
let magicTownPreviewsBuilt = false;

function buildMagicTownPreviews() {
  if (magicTownPreviewsBuilt) return;
  magicTownPreviewsBuilt = true;
  const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const savedMap = selectedMap;
  const thumb = document.createElement('canvas');
  const thumbCtx = thumb.getContext('2d');
  // maps: the lower part of the stage, where the fight happens
  thumb.width = 360;
  thumb.height = 140;
  magicTownMapButtons.forEach((button) => {
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
  // fighters: each one drawn alone, facing right, on a transparent background
  thumb.width = 140;
  thumb.height = 168;
  magicTownCharacterButtons.forEach((button) => {
    try {
      const variant = button.dataset.magicVariant;
      const actor = new Fighter({ x: 0, y: 0, color: '#9e9e9e', attacksToTheRight: true });
      actor.setCharacterType('normal', variant);
      if (variant === 'celesteGirl' || variant === 'setoBoy') resetRobledalKid(actor);
      if (variant === 'mochiMouse') resetMochi(actor);
      if (variant === 'chefBoss') resetChefBoss(actor);
      if (variant === 'lanternGuard') resetLanternGuard(actor);
      if (variant === 'darkKnight' || variant === 'darkKnightBoss') resetKnightState(actor);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      actor.position = { x: 400, y: 300 - actor.height };
      actor.attacksToTheRight = true;
      actor.isAttacking = false;
      actor.draw();
      ctx.restore();
      // a box around the fighter, keeping its proportions
      const boxHeight = Math.max(actor.height + 36, 110);
      const boxWidth = boxHeight * (thumb.width / thumb.height);
      const centerX = 400 + actor.width / 2;
      thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
      thumbCtx.drawImage(canvas, centerX - boxWidth / 2, 304 - boxHeight, boxWidth, boxHeight, 0, 0, thumb.width, thumb.height);
      const preview = button.querySelector('.character-preview');
      preview.style.backgroundImage = `url(${thumb.toDataURL()})`;
      preview.classList.add('rendered-preview');
    } catch (error) {
      // keep the simple preview
    }
  });
  ctx.putImageData(saved, 0, 0);
}
