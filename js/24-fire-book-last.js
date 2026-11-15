// ================= "FUEGO EN LAS MANOS": the last part =================
// After the last Flametomb on Knight (chapter 5B, the refuge), Fire Master's book changes one more time.
// The strangest part of all: Robledal, the refuge, the three blocks of the shield, the hero who stood up
// twelve times, the light in four colors... and then the lake. Three hands write on the same pages, the
// pages are out of order, some are mirrored, one asks you a question, and the last one is still loading.

function isFireBookLast() {
  return typeof getFlametombLastVictim === 'function' && getFlametombLastVictim() === 'knightB';
}

storyDrawings.refugeNames = `
  <svg class="moquete-book-drawing story-scratched" viewBox="0 0 240 150" aria-label="Una pared de cemento con dibujos de chicos, casi todos tapados de hollin">
    <rect x="2" y="2" width="236" height="146" fill="#5a5e62" stroke="#1b1b1b" stroke-dasharray="4 3"/>
    <rect x="20" y="30" width="44" height="56" fill="#ffccbc" transform="rotate(-4 42 58)"/>
    <rect x="28" y="44" width="10" height="22" fill="none" stroke="#1e88e5" stroke-width="2"/>
    <rect x="80" y="24" width="44" height="56" fill="#fff59d" transform="rotate(3 102 52)"/>
    <circle cx="102" cy="46" r="9" fill="#fdd835" stroke="#f9a825"/>
    <rect x="140" y="34" width="44" height="56" fill="#c8e6c9" transform="rotate(-2 162 62)"/>
    <text x="146" y="66" font-family="Comic Sans MS, cursive" font-size="9" fill="#2e7d32">sopa :)</text>
    <path d="M0 150 Q60 70 120 110 T240 60 V150 Z" fill="#111" opacity="0.85"/>
    <path d="M10 140 Q90 90 160 120 T236 96" stroke="#ff7043" stroke-width="2" fill="none" opacity="0.6"/>
    <text x="150" y="140" font-family="Comic Sans MS, cursive" font-size="10" fill="#ff8a65">no mires</text>
  </svg>`;

storyDrawings.lakeHand = `
  <svg class="moquete-book-drawing story-lake-drawing" viewBox="0 0 240 150" aria-label="Un lago oscuro al atardecer. Del agua sale una mano. En el reflejo, una llama que no esta arriba">
    <rect x="2" y="2" width="236" height="146" fill="#2b1d2f" stroke="#0b0b10" stroke-dasharray="4 3"/>
    <rect x="2" y="2" width="236" height="64" fill="#ff8a65" opacity="0.35"/>
    <circle cx="120" cy="66" r="22" fill="#ffb74d" opacity="0.8"/>
    <rect x="2" y="66" width="236" height="82" fill="#0d1b2a"/>
    <path d="M2 80 H238 M20 94 H220 M40 110 H200 M60 126 H180" stroke="#4fc3f7" stroke-width="1" opacity="0.35"/>
    <path d="M112 148 L112 106 L106 96 M112 106 L116 92 M112 106 L122 94 M112 106 L127 100 M112 110 L100 104" stroke="#cfd8dc" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M168 84 Q172 96 168 106 Q178 98 174 86 Q182 92 178 104 Q190 90 176 78 Z" fill="#111" stroke="#ff3d00" stroke-width="1.5" transform="scale(1 -1) translate(0 -190)"/>
    <text x="10" y="22" font-family="Courier New, monospace" font-size="10" fill="#1b1b1b">EL FINAL DEL LAGO</text>
    <text x="150" y="142" font-family="Comic Sans MS, cursive" font-size="9" fill="#90caf9">ayuda</text>
  </svg>`;

storyDrawings.fourSkies = `
  <svg class="moquete-book-drawing" viewBox="0 0 240 150" aria-label="Cuatro cielos pintados uno al lado del otro: blanco, celeste, rosa y rojo. El quinto esta gris">
    <rect x="2" y="2" width="236" height="146" fill="#e8dcc8" stroke="#3e2723" stroke-dasharray="4 3"/>
    <rect x="10" y="20" width="40" height="100" fill="#fffde7"/>
    <rect x="56" y="20" width="40" height="100" fill="#4fc3f7"/>
    <rect x="102" y="20" width="40" height="100" fill="#f48fb1"/>
    <rect x="148" y="20" width="40" height="100" fill="#e53935"/>
    <rect x="194" y="20" width="36" height="100" fill="#8d8a7a"/>
    <text x="16" y="136" font-family="Comic Sans MS, cursive" font-size="8" fill="#3e2723">el</text>
    <text x="58" y="136" font-family="Comic Sans MS, cursive" font-size="8" fill="#3e2723">los chicos</text>
    <text x="104" y="136" font-family="Comic Sans MS, cursive" font-size="8" fill="#3e2723">sopa</text>
    <text x="150" y="136" font-family="Comic Sans MS, cursive" font-size="8" fill="#3e2723">la ley</text>
    <text x="196" y="136" font-family="Comic Sans MS, cursive" font-size="8" fill="#3e2723">yo</text>
  </svg>`;

