// Moquete - Capitulo 5B: Un bosque sin luz (Ruta B)
// Level 1: the same Bosque Lumina... but darker, and the music drags. Light Warrior never comes:
// Knight has to knock the Bestia del Musgo out by himself. Then the road to Robledal, the bridge,
// and the Orden Sombria again, to a twisted remake of their theme. All the way, Knight feels cold.
// And hot. At the same time. He doesn't know why.

const knightBProgressKey = 'moqueteRouteB5Progress';
const knightBLevelCount = 8;
const knightBPlayableLevels = 8;
// (atBridge: the beast is already down; a retry starts again on the road, with the Order)
const knightBState = { breath: [], atBridge: false };

function isKnightBChapter() {
  return normalArcadeActive && arcadeChapter === 'knightB';
}

function isKnightBUnlocked() {
  return typeof isArcadeChapterDone === 'function' && isArcadeChapterDone('reflecterB');
}

// ---------- the chapter card (Ruta B) ----------
function syncKnightBCard() {
  const card = document.getElementById('knightArcadeBChapterButton');
  if (!card) return;
  const unlocked = isKnightBUnlocked();
  card.disabled = !unlocked;
  card.classList.toggle('routeB-locked', !unlocked);
  const title = card.querySelector('[data-routeb5-title]');
  const copy = card.querySelector('[data-routeb5-copy]');
  if (title) title.innerText = unlocked ? 'Un bosque sin luz' : '???';
  if (copy) copy.innerText = unlocked
    ? 'Capitulo 5B. El mismo bosque, el mismo juramento... pero esta vez nadie viene a ayudar. Y Knight tiene frio. Y calor.'
    : 'Termina el capitulo 4B.';
}

function syncKnightBChapterUI() {
  const titles = ['Nadie viene', 'Un pueblo vacio', 'Agua tibia', 'El puente', 'Nadie de guardia', 'El bunker', 'Un verdadero heroe', 'Sin perdon'];
  const descriptions = [
    'La Bestia del Musgo ataca otra vez. Esta vez la luz no llega: Knight tiene que terminar la pelea solo... y despues seguir el camino hacia Robledal.',
    'Knight llega a Robledal. No hay nadie: ni una voz, ni una vela. Solo el viento... y una nota clavada en el cartel.',
    'Las aguas termales todavia humean. Quizas alguien se escondio ahi.',
    'El viejo puente de piedra que lleva al Gran Farol. Abajo, la niebla del barranco. Arriba, ni una luz.',
    'Si alguien tenia que quedarse en el pueblo, era el sheriff.',
    'La prision de la colina es un bunker. Adentro esta todo el pueblo... y afuera, alguien que lo esta buscando.',
    'Fire Master sale del bunker a buscar a los que quedan. Alguien sale detras de el. Sin escudo. Con media espada.',
    'Fire Master despierta entre la ceniza. Un poco mas adelante, alguien lo espera con la capa al viento.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (index >= titles.length) return;
    if (title) title.innerText = titles[index];
    if (description) description.innerText = descriptions[index];
  });
  // eight levels, all normal ones
  const six = document.querySelector('[data-arcade-level="6"]');
  if (six) six.classList.remove('hidden');
  ['7', '8'].forEach((number) => {
    const button = document.querySelector(`[data-arcade-level="${number}"]`);
    if (!button) return;
    button.classList.remove('hidden');
    button.classList.remove('arcade-level-secret');
  });
  arcadeLevelsTitle.innerText = 'Capitulo 5B: Un bosque sin luz';
  arcadeStoryKicker.innerText = 'Ruta B';
  arcadeStoryParagraphOne.innerText =
    'Knight entra al Bosque Lumina, como aquella vez. Pero las luciernagas no brillan, el arroyo no canta... y la luz que lo salvo no va a llegar.';
  arcadeStoryParagraphTwo.innerText =
    'Algo frio y caliente a la vez se le mete en la armadura. No sabe de donde viene. Tampoco sabe que alguien, en otra montaña, sintio exactamente lo mismo.';
}

// ---------- the level ----------
function configureKnightBLevel() {
  player1.setCharacterType('normal', 'knight');
  if (selectedNormalArcadeLevel >= 2 && selectedNormalArcadeLevel <= 5) {
    configureKnightBRobledal();
    return;
  }
  if (selectedNormalArcadeLevel === 6) {
    configureKnightBBunker();
    return;
  }
  knightBSolo.active = false;
  document.body.classList.remove('knightb-solo');
  selectedMap = knightBState.atBridge ? 'villageRoad' : 'enchantedForest';
  botEnabled = true;
  // the beast, then the Orden Sombria on the bridge (four knights and their captain)
  normalArcadeEnemyIndex = knightBState.atBridge ? 2 : 1;
  normalArcadeEnemiesRemaining = knightArcadeLevels[2].enemies.length - (knightBState.atBridge ? 1 : 0);
  knightBState.breath = [];
  knightBEnding.shown = false;
  configureKnightBEnemy();
}

function configureKnightBEnemy() {
  if (selectedNormalArcadeLevel === 6) {
    configureKnightBGuard();
    return;
  }
  if (normalArcadeEnemyIndex <= 1) {
    player2.setCharacterType('normal', 'mossBeast');
    botDifficulty = 'medium';
    applyBotDifficulty();
    player2.health = player2.maxHealth;
    // (no light is coming: it can be knocked out for real)
    Object.assign(player2, { mossRootCooldown: 150, mossRoots: [], mossRescued: true });
  } else {
    const order = knightArcadeLevels[2];
    const index = Math.min(order.enemies.length - 1, normalArcadeEnemyIndex - 2);
    player2.setCharacterType('normal', order.enemies[index]);
    botDifficulty = order.difficulties[index] || 'medium';
    applyBotDifficulty();
    player2.health = player2.maxHealth;
    if (typeof resetKnightState === 'function') resetKnightState(player2);
    // (no deal on this bridge)
    player2.darkDealDone = true;
  }
  updateHealthBars();
  updateCombatHudIdentity();
}

