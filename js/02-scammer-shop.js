// Moquete - Tienda de Scammer (el basurero del menu)
// (parte 2 de 10; los archivos se cargan en orden desde index.html)

// ---------------- Scammer's shop (the dumpster in the title menu) ----------------
const scammerShopStorageKey = 'moqueteScammerShop';
const scammerShopGambleWinRate = 70;
const scammerShop = loadScammerShop();
const scammerShopItems = [
  {
    id: 'luckChip',
    name: 'Ficha de la Suerte [[AUTENTICA]]',
    description: 'Gambler empieza cada pelea con +10% de suerte. Bendecida por un experto (yo).',
    price: 2500,
    vendorLine: 'EXCELENTE ELECCION! ESA FICHA ES TAN REAL COMO MI TITULO DE ABOGADO!',
  },
  {
    id: 'goldWatch',
    name: 'Reloj de Oro 100% Oro',
    description: 'Un reloj de oro para lucir en el menu. Da la hora dos veces al dia, garantizado.',
    price: 6000,
    vendorLine: 'ORO PURO, KID! NO LO MOJES. NI LO MIRES MUCHO.',
  },
  {
    id: 'doubleCoin',
    name: 'Moneda Doble [[GARANTIZADA]]',
    description: 'Cada pelea que ganes te paga el doble de monedas. Una inversion SEGURA. Mas segura que el seguro.',
    price: 12000,
    vendorLine: 'DOBLE MONEDAS, KID! ES MATEMATICA SIMPLE: VOS GANAS, YO GANO, TODOS GANAMOS! (YO MAS)',
  },
  {
    id: 'pocketMedkit',
    name: 'Botiquin de Bolsillo [[MEDICO]]',
    description: 'Tu luchador (jugador 1) empieza cada pelea con +10 de vida maxima. Aprobado por un doctor (de peluche).',
    price: 5000,
    vendorLine: 'CURITAS DE PRIMERA CALIDAD! ...NO LAS USES PARA CORTES. NI PARA RASPONES.',
  },
  {
    id: 'coinMagnet',
    name: 'Iman de Monedas Industrial',
    description: 'Atrae 50 monedas extra cada vez que ganas una pelea. Se suma a la Moneda Doble.',
    price: 9000,
    vendorLine: 'ESE IMAN ATRAE MONEDAS, CLIENTES Y DEMANDAS JUDICIALES! DOS DE TRES NO ESTA MAL!',
  },
  {
    id: 'sunglasses',
    name: 'Anteojos de Sol [[DE DISENADOR]]',
    description: 'Los mismos que uso yo! Se lucen en el menu. Proteccion UV del 3%.',
    price: 4000,
    vendorLine: 'AHORA TENEMOS ESTILO, KID! AHORA SOMOS SOCIOS! (NO SOMOS SOCIOS)',
  },
  {
    id: 'worldTrophy',
    name: 'Trofeo de Campeon Mundial',
    description: 'Certificado por la Federacion Mundial de Peleas (no existe). Se luce en el menu.',
    price: 20000,
    vendorLine: 'FELICITACIONES, CAMPEON MUNDIAL! EL MUNDO NO LO SABE, PERO VOS SI!',
  },
  {
    id: 'plasticPlant',
    name: 'Planta 100% Natural',
    description: 'Una plantita decorativa para el menu. No necesita agua, luz ni ser una planta.',
    price: 1200,
    vendorLine: 'RIEGALA SOLO CON AGUA DE PLASTICO! JE JE JE.',
  },
  {
    id: 'mysteryBox',
    name: 'Caja Misteriosa [[PREMIUM]]',
    description: 'Puede tener CUALQUIER COSA adentro! Premios de hasta 5.000 monedas! Se puede comprar las veces que quieras.',
    price: 1500,
    repeatable: true,
    vendorLine: '',
  },
  {
    id: 'millionBill',
    name: 'Billete de 1.000.000',
    description: 'Un millon de monedas por solo 500! La oferta del siglo! Se puede comprar las veces que quieras.',
    price: 500,
    repeatable: true,
    vendorLine: 'ES UN BILLETE DE [[COLECCION]]! NO SE PUEDE GASTAR, SOLO ADMIRAR. JA JA JA!',
  },
  {
    id: 'extendedWarranty',
    name: 'Garantia Extendida',
    description: 'Extiende la garantia de todos tus productos. Se puede comprar las veces que quieras.',
    price: 2000,
    repeatable: true,
    vendorLine: 'LISTO! AHORA TU GARANTIA NO ES REAL POR EL DOBLE DE TIEMPO!',
  },
  {
    id: 'lifeInsurance',
    name: 'Seguro de Vida Premium',
    description: 'Proteccion total para vos y tu familia. Se puede comprar las veces que quieras.',
    price: 999,
    repeatable: true,
    vendorLine: 'GRACIAS POR SU COMPRA! ...EL SEGURO VENCIO HACE 5 MINUTOS. JE JE.',
  },
];
const scammerIntroLines = [
  { speaker: '???', text: '...Eh? EH?! ESPERA, ESPERA, ESPERA!' },
  { speaker: '???', text: 'Ese apostador con suerte... el que le gano al bufon... el que hasta conoce al mono...' },
  { speaker: 'SCAMMER', text: 'YA TENES LOS REQUISITOS?! EN SERIO?! NADIE LLEGA HASTA ACA!' },
  { speaker: 'SCAMMER', text: 'UN [[CLIENTE]]! UN CLIENTE DE VERDAD, CON MONEDAS DE VERDAD! HOY ES MI DIA DE [[SUERTE]]!' },
  { speaker: 'SCAMMER', text: 'Lo del winrate del 101%? JA JA JA! ERA UNA BROMA, KID! Nadie gana mas del 100%... ni siquiera yo. No te hacia falta.' },
  { speaker: 'SCAMMER', text: 'PASA, PASA! BIENVENIDO A MI HUMILDE, HONESTO Y 100% LEGAL NEGOCIO!' },
];
const scammerQuestions = [
  {
    question: 'Estos productos son originales?',
    answer: 'ORIGINALES? KID, SON TAN ORIGINALES QUE NI EL FABRICANTE SABE QUE EXISTEN! ...SIGUIENTE PREGUNTA.',
  },
  {
    question: 'Por que vivis en un contenedor de basura?',
    answer: 'NO ES UN CONTENEDOR, ES UN [[PENTHOUSE DE LUJO]] CON VISTA AL CALLEJON! EL ALQUILER ES GRATIS Y LOS VECINOS SON RATAS... DIGO, [[INVERSORES]].',
  },
  {
    question: 'Por que llevas esos lentes?',
    answer: 'SHHH! ACERCATE... HAY TIPOS AHI AFUERA CON LOS OJOS DE ESTE MISMO COLOR, ROSA Y AMARILLO, Y ME ESTAN [[CAZANDO]]. CON ESTOS LENTES ME HAGO PASAR POR UNO DE ELLOS! POR ESO ME ESCONDO EN EL CONTENEDOR: ACA NO ME ENCUENTRAN. ...BUENO, ESO Y UNOS [[PEQUENOS PROBLEMITAS]] EN MI CARRERA DE EMPRENDEDOR. NADA GRAVE! SOLO 47 DEMANDAS.',
  },
];
const scammerWelcomeBackLines = [
  'MI CLIENTE FAVORITO VOLVIO! TENGO OFERTAS [[NUEVAS]]! (SON LAS MISMAS)',
  'PASA, PASA! HOY TODO CON UN 0% DE DESCUENTO!',
  'OTRA VEZ VOS? ME ENCANTA LA GENTE CON MONEDAS!',
];
const scammerIntro = { index: 0, typed: 0, timer: null };

