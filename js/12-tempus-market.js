// Moquete - Mercado de Tempus: la "tienda" de Chrono
// Se abre con el reloj de bolsillo del menu (aparece despues de vencer a Chrono en el capitulo 4).
// Vende cosas exclusivas de Tempus Corp. y ademas REBOBINA compras hechas en la tienda de Scammer.

const tempusStorageKey = 'moqueteTempusMarket';
const tempusMarket = loadTempusMarket();
const tempusRewindRatio = 0.6;

const tempusItems = [
  {
    id: 'timeSand',
    name: 'Arena del Tiempo',
    description: 'Un reloj de arena de Tempus Corp. En los modos Hardcore y Hardercore, cuando te quedas sin vidas, da vuelta el reloj y te regala UNA vida mas (una vez por partida).',
    price: 25000,
    line: 'Arena de la zona temporal 7. Cuando todo termine para vos... dala vuelta. Una vez. Solo una.',
  },
  {
    id: 'fightTimer',
    name: 'Cronometro de Precision',
    description: 'Muestra el tiempo exacto de cada pelea arriba de la pantalla, con centesimas. Para los que cuentan cada segundo (como yo).',
    price: 8000,
    line: 'Precision de Tempus: ni un segundo se pierde. Bueno, ninguno que yo no quiera.',
  },
  {
    id: 'goldenGear',
    name: 'Engranaje Dorado',
    description: 'Un engranaje de un reloj que todavia no fue construido. Decoracion para el menu. Gira solo. No preguntes hacia donde.',
    price: 15000,
    line: 'Viene del futuro. Lo vas a comprar de todos modos... ya lo vi.',
  },
  {
    id: 'backwardClock',
    name: 'Reloj que Anda para Atras',
    description: 'Un reloj de pared para el menu que marca la hora al reves. Tocalo y Chrono te dice algo... de un momento que todavia no paso.',
    price: 30000,
    line: 'Marca la hora correcta. Solo que en la otra direccion.',
  },
];

const tempusGreetings = [
  'Bienvenido al Mercado de Tempus. Llegaste exactamente cuando calcule que llegarias.',
  'Tempus Corp. te saluda. A diferencia de cierto vendedor de la basura, aca todo funciona.',
  'Otra vez vos. O todavia vos. Con el tiempo cuesta distinguir.',
  'No toques nada. Bueno, toca. Pero despues no me pidas que rebobine eso.',
];
const tempusMachineRefusals = [
  'No. Te lo adverti. Esa maquina no vuelve a pasar por mis engranajes. Nunca.',
  'Dos veces fue suficiente. La tercera rompe algo que ni yo se arreglar.',
  'Rebobinar ESA maquina otra vez? Ni por todo el tiempo del mundo. Y eso es mucho tiempo.',
];
const tempusHints = [
  'Dentro de 3 peleas vas a perder una. No digo cual.',
  'Un caballero va a pedir ayuda a alguien que brilla. Ya paso. O va a pasar.',
  'Hay un fuego que no se apaga. Si lo ves... no estes cerca.',
  'El vendedor de los lentes tiene mas miedo del que muestra.',
  'Algun dia vas a jugar un capitulo mio. Todavia no esta listo. Yo si.',
  'La rueda gira hacia atras, pero la historia no. Ojala.',
];

function loadTempusMarket() {
  try {
    const saved = JSON.parse(localStorage.getItem('moqueteTempusMarket') || '{}') || {};
    return { owned: saved.owned || {}, visits: saved.visits || 0, rewinds: saved.rewinds || 0, machineRewinds: saved.machineRewinds || 0, machineAsks: saved.machineAsks || 0, machineOn: Boolean(saved.machineOn) };
  } catch (error) {
    return { owned: {}, visits: 0, rewinds: 0, machineRewinds: 0 };
  }
}

function saveTempusMarket() {
  try {
    localStorage.setItem(tempusStorageKey, JSON.stringify(tempusMarket));
  } catch (error) {
    // only this session
  }
}

function hasTempusItem(id) {
  return Boolean(tempusMarket.owned[id]);
}

// the market opens after levels 5 and 6 of chapter 4 (Chrono, and what came after him)
function isTempusMarketUnlocked() {
  try {
    if (typeof isArcadeChapterDone === 'function' && isArcadeChapterDone('reflecter')) return true;
    return Number(localStorage.getItem(reflecterArcadeProgressStorageKey) || 1) >= 7;
  } catch (error) {
    return false;
  }
}

// ---------- the screen ----------
let tempusScreen = null;
let tempusTalkTimer = null;

function tempusSay(text) {
  if (!tempusScreen) return;
  const line = tempusScreen.querySelector('.tempus-line');
  clearInterval(tempusTalkTimer);
  let typed = 0;
  line.textContent = '';
  tempusTalkTimer = setInterval(() => {
    typed += 2;
    line.textContent = text.slice(0, typed);
    if (typed % 6 === 0) playTone({ frequency: 1200 + Math.random() * 200, duration: 0.03, type: 'square', volume: 0.015 });
    if (typed >= text.length) clearInterval(tempusTalkTimer);
  }, 30);
}

function buildTempusScreen() {
  tempusScreen = document.createElement('div');
  tempusScreen.className = 'moquete-book-overlay tempus-overlay hidden';
  tempusScreen.innerHTML = `
    <div class="tempus-market">
      <div class="tempus-header">
        <canvas class="tempus-chrono-canvas" width="120" height="150" aria-hidden="true"></canvas>
        <div class="tempus-talk">
          <span class="tempus-kicker">MERCADO DE TEMPUS - atendido por CHRONO</span>
          <p class="tempus-line"></p>
        </div>
        <div class="tempus-wallet"><span class="coin-symbol" aria-hidden="true"></span> <strong data-tempus-coins>0</strong></div>
      </div>
      <div class="tempus-tabs">
        <button type="button" class="active" data-tempus-tab="buy">EXCLUSIVOS</button>
        <button type="button" data-tempus-tab="rewind">REBOBINAR COMPRAS</button>
      </div>
      <div class="tempus-items" data-tempus-panel="buy"></div>
      <div class="tempus-items hidden" data-tempus-panel="rewind"></div>
      <div class="tempus-footer">
        <span>*Tempus Corp. no se responsabiliza por paradojas, dias repetidos ni recuerdos de cosas que no pasaron.</span>
        <button type="button" data-tempus-close="1">Volver</button>
      </div>
    </div>`;
  tempusScreen.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-tempus-tab]');
    if (tab) {
      tempusScreen.querySelectorAll('[data-tempus-tab]').forEach((button) => button.classList.toggle('active', button === tab));
      tempusScreen.querySelectorAll('[data-tempus-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.tempusPanel !== tab.dataset.tempusTab));
      tempusSay(tab.dataset.tempusTab === 'rewind'
        ? tempusVoice(`Puedo llevar cualquier compra de ese vendedor al momento antes de hacerla. Te devuelvo el ${Math.round(tempusRewindRatio * 100)}%. El resto... se pierde en el tiempo.`, `Rebobinar compras! Chrono me dejo su control remoto del tiempo. Tiene un solo boton. Da miedo. Te devuelvo el ${Math.round(tempusRewindRatio * 100)}%, eso dice el manual.`)
        : tempusVoice('Productos exclusivos de Tempus Corp. No los vas a encontrar en ningun contenedor.', 'Productos exclusivos de Tempus Corp.! No se para que sirve la mitad, pero brillan.'));
      playSound('menuMove');
      return;
    }
    const buy = event.target.closest('[data-tempus-buy]');
    if (buy) {
      buyTempusItem(buy.dataset.tempusBuy);
      return;
    }
    if (event.target.closest('[data-tempus-machine]')) {
      useTempusMachine();
      return;
    }
    const read = event.target.closest('[data-tempus-read]');
    if (read) {
      openStoryBook(read.dataset.tempusRead);
      return;
    }
    const rewind = event.target.closest('[data-tempus-rewind]');
    if (rewind) {
      rewindScammerPurchase(rewind.dataset.tempusRewind, rewind);
      return;
    }
    if (event.target.closest('[data-tempus-close]') || event.target === tempusScreen) closeTempusMarket();
  });
  document.body.appendChild(tempusScreen);
}

