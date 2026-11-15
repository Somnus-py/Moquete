// Moquete - Alpha edition (code "alpha")
// The game as it was before the 2.0: no codes, five fighters (Normal, Fire Master without his super
// version, Living Tank, Cowboy and Reflecter), the first maps and a plainer interface.
// The clean map is called "Beta" now... except here, where it gets its old name back: "Alpha".

const alphaEditionFighters = ['normal', 'fireMaster', 'tank', 'cowboy', 'reflecter'];
const alphaEditionMaps = ['alpha', 'foundry', 'desert', 'military'];
const alphaEdition = { active: false };

function setAlphaEdition(active) {
  alphaEdition.active = active;
  document.body.classList.toggle('alpha-edition', active);
  // the clean map: "Beta" today, "Alpha" back then
  const cleanMap = document.querySelector('.map-option[data-map="alpha"] > span:first-child');
  if (cleanMap) cleanMap.textContent = active ? 'Alpha' : 'Beta';
}

function isAlphaEditionActive() {
  return alphaEdition.active;
}

(function hookAlphaEdition() {
  const baseOpen = openOldDays;
  openOldDays = function openAlphaEdition(...args) {
    setAlphaEdition(true);
    return baseOpen.apply(this, args);
  };

  const baseClose = closeOldDays;
  closeOldDays = function closeAlphaEdition(...args) {
    setAlphaEdition(false);
    return baseClose.apply(this, args);
  };

  // "Jugar": choose the fighters (only the five of back then) and a map, like it used to be
  startOldDaysGame = function startAlphaEditionGame() {
    setAlphaEdition(true);
    deactivateBlindMode();
    resetDebugSettings();
    oldDaysScreen.classList.add('hidden');
    openCharacterSelect();
  };

  const baseSelectable = getSelectableCharacterTypes;
  getSelectableCharacterTypes = function getSelectableCharacterTypesAlpha(...args) {
    const list = baseSelectable.apply(this, args);
    return alphaEdition.active ? list.filter((type) => alphaEditionFighters.includes(type)) : list;
  };

  const baseSelect = selectCharacter;
  selectCharacter = function selectCharacterAlpha(characterType, secretVariant = null) {
    if (!alphaEdition.active) return baseSelect.call(this, characterType, secretVariant);
    // (no secret versions back then: not even Super Fire Master)
    if (!alphaEditionFighters.includes(characterType)) return undefined;
    return baseSelect.call(this, characterType, null);
  };

  const baseSelectMap = selectMap;
  selectMap = function selectMapAlpha(mapName) {
    if (alphaEdition.active && mapName !== 'random' && !alphaEditionMaps.includes(mapName)) return undefined;
    return baseSelectMap.call(this, mapName);
  };

  // the wardrobe did not exist yet
  if (typeof getFighterSkinId === 'function') {
    const baseSkin = getFighterSkinId;
    getFighterSkinId = function getFighterSkinIdAlpha(fighter) {
      return alphaEdition.active ? 'classic' : baseSkin(fighter);
    };
  }

  // leaving a fight goes back to the Alpha edition menu, not to today's
  const baseReturn = returnToMenu;
  returnToMenu = function returnToMenuAlpha(...args) {
    const result = baseReturn.apply(this, args);
    if (alphaEdition.active) {
      titleScreen.classList.add('hidden');
      oldDaysScreen.classList.remove('hidden');
    }
    return result;
  };

  setAlphaEdition(false);
})();