function loadScammerShop() {
  try {
    const saved = JSON.parse(localStorage.getItem('moqueteScammerShop') || 'null');
    return { met: Boolean(saved && saved.met), owned: (saved && typeof saved.owned === 'object' && saved.owned) || {} };
  } catch (error) {
    return { met: false, owned: {} };
  }
}

function saveScammerShop() {
  try {
    localStorage.setItem(scammerShopStorageKey, JSON.stringify(scammerShop));
  } catch (error) {
    // the shop still works for this session
  }
}

function getWinRateNumber(wins, losses) {
  const fights = wins + losses;
  return fights > 0 ? (wins / fights) * 100 : 0;
}

function getScammerShopRequirements() {
  const gamblerStats = persistentStatistics.characters.gambler || { wins: 0, losses: 0 };
  const gamblerRate = getWinRateNumber(gamblerStats.wins, gamblerStats.losses);
  const generalRate = getWinRateNumber(persistentStatistics.wins || 0, persistentStatistics.losses || 0);
  return [
    { text: `Tener un winrate mayor a ${scammerShopGambleWinRate}% con Gambler (actual: ${Math.round(gamblerRate)}%)`, done: gamblerRate > scammerShopGambleWinRate },
    { text: 'Pasarse el capitulo 3 de Arcade', done: Boolean(unlockedAchievements.gamblerArcadeCompleted) },
    { text: 'Desbloquear a Monkei', done: isMonkeyUnlocked() },
    // the joke requirement: impossible on purpose, never actually checked
    { text: `Tener un winrate general del 101% (actual: ${Math.round(generalRate)}%)`, done: false, joke: true },
  ];
}

