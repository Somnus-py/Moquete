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
    return { owned: saved.owned || {}, visits: saved.visits || 0, rewinds: saved.rewinds || 0, machineRewinds: saved.machineRewinds || 0 };
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
        ? `Puedo llevar cualquier compra de ese vendedor al momento antes de hacerla. Te devuelvo el ${Math.round(tempusRewindRatio * 100)}%. El resto... se pierde en el tiempo.`
        : 'Productos exclusivos de Tempus Corp. No los vas a encontrar en ningun contenedor.');
      playSound('menuMove');
      return;
    }
    const buy = event.target.closest('[data-tempus-buy]');
    if (buy) {
      buyTempusItem(buy.dataset.tempusBuy);
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
    return `
      <div class="tempus-item${owned ? ' owned' : ''}">
        <span class="tempus-icon tempus-icon-${item.id}" aria-hidden="true"></span>
        <strong>${item.name}</strong>
        <p>${item.description}</p>
        <span class="tempus-price">${item.price.toLocaleString('es-ES')} monedas</span>
        <button type="button" data-tempus-buy="${item.id}" ${owned ? 'disabled' : ''}>${owned ? 'COMPRADO' : 'COMPRAR'}</button>
      </div>`;
  }).join('');
  // everything bought from Scammer (once) can be rewound
  const rewindable = scammerShopItems.filter((item) => scammerShop.owned[item.id] && !item.repeatable && !item.grudgeOnly);
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
  if (!item || hasTempusItem(id)) return;
  if (coinWallet.balance < item.price) {
    tempusSay('No te alcanza. Vuelve cuando el tiempo te haya dado mas monedas.');
    playTone({ frequency: 180, duration: 0.3, type: 'square', volume: 0.04 });
    return;
  }
  coinWallet.balance -= item.price;
  saveCoinWallet();
  syncCoinWalletUI();
  tempusMarket.owned[id] = true;
  saveTempusMarket();
  tempusSay(item.line);
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
      : `El ${item.name}... va a volver al momento antes de que lo compraras. Tocá otra vez para confirmar.`);
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
    tempusSay(`Listo. Para el universo, nunca compraste el ${item.name}. Para tu billetera: +${refund.toLocaleString('es-ES')}.`);
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
  tempusSay(tempusMarket.visits === 1
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
    const actor = tempusChronoActor;
    actor.position = { x: size.width / 2 - actor.width / 2, y: size.height / 2 - actor.height / 2 + Math.sin(time * 2) * 6 };
    actor.attacksToTheRight = true;
    actor.isAttacking = false;
    actor.chronoAuraBoost = 0;
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
      showCustomToast('CHRONO DICE...', tempusHints[Math.floor(Math.random() * tempusHints.length)]);
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
