// Moquete - Proyectiles y efectos de habilidades (clases)
// (parte 6 de 10; los archivos se cargan en orden desde index.html)

class Fireball {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(fireballSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 34;
    this.height = 22;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    if (isIceMaster(this.attacker)) {
      this.drawIceShard();
      return;
    }
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(this.position.x + 6, this.position.y + 5, this.width - 12, this.height - 10);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(this.position.x + this.width - 10, this.position.y + 7, 8, 8);
  }

  drawIceShard() {
    const pointsRight = this.velocity.x > 0;
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const tipX = pointsRight ? this.position.x + this.width + 6 : this.position.x - 6;
    const tailX = pointsRight ? this.position.x - 14 : this.position.x + this.width + 14;
    ctx.fillStyle = 'rgba(160, 236, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(centerX, this.position.y + 2);
    ctx.lineTo(tailX, centerY);
    ctx.lineTo(centerX, this.position.y + this.height - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#29b6f6';
    ctx.beginPath();
    ctx.moveTo(tipX, centerY);
    ctx.lineTo(centerX, this.position.y - 2);
    ctx.lineTo(pointsRight ? this.position.x : this.position.x + this.width, centerY);
    ctx.lineTo(centerX, this.position.y + this.height + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0b3d91';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#e0fcff';
    ctx.fillRect(centerX - 5, centerY - 4, 10, 8);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class FireBeam {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(fireBeamSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 90;
    this.height = 16;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    if (isIceMaster(this.attacker)) {
      ctx.fillStyle = 'rgba(224, 252, 255, 0.95)';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      ctx.fillStyle = '#29b6f6';
      ctx.fillRect(this.position.x, this.position.y + 4, this.width, this.height - 8);
      ctx.fillStyle = '#3f3fc8';
      ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 12 : 0), this.position.y + 2, 12, this.height - 4);
      ctx.fillStyle = '#ffffff';
      for (let sparkleX = this.position.x + 10; sparkleX < this.position.x + this.width - 10; sparkleX += 22) {
        ctx.fillRect(sparkleX, this.position.y - 4, 4, 4);
        ctx.fillRect(sparkleX + 11, this.position.y + this.height, 4, 4);
      }
      return;
    }
    ctx.fillStyle = '#fff3e0';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#ff6d00';
    ctx.fillRect(this.position.x, this.position.y + 4, this.width, this.height - 8);
    ctx.fillStyle = '#d50000';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? 0 : this.width - 12), this.position.y + 2, 12, this.height - 4);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class LightShot {
  constructor({ x, y, direction, target, attacker }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(lightWarriorShotSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.width = 28;
    this.height = 10;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 10 : 0), this.position.y - 3, 10, this.height + 6);
    ctx.fillStyle = 'rgba(255, 235, 59, 0.35)';
    ctx.fillRect(this.position.x - (this.velocity.x > 0 ? 10 : -this.width), this.position.y + 2, this.width, this.height - 4);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class SuperFireKamehamehaCharge {
  constructor({ attacker, target, lightWarrior = false, omega = false }) {
    this.attacker = attacker;
    this.target = target;
    this.lightWarrior = lightWarrior;
    this.omega = omega;
    this.timer = 0;
    this.duration = lightWarrior ? (this.omega ? 90 : lightWarriorBeamChargeDuration) : superFireKamehamehaChargeDuration;
    this.active = true;
    if (lightWarrior) {
      this.attacker.lightWarriorBeamCharging = true;
    } else {
      this.attacker.superFireKamehamehaCharging = true;
    }
  }

  draw() {
    const centerX = this.attacker.position.x + this.attacker.width / 2;
    const centerY = this.attacker.position.y + this.attacker.height / 2;
    const progress = Math.max(0, Math.min(1, this.timer / this.duration));
    const radius = 18 + progress * (this.omega ? 90 : 58);

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = this.omega
      ? `rgba(255, 255, 255, ${0.28 + progress * 0.42})`
      : this.lightWarrior
        ? `rgba(255, 235, 59, ${0.18 + progress * 0.32})`
        : `rgba(255, 109, 0, ${0.18 + progress * 0.32})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.omega ? '#fff' : '#fff3e0';
    ctx.lineWidth = this.omega ? 7 : 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();
    ctx.fillStyle = this.omega ? '#fff' : this.lightWarrior ? '#fdd835' : '#ff6d00';
    ctx.fillRect(centerX - 18, centerY - 18, 36, 36);
    ctx.fillStyle = this.omega ? '#f5f5f5' : this.lightWarrior ? '#fffde7' : '#fff176';
    ctx.fillRect(centerX - 9, centerY - 9, 18, 18);
    ctx.restore();
  }

  update() {
    if (!this.attacker || !this.target || this.attacker.health <= 0 || gameOver) {
      if (this.attacker) {
        if (this.lightWarrior) this.attacker.lightWarriorBeamCharging = false;
        else this.attacker.superFireKamehamehaCharging = false;
      }
      this.active = false;
      return;
    }

    this.attacker.velocity.x = 0;
    this.attacker.isAttacking = false;
    this.attacker.attackTimer = 0;
    this.draw();
    this.timer += 1;

    if (this.timer >= this.duration) {
      superFireKamehamehas.push(new SuperFireKamehameha({ attacker: this.attacker, target: this.target, lightWarrior: this.lightWarrior, omega: this.omega }));
      if (this.lightWarrior) this.attacker.lightWarriorBeamCharging = false;
      else this.attacker.superFireKamehamehaCharging = false;
      this.active = false;
      playSound(this.omega ? 'gravityOrb' : 'fireBeam');
    }
  }
}

class SuperFireKamehameha {
  constructor({ attacker, target, lightWarrior = false, omega = false }) {
    const attackerCenterX = attacker.position.x + attacker.width / 2;
    const targetCenterX = target.position.x + target.width / 2;
    this.attacker = attacker;
    this.target = target;
    this.lightWarrior = lightWarrior;
    this.omega = omega;
    this.direction = targetCenterX >= attackerCenterX ? 1 : -1;
    this.origin = {
      x: this.direction > 0 ? attacker.position.x + attacker.width : attacker.position.x,
      y: attacker.position.y + attacker.height / 2,
    };
    this.length = 0;
    this.height = this.omega ? 120 : 86;
    this.maxLength = this.omega ? canvas.width + 360 : canvas.width + 220;
    this.duration = lightWarrior ? (this.omega ? 150 : lightWarriorBeamDuration) : superFireKamehamehaDuration;
    this.timer = 0;
    this.damageTickTimer = 0;
    this.active = true;
  }

  get x() {
    return this.direction > 0 ? this.origin.x : this.origin.x - this.length;
  }

  get y() {
    return this.origin.y - this.height / 2;
  }

  get width() {
    return this.length;
  }

  draw() {
    const x = this.x;
    const y = this.y;
    const width = this.width;

    ctx.save();
    if (this.omega) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fillRect(x, y + 28, width, this.height - 56);
      ctx.fillStyle = 'rgba(255, 235, 59, 0.96)';
      ctx.fillRect(x, y + 12, width, this.height - 24);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x, y + 44, width, this.height - 88);
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 7;
      ctx.strokeRect(x, y + 6, width, this.height - 12);
    } else {
      ctx.fillStyle = this.lightWarrior ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 245, 157, 0.96)';
      ctx.fillRect(x, y + 22, width, this.height - 44);
      ctx.fillStyle = this.lightWarrior ? 'rgba(255, 235, 59, 0.9)' : 'rgba(255, 109, 0, 0.88)';
      ctx.fillRect(x, y + 8, width, this.height - 16);
      ctx.fillStyle = this.lightWarrior ? 'rgba(255, 193, 7, 0.76)' : 'rgba(230, 81, 0, 0.72)';
      ctx.fillRect(x, y, width, this.height);
      ctx.fillStyle = this.lightWarrior ? 'rgba(255, 255, 224, 0.98)' : 'rgba(255, 238, 88, 0.95)';
      ctx.fillRect(x, y + 28, width, this.height - 56);

      ctx.strokeStyle = this.lightWarrior ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.86)';
      ctx.lineWidth = 5;
      ctx.strokeRect(x, y + 4, width, this.height - 8);
    }
    ctx.restore();
  }

  update() {
    this.timer += 1;
    this.length = Math.min(this.maxLength, this.length + getDebugProjectileSpeed(superFireKamehamehaSpeed, this.attacker) * (this.omega ? 2.8 : 1));
    this.damageTickTimer = Math.max(0, this.damageTickTimer - 1);
    this.draw();

    if (this.timer >= this.duration) {
      this.active = false;
    }
  }
}

class TankShell {
  constructor({ x, y, direction, target, attacker, damage = getTankSecretDamage(attacker, tankShellDamage), empowered = false }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(tankShellSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damage = damage;
    this.empowered = empowered;
    this.width = 28;
    this.height = 14;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = this.empowered ? '#111' : '#2b2b2b';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.empowered ? '#ffeb3b' : '#c9b458';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 8 : 0), this.position.y + 3, 8, 8);
    if (this.empowered) {
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.position.x - 3, this.position.y - 3, this.width + 6, this.height + 6);
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class ArcadeBossShockwave {
  constructor({ target, attacker }) {
    this.position = {
      x: attacker.position.x + attacker.width / 2,
      y: ground - 18,
    };
    this.target = target;
    this.attacker = attacker;
    this.radius = 12;
    this.width = this.radius * 2;
    this.height = 34;
    this.damage = normalArcadeBossShockwaveDamage / normalArcadeBossDamageMultiplier;
    this.hitTarget = false;
    this.active = true;
  }

  get x() {
    return this.position.x - this.radius;
  }

  get y() {
    return this.position.y - this.height;
  }

  draw() {
    ctx.fillStyle = 'rgba(143, 0, 27, 0.7)';
    ctx.fillRect(this.x, this.y + 12, this.width, this.height - 12);
    ctx.strokeStyle = '#ff8a9b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.position.x - this.radius, this.position.y);
    ctx.quadraticCurveTo(this.position.x, this.position.y - this.radius * 1.5, this.position.x + this.radius, this.position.y);
    ctx.stroke();
  }

  update() {
    this.radius += getDebugProjectileSpeed(9, this.attacker);
    this.width = this.radius * 2;
    this.draw();

    if (
      this.active &&
      !this.hitTarget &&
      rectangularCollision({ rectangle1: this, rectangle2: this.target })
    ) {
      applyDamage(this.attacker, this.target, this.damage, { isSpecial: true, damageType: 'melee' });
      this.target.velocity.x = getDebugKnockback(this.target.position.x >= this.position.x ? 14 : -14, this.target);
      this.target.velocity.y = getDebugKnockback(-5, this.target);
      this.hitTarget = true;
      this.active = false;
    }

    if (this.radius > canvas.width) {
      this.active = false;
    }
  }
}

class CowboyBullet {
  constructor({ x, y, direction, target, attacker, damage = cowboyBulletDamage, fixedDamage = false }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(cowboyBulletSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damage = damage;
    this.fixedDamage = fixedDamage;
    this.width = 18;
    this.height = 6;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(this.position.x + 3, this.position.y + 1, this.width - 6, 2);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class SorcererOrb {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(sorcererOrbSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 36;
    this.height = 36;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;

    ctx.fillStyle = 'rgba(255, 23, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 27, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 82, 82, 0.72)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(centerX + 7, centerY - 7, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class SorcererGravityOrb {
  constructor({ x, y, target, attacker }) {
    this.position = { x, y };
    this.target = target;
    this.attacker = attacker;
    this.width = attacker.width * 3;
    this.height = attacker.width * 3;
    this.timer = getDebugDuration(sorcererGravityDuration, attacker);
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get centerX() {
    return this.position.x + this.width / 2;
  }

  get centerY() {
    return this.position.y + this.height / 2;
  }

  draw() {
    ctx.fillStyle = 'rgba(33, 150, 243, 0.16)';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(33, 150, 243, 0.88)';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(129, 212, 250, 0.62)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(187, 222, 251, 0.48)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0d47a1';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64b5f6';
    ctx.beginPath();
    ctx.arc(this.centerX + 7, this.centerY - 7, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.timer -= 1;
    this.pullTarget();
    this.draw();

    if (this.timer <= 0) {
      this.active = false;
    }
  }

  pullTarget() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = this.centerX - targetCenterX;
    const distanceY = this.centerY - targetCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const pullStrength = sorcererGravityPull * Math.min(1.35, 220 / distance);

    this.target.velocity.x += (distanceX / distance) * pullStrength;
    this.target.velocity.y += (distanceY / distance) * pullStrength;
  }
}

class SorcererSecretOrb {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.finalSize = attacker.width * 3.5;
    this.size = 34;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.chargeTimer = sorcererSecretOrbChargeTime;
    this.launched = false;
    this.active = true;
    this.speed =
      getDebugProjectileSpeed(
        sorcererSecretOrbMinSpeed +
          Math.random() * (sorcererSecretOrbMaxSpeed - sorcererSecretOrbMinSpeed)
      );
    this.mirrorCollapsed = false;
    this.updateChargePosition();
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get width() {
    return this.size;
  }

  get height() {
    return this.size;
  }

  get centerX() {
    return this.position.x + this.size / 2;
  }

  get centerY() {
    return this.position.y + this.size / 2;
  }

  updateChargePosition() {
    const casterCenterX = this.attacker.position.x + this.attacker.width / 2;
    const casterCenterY = this.attacker.position.y + 30;
    this.position.x = casterCenterX - this.size / 2;
    this.position.y = casterCenterY - this.size / 2;
  }

  draw() {
    const centerX = this.centerX;
    const centerY = this.centerY;
    const radius = this.size / 2;

    ctx.fillStyle = this.mirrorCollapsed
      ? 'rgba(66, 165, 245, 0.34)'
      : this.launched
        ? 'rgba(123, 31, 162, 0.28)'
        : 'rgba(186, 104, 200, 0.18)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.mirrorCollapsed ? 'rgba(253, 216, 53, 0.78)' : 'rgba(225, 190, 231, 0.58)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(8, radius - 10), 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = this.mirrorCollapsed ? '#0d47a1' : '#4a148c';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.mirrorCollapsed ? '#42a5f5' : '#8e24aa';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.mirrorCollapsed ? '#fff59d' : '#ce93d8';
    ctx.beginPath();
    ctx.arc(centerX + radius * 0.22, centerY - radius * 0.24, Math.max(5, radius * 0.16), 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    if (!this.launched) {
      const progress = 1 - this.chargeTimer / sorcererSecretOrbChargeTime;
      this.size = 34 + (this.finalSize - 34) * progress;
      this.updateChargePosition();
      this.chargeTimer -= 1;
      if (this.chargeTimer <= 0) {
        this.launch();
      }
      this.draw();
      return;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();

    if (
      this.position.x + this.size < 0 ||
      this.position.x > canvas.width ||
      this.position.y + this.size < 0 ||
      this.position.y > canvas.height
    ) {
      this.active = false;
    }
  }

  launch() {
    const currentCenterX = this.centerX;
    const currentCenterY = this.centerY;
    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = targetCenterX - currentCenterX;
    const distanceY = targetCenterY - currentCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));

    this.launched = true;
    this.size = this.finalSize;
    this.position.x = currentCenterX - this.size / 2;
    this.position.y = currentCenterY - this.size / 2;
    this.velocity.x = (distanceX / distance) * this.speed;
    this.velocity.y = (distanceY / distance) * this.speed;
    playSound('sorcererSecretLaunch');
  }
}

class ChronoBlade {
  constructor({ x, y, target, attacker }) {
    this.position = { x, y };
    this.previousPosition = { x, y };
    this.target = target;
    this.attacker = attacker;
    this.width = 42;
    this.height = 14;
    this.active = true;
    const targetCenterX = target.position.x + target.width / 2;
    const targetCenterY = target.position.y + target.height / 2;
    const bladeCenterX = x + this.width / 2;
    const bladeCenterY = y + this.height / 2;
    const distanceX = targetCenterX - bladeCenterX;
    const distanceY = targetCenterY - bladeCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const speed = getDebugProjectileSpeed(chronoBladeSpeed, attacker);
    this.velocity = {
      x: (distanceX / distance) * speed,
      y: (distanceY / distance) * speed,
    };
  }

  draw() {
    ctx.fillStyle = '#e0f7fa';
    ctx.fillRect(this.position.x, this.position.y + 3, this.width, this.height - 6);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 14 : 0), this.position.y, 14, this.height);
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.72)';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.position.x - 3, this.position.y - 3, this.width + 6, this.height + 6);
  }

  update() {
    this.previousPosition = { ...this.position };
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();

    if (
      this.position.x + this.width < 0 ||
      this.position.x > canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y > canvas.height
    ) {
      this.active = false;
    }
  }
}

class ChronoZone {
  constructor({ attacker, target }) {
    const targetCenterX = target.position.x + target.width / 2;
    const targetCenterY = target.position.y + target.height / 2;
    this.position = {
      x: targetCenterX - chronoSlowRadius / 2,
      y: targetCenterY - chronoSlowRadius / 2,
    };
    this.width = chronoSlowRadius;
    this.height = chronoSlowRadius;
    this.attacker = attacker;
    this.target = target;
    this.timer = getDebugDuration(chronoSlowDuration, attacker);
    this.lockTimer = getDebugDuration(chronoSlowLockDuration, attacker);
    this.active = true;
  }

  get centerX() {
    return this.position.x + this.width / 2;
  }

  get centerY() {
    return this.position.y + this.height / 2;
  }

  draw() {
    const progress = this.timer / chronoSlowDuration;
    ctx.fillStyle = `rgba(38, 198, 218, ${0.08 + progress * 0.08})`;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(224, 247, 250, 0.82)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.58)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 24, -Math.PI / 2, Math.PI * 1.5 * progress);
    ctx.stroke();
  }

  update() {
    this.timer -= 1;
    if (this.lockTimer > 0) {
      this.lockTimer -= 1;
      this.followTarget();
    }
    this.applySlow();
    this.draw();

    if (this.timer <= 0) {
      this.active = false;
    }
  }

  followTarget() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    this.position.x += (targetCenterX - this.centerX) * 0.18;
    this.position.y += (targetCenterY - this.centerY) * 0.18;
    this.position.x = Math.max(0, Math.min(canvas.width - this.width, this.position.x));
    this.position.y = Math.max(60, Math.min(ground - this.height, this.position.y));
  }

  applySlow() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = this.centerX - targetCenterX;
    const distanceY = this.centerY - targetCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));

    if (distance <= this.width / 2) {
      this.target.chronoSlowTimer = Math.max(this.target.chronoSlowTimer, 8);
    }

    if (distance <= (this.width / 2) * 1.25) {
      const pullStrength = chronoSlowPull * (1 - Math.min(1, distance / ((this.width / 2) * 1.25)));
      this.target.velocity.x += (distanceX / distance) * pullStrength;
      this.target.velocity.y += (distanceY / distance) * pullStrength * 0.35;
    }
  }
}

class DivineWorldCutCharge {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.timer = 0;
    this.duration = divineWorldCutChargeDuration;
    this.active = true;
    this.attacker.divineWorldCutCharging = true;
  }

  get currentPhrase() {
    const phaseLength = Math.max(1, this.duration / divineWorldCutPhrases.length);
    const phraseIndex = Math.min(divineWorldCutPhrases.length - 1, Math.floor(this.timer / phaseLength));
    return divineWorldCutPhrases[phraseIndex];
  }

  draw() {
    if (!this.attacker) return;

    const progress = Math.max(0, Math.min(1, this.timer / Math.max(1, this.duration)));
    const centerX = this.attacker.position.x + this.attacker.width / 2;
    const centerY = this.attacker.position.y + this.attacker.height / 2;
    const radius = 34 + progress * 70;

    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.8, centerY + radius * 0.35);
    ctx.lineTo(centerX + radius * 0.8, centerY - radius * 0.35);
    ctx.stroke();

    const phraseBoxY = 178;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
    ctx.fillRect(canvas.width / 2 - 330, phraseBoxY, 660, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 330, phraseBoxY, 660, 52);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '900 24px "Courier New", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.currentPhrase, canvas.width / 2, phraseBoxY + 34);
    ctx.restore();
  }

  update() {
    if (!this.attacker || !this.target || this.attacker.health <= 0 || gameOver) {
      if (this.attacker) this.attacker.divineWorldCutCharging = false;
      this.active = false;
      return;
    }

    this.attacker.velocity.x = 0;
    this.attacker.isAttacking = false;
    this.attacker.attackTimer = 0;
    this.draw();
    this.timer += 1;

    if (this.timer >= this.duration) {
      divineWorldCuts.push(new DivineWorldCut({ attacker: this.attacker, target: this.target }));
      playSound('reflectShield');
      this.attacker.divineWorldCutCharging = false;
      this.active = false;
    }
  }
}

class DivineWorldCut {
  constructor({ attacker, target }) {
    const attackerCenterX = attacker.position.x + attacker.width / 2;
    const targetCenterX = target.position.x + target.width / 2;
    const direction = targetCenterX >= attackerCenterX ? 1 : -1;
    this.attacker = attacker;
    this.target = target;
    this.direction = direction;
    this.width = 230;
    this.height = 54;
    this.position = {
      x: direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - this.width,
      y: attacker.position.y + attacker.height / 2 - this.height / 2,
    };
    this.velocity = { x: direction * getDebugProjectileSpeed(divineWorldCutSpeed, attacker), y: 0 };
    this.active = true;
    this.damage = getDivineWorldCutDamage(attacker);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const x = this.position.x;
    const y = this.position.y;
    const d = this.direction;

    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    ctx.scale(d, 1);
    ctx.rotate(-0.08);

    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 9;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(-this.width / 2, 8);
    ctx.lineTo(this.width * 0.18, -this.height / 2);
    ctx.lineTo(this.width / 2, 0);
    ctx.lineTo(this.width * 0.18, this.height / 2);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.moveTo(-this.width / 2, 8);
    ctx.lineTo(this.width * 0.18, -this.height / 2);
    ctx.lineTo(this.width / 2, 0);
    ctx.lineTo(this.width * 0.18, this.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i += 1) {
      const offset = -22 + i * 14;
      ctx.beginPath();
      ctx.moveTo(-this.width / 2 + i * 26, offset);
      ctx.lineTo(this.width / 2 - 38, offset - 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

const player1 = new Fighter({ x: 120, y: 0, color: '#42a5f5', attacksToTheRight: true });
const player2 = new Fighter({ x: 820, y: 0, color: '#ef5350', attacksToTheRight: false });
player1.target = player2;
player2.target = player1;

class MonkeyBanana {
  constructor({ x, y, direction, target, attacker }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(monkeyBananaSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.width = 30;
    this.height = 18;
    this.rotation = 0;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#ffe135';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -10, 16, Math.PI * 0.18, Math.PI * 0.82);
    ctx.arc(0, -16, 16, Math.PI * 0.78, Math.PI * 0.22, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-15, -4, 4, 4);
    ctx.fillRect(11, -4, 4, 4);
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.rotation += this.velocity.x > 0 ? 0.35 : -0.35;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class MonkeyPeel {
  constructor({ x, attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.width = 44;
    this.height = 16;
    this.position = { x: Math.max(0, Math.min(canvas.width - this.width, x)), y: ground - this.height };
    this.timer = getDebugDuration(monkeyPeelDuration, attacker);
    this.armTimer = 12;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const x = this.position.x;
    const y = this.position.y;
    const blink = this.timer < 90 && Math.floor(this.timer / 8) % 2 === 0;
    if (blink) return;
    ctx.fillStyle = '#ffe135';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y + 2);
    ctx.lineTo(x + 2, y + this.height);
    ctx.lineTo(x + this.width / 2 - 4, y + this.height - 3);
    ctx.lineTo(x + this.width / 2, y + this.height);
    ctx.lineTo(x + this.width / 2 + 4, y + this.height - 3);
    ctx.lineTo(x + this.width - 2, y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x + this.width / 2 - 2, y, 4, 4);
  }

  update() {
    this.timer -= 1;
    if (this.armTimer > 0) this.armTimer -= 1;
    this.draw();
    if (this.timer <= 0) this.active = false;
  }
}

class MonkeyCoconut {
  constructor({ x, delay, attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.width = 26;
    this.height = 26;
    this.position = { x: x - this.width / 2, y: 20 };
    this.previousPosition = { ...this.position };
    this.velocity = { x: 0, y: 4 };
    this.delay = delay;
    this.active = true;
  }

  draw() {
    if (this.delay > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(this.position.x + this.width / 2, ground - 4, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    ctx.fillStyle = '#6d4c41';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(centerX - 6, centerY - 5, 3, 3);
    ctx.fillRect(centerX - 1, centerY - 7, 3, 3);
    ctx.fillRect(centerX + 4, centerY - 5, 3, 3);
  }

  update() {
    if (this.delay > 0) {
      this.delay -= 1;
      if (this.delay === 0 && this.target) {
        const jitter = (Math.random() - 0.5) * 50;
        const targetCenterX = this.target.position.x + this.target.width / 2 + jitter;
        this.position.x = Math.max(0, Math.min(canvas.width - this.width, targetCenterX - this.width / 2));
      }
      this.draw();
      return;
    }
    this.previousPosition = { ...this.position };
    this.velocity.y += 0.55;
    this.position.y += this.velocity.y;
    this.draw();
    if (this.position.y + this.height >= ground) this.active = false;
  }
}

class ScamOffer {
  constructor({ x, y, direction, target, attacker }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(7, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.width = 30;
    this.height = 26;
    this.age = 0;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const x = this.position.x;
    const y = this.position.y + Math.sin(this.age / 5) * 3;
    ctx.fillStyle = '#e53935';
    ctx.fillRect(x, y + 6, this.width, this.height - 6);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + this.width / 2 - 3, y + 6, 6, this.height - 6);
    ctx.fillRect(x, y + 13, this.width, 5);
    ctx.beginPath();
    ctx.ellipse(x + this.width / 2 - 6, y + 4, 6, 4, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + this.width / 2 + 6, y + 4, 6, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 6, this.width, this.height - 6);
    ctx.fillStyle = '#fff';
    ctx.font = '900 12px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GRATIS', x + this.width / 2, y - 6);
  }

  update() {
    this.age += 1;
    this.position.x += this.velocity.x;
    this.draw();
    if (this.position.x + this.width < 0 || this.position.x > canvas.width) this.active = false;
  }
}

class ScamItem {
  constructor({ origin, kind, delay, target, attacker }) {
    this.origin = origin;
    this.kind = kind;
    this.delay = delay;
    this.target = target;
    this.attacker = attacker;
    this.width = 26;
    this.height = 22;
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.life = 150;
    this.active = true;
    this.placeAtOrigin();
    this.previousPosition = { ...this.position };
  }

  placeAtOrigin() {
    const targetCenterX = this.target.position.x + this.target.width / 2;
    if (this.origin === 'top') {
      this.position = { x: Math.max(20, Math.min(canvas.width - 40, targetCenterX + (Math.random() - 0.5) * 320)), y: -30 };
    } else if (this.origin === 'left') {
      this.position = { x: -30, y: ground - 70 - Math.random() * 140 };
    } else if (this.origin === 'right') {
      this.position = { x: canvas.width + 4, y: ground - 70 - Math.random() * 140 };
    } else {
      const direction = targetCenterX >= this.attacker.position.x + this.attacker.width / 2 ? 1 : -1;
      this.position = {
        x: direction > 0 ? this.attacker.position.x + this.attacker.width : this.attacker.position.x - this.width,
        y: this.attacker.position.y + 40,
      };
    }
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  launch() {
    if (this.origin === 'self') this.placeAtOrigin();
    const targetX = this.target.position.x + this.target.width / 2;
    const targetY = this.target.position.y + this.target.height / 2;
    const distanceX = targetX - (this.position.x + this.width / 2);
    const distanceY = targetY - (this.position.y + this.height / 2);
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const speed = getDebugProjectileSpeed(scammerItemSpeed, this.attacker);
    this.velocity = { x: (distanceX / distance) * speed, y: (distanceY / distance) * speed };
  }

  drawWarning() {
    const blink = Math.floor(this.delay / 4) % 2 === 0;
    if (!blink) return;
    const markerX = Math.max(14, Math.min(canvas.width - 14, this.position.x + this.width / 2));
    const markerY = Math.max(20, Math.min(ground - 10, this.position.y + this.height / 2));
    ctx.fillStyle = '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(markerX, markerY - 14);
    ctx.lineTo(markerX + 12, markerY);
    ctx.lineTo(markerX, markerY + 14);
    ctx.lineTo(markerX - 12, markerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#111';
    ctx.font = '900 14px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('$', markerX, markerY + 5);
  }

  draw() {
    if (this.delay > 0) {
      this.drawWarning();
      return;
    }
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    if (this.kind === 'goldRock') {
      ctx.fillStyle = '#757575';
      ctx.beginPath();
      ctx.moveTo(-13, 4);
      ctx.lineTo(-8, -10);
      ctx.lineTo(6, -11);
      ctx.lineTo(13, -2);
      ctx.lineTo(9, 10);
      ctx.lineTo(-9, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(-9, -6, 10, 4);
      ctx.fillRect(-2, 2, 11, 4);
      ctx.fillStyle = '#111';
      ctx.font = '900 8px Arial';
      ctx.fillText('ORO', 0, -14);
    } else if (this.kind === 'fakeWatch') {
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(-4, -14, 8, 28);
      ctx.fillStyle = '#fdd835';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.font = '900 6px Arial';
      ctx.fillText('ROLEZ', 0, 2);
    } else if (this.kind === 'fakeDiamond') {
      ctx.fillStyle = '#b3e5fc';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(12, -2);
      ctx.lineTo(0, 12);
      ctx.lineTo(-12, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.lineTo(2, 0);
      ctx.lineTo(-1, 6);
      ctx.stroke();
      ctx.fillStyle = '#ef5350';
      ctx.font = '900 7px Arial';
      ctx.fillText('VIDRIO', 0, 20);
    } else {
      ctx.fillStyle = '#81c784';
      ctx.fillRect(-14, -8, 28, 16);
      ctx.strokeRect(-14, -8, 28, 16);
      ctx.fillStyle = '#1b5e20';
      ctx.font = '900 10px Courier New, monospace';
      ctx.fillText('$3', 0, 4);
    }
    ctx.restore();
  }

  update() {
    if (this.delay > 0) {
      this.delay -= 1;
      if (this.delay === 0) {
        this.launch();
        playSound('scamItemWhoosh');
      }
      this.draw();
      return;
    }
    this.previousPosition = { ...this.position };
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.rotation += 0.35;
    this.life -= 1;
    this.draw();
    if (
      this.life <= 0 ||
      this.position.y > ground ||
      this.position.x < -80 ||
      this.position.x > canvas.width + 80 ||
      this.position.y < -120
    ) {
      this.active = false;
    }
  }
}

class ScamSlotMachine {
  constructor({ x, attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.width = 96;
    this.height = 120;
    this.x = Math.max(10, Math.min(canvas.width - this.width - 10, x - this.width / 2));
    this.y = -this.height - 40;
    this.state = 'falling';
    this.timer = 46;
    this.symbols = ['?', '?', '?'];
    this.result = null;
    this.label = '';
    this.active = true;
  }

  get landedY() {
    return ground - this.height;
  }

  land() {
    this.y = this.landedY;
    this.state = 'spinning';
    this.timer = 80;
    playSound('cutsceneLand');
    [this.attacker, this.target].forEach((fighter) => {
      if (fighter === this.attacker) return;
      const overlap = fighter.position.x + fighter.width > this.x && fighter.position.x < this.x + this.width;
      if (overlap) {
        applyDamage(this.attacker, fighter, getScammerDamage(scammerSlotLandingDamage, this.attacker), { isSpecial: true, damageType: 'scam' });
        fighter.velocity.y = getDebugKnockback(-7, fighter);
        fighter.velocity.x = getDebugKnockback(getFighterCenterX(fighter) < this.x + this.width / 2 ? -9 : 9, fighter);
      }
    });
  }

  resolve() {
    const subjectRoll = Math.random();
    const subject = subjectRoll < 0.5 ? 'target' : subjectRoll < 0.75 ? 'scammer' : 'both';
    const effectRoll = Math.random();
    const effect = effectRoll < 0.3 ? 'benefit' : effectRoll < 0.75 ? 'harm' : 'chaos';
    const affected = subject === 'target' ? [this.target] : subject === 'scammer' ? [this.attacker] : [this.target, this.attacker];
    const symbolSets = { benefit: ['\u2665', '\u2665', '\u2665'], harm: ['X', 'X', 'X'], chaos: ['?', '!', '?'] };
    const effectNames = { benefit: 'CURACION', harm: 'CASTIGO', chaos: 'CAOS' };
    const subjectNames = { target: getCharacterDisplayName(this.target).toUpperCase(), scammer: 'SCAMMER', both: 'AMBOS' };
    this.symbols = symbolSets[effect];
    this.result = effect;
    this.label = `${subjectNames[subject]}: ${effectNames[effect]}`;
    affected.forEach((fighter) => applyScamSlotEffect(fighter, effect, this.attacker));
    playSound(effect === 'benefit' ? 'cutsceneCash' : effect === 'harm' ? 'cutsceneAngry' : 'cutsceneQuestion');
    this.state = 'result';
    this.timer = 100;
  }

  draw() {
    const x = this.x;
    const y = this.y;
    if (this.state === 'falling') {
      const progress = 1 - this.timer / 46;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + progress * 0.35})`;
      ctx.beginPath();
      ctx.ellipse(x + this.width / 2, ground - 3, this.width * (0.3 + progress * 0.3), 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(x, y + 14, this.width, this.height - 14);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 8, y, this.width - 16, 22);
    ctx.fillStyle = '#111';
    ctx.font = '900 12px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUERTE?', x + this.width / 2, y + 16);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y + 14, this.width, this.height - 14);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(x + 10, y + 34, this.width - 20, 36);
    ctx.strokeRect(x + 10, y + 34, this.width - 20, 36);
    const reelWidth = (this.width - 20) / 3;
    const spinning = this.state === 'spinning';
    const pool = ['7', '$', 'X', '?', '\u2665'];
    for (let reel = 0; reel < 3; reel += 1) {
      const symbol = spinning ? pool[Math.floor(performance.now() / 60 + reel * 2) % pool.length] : this.symbols[reel];
      ctx.fillStyle = symbol === 'X' ? '#d50000' : symbol === '\u2665' ? '#e91e63' : '#111';
      ctx.font = '900 22px Arial';
      ctx.fillText(symbol, x + 10 + reelWidth * reel + reelWidth / 2, y + 60);
    }
    ctx.fillStyle = '#212121';
    ctx.fillRect(x + this.width - 4, y + 40, 10, 6);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(x + this.width + 8, y + (spinning ? 58 : 36), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 18, y + 84, this.width - 36, 10);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 12, y + this.height - 12, 18, 12);
    ctx.fillRect(x + this.width - 30, y + this.height - 12, 18, 12);

    if (this.state === 'result') {
      const colors = { benefit: '#66bb6a', harm: '#ef5350', chaos: '#ab47bc' };
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.font = '900 16px Courier New, monospace';
      const labelWidth = ctx.measureText(this.label).width + 20;
      ctx.fillRect(x + this.width / 2 - labelWidth / 2, y - 34, labelWidth, 26);
      ctx.fillStyle = colors[this.result];
      ctx.fillText(this.label, x + this.width / 2, y - 16);
    }
  }