function hideAllMenuScreens() {
  document.querySelectorAll('#mainMenu .menu-screen').forEach((screen) => screen.classList.add('hidden'));
}

function openScammerDumpster() {
  const requirements = getScammerShopRequirements();
  const ready = requirements.every((requirement) => requirement.joke || requirement.done);
  if (!scammerShop.met && !ready) {
    const lines = requirements.map((requirement) => `- ${requirement.text} ${requirement.joke ? '' : requirement.done ? '(LISTO)' : '(pendiente)'}`.trim());
    window.alert(`Este contenedor esta bloqueado. Requisitos:\n\n${lines.join('\n')}`);
    return;
  }
  playSound('dumpsterRattle');
  if (!scammerShop.met) {
    startScammerIntro();
    return;
  }
  openScammerShop(scammerWelcomeBackLines[Math.floor(Math.random() * scammerWelcomeBackLines.length)]);
}

function startScammerIntro() {
  hideAllMenuScreens();
  scammerIntroScreen.classList.remove('hidden');
  scammerIntro.index = 0;
  showScammerIntroLine();
}

function showScammerIntroLine() {
  const line = scammerIntroLines[scammerIntro.index];
  scammerIntroSpeaker.innerText = line.speaker;
  scammerIntroText.innerText = '';
  scammerIntro.typed = 0;
  scammerIntroScreen.classList.add('talking');
  if (scammerIntro.index === 0) playSound('dumpsterBurst');
  if (scammerIntro.index === 2) playSound('cutsceneSurprise');
  if (scammerIntro.index === 3) playSound('cutsceneCash');
  if (scammerIntro.index === 4) playSound('cutsceneLaugh');
  clearInterval(scammerIntro.timer);
  scammerIntro.timer = setInterval(() => {
    scammerIntro.typed += 1;
    scammerIntroText.innerText = line.text.slice(0, scammerIntro.typed);
    if (scammerIntro.typed % 2 === 0 && line.text[scammerIntro.typed - 1] !== ' ') playSound('cutsceneBlip', { speaker: 'scammer' });
    if (scammerIntro.typed >= line.text.length) {
      clearInterval(scammerIntro.timer);
      scammerIntro.timer = null;
      scammerIntroScreen.classList.remove('talking');
    }
  }, 28);
}

function advanceScammerIntro() {
  const line = scammerIntroLines[scammerIntro.index];
  if (scammerIntro.timer) {
    clearInterval(scammerIntro.timer);
    scammerIntro.timer = null;
    scammerIntroText.innerText = line.text;
    scammerIntroScreen.classList.remove('talking');
    return;
  }
  if (scammerIntro.index + 1 < scammerIntroLines.length) {
    scammerIntro.index += 1;
    playSound('menuMove');
    showScammerIntroLine();
    return;
  }
  finishScammerIntro();
}

function finishScammerIntro() {
  clearInterval(scammerIntro.timer);
  scammerIntro.timer = null;
  scammerShop.met = true;
  saveScammerShop();
  scammerIntroScreen.classList.add('hidden');
  openScammerShop('BIENVENIDO! MIRA, TOCA, COMPRA! (MAS QUE NADA COMPRA)');
}