function renderTempusMarket() {
  tempusScreen.querySelector('[data-tempus-coins]').textContent = coinWallet.balance.toLocaleString('es-ES');
  const buyPanel = tempusScreen.querySelector('[data-tempus-panel="buy"]');
  buyPanel.innerHTML = tempusItems.map((item) => {
    const owned = hasTempusItem(item.id);
    if (item.locked && item.locked() && !owned) {
      return `
      <div class="tempus-item tempus-locked">
        <span class="tempus-icon tempus-icon-${item.id}" aria-hidden="true"></span>
        <strong>? ? ?</strong>
        <p>${item.lockedText}</p>
        <span class="tempus-price">${item.price.toLocaleString('es-ES')} monedas</span>
        <button type="button" disabled>BLOQUEADO</button>
      </div>`;
    }
    if (item.book && owned) {
      return `
      <div class="tempus-item owned">
        <span class="tempus-icon tempus-icon-${item.id}" aria-hidden="true"></span>
        <strong>${item.name}</strong>
        <p>${item.description}</p>
        <span class="tempus-price">En tu biblioteca</span>
        <button type="button" data-tempus-read="${item.id}">LEER</button>
      </div>`;
    }
    return `
      <div class="tempus-item${owned ? ' owned' : ''}">
        <span class="tempus-icon tempus-icon-${item.id}" aria-hidden="true"></span>
        <strong>${item.name}</strong>
        <p>${item.description}</p>
        <span class="tempus-price">${item.price.toLocaleString('es-ES')} monedas</span>
        <button type="button" data-tempus-buy="${item.id}" ${owned ? 'disabled' : ''}>${owned ? 'COMPRADO' : 'COMPRAR'}</button>
      </div>`;
  }).join('') + (isTempusSwitcherShift() ? '' : renderTempusMachineCard());
  // everything bought from Scammer (once) can be rewound
  // (the Rare Machine went into the rift with Chrono: nobody can rewind it now)
  const rewindable = scammerShopItems.filter((item) => scammerShop.owned[item.id] && !item.repeatable && !item.grudgeOnly && !(item.id === 'rareMachine' && isTempusSwitcherShift()));
  const rewindPanel = tempusScreen.querySelector('[data-tempus-panel="rewind"]');
  rewindPanel.innerHTML = rewindable.length
    ? rewindable.map((item) => `
      <div class="tempus-item tempus-rewind-item">
        <span class="shop-icon icon-${item.id}" aria-hidden="true"></span>
        <strong>${item.name}</strong>
        <p>Comprado en la tienda de Scammer.</p>
        <span class="tempus-price">Devuelve ${Math.floor(item.price * tempusRewindRatio).toLocaleString('es-ES')} monedas</span>
        <button type="button" data-tempus-rewind="${item.id}">REBOBINAR</button>
      </div>`).join('')
    : '<p class="tempus-empty">No compraste nada en esa tienda... todavia. (Lo vas a hacer. Lo vi.)</p>';
}

function buyTempusItem(id) {
  const item = tempusItems.find((entry) => entry.id === id);
  if (!item || hasTempusItem(id) || (item.locked && item.locked())) return;
  if (coinWallet.balance < item.price) {
    tempusSay(tempusVoice('No te alcanza. Vuelve cuando el tiempo te haya dado mas monedas.', 'No te alcanza. Lo dice la maquinita. Yo te lo daria, pero el jefe me esta mirando. Creo.'));
    playTone({ frequency: 180, duration: 0.3, type: 'square', volume: 0.04 });
    return;
  }
  coinWallet.balance -= item.price;
  saveCoinWallet();
  syncCoinWalletUI();
  tempusMarket.owned[id] = true;
  saveTempusMarket();
  tempusSay(tempusVoice(item.line, `Vendido! El ${item.name} es tuyo. ...Esto se cobraba antes o despues? Bueno, ya esta.`));
  playSound('cutsceneCash');
  renderTempusMarket();
  syncTempusMenu();
}

// the rewind: the item goes back to Scammer, part of the coins come back
function rewindScammerPurchase(id, button) {
  const item = scammerShopItems.find((entry) => entry.id === id);
  if (!item || !scammerShop.owned[id]) return;
  const machine = id === 'rareMachine';
  const machineRewinds = tempusMarket.machineRewinds || 0;
  // the Rare Machine: Chrono notices... and the third time, he says no
  if (machine && machineRewinds >= 2) {
    button.classList.remove('confirm');
    button.classList.add('refused');
    button.textContent = 'PROHIBIDO';
    tempusSay(tempusMachineRefusals[Math.floor(Math.random() * tempusMachineRefusals.length)]);
    playTone({ frequency: 120, duration: 0.6, type: 'square', volume: 0.05, slideTo: 80 });
    return;
  }
  if (!button.classList.contains('confirm')) {
    button.classList.add('confirm');
    button.textContent = 'SEGURO?';
    tempusSay(machine
      ? (machineRewinds === 0
        ? '...La Maquina Rara. Esa cosa hace ruido en mis engranajes. Sabes lo que hay adentro? Yo tampoco. Toca otra vez si estas seguro.'
        : 'Otra vez la Maquina Rara. Ya la vi pasar por el tiempo una vez y no me gusto. Toca otra vez... si te animas.')
      : tempusVoice(`El ${item.name}... va a volver al momento antes de que lo compraras. Tocá otra vez para confirmar.`, `Seguro? Si aprieto este boton, el ${item.name} vuelve al pasado. Yo no se volver al pasado. Toca otra vez.`));
    return;
  }
  delete scammerShop.owned[id];
  tempusMarket.rewinds = (tempusMarket.rewinds || 0) + 1;
  saveTempusMarket();
  if (scammerShop.toggles) delete scammerShop.toggles[id];
  saveScammerShop();
  const refund = Math.floor(item.price * tempusRewindRatio);
  coinWallet.balance += refund;
  saveCoinWallet();
  syncCoinWalletUI();
  if (typeof syncShopBadges === 'function') syncShopBadges();
  if (machine) {
    tempusMarket.machineRewinds = machineRewinds + 1;
    saveTempusMarket();
    tempusSay(machineRewinds === 0
      ? `Listo... Los minerales de esa maquina hicieron temblar toda la linea temporal. +${refund.toLocaleString('es-ES')}. No lo hagas costumbre.`
      : `Hecho. +${refund.toLocaleString('es-ES')}. Pero escuchame bien: es la ULTIMA vez. Esa maquina no vuelve a pasar por mis engranajes.`);
  } else {
    tempusSay(tempusVoice(`Listo. Para el universo, nunca compraste el ${item.name}. Para tu billetera: +${refund.toLocaleString('es-ES')}.`, `Listo! El ${item.name} desaparecio y aparecieron +${refund.toLocaleString('es-ES')} monedas. No me preguntes como.`));
  }
  // the sound of time going backwards
  [1600, 1200, 900, 600].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.12, type: 'triangle', volume: 0.04, slideTo: frequency * 1.3 }), index * 90));
  renderTempusMarket();
}