  update() {
    this.timer -= 1;
    if (this.state === 'falling') {
      const progress = 1 - this.timer / 46;
      this.y = -this.height - 40 + (this.landedY + this.height + 40) * progress * progress;
      if (this.timer <= 0) this.land();
    } else if (this.state === 'spinning') {
      if (this.timer % 6 === 0) playSound('dumpsterRattle');
      if (this.timer <= 0) this.resolve();
    } else if (this.timer <= 0) {
      this.active = false;
    }
    this.draw();
  }
}

function drawSuitShape(kind, size) {
  ctx.beginPath();
  if (kind === 'heart') {
    ctx.moveTo(0, size * 0.9);
    ctx.bezierCurveTo(-size * 1.2, 0, -size * 0.6, -size, 0, -size * 0.35);
    ctx.bezierCurveTo(size * 0.6, -size, size * 1.2, 0, 0, size * 0.9);
  } else if (kind === 'diamond') {
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.75, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.75, 0);
    ctx.closePath();
  } else if (kind === 'spade') {
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 1.2, 0, size * 0.6, size * 0.8, 0, size * 0.35);
    ctx.bezierCurveTo(-size * 0.6, size * 0.8, -size * 1.2, 0, 0, -size);
    ctx.moveTo(0, size * 0.2);
    ctx.lineTo(size * 0.3, size);
    ctx.lineTo(-size * 0.3, size);
    ctx.closePath();
  } else {
    ctx.arc(0, -size * 0.45, size * 0.42, 0, Math.PI * 2);
    ctx.moveTo(size * 0.9, size * 0.15);
    ctx.arc(size * 0.48, size * 0.15, size * 0.42, 0, Math.PI * 2);
    ctx.moveTo(-size * 0.06, size * 0.15);
    ctx.arc(-size * 0.48, size * 0.15, size * 0.42, 0, Math.PI * 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.25, size);
    ctx.lineTo(-size * 0.25, size);
    ctx.closePath();
  }
}

