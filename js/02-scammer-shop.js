// Moquete - Tienda de Scammer (el basurero del menu)
// (parte 2 de 10; los archivos se cargan en orden desde index.html)

// ---------------- Scammer's shop (the dumpster in the title menu) ----------------
const scammerShopStorageKey = 'moqueteScammerShop';
const scammerShopGambleWinRate = 70;
const scammerShop = loadScammerShop();
// one-time reset: the Maquina Rara goes back to Scammer's shop so it can be won again in the harder challenge
try {
  if (!localStorage.getItem('moqueteRareMachineReset1')) {
    delete scammerShop.owned.rareMachine;
    localStorage.setItem('moqueteRareMachineReset1', '1');
    localStorage.setItem(scammerShopStorageKey, JSON.stringify(scammerShop));
  }
} catch (error) {
  // storage blocked: nothing to reset
}
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
  // cosmetics and extras for the menu and the fighters (the ones with a switch can be turned off in Ajustes)
  {
    id: 'neonPaint',
    name: 'Pack de Pintura Neon [[RADIOACTIVA]]',
    description: '4 colores neon nuevos para tus luchadores (en Ajustes). Brillan en la oscuridad. (No brillan.)',
    price: 7500,
    vendorLine: 'PINTURA NEON, KID! NO LA TOQUES CON LA MANO. NI CON LOS OJOS.',
  },
  {
    id: 'jewelPaint',
    name: 'Coleccion de Joyas [[REALES]]',
    description: 'Platino, Rubi, Esmeralda y Zafiro para los colores de tus luchadores (en Ajustes). Joyas de verdad, derretidas por mi.',
    price: 14000,
    vendorLine: 'JOYAS AUTENTICAS! LAS SAQUE DE UNA MINA! ...DE UNA MAQUINA DE CHICLES, PERO UNA MINA AL FIN.',
  },
  {
    id: 'casinoTheme',
    name: 'Tema "Noche de Casino" para el Menu',
    description: 'El menu se viste de casino: luces, dorado y purpura. Se puede apagar en Ajustes.',
    price: 10000,
    vendorLine: 'AHORA TU MENU PARECE UN CASINO! Y ACORDATE: LA CASA SIEMPRE GANA... Y LA CASA SOY YO!',
  },
  {
    id: 'neonSign',
    name: 'Cartel de Neon "MOQUETE"',
    description: 'El titulo del menu brilla como un cartel de neon. Titila un poco: es parte del encanto (esta roto).',
    price: 6500,
    vendorLine: 'MIRA COMO BRILLA! SI EMPIEZA A ECHAR CHISPAS, ES UNA FUNCION [[PREMIUM]].',
  },
  {
    id: 'loungeRadio',
    name: 'Radio del Contenedor',
    description: 'Una radio al costado del menu: elegi la musica del menu (la de siempre, mi lounge exclusivo o cualquier enlace que pegues).',
    price: 8000,
    vendorLine: 'AHORA MI MUSICA TE SIGUE A TODOS LADOS! COMO YO! JE JE JE.',
  },
  {
    id: 'plasticCrown',
    name: 'Corona de Rey [[ORO MACIZO]]',
    description: 'Tu luchador (jugador 1) pelea con una corona en la cabeza. Es de plastico. De plastico DORADO.',
    price: 11000,
    vendorLine: 'LARGA VIDA AL REY! (EL REY DEBE ESTAR ATENTO: SE CAE CON EL VIENTO)',
  },
  {
    id: 'victoryConfetti',
    name: 'Confeti de Victoria',
    description: 'Cada vez que ganas una pelea (jugador 1) llueve confeti. Biodegradable? Tal vez.',
    price: 5500,
    vendorLine: 'CONFETI PARA FESTEJAR! LO JUNTE DEL PISO DE UNA FIESTA. BUENO, DE VARIAS.',
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
  {
    id: 'fortuneCookie',
    name: 'Galleta de la Fortuna',
    description: 'Una galletita con un papelito adentro que predice tu futuro. 100% precisa. Se puede comprar las veces que quieras.',
    price: 88,
    repeatable: true,
    vendorLine: '',
  },
  // new stock (after chapter 5)
  {
    id: 'rubberDuck',
    name: 'Pato de Goma [[DE COMBATE]]',
    description: 'Un patito de goma para el menu. Tocalo y hace cuac. Entrenado en artes marciales (no).',
    price: 3500,
    vendorLine: 'CUAC! ...PERDON, ME EMOCIONE. ESE PATO SOBREVIVIO A TRES BAÑERAS, KID!',
  },
  {
    id: 'bottledAir',
    name: 'Aire Embotellado de Valdoria',
    description: 'Aire autentico del Castillo de Valdoria, cosechado a mano por caballeros. Para lucir en el menu. NO ABRIR.',
    price: 8500,
    vendorLine: 'AIRE DE CASTILLO, KID! SI LO ABRIS SE ESCAPA LA [[MAGIA]]. ...Y EL AIRE. QUE ES LO MISMO.',
  },
  {
    id: 'scammerPoster',
    name: 'Poster Autografiado de Scammer',
    description: 'Un poster mio, firmado por mi, para la pared del menu. Algun dia va a valer millones. Hoy vale esto.',
    price: 15000,
    vendorLine: 'AHORA ME PODES MIRAR CUANDO QUIERAS! YO TAMBIEN TE VOY A ESTAR MIRANDO. SIEMPRE. JE JE.',
  },
  {
    id: 'moqueteBook',
    name: 'La Historia de Moquete',
    description: 'EL libro definitivo: TODA la historia de Moquete, desde el primer golpe hasta el ultimo farol, contada con lujo de detalles. Edicion de tapa dura.',
    price: 100000,
    vendorLine: 'UNA OBRA MAESTRA, KID! LLORE ESCRIBIENDOLA... DIGO, LEYENDOLA! LEYENDOLA! NO LA DES VUELTA.',
  },
  // only while Scammer is angry with you (after beating NEO SCAMMER): the way to make up with him
  {
    id: 'apologyGift',
    name: 'Ramo de Billetes [[DE DISCULPA]]',
    description: 'Un regalo para Scammer, para que se le pase el enojo. Dicen que nada lo pone mas feliz que la plata.',
    price: 30000,
    repeatable: true,
    grudgeOnly: true,
    vendorLine: '',
  },
  // does nothing yet (it will, later)
  {
    id: 'rareMachine',
    name: 'Maquina Rara',
    description: 'Ni yo se que es esto. Hace ruiditos, a veces brilla y esta llena de minerales rarisimos que no vi nunca en ningun lado. Por eso vale lo que vale. NO HAY DEVOLUCIONES.',
    price: 9999999,
    vendorLine: '...LA COMPRASTE?! DE VERDAD?! ...ESTEEE... BUENO! SI EMPIEZA A HABLAR, NO ME LLAMES!',
  },
];
// shop extras that can be switched on and off in Ajustes (all on right after buying them)
const shopToggleExtras = [
  { id: 'casinoTheme', label: 'Tema Noche de Casino' },
  { id: 'neonSign', label: 'Cartel de neon en el titulo' },
  { id: 'plasticCrown', label: 'Corona de Rey (jugador 1)' },
  { id: 'victoryConfetti', label: 'Confeti de victoria (jugador 1)' },
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
  {
    question: 'Cuanta plata tenes?',
    answer: 'EXACTAMENTE? 3 MONEDAS, UN BOTON Y UN CHICLE... DIGO! MILLONES! BILLONES! TENGO TANTA PLATA QUE LA GUARDO EN OTRA DIMENSION! ...EL CHICLE ESTA SIN USAR, POR SI TE INTERESA. 500 MONEDAS.',
  },
  {
    question: 'Escribiste vos el libro de Moquete?',
    answer: 'QUE LIBRO? NO SE DE QUE ME HABLAS. YO NO SE ESCRIBIR. ...Y SI SUPIERA, SERIA UN [[BEST SELLER]]. LEISTE LA CONTRATAPA? NO LA LEAS.',
  },
  {
    question: 'Tenes amigos?',
    answer: 'CLARO! MUCHISIMOS! LAS RATAS DEL CALLEJON, MIS 47 ABOGADOS... Y VOS! VOS SOS MI AMIGO, NO? LOS AMIGOS SE HACEN DESCUENTOS. VOS A MI. NO AL REVES.',
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
    return {
      met: Boolean(saved && saved.met),
      owned: (saved && typeof saved.owned === 'object' && saved.owned) || {},
      toggles: (saved && typeof saved.toggles === 'object' && saved.toggles) || {},
      // Radio del Contenedor: 'menu', 'lounge' or one of the saved links
      radioChoice: (saved && typeof saved.radioChoice === 'string' && saved.radioChoice) || 'lounge',
      radioLinks: (saved && Array.isArray(saved.radioLinks) && saved.radioLinks.filter((link) => link && typeof link.url === 'string')) || [],
      // angry with you after you beat NEO SCAMMER: everything costs double until you make up with him
      grudge: Boolean(saved && saved.grudge),
    };
  } catch (error) {
    return { met: false, owned: {}, toggles: {}, radioChoice: 'lounge', radioLinks: [] };
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

// while Scammer holds a grudge everything costs double (except the gift to make up with him)
function getShopPrice(item) {
  return scammerShop.grudge && !item.grudgeOnly ? item.price * 2 : item.price;
}

function renderScammerShop() {
  shopItemsContainer.innerHTML = '';
  scammerShopScreen.classList.toggle('shop-grudge', scammerShop.grudge);
  if (scammerShop.grudge) {
    const banner = document.createElement('div');
    banner.className = 'shop-grudge-banner';
    banner.innerText = 'PRECIOS DE [[RENCOR]]: TODO CUESTA EL DOBLE. (Scammer sigue enojado por lo de NEO SCAMMER...)';
    shopItemsContainer.appendChild(banner);
  }
  scammerShopItems.forEach((item) => {
    if (item.grudgeOnly && !scammerShop.grudge) return;
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
    price.innerText = `${getShopPrice(item).toLocaleString('es-ES')} monedas`;
    if (getShopPrice(item) !== item.price) {
      const oldPrice = document.createElement('s');
      oldPrice.className = 'shop-old-price';
      oldPrice.innerText = ` ${item.price.toLocaleString('es-ES')}`;
      price.appendChild(oldPrice);
    }
    if (item.grudgeOnly) card.classList.add('shop-gift');
    const button = document.createElement('button');
    button.type = 'button';
    // once you own the Maquina Rara its button offers a rematch against Scammer
    const rematch = owned && item.id === 'rareMachine';
    const readable = owned && item.id === 'moqueteBook';
    button.innerText = rematch ? 'REVANCHA' : readable ? 'LEER' : owned ? 'COMPRADO' : 'COMPRAR';
    button.disabled = owned && !rematch && !readable;
    if (rematch) button.classList.add('shop-rematch');
    button.addEventListener('click', () => (readable ? openMoqueteBook() : buyScammerShopItem(item)));
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
  shopScammer.classList.remove('talking', 'hyped', 'furious');
  shopScammer.classList.add(mood);
  shopTalk.timer = setInterval(() => {
    shopTalk.typed += 1;
    shopVendorLine.innerText = text.slice(0, shopTalk.typed);
    if (shopTalk.typed % 2 === 0 && text[shopTalk.typed - 1] !== ' ') playSound('cutsceneBlip', { speaker: 'scammer' });
    if (shopTalk.typed >= text.length) {
      clearInterval(shopTalk.timer);
      shopTalk.timer = null;
      setTimeout(() => {
        if (!shopTalk.timer) shopScammer.classList.remove('talking', 'hyped', 'furious');
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

const scammerGrudgeLines = [
  'VOS?! OTRA VEZ VOS?! FUERA DE MI TIENDA! ...BUENO, SI VAS A COMPRAR, AHORA TODO CUESTA EL [[DOBLE]].',
  'NO TE QUIERO ACA, KID! ME ROMPISTE LA ARMADURA! ...PRECIOS DE [[RENCOR]]: TODO X2.',
  'MIRA QUIEN VOLVIO... EL LADRON DE MAQUINAS! TE COBRO EL DOBLE Y ES POCO!',
  'ANDATE! ...NO, ESPERA, TENES MONEDAS? ENTONCES QUEDATE. PERO PAGAS EL [[DOBLE]].',
];

function openScammerShop(vendorLine) {
  hideAllMenuScreens();
  scammerShopScreen.classList.remove('hidden');
  renderScammerShop();
  scammerShopScreen.scrollTop = 0;
  startShopMusic();
  if (scammerShop.grudge) {
    scammerShopSay(scammerGrudgeLines[Math.floor(Math.random() * scammerGrudgeLines.length)], 'furious');
    playSound('cutsceneAngry');
    return;
  }
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
  if (item.id === 'rareMachine' && scammerShop.owned.rareMachine) {
    startScamRematch();
    return;
  }
  if (scammerShop.owned[item.id] && !item.repeatable) return;
  const price = getShopPrice(item);
  if (coinWallet.balance < price) {
    if (item.id === 'rareMachine') {
      insistOnRareMachine();
      return;
    }
    scammerShopSay('EH, EH! NO TE ALCANZA, KID! VOLVE CUANDO SEAS UN [[BIG SHOT]] DE VERDAD.');
    playSound('cutsceneAngry');
    return;
  }
  coinWallet.balance -= price;
  saveCoinWallet();
  if (item.id === 'apologyGift') {
    // he cries, forgives you and forgets everything
    scammerShop.grudge = false;
    saveScammerShop();
    hideScammerQuestions();
    scammerShopSay('PARA MI?! ...*SNIF* ...NADIE ME HABIA REGALADO NADA NUNCA... OLVIDEMOS TODO, KID! PRECIOS NORMALES OTRA VEZ! (POR AHORA)', 'hyped');
    playSound('cutsceneCash');
    setTimeout(() => playSound('achievement'), 400);
    renderScammerShop();
    syncShopBadges();
    return;
  }
  scammerShop.owned[item.id] = (Number(scammerShop.owned[item.id]) || 0) + 1;
  saveScammerShop();
  hideScammerQuestions();
  scammerShopSay(item.id === 'mysteryBox' ? openMysteryBox() : item.id === 'fortuneCookie' ? openFortuneCookie() : item.vendorLine, 'hyped');
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
  scammerShopSay(scammerShop.grudge ? 'QUE QUERES AHORA?! ...PREGUNTA RAPIDO Y ANDATE.' : 'QUE QUERES SABER, KID? PREGUNTA, PREGUNTA! LAS PREGUNTAS SON GRATIS! (POR AHORA)', scammerShop.grudge ? 'furious' : 'talking');
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
    ['rareMachine', 'shop-badge icon machine', 'Maquina Rara (que hace esto?)'],
    ['rubberDuck', 'shop-badge icon duck', 'Pato de Goma (tocalo)'],
    ['bottledAir', 'shop-badge icon bottle', 'Aire Embotellado de Valdoria'],
    ['scammerPoster', 'shop-badge icon poster', 'Poster Autografiado de Scammer'],
    ['moqueteBook', 'shop-badge icon book', 'La Historia de Moquete (tocalo para leer)'],
  ];
  badges.forEach(([id, className, title]) => {
    if (!scammerShop.owned[id]) return;
    const badge = document.createElement('span');
    badge.className = className;
    badge.title = title;
    // the duck quacks and the book opens
    if (id === 'rubberDuck' || id === 'moqueteBook') {
      badge.classList.add('clickable');
      badge.addEventListener('click', (event) => {
        event.stopPropagation();
        if (id === 'rubberDuck') quackRubberDuck(badge);
        else openMoqueteBook();
      });
    }
    menuShopBadges.appendChild(badge);
  });
  syncShopUnlocks();
}

function isShopExtraOn(id) {
  return Boolean(scammerShop.owned[id]) && scammerShop.toggles[id] !== false;
}

// shows the colors and switches the player owns, and applies the menu extras
function syncShopUnlocks() {
  document.querySelectorAll('[data-shop-item]').forEach((element) => {
    element.classList.toggle('hidden', !scammerShop.owned[element.dataset.shopItem]);
  });
  const extrasRow = document.getElementById('shopExtrasSetting');
  if (extrasRow) extrasRow.classList.toggle('hidden', !shopToggleExtras.some((extra) => scammerShop.owned[extra.id]));
  document.querySelectorAll('[data-shop-toggle]').forEach((input) => {
    input.checked = isShopExtraOn(input.dataset.shopToggle);
  });
  document.body.classList.toggle('shop-theme-casino', isShopExtraOn('casinoTheme'));
  document.body.classList.toggle('shop-neon-logo', isShopExtraOn('neonSign'));
  if (typeof shopRadioButton !== 'undefined' && shopRadioButton) {
    shopRadioButton.classList.toggle('hidden', !scammerShop.owned.loungeRadio);
    if (!scammerShop.owned.loungeRadio) shopRadioPanel.classList.add('hidden');
  }
}

function setShopExtra(id, on) {
  scammerShop.toggles[id] = on;
  saveScammerShop();
  syncShopUnlocks();
}

// ---------------- Radio del Contenedor: picks the menu music ----------------
const shopRadioPlayer = { audio: null, frame: null, url: null };

// what the menu should play: 'menu' (the original tune), 'lounge' (the shop's) or a saved link
function getShopRadioChoice() {
  if (!scammerShop.owned.loungeRadio) return 'menu';
  const choice = scammerShop.radioChoice || 'lounge';
  if (choice === 'menu' || choice === 'lounge') return choice;
  return scammerShop.radioLinks.some((link) => link.url === choice) ? choice : 'menu';
}

function getYouTubeId(url) {
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function getShopRadioLinkName(url) {
  const youTubeId = getYouTubeId(url);
  if (youTubeId) return `YouTube (${youTubeId})`;
  const file = decodeURIComponent(String(url).split(/[?#]/)[0].split('/').pop() || url);
  return file.length > 40 ? `${file.slice(0, 37)}...` : file;
}

function getShopRadioVolume() {
  return Math.min(1, 0.8 * audioSettings.master * audioSettings.music);
}

function startShopRadioTrack(url) {
  if (shopRadioPlayer.url === url && (shopRadioPlayer.frame || (shopRadioPlayer.audio && !shopRadioPlayer.audio.paused))) return;
  stopShopRadioTrack();
  shopRadioPlayer.url = url;
  const youTubeId = getYouTubeId(url);
  if (youTubeId) {
    // YouTube can only play inside its own player: a hidden embed that loops the video
    const frame = document.createElement('iframe');
    frame.className = 'shop-radio-frame';
    frame.allow = 'autoplay; encrypted-media';
    frame.src = `https://www.youtube.com/embed/${youTubeId}?autoplay=1&loop=1&playlist=${youTubeId}&controls=0`;
    document.body.appendChild(frame);
    shopRadioPlayer.frame = frame;
    setShopRadioStatus('Sonando desde YouTube (necesita internet).');
    return;
  }
  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = getShopRadioVolume();
  audio.addEventListener('error', () => {
    if (shopRadioPlayer.audio === audio) setShopRadioStatus('No se pudo reproducir ese enlace. Proba con un mp3/ogg directo.', true);
  });
  shopRadioPlayer.audio = audio;
  const playPromise = audio.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

function stopShopRadioTrack() {
  if (shopRadioPlayer.audio) {
    shopRadioPlayer.audio.pause();
    shopRadioPlayer.audio = null;
  }
  if (shopRadioPlayer.frame) {
    shopRadioPlayer.frame.remove();
    shopRadioPlayer.frame = null;
  }
  shopRadioPlayer.url = null;
}

function setShopRadioStatus(text, isError = false) {
  if (!shopRadioStatus) return;
  shopRadioStatus.innerText = text;
  shopRadioStatus.classList.toggle('error', isError);
}

function selectShopRadioChoice(choice) {
  scammerShop.radioChoice = choice;
  saveScammerShop();
  setShopRadioStatus('');
  renderShopRadioPanel();
  // swap the menu music right away
  stopMenuMusic();
  stopShopMusic();
  startMenuMusic();
  playSound('menuSelect');
}

function addShopRadioLink() {
  const url = shopRadioLinkInput.value.trim();
  if (!url) return;
  if (!/^(https?:\/\/|file:|[\w./ -]+\.(mp3|ogg|wav|m4a|webm)$)/i.test(url) && !getYouTubeId(url)) {
    setShopRadioStatus('Eso no parece un enlace de musica.', true);
    return;
  }
  if (!scammerShop.radioLinks.some((link) => link.url === url)) {
    scammerShop.radioLinks.unshift({ url, name: getShopRadioLinkName(url) });
    scammerShop.radioLinks = scammerShop.radioLinks.slice(0, 20);
  }
  shopRadioLinkInput.value = '';
  selectShopRadioChoice(url);
}

function removeShopRadioLink(url) {
  scammerShop.radioLinks = scammerShop.radioLinks.filter((link) => link.url !== url);
  if (scammerShop.radioChoice === url) {
    selectShopRadioChoice('menu');
    return;
  }
  saveScammerShop();
  renderShopRadioPanel();
}

function renderShopRadioPanel() {
  if (!shopRadioList) return;
  shopRadioList.innerHTML = '';
  const choice = getShopRadioChoice();
  const addRow = (label, value, removable) => {
    const row = document.createElement('div');
    row.className = `shop-radio-row${choice === value ? ' selected' : ''}`;
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'shop-radio-pick';
    pick.innerText = `${choice === value ? '> ' : ''}${label}`;
    pick.title = value;
    pick.addEventListener('click', () => selectShopRadioChoice(value));
    row.appendChild(pick);
    if (removable) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'shop-radio-remove';
      remove.innerText = 'X';
      remove.title = 'Borrar este enlace';
      remove.addEventListener('click', () => removeShopRadioLink(value));
      row.appendChild(remove);
    }
    shopRadioList.appendChild(row);
  };
  scammerShop.radioLinks.forEach((link) => addRow(link.name || getShopRadioLinkName(link.url), link.url, true));
  addRow('Musica del menu', 'menu', false);
  addRow('Lounge de la tienda', 'lounge', false);
}

function toggleShopRadioPanel() {
  const opening = shopRadioPanel.classList.contains('hidden');
  shopRadioPanel.classList.toggle('hidden', !opening);
  if (opening) {
    renderShopRadioPanel();
    startMenuMusic();
  }
  playSound('menuMove');
}

shopRadioButton.addEventListener('click', toggleShopRadioPanel);
document.getElementById('shopRadioClose').addEventListener('click', () => shopRadioPanel.classList.add('hidden'));
document.getElementById('shopRadioAdd').addEventListener('click', addShopRadioLink);
shopRadioLinkInput.addEventListener('keydown', (event) => {
  event.stopPropagation();
  if (event.key === 'Enter') addShopRadioLink();
});

// confetti over the victory screen
function launchShopConfetti() {
  const layer = document.createElement('div');
  layer.className = 'shop-confetti';
  const colors = ['#fdd835', '#ef5350', '#42a5f5', '#66bb6a', '#ab47bc', '#ff4081'];
  for (let piece = 0; piece < 80; piece += 1) {
    const bit = document.createElement('span');
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[piece % colors.length];
    bit.style.animationDelay = `${Math.random() * 1.2}s`;
    bit.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
    bit.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
    bit.style.setProperty('--spin', `${Math.random() > 0.5 ? 1 : -1}`);
    layer.appendChild(bit);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 4200);
}

document.querySelectorAll('[data-shop-toggle]').forEach((input) => {
  input.addEventListener('change', () => setShopExtra(input.dataset.shopToggle, input.checked));
});

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

// ---------------- Scammer's challenge ----------------
// asking for the Maquina Rara without the coins: he gets angrier every time, and the fifth time he challenges you
let scamMachineInsist = 0;

function insistOnRareMachine() {
  scamMachineInsist += 1;
  const step = Math.min(scamMachineInsistLines.length, scamMachineInsist) - 1;
  hideScammerQuestions();
  scammerShopSay(scamMachineInsistLines[step], step >= 2 ? 'furious' : 'talking');
  scammerShopScreen.classList.remove('shop-shake');
  void scammerShopScreen.offsetWidth;
  if (step >= 1) scammerShopScreen.classList.add('shop-shake');
  playSound('cutsceneAngry');
  if (step >= 3) playSound('dumpsterBurst');
  if (step === scamMachineInsistLines.length - 1) {
    scamMachineInsist = 0;
    shopItemsContainer.classList.add('shop-locked');
    setTimeout(() => {
      shopItemsContainer.classList.remove('shop-locked');
      startScamChallengeSelect();
    }, 3400);
  }
}

// the fight again, whenever you want (you already won the machine)
function startScamRematch() {
  hideScammerQuestions();
  scammerShopSay('OTRA VEZ, KID?! QUERES LA [[REVANCHA]]? ES GRATIS! ...LA DERROTA TAMBIEN!', 'furious');
  scammerShopScreen.classList.remove('shop-shake');
  void scammerShopScreen.offsetWidth;
  scammerShopScreen.classList.add('shop-shake');
  playSound('cutsceneAngry');
  shopItemsContainer.classList.add('shop-locked');
  setTimeout(() => {
    shopItemsContainer.classList.remove('shop-locked');
    startScamChallengeSelect();
  }, 2600);
}

function sayScamChallenge(text) {
  scamChallengeLine.innerText = text;
  scamChallengePortrait.classList.remove('talking');
  void scamChallengePortrait.offsetWidth;
  scamChallengePortrait.classList.add('talking');
}

// the menu turns into a character select: 10 seconds to pick a fighter
function startScamChallengeSelect() {
  hideScammerQuestions();
  clearInterval(shopTalk.timer);
  shopTalk.timer = null;
  stopShopMusic();
  stopMenuMusic();
  hideAllMenuScreens();
  scamChallengeScreen.classList.remove('hidden');
  scamChallengePortrait.innerHTML = '';
  scamChallengePortrait.appendChild(shopScammer.querySelector('.character-preview').cloneNode(true));
  scamChallengeGrid.innerHTML = '';
  scamChallengeRoster.forEach((characterType) => {
    const source = characterButtons.find((entry) => entry.characterType === characterType);
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'scam-challenge-pick';
    pick.dataset.character = characterType;
    const preview = source && source.button.querySelector('.character-preview');
    if (preview) pick.appendChild(preview.cloneNode(true));
    const name = document.createElement('span');
    name.innerText = characterDisplayNames[characterType] || characterType;
    pick.appendChild(name);
    pick.addEventListener('click', () => chooseScamChallengeHero(characterType, false));
    scamChallengeGrid.appendChild(pick);
  });
  scamChallenge.timeLeft = scamChallengeSeconds * 10;
  updateScamChallengeTimer();
  sayScamChallenge('ELEGI A TU LUCHADOR, KID! CUALQUIERA! (MENOS ESOS DOS QUE BRILLAN MUCHO) TENES 10 SEGUNDOS!');
  playSound('cutsceneAngry');
  clearInterval(scamChallenge.timer);
  scamChallenge.timer = setInterval(tickScamChallenge, 100);
}

function updateScamChallengeTimer() {
  const seconds = Math.ceil(scamChallenge.timeLeft / 10);
  scamChallengeTimerText.innerText = String(seconds);
  scamChallengeTimerBar.style.width = `${(scamChallenge.timeLeft / (scamChallengeSeconds * 10)) * 100}%`;
  scamChallengeScreen.classList.toggle('hurry', seconds <= 3);
}

function tickScamChallenge() {
  scamChallenge.timeLeft -= 1;
  updateScamChallengeTimer();
  if (scamChallenge.timeLeft % 10 === 0 && scamChallenge.timeLeft > 0) playSound('robotTick');
  if (scamChallenge.timeLeft === 50) sayScamChallenge('5 SEGUNDOS! EL TIEMPO ES [[DINERO]], KID! TIC TAC!');
  if (scamChallenge.timeLeft === 30) sayScamChallenge('3... 2... 1... NO ME HAGAS ELEGIR POR VOS!');
  if (scamChallenge.timeLeft <= 0) {
    // he picks for you, and he really wants Gambler
    const others = scamChallengeRoster.filter((type) => type !== 'gambler');
    const pick = Math.random() < 0.5 ? 'gambler' : others[Math.floor(Math.random() * others.length)];
    chooseScamChallengeHero(pick, true);
  }
}

function chooseScamChallengeHero(characterType, byScammer) {
  clearInterval(scamChallenge.timer);
  scamChallenge.timer = null;
  scamChallengeGrid.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
    button.classList.toggle('chosen', button.dataset.character === characterType);
  });
  const name = (characterDisplayNames[characterType] || characterType).toUpperCase();
  if (byScammer) sayScamChallenge(`SE TE ACABO EL TIEMPO! ELIJO YO: ${name}!${characterType === 'gambler' ? ' JE JE JE... TENEMOS CUENTAS PENDIENTES.' : ''}`);
  else if (characterType === 'gambler') sayScamChallenge('GAMBLER?! JA JA JA! ESTO SE PONE [[INTERESANTE]]!');
  else sayScamChallenge(`${name}? BUENA ELECCION! (PARA MI)`);
  playSound('menuSelect');
  playSound('cutsceneLaugh');
  setTimeout(() => startScamChallengeFight(characterType, byScammer), 1500);
}

function startScamChallengeFight(characterType, byScammer) {
  scamChallengeScreen.classList.add('hidden');
  Object.assign(scamChallenge, { active: true, stage: 'normal', hero: characterType, pickedByScammer: byScammer, prevBot: botEnabled, prevDifficulty: botDifficulty });
  normalArcadeActive = false;
  botEnabled = true;
  botDifficulty = 'hard';
  player1.setCharacterType(characterType);
  player2.setCharacterType('gambler', 'scammer');
  selectedMap = 'scamShowroom';
  startGame();
  startScamChallengeIntro();
}

// winning against NEO SCAMMER: the Maquina Rara is yours
function rewardScamChallenge() {
  const firstTime = !scammerShop.owned.rareMachine;
  scammerShop.owned.rareMachine = 1;
  scammerShop.grudge = true;
  saveScammerShop();
  syncShopBadges();
  awardCoins(25000);
  // shown a moment later, so an achievement toast from the same win does not cover it
  setTimeout(() => {
    showCustomToast(
      firstTime ? 'MAQUINA RARA OBTENIDA' : 'NEO SCAMMER DERROTADO',
      firstTime ? 'Le ganaste a NEO SCAMMER: la maquina es tuya... y nadie sabe que hace. +25.000 monedas.' : '+25.000 monedas. Scammer va a necesitar un seguro nuevo.',
    );
    playSound('achievement');
  }, 4000);
}

function endScamChallenge() {
  clearInterval(scamChallenge.timer);
  scamChallenge.timer = null;
  if (!scamChallenge.active) return;
  scamChallenge.active = false;
  botEnabled = scamChallenge.prevBot;
  botDifficulty = scamChallenge.prevDifficulty;
}

// ---------------- the new stock: the duck and the book ----------------
function quackRubberDuck(badge) {
  playTone({ frequency: 880, duration: 0.08, type: 'square', volume: 0.06, slideTo: 620 });
  playTone({ frequency: 700, duration: 0.1, type: 'square', volume: 0.05, slideTo: 420, delay: 0.09 });
  badge.classList.remove('quack');
  void badge.offsetWidth;
  badge.classList.add('quack');
}

// "La Historia de Moquete": it promises the whole story... the pages are nonsense, and the back cover tells the truth
// Scammer's own doodle of "them": a pitch-black cat-thing with one pink eye, one yellow eye and a horrible grin
const moqueteBookCreature = `
  <svg class="moquete-book-drawing" viewBox="0 0 240 170" aria-label="Dibujo de Scammer de una criatura negra con ojos rosa y amarillo">
    <rect x="2" y="2" width="236" height="166" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M70 140 Q60 90 78 62 L70 30 L96 52 Q120 44 144 52 L170 30 L162 62 Q180 90 170 140 Z" fill="#050505" stroke="#000" stroke-width="3"/>
    <path d="M170 128 Q205 120 200 90 Q198 72 214 66" fill="none" stroke="#050505" stroke-width="8" stroke-linecap="round"/>
    <circle cx="100" cy="82" r="11" fill="#ff4fa3"/>
    <circle cx="140" cy="82" r="11" fill="#ffd60a"/>
    <ellipse cx="100" cy="82" rx="3" ry="8" fill="#050505"/>
    <ellipse cx="140" cy="82" rx="3" ry="8" fill="#050505"/>
    <path d="M88 104 Q120 132 152 104" fill="#fff" stroke="#fff" stroke-width="2"/>
    <path d="M92 106 L96 114 L100 108 L105 117 L110 109 L115 118 L120 110 L125 118 L130 109 L135 117 L140 108 L144 114 L148 106" fill="none" stroke="#050505" stroke-width="2"/>
    <text x="12" y="22" font-family="Comic Sans MS, cursive" font-size="12" fill="#c62828">ELLOS!!</text>
    <text x="168" y="150" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828">(no sonrien</text>
    <text x="168" y="161" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828"> de verdad)</text>
    <path d="M24 40 L80 74" stroke="#c62828" stroke-width="1.5"/>
    <text x="6" y="56" font-family="Comic Sans MS, cursive" font-size="9" fill="#c62828">ojo rosa</text>
    <path d="M196 44 L150 76" stroke="#c62828" stroke-width="1.5"/>
    <text x="178" y="40" font-family="Comic Sans MS, cursive" font-size="9" fill="#c62828">ojo amarillo</text>
  </svg>`;
// Scammer's doodles for chapters 9 to 13 (crude, annotated in red)
const moqueteBookDoodles = {
  9: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 170" aria-label="Dibujo de Scammer huyendo de las criaturas">
    <rect x="2" y="2" width="236" height="166" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <line x1="10" y1="140" x2="230" y2="140" stroke="#5d4037" stroke-width="2"/>
    <rect x="160" y="78" width="26" height="54" fill="#111"/>
    <circle cx="168" cy="92" r="5" fill="#ff4fa3"/><circle cx="180" cy="92" r="5" fill="#ffd60a"/>
    <path d="M150 112 h-30 M150 120 h-24 M150 104 h-20" stroke="#111" stroke-width="2"/>
    <path d="M50 140 Q44 110 52 98 L46 82 L60 92 Q70 88 80 92 L92 82 L88 98 Q94 112 90 140 Z" fill="#050505"/>
    <circle cx="62" cy="108" r="5" fill="#ff4fa3"/><circle cx="80" cy="108" r="5" fill="#ffd60a"/>
    <path d="M60 120 Q71 130 82 120" stroke="#fff" stroke-width="2" fill="none"/>
    <path d="M10 140 Q2 116 10 104 L6 90 L16 98 Q22 95 28 98 L36 90 L32 104 Q38 116 32 140 Z" fill="#050505" opacity="0.6"/>
    <text x="150" y="70" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">YO (corriendo)</text>
    <text x="40" y="76" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">ELLOS (no corren)</text>
    <text x="40" y="160" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">pero siempre estan mas cerca!!</text>
  </svg>`,
  10: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 170" aria-label="Dibujo de Scammer explicando sus lentes">
    <rect x="2" y="2" width="236" height="166" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <rect x="40" y="62" width="64" height="44" rx="8" fill="#ff4fa3" stroke="#111" stroke-width="4"/>
    <rect x="136" y="62" width="64" height="44" rx="8" fill="#ffd60a" stroke="#111" stroke-width="4"/>
    <path d="M104 80 h32" stroke="#111" stroke-width="5"/>
    <path d="M40 74 L14 64 M200 74 L226 64" stroke="#111" stroke-width="4"/>
    <text x="40" y="40" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="13">EL TRUCO:</text>
    <text x="34" y="128" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">rosa</text>
    <text x="150" y="128" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">amarillo</text>
    <text x="22" y="152" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">= ellos piensan que soy uno de ellos</text>
    <text x="70" y="164" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">(funciona 87% de las veces)</text>
  </svg>`,
  11: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 170" aria-label="Dibujo de Scammer de la piedrita brillante">
    <rect x="2" y="2" width="236" height="166" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <polygon points="120,50 146,76 132,112 106,112 94,76" fill="#7e57c2" stroke="#111" stroke-width="3"/>
    <polygon points="120,50 132,76 120,112 108,76" fill="#b388ff"/>
    <path d="M86 50 l-10 -10 M154 50 l10 -10 M120 36 v-14 M80 86 h-14 M160 86 h14" stroke="#ffd60a" stroke-width="3"/>
    <text x="150" y="128" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">*bip bip*</text>
    <text x="14" y="30" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">la piedrita</text>
    <text x="14" y="150" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">la vendi a 9.999 monedas. ERROR.</text>
    <text x="14" y="163" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">(al otro dia habia 4 de ellos afuera)</text>
  </svg>`,
  12: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 170" aria-label="Dibujo de Scammer con sus consejos">
    <rect x="2" y="2" width="236" height="166" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <circle cx="40" cy="44" r="7" fill="#ff4fa3"/><circle cx="58" cy="44" r="7" fill="#ffd60a"/>
    <path d="M24 30 L74 58 M74 30 L24 58" stroke="#c62828" stroke-width="4"/>
    <text x="86" y="50" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">NO saludar</text>
    <rect x="30" y="80" width="36" height="22" fill="#a5d6a7" stroke="#111" stroke-width="2"/>
    <path d="M24 74 L72 108 M72 74 L24 108" stroke="#c62828" stroke-width="4"/>
    <text x="86" y="96" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">NO venderles nada</text>
    <rect x="28" y="122" width="40" height="30" fill="#e91e63" stroke="#111" stroke-width="2"/>
    <text x="34" y="142" font-family="Courier New, monospace" font-size="9" fill="#fff">TIENDA</text>
    <path d="M78 136 l8 8 l16 -18" stroke="#2e7d32" stroke-width="4" fill="none"/>
    <text x="110" y="142" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="11">SI comprar aca!!</text>
  </svg>`,
  13: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 190" aria-label="Autorretrato de Scammer, muy exagerado">
    <rect x="2" y="2" width="236" height="186" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M120 16 l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2 z" fill="#ffd60a" stroke="#111"/>
    <path d="M88 52 l10 -14 l10 10 l12 -16 l12 16 l10 -10 l10 14 z" fill="#ffd60a" stroke="#111" stroke-width="2"/>
    <path d="M84 60 Q120 50 156 60 L166 150 Q120 162 74 150 Z" fill="#f2f2f2" stroke="#111" stroke-width="3"/>
    <path d="M98 150 L104 176 M142 150 L136 176" stroke="#111" stroke-width="4"/>
    <rect x="92" y="78" width="22" height="16" rx="3" fill="#ff4fa3" stroke="#111" stroke-width="3"/>
    <rect x="126" y="78" width="22" height="16" rx="3" fill="#ffd60a" stroke="#111" stroke-width="3"/>
    <path d="M114 86 h12" stroke="#111" stroke-width="3"/>
    <path d="M104 108 Q120 124 136 108" stroke="#111" stroke-width="3" fill="#fff"/>
    <path d="M110 128 v12 M120 126 v16 M130 128 v12" stroke="#2e7d32" stroke-width="3"/>
    <path d="M60 110 L80 104 M180 110 L160 104" stroke="#111" stroke-width="5"/>
    <path d="M40 92 l8 4 M36 106 h10 M40 120 l8 -4 M200 92 l-8 4 M204 106 h-10 M200 120 l-8 -4" stroke="#ffd60a" stroke-width="3"/>
    <text x="8" y="22" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="10">YO (asi soy)</text>
    <text x="168" y="40" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">corona real</text>
    <text x="176" y="150" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">musculos</text>
    <text x="176" y="160" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">(reales)</text>
    <text x="6" y="150" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">2 metros</text>
    <text x="6" y="160" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">de altura</text>
    <text x="60" y="184" font-family="Comic Sans MS, cursive" fill="#c62828" font-size="9">(escala 1:1, no exagerado)</text>
  </svg>`,
};
const moqueteBookPages = [
  { title: 'Capitulo 1: El comienzo', text: 'Todo empezo un martes. O un jueves. La cosa es que yo, un joven emprendedor de gran corazon y mejor peinado, abri mi primer negocio: vender agua mojada.' },
  { title: 'Capitulo 2: Mi primer millon', text: 'Gracias a mi talento natural, vendi 3 botellas de agua mojada. Una me la compre yo mismo para que el negocio pareciera exitoso. Funciono. Mas o menos.' },
  { title: 'Capitulo 3: La expansion', text: 'Con las ganancias abri una sucursal: un carrito. Vendia aire de montaña, piedras motivacionales y garantias para las garantias. El carrito era robado. El carrito tambien lo vendi.' },
  { title: 'Capitulo 4: La gran traicion', text: 'Un cliente me pidio un REEMBOLSO. Un reembolso! A mi! Llore tres dias. Despues le vendi un pañuelo para que el tambien llorara. Asi se hacen los negocios, kid.' },
  { title: 'Capitulo 5: Mis grandes amores', text: 'Tuve un solo gran amor en mi vida: el dinero. Bueno, dos: el dinero y el dinero de los demas. Este capitulo es corto porque el amor no se explica. Se cobra.' },
  { title: 'Capitulo 6: El contenedor', text: 'Me mude a un [[PENTHOUSE DE LUJO]] en un callejon. Tiene tapa, eco natural y vecinos ratas muy respetuosos. Los ratones pagan alquiler. Yo no.' },
  { title: 'Capitulo 7: La primera vez que los vi', text: 'Una noche, saliendo del contenedor, senti que alguien me miraba. Dos puntitos en la oscuridad: uno ROSA y uno AMARILLO. No pestañeaban. Yo si. Mucho.' },
  { title: 'Capitulo 8: Como son ELLOS', text: 'Los dibuje de memoria para que sepas reconocerlos. Son como gatos, pero no. Negros, NEGRO PURO, como si alguien hubiera recortado un pedazo de la noche. Y esa sonrisa... nadie sonrie asi sin querer algo.', drawing: true },
  { title: 'Capitulo 9: La persecucion', text: 'Me siguieron por tres barrios, dos ciudades y un shopping. Nunca corren: cuando miro para atras simplemente ya estan mas cerca. Les ofreci un 50% de descuento. No les intereso. ESO es lo que mas miedo me da.' },
  { title: 'Capitulo 10: Los lentes', text: 'Descubri el truco: si llevo lentes con un vidrio rosa y otro amarillo, creen que soy uno de ellos. Por eso no me los saco nunca. Ni para dormir. Ni para ducharme. Sobre todo para ducharme.' },
  { title: 'Capitulo 11: Lo que quieren', text: 'No se que quieren. Una vez uno dejo algo en mi contenedor: una piedrita brillante que hacia ruiditos. La vendi enseguida, obvio. Al dia siguiente habia CUATRO afuera. Desde entonces no vendo piedritas brillantes. ...Salvo una maquina. Pero eso es otra historia.' },
  { title: 'Capitulo 12: Consejos para el lector', text: '1) Si ves dos ojos, uno rosa y uno amarillo, NO saludes. 2) No les vendas nada. 3) Si te sonrien, sonrei mas fuerte. 4) Compra en mi tienda. El punto 4 no tiene que ver, pero es importante.' },
  { title: 'Capitulo 13: El final', text: 'Y asi, el heroe (yo) vivio feliz para siempre, rodeado de monedas que no eran suyas y vigilado por gatos que no son gatos. Aca les dejo un retrato fiel del autor. FIN. ...Moquete? Que es un Moquete?' },
];
const moqueteBook = { element: null, page: -1, flipped: false };

function openMoqueteBook() {
  if (!moqueteBook.element) {
    const overlay = document.createElement('div');
    overlay.className = 'moquete-book-overlay hidden';
    overlay.innerHTML = `
      <div class="moquete-book">
        <div class="moquete-book-page"></div>
        <div class="moquete-book-controls">
          <button type="button" data-book="prev">&lt; ANTERIOR</button>
          <button type="button" data-book="flip">VOLTEAR</button>
          <button type="button" data-book="next">SIGUIENTE &gt;</button>
          <button type="button" data-book="close">CERRAR</button>
        </div>
      </div>`;
    overlay.addEventListener('click', (event) => {
      const action = event.target.dataset ? event.target.dataset.book : null;
      if (event.target === overlay || action === 'close') closeMoqueteBook();
      if (action === 'prev') turnMoqueteBook(-1);
      if (action === 'next') turnMoqueteBook(1);
      if (action === 'flip') flipMoqueteBook();
    });
    document.body.appendChild(overlay);
    moqueteBook.element = overlay;
  }
  moqueteBook.page = -1;
  moqueteBook.flipped = false;
  renderMoqueteBook();
  moqueteBook.element.classList.remove('hidden');
  playSound('cutsceneBlip', { speaker: 'scammer' });
}

function closeMoqueteBook() {
  if (moqueteBook.element) moqueteBook.element.classList.add('hidden');
}

function turnMoqueteBook(direction) {
  if (moqueteBook.flipped) return;
  moqueteBook.page = Math.max(-1, Math.min(moqueteBookPages.length - 1, moqueteBook.page + direction));
  playNoise({ duration: 0.08, volume: 0.04, filterFrequency: 3000 });
  renderMoqueteBook();
}

function flipMoqueteBook() {
  moqueteBook.flipped = !moqueteBook.flipped;
  playNoise({ duration: 0.12, volume: 0.05, filterFrequency: 1800 });
  if (moqueteBook.flipped) setTimeout(() => playSound('cutsceneLaugh'), 250);
  renderMoqueteBook();
}

function renderMoqueteBook() {
  const book = moqueteBook.element.querySelector('.moquete-book');
  const page = moqueteBook.element.querySelector('.moquete-book-page');
  book.classList.toggle('back', moqueteBook.flipped);
  book.classList.toggle('cover', !moqueteBook.flipped && moqueteBook.page < 0);
  moqueteBook.element.querySelector('[data-book="prev"]').disabled = moqueteBook.flipped || moqueteBook.page < 0;
  moqueteBook.element.querySelector('[data-book="next"]').disabled = moqueteBook.flipped || moqueteBook.page >= moqueteBookPages.length - 1;
  moqueteBook.element.querySelector('[data-book="flip"]').innerText = moqueteBook.flipped ? 'DAR VUELTA DE NUEVO' : 'VOLTEAR';
  if (moqueteBook.flipped) {
    page.innerHTML = `
      <span class="moquete-book-kicker">CONTRATAPA</span>
      <h3>Una nota del autor</h3>
      <p>Si estas leyendo esto: FELICITACIONES, pagaste 100.000 monedas por un libro que escribi en una tarde mientras me comia un sanguche.</p>
      <p>Este libro NO cuenta la historia de Moquete. No tiene NADA que ver. Ni se que es un Moquete. Es una broma, kid. Una broma PESADA. Pesadisima. Tapa dura.</p>
      <p>No hay devoluciones. Nunca hubo devoluciones. JA JA JA!</p>
      <p class="moquete-book-signature">- Scammer, autor, empresario y [[GENIO LITERARIO]]</p>
      <span class="moquete-book-barcode">||| || ||||| | |||| PRECIO SUGERIDO: 3 MONEDAS</span>`;
    return;
  }
  if (moqueteBook.page < 0) {
    page.innerHTML = `
      <span class="moquete-book-kicker">EDICION DE TAPA DURA</span>
      <h2>LA HISTORIA<br>DE MOQUETE</h2>
      <p class="moquete-book-subtitle">TODA la historia, desde el primer golpe hasta el ultimo farol.<br>Contada por un testigo de primera mano.</p>
      <p class="moquete-book-review">"Una obra maestra" - El Autor</p>`;
    return;
  }
  const entry = moqueteBookPages[moqueteBook.page];
  page.innerHTML = `
    <span class="moquete-book-kicker">PAGINA ${moqueteBook.page + 1} DE ${moqueteBookPages.length}</span>
    <h3>${entry.title}</h3>
    <p>${entry.text}</p>${entry.drawing ? moqueteBookCreature : moqueteBookDoodles[moqueteBook.page + 1] || ''}`;
}

// every 8th cookie has a note in Chinese that Scammer cannot read
function openFortuneCookie() {
  const eaten = Number(scammerShop.owned.fortuneCookie) || 0;
  if (eaten % shaolinCookiesNeeded === 0) {
    return '...ESTE PAPELITO ESTA EN CHINO: "少林寺在等你。在菜单上写: KUNGFUTEA" ...QUE DICE? NI IDEA. SEGURO DICE "COMPRA MAS GALLETAS". SI, DICE ESO.';
  }
  return `TU FORTUNA DICE: "${shaolinFortunes[Math.floor(Math.random() * shaolinFortunes.length)]}" ...MUY PRECISA, KID.`;
}
