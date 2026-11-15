// Moquete - Logros y Changelog, segunda version
// Logros: progress, categories, a got / missing filter, a search box and cards with their coin reward.
// Changelog: the versions on one side (newest first) and the chosen one on the other, plus a search.
// The texts still live in index.html (the old cards and sections are read and then hidden).

const achievementCategories = [
  { id: 'all', label: 'Todos', icon: '🏆' },
  { id: 'fights', label: 'Peleas', icon: '🥊', ids: ['firstWin', 'fastWin', 'clutchWin', 'flawlessWin', 'specialist', 'perfectDuel', 'jackpot', 'reflectedWin', 'casinoRoyalty', 'meltdownMaster', 'tankCommander', 'prismDriver', 'timeExecutioner', 'absoluteDominance'] },
  { id: 'fighters', label: 'Personajes', icon: '🔓', ids: ['heroOfLight', 'ghostUnlocked', 'divineGeneralUnlocked', 'superFireMasterUnlocked', 'knightUnlocked', 'shaolinDefeated', 'scammerDefeated'] },
  { id: 'arcade', label: 'Arcade', icon: '🕹', ids: ['normalArcadeCompleted', 'fireArcadeCompleted', 'gamblerArcadeCompleted', 'reflecterArcadeCompleted', 'omegariusDefeated', 'originsCompleted'] },
  { id: 'secrets', label: 'Secretos', icon: '❓', ids: ['darkRoom', 'oldDays', 'debug', 'codeBreaker'] },
];
const achievementsView = { category: 'all', filter: 'all', search: '' };
const changelogView = { version: null, search: '' };

