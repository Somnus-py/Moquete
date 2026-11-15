// Moquete - Modo RELEVOS
// Each player builds a team of 2 to 7 fighters. When one falls, the next one comes in (with a moment
// of protection while entering). The team that runs out of fighters loses.
// Two optional rules: the one who wins a duel heals a little, and the last fighter of a team
// becomes the LAST HOPE (hits harder, wrapped in a golden aura).

const relayMinTeam = 2;
const relayMaxTeam = 7;
const relayEntryShield = 90;
const relayWinnerHeal = 0.3;
const relayLastHopeDamage = 1.2;
const relayStorageKey = 'moqueteRelaySetup';
const relay = {
  active: false,
  teams: [[], []],
  index: [0, 0],
  banner: null,
  setup: loadRelaySetup(),
  panel: null,
  editing: 0,
};

function loadRelaySetup() {
  const fallback = { size: 3, vsBot: true, heal: true, lastHope: true, map: 'random', teams: [[], []] };
  try {
    const saved = JSON.parse(localStorage.getItem(relayStorageKey) || '{}') || {};
    return { ...fallback, ...saved, teams: Array.isArray(saved.teams) && saved.teams.length === 2 ? saved.teams : fallback.teams };
  } catch (error) {
    return fallback;
  }
}

function saveRelaySetup() {
  try {
    localStorage.setItem(relayStorageKey, JSON.stringify(relay.setup));
  } catch (error) {
    // (only for this session)
  }
}

function getRelayRoster() {
  return getSelectableCharacterTypes().filter((type) => typeof isRiftLostCharacter !== 'function' || !isRiftLostCharacter(type));
}

function getRelayMaps() {
  return Array.from(document.querySelectorAll('#mapScreen .map-option[data-map]'))
    .filter((button) => button.dataset.map !== 'random' && !button.classList.contains('hidden') && !button.classList.contains('locked') && !button.disabled && !button.classList.contains('arcade-map-option'))
    .map((button) => ({ id: button.dataset.map, name: (button.querySelector('span') || button).textContent.trim() }));
}

function fillRelayTeamRandomly(team) {
  const roster = getRelayRoster();
  const size = relay.setup.size;
  const pool = roster.filter((type) => !team.includes(type));
  while (team.length < size) {
    // (no repeats while there are fighters left to choose from)
    const source = pool.length ? pool : roster;
    const pick = source.splice(Math.floor(Math.random() * source.length), 1)[0] || roster[0];
    team.push(pick);
  }
  return team;
}

// ---------- the setup screen ----------
function openRelayPanel() {
  closeRelayPanel();
  const setup = relay.setup;
  // (teams of another size, or with fighters you can't pick anymore, are trimmed)
  const roster = getRelayRoster();
  setup.teams = setup.teams.map((team) => team.filter((type) => roster.includes(type)).slice(0, setup.size));
  const panel = document.createElement('div');
  panel.className = 'rl-modal';
  document.body.appendChild(panel);
  relay.panel = panel;
  panel.addEventListener('click', (event) => {
    if (event.target === panel) closeRelayPanel();
  });
  renderRelayPanel();
}

function closeRelayPanel() {
  if (relay.panel) relay.panel.remove();
  relay.panel = null;
}

// a picture of each fighter, drawn by the real game (made once, then reused)
const relayPreviewCache = {};
function getRelayPreview(type) {
  if (relayPreviewCache[type]) return relayPreviewCache[type];
  let url = '';
  try {
    const mini = typeof renderSkinPreview === 'function' ? renderSkinPreview(type, 'classic') : null;
    if (mini) url = mini.toDataURL();
  } catch (error) {
    url = '';
  }
  relayPreviewCache[type] = url;
  return url;
}

function getRelayFighterInfo(type) {
  const health = typeof getCharacterMaxHealth === 'function' ? getCharacterMaxHealth(type) : 100;
  return { name: characterDisplayNames[type] || type, health };
}

