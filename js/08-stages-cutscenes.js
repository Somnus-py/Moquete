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
  if (arcadeCutscene.scene === 'knightFarolTop') {
    // the second round, on top of the Gran Farol: against OMEGA LIGHT WARRIOR
    applyOmegaFinalForm(player2);
    player2.lightFinaleDone = true;
    player2.lightBoxIndex = 5;
    selectedMap = 'farolTop';
    player1.knightGlow = 0;
    player1.health = Math.max(player1.health, player1.maxHealth * 0.6);
    player1.position = { x: 230, y: ground - player1.height };
    player2.position = { x: 720, y: ground - player2.height };
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.isAttacking = false;
    });
    robotShots = [];
    lightShots = [];
    resetKeys();
    updateHealthBars();
    updateCombatHudIdentity();
    startOmegaKickFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightRiftAbduct') {
    // to be continued... (the level counts as done)
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ce93d8';
    ctx.font = 'italic 900 36px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CONTINUARA...', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
    player1.health = 1;
    player2.health = 0;
    player1.position = { x: -400, y: ground - player1.height };
    player2.position = { x: -400, y: ground - player2.height };
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightRiftAngry') {
    // straight into his final act
    startDodgeRound('jesterFinale', player2, player1);
    return;
  }
  if (arcadeCutscene.scene === 'knightFarolEnd') {
    // the end of the chapter's fight: nobody falls
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.knightPossessed = false;
    player1.knightGlow = 0;
    player2.health = 0;
    lightClashMusicFade = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFarolTopStage(0);
    player2.position = { x: 600, y: ground - player2.height };
    player1.position = { x: 380, y: ground - player1.height };
    player2.draw();
    player1.draw();
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightGuardFall') {
    // the level ends in silence
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.knightPossessed = false;
    player1.knightGlow = 0;
    player2.guardFallen = true;
    player2.health = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLanternHillStage(0);
    player2.draw();
    player1.draw();
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightSheriffStand') {
    // the last round begins: 25 seconds, stronger and faster, at 1 health
    const sheriff = player2;
    sheriff.sheriffStandActive = true;
    sheriff.sheriffStandTimer = sheriffStandFrames;
    sheriff.damageMultiplier *= sheriff.sheriffFurious ? sheriffFuriousDamageBoost : sheriffStandDamageBoost;
    sheriff.moveSpeed *= sheriff.sheriffFurious ? sheriffFuriousSpeedBoost : sheriffStandSpeedBoost;
    if (sheriff.sheriffFurious) sheriff.cowboyBurstCooldown = 0;
    sheriff.health = 1;
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.position.y = ground - fighter.height;
    });
    resetKeys();
    reflecterBattleMusic.restart = true;
    updateHealthBars();
    return;
  }
  if (arcadeCutscene.scene === 'knightSheriffEnd') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.knightGlow = 0;
    player2.sheriffStandActive = false;
    player2.sheriffStandOver = true;
    player2.health = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRobledalJailStage(0);
    player1.draw();
    player2.draw();
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightSpaVictory') {
    // leaving the hot springs... into an alley
    startKnightAlley();
    return;
  }
  if (arcadeCutscene.scene === 'knightAlley') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    selectedMap = 'robledalAlley';
    player1.knightGlow = 0;
    player2.health = 0;
    player2.position = { x: canvas.width + 400, y: ground - player2.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRobledalAlleyStage(0);
    player1.draw();
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'knightChefFury') {
    // the chef steps in: same fight, new opponent
    const chefX = arcadeCutscene.chefX || 600;
    player2.setCharacterType('normal', 'chefBoss');
    botDifficulty = 'hard';
    applyBotDifficulty();
    player2.health = player2.maxHealth;
    resetChefBoss(player2);
    player2.position = { x: Math.max(0, Math.min(canvas.width - player2.width, chefX)), y: ground - player2.height };
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.position.y = ground - fighter.height;
    });
    robotShots = [];
    resetKeys();
    reflecterBattleMusic.restart = true;
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (arcadeCutscene.scene === 'knightSpaIntro') {
    // after the "A PELEAR!" Mochi throws everything he has... at a Knight who does not even move
    startKnightMochiBarrage();
    return;
  }
  if (arcadeCutscene.scene === 'knightSetoIntro' || arcadeCutscene.scene === 'knightKidsTeam') {
    // Seto steps in: the next fight of level 3 (one game loop only)
    arcadeCutscene.setoActor = null;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    startNextNormalArcadeEnemy();
    return;
  }
  if (arcadeCutscene.scene === 'knightDarkDeal') {
    // the deal is made and the Orden Sombria leaves: the level is over
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player2.health = 0;
    player2.position = { x: canvas.width + 400, y: ground - player2.height };
    player1.knightGlow = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawVillageRoadStage();
    player1.draw();
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'chronoAscent') {
    // the fight goes on, now on the roof
    selectedMap = 'factoryRoof';
    player1.position.x = 260;
    player2.position.x = 680;
    player2.chronoAuraBoost = 0;
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.position.y = ground - fighter.height;
    });
    chronoRivalHistory = [];
    resetKeys();
    return;
  }
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
  if (arcadeCutscene.scene === 'ch6Chrono' || arcadeCutscene.scene === 'ch6Giant') {
    const toTitan = arcadeCutscene.scene === 'ch6Giant';
    chronoBlades = [];
    chronoZones = [];
    robotShots = [];
    player1.chronoTimeStopTimer = 0;
    player1.chronoSlowTimer = 0;
    selectedMap = 'factoryVault';
    if (toTitan) {
      ch6Stage = 'titan';
      configureFactoryRobotEnemy('titanUnit', 'hard');
    } else {
      ch6Stage = 'chrono';
      configureCh6Chrono();
    }
    player1.health = player1.maxHealth;
    player1.position = { x: 220, y: ground - player1.height };
    player2.position = { x: toTitan ? 640 : 700, y: ground - player2.height };
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
    });
    gameOver = false;
    gameStarted = true;
    restartPanel.classList.add('hidden');
    resetKeys();
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (arcadeCutscene.scene === 'ch7Intro') {
    arcadeCutscene.lightsOn = 4;
  }
  if (arcadeCutscene.scene === 'scamNeo') {
    scamChallenge.stage = 'neo';
    if (player2.secretVariant !== 'neoScammer') configureNeoScammer();
    player2.health = player2.maxHealth;
    player1.position = { x: 200, y: ground - player1.height };
    player2.position = { x: 660, y: ground - player2.height };
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
    });
    robotShots = [];
    gameOver = false;
    gameStarted = true;
    restartPanel.classList.add('hidden');
    reflecterBattleMusic.restart = true;
    resetKeys();
    updateHealthBars();
    updateCombatHudIdentity();
    return;
  }
  if (ch7MidFightScenes.includes(arcadeCutscene.scene)) {
    // back to the same fight (with the better armor after the mercy scene)
    if (arcadeCutscene.scene === 'ch7Mercy') grantOmegariusArmorPlus();
    if (arcadeCutscene.scene === 'ch7Slam') {
      endOmegariusSecret(player2);
      player2.judgeSwing = 0;
    }
    if (arcadeCutscene.scene === 'scamFinalStart') castScamFinalAct(player2, player1);
    [player1, player2].forEach((fighter) => {
      fighter.velocity.x = 0;
      fighter.velocity.y = 0;
      fighter.position.y = ground - fighter.height;
    });
    player2.hybridAbilityCooldown = 90;
    resetKeys();
    updateHealthBars();
    return;
  }
  if (arcadeCutscene.scene === 'ch6Outro') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.position = { x: 360, y: ground - player1.height };
    player1.attacksToTheRight = true;
    player2.position = { x: canvas.width + 400, y: ground - player2.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRobotFactoryStage();
    player1.draw();
    finishFight();
    if (ch6RunClean && unlockReflecterSecretLevel()) {
      showCustomToast('NIVEL SECRETO DESBLOQUEADO', 'Capitulo 4: sin caer ni una vez y sin usar el escudo. Algo se abrio en la Planta 7...');
      playSound('achievement');
    }
    ch6RunClean = false;
    return;
  }
  if (arcadeCutscene.scene === 'knightLight') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    // the last frame: Knight and Light Warrior in the forest
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEnchantedForestStage();
    player1.draw();
    player2.draw();
    // the beast was blown away: the level is won
    player2.setCharacterType('normal', 'mossBeast');
    player2.mossRescued = true;
    player2.health = 0;
    player2.position = { x: canvas.width + 400, y: ground - player2.height };
    normalArcadeEnemiesRemaining = 0;
    finishFight();
    playLightThemeOnResults();
    return;
  }
  if (arcadeCutscene.scene === 'knightOutro') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player2.knightKneel = true;
    player2.knightGlow = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMedievalCastleStage(1);
    player1.draw();
    player2.draw();
    finishFight();
    return;
  }
  if (arcadeCutscene.scene === 'chronoOutro') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    player1.position = { x: 360, y: ground - player1.height };
    player1.attacksToTheRight = true;
    player2.position = { x: canvas.width + 400, y: ground - player2.height };
    player2.chronoAuraBoost = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStage();
    player1.draw();
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
  omegariusFinal.active = false;
  scamFinal.active = false;
  dodgeRound.active = false;
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
  omegariusFinal.active = false;
  scamFinal.active = false;
  dodgeRound.active = false;
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
  if (line.menace && isPlayerReflecterUpgrade()) playSound('judgeCore');
  if (line.cameo) startGamblerCameo(line.cameo);
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
  if (['teleport', 'arrive', 'exorcism', 'loseLaugh', 'scriptedFinal', 'screenThrow', 'screenFly', 'robotsFall', 'explosions', 'ram', 'ascent', 'chronoDive', 'ch6Blast', 'ch6Surround', 'ch6Carry', 'ch6Titan', 'titanDeath', 'ch6Pinball', 'ch7Arrive', 'ch7Hammer', 'ch7Slam', 'neoTransform', 'knightArrive', 'forestArrive', 'lightBlast', 'villageArrive', 'plazaArrive', 'spaArrive', 'mochiBarrage', 'alleyWalk', 'jailArrive', 'guardArrive', 'strike', 'approach', 'spirits', 'gift', 'ascend', 'transform', 'slam', 'act', 'shaolinArrive'].includes(cutscene.phase)) return;
  // the first line of the Chrono intro leads into the explosions, not straight into the next line
  if (cutscene.scene === 'chronoIntro' && cutscene.phase === 'dialog' && cutscene.lineIndex === 0) {
    const firstLine = cutscene.lines[0];
    if (cutscene.typed < firstLine.text.length) {
      cutscene.typed = firstLine.text.length;
      return;
    }
    cutscene.phase = 'explosions';
    cutscene.frame = 0;
    cutscene.emote = null;
    return;
  }
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
    } else if (cutscene.scene === 'knightApproach' && cutscene.stage === 'warning') {
      // back to walking
      cutscene.phase = 'approach';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'knightRiftAbduct' || cutscene.scene === 'knightRiftAngry' || cutscene.scene === 'knightFarolEnd' || cutscene.scene === 'knightGuardFall' || cutscene.scene === 'knightSheriffStand' || cutscene.scene === 'knightSheriffEnd' || cutscene.scene === 'knightSpaVictory' || cutscene.scene === 'knightAlley' || cutscene.scene === 'knightOutro' || cutscene.scene === 'knightLight' || cutscene.scene === 'jesterTired' || cutscene.scene === 'jesterOutroCity' || cutscene.scene === 'jesterImpatient' || cutscene.scene === 'chronoAscent' || ch7MidFightScenes.includes(cutscene.scene)) {
      endArcadeCutscene();
    } else if (cutscene.scene === 'jesterAngry') {
      cutscene.phase = 'screenThrow';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'jesterLoseBored' || cutscene.scene === 'jesterLoseFinal') {
      beginJesterLosePhase(cutscene);
    } else if (cutscene.scene === 'ch6Intro') {
      cutscene.phase = 'ch6Surround';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'scamNeo' && cutscene.neoMock) {
      // "the premium model": the transformation
      cutscene.phase = 'neoTransform';
      cutscene.frame = 0;
      cutscene.emote = null;
      cutscene.mood = null;
    } else if (cutscene.scene === 'ch7Intro' && sameSceneLines(cutscene.lines, ch7IntroLines)) {
      // "EN GUAR..." - the hammer interrupts Chrono
      cutscene.phase = 'ch7Hammer';
      cutscene.frame = 0;
      cutscene.emote = null;
      cutscene.mood = null;
    } else if (cutscene.scene === 'ch7Intro') {
      cutscene.phase = 'versus';
      cutscene.frame = 0;
      cutscene.emote = null;
      playSound('cutsceneVersus');
    } else if (cutscene.scene === 'ch6Outro') {
      cutscene.phase = 'ch6Pinball';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'ch6Giant') {
      cutscene.phase = 'ch6Titan';
      cutscene.frame = 0;
      cutscene.emote = null;
    } else if (cutscene.scene === 'chronoOutro') {
      cutscene.phase = 'chronoDive';
      cutscene.frame = 0;
      cutscene.emote = null;
      cutscene.mood = null;
      cutscene.diveStartY = cutscene.scammerY;
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
  const isScammerLine = line.speaker === 'scammer' || line.speaker === 'jester' || line.speaker === 'neoScammer';
  const jesterColors = ['#ea80fc', '#fdd835', '#b388ff', '#ff4081'];
  const upgradedVoice = line.speaker === 'reflecter' && isPlayerReflecterUpgrade();
  const luckVoice = line.speaker === 'reflecter' && isPlayerReflecterMirrorLuck();
  const speakerAccents = {
    reflecter: '#26c6da',
    chrono: '#448aff',
    omegarius: '#ffca28',
    neoScammer: '#ff4081',
    knight: '#90caf9',
    lightWarrior: '#fff59d',
    divineGeneral: '#ffd54f',
    gangBoss: '#ef5350',
    mossBeast: '#9ccc65',
    darkKnight: '#b39ddb',
    lightNote: '#fff59d',
    celeste: '#4fc3f7',
    mochi: '#ef5350',
    chef: '#ffcc80',
    seto: '#66bb6a',
    darkKnightBoss: '#ff5252',
    lanternGuard: '#ffca28',
    shang: '#ffb300',
    darkWhisper: '#7e57c2',
    icedThug: '#80deea',
    iceMaster: '#4fc3f7',
    assembler: '#a1887f',
    chronoBoost: '#448aff',
    titan: '#78909c',
    normal: '#90a4ae',
    fireMaster: '#ff7043',
    cowboy: '#bcaaa4',
    switcher: '#66bb6a',
    sorcerer: '#b388ff',
    ghost: '#e0e0e0',
    monkey: '#a1887f',
  };
  const accent = upgradedVoice ? '#ff1744' : luckVoice ? '#39ff88' : speakerAccents[line.speaker] || (line.speaker === 'jester'
    ? jesterColors[Math.floor(performance.now() / 180) % jesterColors.length]
    : isScammerLine ? (line.mood === 'angry' || line.rage ? '#ff1744' : '#fdd835') : '#ba68c8');
  const menace = upgradedVoice && line.menace;
  const menaceStart = menace ? Math.max(0, 1 - arcadeCutscene.typed / 14) : 0;
  const shake = isScammerLine && (arcadeCutscene.mood === 'angry' || arcadeCutscene.mood === 'crazy') ? (Math.random() - 0.5) * 4
    : line.fear ? (Math.random() - 0.5) * 5
    : menaceStart > 0 ? (Math.random() - 0.5) * 10 * menaceStart : 0;
  if (menace) {
    const glow = 0.4 + Math.sin(performance.now() / 260) * 0.12;
    const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 120, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(90, 0, 10, ${glow})`);
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.25 + menaceStart * 0.3})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (menaceStart > 0) {
      ctx.fillStyle = `rgba(255, 23, 68, ${menaceStart * 0.25})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
  }
  const speakerNames = { gambler: 'GAMBLER', scammer: 'SCAMMER', jester: 'SHADOW JESTER', reflecter: isPlayerReflecterUpgrade() ? 'REFLECTER 2.0' : 'REFLECTER', chrono: 'CHRONO', omegarius: 'OMEGARIUS', neoScammer: 'NEO SCAMMER', knight: 'KNIGHT', lightWarrior: 'LIGHT WARRIOR', divineGeneral: 'DIVINE GENERAL', tank: 'LIVING TANK', gangBoss: 'JEFE DE LA BANDA', mossBeast: 'BESTIA DEL MUSGO', darkKnight: 'CABALLERO OSCURO', lanternGuard: 'GUARDIA DEL FAROL', shang: 'SHANG TING', darkWhisper: 'VOZ OSCURA', lightNote: 'NOTA DE L.W.', celeste: 'CELESTE', seto: 'SETO', mochi: 'MOCHI', chef: 'CHEF', darkKnightBoss: 'CAPITAN OSCURO', icedThug: 'MATON HELADO', iceMaster: 'ICE MASTER', assembler: 'ENSAMBLADORA', chronoBoost: 'CHRONO POTENCIADO', titan: 'PROYECTO TITAN', normal: 'NORMAL', fireMaster: 'FIRE MASTER', cowboy: 'COWBOY', switcher: 'SWITCHER', sorcerer: 'SORCERER', ghost: 'GHOST', monkey: 'MONKEI' };
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
  ctx.fillStyle = upgradedVoice ? '#ff5252' : luckVoice ? '#69f0ae' : '#fff';
  ctx.font = upgradedVoice ? '700 20px Courier New, monospace' : '700 20px Arial';
  ctx.textAlign = 'left';
  if (upgradedVoice) {
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = menace ? 12 : 6;
  }
  drawWrappedText(line.text.slice(0, Math.floor(arcadeCutscene.typed)), 84 + shake, 104, 850, 26);
  ctx.shadowBlur = 0;
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
  if (cutscene.phase === 'robotsFall' || cutscene.phase === 'explosions' || cutscene.phase === 'ram') {
    updateChronoIntroPhase(cutscene);
    return;
  }
  if (cutscene.phase === 'ascent') {
    updateChronoAscent(cutscene);
    return;
  }
  if (cutscene.phase === 'chronoDive') {
    updateChronoOutroDive(cutscene);
    return;
  }
  if (cutscene.scene === 'chronoOutro' && cutscene.phase === 'dialog') {
    // beaten, he struggles to stay in the air; on his angry lines the aura flares and he rises a bit
    const angryLine = cutscene.lines[cutscene.lineIndex] && cutscene.lines[cutscene.lineIndex].power;
    cutscene.scammerY = moveToward(cutscene.scammerY, angryLine ? 110 : 30, 3) + Math.sin(cutscene.frame / 5) * (angryLine ? 3 : 1);
    player2.chronoAuraBoost = angryLine ? 1 : 0;
  }
  if (cutscene.phase === 'titanDeath' || cutscene.phase === 'ch6Pinball') {
    updateCh6OutroPhase(cutscene);
    return;
  }
  if (cutscene.phase === 'ch7Arrive' || cutscene.phase === 'ch7Hammer') {
    updateCh7Phase(cutscene);
    return;
  }
  if (cutscene.phase === 'ch7Slam') {
    updateCh7SlamPhase(cutscene);
    return;
  }
  if (cutscene.phase === 'neoTransform') {
    updateScamNeoTransform(cutscene);
    return;
  }
  if (cutscene.phase === 'ch6Blast' || cutscene.phase === 'ch6Surround' || cutscene.phase === 'ch6Carry' || cutscene.phase === 'ch6Titan') {
    updateCh6Phase(cutscene);
    return;
  }
  if (cutscene.scene === 'ch6Intro' || cutscene.scene === 'ch6Chrono' || cutscene.scene === 'ch6Giant') {
    cutscene.scammerY = 72 + Math.sin(cutscene.frame / 12) * 6;
  }
  if (cutscene.scene === 'knightIntro' || cutscene.scene === 'knightOutro') updateKnightIntro(cutscene);
  if (cutscene.scene === 'knightForestIntro') updateKnightForestIntro(cutscene);
  if (cutscene.scene === 'knightLight') updateKnightLight(cutscene);
  if (cutscene.scene === 'knightVillageIntro' || cutscene.scene === 'knightDarkDeal') updateKnightVillage(cutscene);
  if (cutscene.scene === 'knightPlazaIntro' || cutscene.scene === 'knightSetoIntro' || cutscene.scene === 'knightKidsTeam') updateKnightPlaza(cutscene);
  if (cutscene.scene === 'knightSpaIntro' || cutscene.scene === 'knightMochiBarrage' || cutscene.scene === 'knightMochiChef' || cutscene.scene === 'knightChefFury') updateKnightSpa(cutscene);
  if (cutscene.scene === 'knightAlley') updateKnightAlley(cutscene);
  if (cutscene.scene === 'knightGuardIntro' || cutscene.scene === 'knightGuardFall') updateKnightGuard(cutscene);
  if (cutscene.scene === 'knightApproach') updateKnightApproach(cutscene);
  if (cutscene.scene === 'knightFarolTop') updateKnightFarolTop(cutscene);
  if (cutscene.scene === 'knightFarolEnd') updateKnightFarolEnd(cutscene);
  if (cutscene.scene === 'knightRiftIntro') updateKnightRiftIntro(cutscene);
  if (cutscene.scene === 'knightRiftAbduct') updateKnightRiftAbduct(cutscene);
  if (cutscene.scene === 'knightJailIntro' || cutscene.scene === 'knightSheriffStand' || cutscene.scene === 'knightSheriffEnd') updateKnightJail(cutscene);
  if (cutscene.scene === 'ch7Intro') {
    // Chrono floats (and flares on his power lines); Omegarius stands on the floor
    const chronoOnStage = player2.characterType === 'chrono';
    const currentLine = cutscene.lines[cutscene.lineIndex];
    cutscene.scammerY = chronoOnStage ? 72 + Math.sin(cutscene.frame / 12) * 6 : 0;
    player2.chronoAuraBoost = chronoOnStage && cutscene.phase === 'dialog' && currentLine && currentLine.power ? 1 : 0;
    // Omegarius's gift: the armor appears on Reflecter with a burst of gold sparks
    spawnOmegariusGiftSparks(cutscene, 'omegariusArmor', ch7OmegariusLines, 'armor');
  }
  if (ch7MidFightScenes.includes(cutscene.scene)) {
    cutscene.scammerY = 0;
    spawnOmegariusGiftSparks(cutscene, 'omegariusArmorPlus', ch7MercyLines, 'armorPlus');
  }
  if (cutscene.scene === 'chronoIntro' || cutscene.scene === 'chronoAscent') {
    // Chrono floats with his aura while he talks; it flares on his "power" lines
    cutscene.scammerY = 72 + Math.sin(cutscene.frame / 12) * 6;
    const currentLine = cutscene.lines[cutscene.lineIndex];
    player2.chronoAuraBoost = cutscene.phase === 'dialog' && currentLine && currentLine.power ? 1 : 0;
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

  if (cutscene.scene === 'chronoIntro') {
    drawRobotFactoryStage();
    drawChronoIntroWallHoles();
  } else if (cutscene.scene === 'chronoAscent') {
    drawFactoryRoofStage();
  } else if (cutscene.scene === 'chronoOutro') {
    drawStage();
  } else if (cutscene.scene === 'ch6Intro') {
    drawRobotFactoryStage();
    drawChronoIntroWallHoles();
  } else if (cutscene.scene === 'ch6Chrono' || cutscene.scene === 'ch6Giant') {
    drawFactoryVaultStage(true);
  } else if (cutscene.scene === 'ch6Outro') {
    drawFactoryVaultStage(false);
    drawChronoIntroWallHoles();
  } else if (cutscene.scene === 'ch7Intro') {
    drawFactoryHiddenStage(cutscene.lightsOn || 0);
    drawChronoIntroWallHoles();
  } else if (cutscene.scene === 'knightJailIntro' || cutscene.scene === 'knightSheriffStand' || cutscene.scene === 'knightSheriffEnd') {
    drawRobledalJailStage(cutscene.posterFocus || 0);
  } else if (cutscene.scene === 'shaolinIntro') {
    drawShaolinTempleStage();
    updateShaolinIntro(cutscene);
  } else if (cutscene.scene === 'knightRiftAbduct') {
    ctx.save();
    if (cutscene.fx && cutscene.fx.shake > 0) ctx.translate((Math.random() - 0.5) * cutscene.fx.shake, (Math.random() - 0.5) * cutscene.fx.shake);
    drawRiftAbductStage(cutscene);
    ctx.restore();
  } else if (cutscene.scene === 'knightRiftAngry') {
    drawFarolRiftStage(1, 0.3);
  } else if (cutscene.scene === 'knightRiftIntro') {
    // (only the stage shakes)
    ctx.save();
    if (cutscene.shake > 0) ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
    drawFarolRiftStage(cutscene.rift || 0, cutscene.gloom || 0);
    ctx.restore();
  } else if (cutscene.scene === 'knightFarolTop' || cutscene.scene === 'knightFarolEnd') {
    drawFarolTopStage(cutscene.flare || 0);
  } else if (cutscene.scene === 'knightApproach') {
    if (cutscene.phase === 'ascend' && cutscene.ascendP > 0) drawKnightAscentBackdrop(cutscene.ascendP);
    else if (cutscene.inSky) drawLightSkyStage();
    else drawFarolBridgeStage();
  } else if (cutscene.scene === 'knightGuardIntro' || cutscene.scene === 'knightGuardFall') {
    drawLanternHillStage(cutscene.darkEyes ? 1 : 0);
  } else if (cutscene.scene === 'knightAlley') {
    drawRobledalAlleyStage(cutscene.lanternFocus || 0);
  } else if (cutscene.scene === 'knightSpaIntro' || cutscene.scene === 'knightMochiBarrage' || cutscene.scene === 'knightMochiChef' || cutscene.scene === 'knightChefFury' || cutscene.scene === 'knightSpaVictory') {
    drawHotSpringsStage(!cutscene.chefOut);
  } else if (cutscene.scene === 'knightPlazaIntro' || cutscene.scene === 'knightSetoIntro' || cutscene.scene === 'knightKidsTeam') {
    drawVillagePlazaStage();
  } else if (cutscene.scene === 'knightVillageIntro' || cutscene.scene === 'knightDarkDeal') {
    drawVillageRoadStage();
  } else if (cutscene.scene === 'knightForestIntro' || cutscene.scene === 'knightLight') {
    drawEnchantedForestStage(cutscene.bushShake || 0);
  } else if (cutscene.scene === 'knightIntro' || cutscene.scene === 'knightOutro') {
    drawMedievalCastleStage(cutscene.scene === 'knightOutro' ? 1 : cutscene.knightGate || 0);
  } else if (['scamIntro', 'scamNeo', 'scamTired', 'scamFinalStart', 'scamFinalEnd'].includes(cutscene.scene)) {
    drawScamShowroomStage();
  } else if (ch7MidFightScenes.includes(cutscene.scene)) {
    drawFactoryHiddenStage(4);
    if (cutscene.scene === 'ch7Slam') drawOmegariusCrater(cutscene);
  } else if (cutscene.scene === 'jesterOutroCity') {
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
  player2.position.y = ground - player2.height - cutscene.scammerY - (cutscene.phase === 'dialog' || cutscene.phase === 'approach' ? walkBob(cutscene.scammerX, cutscene.scammerTargetX) : 0);
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
  } else if (cutscene.scene === 'jesterImpatient' || cutscene.scene === 'jesterAngry' || cutscene.scene === 'knightRiftAbduct') {
    // Gambler is gone; only Jester is on stage
  } else if (cutscene.scene === 'jesterLoseBored' && cutscene.phase === 'dialog') {
    drawDownedFighter(player1);
  } else {
    if (cutscene.phase === 'arrive') player1.attacksToTheRight = Math.floor(cutscene.frame / 22) % 2 === 0;
    player1.draw();
  }
  const scammerVisible = cutscene.phase !== 'walk' && cutscene.phase !== 'rattle' && cutscene.scene !== 'jesterOutroCity' && !(cutscene.scene === 'knightAlley' && !cutscene.darkOut) && !(cutscene.scene === 'knightRiftIntro' && !cutscene.jesterOut) && cutscene.scene !== 'knightRiftAbduct';
  if (scammerVisible) {
    const realRage = player2.scammerRage;
    const realColor = player2.color;
    player2.scammerRage = cutscene.rageVisible;
    player2.color = isShadowJester(player2) || player2.characterType !== 'gambler' ? realColor : cutscene.rageVisible ? '#e53935' : '#f2f2f2';
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

  if (cutscene.gamblerCameo) drawGamblerCameo(cutscene);
  if (cutscene.scene === 'knightLight') drawKnightLightFx(cutscene);
  if (cutscene.darkActors && cutscene.scene === 'knightVillageIntro') drawDarkKnightActors(cutscene);
  if (cutscene.setoActor && (cutscene.scene === 'knightSetoIntro' || cutscene.scene === 'knightKidsTeam')) cutscene.setoActor.draw();
  if (cutscene.scene === 'knightMochiBarrage' || cutscene.scene === 'knightMochiChef' || cutscene.scene === 'knightChefFury') drawMochiBarrageFx(cutscene);
  if (cutscene.scene === 'knightGuardFall') drawKnightGuardFallFx(cutscene);
  if (cutscene.scene === 'knightApproach') drawKnightApproachFx(cutscene);
  if (cutscene.scene === 'knightFarolTop') drawKnightFarolTopFx(cutscene);
  if (cutscene.scene === 'knightFarolEnd') drawKnightFarolEndFx(cutscene);
  if (cutscene.scene === 'knightRiftIntro') drawKnightRiftIntroFx(cutscene);
  if (cutscene.scene === 'knightRiftAbduct') drawKnightRiftAbductFx(cutscene);
  if (cutscene.scene === 'shaolinIntro') drawShaolinIntroFx(cutscene);

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
    // each side takes the color of who is fighting there
    const heroColor = getVersusColor(player1);
    const rivalColor = versusSceneColors[cutscene.scene] || getVersusColor(player2);
    const leftX = -canvas.width + slide * canvas.width;
    const rightX = canvas.width - slide * (canvas.width / 2);
    const leftBar = ctx.createLinearGradient(leftX, 0, leftX + canvas.width / 2, 0);
    leftBar.addColorStop(0, shadeVersusColor(heroColor, 0.45));
    leftBar.addColorStop(1, heroColor);
    ctx.fillStyle = leftBar;
    ctx.fillRect(leftX, 200, canvas.width / 2, 110);
    const rightBar = ctx.createLinearGradient(rightX, 0, rightX + canvas.width / 2, 0);
    rightBar.addColorStop(0, rivalColor);
    rightBar.addColorStop(1, shadeVersusColor(rivalColor, 0.45));
    ctx.fillStyle = rightBar;
    ctx.fillRect(rightX, 200, canvas.width / 2, 110);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(canvas.width / 2 - 2, 200, 4, 110 * slide);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.font = '900 38px Courier New, monospace';
    ctx.textAlign = 'center';
    const ch6Names = { ch6Intro: 'ROBOTS DE LA PLANTA 7', ch6Chrono: 'CHRONO', ch6Giant: 'PROYECTO TITAN', ch7Intro: 'OMEGARIUS', scamIntro: 'SCAMMER', scamNeo: 'NEO SCAMMER', knightIntro: 'KNIGHT', knightForestIntro: 'BESTIA DEL MUSGO', knightVillageIntro: 'ORDEN SOMBRIA', knightPlazaIntro: 'CELESTE', knightSetoIntro: 'SETO', knightKidsTeam: 'CELESTE Y SETO', knightSpaIntro: 'MOCHI', knightMochiBarrage: 'MOCHI POTENCIADO', knightChefFury: 'CHEF FURIOSO', knightJailIntro: 'SHERIFF COWBOY', knightGuardIntro: 'GUARDIA DEL FAROL', knightApproach: 'LIGHT WARRIOR', knightFarolTop: 'OMEGA LIGHT WARRIOR', knightRiftIntro: 'SHADOW JESTER', shaolinIntro: 'SHANG TING' };
    const versusName = ch6Names[cutscene.scene] || (cutscene.scene === 'chronoIntro' ? 'CHRONO' : cutscene.scene === 'jester' ? 'SHADOW JESTER' : cutscene.rageVisible ? 'SCAMMER FURIOSO' : 'SCAMMER');
    const scamScene = cutscene.scene === 'scamIntro' || cutscene.scene === 'scamNeo' || cutscene.scene === 'knightIntro' || cutscene.scene === 'knightForestIntro' || cutscene.scene === 'knightVillageIntro' || cutscene.scene === 'knightPlazaIntro' || cutscene.scene === 'knightSetoIntro' || cutscene.scene === 'knightKidsTeam' || cutscene.scene === 'knightSpaIntro' || cutscene.scene === 'knightMochiBarrage' || cutscene.scene === 'knightChefFury' || cutscene.scene === 'knightJailIntro' || cutscene.scene === 'knightGuardIntro' || cutscene.scene === 'knightApproach' || cutscene.scene === 'knightFarolTop' || cutscene.scene === 'knightRiftIntro' || cutscene.scene === 'shaolinIntro';
    const heroName = scamScene ? getCharacterDisplayName(player1).toUpperCase() : cutscene.scene === 'chronoIntro' || ch6Names[cutscene.scene] ? (isPlayerReflecterUpgrade() ? 'REFLECTER 2.0' : 'REFLECTER') : 'GAMBLER';
    ctx.strokeText(`${heroName}  VS  ${versusName}`, canvas.width / 2, 250);
    ctx.fillText(`${heroName}  VS  ${versusName}`, canvas.width / 2, 250);
    if (cutscene.frame > 40) {
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 30px Courier New, monospace';
      ctx.strokeText('A PELEAR!', canvas.width / 2, 292);
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

// ---------- Chapter 4 level 5: Chrono's entrance ----------
function isChronoRival(fighter) {
  return Boolean(fighter && fighter.characterType === 'chrono' && fighter.secretVariant === 'chronoRival');
}

function getChronoIntroDummies() {
  if (!chronoIntroDummies) {
    chronoIntroDummies = ['scrapDrone', 'rustyGuard', 'scrapDrone'].map((id, index) => {
      const dummy = new Fighter({ x: 0, y: 0, color: hybridEnemyTypes[id].color, attacksToTheRight: false });
      dummy.setCharacterType('normal');
      dummy.secretVariant = id;
      dummy.color = hybridEnemyTypes[id].color;
      if (hybridEnemyTypes[id].size) {
        dummy.width = hybridEnemyTypes[id].size.width;
        dummy.height = hybridEnemyTypes[id].size.height;
      }
      dummy.introX = 300 + index * 150;
      return dummy;
    });
  }
  return chronoIntroDummies;
}

function startChronoRivalCutscene() {
  chronoIntroDummies = null;
  arcadeCutscene.gamblerCameo = null;
  getChronoIntroDummies().forEach((dummy) => {
    dummy.destroyed = false;
  });
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'chronoIntro',
    lines: upgradeSceneLines(chronoRivalLines),
    phase: 'robotsFall',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: 100,
    gamblerTargetX: 100,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: canvas.width + 300,
    scammerY: 0,
    scammerTargetX: canvas.width + 300,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: { debris: [], blasts: [], holes: [], chunks: [], rubble: [] },
    ramChronoX: null,
    ramChronoY: null,
  });
  document.body.classList.add('arcade-cutscene');
  if (!animationId) animate();
}

const chronoIntroBlastPlan = [
  [8, 780, 260, 1],
  [28, 920, 350, 0],
  [48, 640, 160, 1],
  [70, 980, 190, 0],
  [92, 850, 430, 2],
  [112, 520, 140, 1],
];

function drawChronoIntroWallHoles() {
  const fx = arcadeCutscene.fx;
  if (!fx || !fx.holes) return;
  const time = performance.now() / 1000;
  // falling ceiling chunks that stay on the floor as rubble
  (fx.chunks || []).forEach((chunk) => {
    if (!chunk.landed) {
      chunk.vy += 0.6;
      chunk.y += chunk.vy;
      chunk.rot += chunk.spin;
      if (chunk.y + chunk.h / 2 >= ground) {
        chunk.landed = true;
        chunk.y = ground - chunk.h / 2;
        fx.rubble.push(chunk);
        spawnChronoIntroDebris(chunk.x, ground - 10, 6, ['#37474f', '#546e7a']);
        playKick({ volume: 0.16 });
      }
    }
  });
  fx.chunks = (fx.chunks || []).filter((chunk) => !chunk.landed);
  fx.holes.forEach((hole) => {
    const glow = ctx.createRadialGradient(hole.x, hole.y, 4, hole.x, hole.y, hole.r);
    glow.addColorStop(0, '#000');
    glow.addColorStop(0.7, '#05070d');
    glow.addColorStop(1, 'rgba(68, 138, 255, 0.35)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    for (let point = 0; point < 12; point += 1) {
      const angle = (Math.PI * 2 * point) / 12;
      const radius = hole.r * (0.75 + ((point * 7) % 5) * 0.08);
      ctx.lineTo(hole.x + Math.cos(angle) * radius, hole.y + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    // fire burning at the edge of each hole, plus smoke
    for (let flame = 0; flame < 5; flame += 1) {
      const flameX = hole.x - hole.r * 0.6 + flame * hole.r * 0.3;
      const flameHeight = 14 + Math.abs(Math.sin(time * 9 + flame * 1.7 + hole.x)) * 20;
      const baseY = hole.y + hole.r * 0.7;
      ctx.fillStyle = flame % 2 ? 'rgba(255, 112, 67, 0.85)' : 'rgba(255, 213, 79, 0.85)';
      ctx.beginPath();
      ctx.moveTo(flameX - 8, baseY);
      ctx.quadraticCurveTo(flameX, baseY - flameHeight * 1.4, flameX + 8, baseY);
      ctx.closePath();
      ctx.fill();
    }
    for (let puff = 0; puff < 3; puff += 1) {
      const rise = (time * 30 + puff * 40 + hole.x) % 120;
      ctx.fillStyle = `rgba(60, 64, 72, ${0.45 * (1 - rise / 120)})`;
      ctx.beginPath();
      ctx.arc(hole.x + Math.sin(time + puff) * 12, hole.y - hole.r * 0.5 - rise, 16 + rise / 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const drawChunk = (chunk) => {
    ctx.save();
    ctx.translate(chunk.x, chunk.y);
    ctx.rotate(chunk.rot);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(-chunk.w / 2, -chunk.h / 2, chunk.w, chunk.h);
    ctx.strokeStyle = '#11151a';
    ctx.lineWidth = 2;
    ctx.strokeRect(-chunk.w / 2, -chunk.h / 2, chunk.w, chunk.h);
    ctx.strokeStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(-chunk.w / 2, 0);
    ctx.lineTo(chunk.w / 2 + 8, -4);
    ctx.stroke();
    ctx.restore();
  };
  (fx.rubble || []).forEach(drawChunk);
  (fx.chunks || []).forEach(drawChunk);
}

function spawnChronoIntroDebris(x, y, count, colors) {
  const fx = arcadeCutscene.fx;
  for (let piece = 0; piece < count; piece += 1) {
    fx.debris.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 8 - 2,
      size: 3 + Math.random() * 6,
      color: colors[piece % colors.length],
      life: 60 + Math.random() * 30,
    });
  }
}

function drawChronoIntroEffects() {
  const fx = arcadeCutscene.fx;
  fx.blasts.forEach((blast) => {
    blast.life -= 1;
    const radius = blast.r * (1.4 - blast.life / 30);
    const glow = ctx.createRadialGradient(blast.x, blast.y, 0, blast.x, blast.y, radius);
    glow.addColorStop(0, `rgba(255, 255, 255, ${blast.life / 30})`);
    glow.addColorStop(0.4, `rgba(255, 171, 64, ${blast.life / 36})`);
    glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(blast.x - radius, blast.y - radius, radius * 2, radius * 2);
  });
  fx.blasts = fx.blasts.filter((blast) => blast.life > 0);
  fx.debris.forEach((piece) => {
    piece.life -= 1;
    piece.vy += 0.4;
    piece.x += piece.vx;
    piece.y = Math.min(ground - piece.size, piece.y + piece.vy);
    ctx.fillStyle = piece.color;
    ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
  });
  fx.debris = fx.debris.filter((piece) => piece.life > 0);
}

function drawChronoIntroFighter(fighter, x, y, facingRight) {
  const saved = { ...fighter.position };
  fighter.position = { x, y };
  fighter.attacksToTheRight = facingRight;
  fighter.isAttacking = false;
  fighter.draw();
  fighter.position = saved;
}

function updateChronoIntroPhase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  const dummies = getChronoIntroDummies();
  let shake = cutscene.shake || 0;
  let reflecterX = cutscene.gamblerX;
  let reflecterY = ground - player1.height;
  let chronoX = cutscene.scammerX;
  let chronoY = ground - player2.height - 72;

  if (cutscene.phase === 'robotsFall') {
    // Reflecter dashes through three defective robots like they were nothing
    const targets = [40, 95, 150];
    dummies.forEach((dummy, index) => {
      const hitFrame = targets[index];
      if (frame < hitFrame - 18) return;
      if (frame < hitFrame) reflecterX = moveToward(reflecterX, dummy.introX - player1.width - 4, 22);
      if (frame === hitFrame && !dummy.destroyed) {
        dummy.destroyed = true;
        shake = 8;
        fx.blasts.push({ x: dummy.introX + dummy.width / 2, y: ground - dummy.height / 2, r: 70, life: 30 });
        spawnChronoIntroDebris(dummy.introX + dummy.width / 2, ground - dummy.height / 2, 16, ['#78909c', '#8d6e63', '#ffee58', '#263238']);
        playSound('robotBoom');
        playSound('robotHit');
      }
    });
    cutscene.gamblerX = reflecterX;
    if (frame >= 200) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerTargetX = reflecterX;
      startCutsceneLine(0);
      return;
    }
  } else if (cutscene.phase === 'explosions') {
    // the back of the factory is torn apart: wall, ceiling, conveyor and lamp
    chronoIntroBlastPlan.forEach(([blastFrame, blastX, blastY, size]) => {
      if (frame === blastFrame) {
        shake = 26 + size * 8;
        fx.blasts.push({ x: blastX, y: blastY, r: 150 + size * 60, life: 34 });
        fx.holes.push({ x: blastX, y: blastY, r: 70 + size * 30 });
        spawnChronoIntroDebris(blastX, blastY, 34 + size * 16, ['#37474f', '#263238', '#546e7a', '#ffab40', '#ff7043']);
        // chunks of ceiling come crashing down
        for (let chunk = 0; chunk < 2 + size; chunk += 1) {
          fx.chunks.push({ x: blastX + (Math.random() - 0.5) * 220, y: 110, vy: 0, w: 30 + Math.random() * 50, h: 16 + Math.random() * 18, rot: Math.random() * 3, spin: (Math.random() - 0.5) * 0.2, landed: false });
        }
        playSound('robotBoom');
        playKick({ volume: 0.4 });
        if (size > 0) playSound('realityShatter');
      }
    });
    if (frame === 12) cutscene.emote = { who: 'gambler', symbol: '!', timer: 60 };
    if (frame === 60) {
      cutscene.emote = { who: 'gambler', symbol: '?!', timer: 60 };
      playSound('cutsceneQuestion');
    }
    if (frame >= 150) {
      cutscene.phase = 'ram';
      cutscene.frame = 0;
      playSound('chronoRam');
      return;
    }
  } else if (cutscene.phase === 'ram') {
    const startX = canvas.width + 80;
    const impactFrame = 18;
    const ceilingY = 146;
    if (frame <= impactFrame) {
      // Chrono streaks in from the broken wall
      chronoX = startX + (reflecterX + player1.width - 6 - startX) * (frame / impactFrame);
      chronoY = ground - player2.height - 20;
    } else if (frame <= 44) {
      // he carries Reflecter up to the ceiling
      const progress = (frame - impactFrame) / (44 - impactFrame);
      reflecterY = ground - player1.height - progress * (ground - player1.height - ceilingY);
      reflecterX = cutscene.gamblerX + progress * 40;
      chronoX = reflecterX + player1.width - 6;
      chronoY = reflecterY + 8;
    } else {
      // crash, then Reflecter drops and Chrono backs off, floating
      const fall = Math.min(1, (frame - 44) / 26);
      reflecterX = cutscene.gamblerX + 40;
      reflecterY = ceilingY + fall * fall * (ground - player1.height - ceilingY);
      chronoX = moveToward(cutscene.ramChronoX || reflecterX + player1.width, 700, 10);
      cutscene.ramChronoX = chronoX;
      chronoY = moveToward(cutscene.ramChronoY || ceilingY, ground - player2.height - 72, 6);
      cutscene.ramChronoY = chronoY;
    }
    if (frame === impactFrame) {
      shake = 14;
      playSound('robotHit');
      playKick({ volume: 0.3 });
    }
    if (frame === 44) {
      shake = 24;
      fx.blasts.push({ x: reflecterX + player1.width / 2, y: ceilingY, r: 90, life: 30 });
      spawnChronoIntroDebris(reflecterX + player1.width / 2, ceilingY, 26, ['#263238', '#37474f', '#90a4ae']);
      playSound('robotBoom');
      playKick({ volume: 0.36 });
    }
    if (frame === 70) {
      shake = 8;
      playSound('cutsceneLand');
    }
    if (frame >= 96) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerX = reflecterX;
      cutscene.gamblerTargetX = Math.min(reflecterX, 360);
      cutscene.scammerX = 700;
      cutscene.scammerTargetX = 660;
      cutscene.scammerY = 72;
      startCutsceneLine(1);
      return;
    }
  }
  cutscene.shake = shake * 0.88;

  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawRobotFactoryStage();
  drawChronoIntroWallHoles();
  dummies.forEach((dummy) => {
    if (dummy.destroyed) return;
    drawChronoIntroFighter(dummy, dummy.introX, ground - dummy.height, false);
  });
  const ramming = cutscene.phase === 'ram';
  drawChronoIntroFighter(player1, reflecterX, reflecterY, true);
  if (cutscene.phase === 'robotsFall' && frame % 55 < 10) {
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.7)';
    ctx.lineWidth = 3;
    for (let line = 0; line < 3; line += 1) {
      ctx.beginPath();
      ctx.moveTo(reflecterX - 10, reflecterY + 30 + line * 30);
      ctx.lineTo(reflecterX - 60, reflecterY + 30 + line * 30);
      ctx.stroke();
    }
  }
  if (ramming) {
    player2.chronoAuraBoost = 1;
    if (frame <= 20) {
      ctx.strokeStyle = 'rgba(68, 138, 255, 0.6)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(chronoX + player2.width, chronoY + player2.height / 2);
      ctx.lineTo(canvas.width + 100, chronoY + player2.height / 2);
      ctx.stroke();
    }
    drawChronoIntroFighter(player2, chronoX, chronoY, false);
  }
  drawChronoIntroEffects();
  if (cutscene.emote) {
    cutscene.emote.timer -= 1;
    const saved = { ...player1.position };
    player1.position = { x: reflecterX, y: reflecterY };
    drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
    player1.position = saved;
    if (cutscene.emote.timer <= 0) cutscene.emote = null;
  }
  ctx.restore();
  if (cutscene.phase === 'explosions') {
    chronoIntroBlastPlan.forEach(([blastFrame, , , size]) => {
      if (frame >= blastFrame && frame < blastFrame + 8) {
        ctx.fillStyle = `rgba(255, 224, 178, ${(0.3 + size * 0.15) * (1 - (frame - blastFrame) / 8)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    });
  }
}

// ------------------------------------------------ Chapter 4 level 6 ------------------------------------------------
function makeRobotActor(id) {
  const actor = new Fighter({ x: 0, y: 0, color: hybridEnemyTypes[id].color, attacksToTheRight: false });
  actor.setCharacterType('normal');
  actor.secretVariant = id;
  actor.color = hybridEnemyTypes[id].color;
  if (hybridEnemyTypes[id].size) {
    actor.width = hybridEnemyTypes[id].size.width;
    actor.height = hybridEnemyTypes[id].size.height;
  }
  return actor;
}

function ch6CutsceneBase(scene, lines, phase, extra = {}) {
  Object.assign(arcadeCutscene, {
    active: true,
    scene,
    lines,
    phase,
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: 300,
    gamblerTargetX: 300,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: 680,
    scammerY: 72,
    scammerTargetX: 680,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: { debris: [], blasts: [], holes: [], chunks: [], rubble: [] },
    // extras of a single scene never leak into the next one
    darkActors: null,
    gamblerCameo: null,
    lightFx: null,
    darkIn: false,
    monsterIn: false,
    musicOn: false,
    ...extra,
  });
  document.body.classList.add('arcade-cutscene');
  if (!animationId) animate();
}

function startCh6IntroCutscene() {
  // the robots are configured for the fight, but Chrono is the one on stage during the cutscene
  player2.setCharacterType('chrono');
  ch6CutsceneBase('ch6Intro', upgradeSceneLines(ch6IntroLines), 'ch6Blast', {
    gamblerX: canvas.width + 60,
    scammerX: canvas.width + 200,
    actors: ['scrapDrone', 'rustyGuard', 'clockworkReject', 'overloadUnit', 'scrapDrone', 'rustyGuard'].map(makeRobotActor),
  });
}

function startCh6ChronoCutscene() {
  ch6Stage = 'chrono';
  configureCh6Chrono();
  robotShots = [];
  ch6CutsceneBase('ch6Chrono', upgradeSceneLines(ch6ChronoLines), 'ch6Carry', { gamblerX: Math.max(80, Math.min(canvas.width - 200, player1.position.x)) });
  playSound('chronoRam');
}

function startCh6GiantCutscene() {
  chronoBlades = [];
  chronoZones = [];
  player1.chronoTimeStopTimer = 0;
  player1.chronoSlowTimer = 0;
  ch6CutsceneBase('ch6Giant', upgradeSceneLines(ch6GiantLines), 'dialog', {
    gamblerX: 240,
    gamblerTargetX: 240,
    scammerX: 700,
    scammerTargetX: 700,
    titanActor: makeRobotActor('titanUnit'),
  });
  playSound('cutsceneAngry');
  startCutsceneLine(0);
}

// the storage room on floor 4: emergency lights, crates, and the dormant giant in the back
function drawFactoryVaultStage(showDormantTitan) {
  const time = performance.now() / 1000;
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#0b0712');
  wall.addColorStop(1, '#1c1a14');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, ground);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  for (let panelX = 0; panelX < canvas.width; panelX += 128) ctx.strokeRect(panelX + 4, 60, 120, ground - 80);
  // spinning emergency lights
  [140, 880].forEach((lampX, index) => {
    const on = Math.sin(time * 5 + index * Math.PI) > 0;
    ctx.fillStyle = on ? '#ff1744' : '#4a0b0b';
    ctx.beginPath();
    ctx.arc(lampX, 40, 10, 0, Math.PI * 2);
    ctx.fill();
    if (on) {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.08)';
      ctx.fillRect(0, 0, canvas.width, ground);
    }
  });
  ctx.fillStyle = '#ffab40';
  ctx.font = '900 18px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PISO 4 - PROYECTO ?? - CLASIFICADO', canvas.width / 2, 110);
  // warning stripes around the giant's bay
  ctx.fillStyle = '#fdd835';
  for (let stripe = 330; stripe < 700; stripe += 30) {
    ctx.beginPath();
    ctx.moveTo(stripe, 140);
    ctx.lineTo(stripe + 15, 140);
    ctx.lineTo(stripe + 5, 152);
    ctx.lineTo(stripe - 10, 152);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#14101c';
  ctx.fillRect(340, 152, 350, ground - 152);
  if (showDormantTitan) {
    // the giant sleeping in its bay (dark, eyes off, cables plugged in)
    ctx.save();
    ctx.globalAlpha = 0.85;
    const bayX = 515;
    ctx.fillStyle = '#20262d';
    ctx.fillRect(bayX - 80, 220, 160, 300);
    ctx.fillRect(bayX - 50, 170, 100, 60);
    ctx.fillStyle = '#101418';
    ctx.fillRect(bayX - 40, 188, 80, 20);
    ctx.fillStyle = Math.sin(time * 1.3) > 0.97 ? '#ff1744' : '#2b0b0b';
    ctx.fillRect(bayX - 32, 192, 22, 12);
    ctx.fillRect(bayX + 10, 192, 22, 12);
    ctx.fillStyle = `rgba(179, 136, 255, ${0.15 + Math.sin(time * 1.5) * 0.08})`;
    ctx.beginPath();
    ctx.arc(bayX, 300, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 3;
    [[-80, 260], [80, 260], [-60, 360], [60, 360]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(bayX + dx, dy);
      ctx.quadraticCurveTo(bayX + dx * 2, dy - 80, bayX + dx * 2.2, 152);
      ctx.stroke();
    });
    ctx.restore();
  } else {
    // empty bay with broken cables
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 3;
    [[430, 152], [600, 152]].forEach(([cableX, cableY]) => {
      ctx.beginPath();
      ctx.moveTo(cableX, cableY);
      ctx.quadraticCurveTo(cableX + 10, cableY + 60 + Math.sin(time * 3) * 6, cableX - 6, cableY + 120);
      ctx.stroke();
    });
  }
  // crates and the capsule seen from the ascent
  [[40, 60], [110, 40], [900, 70]].forEach(([crateX, crateSize]) => {
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(crateX, ground - crateSize, crateSize, crateSize);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.strokeRect(crateX, ground - crateSize, crateSize, crateSize);
    ctx.beginPath();
    ctx.moveTo(crateX, ground - crateSize);
    ctx.lineTo(crateX + crateSize, ground);
    ctx.stroke();
  });
  ctx.fillStyle = '#263238';
  ctx.fillRect(760, ground - 210, 90, 210);
  ctx.fillStyle = 'rgba(179, 136, 255, 0.22)';
  ctx.fillRect(770, ground - 200, 70, 180);
  // floor
  ctx.fillStyle = '#1f1c16';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#fdd835';
  for (let stripeX = 0; stripeX < canvas.width; stripeX += 40) ctx.fillRect(stripeX, ground, 20, 5);
  const vignette = ctx.createRadialGradient(canvas.width / 2, ground - 150, 120, canvas.width / 2, ground - 150, canvas.width * 0.75);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateCh6Phase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  let shake = cutscene.shake || 0;

  if (cutscene.phase === 'ch6Blast') {
    // explosions on the right, Reflecter is thrown into the room, Chrono flies in after him
    [[6, 900, 260, 1], [22, 980, 380, 0], [38, 820, 160, 1]].forEach(([blastFrame, blastX, blastY, size]) => {
      if (frame === blastFrame) {
        shake = 26;
        fx.blasts.push({ x: blastX, y: blastY, r: 170 + size * 50, life: 34 });
        fx.holes.push({ x: blastX, y: blastY, r: 80 + size * 25 });
        spawnChronoIntroDebris(blastX, blastY, 40, ['#37474f', '#263238', '#ffab40', '#ff7043']);
        for (let chunk = 0; chunk < 3; chunk += 1) {
          fx.chunks.push({ x: blastX + (Math.random() - 0.5) * 160, y: 110, vy: 0, w: 30 + Math.random() * 40, h: 16 + Math.random() * 14, rot: Math.random() * 3, spin: (Math.random() - 0.5) * 0.2, landed: false });
        }
        playSound('robotBoom');
        playKick({ volume: 0.4 });
      }
    });
    let reflecterX = canvas.width + 60;
    let reflecterY = ground - player1.height;
    let spin = 0;
    if (frame >= 44 && frame < 80) {
      const progress = (frame - 44) / 36;
      reflecterX = 900 - progress * 620;
      reflecterY = ground - player1.height - Math.sin(progress * Math.PI) * 160;
      spin = progress * Math.PI * 3;
      if (frame === 44) playSound('chronoRam');
    } else if (frame >= 80) {
      reflecterX = 280 - Math.min(20, (frame - 80) * 1.5);
      if (frame === 80) {
        shake = 16;
        playSound('cutsceneLand');
        spawnChronoIntroDebris(290, ground - 10, 14, ['#37474f', '#90a4ae']);
      }
    }
    cutscene.gamblerX = reflecterX;
    let chronoX = canvas.width + 200;
    if (frame >= 90) chronoX = moveToward(cutscene.scammerX, 680, 14);
    cutscene.scammerX = chronoX;
    if (frame >= 150) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerTargetX = reflecterX;
      cutscene.scammerTargetX = 680;
      startCutsceneLine(0);
      return;
    }
    cutscene.shake = shake * 0.88;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    drawRobotFactoryStage();
    drawChronoIntroWallHoles();
    ctx.save();
    const centerX = reflecterX + player1.width / 2;
    const centerY = reflecterY + player1.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(spin);
    ctx.translate(-centerX, -centerY);
    drawChronoIntroFighter(player1, reflecterX, reflecterY, false);
    ctx.restore();
    if (frame >= 90) drawChronoIntroFighter(player2, chronoX, ground - player2.height - 72 + Math.sin(frame / 12) * 6, false);
    drawChronoIntroEffects();
    ctx.restore();
    return;
  }

  if (cutscene.phase === 'ch6Surround') {
    // Chrono flies away; six robots drop from the ceiling and surround Reflecter
    const actors = cutscene.actors;
    const slots = [60, 150, 470, 600, 760, 900];
    if (frame === 1) playSound('chronoRam');
    if (frame % 16 === 4 && frame < 100) {
      playSound('robotGlitch');
      playKick({ volume: 0.2 });
    }
    if (frame === 60) cutscene.emote = { who: 'gambler', symbol: '!', timer: 70 };
    if (frame >= 150) {
      cutscene.phase = 'versus';
      cutscene.frame = 0;
      playSound('cutsceneVersus');
      return;
    }
    ctx.save();
    const localShake = frame < 100 && frame % 16 < 4 ? 6 : 0;
    ctx.translate((Math.random() - 0.5) * localShake, (Math.random() - 0.5) * localShake);
    drawRobotFactoryStage();
    drawChronoIntroWallHoles();
    const reflecterX = cutscene.gamblerX;
    drawChronoIntroFighter(player1, reflecterX, ground - player1.height, Math.floor(frame / 30) % 2 === 0);
    actors.forEach((actor, index) => {
      const dropFrame = 10 + index * 14;
      if (frame < dropFrame) return;
      const fall = Math.min(1, (frame - dropFrame) / 14);
      const actorY = -actor.height + fall * fall * (ground - actor.height + actor.height);
      if (fall === 1 && !actor.landed) {
        actor.landed = true;
        spawnChronoIntroDebris(slots[index] + actor.width / 2, ground - 6, 8, ['#37474f', '#90a4ae']);
      }
      drawChronoIntroFighter(actor, slots[index], actorY, slots[index] < reflecterX);
    });
    const chronoY = ground - player2.height - 72 - frame * frame * 0.08;
    if (chronoY > -200) drawChronoIntroFighter(player2, cutscene.scammerX, chronoY, false);
    drawChronoIntroEffects();
    if (cutscene.emote) {
      cutscene.emote.timer -= 1;
      const saved = { ...player1.position };
      player1.position = { x: reflecterX, y: ground - player1.height };
      drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
      player1.position = saved;
      if (cutscene.emote.timer <= 0) cutscene.emote = null;
    }
    ctx.restore();
    return;
  }

  if (cutscene.phase === 'ch6Carry') {
    // Chrono slams into Reflecter and drags him through the wall into the storage room on floor 4
    const impact = 20;
    const wipe = 60;
    const land = 100;
    let reflecterX = cutscene.gamblerX;
    let chronoX = -120;
    const inVault = frame >= wipe;
    if (frame < impact) {
      chronoX = -120 + (reflecterX - 60 + 120) * (frame / impact);
    } else if (frame < wipe) {
      const progress = (frame - impact) / (wipe - impact);
      reflecterX = cutscene.gamblerX + progress * (canvas.width + 200 - cutscene.gamblerX);
      chronoX = reflecterX - player2.width + 6;
    } else if (frame < land) {
      const progress = (frame - wipe) / (land - wipe);
      reflecterX = -100 + progress * 360;
      chronoX = reflecterX - player2.width + 6;
    } else {
      reflecterX = 260;
      chronoX = moveToward(cutscene.carryChronoX || 200, 680, 16);
      cutscene.carryChronoX = chronoX;
    }
    if (frame === impact) {
      shake = 20;
      playSound('robotHit');
      playKick({ volume: 0.35 });
    }
    if (frame === wipe) {
      shake = 26;
      fx.debris = [];
      fx.blasts = [{ x: 0, y: ground - 80, r: 220, life: 30 }];
      spawnChronoIntroDebris(10, ground - 80, 40, ['#3e2723', '#4e342e', '#90a4ae']);
      playSound('robotBoom');
    }
    if (frame === land) {
      shake = 14;
      playSound('cutsceneLand');
    }
    if (frame >= 150) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerX = 260;
      cutscene.gamblerTargetX = 260;
      cutscene.scammerX = 680;
      cutscene.scammerTargetX = 680;
      startCutsceneLine(0);
      return;
    }
    cutscene.shake = shake * 0.88;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    if (inVault) drawFactoryVaultStage(true);
    else drawRobotFactoryStage();
    const chronoY = frame < land ? ground - player2.height - 10 : ground - player2.height - Math.min(72, (frame - land) * 3);
    drawChronoIntroFighter(player1, reflecterX, ground - player1.height - (frame >= impact && frame < land ? 20 : 0), false);
    drawChronoIntroFighter(player2, chronoX, chronoY, true);
    if (frame >= impact && frame < land) {
      ctx.strokeStyle = 'rgba(38, 198, 218, 0.5)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(chronoX, chronoY + player2.height / 2);
      ctx.lineTo(chronoX - 200, chronoY + player2.height / 2);
      ctx.stroke();
    }
    drawChronoIntroEffects();
    ctx.restore();
    if (frame >= wipe - 6 && frame < wipe + 10) {
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - Math.abs(frame - wipe) / 10})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  if (cutscene.phase === 'ch6Titan') {
    // Chrono leaves; the giant wakes up, pulls its cables and steps out of its bay
    const titan = cutscene.titanActor;
    const wake = 50;
    const stepEnd = 170;
    if (frame === 1) playSound('chronoRam');
    if (frame === wake) {
      playSound('titanRoar');
      shake = 20;
    }
    if (frame > wake && frame < stepEnd && (frame - wake) % 30 === 0) {
      shake = 18;
      playKick({ volume: 0.45 });
      spawnChronoIntroDebris(titan.walkX || 515, ground - 6, 12, ['#37474f', '#90a4ae', '#fdd835']);
    }
    if (frame === stepEnd - 20) playSound('titanRoar');
    if (frame >= stepEnd + 30) {
      cutscene.phase = 'versus';
      cutscene.frame = 0;
      playSound('cutsceneVersus');
      return;
    }
    cutscene.shake = shake * 0.88;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
    drawFactoryVaultStage(frame < wake);
    drawChronoIntroFighter(player1, cutscene.gamblerX, ground - player1.height, true);
    const chronoY = ground - player2.height - 72 - frame * frame * 0.1;
    if (chronoY > -200) drawChronoIntroFighter(player2, cutscene.scammerX, chronoY, false);
    if (frame >= wake) {
      const progress = Math.min(1, (frame - wake) / (stepEnd - wake));
      const scale = 0.72 + progress * 0.28;
      const centerX = 515 + progress * (640 + titan.width / 2 - 515);
      titan.walkX = centerX;
      titan.robotGlitchTimer = frame < wake + 20 ? 10 : 0;
      ctx.save();
      ctx.translate(centerX, ground);
      ctx.scale(scale, scale);
      drawChronoIntroFighter(titan, -titan.width / 2, -titan.height, false);
      ctx.restore();
      if (frame < wake + 30) {
        ctx.fillStyle = `rgba(255, 23, 68, ${0.35 * (1 - (frame - wake) / 30)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    drawChronoIntroEffects();
    ctx.restore();
  }
}

// ------------------------------------------------ Chapter 4 secret level 7 ------------------------------------------------
// Sector 0, under Planta 7: the bronze cell where Tempus Corp. kept Omegarius, with its round vault door open. lights = how many of its 4 gold lamps are on (0-4).
function drawFactoryHiddenStage(lights = 4) {
  const time = performance.now() / 1000;
  const glow = Math.max(0, Math.min(1, lights / 4));
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#050302');
  wall.addColorStop(1, glow > 0 ? '#1d130a' : '#0b0806');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, ground);
  // riveted bronze wall panels
  for (let panelX = 0; panelX < canvas.width; panelX += 128) {
    ctx.fillStyle = `rgba(93, 58, 26, ${0.18 + glow * 0.3})`;
    ctx.fillRect(panelX + 6, 150, 116, ground - 170);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX + 6, 150, 116, ground - 170);
    ctx.fillStyle = `rgba(255, 202, 40, ${0.08 + glow * 0.35})`;
    [[12, 156], [110, 156], [12, ground - 30], [110, ground - 30]].forEach(([dx, dy]) => ctx.fillRect(panelX + dx, dy, 4, 4));
  }
  // the round vault door in the back, wide open: where it was hiding
  const doorX = canvas.width / 2;
  const doorY = ground - 170;
  ctx.fillStyle = '#020101';
  ctx.beginPath();
  ctx.arc(doorX, doorY, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(160, 104, 40, ${0.35 + glow * 0.5})`;
  ctx.lineWidth = 16;
  ctx.stroke();
  ctx.strokeStyle = `rgba(255, 202, 40, ${0.15 + glow * 0.6})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(doorX, doorY, 160, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = `rgba(255, 213, 79, ${0.2 + glow * 0.6})`;
  for (let bolt = 0; bolt < 12; bolt += 1) {
    const angle = (bolt / 12) * Math.PI * 2;
    ctx.fillRect(doorX + Math.cos(angle) * 150 - 3, doorY + Math.sin(angle) * 150 - 3, 6, 6);
  }
  // the heavy door leaf, swung open to the side
  ctx.save();
  ctx.translate(doorX + 176, doorY);
  ctx.scale(0.26, 1);
  ctx.fillStyle = `rgba(110, 70, 30, ${0.5 + glow * 0.4})`;
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 202, 40, ${0.2 + glow * 0.5})`;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();
  // the empty pedestal and the broken restraints inside
  ctx.fillStyle = `rgba(74, 46, 22, ${0.5 + glow * 0.5})`;
  ctx.fillRect(doorX - 70, ground - 36, 140, 36);
  ctx.fillStyle = `rgba(255, 202, 40, ${0.2 + glow * 0.6})`;
  ctx.fillRect(doorX - 70, ground - 36, 140, 4);
  ctx.strokeStyle = `rgba(141, 110, 99, ${0.4 + glow * 0.4})`;
  ctx.lineWidth = 5;
  [[-60, -1], [60, 1]].forEach(([dx, side]) => {
    ctx.beginPath();
    ctx.moveTo(doorX + dx, doorY - 124);
    ctx.lineTo(doorX + dx + side * 8, doorY - 64 + Math.sin(time * 2 + side) * 3);
    ctx.stroke();
  });
  // plaque over the door
  ctx.fillStyle = 'rgba(40, 26, 12, 0.92)';
  ctx.fillRect(doorX - 170, 40, 340, 34);
  ctx.strokeStyle = `rgba(255, 202, 40, ${0.25 + glow * 0.6})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX - 170, 40, 340, 34);
  ctx.fillStyle = `rgba(255, 213, 79, ${0.25 + glow * 0.75})`;
  ctx.font = '900 16px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SECTOR 0 - CONTENCION', doorX, 63);
  // bronze pillars with gold light strips
  [40, canvas.width - 90].forEach((pillarX) => {
    ctx.fillStyle = '#2a1a0c';
    ctx.fillRect(pillarX, 90, 50, ground - 90);
    ctx.strokeStyle = '#120a04';
    ctx.lineWidth = 3;
    ctx.strokeRect(pillarX, 90, 50, ground - 90);
    ctx.fillStyle = `rgba(255, 202, 40, ${0.1 + glow * 0.8})`;
    ctx.shadowColor = '#ffca28';
    ctx.shadowBlur = 12 * glow;
    ctx.fillRect(pillarX + 22, 100, 6, ground - 110);
    ctx.shadowBlur = 0;
  });
  // hanging lamps, turned on one by one
  [180, 380, 644, 844].forEach((lampX, index) => {
    const on = Math.max(0, Math.min(1, lights - index));
    ctx.strokeStyle = '#1a1108';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lampX, 0);
    ctx.lineTo(lampX, 84);
    ctx.stroke();
    ctx.fillStyle = '#3e2a14';
    ctx.beginPath();
    ctx.moveTo(lampX - 26, 100);
    ctx.lineTo(lampX + 26, 100);
    ctx.lineTo(lampX + 12, 82);
    ctx.lineTo(lampX - 12, 82);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = on > 0 ? `rgba(255, 224, 130, ${0.3 + on * 0.7})` : '#2b1d0e';
    ctx.beginPath();
    ctx.arc(lampX, 102, 7, 0, Math.PI * 2);
    ctx.fill();
    if (on > 0) {
      const flicker = 0.9 + Math.sin(time * 23 + index) * 0.05;
      const cone = ctx.createLinearGradient(lampX, 100, lampX, ground);
      cone.addColorStop(0, `rgba(255, 202, 40, ${0.28 * on * flicker})`);
      cone.addColorStop(1, 'rgba(255, 202, 40, 0)');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(lampX - 20, 102);
      ctx.lineTo(lampX + 20, 102);
      ctx.lineTo(lampX + 120, ground);
      ctx.lineTo(lampX - 120, ground);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = `rgba(255, 236, 179, ${0.5 * on})`;
      for (let mote = 0; mote < 5; mote += 1) {
        const moteX = lampX + Math.sin(time * 0.7 + mote * 1.7 + index) * 70;
        const moteY = 140 + ((time * 14 + mote * 67 + index * 31) % (ground - 150));
        ctx.fillRect(moteX, moteY, 2, 2);
      }
    }
  });
  // floor: dark bronze plates with a gold edge
  ctx.fillStyle = '#1a1009';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = `rgba(255, 202, 40, ${0.2 + glow * 0.6})`;
  ctx.fillRect(0, ground, canvas.width, 3);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  for (let plateX = 0; plateX < canvas.width + 40; plateX += 96) {
    ctx.beginPath();
    ctx.moveTo(plateX, ground + 3);
    ctx.lineTo(plateX - 20, canvas.height);
    ctx.stroke();
  }
  // darkness while the lights are off
  const vignette = ctx.createRadialGradient(canvas.width / 2, ground - 150, 80, canvas.width / 2, ground - 150, canvas.width * 0.75);
  vignette.addColorStop(0, `rgba(0, 0, 0, ${0.5 * (1 - glow)})`);
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.85 - glow * 0.3})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// REFLECTER 2.0 in the chapter 4 arcade: extra lines where everyone reacts to his new black chassis
function isPlayerReflecterUpgrade() {
  return player1.characterType === 'reflecter' && isReflecterUpgrade(player1);
}

// full 2.0 versions of the chapter 4 dialogs: Reflecter is cold, mysterious and threatening ("menace" lines darken
// the screen in red), his enemies are afraid of him ("fear" lines tremble)... except Omegarius, his friend
const reflecter2Line = (text, extra = {}) => ({ speaker: 'reflecter', text, ...extra });
const reflecter2Threat = (text, extra = {}) => reflecter2Line(text, { menace: true, ...extra });
const reflecterUpgradeSceneVersions = new Map([
  [chronoRivalLines, [
    reflecter2Threat('Unidades de Tempus neutralizadas. Seis de seis... Esto no fue una pelea.'),
    chronoRivalLines[1],
    { speaker: 'chrono', text: 'E-espera... Que es ESO? Ese chasis negro... esos ojos... Vos no sos el espejito de siempre.', fear: true, emote: { who: 'scammer', symbol: '?!' } },
    reflecter2Threat('Actualizacion completa. REFLECTER 2.0. Prisma me construyo para terminar lo que empece.'),
    reflecter2Threat('Tempus esconde algo en esta fabrica. Me vas a decir que es... o lo busco entre tus restos.'),
    { speaker: 'chrono', text: 'N-no me asustas! ...Tempus tambien me mejoro. Ahora estoy MAS PREPARADO que nunca!', power: true, fear: true },
    reflecter2Line('Energia inestable. Nucleo sobrecargado. Tu mejora tiene fallas, Chrono.', { emote: { who: 'gambler', symbol: '...' } }),
    reflecter2Threat('Y las voy a encontrar todas.'),
    { speaker: 'chrono', text: 'D-deja de mirarme asi! Veamos cuanto aguanta tu espejo!', power: true, fear: true },
  ]],
  [chronoAscentLines, [
    chronoAscentLines[0],
    reflecter2Line('Daños minimos. Blindaje al 94%. Llevarme mas arriba no cambia nada.'),
    { speaker: 'chrono', text: 'P-por que no te quejas?! Por que no GRITAS?! ...No importa. El tiempo sigue siendo MIO!', power: true, fear: true, emote: { who: 'scammer', symbol: '?!' } },
    reflecter2Threat('Entonces te lo voy a quitar. Segundo a segundo.'),
  ]],
  [ch6IntroLines, [
    ch6IntroLines[0],
    reflecter2Line('Dos derrotas, Chrono. Tu sistema deberia haber aprendido algo.', { emote: { who: 'gambler', symbol: '...' } }),
    { speaker: 'chrono', text: 'UNIDADES DE LA PLANTA 7! TODAS! DESPIERTEN Y... Y ACABEN CON EL! RAPIDO!', mood: 'angry', fear: true, emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'chrono', text: 'Y yo voy a buscar mas poder. N-no porque te tenga miedo! ...Mucho mas poder.', fear: true },
    reflecter2Threat('Que vengan. Todas juntas. Ahorran tiempo.'),
  ]],
  [ch6ChronoLines, [
    { speaker: 'chrono', text: 'B-bienvenido al piso cuatro, espejito. La parte mas importante de toda la fabrica.', fear: true, emote: { who: 'scammer', symbol: '!' } },
    reflecter2Threat('Seis unidades destruidas. Te estas quedando sin nada que poner entre vos y yo, Chrono.'),
    { speaker: 'chrono', text: 'Jeje... je... Esta vez no tenes NI IDEA de lo que te espera.', fear: true },
    reflecter2Threat('Siempre decis lo mismo. Y siempre terminas en el piso.'),
  ]],
  [ch6GiantLines, [
    ch6GiantLines[0],
    reflecter2Line('...Estas temblando, Chrono. Que escondes?', { emote: { who: 'gambler', symbol: '...' } }),
    ch6GiantLines[2],
    reflecter2Threat('Cuarenta metros de acero. Un objetivo mas grande... es mas facil de acertar.'),
  ]],
  [ch6OutroLines, [
    reflecter2Threat('Proyecto Titan: destruido.'),
    reflecter2Line('Seis robots, Chrono y una maquina gigante. Sistemas al 70%... Todavia no termine.', { emote: { who: 'gambler', symbol: '...' } }),
  ]],
  [chronoOutroLines, [
    { ...chronoOutroLines[0], fear: true },
    reflecter2Threat('Te lo adverti, Chrono. Ninguna mejora de Tempus te iba a alcanzar.'),
    reflecter2Line('Un espejo devuelve lo que le tiras. Yo te devuelvo el doble.'),
    { speaker: 'chrono', text: 'N-no... no te acerques! NO TE ACERQUES!', fear: true, emote: { who: 'scammer', symbol: '!' } },
    chronoOutroLines[4],
    reflecter2Threat('Calculando trayectoria... Hacelo. Te espero abajo.'),
  ]],
  [ch7IntroLines, [
    reflecter2Line('Un sector sin registrar. Ni en los planos de Tempus... Interesante.', { emote: { who: 'gambler', symbol: '...' } }),
    { speaker: 'chrono', text: 'A-aca abajo nadie va a ver como te destruyo...', power: true, fear: true },
    reflecter2Threat('Tres derrotas. Sin energia. Sin robots. Y sin salida, Chrono.'),
    ch7IntroLines[3],
  ]],
  [ch7OmegariusLines, [
    ch7OmegariusLines[0],
    reflecter2Line('...Chrono cayo de un solo golpe. Quien sos? ...Tu diseño. Es igual al mio.', { emote: { who: 'gambler', symbol: '?' } }),
    ch7OmegariusLines[2],
    { speaker: 'omegarius', text: 'Y vos... chasis negro, ojos encendidos, nucleo prismatico. Un modelo nuevo! A los de Tempus seguro los asustas. A mi no, jeje.' },
    reflecter2Line('Prisma? Que hace un robot de Prisma escondido en la fabrica de Tempus?'),
    ch7OmegariusLines[4],
    ch7OmegariusLines[5],
    reflecter2Line('Eso no esta bien. Te voy a sacar de aca, Omegarius. Prisma tiene que saber que seguis vivo.'),
    ch7OmegariusLines[7],
    reflecter2Line('Un combate? ...Estamos del mismo lado.', { emote: { who: 'gambler', symbol: '?' } }),
    ch7OmegariusLines[9],
    reflecter2Line('Una armadura... Bronce sobre negro. Gracias, hermano. La voy a cuidar.', { armor: true, emote: { who: 'gambler', symbol: '!' } }),
    ch7OmegariusLines[11],
    reflecter2Line('Esta bien, Omegarius. Pero no me voy a contener.'),
  ]],
  [ch7MercyLines, [
    ch7MercyLines[0],
    ch7MercyLines[1],
    reflecter2Line('...Un sparring. Casi me partis en dos con ese martillo, hermano.', { emote: { who: 'gambler', symbol: '...' } }),
    ch7MercyLines[3],
    ch7MercyLines[4],
    reflecter2Line('Otra armadura... Sistemas estabilizados. Gracias, Omegarius.', { armorPlus: true, emote: { who: 'gambler', symbol: '!' } }),
    ch7MercyLines[6],
    reflecter2Line('Segundo asalto. Esta vez voy en serio.'),
  ]],
  [ch7ExcitedLines, [
    ch7ExcitedLines[0],
    ch7ExcitedLines[1],
    reflecter2Line('Todavia no viste todo lo que puedo hacer.'),
    ch7ExcitedLines[3],
  ]],
  [ch7SlamLines, [
    ch7SlamLines[0],
    ch7SlamLines[1],
    ch7SlamLines[2],
    reflecter2Line('Vos tampoco, hermano. Terminemos esto.', { emote: { who: 'gambler', symbol: '!' } }),
  ]],
  // after his ULTIMO ASALTO: he finally sees what the 2.0 can do... but he still thinks he is a bit stronger
  [ch7FinalEndLines, [
    ch7FinalEndLines[0],
    { speaker: 'omegarius', text: 'Aguantaste mi ULTIMO ASALTO entero... Esa version 2.0 es impresionante, de verdad. Prisma hizo algo increible con vos.', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'omegarius', text: 'Aunque... no te ofendas, eh, pero todavia creo que yo soy un poquito mas fuerte. Son años de practica con este martillo, jeje.' },
    reflecter2Line('...Algun dia lo comprobamos, hermano.', { emote: { who: 'gambler', symbol: '...' } }),
    { speaker: 'omegarius', text: 'Cuando quieras! Vamos... dame el ultimo golpe. Te lo ganaste.' },
    reflecter2Line('Gracias por el sparring, Omegarius. Aca va.', { emote: { who: 'gambler', symbol: '!' } }),
  ]],
]);

// Gambler's cameo in a cutscene: he runs in from the right, stands next to Chrono and runs away again
function startGamblerCameo(action) {
  const cutscene = arcadeCutscene;
  if (action === 'in') {
    const actor = new Fighter({ x: canvas.width + 80, y: 0, color: '#6a1b9a', attacksToTheRight: false });
    actor.setCharacterType('gambler');
    cutscene.gamblerCameo = { actor, x: canvas.width + 80, targetX: Math.min(canvas.width - 90, cutscene.scammerX + 110) };
    playSound('cutsceneSurprise');
  } else if (cutscene.gamblerCameo) {
    cutscene.gamblerCameo.targetX = canvas.width + 140;
    cutscene.gamblerCameo.leaving = true;
    playSound('cutsceneCash');
  }
}

function drawGamblerCameo(cutscene) {
  const cameo = cutscene.gamblerCameo;
  if (cutscene.scene !== 'chronoIntro') {
    cutscene.gamblerCameo = null;
    return;
  }
  const moving = Math.abs(cameo.x - cameo.targetX) > 1;
  cameo.x = moveToward(cameo.x, cameo.targetX, cameo.leaving ? 11 : 7);
  if (moving && cutscene.frame % 10 === 0) playSound('cutsceneStep');
  if (cameo.leaving && !moving) {
    cutscene.gamblerCameo = null;
    return;
  }
  const actor = cameo.actor;
  actor.position.x = cameo.x;
  actor.position.y = ground - actor.height - (moving ? Math.abs(Math.sin(performance.now() / 70)) * 6 : 0);
  actor.attacksToTheRight = cameo.leaving;
  actor.isAttacking = false;
  actor.draw();
  const line = cutscene.lines[cutscene.lineIndex];
  if (line && line.speaker === 'gambler' && cutscene.phase === 'dialog') {
    ctx.fillStyle = '#fdd835';
    ctx.font = '900 18px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('$', actor.position.x + actor.width / 2, actor.position.y - 12 - Math.abs(Math.sin(performance.now() / 150)) * 6);
  }
}

// MIRROR LUCK Reflecter: green, lucky and a bit of a gambler. Chrono can't understand why he is green,
// Reflecter expected to bump into Gambler... and Omegarius couldn't care less about the color
function isPlayerReflecterMirrorLuck() {
  return player1.characterType === 'reflecter' && !isReflecterUpgrade(player1) && isReflecterMirrorLuck(player1);
}

const mirrorLuckLine = (text, extra = {}) => ({ speaker: 'reflecter', text, ...extra });
const mirrorLuckChronoRivalLines = [
  mirrorLuckLine('Seis robots al piso! Eso fue un pleno, eh. Cuantos mas habra en esta fabrica? Que vengan, estoy con racha.', { emote: { who: 'gambler', symbol: '$' } }),
  chronoRivalLines[1],
  { speaker: 'chrono', text: '...Momento. VERDE?! Por que estas VERDE? Y que es ese 777 que tenes en el pecho?!', emote: { who: 'scammer', symbol: '?!' } },
  mirrorLuckLine('Eh? ...Para, para. Gambler no estaba por aca? Juraria que cuando entre escuche una tragamonedas.', { emote: { who: 'gambler', symbol: '?' } }),
  { speaker: 'chrono', text: 'Que Gambler ni que Gambler! Sos un espejo... VERDE. Tempus no me preparo para esto.', emote: { who: 'scammer', symbol: '?' } },
  mirrorLuckLine('Bueno, verde o no, te apuesto lo que quieras a que te vuelvo a ganar. Doble o nada, Chrono.', { emote: { who: 'gambler', symbol: '$' } }),
  chronoRivalLines[5],
  mirrorLuckLine('Uh... esa energia... Bueno! Cuanto mas alta la apuesta, mas grande el premio!', { emote: { who: 'gambler', symbol: '!' } }),
  chronoRivalLines[8],
];
// sometimes Gambler really shows up: Chrono offered him 20 dollars to help him beat Reflecter
const mirrorLuckGamblerCameoChance = 0.35;
const mirrorLuckChronoRivalCameoLines = [
  ...mirrorLuckChronoRivalLines.slice(0, 8),
  { speaker: 'gambler', text: 'EY, EY, EY! Llegue! Perdon la demora, Chrono!', cameo: 'in' },
  mirrorLuckLine('GAMBLER?! Sabia que estabas por aca! ...Espera. Por que te paras del lado de Chrono?', { emote: { who: 'gambler', symbol: '?!' } }),
  { speaker: 'gambler', text: 'Nada personal, espejito. Chrono me prometio 20 dolares si lo ayudaba a ganarte. VEINTE DOLARES!' },
  { speaker: 'chrono', text: 'Te dije que esperaras afuera! ...Y ni siquiera tengo los 20 dolares.', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  mirrorLuckLine('Gambler, te pago 40 si te vas ahora.', { emote: { who: 'gambler', symbol: '$' } }),
  { speaker: 'gambler', text: '...CUARENTA?! Trato hecho! Suerte, Chrono! Nos vemos, espejito!', cameo: 'out' },
  { speaker: 'chrono', text: 'GAMBLER! VOLVE ACA! ...Ugh. No importa. Lo hago yo solo.', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  mirrorLuckChronoRivalLines[8],
];
const reflecterMirrorLuckSceneVersions = new Map([
  [chronoRivalLines, mirrorLuckChronoRivalLines],
  [chronoAscentLines, [
    chronoAscentLines[0],
    mirrorLuckLine('Ugh... Que eran esas cosas ahi abajo? Parecian tragamonedas gigantes.', { emote: { who: 'gambler', symbol: '?' } }),
    chronoAscentLines[2],
    mirrorLuckLine('El tiempo sera tuyo, pero la suerte es mia. Aca arriba tambien te gano.'),
  ]],
  [ch6IntroLines, [
    ch6IntroLines[0],
    mirrorLuckLine('Todavia no aprendiste? Te gane dos manos seguidas.', { emote: { who: 'gambler', symbol: '...' } }),
    ch6IntroLines[2],
    { speaker: 'chrono', text: 'Y mientras te entretienen... yo voy a buscar mas poder. Y una explicacion de por que sos VERDE.' },
    mirrorLuckLine('Seis contra uno? Me gustan esas probabilidades... para mi.', { emote: { who: 'gambler', symbol: '$' } }),
  ]],
  [ch6ChronoLines, [
    ch6ChronoLines[0],
    mirrorLuckLine('Otra vez vos? Ni siquiera estas potenciado. Esto es plata facil.'),
    ch6ChronoLines[2],
    mirrorLuckLine('Siempre decis lo mismo, Chrono. Y al final la casa siempre gana.', { emote: { who: 'gambler', symbol: '$' } }),
  ]],
  [ch6GiantLines, [
    ch6GiantLines[0],
    mirrorLuckLine('Que... que estas por hacer? Si es otra ruleta, paso.', { emote: { who: 'gambler', symbol: '?' } }),
    ch6GiantLines[2],
    mirrorLuckLine('Bueno... vamos a lo grande. TODO AL VERDE!', { emote: { who: 'gambler', symbol: '!' } }),
  ]],
  [ch6OutroLines, [
    mirrorLuckLine('JACKPOT! LE GANE AL PROYECTO TITAN!', { emote: { who: 'gambler', symbol: '$' } }),
    mirrorLuckLine('Uff... seis robots, Chrono y esa cosa gigante. Hoy la suerte esta de mi lado... aunque estoy un poco cansado.', { emote: { who: 'gambler', symbol: '...' } }),
  ]],
  [chronoOutroLines, [
    chronoOutroLines[0],
    mirrorLuckLine('JA! Te lo dije, Chrono! Nunca apuestes contra un espejo con suerte!', { emote: { who: 'gambler', symbol: '$' } }),
    mirrorLuckLine('Podes tener toda la energia que quieras. La suerte no se compra.'),
    chronoOutroLines[3],
    chronoOutroLines[4],
    chronoOutroLines[5],
  ]],
  [ch7IntroLines, [
    ch7IntroLines[0],
    ch7IntroLines[1],
    mirrorLuckLine('Chrono, ya te gane tres veces. Te queda energia o te presto unas fichas?', { emote: { who: 'gambler', symbol: '$' } }),
    ch7IntroLines[3],
  ]],
  [ch7OmegariusLines, [
    ch7OmegariusLines[0],
    ch7OmegariusLines[1],
    ch7OmegariusLines[2],
    mirrorLuckLine('...Y no te sorprende que sea verde? Chrono casi se desmaya cuando me vio.', { emote: { who: 'gambler', symbol: '?' } }),
    { speaker: 'omegarius', text: 'Verde, azul, dorado... Los colores van y vienen, hermanito. Lo que importa es lo que hay adentro.' },
    ...ch7OmegariusLines.slice(3, 12),
    mirrorLuckLine('No entiendo nada de lo que esta pasando... pero me gusta la apuesta. Acepto!', { emote: { who: 'gambler', symbol: '$' } }),
  ]],
  [ch7FinalEndLines, [
    ch7FinalEndLines[0],
    ch7FinalEndLines[1],
    mirrorLuckLine('Gracias por el sparring, Omegarius. Esta mano es mia!', { emote: { who: 'gambler', symbol: '!' } }),
  ]],
]);

// the 2.0 or Mirror Luck version of a dialog (it remembers its original in baseLines)
function upgradeSceneLines(lines) {
  let version = null;
  if (isPlayerReflecterUpgrade()) version = reflecterUpgradeSceneVersions.get(lines);
  else if (isPlayerReflecterMirrorLuck()) {
    version = lines === chronoRivalLines && Math.random() < mirrorLuckGamblerCameoChance
      ? mirrorLuckChronoRivalCameoLines
      : reflecterMirrorLuckSceneVersions.get(lines);
  }
  if (!version) return lines;
  version.baseLines = lines;
  return version;
}

function sameSceneLines(current, lines) {
  return current === lines || Boolean(current && current.baseLines === lines);
}

// Omegarius's gifts appear on Reflecter (flag = which armor) on the dialog line marked with lineKey
function spawnOmegariusGiftSparks(cutscene, flag, lines, lineKey) {
  if (!sameSceneLines(cutscene.lines, lines) || player1[flag]) return;
  const given = cutscene.phase !== 'dialog' || cutscene.lines.slice(0, cutscene.lineIndex + 1).some((line) => line[lineKey]);
  if (!given) return;
  player1[flag] = true;
  playSound('judgeCore');
  for (let spark = 0; spark < 36; spark += 1) {
    cutscene.particles.push({
      x: cutscene.gamblerX + player1.width / 2,
      y: ground - player1.height / 2,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: -Math.random() * 9,
      size: 3 + Math.random() * 4,
      color: ['#ffca28', '#ffe082', '#6b4423', '#fff8e1'][spark % 4],
      life: 40 + Math.random() * 30,
    });
  }
}

// Reflecter is almost beaten: Omegarius stops the fight, explains it is only sparring and gives him a better armor
function startOmegariusMercyCutscene() {
  player2.omegariusMercyDone = true;
  robotShots = [];
  player2.omegariusBeamCharge = 0;
  player2.omegariusParryTimer = 0;
  player2.robotChargeTimer = 0;
  player2.omegariusSecretActive = false;
  player2.omegariusBeamSecret = false;
  player1.copycatShieldTimer = 0;
  ch6CutsceneBase('ch7Mercy', upgradeSceneLines(ch7MercyLines), 'dialog', {
    gamblerX: Math.max(40, Math.min(canvas.width - 200, player1.position.x)),
    gamblerTargetX: 280,
    scammerX: Math.max(40, Math.min(canvas.width - 120, player2.position.x)),
    scammerTargetX: 640,
    scammerY: 0,
  });
  startCutsceneLine(0);
}

// a dialog in the middle of the level 7 fight, with both fighters where they were (and some room between them)
function startMidFightCh7Cutscene(scene, lines, phase = 'dialog', extra = {}) {
  const reflecterX = Math.max(40, Math.min(canvas.width - 200, player1.position.x));
  const omegariusX = Math.max(40, Math.min(canvas.width - 120, player2.position.x));
  let omegariusTargetX = omegariusX;
  if (Math.abs(omegariusX - reflecterX) < 150) omegariusTargetX = reflecterX < canvas.width / 2 ? reflecterX + 230 : reflecterX - 230;
  player1.copycatShieldTimer = 0;
  ch6CutsceneBase(scene, lines, phase, {
    gamblerX: reflecterX,
    gamblerTargetX: reflecterX,
    scammerX: omegariusX,
    scammerTargetX: omegariusTargetX,
    scammerY: 0,
    ...extra,
  });
  if (phase === 'dialog') startCutsceneLine(0);
}

// at 250 health: Omegarius is impressed and gets fired up
function startOmegariusExcitedCutscene() {
  const omegarius = player2;
  omegarius.omegariusExcitedDone = true;
  omegarius.judgeOverdrive = true;
  omegarius.moveSpeed *= 1.2;
  omegarius.omegariusBeamCharge = 0;
  omegarius.omegariusParryTimer = 0;
  omegarius.robotChargeTimer = 0;
  robotShots = [];
  playSound('judgeOverdrive');
  startMidFightCh7Cutscene('ch7Excited', upgradeSceneLines(ch7ExcitedLines));
}

// the end of the secret ability: Omegarius catches the energy shot and slams it into the floor
function startOmegariusSlamCutscene(shot) {
  robotShots = [];
  startMidFightCh7Cutscene('ch7Slam', upgradeSceneLines(ch7SlamLines), 'ch7Slam', {
    ballX: shot.position.x + shot.width / 2,
    ballY: shot.position.y + shot.height / 2,
    crater: null,
  });
  arcadeCutscene.scammerTargetX = arcadeCutscene.scammerX;
}

function drawOmegariusCrater(cutscene) {
  if (!cutscene.crater) return;
  const craterX = cutscene.crater.x;
  const time = performance.now() / 1000;
  ctx.save();
  ctx.fillStyle = 'rgba(10, 6, 2, 0.9)';
  ctx.beginPath();
  ctx.ellipse(craterX, ground + 6, 120, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 202, 40, ${0.55 + Math.sin(time * 5) * 0.2})`;
  ctx.shadowColor = '#ffca28';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 3;
  [[-1, -0.2], [1, -0.15], [-0.6, -0.9], [0.5, -1], [0, -1.2]].forEach(([dirX, dirY], index) => {
    ctx.beginPath();
    ctx.moveTo(craterX, ground);
    ctx.lineTo(craterX + dirX * 60, ground + dirY * 30);
    ctx.lineTo(craterX + dirX * (110 + index * 12), ground + dirY * (70 + index * 8));
    ctx.stroke();
  });
  ctx.restore();
}

function updateCh7SlamPhase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  let shake = cutscene.shake || 0;
  const omegariusX = cutscene.scammerX;
  const reflecterX = cutscene.gamblerX;
  const omegariusFacesRight = reflecterX > omegariusX;
  const holdX = omegariusX + player2.width / 2 + (omegariusFacesRight ? 34 : -34);
  const aboveY = ground - player2.height - 70;
  const slamX = (omegariusX + player2.width / 2 + reflecterX + player1.width / 2) / 2;
  const lift = 28;
  const slam = 40;
  const end = 116;
  let ball = null;
  if (frame < lift) {
    // caught with one hand, lifted over its head
    const progress = frame / lift;
    ball = { x: cutscene.ballX + (holdX - cutscene.ballX) * Math.min(1, progress * 2), y: cutscene.ballY + (aboveY - cutscene.ballY) * progress, r: 34 + Math.sin(frame) * 3 };
    player2.judgeSwing = 0;
  } else if (frame < slam) {
    // ...and slammed into the floor
    const progress = (frame - lift) / (slam - lift);
    ball = { x: holdX + (slamX - holdX) * progress, y: aboveY + (ground - 30 - aboveY) * progress * progress, r: 34 };
    player2.judgeSwing = Math.max(1, 18 - progress * 17);
  } else {
    player2.judgeSwing = 0;
  }
  if (frame === 2) {
    playSound('judgeParry');
    cutscene.emote = { who: 'gambler', symbol: '!', timer: 50 };
  }
  if (frame === slam) {
    shake = 46;
    fx.blasts.push({ x: slamX, y: ground - 30, r: 330, life: 36 });
    spawnChronoIntroDebris(slamX, ground - 10, 60, ['#ffca28', '#ffe082', '#3e2a14', '#fff8e1', '#26c6da']);
    cutscene.crater = { x: slamX };
    playSound('judgeSlam');
    playSound('robotBoom');
    playKick({ volume: 0.5 });
  }
  if (frame === slam + 30) cutscene.emote = { who: 'gambler', symbol: '...', timer: 60 };
  if (frame >= end) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    startCutsceneLine(0);
    return;
  }
  cutscene.shake = shake * 0.88;
  ctx.save();
  ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  drawFactoryHiddenStage(4);
  drawOmegariusCrater(cutscene);
  drawChronoIntroFighter(player1, reflecterX, ground - player1.height, !omegariusFacesRight);
  drawChronoIntroFighter(player2, omegariusX, ground - player2.height, omegariusFacesRight);
  if (ball) {
    const glow = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.r * 2);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    glow.addColorStop(0.35, 'rgba(255, 213, 79, 0.9)');
    glow.addColorStop(1, 'rgba(255, 202, 40, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  drawChronoIntroEffects();
  drawCh7Emote(cutscene, reflecterX, ground - player1.height);
  ctx.restore();
  if (frame >= slam && frame < slam + 14) {
    ctx.fillStyle = `rgba(255, 248, 225, ${0.8 * (1 - (frame - slam) / 14)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function grantOmegariusArmorPlus() {
  player1.omegariusArmor = true;
  player1.omegariusArmorPlus = true;
  // +120 on top of whatever Reflecter had (first armor and shop perks included); the mercy scene only happens once per fight
  player1.setMaxHealth(player1.maxHealth + omegariusArmorPlusHealth);
  player1.health = player1.maxHealth;
  updateHealthBars();
}

function startCh7IntroCutscene() {
  // Omegarius is configured for the fight, but Chrono is the one on stage until the hammer hits him;
  // Reflecter only gets his armor later in the dialog
  player2.setCharacterType('chrono');
  player1.omegariusArmor = false;
  ch6CutsceneBase('ch7Intro', upgradeSceneLines(ch7IntroLines), 'ch7Arrive', { gamblerX: -120, scammerX: -200, lightsOn: 0 });
  playSound('chronoRam');
}

function drawCh7Emote(cutscene, x, y) {
  if (!cutscene.emote) return;
  cutscene.emote.timer -= 1;
  const saved = { ...player1.position };
  player1.position = { x, y };
  drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
  player1.position = saved;
  if (cutscene.emote.timer <= 0) cutscene.emote = null;
}

function updateCh7Phase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  let shake = cutscene.shake || 0;
  const floatY = ground - player2.height - 72;

  if (cutscene.phase === 'ch7Arrive') {
    // Chrono smashes through the wall dragging Reflecter into a part of the factory neither of them knew
    const release = 40;
    let reflecterX;
    let reflecterY = ground - player1.height;
    let reflecterFacing = false;
    let spin = 0;
    let chronoX;
    let chronoY;
    if (frame === 1) {
      shake = 26;
      fx.holes.push({ x: 0, y: ground - 90, r: 110 });
      fx.blasts.push({ x: 0, y: ground - 90, r: 240, life: 30 });
      spawnChronoIntroDebris(10, ground - 90, 40, ['#3e2a14', '#5d3a1a', '#90a4ae', '#ffca28']);
      playSound('robotBoom');
      playKick({ volume: 0.4 });
    }
    if (frame < release) {
      const progress = frame / release;
      reflecterX = -100 + progress * 380;
      reflecterY = ground - player1.height - 20;
      chronoX = reflecterX - player2.width + 6;
      chronoY = ground - player2.height - 20;
    } else {
      const tumble = Math.min(1, (frame - release) / 24);
      reflecterX = 280 + tumble * 40;
      reflecterY = ground - player1.height - Math.sin(tumble * Math.PI) * 50;
      spin = tumble < 1 ? tumble * Math.PI * 2 : 0;
      reflecterFacing = frame < 70 ? true : Math.floor((frame - 70) / 22) % 2 === 1;
      chronoX = moveToward(cutscene.scammerX, 620, 14);
      chronoY = moveToward(cutscene.arriveChronoY ?? ground - player2.height - 20, floatY, 5);
      cutscene.arriveChronoY = chronoY;
      if (frame === release + 24) {
        shake = 12;
        playSound('cutsceneLand');
        spawnChronoIntroDebris(reflecterX + 30, ground - 6, 12, ['#3e2a14', '#ffca28']);
      }
      if (frame === 84) {
        cutscene.emote = { who: 'gambler', symbol: '?', timer: 70 };
        playSound('cutsceneQuestion');
      }
    }
    cutscene.gamblerX = reflecterX;
    cutscene.scammerX = chronoX;
    if (frame >= 160) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerX = 320;
      cutscene.gamblerTargetX = 320;
      cutscene.scammerX = 620;
      cutscene.scammerTargetX = 620;
      cutscene.scammerY = 72;
      startCutsceneLine(0);
      return;
    }
    cutscene.shake = shake * 0.88;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
    drawFactoryHiddenStage(0);
    drawChronoIntroWallHoles();
    ctx.save();
    const centerX = reflecterX + player1.width / 2;
    const centerY = reflecterY + player1.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(spin);
    ctx.translate(-centerX, -centerY);
    drawChronoIntroFighter(player1, reflecterX, reflecterY, reflecterFacing);
    ctx.restore();
    player2.chronoAuraBoost = frame < release ? 1 : 0;
    drawChronoIntroFighter(player2, chronoX, chronoY, frame < release);
    if (frame < release) {
      ctx.strokeStyle = 'rgba(38, 198, 218, 0.5)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(chronoX, chronoY + player2.height / 2);
      ctx.lineTo(chronoX - 200, chronoY + player2.height / 2);
      ctx.stroke();
    }
    drawChronoIntroEffects();
    drawCh7Emote(cutscene, reflecterX, reflecterY);
    ctx.restore();
    return;
  }

  // ch7Hammer: a giant hammer flies out of the dark vault and sends Chrono flying through half the factory;
  // then Omegarius steps out of the cell where Tempus Corp. kept him
  const doorX = canvas.width / 2;
  const doorY = ground - 170;
  const throwStart = 26;
  const impact = 40;
  const hitStop = 12;
  const release = impact + hitStop;
  const ceilingHit = release + 16;
  const wallHit = ceilingHit + 14;
  const farCrashes = [wallHit + 16, wallHit + 32, wallHit + 48];
  const twinkle = wallHit + 64;
  const gone = wallHit + 80;
  const walkStart = gone + 10;
  const steps = [gone + 16, gone + 40, gone + 64];
  const lamps = [gone + 90, gone + 104, gone + 118, gone + 132];
  const coreOn = gone + 152;
  const end = coreOn + 56;
  const omegariusRestX = 660;
  const reflecterX = cutscene.gamblerX;
  let chronoX = cutscene.scammerX;
  let chronoY = floatY + Math.sin(frame / 12) * 6;
  let chronoSpin = 0;
  let hammer = null;
  const hammerSpin = frame * 0.55;

  if (frame < impact) {
    player2.chronoAuraBoost = 1;
    if (frame >= throwStart) {
      // it grows as it comes out of the dark: by the impact it is huge
      const progress = (frame - throwStart) / (impact - throwStart);
      const targetX = chronoX + player2.width / 2;
      const targetY = chronoY + player2.height / 2;
      hammer = { x: doorX + (targetX - doorX) * progress, y: doorY + (targetY - doorY) * progress, scale: 0.5 + progress * 1.2, angle: hammerSpin };
    }
    if (frame === 8) playSound('judgeLight');
    if (frame === throwStart) playSound('judgeThrow');
    cutscene.impactX = chronoX + player2.width / 2;
    cutscene.impactY = chronoY + player2.height / 2;
    cutscene.impactChronoX = chronoX;
    cutscene.impactChronoY = chronoY;
  } else if (frame < release) {
    // hit stop: everything freezes for an instant on the impact
    chronoX = cutscene.impactChronoX + (Math.random() - 0.5) * 6;
    chronoY = cutscene.impactChronoY + (Math.random() - 0.5) * 6;
    hammer = { x: cutscene.impactX + 30, y: cutscene.impactY, scale: 1.7, angle: -1.2 };
    if (frame === impact) {
      playSound('judgeHammerHit');
      playSound('jesterGiantSlam');
      playSound('robotBoom');
      playKick({ volume: 0.5 });
    }
  } else if (frame < gone) {
    player2.chronoAuraBoost = 0;
    if (frame === release) {
      shake = 50;
      fx.blasts.push({ x: cutscene.impactX, y: cutscene.impactY, r: 260, life: 34 });
      spawnChronoIntroDebris(cutscene.impactX, cutscene.impactY, 50, ['#ffca28', '#ffe082', '#0f172a', '#448aff', '#ffffff']);
      cutscene.emote = { who: 'gambler', symbol: '!!', timer: 70 };
      playSound('cutsceneSurprise');
    }
    if (frame < ceilingHit) {
      // up into the ceiling...
      const progress = (frame - release) / (ceilingHit - release);
      chronoX = cutscene.impactChronoX - progress * 280;
      chronoY = cutscene.impactChronoY - progress * (cutscene.impactChronoY - 20);
    } else if (frame < wallHit) {
      // ...bounces off it and crashes through the left wall...
      const progress = (frame - ceilingHit) / (wallHit - ceilingHit);
      chronoX = cutscene.impactChronoX - 280 - progress * (cutscene.impactChronoX - 280 + 140);
      chronoY = 20 + progress * 230;
    } else {
      chronoX = -400;
    }
    chronoSpin = -(frame - release) * 0.7;
    if (frame === ceilingHit) {
      shake = 34;
      const hitX = cutscene.impactChronoX - 280 + player2.width / 2;
      fx.holes.push({ x: hitX, y: 40, r: 80 });
      fx.blasts.push({ x: hitX, y: 40, r: 220, life: 30 });
      spawnChronoIntroDebris(hitX, 50, 34, ['#3e2a14', '#5d3a1a', '#90a4ae', '#ffca28']);
      for (let chunk = 0; chunk < 5; chunk += 1) {
        fx.chunks.push({ x: hitX + (Math.random() - 0.5) * 140, y: 60, vy: 0, w: 26 + Math.random() * 40, h: 14 + Math.random() * 16, rot: Math.random() * 3, spin: (Math.random() - 0.5) * 0.2, landed: false });
      }
      playSound('robotBoom');
      playKick({ volume: 0.45 });
    }
    if (frame === wallHit) {
      shake = 44;
      fx.holes.push({ x: 0, y: 270, r: 130 });
      fx.blasts.push({ x: 0, y: 270, r: 320, life: 36 });
      spawnChronoIntroDebris(10, 270, 50, ['#3e2a14', '#5d3a1a', '#90a4ae', '#ffca28']);
      playSound('robotBoom');
      playSound('realityShatter');
      playKick({ volume: 0.5 });
    }
    // and keeps going through the walls far away
    const farIndex = farCrashes.indexOf(frame);
    if (farIndex >= 0) {
      shake = 16 - farIndex * 5;
      playKick({ volume: 0.3 - farIndex * 0.08 });
      playNoise({ duration: 0.3, volume: 0.1 - farIndex * 0.025, filterFrequency: 500 });
    }
    if (frame === twinkle) {
      playSound('judgeTwinkle');
      cutscene.emote = { who: 'gambler', symbol: '...', timer: 60 };
    }
    // the hammer spins back into the vault
    if (frame < release + 44) {
      const progress = (frame - release) / 44;
      hammer = {
        x: cutscene.impactX + (doorX - cutscene.impactX) * progress,
        y: cutscene.impactY + (doorY - cutscene.impactY) * progress - Math.sin(progress * Math.PI) * 90,
        scale: 1.7 - progress * 1.25,
        angle: hammerSpin,
      };
    }
  } else if (frame === gone) {
    // from here on player2 is Omegarius
    configureFactoryRobotEnemy('omegarius', 'hard');
  }
  if (steps.includes(frame)) {
    shake = 12;
    playSound('judgeStep');
  }
  const lightsOn = lamps.reduce((count, lampFrame) => count + Math.max(0, Math.min(1, (frame - lampFrame) / 6)), 0);
  cutscene.lightsOn = lightsOn;
  if (lamps.includes(frame)) playSound('judgeLight');
  if (frame === coreOn) {
    shake = 16;
    playSound('judgeCore');
  }
  if (frame === coreOn + 8) cutscene.emote = { who: 'gambler', symbol: '?!', timer: 70 };
  if (frame >= end) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    cutscene.lines = upgradeSceneLines(ch7OmegariusLines);
    cutscene.lightsOn = 4;
    cutscene.gamblerTargetX = cutscene.gamblerX;
    cutscene.scammerX = omegariusRestX;
    cutscene.scammerTargetX = omegariusRestX;
    cutscene.scammerY = 0;
    startCutsceneLine(0);
    return;
  }

  const frozen = frame >= impact && frame < release;
  if (!frozen) cutscene.shake = shake * 0.88;
  ctx.save();
  if (!frozen) ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  drawFactoryHiddenStage(lightsOn);
  drawChronoIntroWallHoles();
  // a gold glint inside the dark vault right before the throw
  if (frame >= 8 && frame < throwStart + 4) {
    const glint = Math.max(0, 1 - Math.abs(frame - 16) / 12);
    ctx.fillStyle = `rgba(255, 224, 130, ${glint})`;
    ctx.beginPath();
    ctx.moveTo(doorX, doorY - 20);
    ctx.lineTo(doorX + 5, doorY - 5);
    ctx.lineTo(doorX + 20, doorY);
    ctx.lineTo(doorX + 5, doorY + 5);
    ctx.lineTo(doorX, doorY + 20);
    ctx.lineTo(doorX - 5, doorY + 5);
    ctx.lineTo(doorX - 20, doorY);
    ctx.lineTo(doorX - 5, doorY - 5);
    ctx.closePath();
    ctx.fill();
  }
  // Omegarius walks out of the vault; at first only its gold eyes can be seen
  if (frame > gone && player2.secretVariant === 'omegarius') {
    const walk = Math.max(0, Math.min(1, (frame - walkStart) / 70));
    const scale = 0.6 + walk * 0.4;
    const centerX = doorX + walk * (omegariusRestX + player2.width / 2 - doorX);
    const footY = ground - 40 * (1 - walk);
    const unitX = player2.width / 60;
    const unitY = player2.height / 120;
    ctx.save();
    ctx.translate(centerX, footY);
    ctx.scale(scale, scale);
    drawChronoIntroFighter(player2, -player2.width / 2, -player2.height, false);
    const dark = Math.max(0, 0.94 - lightsOn * 0.24);
    if (dark > 0) {
      const shadowRadius = player2.height * 0.95;
      const shadow = ctx.createRadialGradient(0, -player2.height / 2, 0, 0, -player2.height / 2, shadowRadius);
      shadow.addColorStop(0, `rgba(0, 0, 0, ${dark})`);
      shadow.addColorStop(0.62, `rgba(0, 0, 0, ${dark})`);
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadow;
      ctx.fillRect(-shadowRadius, -player2.height / 2 - shadowRadius, shadowRadius * 2, shadowRadius * 2);
    }
    const eyesAlpha = Math.min(1, Math.max(0, (frame - gone - 4) / 10)) * Math.min(1, dark * 2);
    if (eyesAlpha > 0) {
      // facing left, the eyes sit at x+18 and x+34 (in Reflecter units) of the body
      ctx.fillStyle = `rgba(255, 213, 79, ${eyesAlpha})`;
      ctx.shadowColor = '#ffca28';
      ctx.shadowBlur = 16;
      [18, 34].forEach((eyeX) => ctx.fillRect(-player2.width / 2 + eyeX * unitX, -player2.height + 20 * unitY, 8 * unitX, 8 * unitY));
      ctx.shadowBlur = 0;
    }
    ctx.restore();
    if (frame >= coreOn && frame < coreOn + 30) {
      // the core ignites: a gold shockwave from its chest
      const burst = (frame - coreOn) / 30;
      ctx.strokeStyle = `rgba(255, 224, 130, ${1 - burst})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX, footY - player2.height + 68 * unitY, 20 + burst * 260, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  drawChronoIntroFighter(player1, reflecterX, ground - player1.height, true);
  if (frame < wallHit + 2 && chronoX > -320) {
    ctx.save();
    const chronoCenterX = chronoX + player2.width / 2;
    const chronoCenterY = chronoY + player2.height / 2;
    ctx.translate(chronoCenterX, chronoCenterY);
    ctx.rotate(chronoSpin);
    ctx.translate(-chronoCenterX, -chronoCenterY);
    drawChronoIntroFighter(player2, chronoX, chronoY, false);
    ctx.restore();
    if (frame >= release) {
      // comet trail behind the flying Chrono
      ctx.strokeStyle = 'rgba(255, 224, 130, 0.55)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(chronoCenterX, chronoCenterY);
      ctx.lineTo(chronoCenterX + 160, chronoCenterY + (frame < ceilingHit ? 110 : -110));
      ctx.stroke();
    }
  }
  if (hammer) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 202, 40, 0.4)';
    ctx.lineWidth = 8 * hammer.scale;
    ctx.beginPath();
    ctx.arc(hammer.x, hammer.y, 50 * hammer.scale, hammer.angle - 1.6, hammer.angle);
    ctx.stroke();
    ctx.translate(hammer.x, hammer.y);
    ctx.rotate(hammer.angle);
    drawOmegariusHammer(0, 50 * hammer.scale, 0, hammer.scale, 1.5);
    ctx.restore();
  }
  if (!frozen) drawChronoIntroEffects();
  drawCh7Emote(cutscene, reflecterX, ground - player1.height);
  ctx.restore();
  if (frozen) {
    // manga impact frame: flash, radial lines and a huge PUM!!
    const local = frame - impact;
    ctx.fillStyle = local < 3 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 248, 225, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.75)';
    for (let line = 0; line < 28; line += 1) {
      const angle = (line / 28) * Math.PI * 2 + (line % 2) * 0.05;
      ctx.lineWidth = line % 3 === 0 ? 5 : 2;
      ctx.beginPath();
      ctx.moveTo(cutscene.impactX + Math.cos(angle) * 110, cutscene.impactY + Math.sin(angle) * 110);
      ctx.lineTo(cutscene.impactX + Math.cos(angle) * 900, cutscene.impactY + Math.sin(angle) * 900);
      ctx.stroke();
    }
    const pop = 1 + Math.max(0, (4 - local) / 6);
    ctx.translate(cutscene.impactX - 40, cutscene.impactY - 120);
    ctx.rotate(-0.12);
    ctx.scale(pop, pop);
    ctx.font = '900 92px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = '#ffca28';
    ctx.strokeText('PUM!!', 0, 0);
    ctx.fillText('PUM!!', 0, 0);
    ctx.restore();
  }
  if (frame >= release && frame < release + 8) {
    ctx.fillStyle = `rgba(255, 236, 179, ${0.5 * (1 - (frame - release) / 8)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (frame >= twinkle && frame < twinkle + 24) {
    // Chrono becomes a little star far away
    const sparkle = Math.sin(((frame - twinkle) / 24) * Math.PI);
    ctx.save();
    ctx.translate(60, 150);
    ctx.rotate((frame - twinkle) * 0.2);
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkle})`;
    ctx.beginPath();
    for (let point = 0; point < 8; point += 1) {
      const radius = point % 2 === 0 ? 14 * sparkle : 4;
      const angle = (point / 8) * Math.PI * 2;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  if (frame >= coreOn && frame < coreOn + 14) {
    ctx.fillStyle = `rgba(255, 202, 40, ${0.4 * (1 - (frame - coreOn) / 14)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startCh6OutroCutscene() {
  ch6OutroPlayed = true;
  pendingFightTime = performance.now() - fightStartedAt;
  robotShots = [];
  const chronoActor = new Fighter({ x: 0, y: 0, color: '#0f172a', attacksToTheRight: true });
  chronoActor.setCharacterType('chrono');
  ch6CutsceneBase('ch6Outro', upgradeSceneLines(ch6OutroLines), 'titanDeath', {
    gamblerX: Math.max(80, Math.min(canvas.width - 300, player1.position.x)),
    gamblerTargetX: 240,
    scammerX: canvas.width + 400,
    scammerTargetX: canvas.width + 400,
    titanX: player2.position.x,
    chronoActor,
  });
}

function updateCh6OutroPhase(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  let shake = cutscene.shake || 0;

  if (cutscene.phase === 'titanDeath') {
    // the giant sparks, cracks, explodes piece by piece and finally blows apart
    const titan = player2;
    const titanX = cutscene.titanX;
    const collapse = 120;
    if (frame < collapse && frame % 10 === 0) {
      const blastX = titanX + Math.random() * titan.width;
      const blastY = ground - titan.height + Math.random() * titan.height * 0.8;
      fx.blasts.push({ x: blastX, y: blastY, r: 60 + Math.random() * 40, life: 26 });
      spawnChronoIntroDebris(blastX, blastY, 10, ['#37474f', '#b388ff', '#ffab40']);
      shake = 8;
      playSound('robotBoom');
    }
    if (frame === 30) cutscene.emote = { who: 'gambler', symbol: '!', timer: 60 };
    if (frame === collapse) {
      shake = 34;
      fx.blasts.push({ x: titanX + titan.width / 2, y: ground - titan.height / 2, r: 320, life: 36 });
      spawnChronoIntroDebris(titanX + titan.width / 2, ground - titan.height / 2, 80, ['#37474f', '#263238', '#b388ff', '#ff1744', '#ffab40']);
      // the head, arms and plates fall and stay as scrap
      for (let chunk = 0; chunk < 7; chunk += 1) {
        fx.chunks.push({ x: titanX + titan.width / 2 + (Math.random() - 0.5) * 200, y: ground - titan.height, vy: -6 - Math.random() * 4, w: 40 + Math.random() * 50, h: 22 + Math.random() * 26, rot: Math.random() * 3, spin: (Math.random() - 0.5) * 0.3, landed: false });
      }
      playSound('jesterGiantSlam');
      playSound('titanRoar');
      playKick({ volume: 0.45 });
    }
    if (frame >= collapse + 70) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      cutscene.gamblerTargetX = 240;
      startCutsceneLine(0);
      return;
    }
    cutscene.shake = shake * 0.9;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
    drawFactoryVaultStage(false);
    drawChronoIntroWallHoles();
    if (frame < collapse) {
      // shaking, glitching, sinking a little
      titan.robotGlitchTimer = 10;
      drawChronoIntroFighter(titan, titanX + (Math.random() - 0.5) * 6, ground - titan.height + frame * 0.25, false);
    }
    drawChronoIntroFighter(player1, cutscene.gamblerX, ground - player1.height, true);
    drawChronoIntroEffects();
    if (cutscene.emote) {
      cutscene.emote.timer -= 1;
      const saved = { ...player1.position };
      player1.position = { x: cutscene.gamblerX, y: ground - player1.height };
      drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
      player1.position = saved;
      if (cutscene.emote.timer <= 0) cutscene.emote = null;
    }
    ctx.restore();
    if (frame >= collapse && frame < collapse + 12) {
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - (frame - collapse) / 12})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  // ch6Pinball: Chrono slams into the tired Reflecter and shoves him through several parts of the factory
  const chrono = cutscene.chronoActor;
  const time = performance.now() / 1000;
  const segmentFrames = 46;
  const segments = [
    () => drawFactoryVaultStage(false),
    () => drawFactoryFloor(2, 0, canvas.height, time),
    () => drawFactoryFloor(1, 0, canvas.height, time),
    () => drawRobotFactoryStage(),
  ];
  const introFrames = 34;
  const endFrame = introFrames + segments.length * segmentFrames + 40;
  if (frame >= endFrame) {
    endArcadeCutscene();
    return;
  }
  let reflecterX;
  let chronoX;
  let background;
  let spin = 0;
  const reflecterY = ground - player1.height - 18;
  if (frame < introFrames) {
    // Chrono comes out of nowhere from the left
    background = segments[0];
    reflecterX = cutscene.gamblerX;
    chronoX = -140 + (reflecterX - player1.width + 10 + 140) * Math.min(1, frame / 18);
    if (frame === 1) playSound('chronoRam');
    if (frame === 18) {
      shake = 22;
      playSound('robotHit');
      playKick({ volume: 0.4 });
      cutscene.emote = { who: 'gambler', symbol: '!!', timer: 40 };
    }
    if (frame > 18) {
      reflecterX += (frame - 18) * 14;
      chronoX = reflecterX - player1.width + 10;
    }
  } else {
    const segment = Math.min(segments.length - 1, Math.floor((frame - introFrames) / segmentFrames));
    const local = (frame - introFrames) % segmentFrames;
    background = segments[segment];
    const leftToRight = segment % 2 === 0;
    const progress = local / segmentFrames;
    const path = -160 + progress * (canvas.width + 320);
    reflecterX = leftToRight ? path : canvas.width - path;
    chronoX = leftToRight ? reflecterX - player1.width + 10 : reflecterX + player1.width - 10;
    spin = progress * Math.PI * 2 * (leftToRight ? 1 : -1);
    if (local === 0) {
      shake = 26;
      fx.debris = [];
      fx.blasts = [{ x: leftToRight ? 0 : canvas.width, y: ground - 90, r: 240, life: 30 }];
      spawnChronoIntroDebris(leftToRight ? 20 : canvas.width - 20, ground - 90, 36, ['#37474f', '#546e7a', '#fdd835', '#90a4ae']);
      playSound('robotBoom');
      playKick({ volume: 0.4 });
    }
    if (frame >= introFrames + segments.length * segmentFrames) {
      reflecterX = canvas.width + 400;
      chronoX = canvas.width + 400;
    }
  }
  cutscene.shake = shake * 0.88;
  ctx.save();
  ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  background();
  // speed lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  for (let line = 0; line < 8; line += 1) {
    const lineY = 120 + line * 50;
    const lineX = (frame * 60 + line * 173) % (canvas.width + 200) - 100;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX + 140, lineY);
    ctx.stroke();
  }
  ctx.save();
  const centerX = reflecterX + player1.width / 2;
  const centerY = reflecterY + player1.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(spin);
  ctx.translate(-centerX, -centerY);
  drawChronoIntroFighter(player1, reflecterX, reflecterY, true);
  ctx.restore();
  drawChronoIntroFighter(chrono, chronoX, reflecterY - 6, chronoX < reflecterX);
  drawChronoIntroEffects();
  if (cutscene.emote) {
    cutscene.emote.timer -= 1;
    const saved = { ...player1.position };
    player1.position = { x: reflecterX, y: reflecterY };
    drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
    player1.position = saved;
    if (cutscene.emote.timer <= 0) cutscene.emote = null;
  }
  ctx.restore();
  if (frame > introFrames && frame < introFrames + segments.length * segmentFrames) {
    ctx.fillStyle = '#448aff';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.font = '900 30px Courier New, monospace';
    ctx.textAlign = 'center';
    const shout = 'JA! CANSADO, ESPEJITO?! ESTO RECIEN EMPIEZA!';
    ctx.strokeText(shout, canvas.width / 2, 80);
    ctx.fillText(shout, canvas.width / 2, 80);
  }
  const segmentFrame = (frame - introFrames) % segmentFrames;
  if (frame > introFrames && segmentFrame < 8) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - segmentFrame / 10})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (frame >= introFrames + segments.length * segmentFrames) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (frame - introFrames - segments.length * segmentFrames) / 14)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startChronoOutroCutscene() {
  chronoOutroPlayed = true;
  pendingFightTime = performance.now() - fightStartedAt;
  chronoBlades = [];
  chronoZones = [];
  robotShots = [];
  player1.chronoTimeStopTimer = 0;
  chronoRewindFx = 0;
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'chronoOutro',
    lines: upgradeSceneLines(chronoOutroLines),
    phase: 'outroIntro',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: Math.max(60, Math.min(canvas.width - 300, player1.position.x)),
    gamblerTargetX: 300,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: Math.max(300, Math.min(canvas.width - 90, player2.position.x)),
    scammerY: 0,
    scammerTargetX: 660,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: { debris: [], blasts: [], holes: [], chunks: [], rubble: [] },
  });
  document.body.classList.add('arcade-cutscene');
  playSound('cutsceneLand');
  if (!animationId) animate();
}

// Chrono, furious, shoots up into the sky and dives straight into Reflecter.
function updateChronoOutroDive(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  const riseEnd = 55;
  const hangEnd = 95;
  const impact = 112;
  const end = 175;
  const reflecterX = cutscene.gamblerX;
  let chronoX = cutscene.scammerX;
  let chronoY = ground - player2.height - (cutscene.diveStartY || 0);
  let showChrono = true;
  player2.chronoAuraBoost = 1;

  if (frame === 1) playSound('chronoRam');
  if (frame < riseEnd) {
    // shoots straight up, leaving a blue trail
    const progress = frame / riseEnd;
    chronoY = ground - player2.height - (cutscene.diveStartY || 0) - progress * progress * 700;
  } else if (frame < hangEnd) {
    // a tiny glint up in the sky while he charges
    showChrono = false;
    if (frame === riseEnd + 10) cutscene.emote = { who: 'gambler', symbol: '...', timer: 40 };
    if (frame === hangEnd - 14) playSound('robotCharge');
  } else if (frame < impact) {
    // the dive, diagonal from the top right
    const progress = (frame - hangEnd) / (impact - hangEnd);
    const startX = cutscene.scammerX + 120;
    chronoX = startX + (reflecterX + 10 - startX) * progress;
    chronoY = -220 + (ground - player2.height + 220) * progress;
  } else {
    chronoX = reflecterX + 10;
    chronoY = ground - player2.height;
  }
  if (frame === impact) {
    cutscene.shake = 34;
    fx.blasts.push({ x: reflecterX + player1.width / 2, y: ground - 50, r: 260, life: 34 });
    spawnChronoIntroDebris(reflecterX + player1.width / 2, ground - 20, 60, ['#2a3038', '#546e7a', '#448aff', '#82b1ff', '#fdd835']);
    playSound('robotBoom');
    playSound('jesterGiantSlam');
    playKick({ volume: 0.45 });
  }
  if (frame >= end) {
    endArcadeCutscene();
    return;
  }
  cutscene.shake = (cutscene.shake || 0) * 0.9;

  ctx.save();
  ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  drawStage();
  if (frame < impact) drawChronoIntroFighter(player1, reflecterX, ground - player1.height, true);
  if (frame < riseEnd) {
    ctx.strokeStyle = 'rgba(68, 138, 255, 0.55)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(chronoX + player2.width / 2, chronoY + player2.height);
    ctx.lineTo(chronoX + player2.width / 2, ground);
    ctx.stroke();
  }
  if (frame >= riseEnd && frame < hangEnd) {
    const glint = 6 + Math.abs(Math.sin(frame / 3)) * 10;
    const glintX = cutscene.scammerX + 120;
    ctx.fillStyle = '#e3f2fd';
    ctx.shadowColor = '#448aff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(glintX, 40 - glint);
    ctx.lineTo(glintX + 4, 40);
    ctx.lineTo(glintX, 40 + glint);
    ctx.lineTo(glintX - 4, 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(glintX - glint, 38, glint * 2, 4);
    ctx.shadowBlur = 0;
  }
  if (frame >= hangEnd && frame < impact) {
    ctx.strokeStyle = 'rgba(130, 177, 255, 0.6)';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(chronoX + player2.width / 2, chronoY + player2.height / 2);
    ctx.lineTo(cutscene.scammerX + 180, -260);
    ctx.stroke();
    // warning mark under Reflecter
    ctx.strokeStyle = `rgba(255, 23, 68, ${0.5 + Math.random() * 0.4})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(reflecterX + player1.width / 2, ground - 2, 70, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (showChrono && frame < impact + 4) {
    ctx.save();
    const centerX = chronoX + player2.width / 2;
    const centerY = chronoY + player2.height / 2;
    ctx.translate(centerX, centerY);
    if (frame >= hangEnd) ctx.rotate(-0.6);
    ctx.translate(-centerX, -centerY);
    drawChronoIntroFighter(player2, chronoX, chronoY, false);
    ctx.restore();
  }
  if (frame >= impact) {
    // crater
    ctx.fillStyle = '#05070d';
    ctx.beginPath();
    ctx.ellipse(reflecterX + player1.width / 2, ground + 2, 120 + Math.min(20, frame - impact), 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  drawChronoIntroEffects();
  if (cutscene.emote) {
    cutscene.emote.timer -= 1;
    const saved = { ...player1.position };
    player1.position = { x: reflecterX, y: ground - player1.height };
    drawCutsceneEmote(player1, cutscene.emote.symbol, cutscene.emote.timer);
    player1.position = saved;
    if (cutscene.emote.timer <= 0) cutscene.emote = null;
  }
  ctx.restore();
  if (frame >= impact) {
    const whiteness = frame < impact + 10 ? 1 : Math.max(0, 1 - (frame - impact - 10) / 40);
    ctx.fillStyle = `rgba(255, 255, 255, ${whiteness})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startChronoAscent() {
  player2.chronoAscentDone = true;
  player1.chronoTimeStopTimer = 0;
  chronoBlades = [];
  chronoZones = [];
  robotShots = [];
  chronoRivalHistory = [];
  Object.assign(arcadeCutscene, {
    active: true,
    scene: 'chronoAscent',
    lines: upgradeSceneLines(chronoAscentLines),
    phase: 'ascent',
    frame: 0,
    lineIndex: 0,
    typed: 0,
    lineDoneFrames: 0,
    gamblerX: 300,
    gamblerTargetX: 300,
    gamblerHop: 0,
    gamblerScale: 1,
    scammerX: 680,
    scammerY: 72,
    scammerTargetX: 660,
    lidAngle: 1.9,
    shake: 0,
    particles: [],
    prop: null,
    mood: null,
    emote: null,
    rageVisible: false,
    fx: { debris: [], blasts: [], holes: [], chunks: [], rubble: [], brokenFloors: 0 },
  });
  document.body.classList.add('arcade-cutscene');
  playSound('chronoRam');
  playSound('cutsceneSurprise');
}

// one floor of the factory seen while flying through it (k = 0 bottom ... 3 top)
function drawFactoryFloor(k, top, height, time) {
  const bottom = top + height;
  const floorColors = ['#141a21', '#10201a', '#1a1622', '#1c1a14'];
  ctx.fillStyle = floorColors[k];
  ctx.fillRect(0, top, canvas.width, height);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  for (let panelX = 0; panelX < canvas.width; panelX += 128) ctx.strokeRect(panelX + 4, top + 20, 120, height - 70);
  // floor number stencil
  ctx.fillStyle = 'rgba(253, 216, 53, 0.35)';
  ctx.font = '900 46px Courier New, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`P${k + 1}`, 30, top + 80);
  if (k === 0) {
    // the floor they started on: conveyor and scrap
    ctx.fillStyle = '#20262d';
    ctx.fillRect(60, bottom - 150, 420, 26);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(120, bottom - 174, 30, 24);
    ctx.fillRect(860, bottom - 60, 70, 20);
  } else if (k === 1) {
    // labs: experiment tanks with things floating inside
    [140, 330, 720, 880].forEach((tankX, index) => {
      const glow = index % 2 ? '#69f0ae' : '#40c4ff';
      ctx.fillStyle = '#263238';
      ctx.fillRect(tankX - 34, bottom - 70, 68, 20);
      ctx.fillRect(tankX - 34, bottom - 250, 68, 16);
      ctx.fillStyle = index % 2 ? 'rgba(105, 240, 174, 0.28)' : 'rgba(64, 196, 255, 0.28)';
      ctx.fillRect(tankX - 28, bottom - 234, 56, 164);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 2;
      ctx.strokeRect(tankX - 28, bottom - 234, 56, 164);
      const bob = Math.sin(time * 2 + index) * 6;
      ctx.fillStyle = 'rgba(10, 20, 20, 0.8)';
      ctx.fillRect(tankX - 12, bottom - 190 + bob, 24, 70);
      ctx.fillRect(tankX - 9, bottom - 210 + bob, 18, 18);
      ctx.fillStyle = index === 2 ? '#ff1744' : glow;
      ctx.fillRect(tankX - 5, bottom - 205 + bob, 10, 4);
      for (let bubble = 0; bubble < 3; bubble += 1) {
        const rise = (time * 40 + bubble * 50 + index * 13) % 150;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(tankX - 16 + bubble * 14, bottom - 80 - rise, 3, 3);
      }
    });
    ctx.fillStyle = '#ffab40';
    ctx.font = '700 12px Courier New, monospace';
    ctx.fillText('LAB. EXPERIMENTAL - NO ENTRAR', 420, top + 60);
  } else if (k === 2) {
    // assembly: unfinished robot bodies hanging from hooks
    ctx.fillStyle = '#263238';
    ctx.fillRect(0, top + 40, canvas.width, 10);
    for (let hook = 0; hook < 6; hook += 1) {
      const hookX = 110 + hook * 160 + Math.sin(time + hook) * 4;
      ctx.strokeStyle = '#546e7a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hookX, top + 50);
      ctx.lineTo(hookX, top + 110);
      ctx.stroke();
      ctx.fillStyle = hook % 3 === 0 ? '#3949ab' : hook % 3 === 1 ? '#78909c' : '#6d4c41';
      ctx.fillRect(hookX - 20, top + 110, 40, 70);
      ctx.fillStyle = '#101418';
      ctx.fillRect(hookX - 14, top + 120, 28, 10);
      if (hook % 3 === 0) {
        ctx.fillStyle = '#e8eaf6';
        ctx.beginPath();
        ctx.arc(hookX, top + 152, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#90a4ae';
    ctx.font = '700 12px Courier New, monospace';
    ctx.fillText('LINEA T - PROTOTIPOS', 420, top + 30);
  } else {
    // storage: a giant deactivated robot head and a capsule with something inside
    ctx.fillStyle = '#37474f';
    ctx.fillRect(120, bottom - 210, 230, 160);
    ctx.fillStyle = '#101418';
    ctx.fillRect(150, bottom - 170, 170, 40);
    ctx.fillStyle = Math.sin(time * 3) > 0.9 ? '#ff1744' : '#2b0b0b';
    ctx.fillRect(180, bottom - 160, 30, 20);
    ctx.fillRect(260, bottom - 160, 30, 20);
    ctx.fillStyle = '#263238';
    ctx.fillRect(720, bottom - 260, 110, 210);
    ctx.fillStyle = 'rgba(179, 136, 255, 0.25)';
    ctx.fillRect(732, bottom - 248, 86, 186);
    ctx.fillStyle = 'rgba(40, 20, 60, 0.9)';
    ctx.fillRect(758, bottom - 210, 34, 110);
    ctx.fillStyle = '#b388ff';
    ctx.fillRect(768, bottom - 200, 14, 6);
    ctx.fillStyle = '#ffab40';
    ctx.font = '700 12px Courier New, monospace';
    ctx.fillText('PROYECTO ?? - CLASIFICADO', 690, bottom - 272);
  }
  // concrete slab on top (the ceiling they break through)
  ctx.fillStyle = '#2e363e';
  ctx.fillRect(0, top - 18, canvas.width, 36);
  ctx.fillStyle = '#fdd835';
  for (let stripe = 0; stripe < canvas.width; stripe += 40) ctx.fillRect(stripe, top + 12, 20, 6);
}

function drawFactoryRoofSky(top, time) {
  const sky = ctx.createLinearGradient(0, top - canvas.height, 0, top);
  sky.addColorStop(0, '#030712');
  sky.addColorStop(1, '#0d1b3a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, top - canvas.height * 2, canvas.width, canvas.height * 2);
  ctx.fillStyle = 'rgba(227, 242, 253, 0.8)';
  for (let star = 0; star < 30; star += 1) ctx.fillRect((star * 137) % canvas.width, top - 60 - ((star * 71) % 400), 2, 2);
  void time;
}

function updateChronoAscent(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  const time = performance.now() / 1000;
  const floorHeight = canvas.height;
  const floors = 4;
  const progress = Math.min(1, frame / chronoAscentFrames);
  // ease in, then fast, then slow down at the roof
  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const scroll = eased * (floors * floorHeight - 120);
  const fightersY = 250;
  // a ceiling slab is crossed every time scroll passes a floor boundary
  const floorsBroken = Math.floor((scroll + (canvas.height - fightersY)) / floorHeight);
  if (floorsBroken > fx.brokenFloors && fx.brokenFloors < floors) {
    fx.brokenFloors = floorsBroken;
    cutscene.shake = 22;
    fx.blasts.push({ x: canvas.width / 2, y: fightersY - 30, r: 180, life: 30 });
    spawnChronoIntroDebris(canvas.width / 2, fightersY - 20, 40, ['#2e363e', '#546e7a', '#fdd835', '#90a4ae']);
    playSound('robotBoom');
    playKick({ volume: 0.4 });
  }
  if (frame % 14 === 0 && frame < chronoAscentFrames) playSound('chronoRam');
  cutscene.shake = (cutscene.shake || 0) * 0.88;
  const shake = cutscene.shake + (frame < chronoAscentFrames ? 2 : 0);

  if (frame >= chronoAscentFrames + 40) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    fx.debris = [];
    fx.blasts = [];
    cutscene.gamblerX = 260;
    cutscene.gamblerTargetX = 260;
    cutscene.scammerX = 680;
    cutscene.scammerTargetX = 660;
    startCutsceneLine(0);
    return;
  }

  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  for (let k = 0; k < floors; k += 1) {
    const top = canvas.height - (k + 1) * floorHeight + scroll;
    if (top > canvas.height || top + floorHeight < -40) continue;
    drawFactoryFloor(k, top, floorHeight, time);
  }
  const roofTop = canvas.height - floors * floorHeight + scroll;
  if (roofTop > -40) drawFactoryRoofSky(roofTop, time);
  if (frame >= chronoAscentFrames) {
    // they burst out onto the roof: slam down
    const landing = Math.min(1, (frame - chronoAscentFrames) / 20);
    ctx.globalAlpha = landing;
    drawFactoryRoofStage();
    ctx.globalAlpha = 1;
    if (frame === chronoAscentFrames) {
      cutscene.shake = 26;
      playSound('robotBoom');
      playKick({ volume: 0.45 });
    }
  }
  // speed lines
  ctx.strokeStyle = 'rgba(130, 177, 255, 0.35)';
  ctx.lineWidth = 3;
  for (let line = 0; line < 10; line += 1) {
    const lineX = (line * 113 + 40) % canvas.width;
    const lineY = (frame * 40 + line * 97) % canvas.height;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX, lineY + 70);
    ctx.stroke();
  }
  // Chrono (below, aura blazing) forcing Reflecter up against each ceiling
  const centerX = canvas.width / 2;
  player2.chronoAuraBoost = 1;
  const landed = frame >= chronoAscentFrames;
  const reflecterY = landed ? ground - player1.height : fightersY - player1.height / 2;
  const chronoY = landed ? ground - player2.height - 72 : fightersY + player1.height / 2 - 20;
  drawChronoIntroFighter(player1, landed ? 260 : centerX - player1.width / 2 + Math.sin(frame / 3) * 3, reflecterY, true);
  drawChronoIntroFighter(player2, landed ? 680 : centerX - player2.width / 2 + 16, chronoY, false);
  drawChronoIntroEffects();
  ctx.restore();
  if (fx.brokenFloors > 0 && cutscene.shake > 14) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(cutscene.shake - 14) / 20})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// the factory rooftop at night (second half of the Chrono fight)
function drawFactoryRoofStage() {
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#030712');
  sky.addColorStop(0.7, '#0d1b3a');
  sky.addColorStop(1, '#1a2a4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);
  ctx.fillStyle = 'rgba(227, 242, 253, 0.85)';
  for (let star = 0; star < 40; star += 1) {
    const twinkle = (Math.sin(time * 2 + star) + 1) / 2;
    ctx.globalAlpha = 0.3 + twinkle * 0.7;
    ctx.fillRect((star * 137) % canvas.width, (star * 53) % 300, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#e3f2fd';
  ctx.beginPath();
  ctx.arc(850, 90, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#030712';
  ctx.beginPath();
  ctx.arc(836, 82, 30, 0, Math.PI * 2);
  ctx.fill();
  // distant city
  for (let building = 0; building < 16; building += 1) {
    const buildingX = building * 66;
    const buildingHeight = 60 + ((building * 37) % 90);
    ctx.fillStyle = '#0a1224';
    ctx.fillRect(buildingX, ground - 110 - buildingHeight, 60, buildingHeight + 110);
    ctx.fillStyle = 'rgba(255, 224, 130, 0.55)';
    for (let lightY = ground - 100 - buildingHeight; lightY < ground - 120; lightY += 18) {
      if ((building + lightY) % 3 === 0) ctx.fillRect(buildingX + 10, lightY, 6, 6);
      if ((building * 3 + lightY) % 4 === 0) ctx.fillRect(buildingX + 36, lightY, 6, 6);
    }
  }
  // big TEMPUS sign seen from behind, with a flickering letter
  ctx.fillStyle = '#1b2436';
  ctx.fillRect(360, 170, 320, 70);
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(400, 240);
  ctx.lineTo(380, ground - 80);
  ctx.moveTo(640, 240);
  ctx.lineTo(660, ground - 80);
  ctx.stroke();
  ctx.save();
  ctx.translate(520, 218);
  ctx.scale(-1, 1);
  ctx.font = '900 44px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = Math.sin(time * 3.1) > 0.8 ? '#0e3a40' : '#26c6da';
  ctx.shadowColor = '#26c6da';
  ctx.shadowBlur = 12;
  ctx.fillText('TEMPUS', 0, 0);
  ctx.restore();
  // chimneys with smoke, antenna with a red light, water tank
  [[90, 120], [180, 90]].forEach(([chimneyX, chimneyHeight]) => {
    ctx.fillStyle = '#263238';
    ctx.fillRect(chimneyX, ground - 60 - chimneyHeight, 40, chimneyHeight);
    for (let puff = 0; puff < 4; puff += 1) {
      const rise = (time * 20 + puff * 30) % 120;
      ctx.fillStyle = `rgba(120, 130, 150, ${0.3 * (1 - rise / 120)})`;
      ctx.beginPath();
      ctx.arc(chimneyX + 20 + Math.sin(time + puff) * 10, ground - 60 - chimneyHeight - rise, 12 + rise / 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(940, ground - 60);
  ctx.lineTo(940, ground - 260);
  ctx.stroke();
  ctx.fillStyle = Math.floor(time * 2) % 2 === 0 ? '#ff1744' : '#4a0b0b';
  ctx.beginPath();
  ctx.arc(940, ground - 262, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#37474f';
  ctx.fillRect(760, ground - 170, 90, 80);
  ctx.fillRect(770, ground - 90, 8, 30);
  ctx.fillRect(832, ground - 90, 8, 30);
  // the hole they came through
  ctx.fillStyle = '#05070d';
  ctx.beginPath();
  ctx.ellipse(470, ground + 4, 110, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // roof floor: concrete with vents and a ledge
  ctx.fillStyle = '#2a3038';
  ctx.fillRect(0, ground - 60, canvas.width, 60);
  ctx.fillStyle = '#353c46';
  ctx.fillRect(0, ground - 60, canvas.width, 6);
  ctx.fillStyle = '#20262d';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#546e7a';
  [[240, 34], [600, 44]].forEach(([ventX, ventWidth]) => {
    ctx.fillRect(ventX, ground - 84, ventWidth, 24);
    ctx.fillStyle = '#263238';
    for (let slot = 0; slot < 4; slot += 1) ctx.fillRect(ventX + 4 + slot * (ventWidth / 4), ground - 80, 3, 16);
    ctx.fillStyle = '#546e7a';
  });
  ctx.fillStyle = '#fdd835';
  for (let stripeX = 0; stripeX < canvas.width; stripeX += 40) ctx.fillRect(stripeX, ground, 20, 5);
  // wind
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let gust = 0; gust < 4; gust += 1) {
    const gustX = (time * 300 + gust * 260) % (canvas.width + 200) - 100;
    ctx.beginPath();
    ctx.moveTo(gustX, 120 + gust * 70);
    ctx.lineTo(gustX + 80, 118 + gust * 70);
    ctx.stroke();
  }
}

function drawChronoRewindFx() {
  if (chronoRewindFx <= 0) return;
  chronoRewindFx -= 1;
  const alpha = Math.min(1, chronoRewindFx / 20);
  const time = performance.now() / 1000;
  ctx.save();
  ctx.fillStyle = `rgba(13, 71, 161, ${0.35 * alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = `rgba(130, 177, 255, ${0.25 * alpha})`;
  ctx.lineWidth = 2;
  for (let line = 0; line < 12; line += 1) {
    const lineY = ((line * 53 + time * 900) % canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(canvas.width, lineY);
    ctx.stroke();
  }
  const clockX = canvas.width / 2;
  const clockY = 190;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(224, 247, 250, 0.85)';
  ctx.beginPath();
  ctx.arc(clockX, clockY, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0d47a1';
  ctx.lineWidth = 5;
  ctx.stroke();
  const hand = -time * 14;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(hand) * 48, clockY + Math.sin(hand) * 48);
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(hand / 12) * 30, clockY + Math.sin(hand / 12) * 30);
  ctx.stroke();
  ctx.fillStyle = '#e3f2fd';
  ctx.strokeStyle = '#0d47a1';
  ctx.lineWidth = 6;
  ctx.font = '900 34px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.strokeText('RETROCESO TOTAL  -10s', clockX, clockY + 104);
  ctx.fillText('RETROCESO TOTAL  -10s', clockX, clockY + 104);
  ctx.restore();
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

  if (selectedMap === 'factoryRoof') {
    drawFactoryRoofStage();
    return;
  }

  if (selectedMap === 'factoryVault') {
    drawFactoryVaultStage(!(isCh6Level() && ch6Stage === 'titan'));
    return;
  }

  if (selectedMap === 'factoryHidden') {
    drawFactoryHiddenStage(4);
    return;
  }

  if (selectedMap === 'scamShowroom') {
    drawScamShowroomStage();
    return;
  }

  if (selectedMap === 'medievalCastle') {
    drawMedievalCastleStage(1);
    return;
  }

  if (selectedMap === 'shaolinTemple') {
    drawShaolinTempleStage();
    return;
  }

  if (selectedMap === 'enchantedForest') {
    drawEnchantedForestStage();
    return;
  }

  if (selectedMap === 'villageRoad') {
    drawVillageRoadStage();
    return;
  }

  if (selectedMap === 'villagePlaza') {
    drawVillagePlazaStage();
    return;
  }

  if (selectedMap === 'hotSprings') {
    drawHotSpringsStage(true);
    return;
  }

  if (selectedMap === 'robledalAlley') {
    drawRobledalAlleyStage();
    return;
  }

  if (selectedMap === 'robledalJail') {
    drawRobledalJailStage(0);
    return;
  }

  if (selectedMap === 'lanternHill') {
    drawLanternHillStage(0);
    return;
  }

  if (selectedMap === 'lightSkyPlatform') {
    drawLightSkyStage();
    return;
  }

  if (selectedMap === 'farolTop') {
    drawFarolTopStage(0);
    return;
  }

  if (selectedMap === 'farolRift') {
    drawFarolRiftStage(1);
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
  stopReflecterBattleMusic();
  if (scamChallenge.active && scamChallenge.stage === 'normal' && player1.health > 0 && player2.health <= 0) {
    startScamNeoCutscene();
    return;
  }
  if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 4 && !knightSpaOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startKnightSpaVictory();
    return;
  }
  if (knightChallenge.active && !knightChallenge.outroPlayed && player1.health > 0 && player2.health <= 0 && getKnightIntroHero() === 'sorcerer') {
    startKnightSorcererOutro();
    return;
  }
  // level 3 of chapter 5: after Celeste, her friend Seto shows up
  if (normalArcadeActive && arcadeChapter === 'knight' && selectedNormalArcadeLevel === 3 && normalArcadeEnemyIndex <= 2 && player1.health > 0 && player2.health <= 0 && normalArcadeEnemiesRemaining > 0) {
    awardCoins(100);
    // after Seto, Celeste insists and both of them team up
    if (normalArcadeEnemyIndex === 2) startKnightKidsTeam();
    else startKnightSetoIntro();
    return;
  }
  if (normalArcadeActive && player1.health > 0 && player2.health <= 0 && normalArcadeEnemiesRemaining > 0) {
    awardCoins(100);
    startNextNormalArcadeEnemy();
    return;
  }

  if (isCh6Level() && ch6Stage === 'robots' && player1.health > 0 && player2.health <= 0) {
    awardCoins(100);
    startCh6ChronoCutscene();
    return;
  }

  if (isScammerArcadeFight() && !scammerOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startScammerOutroCutscene();
    return;
  }

  if (isCh6Level() && ch6Stage === 'titan' && !ch6OutroPlayed && player1.health > 0 && player2.health <= 0) {
    startCh6OutroCutscene();
    return;
  }

  // dying anywhere in level 6 spoils the clean run for the secret level
  if (isCh6Level() && player1.health <= 0) ch6RunClean = false;

  if (normalArcadeActive && arcadeChapter === 'reflecter' && isChronoRival(player2) && !chronoOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startChronoOutroCutscene();
    return;
  }

  if (isJesterArcadeFight() && isShadowJester(player2) && !jesterOutroPlayed && player1.health > 0 && player2.health <= 0) {
    startJesterOutroCutscene();
    return;
  }

  if (!hardcoreRun.active && isJesterArcadeFight() && isShadowJester(player2) && !jesterLosePlayed && player1.health <= 0 && player2.health > 0) {
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
  if (winnerPlayer === player1 && isShopExtraOn('victoryConfetti')) launchShopConfetti();
  if (scamChallenge.active && scamChallenge.stage === 'neo' && winnerPlayer === player1) rewardScamChallenge();
  if (knightChallenge.active && winnerPlayer === player1) rewardKnightChallenge();
  if (shaolinChallenge.active && winnerPlayer === player1) rewardShaolinChallenge();
  if (normalArcadeActive && !hardcoreRun.active && isJesterArcadeFight() && isShadowJester(player2) && winnerPlayer === player2) scheduleJesterImpatience();
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
      if (arcadeChapter === 'reflecter') unlockAchievement('reflecterArcadeCompleted');
    }
    if (arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 5) unlockAchievement('scammerDefeated');
    if (arcadeChapter === 'knight' && selectedNormalArcadeLevel === knightSecretLevel) {
      try {
        localStorage.setItem(knightSecretBeatenStorageKey, '1');
      } catch (error) {
        // only this session
      }
    }
    if (arcadeChapter === 'reflecter' && selectedNormalArcadeLevel === 7) {
      markReflecterSecretLevelBeaten();
      unlockAchievement('omegariusDefeated');
    }
    // the chapter is done (secret levels do not count): HARDCORE mode unlocked
    if (selectedNormalArcadeLevel === getChapterFinalLevel(arcadeChapter)) markArcadeChapterDone(arcadeChapter);
    unlockNextNormalArcadeLevel(selectedNormalArcadeLevel);
  }
  if (hardcoreRun.active && normalArcadeActive) hardcoreAfterFight(winnerPlayer === player1);
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
  resetBotBrain();
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
  // chapter 4 bosses picked in versus (bossrush): their stats and state for a fresh fight
  if (!normalArcadeActive) [player1, player2].forEach(prepareVersusBossFighter);
  jesterLuckStealTimer = 0;
  chronoRivalHistory = [];
  chronoRewindFx = 0;
  if (normalArcadeActive) configureNormalArcadeLevel();
  if (scamChallenge.active) configureScamChallenge();
  if (knightChallenge.active) configureKnightChallenge();
  if (shaolinChallenge.active) configureShaolinChallenge();
  applyShopPerks();
  if (!normalArcadeActive) {
    prepareMagicTownFighter(player1);
    prepareMagicTownFighter(player2);
  }
  // HARDERCORE: the health from the last level comes along
  if (hardcoreRun.active && hardcoreRun.mode === 'harder' && normalArcadeActive && hardcoreRun.carry !== null) {
    player1.health = Math.max(1, Math.min(player1.maxHealth, hardcoreRun.carry));
    updateHealthBars();
  }
  scammerOutroPlayed = false;
  jesterOutroPlayed = false;
  chronoOutroPlayed = false;
  ch6OutroPlayed = false;
  jesterLosePlayed = false;
  reflecterBattleMusic.restart = true;
  cancelJesterImpatience();
  pendingFightTime = null;
  jesterFinal.active = false;
  omegariusFinal.active = false;
  scamFinal.active = false;
  dodgeRound.active = false;
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
  endScamChallenge();
  knightChallenge.active = false;
  shaolinChallenge.active = false;
  player2.duoActive = false;
  player2.sheriffBadge = false;
  player1.spiritCount = 0;
  player2.spiritCount = 0;
  player2.eyeLook = undefined;
  player1.riftResolve = false;
  riftClash.active = false;
  omegaKickFight.active = false;
  player2.scriptedFlight = false;
  lightClashMusicFade = 1;
  Object.assign(player2, { sheriffStandActive: false, sheriffStandStarted: false, sheriffStandOver: false, sheriffFurious: false, sheriffStandTimer: 0 });
  // arcade enemies can repaint player 2 (the sheriff's red shirt): back to the color picked in the menu
  const pickedColor = document.querySelector('input[name="player2Color"]:checked');
  if (pickedColor) player2.setColor(pickedColor.value);
  cancelJesterImpatience();
  jesterLuckStealTimer = 0;
  chronoRivalHistory = [];
  chronoRewindFx = 0;
  jesterFinal.active = false;
  omegariusFinal.active = false;
  scamFinal.active = false;
  dodgeRound.active = false;
  jesterWhiteFade = 0;
  stopScammerBattleTrack();
  stopJesterTracks();
  stopReflecterBattleMusic();
  reflecterBattleMusic.restart = true;
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
  resetBotBrain();
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

// ------------------------------------------------ Scammer's challenge ------------------------------------------------
// the stage for the challenge: Scammer's VIP sales room, with the Maquina Rara on display
function drawScamShowroomStage() {
  const time = performance.now() / 1000;
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#12051a');
  wall.addColorStop(1, '#2d0f3a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, ground);
  // neon stripes on the wall
  for (let stripeX = 90; stripeX < canvas.width; stripeX += 140) {
    const pink = (stripeX / 140) % 2 < 1;
    ctx.fillStyle = pink ? `rgba(255, 64, 129, ${0.18 + Math.sin(time * 3 + stripeX) * 0.06})` : `rgba(253, 216, 53, ${0.16 + Math.sin(time * 3 + stripeX) * 0.06})`;
    ctx.fillRect(stripeX, 90, 6, ground - 110);
  }
  // spotlights sweeping from the ceiling
  [[180, '#ff4081'], [canvas.width - 180, '#fdd835']].forEach(([lampX, color], index) => {
    const sweep = Math.sin(time * 0.8 + index * 2) * 160;
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(lampX - 12, 0);
    ctx.lineTo(lampX + 12, 0);
    ctx.lineTo(lampX + sweep + 110, ground);
    ctx.lineTo(lampX + sweep - 110, ground);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  // big neon sign
  const flicker = Math.sin(time * 17) > 0.93 ? 0.4 : 1;
  ctx.save();
  ctx.globalAlpha = flicker;
  ctx.font = '900 34px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#ff4081';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffd1e3';
  ctx.fillText('[[SALA DE VENTAS VIP]]', canvas.width / 2, 70);
  ctx.restore();
  // hanging price tags
  [[170, '$9.999.999'], [370, '50% OFF'], [654, '[[DEAL]]'], [854, 'SIN REEMBOLSO']].forEach(([tagX, label], index) => {
    const swing = Math.sin(time * 1.6 + index) * 0.12;
    ctx.save();
    ctx.translate(tagX, 96);
    ctx.rotate(swing);
    ctx.strokeStyle = '#bdbdbd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -96);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = index % 2 === 0 ? '#fdd835' : '#ff4081';
    ctx.fillRect(-46, 0, 92, 26);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.strokeRect(-46, 0, 92, 26);
    ctx.fillStyle = '#111';
    ctx.font = '900 11px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, 17);
    ctx.restore();
  });
  // the Maquina Rara on a pedestal, under a spotlight
  const machineX = canvas.width / 2;
  const pedestalY = ground - 70;
  const cone = ctx.createLinearGradient(machineX, 110, machineX, ground);
  cone.addColorStop(0, 'rgba(105, 240, 174, 0.2)');
  cone.addColorStop(1, 'rgba(105, 240, 174, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(machineX - 20, 110);
  ctx.lineTo(machineX + 20, 110);
  ctx.lineTo(machineX + 110, ground);
  ctx.lineTo(machineX - 110, ground);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(machineX - 60, pedestalY, 120, 70);
  ctx.fillStyle = '#fdd835';
  ctx.fillRect(machineX - 60, pedestalY, 120, 5);
  const hum = Math.sin(time * 30) * 1.2;
  ctx.fillStyle = '#37474f';
  ctx.fillRect(machineX - 40 + hum, pedestalY - 70, 80, 70);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.strokeRect(machineX - 40 + hum, pedestalY - 70, 80, 70);
  [[-22, -48, '#b388ff'], [8, -30, '#69f0ae'], [20, -56, '#ff80ab'], [-8, -18, '#69f0ae']].forEach(([dx, dy, color], index) => {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8 + Math.sin(time * 4 + index) * 4;
    ctx.beginPath();
    ctx.moveTo(machineX + dx + hum, pedestalY + dy - 8);
    ctx.lineTo(machineX + dx + hum + 6, pedestalY + dy);
    ctx.lineTo(machineX + dx + hum, pedestalY + dy + 8);
    ctx.lineTo(machineX + dx + hum - 6, pedestalY + dy);
    ctx.closePath();
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  ctx.fillStyle = Math.floor(time * 2) % 2 === 0 ? '#ff1744' : '#4a0b0b';
  ctx.beginPath();
  ctx.arc(machineX + 30 + hum, pedestalY - 62, 4, 0, Math.PI * 2);
  ctx.fill();
  // red curtains on both sides
  [[0, 1], [canvas.width, -1]].forEach(([edgeX, side]) => {
    ctx.fillStyle = '#7f0020';
    ctx.fillRect(side > 0 ? 0 : canvas.width - 70, 0, 70, ground);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 3;
    for (let fold = 12; fold < 70; fold += 16) {
      ctx.beginPath();
      ctx.moveTo(edgeX + side * fold, 0);
      ctx.lineTo(edgeX + side * (fold + Math.sin(time + fold) * 3), ground);
      ctx.stroke();
    }
  });
  // falling bills
  for (let bill = 0; bill < 8; bill += 1) {
    const billX = (bill * 131 + 60) % canvas.width;
    const billY = (time * 40 + bill * 70) % ground;
    ctx.save();
    ctx.translate(billX + Math.sin(time * 2 + bill) * 20, billY);
    ctx.rotate(Math.sin(time * 3 + bill));
    ctx.fillStyle = 'rgba(102, 187, 106, 0.75)';
    ctx.fillRect(-9, -5, 18, 10);
    ctx.restore();
  }
  // checkered floor
  const tile = 48;
  for (let tileX = 0; tileX < canvas.width; tileX += tile) {
    for (let row = 0; row < 2; row += 1) {
      ctx.fillStyle = (tileX / tile + row) % 2 === 0 ? '#111' : '#3d0a2a';
      ctx.fillRect(tileX, ground + row * 28, tile, 28);
    }
  }
  ctx.fillStyle = '#fdd835';
  ctx.fillRect(0, ground, canvas.width, 3);
}

function configureScamChallenge() {
  scamChallenge.stage = 'normal';
  selectedMap = 'scamShowroom';
  botEnabled = true;
  botDifficulty = 'hard';
  if (player2.secretVariant !== 'scammer') player2.setCharacterType('gambler', 'scammer');
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  reflecterBattleMusic.restart = true;
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureNeoScammer() {
  player2.setCharacterType('gambler', 'neoScammer');
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  Object.assign(player2, { neoBigShotCooldown: 90, neoPipisCooldown: 150, neoHeadsCooldown: 220, neoCharge: 0, neoGap: 60, neoTiredDone: false, neoTired: false, neoFinalUsed: false, neoExhausted: false, neoBroken: false });
  player2.position.y = ground - player2.height;
}

function startScamChallengeIntro() {
  let lines = scamChallenge.hero === 'gambler' ? scamIntroGamblerLines : scamHeroIntroLines[scamChallenge.hero] || [...scamIntroLines];
  if (scamChallenge.pickedByScammer) lines = [scamPickedLine, ...lines];
  ch6CutsceneBase('scamIntro', lines, 'dialog', { gamblerX: 240, gamblerTargetX: 240, scammerX: 680, scammerTargetX: 680, scammerY: 0 });
  startCutsceneLine(0);
}

// the first Scammer goes down... and laughs
function startScamNeoCutscene() {
  robotShots = [];
  scamOffers = [];
  scamItems = [];
  scamSlotMachines = [];
  player2.health = 1;
  const reflecterX = Math.max(40, Math.min(canvas.width - 200, player1.position.x));
  let scammerX = Math.max(80, Math.min(canvas.width - 180, player2.position.x));
  if (Math.abs(scammerX - reflecterX) < 200) scammerX = reflecterX < canvas.width / 2 ? reflecterX + 300 : reflecterX - 300;
  // the fighter answers the laugh (Living Tank stays silent)
  const reaction = scamHeroNeoReactions[scamChallenge.hero];
  const mockLines = reaction
    ? [scamNeoMockLines[0], { speaker: scamChallenge.hero, text: reaction, emote: { who: 'gambler', symbol: '?!' } }, ...scamNeoMockLines.slice(1)]
    : [...scamNeoMockLines];
  ch6CutsceneBase('scamNeo', mockLines, 'dialog', { gamblerX: reflecterX, gamblerTargetX: reflecterX, scammerX: player2.position.x, scammerTargetX: scammerX, scammerY: 0, neoMock: true });
  playSound('cutsceneLaugh');
  startCutsceneLine(0);
}

// the pieces of the NEO armor fly in and snap onto the beaten Scammer, and he becomes NEO SCAMMER
function drawNeoArmorPiece(piece, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(piece.spin);
  ctx.fillStyle = piece.color;
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.beginPath();
  piece.shape.forEach(([pointX, pointY], index) => (index === 0 ? ctx.moveTo(pointX, pointY) : ctx.lineTo(pointX, pointY)));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function updateScamNeoTransform(cutscene) {
  const fx = cutscene.fx;
  const frame = cutscene.frame;
  let shake = cutscene.shake || 0;
  const arrive = 100;
  const swap = 112;
  const end = 180;
  const scammerX = cutscene.scammerX;
  const scammerCenterX = scammerX + player2.width / 2;
  const scammerCenterY = ground - player2.height / 2;
  // wing (purple), wing (yellow lightning), two magenta plates and the cannon
  const pieces = cutscene.neoPieces || (cutscene.neoPieces = [
    { color: '#7b1fa2', from: [-160, 60], to: [-60, -10], shape: [[0, 0], [-60, -40], [-70, 20], [-40, 50]] },
    { color: '#fdd835', from: [canvas.width + 160, 40], to: [60, -10], shape: [[0, 0], [50, -44], [40, -8], [70, -12], [46, 30], [10, 40]] },
    { color: '#e91e63', from: [scammerCenterX - 200, -80], to: [-30, -20], shape: [[0, 0], [30, -6], [26, 26], [-6, 30]] },
    { color: '#e91e63', from: [scammerCenterX + 200, -80], to: [30, -20], shape: [[0, 0], [-30, -6], [-26, 26], [6, 30]] },
    { color: '#ad1457', from: [canvas.width + 120, ground - 60], to: [40, 20], shape: [[0, -10], [50, -10], [50, 10], [0, 10]] },
  ]);
  if (frame % 12 === 0 && frame < arrive) playSound('judgeFinalWarn');
  if (frame === 30) {
    playSound('cutsceneAngry');
    playSound('judgeOverdrive');
  }
  if (frame === arrive) {
    shake = 16;
    playSound('judgeHammerHit');
  }
  if (frame === swap) {
    shake = 30;
    configureNeoScammer();
    player2.position.x = scammerX;
    fx.blasts.push({ x: scammerCenterX, y: scammerCenterY, r: 260, life: 34 });
    spawnChronoIntroDebris(scammerCenterX, ground - 60, 40, ['#e91e63', '#fdd835', '#7b1fa2', '#f2f2f2']);
    playSound('robotBoom');
    playSound('titanRoar');
    playSound('cutsceneCash');
  }
  if (frame > swap && frame < swap + 40 && frame % 8 === 0) shake = 12;
  if (frame >= end) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    cutscene.lines = scamNeoLines;
    cutscene.neoMock = false;
    cutscene.scammerX = scammerX;
    cutscene.scammerTargetX = scammerX;
    cutscene.scammerY = 0;
    startCutsceneLine(0);
    return;
  }
  cutscene.shake = shake * 0.88;
  ctx.save();
  ctx.translate((Math.random() - 0.5) * cutscene.shake, (Math.random() - 0.5) * cutscene.shake);
  drawScamShowroomStage();
  drawChronoIntroFighter(player1, cutscene.gamblerX, ground - player1.height, cutscene.gamblerX < scammerX);
  if (frame < swap) {
    // the beaten Scammer shakes, laughing, while his armor arrives
    ctx.save();
    const shiver = frame > 30 ? 5 : 2;
    ctx.translate((Math.random() - 0.5) * shiver, 0);
    const realColor = player2.color;
    player2.color = '#f2f2f2';
    drawChronoIntroFighter(player2, scammerX, ground - player2.height, scammerX < cutscene.gamblerX);
    player2.color = realColor;
    ctx.restore();
    if (frame > 20) {
      const progress = Math.min(1, (frame - 20) / (arrive - 20));
      const ease = progress * progress;
      pieces.forEach((piece, index) => {
        piece.spin = (1 - progress) * (index % 2 === 0 ? 6 : -6);
        const pieceX = piece.from[0] + (scammerCenterX + piece.to[0] - piece.from[0]) * ease;
        const pieceY = piece.from[1] + (scammerCenterY + piece.to[1] - piece.from[1]) * ease;
        drawNeoArmorPiece(piece, pieceX, pieceY);
      });
    }
  } else {
    // NEO SCAMMER grows into its full size
    const grow = Math.min(1, (frame - swap) / 30);
    const scale = 0.55 + grow * 0.45;
    ctx.save();
    ctx.translate(scammerCenterX, ground);
    ctx.scale(scale, scale);
    drawChronoIntroFighter(player2, -player2.width / 2, -player2.height, scammerX < cutscene.gamblerX);
    ctx.restore();
  }
  drawChronoIntroEffects();
  ctx.restore();
  if (frame > 70 && frame < swap) {
    ctx.fillStyle = Math.floor(frame / 6) % 2 === 0 ? 'rgba(233, 30, 99, 0.25)' : 'rgba(253, 216, 53, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (frame >= swap && frame < swap + 14) {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - (frame - swap) / 14})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (frame >= swap + 10) {
    const pop = 1 + Math.max(0, (swap + 20 - frame) / 20);
    ctx.save();
    ctx.translate(canvas.width / 2, 150);
    ctx.scale(pop, pop);
    ctx.font = '900 56px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#111';
    ctx.fillStyle = Math.floor(frame / 5) % 2 === 0 ? '#ff4081' : '#fdd835';
    ctx.strokeText('NEO SCAMMER', 0, 0);
    ctx.fillText('NEO SCAMMER', 0, 0);
    ctx.restore();
  }
}

// ---------- MEDIEVAL code: the Castillo de Valdoria and the Knight's challenge ----------
const medievalGateX = 560;

// a castle courtyard at dusk: towers with banners, the wall, a portcullis gate (gateOpen 0..1),
// torches, the reward notice board and a cobblestone floor
function drawMedievalCastleStage(gateOpen = 1) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#1a1446');
  sky.addColorStop(0.5, '#5b2a6e');
  sky.addColorStop(0.82, '#e9805a');
  sky.addColorStop(1, '#f6c35b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  for (let star = 0; star < 26; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 97 + 31) % width, (star * 53) % 130 + 8, 2, 2);
  }
  // setting sun and far hills
  ctx.fillStyle = 'rgba(255, 213, 79, 0.85)';
  ctx.beginPath();
  ctx.arc(700, 205, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b1f4a';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  for (let hillX = 0; hillX <= width; hillX += 64) ctx.lineTo(hillX, 300 + Math.sin(hillX / 90) * 22);
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.closePath();
  ctx.fill();
  // castle wall with merlons and bricks
  const wallTop = 260;
  ctx.fillStyle = '#4a4458';
  ctx.fillRect(0, wallTop, width, ground - wallTop);
  for (let merlonX = 0; merlonX < width; merlonX += 56) ctx.fillRect(merlonX, wallTop - 22, 32, 22);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  for (let row = 0; row * 26 < ground - wallTop; row += 1) {
    const rowY = wallTop + row * 26;
    ctx.beginPath();
    ctx.moveTo(0, rowY);
    ctx.lineTo(width, rowY);
    for (let brickX = (row % 2) * 30; brickX < width; brickX += 60) {
      ctx.moveTo(brickX, rowY);
      ctx.lineTo(brickX, rowY + 26);
    }
    ctx.stroke();
  }
  // two towers with flags
  [30, width - 180].forEach((towerX, index) => {
    ctx.fillStyle = '#565068';
    ctx.fillRect(towerX, 150, 150, ground - 150);
    for (let merlonX = towerX; merlonX < towerX + 150; merlonX += 38) ctx.fillRect(merlonX, 126, 24, 24);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.strokeRect(towerX, 150, 150, ground - 150);
    ctx.fillStyle = '#ffb74d';
    ctx.fillRect(towerX + 68, 200, 14, 34);
    ctx.fillStyle = 'rgba(255, 183, 77, 0.25)';
    ctx.fillRect(towerX + 60, 192, 30, 50);
    const poleX = towerX + 75;
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(poleX - 2, 60, 4, 68);
    ctx.fillStyle = index === 0 ? '#1e3a8a' : '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, 62);
    for (let flagX = 0; flagX <= 50; flagX += 10) ctx.lineTo(poleX + 2 + flagX, 62 + Math.sin(time * 5 + flagX / 10) * 4);
    for (let flagX = 50; flagX >= 0; flagX -= 10) ctx.lineTo(poleX + 2 + flagX, 92 + Math.sin(time * 5 + flagX / 10) * 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(poleX + 18, 72 + Math.sin(time * 5 + 1.6) * 4, 14, 4);
  });
  // hanging banners on the wall
  [330, 790].forEach((bannerX, index) => {
    const swing = Math.sin(time * 1.5 + index) * 3;
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(bannerX - 22, 280);
    ctx.lineTo(bannerX + 22, 280);
    ctx.lineTo(bannerX + 22 + swing, 400);
    ctx.lineTo(bannerX + swing, 384);
    ctx.lineTo(bannerX - 22 + swing, 400);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(bannerX - 3 + swing * 0.5, 300, 6, 60);
    ctx.fillRect(bannerX - 14 + swing * 0.5, 318, 28, 6);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(bannerX - 28, 276, 56, 6);
  });
  // the gate and its portcullis
  const gateLeft = medievalGateX - 70;
  const gateTop = 330;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(gateLeft, ground);
  ctx.lineTo(gateLeft, gateTop + 70);
  ctx.arc(medievalGateX, gateTop + 70, 70, Math.PI, 0);
  ctx.lineTo(gateLeft + 140, ground);
  ctx.closePath();
  ctx.fillStyle = '#140f1c';
  ctx.fill();
  ctx.clip();
  const raise = Math.max(0, Math.min(1, gateOpen)) * 180;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let barX = gateLeft + 10; barX < gateLeft + 140; barX += 18) {
    ctx.moveTo(barX, gateTop - raise);
    ctx.lineTo(barX, ground - raise);
  }
  for (let barY = gateTop + 14; barY < ground; barY += 26) {
    ctx.moveTo(gateLeft, barY - raise);
    ctx.lineTo(gateLeft + 140, barY - raise);
  }
  ctx.stroke();
  ctx.fillStyle = '#2b2b2b';
  for (let barX = gateLeft + 10; barX < gateLeft + 140; barX += 18) {
    ctx.beginPath();
    ctx.moveTo(barX - 4, ground - raise);
    ctx.lineTo(barX + 4, ground - raise);
    ctx.lineTo(barX, ground - raise + 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = '#2f2a3a';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(gateLeft - 5, ground);
  ctx.lineTo(gateLeft - 5, gateTop + 70);
  ctx.arc(medievalGateX, gateTop + 70, 75, Math.PI, 0);
  ctx.lineTo(gateLeft + 145, ground);
  ctx.stroke();
  // torches next to the gate
  [medievalGateX - 115, medievalGateX + 115].forEach((torchX, index) => {
    const flicker = Math.sin(time * 18 + index * 3) * 3;
    const glowGradient = ctx.createRadialGradient(torchX, 372, 4, torchX, 372, 90);
    glowGradient.addColorStop(0, 'rgba(255, 167, 38, 0.45)');
    glowGradient.addColorStop(1, 'rgba(255, 167, 38, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(torchX - 90, 282, 180, 180);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(torchX - 3, 380, 6, 26);
    ctx.fillStyle = '#212121';
    ctx.fillRect(torchX - 7, 378, 14, 6);
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.moveTo(torchX - 8, 378);
    ctx.quadraticCurveTo(torchX - 4, 360 + flicker, torchX, 350 + flicker);
    ctx.quadraticCurveTo(torchX + 4, 360 - flicker, torchX + 8, 378);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffee58';
    ctx.beginPath();
    ctx.moveTo(torchX - 4, 378);
    ctx.quadraticCurveTo(torchX, 364 + flicker, torchX + 4, 378);
    ctx.closePath();
    ctx.fill();
  });
  // the reward notice board
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(112, 420, 8, ground - 420);
  ctx.fillRect(212, 420, 8, ground - 420);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(104, 404, 124, 66);
  ctx.strokeStyle = '#2e1b14';
  ctx.lineWidth = 3;
  ctx.strokeRect(104, 404, 124, 66);
  ctx.fillStyle = '#f3e5ab';
  ctx.fillRect(118, 410, 96, 54);
  ctx.fillStyle = '#4e342e';
  ctx.font = '900 11px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SE BUSCA', 166, 426);
  ctx.fillText('CAMPEON', 166, 440);
  ctx.fillStyle = '#b71c1c';
  ctx.fillText('1000 ORO', 166, 456);
  ctx.textAlign = 'left';
  // cobblestone floor
  ctx.fillStyle = '#3e3a47';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#6d6578';
  ctx.fillRect(0, ground, width, 4);
  ctx.fillStyle = '#4c4757';
  for (let row = 0; row < 3; row += 1) {
    for (let stoneX = (row % 2) * 22; stoneX < width; stoneX += 44) {
      ctx.beginPath();
      ctx.ellipse(stoneX + 18, ground + 14 + row * 18, 17, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#4caf50';
  for (let tuftX = 20; tuftX < width; tuftX += 137) {
    ctx.fillRect(tuftX, ground - 6, 2, 6);
    ctx.fillRect(tuftX + 4, ground - 9, 2, 9);
    ctx.fillRect(tuftX + 8, ground - 5, 2, 5);
  }
}

// a vs bot fight on the Castillo de Valdoria: the bot is always the Knight
function startKnightChallenge() {
  knightChallenge.active = true;
  normalArcadeActive = false;
  selectedMap = 'medievalCastle';
  player2.setCharacterType('normal', 'knight');
  mapScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  startGame();
  startKnightIntroCutscene();
}

function configureKnightChallenge() {
  knightChallenge.outroPlayed = false;
  selectedMap = 'medievalCastle';
  if (player2.secretVariant !== 'knight') player2.setCharacterType('normal', 'knight');
  applyBotDifficulty();
  player2.health = player2.maxHealth;
  resetKnightState(player2);
  updateHealthBars();
  updateCombatHudIdentity();
}

const knightIntroBossHeroes = ['arcadeBoss', 'icedThug', 'iceMaster', 'scammer', 'shadowJester', 'neoScammer', 'defectiveAssembler', 'chronoRival', 'titanUnit', 'omegarius'];

function getKnightIntroHero() {
  if (isKnight(player1)) return 'knight';
  if (knightIntroBossHeroes.includes(player1.secretVariant)) return player1.secretVariant;
  if (player1.secretVariant && (isArcadeBossFighter(player1) || isFactoryRobot(player1))) return null;
  return player1.characterType;
}

// the chosen fighter walks in for the reward, the portcullis rises and the Knight comes out
function startKnightIntroCutscene() {
  const hero = getKnightIntroHero();
  // the arcade chapter 5 remembers if Cowboy ever came to Valdoria for the reward
  if (hero === 'cowboy') {
    try {
      localStorage.setItem(knightMetCowboyStorageKey, '1');
    } catch (error) {
      // the reunion just will not happen if storage is blocked
    }
  }
  const lines = knightIntroHeroLines[hero] || knightIntroGenericLines;
  ch6CutsceneBase('knightIntro', lines, 'knightArrive', {
    gamblerX: -120,
    gamblerTargetX: 250,
    scammerX: canvas.width + 300,
    scammerTargetX: 690,
    scammerY: 0,
    knightGate: 0,
  });
  player2.knightGlow = 0;
}

// the Sorcerer beat him: the Knight on one knee, then on his feet for the oath
function startKnightSorcererOutro() {
  knightChallenge.outroPlayed = true;
  robotShots = [];
  player2.knightShieldTimer = 0;
  player2.knightSlam = null;
  player2.knightWaves = [];
  const heroX = Math.max(60, Math.min(canvas.width - 260, player1.position.x));
  let knightX = Math.max(60, Math.min(canvas.width - 120, player2.position.x));
  if (Math.abs(knightX - heroX) < 220) knightX = heroX < canvas.width / 2 ? heroX + 260 : heroX - 260;
  ch6CutsceneBase('knightOutro', knightSorcererOutroLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: knightX,
    scammerTargetX: knightX,
    scammerY: 0,
  });
  player2.knightKneel = true;
  startCutsceneLine(0);
}

function updateKnightIntro(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player2.knightGlow = line && line.glow ? 1 : 0;
  if (cutscene.scene === 'knightOutro') player2.knightKneel = !(line && line.stand);
  if (cutscene.phase !== 'knightArrive') return;
  const frame = cutscene.frame;
  const heroX = cutscene.gamblerX;
  cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3.4);
  if (cutscene.gamblerX !== heroX && frame % 16 === 0) playSound('cutsceneStep');
  if (frame === 100) {
    cutscene.emote = { who: 'gambler', symbol: '$', timer: 60 };
    playSound('cutsceneCash');
  }
  if (frame >= 130 && frame < 200) {
    cutscene.knightGate = (frame - 130) / 70;
    if (frame % 12 === 0) playSound('robotHit');
  }
  if (frame === 200) {
    cutscene.knightGate = 1;
    cutscene.scammerX = medievalGateX - player2.width / 2;
    cutscene.emote = { who: 'gambler', symbol: '!', timer: 50 };
    playSound('cutsceneSurprise');
  }
  if (frame > 200) {
    const knightX = cutscene.scammerX;
    cutscene.scammerX = moveToward(cutscene.scammerX, cutscene.scammerTargetX, 2.6);
    if (cutscene.scammerX !== knightX) {
      if (frame % 18 === 0) playSound('cutsceneStep');
    } else {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
  }
}

// ---------- Arcade chapter 5: the Bosque Lumina ----------
// a magical forest at night, mysterious but friendly: glowing mushrooms and flowers, fireflies,
// big old trees, soft light rays, mist and a little stream
function drawEnchantedForestStage(bushShake = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#0b1d33');
  sky.addColorStop(0.55, '#1f4e5f');
  sky.addColorStop(1, '#2e7d6b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  // the big moon and its halo
  const halo = ctx.createRadialGradient(560, 120, 20, 560, 120, 200);
  halo.addColorStop(0, 'rgba(224, 247, 250, 0.55)');
  halo.addColorStop(1, 'rgba(224, 247, 250, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(300, 0, 520, 340);
  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.arc(560, 120, 42, 0, Math.PI * 2);
  ctx.fill();
  // soft light rays
  ctx.save();
  ctx.globalAlpha = 0.08 + Math.sin(time * 0.8) * 0.03;
  ctx.fillStyle = '#e0f2f1';
  [[380, 120], [560, 160], [720, 110]].forEach(([rayX, rayWidth]) => {
    ctx.beginPath();
    ctx.moveTo(rayX, 0);
    ctx.lineTo(rayX + rayWidth, 0);
    ctx.lineTo(rayX + rayWidth * 1.8, ground);
    ctx.lineTo(rayX + rayWidth * 0.6, ground);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
  // far tree line
  ctx.fillStyle = '#16384a';
  for (let treeX = -20; treeX < width + 40; treeX += 70) {
    const top = 250 + Math.sin(treeX * 0.05) * 30;
    ctx.beginPath();
    ctx.arc(treeX, top, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(treeX - 8, top, 16, ground - top);
  }
  ctx.fillRect(0, 300, width, ground - 300);
  // mid trees
  ctx.fillStyle = '#1b4d4a';
  for (let treeX = 40; treeX < width; treeX += 150) {
    const top = 320 + Math.cos(treeX * 0.03) * 20;
    ctx.beginPath();
    ctx.arc(treeX, top, 62, 0, Math.PI * 2);
    ctx.arc(treeX + 45, top + 20, 46, 0, Math.PI * 2);
    ctx.fill();
  }
  // the little stream behind the fighters
  ctx.fillStyle = '#26a69a';
  ctx.fillRect(0, ground - 40, width, 16);
  ctx.fillStyle = 'rgba(224, 247, 250, 0.6)';
  for (let sparkle = 0; sparkle < 14; sparkle += 1) {
    const sparkleX = (sparkle * 83 + time * 30) % width;
    ctx.fillRect(sparkleX, ground - 34 + Math.sin(time * 3 + sparkle) * 3, 10, 2);
  }
  // big old trees at the sides
  [[20, 1], [width - 120, -1]].forEach(([trunkX, side]) => {
    ctx.fillStyle = '#3e2c41';
    ctx.fillRect(trunkX, 110, 100, ground - 110);
    ctx.fillStyle = '#2b1f2e';
    ctx.fillRect(trunkX + 30, 160, 10, ground - 160);
    ctx.fillRect(trunkX + 66, 220, 8, ground - 220);
    ctx.fillStyle = '#1b5e4a';
    ctx.beginPath();
    ctx.arc(trunkX + 50, 100, 110, 0, Math.PI * 2);
    ctx.arc(trunkX + 50 + side * 90, 60, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(128, 222, 234, 0.4)';
    for (let glow = 0; glow < 6; glow += 1) {
      ctx.beginPath();
      ctx.arc(trunkX + 10 + glow * 18, 60 + (glow % 3) * 40, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // mossy ground
  ctx.fillStyle = '#2e5d3a';
  ctx.fillRect(0, ground - 24, width, 24);
  ctx.fillStyle = '#21452b';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#4caf50';
  for (let blade = 0; blade < width; blade += 9) {
    ctx.fillRect(blade, ground - 4 - (blade % 4) * 2, 2, 4 + (blade % 4) * 2);
  }
  // glowing mushrooms and flowers
  [[150, '#4dd0e1'], [300, '#f48fb1'], [470, '#4dd0e1'], [720, '#ce93d8'], [880, '#4dd0e1']].forEach(([mushX, color], index) => {
    const pulse = 0.6 + Math.sin(time * 2 + index) * 0.25;
    const glowGradient = ctx.createRadialGradient(mushX, ground - 10, 2, mushX, ground - 10, 34);
    glowGradient.addColorStop(0, hexToRgba(color, 0.45 * pulse));
    glowGradient.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = glowGradient;
    ctx.fillRect(mushX - 34, ground - 44, 68, 68);
    ctx.fillStyle = '#efebe9';
    ctx.fillRect(mushX - 2, ground - 12, 4, 12);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(mushX, ground - 12, 10, 6, 0, Math.PI, 0);
    ctx.fill();
  });
  for (let flower = 0; flower < 18; flower += 1) {
    const flowerX = (flower * 59 + 25) % width;
    ctx.fillStyle = flower % 2 ? '#fff59d' : '#b3e5fc';
    ctx.globalAlpha = 0.6 + Math.sin(time * 3 + flower) * 0.3;
    ctx.fillRect(flowerX, ground - 8, 4, 4);
    ctx.globalAlpha = 1;
  }
  // bushes on the right (they shake when something comes out of them)
  const shakeX = bushShake > 0 ? Math.sin(time * 60) * Math.min(6, bushShake / 4) : 0;
  ctx.fillStyle = '#2e7d32';
  [[840, 34], [890, 42], [950, 36]].forEach(([bushX, size]) => {
    ctx.beginPath();
    ctx.arc(bushX + shakeX, ground - size * 0.6, size, Math.PI, 0);
    ctx.fill();
  });
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.arc(900 + shakeX, ground - 30, 22, Math.PI, 0);
  ctx.fill();
  // fireflies
  for (let fly = 0; fly < 28; fly += 1) {
    const flyX = (fly * 137 + Math.sin(time * 0.7 + fly) * 40 + time * 12 * ((fly % 3) - 1)) % width;
    const flyY = 140 + ((fly * 71) % 300) + Math.sin(time * 1.3 + fly * 2) * 20;
    const glowAlpha = 0.5 + Math.sin(time * 4 + fly) * 0.5;
    ctx.fillStyle = `rgba(220, 255, 140, ${glowAlpha * 0.25})`;
    ctx.beginPath();
    ctx.arc((flyX + width) % width, flyY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(240, 255, 180, ${glowAlpha})`;
    ctx.fillRect((flyX + width) % width - 1, flyY - 1, 3, 3);
  }
  // mist
  const mist = ctx.createLinearGradient(0, ground - 90, 0, ground);
  mist.addColorStop(0, 'rgba(224, 247, 250, 0)');
  mist.addColorStop(1, 'rgba(224, 247, 250, 0.16)');
  ctx.fillStyle = mist;
  ctx.fillRect(0, ground - 90, width, 90);
}

// level 1: Knight walks into the forest, finds it lovely... and then the beast jumps out of the bushes
function startKnightForestIntro() {
  ch6CutsceneBase('knightForestIntro', knightForestIntroLines, 'forestArrive', {
    gamblerX: -120,
    gamblerTargetX: 260,
    scammerX: canvas.width + 200,
    scammerTargetX: canvas.width + 200,
    scammerY: 0,
    bushShake: 0,
  });
}

function updateKnightForestIntro(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player1.knightGlow = line && line.glow ? 1 : 0;
  if (cutscene.bushShake > 0) cutscene.bushShake -= 1;
  if (cutscene.phase === 'forestArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 20) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  if (line && line.monster === 'in' && !cutscene.monsterIn) {
    cutscene.monsterIn = true;
    cutscene.bushShake = 30;
    cutscene.scammerX = canvas.width + 40;
    cutscene.leapFrom = cutscene.scammerX;
    cutscene.scammerTargetX = 660;
    playSound('cutsceneAngry');
  }
  if (cutscene.monsterIn && cutscene.scammerX > cutscene.scammerTargetX) {
    cutscene.scammerX = Math.max(cutscene.scammerTargetX, cutscene.scammerX - 9);
    const progress = 1 - (cutscene.scammerX - cutscene.scammerTargetX) / (cutscene.leapFrom - cutscene.scammerTargetX);
    cutscene.scammerY = Math.sin(Math.PI * progress) * 130;
    if (cutscene.scammerX === cutscene.scammerTargetX) {
      cutscene.scammerY = 0;
      playSound('robotBoom');
    }
  }
}

// ---------- level 2: the road to the village and the Orden Sombria ----------
// a dirt road through the fields at sunset, with a big walled village on the hill (houses, a bell tower and a windmill)
function drawVillageRoadStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#3f51b5');
  sky.addColorStop(0.5, '#ff8a65');
  sky.addColorStop(1, '#ffe0b2');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  // the setting sun and a few clouds
  const sunGlow = ctx.createRadialGradient(170, 300, 10, 170, 300, 170);
  sunGlow.addColorStop(0, 'rgba(255, 236, 179, 0.85)');
  sunGlow.addColorStop(1, 'rgba(255, 236, 179, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 130, 340, 340);
  ctx.fillStyle = '#ffecb3';
  ctx.beginPath();
  ctx.arc(170, 300, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  [[260, 90, 1], [620, 60, 1.3], [880, 120, 0.9]].forEach(([cloudX, cloudY, size], index) => {
    const drift = (cloudX + time * (6 + index * 2)) % (width + 200) - 100;
    ctx.beginPath();
    ctx.ellipse(drift, cloudY, 60 * size, 16 * size, 0, 0, Math.PI * 2);
    ctx.ellipse(drift + 40 * size, cloudY - 10 * size, 40 * size, 18 * size, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // far hills
  ctx.fillStyle = '#7986cb';
  ctx.beginPath();
  ctx.moveTo(0, 360);
  for (let hillX = 0; hillX <= width; hillX += 80) ctx.lineTo(hillX, 330 + Math.sin(hillX / 140) * 26);
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.closePath();
  ctx.fill();
  // the village hill
  ctx.fillStyle = '#689f38';
  ctx.beginPath();
  ctx.moveTo(380, ground);
  ctx.quadraticCurveTo(650, 250, 1024, 300);
  ctx.lineTo(width, ground);
  ctx.closePath();
  ctx.fill();
  // village wall
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(470, 330, 520, 40);
  for (let merlonX = 470; merlonX < 990; merlonX += 26) ctx.fillRect(merlonX, 322, 14, 8);
  // houses with red roofs and lit windows
  const houses = [[490, 300, 46], [545, 290, 52], [606, 296, 44], [700, 286, 50], [760, 294, 46], [820, 284, 54], [884, 292, 48], [940, 298, 40]];
  houses.forEach(([houseX, houseY, size], index) => {
    ctx.fillStyle = index % 2 ? '#efebe9' : '#d7ccc8';
    ctx.fillRect(houseX, houseY, size, 334 - houseY + 10);
    ctx.fillStyle = index % 3 === 0 ? '#8d2b1f' : '#b23c2a';
    ctx.beginPath();
    ctx.moveTo(houseX - 5, houseY);
    ctx.lineTo(houseX + size / 2, houseY - 22);
    ctx.lineTo(houseX + size + 5, houseY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255, 213, 79, ${0.7 + Math.sin(time * 2 + index) * 0.2})`;
    ctx.fillRect(houseX + 8, houseY + 10, 8, 8);
    if (size > 45) ctx.fillRect(houseX + size - 16, houseY + 10, 8, 8);
    // chimney smoke
    if (index % 3 === 1) {
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(houseX + size - 14, houseY - 20, 6, 12);
      for (let puff = 0; puff < 3; puff += 1) {
        const rise = (time * 14 + puff * 14) % 42;
        ctx.fillStyle = `rgba(236, 239, 241, ${0.5 - rise / 90})`;
        ctx.beginPath();
        ctx.arc(houseX + size - 11 + Math.sin(time + puff) * 4, houseY - 24 - rise, 4 + rise / 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  // bell tower
  ctx.fillStyle = '#bcaaa4';
  ctx.fillRect(655, 220, 34, 114);
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.moveTo(649, 220);
  ctx.lineTo(672, 180);
  ctx.lineTo(695, 220);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(664, 232, 16, 18);
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.arc(672, 244, 5, 0, Math.PI * 2);
  ctx.fill();
  // windmill
  ctx.fillStyle = '#d7ccc8';
  ctx.beginPath();
  ctx.moveTo(990, 334);
  ctx.lineTo(998, 250);
  ctx.lineTo(1018, 250);
  ctx.lineTo(1024, 334);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.translate(1006, 256);
  ctx.rotate(time * 0.8);
  ctx.fillStyle = '#795548';
  for (let blade = 0; blade < 4; blade += 1) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-3, 0, 6, 48);
    ctx.fillStyle = 'rgba(239, 235, 233, 0.9)';
    ctx.fillRect(3, 10, 10, 36);
    ctx.fillStyle = '#795548';
  }
  ctx.restore();
  // fields and a wooden fence along the road
  ctx.fillStyle = '#9ccc65';
  ctx.fillRect(0, ground - 80, width, 80);
  ctx.fillStyle = '#8bc34a';
  for (let row = 0; row < 4; row += 1) ctx.fillRect(0, ground - 74 + row * 16, width, 4);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(0, ground - 60, width, 4);
  ctx.fillRect(0, ground - 44, width, 4);
  for (let postX = 10; postX < width; postX += 70) ctx.fillRect(postX, ground - 70, 6, 40);
  // haystacks and a signpost to the village
  [[90, 1], [330, 0.8]].forEach(([hayX, size]) => {
    ctx.fillStyle = '#fbc02d';
    ctx.beginPath();
    ctx.ellipse(hayX, ground - 28 * size, 34 * size, 28 * size, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(hayX - 34 * size, ground - 30 * size, 68 * size, 3);
  });
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(420, ground - 90, 6, 90);
  ctx.fillStyle = '#8d6e63';
  ctx.beginPath();
  ctx.moveTo(398, ground - 86);
  ctx.lineTo(470, ground - 86);
  ctx.lineTo(484, ground - 76);
  ctx.lineTo(470, ground - 66);
  ctx.lineTo(398, ground - 66);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3e2723';
  ctx.font = '900 11px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ROBLEDAL', 438, ground - 72);
  ctx.textAlign = 'left';
  // the dirt road
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, ground, width, 4);
  for (let rut = 0; rut < width; rut += 90) {
    ctx.fillRect(rut, ground + 14, 50, 3);
    ctx.fillRect(rut + 40, ground + 30, 40, 3);
  }
  ctx.fillStyle = '#7cb342';
  for (let tuft = 0; tuft < width; tuft += 23) {
    ctx.fillRect(tuft, ground - 6, 2, 6);
    ctx.fillRect(tuft + 4, ground - 9, 2, 9);
  }
}

// ---------- level 3: Robledal and Light Warrior's friends ----------
// the village square on a sunny day: house fronts, bunting, a fountain, a flower stall,
// the notice board with Light Warrior's note, and petals drifting in the air
function drawVillagePlazaStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#64b5f6');
  sky.addColorStop(1, '#e3f2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  [[180, 70, 1], [560, 50, 1.2], [880, 90, 0.9]].forEach(([cloudX, cloudY, size], index) => {
    const drift = (cloudX + time * (5 + index * 2)) % (width + 200) - 100;
    ctx.beginPath();
    ctx.ellipse(drift, cloudY, 55 * size, 16 * size, 0, 0, Math.PI * 2);
    ctx.ellipse(drift + 35 * size, cloudY - 10 * size, 36 * size, 18 * size, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // a row of house fronts
  const fronts = [[0, 150, '#ffe0b2', '#8d2b1f'], [150, 170, '#f8bbd0', '#6d4c41'], [320, 140, '#fff9c4', '#b23c2a'], [700, 150, '#c8e6c9', '#8d2b1f'], [850, 174, '#ffccbc', '#5d4037']];
  fronts.forEach(([frontX, frontWidth, wall, roof], index) => {
    const top = 170 + (index % 2) * 20;
    ctx.fillStyle = wall;
    ctx.fillRect(frontX, top, frontWidth, ground - 40 - top);
    ctx.fillStyle = roof;
    ctx.beginPath();
    ctx.moveTo(frontX - 8, top);
    ctx.lineTo(frontX + frontWidth / 2, top - 60);
    ctx.lineTo(frontX + frontWidth + 8, top);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(frontX + frontWidth / 2 - 16, ground - 110, 32, 70);
    ctx.fillStyle = '#90caf9';
    ctx.fillRect(frontX + 16, top + 30, 26, 26);
    ctx.fillRect(frontX + frontWidth - 42, top + 30, 26, 26);
    ctx.fillStyle = '#e57373';
    ctx.fillRect(frontX + 14, top + 56, 30, 6);
    ctx.fillRect(frontX + frontWidth - 44, top + 56, 30, 6);
  });
  // the bell tower behind the square
  ctx.fillStyle = '#bcaaa4';
  ctx.fillRect(500, 90, 80, ground - 130);
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.moveTo(490, 90);
  ctx.lineTo(540, 20);
  ctx.lineTo(590, 90);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath();
  ctx.arc(540, 140, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(540, 140);
  ctx.lineTo(540 + Math.cos(time * 0.2) * 14, 140 + Math.sin(time * 0.2) * 14);
  ctx.moveTo(540, 140);
  ctx.lineTo(540, 126);
  ctx.stroke();
  // bunting across the square
  ['#e53935', '#fdd835', '#43a047', '#1e88e5'].forEach((color, row) => {
    ctx.fillStyle = color;
    for (let flag = row; flag < 26; flag += 4) {
      const flagX = flag * 40;
      const sag = Math.sin((flag / 25) * Math.PI) * 30;
      ctx.beginPath();
      ctx.moveTo(flagX, 210 + sag);
      ctx.lineTo(flagX + 20, 210 + sag);
      ctx.lineTo(flagX + 10, 228 + sag + Math.sin(time * 3 + flag) * 2);
      ctx.closePath();
      ctx.fill();
    }
  });
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let flagX = 0; flagX <= width; flagX += 20) ctx.lineTo(flagX, 210 + Math.sin((flagX / 1000) * Math.PI) * 30);
  ctx.stroke();
  // the fountain in the middle
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(470, ground - 60, 140, 40);
  ctx.fillStyle = '#4fc3f7';
  ctx.fillRect(478, ground - 56, 124, 10);
  ctx.fillStyle = '#bdbdbd';
  ctx.fillRect(530, ground - 110, 20, 52);
  ctx.fillRect(510, ground - 116, 60, 8);
  ctx.fillStyle = 'rgba(129, 212, 250, 0.8)';
  for (let drop = 0; drop < 8; drop += 1) {
    const phase = (time * 1.4 + drop / 8) % 1;
    ctx.fillRect(540 + (drop - 3.5) * 9 * phase, ground - 120 + phase * phase * 64 - phase * 20, 3, 5);
  }
  // a flower stall
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(760, ground - 90, 120, 50);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(750, ground - 118, 140, 16);
  ctx.fillStyle = '#ffffff';
  for (let stripe = 750; stripe < 890; stripe += 28) ctx.fillRect(stripe, ground - 118, 14, 16);
  ['#f06292', '#fff176', '#ba68c8', '#ff8a65', '#81c784'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(778 + index * 22, ground - 92, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  // the notice board with Light Warrior's note
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(386, ground - 100, 6, 60);
  ctx.fillRect(436, ground - 100, 6, 60);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(378, ground - 122, 72, 40);
  ctx.fillStyle = '#fff59d';
  ctx.save();
  ctx.translate(414, ground - 102);
  ctx.rotate(-0.08);
  ctx.fillRect(-14, -14, 28, 26);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-2, -16, 4, 4);
  ctx.fillStyle = '#795548';
  for (let line = 0; line < 4; line += 1) ctx.fillRect(-10, -8 + line * 6, 20 - (line % 2) * 6, 2);
  ctx.restore();
  // cobblestone square
  ctx.fillStyle = '#bcaaa4';
  ctx.fillRect(0, ground - 40, width, canvas.height - ground + 40);
  ctx.fillStyle = '#a1887f';
  for (let row = 0; row < 5; row += 1) {
    for (let stoneX = (row % 2) * 20; stoneX < width; stoneX += 40) {
      ctx.beginPath();
      ctx.ellipse(stoneX + 16, ground - 32 + row * 16, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, ground, width, 3);
  // petals drifting across the square
  for (let petal = 0; petal < 22; petal += 1) {
    const petalX = (petal * 97 + time * (30 + (petal % 5) * 8)) % (width + 40) - 20;
    const petalY = (petal * 53 + time * (18 + (petal % 3) * 6)) % ground;
    ctx.save();
    ctx.translate(petalX + Math.sin(time * 2 + petal) * 12, petalY);
    ctx.rotate(time * 2 + petal);
    ctx.fillStyle = petal % 3 ? 'rgba(248, 187, 208, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// level 3 intro: the note from Light Warrior... and Celeste wants a new friend
function startKnightPlazaIntro() {
  player2.celesteShowKnives = false;
  ch6CutsceneBase('knightPlazaIntro', knightPlazaIntroLines, 'plazaArrive', {
    gamblerX: -120,
    gamblerTargetX: 300,
    scammerX: canvas.width + 200,
    scammerTargetX: canvas.width + 200,
    scammerY: 0,
    girlIn: false,
    setoIn: false,
    setoActor: null,
  });
}

// after Celeste: her friend Seto runs in (Celeste is still there, tired and happy)
function startKnightSetoIntro() {
  robotShots = [];
  player2.celesteKnives = [];
  const heroX = Math.max(60, Math.min(canvas.width - 300, player1.position.x));
  let celesteX = Math.max(80, Math.min(canvas.width - 220, player2.position.x));
  if (Math.abs(celesteX - heroX) < 200) celesteX = heroX + 220;
  const seto = new Fighter({ x: canvas.width + 80, y: 0, color: '#66bb6a', attacksToTheRight: false });
  seto.setCharacterType('normal', 'setoBoy');
  seto.position = { x: canvas.width + 80, y: ground - seto.height };
  ch6CutsceneBase('knightSetoIntro', knightSetoIntroLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: celesteX,
    scammerTargetX: celesteX,
    scammerY: 0,
    setoActor: seto,
    setoTargetX: celesteX + 90,
    setoIn: false,
    girlIn: false,
  });
  startCutsceneLine(0);
}

// Seto lost too... Celeste runs back in and insists: both of them, together
function startKnightKidsTeam() {
  robotShots = [];
  player2.setoToys = [];
  const heroX = Math.max(60, Math.min(canvas.width - 300, player1.position.x));
  let setoX = Math.max(80, Math.min(canvas.width - 220, player2.position.x));
  if (Math.abs(setoX - heroX) < 200) setoX = heroX + 220;
  const celeste = new Fighter({ x: canvas.width + 80, y: 0, color: '#4fc3f7', attacksToTheRight: false });
  celeste.setCharacterType('normal', 'celesteGirl');
  celeste.position = { x: canvas.width + 80, y: ground - celeste.height };
  ch6CutsceneBase('knightKidsTeam', knightKidsTeamLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: setoX,
    scammerTargetX: setoX,
    scammerY: 0,
    setoActor: celeste,
    setoTargetX: setoX + 80,
    setoIn: false,
    girlIn: false,
  });
  startCutsceneLine(0);
}

function updateKnightPlaza(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player1.knightGlow = line && line.glow ? 1 : 0;
  if (cutscene.phase === 'plazaArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 20) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  if (!line) return;
  if (typeof line.walk === 'number') cutscene.gamblerTargetX = line.walk;
  // Celeste comes skipping in
  if (line.girl === 'in' && !cutscene.girlIn) {
    cutscene.girlIn = true;
    cutscene.scammerX = canvas.width + 30;
    cutscene.scammerTargetX = 720;
    playSound('cutsceneSurprise');
  }
  if (cutscene.girlIn) cutscene.scammerY = Math.abs(cutscene.scammerX - cutscene.scammerTargetX) > 2 ? Math.abs(Math.sin(cutscene.frame / 5)) * 16 : 0;
  if (line.knives) player2.celesteShowKnives = true;
  // Seto runs in next to Celeste
  if (cutscene.setoActor) {
    const seto = cutscene.setoActor;
    if (line.seto === 'in' || cutscene.setoIn) {
      cutscene.setoIn = true;
      seto.position.x = moveToward(seto.position.x, cutscene.setoTargetX, 6);
    }
    seto.position.y = ground - seto.height - (Math.abs(seto.position.x - cutscene.setoTargetX) > 2 ? Math.abs(Math.sin(cutscene.frame / 4)) * 10 : 0);
    seto.attacksToTheRight = seto.position.x < cutscene.gamblerX;
    seto.isAttacking = false;
  }
}

function makeDarkKnightActor(variant, x) {
  const actor = new Fighter({ x, y: 0, color: '#37474f', attacksToTheRight: false });
  actor.setCharacterType('normal', variant);
  actor.position = { x, y: ground - actor.height };
  return actor;
}

// level 2 intro: Knight sees the village... and the Orden Sombria blocks the road
function startKnightVillageIntro() {
  ch6CutsceneBase('knightVillageIntro', knightVillageIntroLines, 'villageArrive', {
    gamblerX: -120,
    gamblerTargetX: 230,
    scammerX: canvas.width + 40,
    scammerTargetX: canvas.width + 40,
    scammerY: 0,
    darkActors: [
      { actor: makeDarkKnightActor('darkKnight', canvas.width + 90), targetX: 650 },
      { actor: makeDarkKnightActor('darkKnight', canvas.width + 150), targetX: 730 },
      { actor: makeDarkKnightActor('darkKnight', canvas.width + 210), targetX: 810 },
      { actor: makeDarkKnightActor('darkKnightBoss', canvas.width + 280), targetX: 900 },
    ],
    darkIn: false,
  });
}

// the captain's offer, in the middle of the fight
function startKnightDarkDeal() {
  const captain = player2;
  captain.darkDealDone = true;
  [player1, player2].forEach((fighter) => {
    fighter.knightShieldTimer = 0;
    fighter.knightLungeTimer = 0;
    fighter.knightSlam = null;
    fighter.knightWaves = [];
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  robotShots = [];
  resetKeys();
  startMidFightCh7Cutscene('knightDarkDeal', knightDarkDealLines);
}

function updateKnightVillage(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player1.knightGlow = line && line.glow && line.speaker === 'knight' ? 1 : 0;
  if (cutscene.phase === 'villageArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 30) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  // the dark knights march in
  if (line && line.dark === 'in' && !cutscene.darkIn) {
    cutscene.darkIn = true;
    cutscene.scammerTargetX = 570;
    // the first one strides ahead of the rest
    cutscene.scammerX = Math.min(cutscene.scammerX, canvas.width - 40);
    playSound('judgeCore');
  }
  if (cutscene.darkIn && cutscene.darkActors) {
    cutscene.darkActors.forEach((entry) => {
      entry.actor.position.x = moveToward(entry.actor.position.x, entry.targetX, 4.5);
    });
  }
  // the captain walks away once the deal is made
  if (line && line.retreat) cutscene.scammerTargetX = canvas.width + 220;
}

function drawDarkKnightActors(cutscene) {
  cutscene.darkActors.forEach((entry) => {
    const actor = entry.actor;
    actor.position.y = ground - actor.height;
    actor.attacksToTheRight = actor.position.x < cutscene.gamblerX;
    actor.isAttacking = false;
    actor.draw();
  });
}

// a little under half of its health: a huge light blast sends the beast flying, and Light Warrior lands
function startKnightLightScene() {
  player2.mossRescued = true;
  player2.mossRoots = [];
  robotShots = [];
  resetKeys();
  const heroX = Math.max(60, Math.min(canvas.width - 160, player1.position.x));
  const beastX = Math.max(40, Math.min(canvas.width - player2.width - 40, player2.position.x));
  const direction = beastX >= heroX ? 1 : -1;
  let landX = beastX;
  if (Math.abs(landX - heroX) < 230) landX = heroX + direction * 260;
  landX = Math.max(60, Math.min(canvas.width - 120, landX));
  ch6CutsceneBase('knightLight', knightLightLines, 'lightBlast', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: beastX,
    scammerTargetX: beastX,
    scammerY: Math.max(0, ground - player2.position.y - player2.height),
    musicOn: false,
    lightFx: { direction, landX, swapped: false, landed: 0, originX: direction > 0 ? 70 : canvas.width - 70, originY: 60 },
  });
  player1.knightGlow = 0;
}

function updateKnightLight(cutscene) {
  if (cutscene.phase !== 'lightBlast') return;
  const frame = cutscene.frame;
  const fx = cutscene.lightFx;
  if (frame === 1) playSound('judgeBeamCharge');
  if (frame === 30) {
    playSound('judgeBeamFire');
    playSound('robotBoom');
    cutscene.emote = { who: 'gambler', symbol: '!', timer: 50 };
  }
  // the beast flies away, out of the screen
  if (frame >= 34 && !fx.swapped) {
    cutscene.scammerX += fx.direction * 14;
    cutscene.scammerY += 10;
    cutscene.scammerTargetX = cutscene.scammerX;
  }
  if (frame === 95) {
    player2.setCharacterType('lightWarrior');
    fx.swapped = true;
    cutscene.scammerX = fx.landX;
    cutscene.scammerTargetX = fx.landX;
    cutscene.scammerY = 460;
  }
  if (fx.swapped && !fx.landed) {
    cutscene.scammerY = Math.max(0, cutscene.scammerY - 15);
    if (cutscene.scammerY === 0) {
      fx.landed = frame;
      cutscene.musicOn = true;
      playSound('judgeLight');
      playSound('achievement');
    }
  }
  if (fx.landed && frame >= fx.landed + 40) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    startCutsceneLine(0);
  }
}

function drawKnightLightFx(cutscene) {
  const fx = cutscene.lightFx;
  if (!fx) return;
  const frame = cutscene.phase === 'lightBlast' ? cutscene.frame : 999;
  const time = performance.now() / 1000;
  ctx.save();
  if (frame < 30) {
    // the light gathers in a corner of the sky
    const radius = 4 + frame * 0.8;
    const orb = ctx.createRadialGradient(fx.originX, fx.originY, 2, fx.originX, fx.originY, radius * 3);
    orb.addColorStop(0, 'rgba(255, 255, 255, 1)');
    orb.addColorStop(0.4, 'rgba(255, 241, 118, 0.8)');
    orb.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(fx.originX, fx.originY, radius * 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (frame < 80) {
    // the great beam of light
    const targetX = cutscene.scammerX + player2.width / 2;
    const targetY = ground - player2.height / 2 - cutscene.scammerY;
    const angle = Math.atan2(targetY - fx.originY, targetX - fx.originX);
    const length = 1600;
    const fade = frame < 70 ? 1 : (80 - frame) / 10;
    const thickness = (70 + Math.sin(time * 40) * 8) * fade;
    ctx.translate(fx.originX, fx.originY);
    ctx.rotate(angle);
    const beam = ctx.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
    beam.addColorStop(0, 'rgba(255, 241, 118, 0)');
    beam.addColorStop(0.3, `rgba(255, 241, 118, ${0.8 * fade})`);
    beam.addColorStop(0.5, `rgba(255, 255, 255, ${fade})`);
    beam.addColorStop(0.7, `rgba(255, 241, 118, ${0.8 * fade})`);
    beam.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = beam;
    ctx.fillRect(0, -thickness / 2, length, thickness);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (frame >= 70 && frame < 100) {
    ctx.fillStyle = `rgba(255, 255, 240, ${Math.max(0, 0.85 - (frame - 70) / 30)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Light Warrior coming down in a column of light, and the burst when he lands
  if (fx.swapped) {
    const lwX = cutscene.scammerX + player2.width / 2;
    if (!fx.landed) {
      ctx.fillStyle = 'rgba(255, 249, 196, 0.35)';
      ctx.fillRect(lwX - 30, 0, 60, ground - cutscene.scammerY);
    } else if (frame - fx.landed < 30) {
      const progress = (frame - fx.landed) / 30;
      ctx.strokeStyle = `rgba(255, 241, 118, ${1 - progress})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(lwX, ground - 4, 30 + progress * 160, 8 + progress * 20, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // sparkles around him
    for (let sparkle = 0; sparkle < 8; sparkle += 1) {
      const angle = time * 2 + sparkle * (Math.PI / 4);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 6 + sparkle) * 0.4})`;
      ctx.fillRect(lwX + Math.cos(angle) * 48 - 2, ground - 70 - cutscene.scammerY + Math.sin(angle) * 40 - 2, 4, 4);
    }
  }
  ctx.restore();
}

// the results screen keeps Light Warrior's theme playing
function playLightThemeOnResults() {
  const track = reflecterBattleMusic.tracks.lightTheme;
  if (!track) return;
  track.volume = getReflecterBattleVolume('lightTheme');
  const playPromise = track.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
  reflecterBattleMusic.current = 'lightTheme';
}

// ---------- level 4: the Aguas Termales del Loto ----------
// the chef of the hot springs: a block in a white coat with a tall toque, a big moustache and a red scarf
function drawChefFigure(chefX, facing = -1, holdingCake = false, raise = 0, throwing = 0) {
  const time = performance.now() / 1000;
  const chefY = ground - 120 - raise;
  ctx.save();
  ctx.translate(chefX + 30, chefY);
  ctx.scale(facing, 1);
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(-30, 0, 60, 120);
  ctx.strokeStyle = '#bdbdbd';
  ctx.lineWidth = 2;
  ctx.strokeRect(-30, 0, 60, 120);
  // toque
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-22, -26, 44, 26);
  ctx.beginPath();
  ctx.arc(-12, -26, 12, 0, Math.PI * 2);
  ctx.arc(4, -30, 13, 0, Math.PI * 2);
  ctx.arc(16, -24, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e0e0e0';
  ctx.strokeRect(-22, -12, 44, 12);
  // face
  ctx.fillStyle = '#ffe0bd';
  ctx.fillRect(-22, 2, 44, 34);
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(2, 12, 5, 5);
  ctx.fillRect(14, 12, 5, 5);
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.ellipse(4, 26, 9, 4, -0.3, 0, Math.PI * 2);
  ctx.ellipse(18, 26, 9, 4, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // red scarf and coat buttons
  ctx.fillStyle = '#e53935';
  ctx.fillRect(-26, 38, 52, 8);
  ctx.fillStyle = '#9e9e9e';
  [56, 72, 88].forEach((buttonY) => {
    ctx.fillRect(-8, buttonY, 4, 4);
    ctx.fillRect(6, buttonY, 4, 4);
  });
  ctx.fillStyle = '#455a64';
  ctx.fillRect(-30, 104, 60, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2, 104, 4, 16);
  // throwing a pastry: the arm goes up
  if (throwing > 0) {
    const lift = Math.min(1, throwing / 10);
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#bdbdbd';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(24, 52);
    ctx.rotate(-0.4 - lift * 1.6);
    ctx.fillRect(-5, 0, 10, 40);
    ctx.strokeRect(-5, 0, 10, 40);
    ctx.fillStyle = '#ffe0bd';
    ctx.beginPath();
    ctx.arc(0, 44, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // the little lotus cake on a plate
  if (holdingCake) {
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(26, 60, 24, 3);
    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(30, 50, 16, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 48, 16, 3);
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.arc(38, 46 + Math.sin(time * 4), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// an oriental hot springs at dusk: a wooden bathhouse with curved roofs and noren curtains,
// paper lanterns, a cherry blossom tree, bamboo fences, many steaming hot tubs and the chef's sweets stall
function drawHotSpringsStage(chefAtStall = true) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#311b92');
  sky.addColorStop(0.55, '#ab47bc');
  sky.addColorStop(1, '#ffab91');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  // the moon, the Gran Farol de Robledal shining up into the sky far away, and pagodas on the hills
  ctx.fillStyle = 'rgba(255, 248, 225, 0.9)';
  ctx.beginPath();
  ctx.arc(180, 80, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#311b92';
  ctx.beginPath();
  ctx.arc(192, 72, 26, 0, Math.PI * 2);
  ctx.fill();
  drawGreatLantern(960, 270, 0.35, 270);
  [[60, 300, 0.8], [930, 296, 0.7]].forEach(([pagodaX, baseY, size]) => {
    ctx.fillStyle = '#3a2b5c';
    for (let floor = 0; floor < 3; floor += 1) {
      const floorY = baseY - floor * 28 * size;
      const floorWidth = (70 - floor * 14) * size;
      ctx.fillRect(pagodaX - floorWidth / 2 + 8 * size, floorY - 22 * size, floorWidth - 16 * size, 22 * size);
      ctx.beginPath();
      ctx.moveTo(pagodaX - floorWidth / 2 - 8 * size, floorY - 18 * size);
      ctx.quadraticCurveTo(pagodaX, floorY - 34 * size, pagodaX + floorWidth / 2 + 8 * size, floorY - 18 * size);
      ctx.lineTo(pagodaX, floorY - 26 * size);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillRect(pagodaX - 1, baseY - 100 * size, 2, 20 * size);
  });
  // a mountain with snow
  ctx.fillStyle = '#4a3a6e';
  ctx.beginPath();
  ctx.moveTo(380, 300);
  ctx.lineTo(620, 90);
  ctx.lineTo(880, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f3e5f5';
  ctx.beginPath();
  ctx.moveTo(580, 125);
  ctx.lineTo(620, 90);
  ctx.lineTo(662, 127);
  ctx.lineTo(640, 120);
  ctx.lineTo(620, 132);
  ctx.lineTo(600, 120);
  ctx.closePath();
  ctx.fill();
  // the bathhouse with its curved roofs
  const roof = (left, right, top) => {
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.moveTo(left - 30, top + 34);
    ctx.quadraticCurveTo(left, top + 20, left + 20, top);
    ctx.lineTo(right - 20, top);
    ctx.quadraticCurveTo(right, top + 20, right + 30, top + 34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#263238';
    ctx.fillRect(left - 10, top + 30, right - left + 20, 6);
  };
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(250, 210, 520, ground - 250);
  roof(250, 770, 168);
  ctx.fillStyle = '#795548';
  ctx.fillRect(360, 120, 300, 60);
  roof(360, 660, 84);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 3;
  for (let beam = 270; beam < 770; beam += 60) {
    ctx.beginPath();
    ctx.moveTo(beam, 210);
    ctx.lineTo(beam, ground - 40);
    ctx.stroke();
  }
  // roof tiles and glowing shoji windows
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  for (let tile = 290; tile < 750; tile += 12) {
    ctx.beginPath();
    ctx.moveTo(tile, 176);
    ctx.lineTo(tile - 4, 200);
    ctx.stroke();
  }
  [[290, 228], [690, 228], [400, 132], [580, 132]].forEach(([windowX, windowY]) => {
    const warm = 0.75 + Math.sin(time * 1.5 + windowX) * 0.08;
    ctx.fillStyle = `rgba(255, 224, 178, ${warm})`;
    ctx.fillRect(windowX, windowY, 46, 36);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(windowX, windowY, 46, 36);
    ctx.beginPath();
    ctx.moveTo(windowX + 23, windowY);
    ctx.lineTo(windowX + 23, windowY + 36);
    ctx.moveTo(windowX, windowY + 12);
    ctx.lineTo(windowX + 46, windowY + 12);
    ctx.moveTo(windowX, windowY + 24);
    ctx.lineTo(windowX + 46, windowY + 24);
    ctx.stroke();
  });
  // noren curtains with the hot springs sign
  ['#283593', '#c62828', '#283593'].forEach((color, index) => {
    const curtainX = 420 + index * 64;
    const sway = Math.sin(time * 2 + index) * 2;
    ctx.fillStyle = color;
    ctx.fillRect(curtainX + sway, 250, 56, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(index === 1 ? 'ゆ' : '♨', curtainX + 28 + sway, 296);
  });
  ctx.textAlign = 'left';
  // paper lanterns
  [300, 380, 640, 720].forEach((lanternX, index) => {
    const swing = Math.sin(time * 1.6 + index) * 3;
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lanternX, 210);
    ctx.lineTo(lanternX + swing, 228);
    ctx.stroke();
    const glow = ctx.createRadialGradient(lanternX + swing, 244, 2, lanternX + swing, 244, 40);
    glow.addColorStop(0, 'rgba(255, 138, 101, 0.55)');
    glow.addColorStop(1, 'rgba(255, 138, 101, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lanternX - 40, 204, 80, 80);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.ellipse(lanternX + swing, 244, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#212121';
    ctx.fillRect(lanternX - 6 + swing, 227, 12, 3);
    ctx.fillRect(lanternX - 6 + swing, 258, 12, 3);
  });
  // the stone courtyard: the ground everything stands on
  const yardTop = ground - 74;
  const yard = ctx.createLinearGradient(0, yardTop, 0, ground);
  yard.addColorStop(0, '#6d5d6e');
  yard.addColorStop(1, '#8a7a7c');
  ctx.fillStyle = yard;
  ctx.fillRect(0, yardTop, width, ground - yardTop);
  ctx.fillStyle = '#4e3f50';
  ctx.fillRect(0, yardTop, width, 4);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.lineWidth = 1;
  for (let row = 0; row < 4; row += 1) {
    const rowY = yardTop + 10 + row * 16;
    ctx.beginPath();
    ctx.moveTo(0, rowY);
    ctx.lineTo(width, rowY);
    for (let slab = (row % 2) * 30; slab < width; slab += 60) {
      ctx.moveTo(slab, rowY);
      ctx.lineTo(slab - 4, rowY + 16);
    }
    ctx.stroke();
  }
  // moss and small rocks along the bathhouse wall
  ctx.fillStyle = '#558b2f';
  for (let moss = 0; moss < width; moss += 26) ctx.fillRect(moss, yardTop + 2, 14 + (moss % 3) * 4, 3);
  ctx.fillStyle = '#9e9e9e';
  [[40, 1], [230, 0.8], [520, 1.1], [900, 0.9]].forEach(([rockX, size]) => {
    ctx.beginPath();
    ctx.ellipse(rockX, yardTop + 8, 12 * size, 7 * size, 0, Math.PI, 0);
    ctx.fill();
  });
  // a cherry blossom tree on the left
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(70, 200, 22, ground - 240);
  ctx.beginPath();
  ctx.moveTo(81, 240);
  ctx.lineTo(150, 180);
  ctx.lineTo(156, 188);
  ctx.lineTo(90, 254);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f8bbd0';
  [[60, 170, 60], [130, 150, 52], [30, 215, 40], [170, 190, 38], [95, 120, 44]].forEach(([blossomX, blossomY, size]) => {
    ctx.beginPath();
    ctx.arc(blossomX, blossomY, size, 0, Math.PI * 2);
    ctx.fill();
  });
  // a red torii gate in front of the tree
  ctx.fillStyle = '#c62828';
  ctx.fillRect(176, 270, 12, ground - 280);
  ctx.fillRect(244, 270, 12, ground - 280);
  ctx.fillRect(170, 292, 92, 8);
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.moveTo(156, 266);
  ctx.quadraticCurveTo(216, 254, 276, 266);
  ctx.lineTo(272, 276);
  ctx.quadraticCurveTo(216, 266, 160, 276);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c62828';
  ctx.fillRect(166, 274, 100, 6);
  // bamboo fence
  for (let pole = 790; pole < width; pole += 14) {
    ctx.fillStyle = pole % 28 ? '#9ccc65' : '#7cb342';
    ctx.fillRect(pole, 250, 11, ground - 290);
  }
  ctx.fillStyle = '#558b2f';
  ctx.fillRect(790, 300, width - 790, 5);
  ctx.fillRect(790, 400, width - 790, 5);
  // the chef's sweets stall
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(820, ground - 150, 180, 110);
  const chefHelping = typeof player2 !== 'undefined' && player2.secretVariant === 'mochiMouse' && player2.mochiChefHelp;
  const chefFighting = typeof player2 !== 'undefined' && player2.secretVariant === 'chefBoss';
  if (chefAtStall && !chefFighting) drawChefFigure(880, -1, false, 34, chefHelping ? player2.mochiChefThrowFx || 0 : 0);
  // the counter goes down to the floor, and the sign hangs in front of everything
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(820, ground - 90, 180, 90);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(810, ground - 186, 200, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 13px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PASTELES DEL LOTO', 910, ground - 169);
  // what the chef shouts when he throws
  if (chefHelping && player2.mochiChefShout && player2.mochiChefShoutTimer > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.fillRect(800, ground - 236, 200, 34);
    ctx.strokeRect(800, ground - 236, 200, 34);
    ctx.fillStyle = '#e65100';
    ctx.font = '900 14px Courier New, monospace';
    ctx.fillText(player2.mochiChefShout, 900, ground - 214);
  }
  ctx.textAlign = 'left';
  ['#f8bbd0', '#fff59d', '#c5e1a5', '#f8bbd0'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(834 + index * 42, ground - 104, 24, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(834 + index * 42, ground - 106, 24, 3);
  });
  // many hot tubs, bubbling and steaming (a broken one is cracked, empty and spilling)
  hotSpringTubs.forEach(([tubX, size], index) => {
    const tubY = ground - 34;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(tubX + 4, tubY + 10, 86 * size, 20 * size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5d5d5d';
    for (let stone = 0; stone < 10; stone += 1) {
      const angle = (Math.PI * 2 * stone) / 10;
      ctx.beginPath();
      ctx.ellipse(tubX + Math.cos(angle) * 78 * size, tubY + Math.sin(angle) * 22 * size, 11 * size, 7 * size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (hotSpringTubsBroken[index]) {
      ctx.fillStyle = 'rgba(77, 208, 225, 0.45)';
      ctx.beginPath();
      ctx.ellipse(tubX + 20, ground - 4, 110 * size, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#616161';
      ctx.beginPath();
      ctx.ellipse(tubX, tubY, 78 * size, 22 * size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3e3e3e';
      ctx.beginPath();
      ctx.ellipse(tubX, tubY, 66 * size, 16 * size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tubX - 30 * size, tubY - 20 * size);
      ctx.lineTo(tubX - 10 * size, tubY - 4);
      ctx.lineTo(tubX - 22 * size, tubY + 8);
      ctx.moveTo(tubX + 40 * size, tubY - 18 * size);
      ctx.lineTo(tubX + 28 * size, tubY);
      ctx.lineTo(tubX + 46 * size, tubY + 14 * size);
      ctx.stroke();
      ctx.fillStyle = '#757575';
      ctx.fillRect(tubX + 60 * size, tubY + 6, 14, 8);
      ctx.fillRect(tubX - 84 * size, tubY + 10, 10, 6);
      return;
    }
    ctx.fillStyle = '#757575';
    ctx.beginPath();
    ctx.ellipse(tubX, tubY, 78 * size, 22 * size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4dd0e1';
    ctx.beginPath();
    ctx.ellipse(tubX, tubY, 66 * size, 16 * size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let bubble = 0; bubble < 5; bubble += 1) {
      const bubblePhase = (time * 1.5 + bubble * 0.37 + index) % 1;
      ctx.beginPath();
      ctx.arc(tubX - 40 * size + bubble * 20 * size, tubY + 6 - bubblePhase * 10, 2 + bubblePhase * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let steam = 0; steam < 3; steam += 1) {
      const rise = (time * 18 + steam * 25 + index * 13) % 75;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.35 * (1 - rise / 75)})`;
      ctx.beginPath();
      ctx.arc(tubX - 30 + steam * 30 + Math.sin(time + steam) * 8, tubY - 20 - rise, 10 + rise / 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // stone lanterns between the tubs
  [255, 480, 690].forEach((lanternX, index) => {
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(lanternX - 4, ground - 40, 8, 32);
    ctx.fillRect(lanternX - 12, ground - 12, 24, 6);
    ctx.fillRect(lanternX - 11, ground - 58, 22, 18);
    ctx.beginPath();
    ctx.moveTo(lanternX - 18, ground - 58);
    ctx.lineTo(lanternX, ground - 72);
    ctx.lineTo(lanternX + 18, ground - 58);
    ctx.closePath();
    ctx.fill();
    const flicker = 0.7 + Math.sin(time * 9 + index * 2) * 0.2;
    ctx.fillStyle = `rgba(255, 183, 77, ${flicker})`;
    ctx.fillRect(lanternX - 6, ground - 54, 12, 10);
  });
  // a bamboo water fountain that tips over every few seconds
  const tip = Math.max(0, Math.sin(time * 1.2)) ** 8;
  ctx.save();
  ctx.translate(800, ground - 40);
  ctx.fillStyle = '#7cb342';
  ctx.fillRect(-2, 0, 5, 32);
  ctx.rotate(-0.35 + tip * 0.8);
  ctx.fillStyle = '#9ccc65';
  ctx.fillRect(-26, -5, 52, 9);
  ctx.fillStyle = '#558b2f';
  ctx.fillRect(22, -5, 4, 9);
  ctx.restore();
  // wooden deck
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(0, ground - 8, width, canvas.height - ground + 8);
  ctx.fillStyle = '#8d6e63';
  for (let plank = 0; plank < width; plank += 48) ctx.fillRect(plank, ground - 8, 3, canvas.height - ground + 8);
  ctx.fillRect(0, ground - 8, width, 3);
  // a soft haze of steam over everything
  const haze = ctx.createLinearGradient(0, ground - 140, 0, ground);
  haze.addColorStop(0, 'rgba(255, 255, 255, 0)');
  haze.addColorStop(1, 'rgba(255, 240, 245, 0.18)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, ground - 140, width, 140);
  // cherry petals in the air
  for (let petal = 0; petal < 16; petal += 1) {
    const petalX = (petal * 89 + time * (24 + (petal % 4) * 6)) % (width + 40) - 20;
    const petalY = (petal * 61 + time * (16 + (petal % 3) * 5)) % ground;
    ctx.fillStyle = 'rgba(248, 187, 208, 0.9)';
    ctx.beginPath();
    ctx.ellipse(petalX + Math.sin(time * 2 + petal) * 10, petalY, 4, 2.5, time + petal, 0, Math.PI * 2);
    ctx.fill();
  }
}

// level 4 intro: Knight wants to relax... and a tiny boxer challenges him
function startKnightSpaIntro() {
  player2.mochiPowered = false;
  ch6CutsceneBase('knightSpaIntro', knightSpaIntroLines, 'spaArrive', {
    gamblerX: -120,
    gamblerTargetX: 300,
    scammerX: canvas.width + 200,
    scammerTargetX: canvas.width + 200,
    scammerY: 0,
    mouseIn: false,
    chefOut: false,
  });
}

// after "A PELEAR!": Mochi's best barrage... and Knight does not even move (the last punch does 1 damage)
function startKnightMochiBarrage() {
  const heroX = Math.max(80, Math.min(canvas.width - 400, arcadeCutscene.gamblerX || 300));
  player2.mochiPowered = false;
  ch6CutsceneBase('knightMochiBarrage', knightMochiLines, 'mochiBarrage', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: arcadeCutscene.scammerX || 640,
    scammerTargetX: arcadeCutscene.scammerX || 640,
    scammerY: 0,
    pows: [],
    damageText: null,
    chefOut: false,
    chefX: 880,
    chefTargetX: 880,
    cakeEaten: false,
    cakeBurst: 0,
  });
}

function updateKnightSpa(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (cutscene.phase === 'spaArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 20) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  // Mochi hops in
  if (line && line.mouse === 'in' && !cutscene.mouseIn) {
    cutscene.mouseIn = true;
    cutscene.scammerX = canvas.width + 30;
    cutscene.scammerTargetX = 600;
  }
  if (cutscene.scene === 'knightSpaIntro') {
    cutscene.scammerY = cutscene.mouseIn && Math.abs(cutscene.scammerX - cutscene.scammerTargetX) > 2 ? Math.abs(Math.sin(cutscene.frame / 4)) * 22 : 0;
    return;
  }
  // the barrage
  if (cutscene.phase === 'mochiBarrage') {
    const frame = cutscene.frame;
    const front = cutscene.gamblerX + player1.width + 2;
    if (frame < 150) {
      cutscene.scammerX = moveToward(cutscene.scammerX, front, 14);
      cutscene.scammerTargetX = cutscene.scammerX;
      if (frame >= 12 && frame % 5 === 0) {
        player2.isAttacking = !player2.isAttacking;
        cutscene.pows.push({ x: cutscene.gamblerX + 10 + Math.random() * 40, y: ground - 50 - Math.random() * 60, life: 14, size: 0.7 + Math.random() * 0.5 });
        if (frame % 10 === 0) playSound('robotHit');
      }
      cutscene.scammerY = frame >= 12 ? Math.abs(Math.sin(frame / 3)) * 6 : 0;
    } else if (frame < 182) {
      // winding up the last punch
      player2.isAttacking = false;
      cutscene.scammerX = moveToward(cutscene.scammerX, front + 50, 3);
      cutscene.scammerTargetX = cutscene.scammerX;
      cutscene.scammerY = 0;
    } else if (frame === 182) {
      cutscene.scammerX = front;
      cutscene.scammerTargetX = front;
      player2.isAttacking = true;
      cutscene.pows.push({ x: cutscene.gamblerX + 30, y: ground - 70, life: 24, size: 1.6 });
      cutscene.damageText = { x: cutscene.gamblerX + player1.width / 2, y: ground - player1.height - 10, life: 70 };
      playSound('robotBoom');
    } else if (frame > 230) {
      player2.isAttacking = false;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  if (!line) return;
  // the chef walks over with a cake, Mochi eats it, the chef goes back to his stall
  if (line.chef === 'in' && !cutscene.chefOut) {
    cutscene.chefOut = true;
    cutscene.chefX = 880;
    cutscene.chefTargetX = Math.min(canvas.width - 80, cutscene.scammerX + 70);
  }
  if (line.chef === 'back') cutscene.chefTargetX = 880;
  if (cutscene.scene === 'knightChefFury' && line.chef === 'in' && !cutscene.chefOut) {
    cutscene.chefOut = true;
    cutscene.chefX = 880;
    cutscene.chefTargetX = Math.max(80, Math.min(canvas.width - 140, cutscene.gamblerX + 260));
    cutscene.scammerTargetX = canvas.width - 100;
    playSound('cutsceneAngry');
  }
  if (line.secondRound && !cutscene.secondRoundDone) {
    cutscene.secondRoundDone = true;
    player2.health = Math.max(player2.health, player2.maxHealth * mochiSecondRoundRatio);
    player2.mochiCakeFx = 30;
    cutscene.cakeBurst = 40;
    playSound('judgeLight');
    playSound('achievement');
    updateHealthBars();
  }
  if (line.cake && !cutscene.cakeEaten) {
    cutscene.cakeEaten = true;
    cutscene.cakeBurst = 40;
    player2.mochiPowered = true;
    player2.mochiCakeFx = 30;
    playSound('judgeLight');
    playSound('achievement');
  }
  if (cutscene.cakeBurst > 0) cutscene.cakeBurst -= 1;
  if (player2.mochiCakeFx > 0) player2.mochiCakeFx -= 1;
  if (cutscene.chefOut) {
    cutscene.chefX = moveToward(cutscene.chefX, cutscene.chefTargetX, cutscene.scene === 'knightChefFury' ? 7 : 4);
    if (cutscene.chefTargetX === 880 && cutscene.chefX === 880) cutscene.chefOut = false;
  }
}

function drawMochiBarrageFx(cutscene) {
  const time = performance.now() / 1000;
  if (cutscene.chefOut) drawChefFigure(cutscene.chefX, cutscene.chefTargetX < cutscene.chefX || cutscene.chefX > cutscene.scammerX ? -1 : 1, !cutscene.cakeEaten);
  (cutscene.pows || []).forEach((pow) => {
    pow.life -= 1;
    ctx.save();
    ctx.translate(pow.x, pow.y);
    ctx.scale(pow.size, pow.size);
    ctx.fillStyle = '#fff176';
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let point = 0; point < 12; point += 1) {
      const radius = point % 2 ? 7 : 16;
      const angle = (Math.PI * 2 * point) / 12;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e65100';
    ctx.font = '900 9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('POW', 0, 3);
    ctx.restore();
  });
  cutscene.pows = (cutscene.pows || []).filter((pow) => pow.life > 0);
  if (cutscene.damageText && cutscene.damageText.life > 0) {
    const text = cutscene.damageText;
    text.life -= 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, text.life / 20)})`;
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.font = '900 30px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.strokeText('-1', text.x, text.y - (70 - text.life) * 0.6);
    ctx.fillText('-1', text.x, text.y - (70 - text.life) * 0.6);
    ctx.textAlign = 'left';
  }
  if (cutscene.cakeBurst > 0) {
    const centerX = cutscene.scammerX + player2.width / 2;
    ctx.strokeStyle = `rgba(255, 213, 79, ${cutscene.cakeBurst / 40})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(centerX, ground - 40, 20 + (40 - cutscene.cakeBurst) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.cakeBurst / 40})`;
    for (let sparkle = 0; sparkle < 10; sparkle += 1) {
      const angle = sparkle * 0.63 + time * 3;
      ctx.fillRect(centerX + Math.cos(angle) * (30 + (40 - cutscene.cakeBurst) * 2), ground - 40 + Math.sin(angle) * (30 + (40 - cutscene.cakeBurst) * 2), 4, 4);
    }
  }
}

// Knight broke a hot tub: the chef storms out of his stall
function startKnightChefFury() {
  knightChefFuryDone = true;
  const mochi = player2;
  mochi.mochiChefHelp = false;
  mochi.mochiPastries = [];
  mochi.mochiFlurryTimer = 0;
  mochi.mochiUppercutTimer = 0;
  [player1, player2].forEach((fighter) => {
    fighter.knightShieldTimer = 0;
    fighter.knightLungeTimer = 0;
    fighter.knightSlam = null;
    fighter.knightWaves = [];
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  resetKeys();
  const heroX = Math.max(60, Math.min(canvas.width - 400, player1.position.x));
  ch6CutsceneBase('knightChefFury', knightChefFuryLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: Math.max(40, Math.min(canvas.width - 80, player2.position.x)),
    scammerTargetX: Math.max(40, Math.min(canvas.width - 80, player2.position.x)),
    scammerY: 0,
    chefOut: false,
    chefX: 880,
    chefTargetX: 880,
    pows: [],
    damageText: null,
    cakeEaten: true,
    cakeBurst: 0,
  });
  playSound('robotBoom');
  startCutsceneLine(0);
}

// ---------- level 4 ending ----------
// the Gran Farol de Robledal: a tall stone pillar with an ornate golden cage, a crystal flame
// and a beam of light that shines straight up into the sky
function drawGreatLantern(centerX, baseY, scale = 1, beamHeight = 600, focus = 0) {
  const time = performance.now() / 1000;
  const pulse = 0.85 + Math.sin(time * 2) * 0.15 + focus * 0.3;
  ctx.save();
  // the beam into the sky
  const beamTop = baseY - beamHeight;
  const beam = ctx.createLinearGradient(0, beamTop, 0, baseY - 150 * scale);
  beam.addColorStop(0, 'rgba(255, 245, 157, 0)');
  beam.addColorStop(1, `rgba(255, 245, 157, ${0.45 * pulse})`);
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(centerX - 14 * scale, baseY - 150 * scale);
  ctx.lineTo(centerX + 14 * scale, baseY - 150 * scale);
  ctx.lineTo(centerX + 46 * scale, beamTop);
  ctx.lineTo(centerX - 46 * scale, beamTop);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * pulse})`;
  ctx.fillRect(centerX - 3 * scale, beamTop, 6 * scale, baseY - 150 * scale - beamTop);
  // floating sparks rising up the beam
  for (let spark = 0; spark < 10; spark += 1) {
    const rise = (time * 60 + spark * 47) % (beamHeight - 150 * scale);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - rise / beamHeight})`;
    ctx.fillRect(centerX + Math.sin(time * 3 + spark) * 20 * scale, baseY - 150 * scale - rise, 3 * scale + 1, 3 * scale + 1);
  }
  // halo
  const halo = ctx.createRadialGradient(centerX, baseY - 120 * scale, 4, centerX, baseY - 120 * scale, 120 * scale);
  halo.addColorStop(0, `rgba(255, 241, 118, ${0.6 * pulse})`);
  halo.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(centerX - 120 * scale, baseY - 240 * scale, 240 * scale, 240 * scale);
  // the stone pillar
  ctx.fillStyle = '#78909c';
  ctx.fillRect(centerX - 16 * scale, baseY - 90 * scale, 32 * scale, 90 * scale);
  ctx.fillStyle = '#90a4ae';
  ctx.fillRect(centerX - 26 * scale, baseY - 10 * scale, 52 * scale, 10 * scale);
  ctx.fillRect(centerX - 22 * scale, baseY - 96 * scale, 44 * scale, 8 * scale);
  // the golden cage and the crystal flame
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX - 20 * scale, baseY - 96 * scale);
  ctx.lineTo(centerX - 24 * scale, baseY - 140 * scale);
  ctx.lineTo(centerX, baseY - 162 * scale);
  ctx.lineTo(centerX + 24 * scale, baseY - 140 * scale);
  ctx.lineTo(centerX + 20 * scale, baseY - 96 * scale);
  ctx.moveTo(centerX, baseY - 162 * scale);
  ctx.lineTo(centerX, baseY - 176 * scale);
  ctx.stroke();
  ctx.shadowColor = '#fff59d';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#fffde7';
  ctx.beginPath();
  ctx.moveTo(centerX, baseY - 146 * scale - Math.sin(time * 6) * 3 * scale);
  ctx.lineTo(centerX + 12 * scale, baseY - 120 * scale);
  ctx.lineTo(centerX, baseY - 102 * scale);
  ctx.lineTo(centerX - 12 * scale, baseY - 120 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// a narrow alley of Robledal at night: brick walls, laundry lines, barrels and crates... and at the end,
// above the rooftops, the Gran Farol shining into the sky
function drawRobledalAlleyStage(lanternFocus = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#0d1033');
  sky.addColorStop(1, '#283069');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  for (let star = 0; star < 30; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 131 + 17) % width, (star * 47) % 200, 2, 2);
  }
  // rooftops in the distance, and the great lantern above them
  ctx.fillStyle = '#1a1d40';
  for (let roofX = 260; roofX < 780; roofX += 70) {
    ctx.beginPath();
    ctx.moveTo(roofX, 330);
    ctx.lineTo(roofX + 35, 296 - (roofX % 3) * 8);
    ctx.lineTo(roofX + 70, 330);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(250, 330, 540, ground - 330);
  drawGreatLantern(520, 320, 0.9, 340, lanternFocus);
  // the two walls of the alley
  [[0, 260, 1], [width - 260, width, -1]].forEach(([left, right, side]) => {
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(left, 60, right - left, ground - 60);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 2;
    for (let row = 0; row * 22 < ground - 60; row += 1) {
      const rowY = 60 + row * 22;
      ctx.beginPath();
      ctx.moveTo(left, rowY);
      ctx.lineTo(right, rowY);
      for (let brickX = left + (row % 2) * 22; brickX < right; brickX += 44) {
        ctx.moveTo(brickX, rowY);
        ctx.lineTo(brickX, rowY + 22);
      }
      ctx.stroke();
    }
    // windows: one lit, one dark
    ctx.fillStyle = 'rgba(255, 213, 79, 0.75)';
    ctx.fillRect(side > 0 ? 70 : width - 130, 130, 50, 60);
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(side > 0 ? 150 : width - 210, 250, 50, 60);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 4;
    ctx.strokeRect(side > 0 ? 70 : width - 130, 130, 50, 60);
    ctx.strokeRect(side > 0 ? 150 : width - 210, 250, 50, 60);
  });
  // a laundry line across the alley
  ctx.strokeStyle = '#bdbdbd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(260, 200);
  ctx.quadraticCurveTo(512, 236, width - 260, 200);
  ctx.stroke();
  ['#ef9a9a', '#90caf9', '#fff59d', '#a5d6a7'].forEach((color, index) => {
    const clothX = 320 + index * 110;
    const sag = Math.sin(((clothX - 260) / (width - 520)) * Math.PI) * 36;
    ctx.fillStyle = color;
    ctx.fillRect(clothX + Math.sin(time * 2 + index) * 2, 200 + sag, 34, 40);
  });
  // a street lamp on the left wall
  ctx.fillStyle = '#263238';
  ctx.fillRect(260, 300, 30, 4);
  ctx.fillRect(284, 300, 4, 20);
  const lampGlow = ctx.createRadialGradient(286, 330, 4, 286, 330, 120);
  lampGlow.addColorStop(0, 'rgba(255, 204, 128, 0.5)');
  lampGlow.addColorStop(1, 'rgba(255, 204, 128, 0)');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(166, 210, 240, 240);
  ctx.fillStyle = '#ffcc80';
  ctx.fillRect(278, 320, 16, 18);
  // barrels and crates, and a deep shadow on the right where someone could hide
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(300, ground - 60, 50, 60);
  ctx.fillRect(350, ground - 40, 40, 40);
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 3;
  ctx.strokeRect(300, ground - 60, 50, 60);
  ctx.strokeRect(350, ground - 40, 40, 40);
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.ellipse(700, ground - 30, 24, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(676, ground - 44, 48, 4);
  ctx.fillRect(676, ground - 20, 48, 4);
  const shadow = ctx.createLinearGradient(width - 340, 0, width - 200, 0);
  shadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadow.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = shadow;
  ctx.fillRect(width - 340, 60, 140, ground - 60);
  // cobblestones
  ctx.fillStyle = '#37474f';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#455a64';
  for (let row = 0; row < 3; row += 1) {
    for (let stoneX = (row % 2) * 20; stoneX < width; stoneX += 40) {
      ctx.beginPath();
      ctx.ellipse(stoneX + 16, ground + 10 + row * 18, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// a short victory at the hot springs (Mochi or the chef, depending on who Knight beat)
function startKnightSpaVictory() {
  knightSpaOutroPlayed = true;
  const beatChef = player2.secretVariant === 'chefBoss';
  if (player2.mochiPastries) player2.mochiPastries = [];
  if (player2.chefShots) player2.chefShots = [];
  const heroX = Math.max(60, Math.min(canvas.width - 300, player1.position.x));
  let rivalX = Math.max(80, Math.min(canvas.width - 160, player2.position.x));
  if (Math.abs(rivalX - heroX) < 180) rivalX = heroX + 220;
  [player1, player2].forEach((fighter) => {
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  ch6CutsceneBase('knightSpaVictory', beatChef ? knightSpaChefVictoryLines : knightSpaVictoryLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: rivalX,
    scammerTargetX: rivalX,
    scammerY: 0,
    chefOut: beatChef,
  });
  startCutsceneLine(0);
}

// on the way out: the alley, the great lantern... and a dark knight with a new order
function startKnightAlley() {
  player2.setCharacterType('normal', 'darkKnight');
  resetKnightState(player2);
  player2.health = 1;
  ch6CutsceneBase('knightAlley', knightAlleyLines, 'alleyWalk', {
    gamblerX: -120,
    gamblerTargetX: 200,
    scammerX: canvas.width - 220,
    scammerTargetX: canvas.width - 220,
    scammerY: 0,
    darkOut: false,
    lanternFocus: 0,
  });
  selectedMap = 'robledalAlley';
}

function updateKnightAlley(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (cutscene.phase === 'alleyWalk') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 2.6);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 18 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 30) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  if (!line) return;
  // the dark knight steps out of the shadow
  if (line.dark === 'out' && !cutscene.darkOut) {
    cutscene.darkOut = true;
    cutscene.scammerTargetX = canvas.width - 330;
  }
  cutscene.lanternFocus = line.lantern ? Math.min(1, (cutscene.lanternFocus || 0) + 0.04) : Math.max(0, (cutscene.lanternFocus || 0) - 0.03);
  if (line.retreat) cutscene.scammerTargetX = canvas.width + 120;
}

// ---------- level 5: the jail of Robledal ----------
// a stone jail with barred windows next to the new sheriff's wooden office, wanted posters (one of them is Knight's),
// a hitching post, a water trough, barrels and a tumbleweed rolling down the dusty street
function drawRobledalJailStage(posterFocus = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#ff8a65');
  sky.addColorStop(0.6, '#ffcc80');
  sky.addColorStop(1, '#fff3e0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  ctx.fillStyle = 'rgba(255, 236, 179, 0.9)';
  ctx.beginPath();
  ctx.arc(860, 150, 46, 0, Math.PI * 2);
  ctx.fill();
  // the town behind
  ctx.fillStyle = '#bcaaa4';
  [[0, 280, 90], [100, 260, 80], [700, 270, 90], [800, 250, 110], [920, 280, 104]].forEach(([houseX, top, houseWidth]) => {
    ctx.fillRect(houseX, top, houseWidth, ground - top);
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(houseX - 6, top);
    ctx.lineTo(houseX + houseWidth / 2, top - 34);
    ctx.lineTo(houseX + houseWidth + 6, top);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#bcaaa4';
  });
  // the stone jail
  ctx.fillStyle = '#78909c';
  ctx.fillRect(170, 170, 330, ground - 210);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  for (let row = 0; row * 24 < ground - 210; row += 1) {
    const rowY = 170 + row * 24;
    ctx.beginPath();
    ctx.moveTo(170, rowY);
    ctx.lineTo(500, rowY);
    for (let stoneX = 170 + (row % 2) * 24; stoneX < 500; stoneX += 48) {
      ctx.moveTo(stoneX, rowY);
      ctx.lineTo(stoneX, rowY + 24);
    }
    ctx.stroke();
  }
  ctx.fillStyle = '#546e7a';
  for (let merlon = 170; merlon < 500; merlon += 40) ctx.fillRect(merlon, 150, 24, 20);
  ctx.fillStyle = '#37474f';
  ctx.font = '900 18px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PRISION', 335, 196);
  // barred windows with prisoners peeking out
  [[210, 230], [300, 230], [390, 230]].forEach(([windowX, windowY], index) => {
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(windowX, windowY, 60, 54);
    ctx.fillStyle = '#5d4037';
    if (index !== 1) {
      ctx.fillRect(windowX + 18, windowY + 22 + Math.sin(time * 1.5 + index) * 2, 24, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(windowX + 23, windowY + 30 + Math.sin(time * 1.5 + index) * 2, 4, 3);
      ctx.fillRect(windowX + 33, windowY + 30 + Math.sin(time * 1.5 + index) * 2, 4, 3);
    }
    ctx.fillStyle = '#90a4ae';
    for (let bar = windowX + 6; bar < windowX + 60; bar += 12) ctx.fillRect(bar, windowY, 4, 54);
  });
  // the iron door
  ctx.fillStyle = '#37474f';
  ctx.fillRect(310, ground - 120, 60, 80);
  ctx.fillStyle = '#263238';
  for (let rivet = 0; rivet < 4; rivet += 1) ctx.fillRect(316 + rivet * 14, ground - 112, 4, 64);
  ctx.fillStyle = '#ffca28';
  ctx.fillRect(358, ground - 84, 6, 6);
  // the sheriff's wooden office
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(500, 230, 200, ground - 270);
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 2;
  for (let plank = 500; plank < 700; plank += 20) {
    ctx.beginPath();
    ctx.moveTo(plank, 230);
    ctx.lineTo(plank, ground - 40);
    ctx.stroke();
  }
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(490, 210, 220, 24);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(540, 186, 120, 30);
  ctx.fillStyle = '#fdd835';
  ctx.font = '900 18px Courier New, monospace';
  ctx.fillText('SHERIFF', 600, 207);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(570, ground - 110, 54, 70);
  ctx.fillStyle = '#ffe082';
  ctx.fillRect(520, 270, 34, 34);
  ctx.fillRect(650, 270, 34, 34);
  // wanted posters on the wall (the middle one is Knight)
  [[514, 330, false], [646, 330, false], [580, 300, true]].forEach(([posterX, posterY, knightPoster]) => {
    const scale = knightPoster ? 1 + posterFocus * 0.5 : 1;
    ctx.save();
    ctx.translate(posterX + 17, posterY + 22);
    ctx.scale(scale, scale);
    ctx.rotate(knightPoster ? -0.04 : 0.05);
    if (knightPoster && posterFocus > 0) {
      ctx.shadowColor = '#ffeb3b';
      ctx.shadowBlur = 16 * posterFocus;
    }
    ctx.fillStyle = '#f3e5ab';
    ctx.fillRect(-17, -22, 34, 44);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#4e342e';
    ctx.font = '900 6px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SE BUSCA', 0, -14);
    if (knightPoster) {
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(-7, -10, 14, 18);
      ctx.fillStyle = '#111';
      ctx.fillRect(-6, -6, 12, 2);
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(-3, -13, 6, 3);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-5, 0, 10, 8);
    } else {
      ctx.fillStyle = '#795548';
      ctx.fillRect(-7, -10, 14, 16);
    }
    ctx.fillStyle = '#b71c1c';
    ctx.fillText('$$$', 0, 18);
    ctx.textAlign = 'left';
    ctx.restore();
  });
  // a hitching post, a water trough and barrels
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(730, ground - 70, 8, 70);
  ctx.fillRect(830, ground - 70, 8, 70);
  ctx.fillRect(724, ground - 66, 120, 8);
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(110, ground - 46, 70, 30);
  ctx.fillStyle = '#4fc3f7';
  ctx.fillRect(114, ground - 44, 62, 6);
  ctx.fillStyle = '#795548';
  [[880, 1], [930, 0.9]].forEach(([barrelX, size]) => {
    ctx.beginPath();
    ctx.ellipse(barrelX, ground - 30 * size, 22 * size, 30 * size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(barrelX - 22 * size, ground - 44 * size, 44 * size, 4);
    ctx.fillRect(barrelX - 22 * size, ground - 20 * size, 44 * size, 4);
    ctx.fillStyle = '#795548';
  });
  // the dusty street
  ctx.fillStyle = '#d7b98e';
  ctx.fillRect(0, ground - 40, width, canvas.height - ground + 40);
  ctx.fillStyle = '#c4a57a';
  for (let rut = 0; rut < width; rut += 80) {
    ctx.fillRect(rut + 10, ground - 22, 46, 3);
    ctx.fillRect(rut + 40, ground + 14, 36, 3);
  }
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(0, ground, width, 3);
  // a tumbleweed rolling by
  const weedX = (time * 90) % (width + 200) - 100;
  ctx.save();
  ctx.translate(weedX, ground - 16 - Math.abs(Math.sin(time * 5)) * 14);
  ctx.rotate(time * 6);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2;
  for (let twig = 0; twig < 6; twig += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 14, twig, twig + 2.2);
    ctx.stroke();
  }
  ctx.restore();
}

// level 5 intro: the sheriff waits by the jail... with a wanted poster
function startKnightJailIntro() {
  let reunion = false;
  try {
    reunion = localStorage.getItem(knightMetCowboyStorageKey) === '1';
  } catch (error) {
    reunion = false;
  }
  ch6CutsceneBase('knightJailIntro', reunion ? knightJailReunionLines : knightJailIntroLines, 'jailArrive', {
    gamblerX: -120,
    gamblerTargetX: 220,
    scammerX: 650,
    scammerTargetX: 650,
    scammerY: 0,
    posterFocus: 0,
  });
}

function updateKnightJail(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player1.knightGlow = line && line.glow ? 1 : 0;
  if (cutscene.phase === 'jailArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 3);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 16 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 20) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  // the wanted poster lights up while they talk about the reward
  cutscene.posterFocus = line && line.poster ? Math.min(1, (cutscene.posterFocus || 0) + 0.05) : Math.max(0, (cutscene.posterFocus || 0) - 0.04);
}

// the sheriff gets back up at 1 health
function startKnightSheriffStand() {
  const sheriff = player2;
  sheriff.sheriffStandStarted = true;
  sheriff.health = 1;
  [player1, player2].forEach((fighter) => {
    fighter.knightShieldTimer = 0;
    fighter.knightLungeTimer = 0;
    fighter.knightSlam = null;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  cowboyBullets = [];
  resetKeys();
  // a flawless first round drives him crazy
  sheriff.sheriffFurious = player1.health > player1.maxHealth * sheriffFuriousHealthRatio;
  startMidFightCh7Cutscene('knightSheriffStand', sheriff.sheriffFurious ? knightSheriffFuriousLines : knightSheriffStandLines, 'dialog', { posterFocus: 0 });
}

// 25 seconds later, he finally falls... standing tall
function startKnightSheriffEnd() {
  const sheriff = player2;
  sheriff.sheriffStandActive = false;
  cowboyBullets = [];
  resetKeys();
  startMidFightCh7Cutscene('knightSheriffEnd', sheriff.sheriffFurious ? knightSheriffFuriousEndLines : knightSheriffEndLines, 'dialog', { posterFocus: 0 });
}

// ---------- level 6: at the foot of the Gran Farol ----------
// a stone plaza on top of the hill at night: the great lantern right behind, stairs, a guard booth,
// the lights of Robledal far below... and, in the bushes, someone watching (red eyes when hiddenEyes)
function drawLanternHillStage(hiddenEyes = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#05081f');
  sky.addColorStop(0.7, '#1a1f4a');
  sky.addColorStop(1, '#2c2a5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  for (let star = 0; star < 40; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 1.5 + star) * 0.3})`;
    ctx.fillRect((star * 113 + 29) % width, (star * 59) % 260, 2, 2);
  }
  // the moon and a few clouds lit by the beam
  const moonGlow = ctx.createRadialGradient(140, 90, 10, 140, 90, 110);
  moonGlow.addColorStop(0, 'rgba(232, 234, 246, 0.4)');
  moonGlow.addColorStop(1, 'rgba(232, 234, 246, 0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(30, -20, 220, 220);
  ctx.fillStyle = '#e8eaf6';
  ctx.beginPath();
  ctx.arc(140, 90, 30, 0, Math.PI * 2);
  ctx.fill();
  [[400, 60, 1], [640, 40, 1.2], [820, 110, 0.9]].forEach(([cloudX, cloudY, size], index) => {
    const drift = (cloudX + time * (4 + index)) % (width + 200) - 100;
    const lit = Math.max(0, 1 - Math.abs(drift - 512) / 220);
    ctx.fillStyle = `rgba(${Math.round(60 + lit * 150)}, ${Math.round(64 + lit * 140)}, ${Math.round(110 + lit * 60)}, 0.7)`;
    ctx.beginPath();
    ctx.ellipse(drift, cloudY, 60 * size, 14 * size, 0, 0, Math.PI * 2);
    ctx.ellipse(drift + 38 * size, cloudY - 8 * size, 38 * size, 15 * size, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // the roofs and windows of Robledal far below
  ctx.fillStyle = '#141633';
  ctx.fillRect(0, 360, width, ground - 360);
  for (let house = 0; house < 18; house += 1) {
    const houseX = house * 60 - 10;
    const top = 352 + (house % 3) * 8;
    ctx.fillStyle = '#1c1f45';
    ctx.fillRect(houseX, top, 48, ground - top);
    ctx.beginPath();
    ctx.moveTo(houseX - 4, top);
    ctx.lineTo(houseX + 24, top - 16);
    ctx.lineTo(houseX + 52, top);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255, 204, 128, ${0.55 + Math.sin(time * 1.5 + house) * 0.2})`;
    ctx.fillRect(houseX + 10, top + 10, 6, 6);
    if (house % 2) ctx.fillRect(houseX + 30, top + 14, 6, 6);
  }
  // the round stone dais of the great lantern, and the lantern itself, huge, right behind the plaza
  ctx.fillStyle = '#3b3f5c';
  ctx.beginPath();
  ctx.ellipse(512, ground - 70, 150, 20, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#4a4e69';
  ctx.fillRect(400, ground - 92, 224, 22);
  ctx.fillStyle = '#5c6080';
  ctx.fillRect(420, ground - 108, 184, 16);
  drawGreatLantern(512, ground - 108, 1.5, ground + 40);
  // floating motes of light around it
  for (let mote = 0; mote < 16; mote += 1) {
    const angle = time * 0.6 + mote * 0.39;
    const radius = 90 + (mote % 4) * 26;
    ctx.fillStyle = `rgba(255, 249, 196, ${0.4 + Math.sin(time * 3 + mote) * 0.3})`;
    ctx.fillRect(512 + Math.cos(angle) * radius, ground - 230 + Math.sin(angle * 1.3) * 70, 3, 3);
  }
  // banners of the lantern on both sides
  [372, 652].forEach((poleX, index) => {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(poleX - 2, ground - 250, 4, 180);
    const sway = Math.sin(time * 1.4 + index) * 3;
    ctx.fillStyle = '#1a237e';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, ground - 244);
    ctx.lineTo(poleX + 40, ground - 244 + sway);
    ctx.lineTo(poleX + 40 + sway, ground - 170);
    ctx.lineTo(poleX + 21, ground - 182);
    ctx.lineTo(poleX + 2, ground - 170);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(poleX + 15, ground - 228, 12, 18);
    ctx.fillStyle = '#fff59d';
    ctx.fillRect(poleX + 18, ground - 224, 6, 10);
  });
  // stone plaza with a low wall and stairs
  ctx.fillStyle = '#4a4e69';
  ctx.fillRect(0, ground - 70, width, 70);
  ctx.fillStyle = '#5c6080';
  for (let block = 0; block < width; block += 64) ctx.fillRect(block + 2, ground - 70, 60, 10);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 3; row += 1) {
    ctx.beginPath();
    ctx.moveTo(0, ground - 56 + row * 18);
    ctx.lineTo(width, ground - 56 + row * 18);
    ctx.stroke();
  }
  // a guard booth on the left, with a banner of the lantern
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(40, ground - 190, 110, 120);
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.moveTo(30, ground - 190);
  ctx.lineTo(95, ground - 230);
  ctx.lineTo(160, ground - 190);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffcc80';
  ctx.fillRect(70, ground - 160, 40, 30);
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(170, ground - 240, 40, 90);
  ctx.fillStyle = '#fbc02d';
  ctx.fillRect(184, ground - 220, 12, 20);
  // torches on the plaza
  [250, 774].forEach((torchX, index) => {
    const flicker = Math.sin(time * 15 + index) * 3;
    const glow = ctx.createRadialGradient(torchX, ground - 120, 4, torchX, ground - 120, 80);
    glow.addColorStop(0, 'rgba(255, 167, 38, 0.45)');
    glow.addColorStop(1, 'rgba(255, 167, 38, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(torchX - 80, ground - 200, 160, 160);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(torchX - 3, ground - 110, 6, 40);
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.moveTo(torchX - 7, ground - 110);
    ctx.quadraticCurveTo(torchX, ground - 138 + flicker, torchX + 7, ground - 110);
    ctx.closePath();
    ctx.fill();
  });
  // a stone railing along the edge of the plaza, and flower beds that glow softly
  ctx.fillStyle = '#6a6e8c';
  ctx.fillRect(0, ground - 82, 380, 6);
  ctx.fillRect(644, ground - 82, width - 644, 6);
  for (let post = 10; post < width; post += 46) {
    if (post > 380 && post < 644) continue;
    ctx.fillRect(post, ground - 82, 8, 16);
  }
  [[300, '#ce93d8'], [724, '#80deea']].forEach(([bedX, color], index) => {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(bedX - 40, ground - 74, 80, 8);
    for (let flower = 0; flower < 7; flower += 1) {
      const glow = 0.6 + Math.sin(time * 2 + flower + index) * 0.25;
      ctx.fillStyle = hexToRgba(color, glow);
      ctx.beginPath();
      ctx.arc(bedX - 34 + flower * 11, ground - 80, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // dark bushes on the right... with someone hiding inside
  ctx.fillStyle = '#0d1a14';
  [[880, 40], [930, 50], [990, 42]].forEach(([bushX, size]) => {
    ctx.beginPath();
    ctx.arc(bushX, ground - 70, size, Math.PI, 0);
    ctx.fill();
  });
  if (hiddenEyes > 0) {
    ctx.save();
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 14;
    ctx.fillStyle = `rgba(255, 23, 68, ${0.6 + Math.sin(time * 6) * 0.3})`;
    ctx.fillRect(916, ground - 104, 9, 4);
    ctx.fillRect(934, ground - 104, 9, 4);
    ctx.restore();
  }
}

// level 6 intro: the guard of the farol stops Knight
function startKnightGuardIntro() {
  ch6CutsceneBase('knightGuardIntro', knightGuardIntroLines, 'guardArrive', {
    gamblerX: -120,
    gamblerTargetX: 230,
    scammerX: 660,
    scammerTargetX: 660,
    scammerY: 0,
    darkEyes: false,
  });
}

// at 10%: Knight stops... and the Orden Sombria takes control of him
function startKnightGuardFall() {
  const guard = player2;
  guard.guardFallScene = true;
  [player1, player2].forEach((fighter) => {
    fighter.knightShieldTimer = 0;
    fighter.knightLungeTimer = 0;
    fighter.knightSlam = null;
    fighter.knightWaves = [];
    fighter.guardSweepTimer = 0;
    fighter.guardThrustTimer = 0;
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.position.y = ground - fighter.height;
  });
  resetKeys();
  const heroX = Math.max(80, Math.min(canvas.width - 400, player1.position.x));
  let guardX = Math.max(80, Math.min(canvas.width - 220, player2.position.x));
  if (Math.abs(guardX - heroX) < 200) guardX = heroX + 230;
  ch6CutsceneBase('knightGuardFall', knightGuardFallLines, 'dialog', {
    gamblerX: heroX,
    gamblerTargetX: heroX,
    scammerX: guardX,
    scammerTargetX: guardX,
    scammerY: 0,
    darkEyes: false,
    strikeDone: false,
    afterimages: [],
    halberd: null,
    cracks: 0,
    lwActor: null,
    lwLeaving: false,
    lwY: 0,
    flash: 0,
    stare: false,
  });
  startCutsceneLine(0);
}

function updateKnightGuard(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (cutscene.phase === 'guardArrive') {
    const heroX = cutscene.gamblerX;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, cutscene.gamblerTargetX, 2.6);
    if (cutscene.gamblerX !== heroX) {
      if (cutscene.frame % 18 === 0) playSound('cutsceneStep');
    } else if (cutscene.frame > 30) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  if (cutscene.scene !== 'knightGuardFall') return;
  if (cutscene.flash > 0) cutscene.flash -= 1;
  // the possession
  if (line && line.possess) {
    cutscene.darkEyes = true;
    player1.knightPossessed = true;
  }
  if (line && line.strike && !cutscene.strikeDone) {
    cutscene.phase = 'strike';
    cutscene.frame = 0;
    cutscene.strikeFrom = cutscene.gamblerX;
    return;
  }
  if (cutscene.phase === 'strike') {
    const frame = cutscene.frame;
    player1.knightPossessed = true;
    if (frame === 1) playSound('judgeFinalStart');
    if (frame === 20) playSound('judgeOverdrive');
    if (frame >= 40 && frame < 58) {
      // the lunge he does not want to make, in slow motion, leaving afterimages behind
      const goal = cutscene.scammerX - player1.width + 6;
      const previous = cutscene.gamblerX;
      cutscene.gamblerX = cutscene.strikeFrom + (goal - cutscene.strikeFrom) * ((frame - 39) / 18);
      cutscene.gamblerTargetX = cutscene.gamblerX;
      if (frame % 3 === 0) (cutscene.afterimages = cutscene.afterimages || []).push({ x: previous, life: 24 });
      player1.knightLungeTimer = 2;
      player1.knightLungeDirection = 1;
    }
    if (frame === 58) {
      player2.guardFallen = true;
      player2.guardFallProgress = 0;
      player2.guardDisarmed = true;
      cutscene.halberd = { x: cutscene.scammerX + 40, y: ground - 110, vx: 5, vy: -12, rotation: 0 };
      cutscene.flash = 34;
      cutscene.shake = 26;
      cutscene.cracks = 60;
      playSound('robotBoom');
      playSound('judgeFinalHurt');
    }
    if (frame > 60) player1.knightLungeTimer = 0;
    // he falls slowly, and the lantern on his belt flickers... and goes out
    if (frame > 58) player2.guardFallProgress = Math.min(1, (frame - 58) / 50);
    if (frame > 100) player2.guardLanternOut = frame % 9 < 4 || frame > 130;
    if (frame === 132) playSound('bubblePop');
    if (frame >= 190) {
      player1.knightPossessed = false;
      cutscene.darkEyes = false;
      cutscene.strikeDone = true;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(cutscene.lineIndex + 1);
    }
    return;
  }
  if (line && !line.possess && !line.strike) player1.knightPossessed = false;
  // Light Warrior arrives at the worst moment
  if (line && line.lw === 'in' && !cutscene.lwActor) {
    const actor = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: false });
    actor.setCharacterType('lightWarrior');
    cutscene.lwActor = actor;
    cutscene.lwX = Math.max(20, cutscene.gamblerX - 120);
    cutscene.lwY = 420;
    playSound('judgeLight');
  }
  if (cutscene.lwActor) {
    cutscene.lwY = Math.max(0, cutscene.lwY - 12);
    if (line && line.lw === 'leave') {
      cutscene.lwX = moveToward(cutscene.lwX, canvas.width + 120, 3);
      cutscene.lwLeaving = true;
    }
  }
  cutscene.stare = Boolean(line && line.stare);
}

function drawKnightGuardFallFx(cutscene) {
  const time = performance.now() / 1000;
  // Light Warrior (coming down in a column of light, or walking off toward the farol)
  if (cutscene.lwActor) {
    const actor = cutscene.lwActor;
    actor.position = { x: cutscene.lwX, y: ground - actor.height - cutscene.lwY };
    actor.attacksToTheRight = true;
    actor.isAttacking = false;
    // his eyes are on Knight while he talks (and on the farol when he leaves)
    actor.eyeLook = 1;
    if (cutscene.lwY > 0) {
      ctx.fillStyle = 'rgba(255, 249, 196, 0.3)';
      ctx.fillRect(cutscene.lwX + actor.width / 2 - 28, 0, 56, actor.position.y + actor.height);
    }
    actor.draw();
  }
  // afterimages of the possessed lunge
  (cutscene.afterimages || []).forEach((ghost) => {
    ghost.life -= 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, ghost.life / 24) * 0.5;
    const saved = player1.position.x;
    player1.position.x = ghost.x;
    player1.draw();
    player1.position.x = saved;
    ctx.restore();
  });
  if (cutscene.afterimages) cutscene.afterimages = cutscene.afterimages.filter((ghost) => ghost.life > 0);
  // the guard's halberd flying out of his hands
  if (cutscene.halberd) {
    const halberd = cutscene.halberd;
    if (halberd.y < ground - 6) {
      halberd.x += halberd.vx;
      halberd.y += halberd.vy;
      halberd.vy += 0.6;
      halberd.rotation += 0.25;
    } else {
      halberd.y = ground - 6;
      halberd.rotation = Math.PI / 2;
    }
    ctx.save();
    ctx.translate(halberd.x, halberd.y);
    ctx.rotate(halberd.rotation);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(-3, -60, 6, 110);
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath();
    ctx.moveTo(3, -54);
    ctx.quadraticCurveTo(26, -50, 22, -32);
    ctx.lineTo(3, -36);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // dark cracks across the screen at the moment of the strike
  if (cutscene.cracks > 0) {
    cutscene.cracks -= 1;
    ctx.save();
    ctx.strokeStyle = `rgba(40, 0, 50, ${cutscene.cracks / 60})`;
    ctx.lineWidth = 3;
    const originX = cutscene.scammerX;
    const originY = ground - 80;
    for (let crack = 0; crack < 9; crack += 1) {
      const angle = (crack / 9) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      let crackX = originX;
      let crackY = originY;
      for (let segment = 0; segment < 4; segment += 1) {
        crackX += Math.cos(angle + (segment % 2 ? 0.3 : -0.3)) * 50;
        crackY += Math.sin(angle + (segment % 2 ? 0.3 : -0.3)) * 50;
        ctx.lineTo(crackX, crackY);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  // after the strike everything loses its color for a while
  if (cutscene.strikeDone || (cutscene.phase === 'strike' && cutscene.frame > 58)) {
    const lineNow = cutscene.lines[cutscene.lineIndex];
    const grey = cutscene.lwActor ? 0.12 : lineNow && lineNow.dying ? 0.4 : 0.3;
    ctx.fillStyle = `rgba(30, 30, 40, ${grey})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // the strike: a red-white flash
  if (cutscene.flash > 0) {
    ctx.fillStyle = `rgba(255, ${Math.round(80 + cutscene.flash * 5)}, ${Math.round(80 + cutscene.flash * 5)}, ${cutscene.flash / 34})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // darkness closing in while he is possessed
  if (player1.knightPossessed) {
    const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 120, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(20, 0, 30, ${0.55 + Math.sin(time * 4) * 0.1})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Light Warrior looks straight at you, without a word
  if (cutscene.stare && cutscene.lwActor) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const actor = cutscene.lwActor;
    const saved = { ...actor.position };
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 + 60);
    ctx.scale(3, 3);
    actor.position = { x: -actor.width / 2, y: -actor.height / 2 };
    // ...and here he looks straight at you
    actor.eyeLook = 0;
    actor.draw();
    actor.eyeLook = 1;
    ctx.restore();
    actor.position = saved;
  }
}

// ---------- level 7: Light Warrior ----------
// high above Robledal: a starry sky, a sea of clouds below, the Gran Farol shining far down there,
// and a floating platform made of light
function drawLightSkyStage(rise = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#060a2a');
  sky.addColorStop(0.55, '#2a1b5e');
  sky.addColorStop(1, '#7b3f8c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 70; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 97 + 11) % width, (star * 53) % 360, 2, 2);
  }
  // a huge moon
  const moonGlow = ctx.createRadialGradient(820, 120, 20, 820, 120, 180);
  moonGlow.addColorStop(0, 'rgba(255, 249, 196, 0.35)');
  moonGlow.addColorStop(1, 'rgba(255, 249, 196, 0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(620, -60, 400, 360);
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath();
  ctx.arc(820, 120, 62, 0, Math.PI * 2);
  ctx.fill();
  // everything below the sky can come up from below (the ascent)
  ctx.save();
  ctx.translate(0, rise);
  // far away, down below the sea of clouds: the Gran Farol pokes out, its beam still reaching the sky
  ctx.globalAlpha = 0.75 * (ctx.globalAlpha || 1);
  drawGreatLantern(width / 2, ground - 40, 0.42, ground + 200);
  ctx.restore();
  ctx.save();
  ctx.translate(0, rise);
  const farGlow = ctx.createRadialGradient(width / 2, ground - 80, 4, width / 2, ground - 80, 140);
  farGlow.addColorStop(0, 'rgba(255, 241, 118, 0.3)');
  farGlow.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = farGlow;
  ctx.fillRect(width / 2 - 140, ground - 220, 280, 280);
  // the distant sea of clouds hiding Robledal (its lights glow through)
  ctx.fillStyle = 'rgba(126, 87, 194, 0.9)';
  ctx.fillRect(0, ground - 62, width, 70);
  for (let puff = -1; puff < 14; puff += 1) {
    const puffX = (puff * 80 + time * 3) % (width + 160) - 80;
    ctx.fillStyle = puff % 2 ? 'rgba(149, 117, 205, 0.95)' : 'rgba(126, 87, 194, 0.95)';
    ctx.beginPath();
    ctx.ellipse(puffX, ground - 62, 64, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let light = 0; light < 12; light += 1) {
    ctx.fillStyle = `rgba(255, 213, 79, ${0.18 + Math.sin(time * 1.5 + light * 2) * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(((light * 89) % (width - 120)) + 60, ground - 34 + (light % 3) * 8, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the sea of clouds under the platform
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.fillStyle = ['rgba(149, 117, 205, 0.55)', 'rgba(179, 157, 219, 0.6)', 'rgba(209, 196, 233, 0.7)'][layer];
    for (let cloud = -1; cloud < 8; cloud += 1) {
      const cloudX = (cloud * 160 + time * (6 + layer * 4)) % (width + 320) - 160;
      ctx.beginPath();
      ctx.ellipse(cloudX, ground + 30 + layer * 16, 110, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // the platform of light
  const pulse = 0.5 + Math.sin(time * 2) * 0.5;
  const underGlow = ctx.createLinearGradient(0, ground, 0, ground + 60);
  underGlow.addColorStop(0, `rgba(255, 241, 118, ${0.45 + pulse * 0.15})`);
  underGlow.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = underGlow;
  ctx.fillRect(30, ground, width - 60, 60);
  ctx.fillStyle = `rgba(255, 249, 196, ${0.75 + pulse * 0.15})`;
  ctx.fillRect(30, ground, width - 60, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(30, ground, width - 60, 3);
  // runes along the platform
  ctx.strokeStyle = `rgba(255, 213, 79, ${0.5 + pulse * 0.3})`;
  ctx.lineWidth = 2;
  for (let rune = 70; rune < width - 60; rune += 90) {
    ctx.beginPath();
    ctx.arc(rune, ground + 24, 9, 0, Math.PI * 2);
    ctx.moveTo(rune - 9, ground + 24);
    ctx.lineTo(rune + 9, ground + 24);
    ctx.moveTo(rune, ground + 15);
    ctx.lineTo(rune, ground + 33);
    ctx.stroke();
  }
  // motes of light rising
  for (let mote = 0; mote < 24; mote += 1) {
    const rise = (time * 30 + mote * 37) % 300;
    ctx.fillStyle = `rgba(255, 249, 196, ${0.8 - rise / 300})`;
    ctx.fillRect((mote * 43 + 20) % width, ground - rise, 3, 3);
  }
  ctx.restore();
}

// level 7: Knight walks toward the farol; Light Warrior warns him three times
function startKnightApproach() {
  player2.eyeLook = -1;
  player2.lightWarriorSpeedTimer = 0;
  ch6CutsceneBase('knightApproach', knightApproachWarnings[0], 'approach', {
    gamblerX: 40,
    gamblerTargetX: 40,
    scammerX: knightApproachRetreatX[0],
    scammerTargetX: knightApproachRetreatX[0],
    scammerY: 0,
    ascendP: 0,
    warnings: 0,
    stage: 'approach',
    spirits: [],
    gifts: [],
    lwPower: 0,
    inSky: false,
    summonDone: false,
    giftDone: false,
    ascendDone: false,
    whiteFade: 0,
  });
}

function updateKnightApproach(cutscene) {
  player2.lightWarriorSpeedTimer = 0;
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  // a line skipped too fast still has to leave the scene where it should be
  if (cutscene.stage === 'final' && cutscene.phase === 'dialog') {
    const passed = (flag) => cutscene.lines.findIndex((entry) => entry[flag]) < cutscene.lineIndex;
    if (!cutscene.summonDone && passed('summon')) { cutscene.summonDone = true; cutscene.lwPower = 6; }
    if (!cutscene.giftDone && passed('gift')) { cutscene.giftDone = true; cutscene.lwPower = 3; cutscene.knightPower = 3; }
    if (!cutscene.ascendDone && passed('ascend')) {
      Object.assign(cutscene, { ascendDone: true, inSky: true, ascendP: 0, gamblerHop: 0, scammerY: 0, gamblerX: 230, gamblerTargetX: 230, scammerX: 720, scammerTargetX: 720 });
    }
  }
  player1.knightGlow = line && line.glow ? 1 : 0;
  if (cutscene.whiteFade > 0) cutscene.whiteFade -= 1;
  if (cutscene.phase === 'approach') {
    const move = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    // while he steps back, Knight can only keep pace: the next warning comes from a distance
    const retreating = cutscene.scammerX < knightApproachRetreatX[cutscene.warnings];
    const closest = retreating ? cutscene.scammerX - knightApproachWarnDistance - player1.width / 2 + 1 : cutscene.scammerX - 100;
    cutscene.gamblerX = Math.max(10, Math.min(Math.max(closest, cutscene.gamblerX), cutscene.gamblerX + move * 3.2));
    cutscene.gamblerTargetX = cutscene.gamblerX;
    player1.velocity.x = move * 3.2;
    player1.attacksToTheRight = move >= 0;
    if (move !== 0 && cutscene.frame % 16 === 0) playSound('cutsceneStep');
    // Light Warrior steps back toward the farol, still facing Knight
    const retreatGoal = knightApproachRetreatX[cutscene.warnings];
    cutscene.scammerTargetX = retreatGoal;
    if (cutscene.scammerX < retreatGoal) {
      cutscene.scammerX = Math.min(retreatGoal, cutscene.scammerX + 2.2);
      return;
    }
    const centerX = cutscene.gamblerX + player1.width / 2;
    const distance = cutscene.scammerX - centerX;
    if (cutscene.warnings < 3 && distance <= knightApproachWarnDistance) {
      // a warning: Light Warrior talks, then Knight can move again
      player1.velocity.x = 0;
      resetKeys();
      cutscene.stage = 'warning';
      cutscene.lines = knightApproachWarnings[cutscene.warnings];
      cutscene.warnings += 1;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    } else if (cutscene.warnings >= 3 && distance <= knightApproachFinalDistance) {
      player1.velocity.x = 0;
      resetKeys();
      cutscene.stage = 'final';
      cutscene.lines = knightApproachFinalLines;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  player1.velocity.x = 0;
  // "PRESTENME SU PODER!": six spirits come to him one by one
  if (line && line.summon && !cutscene.summonDone) {
    cutscene.phase = 'spirits';
    cutscene.frame = 0;
    cutscene.spirits = knightSpiritNames.map((name, index) => {
      const angle = Math.PI + (index / 5) * Math.PI;
      return { name, color: knightSpiritColors[index], x: canvas.width / 2 + Math.cos(angle) * 420, y: 260 + Math.sin(angle) * 180, start: 30 + index * 40, done: false };
    });
    playSound('judgeFinalStart');
    return;
  }
  if (cutscene.phase === 'spirits') {
    const lwX = cutscene.scammerX + player2.width / 2;
    const lwY = ground - player2.height / 2;
    cutscene.spirits.forEach((spirit) => {
      if (spirit.done || cutscene.frame < spirit.start) return;
      const t = cutscene.frame - spirit.start;
      if (t === 0) playSound('judgeLight');
      if (t > 10) {
        spirit.x += (lwX - spirit.x) * 0.12;
        spirit.y += (lwY - spirit.y) * 0.12;
      }
      if (t > 40) {
        spirit.done = true;
        cutscene.lwPower += 1;
        cutscene.burst = 16;
        playSound('achievement');
      }
    });
    if (cutscene.burst > 0) cutscene.burst -= 1;
    if (cutscene.frame > 30 + 6 * 40 + 40) {
      cutscene.summonDone = true;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(cutscene.lineIndex + 1);
    }
    return;
  }
  // he gives three of them to Knight
  if (line && line.gift && !cutscene.giftDone && cutscene.typed >= line.text.length) {
    cutscene.phase = 'gift';
    cutscene.frame = 0;
    cutscene.gifts = [0, 1, 2].map((index) => ({ x: cutscene.scammerX + player2.width / 2, y: ground - player2.height / 2, color: knightSpiritColors[3 + index], start: index * 25, done: false }));
    return;
  }
  if (cutscene.phase === 'gift') {
    const goalX = cutscene.gamblerX + player1.width / 2;
    const goalY = ground - player1.height / 2;
    cutscene.gifts.forEach((gift) => {
      if (gift.done || cutscene.frame < gift.start) return;
      gift.x += (goalX - gift.x) * 0.08;
      gift.y += (goalY - 80 - gift.y) * 0.08 + Math.sin((cutscene.frame - gift.start) / 6) * 1.5;
      if (Math.abs(gift.x - goalX) < 10) {
        gift.done = true;
        cutscene.lwPower = Math.max(3, cutscene.lwPower - 1);
        cutscene.knightPower = (cutscene.knightPower || 0) + 1;
        playSound('judgeLight');
      }
    });
    if (cutscene.gifts.every((gift) => gift.done) && cutscene.frame > 60) {
      cutscene.giftDone = true;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(cutscene.lineIndex + 1);
    }
    return;
  }
  // up, far from the town
  if (line && line.ascend && !cutscene.ascendDone && cutscene.typed >= line.text.length) {
    cutscene.phase = 'ascend';
    cutscene.frame = 0;
    playSound('judgeOverdrive');
    return;
  }
  if (cutscene.phase === 'ascend') {
    const frame = cutscene.frame;
    if (frame === 1) {
      cutscene.riseFromX = cutscene.gamblerX;
    }
    // he makes his own platform of light, then sends another one to Knight
    if (frame === 10 || frame === 45) playSound('judgeLight');
    if (frame === 100) {
      playSound('judgeOverdrive');
      cutscene.riseKnightX = cutscene.gamblerX;
      cutscene.riseLightX = cutscene.scammerX;
    }
    if (frame > 100) {
      // the camera follows them up: the bridge falls away, they cross the clouds, the platform comes to meet them
      const raw = Math.min(1, (frame - 100) / 320);
      const eased = raw * raw * (3 - 2 * raw);
      cutscene.ascendP = eased;
      const lift = raw < 0.15 ? raw / 0.15 : raw > 0.85 ? (1 - raw) / 0.15 : 1;
      // two separate platforms, each one bobbing on its own
      const height = 130 * Math.sin((lift * Math.PI) / 2);
      cutscene.gamblerHop = height + Math.sin(frame / 14) * 5 * lift;
      cutscene.scammerY = height * 1.15 + Math.sin(frame / 14 + 1.6) * 5 * lift;
      cutscene.gamblerX = cutscene.riseKnightX + (canvas.width / 2 - 260 - cutscene.riseKnightX) * Math.min(1, raw * 2);
      cutscene.scammerX = cutscene.riseLightX + (canvas.width / 2 + 170 - cutscene.riseLightX) * Math.min(1, raw * 2);
      cutscene.gamblerTargetX = cutscene.gamblerX;
      cutscene.scammerTargetX = cutscene.scammerX;
      if (frame % 40 === 0 && raw < 0.85) playSound('judgeLight');
    }
    if (frame >= 420) {
      // landed: they walk apart to face each other
      Object.assign(cutscene, { ascendDone: true, inSky: true, ascendP: 0, gamblerHop: 0, scammerY: 0, gamblerTargetX: 230, scammerTargetX: 720 });
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(cutscene.lineIndex + 1);
    }
  }
}

function drawKnightApproachFx(cutscene) {
  const time = performance.now() / 1000;
  const drawOrb = (x, y, color, radius = 16) => {
    const glow = ctx.createRadialGradient(x, y, 1, x, y, radius * 2);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.35, hexToRgba(color, 0.95));
    glow.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
    // a tiny face: these are the spirits of Robledal
    ctx.fillStyle = 'rgba(40, 30, 60, 0.7)';
    ctx.fillRect(x - 5, y - 3, 3, 3);
    ctx.fillRect(x + 2, y - 3, 3, 3);
  };
  // Light Warrior's glow grows with each spirit
  if (cutscene.lwPower > 0 && !cutscene.inSky) {
    const lwX = cutscene.scammerX + player2.width / 2;
    const aura = ctx.createRadialGradient(lwX, ground - 60, 10, lwX, ground - 60, 60 + cutscene.lwPower * 14);
    aura.addColorStop(0, `rgba(255, 249, 196, ${0.25 + cutscene.lwPower * 0.05})`);
    aura.addColorStop(1, 'rgba(255, 249, 196, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(lwX - 160, ground - 220, 320, 320);
  }
  if (cutscene.phase === 'spirits') {
    // the call keeps echoing while the spirits come
    ctx.fillStyle = `rgba(255, 249, 196, ${0.7 + Math.sin(time * 6) * 0.2})`;
    ctx.font = '900 34px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESTENME SU PODER!', canvas.width / 2, 120);
    ctx.textAlign = 'left';
    cutscene.spirits.forEach((spirit) => {
      if (spirit.done || cutscene.frame < spirit.start) return;
      drawOrb(spirit.x, spirit.y + Math.sin(time * 4 + spirit.start) * 4, spirit.color);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(spirit.name.toUpperCase(), spirit.x, spirit.y - 34);
      ctx.textAlign = 'left';
    });
    if (cutscene.burst > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.burst / 40})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (cutscene.phase === 'gift') cutscene.gifts.forEach((gift) => !gift.done && cutscene.frame >= gift.start && drawOrb(gift.x, gift.y, gift.color, 13));
  if (cutscene.phase === 'ascend') drawKnightAscentFx(cutscene);
  if (cutscene.whiteFade > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, cutscene.whiteFade / 25)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // how to move, while walking
  if (cutscene.phase === 'approach') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(canvas.width / 2 - 220, 40, 440, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('A / D para caminar - no podes atacar', canvas.width / 2, 60);
    ctx.fillStyle = '#fff59d';
    ctx.font = '700 13px Courier New, monospace';
    ctx.fillText(cutscene.warnings >= 3 ? 'Light Warrior ya no te va a advertir.' : `Advertencias: ${cutscene.warnings} / 3`, canvas.width / 2, 78);
    ctx.textAlign = 'left';
  }
}

// level 7 opening map: the old stone bridge that leads to the Gran Farol, over a misty ravine
function drawFarolBridgeStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const bridgeEnd = 850;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#060a2a');
  sky.addColorStop(0.6, '#1b1f52');
  sky.addColorStop(1, '#3a2d6b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 70; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 1.7 + star) * 0.3})`;
    ctx.fillRect((star * 131 + 17) % width, (star * 47) % 300, 2, 2);
  }
  // a few bigger stars that sparkle
  [[320, 40], [610, 90], [760, 30], [470, 150]].forEach(([starX, starY], index) => {
    const size = 4 + Math.sin(time * 3 + index * 2) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(starX - size, starY, size * 2 + 1, 1);
    ctx.fillRect(starX, starY - size, 1, size * 2 + 1);
  });
  // soft auroras waving over the valley
  ['rgba(129, 199, 132, 0.12)', 'rgba(77, 208, 225, 0.1)'].forEach((color, band) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 120 + band * 40);
    for (let x = 0; x <= width; x += 32) ctx.lineTo(x, 110 + band * 40 + Math.sin(x / 120 + time * 0.6 + band) * 22);
    for (let x = width; x >= 0; x -= 32) ctx.lineTo(x, 160 + band * 40 + Math.sin(x / 140 + time * 0.5 + band) * 18);
    ctx.closePath();
    ctx.fill();
  });
  // the moon, with its craters
  const moonGlow = ctx.createRadialGradient(150, 80, 10, 150, 80, 120);
  moonGlow.addColorStop(0, 'rgba(232, 234, 246, 0.4)');
  moonGlow.addColorStop(1, 'rgba(232, 234, 246, 0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(30, -40, 240, 240);
  ctx.fillStyle = '#e8eaf6';
  ctx.beginPath();
  ctx.arc(150, 80, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(159, 168, 218, 0.45)';
  [[140, 72, 7], [161, 90, 5], [156, 66, 3]].forEach(([craterX, craterY, radius]) => {
    ctx.beginPath();
    ctx.arc(craterX, craterY, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  // two layers of mountains, with a thin waterfall shining in the far one
  ctx.fillStyle = '#23285a';
  ctx.beginPath();
  ctx.moveTo(0, ground - 150);
  [[120, ground - 240], [260, ground - 180], [380, ground - 260], [520, ground - 190], [660, ground - 250], [780, ground - 185], [width, ground - 230]].forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(232, 234, 246, 0.6)';
  ctx.fillRect(379, ground - 255, 3, 70);
  for (let drop = 0; drop < 4; drop += 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(378, ground - 255 + ((time * 60 + drop * 18) % 70), 5, 4);
  }
  ctx.fillStyle = '#151a3d';
  ctx.beginPath();
  ctx.moveTo(0, ground - 120);
  [[90, ground - 190], [200, ground - 140], [320, ground - 200], [450, ground - 150], [560, ground - 195], [700, ground - 135], [800, ground - 170], [width, ground - 120]].forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.closePath();
  ctx.fill();
  // Robledal asleep down in the valley, smoke rising from a few chimneys
  for (let roof = 0; roof < 14; roof += 1) {
    const roofX = 30 + roof * 54;
    const roofY = ground - 92 + (roof % 3) * 6;
    ctx.fillStyle = '#0f1330';
    ctx.beginPath();
    ctx.moveTo(roofX, roofY);
    ctx.lineTo(roofX + 18, roofY - 14);
    ctx.lineTo(roofX + 36, roofY);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(roofX + 4, roofY, 28, 16);
    ctx.fillStyle = `rgba(255, 213, 79, ${0.55 + Math.sin(time * 2 + roof) * 0.25})`;
    ctx.fillRect(roofX + 14, roofY + 5, 5, 5);
    if (roof % 4 === 1) {
      for (let puff = 0; puff < 3; puff += 1) {
        const smokeRise = (time * 10 + puff * 9) % 30;
        ctx.fillStyle = `rgba(200, 200, 230, ${0.2 * (1 - smokeRise / 30)})`;
        ctx.beginPath();
        ctx.arc(roofX + 26 + Math.sin(time + puff) * 3, roofY - 16 - smokeRise, 3 + smokeRise / 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // mist rising from the ravine, drifting slowly
  const mist = ctx.createLinearGradient(0, ground - 80, 0, ground);
  mist.addColorStop(0, 'rgba(179, 157, 219, 0)');
  mist.addColorStop(1, 'rgba(179, 157, 219, 0.35)');
  ctx.fillStyle = mist;
  ctx.fillRect(0, ground - 80, width, 80);
  for (let wisp = 0; wisp < 7; wisp += 1) {
    const wispX = (wisp * 170 + time * 12) % (width + 240) - 120;
    ctx.fillStyle = 'rgba(209, 196, 233, 0.12)';
    ctx.beginPath();
    ctx.ellipse(wispX, ground - 50 + (wisp % 3) * 10, 110, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the cliff on the right: layered rock, moss and stairs up to the Gran Farol
  ctx.fillStyle = '#2b2f4a';
  ctx.beginPath();
  ctx.moveTo(bridgeEnd - 10, canvas.height);
  ctx.lineTo(bridgeEnd + 10, ground - 10);
  ctx.lineTo(bridgeEnd + 40, ground - 40);
  ctx.lineTo(width, ground - 46);
  ctx.lineTo(width, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#363b5c';
  [[bridgeEnd + 30, ground - 20, 50, 14], [bridgeEnd + 90, ground - 5, 70, 16], [bridgeEnd + 60, ground + 20, 60, 14], [bridgeEnd + 120, ground + 36, 50, 12]].forEach(([rockX, rockY, rockW, rockH]) => ctx.fillRect(rockX, rockY, rockW, rockH));
  ctx.fillStyle = '#3c6e47';
  [[bridgeEnd + 40, ground - 44, 30], [bridgeEnd + 110, ground - 47, 40], [width - 40, ground - 48, 36]].forEach(([mossX, mossY, mossW]) => ctx.fillRect(mossX, mossY, mossW, 4));
  // a stone dais under the farol
  ctx.fillStyle = '#7a7d99';
  ctx.fillRect(width - 140, ground - 58, 130, 12);
  ctx.fillStyle = '#5f6283';
  ctx.fillRect(width - 128, ground - 70, 106, 12);
  drawGreatLantern(width - 75, ground - 70, 1, ground + 30);
  // the bridge: back railing with balusters, lamp posts with little blue pennants
  ctx.fillStyle = '#4a4d6b';
  ctx.fillRect(0, ground - 44, bridgeEnd, 7);
  ctx.fillStyle = '#5a5d7d';
  ctx.fillRect(0, ground - 46, bridgeEnd, 3);
  ctx.fillStyle = '#4a4d6b';
  for (let baluster = 6; baluster < bridgeEnd; baluster += 22) {
    ctx.fillRect(baluster, ground - 37, 6, 37);
    ctx.fillRect(baluster - 1, ground - 22, 8, 4);
  }
  for (let post = 110; post < bridgeEnd - 60; post += 230) {
    ctx.fillStyle = '#3b3e5a';
    ctx.fillRect(post, ground - 120, 8, 120);
    ctx.fillRect(post - 8, ground - 126, 24, 8);
    // a pennant waving in the wind
    const wave = Math.sin(time * 4 + post) * 4;
    ctx.fillStyle = '#283593';
    ctx.beginPath();
    ctx.moveTo(post + 8, ground - 112);
    ctx.lineTo(post + 34, ground - 104 + wave);
    ctx.lineTo(post + 8, ground - 94);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(post + 12, ground - 106 + wave / 2, 5, 5);
    const lamp = ctx.createRadialGradient(post + 4, ground - 136, 2, post + 4, ground - 136, 42);
    lamp.addColorStop(0, `rgba(255, 224, 130, ${0.7 + Math.sin(time * 3 + post) * 0.1})`);
    lamp.addColorStop(1, 'rgba(255, 224, 130, 0)');
    ctx.fillStyle = lamp;
    ctx.fillRect(post - 40, ground - 178, 88, 84);
    ctx.fillStyle = '#ffe082';
    ctx.fillRect(post - 2, ground - 142, 12, 12);
    ctx.fillStyle = '#3b3e5a';
    ctx.fillRect(post - 4, ground - 146, 16, 4);
    // its warm pool of light on the stones
    ctx.fillStyle = 'rgba(255, 224, 130, 0.14)';
    ctx.beginPath();
    ctx.ellipse(post + 4, ground + 4, 70, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the old stone archway at the end of the bridge, with the banners of Robledal
  ctx.fillStyle = '#5a5d7d';
  ctx.fillRect(bridgeEnd - 70, ground - 170, 22, 170);
  ctx.fillRect(bridgeEnd - 6, ground - 170, 22, 170);
  ctx.strokeStyle = '#5a5d7d';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(bridgeEnd - 27, ground - 168, 35, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#7a7d99';
  ctx.fillRect(bridgeEnd - 34, ground - 214, 14, 14);
  ctx.fillStyle = '#6a6d8a';
  ctx.fillRect(bridgeEnd - 74, ground - 176, 30, 8);
  ctx.fillRect(bridgeEnd - 10, ground - 176, 30, 8);
  [bridgeEnd - 66, bridgeEnd - 2].forEach((bannerX, index) => {
    const sway = Math.sin(time * 2 + index) * 2;
    ctx.fillStyle = '#1a237e';
    ctx.beginPath();
    ctx.moveTo(bannerX, ground - 160);
    ctx.lineTo(bannerX + 14, ground - 160);
    ctx.lineTo(bannerX + 14 + sway, ground - 100);
    ctx.lineTo(bannerX + 7 + sway, ground - 108);
    ctx.lineTo(bannerX + sway, ground - 100);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.arc(bannerX + 7 + sway / 2, ground - 140, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  // ivy hanging from the arch
  ctx.fillStyle = '#4caf50';
  for (let leaf = 0; leaf < 8; leaf += 1) ctx.fillRect(bridgeEnd - 60 + leaf * 9, ground - 160 + (leaf % 3) * 8 + Math.sin(time * 2 + leaf) * 1.5, 4, 4);
  // the deck: cobbles, moss between the stones
  ctx.fillStyle = '#6a6d8a';
  ctx.fillRect(0, ground, bridgeEnd, 10);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, ground, bridgeEnd, 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  for (let stone = 0; stone < bridgeEnd; stone += 28) {
    ctx.beginPath();
    ctx.moveTo(stone + ((stone / 28) % 2) * 14, ground + 2);
    ctx.lineTo(stone + ((stone / 28) % 2) * 14, ground + 10);
    ctx.stroke();
  }
  ctx.fillStyle = '#558b2f';
  for (let moss = 30; moss < bridgeEnd; moss += 97) ctx.fillRect(moss, ground - 2, 10, 3);
  // the arches over the ravine, with keystones, and the river glinting far below
  ctx.fillStyle = '#4e5170';
  ctx.fillRect(0, ground + 10, bridgeEnd, canvas.height - ground);
  for (let arch = 0; arch < bridgeEnd; arch += 160) {
    ctx.fillStyle = '#0b0d22';
    ctx.beginPath();
    ctx.ellipse(arch + 80, canvas.height + 10, 62, canvas.height - ground - 18, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = 'rgba(129, 212, 250, 0.35)';
    ctx.fillRect(arch + 50 + Math.sin(time * 2 + arch) * 6, canvas.height - 6, 22, 2);
    ctx.fillStyle = '#6a6d8a';
    ctx.fillRect(arch + 74, ground + 16, 12, 8);
  }
  // fireflies drifting toward the farol
  for (let mote = 0; mote < 22; mote += 1) {
    const drift = (time * 25 + mote * 53) % 880;
    ctx.fillStyle = `rgba(255, 249, 196, ${0.7 * (drift / 880)})`;
    ctx.fillRect(drift + 30, ground - 60 - Math.sin(time + mote) * 40 - (mote % 5) * 30, 3, 3);
  }
}

// the trip up: the bridge falls away below, they cross the clouds and the light platform comes to meet them
function drawKnightAscentBackdrop(progress) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const height = canvas.height;
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  // the same night as the top of the bridge sky, so the bridge slides away without a seam
  sky.addColorStop(0, '#060a2a');
  sky.addColorStop(1, progress < 0.6 ? '#060a2a' : '#2a1b5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  // stars sliding down: we are going up
  for (let star = 0; star < 80; star += 1) {
    const starY = ((star * 61) % height + progress * 1600) % height;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 97 + 11) % width, starY, 2, 2 + progress * 6 * (progress < 0.85 ? 1 : 0));
  }
  if (progress < 0.6) {
    ctx.save();
    ctx.translate(0, progress * height * 1.9);
    drawFarolBridgeStage();
    ctx.restore();
  }
  // the platform world, arriving from below
  if (progress > 0.6) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (progress - 0.6) / 0.15);
    drawLightSkyStage(((1 - progress) / 0.4) * 420);
    ctx.restore();
  }
  // a bank of clouds rushing past
  if (progress > 0.3 && progress < 0.85) {
    const pass = (progress - 0.3) / 0.55;
    const bankY = -260 + pass * (height + 520);
    for (let puff = 0; puff < 22; puff += 1) {
      const puffX = ((puff * 83) % (width + 200)) - 100;
      const puffY = bankY + ((puff * 37) % 220) - 110;
      ctx.fillStyle = ['rgba(209, 196, 233, 0.85)', 'rgba(237, 231, 246, 0.9)', 'rgba(179, 157, 219, 0.8)'][puff % 3];
      ctx.beginPath();
      ctx.ellipse(puffX, puffY, 120 + (puff % 4) * 20, 46 + (puff % 3) * 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// each one rides his own platform of light: Light Warrior makes his, then sends one to Knight
function drawKnightAscentFx(cutscene) {
  const frame = cutscene.frame;
  const time = performance.now() / 1000;
  const drawPlatform = (fighter, appear, seed) => {
    if (appear <= 0) return;
    const centerX = fighter.position.x + fighter.width / 2;
    const feetY = fighter.position.y + fighter.height + 4;
    const radius = (fighter.width / 2 + 34) * (0.6 + appear * 0.4);
    ctx.save();
    const glow = ctx.createRadialGradient(centerX, feetY, 4, centerX, feetY, radius * 1.3);
    glow.addColorStop(0, `rgba(255, 255, 255, ${0.6 * appear})`);
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(centerX - radius * 1.3, feetY - radius * 0.6, radius * 2.6, radius * 1.2);
    // the disc itself
    ctx.fillStyle = `rgba(255, 249, 196, ${0.85 * appear})`;
    ctx.beginPath();
    ctx.ellipse(centerX, feetY, radius, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 213, 79, ${0.7 * appear})`;
    ctx.beginPath();
    ctx.ellipse(centerX, feetY + 5, radius * 0.85, 6, 0, 0, Math.PI);
    ctx.fill();
    // runes turning around its edge
    ctx.fillStyle = `rgba(255, 255, 255, ${appear})`;
    for (let rune = 0; rune < 6; rune += 1) {
      const angle = time * 2 + seed + rune * (Math.PI / 3);
      ctx.fillRect(centerX + Math.cos(angle) * radius * 0.8 - 2, feetY + Math.sin(angle) * 5 - 2, 4, 4);
    }
    // light falling from it: going up fast
    if (frame > 100) {
      for (let streak = 0; streak < 7; streak += 1) {
        const streakX = centerX - radius * 0.7 + ((streak * 29 + seed * 13) % (radius * 1.4));
        const fall = (frame * 9 + streak * 41 + seed * 20) % 200;
        ctx.fillStyle = `rgba(255, 249, 196, ${0.6 * (1 - fall / 200)})`;
        ctx.fillRect(streakX, feetY + 8 + fall, 3, 22);
      }
    }
    ctx.restore();
  };
  // his raised hand glows, and a spark flies to Knight's feet
  if (frame < 60) {
    const handX = player2.position.x + 4;
    const handY = player2.position.y + 20;
    const handGlow = ctx.createRadialGradient(handX, handY, 1, handX, handY, 24);
    handGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    handGlow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = handGlow;
    ctx.fillRect(handX - 24, handY - 24, 48, 48);
    if (frame > 25 && frame < 45) {
      const t = (frame - 25) / 20;
      const sparkX = handX + (player1.position.x + player1.width / 2 - handX) * t;
      const sparkY = handY + (player1.position.y + player1.height - handY) * t - Math.sin(t * Math.PI) * 60;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawPlatform(player2, Math.min(1, (frame - 10) / 20), 0);
  drawPlatform(player1, Math.min(1, (frame - 45) / 20), 3);
}

// ---------- the top of the Gran Farol ----------
// a stone balcony around the giant lantern, high above the sea of clouds
function drawFarolTopStage(flare = 0) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#04061a');
  sky.addColorStop(0.6, '#1e1650');
  sky.addColorStop(1, '#4a2a6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 90; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 1.8 + star) * 0.3})`;
    ctx.fillRect((star * 113 + 7) % width, (star * 41) % 340, 2, 2);
  }
  ['rgba(129, 199, 132, 0.13)', 'rgba(77, 208, 225, 0.11)', 'rgba(206, 147, 216, 0.1)'].forEach((color, band) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 90 + band * 36);
    for (let x = 0; x <= width; x += 32) ctx.lineTo(x, 80 + band * 36 + Math.sin(x / 110 + time * 0.6 + band) * 24);
    for (let x = width; x >= 0; x -= 32) ctx.lineTo(x, 130 + band * 36 + Math.sin(x / 130 + time * 0.5 + band) * 18);
    ctx.closePath();
    ctx.fill();
  });
  const moonGlow = ctx.createRadialGradient(150, 90, 10, 150, 90, 150);
  moonGlow.addColorStop(0, 'rgba(255, 248, 225, 0.45)');
  moonGlow.addColorStop(1, 'rgba(255, 248, 225, 0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(0, -60, 300, 300);
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath();
  ctx.arc(150, 90, 46, 0, Math.PI * 2);
  ctx.fill();
  // the sea of clouds far below
  for (let puff = -1; puff < 14; puff += 1) {
    const puffX = (puff * 80 + time * 4) % (width + 160) - 80;
    ctx.fillStyle = puff % 2 ? 'rgba(149, 117, 205, 0.9)' : 'rgba(126, 87, 194, 0.9)';
    ctx.beginPath();
    ctx.ellipse(puffX, ground - 70, 70, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(126, 87, 194, 0.9)';
  ctx.fillRect(0, ground - 70, width, 70);
  // the giant lantern of the farol, right behind the fight
  drawGreatLantern(width / 2, ground - 6, 1.35, ground + 220, flare);
  // the railing at the back of the balcony
  ctx.fillStyle = '#5a5d7d';
  ctx.fillRect(0, ground - 46, width, 7);
  for (let post = 10; post < width; post += 34) ctx.fillRect(post, ground - 40, 7, 40);
  // braziers on the corners
  [34, width - 66].forEach((pillarX, index) => {
    ctx.fillStyle = '#6a6d8a';
    ctx.fillRect(pillarX, ground - 110, 32, 110);
    ctx.fillStyle = '#7a7d99';
    ctx.fillRect(pillarX - 6, ground - 118, 44, 10);
    const flame = ctx.createRadialGradient(pillarX + 16, ground - 132, 2, pillarX + 16, ground - 132, 40);
    flame.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    flame.addColorStop(0.4, `rgba(255, 213, 79, ${0.75 + Math.sin(time * 9 + index) * 0.15})`);
    flame.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = flame;
    ctx.fillRect(pillarX - 24, ground - 172, 80, 80);
  });
  // the stone floor with a golden sun in the middle
  ctx.fillStyle = '#6a6d8a';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(0, ground, width, 3);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  for (let tile = 0; tile < width; tile += 48) {
    ctx.beginPath();
    ctx.moveTo(tile, ground);
    ctx.lineTo(tile, canvas.height);
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(253, 216, 53, ${0.6 + flare * 0.4})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(width / 2, ground + 22, 120, 14, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (flare > 0) {
    ctx.fillStyle = `rgba(255, 249, 196, ${flare * 0.25})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
}

// the climb backdrop: the sky, the clouds sliding down, and the tower of the farol with its top
function drawFarolClimbBackdrop(climb) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const cam = climb.cam;
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#05071f');
  sky.addColorStop(1, '#2a1b5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 90; star += 1) {
    const starY = (((star * 53 - cam * 0.15) % canvas.height) + canvas.height) % canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 97 + 11) % width, starY, 2, 2);
  }
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath();
  ctx.arc(150, 90, 40, 0, Math.PI * 2);
  ctx.fill();
  // clouds at different heights, with parallax
  for (let cloud = 0; cloud < 16; cloud += 1) {
    const worldY = ground + 40 - cloud * 180;
    const screenY = (worldY - cam) * 0.7 + ground * 0.3;
    if (screenY < -60 || screenY > canvas.height + 60) continue;
    ctx.fillStyle = 'rgba(179, 157, 219, 0.35)';
    ctx.beginPath();
    ctx.ellipse(((cloud * 211) % (width + 200)) - 100 + Math.sin(time * 0.3 + cloud) * 20, screenY, 130, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // the tower of the farol, on the right
  const topScreen = climb.topY - cam;
  ctx.fillStyle = '#4e5170';
  ctx.fillRect(850, topScreen + 20, 100, canvas.height - topScreen);
  ctx.fillStyle = '#5f6283';
  for (let band = topScreen + 60; band < canvas.height; band += 120) {
    ctx.fillRect(842, band, 116, 10);
    ctx.fillStyle = `rgba(255, 213, 79, ${0.5 + Math.sin(time * 2 + band) * 0.2})`;
    ctx.fillRect(892, band + 40, 16, 24);
    ctx.fillStyle = '#5f6283';
  }
  // the old light arena at the bottom
  const floorScreen = ground - cam;
  if (floorScreen < canvas.height + 20) {
    ctx.fillStyle = 'rgba(255, 249, 196, 0.85)';
    ctx.fillRect(30, floorScreen, width - 60, 12);
    ctx.fillStyle = 'rgba(255, 241, 118, 0.3)';
    ctx.fillRect(30, floorScreen + 12, width - 60, 40);
  }
  // the top: the balcony of the farol, and the giant lantern
  if (topScreen > -320 && topScreen < canvas.height + 40) {
    drawGreatLantern(900, topScreen - 6, 0.9, 700);
    ctx.fillStyle = '#7a7d99';
    ctx.fillRect(690, topScreen, 320, 16);
    ctx.fillStyle = '#5a5d7d';
    ctx.fillRect(690, topScreen + 16, 320, 12);
    ctx.fillStyle = '#5a5d7d';
    ctx.fillRect(690, topScreen - 34, 320, 5);
    for (let post = 694; post < 1010; post += 30) ctx.fillRect(post, topScreen - 30, 5, 30);
  }
}

// ---------- on top of the farol: the power of friendship ----------
function startKnightFarolTop() {
  ch6CutsceneBase('knightFarolTop', knightFarolTopLines, 'dialog', {
    gamblerX: 230,
    gamblerTargetX: 230,
    scammerX: 900,
    scammerTargetX: 720,
    scammerY: 110,
    flare: 0,
    transformDone: false,
    friends: null,
  });
  player2.lightWarriorSpeedTimer = 0;
  player1.velocity.x = 0;
  player1.velocity.y = 0;
  startCutsceneLine(0);
}

// the omega form for the final round (it does not time out like the secret one)
function applyOmegaFinalForm(fighter) {
  fighter.lightWarriorOmegaTransformed = true;
  fighter.lightWarriorOmegaStateTimer = 1e9;
  fighter.secretVariant = 'omegaTransformed';
  fighter.setMaxHealth(omegaFinalHealth);
  fighter.health = fighter.maxHealth;
  fighter.damageMultiplier = lightWarriorOmegaDamageMultiplier;
}

function updateKnightFarolTop(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  player1.knightGlow = line && line.glow ? 1 : 0;
  // he floats a little
  if (cutscene.phase === 'dialog') cutscene.scammerY = (cutscene.transformDone ? 130 : 110) + Math.sin(cutscene.frame / 18) * 6;
  // skipped too fast: the transformation still happens
  if (!cutscene.transformDone && cutscene.phase === 'dialog' && cutscene.lines.findIndex((entry) => entry.transform) < cutscene.lineIndex) {
    cutscene.transformDone = true;
    applyOmegaFinalForm(player2);
  }
  if (line && line.transform && !cutscene.transformDone && cutscene.typed >= line.text.length) {
    cutscene.phase = 'transform';
    cutscene.frame = 0;
    // (if the lines went by too fast, he is already in his place)
    cutscene.scammerX = 720;
    cutscene.scammerTargetX = 720;
    // everyone who helped him today
    cutscene.friends = [
      { variant: 'celesteGirl', color: '#4fc3f7' },
      { variant: 'setoBoy', color: '#66bb6a' },
      { variant: 'mochiMouse', color: '#9e9e9e', powered: true },
      { variant: 'chefBoss', color: '#ffffff' },
      { variant: 'cowboy', color: '#c62828', sheriff: true },
    ].map((friend, index) => {
      const actor = new Fighter({ x: 0, y: 0, color: friend.color, attacksToTheRight: true });
      if (friend.variant === 'cowboy') {
        actor.setCharacterType('cowboy');
        actor.setColor(friend.color);
        actor.sheriffBadge = true;
      } else {
        actor.setCharacterType('normal', friend.variant);
      }
      if (friend.powered) actor.mochiPowered = true;
      return { actor, start: 40 + index * 22 };
    });
    playSound('judgeFinalStart');
    return;
  }
  if (cutscene.phase !== 'transform') return;
  const frame = cutscene.frame;
  cutscene.scammerY = Math.min(150, 110 + frame);
  cutscene.flare = frame < 150 ? frame / 300 : frame < 240 ? 0.5 + (frame - 150) / 180 : Math.max(0, 1 - (frame - 240) / 80);
  cutscene.shake = frame > 150 && frame < 240 ? 4 : 0;
  if (cutscene.friends) cutscene.friends.forEach((friend) => frame === friend.start && playSound('judgeLight'));
  if (frame === 150) playSound('judgeOverdrive');
  if (frame === 235) {
    cutscene.transformDone = true;
    applyOmegaFinalForm(player2);
    playSound('achievement');
    playSound('judgeOverdrive');
  }
  if (frame >= 400) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    cutscene.friends = null;
    startCutsceneLine(cutscene.lineIndex + 1);
  }
}

function drawKnightFarolTopFx(cutscene) {
  if (cutscene.phase !== 'transform') return;
  const frame = cutscene.frame;
  const lwX = cutscene.scammerX + player2.width / 2;
  const lwY = ground - player2.height / 2 - cutscene.scammerY;
  ctx.save();
  // the night goes darker around him
  ctx.fillStyle = `rgba(0, 0, 10, ${Math.min(0.5, frame / 80) * (frame < 235 ? 1 : Math.max(0, 1 - (frame - 235) / 60))})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // his friends appear around him, each one sending its light...
  const gather = frame < 150 ? 0 : Math.min(1, (frame - 150) / 80);
  const total = (cutscene.friends || []).length;
  (cutscene.friends || []).forEach((friend, index) => {
    if (frame < friend.start || gather >= 1) return;
    const appear = Math.min(1, (frame - friend.start) / 20);
    const angle = Math.PI + (index / (total - 1)) * Math.PI;
    const homeX = lwX + Math.cos(angle) * 230;
    const homeY = lwY + Math.sin(angle) * 120 + 40;
    const x = homeX + (lwX - homeX) * gather;
    const y = homeY + (lwY - homeY) * gather;
    ctx.strokeStyle = `rgba(255, 249, 196, ${0.6 * appear})`;
    ctx.lineWidth = 3 + gather * 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lwX, lwY);
    ctx.stroke();
    const actor = friend.actor;
    ctx.save();
    ctx.globalAlpha = appear * (1 - gather) * 0.85;
    ctx.translate(x, y);
    ctx.scale(0.7 * (1 - gather * 0.6), 0.7 * (1 - gather * 0.6));
    actor.position = { x: -actor.width / 2, y: -actor.height / 2 };
    actor.attacksToTheRight = x < lwX;
    actor.draw();
    ctx.restore();
  });
  // ...and the six spirits of Robledal
  knightSpiritColors.forEach((color, index) => {
    const start = 140 + index * 4;
    if (frame < start || gather >= 1) return;
    const angle = frame * 0.05 + index * ((Math.PI * 2) / 6);
    const radius = 90 * (1 - gather);
    const x = lwX + Math.cos(angle) * radius;
    const y = lwY + Math.sin(angle) * radius * 0.6;
    const glow = ctx.createRadialGradient(x, y, 1, x, y, 16);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.4, hexToRgba(color, 0.9));
    glow.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  });
  // the light gathering in him
  const power = frame < 150 ? frame / 300 : Math.min(1.4, 0.5 + (frame - 150) / 90);
  const core = ctx.createRadialGradient(lwX, lwY, 4, lwX, lwY, 60 + power * 160);
  core.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.9, power)})`);
  core.addColorStop(0.5, `rgba(255, 241, 118, ${Math.min(0.6, power * 0.5)})`);
  core.addColorStop(1, 'rgba(255, 241, 118, 0)');
  ctx.fillStyle = core;
  ctx.fillRect(lwX - 260, lwY - 260, 520, 520);
  // the white flash of the transformation
  if (frame >= 225 && frame < 290) {
    ctx.fillStyle = `rgba(255, 255, 255, ${frame < 235 ? (frame - 225) / 10 : Math.max(0, 1 - (frame - 235) / 55)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // after: golden rays turning behind him, and his name
  if (frame >= 235) {
    const after = frame - 235;
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.5)';
    ctx.lineWidth = 6;
    for (let ray = 0; ray < 16; ray += 1) {
      const angle = after * 0.02 + ray * (Math.PI / 8);
      ctx.beginPath();
      ctx.moveTo(lwX + Math.cos(angle) * 70, lwY + Math.sin(angle) * 70);
      ctx.lineTo(lwX + Math.cos(angle) * 420, lwY + Math.sin(angle) * 420);
      ctx.stroke();
    }
    knightSpiritColors.forEach((color, index) => {
      const angle = after * 0.06 + index * ((Math.PI * 2) / 6);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lwX + Math.cos(angle) * 70, lwY + Math.sin(angle) * 40, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    if (after > 30) {
      const pop = Math.min(1, (after - 30) / 20);
      ctx.textAlign = 'center';
      ctx.font = `900 ${Math.round(30 + pop * 26)}px Courier New, monospace`;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#3e2723';
      ctx.fillStyle = '#fff59d';
      ctx.shadowColor = '#fdd835';
      ctx.shadowBlur = 24;
      ctx.globalAlpha = pop;
      ctx.strokeText('OMEGA LIGHT WARRIOR', canvas.width / 2, 120);
      ctx.fillText('OMEGA LIGHT WARRIOR', canvas.width / 2, 120);
      ctx.shadowBlur = 0;
      ctx.font = '900 20px Courier New, monospace';
      ctx.lineWidth = 5;
      ctx.fillStyle = '#ffffff';
      ctx.strokeText('EL PODER DE LA AMISTAD', canvas.width / 2, 156);
      ctx.fillText('EL PODER DE LA AMISTAD', canvas.width / 2, 156);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }
  }
  ctx.restore();
}

// ---------- after the clash: the talk on top of the farol ----------
function startKnightFarolEnd() {
  ch6CutsceneBase('knightFarolEnd', knightFarolEndLines, 'dialog', {
    gamblerX: 380,
    gamblerTargetX: 380,
    scammerX: 600,
    scammerTargetX: 600,
    scammerY: 0,
    whiteIn: 90,
    darkLevel: 0,
    erase: null,
    erased: false,
  });
  player1.knightPossessed = false;
  player1.knightGlow = 0;
  player2.eyeLook = -1;
  startCutsceneLine(0);
}

function updateKnightFarolEnd(cutscene) {
  if (cutscene.whiteIn > 0) cutscene.whiteIn -= 1.5;
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  // the dark knight's control comes back...
  if (line && line.possess && !cutscene.erased) {
    cutscene.darkLevel = Math.min(1, cutscene.darkLevel + 0.02);
    player1.knightPossessed = cutscene.darkLevel > 0.4;
  }
  // ...and while he talks as if nothing happened, Light Warrior wipes it away with a flick of light
  if (line && line.erase && !cutscene.erase && !cutscene.erased) {
    cutscene.erase = { x: cutscene.scammerX + 6, y: ground - player2.height + 52, t: 0 };
  }
  if (cutscene.erase) {
    const erase = cutscene.erase;
    erase.t += 1;
    const targetX = cutscene.gamblerX + player1.width / 2;
    const targetY = ground - player1.height + 30;
    erase.x += (targetX - erase.x) * 0.06;
    erase.y += (targetY - erase.y) * 0.06;
    if (Math.hypot(targetX - erase.x, targetY - erase.y) < 8 || erase.t > 70) {
      cutscene.erase = null;
      cutscene.erased = true;
    }
  }
  if (cutscene.erased) {
    cutscene.darkLevel = Math.max(0, cutscene.darkLevel - 0.05);
    player1.knightPossessed = false;
  }
  // skipped lines: the voice is gone all the same
  if (!cutscene.erased && cutscene.lines.findIndex((entry) => entry.erase) < cutscene.lineIndex) cutscene.erased = true;
}

function drawKnightFarolEndFx(cutscene) {
  const time = performance.now() / 1000;
  ctx.save();
  // the first light of dawn behind the clouds
  const dawn = ctx.createLinearGradient(0, ground - 160, 0, ground);
  dawn.addColorStop(0, 'rgba(255, 171, 64, 0)');
  dawn.addColorStop(1, 'rgba(255, 171, 64, 0.22)');
  ctx.fillStyle = dawn;
  ctx.fillRect(0, ground - 160, canvas.width, 160);
  // both exhausted: Knight sweating and panting, Light Warrior worn out too
  const knightX = cutscene.gamblerX + player1.width / 2;
  const knightTop = ground - player1.height;
  drawScaredSweat(player1, 1.4);
  for (let breath = 0; breath < 2; breath += 1) {
    const rise = (time * 30 + breath * 22) % 44;
    ctx.fillStyle = `rgba(230, 230, 255, ${0.4 * (1 - rise / 44)})`;
    ctx.beginPath();
    ctx.arc(knightX + 34 + rise * 0.4, knightTop + 22 - rise, 4 + rise / 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const lwX = cutscene.scammerX + player2.width / 2;
  const lwTop = ground - player2.height;
  for (let breath = 0; breath < 2; breath += 1) {
    const rise = (time * 26 + breath * 22) % 44;
    ctx.fillStyle = `rgba(255, 249, 230, ${0.35 * (1 - rise / 44)})`;
    ctx.beginPath();
    ctx.arc(lwX - 34 - rise * 0.4, lwTop + 22 - rise, 4 + rise / 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // the darkness crawling over Knight
  if (cutscene.darkLevel > 0) {
    const dark = ctx.createRadialGradient(knightX, knightTop + 60, 10, knightX, knightTop + 60, 110);
    dark.addColorStop(0, `rgba(49, 27, 146, ${0.55 * cutscene.darkLevel})`);
    dark.addColorStop(1, 'rgba(49, 27, 146, 0)');
    ctx.fillStyle = dark;
    ctx.fillRect(knightX - 120, knightTop - 60, 240, 240);
    for (let wisp = 0; wisp < 8; wisp += 1) {
      const rise = (time * 40 + wisp * 13) % 80;
      ctx.fillStyle = `rgba(20, 10, 40, ${0.6 * cutscene.darkLevel * (1 - rise / 80)})`;
      ctx.fillRect(knightX - 34 + wisp * 9, knightTop + 100 - rise, 6, 10);
    }
  }
  // a tiny flick of light, barely visible
  if (cutscene.erase) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillRect(cutscene.erase.x - 1.5, cutscene.erase.y - 1.5, 3, 3);
  }
  if (cutscene.whiteIn > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, cutscene.whiteIn / 60)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

// ---------- chapter 5, secret level 8: behind the curtain ----------
const riftCrackX = 660;

// the foot of the Gran Farol in the morning... and, once it opens, the rift and its darkness
function drawFarolRiftStage(rift = 0, gloom = 0) {
  const time = performance.now() / 1000;
  drawLanternHillStage(0);
  // the first light of the morning (it fades as the darkness comes)
  ctx.fillStyle = `rgba(255, 183, 77, ${0.16 * (1 - Math.max(rift, gloom))})`;
  ctx.fillRect(0, 0, canvas.width, ground);
  if (gloom > 0) {
    // the sky goes dark around the captain's sword
    ctx.fillStyle = `rgba(15, 0, 30, ${gloom * 0.55})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (riftTerrainBroken) drawRiftBrokenGround();
  if (rift <= 0) return;
  ctx.fillStyle = `rgba(26, 8, 46, ${0.2 + rift * 0.3})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the crack in the world: a jagged portal, white edges, a void inside
  const top = ground - 40 - 300 * rift;
  const points = [];
  for (let step = 0; step <= 12; step += 1) {
    const y = top + ((ground - 10 - top) * step) / 12;
    const width = (16 + Math.sin(step * 1.7) * 9 + (step % 2) * 12) * rift * (1 - Math.abs(step - 6) / 9);
    points.push({ y, left: riftCrackX - width - (step % 3) * 3, right: riftCrackX + width + ((step + 1) % 3) * 3 });
  }
  ctx.save();
  ctx.shadowColor = '#b388ff';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(riftCrackX, top - 10);
  points.forEach((point) => ctx.lineTo(point.right, point.y));
  ctx.lineTo(riftCrackX, ground);
  for (let index = points.length - 1; index >= 0; index -= 1) ctx.lineTo(points[index].left, points[index].y);
  ctx.closePath();
  const voidFill = ctx.createLinearGradient(riftCrackX - 40, 0, riftCrackX + 40, 0);
  voidFill.addColorStop(0, '#12002a');
  voidFill.addColorStop(0.5, '#000000');
  voidFill.addColorStop(1, '#12002a');
  ctx.fillStyle = voidFill;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(179, 136, 255, 0.8)';
  ctx.lineWidth = 7;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.clip();
  // little lights swirling inside the void
  for (let speck = 0; speck < 24; speck += 1) {
    const angle = time * 1.4 + speck;
    const y = top + ((speck * 37 + time * 40) % (ground - top));
    ctx.fillStyle = speck % 3 ? 'rgba(179, 136, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(riftCrackX + Math.sin(angle) * 14, y, 2, 2);
  }
  ctx.restore();
  // the cracks spreading on the ground
  ctx.strokeStyle = `rgba(179, 136, 255, ${0.7 * rift})`;
  ctx.lineWidth = 2;
  [[-1, 0.6], [1, 0.4], [-1, 0.2], [1, 0.9]].forEach(([side, bend], index) => {
    ctx.beginPath();
    ctx.moveTo(riftCrackX, ground);
    ctx.lineTo(riftCrackX + side * (40 + index * 22) * rift, ground + 6 + bend * 8);
    ctx.lineTo(riftCrackX + side * (90 + index * 30) * rift, ground + 4 + index * 4);
    ctx.stroke();
  });
}

function startKnightRiftIntro() {
  const lightWarrior = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: false });
  lightWarrior.setCharacterType('lightWarrior');
  lightWarrior.setColor('#fdd835');
  const captain = new Fighter({ x: 0, y: 0, color: '#311b92', attacksToTheRight: true });
  captain.setCharacterType('normal', 'darkKnightBoss');
  ch6CutsceneBase('knightRiftIntro', knightRiftIntroLines, 'dialog', {
    gamblerX: 470,
    gamblerTargetX: 300,
    // Shadow Jester waits hidden (his place only turns Knight toward whoever he is facing)
    scammerX: 900,
    scammerTargetX: 900,
    scammerY: 0,
    rift: 0,
    jesterOut: false,
    lwActor: lightWarrior,
    lwX: 540,
    lwLeaving: false,
    captainActor: captain,
    captainX: -140,
    captainIn: false,
    captainFade: 1,
    captainLeaving: false,
    slamDone: false,
  });
  player1.knightPossessed = false;
  startCutsceneLine(0);
}

// the slam, beat by beat (frames)
const riftSlam = { charge: 100, strike: 100, crackStart: 160, crackPause: 232, ripStart: 252, ripEnd: 300, eyes: 300, emerge: 352, land: 420, end: 450 };

function updateKnightRiftIntro(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  // Light Warrior walks out with Knight, then goes for the tea
  if (!cutscene.lwLeaving) cutscene.lwX += (420 - cutscene.lwX) * 0.05;
  if (line && line.lwLeave && cutscene.typed >= line.text.length) cutscene.lwLeaving = true;
  // (lines skipped fast: he is already on his way, and long gone when the captain shows up)
  if (cutscene.lines.findIndex((entry) => entry.lwLeave) < cutscene.lineIndex) cutscene.lwLeaving = true;
  if (cutscene.captainIn && cutscene.lwLeaving) cutscene.lwX = Math.max(cutscene.lwX, canvas.width + 120);
  if (cutscene.lwLeaving && cutscene.lwX < canvas.width + 120) cutscene.lwX += 3.4;
  // the captain of the Orden Sombria arrives from the left
  if (line && line.captainIn) cutscene.captainIn = true;
  if (cutscene.captainIn && !cutscene.captainLeaving) cutscene.captainX += (110 - cutscene.captainX) * 0.06;
  if (cutscene.captainIn && !cutscene.jesterOut) {
    // Knight turns to the captain (the hidden Shadow Jester stands where the captain is)
    cutscene.scammerX = cutscene.captainX;
    cutscene.scammerTargetX = cutscene.captainX;
  }
  if (cutscene.riftFx) {
    cutscene.riftFx.debris.forEach((rock) => {
      rock.x += rock.vx;
      rock.y += rock.vy;
      rock.vy += 0.35;
      rock.life -= 1;
    });
    cutscene.riftFx.debris = cutscene.riftFx.debris.filter((rock) => rock.life > 0 && rock.y < ground + 10);
    cutscene.riftFx.laughs.forEach((laugh) => {
      laugh.x += laugh.vx;
      laugh.y += laugh.vy;
      laugh.life -= 1;
    });
    cutscene.riftFx.laughs = cutscene.riftFx.laughs.filter((laugh) => laugh.life > 0);
  }
  // the slam of the sword
  if (line && line.slam && !cutscene.slamDone && cutscene.typed >= line.text.length) {
    cutscene.phase = 'slam';
    cutscene.frame = 0;
    cutscene.riftFx = { debris: [], laughs: [], waves: [] };
    playSound('judgeFinalStart');
    return;
  }
  if (cutscene.phase === 'slam') {
    const frame = cutscene.frame;
    const fx = cutscene.riftFx;
    if (frame < riftSlam.strike) {
      // the charge: the sky darkens, the ground rumbles
      cutscene.gloom = Math.min(0.8, frame / riftSlam.charge);
      cutscene.shake = (frame / riftSlam.charge) * 3;
      if (frame % 10 === 0) playSound('omegaKickCharge', { pitch: frame / riftSlam.charge });
    }
    if (frame === riftSlam.strike) {
      playSound('omegaKickImpact');
      playSound('judgeOverdrive');
      fx.waves.push({ radius: 10, life: 50 });
      for (let rock = 0; rock < 40; rock += 1) {
        fx.debris.push({ x: riftCrackX + (Math.random() - 0.5) * 60, y: ground - 4, vx: (Math.random() - 0.5) * 14, vy: -4 - Math.random() * 10, life: 70, size: 3 + Math.random() * 6 });
      }
    }
    if (frame >= riftSlam.strike && frame < riftSlam.crackStart) cutscene.shake = Math.max(4, 18 - (frame - riftSlam.strike) / 4);
    if (frame >= riftSlam.crackStart && frame < riftSlam.crackPause) {
      // the crack tears open in jolts
      const step = Math.floor((frame - riftSlam.crackStart) / 12);
      cutscene.rift = Math.min(0.45, 0.08 + step * 0.075);
      cutscene.shake = (frame - riftSlam.crackStart) % 12 < 4 ? 8 : 2;
      if ((frame - riftSlam.crackStart) % 12 === 0) playSound('omegaClashMiss');
    }
    if (frame >= riftSlam.crackPause && frame < riftSlam.ripStart) cutscene.shake = 1;
    if (frame >= riftSlam.ripStart && frame < riftSlam.ripEnd) {
      // and then it rips wide open
      cutscene.rift = 0.45 + ((frame - riftSlam.ripStart) / (riftSlam.ripEnd - riftSlam.ripStart)) * 0.55;
      cutscene.shake = 10;
      if (frame === riftSlam.ripStart) {
        playSound('omegaKickImpact');
        playSound('omegaKickLaunch');
      }
    }
    if (frame >= riftSlam.ripEnd && frame < riftSlam.land) {
      cutscene.shake = 0;
      // silence... laughter from the void
      if (frame % 16 === 0 && frame < riftSlam.emerge + 30) {
        fx.laughs.push({ x: riftCrackX + (Math.random() - 0.5) * 30, y: ground - 120 - Math.random() * 160, vx: (Math.random() - 0.5) * 2.2, vy: -0.4 - Math.random() * 0.6, life: 70, size: 14 + Math.random() * 14, text: ['JI', 'JIJI', 'JI JI JI', 'JA'][Math.floor(Math.random() * 4)] });
        playSound('jesterUnlock');
      }
    }
    if (frame === riftSlam.land) {
      cutscene.shake = 12;
      fx.waves.push({ radius: 10, life: 40, purple: true });
      playSound('omegaKickImpact');
      playSound('jesterUnlock');
    }
    if (frame > riftSlam.land) cutscene.shake = Math.max(0, 12 - (frame - riftSlam.land) / 2);
    fx.waves.forEach((wave) => {
      wave.radius += 18;
      wave.life -= 1;
    });
    fx.waves = fx.waves.filter((wave) => wave.life > 0);
    if (frame >= riftSlam.end) {
      cutscene.slamDone = true;
      cutscene.jesterOut = true;
      cutscene.scammerX = riftCrackX - 10;
      cutscene.scammerTargetX = 590;
      cutscene.shake = 0;
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(cutscene.lineIndex + 1);
    }
    return;
  }
  // the darkness stays once the rift is open
  if (cutscene.slamDone) cutscene.gloom = Math.max(0, (cutscene.gloom || 0) - 0.01);
  // the captain leaves: he sinks into the darkness
  if (line && line.captainGone) cutscene.captainLeaving = true;
  if (cutscene.captainLeaving) cutscene.captainFade = Math.max(0, cutscene.captainFade - 0.025);
  // lines skipped too fast still leave everything in place
  if (!cutscene.slamDone && cutscene.lines.findIndex((entry) => entry.slam) < cutscene.lineIndex) {
    Object.assign(cutscene, { slamDone: true, rift: 1, jesterOut: true, scammerX: 590, scammerTargetX: 590, captainIn: true, shake: 0 });
  }
  if (cutscene.lines.findIndex((entry) => entry.captainGone) < cutscene.lineIndex) cutscene.captainLeaving = true;
}

function drawKnightRiftIntroFx(cutscene) {
  const time = performance.now() / 1000;
  const frame = cutscene.frame;
  const slam = cutscene.phase === 'slam';
  const fx = cutscene.riftFx;
  ctx.save();
  // Light Warrior (until he leaves the screen)
  if (cutscene.lwX < canvas.width + 80) {
    const lw = cutscene.lwActor;
    lw.position = { x: cutscene.lwX, y: ground - lw.height - (cutscene.lwLeaving ? Math.abs(Math.sin(time * 10)) * 4 : 0) };
    lw.attacksToTheRight = cutscene.lwLeaving;
    lw.eyeLook = cutscene.lwLeaving ? 1 : -1;
    lw.draw();
  }
  // the captain, with his sword
  if (cutscene.captainIn && cutscene.captainFade > 0) {
    const captain = cutscene.captainActor;
    captain.position = { x: cutscene.captainX, y: ground - captain.height };
    captain.attacksToTheRight = true;
    ctx.save();
    ctx.globalAlpha = cutscene.captainFade;
    captain.draw();
    ctx.restore();
    if (cutscene.captainFade < 1) {
      // he dissolves into dark smoke
      for (let wisp = 0; wisp < 14; wisp += 1) {
        const rise = ((time * 50 + wisp * 17) % 120) * (1 - cutscene.captainFade);
        ctx.fillStyle = `rgba(30, 10, 50, ${0.6 * (1 - cutscene.captainFade)})`;
        ctx.fillRect(cutscene.captainX + (wisp * 7) % captain.width, ground - rise - (wisp % 4) * 20, 8, 8);
      }
    }
    if (slam && frame < riftSlam.strike + 30) {
      // the sword rises, wrapped in a strange aura that grows... and comes down on the ground
      const handX = cutscene.captainX + captain.width - 4;
      const handY = ground - captain.height + 64;
      const charge = Math.min(1, frame / riftSlam.charge);
      const swing = frame < riftSlam.strike
        ? -Math.PI / 2 - Math.sin(charge * Math.PI * 0.5) * 0.25
        : -Math.PI / 2 + Math.min(1, (frame - riftSlam.strike) / 5) * (Math.PI * 0.8);
      // the air being pulled into the sword
      if (frame < riftSlam.strike) {
        for (let streak = 0; streak < 18; streak += 1) {
          const progress = (time * 1.4 + streak / 18) % 1;
          const angle = streak * 1.9;
          const radius = 260 * (1 - progress);
          ctx.strokeStyle = `rgba(179, 136, 255, ${0.6 * progress * charge})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(handX + Math.cos(angle) * radius, handY - 60 + Math.sin(angle) * radius);
          ctx.lineTo(handX + Math.cos(angle) * (radius + 26), handY - 60 + Math.sin(angle) * (radius + 26));
          ctx.stroke();
        }
      }
      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(swing);
      const aura = ctx.createRadialGradient(44, 0, 2, 44, 0, 60 + charge * 70);
      aura.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      aura.addColorStop(0.3, `rgba(124, 77, 255, ${0.4 + charge * 0.4})`);
      aura.addColorStop(1, 'rgba(20, 0, 40, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(-90, -130, 270, 260);
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(0, -4, 84, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -1, 84, 2);
      ctx.fillStyle = '#4a148c';
      ctx.fillRect(-6, -10, 6, 20);
      for (let spark = 0; spark < 10; spark += 1) {
        ctx.fillStyle = spark % 2 ? '#ffffff' : '#b388ff';
        ctx.fillRect(10 + ((time * 160 + spark * 9) % 76), (Math.random() - 0.5) * (14 + charge * 20), 3, 3);
      }
      ctx.restore();
    }
  }
  if (slam && fx) {
    // the bolt: a huge white lightning with branches
    if (frame >= riftSlam.strike && frame < riftSlam.strike + 60) {
      const strength = 1 - (frame - riftSlam.strike) / 60;
      ctx.save();
      ctx.shadowColor = '#e1bee7';
      ctx.shadowBlur = 50;
      const bolt = (fromX, fromY, toY, spread, width) => {
        ctx.lineWidth = width;
        ctx.beginPath();
        let x = fromX;
        ctx.moveTo(x, fromY);
        for (let y = fromY + 30; y <= toY; y += 30) {
          x += (Math.random() - 0.5) * spread;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
      bolt(riftCrackX, 0, ground, 60 * strength, 26 * (0.5 + strength));
      ctx.strokeStyle = `rgba(225, 190, 231, ${strength})`;
      bolt(riftCrackX, 0, ground, 40, 8);
      for (let branch = 0; branch < 4; branch += 1) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${strength * 0.7})`;
        bolt(riftCrackX + (branch - 1.5) * 50, 60 + branch * 50, 140 + branch * 90, 70, 3);
      }
      ctx.restore();
      if (frame < riftSlam.strike + 14) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(riftSlam.strike + 14 - frame) / 12})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    // purple arcs around the crack while it opens
    if (frame >= riftSlam.crackStart && frame < riftSlam.land) {
      ctx.strokeStyle = 'rgba(206, 147, 216, 0.8)';
      ctx.lineWidth = 2;
      for (let arc = 0; arc < 3; arc += 1) {
        if (Math.random() < 0.5) continue;
        const startY = ground - 60 - Math.random() * 260 * (cutscene.rift || 0.2);
        ctx.beginPath();
        ctx.moveTo(riftCrackX, startY);
        let x = riftCrackX;
        let y = startY;
        for (let step = 0; step < 5; step += 1) {
          x += (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 18);
          y += (Math.random() - 0.5) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    // shockwaves and debris
    fx.waves.forEach((wave) => {
      ctx.strokeStyle = wave.purple ? `rgba(179, 136, 255, ${wave.life / 40})` : `rgba(255, 255, 255, ${wave.life / 50})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(riftCrackX, ground, wave.radius, wave.radius * 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    fx.debris.forEach((rock) => {
      ctx.fillStyle = '#5f6283';
      ctx.fillRect(rock.x, rock.y, rock.size, rock.size);
    });
    // the silence: two eyes in the void, and laughter drifting out
    if (frame >= riftSlam.eyes && frame < riftSlam.emerge + 20) {
      const open = Math.min(1, (frame - riftSlam.eyes) / 20) * (frame > riftSlam.emerge ? Math.max(0, 1 - (frame - riftSlam.emerge) / 20) : 1);
      const blink = Math.floor(frame / 40) % 3 === 2 && frame % 40 < 4 ? 0.1 : 1;
      ctx.fillStyle = `rgba(255, 235, 59, ${open})`;
      ctx.shadowColor = '#ffeb3b';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.ellipse(riftCrackX - 9, ground - 170, 5, 7 * blink, 0, 0, Math.PI * 2);
      ctx.ellipse(riftCrackX + 9, ground - 170, 5, 7 * blink, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // and a grin under them
      ctx.strokeStyle = `rgba(255, 255, 255, ${open * 0.85})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(riftCrackX, ground - 160, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
    fx.laughs.forEach((laugh) => {
      ctx.save();
      ctx.globalAlpha = Math.min(1, laugh.life / 25);
      ctx.fillStyle = '#ce93d8';
      ctx.strokeStyle = '#1a0033';
      ctx.lineWidth = 4;
      ctx.font = `italic 900 ${Math.round(laugh.size)}px Courier New, monospace`;
      ctx.textAlign = 'center';
      const jitter = (Math.random() - 0.5) * 3;
      ctx.strokeText(laugh.text, laugh.x + jitter, laugh.y);
      ctx.fillText(laugh.text, laugh.x + jitter, laugh.y);
      ctx.restore();
    });
    // Shadow Jester steps out of the crack, glitching
    if (frame >= riftSlam.emerge) {
      const out = Math.min(1, (frame - riftSlam.emerge) / (riftSlam.land - riftSlam.emerge));
      const jester = player2;
      const draw = (offsetX, alpha, tint) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(riftCrackX + offsetX, ground);
        ctx.scale(0.4 + out * 0.6, 0.4 + out * 0.6);
        jester.position = { x: -jester.width / 2, y: -jester.height };
        jester.attacksToTheRight = false;
        jester.isAttacking = false;
        jester.draw();
        if (tint) {
          ctx.globalCompositeOperation = 'source-atop';
          ctx.fillStyle = tint;
          ctx.fillRect(-jester.width, -jester.height * 1.4, jester.width * 2, jester.height * 1.6);
        }
        ctx.restore();
      };
      const glitch = out < 1 ? (Math.random() - 0.5) * 16 * (1 - out) : 0;
      if (out < 1) {
        draw(glitch - 6, out * 0.35, null);
        draw(-glitch + 6, out * 0.35, null);
      }
      draw(0, out, null);
      const smoke = ctx.createRadialGradient(riftCrackX, ground - 60, 4, riftCrackX, ground - 60, 140);
      smoke.addColorStop(0, `rgba(124, 77, 255, ${0.4 * (1 - out * 0.5)})`);
      smoke.addColorStop(1, 'rgba(124, 77, 255, 0)');
      ctx.fillStyle = smoke;
      ctx.fillRect(riftCrackX - 140, ground - 200, 280, 280);
      if (frame >= riftSlam.land) {
        const pop = Math.min(1, (frame - riftSlam.land) / 8);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = `italic 900 ${Math.round(30 + pop * 22)}px Courier New, monospace`;
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#1a0033';
        ctx.fillStyle = '#e1bee7';
        const shakeX = (Math.random() - 0.5) * 8;
        ctx.strokeText('JAJAJAJAJA!', canvas.width / 2 + shakeX, 150);
        ctx.fillText('JAJAJAJAJA!', canvas.width / 2 + shakeX, 150);
        ctx.restore();
      }
    }
  }
  // Knight, scared, once Shadow Jester is out
  if (cutscene.jesterOut) drawScaredSweat(player1, 0.9);
  ctx.restore();
}

function startKnightRiftAngry() {
  player2.riftFinalStarted = true;
  ch6CutsceneBase('knightRiftAngry', knightRiftAngryLines, 'dialog', {
    gamblerX: player1.position.x,
    gamblerTargetX: player1.position.x,
    scammerX: player2.position.x,
    scammerTargetX: player2.position.x,
    scammerY: 0,
  });
  [player1, player2].forEach((fighter) => {
    fighter.velocity.x = 0;
    fighter.velocity.y = 0;
    fighter.isAttacking = false;
  });
  clearJesterProjectiles();
  startCutsceneLine(0);
}

// the giant scythe split the ground at the foot of the farol
function drawRiftBrokenGround() {
  const time = performance.now() / 1000;
  ctx.save();
  // missing chunks of the plaza
  ctx.fillStyle = '#06020c';
  [[120, 90], [330, 60], [520, 120], [760, 80], [900, 70]].forEach(([x, width], index) => {
    ctx.beginPath();
    ctx.moveTo(x, ground);
    ctx.lineTo(x + width * 0.3, ground + 14 + (index % 2) * 8);
    ctx.lineTo(x + width * 0.7, ground + 10);
    ctx.lineTo(x + width, ground);
    ctx.closePath();
    ctx.fill();
  });
  // glowing fissures across the floor
  ctx.strokeStyle = `rgba(179, 136, 255, ${0.6 + Math.sin(time * 3) * 0.2})`;
  ctx.shadowColor = '#7c4dff';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  for (let fissure = 0; fissure < 9; fissure += 1) {
    const startX = 60 + fissure * 110;
    ctx.beginPath();
    ctx.moveTo(startX, ground + 2);
    ctx.lineTo(startX + 24, ground + 10);
    ctx.lineTo(startX + 10, ground + 22);
    ctx.lineTo(startX + 40, ground + 34);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // tilted slabs and rocks floating in the rift's pull
  ctx.fillStyle = '#5f6283';
  [[220, 0.2], [470, -0.25], [690, 0.15]].forEach(([x, tilt]) => {
    ctx.save();
    ctx.translate(x, ground - 4);
    ctx.rotate(tilt);
    ctx.fillRect(-26, -8, 52, 12);
    ctx.restore();
  });
  for (let rock = 0; rock < 8; rock += 1) {
    const x = 80 + rock * 120;
    const y = ground - 30 - ((time * 12 + rock * 20) % 60);
    ctx.fillStyle = `rgba(95, 98, 131, ${0.7 - ((time * 12 + rock * 20) % 60) / 100})`;
    ctx.fillRect(x, y, 6 + (rock % 3) * 3, 6 + (rock % 3) * 3);
  }
  ctx.restore();
}

// ---------- level 8, after the defeat: taken away... almost ----------
function startKnightRiftAbduct() {
  const lightWarrior = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: true });
  lightWarrior.setCharacterType('lightWarrior');
  lightWarrior.setColor('#fdd835');
  ch6CutsceneBase('knightRiftAbduct', knightRiftAbductLines, 'act', {
    actName: 'grab',
    pendingLine: 0,
    shownIndex: 0,
    rift: 1,
    location: 'farol',
    scroll: 0,
    scrollDone: false,
    wallX: canvas.width + 400,
    musicLevel: 0,
    knight: { x: Math.max(200, Math.min(420, player1.position.x)), lift: 0, state: 'down' },
    jester: { x: Math.max(480, Math.min(640, player2.position.x)), lift: 0, face: -1, alpha: 1, dizzy: 0, tired: false },
    lw: { x: 200, lift: 400, face: 1, alpha: 0, down: false, dazzle: 0, hurt: 0, actor: lightWarrior },
    bubble: null,
    escapeRift: 0,
    endDark: 0,
    fx: { sparks: [], rings: [], shots: [], cards: [], texts: [], scythes: [], flying: [], arcs: [], debris: [], flash: 0, flashColor: '255, 255, 255', shake: 0, beam: 0, bomb: null, speed: 0, energy: null, dim: 0, ring: null, shield: 0, puffs: [], cracks: 0, impacts: [], giants: [], craters: [], slashMarks: [], lampBroken: 0 },
  });
  clearJesterProjectiles();
  playSound('jesterUnlock');
}

function riftAbductBurst(x, y, color, count = 24, speed = 7) {
  const fx = arcadeCutscene.fx;
  for (let spark = 0; spark < count; spark += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = speed * (0.4 + Math.random() * 0.8);
    fx.sparks.push({ x, y, vx: Math.cos(angle) * power, vy: Math.sin(angle) * power, life: 26 + Math.random() * 14, color });
  }
  fx.rings.push({ x, y, radius: 10, life: 30, color });
}

function riftAbductPuff(x, y, gold = false) {
  arcadeCutscene.fx.puffs.push({ x, y, life: 30, gold });
  if (gold) return;
  for (let card = 0; card < 8; card += 1) {
    const angle = (card / 8) * Math.PI * 2;
    arcadeCutscene.fx.cards.push({ x, y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5 - 1, life: 34, spin: Math.random() * 6 });
  }
  playSound('jesterUnlock');
}

// a big hit: manga focus lines, a quick flash and a word
function riftAbductImpact(x, y, word = null, color = '255, 255, 255') {
  const fx = arcadeCutscene.fx;
  fx.impacts.push({ x, y, life: 12, color });
  fx.flash = Math.max(fx.flash, 0.22);
  fx.flashColor = color;
  fx.shake = Math.max(fx.shake, 14);
  if (word) riftAbductText(x, y - 70, word, '#ffffff', 30, 34);
}

function riftAbductText(x, y, text, color, size = 22, life = 60) {
  arcadeCutscene.fx.texts.push({ x, y, text, color, size, life });
}

function startRiftAbductAct(cutscene, name, nextLine) {
  cutscene.phase = 'act';
  cutscene.actName = name;
  cutscene.pendingLine = nextLine;
  cutscene.frame = 0;
}

function updateKnightRiftAbduct(cutscene) {
  const fx = cutscene.fx;
  const knight = cutscene.knight;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  // the music: quiet at first, then all of it
  lightClashMusicFade += (cutscene.musicLevel - lightClashMusicFade) * 0.04;
  // effects
  fx.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.15;
    spark.life -= 1;
  });
  fx.sparks = fx.sparks.filter((spark) => spark.life > 0);
  fx.rings.forEach((ring) => {
    ring.radius += ring.speed || 9;
    ring.life -= 1;
  });
  fx.rings = fx.rings.filter((ring) => ring.life > 0);
  fx.cards.forEach((card) => {
    card.x += card.vx;
    card.y += card.vy;
    card.spin += 0.3;
    card.life -= 1;
  });
  fx.cards = fx.cards.filter((card) => card.life > 0);
  fx.puffs.forEach((puff) => (puff.life -= 1));
  fx.puffs = fx.puffs.filter((puff) => puff.life > 0);
  fx.texts.forEach((text) => {
    text.y -= 0.6;
    text.life -= 1;
  });
  fx.texts = fx.texts.filter((text) => text.life > 0);
  fx.impacts.forEach((impact) => (impact.life -= 1));
  fx.impacts = fx.impacts.filter((impact) => impact.life > 0);
  fx.arcs.forEach((arc) => (arc.life -= 1));
  fx.arcs = fx.arcs.filter((arc) => arc.life > 0);
  fx.debris.forEach((rock) => {
    rock.y -= rock.vy;
    rock.life -= 1;
  });
  fx.debris = fx.debris.filter((rock) => rock.life > 0);
  if (fx.flash > 0) fx.flash = Math.max(0, fx.flash - 0.03);
  if (fx.shake > 0) fx.shake = Math.max(0, fx.shake - 0.6);
  if (fx.shield > 0) fx.shield -= 1;
  if (jester.dizzy > 0) jester.dizzy -= 1;
  if (lw.dazzle > 0) lw.dazzle -= 1;
  if (lw.hurt > 0) lw.hurt -= 1;
  // the held Knight goes wherever Shadow Jester goes
  if (knight.state === 'held') knight.x = jester.x + (jester.carryDir || -1) * 52;
  if (knight.state === 'bubble' && cutscene.bubble) knight.x = cutscene.bubble.x - player1.width / 2;
  // keep the dialog's emotes over the right heads
  cutscene.gamblerX = knight.x;
  cutscene.gamblerTargetX = knight.x;
  cutscene.scammerX = jester.x;
  cutscene.scammerTargetX = jester.x;
  cutscene.scammerY = jester.lift;

  if (cutscene.phase === 'dialog') {
    // an act plays between two lines
    if (cutscene.lineIndex !== cutscene.shownIndex) {
      const previous = cutscene.lines[cutscene.shownIndex];
      cutscene.shownIndex = cutscene.lineIndex;
      if (previous && previous.act) startRiftAbductAct(cutscene, previous.act, cutscene.lineIndex);
    }
    return;
  }
  if (cutscene.phase !== 'act') return;
  const f = cutscene.frame;
  const name = cutscene.actName;

  if (name === 'grab') {
    jester.face = -1;
    if (f < 60) jester.x += (knight.x + 80 - jester.x) * 0.06;
    if (f === 60) {
      knight.state = 'held';
      jester.carryDir = -1;
      playSound('jesterUnlock');
    }
    if (f > 60 && f < 90) knight.lift = Math.min(50, knight.lift + 2);
    if (f >= 90) {
      jester.face = 1;
      jester.carryDir = -1;
      jester.x = Math.min(560, jester.x + 2.2);
    }
  } else if (name === 'flash') {
    // a huge flash of light from the sky shatters the portal (his music starts, far away)
    if (f < 26 && f % 6 === 0) playSound('omegaKickCharge', { pitch: f / 26 });
    if (f === 26) {
      fx.beam = 1;
      fx.flash = 1;
      fx.flashColor = '255, 255, 255';
      fx.shake = 20;
      riftAbductBurst(riftCrackX, ground - 160, '255, 255, 255', 50, 10);
      riftAbductBurst(riftCrackX, ground - 60, '179, 136, 255', 40, 8);
      playSound('omegaKickImpact');
      playSound('judgeOverdrive');
    }
    if (f > 26) {
      fx.beam = Math.max(0, fx.beam - 0.025);
      cutscene.rift = Math.max(0, cutscene.rift - 0.04);
    }
    if (f > 26 && f < 46) jester.x -= 2.5;
  } else if (name === 'lwArrive') {
    // Light Warrior comes down in a column of light
    lw.alpha = 1;
    lw.face = 1;
    lw.lift = Math.max(0, 400 - f * 7);
    if (f === 58) {
      riftAbductBurst(lw.x + 30, ground - 4, '255, 241, 118', 30, 6);
      fx.shake = 8;
      playSound('omegaKickImpact');
    }
  } else if (name === 'bomb') {
    // the BLINDING SCYTHE BOMB
    jester.face = -1;
    if (f === 1) fx.bomb = { t: 0 };
    if (fx.bomb && f <= 24) fx.bomb.t = f / 24;
    if (f === 24) {
      fx.bomb = null;
      fx.flash = 1;
      fx.flashColor = '255, 255, 255';
      fx.shake = 12;
      lw.dazzle = 200;
      fx.scythes = Array.from({ length: 8 }, (_, index) => ({ angle: (index / 8) * Math.PI * 2, radius: 10, life: 90 }));
      riftAbductText(lw.x + 30, ground - 170, 'BOMBA SEGADORA!', '#ce93d8', 26, 90);
      playSound('omegaKickImpact');
      playSound('jesterUnlock');
    }
  } else if (name === 'chase') {
    updateRiftAbductChase(cutscene, f);
  } else if (name === 'bubble') {
    // a dark bubble around the knight
    jester.face = -1;
    if (f === 30) {
      cutscene.bubble = { x: knight.x + player1.width / 2, y: ground - 40, r: 0 };
      knight.state = 'bubble';
      playSound('jesterUnlock');
    }
    if (cutscene.bubble) {
      const bubble = cutscene.bubble;
      bubble.r = Math.min(56, bubble.r + 2.5);
      if (f > 55) {
        bubble.y += (ground - 150 - bubble.y) * 0.06;
        bubble.x += (riftWallX - 60 - bubble.x) * 0.04;
      }
    }
  } else if (name === 'lwAmbush') {
    // out from behind the lamp post, ready to fight
    lw.face = 1;
    lw.alpha = Math.min(1, f / 25);
    lw.x = riftLampX - 30 - Math.min(1, f / 40) * 80;
    if (f === 45) {
      riftAbductBurst(lw.x + 30, ground - 60, '255, 241, 118', 20, 5);
      playSound('judgeLight');
    }
  } else if (name === 'brawl') {
    updateRiftAbductBrawl(cutscene, f);
  } else if (name === 'clashBreak') {
    updateRiftAbductClashBreak(cutscene, f);
  } else if (name === 'scytheStorm') {
    updateRiftAbductScytheStorm(cutscene, f);
  } else if (name === 'escape') {
    // tired and annoyed, he takes the bubble and leaves through a new crack
    jester.face = 1;
    jester.tired = true;
    cutscene.musicLevel = 0.35;
    const bubble = cutscene.bubble;
    if (f < 50) jester.x += (bubble.x - 110 - jester.x) * 0.04;
    if (f === 50) playSound('omegaKickLaunch');
    if (f >= 50 && f < 90) cutscene.escapeRift = Math.min(1, (f - 50) / 30);
    if (f >= 90 && f < 150) {
      const t = (f - 90) / 60;
      jester.alpha = 1 - t;
      cutscene.bubbleFade = 1 - t;
      jester.x += 1.2;
      bubble.x += 1.2;
    }
    if (f >= 150) cutscene.escapeRift = Math.max(0, cutscene.escapeRift - 0.05);
    if (f >= 140) cutscene.endDark = Math.min(0.78, (f - 140) / 60);
  }
  fx.scythes.forEach((scythe) => {
    scythe.radius += 6;
    scythe.angle += 0.12;
    scythe.life -= 1;
  });
  fx.scythes = fx.scythes.filter((scythe) => scythe.life > 0);

  if (f >= riftAbductActFrames[name]) {
    cutscene.phase = 'dialog';
    cutscene.frame = 0;
    if (name === 'grab') {
      cutscene.shownIndex = 0;
      startCutsceneLine(0);
      return;
    }
    cutscene.shownIndex = cutscene.pendingLine;
    startCutsceneLine(cutscene.pendingLine);
  }
}

// the chase: down the streets of Robledal, far from the farol... Light Warrior closing in little by little
function updateRiftAbductChase(cutscene, f) {
  const fx = cutscene.fx;
  const knight = cutscene.knight;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  const chaseEnd = 440;
  if (f === 1) {
    // Light Warrior's theme starts with the chase
    cutscene.musicOn = true;
    cutscene.musicLevel = 1;
    lightClashMusicFade = 1;
    cutscene.location = 'street';
    cutscene.scroll = 0;
    cutscene.wallX = canvas.width + 400;
    jester.x = 380;
    jester.face = 1;
    jester.carryDir = -1;
    knight.state = 'held';
    knight.lift = 50;
    lw.x = -160;
    lw.lift = 0;
    lw.alpha = 1;
    lw.face = 1;
    fx.flash = 0.7;
    fx.flashColor = '10, 6, 20';
  }
  if (f < chaseEnd) {
    cutscene.scroll += 11;
    jester.x += (640 - jester.x) * 0.03;
    jester.lift = Math.min(70, f * 1.5) + Math.sin(f / 9) * 8;
    jester.flying = true;
    lw.running = true;
    // he looks back now and then
    jester.face = f % 100 > 78 ? -1 : 1;
    if (f > 50) {
      // blinded at first... then gaining ground
      const t = Math.min(1, (f - 50) / (chaseEnd - 50));
      const target = -160 + t * t * (jester.x - 170 + 160);
      lw.x += (target - lw.x) * 0.08;
      lw.lift = Math.abs(Math.sin(f / 3)) * 6;
    }
    if (f % 30 === 0 && f < 250) riftAbductText(jester.x + 40, ground - 160, 'JIJIJI', '#ce93d8', 18, 40);
    if (f === 250) {
      riftAbductText(jester.x + 40, ground - 170, '!?', '#ffffff', 34, 60);
      playSound('omegaClashMiss');
    }
    if (f === 300) riftAbductText(lw.x + 30, ground - 170, 'ALTO AHI!', '#fff59d', 26, 70);
    if (f === 340) riftAbductText(jester.x + 40, ground - 170, 'NO, NO, NO!', '#ce93d8', 24, 60);
    if (f % 8 === 0) {
      fx.puffs.push({ x: jester.x + 20, y: ground - 6, life: 18, dust: true });
      fx.puffs.push({ x: lw.x + 20, y: ground - 6, life: 18, dust: true, gold: true });
    }
    if (f > chaseEnd - 40) cutscene.wallX = riftWallX + (chaseEnd - f) * 11;
    return;
  }
  // the street stops: he runs on, looking back at Light Warrior... and never sees the wall
  cutscene.scrollDone = true;
  cutscene.wallX = riftWallX;
  if (!jester.crashed) {
    jester.face = -1;
    jester.x += 8;
    jester.lift = 70 + Math.sin(f / 9) * 8;
    lw.x += 6;
    if (jester.x + player2.width >= riftWallX) {
      jester.crashed = true;
      jester.lift = 0;
      jester.flying = false;
      lw.running = false;
      jester.x = riftWallX - player2.width - 30;
      jester.dizzy = 220;
      knight.state = 'down';
      knight.lift = 0;
      knight.x = jester.x - 110;
      fx.shake = 18;
      riftAbductText(riftWallX - 20, ground - 120, 'BONK!', '#ffffff', 38, 60);
      riftAbductBurst(riftWallX - 10, ground - 90, '255, 255, 255', 22, 6);
      playSound('omegaKickImpact');
    }
  } else {
    // Light Warrior slips back behind a lamp post
    lw.face = 1;
    if (lw.x > riftLampX - 10) lw.x -= 6;
    else lw.alpha = Math.max(0, lw.alpha - 0.08);
  }
}

// the fight between Light Warrior and Shadow Jester, beat by beat
function updateRiftAbductBrawl(cutscene, f) {
  const fx = cutscene.fx;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  const lwCenter = () => ({ x: lw.x + 30, y: ground - 70 - lw.lift });
  fx.speed = f < 650 ? 1 : 0;
  if (f === 1) {
    lw.x = 480;
    lw.face = 1;
    lw.alpha = 1;
    jester.x = 780;
    jester.face = -1;
    jester.lift = 0;
    jester.dizzy = 0;
    lw.lift = 0;
  }
  // 1: both dash in and collide
  if (f < 30) {
    lw.x += 4;
    jester.x -= 3;
  }
  if (f === 30) {
    riftAbductImpact((lw.x + jester.x) / 2 + 30, ground - 70, 'CLANG!');
    riftAbductBurst((lw.x + jester.x) / 2 + 30, ground - 70, '255, 255, 255', 30, 9);
    fx.flash = 0.35;
    fx.shake = 12;
    playSound('omegaClashHit');
  }
  if (f > 30 && f < 55) {
    lw.x -= 1.8;
    jester.x += 1.8;
  }
  // 2: he vanishes and falls from above with his scythe; Light Warrior blocks with a shield of light
  if (f === 66) {
    riftAbductPuff(jester.x + 30, ground - 70);
    jester.alpha = 0;
  }
  if (f === 80) {
    jester.x = lw.x + 20;
    jester.lift = 170;
    jester.alpha = 1;
    riftAbductPuff(jester.x + 30, ground - 240);
  }
  if (f > 80 && f <= 96) jester.lift = Math.max(30, 170 - (f - 80) * 9);
  if (f === 96) {
    riftAbductImpact(lw.x + 30, ground - 140, 'KRAK!', '255, 241, 118');
    riftAbductBurst(lw.x + 30, ground - 140, '255, 241, 118', 30, 8);
    fx.shield = 24;
    fx.shake = 12;
    playSound('omegaKickImpact');
  }
  if (f > 96 && f < 124) {
    jester.x += 9;
    jester.lift = Math.max(0, jester.lift - 3);
  }
  // 3: three shots of light... and cards cutting them
  [128, 140, 152].forEach((shotFrame) => {
    if (f === shotFrame) {
      fx.shots.push({ x: lw.x + 60, y: ground - 70 + (shotFrame - 140) * 1.2, vx: 11 });
      playSound('judgeLight');
    }
  });
  fx.shots.forEach((shot) => {
    shot.x += shot.vx;
    if (shot.x > jester.x - 10) {
      shot.dead = true;
      riftAbductBurst(shot.x, shot.y, '255, 241, 118', 10, 4);
      for (let card = 0; card < 3; card += 1) fx.cards.push({ x: shot.x, y: shot.y, vx: -2 - Math.random() * 4, vy: (Math.random() - 0.5) * 6, life: 30, spin: 0 });
    }
  });
  fx.shots = fx.shots.filter((shot) => !shot.dead);
  // 4: a zigzag dash full of afterimages; Light Warrior flips over it
  if (f >= 185 && f < 225) {
    jester.x -= 8;
    jester.lift = Math.abs(Math.sin((f - 185) / 4)) * 26;
    if (f % 3 === 0) fx.puffs.push({ x: jester.x + 30, y: ground - 60 - jester.lift, life: 16, ghost: true });
    lw.lift = Math.sin(((f - 185) / 40) * Math.PI) * 130;
  }
  if (f === 225) {
    lw.lift = 0;
    jester.lift = 0;
    jester.face = 1;
    lw.face = -1;
  }
  // 5: both leap high and trade blows in the air, swapping sides back
  if (f >= 245 && f <= 305) {
    const t = (f - 245) / 60;
    lw.lift = Math.sin(t * Math.PI) * 210;
    jester.lift = Math.sin(t * Math.PI) * 210;
    lw.x += (560 - lw.x) * 0.06;
    jester.x += (780 - jester.x) * 0.06;
    if (f === 262 || f === 272 || f === 282) {
      riftAbductImpact((lw.x + jester.x) / 2 + 30, ground - 70 - lw.lift, ['PAM!', 'PUM!', 'CLANG!'][(f - 262) / 10]);
      riftAbductBurst((lw.x + jester.x) / 2 + 30, ground - 70 - lw.lift, '255, 255, 255', 18, 7);
      fx.shake = 9;
      playSound('omegaClashHit');
    }
    if (f === 275) {
      lw.face = 1;
      jester.face = -1;
    }
  }
  // 6: a radiant punch sends the jester sliding back
  if (f >= 315 && f < 330) lw.x += 9;
  if (f === 330) {
    riftAbductImpact(jester.x + 10, ground - 70, 'PUÑO RADIANTE!', '255, 241, 118');
    riftAbductBurst(jester.x + 10, ground - 70, '255, 241, 118', 34, 9);
    fx.flash = 0.45;
    fx.flashColor = '255, 241, 118';
    fx.shake = 14;
    playSound('omegaKickImpact');
  }
  if (f > 330 && f < 355) jester.x = Math.min(840, jester.x + 6);
  if (f > 355 && f < 375) lw.x -= 6;
  // 7: a ring of cards closes around him... and a nova of light blows it away
  if (f === 385) {
    fx.ring = { radius: 170, spin: 0 };
    riftAbductText(jester.x + 30, ground - 170, 'ANILLO DE NAIPES!', '#ce93d8', 22, 60);
    playSound('jesterUnlock');
  }
  if (fx.ring) {
    fx.ring.spin += 0.06;
    fx.ring.radius = Math.max(40, fx.ring.radius - (f < 430 ? 1.2 : 4));
    if (f === 445) {
      const center = lwCenter();
      riftAbductBurst(center.x, center.y, '255, 241, 118', 60, 12);
      fx.rings.push({ x: center.x, y: center.y, radius: 20, life: 40, color: '255, 255, 255', speed: 16 });
      for (let card = 0; card < 12; card += 1) {
        const angle = (card / 12) * Math.PI * 2;
        fx.cards.push({ x: center.x + Math.cos(angle) * 40, y: center.y + Math.sin(angle) * 40, vx: Math.cos(angle) * 9, vy: Math.sin(angle) * 9, life: 34, spin: 0 });
      }
      fx.ring = null;
      fx.flash = 0.5;
      fx.flashColor = '255, 241, 118';
      fx.shake = 14;
      riftAbductText(center.x, center.y - 110, 'NOVA SOLAR!', '#fff59d', 26, 60);
      playSound('judgeOverdrive');
    }
  }
  // 8: a flurry of blinks around him
  if (f === 480) riftAbductText(jester.x + 30, ground - 190, 'RAFAGA DE LUZ!', '#fff59d', 26, 70);
  [480, 492, 504, 516, 528, 540].forEach((hitFrame, index) => {
    if (f !== hitFrame) return;
    riftAbductPuff(lw.x + 30, ground - 70 - lw.lift, true);
    lw.x = jester.x + [-90, 90, -70, 80, -100, 70][index];
    lw.lift = [0, 90, 150, 40, 0, 110][index];
    lw.face = lw.x < jester.x ? 1 : -1;
    riftAbductPuff(lw.x + 30, ground - 70 - lw.lift, true);
    riftAbductBurst(jester.x + 30, ground - 80 - jester.lift, '255, 241, 118', 16, 7);
    riftAbductImpact(jester.x + 30, ground - 80 - jester.lift, index === 5 ? 'BAM!' : null, '255, 241, 118');
    jester.x = Math.min(840, jester.x + (lw.face > 0 ? 8 : -8));
    fx.shake = 10;
    playSound('omegaClashHit');
  });
  if (f === 555) {
    lw.x = jester.x - 170;
    lw.lift = 0;
    lw.face = 1;
    riftAbductPuff(lw.x + 30, ground - 70, true);
  }
  // 9: three huge scythe swings; Light Warrior holds behind his shield
  [585, 605, 625].forEach((swingFrame) => {
    if (f !== swingFrame) return;
    jester.x = lw.x + 110;
    fx.arcs.push({ x: jester.x + 10, y: ground - 80, life: 18 });
    fx.shield = 18;
    lw.x -= 24;
    jester.x -= 24;
    riftAbductImpact(lw.x + 60, ground - 80, 'SHING!', '206, 147, 216');
    riftAbductBurst(lw.x + 50, ground - 80, '206, 147, 216', 18, 7);
    fx.shake = 12;
    playSound('omegaKickImpact');
  });
  if (f === 640) {
    jester.x = Math.min(800, lw.x + 280);
    riftAbductPuff(jester.x + 30, ground - 70);
  }
  // 10: the big clash: both float up, power up... and collide
  if (f >= 660 && f < 740) {
    const t = (f - 660) / 80;
    fx.dim = Math.min(0.6, t * 0.6);
    lw.lift = t * 50;
    jester.lift = t * 50;
    fx.energy = { power: t, contact: null };
    if (f % 4 === 0) fx.debris.push({ x: 100 + Math.random() * 820, y: ground, vy: 1 + Math.random() * 2, life: 120, size: 3 + Math.random() * 6 });
    if (f % 10 === 0) playSound('omegaKickCharge', { pitch: t });
  }
  if (f === 740) {
    fx.energy = { power: 1, contact: (lw.x + 60 + jester.x) / 2, epic: true };
    fx.flash = 0.9;
    fx.flashColor = '255, 255, 255';
    fx.shake = 24;
    fx.cracks = 1;
    [0, 8, 16].forEach((delay) => fx.rings.push({ x: fx.energy.contact, y: ground - 120, radius: 10 + delay * 10, life: 50, color: '255, 255, 255', speed: 14 }));
    playSound('omegaKickImpact');
    playSound('judgeOverdrive');
  }
  if (f > 740 && fx.energy) {
    const energy = fx.energy;
    const middle = (lw.x + 60 + jester.x) / 2;
    // it sways back and forth... then the light takes over
    const push = f < 880 ? Math.sin((f - 740) / 18) * 40 : Math.min(1, (f - 880) / 120) * (jester.x - 20 - middle);
    energy.contact = middle + push;
    fx.shake = Math.max(fx.shake, 3);
    if (f % 3 === 0) riftAbductBurst(energy.contact, ground - 120, Math.random() < 0.5 ? '255, 241, 118' : '206, 147, 216', 5, 6);
    if (f % 25 === 0) fx.rings.push({ x: energy.contact, y: ground - 120, radius: 10, life: 30, color: '255, 255, 255', speed: 12 });
    if (f % 4 === 0) fx.debris.push({ x: 100 + Math.random() * 820, y: ground, vy: 1.5 + Math.random() * 2.5, life: 120, size: 3 + Math.random() * 7 });
    if (f === 800) riftAbductText(jester.x + 30, ground - 210, 'JIJIJI! NO PODES CONMIGO!', '#ce93d8', 20, 80);
    if (f === 880) riftAbductText(lw.x + 30, ground - 210, 'CABALLERO... AGUANTA!', '#fff59d', 22, 80);
    if (f === 960) riftAbductText(jester.x + 30, ground - 210, 'Q-QUE...?!', '#ce93d8', 26, 60);
    if (f % 40 === 0) playSound('omegaClashHit');
  }
}

// the clash explodes: Light Warrior's light wins and throws the jester into the wall
function updateRiftAbductClashBreak(cutscene, f) {
  const fx = cutscene.fx;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  if (f === 1) {
    const contact = fx.energy ? fx.energy.contact : jester.x;
    fx.energy = null;
    fx.flash = 1;
    fx.flashColor = '255, 249, 196';
    fx.shake = 28;
    [0, 10, 20].forEach((delay) => fx.rings.push({ x: contact, y: ground - 120, radius: 10 + delay * 6, life: 60, color: '255, 241, 118', speed: 18 }));
    riftAbductBurst(contact, ground - 120, '255, 255, 255', 70, 14);
    jester.from = jester.x;
    playSound('omegaKickImpact');
    playSound('judgeOverdrive');
  }
  if (f <= 30) {
    const t = f / 30;
    jester.x = jester.from + (riftWallX - player2.width - 10 - jester.from) * t;
    jester.lift = 50 + Math.sin(t * Math.PI) * 60;
    jester.face = -1;
  }
  if (f === 30) {
    jester.lift = 0;
    fx.shake = 20;
    riftAbductText(riftWallX - 30, ground - 140, 'CRASH!', '#ffffff', 36, 60);
    riftAbductBurst(riftWallX - 10, ground - 80, '255, 255, 255', 26, 7);
    playSound('omegaKickImpact');
  }
  if (f > 30) {
    jester.lift = 0;
    jester.dizzy = Math.max(jester.dizzy, 60);
  }
  lw.lift = Math.max(0, lw.lift - 2);
  fx.dim = Math.max(0, fx.dim - 0.01);
}

// desperate, he throws every scythe he has... then giant ones that wreck the street
function updateRiftAbductScytheStorm(cutscene, f) {
  const fx = cutscene.fx;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  jester.face = -1;
  jester.dizzy = 0;
  jester.frantic = f < 360;
  fx.dim = Math.max(0, fx.dim - 0.01);
  if (f === 1) riftAbductText(jester.x + 30, ground - 180, 'TOMA! TOMA! TOMAAA!', '#ce93d8', 26, 80);
  if (f === 90) riftAbductText(jester.x + 30, ground - 200, 'CAE! CAE! CAEEE!', '#ff80ab', 30, 70);
  if (f >= 15 && f < 190) {
    const rate = Math.max(3, 9 - Math.floor(f / 30));
    if (f % rate === 0) {
      fx.flying.push({ x: jester.x + 10, y: ground - 60 - Math.random() * 100, vx: -(10 + Math.random() * 6), vy: (Math.random() - 0.4) * 4, spin: Math.random() * 6, size: 14 + Math.random() * 12 });
      if (f % 9 === 0) playSound('jesterUnlock');
    }
  }
  fx.flying.forEach((scythe) => {
    scythe.x += scythe.vx;
    scythe.y += scythe.vy;
    scythe.spin += 0.45;
    if (!lw.down && scythe.x < lw.x + 60) {
      scythe.dead = true;
      if (f < 100) {
        fx.shield = 10;
        riftAbductBurst(lw.x + 60, scythe.y, '255, 241, 118', 8, 5);
        playSound('omegaClashHit');
      } else {
        lw.hurt = 8;
        lw.x = Math.max(120, lw.x - 4);
        fx.shake = Math.max(fx.shake, 8);
        riftAbductBurst(lw.x + 30, scythe.y, '206, 147, 216', 10, 6);
        playSound('omegaClashMiss');
      }
    }
    if (scythe.x < -40) scythe.dead = true;
  });
  fx.flying = fx.flying.filter((scythe) => !scythe.dead);
  if (f === 100) {
    riftAbductImpact(lw.x + 60, ground - 110, 'KRASH!', '255, 241, 118');
    riftAbductText(lw.x + 30, ground - 170, 'ugh...!', '#fff59d', 22, 50);
  }
  // still standing? then GIANT scythes
  if (f === 200) {
    riftAbductText(jester.x + 30, ground - 210, 'TODAVIA?! ENTONCES TOMA ESTO!!', '#ff80ab', 30, 90);
    playSound('judgeFinalStart');
  }
  [235, 285, 335].forEach((throwFrame, index) => {
    if (f === throwFrame) {
      fx.giants.push({ x: jester.x, y: ground - 140 - index * 20, vx: -13, spin: 0, size: 70 + index * 15, index });
      playSound('omegaKickLaunch');
    }
  });
  fx.giants.forEach((giant) => {
    giant.x += giant.vx;
    giant.spin += 0.35;
    // it cuts through everything in its way
    if (giant.x % 40 < 13 && Math.random() < 0.5) fx.slashMarks.push({ x: giant.x, y: giant.y + (Math.random() - 0.5) * 40, angle: -0.3 + Math.random() * 0.6, length: 60 + Math.random() * 60 });
    const target = lw.down ? lw.x + 30 : lw.x + 70;
    if (giant.x < target) {
      giant.dead = true;
      fx.craters.push({ x: giant.x, width: 90 + giant.index * 30 });
      riftAbductImpact(giant.x, ground - 80, ['BOOM!', 'KABOOM!', 'KRAKABOOM!'][giant.index], '206, 147, 216');
      riftAbductBurst(giant.x, ground - 40, '206, 147, 216', 50, 12);
      riftAbductBurst(giant.x, ground - 10, '150, 150, 190', 40, 10);
      fx.rings.push({ x: giant.x, y: ground - 40, radius: 20, life: 40, color: '255, 255, 255', speed: 16 });
      for (let rock = 0; rock < 14; rock += 1) fx.debris.push({ x: giant.x + (Math.random() - 0.5) * 140, y: ground - 10, vy: 2 + Math.random() * 4, life: 70, size: 4 + Math.random() * 8 });
      fx.flash = 0.6;
      fx.shake = 26;
      if (giant.index === 0) fx.lampBroken = 1;
      lw.hurt = 14;
      lw.x = Math.max(100, lw.x - 30);
      if (giant.index === 2) {
        lw.down = true;
        fx.flying = [];
      }
      playSound('omegaKickImpact');
      playSound('judgeOverdrive');
    }
  });
  fx.giants = fx.giants.filter((giant) => !giant.dead);
  // and then he is spent
  if (f > 370) {
    jester.tired = true;
    if (f % 30 === 0) riftAbductText(jester.x + 30, ground - 150, 'haah...', '#b39ddb', 16, 40);
  }
}

// a stone wall on the right (he will meet it soon)
function drawRiftAbductWall(x = riftWallX) {
  ctx.fillStyle = '#3b3e5a';
  ctx.fillRect(x, ground - 230, canvas.width - x + 600, 230);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 7; row += 1) {
    const y = ground - 230 + row * 33;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    for (let brick = x + (row % 2) * 22; brick < canvas.width; brick += 44) {
      ctx.beginPath();
      ctx.moveTo(brick, y);
      ctx.lineTo(brick, y + 33);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#4e5170';
  ctx.fillRect(x - 6, ground - 238, canvas.width - x + 600, 10);
}

// the streets of Robledal, scrolling while they run (the farol getting smaller behind)
function drawRiftChaseStage(scroll) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const wrap = (value, span) => ((value % span) + span) % span;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#05061a');
  sky.addColorStop(0.7, '#1d1a46');
  sky.addColorStop(1, '#3a2a62');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 50; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 1.6 + star) * 0.3})`;
    ctx.fillRect(wrap(star * 127 - scroll * 0.02, width), (star * 53) % 250, 2, 2);
  }
  ctx.fillStyle = '#e8eaf6';
  ctx.beginPath();
  ctx.arc(150, 80, 30, 0, Math.PI * 2);
  ctx.fill();
  // the Gran Farol, left far behind
  const farolX = 520 - scroll * 0.08;
  if (farolX > -120) drawGreatLantern(farolX, ground - 120, Math.max(0.3, 0.8 - scroll / 9000), ground + 80);
  // far roofs
  for (let roof = 0; roof < 16; roof += 1) {
    const x = wrap(roof * 80 - scroll * 0.3, width + 160) - 80;
    const y = ground - 120 + (roof % 3) * 10;
    ctx.fillStyle = '#141633';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30, y - 22);
    ctx.lineTo(x + 60, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x + 6, y, 48, 120);
    ctx.fillStyle = `rgba(255, 213, 79, ${0.5 + Math.sin(time * 2 + roof) * 0.2})`;
    ctx.fillRect(x + 24, y + 12, 8, 8);
  }
  // the houses of the street
  const colors = ['#5d4037', '#4e5d73', '#6d4c41', '#455a64'];
  for (let house = 0; house < 7; house += 1) {
    const x = wrap(house * 230 - scroll, width + 460) - 230;
    const top = ground - 170 - (house % 2) * 20;
    ctx.fillStyle = colors[house % colors.length];
    ctx.fillRect(x, top, 170, ground - top);
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.moveTo(x - 14, top);
    ctx.lineTo(x + 85, top - 50);
    ctx.lineTo(x + 184, top);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd180';
    ctx.fillRect(x + 22, top + 30, 30, 26);
    ctx.fillRect(x + 118, top + 30, 30, 26);
    ctx.fillStyle = '#2e1a12';
    ctx.fillRect(x + 70, ground - 60, 32, 60);
  }
  // street lamps
  for (let lamp = 0; lamp < 5; lamp += 1) {
    const x = wrap(lamp * 330 + 120 - scroll, width + 330) - 160;
    ctx.fillStyle = '#2b2d45';
    ctx.fillRect(x, ground - 150, 8, 150);
    const glow = ctx.createRadialGradient(x + 4, ground - 160, 2, x + 4, ground - 160, 40);
    glow.addColorStop(0, 'rgba(255, 224, 130, 0.7)');
    glow.addColorStop(1, 'rgba(255, 224, 130, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 36, ground - 200, 80, 80);
    ctx.fillStyle = '#ffe082';
    ctx.fillRect(x - 3, ground - 168, 14, 14);
  }
  // the cobbled street
  ctx.fillStyle = '#4e5170';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#5f6283';
  ctx.fillRect(0, ground, width, 6);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  for (let stone = 0; stone < 30; stone += 1) {
    const x = wrap(stone * 40 - scroll, width + 40) - 20;
    ctx.beginPath();
    ctx.moveTo(x, ground + 6);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawRiftAbductStage(cutscene) {
  if (cutscene.location === 'street') {
    drawRiftChaseStage(cutscene.scroll);
    if (cutscene.wallX < canvas.width) drawRiftAbductWall(cutscene.wallX);
  } else {
    drawFarolRiftStage(cutscene.rift, 0.25);
  }
}

function drawRiftActor(fighter, x, lift, faceRight, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  fighter.position = { x, y: ground - fighter.height - lift };
  fighter.attacksToTheRight = faceRight;
  fighter.isAttacking = false;
  fighter.draw();
  ctx.restore();
}

function drawRiftLyingFighter(fighter, centerX, baseY, scale = 1) {
  // the fighter lying on its side, its back on baseY
  const saved = { ...fighter.position };
  ctx.save();
  ctx.translate(centerX, baseY - (fighter.width / 2 + 10) * scale);
  ctx.rotate(-Math.PI / 2);
  ctx.scale(scale, scale);
  fighter.position = { x: -fighter.width / 2, y: -fighter.height / 2 };
  fighter.attacksToTheRight = true;
  fighter.isAttacking = false;
  fighter.draw();
  ctx.restore();
  fighter.position = saved;
}

function drawRiftLightning(x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const steps = 7;
  for (let step = 1; step < steps; step += 1) {
    const t = step / steps;
    ctx.lineTo(x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30, y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawKnightRiftAbductFx(cutscene) {
  const time = performance.now() / 1000;
  const fx = cutscene.fx;
  const knight = cutscene.knight;
  const jester = cutscene.jester;
  const lw = cutscene.lw;
  const f = cutscene.frame;
  const acting = cutscene.phase === 'act';
  ctx.save();
  if (fx.shake > 0) ctx.translate((Math.random() - 0.5) * fx.shake * 0.6, (Math.random() - 0.5) * fx.shake * 0.6);
  // the world goes dark for the big clash
  if (fx.dim > 0) {
    ctx.fillStyle = `rgba(0, 0, 8, ${fx.dim})`;
    ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
  }
  // cracks in the street from the clash
  if (fx.cracks > 0 && cutscene.location === 'street') {
    ctx.strokeStyle = `rgba(255, 241, 118, ${0.6 + Math.sin(time * 4) * 0.2})`;
    ctx.lineWidth = 2;
    for (let crack = 0; crack < 8; crack += 1) {
      const startX = 300 + crack * 60;
      ctx.beginPath();
      const lean = crack % 2 ? 1 : -1;
      ctx.moveTo(startX, ground + 2);
      ctx.lineTo(startX + lean * 14, ground + 10);
      ctx.lineTo(startX + lean * 6, ground + 18);
      ctx.lineTo(startX + lean * 26, ground + 30 + (crack % 3) * 6);
      ctx.moveTo(startX + lean * 14, ground + 10);
      ctx.lineTo(startX + lean * 34, ground + 8);
      ctx.stroke();
    }
  }
  // what the giant scythes left: cuts across the houses and craters in the street
  fx.slashMarks.forEach((mark) => {
    ctx.save();
    ctx.translate(mark.x, mark.y);
    ctx.rotate(mark.angle);
    ctx.fillStyle = 'rgba(20, 0, 30, 0.75)';
    ctx.fillRect(-mark.length / 2, -3, mark.length, 6);
    ctx.fillStyle = 'rgba(206, 147, 216, 0.5)';
    ctx.fillRect(-mark.length / 2, -1, mark.length, 2);
    ctx.restore();
  });
  fx.craters.forEach((crater, index) => {
    ctx.fillStyle = '#0b0614';
    ctx.beginPath();
    ctx.ellipse(crater.x, ground + 6, crater.width / 2, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(206, 147, 216, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let smoke = 0; smoke < 3; smoke += 1) {
      const rise = (time * 30 + smoke * 25 + index * 13) % 80;
      ctx.fillStyle = `rgba(90, 80, 110, ${0.35 * (1 - rise / 80)})`;
      ctx.beginPath();
      ctx.arc(crater.x + (smoke - 1) * 20, ground - rise, 10 + rise / 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  fx.debris.forEach((rock) => {
    ctx.fillStyle = `rgba(150, 150, 190, ${Math.min(0.8, rock.life / 60)})`;
    ctx.fillRect(rock.x, rock.y, rock.size, rock.size);
  });
  // speed lines during the fight and the chase
  if ((fx.speed > 0 && acting && cutscene.actName === 'brawl') || (acting && cutscene.actName === 'chase' && !cutscene.scrollDone)) {
    for (let streak = 0; streak < 14; streak += 1) {
      const y = 140 + ((streak * 53 + time * 900) % 340);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(((streak * 137 + time * 1400) % (canvas.width + 200)) - 200, y, 160, 2);
    }
  }
  // the beam of light that breaks the portal
  if (fx.beam > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${fx.beam})`;
    ctx.shadowColor = '#fff59d';
    ctx.shadowBlur = 50;
    ctx.fillRect(riftCrackX - 40 * fx.beam, 0, 80 * fx.beam, ground);
    ctx.shadowBlur = 0;
  }
  if (acting && cutscene.actName === 'flash' && f < 26) {
    const gather = ctx.createRadialGradient(riftCrackX, 40, 2, riftCrackX, 40, 30 + f * 4);
    gather.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gather.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = gather;
    ctx.fillRect(riftCrackX - 150, -100, 300, 300);
  }
  // the new little crack he escapes through
  if (cutscene.escapeRift > 0) {
    const size = cutscene.escapeRift;
    const x = riftWallX - 40;
    ctx.save();
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#05000c';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, ground - 200 * size);
    for (let step = 1; step <= 6; step += 1) ctx.lineTo(x + (step % 2 ? 22 : 8) * size, ground - 200 * size + step * 33 * size);
    for (let step = 6; step >= 1; step -= 1) ctx.lineTo(x - (step % 2 ? 20 : 6) * size, ground - 200 * size + step * 33 * size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // the big clash: two great beams and lightning
  if (fx.energy && fx.energy.contact === null) {
    [[lw.x + 30, ground - 70 - lw.lift, '255, 241, 118'], [jester.x + 30, ground - 70 - jester.lift, '179, 136, 255']].forEach(([x, y, color]) => {
      const aura = ctx.createRadialGradient(x, y, 6, x, y, 50 + fx.energy.power * 110);
      aura.addColorStop(0, `rgba(${color}, ${0.6 * fx.energy.power})`);
      aura.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = aura;
      ctx.fillRect(x - 170, y - 170, 340, 340);
      if (Math.random() < fx.energy.power * 0.5) drawRiftLightning(x, y, x + (Math.random() - 0.5) * 160, y - 60 - Math.random() * 100, `rgba(${color}, 0.8)`, 2);
    });
  } else if (fx.energy) {
    const contact = fx.energy.contact;
    const lwY = ground - 70 - lw.lift;
    const jesterY = ground - 70 - jester.lift;
    const midY = (lwY + jesterY) / 2;
    const swell = 1 + Math.sin(time * 18) * 0.1;
    ctx.fillStyle = 'rgba(255, 241, 118, 0.5)';
    ctx.beginPath();
    ctx.moveTo(lw.x + 50, lwY - 50 * swell);
    ctx.lineTo(contact, midY - 22);
    ctx.lineTo(contact, midY + 22);
    ctx.lineTo(lw.x + 50, lwY + 50 * swell);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(lw.x + 50, lwY - 6, contact - lw.x - 50, 12);
    ctx.fillStyle = 'rgba(179, 136, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(jester.x + 10, jesterY - 50 * swell);
    ctx.lineTo(contact, midY - 22);
    ctx.lineTo(contact, midY + 22);
    ctx.lineTo(jester.x + 10, jesterY + 50 * swell);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(225, 190, 231, 0.7)';
    ctx.fillRect(contact, jesterY - 6, jester.x + 10 - contact, 12);
    const core = ctx.createRadialGradient(contact, midY, 2, contact, midY, 110 + Math.sin(time * 20) * 12);
    core.addColorStop(0, 'rgba(255, 255, 255, 1)');
    core.addColorStop(0.4, 'rgba(255, 241, 118, 0.7)');
    core.addColorStop(1, 'rgba(179, 136, 255, 0)');
    ctx.fillStyle = core;
    ctx.fillRect(contact - 140, midY - 140, 280, 280);
    for (let bolt = 0; bolt < 4; bolt += 1) {
      const angle = Math.random() * Math.PI * 2;
      drawRiftLightning(contact, midY, contact + Math.cos(angle) * 140, midY + Math.sin(angle) * 110, Math.random() < 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(206, 147, 216, 0.8)', 2);
    }
  }
  // the chase: a dark aura around the flying jester, a yellow one around the running Light Warrior
  if (jester.flying) {
    const jx = jester.x + 30;
    const jy = ground - 70 - jester.lift;
    const dark = ctx.createRadialGradient(jx, jy, 8, jx, jy, 110);
    dark.addColorStop(0, 'rgba(49, 27, 146, 0.8)');
    dark.addColorStop(0.6, 'rgba(20, 0, 40, 0.55)');
    dark.addColorStop(1, 'rgba(20, 0, 40, 0)');
    ctx.fillStyle = dark;
    ctx.fillRect(jx - 120, jy - 120, 240, 240);
    for (let wisp = 0; wisp < 10; wisp += 1) {
      const back = (time * 260 + wisp * 37) % 200;
      ctx.fillStyle = `rgba(30, 10, 60, ${0.6 * (1 - back / 200)})`;
      ctx.fillRect(jx - 30 - back, jy - 40 + ((wisp * 23) % 80), 14, 8);
    }
  }
  if (lw.running && lw.alpha > 0) {
    const lx = lw.x + 30;
    const ly = ground - 70 - lw.lift;
    const gold = ctx.createRadialGradient(lx, ly, 8, lx, ly, 100);
    gold.addColorStop(0, 'rgba(255, 241, 118, 0.5)');
    gold.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = gold;
    ctx.fillRect(lx - 110, ly - 110, 220, 220);
    for (let streak = 0; streak < 8; streak += 1) {
      const back = (time * 300 + streak * 29) % 160;
      ctx.fillStyle = `rgba(255, 249, 196, ${0.7 * (1 - back / 160)})`;
      ctx.fillRect(lx - 30 - back, ly - 50 + streak * 13, 30, 3);
    }
  }
  // Light Warrior
  if (lw.alpha > 0) {
    if (lw.lift > 0 && cutscene.actName === 'lwArrive' && acting) {
      ctx.fillStyle = 'rgba(255, 249, 196, 0.3)';
      ctx.fillRect(lw.x - 10, 0, player2.width + 20, ground);
    }
    if (lw.down) {
      drawRiftLyingFighter(lw.actor, lw.x + 30, ground);
    } else {
      ctx.save();
      if (lw.hurt > 0) ctx.translate((Math.random() - 0.5) * 6, 0);
      drawRiftActor(lw.actor, lw.x, lw.lift, lw.face > 0, lw.alpha);
      ctx.restore();
      if (lw.hurt > 0) {
        ctx.fillStyle = 'rgba(206, 147, 216, 0.35)';
        ctx.fillRect(lw.x, ground - lw.actor.height - lw.lift, lw.actor.width, lw.actor.height);
      }
    }
    if (lw.dazzle > 0 && !lw.down) {
      for (let star = 0; star < 3; star += 1) {
        const angle = time * 6 + star * 2.1;
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 16px Courier New, monospace';
        ctx.fillText('*', lw.x + 26 + Math.cos(angle) * 26, ground - 140 - lw.lift + Math.sin(angle) * 8);
      }
    }
    if (fx.shield > 0 && !lw.down) {
      ctx.strokeStyle = `rgba(255, 241, 118, ${Math.min(1, fx.shield / 18)})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(lw.x + 30, ground - 90 - lw.lift, 64, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    }
  }
  // Knight: lying, carried, or inside the bubble
  if (knight.state === 'down') {
    drawRiftLyingFighter(player1, knight.x + player1.width / 2 + 30, ground);
  } else if (knight.state === 'held') {
    drawRiftLyingFighter(player1, knight.x + player1.width / 2, ground - knight.lift - jester.lift);
    ctx.strokeStyle = 'rgba(124, 77, 255, 0.6)';
    ctx.lineWidth = 3;
    for (let tendril = 0; tendril < 4; tendril += 1) {
      ctx.beginPath();
      ctx.moveTo(jester.x + 30, ground - 70 - jester.lift);
      ctx.quadraticCurveTo(knight.x + 30 + tendril * 6, ground - 120 - knight.lift + Math.sin(time * 5 + tendril) * 10, knight.x + 10 + tendril * 14, ground - knight.lift - jester.lift - 20);
      ctx.stroke();
    }
  } else if (knight.state === 'bubble' && cutscene.bubble) {
    const bubble = cutscene.bubble;
    ctx.save();
    ctx.globalAlpha = cutscene.bubbleFade === undefined ? 1 : Math.max(0, cutscene.bubbleFade);
    drawRiftLyingFighter(player1, bubble.x, bubble.y + 26, 0.55);
    const shell = ctx.createRadialGradient(bubble.x - bubble.r * 0.3, bubble.y - bubble.r * 0.3, 4, bubble.x, bubble.y, bubble.r);
    shell.addColorStop(0, 'rgba(206, 147, 216, 0.25)');
    shell.addColorStop(0.8, 'rgba(49, 27, 146, 0.55)');
    shell.addColorStop(1, 'rgba(20, 0, 40, 0.85)');
    ctx.fillStyle = shell;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.ellipse(bubble.x - bubble.r * 0.4, bubble.y - bubble.r * 0.45, bubble.r * 0.18, bubble.r * 0.1, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Shadow Jester (shaking with rage while he throws)
  if (jester.alpha > 0) {
    drawRiftActor(player2, jester.x + (jester.frantic ? (Math.random() - 0.5) * 6 : 0), jester.lift, jester.face > 0, jester.alpha);
    if (jester.frantic && acting && cutscene.actName === 'scytheStorm') {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.25)';
      ctx.fillRect(jester.x, ground - player2.height, player2.width, 60);
    }
    if (jester.dizzy > 0) {
      for (let star = 0; star < 3; star += 1) {
        const angle = time * 7 + star * 2.1;
        ctx.fillStyle = '#fff59d';
        ctx.font = '900 16px Courier New, monospace';
        ctx.fillText('*', jester.x + 26 + Math.cos(angle) * 26, ground - player2.height - 12 - jester.lift + Math.sin(angle) * 8);
      }
    }
    if (jester.tired && jester.alpha > 0.3) {
      // tired and annoyed: sweat, and a little steam
      drawScaredSweat(player2, 1.2);
      ctx.fillStyle = 'rgba(255, 82, 82, 0.8)';
      ctx.font = '900 18px Courier New, monospace';
      ctx.fillText('#', jester.x + 50, ground - player2.height - 6);
    }
  }
  // the blinding scythe bomb
  if (fx.bomb) {
    const t = fx.bomb.t;
    const x = jester.x + 10 + (lw.x + 40 - jester.x - 10) * t;
    const y = ground - 100 - Math.sin(t * Math.PI) * 120;
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd740';
    ctx.fillRect(x - 1, y - 18, 3, 6);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  const drawScythe = (x, y, angle, size, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-size * 0.08, -size, size * 0.16, size * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.strokeStyle = '#7c4dff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -size * 0.9, size, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.arc(0, -size * 0.55, size * 0.75, Math.PI * 0.9, Math.PI * 0.1, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  fx.scythes.forEach((scythe) => drawScythe(lw.x + 30 + Math.cos(scythe.angle) * scythe.radius, ground - 90 + Math.sin(scythe.angle) * scythe.radius * 0.6, scythe.angle * 3, 14, scythe.life / 90));
  fx.flying.forEach((scythe) => drawScythe(scythe.x, scythe.y, scythe.spin, scythe.size));
  fx.giants.forEach((giant) => {
    ctx.save();
    ctx.shadowColor = '#7c4dff';
    ctx.shadowBlur = 30;
    drawScythe(giant.x, giant.y, giant.spin, giant.size);
    ctx.restore();
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.4)';
    ctx.lineWidth = giant.size * 0.5;
    ctx.beginPath();
    ctx.moveTo(giant.x + 20, giant.y);
    ctx.lineTo(giant.x + 160, giant.y);
    ctx.stroke();
  });
  // focus lines of the big hits
  fx.impacts.forEach((impact) => {
    ctx.strokeStyle = `rgba(${impact.color}, ${impact.life / 12})`;
    ctx.lineWidth = 3;
    for (let line = 0; line < 18; line += 1) {
      const angle = (line / 18) * Math.PI * 2 + impact.life;
      const inner = 40 + (12 - impact.life) * 8;
      ctx.beginPath();
      ctx.moveTo(impact.x + Math.cos(angle) * inner, impact.y + Math.sin(angle) * inner);
      ctx.lineTo(impact.x + Math.cos(angle) * (inner + 70), impact.y + Math.sin(angle) * (inner + 70));
      ctx.stroke();
    }
  });
  // the scythe swings
  fx.arcs.forEach((arc) => {
    ctx.strokeStyle = `rgba(206, 147, 216, ${arc.life / 18})`;
    ctx.lineWidth = 12 * (arc.life / 18);
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, 90, Math.PI * 0.6, Math.PI * 1.4);
    ctx.stroke();
  });
  // the ring of cards closing in
  if (fx.ring) {
    const centerX = lw.x + 30;
    const centerY = ground - 70 - lw.lift;
    for (let card = 0; card < 12; card += 1) {
      const angle = fx.ring.spin + (card / 12) * Math.PI * 2;
      ctx.save();
      ctx.translate(centerX + Math.cos(angle) * fx.ring.radius, centerY + Math.sin(angle) * fx.ring.radius * 0.7);
      ctx.rotate(angle);
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(-7, -10, 14, 20);
      ctx.strokeStyle = card % 2 ? '#ff4081' : '#b388ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-7, -10, 14, 20);
      ctx.restore();
    }
  }
  // the light shots of the fight
  fx.shots.forEach((shot) => {
    const glow = ctx.createRadialGradient(shot.x, shot.y, 1, shot.x, shot.y, 14);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.5, 'rgba(255, 241, 118, 0.9)');
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, 14, 0, Math.PI * 2);
    ctx.fill();
  });
  // puffs, cards, sparks and rings
  fx.puffs.forEach((puff) => {
    if (puff.dust) {
      ctx.fillStyle = `rgba(${puff.gold ? '255, 241, 118' : '150, 140, 170'}, ${puff.life / 40})`;
      ctx.beginPath();
      ctx.arc(puff.x - (18 - puff.life) * 2, puff.y - (18 - puff.life), 4 + (18 - puff.life) / 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (puff.ghost) {
      ctx.fillStyle = `rgba(124, 77, 255, ${puff.life / 40})`;
      ctx.fillRect(puff.x - 20, puff.y - 40, 40, 80);
      return;
    }
    const color = puff.gold ? '255, 241, 118' : '124, 77, 255';
    const smoke = ctx.createRadialGradient(puff.x, puff.y, 2, puff.x, puff.y, 60 - puff.life);
    smoke.addColorStop(0, `rgba(${color}, ${puff.life / 40})`);
    smoke.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = smoke;
    ctx.fillRect(puff.x - 70, puff.y - 70, 140, 140);
  });
  fx.cards.forEach((card) => {
    ctx.save();
    ctx.translate(card.x, card.y);
    ctx.rotate(card.spin);
    ctx.fillStyle = `rgba(250, 250, 250, ${card.life / 34})`;
    ctx.fillRect(-6, -8, 12, 16);
    ctx.restore();
  });
  fx.sparks.forEach((spark) => {
    ctx.fillStyle = `rgba(${spark.color}, ${Math.min(1, spark.life / 20)})`;
    ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
  });
  fx.rings.forEach((ring) => {
    ctx.strokeStyle = `rgba(${ring.color}, ${ring.life / 30})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  // the lamp post he hides behind (in the street, once they stop)
  if (cutscene.location === 'street' && cutscene.scrollDone && fx.lampBroken) {
    // cut in half: the top lies on the street
    ctx.fillStyle = '#2b2d45';
    ctx.fillRect(riftLampX, ground - 90, 14, 90);
    ctx.save();
    ctx.translate(riftLampX - 40, ground - 8);
    ctx.rotate(-0.12);
    ctx.fillRect(-120, -7, 120, 14);
    ctx.fillStyle = '#5d5f78';
    ctx.fillRect(-140, -12, 22, 22);
    ctx.restore();
  } else if (cutscene.location === 'street' && cutscene.scrollDone) {
    ctx.fillStyle = '#2b2d45';
    ctx.fillRect(riftLampX, ground - 210, 14, 210);
    ctx.fillRect(riftLampX - 12, ground - 218, 38, 10);
    ctx.fillRect(riftLampX - 6, ground - 6, 26, 6);
    const lamp = ctx.createRadialGradient(riftLampX + 7, ground - 232, 2, riftLampX + 7, ground - 232, 50);
    lamp.addColorStop(0, 'rgba(255, 224, 130, 0.8)');
    lamp.addColorStop(1, 'rgba(255, 224, 130, 0)');
    ctx.fillStyle = lamp;
    ctx.fillRect(riftLampX - 45, ground - 285, 105, 105);
    ctx.fillStyle = '#ffe082';
    ctx.fillRect(riftLampX - 3, ground - 244, 20, 22);
  }
  // floating words
  fx.texts.forEach((text) => {
    ctx.save();
    ctx.globalAlpha = Math.min(1, text.life / 20);
    ctx.font = `italic 900 ${text.size}px Courier New, monospace`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1a0033';
    ctx.fillStyle = text.color;
    // (kept inside the screen)
    const half = ctx.measureText(text.text).width / 2;
    const textX = Math.max(half + 10, Math.min(canvas.width - half - 10, text.x));
    ctx.strokeText(text.text, textX, text.y);
    ctx.fillText(text.text, textX, text.y);
    ctx.restore();
  });
  ctx.restore();
  if (fx.flash > 0) {
    ctx.fillStyle = `rgba(${fx.flashColor}, ${Math.min(1, fx.flash)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (cutscene.endDark > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.endDark})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- the secret boss: the Templo Shaolin and Shang Ting ----------
function drawShaolinTempleStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  // a warm dusk sky over misty mountains
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#f8bbd0');
  sky.addColorStop(0.5, '#ffcc80');
  sky.addColorStop(1, '#ffe0b2');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = 'rgba(255, 112, 67, 0.85)';
  ctx.beginPath();
  ctx.arc(820, 120, 46, 0, Math.PI * 2);
  ctx.fill();
  [['rgba(161, 136, 127, 0.5)', 0.35, ground - 230], ['rgba(121, 85, 72, 0.55)', 0.6, ground - 180]].forEach(([color, sharp, base]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, ground);
    for (let peak = 0; peak <= 8; peak += 1) {
      const peakX = peak * (width / 8);
      ctx.lineTo(peakX - 40, base + 70);
      ctx.lineTo(peakX, base - (peak % 2 ? 30 : 60) * sharp);
    }
    ctx.lineTo(width, ground);
    ctx.closePath();
    ctx.fill();
  });
  for (let mist = 0; mist < 5; mist += 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(((mist * 260 + time * 8) % (width + 300)) - 150, ground - 150 + (mist % 2) * 20, 160, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // a pagoda far behind
  const pagodaX = 160;
  for (let floor = 0; floor < 5; floor += 1) {
    const floorY = ground - 150 - floor * 34;
    const floorWidth = 90 - floor * 12;
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(pagodaX - floorWidth / 2 + 8, floorY, floorWidth - 16, 28);
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.moveTo(pagodaX - floorWidth / 2 - 14, floorY + 2);
    ctx.quadraticCurveTo(pagodaX, floorY - 18, pagodaX + floorWidth / 2 + 14, floorY + 2);
    ctx.lineTo(pagodaX + floorWidth / 2, floorY + 6);
    ctx.lineTo(pagodaX - floorWidth / 2, floorY + 6);
    ctx.closePath();
    ctx.fill();
  }
  // the temple hall: red walls and columns, a curved golden-edged roof
  const hallX = 300;
  const hallW = 520;
  const hallTop = ground - 220;
  ctx.fillStyle = '#c62828';
  ctx.fillRect(hallX, hallTop + 60, hallW, 160);
  ctx.fillStyle = '#8e0000';
  for (let column = 0; column < 7; column += 1) ctx.fillRect(hallX + 20 + column * 80, hallTop + 60, 16, 160);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(hallX + 220, hallTop + 120, 80, 100);
  ctx.fillStyle = '#ffca28';
  ctx.fillRect(hallX + 256, hallTop + 120, 8, 100);
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.moveTo(hallX - 70, hallTop + 50);
  ctx.quadraticCurveTo(hallX - 20, hallTop + 40, hallX + 10, hallTop);
  ctx.lineTo(hallX + hallW - 10, hallTop);
  ctx.quadraticCurveTo(hallX + hallW + 20, hallTop + 40, hallX + hallW + 70, hallTop + 50);
  ctx.lineTo(hallX + hallW + 40, hallTop + 66);
  ctx.lineTo(hallX - 40, hallTop + 66);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hallX - 70, hallTop + 50);
  ctx.quadraticCurveTo(hallX - 20, hallTop + 40, hallX + 10, hallTop);
  ctx.lineTo(hallX + hallW - 10, hallTop);
  ctx.quadraticCurveTo(hallX + hallW + 20, hallTop + 40, hallX + hallW + 70, hallTop + 50);
  ctx.stroke();
  // the sign over the door
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(hallX + 200, hallTop + 72, 120, 34);
  ctx.strokeStyle = '#ffca28';
  ctx.strokeRect(hallX + 200, hallTop + 72, 120, 34);
  ctx.fillStyle = '#ffca28';
  ctx.font = '900 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('少林寺', hallX + 260, hallTop + 97);
  ctx.textAlign = 'left';
  // red lanterns swaying
  [hallX + 40, hallX + 180, hallX + 340, hallX + 480].forEach((lanternX, index) => {
    const sway = Math.sin(time * 1.5 + index) * 3;
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lanternX, hallTop + 66);
    ctx.lineTo(lanternX + sway, hallTop + 84);
    ctx.stroke();
    const glow = ctx.createRadialGradient(lanternX + sway, hallTop + 98, 2, lanternX + sway, hallTop + 98, 34);
    glow.addColorStop(0, 'rgba(255, 213, 79, 0.6)');
    glow.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lanternX - 34, hallTop + 64, 68, 68);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.ellipse(lanternX + sway, hallTop + 98, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.fillRect(lanternX + sway - 6, hallTop + 82, 12, 3);
    ctx.fillRect(lanternX + sway - 6, hallTop + 112, 12, 3);
  });
  // a cherry tree on the right, petals drifting
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(900, ground - 180, 14, 180);
  ctx.fillStyle = '#f48fb1';
  [[907, ground - 200, 60], [870, ground - 170, 40], [950, ground - 170, 44]].forEach(([blossomX, blossomY, radius]) => {
    ctx.beginPath();
    ctx.arc(blossomX, blossomY, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  for (let petal = 0; petal < 18; petal += 1) {
    const fall = (time * 30 + petal * 47) % (ground + 20);
    ctx.fillStyle = 'rgba(248, 187, 208, 0.9)';
    ctx.fillRect(((petal * 113 + Math.sin(time + petal) * 30) % width), fall, 5, 3);
  }
  // incense burner with smoke
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(hallX + 236, ground - 34, 48, 26);
  ctx.fillRect(hallX + 228, ground - 40, 64, 8);
  for (let smoke = 0; smoke < 4; smoke += 1) {
    const rise = (time * 20 + smoke * 18) % 70;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - rise / 70)})`;
    ctx.beginPath();
    ctx.arc(hallX + 260 + Math.sin(time * 2 + smoke) * 6, ground - 44 - rise, 5 + rise / 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // the stone courtyard
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#bcaaa4';
  ctx.fillRect(0, ground, width, 5);
  ctx.strokeStyle = 'rgba(62, 39, 35, 0.3)';
  ctx.lineWidth = 1;
  for (let tile = 0; tile < width; tile += 64) {
    ctx.beginPath();
    ctx.moveTo(tile, ground + 5);
    ctx.lineTo(tile - 20, canvas.height);
    ctx.stroke();
  }
}

function startShaolinChallenge() {
  // he only fights those who still have something to learn
  if (isShaolinForbiddenHero(player1)) {
    showCustomToast(`SHANG TING: ${shaolinForbiddenText}`, 'El maestro se niega a pelear contra ese luchador. Elegi otro (cualquiera menos Divine General, Light Warrior o Knight).');
    playSound('cutsceneAngry');
    return;
  }
  shaolinChallenge.active = true;
  normalArcadeActive = false;
  selectedMap = 'shaolinTemple';
  player2.setCharacterType('normal', 'shaolinMaster');
  mapScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  startGame();
  startShaolinIntro();
}

function configureShaolinChallenge() {
  selectedMap = 'shaolinTemple';
  if (player2.secretVariant !== 'shaolinMaster') player2.setCharacterType('normal', 'shaolinMaster');
  applyBotDifficulty();
  player2.setMaxHealth(shaolinHealth);
  player2.health = player2.maxHealth;
  resetShaolin(player2);
  updateHealthBars();
  updateCombatHudIdentity();
}

function startShaolinIntro() {
  const hero = isScammer(player1) ? 'scammer' : player1.characterType;
  const lines = (shaolinIntroLines[hero] || shaolinIntroLines.generic).map((line) => ({ ...line, speaker: line.speaker === 'hero' ? getShaolinHeroSpeaker() : line.speaker }));
  // he is meditating when you arrive, stands up on his first words, and takes his stance at the end
  lines.unshift({ speaker: 'shang', text: '......嗡......(Ommm......)', meditate: true });
  lines[1] = { ...lines[1], stand: true };
  if (!lines[lines.length - 1].text.includes('来吧')) lines.push({ speaker: 'shang', text: '来吧！(Ven!)', stance: true, emote: { who: 'scammer', symbol: '!' } });
  else lines[lines.length - 1] = { ...lines[lines.length - 1], stance: true };
  resetShaolin(player2);
  ch6CutsceneBase('shaolinIntro', lines, 'shaolinArrive', {
    gamblerX: -120,
    gamblerTargetX: 220,
    scammerX: 700,
    scammerTargetX: 700,
    scammerY: 30,
    meditating: true,
    gongFx: 0,
    stanceFx: 0,
    petals: [],
  });
  playSound('gong');
  cutsceneGong(arcadeCutscene);
}

function cutsceneGong(cutscene) {
  cutscene.gongFx = 60;
  for (let petal = 0; petal < 30; petal += 1) {
    cutscene.petals.push({ x: 860 + Math.random() * 100, y: ground - 220 + Math.random() * 60, vx: -1 - Math.random() * 3, vy: Math.random() * 1.5, life: 140 + Math.random() * 60, spin: Math.random() * 6 });
  }
}

function updateShaolinIntro(cutscene) {
  cutscene.petals.forEach((petal) => {
    petal.x += petal.vx;
    petal.y += petal.vy + Math.sin(petal.life / 10) * 0.4;
    petal.spin += 0.1;
    petal.life -= 1;
  });
  cutscene.petals = cutscene.petals.filter((petal) => petal.life > 0);
  if (cutscene.gongFx > 0) cutscene.gongFx -= 1;
  if (cutscene.stanceFx > 0) cutscene.stanceFx -= 1;
  // floating while he meditates
  if (cutscene.meditating) cutscene.scammerY = 30 + Math.sin(cutscene.frame / 20) * 5;
  else cutscene.scammerY = Math.max(0, cutscene.scammerY - 3);
  if (cutscene.phase === 'shaolinArrive') {
    // the visitor walks into the courtyard
    cutscene.gamblerX = Math.min(cutscene.gamblerTargetX, cutscene.gamblerX + 3.2);
    if (cutscene.gamblerX >= cutscene.gamblerTargetX && cutscene.frame > 70) {
      cutscene.phase = 'dialog';
      cutscene.frame = 0;
      startCutsceneLine(0);
    }
    return;
  }
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  if (line && line.stand && cutscene.meditating) {
    cutscene.meditating = false;
    playSound('cutsceneStep');
  }
  if (line && line.stance && !cutscene.stanceDone) {
    cutscene.stanceDone = true;
    cutscene.stanceFx = 70;
    playSound('gong');
    cutsceneGong(cutscene);
  }
}

function drawShaolinIntroFx(cutscene) {
  const time = performance.now() / 1000;
  const masterX = cutscene.scammerX + player2.width / 2;
  const masterY = ground - player2.height / 2 - cutscene.scammerY;
  ctx.save();
  if (cutscene.meditating) {
    // rings of chi rising around him, and a little cushion
    for (let ring = 0; ring < 3; ring += 1) {
      const rise = (time * 30 + ring * 30) % 90;
      ctx.strokeStyle = `rgba(255, 202, 40, ${0.6 * (1 - rise / 90)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(masterX, ground - 10 - rise, 40 + rise / 3, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#7f0000';
    ctx.beginPath();
    ctx.ellipse(masterX, ground - 6, 44, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (cutscene.gongFx > 0) {
    const grow = 1 - cutscene.gongFx / 60;
    ctx.strokeStyle = `rgba(255, 213, 79, ${cutscene.gongFx / 60})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(masterX, masterY, 40 + grow * 500, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (cutscene.stanceFx > 0 || (cutscene.stanceDone && cutscene.phase !== 'versus')) {
    // his chi flares up: a golden aura and a big 武 behind him
    const flare = cutscene.stanceFx / 70;
    const aura = ctx.createRadialGradient(masterX, masterY, 8, masterX, masterY, 90 + flare * 60);
    aura.addColorStop(0, `rgba(255, 213, 79, ${0.35 + flare * 0.3})`);
    aura.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(masterX - 160, masterY - 160, 320, 320);
    ctx.globalAlpha = 0.25 + flare * 0.5;
    ctx.fillStyle = '#ffca28';
    ctx.font = `900 ${Math.round(110 + flare * 40)}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('武', masterX, masterY + 40);
    ctx.globalAlpha = 1;
  }
  cutscene.petals.forEach((petal) => {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.spin);
    ctx.fillStyle = `rgba(248, 187, 208, ${Math.min(1, petal.life / 40)})`;
    ctx.fillRect(-4, -2, 8, 4);
    ctx.restore();
  });
  ctx.restore();
}

function getShaolinHeroSpeaker() {
  const type = player1.characterType;
  if (isScammer(player1)) return 'scammer';
  if (isShadowJester(player1)) return 'jester';
  return ['gambler', 'reflecter', 'chrono', 'tank', 'normal', 'fireMaster', 'cowboy', 'switcher', 'sorcerer', 'ghost', 'monkey'].includes(type) ? type : 'normal';
}

function rewardShaolinChallenge() {
  unlockAchievement('shaolinDefeated');
  awardCoins(shaolinChallengeReward);
  // beaten by Scammer: the master joins you (Scammer sold him a course of something)
  if (isScammer(player1) && !isShaolinUnlocked()) {
    try {
      localStorage.setItem(shaolinUnlockStorageKey, '1');
    } catch (error) {
      // only this session
    }
    setTimeout(() => {
      showCustomToast('SHANG TING DESBLOQUEADO', 'Scammer le vendio un "curso de kung fu por correspondencia" y ahora lo sigue a todos lados. Q palma de chi, F patada de la grulla, R montaña de hierro... y Q+F juntas: cien puños.');
      playSound('achievement');
    }, 900);
    return;
  }
  setTimeout(() => showCustomToast('谢谢指教 (GRACIAS POR LA LECCION)', `Venciste a Shang Ting en su templo. +${shaolinChallengeReward} monedas.`), 900);
}

// ---------- the colors of the VS screen ----------
// the rival of some scenes is not the one standing there (robots, the whole Orden, a duo...)
const versusSceneColors = {
  ch6Intro: '#546e7a',
  ch6Chrono: '#1565c0',
  ch6Giant: '#b71c1c',
  ch7Intro: '#ffb300',
  chronoIntro: '#1565c0',
  scamIntro: '#e91e63',
  scamNeo: '#ff4081',
  jester: '#4a148c',
  knightForestIntro: '#2e7d32',
  knightVillageIntro: '#311b92',
  knightPlazaIntro: '#4fc3f7',
  knightSetoIntro: '#7e57c2',
  knightKidsTeam: '#26a69a',
  knightSpaIntro: '#9e9e9e',
  knightMochiBarrage: '#e53935',
  knightChefFury: '#ff7043',
  knightJailIntro: '#c62828',
  knightGuardIntro: '#1a237e',
  knightApproach: '#fbc02d',
  knightFarolTop: '#fff176',
  knightRiftIntro: '#4a148c',
  shaolinIntro: '#b71c1c',
};
const versusVariantColors = {
  knight: '#1e3a8a',
  shadowJester: '#4a148c',
  scammer: '#e91e63',
  neoScammer: '#ff4081',
  shaolinMaster: '#b71c1c',
  lanternGuard: '#1a237e',
  chefBoss: '#ff7043',
  mochiMouse: '#9e9e9e',
  celesteGirl: '#4fc3f7',
  setoBoy: '#7e57c2',
  mossBeast: '#2e7d32',
  darkKnight: '#37474f',
  darkKnightBoss: '#311b92',
  chronoRival: '#0d47a1',
  arcadeBoss: '#c62828',
  iceMaster: '#4fc3f7',
  icedThug: '#80deea',
};
const versusTypeColors = {
  lightWarrior: '#fbc02d',
  gambler: '#43a047',
  reflecter: '#00acc1',
  chrono: '#1565c0',
  fireMaster: '#e65100',
  cowboy: '#8d6e63',
  tank: '#556b2f',
  sorcerer: '#7b1fa2',
  ghost: '#90a4ae',
  monkey: '#8d6e63',
  divineGeneral: '#b0bec5',
};

function getVersusColor(fighter) {
  if (!fighter) return '#7b1fa2';
  if (fighter.characterType === 'cowboy' && fighter.sheriffBadge) return '#c62828';
  if (fighter.secretVariant && versusVariantColors[fighter.secretVariant]) return versusVariantColors[fighter.secretVariant];
  if (versusTypeColors[fighter.characterType]) return versusTypeColors[fighter.characterType];
  return fighter.color || '#7b1fa2';
}

// a darker version of a #rrggbb color (for the far end of each bar)
function shadeVersusColor(color, amount) {
  const match = /^#([0-9a-f]{6})$/i.exec(color || '');
  if (!match) return '#111111';
  const value = parseInt(match[1], 16);
  const channel = (shift) => Math.round(((value >> shift) & 255) * (1 - amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

