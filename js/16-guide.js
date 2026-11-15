// Moquete - Guia, segunda version
// Tabs (Controles, Personajes, Mapas, Eventos), a search box, and cards instead of long paragraphs.
// The texts still live in index.html (each old section becomes a tab): edit them there.

const guideViewStorageKey = 'moqueteGuideTab';
const guideControls = [
  {
    title: 'Jugador 1',
    color: '#42a5f5',
    keys: [['A', 'D', 'Moverse'], ['W', 'Saltar'], ['S', 'Atacar'], ['E', 'Golpe fuerte'], ['Q', 'Especial 1'], ['F', 'Especial 2'], ['R', 'Especial 3']],
  },
  {
    title: 'Jugador 2',
    color: '#ef5350',
    keys: [['←', '→', 'Moverse'], ['↑', 'Saltar'], ['↓', 'Atacar'], ['Shift', 'Golpe fuerte'], ['/', 'Especial 1'], ['.', 'Especial 2'], ['Enter', 'Especial 3']],
  },
];
const guideControlTips = [
  ['Q + F', 'Muchos personajes tienen un combo secreto apretando dos especiales a la vez.'],
  ['ESC', 'Pausa la pelea y vuelve al menu.'],
  ['ENTER', 'Avanza los dialogos de las escenas.'],
  ['Celular', 'Joystick y botones en pantalla. Los combos se hacen apretando dos botones juntos.'],
];
const guideTabIcons = { Controles: '🎮', Personajes: '🥊', 'Mapas y audio': '🗺', 'Eventos especiales': '⚡' };

let guideTab = (() => {
  try {
    return localStorage.getItem(guideViewStorageKey) || 'Controles';
  } catch (error) {
    return 'Controles';
  }
})();
let guideSearch = '';

