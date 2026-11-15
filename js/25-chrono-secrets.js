// Moquete - Cinematicas secretas de Chrono (la ruta B)
// 1) Chapter 6, level 4: after the Dark Order, Chrono explores the castle library and finds a spell book.
//    The Flametomb page. He thinks it would be funny to give it to someone who knows about fire... and
//    travels to the past to hand it to Fire Master's master, when Fire Master and Ice Master were kids.
//    Without knowing it, he writes route B. (only if route B already exists in this save)
// 2) Chapter 4B, last level: Chrono runs from the burning library, scared. Another Chrono appears: the one
//    who made the mistake. He writes a B on his chest, tells him they ruined everything here, that he has
//    to find the courage to stop Fire Master and fix it... and leaves. (only after seeing the first one)

const chronoSecretBookKey = 'moqueteChronoSecretBook';
const chronoSecretMarkKey = 'moqueteChronoSecretMark';
const chronoSecret = { scene: null };

function readChronoSecretFlag(key) {
  try {
    return localStorage.getItem(key) === '1';
  } catch (error) {
    return false;
  }
}

function writeChronoSecretFlag(key) {
  try {
    localStorage.setItem(key, '1');
  } catch (error) {
    // (only for this session)
  }
}

// ---------- the scripts ----------
// part: the place. who: chrono / other / hermit / narrator. auto: advances alone after N frames
const chronoSecretBookLines = [
  { part: 'library', who: 'narrator', text: 'Mas tarde. En el castillo del mundo oscuro... mientras nadie lo miraba.', chronoTo: 160 },
  { part: 'library', who: 'chrono', text: 'Una biblioteca. En un castillo. En otro mundo. ...Tienen libros hasta en el techo.', chronoTo: 300 },
  { part: 'library', who: 'chrono', text: '"Cocina sin fuego". "Guia del bufon para bufones". "Como hablar con ELEGANCIA, por Abnormal"...', chronoTo: 380 },
  { part: 'library', who: 'chrono', text: '...Y ese? Ese brilla.', glowBook: true, chronoTo: 470 },
  { part: 'library', who: 'chrono', text: '"Libro de Hechizos". Edicion completa. Con dibujos y todo.', glowBook: true, takeBook: true, chronoTo: 470 },
  { part: 'book', page: 'spells', who: 'chrono', text: 'Bola de fuego. Rayo de fuego. Ola de fuego... Mucho fuego para un solo libro.' },
  { part: 'book', page: 'flametomb', who: 'chrono', text: '"FLAMETOMB". Prohibido. Un fuego negro que no se apaga nunca... y que controla al que lo usa.', sting: true },
  { part: 'book', page: 'flametomb', who: 'chrono', text: '...' },
  { part: 'book', page: 'flametomb', who: 'chrono', text: 'Ja. Imaginate darle esto a alguien que sabe de fuego. La cara que pondria.' },
  { part: 'book', page: 'flametomb', who: 'chrono', text: 'Seria graciosisimo. Un regalito. Nadie lo va a usar, obvio. Nadie es tan tonto.' },
  { part: 'book', page: 'flametomb', who: 'chrono', text: 'Y ya se a quien. ...Bueno, a su maestro. Cuando el todavia era un nene.' },
  { part: 'rewind', who: 'narrator', text: 'tic... tac... tic... tac...', auto: 120 },
  { part: 'rewind', who: 'narrator', text: 'MUCHOS AÑOS ANTES', big: true, auto: 110 },
  { part: 'mountain', who: 'narrator', text: 'Un pueblo al pie de la montaña nevada.' },
  { part: 'mountain', who: 'narrator', text: 'Dos hermanos jugaban en la nieve. Uno tenia las manos calientes. El otro nunca sentia frio.', kids: true },
  { part: 'mountain', who: 'hermit', text: '...Un reloj. Flotando. En mi montaña. Ya vi de todo en esta vida.', chronoIn: true, chronoTo: 400 },
  { part: 'mountain', who: 'chrono', text: 'Buenas, abuelo. Traigo un regalo. Para su alumno... el de las manos calientes.', chronoTo: 380 },
  { part: 'mountain', who: 'hermit', text: 'No tengo ningun alumno.' },
  { part: 'mountain', who: 'chrono', text: 'Todavia.' },
  { part: 'mountain', who: 'chrono', text: 'Tome. Es un libro de hechizos. Tiene uno muy, muy gracioso al final.', handBook: true },
  { part: 'mountain', who: 'hermit', text: '...', handBook: true, hermitReads: true },
  { part: 'mountain', who: 'hermit', text: '...Esto no tiene nada de gracioso, forastero.', handBook: true, hermitReads: true },
  { part: 'mountain', who: 'chrono', text: 'Que lo disfrute! Chau!', handBook: true, hermitReads: true, chronoOut: true },
  { part: 'mountain', who: 'hermit', text: '...Un fuego negro. Que no se apaga.', handBook: true, hermitReads: true, lookKid: true },
  { part: 'mountain', who: 'hermit', text: 'Si ese chico algun dia aprende a usar el fuego... le voy a enseñar una regla. La mas importante de todas.', handBook: true, lookKid: true },
  { part: 'mountain', who: 'hermit', text: '"Hay un fuego que nunca se usa. Nunca."', handBook: true, lookKid: true },
  { part: 'split', who: 'narrator', text: 'Y asi, por un chiste...', auto: 140 },
  { part: 'split', who: 'narrator', text: '...el tiempo se partio en dos.', split: true, auto: 170 },
  { part: 'split', who: 'narrator', text: 'RUTA B', big: true, split: true, auto: 160 },
];

