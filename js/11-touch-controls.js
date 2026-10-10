// Moquete - Controles tactiles (celular / tablet)
// Un joystick y botones en pantalla que "aprietan" las mismas teclas que el teclado.
// Se activan solos en pantallas tactiles (o con ?touch=1 en la direccion).

const touchControls = { enabled: false, held: {}, stick: null };

function isTouchDevice() {
  let forced = false;
  try {
    forced = new URLSearchParams(location.search).get('touch') === '1' || localStorage.getItem('moqueteTouchForce') === '1';
  } catch (error) {
    forced = false;
  }
  if (forced) return true;
  return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.matchMedia('(pointer: coarse)').matches;
}

// pressing and releasing a key, exactly like the keyboard does
function touchKey(key, down) {
  if (Boolean(touchControls.held[key]) === down) return;
  touchControls.held[key] = down;
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key, bubbles: true, cancelable: true }));
}

// down on the stick only matters inside the boxes (dodging); in a fight S is the attack button
function isTouchBoxMode() {
  return (typeof dodgeRound !== 'undefined' && dodgeRound.active) ||
    (typeof scamFinal !== 'undefined' && scamFinal.active) ||
    (typeof jesterFinal !== 'undefined' && jesterFinal.active) ||
    (typeof omegariusFinal !== 'undefined' && omegariusFinal.active) ||
    (typeof farolClimb !== 'undefined' && farolClimb.active);
}

function buildTouchControls() {
  const root = document.createElement('div');
  root.className = 'touch-controls';
  root.innerHTML = `
    <div class="touch-stick" aria-label="Joystick">
      <div class="touch-stick-knob"></div>
    </div>
    <div class="touch-buttons">
      <button type="button" class="touch-btn touch-attack" data-key="s">GOLPE</button>
      <button type="button" class="touch-btn touch-strong" data-key="e">FUERTE</button>
      <button type="button" class="touch-btn touch-jump" data-key="w">SALTO</button>
      <button type="button" class="touch-btn touch-skill touch-q" data-key="q">Q</button>
      <button type="button" class="touch-btn touch-skill touch-f" data-key="f">F</button>
      <button type="button" class="touch-btn touch-skill touch-r" data-key="r">R</button>
    </div>
    <div class="touch-top">
      <button type="button" class="touch-btn touch-small" data-key="Enter">ENTER &#9654;</button>
      <button type="button" class="touch-btn touch-small" data-key="Escape">ESC</button>
      <button type="button" class="touch-btn touch-small touch-menu" data-menu="1">MENU</button>
      <button type="button" class="touch-btn touch-small touch-hide" data-toggle="1">&#127918;</button>
    </div>`;
  document.body.appendChild(root);

  // buttons: pressed while the finger is on them (several fingers = combos like Q+F)
  root.querySelectorAll('[data-key]').forEach((button) => {
    const key = button.dataset.key;
    const press = (event) => {
      event.preventDefault();
      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        // (some browsers refuse; the button still works)
      }
      button.classList.add('pressed');
      touchKey(key, true);
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove('pressed');
      touchKey(key, false);
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
  root.querySelector('[data-toggle]').addEventListener('click', () => root.classList.toggle('collapsed'));
  // leaving the fight: tap MENU, then tap again to confirm
  const menuButton = root.querySelector('[data-menu]');
  let confirmTimer = null;
  menuButton.addEventListener('click', () => {
    if (!menuButton.classList.contains('confirm')) {
      menuButton.classList.add('confirm');
      menuButton.textContent = 'SALIR?';
      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(() => {
        menuButton.classList.remove('confirm');
        menuButton.textContent = 'MENU';
      }, 2500);
      return;
    }
    clearTimeout(confirmTimer);
    menuButton.classList.remove('confirm');
    menuButton.textContent = 'MENU';
    Object.keys(touchControls.held).forEach((key) => touchKey(key, false));
    if (typeof endHardcoreRun === 'function') endHardcoreRun();
    returnToMenu();
  });

  // the stick: left / right to walk, up to jump, down to dodge down (in the boxes)
  const stick = root.querySelector('.touch-stick');
  const knob = root.querySelector('.touch-stick-knob');
  let activeId = null;
  const moveStick = (event) => {
    const rect = stick.getBoundingClientRect();
    const radius = rect.width / 2;
    let dx = (event.clientX - (rect.left + radius)) / radius;
    let dy = (event.clientY - (rect.top + radius)) / radius;
    const length = Math.hypot(dx, dy);
    if (length > 1) {
      dx /= length;
      dy /= length;
    }
    knob.style.transform = `translate(${dx * radius * 0.55}px, ${dy * radius * 0.55}px)`;
    touchKey('a', dx < -0.35);
    touchKey('d', dx > 0.35);
    touchKey('w', dy < -0.55);
    touchKey('s', dy > 0.55 && isTouchBoxMode());
  };
  const releaseStick = () => {
    activeId = null;
    knob.style.transform = '';
    ['a', 'd', 'w'].forEach((key) => touchKey(key, false));
    if (touchControls.held.s && !root.querySelector('.touch-attack.pressed')) touchKey('s', false);
  };
  stick.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    activeId = event.pointerId;
    try {
        stick.setPointerCapture(event.pointerId);
      } catch (error) {
        // (some browsers refuse; the button still works)
      }
    moveStick(event);
  });
  stick.addEventListener('pointermove', (event) => {
    if (event.pointerId === activeId) moveStick(event);
  });
  stick.addEventListener('pointerup', releaseStick);
  stick.addEventListener('pointercancel', releaseStick);

  const rotate = document.createElement('div');
  rotate.className = 'touch-rotate';
  rotate.innerHTML = '<div><span>&#8635;</span><strong>Gira el celular</strong><p>Moquete se juega con la pantalla acostada.</p></div>';
  document.body.appendChild(rotate);
}