// the end of the lake: a place that is not finished yet. Half painted, half lines, labels where things go
storyDrawings.unfinishedLake = `
  <svg class="moquete-book-drawing story-unfinished-drawing" viewBox="0 0 240 150" aria-label="El final del lago: la mitad pintada, la otra mitad son solo lineas y carteles. Dos siluetas punteadas que todavia no llegaron">
    <defs>
      <pattern id="bzGrid" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M12 0 H0 V12" fill="none" stroke="#4fc3f7" stroke-width="0.6" opacity="0.6"/>
      </pattern>
    </defs>
    <rect x="2" y="2" width="236" height="146" fill="#fafafa" stroke="#90a4ae" stroke-dasharray="4 3"/>
    <rect x="2" y="2" width="110" height="64" fill="#ff8a65" opacity="0.45"/>
    <circle cx="70" cy="66" r="18" fill="#ffb74d" opacity="0.8"/>
    <rect x="2" y="66" width="110" height="82" fill="#0d1b2a"/>
    <path d="M112 2 L118 30 L108 60 L120 90 L110 120 L116 148" stroke="#263238" stroke-width="2" fill="none"/>
    <rect x="116" y="2" width="122" height="146" fill="url(#bzGrid)"/>
    <rect x="130" y="14" width="56" height="22" fill="none" stroke="#90a4ae" stroke-dasharray="3 2"/>
    <text x="134" y="28" font-family="Courier New, monospace" font-size="7" fill="#607d8b">cielo.png ?</text>
    <path d="M120 72 H236" stroke="#90a4ae" stroke-dasharray="5 3"/>
    <text x="196" y="68" font-family="Courier New, monospace" font-size="7" fill="#607d8b">agua: TODO</text>
    <g fill="none" stroke="#e64a19" stroke-dasharray="2 2" stroke-width="1.5">
      <rect x="140" y="92" width="14" height="30"/><circle cx="147" cy="88" r="5"/>
    </g>
    <g fill="none" stroke="#1e88e5" stroke-dasharray="2 2" stroke-width="1.5">
      <rect x="176" y="92" width="14" height="30"/><circle cx="183" cy="88" r="5"/>
    </g>
    <text x="128" y="134" font-family="Courier New, monospace" font-size="6.5" fill="#e64a19">FM (en camino)</text>
    <text x="172" y="144" font-family="Courier New, monospace" font-size="6.5" fill="#1e88e5">K (en camino)</text>
    <text x="150" y="56" font-family="Courier New, monospace" font-size="9" fill="#b0bec5" transform="rotate(-12 170 52)">NO TERMINADO</text>
  </svg>`;

