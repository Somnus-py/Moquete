// Moquete - Mapas, pantallas de victoria y cinematicas del Arcade
// (parte 8 de 10; los archivos se cargan en orden desde index.html)

function drawArcaneLibraryStage() {
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#12071f');
  sky.addColorStop(0.55, '#2d1650');
  sky.addColorStop(1, '#1a0b2e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#3b2a6b';
  ctx.beginPath();
  ctx.moveTo(392, ground - 150);
  ctx.lineTo(392, 210);
  ctx.arc(512, 210, 120, Math.PI, 0);
  ctx.lineTo(632, ground - 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e1d5ff';
  ctx.beginPath();
  ctx.arc(548, 176, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b2a6b';
  ctx.beginPath();
  ctx.arc(564, 166, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#140a24';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(512, 90);
  ctx.lineTo(512, ground - 150);
  ctx.moveTo(392, 250);
  ctx.lineTo(632, 250);
  ctx.stroke();

  const bookColors = ['#8e24aa', '#3949ab', '#c62828', '#00897b', '#f9a825', '#6d4c41'];
  [24, 152, 782, 910].forEach((shelfX, shelfIndex) => {
    ctx.fillStyle = '#2a160c';
    ctx.fillRect(shelfX, 120, 92, ground - 120);
    ctx.fillStyle = '#4e2c17';
    for (let rowY = 136; rowY < ground - 40; rowY += 52) {
      let bookX = shelfX + 8;
      let bookIndex = shelfIndex;
      while (bookX < shelfX + 82) {
        const bookWidth = 8 + ((bookIndex * 5 + rowY) % 7);
        const bookHeight = 30 + ((bookIndex * 11 + rowY) % 12);
        ctx.fillStyle = bookColors[(bookIndex + rowY) % bookColors.length];
        ctx.fillRect(bookX, rowY + 42 - bookHeight, Math.min(bookWidth, shelfX + 84 - bookX), bookHeight);
        bookX += bookWidth + 2;
        bookIndex += 1;
      }
      ctx.fillStyle = '#4e2c17';
      ctx.fillRect(shelfX, rowY + 42, 92, 8);
    }
  });

  [[300, 150], [720, 130], [420, 320], [620, 300]].forEach(([candleX, candleY], index) => {
    const bob = Math.sin(time * 2 + index) * 6;
    ctx.fillStyle = '#f3e5f5';
    ctx.fillRect(candleX - 5, candleY + bob, 10, 26);
    ctx.fillStyle = 'rgba(255, 213, 79, 0.35)';
    ctx.beginPath();
    ctx.arc(candleX, candleY + bob - 6, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.ellipse(candleX, candleY + bob - 6, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#1b1030';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#7e57c2';
  ctx.fillRect(0, ground - 8, canvas.width, 8);
  ctx.strokeStyle = 'rgba(126, 87, 194, 0.35)';
  ctx.lineWidth = 2;
  for (let tileX = 0; tileX < canvas.width; tileX += 64) {
    ctx.beginPath();
    ctx.moveTo(tileX, ground);
    ctx.lineTo(tileX, canvas.height);
    ctx.stroke();
  }

  arcaneRuneSpots.forEach((runeX, index) => {
    const active = index === arcaneRuneIndex;
    const pulse = active ? (Math.sin(time * 6) + 1) / 2 : 0;
    ctx.save();
    ctx.translate(runeX, ground - 4);
    ctx.scale(1, 0.28);
    ctx.strokeStyle = active ? `rgba(234, 128, 252, ${0.7 + pulse * 0.3})` : 'rgba(149, 117, 205, 0.3)';
    ctx.lineWidth = active ? 8 : 4;
    ctx.beginPath();
    ctx.arc(0, 0, arcaneRuneRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.rotate(active ? time * 1.5 : 0);
    ctx.beginPath();
    for (let point = 0; point < 5; point += 1) {
      const angle = -Math.PI / 2 + (point * Math.PI * 4) / 5;
      const pointX = Math.cos(angle) * (arcaneRuneRadius - 12);
      const pointY = Math.sin(angle) * (arcaneRuneRadius - 12);
      if (point === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    if (active) {
      const glow = ctx.createLinearGradient(0, ground - 140, 0, ground);
      glow.addColorStop(0, 'rgba(234, 128, 252, 0)');
      glow.addColorStop(1, `rgba(234, 128, 252, ${0.18 + pulse * 0.14})`);
      ctx.fillStyle = glow;
      ctx.fillRect(runeX - arcaneRuneRadius, ground - 140, arcaneRuneRadius * 2, 140);
    }
  });
}

function drawClockTowerStage() {
  const time = performance.now() / 1000;
  const night = ctx.createLinearGradient(0, 0, 0, ground);
  night.addColorStop(0, '#050b14');
  night.addColorStop(0.5, '#0d1b2a');
  night.addColorStop(1, '#07111f');
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(224, 247, 250, 0.7)';
  [[80, 60], [230, 110], [880, 70], [960, 150], [640, 40], [350, 50]].forEach(([starX, starY]) => ctx.fillRect(starX, starY, 3, 3));

  const towers = [
    [30, 170, 96, 340],
    [150, 120, 70, 390],
    [806, 110, 76, 400],
    [900, 180, 110, 330],
  ];
  towers.forEach(([x, y, width, height], index) => {
    ctx.fillStyle = index % 2 === 0 ? '#101827' : '#141f31';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(38, 198, 218, 0.6)' : 'rgba(255, 213, 79, 0.45)';
    for (let wy = y + 20; wy < y + height - 20; wy += 30) {
      ctx.fillRect(x + 12, wy, 10, 12);
      ctx.fillRect(x + width - 22, wy, 10, 12);
    }
  });

  ctx.fillStyle = '#16233a';
  ctx.fillRect(402, 110, 220, ground - 110);
  ctx.beginPath();
  ctx.moveTo(390, 110);
  ctx.lineTo(512, 30);
  ctx.lineTo(634, 110);
  ctx.closePath();
  ctx.fill();

  drawGear(300, 250, 46, 10, time * 0.8, '#1f3b57');
  drawGear(724, 230, 58, 12, -time * 0.6, '#1f3b57');
  drawGear(250, 360, 28, 8, -time * 1.3, '#26c6da');
  drawGear(770, 360, 32, 8, time * 1.1, '#26c6da');

  const clockX = 512;
  const clockY = 210;
  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.arc(clockX, clockY, 84, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#26c6da';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = '#0d1b2a';
  for (let tick = 0; tick < 12; tick += 1) {
    const angle = (Math.PI * 2 * tick) / 12;
    ctx.fillRect(clockX + Math.cos(angle) * 70 - 3, clockY + Math.sin(angle) * 70 - 3, 6, 6);
  }
  const minuteAngle = time * 0.9 - Math.PI / 2;
  const hourAngle = time * 0.075 - Math.PI / 2;
  ctx.strokeStyle = '#0d1b2a';
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(hourAngle) * 42, clockY + Math.sin(hourAngle) * 42);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#00838f';
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(minuteAngle) * 64, clockY + Math.sin(minuteAngle) * 64);
  ctx.stroke();
  ctx.lineCap = 'butt';

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#26c6da';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#ffd54f';
  ctx.fillRect(0, ground - 20, canvas.width, 5);

  const zoneWidth = clockTowerZoneEnd - clockTowerZoneStart;
  const zonePulse = (Math.sin(time * 3) + 1) / 2;
  ctx.fillStyle = `rgba(38, 198, 218, ${0.12 + zonePulse * 0.1})`;
  ctx.fillRect(clockTowerZoneStart, ground - 150, zoneWidth, 150);
  ctx.strokeStyle = 'rgba(224, 247, 250, 0.5)';
  ctx.lineWidth = 2;
  for (let sandX = clockTowerZoneStart + 20; sandX < clockTowerZoneEnd; sandX += 48) {
    const sandY = ground - 150 + ((time * 40 + sandX) % 140);
    ctx.beginPath();
    ctx.moveTo(sandX, sandY);
    ctx.lineTo(sandX, sandY + 8);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(38, 198, 218, 0.4)';
  ctx.fillRect(clockTowerZoneStart, ground - 30, zoneWidth, 10);
}

function drawAncientRuinsStage() {
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#140606');
  sky.addColorStop(0.5, '#431410');
  sky.addColorStop(1, '#8a3a1a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(183, 28, 28, 0.85)';
  ctx.beginPath();
  ctx.arc(790, 140, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 138, 101, 0.25)';
  ctx.beginPath();
  ctx.arc(790, 140, 92, 0, Math.PI * 2);
  ctx.fill();

  const smokeOffset = (time * 10) % 1300;
  ctx.fillStyle = 'rgba(20, 8, 8, 0.72)';
  [[80, 110], [420, 70], [760, 150], [1100, 90]].forEach(([cloudX, cloudY]) => {
    const x = ((cloudX + smokeOffset) % 1300) - 150;
    [[0, 0, 44], [50, -16, 52], [104, 0, 40]].forEach(([offsetX, offsetY, radius]) => {
      ctx.beginPath();
      ctx.ellipse(x + offsetX, cloudY + offsetY, radius * 1.4, radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  ctx.fillStyle = '#2a1212';
  ctx.beginPath();
  ctx.moveTo(0, ground);
  [[0, 380], [60, 360], [90, 300], [130, 300], [140, 360], [220, 340], [260, 390], [330, 370], [360, 280], [380, 270], [400, 300], [410, 380],
    [520, 400], [600, 360], [640, 250], [700, 250], [710, 330], [790, 350], [830, 300], [860, 310], [900, 380], [980, 360], [1024, 390], [1024, ground]]
    .forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a1212';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(670, 250, 60, Math.PI, Math.PI * 1.7);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(214, 196, 168, 0.55)';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(150, 440);
  ctx.quadraticCurveTo(330, 380, 480, 440);
  ctx.stroke();
  for (let rib = 0; rib < 6; rib += 1) {
    const ribX = 190 + rib * 52;
    const ribHeight = 150 - Math.abs(rib - 2.5) * 22;
    ctx.beginPath();
    ctx.moveTo(ribX, 418 - Math.sin((rib / 5) * Math.PI) * 30);
    ctx.quadraticCurveTo(ribX + 30, 418 - ribHeight, ribX + 12, ground - 6);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(214, 196, 168, 0.6)';
  ctx.beginPath();
  ctx.ellipse(118, 452, 46, 32, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a1212';
  ctx.beginPath();
  ctx.ellipse(104, 448, 9, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(132, 440, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineCap = 'butt';

  [[70, 250, -0.08], [900, 230, 0.1]].forEach(([pillarX, pillarTop, tilt]) => {
    ctx.save();
    ctx.translate(pillarX + 30, ground);
    ctx.rotate(tilt);
    ctx.fillStyle = '#6d5a4b';
    ctx.fillRect(-30, pillarTop - ground, 60, ground - pillarTop);
    ctx.fillStyle = '#54443a';
    for (let groove = -20; groove < 26; groove += 14) ctx.fillRect(groove, pillarTop - ground + 10, 4, ground - pillarTop - 10);
    ctx.fillStyle = '#140606';
    ctx.beginPath();
    ctx.moveTo(-30, pillarTop - ground);
    ctx.lineTo(-10, pillarTop - ground + 18);
    ctx.lineTo(8, pillarTop - ground + 4);
    ctx.lineTo(30, pillarTop - ground + 22);
    ctx.lineTo(30, pillarTop - ground - 2);
    ctx.lineTo(-30, pillarTop - ground - 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  [[300, 170], [560, 120], [460, 210]].forEach(([rockX, rockY], index) => {
    const bob = Math.sin(time * 1.2 + index * 2) * 8;
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.moveTo(rockX - 22, rockY + bob);
    ctx.lineTo(rockX - 6, rockY - 16 + bob);
    ctx.lineTo(rockX + 20, rockY - 8 + bob);
    ctx.lineTo(rockX + 14, rockY + 14 + bob);
    ctx.lineTo(rockX - 12, rockY + 16 + bob);
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = '#2b1d18';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#4a2f24';
  ctx.fillRect(0, ground - 8, canvas.width, 8);

  const crackGlow = 0.5 + ((Math.sin(time * 3) + 1) / 2) * 0.5;
  ctx.strokeStyle = `rgba(255, 109, 0, ${crackGlow})`;
  ctx.lineWidth = 3;
  [[40, 200], [330, 470], [610, 760], [850, 990]].forEach(([startX, endX]) => {
    ctx.beginPath();
    ctx.moveTo(startX, ground - 2);
    for (let crackX = startX; crackX < endX; crackX += 24) {
      ctx.lineTo(crackX + 12, ground + 10 + ((crackX * 7) % 22));
      ctx.lineTo(crackX + 24, ground + 2 + ((crackX * 3) % 12));
    }
    ctx.stroke();
  });
  ctx.strokeStyle = `rgba(255, 61, 0, ${0.35 + crackGlow * 0.35})`;
  ctx.lineWidth = 6;
  [0, 1, 2].forEach((claw) => {
    ctx.beginPath();
    ctx.moveTo(560 + claw * 26, ground - 2);
    ctx.lineTo(610 + claw * 26, canvas.height);
    ctx.stroke();
  });

  ctx.fillStyle = 'rgba(255, 145, 0, 0.8)';
  for (let ember = 0; ember < 14; ember += 1) {
    const emberX = (ember * 83 + Math.sin(time + ember) * 20) % canvas.width;
    const emberY = ground - ((time * 30 + ember * 47) % (ground - 60));
    ctx.fillRect(emberX, emberY, 3, 3);
  }

  const left = ruinsEruption.x - ruinsEruptionHalfWidth;
  const width = ruinsEruptionHalfWidth * 2;
  if (ruinsEruption.warnTimer > 0) {
    const progress = 1 - ruinsEruption.warnTimer / ruinsEruptionWarning;
    const shake = (Math.random() - 0.5) * 4 * progress;
    ctx.fillStyle = `rgba(255, 61, 0, ${0.06 + progress * 0.16})`;
    ctx.fillRect(left, ground - 200, width, 200);
    ctx.strokeStyle = `rgba(255, 171, 64, ${0.6 + progress * 0.4})`;
    ctx.lineWidth = 4 + progress * 4;
    ctx.beginPath();
    ctx.moveTo(left + shake, ground - 2);
    for (let crackX = left; crackX < left + width; crackX += 16) {
      ctx.lineTo(crackX + 8 + shake, ground - 8 - ((crackX * 5) % 8));
      ctx.lineTo(crackX + 16 + shake, ground - 1);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(141, 110, 99, 0.8)';
    for (let dust = 0; dust < 6; dust += 1) {
      ctx.fillRect(left + ((dust * 23 + time * 60) % width), ground - 10 - progress * 30 * ((dust % 3) + 1) * 0.5, 4, 4);
    }
  }
  if (ruinsEruption.flashTimer > 0) {
    const alpha = ruinsEruption.flashTimer / 26;
    const rise = Math.min(1, (26 - ruinsEruption.flashTimer) / 6);
    const glow = ctx.createLinearGradient(0, ground - 220, 0, ground);
    glow.addColorStop(0, 'rgba(255, 61, 0, 0)');
    glow.addColorStop(1, `rgba(255, 145, 0, ${alpha * 0.7})`);
    ctx.fillStyle = glow;
    ctx.fillRect(left, ground - 220, width, 220);
    ctx.fillStyle = `rgba(78, 52, 46, ${Math.min(1, alpha * 1.5)})`;
    ctx.strokeStyle = `rgba(255, 109, 0, ${alpha})`;
    ctx.lineWidth = 3;
    [0.12, 0.3, 0.5, 0.7, 0.88].forEach((spot, index) => {
      const spikeX = left + width * spot;
      const spikeHeight = (index % 2 === 0 ? 150 : 105) * rise;
      ctx.beginPath();
      ctx.moveTo(spikeX - 16, ground);
      ctx.lineTo(spikeX, ground - spikeHeight);
      ctx.lineTo(spikeX + 16, ground);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }
}

function drawJungleStage() {
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#9be7c4');
  sky.addColorStop(0.55, '#4caf7a');
  sky.addColorStop(1, '#1f5f3b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#2e7d4f';
  for (let bushX = -40; bushX < canvas.width + 60; bushX += 110) {
    ctx.beginPath();
    ctx.arc(bushX, ground - 60, 70, Math.PI, 0);
    ctx.fill();
  }

  [[90, 1], [330, 0.8], [700, 0.85], [930, 1]].forEach(([trunkX, scale]) => {
    ctx.fillStyle = '#5d3a1a';
    ctx.fillRect(trunkX - 18 * scale, 150, 36 * scale, ground - 150);
    ctx.fillStyle = '#4a2c12';
    for (let ring = 170; ring < ground; ring += 40) ctx.fillRect(trunkX - 18 * scale, ring, 36 * scale, 5);
    ctx.fillStyle = '#1b5e20';
    [[-60, 150, 70], [60, 150, 70], [0, 110, 80]].forEach(([offsetX, canopyY, radius]) => {
      ctx.beginPath();
      ctx.arc(trunkX + offsetX * scale, canopyY, radius * scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#ffe135';
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    [-14, 0, 14].forEach((offset) => {
      ctx.beginPath();
      ctx.ellipse(trunkX + offset + 26 * scale, 196, 5, 14, offset * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });

  ctx.strokeStyle = '#33691e';
  ctx.lineWidth = 5;
  [200, 460, 560, 820].forEach((vineX, index) => {
    const sway = Math.sin(time * 1.5 + index) * 12;
    ctx.beginPath();
    ctx.moveTo(vineX, 0);
    ctx.quadraticCurveTo(vineX + sway, 120, vineX - sway * 0.5, 220 + index * 20);
    ctx.stroke();
    ctx.fillStyle = '#558b2f';
    ctx.beginPath();
    ctx.ellipse(vineX - sway * 0.5, 224 + index * 20, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#5d4037';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#43a047';
  ctx.fillRect(0, ground - 10, canvas.width, 12);
  ctx.fillStyle = '#66bb6a';
  for (let bladeX = 4; bladeX < canvas.width; bladeX += 14) {
    ctx.beginPath();
    ctx.moveTo(bladeX, ground - 8);
    ctx.lineTo(bladeX + 4, ground - 18 - (bladeX % 5) * 2);
    ctx.lineTo(bladeX + 8, ground - 8);
    ctx.fill();
  }

  jungleBananas.forEach((banana) => {
    const centerX = banana.x + banana.width / 2;
    const centerY = banana.y + banana.height / 2;
    if (banana.landed) {
      ctx.fillStyle = `rgba(255, 241, 118, ${0.25 + ((Math.sin(time * 6) + 1) / 2) * 0.25})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe135';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 10, 16, Math.PI * 0.18, Math.PI * 0.82);
    ctx.arc(centerX, centerY - 16, 16, Math.PI * 0.78, Math.PI * 0.22, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

let versusCityCorruption = 0;

function getGamblerCityCorruption() {
  if (gamblerCityCorruptionOverride !== null) return gamblerCityCorruptionOverride;
  if (!normalArcadeActive && selectedMap === 'gamblerArcade') {
    // outside the Arcade the city bends a little more every second the fight goes on (fully warped at 2 minutes)
    if (!gameStarted) return 0;
    if (!gameOver) versusCityCorruption = Math.min(1, (performance.now() - fightStartedAt) / versusCityCorruptionMs);
    return versusCityCorruption;
  }
  if (!normalArcadeActive || arcadeChapter !== 'gambler') return 0;
  return Math.max(0, Math.min(1, (selectedNormalArcadeLevel - 1) / (gamblerArcadeLevelCount - 1)));
}

function mixHexColor(fromHex, toHex, amount) {
  const from = parseInt(fromHex.slice(1), 16);
  const to = parseInt(toHex.slice(1), 16);
  const channel = (shift) => Math.round(((from >> shift) & 255) + ((((to >> shift) & 255) - ((from >> shift) & 255)) * amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function drawGamblerArcadeStage() {
  const time = performance.now() / 1000;
  const corruption = getGamblerCityCorruption();
  const wobble = (seed, strength = 1) => Math.sin(time * (1.2 + corruption * 2) + seed) * corruption * strength;

  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, mixHexColor('#061a3a', '#07020d', corruption));
  sky.addColorStop(0.55, mixHexColor('#0d3b8a', '#2a0a3d', corruption));
  sky.addColorStop(1, mixHexColor('#1e6fd9', '#4a0f3a', corruption));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = `rgba(179, 229, 252, ${0.8 - corruption * 0.6})`;
  [[70, 50], [190, 90], [330, 40], [610, 70], [760, 30], [930, 80]].forEach(([starX, starY], index) => {
    ctx.fillRect(starX + wobble(index, 6), starY + wobble(index + 3, 4), 3, 3);
  });

  const moonX = 512 + wobble(1, 10);
  const moonY = 92 + wobble(2, 6);
  ctx.fillStyle = mixHexColor('#e3f2fd', '#b71c1c', corruption);
  ctx.beginPath();
  ctx.ellipse(moonX, moonY, 40 + corruption * 8, 40 - corruption * 14, 0, 0, Math.PI * 2);
  ctx.fill();
  if (corruption >= 0.4) {
    const pupil = 8 + corruption * 10;
    const lookX = Math.max(-18, Math.min(18, (player1.position.x - moonX) / 30));
    ctx.fillStyle = '#12020a';
    ctx.beginPath();
    ctx.ellipse(moonX + lookX, moonY, pupil * 0.45, pupil, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = mixHexColor('#90caf9', '#6a1b1b', corruption);
    [[-12, -8], [10, 6], [-4, 14]].forEach(([offsetX, offsetY]) => {
      ctx.beginPath();
      ctx.arc(moonX + offsetX, moonY + offsetY, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const buildings = [
    { x: 20, y: 220, width: 110, height: 300, tilt: -0.05, kind: 'card', suit: '\u2660' },
    { x: 150, y: 290, width: 120, height: 120, tilt: 0.08, kind: 'dice', pips: 5 },
    { x: 280, y: 180, width: 80, height: 340, tilt: 0, kind: 'tower' },
    { x: 650, y: 170, width: 90, height: 350, tilt: 0.04, kind: 'tower' },
    { x: 760, y: 280, width: 120, height: 120, tilt: -0.1, kind: 'dice', pips: 3 },
    { x: 895, y: 210, width: 110, height: 310, tilt: 0.05, kind: 'card', suit: '\u2666' },
  ];
  buildings.forEach((building, index) => {
    ctx.save();
    ctx.translate(building.x + building.width / 2, ground);
    const extraTilt = (index % 2 === 0 ? -1 : 1) * corruption * 0.14 + wobble(index * 1.7, 0.06);
    ctx.rotate(building.tilt * (1 + corruption * 1.5) + extraTilt);
    ctx.transform(1, 0, wobble(index + 5, 0.18), 1, 0, 0);
    const left = -building.width / 2;
    const top = building.y - ground - corruption * 30 * (index % 3);
    const buildingHeight = ground - building.y + corruption * 30 * (index % 3);
    if (building.kind === 'dice') {
      ctx.fillStyle = mixHexColor('#123a7a', '#1a0624', corruption);
      ctx.fillRect(left + building.width / 2 - 10, top + building.height, 20, buildingHeight - building.height);
      ctx.fillStyle = mixHexColor('#e3f2fd', '#3d2b4f', corruption);
      ctx.fillRect(left, top, building.width, building.height);
      ctx.strokeStyle = mixHexColor('#0d47a1', '#8e24aa', corruption);
      ctx.lineWidth = 5;
      ctx.strokeRect(left, top, building.width, building.height);
      const pipLayouts = {
        3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
        5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
      };
      ctx.fillStyle = mixHexColor('#1565c0', '#d50000', corruption);
      pipLayouts[building.pips].forEach(([pipX, pipY], pipIndex) => {
        const drift = corruption * 6 * Math.sin(time * 3 + pipIndex);
        ctx.beginPath();
        ctx.arc(left + building.width * pipX + drift, top + building.height * pipY - drift, 10, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.fillStyle = mixHexColor(index % 2 === 0 ? '#0b2e66' : '#0f3f8c', index % 2 === 0 ? '#12051c' : '#1c0828', corruption);
      ctx.fillRect(left, top, building.width, buildingHeight);
      if (building.kind === 'card') {
        ctx.fillStyle = mixHexColor('#e3f2fd', '#2b1b36', corruption);
        ctx.fillRect(left + 12, top + 14, building.width - 24, 80);
        ctx.fillStyle = building.suit === '\u2666' ? '#e53935' : mixHexColor('#0d47a1', '#e53935', corruption);
        ctx.font = '900 48px Arial';
        ctx.textAlign = 'center';
        const suitFlip = corruption > 0.5 && Math.floor(time * 2 + index) % 4 === 0 ? -1 : 1;
        ctx.save();
        ctx.translate(0, top + 56);
        ctx.scale(1, suitFlip);
        ctx.fillText(building.suit, 0, 16);
        ctx.restore();
      }
      for (let windowY = top + (building.kind === 'card' ? 110 : 20); windowY < -30; windowY += 30) {
        [left + 12, left + building.width - 26].forEach((windowX, side) => {
          const flicker = Math.floor(time * (2 + corruption * 8) + index + windowY * 0.1 + side) % 5;
          const corrupted = corruption > 0 && (windowY * 7 + index * 13 + side * 5) % 10 < corruption * 10;
          if (corrupted && flicker === 0) return;
          ctx.fillStyle = corrupted
            ? `rgba(255, 23, 68, ${0.45 + (flicker % 2) * 0.35})`
            : flicker % 3 === 0 ? 'rgba(128, 222, 234, 0.9)' : 'rgba(79, 195, 247, 0.55)';
          ctx.fillRect(windowX, windowY, 14, 14);
        });
      }
    }
    ctx.restore();
  });

  ctx.save();
  ctx.translate(512, ground);
  ctx.transform(1, 0, wobble(9, 0.12), 1, 0, 0);
  ctx.fillStyle = mixHexColor('#0a2a5c', '#14061f', corruption);
  ctx.fillRect(-132, 150 - ground, 264, ground - 150);
  const signPulse = (Math.sin(time * 4) + 1) / 2;
  const signBroken = corruption > 0 && Math.random() < corruption * 0.35;
  ctx.fillStyle = signBroken ? 'rgba(20, 0, 10, 0.9)' : corruption >= 0.6
    ? `rgba(213, 0, 0, ${0.35 + signPulse * 0.4})`
    : `rgba(0, 229, 255, ${0.35 + signPulse * 0.4})`;
  ctx.fillRect(-114, 170 - ground, 228, 64);
  ctx.fillStyle = corruption >= 0.6 ? '#ffcdd2' : '#e0f7fa';
  ctx.font = '900 44px Courier New, monospace';
  ctx.textAlign = 'center';
  const signText = signBroken ? '' : corruption >= 0.6 ? '? ? ?' : corruption > 0 && Math.random() < corruption * 0.3 ? '7 ? 7' : '7 7 7';
  ctx.fillText(signText, 0, 218 - ground);
  for (let windowY = 260; windowY < ground - 40; windowY += 36) {
    for (let windowX = -112; windowX < 108; windowX += 44) {
      const corrupted = (windowX + windowY) % 7 < corruption * 7;
      ctx.fillStyle = corrupted ? 'rgba(142, 36, 170, 0.6)' : 'rgba(79, 195, 247, 0.6)';
      ctx.fillRect(windowX, windowY - ground, 22, 18);
    }
  }
  ctx.restore();

  const diceCount = 3 + Math.round(corruption * 4);
  for (let index = 0; index < diceCount; index += 1) {
    const baseX = [240, 800, 110, 420, 620, 950, 330][index];
    const baseY = [150, 130, 120, 260, 240, 200, 300][index];
    const erratic = corruption * 40;
    const diceX = baseX + Math.sin(time * (1 + index * 0.7)) * erratic;
    const diceY = baseY + Math.sin(time * 1.6 + index) * (10 + erratic * 0.6);
    ctx.save();
    ctx.translate(diceX, diceY);
    ctx.rotate(time * (index % 2 === 0 ? 0.7 : -0.6) * (1 + corruption * 3));
    ctx.fillStyle = mixHexColor('#e3f2fd', '#311b3f', corruption);
    ctx.fillRect(-16, -16, 32, 32);
    ctx.strokeStyle = mixHexColor('#0d47a1', '#ff1744', corruption);
    ctx.lineWidth = 3;
    ctx.strokeRect(-16, -16, 32, 32);
    ctx.fillStyle = mixHexColor('#1565c0', '#ff1744', corruption);
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = mixHexColor('#0a1f44', '#0b0310', corruption);
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = mixHexColor('#29b6f6', '#7b1fa2', corruption);
  ctx.fillRect(0, ground - 10, canvas.width, 10);
  for (let tileX = 0; tileX < canvas.width; tileX += 64) {
    ctx.fillStyle = (tileX / 64) % 2 === 0 ? mixHexColor('#0d2b5e', '#150620', corruption) : mixHexColor('#123a7a', '#240a33', corruption);
    ctx.fillRect(tileX, ground, 64, 28);
  }
  ctx.fillStyle = mixHexColor('#fdd835', '#ff1744', corruption);
  for (let dashX = 20; dashX < canvas.width; dashX += 90) ctx.fillRect(dashX + wobble(dashX, 8), ground + 38, 44, 5);
  if (corruption > 0) {
    ctx.strokeStyle = `rgba(213, 0, 249, ${0.25 + corruption * 0.5})`;
    ctx.lineWidth = 2;
    [120, 380, 700, 900].forEach((crackX, index) => {
      if (index / 4 >= corruption * 1.6) return;
      ctx.beginPath();
      ctx.moveTo(crackX, ground - 4);
      ctx.lineTo(crackX + 14, ground + 14);
      ctx.lineTo(crackX - 6, ground + 30);
      ctx.lineTo(crackX + 18, canvas.height);
      ctx.stroke();
    });
  }

  if (corruption > 0) {
    const sliceCount = Math.round(corruption * 6);
    for (let slice = 0; slice < sliceCount; slice += 1) {
      if (Math.random() > 0.35 + corruption * 0.4) continue;
      const sliceY = Math.floor(Math.random() * (ground - 20));
      const sliceHeight = 4 + Math.floor(Math.random() * (6 + corruption * 18));
      const offset = (Math.random() - 0.5) * corruption * 60;
      ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceHeight, offset, sliceY, canvas.width, sliceHeight);
    }
    const vignette = ctx.createRadialGradient(canvas.width / 2, ground / 2, 120, canvas.width / 2, ground / 2, canvas.width * 0.7);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(8, 0, 12, ${corruption * 0.75})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawDumpster(lidAngle, shake) {
  const left = 650 + shake;
  const top = ground - 100;
  ctx.fillStyle = '#1f3d29';
  ctx.fillRect(left, top, 160, 100);
  ctx.fillStyle = '#2e5d3a';
  ctx.fillRect(left + 6, top + 8, 148, 84);
  ctx.strokeStyle = '#142818';
  ctx.lineWidth = 4;
  for (let ribX = left + 30; ribX < left + 150; ribX += 36) {
    ctx.beginPath();
    ctx.moveTo(ribX, top + 10);
    ctx.lineTo(ribX, top + 92);
    ctx.stroke();
  }
  ctx.fillStyle = '#e0e0e0';
  ctx.font = '900 16px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('$ $ $', left + 80, top + 56);
  ctx.fillStyle = '#111';
  ctx.fillRect(left + 10, ground - 6, 20, 6);
  ctx.fillRect(left + 130, ground - 6, 20, 6);
  ctx.save();
  ctx.translate(left - 6, top);
  ctx.rotate(-lidAngle);
  ctx.fillStyle = '#163020';
  ctx.fillRect(0, -12, 172, 12);
  ctx.strokeStyle = '#0c1a11';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, -12, 172, 12);
  ctx.restore();
}

function drawGamblerAlleyStage(lidAngle = 1.9, shake = 0) {
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, 180);
  sky.addColorStop(0, '#07020d');
  sky.addColorStop(1, '#3a0d3f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#1a0b22';
  [[400, 110, 50], [450, 70, 40], [490, 120, 60], [550, 60, 36], [586, 100, 48]].forEach(([x, y, width]) => ctx.fillRect(x, y, width, 200));
  ctx.fillStyle = 'rgba(255, 23, 68, 0.55)';
  [[410, 130], [460, 90], [500, 140], [560, 80], [596, 120]].forEach(([x, y]) => ctx.fillRect(x, y, 6, 6));

  const wallGradient = ctx.createLinearGradient(0, 0, 0, ground);
  wallGradient.addColorStop(0, '#120a16');
  wallGradient.addColorStop(1, '#2b2230');
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, 390, ground);
  ctx.fillRect(640, 0, canvas.width - 640, ground);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  for (let rowY = 12; rowY < ground; rowY += 22) {
    ctx.beginPath();
    ctx.moveTo(0, rowY);
    ctx.lineTo(390, rowY);
    ctx.moveTo(640, rowY);
    ctx.lineTo(canvas.width, rowY);
    ctx.stroke();
    const offset = (rowY / 22) % 2 === 0 ? 0 : 22;
    for (let brickX = offset; brickX < canvas.width; brickX += 44) {
      if (brickX > 390 && brickX < 640) continue;
      ctx.beginPath();
      ctx.moveTo(brickX, rowY);
      ctx.lineTo(brickX, rowY + 22);
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(370, 0, 20, ground);
  ctx.fillRect(640, 0, 20, ground);

  ctx.strokeStyle = '#3b3340';
  ctx.lineWidth = 4;
  [120, 250].forEach((stairY) => {
    ctx.strokeRect(700, stairY, 180, 60);
    for (let barX = 712; barX < 880; barX += 16) {
      ctx.beginPath();
      ctx.moveTo(barX, stairY);
      ctx.lineTo(barX, stairY + 60);
      ctx.stroke();
    }
  });

  ctx.fillStyle = 'rgba(213, 0, 249, 0.55)';
  ctx.font = '900 42px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.save();
  ctx.translate(190, 250);
  ctx.rotate(-0.12);
  ctx.fillText('$ 777 $', 0, 0);
  ctx.restore();

  const flicker = Math.sin(time * 23) > -0.85 ? 1 : 0.25;
  ctx.fillStyle = '#3b3340';
  ctx.fillRect(282, 176, 40, 8);
  ctx.fillStyle = `rgba(255, 224, 130, ${0.9 * flicker})`;
  ctx.beginPath();
  ctx.arc(318, 192, 9, 0, Math.PI * 2);
  ctx.fill();
  const cone = ctx.createRadialGradient(318, 200, 10, 318, ground, 240);
  cone.addColorStop(0, `rgba(255, 224, 130, ${0.28 * flicker})`);
  cone.addColorStop(1, 'rgba(255, 224, 130, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(310, 196);
  ctx.lineTo(150, ground);
  ctx.lineTo(490, ground);
  ctx.lineTo(326, 196);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#141018';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#231a28';
  ctx.fillRect(0, ground - 6, canvas.width, 6);
  ctx.fillStyle = 'rgba(123, 31, 162, 0.35)';
  [[200, 540, 70], [560, 548, 50], [880, 538, 60]].forEach(([puddleX, puddleY, radius]) => {
    ctx.beginPath();
    ctx.ellipse(puddleX, puddleY, radius, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#0d0a0f';
  [[600, 18], [628, 14], [836, 20], [866, 15]].forEach(([bagX, radius]) => {
    ctx.beginPath();
    ctx.arc(bagX, ground - radius, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  drawDumpster(lidAngle, shake);

  const vignette = ctx.createRadialGradient(canvas.width / 2, ground / 2, 160, canvas.width / 2, ground / 2, canvas.width * 0.72);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(6, 0, 10, 0.72)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startGamblerScammerCutscene() {
  Object.assign(arcadeCutscene, {
    active: true,
    phase: 'walk',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: -80,
    gamblerTargetX: 330,
    gamblerHop: 0,
    scammerX: 700,
    scammerY: 0,
    scammerTargetX: 600,
    lidAngle: 0,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    scene: 'intro',
    lines: gamblerCutsceneLines,
    rageVisible: false,
  });
  document.body.classList.add('arcade-cutscene');
  stopScammerBattleTrack();
}

function endArcadeCutscene() {
  if (!arcadeCutscene.active) return;
  arcadeCutscene.active = false;
  document.body.classList.remove('arcade-cutscene');
  if (arcadeCutscene.scene === 'jesterTired') {
    // back to the fight right where it stopped (no reset)
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.position.y = ground - fighter.height;
    });
    resetKeys();
    return;
  }
  if (arcadeCutscene.scene === 'jesterImpatient') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player2.position = { x: canvas.width / 2 + 120, y: ground - player2.height };
    player2.attacksToTheRight = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJesterRiftStage();
    player2.draw();
    displayWinner(victoryTitle.innerText, player2, player1);
    restartPanel.classList.remove('hidden');
    scheduleJesterAnger();
    return;
  }
  if (arcadeCutscene.scene === 'jesterAngry') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    finishJesterAngryScene();
    return;
  }
  if (arcadeCutscene.scene === 'jesterLoseBored' || arcadeCutscene.scene === 'jesterLoseFinal') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    stopJesterTracks();
    player2.position = { x: canvas.width / 2 + 120, y: ground - player2.height };
    player2.attacksToTheRight = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJesterRiftStage();
    player2.draw();
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'jesterOutro' || arcadeCutscene.scene === 'jesterOutroCity') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    stopJesterTracks();
    // the victory screen happens back in Ciudad Cobalto
    selectedMap = 'cobaltAftermath';
    player1.position = { x: 420, y: ground - player1.height };
    player1.attacksToTheRight = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCobaltAftermathStage();
    player1.draw();
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'outro') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.position = { x: 360, y: ground - player1.height };
    player2.position = { x: 790, y: ground - player2.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStage();
    player1.draw();
    player2.draw();
    finishFight();
    return;
  }
  resetFight();
}

function drawDownedFighter(fighter) {
  // lying on the floor, beaten
  ctx.save();
  const pivotX = fighter.position.x + fighter.width / 2;
  ctx.translate(pivotX, ground);
  ctx.rotate(-Math.PI / 2);
  ctx.translate(-pivotX, -ground);
  // shift so that after the rotation the body rests on top of the floor
  const savedX = fighter.position.x;
  fighter.position.x = pivotX;
  fighter.draw();
  fighter.position.x = savedX;
  ctx.restore();
}

function beginJesterLosePhase(cutscene) {
  cutscene.frame = 0;
  cutscene.emote = null;
  cutscene.prop = null;
  stopJesterTracks();
  if (cutscene.scene === 'jesterLoseBored') {
    cutscene.phase = 'exorcism';
    cutscene.fx = { bubbles: [], jas: [], gamblerGone: false, pile: false };
    playSound('jesterExorcismCharge');
  } else {
    cutscene.phase = 'scriptedFinal';
    const soulWidth = Math.round(player1.width * 0.3);
    const soulHeight = Math.round(player1.height * 0.3);
    cutscene.fx = {
      soul: { x: cutscene.gamblerX + player1.width / 2 - soulWidth / 2, y: ground - soulHeight - 40, width: soulWidth, height: soulHeight },
      scythes: [],
      flashes: [],
      dust: [],
      jas: [],
      spawned: 0,
      invulnerable: 0,
      giant: null,
      dustDone: false,
      pile: true,
      shake: 0,
    };
    playSound('jesterUnlock');
    playSound('jesterFinalShrink');
  }
}

function spawnLaughText(fx) {
  fx.jas.push({
    x: 60 + Math.random() * (canvas.width - 120),
    y: 60 + Math.random() * (ground - 120),
    size: 18 + Math.random() * 26,
    life: 70,
    tilt: (Math.random() - 0.5) * 0.6,
  });
}

function drawLaughTexts(fx) {
  fx.jas.forEach((ja) => {
    ja.life -= 1;
    ctx.save();
    ctx.globalAlpha = Math.min(1, ja.life / 20);
    ctx.translate(ja.x, ja.y - (70 - ja.life) * 0.4);
    ctx.rotate(ja.tilt);
    ctx.fillStyle = Math.floor(ja.life / 6) % 2 ? '#ea80fc' : '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.font = `900 ${Math.round(ja.size)}px Courier New, monospace`;
    ctx.textAlign = 'center';
    ctx.strokeText('JA JA', 0, 0);
    ctx.fillText('JA JA', 0, 0);
    ctx.restore();
  });
  fx.jas = fx.jas.filter((ja) => ja.life > 0);
}

function drawJesterAt(x, y, options = {}) {
  const saved = { ...player2.position };
  player2.position = { x, y };
  player2.attacksToTheRight = options.facingRight ?? false;
  player2.isAttacking = false;
  player2.draw();
  player2.position = saved;
}

function drawDustPile(x) {
  ctx.save();
  ctx.fillStyle = '#5d5d6a';
  ctx.beginPath();
  ctx.ellipse(x, ground - 4, 34, 10, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#7a7a88';
  ctx.beginPath();
  ctx.ellipse(x - 6, ground - 8, 18, 7, 0, Math.PI, 0);
  ctx.fill();
  // the top hat survived
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(x + 8, ground - 22, 20, 12);
  ctx.fillRect(x + 3, ground - 11, 30, 4);
  ctx.fillStyle = '#7b1fa2';
  ctx.fillRect(x + 8, ground - 15, 20, 3);
  ctx.restore();
}

function updateJesterLosePhase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  const jesterX = cutscene.scammerX;
  const jesterY = ground - player2.height;

  if (cutscene.phase === 'exorcism') {
    const chargeFrames = 160;
    const charging = frame < chargeFrames;
    const power = Math.min(1, frame / chargeFrames);
    if (charging && frame % 20 === 0) playSound('jesterFinalRumble');
    if (frame === chargeFrames) {
      playSound('bubblePop');
      fx.gamblerGone = true;
      const centerX = cutscene.gamblerX + player1.width / 2;
      for (let bubble = 0; bubble < 9; bubble += 1) {
        fx.bubbles.push({ x: centerX + (Math.random() - 0.5) * 50, y: ground - 60 - Math.random() * 60, r: 3 + Math.random() * 6, life: 50 + Math.random() * 30, vx: (Math.random() - 0.5) * 0.8 });
      }
    }
    if (frame >= chargeFrames + 45) {
      cutscene.phase = 'loseLaugh';
      cutscene.frame = 0;
      return;
    }
    const shake = charging ? power * 7 : 0;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    drawJesterRiftStage();
    if (charging) {
      ctx.fillStyle = `rgba(20, 0, 30, ${power * 0.7})`;
      ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);
    }
    const gamblerCenterX = cutscene.gamblerX + player1.width / 2;
    const lift = charging ? power * 70 : 0;
    const gamblerCenterY = ground - player1.height / 2 - lift;
    if (charging) {
      // magic circle under Gambler and rays converging on him
      ctx.save();
      ctx.translate(gamblerCenterX, ground - 4);
      ctx.scale(1, 0.3);
      ctx.rotate(frame / 20);
      ctx.strokeStyle = `rgba(234, 128, 252, ${0.4 + power * 0.6})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '900 30px Arial';
      ctx.fillStyle = '#ea80fc';
      ctx.textAlign = 'center';
      ['\u2660', '\u2665', '\u2666', '\u2663'].forEach((suit, index) => {
        const angle = (Math.PI / 2) * index;
        ctx.fillText(suit, Math.cos(angle) * 100, Math.sin(angle) * 100 + 10);
      });
      ctx.restore();
      ctx.save();
      for (let ray = 0; ray < 14; ray += 1) {
        const angle = (Math.PI * 2 * ray) / 14 + frame / 40;
        const startX = gamblerCenterX + Math.cos(angle) * 900;
        const startY = gamblerCenterY + Math.sin(angle) * 900;
        ctx.strokeStyle = `rgba(213, 0, 249, ${0.15 + power * 0.45})`;
        ctx.lineWidth = 3 + power * 10 + Math.sin(frame / 3 + ray) * 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(gamblerCenterX, gamblerCenterY);
        ctx.stroke();
      }
      const glow = ctx.createRadialGradient(gamblerCenterX, gamblerCenterY, 0, gamblerCenterX, gamblerCenterY, 60 + power * 60);
      glow.addColorStop(0, `rgba(255, 255, 255, ${power * 0.8})`);
      glow.addColorStop(1, 'rgba(234, 128, 252, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(gamblerCenterX - 140, gamblerCenterY - 140, 280, 280);
      ctx.restore();
    }
    if (!fx.gamblerGone) {
      const saved = { ...player1.position };
      player1.position = { x: cutscene.gamblerX + (Math.random() - 0.5) * power * 6, y: ground - player1.height - lift };
      player1.attacksToTheRight = true;
      player1.draw();
      player1.position = saved;
    }
    fx.bubbles.forEach((bubble) => {
      bubble.life -= 1;
      bubble.y -= 1.2;
      bubble.x += bubble.vx;
      ctx.strokeStyle = `rgba(179, 229, 252, ${bubble.life / 80})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.stroke();
    });
    fx.bubbles = fx.bubbles.filter((bubble) => bubble.life > 0);
    // Jester with his arms up (bouncing hard while casting)
    const cast = charging ? Math.sin(frame / 3) * 4 * power : 0;
    drawJesterAt(jesterX + cast, jesterY - (charging ? 10 * power : 0));
    if (!charging) {
      ctx.fillStyle = '#fff';
      ctx.font = '900 22px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('...', jesterX + player2.width / 2, jesterY - 24);
    }
    ctx.restore();
    return;
  }

  if (cutscene.phase === 'scriptedFinal') {
    updateScriptedFinalAct(cutscene);
    return;
  }

  // loseLaugh: Jester can't stop laughing
  if (frame % 20 === 1) playSound('jesterLaugh');
  if (frame % 45 === 10) playSound('cutsceneLaugh');
  if (frame % 6 === 0) spawnLaughText(fx);
  if (frame >= 330) {
    endArcadeCutscene();
    return;
  }
  drawJesterRiftStage();
  if (fx.pile) drawDustPile(cutscene.gamblerX + player1.width / 2);
  const bounce = Math.abs(Math.sin(frame / 5)) * 22;
  const wobbleX = Math.sin(frame / 2.5) * 5;
  ctx.save();
  const centerX = jesterX + player2.width / 2 + wobbleX;
  ctx.translate(centerX, ground);
  ctx.rotate(Math.sin(frame / 6) * 0.12);
  ctx.translate(-centerX, -ground);
  drawJesterAt(jesterX + wobbleX, jesterY - bounce);
  ctx.restore();
  drawLaughTexts(fx);
  if (frame < 20) {
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - frame / 20})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Losing cinematic version of the final act: Gambler dodges desperately, gets hit, and the giant scythe lands.
function updateScriptedFinalAct(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  const soul = fx.soul;
  const floor = getJesterFinalFloor();
  const rainEnd = 420;
  const giantEnd = 580;
  const dustEnd = 700;
  if (fx.invulnerable > 0) fx.invulnerable -= 1;
  fx.shake *= 0.88;

  if (frame >= 40 && frame < rainEnd - 50 && frame % 28 === 0) {
    // every third scythe is a "miss" for Gambler: he steps the wrong way
    const willHit = fx.spawned % 3 === 1;
    const soulCenterX = soul.x + soul.width / 2;
    const x = willHit ? soulCenterX : soulCenterX + (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random() * 40);
    fx.scythes.push({ x: Math.max(40, Math.min(canvas.width - 40, x)), y: -70, warn: 24, speed: 12, rotation: 0, willHit, size: 1.7 });
    fx.spawned += 1;
    playSound('jesterFinalWarn');
  }

  // Gambler's desperate dodging
  const threat = fx.scythes.find((scythe) => scythe.y < soul.y + 40);
  let targetX = soul.x;
  if (threat) {
    const soulCenterX = soul.x + soul.width / 2;
    const away = threat.x > soulCenterX ? -1 : 1;
    targetX = threat.willHit ? soul.x + away * 4 : soul.x + away * 70;
  } else {
    targetX = soul.x + Math.sin(frame / 17) * 30;
  }
  if (fx.giant) targetX = soul.x + Math.sin(frame / 7) * 60;
  soul.x += Math.max(-6.5, Math.min(6.5, targetX - soul.x));
  soul.y += Math.sin(frame / 9) * 1.5;
  soul.x = Math.max(20, Math.min(canvas.width - 20 - soul.width, soul.x));
  soul.y = Math.max(200, Math.min(floor - soul.height, soul.y));

  const soulCenterX = soul.x + soul.width / 2;
  const soulCenterY = soul.y + soul.height / 2;
  fx.scythes.forEach((scythe) => {
    if (scythe.warn > 0) {
      scythe.warn -= 1;
      if (scythe.warn === 0) playSound('jesterFinalFall');
      return;
    }
    scythe.y += scythe.speed;
    scythe.rotation += 0.35;
    if (!scythe.hitDone && fx.invulnerable <= 0 && Math.abs(scythe.x - soulCenterX) < 38 && Math.abs(scythe.y - soulCenterY) < 34) {
      scythe.hitDone = true;
      fx.invulnerable = 30;
      fx.shake = 10;
      playSound('jesterScytheHit');
      playSound('jesterFinalHurt');
    }
    if (scythe.y >= floor - 10) {
      scythe.landed = true;
      fx.flashes.push({ x: scythe.x, life: 26 });
      playSound('jesterFinalImpact');
    }
  });
  fx.scythes = fx.scythes.filter((scythe) => !scythe.landed);

  if (frame === rainEnd) {
    fx.giant = { x: soulCenterX, y: -260 };
    playSound('jesterLaugh');
  }
  if (fx.giant && frame < giantEnd) {
    const progress = (frame - rainEnd) / (giantEnd - rainEnd);
    fx.giant.x += (soulCenterX - fx.giant.x) * 0.09;
    fx.giant.y = -260 + Math.pow(progress, 2.2) * (soulCenterY + 260);
    fx.shake = Math.max(fx.shake, 2 + progress * 10);
    if ((frame - rainEnd) % 18 === 0) playSound('jesterFinalRumble');
    const beat = progress < 0.6 ? 36 : 18;
    if ((frame - rainEnd) % beat === 0) playSound('jesterHeartbeat');
  }
  if (frame === giantEnd) {
    // this time it lands
    fx.giant = null;
    fx.shake = 26;
    playSound('jesterGiantSlam');
    for (let grain = 0; grain < 70; grain += 1) {
      fx.dust.push({
        x: soulCenterX + (Math.random() - 0.5) * soul.width * 2,
        y: soulCenterY + (Math.random() - 0.5) * soul.height,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 4,
        size: 2 + Math.random() * 3,
        life: 90 + Math.random() * 40,
      });
    }
  }
  if (frame >= dustEnd) {
    cutscene.phase = 'loseLaugh';
    cutscene.frame = 0;
    cutscene.gamblerX = Math.max(60, Math.min(canvas.width - 120, soul.x - player1.width / 2));
    // Jester stands on whichever side of the dust pile has room
    cutscene.scammerX = cutscene.gamblerX > canvas.width / 2 ? cutscene.gamblerX - 280 : cutscene.gamblerX + 280;
    return;
  }

  // ----- drawing -----
  ctx.save();
  ctx.translate((Math.random() - 0.5) * fx.shake, (Math.random() - 0.5) * fx.shake);
  const fade = Math.min(1, frame / 30);
  drawJesterRiftStage();
  ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
  ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  ctx.strokeStyle = 'rgba(179, 136, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, floor);
  ctx.lineTo(canvas.width, floor);
  ctx.stroke();
  ctx.save();
  ctx.globalAlpha = 0.45 * fade;
  drawJesterAt(canvas.width / 2 - player2.width / 2, 64 + Math.sin(frame / 12) * 4, { facingRight: true });
  ctx.restore();

  fx.flashes.forEach((flash) => {
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
  fx.flashes = fx.flashes.filter((flash) => flash.life > 0);

  fx.scythes.forEach((scythe) => {
    if (scythe.warn > 0) {
      ctx.strokeStyle = Math.floor(scythe.warn / 4) % 2 === 0 ? 'rgba(255, 64, 129, 0.75)' : 'rgba(255, 64, 129, 0.3)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(scythe.x, 0);
      ctx.lineTo(scythe.x, floor);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    drawJesterFinalScythe(scythe.x, scythe.y, scythe.rotation, scythe.size);
  });

  if (frame < giantEnd) {
    // reuse the final-act soul renderer
    jesterFinal.target = player1;
    jesterFinal.soul = soul;
    jesterFinal.invulnerable = fx.invulnerable;
    drawJesterFinalSoul(1 - Math.min(1, frame / 40) * 0.7);
  }

  if (fx.giant) drawJesterFinalScythe(fx.giant.x, fx.giant.y, Math.sin(frame / 10) * 0.3, 6.5);

  fx.dust.forEach((grain) => {
    grain.life -= 1;
    grain.vy += 0.12;
    grain.x += grain.vx;
    grain.vx *= 0.97;
    grain.y = Math.min(floor - grain.size, grain.y + grain.vy);
    ctx.fillStyle = `rgba(150, 150, 165, ${Math.min(1, grain.life / 40)})`;
    ctx.fillRect(grain.x, grain.y, grain.size, grain.size);
  });
  fx.dust = fx.dust.filter((grain) => grain.life > 0);
  ctx.restore();

  if (frame >= giantEnd && frame < giantEnd + 30) {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - (frame - giantEnd) / 30})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (frame >= dustEnd - 25) {
    ctx.fillStyle = `rgba(0, 0, 0, ${(frame - (dustEnd - 25)) / 25})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function cancelJesterImpatience() {
  if (jesterImpatientTimer) clearTimeout(jesterImpatientTimer);
  jesterImpatientTimer = null;
  removeJesterPressOverlay();
  jesterScreenCrack = null;
}

function isStillOnJesterDefeatScreen() {
  return gameOver && normalArcadeActive && isJesterArcadeFight() && player1.health <= 0 && !arcadeCutscene.active &&
    !restartPanel.classList.contains('hidden') && !document.body.classList.contains('menu-open');
}

function scheduleJesterAnger() {
  if (jesterImpatientTimer) clearTimeout(jesterImpatientTimer);
  jesterImpatientTimer = setTimeout(() => {
    jesterImpatientTimer = null;
    if (isStillOnJesterDefeatScreen()) startJesterAngryScene();
  }, jesterAngryDelay);
}

function startJesterAngryScene() {
  restartPanel.classList.add('hidden');
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'jesterAngry',
    lines: jesterAngryLines,
    phase: 'dialog',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: -400,
    gamblerTargetX: -400,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: canvas.width / 2 - player2.width / 2,
    scammerY: 0,
    scammerTargetX: canvas.width / 2 - player2.width / 2,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: null,
  });
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneAngry');
  startCutsceneLine(0);
  if (!animationId) animate();
}

function makeScreenCrack(x, y) {
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const rays = [];
  for (let ray = 0; ray < 16; ray += 1) {
    const baseAngle = (Math.PI * 2 * ray) / 16 + random() * 0.3;
    const points = [[x, y]];
    let px = x;
    let py = y;
    const length = 180 + random() * 520;
    for (let step = 1; step <= 6; step += 1) {
      const angle = baseAngle + (random() - 0.5) * 0.5;
      px += Math.cos(angle) * (length / 6);
      py += Math.sin(angle) * (length / 6);
      points.push([px, py]);
    }
    rays.push(points);
  }
  const rings = [40, 95, 170].map((radius) => {
    const points = [];
    for (let step = 0; step <= 16; step += 1) {
      const angle = (Math.PI * 2 * step) / 16;
      const wobble = radius * (0.85 + random() * 0.3);
      points.push([x + Math.cos(angle) * wobble, y + Math.sin(angle) * wobble]);
    }
    return points;
  });
  return { x, y, rays, rings };
}

function drawScreenCrack(crack) {
  if (!crack) return;
  ctx.save();
  const hole = ctx.createRadialGradient(crack.x, crack.y, 0, crack.x, crack.y, 70);
  hole.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  hole.addColorStop(0.6, 'rgba(20, 0, 30, 0.8)');
  hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = hole;
  ctx.beginPath();
  ctx.arc(crack.x, crack.y, 70, 0, Math.PI * 2);
  ctx.fill();
  const stroke = (points, width, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  };
  crack.rays.forEach((points) => {
    stroke(points, 4, 'rgba(0, 0, 0, 0.55)');
    stroke(points, 1.5, 'rgba(255, 255, 255, 0.85)');
  });
  crack.rings.forEach((points) => {
    stroke(points, 3, 'rgba(0, 0, 0, 0.45)');
    stroke(points, 1.2, 'rgba(255, 255, 255, 0.7)');
  });
  ctx.restore();
}

function updateJesterAngryPhase(cutscene) {
  const frame = cutscene.frame;
  const jesterX = cutscene.scammerX;
  const jesterY = ground - player2.height;
  const hole = { x: canvas.width / 2 + 40, y: canvas.height / 2 - 40 };
  if (cutscene.phase === 'screenThrow') {
    if (frame === 8) playSound('jesterScytheThrow');
    if (frame === 48) {
      jesterScreenCrack = makeScreenCrack(hole.x, hole.y);
      cutscene.shake = 24;
      playSound('screenShatter');
    }
    if (frame === 70) playSound('jesterLaugh');
    if (frame >= 110) {
      cutscene.phase = 'screenFly';
      cutscene.frame = 0;
      playSound('jesterTeleport');
      return;
    }
  } else if (cutscene.phase === 'screenFly' && frame >= 46) {
    endArcadeCutscene();
    return;
  }
  cutscene.shake = (cutscene.shake || 0) * 0.9;

  ctx.save();
  ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  drawJesterRiftStage();
  if (cutscene.phase === 'screenThrow') {
    // wind-up, then the scythe flies straight at the camera
    const windUp = frame < 10 ? Math.sin((frame / 10) * Math.PI) * 10 : 0;
    drawJesterAt(jesterX - windUp, jesterY);
    if (frame >= 10 && frame < 48) {
      const progress = (frame - 10) / 38;
      const startX = jesterX + player2.width / 2;
      const startY = jesterY + 40;
      const x = startX + (hole.x - startX) * progress;
      const y = startY + (hole.y - startY) * progress;
      drawJesterFinalScythe(x, y, frame * 0.6, 1 + Math.pow(progress, 2.4) * 9);
    }
  } else {
    // Jester jumps toward the camera and through the hole
    const progress = Math.min(1, frame / 46);
    const scale = 1 + Math.pow(progress, 2) * 7;
    const startX = jesterX + player2.width / 2;
    const startY = jesterY + player2.height / 2;
    const x = startX + (hole.x - startX) * progress;
    const y = startY + (hole.y - startY) * progress;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(progress * 0.6);
    drawJesterAt(-player2.width / 2, -player2.height / 2);
    ctx.restore();
  }
  ctx.restore();
  drawScreenCrack(jesterScreenCrack);
  if (cutscene.phase === 'screenThrow' && frame >= 48 && frame < 60) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - (frame - 48) / 15})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function snapshotJesterSprite(scale) {
  // render Jester alone on the main canvas, copy it out, then the caller redraws the scene
  const width = Math.ceil((player2.width + 70) * scale);
  const height = Math.ceil((player2.height + 30) * scale);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  drawJesterAt(35, 25, { facingRight: false });
  ctx.restore();
  const sprite = document.createElement('canvas');
  sprite.width = width;
  sprite.height = height;
  const spriteContext = sprite.getContext('2d');
  spriteContext.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
  // find where his feet actually end so he can stand on things
  sprite.feetY = height;
  const pixels = spriteContext.getImageData(0, 0, width, height).data;
  for (let row = height - 1; row >= 0; row -= 1) {
    let painted = false;
    for (let column = 0; column < width; column += 2) {
      if (pixels[(row * width + column) * 4 + 3] > 40) {
        painted = true;
        break;
      }
    }
    if (painted) {
      sprite.feetY = row + 1;
      break;
    }
  }
  return sprite;
}

function removeJesterPressOverlay() {
  if (!jesterPressOverlay) return;
  cancelAnimationFrame(jesterPressOverlay.raf);
  jesterPressOverlay.element.remove();
  restartButton.classList.remove('jester-pressed');
  jesterPressOverlay = null;
}

function finishJesterAngryScene() {
  const sprite = snapshotJesterSprite(1.4);
  // back to the (now cracked) defeat screen
  player2.position = { x: canvas.width / 2 + 120, y: ground - player2.height };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawJesterRiftStage();
  // no victory pose this time: Jester already climbed out of the screen
  displayWinner(victoryTitle.innerText, null, null);
  drawScreenCrack(jesterScreenCrack);
  restartPanel.classList.remove('hidden');

  // Jester has come out of the screen: he flies over the page and presses "Reiniciar pelea" himself
  const overlay = document.createElement('canvas');
  overlay.className = 'jester-press-overlay';
  document.body.appendChild(overlay);
  const overlayRect = overlay.getBoundingClientRect();
  overlay.width = Math.max(1, Math.round(overlayRect.width));
  overlay.height = Math.max(1, Math.round(overlayRect.height));
  const overlayContext = overlay.getContext('2d');
  const canvasRect = canvas.getBoundingClientRect();
  const holeX = canvasRect.left + ((canvas.width / 2 + 40) / canvas.width) * canvasRect.width;
  const holeY = canvasRect.top + ((canvas.height / 2 - 40) / canvas.height) * canvasRect.height;
  const state = { element: overlay, raf: 0, frame: 0 };
  jesterPressOverlay = state;
  const pressFrame = 107;
  const flashStart = pressFrame + 110;
  const flashPeak = flashStart + 24;
  const flashEnd = flashPeak + 45;
  const step = () => {
    // after the restart the overlay is detached from jesterPressOverlay so it can finish fading out
    if (jesterPressOverlay !== state && !state.detached) return;
    state.frame += 1;
    const frame = state.frame;
    // keep the overlay's pixels matching its on-screen size (the viewport can change while it plays)
    const liveRect = overlay.getBoundingClientRect();
    if (Math.round(liveRect.width) !== overlay.width || Math.round(liveRect.height) !== overlay.height) {
      overlay.width = Math.max(1, Math.round(liveRect.width));
      overlay.height = Math.max(1, Math.round(liveRect.height));
    }
    const buttonRect = restartButton.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    // Jester's feet land on top of the button
    const standY = buttonRect.top - (sprite.feetY - sprite.height / 2) + 4;
    let x = holeX;
    let y = holeY;
    let scale = 1;
    if (frame <= 30) {
      // bursting out of the screen, huge, then settling
      scale = 3.2 - (frame / 30) * 2.2;
    } else if (frame <= 95) {
      const progress = (frame - 30) / 65;
      x = holeX + (buttonX - holeX) * progress;
      y = holeY + (standY - holeY) * progress - Math.sin(progress * Math.PI) * 120;
    } else {
      const press = Math.min(1, (frame - 95) / 12);
      x = buttonX;
      // keeps leaning on the button, giggling, while the restart charges up
      y = standY + press * 8 - (frame > pressFrame ? Math.abs(Math.sin(frame / 5)) * 6 : 0);
    }
    if (frame === 1) playSound('screenShatter');
    if (frame === 20) playSound('jesterLaugh');
    if (frame === pressFrame) {
      restartButton.classList.add('jester-pressed');
      playSound('menuSelect');
    }
    if (frame === pressFrame + 30 || frame === pressFrame + 70) playSound('jesterLaugh');
    if (frame === flashStart) playSound('jesterFinalWhite');
    overlayContext.clearRect(0, 0, overlay.width, overlay.height);
    overlayContext.save();
    overlayContext.translate(x, y);
    overlayContext.scale(scale, scale);
    overlayContext.rotate(frame <= 95 ? Math.sin(frame / 6) * 0.15 : 0);
    overlayContext.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    overlayContext.restore();
    if (frame > 36) {
      overlayContext.font = '900 20px Courier New, monospace';
      overlayContext.textAlign = 'center';
      overlayContext.lineWidth = 5;
      overlayContext.strokeStyle = '#111';
      overlayContext.fillStyle = '#ea80fc';
      const text = frame < 95 ? 'JA JA JA! PERMISO!' : 'OTRA RONDA!';
      overlayContext.strokeText(text, x, y - sprite.height / 2 - 8);
      overlayContext.fillText(text, x, y - sprite.height / 2 - 8);
    }
    // white flash: builds up, the fight restarts under full white, then it fades away
    if (frame >= flashStart) {
      const whiteness = frame < flashPeak ? (frame - flashStart) / (flashPeak - flashStart) : 1 - (frame - flashPeak) / (flashEnd - flashPeak);
      if (frame >= flashPeak) overlayContext.clearRect(0, 0, overlay.width, overlay.height);
      overlayContext.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, whiteness))})`;
      overlayContext.fillRect(0, 0, overlay.width, overlay.height);
    }
    if (frame === flashPeak) {
      state.detached = true;
      jesterPressOverlay = null;
      jesterScreenCrack = null;
      restartButton.classList.remove('jester-pressed');
      restartButton.click();
    }
    if (frame >= flashEnd) {
      overlay.remove();
      return;
    }
    state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}



function scheduleJesterImpatience() {
  cancelJesterImpatience();
  jesterImpatientTimer = setTimeout(() => {
    jesterImpatientTimer = null;
    if (isStillOnJesterDefeatScreen()) startJesterImpatientScene();
  }, jesterImpatientDelay);
}

function startJesterImpatientScene() {
  restartPanel.classList.add('hidden');
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'jesterImpatient',
    lines: jesterImpatientLines,
    phase: 'dialog',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: -400,
    gamblerTargetX: -400,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: Math.max(80, Math.min(canvas.width - 150, player2.position.x)),
    scammerY: 0,
    scammerTargetX: canvas.width / 2 - player2.width / 2,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: null,
  });
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneAngry');
  startCutsceneLine(0);
  if (!animationId) animate();
}

function startJesterLoseCutscene() {
  jesterLosePlayed = true;
  pendingFightTime = performance.now() - fightStartedAt;
  clearJesterProjectiles();
  jesterFinal.active = false;
  jesterWhiteFade = 0;
  const bored = player2.health >= jesterLoseSplitHealth;
  Object.assign(arcadeCutscene, {
    active: true,
    scene: bored ? 'jesterLoseBored' : 'jesterLoseFinal',
    lines: bored ? jesterLoseBoredLines : jesterLoseFinalLines,
    phase: 'dialog',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: Math.max(220, Math.min(canvas.width - 340, player1.position.x)),
    gamblerTargetX: Math.max(220, Math.min(canvas.width - 340, player1.position.x)),
    gamblerHop: 0,
    gamblerDown: true,
    gamblerScale: 1,
    scammerX: Math.max(200, Math.min(canvas.width - 80, player2.position.x)),
    scammerY: 0,
    scammerTargetX: Math.max(220, Math.min(canvas.width - 340, player1.position.x)) + 260,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: null,
  });
  document.body.classList.add('arcade-cutscene');
  playJesterTrack('dialog');
  playSound('jesterLaugh');
  startCutsceneLine(0);
  if (!animationId) animate();
}

function startJesterOutroCutscene() {
  jesterOutroPlayed = true;
  pendingFightTime = performance.now() - fightStartedAt;
  clearJesterProjectiles();
  jesterFinal.active = false;
  jesterWhiteFade = 0;
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'jesterOutro',
    lines: jesterOutroLines,
    phase: 'outroIntro',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: Math.max(40, Math.min(canvas.width - 200, player1.position.x)),
    gamblerTargetX: 330,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: Math.max(200, Math.min(canvas.width - 80, player2.position.x)),
    scammerY: 0,
    scammerTargetX: 640,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
  });
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneLand');
  playJesterTrack('dialog');
  if (!animationId) animate();
}

function startScammerOutroCutscene() {
  scammerOutroPlayed = true;
  pendingFightTime = performance.now() - fightStartedAt;
  stopScammerBattleTrack();
  const rage = Boolean(player2.scammerRage);
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'outro',
    lines: rage ? scammerRageOutroLines : scammerOutroLines,
    phase: 'outroIntro',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: Math.max(40, Math.min(canvas.width - 200, player1.position.x)),
    gamblerTargetX: 340,
    gamblerHop: 0,
    scammerX: Math.max(200, Math.min(canvas.width - 80, player2.position.x)),
    scammerY: 0,
    scammerTargetX: 560,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: rage,
  });
  scamOffers = [];
  scamItems = [];
  scamSlotMachines = [];
  jesterSuits = [];
  jesterBombs = [];
  jesterScythes = [];
  jesterAfterimages = [];
  robotShots = [];
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneLand');
  if (!animationId) animate();
}

function startCutsceneLine(index) {
  const line = arcadeCutscene.lines[index];
  arcadeCutscene.lineIndex = index;
  arcadeCutscene.typed = 0;
  arcadeCutscene.lineDoneFrames = 0;
  if (typeof line.gamblerX === 'number') arcadeCutscene.gamblerTargetX = line.gamblerX;
  if (typeof line.gamblerStep === 'number') arcadeCutscene.gamblerTargetX = Math.max(40, Math.min(canvas.width - 200, arcadeCutscene.gamblerTargetX + line.gamblerStep));
  if (typeof line.scammerOffset === 'number') arcadeCutscene.scammerTargetX = arcadeCutscene.gamblerTargetX + line.scammerOffset;
  arcadeCutscene.prop = line.prop || null;
  arcadeCutscene.mood = line.mood || null;
  arcadeCutscene.emote = line.emote ? { ...line.emote, timer: 70 } : null;
  arcadeCutscene.lastBlip = 0;
  if (line.emote) {
    const emoteSounds = { '!': 'cutsceneSurprise', '?': 'cutsceneQuestion', '$': 'cutsceneCash', '#!': 'cutsceneAngry', 'JA!': 'jesterLaugh', '!!': 'jesterLaugh', '?!': 'cutsceneQuestion' };
    if (emoteSounds[line.emote.symbol]) playSound(emoteSounds[line.emote.symbol]);
  }
}

function beginCutsceneDialog() {
  arcadeCutscene.phase = 'dialog';
  arcadeCutscene.frame = 0;
  arcadeCutscene.lidAngle = 1.9;
  arcadeCutscene.scammerY = 0;
  arcadeCutscene.gamblerHop = 0;
  arcadeCutscene.gamblerX = Math.max(arcadeCutscene.gamblerX, 300);
  arcadeCutscene.scammerX = 600;
  startCutsceneLine(0);
}

function advanceArcadeCutscene() {
  const cutscene = arcadeCutscene;
  if (!cutscene.active) return;
  if (['teleport', 'arrive', 'exorcism', 'loseLaugh', 'scriptedFinal', 'screenThrow', 'screenFly'].includes(cutscene.phase)) return;
  if (cutscene.phase === 'outroIntro') {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    startCutsceneLine(0);
    return;
  }
  if (cutscene.phase === 'walk' || cutscene.phase === 'rattle' || cutscene.phase === 'burst') {
    cutscene.gamblerX = 330;
    beginCutsceneDialog();
    return;
  }
  if (cutscene.phase === 'dialog') {
    const line = arcadeCutscene.lines[cutscene.lineIndex];
    if (cutscene.typed < line.text.length) {
      cutscene.typed = line.text.length;
      return;
    }
    if (cutscene.lineIndex + 1 < cutscene.lines.length) {
      startCutsceneLine(cutscene.lineIndex + 1);
      playSound('menuMove');
    } else if (cutscene.scene === 'jesterTired' || cutscene.scene === 'jesterOutroCity' || cutscene.scene === 'jesterImpatient') {
      endArcadeCutscene();
    } else if (cutscene.scene === 'jesterAngry') {
      cutscene.phase = 'screenThrow';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'jesterLoseBored' || cutscene.scene === 'jesterLoseFinal') {
      beginJesterLosePhase(cutscene);
    } else if (cutscene.scene === 'jesterOutro') {
      cutscene.phase = 'teleport';
      cutscene.frame = 0;
      cutscene.emote = null;
      cutscene.mood = 'crazy';
    } else if (cutscene.scene === 'outro') {
      cutscene.phase = 'leave';
      cutscene.frame = 0;
      cutscene.prop = null;
      cutscene.emote = null;
      cutscene.scammerTargetX = 790;
      cutscene.gamblerTargetX = canvas.width + 120;
    } else if (cutscene.scene === 'intro' && isDebugModified()) {
      startDebugCalloutScene();
    } else if (cutscene.scene === 'debug') {
      cutscene.phase = 'rage';
      cutscene.frame = 0;
      playSound('cutsceneAngry');
    } else {
      cutscene.phase = 'versus';
      cutscene.frame = 0;
      playSound('cutsceneVersus');
    }
    return;
  }
  if (cutscene.phase === 'rage') {
    cutscene.rageVisible = true;
    cutscene.phase = 'versus';
    cutscene.frame = 0;
    playSound('cutsceneVersus');
    return;
  }
  endArcadeCutscene();
}

function isDebugModified() {
  return Object.keys(defaultDebugSettings).some((key) => debugSettings[key] !== defaultDebugSettings[key]);
}

function formatDebugMultiplier(value) {
  return `x${Number(value).toFixed(2).replace(/\.?0+$/, '')}`;
}

function buildDebugCalloutLines() {
  const lines = [
    { speaker: 'scammer', text: 'Espera, espera, espera... Que es ese olor?', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'scammer', text: 'Huele a... PANTALLA DEBUG! JA JA JA! Sucio tramposo! Te vi tocando los numeros!', mood: 'mock', emote: { who: 'scammer', symbol: 'JA!' } },
    { speaker: 'gambler', text: 'Pantalla que? Con quien estas hablando?', emote: { who: 'gambler', symbol: '?' } },
  ];
  const changes = [];
  const value = (key) => debugSettings[key];
  if (value('damageMultiplier') > 1) changes.push(`Dano ${formatDebugMultiplier(value('damageMultiplier'))}? Tus punos no alcanzaban, BIG SHOT? Que tierno.`);
  if (value('damageMultiplier') < 1) changes.push(`Bajaste el dano a ${formatDebugMultiplier(value('damageMultiplier'))}? Queres que la pelea dure para siempre? Que raro sos.`);
  if (value('healthMultiplier') > 1) changes.push(`Vida ${formatDebugMultiplier(value('healthMultiplier'))}? Asi cualquiera aguanta mis ofertas, cobarde.`);
  if (value('healthMultiplier') < 1) changes.push(`Menos vida (${formatDebugMultiplier(value('healthMultiplier'))})? Te gusta sufrir o solo te gusta perder?`);
  if (value('moveMultiplier') > 1) changes.push(`Velocidad ${formatDebugMultiplier(value('moveMultiplier'))}? Ni corriendo te escapas de una buena deuda.`);
  if (value('moveMultiplier') < 1) changes.push(`Te pusiste lento a proposito (${formatDebugMultiplier(value('moveMultiplier'))})? Hasta una tortuga te compraria un reloj.`);
  if (value('cooldownMultiplier') < 1) changes.push(`Cooldowns ${formatDebugMultiplier(value('cooldownMultiplier'))}? Eso no es estrategia, es SPAM con sombrero.`);
  if (value('cooldownMultiplier') > 1) changes.push(`Cooldowns mas largos (${formatDebugMultiplier(value('cooldownMultiplier'))})? ...Ok, eso ni yo lo entiendo.`);
  if (value('gravityMultiplier') !== 1) changes.push(`Tocaste la GRAVEDAD (${formatDebugMultiplier(value('gravityMultiplier'))})?! Quien te crees, el dueno del universo?`);
  if (value('projectileMultiplier') !== 1) changes.push(`Proyectiles ${formatDebugMultiplier(value('projectileMultiplier'))}? Mis ofertas vuelan solas, no necesitan tu ayuda.`);
  if (value('durationMultiplier') !== 1) changes.push(`Efectos ${formatDebugMultiplier(value('durationMultiplier'))}? Las ofertas por tiempo limitado NO se estiran, amigo!`);
  if (value('knockbackMultiplier') !== 1) changes.push(`Empuje ${formatDebugMultiplier(value('knockbackMultiplier'))}? Queres mandarme de vuelta al contenedor de un golpe?`);
  if (value('restoreAttackSpam')) changes.push('Spam de golpes activado?! Eso no se vende ni en el mercado negro!');
  if (Object.values(debugAffectedCharacters).some((enabled) => !enabled)) {
    changes.push('Y encima elegiste a quien afectar con los cambios... Que detallista para hacer trampa.');
  }
  const gamblerReplies = [
    'Definitivamente estas loco.',
    'Creo que la basura te afecto la cabeza.',
    'No se de que numeros hablas. Solo veo a un tipo raro gritandole al aire.',
    '...Voy a hacer como que no escuche nada.',
  ];
  changes.slice(0, 4).forEach((text, index) => {
    lines.push({ speaker: 'scammer', text, mood: 'mock', emote: index === 0 ? { who: 'scammer', symbol: '$' } : null });
    if (index < 2) lines.push({ speaker: 'gambler', text: gamblerReplies[index], emote: { who: 'gambler', symbol: '...' } });
  });
  if (changes.length > 4) lines.push({ speaker: 'scammer', text: `Y todavia hay ${changes.length - 4} trampas mas! Te pasaste, BIG SHOT!`, mood: 'mock' });
  if (lines[lines.length - 1].speaker !== 'gambler') {
    lines.push({ speaker: 'gambler', text: gamblerReplies[3], emote: { who: 'gambler', symbol: '?' } });
  }
  lines.push({ speaker: 'scammer', text: 'Ja... ja ja... No te preocupes. Yo tambien se hacer trampa.', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } });
  lines.push({ speaker: 'scammer', text: 'MODO FURIOSO! AHORA ES MI OPORTUNIDAD DE SER UN [[BIG SHOT]]!!', mood: 'angry', rage: true });
  return lines;
}

function startDebugCalloutScene() {
  const cutscene = arcadeCutscene;
  cutscene.scene = 'debug';
  cutscene.lines = buildDebugCalloutLines();
  cutscene.phase = 'dialog';
  cutscene.frame = 0;
  cutscene.gamblerTargetX = cutscene.gamblerX;
  cutscene.scammerTargetX = cutscene.gamblerX + 150;
  startCutsceneLine(0);
  playSound('cutsceneSurprise');
}

function spawnDumpsterBurst() {
  for (let index = 0; index < 22; index += 1) {
    arcadeCutscene.particles.push({
      x: 700 + Math.random() * 90,
      y: ground - 100,
      velocityX: (Math.random() - 0.5) * 12,
      velocityY: -4 - Math.random() * 9,
      size: 4 + Math.random() * 7,
      color: ['#6d4c41', '#9e9e9e', '#c9a227', '#4e342e', '#e0e0e0'][index % 5],
      life: 70,
    });
  }
}

function moveToward(current, target, speed) {
  if (Math.abs(target - current) <= speed) return target;
  return current + Math.sign(target - current) * speed;
}

function drawScaredSweat(fighter, fear) {
  const time = performance.now() / 1000;
  const headX = fighter.position.x + fighter.width / 2;
  const headY = fighter.position.y + 16;
  ctx.save();
  const drops = fear > 2 ? 3 : 2;
  for (let drop = 0; drop < drops; drop += 1) {
    const cycle = (time * 1.3 + drop * 0.37) % 1;
    const side = drop % 2 ? 1 : -1;
    const x = headX + side * (fighter.width / 2 + 6 + drop * 3);
    const y = headY + cycle * 26;
    ctx.globalAlpha = 1 - cycle;
    ctx.fillStyle = '#81d4fa';
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.quadraticCurveTo(x + 5, y + 1, x, y + 4);
    ctx.quadraticCurveTo(x - 5, y + 1, x, y - 7);
    ctx.fill();
  }
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = '#b3e5fc';
  ctx.lineWidth = 2;
  for (let line = 0; line < 3; line += 1) {
    const x = fighter.position.x + 8 + line * ((fighter.width - 16) / 2);
    ctx.beginPath();
    ctx.moveTo(x, fighter.position.y - 4);
    ctx.lineTo(x, fighter.position.y + 10);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCutsceneEmote(fighter, symbol, timer) {
  const pop = Math.min(1, (70 - timer) / 8);
  ctx.save();
  ctx.translate(fighter.position.x + fighter.width / 2, fighter.position.y - 30);
  ctx.scale(pop, pop);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = symbol === '#!' ? '#d50000' : '#111';
  ctx.font = '900 20px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(symbol, 0, 7);
  ctx.restore();
}

function drawCutsceneProp(prop) {
  const x = player2.position.x + (player2.attacksToTheRight ? player2.width + 18 : -18);
  const y = player2.position.y + 60 + Math.sin(performance.now() / 200) * 4;
  ctx.save();
  if (prop === 'watch') {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x - 5, y - 20, 10, 40);
    ctx.fillStyle = '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6, y + 2);
    ctx.stroke();
  } else if (prop === 'chip') {
    ctx.fillStyle = '#e53935';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    for (let notch = 0; notch < 6; notch += 1) {
      const angle = (Math.PI * 2 * notch) / 6;
      ctx.fillRect(x + Math.cos(angle) * 10 - 2, y + Math.sin(angle) * 10 - 2, 4, 4);
    }
    ctx.font = '900 12px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('7', x, y + 4);
  }
  ctx.restore();
}

function drawCutsceneDialog() {
  const line = arcadeCutscene.lines[arcadeCutscene.lineIndex];
  const isScammerLine = line.speaker === 'scammer' || line.speaker === 'jester';
  const jesterColors = ['#ea80fc', '#fdd835', '#b388ff', '#ff4081'];
  const accent = line.speaker === 'jester'
    ? jesterColors[Math.floor(performance.now() / 180) % jesterColors.length]
    : isScammerLine ? (line.mood === 'angry' || line.rage ? '#ff1744' : '#fdd835') : '#ba68c8';
  const shake = isScammerLine && (arcadeCutscene.mood === 'angry' || arcadeCutscene.mood === 'crazy') ? (Math.random() - 0.5) * 4 : 0;
  const speakerNames = { gambler: 'GAMBLER', scammer: 'SCAMMER', jester: 'SHADOW JESTER' };
  ctx.save();
  ctx.fillStyle = 'rgba(8, 6, 12, 0.92)';
  ctx.fillRect(56 + shake, 60, 912, 112);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(56 + shake, 60, 912, 112);
  ctx.fillStyle = accent;
  ctx.fillRect(76 + shake, 46, 200, 28);
  ctx.fillStyle = '#111';
  ctx.font = '900 18px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(speakerNames[line.speaker] || 'GAMBLER', 176 + shake, 66);
  ctx.fillStyle = '#fff';
  ctx.font = '700 20px Arial';
  ctx.textAlign = 'left';
  drawWrappedText(line.text.slice(0, Math.floor(arcadeCutscene.typed)), 84 + shake, 104, 850, 26);
  if (arcadeCutscene.typed >= line.text.length && Math.floor(performance.now() / 350) % 2 === 0) {
    ctx.fillStyle = accent;
    ctx.font = '900 14px Courier New, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ENTER >', 952, 160);
  }
  ctx.restore();
}

function updateAndDrawArcadeCutscene() {
  const cutscene = arcadeCutscene;
  cutscene.frame += 1;
  if (cutscene.phase === 'exorcism' || cutscene.phase === 'loseLaugh' || cutscene.phase === 'scriptedFinal') {
    updateJesterLosePhase(cutscene);
    return;
  }
  if (cutscene.phase === 'screenThrow' || cutscene.phase === 'screenFly') {
    updateJesterAngryPhase(cutscene);
    return;
  }

  if (cutscene.phase === 'walk') {
    if (cutscene.frame % 18 === 0) playSound('cutsceneStep');
    cutscene.gamblerX = moveToward(cutscene.gamblerX, 330, 3.2);
    if (cutscene.gamblerX >= 330) {
      cutscene.phase = 'rattle';
      cutscene.frame = 0;
    }
  } else if (cutscene.phase === 'rattle') {
    cutscene.shake = (Math.random() - 0.5) * (4 + cutscene.frame / 12);
    cutscene.lidAngle = Math.random() < 0.3 ? 0.12 : 0;
    if (cutscene.frame % 9 === 0) playSound('dumpsterRattle');
    if (cutscene.frame >= 80) {
      cutscene.phase = 'burst';
      cutscene.frame = 0;
      cutscene.shake = 0;
      spawnDumpsterBurst();
      playSound('dumpsterBurst');
      cutscene.emote = { who: 'gambler', symbol: '!', timer: 70 };
      setTimeout(() => {
        if (arcadeCutscene.active) playSound('cutsceneSurprise');
      }, 180);
    }
  } else if (cutscene.phase === 'burst') {
    cutscene.lidAngle = Math.min(1.9, cutscene.lidAngle + 0.28);
    const progress = Math.min(1, cutscene.frame / 36);
    cutscene.scammerX = 720 + (600 - 720) * progress;
    cutscene.scammerY = Math.sin(Math.PI * progress) * 170 + (1 - progress) * 50;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, 300, 2.5);
    cutscene.gamblerHop = cutscene.frame < 16 ? Math.sin((cutscene.frame / 16) * Math.PI) * 26 : 0;
    if (cutscene.frame === 36) playSound('cutsceneLand');
    if (cutscene.frame >= 52) beginCutsceneDialog();
  } else if (cutscene.phase === 'dialog') {
    const line = arcadeCutscene.lines[cutscene.lineIndex];
    cutscene.typed = Math.min(line.text.length, cutscene.typed + 1.1);
    const typedCharacters = Math.floor(cutscene.typed);
    if (typedCharacters - (cutscene.lastBlip || 0) >= 2 && line.text[typedCharacters - 1] !== ' ') {
      cutscene.lastBlip = typedCharacters;
      playSound('cutsceneBlip', { speaker: line.speaker });
    }
    const someoneWalking = Math.abs(cutscene.gamblerX - cutscene.gamblerTargetX) > 1 || Math.abs(cutscene.scammerX - cutscene.scammerTargetX) > 1;
    if (someoneWalking && cutscene.frame % 16 === 0) playSound('cutsceneStep');
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 2.4);
    cutscene.scammerX = moveToward(cutscene.scammerX, cutscene.scammerTargetX, 3.4);
    if (cutscene.typed >= line.text.length) {
      cutscene.lineDoneFrames += 1;
      if (cutscene.lineDoneFrames > 240) advanceArcadeCutscene();
    }
  } else if (cutscene.phase === 'outroIntro') {
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    cutscene.scammerX = moveToward(cutscene.scammerX, cutscene.scammerTargetX, 3);
    cutscene.scammerY = cutscene.frame < 20 ? Math.sin((cutscene.frame / 20) * Math.PI) * 30 : 0;
    if (cutscene.frame >= 70) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
  } else if (cutscene.phase === 'teleport') {
    if (cutscene.frame === 12) {
      playSound('jesterSnap');
      playSound('jesterLaugh');
    }
    if (cutscene.frame === 20) playSound('jesterTeleport');
    if (cutscene.frame > 20) cutscene.gamblerScale = Math.max(0, 1 - (cutscene.frame - 20) / 50);
    if (cutscene.frame === 68) {
      stopJesterTracks();
      playSound('jesterFinalWhite');
    }
    if (cutscene.frame >= 95) {
      cutscene.scene = 'jesterOutroCity';
      cutscene.phase = 'arrive';
      cutscene.frame = 0;
      cutscene.mood = null;
      cutscene.gamblerX = 420;
      cutscene.gamblerTargetX = 420;
      cutscene.gamblerScale = 1;
      cutscene.scammerX = canvas.width + 400;
      cutscene.scammerTargetX = canvas.width + 400;
      playSound('cobaltWind');
    }
  } else if (cutscene.phase === 'arrive') {
    if (cutscene.frame === 18) playSound('cutsceneLand');
    if (cutscene.frame >= 80) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.lines = jesterCityLines;
      startCutsceneLine(0);
    }
  } else if (cutscene.phase === 'leave') {
    if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    cutscene.scammerX = moveToward(cutscene.scammerX, cutscene.scammerTargetX, 3);
    if (cutscene.frame > 20) cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3.4);
    if (cutscene.gamblerX >= canvas.width + 40 || cutscene.frame > 360) {
      endArcadeCutscene();
      return;
    }
  } else if (cutscene.phase === 'rage') {
    cutscene.shake = (Math.random() - 0.5) * 8;
    if (cutscene.frame === 30) {
      cutscene.rageVisible = true;
      playSound('dumpsterBurst');
      spawnDumpsterBurst();
    }
    if (cutscene.frame % 20 === 0 && cutscene.frame < 30) playSound('cutsceneAngry');
    if (cutscene.frame >= 110) {
      cutscene.shake = 0;
      cutscene.phase = 'versus';
      cutscene.frame = 0;
      playSound('cutsceneVersus');
    }
  } else if (cutscene.phase === 'versus' && cutscene.frame >= 110) {
    endArcadeCutscene();
    return;
  }

  if (cutscene.emote) {
    cutscene.emote.timer -= 1;
    if (cutscene.emote.timer <= 0) cutscene.emote = null;
  }

  if (cutscene.scene === 'jesterOutroCity') {
    drawCobaltAftermathStage();
  } else if (['jester', 'jesterTired', 'jesterOutro', 'jesterLoseBored', 'jesterLoseFinal', 'jesterImpatient', 'jesterAngry'].includes(cutscene.scene)) {
    drawJesterRiftStage();
  } else {
    drawGamblerAlleyStage(cutscene.lidAngle, cutscene.shake);
  }

  const walkBob = (x, target) => (Math.abs(x - target) > 0.5 ? Math.abs(Math.sin(performance.now() / 90)) * 5 : 0);
  player1.position.x = cutscene.gamblerX;
  player1.position.y = ground - player1.height - cutscene.gamblerHop - (cutscene.phase === 'walk' ? walkBob(cutscene.gamblerX, 330) : walkBob(cutscene.gamblerX, cutscene.gamblerTargetX));
  player2.position.x = cutscene.scammerX;
  player2.position.y = ground - player2.height - cutscene.scammerY - (cutscene.phase === 'dialog' ? walkBob(cutscene.scammerX, cutscene.scammerTargetX) : 0);
  player1.attacksToTheRight = player2.position.x >= player1.position.x;
  player2.attacksToTheRight = !player1.attacksToTheRight;
  player1.isAttacking = false;
  player2.isAttacking = false;
  if (cutscene.scene === 'jester') {
    const currentLine = cutscene.lines[cutscene.lineIndex];
    const fear = currentLine && currentLine.brave ? 0.8 : currentLine && currentLine.speaker === 'jester' ? 2.6 : 1.8;
    player1.position.x += (Math.random() - 0.5) * fear * 2;
    player1.draw();
    drawScaredSweat(player1, fear);
  } else if (cutscene.phase === 'teleport') {
    const scale = cutscene.gamblerScale ?? 1;
    const centerX = player1.position.x + player1.width / 2;
    const centerY = player1.position.y + player1.height / 2;
    const time = performance.now() / 1000;
    ctx.save();
    ctx.strokeStyle = 'rgba(234, 128, 252, 0.8)';
    ctx.lineWidth = 3;
    for (let ring = 0; ring < 3; ring += 1) {
      const radius = ((cutscene.frame * 3 + ring * 30) % 90) + 20;
      ctx.globalAlpha = 1 - radius / 110;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 1.4, time * 2 + ring, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    if (scale > 0) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((1 - scale) * Math.PI * 4);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      player1.draw();
      ctx.restore();
    }
  } else if (cutscene.scene === 'jesterImpatient' || cutscene.scene === 'jesterAngry') {
    // Gambler is gone; only Jester is on stage
  } else if (cutscene.scene === 'jesterLoseBored' && cutscene.phase === 'dialog') {
    drawDownedFighter(player1);
  } else {
    if (cutscene.phase === 'arrive') player1.attacksToTheRight = Math.floor(cutscene.frame / 22) % 2 === 0;
    player1.draw();
  }
  const scammerVisible = cutscene.phase !== 'walk' && cutscene.phase !== 'rattle' && cutscene.scene !== 'jesterOutroCity';
  if (scammerVisible) {
    const realRage = player2.scammerRage;
    const realColor = player2.color;
    player2.scammerRage = cutscene.rageVisible;
    player2.color = isShadowJester(player2) ? realColor : cutscene.rageVisible ? '#e53935' : '#f2f2f2';
    if (cutscene.mood === 'crazy') player2.position.x += (Math.random() - 0.5) * 6;
    player2.draw();
    player2.scammerRage = realRage;
    player2.color = realColor;
    if (cutscene.mood === 'mock' && cutscene.phase === 'dialog') {
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 16px Courier New, monospace';
      ctx.textAlign = 'center';
      const bounce = Math.abs(Math.sin(performance.now() / 120)) * 6;
      ctx.fillText('JA JA', player2.position.x + player2.width + 22, player2.position.y + 20 - bounce);
    }
    if (cutscene.mood === 'angry') {
      ctx.fillStyle = 'rgba(213, 0, 0, 0.35)';
      ctx.fillRect(player2.position.x, player2.position.y, player2.width, 50);
      ctx.fillStyle = 'rgba(224, 224, 224, 0.7)';
      [0, 1].forEach((side) => {
        const puffY = player2.position.y - 6 - ((performance.now() / 8) % 30);
        ctx.beginPath();
        ctx.arc(player2.position.x + (side ? player2.width + 6 : -6), puffY, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    if (cutscene.prop && cutscene.phase === 'dialog') drawCutsceneProp(cutscene.prop);
  }

  cutscene.particles.forEach((particle) => {
    particle.velocityY += 0.4;
    particle.x += particle.velocityX;
    particle.y = Math.min(ground - particle.size, particle.y + particle.velocityY);
    particle.life -= 1;
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  cutscene.particles = cutscene.particles.filter((particle) => particle.life > 0);

  if (cutscene.emote) {
    const fighter = cutscene.emote.who === 'gambler' ? player1 : player2;
    if (cutscene.emote.who === 'gambler' || scammerVisible) drawCutsceneEmote(fighter, cutscene.emote.symbol, cutscene.emote.timer);
  }

  if (cutscene.phase === 'dialog') drawCutsceneDialog();

  if (cutscene.phase === 'teleport' && cutscene.frame >= 60) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (cutscene.frame - 60) / 14)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.phase === 'arrive' && cutscene.frame < 45) {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - cutscene.frame / 45})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (cutscene.phase === 'outroIntro') {
    const alpha = Math.max(0, 0.7 - cutscene.frame / 70);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 6;
    ctx.font = '900 64px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, (70 - cutscene.frame) / 20);
    ctx.strokeText('K.O.', canvas.width / 2, 170);
    ctx.fillText('K.O.', canvas.width / 2, 170);
    ctx.restore();
  }

  if (cutscene.phase === 'rage') {
    const flash = cutscene.frame < 30 ? (cutscene.frame % 10 < 5 ? 0.35 : 0.1) : Math.max(0, 0.6 - (cutscene.frame - 30) / 80);
    ctx.fillStyle = `rgba(213, 0, 0, ${flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (cutscene.frame >= 30) {
      ctx.save();
      ctx.fillStyle = '#ff1744';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 6;
      ctx.font = '900 54px Courier New, monospace';
      ctx.textAlign = 'center';
      const pop = 1 + Math.max(0, (50 - cutscene.frame) / 40);
      ctx.translate(canvas.width / 2, 150);
      ctx.scale(pop, pop);
      ctx.strokeText('SCAMMER FURIOSO', 0, 0);
      ctx.fillText('SCAMMER FURIOSO', 0, 0);
      ctx.restore();
    }
  }

  if (cutscene.phase === 'versus') {
    const slide = Math.min(1, cutscene.frame / 18);
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(-canvas.width + slide * canvas.width, 200, canvas.width / 2, 110);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(canvas.width - slide * (canvas.width / 2), 200, canvas.width / 2, 110);
    ctx.fillStyle = '#fff';
    ctx.font = '900 38px Courier New, monospace';
    ctx.textAlign = 'center';
    const versusName = cutscene.scene === 'jester' ? 'SHADOW JESTER' : cutscene.rageVisible ? 'SCAMMER FURIOSO' : 'SCAMMER';
    ctx.fillText(`GAMBLER  VS  ${versusName}`, canvas.width / 2, 250);
    if (cutscene.frame > 40) {
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 30px Courier New, monospace';
      ctx.fillText('A PELEAR!', canvas.width / 2, 292);
    }
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '700 13px Courier New, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER / ESPACIO: avanzar   ESC: saltar escena', canvas.width - 16, canvas.height - 14);
  ctx.restore();
}

// Chapter 4 map: the inside of Tempus Corp.'s abandoned robot factory (Planta 7).
function drawRobotFactoryStage() {
  const time = performance.now() / 1000;
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#07090c');
  wall.addColorStop(0.6, '#12171d');
  wall.addColorStop(1, '#1b2128');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, ground);

  // wall panels
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.lineWidth = 2;
  for (let panelX = 0; panelX < canvas.width; panelX += 128) {
    ctx.strokeRect(panelX + 4, 150, 120, ground - 170);
  }

  // high broken windows letting in cold moonlight
  [[150, 40], [470, 30], [800, 44]].forEach(([windowX, windowY], index) => {
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(windowX, windowY, 110, 70);
    ctx.fillStyle = 'rgba(144, 202, 249, 0.18)';
    ctx.fillRect(windowX + 4, windowY + 4, 102, 62);
    ctx.strokeStyle = '#2b3440';
    ctx.lineWidth = 4;
    ctx.strokeRect(windowX, windowY, 110, 70);
    ctx.beginPath();
    ctx.moveTo(windowX + 55, windowY);
    ctx.lineTo(windowX + 55, windowY + 70);
    ctx.moveTo(windowX, windowY + 35);
    ctx.lineTo(windowX + 110, windowY + 35);
    ctx.stroke();
    // broken glass
    ctx.fillStyle = '#07090c';
    ctx.beginPath();
    ctx.moveTo(windowX + 60 + index * 8, windowY + 4);
    ctx.lineTo(windowX + 100, windowY + 30);
    ctx.lineTo(windowX + 70, windowY + 22);
    ctx.closePath();
    ctx.fill();
    const beam = ctx.createLinearGradient(windowX, windowY + 70, windowX + 80, ground);
    beam.addColorStop(0, 'rgba(144, 202, 249, 0.12)');
    beam.addColorStop(1, 'rgba(144, 202, 249, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(windowX + 6, windowY + 70);
    ctx.lineTo(windowX + 104, windowY + 70);
    ctx.lineTo(windowX + 190, ground);
    ctx.lineTo(windowX + 50, ground);
    ctx.closePath();
    ctx.fill();
  });

  // pipes along the ceiling
  ctx.fillStyle = '#263238';
  ctx.fillRect(0, 128, canvas.width, 12);
  ctx.fillStyle = '#37474f';
  ctx.fillRect(0, 128, canvas.width, 4);
  for (let jointX = 40; jointX < canvas.width; jointX += 170) {
    ctx.fillStyle = '#455a64';
    ctx.fillRect(jointX, 124, 14, 20);
  }

  // hanging chain with a hook, swinging a bit
  const swing = Math.sin(time * 0.9) * 0.08;
  ctx.save();
  ctx.translate(700, 140);
  ctx.rotate(swing);
  ctx.strokeStyle = '#546e7a';
  ctx.lineWidth = 3;
  for (let link = 0; link < 9; link += 1) {
    ctx.strokeRect(-3, link * 12, 6, 10);
  }
  ctx.beginPath();
  ctx.arc(0, 118, 10, 0, Math.PI);
  ctx.stroke();
  ctx.restore();

  // background conveyor belt with abandoned robot parts
  ctx.fillStyle = '#20262d';
  ctx.fillRect(60, 380, 420, 26);
  ctx.fillStyle = '#11151a';
  const beltShift = (time * 12) % 30;
  for (let roller = 60 - beltShift; roller < 480; roller += 30) {
    if (roller < 60) continue;
    ctx.beginPath();
    ctx.arc(roller, 393, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#37474f';
  ctx.fillRect(120, 356, 30, 24);
  ctx.fillRect(250, 360, 40, 20);
  ctx.fillStyle = '#546e7a';
  ctx.beginPath();
  ctx.arc(380, 368, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.fillRect(374, 364, 5, 4);
  ctx.fillStyle = Math.floor(time * 2) % 3 === 0 ? '#ff1744' : '#3a0a0a';
  ctx.fillRect(383, 364, 5, 4);

  // flickering ceiling lamp with a light cone
  const lampOn = Math.sin(time * 13) > -0.7 && Math.sin(time * 3.1) > -0.95;
  ctx.fillStyle = '#37474f';
  ctx.fillRect(505, 140, 3, 60);
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.moveTo(485, 200);
  ctx.lineTo(528, 200);
  ctx.lineTo(518, 188);
  ctx.lineTo(495, 188);
  ctx.closePath();
  ctx.fill();
  if (lampOn) {
    const cone = ctx.createLinearGradient(506, 200, 506, ground);
    cone.addColorStop(0, 'rgba(255, 224, 130, 0.28)');
    cone.addColorStop(1, 'rgba(255, 224, 130, 0.03)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(488, 200);
    ctx.lineTo(525, 200);
    ctx.lineTo(640, ground);
    ctx.lineTo(372, ground);
    ctx.closePath();
    ctx.fill();
  }

  // faded company sign
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#263238';
  ctx.fillRect(360, 150, 300, 52);
  ctx.strokeStyle = '#455a64';
  ctx.lineWidth = 3;
  ctx.strokeRect(360, 150, 300, 52);
  ctx.fillStyle = Math.sin(time * 2.3) > 0.85 ? '#26c6da' : '#4d6b73';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TEMPUS CORP.', 510, 184);
  ctx.font = '700 11px Courier New, monospace';
  ctx.fillStyle = '#78909c';
  ctx.fillText('PLANTA 7 - ROBOTICA', 510, 198);
  ctx.restore();

  // sparks from a broken cable on the right
  if (Math.sin(time * 5.7) > 0.6) {
    for (let spark = 0; spark < 5; spark += 1) {
      ctx.strokeStyle = robotGlitchSparkColors[spark % robotGlitchSparkColors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sparkX = 920 + (Math.random() - 0.5) * 12;
      const sparkY = 230 + Math.random() * 20;
      ctx.moveTo(sparkX, sparkY);
      ctx.lineTo(sparkX + (Math.random() - 0.5) * 30, sparkY + Math.random() * 30);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(920, 140);
  ctx.quadraticCurveTo(935, 190, 920, 232);
  ctx.stroke();

  // metal grate floor
  ctx.fillStyle = '#1f252b';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.strokeStyle = '#11151a';
  ctx.lineWidth = 2;
  for (let grateX = 0; grateX < canvas.width; grateX += 24) {
    ctx.beginPath();
    ctx.moveTo(grateX, ground);
    ctx.lineTo(grateX, canvas.height);
    ctx.stroke();
  }
  ctx.fillStyle = '#fdd835';
  for (let stripeX = 0; stripeX < canvas.width; stripeX += 40) {
    ctx.beginPath();
    ctx.moveTo(stripeX, ground);
    ctx.lineTo(stripeX + 20, ground);
    ctx.lineTo(stripeX + 10, ground + 8);
    ctx.lineTo(stripeX - 10, ground + 8);
    ctx.closePath();
    ctx.fill();
  }

  // scrap piles on the floor: plates, gears, a broken robot head
  const drawGear = (gearX, gearY, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let tooth = 0; tooth < 16; tooth += 1) {
      const angle = (Math.PI * 2 * tooth) / 16;
      const toothRadius = tooth % 2 === 0 ? radius : radius * 0.78;
      ctx.lineTo(gearX + Math.cos(angle) * toothRadius, gearY + Math.sin(angle) * toothRadius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#11151a';
    ctx.beginPath();
    ctx.arc(gearX, gearY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  };
  ctx.fillStyle = '#2e363e';
  ctx.beginPath();
  ctx.moveTo(10, ground);
  ctx.lineTo(40, ground - 26);
  ctx.lineTo(90, ground - 18);
  ctx.lineTo(120, ground);
  ctx.closePath();
  ctx.fill();
  drawGear(58, ground - 22, 14, '#455a64');
  ctx.fillStyle = '#3e4a54';
  ctx.save();
  ctx.translate(900, ground - 12);
  ctx.rotate(-0.3);
  ctx.fillRect(-30, -10, 60, 16);
  ctx.restore();
  drawGear(960, ground - 14, 12, '#5d4037');
  ctx.fillStyle = '#546e7a';
  ctx.beginPath();
  ctx.arc(840, ground - 12, 14, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#101418';
  ctx.fillRect(830, ground - 20, 20, 6);

  // darkness vignette: the factory is barely lit
  const vignette = ctx.createRadialGradient(canvas.width / 2, ground - 120, 120, canvas.width / 2, ground - 120, canvas.width * 0.75);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStage() {
  if (selectedMap === 'alpha') {
    drawAlphaStage();
    return;
  }

  if (selectedMap === 'desert') {
    drawDesertStage();
    return;
  }

  if (selectedMap === 'neon') {
    drawNeonStage();
    return;
  }

  if (selectedMap === 'casino') {
    drawCasinoStage();
    return;
  }

  if (selectedMap === 'military') {
    drawMilitaryStage();
    return;
  }

  if (selectedMap === 'darkRoom') {
    drawDarkRoomStage();
    return;
  }

  if (selectedMap === 'fireArcade') {
    drawFireArcadeStage();
    return;
  }

  if (selectedMap === 'normalArcade') {
    drawNormalArcadeStage();
    return;
  }

  if (selectedMap === 'gamblerArcade') {
    drawGamblerArcadeStage();
    return;
  }

  if (selectedMap === 'gamblerAlley') {
    drawGamblerAlleyStage();
    return;
  }

  if (selectedMap === 'robotFactory') {
    drawRobotFactoryStage();
    return;
  }

  if (selectedMap === 'jesterRift') {
    drawJesterRiftStage();
    return;
  }

  if (selectedMap === 'cobaltAftermath') {
    drawCobaltAftermathStage();
    return;
  }

  if (selectedMap === 'arcaneLibrary') {
    drawArcaneLibraryStage();
    return;
  }

  if (selectedMap === 'clockTower') {
    drawClockTowerStage();
    return;
  }

  if (selectedMap === 'ancientRuins') {
    drawAncientRuinsStage();
    return;
  }

  if (selectedMap === 'jungle') {
    drawJungleStage();
    return;
  }

  drawFoundryStage();
}

function drawNormalArcadeStage() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, ground);
  skyGradient.addColorStop(0, '#240d18');
  skyGradient.addColorStop(1, '#7a2838');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#160b12';
  for (let x = 0; x < canvas.width; x += 78) {
    const buildingHeight = 90 + ((x * 7) % 110);
    ctx.fillRect(x, ground - buildingHeight - 36, 58, buildingHeight);
    ctx.fillStyle = '#f7b84b';
    for (let windowY = ground - buildingHeight - 18; windowY < ground - 52; windowY += 26) {
      ctx.fillRect(x + 12, windowY, 8, 10);
      ctx.fillRect(x + 36, windowY, 8, 10);
    }
    ctx.fillStyle = '#160b12';
  }

  ctx.fillStyle = '#311420';
  ctx.fillRect(0, ground - 36, canvas.width, 36);
  ctx.fillStyle = '#5a2430';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, ground - 10, canvas.width, 10);
  ctx.strokeStyle = 'rgba(255, 138, 160, 0.38)';
  ctx.lineWidth = 3;
  for (let x = -40; x < canvas.width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, ground + 20);
    ctx.lineTo(x + 76, canvas.height);
    ctx.stroke();
  }
  ctx.fillStyle = '#e14b61';
  ctx.fillRect(390, ground - 34, 244, 7);
}

function drawFireArcadeStage() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, ground);
  skyGradient.addColorStop(0, '#082033');
  skyGradient.addColorStop(0.48, '#4d7f9f');
  skyGradient.addColorStop(1, '#d9f5ff');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.beginPath();
  ctx.arc(824, 96, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 238, 170, 0.32)';
  ctx.beginPath();
  ctx.arc(824, 96, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#17324a';
  ctx.beginPath();
  ctx.moveTo(-90, ground - 18);
  ctx.lineTo(130, 170);
  ctx.lineTo(348, ground - 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#274e68';
  ctx.beginPath();
  ctx.moveTo(190, ground - 18);
  ctx.lineTo(498, 104);
  ctx.lineTo(778, ground - 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1a3b57';
  ctx.beginPath();
  ctx.moveTo(620, ground - 18);
  ctx.lineTo(858, 150);
  ctx.lineTo(canvas.width + 92, ground - 18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f4fbff';
  ctx.beginPath();
  ctx.moveTo(76, 240);
  ctx.lineTo(130, 170);
  ctx.lineTo(184, 240);
  ctx.lineTo(146, 224);
  ctx.lineTo(118, 250);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(402, 192);
  ctx.lineTo(498, 104);
  ctx.lineTo(594, 194);
  ctx.lineTo(534, 174);
  ctx.lineTo(486, 220);
  ctx.lineTo(450, 176);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(784, 222);
  ctx.lineTo(858, 150);
  ctx.lineTo(934, 224);
  ctx.lineTo(888, 208);
  ctx.lineTo(850, 238);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(225, 246, 255, 0.78)';
  ctx.beginPath();
  ctx.moveTo(0, ground - 18);
  ctx.bezierCurveTo(152, ground - 82, 286, ground - 54, 414, ground - 88);
  ctx.bezierCurveTo(572, ground - 130, 704, ground - 32, canvas.width, ground - 96);
  ctx.lineTo(canvas.width, ground);
  ctx.lineTo(0, ground);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(121, 158, 178, 0.34)';
  for (let x = 28; x < canvas.width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 58);
    ctx.lineTo(x + 38, ground - 90);
    ctx.lineTo(x + 92, ground - 62);
    ctx.lineTo(x + 58, ground - 70);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#233544';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#dff7ff';
  ctx.fillRect(0, ground - 14, canvas.width, 14);
  ctx.fillStyle = '#9fd5e8';
  ctx.fillRect(0, ground - 6, canvas.width, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(0, ground + 18, canvas.width, 12);
  ctx.strokeStyle = 'rgba(12, 32, 48, 0.34)';
  ctx.lineWidth = 3;
  for (let x = -50; x < canvas.width; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 12);
    ctx.lineTo(x + 118, canvas.height);
    ctx.stroke();
  }

  const snowDrift = Math.floor(performance.now() / 38) % 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
  for (let x = -80; x < canvas.width + 80; x += 80) {
    const yOffset = (x * 17) % 190;
    ctx.beginPath();
    ctx.arc(x + snowDrift, 64 + yOffset, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAlphaStage() {
  ctx.fillStyle = '#1f1f1f';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#555';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
}

function drawRivets(y, color, spacing = 44) {
  ctx.fillStyle = color;
  for (let x = 18; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDarkRoomStage() {
  ctx.fillStyle = '#020202';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#070707';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let x = 0; x < canvas.width; x += 96) {
    ctx.fillRect(x, 0, 3, ground);
  }
}

function pushRectLight(lights, rectangle, radius, color) {
  pushLight(lights, {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2,
    radius,
    color,
  });
}

function pushFighterLight(lights, fighter, radius, color) {
  lights.push({
    x: fighter.position.x + fighter.width / 2,
    y: fighter.position.y + fighter.height / 2,
    radius,
    color,
  });
}

function pushNearbyFighterLights(lights, light) {
  [player1, player2].forEach((fighter) => {
    const fighterCenterX = fighter.position.x + fighter.width / 2;
    const fighterCenterY = fighter.position.y + fighter.height / 2;
    const distance = Math.hypot(light.x - fighterCenterX, light.y - fighterCenterY);
    if (distance <= light.radius + Math.max(fighter.width, fighter.height) * 0.45) {
      pushFighterLight(lights, fighter, Math.max(76, fighter.height * 0.72), light.color);
    }
  });
}

function pushLight(lights, light) {
  lights.push(light);
  pushNearbyFighterLights(lights, light);
}

function getDarkRoomLightSources() {
  const lights = [];

  [player1, player2].forEach((fighter) => {
    if (fighter.isAttacking) {
      pushRectLight(lights, fighter.attackArea, fighter.currentAttackDamage >= heavyAttackDamage ? 92 : 62, fighter.attackColor);
    }

    if (fighter.copycatShieldTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: fighter.height,
        color: hexToRgba(fighter.baseColor, 0.86),
      });
    }

    if (fighter.switcherArmorTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 110,
        color: 'rgba(253, 216, 53, 0.9)',
      });
    }

    if (fighter.switcherRedStrikeTimer > 0 && fighter.switcherRedStrikeArea) {
      pushRectLight(lights, fighter.switcherRedStrikeArea, 120, 'rgba(239, 83, 80, 0.9)');
    }

    if (
      fighter.lightWarriorSpeedTimer > 0 ||
      fighter.lightWarriorSolarFlashTimer > 0 ||
      fighter.lightWarriorRadiantPunchCharging ||
      fighter.lightWarriorRadiantPunchReadyTimer > 0
    ) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: fighter.lightWarriorSolarFlashTimer > 0 ? 190 : fighter.lightWarriorRadiantPunchCharging ? 145 : 115,
        color: fighter.lightWarriorRadiantPunchCharging || fighter.lightWarriorRadiantPunchReadyTimer > 0
          ? 'rgba(255, 255, 255, 0.94)'
          : 'rgba(255, 235, 59, 0.92)',
      });
    }

    if (fighter.gamblerRollTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y - 24,
        radius: 94,
        color: 'rgba(253, 216, 53, 0.95)',
      });
    }

    if (fighter.gamblerLuckWaveTimer > 0) {
      const progress = getGamblerLuckWaveProgress(fighter.gamblerLuckWaveTimer, fighter);
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 92 + progress * 98,
        color: `rgba(102, 255, 128, ${0.9 * (1 - progress)})`,
      });
    }

    if (fighter.gamblerInvincibleTimer > 0) {
      const auraColors = getJackpotAuraColors(fighter);
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 190,
        color: auraColors.primary,
      });
    } else if (fighter.gamblerLuckBonus > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 72 + fighter.gamblerLuckBonus * 58,
        color: 'rgba(102, 187, 106, 0.62)',
      });
    }
  });

  fireballs.forEach((fireball) => pushRectLight(lights, fireball, 82, 'rgba(255, 179, 0, 0.95)'));
  fireBeams.forEach((fireBeam) => pushRectLight(lights, fireBeam, 150, 'rgba(255, 109, 0, 0.95)'));
  lightShots.forEach((lightShot) => pushRectLight(lights, lightShot, 86, 'rgba(255, 235, 59, 0.95)'));
  tankShells.forEach((tankShell) =>
    pushRectLight(lights, tankShell, tankShell.empowered ? 115 : 72, tankShell.empowered ? 'rgba(255, 235, 59, 0.95)' : 'rgba(201, 180, 88, 0.9)')
  );
  cowboyBullets.forEach((cowboyBullet) => pushRectLight(lights, cowboyBullet, cowboyBullet.fixedDamage ? 92 : 58, 'rgba(253, 216, 53, 0.92)'));
  sorcererOrbs.forEach((orb) => pushRectLight(lights, orb, 96, 'rgba(255, 23, 68, 0.95)'));
  sorcererGravityOrbs.forEach((orb) =>
    pushLight(lights, { x: orb.centerX, y: orb.centerY, radius: orb.width / 2 + 70, color: 'rgba(33, 150, 243, 0.88)' })
  );
  sorcererSecretOrbs.forEach((orb) =>
    pushLight(lights, { x: orb.centerX, y: orb.centerY, radius: orb.size / 2 + 95, color: 'rgba(186, 104, 200, 0.95)' })
  );

  return lights;
}

function drawRadialLight(light, alphaMultiplier = 1) {
  const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
  gradient.addColorStop(0, light.color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalAlpha = alphaMultiplier;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawDarkRoomLightingOverlay() {
  if (selectedMap !== 'darkRoom') return;

  const lights = getDarkRoomLightSources();
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-out';
  lights.forEach((light) => drawRadialLight({ ...light, color: 'rgba(255, 255, 255, 0.96)' }));
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  lights.forEach((light) => drawRadialLight(light, 0.44));
  ctx.restore();
}

function drawFoundryStage() {
  const meltdownVisual = isManaMeltdownMatch() && (manaMeltdown.activeFrames > 0 || manaMeltdown.alertFrames > 0);
  const glow = ctx.createLinearGradient(0, 0, 0, ground);
  if (meltdownVisual) {
    glow.addColorStop(0, '#2b1234');
    glow.addColorStop(0.5, '#5b1d1b');
    glow.addColorStop(1, '#ff6d00');
  } else {
    glow.addColorStop(0, '#1b1c23');
    glow.addColorStop(0.55, '#30211f');
    glow.addColorStop(1, '#5b2417');
  }
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(255, 111, 0, 0.18)';
  ctx.fillRect(0, ground - 128, canvas.width, 128);

  ctx.fillStyle = '#151515';
  ctx.fillRect(108, 86, 54, ground - 98);
  ctx.fillRect(806, 62, 64, ground - 74);
  ctx.fillStyle = '#2b2b2b';
  ctx.fillRect(94, 76, 82, 14);
  ctx.fillRect(790, 52, 96, 14);

  ctx.strokeStyle = '#3d3d3d';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(150, 128);
  ctx.lineTo(426, 250);
  ctx.lineTo(760, 148);
  ctx.stroke();

  ctx.fillStyle = '#ff8f00';
  ctx.fillRect(206, 238, 76, 18);
  ctx.fillRect(642, 214, 92, 16);
  ctx.fillStyle = 'rgba(255, 183, 77, 0.5)';
  ctx.fillRect(0, ground - 58, canvas.width, 26);

  if (meltdownVisual) {
    ctx.fillStyle = 'rgba(186, 104, 200, 0.2)';
    ctx.fillRect(0, 0, canvas.width, ground);
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.72)';
    ctx.lineWidth = 4;
    for (let x = 70; x < canvas.width; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, 90);
      ctx.lineTo(x + 46, 190);
      ctx.lineTo(x - 14, 286);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#2a1712';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#5f4b43';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#ff6d00';
  ctx.fillRect(72, ground + 24, 224, 9);
  ctx.fillRect(678, ground + 32, 258, 8);
  ctx.fillStyle = '#1b100d';
  ctx.fillRect(0, ground + 42, canvas.width, 34);
  drawRivets(ground - 6, '#1d1d1d');
}

function drawDesertStage() {
  const sunsetDuel = isDesertCowboyDuelVisualActive();
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (sunsetDuel) {
    sky.addColorStop(0, '#3b1d4f');
    sky.addColorStop(0.48, '#c75b39');
    sky.addColorStop(1, '#f0a64a');
  } else {
    sky.addColorStop(0, '#78b9df');
    sky.addColorStop(0.62, '#f0c76d');
    sky.addColorStop(1, '#d79545');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = sunsetDuel ? '#ff8a3d' : '#fdd835';
  ctx.beginPath();
  ctx.arc(sunsetDuel ? 812 : 846, sunsetDuel ? 172 : 86, sunsetDuel ? 58 : 50, 0, Math.PI * 2);
  ctx.fill();

  if (sunsetDuel) {
    ctx.fillStyle = 'rgba(255, 214, 128, 0.22)';
    ctx.fillRect(0, ground - 170, canvas.width, 170);
  }

  ctx.fillStyle = '#b8873f';
  ctx.beginPath();
  ctx.moveTo(0, ground - 12);
  ctx.lineTo(246, ground - 92);
  ctx.lineTo(512, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c99a43';
  ctx.beginPath();
  ctx.moveTo(410, ground - 12);
  ctx.lineTo(736, ground - 126);
  ctx.lineTo(canvas.width, ground - 12);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(96, 62, 31, 0.24)';
  ctx.lineWidth = 4;
  for (let y = ground - 92; y < ground - 14; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(240, y - 20, 520, y + 28, canvas.width, y - 8);
    ctx.stroke();
  }

  ctx.fillStyle = '#456145';
  ctx.fillRect(126, ground - 82, 12, 70);
  ctx.fillRect(116, ground - 56, 34, 10);
  ctx.fillRect(874, ground - 98, 14, 86);
  ctx.fillRect(852, ground - 66, 50, 10);

  ctx.fillStyle = '#72533c';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#e2b45a';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(255, 243, 176, 0.42)';
  ctx.fillRect(0, ground - 30, 250, 18);
  ctx.fillRect(760, ground - 30, canvas.width - 760, 18);
  ctx.strokeStyle = 'rgba(96, 62, 31, 0.35)';
  ctx.lineWidth = 3;
  [70, 150, 830, 920].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x - 46, ground - 21);
    ctx.bezierCurveTo(x - 18, ground - 34, x + 18, ground - 34, x + 46, ground - 21);
    ctx.stroke();
  });
  drawRivets(ground - 6, 'rgba(99, 65, 30, 0.55)', 58);
}

function drawNeonStage() {
  const arcaneVisual = isArcaneRiftMatch() && (arcaneRift.activeFrames > 0 || arcaneRift.alertFrames > 0);
  const prismCharge = Math.min(prismOverdrive.player1Uses, prismOverdrive.player2Uses);
  const prismVisual = isPrismOverdriveMatch() && (prismCharge > 0 || prismOverdrive.activeFrames > 0 || prismOverdrive.alertFrames > 0);
  const night = ctx.createLinearGradient(0, 0, 0, ground);
  if (prismVisual) {
    night.addColorStop(0, '#061521');
    night.addColorStop(0.48, '#10224a');
    night.addColorStop(1, '#07111f');
  } else if (arcaneVisual) {
    night.addColorStop(0, '#16051f');
    night.addColorStop(0.5, '#35124f');
    night.addColorStop(1, '#07111f');
  } else {
    night.addColorStop(0, '#080c17');
    night.addColorStop(0.5, '#111827');
    night.addColorStop(1, '#07111f');
  }
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, canvas.width, ground);

  const towers = [
    [42, 150, 88, 360],
    [174, 86, 74, 424],
    [318, 132, 108, 378],
    [568, 108, 96, 402],
    [732, 76, 88, 434],
    [872, 142, 112, 368],
  ];

  towers.forEach(([x, y, width, height], index) => {
    ctx.fillStyle = index % 2 === 0 ? '#101827' : '#141f31';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(34, 211, 238, 0.68)' : 'rgba(236, 72, 153, 0.62)';
    for (let wy = y + 22; wy < y + height - 20; wy += 34) {
      ctx.fillRect(x + 14, wy, width - 28, 5);
    }
  });

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(0, ground - 20, canvas.width, 5);
  ctx.fillStyle = 'rgba(34, 211, 238, 0.36)';
  ctx.fillRect(364, ground - 30, 296, 10);
  if (prismVisual) {
    ctx.fillStyle = 'rgba(253, 216, 53, 0.72)';
    const chargeWidth = Math.min(1, prismCharge / prismOverdriveRequiredUses) * 296;
    ctx.fillRect(364, ground - 40, chargeWidth, 6);
  }
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
  ctx.lineWidth = 2;
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 12);
    ctx.lineTo(canvas.width / 2, 176);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
  for (let y = ground - 22; y > 176; y -= 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  if (arcaneVisual) {
    ctx.strokeStyle = 'rgba(206, 147, 216, 0.62)';
    ctx.lineWidth = 4;
    for (let x = 84; x < canvas.width; x += 170) {
      ctx.beginPath();
      ctx.arc(x, 150 + (x % 3) * 22, 42, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawCasinoStage() {
  const royaleVisual = isCasinoRoyaleMatch() && (casinoRoyale.activeFrames > 0 || casinoRoyale.alertFrames > 0);
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (royaleVisual) {
    sky.addColorStop(0, '#071f10');
    sky.addColorStop(0.5, '#18351d');
    sky.addColorStop(1, '#061a12');
  } else {
    sky.addColorStop(0, '#120914');
    sky.addColorStop(0.5, '#2a1023');
    sky.addColorStop(1, '#061a12');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#240d18';
  ctx.fillRect(70, 96, 154, ground - 108);
  ctx.fillRect(800, 86, 154, ground - 98);
  ctx.fillStyle = '#3a1427';
  ctx.fillRect(92, 126, 110, 22);
  ctx.fillRect(822, 116, 110, 22);

  ctx.save();
  ctx.fillStyle = 'rgba(17, 17, 17, 0.84)';
  ctx.fillRect(336, 82, 352, 112);
  ctx.strokeStyle = royaleVisual ? '#66ff80' : '#fdd835';
  ctx.lineWidth = 6;
  ctx.strokeRect(336, 82, 352, 112);
  ctx.fillStyle = royaleVisual ? '#66ff80' : '#fdd835';
  ctx.font = '900 42px Courier New, monospace';
  ctx.textAlign = 'center';
  ['7', 'BAR', '7'].forEach((symbol, index) => {
    ctx.fillText(symbol, 410 + index * 102, 148);
  });
  ctx.restore();

  ctx.fillStyle = '#111';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#fdd835';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#39ff88';
  ctx.fillRect(0, ground - 22, canvas.width, 5);

  const tileWidth = canvas.width / 5;
  for (let index = 0; index < 5; index += 1) {
    const x = index * tileWidth;
    ctx.fillStyle = index % 2 === 0 ? '#4a0d1a' : '#101010';
    ctx.fillRect(x, ground, tileWidth, canvas.height - ground);
    ctx.strokeStyle = 'rgba(253, 216, 53, 0.42)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, ground, tileWidth, canvas.height - ground);
  }

  const luckyX = casinoLuckyTileIndex * tileWidth;
  ctx.fillStyle = royaleVisual ? 'rgba(102, 255, 128, 0.52)' : 'rgba(253, 216, 53, 0.5)';
  ctx.fillRect(luckyX, ground - 34, tileWidth, 34);
  ctx.fillStyle = '#fff';
  ctx.font = '900 28px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('777', luckyX + tileWidth / 2, ground - 10);

  ctx.fillStyle = 'rgba(239, 83, 80, 0.18)';
  for (let x = 28; x < canvas.width; x += 76) {
    ctx.beginPath();
    ctx.arc(x, ground + 42, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMilitaryStage() {
  const clashVisual = isTankClashMatch() && (tankClash.closeFrames > 0 || tankClash.active || tankClash.alertFrames > 0);
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (clashVisual) {
    sky.addColorStop(0, '#4d2e2e');
    sky.addColorStop(0.55, '#4a3f2d');
    sky.addColorStop(1, '#252f21');
  } else {
    sky.addColorStop(0, '#5d6b58');
    sky.addColorStop(0.55, '#3e4b36');
    sky.addColorStop(1, '#252f21');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(26, 34, 22, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, ground - 12);
  ctx.lineTo(120, ground - 102);
  ctx.lineTo(248, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(238, ground - 12);
  ctx.lineTo(472, ground - 152);
  ctx.lineTo(724, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(690, ground - 12);
  ctx.lineTo(898, ground - 118);
  ctx.lineTo(canvas.width, ground - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#273322';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#6f7652';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(73, 54, 28, 0.58)';
  ctx.fillRect(64, ground - 34, 218, 22);
  ctx.fillRect(714, ground - 34, 238, 22);
  if (clashVisual) {
    ctx.fillStyle = 'rgba(255, 23, 68, 0.18)';
    ctx.fillRect(0, 0, canvas.width, ground);
    ctx.fillStyle = '#ffeb3b';
    for (let x = 24; x < canvas.width; x += 92) {
      ctx.fillRect(x, ground - 26, 44, 8);
    }
  }

  ctx.fillStyle = '#26321f';
  ctx.fillRect(64, 272, 218, ground - 284);
  ctx.fillRect(714, 238, 238, ground - 250);
  ctx.fillStyle = '#1b2418';
  ctx.fillRect(86, 248, 174, 28);
  ctx.fillRect(736, 212, 194, 30);

  ctx.fillStyle = '#1d2419';
  ctx.fillRect(112, 318, 44, 56);
  ctx.fillRect(190, 318, 44, 56);
  ctx.fillRect(770, 292, 48, 60);
  ctx.fillRect(856, 292, 48, 60);

  ctx.fillStyle = '#7e865f';
  ctx.fillRect(350, ground - 92, 140, 80);
  ctx.fillStyle = '#111';
  ctx.fillRect(364, ground - 60, 112, 18);
  ctx.fillStyle = '#8f966c';
  ctx.fillRect(386, ground - 116, 66, 24);
  ctx.fillStyle = '#1b2418';
  ctx.fillRect(410, ground - 148, 16, 32);

  ctx.strokeStyle = 'rgba(17, 17, 17, 0.36)';
  ctx.lineWidth = 5;
  for (let x = -40; x < canvas.width; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 12);
    ctx.lineTo(x + 150, ground - 94);
    ctx.stroke();
  }
  drawRivets(ground - 6, '#20251b', 52);
}

function displayWinner(text, winner, loser) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (winner && loser) {
    drawVictoryTaunt(winner, loser);
  }
  victoryTitle.innerText = text;
}

function updateVictoryStats() {
  document.getElementById('p1DamageDealt').innerText = Math.round(fightStats.player1.damageDealt);
  document.getElementById('p2DamageDealt').innerText = Math.round(fightStats.player2.damageDealt);
  document.getElementById('p1HitsLanded').innerText = fightStats.player1.hitsLanded;
  document.getElementById('p2HitsLanded').innerText = fightStats.player2.hitsLanded;
  document.getElementById('p1SpecialsUsed').innerText = fightStats.player1.specialsUsed;
  document.getElementById('p2SpecialsUsed').innerText = fightStats.player2.specialsUsed;
  document.getElementById('p1SpecialsLanded').innerText = fightStats.player1.specialsLanded;
  document.getElementById('p2SpecialsLanded').innerText = fightStats.player2.specialsLanded;
  document.getElementById('p1HealthLeft').innerText = Math.ceil(Math.max(0, player1.health));
  document.getElementById('p2HealthLeft').innerText = Math.ceil(Math.max(0, player2.health));
  fightDuration.innerText = formatFightDuration(performance.now() - fightStartedAt);
}

function updateFightAchievements(winnerPlayer, fightTime) {
  if (!winnerPlayer) return;
  if (isArcadeBossFighter(winnerPlayer) && !isScammer(winnerPlayer)) return;

  unlockAchievement('firstWin');

  if (fightTime <= 30000) {
    unlockAchievement('fastWin');
  }

  if (winnerPlayer.health > 0 && winnerPlayer.health <= 10) {
    unlockAchievement('clutchWin');
  }

  if (winnerPlayer.health >= winnerPlayer.maxHealth) {
    unlockAchievement('flawlessWin');
  }

  if (getPlayerStats(winnerPlayer).specialsUsed >= 10) {
    unlockAchievement('specialist');
  }

  if (
    winnerPlayer.characterType === 'cowboy' &&
    selectedMap === 'desert' &&
    fightAchievementFlags.duelShotHitBy === winnerPlayer
  ) {
    unlockAchievement('perfectDuel');
  }

  if (
    winnerPlayer.characterType === 'reflecter' &&
    fightAchievementFlags.copiedAbilityUsedBy === winnerPlayer
  ) {
    unlockAchievement('reflectedWin');
  }

  if (fightAchievementFlags.casinoRoyaleActive && winnerPlayer.characterType === 'gambler') {
    unlockAchievement('casinoRoyalty');
  }

  if (
    fightAchievementFlags.manaMeltdownActive &&
    (winnerPlayer.characterType === 'fireMaster' || winnerPlayer.characterType === 'sorcerer')
  ) {
    unlockAchievement('meltdownMaster');
  }

  if (
    fightAchievementFlags.manaMeltdownActive &&
    winnerPlayer.characterType === 'fireMaster' &&
    fightTime <= superFireMasterUnlockTimeMs &&
    winnerPlayer.health >= superFireMasterUnlockHealth
  ) {
    unlockAchievement('superFireMasterUnlocked');
  }

  if (fightAchievementFlags.tankClashActive && winnerPlayer.characterType === 'tank') {
    unlockAchievement('tankCommander');
  }

  if (
    winnerPlayer.characterType === 'chrono' &&
    fightAchievementFlags.timeStopDamageBy === winnerPlayer
  ) {
    unlockAchievement('timeExecutioner');
  }

  if (
    winnerPlayer === player1 &&
    botEnabled &&
    botDifficulty === 'hard' &&
    fightTime <= 25000 &&
    fightStats.player1.damageTaken <= 0
  ) {
    unlockAchievement('absoluteDominance');
  }

  if (
    winnerPlayer === player1 &&
    winnerPlayer.characterType === 'normal' &&
    botEnabled &&
    botDifficulty === 'hard' &&
    fightTime <= 20000 &&
    fightStats.player1.damageTaken <= 0
  ) {
    unlockAchievement('heroOfLight');
  }
}

function finishFight() {
  resetLightWarriorOmegaState(player1);
  resetLightWarriorOmegaState(player2);
  stopOmegaBattleTrack();
  if (normalArcadeActive && player1.health > 0 && player2.health <= 0 && normalArcadeEnemiesRemaining > 0) {
    awardCoins(100);
    startNextNormalArcadeEnemy();
    return;
  }

  if (isScammerArcadeFight() && !scammerOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startScammerOutroCutscene();
    return;
  }

  if (isJesterArcadeFight() && isShadowJester(player2) && !jesterOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startJesterOutroCutscene();
    return;
  }

  if (isJesterArcadeFight() && isShadowJester(player2) && !jesterLosePlayed && player1.health <= 0 && player2.health > 0) {
    startJesterLoseCutscene();
    return;
  }

  if (isJesterArcadeFight()) playJesterTrack('battle');

  const fightTime = pendingFightTime !== null ? pendingFightTime : performance.now() - fightStartedAt;
  pendingFightTime = null;
  if (selectedMap === 'darkRoom') {
    lockDarkRoomMap();
  }
  gameOver = true;
  restartPanel.classList.remove('hidden');
  const winnerPlayer =
    player1.health <= 0 && player2.health <= 0 ? null : player1.health > player2.health ? player1 : player2;
  const loserPlayer = winnerPlayer === player1 ? player2 : winnerPlayer === player2 ? player1 : null;
  const winner =
    player1.health <= 0 && player2.health <= 0
      ? 'Empate'
      : player1.health > player2.health
        ? 'Jugador 1 gana'
        : 'Jugador 2 gana';
  displayWinner(winner, winnerPlayer, loserPlayer);
  if (normalArcadeActive && isJesterArcadeFight() && isShadowJester(player2) && winnerPlayer === player2) scheduleJesterImpatience();
  updateVictoryStats();
  recordPersistentFightStatistics(winnerPlayer, fightTime);
  updateFightAchievements(winnerPlayer, fightTime);
  if (winnerPlayer) awardCoins((scammerShop.owned.doubleCoin ? 200 : 100) + (scammerShop.owned.coinMagnet ? 50 : 0));
  if (normalArcadeActive && winnerPlayer === player1) {
    awardArcadeReward('arcadeLevels', `${arcadeChapter}-${selectedNormalArcadeLevel}`, selectedNormalArcadeLevel * 250);
    if (selectedNormalArcadeLevel === getArcadeChapterLevelCount()) {
      awardArcadeReward('arcadeChapters', `${arcadeChapter}-01`, 3000);
      if (arcadeChapter === 'normal') unlockAchievement('normalArcadeCompleted');
      if (arcadeChapter === 'fireMaster') unlockAchievement('fireArcadeCompleted');
      if (arcadeChapter === 'gambler') unlockAchievement('gamblerArcadeCompleted');
    }
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 5) unlockAchievement('scammerDefeated');
    unlockNextNormalArcadeLevel(selectedNormalArcadeLevel);
  }
}

function resetKeys() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });
}

function resetFight() {
  stopJackpotTrack();
  resetLightWarriorOmegaState(player1);
  resetLightWarriorOmegaState(player2);
  syncLightWarriorOmegaMusic();
  gameOver = false;
  gameStarted = true;
  resetFightStats();
  botAttackCooldown = 0;
  fireballs = [];
  fireBeams = [];
  lightShots = [];
  superFireKamehamehaCharges = [];
  superFireKamehamehas = [];
  lightWarriorOmegaTransformation = null;
  tankShells = [];
  arcadeBossShockwaves = [];
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
  clearQfPendingSpecial(1);
  clearQfPendingSpecial(2);
  clearFrPendingSpecial(1);
  clearFrPendingSpecial(2);
  clearSorcererPendingSpecial(1);
  clearSorcererPendingSpecial(2);
  resetFightEvents();
  resetKeys();
  restartPanel.classList.add('hidden');
  applyBotDifficulty();
  player1.reset({ x: 120, y: 0 });
  player2.reset({ x: 820, y: 0 });
  jesterLuckStealTimer = 0;
  if (normalArcadeActive) configureNormalArcadeLevel();
  applyShopPerks();
  scammerOutroPlayed = false;
  jesterOutroPlayed = false;
  jesterLosePlayed = false;
  cancelJesterImpatience();
  pendingFightTime = null;
  jesterFinal.active = false;
  jesterWhiteFade = 0;
  if (isScammerArcadeFight() && !arcadeCutscene.active) {
    playScammerBattleTrack();
  } else {
    stopScammerBattleTrack();
  }
  if (isJesterArcadeFight() && !arcadeCutscene.active && !jesterIntro.active) {
    playJesterTrack('battle');
  } else {
    stopJesterTracks();
  }
  updateHealthBars();
  if (!animationId) {
    animate();
  }
}

function returnToMenu() {
  cancelJesterImpatience();
  jesterLuckStealTimer = 0;
  jesterFinal.active = false;
  jesterWhiteFade = 0;
  stopScammerBattleTrack();
  stopJesterTracks();
  jesterIntro.active = false;
  arcadeCutscene.active = false;
  document.body.classList.remove('arcade-cutscene');
  const shouldConsumeDarkRoom = selectedMap === 'darkRoom';
  if (gameStarted && !gameOver && !normalArcadeActive) {
    recordPersistentPlayTimeOnly(performance.now() - fightStartedAt);
  }
  deactivateBlindMode();
  gameOver = false;
  gameStarted = false;
  normalArcadeActive = false;
  normalArcadeEnemiesRemaining = 0;
  normalArcadeEnemyIndex = 0;
  resetFightStats();
  botAttackCooldown = 0;
  fireballs = [];
  fireBeams = [];
  lightShots = [];
  superFireKamehamehaCharges = [];
  superFireKamehamehas = [];
  lightWarriorOmegaTransformation = null;
  tankShells = [];
  arcadeBossShockwaves = [];
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
  clearQfPendingSpecial(1);
  clearQfPendingSpecial(2);
  clearFrPendingSpecial(1);
  clearFrPendingSpecial(2);
  clearSorcererPendingSpecial(1);
  clearSorcererPendingSpecial(2);
  resetFightEvents();
  resetKeys();
  restartPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  document.body.classList.add('menu-open');
  stopJackpotTrack();
  resetLightWarriorOmegaState(player1);
  resetLightWarriorOmegaState(player2);
  stopOmegaBattleTrack();
  startMenuMusic();
  titleScreen.classList.remove('hidden');
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
  eventGuideScreen.classList.add('hidden');
  characterSelectionPlayer = 1;
  characterSelectTitle.innerText = 'Personaje Jugador 1';
  characterScreen.classList.remove('selecting-player2');
  oldDaysScreen.classList.add('hidden');
  if (shouldConsumeDarkRoom) {
    lockDarkRoomMap();
  }
  player1.reset({ x: 120, y: 0 });
  player2.reset({ x: 820, y: 0 });
  updateHealthBars();
  if (!animationId) {
    animate();
  }
}

