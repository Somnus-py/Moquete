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
      button.setPointerCapture && button.setPointerCapture(event.pointerId);
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
    stick.setPointerCapture && stick.setPointerCapture(event.pointerId);
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
