// Moquete - Clase Fighter: dibujo, movimiento y estado de cada luchador
// (parte 5 de 10; los archivos se cargan en orden desde index.html)

class Fighter {
  constructor({ x, y, color, attacksToTheRight }) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = 60;
    this.height = 120;
    this.moveSpeed = playerMoveSpeed;
    this.color = color;
    this.attackColor = hexToRgba(color, 0.65);
    this.baseColor = color;
    this.characterType = 'normal';
    this.secretVariant = null;
    this.damageMultiplier = 1;
    this.specialCooldown = 0;
    this.fireBeamCooldown = 0;
    this.superFireKamehamehaCharging = false;
    this.lightWarriorBeamCharging = false;
    this.lightWarriorOmegaTransformed = false;
    this.lightWarriorOmegaStateTimer = 0;
    this.lightWarriorOmegaFlightUsesRemaining = lightWarriorOmegaFlightUsesMax;
    this.lightWarriorOmegaFlightChargeAvailable = true;
    this.lightWarriorOmegaFlightCharging = false;
    this.lightWarriorOmegaFlightChargeTimer = 0;
    this.lightWarriorOmegaFlightTraveling = false;
    this.lightWarriorOmegaFlightTimer = 0;
    this.lightWarriorOmegaFlightDirection = 1;
    this.tankAttackCooldown = 0;
    this.tankShellCooldown = 0;
    this.arcadeBossShockwaveCooldown = 0;
    this.cowboyBurstCooldown = 0;
    this.kaiokenCooldown = 0;
    this.kaiokenComboCooldown = 0;
    this.kaiokenComboHitsRemaining = 0;
    this.kaiokenComboTimer = 0;
    this.kaiokenComboVisualTimer = 0;
    this.kaiokenTimer = 0;
    this.kaiokenBaseMaxHealth = 100;
    this.sorcererOrbCooldown = 0;
    this.sorcererGravityCooldown = 0;
    this.sorcererSecretOrbCooldown = 0;
    this.chronoBladeCooldown = 0;
    this.chronoSlowCooldown = 0;
    this.chronoSlowTimer = 0;
    this.icedThugBladeCooldown = 0;
    this.icedThugFrostFieldCooldown = 0;
    this.monkeyBananaCooldown = 0;
    this.monkeyPeelCooldown = 0;
    this.monkeyCoconutCooldown = 0;
    this.hybridAbilityCooldown = 0;
    this.hybridAbilityIndex = 0;
    this.scammerOfferCooldown = 0;
    this.scammerItemCooldown = 0;
    this.scammerSlotCooldown = 0;
    this.scamWeakTimer = 0;
    this.scamVulnerableTimer = 0;
    this.scamLabelTimer = 0;
    this.scamLabel = '';
    this.jesterSuitCooldown = 0;
    this.jesterChaosCooldown = 0;
    this.jesterScytheCooldown = 0;
    this.jesterChaosTeleports = 0;
    this.jesterRingCooldown = 0;
    this.jesterStormCooldown = 0;
    this.jesterSecretTier = 0;
    this.jesterUnlockTimer = 0;
    this.jesterUnlockText = '';
    this.jesterRingHitTimer = 0;
    this.jesterStormHitTimer = 0;
    this.jesterFinalActUsed = false;
    this.jesterTiredShown = false;
    this.jesterChaosTimer = 0;
    this.icedSlowTimer = 0;
    this.icedVulnerableTimer = 0;
    this.chronoMarkTimer = 0;
    this.chronoMarkedBy = null;
    this.chronoTimeStopCooldown = 0;
    this.chronoTimeStopTimer = 0;
    this.ghostPhaseCooldown = 0;
    this.ghostPhaseTimer = 0;
    this.ghostPhaseContactTimer = 0;
    this.lightWarriorBurstCooldown = 0;
    this.lightWarriorBurstShotsRemaining = 0;
    this.lightWarriorBurstTimer = 0;
    this.lightWarriorSpeedCooldown = 0;
    this.lightWarriorSpeedTimer = 0;
    this.lightWarriorSolarFlashCooldown = 0;
    this.lightWarriorSolarFlashTimer = 0;
    this.lightWarriorRadiantPunchCooldown = 0;
    this.lightWarriorOmegaFlightUsesRemaining = lightWarriorOmegaFlightUsesMax;
    this.lightWarriorOmegaFlightChargeAvailable = true;
    this.lightWarriorOmegaFlightCharging = false;
    this.lightWarriorOmegaFlightChargeTimer = 0;
    this.lightWarriorOmegaFlightTraveling = false;
    this.lightWarriorOmegaFlightTimer = 0;
    this.lightWarriorOmegaFlightDirection = 1;
    this.lightWarriorBeamCharging = false;
    this.lightWarriorRadiantPunchChargeTimer = 0;
    this.lightWarriorRadiantPunchReadyTimer = 0;
    this.lightWarriorRadiantPunchDamage = 0;
    this.lightWarriorRadiantPunchCharging = false;
    this.lightWarriorRadiantPunchAttackActive = false;
    this.divineAdaptCooldown = 0;
    this.divineAdaptTimer = 0;
    this.divineAdaptations = {};
    this.divineCounterCooldown = 0;
    this.divineWorldCutCooldown = 0;
    this.divineWorldCutCharging = false;
    this.cowboyBurstShotsRemaining = 0;
    this.cowboyBurstTimer = 0;
    this.copycatShieldCooldown = 0;
    this.copycatShieldTimer = 0;
    this.gamblerRollCooldown = 0;
    this.gamblerLuckCooldown = 0;
    this.gamblerLuckBonus = 0;
    this.gamblerLuckWaveTimer = 0;
    this.gamblerRollTimer = 0;
    this.gamblerRollNumbers = [];
    this.gamblerDamageBoost = 0;
    this.gamblerDamageBoostTimer = 0;
    this.gamblerSpeedBoost = 0;
    this.gamblerSpeedBoostTimer = 0;
    this.gamblerStunTimer = 0;
    this.gamblerInvincibleTimer = 0;
    this.terrainEffectCooldown = 0;
    this.switcherModeIndex = 0;
    this.switcherAbilityCooldown = 0;
    this.switcherModeCooldown = 0;
    this.switcherArmorTimer = 0;
    this.switcherRedStrikeTimer = 0;
    this.switcherRedStrikeArea = null;
    this.switcherDashTimer = 0;
    this.switcherDashDirection = 1;
    this.target = null;
    this.baseMaxHealth = 100;
    this.maxHealth = 100;
    this.health = 100;
    this.isAttacking = false;
    this.basicAttackCooldown = 0;
    this.currentAttackDamage = attackDamage;
    this.basicAttackCooldown = 0;
    this.strongAttackCooldown = 0;
    this.attacksToTheRight = attacksToTheRight;
    this.attackDuration = 12;
    this.attackTimer = 0;
    this.attackBox = {
      offset: { x: attacksToTheRight ? this.width : -70, y: 20 },
      width: 70,
      height: 30,
    };
  }

  get attackArea() {
    const target = this.target;
    const targetCenterX = target ? target.position.x + target.width / 2 : null;
    const targetCenterY = target ? target.position.y + target.height / 2 : null;
    const fighterCenterX = this.position.x + this.width / 2;
    const attackXOffset =
      targetCenterX === null
        ? this.attackBox.offset.x
        : targetCenterX >= fighterCenterX
          ? this.width
          : -this.attackBox.width;
    const attackY =
      targetCenterY === null
        ? this.position.y + this.attackBox.offset.y
        : targetCenterY - this.attackBox.height / 2;

    return {
      x: this.position.x + attackXOffset,
      y: attackY,
      width: this.attackBox.width,
      height: this.attackBox.height,
    };
  }

  draw() {
    if (blindMode) {
      this.drawBlindDetails();
      return;
    }

    if (this.secretVariant === 'neoScammer') {
      this.drawNeoScammer();
      return;
    }

    if (this.secretVariant === 'knight' || this.secretVariant === 'darkKnight' || this.secretVariant === 'darkKnightBoss') {
      this.drawKnight();
      return;
    }

    if (this.secretVariant === 'mossBeast') {
      this.drawMossBeast();
      return;
    }

    if (this.secretVariant === 'celesteGirl') {
      this.drawCeleste();
      return;
    }

    if (this.secretVariant === 'setoBoy') {
      this.drawSeto();
      return;
    }

    if (this.secretVariant === 'mochiMouse') {
      this.drawMochi();
      return;
    }

    if (this.secretVariant === 'chefBoss') {
      this.drawChefBoss();
      return;
    }

    if (this.secretVariant === 'lanternGuard') {
      this.drawLanternGuard();
      return;
    }

    if (this.secretVariant === 'shaolinMaster') {
      this.drawShaolinMaster();
      return;
    }

    const factoryRobot = hybridEnemyTypes[this.secretVariant] && hybridEnemyTypes[this.secretVariant].robot;
    if (this.characterType === 'tank') {
      this.drawTankDetails();
    } else if (!factoryRobot) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    if (this.characterType === 'normal' && !factoryRobot) {
      this.drawNormalDetails();
    }

    if (this.characterType === 'lightWarrior') {
      this.drawLightWarriorDetails();
    }

    if (this.characterType === 'fireMaster') {
      this.drawFireMasterDetails();
    }

    if (this.characterType === 'normal' && this.kaiokenTimer > 0) {
      this.drawKaiokenAura();
    }

    if (this.characterType === 'cowboy') {
      this.drawCowboyDetails();
    }

    if (this.characterType === 'reflecter') {
      this.drawReflecterDetails();
    }

    if (this.characterType === 'switcher') {
      this.drawSwitcherDetails();
    }

    if (this.characterType === 'sorcerer') {
      this.drawSorcererDetails();
    }

    if (this.characterType === 'gambler') {
      this.drawGamblerDetails();
    }

    if (this.characterType === 'chrono') {
      this.drawChronoDetails();
    }

    if (this.characterType === 'ghost') {
      this.drawGhostDetails();
    }

    if (this.characterType === 'monkey') {
      this.drawMonkeyDetails();
    }

    if (isHybridEnemy(this)) {
      this.drawHybridOverlay();
    }

    if (this.characterType === 'divineGeneral') {
      this.drawDivineGeneralDetails();
    }

    if (this.characterType !== 'gambler' && this.gamblerInvincibleTimer > 0) {
      this.drawJackpotAura();
    }

    if (this.copycatShieldTimer > 0) {
      this.drawReflecterShield();
    }

    if (this === player1 && isShopExtraOn('plasticCrown')) {
      this.drawShopCrown();
    }

    if (this.icedSlowTimer > 0 || this.icedVulnerableTimer > 0) {
      this.drawFrostbiteOverlay();
    }

    if (this.scamWeakTimer > 0 || this.scamVulnerableTimer > 0) {
      ctx.strokeStyle = 'rgba(244, 143, 177, 0.85)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(this.position.x - 4, this.position.y - 4, this.width + 8, this.height + 8);
      ctx.setLineDash([]);
      ctx.fillStyle = '#f48fb1';
      ctx.font = '900 12px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', this.position.x - 8, this.position.y + 16);
      ctx.fillText('$', this.position.x + this.width + 8, this.position.y + 16);
    }

    if (this.scamLabelTimer > 0) {
      const rise = (80 - this.scamLabelTimer) * 0.4;
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.scamLabelTimer / 20);
      ctx.fillStyle = 'rgba(17, 17, 17, 0.8)';
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      const labelWidth = ctx.measureText(this.scamLabel).width + 12;
      ctx.fillRect(this.position.x + this.width / 2 - labelWidth / 2, this.position.y - 62 - rise, labelWidth, 18);
      ctx.fillStyle = '#f48fb1';
      ctx.fillText(this.scamLabel, this.position.x + this.width / 2, this.position.y - 49 - rise);
      ctx.restore();
    }

    if (this.isAttacking) {
      const attack = this.attackArea;
      ctx.fillStyle = this.lightWarriorRadiantPunchAttackActive ? 'rgba(255, 255, 255, 0.9)' : this.attackColor;
      ctx.fillRect(attack.x, attack.y, attack.width, attack.height);
    }

    if (this.gamblerRollTimer > 0) {
      this.drawGamblerRoll();
    }
  }

  drawBlindDetails() {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      const attack = this.attackArea;
      ctx.fillStyle = 'rgba(245, 245, 245, 0.62)';
      ctx.fillRect(attack.x, attack.y, attack.width, attack.height);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.strokeRect(attack.x, attack.y, attack.width, attack.height);
    }
  }

  drawNormalDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const kaiokenActive = isNormalKaioken(this) && this.kaiokenTimer > 0;

    if (this.arcadeBossVariant) {
      ctx.fillStyle = '#f48fb1';
      ctx.fillRect(x + this.width * 0.2, y + this.height * 0.16, this.width * 0.14, this.height * 0.06);
      ctx.fillRect(x + this.width * 0.66, y + this.height * 0.16, this.width * 0.14, this.height * 0.06);
      ctx.fillStyle = '#111';
      ctx.fillRect(x + this.width * 0.18, y + this.height * 0.32, this.width * 0.64, this.height * 0.07);
      ctx.fillRect(x + this.width * 0.46, y + this.height * 0.2, this.width * 0.08, this.height * 0.2);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, this.width, this.height);
      return;
    }

    if (this.secretVariant === 'iceBrute') {
      this.drawIceBruteDetails();
      return;
    }

    if (this.secretVariant === 'icedThug') {
      this.drawIcedThugDetails();
      return;
    }

    ctx.fillStyle = kaiokenActive ? '#1a1a1a' : '#111';
    ctx.fillRect(x + 8, y + 22, this.width - 16, 10);
    ctx.fillStyle = kaiokenActive ? '#0d47a1' : '#fdd835';
    ctx.fillRect(x + 16, y + 36, this.width - 32, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 18, y + 18, 7, 6);
    ctx.fillRect(x + this.width - 25, y + 18, 7, 6);

    if (!kaiokenActive) return;

    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(x + 10, y + 46, this.width - 20, 14);
    ctx.fillStyle = '#fb8c00';
    ctx.fillRect(x + 6, y + 56, this.width - 12, 38);
    ctx.fillStyle = '#ef6c00';
    ctx.fillRect(x + 9, y + 62, 10, 28);
    ctx.fillRect(x + this.width - 19, y + 62, 10, 28);
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(x + 8, y + 76, this.width - 16, 8);
    ctx.fillRect(x + 12, y + 98, 14, 22);
    ctx.fillRect(x + this.width - 26, y + 98, 14, 22);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 6, y + 56, this.width - 12, 38);
    ctx.strokeRect(x + 8, y + 76, this.width - 16, 8);

    ctx.fillStyle = 'rgba(255, 23, 68, 0.78)';
    ctx.fillRect(x + 24, y + 58, 5, 30);
    ctx.fillRect(x + this.width - 29, y + 58, 5, 30);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 40);
    ctx.lineTo(x + 16, y + 28);
    ctx.moveTo(x + this.width - 2, y + 42);
    ctx.lineTo(x + this.width - 16, y + 28);
    ctx.stroke();
  }

  drawIceBruteDetails() {
    const x = this.position.x;
    const y = this.position.y;

    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 3, y + 6, this.width - 6, this.height - 6);

    ctx.fillStyle = '#8a5738';
    ctx.fillRect(x + 6, y + 46, this.width - 12, 42);
    ctx.fillStyle = '#6f432c';
    ctx.fillRect(x + 9, y + 86, 18, 34);
    ctx.fillRect(x + this.width - 27, y + 86, 18, 34);
    ctx.fillStyle = '#2b1912';
    ctx.fillRect(x + 7, y + 112, 22, 8);
    ctx.fillRect(x + this.width - 29, y + 112, 22, 8);

    ctx.fillStyle = '#f2fbff';
    ctx.fillRect(x + 7, y + 12, this.width - 14, 43);
    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 7, y + 12, this.width - 14, 43);

    ctx.fillStyle = '#293fc2';
    ctx.fillRect(x + 15, y + 24, this.width - 30, 30);
    ctx.fillStyle = '#1b2f98';
    ctx.fillRect(x + 18, y + 30, this.width - 36, 24);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 9, y + 49, this.width - 18, 8);
    ctx.fillRect(x + 11, y + 39, 7, 11);
    ctx.fillRect(x + this.width - 18, y + 39, 7, 11);

    ctx.fillStyle = '#050505';
    ctx.fillRect(x + 20, y + 31, 7, 5);
    ctx.fillRect(x + this.width - 27, y + 31, 7, 5);
    ctx.fillRect(x + 25, y + 44, this.width - 50, 4);

    ctx.fillStyle = '#5a3322';
    ctx.fillRect(x + 1, y + 56, 12, 30);
    ctx.fillRect(x + this.width - 13, y + 56, 12, 30);
    ctx.fillRect(x + 18, y + 64, 9, 24);
    ctx.fillRect(x + this.width - 27, y + 64, 9, 24);
    ctx.fillStyle = '#26140e';
    ctx.fillRect(x + 21, y + 68, 4, 17);
    ctx.fillRect(x + this.width - 25, y + 68, 4, 17);
  }

  drawFrostbiteOverlay() {
    const x = this.position.x;
    const y = this.position.y;
    ctx.fillStyle = this.icedVulnerableTimer > 0 ? 'rgba(160, 236, 255, 0.28)' : 'rgba(160, 236, 255, 0.16)';
    ctx.fillRect(x, y, this.width, this.height);
    ctx.strokeStyle = 'rgba(224, 252, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 4, y - 4, this.width + 8, this.height + 8);
    ctx.fillStyle = '#e0fcff';
    [[0.2, 0.18], [0.72, 0.34], [0.35, 0.62], [0.8, 0.82]].forEach(([offsetX, offsetY]) => {
      const crystalX = x + this.width * offsetX;
      const crystalY = y + this.height * offsetY;
      ctx.beginPath();
      ctx.moveTo(crystalX, crystalY - 6);
      ctx.lineTo(crystalX + 4, crystalY);
      ctx.lineTo(crystalX, crystalY + 6);
      ctx.lineTo(crystalX - 4, crystalY);
      ctx.closePath();
      ctx.fill();
    });
    if (this.icedVulnerableTimer > 0) {
      ctx.fillStyle = '#e0fcff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('+25%', x + this.width / 2, y - 10);
    }
  }

  drawIcedThugDetails() {
    const x = this.position.x;
    const y = this.position.y;

    ctx.fillStyle = '#77dcf2';
    ctx.fillRect(x + 4, y + 4, this.width - 8, this.height - 8);
    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 4, y + 4, this.width - 8, this.height - 8);

    ctx.fillStyle = 'rgba(189, 247, 255, 0.74)';
    ctx.fillRect(x + 12, y + 10, this.width - 24, 20);
    ctx.fillStyle = 'rgba(50, 168, 195, 0.24)';
    ctx.fillRect(x + 18, y + 48, 10, 8);
    ctx.fillRect(x + 34, y + 64, 14, 10);
    ctx.fillRect(x + 20, y + 90, 18, 11);
    ctx.fillRect(x + 44, y + 36, 9, 9);

    ctx.fillStyle = 'rgba(224, 252, 255, 0.78)';
    ctx.beginPath();
    ctx.ellipse(x + this.width * 0.58, y + this.height * 0.42, 17, 25, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(134, 224, 244, 0.86)';
    ctx.beginPath();
    ctx.ellipse(x + this.width * 0.55, y + this.height * 0.43, 9, 17, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 26);
    ctx.lineTo(x + 15, y + 34);
    ctx.lineTo(x + 25, y + 24);
    ctx.lineTo(x + 34, y + 28);
    ctx.lineTo(x + 43, y + 16);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 6, y + 72);
    ctx.lineTo(x + 18, y + 84);
    ctx.lineTo(x + 24, y + 104);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + this.width - 5, y + 66);
    ctx.lineTo(x + this.width - 18, y + 66);
    ctx.lineTo(x + this.width - 24, y + 78);
    ctx.lineTo(x + this.width - 12, y + 84);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 10, y + this.height - 30);
    ctx.lineTo(x + 8, y + this.height - 12);
    ctx.lineTo(x + 18, y + this.height - 24);
    ctx.stroke();
  }

  // Shang Ting: the same block silhouette as everyone, in red monk robes, eyes closed and a long mustache
  drawShaolinMaster() {
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const h = this.height;
    const dir = this.attacksToTheRight ? 1 : -1;
    const front = (offset, size = 0) => (dir > 0 ? x + offset : x + w - offset - size);
    const time = performance.now() / 1000;
    ctx.save();
    // the body: a crimson robe
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(x, y, w, h);
    // a dark outline so he stands out from the red temple
    ctx.strokeStyle = '#3e0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    // the face: the top of the block, bald skin
    ctx.fillStyle = '#e0ac7e';
    ctx.fillRect(x, y, w, 38);
    ctx.fillStyle = '#c98f63';
    ctx.fillRect(x, y, w, 4);
    // the topknot on the crown
    ctx.fillStyle = '#212121';
    ctx.fillRect(x + w / 2 - 5, y - 9, 10, 9);
    ctx.fillStyle = '#ffca28';
    ctx.fillRect(x + w / 2 - 6, y - 3, 12, 3);
    // closed eyes: two calm arcs, and thick brows
    ctx.strokeStyle = '#2b1b12';
    ctx.lineWidth = 2;
    [front(30), front(44)].forEach((eyeX) => {
      ctx.beginPath();
      ctx.arc(eyeX + 3, y + 15, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    });
    ctx.fillStyle = '#2b1b12';
    ctx.fillRect(front(28, 10), y + 8, 10, 2);
    ctx.fillRect(front(42, 10), y + 8, 10, 2);
    // the long Chinese mustache, its tips drooping past the chin (swaying a little)
    const sway = Math.sin(time * 2) * 1.5;
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(front(30, 22), y + 24, 22, 3);
    ctx.beginPath();
    ctx.moveTo(front(30, 0), y + 25);
    ctx.lineTo(front(26, 0) + sway, y + 50);
    ctx.lineTo(front(29, 0) + sway, y + 50);
    ctx.lineTo(front(32, 0), y + 27);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(front(50, 0), y + 25);
    ctx.lineTo(front(54, 0) - sway, y + 50);
    ctx.lineTo(front(51, 0) - sway, y + 50);
    ctx.lineTo(front(48, 0), y + 27);
    ctx.closePath();
    ctx.fill();
    // a golden collar crossing over the robe, a dark sash and the sleeve trims
    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 38);
    ctx.lineTo(x + w / 2 + dir * 6, y + 64);
    ctx.lineTo(x + w / 2 + dir * 6, y + 70);
    ctx.lineTo(x + 4, y + 46);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7f0000';
    ctx.fillRect(x, y + 76, w, 8);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x, y + 84, w, 2);
    ctx.fillStyle = '#7f0000';
    ctx.fillRect(x + w / 2 - 2, y + 86, 4, h - 86);
    // the palm forward (further out while attacking)
    const reach = this.isAttacking || this.shaolinPalmTimer > 0 || this.shaolinFistsTimer > 0 ? 22 : 6;
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(dir > 0 ? x + w - 4 : x - reach, y + 46, reach + 4, 12);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(dir > 0 ? x + w + reach - 4 : x - reach, y + 46, 4, 12);
    ctx.fillStyle = '#e0ac7e';
    ctx.fillRect(dir > 0 ? x + w + reach : x - reach - 9, y + 36, 9, 20);
    ctx.restore();
    if (this.isAttacking) {
      ctx.fillStyle = this.attackColor;
      const area = this.attackArea;
      ctx.fillRect(area.x, area.y, area.width, area.height);
    }
  }

  drawLightWarriorDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const boosted = this.lightWarriorSpeedTimer > 0;

    if (this.lightWarriorOmegaTransformed) {
      const omegaPulse = 1 + Math.sin(this.lightWarriorOmegaStateTimer * 0.16) * 0.05;

      ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, y + this.height / 2, 43 * omegaPulse, 76 * omegaPulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, y + this.height / 2, 50 * omegaPulse, 84 * omegaPulse, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 7, y + 34, this.width - 14, 62);
      ctx.fillStyle = '#fffde7';
      ctx.fillRect(x + 13, y + 96, 14, 24);
      ctx.fillRect(x + this.width - 27, y + 96, 14, 24);
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(x + 4, y + 39, 9, 55);
      ctx.fillRect(x + this.width - 13, y + 39, 9, 55);
      ctx.fillRect(x + 8, y + 92, this.width - 16, 7);
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 7, y + 34, this.width - 14, 62);

      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(x + 8, y + 17, this.width - 16, 18);
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(x + 19, y + 13, 11, 25);
      ctx.fillRect(x + this.width - 30, y + 13, 11, 25);
      ctx.strokeStyle = '#fff59d';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 8, y + 17, this.width - 16, 18);
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(centerX - 4, y - 8, 8, 22);
      ctx.fillRect(centerX - 22, y - 2, 13, 9);
      ctx.fillRect(centerX + 9, y - 2, 13, 9);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 5; i += 1) {
        const sparkX = x - 10 + ((i * 23 + this.lightWarriorOmegaStateTimer * 2) % (this.width + 20));
        const sparkY = y + 8 + ((i * 31 + this.lightWarriorOmegaStateTimer) % 112);
        ctx.fillRect(sparkX, sparkY, 3, 8);
      }
      return;
    }

    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 38);
    ctx.lineTo(x + 8, y + 42);
    ctx.lineTo(x + 5, y + 114);
    ctx.lineTo(x - 20, y + 120);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 7, y + 36, this.width - 14, 56);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(x + 18, y + 40, this.width - 36, 47);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 8, y + 76, this.width - 16, 6);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(centerX - 5, y + 42, 10, 38);

    ctx.fillStyle = '#111';
    ctx.fillRect(x + 7, y + 21, this.width - 14, 10);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 14, y + 35, this.width - 28, 8);
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(x + 16, y + 18, 9, 6);
    ctx.fillRect(x + this.width - 25, y + 18, 9, 6);
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(x + 15, y + 20, 10, 3);
    ctx.fillRect(x + this.width - 25, y + 20, 10, 3);
    // in cutscenes his eyes (the white lenses of his glasses) slide toward whoever he looks at:
    // eyeLook -1 left / 1 right, 0 straight at the player
    if (typeof this.eyeLook === 'number' && this.eyeLook !== 0) {
      const shift = this.eyeLook * 4;
      ctx.fillStyle = this.color;
      ctx.fillRect(x + 12, y + 17, this.width - 24, 4);
      ctx.fillStyle = '#111';
      ctx.fillRect(x + 7, y + 21, this.width - 14, 10);
      ctx.fillStyle = '#fffde7';
      ctx.fillRect(x + 16 + shift, y + 18, 9, 6);
      ctx.fillRect(x + this.width - 25 + shift, y + 18, 9, 6);
      ctx.fillStyle = '#b8860b';
      ctx.fillRect(x + 15 + shift, y + 20, 10, 3);
      ctx.fillRect(x + this.width - 25 + shift, y + 20, 10, 3);
    }

    if (boosted) {
      const pulse = 1 + Math.sin(this.lightWarriorSpeedTimer * 0.32) * 0.08;
      ctx.strokeStyle = 'rgba(255, 235, 59, 0.88)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(centerX, y + this.height / 2, 46 * pulse, 76 * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i += 1) {
        const sparkX = x - 16 + ((i * 29 + this.lightWarriorSpeedTimer * 4) % (this.width + 32));
        ctx.beginPath();
        ctx.moveTo(sparkX, y + 14);
        ctx.lineTo(sparkX + 10, y + 2);
        ctx.stroke();
      }
    }

    if (this.lightWarriorSolarFlashTimer > 0) {
      const progress = this.lightWarriorSolarFlashTimer / lightWarriorSolarFlashVisualDuration;
      ctx.fillStyle = `rgba(255, 235, 59, ${0.22 * progress})`;
      ctx.beginPath();
      ctx.arc(centerX, y + this.height / 2, lightWarriorSolarFlashRange * (1 - progress * 0.35), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * progress})`;
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    if (this.lightWarriorRadiantPunchCharging || this.lightWarriorRadiantPunchReadyTimer > 0) {
      const progress = this.lightWarriorRadiantPunchCharging
        ? getLightWarriorRadiantPunchChargeProgress(this)
        : Math.min(1, Math.max(0.25, this.lightWarriorRadiantPunchDamage / lightWarriorRadiantPunchMaxDamage));
      const pulse = 1 + Math.sin((this.lightWarriorRadiantPunchChargeTimer + this.lightWarriorRadiantPunchReadyTimer) * 0.4) * 0.08;
      const fistX = centerX + (this.attacksToTheRight ? 26 : -26);
      const fistY = y + 58;
      const radius = (16 + progress * 24) * pulse;

      ctx.fillStyle = `rgba(255, 255, 255, ${0.26 + progress * 0.34})`;
      ctx.beginPath();
      ctx.arc(fistX, fistY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.72 + progress * 0.2})`;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 235, 59, ${0.42 + progress * 0.3})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6 + this.lightWarriorRadiantPunchChargeTimer * 0.08;
        ctx.beginPath();
        ctx.moveTo(fistX + Math.cos(angle) * (radius + 4), fistY + Math.sin(angle) * (radius + 4));
        ctx.lineTo(fistX + Math.cos(angle) * (radius + 18), fistY + Math.sin(angle) * (radius + 18));
        ctx.stroke();
      }
    }

    if (this.lightWarriorOmegaFlightCharging || this.lightWarriorOmegaFlightTraveling) {
      const chargeProgress = this.lightWarriorOmegaFlightCharging
        ? Math.min(1, this.lightWarriorOmegaFlightChargeTimer / lightWarriorOmegaFlightChargeDuration)
        : 1;
      const isChargingFlight = this.lightWarriorOmegaFlightCharging;
      const glowSize = isChargingFlight ? 10 + chargeProgress * 8 : 42;
      const flightGlowX = isChargingFlight
        ? centerX + this.lightWarriorOmegaFlightDirection * 28
        : centerX + this.lightWarriorOmegaFlightDirection * 22;
      const flightGlowY = isChargingFlight ? y + 58 : y + this.height / 2 - 16;

      ctx.fillStyle = `rgba(255, 255, 255, ${isChargingFlight ? 0.42 + chargeProgress * 0.22 : 0.7})`;
      ctx.beginPath();
      ctx.ellipse(flightGlowX, flightGlowY, glowSize, glowSize * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isChargingFlight ? 'rgba(255, 235, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = isChargingFlight ? 2 : 3;
      ctx.beginPath();
      ctx.moveTo(centerX + (this.lightWarriorOmegaFlightDirection * (isChargingFlight ? 12 : 18)), y + 30);
      ctx.lineTo(flightGlowX, flightGlowY);
      ctx.stroke();

      if (isChargingFlight) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.55 + chargeProgress * 0.35})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(flightGlowX, flightGlowY, glowSize + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  drawFireMasterDetails() {
    if (isSuperFireMaster(this)) {
      this.drawSuperFireMasterDetails();
      return;
    }
    if (isIceMaster(this)) {
      this.drawIceMasterDetails();
      return;
    }

    ctx.fillStyle = '#ffb300';
    ctx.fillRect(this.position.x, this.position.y + 78, this.width, 12);
    ctx.fillStyle = '#111';
    ctx.fillRect(this.position.x, this.position.y + 76, this.width, 3);
    ctx.fillRect(this.position.x, this.position.y + 90, this.width, 3);

    const flameX = this.position.x + this.width / 2;
    const flameY = this.position.y + 42;
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(flameX, flameY - 18);
    ctx.lineTo(flameX + 12, flameY + 10);
    ctx.lineTo(flameX, flameY + 18);
    ctx.lineTo(flameX - 12, flameY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(flameX - 5, flameY + 2, 10, 12);

    if (isFireMasterOverheat(this)) {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.28)';
      ctx.fillRect(this.position.x - 6, this.position.y - 6, this.width + 12, this.height + 12);
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 4;
      ctx.strokeRect(this.position.x - 7, this.position.y - 7, this.width + 14, this.height + 14);
      ctx.fillStyle = '#fff176';
      ctx.fillRect(this.position.x + 8, this.position.y + 20, 8, 18);
      ctx.fillRect(this.position.x + this.width - 16, this.position.y + 24, 8, 18);
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.arc(flameX, flameY, 24, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff3d00';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  drawIceMasterDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const beltY = y + this.height * 0.58;
    const beltHeight = this.height * 0.14;
    const pulse = (Math.sin(performance.now() / 260) + 1) / 2;

    ctx.fillStyle = '#111';
    ctx.fillRect(x, beltY - 5, this.width, beltHeight + 10);
    ctx.fillStyle = '#3f3fc8';
    ctx.fillRect(x + 4, beltY, this.width - 8, beltHeight);
    ctx.fillStyle = '#9ff4ff';
    ctx.beginPath();
    ctx.ellipse(centerX, beltY + beltHeight / 2, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b3f5ff';
    [[-20, -4], [-14, 5], [14, -5], [20, 4], [-5, -7], [6, 7]].forEach(([offsetX, offsetY]) => {
      ctx.fillRect(centerX + offsetX - 1.5, beltY + beltHeight / 2 + offsetY - 1.5, 3, 3);
    });

    const flameY = y + this.height * 0.28;
    ctx.fillStyle = `rgba(160, 236, 255, ${0.25 + pulse * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(centerX, flameY, 20, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9ff4ff';
    ctx.strokeStyle = '#e0fcff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 4, flameY - 24);
    ctx.lineTo(centerX + 6, flameY - 14);
    ctx.lineTo(centerX + 14, flameY - 20);
    ctx.lineTo(centerX + 12, flameY - 4);
    ctx.lineTo(centerX + 16, flameY + 8);
    ctx.lineTo(centerX + 6, flameY + 20);
    ctx.lineTo(centerX - 8, flameY + 18);
    ctx.lineTo(centerX - 16, flameY + 6);
    ctx.lineTo(centerX - 12, flameY - 6);
    ctx.lineTo(centerX - 16, flameY - 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(centerX, flameY + 2, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 2.5, y + 2.5, this.width - 5, this.height - 5);
  }

  drawSuperFireMasterDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;

    ctx.fillStyle = '#ff8f00';
    ctx.fillRect(x + 7, y + 34, this.width - 14, 48);
    ctx.fillStyle = '#e65100';
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 34);
    ctx.lineTo(centerX, y + 58);
    ctx.lineTo(x + 21, y + 82);
    ctx.lineTo(x + 7, y + 82);
    ctx.lineTo(x + 7, y + 34);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + this.width - 9, y + 34);
    ctx.lineTo(centerX, y + 58);
    ctx.lineTo(x + this.width - 21, y + 82);
    ctx.lineTo(x + this.width - 7, y + 82);
    ctx.lineTo(x + this.width - 7, y + 34);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.fillRect(x, y + 76, this.width, 13);
    ctx.strokeStyle = '#ffcc80';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 78, this.width - 4, 9);

    ctx.fillStyle = '#ff6d00';
    ctx.beginPath();
    ctx.moveTo(centerX, y + 78);
    ctx.lineTo(centerX + 6, y + 86);
    ctx.lineTo(centerX + 1, y + 89);
    ctx.lineTo(centerX - 6, y + 86);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(centerX - 2, y + 82, 4, 5);

    ctx.fillStyle = '#f2c46d';
    ctx.beginPath();
    ctx.moveTo(x - 16, y + 18);
    ctx.lineTo(centerX, y - 24);
    ctx.lineTo(x + this.width + 16, y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6d4c1f';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#8d5d1d';
    ctx.fillRect(x - 10, y + 16, this.width + 20, 7);

    ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 30);
    ctx.lineTo(x + 13, y + 20);
    ctx.moveTo(x + this.width - 2, y + 30);
    ctx.lineTo(x + this.width - 13, y + 20);
    ctx.stroke();

    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(x + 14, y + 22, 8, 6);
    ctx.fillRect(x + this.width - 22, y + 22, 8, 6);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 15, y + 24, 7, 3);
    ctx.fillRect(x + this.width - 22, y + 24, 7, 3);

    ctx.fillStyle = 'rgba(255, 87, 34, 0.34)';
    ctx.fillRect(x - 6, y + 42, 8, 38);
    ctx.fillRect(x + this.width - 2, y + 42, 8, 38);
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(x + 6, y + 94, 7, 18);
    ctx.fillRect(x + this.width - 13, y + 94, 7, 18);
  }

  drawTankDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const facingRight = !this.target || this.target.position.x + this.target.width / 2 >= x + this.width / 2;
    const cannonX = facingRight ? x + this.width - 8 : x - 48;
    const turretX = facingRight ? x + 54 : x + 18;

    ctx.fillStyle = '#2f3a25';
    ctx.fillRect(x + 6, y + 142, this.width - 12, 46);
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y + 184, this.width, 34);

    ctx.fillStyle = '#56613f';
    ctx.fillRect(x + 12, y + 102, this.width - 24, 54);
    ctx.fillStyle = '#6d7651';
    ctx.fillRect(turretX, y + 72, 48, 34);
    ctx.fillStyle = '#262b1f';
    ctx.fillRect(cannonX, y + 84, 56, 10);

    ctx.fillStyle = '#1a1a1a';
    for (let wheelX = x + 12; wheelX <= x + this.width - 24; wheelX += 24) {
      ctx.beginPath();
      ctx.arc(wheelX, y + 201, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#8a8f63';
    ctx.fillRect(x + 20, y + 118, 22, 14);
    ctx.fillRect(x + this.width - 42, y + 122, 20, 12);
    ctx.fillStyle = '#c9b458';
    ctx.fillRect(x + 46, y + 108, 8, 8);

    if (isTankIronWall(this)) {
      ctx.strokeStyle = '#d7d7d7';
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 7, y + 96, this.width - 14, 66);
      ctx.strokeRect(x + 2, y + 137, this.width - 4, 56);
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(x + 20, y + 132, 24, 10);
      ctx.fillRect(x + this.width - 44, y + 132, 24, 10);
      ctx.fillStyle = '#263238';
      ctx.fillRect(cannonX + (facingRight ? 46 : -10), y + 81, 14, 16);
    }
  }

  drawCowboyDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const facingRight = !this.target || this.target.position.x + this.target.width / 2 >= x + this.width / 2;
    const gunX = facingRight ? x + this.width - 2 : x - 20;

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x - 8, y + 12, this.width + 16, 10);
    ctx.fillRect(x + 10, y, this.width - 20, 18);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x + 8, y + 48, this.width - 16, 36);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 8, y + 86, this.width - 16, 5);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 25, y + 84, 10, 9);
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(gunX, y + 52, 24, 8);
    ctx.fillRect(gunX + (facingRight ? 6 : 12), y + 58, 6, 14);
    // Robledal's sheriff wears a gold star
    if (this.sheriffBadge) {
      const starX = x + this.width / 2 + (facingRight ? 8 : -8);
      const starY = y + 60;
      ctx.save();
      ctx.shadowColor = '#fff59d';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#fdd835';
      ctx.strokeStyle = '#8d6e00';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 ? 3.5 : 8;
        const angle = -Math.PI / 2 + point * (Math.PI / 5);
        ctx.lineTo(starX + Math.cos(angle) * radius, starY + Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (isCowboyDeadeye(this)) {
      ctx.save();
      ctx.translate(x + this.width / 2, y + 38);
      ctx.scale(0.9, 0.9);
      ctx.translate(-(x + this.width / 2), -(y + 38));
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(x + 8, y + 34, this.width - 16, 8);
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + this.width / 2, y + 38, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + this.width / 2 - 22, y + 38);
      ctx.lineTo(x + this.width / 2 + 22, y + 38);
      ctx.moveTo(x + this.width / 2, y + 16);
      ctx.lineTo(x + this.width / 2, y + 60);
      ctx.stroke();
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(gunX + (facingRight ? 24 : -8), y + 50, 8, 12);
      ctx.restore();
    }
  }

  drawReflecterDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const upgraded = isReflecterUpgrade(this);
    if (upgraded) {
      this.drawReflecterUpgradeBody();
      if (this.omegariusArmor) this.drawOmegariusArmor();
      return;
    }
    const mirrorLuck = isReflecterMirrorLuck(this) && !upgraded;
    const lightColor = getReflecterLightColor(this);

    ctx.fillStyle = upgraded ? '#07090d' : mirrorLuck ? '#10261d' : '#90a4ae';
    ctx.fillRect(x + 7, y + 12, this.width - 14, 30);
    ctx.fillStyle = upgraded ? '#1a1f2a' : mirrorLuck ? '#07120d' : '#263238';
    ctx.fillRect(x + 14, y + 22, this.width - 28, 8);
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 18, y + 20, 8, 8);
    ctx.fillRect(x + this.width - 26, y + 20, 8, 8);
    ctx.fillStyle = upgraded ? '#10141d' : mirrorLuck ? '#1b3b2a' : '#607d8b';
    ctx.fillRect(x + 10, y + 48, this.width - 20, 44);
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 24, y + 56, 12, 20);
    if (mirrorLuck) {
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(x + this.width - 36, y + 56, 12, 20);
      ctx.strokeStyle = '#39ff88';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 14, y + 48, this.width - 28, 44);
      ctx.fillStyle = '#061a12';
      ctx.fillRect(x + 18, y + 82, this.width - 36, 14);
      ctx.fillStyle = '#39ff88';
      ctx.font = '900 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('777', x + this.width / 2, y + 94);
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.62)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 46);
      ctx.lineTo(x + 16, y + 34);
      ctx.lineTo(x + 28, y + 44);
      ctx.moveTo(x + this.width - 2, y + 46);
      ctx.lineTo(x + this.width - 16, y + 34);
      ctx.lineTo(x + this.width - 28, y + 44);
      ctx.stroke();
    }
    if (upgraded) {
      ctx.fillStyle = '#020307';
      ctx.fillRect(x + 2, y + 50, 10, 36);
      ctx.fillRect(x + this.width - 12, y + 50, 10, 36);
      ctx.fillStyle = lightColor;
      ctx.fillRect(x + 4, y + 58, 6, 18);
      ctx.fillRect(x + this.width - 10, y + 58, 6, 18);
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 6, y + 46, this.width - 12, 50);
      ctx.strokeRect(x + 18, y + 10, this.width - 36, 34);
      ctx.strokeStyle = hexToRgba(lightColor, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 96);
      ctx.lineTo(x + 28, y + 76);
      ctx.lineTo(x + 32, y + 96);
      ctx.lineTo(x + 48, y + 76);
      ctx.stroke();
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(x + 22, y + 28, this.width - 44, 4);
    }
    ctx.fillStyle = upgraded ? '#0b0f16' : mirrorLuck ? '#0f2319' : '#455a64';
    ctx.fillRect(x + 8, y + 98, 16, 22);
    ctx.fillRect(x + this.width - 24, y + 98, 16, 22);
    if (this.omegariusArmor) this.drawOmegariusArmor();
  }

  // KNIGHT: a medieval knight in plate armor with a great helm and red plume, a blue tabard with a gold cross,
  // a red cape, a longsword and a heater shield (raised in front of him while blocking)
  drawKnight() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const cx = x + this.width / 2;
    const opponent = this === player1 ? player2 : this === player2 ? player1 : null;
    const inFight = gameStarted && !gameOver && !arcadeCutscene.active && opponent;
    if (inFight && !this.knightLungeTimer && !this.knightSlam) this.attacksToTheRight = opponent.position.x + opponent.width / 2 >= cx;
    const facing = this.attacksToTheRight ? 1 : -1;
    // the knights of the Orden Sombria wear the same armor... in black, purple and blood red
    const dark = this.secretVariant === 'darkKnight' || this.secretVariant === 'darkKnightBoss';
    const captain = this.secretVariant === 'darkKnightBoss';
    const steel = dark ? '#1c252b' : '#b0bec5';
    const steelDark = dark ? '#080b0d' : '#607d8b';
    const steelLight = dark ? '#36454e' : '#eceff1';
    const tabard = dark ? '#22062e' : '#1e3a8a';
    const gold = dark ? '#d50000' : '#fbc02d';
    const glowColor = dark ? '#ff1744' : '#80d8ff';
    const outline = '#111';
    const shielding = this.knightShieldTimer > 0;
    const lunging = this.knightLungeTimer > 0;
    const slamming = Boolean(this.knightSlam);
    const swinging = this.isAttacking || lunging;
    const glow = this.knightGlow > 0 || slamming;
    const moving = Math.abs(this.velocity.x) > 0.4 || lunging;
    const step = moving ? Math.sin(time * 14) * 4 : 0;

    // possessed by the Orden Sombria: black-purple tendrils crawling around him
    if (this.knightPossessed) {
      ctx.save();
      const aura = ctx.createRadialGradient(cx, y + 60, 10, cx, y + 60, 90);
      aura.addColorStop(0, 'rgba(74, 20, 140, 0.45)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(cx - 90, y - 30, 180, 180);
      ctx.strokeStyle = 'rgba(30, 0, 40, 0.85)';
      ctx.lineWidth = 4;
      for (let tendril = 0; tendril < 7; tendril += 1) {
        const angle = (tendril / 7) * Math.PI * 2 + time * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 46, y + 60 + Math.sin(angle) * 64);
        ctx.quadraticCurveTo(cx + Math.cos(angle + 0.6) * 24, y + 60 + Math.sin(angle + 0.6) * 30, cx + Math.cos(angle) * 8, y + 60 + Math.sin(angle) * 12);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    // shockwaves of the Juicio del Rey (world space)
    (this.knightWaves || []).forEach((wave) => {
      const alpha = Math.max(0, wave.life / 34);
      ctx.fillStyle = `rgba(255, 236, 179, ${alpha * 0.85})`;
      ctx.strokeStyle = `rgba(255, 193, 7, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wave.x - wave.dir * 18, ground);
      ctx.quadraticCurveTo(wave.x - wave.dir * 4, ground - 52, wave.x + wave.dir * 14, ground - 30);
      ctx.lineTo(wave.x + wave.dir * 6, ground);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    if (this.knightImpact > 0) {
      const radius = (1 - this.knightImpact / 24) * 140 + 20;
      ctx.strokeStyle = `rgba(255, 213, 79, ${this.knightImpact / 24})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(this.knightImpactX, ground - 4, radius, radius * 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const drawSword = (hiltX, hiltY, angle) => {
      ctx.save();
      ctx.translate(hiltX, hiltY);
      ctx.rotate(angle);
      if (glow || dark) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 16 + Math.sin(time * 8) * 6;
      }
      ctx.fillStyle = steelLight;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3.5, 4);
      ctx.lineTo(3.5, 4);
      ctx.lineTo(2.5, 60);
      ctx.lineTo(0, 68);
      ctx.lineTo(-2.5, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = glow ? glowColor : steelDark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(0, 56);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.fillRect(-10, 0, 20, 5);
      ctx.strokeRect(-10, 0, 20, 5);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(-2.5, -12, 5, 12);
      ctx.strokeRect(-2.5, -12, 5, 12);
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(0, -14, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    // the sigil of the Orden Sombria: a red diamond with a glowing eye
    const drawSigil = (sigilX, sigilY, size) => {
      ctx.save();
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sigilX, sigilY - size);
      ctx.lineTo(sigilX + size * 0.75, sigilY);
      ctx.lineTo(sigilX, sigilY + size);
      ctx.lineTo(sigilX - size * 0.75, sigilY);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.ellipse(sigilX, sigilY, size * 0.4, size * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#120005';
      ctx.fillRect(sigilX - 1, sigilY - size * 0.18, 2, size * 0.36);
      ctx.restore();
    };
    const drawShield = (left, top, width, height) => {
      ctx.save();
      if (shielding) {
        ctx.shadowColor = this.knightBlockFlash > 0 ? '#ffffff' : glowColor;
        ctx.shadowBlur = this.knightBlockFlash > 0 ? 28 : 14;
      }
      ctx.fillStyle = tabard;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left + width, top);
      ctx.lineTo(left + width, top + height * 0.5);
      ctx.quadraticCurveTo(left + width, top + height * 0.85, left + width / 2, top + height);
      ctx.quadraticCurveTo(left, top + height * 0.85, left, top + height * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (dark) {
        drawSigil(left + width / 2, top + height * 0.42, width * 0.32);
      } else {
        ctx.fillStyle = gold;
        ctx.fillRect(left + width / 2 - 2, top + height * 0.14, 4, height * 0.62);
        ctx.fillRect(left + width * 0.22, top + height * 0.34, width * 0.56, 4);
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(left + 3, top + 3, 3, height * 0.45);
      ctx.restore();
    };

    // the same block silhouette as everyone else: an armored box with knight details on it
    // drawn at the base 60x120 size and scaled up (the dark captain is bigger)
    const w = 60;
    const h = 120;
    const half = w / 2;
    const sizeX = this.width / w;
    const sizeY = this.height / h;
    ctx.save();
    // beaten, he drops to one knee (squashed down onto the floor and leaning forward)
    ctx.translate(cx, y + this.height);
    if (this.knightKneel) {
      ctx.rotate(0.12 * facing);
      ctx.scale(facing * sizeX, 0.8 * sizeY);
    } else {
      ctx.scale(facing * sizeX, sizeY);
    }
    ctx.translate(0, -h);
    // short cape peeking out behind
    const sway = Math.sin(time * 3) * 2 - (moving ? 3 : 0);
    if (dark) {
      // a dark aura and wisps of smoke rising around them
      const aura = ctx.createRadialGradient(0, 70, 10, 0, 70, 80);
      aura.addColorStop(0, captain ? 'rgba(183, 28, 28, 0.35)' : 'rgba(74, 20, 140, 0.32)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(-80, -10, 160, 140);
      for (let wisp = 0; wisp < 6; wisp += 1) {
        const rise = (time * 22 + wisp * 21) % 120;
        ctx.fillStyle = `rgba(20, 0, 30, ${0.45 * (1 - rise / 120)})`;
        ctx.beginPath();
        ctx.arc((wisp - 2.5) * 13 + Math.sin(time * 2 + wisp) * 6, h - rise, 6 + rise / 14, 0, Math.PI * 2);
        ctx.fill();
      }
      // a long, torn cape
      ctx.fillStyle = captain ? '#5a0000' : '#0d0d12';
      ctx.beginPath();
      ctx.moveTo(-half - 2, 40);
      ctx.lineTo(half - 18, 40);
      ctx.lineTo(half - 22 + sway, 112);
      for (let tear = 0; tear < 5; tear += 1) {
        ctx.lineTo(half - 28 - tear * 7 + sway, tear % 2 ? 104 : 116);
      }
      ctx.lineTo(-half - 10 + sway, 110);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-half - 5 + sway, 42, 6, 56);
    }
    // sword resting on the back side
    if (!swinging && !slamming) drawSword(-half - 4, 50, 0.12);
    // armored body block
    ctx.fillStyle = steel;
    ctx.fillRect(-half, 0, w, h);
    if (dark) {
      ctx.strokeStyle = 'rgba(213, 0, 0, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-half + 0.75, 0.75, w - 1.5, h - 1.5);
    }
    // helmet: a lighter band with the visor slit (the eyes look forward)
    ctx.fillStyle = steelLight;
    ctx.fillRect(-half, 0, w, 40);
    ctx.fillStyle = steelDark;
    ctx.fillRect(-2, 26, 4, 14);
    ctx.fillStyle = '#111';
    ctx.fillRect(-half + 8, 18, w - 12, 7);
    ctx.save();
    if (dark) {
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 10 + Math.sin(time * 5) * 4;
    }
    ctx.fillStyle = dark || this.knightPossessed ? '#ff1744' : glow ? '#80d8ff' : '#ffffff';
    ctx.fillRect(4, 20, dark ? 8 : 6, 3);
    ctx.fillRect(16, 20, dark ? 8 : 6, 3);
    ctx.restore();
    ctx.fillStyle = '#111';
    [[14, 30], [18, 30], [14, 34], [18, 34]].forEach(([holeX, holeY]) => ctx.fillRect(holeX, holeY, 2, 2));
    // plume on top (the dark ones wear a crest of spikes)
    if (dark) {
      ctx.fillStyle = '#0b0f12';
      ctx.strokeStyle = '#d50000';
      ctx.lineWidth = 1;
      [[-12, 8], [0, 14], [12, 8]].forEach(([spikeX, tall]) => {
        ctx.beginPath();
        ctx.moveTo(spikeX - 5, 1);
        ctx.lineTo(spikeX, -tall);
        ctx.lineTo(spikeX + 5, 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    } else {
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(-6, -8, 12, 8);
      ctx.fillRect(-14 + sway, -5, 10, 5);
    }
    // the captain's horned helm
    if (captain) {
      ctx.save();
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = 'rgba(255, 82, 82, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-20, 52);
      ctx.lineTo(-14, 62);
      ctx.lineTo(-18, 74);
      ctx.moveTo(22, 90);
      ctx.lineTo(16, 100);
      ctx.lineTo(20, 112);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#3e2723';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(side * 22, 8);
        ctx.quadraticCurveTo(side * 40, 0, side * 36, -18);
        ctx.quadraticCurveTo(side * 32, -2, side * 14, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
    // shoulder plates (with spikes for the Orden Sombria)
    ctx.fillStyle = steelLight;
    ctx.fillRect(-half, 40, 14, 8);
    ctx.fillRect(half - 14, 40, 14, 8);
    if (dark) {
      ctx.fillStyle = '#0b0f12';
      ctx.strokeStyle = '#d50000';
      ctx.lineWidth = 1;
      [-half + 3, -half + 10, half - 11, half - 4].forEach((spikeX) => {
        ctx.beginPath();
        ctx.moveTo(spikeX - 3, 40);
        ctx.lineTo(spikeX, 31);
        ctx.lineTo(spikeX + 3, 40);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
    ctx.fillStyle = steelDark;
    ctx.fillRect(-half, 47, 14, 2);
    ctx.fillRect(half - 14, 47, 14, 2);
    // blue tabard with the gold cross
    ctx.fillStyle = tabard;
    ctx.fillRect(-half + 12, 48, w - 24, 52);
    ctx.fillStyle = gold;
    ctx.fillRect(-half + 12, 48, w - 24, 2);
    if (dark) {
      drawSigil(0, 66, 11);
    } else {
      ctx.fillRect(-2, 56, 4, 26);
      ctx.fillRect(-9, 63, 18, 4);
    }
    // belt
    ctx.fillStyle = dark ? '#120a07' : '#5d4037';
    ctx.fillRect(-half, 84, w, 6);
    ctx.fillStyle = gold;
    ctx.fillRect(-4, 83, 8, 8);
    // legs: the gap between them and the knee plates
    ctx.fillStyle = steelDark;
    ctx.fillRect(-2, 100, 4, h - 100);
    ctx.fillStyle = steelLight;
    ctx.fillRect(-half + 8, 104 + step * 0.3, 12, 5);
    ctx.fillRect(half - 20, 104 - step * 0.3, 12, 5);
    // the sword in action
    if (slamming) {
      drawSword(half - 6, 30, Math.PI);
    } else if (swinging) {
      const progress = this.isAttacking && this.attackDuration ? 1 - Math.max(0, this.attackTimer || 0) / this.attackDuration : 1;
      const angle = lunging ? -Math.PI / 2 : -Math.PI * 0.95 + progress * Math.PI * 0.6;
      drawSword(half - 4, 60, angle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (lunging) {
        [48, 60, 72].forEach((lineY) => {
          ctx.moveTo(-half - 6, lineY);
          ctx.lineTo(-half - 30, lineY);
        });
      } else {
        ctx.arc(half - 4, 60, 66, -Math.PI * 0.45, Math.PI * 0.15);
      }
      ctx.stroke();
    }
    // shield: on the front arm, or raised in front while blocking
    if (shielding) drawShield(half - 6, 28, 30, 70);
    else drawShield(half - 10, 54, 20, 38);
    ctx.restore();
  }

  // the GUARD OF THE GRAN FAROL: a steel kettle helmet, a navy tabard with a golden lantern, chainmail,
  // a small lantern on his belt and a long halberd (he can also fall, at the end of level 6)
  drawLanternGuard() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const half = this.width / 2;
    const facing = this.faceOpponentInFight();
    // his lantern flash (world space)
    if (this.guardFlashFx > 0) {
      const glow = ctx.createRadialGradient(x + half, y + 70, 4, x + half, y + 70, 300);
      glow.addColorStop(0, `rgba(255, 245, 157, ${this.guardFlashFx / 26})`);
      glow.addColorStop(1, 'rgba(255, 245, 157, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x + half - 300, y + 70 - 300, 600, 600);
    }
    ctx.save();
    if (this.guardFallen) {
      // falling slowly to the ground (lifted by half his width so he rests on top of the floor)
      const fall = typeof this.guardFallProgress === 'number' ? this.guardFallProgress : 1;
      const eased = 1 - (1 - fall) * (1 - fall);
      ctx.translate(0, -half * eased);
      ctx.translate(x + half, ground);
      ctx.rotate(-Math.PI / 2 * facing * eased);
      ctx.translate(-(x + half), -ground);
    }
    ctx.translate(x + half, y);
    ctx.scale(facing, 1);
    // the halberd behind (or swinging in front)
    const sweeping = this.guardSweepTimer > 0;
    const thrusting = this.guardThrustTimer > 0;
    const drawHalberd = (angle, offsetX, offsetY) => {
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.rotate(angle);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-3, -96, 6, 150);
      ctx.fillStyle = '#b0bec5';
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(3, -88);
      ctx.quadraticCurveTo(30, -84, 26, -62);
      ctx.lineTo(3, -66);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-3, -96);
      ctx.lineTo(0, -116);
      ctx.lineTo(3, -96);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    if (!sweeping && !thrusting && !this.guardDisarmed) drawHalberd(0.12, 30, 54);
    // chainmail and boots
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(-half, 0, this.width, this.height);
    ctx.fillStyle = 'rgba(55, 71, 79, 0.4)';
    for (let ring = 0; ring < 30; ring += 1) ctx.fillRect(-half + (ring % 10) * 6 + 2, 92 + Math.floor(ring / 10) * 8, 3, 3);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-half, this.height - 10, this.width, 10);
    // navy tabard with a golden lantern
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(-half + 8, 42, this.width - 16, 52);
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(-half + 8, 42, this.width - 16, 3);
    ctx.fillRect(-6, 58, 12, 16);
    ctx.fillStyle = '#fff59d';
    ctx.fillRect(-3, 62, 6, 8);
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(-8, 54, 16, 3);
    ctx.fillRect(-8, 74, 16, 3);
    // belt with a small glowing lantern
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(-half, 88, this.width, 6);
    // the little lantern on his belt (it goes out when he falls)
    ctx.fillStyle = this.guardLanternOut ? '#424242' : `rgba(255, 213, 79, ${0.7 + Math.sin(time * 4) * 0.2})`;
    ctx.fillRect(-half + 4, 92, 8, 10);
    // face with a moustache
    ctx.fillStyle = '#ffccbc';
    ctx.fillRect(-half + 8, 14, this.width - 16, 26);
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(4, 22, 4, 4);
    ctx.fillRect(14, 22, 4, 4);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(2, 32, 18, 4);
    // steel kettle helmet with a wide brim
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(-half + 6, 0, this.width - 12, 16);
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(-half - 4, 14, this.width + 8, 5);
    ctx.fillStyle = '#eceff1';
    ctx.fillRect(-half + 10, 3, 6, 10);
    // the halberd in action
    if (sweeping) {
      const progress = 1 - this.guardSweepTimer / 22;
      drawHalberd(-1.6 + progress * 2.6, 26, 60);
      if (this.guardSweepTimer < 10) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(26, 60, 110, -1.4, 0.9);
        ctx.stroke();
      }
    } else if (thrusting) {
      drawHalberd(Math.PI / 2, 20, 60);
    }
    ctx.restore();
  }

  // the FURIOUS CHEF: his white coat, a toque blowing steam, a red angry face with furrowed brows and gritted teeth,
  // and a giant rolling pin; Mochi watches from the side, scared
  drawChefBoss() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const half = this.width / 2;
    const facing = this.faceOpponentInFight();
    // his attacks (world space)
    (this.chefShots || []).forEach((shot) => {
      ctx.save();
      if (shot.kind === 'rain') {
        if (shot.warn > 0) {
          ctx.fillStyle = `rgba(255, 82, 82, ${0.3 + Math.sin(time * 25) * 0.2})`;
          ctx.beginPath();
          ctx.ellipse(shot.x, ground - 3, 26, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.translate(shot.x, shot.y);
          ctx.rotate(time * 8);
          ctx.fillStyle = '#f48fb1';
          ctx.fillRect(-12, -8, 24, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-12, -11, 24, 4);
          ctx.fillStyle = '#d32f2f';
          ctx.beginPath();
          ctx.arc(0, -12, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (shot.kind === 'pin') {
        ctx.translate(shot.x, shot.y);
        ctx.rotate(time * 18);
        ctx.fillStyle = '#d7a86e';
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.fillRect(-26, -6, 52, 12);
        ctx.strokeRect(-26, -6, 52, 12);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(-36, -3, 10, 6);
        ctx.fillRect(26, -3, 10, 6);
      } else if (shot.kind === 'splash') {
        const progress = 1 - shot.life / 26;
        ctx.strokeStyle = `rgba(129, 212, 250, ${1 - progress})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(shot.x, ground - 6, 20 + progress * 120, 8 + progress * 22, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * (1 - progress)})`;
        for (let drop = 0; drop < 8; drop += 1) {
          const angle = Math.PI + (drop / 7) * Math.PI;
          ctx.fillRect(shot.x + Math.cos(angle) * (30 + progress * 110), ground - 10 + Math.sin(angle) * (20 + progress * 60), 4, 6);
        }
      }
      ctx.restore();
    });
    ctx.save();
    ctx.translate(x + half, y);
    ctx.scale(facing, 1);
    // white coat block
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(-30, 0, 60, 120);
    ctx.strokeStyle = '#bdbdbd';
    ctx.lineWidth = 2;
    ctx.strokeRect(-30, 0, 60, 120);
    // stained apron
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(-20, 48, 40, 50);
    ctx.fillStyle = 'rgba(244, 143, 177, 0.8)';
    ctx.beginPath();
    ctx.arc(-8, 66, 5, 0, Math.PI * 2);
    ctx.arc(10, 82, 4, 0, Math.PI * 2);
    ctx.fill();
    // toque, blowing steam with rage
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-22, -26, 44, 26);
    ctx.beginPath();
    ctx.arc(-12, -26, 12, 0, Math.PI * 2);
    ctx.arc(4, -30, 13, 0, Math.PI * 2);
    ctx.arc(16, -24, 10, 0, Math.PI * 2);
    ctx.fill();
    for (let puff = 0; puff < 3; puff += 1) {
      const rise = (time * 40 + puff * 14) % 42;
      ctx.fillStyle = `rgba(236, 239, 241, ${0.7 - rise / 60})`;
      ctx.beginPath();
      ctx.arc(-14 + puff * 14 + Math.sin(time * 5 + puff) * 4, -40 - rise, 6 + rise / 7, 0, Math.PI * 2);
      ctx.fill();
    }
    // a red, furious face
    ctx.fillStyle = '#ef9a9a';
    ctx.fillRect(-22, 2, 44, 34);
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(2, 14, 5, 4);
    ctx.fillRect(14, 14, 5, 4);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-1, 8);
    ctx.lineTo(9, 12);
    ctx.moveTo(22, 8);
    ctx.lineTo(12, 12);
    ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.ellipse(4, 24, 9, 4, -0.5, 0, Math.PI * 2);
    ctx.ellipse(18, 24, 9, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 29, 18, 5);
    ctx.strokeStyle = '#424242';
    ctx.lineWidth = 1;
    for (let tooth = 5; tooth < 20; tooth += 4) {
      ctx.beginPath();
      ctx.moveTo(tooth, 29);
      ctx.lineTo(tooth, 34);
      ctx.stroke();
    }
    // red scarf, dark trousers
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-26, 38, 52, 8);
    ctx.fillStyle = '#455a64';
    ctx.fillRect(-30, 104, 60, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, 104, 4, 16);
    // the giant rolling pin (swung when he attacks, missing while it is flying)
    const pinOut = (this.chefShots || []).some((shot) => shot.kind === 'pin');
    if (!pinOut) {
      ctx.save();
      ctx.translate(30, 60);
      ctx.rotate(this.isAttacking ? -1.2 + (this.attackTimer || 0) * 0.16 : 0.5 + Math.sin(time * 4) * 0.05);
      ctx.fillStyle = '#d7a86e';
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2;
      ctx.fillRect(-6, -40, 12, 52);
      ctx.strokeRect(-6, -40, 12, 52);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(-3, 12, 6, 12);
      ctx.fillRect(-3, -50, 6, 10);
      ctx.restore();
    }
    ctx.restore();
    // Mochi watching from the side, trembling (during the special round he is helping instead)
    if (dodgeRound.active) return;
    const mochiX = getFighterCenterX(this) > canvas.width / 2 ? 60 : canvas.width - 90;
    if (!this.chefMochiActor) {
      this.chefMochiActor = new Fighter({ x: mochiX, y: 0, color: '#9e9e9e', attacksToTheRight: true });
      this.chefMochiActor.setCharacterType('normal', 'mochiMouse');
      this.chefMochiActor.mochiPowered = false;
    }
    const mochi = this.chefMochiActor;
    mochi.position = { x: mochiX + Math.sin(time * 40) * 1.5, y: ground - mochi.height };
    mochi.attacksToTheRight = mochiX < canvas.width / 2;
    mochi.isAttacking = false;
    mochi.draw();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('(...gulp)', mochiX + 15, ground - 60);
    ctx.textAlign = 'left';
  }

  // MOCHI: a tiny grey mouse (a little block) with big round ears, a red headband, blue boxing shorts
  // and huge red boxing gloves; after the chef's magic cake he glows gold and stands a bit taller
  drawMochi() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    // the art is made for 40x64 and scaled to his (tiny) real size
    const w = 40;
    const h = 64;
    const half = w / 2;
    const sizeX = this.width / w;
    const sizeY = this.height / h;
    const facing = this.faceOpponentInFight();
    const powered = Boolean(this.mochiPowered);
    // the chef's pastries flying across the hot springs (world space)
    (this.mochiSplats || []).forEach((splat) => {
      ctx.fillStyle = `rgba(248, 187, 208, ${Math.min(0.8, splat.life / 20)})`;
      ctx.beginPath();
      ctx.ellipse(splat.x, ground - 4, 30 + (24 - Math.min(24, splat.life)) * 2.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    (this.mochiPastries || []).forEach((pastry) => {
      ctx.save();
      ctx.translate(pastry.x, pastry.y);
      ctx.rotate(time * 6);
      const colors = { heal: ['#ffd54f', '#e91e63'], sticky: ['#ce93d8', '#6a1b9a'], shield: ['#fff8e1', '#4fc3f7'], bomb: ['#f48fb1', '#ad1457'] }[pastry.kind] || ['#ffd54f', '#e91e63'];
      const big = pastry.kind === 'bomb' ? 1.5 : 1;
      ctx.scale(big, big);
      ctx.fillStyle = colors[0];
      ctx.fillRect(-9, -6, 18, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-9, -8, 18, 3);
      ctx.fillStyle = colors[1];
      ctx.beginPath();
      ctx.arc(0, -9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    const punching = this.isAttacking || (this.mochiFlurryTimer > 0 && this.mochiFlurryTimer % 6 < 3);
    const uppercut = this.mochiUppercutTimer > 0;
    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height);
    const grow = powered ? 1.15 : 1;
    ctx.scale(facing * grow * sizeX, grow * sizeY);
    ctx.translate(0, -h);
    if (powered) {
      const aura = ctx.createRadialGradient(0, h / 2, 6, 0, h / 2, 54);
      aura.addColorStop(0, `rgba(255, 213, 79, ${0.35 + Math.sin(time * 8) * 0.12})`);
      aura.addColorStop(1, 'rgba(255, 213, 79, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(-60, -20, 120, h + 30);
    }
    // the cream shield: a soft white bubble around him
    if (this.mochiShieldTimer > 0) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 10) * 0.2})`;
      ctx.fillStyle = 'rgba(255, 248, 225, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, h / 2, 34, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (this.mochiCakeFx > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.mochiCakeFx / 30})`;
      for (let sparkle = 0; sparkle < 6; sparkle += 1) {
        const angle = time * 5 + sparkle;
        ctx.fillRect(Math.cos(angle) * 30 - 2, h / 2 + Math.sin(angle) * 30 - 2, 4, 4);
      }
    }
    // a curly pink tail
    ctx.strokeStyle = '#f48fb1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-half, h - 18);
    ctx.quadraticCurveTo(-half - 18, h - 30 + Math.sin(time * 6) * 4, -half - 12, h - 44);
    ctx.stroke();
    // round ears
    [-12, 12].forEach((earX) => {
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath();
      ctx.arc(earX, 2, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8bbd0';
      ctx.beginPath();
      ctx.arc(earX, 2, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    // grey body block with a light belly
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(-half, 4, w, h - 4);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(-half + 8, 30, w - 16, 20);
    // blue boxing shorts with a white stripe
    ctx.fillStyle = '#1e88e5';
    ctx.fillRect(-half, 46, w, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-half, 46, w, 2);
    // pink feet
    ctx.fillStyle = '#f48fb1';
    ctx.fillRect(-half + 2, h - 4, 14, 4);
    ctx.fillRect(half - 16, h - 4, 14, 4);
    // red headband with tails flying behind
    ctx.fillStyle = powered ? '#ffca28' : '#e53935';
    ctx.fillRect(-half, 8, w, 5);
    ctx.beginPath();
    ctx.moveTo(-half, 9);
    ctx.lineTo(-half - 14, 4 + Math.sin(time * 10) * 3);
    ctx.lineTo(-half - 12, 12 + Math.sin(time * 10 + 1) * 3);
    ctx.closePath();
    ctx.fill();
    // face: eyes, a pink nose at the front, whiskers and two big teeth
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(2, 16, 4, 5);
    ctx.fillRect(12, 16, 4, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, 16, 1.5, 1.5);
    ctx.fillRect(13, 16, 1.5, 1.5);
    ctx.fillStyle = '#ec407a';
    ctx.beginPath();
    ctx.arc(half, 24, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#424242';
    ctx.lineWidth = 1;
    ctx.beginPath();
    [-2, 1, 4].forEach((whisker) => {
      ctx.moveTo(half - 4, 24 + whisker);
      ctx.lineTo(half + 9, 22 + whisker * 2);
    });
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 27, 3, 4);
    ctx.fillRect(11.5, 27, 3, 4);
    // the big boxing gloves (the front one jabs, or goes up in an uppercut)
    const glove = (gloveX, gloveY) => {
      ctx.fillStyle = powered ? '#ff7043' : '#e53935';
      ctx.strokeStyle = powered ? '#ffca28' : '#7f0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gloveX, gloveY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(gloveX - 6, gloveY + 6, 12, 3);
    };
    glove(-half + 2, 36);
    if (uppercut) glove(half + 4, 2);
    else if (punching) glove(half + 18, 26);
    else glove(half + 2, 34 + Math.sin(time * 6) * 2);
    ctx.restore();
  }

  // both kids of Robledal always face the one they are playing with
  faceOpponentInFight() {
    const opponent = this === player1 ? player2 : this === player2 ? player1 : null;
    if (gameStarted && !gameOver && !arcadeCutscene.active && opponent && !this.celesteDashTimer) {
      this.attacksToTheRight = opponent.position.x + opponent.width / 2 >= this.position.x + this.width / 2;
    }
    return this.attacksToTheRight ? 1 : -1;
  }

  // CELESTE: a troublesome little girl (same block silhouette): a light blue dress with a white collar,
  // brown bob hair, a big red bow, huge eyes... and a knife in her hand
  drawCeleste() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const h = this.height;
    const half = w / 2;
    const facing = this.faceOpponentInFight();
    const drawKnife = (knifeX, knifeY, angle, size = 1) => {
      ctx.save();
      ctx.translate(knifeX, knifeY);
      ctx.rotate(angle);
      ctx.scale(size, size);
      ctx.fillStyle = '#eceff1';
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -3);
      ctx.lineTo(18, -1);
      ctx.lineTo(22, 1);
      ctx.lineTo(0, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(-9, -2.5, 9, 5);
      ctx.restore();
    };
    // her knives in the air (world space)
    (this.celesteKnives || []).forEach((knife) => {
      if (knife.warn > 0) {
        ctx.fillStyle = `rgba(255, 82, 82, ${0.35 + Math.sin(time * 25) * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(knife.x, ground - 4);
        ctx.lineTo(knife.x - 8, ground - 16);
        ctx.lineTo(knife.x + 8, ground - 16);
        ctx.closePath();
        ctx.fill();
        return;
      }
      const angle = knife.kind === 'rain' ? Math.PI / 2 : Math.atan2(knife.vy, knife.vx);
      drawKnife(knife.x, knife.y, knife.stuck ? Math.PI / 2 : angle + (knife.kind === 'throw' ? 0 : 0), 1.1);
    });
    // the blink: a little sparkle where she will appear
    if (this.celesteBlinkTimer > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 30) * 0.4})`;
      for (let sparkle = 0; sparkle < 6; sparkle += 1) {
        const angle = time * 6 + sparkle;
        ctx.fillRect(this.position.x + half + Math.cos(angle) * 34 - 2, this.position.y + 50 + Math.sin(angle) * 40 - 2, 4, 4);
      }
    }
    if (this.celesteSlashFx > 0) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.celesteSlashFx / 12})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.celesteSlashX, this.position.y + 56, 44, -0.9, 0.9);
      ctx.arc(this.celesteSlashX, this.position.y + 56, 44, Math.PI - 0.9, Math.PI + 0.9);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x + half, y);
    ctx.scale(facing, 1);
    const bounce = Math.abs(this.velocity.x) > 0.4 ? Math.abs(Math.sin(time * 14)) * 2 : 0;
    ctx.translate(0, -bounce);
    // dress block
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(-half, 0, w, h);
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(-half, 82, w, 8);
    ctx.fillStyle = '#ffffff';
    for (let frill = -half; frill < half; frill += 6) ctx.fillRect(frill, 90, 4, 3);
    // white socks and black shoes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-half + 6, 93, 16, 11);
    ctx.fillRect(half - 22, 93, 16, 11);
    ctx.fillStyle = '#263238';
    ctx.fillRect(-half + 4, h - 5, 20, 5);
    ctx.fillRect(half - 24, h - 5, 20, 5);
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(-2, 93, 4, 15);
    // white collar and a little red ribbon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-half + 8, 40);
    ctx.lineTo(0, 52);
    ctx.lineTo(half - 8, 40);
    ctx.lineTo(half - 8, 44);
    ctx.lineTo(0, 56);
    ctx.lineTo(-half + 8, 44);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-4, 50, 8, 6);
    // face
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(-half + 6, 8, w - 12, 32);
    // hair: a brown bob with bangs
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-half, 0, w, 10);
    ctx.fillRect(-half, 0, 8, 42);
    ctx.fillRect(half - 8, 0, 8, 42);
    for (let bang = -half + 8; bang < half - 8; bang += 8) {
      ctx.beginPath();
      ctx.moveTo(bang, 10);
      ctx.lineTo(bang + 4, 16);
      ctx.lineTo(bang + 8, 10);
      ctx.closePath();
      ctx.fill();
    }
    // big eyes, blush and a mischievous grin
    ctx.fillStyle = '#1b1b1b';
    ctx.beginPath();
    ctx.ellipse(1, 24, 4, 5.5, 0, 0, Math.PI * 2);
    ctx.ellipse(15, 24, 4, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 20, 2, 2);
    ctx.fillRect(16, 20, 2, 2);
    ctx.fillStyle = 'rgba(244, 143, 177, 0.8)';
    ctx.fillRect(-6, 30, 5, 3);
    ctx.fillRect(19, 30, 5, 3);
    ctx.strokeStyle = '#6d2a2a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(8, 32, 4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // the big red bow on top
    const flutter = Math.sin(time * 4) * 1.5;
    ctx.fillStyle = '#e53935';
    ctx.strokeStyle = '#7f0000';
    ctx.lineWidth = 1.5;
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(4, -2);
      ctx.lineTo(4 + side * 16, -12 + flutter * side);
      ctx.lineTo(4 + side * 16, 4 - flutter * side);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillRect(0, -6, 8, 8);
    // her knife: held low, swung up when she attacks
    if (this.celesteShowKnives !== false) {
      const swing = this.isAttacking ? -0.9 + (this.attackTimer || 0) * 0.18 : 0.5;
      drawKnife(half + 2, 64, swing);
    }
    ctx.restore();
    if (this.duoActive && this.duoPartnerActor) this.drawDuoPartner();
  }

  // SETO: Celeste's friend (same block silhouette): long black hair, purple clothes with a gold crescent moon,
  // and a magic book floating next to him (every one of his tricks comes out of a book)
  drawSeto() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const h = this.height;
    const half = w / 2;
    const facing = this.faceOpponentInFight();
    const drawBook = (bookX, bookY, open, glowPower = 0.5, scale = 1) => {
      ctx.save();
      ctx.translate(bookX, bookY);
      ctx.scale(scale, scale);
      ctx.shadowColor = '#b388ff';
      ctx.shadowBlur = 8 + glowPower * 14;
      ctx.fillStyle = '#4a148c';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      if (open) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, -5);
        ctx.lineTo(-15, 10);
        ctx.lineTo(0, 14);
        ctx.lineTo(15, 10);
        ctx.lineTo(15, -5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff8e1';
        ctx.beginPath();
        ctx.moveTo(0, 1);
        ctx.lineTo(-13, -3);
        ctx.lineTo(-13, 9);
        ctx.lineTo(0, 12);
        ctx.lineTo(13, 9);
        ctx.lineTo(13, -3);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(126, 87, 194, 0.8)';
        for (let line = 0; line < 3; line += 1) {
          ctx.fillRect(-11, 1 + line * 3, 8, 1.5);
          ctx.fillRect(3, 1 + line * 3, 8, 1.5);
        }
      } else {
        ctx.fillRect(-12, -9, 24, 18);
        ctx.strokeRect(-12, -9, 24, 18);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffca28';
        ctx.fillRect(-12, -9, 3, 18);
        ctx.beginPath();
        ctx.arc(2, 0, 4, 0.6, Math.PI * 2 - 0.6);
        ctx.fill();
      }
      ctx.restore();
    };
    // his spells (world space)
    (this.setoToys || []).forEach((toy) => {
      ctx.save();
      if (toy.kind === 'top') {
        // a glowing rune that rolls along the ground and bounces off the walls
        ctx.translate(toy.x, ground - 18);
        ctx.rotate(time * 8 * Math.sign(toy.vx || 1));
        ctx.shadowColor = '#b388ff';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = '#ce93d8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let point = 0; point < 3; point += 1) {
          const angle = (Math.PI * 2 * point) / 3;
          ctx.lineTo(Math.cos(angle) * 11, Math.sin(angle) * 11);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (toy.kind === 'balloon') {
        // an orb of magic water
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(79, 195, 247, 0.85)';
        ctx.beginPath();
        ctx.arc(toy.x, toy.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(toy.x - 5, toy.y - 6, 3, 3);
        ctx.fillRect(toy.x + 3 + Math.sin(time * 9) * 2, toy.y + 2, 2, 2);
      } else if (toy.kind === 'puddle') {
        ctx.fillStyle = `rgba(79, 195, 247, ${Math.min(0.6, toy.life / 60)})`;
        ctx.beginPath();
        ctx.ellipse(toy.x, ground - 2, 60, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(206, 147, 216, ${Math.min(0.8, toy.life / 60)})`;
        for (let sparkle = 0; sparkle < 5; sparkle += 1) {
          ctx.fillRect(toy.x - 48 + sparkle * 24, ground - 6 - Math.abs(Math.sin(time * 4 + sparkle)) * 8, 3, 3);
        }
      } else if (toy.kind === 'box') {
        // a trap book on the floor: it shakes, opens... and a ghostly fist punches out of it
        const shake = toy.timer > 0 ? Math.sin(time * 50) * Math.min(3, (45 - toy.timer) / 8) : 0;
        const opened = toy.timer <= 0;
        drawBook(toy.x + shake, ground - 12, opened, opened ? 1 : 0.4, 1.4);
        if (opened && toy.pop > 0) {
          const reach = Math.min(1, (14 - toy.pop) / 5) * 70;
          ctx.shadowColor = '#b388ff';
          ctx.shadowBlur = 16;
          ctx.strokeStyle = 'rgba(206, 147, 216, 0.85)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(toy.x, ground - 24);
          ctx.quadraticCurveTo(toy.x + toy.dir * reach * 0.5, ground - 60, toy.x + toy.dir * reach, ground - 40);
          ctx.stroke();
          ctx.fillStyle = 'rgba(179, 136, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(toy.x + toy.dir * reach, ground - 40, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(toy.x + toy.dir * reach - 6, ground - 46, 12, 3);
        }
      }
      ctx.restore();
    });
    ctx.save();
    ctx.translate(x + half, y);
    ctx.scale(facing, 1);
    // long black hair falling behind his shoulders
    ctx.fillStyle = '#121212';
    ctx.fillRect(-half - 3, 4, w + 6, 52);
    // purple tunic block with a gold crescent moon
    ctx.fillStyle = '#7e57c2';
    ctx.fillRect(-half, 0, w, h);
    ctx.fillStyle = '#5e35b1';
    ctx.fillRect(-half, 74, w, 8);
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.arc(0, 60, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7e57c2';
    ctx.beginPath();
    ctx.arc(4, 57, 7, 0, Math.PI * 2);
    ctx.fill();
    // a lilac collar
    ctx.fillStyle = '#d1c4e9';
    ctx.fillRect(-half + 8, 40, w - 16, 5);
    // dark purple trousers and shoes
    ctx.fillStyle = '#311b92';
    ctx.fillRect(-half, 82, w, 24);
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(-2, 86, 4, 20);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-half + 4, h - 6, 18, 6);
    ctx.fillRect(half - 22, h - 6, 18, 6);
    // face
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(-half + 8, 10, w - 16, 30);
    // hair: a long black fringe over the forehead and long locks framing the face
    ctx.fillStyle = '#121212';
    ctx.fillRect(-half, 0, w, 12);
    ctx.fillRect(-half, 0, 9, 50);
    ctx.fillRect(half - 9, 0, 9, 50);
    ctx.beginPath();
    ctx.moveTo(-half + 8, 12);
    ctx.lineTo(-4, 20);
    ctx.lineTo(4, 12);
    ctx.lineTo(14, 18);
    ctx.lineTo(half - 8, 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(-half + 2, 4, 3, 40);
    // big round glasses, eyes and freckles
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(224, 247, 250, 0.6)';
    [2, 17].forEach((lensX) => {
      ctx.beginPath();
      ctx.arc(lensX, 25, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(8.5, 25);
    ctx.lineTo(10.5, 25);
    ctx.stroke();
    ctx.fillStyle = '#212121';
    ctx.fillRect(2, 24, 3, 3);
    ctx.fillRect(17, 24, 3, 3);
    ctx.fillStyle = '#a1662f';
    [[-4, 33], [21, 33]].forEach(([freckleX, freckleY]) => ctx.fillRect(freckleX, freckleY, 2, 2));
    ctx.strokeStyle = '#6d2a2a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(5, 35);
    ctx.lineTo(13, 35);
    ctx.stroke();
    ctx.restore();
    // his magic book floating next to him (it opens and glows when he attacks or casts)
    const casting = this.isAttacking || (this.robledalGap || 0) > 0;
    const bookX = x + half + facing * (half + 16);
    const bookY = y + 46 + Math.sin(time * 3) * 4;
    drawBook(bookX, bookY, casting || Math.sin(time * 1.5) > 0.6, casting ? 1 : 0.4);
    if (casting) {
      ctx.fillStyle = 'rgba(206, 147, 216, 0.8)';
      for (let rune = 0; rune < 4; rune += 1) {
        const rise = (time * 40 + rune * 12) % 40;
        ctx.fillRect(bookX - 8 + rune * 5, bookY - 8 - rise, 3, 3);
      }
    }
    // in the team-up fight, the friend who is waiting cheers from the side
    if (this.duoActive && this.duoPartnerActor) this.drawDuoPartner();
  }

  // the waiting partner in the team-up fight: a little smaller, in the background, jumping and cheering
  drawDuoPartner() {
    if (this.duoSwapFx > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.duoSwapFx / 24})`;
      for (let puff = 0; puff < 7; puff += 1) {
        const angle = puff * 0.9;
        ctx.beginPath();
        ctx.arc(getFighterCenterX(this) + Math.cos(angle) * (60 - this.duoSwapFx * 1.5), this.position.y + this.height / 2 + Math.sin(angle) * 50, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff59d';
      ctx.font = '900 20px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CAMBIO!', getFighterCenterX(this), this.position.y - 16);
      ctx.textAlign = 'left';
    }
    const partner = this.duoPartnerActor;
    const time = performance.now() / 1000;
    const sideX = getFighterCenterX(this) > canvas.width / 2 ? 70 : canvas.width - 130;
    partner.position = { x: sideX, y: ground - partner.height - 40 - Math.abs(Math.sin(time * 5)) * 10 };
    partner.attacksToTheRight = sideX < canvas.width / 2;
    partner.isAttacking = false;
    ctx.save();
    ctx.globalAlpha = 0.85;
    const pivotX = sideX + partner.width / 2;
    const pivotY = ground - 40;
    ctx.translate(pivotX, pivotY);
    ctx.scale(0.75, 0.75);
    ctx.translate(-pivotX, -pivotY);
    partner.draw();
    ctx.restore();
    ctx.fillStyle = '#fff59d';
    ctx.font = '900 13px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(partner.secretVariant === 'celesteGirl' ? 'VAMOS SETO!' : 'TU PUEDES!', pivotX, ground - partner.height * 0.75 - 56);
    ctx.textAlign = 'left';
  }

  // the Bestia del Musgo: a big mossy forest creature with branch antlers, mushrooms on its shoulders,
  // glowing amber eyes and long mossy arms (its roots break out of the ground under the target)
  drawMossBeast() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const h = this.height;
    const cx = x + w / 2;
    const facing = this.attacksToTheRight ? 1 : -1;
    const half = w / 2;
    const breathe = Math.sin(time * 2.2) * 2;
    // its roots (world space): a glowing crack while they warn, then thorny roots breaking out
    (this.mossRoots || []).forEach((root) => {
      ctx.save();
      if (root.warn > 0) {
        const pulse = 0.4 + Math.sin(time * 20) * 0.25;
        ctx.fillStyle = `rgba(156, 204, 101, ${pulse})`;
        ctx.beginPath();
        ctx.ellipse(root.x, ground - 2, 30, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#33691e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(root.x - 22, ground - 1);
        ctx.lineTo(root.x - 6, ground - 4);
        ctx.lineTo(root.x + 4, ground);
        ctx.lineTo(root.x + 20, ground - 3);
        ctx.stroke();
      } else {
        const rise = Math.min(1, (24 - root.life) / 6) * Math.min(1, root.life / 6);
        [-18, -4, 10, 22].forEach((offset, index) => {
          const tall = (54 + index * 9 - Math.abs(offset)) * rise;
          ctx.fillStyle = index % 2 ? '#5d4037' : '#6d4c41';
          ctx.strokeStyle = '#2e1b14';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(root.x + offset - 7, ground);
          ctx.quadraticCurveTo(root.x + offset - 4, ground - tall * 0.6, root.x + offset + 2, ground - tall);
          ctx.lineTo(root.x + offset + 7, ground);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#7cb342';
          ctx.fillRect(root.x + offset - 2, ground - tall * 0.5, 5, 3);
        });
      }
      ctx.restore();
    });

    ctx.save();
    ctx.translate(cx, y);
    ctx.scale(facing, 1);
    const outline = '#1b2e12';
    // antlers made of branches, with leaves
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(side * 18, 4);
      ctx.lineTo(side * 26, -18);
      ctx.lineTo(side * 40, -30);
      ctx.moveTo(side * 26, -18);
      ctx.lineTo(side * 22, -34);
      ctx.stroke();
      ctx.fillStyle = '#8bc34a';
      [[side * 40, -32], [side * 22, -36]].forEach(([leafX, leafY]) => {
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 6, 3, side * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.lineCap = 'butt';
    // stubby bark legs
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-half + 10, h - 22, 24, 22);
    ctx.fillRect(half - 34, h - 22, 24, 22);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.strokeRect(-half + 10, h - 22, 24, 22);
    ctx.strokeRect(half - 34, h - 22, 24, 22);
    // the mossy body block
    ctx.fillStyle = '#4e7d3a';
    ctx.fillRect(-half, breathe, w, h - 22 - breathe);
    ctx.strokeRect(-half, breathe, w, h - 22 - breathe);
    ctx.fillStyle = '#3b6b2c';
    [[-30, 40, 16], [18, 64, 20], [-12, 84, 14], [24, 22, 10]].forEach(([spotX, spotY, size]) => {
      ctx.beginPath();
      ctx.ellipse(spotX, spotY, size, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    // grass fringe on top and at the bottom of the body
    ctx.fillStyle = '#7cb342';
    for (let tuft = -half; tuft < half; tuft += 8) {
      ctx.beginPath();
      ctx.moveTo(tuft, breathe + 2);
      ctx.lineTo(tuft + 4, breathe - 7 - (Math.abs(tuft) % 5));
      ctx.lineTo(tuft + 8, breathe + 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#33691e';
    for (let tuft = -half; tuft < half; tuft += 10) {
      ctx.beginPath();
      ctx.moveTo(tuft, h - 24);
      ctx.lineTo(tuft + 5, h - 14);
      ctx.lineTo(tuft + 10, h - 24);
      ctx.closePath();
      ctx.fill();
    }
    // face: glowing amber eyes and a mouth with fangs
    ctx.save();
    ctx.shadowColor = '#ffca28';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(-4, 24 + breathe, 12, 9);
    ctx.fillRect(18, 24 + breathe, 12, 9);
    ctx.restore();
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(2, 27 + breathe, 4, 4);
    ctx.fillRect(24, 27 + breathe, 4, 4);
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(-4, 44 + breathe, 36, 12);
    ctx.fillStyle = '#fff8e1';
    for (let fang = 0; fang < 5; fang += 1) {
      ctx.beginPath();
      ctx.moveTo(-3 + fang * 7, 44 + breathe);
      ctx.lineTo(0 + fang * 7, 50 + breathe);
      ctx.lineTo(3 + fang * 7, 44 + breathe);
      ctx.closePath();
      ctx.fill();
    }
    // mushrooms on its shoulders (red ones and a glowing blue one)
    [[-half + 6, 'red'], [half - 16, 'red'], [-half + 20, 'glow']].forEach(([mushX, kind]) => {
      ctx.fillStyle = '#efebe9';
      ctx.fillRect(mushX + 3, breathe - 6, 4, 8);
      ctx.save();
      if (kind === 'glow') {
        ctx.shadowColor = '#4dd0e1';
        ctx.shadowBlur = 10;
      }
      ctx.fillStyle = kind === 'glow' ? '#4dd0e1' : '#e53935';
      ctx.beginPath();
      ctx.ellipse(mushX + 5, breathe - 7, 8, 5, 0, Math.PI, 0);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#fff';
      ctx.fillRect(mushX + 1, breathe - 10, 2, 2);
      ctx.fillRect(mushX + 7, breathe - 9, 2, 2);
    });
    // long mossy arms: the front one swings forward when it attacks
    const swing = this.isAttacking ? 1 : 0;
    ctx.fillStyle = '#558b2f';
    ctx.strokeStyle = outline;
    ctx.fillRect(-half - 12, 40, 14, 56);
    ctx.strokeRect(-half - 12, 40, 14, 56);
    ctx.save();
    ctx.translate(half + 4, 42);
    ctx.rotate(swing ? -1.2 : 0.05 * Math.sin(time * 2));
    ctx.fillRect(-6, 0, 14, 58);
    ctx.strokeRect(-6, 0, 14, 58);
    ctx.fillStyle = '#efebe9';
    [-4, 1, 6].forEach((clawX) => {
      ctx.beginPath();
      ctx.moveTo(clawX - 2, 58);
      ctx.lineTo(clawX, 66);
      ctx.lineTo(clawX + 2, 58);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
    ctx.restore();
  }

  // REFLECTER 2.0: the same boxy silhouette as Reflecter (head block, visor, torso, two legs) in black armor,
  // with glowing circuits, a prism core and two small mirror shards orbiting around him
  drawReflecterUpgradeBody() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const y = this.position.y;
    const w = this.width;
    const cx = x + w / 2;
    const light = getReflecterLightColor(this);
    const facing = this.attacksToTheRight ? 1 : -1;
    const pulse = 0.5 + Math.sin(time * 3) * 0.5;
    const plate = '#161c28';
    const edge = '#2a3344';
    ctx.save();
    // soft aura
    const aura = ctx.createRadialGradient(cx, y + 60, 10, cx, y + 60, 76);
    aura.addColorStop(0, hexToRgba(light, 0.14 + pulse * 0.08));
    aura.addColorStop(1, hexToRgba(light, 0));
    ctx.fillStyle = aura;
    ctx.fillRect(x - 60, y - 20, w + 120, 160);
    // mirror shards behind him
    const shards = [0, Math.PI].map((offset) => {
      const angle = time * 1.6 + offset;
      return { angle, sx: cx + Math.cos(angle) * 42, sy: y + 60 + Math.sin(angle) * 12 + Math.sin(time * 2 + offset) * 4 };
    });
    const drawShard = (shard) => {
      ctx.save();
      ctx.translate(shard.sx, shard.sy);
      ctx.rotate(time * 2 + shard.angle);
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i;
        ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 6, Math.sin(a) * 6);
      }
      ctx.closePath();
      ctx.fillStyle = hexToRgba(light, 0.35);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };
    shards.filter((shard) => Math.sin(shard.angle) < 0).forEach(drawShard);
    ctx.restore();
    // the block body again on top of the shards behind him
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, w, this.height);
    ctx.save();
    // head block (same place as Reflecter's) with a light trim
    ctx.fillStyle = '#0d1119';
    ctx.fillRect(x + 7, y + 12, w - 14, 30);
    ctx.strokeStyle = light;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 7, y + 12, w - 14, 30);
    ctx.fillStyle = plate;
    ctx.fillRect(x + 11, y + 14, w - 22, 4);
    ctx.fillStyle = hexToRgba(light, 0.5 + pulse * 0.5);
    ctx.fillRect(x + 26, y + 5, 8, 7);
    ctx.fillStyle = edge;
    ctx.fillRect(x + 28, y + 2, 4, 3);
    // visor band and the two square eyes, shifted slightly toward where he looks
    ctx.fillStyle = '#020307';
    ctx.fillRect(x + 12, y + 20, w - 24, 12);
    ctx.shadowColor = light;
    ctx.shadowBlur = 10;
    const look = facing * 1.5;
    ctx.fillStyle = light;
    ctx.fillRect(x + 18 + look, y + 21, 8, 8);
    ctx.fillRect(x + w - 26 + look, y + 21, 8, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 20 + look, y + 23, 4, 4);
    ctx.fillRect(x + w - 24 + look, y + 23, 4, 4);
    ctx.shadowBlur = 0;
    // mouth grille
    ctx.fillStyle = hexToRgba(light, 0.6);
    for (let i = 0; i < 3; i += 1) ctx.fillRect(x + 22 + i * 6, y + 35, 4, 3);
    // torso plate (same box as Reflecter's) with a light frame
    ctx.fillStyle = '#10141d';
    ctx.fillRect(x + 10, y + 48, w - 20, 44);
    ctx.strokeStyle = light;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 48, w - 20, 44);
    ctx.fillStyle = plate;
    ctx.fillRect(x + 14, y + 52, w - 28, 36);
    // side panels (arms) with glowing stripes
    ctx.fillStyle = '#020307';
    ctx.fillRect(x + 1, y + 48, 7, 40);
    ctx.fillRect(x + w - 8, y + 48, 7, 40);
    ctx.fillStyle = light;
    ctx.fillRect(x + 3, y + 56, 3, 20);
    ctx.fillRect(x + w - 6, y + 56, 3, 20);
    // circuit lines from the core with a pulse running along them
    ctx.strokeStyle = hexToRgba(light, 0.7);
    ctx.lineWidth = 1.5;
    const circuits = [
      [[24, 60], [18, 60], [18, 54]],
      [[36, 60], [42, 60], [42, 54]],
      [[24, 72], [18, 72], [18, 86]],
      [[36, 72], [42, 72], [42, 86]],
    ];
    const t = (time * 1.2) % 1;
    circuits.forEach((path) => {
      ctx.beginPath();
      path.forEach(([px, py], index) => (index ? ctx.lineTo(x + px, y + py) : ctx.moveTo(x + px, y + py)));
      ctx.stroke();
      const [ax, ay] = path[1];
      const [bx, by] = path[2];
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + ax + (bx - ax) * t - 1, y + ay + (by - ay) * t - 1, 2.5, 2.5);
    });
    // prism core: the same tall core as Reflecter, cut like a crystal
    ctx.shadowColor = light;
    ctx.shadowBlur = 12 + pulse * 10;
    const core = ctx.createLinearGradient(x + 24, y + 55, x + 36, y + 77);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.45, light);
    core.addColorStop(1, hexToRgba(light, 0.6));
    ctx.beginPath();
    [[30, 54], [37, 60], [37, 72], [30, 78], [23, 72], [23, 60]].forEach(([px, py], index) => (index ? ctx.lineTo(x + px, y + py) : ctx.moveTo(x + px, y + py)));
    ctx.closePath();
    ctx.fillStyle = core;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, y + 54);
    ctx.lineTo(cx + Math.sin(time * 2) * 4, y + 66);
    ctx.lineTo(cx, y + 78);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2.0', cx, y + 88);
    // waist and legs (same place as Reflecter's) with glowing knees
    ctx.fillStyle = '#020307';
    ctx.fillRect(x + 8, y + 92, w - 16, 6);
    [8, w - 24].forEach((legX) => {
      ctx.fillStyle = '#0b0f16';
      ctx.fillRect(x + legX, y + 98, 16, 22);
      ctx.strokeStyle = edge;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + legX, y + 98, 16, 22);
      ctx.fillStyle = hexToRgba(light, 0.4 + pulse * 0.5);
      ctx.fillRect(x + legX + 5, y + 103, 6, 4);
      ctx.fillStyle = light;
      ctx.fillRect(x + legX + 2, y + 116, 12, 2);
    });
    ctx.restore();
    // mirror shards in front
    ctx.save();
    shards.filter((shard) => Math.sin(shard.angle) >= 0).forEach(drawShard);
    ctx.restore();
  }

  // NEO SCAMMER: Scammer himself (spiky hair, white body, black jacket, pink and yellow glasses) wearing the NEO armor:
  // magenta plates, a purple wing, a yellow lightning wing and a BIG SHOT cannon arm
  drawNeoScammer() {
    const time = performance.now() / 1000;
    const x = this.position.x;
    const width = this.width;
    const height = this.height;
    const centerX = x + width / 2;
    const facing = this.attacksToTheRight ? 1 : -1;
    const y = this.position.y + Math.sin(time * 2.4) * 3;
    const flap = Math.sin(time * 5) * 6;
    const outline = () => {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
    };
    ctx.save();
    // once his ULTIMA OFERTA fails the armor is gone: just a broken Scammer
    if (!this.neoBroken) {
    // purple wing
    ctx.fillStyle = '#7b1fa2';
    outline();
    ctx.beginPath();
    ctx.moveTo(centerX - 30, y + 62);
    ctx.lineTo(centerX - 108, y + 18 + flap);
    ctx.lineTo(centerX - 122, y + 84 + flap);
    ctx.lineTo(centerX - 92, y + 126);
    ctx.lineTo(centerX - 40, y + 112);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#4a148c';
    ctx.lineWidth = 2;
    for (let feather = 0; feather < 3; feather += 1) {
      ctx.beginPath();
      ctx.moveTo(centerX - 36, y + 86);
      ctx.lineTo(centerX - (78 + feather * 14), y + 34 + feather * 28 + flap * 0.6);
      ctx.stroke();
    }
    // yellow lightning wing
    ctx.fillStyle = '#fdd835';
    outline();
    ctx.beginPath();
    ctx.moveTo(centerX + 30, y + 62);
    ctx.lineTo(centerX + 102, y + 8 + flap);
    ctx.lineTo(centerX + 86, y + 50);
    ctx.lineTo(centerX + 128, y + 44 + flap);
    ctx.lineTo(centerX + 94, y + 90);
    ctx.lineTo(centerX + 122, y + 104 + flap);
    ctx.lineTo(centerX + 40, y + 114);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#f9a825';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + 40, y + 80);
    ctx.lineTo(centerX + 96, y + 28 + flap);
    ctx.moveTo(centerX + 44, y + 96);
    ctx.lineTo(centerX + 104, y + 70 + flap);
    ctx.stroke();
    }
    // Scammer's white block body with his black jacket
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(x, y + 16, width, height - 16);
    outline();
    ctx.strokeRect(x, y + 16, width, height - 16);
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(x, y + 80, width, 72);
    ctx.fillStyle = '#f2f2f2';
    ctx.beginPath();
    ctx.moveTo(centerX - 14, y + 80);
    ctx.lineTo(centerX + 14, y + 80);
    ctx.lineTo(centerX, y + 112);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 3, y + 84, 6, 34);
    // dirt smudges
    ctx.fillStyle = 'rgba(120, 120, 120, 0.55)';
    [[x + 16, y + 30, 6], [x + width - 18, y + 64, 5], [x + 22, y + 166, 7], [x + width - 26, y + 176, 5]].forEach(([smudgeX, smudgeY, radius]) => {
      ctx.beginPath();
      ctx.arc(smudgeX, smudgeY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    // spiky black hair
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 26);
    for (let spike = 0; spike <= 8; spike += 1) {
      const spikeX = x - 4 + spike * ((width + 8) / 8);
      ctx.lineTo(spikeX, spike % 2 === 0 ? y + 2 + Math.sin(time * 6 + spike) * 2 : y + 18);
    }
    ctx.lineTo(x + width + 4, y + 26);
    ctx.closePath();
    ctx.fill();
    // round glasses: pink and yellow
    [[centerX - 19, '#f48fb1'], [centerX + 19, '#fdd835']].forEach(([lensX, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lensX, y + 46, 14, 0, Math.PI * 2);
      ctx.fill();
      outline();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(lensX - 7, y + 38, 5, 4);
    });
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 5, y + 44);
    ctx.lineTo(centerX + 5, y + 44);
    ctx.stroke();
    // a crazy salesman grin
    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 18, y + 64, 36, 10);
    ctx.fillStyle = '#fff';
    for (let tooth = 0; tooth < 6; tooth += 1) ctx.fillRect(centerX - 16 + tooth * 6, y + 64, 4, 3);
    if (!this.neoBroken) {
    // NEO armor: magenta shoulder plates
    [[-1, x], [1, x + width]].forEach(([side, edgeX]) => {
      ctx.fillStyle = '#e91e63';
      outline();
      ctx.beginPath();
      ctx.moveTo(edgeX + side * 20, y + 72);
      ctx.lineTo(edgeX - side * 30, y + 64);
      ctx.lineTo(edgeX - side * 26, y + 102);
      ctx.lineTo(edgeX + side * 10, y + 114);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#f48fb1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(edgeX + side * 14, y + 76);
      ctx.lineTo(edgeX - side * 22, y + 70);
      ctx.stroke();
    });
    // magenta coat tails
    [[-1, x], [1, x + width]].forEach(([side, edgeX]) => {
      ctx.fillStyle = '#ad1457';
      outline();
      ctx.beginPath();
      ctx.moveTo(edgeX + side * 6, y + 120);
      ctx.lineTo(edgeX - side * 18, y + 120);
      ctx.lineTo(edgeX - side * 10, y + height - 4);
      ctx.lineTo(edgeX + side * 16, y + height - 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    // a yellow heart on the chest armor
    ctx.fillStyle = '#fdd835';
    ctx.shadowColor = '#fdd835';
    ctx.shadowBlur = 8 + Math.sin(time * 4) * 4;
    ctx.beginPath();
    ctx.moveTo(centerX + facing * 26, y + 132);
    ctx.bezierCurveTo(centerX + facing * 26 - 10, y + 122, centerX + facing * 26 - 16, y + 132, centerX + facing * 26, y + 142);
    ctx.bezierCurveTo(centerX + facing * 26 + 16, y + 132, centerX + facing * 26 + 10, y + 122, centerX + facing * 26, y + 132);
    ctx.fill();
    ctx.shadowBlur = 0;
    // the BIG SHOT cannon arm
    ctx.save();
    ctx.translate(centerX + facing * 34, y + 94);
    ctx.scale(facing, 1);
    ctx.fillStyle = '#ad1457';
    ctx.fillRect(0, -11, 60, 22);
    outline();
    ctx.strokeRect(0, -11, 60, 22);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(16, -11, 5, 22);
    ctx.fillRect(34, -11, 5, 22);
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(56, -15, 10, 30);
    if (this.neoCharge > 0) {
      const charge = 1 - this.neoCharge / 45;
      ctx.fillStyle = `rgba(255, 238, 88, ${0.5 + Math.random() * 0.5})`;
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(70, 0, 6 + charge * 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
    }
    // melee swing
    if (this.isAttacking) {
      const area = this.attackArea;
      ctx.fillStyle = 'rgba(233, 30, 99, 0.55)';
      ctx.fillRect(area.x, area.y, area.width, area.height);
    }
    // glitchy salesman text
    if (Math.floor(time * 2) % 6 === 0) {
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = Math.floor(time * 10) % 2 === 0 ? '#ff4081' : '#fdd835';
      ctx.fillText(this.neoTired ? '[[BATERIA BAJA]]' : '[[BIG SHOT]]', centerX, y - 12);
    }
    if (this.neoTired) {
      // worn out: sparks from the armor and sweat
      ctx.strokeStyle = Math.random() > 0.5 ? '#fdd835' : '#ffffff';
      ctx.lineWidth = 2;
      for (let spark = 0; spark < 2; spark += 1) {
        const sparkX = x + (Math.random() > 0.5 ? 0 : width) + (Math.random() - 0.5) * 20;
        const sparkY = y + 70 + Math.random() * 40;
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + (Math.random() - 0.5) * 16, sparkY + (Math.random() - 0.5) * 16);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
      const drop = (time * 60) % 30;
      ctx.beginPath();
      ctx.arc(x + width - 6, y + 30 + drop, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // the Corona de Rey from Scammer's shop (plastic, but golden)
  drawShopCrown() {
    const centerX = this.position.x + this.width / 2;
    const base = this.position.y - 3;
    const time = performance.now() / 1000;
    ctx.save();
    ctx.translate(centerX, base);
    ctx.rotate(Math.sin(time * 3) * 0.05);
    ctx.fillStyle = '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-16, -12);
    ctx.lineTo(-8, -5);
    ctx.lineTo(0, -17);
    ctx.lineTo(8, -5);
    ctx.lineTo(16, -12);
    ctx.lineTo(16, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(-16, -4, 32, 4);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(0, -7, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#42a5f5';
    ctx.beginPath();
    ctx.arc(-9, -3, 2, 0, Math.PI * 2);
    ctx.arc(9, -3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(-12, -9, 3, 3);
    ctx.restore();
  }

  // the small bronze armor Omegarius gives Reflecter in the secret level
  drawOmegariusArmor() {
    const x = this.position.x;
    const y = this.position.y;
    const width = this.width;
    const time = performance.now() / 1000;
    const shine = 0.55 + Math.sin(time * 3) * 0.2;
    ctx.save();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    // shoulder guards
    [x - 4, x + width - 14].forEach((plateX) => {
      ctx.fillStyle = '#6b4423';
      ctx.beginPath();
      ctx.moveTo(plateX, y + 56);
      ctx.lineTo(plateX, y + 49);
      ctx.quadraticCurveTo(plateX + 9, y + 40, plateX + 18, y + 49);
      ctx.lineTo(plateX + 18, y + 56);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 202, 40, ${shine})`;
      ctx.beginPath();
      ctx.moveTo(plateX + 3, y + 50);
      ctx.quadraticCurveTo(plateX + 9, y + 44, plateX + 15, y + 50);
      ctx.stroke();
      ctx.strokeStyle = '#111';
    });
    // bronze frame around the chest light
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 11, y + 49, width - 22, 42);
    ctx.strokeStyle = `rgba(255, 202, 40, ${shine})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 14, y + 52, width - 28, 36);
    // knee guards
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(x + 7, y + 101, 18, 5);
    ctx.fillRect(x + width - 25, y + 101, 18, 5);
    ctx.fillStyle = `rgba(255, 202, 40, ${shine})`;
    ctx.fillRect(x + 14, y + 102, 4, 3);
    ctx.fillRect(x + width - 18, y + 102, 4, 3);
    if (this.omegariusArmorPlus) {
      // the better armor: helmet band with a small crest, side plates, shin guards and a gold glow
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(x + 6, y + 6, width - 12, 7);
      ctx.strokeRect(x + 6, y + 6, width - 12, 7);
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 6, y + 6);
      ctx.lineTo(x + width / 2, y - 4);
      ctx.lineTo(x + width / 2 + 6, y + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 202, 40, ${shine + 0.2})`;
      ctx.fillRect(x + width / 2 - 1.5, y - 1, 3, 6);
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(x + 2, y + 58, 8, 28);
      ctx.fillRect(x + width - 10, y + 58, 8, 28);
      ctx.strokeRect(x + 2, y + 58, 8, 28);
      ctx.strokeRect(x + width - 10, y + 58, 8, 28);
      ctx.fillRect(x + 9, y + 108, 14, 10);
      ctx.fillRect(x + width - 23, y + 108, 14, 10);
      ctx.strokeRect(x + 9, y + 108, 14, 10);
      ctx.strokeRect(x + width - 23, y + 108, 14, 10);
      ctx.fillStyle = `rgba(255, 202, 40, ${shine})`;
      ctx.fillRect(x + 5, y + 62, 2, 20);
      ctx.fillRect(x + width - 7, y + 62, 2, 20);
      ctx.strokeStyle = `rgba(255, 202, 40, ${0.25 + Math.sin(time * 4) * 0.15})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 3, y - 3, width + 6, this.height + 6);
    }
    ctx.restore();
  }

  drawReflecterShield() {
    const upgraded = isReflecterUpgrade(this);
    const mirrorLuck = isReflecterMirrorLuck(this) && !upgraded;
    const lightColor = getReflecterLightColor(this);
    ctx.strokeStyle = hexToRgba(lightColor, 0.82);
    ctx.lineWidth = upgraded ? 6 : mirrorLuck ? 7 : 5;
    ctx.beginPath();
    ctx.ellipse(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.width / 2 + (upgraded ? 22 : mirrorLuck ? 24 : 16),
      this.height / 2 + (upgraded ? 20 : mirrorLuck ? 18 : 12),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    if (upgraded) {
      ctx.strokeStyle = hexToRgba(lightColor, 0.28);
      ctx.lineWidth = 14;
      ctx.stroke();
    } else if (mirrorLuck) {
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.36)';
      ctx.lineWidth = 16;
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawKaiokenAura() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const pulse = 1 + Math.sin(this.kaiokenTimer * 0.35) * 0.08;
    const radius = (this.height / 2 + 20) * pulse;

    ctx.fillStyle = 'rgba(183, 28, 28, 0.16)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 6, radius * 0.72, radius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.9)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.28)';
    ctx.lineWidth = 22;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 205, 210, 0.7)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i += 1) {
      const angle = i * (Math.PI / 5) - this.kaiokenTimer * 0.045;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * (radius - 18), centerY + Math.sin(angle) * (radius - 18));
      ctx.lineTo(centerX + Math.cos(angle) * (radius + 26), centerY + Math.sin(angle) * (radius + 26));
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.64)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      const sparkX = this.position.x - 12 + ((i * 23 + this.kaiokenTimer * 3) % (this.width + 24));
      const sparkY = this.position.y + 10 + ((i * 31 + this.kaiokenTimer * 2) % (this.height - 10));
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY - 9);
      ctx.lineTo(sparkX + 5, sparkY);
      ctx.lineTo(sparkX - 2, sparkY + 10);
      ctx.stroke();
    }
  }

  drawSwitcherDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const collarColor = this.getSwitcherModeColor();
    const prism = isSwitcherPrism(this);
    const overdrive = isPrismOverdriveActive();

    if (prism || overdrive) {
      ctx.strokeStyle = overdrive ? 'rgba(253, 216, 53, 0.82)' : hexToRgba(collarColor, 0.62);
      ctx.lineWidth = overdrive ? 5 : 3;
      ctx.strokeRect(x - 6, y + 4, this.width + 12, this.height - 8);
      if (prism) {
        ctx.strokeStyle = 'rgba(227, 242, 253, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 11, y - 2, this.width + 22, this.height + 4);
      }
    }

    ctx.fillStyle = prism ? '#1d2630' : '#37474f';
    ctx.fillRect(x + 8, y + 10, this.width - 16, 30);
    ctx.fillStyle = prism ? '#0d141a' : '#263238';
    ctx.fillRect(x + 14, y + 22, this.width - 28, 8);
    ctx.fillStyle = prism ? '#2b3440' : this.baseColor;
    ctx.fillRect(x, y + 46, this.width, 48);
    ctx.fillStyle = prism ? '#111820' : '#263238';
    ctx.fillRect(x + 10, y + 42, this.width - 20, 10);
    ctx.fillStyle = collarColor;
    ctx.fillRect(x + 25, y + 41, 10, 12);
    if (prism) {
      const prismColors = ['#ef5350', '#42a5f5', '#66bb6a', '#fdd835'];
      prismColors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8 + index * 11, y + 53, 10, 39 - index * 3);
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 7, y + 48);
      ctx.lineTo(x + this.width - 6, y + 88);
      ctx.moveTo(x + this.width - 7, y + 48);
      ctx.lineTo(x + 7, y + 88);
      ctx.stroke();
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(x + 20, y + 26, this.width - 40, 4);
    }
    ctx.fillStyle = collarColor;
    ctx.fillRect(x + 8, y + 58, this.width - 16, 5);
    ctx.fillStyle = switcherModeColors[switcherModes[(this.switcherModeIndex + 1) % switcherModes.length]];
    ctx.fillRect(x + 8, y + 68, this.width - 16, 4);
    ctx.fillStyle = switcherModeColors[switcherModes[(this.switcherModeIndex + 2) % switcherModes.length]];
    ctx.fillRect(x + 8, y + 78, this.width - 16, 4);
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(x + 6, y + 96, 18, 24);
    ctx.fillRect(x + this.width - 24, y + 96, 18, 24);

    if (this.switcherArmorTimer > 0) {
      ctx.strokeStyle = hexToRgba(switcherModeColors.yellow, 0.8);
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
      if (prism) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 14, y - 14, this.width + 28, this.height + 28);
      }
    }

    if (this.switcherRedStrikeTimer > 0 && this.switcherRedStrikeArea) {
      ctx.fillStyle = hexToRgba(switcherModeColors.red, 0.48);
      ctx.fillRect(
        this.switcherRedStrikeArea.x,
        this.switcherRedStrikeArea.y,
        this.switcherRedStrikeArea.width,
        this.switcherRedStrikeArea.height
      );
      ctx.strokeStyle = switcherModeColors.red;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        this.switcherRedStrikeArea.x,
        this.switcherRedStrikeArea.y,
        this.switcherRedStrikeArea.width,
        this.switcherRedStrikeArea.height
      );
    }
  }

  drawSorcererDetails() {
    const x = this.position.x;
    const y = this.position.y;

    ctx.fillStyle = '#17101f';
    ctx.fillRect(x - 8, y + 30, this.width + 16, 90);
    ctx.fillStyle = '#2a123b';
    ctx.fillRect(x + 6, y + 44, this.width - 12, 72);
    ctx.fillStyle = '#4a1f69';
    ctx.fillRect(x + 8, y + 48, 8, 64);
    ctx.fillRect(x + this.width - 16, y + 48, 8, 64);
    ctx.fillStyle = '#08080c';
    ctx.fillRect(x + 12, y + 52, this.width - 24, 16);
    ctx.fillStyle = '#d1b3ff';
    ctx.fillRect(x + 20, y + 56, 6, 5);
    ctx.fillRect(x + this.width - 26, y + 56, 6, 5);

    ctx.fillStyle = '#2f1747';
    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y - 20);
    ctx.lineTo(x + this.width + 14, y + 36);
    ctx.lineTo(x - 14, y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5e2a84';
    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y - 10);
    ctx.lineTo(x + this.width - 4, y + 30);
    ctx.lineTo(x + 8, y + 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#12091b';
    ctx.fillRect(x - 6, y + 32, this.width + 12, 10);
    ctx.fillStyle = '#6d2c91';
    ctx.fillRect(x + 8, y + 34, this.width - 16, 4);

    ctx.fillStyle = '#6d2c91';
    ctx.fillRect(x + 26, y + 76, 8, 34);
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(x + 30, y + 72, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(x - 10, y + 84, 14, 36);
    ctx.fillRect(x + this.width - 4, y + 84, 14, 36);
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(x - 8, y + 98, 10, 5);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + this.width - 2, y + 98, 10, 5);
  }

  drawJackpotAura() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const centerY = y + this.height / 2;
    const pulse = 1 + Math.sin(this.gamblerInvincibleTimer * 0.22) * 0.08;
    const outerRadius = (this.height / 2 + 30) * pulse;
    const colors = getJackpotAuraColors(this);

    ctx.strokeStyle = colors.outer;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.spark;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i += 1) {
      const angle = i * (Math.PI / 4) + this.gamblerInvincibleTimer * 0.035;
      const inner = outerRadius + 18;
      const outer = outerRadius + 34;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      ctx.stroke();
    }
  }

  drawScammerDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const width = this.width;
    const height = this.height;
    const centerX = x + width / 2;

    ctx.fillStyle = 'rgba(120, 120, 120, 0.5)';
    [[0.2, 0.84, 7], [0.7, 0.9, 5], [0.45, 0.78, 4], [0.8, 0.22, 4], [0.15, 0.4, 3]].forEach(([spotX, spotY, radius]) => {
      ctx.beginPath();
      ctx.arc(x + width * spotX, y + height * spotY, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(x, y + 52, width, 46);
    ctx.fillStyle = '#f2f2f2';
    ctx.beginPath();
    ctx.moveTo(centerX - 11, y + 52);
    ctx.lineTo(centerX + 11, y + 52);
    ctx.lineTo(centerX, y + 74);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(centerX, y + 55);
    ctx.lineTo(centerX + 4, y + 62);
    ctx.lineTo(centerX, y + 82);
    ctx.lineTo(centerX - 4, y + 62);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 11, y + 52);
    ctx.lineTo(centerX - 4, y + 86);
    ctx.moveTo(centerX + 11, y + 52);
    ctx.lineTo(centerX + 4, y + 86);
    ctx.stroke();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 20);
    ctx.lineTo(x - 2, y - 4);
    ctx.lineTo(x + 8, y + 2);
    ctx.lineTo(x + 14, y - 10);
    ctx.lineTo(x + 24, y - 2);
    ctx.lineTo(x + 32, y - 12);
    ctx.lineTo(x + 40, y - 2);
    ctx.lineTo(x + 50, y - 9);
    ctx.lineTo(x + 56, y + 2);
    ctx.lineTo(x + width + 6, y - 2);
    ctx.lineTo(x + width + 4, y + 22);
    ctx.lineTo(x + width - 6, y + 14);
    ctx.lineTo(x + 6, y + 14);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.arc(centerX - 10, y + 30, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(centerX + 10, y + 30, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 3, y + 30);
    ctx.lineTo(centerX + 3, y + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 6, y + 44);
    ctx.quadraticCurveTo(centerX + 2, y + 48, centerX + 9, y + 42);
    ctx.stroke();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

    if (this.scammerRage) {
      const pulse = (Math.sin(performance.now() / 90) + 1) / 2;
      ctx.fillStyle = `rgba(213, 0, 0, ${0.22 + pulse * 0.12})`;
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = `rgba(255, 23, 68, ${0.55 + pulse * 0.45})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 6, y - 6, width + 12, height + 12);
      ctx.fillStyle = 'rgba(255, 82, 82, 0.9)';
      [[-10, 0], [10, 0]].forEach(([offsetX]) => {
        ctx.beginPath();
        ctx.arc(centerX + offsetX, y + 30, 4 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = 'rgba(224, 224, 224, 0.65)';
      [0, 1].forEach((side) => {
        const puffY = y - 4 - ((performance.now() / 9 + side * 15) % 28);
        ctx.beginPath();
        ctx.arc(side ? x + width + 4 : x - 4, puffY, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  drawShadowJesterDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const width = this.width;
    const height = this.height;
    const centerX = x + width / 2;
    const facing = this.attacksToTheRight ? 1 : -1;
    const time = performance.now() / 1000;

    ctx.strokeStyle = '#b39ddb';
    ctx.lineWidth = 5;
    ctx.beginPath();
    const tailBase = facing > 0 ? x + 4 : x + width - 4;
    ctx.moveTo(tailBase, y + height - 30);
    ctx.quadraticCurveTo(tailBase - facing * 40, y + height - 10, tailBase - facing * 34, y + height - 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tailBase - facing * 44, y + height - 56);
    ctx.lineTo(tailBase - facing * 34, y + height - 50);
    ctx.lineTo(tailBase - facing * 24, y + height - 58);
    ctx.stroke();

    ctx.fillStyle = '#1a1033';
    ctx.fillRect(x + 6, y + 58, width - 12, height - 76);
    ctx.fillStyle = '#4527a0';
    ctx.fillRect(x + 6, y + 58, (width - 12) / 2, height - 76);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 8, y + height - 12, 22, 12);
    ctx.fillRect(x + width - 30, y + height - 12, 22, 12);

    ctx.fillStyle = '#fdd835';
    for (let spike = 0; spike < 6; spike += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 4 + spike * ((width - 8) / 6), y + 58);
      ctx.lineTo(x + 4 + (spike + 0.5) * ((width - 8) / 6), y + 70);
      ctx.lineTo(x + 4 + (spike + 1) * ((width - 8) / 6), y + 58);
      ctx.fill();
    }

    // face: pale mask, slit eyes, rosy cheeks and one big zigzag grin
    ctx.fillStyle = '#d6cff0';
    ctx.beginPath();
    ctx.arc(centerX, y + 38, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(244, 143, 177, 0.75)';
    ctx.beginPath();
    ctx.arc(centerX - 14, y + 42, 4, 0, Math.PI * 2);
    ctx.arc(centerX + 14, y + 42, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(centerX - 8 + facing, y + 31, 5, 0, Math.PI * 2);
    ctx.arc(centerX + 8 + facing, y + 31, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 9 + facing * 2, y + 28, 2, 6);
    ctx.fillRect(centerX + 7 + facing * 2, y + 28, 2, 6);
    ctx.beginPath();
    ctx.moveTo(centerX - 16, y + 41);
    ctx.quadraticCurveTo(centerX, y + 60, centerX + 16, y + 41);
    ctx.quadraticCurveTo(centerX, y + 47, centerX - 16, y + 41);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let step = 0; step <= 8; step += 1) {
      const toothX = centerX - 12 + step * 3;
      const toothY = y + 46 + (step % 2 ? 4 : 0);
      if (step === 0) ctx.moveTo(toothX, toothY);
      else ctx.lineTo(toothX, toothY);
    }
    ctx.stroke();

    const hatBob = Math.sin(time * 4) * 3;
    [[-1, '#7e57c2'], [1, '#1a1033']].forEach(([side, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX - 20 * side, y + 20);
      ctx.quadraticCurveTo(centerX + side * 10, y - 22, centerX + side * 38, y - 4 + hatBob * side);
      ctx.lineTo(centerX + side * 4, y + 22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.stroke();
      ctx.fillStyle = '#fdd835';
      ctx.beginPath();
      ctx.arc(centerX + side * 38, y - 4 + hatBob * side, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawGamblerDetails() {
    if (this.secretVariant === 'shadowJester') {
      this.drawShadowJesterDetails();
      return;
    }
    if (this.secretVariant === 'scammer') {
      this.drawScammerDetails();
      return;
    }
    const x = this.position.x;
    const y = this.position.y;

    ctx.fillStyle = '#111';
    ctx.fillRect(x - 8, y + 12, this.width + 16, 8);
    ctx.fillRect(x + 10, y, this.width - 20, 18);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + 12, y + 8, this.width - 24, 5);

    ctx.fillStyle = '#263238';
    ctx.fillRect(x + 7, y + 44, this.width - 14, 52);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 26, y + 48, 10, 42);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(x + 28, y + 62, 6, 8);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 4, y + 56, 18, 26);
    ctx.fillStyle = '#111';
    ctx.fillRect(x - 1, y + 59, 12, 20);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + this.width - 8, y + 54, 14, 14);

    if (this.gamblerLuckWaveTimer > 0) {
      const progress = getGamblerLuckWaveProgress(this.gamblerLuckWaveTimer, this);
      const centerX = x + this.width / 2;
      const centerY = y + this.height / 2;
      const radius = 34 + progress * 92;
      ctx.strokeStyle = `rgba(102, 255, 128, ${0.72 * (1 - progress)})`;
      ctx.lineWidth = 6 - progress * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(0, 255, 90, ${0.34 * (1 - progress)})`;
      ctx.lineWidth = 14 - progress * 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.gamblerDamageBoostTimer > 0 || this.gamblerSpeedBoostTimer > 0) {
      ctx.strokeStyle = this.gamblerSpeedBoostTimer > 0 ? '#42a5f5' : '#fdd835';
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
    }

    if (this.gamblerStunTimer > 0 && !(this.robotGlitchTimer > 0)) {
      ctx.fillStyle = '#ffeb3b';
      ctx.font = '900 18px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('XXX', x + this.width / 2, y - 12);
    }

    if (this.gamblerInvincibleTimer > 0) {
      this.drawJackpotAura();
    }

    if (this.gamblerLuckBonus > 0) {
      ctx.fillStyle = '#66bb6a';
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`LUCK +${Math.round(this.gamblerLuckBonus * 100)}%`, x + this.width / 2, y - 54);
    }
  }

  drawChronoRivalAura() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const time = performance.now() / 1000;
    const boost = this.chronoAuraBoost || 0;
    ctx.save();
    ctx.globalAlpha = 0.35 + boost * 0.25 + Math.sin(time * 6) * 0.08;
    ctx.strokeStyle = '#448aff';
    ctx.shadowColor = '#2979ff';
    ctx.shadowBlur = 18 + boost * 14;
    ctx.lineWidth = 4 + boost * 3;
    ctx.beginPath();
    const flames = 9;
    for (let flame = 0; flame <= flames; flame += 1) {
      const t = flame / flames;
      const flameX = x - 8 + t * (this.width + 16);
      const flameY = y - 10 - Math.abs(Math.sin(time * 7 + flame)) * (14 + boost * 12);
      if (flame === 0) ctx.moveTo(flameX, y + this.height);
      ctx.lineTo(flameX, flameY);
    }
    ctx.lineTo(x + this.width + 8, y + this.height);
    ctx.stroke();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#82b1ff';
    for (let spark = 0; spark < 5; spark += 1) {
      const rise = ((time * 60 + spark * 23) % 90);
      ctx.fillRect(x + ((spark * 17) % this.width), y + this.height - rise, 3, 3);
    }
    ctx.restore();
    void centerX;
  }

  drawChronoDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    if (this.secretVariant === 'chronoRival') this.drawChronoRivalAura();

    ctx.fillStyle = '#05070d';
    ctx.fillRect(x + 10, y + 14, this.width - 20, 24);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(x + 16, y + 24, 8, 7);
    ctx.fillRect(x + this.width - 24, y + 24, 8, 7);

    ctx.fillStyle = '#111827';
    ctx.fillRect(x + 8, y + 46, this.width - 16, 46);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(centerX - 4, y + 48, 8, 44);
    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.arc(centerX, y + 68, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, y + 68);
    ctx.lineTo(centerX, y + 57);
    ctx.moveTo(centerX, y + 68);
    ctx.lineTo(centerX + 9, y + 73);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 9, y + 96, 15, 24);
    ctx.fillRect(x + this.width - 24, y + 96, 15, 24);

    if (this.chronoSlowTimer > 0) {
      ctx.strokeStyle = 'rgba(38, 198, 218, 0.85)';
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 5, y - 5, this.width + 10, this.height + 10);
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.52)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, y + 68, 32, -Math.PI / 2, Math.PI * 1.4);
      ctx.stroke();
    }

    if (this.chronoTimeStopTimer > 0) {
      ctx.fillStyle = 'rgba(224, 247, 250, 0.18)';
      ctx.fillRect(x - 10, y - 10, this.width + 20, this.height + 20);
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 12, y - 12, this.width + 24, this.height + 24);
    }

    if (this.chronoMarkTimer > 0) {
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.88)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, y + 36, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawFactoryRobotOverlay() {
    const robot = hybridEnemyTypes[this.secretVariant];
    const model = robot.model;
    const x = this.position.x;
    const y = this.position.y;
    const width = this.width;
    const height = this.height;
    const centerX = x + width / 2;
    const facing = this.attacksToTheRight ? 1 : -1;
    const time = performance.now() / 1000;
    const glitching = this.robotGlitchTimer > 0;
    const eyeOn = glitching ? Math.random() > 0.5 : Math.sin(time * 9) > -0.9;
    const bolt = (boltX, boltY) => {
      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(boltX, boltY, 3, 3);
    };
    const outline = () => {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
    };
    const glowEye = (eyeX, eyeY, eyeWidth, eyeHeight, color) => {
      if (!eyeOn) return;
      ctx.fillStyle = glitching ? '#ffee58' : color;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fillRect(eyeX, eyeY, eyeWidth, eyeHeight);
      ctx.shadowBlur = 0;
    };

    ctx.save();

    if (model === 'drone') {
      // a dented trash-can robot built from scrap, hovering on a sputtering thruster
      const hover = Math.sin(time * 5) * 3;
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(x + 6, y + 30 + hover, width - 12, height - 58);
      outline();
      ctx.strokeRect(x + 6, y + 30 + hover, width - 12, height - 58);
      ctx.fillStyle = '#78909c';
      ctx.fillRect(x + 10, y + 50 + hover, 18, 26);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(x + width - 26, y + 70 + hover, 16, 18);
      ctx.fillStyle = '#607d8b';
      ctx.beginPath();
      ctx.arc(centerX, y + 30 + hover, width / 2 - 6, Math.PI, 0);
      ctx.fill();
      outline();
      ctx.stroke();
      ctx.fillStyle = '#101418';
      ctx.fillRect(centerX - 10 + facing * 4, y + 14 + hover, 20, 12);
      glowEye(centerX - 5 + facing * 6, y + 17 + hover, 10, 6, '#ff1744');
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, y + 6 + hover);
      ctx.lineTo(centerX - facing * 6, y - 8 + hover);
      ctx.lineTo(centerX - facing * 14, y - 12 + hover);
      ctx.stroke();
      ctx.fillStyle = Math.floor(time * 3) % 2 === 0 ? '#ff5252' : '#5d1111';
      ctx.beginPath();
      ctx.arc(centerX - facing * 14, y - 12 + hover, 4, 0, Math.PI * 2);
      ctx.fill();
      // sputtering thruster instead of legs
      ctx.fillStyle = '#37474f';
      ctx.fillRect(centerX - 12, y + height - 28 + hover, 24, 12);
      const flame = 8 + Math.random() * 10;
      ctx.fillStyle = 'rgba(79, 195, 247, 0.8)';
      ctx.beginPath();
      ctx.moveTo(centerX - 8, y + height - 16 + hover);
      ctx.lineTo(centerX + 8, y + height - 16 + hover);
      ctx.lineTo(centerX, y + height - 16 + hover + flame);
      ctx.closePath();
      ctx.fill();
      [[x + 12, y + 44], [x + width - 15, y + 44], [x + 12, y + height - 34]].forEach(([bx, by]) => bolt(bx, by + hover));
    } else if (model === 'guard') {
      // a bulky security robot: wide rusty shoulders, riot visor and an arm cannon
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(x - 6, y + 28, width + 12, 26);
      outline();
      ctx.strokeRect(x - 6, y + 28, width + 12, 26);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(x + 4, y + 50, width - 8, height - 80);
      ctx.strokeRect(x + 4, y + 50, width - 8, height - 80);
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(x + 12, y + 62, width - 24, 12);
      ctx.fillStyle = '#111';
      ctx.font = '900 8px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SEGURIDAD', centerX, y + 71);
      // rust stains
      ctx.fillStyle = 'rgba(191, 87, 0, 0.55)';
      ctx.fillRect(x + 8, y + 82, 14, 10);
      ctx.fillRect(x + width - 20, y + 36, 10, 12);
      // helmet with visor
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(x + 10, y, width - 20, 30);
      ctx.strokeRect(x + 10, y, width - 20, 30);
      ctx.fillStyle = '#101418';
      ctx.fillRect(x + 14, y + 10, width - 28, 10);
      glowEye(centerX - 12 + facing * 6, y + 12, 24, 5, '#ff6d00');
      // legs
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(x + 8, y + height - 30, 18, 30);
      ctx.fillRect(x + width - 26, y + height - 30, 18, 30);
      // arm cannon on the front side
      const armX = facing > 0 ? x + width + 2 : x - 22;
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(armX, y + 52, 20, 30);
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(facing > 0 ? armX + 12 : armX - 12, y + 60, 20, 12);
      ctx.strokeRect(armX, y + 52, 20, 30);
      [[x - 2, y + 34], [x + width - 1, y + 34], [x + 8, y + 54], [x + width - 11, y + 54]].forEach(([bx, by]) => bolt(bx, by));
      if (this.robotChargeTimer > 0) {
        // siren on the helmet
        ctx.fillStyle = Math.floor(time * 10) % 2 === 0 ? '#ff1744' : '#2979ff';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 14;
        ctx.fillRect(centerX - 6, y - 8, 12, 8);
        ctx.shadowBlur = 0;
        // riot shield
        const shieldX = facing > 0 ? x + width + 4 : x - 22;
        ctx.fillStyle = 'rgba(176, 190, 197, 0.85)';
        ctx.fillRect(shieldX, y + 20, 18, height - 30);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 3;
        ctx.strokeRect(shieldX, y + 20, 18, height - 30);
        ctx.fillStyle = '#fdd835';
        ctx.fillRect(shieldX + 3, y + 40, 12, 6);
        ctx.fillRect(shieldX + 3, y + height - 40, 12, 6);
        // speed lines behind
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2;
        for (let line = 0; line < 4; line += 1) {
          const lineY = y + 20 + line * (height - 40) / 3;
          ctx.beginPath();
          ctx.moveTo(facing > 0 ? x - 8 : x + width + 8, lineY);
          ctx.lineTo(facing > 0 ? x - 40 : x + width + 40, lineY);
          ctx.stroke();
        }
      }
    } else if (model === 'clockwork') {
      // T-0: a failed, scrappy copy of Chrono. Same silhouette and colors, but dented, rusty and half broken.
      const unit = height / 120;
      ctx.fillStyle = '#1b2436';
      ctx.fillRect(x, y, width, height);
      // dents and rust patches on the body
      ctx.fillStyle = 'rgba(141, 85, 36, 0.55)';
      ctx.fillRect(x + 2, y + 40 * unit, 8, 14 * unit);
      ctx.fillRect(x + width - 12, y + 88 * unit, 10, 10 * unit);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(x + width - 8, y + 8 * unit, 6, 0, Math.PI * 2);
      ctx.fill();
      // visor like Chrono's, but cracked: one cyan eye still works, the other is almost dead
      ctx.fillStyle = '#05070d';
      ctx.fillRect(x + 10, y + 14 * unit, width - 20, 24 * unit);
      glowEye(x + 16, y + 24 * unit, 8, 7 * unit, '#26c6da');
      ctx.fillStyle = Math.sin(time * 17) > 0.7 ? '#26c6da' : '#3b1d1d';
      ctx.fillRect(x + width - 24, y + 24 * unit, 8, 7 * unit);
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + width - 30, y + 14 * unit);
      ctx.lineTo(x + width - 22, y + 22 * unit);
      ctx.lineTo(x + width - 26, y + 30 * unit);
      ctx.lineTo(x + width - 16, y + 38 * unit);
      ctx.stroke();
      // unfinished gear teeth sticking out of the head
      ctx.fillStyle = '#546e7a';
      for (let tooth = 0; tooth < 4; tooth += 1) ctx.fillRect(x + 14 + tooth * 9, y - 5, 5, 6);
      // chest plate with Chrono's cyan stripe, broken into flickering pieces
      ctx.fillStyle = '#111827';
      ctx.fillRect(x + 8, y + 46 * unit, width - 16, 46 * unit);
      for (let segment = 0; segment < 5; segment += 1) {
        const lit = glitching ? Math.random() > 0.5 : (segment + Math.floor(time * 6)) % 4 !== 0;
        ctx.fillStyle = lit ? '#26c6da' : '#0e3a40';
        ctx.fillRect(centerX - 4, y + (48 + segment * 9) * unit, 8, 7 * unit);
      }
      // Chrono's clock, cracked, with its hands spinning backwards and stuttering
      const clockY = y + 68 * unit;
      ctx.fillStyle = '#c9d6d8';
      ctx.beginPath();
      ctx.arc(centerX, clockY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      ctx.stroke();
      const stutter = Math.floor(time * 5) % 5 === 0 ? 0 : -time * 4;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, clockY);
      ctx.lineTo(centerX + Math.cos(stutter - Math.PI / 2) * 11, clockY + Math.sin(stutter - Math.PI / 2) * 11);
      ctx.moveTo(centerX, clockY);
      ctx.lineTo(centerX + Math.cos(stutter / 3) * 8, clockY + Math.sin(stutter / 3) * 8);
      ctx.stroke();
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 6, clockY - 14);
      ctx.lineTo(centerX + 1, clockY - 5);
      ctx.lineTo(centerX - 4, clockY + 3);
      ctx.lineTo(centerX + 3, clockY + 13);
      ctx.stroke();
      // exposed wires where a side plate is missing
      ctx.fillStyle = '#05070d';
      ctx.fillRect(x + 8, y + 76 * unit, 10, 14 * unit);
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 78 * unit);
      ctx.quadraticCurveTo(x + 2, y + 86 * unit + Math.sin(time * 5) * 2, x + 6, y + 96 * unit);
      ctx.stroke();
      ctx.strokeStyle = '#ef5350';
      ctx.beginPath();
      ctx.moveTo(x + 15, y + 78 * unit);
      ctx.quadraticCurveTo(x + 8, y + 90 * unit, x + 14, y + 98 * unit);
      ctx.stroke();
      // legs: one like Chrono's, the other a scrap replacement
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 9, y + 96 * unit, 15, 24 * unit);
      ctx.fillStyle = '#607d8b';
      ctx.fillRect(x + width - 24, y + 96 * unit, 15, 24 * unit);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(x + width - 24, y + 104 * unit, 15, 4);
      [[x + 3, y + 3], [x + width - 6, y + 44 * unit], [x + 3, y + 92 * unit]].forEach(([bx, by]) => bolt(bx, by));
      if (this.robotRewindFlash > 0) {
        ctx.strokeStyle = `rgba(38, 198, 218, ${this.robotRewindFlash / 24})`;
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 6, y - 10, width + 12, height + 14);
        ctx.strokeStyle = `rgba(224, 247, 250, ${this.robotRewindFlash / 30})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, clockY, 34, Math.PI * 1.5, -Math.PI * 0.2, true);
        ctx.stroke();
      }
    } else if (model === 'overload') {
      // a robot with an overheated core leaking electricity
      ctx.fillStyle = '#37474f';
      ctx.fillRect(x + 4, y + 30, width - 8, height - 56);
      outline();
      ctx.strokeRect(x + 4, y + 30, width - 8, height - 56);
      ctx.fillStyle = '#455a64';
      ctx.fillRect(x + 10, y + 2, width - 20, 28);
      ctx.strokeRect(x + 10, y + 2, width - 20, 28);
      ctx.fillStyle = '#101418';
      ctx.fillRect(x + 14, y + 11, width - 28, 10);
      glowEye(centerX - 6 + facing * 6, y + 13, 12, 6, '#ffee58');
      const pulse = (Math.sin(time * 8) + 1) / 2;
      ctx.fillStyle = `rgba(79, 195, 247, ${0.5 + pulse * 0.5})`;
      ctx.shadowColor = '#4fc3f7';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(centerX, y + 62, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#e1f5fe';
      ctx.lineWidth = 2;
      for (let arc = 0; arc < 2; arc += 1) {
        ctx.beginPath();
        let arcX = centerX;
        let arcY = y + 62;
        ctx.moveTo(arcX, arcY);
        for (let step = 0; step < 3; step += 1) {
          arcX += (Math.random() - 0.5) * 30;
          arcY += (Math.random() - 0.3) * 20;
          ctx.lineTo(arcX, arcY);
        }
        ctx.stroke();
      }
      ctx.fillStyle = '#263238';
      ctx.fillRect(x + 8, y + height - 26, 18, 26);
      ctx.fillRect(x + width - 26, y + height - 26, 18, 26);
      ctx.fillStyle = '#ff7043';
      ctx.fillRect(x + 6, y + 84, 8, 4);
      ctx.fillRect(x + width - 14, y + 92, 8, 4);
    } else if (model === 'titan') {
      // Proyecto Titan: the giant prototype from floor 4. Heavy steel, violet core, a head like the one in storage.
      const unit = height / 250;
      // legs
      ctx.fillStyle = '#263238';
      ctx.fillRect(x + 16, y + 180 * unit, 50, 70 * unit);
      ctx.fillRect(x + width - 66, y + 180 * unit, 50, 70 * unit);
      ctx.fillStyle = '#7e57c2';
      ctx.fillRect(x + 16, y + 200 * unit, 50, 6);
      ctx.fillRect(x + width - 66, y + 200 * unit, 50, 6);
      ctx.fillStyle = '#1b2228';
      ctx.fillRect(x + 8, y + 238 * unit, 66, 12 * unit);
      ctx.fillRect(x + width - 74, y + 238 * unit, 66, 12 * unit);
      // torso
      ctx.fillStyle = '#37474f';
      ctx.fillRect(x + 6, y + 64 * unit, width - 12, 122 * unit);
      outline();
      ctx.strokeRect(x + 6, y + 64 * unit, width - 12, 122 * unit);
      ctx.fillStyle = '#455a64';
      ctx.fillRect(x + 14, y + 72 * unit, width - 28, 16 * unit);
      // violet core
      const pulse = (Math.sin(time * 4) + 1) / 2;
      ctx.fillStyle = `rgba(179, 136, 255, ${0.55 + pulse * 0.45})`;
      ctx.shadowColor = '#b388ff';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(centerX, y + 128 * unit, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 11px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PROYECTO T-99', centerX, y + 176 * unit);
      // shoulders with missile pods
      [x - 18, x + width - 32].forEach((shoulderX) => {
        ctx.fillStyle = '#263238';
        ctx.fillRect(shoulderX, y + 56 * unit, 50, 40 * unit);
        ctx.strokeRect(shoulderX, y + 56 * unit, 50, 40 * unit);
        ctx.fillStyle = '#111';
        for (let pod = 0; pod < 3; pod += 1) ctx.fillRect(shoulderX + 6 + pod * 14, y + 62 * unit, 9, 9);
      });
      // arms: huge fists
      const armSwing = Math.sin(time * 2) * 4;
      [[x - 22, -1], [x + width - 18, 1]].forEach(([armX]) => {
        ctx.fillStyle = '#37474f';
        ctx.fillRect(armX, y + 96 * unit + armSwing, 40, 80 * unit);
        ctx.strokeRect(armX, y + 96 * unit + armSwing, 40, 80 * unit);
        ctx.fillStyle = '#455a64';
        ctx.fillRect(armX - 6, y + 172 * unit + armSwing, 52, 38 * unit);
        ctx.strokeRect(armX - 6, y + 172 * unit + armSwing, 52, 38 * unit);
      });
      // head (same as the one in the storage room)
      ctx.fillStyle = '#37474f';
      ctx.fillRect(centerX - 50, y, 100, 64 * unit);
      ctx.strokeRect(centerX - 50, y, 100, 64 * unit);
      ctx.fillStyle = '#101418';
      ctx.fillRect(centerX - 40, y + 18 * unit, 80, 22 * unit);
      glowEye(centerX - 32, y + 22 * unit, 22, 12 * unit, '#ff1744');
      glowEye(centerX + 10, y + 22 * unit, 22, 12 * unit, '#ff1744');
      ctx.fillStyle = '#263238';
      ctx.fillRect(centerX - 30, y + 46 * unit, 60, 8);
      // antenna horns
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX - 44, y);
      ctx.lineTo(centerX - 56, y - 22);
      ctx.moveTo(centerX + 44, y);
      ctx.lineTo(centerX + 56, y - 22);
      ctx.stroke();
      [[x + 12, y + 70 * unit], [x + width - 15, y + 70 * unit], [x + 12, y + 180 * unit], [x + width - 15, y + 180 * unit]].forEach(([bx, by]) => bolt(bx, by));
      // cables and steam
      ctx.strokeStyle = '#b388ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 100 * unit);
      ctx.quadraticCurveTo(x + 4, y + 130 * unit, x + 22, y + 160 * unit);
      ctx.stroke();
      if (this.robotLaserCharge > 0) {
        ctx.fillStyle = `rgba(255, 23, 68, ${0.3 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(centerX - 21 + facing * 4, y + 28 * unit, 16 + Math.random() * 6, 0, Math.PI * 2);
        ctx.arc(centerX + 21 + facing * 4, y + 28 * unit, 16 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (model === 'bronze') {
      // Omegarius: an old Prisma Dynamics robot. Reflecter's silhouette (the same blocks, a bit bigger) in dark bronze,
      // with gold eyes and light strips, light armor plates, a core in the chest and a matching hammer
      const sx = width / 60;
      const sy = height / 120;
      const px = (value) => x + value * sx;
      const py = (value) => y + value * sy;
      const overdrive = Boolean(this.judgeOverdrive);
      const pulse = (Math.sin(time * (overdrive ? 9 : 3)) + 1) / 2;
      const gold = overdrive ? '#ffe082' : '#ffca28';
      const hammerOut = robotShots.some((shot) => shot.kind === 'hammer' && shot.attacker === this && shot.active);
      const lightStrip = (stripX, stripY, stripWidth, stripHeight) => {
        ctx.fillStyle = gold;
        ctx.shadowColor = gold;
        ctx.shadowBlur = 8 + pulse * 6;
        ctx.fillRect(stripX, stripY, stripWidth, stripHeight);
        ctx.shadowBlur = 0;
      };
      if (overdrive) {
        const aura = ctx.createRadialGradient(centerX, y + height / 2, 10, centerX, y + height / 2, height * 0.8);
        aura.addColorStop(0, `rgba(255, 202, 40, ${0.18 + pulse * 0.12})`);
        aura.addColorStop(1, 'rgba(255, 202, 40, 0)');
        ctx.fillStyle = aura;
        ctx.fillRect(centerX - height, y - height * 0.3, height * 2, height * 1.6);
      }
      // body block, like Reflecter's
      ctx.fillStyle = '#3b2412';
      ctx.fillRect(x, y, width, height);
      outline();
      ctx.strokeRect(x, y, width, height);
      lightStrip(x + 2, py(50), 3, 38 * sy);
      lightStrip(x + width - 5, py(50), 3, 38 * sy);
      // head plate with a small crest
      ctx.fillStyle = '#6b4423';
      ctx.beginPath();
      ctx.moveTo(centerX - 9 * sx, py(10));
      ctx.lineTo(centerX, py(-3));
      ctx.lineTo(centerX + 9 * sx, py(10));
      ctx.closePath();
      ctx.fill();
      outline();
      ctx.stroke();
      lightStrip(centerX - 1.5, py(2), 3, 7 * sy);
      ctx.fillStyle = '#5d3a1a';
      ctx.fillRect(px(7), py(10), 46 * sx, 32 * sy);
      ctx.strokeRect(px(7), py(10), 46 * sx, 32 * sy);
      // visor and gold eyes, where Reflecter has his
      ctx.fillStyle = '#140b04';
      ctx.fillRect(px(13), py(21), 34 * sx, 10 * sy);
      ctx.fillStyle = overdrive ? '#fff3c4' : '#ffd54f';
      ctx.shadowColor = '#ffca28';
      ctx.shadowBlur = 12 + pulse * 6;
      ctx.fillRect(px(18), py(20), 8 * sx, 8 * sy);
      ctx.fillRect(px(34), py(20), 8 * sx, 8 * sy);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#2a1a0c';
      for (let slit = 0; slit < 3; slit += 1) ctx.fillRect(centerX - 9 * sx, py(34 + slit * 2.5), 18 * sx, 1.5);
      // chest block with the core
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(px(10), py(48), 40 * sx, 44 * sy);
      outline();
      ctx.strokeRect(px(10), py(48), 40 * sx, 44 * sy);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(px(13), py(51), 34 * sx, 38 * sy);
      const coreY = py(68);
      const coreRadius = 9 * sx;
      ctx.fillStyle = '#1a0f06';
      ctx.beginPath();
      ctx.arc(centerX, coreY, coreRadius + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 213, 79, ${0.6 + pulse * 0.4})`;
      ctx.shadowColor = gold;
      ctx.shadowBlur = 16 + pulse * 14 + (overdrive ? 14 : 0);
      ctx.beginPath();
      ctx.arc(centerX, coreY, coreRadius - 1 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff8e1';
      ctx.beginPath();
      ctx.arc(centerX, coreY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#a0682a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, coreY, coreRadius + 3, 0, Math.PI * 2);
      ctx.stroke();
      // light shoulder plates on the top corners of the chest
      [px(-5), px(47)].forEach((plateX) => {
        ctx.fillStyle = '#5d3a1a';
        ctx.beginPath();
        ctx.moveTo(plateX, py(58));
        ctx.lineTo(plateX, py(49));
        ctx.quadraticCurveTo(plateX + 9 * sx, py(39), plateX + 18 * sx, py(49));
        ctx.lineTo(plateX + 18 * sx, py(58));
        ctx.closePath();
        ctx.fill();
        outline();
        ctx.stroke();
        ctx.strokeStyle = gold;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plateX + 3, py(51));
        ctx.quadraticCurveTo(plateX + 9 * sx, py(44), plateX + 18 * sx - 3, py(51));
        ctx.stroke();
        bolt(plateX + 7 * sx, py(54));
      });
      // belt
      ctx.fillStyle = '#2a1a0c';
      ctx.fillRect(x, py(92), width, 5 * sy);
      lightStrip(centerX - 6, py(93), 12, 3 * sy);
      // legs like Reflecter's, with knee guards
      ctx.fillStyle = '#2a1a0c';
      ctx.fillRect(px(8), py(98), 16 * sx, 22 * sy);
      ctx.fillRect(px(36), py(98), 16 * sx, 22 * sy);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(px(7), py(102), 18 * sx, 6 * sy);
      ctx.fillRect(px(35), py(102), 18 * sx, 6 * sy);
      outline();
      ctx.strokeRect(px(7), py(102), 18 * sx, 6 * sy);
      ctx.strokeRect(px(35), py(102), 18 * sx, 6 * sy);
      lightStrip(px(14), py(110), 4, 7 * sy);
      lightStrip(px(42), py(110), 4, 7 * sy);
      // the hammer in the front hand (unless it is flying)
      if (!hammerOut) {
        const gripX = facing > 0 ? x + width + 3 : x - 3;
        const gripY = py(86);
        let angle = facing * 0.28;
        if (this.omegariusBeamCharge > 0) angle = facing * 1.2;
        else if (this.judgeSwing > 0) angle = facing * (0.28 + (1 - this.judgeSwing / 18) * 2.5);
        else if (this.robotChargeTimer > 0) angle = facing * 1.35;
        else if (this.isAttacking) angle = facing * 1.9;
        const charging = this.omegariusBeamCharge > 0;
        drawOmegariusHammer(gripX, gripY, angle, 0.85 * sy, overdrive || charging ? 1.6 : 1);
        if (charging) {
          // energy gathering on the hammer head
          const head = getOmegariusHammerHead(this);
          const progress = 1 - this.omegariusBeamCharge / (this.omegariusBeamChargeTotal || omegariusBeamChargeFrames);
          const orbRadius = 8 + progress * (this.omegariusBeamSecret ? 48 : 26);
          ctx.strokeStyle = 'rgba(255, 236, 179, 0.7)';
          ctx.lineWidth = 2;
          for (let ray = 0; ray < 7; ray += 1) {
            const rayAngle = Math.random() * Math.PI * 2;
            const reach = 60 * (1 - progress) + 20 + Math.random() * 30;
            ctx.beginPath();
            ctx.moveTo(head.x + Math.cos(rayAngle) * reach, head.y + Math.sin(rayAngle) * reach);
            ctx.lineTo(head.x + Math.cos(rayAngle) * reach * 0.4, head.y + Math.sin(rayAngle) * reach * 0.4);
            ctx.stroke();
          }
          const orb = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, orbRadius);
          orb.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          orb.addColorStop(0.45, 'rgba(255, 213, 79, 0.85)');
          orb.addColorStop(1, 'rgba(255, 202, 40, 0)');
          ctx.fillStyle = orb;
          ctx.beginPath();
          ctx.arc(head.x, head.y, orbRadius, 0, Math.PI * 2);
          ctx.fill();
          // warning line where the shot will go
          ctx.strokeStyle = Math.floor(this.omegariusBeamCharge / 4) % 2 === 0 ? 'rgba(255, 202, 40, 0.7)' : 'rgba(255, 202, 40, 0.2)';
          ctx.setLineDash([12, 8]);
          ctx.beginPath();
          ctx.moveTo(head.x, head.y);
          ctx.lineTo(facing > 0 ? canvas.width : 0, head.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      if (this.omegariusParryTimer > 0) {
        // a real bronze shield (not a hologram) with the Prisma emblem
        const shieldX = facing > 0 ? x + width + 8 : x - 8;
        const shieldY = py(58);
        const shieldRadius = 30 * sx;
        ctx.fillStyle = '#6b4423';
        ctx.beginPath();
        ctx.arc(shieldX, shieldY, shieldRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = '#a0682a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(shieldX, shieldY, shieldRadius - 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = gold;
        ctx.shadowColor = gold;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(shieldX, shieldY - 13);
        ctx.lineTo(shieldX + 11, shieldY + 8);
        ctx.lineTo(shieldX - 11, shieldY + 8);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        for (let rivet = 0; rivet < 8; rivet += 1) {
          const rivetAngle = (rivet / 8) * Math.PI * 2;
          bolt(shieldX + Math.cos(rivetAngle) * (shieldRadius - 5) - 1.5, shieldY + Math.sin(rivetAngle) * (shieldRadius - 5) - 1.5);
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(shieldX - 8, shieldY - 9, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (this.omegariusParryFlash > 0) {
        const flash = this.omegariusParryFlash / 30;
        const shieldX = facing > 0 ? x + width + 8 : x - 8;
        ctx.strokeStyle = `rgba(255, 236, 179, ${flash})`;
        ctx.lineWidth = 4;
        for (let spark = 0; spark < 10; spark += 1) {
          const sparkAngle = (spark / 10) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(shieldX + Math.cos(sparkAngle) * 34, py(58) + Math.sin(sparkAngle) * 34);
          ctx.lineTo(shieldX + Math.cos(sparkAngle) * (34 + (1 - flash) * 50), py(58) + Math.sin(sparkAngle) * (34 + (1 - flash) * 50));
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(255, 213, 79, ${Math.min(1, flash * 2)})`;
        ctx.strokeStyle = `rgba(17, 17, 17, ${Math.min(1, flash * 2)})`;
        ctx.lineWidth = 5;
        ctx.font = '900 22px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('PARRY!', centerX, y - 24 - (1 - flash) * 16);
        ctx.fillText('PARRY!', centerX, y - 24 - (1 - flash) * 16);
      }
      if (this.robotChargeTimer > 0) {
        ctx.strokeStyle = 'rgba(255, 202, 40, 0.45)';
        ctx.lineWidth = 3;
        for (let line = 0; line < 4; line += 1) {
          const lineY = y + 20 + line * (height - 40) / 3;
          ctx.beginPath();
          ctx.moveTo(facing > 0 ? x - 8 : x + width + 8, lineY);
          ctx.lineTo(facing > 0 ? x - 50 : x + width + 50, lineY);
          ctx.stroke();
        }
      }
      if (this.robotSlamFlash > 0) {
        ctx.strokeStyle = `rgba(255, 213, 79, ${this.robotSlamFlash / 14})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(centerX, y + height, width * 0.9 + (14 - this.robotSlamFlash) * 7, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (this.judgeOverdriveFlash > 0) {
        const flash = this.judgeOverdriveFlash / 70;
        ctx.strokeStyle = `rgba(255, 224, 130, ${flash})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(centerX, coreY, 20 + (1 - flash) * 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 213, 79, ${Math.min(1, flash * 2)})`;
        ctx.strokeStyle = `rgba(17, 17, 17, ${Math.min(1, flash * 2)})`;
        ctx.lineWidth = 4;
        ctx.font = '900 16px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('NUCLEO AL 100%', centerX, y - 22);
        ctx.fillText('NUCLEO AL 100%', centerX, y - 22);
      }
    } else if (model === 'assembler') {
      // built from the other robots' leftovers: mismatched halves, a crane claw and a welding arm
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(x + 6, y + 36, width / 2 - 6, height - 62);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(centerX, y + 44, width / 2 - 6, height - 70);
      outline();
      ctx.strokeRect(x + 6, y + 36, width - 12, height - 62);
      ctx.fillStyle = '#fdd835';
      for (let stripe = 0; stripe < 4; stripe += 1) {
        ctx.beginPath();
        ctx.moveTo(x + 8 + stripe * 18, y + height - 30);
        ctx.lineTo(x + 18 + stripe * 18, y + height - 30);
        ctx.lineTo(x + 10 + stripe * 18, y + height - 22);
        ctx.lineTo(x + stripe * 18, y + height - 22);
        ctx.closePath();
        ctx.fill();
      }
      // leftover parts: a guard's badge, a drone plate, a T-0 clock
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(centerX + 4, y + 52, 26, 8);
      ctx.fillStyle = '#78909c';
      ctx.fillRect(x + 12, y + 50, 18, 22);
      ctx.fillStyle = '#e8eaf6';
      ctx.beginPath();
      ctx.arc(centerX + 16, y + 84, 9, 0, Math.PI * 2);
      ctx.fill();
      // welded-on head, off center
      const headWidth = width * 0.5;
      const headHeight = Math.max(32, height * 0.2);
      const headX = x + width * 0.14;
      ctx.fillStyle = '#455a64';
      ctx.fillRect(headX, y + 2, headWidth, headHeight);
      ctx.strokeRect(headX, y + 2, headWidth, headHeight);
      ctx.fillStyle = '#101418';
      ctx.fillRect(headX + 5, y + 2 + headHeight * 0.3, headWidth - 10, headHeight * 0.34);
      glowEye(headX + 8, y + 2 + headHeight * 0.38, headWidth * 0.22, headHeight * 0.18, '#ff1744');
      glowEye(headX + headWidth * 0.58, y + 2 + headHeight * 0.38, headWidth * 0.22, headHeight * 0.18, '#ffee58');
      // crane claw arm on the front side
      const shoulderX = facing > 0 ? x + width : x;
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(shoulderX, y + 46);
      ctx.lineTo(shoulderX + facing * 22, y + 30);
      ctx.lineTo(shoulderX + facing * 34, y + 60);
      ctx.stroke();
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 5;
      const clawOpen = 0.4 + Math.sin(time * 3) * 0.25;
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(shoulderX + facing * 34, y + 60);
        ctx.lineTo(shoulderX + facing * (34 + Math.cos(clawOpen * side) * 14), y + 60 + Math.sin(clawOpen) * 14 * side + 8);
        ctx.stroke();
      });
      // welding arm on the back with sparks
      const backX = facing > 0 ? x : x + width;
      ctx.strokeStyle = '#78909c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(backX, y + 60);
      ctx.lineTo(backX - facing * 18, y + 80);
      ctx.stroke();
      if (Math.random() > 0.4) {
        ctx.fillStyle = '#fff59d';
        ctx.fillRect(backX - facing * 20 + (Math.random() - 0.5) * 8, y + 80 + (Math.random() - 0.5) * 8, 3, 3);
      }
      ctx.fillStyle = '#263238';
      ctx.fillRect(x + 8, y + height - 22, 24, 22);
      ctx.fillRect(x + width - 32, y + height - 22, 24, 22);
      if (this.robotSlamFlash > 0) {
        ctx.strokeStyle = `rgba(179, 229, 252, ${this.robotSlamFlash / 14})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(centerX, y + height, width * 0.9 + (14 - this.robotSlamFlash) * 6, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (this.robotMagnetTimer > 0) {
        ctx.strokeStyle = `rgba(239, 83, 80, ${0.4 + Math.random() * 0.4})`;
        ctx.lineWidth = 3;
        for (let ring = 0; ring < 3; ring += 1) {
          const radius = 20 + ((time * 120 + ring * 30) % 90);
          ctx.beginPath();
          ctx.arc(shoulderX + facing * 34, y + 62, radius, facing > 0 ? -0.6 : Math.PI - 0.6, facing > 0 ? 0.6 : Math.PI + 0.6);
          ctx.stroke();
        }
      }
    }

    if (glitching) {
      // scanline glitch, sparks and an error label
      for (let band = 0; band < 3; band += 1) {
        const bandY = y + Math.random() * height;
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '79, 195, 247' : '255, 238, 88'}, 0.45)`;
        ctx.fillRect(x - 6 + (Math.random() - 0.5) * 10, bandY, width + 12, 4);
      }
      for (let spark = 0; spark < 6; spark += 1) {
        ctx.strokeStyle = robotGlitchSparkColors[spark % robotGlitchSparkColors.length];
        ctx.lineWidth = 2;
        const sparkX = x + Math.random() * width;
        const sparkY = y + Math.random() * height * 0.7;
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + (Math.random() - 0.5) * 18, sparkY + (Math.random() - 0.5) * 18);
        ctx.stroke();
      }
      ctx.fillStyle = '#ffee58';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      const label = ['ERR0R', 'FALLA', '#!?%'][Math.floor(time * 6) % 3];
      ctx.strokeText(label, centerX, y - 26);
      ctx.fillText(label, centerX, y - 26);
    }
    ctx.restore();
  }

  drawHybridOverlay() {
    if (hybridEnemyTypes[this.secretVariant] && hybridEnemyTypes[this.secretVariant].robot) {
      this.drawFactoryRobotOverlay();
      return;
    }
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const facing = this.attacksToTheRight ? 1 : -1;
    const variant = this.secretVariant;

    if (variant === 'armoredCowboy') {
      const cannonBaseX = x + (facing > 0 ? 8 : this.width - 8);
      ctx.fillStyle = '#56613f';
      ctx.fillRect(cannonBaseX - 12, y + 10, 24, 16);
      ctx.fillStyle = '#2f3526';
      ctx.fillRect(facing > 0 ? cannonBaseX : cannonBaseX - 34, y + 13, 34, 9);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.strokeRect(cannonBaseX - 12, y + 10, 24, 16);
      ctx.fillStyle = 'rgba(86, 97, 63, 0.85)';
      ctx.fillRect(x + 4, y + 60, this.width - 8, 22);
      ctx.fillStyle = '#2f3526';
      ctx.fillRect(x - 2, y + this.height - 12, this.width + 4, 12);
      ctx.fillStyle = '#c9b458';
      for (let bolt = x + 8; bolt < x + this.width - 6; bolt += 12) ctx.fillRect(bolt, y + 68, 4, 4);
    }

    if (variant === 'fireSorcerer' || variant === 'chimera') {
      const flameX = centerX + (variant === 'chimera' ? -18 : 0);
      const flameY = y + (variant === 'chimera' ? 70 : 64);
      ctx.fillStyle = 'rgba(255, 109, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(flameX, flameY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.moveTo(flameX, flameY - 18);
      ctx.lineTo(flameX + 12, flameY + 8);
      ctx.lineTo(flameX, flameY + 16);
      ctx.lineTo(flameX - 12, flameY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ef5350';
      ctx.fillRect(flameX - 4, flameY, 8, 10);
      if (variant === 'fireSorcerer') {
        ctx.strokeStyle = 'rgba(255, 145, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 4, y - 4, this.width + 8, this.height + 8);
      }
    }

    if (variant === 'timeMirror' || variant === 'chimera') {
      const clockX = centerX + (variant === 'chimera' ? 20 : 0);
      const clockY = y + (variant === 'chimera' ? 70 : 42);
      const handAngle = performance.now() / 300;
      ctx.fillStyle = '#e0f7fa';
      ctx.strokeStyle = '#26c6da';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(clockX, clockY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(handAngle) * 10, clockY + Math.sin(handAngle) * 10);
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX, clockY - 7);
      ctx.stroke();
      if (variant === 'timeMirror') {
        ctx.strokeStyle = 'rgba(38, 198, 218, 0.75)';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 5]);
        ctx.strokeRect(x - 5, y - 5, this.width + 10, this.height + 10);
        ctx.setLineDash([]);
      }
    }

    ctx.fillStyle = '#fdd835';
    ctx.font = '900 16px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('?', centerX, y - 10);
  }

  drawMonkeyDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const facingRight = this.attacksToTheRight;
    const centerX = x + this.width / 2;

    ctx.strokeStyle = '#5d3a1a';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    const tailBaseX = facingRight ? x + 4 : x + this.width - 4;
    const tailDirection = facingRight ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(tailBaseX, y + 92);
    ctx.bezierCurveTo(tailBaseX + tailDirection * 34, y + 104, tailBaseX + tailDirection * 34, y + 58, tailBaseX + tailDirection * 18, y + 60);
    ctx.stroke();
    ctx.lineCap = 'butt';

    ctx.fillStyle = '#7b4a26';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    [x - 6, x + this.width + 6].forEach((earX) => {
      ctx.beginPath();
      ctx.arc(earX, y + 30, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f2c89b';
      ctx.beginPath();
      ctx.arc(earX, y + 30, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7b4a26';
    });

    ctx.fillStyle = '#5d3a1a';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, y + 2);
    ctx.lineTo(centerX - 2, y - 8);
    ctx.lineTo(centerX + 2, y + 2);
    ctx.lineTo(centerX + 8, y - 6);
    ctx.lineTo(centerX + 12, y + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f2c89b';
    ctx.beginPath();
    ctx.ellipse(centerX, y + 38, 24, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.stroke();

    const lookX = facingRight ? 3 : -3;
    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 15, y + 24, 12, 12);
    ctx.fillRect(centerX + 3, y + 24, 12, 12);
    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 12 + lookX, y + 27, 6, 7);
    ctx.fillRect(centerX + 6 + lookX, y + 27, 6, 7);
    ctx.fillRect(centerX - 5, y + 42, 3, 3);
    ctx.fillRect(centerX + 2, y + 42, 3, 3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, y + 44, 10, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();

    ctx.fillStyle = '#f2c89b';
    ctx.beginPath();
    ctx.ellipse(centerX, y + 86, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffe135';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    const holsterX = facingRight ? x + this.width - 16 : x + 4;
    ctx.fillRect(holsterX, y + 72, 12, 20);
    ctx.strokeRect(holsterX, y + 72, 12, 20);

    if (this.gamblerStunTimer > 0) return;
    if (this.monkeyBananaCooldown === 0) {
      ctx.fillStyle = 'rgba(255, 225, 53, 0.9)';
      ctx.fillRect(holsterX + 3, y + 66, 6, 6);
    }
  }

  drawGhostDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const phased = this.ghostPhaseTimer > 0;

    ctx.save();
    ctx.globalAlpha = phased ? 0.44 : 0.78;
    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.arc(centerX, y + 34, 24, Math.PI, 0);
    ctx.lineTo(x + this.width - 6, y + 92);
    ctx.lineTo(centerX + 10, y + 118);
    ctx.lineTo(centerX, y + 102);
    ctx.lineTo(centerX - 10, y + 118);
    ctx.lineTo(x + 6, y + 92);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 14, y + 30, 7, 7);
    ctx.fillRect(centerX + 7, y + 30, 7, 7);
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, y + 50, 8, 0, Math.PI);
    ctx.stroke();

    if (phased) {
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.88)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, y + 62, 42 + i * 13, -Math.PI * 0.15, Math.PI * 1.15);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawDivineGeneralDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const adapting = this.divineAdaptTimer > 0;
    const adaptationCount = getDivineTotalAdaptationStacks(this);

    ctx.save();
    ctx.strokeStyle = adapting ? 'rgba(255, 235, 59, 0.9)' : 'rgba(224, 247, 250, 0.45)';
    ctx.lineWidth = adapting ? 5 : 3;
    ctx.beginPath();
    ctx.ellipse(centerX, y + this.height / 2, this.width * 0.72, this.height * 0.43, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.beginPath();
    ctx.moveTo(centerX - 23, y + 52);
    ctx.lineTo(centerX - 36, y + 88);
    ctx.lineTo(centerX - 22, y + 124);
    ctx.lineTo(centerX - 6, y + 132);
    ctx.lineTo(centerX + 5, y + 126);
    ctx.lineTo(centerX + 21, y + 132);
    ctx.lineTo(centerX + 32, y + 91);
    ctx.lineTo(centerX + 36, y + 88);
    ctx.lineTo(centerX + 22, y + 52);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.beginPath();
    ctx.moveTo(centerX - 27, y + 22);
    ctx.quadraticCurveTo(centerX - 18, y - 3, centerX + 2, y + 4);
    ctx.quadraticCurveTo(centerX + 28, y + 2, centerX + 31, y + 31);
    ctx.lineTo(centerX + 20, y + 58);
    ctx.lineTo(centerX + 6, y + 69);
    ctx.lineTo(centerX - 14, y + 61);
    ctx.lineTo(centerX - 30, y + 42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 17, y + 27, 8, 7);
    ctx.fillRect(centerX + 8, y + 26, 9, 8);
    ctx.fillRect(centerX - 4, y + 40, 7, 6);
    ctx.fillRect(centerX - 14, y + 52, 29, 5);

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    for (let rib = 0; rib < 4; rib += 1) {
      const ribY = y + 78 + rib * 15;
      ctx.beginPath();
      ctx.moveTo(centerX - 4, ribY);
      ctx.lineTo(centerX - 24, ribY + 8);
      ctx.moveTo(centerX + 4, ribY);
      ctx.lineTo(centerX + 24, ribY + 8);
      ctx.stroke();
    }

    ctx.strokeStyle = '#f7fbff';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - 28, y + 68);
    ctx.lineTo(x + 1, y + 101);
    ctx.lineTo(x + 17, y + 121);
    ctx.moveTo(centerX + 28, y + 68);
    ctx.lineTo(x + this.width - 1, y + 101);
    ctx.lineTo(x + this.width - 17, y + 121);
    ctx.stroke();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(x + 10, y + 115, 16, 14);
    ctx.fillRect(x + this.width - 26, y + 115, 16, 14);

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 31, y + 122, 62, 24);
    ctx.fillRect(centerX - 28, y + 144, 22, 24);
    ctx.fillRect(centerX + 6, y + 144, 22, 24);

    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(centerX - 33, y + 119, 14, 15);
    ctx.fillRect(centerX + 19, y + 119, 14, 15);

    ctx.restore();

    if (adaptationCount > 0) {
      ctx.fillStyle = 'rgba(17, 17, 17, 0.82)';
      ctx.fillRect(centerX - 36, y - 30, 72, 22);
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ADAPT ${adaptationCount}`, centerX, y - 14);
    }
  }

  drawGamblerRoll() {
    const x = this.position.x + this.width / 2;
    const y = this.position.y - 34;
    ctx.fillStyle = 'rgba(17, 17, 17, 0.88)';
    ctx.fillRect(x - 54, y - 24, 108, 30);
    ctx.strokeStyle = '#fdd835';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 54, y - 24, 108, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '900 20px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.gamblerRollNumbers.join('  '), x, y - 2);
  }

  getSwitcherMode() {
    return switcherModes[this.switcherModeIndex];
  }

  getSwitcherModeColor() {
    return switcherModeColors[this.getSwitcherMode()];
  }

  update() {
    if (gameOver) return;
    this.draw();
    if (this.scriptedFlight) return;

    if (this.chronoTimeStopTimer > 0) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.chronoTimeStopTimer -= 1;
      if (this.chronoMarkTimer > 0) this.chronoMarkTimer -= 1;
      if (this.chronoMarkTimer <= 0) this.chronoMarkedBy = null;
      return;
    }

    if (this.divineAdaptTimer > 0) {
      this.velocity.x = 0;
      this.divineAdaptTimer -= 1;
    }

    if (this.switcherDashTimer > 0) {
      this.velocity.x = this.switcherDashDirection * 22 * getDebugMultiplier('moveMultiplier', this);
      this.switcherDashTimer -= 1;
    }

    // the Knight does not slide while he holds his shield up
    if (this.knightShieldTimer > 0) this.velocity.x = 0;
    // nothing pushes the Knight out of his Juicio del Rey: its arc is fixed
    if (this.knightSlam) {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.chronoSlowTimer > 0) {
      this.chronoSlowTimer -= 1;
    }

    if (this.icedSlowTimer > 0) {
      this.icedSlowTimer -= 1;
    }

    if (this.icedVulnerableTimer > 0) {
      this.icedVulnerableTimer -= 1;
    }

    if (this.icedThugBladeCooldown > 0) {
      this.icedThugBladeCooldown -= 1;
    }

    if (this.icedThugFrostFieldCooldown > 0) {
      this.icedThugFrostFieldCooldown -= 1;
    }

    if (this.monkeyBananaCooldown > 0) {
      this.monkeyBananaCooldown -= 1;
    }

    if (this.monkeyPeelCooldown > 0) {
      this.monkeyPeelCooldown -= 1;
    }

    if (this.monkeyCoconutCooldown > 0) {
      this.monkeyCoconutCooldown -= 1;
    }

    if (this.hybridAbilityCooldown > 0) {
      this.hybridAbilityCooldown -= 1;
    }

    ['scammerOfferCooldown', 'scammerItemCooldown', 'scammerSlotCooldown', 'scamWeakTimer', 'scamVulnerableTimer', 'scamLabelTimer', 'jesterSuitCooldown', 'jesterChaosCooldown', 'jesterScytheCooldown', 'jesterRingCooldown', 'jesterStormCooldown', 'jesterUnlockTimer', 'jesterRingHitTimer', 'jesterStormHitTimer'].forEach((timerName) => {
      if (this[timerName] > 0) this[timerName] -= 1;
    });

    if (this.chronoMarkTimer > 0) {
      this.chronoMarkTimer -= 1;
      if (this.chronoMarkTimer <= 0) this.chronoMarkedBy = null;
    }

    if (this.position.y + this.height + this.velocity.y >= ground) {
      this.velocity.y = 0;
      this.position.y = ground - this.height;
    } else {
      this.velocity.y += getDebugGravity(this);
    }

    this.position.x = Math.max(0, Math.min(canvas.width - this.width, this.position.x));

    if (this.isAttacking) {
      this.attackTimer += 1;
      if (this.attackTimer > this.attackDuration) {
        this.isAttacking = false;
        this.attackTimer = 0;
        this.lightWarriorRadiantPunchAttackActive = false;
      }
    }

    if (this.strongAttackCooldown > 0) {
      this.strongAttackCooldown -= 1;
    }

    if (this.basicAttackCooldown > 0) {
      this.basicAttackCooldown -= 1;
    }

    if (this.specialCooldown > 0) {
      this.specialCooldown -= 1;
    }

    if (this.fireBeamCooldown > 0) {
      this.fireBeamCooldown -= 1;
    }

    if (this.tankAttackCooldown > 0) {
      this.tankAttackCooldown -= 1;
    }

    if (this.tankShellCooldown > 0) {
      this.tankShellCooldown -= 1;
    }

    if (this.arcadeBossShockwaveCooldown > 0) {
      this.arcadeBossShockwaveCooldown -= 1;
    }

    if (this.cowboyBurstCooldown > 0) {
      this.cowboyBurstCooldown -= 1;
    }

    if (this.kaiokenCooldown > 0) {
      this.kaiokenCooldown -= 1;
    }

    if (this.kaiokenComboCooldown > 0) {
      this.kaiokenComboCooldown -= 1;
    }

    if (this.kaiokenComboVisualTimer > 0) {
      this.kaiokenComboVisualTimer -= 1;
      if (this.kaiokenComboVisualTimer === 0 && this.characterType === 'normal') {
        this.attackBox = {
          offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
          width: 70,
          height: 30,
        };
        this.isAttacking = false;
      }
    }

    if (this.kaiokenTimer > 0) {
      this.kaiokenTimer -= 1;
      if (this.kaiokenTimer === 0 && this.characterType === 'normal') {
        this.setMaxHealth(this.kaiokenBaseMaxHealth || 100);
      }
    }

    if (this.sorcererOrbCooldown > 0) {
      this.sorcererOrbCooldown -= 1;
    }

    if (this.sorcererGravityCooldown > 0) {
      this.sorcererGravityCooldown -= 1;
    }

    if (this.sorcererSecretOrbCooldown > 0) {
      this.sorcererSecretOrbCooldown -= 1;
    }

    if (this.chronoBladeCooldown > 0) {
      this.chronoBladeCooldown -= 1;
    }

    if (this.chronoSlowCooldown > 0) {
      this.chronoSlowCooldown -= 1;
    }

    if (this.chronoTimeStopCooldown > 0) {
      this.chronoTimeStopCooldown -= 1;
    }

    if (this.ghostPhaseCooldown > 0) {
      this.ghostPhaseCooldown -= 1;
    }

    if (this.ghostPhaseTimer > 0) {
      this.ghostPhaseTimer -= 1;
      this.updateGhostPhaseContact();
    }

    if (this.ghostPhaseContactTimer > 0) {
      this.ghostPhaseContactTimer -= 1;
    }

    if (this.lightWarriorBurstCooldown > 0) {
      this.lightWarriorBurstCooldown -= 1;
    }

    if (this.lightWarriorSpeedCooldown > 0) {
      this.lightWarriorSpeedCooldown -= 1;
    }

    if (this.lightWarriorSpeedTimer > 0) {
      this.lightWarriorSpeedTimer -= 1;
    }

    if (this.lightWarriorOmegaFlightCharging) {
      this.lightWarriorOmegaFlightChargeTimer += 1;
      this.velocity.x = 0;
      this.velocity.y = -1;
      if (this.lightWarriorOmegaFlightChargeTimer >= lightWarriorOmegaFlightChargeDuration) {
        this.lightWarriorOmegaFlightCharging = false;
        this.lightWarriorOmegaFlightTraveling = true;
        this.lightWarriorOmegaFlightTimer = lightWarriorOmegaFlightDuration;
      }
    }

    if (this.lightWarriorOmegaFlightTraveling) {
      const flightMultiplier = getLightWarriorOmegaFlightSpeedMultiplier(this);
      const target = this.target || getOpponent(this);
      if (target) {
        const targetCenterX = target.position.x + target.width / 2;
        const targetCenterY = target.position.y + target.height / 2;
        const attackerCenterX = this.position.x + this.width / 2;
        const attackerCenterY = this.position.y + this.height / 2;
        const distance = Math.max(1, Math.hypot(targetCenterX - attackerCenterX, targetCenterY - attackerCenterY));
        const flightSpeed = playerMoveSpeed * 1.8 * flightMultiplier;
        this.velocity.x = ((targetCenterX - attackerCenterX) / distance) * flightSpeed;
        this.velocity.y = ((targetCenterY - attackerCenterY) / distance) * flightSpeed;
      }
      if (target && tryParryLightWarriorOmegaFlight(this, target)) {
        finishLightWarriorOmegaFlight(this, target, true);
        return;
      }
      if (target && rectangularCollision({
        rectangle1: {
          x: this.position.x - 55,
          y: this.position.y - 35,
          width: this.width + 110,
          height: this.height + 74,
        },
        rectangle2: target,
      })) {
        finishLightWarriorOmegaFlight(this, target);
        return;
      }
    }

    if (this.lightWarriorSolarFlashCooldown > 0) {
      this.lightWarriorSolarFlashCooldown -= 1;
    }

    if (this.lightWarriorSolarFlashTimer > 0) {
      this.lightWarriorSolarFlashTimer -= 1;
    }

    if (this.lightWarriorRadiantPunchCooldown > 0) {
      this.lightWarriorRadiantPunchCooldown -= 1;
    }

    if (this.characterType === 'lightWarrior' && this.lightWarriorOmegaTransformed) {
      this.lightWarriorOmegaStateTimer = Math.max(0, this.lightWarriorOmegaStateTimer - 1);
      if (this.lightWarriorOmegaStateTimer === 0) {
        this.lightWarriorOmegaTransformed = false;
        this.secretVariant = 'omega';
        this.setMaxHealth(lightWarriorHealth);
        this.health = this.maxHealth;
        this.damageMultiplier = 1;
      }
    }

    if (this.lightWarriorRadiantPunchCharging) {
      this.lightWarriorRadiantPunchChargeTimer = Math.min(
        lightWarriorRadiantPunchMaxCharge,
        this.lightWarriorRadiantPunchChargeTimer + 1
      );
      if (this.lightWarriorRadiantPunchChargeTimer >= lightWarriorRadiantPunchMaxCharge) {
        finishLightWarriorRadiantPunchCharge(this);
      }
    }

    if (this.lightWarriorRadiantPunchReadyTimer > 0) {
      this.lightWarriorRadiantPunchReadyTimer -= 1;
      if (this.lightWarriorRadiantPunchReadyTimer === 0) {
        this.lightWarriorRadiantPunchDamage = 0;
      }
    }

    if (this.divineAdaptCooldown > 0) {
      this.divineAdaptCooldown -= 1;
    }
    if (this.divineCounterCooldown > 0) {
      this.divineCounterCooldown -= 1;
    }
    if (this.divineWorldCutCooldown > 0) {
      this.divineWorldCutCooldown -= 1;
    }

    if (this.copycatShieldCooldown > 0) {
      this.copycatShieldCooldown -= 1;
    }

    if (this.copycatShieldTimer > 0) {
      this.copycatShieldTimer -= 1;
    }

    if (this.gamblerRollCooldown > 0) {
      this.gamblerRollCooldown -= 1;
    }

    if (this.gamblerLuckCooldown > 0) {
      this.gamblerLuckCooldown -= 1;
    }

    if (this.gamblerLuckWaveTimer > 0) {
      this.gamblerLuckWaveTimer -= 1;
    }

    if (this.gamblerRollTimer > 0) {
      this.gamblerRollTimer -= 1;
    }

    if (this.gamblerDamageBoostTimer > 0) {
      this.gamblerDamageBoostTimer -= 1;
      if (this.gamblerDamageBoostTimer === 0) {
        this.gamblerDamageBoost = 0;
      }
    }

    if (this.gamblerSpeedBoostTimer > 0) {
      this.gamblerSpeedBoostTimer -= 1;
      if (this.gamblerSpeedBoostTimer === 0) {
        this.gamblerSpeedBoost = 0;
      }
    }

    if (this.gamblerStunTimer > 0) {
      this.gamblerStunTimer -= 1;
    }

    if (this.gamblerInvincibleTimer > 0) {
      this.gamblerInvincibleTimer -= 1;
    }

    if (this.terrainEffectCooldown > 0) {
      this.terrainEffectCooldown -= 1;
    }

    if (this.switcherAbilityCooldown > 0) {
      this.switcherAbilityCooldown -= 1;
    }

    if (this.switcherModeCooldown > 0) {
      this.switcherModeCooldown -= 1;
    }

    if (this.switcherArmorTimer > 0) {
      this.switcherArmorTimer -= 1;
      if (this.switcherArmorTimer === 0 && this.characterType === 'switcher') {
        this.setMaxHealth(switcherHealth);
      }
    }

    if (this.switcherRedStrikeTimer > 0) {
      this.switcherRedStrikeTimer -= 1;
      if (this.switcherRedStrikeTimer === 0) {
        this.switcherRedStrikeArea = null;
      }
    }

    this.updateKaiokenCombo();
    this.updateCowboyBurst();
    this.updateLightWarriorBurst();
  }

  updateKaiokenCombo() {
    if (this.kaiokenComboHitsRemaining <= 0) return;

    if (this.kaiokenTimer <= 0 || this.characterType !== 'normal') {
      this.kaiokenComboHitsRemaining = 0;
      return;
    }

    if (this.kaiokenComboTimer > 0) {
      this.kaiokenComboTimer -= 1;
      return;
    }

    const target = this.target || getOpponent(this);
    strikeKaiokenCombo(this, target);
    this.kaiokenComboHitsRemaining -= 1;
    this.kaiokenComboTimer = kaiokenComboInterval;
  }

  updateCowboyBurst() {
    if (this.cowboyBurstShotsRemaining <= 0) return;

    if (this.cowboyBurstTimer > 0) {
      this.cowboyBurstTimer -= 1;
      return;
    }

    shootCowboyBullet(this, this.target);
    this.cowboyBurstShotsRemaining -= 1;
    this.cowboyBurstTimer = cowboyBurstInterval;
  }

  updateLightWarriorBurst() {
    if (this.lightWarriorBurstShotsRemaining <= 0) return;

    if (this.lightWarriorBurstTimer > 0) {
      this.lightWarriorBurstTimer -= 1;
      return;
    }

    shootLightWarriorShot(this, this.target);
    this.lightWarriorBurstShotsRemaining -= 1;
    this.lightWarriorBurstTimer = lightWarriorBurstInterval;
  }

  updateGhostPhaseContact() {
    if (this.characterType !== 'ghost' || this.ghostPhaseContactTimer > 0) return;

    const target = this.target || getOpponent(this);
    if (!target || target.health <= 0) return;
    const phaseContactArea = {
      x: this.position.x - 8,
      y: this.position.y + 8,
      width: this.width + 16,
      height: this.height - 10,
    };
    if (!rectangularCollision({ rectangle1: phaseContactArea, rectangle2: target })) return;

    const actualDamage = applyDamage(this, target, ghostPhaseContactDamage, { isSpecial: true, damageType: 'spiritPhase' });
    if (actualDamage > 0) {
      this.ghostPhaseContactTimer = ghostPhaseContactInterval;
    }
  }

  attack(isStrong = false) {
    if (this.isAttacking || gameOver) return;
    if (!canFighterAct(this)) return;
    if (this.gamblerStunTimer > 0) return;
    if (this.characterType === 'cowboy' && isDesertCowboyDuelPreparing()) return;
    if (this.basicAttackCooldown > 0 && !debugSettings.restoreAttackSpam) return;
    if (this.characterType === 'tank' && this.tankAttackCooldown > 0) return;
    if (isStrong && this.strongAttackCooldown > 0) return;

    this.isAttacking = true;
    this.basicAttackCooldown = getDebugCooldown(basicAttackCooldown, this);
    this.attackTimer = 0;
    this.currentAttackDamage = getAttackDamage(this, isStrong);
    if (this.characterType === 'lightWarrior' && this.lightWarriorRadiantPunchReadyTimer > 0 && this.lightWarriorRadiantPunchDamage > 0) {
      this.currentAttackDamage += this.lightWarriorRadiantPunchDamage;
      this.lightWarriorRadiantPunchReadyTimer = 0;
      this.lightWarriorRadiantPunchDamage = 0;
      this.lightWarriorRadiantPunchAttackActive = true;
    }

    if (isStrong) {
      this.strongAttackCooldown = getDebugCooldown(70, this);
    }

    if (this.characterType === 'tank') {
      this.tankAttackCooldown = getDebugCooldown(tankAttackCooldown, this);
    }
  }

  setColor(color) {
    this.baseColor = color;
    if (isArcadeBossFighter(this)) return;
    if (
      this.characterType === 'fireMaster' ||
      this.characterType === 'tank' ||
      this.characterType === 'reflecter' ||
      this.characterType === 'lightWarrior' ||
      this.characterType === 'sorcerer' ||
      this.characterType === 'chrono' ||
      this.characterType === 'ghost' ||
      this.characterType === 'divineGeneral' ||
      this.characterType === 'monkey'
    ) {
      if (this.characterType === 'reflecter') {
        this.attackColor = hexToRgba(getReflecterLightColor(this), isReflecterUpgrade(this) ? 0.82 : 0.65);
      }
      return;
    }

    this.color = color;
    this.attackColor = hexToRgba(color, 0.65);
  }

  setCharacterType(characterType, secretVariant = null) {
    this.scammerRage = false;
    this.omegariusArmor = false;
    this.omegariusArmorPlus = false;
    if (arcadeBossVariants.includes(secretVariant)) {
      this.setCharacterType(characterType);
      this.secretVariant = secretVariant;
      this.applyArcadeBossVariantStats();
      return;
    }
    this.characterType = characterType;
    this.secretVariant = secretVariant;
    this.arcadeBossVariant = false;
    if (characterType === 'fireMaster') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1.5;
      this.attackDuration = 22;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(getFireMasterHealth(this));
      this.color = isSuperFireMaster(this) ? '#ff3d00' : '#fb8c00';
      this.attackColor = hexToRgba(isSuperFireMaster(this) ? '#ffea00' : '#fb8c00', 0.65);
      return;
    }

    if (characterType === 'cowboy') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(getCowboyHealth(this));
      this.color = this.baseColor;
      this.attackColor = hexToRgba(this.baseColor, 0.65);
      return;
    }

    if (characterType === 'lightWarrior') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = isLightWarriorOmega(this) ? lightWarriorOmegaDamageMultiplier : 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(getLightWarriorHealth(this));
      this.color = '#fdd835';
      this.attackColor = 'rgba(255, 235, 59, 0.72)';
      return;
    }

    if (characterType === 'reflecter') {
      const reflecterRange = isReflecterUpgrade(this) ? 100 : 70;
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -reflecterRange, y: 20 },
        width: reflecterRange,
        height: isReflecterUpgrade(this) ? 46 : 30,
      };
      this.setMaxHealth(getReflecterHealth(this));
      this.color = isReflecterUpgrade(this) ? '#05070b' : '#78909c';
      this.attackColor = hexToRgba(getReflecterLightColor(this), isReflecterUpgrade(this) ? 0.82 : 0.65);
      return;
    }

    if (characterType === 'switcher') {
      this.width = 60;
      this.height = 120;
      this.switcherModeIndex = 0;
      this.switcherAbilityCooldown = 0;
      this.switcherArmorTimer = 0;
      this.switcherRedStrikeTimer = 0;
      this.switcherRedStrikeArea = null;
      this.switcherDashTimer = 0;
      this.switcherDashDirection = 1;
      this.moveSpeed = switcherModeStats[this.getSwitcherMode()].moveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(switcherHealth);
      this.color = this.baseColor;
      this.attackColor = hexToRgba(this.getSwitcherModeColor(), 0.65);
      return;
    }

    if (characterType === 'sorcerer') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(sorcererHealth);
      this.color = '#12091b';
      this.attackColor = 'rgba(109, 44, 145, 0.72)';
      return;
    }

    if (characterType === 'gambler') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(gamblerHealth);
      this.color = '#263238';
      this.attackColor = 'rgba(253, 216, 53, 0.65)';
      return;
    }

    if (characterType === 'chrono') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -72, y: 18 },
        width: 72,
        height: 34,
      };
      this.setMaxHealth(chronoHealth);
      this.color = '#0f172a';
      this.attackColor = 'rgba(38, 198, 218, 0.7)';
      return;
    }

    if (characterType === 'ghost') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed * 1.08;
      this.damageMultiplier = 1;
      this.attackDuration = 10;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -54, y: 26 },
        width: 54,
        height: 28,
      };
      this.setMaxHealth(ghostHealth);
      this.color = 'rgba(224, 247, 250, 0.42)';
      this.attackColor = 'rgba(224, 247, 250, 0.54)';
      return;
    }

    if (characterType === 'tank') {
      this.width = 120;
      this.height = 240;
      this.moveSpeed = playerMoveSpeed * 0.5;
      this.damageMultiplier = 1;
      this.attackDuration = 28;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -115, y: 92 },
        width: 115,
        height: 58,
      };
      this.setMaxHealth(isTankIronWall(this) ? 260 : 200);
      this.color = '#56613f';
      this.attackColor = 'rgba(201, 180, 88, 0.7)';
      return;
    }

    if (characterType === 'monkey') {
      this.width = 60;
      this.height = 116;
      this.moveSpeed = monkeyMoveSpeed;
      this.damageMultiplier = monkeyDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 36 },
        width: 70,
        height: 28,
      };
      this.setMaxHealth(monkeyHealth);
      this.color = '#7b4a26';
      this.attackColor = 'rgba(255, 225, 53, 0.7)';
      return;
    }

    if (characterType === 'divineGeneral') {
      this.width = 84;
      this.height = 168;
      this.moveSpeed = divineGeneralMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 16;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -92, y: 58 },
        width: 92,
        height: 46,
      };
      this.setMaxHealth(getDivineMaxHealth(this));
      this.color = '#f7fbff';
      this.attackColor = 'rgba(224, 247, 250, 0.72)';
      this.divineAdaptations = {};
      if (isDivineFullAdapt(this)) {
        fillDivineAdaptations(this);
        this.divineAdaptCooldown = 0;
        this.divineCounterCooldown = 0;
      }
      return;
    }

    this.width = 60;
    this.height = 120;
    this.moveSpeed = playerMoveSpeed;
    this.damageMultiplier = 1;
    this.attackDuration = 12;
    this.attackBox = {
      offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
      width: 70,
      height: 30,
    };
    this.setMaxHealth(100);
    this.color = this.baseColor;
    this.attackColor = hexToRgba(this.baseColor, 0.65);
  }

  applyArcadeBossVariantStats() {
    if (this.secretVariant === 'arcadeBoss') {
      this.width = 72;
      this.height = 144;
      this.moveSpeed = normalArcadeBossSpeed;
      this.damageMultiplier = normalArcadeBossDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -64, y: 18 },
        width: 64,
        height: 30,
      };
      this.arcadeBossVariant = true;
      this.color = '#980018';
      this.attackColor = hexToRgba(this.color, 0.65);
    } else if (this.secretVariant === 'icedThug') {
      this.width = 72;
      this.height = 132;
      this.moveSpeed = playerMoveSpeed * 0.92;
      this.damageMultiplier = fireArcadeMiniBossDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -76, y: 28 },
        width: 76,
        height: 34,
      };
      this.color = '#77dcf2';
      this.attackColor = hexToRgba(this.color, 0.65);
    } else if (this.secretVariant === 'shadowJester') {
      this.width = 68;
      this.height = 132;
      this.moveSpeed = playerMoveSpeed * 1.1;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -74, y: 60 },
        width: 74,
        height: 30,
      };
      this.color = '#1a1033';
      this.attackColor = 'rgba(179, 136, 255, 0.7)';
    } else if (this.secretVariant === 'neoScammer') {
      this.width = 100;
      this.height = 190;
      this.moveSpeed = playerMoveSpeed * 1.05;
      this.damageMultiplier = neoScammerDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -90, y: 70 },
        width: 90,
        height: 40,
      };
      this.color = '#1c1c1c';
      this.attackColor = 'rgba(255, 64, 129, 0.7)';
    } else if (this.secretVariant === 'scammer') {
      this.width = 60;
      this.height = 124;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = scammerDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 48 },
        width: 70,
        height: 30,
      };
      this.color = '#f2f2f2';
      this.attackColor = 'rgba(253, 216, 53, 0.7)';
    } else if (this.secretVariant === 'darkKnight' || this.secretVariant === 'darkKnightBoss') {
      const captain = this.secretVariant === 'darkKnightBoss';
      this.width = captain ? 78 : 60;
      this.height = captain ? 150 : 120;
      this.moveSpeed = playerMoveSpeed * (captain ? 0.9 : 0.95);
      this.damageMultiplier = captain ? darkKnightBossDamageMultiplier : darkKnightDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -84, y: captain ? 56 : 44 },
        width: captain ? 94 : 84,
        height: 34,
      };
      this.color = '#37474f';
      this.attackColor = 'rgba(255, 23, 68, 0.5)';
    } else if (this.secretVariant === 'shaolinMaster') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed * 1.05;
      this.damageMultiplier = shaolinDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -80, y: 36 },
        width: 80,
        height: 32,
      };
      this.color = '#b71c1c';
      this.attackColor = 'rgba(255, 202, 40, 0.5)';
    } else if (this.secretVariant === 'lanternGuard') {
      this.width = 60;
      this.height = 124;
      this.moveSpeed = playerMoveSpeed * 0.95;
      this.damageMultiplier = lanternGuardDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -96, y: 40 },
        width: 96,
        height: 34,
      };
      this.color = '#1a237e';
      this.attackColor = 'rgba(255, 213, 79, 0.5)';
    } else if (this.secretVariant === 'chefBoss') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = chefBossDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -86, y: 46 },
        width: 86,
        height: 34,
      };
      this.color = '#fafafa';
      this.attackColor = 'rgba(255, 112, 67, 0.55)';
    } else if (this.secretVariant === 'mochiMouse') {
      this.width = 30;
      this.height = 46;
      this.moveSpeed = playerMoveSpeed * 1.35;
      this.damageMultiplier = mochiDamageMultiplier;
      this.attackDuration = 8;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -46, y: 14 },
        width: 46,
        height: 24,
      };
      this.color = '#9e9e9e';
      this.attackColor = 'rgba(239, 83, 80, 0.55)';
    } else if (this.secretVariant === 'celesteGirl') {
      this.width = 54;
      this.height = 108;
      this.moveSpeed = playerMoveSpeed * 1.15;
      this.damageMultiplier = celesteDamageMultiplier;
      this.attackDuration = 10;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -66, y: 50 },
        width: 66,
        height: 30,
      };
      this.color = '#4fc3f7';
      this.attackColor = 'rgba(224, 247, 250, 0.6)';
    } else if (this.secretVariant === 'setoBoy') {
      this.width = 56;
      this.height = 112;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = setoDamageMultiplier;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -66, y: 50 },
        width: 66,
        height: 30,
      };
      this.color = '#66bb6a';
      this.attackColor = 'rgba(255, 241, 118, 0.6)';
    } else if (this.secretVariant === 'mossBeast') {
      this.width = 84;
      this.height = 128;
      this.moveSpeed = playerMoveSpeed * 0.8;
      this.damageMultiplier = mossBeastDamageMultiplier;
      this.attackDuration = 16;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -86, y: 50 },
        width: 86,
        height: 40,
      };
      this.color = '#4e7d3a';
      this.attackColor = 'rgba(156, 204, 101, 0.55)';
    } else if (this.secretVariant === 'knight') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed * 0.95;
      this.damageMultiplier = knightDamageMultiplier;
      this.attackDuration = 14;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -84, y: 44 },
        width: 84,
        height: 34,
      };
      this.color = '#90a4ae';
      this.attackColor = 'rgba(236, 239, 241, 0.6)';
    } else if (this.secretVariant === 'iceMaster') {
      this.width = 64;
      this.height = 128;
      this.moveSpeed = iceMasterMoveSpeed;
      this.damageMultiplier = iceMasterDamageMultiplier;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 22 },
        width: 70,
        height: 30,
      };
      this.color = '#03a9f4';
      this.attackColor = 'rgba(160, 236, 255, 0.7)';
    }
    this.setMaxHealth(getArcadeBossVariantHealth(this));
  }

  setMaxHealth(maxHealth) {
    this.shopHealthBonus = 0;
    this.baseMaxHealth = maxHealth;
    this.maxHealth = getDebugMaxHealth(maxHealth, this);
    this.health = Math.min(this.health, this.maxHealth);
  }

  reset({ x, y }) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.terrainEffectCooldown = 0;
    if (this.characterType === 'switcher') {
      this.switcherModeIndex = 0;
      this.setMaxHealth(switcherHealth);
      this.moveSpeed = switcherModeStats[this.getSwitcherMode()].moveSpeed;
      this.attackColor = hexToRgba(this.getSwitcherModeColor(), 0.65);
    }
    this.health = this.maxHealth;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.currentAttackDamage = attackDamage;
    this.strongAttackCooldown = 0;
    this.specialCooldown = 0;
    this.fireBeamCooldown = 0;
    this.superFireKamehamehaCharging = false;
    this.tankAttackCooldown = 0;
    this.tankShellCooldown = 0;
    this.cowboyBurstCooldown = 0;
    this.kaiokenCooldown = 0;
    this.kaiokenComboCooldown = 0;
    this.kaiokenComboHitsRemaining = 0;
    this.kaiokenComboTimer = 0;
    this.kaiokenComboVisualTimer = 0;
    this.kaiokenTimer = 0;
    this.kaiokenBaseMaxHealth = this.characterType === 'normal' ? this.baseMaxHealth : 100;
    this.sorcererOrbCooldown = 0;
    this.sorcererGravityCooldown = 0;
    this.sorcererSecretOrbCooldown = 0;
    this.chronoBladeCooldown = 0;
    this.chronoSlowCooldown = 0;
    this.chronoSlowTimer = 0;
    this.icedThugBladeCooldown = 0;
    this.icedThugFrostFieldCooldown = 0;
    this.monkeyBananaCooldown = 0;
    this.monkeyPeelCooldown = 0;
    this.monkeyCoconutCooldown = 0;
    this.hybridAbilityCooldown = 0;
    this.hybridAbilityIndex = 0;
    this.scammerOfferCooldown = 0;
    this.scammerItemCooldown = 0;
    this.scammerSlotCooldown = 0;
    this.scamWeakTimer = 0;
    this.scamVulnerableTimer = 0;
    this.scamLabelTimer = 0;
    this.scamLabel = '';
    this.jesterSuitCooldown = 0;
    this.jesterChaosCooldown = 0;
    this.jesterScytheCooldown = 0;
    this.jesterChaosTeleports = 0;
    this.jesterRingCooldown = 0;
    this.jesterStormCooldown = 0;
    this.jesterSecretTier = 0;
    this.jesterUnlockTimer = 0;
    this.jesterUnlockText = '';
    this.jesterRingHitTimer = 0;
    this.jesterStormHitTimer = 0;
    this.jesterFinalActUsed = false;
    this.jesterTiredShown = false;
    this.jesterChaosTimer = 0;
    this.icedSlowTimer = 0;
    this.icedVulnerableTimer = 0;
    this.chronoMarkTimer = 0;
    this.chronoMarkedBy = null;
    this.chronoTimeStopCooldown = 0;
    this.chronoTimeStopTimer = 0;
    this.ghostPhaseCooldown = 0;
    this.ghostPhaseTimer = 0;
    this.ghostPhaseContactTimer = 0;
    this.lightWarriorBurstCooldown = 0;
    this.lightWarriorBurstShotsRemaining = 0;
    this.lightWarriorBurstTimer = 0;
    this.lightWarriorSpeedCooldown = 0;
    this.lightWarriorSpeedTimer = 0;
    this.lightWarriorSolarFlashCooldown = 0;
    this.lightWarriorSolarFlashTimer = 0;
    this.lightWarriorRadiantPunchCooldown = 0;
    this.lightWarriorRadiantPunchChargeTimer = 0;
    this.lightWarriorRadiantPunchReadyTimer = 0;
    this.lightWarriorRadiantPunchDamage = 0;
    this.lightWarriorRadiantPunchCharging = false;
    this.lightWarriorRadiantPunchAttackActive = false;
    this.divineAdaptCooldown = 0;
    this.divineAdaptTimer = 0;
    this.divineAdaptations = {};
    this.divineCounterCooldown = 0;
    this.divineWorldCutCooldown = 0;
    this.divineWorldCutCharging = false;
    this.cowboyBurstShotsRemaining = 0;
    this.cowboyBurstTimer = 0;
    this.copycatShieldCooldown = 0;
    this.copycatShieldTimer = 0;
    this.gamblerRollCooldown = 0;
    this.gamblerLuckCooldown = 0;
    this.gamblerLuckBonus = 0;
    this.gamblerLuckWaveTimer = 0;
    this.gamblerRollTimer = 0;
    this.gamblerRollNumbers = [];
    this.gamblerDamageBoost = 0;
    this.gamblerDamageBoostTimer = 0;
    this.gamblerSpeedBoost = 0;
    this.gamblerSpeedBoostTimer = 0;
    this.gamblerStunTimer = 0;
    this.gamblerInvincibleTimer = 0;
    this.switcherAbilityCooldown = 0;
    this.switcherModeCooldown = 0;
    this.switcherArmorTimer = 0;
    this.switcherRedStrikeTimer = 0;
    this.switcherRedStrikeArea = null;
    this.switcherDashTimer = 0;
    this.switcherDashDirection = 1;
    if (blindMode) {
      applyBlindFighterLook(this);
    }
  }
}