function renderRelayPanel() {
  const panel = relay.panel;
  if (!panel) return;
  const setup = relay.setup;
  const roster = getRelayRoster();
  const maps = getRelayMaps();
  const sideName = (side) => (side === 0 ? 'Jugador 1' : setup.vsBot ? 'Bot' : 'Jugador 2');
  const portrait = (type) => `<span class="fighter-portrait" data-character="${type}" aria-hidden="true"></span>`;
  const lineup = (side) => {
    const team = setup.teams[side];
    const slots = Array.from({ length: setup.size }, (_, slot) => {
      const type = team[slot];
      if (!type) {
        return `<li class="rl-line empty"><span class="rl-order">${slot + 1}</span><em>${side === 1 && setup.vsBot ? 'Al azar' : 'Libre'}</em></li>`;
      }
      const info = getRelayFighterInfo(type);
      const last = slot === setup.size - 1 && setup.lastHope;
      return `
        <li class="rl-line${last ? ' last' : ''}">
          <span class="rl-order">${slot + 1}</span>
          ${portrait(type)}
          <div class="rl-line-name"><b>${info.name}</b><small>♥ ${info.health}${last ? ' · ULTIMA ESPERANZA' : ''}</small></div>
          <div class="rl-line-tools">
            <button type="button" data-rl-move="${side}:${slot}:-1" title="Subir"${slot === 0 ? ' disabled' : ''}>▲</button>
            <button type="button" data-rl-move="${side}:${slot}:1" title="Bajar"${slot >= team.length - 1 ? ' disabled' : ''}>▼</button>
            <button type="button" data-rl-remove="${side}:${slot}" title="Sacar" class="rl-x">✕</button>
          </div>
        </li>`;
    }).join('');
    return `
      <section class="rl-side side-${side}${relay.editing === side ? ' editing' : ''}" data-rl-edit="${side}">
        <header>
          <h4>${sideName(side)}</h4>
          <span class="rl-count">${team.length}/${setup.size}</span>
        </header>
        ${relay.editing === side ? '<p class="rl-hint">Eligiendo...</p>' : '<p class="rl-hint">Toca para elegir aca</p>'}
        <ol class="rl-lineup">${slots}</ol>
        <div class="rl-side-actions">
          <button type="button" data-rl-random="${side}">🎲 Al azar</button>
          <button type="button" data-rl-clear="${side}">Vaciar</button>
        </div>
      </section>`;
  };
  const editingTeam = setup.teams[relay.editing];
  const otherTeam = setup.teams[1 - relay.editing];
  const full = editingTeam.length >= setup.size;
  const ready = setup.teams[0].length === setup.size && (setup.vsBot || setup.teams[1].length === setup.size);
  const mapName = setup.map === 'random' ? 'Mapa aleatorio' : (maps.find((map) => map.id === setup.map) || { name: 'Mapa aleatorio' }).name;
  const toggle = (rule, label, title) => `<button type="button" class="rl-toggle${setup[rule] ? ' on' : ''}" data-rl-toggle="${rule}" title="${title}">${setup[rule] ? '✔' : '✕'} ${label}</button>`;
  panel.innerHTML = `
    <div class="rl-panel" role="dialog" aria-label="Relevos">
      <header class="rl-head">
        <div class="rl-title">
          <h3>RELEVOS</h3>
          <p>Arma tu equipo. Cuando un luchador cae, entra el siguiente. Gana el ultimo equipo en pie.</p>
        </div>
        <button type="button" class="rl-close" title="Cerrar (Esc)">✕</button>
      </header>
      <div class="rl-bar">
        <div class="rl-field"><span>Equipos de</span><div class="rl-seg">${Array.from({ length: relayMaxTeam - relayMinTeam + 1 }, (_, i) => i + relayMinTeam).map((size) => `<button type="button" data-rl-size="${size}" class="${setup.size === size ? 'on' : ''}">${size}</button>`).join('')}</div></div>
        <div class="rl-field"><span>Rival</span><div class="rl-seg"><button type="button" data-rl-bot="1" class="${setup.vsBot ? 'on' : ''}">🤖 Bot</button><button type="button" data-rl-bot="0" class="${setup.vsBot ? '' : 'on'}">👥 2 jugadores</button></div></div>
        <div class="rl-field"><span>Mapa</span><select class="rl-map"><option value="random">🎲 Aleatorio</option>${maps.map((map) => `<option value="${map.id}"${setup.map === map.id ? ' selected' : ''}>${map.name}</option>`).join('')}</select></div>
        <div class="rl-field"><span>Reglas</span><div class="rl-toggles">${toggle('heal', 'Respiro +30%', 'El que gana un duelo recupera 30% de vida')}${toggle('lastHope', 'Ultima esperanza', 'El ultimo del equipo pega +20%')}</div></div>
      </div>
      <div class="rl-main">
        ${lineup(0)}
        <section class="rl-pick">
          <header>
            <h4>Elegi para <b class="side-${relay.editing}">${sideName(relay.editing)}</b></h4>
            <small>${full ? 'Equipo completo. Saca a alguien o toca el otro equipo.' : `Faltan ${setup.size - editingTeam.length}`}</small>
          </header>
          <div class="rl-roster">${roster.map((type) => {
            const info = getRelayFighterInfo(type);
            const order = editingTeam.indexOf(type);
            const inOther = otherTeam.includes(type);
            const preview = getRelayPreview(type);
            return `
              <button type="button" class="rl-fighter${order >= 0 ? ' picked' : ''}" data-rl-pick="${type}"${full && order < 0 ? ' disabled' : ''}>
                ${preview ? `<img src="${preview}" alt="" draggable="false" />` : portrait(type)}
                ${order >= 0 ? `<span class="rl-badge">${order + 1}</span>` : ''}
                ${inOther ? `<span class="rl-badge other side-${1 - relay.editing}" title="Tambien esta en el otro equipo">${otherTeam.indexOf(type) + 1}</span>` : ''}
                <b>${info.name}</b>
                <small>♥ ${info.health}</small>
              </button>`;
          }).join('')}</div>
        </section>
        ${lineup(1)}
      </div>
      <footer class="rl-footer">
        <span class="rl-summary">${setup.size} vs ${setup.size} · ${setup.vsBot ? 'contra el bot' : '2 jugadores'} · ${mapName} · <em>no cuenta en Estadisticas</em></span>
        <button type="button" class="rl-start"${ready ? '' : ' disabled'}>▶ ¡A PELEAR!</button>
        ${ready ? '' : `<small class="rl-missing">${setup.teams[0].length < setup.size ? `Al Jugador 1 le faltan ${setup.size - setup.teams[0].length}.` : `Al Jugador 2 le faltan ${setup.size - setup.teams[1].length}.`}</small>`}
      </footer>
    </div>`;
  const rerender = () => {
    saveRelaySetup();
    playSound('menuMove');
    renderRelayPanel();
  };
  panel.querySelector('.rl-close').addEventListener('click', closeRelayPanel);
  panel.querySelector('.rl-map').addEventListener('change', (event) => {
    setup.map = event.target.value;
    rerender();
  });
  panel.querySelector('.rl-panel').addEventListener('click', (event) => {
    const target = event.target.closest('button, [data-rl-edit]');
    if (!target || target.disabled) return;
    if (target.dataset.rlSize) {
      setup.size = Number(target.dataset.rlSize);
      setup.teams = setup.teams.map((team) => team.slice(0, setup.size));
    } else if (target.dataset.rlBot) {
      setup.vsBot = target.dataset.rlBot === '1';
    } else if (target.dataset.rlToggle) {
      setup[target.dataset.rlToggle] = !setup[target.dataset.rlToggle];
    } else if (target.dataset.rlPick) {
      const team = setup.teams[relay.editing];
      const already = team.indexOf(target.dataset.rlPick);
      // (tapping a picked one takes it out again)
      if (already >= 0) team.splice(already, 1);
      else if (team.length < setup.size) team.push(target.dataset.rlPick);
      // (a full team: move on to the other one)
      if (team.length >= setup.size && relay.editing === 0 && !setup.vsBot && setup.teams[1].length < setup.size) relay.editing = 1;
    } else if (target.dataset.rlMove) {
      const [side, slot, step] = target.dataset.rlMove.split(':').map(Number);
      const team = setup.teams[side];
      const other = slot + step;
      if (other >= 0 && other < team.length) [team[slot], team[other]] = [team[other], team[slot]];
      relay.editing = side;
    } else if (target.dataset.rlRemove) {
      const [side, slot] = target.dataset.rlRemove.split(':').map(Number);
      setup.teams[side].splice(slot, 1);
      relay.editing = side;
    } else if (target.dataset.rlRandom) {
      const side = Number(target.dataset.rlRandom);
      setup.teams[side] = fillRelayTeamRandomly([]);
      relay.editing = side;
    } else if (target.dataset.rlClear) {
      setup.teams[Number(target.dataset.rlClear)] = [];
      relay.editing = Number(target.dataset.rlClear);
    } else if (target.classList.contains('rl-start')) {
      startRelayMatch();
      return;
    } else if (target.dataset.rlEdit) {
      relay.editing = Number(target.dataset.rlEdit);
    } else {
      return;
    }
    event.stopPropagation();
    rerender();
  });
}