// the same arrival in the forest... with the lights off
const knightBForestLines = [
  { speaker: 'knight', text: 'Asi que este es el Bosque Lumina... El rey me envio a investigar los rumores sobre este lugar.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'En el castillo decian que era aterrador. Que nadie que entraba volvia a ser el mismo.' },
  { speaker: 'knight', text: 'Las luciernagas no brillan. Las flores estan cerradas. El arroyo... no suena. ...Esto si es aterrador.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'mossBeast', text: 'GRRRROOOOOAAAAAAR!!!', monster: 'in', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'knight', text: 'Ahi esta. Sabia que tanta calma no podia durar.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Atras, bestia! Por Valdoria... EN GUARDIA!', glow: true },
];

function startKnightBForestIntro() {
  ch6CutsceneBase('knightForestIntro', knightBForestLines, 'forestArrive', {
    gamblerX: -120,
    gamblerTargetX: 260,
    scammerX: canvas.width + 200,
    scammerTargetX: canvas.width + 200,
    scammerY: 0,
    bushShake: 0,
  });
}

// nobody came: the road to Robledal, the bridge... and them again
const knightBVillageLines = [
  { speaker: 'origNarrator', text: 'Nadie llego a ayudar. Knight dejo a la Bestia del Musgo tendida entre las raices... y siguio camino a Robledal.' },
  { speaker: 'knight', text: 'Por fin, fuera del bosque... Y eso de alla es Robledal.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: '(...Que raro. Tengo frio. Y calor. Las dos cosas a la vez.)', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'knight', text: 'Debe ser el cansancio. Ahi voy a encontrar provisiones... y quizas alguna noticia que llevarle al rey.' },
  { speaker: 'darkKnight', text: 'Alto ahi, caballerito de Valdoria.', dark: 'in', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Caballeros... oscuros?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'darkKnight', text: 'Nadie llega al pueblo sin pagar el peaje de la Orden Sombria. Y tu peaje... es tu espada.' },
  { speaker: 'knight', text: '(Otra vez ese frio... No viene del viento. Viene de adentro de la armadura. Y quema.)', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Un caballero de verdad jamas entrega su espada. Vengan de a uno... o todos juntos!', glow: true },
  { speaker: 'darkKnightBoss', text: 'Que arrogante. ...Y que palido estas, caballero. Muchachos... acaben con el.' },
];

function startKnightBVillageIntro() {
  ch6CutsceneBase('knightVillageIntro', knightBVillageLines, 'villageArrive', {
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

// ---------- the darker atmosphere ----------
function drawKnightBGloom(heavy) {
  const time = performance.now() / 1000;
  ctx.save();
  // cold, dim light
  ctx.fillStyle = heavy ? 'rgba(6, 10, 22, 0.5)' : 'rgba(10, 8, 20, 0.38)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'saturation';
  ctx.fillStyle = 'rgba(128, 128, 128, 0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
  // low mist that drifts along the ground
  for (let bank = 0; bank < 5; bank += 1) {
    const x = ((bank * 260 + time * (12 + bank * 4)) % (canvas.width + 400)) - 200;
    const mist = ctx.createRadialGradient(x, canvas.height - 90, 10, x, canvas.height - 90, 220);
    mist.addColorStop(0, 'rgba(160, 170, 180, 0.16)');
    mist.addColorStop(1, 'rgba(160, 170, 180, 0)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // the edges close in
  const dark = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
  dark.addColorStop(0, 'rgba(0, 0, 0, 0)');
  dark.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// Knight's breath: frost... and now and then, a wisp of heat
function drawKnightBDiscomfort() {
  const knight = player1;
  if (!knight || knight.secretVariant !== 'knight') return;
  const list = knightBState.breath;
  if (Math.random() < 0.05) {
    const hot = Math.random() < 0.35;
    list.push({
      x: knight.position.x + knight.width / 2 + (knight.attacksToTheRight ? 18 : -18),
      y: knight.position.y + 26,
      vx: (knight.attacksToTheRight ? 0.6 : -0.6) + (Math.random() - 0.5) * 0.4,
      life: 40,
      hot,
    });
  }
  list.forEach((puff) => {
    puff.x += puff.vx;
    puff.y -= 0.35;
    puff.life -= 1;
    ctx.fillStyle = puff.hot ? `rgba(255, 138, 64, ${puff.life / 110})` : `rgba(200, 235, 255, ${puff.life / 80})`;
    ctx.beginPath();
    ctx.arc(puff.x, puff.y, 3 + (40 - puff.life) / 8, 0, Math.PI * 2);
    ctx.fill();
  });
  knightBState.breath = list.filter((puff) => puff.life > 0);
}

// ---------- the music: the beast's theme dragging, and a remake of the Order's theme ----------
// (the remake can't go through Web Audio: opened as a local file the browser would silence the track.
// So it is built from plain audio: the theme slower and lower, a second copy a moment behind as a
// dark echo, and a low synthesized hum under both)
reflecterBattleTrackSources.bushMonsterSlow = 'assetsaudio/bush-monster.wav';
reflecterBattleTrackRates.bushMonsterSlow = 0.84;
reflecterBattleTrackSources.darkOrderRemake = 'assetsaudio/dark-order.wav';
reflecterBattleTrackRates.darkOrderRemake = 0.88;
reflecterBattleTrackVolumes.darkOrderRemake = 0.6;
const knightBRemake = { echo: null, drone: null, droneGain: null, droneFilter: null };
const knightBEchoDelay = 0.32;

// (each one: how far behind its echo goes, and how loud)
const knightBDarkTracks = {
  darkOrderRemake: { delay: 0.32, volume: 0.38 },
  berdlyTense: { delay: 0.45, volume: 0.34 },
};
const knightBEchoes = {};

function getKnightBEcho(key) {
  if (knightBEchoes[key] || typeof Audio === 'undefined') return knightBEchoes[key];
  const echo = new Audio(reflecterBattleTrackSources[key]);
  echo.loop = true;
  echo.preload = 'auto';
  echo.preservesPitch = false;
  echo.mozPreservesPitch = false;
  echo.webkitPreservesPitch = false;
  // (at the same slowed speed: it sounds like a shadow of the track)
  echo.playbackRate = reflecterBattleTrackRates[key] || 1;
  knightBEchoes[key] = echo;
  return echo;
}

function startKnightBDrone() {
  if (knightBRemake.drone) return;
  const audio = ensureAudio();
  if (!audio) return;
  const drone = audio.createOscillator();
  drone.type = 'sawtooth';
  drone.frequency.value = 41.2;
  const second = audio.createOscillator();
  second.type = 'sine';
  second.frequency.value = 61.7;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 170;
  const gain = audio.createGain();
  gain.gain.value = 0;
  drone.connect(filter);
  second.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain || audio.destination);
  drone.start();
  second.start();
  Object.assign(knightBRemake, { drone, droneGain: gain, droneFilter: filter });
}

// every frame: the echo follows the main track, the hum breathes under it
function syncKnightBRemake() {
  const current = reflecterBattleMusic.current;
  const main = current && knightBDarkTracks[current] ? reflecterBattleMusic.tracks[current] : null;
  const playing = Boolean(main && !main.paused && isKnightBChapter());
  Object.entries(knightBEchoes).forEach(([key, echo]) => {
    if (!(playing && key === current) && !echo.paused) echo.pause();
  });
  if (playing) {
    const settings = knightBDarkTracks[current];
    const echo = getKnightBEcho(current);
    if (echo) {
      echo.volume = Math.max(0, Math.min(1, main.volume * settings.volume));
      const want = Math.max(0, main.currentTime - settings.delay);
      if (Math.abs(echo.currentTime - want) > 0.2 && main.readyState > 0) {
        try {
          echo.currentTime = want;
        } catch (error) {
          // (next frame)
        }
      }
      if (echo.paused) {
        const promise = echo.play();
        if (promise && promise.catch) promise.catch(() => {});
      }
    }
    startKnightBDrone();
  }
  if (knightBRemake.droneGain) {
    const context = knightBRemake.droneGain.context;
    const level = playing ? 0.18 * (typeof audioSettings !== 'undefined' ? audioSettings.music : 1) * (0.75 + Math.sin(context.currentTime * 0.9) * 0.25) : 0;
    knightBRemake.droneGain.gain.setTargetAtTime(level, context.currentTime, 0.4);
    knightBRemake.droneFilter.frequency.setTargetAtTime(140 + Math.sin(context.currentTime * 0.4) * 50, context.currentTime, 0.5);
  }
}

// ---------- the ending: back in the forest, the beast wakes up... and he comes ----------
const knightBEnding = { active: false, frame: 0, raf: null, beast: null, fire: null, sound: null, black: 0, soundEndsAt: 0, done: null, skip: null };

function drawKnightBEndingBubble(x, y, text) {
  ctx.save();
  ctx.font = "700 18px 'Courier New', monospace";
  const width = ctx.measureText(text).width + 24;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.rect(x - width / 2, y - 34, width, 30);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 4);
  ctx.lineTo(x, y + 6);
  ctx.lineTo(x + 6, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y - 13);
  ctx.restore();
}

function startKnightBEnding(done) {
  stopReflecterBattleMusic();
  syncKnightBRemake();
  const beast = new Fighter({ x: 0, y: 0, color: '#4caf50', attacksToTheRight: false });
  beast.setCharacterType('normal', 'mossBeast');
  beast.position = { x: 640, y: ground - beast.height };
  const fire = new Fighter({ x: 0, y: 0, color: '#b8450f', attacksToTheRight: true });
  if (typeof makeFrostFireMaster4B === 'function') makeFrostFireMaster4B(fire);
  else fire.setCharacterType('fireMaster');
  fire.position = { x: -140, y: ground - fire.height };
  // (half Obsidian, too)
  fire.obsidian = true;
  fire.obsidianControl = true;
  Object.assign(knightBEnding, { active: true, frame: 0, beast, fire, sound: null, black: 0, soundEndsAt: 0, done, after: 0, dust: [] });
  selectedMap = 'enchantedForest';
  knightBEnding.skip = (event) => {
    if (event.key === 'Escape') finishKnightBEnding();
  };
  window.addEventListener('keydown', knightBEnding.skip);
  // (no health bars in the ending)
  document.body.classList.add('knightb-ending');
  knightBEnding.raf = requestAnimationFrame(tickKnightBEnding);
}

// Fire Master, as he comes out of the dark: half his frozen fire, half Obsidian... and none of it right
function drawBizarreFireMaster(fighter, alpha) {
  const time = performance.now() / 1000;
  ctx.save();
  ctx.globalAlpha = alpha;
  // an afterimage that lags behind him
  ctx.save();
  ctx.globalAlpha = alpha * 0.25;
  ctx.translate(-14 - Math.sin(time * 3) * 4, 0);
  fighter.draw();
  ctx.restore();
  fighter.draw();
  ctx.restore();
  drawBizarreOverlay(fighter, alpha);
}

// what makes him wrong: half Obsidian, half ice, a seam, mismatched eyes, a crooked crown, drips, shards
function drawBizarreOverlay(fighter, alpha) {
  const time = performance.now() / 1000;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const cx = x + w / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  // now and then a slice of him slips sideways
  if (Math.random() < 0.08) {
    const sliceY = y + Math.random() * (h - 16);
    ctx.drawImage(canvas, x - 10, sliceY, w + 20, 12, x - 10 + (Math.random() - 0.5) * 18, sliceY, w + 20, 12);
  }
  // the left half: Obsidian's glossy black, with molten cracks
  ctx.fillStyle = 'rgba(8, 6, 10, 0.85)';
  ctx.fillRect(x, y + 8, w / 2, h - 14);
  ctx.strokeStyle = `rgba(255, 87, 34, ${0.6 + Math.sin(time * 7) * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 30); ctx.lineTo(x + 18, y + 48); ctx.lineTo(x + 10, y + 66); ctx.lineTo(x + 22, y + 88);
  ctx.moveTo(x + 18, y + 48); ctx.lineTo(x + 26, y + 56);
  ctx.stroke();
  // the right half: ice growing over the orange, too much of it
  ctx.fillStyle = 'rgba(178, 235, 242, 0.55)';
  for (let shard = 0; shard < 6; shard += 1) {
    const sx = cx + 4 + (shard % 3) * 8;
    const sy = y + 20 + shard * 15;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 10);
    ctx.lineTo(sx + 4, sy - 6 - (shard % 2) * 4);
    ctx.lineTo(sx + 8, sy + 10);
    ctx.closePath();
    ctx.fill();
  }
  // a seam down the middle, as if he had been stitched together
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let stitch = 0; stitch < 9; stitch += 1) {
    const sy = y + 10 + stitch * 12;
    ctx.moveTo(cx - 4, sy);
    ctx.lineTo(cx + 4, sy + 4);
  }
  ctx.stroke();
  // mismatched eyes: a molten slit, and an empty, frozen white one
  ctx.fillStyle = '#ff3d00';
  ctx.fillRect(x + 10, y + 16, 12, 3);
  ctx.save();
  ctx.shadowColor = '#e0f7fa';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.arc(x + w - 15, y + 17, 4 + Math.sin(time * 9) * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // a crooked crown: black spikes on one side, ice on the other
  [[-14, 12, '#0b0b0f'], [-6, 18, '#0b0b0f'], [3, 15, '#b2ebf2'], [11, 9, '#b2ebf2']].forEach(([dx, tall, color], index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx + dx - 4, y + 2);
    ctx.lineTo(cx + dx + Math.sin(time * 2 + index) * 1.5, y - tall);
    ctx.lineTo(cx + dx + 4, y + 2);
    ctx.closePath();
    ctx.fill();
  });
  // melting ice that drips into black tar
  for (let drip = 0; drip < 3; drip += 1) {
    const length = ((time * 18 + drip * 23) % 30);
    ctx.fillStyle = drip % 2 ? 'rgba(178, 235, 242, 0.8)' : 'rgba(10, 8, 12, 0.9)';
    ctx.fillRect(x + 10 + drip * 18, y + h - 10, 3, length * 0.6);
  }
  // shards of ice and black glass circling him
  for (let orbit = 0; orbit < 5; orbit += 1) {
    const angle = time * 1.3 + orbit * (Math.PI * 2 / 5);
    const ox = cx + Math.cos(angle) * (w * 0.9);
    const oy = y + h * 0.45 + Math.sin(angle) * 22;
    ctx.fillStyle = orbit % 2 ? '#0b0b0f' : '#b2ebf2';
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(angle * 2);
    ctx.fillRect(-3, -6, 6, 12);
    ctx.restore();
  }
  ctx.restore();
}

// after the fire: the burnt forest, a pile of dust where the beast was... and the wind
function drawKnightBBurntForest(e, f) {
  const time = performance.now() / 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEnchantedForestStage(0);
  ctx.save();
  // everything scorched: a brown-black char over the whole forest, the ground blackened
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(190, 140, 110, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // (the last embers still light the ground a little)
  const glow = ctx.createLinearGradient(0, ground - 140, 0, ground + 10);
  glow.addColorStop(0, 'rgba(255, 110, 40, 0)');
  glow.addColorStop(1, `rgba(255, 110, 40, ${0.22 + Math.sin(time * 2) * 0.04})`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, ground - 140, canvas.width, 150);
  const ground0 = ground - 10;
  const burnt = ctx.createLinearGradient(0, ground0 - 60, 0, canvas.height);
  burnt.addColorStop(0, 'rgba(15, 10, 8, 0)');
  burnt.addColorStop(0.3, 'rgba(25, 16, 12, 0.6)');
  burnt.addColorStop(1, 'rgba(12, 8, 6, 0.8)');
  ctx.fillStyle = burnt;
  ctx.fillRect(0, ground0 - 60, canvas.width, canvas.height);
  // burnt trunks, still glowing at the tips
  for (let trunk = 0; trunk < 9; trunk += 1) {
    const tx = 40 + trunk * 120 + (trunk % 2) * 30;
    const height = 120 + (trunk * 37) % 90;
    ctx.fillStyle = '#120c09';
    ctx.fillRect(tx, ground - height, 10, height);
    ctx.fillRect(tx - 12, ground - height * 0.7, 14, 4);
    ctx.fillStyle = `rgba(255, 109, 0, ${0.4 + Math.sin(time * 3 + trunk) * 0.3})`;
    ctx.fillRect(tx + 2, ground - height, 6, 3);
  }
  // where the beast stood: only a mound of dust, blown away little by little
  const pileX = e.beast.position.x + e.beast.width / 2;
  ctx.fillStyle = '#7d756b';
  ctx.beginPath();
  ctx.ellipse(pileX, ground - 4, 46, 14, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#958c80';
  ctx.beginPath();
  ctx.ellipse(pileX - 6, ground - 8, 26, 8, 0, Math.PI, 0);
  ctx.fill();
  if (!e.dust) e.dust = [];
  if (Math.random() < 0.6) e.dust.push({ x: pileX + (Math.random() - 0.5) * 50, y: ground - 10 - Math.random() * 10, vx: 0.8 + Math.random() * 1.6, vy: -0.2 - Math.random() * 0.4, life: 120 });
  e.dust.forEach((speck) => {
    speck.x += speck.vx;
    speck.y += speck.vy + Math.sin(speck.life / 10) * 0.2;
    speck.life -= 1;
    ctx.fillStyle = `rgba(170, 160, 150, ${speck.life / 160})`;
    ctx.fillRect(speck.x, speck.y, 2, 2);
  });
  e.dust = e.dust.filter((speck) => speck.life > 0);
  // ash falling, and thin smoke
  for (let ash = 0; ash < 30; ash += 1) {
    const ax = (ash * 97 + time * 40 + Math.sin(time + ash) * 20) % canvas.width;
    const ay = (ash * 53 + time * 30) % canvas.height;
    ctx.fillStyle = 'rgba(200, 195, 190, 0.5)';
    ctx.fillRect(ax, ay, 2, 2);
  }
  for (let wisp = 0; wisp < 4; wisp += 1) {
    const wx = 180 + wisp * 220;
    const rise = (time * 20 + wisp * 40) % 220;
    const smoke = ctx.createRadialGradient(wx + rise * 0.4, ground - 40 - rise, 4, wx + rise * 0.4, ground - 40 - rise, 50);
    smoke.addColorStop(0, `rgba(60, 55, 52, ${0.35 * (1 - rise / 220)})`);
    smoke.addColorStop(1, 'rgba(60, 55, 52, 0)');
    ctx.fillStyle = smoke;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // it comes out of the dark
  const fade = Math.max(0, 1 - f / 70);
  if (fade > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// only the wind (a soft noise that rises and falls)
const knightBWindState = { wind: null };
function startKnightBWind() {
  const audio = ensureAudio();
  if (!audio || knightBWindState.wind) return;
  const buffer = audio.createBuffer(1, audio.sampleRate * 3, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    last = (last + (Math.random() * 2 - 1) * 0.06) * 0.985;
    data[i] = last * 3;
  }
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 420;
  filter.Q.value = 0.7;
  const gain = audio.createGain();
  gain.gain.value = 0;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain || audio.destination);
  source.start();
  knightBWindState.wind = { source, filter, gain };
}

function updateKnightBWind() {
  const wind = knightBWindState.wind;
  if (!wind) return;
  const now = wind.gain.context.currentTime;
  const gust = 0.5 + Math.sin(now * 0.7) * 0.3 + Math.sin(now * 1.9) * 0.15;
  wind.gain.gain.setTargetAtTime(0.35 * gust, now, 0.3);
  wind.filter.frequency.setTargetAtTime(300 + gust * 400, now, 0.4);
}

function stopKnightBWind() {
  const wind = knightBWindState.wind;
  if (!wind) return;
  knightBWindState.wind = null;
  const now = wind.gain.context.currentTime;
  wind.gain.gain.setTargetAtTime(0, now, 0.4);
  setTimeout(() => {
    try {
      wind.source.stop();
    } catch (error) {
      // (already stopped)
    }
  }, 1500);
}

function tickKnightBEnding() {
  if (!knightBEnding.active) return;
  const e = knightBEnding;
  e.frame += 1;
  const f = e.frame;
  stopReflecterBattleMusic();
  // after the fire: the burnt forest and the wind, for a while... then the level ends
  if (e.after) {
    e.after += 1;
    drawKnightBBurntForest(e, e.after);
    updateKnightBWind();
    if (e.after > 420) {
      finishKnightBEnding();
      return;
    }
    e.raf = requestAnimationFrame(tickKnightBEnding);
    return;
  }
  // the forest, empty and dark
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEnchantedForestStage(0);
  // the beast: lying among the roots... it gets up slowly, shaking its head
  const rise = Math.max(0, Math.min(1, (f - 60) / 90));
  ctx.save();
  const pivotX = e.beast.position.x + e.beast.width / 2;
  ctx.translate(pivotX, ground);
  ctx.rotate((-Math.PI / 2) * (1 - rise) + (rise === 1 && f < 330 ? Math.sin(f / 9) * 0.05 : 0));
  ctx.translate(-pivotX, -ground);
  e.beast.attacksToTheRight = f > 330;
  e.beast.draw();
  ctx.restore();
  if (f > 160 && f < 300) drawKnightBEndingBubble(pivotX, e.beast.position.y - 10, f < 230 ? '...?' : 'Grr...?');
  // Fire Master comes in, slowly, from the dark
  if (f > 300) {
    e.fire.position.x = Math.min(e.fire.position.x + 2, 420);
    e.fire.attacksToTheRight = true;
    drawBizarreFireMaster(e.fire, Math.min(1, (f - 300) / 80));
    if (f % 30 === 0 && e.fire.position.x < 420) playSound('cutsceneStep');
  }
  if (f > 420 && f < 560) drawKnightBEndingBubble(pivotX, e.beast.position.y - 10, '!');
  if (f > 470 && f < 600) drawKnightBEndingBubble(e.fire.position.x + e.fire.width / 2, e.fire.position.y - 22, '...');
  // everything goes black... and the Flametomb, a little slowed down
  if (f > 620) e.black = Math.min(1, e.black + 0.02);
  if (e.black > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${e.black})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (e.black >= 1 && !e.sound) {
    if (typeof Audio !== 'undefined' && typeof flametombSoundSource !== 'undefined') {
      const sound = new Audio(flametombSoundSource);
      sound.preservesPitch = false;
      sound.mozPreservesPitch = false;
      sound.webkitPreservesPitch = false;
      sound.playbackRate = 0.82;
      sound.volume = Math.max(0, Math.min(1, 0.9 * audioSettings.master * audioSettings.sfx));
      const promise = sound.play();
      if (promise && promise.catch) promise.catch(() => {});
      e.sound = sound;
    } else {
      e.sound = { ended: true };
    }
    e.soundStartedAt = f;
  }
  // when the sound ends (or after ~14 s if it never says): the forest again, burnt
  if (e.sound && (e.sound.ended || f - e.soundStartedAt > 14 * 60)) {
    e.after = 1;
    startKnightBWind();
  }
  e.raf = requestAnimationFrame(tickKnightBEnding);
}

function finishKnightBEnding() {
  if (!knightBEnding.active) return;
  knightBEnding.active = false;
  knightBEnding.after = 0;
  knightBEnding.dust = [];
  cancelAnimationFrame(knightBEnding.raf);
  window.removeEventListener('keydown', knightBEnding.skip);
  document.body.classList.remove('knightb-ending');
  if (knightBEnding.sound && knightBEnding.sound.pause) knightBEnding.sound.pause();
  stopKnightBWind();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (knightBEnding.done) knightBEnding.done();
}


// ================= LEVEL 2: Robledal, empty =================
// Fifteen seconds alone in the square (you can walk around, jump, swing the sword at nothing)...
// then the note on the board. It is not the cheerful one this time.
const knightBSoloFrames = 15 * 60;
const knightBSolo = { active: false, frames: 0, reading: null };
const knightBNotePages = [
  'A todos los vecinos de Robledal:',
  'Esto no es una broma. Ni un juego. Celeste, Seto: esto va sobre todo para ustedes.',
  'Encierrense en sus casas. Cierren las puertas y las ventanas. Apaguen las velas. No salgan, pase lo que pase... escuchen lo que escuchen.',
  'Alguien viene. No se quien es. Se que camina despacio, que el pasto se congela donde pisa... y que despues se prende fuego.',
  'No es algo nuevo. Hace dias que lo sentimos. Primero fue el frio, de noche, aunque no corriera viento. Despues el calor, sin ningun fuego cerca. Y al final, los dos a la vez.',
  'Los pajaros dejaron de cantar antes de que nos dieramos cuenta. Las flores de la plaza se cerraron... y no volvieron a abrirse.',
  'No intenten pelear. No intenten hablarle. Si llegan a verlo, no lo miren a los ojos. Uno es de hielo. El otro... no quiero acordarme.',
  'Yo voy a intentar detenerlo antes de que llegue. Si no vuelvo, no me busquen. Quedense adentro.',
  'Y si alguien que no es de aca esta leyendo esto: no te quedes en el pueblo. Segui el camino, mas lejos, hasta la prision de la colina.',
  'Ahi hay paredes gruesas y puertas de hierro. Es el unico lugar donde todavia se puede estar a salvo.',
  'Perdon por no poder hacer mas.\n\n- L.W.',
];
const knightBNoteReaction = [
  '...',
  '(Hielo... y fuego. El frio y el calor que siento desde el bosque...)',
  '(Hace dias que lo sienten... Desde antes de que yo llegara.)',
  '(Todo un pueblo escondido, a oscuras... esperando que pase.)',
  '...¿Quien es? ¿Y por que siento que ya lo conozco?',
  'La prision de la colina. ...Mas lejos.',
];

// levels 3 to 5: walking through the rest of Robledal, looking for anyone
const knightBPlaces = {
  3: { map: 'hotSprings', name: 'las aguas termales' },
  4: { map: 'farolBridge', name: 'el puente al farol' },
  5: { map: 'robledalJail', name: 'la comisaria del sheriff' },
};
const knightBWalkTextAt = 5 * 60;
const knightBWalkEndAt = 13 * 60;

function configureKnightBRobledal() {
  const place = knightBPlaces[selectedNormalArcadeLevel];
  selectedMap = place ? place.map : 'villagePlaza';
  botEnabled = false;
  normalArcadeEnemyIndex = 1;
  normalArcadeEnemiesRemaining = 0;
  // nobody to fight: the second fighter stays out of sight, out of reach
  player2.setCharacterType('normal');
  player2.health = player2.maxHealth;
  player2.gamblerStunTimer = 999999;
  Object.assign(knightBSolo, { active: true, frames: 0, reading: null, kind: place ? 'walk' : 'note', place: place ? place.name : null, ending: 0 });
  knightBState.breath = [];
  document.body.classList.add('knightb-solo');
  updateHealthBars();
  updateCombatHudIdentity();
}

function startKnightBRobledal() {
  player2.position = { x: canvas.width + 600, y: ground - player2.height };
  startKnightBWind();
}

function drawKnightBPlaceText(text, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.font = "italic 24px Georgia, serif";
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  const lines = wrapNoteText(text, canvas.width - 200);
  lines.forEach((line, index) => {
    // (high in the sky, so it never covers Knight)
    const y = canvas.height * 0.32 + index * 32 - (lines.length - 1) * 16;
    ctx.strokeText(line, canvas.width / 2, y);
    ctx.fillStyle = '#eceff1';
    ctx.fillText(line, canvas.width / 2, y);
  });
  ctx.restore();
}

function updateKnightBWalk() {
  const f = knightBSolo.frames;
  // ("a el" becomes "al")
  const destination = knightBSolo.place.startsWith('el ') ? `al ${knightBSolo.place.slice(3)}` : `a ${knightBSolo.place}`;
  const sentence = `Knight llego ${destination} para ver si habia alguien... pero nadie vino.`;
  if (f < 200) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, f / 40, (200 - f) / 40);
    ctx.textAlign = 'center';
    ctx.font = "900 30px Georgia, serif";
    ctx.fillStyle = '#e0e0e0';
    const title = knightBSolo.place.charAt(0).toUpperCase() + knightBSolo.place.slice(1);
    ctx.fillText(title, canvas.width / 2, 150);
    ctx.restore();
  }
  // while he walks, the sentence writes itself over the place
  if (f >= knightBWalkTextAt) {
    const typed = Math.min(sentence.length, Math.floor((f - knightBWalkTextAt) / 2));
    drawKnightBPlaceText(sentence.slice(0, typed), 1);
  }
  if (f >= knightBWalkEndAt) finishKnightBWalk(sentence);
}

// the screen goes dark... the sentence stays a little longer, alone, and the level ends
function finishKnightBWalk(sentence) {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  knightBSolo.reading = { step: 'walkEnd' };
  let frame = 0;
  const tick = () => {
    frame += 1;
    updateKnightBWind();
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.08, 0.02 + frame / 3000)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (frame > 90) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawKnightBPlaceText(sentence, Math.min(1, (frame - 90) / 30) * Math.min(1, (330 - frame) / 40));
    }
    if (frame >= 330) {
      finishKnightBRobledal();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function updateKnightBSolo() {
  if (!knightBSolo.active || knightBSolo.reading) return;
  knightBSolo.frames += 1;
  player2.position.x = canvas.width + 600;
  player2.velocity.x = 0;
  updateKnightBWind();
  if (knightBSolo.kind === 'walk') {
    updateKnightBWalk();
    return;
  }
  const f = knightBSolo.frames;
  // a quiet title at the start
  if (f < 260) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, f / 40, (260 - f) / 40);
    ctx.textAlign = 'center';
    ctx.font = "900 34px Georgia, serif";
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText('Robledal', canvas.width / 2, 150);
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillStyle = '#bdbdbd';
    ctx.fillText('No hay nadie.', canvas.width / 2, 178);
    ctx.restore();
  }
  // the note on the board flutters in the wind
  if (f > 420) {
    const pulse = 0.4 + Math.sin(f / 12) * 0.3;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 245, 157, ${pulse})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(397, ground - 120, 34, 32);
    ctx.restore();
  }
  if (f >= knightBSoloFrames) startKnightBNote();
}

function startKnightBNote() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  knightBSolo.reading = { frame: 0, step: 'walk', page: 0, typed: 0, reaction: 0, black: 0 };
  knightBSolo.advance = (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Escape') return;
    if (event.type === 'keydown') event.preventDefault();
    advanceKnightBNote(event.key === 'Escape');
  };
  window.addEventListener('keydown', knightBSolo.advance);
  canvas.addEventListener('pointerdown', knightBSolo.advance);
  document.body.classList.add('knightb-ending');
  requestAnimationFrame(tickKnightBNote);
}

function advanceKnightBNote(skipAll) {
  const r = knightBSolo.reading;
  if (!r) return;
  const pages = r.step === 'note' ? knightBNotePages : r.step === 'react' ? knightBNoteReaction : null;
  if (!pages) return;
  if (skipAll) {
    r.step = 'fade';
    return;
  }
  const current = r.step === 'note' ? pages[r.page] : pages[r.reaction];
  // first click: the whole page; second: the next one
  if (r.typed < current.length) {
    r.typed = current.length;
    return;
  }
  playSound('menuMove');
  r.typed = 0;
  if (r.step === 'note') {
    r.page += 1;
    if (r.page >= knightBNotePages.length) {
      r.step = 'react';
      r.frame = 0;
    }
  } else {
    r.reaction += 1;
    if (r.reaction >= knightBNoteReaction.length) r.step = 'fade';
  }
}

function wrapNoteText(text, maxWidth) {
  const lines = [];
  text.split('\n').forEach((paragraph) => {
    let line = '';
    paragraph.split(' ').forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    lines.push(line);
  });
  return lines;
}

function tickKnightBNote() {
  const r = knightBSolo.reading;
  if (!r) return;
  r.frame += 1;
  updateKnightBWind();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVillagePlazaStage();
  // Knight walks up to the board
  const boardX = 340;
  if (r.step === 'walk') {
    const before = player1.position.x;
    player1.position.x += Math.sign(boardX - player1.position.x) * Math.min(3, Math.abs(boardX - player1.position.x));
    player1.attacksToTheRight = boardX >= before;
    if (Math.abs(player1.position.x - boardX) < 1) {
      r.step = 'note';
      r.frame = 0;
      playSound('menuSelect');
    } else if (r.frame % 16 === 0) {
      playSound('cutsceneStep');
    }
  }
  player1.position.y = ground - player1.height;
  player1.velocity.x = 0;
  player1.isAttacking = false;
  // shaking, at the end
  ctx.save();
  if (r.step === 'react' && r.reaction >= 2) ctx.translate((Math.random() - 0.5) * 2, 0);
  player1.draw();
  ctx.restore();
  drawKnightBDiscomfort();
  // the note, up close: an old paper, written in a hurry
  if (r.step === 'note') {
    const text = knightBNotePages[r.page];
    r.typed = Math.min(text.length, r.typed + 1);
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const paperX = canvas.width / 2 - 260;
    const paperY = 90;
    ctx.translate(canvas.width / 2, paperY + 170);
    ctx.rotate(-0.015);
    ctx.translate(-canvas.width / 2, -(paperY + 170));
    ctx.fillStyle = '#efe3c2';
    ctx.fillRect(paperX, paperY, 520, 340);
    ctx.fillStyle = 'rgba(120, 90, 40, 0.18)';
    ctx.fillRect(paperX + 10, paperY + 300, 120, 30);
    ctx.fillRect(paperX + 400, paperY + 14, 90, 22);
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.arc(paperX + 260, paperY + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3e2723';
    ctx.font = "italic 21px Georgia, serif";
    ctx.textAlign = 'left';
    const lines = wrapNoteText(text.slice(0, r.typed), 460);
    lines.forEach((line, index) => ctx.fillText(line, paperX + 30, paperY + 60 + index * 32));
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = 'rgba(62, 39, 35, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText(`${r.page + 1} / ${knightBNotePages.length}   ENTER / CLICK`, paperX + 500, paperY + 326);
    ctx.restore();
  }
  // what Knight thinks of it
  if (r.step === 'react') {
    const text = knightBNoteReaction[r.reaction];
    r.typed = Math.min(text.length, r.typed + 1);
    ctx.save();
    ctx.font = "700 17px 'Courier New', monospace";
    const shown = text.slice(0, r.typed);
    const lines = wrapNoteText(shown, 420);
    const boxW = 460;
    const boxH = 24 + lines.length * 22;
    const boxX = Math.max(20, Math.min(canvas.width - boxW - 20, player1.position.x + player1.width / 2 - boxW / 2));
    const boxY = player1.position.y - boxH - 30;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    lines.forEach((line, index) => ctx.fillText(line, boxX + 18, boxY + 28 + index * 22));
    ctx.font = "11px 'Courier New', monospace";
    ctx.fillStyle = '#757575';
    ctx.textAlign = 'right';
    ctx.fillText('ENTER / CLICK', boxX + boxW - 10, boxY + boxH - 6);
    ctx.restore();
    // a question mark... and then an exclamation, over his head
    ctx.save();
    ctx.font = "900 26px Impact, 'Arial Black', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = r.reaction >= 4 ? '#ff5252' : '#fdd835';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    const mark = r.reaction >= 4 ? '?!' : r.reaction >= 2 ? '!' : '?';
    ctx.strokeText(mark, player1.position.x + player1.width + 14, player1.position.y - 2);
    ctx.fillText(mark, player1.position.x + player1.width + 14, player1.position.y - 2);
    ctx.restore();
  }
  // the end of the level: everything fades... only the wind is left
  if (r.step === 'fade') {
    r.black = Math.min(1, r.black + 0.012);
    ctx.fillStyle = `rgba(0, 0, 0, ${r.black})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (r.black >= 1) {
      finishKnightBRobledal();
      return;
    }
  }
  requestAnimationFrame(tickKnightBNote);
}

function finishKnightBRobledal() {
  if (knightBSolo.advance) {
    window.removeEventListener('keydown', knightBSolo.advance);
    canvas.removeEventListener('pointerdown', knightBSolo.advance);
    knightBSolo.advance = null;
  }
  document.body.classList.remove('knightb-ending');
  knightBSolo.reading = null;
  stopKnightBWind();
  // the level is "won": nobody to beat, just a note to read
  player2.health = 0;
  normalArcadeEnemiesRemaining = 0;
  finishFight();
  knightBSolo.active = false;
  document.body.classList.remove('knightb-solo');
}


// while Fire Master walks through Robledal (level 6): night, every light out
function drawKnightBTravelNight() {
  if (!(isKnightBChapter() && selectedNormalArcadeLevel === 6 && knightB6.phase !== 'fight')) return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(48, 52, 96)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
  const time = performance.now() / 1000;
  for (let star = 0; star < 20; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + Math.sin(time * 1.5 + star) * 0.15})`;
    ctx.fillRect((star * 137 + 11) % canvas.width, (star * 31) % 130, 2, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// ---------- the empty corners of Robledal ----------
// a plank with "CERRADO" nailed across the cake stall of the hot springs
function drawKnightBClosedStall() {
  ctx.save();
  ctx.translate(904, 400);
  ctx.rotate(-0.12);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(-62, -12, 124, 24);
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.strokeRect(-62, -12, 124, 24);
  ctx.fillStyle = '#bdbdbd';
  ctx.fillRect(-56, -3, 4, 4);
  ctx.fillRect(52, -3, 4, 4);
  ctx.fillStyle = '#efebe9';
  ctx.font = "900 13px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('CERRADO', 0, 5);
  ctx.restore();
}

// every few seconds the alley goes black for an instant (and comes back, a little darker)
function drawKnightBBlackout() {
  const time = performance.now() / 1000;
  const phase = time % 7.3;
  const out = (phase > 6.9 && phase < 7.05) || (phase > 7.12 && phase < 7.2);
  if (out) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// the jail: the sunset turns into night (the sun becomes a pale moon)
function drawKnightBNightOver() {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const night = ctx.createLinearGradient(0, 0, 0, ground);
  night.addColorStop(0, 'rgba(25, 30, 80, 1)');
  night.addColorStop(1, 'rgba(60, 60, 110, 1)');
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, canvas.width, ground + 4);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = 'rgba(210, 215, 235, 0.35)';
  ctx.beginPath();
  ctx.arc(860, 150, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// the barred windows: nobody looking out anymore
function drawKnightBEmptyCells() {
  [[210, 230], [300, 230], [390, 230]].forEach(([windowX, windowY]) => {
    ctx.fillStyle = '#0b0b0e';
    ctx.fillRect(windowX, windowY, 60, 54);
    ctx.fillStyle = '#4b5a63';
    for (let bar = windowX + 6; bar < windowX + 60; bar += 12) ctx.fillRect(bar, windowY, 4, 54);
  });
}


// ================= LEVEL 6: the bunker =================
// First Knight reaches the "prison" on the hill: a bunker, with the whole village hiding inside.
// Then the camera goes to someone else: Fire Master (playable) walks through the empty Robledal,
// one place after another, until he finds the bunker... and its guards. He is stranger than ever,
// and so is his fire.
const knightB6Screens = ['villagePlaza', 'hotSprings', 'farolBridge', 'robledalJail', 'robledalBunkerOut'];
const knightB6GuardCount = 5;
const knightB6GuardHealth = 130;
const knightB6 = { phase: 'travel', screen: 0, fade: 0, entering: 0 };
reflecterBattleTrackSources.berdlyTense = encodeURI('assetsaudio/Deltarune [OST] - Berdly Battle Really Tense Heartbeat.mp3');
reflecterBattleTrackVolumes.berdlyTense = 0.6;
// (slower and lower: the heartbeat drags)
reflecterBattleTrackRates.berdlyTense = 0.84;

function makeBizarreFireMaster(fighter) {
  if (typeof makeFrostFireMaster4B === 'function') makeFrostFireMaster4B(fighter);
  else fighter.setCharacterType('fireMaster');
  fighter.knightBBizarre = true;
  fighter.setMaxHealth(150);
  fighter.health = fighter.maxHealth;
}

function configureKnightBBunker() {
  makeBizarreFireMaster(player1);
  botEnabled = true;
  if (knightB6.phase === 'fight') {
    // (a retry starts again at the door of the bunker, with the guards)
    selectedMap = 'robledalBunkerHall';
    knightBSolo.active = false;
    document.body.classList.remove('knightb-solo');
    normalArcadeEnemyIndex = 1;
    normalArcadeEnemiesRemaining = knightB6GuardCount - 1;
    configureKnightBGuard();
    return;
  }
  selectedMap = knightB6Screens[knightB6.screen] || knightB6Screens[0];
  normalArcadeEnemyIndex = 1;
  normalArcadeEnemiesRemaining = 0;
  player2.setCharacterType('normal');
  player2.health = player2.maxHealth;
  player2.gamblerStunTimer = 999999;
  Object.assign(knightBSolo, { active: true, frames: 0, reading: null, kind: 'travel', place: null, ending: 0 });
  document.body.classList.add('knightb-solo');
  updateHealthBars();
  updateCombatHudIdentity();
}

function configureKnightBGuard() {
  player2.setCharacterType('normal', 'lanternGuard');
  // the first ones are a little weaker; the last one is their chief
  const index = normalArcadeEnemyIndex;
  const chief = index >= knightB6GuardCount;
  botDifficulty = index <= 2 ? 'medium' : 'hard';
  applyBotDifficulty();
  if (typeof resetLanternGuard === 'function') resetLanternGuard(player2);
  player2.setMaxHealth(chief ? 190 : index <= 2 ? 105 : knightB6GuardHealth);
  player2.knightBBunkerGuard = true;
  player2.health = player2.maxHealth;
  player2.knightBGuardLook = chief ? 'chief' : ['olive', 'grey', 'olive', 'grey'][(index - 1) % 4];
  player2.gamblerStunTimer = 0;
  updateHealthBars();
  updateCombatHudIdentity();
}

// ---------- the bunker, outside and inside ----------
function drawKnightBBunkerOutside() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#05070f');
  sky.addColorStop(1, '#1b2030');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 26; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + Math.sin(time + star) * 0.15})`;
    ctx.fillRect((star * 151 + 31) % width, (star * 43) % 180, 2, 2);
  }
  // the hill the bunker is dug into
  ctx.fillStyle = '#1c2419';
  ctx.beginPath();
  ctx.moveTo(0, ground);
  ctx.quadraticCurveTo(260, ground - 160, 520, ground - 290);
  ctx.lineTo(width, ground - 320);
  ctx.lineTo(width, ground);
  ctx.closePath();
  ctx.fill();
  // the spotlight of the tower, sweeping the sky
  const sweep = Math.sin(time * 0.6) * 0.7 - 2.1;
  ctx.save();
  ctx.translate(880, ground - 360);
  ctx.rotate(sweep);
  const beam = ctx.createLinearGradient(0, 0, 420, 0);
  beam.addColorStop(0, 'rgba(255, 244, 200, 0.35)');
  beam.addColorStop(1, 'rgba(255, 244, 200, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(420, -60);
  ctx.lineTo(420, 60);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // the watchtower on top, with its antenna
  ctx.fillStyle = '#4a4e52';
  ctx.fillRect(840, ground - 360, 80, 90);
  ctx.fillStyle = '#2f3336';
  ctx.fillRect(852, ground - 344, 56, 16);
  ctx.fillStyle = `rgba(255, 236, 160, ${0.6 + Math.sin(time * 3) * 0.2})`;
  ctx.fillRect(868, ground - 368, 24, 10);
  ctx.strokeStyle = '#6b6f73';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(910, ground - 360);
  ctx.lineTo(910, ground - 430);
  ctx.stroke();
  ctx.fillStyle = Math.floor(time * 2) % 2 ? '#ff1744' : '#4a0010';
  ctx.fillRect(906, ground - 436, 8, 8);
  // the bunker itself: a huge block of concrete, roof slab, vents
  ctx.fillStyle = '#5b5f63';
  ctx.fillRect(520, ground - 270, width - 520, 270);
  ctx.fillStyle = '#44484c';
  ctx.fillRect(500, ground - 290, width - 500, 26);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 2;
  for (let seam = 0; seam < 8; seam += 1) {
    ctx.beginPath();
    ctx.moveTo(520, ground - 240 + seam * 32);
    ctx.lineTo(width, ground - 240 + seam * 32);
    ctx.stroke();
  }
  for (let column = 0; column < 6; column += 1) {
    ctx.beginPath();
    ctx.moveTo(560 + column * 90, ground - 264);
    ctx.lineTo(560 + column * 90, ground);
    ctx.stroke();
  }
  // ventilation grilles
  [[860, ground - 210], [950, ground - 210], [860, ground - 130], [950, ground - 130]].forEach(([gx, gy]) => {
    ctx.fillStyle = '#2a2e32';
    ctx.fillRect(gx, gy, 60, 40);
    ctx.fillStyle = '#4a4e52';
    for (let slat = 0; slat < 5; slat += 1) ctx.fillRect(gx + 4, gy + 4 + slat * 7, 52, 3);
  });
  // the great steel door, with stripes and a wheel
  for (let stripe = 0; stripe < 16; stripe += 1) {
    ctx.fillStyle = stripe % 2 ? '#111' : '#d4a017';
    ctx.fillRect(600 + stripe * 13, ground - 214, 13, 14);
  }
  ctx.fillStyle = '#3a3f44';
  ctx.fillRect(612, ground - 198, 184, 198);
  ctx.strokeStyle = '#25292d';
  ctx.lineWidth = 5;
  ctx.strokeRect(612, ground - 198, 184, 198);
  ctx.beginPath();
  ctx.moveTo(704, ground - 198);
  ctx.lineTo(704, ground);
  ctx.stroke();
  ctx.fillStyle = '#2a2e32';
  for (let rivet = 0; rivet < 8; rivet += 1) {
    ctx.fillRect(622, ground - 186 + rivet * 23, 5, 5);
    ctx.fillRect(781, ground - 186 + rivet * 23, 5, 5);
  }
  ctx.strokeStyle = '#8d8d8d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(704, ground - 100, 26, 0, Math.PI * 2);
  ctx.moveTo(678, ground - 100);
  ctx.lineTo(730, ground - 100);
  ctx.moveTo(704, ground - 126);
  ctx.lineTo(704, ground - 74);
  ctx.stroke();
  // two caged lamps beside the door, one failing
  [[588, 0.9], [820, Math.random() < 0.05 ? 0.15 : 0.85]].forEach(([lampX, on]) => {
    const glow = ctx.createRadialGradient(lampX, ground - 190, 2, lampX, ground - 190, 140);
    glow.addColorStop(0, `rgba(255, 214, 120, ${0.4 * on})`);
    glow.addColorStop(1, 'rgba(255, 214, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lampX - 140, ground - 330, 280, 330);
    ctx.fillStyle = `rgba(255, 224, 140, ${on})`;
    ctx.fillRect(lampX - 6, ground - 196, 12, 10);
  });
  ctx.fillStyle = '#e0e0e0';
  ctx.font = "900 16px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('REFUGIO  N.1', 704, ground - 230);
  // sandbags, a wire fence along the path
  ctx.fillStyle = '#6d6250';
  for (let bag = 0; bag < 8; bag += 1) {
    ctx.beginPath();
    ctx.ellipse(430 + bag * 26, ground - 10 - (bag % 2) * 14, 17, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
  ctx.lineWidth = 1;
  for (let post = 0; post < 5; post += 1) {
    ctx.beginPath();
    ctx.moveTo(30 + post * 90, ground);
    ctx.lineTo(30 + post * 90, ground - 60);
    ctx.stroke();
  }
  for (let wire = 0; wire < 3; wire += 1) {
    ctx.beginPath();
    ctx.moveTo(30, ground - 20 - wire * 18);
    ctx.lineTo(390, ground - 20 - wire * 18);
    ctx.stroke();
  }
  ctx.fillStyle = '#20231f';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#2b2f29';
  ctx.fillRect(0, ground, width, 3);
}

function drawKnightBRadio(x, y, rot, light) {
  ctx.save();
  ctx.translate(x + 22, y + 11);
  ctx.rotate(rot);
  ctx.fillStyle = '#263238';
  ctx.fillRect(-22, -11, 44, 22);
  ctx.fillStyle = light;
  ctx.fillRect(-16, -5, 4, 4);
  ctx.fillStyle = '#37474f';
  for (let slot = 0; slot < 4; slot += 1) ctx.fillRect(-4 + slot * 5, -6, 3, 12);
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(16, -11);
  ctx.lineTo(28, -33);
  ctx.stroke();
  ctx.restore();
}

function drawKnightBBunkerInside(opts = {}) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  // concrete walls with panel seams and old stains
  ctx.fillStyle = '#4b4f52';
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  for (let panel = 0; panel <= 8; panel += 1) {
    ctx.beginPath();
    ctx.moveTo(panel * 130, 40);
    ctx.lineTo(panel * 130, ground);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(30, 25, 20, 0.25)';
  [[90, 120, 40, 90], [620, 150, 30, 70], [900, 110, 26, 120]].forEach(([sx, sy, sw, sh]) => ctx.fillRect(sx, sy, sw, sh));
  // pipes along the ceiling
  ctx.fillStyle = '#2f3336';
  ctx.fillRect(0, 0, width, 40);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(0, 44, width, 10);
  ctx.fillStyle = '#546e7a';
  ctx.fillRect(0, 58, width, 6);
  for (let joint = 0; joint < 10; joint += 1) {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(40 + joint * 110, 42, 8, 14);
  }
  // bunk beds along the left wall, with blankets
  [[30, 160], [30, 250]].forEach(([bx, by]) => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(bx, by, 150, 10);
    ctx.fillStyle = '#7986cb';
    ctx.fillRect(bx + 4, by - 10, 140, 10);
    ctx.fillStyle = '#c5cae9';
    ctx.fillRect(bx + 6, by - 14, 30, 8);
  });
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(30, 150, 6, ground - 150);
  ctx.fillRect(174, 150, 6, ground - 150);
  // supply shelves: cans, water, boxes
  ctx.fillStyle = '#3e3e3e';
  ctx.fillRect(250, 120, 170, 8);
  ctx.fillRect(250, 180, 170, 8);
  ctx.fillRect(250, 120, 6, 130);
  ctx.fillRect(414, 120, 6, 130);
  for (let item = 0; item < 9; item += 1) {
    ctx.fillStyle = ['#b0bec5', '#ef9a9a', '#90caf9', '#ffe082'][item % 4];
    ctx.fillRect(262 + item * 17, 104, 12, 16);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(262 + item * 17, 164, 14, 16);
  }
  if (!opts.noTable) {
  // a table with a radio (a little green light) and a candle
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(470, 230, 120, 8);
  ctx.fillRect(478, 238, 6, ground - 238);
  ctx.fillRect(576, 238, 6, ground - 238);
  if (!opts.noRadio) drawKnightBRadio(490, 208, 0, Math.floor(time * 2) % 2 ? '#76ff03' : '#33691e');
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(560, 218, 6, 12);
  const flame = opts.candleOut ? 0 : 0.7 + Math.sin(time * 9) * 0.2;
  ctx.fillStyle = `rgba(255, 183, 77, ${flame})`;
  ctx.beginPath();
  ctx.ellipse(563, 213, 3, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  const candle = ctx.createRadialGradient(563, 213, 2, 563, 213, 80);
  candle.addColorStop(0, `rgba(255, 183, 77, ${0.25 * flame})`);
  candle.addColorStop(1, 'rgba(255, 183, 77, 0)');
  ctx.fillStyle = candle;
  ctx.fillRect(480, 130, 170, 170);
  }
  // the children's drawings taped to the wall (a sun, a house, a knight?)
  [[660, 130, '#fff59d'], [700, 150, '#ffffff'], [744, 128, '#ffccbc']].forEach(([dx, dy, paper], index) => {
    if (opts.noDrawings || (opts.hideKnightDrawing && index === 2)) return;
    ctx.fillStyle = paper;
    ctx.fillRect(dx, dy, 34, 26);
    ctx.strokeStyle = ['#ff9800', '#e53935', '#1e88e5'][index];
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (index === 0) ctx.arc(dx + 17, dy + 13, 7, 0, Math.PI * 2);
    else if (index === 1) {
      ctx.moveTo(dx + 6, dy + 22); ctx.lineTo(dx + 6, dy + 12); ctx.lineTo(dx + 17, dy + 4); ctx.lineTo(dx + 28, dy + 12); ctx.lineTo(dx + 28, dy + 22);
    } else {
      ctx.rect(dx + 12, dy + 6, 10, 16);
    }
    ctx.stroke();
  });
  // caged lamps, one of them failing
  [180, 512, 844].forEach((lampX, index) => {
    let on = index === 1 && Math.random() < 0.06 ? 0.15 : 1;
    if (opts.lampsOff && opts.lampsOff[index]) on = 0;
    const glow = ctx.createRadialGradient(lampX, 76, 2, lampX, 76, 180);
    glow.addColorStop(0, `rgba(255, 230, 160, ${0.32 * on})`);
    glow.addColorStop(1, 'rgba(255, 230, 160, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lampX - 180, 60, 360, 300);
    ctx.fillStyle = `rgba(255, 236, 179, ${on})`;
    ctx.fillRect(lampX - 8, 68, 16, 12);
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2;
    ctx.strokeRect(lampX - 10, 66, 20, 16);
  });
  if (!opts.noDoor) {
  // the heavy inner door and its red light
  ctx.fillStyle = '#3a3f44';
  ctx.fillRect(width - 160, ground - 170, 110, 170);
  ctx.strokeStyle = '#25292d';
  ctx.lineWidth = 4;
  ctx.strokeRect(width - 160, ground - 170, 110, 170);
  ctx.fillStyle = '#8d8d8d';
  ctx.beginPath();
  ctx.arc(width - 105, ground - 90, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255, 23, 68, ${0.4 + Math.sin(time * 4) * 0.4})`;
  ctx.fillRect(width - 112, ground - 196, 14, 10);
  }
  // the floor, with blankets laid out
  ctx.fillStyle = '#2d3033';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#3a3e42';
  ctx.fillRect(0, ground, width, 3);
  [[210, '#8d6e63'], [380, '#5c6bc0'], [640, '#a1887f']].forEach(([bx, color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(bx, ground - 4, 90, 6);
  });
}

// the entrance hall of the bunker: where the guards wait. Barricades, a checkpoint, a siren
function drawKnightBBunkerHall() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  // a long corridor in perspective: dark concrete, ribs of steel
  ctx.fillStyle = '#3a3d40';
  ctx.fillRect(0, 0, width, canvas.height);
  const far = ctx.createLinearGradient(0, 0, 0, ground);
  far.addColorStop(0, '#1c1e20');
  far.addColorStop(1, '#2c2f32');
  ctx.fillStyle = far;
  ctx.fillRect(300, 90, 424, ground - 90);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 3;
  [[0, 0, 300, 90], [width, 0, 724, 90], [0, ground, 300, ground], [width, ground, 724, ground]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  for (let rib = 0; rib < 5; rib += 1) {
    const k = rib / 5;
    const left = k * 300;
    const top = k * 90;
    ctx.strokeStyle = 'rgba(80, 86, 92, 0.8)';
    ctx.lineWidth = 6 - rib;
    ctx.strokeRect(left, top, width - left * 2, ground - top);
  }
  // the inner door at the end of the corridor, shut
  ctx.fillStyle = '#25292d';
  ctx.fillRect(452, 200, 120, ground - 200);
  ctx.fillStyle = '#8d8d8d';
  ctx.beginPath();
  ctx.arc(512, ground - 90, 16, 0, Math.PI * 2);
  ctx.fill();
  // the siren, turning: a red beam sweeping the walls
  const angle = time * 3;
  ctx.save();
  ctx.translate(512, 70);
  ctx.rotate(angle);
  const siren = ctx.createLinearGradient(0, 0, 500, 0);
  siren.addColorStop(0, 'rgba(255, 23, 68, 0.35)');
  siren.addColorStop(1, 'rgba(255, 23, 68, 0)');
  ctx.fillStyle = siren;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(500, -70);
  ctx.lineTo(500, 70);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#ff1744';
  ctx.fillRect(500, 60, 24, 14);
  // signs on the walls
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(60, 150, 150, 40);
  ctx.fillStyle = '#111';
  ctx.font = "900 14px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('ZONA RESTRINGIDA', 135, 175);
  ctx.fillStyle = '#b71c1c';
  ctx.fillRect(820, 150, 140, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SOLO PERSONAL', 890, 175);
  // a checkpoint: a striped barrier, a guard booth, sandbag barricades
  ctx.fillStyle = '#5b5f63';
  ctx.fillRect(140, ground - 150, 90, 150);
  ctx.fillStyle = 'rgba(160, 220, 255, 0.25)';
  ctx.fillRect(150, ground - 136, 70, 50);
  for (let stripe = 0; stripe < 10; stripe += 1) {
    ctx.fillStyle = stripe % 2 ? '#ffffff' : '#c62828';
    ctx.fillRect(230 + stripe * 18, ground - 70, 18, 10);
  }
  ctx.fillStyle = '#6d6250';
  for (let bag = 0; bag < 6; bag += 1) {
    ctx.beginPath();
    ctx.ellipse(700 + (bag % 3) * 40, ground - 10 - Math.floor(bag / 3) * 16, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // lockers on the right
  for (let locker = 0; locker < 3; locker += 1) {
    ctx.fillStyle = '#455a64';
    ctx.fillRect(860 + locker * 46, ground - 130, 42, 130);
    ctx.fillStyle = '#263238';
    ctx.fillRect(866 + locker * 46, ground - 118, 30, 3);
    ctx.fillRect(866 + locker * 46, ground - 110, 30, 3);
  }
  // the floor, with a painted line to the door
  ctx.fillStyle = '#26292c';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = 'rgba(212, 160, 23, 0.6)';
  ctx.fillRect(0, ground + 8, width, 3);
  // a failing light flickering over everything
  if (Math.random() < 0.05) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, canvas.height);
  }
}

// the rest of Robledal, in the refuge room: on the bunks, a back row against the wall, kids on the
// blankets... all of them trembling a little
const knightBVillagerLooks = [
  { cloth: '#7986cb', hair: '#3e2723', skin: '#f1c27d' }, { cloth: '#8d6e63', hair: '#212121', skin: '#e0ac69' },
  { cloth: '#c62828', hair: '#bdbdbd', skin: '#ffdbac' }, { cloth: '#43a047', hair: '#fdd835', skin: '#ffdbac' },
  { cloth: '#ad1457', hair: '#6d4c41', skin: '#8d5524' }, { cloth: '#00838f', hair: '#4e342e', skin: '#c68642' },
  { cloth: '#ef6c00', hair: '#212121', skin: '#e0ac69' }, { cloth: '#5d4037', hair: '#9e9e9e', skin: '#f1c27d' },
  { cloth: '#3949ab', hair: '#ff8f00', skin: '#ffdbac' }, { cloth: '#6a1b9a', hair: '#e0e0e0', skin: '#ffdbac' },
  { cloth: '#827717', hair: '#3e2723', skin: '#c68642' }, { cloth: '#455a64', hair: '#795548', skin: '#f1c27d' },
];
const knightBVillagerPlan = [
  { pose: 'lie', x: 40, y: 150 }, { pose: 'sit', x: 66, y: 240, kid: true }, { pose: 'sit', x: 128, y: 240, s: 0.9, old: true },
  { pose: 'stand', back: true, x: 238 }, { pose: 'stand', back: true, x: 372 }, { pose: 'stand', back: true, x: 430, baby: true },
  { pose: 'stand', back: true, x: 522 }, { pose: 'stand', back: true, x: 604, old: true }, { pose: 'stand', back: true, x: 742 },
  { pose: 'stand', back: true, x: 900, kid: true }, { pose: 'stand', x: 24 },
  { pose: 'floor', x: 242, kid: true }, { pose: 'floor', x: 270, kid: true }, { pose: 'floor', x: 404, kid: true }, { pose: 'floor', x: 762, kid: true },
];
const knightBVillagers = knightBVillagerPlan.map((plan, index) => ({ ...knightBVillagerLooks[index % knightBVillagerLooks.length], ...plan }));

function knightBBlock(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

// (about the height of the fighters; the kids, a little more than half)
function knightBVillagerScale(v) {
  return (v.s || (v.kid ? 0.78 : v.old ? 1.1 : 1.2)) * (v.back ? 0.92 : 1);
}

function knightBVillagerFeet(v) {
  return v.pose === 'sit' ? v.y : ground - (v.back ? 14 : 0);
}

function knightBShadeColor(color, k) {
  const match = /^#([0-9a-f]{6})$/i.exec(color || '');
  if (!match) return color;
  const value = parseInt(match[1], 16);
  const channel = (shift) => Math.round(((value >> shift) & 255) * k);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function drawKnightBVillager(v, index, time) {
  const s = knightBVillagerScale(v);
  const shake = Math.sin(time * 26 + index * 5) * (v.scared ? 1.4 : 0.6);
  const headW = 30 * s;
  const bodyW = 34 * s;
  const bodyH = 40 * s;
  const legH = 26 * s;
  const armW = 9 * s;
  ctx.save();
  // (the back row in the shadow: darker colors, no canvas filters, they are slow)
  let light = v.back && !v.lit ? 0.62 : 1;
  if (v.dim) light = 0.62 - v.dim * 0.3;
  const C = light < 1 ? (color) => knightBShadeColor(color, light) : (color) => color;
  if (v.pose === 'lie') {
    // asleep on the top bunk, under a blanket
    ctx.translate(v.x, v.y);
    knightBBlock(0, -16 * s, 26 * s, 16 * s, C(v.skin));
    knightBBlock(0, -18 * s, 26 * s, 6 * s, C(v.hair));
    knightBBlock(26 * s, -13 * s, 84 * s, 13 * s, C(v.cloth));
    if (!v.scared) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = "700 10px 'Courier New', monospace";
      ctx.fillText('z', 10 + Math.sin(time * 2) * 2, -26 - ((time * 8) % 10));
    }
    ctx.restore();
    return;
  }
  const feet = knightBVillagerFeet(v);
  const seated = v.pose === 'sit' || v.pose === 'floor';
  const x = v.x + shake;
  const hipY = seated ? feet : feet - legH;
  const run = v.running ? Math.sin(time * 20 + index) : 0;
  const top = hipY - bodyH - (v.running ? Math.abs(run) * 3 * s : 0);
  // legs: hanging from the bunk, crossed on the blanket, standing... or running
  if (v.pose === 'sit') {
    knightBBlock(x - bodyW / 2 + 1, hipY - 2, bodyW / 2 - 2, legH, C('#37474f'));
    knightBBlock(x + 1, hipY - 2, bodyW / 2 - 2, legH, C('#37474f'));
  } else if (v.pose === 'floor') {
    knightBBlock(x - bodyW / 2 - 4, hipY - 8 * s, bodyW + 8, 8 * s, C('#37474f'));
  } else {
    const left = legH * (1 - Math.max(0, run) * 0.35);
    const right = legH * (1 - Math.max(0, -run) * 0.35);
    knightBBlock(x - bodyW / 2 + 1 - run * 4, feet - left, bodyW / 2 - 2, left, C('#37474f'));
    knightBBlock(x + 1 + run * 4, feet - right, bodyW / 2 - 2, right, C('#37474f'));
    ctx.fillStyle = C('#212121');
    ctx.fillRect(x - bodyW / 2 - run * 4, feet - 4, bodyW / 2, 4);
    ctx.fillRect(x + 1 + run * 4, feet - 4, bodyW / 2, 4);
  }
  // body and arms (hugging themselves; up in the air when they run)
  knightBBlock(x - bodyW / 2, top, bodyW, bodyH, C(v.cloth));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(x + bodyW * 0.22, top, bodyW * 0.28, bodyH);
  if (v.running) {
    knightBBlock(x - bodyW / 2 - armW + 2, top - bodyH * 0.45 + run * 4, armW, bodyH * 0.6, C(v.cloth));
    knightBBlock(x + bodyW / 2 - 2, top - bodyH * 0.45 - run * 4, armW, bodyH * 0.6, C(v.cloth));
    knightBBlock(x - bodyW / 2 - armW + 2, top - bodyH * 0.45 - 6 * s + run * 4, armW, 6 * s, C(v.skin));
    knightBBlock(x + bodyW / 2 - 2, top - bodyH * 0.45 - 6 * s - run * 4, armW, 6 * s, C(v.skin));
  } else {
    knightBBlock(x - bodyW / 2 - armW + 2, top + 3, armW, bodyH * 0.7, C(v.cloth));
    knightBBlock(x + bodyW / 2 - 2, top + 3, armW, bodyH * 0.7, C(v.cloth));
    knightBBlock(x - bodyW / 2 + 2, top + bodyH * 0.45, bodyW - 4, 6 * s, C(v.skin));
  }
  if (v.baby && !v.running) {
    knightBBlock(x - 9 * s, top + 4 * s, 18 * s, 13 * s, C('#fff8e1'));
    knightBBlock(x - 4 * s, top, 9 * s, 8 * s, C(v.skin));
  }
  // head
  const headX = x - headW / 2;
  const headY = top - headW;
  knightBBlock(headX, headY, headW, headW, C(v.skin));
  ctx.fillStyle = C(v.hair);
  ctx.fillRect(headX, headY, headW, headW * 0.28);
  ctx.fillRect(headX, headY, headW * 0.18, headW * 0.6);
  if (v.old) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(headX + 2, headY + 1, headW - 4, 2);
  }
  if (v.scared) {
    // terror: wide white eyes with tiny pupils, brows up, the mouth open
    const eye = Math.max(4, headW * 0.2);
    [x - headW * 0.05, x + headW * 0.22].forEach((ex) => {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(ex - 1, headY + headW * 0.36, eye, eye);
      ctx.fillStyle = '#111';
      ctx.fillRect(ex + eye * 0.35, headY + headW * 0.36 + eye * 0.35, Math.max(1.5, eye * 0.3), Math.max(1.5, eye * 0.3));
      ctx.fillRect(ex - 1, headY + headW * 0.3 - (ex > x ? 0 : 2), eye, 1.5);
    });
    ctx.fillStyle = '#2b0a0a';
    ctx.fillRect(x + headW * 0.02, headY + headW * 0.68, headW * 0.28, headW * 0.22);
    ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
    ctx.fillRect(headX + headW - 3, headY + headW * 0.3 + ((time * 30 + index * 7) % (headW * 0.6)), 2.5, 4);
  } else {
    ctx.fillStyle = '#111';
    ctx.fillRect(x + headW * 0.08, headY + headW * 0.48, 3 * s + 1, 3 * s + 1);
    ctx.fillRect(x + headW * 0.3, headY + headW * 0.48, 3 * s + 1, 3 * s + 1);
    ctx.fillRect(x + headW * 0.1, headY + headW * 0.78, headW * 0.25, 1.5);
  }
  if (v.old && v.pose === 'stand' && !v.running) {
    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + bodyW / 2 + armW, top + bodyH * 0.6);
    ctx.lineTo(x + bodyW / 2 + armW + 2, feet);
    ctx.stroke();
  }
  ctx.restore();
}

function drawKnightBVillagers() {
  const time = performance.now() / 1000;
  // (the back row first)
  knightBVillagers.forEach((villager, index) => {
    if (villager.back) drawKnightBVillager(villager, index, time);
  });
  knightBVillagers.forEach((villager, index) => {
    if (!villager.back) drawKnightBVillager(villager, index, time);
  });
}

// ---------- the opening: Knight in the bunker, with the whole village ----------
const knightB6IntroLines = [
  { who: 'narrator', text: 'La prision de la colina... no era una prision. Era un bunker.' },
  { who: 'lanternGuard', text: 'Alto! ...Un caballero? Entra, rapido. Antes de que cierre la puerta.', step: 'enter' },
  { who: 'celesteGirl', text: 'UNA CARA NUEVA! ...Perdon. Hay que hablar bajito, dice el guardia.' },
  { who: 'setoBoy', text: 'Leiste la nota, no? Light Warrior la dejo antes de irse. Dijo que volvia enseguida.' },
  { who: 'sheriff', text: 'Hace dos dias de eso. Nunca vi a Robledal tan callado. Ni en los peores dias.' },
  { who: 'chefBoss', text: 'Aca abajo hay comida para una semana. Despues... no se. Nadie sabe.' },
  { who: 'mochiMouse', text: '*squeak...*' },
  { who: 'knight', text: 'Soy Knight, de Valdoria. Si algo viene, voy a proteger esta puerta. Tienen mi palabra.' },
  { who: 'lanternGuard', text: 'Descansa, caballero. Estas paredes aguantan cualquier cosa. Aca estamos a salvo.' },
  { who: 'knight', text: '(...El frio otra vez. Y el calor. Mas fuerte que nunca.)', shiver: true },
  { who: 'knight', text: '(Tengo un mal presentimiento.)', shiver: true },
  { who: 'narrator', text: 'Mientras tanto...', black: true },
];
const knightB6Names = { narrator: '', lanternGuard: 'GUARDIA', celesteGirl: 'CELESTE', setoBoy: 'SETO', sheriff: 'SHERIFF', chefBoss: 'CHEF', mochiMouse: 'MOCHI', knight: 'KNIGHT' };

function makeKnightB6Actor(variant, x, facingRight) {
  const actor = new Fighter({ x: 0, y: 0, color: '#c62828', attacksToTheRight: facingRight });
  if (variant === 'sheriff') {
    actor.setCharacterType('cowboy');
    actor.setColor('#c62828');
    actor.sheriffBadge = true;
  } else {
    actor.setCharacterType('normal', variant);
  }
  actor.position = { x, y: ground - actor.height };
  actor.attacksToTheRight = facingRight;
  return actor;
}

function startKnightB6Intro() {
  if (knightB6.phase === 'fight') return;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  resetKeys();
  const knight = new Fighter({ x: 0, y: 0, color: '#42a5f5', attacksToTheRight: true });
  knight.setCharacterType('normal', 'knight');
  knight.position = { x: -100, y: ground - knight.height };
  const actors = {
    knight,
    lanternGuard: makeKnightB6Actor('lanternGuard', 300, false),
    celesteGirl: makeKnightB6Actor('celesteGirl', 470, false),
    setoBoy: makeKnightB6Actor('setoBoy', 560, false),
    sheriff: makeKnightB6Actor('sheriff', 690, false),
    chefBoss: makeKnightB6Actor('chefBoss', 800, false),
    mochiMouse: makeKnightB6Actor('mochiMouse', 640, false),
  };
  const scene = { frame: 0, line: 0, typed: 0, outside: true, black: 0, actors, done: false };
  knightB6.scene = scene;
  scene.advance = (event) => {
    if (event.type === 'keydown' && !['Enter', ' ', 'Escape'].includes(event.key)) return;
    if (event.type === 'keydown') event.preventDefault();
    if (event.key === 'Escape') {
      scene.line = knightB6IntroLines.length;
      return;
    }
    const line = knightB6IntroLines[scene.line];
    if (!line) return;
    if (scene.typed < line.text.length) {
      scene.typed = line.text.length;
      return;
    }
    scene.line += 1;
    scene.typed = 0;
    playSound('menuMove');
  };
  window.addEventListener('keydown', scene.advance);
  canvas.addEventListener('pointerdown', scene.advance);
  document.body.classList.add('knightb-ending');
  startKnightBWind();
  requestAnimationFrame(tickKnightB6Intro);
}

function tickKnightB6Intro() {
  const scene = knightB6.scene;
  if (!scene || scene.done) return;
  scene.frame += 1;
  updateKnightBWind();
  const line = knightB6IntroLines[scene.line];
  // outside: Knight walks up the hill to the door; from the second line on, we are inside
  if (line && line.step === 'enter') scene.outside = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const knight = scene.actors.knight;
  if (scene.outside) {
    drawKnightBBunkerOutside();
    knight.position.x = Math.min(knight.position.x + 2.4, 640);
    if (scene.frame % 18 === 0 && knight.position.x < 640) playSound('cutsceneStep');
    knight.draw();
  } else {
    drawKnightBBunkerInside();
    drawKnightBVillagers();
    if (!scene.insideSet) {
      scene.insideSet = true;
      knight.position.x = 60;
    }
    knight.position.x = Math.min(knight.position.x + 2, 170);
    Object.entries(scene.actors).forEach(([key, actor]) => {
      if (key === 'knight') return;
      actor.isAttacking = false;
      if (key === 'chefBoss') {
        // (the calm chef: no steam, no frown... and no second Mochi watching from the side)
        actor.chefCalm = true;
        const round = dodgeRound.active;
        dodgeRound.active = true;
        actor.draw();
        dodgeRound.active = round;
        return;
      }
      actor.draw();
    });
    ctx.save();
    if (line && line.shiver) ctx.translate((Math.random() - 0.5) * 2, 0);
    knight.draw();
    ctx.restore();
  }
  drawKnightBGloom(false);
  if (line && line.shiver) {
    // his breath: frost and heat
    knightBState.breath = knightBState.breath || [];
  }
  // the dialog box
  if (line) {
    const speakerReady = !scene.outside || scene.frame > 120 || line.who === 'narrator';
    if (speakerReady) {
      scene.typed = Math.min(line.text.length, scene.typed + 1);
      drawKnightB6Dialog(line, scene.typed);
    }
    if (line.black) {
      scene.black = Math.min(1, scene.black + 0.03);
      ctx.fillStyle = `rgba(0, 0, 0, ${scene.black})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawKnightB6Dialog(line, scene.typed);
    }
  } else {
    finishKnightB6Intro();
    return;
  }
  requestAnimationFrame(tickKnightB6Intro);
}

function drawKnightB6Dialog(line, typed) {
  ctx.save();
  // (at the top: the village stands at the bottom of the room)
  const boxY = 24;
  ctx.fillStyle = 'rgba(8, 8, 12, 0.88)';
  ctx.fillRect(40, boxY, canvas.width - 80, 100);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, boxY, canvas.width - 80, 100);
  const name = knightB6Names[line.who] || '';
  if (name) {
    ctx.fillStyle = '#fdd835';
    ctx.font = "900 15px 'Courier New', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(name, 62, boxY + 26);
  }
  ctx.fillStyle = line.who === 'narrator' ? '#bdbdbd' : '#fafafa';
  ctx.font = line.who === 'narrator' ? "italic 20px Georgia, serif" : "700 18px 'Courier New', monospace";
  ctx.textAlign = 'left';
  wrapNoteText(line.text.slice(0, typed), canvas.width - 160).forEach((text, index) => ctx.fillText(text, 62, boxY + (name ? 52 : 44) + index * 24));
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#757575';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER / CLICK   ESC: saltar', canvas.width - 56, boxY + 92);
  ctx.restore();
}

function finishKnightB6Intro() {
  const scene = knightB6.scene;
  if (!scene) return;
  scene.done = true;
  window.removeEventListener('keydown', scene.advance);
  canvas.removeEventListener('pointerdown', scene.advance);
  document.body.classList.remove('knightb-ending');
  knightB6.scene = null;
  // the camera goes to him: Fire Master, in the empty square
  player1.position = { x: 40, y: ground - player1.height };
  player2.position = { x: canvas.width + 600, y: ground - player2.height };
  knightB6.fade = 60;
  gameStarted = true;
  gameOver = false;
  animate();
}

// Fire Master, alone in Robledal, and the voice that will not leave him
const knightB6Thoughts = [
  { me: '...No hay nadie.', voice: 'Estan escondidos. Los podes oler. Huelen a miedo.' },
  { me: 'Tampoco aca. Ni el agua se mueve.', voice: 'El agua tibia... hacela hervir. Con alguien adentro.' },
  { me: 'Nadie. Ni una luz en todo el puente.', voice: 'Quema el puente. Que nadie pueda volver por aca.' },
  { me: 'Ni siquiera el sheriff se quedo...', voice: 'Estan juntos. TODOS juntos. Imaginate el fuego.' },
  { me: '...Ahi.', voice: 'SI. AHI. ENTRA. QUEMALOS A TODOS.' },
];

function drawKnightB6Thoughts(f) {
  const thought = knightB6Thoughts[knightB6.screen];
  if (!thought) return;
  const start = knightB6.screen === 0 ? 260 : 70;
  const voiceStart = start + 190;
  // his own words, quiet, over his head
  if (f > start) {
    const typed = Math.min(thought.me.length, Math.floor((f - start) / 2));
    const fade = Math.min(1, (start + 420 - f) / 40);
    if (fade > 0) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = "italic 18px Georgia, serif";
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      const sx = Math.max(140, Math.min(canvas.width - 140, player1.position.x + player1.width / 2));
      const sy = player1.position.y - 30;
      ctx.strokeText(thought.me.slice(0, typed), sx, sy);
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(thought.me.slice(0, typed), sx, sy);
      ctx.restore();
    }
  }
  // the voice: big, shaking, red and black, in the middle of the screen
  if (f > voiceStart) {
    const typed = Math.min(thought.voice.length, Math.floor((f - voiceStart) / 2));
    const fade = Math.min(1, (voiceStart + 300 - f) / 40);
    if (fade > 0) {
      const text = thought.voice.slice(0, typed);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = "900 22px 'Courier New', monospace";
      ctx.textAlign = 'center';
      const vx = canvas.width / 2;
      const vy = 210;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillText(text, vx + 3 + (Math.random() - 0.5) * 3, vy + 3);
      ctx.fillStyle = `rgba(255, 23, 68, ${0.75 + Math.random() * 0.25})`;
      ctx.fillText(text, vx + (Math.random() - 0.5) * 3, vy + (Math.random() - 0.5) * 2);
      if (Math.random() < 0.2) {
        ctx.fillStyle = 'rgba(178, 235, 242, 0.7)';
        ctx.fillText(text, vx + (Math.random() - 0.5) * 12, vy);
      }
      ctx.restore();
      if (typed > 0 && typed < thought.voice.length && f % 6 === 0) playTone({ frequency: 70 + Math.random() * 30, duration: 0.06, type: 'sawtooth', volume: 0.02 });
    }
  }
}

// ---------- the walk through Robledal (playable) ----------
function updateKnightB6Travel() {
  const f = knightBSolo.frames;
  updateKnightBWind();
  // the screen opens from black after each change
  if (knightB6.fade > 0) {
    knightB6.fade -= 1;
    ctx.fillStyle = `rgba(0, 0, 0, ${knightB6.fade / 60})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const last = knightB6.screen >= knightB6Screens.length - 1;
  drawKnightB6Thoughts(f);
  // a faint arrow: keep going
  if (!last && f > 120) {
    ctx.save();
    ctx.globalAlpha = 0.35 + Math.sin(f / 15) * 0.25;
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, ground - 70);
    ctx.lineTo(canvas.width - 64, ground - 86);
    ctx.lineTo(canvas.width - 64, ground - 54);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  if (knightB6.screen === 0 && f < 240) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, f / 40, (240 - f) / 40);
    ctx.textAlign = 'center';
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText('Algo camina por Robledal.', canvas.width / 2, 160);
    ctx.restore();
  }
  // reaching the right edge: the next part of the village
  if (!last && player1.position.x + player1.width >= canvas.width - 4) {
    knightB6.screen += 1;
    selectedMap = knightB6Screens[knightB6.screen];
    player1.position.x = 20;
    knightB6.fade = 40;
    knightBSolo.frames = 0;
    playNoise({ duration: 0.4, volume: 0.03, filterFrequency: 600 });
  }
  // at the bunker: the door
  if (last && player1.position.x > 610 && !knightB6.entering) {
    knightB6.entering = 1;
    playSound('robotHit');
  }
  if (knightB6.entering) {
    knightB6.entering += 1;
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, knightB6.entering / 50)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (knightB6.entering >= 60) startKnightB6Fight();
  }
}

function startKnightB6Fight() {
  knightBRifts = [];
  knightBPendingBeams = [];
  knightB6.entering = 0;
  knightB6.phase = 'fight';
  stopKnightBWind();
  knightBSolo.active = false;
  document.body.classList.remove('knightb-solo');
  selectedMap = 'robledalBunkerHall';
  botEnabled = true;
  normalArcadeEnemyIndex = 1;
  normalArcadeEnemiesRemaining = knightB6GuardCount - 1;
  configureKnightBGuard();
  player1.position = { x: 120, y: ground - player1.height };
  player2.position = { x: 820, y: ground - player2.height };
  knightB6.fade = 50;
  reflecterBattleMusic.restart = true;
}


// the guards of the bunker: not the farol's watchman anymore. Olive uniforms, straps, a gas mask
// with round glass eyes, a steel helmet with a lamp, a radio on the belt
function drawKnightBBunkerGuard(fighter) {
  const time = performance.now() / 1000;
  const half = fighter.width / 2;
  const h = fighter.height;
  const facing = fighter.attacksToTheRight ? 1 : -1;
  ctx.save();
  ctx.translate(fighter.position.x + half, fighter.position.y);
  ctx.scale(facing, 1);
  const look = fighter.knightBGuardLook || 'olive';
  const uniform = look === 'grey' ? '#4a4f55' : look === 'chief' ? '#2b2b2b' : '#3b4a3a';
  // the chief wears a long dark coat
  if (look === 'chief') {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-half - 4, 38, fighter.width + 8, h - 30);
  }
  // uniform
  ctx.fillStyle = uniform;
  ctx.fillRect(-half, 38, fighter.width, h - 48);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(-half, 38, 6, h - 48);
  // crossed straps and pouches
  ctx.strokeStyle = '#1a1f1a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-half + 4, 42);
  ctx.lineTo(half - 6, 86);
  ctx.moveTo(half - 4, 42);
  ctx.lineTo(-half + 6, 86);
  ctx.stroke();
  ctx.fillStyle = '#262c25';
  ctx.fillRect(-half, 86, fighter.width, 7);
  [-half + 6, -6, half - 18].forEach((pouchX) => ctx.fillRect(pouchX, 92, 12, 9));
  // the radio, with a little red light
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(-half + 2, 90, 9, 14);
  ctx.fillStyle = Math.floor(time * 3) % 2 ? '#ff1744' : '#5a0010';
  ctx.fillRect(-half + 4, 92, 3, 3);
  // armband
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(half - 10, 52, 10, 8);
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(half - 7, 54, 4, 4);
  // knee pads and boots
  ctx.fillStyle = '#212121';
  ctx.fillRect(-half + 4, h - 26, 14, 8);
  ctx.fillRect(half - 18, h - 26, 14, 8);
  ctx.fillRect(-half, h - 10, fighter.width, 10);
  // the gas mask: black rubber, two round glass eyes, a filter
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(-half + 6, 12, fighter.width - 12, 28);
  ctx.save();
  ctx.shadowColor = '#c6ff00';
  ctx.shadowBlur = 6;
  ctx.fillStyle = 'rgba(200, 230, 120, 0.85)';
  ctx.beginPath();
  ctx.arc(4, 23, 5, 0, Math.PI * 2);
  ctx.arc(17, 23, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#424242';
  ctx.fillRect(6, 30, 12, 12);
  ctx.fillStyle = '#616161';
  for (let hole = 0; hole < 3; hole += 1) ctx.fillRect(8 + hole * 3, 33, 2, 6);
  // the steel helmet, with a lamp shining forward (the chief: a red beret... and gold on his shoulders)
  if (look === 'chief') {
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.ellipse(0, 8, half + 2, 9, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-half - 4, 38, 14, 5);
    ctx.fillRect(half - 10, 38, 14, 5);
    ctx.fillRect(-4, 2, 8, 6);
    ctx.restore();
    return;
  }
  ctx.fillStyle = look === 'grey' ? '#5f6a70' : '#4b5320';
  ctx.beginPath();
  ctx.moveTo(-half + 2, 14);
  ctx.quadraticCurveTo(0, -12, half - 2, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a4019';
  ctx.fillRect(-half - 2, 12, fighter.width + 4, 5);
  ctx.fillStyle = '#fff59d';
  ctx.fillRect(half - 12, 2, 8, 6);
  const lamp = ctx.createLinearGradient(half - 4, 5, half + 90, 5);
  lamp.addColorStop(0, 'rgba(255, 245, 157, 0.35)');
  lamp.addColorStop(1, 'rgba(255, 245, 157, 0)');
  ctx.fillStyle = lamp;
  ctx.beginPath();
  ctx.moveTo(half - 4, 3);
  ctx.lineTo(half + 90, -20);
  ctx.lineTo(half + 90, 30);
  ctx.lineTo(half - 4, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ---------- his fire, as strange as he is ----------
function drawBizarreFireball(ball) {
  const time = performance.now() / 1000;
  const x = ball.position.x;
  const y = ball.position.y;
  const w = ball.width;
  const h = ball.height;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const right = ball.velocity.x > 0;
  // a trail of embers and frost
  if (Math.random() < 0.6) spawnKnightBSparks(cx - (right ? 1 : -1) * w / 2, cy, 1, 0.4);
  // a cold-and-dark glow around it
  ctx.save();
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 34);
  glow.addColorStop(0, 'rgba(178, 235, 242, 0.45)');
  glow.addColorStop(0.5, 'rgba(255, 87, 34, 0.2)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 34, cy - 34, 68, 68);
  // afterimages
  for (let ghost = 3; ghost >= 1; ghost -= 1) {
    ctx.fillStyle = ghost % 2 ? `rgba(10, 8, 14, ${0.14 * ghost})` : `rgba(178, 235, 242, ${0.12 * ghost})`;
    ctx.beginPath();
    ctx.arc(cx - (right ? 1 : -1) * ghost * 13, cy + Math.sin(time * 9 + ghost) * 3, h / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // the shot: a turning crystal, half black glass and half ice, with a molten core
  ctx.translate(cx, cy);
  ctx.rotate(time * 8 * (right ? 1 : -1));
  ctx.fillStyle = '#0b0b0f';
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 - 4); ctx.lineTo(w / 2, 0); ctx.lineTo(0, h / 2 + 4); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b2ebf2';
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 - 4); ctx.lineTo(-w / 2, 0); ctx.lineTo(0, h / 2 + 4); ctx.closePath();
  ctx.fill();
  ctx.shadowColor = '#ff5722';
  ctx.shadowBlur = 12;
  ctx.fillStyle = `rgba(255, 112, 67, ${0.75 + Math.sin(time * 14) * 0.25})`;
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (Math.random() < 0.12) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x + (Math.random() - 0.5) * 20, y + Math.random() * h, w, 2);
  }
}

function drawBizarreFireBeam(beam) {
  const time = performance.now() / 1000;
  const x = beam.position.x;
  const y = beam.position.y;
  const w = beam.width;
  const h = beam.height;
  ctx.save();
  // the glow around it
  ctx.shadowColor = '#80deea';
  ctx.shadowBlur = 16;
  for (let segment = 0; segment < w; segment += 10) {
    const jag = Math.sin(time * 20 + segment) * 3;
    ctx.fillStyle = Math.floor(segment / 10 + time * 8) % 2 ? '#0b0b0f' : '#b2ebf2';
    ctx.fillRect(x + segment, y + jag, 10, h);
  }
  ctx.shadowBlur = 0;
  // a molten thread through the middle, and lightning crackling along the edges
  ctx.fillStyle = `rgba(255, 87, 34, ${0.7 + Math.sin(time * 15) * 0.3})`;
  ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
  ctx.strokeStyle = 'rgba(224, 247, 250, 0.85)';
  ctx.lineWidth = 1.5;
  [y - 4, y + h + 4].forEach((edge) => {
    ctx.beginPath();
    for (let step = 0; step <= w; step += 8) ctx.lineTo(x + step, edge + (Math.random() - 0.5) * 6);
    ctx.stroke();
  });
  ctx.restore();
  if (Math.random() < 0.5) spawnKnightBSparks(x + Math.random() * w, y + h / 2, 1, 0.5);
}

// ---------- his abilities in the bunker ----------
// Q: three shots in a fan (the side ones smaller); F: the beam, and its echo a moment later;
// R: a rift under the rival that bursts into ice spikes and black flames
const knightBRiftCooldown = 360;
const knightBRiftDamage = 14;
let knightBRifts = [];
let knightBPendingBeams = [];

function isKnightBBunkerFight() {
  return isKnightBChapter() && selectedNormalArcadeLevel === 6 && knightB6.phase === 'fight';
}

function castKnightBRift(caster, target) {
  if (!canFighterAct(caster) || (caster.knightBRiftCooldown || 0) > 0 || gameOver) return false;
  knightBRifts.push({ x: target.position.x + target.width / 2, warn: 36, life: 24, hit: false, caster, target });
  caster.knightBRiftCooldown = getDebugCooldown(knightBRiftCooldown, caster);
  recordSpecialUsed(caster);
  playTone({ frequency: 90, duration: 0.5, type: 'sawtooth', volume: 0.04, slideTo: 50 });
  return true;
}

function updateKnightBRifts() {
  [player1, player2].forEach((fighter) => {
    if (fighter.knightBRiftCooldown > 0) fighter.knightBRiftCooldown -= 1;
  });
  // the beam's echo
  knightBPendingBeams.forEach((pending) => {
    pending.timer -= 1;
    if (pending.timer === 0 && !gameOver) {
      const attacker = pending.attacker;
      const direction = pending.direction;
      const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 90;
      fireBeams.push(new FireBeam({ x: startX, y: attacker.position.y + 52, direction, target: pending.target, attacker, damageMultiplier: 0.7 }));
      playSound('fireBeam');
    }
  });
  knightBPendingBeams = knightBPendingBeams.filter((pending) => pending.timer > 0);
  const time = performance.now() / 1000;
  knightBRifts.forEach((rift) => {
    if (rift.warn > 0) {
      rift.warn -= 1;
      // a crack glowing in the floor: half frost, half ember
      ctx.save();
      ctx.strokeStyle = `rgba(178, 235, 242, ${0.5 + Math.sin(time * 20) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rift.x - 40, ground);
      ctx.lineTo(rift.x - 14, ground - 4);
      ctx.lineTo(rift.x, ground);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 87, 34, ${0.5 + Math.sin(time * 20 + 1) * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(rift.x, ground);
      ctx.lineTo(rift.x + 16, ground - 4);
      ctx.lineTo(rift.x + 40, ground);
      ctx.stroke();
      ctx.restore();
      if (rift.warn === 0) {
        playNoise({ duration: 0.3, volume: 0.06, filterFrequency: 900 });
        playTone({ frequency: 1200, duration: 0.2, type: 'triangle', volume: 0.03, slideTo: 400 });
      }
      return;
    }
    rift.life -= 1;
    const grow = Math.min(1, (24 - rift.life) / 6);
    // the burst: ice spikes and black flames, side by side
    if (rift.life === 23) spawnKnightBSparks(rift.x, ground - 30, 30, 1.6);
    const burst = ctx.createRadialGradient(rift.x, ground, 4, rift.x, ground, 120);
    burst.addColorStop(0, `rgba(178, 235, 242, ${0.35 * grow})`);
    burst.addColorStop(1, 'rgba(178, 235, 242, 0)');
    ctx.fillStyle = burst;
    ctx.fillRect(rift.x - 120, ground - 120, 240, 120);
    for (let spike = -4; spike <= 4; spike += 1) {
      const sx = rift.x + spike * 12;
      const tall = (50 + (4 - Math.abs(spike)) * 20) * grow;
      ctx.fillStyle = spike % 2 ? '#0b0b0f' : '#b2ebf2';
      ctx.beginPath();
      ctx.moveTo(sx - 6, ground);
      ctx.lineTo(sx, ground - tall);
      ctx.lineTo(sx + 6, ground);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = `rgba(255, 87, 34, ${0.4 * grow})`;
    ctx.fillRect(rift.x - 44, ground - 6, 88, 6);
    const target = rift.target;
    const box = { x: rift.x - 40, y: ground - 90, width: 80, height: 90 };
    if (!rift.hit && rift.life > 4 && target.position.x < box.x + box.width && target.position.x + target.width > box.x && target.position.y + target.height > box.y) {
      rift.hit = true;
      applyDamage(rift.caster, target, knightBRiftDamage, { isSpecial: true, damageType: 'bizarreRift' });
      target.velocity.y = getDebugKnockback(-11, target);
      target.velocity.x = getDebugKnockback(target.position.x + target.width / 2 >= rift.x ? 5 : -5, target);
    }
  });
  knightBRifts = knightBRifts.filter((rift) => rift.warn > 0 || rift.life > 0);
}


// sparks of his fire: ice shards and black embers, everywhere he hits (and trailing his shots)
let knightBSparks = [];

function spawnKnightBSparks(x, y, count, spread = 1) {
  for (let spark = 0; spark < count; spark += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (1 + Math.random() * 4) * spread;
    knightBSparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1, life: 26 + Math.random() * 20, ice: Math.random() < 0.5, size: 2 + Math.random() * 4 });
  }
  if (knightBSparks.length > 260) knightBSparks.splice(0, knightBSparks.length - 260);
}

function drawKnightBSparks() {
  knightBSparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.12;
    spark.vx *= 0.97;
    spark.life -= 1;
    ctx.save();
    ctx.globalAlpha = Math.min(1, spark.life / 20);
    if (spark.ice) {
      ctx.fillStyle = '#e0f7fa';
      ctx.translate(spark.x, spark.y);
      ctx.rotate(spark.life / 5);
      ctx.fillRect(-spark.size / 2, -spark.size, spark.size, spark.size * 2);
    } else {
      ctx.fillStyle = '#0b0b0f';
      ctx.fillRect(spark.x, spark.y, spark.size, spark.size);
      ctx.fillStyle = 'rgba(255, 87, 34, 0.8)';
      ctx.fillRect(spark.x + 1, spark.y + 1, spark.size / 2, spark.size / 2);
    }
    ctx.restore();
  });
  knightBSparks = knightBSparks.filter((spark) => spark.life > 0);
}

// what his hits leave on the rival: black flames and frost
function drawKnightBBurns() {
  [player1, player2].forEach((fighter) => {
    if (!(fighter.knightBBurn > 0)) return;
    fighter.knightBBurn -= 1;
    const time = performance.now() / 1000;
    for (let flame = 0; flame < 5; flame += 1) {
      const rise = (time * 40 + flame * 13) % 40;
      ctx.fillStyle = flame % 2 ? `rgba(10, 6, 12, ${0.7 - rise / 60})` : `rgba(178, 235, 242, ${0.6 - rise / 70})`;
      ctx.fillRect(fighter.position.x + 6 + flame * (fighter.width / 5), fighter.position.y + fighter.height * 0.4 - rise, 6, 8);
    }
  });
}

// ---------- hooks ----------
// ================= LEVEL 6, THE END: the refuge =================
// The long room at the bottom of the bunker. Fire Master opens the inner door and closes it behind him.
// The room whispers. The sheriff steps up and challenges him; Fire Master says no... and the voice says
// yes. A versus that is not a fight: the sheriff can barely move, and the only thing Fire Master has is
// the Flametomb. Then the faces in the back. Then they run, the lights fail, the screams get fewer...
// and Knight, with his shield up, is the only one the fire cannot take.
const knightBFinaleWorld = 2048;
const knightBFinaleDoorX = 1888;
const knightBFinale = { active: false };
const knightBFinaleWhispers = ['Ese es... Fire Master?', 'Que le paso en los ojos?', 'Shh... no lo miren.', 'Por que cerro la puerta?', 'Mama...', 'Huele a quemado...', 'Viene para aca...', 'Y los guardias? Donde estan?', 'Esta... sonriendo?', 'No se muevan.', 'Tengo frio... y calor.', 'Sheriff... hace algo...'];
const knightBFinaleShouts = ['AYUDA!', 'NO, NO, NO!', 'ABRAN LA PUERTA!', 'KNIGHT! HACE ALGO!', 'POR FAVOR!', 'MAMA!', 'NO ME MIRES!', 'POR AQUI NO!', 'SE APAGAN LAS LUCES!', 'DONDE ESTA?!'];
const knightBFinaleChallenge = [
  { who: 'sheriff', text: '...Alto ahi.' },
  { who: 'sheriff', text: 'Los guardias de afuera... fuiste vos. Lo del bosque tambien. Todo fuiste vos.' },
  { who: 'sheriff', text: 'Aca abajo hay chicos, Fire Master. Si queres a alguien... pelea conmigo. Uno contra uno.' },
  { who: 'fireMaster', text: '...No.' },
  { who: 'fireMaster', text: 'No quiero pelear con vos. Volve con ellos. Por favor... volve con ellos.' },
  { who: 'voice', text: 'ACEPTA.' },
  { who: 'fireMaster', text: 'No... no voy a...' },
  { who: 'voice', text: 'ACEPTA. ACEPTA. ACEPTA. ACEPTA. ACEPTA.' },
  { who: 'fireMaster', text: 'Ba...sta... sali... de mi... cabeza...' },
  { who: 'fireMaster', text: '...Acepto.', possessed: true },
];
const knightBFinaleRadio = [
  '*krrsh* ...Robledal... me escuchan? ...Aqui Light Warrior.',
  '...Ya estamos volviendo. Llegamos manana temprano.',
  '...Aguanten un poco mas, si? Ya casi.',
  '...Celeste, Seto: portense bien. Chef... guardame un poco de sopa.',
  '...Cambio. *krrrsshh*',
];

function knightBFinaleCenter(victim) {
  if (victim.kind === 'actor') {
    const actor = victim.ref;
    return { x: actor.position.x + actor.width / 2, y: actor.position.y + actor.height / 2, top: actor.position.y, w: actor.width, feet: ground };
  }
  const v = victim.ref;
  const sc = knightBVillagerScale(v);
  if (v.pose === 'lie') return { x: v.x + 55 * sc, y: v.y - 10, top: v.y - 26, w: 110 * sc, feet: v.y };
  const feet = knightBVillagerFeet(v);
  const tall = (v.pose === 'stand' ? 96 : 70) * sc;
  return { x: v.x, y: feet - tall / 2, top: feet - tall, w: 42 * sc, feet };
}

// the village, spread along the long room (and the bunks of both halves)
function makeKnightBFinaleVillagers() {
  const plan = [
    { pose: 'lie', x: 40, y: 150 }, { pose: 'sit', x: 66, y: 240, kid: true }, { pose: 'sit', x: 128, y: 240, s: 0.9, old: true },
    { pose: 'lie', x: 1064, y: 150 }, { pose: 'sit', x: 1090, y: 240, kid: true }, { pose: 'sit', x: 1150, y: 240, kid: true },
    { pose: 'stand', x: 24 }, { pose: 'floor', x: 236, kid: true }, { pose: 'floor', x: 268, kid: true }, { pose: 'floor', x: 1420, kid: true },
    { pose: 'floor', x: 1680, kid: true }, { pose: 'floor', x: 1712, kid: true }, { pose: 'stand', x: 1036, baby: true },
    { pose: 'stand', x: 1580, old: true }, { pose: 'stand', x: 1650 },
  ];
  [300, 352, 640, 706, 890, 960, 1210, 1330, 1390, 1500, 1560, 1760, 1820].forEach((x, index) => plan.push({ pose: 'stand', back: true, x, kid: index % 4 === 3, old: index % 5 === 2 }));
  return plan.map((entry, index) => ({ ...knightBVillagerLooks[(index * 5) % knightBVillagerLooks.length], ...entry }));
}

function startKnightBFinale(done) {
  stopReflecterBattleMusic();
  const knight = new Fighter({ x: 0, y: 0, color: '#42a5f5', attacksToTheRight: true });
  knight.setCharacterType('normal', 'knight');
  knight.position = { x: 800, y: ground - knight.height };
  const fm = new Fighter({ x: 0, y: 0, color: '#b8450f', attacksToTheRight: false });
  makeBizarreFireMaster(fm);
  fm.position = { x: knightBFinaleDoorX + 30, y: ground - fm.height };
  const actors = {
    celesteGirl: makeKnightB6Actor('celesteGirl', 420, false),
    setoBoy: makeKnightB6Actor('setoBoy', 486, false),
    mochiMouse: makeKnightB6Actor('mochiMouse', 556, false),
    chefBoss: makeKnightB6Actor('chefBoss', 650, false),
    lanternGuard: makeKnightB6Actor('lanternGuard', 1110, false),
    sheriff: makeKnightB6Actor('sheriff', 1250, false),
  };
  const victims = [];
  makeKnightBFinaleVillagers().forEach((villager, index) => victims.push({ kind: 'villager', index, ref: villager, alive: true, pitch: villager.kid ? 900 : villager.old ? 380 : 560 }));
  Object.entries(actors).forEach(([key, actor]) => victims.push({ kind: 'actor', key, ref: actor, alive: true, pitch: key === 'chefBoss' || key === 'lanternGuard' || key === 'sheriff' ? 420 : 820 }));
  const fin = knightBFinale;
  Object.assign(fin, {
    active: true, stage: 'enter', t: 0, knight, fm, actors, victims, done,
    sheriff: victims.find((victim) => victim.key === 'sheriff'),
    knightVictim: { kind: 'actor', key: 'knight', ref: knight, alive: true, shielded: true, pitch: 500 },
    tomb: null, dust: [], piles: [], texts: [], sparks: [], voice: null, prev: { r: !!keys.r, q: !!keys.q, f: !!keys.f },
    flicker: 0, flickerDark: 0.6, black: 0, doorOpen: 1, knightThought: 0, camX: knightBFinaleWorld - canvas.width, bgDim: 0, reveal: 0,
    line: 0, typed: 0, lineT: 0, sheriffHp: 1, knightShield: 3, knightCower: false, crowd: null, screamEnds: [], shards: [], lamps: [[false, false, false], [false, false, false]], candleOut: false, drawingFall: null, fmGone: false, shake: 0,
  });
  fin.advance = (event) => {
    if (fin.stage !== 'challenge') return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    const line = knightBFinaleChallenge[fin.line];
    if (!line) return;
    if (fin.typed < line.text.length) fin.typed = line.text.length;
    else knightBFinaleNextLine();
  };
  window.addEventListener('keydown', fin.advance);
  canvas.addEventListener('pointerdown', fin.advance);
  document.body.classList.add('knightb-ending');
  fin.raf = requestAnimationFrame(tickKnightBFinale);
}

function knightBFinaleNextLine() {
  const fin = knightBFinale;
  fin.line += 1;
  fin.typed = 0;
  fin.lineT = 0;
  playSound('menuMove');
  const line = knightBFinaleChallenge[fin.line];
  if (line && line.who === 'voice') {
    fin.shake = 30;
    playTone({ frequency: 45, duration: 1.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    playNoise({ duration: 0.6, volume: 0.05, filterFrequency: 500 });
  }
}

function knightBFinaleSay(victim, text, color, life = 110) {
  knightBFinale.texts = knightBFinale.texts.filter((entry) => entry.victim !== victim);
  knightBFinale.texts.push({ victim, text, color, life, max: life });
}

function playKnightBScream(pitch, strong) {
  const base = pitch * (0.9 + Math.random() * 0.2);
  playTone({ frequency: base, duration: strong ? 0.9 : 0.45, type: 'sawtooth', volume: strong ? 0.035 : 0.018, slideTo: base * 0.55 });
  playTone({ frequency: base * 1.5, duration: strong ? 0.7 : 0.35, type: 'triangle', volume: strong ? 0.025 : 0.012, slideTo: base * 0.8 });
  playNoise({ duration: strong ? 0.5 : 0.25, volume: strong ? 0.03 : 0.015, filterFrequency: 2200 });
}

// the sheriff's scream inside the Flametomb: loud, torn, saturated
function playKnightBDistortedScream() {
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  if (!audio) return;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (!out) return;
  const now = audio.currentTime;
  const length = 3;
  const shaper = audio.createWaveShaper();
  const curve = new Float32Array(2048);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i * 2) / curve.length - 1;
    curve[i] = ((3 + 160) * x * 20 * (Math.PI / 180)) / (Math.PI + 160 * Math.abs(x));
  }
  shaper.curve = curve;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.45, now + 0.05);
  gain.gain.setValueAtTime(0.45, now + length * 0.55);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  shaper.connect(gain);
  gain.connect(out);
  const lfo = audio.createOscillator();
  lfo.frequency.value = 7.5;
  const depth = audio.createGain();
  depth.gain.value = 30;
  lfo.connect(depth);
  [[1, 'sawtooth', 1], [1.013, 'sawtooth', 1], [0.5, 'square', 0.7], [2.02, 'sawtooth', 0.5]].forEach(([mult, type, level]) => {
    const osc = audio.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(330 * mult, now);
    osc.frequency.exponentialRampToValueAtTime(780 * mult, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(640 * mult, now + 1.8);
    osc.frequency.exponentialRampToValueAtTime(190 * mult, now + length);
    depth.connect(osc.frequency);
    const band = audio.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1100;
    band.Q.value = 1.1;
    const level2 = audio.createGain();
    level2.gain.value = level;
    osc.connect(band);
    band.connect(level2);
    level2.connect(shaper);
    osc.start(now);
    osc.stop(now + length + 0.05);
  });
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * length), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  const hiss = audio.createBiquadFilter();
  hiss.type = 'bandpass';
  hiss.frequency.value = 2400;
  const hissGain = audio.createGain();
  hissGain.gain.value = 0.6;
  noise.connect(hiss);
  hiss.connect(hissGain);
  hissGain.connect(shaper);
  noise.start(now);
  lfo.start(now);
  lfo.stop(now + length + 0.05);
}

function knightBFinaleShieldPoint() {
  const knight = knightBFinale.knight;
  const facing = knight.attacksToTheRight ? 1 : -1;
  return { x: knight.position.x + knight.width / 2 + facing * 34, y: knight.position.y + 62, top: knight.position.y, w: 30, feet: ground };
}

function startKnightBFinaleTomb(victim, kind) {
  const fin = knightBFinale;
  const from = { x: fin.fm.position.x + fin.fm.width / 2, y: fin.fm.position.y + fin.fm.height / 2 };
  const big = kind === 'sheriff' || kind === 'knight' || kind === 'knightFinal';
  const count = kind === 'sheriff' ? 28 : kind === 'knight' ? 16 : kind === 'knightFinal' ? 26 : 14;
  const diveBase = kind === 'sheriff' ? 80 : kind === 'knight' ? 40 : kind === 'knightFinal' ? 90 : 30;
  const diveStep = kind === 'sheriff' ? 2.4 : kind === 'knight' ? 2 : 1.2;
  fin.tomb = {
    victim, kind, big, t: 0, booms: [],
    flames: Array.from({ length: count }, (_, index) => ({ angle: (index / count) * Math.PI * 2, x: from.x, y: from.y, born: index * 0.7, hunt: 16 + index * 0.3, dive: diveBase + index * diveStep, done: false })),
  };
  victim.caught = true;
  fin.tomb.sounds = [playKnightBTombSound(1)];
  // (the sheriff's and Knight's last one: twice, much louder)
  if (kind === 'sheriff' || kind === 'knightFinal') fin.tomb.sounds.push(playKnightBTombSound(1));
  playNoise({ duration: 0.6, volume: 0.1, filterFrequency: 500 });
  playTone({ frequency: 55, duration: 1.4, type: 'sawtooth', volume: 0.06, slideTo: 35 });
  if (kind === 'sheriff') playKnightBDistortedScream();
  else if (kind === 'knight') {
    fin.knight.knightShieldTimer = 99999;
    fin.knight.velocity.x = 0;
    knightBFinaleSay(victim, ['!!', 'NO!', 'AGUANTA... AGUANTA...'][3 - fin.knightShield] || '!!', '#90caf9', 80);
  } else if (kind === 'knightFinal') {
    knightBFinaleSay(victim, 'NO... POR FAVOR...', '#90caf9', 120);
    playKnightBTerrorScream(500, 1.6, 0.04);
  }
  else {
    playKnightBScream(victim.pitch, true);
    knightBFinaleSay(victim, ['NO!', 'NOOO!', 'POR FAVOR, NO!', 'AYUDA!', 'MAMA!'][Math.floor(Math.random() * 5)], '#ffcdd2', 60);
  }
}

function updateKnightBFinaleTomb() {
  const fin = knightBFinale;
  const tomb = fin.tomb;
  if (!tomb) return;
  tomb.t += 1;
  const fmX = fin.fm.position.x + fin.fm.width / 2;
  const fmY = fin.fm.position.y + fin.fm.height / 2;
  const target = tomb.kind === 'knight' ? knightBFinaleShieldPoint() : knightBFinaleCenter(tomb.victim);
  const count = tomb.flames.length;
  tomb.flames.forEach((flame, index) => {
    if (flame.done || tomb.t < flame.born) return;
    flame.angle += 0.1;
    let goalX;
    let goalY;
    let pull;
    if (tomb.t < flame.hunt) {
      goalX = fmX + Math.cos(flame.angle) * 80;
      goalY = fmY + Math.sin(flame.angle) * 64;
      pull = 0.25;
    } else if (tomb.t < flame.dive) {
      const radius = Math.max(tomb.big ? 70 : 50, (tomb.big ? 160 : 110) - (tomb.t - flame.hunt) * 1.3);
      goalX = target.x + Math.cos(flame.angle * 1.4) * radius;
      goalY = target.y + Math.sin(flame.angle * 1.4) * radius * 0.8;
      pull = 0.2;
    } else {
      goalX = target.x;
      goalY = target.y;
      pull = 0.4;
    }
    flame.x += (goalX - flame.x) * pull;
    flame.y = Math.min(ground - 20, flame.y + (goalY - flame.y) * pull);
    if (tomb.t >= flame.dive && Math.hypot(target.x - flame.x, target.y - flame.y) < 28) {
      flame.done = true;
      tomb.booms.push({ x: flame.x, y: flame.y, life: 22 });
      if (tomb.kind === 'sheriff') fin.sheriffHp = Math.max(0, fin.sheriffHp - 1 / count);
      if (tomb.kind === 'knight') {
        // it breaks on the shield: a clang, sparks, and he slides back
        playTone({ frequency: 1300 + Math.random() * 300, duration: 0.18, type: 'square', volume: 0.04, slideTo: 700 });
        for (let spark = 0; spark < 8; spark += 1) fin.sparks.push({ x: target.x, y: target.y, vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 5, life: 30 });
        const away = fin.knight.position.x + fin.knight.width / 2 < fmX ? -1 : 1;
        fin.knight.position.x = Math.max(20, fin.knight.position.x + away * 5);
      } else {
        playNoise({ duration: 0.16, volume: 0.05, filterFrequency: 1400 + index * 60 });
      }
    }
  });
  tomb.booms.forEach((boom) => { boom.life -= 1; });
  tomb.booms = tomb.booms.filter((boom) => boom.life > 0);
  if (tomb.flames.every((flame) => flame.done) && !tomb.burst) {
    tomb.burst = true;
    tomb.booms.push({ x: target.x, y: target.y, life: 40, big: true });
    playSound('robotHit');
    playTone({ frequency: 48, duration: 1.4, type: 'sawtooth', volume: 0.09, slideTo: 28 });
    const victim = tomb.victim;
    (tomb.sounds || []).forEach((entry) => fadeKnightBTombSound(entry, tomb.kind === 'refugee' ? 80 : 150));
    if (tomb.kind === 'knightFinal') {
      // it reaches him. He falls, the armor black and smoking... and does not move
      fin.knightDead = 1;
      // (the last Flametomb on Knight: Fire Master's book changes one more time)
      if (typeof rememberFlametombVictim === 'function') rememberFlametombVictim('knightB');
      fin.knight.knightShieldGone = true;
      fin.knight.knightSwordGone = true;
      fin.knightCower = false;
      fin.texts = fin.texts.filter((entry) => entry.victim !== victim);
      playNoise({ duration: 0.8, volume: 0.1, filterFrequency: 700 });
      for (let spark = 0; spark < 30; spark += 1) fin.sparks.push({ x: target.x, y: target.y, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6, life: 40 });
    } else if (tomb.kind === 'knight') {
      fin.knightSmoke = 1;
      fin.knightShield -= 1;
      if (fin.knightShield <= 0) {
        // the third one: the shield breaks into pieces
        fin.knight.knightShieldGone = true;
        playNoise({ duration: 0.5, volume: 0.12, filterFrequency: 5000 });
        playTone({ frequency: 900, duration: 0.6, type: 'square', volume: 0.05, slideTo: 200 });
        for (let piece = 0; piece < 12; piece += 1) fin.shards.push({ x: target.x, y: target.y, vx: (Math.random() - 0.5) * 8, vy: -2 - Math.random() * 5, rot: 0, spin: (Math.random() - 0.5) * 0.4, color: piece % 3 ? '#1e3a8a' : '#fbc02d', landed: false });
        knightBFinaleSay(victim, 'MI ESCUDO...!', '#90caf9', 90);
      } else {
        knightBFinaleSay(victim, fin.knightShield === 2 ? '(...aguanto...)' : '(...se esta rompiendo...)', '#90caf9', 90);
      }
    } else {
      // nothing is left but dust
      victim.alive = false;
      fin.texts = fin.texts.filter((entry) => entry.victim !== victim);
      const tall = target.feet - target.top;
      for (let grain = 0; grain < (tomb.big ? 170 : 90); grain += 1) {
        fin.dust.push({ x: target.x + (Math.random() - 0.5) * target.w, y: target.top + Math.random() * tall, vx: (Math.random() - 0.5) * 1.4, vy: -Math.random() * 1.5, life: 120 + Math.random() * 80, floor: target.feet });
      }
      fin.piles.push({ x: target.x, w: target.w * (tomb.big ? 1.3 : 1), y: target.feet });
    }
  }
  if (tomb.burst) {
    tomb.after = (tomb.after || 0) + 1;
    if (tomb.after > (tomb.kind === 'refugee' ? 22 : 50)) {
      fin.tomb = null;
      if (tomb.kind === 'knightFinal') {
        fin.stage = 'blocked';
        fin.t = 0;
      }
      if (tomb.kind === 'knight') {
        // he lowers the shield and runs again
        tomb.victim.caught = false;
        fin.knight.knightShieldTimer = 0;
        tomb.victim.vx = -1;
      }
    }
  }
}

function drawKnightBFinaleTomb() {
  const tomb = knightBFinale.tomb;
  if (!tomb) return;
  const time = performance.now() / 1000;
  const scale = tomb.big ? 1.5 : 1.15;
  ctx.save();
  if (tomb.frozen) ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (tomb.t - tomb.frozen - 60) / 80));
  tomb.flames.forEach((flame, index) => {
    if (flame.done || tomb.t < flame.born) return;
    const grow = Math.min(1, (tomb.t - flame.born) / 8) * scale;
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(flame.x, flame.y, 2, flame.x, flame.y, 46 * grow + 1);
    glow.addColorStop(0, 'rgba(255, 109, 0, 0.75)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(flame.x - 70, flame.y - 70, 140, 140);
    drawFlametombFlame(flame.x, flame.y + 12, 24 * grow, time * 14 + index, 'outer');
    ctx.globalCompositeOperation = 'source-over';
    drawFlametombFlame(flame.x, flame.y + 14, 12 * grow, time * 16 + index, 'core');
  });
  tomb.booms.forEach((boom) => {
    const max = boom.big ? 40 : 22;
    const k = 1 - boom.life / max;
    const radius = ((boom.big ? 60 : 24) + k * (boom.big ? 200 : 60)) * (tomb.big ? 1.3 : 1);
    ctx.globalCompositeOperation = 'lighter';
    const blast = ctx.createRadialGradient(boom.x, boom.y, 2, boom.x, boom.y, radius);
    blast.addColorStop(0, `rgba(255, 213, 79, ${1 - k})`);
    blast.addColorStop(0.45, `rgba(255, 61, 0, ${0.85 * (1 - k)})`);
    blast.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = blast;
    ctx.fillRect(boom.x - radius, boom.y - radius, radius * 2, radius * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.8 * (1 - k)})`;
    ctx.lineWidth = boom.big ? 6 : 2;
    ctx.beginPath();
    ctx.arc(boom.x, boom.y, radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawKnightBFinaleActor(victim, time) {
  const fin = knightBFinale;
  if (!victim.alive) return;
  const background = victim !== fin.sheriff && fin.bgDim > 0;
  ctx.save();
  // trembling: a little while they whisper, a lot once they have seen it
  let shake = fin.reveal > 0 ? 1.8 : 0.6;
  if (victim === fin.sheriff && ['challenge', 'versus', 'duel'].includes(fin.stage)) shake = 2.4;
  if (victim.caught) shake = 3;
  if (victim.running && victim.kind === 'actor' && !victim.fallen && !victim.pound) ctx.translate(0, -Math.abs(Math.sin(time * 18 + victim.pitch)) * 6);
  ctx.translate((Math.random() - 0.5) * shake, 0);
  if (victim.fallen > 0) {
    // flat on the floor, face down, scrambling
    const center = knightBFinaleCenter(victim);
    const fall = Math.min(1, (70 - victim.fallen) / 8);
    ctx.translate(center.x, center.feet);
    ctx.rotate((Math.PI / 2) * (victim.fallDir || 1) * Math.min(1, fall) * (victim.fallen < 10 ? victim.fallen / 10 : 1));
    ctx.translate(-center.x, -center.feet);
  }
  if (victim.pound > 0) ctx.translate(Math.sin(time * 40) * 2, 0);
  if (victim.kind === 'actor') {
    if (background) ctx.globalAlpha = 1 - fin.bgDim * 0.5;
    const actor = victim.ref;
    actor.isAttacking = false;
    if (victim.key === 'chefBoss') {
      actor.chefCalm = true;
      const round = dodgeRound.active;
      dodgeRound.active = true;
      actor.draw();
      dodgeRound.active = round;
    } else {
      actor.draw();
    }
    ctx.globalAlpha = 1;
    if (fin.reveal > 0 && victim !== fin.sheriff) drawKnightBTerrorFace(actor, victim.key, time);
    if (fin.reveal > 0 && victim !== fin.sheriff) {
      // cold sweat, and a "!" that will not go away
      const head = actor.position.y + 18;
      const cx = actor.position.x + actor.width / 2;
      ctx.fillStyle = `rgba(129, 212, 250, ${0.9 * fin.reveal})`;
      [-1, 1].forEach((side, index) => {
        const fall = (time * 36 + index * 13 + victim.pitch) % 26;
        ctx.beginPath();
        ctx.ellipse(cx + side * (actor.width / 2 + 2), head + fall, 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  } else {
    const v = victim.ref;
    v.dim = background ? fin.bgDim : 0;
    drawKnightBVillager(v, victim.index, time);
  }
  ctx.restore();
}

// Knight on the floor: the armor burnt black, embers in the cracks, the visor dark... until the eyes open
function drawKnightBBurntKnight(time) {
  const fin = knightBFinale;
  const k = fin.knight;
  const fall = Math.min(1, fin.knightDead / 26);
  const eased = 1 - (1 - fall) * (1 - fall);
  const pivotX = k.position.x + k.width / 2;
  ctx.save();
  ctx.translate(0, -(k.width / 2) * eased);
  ctx.translate(pivotX, ground);
  ctx.rotate((-Math.PI / 2) * eased);
  ctx.translate(-pivotX, -ground);
  k.isAttacking = false;
  k.knightShieldTimer = 0;
  k.attacksToTheRight = true;
  k.velocity.x = 0;
  k.draw();
  const x = k.position.x;
  const y = k.position.y;
  const w = k.width;
  const h = k.height;
  // (block by block: burnt)
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(70, 50, 42)';
  ctx.fillRect(x - 3, y - 14, w + 6, h + 16);
  ctx.globalCompositeOperation = 'source-over';
  // bitten away: holes in the armor, black inside, their edges still glowing
  const glowEdge = `rgba(255, 110, 30, ${0.5 * Math.max(0, 1 - fin.knightDead / 2600)})`;
  [
    [[x + w - 14, y - 2], [x + w + 1, y - 2], [x + w + 1, y + 16], [x + w - 6, y + 10]],
    [[x - 1, y + h - 22], [x + 12, y + h - 12], [x + 8, y + h + 1], [x - 1, y + h + 1]],
    [[x + 18, y + 48], [x + 30, y + 44], [x + 36, y + 56], [x + 26, y + 66], [x + 16, y + 60]],
    [[x + w + 1, y + 70], [x + w - 10, y + 78], [x + w - 4, y + 90], [x + w + 1, y + 92]],
  ].forEach((points) => {
    ctx.beginPath();
    points.forEach(([px, py], index) => (index ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.fillStyle = '#0d0705';
    ctx.fill();
    ctx.strokeStyle = glowEdge;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  // cracks running across the plates
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  [[[x + 6, y + 30], [x + 14, y + 36], [x + 11, y + 44], [x + 20, y + 50]], [[x + w - 4, y + 40], [x + w - 16, y + 46], [x + w - 12, y + 58]], [[x + 10, y + 96], [x + 22, y + 102], [x + 18, y + 112]], [[x + 30, y + 4], [x + 26, y + 12], [x + 34, y + 17]]].forEach((line) => {
    line.forEach(([px, py], index) => (index ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  });
  ctx.stroke();
  ctx.fillStyle = 'rgba(8, 5, 3, 0.55)';
  [[0.05, 0.08, 0.55, 0.14], [0.5, 0.32, 0.45, 0.2], [0.02, 0.5, 0.4, 0.22], [0.48, 0.7, 0.5, 0.18], [0.15, 0.86, 0.65, 0.1]].forEach(([a, b, c, d]) => ctx.fillRect(x + a * w, y + b * h, c * w, d * h));
  const cooling = Math.max(0, 1 - fin.knightDead / 2200);
  for (let ember = 0; ember < 9; ember += 1) {
    const glow = 0.35 + 0.4 * Math.sin(time * 3 + ember * 2.1);
    ctx.fillStyle = `rgba(255, ${90 + ember * 14}, 30, ${glow * cooling})`;
    ctx.fillRect(x + ((ember * 37) % (w - 4)), y + ((ember * 53) % (h - 4)), 3, 2);
  }
  // the visor: black and cracked... and the eyes, opening
  ctx.fillStyle = '#050505';
  ctx.fillRect(x + 8, y + 18, w - 12, 7);
  ctx.strokeStyle = 'rgba(160, 160, 160, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 6, y + 12);
  ctx.lineTo(x + w / 2 + 2, y + 20);
  ctx.lineTo(x + w / 2 - 1, y + 26);
  ctx.stroke();
  if (fin.knightEyes > 0) {
    const open = fin.knightEyes;
    ctx.fillStyle = `rgba(224, 247, 250, ${0.35 + 0.55 * open})`;
    ctx.fillRect(x + w / 2 + 4, y + 21.5 - 1.5 * open, 6, 3 * open);
    ctx.fillRect(x + w / 2 + 16, y + 21.5 - 1.5 * open, 6, 3 * open);
  }
  ctx.restore();
  // his sword, snapped in two, on the floor beside him
  const swordX = pivotX + 26;
  ctx.save();
  ctx.fillStyle = '#5f5a56';
  ctx.translate(swordX, ground - 3);
  ctx.rotate(0.08);
  ctx.fillRect(0, -2, 34, 3);
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(-10, -3, 10, 5);
  ctx.fillStyle = '#7a6a2a';
  ctx.fillRect(-2, -6, 3, 11);
  ctx.restore();
  ctx.save();
  ctx.translate(swordX + 52, ground - 2);
  ctx.rotate(-0.25);
  ctx.fillStyle = '#5f5a56';
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(26, 0);
  ctx.lineTo(0, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // the only hand he has left: a floating gauntlet, burnt like the rest of him
  const hand = fin.knightHand;
  if (hand) drawKnightBFloatingHand(hand.x, hand.y, hand.rot || 0, time);
}

function drawKnightBFloatingHand(hx, hy, rot, time) {
  ctx.save();
  ctx.translate(hx + Math.sin(time * 30) * 0.5, hy);
  ctx.rotate(rot);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = '#4f4743';
  ctx.fillRect(-7, -6, 14, 12);
  ctx.strokeRect(-7, -6, 14, 12);
  ctx.fillStyle = '#3d3632';
  [-6, -2, 2].forEach((fy) => {
    ctx.fillRect(-15, fy, 8, 3.4);
    ctx.strokeRect(-15, fy, 8, 3.4);
  });
  ctx.fillRect(-4, -11, 4, 6);
  ctx.strokeRect(-4, -11, 4, 6);
  ctx.fillStyle = '#1a1310';
  ctx.fillRect(1, -3, 4, 4);
  ctx.fillStyle = `rgba(255, 120, 40, ${0.3 + Math.sin(time * 4) * 0.2})`;
  ctx.fillRect(3, 2, 2, 2);
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(6, -5, 4, 10);
  ctx.restore();
}

function drawKnightBFinaleText(x, y, text, color, alpha, italic) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.font = italic ? "italic 15px Georgia, serif" : "900 15px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// the voice in his head (the same as on the walk)
function drawKnightBFinaleVoice() {
  const voice = knightBFinale.voice;
  if (!voice) return;
  voice.t += 1;
  const typed = Math.min(voice.text.length, Math.floor(voice.t / 2));
  const fade = Math.min(1, (voice.life - voice.t) / 30);
  if (fade <= 0) {
    knightBFinale.voice = null;
    return;
  }
  const text = voice.text.slice(0, typed);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.font = "900 26px 'Courier New', monospace";
  ctx.textAlign = 'center';
  const vx = canvas.width / 2;
  const vy = 150;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillText(text, vx + 3, vy + 3);
  ctx.fillStyle = `rgba(255, 23, 68, ${0.75 + Math.random() * 0.25})`;
  ctx.fillText(text, vx + (Math.random() - 0.5) * 3, vy + (Math.random() - 0.5) * 2);
  if (Math.random() < 0.2) {
    ctx.fillStyle = 'rgba(178, 235, 242, 0.7)';
    ctx.fillText(text, vx + (Math.random() - 0.5) * 12, vy);
  }
  ctx.restore();
  if (typed > 0 && typed < voice.text.length && voice.t % 6 === 0) playTone({ frequency: 70 + Math.random() * 30, duration: 0.06, type: 'sawtooth', volume: 0.02 });
}

// the dialog of the challenge (at the top: the room stays in sight)
function drawKnightBFinaleDialog() {
  const fin = knightBFinale;
  const line = knightBFinaleChallenge[fin.line];
  if (!line) return;
  const text = line.text.slice(0, fin.typed);
  const voice = line.who === 'voice';
  ctx.save();
  if (voice) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
  const boxY = 24;
  ctx.fillStyle = voice ? 'rgba(20, 0, 4, 0.92)' : 'rgba(8, 8, 12, 0.88)';
  ctx.fillRect(40, boxY, canvas.width - 80, 100);
  ctx.strokeStyle = voice || line.possessed ? '#ff1744' : '#e0e0e0';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, boxY, canvas.width - 80, 100);
  const names = { sheriff: 'SHERIFF', fireMaster: 'FIRE MASTER', voice: '? ? ?' };
  let name = names[line.who];
  if (line.possessed && Math.random() < 0.5) name = 'F1RE M4ST3R';
  ctx.fillStyle = voice || line.possessed ? '#ff1744' : line.who === 'fireMaster' ? '#ff8a65' : '#fdd835';
  ctx.font = "900 15px 'Courier New', monospace";
  ctx.textAlign = 'left';
  ctx.fillText(name, 62, boxY + 26);
  if (voice || line.possessed) {
    ctx.font = "900 22px 'Courier New', monospace";
    ctx.fillStyle = `rgba(255, 23, 68, ${0.8 + Math.random() * 0.2})`;
  } else {
    ctx.font = line.who === 'fireMaster' ? "italic 19px Georgia, serif" : "700 18px 'Courier New', monospace";
    ctx.fillStyle = line.who === 'fireMaster' ? '#d7ccc8' : '#fafafa';
  }
  wrapNoteText(text, canvas.width - 160).forEach((row, index) => ctx.fillText(row, 62 + (voice ? (Math.random() - 0.5) * 3 : 0), boxY + 54 + index * 24));
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#757575';
  ctx.textAlign = 'right';
  ctx.fillText('ENTER / CLICK', canvas.width - 56, boxY + 92);
  ctx.restore();
}

// the versus banner of always... but not this time
function drawKnightBFinaleVersus(frame) {
  const width = canvas.width;
  const slide = Math.min(1, frame / 18);
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.fillRect(0, 0, width, canvas.height);
  const leftX = -width + slide * width;
  const rightX = width - slide * (width / 2);
  const leftBar = ctx.createLinearGradient(leftX, 0, leftX + width / 2, 0);
  leftBar.addColorStop(0, '#000000');
  leftBar.addColorStop(1, '#5c0010');
  ctx.fillStyle = leftBar;
  ctx.fillRect(leftX, 200, width / 2, 110);
  const rightBar = ctx.createLinearGradient(rightX, 0, rightX + width / 2, 0);
  rightBar.addColorStop(0, '#5a5a5a');
  rightBar.addColorStop(1, '#1e1e1e');
  ctx.fillStyle = rightBar;
  ctx.fillRect(rightX, 200, width / 2, 110);
  // (the white seam in the middle is red, and it bleeds)
  ctx.fillStyle = '#b71c1c';
  ctx.fillRect(width / 2 - 2, 200, 4, 110 * slide);
  if (frame > 30) ctx.fillRect(width / 2 - 2, 310, 4, Math.min(140, (frame - 30) * 1.2));
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.font = '900 38px Courier New, monospace';
  ctx.textAlign = 'center';
  let title = 'FIRE MASTER  VS  SHERIFF';
  if (Math.random() < 0.12) title = 'F I R E  M A S T E R  VS  ? ? ?';
  const jitter = (Math.random() - 0.5) * 3;
  ctx.fillStyle = '#e0e0e0';
  ctx.strokeText(title, width / 2 + jitter, 250);
  ctx.fillText(title, width / 2 + jitter, 250);
  if (frame > 40) {
    const broken = frame > 95;
    ctx.font = '900 30px Courier New, monospace';
    if (!broken) {
      ctx.fillStyle = frame > 80 && frame % 4 < 2 ? '#ff1744' : '#fdd835';
      ctx.strokeText('A PELEAR!', width / 2, 292);
      ctx.fillText('A PELEAR!', width / 2, 292);
    } else {
      ctx.fillStyle = '#ff1744';
      const text = 'NO HAY PELEA.';
      ctx.strokeText(text, width / 2 + (Math.random() - 0.5) * 4, 292);
      ctx.fillText(text, width / 2 + (Math.random() - 0.5) * 4, 292);
    }
  }
  // static
  ctx.globalAlpha = 0.25;
  for (let line = 0; line < 10; line += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? '#fff' : '#ff1744';
    ctx.fillRect(0, Math.random() * canvas.height, width, 1 + Math.random() * 2);
  }
  ctx.restore();
}

// the fake HUD of the "fight": two names, two bars... and one of them will not move
function drawKnightBFinaleHud() {
  const fin = knightBFinale;
  const width = canvas.width;
  ctx.save();
  ctx.font = "900 14px 'Courier New', monospace";
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(24, 20, 330, 46);
  ctx.fillRect(width - 354, 20, 330, 46);
  ctx.fillStyle = '#ff1744';
  ctx.textAlign = 'left';
  ctx.fillText('FIRE MASTER', 34, 38);
  ctx.fillStyle = '#7f0000';
  ctx.fillRect(34, 46, 310, 10);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#bdbdbd';
  ctx.fillText('SHERIFF', width - 34, 38);
  ctx.fillStyle = '#333';
  ctx.fillRect(width - 344, 46, 310, 10);
  ctx.fillStyle = fin.sheriffHp > 0.3 ? '#9e9e9e' : '#e53935';
  ctx.fillRect(width - 34 - 310 * fin.sheriffHp, 46, 310 * fin.sheriffHp, 10);
  ctx.restore();
}

function knightBFinaleFocus(goal) {
  const fin = knightBFinale;
  const target = Math.max(0, Math.min(knightBFinaleWorld - canvas.width, goal - canvas.width / 2));
  fin.camX += (target - fin.camX) * 0.08;
}


// ---------- terror on the faces of the chapter's people (drawn over their own faces) ----------
function drawKnightBTerrorFace(actor, key, time) {
  const facing = actor.attacksToTheRight ? 1 : -1;
  const w = actor.width;
  const half = w / 2;
  const shiver = Math.sin(time * 47) * 0.7;
  const drip = (x, y, length, speed, seed) => {
    // a tear running down, and its drop falling
    ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
    ctx.fillRect(x, y, 1.8, length);
    const fall = (time * speed + seed) % 18;
    ctx.beginPath();
    ctx.ellipse(x + 0.9, y + length + fall, 1.6, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const sweat = (x, y, seed) => {
    const fall = (time * 22 + seed) % 16;
    ctx.fillStyle = 'rgba(179, 229, 252, 0.9)';
    ctx.beginPath();
    ctx.moveTo(x, y + fall - 3);
    ctx.quadraticCurveTo(x + 3, y + fall + 2, x, y + fall + 3);
    ctx.quadraticCurveTo(x - 3, y + fall + 2, x, y + fall - 3);
    ctx.fill();
  };
  ctx.save();
  if (key === 'mochiMouse') {
    // MOCHI: huge glossy eyes about to overflow, a tiny quivering mouth, shivers along his sides
    ctx.translate(actor.position.x + actor.width / 2, actor.position.y + actor.height);
    ctx.scale(facing * (actor.width / 40), actor.height / 64);
    ctx.translate(0, -64);
    ctx.fillStyle = '#a9a9a9';
    ctx.fillRect(-1, 13, 21, 18);
    [[4, 18.5], [14, 18.5]].forEach(([ex, ey], index) => {
      ctx.fillStyle = '#0d0d0d';
      ctx.beginPath();
      ctx.ellipse(ex + shiver * 0.3, ey, 4.2, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 1.4, ey - 1.8, 1.5, 0, Math.PI * 2);
      ctx.arc(ex + 1.5, ey + 1.2, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
      ctx.beginPath();
      ctx.ellipse(ex, ey + 4, 3.6, 1.3, 0, 0, Math.PI);
      ctx.fill();
      drip(ex - 2 + index * 3, ey + 4.5, 5, 26, index * 7);
    });
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 28 + shiver * 0.4);
    ctx.lineTo(8, 26.5);
    ctx.lineTo(10, 28 - shiver * 0.4);
    ctx.lineTo(12, 26.5);
    ctx.lineTo(14, 28 + shiver * 0.4);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    [-23, 21].forEach((side) => {
      ctx.beginPath();
      ctx.moveTo(side, 18);
      ctx.lineTo(side + 2, 22);
      ctx.lineTo(side, 26);
      ctx.stroke();
    });
    ctx.restore();
    return;
  }
  ctx.translate(actor.position.x + half, actor.position.y);
  ctx.scale(facing, 1);
  if (key === 'celesteGirl') {
    // CELESTE: the mischief is gone. Pale, enormous wet eyes, two rivers of tears, a mouth that will not stop shaking
    ctx.fillStyle = '#f5e6d8';
    ctx.fillRect(-half + 8, 17, w - 16, 23);
    ctx.fillStyle = 'rgba(120, 140, 200, 0.3)';
    ctx.fillRect(-4, 29, 9, 3);
    ctx.fillRect(10, 29, 9, 3);
    [[1, 23.5], [15, 23.5]].forEach(([ex, ey], index) => {
      ctx.fillStyle = '#1b1b1b';
      ctx.beginPath();
      ctx.ellipse(ex + shiver * 0.4, ey, 4.8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 1.5, ey - 2.5, 2, 0, Math.PI * 2);
      ctx.arc(ex + 1.8, ey + 1.6, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(129, 212, 250, 0.9)';
      ctx.beginPath();
      ctx.ellipse(ex, ey + 5, 4.4, 1.6, 0, 0, Math.PI);
      ctx.fill();
      drip(ex - 3 + index * 5, ey + 5.5, 13, 30, index * 5);
    });
    ctx.strokeStyle = '#6d2a2a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(3, 35);
    for (let step = 1; step <= 5; step += 1) ctx.lineTo(3 + step * 2, 35 + (step % 2 ? -1.5 : 1.5) + Math.sin(time * 30 + step) * 0.6);
    ctx.stroke();
  } else if (key === 'setoBoy') {
    // SETO: eyes squeezed shut behind crooked glasses (one lens cracked), teeth clenched, a cold sweat
    ctx.fillStyle = '#f5e6d8';
    ctx.fillRect(-half + 9, 21, w - 18, 19);
    ctx.save();
    ctx.translate(9.5, 25);
    ctx.rotate(0.12);
    ctx.translate(-9.5, -25);
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-1, 23); ctx.lineTo(3, 25.5); ctx.lineTo(-1, 28);
    ctx.moveTo(20, 23); ctx.lineTo(16, 25.5); ctx.lineTo(20, 28);
    ctx.stroke();
    ctx.lineWidth = 2;
    [2, 17].forEach((lensX) => {
      ctx.beginPath();
      ctx.arc(lensX, 25, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(8.5, 25);
    ctx.lineTo(10.5, 25);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(14, 20); ctx.lineTo(17, 25); ctx.lineTo(15, 30);
    ctx.moveTo(17, 25); ctx.lineTo(22, 23);
    ctx.stroke();
    ctx.restore();
    drip(-3, 31, 7, 28, 0);
    drip(19, 31, 9, 24, 6);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(4 + shiver * 0.5, 33, 11, 4);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1;
    ctx.strokeRect(4 + shiver * 0.5, 33, 11, 4);
    ctx.beginPath();
    [7, 10, 13].forEach((tx) => { ctx.moveTo(tx + shiver * 0.5, 33); ctx.lineTo(tx + shiver * 0.5, 37); });
    ctx.moveTo(4 + shiver * 0.5, 35); ctx.lineTo(15 + shiver * 0.5, 35);
    ctx.stroke();
    sweat(half - 11, 12, 3);
  } else if (key === 'chefBoss') {
    // THE CHEF: all the color gone from his face, his moustache drooping, teeth chattering, sweat pouring
    ctx.fillStyle = '#efe0d0';
    ctx.fillRect(-22, 2, 44, 34);
    ctx.fillStyle = 'rgba(110, 120, 160, 0.35)';
    ctx.fillRect(0, 18, 9, 3);
    ctx.fillRect(13, 18, 9, 3);
    [[5, 13], [17, 13]].forEach(([ex, ey]) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, ey, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.fillRect(ex - 0.8 + shiver, ey - 0.8, 1.6, 1.6);
    });
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1, 7); ctx.lineTo(8, 4);
    ctx.moveTo(21, 7); ctx.lineTo(14, 4);
    ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.ellipse(4, 26, 8, 3.2, 0.9, 0, Math.PI * 2);
    ctx.ellipse(18, 26, 8, 3.2, -0.9, 0, Math.PI * 2);
    ctx.fill();
    const chatter = Math.floor(time * 18) % 2;
    ctx.fillStyle = '#2b0a0a';
    ctx.fillRect(7, 29, 9, 3 + chatter * 2);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(7, 29, 9, 1.8);
    ctx.fillRect(7, 30.5 + chatter * 2, 9, 1.8);
    sweat(-14, 4, 0);
    sweat(-8, 2, 9);
    sweat(20, 6, 5);
  } else if (key === 'lanternGuard') {
    // THE GUARD: bulging eyes, his moustache trembling, his mouth open in a scream that does not come out
    ctx.fillStyle = '#f2dcd4';
    ctx.fillRect(-half + 8, 19, w - 16, 21);
    [[6, 24], [16, 24]].forEach(([ex, ey]) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, ey, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.fillRect(ex - 0.7 + shiver, ey - 0.7, 1.4, 1.4);
    });
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(2, 21); ctx.lineTo(9, 19.5);
    ctx.moveTo(20, 21); ctx.lineTo(13, 19.5);
    ctx.stroke();
    ctx.fillStyle = '#5d4037';
    ctx.save();
    ctx.translate(11, 31);
    ctx.rotate(Math.sin(time * 35) * 0.06);
    ctx.fillRect(-9, 0, 8, 3);
    ctx.fillRect(1, 0, 8, 3);
    ctx.fillRect(-10, 2, 3, 3);
    ctx.fillRect(7, 2, 3, 3);
    ctx.restore();
    ctx.fillStyle = '#2b0a0a';
    ctx.beginPath();
    ctx.ellipse(11, 36.5, 4.5, 3 + Math.abs(Math.sin(time * 6)) * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    sweat(-half + 10, 20, 2);
  } else if (key === 'knight') {
    // KNIGHT: inside the visor, the eyes dart from side to side, looking for a way out
    const dart = Math.sin(time * 5) > 0 ? 1.5 : -1.5;
    ctx.fillStyle = '#111';
    ctx.fillRect(-half + 8, 18, w - 12, 7);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(4 + shiver * 0.6, 18.5, 6, 6);
    ctx.fillRect(16 + shiver * 0.6, 18.5, 6, 6);
    ctx.fillStyle = '#111';
    ctx.fillRect(6.2 + dart + shiver * 0.6, 20.5, 1.6, 1.6);
    ctx.fillRect(18.2 + dart + shiver * 0.6, 20.5, 1.6, 1.6);
    sweat(half - 6, 8, 4);
  }
  ctx.restore();
}

// ---------- the Flametomb's sound in the refuge ----------
// (its loud part, from second 4; each one fades out on its own, they never cut each other)
function playKnightBTombSound(level) {
  const fin = knightBFinale;
  fin.tombSounds = fin.tombSounds || [];
  if (typeof Audio === 'undefined' || typeof flametombSoundSource === 'undefined') return null;
  const volume = Math.max(0, Math.min(1, level * audioSettings.master * audioSettings.sfx));
  const sound = new Audio(flametombSoundSource);
  sound.volume = 0;
  const seek = () => {
    try {
      if (sound.currentTime < 3.9) sound.currentTime = 4;
    } catch (error) {
      // (it plays from the start)
    }
  };
  try {
    sound.currentTime = 4;
  } catch (error) {
    // (seek once the metadata is in)
  }
  sound.addEventListener('loadedmetadata', seek);
  const promise = sound.play();
  if (promise && promise.catch) promise.catch(() => {});
  const entry = { sound, volume, t: 0, fade: 0, fadeLength: 0 };
  // (too many at once: the oldest goes quiet, softly)
  const playing = fin.tombSounds.filter((other) => !other.fadeLength);
  if (playing.length >= 3) playing[0].fadeLength = 30;
  fin.tombSounds.push(entry);
  // under it, a rush of air rising... and a deep thud
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (audio && out) {
    const now = audio.currentTime;
    const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * 1.6), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = audio.createBufferSource();
    noise.buffer = buffer;
    const low = audio.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(200, now);
    low.frequency.exponentialRampToValueAtTime(2600, now + 1.2);
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09 * level, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    noise.connect(low);
    low.connect(gain);
    gain.connect(out);
    noise.start(now);
  }
  return entry;
}

function fadeKnightBTombSound(entry, frames) {
  if (entry && !entry.fadeLength) entry.fadeLength = frames;
}

function updateKnightBTombSounds() {
  const fin = knightBFinale;
  if (!fin.tombSounds) return;
  fin.tombSounds.forEach((entry) => {
    entry.t += 1;
    let volume = entry.volume * Math.min(1, entry.t / 6);
    if (entry.fadeLength) {
      entry.fade += 1;
      volume *= Math.max(0, 1 - entry.fade / entry.fadeLength);
    }
    try {
      entry.sound.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {
      // (ignore)
    }
    if ((entry.fadeLength && entry.fade >= entry.fadeLength) || entry.sound.ended) {
      entry.sound.pause();
      entry.done = true;
    }
  });
  fin.tombSounds = fin.tombSounds.filter((entry) => !entry.done);
}

function stopKnightBTombSounds() {
  const fin = knightBFinale;
  (fin.tombSounds || []).forEach((entry) => entry.sound.pause());
  fin.tombSounds = [];
}

// ---------- the screams ----------
// one scream: a voice going up, cracking, wavering... a little saturated
function playKnightBTerrorScream(pitch, length, volume) {
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (!audio || !out) return;
  const now = audio.currentTime;
  const shaper = audio.createWaveShaper();
  const curve = new Float32Array(512);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i * 2) / curve.length - 1;
    curve[i] = Math.tanh(x * 4);
  }
  shaper.curve = curve;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.06);
  gain.gain.setValueAtTime(volume, now + length * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  shaper.connect(gain);
  gain.connect(out);
  const lfo = audio.createOscillator();
  lfo.frequency.value = 6 + Math.random() * 4;
  const depth = audio.createGain();
  depth.gain.value = pitch * 0.06;
  lfo.connect(depth);
  const band = audio.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = pitch * 2.2;
  band.Q.value = 1.4;
  band.connect(shaper);
  [[1, 'sawtooth'], [1.008, 'sawtooth'], [2, 'triangle']].forEach(([mult, type]) => {
    const osc = audio.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(pitch * 0.8 * mult, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.35 * mult, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.15 * mult, now + length * 0.65);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.55 * mult, now + length);
    depth.connect(osc.frequency);
    osc.connect(band);
    osc.start(now);
    osc.stop(now + length + 0.05);
  });
  lfo.start(now);
  lfo.stop(now + length + 0.05);
}

// under the screams: the whole room crying out, quieter the fewer they are
function startKnightBCrowd() {
  const audio = typeof ensureAudio === 'function' ? ensureAudio() : null;
  const out = (typeof sfxGain !== 'undefined' && sfxGain) || (typeof masterGain !== 'undefined' && masterGain);
  if (!audio || !out || knightBFinale.crowd) return;
  const buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const band = audio.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1100;
  band.Q.value = 3;
  const tremolo = audio.createGain();
  tremolo.gain.value = 0.6;
  const lfo = audio.createOscillator();
  lfo.frequency.value = 5;
  const lfoDepth = audio.createGain();
  lfoDepth.gain.value = 0.4;
  lfo.connect(lfoDepth);
  lfoDepth.connect(tremolo.gain);
  const gain = audio.createGain();
  gain.gain.value = 0.0001;
  noise.connect(band);
  band.connect(tremolo);
  tremolo.connect(gain);
  gain.connect(out);
  noise.start();
  lfo.start();
  knightBFinale.crowd = { noise, lfo, gain, audio };
}

function updateKnightBCrowd(ratio) {
  const crowd = knightBFinale.crowd;
  if (!crowd) return;
  crowd.gain.gain.setTargetAtTime(Math.max(0.0001, 0.07 * ratio), crowd.audio.currentTime, 0.2);
}

function stopKnightBCrowd() {
  const crowd = knightBFinale.crowd;
  if (!crowd) return;
  try {
    crowd.noise.stop();
    crowd.lfo.stop();
  } catch (error) {
    // (already stopped)
  }
  knightBFinale.crowd = null;
}


// ================= meanwhile: Light Warrior and his group, gathering materials far from Robledal =================
const knightBLwLines = [
  [70, 'radio', '*krrsh* ...L-Light... Warrior...'],
  [190, 'lw', '...¿Quien habla?'],
  [330, 'radio', '...soy yo... Knight...'],
  [470, 'lw', '...¿Knight? No... no conozco a ningun Knight. Te equivocaste de canal.'],
  [690, 'radio', '...Fire Master... vino al bunker...'],
  [850, 'radio', '...el sheriff... Celeste... Seto... el chef... Mochi...'],
  [1030, 'radio', '...no queda nadie... solo polvo...'],
  [1200, 'radio', '...no vuelvan... por favor... no... *krrrsshh*'],
  [1330, 'h1', '¿Light Warrior...?'],
  [1450, 'h2', '¿Que paso? ¿Quien era?'],
  [1800, 'h0', '...¿Que... que fue eso?'],
];

function startKnightBLwScene() {
  const fin = knightBFinale;
  const lw = new Fighter({ x: 0, y: 0, color: '#fdd835', attacksToTheRight: false });
  lw.setCharacterType('lightWarrior');
  lw.position = { x: 620, y: ground - lw.height };
  const helpers = [
    { pose: 'stand', x: 190, lit: true, cloth: '#8d6e63', hair: '#3e2723', skin: '#e0ac69', prop: 'plank' },
    { pose: 'stand', x: 330, lit: true, cloth: '#43a047', hair: '#fdd835', skin: '#ffdbac', prop: 'axe' },
    { pose: 'stand', x: 455, lit: true, cloth: '#3949ab', hair: '#212121', skin: '#c68642', prop: 'crate' },
    { pose: 'stand', x: 820, lit: true, cloth: '#ad1457', hair: '#6d4c41', skin: '#f1c27d', prop: 'stone' },
  ];
  fin.lw = { t: 0, lw, helpers, text: null, radioUp: 0, shadow: 0, flash: 0, shake: 0, rings: [], bits: [], launched: false, log: { y: 0, dropped: false, vy: 0 } };
  fin.stage = 'lw';
  fin.t = 0;
  fin.texts = [];
  playNoise({ duration: 0.4, volume: 0.04, filterFrequency: 3000 });
}

function drawKnightBLwStage(time) {
  const width = canvas.width;
  // dusk over a clearing in the north woods
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#2c2350');
  sky.addColorStop(0.55, '#a8566a');
  sky.addColorStop(1, '#f2a65a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, ground);
  ctx.fillStyle = 'rgba(255, 214, 130, 0.9)';
  ctx.beginPath();
  ctx.arc(860, ground - 120, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5b3a4f';
  ctx.beginPath();
  ctx.moveTo(0, ground - 120);
  [[140, ground - 190], [300, ground - 140], [470, ground - 210], [640, ground - 150], [820, ground - 200], [1024, ground - 130]].forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.lineTo(width, ground);
  ctx.lineTo(0, ground);
  ctx.fill();
  ctx.fillStyle = '#2e2433';
  for (let tree = 0; tree < 14; tree += 1) {
    const tx = tree * 78 + (tree % 3) * 12;
    const tall = 110 + (tree % 4) * 26;
    ctx.beginPath();
    ctx.moveTo(tx - 24, ground - 30);
    ctx.lineTo(tx, ground - 30 - tall);
    ctx.lineTo(tx + 24, ground - 30);
    ctx.fill();
    ctx.fillRect(tx - 4, ground - 32, 8, 32);
  }
  // the ground: dirt, sawdust, the work of the day
  ctx.fillStyle = '#6d4c3d';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#8a6450';
  ctx.fillRect(0, ground, width, 4);
  // a pile of logs
  for (let row = 0; row < 3; row += 1) {
    for (let log = 0; log < 4 - row; log += 1) {
      const lx = 40 + log * 30 + row * 15;
      const ly = ground - 14 - row * 26;
      ctx.fillStyle = '#7b5034';
      ctx.beginPath();
      ctx.arc(lx, ly, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c9a27a';
      ctx.beginPath();
      ctx.arc(lx, ly, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7b5034';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // the cart, with crates and a lantern on a post
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(500, ground - 70, 110, 14);
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.arc(520, ground - 20, 20, 0, Math.PI * 2);
  ctx.arc(590, ground - 20, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(508, ground - 106, 40, 36);
  ctx.fillRect(552, ground - 96, 34, 26);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 2;
  ctx.strokeRect(508, ground - 106, 40, 36);
  ctx.strokeRect(552, ground - 96, 34, 26);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(940, ground - 140, 6, 140);
  ctx.fillStyle = `rgba(255, 213, 79, ${0.8 + Math.sin(time * 6) * 0.1})`;
  ctx.fillRect(932, ground - 150, 22, 16);
  // a pile of stones
  ctx.fillStyle = '#8d8d8d';
  [[870, 10], [890, 14], [912, 9], [884, 26], [902, 22]].forEach(([sx, up]) => {
    ctx.beginPath();
    ctx.ellipse(sx, ground - up, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawKnightBLwHelper(helper, index, time) {
  ctx.save();
  if (helper.fall) {
    const pivot = helper.x;
    ctx.translate(pivot, ground);
    ctx.rotate((Math.PI / 2) * helper.fallDir * Math.min(1, helper.fall));
    ctx.translate(-pivot, -ground);
  }
  drawKnightBVillager(helper, 40 + index, time);
  // what each one was carrying
  if (!helper.dropped) {
    const top = ground - 96 * knightBVillagerScale(helper);
    ctx.fillStyle = '#a1887f';
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    if (helper.prop === 'plank') {
      ctx.fillRect(helper.x - 50, top + 36, 100, 8);
      ctx.strokeRect(helper.x - 50, top + 36, 100, 8);
    } else if (helper.prop === 'axe') {
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(helper.x + 22, top + 30, 5, 52);
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(helper.x + 26, top + 30, 12, 12);
    } else if (helper.prop === 'crate') {
      ctx.fillRect(helper.x - 18, top + 44, 36, 26);
      ctx.strokeRect(helper.x - 18, top + 44, 36, 26);
    } else if (helper.prop === 'stone') {
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath();
      ctx.ellipse(helper.x, top + 58, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// his face in the shadow: the lenses go dull, no light behind them
function drawKnightBLwShadow(lw, amount) {
  if (amount <= 0) return;
  const x = lw.position.x;
  const y = lw.position.y;
  const w = lw.width;
  ctx.save();
  const shade = ctx.createLinearGradient(0, y - 6, 0, y + 44);
  shade.addColorStop(0, `rgba(0, 0, 0, ${0.85 * amount})`);
  shade.addColorStop(0.6, `rgba(0, 0, 0, ${0.6 * amount})`);
  shade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(x - 1, y - 6, w + 2, 50);
  ctx.globalAlpha = amount;
  ctx.fillStyle = '#4b4f56';
  ctx.fillRect(x + 16, y + 18, 9, 6);
  ctx.fillRect(x + w - 25, y + 18, 9, 6);
  ctx.fillStyle = '#2e3136';
  ctx.fillRect(x + 16, y + 22, 9, 2);
  ctx.fillRect(x + w - 25, y + 22, 9, 2);
  ctx.restore();
}

function tickKnightBLwScene() {
  const fin = knightBFinale;
  const scene = fin.lw;
  scene.t += 1;
  const t = scene.t;
  const time = performance.now() / 1000;
  const lw = scene.lw;
  const width = canvas.width;
  // ---------- what happens ----------
  knightBLwLines.forEach(([at, who, text]) => {
    if (t === at) {
      scene.text = { who, text, t: 0 };
      if (who === 'radio') playNoise({ duration: 0.35, volume: 0.04, filterFrequency: 3200 });
    }
  });
  if (scene.text) scene.text.t += 1;
  if (scene.text && scene.text.who === 'radio' && t % 8 === 0) playNoise({ duration: 0.05, volume: 0.008, filterFrequency: 3000 });
  // the radio crackles: he drops the log and takes the radio from his belt
  if (t === 100) {
    scene.log.dropped = true;
    playNoise({ duration: 0.3, volume: 0.08, filterFrequency: 400 });
  }
  if (t > 120 && t < 1060) scene.radioUp = Math.min(1, scene.radioUp + 0.04);
  // when he lies, he looks at the others
  lw.eyeLook = t > 470 && t < 620 ? -1 : 0;
  // paralysed: the radio slips out of his hand
  if (t === 1060) {
    scene.radioFalling = { x: lw.position.x - 6, y: lw.position.y + 30, vy: 0 };
  }
  if (scene.radioFalling && !scene.radioFalling.landed) {
    scene.radioFalling.vy += 0.5;
    scene.radioFalling.y += scene.radioFalling.vy;
    if (scene.radioFalling.y >= ground - 12) {
      scene.radioFalling.y = ground - 12;
      scene.radioFalling.landed = true;
      playNoise({ duration: 0.25, volume: 0.06, filterFrequency: 900 });
    }
  }
  if (t > 900) scene.shadow = Math.min(1, scene.shadow + 0.006);
  // the light gathers... and he is gone, faster than the sound
  if (t > 1560 && t < 1660 && t % 4 === 0) {
    scene.bits.push({ x: lw.position.x + lw.width / 2 + (Math.random() - 0.5) * 300, y: lw.position.y + 60 + (Math.random() - 0.5) * 200, gather: true, life: 40 });
  }
  if (t === 1560) playTone({ frequency: 220, duration: 1.8, type: 'sine', volume: 0.05, slideTo: 880 });
  if (t === 1680 && !scene.launched) {
    scene.launched = true;
    scene.flash = 1;
    scene.shake = 45;
    scene.launchX = lw.position.x + lw.width / 2;
    scene.launchY = lw.position.y + lw.height / 2;
    scene.rings.push({ r: 10, life: 60 }, { r: 0, life: 70, delay: 8 });
    playNoise({ duration: 1.4, volume: 0.22, filterFrequency: 1400 });
    playNoise({ duration: 0.12, volume: 0.2 });
    playTone({ frequency: 46, duration: 1.6, type: 'sawtooth', volume: 0.14, slideTo: 24 });
    playTone({ frequency: 2400, duration: 0.5, type: 'triangle', volume: 0.05, slideTo: 90 });
    scene.helpers.forEach((helper) => {
      helper.fallDir = helper.x < scene.launchX ? -1 : 1;
      helper.fall = 0.01;
      helper.dropped = true;
      helper.scared = true;
    });
    for (let bit = 0; bit < 80; bit += 1) {
      const angle = Math.random() * Math.PI;
      const speed = 4 + Math.random() * 12;
      scene.bits.push({ x: scene.launchX, y: ground - 10, vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1), vy: -Math.sin(angle) * speed * 0.7, life: 60 + Math.random() * 40, leaf: Math.random() < 0.5 });
    }
  }
  scene.helpers.forEach((helper) => {
    if (helper.fall && helper.fall < 1) helper.fall = Math.min(1, helper.fall + 0.09);
  });
  if (t > 1960) {
    scene.black = Math.min(1, (scene.black || 0) + 0.025);
    if (scene.black >= 1) {
      fin.stage = 'back';
      fin.t = 0;
      fin.lw = null;
      return;
    }
  }
  // ---------- drawing ----------
  ctx.clearRect(0, 0, width, canvas.height);
  ctx.save();
  if (scene.shake > 0) {
    scene.shake -= 1;
    ctx.translate((Math.random() - 0.5) * Math.min(14, scene.shake), (Math.random() - 0.5) * Math.min(10, scene.shake));
  }
  drawKnightBLwStage(time);
  scene.helpers.forEach((helper, index) => {
    // at work... until the radio; after that they only watch him
    if (t < 70 && !helper.fall) helper.x += Math.sin(t / 20 + index) * 0.2;
    drawKnightBLwHelper(helper, index, time);
  });
  if (!scene.launched) {
    // the log he was carrying
    if (!scene.log.dropped) {
      ctx.fillStyle = '#7b5034';
      ctx.fillRect(lw.position.x - 30, lw.position.y + 30, lw.width + 60, 16);
      ctx.fillStyle = '#c9a27a';
      ctx.beginPath();
      ctx.ellipse(lw.position.x - 30, lw.position.y + 38, 5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    if (t > 690) ctx.translate((Math.random() - 0.5) * (t > 1060 ? 0.6 : 1.2), 0);
    lw.isAttacking = false;
    lw.draw();
    drawKnightBLwShadow(lw, scene.shadow);
    // the radio in his hand, at his face
    if (scene.radioUp > 0 && !scene.radioFalling) {
      const rx = lw.position.x - 10;
      const ry = lw.position.y + 70 - 42 * scene.radioUp;
      drawKnightBRadio(rx - 22, ry - 11, 0, scene.text && scene.text.who === 'radio' && Math.floor(time * 8) % 2 ? '#76ff03' : '#1b5e20');
    }
    ctx.restore();
  } else {
    // the trail of light, through the sky
    const k = Math.max(0, 1 - (t - 1680) / 90);
    if (k > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const trail = ctx.createLinearGradient(scene.launchX, scene.launchY, width + 100, -120);
      trail.addColorStop(0, `rgba(255, 249, 196, ${k})`);
      trail.addColorStop(1, `rgba(255, 213, 79, ${0.3 * k})`);
      ctx.fillStyle = trail;
      ctx.beginPath();
      ctx.moveTo(scene.launchX - 8, scene.launchY);
      ctx.lineTo(scene.launchX + 8, scene.launchY);
      ctx.lineTo(width + 140, -100);
      ctx.lineTo(width + 60, -140);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // the crater of light where he stood
    ctx.fillStyle = 'rgba(40, 25, 15, 0.6)';
    ctx.beginPath();
    ctx.ellipse(scene.launchX, ground + 2, 46, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (scene.radioFalling) drawKnightBRadio(scene.radioFalling.x - 22, scene.radioFalling.y - 11, scene.radioFalling.landed ? 0.2 : 0, t < 1300 && Math.floor(time * 8) % 2 ? '#76ff03' : '#1b5e20');
  if (scene.log.dropped && !scene.launched) {
    ctx.fillStyle = '#7b5034';
    ctx.fillRect(lw.position.x - 40, ground - 16, lw.width + 70, 16);
  }
  // the sound barrier, breaking: rings of air and light
  scene.rings.forEach((ring) => {
    if (ring.delay > 0) {
      ring.delay -= 1;
      return;
    }
    ring.life -= 1;
    ring.r += 26;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 253, 231, ${Math.max(0, ring.life / 60)})`;
    ctx.lineWidth = 2 + ring.life / 6;
    ctx.beginPath();
    ctx.ellipse(scene.launchX, scene.launchY, ring.r, ring.r * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
  scene.rings = scene.rings.filter((ring) => ring.life > 0);
  scene.bits.forEach((bit) => {
    bit.life -= 1;
    if (bit.gather) {
      bit.x += (lw.position.x + lw.width / 2 - bit.x) * 0.08;
      bit.y += (lw.position.y + 60 - bit.y) * 0.08;
      ctx.fillStyle = `rgba(255, 241, 118, ${bit.life / 40})`;
      ctx.fillRect(bit.x - 2, bit.y - 2, 4, 4);
      return;
    }
    bit.x += bit.vx;
    bit.y += bit.vy;
    bit.vy += 0.2;
    bit.vx *= 0.97;
    if (bit.y > ground) bit.y = ground;
    ctx.fillStyle = bit.leaf ? `rgba(130, 160, 60, ${Math.min(1, bit.life / 30)})` : `rgba(150, 110, 80, ${Math.min(1, bit.life / 30)})`;
    ctx.fillRect(bit.x, bit.y, bit.leaf ? 5 : 3, bit.leaf ? 3 : 3);
  });
  scene.bits = scene.bits.filter((bit) => bit.life > 0);
  ctx.restore();
  // the words
  const say = scene.text;
  if (say) {
    const typed = say.text.slice(0, Math.floor(say.t / 2));
    const alpha = Math.min(1, (190 - say.t) / 30);
    if (alpha > 0) {
      if (say.who === 'radio') {
        const rx = scene.radioFalling ? scene.radioFalling.x : lw.position.x - 10;
        drawKnightBFinaleText(Math.max(220, rx), lw.position.y - 40, typed, `rgba(178, 255, 89, ${0.7 + Math.random() * 0.3})`, alpha, false);
      } else if (say.who === 'lw') {
        drawKnightBFinaleText(lw.position.x + lw.width / 2, lw.position.y - 18, typed, '#fff59d', alpha, false);
      } else {
        const helper = scene.helpers[Number(say.who.slice(1))];
        drawKnightBFinaleText(helper.x, ground - (helper.fall ? 60 : 136), typed, '#ffffff', alpha, true);
      }
    }
  }
  if (t < 180) drawKnightBFinaleText(width / 2, 60, 'Mientras tanto, lejos de Robledal...', '#e0e0e0', Math.min(1, t / 30, (180 - t) / 30), true);
  // the close-up: his face in the shadow, the light gathering around him
  if (t >= 1590 && t < 1680) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, canvas.height);
    for (let streak = 0; streak < 18; streak += 1) {
      ctx.fillStyle = `rgba(255, 236, 130, ${0.08 + Math.random() * 0.1})`;
      ctx.fillRect((streak * 61 + t * 9) % width, 0, 3, canvas.height);
    }
    const old = { ...lw.position };
    ctx.translate(width / 2, canvas.height * 0.95);
    ctx.scale(3.6, 3.6);
    lw.position = { x: -lw.width / 2, y: -lw.height };
    lw.eyeLook = 0;
    lw.draw();
    drawKnightBLwShadow(lw, 1);
    lw.position = old;
    ctx.restore();
  }
  if (scene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${scene.flash})`;
    ctx.fillRect(0, 0, width, canvas.height);
    scene.flash = Math.max(0, scene.flash - 0.03);
  }
  if (scene.black) {
    ctx.fillStyle = `rgba(0, 0, 0, ${scene.black})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
}

function tickKnightBFinale() {
  const fin = knightBFinale;
  if (!fin.active) return;
  fin.t += 1;
  const t = fin.t;
  const time = performance.now() / 1000;
  const width = canvas.width;
  const fm = fin.fm;
  const fmX = fm.position.x + fm.width / 2;
  stopReflecterBattleMusic();
  // only the press of a key counts (R, and Q/F that do nothing now)
  const pressed = {};
  ['r', 'q', 'f'].forEach((key) => {
    pressed[key] = !!keys[key] && !fin.prev[key];
    fin.prev[key] = !!keys[key];
  });
  const alive = fin.victims.filter((victim) => victim.alive);
  const sheriffX = fin.sheriff.ref.position.x + fin.sheriff.ref.width / 2;
  // ---------- what happens ----------
  if (fin.stage === 'enter') {
    // the inner door opens; he steps in; the door closes behind him
    knightBFinaleFocus(knightBFinaleDoorX);
    if (t > 30) fm.position.x = Math.max(knightBFinaleDoorX - 80, fm.position.x - 1.3);
    if (t === 1) playNoise({ duration: 0.9, volume: 0.06, filterFrequency: 300 });
    if (t === 130) {
      fin.doorOpen = 0;
      playNoise({ duration: 0.7, volume: 0.14, filterFrequency: 260 });
      playTone({ frequency: 60, duration: 0.6, type: 'square', volume: 0.06, slideTo: 40 });
      fin.victims.forEach((victim) => {
        if (victim.kind === 'actor') victim.ref.attacksToTheRight = true;
      });
      alive.filter((victim) => victim.ref.position ? victim.ref.position.x > 1000 : victim.ref.x > 1300).slice(0, 5).forEach((victim) => knightBFinaleSay(victim, '!', '#ffffff', 60));
    }
    if (t > 190) {
      fin.stage = 'approach';
      fin.t = 0;
    }
  } else if (fin.stage === 'approach') {
    // slowly, toward the sheriff. The room whispers
    knightBFinaleFocus(fmX - 120);
    const stopAt = fin.sheriff.ref.position.x + fin.sheriff.ref.width + 190;
    fm.attacksToTheRight = false;
    if (fm.position.x > stopAt) {
      fm.position.x = Math.max(stopAt, fm.position.x - 0.9);
      if (t % 36 === 0) playSound('cutsceneStep');
    }
    if (t % 45 === 10) {
      const talkers = alive.filter((victim) => victim !== fin.sheriff);
      const who = talkers[Math.floor(Math.random() * talkers.length)];
      if (who) knightBFinaleSay(who, knightBFinaleWhispers[Math.floor(Math.random() * knightBFinaleWhispers.length)], '#bdbdbd', 120);
    }
    if (t % 14 === 0) playNoise({ duration: 0.25, volume: 0.012, filterFrequency: 380 });
    if (t % 70 === 0) playTone({ frequency: 52, duration: 0.25, type: 'sine', volume: 0.07 });
    if (fm.position.x <= stopAt && t > 120) {
      fin.stage = 'challenge';
      fin.t = 0;
      fin.texts = [];
      fin.line = 0;
      fin.typed = 0;
      fin.lineT = 0;
    }
  } else if (fin.stage === 'challenge') {
    // the sheriff steps forward, and challenges him. Fire Master says no... the voice says yes
    knightBFinaleFocus((fmX + sheriffX) / 2);
    fin.bgDim = Math.min(1, fin.bgDim + 0.02);
    if (fin.line === 0 && t < 60) {
      fin.sheriff.ref.position.x += 0.5;
      fin.sheriff.ref.attacksToTheRight = true;
    }
    const line = knightBFinaleChallenge[fin.line];
    if (line) {
      if (t % 2 === 0) fin.typed = Math.min(line.text.length, fin.typed + 1);
      fin.lineT += 1;
      if (fin.typed >= line.text.length && fin.lineT > line.text.length * 2 + 150) knightBFinaleNextLine();
      if (line.who === 'voice' && t % 50 === 0) playTone({ frequency: 45, duration: 0.5, type: 'sawtooth', volume: 0.05 });
    } else {
      fin.stage = 'versus';
      fin.t = 0;
      playTone({ frequency: 40, duration: 2.6, type: 'sawtooth', volume: 0.06, slideTo: 30 });
      playNoise({ duration: 1.2, volume: 0.05, filterFrequency: 600 });
    }
  } else if (fin.stage === 'versus') {
    knightBFinaleFocus((fmX + sheriffX) / 2);
    if (t % 45 === 0) playTone({ frequency: 50, duration: 0.3, type: 'sine', volume: 0.09 });
    if (t === 96) playNoise({ duration: 0.4, volume: 0.08, filterFrequency: 1800 });
    if (t >= 190) {
      fin.stage = 'duel';
      fin.t = 0;
    }
  } else if (fin.stage === 'duel') {
    // the "fight": the sheriff can barely move. Fire Master only has the Flametomb
    knightBFinaleFocus((fmX + sheriffX) / 2);
    fin.sheriff.ref.position.x += Math.sin(t / 30) * 0.12;
    fin.sheriff.ref.attacksToTheRight = true;
    if (t === 70) knightBFinaleSay(fin.sheriff, 'N-no... no te acerques...', '#ffffff', 140);
    if (t === 300) knightBFinaleSay(fin.sheriff, '...', '#ffffff', 200);
    if (t % 60 === 0) playTone({ frequency: 50, duration: 0.3, type: 'sine', volume: 0.08 });
    if (pressed.q || pressed.f) fin.voice = { text: 'NO. SOLO EL FUEGO.', t: 0, life: 120 };
    if (pressed.r && t > 30) {
      fin.stage = 'sheriffTomb';
      fin.t = 0;
      fin.texts = [];
      fin.voice = null;
      startKnightBFinaleTomb(fin.sheriff, 'sheriff');
    }
  } else if (fin.stage === 'sheriffTomb') {
    knightBFinaleFocus(sheriffX + 80);
    fin.shake = Math.max(fin.shake, fin.tomb && fin.tomb.t > 60 ? 6 : 2);
    if (!fin.tomb && fin.t > 30) {
      fin.stage = 'reveal';
      fin.t = 0;
    }
  } else if (fin.stage === 'reveal') {
    // the ones in the back come into the light. Their faces have changed. Nobody makes a sound
    fin.bgDim = Math.max(0, fin.bgDim - 0.02);
    fin.reveal = Math.min(1, fin.reveal + 0.02);
    if (t === 2) {
      fin.victims.forEach((victim) => {
        if (victim.kind === 'villager') {
          victim.ref.scared = true;
          victim.ref.lit = true;
        }
        if (victim.kind === 'actor') victim.ref.attacksToTheRight = victim.ref.position.x < fm.position.x;
      });
    }
    knightBFinaleFocus(t < 120 ? fmX - 260 : fmX - 380 + Math.sin(t / 60) * 30);
    if (t === 280) {
      const guard = fin.victims.find((victim) => victim.key === 'lanternGuard');
      knightBFinaleSay(guard, 'C-CORRAN!! CORRAN!!', '#ffffff', 90);
      playKnightBScream(guard.pitch, true);
    }
    if (t >= 300) {
      fin.stage = 'hunt';
      fin.t = 0;
      fin.victims.forEach((victim) => {
        if (!victim.alive) return;
        victim.running = true;
        if (victim.kind === 'villager') {
          const v = victim.ref;
          if (v.pose === 'lie') v.x += 55 * knightBVillagerScale(v);
          v.pose = 'stand';
          v.back = false;
          v.running = true;
        }
        const center = knightBFinaleCenter(victim);
        const sc = victim.kind === 'villager' && victim.ref.kid ? 0.8 : 1;
        victim.vx = (center.x < fmX ? -1 : 1) * (3.6 + Math.random() * 2.2) * sc;
      });
      fin.voice = { text: 'TODOS.', t: 0, life: 200 };
      const kv = fin.knightVictim;
      kv.running = true;
      kv.caught = false;
      kv.vx = 4.6;
      fin.knight.knightShieldTimer = 0;
      fin.total = alive.length;
      startKnightBCrowd();
    }
  } else if (fin.stage === 'hunt' || fin.stage === 'knight') {
    // they run (there is nowhere to go); he walks among them; R takes the closest one
    knightBFinaleFocus(fmX);
    const speed = 4.6;
    if (!fin.tomb) {
      if (keys.a || keys.ArrowLeft) { fm.position.x -= speed; fm.attacksToTheRight = false; }
      if (keys.d || keys.ArrowRight) { fm.position.x += speed; fm.attacksToTheRight = true; }
      fm.position.x = Math.max(30, Math.min(knightBFinaleDoorX - 40, fm.position.x));
      if ((keys.a || keys.d || keys.ArrowLeft || keys.ArrowRight) && t % 16 === 0) playSound('cutsceneStep');
    }
    const runners = fin.stage === 'hunt' ? alive.concat([fin.knightVictim]) : [];
    runners.forEach((victim) => {
      if (victim.caught) return;
      const isKnight = victim === fin.knightVictim;
      const center = knightBFinaleCenter(victim);
      const kid = victim.kind === 'villager' && victim.ref.kid;
      const move = (dx) => {
        if (victim.kind === 'actor') {
          victim.ref.position.x += dx;
          victim.ref.velocity.x = dx;
          if (dx) victim.ref.attacksToTheRight = dx > 0;
        } else {
          victim.ref.x += dx;
        }
      };
      // fallen: they tripped, and crawl back up
      if (victim.fallen > 0) {
        victim.fallen -= 1;
        move(0);
        return;
      }
      // frozen for a moment, covering their heads
      if (victim.cower > 0) {
        victim.cower -= 1;
        move(0);
        return;
      }
      if (victim.pound > 0) {
        // at the closed door: banging, pulling at the handle
        victim.pound -= 1;
        move(0);
        if (victim.pound % 8 === 0) playNoise({ duration: 0.08, volume: 0.05, filterFrequency: 300 });
        if (isKnight && victim.pound % 70 === 0) knightBFinaleSay(victim, ['ESTA TRABADA!', 'AYUDENME! EMPUJEN!', 'ABRITE... ABRITE...', 'NO SE MUEVE!'][Math.floor(Math.random() * 4)], '#90caf9', 70);
        if (Math.abs(center.x - fmX) < 200 || victim.pound === 0) {
          victim.pound = 0;
          victim.vx = -Math.abs(victim.vx || 4);
        }
        return;
      }
      const near = Math.abs(center.x - fmX) < 240;
      let speed = (isKnight ? 4.8 : kid ? 4.2 : 5.4) * (near ? 1.35 : 1) * (victim.speedK || (victim.speedK = 0.8 + Math.random() * 0.45));
      if (!victim.vx) victim.vx = 1;
      // away from him when he is close... and toward the door otherwise (Knight above all)
      if (near && Math.sign(fmX - center.x) === Math.sign(victim.vx)) victim.vx = -victim.vx;
      else if (isKnight && !near && Math.random() < 0.05) victim.vx = 1;
      // panic: sudden turns, freezing in place, tripping
      if (!isKnight && Math.random() < 0.012) victim.vx = -victim.vx;
      if (!isKnight && Math.random() < 0.004) {
        victim.cower = 15 + Math.floor(Math.random() * 25);
        knightBFinaleSay(victim, ['no no no no', 'NO!', 'mama...'][Math.floor(Math.random() * 3)], '#ffcdd2', 40);
      }
      if (!isKnight && Math.random() < 0.003) {
        victim.fallen = 40 + Math.floor(Math.random() * 30);
        victim.fallDir = Math.sign(victim.vx) || 1;
        playNoise({ duration: 0.12, volume: 0.05, filterFrequency: 500 });
      }
      const dx = Math.sign(victim.vx) * speed + (Math.random() - 0.5) * 1.2;
      const nextX = center.x + dx;
      if (nextX < 30) victim.vx = 1;
      if (nextX > knightBFinaleDoorX - 20) {
        victim.vx = -1;
        if (isKnight || Math.random() < 0.7) {
          victim.pound = isKnight ? 160 : 50 + Math.floor(Math.random() * 40);
          if (!isKnight) knightBFinaleSay(victim, ['ABRAN! ABRAN LA PUERTA!', 'DEJENNOS SALIR!', 'POR FAVOR!'][Math.floor(Math.random() * 3)], '#ffcdd2', 60);
        }
        return;
      }
      move(dx);
    });
    // the screams: all the time while they run... fewer and fewer, the fewer they are
    const nowSeconds = performance.now() / 1000;
    fin.screamEnds = fin.screamEnds.filter((end) => end > nowSeconds);
    const ratio = fin.total ? alive.length / fin.total : 0;
    updateKnightBCrowd(fin.stage === 'hunt' ? ratio : 0);
    const maxVoices = Math.max(1, Math.ceil(alive.length / 4));
    if (alive.length && fin.screamEnds.length < maxVoices && Math.random() < 0.03 + alive.length * 0.006) {
      const who = alive[Math.floor(Math.random() * alive.length)];
      const length = 0.7 + Math.random() * 1.1;
      playKnightBTerrorScream(who.pitch * (0.85 + Math.random() * 0.3), length, 0.03 + Math.random() * 0.02);
      fin.screamEnds.push(nowSeconds + length);
      if (Math.random() < 0.35) knightBFinaleSay(who, knightBFinaleShouts[Math.floor(Math.random() * knightBFinaleShouts.length)], '#ffcdd2', 70);
      else if (Math.random() < 0.5) knightBFinaleSay(who, ['AAAAAH!', 'AAAH!', 'AAAAAAAAH!'][Math.floor(Math.random() * 3)], '#ff8a80', 50);
    }
    // the lights fail, again and again
    if (fin.flicker > 0) fin.flicker -= 1;
    else if (fin.stage === 'hunt' && Math.random() < 0.04) {
      fin.flicker = 4 + Math.floor(Math.random() * 14);
      fin.flickerDark = Math.random() < 0.25 ? 0.93 : 0.65;
      playNoise({ duration: 0.05, volume: 0.03, filterFrequency: 3000 });
    }
    if (fin.stage === 'knight') fin.knight.attacksToTheRight = fmX > fin.knight.position.x;
    if (t === 160 && fin.stage === 'hunt') fin.knightThought = 1;
    if (!(fin.tomb && fin.tomb.victim === fin.knightVictim) && fin.stage === 'hunt') fin.knight.knightShieldTimer = 0;
    if (pressed.r && !fin.tomb) {
      if (fin.stage === 'knight') {
        const d = Math.abs(fin.knight.position.x + fin.knight.width / 2 - fmX);
        if (!fin.knightCower) {
          // (he is still running to the wall: let him get there)
        } else if (d < 300) {
          fm.attacksToTheRight = fin.knight.position.x > fm.position.x;
          startKnightBFinaleTomb(fin.knightVictim, 'knightFinal');
        } else {
          fin.texts.push({ fm: true, text: '(Mas cerca.)', color: '#ff8a80', life: 60, max: 60 });
        }
      } else {
        const pool = alive.filter((victim) => !victim.caught);
        if (fin.knightShield > 0) pool.push(fin.knightVictim);
        const targets = pool.map((victim) => ({ victim, d: Math.abs(knightBFinaleCenter(victim).x - fmX) })).sort((a, b) => a.d - b.d);
        if (targets.length && targets[0].d < 300) {
          fm.attacksToTheRight = knightBFinaleCenter(targets[0].victim).x > fmX;
          startKnightBFinaleTomb(targets[0].victim, targets[0].victim === fin.knightVictim ? 'knight' : 'refugee');
        } else if (targets.length) {
          fin.texts.push({ fm: true, text: '(Mas cerca.)', color: '#ff8a80', life: 60, max: 60 });
        }
      }
    }
    if (fin.stage === 'hunt' && !alive.length && !fin.tomb) {
      // only Knight left: his shield goes up
      fin.stage = 'knight';
      fin.t = 0;
      fin.flicker = 0;
      fin.knightThought = 0;
      fin.texts = [];
      fin.knightVictim.caught = false;
      fin.knight.knightShieldTimer = fin.knightShield > 0 ? 99999 : 0;
      fin.voice = { text: '...Falta uno.', t: 0, life: 200 };
      stopKnightBCrowd();
    }
    if (fin.stage === 'knight' && !fin.knightCower && !fin.knightDead) {
      // he runs to the wall, under the children's drawings, and curls up there
      const goal = 700;
      const kx = fin.knight.position.x;
      const step = Math.sign(goal - kx) * Math.min(5, Math.abs(goal - kx));
      fin.knight.position.x += step;
      fin.knight.velocity.x = step;
      fin.knight.attacksToTheRight = step > 0;
      if (Math.abs(goal - fin.knight.position.x) < 1) {
        fin.knightCower = true;
        fin.knight.velocity.x = 0;
        knightBFinaleSay(fin.knightVictim, 'no... no... no...', '#90caf9', 160);
      }
    }
  } else if (fin.stage === 'blocked') {
    // the shield held. Smoke, the shield red-hot, and the two of them looking at each other
    knightBFinaleFocus((fmX + fin.knight.position.x) / 2);
    if (t === 90) fin.voice = { text: '...Ya esta.', t: 0, life: 150 };
    if (t === 270) fin.voice = { text: 'Ya no queda nadie.', t: 0, life: 170 };
    if (t > 470) {
      fin.stage = 'radio';
      fin.t = 0;
    }
  } else if (fin.stage === 'radio') {
    // the radio on the table, in the middle of the dust
    knightBFinaleFocus(512);
    const index = Math.floor((t - 60) / 190);
    if (t >= 60 && (t - 60) % 190 === 0 && index < knightBFinaleRadio.length) {
      playNoise({ duration: 0.5, volume: 0.04, filterFrequency: 3500 });
      playTone({ frequency: 1100, duration: 0.08, type: 'square', volume: 0.02 });
    }
    if (t >= 60 && index < knightBFinaleRadio.length && t % 9 === 0) playNoise({ duration: 0.05, volume: 0.008, filterFrequency: 3000 });
    fin.radioLine = t >= 60 && index < knightBFinaleRadio.length ? { text: knightBFinaleRadio[index], k: (t - 60) % 190 } : null;
    if (t > 60 + knightBFinaleRadio.length * 190 + 160) {
      fin.stage = 'laugh';
      fin.t = 0;
      fin.radioLine = null;
    }
  } else if (fin.stage === 'laugh') {
    // he laughs. Quietly. Too long
    knightBFinaleFocus(fmX);
    const laughs = { 60: 'je...', 150: 'je je...', 230: 'jejeje...', 300: 'je je je je...', 420: '...je.' };
    if (laughs[t]) {
      fin.texts.push({ fm: true, text: laughs[t], color: '#bdbdbd', life: 90, max: 90 });
      playTone({ frequency: 110, duration: 0.12, type: 'triangle', volume: 0.04 });
      playTone({ frequency: 104, duration: 0.12, type: 'triangle', volume: 0.04, delay: 0.16 });
    }
    if (t > 560) {
      fin.stage = 'leave';
      fin.t = 0;
    }
  } else if (fin.stage === 'leave') {
    // a cut: he is already at the door. It opens, he goes, it closes
    if (t === 1) {
      fm.position.x = knightBFinaleDoorX - 30;
      fm.attacksToTheRight = true;
      fin.camX = knightBFinaleWorld - width;
      fin.doorOpen = 1;
      playNoise({ duration: 0.9, volume: 0.06, filterFrequency: 300 });
    }
    knightBFinaleFocus(knightBFinaleDoorX);
    if (t > 30) fm.position.x += 1.4;
    if (t === 110) {
      fin.fmGone = true;
      fin.doorOpen = 0;
      playNoise({ duration: 0.7, volume: 0.14, filterFrequency: 260 });
      playTone({ frequency: 60, duration: 0.6, type: 'square', volume: 0.06, slideTo: 40 });
    }
    if (t > 200) {
      fin.stage = 'alone';
      fin.t = 0;
    }
  } else if (fin.stage === 'alone') {
    // Knight, alone with the dust. The lights go out one by one
    knightBFinaleFocus(600);
    const offAt = [240, 320, 390, 450, 500, 540];
    const order = [[1, 2], [1, 1], [1, 0], [0, 2], [0, 0], [0, 1]];
    offAt.forEach((at, index) => {
      if (t === at) {
        const [tile, lamp] = order[index];
        fin.lamps[tile][lamp] = true;
        playTone({ frequency: 2200, duration: 0.03, type: 'square', volume: 0.03 });
        playNoise({ duration: 0.06, volume: 0.03, filterFrequency: 4000 });
      }
    });
    if (t === 610) fin.drawingFall = { x: 744, y: 128, vy: 0, rot: 0, landed: false };
    // his eyes open, slowly (once they close again... then they stay open)
    if (t > 720 && t < 850) fin.knightEyes = Math.min(0.35, (t - 720) / 300);
    if (t >= 850 && t < 880) fin.knightEyes = Math.max(0, fin.knightEyes - 0.03);
    if (t >= 880 && t < 1000) fin.knightEyes = Math.min(1, (t - 880) / 120);
    // he drags himself toward the table, a little at a time
    const kx = fin.knight.position.x + fin.knight.width / 2;
    const headX = kx - fin.knight.height + 6;
    if (fin.knightDead > 30 && !fin.crawlDone) {
      if (t >= 1000) {
        // reaching out, gripping the floor, pulling
        const cycle = (t % 50) / 50;
        const out = cycle < 0.24 ? 1 - cycle / 0.24 : (cycle - 0.24) / 0.76;
        fin.knightHand = { x: headX - 6 - 26 * out, y: ground - 10 - Math.sin(out * Math.PI) * 10, rot: 0 };
      } else {
        fin.knightHand = { x: headX - 10, y: ground - 7, rot: 0.3 };
      }
    }
    if (t >= 1000 && !fin.crawlDone) {
      if (t % 50 < 12) {
        fin.knight.position.x -= 1.1;
        if (t % 50 === 0) playNoise({ duration: 0.25, volume: 0.025, filterFrequency: 600 });
      }
      if (kx <= 674) fin.crawlDone = t;
    }
    if (fin.crawlDone) {
      const e = t - fin.crawlDone;
      // the hand floats up to the table, takes the radio... and comes down with it
      if (!fin.radioDrop) {
        const k = Math.min(1, e / 55);
        const from = { x: headX - 10, y: ground - 12 };
        fin.knightHand = { x: from.x + (520 - from.x) * k, y: from.y + (228 - from.y) * k - Math.sin(k * Math.PI) * 20, rot: -0.4 * k };
      } else {
        fin.knightHand = { x: fin.radioDrop.x + 30, y: fin.radioDrop.y + 2 + (fin.radioDrop.landed ? Math.sin(t / 7) * 0.8 : 0), rot: 0.2 };
      }
      if (e === 60) {
        // he pulls the radio down from the table
        fin.radioDrop = { x: 490, y: 208, vy: 0, rot: 0, landed: false };
        playNoise({ duration: 0.2, volume: 0.05, filterFrequency: 1200 });
      }
      if (e === 110) playNoise({ duration: 0.6, volume: 0.04, filterFrequency: 3500 });
      const knightRadio = [[150, '...L-Light... Warrior...']];
      if (e === 330) {
        // ...and far away, someone hears it
        startKnightBLwScene();
      }
      knightRadio.forEach(([at, text]) => {
        if (e === at) {
          fin.knightRadioLine = { text, t: 0 };
          playNoise({ duration: 0.3, volume: 0.03, filterFrequency: 3000 });
        }
      });
      if (fin.knightRadioLine) fin.knightRadioLine.t += 1;
      if (e > 110 && e < 330 && t % 9 === 0) playNoise({ duration: 0.05, volume: 0.006, filterFrequency: 3000 });
    }
  } else if (fin.stage === 'back') {
    // back in the bunker: his eyes close again, the hand slides off the radio... the candle goes out
    knightBFinaleFocus(600);
    fin.knightEyes = Math.max(0, 1 - t / 160);
    if (fin.knightHand && t > 60) {
      fin.knightHand.y = Math.min(ground - 6, fin.knightHand.y + 0.15);
      fin.knightHand.x -= 0.05;
      fin.knightHand.rot = Math.min(0.6, fin.knightHand.rot + 0.004);
    }
    if (t === 220) {
      fin.candleOut = true;
      playNoise({ duration: 0.3, volume: 0.02, filterFrequency: 800 });
    }
    if (t > 220) fin.black = 1;
    if (t === 300) {
      // (very far away, something tears through the sky)
      playNoise({ duration: 1.6, volume: 0.05, filterFrequency: 400 });
      playTone({ frequency: 38, duration: 1.8, type: 'sine', volume: 0.06 });
    }
    if (t > 470) {
      finishKnightBFinale();
      return;
    }
  }
  if (fin.radioDrop && !fin.radioDrop.landed) {
    const radio = fin.radioDrop;
    radio.vy += 0.45;
    radio.y += radio.vy;
    radio.rot += 0.06;
    if (radio.y >= ground - 22) {
      radio.y = ground - 22;
      radio.rot = 0.18;
      radio.landed = true;
      playNoise({ duration: 0.35, volume: 0.09, filterFrequency: 900 });
      playTone({ frequency: 180, duration: 0.15, type: 'square', volume: 0.04 });
    }
  }
  if (fin.knightDead) fin.knightDead += 1;
  if (fin.drawingFall && !fin.drawingFall.landed) {
    const paper = fin.drawingFall;
    paper.vy = Math.min(2.2, paper.vy + 0.05);
    paper.y += paper.vy;
    paper.x += Math.sin(paper.y / 18) * 1.2;
    paper.rot = Math.sin(paper.y / 22) * 0.6;
    if (paper.y >= ground - 4) {
      paper.y = ground - 4;
      paper.rot = 0.1;
      paper.landed = true;
    }
  }
  if (fin.stage === 'lw') {
    tickKnightBLwScene();
    fin.raf = requestAnimationFrame(tickKnightBFinale);
    return;
  }
  updateKnightBFinaleTomb();
  updateKnightBTombSounds();
  if (fin.shake > 0) fin.shake -= 1;
  // ---------- drawing ----------
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (fin.shake > 0) ctx.translate((Math.random() - 0.5) * Math.min(8, fin.shake), (Math.random() - 0.5) * Math.min(5, fin.shake));
  ctx.translate(-Math.round(fin.camX), 0);
  // the long room: two halves of the refuge, one door at the far end
  drawKnightBBunkerInside({ noDoor: true, lampsOff: fin.lamps[0], hideKnightDrawing: !!fin.drawingFall, candleOut: fin.candleOut, noRadio: !!fin.radioDrop });
  if (fin.radioDrop) {
    const talking = fin.knightRadioLine || (fin.crawlDone && fin.t - fin.crawlDone > 110);
    drawKnightBRadio(fin.radioDrop.x, fin.radioDrop.y, fin.radioDrop.rot, talking && Math.floor(time * 8) % 2 ? '#76ff03' : '#1b5e20');
  }
  ctx.save();
  ctx.translate(1024, 0);
  drawKnightBBunkerInside({ noTable: true, noDrawings: true, lampsOff: fin.lamps[1] });
  ctx.restore();
  if (fin.doorOpen) {
    ctx.fillStyle = '#050505';
    ctx.fillRect(knightBFinaleDoorX, ground - 170, 110, 170);
    const glow = ctx.createRadialGradient(knightBFinaleDoorX + 55, ground - 80, 4, knightBFinaleDoorX + 55, ground - 80, 120);
    glow.addColorStop(0, 'rgba(255, 61, 0, 0.35)');
    glow.addColorStop(1, 'rgba(255, 61, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(knightBFinaleDoorX - 70, ground - 200, 250, 200);
  }
  if (fin.radioLine) {
    // the radio's light, blinking fast
    ctx.fillStyle = Math.floor(time * 10) % 2 ? '#76ff03' : '#1b5e20';
    ctx.fillRect(496, 214, 4, 4);
  }
  fin.piles.forEach((pile) => {
    ctx.fillStyle = '#8d8d8d';
    ctx.beginPath();
    ctx.ellipse(pile.x, pile.y, pile.w * 0.6, 7, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#5f5f5f';
    ctx.fillRect(pile.x - pile.w * 0.5, pile.y - 2, pile.w, 2);
  });
  if (fin.drawingFall) {
    // the children's drawing of the knight, on the floor
    const paper = fin.drawingFall;
    ctx.save();
    ctx.translate(paper.x + 17, paper.y + 13);
    ctx.rotate(paper.rot);
    ctx.fillStyle = '#ffccbc';
    ctx.fillRect(-17, -13, 34, 26);
    ctx.strokeStyle = '#1e88e5';
    ctx.lineWidth = 2;
    ctx.strokeRect(-5, -7, 10, 16);
    ctx.restore();
  }
  // the back row first, then the rest
  fin.victims.forEach((victim) => {
    if (victim.kind === 'villager' && victim.ref.back) drawKnightBFinaleActor(victim, time);
  });
  fin.victims.forEach((victim) => {
    if (!(victim.kind === 'villager' && victim.ref.back)) drawKnightBFinaleActor(victim, time);
  });
  // Knight: frozen, shaking... and later behind his shield
  ctx.save();
  const knightShake = ['hunt', 'knight', 'blocked', 'alone', 'radio', 'laugh', 'leave'].includes(fin.stage) ? 2.2 : fin.stage === 'enter' ? 0.4 : 1;
  ctx.translate((Math.random() - 0.5) * knightShake, 0);
  if (fin.knightCower) {
    ctx.translate(fin.knight.position.x + fin.knight.width / 2, ground);
    ctx.scale(1, 0.82);
    ctx.translate(-(fin.knight.position.x + fin.knight.width / 2), -ground);
  }
  if (fin.stage === 'hunt' && fin.knightVictim.running && Math.abs(fin.knight.velocity.x) > 0.4) ctx.translate(0, -Math.abs(Math.sin(time * 16)) * 5);
  if (fin.knightDead) {
    ctx.restore();
    drawKnightBBurntKnight(time);
  } else {
    fin.knight.isAttacking = false;
    fin.knight.draw();
    if (fin.reveal > 0) drawKnightBTerrorFace(fin.knight, 'knight', time);
    ctx.restore();
  }
  // the pieces of his shield, on the floor
  fin.shards.forEach((shard) => {
    if (!shard.landed) {
      shard.x += shard.vx;
      shard.y += shard.vy;
      shard.vy += 0.4;
      shard.rot += shard.spin;
      if (shard.y >= ground - 3) {
        shard.y = ground - 3;
        shard.landed = true;
      }
    }
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(shard.rot);
    ctx.fillStyle = shard.color;
    ctx.beginPath();
    ctx.moveTo(-5, 3);
    ctx.lineTo(0, -5);
    ctx.lineTo(6, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  if (fin.knightDead && fin.knightDead % 7 === 0 && fin.knightDead < 1600) {
    const kx = fin.knight.position.x + fin.knight.width / 2;
    fin.sparks.push({ x: kx - 20 - Math.random() * 80, y: ground - 40, vx: (Math.random() - 0.5) * 0.3, vy: -0.5, life: 70, smoke: true });
  }
  if (fin.knightSmoke && !fin.knight.knightShieldGone && !fin.knightDead) {
    // the shield, red-hot and smoking
    const shield = knightBFinaleShieldPoint();
    const heat = Math.max(0, 1 - fin.knightSmoke / 600);
    fin.knightSmoke += 1;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(shield.x, shield.y, 2, shield.x, shield.y, 40);
    glow.addColorStop(0, `rgba(255, 87, 34, ${0.6 * heat})`);
    glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(shield.x - 40, shield.y - 40, 80, 80);
    ctx.restore();
    if (fin.knightSmoke % 6 === 0 && fin.knightSmoke < 900) fin.sparks.push({ x: shield.x + (Math.random() - 0.5) * 16, y: shield.y - 20, vx: (Math.random() - 0.5) * 0.4, vy: -0.6, life: 70, smoke: true });
  }
  if (!fin.fmGone) {
    fm.isAttacking = false;
    drawBizarreFireMaster(fm, 1);
  }
  drawKnightBFinaleTomb();
  fin.dust.forEach((grain) => {
    grain.x += grain.vx;
    grain.y = Math.min(grain.floor - 1, grain.y + grain.vy);
    grain.vy += 0.05;
    grain.vx *= 0.97;
    grain.life -= 1;
    ctx.fillStyle = `rgba(190, 190, 190, ${Math.min(0.85, grain.life / 80)})`;
    ctx.fillRect(grain.x, grain.y, 2, 2);
  });
  fin.dust = fin.dust.filter((grain) => grain.life > 0);
  fin.sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    if (!spark.smoke) spark.vy += 0.25;
    spark.life -= 1;
    ctx.fillStyle = spark.smoke ? `rgba(120, 120, 120, ${spark.life / 140})` : (spark.life % 4 < 2 ? '#fff3e0' : '#ff9100');
    const size = spark.smoke ? 6 + (70 - spark.life) * 0.2 : 3;
    ctx.fillRect(spark.x - size / 2, spark.y - size / 2, size, size);
  });
  fin.sparks = fin.sparks.filter((spark) => spark.life > 0);
  // what they say (in the room)
  fin.texts.forEach((entry) => {
    entry.life -= 1;
    const alpha = Math.min(1, entry.life / 20, (entry.max - entry.life) / 10 + 0.2);
    if (entry.fm) {
      if (!fin.fmGone) drawKnightBFinaleText(fmX, fm.position.y - 24, entry.text, entry.color, alpha, true);
      return;
    }
    const center = entry.victim.kind === 'actor' ? knightBFinaleCenter(entry.victim) : knightBFinaleCenter(entry.victim);
    drawKnightBFinaleText(center.x, center.top - 14, entry.text, entry.color, alpha, entry.color === '#bdbdbd' || entry.color === '#9e9e9e');
  });
  fin.texts = fin.texts.filter((entry) => entry.life > 0);
  if (fin.knightThought && fin.stage === 'hunt' && !fin.texts.some((entry) => entry.victim === fin.knightVictim)) {
    fin.knightThought += 1;
    const lines = ['(La puerta... hay que abrir la puerta...)', '(Prometi protegerlos... lo prometi...)', '(No... no otra vez...)'];
    drawKnightBFinaleText(fin.knight.position.x + fin.knight.width / 2, fin.knight.position.y - 20, lines[Math.floor(fin.knightThought / 220) % lines.length], '#90caf9', 0.85, true);
  }
  if (fin.knightLines) {
    fin.knightLines += 1;
    const sorry = fin.knightLines < 120 ? '...' : '(perdon... perdon... perdon...)';
    drawKnightBFinaleText(fin.knight.position.x + fin.knight.width / 2, fin.knight.position.y - 20, sorry, '#90caf9', 0.7, true);
  }
  if (fin.radioLine) {
    const text = fin.radioLine.text.slice(0, Math.floor(fin.radioLine.k / 1.6));
    ctx.save();
    ctx.font = "700 15px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    const boxW = Math.max(60, ctx.measureText(fin.radioLine.text).width + 24);
    ctx.fillRect(512 - boxW / 2, 160, boxW, 28);
    ctx.fillStyle = Math.random() < 0.08 ? '#33691e' : '#b2ff59';
    ctx.fillText(text, 512 + (Math.random() - 0.5) * 1.5, 179);
    ctx.restore();
  }
  ctx.restore();
  // ---------- on the screen itself ----------
  drawKnightBGloom(false);
  if (['reveal', 'blocked', 'radio', 'laugh', 'leave', 'alone', 'back'].includes(fin.stage)) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.28, fin.t / 200)})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
  if (fin.stage === 'alone' || fin.stage === 'back') {
    const off = fin.lamps[0].concat(fin.lamps[1]).filter(Boolean).length;
    ctx.fillStyle = `rgba(0, 0, 0, ${off * 0.05})`;
    ctx.fillRect(0, 0, width, canvas.height);
    if (!fin.candleOut) {
      // the candle: the only light left, on him and the radio
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const cx = 563 - fin.camX;
      const glow = ctx.createRadialGradient(cx, 260, 10, cx, 260, 260);
      glow.addColorStop(0, `rgba(255, 170, 80, ${0.16 + Math.sin(time * 9) * 0.02})`);
      glow.addColorStop(1, 'rgba(255, 170, 80, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 260, 0, 520, canvas.height);
      ctx.restore();
    }
  }
  if (fin.flicker > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fin.flickerDark})`;
    ctx.fillRect(0, 0, width, canvas.height);
  }
  if (fin.stage === 'hunt') {
    // where the rest of them are
    const left = alive.filter((victim) => knightBFinaleCenter(victim).x < fin.camX).length;
    const right = alive.filter((victim) => knightBFinaleCenter(victim).x > fin.camX + width).length;
    ctx.save();
    ctx.font = "900 16px 'Courier New', monospace";
    ctx.fillStyle = 'rgba(255, 82, 82, 0.6)';
    ctx.textAlign = 'left';
    if (left) ctx.fillText(`< ${left}`, 12, ground - 70);
    ctx.textAlign = 'right';
    if (right) ctx.fillText(`${right} >`, width - 12, ground - 70);
    ctx.restore();
  }
  if (fin.stage === 'challenge') drawKnightBFinaleDialog();
  if (fin.stage === 'versus') drawKnightBFinaleVersus(fin.t);
  if (fin.stage === 'duel' || fin.stage === 'sheriffTomb') drawKnightBFinaleHud();
  drawKnightBFinaleVoice();
  const prompt = fin.stage === 'duel' && fin.t > 90 ? '[R] Flametomb' : (fin.stage === 'hunt' || fin.stage === 'knight') && !fin.tomb && fin.t < 700 ? '[A/D] moverse   [R] Flametomb' : '';
  if (prompt) {
    ctx.save();
    ctx.globalAlpha = 0.35 + Math.sin(time * 4) * 0.25;
    ctx.font = "900 16px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff1744';
    ctx.fillText(prompt, width / 2, canvas.height - 24);
    ctx.restore();
  }
  if (fin.leaveCut) fin.leaveCut -= 1;
  if (fin.knightRadioLine) {
    const line = fin.knightRadioLine;
    const text = line.text.slice(0, Math.floor(line.t / 4));
    const alpha = Math.min(1, (170 - line.t) / 30);
    if (alpha > 0) drawKnightBFinaleText(560 - fin.camX, ground - 70, text, '#90caf9', alpha, true);
  }
  if (fin.black > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fin.black})`;
    ctx.fillRect(0, 0, width, canvas.height);
    if (fin.darkRadio) drawKnightBFinaleText(width / 2, canvas.height / 2, fin.darkRadio, `rgba(178, 255, 89, ${0.6 + Math.random() * 0.3})`, 1, false);
  }
  fin.raf = requestAnimationFrame(tickKnightBFinale);
}

function finishKnightBFinale(skipDone) {
  const fin = knightBFinale;
  if (!fin.active) return;
  fin.active = false;
  cancelAnimationFrame(fin.raf);
  window.removeEventListener('keydown', fin.advance);
  canvas.removeEventListener('pointerdown', fin.advance);
  if (typeof stopObsidianTombSounds === 'function') stopObsidianTombSounds();
  stopKnightBCrowd();
  stopKnightBTombSounds();
  document.body.classList.remove('knightb-ending');
  fin.tomb = null;
  fin.dust = [];
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!skipDone && fin.done) fin.done();
}