function normalizeGuideText(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// the old sections of the guide, read once: [{ title, entries: [{ name, text }] }]
function readGuideSections() {
  const screen = document.getElementById('guideScreen');
  return Array.from(screen.querySelectorAll(':scope > .guide-section')).map((section) => {
    const title = section.querySelector('h3') ? section.querySelector('h3').textContent.trim() : '';
    const entries = Array.from(section.querySelectorAll('.character-guide > span')).map((span) => {
      const strong = span.querySelector('strong');
      const name = strong ? strong.textContent.trim() : '';
      const text = span.textContent.replace(name, '').trim();
      return { name, text };
    });
    return { title, entries, element: section };
  });
}

function findGuideCharacterType(name) {
  const wanted = normalizeGuideText(name);
  const found = Object.entries(characterDisplayNames).find(([, display]) => normalizeGuideText(display) === wanted);
  return found ? found[0] : null;
}

function findGuideMapPreview(name) {
  const wanted = normalizeGuideText(name);
  const button = Array.from(document.querySelectorAll('.map-option[data-map]')).find((option) => {
    const label = option.querySelector('span');
    const text = label ? normalizeGuideText(label.textContent) : '';
    return text && (text === wanted || wanted.includes(text) || text.includes(wanted));
  });
  if (!button) return '';
  const preview = button.querySelector('.map-preview');
  if (!preview) return '';
  const classes = Array.from(button.classList).filter((name) => name !== 'map-option' && name !== 'hidden' && name !== 'selected').join(' ');
  return `<div class="gx-map-preview ${classes}">${preview.outerHTML}</div>`;
}

// numbers worth seeing at a glance: health and base damage
function readGuideChips(text) {
  const chips = [];
  const health = text.match(/(\d+)\s+(?:de\s+)?vida/i);
  const damage = text.match(/(\d+(?:[.,]\d+)?)\s+(?:de\s+)?(?:dano|danio|daño)(?:\s+base)?/i);
  if (health) chips.push(`<span class="gx-chip hp">♥ ${health[1]}</span>`);
  if (damage && /base/i.test(text.slice(damage.index, damage.index + damage[0].length + 6))) chips.push(`<span class="gx-chip dmg">⚔ ${damage[1]}</span>`);
  // (only when the fighter itself is unlocked that way, not a variant mentioned later)
  const unlock = /^se desbloquea/i.test(text.trim());
  if (unlock) chips.push('<span class="gx-chip lock">🔒 Desbloqueable</span>');
  return chips.join('');
}

function guideEscape(text) {
  return String(text).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

// the search marks what it found
function guideHighlight(text) {
  const safe = guideEscape(text);
  if (!guideSearch) return safe;
  const plain = normalizeGuideText(text);
  const index = plain.indexOf(normalizeGuideText(guideSearch));
  if (index < 0) return safe;
  const end = index + guideSearch.length;
  return `${guideEscape(text.slice(0, index))}<mark>${guideEscape(text.slice(index, end))}</mark>${guideEscape(text.slice(end))}`;
}

function guideMatches(entry) {
  if (!guideSearch) return true;
  const query = normalizeGuideText(guideSearch);
  return normalizeGuideText(`${entry.name} ${entry.text}`).includes(query);
}

function renderGuideControls() {
  const tips = guideControlTips.filter(([key, text]) => guideMatches({ name: key, text }));
  const players = guideControls.map((player) => {
    const keys = player.keys.filter((row) => guideMatches({ name: row.slice(0, -1).join(' '), text: row[row.length - 1] }));
    if (!keys.length) return '';
    return `
      <div class="gx-panel gx-controls" style="--accent: ${player.color}">
        <h4>${player.title}</h4>
        ${keys.map((row) => `<div class="gx-key-row"><span class="gx-keys">${row.slice(0, -1).map((key) => `<kbd>${guideEscape(key)}</kbd>`).join('')}</span><span>${guideHighlight(row[row.length - 1])}</span></div>`).join('')}
      </div>`;
  }).join('');
  return `
    <div class="gx-controls-grid">${players}</div>
    ${tips.length ? `<div class="gx-panel gx-tips"><h4>Trucos</h4>${tips.map(([key, text]) => `<div class="gx-key-row"><span class="gx-keys"><kbd>${guideEscape(key)}</kbd></span><span>${guideHighlight(text)}</span></div>`).join('')}</div>` : ''}`;
}

function renderGuideEntries(section) {
  const entries = section.entries.filter(guideMatches);
  if (!entries.length) return '';
  const isCharacters = section.title === 'Personajes';
  const isMaps = section.title.startsWith('Mapas');
  return `<div class="gx-cards${isCharacters ? ' characters' : ''}">${entries.map((entry) => {
    const type = isCharacters ? findGuideCharacterType(entry.name) : null;
    const portrait = type ? `<span class="fighter-portrait" data-character="${type}" aria-hidden="true"></span>` : '';
    const preview = isMaps ? findGuideMapPreview(entry.name) : '';
    const chips = isCharacters ? readGuideChips(entry.text) : '';
    return `
      <article class="gx-card">
        ${preview}
        <header>${portrait}<h4>${guideHighlight(entry.name)}</h4></header>
        ${chips ? `<div class="gx-chips">${chips}</div>` : ''}
        <p>${guideHighlight(entry.text)}</p>
      </article>`;
  }).join('')}</div>`;
}

function renderGuideScreen() {
  const screen = document.getElementById('guideScreen');
  if (!screen) return;
  const sections = readGuideSections();
  sections.forEach((section) => section.element.classList.add('gx-old'));
  let root = screen.querySelector('.gx');
  if (!root) {
    root = document.createElement('div');
    root.className = 'gx';
    root.innerHTML = `
      <div class="gx-top">
        <div class="gx-tabs" role="tablist"></div>
        <label class="gx-search"><span aria-hidden="true">🔍</span><input type="search" placeholder="Buscar en la guia..." aria-label="Buscar en la guia" /></label>
      </div>
      <div class="gx-body"></div>`;
    screen.querySelector('h2').after(root);
    root.querySelector('.gx-tabs').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-gx-tab]');
      if (!button) return;
      guideTab = button.dataset.gxTab;
      try {
        localStorage.setItem(guideViewStorageKey, guideTab);
      } catch (error) {
        // (only for this session)
      }
      playSound('menuMove');
      renderGuideScreen();
    });
    const input = root.querySelector('.gx-search input');
    input.addEventListener('input', () => {
      guideSearch = input.value.trim();
      renderGuideScreen();
    });
    // (typing in the box must not move the fighters or trigger shortcuts)
    input.addEventListener('keydown', (event) => event.stopPropagation());
  }
  if (!sections.some((section) => section.title === guideTab)) guideTab = sections[0] ? sections[0].title : 'Controles';
  // while searching, every tab shows how many results it has
  const counts = Object.fromEntries(sections.map((section) => {
    if (!guideSearch) return [section.title, null];
    if (section.title === 'Controles') {
      const keys = guideControls.reduce((sum, player) => sum + player.keys.filter((row) => guideMatches({ name: row.slice(0, -1).join(' '), text: row[row.length - 1] })).length, 0);
      return [section.title, keys + guideControlTips.filter(([key, text]) => guideMatches({ name: key, text })).length];
    }
    return [section.title, section.entries.filter(guideMatches).length];
  }));
  root.querySelector('.gx-tabs').innerHTML = sections.map((section) => `
    <button type="button" role="tab" data-gx-tab="${guideEscape(section.title)}" class="${section.title === guideTab ? 'on' : ''}${counts[section.title] === 0 ? ' none' : ''}" aria-selected="${section.title === guideTab}">
      <span aria-hidden="true">${guideTabIcons[section.title] || '📖'}</span>${guideEscape(section.title)}${counts[section.title] !== null ? `<b>${counts[section.title]}</b>` : ''}
    </button>`).join('');
  const current = sections.find((section) => section.title === guideTab);
  const body = current.title === 'Controles' ? renderGuideControls() : renderGuideEntries(current);
  root.querySelector('.gx-body').innerHTML = body || `<p class="gx-empty">No hay nada que diga "${guideEscape(guideSearch)}" en esta pestaña.</p>`;
}

(function hookNewGuide() {
  const button = document.getElementById('guideButton');
  if (button) button.addEventListener('click', () => renderGuideScreen());
  renderGuideScreen();
})();