function axNormalize(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function axEscape(text) {
  return String(text).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

function axHighlight(text, search) {
  const safe = axEscape(text);
  if (!search) return safe;
  const index = axNormalize(text).indexOf(axNormalize(search));
  if (index < 0) return safe;
  return `${axEscape(text.slice(0, index))}<mark>${axEscape(text.slice(index, index + search.length))}</mark>${axEscape(text.slice(index + search.length))}`;
}

function axButtonReset(root) {
  // (typing in a search box must not trigger the menu's secret codes or the fighters)
  root.querySelectorAll('input').forEach((input) => input.addEventListener('keydown', (event) => event.stopPropagation()));
}

// ================= LOGROS =================
function readAchievements() {
  const screen = document.getElementById('achievementsScreen');
  return Array.from(screen.querySelectorAll('.achievements-grid > [data-achievement]')).map((card) => {
    const id = card.dataset.achievement;
    const icon = card.querySelector('.achievement-icon');
    const category = achievementCategories.find((entry) => entry.ids && entry.ids.includes(id));
    return {
      id,
      title: card.querySelector('strong') ? card.querySelector('strong').innerText.trim() : id,
      description: card.querySelector('span:last-child') ? card.querySelector('span:last-child').innerText.trim() : '',
      icon: icon ? icon.outerHTML : '',
      unlocked: Boolean(unlockedAchievements[id]),
      reward: (typeof achievementCoinRewards !== 'undefined' && achievementCoinRewards[id]) || 0,
      category: category ? category.id : 'secrets',
    };
  });
}

function renderAchievementsScreen() {
  const screen = document.getElementById('achievementsScreen');
  if (!screen) return;
  const grid = screen.querySelector('.achievements-grid');
  if (grid) grid.classList.add('ax-old');
  const all = readAchievements();
  let root = screen.querySelector('.ax');
  if (!root) {
    root = document.createElement('div');
    root.className = 'ax';
    root.innerHTML = `
      <div class="ax-progress"></div>
      <div class="ax-top">
        <div class="ax-tabs" role="tablist"></div>
        <div class="ax-tools">
          <div class="ax-chips"></div>
          <label class="ax-search"><span aria-hidden="true">🔍</span><input type="search" placeholder="Buscar logro..." aria-label="Buscar logro" /></label>
        </div>
      </div>
      <div class="ax-body"></div>`;
    screen.querySelector('h2').after(root);
    root.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.axCategory) achievementsView.category = button.dataset.axCategory;
      else if (button.dataset.axFilter) achievementsView.filter = button.dataset.axFilter;
      else return;
      playSound('menuMove');
      renderAchievementsScreen();
    });
    const input = root.querySelector('.ax-search input');
    input.addEventListener('input', () => {
      achievementsView.search = input.value.trim();
      renderAchievementsScreen();
    });
    axButtonReset(root);
  }
  // the progress: how many, and how many coins they paid
  const done = all.filter((entry) => entry.unlocked);
  const earned = done.reduce((sum, entry) => sum + entry.reward, 0);
  const possible = all.reduce((sum, entry) => sum + entry.reward, 0);
  const percent = all.length ? Math.round((done.length / all.length) * 100) : 0;
  root.querySelector('.ax-progress').innerHTML = `
    <div class="ax-progress-main"><strong>${done.length}<small>/${all.length}</small></strong><span>logros conseguidos</span></div>
    <div class="ax-progress-bar"><i style="width: ${percent}%"></i><b>${percent}%</b></div>
    <div class="ax-progress-coins"><span>Monedas ganadas</span><strong><i class="ax-coin" aria-hidden="true"></i>${earned.toLocaleString('es-ES')}<small> / ${possible.toLocaleString('es-ES')}</small></strong></div>`;
  root.querySelector('.ax-tabs').innerHTML = achievementCategories.map((category) => {
    const inside = category.id === 'all' ? all : all.filter((entry) => entry.category === category.id);
    const got = inside.filter((entry) => entry.unlocked).length;
    return `<button type="button" role="tab" data-ax-category="${category.id}" class="${achievementsView.category === category.id ? 'on' : ''}${got === inside.length && inside.length ? ' complete' : ''}"><span aria-hidden="true">${category.icon}</span>${category.label}<b>${got}/${inside.length}</b></button>`;
  }).join('');
  root.querySelector('.ax-chips').innerHTML = [['all', 'Todos'], ['done', 'Conseguidos'], ['missing', 'Pendientes']]
    .map(([id, label]) => `<button type="button" data-ax-filter="${id}" class="${achievementsView.filter === id ? 'on' : ''}">${label}</button>`).join('');
  const search = achievementsView.search;
  const shown = all
    .filter((entry) => achievementsView.category === 'all' || entry.category === achievementsView.category)
    .filter((entry) => achievementsView.filter === 'all' || (achievementsView.filter === 'done' ? entry.unlocked : !entry.unlocked))
    .filter((entry) => !search || axNormalize(`${entry.title} ${entry.description}`).includes(axNormalize(search)))
    // (the ones you have first: it feels better)
    .sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  root.querySelector('.ax-body').innerHTML = shown.length
    ? `<div class="ax-cards">${shown.map((entry) => `
      <article class="ax-card${entry.unlocked ? ' got' : ''}">
        <div class="ax-icon">${entry.icon}</div>
        <div class="ax-text">
          <h4>${axHighlight(entry.title, search)}</h4>
          <p>${axHighlight(entry.description, search)}</p>
          <div class="ax-meta">
            <span class="ax-state">${entry.unlocked ? '✔ Conseguido' : '🔒 Pendiente'}</span>
            ${entry.reward ? `<span class="ax-reward"><i class="ax-coin" aria-hidden="true"></i>${entry.reward.toLocaleString('es-ES')}</span>` : ''}
          </div>
        </div>
      </article>`).join('')}</div>`
    : '<p class="ax-empty">No hay logros que coincidan.</p>';
}

// ================= CHANGELOG =================
function readChangelog() {
  const screen = document.getElementById('infoScreen');
  const versions = [];
  Array.from(screen.querySelectorAll(':scope > .guide-section')).forEach((section) => {
    section.classList.add('cx-old');
    const title = section.querySelector('h3') ? section.querySelector('h3').textContent.trim() : '';
    const match = title.match(/^Actualizacion\s+([\d.]+)/i);
    const items = Array.from(section.querySelectorAll('.character-guide > span')).map((span) => span.innerHTML.trim());
    if (match || !versions.length) {
      versions.push({ number: match ? match[1] : '?', title, old: /anterior/i.test(title), isNew: section.classList.contains('changelog-new'), intro: items, sections: [] });
    } else {
      versions[versions.length - 1].sections.push({ title, items });
    }
  });
  return versions;
}