const chronoSecretMarkLines = [
  { part: 'ashroad', who: 'narrator', text: 'Lejos de la biblioteca en llamas. Muy lejos.', chronoTo: 640 },
  { part: 'ashroad', who: 'chrono', text: 'No. No. No. No. No puedo. No puedo volver.', chronoTo: 470, scared: true },
  { part: 'ashroad', who: 'chrono', text: 'Me pidio que rebobinara. Me lo pidio a MI. Y yo... me fui.', scared: true },
  { part: 'ashroad', who: 'chrono', text: 'Sus esferas grises... el sombrero tibio... yo lo vi todo desde la ventana. Y no hice NADA.', scared: true },
  { part: 'ashroad', who: 'other', text: '...Asi que aca termino todo.', otherIn: true, scared: true },
  { part: 'ashroad', who: 'chrono', text: 'Q-quien...? Esa cara... sos... sos YO?', otherIn: true, scared: true },
  { part: 'ashroad', who: 'other', text: 'Algo asi. Soy el que te metio en esto.', otherIn: true },
  { part: 'ashroad', who: 'other', text: 'Cometi un error. Un error enorme. Hace mucho... en un castillo que vos todavia no conoces.', otherIn: true, named: true },
  { part: 'ashroad', who: 'other', text: 'Encontre un libro de hechizos. Con una pagina prohibida. Y me parecio gracioso...', otherIn: true, named: true },
  { part: 'ashroad', who: 'other', text: '...darselo a un viejo de la montaña. El maestro de Fire Master. Cuando el todavia era un nene jugando en la nieve.', otherIn: true, named: true },
  { part: 'ashroad', who: 'chrono', text: '...El Flametomb.', otherIn: true, named: true },
  { part: 'ashroad', who: 'other', text: 'El Flametomb. Ice Master. La ciudad azul. Sorcerer. Todo esto salio de un chiste mio.', otherIn: true, named: true },
  { part: 'ashroad', who: 'chrono', text: 'Entonces arreglalo! Rebobina! Vos podes, sos yo!', otherIn: true, named: true, scared: true },
  { part: 'ashroad', who: 'other', text: 'No. El fuego negro no se rebobina. Lo intente. Mil veces. Siempre vuelve a arder.', otherIn: true, named: true },
  { part: 'ashroad', who: 'other', text: 'Quedate quieto.', otherIn: true, named: true, otherTo: 560 },
  { part: 'ashroad', who: 'chrono', text: 'Q-que... que me estas haciendo?!', otherIn: true, named: true, otherTo: 560, mark: true, scared: true },
  { part: 'ashroad', who: 'other', text: 'Una marca. Una B. Para que nunca te olvides de que este tiempo es el tiempo B. El que rompimos.', otherIn: true, named: true, otherTo: 560, mark: true },
  { part: 'ashroad', who: 'other', text: 'Lo arruinamos todo aca. Vos y yo. Y alguien lo tiene que arreglar.', otherIn: true, named: true, otherTo: 600 },
  { part: 'ashroad', who: 'other', text: 'Tenes que encontrar a Fire Master. Tenes que armarte de valor. Y tenes que detenerlo. Terminar con esto.', otherIn: true, named: true, otherTo: 600 },
  { part: 'ashroad', who: 'chrono', text: 'Yo me escape. El me pidio ayuda y me escape. Yo no soy valiente.', otherIn: true, named: true, otherTo: 600 },
  { part: 'ashroad', who: 'other', text: 'Por eso tenes que ser vos. El que huye sabe cuanto pesa quedarse.', otherIn: true, named: true, otherTo: 600 },
  { part: 'ashroad', who: 'other', text: 'Arregla mi error, Chrono B. Nuestro error.', otherIn: true, named: true, otherTo: 600 },
  { part: 'ashroad', who: 'other', text: 'Me tengo que ir. Yo no pertenezco a este tiempo... ya me estoy borrando.', otherIn: true, named: true, otherTo: 600, otherOut: true },
  { part: 'ashroad', who: 'chrono', text: '...Chrono B.', lookMark: true },
  { part: 'ashroad', who: 'chrono', text: '...', lookMark: true },
  { part: 'ashroad', who: 'chrono', text: '...Esta bien. Lo voy a encontrar.', lookMark: true, brave: true },
  { part: 'ashroad', who: 'narrator', text: 'La ruta B continua.', big: true, auto: 170, brave: true },
];

const chronoSecretNames = { chrono: 'Chrono', other: '???', hermit: 'Viejo de la montaña', narrator: '' };
const chronoSecretColors = { chrono: '#26c6da', other: '#ff7043', hermit: '#d7a86e', narrator: '#ffffff' };

// ---------- the player ----------
function startChronoSecretScene(kind, onDone) {
  if (chronoSecret.scene) return;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (typeof stopReflecterBattleMusic === 'function') stopReflecterBattleMusic();
  const makeChrono = () => {
    const actor = new Fighter({ x: 0, y: 0, color: '#26c6da', attacksToTheRight: true });
    actor.setCharacterType('chrono');
    actor.isAttacking = false;
    return actor;
  };
  const book = kind === 'book';
  const scene = {
    kind,
    lines: book ? chronoSecretBookLines : chronoSecretMarkLines,
    index: 0,
    lineT: 0,
    t: 0,
    typed: 0,
    onDone,
    chrono: makeChrono(),
    other: makeChrono(),
    chronoX: book ? -80 : canvas.width + 80,
    otherX: 700,
    otherAlpha: 0,
    fadeIn: 1,
    fadeOut: 0,
    flash: 0,
    bookTaken: 0,
    handBook: 0,
    chronoAlpha: 1,
    mark: 0,
    split: 0,
    snow: Array.from({ length: 70 }, (_, i) => ({ x: (i * 137) % canvas.width, y: (i * 89) % ground, s: 1 + (i % 3) })),
    ash: Array.from({ length: 60 }, (_, i) => ({ x: (i * 151) % canvas.width, y: (i * 67) % ground, s: 1 + (i % 2) })),
    lastPart: null,
  };
  scene.advance = (event) => {
    // (the keys are for this scene only: nothing underneath hears them)
    if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
    if (event && event.type === 'keydown') {
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(event.key)) return;
      if (event.key === 'Escape') {
        // (skip it all)
        scene.index = scene.lines.length;
        scene.fadeOut = Math.max(scene.fadeOut, 0.01);
        return;
      }
    }
    const line = scene.lines[scene.index];
    if (!line || scene.fadeOut > 0) return;
    if (scene.typed < line.text.length) {
      scene.typed = line.text.length;
      return;
    }
    nextChronoSecretLine(scene);
  };
  window.addEventListener('keydown', scene.advance, true);
  canvas.addEventListener('pointerdown', scene.advance);
  document.body.classList.add('knightb-ending');
  chronoSecret.scene = scene;
  startChronoSecretLine(scene);
  scene.raf = requestAnimationFrame(tickChronoSecret);
}