// (the pages Fire Master wrote up to Sorcerer, without Scammer's note at the end; then the new ones)
function getFireBookLastPages(baseBuild) {
  const savedVictim = window.getFlametombLastVictim;
  const savedDark = window.isFireBookDark;
  let pages;
  window.getFlametombLastVictim = () => 'sorcerer';
  window.isFireBookDark = () => true;
  try {
    pages = baseBuild();
  } finally {
    window.getFlametombLastVictim = savedVictim;
    window.isFireBookDark = savedDark;
  }
  pages.pop();
  // (O.'s page loses its signature: someone else signs now)
  const oPage = pages.find((page) => page.scrawl === '- O.');
  if (oPage) oPage.scrawl = '- O. <s>(ya no)</s>';
  pages.push(
    { kicker: 'CAPITULO 14', title: 'Un bosque sin luz', bizarre: true, text: [
      'despues de la ceniza camine. camine. camine. el bosque no tenia luz. ni la mia. mis manos no prendian.',
      'los arboles hablaban bajito. decian mi nombre. <span class="bz-small">no el de fire master. el otro. el que mama usaba.</span>',
      'pense que si caminaba lo suficiente iba a llegar a un lugar donde nadie me conociera.',
      'llegue.',
    ], scrawl: 'robledal robledal robledal' },
    { kicker: 'CAPITULO 15', title: 'Sopa', bizarre: true, text: [
      'un pueblo chiquito. un sheriff con sombrero que me miro feo y despues me dejo pasar. "la ley es la ley", dijo. "y la ley dice que el que tiene frio entra".',
      'un chef me dio sopa. un raton me miro comer toda la sopa. dos chicos me dibujaron. Celeste me hizo las manos de color naranja. Seto me hizo sin cara porque "no sabia como era".',
      'yo tampoco se.',
      'me guardaron sopa. <span class="bz-big">POR QUE ME GUARDARON SOPA</span>',
    ], drawing: 'refugeNames' },
    { kicker: 'CAPITULO 16', title: '<s>El refugio</s>', bizarre: true, text: [
      '<s>el sheriff</s> <s>Celeste</s> <s>Seto</s> <s>el chef</s> <s>Mochi</s> <s>el guardia</s> <s>la señora de las flores</s> <s>el chico del pan</s> <s>el</s> <s>la</s> <s>los</s>',
      '<span class="bz-small">el sheriff se paro adelante de todos. solo. con un revolver contra el fuego. la ley es la ley.</span>',
      '<span class="bz-small">los chicos se escondieron atras del chef. el chef abrio los brazos. el raton se subio a su hombro. no se fueron. no se fueron.</span>',
      'esta pagina la tache yo. la volvi a escribir. la volvi a tachar. cada vez que la abro los nombres estan otra vez.',
    ], dark: true, scrawl: 'yo no fui yo no fui yo no fui <span class="bz-mirror">yo fui</span>' },
    { kicker: 'CAPITULO 17', title: 'Tres veces', bizarre: true, text: [
      'el caballero estaba ahi. Knight. el de Valdoria. el que vino una vez a capturar a la luz.',
      'puso el escudo. una. dos. tres. su escudo aguanto tres veces.',
      'en la cima yo dije que no tres veces. <span class="bz-ice">tres y tres.</span>',
      'la cuarta nunca falla. la cuarta nunca falla. la cuarta nunca falla.',
      '<span class="bz-burn">ESA FUE LA ULTIMA. LO JURO.</span> <span class="bz-small">lo jure antes tambien.</span>',
    ], drawing: 'tower', dark: true },
    { kicker: 'CAPITULO 18', title: 'Doce', bizarre: true, text: [
      'no estaba muerto. salio del bunker quemado, sin escudo, con media espada. sabia que no podia ganar. vino igual.',
      'le dije que era inutil. EL se rio. el caballero dijo "nadie esta mirando. por eso tengo que hacerlo yo".',
      '<span class="bz-small">alguien estaba mirando.</span>',
      'se levanto doce veces. yo las conte. 1 2 3 4 5 6 7 8 9 10 11 12 <span class="bz-ice">13</span> <span class="bz-small">14 15 16</span> <span class="bz-ghost">17 18 19 20</span>. por que las conte. por que las conte con tanto cuidado.',
      '<span class="bz-small">todavia sigo contando. de noche. no se que cuento.</span>',
    ], margin: [{ who: 'knight', text: 'Fueron trece. La ultima no la viste porque ya habia llegado la luz. - K.' }] },
    { kicker: 'CAPITULO 19', title: 'Sin perdon', bizarre: true, text: [
      'la luz me llevo arriba. muy arriba. me pregunto por que. le dije que no era yo. le dije que EL decidia. le dije que ni siquiera me importaba.',
      'mentira. <span class="bz-small">creo.</span>',
      'pelee contra la luz en el techo del farol. el cielo cambio de color cuatro veces. blanco. celeste. rosa. rojo. cada color era uno de ellos.',
      'despues se puso gris. y se quedo gris.',
    ], drawing: 'fourSkies', margin: [{ who: 'lw', text: 'No te perdone. Todavia no. Pero tampoco te solte. - L.W.' }] },
    { kicker: 'CAPITULO 7B', title: 'Esta pagina va despues', bizarre: true, warp: true, text: [
      '<span class="bz-mirror">si la estas leyendo en orden, la estas leyendo mal.</span>',
      'el lago. el atardecer. el caballero sentado en la orilla tirando piedras. le dije que lo iba a arreglar todo. TODO.',
      'le dije que nada de esto es real. que robledal no es robledal. que la sopa no es sopa. que alguien nos mueve. que alguien da vuelta las paginas.',
      '<span class="bz-big">sos vos.</span>',
    ], drawing: 'lakeHand', dark: true },
    { kicker: 'CAPITULO <span class="bz-mirror">20</span>', title: 'Mas hondo', bizarre: true, warp: true, text: [
      'lo agarre con el fuego. el caballero. lo meti en el agua conmigo. el agua no apaga el fuego negro. lo intente.',
      'le pregunte si queria saber la verdad. dijo que no. lo hundi igual. dijo que no. lo hundi igual. dijo <span class="bz-ice">ayuda</span>. lo hundi igual.',
      '<span class="bz-choice">¿Seguir leyendo?</span> <span class="bz-choice">SI</span> <span class="bz-choice bz-choice-no"><s>NO</s> SI</span>',
      'gracias. igual no habia otra opcion. nunca hay otra opcion. eso es lo que vine a decirte.',
    ], dark: true },
    { kicker: '...', title: 'Otra letra (la tercera)', bizarre: true, knightHand: true, text: [
      'Esto lo escribo yo. Knight.',
      'Encontre este libro en la orilla del lago. Mojado. Las paginas se secaron solas cuando lo abri. Todavia esta tibio.',
      'No se que hay al final del lago. Llegue hasta el borde. Habia blanco. Mucho blanco. Y letras, como estas, flotando.',
      'Fire Master: si lees esto, no te perdono. Pero te voy a encontrar. Y no voy a dejar que lo hagas de nuevo. A nadie. Ni a vos.',
    ], note: '- Knight, caballero de Valdoria (lo que queda)' },
    { kicker: 'O.', title: 'EL PAPEL', bizarre: true, warp: true, text: [
      'EL PAPEL ARDE.',
      'ESTE NO.',
      'ESTE ESTA MOJADO.',
      '<span class="bz-small">el kid ya no duerme. el kid ya no se quien es. yo tampoco. ahora somos tres en un cuerpo y una hoja.</span>',
      '<span class="bz-mirror">DEJA DE DAR VUELTA LAS PAGINAS.</span>',
    ], dark: true, scrawl: '<s>- O.</s> - ?' },
    { kicker: 'PAGINA ∞', title: 'Cargando...', bizarre: true, loading: true, text: [
      'Cargando...',
      'Cargando...',
      'Introduciendo capitulo 7B.',
      '<span class="bz-small">(esta pagina todavia no termino de escribirse. vuelve mas tarde. no vuelvas.)</span>',
    ], dark: true },
    { kicker: 'NOTA DEL AUTOR', title: 'El libro volvio', text: [
      'Este libro lo tire al rio. Despues lo enterre. Despues lo queme (no se quema).',
      'Esta mañana estaba otra vez en mi estante. Mojado. Con olor a humo. Con paginas que no estaban. Y una letra que no es la de Fire Master, ni la de esa cosa, ni la mia.',
      'Ya no lo vendo, ya no lo guardo, ya no lo toco. Si lo tenes vos... perdon. Ahora es tuyo.',
    ], note: '- Scammer (cerrado por duelo)' },
  );
  addFireBookLastExtras(pages);
  return pages;
}