// ---------- the match ----------
function startRelayMatch() {
  const setup = relay.setup;
  const teams = [setup.teams[0].slice(), setup.vsBot ? fillRelayTeamRandomly(setup.teams[1].slice()) : setup.teams[1].slice()];
  if (teams[0].length !== setup.size || teams[1].length !== setup.size) return;
  closeRelayPanel();
  relay.active = true;
  relay.teams = teams;
  relay.index = [0, 0];
  relay.banner = null;
  // (the bot setting of Ajustes comes back when the relay ends)
  relay.previousBot = botEnabled;
  botEnabled = setup.vsBot;
  normalArcadeActive = false;
  const maps = getRelayMaps();
  const map = setup.map === 'random' || !maps.some((entry) => entry.id === setup.map) ? (maps[Math.floor(Math.random() * maps.length)] || { id: 'alpha' }).id : setup.map;
  gameModesScreen.classList.add('hidden');
  characterSelectionPlayer = 1;
  selectCharacter(teams[0][0]);
  selectCharacter(teams[1][0]);
  selectMap(map);
  relay.banner = { text: '¡RELEVOS!', sub: `${setup.size} contra ${setup.size}`, life: 110, color: '#ffd54f' };
  renderRelayHud();
}

function relayFighter(side) {
  return side === 0 ? player1 : player2;
}

