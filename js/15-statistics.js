// Moquete - Estadisticas, segunda version
// Three tabs: a summary (a winrate ring, totals and highlights), the fighters (sortable, filterable,
// as a list or as cards) and the progress (achievements, chapters and their trophies).
// The old summary and table stay in the page (other code still writes to them), only hidden.

const statsViewStorageKey = 'moqueteStatsView';
const statsMinFightsForRecords = 5;
const statsSortOptions = [
  { id: 'played', label: 'Mas usados' },
  { id: 'winRate', label: 'Winrate' },
  { id: 'wins', label: 'Victorias' },
  { id: 'losses', label: 'Derrotas' },
  { id: 'name', label: 'A - Z' },
];
const statsView = loadStatsView();

function loadStatsView() {
  const fallback = { tab: 'summary', sort: 'played', layout: 'list', hideUnused: false };
  try {
    return { ...fallback, ...(JSON.parse(localStorage.getItem(statsViewStorageKey) || '{}') || {}) };
  } catch (error) {
    return fallback;
  }
}

function saveStatsView() {
  try {
    localStorage.setItem(statsViewStorageKey, JSON.stringify(statsView));
  } catch (error) {
    // (the view still works for this session)
  }
}

function getStatsWinRate(stats) {
  const decided = stats.wins + stats.losses;
  return decided > 0 ? Math.round((stats.wins / decided) * 100) : null;
}

function getStatsRateColor(rate) {
  if (rate === null) return '#9e9e9e';
  if (rate >= 70) return '#2e7d32';
  if (rate >= 55) return '#7cb342';
  if (rate >= 45) return '#f9a825';
  if (rate >= 30) return '#ef6c00';
  return '#c62828';
}