// how many times the wet edition has been opened (it counts, like he counted the blows)
function getFireBookWetOpens() {
  try {
    return Number(localStorage.getItem('moqueteFireBookWetOpens')) || 0;
  } catch (error) {
    return 1;
  }
}

function getScammerClues() {
  try {
    const list = JSON.parse(localStorage.getItem('moqueteScammerClues') || '[]');
    return Array.isArray(list) ? list.filter((item) => typeof item === 'string').slice(-8) : [];
  } catch (error) {
    return [];
  }
}

function saveScammerClue(text) {
  const clean = String(text || '').trim().slice(0, 140);
  if (!clean) return false;
  const list = getScammerClues();
  list.push(clean);
  try {
    localStorage.setItem('moqueteScammerClues', JSON.stringify(list.slice(-8)));
  } catch (error) {
    return false;
  }
  return true;
}

const scammerClueReplies = [
  'Anotado. No se que significa, pero anotado.',
  'Mmm. Interesante. Lo pego en la pared con las otras.',
  'Eso no lo vi! ...O si? Ya no se.',
  'Lo guardo en la caja fuerte. La caja fuerte es una lata de galletitas.',
  'Gracias, kid. En serio. (No le digas a nadie que dije "en serio".)',
];

function addScammerClueBox(page) {
  const box = document.createElement('div');
  box.className = 'scammer-clue-box';
  const label = document.createElement('label');
  label.textContent = 'Tu pista para Scammer:';
  const input = document.createElement('textarea');
  input.maxLength = 140;
  input.rows = 2;
  input.placeholder = 'encontre que...';
  label.appendChild(input);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'DEJAR PISTA';
  const reply = document.createElement('p');
  reply.className = 'scammer-clue-reply';
  const list = document.createElement('ul');
  list.className = 'scammer-clue-list';
  const fill = () => {
    list.replaceChildren();
    const clues = getScammerClues();
    clues.forEach((clue) => {
      const item = document.createElement('li');
      item.textContent = clue;
      list.appendChild(item);
    });
    list.hidden = clues.length === 0;
  };
  button.addEventListener('click', () => {
    if (!saveScammerClue(input.value)) {
      reply.textContent = input.value.trim() ? 'No me entro en la libreta. Proba de nuevo.' : 'Pista vacia. Muy misteriosa. Demasiado. Escribi algo.';
      return;
    }
    input.value = '';
    reply.textContent = scammerClueReplies[Math.floor(Math.random() * scammerClueReplies.length)];
    playTone({ frequency: 880, duration: 0.12, type: 'square', volume: 0.03, slideTo: 1320 });
    fill();
  });
  // (typing here is not a code for the menu, nor a move)
  input.addEventListener('keydown', (event) => event.stopPropagation());
  box.append(label, button, reply, list);
  fill();
  const signature = page.querySelector('.moquete-book-signature');
  if (signature) page.insertBefore(box, signature);
  else page.appendChild(box);
}