function isRelayLastHope(side) {
  return relay.active && relay.setup.lastHope && relay.teams[side].length > 1 && relay.index[side] === relay.teams[side].length - 1;
}

// the next fighter of a team comes in
function bringNextRelayFighter(side) {
  relay.index[side] += 1;
  const fighter = relayFighter(side);
  const type = relay.teams[side][relay.index[side]];
  fighter.setCharacterType(type);
  fighter.reset({ x: side === 0 ? 60 : canvas.width - 60 - fighter.width, y: 0 });
  fighter.health = fighter.maxHealth;
  fighter.attacksToTheRight = side === 0;
  ['gamblerStunTimer', 'chronoTimeStopTimer', 'jophFrozenTimer', 'ghostPhaseTimer', 'gamblerInvincibleTimer'].forEach((key) => {
    if (typeof fighter[key] === 'number') fighter[key] = 0;
  });
  fighter.relayShield = relayEntryShield;
  if (side === 1 && typeof resetBotBrain === 'function') resetBotBrain();
  const last = isRelayLastHope(side);
  relay.banner = {
    text: `¡ENTRA ${(characterDisplayNames[type] || type).toUpperCase()}!`,
    sub: last ? 'ULTIMA ESPERANZA' : `${relay.teams[side].length - relay.index[side]} en pie`,
    life: 100,
    color: last ? '#ffd54f' : side === 0 ? '#64b5f6' : '#ef5350',
  };
  playSound(last ? 'achievement' : 'menuSelect');
}