function startChronoSecretLine(scene) {
  scene.lineT = 0;
  scene.typed = 0;
  const line = scene.lines[scene.index];
  if (!line) return;
  if (line.part !== scene.lastPart) {
    if (scene.lastPart) scene.flash = line.part === 'rewind' || line.part === 'mountain' ? 1 : 0.4;
    scene.lastPart = line.part;
    if (line.part === 'rewind') playTone({ frequency: 1200, duration: 2.5, type: 'triangle', volume: 0.04, slideTo: 120 });
    if (line.part === 'mountain') playNoise({ duration: 1.2, volume: 0.04, filterFrequency: 3000 });
    if (line.part === 'split') playTone({ frequency: 55, duration: 4, type: 'sawtooth', volume: 0.05, slideTo: 40 });
  }
  if (line.sting && typeof playFlametombStingSound === 'function') playFlametombStingSound();
  if (line.chronoIn) scene.flash = Math.max(scene.flash, 0.6);
  if (line.chronoOut) {
    scene.flash = 0.8;
    [1400, 1000, 700].forEach((frequency, index) => setTimeout(() => playTone({ frequency, duration: 0.15, type: 'triangle', volume: 0.04, slideTo: frequency * 0.6 }), index * 80));
  }
  if (line.otherIn && !scene.otherSeen) {
    scene.otherSeen = true;
    scene.flash = 1;
    playTone({ frequency: 1800, duration: 0.8, type: 'triangle', volume: 0.05, slideTo: 300 });
    playNoise({ duration: 0.5, volume: 0.05, filterFrequency: 4000 });
  }
  if (line.otherOut) playTone({ frequency: 600, duration: 3, type: 'sine', volume: 0.04, slideTo: 80 });
  if (line.brave && !scene.braveSound) {
    scene.braveSound = true;
    playTone({ frequency: 392, duration: 1.2, type: 'triangle', volume: 0.04, slideTo: 523 });
  }
}

function nextChronoSecretLine(scene) {
  scene.index += 1;
  if (scene.index >= scene.lines.length) {
    scene.fadeOut = Math.max(scene.fadeOut, 0.01);
    return;
  }
  startChronoSecretLine(scene);
}

function endChronoSecretScene(scene) {
  if (scene.over) return;
  scene.over = true;
  cancelAnimationFrame(scene.raf);
  window.removeEventListener('keydown', scene.advance, true);
  canvas.removeEventListener('pointerdown', scene.advance);
  document.body.classList.remove('knightb-ending');
  chronoSecret.scene = null;
  writeChronoSecretFlag(scene.kind === 'book' ? chronoSecretBookKey : chronoSecretMarkKey);
  if (typeof scene.onDone === 'function') scene.onDone();
}