// the game is 1024 x 576: on a phone it is scaled to fill the screen (no gray border, no gray outside)
function fitTouchShell() {
  if (!touchControls.enabled) return;
  const shell = document.querySelector('.game-shell');
  if (!shell) return;
  const width = 1024;
  const height = 576;
  const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
  shell.style.transform = `scale(${scale})`;
  shell.style.left = `${Math.round((window.innerWidth - width * scale) / 2)}px`;
  shell.style.top = `${Math.round((window.innerHeight - height * scale) / 2)}px`;
}

function initTouchControls() {
  if (!isTouchDevice()) return;
  touchControls.enabled = true;
  document.body.classList.add('touch-mode');
  // a wide virtual screen, so the phone uses the same layout as a computer (then the game is scaled to fit)
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    viewport.setAttribute('content', 'width=1100, user-scalable=no, viewport-fit=cover');
  }
  buildTouchControls();
  fitTouchShell();
  window.addEventListener('resize', fitTouchShell);
  window.addEventListener('orientationchange', () => setTimeout(fitTouchShell, 200));
  // on the result screen the stick and the buttons step aside (so its own buttons can be tapped)
  setInterval(() => {
    document.body.classList.toggle('touch-over', typeof gameOver !== 'undefined' && gameOver);
  }, 150);
  // let go of everything if the app goes to the background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Object.keys(touchControls.held).forEach((key) => touchKey(key, false));
  });
}

initTouchControls();

// ---------- secret codes without a keyboard: tap the MOQUETE title ----------
function openCodeEntry() {
  let overlay = document.querySelector('.code-entry-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'moquete-book-overlay code-entry-overlay hidden';
    overlay.innerHTML = `
      <form class="code-entry" autocomplete="off">
        <h3>Escribir un codigo</h3>
        <input type="text" maxlength="32" placeholder="codigo secreto..." autocapitalize="off" autocorrect="off" spellcheck="false" />
        <p class="code-entry-result"></p>
        <div class="code-entry-actions">
          <button type="submit">USAR</button>
          <button type="button" data-code-close="1">CERRAR</button>
        </div>
      </form>`;
    const form = overlay.querySelector('form');
    const input = overlay.querySelector('input');
    const result = overlay.querySelector('.code-entry-result');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const code = input.value.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!code) return;
      // the code goes through the same reader as the keyboard, letter by letter
      menuSecretBuffer = '';
      const fake = { target: document.body };
      code.split('').forEach((letter) => handleMenuSecretInput({ ...fake, key: letter }));
      const worked = menuSecretBuffer === '';
      menuSecretBuffer = '';
      result.textContent = worked ? 'Codigo aceptado.' : 'No paso nada... (o todavia no podes usar ese codigo)';
      result.classList.toggle('ok', worked);
      input.value = '';
      if (worked) setTimeout(() => overlay.classList.add('hidden'), 900);
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || (event.target.dataset && event.target.dataset.codeClose)) overlay.classList.add('hidden');
    });
    document.body.appendChild(overlay);
  }
  overlay.querySelector('.code-entry-result').textContent = '';
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.querySelector('input').focus(), 50);
}

document.querySelectorAll('#mainMenu h1').forEach((title) => {
  title.classList.add('code-entry-title');
  title.title = 'Tocar para escribir un codigo';
  title.addEventListener('click', openCodeEntry);
});

