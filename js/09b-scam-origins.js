// Moquete - Capitulo especial: los comienzos de Scammer
// (se carga entre la parte 9 y la 10)

// ---------------- the special chapter: before the dumpster ----------------
const originsStorageKey = 'moqueteOriginsUnlocked';
const originsArcadeProgressStorageKey = 'moqueteOriginsArcadeProgress';
const originsChapterButton = document.getElementById('originsArcadeChapterButton');
let originsOutroPlayed = false;
const originsLevelCount = 8;
const originsLevels = {
  1: { enemies: ['angryCustomer', 'angryCustomer'], difficulties: ['easy', 'easy'], map: 'originsMarket' },
  2: { enemies: ['policeOfficer'], difficulties: ['medium'], map: 'originsMarketDusk' },
  3: { enemies: ['policeOfficer', 'policeOfficer'], difficulties: ['medium', 'hard'], map: 'originsRooftops' },
  4: { enemies: ['policeSergeant'], difficulties: ['hard'], map: 'originsStation' },
  5: { enemies: ['policeChief'], difficulties: ['hard'], map: 'gamblerAlley' },
  6: { enemies: ['friendThing'], difficulties: ['medium'], map: 'originsNight' },
  7: { enemies: ['friendThing', 'friendThing', 'friendThing', 'friendThing'], difficulties: ['medium', 'medium', 'hard', 'hard'], map: 'originsRooftopsDark', health: 110 },
  8: { enemies: ['bigFriend'], difficulties: ['hard'], map: 'originsAlleyDark' },
};
const originsVariants = ['angryCustomer', 'policeOfficer', 'policeSergeant', 'policeChief', 'friendThing', 'bigFriend'];
const originsHealth = { angryCustomer: 75, policeOfficer: 120, policeSergeant: 170, policeChief: 260, friendThing: 160, bigFriend: 340 };
const originsNames = { angryCustomer: 'Cliente Enojado', policeOfficer: 'Policia', policeSergeant: 'Sargento', policeChief: 'Comisario', friendThing: 'Amigo', bigFriend: 'Amigo Grande' };
// the friends use the special-variant stats too (size, speed, damage)
['friendThing', 'bigFriend'].forEach((variant) => {
  if (!arcadeBossVariants.includes(variant)) arcadeBossVariants.push(variant);
});
const originsSizes = { angryCustomer: [60, 120], policeOfficer: [60, 120], policeSergeant: [60, 120], policeChief: [68, 132], friendThing: [64, 124], bigFriend: [150, 176] };
const originsSpeeds = { angryCustomer: 0.85, policeOfficer: 0.95, policeSergeant: 0.95, policeChief: 0.95, friendThing: 1.05, bigFriend: 0.8 };
const originsDamage = { angryCustomer: 0.8, policeOfficer: 1, policeSergeant: 1.15, policeChief: 1.3, friendThing: 1, bigFriend: 1.3 };
const originsIntroLines = {
  1: [
    { speaker: 'scammer', text: 'Ahh... otro dia mas sin una sola moneda. Ni para un caramelo me alcanza.', wander: true },
    { speaker: 'scammer', text: 'Todos en este mercado venden algo: frutas, pan, pescado... Y yo? Yo no tengo NADA que vender.', wander: true },
    { speaker: 'scammer', text: 'Y encima tengo una sed... Menos mal que la fuente de la plaza es gratis.', toFountain: true },
    { speaker: 'scammer', text: 'PFFF! AY! Me salpico toda la cara! Esta agua esta... esta...', splash: true, emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'scammer', text: '...mojada. El agua esta MOJADA.', ponder: true, emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'scammer', text: 'AGUA... MOJADA! ESO ES! UNA IDEA MILLONARIA!', idea: true, emote: { who: 'gambler', symbol: '$' } },
    { speaker: 'scammer', text: 'Hay agua con gas, agua con sabor, agua mineral... pero NADIE vende agua MOJADA! Soy un GENIO!', idea: true },
    { speaker: 'scammer', text: 'Botellas viejas del contenedor, un cartel pintado a mano y la fuente gratis. Costo: CERO. Precio de venta: CINCO MONEDAS!', build: true },
    { speaker: 'origNarrator', text: 'Una hora y 30 botellas vendidas despues...', later: true },
    { speaker: 'scammer', text: 'AGUA MOJADA! AGUA MOJADA! LA UNICA AGUA DEL MERCADO QUE VIENE MOJADA DE FABRICA!' },
    { speaker: 'customer', text: 'Vos! Me vendiste esta botella por 5 monedas... y adentro hay AGUA.', mood: 'angry', customerIn: true },
    { speaker: 'scammer', text: 'Si? Agua mojada, como dice el cartel. Producto 100% original, señor!' },
    { speaker: 'customer', text: 'QUIERO UN REEMBOLSO!', emote: { who: 'scammer', symbol: '#!' } },
    { speaker: 'scammer', text: 'Un... re... reem... (que palabra mas fea. Me da escalofrios.)', emote: { who: 'gambler', symbol: '...' } },
    { speaker: 'customer', text: 'Y mi hermano tambien quiere uno! Ya viene para aca!' },
    { speaker: 'scammer', text: 'Primera leccion de negocios: el cliente siempre tiene razon. Segunda leccion: ...a veces hay que discutirlo A LAS PIÑAS!' },
  ],
  2: [
    { speaker: 'police', text: 'Alto ahi! Recibimos 47 denuncias de un vendedor de "agua mojada".' },
    { speaker: 'scammer', text: '47?! Eso es un EXITO DE VENTAS, oficial! Gracias por avisar!', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'police', text: 'Tenes permiso para vender en la via publica?' },
    { speaker: 'scammer', text: 'Permiso? Claro! Lo tengo en casa. En mi otra casa. La que todavia no compre.' },
    { speaker: 'police', text: 'Quedas detenido!' },
    { speaker: 'scammer', text: 'Oficial, oficial... le interesa un descuento del 0%? No? ENTONCES CON PERMISO!' },
  ],
  3: [
    { speaker: 'scammer', text: 'Haah... haah... los techos son un lugar ideal para pensar un plan de negocios!' },
    { speaker: 'police', text: 'Ahi esta! Arriba del techo!' },
    { speaker: 'police', text: 'No tenes a donde ir, vendedor! Somos dos!' },
    { speaker: 'scammer', text: 'Dos clientes al mismo tiempo! Hoy es mi dia de SUERTE!' },
  ],
  4: [
    { speaker: 'sergeant', text: 'Asi que vos sos el famoso vendedor de agua mojada. Mis muchachos no pudieron con vos.' },
    { speaker: 'scammer', text: 'Sargento! Que honor! Le puedo ofrecer una GARANTIA EXTENDIDA para su silbato?' },
    { speaker: 'sergeant', text: 'Lo unico extendido aca va a ser tu condena.' },
    { speaker: 'scammer', text: 'Ja ja! Eso fue muy gracioso. Le cobro por el chiste? No? Bueno, hoy es gratis!' },
    { speaker: 'sergeant', text: 'FWEEEEET!', emote: { who: 'scammer', symbol: '!!' } },
  ],
  5: [
    { speaker: 'chief', text: 'Se termino la funcion. Soy el Comisario de esta ciudad y nunca... NUNCA perdi a un sospechoso.' },
    { speaker: 'scammer', text: 'Comisario! Justo lo que me faltaba: un cliente VIP!' },
    { speaker: 'chief', text: 'Te tengo acorralado en este callejon. No hay mas salida que la carcel.' },
    { speaker: 'scammer', text: '...O ese contenedor tan acogedor. Mire que lindo! Tiene tapa y todo!', emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'chief', text: 'Ni se te ocurra.' },
    { speaker: 'scammer', text: 'Ultima oferta del dia, comisario: usted se va... y yo no pago nada. TRATO?' },
    { speaker: 'chief', text: 'A LAS ESPOSAS!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  ],
  // the "friends": they almost never talk... they only laugh (and Scammer gets more scared each time)
  6: [
    { speaker: 'scammer', text: 'JA! Los perdi! Ni la policia se mete en el mercado de noche. Soy un genio de la fuga!' },
    { speaker: 'scammer', text: 'Que tranquilo... Los puestos cerrados, la calle vacia... Mañana vuelvo a abrir el negocio. Agua mojada para todos!' },
    { speaker: 'friend', text: 'je.', laugh: 'distant', bgEyes: 1, fear: 1 },
    { speaker: 'scammer', text: '...H-hola? Oficial? Si es usted, le aviso que el agua mojada se agoto.', emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'friend', text: 'Je je je...', laugh: 'soft', friendIn: true },
    { speaker: 'scammer', text: 'V-vos... no sos policia. Que sos? Un gato? Un perro muy oscuro? Un cliente MUY insatisfecho?', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'friend', text: '...' },
    { speaker: 'scammer', text: 'M-mira, no se que sos, pero tengo una regla: el que sonrie asi NO paga en efectivo. Fuera de mi mercado!' },
    { speaker: 'friend', text: 'JE JE JE JE JE', laugh: 'normal' },
  ],
  7: [
    { speaker: 'scammer', text: 'Me siguio... ESA COSA ME SIGUIO! Si subo bien alto no me va a alcanzar... no?' },
    { speaker: 'friend', text: 'je je.', laugh: 'high', bgEyes: 2 },
    { speaker: 'scammer', text: '...P-por que eso sono desde ARRIBA?', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'friend', text: 'Je je je je...', laugh: 'soft', friendIn: true },
    { speaker: 'friend', text: 'je je', laugh: 'high', bgEyes: 4 },
    { speaker: 'friend', text: 'Je je je je je je...', laugh: 'many', bgEyes: 6 },
    { speaker: 'scammer', text: 'Uno... dos... tres... CUATRO?! Se multiplican?! Nadie me dijo que se multiplicaban!', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'scammer', text: 'O-okay. Respira, emprendedor. Son solo cuatro sonrisas gigantes en la oscuridad. Nada raro. NADA RARO!' },
  ],
  8: [
    { speaker: 'scammer', text: 'N-no... no, no, no. El callejon. Sin salida. Por que siempre termino en el callejon?' },
    { speaker: 'friend', text: 'je', laugh: 'distant', bgEyes: 3 },
    { speaker: 'friend', text: 'je je', laugh: 'soft', bgEyes: 6 },
    { speaker: 'friend', text: 'je je je je je je je je', laugh: 'many', bgEyes: 12 },
    { speaker: 'scammer', text: 'Q-que quieren?! Plata? No tengo! Agua mojada? Me queda UNA botella! T-tomenla! Es gratis! GRATIS!', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'friend', text: '...', friendIn: true },
    { speaker: 'friend', text: 'Je.', laugh: 'deep' },
    { speaker: 'scammer', text: '...E-ese no es un gato. Ese no es NADA que yo haya visto en mi vida.' },
    { speaker: 'friend', text: 'JE JE JE JE JE JE JE', laugh: 'deep' },
  ],
};
// level 5: he beats the Chief and runs away... and something was watching from the dumpster
const originsFleeLines = [
  { speaker: 'scammer', text: 'JA! Le gane al mismisimo Comisario! Soy imparable! Soy un genio! Soy...' },
  { speaker: 'police', text: 'POR ACA! LO VIMOS ENTRAR AL CALLEJON!' },
  { speaker: 'scammer', text: '...un genio muy buscado. Uy. Hora de cerrar el negocio por hoy!', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'scammer', text: 'Adios, oficiales! Pasen por mi puesto cuando quieran... que yo no voy a estar!', run: true },
  { speaker: 'police', text: 'Se escapo otra vez... Vamos, muchachos. Ya va a aparecer.', dark: true },
  { speaker: 'friend', text: '...', eyes: true },
  { speaker: 'friend', text: 'je... je je...', laugh: 'soft' },
  { speaker: 'friend', text: 'JE JE JE JE JE JE', laugh: 'normal', wide: true },
];
// level 8: the end of the chapter. He runs, he fights, he runs again... until he hides, and finds the glasses
const originsOutroLines = [
  { speaker: 'scammer', text: 'Haah... haah... se... se cayo. El grandote... se cayo.', place: 'alley', bigDown: true },
  { speaker: 'scammer', text: 'J-ja... JA! LE GANE! Le gane al grandote! Soy un GENIO! Soy imparable! Soy...', celebrate: true, bigDown: true },
  { speaker: 'friend', text: '...je.', laugh: 'deep', tailDodge: true },
  { speaker: 'scammer', text: 'UAH! P-por poco! ...Ja. Ja ja! Fallaste, gatote! Ves? Soy demasiado rap...', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'friend', text: '. . .', tailHit: true },
  { speaker: 'scammer', text: '...', hurt: true, tragic: true, ring: true },
  { speaker: 'scammer', text: 'Mi... cara...', hurt: true, tragic: true },
  { speaker: 'scammer', text: 'Toda mi vida quise ser alguien. Tener un negocio. Que la gente me mirara...', hurt: true, tragic: true },
  { speaker: 'friend', text: 'je.', laugh: 'soft', hurt: true, tragic: true },
  { speaker: 'scammer', text: '...y ahora lo unico que me mira... son ustedes.', swarm: true },
  { speaker: 'friend', text: 'JE JE JE JE JE JE JE', laugh: 'deep' },
  { speaker: 'scammer', text: 'No no no no. Me voy. ME VOY!', emote: { who: 'gambler', symbol: '!' }, run: true },
  { speaker: 'scammer', text: 'Haah... haah... el mercado... Los puestos, el farol... no hay nadie. Nadie se rie.', place: 'market', relief: true },
  { speaker: 'scammer', text: '...Los perdi. Creo que los perdi. Fiuuu... Estoy a salvo. ESTOY A SALVO!', relief: true },
  { speaker: 'scammer', text: '...Eh? Ese no es el señor del reembolso? Y su hermano? ...Estan durmiendo. En el piso. Bueno... que descansen.', fear: 2 },
  { speaker: 'friend', text: 'je je.', laugh: 'soft', friends: 2, fear: 3 },
  { speaker: 'scammer', text: 'NO. No no no. A-ATRAS! Tengo agua mojada y NO tengo miedo de usarla!', action: 'throw' },
  { speaker: 'friend', text: 'Je je je je...', laugh: 'normal' },
  { speaker: 'scammer', text: 'La... la atraveso. LA BOTELLA LO ATRAVESO!', run: true },
  { speaker: 'scammer', text: 'Los techos... Aca arriba nadie me va a encontrar...', place: 'roofs', relief: true },
  { speaker: 'scammer', text: 'Silencio. Solo el viento. Je... je je. Lo logre. Esta vez si.', relief: true },
  { speaker: 'scammer', text: '...Los oficiales que me perseguian. Tambien se durmieron. Aca arriba. Con este frio. ...Que raro.', fear: 2 },
  { speaker: 'friend', text: 'je.', laugh: 'high', friends: 3, fear: 3 },
  { speaker: 'scammer', text: 'B-bueno! Si no puedo huir, PELEO! Carrito del mercado, AL ATAQUE!', action: 'cart' },
  { speaker: 'friend', text: 'JE JE JE JE JE', laugh: 'many' },
  { speaker: 'scammer', text: 'Ni se movieron... NI SE MOVIERON!', run: true },
  { speaker: 'scammer', text: 'LA COMISARIA! Oficial! Comisario! Estoy salvado! ARRESTENME, POR FAVOR!', place: 'station', relief: true },
  { speaker: 'scammer', text: '...Sargento? Comisario? Por que estan todos durmiendo en la vereda? ...Despierten. Por favor, despierten.', fear: 2 },
  { speaker: 'friend', text: '...', windows: true, fear: 3 },
  { speaker: 'friend', text: 'je je je je je je je', laugh: 'many' },
  { speaker: 'scammer', text: '...Ni la policia puede salvarme.', run: true },
  { speaker: 'scammer', text: 'El callejon otra vez... No puedo correr. No puedo pelear. No puedo mas...', place: 'bin' },
  { speaker: 'scammer', text: '...Solo me queda esconderme.', bin: true },
  { speaker: 'scammer', text: 'Oscuro... silencioso... Nadie se rie aca adentro. Por favor, que nadie se ria.', inside: true },
  { speaker: 'scammer', text: 'Hm? Algo brilla en el fondo... Que es esto?', glasses: true },
  { speaker: 'scammer', text: 'Unos lentes. Un vidrio rosa... y un vidrio amarillo.' },
  { speaker: 'scammer', text: '......', wear: true },
  { speaker: 'friend', text: '...je?', laugh: 'soft', eyes: true },
  { speaker: 'scammer', text: 'Los veo. Los veo a todos. Y ellos... me ven a mi. Como si fuera uno de ellos.' },
  { speaker: 'friend', text: 'Je je je!', laugh: 'high', happy: true },
  { speaker: 'scammer', text: '...Ya no se rien DE mi. Se rien CONMIGO.', calm: true },
  { speaker: 'scammer', text: 'Bueno, amigos... si vamos a vivir juntos, alguien tiene que pagar el alquiler. Quien quiere comprar agua mojada?' },
  { speaker: 'scammer', text: 'Y asi nacio el Scammer que todos conocen: lentes rosa y amarillo, un contenedor de lujo... y los socios mas raros del mundo. FIN... de los comienzos.' },
];
const originsWinPhrases = ['Gracias por su compra! No se aceptan reembolsos!', 'Otro cliente satisfecho! ...Bueno, satisfecho no. Pero cliente si.', 'Esto merece un cartel: VENDEDOR DEL MES (yo).'];
const originsPolicePhrases = ['Quedas detenido, vendedor.', 'Tenes derecho a guardar silencio. Por favor. Usalo.', 'Se acabo el agua mojada.'];
const originsFriendWinPhrases = ['S-si! Gane! ...Ya se fue? Por favor decime que ya se fue.', 'N-no vuelvas! ...En serio. No vuelvas.', 'Gane... gane... pero por que se sigue escuchando la risa?'];

function pickOriginsWinPhrase(opponent) {
  if (player1.originsCrazy) return 'Je... je je... Lo vi todo. TODO. ...Quien es Moquete?';
  // after the ending: calm, with his new glasses... and his new partners
  if (player1.youngGlasses) return 'Bienvenidos a mi tienda, amigos. Je je. No se aceptan reembolsos.';
  const list = isFriendThing(opponent) ? originsFriendWinPhrases : originsWinPhrases;
  return list[Math.floor(Math.random() * list.length)];
}

function isOriginsUnlocked() {
  try {
    return localStorage.getItem(originsStorageKey) === '1';
  } catch (error) {
    return false;
  }
}

function syncOriginsChapterButton() {
  if (originsChapterButton) originsChapterButton.classList.toggle('hidden', !isOriginsUnlocked());
}

// the hidden spot of the book: the barcode on the back cover
function unlockOriginsChapter() {
  if (isOriginsUnlocked()) {
    showCustomToast('CAPITULO ESPECIAL', 'Ya lo encontraste. Esta antes del capitulo 1, en el modo Arcade.');
    return;
  }
  try {
    localStorage.setItem(originsStorageKey, '1');
  } catch (error) {
    // only this session
  }
  syncOriginsChapterButton();
  showCustomToast('CAPITULO ESPECIAL DESBLOQUEADO', 'Los comienzos de Scammer: antes del contenedor, antes de los lentes... cuando solo vendia agua mojada. Lo encontras en Arcade, antes del capitulo 1.');
  playSound('achievement');
  playSound('cutsceneLaugh');
}

function isOriginsArcade() {
  return normalArcadeActive && arcadeChapter === 'origins';
}

// the young Scammer: red suit, no glasses, a happy face
function makeYoungScammer(fighter) {
  fighter.setCharacterType('gambler', 'scammer');
  fighter.youngScammer = true;
  // (more scared with every level of the friends)
  fighter.originsFear = arcadeChapter === 'origins' && selectedNormalArcadeLevel >= 6 ? selectedNormalArcadeLevel - 5 : 0;
  fighter.youngGlasses = false;
  fighter.youngScar = false;
  fighter.originsCrazy = false;
  fighter.originsDizzy = false;
  if (arcadeChapter === 'origins' && selectedNormalArcadeLevel === originsSecretLevel) {
    // the secret level: some time later... the glasses, the scar, and a mind that is not quite right anymore
    fighter.originsFear = 0;
    fighter.youngGlasses = true;
    fighter.youngScar = true;
    fighter.originsCrazy = true;
  }
  resetYoungScammer(fighter);
  fighter.setColor('#c62828');
  fighter.setMaxHealth(150);
  fighter.health = fighter.maxHealth;
}

function configureOriginsLevel() {
  const levelData = originsLevels[selectedNormalArcadeLevel] || originsLevels[1];
  makeYoungScammer(player1);
  if (selectedNormalArcadeLevel === originsSecretLevel) {
    configureOriginsSecretLevel();
    return;
  }
  selectedMap = levelData.map;
  botEnabled = true;
  normalArcadeEnemiesRemaining = levelData.enemies.length - 1;
  normalArcadeEnemyIndex = 1;
  originsOutroPlayed = false;
  configureOriginsEnemy();
}

function configureOriginsEnemy() {
  if (selectedNormalArcadeLevel === originsSecretLevel) {
    configureOriginsSecretEnemy();
    return;
  }
  const levelData = originsLevels[selectedNormalArcadeLevel] || originsLevels[1];
  const index = Math.min(levelData.enemies.length - 1, normalArcadeEnemyIndex - 1);
  player2.setCharacterType('normal', levelData.enemies[index]);
  botDifficulty = levelData.difficulties[index] || 'medium';
  applyBotDifficulty();
  player2.setMaxHealth(levelData.health || originsHealth[levelData.enemies[index]]);
  player2.health = player2.maxHealth;
  resetPolice(player2);
  resetFriendThing(player2);
  // the second friend of the rooftops arrives laughing
  if (isFriendThing(player2) && normalArcadeEnemyIndex > 1) playFriendLaugh('high');
  updateHealthBars();
  updateCombatHudIdentity();
}

function syncOriginsChapterUI() {
  const levelTitles = ['Agua mojada', 'Vendedor sin permiso', 'Persecucion por los techos', 'El sargento', 'El comisario', 'Algo me sigue', 'Mas amigos', 'Los amigos', isOriginsSecretUnlocked() ? 'El bufon y su mascota' : '???'];
  const levelDescriptions = [
    'Un joven sin una moneda, una fuente gratis y una idea millonaria: agua mojada a 5 monedas. Que podria salir mal?',
    'Al atardecer llega la ley. 47 denuncias y ni un solo permiso.',
    'La policia lo persigue por los techos de la ciudad. Hay que encontrar una salida... o venderla.',
    'Frente a la comisaria espera el sargento, con su silbato y muy poca paciencia.',
    'Acorralado en un callejon, frente al Comisario. Gane o pierda... algo lo esta mirando desde el contenedor.',
    'Se escapo de la policia, pero en el mercado vacio, de noche, algo se rie. Un ojo rosa. Un ojo amarillo.',
    'Por los techos, los ojos aparecen de a dos. No hablan. Solo se rien.',
    'De vuelta en el callejon, rodeado de sonrisas. El mas grande de todos espera... y el contenedor es la unica salida.',
    isOriginsSecretUnlocked() ? 'Secreto. Tiempo despues, el aire del callejon se rompe como un vidrio... y del otro lado alguien busca a su mascota.' : 'Nivel secreto. Supera el capitulo en HARDCORE o HARDERCORE para desbloquearlo.',
  ];
  normalArcadeLevelButtons.forEach((levelButton, index) => {
    const title = levelButton.querySelector('.arcade-level-copy strong');
    const description = levelButton.querySelector('.arcade-level-copy span');
    if (title) title.innerText = levelTitles[index] || '???';
    if (description) description.innerText = levelDescriptions[index] || '';
  });
  arcadeLevelsTitle.innerText = 'Capitulo especial: los comienzos de Scammer';
  arcadeStoryKicker.innerText = 'Antes del contenedor';
  arcadeStoryParagraphOne.innerText =
    'Hace mucho tiempo, antes de los lentes, antes del contenedor y antes de las 47 demandas, un joven de traje rojo abrio su primer negocio con una sonrisa y una gran idea: vender agua mojada.';
  arcadeStoryParagraphTwo.innerText =
    'Los clientes no estaban contentos. La policia, menos. Y en la oscuridad, unas cosas de ojos rosa y amarillo empezaron a reirse... Esta es la historia de como el emprendedor mas honesto de la ciudad termino viviendo en la basura, con sus nuevos "amigos".';
}

function startOriginsIntro() {
  if (selectedNormalArcadeLevel === originsSecretLevel) {
    startOriginsSecretIntro();
    return;
  }
  const lines = originsIntroLines[selectedNormalArcadeLevel];
  if (!lines) return;
  const opening = selectedNormalArcadeLevel === 1;
  const hidden = opening || selectedNormalArcadeLevel >= 6;
  // (in level 6 he is still happy... until the laugh)
  if (selectedNormalArcadeLevel === 6) player1.originsFear = 0;
  ch6CutsceneBase('originsIntro', lines, 'dialog', {
    gamblerX: opening ? 160 : 230,
    gamblerTargetX: opening ? 420 : 230,
    scammerX: hidden ? canvas.width + 120 : 680,
    scammerTargetX: hidden ? canvas.width + 120 : 680,
    scammerY: 0,
    opening,
    hideEnemy: hidden,
    bgEyes: 0,
    stallHidden: opening,
    splashDrops: [],
    puffs: [],
    ideaGlow: 0,
    laterFade: 0,
    lastFlagLine: -1,
  });
  startCutsceneLine(0);
}

// level 1: Scammer has nothing, gets splashed by the fountain... and has his million-coin idea
function updateOriginsIntro(cutscene) {
  if (cutscene.phase !== 'dialog') return;
  if (cutscene.routeB3) {
    updateRouteB3Intro(cutscene);
    return;
  }
  if (cutscene.secret) {
    updateOriginsSecretIntro(cutscene);
    return;
  }
  const line = cutscene.lines[cutscene.lineIndex];
  const firstFrame = cutscene.lastFlagLine !== cutscene.lineIndex;
  cutscene.lastFlagLine = cutscene.lineIndex;
  // the first laugh he hears is when the fear starts
  if (typeof line.fear === 'number' && firstFrame) {
    player1.originsFear = line.fear;
    playSound('cutsceneSurprise');
  }
  // the friends: eyes in the dark... and then one of them steps out of the shadows
  if (line.bgEyes) cutscene.bgEyes = Math.max(cutscene.bgEyes, line.bgEyes);
  if (line.friendIn && cutscene.hideEnemy) {
    cutscene.hideEnemy = false;
    cutscene.scammerX = 680;
    cutscene.scammerTargetX = 680;
    for (let puff = 0; puff < 22; puff += 1) {
      cutscene.puffs.push({ x: 680 + Math.random() * player2.width, y: ground - Math.random() * player2.height, r: 12 + Math.random() * 16, life: 40 + Math.random() * 25, dark: true });
    }
  }
  if (!cutscene.opening) {
    updateOriginsPuffs(cutscene);
    return;
  }
  const headX = cutscene.gamblerX + player1.width / 2;
  const headY = ground - player1.height + 30;
  if (line.wander) {
    // walking around the market with empty pockets
    if (Math.abs(cutscene.gamblerX - cutscene.gamblerTargetX) < 2) cutscene.gamblerTargetX = cutscene.gamblerTargetX > 300 ? 140 : 420;
  } else if (line.toFountain || line.splash || line.ponder) {
    cutscene.gamblerTargetX = 478;
    // a thirsty walk is a fast walk; the splash always catches him at the fountain
    cutscene.gamblerX = line.toFountain ? moveToward(cutscene.gamblerX, 478, 2.6) : 478;
  } else if (line.idea) {
    cutscene.gamblerTargetX = 430;
  } else {
    cutscene.gamblerTargetX = 230;
  }
  if (line.splash && firstFrame) {
    playNoise({ duration: 0.3, volume: 0.06, filterFrequency: 2400 });
    for (let drop = 0; drop < 26; drop += 1) {
      cutscene.splashDrops.push({ x: 600 + (Math.random() - 0.5) * 20, y: ground - 112, vx: -2 - Math.random() * 5, vy: -4 - Math.random() * 5, life: 50 + Math.random() * 30 });
    }
  }
  if (line.idea) cutscene.ideaGlow = Math.min(1, cutscene.ideaGlow + 0.05);
  else cutscene.ideaGlow = Math.max(0, cutscene.ideaGlow - 0.05);
  if (line.idea && firstFrame && cutscene.lines[cutscene.lineIndex - 1] && !cutscene.lines[cutscene.lineIndex - 1].idea) {
    playTone({ frequency: 1320, duration: 0.25, type: 'triangle', volume: 0.07, slideTo: 1760 });
  }
  if (line.build && firstFrame) {
    // poof! the stall appears
    cutscene.stallHidden = false;
    playSound('cutsceneCash');
    for (let puff = 0; puff < 18; puff += 1) {
      cutscene.puffs.push({ x: 560 + Math.random() * 90, y: ground - 20 - Math.random() * 70, r: 10 + Math.random() * 14, life: 40 + Math.random() * 20 });
    }
  }
  if (line.later) cutscene.laterFade = Math.min(1, cutscene.laterFade + 0.05);
  else cutscene.laterFade = Math.max(0, cutscene.laterFade - 0.04);
  if (line.customerIn) {
    cutscene.hideEnemy = false;
    cutscene.scammerTargetX = 680;
  }
  cutscene.splashDrops.forEach((drop) => {
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vy += 0.35;
    drop.life -= 1;
  });
  cutscene.splashDrops = cutscene.splashDrops.filter((drop) => drop.life > 0 && drop.y < ground);
  updateOriginsPuffs(cutscene);
  cutscene.headX = headX;
  cutscene.headY = headY;
}

function updateOriginsPuffs(cutscene) {
  cutscene.puffs.forEach((puff) => {
    puff.life -= 1;
    puff.r += 0.5;
    puff.y -= 0.4;
  });
  cutscene.puffs = cutscene.puffs.filter((puff) => puff.life > 0);
}

function drawOriginsIntroFx(cutscene) {
  const time = performance.now() / 1000;
  if (cutscene.routeB3) {
    drawRouteB3IntroFx(cutscene);
    return;
  }
  if (cutscene.secret) {
    drawOriginsSecretIntroFx(cutscene);
    return;
  }
  if (selectedNormalArcadeLevel >= 6) drawOriginsDread(0.85);
  for (let pair = 0; pair < Math.min(cutscene.bgEyes || 0, friendEyeSpots.length); pair += 1) {
    const [eyeX, eyeY] = friendEyeSpots[pair];
    drawFriendEyePair(eyeX, eyeY, 7, 0.9, false, time + pair * 1.7);
  }
  cutscene.puffs.forEach((puff) => {
    ctx.fillStyle = puff.dark ? `rgba(10, 4, 18, ${Math.min(0.9, puff.life / 30)})` : `rgba(255, 255, 255, ${Math.min(0.9, puff.life / 30)})`;
    ctx.beginPath();
    ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (!cutscene.opening) return;
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  const headX = cutscene.gamblerX + player1.width / 2;
  const topY = ground - player1.height;
  if (line && line.wander) {
    // empty pockets turned out, and a lonely fly
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(cutscene.gamblerX - 8, topY + 70, 10, 14);
    ctx.fillRect(cutscene.gamblerX + player1.width - 2, topY + 70, 10, 14);
    ctx.fillStyle = '#111';
    ctx.fillRect(headX + Math.sin(time * 7) * 26, topY - 20 + Math.cos(time * 11) * 8, 4, 3);
  }
  if (line && (line.toFountain || line.splash || line.ponder)) {
    // the drops on his face
    ctx.fillStyle = 'rgba(129, 212, 250, 0.9)';
    if (!line.toFountain) {
      [[-12, 22], [10, 30], [16, 14]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(headX + dx, topY + dy + ((time * 30 + dx) % 10), 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
  cutscene.splashDrops.forEach((drop) => {
    ctx.fillStyle = `rgba(129, 212, 250, ${Math.min(1, drop.life / 30)})`;
    ctx.fillRect(drop.x, drop.y, 4, 6);
  });
  if (cutscene.ideaGlow > 0) {
    // the light bulb of the million-coin idea
    const bulbY = topY - 52 + Math.sin(time * 4) * 3;
    ctx.save();
    ctx.globalAlpha = cutscene.ideaGlow;
    const glow = ctx.createRadialGradient(headX, bulbY, 4, headX, bulbY, 60);
    glow.addColorStop(0, 'rgba(255, 241, 118, 0.9)');
    glow.addColorStop(1, 'rgba(255, 241, 118, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(headX - 60, bulbY - 60, 120, 120);
    ctx.fillStyle = '#fff176';
    ctx.beginPath();
    ctx.arc(headX, bulbY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(headX - 7, bulbY + 12, 14, 9);
    ctx.strokeStyle = '#f9a825';
    ctx.lineWidth = 3;
    for (let ray = 0; ray < 8; ray += 1) {
      const angle = (ray / 8) * Math.PI * 2 + time;
      ctx.beginPath();
      ctx.moveTo(headX + Math.cos(angle) * 20, bulbY + Math.sin(angle) * 20);
      ctx.lineTo(headX + Math.cos(angle) * 30, bulbY + Math.sin(angle) * 30);
      ctx.stroke();
    }
    // coins dancing around his head
    ctx.fillStyle = '#ffd54f';
    for (let coin = 0; coin < 5; coin += 1) {
      const angle = time * 2 + (coin / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(headX + Math.cos(angle) * 70, topY + 20 + Math.sin(angle) * 22, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  if (cutscene.laterFade > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.88 * cutscene.laterFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startOriginsOutro() {
  if (selectedNormalArcadeLevel === originsSecretLevel) {
    startOriginsSecretOutro();
    return;
  }
  originsOutroPlayed = true;
  // (no leftover labels from the fight)
  player1.scamLabelTimer = 0;
  player2.scamLabelTimer = 0;
  player2.policeShots = [];
  const flee = selectedNormalArcadeLevel === 5;
  ch6CutsceneBase('originsOutro', flee ? originsFleeLines : originsOutroLines, 'dialog', {
    gamblerX: 360,
    gamblerTargetX: 360,
    scammerX: canvas.width + 400,
    scammerTargetX: canvas.width + 400,
    scammerY: 0,
    lidAngle: flee ? 0 : 1.9,
    hideHero: false,
    inBin: 0,
    eyesOpen: 0,
    eyesWide: 0,
    sirens: 0,
    flee,
    dark: 0,
    swarm: 0,
    happy: 0,
    place: 'alley',
    fade: 0,
    lastLineSeen: -1,
    friends: [],
    shots: [],
    puffs: [],
    windows: 0,
    glassesGlow: 0,
    wear: 0,
    tail: null,
    rain: 0,
    gray: 0,
    bigRise: 0,
    impact: 0,
    knock: 0,
    knockAngle: 0,
    bigVisible: false,
  });
  startCutsceneLine(0);
}

function updateOriginsOutro(cutscene) {
  const line = cutscene.phase === 'dialog' ? cutscene.lines[cutscene.lineIndex] : null;
  const passed = (flag) => {
    const index = cutscene.lines.findIndex((entry) => entry[flag]);
    return index >= 0 && index <= cutscene.lineIndex;
  };
  cutscene.sirens += 1;
  if (cutscene.secret) {
    updateOriginsSecretOutro(cutscene, line);
    return;
  }
  if (cutscene.flee) {
    if (passed('run')) {
      // running away to the left, as fast as his legs go
      cutscene.gamblerTargetX = -220;
      cutscene.gamblerX = moveToward(cutscene.gamblerX, -220, 7);
      const runLine = cutscene.lines.findIndex((entry) => entry.run);
      if (cutscene.gamblerX < -90 || cutscene.lineIndex > runLine) cutscene.hideHero = true;
    }
    if (passed('dark')) cutscene.dark = Math.min(0.78, cutscene.dark + 0.008);
    if (passed('eyes') && !cutscene.rumbled) {
      cutscene.rumbled = true;
      playTone({ frequency: 58, duration: 2.6, type: 'sawtooth', volume: 0.05, slideTo: 38 });
      playNoise({ duration: 0.5, volume: 0.04, filterFrequency: 500 });
    }
    if (passed('eyes')) {
      // the lid opens a crack...
      cutscene.lidAngle = moveToward(cutscene.lidAngle, 0.32, 0.01);
      cutscene.eyesOpen = Math.min(1, cutscene.eyesOpen + 0.02);
    }
    if (passed('wide')) cutscene.eyesWide = Math.min(1, cutscene.eyesWide + 0.05);
    return;
  }
  updateOriginsFinale(cutscene, line, passed);
}

// level 8's ending: a tour of the city... running away
const finaleFriendSpots = { market: [640, 820], roofs: [560, 710, 870] };

function makeFriendDummy(x) {
  return { position: { x, y: ground - 124 }, width: 64, height: 124, attacksToTheRight: false, friendFade: 0, friendGrin: 0, isAttacking: false, secretVariant: 'friendThing', away: 0 };
}

function puffOriginsFriend(cutscene, friend) {
  for (let puff = 0; puff < 14; puff += 1) {
    cutscene.puffs.push({ x: friend.position.x + Math.random() * friend.width, y: friend.position.y + Math.random() * friend.height, r: 10 + Math.random() * 14, life: 30 + Math.random() * 20, dark: true });
  }
}

function updateOriginsFinale(cutscene, line, passed) {
  const firstFrame = cutscene.lastLineSeen !== cutscene.lineIndex;
  cutscene.lastLineSeen = cutscene.lineIndex;
  if (line && firstFrame) {
    if (line.place) {
      // a new place: a cut to black, and he comes in running
      cutscene.place = line.place;
      cutscene.fade = 1;
      cutscene.friends = [];
      cutscene.shots = [];
      cutscene.windows = 0;
      // (a clean cut: nothing from the last place follows him... except the rain)
      cutscene.puffs = [];
      cutscene.impact = 0;
      cutscene.gray = 0;
      cutscene.tail = null;
      if (cutscene.knock) {
        cutscene.knock = 0;
        cutscene.knockAngle = 0;
      }
      cutscene.swarm = 0;
      cutscene.hideHero = false;
      cutscene.gamblerX = -70;
      cutscene.gamblerTargetX = 300;
      // (the first part, in the alley: the big one is still there, and Scammer is already on stage)
      cutscene.bigVisible = line.place === 'alley' && cutscene.lineIndex === 0;
      if (cutscene.bigVisible) {
        cutscene.fade = 0;
        cutscene.gamblerX = 300;
      }
    }
    // (skipping the lines fast never skips the hit: the scar always happens)
    if (!line.tailDodge && !line.tailHit && cutscene.tail && cutscene.tail.mode === 'hit' && cutscene.tail.t < 24) cutscene.tail.t = 23;
    // a moment of relief... until they show up again
    if (line.relief) player1.originsFear = 1;
    if (typeof line.fear === 'number') {
      player1.originsFear = line.fear;
      playSound('cutsceneSurprise');
    }
    if (line.ring) {
      // the ringing in his ears after the blow
      playTone({ frequency: 3100, duration: 3.5, type: 'sine', volume: 0.018, slideTo: 2900 });
      cutscene.rain = Math.max(cutscene.rain, 0.01);
    }
    if (line.tragic) {
      // a slow, heavy heartbeat
      playTone({ frequency: 52, duration: 0.18, type: 'sine', volume: 0.12 });
      setTimeout(() => playTone({ frequency: 48, duration: 0.22, type: 'sine', volume: 0.1 }), 260);
    }
    if (line.tailDodge) cutscene.tail = { mode: 'dodge', t: 0, targetX: cutscene.gamblerX + player1.width / 2 };
    if (line.tailHit) cutscene.tail = { mode: 'hit', t: 0, targetX: cutscene.gamblerX + player1.width / 2 };
    if (line.swarm && cutscene.knock) {
      cutscene.knock = 2;
    }
    if (line.friends) {
      cutscene.friends = finaleFriendSpots[cutscene.place].slice(0, line.friends).map((x) => makeFriendDummy(x));
      cutscene.friends.forEach((friend) => puffOriginsFriend(cutscene, friend));
    }
    if (line.action === 'throw') {
      cutscene.shots.push({ kind: 'bottle', x: cutscene.gamblerX + 60, y: ground - 90, vx: 10, vy: -2.5, spin: 0 });
      playSound('menuSelect');
    }
    if (line.action === 'cart') {
      cutscene.shots.push({ kind: 'cart', x: cutscene.gamblerX + 80, vx: 11, fruits: [] });
      playSound('omegaKickLaunch');
    }
    if (line.windows) {
      cutscene.windows = 1;
      playTone({ frequency: 62, duration: 1.8, type: 'sawtooth', volume: 0.045, slideTo: 44 });
    }
    if (line.glasses) playTone({ frequency: 1480, duration: 0.6, type: 'sine', volume: 0.05, slideTo: 1760 });
    if (line.wear) playTone({ frequency: 220, duration: 1.4, type: 'triangle', volume: 0.05, slideTo: 440 });
    if (line.calm) {
      // he is not afraid anymore... he is one of them
      player1.originsFear = 0;
      player1.youngGlasses = true;
    }
  }
  if (cutscene.fade > 0) cutscene.fade = Math.max(0, cutscene.fade - 0.035);
  updateOriginsTailScene(cutscene, line);
  if (line && line.run) {
    // (away from the big one, in the alley: to the left)
    const away = cutscene.bigVisible ? -200 : canvas.width + 160;
    cutscene.gamblerTargetX = away;
    cutscene.gamblerX = moveToward(cutscene.gamblerX, away, 6);
  }
  if (line && line.swarm) cutscene.swarm = 0.01;
  if (cutscene.swarm > 0) cutscene.swarm = Math.min(1, cutscene.swarm + 0.02);
  // the friends never get hurt: they melt, and come back
  cutscene.friends.forEach((friend) => {
    if (friend.away > 0) {
      friend.away -= 1;
      friend.friendFade = Math.max(0, friend.friendFade - 0.2);
    } else {
      friend.friendFade = Math.min(1, friend.friendFade + 0.04);
    }
    friend.friendGrin = Math.max(0, friend.friendGrin - 1);
    if (line && line.laugh) friend.friendGrin = 30;
  });
  cutscene.shots.forEach((shot) => {
    shot.x += shot.vx;
    if (shot.kind === 'bottle') {
      shot.y += shot.vy;
      shot.vy += 0.12;
      shot.spin += 0.3;
    } else if (Math.random() < 0.3) {
      shot.fruits.push({ x: shot.x, y: ground - 60, vx: (Math.random() - 0.5) * 6, vy: -5 - Math.random() * 4, color: ['#e53935', '#fdd835', '#ff9800', '#43a047'][Math.floor(Math.random() * 4)], life: 50 });
    }
    if (shot.fruits) {
      shot.fruits.forEach((fruit) => {
        fruit.x += fruit.vx;
        fruit.y += fruit.vy;
        fruit.vy += 0.4;
        fruit.life -= 1;
      });
    }
    cutscene.friends.forEach((friend) => {
      if (friend.away <= 0 && friend.friendFade > 0.8 && Math.abs(shot.x - (friend.position.x + friend.width / 2)) < 30) {
        friend.away = 50;
        puffOriginsFriend(cutscene, friend);
      }
    });
  });
  cutscene.shots = cutscene.shots.filter((shot) => shot.x < canvas.width + 200 && (shot.kind !== 'bottle' || shot.y < ground));
  updateOriginsPuffs(cutscene);
  // the dumpster, as before
  if (passed('bin')) {
    cutscene.gamblerTargetX = 690;
    cutscene.gamblerX += (690 - cutscene.gamblerX) * 0.08;
    if (Math.abs(cutscene.gamblerX - 690) < 6) {
      cutscene.hideHero = true;
      cutscene.lidAngle = Math.max(0, cutscene.lidAngle - 0.12);
    }
  }
  if (passed('inside')) {
    cutscene.hideHero = true;
    cutscene.lidAngle = 0;
    cutscene.inBin = Math.min(1, cutscene.inBin + 0.04);
    // (inside the dumpster the rain can't reach him)
    cutscene.rain = 0;
  }
  if (passed('glasses')) cutscene.glassesGlow = Math.min(1, cutscene.glassesGlow + 0.03);
  if (passed('wear')) cutscene.wear = Math.min(1, cutscene.wear + 0.03);
  if (passed('eyes')) cutscene.eyesOpen = Math.min(1, cutscene.eyesOpen + 0.02);
  if (passed('happy')) cutscene.happy = Math.min(1, cutscene.happy + 0.05);
}

// the big one's tail: one miss... and one hit right in the face
function getBigFriendTailRest() {
  return { x: 680 + player2.width + 50 + Math.sin(performance.now() / 500) * 12, y: ground - player2.height - 30 };
}

function updateOriginsTailScene(cutscene, line) {
  // the big one lies on the floor... until it gets up
  if (line && line.bigDown) cutscene.bigRise = 0;
  else if (cutscene.bigVisible) cutscene.bigRise = Math.min(1, cutscene.bigRise + 0.06);
  // after the blow: rain, and the colors drain away while he lies there
  if (cutscene.rain > 0) cutscene.rain = Math.min(1, cutscene.rain + 0.01);
  const grayTarget = line && line.tragic ? 0.75 : 0;
  cutscene.gray += (grayTarget - cutscene.gray) * 0.05;
  if (line && line.celebrate) cutscene.gamblerHop = Math.abs(Math.sin(cutscene.frame / 6)) * 26;
  else if (!cutscene.dodge) cutscene.gamblerHop = Math.max(0, cutscene.gamblerHop - 3);
  // the jump back that saves him (the first time)
  if (cutscene.dodge > 0) {
    cutscene.dodge -= 1;
    cutscene.gamblerX -= 7;
    cutscene.gamblerTargetX = cutscene.gamblerX;
    cutscene.gamblerHop = Math.sin(((14 - cutscene.dodge) / 14) * Math.PI) * 46;
  }
  // knocked to the floor... and back up when the laugh starts
  if (cutscene.knock === 1) {
    cutscene.knockAngle = Math.min(1.45, cutscene.knockAngle + 0.12);
    if (cutscene.knockSlide > 0) {
      cutscene.knockSlide -= 1;
      cutscene.gamblerX -= 6;
      cutscene.gamblerTargetX = cutscene.gamblerX;
    }
    cutscene.hideHero = true;
  } else if (cutscene.knock === 2) {
    cutscene.knockAngle = Math.max(0, cutscene.knockAngle - 0.08);
    if (cutscene.knockAngle <= 0) {
      cutscene.knock = 0;
      cutscene.hideHero = false;
    }
  }
  if (cutscene.impact > 0) cutscene.impact -= 1;
  const tail = cutscene.tail;
  if (!tail) return;
  // a hit-stop on the impact: everything freezes for a moment
  if (tail.mode === 'hit' && cutscene.impact > 40) return;
  tail.t += 1;
  if (tail.mode === 'dodge' && tail.t === 12) {
    cutscene.dodge = 14;
    playNoise({ duration: 0.25, volume: 0.06, filterFrequency: 3000 });
  }
  if (tail.mode === 'hit' && tail.t === 24) {
    // right in the face
    cutscene.impact = 80;
    cutscene.shake = 22;
    cutscene.knock = 1;
    cutscene.knockSlide = 14;
    player1.youngScar = true;
    playSound('robotHit');
    playNoise({ duration: 0.6, volume: 0.1, filterFrequency: 900 });
    playTone({ frequency: 70, duration: 2.2, type: 'sawtooth', volume: 0.08, slideTo: 30 });
    setTimeout(() => playFriendLaugh('deep'), 1600);
  }
  if (cutscene.shake > 0) cutscene.shake *= 0.9;
  if (tail.t > 90) cutscene.tail = null;
}

function getBigFriendTailTip(cutscene) {
  const rest = getBigFriendTailRest();
  const tail = cutscene.tail;
  if (!tail) return rest;
  const lerp = (from, to, amount) => ({ x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount });
  const ease = (amount) => 1 - Math.pow(1 - Math.max(0, Math.min(1, amount)), 3);
  const head = { x: tail.targetX, y: ground - player1.height + 28 };
  if (tail.mode === 'dodge') {
    const windup = { x: rest.x + 30, y: rest.y - 70 };
    if (tail.t < 10) return lerp(rest, windup, ease(tail.t / 10));
    if (tail.t < 20) return lerp(windup, { x: head.x - 40, y: head.y }, ease((tail.t - 10) / 10));
    return lerp({ x: head.x - 40, y: head.y }, rest, ease((tail.t - 20) / 30));
  }
  // the hit: it comes back around, high above... and down onto his face
  const high = { x: head.x + 40, y: ground - 380 };
  if (tail.t < 18) return lerp(rest, high, ease(tail.t / 18));
  if (tail.t < 24) return lerp(high, head, (tail.t - 18) / 6);
  if (tail.t < 50) return head;
  return lerp(head, rest, ease((tail.t - 50) / 35));
}

// where each part of the ending happens
function drawOriginsOutroStage(cutscene) {
  if (cutscene.secret) {
    if (cutscene.place === 'castle') drawOriginsCastleStage();
    else drawGamblerAlleyStage(0, 0);
    return;
  }
  if (cutscene.flee) {
    drawGamblerAlleyStage(cutscene.lidAngle, cutscene.shake);
    return;
  }
  if (cutscene.place === 'market') drawOriginsNightStage();
  else if (cutscene.place === 'roofs') drawOriginsRooftopsDarkStage();
  else if (cutscene.place === 'station') drawOriginsStationDark(cutscene);
  else {
    drawGamblerAlleyStage(cutscene.lidAngle, cutscene.shake);
    drawOriginsAlleyDecay();
  }
  // (nobody sleeps in the alley)
  drawOriginsSleepers(cutscene.place);
}

// the police station: lights out, nobody inside... nobody human
function drawOriginsStationDark(cutscene) {
  drawOriginsStationStage();
  ctx.fillStyle = 'rgba(5, 0, 12, 0.74)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (cutscene.windows > 0) {
    for (let col = 0; col < 4; col += 1) drawFriendEyePair(280 + col * 150, ground - 195, 6, 0.95, false, col * 2);
    drawFriendEyePair(510, ground - 80, 9, 0.95, false, 7);
    drawFriendGrin(510, ground - 60, 26, 0.8);
  }
}

// a pair of glasses with one pink lens and one yellow lens
function drawOriginsGlasses(x, y, scale, glow) {
  ctx.save();
  ctx.shadowBlur = 20 * glow;
  [['#ff4fa3', -1], ['#ffd60a', 1]].forEach(([color, side]) => {
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillRect(x + side * 11 * scale - 9 * scale, y - 6 * scale, 18 * scale, 12 * scale);
  });
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(x - 20 * scale, y - 6 * scale, 18 * scale, 12 * scale);
  ctx.strokeRect(x + 2 * scale, y - 6 * scale, 18 * scale, 12 * scale);
  ctx.beginPath();
  ctx.moveTo(x - 2 * scale, y - 2 * scale);
  ctx.lineTo(x + 2 * scale, y - 2 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawOriginsOutroFx(cutscene) {
  const time = performance.now() / 1000;
  if (cutscene.secret) {
    drawOriginsSecretOutroFx(cutscene);
    return;
  }
  if (cutscene.flee) {
    // police lights fading away, the alley going dark... and two eyes in the dumpster
    if (cutscene.dark < 0.5) {
      const red = Math.sin(time * 8) > 0;
      ctx.fillStyle = red ? `rgba(255, 23, 68, ${0.12 * (1 - cutscene.dark * 2)})` : `rgba(41, 121, 255, ${0.12 * (1 - cutscene.dark * 2)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.dark})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (cutscene.dark > 0) {
      ctx.fillStyle = `rgba(90, 0, 10, ${0.3 * cutscene.dark})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawOriginsFog(time, 0.4 * cutscene.dark);
      drawOriginsDread(cutscene.dark * 1.2);
    }
    if (cutscene.eyesOpen > 0) {
      // black tendrils leaking out from under the dumpster
      ctx.save();
      ctx.strokeStyle = '#050208';
      ctx.lineCap = 'round';
      for (let tendril = 0; tendril < 9; tendril += 1) {
        const side = tendril % 2 ? 1 : -1;
        const reach = (50 + tendril * 22) * cutscene.eyesOpen * (1 + cutscene.eyesWide * 0.6);
        const startX = 670 + tendril * 14;
        ctx.lineWidth = 7 - tendril * 0.5;
        ctx.beginPath();
        ctx.moveTo(startX, ground - 2);
        ctx.quadraticCurveTo(startX + side * reach * 0.5, ground - 14 + Math.sin(time * 3 + tendril) * 8, startX + side * reach, ground + 4);
        ctx.stroke();
      }
      ctx.restore();
      // peeking out from under the lid
      drawFriendEyePair(730, ground - 112, 11 + cutscene.eyesWide * 6, cutscene.eyesOpen, false, 4);
    }
    return;
  }
  if (cutscene.inBin < 1) {
    drawOriginsDread(0.9);
    if (cutscene.bigVisible && cutscene.place === 'alley') {
      const big = player2;
      big.position = { x: 680, y: ground - big.height };
      big.attacksToTheRight = false;
      big.friendFade = 1;
      big.friendWeak = false;
      big.isAttacking = false;
      big.friendGrin = cutscene.lines[cutscene.lineIndex] && cutscene.lines[cutscene.lineIndex].laugh ? 30 : 0;
      big.tailTip = getBigFriendTailTip(cutscene);
      const rise = 0.45 + cutscene.bigRise * 0.55;
      ctx.save();
      ctx.translate(0, ground);
      ctx.scale(1, rise);
      ctx.translate(0, -ground);
      big.friendFade = 0.55 + cutscene.bigRise * 0.45;
      drawBigFriend(big);
      ctx.restore();
      big.tailTip = null;
    }
    if (cutscene.knock && cutscene.hideHero && cutscene.inBin === 0) {
      // Scammer on the floor, holding his face
      const centerX = player1.position.x + player1.width / 2;
      ctx.save();
      ctx.translate(centerX, ground);
      ctx.rotate(-cutscene.knockAngle);
      ctx.translate(-centerX, -ground);
      player1.position.y = ground - player1.height;
      player1.draw();
      ctx.restore();
    }
    if (cutscene.impact > 0 && cutscene.place === 'alley') {
      // the impact: a white flash, a red slash, lines bursting out
      const strength = Math.min(1, cutscene.impact / 50);
      if (cutscene.impact > 40) {
        // the frozen instant: no colors... only the red of the blow
        ctx.save();
        ctx.globalCompositeOperation = 'saturation';
        ctx.fillStyle = 'rgba(128, 128, 128, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      const hitX = player1.position.x + player1.width / 2;
      const hitY = ground - player1.height + 30;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${strength})`;
      ctx.lineWidth = 3;
      for (let ray = 0; ray < 16; ray += 1) {
        const angle = (ray / 16) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(hitX + Math.cos(angle) * 30, hitY + Math.sin(angle) * 30);
        ctx.lineTo(hitX + Math.cos(angle) * (90 + (1 - strength) * 200), hitY + Math.sin(angle) * (90 + (1 - strength) * 200));
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(255, 23, 68, ${strength})`;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(hitX - 50, hitY - 40);
      ctx.lineTo(hitX + 50, hitY + 40);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, strength - 0.45) * 1.6})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(120, 0, 10, ${strength * 0.35})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    cutscene.friends.forEach((friend) => drawFriendThing(friend));
    cutscene.shots.forEach((shot) => {
      if (shot.kind === 'bottle') {
        ctx.save();
        ctx.translate(shot.x, shot.y);
        ctx.rotate(shot.spin);
        ctx.fillStyle = 'rgba(129, 212, 250, 0.95)';
        ctx.fillRect(-7, -12, 14, 24);
        ctx.fillStyle = '#e53935';
        ctx.fillRect(-4, -17, 8, 5);
        ctx.restore();
        return;
      }
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(shot.x - 50, ground - 52, 100, 36);
      ['#e53935', '#fdd835', '#ff9800', '#43a047'].forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(shot.x - 30 + index * 20, ground - 58, 9, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = '#212121';
      [-30, 30].forEach((offset) => {
        ctx.beginPath();
        ctx.arc(shot.x + offset, ground - 10, 10, 0, Math.PI * 2);
        ctx.fill();
      });
      shot.fruits.forEach((fruit) => {
        ctx.fillStyle = fruit.color;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }
  cutscene.puffs.forEach((puff) => {
    ctx.fillStyle = `rgba(10, 4, 18, ${Math.min(0.9, puff.life / 30)})`;
    ctx.beginPath();
    ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (cutscene.swarm > 0 && cutscene.inBin < 1) {
    // eyes everywhere in the alley
    ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * cutscene.swarm})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    friendEyeSpots.forEach(([eyeX, eyeY], index) => drawFriendEyePair(eyeX, eyeY, 7, cutscene.swarm, false, time + index * 1.3));
  }
  if (cutscene.inBin > 0) {
    // inside the dumpster: darkness...
    ctx.fillStyle = `rgba(0, 0, 0, ${0.94 * cutscene.inBin})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(255, 224, 130, ${0.25 * cutscene.inBin})`;
    ctx.fillRect(220, 140, 580, 3);
    // his own scared eyes... until the glasses cover them
    if (cutscene.wear < 1) {
      ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.inBin * (1 - cutscene.wear)})`;
      ctx.beginPath();
      ctx.arc(300 + Math.sin(time * 30) * 1.5, 320, 6, 0, Math.PI * 2);
      ctx.arc(324 + Math.sin(time * 30) * 1.5, 320, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (cutscene.glassesGlow > 0) {
      // the glasses: first on the floor of the dumpster, then on his face
      const glassesX = 520 + (312 - 520) * cutscene.wear;
      const glassesY = 400 + (320 - 400) * cutscene.wear;
      ctx.globalAlpha = cutscene.glassesGlow;
      drawOriginsGlasses(glassesX, glassesY, 1 + cutscene.wear * 0.2, 0.6 + Math.sin(time * 3) * 0.4);
      ctx.globalAlpha = 1;
    }
    if (cutscene.eyesOpen > 0) {
      // the friends all around him in the dark (smiling, once he is one of them)
      friendEyeSpots.forEach(([eyeX, eyeY], index) => {
        if (Math.abs(eyeX - 312) < 90 && Math.abs(eyeY - 320) < 70) return;
        drawFriendEyePair(eyeX, eyeY, 8, cutscene.eyesOpen, cutscene.happy > 0.5, index);
      });
      if (cutscene.happy > 0) drawFriendGrin(670, 360, 50, cutscene.happy * 0.8);
    }
  }
  if (cutscene.gray > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = `rgba(128, 128, 128, ${cutscene.gray})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  if (cutscene.rain > 0 && cutscene.inBin < 1) {
    // a cold rain over the city
    ctx.save();
    ctx.strokeStyle = `rgba(170, 190, 225, ${0.35 * cutscene.rain})`;
    ctx.lineWidth = 1.5;
    const fall = performance.now() / 2;
    for (let drop = 0; drop < 90; drop += 1) {
      const dropX = (drop * 113 + fall * 0.35) % (canvas.width + 60) - 30;
      const dropY = (drop * 71 + fall) % (canvas.height + 40) - 20;
      ctx.beginPath();
      ctx.moveTo(dropX, dropY);
      ctx.lineTo(dropX - 6, dropY + 18);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (cutscene.fade > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${cutscene.fade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------------- the friends: the laugh, the eyes, the grin ----------------
const friendLaughSource = encodeURI('assetsaudio/IMAGE_FRIEND laugh [Deltarune Chapter 3_4].mp3');
reflecterBattleTrackSources.friendLaughter = encodeURI('assetsaudio/LAUGHTER OF A MILLION FACES [Vs. Friend] [Deltarune_ FRIENDLESS OST].mp3');
reflecterBattleTrackVolumes.friendLaughter = 0.55;
// the same laugh, played higher, lower, quieter... for each occasion
const friendLaughPresets = {
  soft: [{ rate: 1.2, volume: 0.35 }],
  normal: [{ rate: 1, volume: 0.6 }],
  high: [{ rate: 1.45, volume: 0.4 }],
  deep: [{ rate: 0.68, volume: 0.9 }],
  distant: [{ rate: 0.9, volume: 0.16 }],
  many: [{ rate: 1, volume: 0.45 }, { rate: 1.3, volume: 0.32, delay: 160 }, { rate: 0.8, volume: 0.38, delay: 320 }],
};
let friendLaughsPlaying = 0;

function playFriendLaugh(kind = 'normal') {
  if (typeof Audio === 'undefined') return;
  (friendLaughPresets[kind] || friendLaughPresets.normal).forEach(({ rate, volume, delay = 0 }) => {
    setTimeout(() => {
      if (friendLaughsPlaying >= 5) return;
      const laugh = new Audio(friendLaughSource);
      laugh.preservesPitch = false;
      laugh.mozPreservesPitch = false;
      laugh.webkitPreservesPitch = false;
      laugh.playbackRate = rate;
      laugh.volume = Math.max(0, Math.min(1, volume * audioSettings.master * audioSettings.sfx));
      friendLaughsPlaying += 1;
      const done = () => {
        friendLaughsPlaying = Math.max(0, friendLaughsPlaying - 1);
        laugh.onended = null;
        laugh.onerror = null;
      };
      laugh.onended = done;
      laugh.onerror = done;
      const playPromise = laugh.play();
      if (playPromise && playPromise.catch) playPromise.catch(done);
    }, delay);
  });
}

// where the eyes peek out of the dark
const friendEyeSpots = [[90, 300], [930, 250], [860, 420], [150, 440], [520, 215], [965, 470], [40, 380], [700, 200], [330, 205], [610, 300], [440, 330], [800, 330]];

function drawFriendEyePair(x, y, size, alpha, happy = false, seed = 0) {
  if (alpha <= 0) return;
  const blink = Math.sin(seed * 1.7 + performance.now() / 700) > 0.96 ? 0.12 : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.shadowBlur = size * 1.6;
  [['#ff4fa3', -size * 1.4], ['#ffd60a', size * 1.4]].forEach(([color, offset]) => {
    ctx.shadowColor = color;
    if (happy) {
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(3, size * 0.45);
      ctx.beginPath();
      ctx.arc(x + offset, y + size * 0.4, size, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      return;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + offset, y, size, size * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + offset, y, size * 0.26, size * 0.75 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = size * 1.6;
  });
  ctx.restore();
}

function drawFriendGrin(x, y, halfWidth, alpha) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, y);
  ctx.quadraticCurveTo(x, y + halfWidth * 0.75, x + halfWidth, y);
  ctx.quadraticCurveTo(x, y + halfWidth * 0.25, x - halfWidth, y);
  ctx.fill();
  ctx.strokeStyle = '#050505';
  ctx.lineWidth = Math.max(1.5, halfWidth / 14);
  ctx.beginPath();
  const teeth = 10;
  for (let tooth = 0; tooth <= teeth; tooth += 1) {
    const toothX = x - halfWidth * 0.85 + (tooth / teeth) * halfWidth * 1.7;
    const toothY = y + halfWidth * 0.18 + (tooth % 2 ? halfWidth * 0.14 : 0);
    if (tooth === 0) ctx.moveTo(toothX, toothY);
    else ctx.lineTo(toothX, toothY);
  }
  ctx.stroke();
  ctx.restore();
}

// ---------------- the enemies: an angry customer and the police ----------------
function isPolice(fighter) {
  return Boolean(fighter && (fighter.secretVariant === 'policeOfficer' || fighter.secretVariant === 'policeSergeant' || fighter.secretVariant === 'policeChief'));
}

function resetPolice(fighter) {
  Object.assign(fighter, {
    policeBatonCooldown: 90,
    policeCuffsCooldown: 160,
    policeWhistleCooldown: 220,
    policeSirenCooldown: 300,
    policeBatonTimer: 0,
    policeBatonHit: false,
    policeShots: [],
    policeWaves: [],
    policeSiren: null,
    policeShout: null,
  });
}

function policeShout(fighter, text) {
  fighter.policeShout = { text, life: 70 };
}

function updatePolice(fighter) {
  if (!fighter.policeShots) resetPolice(fighter);
  tickCooldowns(fighter, ['policeBatonCooldown', 'policeCuffsCooldown', 'policeWhistleCooldown', 'policeSirenCooldown']);
  if (fighter.policeShout) {
    fighter.policeShout.life -= 1;
    if (fighter.policeShout.life <= 0) fighter.policeShout = null;
  }
  if (arcadeCutscene.active) return;
  const target = getOpponent(fighter);
  const direction = fighter.attacksToTheRight ? 1 : -1;
  // the baton dash
  if (fighter.policeBatonTimer > 0) {
    fighter.policeBatonTimer -= 1;
    fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, fighter.position.x + direction * 9));
    if (!fighter.policeBatonHit) {
      const area = { x: direction > 0 ? fighter.position.x + fighter.width : fighter.position.x - 80, y: fighter.position.y + 30, width: 80, height: 40 };
      if (knightHit(fighter, target, area, 10, direction * 8, -5)) fighter.policeBatonHit = true;
    }
  }
  // thrown handcuffs
  fighter.policeShots.forEach((shot) => {
    shot.x += shot.vx;
    shot.spin += 0.4;
    shot.life -= 1;
    const area = { x: shot.x - 12, y: shot.y - 10, width: 24, height: 20 };
    if (rectangularCollision({ rectangle1: area, rectangle2: target })) {
      shot.life = 0;
      if (!handleCopycatShieldHit(target, fighter)) {
        applyDamage(fighter, target, 8, { isSpecial: true });
        // cuffed for a moment: slowed down
        target.velocity.x *= 0.2;
        target.policeCuffed = 50;
        playSound('robotHit');
      }
    }
  });
  fighter.policeShots = fighter.policeShots.filter((shot) => shot.life > 0 && shot.x > -40 && shot.x < canvas.width + 40);
  if (target.policeCuffed > 0) {
    target.policeCuffed -= 1;
    target.velocity.x *= 0.5;
  }
  // whistle waves
  fighter.policeWaves.forEach((wave) => {
    wave.radius += 9;
    wave.life -= 1;
    if (!wave.hit && Math.abs(getFighterCenterX(target) - wave.x) < wave.radius && Math.abs(getFighterCenterX(target) - wave.x) > wave.radius - 40) {
      wave.hit = true;
      if (knightHit(fighter, target, { x: target.position.x, y: target.position.y, width: target.width, height: target.height }, 6, Math.sign(getFighterCenterX(target) - wave.x) * 9, -6)) playSound('robotHit');
    }
  });
  fighter.policeWaves = fighter.policeWaves.filter((wave) => wave.life > 0);
  // the chief's siren: a sweep along the ground (jump it!)
  if (fighter.policeSiren) {
    const siren = fighter.policeSiren;
    if (siren.warn > 0) {
      siren.warn -= 1;
    } else {
      siren.x += siren.vx;
      if (!siren.hit && Math.abs(getFighterCenterX(target) - siren.x) < 40 && target.position.y + target.height >= ground - 6) {
        siren.hit = true;
        knightHit(fighter, target, { x: target.position.x, y: target.position.y, width: target.width, height: target.height }, 14, Math.sign(siren.vx) * 10, -8);
      }
      if (siren.x < -80 || siren.x > canvas.width + 80) fighter.policeSiren = null;
    }
  }
}

function castPoliceBaton(fighter) {
  if (fighter.policeBatonCooldown > 0 || fighter.policeBatonTimer > 0) return false;
  fighter.policeBatonTimer = 18;
  fighter.policeBatonHit = false;
  fighter.policeBatonCooldown = getDebugCooldown(fighter.secretVariant === 'policeChief' ? 90 : 130, fighter);
  policeShout(fighter, 'ALTO!');
  playSound('omegaKickLaunch');
  recordSpecialUsed(fighter);
  return true;
}

function castPoliceCuffs(fighter, target) {
  if (fighter.policeCuffsCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  fighter.policeShots.push({ x: getFighterCenterX(fighter) + direction * 30, y: fighter.position.y + 50, vx: direction * 9, spin: 0, life: 120 });
  fighter.policeCuffsCooldown = getDebugCooldown(fighter.secretVariant === 'policeChief' ? 110 : 160, fighter);
  policeShout(fighter, 'ESPOSADO!');
  recordSpecialUsed(fighter);
  return true;
}

function castPoliceWhistle(fighter) {
  if (fighter.policeWhistleCooldown > 0 || fighter.secretVariant === 'policeOfficer') return false;
  fighter.policeWaves.push({ x: getFighterCenterX(fighter), radius: 20, life: 30, hit: false });
  fighter.policeWhistleCooldown = getDebugCooldown(220, fighter);
  policeShout(fighter, 'FWEEEET!');
  playTone({ frequency: 2200, duration: 0.4, type: 'square', volume: 0.05, slideTo: 2600 });
  recordSpecialUsed(fighter);
  return true;
}

function castPoliceSiren(fighter, target) {
  if (fighter.policeSirenCooldown > 0 || fighter.secretVariant !== 'policeChief' || fighter.policeSiren) return false;
  const fromLeft = getFighterCenterX(target) > canvas.width / 2;
  fighter.policeSiren = { x: fromLeft ? -60 : canvas.width + 60, vx: fromLeft ? 10 : -10, warn: 45, hit: false };
  fighter.policeSirenCooldown = getDebugCooldown(320, fighter);
  policeShout(fighter, 'PATRULLA EN CAMINO!');
  recordSpecialUsed(fighter);
  return true;
}

function updatePoliceBotSpecials(profile, absDistance) {
  const cop = player2;
  if (!cop.policeShots) resetPolice(cop);
  if (cop.policeBatonTimer > 0) return true;
  const options = [];
  if (absDistance > 120 && absDistance < 340 && !(cop.policeBatonCooldown > 0)) options.push(() => castPoliceBaton(cop));
  if (absDistance > 180 && !(cop.policeCuffsCooldown > 0)) options.push(() => castPoliceCuffs(cop, player1));
  if (absDistance < 160 && !(cop.policeWhistleCooldown > 0) && cop.secretVariant !== 'policeOfficer') options.push(() => castPoliceWhistle(cop));
  if (!(cop.policeSirenCooldown > 0) && cop.secretVariant === 'policeChief' && !cop.policeSiren) options.push(() => castPoliceSiren(cop, player1));
  if (!options.length || !shouldBotUseSpecial(profile, 0.06)) return false;
  return options[Math.floor(Math.random() * options.length)]();
}

function drawPoliceFx() {
  [player1, player2].forEach((fighter) => {
    if (!isPolice(fighter) || !fighter.policeShots) return;
    const time = performance.now() / 1000;
    ctx.save();
    fighter.policeShots.forEach((shot) => {
      ctx.save();
      ctx.translate(shot.x, shot.y);
      ctx.rotate(shot.spin);
      ctx.strokeStyle = '#cfd8dc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-7, 0, 6, 0, Math.PI * 2);
      ctx.arc(7, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
    fighter.policeWaves.forEach((wave) => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${wave.life / 30})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(wave.x, fighter.position.y + 40, wave.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    if (fighter.policeSiren) {
      const siren = fighter.policeSiren;
      if (siren.warn > 0) {
        ctx.fillStyle = `rgba(255, 23, 68, ${0.25 + Math.sin(time * 20) * 0.15})`;
        ctx.fillRect(0, ground - 30, canvas.width, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '900 16px Courier New, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SALTA!', canvas.width / 2, ground - 40);
        ctx.textAlign = 'left';
      } else {
        // a patrol car racing along the ground, lights flashing
        const x = siren.x;
        const facing = Math.sign(siren.vx);
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(x - 46, ground - 30, 92, 24);
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(x - 46, ground - 20, 92, 8);
        ctx.fillRect(x - 24, ground - 44, 48, 14);
        ctx.fillStyle = Math.sin(time * 18) > 0 ? '#ff1744' : '#2979ff';
        ctx.fillRect(x - 10, ground - 52, 20, 8);
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(x - 28, ground - 6, 8, 0, Math.PI * 2);
        ctx.arc(x + 28, ground - 6, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(x - facing * 120, ground - 22, facing * 70, 3);
      }
    }
    if (fighter.policeShout) {
      ctx.globalAlpha = Math.min(1, fighter.policeShout.life / 20);
      ctx.font = '900 15px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0d1b4a';
      ctx.fillStyle = '#90caf9';
      ctx.strokeText(fighter.policeShout.text, getFighterCenterX(fighter), fighter.position.y - 18);
      ctx.fillText(fighter.policeShout.text, getFighterCenterX(fighter), fighter.position.y - 18);
      ctx.textAlign = 'left';
    }
    ctx.restore();
  });
}

// ---------------- drawings ----------------
// the angry customer: a brown coat, a bottle of "agua mojada" and a face asking for a refund
function drawAngryCustomer(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const dir = fighter.attacksToTheRight ? 1 : -1;
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffcc99';
  ctx.fillRect(x, y, w, 36);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(x, y, w, 8);
  // angry brows and eyes
  ctx.fillStyle = '#1b1b1b';
  const eye = (offset) => (dir > 0 ? x + offset : x + w - offset - 5);
  ctx.fillRect(eye(30), y + 16, 5, 5);
  ctx.fillRect(eye(44), y + 16, 5, 5);
  ctx.strokeStyle = '#1b1b1b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(eye(27), y + 10);
  ctx.lineTo(eye(36), y + 14);
  ctx.moveTo(eye(51), y + 10);
  ctx.lineTo(eye(42), y + 14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(eye(34), y + 30);
  ctx.quadraticCurveTo(eye(39), y + 25, eye(44), y + 30);
  ctx.stroke();
  // the bottle of "agua mojada"
  const bottleX = dir > 0 ? x + w - 6 : x - 10;
  ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
  ctx.fillRect(bottleX, y + 50, 16, 30);
  ctx.fillStyle = '#e53935';
  ctx.fillRect(bottleX + 4, y + 44, 8, 6);
  ctx.fillStyle = '#fff';
  ctx.fillRect(bottleX, y + 60, 16, 8);
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  if (fighter.isAttacking) {
    ctx.fillStyle = fighter.attackColor;
    const area = fighter.attackArea;
    ctx.fillRect(area.x, area.y, area.width, area.height);
  }
}

// the police: navy uniform, cap with a badge, gold star (stripes for the sergeant, white cap and medals for the chief)
function drawPolice(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const dir = fighter.attacksToTheRight ? 1 : -1;
  const rank = fighter.secretVariant;
  const chief = rank === 'policeChief';
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#0d1442';
  ctx.fillRect(x, y + h - 30, w, 30);
  // face
  ctx.fillStyle = '#f1c27d';
  ctx.fillRect(x + 4, y + 10, w - 8, 30);
  // cap
  ctx.fillStyle = chief ? '#eceff1' : '#0d1442';
  ctx.fillRect(x - 2, y, w + 4, 14);
  ctx.fillStyle = '#111';
  ctx.fillRect(dir > 0 ? x + w / 2 : x - 8, y + 12, w / 2 + 8, 4);
  ctx.fillStyle = '#ffca28';
  ctx.fillRect(x + w / 2 - 5, y + 2, 10, 9);
  // eyes and a stern mouth
  const eye = (offset) => (dir > 0 ? x + offset : x + w - offset - 5);
  ctx.fillStyle = '#111';
  ctx.fillRect(eye(32), y + 20, 5, 4);
  ctx.fillRect(eye(46), y + 20, 5, 4);
  ctx.fillRect(eye(35), y + 32, 12, 2);
  if (rank !== 'policeOfficer') {
    // a big mustache
    ctx.fillStyle = chief ? '#9e9e9e' : '#4e342e';
    ctx.fillRect(eye(30), y + 27, 22, 5);
  }
  // collar, tie and the gold star on the chest
  ctx.fillStyle = '#90caf9';
  ctx.fillRect(x + w / 2 - 8, y + 40, 16, 8);
  ctx.fillStyle = '#111';
  ctx.fillRect(x + w / 2 - 2, y + 44, 4, 22);
  ctx.fillStyle = '#ffca28';
  const starX = dir > 0 ? x + 16 : x + w - 16;
  ctx.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 ? 3 : 7;
    const angle = -Math.PI / 2 + point * (Math.PI / 5);
    ctx.lineTo(starX + Math.cos(angle) * radius, y + 58 + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  if (rank === 'policeSergeant') {
    ctx.fillStyle = '#ffca28';
    [0, 6, 12].forEach((offset) => ctx.fillRect(dir > 0 ? x + 2 : x + w - 14, y + 70 + offset, 12, 3));
  }
  if (chief) {
    ['#e53935', '#43a047', '#ffca28'].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect((dir > 0 ? x + w - 22 : x + 8) + index * 5, y + 54, 4, 10);
    });
  }
  // belt and baton
  ctx.fillStyle = '#212121';
  ctx.fillRect(x, y + 84, w, 6);
  const batonOut = fighter.isAttacking || fighter.policeBatonTimer > 0;
  ctx.save();
  ctx.translate(dir > 0 ? x + w : x, y + (batonOut ? 54 : 88));
  ctx.rotate(batonOut ? 0 : dir * 1.2);
  ctx.fillStyle = '#263238';
  ctx.fillRect(dir > 0 ? 0 : -34, -3, 34, 6);
  ctx.restore();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  if (fighter.isAttacking) {
    ctx.fillStyle = fighter.attackColor;
    const area = fighter.attackArea;
    ctx.fillRect(area.x, area.y, area.width, area.height);
  }
}

// the young Scammer's details: a red suit, a white face, no glasses... and a face that changes with the fear
function drawYoungScammerDetails(fighter) {
  const fear = fighter.originsFear || 0;
  const time = performance.now() / 1000;
  ctx.save();
  // the scared one trembles
  if (fear >= 2) ctx.translate(Math.sin(time * 40) * (fear - 1), Math.cos(time * 33) * (fear - 2) * 0.6);
  const x = fighter.position.x;
  const y = fighter.position.y;
  const width = fighter.width;
  const height = fighter.height;
  const centerX = x + width / 2;
  ctx.fillStyle = '#c62828';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = fear >= 3 ? '#e4ebff' : fear >= 2 ? '#eef2ff' : '#ffffff';
  ctx.fillRect(x + 4, y + 14, width - 8, 38);
  // lapels, shirt and tie
  ctx.fillStyle = '#8e0000';
  ctx.fillRect(x, y + 52, width, 46);
  ctx.fillStyle = '#f2f2f2';
  ctx.beginPath();
  ctx.moveTo(centerX - 11, y + 52);
  ctx.lineTo(centerX + 11, y + 52);
  ctx.lineTo(centerX, y + 74);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fdd835';
  ctx.beginPath();
  ctx.moveTo(centerX, y + 55);
  ctx.lineTo(centerX + 4, y + 62);
  ctx.lineTo(centerX, y + 82);
  ctx.lineTo(centerX - 4, y + 62);
  ctx.closePath();
  ctx.fill();
  // the same spiky hair (it stands up even more when he is scared)
  const hairUp = fear * 3;
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 20);
  ctx.lineTo(x - 2, y - 4 - hairUp);
  ctx.lineTo(x + 8, y + 2);
  ctx.lineTo(x + 14, y - 10 - hairUp);
  ctx.lineTo(x + 24, y - 2);
  ctx.lineTo(x + 32, y - 12 - hairUp);
  ctx.lineTo(x + 40, y - 2);
  ctx.lineTo(x + 50, y - 9 - hairUp);
  ctx.lineTo(x + 56, y + 2);
  ctx.lineTo(x + width + 6, y - 2 - hairUp);
  ctx.lineTo(x + width + 4, y + 22);
  ctx.lineTo(x + width - 6, y + 14);
  ctx.lineTo(x + 6, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  if (fighter.youngGlasses && (fighter.originsCrazy || fighter.originsDizzy)) {
    // not quite right anymore: the glasses crooked, a twitch, a smile with too many teeth
    const twitch = Math.sin(time * 23) > 0.92 ? 2 : 0;
    ctx.save();
    ctx.translate(centerX, y + 31);
    ctx.rotate(0.16 + Math.sin(time * 3) * 0.04);
    ctx.translate(-centerX, -(y + 31));
    drawOriginsGlasses(centerX + twitch, y + 31, 0.95, 0.5);
    if (fighter.originsDizzy) {
      // spirals spinning on both lenses
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      [-11, 11].forEach((offset) => {
        ctx.beginPath();
        for (let turn = 0; turn < 24; turn += 1) {
          const angle = turn * 0.6 + time * 8;
          const radius = turn * 0.28;
          const spiralX = centerX + offset + Math.cos(angle) * radius;
          const spiralY = y + 31 + Math.sin(angle) * radius * 0.6;
          if (turn === 0) ctx.moveTo(spiralX, spiralY);
          else ctx.lineTo(spiralX, spiralY);
        }
        ctx.stroke();
      });
    }
    ctx.restore();
    ctx.fillStyle = '#5d1010';
    ctx.beginPath();
    ctx.ellipse(centerX, y + 41, 12, 6, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 11, y + 41, 22, 3);
    ctx.strokeStyle = '#5d1010';
    ctx.lineWidth = 1;
    for (let tooth = -8; tooth <= 8; tooth += 4) {
      ctx.beginPath();
      ctx.moveTo(centerX + tooth, y + 41);
      ctx.lineTo(centerX + tooth, y + 44);
      ctx.stroke();
    }
  } else if (fighter.youngGlasses) {
    // the glasses: one pink lens, one yellow lens... and the smile comes back
    drawOriginsGlasses(centerX, y + 31, 0.95, 0.4);
    ctx.fillStyle = '#5d1010';
    ctx.beginPath();
    ctx.arc(centerX, y + 40, 8, 0, Math.PI);
    ctx.fill();
  } else if (fear === 0) {
    // happy closed eyes ^ ^ and a big smile
    [-10, 10].forEach((offset) => {
      ctx.beginPath();
      ctx.arc(centerX + offset, y + 32, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    });
    ctx.fillStyle = '#5d1010';
    ctx.beginPath();
    ctx.arc(centerX, y + 40, 8, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 6, y + 40, 12, 3);
  } else {
    // open eyes: the more afraid, the bigger the eye and the smaller the pupil
    const eyeRadius = 4 + fear;
    const pupil = fear >= 3 ? 1.3 : 2.4;
    const look = Math.sin(time * (fear >= 3 ? 9 : 2)) * (fear - 1);
    [-10, 10].forEach((offset) => {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(centerX + offset, y + 31, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(centerX + offset + look, y + 31, pupil, 0, Math.PI * 2);
      ctx.fill();
    });
    if (fear >= 2) {
      // worried brows
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 17, y + 22);
      ctx.lineTo(centerX - 5, y + 18 + (fear - 2) * -2);
      ctx.moveTo(centerX + 17, y + 22);
      ctx.lineTo(centerX + 5, y + 18 + (fear - 2) * -2);
      ctx.stroke();
    }
    ctx.lineWidth = 2.5;
    if (fear === 1) {
      // a nervous smile: teeth clenched
      ctx.fillStyle = '#fff';
      ctx.fillRect(centerX - 9, y + 40, 18, 6);
      ctx.strokeRect(centerX - 9, y + 40, 18, 6);
      ctx.beginPath();
      ctx.moveTo(centerX - 9, y + 43);
      ctx.lineTo(centerX + 9, y + 43);
      ctx.stroke();
    } else if (fear === 2) {
      // a wobbly mouth
      ctx.beginPath();
      ctx.moveTo(centerX - 10, y + 44);
      for (let step = 1; step <= 5; step += 1) ctx.lineTo(centerX - 10 + step * 4, y + 44 + (step % 2 ? -2 : 2));
      ctx.stroke();
    } else {
      // a mouth open in terror
      ctx.fillStyle = '#3b0b0b';
      ctx.beginPath();
      ctx.ellipse(centerX, y + 44, 5, 6 + Math.sin(time * 20), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // cold sweat
    ctx.fillStyle = 'rgba(129, 212, 250, 0.9)';
    for (let drop = 0; drop < fear; drop += 1) {
      const fall = ((time * 30 + drop * 13) % 18);
      const side = drop % 2 ? -1 : 1;
      ctx.beginPath();
      ctx.arc(centerX + side * (width / 2 - 4), y + 18 + drop * 6 + fall, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (fighter.youngScar) {
    // the scar of the tail: across the left eye
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 20, y + 18);
    ctx.lineTo(centerX - 3, y + 46);
    ctx.stroke();
    ctx.strokeStyle = '#4e0b0b';
    ctx.lineWidth = 1.5;
    [0.25, 0.5, 0.75].forEach((along) => {
      const stitchX = centerX - 20 + 17 * along;
      const stitchY = y + 18 + 28 * along;
      ctx.beginPath();
      ctx.moveTo(stitchX - 4, stitchY + 2);
      ctx.lineTo(stitchX + 4, stitchY - 2);
      ctx.stroke();
    });
  }
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
  ctx.restore();
}

// ---------------- the maps ----------------
function drawOriginsMarketStage(dusk = false) {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (dusk) {
    sky.addColorStop(0, '#4a2a6e');
    sky.addColorStop(0.6, '#ff7043');
    sky.addColorStop(1, '#ffcc80');
  } else {
    sky.addColorStop(0, '#64b5f6');
    sky.addColorStop(1, '#e3f2fd');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = dusk ? 'rgba(255, 112, 67, 0.9)' : '#fff59d';
  ctx.beginPath();
  ctx.arc(dusk ? 820 : 140, dusk ? 300 : 90, dusk ? 60 : 40, 0, Math.PI * 2);
  ctx.fill();
  // city buildings
  const colors = ['#ef9a9a', '#ffe082', '#a5d6a7', '#90caf9', '#ce93d8', '#ffab91'];
  for (let building = 0; building < 8; building += 1) {
    const bx = building * 130 - 10;
    const top = ground - 200 - (building % 3) * 40;
    ctx.fillStyle = colors[building % colors.length];
    ctx.fillRect(bx, top, 120, ground - top);
    ctx.fillStyle = dusk ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(bx, top, 120, ground - top);
    ctx.fillStyle = dusk ? '#ffe082' : '#e3f2fd';
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) ctx.fillRect(bx + 14 + col * 34, top + 20 + row * 44, 20, 26);
    }
  }
  // market stalls with striped awnings
  [[60, '#e53935'], [400, '#43a047'], [760, '#1e88e5']].forEach(([stallX, color]) => {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(stallX, ground - 70, 160, 70);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(stallX + 6, ground - 120, 6, 50);
    ctx.fillRect(stallX + 148, ground - 120, 6, 50);
    for (let stripe = 0; stripe < 8; stripe += 1) {
      ctx.fillStyle = stripe % 2 ? '#fafafa' : color;
      ctx.fillRect(stallX - 6 + stripe * 22, ground - 140, 22, 24);
    }
  });
  // the free public fountain: the secret source of the "agua mojada"
  ctx.fillStyle = '#b0bec5';
  ctx.fillRect(560, ground - 46, 80, 46);
  ctx.fillRect(594, ground - 110, 12, 64);
  ctx.fillStyle = '#90a4ae';
  ctx.fillRect(582, ground - 116, 36, 8);
  ctx.fillStyle = 'rgba(129, 212, 250, 0.85)';
  ctx.fillRect(566, ground - 44, 68, 10);
  for (let jet = 0; jet < 2; jet += 1) {
    ctx.fillRect(jet ? 618 : 574, ground - 112 + ((time * 40 + jet * 20) % 60), 6, 8);
  }
  const stallHidden = arcadeCutscene.active && arcadeCutscene.scene === 'originsIntro' && arcadeCutscene.stallHidden;
  if (stallHidden) {
    drawOriginsMarketStreet(dusk, width, time);
    return;
  }
  // the stall of the young Scammer: AGUA MOJADA $5
  ctx.fillStyle = '#c62828';
  ctx.fillRect(540, ground - 60, 120, 60);
  ctx.fillStyle = '#fff';
  ctx.font = '900 14px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AGUA MOJADA', 600, ground - 36);
  ctx.fillStyle = '#fdd835';
  ctx.fillText('$5', 600, ground - 16);
  ctx.textAlign = 'left';
  for (let bottle = 0; bottle < 5; bottle += 1) {
    ctx.fillStyle = 'rgba(129, 212, 250, 0.9)';
    ctx.fillRect(548 + bottle * 22, ground - 82, 12, 22);
    ctx.fillStyle = '#e53935';
    ctx.fillRect(551 + bottle * 22, ground - 86, 6, 4);
  }
  drawOriginsMarketStreet(dusk, width, time);
}

function drawOriginsMarketStreet(dusk, width, time) {
  // the street
  ctx.fillStyle = dusk ? '#6d5a63' : '#9e9e9e';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = dusk ? '#7d6a73' : '#bdbdbd';
  ctx.fillRect(0, ground, width, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let mark = 0; mark < width; mark += 90) ctx.fillRect(mark, ground + 30, 50, 5);
  if (dusk) {
    // the first street lamps light up
    [250, 700].forEach((lampX) => {
      const glow = ctx.createRadialGradient(lampX, ground - 160, 2, lampX, ground - 160, 50);
      glow.addColorStop(0, `rgba(255, 224, 130, ${0.7 + Math.sin(time * 3) * 0.1})`);
      glow.addColorStop(1, 'rgba(255, 224, 130, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lampX - 50, ground - 210, 100, 100);
      ctx.fillStyle = '#37474f';
      ctx.fillRect(lampX - 3, ground - 160, 6, 160);
    });
  }
}

function drawOriginsRooftopsStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#0b1026');
  sky.addColorStop(1, '#283a6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 50; star += 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 2 + star) * 0.3})`;
    ctx.fillRect((star * 131) % width, (star * 47) % 220, 2, 2);
  }
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath();
  ctx.arc(860, 80, 34, 0, Math.PI * 2);
  ctx.fill();
  // the skyline far away, full of lit windows
  for (let building = 0; building < 14; building += 1) {
    const bx = building * 76;
    const top = ground - 250 - ((building * 37) % 120);
    ctx.fillStyle = '#141b38';
    ctx.fillRect(bx, top, 70, ground - top);
    for (let window = 0; window < 10; window += 1) {
      if ((window + building) % 3 === 0) continue;
      ctx.fillStyle = 'rgba(255, 213, 79, 0.6)';
      ctx.fillRect(bx + 8 + (window % 3) * 20, top + 14 + Math.floor(window / 3) * 30, 10, 14);
    }
  }
  // a police helicopter spotlight sweeping the roofs
  const sweep = 500 + Math.sin(time * 0.8) * 380;
  ctx.fillStyle = 'rgba(255, 255, 220, 0.12)';
  ctx.beginPath();
  ctx.moveTo(sweep + 120, -10);
  ctx.lineTo(sweep - 80, ground);
  ctx.lineTo(sweep + 80, ground);
  ctx.closePath();
  ctx.fill();
  // the roof we fight on: chimneys, a water tank, an antenna
  ctx.fillStyle = '#3e2f2f';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#5d4040';
  ctx.fillRect(0, ground, width, 8);
  ctx.fillStyle = '#4e342e';
  [[80, 70], [940, 90]].forEach(([chimneyX, chimneyH]) => {
    ctx.fillRect(chimneyX, ground - chimneyH, 30, chimneyH);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(chimneyX - 4, ground - chimneyH - 8, 38, 8);
    ctx.fillStyle = '#4e342e';
  });
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(820, ground - 150, 80, 90);
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(826, ground - 60, 8, 60);
  ctx.fillRect(886, ground - 60, 8, 60);
  ctx.strokeStyle = '#90a4ae';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, ground);
  ctx.lineTo(180, ground - 120);
  ctx.moveTo(165, ground - 100);
  ctx.lineTo(195, ground - 100);
  ctx.stroke();
  ctx.fillStyle = Math.sin(time * 4) > 0 ? '#ff1744' : '#b71c1c';
  ctx.fillRect(177, ground - 126, 6, 6);
}

function drawOriginsStationStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#1a237e');
  sky.addColorStop(1, '#ff8a65');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  // the police station
  ctx.fillStyle = '#90a4ae';
  ctx.fillRect(220, ground - 300, 580, 300);
  ctx.fillStyle = '#78909c';
  ctx.fillRect(200, ground - 320, 620, 24);
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(390, ground - 290, 240, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COMISARIA', 510, ground - 259);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#37474f';
  ctx.fillRect(470, ground - 120, 80, 120);
  ctx.fillStyle = '#ffe082';
  for (let col = 0; col < 4; col += 1) {
    ctx.fillRect(250 + col * 150, ground - 220, 60, 50);
  }
  // the bars of a window
  ctx.fillStyle = '#263238';
  for (let bar = 0; bar < 5; bar += 1) ctx.fillRect(255 + bar * 12, ground - 220, 3, 50);
  // a patrol car parked outside, lights flashing
  const carX = 130;
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(carX - 60, ground - 40, 130, 34);
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(carX - 60, ground - 28, 130, 10);
  ctx.fillStyle = '#b0bec5';
  ctx.fillRect(carX - 30, ground - 62, 70, 22);
  ctx.fillStyle = Math.sin(time * 10) > 0 ? '#ff1744' : '#2979ff';
  ctx.fillRect(carX - 6, ground - 72, 24, 10);
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.arc(carX - 30, ground - 6, 11, 0, Math.PI * 2);
  ctx.arc(carX + 40, ground - 6, 11, 0, Math.PI * 2);
  ctx.fill();
  // flashing light on the scene
  ctx.fillStyle = Math.sin(time * 10) > 0 ? 'rgba(255, 23, 68, 0.06)' : 'rgba(41, 121, 255, 0.06)';
  ctx.fillRect(0, 0, width, canvas.height);
  // the sidewalk
  ctx.fillStyle = '#8d8d8d';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#a7a7a7';
  ctx.fillRect(0, ground, width, 6);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  for (let tile = 0; tile < width; tile += 60) {
    ctx.beginPath();
    ctx.moveTo(tile, ground);
    ctx.lineTo(tile, canvas.height);
    ctx.stroke();
  }
}

function drawOriginsStage() {
  if (selectedMap === 'originsMarket') return drawOriginsMarketStage(false), true;
  if (selectedMap === 'originsMarketDusk') return drawOriginsMarketStage(true), true;
  if (selectedMap === 'originsRooftops') return drawOriginsRooftopsStage(), true;
  if (selectedMap === 'originsStation') return drawOriginsStationStage(), true;
  if (selectedMap === 'originsNight') return drawOriginsNightStage(), true;
  if (selectedMap === 'originsCastle') return drawOriginsCastleStage(), true;
  if (selectedMap === 'cobaltEdge') return drawCobaltEdgeStage(), true;
  if (selectedMap === 'originsRooftopsDark') return drawOriginsRooftopsDarkStage(), true;
  if (selectedMap === 'originsAlleyDark') return drawGamblerAlleyStage(1.9, 0), drawOriginsAlleyDecay(), true;
  return false;
}

syncOriginsChapterButton();

// ---------------- the young Scammer's own tricks (only in this chapter) ----------------
// Q: a bottle of agua mojada (a slippery puddle) - F: a "2x1" sign (customers can't resist it) - R: a market cart
const youngScamFx = { bottles: [], puddles: [], signs: [], carts: [] };
const youngScamCooldowns = { q: 140, f: 300, r: 480 };

function resetYoungScammer(fighter) {
  fighter.youngWaterCooldown = 0;
  fighter.youngSignCooldown = 0;
  fighter.youngCartCooldown = 0;
  youngScamFx.bottles = [];
  youngScamFx.puddles = [];
  youngScamFx.signs = [];
  youngScamFx.carts = [];
}

function getYoungScammerCooldowns(player) {
  return {
    q: { active: true, name: 'Agua mojada', remaining: player.youngWaterCooldown || 0, max: getDebugCooldown(youngScamCooldowns.q, player) },
    f: { active: true, name: 'Oferta 2x1', remaining: player.youngSignCooldown || 0, max: getDebugCooldown(youngScamCooldowns.f, player) },
    r: { active: true, name: 'Carrito del mercado', remaining: player.youngCartCooldown || 0, max: getDebugCooldown(youngScamCooldowns.r, player) },
  };
}

function handleYoungScammerKey(attacker, target, slot) {
  if (!attacker.youngScammer) return false;
  if (!canFighterAct(attacker) || attacker.gamblerStunTimer > 0 || gameOver || arcadeCutscene.active) return true;
  const direction = getFighterCenterX(target) >= getFighterCenterX(attacker) ? 1 : -1;
  if (slot === 'q' && !(attacker.youngWaterCooldown > 0)) {
    youngScamFx.bottles.push({ x: getFighterCenterX(attacker) + direction * 30, y: attacker.position.y + 30, vx: direction * 9, vy: -1.5, spin: 0, attacker, target });
    attacker.youngWaterCooldown = getDebugCooldown(youngScamCooldowns.q, attacker);
    showScamLabel(attacker, 'AGUA MOJADA!');
    playSound('menuSelect');
    recordSpecialUsed(attacker);
  } else if (slot === 'f' && !(attacker.youngSignCooldown > 0)) {
    const signX = Math.max(30, Math.min(canvas.width - 30, getFighterCenterX(attacker) + direction * 90));
    youngScamFx.signs = youngScamFx.signs.filter((sign) => sign.attacker !== attacker);
    youngScamFx.signs.push({ x: signX, life: 360, pop: 0, attacker, target });
    attacker.youngSignCooldown = getDebugCooldown(youngScamCooldowns.f, attacker);
    showScamLabel(attacker, 'OFERTA!');
    playSound('cutsceneCash');
    recordSpecialUsed(attacker);
  } else if (slot === 'r' && !(attacker.youngCartCooldown > 0)) {
    youngScamFx.carts.push({ x: direction > 0 ? attacker.position.x - 60 : attacker.position.x + attacker.width + 60, vx: direction * 11, hit: false, fruits: [], attacker, target });
    attacker.youngCartCooldown = getDebugCooldown(youngScamCooldowns.r, attacker);
    showScamLabel(attacker, 'PASO, PASO!');
    playSound('omegaKickLaunch');
    recordSpecialUsed(attacker);
  }
  return true;
}

function makeOriginsPuddle(x) {
  youngScamFx.puddles.push({ x, width: 120, life: 330 });
  playNoise({ duration: 0.2, volume: 0.05, filterFrequency: 2600 });
}

function updateYoungScammer(fighter) {
  tickCooldowns(fighter, ['youngWaterCooldown', 'youngSignCooldown', 'youngCartCooldown']);
  if (arcadeCutscene.active || gameOver) return;
  // (the secret level is always fought in the castle, even if its intro was skipped)
  if (arcadeChapter === 'origins' && selectedNormalArcadeLevel === originsSecretLevel && selectedMap !== 'originsCastle') selectedMap = 'originsCastle';
  // in the fights of the friends the fear never goes away
  const levelFear = arcadeChapter === 'origins' && selectedNormalArcadeLevel >= 6 ? selectedNormalArcadeLevel - 5 : 0;
  if (!fighter.youngGlasses && (fighter.originsFear || 0) < levelFear) fighter.originsFear = levelFear;
  const target = getOpponent(fighter);
  // the bottle: an arc that breaks on whoever (or wherever) it lands
  youngScamFx.bottles.forEach((bottle) => {
    bottle.x += bottle.vx;
    bottle.y += bottle.vy;
    bottle.vy += 0.3;
    bottle.spin += 0.3;
    const area = { x: bottle.x - 10, y: bottle.y - 14, width: 20, height: 28 };
    if (rectangularCollision({ rectangle1: area, rectangle2: target })) {
      bottle.done = true;
      if (knightHit(fighter, target, area, 9, Math.sign(bottle.vx) * 5, -4) === true) showScamLabel(target, 'EMPAPADO!');
      makeOriginsPuddle(getFighterCenterX(target));
    } else if (bottle.y >= ground - 6) {
      bottle.done = true;
      makeOriginsPuddle(bottle.x);
    }
  });
  youngScamFx.bottles = youngScamFx.bottles.filter((bottle) => !bottle.done && bottle.x > -40 && bottle.x < canvas.width + 40);
  // the puddles: step in one and you slip
  youngScamFx.puddles.forEach((puddle) => {
    puddle.life -= 1;
    const onFloor = target.position.y + target.height >= ground - 4;
    if (onFloor && Math.abs(getFighterCenterX(target) - puddle.x) < puddle.width / 2 && !(target.originsSlipCooldown > 0)) {
      target.originsSlipCooldown = 110;
      target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(40, target));
      target.velocity.x = (target.velocity.x || 0) * 0.3 + (Math.random() > 0.5 ? 4 : -4);
      target.velocity.y = -5;
      showScamLabel(target, 'RESBALO!');
      playSound('cutsceneSurprise');
    }
  });
  if (target.originsSlipCooldown > 0) target.originsSlipCooldown -= 1;
  youngScamFx.puddles = youngScamFx.puddles.filter((puddle) => puddle.life > 0);
  // the 2x1 sign: an enemy who gets close stops to read it... and Scammer "sells" something
  youngScamFx.signs.forEach((sign) => {
    sign.life -= 1;
    if (sign.pop > 0) {
      sign.pop -= 1;
      if (sign.pop === 0) sign.life = 0;
      return;
    }
    if (Math.abs(getFighterCenterX(target) - sign.x) < 70 && target.position.y + target.height >= ground - 30) {
      sign.pop = 24;
      target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(75, target));
      target.velocity.x = 0;
      applyDamage(fighter, target, 6, { isSpecial: true });
      fighter.health = Math.min(fighter.maxHealth, fighter.health + 8);
      showScamLabel(target, '2x1?! DONDE?');
      showScamLabel(fighter, 'VENDIDO! +8');
      playSound('cutsceneCash');
    }
  });
  youngScamFx.signs = youngScamFx.signs.filter((sign) => sign.life > 0);
  // the market cart: rolls across the whole stage, fruit flying everywhere
  youngScamFx.carts.forEach((cart) => {
    cart.x += cart.vx;
    if (Math.random() < 0.3) cart.fruits.push({ x: cart.x, y: ground - 60, vx: (Math.random() - 0.5) * 6, vy: -5 - Math.random() * 4, color: ['#e53935', '#fdd835', '#ff9800', '#43a047'][Math.floor(Math.random() * 4)], life: 50 });
    cart.fruits.forEach((fruit) => {
      fruit.x += fruit.vx;
      fruit.y += fruit.vy;
      fruit.vy += 0.4;
      fruit.life -= 1;
    });
    cart.fruits = cart.fruits.filter((fruit) => fruit.life > 0 && fruit.y < ground);
    if (!cart.hit) {
      const area = { x: cart.x - 50, y: ground - 70, width: 100, height: 70 };
      const result = knightHit(fighter, target, area, 16, Math.sign(cart.vx) * 13, -10);
      if (result) {
        cart.hit = true;
        if (result === true) showScamLabel(target, 'ATROPELLADO!');
      }
    }
  });
  youngScamFx.carts = youngScamFx.carts.filter((cart) => cart.x > -160 && cart.x < canvas.width + 160);
}

function drawYoungScammerFx() {
  if (!player1.youngScammer && !player2.youngScammer) return;
  const time = performance.now() / 1000;
  ctx.save();
  youngScamFx.puddles.forEach((puddle) => {
    ctx.globalAlpha = Math.min(1, puddle.life / 40);
    ctx.fillStyle = 'rgba(79, 195, 247, 0.65)';
    ctx.beginPath();
    ctx.ellipse(puddle.x, ground + 4, puddle.width / 2, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(puddle.x - 30 + Math.sin(time * 3) * 8, ground + 1, 18, 3);
  });
  ctx.globalAlpha = 1;
  youngScamFx.bottles.forEach((bottle) => {
    ctx.save();
    ctx.translate(bottle.x, bottle.y);
    ctx.rotate(bottle.spin);
    ctx.fillStyle = 'rgba(129, 212, 250, 0.95)';
    ctx.fillRect(-7, -12, 14, 24);
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-4, -17, 8, 5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-7, -3, 14, 6);
    ctx.restore();
  });
  youngScamFx.signs.forEach((sign) => {
    const scale = sign.pop > 0 ? 1 + (24 - sign.pop) * 0.04 : 1;
    ctx.save();
    ctx.globalAlpha = sign.pop > 0 ? sign.pop / 24 : Math.min(1, sign.life / 30);
    ctx.translate(sign.x, ground);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(-4, -70, 8, 70);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(-44, -112, 88, 50);
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 4;
    ctx.strokeRect(-44, -112, 88, 50);
    ctx.fillStyle = '#c62828';
    ctx.font = '900 22px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('2x1!', 0, -84 + Math.sin(time * 6) * 2);
    ctx.font = '900 10px Courier New, monospace';
    ctx.fillText('SOLO HOY', 0, -68);
    ctx.restore();
  });
  youngScamFx.carts.forEach((cart) => {
    const x = cart.x;
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x - 50, ground - 52, 100, 36);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x - 50, ground - 52, 100, 6);
    ['#e53935', '#fdd835', '#ff9800', '#43a047', '#e53935'].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x - 36 + index * 18, ground - 58, 9, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#212121';
    [-30, 30].forEach((offset) => {
      ctx.beginPath();
      ctx.arc(x + offset, ground - 10, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x - Math.sign(cart.vx) * 120, ground - 34, Math.sign(cart.vx) * 60, 3);
    cart.fruits.forEach((fruit) => {
      ctx.fillStyle = fruit.color;
      ctx.beginPath();
      ctx.arc(fruit.x, fruit.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  ctx.restore();
}

function getOriginsTrackKey() {
  if (selectedNormalArcadeLevel === originsSecretLevel) return 'jesterRevolving';
  if (selectedNormalArcadeLevel >= 6) return 'friendLaughter';
  if (selectedNormalArcadeLevel === 5) return 'scamNeo';
  if (selectedNormalArcadeLevel === 4) return 'sheriffShowdown';
  if (selectedNormalArcadeLevel === 3) return 'madMuse';
  return 'scamNormal';
}

// ---------------- the friends as fighters ----------------
// they never talk: they blink behind you, pull you from the shadows, throw their eyes... and laugh
function isFriendThing(fighter) {
  return Boolean(fighter && (fighter.secretVariant === 'friendThing' || fighter.secretVariant === 'bigFriend'));
}

function resetFriendThing(fighter) {
  Object.assign(fighter, {
    friendBlinkCooldown: 140,
    friendHandsCooldown: 120,
    friendEyesCooldown: 200,
    friendWaveCooldown: 260,
    friendLaughGap: 0,
    friendBlink: null,
    friendFade: 1,
    friendHands: [],
    friendOrbs: [],
    friendWaves: [],
    friendGrin: 0,
    friendBoxStarted: false,
    friendBoxDone: false,
  });
}

function friendLaugh(fighter, kind) {
  fighter.friendGrin = 50;
  if (fighter.friendLaughGap > 0) return;
  fighter.friendLaughGap = 100;
  playFriendLaugh(fighter.secretVariant === 'bigFriend' && kind !== 'high' ? 'deep' : kind);
}

function updateFriendThing(fighter) {
  if (!fighter.friendHands) resetFriendThing(fighter);
  tickCooldowns(fighter, ['friendBlinkCooldown', 'friendHandsCooldown', 'friendEyesCooldown', 'friendWaveCooldown', 'friendLaughGap', 'friendGrin']);
  if (arcadeCutscene.active) {
    fighter.friendFade = 1;
    return;
  }
  const target = getOpponent(fighter);
  const big = fighter.secretVariant === 'bigFriend';
  // the big one doesn't fall before its BOX ATTACK
  if (big && isOriginsArcade() && !fighter.friendBoxStarted && fighter.health <= fighter.maxHealth * bigFriendBoxRatio + 0.5 && gameStarted && !gameOver && !dodgeRound.active) {
    fighter.friendBlink = null;
    fighter.friendFade = 1;
    fighter.friendHands = [];
    fighter.friendOrbs = [];
    fighter.friendWaves = [];
    if (startDodgeRound('friendBox', fighter, target)) {
      fighter.friendBoxStarted = true;
      playFriendLaugh('deep');
    }
    return;
  }
  // the blink: it melts into the shadows and comes out behind you
  if (fighter.friendBlink) {
    const blink = fighter.friendBlink;
    blink.timer += 1;
    fighter.velocity.x = 0;
    if (blink.phase === 'out') {
      fighter.friendFade = Math.max(0, 1 - blink.timer / 18);
      if (blink.timer >= 18) {
        const behind = target.attacksToTheRight ? -1 : 1;
        fighter.position.x = Math.max(0, Math.min(canvas.width - fighter.width, getFighterCenterX(target) + behind * (70 + fighter.width / 2) - fighter.width / 2));
        blink.phase = 'in';
        blink.timer = 0;
      }
    } else {
      fighter.friendFade = Math.min(1, blink.timer / 10);
      if (blink.timer >= 10) {
        fighter.friendBlink = null;
        fighter.friendFade = 1;
        fighter.attacksToTheRight = getFighterCenterX(target) > getFighterCenterX(fighter);
        fighter.attack(big);
      }
    }
  }
  // hands from the shadows
  fighter.friendHands.forEach((hand) => {
    hand.timer += 1;
    if (hand.timer === hand.warn) {
      const result = knightHit(fighter, target, { x: hand.x - 40, y: ground - 120, width: 80, height: 120 }, big ? 14 : 11, 0, -9);
      if (result === true) {
        target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(28, target));
        showScamLabel(target, 'ATRAPADO!');
      }
    }
  });
  fighter.friendHands = fighter.friendHands.filter((hand) => hand.timer < hand.warn + 30);
  // the thrown eyes: a pink one and a yellow one, chasing you a little
  fighter.friendOrbs.forEach((orb) => {
    orb.life -= 1;
    const dx = getFighterCenterX(target) - orb.x;
    const dy = target.position.y + target.height * 0.4 - orb.y;
    orb.vx = Math.max(-7, Math.min(7, orb.vx + Math.sign(dx) * 0.22));
    orb.vy = Math.max(-4, Math.min(4, orb.vy + Math.sign(dy) * 0.15));
    orb.x += orb.vx;
    orb.y += orb.vy;
    if (rectangularCollision({ rectangle1: { x: orb.x - 10, y: orb.y - 10, width: 20, height: 20 }, rectangle2: target })) {
      orb.life = 0;
      if (!handleCopycatShieldHit(target, fighter)) {
        applyDamage(fighter, target, big ? 8 : 6, { isSpecial: true });
        playSound('robotHit');
      }
    }
  });
  fighter.friendOrbs = fighter.friendOrbs.filter((orb) => orb.life > 0);
  // the big one's laugh: a wave of shadow along the floor (jump it!)
  fighter.friendWaves.forEach((wave) => {
    wave.x += wave.vx;
    wave.life -= 1;
    if (!wave.hit && Math.abs(getFighterCenterX(target) - wave.x) < 34 && target.position.y + target.height >= ground - 8) {
      wave.hit = true;
      knightHit(fighter, target, { x: target.position.x, y: target.position.y, width: target.width, height: target.height }, 12, Math.sign(wave.vx) * 9, -8);
    }
  });
  fighter.friendWaves = fighter.friendWaves.filter((wave) => wave.life > 0 && wave.x > -60 && wave.x < canvas.width + 60);
}

function castFriendBlink(fighter) {
  if (fighter.friendBlinkCooldown > 0 || fighter.friendBlink) return false;
  fighter.friendBlink = { phase: 'out', timer: 0 };
  fighter.friendBlinkCooldown = getDebugCooldown(fighter.secretVariant === 'bigFriend' ? 190 : 220, fighter);
  friendLaugh(fighter, 'soft');
  recordSpecialUsed(fighter);
  return true;
}

function castFriendHands(fighter, target) {
  if (fighter.friendHandsCooldown > 0) return false;
  const centerX = getFighterCenterX(target);
  fighter.friendHands.push({ x: centerX, timer: 0, warn: 42 });
  if (fighter.secretVariant === 'bigFriend') {
    fighter.friendHands.push({ x: centerX - 130, timer: -10, warn: 42 }, { x: centerX + 130, timer: -10, warn: 42 });
  }
  fighter.friendHandsCooldown = getDebugCooldown(230, fighter);
  friendLaugh(fighter, 'normal');
  recordSpecialUsed(fighter);
  return true;
}

function castFriendEyes(fighter, target) {
  if (fighter.friendEyesCooldown > 0) return false;
  const direction = getFighterCenterX(target) >= getFighterCenterX(fighter) ? 1 : -1;
  ['#ff4fa3', '#ffd60a'].forEach((color, index) => {
    fighter.friendOrbs.push({ x: fighter.position.x + fighter.width * (index ? 0.68 : 0.32), y: fighter.position.y + 34, vx: direction * (3 + index), vy: -2 + index * 2, color, life: 120 });
  });
  fighter.friendEyesCooldown = getDebugCooldown(200, fighter);
  friendLaugh(fighter, 'high');
  recordSpecialUsed(fighter);
  return true;
}

function castFriendWave(fighter) {
  if (fighter.friendWaveCooldown > 0 || fighter.secretVariant !== 'bigFriend') return false;
  const centerX = getFighterCenterX(fighter);
  fighter.friendWaves.push({ x: centerX, vx: -7, life: 160, hit: false }, { x: centerX, vx: 7, life: 160, hit: false });
  fighter.friendWaveCooldown = getDebugCooldown(300, fighter);
  fighter.friendLaughGap = 0;
  friendLaugh(fighter, 'deep');
  recordSpecialUsed(fighter);
  return true;
}

function updateFriendBotSpecials(profile, absDistance) {
  const friend = player2;
  if (!friend.friendHands) resetFriendThing(friend);
  if (friend.friendBlink) return true;
  const options = [];
  if (absDistance > 200 && !(friend.friendBlinkCooldown > 0)) options.push(() => castFriendBlink(friend));
  if (!(friend.friendHandsCooldown > 0)) options.push(() => castFriendHands(friend, player1));
  if (absDistance > 150 && !(friend.friendEyesCooldown > 0)) options.push(() => castFriendEyes(friend, player1));
  if (friend.secretVariant === 'bigFriend' && absDistance < 420 && !(friend.friendWaveCooldown > 0)) options.push(() => castFriendWave(friend));
  if (!options.length || !shouldBotUseSpecial(profile, 0.06)) return false;
  return options[Math.floor(Math.random() * options.length)]();
}

// a black cat-like shape: pointed ears, a long tail, a pink eye, a yellow eye and a smile that is not really a smile
function drawFriendThing(fighter) {
  if (fighter.secretVariant === 'bigFriend') {
    drawBigFriend(fighter);
    return;
  }
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const dir = fighter.attacksToTheRight ? 1 : -1;
  const time = performance.now() / 1000;
  ctx.save();
  ctx.globalAlpha = fighter.friendFade ?? 1;
  // a dark aura
  const aura = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, h * 0.8);
  aura.addColorStop(0, 'rgba(74, 20, 140, 0.35)');
  aura.addColorStop(1, 'rgba(74, 20, 140, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(x - h * 0.6, y - h * 0.3, w + h * 1.2, h * 1.6);
  // the tail, swaying behind it
  ctx.strokeStyle = '#050505';
  ctx.lineWidth = w * 0.13;
  ctx.lineCap = 'round';
  const tailX = dir > 0 ? x : x + w;
  ctx.beginPath();
  ctx.moveTo(tailX, y + h * 0.85);
  ctx.quadraticCurveTo(tailX - dir * w * 0.7, y + h * 0.8, tailX - dir * w * 0.6 + Math.sin(time * 3) * 8, y + h * 0.45);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // the body, with two pointed ears
  ctx.fillStyle = '#050505';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + h * 0.15);
  ctx.lineTo(x + w * 0.06, y - h * 0.12);
  ctx.lineTo(x + w * 0.32, y + h * 0.06);
  ctx.lineTo(x + w * 0.68, y + h * 0.06);
  ctx.lineTo(x + w * 0.94, y - h * 0.12);
  ctx.lineTo(x + w, y + h * 0.15);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  // the eyes and the grin (wider while it laughs)
  const eyeSize = w * 0.12;
  drawFriendEyePair(x + w / 2, y + h * 0.27, eyeSize, ctx.globalAlpha, false, fighter.secretVariant === 'bigFriend' ? 2 : 0);
  drawFriendGrin(x + w / 2, y + h * 0.4, w * (fighter.friendGrin > 0 ? 0.36 : 0.28), ctx.globalAlpha);
  if (fighter.isAttacking) {
    // claw marks
    const area = fighter.attackArea;
    ctx.strokeStyle = 'rgba(206, 147, 216, 0.85)';
    ctx.lineWidth = 3;
    for (let claw = 0; claw < 3; claw += 1) {
      ctx.beginPath();
      ctx.moveTo(area.x + 8, area.y + claw * 10);
      ctx.lineTo(area.x + area.width - 8, area.y + claw * 10 + 12);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawFriendFx() {
  const time = performance.now() / 1000;
  if (isOriginsArcade() && selectedNormalArcadeLevel >= 6 && !arcadeCutscene.active) drawOriginsDread(1);
  // in the last level, the rest of them watch from the dark
  if (isOriginsArcade() && selectedNormalArcadeLevel === originsLevelCount && !arcadeCutscene.active) {
    [[90, 120], [930, 110], [330, 90], [700, 100], [520, 60]].forEach(([eyeX, eyeY], index) => drawFriendEyePair(eyeX, eyeY + 120, 5, 0.55, false, time + index * 2.1));
  }
  [player1, player2].forEach((fighter) => {
    if (!isFriendThing(fighter) || !fighter.friendHands) return;
    ctx.save();
    fighter.friendHands.forEach((hand) => {
      if (hand.timer < 0) return;
      if (hand.timer < hand.warn) {
        // a dark stain on the floor... with a tiny smile
        const pulse = 0.4 + Math.sin(time * 14) * 0.15;
        ctx.fillStyle = `rgba(20, 0, 30, ${pulse + 0.3})`;
        ctx.beginPath();
        ctx.ellipse(hand.x, ground + 2, 46, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        drawFriendEyePair(hand.x, ground - 2, 3, 0.9, false, hand.x);
      } else {
        // black hands rising out of it
        const rise = Math.min(1, (hand.timer - hand.warn) / 6) * (1 - Math.max(0, hand.timer - hand.warn - 18) / 12);
        ctx.fillStyle = '#050505';
        [-22, 0, 22].forEach((offset, index) => {
          const handHeight = (90 + index * 14) * rise;
          ctx.fillRect(hand.x + offset - 8, ground - handHeight, 16, handHeight);
          ctx.beginPath();
          ctx.moveTo(hand.x + offset - 10, ground - handHeight);
          ctx.lineTo(hand.x + offset, ground - handHeight - 16 * rise);
          ctx.lineTo(hand.x + offset + 10, ground - handHeight);
          ctx.fill();
        });
      }
    });
    fighter.friendOrbs.forEach((orb) => {
      ctx.shadowColor = orb.color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = orb.color;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(orb.x, orb.y, 2.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    fighter.friendWaves.forEach((wave) => {
      ctx.fillStyle = 'rgba(30, 0, 45, 0.85)';
      ctx.beginPath();
      ctx.ellipse(wave.x, ground, 30, 34, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      drawFriendGrin(wave.x, ground - 22, 16, 0.9);
    });
    ctx.restore();
  });
}


// ---------------- the dread: what makes the friends' levels feel wrong ----------------
let originsFlickerFrames = 0;

function drawOriginsVignette(strength) {
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.55, 180, canvas.width / 2, canvas.height * 0.55, 640);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.92, 0.85 * strength)})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOriginsFog(time, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  for (let band = 0; band < 6; band += 1) {
    const x = ((time * (12 + band * 5) + band * 230) % (canvas.width + 600)) - 300;
    ctx.fillStyle = `rgba(70, 45, 80, ${alpha * 0.14})`;
    ctx.beginPath();
    ctx.ellipse(x, ground - 20 - (band % 3) * 26, 260, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// the layer on top of everything: dark edges, film scratches, a heartbeat of red and the lights failing
function drawOriginsDread(strength = 1) {
  const time = performance.now() / 1000;
  drawOriginsVignette(strength);
  const beat = Math.pow(Math.max(0, Math.sin(time * 2.6)), 12) + Math.pow(Math.max(0, Math.sin(time * 2.6 - 0.5)), 12) * 0.6;
  ctx.fillStyle = `rgba(120, 0, 15, ${0.09 * beat * strength})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.05 * strength})`;
  for (let scratch = 0; scratch < 14; scratch += 1) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 4 + Math.random() * 30);
  }
  if (originsFlickerFrames <= 0 && Math.random() < 0.004 * strength) originsFlickerFrames = 3 + Math.floor(Math.random() * 4);
  if (originsFlickerFrames > 0) {
    originsFlickerFrames -= 1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// a tiny black shape with ears and two dots of color, far away
function drawFriendSilhouette(x, y, scale, seed) {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x - 9 * scale, y);
  ctx.lineTo(x - 9 * scale, y - 22 * scale);
  ctx.lineTo(x - 8 * scale, y - 30 * scale);
  ctx.lineTo(x - 3 * scale, y - 24 * scale);
  ctx.lineTo(x + 3 * scale, y - 24 * scale);
  ctx.lineTo(x + 8 * scale, y - 30 * scale);
  ctx.lineTo(x + 9 * scale, y - 22 * scale);
  ctx.lineTo(x + 9 * scale, y);
  ctx.closePath();
  ctx.fill();
  drawFriendEyePair(x, y - 18 * scale, 1.6 * scale, 0.95, false, seed);
}

// level 6: the market at night, abandoned... under a red moon
function drawOriginsNightStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#030106');
  sky.addColorStop(0.6, '#1a0309');
  sky.addColorStop(1, '#4a0a12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  // a blood-red moon behind black clouds
  const glow = ctx.createRadialGradient(820, 110, 30, 820, 110, 170);
  glow.addColorStop(0, 'rgba(200, 20, 30, 0.35)');
  glow.addColorStop(1, 'rgba(200, 20, 30, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(650, 0, 340, 300);
  ctx.fillStyle = '#8e1616';
  ctx.beginPath();
  ctx.arc(820, 110, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(60, 0, 0, 0.6)';
  [[805, 95, 9], [836, 122, 7], [824, 92, 4]].forEach(([craterX, craterY, radius]) => {
    ctx.beginPath();
    ctx.arc(craterX, craterY, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  [[100, 8], [126, 5]].forEach(([cloudY, cloudH], index) => {
    ctx.beginPath();
    ctx.ellipse(820 + Math.sin(time * 0.2 + index * 2) * 60, cloudY, 130, cloudH, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // crooked black buildings; some windows are watching
  for (let building = 0; building < 9; building += 1) {
    const bx = building * 120 - 20;
    const top = ground - 220 - ((building * 53) % 90);
    const lean = ((building * 37) % 20) - 10;
    ctx.fillStyle = '#0a0710';
    ctx.beginPath();
    ctx.moveTo(bx, ground);
    ctx.lineTo(bx + lean, top);
    ctx.lineTo(bx + 112 + lean, top + 8);
    ctx.lineTo(bx + 112, ground);
    ctx.closePath();
    ctx.fill();
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const windowX = bx + 14 + col * 32 + lean * (1 - row / 3) * 0.5;
        const windowY = top + 24 + row * 46;
        if ((row + col + building) % 4 === 0) {
          ctx.fillStyle = 'rgba(140, 20, 30, 0.45)';
          ctx.fillRect(windowX, windowY, 18, 24);
        } else if (row === 1 && col === 1 && building % 3 === 1 && Math.sin(time * 0.6 + building) > -0.3) {
          drawFriendEyePair(windowX + 9, windowY + 12, 3, 0.85, false, building);
        }
      }
    }
  }
  // a smile scribbled on the wall, and the laugh written in chalk
  drawFriendGrin(300, ground - 175, 42, 0.16);
  ctx.save();
  ctx.translate(640, ground - 190);
  ctx.rotate(-0.12);
  ctx.font = '900 18px Courier New, monospace';
  ctx.fillStyle = 'rgba(255, 79, 163, 0.25)';
  ctx.fillText('JE JE JE JE', 0, 0);
  ctx.restore();
  // abandoned stalls with torn awnings
  [[60, '#4a1515'], [400, '#173a1a'], [760, '#152a4a']].forEach(([stallX, color], stallIndex) => {
    ctx.fillStyle = '#211714';
    ctx.fillRect(stallX, ground - 70, 160, 70);
    ctx.fillStyle = '#140d0b';
    ctx.fillRect(stallX + 6, ground - 120, 6, 50);
    ctx.fillRect(stallX + 148, ground - 120, 6, 50);
    for (let stripe = 0; stripe < 8; stripe += 1) {
      if ((stripe * 7 + stallIndex) % 5 === 0) continue;
      ctx.fillStyle = stripe % 2 ? '#3d3636' : color;
      const droop = (stripe * 13 + stallIndex * 5) % 3 === 0 ? 14 + Math.sin(time * 1.5 + stripe) * 3 : 0;
      ctx.fillRect(stallX - 6 + stripe * 22, ground - 140, 22, 24 + droop);
    }
  });
  // the "AGUA MOJADA" stall, knocked over; the bottles on the floor; the fountain dry
  ctx.fillStyle = '#2d2a2e';
  ctx.fillRect(560, ground - 46, 80, 46);
  ctx.fillRect(594, ground - 110, 12, 64);
  ctx.strokeStyle = '#0a070b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(600, ground - 110);
  ctx.lineTo(592, ground - 80);
  ctx.lineTo(604, ground - 60);
  ctx.stroke();
  ctx.save();
  ctx.translate(540, ground);
  ctx.rotate(0.14);
  ctx.fillStyle = '#4a0d0d';
  ctx.fillRect(0, -60, 120, 60);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '900 14px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AGUA MOJADA', 60, -36);
  ctx.textAlign = 'left';
  ctx.restore();
  for (let bottle = 0; bottle < 4; bottle += 1) {
    ctx.save();
    ctx.translate(500 + bottle * 46, ground - 6);
    ctx.rotate(Math.PI / 2 + bottle * 0.4);
    ctx.fillStyle = 'rgba(100, 140, 160, 0.5)';
    ctx.fillRect(-6, -11, 12, 22);
    ctx.restore();
  }
  // the wet street, reflecting the red moon
  ctx.fillStyle = '#0d0a0e';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#1a1418';
  ctx.fillRect(0, ground, width, 5);
  ctx.fillStyle = 'rgba(160, 20, 30, 0.22)';
  [[300, 40], [690, 60], [880, 30]].forEach(([puddleX, puddleW]) => {
    ctx.beginPath();
    ctx.ellipse(puddleX, ground + 22, puddleW, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // one lamp flickers; the other one is broken
  const lampOn = Math.sin(time * 13) > -0.3 && Math.sin(time * 2.1) > -0.7;
  ctx.fillStyle = '#111';
  ctx.fillRect(247, ground - 160, 6, 160);
  if (lampOn) {
    ctx.fillStyle = 'rgba(255, 200, 150, 0.16)';
    ctx.beginPath();
    ctx.moveTo(250, ground - 160);
    ctx.lineTo(170, ground);
    ctx.lineTo(330, ground);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd9a0';
    ctx.fillRect(242, ground - 166, 16, 8);
  }
  ctx.save();
  ctx.translate(700, ground);
  ctx.rotate(0.35);
  ctx.fillStyle = '#111';
  ctx.fillRect(-3, -150, 6, 150);
  ctx.restore();
  // eyes under the counters
  [[140, ground - 30], [840, ground - 30], [470, ground - 26]].forEach(([eyeX, eyeY], index) => {
    if (Math.sin(time * 0.7 + index * 2.4) > 0.3) drawFriendEyePair(eyeX, eyeY, 4, 0.85, false, index * 3);
  });
  drawOriginsFog(time, 0.8);
}

// level 7: the rooftops under a moon that smiles
function drawOriginsRooftopsDarkStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#000000');
  sky.addColorStop(0.7, '#1c0205');
  sky.addColorStop(1, '#3b0508');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  for (let star = 0; star < 24; star += 1) {
    ctx.fillStyle = `rgba(255, 220, 220, ${0.15 + Math.sin(time + star) * 0.1})`;
    ctx.fillRect((star * 173) % width, (star * 61) % 200, 2, 2);
  }
  // the moon... is looking at you
  const glow = ctx.createRadialGradient(760, 150, 60, 760, 150, 220);
  glow.addColorStop(0, 'rgba(255, 200, 200, 0.15)');
  glow.addColorStop(1, 'rgba(255, 200, 200, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(520, 0, 480, 380);
  ctx.fillStyle = '#d8cfc0';
  ctx.beginPath();
  ctx.arc(760, 150, 88, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(120, 110, 100, 0.35)';
  [[720, 120, 14], [800, 190, 10], [790, 110, 7]].forEach(([craterX, craterY, radius]) => {
    ctx.beginPath();
    ctx.arc(craterX, craterY, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  const stare = 0.35 + Math.max(0, Math.sin(time * 0.4)) * 0.45;
  drawFriendEyePair(760, 128, 9, stare, false, 9);
  ctx.save();
  ctx.globalAlpha = stare;
  ctx.fillStyle = '#1a0a0a';
  ctx.beginPath();
  ctx.moveTo(712, 165);
  ctx.quadraticCurveTo(760, 215, 808, 165);
  ctx.quadraticCurveTo(760, 185, 712, 165);
  ctx.fill();
  ctx.restore();
  // the skyline, and the friends standing on the far roofs
  for (let building = 0; building < 14; building += 1) {
    const bx = building * 76;
    const top = ground - 230 - ((building * 37) % 120);
    ctx.fillStyle = '#050307';
    ctx.fillRect(bx, top, 70, ground - top);
    for (let window = 0; window < 10; window += 1) {
      if ((window + building) % 5 !== 0) continue;
      ctx.fillStyle = 'rgba(150, 20, 30, 0.45)';
      ctx.fillRect(bx + 8 + (window % 3) * 20, top + 14 + Math.floor(window / 3) * 30, 10, 14);
    }
    if (building % 4 === 2) drawFriendSilhouette(bx + 35, top, 1 + (building % 3) * 0.2, building);
  }
  // the roof: chimneys, a water tank with a smile on it, a red light that never stops blinking
  ctx.fillStyle = '#140c0c';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#231313';
  ctx.fillRect(0, ground, width, 8);
  [[80, 70], [940, 90]].forEach(([chimneyX, chimneyH]) => {
    ctx.fillStyle = '#1d1111';
    ctx.fillRect(chimneyX, ground - chimneyH, 30, chimneyH);
    ctx.fillStyle = '#120909';
    ctx.fillRect(chimneyX - 4, ground - chimneyH - 8, 38, 8);
  });
  if (Math.sin(time * 0.9) > 0.2) drawFriendEyePair(95, ground - 82, 3, 0.9, false, 4);
  ctx.fillStyle = '#251616';
  ctx.fillRect(820, ground - 150, 80, 90);
  ctx.fillStyle = '#180e0e';
  ctx.fillRect(826, ground - 60, 8, 60);
  ctx.fillRect(886, ground - 60, 8, 60);
  drawFriendGrin(860, ground - 110, 28, 0.35);
  ctx.strokeStyle = '#3a3030';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, ground);
  ctx.lineTo(176, ground - 120);
  ctx.moveTo(160, ground - 96);
  ctx.lineTo(192, ground - 104);
  ctx.stroke();
  ctx.fillStyle = Math.sin(time * 4) > 0 ? '#ff1744' : '#4a0000';
  ctx.fillRect(173, ground - 126, 6, 6);
  drawOriginsFog(time, 0.7);
}

// level 8: the same alley... but rotten: black ooze dripping down, laughter written on the walls
function drawOriginsAlleyDecay() {
  const time = performance.now() / 1000;
  ctx.fillStyle = 'rgba(25, 0, 8, 0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#050208';
  for (let drip = 0; drip < 20; drip += 1) {
    const dripX = drip * 54 + ((drip * 17) % 20);
    const dripWidth = 8 + (drip % 3) * 4;
    const length = 30 + ((drip * 29) % 70) + Math.sin(time * 0.8 + drip) * 10;
    ctx.fillRect(dripX, 0, dripWidth, length);
    ctx.beginPath();
    ctx.arc(dripX + dripWidth / 2, length, dripWidth / 2 + 1, 0, Math.PI * 2);
    ctx.fill();
    // a drop falling now and then
    const fall = (time * 120 + drip * 90) % 600;
    if (drip % 4 === 0 && fall < ground - length) {
      ctx.fillRect(dripX + dripWidth / 2 - 2, length + fall, 4, 8);
    }
  }
  ctx.save();
  ctx.font = '900 22px Courier New, monospace';
  ctx.translate(90, 340);
  ctx.rotate(-0.1);
  ctx.fillStyle = 'rgba(255, 79, 163, 0.32)';
  ctx.fillText('JE JE JE JE', 0, 0);
  ctx.restore();
  ctx.save();
  ctx.font = '900 18px Courier New, monospace';
  ctx.translate(720, 390);
  ctx.rotate(0.08);
  ctx.fillStyle = 'rgba(255, 214, 10, 0.28)';
  ctx.fillText('JE JE JE', 0, 0);
  ctx.restore();
  ctx.font = '900 13px Courier New, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillText('AMIGOS PARA SIEMPRE', 420, 250);
  drawFriendGrin(520, 210, 60, 0.12);
  // the lamp is dying
  if (Math.sin(time * 17) > 0.6 || Math.sin(time * 1.3) < -0.8) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawOriginsFog(time, 0.8);
}

// ---------------- the big friend ----------------
const bigFriendDamageTaken = 0.65;
const bigFriendBoxRatio = 0.2;

// (applyDamage asks this after every hit)
function originsDamageFloor(target) {
  if (target.secretVariant === 'bigFriend' && isOriginsArcade() && !target.friendBoxDone) {
    target.health = Math.max(target.health, Math.ceil(target.maxHealth * bigFriendBoxRatio));
  }
}

// after the BOX ATTACK the big one is weak: one last push
function friendBoxEnd() {
  const big = player2;
  if (big.secretVariant !== 'bigFriend') return;
  big.friendBoxDone = true;
  big.health = Math.ceil(big.maxHealth * 0.1);
  big.friendWeak = true;
  updateHealthBars();
  playFriendLaugh('deep');
}

dodgeRoundThemes.friendBox = {
  title: 'BOX ATTACK?',
  border: ['#ff4fa3', '#ffd60a'],
  phaseFrames: 480,
  onEnd: 'friendBoxEnd',
  talk: [
    { speaker: 'friend', text: '...' },
    { speaker: 'scammer', text: 'Q-que es esto?! Donde estoy?! Por que soy... CHIQUITO?!' },
    { speaker: 'friend', text: 'je.' },
    { speaker: 'friend', text: 'JE JE JE JE JE JE JE JE' },
  ],
  phases: [
    { pattern: 'friendClaws', caption: '? ? ?: GARRAS' },
    { pattern: 'friendTail', caption: '? ? ?: LA COLA' },
    { pattern: 'friendStare', caption: '? ? ?: TE ESTAMOS MIRANDO' },
    { pattern: 'friendDark', caption: '? ? ?: ENERGIA OSCURA' },
    { pattern: 'friendFinal', caption: '? ? ?: JE JE JE JE JE JE' },
  ],
};

function spawnFriendBoxPattern(pattern, t, push, box, soul) {
  if (!pattern.startsWith('friend')) return false;
  if (t === 1) playFriendLaugh(pattern === 'friendFinal' ? 'deep' : 'many');
  const colors = ['#ff4fa3', '#ffd60a'];
  const eyeShot = (x, y, speed = 5) => {
    const angle = Math.atan2(soul.y - y, soul.x - x);
    push({ type: 'aimed', sprite: 'friendEye', color: colors[Math.floor(Math.random() * 2)], x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 10 });
  };
  const edgePoint = () => {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) return [box.x + Math.random() * box.width, box.y + 6];
    if (side === 1) return [box.x + box.width - 6, box.y + Math.random() * box.height];
    if (side === 2) return [box.x + 6, box.y + Math.random() * box.height];
    return [box.x + Math.random() * box.width, box.y + box.height - 6];
  };
  const claw = (orient, pos, extra = {}) => push({ type: 'beam', sprite: 'friendClaw', orient, pos: orient === 'v' ? Math.max(box.x + 24, Math.min(box.x + box.width - 24, pos)) : Math.max(box.y + 24, Math.min(box.y + box.height - 24, pos)), size: 40, warn: 30, active: 14, life: 80, ...extra });
  if (pattern === 'friendClaws') {
    // cat claws: one slash where you are... and a rake of three
    if (t % 44 === 0) claw(Math.floor(t / 44) % 2 ? 'h' : 'v', Math.floor(t / 44) % 2 ? soul.y : soul.x);
    if (t % 132 === 88) [-70, 0, 70].forEach((offset) => claw('v', soul.x + offset, { size: 30, warn: 36 }));
    return true;
  }
  if (pattern === 'friendTail') {
    // the tail sweeps a lane... and stabs at you with its point
    if (t % 52 === 0) {
      const laneHeight = 46;
      const laneY = Math.max(box.y + 10, Math.min(box.y + box.height - 10 - laneHeight, soul.y - laneHeight / 2 + (Math.random() - 0.5) * 60));
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'friendTail', y: laneY, h: laneHeight, warn: 34, dir: -side, x: side < 0 ? box.x - 40 : box.x + box.width + 40, speed: 14 });
    }
    if (t % 70 === 35) {
      const [startX, startY] = edgePoint();
      const angle = Math.atan2(soul.y - startY, soul.x - startX);
      push({ type: 'aimed', sprite: 'friendTailTip', x: startX, y: startY, vx: Math.cos(angle) * 7.5, vy: Math.sin(angle) * 7.5, r: 10 });
    }
    return true;
  }
  if (pattern === 'friendDark') {
    // bursts of dark energy
    if (t % 46 === 0) {
      const originX = box.x + 40 + Math.random() * (box.width - 80);
      const originY = box.y + 30 + Math.random() * 40;
      for (let shot = 0; shot < 8; shot += 1) {
        const angle = (shot / 8) * Math.PI * 2 + t * 0.05;
        push({ type: 'aimed', sprite: 'friendDark', x: originX, y: originY, vx: Math.cos(angle) * 3.4, vy: Math.sin(angle) * 3.4, r: 9 });
      }
    }
    if (t % 120 === 80) push({ type: 'ring', sprite: 'friendRing', x: box.x + box.width / 2, y: box.y + box.height / 2, radius: 8, speed: 2.6, gap: Math.random() * Math.PI * 2, gapSize: 1.1, life: 400 });
    return true;
  }
  if (pattern === 'friendStare') {
    if (t % 18 === 0) eyeShot(...edgePoint(), 4.6);
    if (t % 40 === 20) push({ type: 'drop', sprite: 'friendEye', color: colors[t % 2], x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 14, vy: 4.4, r: 10, warn: 16 });
  } else if (pattern === 'friendHands') {
    if (t % 26 === 0) {
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'side', sprite: 'friendHand', x: side < 0 ? box.x - 30 : box.x + box.width + 30, y: box.y + 20 + Math.random() * (box.height - 40), vx: -side * 6, vy: 0, r: 13 });
    }
    if (t % 70 === 35) {
      const laneHeight = 46;
      const laneY = box.y + 10 + Math.floor(Math.random() * ((box.height - 20 - laneHeight) / laneHeight + 1)) * laneHeight;
      const side = Math.random() < 0.5 ? -1 : 1;
      push({ type: 'lane', sprite: 'friendHand', y: laneY, h: laneHeight, warn: 40, dir: -side, x: side < 0 ? box.x - 60 : box.x + box.width + 60, speed: 12 });
    }
  } else if (pattern === 'friendSmiles') {
    if (t % 85 === 0) {
      const gapWidth = 80;
      const gapX = box.x + 20 + Math.random() * (box.width - 40 - gapWidth);
      push({ type: 'wall', sprite: 'friendGrin', gapX, gapWidth, y: box.y - 40, vy: 3, h: 34, warn: 40 });
    }
    if (t % 34 === 17) eyeShot(...edgePoint(), 4.2);
  } else if (pattern === 'friendFinal') {
    if (t % 95 === 0) push({ type: 'ring', sprite: 'friendRing', x: box.x + box.width / 2, y: box.y + box.height / 2, radius: 8, speed: 2.6, gap: Math.random() * Math.PI * 2, gapSize: 1.1, life: 400 });
    if (t % 70 === 45) claw(Math.random() < 0.5 ? 'v' : 'h', Math.random() < 0.5 ? soul.x : soul.y);
    if (t % 22 === 11) push({ type: 'drop', sprite: 'friendEye', color: colors[t % 2], x: box.x + 16 + Math.random() * (box.width - 32), y: box.y - 14, vy: 5, r: 9, warn: 14 });
    if (t % 60 === 30) {
      const [startX, startY] = edgePoint();
      [-0.25, 0, 0.25].forEach((spread) => {
        const angle = Math.atan2(soul.y - startY, soul.x - startX) + spread;
        push({ type: 'aimed', sprite: 'friendEye', color: colors[Math.floor(Math.random() * 2)], x: startX, y: startY, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, r: 9 });
      });
    }
  } else {
    return false;
  }
  return true;
}

function drawFriendBoxItem(item, box) {
  if (!item.sprite || !item.sprite.startsWith('friend')) return false;
  if (item.sprite === 'friendClaw') {
    // three claw slashes along the column (or row)
    const fade = Math.min(1, item.active / 6);
    ctx.strokeStyle = `rgba(255, 255, 255, ${fade})`;
    ctx.shadowColor = '#ff4fa3';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 4;
    [-item.size / 3, 0, item.size / 3].forEach((offset) => {
      ctx.beginPath();
      if (item.orient === 'v') {
        ctx.moveTo(item.pos + offset - 6, box.y);
        ctx.lineTo(item.pos + offset + 6, box.y + box.height);
      } else {
        ctx.moveTo(box.x, item.pos + offset - 6);
        ctx.lineTo(box.x + box.width, item.pos + offset + 6);
      }
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    return true;
  }
  if (item.sprite === 'friendTail') {
    // the tail crossing the lane, point first
    const back = -item.dir;
    const midY = item.y + item.h / 2;
    ctx.fillStyle = '#050505';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(item.x + item.dir * 26, midY);
    ctx.lineTo(item.x, midY - 12);
    for (let segment = 1; segment <= 10; segment += 1) ctx.lineTo(item.x + back * segment * 50, midY - 8 + Math.sin(segment + dodgeRound.frame / 4) * 6);
    for (let segment = 10; segment >= 1; segment -= 1) ctx.lineTo(item.x + back * segment * 50, midY + 8 + Math.sin(segment + dodgeRound.frame / 4) * 6);
    ctx.lineTo(item.x, midY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return true;
  }
  if (item.sprite === 'friendTailTip') {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.atan2(item.vy, item.vx));
    ctx.fillStyle = '#050505';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-10, -9);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return true;
  }
  if (item.sprite === 'friendDark') {
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#1a0026';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  if (item.sprite === 'friendRing') {
    ctx.strokeStyle = '#1a0026';
    ctx.shadowColor = '#ff4fa3';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, item.gap + item.gapSize / 2, item.gap - item.gapSize / 2 + Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff4fa3';
    ctx.lineWidth = 2;
    ctx.stroke();
    return true;
  }
  if (item.sprite === 'friendEye') {
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, item.r * 0.25, item.r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }
  if (item.sprite === 'friendHand') {
    ctx.fillStyle = '#050505';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    if (item.type === 'lane') {
      // a huge arm sweeping the whole lane
      const reach = item.dir > 0 ? -400 : 400;
      ctx.fillRect(Math.min(item.x, item.x + reach), item.y + 8, Math.abs(reach), item.h - 16);
      ctx.strokeRect(Math.min(item.x, item.x + reach), item.y + 8, Math.abs(reach), item.h - 16);
      for (let claw = 0; claw < 3; claw += 1) {
        ctx.beginPath();
        ctx.moveTo(item.x, item.y + 10 + claw * 12);
        ctx.lineTo(item.x + item.dir * 22, item.y + 14 + claw * 12);
        ctx.lineTo(item.x, item.y + 18 + claw * 12);
        ctx.fill();
        ctx.stroke();
      }
      return true;
    }
    const back = item.vx > 0 ? -1 : 1;
    ctx.fillRect(Math.min(item.x, item.x + back * 70), item.y - 7, 70, 14);
    ctx.strokeRect(Math.min(item.x, item.x + back * 70), item.y - 7, 70, 14);
    for (let finger = -1; finger <= 1; finger += 1) {
      ctx.beginPath();
      ctx.moveTo(item.x, item.y + finger * 6 - 3);
      ctx.lineTo(item.x - back * 16, item.y + finger * 7);
      ctx.lineTo(item.x, item.y + finger * 6 + 3);
      ctx.fill();
      ctx.stroke();
    }
    return true;
  }
  if (item.sprite === 'friendGrin') {
    // a falling row of teeth with a gap
    const segments = [[box.x, item.gapX], [item.gapX + item.gapWidth, box.x + box.width]];
    segments.forEach(([from, to]) => {
      if (to <= from) return;
      ctx.fillStyle = '#050505';
      ctx.fillRect(from, item.y, to - from, item.h);
      ctx.fillStyle = '#ffffff';
      for (let toothX = from; toothX < to - 8; toothX += 12) {
        ctx.beginPath();
        ctx.moveTo(toothX, item.y + item.h - 14);
        ctx.lineTo(toothX + 6, item.y + item.h + 4);
        ctx.lineTo(toothX + 12, item.y + item.h - 14);
        ctx.fill();
      }
    });
    return true;
  }
  return false;
}

// the big friend (like the reference): a cat head with pointed ears, a yellow eye and a pink eye, blocky teeth,
// and a huge black body that pours down to the floor in four drooping legs and two hanging arms; white edges, and a long pointed tail
function drawBigFriend(fighter) {
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const h = fighter.height;
  const time = performance.now() / 1000;
  const dir = fighter.attacksToTheRight ? 1 : -1;
  const moving = Math.abs(fighter.velocity ? fighter.velocity.x : 0) > 0.3;
  const P = (u, v) => [x + u * w, y + v * h];
  ctx.save();
  let alpha = fighter.friendFade ?? 1;
  if (fighter.friendWeak) alpha *= 0.6 + Math.abs(Math.sin(time * 9)) * 0.4;
  ctx.globalAlpha = alpha;
  const aura = ctx.createRadialGradient(x + w / 2, y + h * 0.5, 10, x + w / 2, y + h * 0.5, h);
  aura.addColorStop(0, 'rgba(120, 0, 30, 0.3)');
  aura.addColorStop(1, 'rgba(120, 0, 30, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(x - h * 0.7, y - h * 0.5, w + h * 1.4, h * 1.6);
  // the tail, behind the body: long, flexible, with a sharp point
  const baseX = dir > 0 ? x + w * 0.2 : x + w * 0.8;
  const baseY = y + h * 0.62;
  const tip = fighter.tailTip || { x: baseX - dir * 90 + Math.sin(time * 2) * 14, y: y - 24 + Math.cos(time * 1.6) * 10 };
  const controlX = (baseX + tip.x) / 2 - dir * 40;
  const controlY = Math.min(baseY, tip.y) - 90;
  [['#ffffff', 12], ['#050505', 7]].forEach(([color, lineWidth]) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(controlX, controlY, tip.x, tip.y);
    ctx.stroke();
  });
  ctx.lineCap = 'butt';
  const tipAngle = Math.atan2(tip.y - controlY, tip.x - controlX);
  ctx.save();
  ctx.translate(tip.x, tip.y);
  ctx.rotate(tipAngle);
  ctx.fillStyle = '#050505';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(-6, -9);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-6, 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  // the body
  const sway = Math.sin(time * 2.2) * 0.02;
  const step = (index) => (moving ? Math.sin(time * 8 + index * 1.7) * 0.03 : Math.sin(time * 1.4 + index) * 0.008);
  const points = [
    P(0.3, 0.4), P(0.28, 0.16), P(0.27, -0.05), P(0.4, 0.1), P(0.6, 0.1), P(0.73, -0.05), P(0.72, 0.16), P(0.7, 0.38),
  ];
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  points.slice(1).forEach((point) => ctx.lineTo(...point));
  // the right side pours down into a hanging arm
  ctx.quadraticCurveTo(...P(0.88, 0.42), ...P(0.97, 0.64));
  ctx.lineTo(...P(1.07 + sway, 0.84));
  ctx.lineTo(...P(1.02 + sway, 0.93));
  ctx.lineTo(...P(0.95, 0.82));
  // four drooping legs, with jagged notches between them
  const legs = [[0.92, 0.79], [0.66, 0.54], [0.44, 0.32], [0.21, 0.08]];
  legs.forEach(([outer, inner], index) => {
    const wobble = step(index);
    ctx.lineTo(...P(outer, 0.82));
    ctx.lineTo(...P(outer - 0.01 + wobble, 1));
    ctx.quadraticCurveTo(...P((outer + inner) / 2 + wobble, 1.04), ...P(inner + 0.01 + wobble, 1));
    ctx.lineTo(...P(inner, 0.82));
    if (index < legs.length - 1) {
      const nextOuter = legs[index + 1][0];
      ctx.lineTo(...P(inner - 0.03, 0.75));
      ctx.lineTo(...P((inner + nextOuter) / 2, 0.81));
      ctx.lineTo(...P(nextOuter + 0.03, 0.75));
    }
  });
  // the left arm, and back up to the head
  ctx.lineTo(...P(0.05, 0.8));
  ctx.lineTo(...P(-0.07 - sway, 0.9));
  ctx.lineTo(...P(-0.06 - sway, 0.8));
  ctx.lineTo(...P(0.03, 0.64));
  ctx.quadraticCurveTo(...P(0.12, 0.42), ...points[0]);
  ctx.closePath();
  ctx.fillStyle = '#050505';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // the eyes: yellow and pink, small and square
  const eyeSize = w * 0.075;
  [['#ffd60a', 0.42], ['#ff8fc8', 0.57]].forEach(([color, u]) => {
    const [eyeX, eyeY] = P(u, 0.23);
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillRect(eyeX - eyeSize / 2, eyeY - eyeSize / 2, eyeSize, eyeSize);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#050505';
    ctx.fillRect(eyeX - eyeSize * 0.15 + dir * 1.5, eyeY - eyeSize * 0.3, eyeSize * 0.3, eyeSize * 0.6);
  });
  // the teeth: big white blocks, crooked, too many for that mouth
  const open = fighter.friendGrin > 0 ? 1 : 0;
  const teeth = [[0.42, 0.055, 0.07], [0.48, 0.05, 0.09], [0.54, 0.055, 0.075], [0.6, 0.05, 0.095], [0.655, 0.04, 0.06]];
  ctx.fillStyle = '#ffffff';
  teeth.forEach(([u, toothW, toothH], index) => {
    const [toothX, toothY] = P(u, 0.29 + (index % 2) * 0.008);
    ctx.fillRect(toothX, toothY, w * toothW - 2, h * (toothH + open * 0.03));
  });
  teeth.slice(1, 4).forEach(([u, toothW], index) => {
    const [toothX, toothY] = P(u + 0.01, 0.37 + open * 0.03);
    ctx.fillRect(toothX, toothY + (index % 2) * 3, w * toothW * 0.8, h * 0.035);
  });
  if (fighter.isAttacking) {
    // cat claws
    const area = fighter.attackArea;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    for (let claw = 0; claw < 4; claw += 1) {
      ctx.beginPath();
      ctx.moveTo(area.x + 6, area.y + claw * 9);
      ctx.lineTo(area.x + area.width - 6, area.y + claw * 9 + 14);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------- the ones the friends found first ----------------
// customers and police lying on the floor, "asleep"... with things dropped around them (never in the alley)
const originsSleepers = {
  market: [
    { item: 'ketchup', x: 470 },
    { kind: 'angryCustomer', x: 390, flip: false },
    { kind: 'angryCustomer', x: 860, flip: true },
    { item: 'bottle', x: 520 },
    { item: 'bottle', x: 990 },
  ],
  roofs: [
    { item: 'ketchup', x: 300 },
    { kind: 'policeOfficer', x: 360, flip: false },
    { kind: 'policeOfficer', x: 760, flip: true },
    { item: 'cap', x: 520 },
    { item: 'baton', x: 640 },
  ],
  station: [
    { item: 'ketchup', x: 520 },
    { kind: 'policeSergeant', x: 300, flip: false },
    { kind: 'policeChief', x: 640, flip: true },
    { kind: 'policeOfficer', x: 840, flip: false },
    { item: 'whiteCap', x: 590 },
    { item: 'whistle', x: 440 },
  ],
};

function drawSleepingFigure(kind, x, flip, seed) {
  const [width, height] = originsSizes[kind];
  const time = performance.now() / 1000;
  const sleeper = { position: { x: 0, y: 0 }, width, height, attacksToTheRight: true, isAttacking: false, secretVariant: kind, policeBatonTimer: 0, velocity: { x: 0, y: 0 } };
  ctx.save();
  // lying on the floor: the head on one side, the feet on the other
  ctx.translate(flip ? x + height : x, ground);
  ctx.scale(flip ? -1 : 1, 1);
  ctx.rotate(-Math.PI / 2);
  ctx.globalAlpha = 0.9;
  if (kind === 'angryCustomer') drawAngryCustomer(sleeper);
  else drawPolice(sleeper);
  ctx.restore();
  // a shadow under them, darker than it should be
  ctx.fillStyle = 'rgba(10, 0, 20, 0.55)';
  ctx.beginPath();
  ctx.ellipse(x + height / 2, ground + 3, height * 0.6, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  drawKetchupMess(x, height, width, flip, seed);
  // ...z z z (they are asleep. Only asleep.)
  const headX = flip ? x + height - 10 : x + 10;
  ctx.font = '900 13px Courier New, monospace';
  ctx.textAlign = 'center';
  for (let letter = 0; letter < 3; letter += 1) {
    const rise = ((time * 12 + letter * 14 + seed * 7) % 42);
    ctx.fillStyle = `rgba(200, 200, 230, ${0.5 - rise / 90})`;
    ctx.fillText('z', headX + letter * 6 + Math.sin(time * 2 + letter) * 3, ground - width - 6 - rise);
  }
  ctx.textAlign = 'left';
}

function drawSleeperItem(item, x) {
  ctx.save();
  ctx.translate(x, ground - 4);
  if (item === 'bottle') {
    ctx.rotate(Math.PI / 2 + 0.3);
    ctx.fillStyle = 'rgba(129, 212, 250, 0.7)';
    ctx.fillRect(-6, -11, 12, 22);
    ctx.fillStyle = '#e53935';
    ctx.fillRect(-3, -15, 6, 4);
  } else if (item === 'cap' || item === 'whiteCap') {
    ctx.rotate(0.25);
    ctx.fillStyle = item === 'whiteCap' ? '#eceff1' : '#0d1442';
    ctx.fillRect(-16, -10, 32, 10);
    ctx.fillStyle = '#111';
    ctx.fillRect(-20, -2, 22, 3);
    ctx.fillStyle = '#ffca28';
    ctx.fillRect(-4, -8, 8, 6);
  } else if (item === 'baton') {
    ctx.rotate(0.12);
    ctx.fillStyle = '#263238';
    ctx.fillRect(-18, -4, 36, 6);
  } else if (item === 'ketchup') {
    // the bottle of "tomato sauce"... empty
    ctx.rotate(Math.PI / 2 - 0.2);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(-7, -14, 14, 26);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(-7, -4, 14, 7);
    ctx.fillStyle = '#c62828';
    ctx.font = '900 5px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TOMATE', 0, 2);
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(-3, -20, 6, 6);
  } else if (item === 'whistle') {
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(-7, -6, 12, 6);
    ctx.beginPath();
    ctx.arc(6, -3, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawOriginsSleepers(place) {
  const list = originsSleepers[place];
  if (!list) return;
  list.forEach((entry, index) => {
    if (entry.item) drawSleeperItem(entry.item, entry.x);
    else drawSleepingFigure(entry.kind, entry.x, entry.flip, index);
  });
}

// "tomato sauce": a lot of it. On them, under them, splashed around. (Just tomato sauce.)
function drawKetchupMess(x, length, thickness, flip, seed) {
  const time = performance.now() / 1000;
  const red = '#a50f15';
  const shine = 'rgba(255, 120, 120, 0.35)';
  // the puddle on the floor, irregular, slowly spreading
  const spread = 1 + Math.min(0.25, (time % 60) * 0.004);
  ctx.fillStyle = red;
  ctx.beginPath();
  ctx.ellipse(x + length * 0.5, ground + 4, length * 0.7 * spread, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  [[0.15, 22, 7], [0.8, 26, 6], [1.05, 14, 5], [-0.1, 12, 4]].forEach(([along, radiusX, radiusY]) => {
    ctx.beginPath();
    ctx.ellipse(x + length * along, ground + 5, radiusX * spread, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.ellipse(x + length * 0.35, ground + 2, 18, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // splashes on the body, dripping down the sides
  ctx.fillStyle = red;
  [[0.25, 0.4, 9], [0.55, 0.7, 7], [0.75, 0.3, 6], [0.4, 0.9, 5]].forEach(([along, across, radius], index) => {
    const splatX = flip ? x + length * (1 - along) : x + length * along;
    const splatY = ground - thickness * across;
    ctx.beginPath();
    ctx.arc(splatX, splatY, radius, 0, Math.PI * 2);
    ctx.arc(splatX + radius * 0.9, splatY - radius * 0.5, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    const drip = 4 + ((time * 3 + index * 5 + seed * 3) % 10);
    ctx.fillRect(splatX - 1.5, splatY, 3, drip);
  });
  // drops splashed on the floor around
  for (let drop = 0; drop < 7; drop += 1) {
    const dropX = x - 20 + ((drop * 47 + seed * 31) % (length + 60));
    ctx.beginPath();
    ctx.arc(dropX, ground + 12 + (drop % 3) * 4, 2 + (drop % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

// ================= THE SECRET LEVEL: the jester and his pet =================
// (unlocked by beating the chapter in HARDCORE or HARDERCORE)
const originsSecretLevel = 9;
const originsSecretBeatenKey = 'moqueteOriginsSecretBeaten';
const originsSecretJesterHealth = 230;
reflecterBattleTrackSources.jesterRevolving = jesterBattleTrackSource;
reflecterBattleTrackVolumes.jesterRevolving = 0.5;

function isOriginsSecretUnlocked() {
  const records = typeof loadHardcoreRecords === 'function' ? loadHardcoreRecords().origins || {} : {};
  return Boolean(records.normal || records.harder);
}

function isOriginsSecretBeaten() {
  try {
    return localStorage.getItem(originsSecretBeatenKey) === '1';
  } catch (error) {
    return false;
  }
}

function markOriginsSecretBeaten() {
  try {
    localStorage.setItem(originsSecretBeatenKey, '1');
  } catch (error) {
    // only this session
  }
}

function configureOriginsSecretLevel() {
  selectedMap = 'originsCastle';
  botEnabled = true;
  normalArcadeEnemiesRemaining = 0;
  normalArcadeEnemyIndex = 1;
  originsOutroPlayed = false;
  configureOriginsSecretEnemy();
}

// SHADOW JESTER, tired from opening his first portal: no secret tricks, no final act
function configureOriginsSecretEnemy() {
  player2.setCharacterType('gambler', 'shadowJester');
  botDifficulty = 'hard';
  applyBotDifficulty();
  player2.setMaxHealth(originsSecretJesterHealth);
  player2.health = player2.maxHealth;
  player2.damageMultiplier = 0.65;
  player2.jesterFinalActUsed = true;
  player2.jesterWeakened = true;
  updateHealthBars();
  updateCombatHudIdentity();
}

const originsSecretIntroLines = [
  { speaker: 'scammer', text: 'Dia 47 viviendo en el contenedor. O 48. Perdi la cuenta cuando empece a contar las risas.', wander: true },
  { speaker: 'scammer', text: 'Estos lentes... me los tengo que dejar TODA la vida? Si me los saco, los veo. Si me los dejo... ellos me ven a mi.', wander: true },
  { speaker: 'scammer', text: 'Plan A: venderles agua mojada. Fallo. Plan B: hacerme su amigo. ...Funciono DEMASIADO bien.' },
  { speaker: 'scammer', text: 'Plan C: una trampa! Una caja, un palito, y de carnada... un espejo. Les encanta verse sonreir. JE JE. ...Je. Por que me rio asi?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'scammer', text: 'Plan D: mudarme a otra ciudad. Plan E: mudarme a otro PLANETA. Plan F: hablar con las paredes. ...Ya estoy en el Plan F, verdad?' },
  { speaker: 'scammer', text: '...Eh? Que es ese ruido? Por que el aire se esta... rompiendo?', crack: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'jester', text: 'FUNCIONO! FUNCIONO! MI PRIMER PORTAL AL MUNDO DE LA LUZ! JA JA JA!', shatter: true, jesterIn: true, emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'scammer', text: '...Que.', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'jester', text: 'Ah! Un habitante del mundo de la luz! Escuchame rapido: se me escapo mi mascota, el rey me dio permiso para buscarla, abri un portal y aca estamos! Fin de la explicacion!' },
  { speaker: 'scammer', text: '...No entendi NADA. Que rey? Que mascota? Que portal? Quien sos? Y por que tenes ese sombrero?' },
  { speaker: 'jester', text: 'Mi mascota! Grande, negra, cuatro patitas, una sonrisa adorable. No responde a ningun nombre... pero viene si le silbo.', whistle: true },
  { speaker: 'friend', text: '...je.', laugh: 'deep', bigIn: true },
  { speaker: 'jester', text: 'AHI ESTAS! Mi bebe! Te extrañe tanto! Quien es un buen monstruito? VOS sos un buen monstruito!', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'scammer', text: '...ESO es tu mascota?! ESE "BEBE" ME HIZO ESTO EN LA CARA!', emote: { who: 'gambler', symbol: '#!' } },
  { speaker: 'scammer', text: 'Me persiguio por toda la ciudad, me dejo sin negocio, me hizo vivir en un contenedor... ME ARRUINO LA VIDA!' },
  { speaker: 'jester', text: '...Perdon? Le estas GRITANDO a mi mascota?', mood: 'angry' },
  { speaker: 'scammer', text: 'SI! Y te grito a vos tambien! Controla a tu bicho, payaso!' },
  { speaker: 'jester', text: 'PAYASO?! ...Soy un BUFON. Y vos, habitante de la luz... te acabas de ganar una paliza.', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
];

const originsSecretOutroLines = [
  { speaker: 'jester', text: 'Uff... uff... Nada mal... para un vendedor de agua...', place: 'castle' },
  { speaker: 'scammer', text: 'JA! Y ahora que, bufon? Vas a llamar a tu mascotita?' },
  { speaker: 'jester', text: '...No. Voy a hacer algo mucho peor. Te voy a MOSTRAR.', mood: 'angry', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'jester', text: 'Mira bien, pequeño habitante de la luz. Mira TODO.', charge: true },
  { speaker: 'scammer', text: 'Q-que es esa luz? Por que brilla asi? ...Por que se esta ACERCANDO?!', charge: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'jester', text: 'DESTELLO DEL BUFON!', fire: true },
  { speaker: 'scammer', text: '...', vision: true },
  { speaker: 'scammer', text: '!!!', vision: true },
  { speaker: 'jester', text: 'Listo! Ahora por lo menos pareces mas inteligente. JA JA JA JA!', place: 'alley', jesterLaugh: true },
  { speaker: 'scammer', text: '...Normal... Fire Master... un robot espejo... un caballero... un MONO...', dizzy: true },
  { speaker: 'scammer', text: 'Un gato gigante... un bufon... yo? YO? Con lentes? Vendiendole cosas... a GAMBLER?', dizzy: true },
  { speaker: 'scammer', text: 'Je... je je... JA JA JA! Lo vi todo! TODO! ...No entendi absolutamente nada.', dizzy: true },
  { speaker: 'scammer', text: '...Quien es Moquete?', dizzy: true },
];

// ---------- the intro: planning (madly), the air cracking, the castle ----------
function startOriginsSecretIntro() {
  selectedMap = 'gamblerAlley';
  player1.originsFear = 0;
  player1.youngGlasses = true;
  player1.youngScar = true;
  player1.originsCrazy = true;
  const cracks = [];
  for (let branch = 0; branch < 14; branch += 1) {
    const points = [[512, 300]];
    let angle = (branch / 14) * Math.PI * 2 + Math.random() * 0.3;
    for (let step = 0; step < 8; step += 1) {
      const [lastX, lastY] = points[points.length - 1];
      angle += (Math.random() - 0.5) * 0.9;
      points.push([lastX + Math.cos(angle) * (40 + Math.random() * 40), lastY + Math.sin(angle) * (30 + Math.random() * 30)]);
    }
    cracks.push(points);
  }
  ch6CutsceneBase('originsIntro', originsSecretIntroLines, 'dialog', {
    gamblerX: 260,
    gamblerTargetX: 420,
    scammerX: 680,
    scammerTargetX: 680,
    scammerY: 0,
    secret: true,
    hideEnemy: true,
    bgEyes: 0,
    puffs: [],
    splashDrops: [],
    lastFlagLine: -1,
    crack: 0,
    cracks,
    shards: [],
    flash: 0,
    bigIn: 0,
  });
  startCutsceneLine(0);
}

function updateOriginsSecretIntro(cutscene) {
  const line = cutscene.lines[cutscene.lineIndex];
  const firstFrame = cutscene.lastFlagLine !== cutscene.lineIndex;
  cutscene.lastFlagLine = cutscene.lineIndex;
  if (line.wander) {
    // pacing around the alley, talking to himself
    if (Math.abs(cutscene.gamblerX - cutscene.gamblerTargetX) < 2) cutscene.gamblerTargetX = cutscene.gamblerTargetX > 300 ? 160 : 420;
  } else if (!cutscene.shattered) {
    cutscene.gamblerTargetX = 260;
  }
  if (line.crack) {
    cutscene.crack = Math.min(1, cutscene.crack + 0.02);
    if (firstFrame) playNoise({ duration: 0.8, volume: 0.05, filterFrequency: 4000 });
    if (cutscene.frame % 20 === 0) playNoise({ duration: 0.12, volume: 0.05, filterFrequency: 5000 });
  }
  if (line.shatter && firstFrame) {
    // everything breaks like glass... and behind it, a dark castle
    cutscene.shattered = true;
    cutscene.crack = 0;
    cutscene.flash = 1;
    selectedMap = 'originsCastle';
    cutscene.gamblerX = 240;
    cutscene.gamblerTargetX = 240;
    for (let shard = 0; shard < 46; shard += 1) {
      cutscene.shards.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.8, vx: (Math.random() - 0.5) * 6, vy: -2 - Math.random() * 4, spin: (Math.random() - 0.5) * 0.3, angle: Math.random() * 6, size: 14 + Math.random() * 30 });
    }
    playNoise({ duration: 1.2, volume: 0.12, filterFrequency: 3000 });
    playSound('jesterLaugh');
  }
  if (line.jesterIn && cutscene.hideEnemy) {
    cutscene.hideEnemy = false;
    cutscene.scammerX = 680;
    cutscene.scammerTargetX = 680;
  }
  if (line.whistle && firstFrame) {
    playTone({ frequency: 1800, duration: 0.25, type: 'sine', volume: 0.06, slideTo: 2400 });
    setTimeout(() => playTone({ frequency: 2400, duration: 0.35, type: 'sine', volume: 0.06, slideTo: 1600 }), 280);
  }
  if (line.bigIn) cutscene.bigIn = Math.max(cutscene.bigIn, 0.01);
  if (cutscene.bigIn > 0) cutscene.bigIn = Math.min(1, cutscene.bigIn + 0.03);
  if (cutscene.flash > 0) cutscene.flash = Math.max(0, cutscene.flash - 0.03);
  cutscene.shards.forEach((shard) => {
    shard.x += shard.vx;
    shard.y += shard.vy;
    shard.vy += 0.35;
    shard.angle += shard.spin;
  });
  cutscene.shards = cutscene.shards.filter((shard) => shard.y < canvas.height + 60);
}

function drawOriginsSecretIntroFx(cutscene) {
  const time = performance.now() / 1000;
  if (!cutscene.shattered) drawOriginsDread(0.6);
  // the pet arrives behind its owner
  if (cutscene.bigIn > 0) {
    const big = { position: { x: 830, y: ground - 176 }, width: 150, height: 176, attacksToTheRight: false, friendFade: cutscene.bigIn, friendGrin: 20, velocity: { x: 0 }, isAttacking: false, secretVariant: 'bigFriend' };
    drawBigFriend(big);
  }
  if (cutscene.crack > 0) {
    // the air cracks like glass
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + cutscene.crack * 0.5})`;
    ctx.shadowColor = '#ea80fc';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2 + cutscene.crack * 2;
    cutscene.cracks.forEach((points) => {
      const shown = Math.max(1, Math.floor(points.length * cutscene.crack));
      ctx.beginPath();
      ctx.moveTo(points[0][0] + Math.sin(time * 30) * cutscene.crack, points[0][1]);
      for (let point = 1; point < shown; point += 1) ctx.lineTo(points[point][0], points[point][1]);
      ctx.stroke();
    });
    ctx.restore();
  }
  cutscene.shards.forEach((shard) => {
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(shard.angle);
    ctx.fillStyle = 'rgba(40, 20, 60, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -shard.size / 2);
    ctx.lineTo(shard.size / 2, shard.size / 3);
    ctx.lineTo(-shard.size / 3, shard.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  if (cutscene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- the castle of the dark world: Shadow Jester's hall ----------
function drawOriginsCastleStage() {
  const time = performance.now() / 1000;
  const width = canvas.width;
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#05020a');
  wall.addColorStop(1, '#1c0f2b');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, canvas.height);
  // stone blocks
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  for (let row = 0; row < ground; row += 36) {
    for (let col = (row / 36) % 2 ? -40 : 0; col < width; col += 80) ctx.strokeRect(col, row, 80, 36);
  }
  // tall gothic windows with a cold purple moonlight
  [180, 470, 760].forEach((windowX, index) => {
    ctx.fillStyle = '#140a26';
    ctx.beginPath();
    ctx.moveTo(windowX, ground - 120);
    ctx.lineTo(windowX, 140);
    ctx.quadraticCurveTo(windowX + 45, 60, windowX + 90, 140);
    ctx.lineTo(windowX + 90, ground - 120);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(179, 136, 255, ${0.18 + Math.sin(time * 0.8 + index) * 0.05})`;
    ctx.fill();
    ctx.strokeStyle = '#0a0612';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(windowX + 45, 90);
    ctx.lineTo(windowX + 45, ground - 120);
    ctx.moveTo(windowX, 230);
    ctx.lineTo(windowX + 90, 230);
    ctx.stroke();
    // the light falling on the floor
    ctx.fillStyle = 'rgba(179, 136, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(windowX, ground - 120);
    ctx.lineTo(windowX + 90, ground - 120);
    ctx.lineTo(windowX + 150, ground);
    ctx.lineTo(windowX + 30, ground);
    ctx.closePath();
    ctx.fill();
  });
  // pillars with torches of purple fire, and banners with the suits
  [90, 380, 660, 950].forEach((pillarX, index) => {
    ctx.fillStyle = '#100818';
    ctx.fillRect(pillarX - 22, 40, 44, ground - 40);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(pillarX - 18, 40, 8, ground - 40);
    const flame = 1 + Math.sin(time * 12 + index * 2) * 0.15;
    const glow = ctx.createRadialGradient(pillarX, 210, 2, pillarX, 210, 60);
    glow.addColorStop(0, 'rgba(213, 0, 249, 0.5)');
    glow.addColorStop(1, 'rgba(213, 0, 249, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(pillarX - 60, 150, 120, 120);
    ctx.fillStyle = '#2b1a35';
    ctx.fillRect(pillarX - 6, 214, 12, 20);
    ctx.fillStyle = '#ea80fc';
    ctx.beginPath();
    ctx.ellipse(pillarX, 204, 7 * flame, 14 * flame, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(pillarX, 208, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    const suits = ['\u2660', '\u2665', '\u2666', '\u2663'];
    ctx.fillStyle = index % 2 ? '#4a148c' : '#7b1fa2';
    ctx.beginPath();
    ctx.moveTo(pillarX - 20, 260);
    ctx.lineTo(pillarX + 20, 260);
    ctx.lineTo(pillarX + 20, 340 + Math.sin(time + index) * 3);
    ctx.lineTo(pillarX, 325);
    ctx.lineTo(pillarX - 20, 340 + Math.sin(time + index) * 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(suits[index], pillarX, 300);
    ctx.textAlign = 'left';
  });
  // the portal to the world of light, still swirling
  const portalX = 270;
  const portalY = ground - 150;
  for (let ring = 0; ring < 5; ring += 1) {
    ctx.strokeStyle = ring % 2 ? 'rgba(234, 128, 252, 0.6)' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(portalX, portalY, 40 + ring * 10, 80 + ring * 14, Math.sin(time + ring) * 0.1, time * (ring % 2 ? 1 : -1) + ring, time * (ring % 2 ? 1 : -1) + ring + Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(20, 0, 30, 0.75)';
  ctx.beginPath();
  ctx.ellipse(portalX, portalY, 36, 74, 0, 0, Math.PI * 2);
  ctx.fill();
  // the floor: black and purple tiles, a dark red carpet
  for (let tile = 0; tile < width; tile += 64) {
    ctx.fillStyle = (tile / 64) % 2 ? '#1a0b26' : '#07030b';
    ctx.fillRect(tile, ground, 64, canvas.height - ground);
  }
  ctx.fillStyle = '#3d0a14';
  ctx.fillRect(380, ground, 300, canvas.height - ground);
  ctx.fillStyle = '#5c1020';
  ctx.fillRect(380, ground, 300, 4);
  // in the fight, the pet watches from the back
  if (!arcadeCutscene.active && isOriginsArcade() && selectedNormalArcadeLevel === originsSecretLevel) {
    ctx.save();
    ctx.translate(880, ground);
    ctx.scale(0.65, 0.65);
    drawBigFriend({ position: { x: -75, y: -176 }, width: 150, height: 176, attacksToTheRight: false, friendFade: 0.75, friendGrin: 0, velocity: { x: 0 }, isAttacking: false, secretVariant: 'bigFriend' });
    ctx.restore();
  }
  drawOriginsFog(time, 0.5);
  drawOriginsVignette(0.8);
}

// ---------- the ending: the jester's flash, the vision of everything, back to the alley ----------
let originsVisionCast = null;

function getOriginsVisionCast() {
  if (originsVisionCast) return originsVisionCast;
  const entries = [
    ['normal', null, 'NORMAL', '#1565c0'], ['fireMaster', null, 'FIRE MASTER', '#e65100'], ['normal', 'iceMaster', 'ICE MASTER', '#0277bd'],
    ['gambler', null, 'GAMBLER', '#4a148c'], ['gambler', 'scammer', 'SCAMMER', '#263238'], ['gambler', 'shadowJester', 'SHADOW JESTER', '#311b92'],
    ['reflecter', null, 'REFLECTER', '#00838f'], ['chrono', null, 'CHRONO', '#283593'], ['cowboy', null, 'COWBOY', '#8d6e63'],
    ['tank', null, 'LIVING TANK', '#33691e'], ['switcher', null, 'SWITCHER', '#6a1b9a'], ['sorcerer', null, 'SORCERER', '#4527a0'],
    ['ghost', null, 'GHOST', '#37474f'], ['monkey', null, 'MONKEI', '#827717'], ['normal', 'knight', 'KNIGHT', '#5d4037'],
    ['lightWarrior', null, 'LIGHT WARRIOR', '#f9a825'], ['divineGeneral', null, 'DIVINE GENERAL', '#bf360c'], ['normal', 'mossBeast', 'BESTIA DEL MUSGO', '#2e7d32'],
    ['normal', 'mochiMouse', 'MOCHI', '#c2185b'], ['normal', 'shaolinMaster', 'SHANG TING', '#b71c1c'], ['normal', 'bigFriend', '? ? ?', '#000000'],
  ];
  originsVisionCast = [];
  entries.forEach(([type, variant, title, color]) => {
    try {
      const fighter = new Fighter({ x: 0, y: 0, color: '#ffffff', attacksToTheRight: true });
      fighter.setCharacterType(type, variant);
      originsVisionCast.push({ fighter, title, color });
    } catch (error) {
      // (that memory is too blurry)
    }
  });
  return originsVisionCast;
}

function startOriginsSecretOutro() {
  originsOutroPlayed = true;
  markOriginsSecretBeaten();
  player1.scamLabelTimer = 0;
  player2.scamLabelTimer = 0;
  clearJesterProjectiles();
  ch6CutsceneBase('originsOutro', originsSecretOutroLines, 'dialog', {
    gamblerX: 300,
    gamblerTargetX: 300,
    scammerX: canvas.width + 400,
    scammerTargetX: canvas.width + 400,
    scammerY: 0,
    secret: true,
    place: 'castle',
    hideHero: false,
    lastLineSeen: -1,
    charge: 0,
    beam: 0,
    whiteout: 0,
    visionT: 0,
    sparks: [],
    shake: 0,
  });
  startCutsceneLine(0);
}

function updateOriginsSecretOutro(cutscene, line) {
  const firstFrame = cutscene.lastLineSeen !== cutscene.lineIndex;
  cutscene.lastLineSeen = cutscene.lineIndex;
  if (!line) return;
  if (line.charge) {
    cutscene.charge = Math.min(1, cutscene.charge + 0.012);
    if (cutscene.frame % 12 === 0) playTone({ frequency: 300 + cutscene.charge * 900, duration: 0.15, type: 'sine', volume: 0.04 });
    // the light gathers at the tip of his scythe
    for (let spark = 0; spark < 2; spark += 1) {
      const angle = Math.random() * Math.PI * 2;
      cutscene.sparks.push({ angle, distance: 160 + Math.random() * 80, life: 30 });
    }
  }
  cutscene.sparks.forEach((spark) => {
    spark.distance *= 0.9;
    spark.life -= 1;
  });
  cutscene.sparks = cutscene.sparks.filter((spark) => spark.life > 0);
  if (line.fire && firstFrame) {
    cutscene.beam = 1;
    cutscene.shake = 26;
    playSound('judgeFinalStart');
    playNoise({ duration: 1.5, volume: 0.12, filterFrequency: 1200 });
    playTone({ frequency: 90, duration: 2.5, type: 'sawtooth', volume: 0.08, slideTo: 40 });
  }
  if (line.fire) cutscene.whiteout = Math.min(1, cutscene.whiteout + 0.02);
  if (line.vision) {
    cutscene.whiteout = 0;
    cutscene.visionT += 1;
    if (firstFrame) playTone({ frequency: 3000, duration: 4, type: 'sine', volume: 0.015, slideTo: 2500 });
  }
  if (line.place === 'alley' && firstFrame) {
    // dropped back in the alley, as if nothing happened
    cutscene.place = 'alley';
    selectedMap = 'gamblerAlley';
    cutscene.beam = 0;
    cutscene.charge = 0;
    cutscene.whiteout = 1;
    cutscene.gamblerX = 330;
    cutscene.gamblerTargetX = 330;
    player1.originsDizzy = true;
  }
  if (cutscene.place === 'alley') cutscene.whiteout = Math.max(0, cutscene.whiteout - 0.03);
  if (line.jesterLaugh && firstFrame) {
    playSound('jesterLaugh');
    setTimeout(() => playSound('jesterLaugh'), 700);
  }
  if (cutscene.shake > 0) cutscene.shake *= 0.92;
}

function drawOriginsSecretOutroFx(cutscene) {
  const time = performance.now() / 1000;
  if (cutscene.place === 'castle') {
    // the jester, tired at first... then raising his scythe
    const jester = player2;
    const tired = cutscene.charge <= 0 && cutscene.beam <= 0;
    jester.position = { x: 680, y: ground - jester.height - (tired ? 0 : 16 + Math.sin(time * 3) * 4) };
    jester.attacksToTheRight = false;
    jester.isAttacking = false;
    jester.draw();
    const tipX = 680 + jester.width / 2 - 10;
    const tipY = jester.position.y - 40;
    if (cutscene.charge > 0) {
      const radius = 8 + cutscene.charge * 34;
      const glow = ctx.createRadialGradient(tipX, tipY, 2, tipX, tipY, radius * 3);
      glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      glow.addColorStop(1, 'rgba(234, 128, 252, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(tipX - radius * 3, tipY - radius * 3, radius * 6, radius * 6);
      ctx.fillStyle = '#ffffff';
      cutscene.sparks.forEach((spark) => {
        ctx.fillRect(tipX + Math.cos(spark.angle) * spark.distance, tipY + Math.sin(spark.angle) * spark.distance, 3, 3);
      });
    }
    if (cutscene.beam > 0) {
      // the white flash: a huge ray onto Scammer
      const targetX = player1.position.x + player1.width / 2;
      const targetY = player1.position.y + 40;
      const wobble = Math.sin(time * 40) * 6;
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 40;
      ctx.strokeStyle = 'rgba(234, 128, 252, 0.8)';
      ctx.lineWidth = 90 + wobble;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 50 + wobble;
      ctx.stroke();
      ctx.restore();
      for (let ray = 0; ray < 14; ray += 1) {
        const angle = (ray / 14) * Math.PI * 2 + time * 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX + Math.cos(angle) * 300, targetY + Math.sin(angle) * 300);
        ctx.stroke();
      }
    }
    if (cutscene.whiteout > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.whiteout})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (cutscene.visionT > 0) drawOriginsVision(cutscene);
    return;
  }
  // back in the alley: dizzy, stars spinning around his head
  const headX = player1.position.x + player1.width / 2;
  const headY = player1.position.y - 14;
  ctx.fillStyle = '#fdd835';
  for (let star = 0; star < 4; star += 1) {
    const angle = time * 4 + (star / 4) * Math.PI * 2;
    ctx.save();
    ctx.translate(headX + Math.cos(angle) * 34, headY + Math.sin(angle) * 10);
    ctx.rotate(time * 6);
    ctx.font = '900 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('\u2605', 0, 6);
    ctx.restore();
  }
  ctx.textAlign = 'left';
  if (cutscene.whiteout > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${cutscene.whiteout})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// the whole game of Moquete, flashing through his head
function drawOriginsVision(cutscene) {
  const cast = getOriginsVisionCast();
  if (!cast.length) return;
  const time = performance.now() / 1000;
  const speed = Math.max(6, 16 - Math.floor(cutscene.visionT / 60) * 3);
  const index = Math.floor(cutscene.visionT / speed) % cast.length;
  const local = (cutscene.visionT % speed) / speed;
  const memory = cast[index];
  ctx.save();
  ctx.fillStyle = memory.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const burst = ctx.createRadialGradient(512, 300, 20, 512, 300, 520);
  burst.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  burst.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = burst;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // speed lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  for (let line = 0; line < 24; line += 1) {
    const angle = (line / 24) * Math.PI * 2 + time;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(angle) * 140, 300 + Math.sin(angle) * 140);
    ctx.lineTo(512 + Math.cos(angle) * 700, 300 + Math.sin(angle) * 700);
    ctx.stroke();
  }
  const fighter = memory.fighter;
  try {
    fighter.position = { x: -fighter.width / 2, y: -fighter.height / 2 };
    fighter.attacksToTheRight = index % 2 === 0;
    fighter.isAttacking = false;
    ctx.save();
    ctx.translate(512, 310);
    const scale = 1.6 + local * 0.3;
    ctx.scale(scale, scale);
    fighter.draw();
    ctx.restore();
  } catch (error) {
    // a blurry memory
  }
  ctx.font = '900 44px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#ffffff';
  ctx.strokeText(memory.title, 512, 520);
  ctx.fillText(memory.title, 512, 520);
  ctx.textAlign = 'left';
  // a white blink between memories
  if (local < 0.18) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 - local * 3.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

// ================= codes of the special chapter: 911, FRIEND, SALESMAN =================
const originsCodes = { police: false, friend: false, salesman: false };
const originsCodeRoster = [
  { variant: 'policeOfficer', name: 'Policia', code: 'police' },
  { variant: 'policeSergeant', name: 'Sargento', code: 'police' },
  { variant: 'policeChief', name: 'Comisario', code: 'police' },
  { variant: 'friendThing', name: 'Amigo', code: 'friend' },
  { variant: 'bigFriend', name: 'Amigo Grande', code: 'friend' },
];

function isOriginsCodeVariantActive(variant) {
  const entry = originsCodeRoster.find((item) => item.variant === variant);
  return Boolean(entry && originsCodes[entry.code]);
}

// the buttons in character select (built once, after the MAGICTOWN ones)
const originsCodeButtons = [];
(function buildOriginsCodeButtons() {
  const anchor = document.querySelector('[data-magic-variant="lanternGuard"]');
  if (!anchor) return;
  let after = anchor;
  originsCodeRoster.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-option magic-town-option origins-code-option hidden';
    button.dataset.originsVariant = entry.variant;
    button.dataset.originsCode = entry.code;
    button.innerHTML = `<span>${entry.name}</span><span class="character-preview mtown-preview" aria-hidden="true"><span class="preview-body"></span></span>`;
    button.addEventListener('click', () => selectCharacter('normal', entry.variant));
    after.insertAdjacentElement('afterend', button);
    after = button;
    originsCodeButtons.push(button);
  });
})();

let originsCodePreviewsBuilt = false;

// previews from the real drawings (like MAGICTOWN)
function buildOriginsCodePreviews() {
  if (originsCodePreviewsBuilt) return;
  originsCodePreviewsBuilt = true;
  const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const thumb = document.createElement('canvas');
  const thumbCtx = thumb.getContext('2d');
  thumb.width = 140;
  thumb.height = 168;
  originsCodeButtons.forEach((button) => {
    try {
      const actor = new Fighter({ x: 0, y: 0, color: '#9e9e9e', attacksToTheRight: true });
      actor.setCharacterType('normal', button.dataset.originsVariant);
      resetPolice(actor);
      resetFriendThing(actor);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      actor.position = { x: 400, y: 300 - actor.height };
      actor.attacksToTheRight = true;
      actor.isAttacking = false;
      actor.draw();
      ctx.restore();
      const box = { x: 330, y: 300 - actor.height - 60, width: actor.width + 140, height: actor.height + 80 };
      const scale = Math.min(thumb.width / box.width, thumb.height / box.height);
      thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
      thumbCtx.drawImage(canvas, box.x, box.y, box.width, box.height, (thumb.width - box.width * scale) / 2, thumb.height - box.height * scale, box.width * scale, box.height * scale);
      const preview = button.querySelector('.character-preview');
      preview.style.backgroundImage = `url(${thumb.toDataURL()})`;
      preview.style.backgroundSize = 'contain';
      preview.style.backgroundRepeat = 'no-repeat';
      preview.style.backgroundPosition = 'center bottom';
      preview.querySelector('.preview-body').style.display = 'none';
    } catch (error) {
      // keep the simple preview
    }
  });
  ctx.putImageData(saved, 0, 0);
}

function syncOriginsCodeButtons() {
  originsCodeButtons.forEach((button) => button.classList.toggle('hidden', !originsCodes[button.dataset.originsCode]));
}

function unlockOriginsCode(code) {
  originsCodes[code] = true;
  syncOriginsCodeButtons();
  if (code !== 'salesman') buildOriginsCodePreviews();
  if (code === 'police') showCustomToast('911 ACTIVADO', 'La policia de la ciudad ya se puede elegir: Policia, Sargento y Comisario. Q porra, F esposas, R silbato (el Comisario llama al patrullero).');
  if (code === 'friend') {
    showCustomToast('FRIEND ACTIVADO', '...je. El Amigo y el Amigo Grande ya se pueden elegir. Q, F y R para sus... trucos.');
    if (typeof playFriendLaugh === 'function') playFriendLaugh('soft');
  }
  if (code === 'salesman') showCustomToast('SALESMAN ACTIVADO', 'Scammer vuelve a sus comienzos: traje rojo, sin lentes y con sus trucos de agua mojada, oferta 2x1 y carrito del mercado.');
  playSound('achievement');
}

function lockOriginsCodes() {
  if (typeof lockFrostFireCode === 'function') lockFrostFireCode();
  Object.keys(originsCodes).forEach((code) => {
    originsCodes[code] = false;
  });
  syncOriginsCodeButtons();
}

// every fight: their state ready (and the young Scammer only with SALESMAN)
function prepareOriginsCodeFighter(fighter) {
  if (isPolice(fighter)) resetPolice(fighter);
  if (isFriendThing(fighter)) resetFriendThing(fighter);
  if (normalArcadeActive && arcadeChapter === 'origins') return;
  // a person playing them starts with everything ready
  if ((isPolice(fighter) || isFriendThing(fighter)) && !(fighter === player2 && botEnabled)) {
    ['policeBatonCooldown', 'policeCuffsCooldown', 'policeWhistleCooldown', 'policeSirenCooldown', 'friendBlinkCooldown', 'friendHandsCooldown', 'friendEyesCooldown', 'friendWaveCooldown'].forEach((key) => {
      fighter[key] = 0;
    });
  }
  const young = !normalArcadeActive && originsCodes.salesman && fighter.secretVariant === 'scammer';
  if (young) {
    fighter.youngScammer = true;
    fighter.originsFear = 0;
    fighter.youngGlasses = false;
    fighter.youngScar = false;
    fighter.originsCrazy = false;
    fighter.color = '#c62828';
    fighter.setMaxHealth(150);
    fighter.health = fighter.maxHealth;
    resetYoungScammer(fighter);
  } else if (fighter.youngScammer) {
    fighter.youngScammer = false;
  }
}

// when a person plays them
function handleOriginsCodeKey(fighter, target, slot) {
  if (fighter.youngScammer && fighter === player2) return handleYoungScammerKey(fighter, target, ['q', 'f', 'r'][slot]);
  if (!isPolice(fighter) && !isFriendThing(fighter)) return false;
  if (!canFighterAct(fighter) || gameOver) return true;
  if (isPolice(fighter)) {
    if (!fighter.policeShots) resetPolice(fighter);
    if (slot === 0) castPoliceBaton(fighter);
    else if (slot === 1) castPoliceCuffs(fighter, target);
    else if (fighter.secretVariant === 'policeChief') castPoliceSiren(fighter, target);
    else if (fighter.secretVariant === 'policeSergeant') castPoliceWhistle(fighter);
    else castPoliceCuffs(fighter, target);
    return true;
  }
  if (!fighter.friendHands) resetFriendThing(fighter);
  const big = fighter.secretVariant === 'bigFriend';
  if (slot === 0) (big ? castFriendEyes(fighter, target) : castFriendBlink(fighter));
  else if (slot === 1) castFriendHands(fighter, target);
  else (big ? castFriendWave(fighter) : castFriendEyes(fighter, target));
  return true;
}

function getOriginsCodeCooldowns(player) {
  const cooldown = (name, remaining, max) => ({ active: true, name, remaining: remaining || 0, max });
  if (isPolice(player)) {
    const chief = player.secretVariant === 'policeChief';
    const sergeant = player.secretVariant === 'policeSergeant';
    return {
      q: cooldown('Porra', player.policeBatonCooldown, chief ? 90 : 130),
      f: cooldown('Esposas', player.policeCuffsCooldown, chief ? 110 : 160),
      r: chief ? cooldown('Patrullero', player.policeSirenCooldown, 320) : sergeant ? cooldown('Silbato', player.policeWhistleCooldown, 220) : cooldown('Esposas', player.policeCuffsCooldown, 160),
    };
  }
  const big = player.secretVariant === 'bigFriend';
  return {
    q: big ? cooldown('Ojos', player.friendEyesCooldown, 200) : cooldown('Desaparecer', player.friendBlinkCooldown, 220),
    f: cooldown('Manos de sombra', player.friendHandsCooldown, 230),
    r: big ? cooldown('Ola de sombra', player.friendWaveCooldown, 300) : cooldown('Ojos', player.friendEyesCooldown, 200),
  };
}