function renderRelayHud() {
  document.querySelectorAll('.rl-hud').forEach((element) => element.remove());
  if (!relay.active) return;
  const panels = document.querySelectorAll('.ui .health-panel');
  relay.teams.forEach((team, side) => {
    const panel = panels[side];
    if (!panel) return;
    const hud = document.createElement('div');
    hud.className = `rl-hud${side === 1 ? ' right' : ''}`;
    hud.innerHTML = team.map((type, slot) => `<span class="rl-hud-slot${slot < relay.index[side] ? ' down' : slot === relay.index[side] ? ' now' : ''}"><span class="fighter-portrait" data-character="${type}" aria-hidden="true"></span></span>`).join('');
    panel.appendChild(hud);
  });
}

function endRelay() {
  if (relay.active && typeof relay.previousBot === 'boolean') botEnabled = relay.previousBot;
  relay.active = false;
  relay.banner = null;
  [player1, player2].forEach((fighter) => {
    fighter.relayShield = 0;
  });
  renderRelayHud();
}

(function hookRelayMode() {
  // a fighter falls: if his team still has someone, the fight goes on
  const baseFinish = finishFight;
  finishFight = function finishFightWithRelay(...args) {
    if (!relay.active || gameOver) return baseFinish.apply(this, args);
    const down = [player1.health <= 0, player2.health <= 0];
    const canContinue = down.map((isDown, side) => !isDown || relay.index[side] < relay.teams[side].length - 1);
    if (!down[0] && !down[1]) return baseFinish.apply(this, args);
    if (!canContinue[0] || !canContinue[1]) {
      // a whole team is out: the real end
      const winner = !canContinue[0] && !canContinue[1] ? null : canContinue[0] ? 0 : 1;
      const result = baseFinish.apply(this, args);
      relay.banner = null;
      if (winner !== null) {
        const survivors = relay.teams[winner].length - relay.index[winner];
        setTimeout(() => showCustomToast(`¡GANA ${winner === 0 ? 'EL JUGADOR 1' : relay.setup.vsBot ? 'EL BOT' : 'EL JUGADOR 2'}!`, `Relevos ${relay.setup.size} contra ${relay.setup.size}: ${survivors === 1 ? 'quedo 1 luchador en pie' : `quedaron ${survivors} luchadores en pie`}.`), 600);
      }
      relay.index = relay.index.map((index, side) => (down[side] ? relay.teams[side].length : index));
      renderRelayHud();
      return result;
    }
    // the one still standing gets a little breath back
    down.forEach((isDown, side) => {
      const other = 1 - side;
      if (isDown && !down[other] && relay.setup.heal) {
        const winner = relayFighter(other);
        winner.health = Math.min(winner.maxHealth, winner.health + winner.maxHealth * relayWinnerHeal);
      }
    });
    down.forEach((isDown, side) => {
      if (isDown) bringNextRelayFighter(side);
    });
    updateCombatHudIdentity();
    updateHealthBars();
    renderRelayHud();
    animationId = requestAnimationFrame(animate);
    return undefined;
  };

  // entering fighters are protected for a moment; the last hope hits harder
  const baseApplyDamage = applyDamage;
  applyDamage = function applyDamageWithRelay(attacker, target, damage, options = {}) {
    if (relay.active && target && target.relayShield > 0) return 0;
    const side = attacker === player1 ? 0 : attacker === player2 ? 1 : -1;
    const boosted = side >= 0 && isRelayLastHope(side) ? damage * relayLastHopeDamage : damage;
    return baseApplyDamage(attacker, target, boosted, options);
  };

  // every frame: the shields wear off, the banner and the last hope's aura are drawn
  const baseUpdate = updateMonkeyCoconuts;
  updateMonkeyCoconuts = function updateMonkeyCoconutsAndRelay(...args) {
    const result = baseUpdate.apply(this, args);
    if (!relay.active) return result;
    const time = performance.now() / 1000;
    [player1, player2].forEach((fighter, side) => {
      if (fighter.relayShield > 0) {
        fighter.relayShield -= 1;
        // a blinking shield while entering
        if (Math.floor(fighter.relayShield / 6) % 2 === 0) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 5]);
          ctx.strokeRect(fighter.position.x - 8, fighter.position.y - 8, fighter.width + 16, fighter.height + 16);
          ctx.restore();
        }
      }
      if (isRelayLastHope(side)) {
        const cx = fighter.position.x + fighter.width / 2;
        const cy = fighter.position.y + fighter.height / 2;
        ctx.save();
        const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, fighter.height * 0.8);
        glow.addColorStop(0, `rgba(255, 213, 79, ${0.18 + Math.sin(time * 5) * 0.06})`);
        glow.addColorStop(1, 'rgba(255, 213, 79, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cx - fighter.height, cy - fighter.height, fighter.height * 2, fighter.height * 2);
        ctx.restore();
      }
    });
    if (relay.banner) {
      const banner = relay.banner;
      banner.life -= 1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, banner.life / 20);
      ctx.textAlign = 'center';
      ctx.font = "900 44px Impact, 'Arial Black', sans-serif";
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#111';
      const y = canvas.height * 0.48;
      ctx.strokeText(banner.text, canvas.width / 2, y);
      ctx.fillStyle = banner.color;
      ctx.fillText(banner.text, canvas.width / 2, y);
      if (banner.sub) {
        ctx.font = "900 20px 'Segoe UI', sans-serif";
        ctx.lineWidth = 5;
        ctx.strokeText(banner.sub, canvas.width / 2, y + 32);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(banner.sub, canvas.width / 2, y + 32);
      }
      ctx.restore();
      if (banner.life <= 0) relay.banner = null;
    }
    return result;
  };

  // "Reiniciar pelea" starts the whole relay again
  const baseReset = resetFight;
  resetFight = function resetFightWithRelay(...args) {
    if (relay.active) {
      relay.index = [0, 0];
      player1.setCharacterType(relay.teams[0][0]);
      player2.setCharacterType(relay.teams[1][0]);
    }
    const result = baseReset.apply(this, args);
    if (relay.active) {
      updateCombatHudIdentity();
      renderRelayHud();
    }
    return result;
  };

  // a relay is just for fun: it never touches Estadisticas
  const baseRecord = recordPersistentFightStatistics;
  recordPersistentFightStatistics = function recordPersistentFightStatisticsUnlessRelay(...args) {
    if (relay.active) {
      currentFightStatisticsRecorded = true;
      return undefined;
    }
    return baseRecord.apply(this, args);
  };
  const baseRecordTime = recordPersistentPlayTimeOnly;
  recordPersistentPlayTimeOnly = function recordPersistentPlayTimeOnlyUnlessRelay(...args) {
    if (relay.active) return undefined;
    return baseRecordTime.apply(this, args);
  };

  const baseReturn = returnToMenu;
  returnToMenu = function returnToMenuWithRelay(...args) {
    endRelay();
    return baseReturn.apply(this, args);
  };

  // the button in the game modes screen
  const list = document.querySelector('#gameModesScreen .character-guide');
  if (list && !document.getElementById('relayModeButton')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'arcade-mode-option relay-mode-option';
    button.id = 'relayModeButton';
    button.innerHTML = '<strong>Relevos</strong><span>Arma un equipo de 2 a 7 luchadores. Cuando uno cae entra el siguiente, y el ultimo en pie se convierte en la ULTIMA ESPERANZA.</span>';
    button.addEventListener('click', openRelayPanel);
    list.appendChild(button);
  }
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && relay.panel) closeRelayPanel();
  });
})();