// ---------- secret abilities: one button per key combination of the current character ----------
function getTouchSecretCombos(fighter) {
  if (!fighter) return [];
  const type = fighter.characterType;
  const variant = fighter.secretVariant;
  if (variant === 'neoScammer') return [{ keys: ['q', 'f', 'r'], name: 'Ultima oferta' }];
  if (variant === 'shadowJester') return [
    { keys: ['q', 'f'], name: 'Anillo de cartas' },
    { keys: ['q', 'r'], name: 'Tormenta' },
    { keys: ['f', 'r'], name: 'Acto final' },
  ];
  if (variant === 'shaolinMaster') return [{ keys: ['q', 'f'], name: 'Puños' }];
  if (typeof isOmegarius === 'function' && isOmegarius(fighter)) return [
    { keys: ['f', 'r'], name: 'Disparo secreto' },
    { keys: ['q', 'f'], name: 'Acto final' },
  ];
  if (type === 'lightWarrior') {
    const combos = [{ keys: ['q', 'f'], name: 'Rayo' }, { keys: ['f', 'r'], name: 'Puño radiante', hold: true }];
    if (variant === 'omega') combos.push({ keys: ['q', 'f', 'r'], name: 'Omega' });
    return combos;
  }
  if (type === 'fireMaster' && fighter.frostFire && fighter.miniFlametomb) return [{ keys: ['q', 'r'], name: 'Mini Flametomb' }];
  if (type === 'fireMaster' && variant !== 'iceMaster') return [{ keys: ['q', 'f'], name: 'Fuego secreto' }];
  if (type === 'sorcerer') return [{ keys: ['q', 'f'], name: 'Esfera azul' }];
  if (type === 'divineGeneral') return [{ keys: ['q', 'f'], name: 'Corte del mundo' }];
  if (type === 'chrono' && variant !== 'chronoRival') return [{ keys: ['q', 'f'], name: 'Parar el tiempo' }];
  if (type === 'gambler' && !variant) return [{ keys: ['q', 'f'], name: 'Dados cargados' }];
  return [];
}

let touchSecretSignature = '';

function syncTouchSecretButtons() {
  if (!touchControls.enabled) return;
  const root = document.querySelector('.touch-controls');
  if (!root) return;
  let box = root.querySelector('.touch-secrets');
  if (!box) {
    box = document.createElement('div');
    box.className = 'touch-secrets';
    root.appendChild(box);
  }
  const combos = typeof player1 !== 'undefined' ? getTouchSecretCombos(player1) : [];
  const signature = combos.map((combo) => combo.keys.join('') + combo.name).join('|');
  if (signature === touchSecretSignature) return;
  touchSecretSignature = signature;
  box.innerHTML = combos.map((combo, index) => `
    <button type="button" class="touch-btn touch-secret" data-secret="${index}">
      <b>${combo.keys.map((key) => key.toUpperCase()).join('+')}</b><span>${combo.name}</span>
    </button>`).join('');
  box.querySelectorAll('[data-secret]').forEach((button) => {
    const combo = combos[Number(button.dataset.secret)];
    const press = (event) => {
      event.preventDefault();
      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        // (some browsers refuse; the button still works)
      }
      button.classList.add('pressed');
      // the keys go down one after the other, like pressing them together
      combo.keys.forEach((key) => touchKey(key, false));
      combo.keys.forEach((key) => touchKey(key, true));
      if (!combo.hold) setTimeout(() => combo.keys.forEach((key) => touchKey(key, false)), 120);
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove('pressed');
      if (combo.hold) combo.keys.forEach((key) => touchKey(key, false));
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
}

setInterval(syncTouchSecretButtons, 300);

// ---------- Super Fire Master without a right click ----------
// on phones: hold Fire Master's card for half a second, or tap the little SUPER tab
function setupTouchSuperFireMaster() {
  if (typeof fireMasterCharacterButton === 'undefined' || !fireMasterCharacterButton) return;
  const button = fireMasterCharacterButton;
  let holdTimer = null;
  let longPressed = false;
  const pickSuper = () => {
    if (!isSuperFireMasterUnlocked()) {
      showCustomToast('SUPER FIRE MASTER', 'Todavia bloqueado: gana Mana Meltdown con Fire Master en menos de 45 segundos y con 80+ de vida.');
      return;
    }
    selectCharacter('fireMaster', 'superFireMaster');
  };
  button.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    longPressed = false;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      longPressed = true;
      if (navigator.vibrate) navigator.vibrate(30);
      pickSuper();
    }, 550);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => button.addEventListener(name, () => clearTimeout(holdTimer)));
  // (after a long press, the normal tap that follows does not pick the normal Fire Master)
  button.addEventListener('click', (event) => {
    if (!longPressed) return;
    longPressed = false;
    event.stopImmediatePropagation();
    event.preventDefault();
  }, true);
  // the SUPER tab on the card (only on touch screens, only once unlocked)
  const tab = document.createElement('span');
  tab.className = 'touch-super-tab';
  tab.textContent = 'SUPER';
  tab.setAttribute('role', 'button');
  tab.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    pickSuper();
  });
  button.appendChild(tab);
  const sync = () => tab.classList.toggle('hidden', !touchControls.enabled || !isSuperFireMasterUnlocked());
  sync();
  setInterval(sync, 1500);
}

setupTouchSuperFireMaster();