function openTempusMarket() {
  if (!tempusScreen) buildTempusScreen();
  tempusMarket.visits += 1;
  saveTempusMarket();
  renderTempusMarket();
  tempusScreen.querySelectorAll('[data-tempus-tab]').forEach((button, index) => button.classList.toggle('active', index === 0));
  tempusScreen.querySelectorAll('[data-tempus-panel]').forEach((panel, index) => panel.classList.toggle('hidden', index !== 0));
  tempusScreen.classList.remove('hidden');
  cancelAnimationFrame(tempusChronoFrame);
  drawTempusChrono();
  syncTempusShift();
  tempusSay(isTempusSwitcherShift()
    ? tempusSwitcherGreetings[Math.floor(Math.random() * tempusSwitcherGreetings.length)]
    : tempusMarket.visits === 1
      ? 'Ah. El que me gano en la fabrica. Bienvenido al Mercado de Tempus. Aca el tiempo es la moneda... pero tambien acepto monedas.'
      : tempusGreetings[Math.floor(Math.random() * tempusGreetings.length)]);
  playSound('judgeCore');
}

function closeTempusMarket() {
  if (tempusScreen) tempusScreen.classList.add('hidden');
  clearInterval(tempusTalkTimer);
  cancelAnimationFrame(tempusChronoFrame);
}

// ---------- Chrono himself, in miniature: the real game drawing ----------
// (the fighters draw on the game canvas: he is drawn in a corner for an instant and copied to the market)
let tempusChronoActor = null;
let tempusSwitcherActor = null;
let tempusChronoFrame = null;

function drawTempusChrono() {
  if (!tempusScreen || tempusScreen.classList.contains('hidden')) return;
  tempusChronoFrame = requestAnimationFrame(drawTempusChrono);
  const mini = tempusScreen.querySelector('.tempus-chrono-canvas');
  if (!mini) return;
  try {
    if (!tempusChronoActor) {
      tempusChronoActor = new Fighter({ x: 0, y: 0, color: '#283593', attacksToTheRight: true });
      tempusChronoActor.setCharacterType('chrono');
    }
    const size = { width: 110, height: 150 };
    const saved = ctx.getImageData(0, 0, size.width, size.height);
    ctx.clearRect(0, 0, size.width, size.height);
    const time = performance.now() / 1000;
    if (isTempusSwitcherShift() && !tempusSwitcherActor) {
      tempusSwitcherActor = new Fighter({ x: 0, y: 0, color: '#43a047', attacksToTheRight: true });
      tempusSwitcherActor.setCharacterType('switcher');
    }
    const actor = isTempusSwitcherShift() ? tempusSwitcherActor : tempusChronoActor;
    actor.position = { x: size.width / 2 - actor.width / 2, y: size.height / 2 - actor.height / 2 + Math.sin(time * 2) * 6 };
    actor.attacksToTheRight = true;
    actor.isAttacking = false;
    actor.chronoAuraBoost = 0;
    actor.rareMachine = Boolean(tempusMarket.machineOn);
    actor.draw();
    const miniCtx = mini.getContext('2d');
    miniCtx.clearRect(0, 0, mini.width, mini.height);
    miniCtx.drawImage(canvas, 0, 0, size.width, size.height, 0, 0, mini.width, mini.height);
    ctx.putImageData(saved, 0, 0);
  } catch (error) {
    cancelAnimationFrame(tempusChronoFrame);
  }
}

// ---------- in the menu: the pocket watch (the door), the gear and the backward clock ----------
const tempusMenuHost = document.querySelector('#playButton') ? document.querySelector('#playButton').closest('.menu-screen') || document.getElementById('mainMenu') : document.getElementById('mainMenu');
const tempusWatchButton = document.createElement('button');
tempusWatchButton.type = 'button';
tempusWatchButton.className = 'tempus-watch-button hidden';
tempusWatchButton.title = 'Un reloj de bolsillo... hace tic tac al reves';
tempusWatchButton.setAttribute('aria-label', 'Mercado de Tempus');
tempusWatchButton.addEventListener('click', openTempusMarket);
// (the menu styles its buttons very strongly: these always win)
['position:absolute', 'top:118px', 'left:26px', 'bottom:auto', 'right:auto', 'width:34px', 'height:40px', 'min-height:0', 'min-width:0', 'max-height:none', 'padding:0', 'margin:0', 'border:none', 'box-shadow:none', 'z-index:5'].forEach((rule) => {
  const [name, value] = rule.split(':');
  tempusWatchButton.style.setProperty(name, value, 'important');
});
const tempusMenuDecor = document.createElement('span');
tempusMenuDecor.className = 'tempus-menu-decor';
if (tempusMenuHost) {
  tempusMenuHost.appendChild(tempusWatchButton);
  tempusMenuHost.appendChild(tempusMenuDecor);
}

function syncTempusMenu() {
  tempusWatchButton.classList.toggle('hidden', !isTempusMarketUnlocked());
  tempusMenuDecor.innerHTML = `
    ${hasTempusItem('goldenGear') ? '<span class="tempus-gear" title="Engranaje Dorado"></span>' : ''}
    ${hasTempusItem('backwardClock') ? '<button type="button" class="tempus-backward-clock" title="Reloj que Anda para Atras"><i></i><i></i></button>' : ''}`;
  const clock = tempusMenuDecor.querySelector('.tempus-backward-clock');
  if (clock) {
    clock.addEventListener('click', () => {
      if (isTempusSwitcherShift()) showCustomToast('SWITCHER DICE...', tempusSwitcherHints[Math.floor(Math.random() * tempusSwitcherHints.length)]);
      else showCustomToast('CHRONO DICE...', tempusHints[Math.floor(Math.random() * tempusHints.length)]);
      playTone({ frequency: 900, duration: 0.2, type: 'triangle', volume: 0.04, slideTo: 600 });
    });
  }
}

syncTempusMenu();
setInterval(syncTempusMenu, 2000);