function renderScammerShop() {
  shopItemsContainer.innerHTML = '';
  scammerShopItems.forEach((item) => {
    const owned = Boolean(scammerShop.owned[item.id]) && !item.repeatable;
    const card = document.createElement('div');
    card.className = `shop-item${owned ? ' owned' : ''}`;
    const icon = document.createElement('span');
    icon.className = `shop-icon icon-${item.id}`;
    const title = document.createElement('strong');
    title.innerText = item.name;
    const description = document.createElement('p');
    description.innerText = item.description;
    const price = document.createElement('span');
    price.className = 'shop-price';
    price.innerText = `${item.price.toLocaleString('es-ES')} monedas`;
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = owned ? 'COMPRADO' : 'COMPRAR';
    button.disabled = owned;
    button.addEventListener('click', () => buyScammerShopItem(item));
    card.append(icon, title, description, price, button);
    shopItemsContainer.appendChild(card);
  });
  syncCoinWalletUI();
}

const shopTalk = { timer: null, typed: 0 };

function scammerShopSay(text, mood = 'talking') {
  clearInterval(shopTalk.timer);
  shopTalk.typed = 0;
  shopVendorLine.innerText = '';
  shopScammer.classList.remove('talking', 'hyped');
  shopScammer.classList.add(mood);
  shopTalk.timer = setInterval(() => {
    shopTalk.typed += 1;
    shopVendorLine.innerText = text.slice(0, shopTalk.typed);
    if (shopTalk.typed % 2 === 0 && text[shopTalk.typed - 1] !== ' ') playSound('cutsceneBlip', { speaker: 'scammer' });
    if (shopTalk.typed >= text.length) {
      clearInterval(shopTalk.timer);
      shopTalk.timer = null;
      setTimeout(() => {
        if (!shopTalk.timer) shopScammer.classList.remove('talking', 'hyped');
      }, 500);
    }
  }, 24);
}

// Shop music: a cheesy lounge loop on the synth music bus.
const shopMusic = { timer: null, step: 0 };

function playShopMusicStep() {
  if (!audioContext) return;
  const step = shopMusic.step % 32;
  const chords = [
    [349, 440, 523, 659],
    [294, 370, 440, 523],
    [392, 494, 587, 698],
    [262, 330, 392, 494],
  ];
  const bass = [87, 98, 110, 131, 73, 87, 110, 92, 98, 110, 123, 147, 65, 82, 98, 123];
  const melody = [698, 0, 659, 587, 523, 0, 587, 659, 0, 740, 0, 587, 494, 0, 440, 0, 784, 0, 740, 659, 587, 0, 523, 494, 523, 0, 659, 0, 523, 0, 0, 0];
  const bar = Math.floor(step / 8);
  if (step % 8 === 0) playChord(chords[bar], { duration: 0.5, type: 'triangle', volume: 0.02, destination: musicGain });
  if (step % 8 === 3) playChord(chords[bar], { duration: 0.14, type: 'triangle', volume: 0.014, destination: musicGain });
  if (step % 2 === 0) playTone({ frequency: bass[step / 2], duration: 0.2, type: 'sine', volume: 0.07, destination: musicGain });
  if (melody[step]) playTone({ frequency: melody[step], duration: 0.16, type: step % 4 === 0 ? 'square' : 'triangle', volume: 0.03, destination: musicGain });
  if (step % 4 === 2) playHat({ volume: 0.02, destination: musicGain });
  if (step % 8 === 4) playSnare({ volume: 0.02, destination: musicGain });
  shopMusic.step += 1;
}

function startShopMusic() {
  if (!ensureAudio() || shopMusic.timer) return;
  stopMenuMusic();
  shopMusic.step = 0;
  playShopMusicStep();
  shopMusic.timer = setInterval(playShopMusicStep, 190);
}

function stopShopMusic() {
  if (!shopMusic.timer) return;
  clearInterval(shopMusic.timer);
  shopMusic.timer = null;
}

function openScammerShop(vendorLine) {
  hideAllMenuScreens();
  scammerShopScreen.classList.remove('hidden');
  renderScammerShop();
  scammerShopScreen.scrollTop = 0;
  startShopMusic();
  scammerShopSay(vendorLine);
}

function closeScammerShop() {
  hideScammerQuestions();
  clearInterval(shopTalk.timer);
  shopTalk.timer = null;
  stopShopMusic();
  scammerShopScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
  syncShopBadges();
  startMenuMusic();
}