class JesterSuit {
  constructor({ x, y, kind, delay = 0, aimX = null, aimY = null, velocityX = 0, velocityY = 0, speed = 7, damage, target, attacker, launchSound = false }) {
    this.position = { x, y };
    this.launchSound = launchSound;
    this.previousPosition = { x, y };
    this.kind = kind;
    this.delay = delay;
    this.aim = aimX === null ? null : { x: aimX, y: aimY };
    this.velocity = { x: velocityX, y: velocityY };
    this.speed = speed;
    this.damage = damage;
    this.target = target;
    this.attacker = attacker;
    this.width = 22;
    this.height = 22;
    this.life = 160;
    this.spin = Math.random() * Math.PI;
    this.active = true;
  }

  launch() {
    if (!this.aim) return;
    if (this.launchSound) playSound('jesterSuitLaunch');
    const distanceX = this.aim.x - (this.position.x + this.width / 2);
    const distanceY = this.aim.y - (this.position.y + this.height / 2);
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const speed = getDebugProjectileSpeed(this.speed, this.attacker);
    this.velocity = { x: (distanceX / distance) * speed, y: (distanceY / distance) * speed };
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const red = this.kind === 'heart' || this.kind === 'diamond';
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.sin(this.spin) * 0.4);
    ctx.globalAlpha = this.delay > 0 ? 0.35 + (Math.floor(this.delay / 4) % 2) * 0.3 : 1;
    drawSuitShape(this.kind, 11);
    ctx.fillStyle = red ? '#ff4081' : '#311b92';
    ctx.fill();
    ctx.strokeStyle = red ? '#fff' : '#b39ddb';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  update() {
    this.spin += 0.2;
    if (this.delay > 0) {
      this.delay -= 1;
      if (this.delay === 0) this.launch();
      this.draw();
      return;
    }
    this.previousPosition = { ...this.position };
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.life -= 1;
    this.draw();
    if (this.life <= 0 || this.position.y > ground + 10 || this.position.x < -60 || this.position.x > canvas.width + 60 || this.position.y < -80) {
      this.active = false;
    }
  }
}

