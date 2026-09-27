// Moquete - Desbloqueos de personajes y estadisticas
// (parte 3 de 10; los archivos se cargan en orden desde index.html)

function syncMonkeyUnlockUI() {
  if (!monkeyCharacterButton) return;

  const unlockCharacter = getMonkeyUnlockCharacter();
  monkeyCharacterButton.classList.toggle('locked', !unlockCharacter);
  monkeyCharacterButton.disabled = !unlockCharacter || normalArcadeActive;
  monkeyCharacterButton.title = unlockCharacter
    ? `Monkei desbloqueado: ${characterDisplayNames[unlockCharacter]} tiene ${monkeyUnlockWinRate}% de winrate`
    : `Consigue exactamente ${monkeyUnlockWinRate}% de winrate con algun personaje para jugar con Monkei`;
}

function isScammerUnlocked() {
  return Boolean(unlockedAchievements.scammerDefeated);
}

function syncScammerUnlockUI() {
  if (!scammerCharacterButton) return;
  const unlocked = isScammerUnlocked();
  scammerCharacterButton.classList.toggle('hidden', !unlocked);
  scammerCharacterButton.disabled = !unlocked || normalArcadeActive;
  scammerCharacterButton.classList.toggle('arcade-disabled', unlocked && normalArcadeActive);
}

function syncGhostUnlockUI() {
  if (!ghostCharacterButton) return;

  const unlocked = isGhostUnlocked();
  ghostCharacterButton.classList.toggle('locked', !unlocked);
  ghostCharacterButton.disabled = !unlocked;
  ghostCharacterButton.title = unlocked ? t('ghostUnlockedTitle') : t('ghostLockedTitle');
}

function syncLightWarriorUnlockUI() {
  if (!lightWarriorCharacterButton) return;

  const unlocked = isLightWarriorUnlocked();
  lightWarriorCharacterButton.classList.toggle('locked', !unlocked);
  lightWarriorCharacterButton.disabled = !unlocked;
  lightWarriorCharacterButton.title = unlocked ? t('lightWarriorUnlockedTitle') : t('lightWarriorLockedTitle');
}

function syncDivineGeneralUnlockUI() {
  if (!divineGeneralCharacterButton) return;

  const unlocked = isDivineGeneralUnlocked();
  divineGeneralCharacterButton.classList.toggle('locked', !unlocked);
  divineGeneralCharacterButton.disabled = !unlocked;
  divineGeneralCharacterButton.title = unlocked ? t('divineUnlockedTitle') : t('divineLockedTitle');
}

function hasCompletedDivineGeneralTrial() {
  return divineGeneralTrialAchievements.every((achievementId) => Boolean(unlockedAchievements[achievementId]));
}

function tryUnlockDivineGeneral() {
  if (isDivineGeneralUnlocked() || !hasCompletedDivineGeneralTrial()) return;

  unlockAchievement('divineGeneralUnlocked');
}

function migrateUnlocksFromExistingAchievements() {
  if (!unlockedAchievements.ghostUnlocked && unlockedAchievements.darkRoom) {
    unlockedAchievements.ghostUnlocked = true;
    saveAchievements();
  }
  tryUnlockDivineGeneral();
}

function showAchievementToast(achievementId) {
  if (!achievementToast || !achievementToastTitle || !achievementToastDescription) return;

  const details = getAchievementDetails(achievementId);
  achievementToastTitle.innerText = details.title;
  achievementToastDescription.innerText = details.description;
  achievementToast.classList.remove('hidden');
  achievementToast.classList.add('show');

  if (achievementToastTimer) clearTimeout(achievementToastTimer);
  achievementToastTimer = setTimeout(() => {
    achievementToast.classList.remove('show');
    achievementToastTimer = setTimeout(() => {
      achievementToast.classList.add('hidden');
    }, 220);
  }, 2600);
}

function unlockAchievement(achievementId) {
  if (!achievementIds.includes(achievementId) || unlockedAchievements[achievementId]) return;

  unlockedAchievements[achievementId] = true;
  saveAchievements();
  awardAchievementCoins(achievementId);
  syncAchievementsUI();
  playSound('achievement');
  showAchievementToast(achievementId);
  if (achievementId === 'darkRoom') {
    unlockAchievement('ghostUnlocked');
  }
  if (achievementId !== 'divineGeneralUnlocked') {
    tryUnlockDivineGeneral();
  }
}

function createEmptyCharacterStatistics() {
  return characterTypes.reduce((stats, characterType) => {
    stats[characterType] = {
      played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    };
    return stats;
  }, {});
}

function createEmptyStatistics() {
  return {
    totalPlayTimeMs: 0,
    totalFights: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    botFights: 0,
    characters: createEmptyCharacterStatistics(),
  };
}

function normalizeStatistics(savedStatistics) {
  const statistics = createEmptyStatistics();
  if (!savedStatistics || typeof savedStatistics !== 'object') return statistics;

  statistics.totalPlayTimeMs = Math.max(0, Number(savedStatistics.totalPlayTimeMs) || 0);
  statistics.totalFights = Math.max(0, Number(savedStatistics.totalFights) || 0);
  statistics.wins = Math.max(0, Number(savedStatistics.wins) || 0);
  statistics.losses = Math.max(0, Number(savedStatistics.losses) || 0);
  statistics.draws = Math.max(0, Number(savedStatistics.draws) || 0);
  statistics.botFights = Math.max(0, Number(savedStatistics.botFights) || 0);

  characterTypes.forEach((characterType) => {
    const savedCharacterStats =
      savedStatistics.characters && typeof savedStatistics.characters === 'object'
        ? savedStatistics.characters[characterType]
        : null;
    if (!savedCharacterStats || typeof savedCharacterStats !== 'object') return;

    statistics.characters[characterType].played = Math.max(0, Number(savedCharacterStats.played) || 0);
    statistics.characters[characterType].wins = Math.max(0, Number(savedCharacterStats.wins) || 0);
    statistics.characters[characterType].losses = Math.max(0, Number(savedCharacterStats.losses) || 0);
    statistics.characters[characterType].draws = Math.max(0, Number(savedCharacterStats.draws) || 0);
  });

  return statistics;
}