function tickChronoSecret() {
  const scene = chronoSecret.scene;
  if (!scene || scene.over) return;
  scene.t += 1;
  scene.lineT += 1;
  const line = scene.lines[Math.min(scene.index, scene.lines.length - 1)];
  scene.typed = Math.min(line.text.length, scene.typed + (line.big ? 0.3 : 0.75));
  if (line.auto && scene.lineT > line.auto && scene.fadeOut === 0) nextChronoSecretLine(scene);
  updateChronoSecretActors(scene, line);
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (line.part === 'library') drawChronoSecretLibrary(scene, line);
  else if (line.part === 'book') drawChronoSecretBook(scene, line);
  else if (line.part === 'rewind') drawChronoSecretRewind(scene, line);
  else if (line.part === 'mountain') drawChronoSecretMountain(scene, line);
  else if (line.part === 'split') drawChronoSecretSplit(scene, line);
  else drawChronoSecretAshRoad(scene, line);
  ctx.restore();
  drawChronoSecretText(scene, line);
  // flashes and fades
  if (scene.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${scene.flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    scene.flash = Math.max(0, scene.flash - 0.04);
  }
  if (scene.fadeIn > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${scene.fadeIn})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    scene.fadeIn = Math.max(0, scene.fadeIn - 0.025);
  }
  if (scene.fadeOut > 0) {
    scene.fadeOut = Math.min(1, scene.fadeOut + 0.025);
    ctx.fillStyle = `rgba(0, 0, 0, ${scene.fadeOut})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (scene.fadeOut >= 1) {
      endChronoSecretScene(scene);
      return;
    }
  }
  scene.raf = requestAnimationFrame(tickChronoSecret);
}

function updateChronoSecretActors(scene, line) {
  if (typeof line.chronoTo === 'number') scene.chronoX += (line.chronoTo - scene.chronoX) * 0.04;
  if (typeof line.otherTo === 'number') scene.otherX += (line.otherTo - scene.otherX) * 0.04;
  if (line.takeBook) scene.bookTaken = Math.min(1, scene.bookTaken + 0.03);
  if (line.handBook) scene.handBook = Math.min(1, scene.handBook + 0.025);
  if (line.chronoOut) scene.chronoAlpha = Math.max(0, scene.chronoAlpha - 0.05);
  if (line.chronoIn && scene.chronoAlpha < 1) scene.chronoAlpha = Math.min(1, scene.chronoAlpha + 0.05);
  if (line.otherOut) scene.otherLeaving = true;
  if (line.otherIn && !scene.otherLeaving) scene.otherAlpha = Math.min(1, scene.otherAlpha + 0.05);
  // (once he starts to go, he goes: even if the lines are skipped)
  if (scene.otherLeaving) scene.otherAlpha = Math.max(0, scene.otherAlpha - 0.008);
  if (line.mark || (scene.mark > 0 && scene.mark < 1)) {
    const before = scene.mark;
    scene.mark = Math.min(1, scene.mark + (line.mark ? 0.008 : 0.02));
    // (the scratch of the mark, stroke by stroke)
    if (Math.floor(before * 30) !== Math.floor(scene.mark * 30) && scene.mark < 1) playNoise({ duration: 0.06, volume: 0.03, filterFrequency: 2500 + Math.random() * 1500 });
  }
  if (line.split) scene.split = Math.min(1, scene.split + 0.012);
}

// Chrono, floating (scared: trembling; the other one: older, cracked, half there)
function drawChronoSecretChrono(actor, x, baseY, opts = {}) {
  const time = performance.now() / 1000;
  const shake = opts.scared ? 2.4 : 0;
  ctx.save();
  ctx.globalAlpha = opts.alpha === undefined ? 1 : opts.alpha;
  actor.position = { x: x - actor.width / 2 + (Math.random() - 0.5) * shake, y: baseY - actor.height - 30 + Math.sin(time * 2 + x * 0.01) * 6 + (Math.random() - 0.5) * shake };
  actor.attacksToTheRight = opts.right !== false;
  actor.isAttacking = false;
  actor.draw();
  const ax = actor.position.x;
  const ay = actor.position.y;
  if (opts.other) {
    // the other one: worn, darker, glass cracked, edges coming undone
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(150, 130, 120)';
    ctx.fillRect(ax - 2, ay - 2, actor.width + 4, actor.height + 4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ax + actor.width / 2 - 2, ay + 56);
    ctx.lineTo(ax + actor.width / 2 + 6, ay + 66);
    ctx.lineTo(ax + actor.width / 2 - 1, ay + 74);
    ctx.moveTo(ax + actor.width / 2 + 6, ay + 66);
    ctx.lineTo(ax + actor.width / 2 + 13, ay + 63);
    ctx.stroke();
    // a B, old and faded, on his own chest too
    drawChronoSecretB(ax + actor.width / 2, ay + 69, 1, 'rgba(255, 112, 67, 0.5)', 2.5);
    // he is coming undone at the edges
    for (let bit = 0; bit < 8; bit += 1) {
      const by = ay + ((bit * 17 + time * 40) % actor.height);
      ctx.fillStyle = `rgba(38, 198, 218, ${0.5 * (opts.alpha === undefined ? 1 : opts.alpha)})`;
      ctx.fillRect(ax + (bit % 2 ? actor.width + 4 + Math.sin(time * 5 + bit) * 4 : -8 - Math.sin(time * 5 + bit) * 4), by, 4, 4);
    }
  }
  if (opts.mark > 0) drawChronoSecretB(ax + actor.width / 2, ay + 69, opts.mark, '#ff5722', 4.5, true);
  if (opts.scared) {
    ctx.fillStyle = '#b3e5fc';
    ctx.beginPath();
    ctx.arc(ax + actor.width - 6, ay + 10 + ((time * 30) % 16), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return { x: ax, y: ay };
}

// the B, stroke by stroke
function drawChronoSecretB(cx, cy, progress, color, width, glow) {
  const strokes = [
    [[-10, -20], [-10, 20]],
    [[-10, -20], [4, -20], [10, -14], [10, -6], [4, 0], [-10, 0]],
    [[-10, 0], [6, 0], [12, 6], [12, 14], [6, 20], [-10, 20]],
  ];
  const segments = [];
  strokes.forEach((points) => {
    for (let i = 1; i < points.length; i += 1) segments.push([points[i - 1], points[i]]);
  });
  const lengths = segments.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lengths.reduce((sum, value) => sum + value, 0);
  let left = total * progress;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (glow) {
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 10;
  }
  ctx.beginPath();
  let tip = null;
  segments.forEach(([a, b], index) => {
    if (left <= 0) return;
    const k = Math.min(1, left / lengths[index]);
    ctx.moveTo(cx + a[0], cy + a[1]);
    tip = [cx + a[0] + (b[0] - a[0]) * k, cy + a[1] + (b[1] - a[1]) * k];
    ctx.lineTo(tip[0], tip[1]);
    left -= lengths[index];
  });
  ctx.stroke();
  ctx.restore();
  return tip;
}

// ---------- the places ----------
function drawChronoSecretLibrary(scene, line) {
  const width = canvas.width;
  const time = performance.now() / 1000;
  const wall = ctx.createLinearGradient(0, 0, 0, ground);
  wall.addColorStop(0, '#0d0718');
  wall.addColorStop(1, '#24133d');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, canvas.height);
  // arched windows with a purple moon
  [150, 512, 874].forEach((wx, index) => {
    ctx.fillStyle = '#3a1f63';
    ctx.beginPath();
    ctx.moveTo(wx - 40, 190);
    ctx.lineTo(wx - 40, 90);
    ctx.arc(wx, 90, 40, Math.PI, 0);
    ctx.lineTo(wx + 40, 190);
    ctx.closePath();
    ctx.fill();
    if (index === 1) {
      ctx.fillStyle = '#e1bee7';
      ctx.beginPath();
      ctx.arc(wx + 8, 100, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#120a20';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx, 50);
    ctx.lineTo(wx, 190);
    ctx.moveTo(wx - 40, 130);
    ctx.lineTo(wx + 40, 130);
    ctx.stroke();
  });
  // tall shelves full of books
  const colors = ['#6a1b9a', '#283593', '#4e342e', '#1b5e20', '#b71c1c', '#37474f', '#f9a825', '#00695c'];
  for (let shelf = 0; shelf < 6; shelf += 1) {
    const sx = 30 + shelf * 170;
    if (shelf === 3 || shelf === 0) continue;
    ctx.fillStyle = '#2b1a12';
    ctx.fillRect(sx, 210, 130, ground - 210);
    for (let row = 0; row < 6; row += 1) {
      const ry = 222 + row * 48;
      ctx.fillStyle = '#1a0f0a';
      ctx.fillRect(sx + 6, ry + 38, 118, 6);
      for (let bookIndex = 0; bookIndex < 11; bookIndex += 1) {
        const seed = shelf * 71 + row * 13 + bookIndex * 7;
        const bw = 8 + (seed % 4);
        const bh = 26 + (seed % 10);
        ctx.fillStyle = colors[seed % colors.length];
        ctx.fillRect(sx + 8 + bookIndex * 10.5, ry + 38 - bh, bw, bh);
      }
    }
  }
  // the glowing book, on the middle shelf
  const glowX = 512;
  const glowY = 330;
  if (scene.bookTaken < 1) {
    ctx.fillStyle = '#2b1a12';
    ctx.fillRect(glowX - 50, 300, 100, 60);
    const pulse = 0.5 + Math.sin(time * 4) * 0.3;
    if (line.glowBook || scene.bookTaken > 0) {
      const glow = ctx.createRadialGradient(glowX, glowY, 4, glowX, glowY, 70);
      glow.addColorStop(0, `rgba(255, 112, 67, ${0.6 * pulse})`);
      glow.addColorStop(1, 'rgba(255, 112, 67, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(glowX - 70, glowY - 70, 140, 140);
    }
  }
  // the floor
  ctx.fillStyle = '#160c26';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  for (let tile = 0; tile < 14; tile += 1) {
    ctx.fillStyle = tile % 2 ? '#1d1033' : '#140a24';
    ctx.fillRect(tile * 80, ground, 80, canvas.height - ground);
  }
  // candles
  [120, 900].forEach((cx, index) => {
    ctx.fillStyle = '#4a3b2a';
    ctx.fillRect(cx - 4, ground - 90, 8, 90);
    ctx.fillStyle = '#efe6d8';
    ctx.fillRect(cx - 6, ground - 110, 12, 20);
    const flick = 0.7 + Math.sin(time * 9 + index) * 0.2;
    ctx.fillStyle = `rgba(206, 147, 216, ${flick})`;
    ctx.beginPath();
    ctx.ellipse(cx, ground - 118, 4, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  const chronoPos = drawChronoSecretChrono(scene.chrono, scene.chronoX, ground, { right: true });
  // the book: on the shelf, then in his hands
  const bx = glowX + (chronoPos.x + 60 - glowX) * scene.bookTaken;
  const by = glowY + (chronoPos.y + 70 - glowY) * scene.bookTaken;
  drawChronoSecretSpellBook(bx, by, 1, line.glowBook);
}

function drawChronoSecretSpellBook(x, y, scale, glow) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (glow) {
    ctx.fillStyle = 'rgba(255, 87, 34, 0.35)';
    ctx.fillRect(-20, -26, 40, 52);
  }
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(-14, -20, 28, 40);
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 2;
  ctx.strokeRect(-11, -17, 22, 34);
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawChronoSecretBook(scene, line) {
  const width = canvas.width;
  const time = performance.now() / 1000;
  ctx.fillStyle = '#0b0614';
  ctx.fillRect(0, 0, width, canvas.height);
  const glow = ctx.createRadialGradient(width / 2, 250, 20, width / 2, 250, 420);
  glow.addColorStop(0, line.page === 'flametomb' ? 'rgba(255, 87, 34, 0.35)' : 'rgba(179, 136, 255, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, canvas.height);
  // the open book
  const left = width / 2 - 310;
  const top = 50;
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(left - 14, top - 12, 648, 384);
  ctx.fillStyle = '#efe3c8';
  ctx.fillRect(left, top, 305, 360);
  ctx.fillRect(left + 315, top, 305, 360);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(left + 295, top, 30, 360);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#3e2723';
  const lineRows = (x, y, rows) => {
    ctx.fillStyle = 'rgba(62, 39, 35, 0.35)';
    for (let row = 0; row < rows; row += 1) ctx.fillRect(x - 100, y + row * 16, 200 - (row % 3) * 30, 3);
  };
  if (line.page === 'spells') {
    ctx.font = "900 20px Georgia, serif";
    ctx.fillStyle = '#bf360c';
    ctx.fillText('BOLA DE FUEGO', left + 152, top + 50);
    drawFlametombFlame(left + 152, top + 140, 26, time * 10, 'outer');
    lineRows(left + 152, top + 180, 6);
    ctx.font = "900 20px Georgia, serif";
    ctx.fillStyle = '#bf360c';
    ctx.fillText('RAYO DE FUEGO', left + 467, top + 50);
    ctx.fillRect(left + 380, top + 90, 175, 10);
    lineRows(left + 467, top + 120, 4);
    ctx.fillText('OLA DE FUEGO', left + 467, top + 210);
    lineRows(left + 467, top + 240, 5);
  } else {
    ctx.font = "900 16px Georgia, serif";
    ctx.fillStyle = '#4e342e';
    ctx.fillText('HECHIZOS PROHIBIDOS', left + 152, top + 46);
    ctx.font = "italic 13px Georgia, serif";
    ctx.fillText('"Lo que sigue no debe leerse', left + 152, top + 90);
    ctx.fillText('en voz alta. Ni en voz baja.', left + 152, top + 110);
    ctx.fillText('Ni pensarse."', left + 152, top + 130);
    lineRows(left + 152, top + 170, 9);
    ctx.font = "900 34px Georgia, serif";
    ctx.fillStyle = '#1b1b1b';
    ctx.fillText('FLAMETOMB', left + 467, top + 60);
    // the black flame
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (let flame = 0; flame < 3; flame += 1) drawFlametombFlame(left + 437 + flame * 30, top + 220, 34 - flame * 4, time * 9 + flame, 'core');
    ctx.fillStyle = '#0b0b0b';
    ctx.beginPath();
    ctx.moveTo(left + 427, top + 230);
    ctx.quadraticCurveTo(left + 467, top + 100, left + 507, top + 230);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    lineRows(left + 467, top + 260, 5);
    // the stamp
    ctx.save();
    ctx.translate(left + 467, top + 150);
    ctx.rotate(-0.3);
    ctx.strokeStyle = 'rgba(198, 40, 40, 0.85)';
    ctx.lineWidth = 4;
    ctx.strokeRect(-90, -24, 180, 48);
    ctx.font = "900 30px 'Courier New', monospace";
    ctx.fillStyle = 'rgba(198, 40, 40, 0.85)';
    ctx.fillText('PROHIBIDO', 0, 11);
    ctx.restore();
  }
  ctx.textAlign = 'left';
  // embers
  for (let ember = 0; ember < 24; ember += 1) {
    const ex = (ember * 97 + time * 20) % width;
    const ey = canvas.height - ((ember * 53 + time * 40) % canvas.height);
    ctx.fillStyle = line.page === 'flametomb' ? 'rgba(255, 112, 67, 0.7)' : 'rgba(206, 147, 216, 0.6)';
    ctx.fillRect(ex, ey, 2, 2);
  }
}

function drawChronoSecretRewind(scene, line) {
  const width = canvas.width;
  const cx = width / 2;
  const cy = 250;
  const t = scene.lineT + (line.big ? 120 : 0);
  ctx.fillStyle = '#02060c';
  ctx.fillRect(0, 0, width, canvas.height);
  for (let ring = 0; ring < 6; ring += 1) {
    const radius = 50 + ring * 45;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((ring % 2 ? 1 : -1) * t * (0.02 + ring * 0.008));
    ctx.strokeStyle = `rgba(38, 198, 218, ${0.6 - ring * 0.07})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    for (let tick = 0; tick < 12; tick += 1) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = '#e0f7fa';
      ctx.fillRect(radius - 6, -2, 12, 4);
    }
    ctx.restore();
  }
  // the hands, spinning backwards, faster and faster
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.rotate(-t * t * 0.0006);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -90);
  ctx.stroke();
  ctx.rotate(-t * 0.03);
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -55);
  ctx.stroke();
  ctx.restore();
  if (scene.lineT % 20 === 0) playTone({ frequency: scene.lineT % 40 ? 1500 : 1100, duration: 0.05, type: 'square', volume: 0.03 });
  if (Math.random() < 0.05) scene.flash = Math.max(scene.flash, 0.25);
}