class JesterBomb {
  constructor({ x, attacker, target }) {
    this.x = x;
    this.attacker = attacker;
    this.target = target;
    this.timer = 46;
    this.active = true;
  }

  draw() {
    const x = this.x;
    const y = ground - 34;
    const pop = this.timer < 12 ? (12 - this.timer) * 2 : 0;
    ctx.fillStyle = '#4527a0';
    ctx.fillRect(x - 16, y, 32, 34);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x - 16, y + 12, 32, 5);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 16, y, 32, 34);
    ctx.strokeStyle = '#bdbdbd';
    ctx.beginPath();
    for (let coil = 0; coil < 4; coil += 1) ctx.lineTo(x + (coil % 2 ? 6 : -6), y - 4 - coil * (3 + pop / 4));
    ctx.stroke();
    ctx.fillStyle = Math.floor(this.timer / 5) % 2 === 0 ? '#ff1744' : '#fdd835';
    ctx.beginPath();
    ctx.arc(x, y - 18 - pop, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.timer -= 1;
    if (this.timer > 0 && this.timer % 8 === 0) playSound('jesterBoxTick');
    this.draw();
    if (this.timer <= 0) {
      const kinds = ['heart', 'diamond', 'spade', 'club'];
      [[-1, -1], [1, -1], [-1, 0.2], [1, 0.2]].forEach(([directionX, directionY], index) => {
        jesterSuits.push(
          new JesterSuit({
            x: this.x - 11,
            y: ground - 50,
            kind: kinds[index],
            velocityX: directionX * 6,
            velocityY: directionY * 6,
            damage: jesterBombSuitDamage,
            target: this.target,
            attacker: this.attacker,
          })
        );
      });
      playSound('jesterBoxPop');
      this.active = false;
    }
  }
}

