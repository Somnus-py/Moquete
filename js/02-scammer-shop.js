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
  // ---- the spooky stock (October) ----
  {
    id: 'hauntedTheme',
    name: 'Tema Noche de Brujas',
    description: 'El menu se viste de Halloween: naranja, violeta, telarañas en las esquinas y luna llena. Se activa y desactiva en Ajustes.',
    price: 7000,
    spooky: true,
    vendorLine: 'BUUU! ...TE ASUSTE? NO? BUENO, EL TEMA ES MAS TERRORIFICO QUE YO. NO MUCHO.',
  },
  {
    id: 'pumpkinHead',
    name: 'Cabeza de Calabaza [[ORGANICA]]',
    description: 'Tu luchador (jugador 1) pelea con una calabaza tallada en la cabeza. Con velita adentro. No nos hacemos cargo de incendios.',
    price: 9000,
    spooky: true,
    vendorLine: 'CULTIVADA EN MI HUERTA! (EL CONTENEDOR DE AL LADO) (NO PREGUNTES QUE MAS CRECE AHI)',
  },
  {
    id: 'vampireFangs',
    name: 'Colmillos de Vampiro [[DE PLASTICO]]',
    description: 'Tu luchador (jugador 1) recupera un poquito de vida con cada golpe que acierta. Autenticos de Transilvania (Transilvania es una marca registrada mia).',
    price: 14000,
    spooky: true,
    vendorLine: 'CHUPAN LA VIDA DE TUS ENEMIGOS! TAMBIEN SIRVEN PARA ABRIR SOBRES. MULTIUSO!',
  },
  {
    id: 'hauntedDoll',
    name: 'Muñeco Embrujado',
    description: 'Un muñequito para el menu. Tocalo si te animas. A veces se mueve solo. NO HAY DEVOLUCIONES (lo intente, volvio solo).',
    price: 6666,
    spooky: true,
    vendorLine: 'LLEVATELO, LLEVATELO! ...DIGO, EXCELENTE ELECCION. NO LO MIRES A LOS OJOS DE NOCHE.',
  },
  {
    id: 'plushBat',
    name: 'Murcielago de Peluche',
    description: 'Un murcielago que aletea en la esquina del menu. Es de peluche. Creo. Nunca lo vi comer.',
    price: 4500,
    spooky: true,
    vendorLine: 'ES INOFENSIVO! ...SI SE TE CUELGA DEL TECHO, NO ES MI PROBLEMA.',
  },
  {
    id: 'candyBag',
    name: 'Bolsa de Caramelos: Dulce o Truco',
    description: 'Dulce o truco! Puede tener monedas... o una broma de Scammer. Se puede comprar las veces que quieras.',
    price: 666,
    repeatable: true,
    spooky: true,
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
  {
    id: 'spellBook',
    name: 'Libro de Hechizos',
    description: 'Un grimorio antiguo con los hechizos de los luchadores: la magia roja, azul y purpura de Sorcerer, la suerte verde de Gambler, el fuego de Fire Master... y algunas paginas que mejor no leer.',
    price: 77777,
    vendorLine: 'MAGIA DE VERDAD, KID! LO ENCONTRE EN UN SOTANO... DIGO, EN UNA BIBLIOTECA MUY PRESTIGIOSA. NO TOQUES LOS CANDADOS.',
  },
  {
    id: 'fireBook',
    name: 'Fuego en las Manos',
    description: 'La historia de Fire Master: dos hermanos, una piedra extraña en la montaña y un fuego que tuvo que aprender a no quemar. Biografia no autorizada.',
    price: 60000,
    vendorLine: 'UNA HISTORIA CALENTITA, KID! ...SI EMPIEZA A OLER A HUMO, CERRALO. NO ES BROMA. BUENO, UN POCO SI.',
  },
  {
    id: 'lightBook',
    name: 'La Luz que se Contiene',
    description: 'La historia de Light Warrior: nacio con una luz capaz de todo... y eligio usarla para ayudar. Inspirador. Demasiado inspirador. Me cae mal.',
    price: 60000,
    vendorLine: 'EL CHICO BRILLANTE! LITERALMENTE! SI LO LEES DE NOCHE NO NECESITAS LAMPARA. AHORRO DE LUZ INCLUIDO!',
  },
  {
    id: 'darkGuide',
    name: 'Guia Turistica del Mundo Oscuro',
    description: 'Escrita por mi, el unico vendedor que fue y volvio (mas o menos). Castillos, bufones, mascotas que sonrien. Incluye consejos de supervivencia y precios.',
    price: 45000,
    vendorLine: 'FUI, VI Y VOLVI CON LENTES NUEVOS! ESTA GUIA TE PUEDE SALVAR LA VIDA, KID. O NO. NO HAY GARANTIA.',
  },
  {
    id: 'bookshelf',
    name: 'Estante de Biblioteca',
    description: 'Un estante de madera para el menu, para tener todos tus libros a mano. Tocalo y elegi que leer. Los libros se venden por separado (obvio).',
    price: 12000,
    vendorLine: 'UN ESTANTE PARA PARECER INTELECTUAL! AUNQUE SEA DE MADERA DE CAJON. DE MI CAJON. DONDE VIVO.',
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
  { id: 'hauntedTheme', label: 'Tema Noche de Brujas' },
  { id: 'pumpkinHead', label: 'Cabeza de Calabaza (jugador 1)' },
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
  // October: a banner for the spooky stock
  if (new Date().getMonth() === 9) {
    const banner = document.createElement('div');
    banner.className = 'shop-spooky-banner';
    banner.innerText = 'ESPECIAL NOCHE DE BRUJAS: PRODUCTOS TERRORIFICAMENTE BARATOS! (no son baratos)';
    shopItemsContainer.appendChild(banner);
  }
  // in October the spooky stock goes first
  const october = new Date().getMonth() === 9;
  const shopOrder = october ? [...scammerShopItems].sort((a, b) => Number(Boolean(b.spooky)) - Number(Boolean(a.spooky))) : scammerShopItems;
  shopOrder.forEach((item) => {
    if (item.grudgeOnly && !scammerShop.grudge) return;
    const owned = Boolean(scammerShop.owned[item.id]) && !item.repeatable;
    const card = document.createElement('div');
    card.className = `shop-item${owned ? ' owned' : ''}`;
    if (item.spooky) card.classList.add('shop-spooky');
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
    const readable = owned && (item.id === 'moqueteBook' || item.id === 'spellBook' || storyBooks[item.id] || item.id === 'bookshelf');
    button.innerText = rematch ? 'REVANCHA' : readable ? 'LEER' : owned ? 'COMPRADO' : 'COMPRAR';
    button.disabled = owned && !rematch && !readable;
    if (rematch) button.classList.add('shop-rematch');
    button.addEventListener('click', () => (readable ? openShopReadable(item.id) : buyScammerShopItem(item)));
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
  scammerShopSay(item.id === 'mysteryBox' ? openMysteryBox() : item.id === 'fortuneCookie' ? openFortuneCookie() : item.id === 'candyBag' ? openCandyBag() : item.vendorLine, 'hyped');
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
    ['hauntedDoll', 'shop-badge icon doll', 'Muñeco Embrujado (tocalo... si te animas)'],
    ['plushBat', 'shop-badge icon bat', 'Murcielago de Peluche'],
    ['bottledAir', 'shop-badge icon bottle', 'Aire Embotellado de Valdoria'],
    ['scammerPoster', 'shop-badge icon poster', 'Poster Autografiado de Scammer'],
    ['moqueteBook', 'shop-badge icon book', 'La Historia de Moquete (tocalo para leer)'],
    ['spellBook', 'shop-badge icon spellbook', 'Libro de Hechizos (tocalo para leer)'],
    ['bookshelf', 'shop-badge icon bookshelf', 'Estante de Biblioteca (tocalo)'],
    ['fireBook', 'shop-badge icon firebook', 'Fuego en las Manos (tocalo para leer)'],
    ['lightBook', 'shop-badge icon lightbook', 'La Luz que se Contiene (tocalo para leer)'],
    ['darkGuide', 'shop-badge icon darkguide', 'Guia Turistica del Mundo Oscuro (tocalo para leer)'],
  ];
  const shelfBooks = ['moqueteBook', 'spellBook', 'fireBook', 'lightBook', 'darkGuide'];
  badges.forEach(([id, className, title]) => {
    if (!scammerShop.owned[id]) return;
    // (once there is a bookshelf, every book goes on it)
    if (scammerShop.owned.bookshelf && shelfBooks.includes(id)) return;
    const badge = document.createElement('span');
    badge.className = className;
    badge.title = title;
    // the duck quacks and the book opens
    if (id === 'rubberDuck' || id === 'moqueteBook' || id === 'hauntedDoll' || id === 'spellBook' || storyBooks[id] || id === 'bookshelf') {
      badge.classList.add('clickable');
      badge.addEventListener('click', (event) => {
        event.stopPropagation();
        if (id === 'rubberDuck') quackRubberDuck(badge);
        else if (id === 'hauntedDoll') pokeHauntedDoll(badge);
        else if (id === 'spellBook' || storyBooks[id] || id === 'bookshelf') openShopReadable(id);
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
  document.body.classList.toggle('shop-theme-halloween', isShopExtraOn('hauntedTheme'));
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
      // the barcode hides the real story...
      if (event.target.dataset && event.target.dataset.bookSecret === 'origins') unlockOriginsChapter();
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
      <span class="moquete-book-barcode" data-book-secret="origins">||| || ||||| | |||| PRECIO SUGERIDO: 3 MONEDAS</span>`;
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

// ---------------- the spooky stock ----------------
// trick or treat: coins... or one of Scammer's jokes
function openCandyBag() {
  const roll = Math.random();
  if (roll < 0.04) {
    awardCoins(3000);
    return 'DULCE! ...NO, ESPERA, 3.000 MONEDAS?! QUIEN PUSO ESO AHI?! DEVOLVEMELO! ...NO? BUENO. FELIZ HALLOWEEN.';
  }
  if (roll < 0.35) {
    const coins = 200 + Math.floor(Math.random() * 9) * 100;
    awardCoins(coins);
    return `DULCE! ADENTRO HABIA ${coins} MONEDAS DE CHOCOLATE... DIGO, DE VERDAD. SON DE VERDAD. CREO.`;
  }
  const tricks = [
    'TRUCO! ERA UN CARAMELO DE CEBOLLA. JE JE JE.',
    'TRUCO! LA BOLSA ESTABA VACIA. BUENO, TENIA AIRE. AIRE DE HALLOWEEN.',
    'TRUCO! ERA UNA ARAÑA DE GOMA. ...ESPERA, SE MOVIO? NO SE MOVIO. (SE MOVIO)',
    'TRUCO! ERA UN CARAMELO DE 1997. TIENE LA FECHA. NO LO COMAS. O SI. NO ME IMPORTA.',
    'TRUCO! DENTRO HABIA UN PAPELITO QUE DICE "COMPRA OTRA BOLSA". CONSEJO SABIO.',
  ];
  return tricks[Math.floor(Math.random() * tricks.length)];
}

const hauntedDollLines = [
  'Juguemos... para siempre.',
  'Hoy te vi pelear. Podrias hacerlo mejor.',
  'No me dejes solo en el menu...',
  'Scammer me vendio a 17 personas. Todas me devolvieron.',
  'Detras tuyo. ...Mentira. O no.',
  'Ya son las 3 AM? Que hora mas linda.',
];

function pokeHauntedDoll(badge) {
  playTone({ frequency: 220, duration: 0.6, type: 'sine', volume: 0.06, slideTo: 196 });
  playTone({ frequency: 233, duration: 0.6, type: 'sine', volume: 0.04, slideTo: 207, delay: 0.05 });
  badge.classList.remove('creepy');
  void badge.offsetWidth;
  badge.classList.add('creepy');
  showCustomToast('MUÑECO EMBRUJADO', hauntedDollLines[Math.floor(Math.random() * hauntedDollLines.length)]);
}

// ---------------- the spell book (Libro de Hechizos) ----------------
// spell: [name, keys, description, color]
const spellBookPages = [
  {
    hero: 'sorcerer',
    title: 'Sorcerer',
    kicker: 'MAGIA ARCANA: ROJA, AZUL Y PURPURA',
    intro: 'El hechicero de las tres esferas. Cada color es un hechizo distinto, y los tres juntos son un problema.',
    spells: [
      ['Esfera roja', 'Q', 'Una esfera de energia roja que sale disparada contra el rival. Arde, rebota y no pide permiso.', '#e53935'],
      ['Esfera azul secreta', 'Q + F', 'El hechizo prohibido de los aprendices: una esfera azul que aparece donde nadie la espera.', '#1e88e5'],
      ['Esfera gravitatoria', 'F', 'Magia purpura que dobla el aire: atrae, aplasta y no deja escapar.', '#8e24aa'],
    ],
    note: '(Intente hacer la roja con una linterna y papel celofan. No funciono. Se me quemo el celofan.)',
  },
  {
    hero: 'gambler',
    title: 'Gambler',
    kicker: 'MAGIA DE LA SUERTE: VERDE Y APOSTADORA',
    intro: 'La magia verde no se aprende: se apuesta. Cada hechizo es una tirada, y la casa... a veces pierde.',
    spells: [
      ['Ruleta', 'Q', 'Gira la ruleta de la fortuna. Puede salir algo increible... o algo muy, muy malo.', '#43a047'],
      ['Luck Incrementer', 'F', 'Un trebol verde que sube la suerte. Mas suerte, mas golpes buenos, mas sonrisas falsas del rival.', '#66bb6a'],
      ['Dados cargados', 'Q + F', 'El secreto de todo buen apostador: los dados caen como uno quiere. No se lo cuentes a nadie.', '#1b5e20'],
    ],
    note: '(Gambler no me quiso vender el trebol. Ni siquiera con descuento. Que falta de espiritu comercial.)',
  },
  {
    hero: 'fireMaster',
    title: 'Fire Master',
    kicker: 'MAGIA DE FUEGO',
    intro: 'Fuego puro, sin trucos. El Maestro del Fuego no lanza hechizos: los grita.',
    spells: [
      ['Bola de fuego', 'Q', 'Una bola de fuego clasica. Simple, caliente y efectiva.', '#ff6f00'],
      ['Fire beam', 'F', 'Un rayo de fuego continuo. Ideal para derretir hielo, rivales y presupuestos.', '#ff3d00'],
      ['Super Kamehameha de fuego', 'Q + F', 'Carga, carga, carga... y suelta todo el fuego de una. Se escucha desde Valdoria.', '#ffab00'],
      ['Inferno dividido', 'Q + F', 'El fuego se parte en dos y ataca por los dos lados. Nadie sabe como lo hace.', '#dd2c00'],
    ],
    note: '(Este capitulo vino medio chamuscado. No es decoracion.)',
    scorched: true,
  },
  {
    hero: 'chrono',
    title: 'Chrono',
    kicker: 'MAGIA DEL TIEMPO (...cuenta?)',
    intro: 'Chrono dice que no es magia, que es "tecnologia temporal de precision". Yo lo pongo igual, por las dudas.',
    spells: [
      ['Cuchilla temporal', 'Q', 'Una cuchilla hecha de segundos. Corta ahora y duele un ratito despues.', '#26c6da'],
      ['Campo lento', 'F', 'Un campo donde todo va mas lento. Menos Chrono, que llega puntual a todos lados.', '#00acc1'],
      ['Detener el tiempo', 'Q + F', 'Tic... tac... ...tac. El mundo se congela, y el no.', '#80deea'],
    ],
    note: '(Si no es magia, que me devuelva las 3 paginas que ocupa.)',
    clockwork: true,
  },
  {
    hero: 'divineGeneral',
    title: 'G#N%RAL D|V|NO',
    kicker: 'M@GIA D&L C!ELO... ?',
    intro: 'Est@ pag|na n0 qu&ere s#r le!da. La t|nta s& mu#ve s0la.',
    spells: [
      ['Ad#pt@cion', 'Q', 'S& vu&lve |nmun& a l0 qu& l& gol p&a. ███ ███ ██████.', '#ffd54f'],
      ['C0ntra ad#ptat|va', 'F', '█████ el golp& y lo d&vu&lv& ██ ████ ███.', '#ffb300'],
      ['C0RT& D&L MUND0', 'Q + F', '███ ████ ██ █████ ████ ███████ █████. N0 ███ █████.', '#ffffff'],
    ],
    note: '(Yo no escribi esta pagina. Juro que cuando compre el libro estaba en blanco.)',
    glitched: true,
  },
  {
    hero: 'lightWarrior',
    title: 'Light Warrior',
    kicker: 'MAGIA DE LA LUZ',
    intro: 'Esta pagina esta cerrada con candados oscuros. Alguien no quiere que se lea... o que alguien lo encuentre.',
    spells: [
      ['Rafaga de luz', 'Q', 'Disparos de luz.', '#fff59d'],
      ['Velocidad luminosa', 'F', 'Mas rapido que la luz.', '#fff176'],
      ['Destello solar', 'R', 'Un sol en la mano.', '#ffee58'],
      ['Puño radiante', 'F + R', '...', '#fdd835'],
      ['Transformacion Omega', 'Q + F + R', '...', '#ffffff'],
    ],
    note: '"No sigas leyendo. Si el lee esto, va a saber donde estoy." ...Quien es "el"?',
    locked: true,
  },
];
// SECOND HALF: ideas to improvise or improve each one's magic (written, mostly, by Sorcerer)
// tip: [title, text]
spellBookPages.push(
  { divider: true },
  {
    hero: 'sorcerer',
    tips: true,
    title: 'Sorcerer',
    kicker: 'IDEAS PARA IMPROVISAR: MIS PROPIAS ESFERAS',
    intro: 'Empiezo por mi, que para algo escribo yo.',
    list: [
      ['Atraer y quemar', 'Primero la esfera gravitatoria, despues la roja. El rival queda pegado justo donde cae el fuego. Lo invente un martes.'],
      ['La azul, al final', 'La esfera azul secreta sale mejor cuando el rival cree que ya terminaste. La paciencia tambien es magia.'],
      ['Nunca las tres juntas', 'No tires las tres esferas a la vez en un cuarto chico. Lo digo por experiencia. (Perdon, cortinas.)'],
    ],
    note: '- S.',
  },
  {
    hero: 'gambler',
    tips: true,
    title: 'Gambler',
    kicker: 'IDEAS PARA IMPROVISAR: LA SUERTE VERDE',
    intro: 'Gambler no me dejo verle las cartas, pero lo mire pelear desde lejos.',
    list: [
      ['El orden importa', 'Primero el Luck Incrementer, despues la Ruleta. La suerte no es retroactiva, aunque el diga que si.'],
      ['Sonreir', 'Los Dados cargados caen mejor si sonreis. No se por que. Gambler tampoco. Pero funciona.'],
      ['Si sale mal', 'Si la Ruleta sale mal, mira al rival como si fuera su culpa. Funciona psicologicamente. (Esto lo agrego Scammer.)'],
    ],
    note: '- S. (y una linea con letra fea que no es mia)',
  },
  {
    hero: 'fireMaster',
    tips: true,
    flametomb: true,
    title: 'Fire Master',
    kicker: 'IDEAS PARA IMPROVISAR: EL FUEGO',
    intro: 'El fuego no se improvisa: se controla. Casi siempre.',
    list: [
      ['Contra el hielo', 'El Fire beam derrite cualquier cosa congelada. Si el rival es de hielo, empeza por ahi y no pares.'],
      ['Cargar a cubierto', 'Carga el Super Kamehameha detras de algo. Nadie respeta a un mago que se deja interrumpir.'],
      ['Arrinconar', 'El Inferno dividido cubre las dos salidas. Primero llevalo a la pared, despues dividi el fuego.'],
    ],
    note: '',
  },
  {
    hero: 'chrono',
    tips: true,
    title: 'Chrono',
    kicker: 'IDEAS PARA IMPROVISAR: EL TIEMPO',
    intro: 'Chrono insiste en que esto no es magia. Igual le copie un par de trucos.',
    list: [
      ['Una esfera que espera', 'Campo lento y despues una esfera: el rival llega tarde a esquivarla. Chrono lo llama "sinergia interdisciplinaria".'],
      ['Detener y reposicionar', 'Cuando el tiempo se detiene, no ataques enseguida: movete detras del rival. Un segundo congelado vale por diez.'],
      ['No para la siesta', 'No detengas el tiempo para dormir la siesta. Chrono lo intento. No funciono. Se enojo mucho.'],
    ],
    note: '- S.',
  },
  {
    hero: 'divineGeneral',
    tips: true,
    glitched: true,
    title: '|D&@S D&L G#N%R@L',
    kicker: 'IMPR0V|S@R ... ?',
    intro: 'Int&nt& c0p|ar sus tr|c0s. L@ t|nta n0 m& d&j0.',
    list: [
      ['N0 r&p&t|r', 'S| s& @d@pta, c@mb|a d& ███... n0 ███ d0s v&c&s l0 m|sm0 ████.'],
      ['L@ c0ntra', '████ ███ █████ █ ███ ██████ ███ ██ ████ ███████.'],
      ['&l c0rt&', '██████ ███ ███████. ███ █████ ██ ████ ███ ██ ███.'],
    ],
    note: '(Escribi tres paginas. Al dia siguiente quedaba esto.) - S.',
  },
  {
    hero: 'lightWarrior',
    tips: true,
    locked: true,
    title: 'Light Warrior',
    kicker: 'IDEAS PARA IMPROVISAR: LA LUZ',
    intro: 'Light Warrior me pidio que arrancara esta pagina. No pude. Tampoco pude volver a abrirla.',
    list: [
      ['La luz se refleja', 'Un Destello solar contra un espejo vale por dos. ...Por eso no le gustan los robots de Prisma.'],
      ['Rapido y lejos', 'Velocidad luminosa para escapar, Rafaga de luz para que no te sigan.'],
      ['Omega', '██████ ██ ███████ ███ ████ ███ ██████ ████ █████.'],
      ['El', 'No lo nombres. No lo busques. No ███ ████ ███ ███.'],
    ],
    note: '"Si alguien encuentra esto, cerralo. Por favor." - L.W.',
  },
);
const spellBook = { element: null, page: -1, flipped: false };

function openSpellBook() {
  if (!spellBook.element) {
    const overlay = document.createElement('div');
    overlay.className = 'moquete-book-overlay spell-book-overlay hidden';
    overlay.innerHTML = `
      <div class="moquete-book spell-book">
        <div class="moquete-book-page spell-book-page"></div>
        <div class="moquete-book-controls">
          <button type="button" data-spell="prev">&lt; ANTERIOR</button>
          <button type="button" data-spell="flip">VOLTEAR</button>
          <button type="button" data-spell="next">SIGUIENTE &gt;</button>
          <button type="button" data-spell="close">CERRAR</button>
        </div>
      </div>`;
    overlay.addEventListener('click', (event) => {
      const action = event.target.dataset ? event.target.dataset.spell : null;
      if (event.target === overlay || action === 'close') overlay.classList.add('hidden');
      if (action === 'prev') turnSpellBook(-1);
      if (action === 'next') turnSpellBook(1);
      if (action === 'flip') {
        spellBook.flipped = !spellBook.flipped;
        playNoise({ duration: 0.12, volume: 0.05, filterFrequency: 1800 });
        renderSpellBook();
      }
      // the dark padlocks don't open. Ever.
      const lock = event.target.closest && event.target.closest('.spell-lock');
      if (lock) {
        lock.classList.remove('rattle');
        void lock.offsetWidth;
        lock.classList.add('rattle');
        playNoise({ duration: 0.15, volume: 0.06, filterFrequency: 900 });
        const hint = overlay.querySelector('.spell-lock-hint');
        if (hint) hint.innerText = ['Esta cerrado.', 'Esta MUY cerrado.', 'No insistas.', '...Algo del otro lado tambien tira.'][Math.floor(Math.random() * 4)];
      }
    });
    document.body.appendChild(overlay);
    spellBook.element = overlay;
  }
  spellBook.page = -1;
  spellBook.flipped = false;
  renderSpellBook();
  spellBook.element.classList.remove('hidden');
  playTone({ frequency: 660, duration: 0.4, type: 'sine', volume: 0.05, slideTo: 990 });
}

function turnSpellBook(direction) {
  if (spellBook.flipped) return;
  spellBook.page = Math.max(-1, Math.min(spellBookPages.length - 1, spellBook.page + direction));
  playNoise({ duration: 0.08, volume: 0.04, filterFrequency: 3000 });
  const entry = spellBookPages[spellBook.page];
  if (entry && entry.glitched) playTone({ frequency: 120, duration: 0.3, type: 'sawtooth', volume: 0.04, slideTo: 60 });
  if (entry && entry.locked) playTone({ frequency: 70, duration: 0.5, type: 'square', volume: 0.04 });
  if (entry && entry.flametomb) {
    // the page is warm... and something crackles
    for (let crackle = 0; crackle < 6; crackle += 1) setTimeout(() => playNoise({ duration: 0.06, volume: 0.05, filterFrequency: 2500 + Math.random() * 2000 }), crackle * 140 + Math.random() * 80);
    playTone({ frequency: 46, duration: 2.2, type: 'sawtooth', volume: 0.05, slideTo: 32 });
  }
  renderSpellBook();
}

// what the FLAMETOMB page says about learning it
function getFlametombBookStatus() {
  writeFlametombFlag(flametombReadKey);
  const learned = syncFlametombUnlock();
  if (learned) {
    return '<p class="flametomb-learned">FIRE MASTER APRENDIO ESTE HECHIZO. Tercera habilidad (R). ...Ojala nunca tenga que usarlo.</p>';
  }
  const requirements = getFlametombRequirements()
    .map((requirement) => `<li class="${requirement.done ? 'done' : ''}">${requirement.done ? '&#10003;' : '&#10007;'} ${requirement.text}</li>`)
    .join('');
  return `<div class="flametomb-requirements"><strong>Para que Fire Master lo aprenda:</strong><ul>${requirements}</ul></div>`;
}

function renderSpellBook() {
  const book = spellBook.element.querySelector('.spell-book');
  const page = spellBook.element.querySelector('.spell-book-page');
  const entry = spellBookPages[spellBook.page];
  book.className = 'moquete-book spell-book';
  if (spellBook.flipped) book.classList.add('back');
  else if (!entry) book.classList.add('cover');
  else if (entry.divider) book.classList.add('spell-divider');
  else book.classList.add(`spell-${entry.hero}`);
  if (entry && entry.tips) book.classList.add('spell-tips');
  spellBook.element.querySelector('[data-spell="prev"]').disabled = spellBook.flipped || spellBook.page < 0;
  spellBook.element.querySelector('[data-spell="next"]').disabled = spellBook.flipped || spellBook.page >= spellBookPages.length - 1;
  spellBook.element.querySelector('[data-spell="flip"]').innerText = spellBook.flipped ? 'DAR VUELTA DE NUEVO' : 'VOLTEAR';
  if (spellBook.flipped) {
    page.innerHTML = `
      <span class="moquete-book-kicker">CONTRATAPA</span>
      <h3>Advertencia del vendedor</h3>
      <p>Ningun hechizo de este libro funciona si lo lees en voz alta. Lo probe con todos. Mis vecinos llamaron a la policia.</p>
      <p>Si algun dia te sale uno, avisame. Te lo compro. Barato, obvio.</p>
      <p class="moquete-book-signature">- Scammer, mago aficionado y [[ESTAFADOR PROFESIONAL]]</p>`;
    return;
  }
  if (!entry) {
    page.innerHTML = `
      <span class="moquete-book-kicker">GRIMORIO ANTIGUO</span>
      <h2>LIBRO DE<br>HECHIZOS</h2>
      <div class="spell-cover-sigil" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="moquete-book-subtitle">Primera parte: la magia de los luchadores de Moquete.<br>Segunda parte: como improvisar con ella.<br>Recopilado por Scammer (con permiso de nadie).</p>`;
    return;
  }
  if (entry.divider) {
    page.innerHTML = `
      <span class="moquete-book-kicker">SEGUNDA PARTE</span>
      <h2>COMO IMPROVISAR<br>CON LA MAGIA</h2>
      <p class="moquete-book-subtitle">Ideas para mejorar y combinar los hechizos de la primera parte.</p>
      <p class="spell-tip-author">Escrito (casi todo) por Sorcerer, hechicero de las tres esferas.</p>
      <p class="spell-note">(Lo que no escribio el, lo escribi yo. Se nota cual es cual.) - Scammer</p>`;
    return;
  }
  if (entry.tips) {
    const tips = entry.list.map(([title, text], index) => `
      <li class="spell-entry spell-tip" style="--spell:#7e57c2">
        <span class="spell-tip-number" aria-hidden="true">${index + 1}</span>
        <span class="spell-text"><strong>${title}</strong><span>${text}</span></span>
        ${entry.locked && index % 2 === 0 ? '<button type="button" class="spell-lock" aria-label="Candado oscuro"></button>' : ''}
      </li>`).join('');
    const flametomb = entry.flametomb ? `
      <div class="flametomb" role="note">
        <span class="flametomb-stamp">PROHIBIDO</span>
        <span class="moquete-book-kicker">HECHIZO PROHIBIDO</span>
        <h3 class="flametomb-title">FLAMETOMB</h3>
        <p>Una tumba de fuego que no se apaga. Encierra al objetivo en llamas negras... y no lo deja salir. Nunca.</p>
        <p><strong>Peligrosidad:</strong> MORTAL. No se recomienda su uso bajo ninguna circunstancia.</p>
        <p><strong>Efectos secundarios:</strong> daños psicologicos en quien lo lanza. Pesadillas. Un olor a humo que no se va. Escuchar el fuego crepitar en el silencio, años despues.</p>
        <p class="flametomb-scratched">Para lanzarlo hay que <s>pronunciar el nombre de</s> <s>y dejar que el fuego</s> ████████</p>
        <p class="spell-tip-author">Fire Master lo uso una sola vez. No quiere hablar de eso. Yo tampoco. - S.</p>
        ${getFlametombBookStatus()}
        <p class="spell-note">(Intente arrancar esta pagina para venderla aparte. Me queme la mano. Y la pagina estaba FRIA.) - Scammer</p>
        <span class="flametomb-embers" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      </div>` : '';
    page.innerHTML = `
      <span class="moquete-book-kicker">${entry.kicker}</span>
      <h3 class="spell-title">${entry.title}</h3>
      <p class="spell-intro">${entry.intro}</p>
      <ul class="spell-list">${tips}</ul>
      ${flametomb}
      ${entry.locked ? '<div class="spell-chains" aria-hidden="true"></div><p class="spell-lock-hint">(Los candados estan frios. Muy frios.)</p>' : ''}
      ${entry.note ? `<p class="spell-tip-author">${entry.note}</p>` : ''}`;
    return;
  }
  const spells = entry.spells.map(([name, keys, description, color], index) => `
      <li class="spell-entry" style="--spell:${color}">
        <span class="spell-sigil" aria-hidden="true"></span>
        <span class="spell-text"><strong>${name}</strong> <em>${keys}</em><span>${description}</span></span>
        ${entry.locked && index % 2 === 0 ? '<button type="button" class="spell-lock" aria-label="Candado oscuro"></button>' : ''}
      </li>`).join('');
  page.innerHTML = `
    <span class="moquete-book-kicker">${entry.kicker}</span>
    <h3 class="spell-title">${entry.title}</h3>
    <p class="spell-intro">${entry.intro}</p>
    <ul class="spell-list">${spells}</ul>
    ${entry.locked ? '<div class="spell-chains" aria-hidden="true"></div><p class="spell-lock-hint">(Los candados estan frios. Muy frios.)</p>' : ''}
    <p class="spell-note">${entry.note}</p>`;
}

// ================= story books (Fire Master, Light Warrior, the Dark World) =================
function openShopReadable(id) {
  if (id === 'spellBook') openSpellBook();
  else if (id === 'moqueteBook') openMoqueteBook();
  else if (id === 'bookshelf') openBookshelf();
  else if (storyBooks[id]) openStoryBook(id);
}

const storyDrawings = {
  brothers: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Dos hermanos de la mano: uno naranja y uno celeste">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M10 130 L60 60 L95 100 L130 40 L180 110 L230 70 L230 130 Z" fill="#cfd8dc"/>
    <rect x="78" y="70" width="30" height="56" fill="#ff8f00" stroke="#111" stroke-width="2"/>
    <rect x="132" y="70" width="30" height="56" fill="#4fc3f7" stroke="#111" stroke-width="2"/>
    <path d="M93 84 L99 96 L93 104 L87 96 Z" fill="#ffd54f"/>
    <path d="M147 84 L153 96 L147 104 L141 96 Z" fill="#e1f5fe"/>
    <path d="M108 104 Q120 112 132 104" stroke="#111" stroke-width="3" fill="none"/>
    <text x="64" y="144" font-family="Comic Sans MS, cursive" font-size="10" fill="#e65100">el</text>
    <text x="146" y="144" font-family="Comic Sans MS, cursive" font-size="10" fill="#0277bd">su hermano</text>
  </svg>`,
  brothersScratched: `
  <svg class="moquete-book-drawing story-scratched" viewBox="0 0 240 150" aria-label="El dibujo de los hermanos, con el hermano de hielo tachado con fuerza">
    <rect x="2" y="2" width="236" height="146" fill="#e8dcc8" stroke="#3e2723" stroke-dasharray="4 3"/>
    <path d="M10 130 L60 60 L95 100 L130 40 L180 110 L230 70 L230 130 Z" fill="#9e9e9e"/>
    <rect x="78" y="70" width="30" height="56" fill="#ff8f00" stroke="#111" stroke-width="2"/>
    <rect x="132" y="70" width="30" height="56" fill="#4fc3f7" stroke="#111" stroke-width="2"/>
    <path d="M93 84 L99 96 L93 104 L87 96 Z" fill="#ffd54f"/>
    <path d="M120 60 L176 132 M176 58 L118 134 M116 70 L180 120 M180 70 L114 126 M124 52 L170 140 M170 50 L126 140 M112 95 L186 95 M114 84 L182 108 M114 110 L184 80" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <path d="M120 60 L176 132 M176 58 L118 134" stroke="#b71c1c" stroke-width="2"/>
    <text x="126" y="146" font-family="Comic Sans MS, cursive" font-size="10" fill="#b71c1c">perdon perdon perdon</text>
  </svg>`,
  stone: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Una piedra extraña brillando en la nieve">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <rect x="10" y="100" width="220" height="40" fill="#eceff1"/>
    <path d="M100 104 L120 70 L142 104 Z" fill="#455a64" stroke="#111" stroke-width="2"/>
    <path d="M114 88 L120 78 L126 88" stroke="#ff6d00" stroke-width="3" fill="none"/>
    <path d="M114 96 L120 86 L126 96" stroke="#40c4ff" stroke-width="3" fill="none"/>
    <circle cx="120" cy="86" r="34" fill="none" stroke="#ffd54f" stroke-dasharray="3 5"/>
    <text x="150" y="60" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">"la piedra que hablaba"</text>
  </svg>`,
  tower: `
  <svg class="moquete-book-drawing story-scratched" viewBox="0 0 240 150" aria-label="Una torre de fuego negro dibujada con trazos nerviosos">
    <rect x="2" y="2" width="236" height="146" fill="#1a1210" stroke="#3e2723"/>
    <path d="M100 140 Q90 100 110 80 Q96 60 116 40 Q108 20 120 6 Q132 20 124 40 Q144 60 130 80 Q150 100 140 140 Z" fill="#ff6d00"/>
    <path d="M112 140 Q106 110 118 90 Q110 70 120 50 Q130 70 122 90 Q134 110 128 140 Z" fill="#000"/>
    <path d="M30 20 L60 40 M200 30 L180 50 M40 120 L70 110 M210 120 L180 112" stroke="#ff1744" stroke-width="2"/>
    <text x="14" y="146" font-family="Comic Sans MS, cursive" font-size="10" fill="#ff8a80">no se apaga no se apaga no se apaga</text>
  </svg>`,
  frost: `
  <svg class="moquete-book-drawing story-scratched" viewBox="0 0 240 150" aria-label="Fire Master con el simbolo mitad fuego mitad hielo, caminando solo">
    <rect x="2" y="2" width="236" height="146" fill="#10131c" stroke="#263238"/>
    <rect x="20" y="40" width="40" height="80" fill="#1a237e" opacity="0.6"/>
    <rect x="66" y="20" width="34" height="100" fill="#0d47a1" opacity="0.5"/>
    <rect x="104" y="58" width="30" height="62" fill="#ff8f00" stroke="#000" stroke-width="2"/>
    <path d="M119 70 L127 84 L119 92 Z" fill="#b3e5fc"/>
    <path d="M119 70 L111 84 L119 92 Z" fill="#ffd54f"/>
    <path d="M140 120 h20 M164 120 h20 M188 120 h20" stroke="#cfd8dc" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="146" y="60" font-family="Comic Sans MS, cursive" font-size="11" fill="#90caf9">no puedo</text>
    <text x="156" y="76" font-family="Comic Sans MS, cursive" font-size="11" fill="#90caf9">parar</text>
  </svg>`,
  light: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Un bebe brillando como un pequeño sol">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <circle cx="120" cy="75" r="46" fill="#fff59d" opacity="0.6"/>
    <circle cx="120" cy="75" r="22" fill="#ffee58" stroke="#f9a825" stroke-width="2"/>
    <path d="M120 15 V35 M120 115 V135 M60 75 H80 M160 75 H180 M78 33 L92 47 M162 33 L148 47 M78 117 L92 103 M162 117 L148 103" stroke="#f9a825" stroke-width="3"/>
    <text x="14" y="144" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">"el bebe que no necesitaba velador"</text>
  </svg>`,
  friends: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Light Warrior con sus amigos">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <rect x="104" y="50" width="30" height="66" fill="#fdd835" stroke="#111" stroke-width="2"/>
    <rect x="62" y="70" width="22" height="46" fill="#4fc3f7" stroke="#111" stroke-width="2"/>
    <rect x="152" y="70" width="22" height="46" fill="#66bb6a" stroke="#111" stroke-width="2"/>
    <rect x="186" y="54" width="28" height="62" fill="#78909c" stroke="#111" stroke-width="2"/>
    <rect x="24" y="80" width="22" height="36" fill="#9e9e9e" stroke="#111" stroke-width="2"/>
    <text x="54" y="136" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">Celeste</text>
    <text x="146" y="136" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">Seto</text>
    <text x="180" y="136" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">el caballero</text>
    <text x="16" y="136" font-family="Comic Sans MS, cursive" font-size="10" fill="#6d4c41">Mochi</text>
  </svg>`,
  castle: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Dibujo de Scammer del castillo oscuro">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M40 140 V70 L55 50 L70 70 V140 Z M170 140 V70 L185 50 L200 70 V140 Z" fill="#311b92"/>
    <rect x="70" y="80" width="100" height="60" fill="#4a148c"/>
    <path d="M110 140 V112 Q120 100 130 112 V140 Z" fill="#000"/>
    <circle cx="100" cy="96" r="4" fill="#ea80fc"/><circle cx="140" cy="96" r="4" fill="#ea80fc"/>
    <text x="80" y="30" font-family="Comic Sans MS, cursive" font-size="11" fill="#c62828">EL CASTILLO</text>
    <text x="150" y="20" font-family="Comic Sans MS, cursive" font-size="9" fill="#c62828">(muy feo)</text>
  </svg>`,
  jester: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Dibujo de Scammer del bufon, con flechas y notas">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M100 40 L90 18 L110 32 L120 12 L130 32 L150 18 L140 40 Z" fill="#7b1fa2"/>
    <rect x="102" y="40" width="36" height="70" fill="#311b92" stroke="#111" stroke-width="2"/>
    <path d="M110 56 Q120 66 130 56" stroke="#fff" stroke-width="3" fill="none"/>
    <path d="M150 110 L190 50" stroke="#555" stroke-width="3"/><path d="M190 50 Q210 40 206 66" stroke="#555" stroke-width="3" fill="none"/>
    <text x="10" y="60" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828">NO es payaso</text>
    <text x="10" y="74" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828">(se enoja)</text>
    <text x="160" y="130" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828">azada!!</text>
  </svg>`,
  pet: `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Dibujo de la mascota del bufon, con los ojos rosa y amarillo">
    <rect x="2" y="2" width="236" height="146" fill="#fffdf2" stroke="#8d6e63" stroke-dasharray="4 3"/>
    <path d="M70 130 Q60 70 84 56 L78 30 L100 48 Q120 42 140 48 L162 30 L156 56 Q180 70 170 130 Z" fill="#050505" stroke="#fff" stroke-width="2"/>
    <rect x="98" y="70" width="10" height="10" fill="#ffd60a"/><rect x="132" y="70" width="10" height="10" fill="#ff8fc8"/>
    <path d="M96 94 H146" stroke="#fff" stroke-width="8"/>
    <text x="10" y="24" font-family="Comic Sans MS, cursive" font-size="10" fill="#c62828">"bebe" (mentira)</text>
    <text x="176" y="140" font-family="Comic Sans MS, cursive" font-size="9" fill="#c62828">mi cara :(</text>
  </svg>`,
};

// the last time Flametomb was used, and against whom ('iceMaster', 'neoScammer' or anything else)
function getFlametombLastVictim() {
  try {
    return localStorage.getItem('moqueteFlametombLastVictim') || '';
  } catch (error) {
    return '';
  }
}

function isFireBookDark() {
  const learned = typeof isFlametombUnlocked === 'function' && isFlametombUnlocked();
  const victim = getFlametombLastVictim();
  return learned && (victim === 'iceMaster' || victim === 'neoScammer');
}

const storyBooks = {
  fireBook: {
    title: 'FUEGO EN<br>LAS MANOS',
    subtitle: 'La historia de Fire Master, desde la primera chispa.<br>Biografia no autorizada, por Scammer.',
    theme: 'fire',
    pages: () => {
      const dark = isFireBookDark();
      const victim = getFlametombLastVictim();
      const pages = [
        { kicker: 'CAPITULO 1', title: 'Dos hermanos', text: [
          'En un pueblo al pie de la montaña nevada vivian dos hermanos. El mayor era inquieto y siempre tenia las manos calientes. El menor era tranquilo y nunca sentia frio.',
          'Hacian todo juntos: juntaban leña, se tiraban bolas de nieve, y se escapaban a la montaña aunque su madre les dijera que no.',
        ], drawing: dark ? 'brothersScratched' : 'brothers' },
        { kicker: 'CAPITULO 2', title: 'La piedra que hablaba', text: [
          'Una tarde de tormenta encontraron una piedra extraña en la nieve. Brillaba con dos colores: naranja de un lado, celeste del otro.',
          'Los dos la tocaron al mismo tiempo. El mayor sintio un calor que le subia por los brazos. El menor, un frio que no le molestaba en absoluto.',
          'Esa noche la cortina de su cuarto se prendio fuego. Y el agua del balde se congelo sola.',
        ], drawing: 'stone' },
        { kicker: 'CAPITULO 3', title: 'Aprender a no quemar', text: [
          'Al principio el fuego aparecia cuando el se enojaba, cuando se asustaba, cuando estornudaba. Quemo tres cortinas, una mesa y el sombrero del vecino.',
          'Su hermano lo ayudaba: le enfriaba las manos cuando se le escapaba una llama. "Respira", le decia. "El fuego te escucha si estas tranquilo."',
          'Asi aprendio la primera regla: el fuego no se fuerza. Se respira.',
        ] },
        { kicker: 'CAPITULO 4', title: 'El maestro de la montaña', text: [
          'Un viejo ermitaño de la montaña lo vio practicar y lo tomo como aprendiz. Le enseño a darle forma al fuego: una bola, un rayo, una ola.',
          'Años de entrenamiento despues, ya nadie en el pueblo lo llamaba por su nombre. Lo llamaban Fire Master.',
        ] },
        { kicker: 'CAPITULO 5', title: 'Caminos separados', text: [
          'Su hermano subio cada vez mas alto, hasta la cima donde nunca deja de nevar. Dijo que alla arriba se sentia en paz.',
          'Con los años el frio de la cima se fue volviendo eterno, y su hermano se convirtio en Ice Master. Dos maestros, dos caminos. Uno de fuego, uno de hielo.',
          'A veces todavia se cruzan en la montaña. A veces pelean. Pero siempre, al final, se dan la mano.',
        ], drawing: dark ? 'brothersScratched' : null },
        { kicker: 'CAPITULO 6', title: 'La regla que no se rompe', text: [
          'El maestro le enseño una ultima cosa antes de irse: hay un fuego que nunca se usa. Un fuego negro, que no se apaga.',
          '"Ese fuego no se controla, Fire Master. Te controla a vos."',
          'Fire Master hizo una promesa. Nunca usarlo. Nunca.',
        ] },
      ];
      if (!dark) {
        pages.push({ kicker: 'NOTA DEL AUTOR', title: 'Fin (por ahora)', text: ['Que historia, eh? Dos hermanos, fuego y hielo, la promesa... Me la conto Fire Master en persona. Bueno, me la conto su vecino. El del sombrero quemado.'], note: '- Scammer' });
        return pages;
      }
      // the dark version: someone wrote over the book
      pages[0].scrawl = 'yo lo cuidaba. YO LO CUIDABA.';
      pages[1].scrawl = 'ojala nunca la hubieramos tocado';
      pages[2].scrawl = 'RESPIRA RESPIRA RESPIRA no funciona';
      pages[2].text.push('...El ya no esta para decirmelo.');
      pages[4].scrawl = 'ya no. nunca mas.';
      pages[4].text.push('La ultima vez no hubo mano. Solo polvo.');
      pages[5].text.push('La rompio.');
      pages[5].scrawl = 'NUNCA NUNCA NUNCA NUNCA NUNCA';
      pages.push({ kicker: 'CAPITULO 7', title: 'La cima', text: [
        'Las paginas que siguen estan escritas con otra letra. Temblorosa. Apretada. Algunas palabras estan repasadas tantas veces que rompieron el papel.',
        'subi a la cima a pelear como siempre. como siempre. el se reia. me dijo que esta vez me iba a ganar.',
        'no se por que lo hice. habia una voz. dijo "solo una vez". dije que no tres veces. TRES VECES. la cuarta no pude.',
      ], drawing: 'tower', dark: true });
      pages.push({ kicker: 'CAPITULO 8', title: 'Polvo', text: [
        'el fuego subio y subio y no se apagaba. el no grito. eso es lo peor. no grito.',
        'cuando termino habia nieve y despues habia polvo. solo polvo. y una luz celeste flotando que no me dejaba de mirar.',
        'la agarre. no se por que. creo que para que no estuviera solo ahi arriba. esta adentro mio ahora.',
        'tengo frio en las manos. EL tenia frio en las manos.',
      ], drawing: 'brothersScratched', dark: true });
      pages.push({ kicker: 'CAPITULO 9', title: 'Lo que escucho', text: [
        'de noche escucho el fuego crepitar aunque este todo apagado.',
        'a veces escucho su voz diciendo "respira". respiro. no sirve.',
        'mama siempre decia que eramos uno de fuego y uno de hielo y que juntos haciamos agua tibia. ya no hay agua tibia.',
      ], dark: true });
      if (victim === 'neoScammer') {
        pages.push({ kicker: 'CAPITULO 10', title: 'Una ciudad azul', text: [
          'cerre los ojos en la montaña y los abri en una ciudad azul. no se como. no puedo parar de caminar. mis pies no son mios.',
          'monstruos cosidos con pedazos de otros. yo tambien estoy cosido ahora. mitad fuego. mitad el.',
          'un vendedor de lentes de colores me dijo que todo iba a estar bien. le crei. queria creerle.',
        ], drawing: 'frost', dark: true });
        pages.push({ kicker: 'CAPITULO 11', title: 'Otra vez', text: [
          'despues se puso una armadura y trato de borrarme de la historia. dijo que era un error.',
          'la voz volvio. no me pregunto esta vez. el fuego negro salio solo.',
          'el vendedor sobrevivio. creo. no me quede a mirar. no puedo mirar mas.',
          'lo hice otra vez. lo hice otra vez. lo hice otra vez.',
        ], dark: true });
        pages.push({ kicker: '???', title: 'Sorcerer', text: [
          'tengo que encontrar a Sorcerer. el sabe de magia. el escribio sobre la pagina del fuego negro. el tiene que saber como apagarlo.',
          'si no se puede apagar... que alguien me apague a mi.',
          'si alguien lee esto: no busquen la piedra. y si ven a un tipo de fuego caminando solo... no le tengan miedo. el tiene mas miedo que ustedes.',
        ], dark: true });
      } else {
        pages.push({ kicker: '???', title: '...', text: [
          'perdoname',
          'perdoname perdoname',
          'perdoname perdoname perdoname perdoname',
          'te llevo conmigo. para siempre. es lo unico que puedo hacer.',
        ], dark: true });
      }
      // what Scammer wrote at the end, when he read it back
      pages.push({ kicker: 'NOTA DEL AUTOR', title: '...', text: [
        'Yo no escribi las ultimas paginas. Cuando lo compre ya estaban asi. O aparecieron despues. No se.',
        'Iba a hacer un chiste aca. No me sale ninguno.',
        'Si alguien lo ve... digale que no esta solo. Aunque sea eso. Gratis.',
      ], note: '- Scammer' });
      return pages;
    },
  },
  lightBook: {
    title: 'LA LUZ QUE<br>SE CONTIENE',
    subtitle: 'La historia de Light Warrior.<br>Escrita por Scammer, revisada por nadie.',
    theme: 'light',
    pages: () => [
      { kicker: 'CAPITULO 1', title: 'Nacido con luz', text: [
        'Light Warrior no aprendio su poder: nacio con el. Dicen que la noche en que nacio no hizo falta prender ninguna vela. El bebe brillaba solo.',
        'No era una luz de lampara. Era una luz que calentaba, que curaba los raspones, que hacia crecer las flores del Bosque Lumina.',
      ], drawing: 'light' },
      { kicker: 'CAPITULO 2', title: 'Un don muy grande', text: [
        'Desde chico supo que su luz podia hacer cosas enormes. Demasiado enormes.',
        'Muchos se le acercaron con ideas: "Con ese poder podrias gobernar un reino." "Podrias tener todo lo que quieras." "Podrias ser invencible."',
      ] },
      { kicker: 'CAPITULO 3', title: 'La eleccion', text: [
        'Podria haber sido un tirano. Un conquistador. Alguien que buscara mas y mas poder.',
        'Eligio otra cosa. Eligio ser bueno. Ayudar a quien se cruzara en su camino, aunque fuera un desconocido. Aunque fuera un enemigo.',
        '"La luz no es para brillar mas que los demas", dice. "Es para que los demas puedan ver."',
      ] },
      { kicker: 'CAPITULO 4', title: 'Sus amigos', text: [
        'Light Warrior considera amigo a casi cualquiera que conoce. Celeste y Seto, los chicos de la plaza de Robledal. Mochi, el raton entrenador. Hasta un caballero de Valdoria que vino a capturarlo.',
        'A sus amigos los protege con todo. Literalmente con todo: les dio sus propios espiritus una vez.',
      ], drawing: 'friends' },
      { kicker: 'CAPITULO 5', title: 'La luz que se contiene', text: [
        'Lo que casi nadie sabe: Light Warrior pelea a una fraccion de su poder. Casi siempre.',
        'Contiene su luz la mayor parte del tiempo. Si la soltara entera, podria lastimar a quien tiene enfrente... o matarlo. Y eso es lo unico que nunca se perdonaria.',
        'Por eso sonrie, por eso bromea, por eso pelea "de mentira". Para que nadie note cuanto esfuerzo le cuesta no brillar de mas.',
      ] },
      { kicker: 'NOTA DEL AUTOR', title: 'Lo admito', text: [
        'Intente venderle lentes de sol. Me dijo que no le hacian falta, que el no se encandila con su propia luz. Despues me ayudo a cargar cajas. GRATIS. Que tipo raro.',
        '...Me cae bien. No le digan.',
      ], note: '- Scammer' },
      { kicker: 'PARTE EXTRA', title: 'Hola! Soy yo!', lightHand: true, text: [
        'Hola! Soy Light Warrior! Scammer me dejo escribir unas paginas al final. Bueno, "dejo"... me presto la lapicera a cambio de cargarle mas cajas.',
        'Queria decir que me encanto que me hicieran un libro! De verdad! Aunque no hacia falta que se molestaran. Yo no hice nada especial... solo trato de ayudar.',
        'Y lo de los lentes de sol era cierto, eh. No me encandilo. Pero gracias por la oferta!',
      ], note: '- L.W. :)' },
      { kicker: 'PARTE EXTRA', title: 'Sobre las cajas', lightHand: true, text: [
        'Scammer: no fue de nada lo de las cajas! En serio. Fue divertido. Pesaban bastante para ser "cajas vacias de nada sospechoso", pero bueno.',
        'Si necesitas ayuda otra vez, avisame. Y si algun dia queres hablar de por que vivis en un contenedor... tambien.',
        'Ah, y no estoy enojado por el capitulo donde decis que te caigo mal. Ya se que despues dijiste que te caigo bien. Lo lei. Je je.',
      ], note: '- L.W.' },
      { kicker: 'PARTE EXTRA', title: 'Algo que no es de aca', lightHand: true, text: [
        'Ahora algo mas serio. Hace un tiempo me cruce con una criatura que no parece de este mundo.',
        'Alta, dorada, con una presencia que pesa en el aire. Le dicen Divine General. No camina: aparece. No habla mucho, pero cuando habla, todo se queda quieto para escucharla.',
        'Lo raro es como pelea. Cada golpe que le das... aprende. Se vuelve inmune a eso. Como si estuviera hecha para no perder nunca.',
      ] },
      { kicker: 'PARTE EXTRA', title: 'Lo que senti', lightHand: true, text: [
        'No me ataco. Solo me miro. Y por primera vez en mucho tiempo senti que no tenia que contener mi luz... porque no iba a alcanzar.',
        'No se si es buena o mala. No se de donde vino. Su magia es tan rara que hasta en el Libro de Hechizos las letras se borran solas cuando hablan de ella.',
        'Si alguno se la cruza: no peleen. Saluden, sean amables y den un paso atras. Por las dudas.',
        'Bueno! No quiero terminar asustando a nadie. Cuidense mucho, lectores. Y sean buenos con quien se encuentren. Siempre vale la pena.',
      ], note: '- Light Warrior' },
    ],
  },
  darkGuide: {
    title: 'GUIA TURISTICA<br>DEL MUNDO OSCURO',
    subtitle: 'Todo lo que tenes que saber antes de visitar el otro lado.<br>Por Scammer, el unico turista que volvio (mas o menos).',
    theme: 'dark',
    pages: () => [
      { kicker: 'CAPITULO 1', title: 'Como llegar', text: [
        'No se llega. Te llevan. En mi caso, el aire del callejon se rompio como un vidrio y del otro lado habia un castillo.',
        'Consejo: si escuchas un ruido de vidrio y nadie rompio nada, CORRE. No mires. No preguntes. Corre.',
      ] },
      { kicker: 'CAPITULO 2', title: 'El castillo', text: [
        'Piedra negra, antorchas de fuego violeta, ventanas altas con luz de luna morada y banderas con los cuatro palos de la baraja.',
        'Decoracion: 3 de 10. Ambiente: 10 de 10 en terror. Ubicacion: lejisimos.',
      ], drawing: 'castle' },
      { kicker: 'CAPITULO 3', title: 'El anfitrion', text: [
        'Shadow Jester. Bufon, NO payaso (se ofende muchisimo). Sombrero de tres puntas, sonrisa de mas y una azada... guadaña... cosa filosa.',
        'Habla rapido, se emociona por todo y explica todo en cinco segundos. No vas a entender nada. Nadie entiende nada.',
      ], drawing: 'jester' },
      { kicker: 'CAPITULO 4', title: 'El Rey', text: [
        'El bufon menciono a "el Rey" varias veces. Dijo que el Rey le dio permiso para abrir el portal.',
        'No lo vi. Nadie lo vio. Pero cuando el bufon dice su nombre, las antorchas tiemblan.',
        'No pregunte mas. Un buen vendedor sabe cuando no hacer preguntas.',
      ] },
      { kicker: 'CAPITULO 5', title: 'La fauna local', text: [
        'Las "mascotas": negras, ojos rosa y amarillo, sonrisas de oreja a oreja. Se rien. Siempre se rien. El grande tiene cuatro patas y una cola que golpea fuerte (ver mi cara).',
        'Son "inofensivas" segun el bufon. El bufon miente.',
      ], drawing: 'pet' },
      { kicker: 'CAPITULO 6', title: 'Souvenirs y precios', text: [
        'Lentes de vidrio rosa y amarillo: incluidos, no se pueden sacar. Cicatriz: gratis. Visiones de "todo el juego de Moquete": gratis, no reembolsables.',
        'Lo que me traje: un dolor de cabeza y la sensacion de que alguien nos esta mirando desde arriba. Si, a vos tambien. Que lees esto.',
      ] },
      { kicker: 'NOTA DEL AUTOR', title: 'Calificacion final', text: [
        '1 estrella de 5. No volveria. Bueno, volveria si hay clientes. Hay clientes? Las mascotas no tienen billetera.',
      ], note: '- Scammer, turista involuntario' },
    ],
  },
};
const storyBook = { element: null, id: null, page: -1, pages: [] };

function openStoryBook(id) {
  if (!storyBook.element) {
    const overlay = document.createElement('div');
    overlay.className = 'moquete-book-overlay story-book-overlay hidden';
    overlay.innerHTML = `
      <div class="moquete-book story-book">
        <div class="moquete-book-page story-book-page"></div>
        <div class="moquete-book-controls">
          <button type="button" data-story="prev">&lt; ANTERIOR</button>
          <button type="button" data-story="next">SIGUIENTE &gt;</button>
          <button type="button" data-story="close">CERRAR</button>
        </div>
      </div>`;
    overlay.addEventListener('click', (event) => {
      const action = event.target.dataset ? event.target.dataset.story : null;
      if (event.target === overlay || action === 'close') overlay.classList.add('hidden');
      if (action === 'prev' || action === 'next') {
        storyBook.page = Math.max(-1, Math.min(storyBook.pages.length - 1, storyBook.page + (action === 'next' ? 1 : -1)));
        playNoise({ duration: 0.08, volume: 0.04, filterFrequency: 3000 });
        const entry = storyBook.pages[storyBook.page];
        if (entry && entry.dark) playTone({ frequency: 55, duration: 1.2, type: 'sawtooth', volume: 0.04, slideTo: 42 });
        renderStoryBook();
      }
    });
    document.body.appendChild(overlay);
    storyBook.element = overlay;
  }
  storyBook.id = id;
  storyBook.pages = storyBooks[id].pages();
  storyBook.page = -1;
  renderStoryBook();
  storyBook.element.classList.remove('hidden');
  playNoise({ duration: 0.12, volume: 0.05, filterFrequency: 1800 });
}

function renderStoryBook() {
  const data = storyBooks[storyBook.id];
  const book = storyBook.element.querySelector('.story-book');
  const page = storyBook.element.querySelector('.story-book-page');
  const entry = storyBook.pages[storyBook.page];
  const darkFire = storyBook.id === 'fireBook' && isFireBookDark();
  book.className = `moquete-book story-book story-${data.theme}${darkFire ? ' story-fire-dark' : ''}${entry ? '' : ' cover'}${entry && entry.dark ? ' story-page-dark' : ''}${entry && entry.lightHand ? ' story-page-light' : ''}`;
  storyBook.element.querySelector('[data-story="prev"]').disabled = storyBook.page < 0;
  storyBook.element.querySelector('[data-story="next"]').disabled = storyBook.page >= storyBook.pages.length - 1;
  if (!entry) {
    page.innerHTML = `
      <span class="moquete-book-kicker">${darkFire ? 'EDICION... ALTERADA' : 'EDICION DE BOLSILLO'}</span>
      <h2>${data.title}</h2>
      <p class="moquete-book-subtitle">${data.subtitle}</p>
      ${darkFire ? '<p class="story-cover-scrawl">no lo leas</p>' : ''}`;
    return;
  }
  const paragraphs = entry.text.map((text) => `<p>${text}</p>`).join('');
  page.innerHTML = `
    <span class="moquete-book-kicker">${entry.kicker}</span>
    <h3>${entry.title}</h3>
    ${paragraphs}
    ${entry.drawing ? storyDrawings[entry.drawing] : ''}
    ${entry.scrawl ? `<p class="story-scrawl">${entry.scrawl}</p>` : ''}
    ${entry.note ? `<p class="moquete-book-signature">${entry.note}</p>` : ''}`;
}

// the bookshelf: every owned book, in one place
function openBookshelf() {
  const books = [
    ['moqueteBook', 'La Historia de Moquete', '#b71c1c'],
    ['spellBook', 'Libro de Hechizos', '#4a148c'],
    ['fireBook', 'Fuego en las Manos', '#e65100'],
    ['lightBook', 'La Luz que se Contiene', '#f9a825'],
    ['darkGuide', 'Guia del Mundo Oscuro', '#1a0b2e'],
  ];
  let overlay = document.querySelector('.bookshelf-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'moquete-book-overlay bookshelf-overlay hidden';
    overlay.addEventListener('click', (event) => {
      const pick = event.target.closest('[data-shelf]');
      if (pick) {
        overlay.classList.add('hidden');
        openShopReadable(pick.dataset.shelf);
        return;
      }
      if (event.target === overlay || event.target.dataset.shelfClose) overlay.classList.add('hidden');
    });
    document.body.appendChild(overlay);
  }
  const owned = books.filter(([id]) => scammerShop.owned[id]);
  overlay.innerHTML = `
    <div class="bookshelf">
      <h3>Tu biblioteca</h3>
      <div class="bookshelf-row">
        ${owned.length ? owned.map(([id, name, color]) => `<button type="button" class="bookshelf-book" data-shelf="${id}" style="--book:${color}" title="${name}"><span>${name}</span></button>`).join('') : '<p class="bookshelf-empty">El estante esta vacio. Scammer tiene libros a la venta... casualmente.</p>'}
      </div>
      <div class="bookshelf-board"></div>
      <button type="button" data-shelf-close="1">CERRAR</button>
    </div>`;
  overlay.classList.remove('hidden');
  playNoise({ duration: 0.1, volume: 0.04, filterFrequency: 900 });
}