(function hookChapterFiveB() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  wrap('configureNormalArcadeLevel', (base) => function configureNormalArcadeLevelWith5B(...args) {
    if (isKnightBChapter()) return configureKnightBLevel();
    return base.apply(this, args);
  });
  wrap('configureNormalArcadeEnemy', (base) => function configureNormalArcadeEnemyWith5B(...args) {
    if (isKnightBChapter()) return configureKnightBEnemy();
    return base.apply(this, args);
  });
  wrap('getArcadeChapterMap', (base) => function getArcadeChapterMapWith5B(...args) {
    return arcadeChapter === 'knightB' ? 'enchantedForest' : base.apply(this, args);
  });
  wrap('getArcadeChapterLevelCount', (base) => function getArcadeChapterLevelCountWith5B(...args) {
    return arcadeChapter === 'knightB' ? knightBLevelCount : base.apply(this, args);
  });
  wrap('getArcadeProgressStorageKey', (base) => function getArcadeProgressStorageKeyWith5B(...args) {
    return arcadeChapter === 'knightB' ? knightBProgressKey : base.apply(this, args);
  });
  wrap('isArcadeLevelComingSoon', (base) => function isArcadeLevelComingSoonWith5B(level, ...rest) {
    return arcadeChapter === 'knightB' ? level > knightBPlayableLevels : base.call(this, level, ...rest);
  });
  wrap('getChapterFinalLevel', (base) => function getChapterFinalLevelWith5B(chapter, ...rest) {
    return chapter === 'knightB' ? knightBLevelCount : base.call(this, chapter, ...rest);
  });
  wrap('syncRouteBChapterUI', (base) => function syncRouteBChapterUIWith5B(...args) {
    if (arcadeChapter === 'knightB') return syncKnightBChapterUI();
    return base.apply(this, args);
  });
  wrap('syncArcadeRouteTabs', (base) => function syncArcadeRouteTabsWith5B(...args) {
    const result = base.apply(this, args);
    syncKnightBCard();
    return result;
  });
  wrap('getCharacterDisplayName', (base) => function getCharacterDisplayNameWith5B(fighter, ...rest) {
    if (fighter && fighter.knightBBunkerGuard && fighter.secretVariant === 'lanternGuard' && isKnightBChapter() && selectedNormalArcadeLevel === 6) return fighter.knightBGuardLook === 'chief' ? 'Jefe de Guardia' : 'Guardia del Bunker';
    return base.call(this, fighter, ...rest);
  });
  wrap('getReflecterBattleTrackKey', (base) => function getReflecterBattleTrackKeyWith5B(...args) {
    if (isKnightBChapter() && !(typeof getVersusMusicChoice === 'function' && getVersusMusicChoice())) {
      if (selectedNormalArcadeLevel >= 2 && selectedNormalArcadeLevel <= 5) return null;
      if (selectedNormalArcadeLevel === 6) return knightB6.phase === 'fight' ? 'berdlyTense' : null;
      return player2.secretVariant === 'mossBeast' ? 'bushMonsterSlow' : 'darkOrderRemake';
    }
    return base.apply(this, args);
  });
  // the stages, gloomier
  wrap('drawEnchantedForestStage', (base) => function drawEnchantedForestStageWith5B(...args) {
    const result = base.apply(this, args);
    if (isKnightBChapter()) drawKnightBGloom(true);
    return result;
  });
  wrap('drawVillagePlazaStage', (base) => function drawVillagePlazaStageWith5B(...args) {
    const result = base.apply(this, args);
    drawKnightBTravelNight();
    if (isKnightBChapter()) drawKnightBGloom(true);
    return result;
  });
  // the hot springs: nobody at the stall (the chef is gone), a plank nailed across it
  wrap('drawHotSpringsStage', (base) => function drawHotSpringsStageWith5B(...args) {
    if (!isKnightBChapter()) return base.apply(this, args);
    const result = base.call(this, false);
    // (the pink dusk goes cold and grey)
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(70, 70, 105, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    drawKnightBClosedStall();
    drawKnightBTravelNight();
    drawKnightBGloom(true);
    return result;
  });
  // the alleys: darker still, and now and then every light goes out for a moment
  wrap('drawRobledalAlleyStage', (base) => function drawRobledalAlleyStageWith5B(...args) {
    const result = base.apply(this, args);
    if (!isKnightBChapter()) return result;
    drawKnightBGloom(true);
    drawKnightBBlackout();
    return result;
  });
  // the bunker (outside and inside) has its own drawing
  wrap('drawStage', (base) => function drawStageWith5B(...args) {
    if (selectedMap === 'robledalBunkerOut') {
      drawKnightBBunkerOutside();
      drawKnightBGloom(false);
      return undefined;
    }
    if (selectedMap === 'robledalBunkerHall') {
      drawKnightBBunkerHall();
      drawKnightBGloom(false);
      return undefined;
    }
    if (selectedMap === 'robledalBunker') {
      drawKnightBBunkerInside();
      drawKnightBVillagers();
      drawKnightBGloom(false);
      return undefined;
    }
    return base.apply(this, args);
  });
  // the bizarre Fire Master: two shots instead of one, a wobble, his colors, and what they leave behind
  wrap('launchFireball', (base) => function launchFireballBizarre(attacker, target, ...rest) {
    const before = fireballs.length;
    const result = base.call(this, attacker, target, ...rest);
    if (attacker && attacker.knightBBizarre && fireballs.length > before) {
      const first = fireballs[fireballs.length - 1];
      const direction = Math.sign(first.velocity.x) || 1;
      // (in the bunker: a fan of three, the side ones drifting apart)
      const drifts = isKnightBBunkerFight() ? [-0.7, 0.7] : [0];
      drifts.forEach((drift) => {
        const echo = new Fireball({ x: first.position.x, y: first.position.y - 24 + (drift > 0 ? 40 : 0), direction, target, attacker, damageMultiplier: 0.5 });
        echo.drift = drift;
        fireballs.push(echo);
      });
    }
    return result;
  });
  wrap('launchFireBeam', (base) => function launchFireBeamBizarre(attacker, target, ...rest) {
    const before = fireBeams.length;
    const result = base.call(this, attacker, target, ...rest);
    if (attacker && attacker.knightBBizarre && fireBeams.length > before && isKnightBBunkerFight()) {
      const beam = fireBeams[fireBeams.length - 1];
      knightBPendingBeams.push({ attacker, target, direction: Math.sign(beam.velocity.x) || 1, timer: 12 });
    }
    return result;
  });
  wrap('handleFlametombKey', (base) => function handleFlametombKeyBizarre(caster, target, ...rest) {
    if (knightBFinale.active) return true;
    if (caster && caster.knightBBizarre && isKnightBBunkerFight()) return castKnightBRift(caster, target);
    return base.call(this, caster, target, ...rest);
  });
  wrap('getPlayerAbilityCooldowns', (base) => function getPlayerAbilityCooldownsBizarre(player, ...rest) {
    const cooldowns = base.call(this, player, ...rest);
    if (player && player.knightBBizarre && isKnightBBunkerFight() && cooldowns) {
      if (cooldowns.q) cooldowns.q.name = 'Abanico bizarro';
      if (cooldowns.f) cooldowns.f.name = 'Rayo con eco';
      cooldowns.r = { active: true, name: 'Grieta de hielo y fuego', remaining: player.knightBRiftCooldown || 0, max: getDebugCooldown(knightBRiftCooldown, player) };
    }
    return cooldowns;
  });
  // the bunker guards are not protected like the farol's watchman: they can be beaten
  wrap('applyDamage', (base) => function applyDamageBunkerGuard(attacker, target, ...rest) {
    if (target && target.knightBBunkerGuard && target.secretVariant === 'lanternGuard' && isKnightBChapter() && selectedNormalArcadeLevel === 6) {
      const fallen = target.guardFallen;
      target.guardFallen = true;
      try {
        return base.call(this, attacker, target, ...rest);
      } finally {
        target.guardFallen = fallen;
      }
    }
    return base.call(this, attacker, target, ...rest);
  });
  const baseBallDraw = Fireball.prototype.draw;
  Fireball.prototype.draw = function drawFireballMaybeBizarre(...args) {
    if (this.attacker && this.attacker.knightBBizarre) return drawBizarreFireball(this);
    return baseBallDraw.apply(this, args);
  };
  const baseBallUpdate = Fireball.prototype.update;
  Fireball.prototype.update = function updateFireballMaybeBizarre(...args) {
    if (this.attacker && this.attacker.knightBBizarre) {
      this.age = (this.age || 0) + 1;
      if (typeof this.baseY !== 'number') this.baseY = this.position.y;
      this.baseY += this.drift || 0;
      this.position.y = this.baseY + Math.sin(this.age / 5) * 9;
    }
    return baseBallUpdate.apply(this, args);
  };
  const baseBeamDraw = FireBeam.prototype.draw;
  FireBeam.prototype.draw = function drawFireBeamMaybeBizarre(...args) {
    if (this.attacker && this.attacker.knightBBizarre) return drawBizarreFireBeam(this);
    return baseBeamDraw.apply(this, args);
  };
  wrap('applyDamage', (base) => function applyDamageBizarre(attacker, target, damage, options = {}, ...rest) {
    const dealt = base.call(this, attacker, target, damage, options, ...rest);
    if (attacker && attacker.knightBBizarre && options && options.isSpecial && target && target !== attacker) {
      target.icedVulnerableTimer = Math.max(target.icedVulnerableTimer || 0, 120);
      target.knightBBurn = 100;
      spawnKnightBSparks(target.position.x + target.width / 2, target.position.y + target.height / 2, 18, 1.2);
    }
    return dealt;
  });
  // the bridge to the farol: the same darkness, and the lights going out now and then
  wrap('drawFarolBridgeStage', (base) => function drawFarolBridgeStageWith5B(...args) {
    const result = base.apply(this, args);
    if (!isKnightBChapter()) return result;
    drawKnightBTravelNight();
    drawKnightBGloom(true);
    drawKnightBBlackout();
    return result;
  });
  // the sheriff's office: night instead of sunset, and the cells empty
  wrap('drawRobledalJailStage', (base) => function drawRobledalJailStageWith5B(...args) {
    const result = base.apply(this, args);
    if (!isKnightBChapter()) return result;
    drawKnightBNightOver();
    drawKnightBEmptyCells();
    drawKnightBGloom(true);
    return result;
  });
  wrap('drawVillageRoadStage', (base) => function drawVillageRoadStageWith5B(...args) {
    const result = base.apply(this, args);
    if (isKnightBChapter()) drawKnightBGloom(true);
    return result;
  });
  // the beast falls: no light, no rescue... the road goes on to the bridge
  wrap('finishFight', (base) => function finishFightWith5B(...args) {
    // (while the ending plays, nothing else may end the level)
    if (knightBEnding.active) return undefined;
    // (in the empty square, only reading the note ends the level)
    if (isKnightBChapter() && knightBSolo.active && knightBSolo.reading !== null && player2.health > 0) return undefined;
    if (isKnightBChapter() && selectedNormalArcadeLevel === 1 && !gameOver && player2.secretVariant === 'mossBeast' && player2.health <= 0 && player1.health > 0) {
      awardCoins(100);
      normalArcadeEnemiesRemaining -= 1;
      normalArcadeEnemyIndex += 1;
      robotShots = [];
      player2.mossRoots = [];
      knightBState.atBridge = true;
      configureKnightBEnemy();
      selectedMap = 'villageRoad';
      resetKeys();
      startKnightBVillageIntro();
      return undefined;
    }
    if (knightBFinale.active) return undefined;
    if (isKnightBChapter() && selectedNormalArcadeLevel === 6 && knightB6.phase === 'fight' && !gameOver && player2.knightBBunkerGuard && player2.health <= 0 && player1.health > 0 && normalArcadeEnemiesRemaining <= 0) {
      startKnightBFinale(() => base.apply(this, args));
      return undefined;
    }
    // the captain falls: the ending, before the victory screen
    if (isKnightBChapter() && selectedNormalArcadeLevel === 1 && !gameOver && !knightBEnding.active && !knightBEnding.shown && player2.secretVariant === 'darkKnightBoss' && player2.health <= 0 && player1.health > 0 && normalArcadeEnemiesRemaining <= 0) {
      knightBEnding.shown = true;
      startKnightBEnding(() => base.apply(this, args));
      return undefined;
    }
    return base.apply(this, args);
  });
  // every frame of the fight: Knight's breath, the remake's hum
  wrap('updateMonkeyCoconuts', (base) => function updateMonkeyCoconutsWith5B(...args) {
    const result = base.apply(this, args);
    if (isKnightBChapter()) drawKnightBDiscomfort();
    if (isKnightBChapter() && knightBSolo.active && knightBSolo.kind !== 'travel') updateKnightBSolo();
    if (isKnightBChapter() && knightBSolo.active && knightBSolo.kind === 'travel') {
      knightBSolo.frames += 1;
      player2.position.x = canvas.width + 600;
      player2.velocity.x = 0;
      updateKnightB6Travel();
    }
    if (isKnightBChapter() && selectedNormalArcadeLevel === 6 && knightB6.phase === 'fight' && knightB6.fade > 0) {
      knightB6.fade -= 1;
      ctx.fillStyle = `rgba(0, 0, 0, ${knightB6.fade / 50})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawKnightBBurns();
    if (isKnightBChapter()) updateKnightBRifts();
    if (isKnightBChapter()) drawKnightBSparks();
    syncKnightBRemake();
    return result;
  });
  // (and outside the fight the hum must stop too)
  setInterval(syncKnightBRemake, 250);

  // the empty square: the second fighter is not there at all
  const baseDraw = Fighter.prototype.draw;
  Fighter.prototype.draw = function drawUnlessAbsent(...args) {
    if (this === player2 && knightBSolo.active && isKnightBChapter()) return undefined;
    if (this.knightBBunkerGuard && this.secretVariant === 'lanternGuard' && isKnightBChapter() && selectedNormalArcadeLevel === 6 && !this.guardFallen) {
      const result = baseDraw.apply(this, args);
      drawKnightBBunkerGuard(this);
      return result;
    }
    if (this.knightBBizarre && this.characterType === 'fireMaster') {
      // (his Obsidian half: the black flame on his chest)
      const hadObsidian = this.obsidian;
      const hadControl = this.obsidianControl;
      this.obsidian = true;
      this.obsidianControl = true;
      const result = baseDraw.apply(this, args);
      this.obsidian = hadObsidian;
      this.obsidianControl = hadControl;
      drawBizarreOverlay(this, 1);
      return result;
    }
    return baseDraw.apply(this, args);
  };
  wrap('applyDamage', (base) => function applyDamageWith5B(attacker, target, ...rest) {
    if (target === player2 && knightBSolo.active && isKnightBChapter()) return 0;
    return base.call(this, attacker, target, ...rest);
  });
  wrap('returnToMenu', (base) => function returnToMenuWith5B(...args) {
    if (knightBFinale.active) finishKnightBFinale(true);
    if (knightBSolo.active) {
      knightBSolo.active = false;
      document.body.classList.remove('knightb-solo');
      stopKnightBWind();
    }
    return base.apply(this, args);
  });

  const card = document.getElementById('knightArcadeBChapterButton');
  if (card) card.addEventListener('click', () => openArcadeChapter('knightB', true));
  syncKnightBCard();
})();