// Secret 1: a ring of suits spins around the target, then fires one by one around the circle.
// Lives in the jesterBombs list (same update/draw/attacker interface).
class JesterSuitRing {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.center = { x: getFighterCenterX(target), y: target.position.y + target.height / 2 };
    this.angle = Math.random() * Math.PI * 2;
    this.frame = 0;
    this.released = 0;
    this.orbitFrames = 64;
    this.releaseEvery = 5;
    this.active = true;
  }

  getSlot(index) {
    const radius = 210 - Math.min(1, this.frame / this.orbitFrames) * 40;
    const angle = this.angle + (Math.PI * 2 * index) / jesterRingSuitCount;
    return {
      x: this.center.x + Math.cos(angle) * radius,
      y: Math.min(ground - 14, this.center.y + Math.sin(angle) * radius * 0.85),
    };
  }

  draw() {
    const kinds = ['heart', 'spade', 'diamond', 'club'];
    ctx.save();
    ctx.strokeStyle = `rgba(234, 128, 252, ${0.25 + 0.15 * Math.sin(this.frame / 4)})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    const radius = 210 - Math.min(1, this.frame / this.orbitFrames) * 40;
    ctx.ellipse(this.center.x, this.center.y, radius, radius * 0.85, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let index = this.released; index < jesterRingSuitCount; index += 1) {
      const slot = this.getSlot(index);
      const kind = kinds[index % kinds.length];
      const red = kind === 'heart' || kind === 'diamond';
      ctx.save();
      ctx.translate(slot.x, slot.y);
      ctx.globalAlpha = Math.min(1, this.frame / 16);
      drawSuitShape(kind, 11);
      ctx.fillStyle = red ? '#ff4081' : '#311b92';
      ctx.fill();
      ctx.strokeStyle = index === this.released && this.frame >= this.orbitFrames ? '#fdd835' : red ? '#fff' : '#b39ddb';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  update() {
    this.frame += 1;
    // the ring drifts slowly after the target, so running away is how you dodge it
    const targetX = getFighterCenterX(this.target);
    const targetY = this.target.position.y + this.target.height / 2;
    this.center.x += Math.max(-1.6, Math.min(1.6, targetX - this.center.x));
    this.center.y += Math.max(-5, Math.min(5, targetY - this.center.y));
    this.angle += 0.035;
    if (this.frame >= this.orbitFrames && (this.frame - this.orbitFrames) % this.releaseEvery === 0 && this.released < jesterRingSuitCount) {
      const slot = this.getSlot(this.released);
      const kinds = ['heart', 'spade', 'diamond', 'club'];
      const suit = new JesterSuit({
        x: slot.x - 11,
        y: slot.y - 11,
        kind: kinds[this.released % kinds.length],
        aimX: this.center.x,
        aimY: this.center.y,
        speed: 8.5,
        damage: jesterRingSuitDamage,
        target: this.target,
        attacker: this.attacker,
      });
      suit.ringSuit = true;
      suit.launch();
      jesterSuits.push(suit);
      if (this.released % 2 === 0) playSound('jesterSuitLaunch');
      this.released += 1;
    }
    this.draw();
    if (this.released >= jesterRingSuitCount) this.active = false;
  }
}

// Secret 2: four scythes spin around the target, crash together and spread apart several times.
class JesterScytheStorm {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.center = { x: getFighterCenterX(target), y: target.position.y + target.height / 2 };
    this.frame = 0;
    this.introFrames = 34;
    this.angle = 0;
    this.scythes = [0, 1, 2, 3].map((index) => {
      const scythe = Object.create(JesterScythe.prototype);
      Object.assign(scythe, {
        attacker,
        target,
        index,
        width: 44,
        height: 44,
        rotation: index,
        position: { x: this.center.x - 22, y: this.center.y - 22 },
        previousPosition: { x: this.center.x - 22, y: this.center.y - 22 },
        hitCooldown: 0,
      });
      return scythe;
    });
    this.active = true;
  }

  getRadius() {
    if (this.frame < this.introFrames) return 220;
    const cycleProgress = ((this.frame - this.introFrames) % jesterStormCycleFrames) / jesterStormCycleFrames;
    // wide -> crash in the middle -> wide again
    return 18 + (220 - 18) * (0.5 + 0.5 * Math.cos(cycleProgress * Math.PI * 2));
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.frame / 20);
    this.scythes.forEach((scythe) => scythe.draw());
    ctx.restore();
  }

  update() {
    this.frame += 1;
    const targetX = getFighterCenterX(this.target);
    const targetY = this.target.position.y + this.target.height / 2;
    this.center.x += Math.max(-2.2, Math.min(2.2, targetX - this.center.x));
    this.center.y += Math.max(-5, Math.min(5, targetY - this.center.y));
    this.angle += 0.06;
    const radius = this.getRadius();
    const stormFrame = this.frame - this.introFrames;
    if (stormFrame >= 0 && stormFrame % jesterStormCycleFrames === Math.floor(jesterStormCycleFrames / 2)) playSound('jesterStormClash');
    if (this.frame % 10 === 0) playSound('jesterScytheSpin');
    this.scythes.forEach((scythe) => {
      const angle = this.angle + (Math.PI / 2) * scythe.index;
      scythe.previousPosition = { ...scythe.position };
      scythe.position.x = this.center.x + Math.cos(angle) * radius - scythe.width / 2;
      scythe.position.y = Math.min(ground - scythe.height, this.center.y + Math.sin(angle) * radius * 0.8 - scythe.height / 2);
      scythe.rotation += 0.5;
      if (this.frame > this.introFrames && this.target.jesterStormHitTimer <= 0 && !gameOver) {
        const result = hitWithJesterProjectile(scythe, this.target, jesterStormScytheDamage);
        if (result) this.target.jesterStormHitTimer = jesterStormHitGrace;
      }
    });
    this.draw();
    if (stormFrame >= jesterStormCycles * jesterStormCycleFrames) this.active = false;
  }
}

class JesterScythe {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.direction = getFighterCenterX(target) >= getFighterCenterX(attacker) ? 1 : -1;
    this.position = { x: getFighterCenterX(attacker) - 24, y: attacker.position.y + 40 };
    this.previousPosition = { ...this.position };
    this.width = 48;
    this.height = 48;
    this.velocityX = getDebugProjectileSpeed(11, attacker) * this.direction;
    this.rotation = 0;
    this.returning = false;
    this.hitOut = false;
    this.hitBack = false;
    this.life = 200;
    this.active = true;
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = '#4a148c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(22, 0);
    ctx.stroke();
    [1, -1].forEach((side) => {
      ctx.fillStyle = '#b388ff';
      ctx.beginPath();
      ctx.moveTo(side * 20, -4);
      ctx.quadraticCurveTo(side * 30, -26, side * 4, -30);
      ctx.quadraticCurveTo(side * 22, -18, side * 14, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.restore();
  }

  update() {
    this.previousPosition = { ...this.position };
    this.rotation += 0.45 * this.direction;
    this.velocityX -= this.direction * 0.24;
    if (!this.returning && Math.sign(this.velocityX) !== this.direction) this.returning = true;
    this.position.x += this.velocityX;
    const homeY = this.attacker.position.y + 40;
    this.position.y += (homeY - this.position.y) * 0.05;
    this.life -= 1;
    if (this.life % 12 === 0) playSound('jesterScytheSpin');
    this.draw();
    const home = Math.abs(this.position.x + this.width / 2 - getFighterCenterX(this.attacker)) < 30;
    if (this.returning && home) playSound('jesterScytheCatch');
    if ((this.returning && home) || this.life <= 0) this.active = false;
  }
}

class IcedThugBlade extends ChronoBlade {
  constructor({ x, y, target, attacker }) {
    super({ x, y, target, attacker });
    const speed = getDebugProjectileSpeed(icedThugBladeSpeed, attacker);
    const currentSpeed = Math.max(1, Math.hypot(this.velocity.x, this.velocity.y));
    this.velocity = {
      x: (this.velocity.x / currentSpeed) * speed,
      y: (this.velocity.y / currentSpeed) * speed,
    };
    this.width = 38;
    this.height = 16;
  }

  draw() {
    const pointsRight = this.velocity.x > 0;
    const tipX = pointsRight ? this.position.x + this.width : this.position.x;
    const baseX = pointsRight ? this.position.x : this.position.x + this.width;
    const centerY = this.position.y + this.height / 2;
    ctx.fillStyle = 'rgba(189, 247, 255, 0.35)';
    ctx.fillRect(this.position.x - 4, this.position.y - 2, this.width + 8, this.height + 4);
    ctx.fillStyle = '#e0fcff';
    ctx.beginPath();
    ctx.moveTo(tipX, centerY);
    ctx.lineTo(baseX, this.position.y);
    ctx.lineTo(baseX + (pointsRight ? 8 : -8), centerY);
    ctx.lineTo(baseX, this.position.y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3aa9c9';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.moveTo(baseX + (pointsRight ? 8 : -8), centerY);
    ctx.lineTo(tipX + (pointsRight ? -6 : 6), centerY);
    ctx.stroke();
  }
}

class IcedThugFrostField {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.centerX = target.position.x + target.width / 2;
    this.radius = icedThugFrostFieldRadius;
    this.timer = getDebugDuration(icedThugFrostFieldDuration, attacker);
    this.maxTimer = this.timer;
    this.active = true;
  }

  get top() {
    return ground - this.radius * 1.1;
  }

  draw() {
    const progress = this.timer / this.maxTimer;
    const left = this.centerX - this.radius;
    const top = this.top;
    const elapsed = this.maxTimer - this.timer;
    const fieldGradient = ctx.createLinearGradient(0, top, 0, ground);
    fieldGradient.addColorStop(0, 'rgba(160, 236, 255, 0)');
    fieldGradient.addColorStop(1, `rgba(160, 236, 255, ${0.18 + progress * 0.2})`);
    ctx.fillStyle = fieldGradient;
    ctx.fillRect(left, top, this.radius * 2, ground - top);
    ctx.fillStyle = `rgba(224, 252, 255, ${0.55 + progress * 0.35})`;
    ctx.fillRect(left, ground - 8, this.radius * 2, 8);
    ctx.strokeStyle = 'rgba(58, 169, 201, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let spikeX = left + 12; spikeX < left + this.radius * 2 - 10; spikeX += 28) {
      const spikeHeight = 14 + (Math.abs(Math.round(spikeX * 7)) % 18);
      ctx.moveTo(spikeX - 7, ground - 6);
      ctx.lineTo(spikeX, ground - 6 - spikeHeight * Math.min(1, elapsed / 12));
      ctx.lineTo(spikeX + 7, ground - 6);
    }
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * progress + 0.2})`;
    for (let flake = 0; flake < 8; flake += 1) {
      const flakeX = left + ((flake * 53 + elapsed * 1.4) % (this.radius * 2));
      const flakeY = top + ((flake * 37 + elapsed * 2) % (ground - top));
      ctx.fillRect(flakeX, flakeY, 3, 3);
    }
  }

  isTargetInside() {
    if (!this.target || this.target.health <= 0) return false;
    const targetLeft = this.target.position.x;
    const targetRight = this.target.position.x + this.target.width;
    const targetBottom = this.target.position.y + this.target.height;
    return targetRight >= this.centerX - this.radius && targetLeft <= this.centerX + this.radius && targetBottom >= this.top;
  }

  update() {
    this.timer -= 1;
    if (this.isTargetInside()) {
      this.target.icedSlowTimer = Math.max(this.target.icedSlowTimer, icedThugFrostLingerDuration);
      this.target.icedVulnerableTimer = Math.max(this.target.icedVulnerableTimer, icedThugFrostLingerDuration);
    }
    this.draw();
    if (this.timer <= 0) this.active = false;
  }
}