function statsEscape(text) {
  return String(text).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

// every visible fighter, with its numbers and its special states
function getStatsFighters() {
  return getVisibleStatisticsCharacterTypes().map((type) => {
    const stats = ensureCharacterStatistic(type);
    const secret = type === 'jophestar' && typeof isJophestarUnlocked === 'function' && !isJophestarUnlocked();
    const lost = typeof isRiftLostCharacter === 'function' && isRiftLostCharacter(type);
    return {
      type,
      name: characterDisplayNames[type] || type,
      played: stats.played,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      winRate: getStatsWinRate(stats),
      secret,
      lost,
    };
  });
}

function sortStatsFighters(fighters) {
  const sorted = fighters.slice();
  const byName = (a, b) => a.name.localeCompare(b.name, 'es');
  const compare = {
    played: (a, b) => b.played - a.played || byName(a, b),
    wins: (a, b) => b.wins - a.wins || byName(a, b),
    losses: (a, b) => b.losses - a.losses || byName(a, b),
    winRate: (a, b) => (b.winRate === null ? -1 : b.winRate) - (a.winRate === null ? -1 : a.winRate) || b.played - a.played,
    name: byName,
  }[statsView.sort] || byName;
  sorted.sort(compare);
  // (the secret one always goes last)
  return sorted.sort((a, b) => Number(a.secret) - Number(b.secret));
}

function statsPortrait(fighter) {
  return `<span class="fighter-portrait" data-character="${fighter.type}" aria-hidden="true"></span>`;
}

function statsRing(rate, size, label) {
  const shown = rate === null ? 0 : rate;
  const color = getStatsRateColor(rate);
  return `<div class="sx-ring" style="--size: ${size}px; --rate: ${shown}; --ring: ${color}"><b>${rate === null ? '—' : `${rate}%`}</b>${label ? `<small>${label}</small>` : ''}</div>`;
}

function statsSplitBar(wins, losses, draws) {
  const total = wins + losses + draws;
  if (!total) return '<div class="sx-split empty"></div>';
  const part = (value) => `${(value / total) * 100}%`;
  return `<div class="sx-split"><i class="w" style="width: ${part(wins)}"></i><i class="d" style="width: ${part(draws)}"></i><i class="l" style="width: ${part(losses)}"></i></div>`;
}

// ---------- the summary tab ----------
function renderStatsSummary() {
  const totals = persistentStatistics;
  const rate = getStatsWinRate(totals);
  const fighters = getStatsFighters().filter((fighter) => !fighter.secret);
  const used = fighters.filter((fighter) => fighter.played > 0);
  const pvp = Math.max(0, totals.totalFights - totals.botFights);
  const averageMs = totals.totalFights > 0 ? totals.totalPlayTimeMs / totals.totalFights : 0;
  const ranked = fighters.filter((fighter) => fighter.played >= statsMinFightsForRecords && fighter.winRate !== null);
  const favorite = used.slice().sort((a, b) => b.played - a.played)[0];
  const best = ranked.slice().sort((a, b) => b.winRate - a.winRate || b.played - a.played)[0];
  const worst = ranked.slice().sort((a, b) => a.winRate - b.winRate || b.played - a.played)[0];
  const tile = (label, value, note = '') => `<div class="sx-tile"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ''}</div>`;
  const highlight = (title, fighter, value, empty) => `
    <div class="sx-highlight${fighter ? '' : ' empty'}">
      <span>${title}</span>
      ${fighter ? `<div class="sx-highlight-who">${statsPortrait(fighter)}<b>${statsEscape(fighter.name)}</b></div><strong>${value}</strong>` : `<p>${empty}</p>`}
    </div>`;
  return `
    <div class="sx-summary">
      <div class="sx-overall">
        ${statsRing(rate, 150, 'winrate')}
        <ul class="sx-legend">
          <li class="w"><i></i>Victorias <b>${totals.wins}</b></li>
          <li class="l"><i></i>Derrotas <b>${totals.losses}</b></li>
          <li class="d"><i></i>Empates <b>${totals.draws}</b></li>
        </ul>
        ${statsSplitBar(totals.wins, totals.losses, totals.draws)}
      </div>
      <div class="sx-tiles">
        ${tile('Tiempo de juego', formatStatisticsDuration(totals.totalPlayTimeMs), averageMs ? `${formatStatisticsDuration(averageMs)} por pelea` : '')}
        ${tile('Peleas', totals.totalFights)}
        ${tile('Contra bot', totals.botFights, totals.totalFights ? `${Math.round((totals.botFights / totals.totalFights) * 100)}% de las peleas` : '')}
        ${tile('Contra jugadores', pvp)}
        ${tile('Personajes usados', `${used.length}/${fighters.length}`)}
        ${tile('Monedas', coinWallet.balance.toLocaleString('es-ES'))}
      </div>
    </div>
    <div class="sx-highlights">
      ${highlight('Favorito', favorite, favorite ? `${favorite.played} peleas` : '', 'Todavia no peleaste con nadie.')}
      ${highlight('Mejor winrate', best, best ? `${best.winRate}%` : '', `Pelea ${statsMinFightsForRecords} veces con alguien para verlo aca.`)}
      ${highlight('Le falta practica', worst && worst !== best ? worst : null, worst ? `${worst.winRate}%` : '', 'Nadie todavia. Bien ahi.')}
    </div>`;
}

// ---------- the fighters tab ----------
function renderStatsFighters() {
  let fighters = sortStatsFighters(getStatsFighters());
  if (statsView.hideUnused) fighters = fighters.filter((fighter) => fighter.played > 0 || fighter.secret);
  const maxPlayed = Math.max(1, ...fighters.map((fighter) => fighter.played));
  const toolbar = `
    <div class="sx-toolbar">
      <div class="sx-chips" role="group" aria-label="Ordenar por">
        <span>Ordenar:</span>
        ${statsSortOptions.map((option) => `<button type="button" data-sx-sort="${option.id}" class="${statsView.sort === option.id ? 'on' : ''}">${option.label}</button>`).join('')}
      </div>
      <div class="sx-chips">
        <button type="button" data-sx-hide class="${statsView.hideUnused ? 'on' : ''}">Ocultar sin usar</button>
        <button type="button" data-sx-layout="list" class="${statsView.layout === 'list' ? 'on' : ''}" title="Lista">&#9776; Lista</button>
        <button type="button" data-sx-layout="cards" class="${statsView.layout === 'cards' ? 'on' : ''}" title="Tarjetas">&#9638; Tarjetas</button>
      </div>
    </div>`;
  if (!fighters.length) return `${toolbar}<p class="sx-empty">Todavia no peleaste con ningun personaje.</p>`;
  const stateClass = (fighter) => `${fighter.secret ? ' is-secret' : ''}${fighter.lost ? ' is-lost' : ''}${fighter.played ? '' : ' is-unused'}`;
  const note = (fighter) => (fighter.secret ? '<em>Encontra la manera de desbloquearlo. ゴゴゴ...</em>' : fighter.lost ? '<em>Perdido en la grieta...</em>' : '');
  if (statsView.layout === 'cards') {
    return `${toolbar}<div class="sx-cards">${fighters.map((fighter) => `
      <div class="sx-card${stateClass(fighter)}" data-stats-character="${fighter.type}">
        <div class="sx-card-head">${statsPortrait(fighter)}<b>${statsEscape(fighter.name)}</b></div>
        ${fighter.secret ? note(fighter) : `
        ${statsRing(fighter.winRate, 74)}
        <p>${fighter.played} ${fighter.played === 1 ? 'pelea' : 'peleas'}</p>
        <div class="sx-wld"><span class="w">${fighter.wins}V</span><span class="l">${fighter.losses}D</span><span class="d">${fighter.draws}E</span></div>
        ${note(fighter)}`}
      </div>`).join('')}</div>`;
  }
  return `${toolbar}
    <div class="sx-list">
      <div class="sx-list-head"><span>#</span><span>Personaje</span><span>Usos</span><span>V</span><span>D</span><span>E</span><span>Winrate</span></div>
      ${fighters.map((fighter, index) => `
      <div class="sx-list-row${stateClass(fighter)}" data-stats-character="${fighter.type}">
        <span class="sx-rank">${fighter.secret ? '?' : index + 1}</span>
        <div class="sx-who">${statsPortrait(fighter)}<div><b>${statsEscape(fighter.name)}</b>${note(fighter)}</div></div>
        <div class="sx-usage"><i style="width: ${fighter.secret ? 0 : (fighter.played / maxPlayed) * 100}%"></i><b>${fighter.secret ? '—' : fighter.played}</b></div>
        <strong class="w">${fighter.secret ? '—' : fighter.wins}</strong>
        <strong class="l">${fighter.secret ? '—' : fighter.losses}</strong>
        <strong class="d">${fighter.secret ? '—' : fighter.draws}</strong>
        <div class="sx-rate">
          <span class="sx-pill" style="background: ${getStatsRateColor(fighter.secret ? null : fighter.winRate)}">${fighter.secret || fighter.winRate === null ? '—' : `${fighter.winRate}%`}</span>
          ${fighter.secret ? '' : statsSplitBar(fighter.wins, fighter.losses, fighter.draws)}
        </div>
      </div>`).join('')}
    </div>`;
}

// ---------- the progress tab ----------
function renderStatsProgress() {
  const achievementsDone = typeof achievementIds !== 'undefined' ? achievementIds.filter((id) => unlockedAchievements[id]).length : 0;
  const achievementsTotal = typeof achievementIds !== 'undefined' ? achievementIds.length : 0;
  const chapters = typeof chapterTrophyList !== 'undefined' ? chapterTrophyList : [];
  const shown = chapters.filter((entry) => !entry.routeB || (typeof getChapterTrophyTier === 'function' && getChapterTrophyTier(entry)));
  const done = shown.filter((entry) => typeof isTrophyChapterDone === 'function' && isTrophyChapterDone(entry.key));
  const bar = (value, total) => `<div class="sx-progress"><i style="width: ${total ? (value / total) * 100 : 0}%"></i></div>`;
  return `
    <div class="sx-progress-cards">
      <div class="sx-tile"><span>Logros</span><strong>${achievementsDone}/${achievementsTotal}</strong>${bar(achievementsDone, achievementsTotal)}</div>
      <div class="sx-tile"><span>Capitulos completados</span><strong>${done.length}/${shown.length}</strong>${bar(done.length, shown.length)}</div>
      <div class="sx-tile"><span>Monedas</span><strong>${coinWallet.balance.toLocaleString('es-ES')}</strong></div>
    </div>
    <div class="sx-chapters">
      ${shown.map((entry) => {
        const tier = typeof getChapterTrophyTier === 'function' ? getChapterTrophyTier(entry) : null;
        const material = tier && typeof chapterTrophyMaterials !== 'undefined' ? chapterTrophyMaterials[tier] : null;
        const badge = material ? `<span class="sx-tier" style="background: linear-gradient(135deg, ${material.stops.join(', ')}); box-shadow: 0 0 10px ${material.glow}">${material.name}</span>` : '<span class="sx-tier none">Sin terminar</span>';
        return `<div class="sx-chapter${tier ? '' : ' pending'}"><b>${entry.num}</b><span>${statsEscape(entry.name)}</span>${badge}</div>`;
      }).join('')}
    </div>`;
}

// ---------- the whole screen ----------
function renderStatsScreen() {
  const screen = document.getElementById('statsScreen');
  if (!screen) return;
  let root = screen.querySelector('.sx');
  if (!root) {
    root = document.createElement('div');
    root.className = 'sx';
    screen.querySelector('h2').after(root);
    root.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.sxTab) statsView.tab = button.dataset.sxTab;
      else if (button.dataset.sxSort) statsView.sort = button.dataset.sxSort;
      else if (button.dataset.sxLayout) statsView.layout = button.dataset.sxLayout;
      else if (button.hasAttribute('data-sx-hide')) statsView.hideUnused = !statsView.hideUnused;
      else return;
      saveStatsView();
      playSound('menuMove');
      renderStatsScreen();
    });
  }
  const tabs = [['summary', 'Resumen'], ['fighters', 'Personajes'], ['progress', 'Progreso']];
  const body = statsView.tab === 'fighters' ? renderStatsFighters() : statsView.tab === 'progress' ? renderStatsProgress() : renderStatsSummary();
  root.innerHTML = `
    <div class="sx-tabs" role="tablist">
      ${tabs.map(([id, label]) => `<button type="button" role="tab" data-sx-tab="${id}" class="${statsView.tab === id ? 'on' : ''}" aria-selected="${statsView.tab === id}">${label}</button>`).join('')}
    </div>
    <div class="sx-body">${body}</div>`;
}

(function hookNewStatistics() {
  const baseSync = syncStatisticsUI;
  syncStatisticsUI = function syncStatisticsUIWithNewScreen(...args) {
    const result = baseSync.apply(this, args);
    renderStatsScreen();
    return result;
  };
})();