function drawChronoSecretMountain(scene, line) {
  const width = canvas.width;
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#9fb3c8');
  sky.addColorStop(1, '#e3edf5');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  // the snowy mountain behind
  ctx.fillStyle = '#c5d3df';
  ctx.beginPath();
  ctx.moveTo(-50, ground - 60);
  ctx.lineTo(300, 70);
  ctx.lineTo(560, ground - 120);
  ctx.lineTo(780, 120);
  ctx.lineTo(width + 60, ground - 80);
  ctx.lineTo(width + 60, ground);
  ctx.lineTo(-50, ground);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  [[300, 70], [780, 120]].forEach(([px, py]) => {
    ctx.beginPath();
    ctx.moveTo(px - 60, py + 70);
    ctx.lineTo(px, py);
    ctx.lineTo(px + 60, py + 70);
    ctx.lineTo(px + 20, py + 55);
    ctx.lineTo(px - 10, py + 75);
    ctx.closePath();
    ctx.fill();
  });
  // the hermit's hut
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(40, ground - 130, 150, 130);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(25, ground - 125);
  ctx.lineTo(115, ground - 200);
  ctx.lineTo(205, ground - 125);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffb74d';
  ctx.fillRect(130, ground - 95, 30, 26);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(65, ground - 80, 36, 80);
  // the ground
  ctx.fillStyle = '#f4f8fb';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  // the two brothers, playing in the snow
  if (line.kids || scene.index >= 14) drawChronoSecretKids(time, line.lookKid);
  // the old man
  drawChronoSecretHermit(260, ground, time, line.hermitReads, scene.handBook);
  // Chrono
  if (scene.index >= 15 && scene.chronoAlpha > 0) {
    if (scene.chronoX < 0) scene.chronoX = 420;
    const pos = drawChronoSecretChrono(scene.chrono, scene.chronoX, ground, { right: false, alpha: scene.chronoAlpha });
    if (scene.handBook < 1) {
      const bx = pos.x + 4 + (300 - pos.x - 4) * scene.handBook;
      const by = pos.y + 70 + (ground - 64 - pos.y - 70) * scene.handBook;
      drawChronoSecretSpellBook(bx, by, 0.8, false);
    }
  }
  // the snow
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  scene.snow.forEach((flake) => {
    flake.y += 0.6 * flake.s;
    flake.x += Math.sin(time + flake.y / 40) * 0.3;
    if (flake.y > ground) flake.y = -5;
    ctx.fillRect(flake.x, flake.y, flake.s + 1, flake.s + 1);
  });
}