// Chapter 4 robot attacks. kind: 'discharge' (electric spark rolling along the floor), 'rivet' (rusty bolt),
// 'scrap' (junk thrown in an arc) or 'tickBomb' (a clock bomb that explodes after a countdown).
class RobotShot {
  constructor({ kind, x, y, direction = 1, attacker, target, velocityX = 0, velocityY = 0, width = null, timer = null, variant = null }) {
    this.kind = kind;
    this.attacker = attacker;
    this.target = target;
    this.direction = direction;
    this.position = { x, y };
    this.previousPosition = { x, y };
    this.velocity = { x: velocityX, y: velocityY };
    this.width = kind === 'discharge' ? 34 : kind === 'rivet' ? 26 : kind === 'scrap' ? 20 : 30;
    this.height = kind === 'discharge' ? 30 : kind === 'rivet' ? 12 : kind === 'scrap' ? 20 : 30;
    this.timer = kind === 'tickBomb' ? 100 : 0;
    if (width !== null) this.width = width;
    if (timer !== null) this.timer = timer;
    if (kind === 'laser') this.height = 20;
    this.variant = variant;
    this.life = 220;
    if (kind === 'hammer') {
      this.width = 46;
      this.height = 46;
      this.life = 400;
    }
    if (kind === 'energy') {
      this.width = 64;
      this.height = 44;
      this.life = 300;
    }
    if (kind === 'bigShot') {
      this.width = variant === 'small' ? 30 : 56;
      this.height = variant === 'small' ? 22 : 40;
      this.life = 260;
    }
    if (kind === 'pipis') {
      this.width = 22;
      this.height = 26;
      this.life = 260;
    }
    if (kind === 'neoHead') {
      this.width = 24;
      this.height = 24;
      this.life = variant === 'homing' ? 320 : 200;
    }
    this.spin = Math.random() * Math.PI;
    this.exploded = 0;
    this.active = true;
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const time = performance.now() / 1000;
    ctx.save();
    if (this.kind === 'pipis') {
      // a white egg with pink and yellow spots
      ctx.translate(centerX, centerY);
      ctx.rotate(this.spin);
      ctx.fillStyle = '#f5f5f5';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff4081';
      ctx.beginPath();
      ctx.arc(-4, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fdd835';
      ctx.beginPath();
      ctx.arc(4, 5, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.kind === 'neoHead') {
      // a little flying Scammer head
      ctx.translate(centerX, centerY);
      ctx.rotate(this.variant === 'homing' ? Math.sin(time * 12) * 0.2 : this.spin);
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
      if (this.variant === 'homing') {
        ctx.strokeStyle = 'rgba(233, 30, 99, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 1, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.kind === 'bigShot') {
      // NEO SCAMMER's BIG SHOT: a big yellow bullet with a pink trail
      const trail = ctx.createLinearGradient(centerX - this.direction * 120, centerY, centerX, centerY);
      trail.addColorStop(0, 'rgba(255, 64, 129, 0)');
      trail.addColorStop(1, 'rgba(255, 64, 129, 0.6)');
      ctx.fillStyle = trail;
      ctx.fillRect(Math.min(centerX, centerX - this.direction * 120), centerY - 10, 120, 20);
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#fdd835';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff59d';
      ctx.beginPath();
      ctx.ellipse(centerX + this.direction * 8, centerY - 4, this.width / 5, this.height / 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.font = '900 9px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BIG', centerX, centerY + 3);
    } else if (this.kind === 'energy') {
      // Omegarius's energy shot: gold, or Reflecter's cyan once his shield bounces it back
      const rgb = this.reflected ? '38, 198, 218' : '255, 202, 40';
      const trail = ctx.createLinearGradient(centerX - this.direction * 150, centerY, centerX, centerY);
      trail.addColorStop(0, `rgba(${rgb}, 0)`);
      trail.addColorStop(1, `rgba(${rgb}, 0.6)`);
      ctx.fillStyle = trail;
      ctx.fillRect(Math.min(centerX, centerX - this.direction * 150), centerY - 14, 150, 28);
      ctx.shadowColor = `rgb(${rgb})`;
      ctx.shadowBlur = 26;
      ctx.fillStyle = `rgba(${rgb}, 0.9)`;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, this.width / 2 + Math.sin(time * 40) * 3, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(centerX + this.direction * 6, centerY, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (this.secret) {
        // the secret shot: sparkling rings and a hint for the player
        ctx.strokeStyle = `rgba(${rgb}, 0.6)`;
        ctx.lineWidth = 3;
        for (let ring = 0; ring < 2; ring += 1) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, this.width / 2 + 10 + ring * 12 + Math.sin(time * 20 + ring) * 4, this.height / 2 + 8 + ring * 10, time * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.font = '900 20px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#111';
        ctx.fillStyle = this.reflected ? '#26c6da' : '#ffca28';
        const hint = this.reflected ? `DEVUELTA! ${this.volleys}/${omegariusSecretVolleys}` : `DEVOLVELA CON EL ESCUDO (Q)!  ${this.volleys}/${omegariusSecretVolleys}`;
        ctx.strokeText(hint, canvas.width / 2, 150);
        ctx.fillText(hint, canvas.width / 2, 150);
      }
    } else if (this.kind === 'hammer') {
      // the Juez de Bronce's thrown hammer, spinning
      ctx.strokeStyle = 'rgba(255, 202, 40, 0.35)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, this.spin - 1.4 * Math.sign(this.direction || 1), this.spin);
      ctx.stroke();
      ctx.translate(centerX, centerY);
      ctx.rotate(this.spin);
      drawOmegariusHammer(0, 40, 0, 0.8);
    } else if (this.kind === 'discharge' && this.variant === 'gold') {
      // a gold shockwave from the hammer slam, running along the floor
      const crest = this.position.y - 8 + Math.sin(time * 30) * 3;
      ctx.shadowColor = '#ffca28';
      ctx.shadowBlur = 16;
      ctx.fillStyle = 'rgba(255, 202, 40, 0.85)';
      ctx.beginPath();
      ctx.moveTo(this.position.x - 4, ground);
      ctx.lineTo(centerX + this.direction * 8, crest);
      ctx.lineTo(this.position.x + this.width + 4, ground);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff8e1';
      ctx.beginPath();
      ctx.moveTo(this.position.x + 8, ground);
      ctx.lineTo(centerX + this.direction * 8, crest + 12);
      ctx.lineTo(this.position.x + this.width - 8, ground);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#5d3a1a';
      for (let chip = 0; chip < 3; chip += 1) ctx.fillRect(centerX - this.direction * (10 + chip * 12), ground - 10 - ((time * 90 + chip * 7) % 16), 4, 4);
      ctx.strokeStyle = 'rgba(255, 202, 40, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, ground - 2);
      ctx.lineTo(centerX - this.direction * 70, ground - 2);
      ctx.stroke();
    } else if (this.kind === 'discharge') {
      ctx.shadowColor = '#4fc3f7';
      ctx.shadowBlur = 16;
      ctx.fillStyle = 'rgba(179, 229, 252, 0.85)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10 + Math.sin(time * 40) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e1f5fe';
      ctx.lineWidth = 2;
      for (let bolt = 0; bolt < 4; bolt += 1) {
        ctx.beginPath();
        let boltX = centerX;
        let boltY = centerY;
        ctx.moveTo(boltX, boltY);
        for (let step = 0; step < 3; step += 1) {
          boltX += (Math.random() - 0.5) * 22 - this.direction * 5;
          boltY += (Math.random() - 0.5) * 18;
          ctx.lineTo(boltX, boltY);
        }
        ctx.stroke();
      }
      // trail along the floor
      ctx.strokeStyle = 'rgba(79, 195, 247, 0.5)';
      ctx.beginPath();
      ctx.moveTo(centerX, ground - 2);
      ctx.lineTo(centerX - this.direction * 60, ground - 2);
      ctx.stroke();
    } else if (this.kind === 'rivet') {
      ctx.translate(centerX, centerY);
      ctx.fillStyle = '#a1887f';
      ctx.fillRect(-13, -4, 22, 8);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(this.direction > 0 ? 7 : -13, -6, 6, 12);
      ctx.fillStyle = 'rgba(255, 171, 64, 0.7)';
      ctx.fillRect(this.direction > 0 ? -22 : 9, -2, 13, 4);
    } else if (this.kind === 'scrap') {
      ctx.translate(centerX, centerY);
      ctx.rotate(this.spin);
      ctx.fillStyle = '#607d8b';
      ctx.fillRect(-10, -7, 20, 14);
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(-10, -7, 20, 3);
      ctx.fillStyle = '#263238';
      ctx.fillRect(-6, -2, 3, 3);
      ctx.fillRect(3, -2, 3, 3);
    } else if (this.kind === 'laser') {
      const firing = this.timer <= 24;
      const goldBeam = this.variant === 'gold';
      const beamRgb = goldBeam ? '255, 202, 40' : '255, 23, 68';
      if (!firing) {
        ctx.strokeStyle = Math.floor(this.timer / 4) % 2 === 0 ? `rgba(${beamRgb}, 0.8)` : `rgba(${beamRgb}, 0.25)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 8]);
        ctx.beginPath();
        ctx.moveTo(this.position.x, centerY);
        ctx.lineTo(this.position.x + this.width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.shadowColor = goldBeam ? '#ffca28' : '#ff1744';
        ctx.shadowBlur = 24;
        ctx.fillStyle = `rgba(${beamRgb}, 0.85)`;
        ctx.fillRect(this.position.x, this.position.y - 4, this.width, this.height + 8);
        ctx.fillStyle = goldBeam ? '#fff8e1' : '#ffebee';
        ctx.fillRect(this.position.x, centerY - 3, this.width, 6);
        ctx.shadowBlur = 0;
      }
    } else if (this.kind === 'drop') {
      const big = this.variant === 'fist';
      const hammerDrop = this.variant === 'hammer';
      const dealDrop = this.variant === 'deal';
      const radius = big ? 80 : hammerDrop ? 58 : dealDrop ? 52 : 48;
      if (this.exploded > 0) {
        const blast = radius * (1.3 - this.exploded / 30);
        const glow = ctx.createRadialGradient(centerX, ground - 20, 0, centerX, ground - 20, blast);
        glow.addColorStop(0, `rgba(255, 255, 255, ${this.exploded / 18})`);
        glow.addColorStop(0.5, hammerDrop ? `rgba(255, 213, 79, ${this.exploded / 22})` : `rgba(255, 138, 101, ${this.exploded / 22})`);
        glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(centerX - blast, ground - 20 - blast, blast * 2, blast * 2);
      } else {
        const warn = Math.min(1, 1 - this.timer / 60);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + warn * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(centerX, ground - 2, radius * (0.4 + warn * 0.6), 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hammerDrop ? `rgba(255, 202, 40, ${0.4 + Math.random() * 0.4})` : `rgba(255, 23, 68, ${0.4 + Math.random() * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, ground - 2, radius, 12, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (this.timer < 16) {
          // the object falling from the ceiling
          const fallY = ground - 20 - this.timer * 34;
          if (hammerDrop) {
            drawOmegariusHammer(centerX, fallY - 112, Math.PI, 1, 1.3);
          } else if (dealDrop) {
            // a little Scammer head, grinning, with its pink and yellow glasses
            ctx.fillStyle = '#f2f2f2';
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.fillRect(centerX - 14, fallY - 30, 28, 28);
            ctx.strokeRect(centerX - 14, fallY - 30, 28, 28);
            ctx.fillStyle = '#111';
            ctx.fillRect(centerX - 14, fallY - 32, 28, 6);
            ctx.fillStyle = '#ff4081';
            ctx.fillRect(centerX - 13, fallY - 23, 11, 7);
            ctx.fillStyle = '#fdd835';
            ctx.fillRect(centerX + 2, fallY - 23, 11, 7);
            ctx.fillStyle = '#111';
            ctx.fillRect(centerX - 8, fallY - 11, 16, 5);
            ctx.fillStyle = '#ff4081';
            ctx.font = '900 10px Courier New, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('[[DEAL]]', centerX, fallY - 38);
          } else if (big) {
            ctx.fillStyle = '#455a64';
            ctx.fillRect(centerX - 44, fallY - 70, 88, 70);
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 3;
            ctx.strokeRect(centerX - 44, fallY - 70, 88, 70);
            ctx.fillStyle = '#263238';
            for (let knuckle = 0; knuckle < 4; knuckle += 1) ctx.fillRect(centerX - 40 + knuckle * 21, fallY - 14, 18, 14);
            ctx.fillStyle = '#7e57c2';
            ctx.fillRect(centerX - 44, fallY - 78, 88, 10);
          } else {
            ctx.fillStyle = '#b0bec5';
            ctx.fillRect(centerX - 6, fallY - 36, 12, 30);
            ctx.fillStyle = '#ff1744';
            ctx.beginPath();
            ctx.moveTo(centerX - 6, fallY - 6);
            ctx.lineTo(centerX + 6, fallY - 6);
            ctx.lineTo(centerX, fallY + 6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 171, 64, 0.8)';
            ctx.fillRect(centerX - 3, fallY - 56, 6, 20);
          }
        }
      }
    } else if (this.kind === 'tickBomb') {
      if (this.exploded > 0) {
        const radius = 30 + (18 - this.exploded) * 5;
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        glow.addColorStop(0, `rgba(255, 255, 255, ${this.exploded / 18})`);
        glow.addColorStop(0.5, `rgba(255, 171, 64, ${this.exploded / 24})`);
        glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      } else {
        const urgent = this.timer < 35;
        ctx.fillStyle = '#37474f';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = urgent && Math.floor(this.timer / 4) % 2 === 0 ? '#ff5252' : '#e8eaf6';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1a237e';
        ctx.lineWidth = 2;
        const hand = (1 - this.timer / 100) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(hand) * 9, centerY + Math.sin(hand) * 9);
        ctx.stroke();
        ctx.fillStyle = '#fdd835';
        ctx.fillRect(centerX - 4, centerY - 21, 8, 5);
        // warning ring showing the blast radius
        ctx.strokeStyle = `rgba(255, 82, 82, ${urgent ? 0.6 : 0.25})`;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.ellipse(centerX, ground - 4, 90, 14, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.restore();
  }

  update() {
    this.previousPosition = { ...this.position };
    this.life -= 1;
    if (this.kind === 'energy' || this.kind === 'bigShot') {
      this.position.x += this.velocity.x;
    } else if (this.kind === 'pipis') {
      this.velocity.y += 0.38;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.spin += 0.2;
    } else if (this.kind === 'neoHead') {
      if (this.variant === 'homing' && this.timer > 0) {
        // chases the target for a while, then flies straight on
        this.timer -= 1;
        const targetX = this.target.position.x + this.target.width / 2 - this.width / 2;
        const targetY = this.target.position.y + this.target.height / 2 - this.height / 2;
        const distanceX = targetX - this.position.x;
        const distanceY = targetY - this.position.y;
        const distance = Math.hypot(distanceX, distanceY) || 1;
        this.velocity.x += ((distanceX / distance) * 4.2 - this.velocity.x) * 0.06;
        this.velocity.y += ((distanceY / distance) * 4.2 - this.velocity.y) * 0.06;
      } else if (this.variant !== 'homing') {
        this.velocity.y += 0.25;
        this.spin += 0.3;
      }
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y > ground + 40 || this.position.y < -120) this.active = false;
    } else if (this.kind === 'hammer') {
      // flies out, then comes back to the hand that threw it
      this.spin += 0.45 * (this.direction || 1);
      if (!this.returning) {
        this.position.x += this.velocity.x;
        this.traveled = (this.traveled || 0) + Math.abs(this.velocity.x);
        if (this.traveled > 560 || this.position.x < 0 || this.position.x + this.width > canvas.width) {
          this.position.x = Math.max(0, Math.min(canvas.width - this.width, this.position.x));
          this.returning = true;
        }
      } else {
        const owner = this.attacker;
        const homeX = owner.position.x + owner.width / 2 - this.width / 2;
        const homeY = owner.position.y + 40;
        const distanceX = homeX - this.position.x;
        const distanceY = homeY - this.position.y;
        const distance = Math.hypot(distanceX, distanceY);
        if (distance < 18 || owner.health <= 0) {
          this.active = false;
        } else {
          this.position.x += (distanceX / distance) * 14;
          this.position.y += (distanceY / distance) * 14;
        }
      }
    } else if (this.kind === 'discharge') {
      this.position.x += this.velocity.x;
      this.position.y = ground - this.height;
    } else if (this.kind === 'rivet') {
      this.position.x += this.velocity.x;
    } else if (this.kind === 'scrap') {
      this.velocity.y += 0.38;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.spin += 0.3;
      if (this.position.y + this.height >= ground) this.active = false;
    } else if (this.kind === 'laser') {
      this.timer -= 1;
      if (this.timer <= 0) this.active = false;
    } else if (this.kind === 'tickBomb' || this.kind === 'drop') {
      if (this.exploded > 0) {
        this.exploded -= 1;
        if (this.exploded <= 0) this.active = false;
      } else {
        this.timer -= 1;
        if (this.kind === 'tickBomb' && this.timer % 15 === 0) playSound('robotTick');
      }
    }
    if (this.life <= 0 || this.position.x < -80 || this.position.x > canvas.width + 80) this.active = false;
    this.draw();
  }
}