// where the head of Omegarius's hammer is while it aims the energy shot (same pose as in drawFactoryRobotOverlay)
function getOmegariusHammerHead(fighter) {
  const facing = fighter.attacksToTheRight ? 1 : -1;
  const scaleY = fighter.height / 120;
  const gripX = facing > 0 ? fighter.position.x + fighter.width + 3 : fighter.position.x - 3;
  const gripY = fighter.position.y + 86 * scaleY;
  const angle = facing * 1.2;
  const reach = 96 * 0.85 * scaleY;
  return { x: gripX + Math.sin(angle) * reach, y: gripY - Math.cos(angle) * reach };
}

// Omegarius's hammer. (gripX, gripY) is where it is held; angle 0 points the head straight up.
function drawOmegariusHammer(gripX, gripY, angle, scale = 1, glow = 1) {
  const time = performance.now() / 1000;
  ctx.save();
  ctx.translate(gripX, gripY);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  // handle wrapped in gold bands
  ctx.fillStyle = '#3a2410';
  ctx.fillRect(-4, -84, 8, 96);
  ctx.strokeRect(-4, -84, 8, 96);
  ctx.fillStyle = '#ffca28';
  [-70, -40, -10].forEach((bandY) => ctx.fillRect(-5, bandY, 10, 4));
  ctx.fillStyle = '#6b4423';
  ctx.beginPath();
  ctx.arc(0, 14, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // heavy bronze head with gold trim and a glowing rune
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(-30, -112, 60, 32);
  ctx.strokeRect(-30, -112, 60, 32);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(-36, -108, 8, 24);
  ctx.strokeRect(-36, -108, 8, 24);
  ctx.fillRect(28, -108, 8, 24);
  ctx.strokeRect(28, -108, 8, 24);
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 2;
  ctx.strokeRect(-26, -108, 52, 24);
  const pulse = (Math.sin(time * 4) + 1) / 2;
  ctx.fillStyle = `rgba(255, 213, 79, ${Math.min(1, (0.55 + pulse * 0.45) * glow)})`;
  ctx.shadowColor = '#ffca28';
  ctx.shadowBlur = 14 * glow;
  ctx.beginPath();
  ctx.moveTo(0, -105);
  ctx.lineTo(7, -96);
  ctx.lineTo(0, -87);
  ctx.lineTo(-7, -96);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