function drawChronoSecretKids(time, look) {
  // the older one: warm hands, an orange glow; the younger one: pale blue, a snowball in the air
  const kids = [
    { x: 660, body: '#e65100', glow: 'rgba(255, 112, 67, 0.55)' },
    { x: 790, body: '#4fc3f7', glow: 'rgba(179, 229, 252, 0.6)' },
  ];
  kids.forEach((kid, index) => {
    const hop = Math.abs(Math.sin(time * 3 + index * 1.7)) * 8;
    const y = ground - 52 - hop;
    ctx.fillStyle = kid.body;
    ctx.fillRect(kid.x - 11, y + 16, 22, 36);
    ctx.fillStyle = '#ffe0bd';
    ctx.beginPath();
    ctx.arc(kid.x, y + 8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(kid.x + (index ? -6 : 2), y + 6, 3, 3);
    const glow = ctx.createRadialGradient(kid.x + (index ? -14 : 14), y + 34, 1, kid.x + (index ? -14 : 14), y + 34, 14);
    glow.addColorStop(0, kid.glow);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(kid.x - 30, y + 18, 60, 32);
  });
  // a snowball flying between them
  const k = (time * 0.6) % 1;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#b0bec5';
  ctx.beginPath();
  ctx.arc(780 - k * 110, ground - 70 - Math.sin(k * Math.PI) * 50, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (look) {
    // (he is looking at the older one: the one with fire in his hands)
    ctx.strokeStyle = 'rgba(255, 112, 67, 0.4)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(660, ground - 30, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawChronoSecretHermit(x, groundY, time, reading, handBook) {
  const sway = Math.sin(time * 1.2) * 1.5;
  ctx.save();
  // the staff
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 34, groundY);
  ctx.lineTo(x - 30, groundY - 140);
  ctx.stroke();
  // the robe
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.moveTo(x - 26 + sway, groundY - 100);
  ctx.lineTo(x + 26 + sway, groundY - 100);
  ctx.lineTo(x + 36, groundY);
  ctx.lineTo(x - 36, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(x - 30, groundY - 52, 60, 6);
  // the head, the eyebrows, the long white beard
  ctx.fillStyle = '#f1c9a5';
  ctx.beginPath();
  ctx.arc(x + sway, groundY - 116, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eceff1';
  ctx.beginPath();
  ctx.moveTo(x - 14 + sway, groundY - 110);
  ctx.lineTo(x + 14 + sway, groundY - 110);
  ctx.lineTo(x + 4 + sway, groundY - 58);
  ctx.lineTo(x - 2 + sway, groundY - 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - 12 + sway, groundY - 124, 9, 3);
  ctx.fillRect(x + 4 + sway, groundY - 124, 9, 3);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(x - 9 + sway, groundY - 120, 4, 3);
  ctx.fillRect(x + 6 + sway, groundY - 120, 4, 3);
  // the book in his hands
  if (handBook >= 1) {
    if (reading) {
      ctx.fillStyle = '#efe3c8';
      ctx.fillRect(x + 8, groundY - 78, 36, 22);
      ctx.fillStyle = '#4a148c';
      ctx.fillRect(x + 6, groundY - 56, 40, 3);
      const glow = ctx.createRadialGradient(x + 26, groundY - 68, 2, x + 26, groundY - 68, 40);
      glow.addColorStop(0, 'rgba(255, 87, 34, 0.55)');
      glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 14, groundY - 108, 80, 80);
      ctx.fillStyle = '#111';
      ctx.fillRect(x + 28, groundY - 74, 10, 12);
    } else {
      drawChronoSecretSpellBook(x + 24, groundY - 66, 0.8, false);
    }
  }
  ctx.restore();
}

function drawChronoSecretSplit(scene, line) {
  const width = canvas.width;
  const time = performance.now() / 1000;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, canvas.height);
  const midX = width / 2;
  const y = 250;
  const grow = Math.min(1, scene.lineT / 80);
  // the line of time
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(60 + (midX - 60) * (scene.split > 0 ? 1 : grow), y);
  ctx.stroke();
  if (scene.split > 0) {
    const k = scene.split;
    // A: straight on
    ctx.beginPath();
    ctx.moveTo(midX, y);
    ctx.lineTo(midX + (width - 60 - midX) * k, y - 60 * k);
    ctx.stroke();
    // B: down, orange, trembling
    ctx.strokeStyle = '#ff5722';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(midX, y);
    for (let step = 1; step <= 20; step += 1) {
      const p = (step / 20) * k;
      ctx.lineTo(midX + (width - 60 - midX) * p, y + 140 * p + Math.sin(step * 2 + time * 8) * 3 * p);
    }
    ctx.stroke();
    ctx.font = "900 30px 'Courier New', monospace";
    ctx.fillStyle = `rgba(255, 255, 255, ${k})`;
    ctx.fillText('A', width - 70, y - 70);
    ctx.fillStyle = `rgba(255, 87, 34, ${k})`;
    ctx.fillText('B', width - 70, y + 160);
  }
  // the book, right where it splits
  drawChronoSecretSpellBook(midX, y - 30, 0.9, true);
}

function drawChronoSecretAshRoad(scene, line) {
  const width = canvas.width;
  const time = performance.now() / 1000;
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  sky.addColorStop(0, '#05060f');
  sky.addColorStop(0.7, '#1a1020');
  sky.addColorStop(1, '#3a1a12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, canvas.height);
  // far away, the library burning: an orange glow and the smoke
  const fire = ctx.createRadialGradient(110, ground - 40, 10, 110, ground - 40, 260);
  fire.addColorStop(0, `rgba(255, 112, 67, ${0.55 + Math.sin(time * 3) * 0.08})`);
  fire.addColorStop(1, 'rgba(255, 112, 67, 0)');
  ctx.fillStyle = fire;
  ctx.fillRect(0, ground - 300, 400, 300);
  for (let puff = 0; puff < 7; puff += 1) {
    ctx.fillStyle = 'rgba(20, 16, 20, 0.55)';
    ctx.beginPath();
    ctx.ellipse(110 + Math.sin(time * 0.5 + puff) * 20 + puff * 12, ground - 90 - puff * 45 - ((time * 10) % 45), 50 + puff * 8, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#100a10';
  ctx.fillRect(70, ground - 70, 80, 70);
  ctx.beginPath();
  ctx.moveTo(60, ground - 70);
  ctx.lineTo(110, ground - 110);
  ctx.lineTo(160, ground - 70);
  ctx.fill();
  // dead trees
  ctx.strokeStyle = '#0b070c';
  ctx.lineWidth = 6;
  [300, 860, 960].forEach((tx, index) => {
    ctx.beginPath();
    ctx.moveTo(tx, ground);
    ctx.lineTo(tx + 6, ground - 170 - index * 10);
    ctx.moveTo(tx + 4, ground - 110);
    ctx.lineTo(tx - 30, ground - 150);
    ctx.moveTo(tx + 5, ground - 140);
    ctx.lineTo(tx + 40, ground - 180);
    ctx.stroke();
  });
  // the road
  ctx.fillStyle = '#1a1416';
  ctx.fillRect(0, ground, width, canvas.height - ground);
  ctx.fillStyle = '#2a2024';
  ctx.fillRect(0, ground, width, 6);
  // the ash
  scene.ash.forEach((flake) => {
    flake.y += 0.5 * flake.s;
    flake.x += Math.sin(time + flake.y / 30) * 0.4 + 0.2;
    if (flake.y > ground) {
      flake.y = -5;
      flake.x = Math.random() * width;
    }
    ctx.fillStyle = flake.s > 1 ? 'rgba(255, 138, 101, 0.7)' : 'rgba(180, 170, 170, 0.6)';
    ctx.fillRect(flake.x, flake.y, 2, 2);
  });
  // the two of them
  const scared = Boolean(line.scared);
  const chronoPos = drawChronoSecretChrono(scene.chrono, scene.chronoX, ground, { right: scene.otherAlpha > 0.1, scared, mark: scene.mark });
  if (scene.otherAlpha > 0.01) {
    const otherPos = drawChronoSecretChrono(scene.other, scene.otherX, ground, { right: false, alpha: scene.otherAlpha * (0.85 + Math.sin(time * 13) * 0.1), other: true });
    if (line.mark && scene.mark < 1) {
      // a finger of light, writing
      const tip = drawChronoSecretB(chronoPos.x + 30, chronoPos.y + 69, scene.mark, 'rgba(0, 0, 0, 0)', 1) || [chronoPos.x + 20, chronoPos.y + 50];
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 171, 145, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(otherPos.x + 6, otherPos.y + 60);
      ctx.lineTo(tip[0], tip[1]);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tip[0], tip[1], 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  // looking down at the mark: a soft glow on it
  if (line.lookMark || line.brave) {
    const glow = ctx.createRadialGradient(chronoPos.x + 30, chronoPos.y + 69, 2, chronoPos.x + 30, chronoPos.y + 69, 50);
    glow.addColorStop(0, `rgba(255, 87, 34, ${0.35 + Math.sin(time * 3) * 0.1})`);
    glow.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(chronoPos.x - 30, chronoPos.y + 10, 120, 120);
  }
}

// ---------- the words ----------
function wrapChronoSecretText(text, maxWidth) {
  const words = text.split(' ');
  const rows = [];
  let row = '';
  words.forEach((word) => {
    const test = row ? `${row} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && row) {
      rows.push(row);
      row = word;
    } else {
      row = test;
    }
  });
  if (row) rows.push(row);
  return rows;
}

function drawChronoSecretText(scene, line) {
  const shown = line.text.slice(0, Math.floor(scene.typed));
  const width = canvas.width;
  ctx.save();
  if (line.big) {
    ctx.textAlign = 'center';
    ctx.font = "900 46px 'Courier New', monospace";
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = line.text === 'RUTA B' ? '#ff5722' : '#ffffff';
    ctx.strokeText(shown, width / 2, line.part === 'split' ? 430 : 270);
    ctx.fillText(shown, width / 2, line.part === 'split' ? 430 : 270);
  } else if (line.who === 'narrator') {
    ctx.textAlign = 'center';
    ctx.font = 'italic 21px Georgia, serif';
    const rows = wrapChronoSecretText(shown, width - 200);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 26, width, 24 + rows.length * 28);
    ctx.fillStyle = '#f5f5f5';
    rows.forEach((row, index) => ctx.fillText(row, width / 2, 56 + index * 28));
  } else {
    // (on top, so the characters below can be seen; under the open book, at the bottom)
    const boxY = line.part === 'book' ? canvas.height - 128 : 18;
    ctx.fillStyle = 'rgba(8, 10, 18, 0.88)';
    ctx.fillRect(40, boxY, width - 80, 108);
    ctx.strokeStyle = chronoSecretColors[line.who] || '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, boxY, width - 80, 108);
    let name = chronoSecretNames[line.who] || '';
    if (line.who === 'other' && line.named) name = 'Chrono (?)';
    if (line.who === 'chrono' && scene.kind === 'mark' && scene.mark >= 1) name = 'Chrono B';
    ctx.font = "900 16px 'Courier New', monospace";
    ctx.fillStyle = chronoSecretColors[line.who] || '#fff';
    ctx.fillText(name, 60, boxY + 24);
    ctx.font = '19px Georgia, serif';
    ctx.fillStyle = '#ffffff';
    wrapChronoSecretText(shown, width - 130).slice(0, 3).forEach((row, index) => ctx.fillText(row, 60, boxY + 52 + index * 24));
  }
  if (scene.typed >= line.text.length && !line.auto && scene.fadeOut === 0 && Math.floor(scene.t / 30) % 2 === 0) {
    ctx.textAlign = 'right';
    ctx.font = "700 12px 'Courier New', monospace";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('[Enter] seguir   [Esc] saltar', width - 50, line.part === 'book' ? canvas.height - 6 : 142);
  }
  ctx.restore();
}

// ---------- where they happen ----------
(function hookChronoSecrets() {
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  // chapter 6, level 4: after the Dark Order... the library (only if route B exists in this save)
  wrap('finishChronoChapterOutro', (base) => function finishChronoChapterOutroWithSecret(...args) {
    const routeB = typeof isRouteBUnlocked === 'function' && isRouteBUnlocked();
    if (normalArcadeActive && arcadeChapter === 'chrono' && selectedNormalArcadeLevel === 4 && routeB && !chronoSecret.scene) {
      startChronoSecretScene('book', () => base.apply(this, args));
      return undefined;
    }
    return base.apply(this, args);
  });
  // 4B, last level: after Chrono runs away from the window (only after seeing the first one)
  wrap('endArcadeCutscene', (base) => function endArcadeCutsceneWithChronoB(...args) {
    const ending = arcadeCutscene.active && arcadeCutscene.sixth && arcadeCutscene.ending;
    if (ending && normalArcadeActive && arcadeChapter === 'reflecterB' && readChronoSecretFlag(chronoSecretBookKey) && !chronoSecret.scene) {
      startChronoSecretScene('mark', () => {
        base.apply(this, args);
        if (!animationId) animate();
      });
      return undefined;
    }
    return base.apply(this, args);
  });
})();