function pickFireBookLine(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function addFireBookLastExtras(pages) {
  const opens = getFireBookWetOpens();
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const insertAfter = (title, ...extra) => {
    const index = pages.findIndex((page) => page.title === title);
    pages.splice(index < 0 ? pages.length - 1 : index + 1, 0, ...extra);
  };
  insertAfter('Sopa', { kicker: 'INDICE', title: 'Indice (corregido)', bizarre: true, index: true, text: [
    'Capitulo 1 ........ Dos hermanos ........ p. 1',
    'Capitulo 6 ........ La regla que no se rompe ........ p. <s>6</s> rota',
    'Capitulo 8 ........ Polvo ........ p. 8, p. 13, p. 16, p. 17',
    'Capitulo 15 ........ Sopa ........ p. 15 <span class="bz-small">(fria)</span>',
    'Capitulo 7B ........ <span class="bz-mirror">Esta pagina va despues</span> ........ p. 7B',
    'Capitulo 21 ........ Vos ........ p. <span class="bz-big">ahora</span>',
    'Capitulo 22 ........ ████████ ........ p. ████',
    '<span class="bz-small">el indice no coincide con el libro. el libro no coincide con el indice. uno de los dos miente. el otro tambien.</span>',
  ] });
  insertAfter('<s>El refugio</s>', { kicker: 'ACTA', title: 'Libro de la comisaria de Robledal', bizarre: true, sheriff: true, text: [
    'Dia 1. Sin novedad. Llego un forastero de fuego. Tenia frio. La ley es la ley.',
    'Dia 2. Sin novedad. El forastero ayudo a cargar leña. El chef dice que come como tres.',
    'Dia 3. Sin novedad. Los chicos le hicieron un dibujo. Se lo guardo en el bolsillo. Creo que lloro. No lo anote.',
    'Dia 0. Sin novedad.',
    'Dia -1. Sin novedad.',
    'Dia -2. Sin novedad. Sin novedad. Sin novedad. Sin',
    '<span class="bz-small">(esta letra es la del sheriff. el sheriff no esta. el libro de la comisaria se quemo. esta pagina no deberia existir.)</span>',
  ], note: '- Sheriff de Robledal, de guardia' });
  insertAfter('Tres veces', { kicker: 'EL', title: 'el', bizarre: true, voiceHand: true, text: [
    'hola.',
    'el kid escribe. o. escribe. el caballero escribe. todos escriben en mi libro como si fuera de ellos.',
    'yo no escribo. yo dicto.',
    'cada palabra de este libro la dije yo primero. "respira". "solo una vez". "la cuarta nunca falla". "sopa".',
    'si, sopa tambien.',
    'segui leyendo. me gusta cuando lees. se siente como cuando el fuego sube.',
  ], scrawl: '- (no tengo nombre. vos me lo vas a poner)' });
  insertAfter('Sin perdon', { kicker: 'CAPITULO 15', title: 'Sopa', bizarre: true, echo: true, text: [
    'un pueblo chiquito. no habia sheriff. la puerta estaba abierta. "la ley es la ley", dijo nadie.',
    'un chef me dio sopa. no habia chef. la sopa estaba fria. un raton me miro comer. no habia raton. el raton me sigue mirando.',
    'dos chicos me dibujaron. el dibujo esta en mi bolsillo. en el dibujo ahora tengo cara.',
    '<span class="bz-big">no es mi cara.</span>',
  ], scrawl: 'ya leiste esta pagina. no. esta no.' });
  insertAfter('Esta pagina va despues', { kicker: 'CAPITULO ⅁⥝', title: 'Del otro lado del agua', bizarre: true, flip: true, text: [
    'si podes leer esto sin dar vuelta la cabeza, ya estas abajo del agua con nosotros.',
    'aca abajo el cielo esta en el piso y el piso esta en el cielo. Robledal esta entero. todos estan. todos te saludan.',
    'no saludan con la mano. saludan con la cara. todos con la misma cara.',
    'el caballero todavia no llego. lo estamos esperando. le guardamos sopa.',
  ], dark: true });
  insertAfter('Mas hondo', { kicker: 'CAPITULO 21', title: 'Lo que gotea', bizarre: true, drip: true, text: [
    'el agua entra por las letras.',
    'cada vez que cierro el libro se cae una palabra. ya perdi mi nombre. ya perdi el de mi hermano. ya perdi la palabra para eso que se siente en el pecho cuando',
    pickFireBookLine(['no me acuerdo como seguia.', 'quedaba una palabra mas. se cayo.', 'cuando alguien te guarda sopa.', 'cuando respiras y no sirve.']),
  ], dark: true });
  insertAfter('Otra letra (la tercera)', { kicker: '', title: '(esta pagina se mojo)', bizarre: true, ghost: true, text: [
    '<span class="bz-ghost">perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon perdon</span>',
    '<span class="bz-ghost">aca habia una carta para mi hermano. el agua se la llevo. la carta decia que el agua tibia todavia existe. que solo hay que encontrar el hielo de nuevo.</span>',
    '<span class="bz-ghost">pasa el dedo despacio. a veces las letras vuelven.</span>',
  ] });
  insertAfter('Otra letra (la tercera)', { kicker: 'CAPITULO 22', title: 'Contando', bizarre: true, counting: true, text: [
    `abriste este libro ${opens} ${opens === 1 ? 'vez' : 'veces'}. yo conte. como contaba los golpes. 1 2 3 4 5 6 7 8 9 10 11 12.`,
    `son las ${clock}. ${pickFireBookLine(['a esta hora el refugio dormia.', 'a esta hora el chef ponia la sopa.', 'a esta hora el sheriff hacia la ronda.', 'a esta hora el caballero tiraba piedras al lago.'])}`,
    opens >= 3 ? 'ya volviste otra vez. por que volves. que estas buscando aca adentro.' : 'no vuelvas a abrirlo. (vas a volver.)',
    pickFireBookLine([
      'esta frase cambia cada vez que la lees. esta vez dice: hola.',
      'esta frase cambia cada vez que la lees. esta vez dice: atras tuyo no hay nadie.',
      'esta frase cambia cada vez que la lees. esta vez dice: el lago tiene fondo.',
      'esta frase cambia cada vez que la lees. esta vez dice: knight esta bien. (mentira)',
      'esta frase cambia cada vez que la lees. esta vez dice: perdon.',
    ]),
  ], dark: true });
  // ---- the lake, its end, and why they have not arrived ----
  insertAfter('Lo que gotea',
    { kicker: 'NOTAS', title: 'Notas al pie', bizarre: true, footnotes: true, text: [
      'el lago<sup>1</sup> esta al final del pueblo<sup>2</sup>. el pueblo esta al final del bosque<sup>3</sup>. el bosque esta al final del libro<sup>4</sup>.',
      '<sup>1</sup> ver nota 2.',
      '<sup>2</sup> el pueblo ya no esta. ver nota 3.',
      '<sup>3</sup> el bosque no tiene luz. no se puede ver. ver nota 4.',
      '<sup>4</sup> el libro termina en el lago. ver nota 1.',
      '<sup>5</sup> esta nota no tiene numero en el texto. la escribo igual. por si alguien se pierde. (ya te perdiste.)',
    ] },
    { kicker: 'CAPITULO 23', title: 'El lago', bizarre: true, dark: true, text: [
      'en el lago siempre es el atardecer. siempre. el sol no baja. esta trabado justo en el borde, como una moneda que no termina de caer.',
      'el agua no refleja lo que esta arriba. refleja lo que viene despues. yo me mire una vez. no estaba.',
      'las piedras que tiraba el caballero no se hundian. quedaban flotando abajo del agua, quietas, esperando que alguien las ponga en su lugar.',
      'el lago es mas largo de lo que parece. mucho mas. no tiene otra orilla. tiene un final.',
    ], drawing: 'lakeHand' },
    { kicker: 'CAPITULO 24', title: 'Lo que hay al final', bizarre: true, text: [
      'al final del lago hay blanco.',
      'no blanco de luz. la luz la conozco. blanco de papel. de hoja que todavia nadie dibujo.',
      'hay arboles que no son arboles: son la palabra <span class="bz-placeholder">ARBOL</span> parada en el piso. hay un cielo que dice <span class="bz-placeholder">CIELO</span>. hay una casa que es solo un cuadrado con una cruz adentro.',
      'las letras que se cayeron de este libro estan ahi. flotando. mi nombre esta ahi. el de mi hermano tambien. no las puedo agarrar: no tienen peso todavia.',
      'y hay un ruido. tac. tac tac. tac. como alguien que golpea muy rapido con los dedos. arriba. muy arriba.',
    ], margin: [{ who: 'knight', text: 'Yo tambien lo escuche. Suena como alguien armando el mundo de a pedacitos. - K.' }] },
    { kicker: 'lago_final', title: '[EN CONSTRUCCION]', bizarre: true, unfinished: true, text: [
      '<span class="bz-placeholder">[ aca va el cielo ]</span> <span class="bz-placeholder">[ aca va el agua ]</span>',
      '<span class="bz-placeholder">[ falta: el fondo ]</span> <span class="bz-placeholder">[ falta: la otra orilla ]</span> <span class="bz-placeholder">[ falta: ellos ]</span>',
      '// TODO: que pasa cuando llegan',
      '// TODO: que encuentran',
      '// TODO: <s>quien esta esperando</s> (ya esta)',
      'lago_final.png ........ no encontrado',
      'fire_master_llegada ........ no encontrado',
      'knight_llegada ........ no encontrado',
    ], drawing: 'unfinishedLake' },
    { kicker: 'CAPITULO 25', title: 'Por que no llegamos', bizarre: true, dark: true, text: [
      'nos hundimos. el caballero y yo. y nos hundimos. y nos hundimos.',
      'no llegamos al fondo. no porque sea hondo. porque abajo todavia no hay nada. el lugar no esta hecho.',
      'alguien lo esta haciendo. lo escucho. tac tac tac. a veces para. a veces borra (cuando borra, todo tiembla).',
      'estamos en el medio. ni arriba ni abajo. cayendo despacito, como una hoja que no se decide.',
      'el caballero me pregunto cuanto falta. le dije que no se. <span class="bz-big">nadie sabe.</span> ni el que lo hace.',
    ], margin: [
      { who: 'knight', text: 'Aca el tiempo tambien esta sin hacer. No tengo hambre. No tengo frio. No tengo nada. Solo caigo. - K.' },
      { who: 'scammer', text: '(el que lo hace deberia cobrar por hora)' },
    ] },
    { kicker: 'CAPITULO 25', title: 'Por que no llegamos (la otra version)', bizarre: true, split: true, text: [
      'llegamos.',
      'No llegamos.',
      'el fondo es blanco y blando y huele a sopa.',
      'No hay fondo. Te lo dije. Deja de escribir que hay fondo.',
      'el caballero me dio la mano para no perdernos.',
      'Nunca te di la mano. Te agarre del hombro para que no te escaparas.',
      'es lo mismo.',
      '...No es lo mismo.',
    ] },
  );
  insertAfter('EL PAPEL', { kicker: 'MIENTRAS TANTO', title: 'Capitulo 7B: construyendose', bizarre: true, unfinished: true, text: [
    `████████████${'░'.repeat(4 + (opens % 5))} ${Math.min(99, 61 + opens * 3)}%`,
    'el lugar se esta construyendo. por favor no cierre el libro.',
    'por favor no cierre el lago.',
    'fire master: cayendo. knight: cayendo. el que espera al final: <span class="bz-ice">listo</span>.',
    '<span class="bz-small">hay alguien al final del lago. no llego. siempre estuvo. el lugar se esta haciendo alrededor de el.</span>',
  ] });

  // (and every time you open it, two of its pages trade places: the book does not stay still)
  const wetPages = pages.map((page, at) => (page.bizarre && !page.loading ? at : -1)).filter((at) => at >= 0);
  if (wetPages.length > 4) {
    const first = wetPages[1 + Math.floor(Math.random() * (wetPages.length - 2))];
    const second = wetPages[1 + Math.floor(Math.random() * (wetPages.length - 2))];
    if (first !== second) [pages[first], pages[second]] = [pages[second], pages[first]];
  }

  // ---- Scammer, at the very end: he does not understand anything. And he asks you ----
  insertAfter('El libro volvio',
    { kicker: 'NOTA DEL AUTOR (OTRA)', title: 'No entiendo nada', scammer: true, text: [
      'Bueno. Lo lei entero. Dos veces. Con lentes. No entiendo NADA. Hago una lista, porque a mi las listas me calman:',
      '<span class="bz-list">• Por que el indice no coincide con el libro. Ni siquiera con el mismo indice.<br>• Por que las notas al pie dan vueltas en circulo. Fui de la 1 a la 4 como seis veces. Perdi una tarde.<br>• Quien es "el". Quien es "O.". Quien es "f." en minuscula. Son el mismo? Son tres? Pagan alquiler?<br>• Por que el libro de la comisaria tiene dias negativos. Que paso el dia menos dos?<br>• Por que hay un capitulo 15 dos veces, uno 7B antes del 20, y uno que se lee dado vuelta.<br>• Que es "lago_final.png". Que es un ".png". Se come?<br>• Quien hace "tac tac tac". Y por que lo escucho yo tambien cuando cierro la tienda.<br>• Quien espera al final del lago. "Listo" para que.<br>• Como sabe el libro que hora es. Como sabe cuantas veces lo abriste. YO no se cuantas veces lo abriste.<br>• Por que las paginas cambian de lugar. Les puse numero con birome. Igual se mueven.<br>• Como escribe Knight si esta cayendo en un lago. Con que lapicera.<br>• Que tiene que ver la sopa con todo.</span>',
      'Y lo peor: cada vez que lo abro hay algo distinto. Ayer la pagina del lago tenia un pajaro. Hoy dice PAJARO.',
    ], note: '- Scammer (confundido, pero comercialmente estable)' },
    { kicker: 'NOTA DEL AUTOR (LA ULTIMA, LO JURO)', title: 'Un favor', scammer: true, clues: true, text: [
      'Vos. Si, vos. El que da vuelta las paginas. Ya se que estas ahi: este libro no para de decirlo, asi que algo de razon tendra.',
      'Si encontras algo... lo que sea. Una pagina que yo no vi. Una palabra que no se cae. Un numero que falta. Algo en el lago. Algo en otro lado del juego que se parezca a esto...',
      'Decimelo. Anotalo aca abajo. Capaz no sirve para nada. Capaz sirve para todo. Capaz es la diferencia entre que esos dos lleguen al fondo... o se queden cayendo para siempre.',
      'No te cobro nada. Es la primera vez en mi vida que digo eso. Valoralo.',
    ], note: '- Scammer (atendiendo por la ventanita)' },
  );

  // (after three openings, a last page: it was waiting)
  if (opens >= 3) {
    pages.push({ kicker: '', title: 'Ya volviste', bizarre: true, warp: true, text: [
      'sabia que ibas a volver.',
      'el vendedor cerro la tienda. el caballero esta en el lago. la luz no me habla. el reloj se fue.',
      'solo quedas vos.',
      '<span class="bz-big">no cierres el libro.</span>',
      '<span class="bz-small">(si lo cerras se cae otra palabra. y ya casi no me quedan.)</span>',
    ], dark: true, scrawl: '- f.' });
  }
}

(function hookFireBookLast() {
  if (typeof storyBooks === 'undefined' || !storyBooks.fireBook) return;
  const baseBuild = storyBooks.fireBook.pages;
  const baseOpen = window.openStoryBook;
  if (typeof baseOpen === 'function') {
    window.openStoryBook = function openStoryBookCountingWet(id, ...rest) {
      if (id === 'fireBook' && isFireBookLast()) {
        try {
          localStorage.setItem('moqueteFireBookWetOpens', String(getFireBookWetOpens() + 1));
        } catch (error) {
          // (it forgets)
        }
      }
      return baseOpen.call(this, id, ...rest);
    };
  }
  storyBooks.fireBook.pages = () => (isFireBookLast() ? getFireBookLastPages(baseBuild) : baseBuild());
  const wrap = (name, make) => {
    if (typeof window[name] === 'function') window[name] = make(window[name]);
  };
  // the dark edition... and something worse
  wrap('isFireBookDark', (base) => function isFireBookDarkWithLast(...args) {
    return isFireBookLast() || base.apply(this, args);
  });
  wrap('renderStoryBook', (base) => function renderStoryBookWithLast(...args) {
    const result = base.apply(this, args);
    if (storyBook.id !== 'fireBook' || !isFireBookLast() || !storyBook.element) return result;
    const book = storyBook.element.querySelector('.story-book');
    const page = storyBook.element.querySelector('.story-book-page');
    const entry = storyBook.pages[storyBook.page];
    book.classList.add('story-fire-last');
    if (entry && entry.bizarre) book.classList.add('story-page-bizarre');
    if (entry && entry.warp) book.classList.add('story-page-warp');
    if (entry && entry.knightHand) book.classList.add('story-page-knight');
    if (entry && entry.loading) book.classList.add('story-page-loading');
    if (entry && entry.clues) addScammerClueBox(page);
    ['flip', 'drip', 'ghost', 'echo', 'index', 'sheriff', 'voiceHand', 'counting', 'footnotes', 'unfinished', 'split', 'scammer'].forEach((kind) => {
      if (entry && entry[kind]) book.classList.add(`story-page-${kind}`);
    });
    if (entry && entry.drip) {
      // the letters fall, one by one, as if the water took them
      page.querySelectorAll('p').forEach((paragraph, index) => {
        if (paragraph.classList.contains('moquete-book-signature')) return;
        const text = paragraph.textContent;
        paragraph.innerHTML = text.split('').map((letter, at) => {
          if (letter === ' ') return ' ';
          const falls = (at * 7 + index * 13) % 9 === 0;
          return falls ? `<span class="bz-drop" style="animation-delay: ${((at * 37) % 50) / 10}s">${letter}</span>` : letter;
        }).join('');
      });
    }
    if (!entry) {
      // the cover: one more hand on it
      const kicker = page.querySelector('.moquete-book-kicker');
      if (kicker) kicker.innerHTML = 'EDICION... <span class="bz-mirror">MOJADA</span>';
      const scrawl = page.querySelector('.story-cover-scrawl');
      if (scrawl) scrawl.innerHTML = '<s>no lo leas</s> ya lo estas leyendo';
    }
    // (now and then, a page number that is not right)
    if (entry && entry.bizarre) {
      const wrong = document.createElement('span');
      wrong.className = 'bz-page-number';
      wrong.textContent = ['p. 13', 'p. 7B', 'p. -1', 'p. 12', 'p. ??'][storyBook.page % 5];
      page.appendChild(wrong);
      playTone({ frequency: 60 + (storyBook.page % 4) * 7, duration: 0.5, type: 'sine', volume: 0.03, slideTo: 40 });
    }
    return result;
  });
})();