function buyScammerShopItem(item) {
  if (scammerShop.owned[item.id] && !item.repeatable) return;
  if (coinWallet.balance < item.price) {
    scammerShopSay('EH, EH! NO TE ALCANZA, KID! VOLVE CUANDO SEAS UN [[BIG SHOT]] DE VERDAD.');
    playSound('cutsceneAngry');
    return;
  }
  coinWallet.balance -= item.price;
  saveCoinWallet();
  scammerShop.owned[item.id] = (Number(scammerShop.owned[item.id]) || 0) + 1;
  saveScammerShop();
  hideScammerQuestions();
  scammerShopSay(item.id === 'mysteryBox' ? openMysteryBox() : item.vendorLine, 'hyped');
  playSound('cutsceneCash');
  if (item.repeatable) setTimeout(() => playSound('cutsceneLaugh'), 350);
  renderScammerShop();
  syncShopBadges();
}

function openMysteryBox() {
  const roll = Math.random();
  if (roll < 0.05) {
    awardCoins(5000);
    return 'NO... NO PUEDE SER! TE TOCO EL PREMIO MAYOR: 5.000 MONEDAS! ...ESO NO DEBERIA PASAR NUNCA.';
  }
  if (roll < 0.3) {
    awardCoins(700);
    return 'TE TOCO... UN CUPON DE REEMBOLSO PARCIAL! 700 MONEDAS DE VUELTA! QUE SUERTE, KID!';
  }
  const nothing = [
    'TE TOCO... AIRE PREMIUM ENVASADO AL VACIO! FELICITACIONES!',
    'TE TOCO... OTRA CAJA MISTERIOSA! (VACIA)',
    'TE TOCO... MI AGRADECIMIENTO! ES INVALUABLE! (VALE 0)',
  ];
  return nothing[Math.floor(Math.random() * nothing.length)];
}

function showScammerQuestions() {
  shopQuestions.innerHTML = '';
  scammerQuestions.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = entry.question;
    button.addEventListener('click', () => {
      hideScammerQuestions();
      playSound('menuMove');
      scammerShopSay(entry.answer);
    });
    shopQuestions.appendChild(button);
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.innerText = 'Nada, gracias';
  close.addEventListener('click', () => {
    hideScammerQuestions();
    scammerShopSay('NADA? NADA ES CARO, KID! PERO PARA VOS... TAMBIEN ES CARO.');
  });
  shopQuestions.appendChild(close);
  shopQuestions.classList.remove('hidden');
}

function hideScammerQuestions() {
  shopQuestions.classList.add('hidden');
}

function talkToShopScammer() {
  if (!shopQuestions.classList.contains('hidden')) {
    hideScammerQuestions();
    return;
  }
  playSound('cutsceneQuestion');
  scammerShopSay('QUE QUERES SABER, KID? PREGUNTA, PREGUNTA! LAS PREGUNTAS SON GRATIS! (POR AHORA)');
  showScammerQuestions();
}

function syncShopBadges() {
  if (!menuShopBadges) return;
  menuShopBadges.innerHTML = '';
  const badges = [
    ['goldWatch', 'shop-badge watch', 'Reloj de Oro 100% Oro'],
    ['sunglasses', 'shop-badge icon sunglasses', 'Anteojos de Sol [[DE DISENADOR]]'],
    ['worldTrophy', 'shop-badge icon trophy', 'Trofeo de Campeon Mundial'],
    ['plasticPlant', 'shop-badge icon plant', 'Planta 100% Natural'],
  ];
  badges.forEach(([id, className, title]) => {
    if (!scammerShop.owned[id]) return;
    const badge = document.createElement('span');
    badge.className = className;
    badge.title = title;
    menuShopBadges.appendChild(badge);
  });
}

function applyShopPerks() {
  // the medkit only helps the buyer (player 1) and is applied once per max-health reset
  if (scammerShop.owned.pocketMedkit && !player1.shopHealthBonus) {
    player1.shopHealthBonus = 10;
    player1.maxHealth += 10;
    player1.health = player1.maxHealth;
    updateHealthBars();
  }
  if (!scammerShop.owned.luckChip) return;
  [player1, player2].forEach((fighter) => {
    if (fighter.characterType === 'gambler' && !fighter.secretVariant) {
      fighter.gamblerLuckBonus = Math.max(fighter.gamblerLuckBonus, 0.1);
    }
  });
}

