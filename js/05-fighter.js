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

  drawChronoDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;

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