// ---------- what the items do ----------
// the precision stopwatch, over the fight
function drawTempusFightTimer() {
  if (!hasTempusItem('fightTimer') || !gameStarted || gameOver || arcadeCutscene.active || !fightStartedAt) return;
  const elapsed = (performance.now() - fightStartedAt) / 1000;
  const minutes = Math.floor(elapsed / 60);
  const seconds = Math.floor(elapsed % 60);
  const hundredths = Math.floor((elapsed % 1) * 100);
  const text = `${minutes}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  ctx.save();
  ctx.font = '900 16px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(canvas.width / 2 - 52, 128, 104, 24);
  ctx.strokeStyle = '#26c6da';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - 52, 128, 104, 24);
  ctx.fillStyle = '#80deea';
  ctx.fillText(text, canvas.width / 2, 146);
  ctx.restore();
}

// the sand of time: one more life in a hardcore run (once per run)
function useTempusSand(run) {
  if (!hasTempusItem('timeSand') || run.tempusSandUsed) return false;
  run.tempusSandUsed = true;
  run.lives = 1;
  showCustomToast('ARENA DEL TIEMPO', 'El reloj de arena se dio vuelta solo. Tenes una vida mas. No la desperdicies.');
  [600, 800, 1000].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.2, type: 'triangle', volume: 0.05 }), index * 150));
  return true;
}

// ================= THE RARE MACHINE, ON CHRONO (requirement of chapter 6: "Usar la Maquina Rara") =================
// In his market you can put the machine on him (he says no... several times). Then, playing Chrono outside the
// arcade, R: he rises, aims and fires a huge beam the color of the dark world's portals.
// Aimed at the very center of the map, against DIVINE GENERAL... the machine goes out of control.
const rareMachineUsedKey = 'moqueteRareMachineUsed';
const chronoMachineCooldown = 900;
// (in the dark world it wakes up again in "light mode": weaker, but it recharges faster)
const chronoMachineLightCooldown = 240;
const chronoMachineRefusals = [
  'Ni lo pienses. Esa cosa no se acerca a mis engranajes.',
  'Te dije que no. Hace ruido. Un ruido que viene de OTRO LADO.',
  'NO. Alejala de mi. ...Por que te acercas? POR QUE TE ACERCAS?!',
];
const chronoMachine = { state: null, t: 0, angle: 0, hit: false, overload: null, scene: null };

function isRareMachineUsed() {
  try {
    return localStorage.getItem(rareMachineUsedKey) === '1';
  } catch (error) {
    return false;
  }
}

// ---------- in the market ----------
function renderTempusMachineCard() {
  if (!(scammerShop.owned && scammerShop.owned.rareMachine)) return '';
  const on = Boolean(tempusMarket.machineOn);
  return `
      <div class="tempus-item tempus-machine-item${on ? ' owned' : ''}">
        <span class="shop-icon icon-rareMachine" aria-hidden="true"></span>
        <strong>La Maquina Rara</strong>
        <p>${on ? 'Chrono la tiene puesta. Jugando con Chrono (fuera del arcade), R: se eleva, apunta con A / D y dispara con R.' : 'La compraste en la tienda de Scammer. Chrono no la quiere ni ver. ...Pero cabe justo en su hombro.'}</p>
        <span class="tempus-price">${on ? 'PUESTA' : 'Gratis (para vos)'}</span>
        <button type="button" data-tempus-machine="1">${on ? 'SACARSELA' : 'PONERSELA A CHRONO'}</button>
      </div>`;
}

function useTempusMachine() {
  if (tempusMarket.machineOn) {
    tempusMarket.machineOn = false;
    saveTempusMarket();
    tempusSay('...Gracias. Al fin. ...Aunque, no se, me sentia mas alto con ella.');
    playSound('menuMove');
    renderTempusMarket();
    return;
  }
  const asks = tempusMarket.machineAsks || 0;
  if (asks < chronoMachineRefusals.length) {
    tempusMarket.machineAsks = asks + 1;
    saveTempusMarket();
    tempusSay(chronoMachineRefusals[asks]);
    playTone({ frequency: 160 - asks * 20, duration: 0.4, type: 'square', volume: 0.05, slideTo: 100 });
    return;
  }
  // the last time he doesn't get to say no
  tempusMarket.machineOn = true;
  saveTempusMarket();
  tempusSay('OYE! QUE HACES?! SUELTAME! ...Ugh. ...Bueno. Admito que... me queda bien. Pero si apunto al centro exacto de un lugar con alguien como ESE general cerca... no. No lo voy a hacer.');
  playNoise({ duration: 0.4, volume: 0.07, filterFrequency: 2000 });
  playTone({ frequency: 220, duration: 0.6, type: 'sawtooth', volume: 0.05, slideTo: 440 });
  renderTempusMarket();
}

// ---------- in a fight ----------
function prepareChronoMachine(fighter) {
  fighter.rareMachine = Boolean(fighter === player1 && !normalArcadeActive && fighter.characterType === 'chrono' && !fighter.secretVariant && tempusMarket.machineOn);
  // (in chapter 6 he still carries it: only the look)
  fighter.machineLook = Boolean(fighter === player1 && normalArcadeActive && arcadeChapter === 'chrono' && fighter.characterType === 'chrono');
  fighter.machineCooldown = 0;
  if (fighter === player1) {
    Object.assign(chronoMachine, { state: null, t: 0, overload: null, scene: null });
    setMachineSceneHud(false);
  }
}

function getChronoMachineCooldown(fighter) {
  return { active: true, name: fighter.machineLight ? 'Modo luz' : 'Maquina Rara', remaining: chronoMachine.state ? 1 : fighter.machineCooldown || 0, max: fighter.machineLight ? (fighter.machineBoost ? 210 : chronoMachineLightCooldown) : chronoMachineCooldown };
}

function handleChronoMachineKey(caster, target) {
  if (!caster.rareMachine) return false;
  if (gameOver || !gameStarted || arcadeCutscene.active) return true;
  // aiming: R again fires
  if (chronoMachine.state === 'aim') {
    fireChronoMachine();
    return true;
  }
  if (chronoMachine.state || caster.machineCooldown > 0 || !canFighterAct(caster)) return true;
  chronoMachine.state = 'rise';
  chronoMachine.t = 0;
  chronoMachine.caster = caster;
  chronoMachine.target = target;
  chronoMachine.baseY = caster.position.y;
  chronoMachine.angle = getFighterCenterX(target) >= getFighterCenterX(caster) ? 0.25 : Math.PI - 0.25;
  caster.scriptedFlight = true;
  caster.velocity.x = 0;
  caster.velocity.y = 0;
  recordSpecialUsed(caster);
  playTone({ frequency: 180, duration: 0.8, type: 'sawtooth', volume: 0.05, slideTo: 520 });
  return true;
}

function getChronoMachineMuzzle() {
  const caster = chronoMachine.caster;
  const centerX = getFighterCenterX(caster);
  const centerY = caster.position.y + 30;
  return { x: centerX + Math.cos(chronoMachine.angle) * 40, y: centerY + Math.sin(chronoMachine.angle) * 40 };
}

function distanceToBeam(pointX, pointY) {
  const muzzle = getChronoMachineMuzzle();
  const dx = Math.cos(chronoMachine.angle);
  const dy = Math.sin(chronoMachine.angle);
  const along = (pointX - muzzle.x) * dx + (pointY - muzzle.y) * dy;
  if (along < 0) return Infinity;
  return Math.abs((pointX - muzzle.x) * dy - (pointY - muzzle.y) * dx);
}

function isChronoMachineOnTheCenter() {
  return chronoMachine.target && chronoMachine.target.characterType === 'divineGeneral' && distanceToBeam(canvas.width / 2, canvas.height / 2) < 34;
}

function fireChronoMachine() {
  // first it charges: the dark world's energy gathers in the cannon
  chronoMachine.state = 'charge';
  chronoMachine.t = 0;
  chronoMachine.hit = false;
  chronoMachine.particles = [];
  chronoMachine.toCenter = isChronoMachineOnTheCenter();
  playTone({ frequency: 120, duration: 1, type: 'sawtooth', volume: 0.06, slideTo: 900 });
  playTone({ frequency: 60, duration: 1, type: 'sine', volume: 0.06, slideTo: 240 });
}

function setMachineSceneHud(hidden) {
  document.body.classList.toggle('machine-scene', hidden);
}

function updateChronoMachine() {
  const caster = player1;
  if (caster.machineCooldown > 0 && !chronoMachine.state) caster.machineCooldown -= 1;
  if (chronoMachine.scene) {
    updateChronoMachineScene();
    return;
  }
  if (!chronoMachine.state || gameOver) return;
  chronoMachine.t += 1;
  const t = chronoMachine.t;
  const target = chronoMachine.target;
  const muzzle = chronoMachine.state === 'rise' ? null : getChronoMachineMuzzle();
  if (chronoMachine.state === 'rise') {
    caster.position.y += (110 - caster.position.y) * 0.12;
    if (t >= 40) {
      chronoMachine.state = 'aim';
      chronoMachine.t = 0;
    }
  } else if (chronoMachine.state === 'aim') {
    // A / D (or W / S) turn the cannon
    caster.position.y = 110 + Math.sin(t / 12) * 4;
    if (keys.a || keys.w) chronoMachine.angle -= 0.025;
    if (keys.d || keys.s) chronoMachine.angle += 0.025;
    caster.attacksToTheRight = Math.cos(chronoMachine.angle) >= 0;
    if (t >= 240) fireChronoMachine();
  } else if (chronoMachine.state === 'charge') {
    caster.position.y = 110 + (Math.random() - 0.5) * (t / 15);
    for (let spark = 0; spark < 3; spark += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 90;
      chronoMachine.particles.push({ x: muzzle.x + Math.cos(angle) * distance, y: muzzle.y + Math.sin(angle) * distance, life: 24 });
    }
    chronoMachine.particles.forEach((spark) => {
      spark.x += (muzzle.x - spark.x) * 0.15;
      spark.y += (muzzle.y - spark.y) * 0.15;
      spark.life -= 1;
    });
    chronoMachine.particles = chronoMachine.particles.filter((spark) => spark.life > 0);
    if (t % 12 === 0) playTone({ frequency: 300 + t * 12, duration: 0.08, type: 'square', volume: 0.03 });
    if (t >= 60) {
      chronoMachine.t = 0;
      playNoise({ duration: 1.4, volume: 0.16, filterFrequency: 700 });
      playTone({ frequency: 70, duration: 1.6, type: 'sawtooth', volume: 0.1, slideTo: 35 });
      // ...the very center, against HIM: the machine won't stop
      if (chronoMachine.toCenter) {
        chronoMachine.state = 'overload';
        chronoMachine.overload = { t: 0, cracks: [] };
        setMachineSceneHud(true);
      } else {
        chronoMachine.state = 'fire';
      }
    }
  } else if (chronoMachine.state === 'fire') {
    // the recoil pushes him back
    const back = Math.cos(chronoMachine.angle) >= 0 ? -1 : 1;
    caster.position.x = Math.max(10, Math.min(canvas.width - caster.width - 10, caster.position.x + back * 0.6));
    caster.position.y = 110 + (Math.random() - 0.5) * 5;
    if (!chronoMachine.hit && t > 8 && distanceToBeam(getFighterCenterX(target), target.position.y + target.height / 2) < 55) {
      chronoMachine.hit = true;
      applyDamage(caster, target, caster.machineLight ? (caster.machineBoost ? 100 : 85) : 120, { isSpecial: true });
      target.velocity.y = -12;
      updateHealthBars();
      playSound('robotHit');
    }
    if (t % 10 === 0) playNoise({ duration: 0.2, volume: 0.05, filterFrequency: 1200 });
    if (t >= 110) {
      chronoMachine.state = 'cool';
      chronoMachine.t = 0;
    }
  } else if (chronoMachine.state === 'cool') {
    // smoke from the cannon, and down he comes
    caster.position.y += (chronoMachine.baseY - caster.position.y) * 0.08;
    if (t >= 45) endChronoMachine();
  } else if (chronoMachine.state === 'overload') {
    updateChronoMachineOverload();
  }
}

function updateChronoMachineOverload() {
  const caster = chronoMachine.caster;
  const target = chronoMachine.target;
  const overload = chronoMachine.overload;
  overload.t += 1;
  const t = overload.t;
  target.scriptedFlight = true;
  [caster, target].forEach((fighter) => {
    fighter.velocity.x = 0;
  });
  // 1) it doesn't turn off... 2) it sweeps everywhere... 3) it splits... 4) everything falls into the center
  const wild = t < 90 ? 0.01 : t < 200 ? 0.07 : 0.12;
  chronoMachine.angle += Math.sin(t / 7) * wild + (Math.random() - 0.5) * wild * 1.4;
  caster.position.y = 110 + (Math.random() - 0.5) * Math.min(14, t / 20);
  if (t === 40) showFlametombThought(caster, '...Eh? Por que no se apaga?');
  if (t === 110) showFlametombThought(caster, 'NO PARA! LA MAQUINA NO PARA!');
  if (t === 150) showFlametombThought(target, '...Esta energia...');
  if (t === 230) showFlametombThought(caster, 'ALGO LA ESTA JALANDO! DEL OTRO LADO!');
  if (t === 280) showFlametombThought(target, '...El mundo oscuro.');
  if (t > 90 && t % 20 === 0) playTone({ frequency: t % 40 === 0 ? 1400 : 1000, duration: 0.12, type: 'square', volume: 0.04 });
  if (t % 8 === 0) playNoise({ duration: 0.3, volume: 0.08, filterFrequency: 500 + Math.random() * 1500 });
  // cracks in the world, from the center
  if (t > 200 && t % 6 === 0) {
    const angle = Math.random() * Math.PI * 2;
    overload.cracks.push({ angle, length: 0, speed: 6 + Math.random() * 6 });
  }
  overload.cracks.forEach((crack) => {
    crack.length += crack.speed;
  });
  if (t === 330) {
    playTone({ frequency: 40, duration: 3, type: 'sawtooth', volume: 0.1, slideTo: 20 });
    playTone({ frequency: 2000, duration: 2.2, type: 'sine', volume: 0.03, slideTo: 3000 });
  }
  if (t === 420) {
    // the explosion: both down
    playNoise({ duration: 3, volume: 0.22, filterFrequency: 600 });
    startChronoMachineScene();
  }
}

function endChronoMachine() {
  const caster = chronoMachine.caster || player1;
  chronoMachine.state = null;
  caster.scriptedFlight = false;
  caster.velocity.y = 2;
  caster.machineCooldown = getDebugCooldown(caster.machineLight ? (caster.machineBoost ? 210 : chronoMachineLightCooldown) : chronoMachineCooldown, caster);
}

function drawChronoMachineBeam(width, color, core, angle = chronoMachine.angle) {
  const muzzle = getChronoMachineMuzzle();
  const endX = muzzle.x + Math.cos(angle) * 1500;
  const endY = muzzle.y + Math.sin(angle) * 1500;
  const time = performance.now() / 1000;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.shadowColor = '#b388ff';
  ctx.shadowBlur = 40;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(muzzle.x, muzzle.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.shadowBlur = 0;
  // the void inside the beam, with a white edge (like the portals of the dark world)
  ctx.strokeStyle = chronoMachine.caster && chronoMachine.caster.machineLight ? '#fffde7' : '#12002a';
  ctx.lineWidth = width * 0.55;
  ctx.stroke();
  ctx.strokeStyle = core;
  ctx.lineWidth = Math.max(2, width * 0.12);
  ctx.stroke();
  // rings of energy running along it
  ctx.strokeStyle = 'rgba(234, 128, 252, 0.8)';
  ctx.lineWidth = 3;
  for (let ring = 0; ring < 8; ring += 1) {
    const along = ((time * 900 + ring * 180) % 1440);
    const ringX = muzzle.x + Math.cos(angle) * along;
    const ringY = muzzle.y + Math.sin(angle) * along;
    ctx.beginPath();
    ctx.ellipse(ringX, ringY, width * 0.25, width * 0.7, angle, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawChronoMachineFx() {
  if (chronoMachine.scene) {
    drawChronoMachineScene();
    return;
  }
  if (!chronoMachine.state) return;
  const time = performance.now() / 1000;
  const muzzle = getChronoMachineMuzzle();
  if (chronoMachine.state === 'aim' || chronoMachine.state === 'rise') {
    // the aiming line (it shines when it crosses the very center... with HIM there)
    const onCenter = chronoMachine.state === 'aim' && isChronoMachineOnTheCenter();
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = onCenter ? `rgba(255, 255, 255, ${0.6 + Math.sin(time * 20) * 0.4})` : 'rgba(179, 136, 255, 0.6)';
    ctx.lineWidth = onCenter ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(muzzle.x, muzzle.y);
    ctx.lineTo(muzzle.x + Math.cos(chronoMachine.angle) * 1500, muzzle.y + Math.sin(chronoMachine.angle) * 1500);
    ctx.stroke();
    ctx.setLineDash([]);
    if (chronoMachine.state === 'aim') {
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e1bee7';
      ctx.fillText('A / D: APUNTAR   R: DISPARAR', getFighterCenterX(chronoMachine.caster), chronoMachine.caster.position.y - 30);
    }
    const glow = ctx.createRadialGradient(muzzle.x, muzzle.y, 2, muzzle.x, muzzle.y, 26);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.4, '#b388ff');
    glow.addColorStop(1, 'rgba(18, 0, 42, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(muzzle.x - 26, muzzle.y - 26, 52, 52);
    ctx.restore();
    return;
  }
  ctx.save();
  if (chronoMachine.state === 'charge') {
    const k = chronoMachine.t / 60;
    ctx.fillStyle = `rgba(10, 0, 25, ${k * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    chronoMachine.particles.forEach((spark) => {
      ctx.fillStyle = spark.life % 4 < 2 ? '#ffffff' : '#b388ff';
      ctx.fillRect(spark.x - 2, spark.y - 2, 4, 4);
    });
    const radius = 10 + k * 40;
    const glow = ctx.createRadialGradient(muzzle.x, muzzle.y, 2, muzzle.x, muzzle.y, radius);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.35, '#ea80fc');
    glow.addColorStop(1, 'rgba(18, 0, 42, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(muzzle.x - radius, muzzle.y - radius, radius * 2, radius * 2);
    // the aiming line, thin and white
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + k * 0.5})`;
    ctx.lineWidth = 1 + k * 2;
    ctx.beginPath();
    ctx.moveTo(muzzle.x, muzzle.y);
    ctx.lineTo(muzzle.x + Math.cos(chronoMachine.angle) * 1500, muzzle.y + Math.sin(chronoMachine.angle) * 1500);
    ctx.stroke();
  } else if (chronoMachine.state === 'fire') {
    const t = chronoMachine.t;
    const grow = Math.min(1, t / 10);
    const fade = t < 85 ? 1 : Math.max(0.1, 1 - (t - 85) / 25);
    if (t < 8) {
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - t / 8})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = 'rgba(10, 0, 25, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate((Math.random() - 0.5) * 6 * fade, (Math.random() - 0.5) * 6 * fade);
    const light = chronoMachine.caster && chronoMachine.caster.machineLight;
    drawChronoMachineBeam((light ? 26 + grow * 30 : 40 + grow * 50) * fade + Math.sin(t * 0.8) * 4, light ? '#ffd54f' : '#b388ff', light ? '#ffab00' : '#ffffff');
  } else if (chronoMachine.state === 'cool') {
    for (let puff = 0; puff < 4; puff += 1) {
      const rise = (chronoMachine.t * 1.5 + puff * 12) % 50;
      ctx.fillStyle = `rgba(160, 160, 170, ${0.5 - rise / 100})`;
      ctx.beginPath();
      ctx.arc(muzzle.x + puff * 4, muzzle.y - rise, 6 + rise / 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (chronoMachine.state === 'overload') {
    const overload = chronoMachine.overload;
    const t = overload.t;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.fillStyle = `rgba(30, 0, 60, ${0.15 + (t / 420) * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate((Math.random() - 0.5) * Math.min(20, t / 15), (Math.random() - 0.5) * Math.min(20, t / 15));
    const width = 70 + t * 0.25 + Math.random() * 20;
    drawChronoMachineBeam(width, Math.random() < 0.5 ? '#b388ff' : '#ea80fc', '#ffffff');
    // it splits
    if (t > 200) {
      drawChronoMachineBeam(width * 0.5, '#7c4dff', '#ffffff', chronoMachine.angle + 0.5 + Math.sin(t / 9) * 0.3);
      drawChronoMachineBeam(width * 0.5, '#7c4dff', '#ffffff', chronoMachine.angle - 0.5 - Math.sin(t / 11) * 0.3);
    }
    // sparks from the machine
    if (t > 90) {
      const caster = chronoMachine.caster;
      for (let spark = 0; spark < 4; spark += 1) {
        ctx.fillStyle = spark % 2 ? '#ffeb3b' : '#ffffff';
        ctx.fillRect(getFighterCenterX(caster) + (Math.random() - 0.5) * 60, caster.position.y + 20 + (Math.random() - 0.5) * 40, 3, 3);
      }
    }
    // the world cracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2;
    overload.cracks.forEach((crack) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      let px = centerX;
      let py = centerY;
      for (let step = 1; step <= 6; step += 1) {
        px = centerX + Math.cos(crack.angle + Math.sin(step * 3) * 0.2) * crack.length * (step / 6);
        py = centerY + Math.sin(crack.angle + Math.sin(step * 3) * 0.2) * crack.length * (step / 6);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    // everything falls into the center
    if (t > 330) {
      const k = (t - 330) / 90;
      const voidGlow = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 30 + k * 300);
      voidGlow.addColorStop(0, '#000000');
      voidGlow.addColorStop(0.6, '#12002a');
      voidGlow.addColorStop(1, 'rgba(179, 136, 255, 0)');
      ctx.fillStyle = voidGlow;
      ctx.fillRect(centerX - 340, centerY - 340, 680, 680);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, (t - 380) / 40)})`;
      ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
    }
  }
  ctx.restore();
}

// how he looks with the machine: a cannon on his shoulder, a strap, a purple core. Still Chrono.
function drawChronoMachineGear(fighter) {
  const time = performance.now() / 1000;
  const dir = fighter.attacksToTheRight ? 1 : -1;
  const x = fighter.position.x;
  const y = fighter.position.y;
  const w = fighter.width;
  const shoulderX = dir > 0 ? x + w - 10 : x + 10;
  ctx.save();
  // the strap across the chest
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + (dir > 0 ? 6 : w - 6), y + 70);
  ctx.lineTo(shoulderX, y + 22);
  ctx.stroke();
  // the cannon
  ctx.translate(shoulderX, y + 18);
  const aim = chronoMachine.state && chronoMachine.caster === fighter ? chronoMachine.angle : (dir > 0 ? 0 : Math.PI);
  ctx.rotate(aim);
  ctx.fillStyle = '#37474f';
  ctx.fillRect(-14, -9, 28, 18);
  ctx.fillStyle = '#263238';
  ctx.fillRect(10, -6, 26, 12);
  ctx.fillStyle = '#90a4ae';
  ctx.fillRect(34, -7, 4, 14);
  // the core: the color of the dark world
  ctx.fillStyle = `rgba(179, 136, 255, ${0.7 + Math.sin(time * 6) * 0.3})`;
  ctx.shadowColor = '#b388ff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // a little antenna
  ctx.strokeStyle = '#90a4ae';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -9);
  ctx.lineTo(-12, -20);
  ctx.stroke();
  ctx.fillStyle = '#ea80fc';
  ctx.fillRect(-14, -23, 4, 4);
  ctx.restore();
}

// ---------- after the explosion: the portal ----------
const chronoMachineSceneLines = [
  { frames: 200, black: true },
  { speaker: 'CHRONO', color: '#448aff', text: '...' },
  { speaker: 'CHRONO', color: '#448aff', text: '...Ugh. Mis engranajes... todos... desordenados.' },
  { speaker: 'CHRONO', color: '#448aff', text: 'Que... que paso? La maquina... se volvio loca. Como si algo la jalara desde adentro.', chronoUp: true },
  { speaker: 'CHRONO', color: '#448aff', text: 'Y el general...? ...Sigue respirando. Bien. Creo.', chronoUp: true },
  { speaker: 'CHRONO', color: '#448aff', text: '...', chronoUp: true, portal: true },
  { speaker: 'CHRONO', color: '#448aff', text: 'Eso es... una grieta. Una grieta en el TIEMPO.', chronoUp: true, portal: true },
  { speaker: 'CHRONO', color: '#448aff', text: 'Puedo escucharlo. Del otro lado hay algo... algo que se repite. Una y otra vez. Como un reloj atascado.', chronoUp: true, portal: true },
  { speaker: 'CHRONO', color: '#448aff', text: 'Tempus Corp. siempre quiso saber que hay del otro lado. ...Supongo que voy a ser el primero.', chronoUp: true, portal: true },
  { speaker: 'CHRONO', color: '#448aff', text: 'Si no vuelvo... que alguien le diga al vendedor de lentes que le debo una maquina.', chronoUp: true, portal: true, chronoIn: true },
  { speaker: 'DIVINE GENERAL', color: '#ffd54f', text: '......', portal: true, chronoGone: true, divineUp: true },
  { speaker: 'DIVINE GENERAL', color: '#ffd54f', text: '...Esa energia. La conozco.', portal: true, chronoGone: true, divineUp: true },
  { speaker: 'DIVINE GENERAL', color: '#ffd54f', text: '...Hace mucho que no la sentia. Desde antes de que este reino tuviera nombre.', portal: true, chronoGone: true, divineUp: true, divineIn: true },
  { frames: 300, portalClose: true, chronoGone: true, divineGone: true, done: true },
];
// (each line stays as long as it takes to read it... and a little more)
chronoMachineSceneLines.forEach((line) => {
  if (!line.frames) line.frames = Math.round(Math.max(200, line.text.length * 3.4 + 150));
});

function startChronoMachineScene() {
  const caster = chronoMachine.caster;
  const target = chronoMachine.target;
  chronoMachine.state = null;
  chronoMachine.scene = {
    index: 0,
    t: 0,
    flash: 1,
    portal: 0,
    chronoX: getFighterCenterX(caster) - caster.width / 2,
    divineX: getFighterCenterX(target) - target.width / 2,
    chronoUp: 0,
    divineUp: 0,
    chronoIn: 0,
    divineIn: 0,
  };
  // the real ones step out of the picture: the scene draws them
  [caster, target].forEach((fighter) => {
    fighter.scriptedFlight = true;
    fighter.position.x = -3000;
    fighter.position.y = ground - fighter.height;
  });
  stopReflecterBattleMusic();
}

function updateChronoMachineScene() {
  const scene = chronoMachine.scene;
  const line = chronoMachineSceneLines[scene.index];
  scene.t += 1;
  scene.flash = Math.max(0, scene.flash - 0.01);
  if (line.chronoUp) scene.chronoUp = Math.min(1, scene.chronoUp + 0.03);
  if (line.divineUp) scene.divineUp = Math.min(1, scene.divineUp + 0.03);
  if (line.portal) scene.portal = Math.min(1, scene.portal + 0.015);
  if (line.portalClose) scene.portal = Math.max(0, scene.portal - 0.01);
  const portalX = canvas.width / 2;
  if (line.chronoIn) {
    scene.chronoX += (portalX - player1.width / 2 - scene.chronoX) * 0.02;
    if (scene.t > 160) scene.chronoIn = Math.min(1, scene.chronoIn + 0.02);
  }
  if (line.chronoGone) scene.chronoIn = 1;
  if (line.divineIn) {
    scene.divineX += (portalX - player2.width / 2 - scene.divineX) * 0.025;
    if (scene.t > 120) scene.divineIn = Math.min(1, scene.divineIn + 0.02);
  }
  if (line.divineGone) scene.divineIn = 1;
  if (line.portal && scene.t === 1 && !scene.portalSound) {
    scene.portalSound = true;
    playTone({ frequency: 90, duration: 2.5, type: 'sawtooth', volume: 0.05, slideTo: 60 });
    playTone({ frequency: 880, duration: 2.5, type: 'sine', volume: 0.02, slideTo: 860 });
  }
  if (line.done && scene.t === 60) {
    try {
      localStorage.setItem(rareMachineUsedKey, '1');
    } catch (error) {
      // only this session
    }
    if (typeof syncChronoChapterCard === 'function') syncChronoChapterCard();
    showCustomToast('REQUISITO CUMPLIDO', 'Capitulo 6: "Usar la Maquina Rara". Chrono cruzo la grieta... y no fue solo.');
    playSound('achievement');
  }
  if (scene.t >= line.frames) {
    scene.t = 0;
    scene.index += 1;
    if (scene.index >= chronoMachineSceneLines.length) {
      chronoMachine.scene = null;
      setMachineSceneHud(false);
      // they're on the other side now: nobody can pick them
      if (player1.characterType === 'chrono') player1.setCharacterType('normal');
      if (player2.characterType === 'divineGeneral' || player2.characterType === 'chrono') player2.setCharacterType('normal');
      syncRiftLostCharacters();
      player1.scriptedFlight = false;
      player2.scriptedFlight = false;
      returnToMenu();
    }
  }
}

function drawChronoMachineScene() {
  const scene = chronoMachine.scene;
  const line = chronoMachineSceneLines[scene.index] || {};
  const time = performance.now() / 1000;
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // the portal of the dark world, in the very center
  if (scene.portal > 0) {
    const portalX = canvas.width / 2;
    const portalY = ground - 110;
    const height = 170 * scene.portal;
    const width = 70 * scene.portal;
    const glow = ctx.createRadialGradient(portalX, portalY, 10, portalX, portalY, 200 * scene.portal);
    glow.addColorStop(0, 'rgba(179, 136, 255, 0.5)');
    glow.addColorStop(1, 'rgba(179, 136, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(portalX - 220, portalY - 220, 440, 440);
    ctx.beginPath();
    for (let point = 0; point <= 24; point += 1) {
      const angle = (point / 24) * Math.PI * 2;
      const jag = 1 + Math.sin(angle * 7 + time * 4) * 0.08;
      const px = portalX + Math.cos(angle) * width * jag;
      const py = portalY + Math.sin(angle) * height * jag;
      if (point === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    const voidFill = ctx.createLinearGradient(portalX - width, 0, portalX + width, 0);
    voidFill.addColorStop(0, '#12002a');
    voidFill.addColorStop(0.5, '#000000');
    voidFill.addColorStop(1, '#12002a');
    ctx.fillStyle = voidFill;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  // Chrono and the general: on the floor... then up... then into the portal
  const drawActor = (fighter, x, up, gone) => {
    if (gone >= 1) return;
    ctx.save();
    ctx.globalAlpha = 1 - gone;
    const centerX = x + fighter.width / 2;
    const scale = 1 - gone * 0.6;
    ctx.translate(centerX, ground);
    ctx.scale(scale, scale);
    ctx.translate(0, -(fighter.width / 2) * (1 - up));
    ctx.rotate(-Math.PI / 2 * (1 - up));
    fighter.position = { x: -fighter.width / 2, y: -fighter.height - (fighter === player1 ? up * 40 : 0) };
    fighter.isAttacking = false;
    fighter.draw();
    ctx.restore();
    fighter.position = { x: -3000, y: ground - fighter.height };
  };
  drawActor(player1, scene.chronoX, scene.chronoUp, scene.chronoIn);
  drawActor(player2, scene.divineX, scene.divineUp, scene.divineIn);
  // the words
  if (line.text) {
    ctx.fillStyle = 'rgba(8, 8, 14, 0.92)';
    ctx.fillRect(56, 70, canvas.width - 112, 110);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(56, 70, canvas.width - 112, 110);
    ctx.fillStyle = line.color;
    ctx.fillRect(76, 58, 220, 26);
    ctx.fillStyle = '#111';
    ctx.font = '900 16px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(line.speaker, 186, 77);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 19px Arial, sans-serif';
    const shown = line.text.slice(0, Math.floor(scene.t * 0.9));
    const words = shown.split(' ');
    let row = '';
    let rowY = 116;
    words.forEach((word) => {
      if (ctx.measureText(`${row}${word} `).width > canvas.width - 170) {
        ctx.fillText(row, 84, rowY);
        row = '';
        rowY += 28;
      }
      row += `${word} `;
    });
    ctx.fillText(row, 84, rowY);
  }
  if (line.black) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (line.done && scene.t > 40) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (scene.t - 40) / 80)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '900 24px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b388ff';
    ctx.fillText('REQUISITO CUMPLIDO: USAR LA MAQUINA RARA', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
  if (scene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${scene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

// ---------- Chrono and Divine General crossed the rift: locked until chapter 6 is finished ----------
const riftLostCharacters = ['chrono', 'divineGeneral'];

function isRiftLostCharacter(characterType) {
  if (!riftLostCharacters.includes(characterType) || !isRareMachineUsed()) return false;
  return !(typeof isArcadeChapterDone === 'function' && isArcadeChapterDone('chrono'));
}

function syncRiftLostCharacters() {
  // the statistics: their rows crossed out, in a dark aura
  ['chrono', 'divineGeneral'].forEach((characterType) => {
    const row = document.querySelector(`[data-stats-character="${characterType}"]`);
    if (row) row.classList.toggle('rift-lost-row', isRiftLostCharacter(characterType));
  });
  // Chrono Potenciado (BOSSRUSH) is gone too
  if (chronoBoostCharacterButton) {
    const lost = isRiftLostCharacter('chrono');
    chronoBoostCharacterButton.classList.toggle('rift-lost', lost);
    if (lost) chronoBoostCharacterButton.disabled = true;
    else if (chronoBoostCharacterButton.dataset.riftWasLost) chronoBoostCharacterButton.disabled = false;
    if (lost) chronoBoostCharacterButton.dataset.riftWasLost = '1';
  }
  [[chronoCharacterButton, 'chrono'], [divineGeneralCharacterButton, 'divineGeneral']].forEach(([button, characterType]) => {
    if (!button) return;
    const lost = isRiftLostCharacter(characterType);
    button.classList.toggle('rift-lost', lost);
    if (lost) {
      button.classList.add('locked');
      button.disabled = true;
      button.title = 'Cruzo la grieta al mundo oscuro. Vuelve al terminar el capitulo 6.';
    } else if (button.dataset.riftWasLost) {
      // (back from the rift: the normal unlock rules again)
      button.classList.remove('locked');
      button.disabled = false;
      if (characterType === 'divineGeneral' && typeof syncDivineGeneralUnlockUI === 'function') syncDivineGeneralUnlockUI();
    }
    if (lost) button.dataset.riftWasLost = '1';
  });
}

syncRiftLostCharacters();
setInterval(syncRiftLostCharacters, 1500);

// ---------- while Chrono is in the rift: Tempus Corp. hired a replacement ----------
const tempusSwitcherGreetings = [
  'Bienvenido al Mercado de Tempus! Soy Switcher, el reemplazo. Chrono se fue de viaje. Lejos. MUY lejos.',
  'Tempus Corp. me dio un manual de 400 paginas. Lei la primera. Preguntame lo que quieras! (no se nada)',
  'Cambio de modo: VENDEDOR! ...Esto es mas dificil que pelear.',
  'Si buscas a Chrono... dejo una nota que dice "no toquen mis engranajes". Asi que no los toques.',
  'Me pagan por hora. Pero aca las horas andan raro. Creo que me deben como tres semanas.',
];
const tempusSwitcherHints = [
  'El reloj anda para atras. Chrono decia que eso era normal. Yo creo que esta roto.',
  'Chrono dejo escrito: "si el reloj se detiene, no esta roto, esta esperando". Esperando que?',
  'A veces el reloj hace tic tac... y otras veces hace un ruido como de grieta. No me gusta ese.',
  'Hoy el reloj marco las 13:61. Lo anote por las dudas.',
];

function isTempusSwitcherShift() {
  return typeof isRiftLostCharacter === 'function' && isRiftLostCharacter('chrono');
}

function tempusVoice(chronoLine, switcherLine) {
  return isTempusSwitcherShift() ? switcherLine : chronoLine;
}

// (almost the same shop: only the one behind the counter changes, and a little green)
function syncTempusShift() {
  if (!tempusScreen) return;
  const switcher = isTempusSwitcherShift();
  tempusScreen.classList.toggle('tempus-switcher', switcher);
  const kicker = tempusScreen.querySelector('.tempus-kicker');
  if (kicker) kicker.textContent = switcher ? 'MERCADO DE TEMPUS - atendido por SWITCHER (reemplazo temporal)' : 'MERCADO DE TEMPUS - atendido por CHRONO';
  const note = tempusScreen.querySelector('.tempus-footer span');
  if (note) note.textContent = switcher
    ? '*Chrono no esta disponible. Tempus Corp. contrato un reemplazo temporal. No se aceptan reclamos (el reemplazo no sabe donde se anotan).'
    : '*Tempus Corp. no se responsabiliza por paradojas, dias repetidos ni recuerdos de cosas que no pasaron.';
}

// while he floats with the machine, its field takes most of the hits (70% less damage)
function chronoMachineDamageTaken(target) {
  return target === player1 && chronoMachine.state && chronoMachine.caster === target ? 0.3 : 1;
}

// ---------- rewinding the Rare Machine has a price: Scammer remembers ----------
// After the machine went back through Chrono's gears, every fight against Scammer or Neo Scammer
// costs coins: a lot if you lose, a "commission" even if you win. Twice rewound: he charges more.
// He only goes after the rich (the millions that the rewound machine paid back):
// more than 1.000.000 coins: the whole fine; more than 500.000: a much smaller one; less: nothing.
const scammerGrudgeFines = {
  1: { lose: 0.1, loseMax: 100000, win: 0.03, winMax: 30000 },
  2: { lose: 0.18, loseMax: 200000, win: 0.06, winMax: 60000 },
};
const scammerFineFullBalance = 1000000;
const scammerFineSmallBalance = 500000;
const scammerFineSmallScale = 0.25;
const scammerFineLoseLines = [
  'REBOBINASTE MI MAQUINA Y ENCIMA PERDES? ESO TIENE UN [[COSTO]], KID.',
  'EL TIEMPO ES ORO. Y EL ORO... ES MIO. [[SIN DEVOLUCIONES]].',
  'TE ACORDAS DE LA MAQUINA RARA? YO SI. TODOS LOS DIAS.',
  'PERDISTE CONTRA EL [[MEJOR VENDEDOR]] DEL MUNDO. LA LECCION SE COBRA.',
];
const scammerFineWinLines = [
  'GANASTE... PERO IGUAL TE COBRO LA [[COMISION]] POR LA MAQUINA.',
  'BIEN JUGADO, KID. AHORA PAGA EL [[IMPUESTO AL REBOBINADO]].',
  'UNA VICTORIA LIMPIA! MENOS EL CARGO POR [[SERVICIO]], CLARO.',
];

function getScammerGrudgeFine(won) {
  const rewinds = Math.min(2, (typeof tempusMarket !== 'undefined' && tempusMarket.machineRewinds) || 0);
  const fine = scammerGrudgeFines[rewinds];
  if (!fine) return 0;
  const balance = coinWallet.balance;
  if (balance < scammerFineSmallBalance) return 0;
  const scale = balance > scammerFineFullBalance ? 1 : scammerFineSmallScale;
  const ratio = won ? fine.win : fine.lose;
  const amount = Math.round(Math.min(won ? fine.winMax : fine.loseMax, balance * ratio) * scale);
  return Math.min(balance, amount);
}

function chargeScammerGrudgeFine(winnerPlayer) {
  const rival = player2;
  const neo = isNeoScammer(rival);
  if (!neo && !(isScammer(rival) && !rival.youngScammer)) return;
  const won = winnerPlayer === player1;
  const amount = getScammerGrudgeFine(won);
  if (amount <= 0) return;
  coinWallet.balance -= amount;
  saveCoinWallet();
  syncCoinWalletUI();
  const lines = won ? scammerFineWinLines : scammerFineLoseLines;
  const line = lines[Math.floor(Math.random() * lines.length)];
  setTimeout(() => {
    showCustomToast(`${neo ? 'NEO SCAMMER' : 'SCAMMER'}: -${amount.toLocaleString('es-ES')} MONEDAS`, `"${line}"`);
    // (it's not an achievement: it's a fine)
    const label = document.querySelector('[data-i18n="achievementToastLabel"]');
    if (label) {
      const original = label.textContent;
      label.textContent = 'Multa por rebobinar';
      setTimeout(() => {
        label.textContent = original;
      }, 4000);
    }
    playSound(won ? 'cutsceneCash' : 'cutsceneAngry');
  }, 2600);
}

(function scammerRemembersTheRewind() {
  const baseAchievements = updateFightAchievements;
  updateFightAchievements = function updateFightAchievementsAndFines(winnerPlayer, ...rest) {
    const result = baseAchievements.call(this, winnerPlayer, ...rest);
    chargeScammerGrudgeFine(winnerPlayer);
    return result;
  };
})();