function renderChangelogScreen() {
  const screen = document.getElementById('infoScreen');
  if (!screen) return;
  const versions = readChangelog();
  if (!versions.length) return;
  let root = screen.querySelector('.cx');
  if (!root) {
    root = document.createElement('div');
    root.className = 'cx';
    root.innerHTML = `
      <div class="cx-side">
        <label class="ax-search"><span aria-hidden="true">🔍</span><input type="search" placeholder="Buscar..." aria-label="Buscar en el changelog" /></label>
        <div class="cx-versions"></div>
      </div>
      <div class="cx-body"></div>`;
    screen.querySelector('h2').after(root);
    root.querySelector('.cx-versions').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-cx-version]');
      if (!button) return;
      changelogView.version = button.dataset.cxVersion;
      playSound('menuMove');
      renderChangelogScreen();
      root.querySelector('.cx-body').scrollTop = 0;
    });
    const input = root.querySelector('.cx-side input');
    input.addEventListener('input', () => {
      changelogView.search = input.value.trim();
      renderChangelogScreen();
    });
    axButtonReset(root);
  }
  if (!versions.some((version) => version.number === changelogView.version)) changelogView.version = versions[0].number;
  const search = axNormalize(changelogView.search);
  const plain = (html) => axNormalize(html.replace(/<[^>]+>/g, ' '));
  const hits = (version) => {
    if (!search) return null;
    const texts = [...version.intro, ...version.sections.flatMap((section) => [section.title, ...section.items])];
    return texts.filter((text) => plain(text).includes(search)).length;
  };
  root.querySelector('.cx-versions').innerHTML = versions.map((version) => {
    const count = hits(version);
    return `<button type="button" data-cx-version="${version.number}" class="${version.number === changelogView.version ? 'on' : ''}${count === 0 ? ' none' : ''}">
      <strong>${version.number}</strong>
      <span>${version.isNew && !version.old ? '<em>NUEVO</em>' : version.old ? 'anterior' : ''}</span>
      ${count ? `<b>${count}</b>` : ''}
    </button>`;
  }).join('');
  const current = versions.find((version) => version.number === changelogView.version);
  const mark = (html) => {
    if (!search) return html;
    // (only the text between tags is marked)
    return html.replace(/>([^<]+)</g, (whole, text) => `>${text.replace(new RegExp(changelogView.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (found) => `<mark>${found}</mark>`)}<`);
  };
  const itemsHtml = (items) => items.filter((item) => !search || plain(item).includes(search)).map((item) => `<li>${mark(`>${item}<`).slice(1, -1)}</li>`).join('');
  const sections = current.sections
    .map((section) => {
      const titleHit = search && axNormalize(section.title).includes(search);
      const list = titleHit ? section.items.map((item) => `<li>${item}</li>`).join('') : itemsHtml(section.items);
      return list ? `<section class="cx-card"><h4>${axEscape(section.title)}</h4><ul>${list}</ul></section>` : '';
    })
    .join('');
  const intro = itemsHtml(current.intro);
  root.querySelector('.cx-body').innerHTML = `
    <header class="cx-head">
      <h3>Actualizacion ${axEscape(current.number)}</h3>
      ${current.isNew && !current.old ? '<span class="cx-badge new">LO MAS NUEVO</span>' : current.old ? '<span class="cx-badge">Version anterior</span>' : ''}
    </header>
    ${intro ? `<section class="cx-card cx-intro"><ul>${intro}</ul></section>` : ''}
    ${sections}
    ${!intro && !sections ? '<p class="ax-empty">Nada de esta version coincide con la busqueda.</p>' : ''}`;
}

(function hookAchievementsAndChangelog() {
  const baseSync = syncAchievementsUI;
  syncAchievementsUI = function syncAchievementsUIWithNewScreen(...args) {
    const result = baseSync.apply(this, args);
    renderAchievementsScreen();
    return result;
  };
  const achievementsOpen = document.getElementById('achievementsButton');
  if (achievementsOpen) achievementsOpen.addEventListener('click', () => renderAchievementsScreen());
  const infoOpen = document.getElementById('infoButton');
  if (infoOpen) infoOpen.addEventListener('click', () => renderChangelogScreen());
  renderAchievementsScreen();
  renderChangelogScreen();
})();