function loadStatistics() {
  try {
    return normalizeStatistics(JSON.parse(localStorage.getItem(statisticsStorageKey) || 'null'));
  } catch (error) {
    return createEmptyStatistics();
  }
}

function saveStatistics() {
  try {
    localStorage.setItem(statisticsStorageKey, JSON.stringify(persistentStatistics));
  } catch (error) {
    // localStorage can be blocked in some browser modes; statistics still work for the session.
  }
}

function formatStatisticsDuration(milliseconds) {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatWinRate(wins, losses) {
  const decidedFights = wins + losses;
  if (decidedFights <= 0) return '0%';
  return `${Math.round((wins / decidedFights) * 100)}%`;
}

function ensureCharacterStatistic(characterType) {
  if (!persistentStatistics.characters[characterType]) {
    persistentStatistics.characters[characterType] = {
      played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    };
  }

  return persistentStatistics.characters[characterType];
}

function createCharacterStatsRow(characterType) {
  const row = document.createElement('div');
  row.className = 'stats-row';
  row.dataset.statsCharacter = characterType;

  const characterCell = document.createElement('div');
  characterCell.className = 'stats-character';

  const portrait = document.createElement('span');
  portrait.className = 'fighter-portrait';
  portrait.dataset.character = characterType;
  portrait.setAttribute('aria-hidden', 'true');

  const name = document.createElement('b');
  name.innerText = characterDisplayNames[characterType] || characterType;

  characterCell.append(portrait, name);
  row.appendChild(characterCell);

  ['played', 'wins', 'losses', 'draws', 'winRate'].forEach((statName) => {
    const value = document.createElement('strong');
    value.dataset.stat = statName;
    value.innerText = statName === 'winRate' ? '0%' : '0';
    row.appendChild(value);
  });

  return row;
}

function renderCharacterStatisticsRows() {
  if (!statsCharacterRows) return;

  getVisibleStatisticsCharacterTypes().forEach((characterType) => {
    if (statsCharacterRows.querySelector(`[data-stats-character="${characterType}"]`)) return;
    statsCharacterRows.appendChild(createCharacterStatsRow(characterType));
  });
}

function recordPersistentFightStatistics(winnerPlayer, fightTime) {
  if (normalArcadeActive || currentFightStatisticsRecorded || fightStartedAt <= 0) return;

  const characterStats = ensureCharacterStatistic(player1.characterType);
  persistentStatistics.totalPlayTimeMs += Math.max(0, fightTime);
  persistentStatistics.totalFights += 1;
  if (botEnabled) persistentStatistics.botFights += 1;

  characterStats.played += 1;

  if (!winnerPlayer) {
    persistentStatistics.draws += 1;
    characterStats.draws += 1;
  } else if (winnerPlayer === player1) {
    persistentStatistics.wins += 1;
    characterStats.wins += 1;
  } else {
    persistentStatistics.losses += 1;
    characterStats.losses += 1;
  }

  currentFightStatisticsRecorded = true;
  saveStatistics();
  syncMonkeyUnlockUI();
}

function recordPersistentPlayTimeOnly(fightTime) {
  if (normalArcadeActive || currentFightStatisticsRecorded || fightStartedAt <= 0) return;

  persistentStatistics.totalPlayTimeMs += Math.max(0, fightTime);
  currentFightStatisticsRecorded = true;
  saveStatistics();
}

function syncStatisticsUI() {
  if (!statsCharacterRows) return;

  renderCharacterStatisticsRows();

  statsTotalPlayTime.innerText = formatStatisticsDuration(persistentStatistics.totalPlayTimeMs);
  statsTotalFights.innerText = persistentStatistics.totalFights;
  statsTotalWins.innerText = persistentStatistics.wins;
  statsTotalLosses.innerText = persistentStatistics.losses;
  statsTotalDraws.innerText = persistentStatistics.draws;
  statsWinRate.innerText = formatWinRate(persistentStatistics.wins, persistentStatistics.losses);
  statsBotFights.innerText = persistentStatistics.botFights;

  getVisibleStatisticsCharacterTypes().forEach((characterType) => {
    const row = statsCharacterRows.querySelector(`[data-stats-character="${characterType}"]`);
    if (!row) return;

    const characterStats = ensureCharacterStatistic(characterType);
    const statValues = {
      played: characterStats.played,
      wins: characterStats.wins,
      losses: characterStats.losses,
      draws: characterStats.draws,
      winRate: formatWinRate(characterStats.wins, characterStats.losses),
    };

    Object.entries(statValues).forEach(([statName, statValue]) => {
      const statElement = row.querySelector(`[data-stat="${statName}"]`);
      if (statElement) statElement.innerText = statValue;
    });
  });
}

function resetPersistentStatistics() {
  if (!confirm('Reiniciar todas las estadisticas guardadas?')) return;

  Object.assign(persistentStatistics, createEmptyStatistics());
  saveStatistics();
  syncStatisticsUI();
  syncMonkeyUnlockUI();
}

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

// loaded here (not at the top) so it runs after loadStatistics exists once the code is split into files
const persistentStatistics = loadStatistics();

