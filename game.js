const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let musicStep = 0;
let menuMusicPlaying = false;
let jackpotTrack = null;
let jackpotTrackPlayToken = 0;
let jackpotTrackFallbackTimer = null;
let jackpotTrackStopTimer = null;
const jackpotTrackSource = 'assets/audio/jackpot.mp3';
const jackpotTrackStartTime = 67;
const jackpotTrackEndTime = 106;
const defaultAudioSettings = {
  master: 1,
  music: 1,
  sfx: 1,
};
const audioSettings = { ...defaultAudioSettings };
const gravity = 0.6;
const ground = 520;
const attackDamage = 5;
const heavyAttackDamage = 15;
const playerMoveSpeed = 5;
const tankDamage = 25;
const tankAttackCooldown = 55;
const tankShellDamage = 45;
const tankShellSpeed = playerMoveSpeed * 1.6;
const tankShellCooldown = 900;
const fireballDamage = 20;
const fireballSpeed = playerMoveSpeed * 2;
const fireballCooldown = 600;
const fireBeamDamage = 75;
const fireBeamSpeed = playerMoveSpeed * 5;
const fireBeamCooldown = 1200;
const infernoSplitCooldown = 1500;
const infernoSplitFireballDamageMultiplier = 0.75;
const infernoSplitBeamDamageMultiplier = 0.72;
const cowboyHealth = 80;
const cowboyBulletDamage = 10;
const cowboyBulletSpeed = fireBeamSpeed;
const cowboyBurstShots = 12;
const cowboyBurstInterval = 10;
const cowboyBurstCooldown = 480;
const reflecterHealth = 150;
const reflecterDamage = 10;
const reflecterShieldDuration = 300;
const reflecterShieldCooldown = 600;
const reflecterHealAmount = 35;
const mirrorLuckReflecterHealth = 165;
const upgradedReflecterHealth = 300;
const upgradedReflecterDamage = 20;
const upgradedReflecterShieldDuration = 420;
const upgradedReflecterShieldCooldown = 420;
const mirrorLuckReflecterShieldDuration = 360;
const mirrorLuckReflecterShieldCooldown = 520;
const mirrorLuckReflecterCopyDamageMultiplier = 1.25;
const kaiokenDuration = 600;
const kaiokenCooldown = 900;
const kaiokenHealthBoost = 50;
const kaiokenComboCooldown = 180;
const kaiokenComboHits = 6;
const kaiokenComboInterval = 4;
const kaiokenComboDamage = 6;
const kaiokenSecretDuration = 720;
const kaiokenSecretHealthBoost = 65;
const kaiokenSecretDamageMultiplier = 2.2;
const kaiokenSecretSpeedMultiplier = 2.75;
const kaiokenSecretComboHits = 7;
const kaiokenSecretComboDamage = 7;
const switcherHealth = 120;
const switcherAbilityCooldown = 360;
const gamblerHealth = 150;
const gamblerRollCooldown = 120;
const gamblerLuckCooldown = 300;
const gamblerLuckStep = 0.05;
const gamblerLuckCap = 1;
const gamblerLuckWaveDuration = 24;
const gamblerRollDisplayDuration = 150;
const gamblerStunDuration = 180;
const gamblerDamageBoostDuration = 600;
const gamblerSpeedBoostDuration = 600;
const gamblerJackpotMinDuration = 900;
const gamblerJackpotMaxDuration = 2220;
const gamblerLoadedDiceLuckBonus = 0.1;
const gamblerLoadedDiceJackpotChance = 0.08;
const sorcererHealth = 175;
const sorcererOrbDamage = 35;
const sorcererOrbSpeed = playerMoveSpeed * 7.5;
const sorcererOrbCooldown = 700;
const sorcererGravityDuration = 300;
const sorcererGravityCooldown = 900;
const sorcererGravityPull = 1.65;
const sorcererSecretOrbDamage = 65;
const sorcererSecretOrbChargeTime = 300;
const sorcererSecretOrbCooldown = 1500;
const sorcererSecretOrbMinSpeed = playerMoveSpeed * 2.8;
const sorcererSecretOrbMaxSpeed = playerMoveSpeed * 4.4;
const sorcererSecretComboWindow = 110;
const chronoHealth = 175;
const chronoBladeDamage = 20;
const chronoBladeSpeed = playerMoveSpeed * 3.6;
const chronoBladeCooldown = 300;
const chronoBladeSlowDuration = 200;
const chronoSlowCooldown = 780;
const chronoSlowDuration = 180;
const chronoSlowFactor = 0.9;
const chronoSlowRadius = 350;
const chronoSlowLockDuration = 45;
const chronoSlowPull = 1.2;
const chronoMarkDuration = 360;
const chronoMarkDamage = 28;
const chronoTimeStopDuration = 150;
const chronoTimeStopCooldown = 1200;
const qfComboWindow = 110;
const ghostHealth = 50;
const ghostDamage = 1;
const ghostPhaseDuration = 300;
const ghostPhaseCooldown = 60;
const ghostPhaseContactDamage = 2;
const ghostPhaseContactInterval = 6;
const ghostPhaseSpeedMultiplier = 1.65;
const divineGeneralHealth = 200;
const divineGeneralDamage = 7;
const divineGeneralMoveSpeed = playerMoveSpeed * 0.68;
const divineGeneralAdaptDuration = 180;
const divineGeneralAdaptCooldown = 540;
const divineGeneralAdaptReduction = 0.15;
const divineGeneralMaxAdaptStacks = 6;
const divineFullAdaptHealth = 250;
const divineFullAdaptMinStacks = 6;
const divineFullAdaptMaxStacks = 10;
const divineGeneralCounterCooldown = 420;
const divineGeneralCounterRange = 260;
const divineFullAdaptTypes = [
  'melee',
  'meleeCombo',
  'mirrorStrike',
  'fireProjectile',
  'fireBeam',
  'tankShell',
  'bullet',
  'arcaneOrb',
  'arcaneSecret',
  'temporalBlade',
  'temporalMark',
  'spiritPhase',
  'luck',
  'prismStrike',
];
const switcherModes = ['green', 'red', 'blue', 'yellow'];
const switcherModeColors = {
  red: '#ef5350',
  blue: '#42a5f5',
  green: '#66bb6a',
  yellow: '#fdd835',
};
const switcherModeStats = {
  red: { moveSpeed: playerMoveSpeed * 0.72, damage: 12 },
  blue: { moveSpeed: playerMoveSpeed * 1.45, damage: 3 },
  green: { moveSpeed: playerMoveSpeed, damage: 6 },
  yellow: { moveSpeed: playerMoveSpeed * 0.78, damage: 6 },
};
const switcherPrismCooldownMultiplier = 0.66;
const switcherPrismOverdriveCooldownMultiplier = 0.55;
const characterTypes = ['normal', 'fireMaster', 'tank', 'cowboy', 'reflecter', 'switcher', 'sorcerer', 'gambler', 'chrono', 'ghost', 'divineGeneral'];
const hiddenCharacterTypes = ['divineGeneral'];
const debugAffectedCharacters = Object.fromEntries(characterTypes.map((characterType) => [characterType, true]));
const defaultDebugSettings = {
  damageMultiplier: 1,
  healthMultiplier: 1,
  moveMultiplier: 1,
  cooldownMultiplier: 1,
  gravityMultiplier: 1,
  projectileMultiplier: 1,
  durationMultiplier: 1,
  knockbackMultiplier: 1,
};
const debugSettings = { ...defaultDebugSettings };
const achievementStorageKey = 'moqueteAchievements';
const statisticsStorageKey = 'moqueteStatistics';
const languageStorageKey = 'moqueteLanguage';
const supportedLanguages = ['es', 'en', 'pt'];
const achievementIds = [
  'firstWin',
  'fastWin',
  'clutchWin',
  'perfectDuel',
  'jackpot',
  'reflectedWin',
  'darkRoom',
  'oldDays',
  'debug',
  'codeBreaker',
  'prismDriver',
  'casinoRoyalty',
  'meltdownMaster',
  'tankCommander',
  'flawlessWin',
  'specialist',
  'timeExecutioner',
  'absoluteDominance',
  'ghostUnlocked',
  'divineGeneralUnlocked',
];
const divineGeneralTrialAchievements = [
  'perfectDuel',
  'reflectedWin',
  'casinoRoyalty',
  'meltdownMaster',
  'tankCommander',
  'timeExecutioner',
  'absoluteDominance',
];
const achievementDetailsByLanguage = {
  es: {
    firstWin: { title: 'Primer moquete', description: 'Gana tu primera pelea.' },
    fastWin: { title: 'Sin perder tiempo', description: 'Gana una ronda en menos de 30 segundos.' },
    clutchWin: { title: 'Ultimo aliento', description: 'Gana una pelea con 10 de vida o menos.' },
    perfectDuel: { title: 'Una bala basto', description: 'Gana con la bala unica del Duelo del Desierto.' },
    jackpot: { title: 'JACKPOT!!', description: 'Saca triple 7 con Gambler.' },
    reflectedWin: { title: 'Victoria reflejada', description: 'Gana usando una habilidad copiada por Reflecter.' },
    darkRoom: { title: 'Luces fuera', description: 'Juega una partida en Dark Room.' },
    oldDays: { title: 'Viaje al pasado', description: 'Entra a Alpha edition.' },
    debug: { title: 'Intruso debug', description: 'Abre la Pantalla Debug.' },
    codeBreaker: { title: 'Rompedor de codigos', description: 'Activa cualquier codigo secreto de personaje.' },
    prismDriver: { title: 'Piloto prisma', description: 'Activa Prism Overdrive.' },
    casinoRoyalty: { title: 'Realeza casino', description: 'Gana durante Casino Royale.' },
    meltdownMaster: { title: 'Maestro meltdown', description: 'Gana durante Mana Meltdown.' },
    tankCommander: { title: 'Comandante tanque', description: 'Gana un Choque de Titanes.' },
    flawlessWin: { title: 'Intocable', description: 'Gana con toda la vida.' },
    specialist: { title: 'Especialista', description: 'Usa 10 especiales en una pelea.' },
    timeExecutioner: {
      title: 'Ejecutor temporal',
      description: 'Gana con Chrono despues de hacer dano durante Time Stop.',
    },
    absoluteDominance: {
      title: 'Dominio absoluto',
      description: 'Gana contra un bot dificil en menos de 25 segundos sin recibir dano.',
    },
    ghostUnlocked: {
      title: 'Espectro del Dark Room',
      description: 'Desbloquea a Ghost despues de jugar una partida en Dark Room.',
    },
    divineGeneralUnlocked: {
      title: 'Juicio del general',
      description: 'Completa los 7 sellos dificiles para desbloquear a Divine General.',
    },
  },
  en: {
    firstWin: { title: 'First Moquete', description: 'Win your first fight.' },
    fastWin: { title: 'No Time Wasted', description: 'Win a round in under 30 seconds.' },
    clutchWin: { title: 'Last Breath', description: 'Win a fight with 10 health or less.' },
    perfectDuel: { title: 'One Bullet Was Enough', description: 'Win with the single bullet from Desert Duel.' },
    jackpot: { title: 'JACKPOT!!', description: 'Roll triple 7 with Gambler.' },
    reflectedWin: { title: 'Reflected Victory', description: 'Win using an ability copied by Reflecter.' },
    darkRoom: { title: 'Lights Out', description: 'Play a match in Dark Room.' },
    oldDays: { title: 'Trip to the Past', description: 'Enter Alpha edition.' },
    debug: { title: 'Debug Intruder', description: 'Open the Debug Screen.' },
    codeBreaker: { title: 'Code Breaker', description: 'Activate any secret character code.' },
    prismDriver: { title: 'Prism Driver', description: 'Activate Prism Overdrive.' },
    casinoRoyalty: { title: 'Casino Royalty', description: 'Win during Casino Royale.' },
    meltdownMaster: { title: 'Meltdown Master', description: 'Win during Mana Meltdown.' },
    tankCommander: { title: 'Tank Commander', description: 'Win a Clash of Titans.' },
    flawlessWin: { title: 'Untouchable', description: 'Win with full health.' },
    specialist: { title: 'Specialist', description: 'Use 10 specials in one fight.' },
    timeExecutioner: {
      title: 'Time Executioner',
      description: 'Win with Chrono after dealing damage during Time Stop.',
    },
    absoluteDominance: {
      title: 'Absolute Dominance',
      description: 'Win against a hard bot in under 25 seconds without taking damage.',
    },
    ghostUnlocked: { title: 'Dark Room Wraith', description: 'Unlock Ghost after playing a match in Dark Room.' },
    divineGeneralUnlocked: {
      title: 'General Judgment',
      description: 'Complete the 7 difficult seals to unlock Divine General.',
    },
  },
  pt: {
    firstWin: { title: 'Primeiro Moquete', description: 'Venca sua primeira luta.' },
    fastWin: { title: 'Sem perder tempo', description: 'Venca uma rodada em menos de 30 segundos.' },
    clutchWin: { title: 'Ultimo suspiro', description: 'Venca uma luta com 10 de vida ou menos.' },
    perfectDuel: { title: 'Uma bala bastou', description: 'Venca com a bala unica do Duelo do Deserto.' },
    jackpot: { title: 'JACKPOT!!', description: 'Tire triplo 7 com Gambler.' },
    reflectedWin: { title: 'Vitoria refletida', description: 'Venca usando uma habilidade copiada por Reflecter.' },
    darkRoom: { title: 'Luzes apagadas', description: 'Jogue uma partida no Dark Room.' },
    oldDays: { title: 'Viagem ao passado', description: 'Entre na Alpha edition.' },
    debug: { title: 'Intruso debug', description: 'Abra a Tela Debug.' },
    codeBreaker: { title: 'Quebra-codigos', description: 'Ative qualquer codigo secreto de personagem.' },
    prismDriver: { title: 'Piloto prisma', description: 'Ative Prism Overdrive.' },
    casinoRoyalty: { title: 'Realeza casino', description: 'Venca durante Casino Royale.' },
    meltdownMaster: { title: 'Mestre meltdown', description: 'Venca durante Mana Meltdown.' },
    tankCommander: { title: 'Comandante tanque', description: 'Venca um Clash of Titans.' },
    flawlessWin: { title: 'Intocavel', description: 'Venca com vida cheia.' },
    specialist: { title: 'Especialista', description: 'Use 10 especiais em uma luta.' },
    timeExecutioner: {
      title: 'Executor temporal',
      description: 'Venca com Chrono depois de causar dano durante Time Stop.',
    },
    absoluteDominance: {
      title: 'Dominio absoluto',
      description: 'Venca contra um bot dificil em menos de 25 segundos sem receber dano.',
    },
    ghostUnlocked: {
      title: 'Espectro do Dark Room',
      description: 'Desbloqueie Ghost depois de jogar uma partida no Dark Room.',
    },
    divineGeneralUnlocked: {
      title: 'Julgamento do general',
      description: 'Complete os 7 selos dificeis para desbloquear Divine General.',
    },
  },
};
const uiTranslations = {
  es: {
    achievementToastLabel: 'Logro obtenido',
    menuSubtitle: 'Juego de pelea local',
    play: 'Jugar',
    guide: 'Guia',
    achievements: 'Logros',
    stats: 'Estadisticas',
    information: 'Informacion',
    opinion: 'Opinion de Codex',
    settings: 'Ajustes',
    settingsTitle: 'Ajustes',
    back: 'Volver',
    backCurrent: 'Volver a la version actual',
    fightBot: 'Pelear contra bot',
    botDifficulty: 'Dificultad del bot',
    easy: 'Facil',
    medium: 'Media',
    hard: 'Dificil',
    language: 'Idioma',
    masterVolume: 'Volumen general',
    music: 'Musica',
    effects: 'Efectos',
    player1Color: 'Color Jugador 1',
    player2Color: 'Color Jugador 2',
    debugTitle: 'Pantalla Debug',
    debugDamage: 'Multiplicador de dano',
    debugHealth: 'Multiplicador de vida',
    debugMove: 'Velocidad jugadores',
    debugCooldown: 'Multiplicador cooldowns',
    debugGravity: 'Multiplicador gravedad',
    debugProjectile: 'Velocidad proyectiles',
    debugDuration: 'Duracion efectos',
    debugKnockback: 'Empuje golpes',
    debugTargets: 'Personajes afectados',
    all: 'Todos',
    resetAll: 'Restaurar todo',
    pending: 'Pendiente',
    unlocked: 'Obtenido',
    ghostUnlockedTitle: 'Ghost desbloqueado',
    ghostLockedTitle: 'Juega una partida en Dark Room para usar Ghost',
    divineUnlockedTitle: 'Divine General desbloqueado',
    divineLockedTitle: 'Completa los 7 sellos dificiles para usar Divine General',
  },
  en: {
    achievementToastLabel: 'Achievement unlocked',
    menuSubtitle: 'Local fighting game',
    play: 'Play',
    guide: 'Guide',
    achievements: 'Achievements',
    stats: 'Stats',
    information: 'Information',
    opinion: 'Codex Opinion',
    settings: 'Settings',
    settingsTitle: 'Settings',
    back: 'Back',
    backCurrent: 'Back to current version',
    fightBot: 'Fight bot',
    botDifficulty: 'Bot difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    language: 'Language',
    masterVolume: 'Master volume',
    music: 'Music',
    effects: 'Effects',
    player1Color: 'Player 1 color',
    player2Color: 'Player 2 color',
    debugTitle: 'Debug Screen',
    debugDamage: 'Damage multiplier',
    debugHealth: 'Health multiplier',
    debugMove: 'Player speed',
    debugCooldown: 'Cooldown multiplier',
    debugGravity: 'Gravity multiplier',
    debugProjectile: 'Projectile speed',
    debugDuration: 'Effect duration',
    debugKnockback: 'Hit knockback',
    debugTargets: 'Affected characters',
    all: 'All',
    resetAll: 'Reset all',
    pending: 'Pending',
    unlocked: 'Unlocked',
    ghostUnlockedTitle: 'Ghost unlocked',
    ghostLockedTitle: 'Play a match in Dark Room to use Ghost',
    divineUnlockedTitle: 'Divine General unlocked',
    divineLockedTitle: 'Complete the 7 difficult seals to use Divine General',
  },
  pt: {
    achievementToastLabel: 'Conquista obtida',
    menuSubtitle: 'Jogo de luta local',
    play: 'Jogar',
    guide: 'Guia',
    achievements: 'Conquistas',
    stats: 'Estatisticas',
    information: 'Informacao',
    opinion: 'Opiniao do Codex',
    settings: 'Ajustes',
    settingsTitle: 'Ajustes',
    back: 'Voltar',
    backCurrent: 'Voltar para a versao atual',
    fightBot: 'Lutar contra bot',
    botDifficulty: 'Dificuldade do bot',
    easy: 'Facil',
    medium: 'Media',
    hard: 'Dificil',
    language: 'Idioma',
    masterVolume: 'Volume geral',
    music: 'Musica',
    effects: 'Efeitos',
    player1Color: 'Cor Jogador 1',
    player2Color: 'Cor Jogador 2',
    debugTitle: 'Tela Debug',
    debugDamage: 'Multiplicador de dano',
    debugHealth: 'Multiplicador de vida',
    debugMove: 'Velocidade jogadores',
    debugCooldown: 'Multiplicador cooldowns',
    debugGravity: 'Multiplicador gravidade',
    debugProjectile: 'Velocidade projeteis',
    debugDuration: 'Duracao efeitos',
    debugKnockback: 'Empurrao golpes',
    debugTargets: 'Personagens afetados',
    all: 'Todos',
    resetAll: 'Restaurar tudo',
    pending: 'Pendente',
    unlocked: 'Obtido',
    ghostUnlockedTitle: 'Ghost desbloqueado',
    ghostLockedTitle: 'Jogue uma partida no Dark Room para usar Ghost',
    divineUnlockedTitle: 'Divine General desbloqueado',
    divineLockedTitle: 'Complete os 7 selos dificeis para usar Divine General',
  },
};
let menuSecretBuffer = '';
let codexOpinionUnlocked = false;
let blindMode = false;
let blindCharacterMix = {};
let darkRoomUnlocked = false;
const characterSecretModes = {
  fireMasterOverheat: false,
  tankIronWall: false,
  cowboyDeadeye: false,
  reflecterMirrorLuck: false,
  normalKaioken: false,
  reflecterUpgrade: false,
  switcherPrism: false,
  divineFullAdapt: false,
};
const desertCowboyDuelMinStillFrames = 300;
const desertCowboyDuelMaxStillFrames = 1200;
const desertCowboyDuelCountdownFrames = 180;
const desertCowboyDuelDamage = 100;
const desertCowboyDuel = {
  requiredStillFrames: desertCowboyDuelMinStillFrames,
  stillFrames: 0,
  countdownFrames: 0,
  active: false,
  p1BulletAvailable: false,
  p2BulletAvailable: false,
};
const tankClashRequiredFrames = 240;
const tankClashShellDamage = 90;
const tankClash = {
  closeFrames: 0,
  active: false,
  alertFrames: 0,
  p1ShellAvailable: false,
  p2ShellAvailable: false,
};
const arcaneRiftDuration = 480;
const arcaneRiftOrbDamage = 55;
const arcaneRift = {
  activeFrames: 0,
  alertFrames: 0,
};
const mirrorCollapseDuration = 420;
const mirrorCollapseSecretDamageMultiplier = 1.28;
const mirrorCollapse = {
  activeFrames: 0,
  alertFrames: 0,
};
const casinoRoyaleRequiredLuck = 0.2;
const casinoRoyaleLuckBonus = 0.25;
const casinoRoyaleDuration = 720;
const casinoRoyale = {
  triggered: false,
  activeFrames: 0,
  alertFrames: 0,
};
const terrainEffectCooldownFrames = 75;
const casinoTileShiftFrames = 150;
let casinoLuckyTileIndex = 2;
let casinoTileShiftTimer = casinoTileShiftFrames;
const manaMeltdownDuration = 600;
const manaMeltdownDamageMultiplier = 1.2;
const manaMeltdown = {
  triggered: false,
  activeFrames: 0,
  alertFrames: 0,
};
const prismOverdriveRequiredUses = 3;
const prismOverdriveDuration = 600;
const prismOverdrive = {
  player1Uses: 0,
  player2Uses: 0,
  activeFrames: 0,
  alertFrames: 0,
};
const absoluteAdaptationRequiredStacks = 6;
const absoluteAdaptationDuration = 720;
const absoluteAdaptation = {
  triggered: false,
  activeFrames: 0,
  alertFrames: 0,
};
let gameOver = false;
let gameStarted = false;
let botEnabled = false;
let botAttackCooldown = 0;
let botDifficulty = 'medium';
let currentLanguage = loadLanguageSetting();
let animationId = null;
let fireballs = [];
let fireBeams = [];
let tankShells = [];
let cowboyBullets = [];
let sorcererOrbs = [];
let sorcererGravityOrbs = [];
let sorcererSecretOrbs = [];
let chronoBlades = [];
let chronoZones = [];
let characterSelectionPlayer = 1;
let selectedMap = 'foundry';
let player1QfPendingSpecial = null;
let player2QfPendingSpecial = null;
let player1SorcererPendingSpecial = null;
let player2SorcererPendingSpecial = null;
const mainMenu = document.getElementById('mainMenu');
const titleScreen = document.getElementById('titleScreen');
const oldDaysScreen = document.getElementById('oldDaysScreen');
const characterScreen = document.getElementById('characterScreen');
const characterSelectTitle = document.getElementById('characterSelectTitle');
const mapScreen = document.getElementById('mapScreen');
const darkRoomMapButton = document.getElementById('darkRoomMapButton');
const settingsScreen = document.getElementById('settingsScreen');
const guideScreen = document.getElementById('guideScreen');
const achievementsScreen = document.getElementById('achievementsScreen');
const statsScreen = document.getElementById('statsScreen');
const infoScreen = document.getElementById('infoScreen');
const opinionScreen = document.getElementById('opinionScreen');
const debugScreen = document.getElementById('debugScreen');
const secretGuideScreen = document.getElementById('secretGuideScreen');
const secretCharactersScreen = document.getElementById('secretCharactersScreen');
const eventGuideScreen = document.getElementById('eventGuideScreen');
const playButton = document.getElementById('playButton');
const oldDaysPlayButton = document.getElementById('oldDaysPlayButton');
const oldDaysBackButton = document.getElementById('oldDaysBackButton');
const normalCharacterButton = document.getElementById('normalCharacterButton');
const fireMasterCharacterButton = document.getElementById('fireMasterCharacterButton');
const tankCharacterButton = document.getElementById('tankCharacterButton');
const cowboyCharacterButton = document.getElementById('cowboyCharacterButton');
const reflecterCharacterButton = document.getElementById('reflecterCharacterButton');
const switcherCharacterButton = document.getElementById('switcherCharacterButton');
const sorcererCharacterButton = document.getElementById('sorcererCharacterButton');
const gamblerCharacterButton = document.getElementById('gamblerCharacterButton');
const chronoCharacterButton = document.getElementById('chronoCharacterButton');
const ghostCharacterButton = document.getElementById('ghostCharacterButton');
const divineGeneralCharacterButton = document.getElementById('divineGeneralCharacterButton');
const randomCharacterButton = document.getElementById('randomCharacterButton');
const characterBackButton = document.getElementById('characterBackButton');
const mapBackButton = document.getElementById('mapBackButton');
const mapOptionButtons = document.querySelectorAll('.map-option');
const settingsButton = document.getElementById('settingsButton');
const guideButton = document.getElementById('guideButton');
const achievementsButton = document.getElementById('achievementsButton');
const statsButton = document.getElementById('statsButton');
const infoButton = document.getElementById('infoButton');
const opinionButton = document.getElementById('opinionButton');
const backButton = document.getElementById('backButton');
const guideBackButton = document.getElementById('guideBackButton');
const achievementsBackButton = document.getElementById('achievementsBackButton');
const statsBackButton = document.getElementById('statsBackButton');
const statsResetButton = document.getElementById('statsResetButton');
const infoBackButton = document.getElementById('infoBackButton');
const opinionBackButton = document.getElementById('opinionBackButton');
const debugBackButton = document.getElementById('debugBackButton');
const debugResetButton = document.getElementById('debugResetButton');
const secretGuideBackButton = document.getElementById('secretGuideBackButton');
const secretCharactersBackButton = document.getElementById('secretCharactersBackButton');
const eventGuideBackButton = document.getElementById('eventGuideBackButton');
const achievementToast = document.getElementById('achievementToast');
const achievementToastTitle = document.getElementById('achievementToastTitle');
const achievementToastDescription = document.getElementById('achievementToastDescription');
const simpleTopButton = document.getElementById('simpleTopButton');
const categoryTopDetailed = document.getElementById('categoryTopDetailed');
const categoryTopSimple = document.getElementById('categoryTopSimple');
const botToggle = document.getElementById('botToggle');
const languageSelect = document.getElementById('languageSelect');
const masterVolumeControl = document.getElementById('masterVolumeControl');
const masterVolumeValue = document.getElementById('masterVolumeValue');
const musicVolumeControl = document.getElementById('musicVolumeControl');
const musicVolumeValue = document.getElementById('musicVolumeValue');
const sfxVolumeControl = document.getElementById('sfxVolumeControl');
const sfxVolumeValue = document.getElementById('sfxVolumeValue');
const player2Instructions = document.getElementById('player2Instructions');
const restartPanel = document.getElementById('restartPanel');
const victoryTitle = document.getElementById('victoryTitle');
const fightDuration = document.getElementById('fightDuration');
const restartButton = document.getElementById('restartButton');
const menuButton = document.getElementById('menuButton');
const p1Portrait = document.getElementById('p1Portrait');
const p2Portrait = document.getElementById('p2Portrait');
const p1CharacterName = document.getElementById('p1CharacterName');
const p2CharacterName = document.getElementById('p2CharacterName');
const p1HudTag = document.getElementById('p1HudTag');
const p2HudTag = document.getElementById('p2HudTag');
const statsTotalPlayTime = document.getElementById('statsTotalPlayTime');
const statsTotalFights = document.getElementById('statsTotalFights');
const statsTotalWins = document.getElementById('statsTotalWins');
const statsTotalLosses = document.getElementById('statsTotalLosses');
const statsTotalDraws = document.getElementById('statsTotalDraws');
const statsWinRate = document.getElementById('statsWinRate');
const statsBotFights = document.getElementById('statsBotFights');
const statsCharacterRows = document.getElementById('statsCharacterRows');
const player1ColorInputs = document.querySelectorAll('input[name="player1Color"]');
const player2ColorInputs = document.querySelectorAll('input[name="player2Color"]');
const botDifficultyInputs = document.querySelectorAll('input[name="botDifficulty"]');
const debugAffectAllInput = document.getElementById('debugAffectAll');
const debugAffectedCharacterInputs = document.querySelectorAll('[data-debug-character]');
const characterButtons = [
  { button: normalCharacterButton, originalName: 'Normal', characterType: 'normal' },
  { button: fireMasterCharacterButton, originalName: 'Fire Master', characterType: 'fireMaster' },
  { button: tankCharacterButton, originalName: 'Living Tank', characterType: 'tank' },
  { button: cowboyCharacterButton, originalName: 'Cowboy', characterType: 'cowboy' },
  { button: reflecterCharacterButton, originalName: 'Reflecter', characterType: 'reflecter' },
  { button: switcherCharacterButton, originalName: 'Switcher', characterType: 'switcher' },
  { button: sorcererCharacterButton, originalName: 'Sorcerer', characterType: 'sorcerer' },
  { button: gamblerCharacterButton, originalName: 'Gambler', characterType: 'gambler' },
  { button: chronoCharacterButton, originalName: 'Chrono', characterType: 'chrono' },
  { button: ghostCharacterButton, originalName: 'Ghost', characterType: 'ghost' },
  { button: divineGeneralCharacterButton, originalName: 'Divine General', characterType: 'divineGeneral' },
];
const debugControls = [
  {
    input: document.getElementById('debugDamageMultiplier'),
    output: document.getElementById('debugDamageValue'),
    setting: 'damageMultiplier',
  },
  {
    input: document.getElementById('debugHealthMultiplier'),
    output: document.getElementById('debugHealthValue'),
    setting: 'healthMultiplier',
  },
  {
    input: document.getElementById('debugMoveMultiplier'),
    output: document.getElementById('debugMoveValue'),
    setting: 'moveMultiplier',
  },
  {
    input: document.getElementById('debugCooldownMultiplier'),
    output: document.getElementById('debugCooldownValue'),
    setting: 'cooldownMultiplier',
  },
  {
    input: document.getElementById('debugGravityMultiplier'),
    output: document.getElementById('debugGravityValue'),
    setting: 'gravityMultiplier',
  },
  {
    input: document.getElementById('debugProjectileMultiplier'),
    output: document.getElementById('debugProjectileValue'),
    setting: 'projectileMultiplier',
  },
  {
    input: document.getElementById('debugDurationMultiplier'),
    output: document.getElementById('debugDurationValue'),
    setting: 'durationMultiplier',
  },
  {
    input: document.getElementById('debugKnockbackMultiplier'),
    output: document.getElementById('debugKnockbackValue'),
    setting: 'knockbackMultiplier',
  },
];

const botDifficultySettings = {
  easy: {
    maxHealth: 70,
    attackDelay: 130,
    reactionChance: 0.2,
    dodgeChance: 0.12,
    specialChance: 0.38,
    spacingChance: 0.18,
    strongAttackChance: 0.18,
    reactionDistance: 150,
  },
  medium: {
    maxHealth: 100,
    attackDelay: 50,
    reactionChance: 0.55,
    dodgeChance: 0.42,
    specialChance: 0.68,
    spacingChance: 0.52,
    strongAttackChance: 0.38,
    reactionDistance: 230,
  },
  hard: {
    maxHealth: 130,
    attackDelay: 28,
    reactionChance: 0.88,
    dodgeChance: 0.72,
    specialChance: 0.9,
    spacingChance: 0.86,
    strongAttackChance: 0.58,
    reactionDistance: 330,
  },
};

const characterDisplayNames = {
  normal: 'Normal',
  fireMaster: 'Fire Master',
  tank: 'Living Tank',
  cowboy: 'Cowboy',
  reflecter: 'Reflecter',
  switcher: 'Switcher',
  sorcerer: 'Sorcerer',
  gambler: 'Gambler',
  chrono: 'Chrono',
  ghost: 'Ghost',
  divineGeneral: 'Divine General',
};

const botDifficultyDisplayNames = {
  easy: 'facil',
  medium: 'media',
  hard: 'dificil',
};

const victoryPhrases = {
  normal: {
    default: [
      'Basico, directo, suficiente.',
      'Sin trucos. Solo golpes bien puestos.',
      'La proxima traigan mas defensa.',
    ],
    normal: ['Mismo estilo, mejor ejecucion.'],
    fireMaster: ['Tanto fuego y aun asi te apague a golpes.'],
    tank: ['Eras grande, no invencible.'],
    cowboy: ['Tus balas no sirven si te cierro la distancia.'],
    reflecter: ['No reflejaste lo unico que importaba: mis punos.'],
    switcher: ['Cambiaste de modo, yo cambie tu cara.'],
    sorcerer: ['Mucha magia, poca guardia.'],
  },
  fireMaster: {
    default: [
      'Quedaron cenizas en el ring.',
      'El fuego decidio esta pelea.',
      'Demasiado calor para ustedes.',
    ],
    normal: ['Un peleador normal no aguanta una tormenta de fuego.'],
    fireMaster: ['Entre llamas iguales, la mia quemo mas fuerte.'],
    tank: ['El blindaje se derrite si insisto lo suficiente.'],
    cowboy: ['Disparaste rapido. Yo queme todo el mapa.'],
    reflecter: ['Reflejar fuego tambien deja quemaduras.'],
    switcher: ['Cambiaste colores; yo deje todo naranja.'],
    sorcerer: ['Tu magia era elegante. Mi fuego fue practico.'],
  },
  tank: {
    default: [
      'No me movieron ni un metro.',
      'Blindaje arriba. Rival abajo.',
      'Golpearon metal y perdieron.',
    ],
    normal: ['Buen intento. Mis placas ni se enteraron.'],
    fireMaster: ['Mucho calor, poco impacto.'],
    tank: ['Dos tanques entraron. Uno siguio andando.'],
    cowboy: ['Doce balas no pesan mas que un canonazo.'],
    reflecter: ['Reflejaste tecnica, no tonelaje.'],
    switcher: ['Cambiaste de plan; yo segui avanzando.'],
    sorcerer: ['Ni la magia mueve una pared si la pared pega primero.'],
  },
  cowboy: {
    default: [
      'Un duelo limpio. Bueno, casi.',
      'Rapido con el gatillo, lento para caer.',
      'El polvo ni llego a asentarse.',
    ],
    normal: ['Trajiste punos a un duelo de distancia.'],
    fireMaster: ['El fuego tarda. El gatillo no.'],
    tank: ['Hasta el metal tiene puntos debiles.'],
    cowboy: ['Mismo sombrero, peor punteria.'],
    reflecter: ['Si reflejas una bala, tengo once mas.'],
    switcher: ['Cambiaste de modo, pero no esquivaste.'],
    sorcerer: ['Antes de tu hechizo, ya habia disparado.'],
  },
  reflecter: {
    default: [
      'Gracias por prestarme tu poder.',
      'Tu mejor golpe fue mi mejor arma.',
      'Pegaste primero. Perdiste despues.',
    ],
    normal: ['Sin trucos que copiar, igual lei tus golpes.'],
    fireMaster: ['Tu fuego se vio mejor de mi lado.'],
    tank: ['Hasta un tanque duda cuando le devuelven el impacto.'],
    cowboy: ['Bonitas balas. Gracias por la municion.'],
    reflecter: ['Dos espejos. Yo fui el que no se rompio.'],
    switcher: ['Tantos modos para terminar copiado.'],
    sorcerer: ['Tu magia rebota muy bien. Deberias probar defenderte.'],
  },
  switcher: {
    default: [
      'Cambie el plan. Gane igual.',
      'Modo correcto, resultado correcto.',
      'Adaptarse tambien pega fuerte.',
    ],
    normal: ['Contra algo simple, elegi la respuesta exacta.'],
    fireMaster: ['Para el fuego, cambie el ritmo. Para ti, el final.'],
    tank: ['Si no puedo romperte de frente, te rodeo.'],
    cowboy: ['Cambiaste balas por panic. Mala oferta.'],
    reflecter: ['No podes reflejar una decision correcta.'],
    switcher: ['Mismos modos, mejor lectura.'],
    sorcerer: ['Tu hechizo fallo contra mi cambio de plan.'],
  },
  sorcerer: {
    default: [
      'La magia no pidio permiso.',
      'Vi el final antes que ustedes.',
      'El ring obedecio mi hechizo.',
    ],
    normal: ['Tus golpes eran reales. Mi ventaja tambien.'],
    fireMaster: ['El fuego es solo magia con menos imaginacion.'],
    tank: ['Ser pesado no ayuda contra la gravedad.'],
    cowboy: ['Tus balas fueron rapidas. Mi orb ya estaba esperando.'],
    reflecter: ['Intentaste reflejar lo que no entendiste.'],
    switcher: ['Cambiaste de modo dentro de mi trampa.'],
    sorcerer: ['Misma escuela, distinta clase.'],
  },
  gambler: {
    default: [
      'La casa siempre gana. Hoy yo era la casa.',
      'Mala apuesta enfrentarte conmigo.',
      'No fue suerte. Bueno, tal vez un poco.',
    ],
    normal: ['Jugaste limpio. Yo jugue a ganar.'],
    fireMaster: ['Mucho fuego, pero la mesa estaba fria.'],
    tank: ['Todo ese blindaje y aun asi perdiste la apuesta.'],
    cowboy: ['Trajiste balas. Yo traje jackpot.'],
    reflecter: ['Reflejaste mi suerte, pero no mi instinto.'],
    switcher: ['Cambiaste de modo. Yo cambie las probabilidades.'],
    sorcerer: ['Tu magia vio el futuro. Mis dados lo arruinaron.'],
    gambler: ['Misma suerte, mejor mano.'],
  },
  divineGeneral: {
    default: [
      'Aprendi tu patron. Despues solo quedaba ejecutar.',
      'Cada golpe tuyo me hizo mas dificil de matar.',
      'No ganaste rapido. Ese fue tu error.',
    ],
    normal: ['Tecnica simple. Lectura simple. Resultado simple.'],
    fireMaster: ['El fuego ensena rapido cuando deja de quemar.'],
    tank: ['Tu peso era informacion. La use contra vos.'],
    cowboy: ['Doce balas no sirven si la treceava ya la predije.'],
    reflecter: ['Reflejaste poder. Yo refleje adaptacion.'],
    switcher: ['Cambiaste de modo. Yo cambie de respuesta.'],
    sorcerer: ['Tu magia fue peligrosa hasta que aprendi su forma.'],
    gambler: ['La suerte no se adapta. Yo si.'],
    chrono: ['El tiempo se detuvo. Mi lectura no.'],
    ghost: ['Hasta lo invisible deja patrones.'],
    divineGeneral: ['Mismo juicio. Mejor sentencia.'],
  },
};

let fightStartedAt = 0;
let currentFightStatisticsRecorded = false;
const fightStats = createEmptyFightStats();
const fightAchievementFlags = createEmptyFightAchievementFlags();
const persistentStatistics = loadStatistics();
const unlockedAchievements = loadAchievements();
let achievementToastTimer = null;

function createEmptyFightStats() {
  return {
    player1: {
      damageDealt: 0,
      damageTaken: 0,
      hitsLanded: 0,
      specialsUsed: 0,
      specialsLanded: 0,
    },
    player2: {
      damageDealt: 0,
      damageTaken: 0,
      hitsLanded: 0,
      specialsUsed: 0,
      specialsLanded: 0,
    },
  };
}

function createEmptyFightAchievementFlags() {
  return {
    duelShotHitBy: null,
    copiedAbilityUsedBy: null,
    timeStopDamageBy: null,
    casinoRoyaleActive: false,
    manaMeltdownActive: false,
    tankClashActive: false,
    prismOverdriveActive: false,
  };
}

function loadLanguageSetting() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'es';
  } catch (error) {
    return 'es';
  }
}

function saveLanguageSetting() {
  try {
    localStorage.setItem(languageStorageKey, currentLanguage);
  } catch (error) {
    // localStorage can be blocked; language still works until the page reloads.
  }
}

function t(key) {
  const languagePack = uiTranslations[currentLanguage] || uiTranslations.es;
  return languagePack[key] || uiTranslations.es[key] || key;
}

function getAchievementDetails(achievementId) {
  const languagePack = achievementDetailsByLanguage[currentLanguage] || achievementDetailsByLanguage.es;
  return languagePack[achievementId] || achievementDetailsByLanguage.es[achievementId] || {
    title: achievementId,
    description: '',
  };
}

function syncAchievementText() {
  document.querySelectorAll('[data-achievement]').forEach((achievementCard) => {
    const details = getAchievementDetails(achievementCard.dataset.achievement);
    const title = achievementCard.querySelector('strong');
    const description = achievementCard.querySelector('span:last-child');

    if (title) title.innerText = details.title;
    if (description) description.innerText = details.description;
    achievementCard.dataset.lockedLabel = t('pending');
    achievementCard.dataset.unlockedLabel = t('unlocked');
  });
}

function applyLanguage() {
  if (!supportedLanguages.includes(currentLanguage)) currentLanguage = 'es';
  document.documentElement.lang = currentLanguage;
  if (languageSelect) languageSelect.value = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.innerText = t(element.dataset.i18n);
  });

  syncAchievementText();
  syncGhostUnlockUI();
  syncDivineGeneralUnlockUI();
}

function syncCodexOpinionUI() {
  if (!opinionButton) return;
  opinionButton.classList.toggle('hidden', !codexOpinionUnlocked);
}

function unlockCodexOpinion() {
  codexOpinionUnlocked = true;
  syncCodexOpinionUI();
  openOpinion();
}

function loadAchievements() {
  try {
    const savedAchievements = JSON.parse(localStorage.getItem(achievementStorageKey) || '{}');
    return achievementIds.reduce((achievements, achievementId) => {
      achievements[achievementId] = Boolean(savedAchievements[achievementId]);
      return achievements;
    }, {});
  } catch (error) {
    return achievementIds.reduce((achievements, achievementId) => {
      achievements[achievementId] = false;
      return achievements;
    }, {});
  }
}

function saveAchievements() {
  try {
    localStorage.setItem(achievementStorageKey, JSON.stringify(unlockedAchievements));
  } catch (error) {
    // localStorage can be blocked in some browser modes; achievements still work for the session.
  }
}

function syncAchievementsUI() {
  document.querySelectorAll('[data-achievement]').forEach((achievementCard) => {
    const achievementId = achievementCard.dataset.achievement;
    achievementCard.classList.toggle('unlocked', Boolean(unlockedAchievements[achievementId]));
  });
  syncAchievementText();
  syncGhostUnlockUI();
  syncDivineGeneralUnlockUI();
}

function isGhostUnlocked() {
  return Boolean(unlockedAchievements.ghostUnlocked);
}

function isDivineGeneralUnlocked() {
  return Boolean(unlockedAchievements.divineGeneralUnlocked);
}

function syncGhostUnlockUI() {
  if (!ghostCharacterButton) return;

  const unlocked = isGhostUnlocked();
  ghostCharacterButton.classList.toggle('locked', !unlocked);
  ghostCharacterButton.disabled = !unlocked;
  ghostCharacterButton.title = unlocked ? t('ghostUnlockedTitle') : t('ghostLockedTitle');
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
  if (currentFightStatisticsRecorded || fightStartedAt <= 0) return;

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
}

function recordPersistentPlayTimeOnly(fightTime) {
  if (currentFightStatisticsRecorded || fightStartedAt <= 0) return;

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
}

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function clampAudioVolume(value) {
  return Math.max(0, Math.min(1, Number(value)));
}

function formatAudioVolume(value) {
  return `${Math.round(clampAudioVolume(value) * 100)}%`;
}

function loadAudioSettings() {
  ['master', 'music', 'sfx'].forEach((setting) => {
    const storedValue = localStorage.getItem(`naziFightAudio_${setting}`);
    if (storedValue !== null) {
      audioSettings[setting] = clampAudioVolume(storedValue);
    }
  });
}

function saveAudioSetting(setting) {
  localStorage.setItem(`naziFightAudio_${setting}`, String(audioSettings[setting]));
}

function syncAudioSettingsUI() {
  const controls = [
    { input: masterVolumeControl, output: masterVolumeValue, setting: 'master' },
    { input: musicVolumeControl, output: musicVolumeValue, setting: 'music' },
    { input: sfxVolumeControl, output: sfxVolumeValue, setting: 'sfx' },
  ];

  controls.forEach(({ input, output, setting }) => {
    if (!input || !output) return;
    input.value = audioSettings[setting];
    output.innerText = formatAudioVolume(audioSettings[setting]);
  });
}

function applyAudioSettings() {
  if (masterGain) masterGain.gain.value = 0.28 * audioSettings.master;
  if (musicGain) musicGain.gain.value = 0.12 * audioSettings.music;
  if (sfxGain) sfxGain.gain.value = audioSettings.sfx;
  if (jackpotTrack) jackpotTrack.volume = 0.78 * audioSettings.master * audioSettings.music;
}

function ensureAudio() {
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    musicGain = audioContext.createGain();
    sfxGain = audioContext.createGain();
    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(audioContext.destination);
    applyAudioSettings();
  }
  if (audioContext.state === 'suspended') {
    const resumePromise = audioContext.resume();
    if (resumePromise && resumePromise.catch) {
      resumePromise.catch(() => {});
    }
  }
  return audioContext;
}

function playTone({
  frequency = 440,
  duration = 0.12,
  type = 'square',
  volume = 0.18,
  slideTo = null,
  destination = null,
  delay = 0,
  attack = 0.012,
} = {}) {
  const audio = ensureAudio();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const startTime = audio.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), startTime + duration);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(destination || sfxGain || masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playNoise({ duration = 0.12, volume = 0.12, delay = 0, filterFrequency = null, destination = null } = {}) {
  const audio = ensureAudio();
  if (!audio) return;

  const buffer = audio.createBuffer(1, Math.max(1, Math.floor(audio.sampleRate * duration)), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = audio.createBufferSource();
  const gain = audio.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain);
  if (filterFrequency) {
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFrequency;
    gain.connect(filter);
    filter.connect(destination || sfxGain || masterGain);
  } else {
    gain.connect(destination || sfxGain || masterGain);
  }
  source.start(audio.currentTime + delay);
}

function playChord(frequencies, { duration = 0.18, type = 'triangle', volume = 0.08, delay = 0, destination = null } = {}) {
  frequencies.forEach((frequency) => {
    playTone({ frequency, duration, type, volume, delay, destination });
  });
}

function playKick({ delay = 0, volume = 0.16, destination = null } = {}) {
  playTone({ frequency: 95, duration: 0.16, type: 'sine', volume, slideTo: 42, delay, destination, attack: 0.004 });
}

function playSnare({ delay = 0, volume = 0.09, destination = null } = {}) {
  playNoise({ duration: 0.07, volume, delay, filterFrequency: 1600, destination });
  playTone({ frequency: 180, duration: 0.06, type: 'triangle', volume: volume * 0.5, delay, destination, attack: 0.004 });
}

function playHat({ delay = 0, volume = 0.045, destination = null } = {}) {
  playNoise({ duration: 0.025, volume, delay, filterFrequency: 4200, destination });
}

function playSynthJackpotFanfare() {
  const jackpotChords = [
    [523, 659, 784],
    [587, 740, 880],
    [659, 831, 988],
    [784, 988, 1175],
    [698, 880, 1046],
    [784, 988, 1318],
  ];
  const jackpotLead = [1568, 1760, 1976, 1760, 1568, 1318, 1568, 1760, 2093, 2349, 2637, 2349, 2093, 1760, 1976, 2093];

  jackpotChords.forEach((chord, index) => {
    const delay = index * 0.22;
    playChord(chord, { duration: 0.24, type: index % 2 === 0 ? 'square' : 'triangle', volume: 0.055, delay });
    playTone({ frequency: chord[0] / 2, duration: 0.2, type: 'sawtooth', volume: 0.07, delay, attack: 0.004 });
  });
  jackpotLead.forEach((frequency, index) => {
    playTone({ frequency, duration: 0.105, type: 'square', volume: 0.042, delay: index * 0.085, attack: 0.003 });
  });
  for (let step = 0; step < 12; step += 1) {
    const delay = step * 0.11;
    if (step % 4 === 0) playKick({ volume: 0.15, delay });
    if (step % 4 === 2) playSnare({ volume: 0.055, delay });
    playHat({ volume: 0.026, delay: delay + 0.055 });
  }
  playChord([1046, 1318, 1568], { duration: 0.34, type: 'triangle', volume: 0.052, delay: 1.42 });
  playChord([1318, 1661, 2093], { duration: 0.5, type: 'triangle', volume: 0.06, delay: 1.72 });
  playKick({ volume: 0.14, delay: 1.7 });
  playSnare({ volume: 0.052, delay: 1.92 });
  playNoise({ duration: 0.28, volume: 0.055, delay: 1.74, filterFrequency: 3600 });
}

function playJackpotTrack({ durationFrames = gamblerJackpotMaxDuration } = {}) {
  if (typeof Audio === 'undefined') {
    playSynthJackpotFanfare();
    return;
  }

  const token = jackpotTrackPlayToken + 1;
  jackpotTrackPlayToken = token;

  const fallbackToSynth = () => {
    if (token !== jackpotTrackPlayToken) return;
    jackpotTrackPlayToken += 1;
    if (jackpotTrackFallbackTimer) {
      clearTimeout(jackpotTrackFallbackTimer);
      jackpotTrackFallbackTimer = null;
    }
    if (jackpotTrackStopTimer) {
      clearTimeout(jackpotTrackStopTimer);
      jackpotTrackStopTimer = null;
    }
    playSynthJackpotFanfare();
  };

  if (!jackpotTrack) {
    jackpotTrack = new Audio(jackpotTrackSource);
    jackpotTrack.preload = 'auto';
  }
  jackpotTrack.volume = 0.78 * audioSettings.master * audioSettings.music;

  const startTrack = () => {
    if (token !== jackpotTrackPlayToken) return;
    if (jackpotTrackFallbackTimer) {
      clearTimeout(jackpotTrackFallbackTimer);
      jackpotTrackFallbackTimer = null;
    }
    if (jackpotTrackStopTimer) {
      clearTimeout(jackpotTrackStopTimer);
      jackpotTrackStopTimer = null;
    }
    try {
      jackpotTrack.pause();
      jackpotTrack.currentTime = jackpotTrackStartTime;
    } catch (error) {
      fallbackToSynth();
      return;
    }
    const playPromise = jackpotTrack.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(fallbackToSynth);
    }
    const segmentMilliseconds = Math.max(0, jackpotTrackEndTime - jackpotTrackStartTime) * 1000;
    const effectMilliseconds = Math.max(0, durationFrames / 60) * 1000;
    const stopMilliseconds = Math.min(segmentMilliseconds, effectMilliseconds);
    jackpotTrackStopTimer = setTimeout(() => {
      if (token !== jackpotTrackPlayToken || !jackpotTrack) return;
      jackpotTrack.pause();
    }, stopMilliseconds);
  };

  jackpotTrack.onerror = fallbackToSynth;
  if (jackpotTrack.readyState >= 1) {
    startTrack();
    return;
  }

  jackpotTrack.addEventListener('loadedmetadata', startTrack, { once: true });
  jackpotTrackFallbackTimer = setTimeout(fallbackToSynth, 1400);
  jackpotTrack.load();
}

function stopJackpotTrack() {
  jackpotTrackPlayToken += 1;
  if (jackpotTrackFallbackTimer) {
    clearTimeout(jackpotTrackFallbackTimer);
    jackpotTrackFallbackTimer = null;
  }
  if (jackpotTrackStopTimer) {
    clearTimeout(jackpotTrackStopTimer);
    jackpotTrackStopTimer = null;
  }
  if (jackpotTrack) {
    jackpotTrack.pause();
  }
}

function playSound(soundName, options = {}) {
  if (soundName === 'menuMove') {
    playTone({ frequency: 760, duration: 0.035, type: 'triangle', volume: 0.055, slideTo: 980 });
  } else if (soundName === 'menuSelect') {
    playChord([330, 495, 660], { duration: 0.08, type: 'square', volume: 0.055 });
    playChord([392, 588, 784], { duration: 0.12, type: 'square', volume: 0.05, delay: 0.07 });
  } else if (soundName === 'fireball') {
    playTone({ frequency: 150, duration: 0.22, type: 'sawtooth', volume: 0.15, slideTo: 75, attack: 0.004 });
    playTone({ frequency: 310, duration: 0.11, type: 'triangle', volume: 0.06, slideTo: 210 });
    playNoise({ duration: 0.18, volume: 0.09, filterFrequency: 900 });
  } else if (soundName === 'fireBeam') {
    playTone({ frequency: 95, duration: 0.34, type: 'sawtooth', volume: 0.13, slideTo: 310, attack: 0.005 });
    playTone({ frequency: 190, duration: 0.28, type: 'square', volume: 0.055, slideTo: 430 });
    playNoise({ duration: 0.24, volume: 0.06, filterFrequency: 1300 });
  } else if (soundName === 'tankShell') {
    playKick({ volume: 0.22 });
    playTone({ frequency: 58, duration: 0.2, type: 'square', volume: 0.12, slideTo: 34, attack: 0.004 });
    playNoise({ duration: 0.11, volume: 0.18, filterFrequency: 700 });
  } else if (soundName === 'cowboyBurst') {
    playTone({ frequency: 1120, duration: 0.035, type: 'square', volume: 0.1, slideTo: 520, attack: 0.003 });
    playNoise({ duration: 0.045, volume: 0.09, filterFrequency: 2200 });
  } else if (soundName === 'sorcererOrb') {
    playTone({ frequency: 220, duration: 0.22, type: 'sine', volume: 0.085, slideTo: 330 });
    playChord([440, 554, 659], { duration: 0.16, type: 'triangle', volume: 0.04, delay: 0.03 });
  } else if (soundName === 'gravityOrb') {
    playTone({ frequency: 190, duration: 0.42, type: 'sine', volume: 0.14, slideTo: 48, attack: 0.02 });
    playTone({ frequency: 95, duration: 0.36, type: 'triangle', volume: 0.07, slideTo: 35 });
  } else if (soundName === 'secretOrb') {
    playTone({ frequency: 90, duration: 0.46, type: 'sawtooth', volume: 0.13, slideTo: 380 });
    [300, 450, 675, 1012].forEach((frequency, index) => {
      playTone({ frequency, duration: 0.08, type: 'triangle', volume: 0.055, delay: index * 0.045 });
    });
  } else if (soundName === 'sorcererSecretCharge') {
    playTone({ frequency: 64, duration: 0.7, type: 'sine', volume: 0.12, slideTo: 150, attack: 0.05 });
    playTone({ frequency: 128, duration: 0.58, type: 'sawtooth', volume: 0.07, slideTo: 360, delay: 0.08, attack: 0.04 });
    playNoise({ duration: 0.62, volume: 0.055, delay: 0.04, filterFrequency: 850 });
    [240, 320, 480, 720].forEach((frequency, index) => {
      playTone({ frequency, duration: 0.09, type: 'triangle', volume: 0.04, delay: 0.18 + index * 0.09 });
    });
  } else if (soundName === 'sorcererSecretLaunch') {
    playKick({ volume: 0.25 });
    playTone({ frequency: 55, duration: 0.42, type: 'sawtooth', volume: 0.18, slideTo: 28, attack: 0.004 });
    playTone({ frequency: 220, duration: 0.3, type: 'square', volume: 0.095, slideTo: 880, attack: 0.006 });
    playNoise({ duration: 0.22, volume: 0.18, filterFrequency: 1200 });
    playChord([740, 988, 1480], { duration: 0.2, type: 'triangle', volume: 0.042, delay: 0.08 });
  } else if (soundName === 'reflectShield') {
    playChord([740, 988, 1318], { duration: 0.1, type: 'triangle', volume: 0.045 });
    playChord([660, 880, 1174], { duration: 0.12, type: 'triangle', volume: 0.04, delay: 0.06 });
  } else if (soundName === 'switcher') {
    [360, 720, 540, 1080].forEach((frequency, index) => {
      playTone({ frequency, duration: 0.05, type: 'square', volume: 0.065, delay: index * 0.032 });
    });
  } else if (soundName === 'gambler') {
    [523, 659, 784, 1046].forEach((frequency, index) => {
      playTone({ frequency, duration: 0.055, type: 'square', volume: 0.065, delay: index * 0.045 });
    });
    playNoise({ duration: 0.08, volume: 0.035, delay: 0.17, filterFrequency: 2800 });
  } else if (soundName === 'slotRoll') {
    [620, 580, 640, 600, 700, 660, 760, 720].forEach((frequency, index) => {
      playTone({ frequency, duration: 0.038, type: 'square', volume: 0.052, delay: index * 0.043, attack: 0.003 });
      if (index % 2 === 0) {
        playNoise({ duration: 0.025, volume: 0.025, delay: index * 0.043, filterFrequency: 3600 });
      }
    });
    playTone({ frequency: 920, duration: 0.08, type: 'triangle', volume: 0.055, delay: 0.36, slideTo: 690 });
  } else if (soundName === 'jackpotFanfare') {
    playJackpotTrack({ durationFrames: options.durationFrames });
  } else if (soundName === 'achievement') {
    playChord([523, 659, 784], { duration: 0.12, type: 'triangle', volume: 0.05 });
    playChord([659, 831, 1046], { duration: 0.14, type: 'triangle', volume: 0.05, delay: 0.1 });
    playChord([784, 1046, 1318], { duration: 0.2, type: 'triangle', volume: 0.045, delay: 0.22 });
  }
}

function playMenuMusicStep() {
  if (!menuMusicPlaying || !audioContext) return;

  const melody = [392, 494, 587, 659, 587, 494, 440, 494, 523, 659, 784, 659, 587, 523, 494, 440];
  const bass = [98, 98, 123, 123, 82, 82, 110, 110, 98, 98, 147, 147, 131, 131, 110, 110];
  const chords = [
    [196, 247, 330],
    [247, 294, 392],
    [165, 220, 330],
    [220, 277, 370],
  ];
  const step = musicStep % 16;

  if (step % 2 === 0) {
    playTone({ frequency: bass[step], duration: 0.18, type: 'triangle', volume: 0.052, destination: musicGain });
  }
  if ([0, 4, 8, 12].includes(step)) {
    playChord(chords[Math.floor(step / 4)], { duration: 0.28, type: 'triangle', volume: 0.018, destination: musicGain });
  }
  if (![3, 7, 11, 15].includes(step)) {
    playTone({ frequency: melody[step], duration: 0.105, type: step % 4 === 1 ? 'triangle' : 'square', volume: 0.032, destination: musicGain });
  }
  if (step === 0 || step === 8) {
    playKick({ volume: 0.052, destination: musicGain });
  } else if (step === 4 || step === 12) {
    playSnare({ volume: 0.038, destination: musicGain });
  } else if (step % 2 === 1) {
    playHat({ volume: 0.018, destination: musicGain });
  }
  musicStep += 1;
}

function startMenuMusic() {
  const audio = ensureAudio();
  if (!audio || menuMusicPlaying) return;

  menuMusicPlaying = true;
  playMenuMusicStep();
  musicTimer = setInterval(playMenuMusicStep, 170);
}

function stopMenuMusic() {
  menuMusicPlaying = false;
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function handleMenuAudioInteraction(event) {
  if (!document.body.classList.contains('menu-open')) return;

  startMenuMusic();
  if (event.target && event.target.closest && event.target.closest('button')) {
    playSound('menuSelect');
  }
}

const keys = {
  a: false,
  d: false,
  w: false,
  s: false,
  q: false,
  f: false,
  slash: false,
  period: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

class Fighter {
  constructor({ x, y, color, attacksToTheRight }) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = 60;
    this.height = 120;
    this.moveSpeed = playerMoveSpeed;
    this.color = color;
    this.attackColor = hexToRgba(color, 0.65);
    this.baseColor = color;
    this.characterType = 'normal';
    this.secretVariant = null;
    this.damageMultiplier = 1;
    this.specialCooldown = 0;
    this.fireBeamCooldown = 0;
    this.tankAttackCooldown = 0;
    this.tankShellCooldown = 0;
    this.cowboyBurstCooldown = 0;
    this.kaiokenCooldown = 0;
    this.kaiokenComboCooldown = 0;
    this.kaiokenComboHitsRemaining = 0;
    this.kaiokenComboTimer = 0;
    this.kaiokenComboVisualTimer = 0;
    this.kaiokenTimer = 0;
    this.kaiokenBaseMaxHealth = 100;
    this.sorcererOrbCooldown = 0;
    this.sorcererGravityCooldown = 0;
    this.sorcererSecretOrbCooldown = 0;
    this.chronoBladeCooldown = 0;
    this.chronoSlowCooldown = 0;
    this.chronoSlowTimer = 0;
    this.chronoMarkTimer = 0;
    this.chronoMarkedBy = null;
    this.chronoTimeStopCooldown = 0;
    this.chronoTimeStopTimer = 0;
    this.ghostPhaseCooldown = 0;
    this.ghostPhaseTimer = 0;
    this.ghostPhaseContactTimer = 0;
    this.divineAdaptCooldown = 0;
    this.divineAdaptTimer = 0;
    this.divineAdaptations = {};
    this.divineCounterCooldown = 0;
    this.cowboyBurstShotsRemaining = 0;
    this.cowboyBurstTimer = 0;
    this.copycatShieldCooldown = 0;
    this.copycatShieldTimer = 0;
    this.gamblerRollCooldown = 0;
    this.gamblerLuckCooldown = 0;
    this.gamblerLuckBonus = 0;
    this.gamblerLuckWaveTimer = 0;
    this.gamblerRollTimer = 0;
    this.gamblerRollNumbers = [];
    this.gamblerDamageBoost = 0;
    this.gamblerDamageBoostTimer = 0;
    this.gamblerSpeedBoost = 0;
    this.gamblerSpeedBoostTimer = 0;
    this.gamblerStunTimer = 0;
    this.gamblerInvincibleTimer = 0;
    this.terrainEffectCooldown = 0;
    this.switcherModeIndex = 0;
    this.switcherAbilityCooldown = 0;
    this.switcherArmorTimer = 0;
    this.switcherRedStrikeTimer = 0;
    this.switcherRedStrikeArea = null;
    this.switcherDashTimer = 0;
    this.switcherDashDirection = 1;
    this.target = null;
    this.baseMaxHealth = 100;
    this.maxHealth = 100;
    this.health = 100;
    this.isAttacking = false;
    this.currentAttackDamage = attackDamage;
    this.strongAttackCooldown = 0;
    this.attacksToTheRight = attacksToTheRight;
    this.attackDuration = 12;
    this.attackTimer = 0;
    this.attackBox = {
      offset: { x: attacksToTheRight ? this.width : -70, y: 20 },
      width: 70,
      height: 30,
    };
  }

  get attackArea() {
    const target = this.target;
    const targetCenterX = target ? target.position.x + target.width / 2 : null;
    const targetCenterY = target ? target.position.y + target.height / 2 : null;
    const fighterCenterX = this.position.x + this.width / 2;
    const attackXOffset =
      targetCenterX === null
        ? this.attackBox.offset.x
        : targetCenterX >= fighterCenterX
          ? this.width
          : -this.attackBox.width;
    const attackY =
      targetCenterY === null
        ? this.position.y + this.attackBox.offset.y
        : targetCenterY - this.attackBox.height / 2;

    return {
      x: this.position.x + attackXOffset,
      y: attackY,
      width: this.attackBox.width,
      height: this.attackBox.height,
    };
  }

  draw() {
    if (blindMode) {
      this.drawBlindDetails();
      return;
    }

    if (this.characterType === 'tank') {
      this.drawTankDetails();
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    if (this.characterType === 'normal') {
      this.drawNormalDetails();
    }

    if (this.characterType === 'fireMaster') {
      this.drawFireMasterDetails();
    }

    if (this.characterType === 'normal' && this.kaiokenTimer > 0) {
      this.drawKaiokenAura();
    }

    if (this.characterType === 'cowboy') {
      this.drawCowboyDetails();
    }

    if (this.characterType === 'reflecter') {
      this.drawReflecterDetails();
    }

    if (this.characterType === 'switcher') {
      this.drawSwitcherDetails();
    }

    if (this.characterType === 'sorcerer') {
      this.drawSorcererDetails();
    }

    if (this.characterType === 'gambler') {
      this.drawGamblerDetails();
    }

    if (this.characterType === 'chrono') {
      this.drawChronoDetails();
    }

    if (this.characterType === 'ghost') {
      this.drawGhostDetails();
    }

    if (this.characterType === 'divineGeneral') {
      this.drawDivineGeneralDetails();
    }

    if (this.characterType !== 'gambler' && this.gamblerInvincibleTimer > 0) {
      this.drawJackpotAura();
    }

    if (this.copycatShieldTimer > 0) {
      this.drawReflecterShield();
    }

    if (this.isAttacking) {
      const attack = this.attackArea;
      ctx.fillStyle = this.attackColor;
      ctx.fillRect(attack.x, attack.y, attack.width, attack.height);
    }

    if (this.gamblerRollTimer > 0) {
      this.drawGamblerRoll();
    }
  }

  drawBlindDetails() {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      const attack = this.attackArea;
      ctx.fillStyle = 'rgba(245, 245, 245, 0.62)';
      ctx.fillRect(attack.x, attack.y, attack.width, attack.height);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.strokeRect(attack.x, attack.y, attack.width, attack.height);
    }
  }

  drawNormalDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const kaiokenActive = isNormalKaioken(this) && this.kaiokenTimer > 0;

    ctx.fillStyle = kaiokenActive ? '#1a1a1a' : '#111';
    ctx.fillRect(x + 8, y + 22, this.width - 16, 10);
    ctx.fillStyle = kaiokenActive ? '#0d47a1' : '#fdd835';
    ctx.fillRect(x + 16, y + 36, this.width - 32, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 18, y + 18, 7, 6);
    ctx.fillRect(x + this.width - 25, y + 18, 7, 6);

    if (!kaiokenActive) return;

    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(x + 10, y + 46, this.width - 20, 14);
    ctx.fillStyle = '#fb8c00';
    ctx.fillRect(x + 6, y + 56, this.width - 12, 38);
    ctx.fillStyle = '#ef6c00';
    ctx.fillRect(x + 9, y + 62, 10, 28);
    ctx.fillRect(x + this.width - 19, y + 62, 10, 28);
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(x + 8, y + 76, this.width - 16, 8);
    ctx.fillRect(x + 12, y + 98, 14, 22);
    ctx.fillRect(x + this.width - 26, y + 98, 14, 22);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 6, y + 56, this.width - 12, 38);
    ctx.strokeRect(x + 8, y + 76, this.width - 16, 8);

    ctx.fillStyle = 'rgba(255, 23, 68, 0.78)';
    ctx.fillRect(x + 24, y + 58, 5, 30);
    ctx.fillRect(x + this.width - 29, y + 58, 5, 30);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 40);
    ctx.lineTo(x + 16, y + 28);
    ctx.moveTo(x + this.width - 2, y + 42);
    ctx.lineTo(x + this.width - 16, y + 28);
    ctx.stroke();
  }

  drawFireMasterDetails() {
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(this.position.x, this.position.y + 78, this.width, 12);
    ctx.fillStyle = '#111';
    ctx.fillRect(this.position.x, this.position.y + 76, this.width, 3);
    ctx.fillRect(this.position.x, this.position.y + 90, this.width, 3);

    const flameX = this.position.x + this.width / 2;
    const flameY = this.position.y + 42;
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(flameX, flameY - 18);
    ctx.lineTo(flameX + 12, flameY + 10);
    ctx.lineTo(flameX, flameY + 18);
    ctx.lineTo(flameX - 12, flameY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(flameX - 5, flameY + 2, 10, 12);

    if (isFireMasterOverheat(this)) {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.28)';
      ctx.fillRect(this.position.x - 6, this.position.y - 6, this.width + 12, this.height + 12);
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 4;
      ctx.strokeRect(this.position.x - 7, this.position.y - 7, this.width + 14, this.height + 14);
      ctx.fillStyle = '#fff176';
      ctx.fillRect(this.position.x + 8, this.position.y + 20, 8, 18);
      ctx.fillRect(this.position.x + this.width - 16, this.position.y + 24, 8, 18);
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.arc(flameX, flameY, 24, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff3d00';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  drawTankDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const facingRight = !this.target || this.target.position.x + this.target.width / 2 >= x + this.width / 2;
    const cannonX = facingRight ? x + this.width - 8 : x - 48;
    const turretX = facingRight ? x + 54 : x + 18;

    ctx.fillStyle = '#2f3a25';
    ctx.fillRect(x + 6, y + 142, this.width - 12, 46);
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y + 184, this.width, 34);

    ctx.fillStyle = '#56613f';
    ctx.fillRect(x + 12, y + 102, this.width - 24, 54);
    ctx.fillStyle = '#6d7651';
    ctx.fillRect(turretX, y + 72, 48, 34);
    ctx.fillStyle = '#262b1f';
    ctx.fillRect(cannonX, y + 84, 56, 10);

    ctx.fillStyle = '#1a1a1a';
    for (let wheelX = x + 12; wheelX <= x + this.width - 24; wheelX += 24) {
      ctx.beginPath();
      ctx.arc(wheelX, y + 201, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#8a8f63';
    ctx.fillRect(x + 20, y + 118, 22, 14);
    ctx.fillRect(x + this.width - 42, y + 122, 20, 12);
    ctx.fillStyle = '#c9b458';
    ctx.fillRect(x + 46, y + 108, 8, 8);

    if (isTankIronWall(this)) {
      ctx.strokeStyle = '#d7d7d7';
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 7, y + 96, this.width - 14, 66);
      ctx.strokeRect(x + 2, y + 137, this.width - 4, 56);
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(x + 20, y + 132, 24, 10);
      ctx.fillRect(x + this.width - 44, y + 132, 24, 10);
      ctx.fillStyle = '#263238';
      ctx.fillRect(cannonX + (facingRight ? 46 : -10), y + 81, 14, 16);
    }
  }

  drawCowboyDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const facingRight = !this.target || this.target.position.x + this.target.width / 2 >= x + this.width / 2;
    const gunX = facingRight ? x + this.width - 2 : x - 20;

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x - 8, y + 12, this.width + 16, 10);
    ctx.fillRect(x + 10, y, this.width - 20, 18);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x + 8, y + 48, this.width - 16, 36);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 8, y + 86, this.width - 16, 5);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + 25, y + 84, 10, 9);
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(gunX, y + 52, 24, 8);
    ctx.fillRect(gunX + (facingRight ? 6 : 12), y + 58, 6, 14);

    if (isCowboyDeadeye(this)) {
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(x + 8, y + 34, this.width - 16, 8);
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + this.width / 2, y + 38, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + this.width / 2 - 22, y + 38);
      ctx.lineTo(x + this.width / 2 + 22, y + 38);
      ctx.moveTo(x + this.width / 2, y + 16);
      ctx.lineTo(x + this.width / 2, y + 60);
      ctx.stroke();
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(gunX + (facingRight ? 24 : -8), y + 50, 8, 12);
    }
  }

  drawReflecterDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const upgraded = isReflecterUpgrade(this);
    const mirrorLuck = isReflecterMirrorLuck(this) && !upgraded;
    const lightColor = getReflecterLightColor(this);

    ctx.fillStyle = upgraded ? '#07090d' : mirrorLuck ? '#10261d' : '#90a4ae';
    ctx.fillRect(x + 7, y + 12, this.width - 14, 30);
    ctx.fillStyle = upgraded ? '#1a1f2a' : mirrorLuck ? '#07120d' : '#263238';
    ctx.fillRect(x + 14, y + 22, this.width - 28, 8);
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 18, y + 20, 8, 8);
    ctx.fillRect(x + this.width - 26, y + 20, 8, 8);
    ctx.fillStyle = upgraded ? '#10141d' : mirrorLuck ? '#1b3b2a' : '#607d8b';
    ctx.fillRect(x + 10, y + 48, this.width - 20, 44);
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 24, y + 56, 12, 20);
    if (mirrorLuck) {
      ctx.fillStyle = '#fdd835';
      ctx.fillRect(x + this.width - 36, y + 56, 12, 20);
      ctx.strokeStyle = '#39ff88';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 14, y + 48, this.width - 28, 44);
      ctx.fillStyle = '#061a12';
      ctx.fillRect(x + 18, y + 82, this.width - 36, 14);
      ctx.fillStyle = '#39ff88';
      ctx.font = '900 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('777', x + this.width / 2, y + 94);
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.62)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 46);
      ctx.lineTo(x + 16, y + 34);
      ctx.lineTo(x + 28, y + 44);
      ctx.moveTo(x + this.width - 2, y + 46);
      ctx.lineTo(x + this.width - 16, y + 34);
      ctx.lineTo(x + this.width - 28, y + 44);
      ctx.stroke();
    }
    if (upgraded) {
      ctx.fillStyle = '#020307';
      ctx.fillRect(x + 2, y + 50, 10, 36);
      ctx.fillRect(x + this.width - 12, y + 50, 10, 36);
      ctx.fillStyle = lightColor;
      ctx.fillRect(x + 4, y + 58, 6, 18);
      ctx.fillRect(x + this.width - 10, y + 58, 6, 18);
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 6, y + 46, this.width - 12, 50);
      ctx.strokeRect(x + 18, y + 10, this.width - 36, 34);
      ctx.strokeStyle = hexToRgba(lightColor, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 96);
      ctx.lineTo(x + 28, y + 76);
      ctx.lineTo(x + 32, y + 96);
      ctx.lineTo(x + 48, y + 76);
      ctx.stroke();
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(x + 22, y + 28, this.width - 44, 4);
    }
    ctx.fillStyle = upgraded ? '#0b0f16' : mirrorLuck ? '#0f2319' : '#455a64';
    ctx.fillRect(x + 8, y + 98, 16, 22);
    ctx.fillRect(x + this.width - 24, y + 98, 16, 22);
  }

  drawReflecterShield() {
    const upgraded = isReflecterUpgrade(this);
    const mirrorLuck = isReflecterMirrorLuck(this) && !upgraded;
    const lightColor = getReflecterLightColor(this);
    ctx.strokeStyle = hexToRgba(lightColor, 0.82);
    ctx.lineWidth = upgraded ? 8 : mirrorLuck ? 7 : 5;
    ctx.beginPath();
    ctx.ellipse(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.width / 2 + (upgraded ? 34 : mirrorLuck ? 24 : 16),
      this.height / 2 + (upgraded ? 28 : mirrorLuck ? 18 : 12),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    if (upgraded) {
      ctx.strokeStyle = hexToRgba(lightColor, 0.28);
      ctx.lineWidth = 20;
      ctx.stroke();
    } else if (mirrorLuck) {
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.36)';
      ctx.lineWidth = 16;
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawKaiokenAura() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    const pulse = 1 + Math.sin(this.kaiokenTimer * 0.35) * 0.08;
    const radius = (this.height / 2 + 20) * pulse;

    ctx.fillStyle = 'rgba(183, 28, 28, 0.16)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 6, radius * 0.72, radius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.9)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.28)';
    ctx.lineWidth = 22;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 205, 210, 0.7)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i += 1) {
      const angle = i * (Math.PI / 5) - this.kaiokenTimer * 0.045;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * (radius - 18), centerY + Math.sin(angle) * (radius - 18));
      ctx.lineTo(centerX + Math.cos(angle) * (radius + 26), centerY + Math.sin(angle) * (radius + 26));
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.64)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      const sparkX = this.position.x - 12 + ((i * 23 + this.kaiokenTimer * 3) % (this.width + 24));
      const sparkY = this.position.y + 10 + ((i * 31 + this.kaiokenTimer * 2) % (this.height - 10));
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY - 9);
      ctx.lineTo(sparkX + 5, sparkY);
      ctx.lineTo(sparkX - 2, sparkY + 10);
      ctx.stroke();
    }
  }

  drawSwitcherDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const collarColor = this.getSwitcherModeColor();
    const prism = isSwitcherPrism(this);
    const overdrive = isPrismOverdriveActive();

    if (prism || overdrive) {
      ctx.strokeStyle = overdrive ? 'rgba(253, 216, 53, 0.82)' : hexToRgba(collarColor, 0.62);
      ctx.lineWidth = overdrive ? 5 : 3;
      ctx.strokeRect(x - 6, y + 4, this.width + 12, this.height - 8);
      if (prism) {
        ctx.strokeStyle = 'rgba(227, 242, 253, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 11, y - 2, this.width + 22, this.height + 4);
      }
    }

    ctx.fillStyle = prism ? '#1d2630' : '#37474f';
    ctx.fillRect(x + 8, y + 10, this.width - 16, 30);
    ctx.fillStyle = prism ? '#0d141a' : '#263238';
    ctx.fillRect(x + 14, y + 22, this.width - 28, 8);
    ctx.fillStyle = prism ? '#2b3440' : this.baseColor;
    ctx.fillRect(x, y + 46, this.width, 48);
    ctx.fillStyle = prism ? '#111820' : '#263238';
    ctx.fillRect(x + 10, y + 42, this.width - 20, 10);
    ctx.fillStyle = collarColor;
    ctx.fillRect(x + 25, y + 41, 10, 12);
    if (prism) {
      const prismColors = ['#ef5350', '#42a5f5', '#66bb6a', '#fdd835'];
      prismColors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + 8 + index * 11, y + 53, 10, 39 - index * 3);
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 7, y + 48);
      ctx.lineTo(x + this.width - 6, y + 88);
      ctx.moveTo(x + this.width - 7, y + 48);
      ctx.lineTo(x + 7, y + 88);
      ctx.stroke();
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(x + 20, y + 26, this.width - 40, 4);
    }
    ctx.fillStyle = collarColor;
    ctx.fillRect(x + 8, y + 58, this.width - 16, 5);
    ctx.fillStyle = switcherModeColors[switcherModes[(this.switcherModeIndex + 1) % switcherModes.length]];
    ctx.fillRect(x + 8, y + 68, this.width - 16, 4);
    ctx.fillStyle = switcherModeColors[switcherModes[(this.switcherModeIndex + 2) % switcherModes.length]];
    ctx.fillRect(x + 8, y + 78, this.width - 16, 4);
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(x + 6, y + 96, 18, 24);
    ctx.fillRect(x + this.width - 24, y + 96, 18, 24);

    if (this.switcherArmorTimer > 0) {
      ctx.strokeStyle = hexToRgba(switcherModeColors.yellow, 0.8);
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
      if (prism) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 14, y - 14, this.width + 28, this.height + 28);
      }
    }

    if (this.switcherRedStrikeTimer > 0 && this.switcherRedStrikeArea) {
      ctx.fillStyle = hexToRgba(switcherModeColors.red, 0.48);
      ctx.fillRect(
        this.switcherRedStrikeArea.x,
        this.switcherRedStrikeArea.y,
        this.switcherRedStrikeArea.width,
        this.switcherRedStrikeArea.height
      );
      ctx.strokeStyle = switcherModeColors.red;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        this.switcherRedStrikeArea.x,
        this.switcherRedStrikeArea.y,
        this.switcherRedStrikeArea.width,
        this.switcherRedStrikeArea.height
      );
    }
  }

  drawSorcererDetails() {
    const x = this.position.x;
    const y = this.position.y;

    ctx.fillStyle = '#17101f';
    ctx.fillRect(x - 8, y + 30, this.width + 16, 90);
    ctx.fillStyle = '#2a123b';
    ctx.fillRect(x + 6, y + 44, this.width - 12, 72);
    ctx.fillStyle = '#4a1f69';
    ctx.fillRect(x + 8, y + 48, 8, 64);
    ctx.fillRect(x + this.width - 16, y + 48, 8, 64);
    ctx.fillStyle = '#08080c';
    ctx.fillRect(x + 12, y + 52, this.width - 24, 16);
    ctx.fillStyle = '#d1b3ff';
    ctx.fillRect(x + 20, y + 56, 6, 5);
    ctx.fillRect(x + this.width - 26, y + 56, 6, 5);

    ctx.fillStyle = '#2f1747';
    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y - 20);
    ctx.lineTo(x + this.width + 14, y + 36);
    ctx.lineTo(x - 14, y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5e2a84';
    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y - 10);
    ctx.lineTo(x + this.width - 4, y + 30);
    ctx.lineTo(x + 8, y + 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#12091b';
    ctx.fillRect(x - 6, y + 32, this.width + 12, 10);
    ctx.fillStyle = '#6d2c91';
    ctx.fillRect(x + 8, y + 34, this.width - 16, 4);

    ctx.fillStyle = '#6d2c91';
    ctx.fillRect(x + 26, y + 76, 8, 34);
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(x + 30, y + 72, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(x - 10, y + 84, 14, 36);
    ctx.fillRect(x + this.width - 4, y + 84, 14, 36);
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(x - 8, y + 98, 10, 5);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + this.width - 2, y + 98, 10, 5);
  }

  drawJackpotAura() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const centerY = y + this.height / 2;
    const pulse = 1 + Math.sin(this.gamblerInvincibleTimer * 0.22) * 0.08;
    const outerRadius = (this.height / 2 + 30) * pulse;
    const colors = getJackpotAuraColors(this);

    ctx.strokeStyle = colors.outer;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.spark;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i += 1) {
      const angle = i * (Math.PI / 4) + this.gamblerInvincibleTimer * 0.035;
      const inner = outerRadius + 18;
      const outer = outerRadius + 34;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      ctx.stroke();
    }
  }

  drawGamblerDetails() {
    const x = this.position.x;
    const y = this.position.y;

    ctx.fillStyle = '#111';
    ctx.fillRect(x - 8, y + 12, this.width + 16, 8);
    ctx.fillRect(x + 10, y, this.width - 20, 18);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + 12, y + 8, this.width - 24, 5);

    ctx.fillStyle = '#263238';
    ctx.fillRect(x + 7, y + 44, this.width - 14, 52);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 26, y + 48, 10, 42);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(x + 28, y + 62, 6, 8);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 4, y + 56, 18, 26);
    ctx.fillStyle = '#111';
    ctx.fillRect(x - 1, y + 59, 12, 20);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + this.width - 8, y + 54, 14, 14);

    if (this.gamblerLuckWaveTimer > 0) {
      const progress = getGamblerLuckWaveProgress(this.gamblerLuckWaveTimer, this);
      const centerX = x + this.width / 2;
      const centerY = y + this.height / 2;
      const radius = 34 + progress * 92;
      ctx.strokeStyle = `rgba(102, 255, 128, ${0.72 * (1 - progress)})`;
      ctx.lineWidth = 6 - progress * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(0, 255, 90, ${0.34 * (1 - progress)})`;
      ctx.lineWidth = 14 - progress * 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.gamblerDamageBoostTimer > 0 || this.gamblerSpeedBoostTimer > 0) {
      ctx.strokeStyle = this.gamblerSpeedBoostTimer > 0 ? '#42a5f5' : '#fdd835';
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
    }

    if (this.gamblerStunTimer > 0) {
      ctx.fillStyle = '#ffeb3b';
      ctx.font = '900 18px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('XXX', x + this.width / 2, y - 12);
    }

    if (this.gamblerInvincibleTimer > 0) {
      this.drawJackpotAura();
    }

    if (this.gamblerLuckBonus > 0) {
      ctx.fillStyle = '#66bb6a';
      ctx.font = '900 14px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`LUCK +${Math.round(this.gamblerLuckBonus * 100)}%`, x + this.width / 2, y - 54);
    }
  }

  drawChronoDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;

    ctx.fillStyle = '#05070d';
    ctx.fillRect(x + 10, y + 14, this.width - 20, 24);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(x + 16, y + 24, 8, 7);
    ctx.fillRect(x + this.width - 24, y + 24, 8, 7);

    ctx.fillStyle = '#111827';
    ctx.fillRect(x + 8, y + 46, this.width - 16, 46);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(centerX - 4, y + 48, 8, 44);
    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.arc(centerX, y + 68, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, y + 68);
    ctx.lineTo(centerX, y + 57);
    ctx.moveTo(centerX, y + 68);
    ctx.lineTo(centerX + 9, y + 73);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 9, y + 96, 15, 24);
    ctx.fillRect(x + this.width - 24, y + 96, 15, 24);

    if (this.chronoSlowTimer > 0) {
      ctx.strokeStyle = 'rgba(38, 198, 218, 0.85)';
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 5, y - 5, this.width + 10, this.height + 10);
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.52)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, y + 68, 32, -Math.PI / 2, Math.PI * 1.4);
      ctx.stroke();
    }

    if (this.chronoTimeStopTimer > 0) {
      ctx.fillStyle = 'rgba(224, 247, 250, 0.18)';
      ctx.fillRect(x - 10, y - 10, this.width + 20, this.height + 20);
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 12, y - 12, this.width + 24, this.height + 24);
    }

    if (this.chronoMarkTimer > 0) {
      ctx.strokeStyle = 'rgba(253, 216, 53, 0.88)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, y + 36, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawGhostDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const phased = this.ghostPhaseTimer > 0;

    ctx.save();
    ctx.globalAlpha = phased ? 0.44 : 0.78;
    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.arc(centerX, y + 34, 24, Math.PI, 0);
    ctx.lineTo(x + this.width - 6, y + 92);
    ctx.lineTo(centerX + 10, y + 118);
    ctx.lineTo(centerX, y + 102);
    ctx.lineTo(centerX - 10, y + 118);
    ctx.lineTo(x + 6, y + 92);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 14, y + 30, 7, 7);
    ctx.fillRect(centerX + 7, y + 30, 7, 7);
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, y + 50, 8, 0, Math.PI);
    ctx.stroke();

    if (phased) {
      ctx.strokeStyle = 'rgba(224, 247, 250, 0.88)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 8, y - 8, this.width + 16, this.height + 16);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, y + 62, 42 + i * 13, -Math.PI * 0.15, Math.PI * 1.15);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawDivineGeneralDetails() {
    const x = this.position.x;
    const y = this.position.y;
    const centerX = x + this.width / 2;
    const adapting = this.divineAdaptTimer > 0;
    const adaptationCount = getDivineTotalAdaptationStacks(this);

    ctx.save();
    ctx.strokeStyle = adapting ? 'rgba(255, 235, 59, 0.9)' : 'rgba(224, 247, 250, 0.45)';
    ctx.lineWidth = adapting ? 5 : 3;
    ctx.beginPath();
    ctx.ellipse(centerX, y + this.height / 2, this.width * 0.72, this.height * 0.43, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.beginPath();
    ctx.moveTo(centerX - 23, y + 52);
    ctx.lineTo(centerX - 36, y + 88);
    ctx.lineTo(centerX - 22, y + 124);
    ctx.lineTo(centerX - 6, y + 132);
    ctx.lineTo(centerX + 5, y + 126);
    ctx.lineTo(centerX + 21, y + 132);
    ctx.lineTo(centerX + 32, y + 91);
    ctx.lineTo(centerX + 36, y + 88);
    ctx.lineTo(centerX + 22, y + 52);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.beginPath();
    ctx.moveTo(centerX - 27, y + 22);
    ctx.quadraticCurveTo(centerX - 18, y - 3, centerX + 2, y + 4);
    ctx.quadraticCurveTo(centerX + 28, y + 2, centerX + 31, y + 31);
    ctx.lineTo(centerX + 20, y + 58);
    ctx.lineTo(centerX + 6, y + 69);
    ctx.lineTo(centerX - 14, y + 61);
    ctx.lineTo(centerX - 30, y + 42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 17, y + 27, 8, 7);
    ctx.fillRect(centerX + 8, y + 26, 9, 8);
    ctx.fillRect(centerX - 4, y + 40, 7, 6);
    ctx.fillRect(centerX - 14, y + 52, 29, 5);

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    for (let rib = 0; rib < 4; rib += 1) {
      const ribY = y + 78 + rib * 15;
      ctx.beginPath();
      ctx.moveTo(centerX - 4, ribY);
      ctx.lineTo(centerX - 24, ribY + 8);
      ctx.moveTo(centerX + 4, ribY);
      ctx.lineTo(centerX + 24, ribY + 8);
      ctx.stroke();
    }

    ctx.strokeStyle = '#f7fbff';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - 28, y + 68);
    ctx.lineTo(x + 1, y + 101);
    ctx.lineTo(x + 17, y + 121);
    ctx.moveTo(centerX + 28, y + 68);
    ctx.lineTo(x + this.width - 1, y + 101);
    ctx.lineTo(x + this.width - 17, y + 121);
    ctx.stroke();

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(x + 10, y + 115, 16, 14);
    ctx.fillRect(x + this.width - 26, y + 115, 16, 14);

    ctx.fillStyle = '#111';
    ctx.fillRect(centerX - 31, y + 122, 62, 24);
    ctx.fillRect(centerX - 28, y + 144, 22, 24);
    ctx.fillRect(centerX + 6, y + 144, 22, 24);

    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(centerX - 33, y + 119, 14, 15);
    ctx.fillRect(centerX + 19, y + 119, 14, 15);

    ctx.restore();

    if (adaptationCount > 0) {
      ctx.fillStyle = 'rgba(17, 17, 17, 0.82)';
      ctx.fillRect(centerX - 36, y - 30, 72, 22);
      ctx.fillStyle = '#fdd835';
      ctx.font = '900 13px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ADAPT ${adaptationCount}`, centerX, y - 14);
    }
  }

  drawGamblerRoll() {
    const x = this.position.x + this.width / 2;
    const y = this.position.y - 34;
    ctx.fillStyle = 'rgba(17, 17, 17, 0.88)';
    ctx.fillRect(x - 54, y - 24, 108, 30);
    ctx.strokeStyle = '#fdd835';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 54, y - 24, 108, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '900 20px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.gamblerRollNumbers.join('  '), x, y - 2);
  }

  getSwitcherMode() {
    return switcherModes[this.switcherModeIndex];
  }

  getSwitcherModeColor() {
    return switcherModeColors[this.getSwitcherMode()];
  }

  update() {
    if (gameOver) return;
    this.draw();

    if (this.chronoTimeStopTimer > 0) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.chronoTimeStopTimer -= 1;
      if (this.chronoMarkTimer > 0) this.chronoMarkTimer -= 1;
      if (this.chronoMarkTimer <= 0) this.chronoMarkedBy = null;
      return;
    }

    if (this.divineAdaptTimer > 0) {
      this.velocity.x = 0;
      this.divineAdaptTimer -= 1;
    }

    if (this.switcherDashTimer > 0) {
      this.velocity.x = this.switcherDashDirection * 22 * getDebugMultiplier('moveMultiplier', this);
      this.switcherDashTimer -= 1;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.chronoSlowTimer > 0) {
      this.chronoSlowTimer -= 1;
    }

    if (this.chronoMarkTimer > 0) {
      this.chronoMarkTimer -= 1;
      if (this.chronoMarkTimer <= 0) this.chronoMarkedBy = null;
    }

    if (this.position.y + this.height + this.velocity.y >= ground) {
      this.velocity.y = 0;
      this.position.y = ground - this.height;
    } else {
      this.velocity.y += getDebugGravity(this);
    }

    this.position.x = Math.max(0, Math.min(canvas.width - this.width, this.position.x));

    if (this.isAttacking) {
      this.attackTimer += 1;
      if (this.attackTimer > this.attackDuration) {
        this.isAttacking = false;
        this.attackTimer = 0;
      }
    }

    if (this.strongAttackCooldown > 0) {
      this.strongAttackCooldown -= 1;
    }

    if (this.specialCooldown > 0) {
      this.specialCooldown -= 1;
    }

    if (this.fireBeamCooldown > 0) {
      this.fireBeamCooldown -= 1;
    }

    if (this.tankAttackCooldown > 0) {
      this.tankAttackCooldown -= 1;
    }

    if (this.tankShellCooldown > 0) {
      this.tankShellCooldown -= 1;
    }

    if (this.cowboyBurstCooldown > 0) {
      this.cowboyBurstCooldown -= 1;
    }

    if (this.kaiokenCooldown > 0) {
      this.kaiokenCooldown -= 1;
    }

    if (this.kaiokenComboCooldown > 0) {
      this.kaiokenComboCooldown -= 1;
    }

    if (this.kaiokenComboVisualTimer > 0) {
      this.kaiokenComboVisualTimer -= 1;
      if (this.kaiokenComboVisualTimer === 0 && this.characterType === 'normal') {
        this.attackBox = {
          offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
          width: 70,
          height: 30,
        };
        this.isAttacking = false;
      }
    }

    if (this.kaiokenTimer > 0) {
      this.kaiokenTimer -= 1;
      if (this.kaiokenTimer === 0 && this.characterType === 'normal') {
        this.setMaxHealth(this.kaiokenBaseMaxHealth || 100);
      }
    }

    if (this.sorcererOrbCooldown > 0) {
      this.sorcererOrbCooldown -= 1;
    }

    if (this.sorcererGravityCooldown > 0) {
      this.sorcererGravityCooldown -= 1;
    }

    if (this.sorcererSecretOrbCooldown > 0) {
      this.sorcererSecretOrbCooldown -= 1;
    }

    if (this.chronoBladeCooldown > 0) {
      this.chronoBladeCooldown -= 1;
    }

    if (this.chronoSlowCooldown > 0) {
      this.chronoSlowCooldown -= 1;
    }

    if (this.chronoTimeStopCooldown > 0) {
      this.chronoTimeStopCooldown -= 1;
    }

    if (this.ghostPhaseCooldown > 0) {
      this.ghostPhaseCooldown -= 1;
    }

    if (this.ghostPhaseTimer > 0) {
      this.ghostPhaseTimer -= 1;
      this.updateGhostPhaseContact();
    }

    if (this.ghostPhaseContactTimer > 0) {
      this.ghostPhaseContactTimer -= 1;
    }

    if (this.divineAdaptCooldown > 0) {
      this.divineAdaptCooldown -= 1;
    }
    if (this.divineCounterCooldown > 0) {
      this.divineCounterCooldown -= 1;
    }

    if (this.copycatShieldCooldown > 0) {
      this.copycatShieldCooldown -= 1;
    }

    if (this.copycatShieldTimer > 0) {
      this.copycatShieldTimer -= 1;
    }

    if (this.gamblerRollCooldown > 0) {
      this.gamblerRollCooldown -= 1;
    }

    if (this.gamblerLuckCooldown > 0) {
      this.gamblerLuckCooldown -= 1;
    }

    if (this.gamblerLuckWaveTimer > 0) {
      this.gamblerLuckWaveTimer -= 1;
    }

    if (this.gamblerRollTimer > 0) {
      this.gamblerRollTimer -= 1;
    }

    if (this.gamblerDamageBoostTimer > 0) {
      this.gamblerDamageBoostTimer -= 1;
      if (this.gamblerDamageBoostTimer === 0) {
        this.gamblerDamageBoost = 0;
      }
    }

    if (this.gamblerSpeedBoostTimer > 0) {
      this.gamblerSpeedBoostTimer -= 1;
      if (this.gamblerSpeedBoostTimer === 0) {
        this.gamblerSpeedBoost = 0;
      }
    }

    if (this.gamblerStunTimer > 0) {
      this.gamblerStunTimer -= 1;
    }

    if (this.gamblerInvincibleTimer > 0) {
      this.gamblerInvincibleTimer -= 1;
    }

    if (this.terrainEffectCooldown > 0) {
      this.terrainEffectCooldown -= 1;
    }

    if (this.switcherAbilityCooldown > 0) {
      this.switcherAbilityCooldown -= 1;
    }

    if (this.switcherArmorTimer > 0) {
      this.switcherArmorTimer -= 1;
      if (this.switcherArmorTimer === 0 && this.characterType === 'switcher') {
        this.setMaxHealth(switcherHealth);
      }
    }

    if (this.switcherRedStrikeTimer > 0) {
      this.switcherRedStrikeTimer -= 1;
      if (this.switcherRedStrikeTimer === 0) {
        this.switcherRedStrikeArea = null;
      }
    }

    this.updateKaiokenCombo();
    this.updateCowboyBurst();
  }

  updateKaiokenCombo() {
    if (this.kaiokenComboHitsRemaining <= 0) return;

    if (this.kaiokenTimer <= 0 || this.characterType !== 'normal') {
      this.kaiokenComboHitsRemaining = 0;
      return;
    }

    if (this.kaiokenComboTimer > 0) {
      this.kaiokenComboTimer -= 1;
      return;
    }

    const target = this.target || getOpponent(this);
    strikeKaiokenCombo(this, target);
    this.kaiokenComboHitsRemaining -= 1;
    this.kaiokenComboTimer = kaiokenComboInterval;
  }

  updateCowboyBurst() {
    if (this.cowboyBurstShotsRemaining <= 0) return;

    if (this.cowboyBurstTimer > 0) {
      this.cowboyBurstTimer -= 1;
      return;
    }

    shootCowboyBullet(this, this.target);
    this.cowboyBurstShotsRemaining -= 1;
    this.cowboyBurstTimer = cowboyBurstInterval;
  }

  updateGhostPhaseContact() {
    if (this.characterType !== 'ghost' || this.ghostPhaseContactTimer > 0) return;

    const target = this.target || getOpponent(this);
    if (!target || target.health <= 0) return;
    const phaseContactArea = {
      x: this.position.x - 8,
      y: this.position.y + 8,
      width: this.width + 16,
      height: this.height - 10,
    };
    if (!rectangularCollision({ rectangle1: phaseContactArea, rectangle2: target })) return;

    const actualDamage = applyDamage(this, target, ghostPhaseContactDamage, { isSpecial: true, damageType: 'spiritPhase' });
    if (actualDamage > 0) {
      this.ghostPhaseContactTimer = ghostPhaseContactInterval;
    }
  }

  attack(isStrong = false) {
    if (this.isAttacking || gameOver) return;
    if (!canFighterAct(this)) return;
    if (this.gamblerStunTimer > 0) return;
    if (this.characterType === 'cowboy' && isDesertCowboyDuelPreparing()) return;
    if (this.characterType === 'tank' && this.tankAttackCooldown > 0) return;
    if (isStrong && this.strongAttackCooldown > 0) return;

    this.isAttacking = true;
    this.attackTimer = 0;
    this.currentAttackDamage = getAttackDamage(this, isStrong);

    if (isStrong) {
      this.strongAttackCooldown = getDebugCooldown(70, this);
    }

    if (this.characterType === 'tank') {
      this.tankAttackCooldown = getDebugCooldown(tankAttackCooldown, this);
    }
  }

  setColor(color) {
    this.baseColor = color;
    if (
      this.characterType === 'fireMaster' ||
      this.characterType === 'tank' ||
      this.characterType === 'reflecter' ||
      this.characterType === 'sorcerer' ||
      this.characterType === 'chrono' ||
      this.characterType === 'ghost' ||
      this.characterType === 'divineGeneral'
    ) {
      if (this.characterType === 'reflecter') {
        this.attackColor = hexToRgba(getReflecterLightColor(this), isReflecterUpgrade(this) ? 0.82 : 0.65);
      }
      return;
    }

    this.color = color;
    this.attackColor = hexToRgba(color, 0.65);
  }

  setCharacterType(characterType, secretVariant = null) {
    this.characterType = characterType;
    this.secretVariant = secretVariant;
    if (characterType === 'fireMaster') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1.5;
      this.attackDuration = 22;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(120);
      this.color = '#fb8c00';
      this.attackColor = hexToRgba('#fb8c00', 0.65);
      return;
    }

    if (characterType === 'cowboy') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(cowboyHealth);
      this.color = this.baseColor;
      this.attackColor = hexToRgba(this.baseColor, 0.65);
      return;
    }

    if (characterType === 'reflecter') {
      const reflecterRange = isReflecterUpgrade(this) ? 100 : 70;
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -reflecterRange, y: 20 },
        width: reflecterRange,
        height: isReflecterUpgrade(this) ? 46 : 30,
      };
      this.setMaxHealth(getReflecterHealth(this));
      this.color = isReflecterUpgrade(this) ? '#05070b' : '#78909c';
      this.attackColor = hexToRgba(getReflecterLightColor(this), isReflecterUpgrade(this) ? 0.82 : 0.65);
      return;
    }

    if (characterType === 'switcher') {
      this.width = 60;
      this.height = 120;
      this.switcherModeIndex = 0;
      this.switcherAbilityCooldown = 0;
      this.switcherArmorTimer = 0;
      this.switcherRedStrikeTimer = 0;
      this.switcherRedStrikeArea = null;
      this.switcherDashTimer = 0;
      this.switcherDashDirection = 1;
      this.moveSpeed = switcherModeStats[this.getSwitcherMode()].moveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(switcherHealth);
      this.color = this.baseColor;
      this.attackColor = hexToRgba(this.getSwitcherModeColor(), 0.65);
      return;
    }

    if (characterType === 'sorcerer') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(sorcererHealth);
      this.color = '#12091b';
      this.attackColor = 'rgba(109, 44, 145, 0.72)';
      return;
    }

    if (characterType === 'gambler') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
        width: 70,
        height: 30,
      };
      this.setMaxHealth(gamblerHealth);
      this.color = '#263238';
      this.attackColor = 'rgba(253, 216, 53, 0.65)';
      return;
    }

    if (characterType === 'chrono') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 12;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -72, y: 18 },
        width: 72,
        height: 34,
      };
      this.setMaxHealth(chronoHealth);
      this.color = '#0f172a';
      this.attackColor = 'rgba(38, 198, 218, 0.7)';
      return;
    }

    if (characterType === 'ghost') {
      this.width = 60;
      this.height = 120;
      this.moveSpeed = playerMoveSpeed * 1.08;
      this.damageMultiplier = 1;
      this.attackDuration = 10;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -54, y: 26 },
        width: 54,
        height: 28,
      };
      this.setMaxHealth(ghostHealth);
      this.color = 'rgba(224, 247, 250, 0.42)';
      this.attackColor = 'rgba(224, 247, 250, 0.54)';
      return;
    }

    if (characterType === 'tank') {
      this.width = 120;
      this.height = 240;
      this.moveSpeed = playerMoveSpeed * 0.5;
      this.damageMultiplier = 1;
      this.attackDuration = 28;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -115, y: 92 },
        width: 115,
        height: 58,
      };
      this.setMaxHealth(isTankIronWall(this) ? 260 : 200);
      this.color = '#56613f';
      this.attackColor = 'rgba(201, 180, 88, 0.7)';
      return;
    }

    if (characterType === 'divineGeneral') {
      this.width = 84;
      this.height = 168;
      this.moveSpeed = divineGeneralMoveSpeed;
      this.damageMultiplier = 1;
      this.attackDuration = 16;
      this.attackBox = {
        offset: { x: this.attacksToTheRight ? this.width : -92, y: 58 },
        width: 92,
        height: 46,
      };
      this.setMaxHealth(getDivineMaxHealth(this));
      this.color = '#f7fbff';
      this.attackColor = 'rgba(224, 247, 250, 0.72)';
      this.divineAdaptations = {};
      if (isDivineFullAdapt(this)) {
        fillDivineAdaptations(this);
        this.divineAdaptCooldown = 0;
        this.divineCounterCooldown = 0;
      }
      return;
    }

    this.width = 60;
    this.height = 120;
    this.moveSpeed = playerMoveSpeed;
    this.damageMultiplier = 1;
    this.attackDuration = 12;
    this.attackBox = {
      offset: { x: this.attacksToTheRight ? this.width : -70, y: 20 },
      width: 70,
      height: 30,
    };
    this.setMaxHealth(100);
    this.color = this.baseColor;
    this.attackColor = hexToRgba(this.baseColor, 0.65);
  }

  setMaxHealth(maxHealth) {
    this.baseMaxHealth = maxHealth;
    this.maxHealth = getDebugMaxHealth(maxHealth, this);
    this.health = Math.min(this.health, this.maxHealth);
  }

  reset({ x, y }) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.terrainEffectCooldown = 0;
    if (this.characterType === 'switcher') {
      this.switcherModeIndex = 0;
      this.setMaxHealth(switcherHealth);
      this.moveSpeed = switcherModeStats[this.getSwitcherMode()].moveSpeed;
      this.attackColor = hexToRgba(this.getSwitcherModeColor(), 0.65);
    }
    this.health = this.maxHealth;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.currentAttackDamage = attackDamage;
    this.strongAttackCooldown = 0;
    this.specialCooldown = 0;
    this.fireBeamCooldown = 0;
    this.tankAttackCooldown = 0;
    this.tankShellCooldown = 0;
    this.cowboyBurstCooldown = 0;
    this.kaiokenCooldown = 0;
    this.kaiokenComboCooldown = 0;
    this.kaiokenComboHitsRemaining = 0;
    this.kaiokenComboTimer = 0;
    this.kaiokenComboVisualTimer = 0;
    this.kaiokenTimer = 0;
    this.kaiokenBaseMaxHealth = this.characterType === 'normal' ? this.baseMaxHealth : 100;
    this.sorcererOrbCooldown = 0;
    this.sorcererGravityCooldown = 0;
    this.sorcererSecretOrbCooldown = 0;
    this.chronoBladeCooldown = 0;
    this.chronoSlowCooldown = 0;
    this.chronoSlowTimer = 0;
    this.chronoMarkTimer = 0;
    this.chronoMarkedBy = null;
    this.chronoTimeStopCooldown = 0;
    this.chronoTimeStopTimer = 0;
    this.ghostPhaseCooldown = 0;
    this.ghostPhaseTimer = 0;
    this.ghostPhaseContactTimer = 0;
    this.divineAdaptCooldown = 0;
    this.divineAdaptTimer = 0;
    this.divineAdaptations = {};
    this.divineCounterCooldown = 0;
    this.cowboyBurstShotsRemaining = 0;
    this.cowboyBurstTimer = 0;
    this.copycatShieldCooldown = 0;
    this.copycatShieldTimer = 0;
    this.gamblerRollCooldown = 0;
    this.gamblerLuckCooldown = 0;
    this.gamblerLuckBonus = 0;
    this.gamblerLuckWaveTimer = 0;
    this.gamblerRollTimer = 0;
    this.gamblerRollNumbers = [];
    this.gamblerDamageBoost = 0;
    this.gamblerDamageBoostTimer = 0;
    this.gamblerSpeedBoost = 0;
    this.gamblerSpeedBoostTimer = 0;
    this.gamblerStunTimer = 0;
    this.gamblerInvincibleTimer = 0;
    this.switcherAbilityCooldown = 0;
    this.switcherArmorTimer = 0;
    this.switcherRedStrikeTimer = 0;
    this.switcherRedStrikeArea = null;
    this.switcherDashTimer = 0;
    this.switcherDashDirection = 1;
    if (blindMode) {
      applyBlindFighterLook(this);
    }
  }
}

class Fireball {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(fireballSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 34;
    this.height = 22;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(this.position.x + 6, this.position.y + 5, this.width - 12, this.height - 10);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(this.position.x + this.width - 10, this.position.y + 7, 8, 8);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class FireBeam {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(fireBeamSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 90;
    this.height = 16;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = '#fff3e0';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#ff6d00';
    ctx.fillRect(this.position.x, this.position.y + 4, this.width, this.height - 8);
    ctx.fillStyle = '#d50000';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? 0 : this.width - 12), this.position.y + 2, 12, this.height - 4);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class TankShell {
  constructor({ x, y, direction, target, attacker, damage = getTankSecretDamage(attacker, tankShellDamage), empowered = false }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(tankShellSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damage = damage;
    this.empowered = empowered;
    this.width = 28;
    this.height = 14;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = this.empowered ? '#111' : '#2b2b2b';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.empowered ? '#ffeb3b' : '#c9b458';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 8 : 0), this.position.y + 3, 8, 8);
    if (this.empowered) {
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.position.x - 3, this.position.y - 3, this.width + 6, this.height + 6);
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class CowboyBullet {
  constructor({ x, y, direction, target, attacker, damage = cowboyBulletDamage, fixedDamage = false }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(cowboyBulletSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damage = damage;
    this.fixedDamage = fixedDamage;
    this.width = 18;
    this.height = 6;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(this.position.x + 3, this.position.y + 1, this.width - 6, 2);
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class SorcererOrb {
  constructor({ x, y, direction, target, attacker, damageMultiplier = 1 }) {
    this.position = { x, y };
    this.velocity = { x: getDebugProjectileSpeed(sorcererOrbSpeed, attacker) * direction, y: 0 };
    this.target = target;
    this.attacker = attacker;
    this.damageMultiplier = damageMultiplier;
    this.width = 36;
    this.height = 36;
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw() {
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;

    ctx.fillStyle = 'rgba(255, 23, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 27, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 82, 82, 0.72)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(centerX + 7, centerY - 7, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.x + this.width < 0 || this.position.x > canvas.width) {
      this.active = false;
    }
  }
}

class SorcererGravityOrb {
  constructor({ x, y, target, attacker }) {
    this.position = { x, y };
    this.target = target;
    this.attacker = attacker;
    this.width = attacker.width * 3;
    this.height = attacker.width * 3;
    this.timer = getDebugDuration(sorcererGravityDuration, attacker);
    this.active = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get centerX() {
    return this.position.x + this.width / 2;
  }

  get centerY() {
    return this.position.y + this.height / 2;
  }

  draw() {
    ctx.fillStyle = 'rgba(33, 150, 243, 0.16)';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(33, 150, 243, 0.88)';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(129, 212, 250, 0.62)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(187, 222, 251, 0.48)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0d47a1';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64b5f6';
    ctx.beginPath();
    ctx.arc(this.centerX + 7, this.centerY - 7, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.timer -= 1;
    this.pullTarget();
    this.draw();

    if (this.timer <= 0) {
      this.active = false;
    }
  }

  pullTarget() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = this.centerX - targetCenterX;
    const distanceY = this.centerY - targetCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const pullStrength = sorcererGravityPull * Math.min(1.35, 220 / distance);

    this.target.velocity.x += (distanceX / distance) * pullStrength;
    this.target.velocity.y += (distanceY / distance) * pullStrength;
  }
}

class SorcererSecretOrb {
  constructor({ attacker, target }) {
    this.attacker = attacker;
    this.target = target;
    this.finalSize = attacker.width * 3.5;
    this.size = 34;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.chargeTimer = sorcererSecretOrbChargeTime;
    this.launched = false;
    this.active = true;
    this.speed =
      getDebugProjectileSpeed(
        sorcererSecretOrbMinSpeed +
          Math.random() * (sorcererSecretOrbMaxSpeed - sorcererSecretOrbMinSpeed)
      );
    this.mirrorCollapsed = false;
    this.updateChargePosition();
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get width() {
    return this.size;
  }

  get height() {
    return this.size;
  }

  get centerX() {
    return this.position.x + this.size / 2;
  }

  get centerY() {
    return this.position.y + this.size / 2;
  }

  updateChargePosition() {
    const casterCenterX = this.attacker.position.x + this.attacker.width / 2;
    const casterCenterY = this.attacker.position.y + 30;
    this.position.x = casterCenterX - this.size / 2;
    this.position.y = casterCenterY - this.size / 2;
  }

  draw() {
    const centerX = this.centerX;
    const centerY = this.centerY;
    const radius = this.size / 2;

    ctx.fillStyle = this.mirrorCollapsed
      ? 'rgba(66, 165, 245, 0.34)'
      : this.launched
        ? 'rgba(123, 31, 162, 0.28)'
        : 'rgba(186, 104, 200, 0.18)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.mirrorCollapsed ? 'rgba(253, 216, 53, 0.78)' : 'rgba(225, 190, 231, 0.58)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(8, radius - 10), 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = this.mirrorCollapsed ? '#0d47a1' : '#4a148c';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.mirrorCollapsed ? '#42a5f5' : '#8e24aa';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.mirrorCollapsed ? '#fff59d' : '#ce93d8';
    ctx.beginPath();
    ctx.arc(centerX + radius * 0.22, centerY - radius * 0.24, Math.max(5, radius * 0.16), 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    if (!this.launched) {
      const progress = 1 - this.chargeTimer / sorcererSecretOrbChargeTime;
      this.size = 34 + (this.finalSize - 34) * progress;
      this.updateChargePosition();
      this.chargeTimer -= 1;
      if (this.chargeTimer <= 0) {
        this.launch();
      }
      this.draw();
      return;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();

    if (
      this.position.x + this.size < 0 ||
      this.position.x > canvas.width ||
      this.position.y + this.size < 0 ||
      this.position.y > canvas.height
    ) {
      this.active = false;
    }
  }

  launch() {
    const currentCenterX = this.centerX;
    const currentCenterY = this.centerY;
    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = targetCenterX - currentCenterX;
    const distanceY = targetCenterY - currentCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));

    this.launched = true;
    this.size = this.finalSize;
    this.position.x = currentCenterX - this.size / 2;
    this.position.y = currentCenterY - this.size / 2;
    this.velocity.x = (distanceX / distance) * this.speed;
    this.velocity.y = (distanceY / distance) * this.speed;
    playSound('sorcererSecretLaunch');
  }
}

class ChronoBlade {
  constructor({ x, y, target, attacker }) {
    this.position = { x, y };
    this.previousPosition = { x, y };
    this.target = target;
    this.attacker = attacker;
    this.width = 42;
    this.height = 14;
    this.active = true;
    const targetCenterX = target.position.x + target.width / 2;
    const targetCenterY = target.position.y + target.height / 2;
    const bladeCenterX = x + this.width / 2;
    const bladeCenterY = y + this.height / 2;
    const distanceX = targetCenterX - bladeCenterX;
    const distanceY = targetCenterY - bladeCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));
    const speed = getDebugProjectileSpeed(chronoBladeSpeed, attacker);
    this.velocity = {
      x: (distanceX / distance) * speed,
      y: (distanceY / distance) * speed,
    };
  }

  draw() {
    ctx.fillStyle = '#e0f7fa';
    ctx.fillRect(this.position.x, this.position.y + 3, this.width, this.height - 6);
    ctx.fillStyle = '#26c6da';
    ctx.fillRect(this.position.x + (this.velocity.x > 0 ? this.width - 14 : 0), this.position.y, 14, this.height);
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.72)';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.position.x - 3, this.position.y - 3, this.width + 6, this.height + 6);
  }

  update() {
    this.previousPosition = { ...this.position };
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();

    if (
      this.position.x + this.width < 0 ||
      this.position.x > canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y > canvas.height
    ) {
      this.active = false;
    }
  }
}

class ChronoZone {
  constructor({ attacker, target }) {
    const targetCenterX = target.position.x + target.width / 2;
    const targetCenterY = target.position.y + target.height / 2;
    this.position = {
      x: targetCenterX - chronoSlowRadius / 2,
      y: targetCenterY - chronoSlowRadius / 2,
    };
    this.width = chronoSlowRadius;
    this.height = chronoSlowRadius;
    this.attacker = attacker;
    this.target = target;
    this.timer = getDebugDuration(chronoSlowDuration, attacker);
    this.lockTimer = getDebugDuration(chronoSlowLockDuration, attacker);
    this.active = true;
  }

  get centerX() {
    return this.position.x + this.width / 2;
  }

  get centerY() {
    return this.position.y + this.height / 2;
  }

  draw() {
    const progress = this.timer / chronoSlowDuration;
    ctx.fillStyle = `rgba(38, 198, 218, ${0.08 + progress * 0.08})`;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(224, 247, 250, 0.82)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(38, 198, 218, 0.58)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.width / 2 - 24, -Math.PI / 2, Math.PI * 1.5 * progress);
    ctx.stroke();
  }

  update() {
    this.timer -= 1;
    if (this.lockTimer > 0) {
      this.lockTimer -= 1;
      this.followTarget();
    }
    this.applySlow();
    this.draw();

    if (this.timer <= 0) {
      this.active = false;
    }
  }

  followTarget() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    this.position.x += (targetCenterX - this.centerX) * 0.18;
    this.position.y += (targetCenterY - this.centerY) * 0.18;
    this.position.x = Math.max(0, Math.min(canvas.width - this.width, this.position.x));
    this.position.y = Math.max(60, Math.min(ground - this.height, this.position.y));
  }

  applySlow() {
    if (!this.target || this.target.health <= 0) return;

    const targetCenterX = this.target.position.x + this.target.width / 2;
    const targetCenterY = this.target.position.y + this.target.height / 2;
    const distanceX = this.centerX - targetCenterX;
    const distanceY = this.centerY - targetCenterY;
    const distance = Math.max(1, Math.hypot(distanceX, distanceY));

    if (distance <= this.width / 2) {
      this.target.chronoSlowTimer = Math.max(this.target.chronoSlowTimer, 8);
    }

    if (distance <= (this.width / 2) * 1.25) {
      const pullStrength = chronoSlowPull * (1 - Math.min(1, distance / ((this.width / 2) * 1.25)));
      this.target.velocity.x += (distanceX / distance) * pullStrength;
      this.target.velocity.y += (distanceY / distance) * pullStrength * 0.35;
    }
  }
}

const player1 = new Fighter({ x: 120, y: 0, color: '#42a5f5', attacksToTheRight: true });
const player2 = new Fighter({ x: 820, y: 0, color: '#ef5350', attacksToTheRight: false });
player1.target = player2;
player2.target = player1;

function rectangularCollision({ rectangle1, rectangle2 }) {
  const rectangle2X = rectangle2.position ? rectangle2.position.x : rectangle2.x;
  const rectangle2Y = rectangle2.position ? rectangle2.position.y : rectangle2.y;

  return (
    rectangle1.x < rectangle2X + rectangle2.width &&
    rectangle1.x + rectangle1.width > rectangle2X &&
    rectangle1.y < rectangle2Y + rectangle2.height &&
    rectangle1.y + rectangle1.height > rectangle2Y
  );
}

function getAttackDamage(attacker, isStrong = false) {
  if (attacker.characterType === 'ghost') return ghostDamage;
  if (attacker.characterType === 'divineGeneral') {
    const eventMultiplier = isAbsoluteAdaptationActive() ? 1.2 : 1;
    return (isStrong ? divineGeneralDamage * 2 : divineGeneralDamage) * getDivineBaseDamageMultiplier(attacker) * eventMultiplier;
  }
  if (attacker.characterType === 'tank') return getTankSecretDamage(attacker, tankDamage);
  if (attacker.characterType === 'reflecter' && !isStrong) return getReflecterDamage(attacker);
  if (attacker.characterType === 'normal') {
    const kaiokenMultiplier = isNormalKaioken(attacker) && attacker.kaiokenTimer > 0 ? kaiokenSecretDamageMultiplier : 1;
    return (isStrong ? heavyAttackDamage : attackDamage) * attacker.damageMultiplier * kaiokenMultiplier;
  }
  if (attacker.characterType === 'switcher' && !isStrong) {
    return switcherModeStats[attacker.getSwitcherMode()].damage * (1 + attacker.gamblerDamageBoost);
  }
  return (isStrong ? heavyAttackDamage : attackDamage) * attacker.damageMultiplier * (1 + attacker.gamblerDamageBoost);
}

function hasSecretVariant(fighter, variant, globalFlag = false) {
  return Boolean((fighter && fighter.secretVariant === variant) || globalFlag);
}

function isFireMasterOverheat(fighter) {
  return hasSecretVariant(fighter, 'fireMasterOverheat', characterSecretModes.fireMasterOverheat);
}

function isTankIronWall(fighter) {
  return hasSecretVariant(fighter, 'tankIronwall', characterSecretModes.tankIronWall);
}

function isCowboyDeadeye(fighter) {
  return hasSecretVariant(fighter, 'cowboyDeadeye', characterSecretModes.cowboyDeadeye);
}

function isNormalKaioken(fighter) {
  return hasSecretVariant(fighter, 'normalKaioken', characterSecretModes.normalKaioken);
}

function isReflecterMirrorLuck(fighter) {
  return hasSecretVariant(fighter, 'reflecterMirrorluck', characterSecretModes.reflecterMirrorLuck);
}

function isReflecterUpgrade(fighter) {
  return hasSecretVariant(fighter, 'reflecterUpgrade', characterSecretModes.reflecterUpgrade);
}

function isSwitcherPrism(fighter) {
  return hasSecretVariant(fighter, 'switcherPrism', characterSecretModes.switcherPrism);
}

function isDivineFullAdapt(fighter) {
  return hasSecretVariant(fighter, 'divineFullAdapt', characterSecretModes.divineFullAdapt);
}

function getDivineMaxHealth(fighter) {
  return isDivineFullAdapt(fighter) ? divineFullAdaptHealth : divineGeneralHealth;
}

function getDivineAdaptationStackLimit(fighter) {
  return isDivineFullAdapt(fighter) ? divineFullAdaptMaxStacks : divineGeneralMaxAdaptStacks;
}

function getRandomDivineFullAdaptStacks() {
  return divineFullAdaptMinStacks + Math.floor(Math.random() * (divineFullAdaptMaxStacks - divineFullAdaptMinStacks + 1));
}

function fillDivineAdaptations(fighter, stacks = null) {
  if (!fighter || fighter.characterType !== 'divineGeneral') return;

  if (!fighter.divineAdaptations) fighter.divineAdaptations = {};
  const stackLimit = getDivineAdaptationStackLimit(fighter);
  divineFullAdaptTypes.forEach((damageType) => {
    const resolvedStacks = stacks === null ? getRandomDivineFullAdaptStacks() : stacks;
    fighter.divineAdaptations[damageType] = Math.max(
      Math.max(0, Number(fighter.divineAdaptations[damageType]) || 0),
      Math.min(stackLimit, resolvedStacks)
    );
  });
}

function isPrismOverdriveActive() {
  return prismOverdrive.activeFrames > 0;
}

function isAbsoluteAdaptationActive() {
  return absoluteAdaptation.activeFrames > 0;
}

function getDivineAdaptCooldownMax(fighter = null) {
  const eventMultiplier = isAbsoluteAdaptationActive() ? 0.65 : 1;
  return getDebugCooldown(Math.round(divineGeneralAdaptCooldown * eventMultiplier), fighter);
}

function getDivineCounterCooldownMax(fighter = null) {
  const eventMultiplier = isAbsoluteAdaptationActive() ? 0.65 : 1;
  return getDebugCooldown(Math.round(divineGeneralCounterCooldown * eventMultiplier), fighter);
}

function getSwitcherAbilityCooldownMax(fighter) {
  const cooldownMultiplier = isPrismOverdriveActive()
    ? switcherPrismOverdriveCooldownMultiplier
    : isSwitcherPrism(fighter)
      ? switcherPrismCooldownMultiplier
      : 1;
  return getDebugCooldown(Math.round(switcherAbilityCooldown * cooldownMultiplier), fighter);
}

function syncSecretBodyModes() {
  document.body.classList.toggle('normal-kaioken-mode', characterSecretModes.normalKaioken);
  document.body.classList.toggle('reflecter-mirrorluck-mode', characterSecretModes.reflecterMirrorLuck);
  document.body.classList.toggle('reflecter-upgrade-mode', characterSecretModes.reflecterUpgrade);
  document.body.classList.toggle('switcher-prism-mode', characterSecretModes.switcherPrism);
}

function getReflecterDamage(fighter) {
  return isReflecterUpgrade(fighter) ? upgradedReflecterDamage : reflecterDamage;
}

function getReflecterHealth(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterHealth;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterHealth;
  return reflecterHealth;
}

function getReflecterShieldDuration(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterShieldDuration;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterShieldDuration;
  return reflecterShieldDuration;
}

function getReflecterShieldCooldown(fighter) {
  if (isReflecterUpgrade(fighter)) return upgradedReflecterShieldCooldown;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterShieldCooldown;
  return reflecterShieldCooldown;
}

function getReflecterCopyDamageMultiplier(fighter) {
  if (isReflecterUpgrade(fighter)) return 2;
  if (isReflecterMirrorLuck(fighter)) return mirrorLuckReflecterCopyDamageMultiplier;
  return 1;
}

function isBlueReflecter(fighter) {
  const color = String(fighter.baseColor || '').toLowerCase();
  return color === '#2196f3' || color === '#42a5f5' || color === 'blue';
}

function getReflecterLightColor(fighter) {
  if (isReflecterUpgrade(fighter) && isBlueReflecter(fighter)) return '#ff1744';
  if (isReflecterMirrorLuck(fighter)) return '#39ff88';
  return fighter.baseColor;
}

function formatDebugMultiplier(value) {
  return `${Number(value).toFixed(2).replace(/\.?0+$/, '')}x`;
}

function isDebugAffected(fighter) {
  if (!fighter || !fighter.characterType) return true;
  return debugAffectedCharacters[fighter.characterType] !== false;
}

function getDebugMultiplier(setting, fighter) {
  return isDebugAffected(fighter) ? debugSettings[setting] : 1;
}

function getDebugDamage(damage, fighter = null) {
  return damage * getDebugMultiplier('damageMultiplier', fighter);
}

function getDebugMaxHealth(baseMaxHealth, fighter = null) {
  return Math.max(1, Math.round(baseMaxHealth * getDebugMultiplier('healthMultiplier', fighter)));
}

function getDebugMoveSpeed(fighter) {
  const kaiokenMultiplier = isNormalKaioken(fighter) && fighter.characterType === 'normal' && fighter.kaiokenTimer > 0 ? kaiokenSecretSpeedMultiplier : 1;
  const chronoMultiplier = fighter.chronoSlowTimer > 0 ? chronoSlowFactor : 1;
  const ghostMultiplier = fighter.characterType === 'ghost' && fighter.ghostPhaseTimer > 0 ? ghostPhaseSpeedMultiplier : 1;
  return fighter.moveSpeed * getDebugMultiplier('moveMultiplier', fighter) * (1 + fighter.gamblerSpeedBoost) * kaiokenMultiplier * chronoMultiplier * ghostMultiplier;
}

function getDebugJumpSpeed(jumpSpeed, fighter = null) {
  return jumpSpeed * Math.sqrt(getDebugMultiplier('moveMultiplier', fighter));
}

function getDebugCooldown(cooldown, fighter = null) {
  return Math.max(0, Math.round(cooldown * getDebugMultiplier('cooldownMultiplier', fighter)));
}

function getDebugDuration(duration, fighter = null) {
  return Math.max(0, Math.round(duration * getDebugMultiplier('durationMultiplier', fighter)));
}

function getDebugKnockback(value, fighter = null) {
  return value * getDebugMultiplier('knockbackMultiplier', fighter);
}

function getDebugGravity(fighter = null) {
  return gravity * getDebugMultiplier('gravityMultiplier', fighter);
}

function getDebugProjectileSpeed(speed, fighter = null) {
  return speed * getDebugMultiplier('projectileMultiplier', fighter);
}

function getGamblerLuckWaveDuration(fighter = null) {
  return getDebugDuration(gamblerLuckWaveDuration, fighter);
}

function getGamblerLuckWaveProgress(timer, fighter = null) {
  const duration = Math.max(1, getGamblerLuckWaveDuration(fighter));
  return Math.max(0, Math.min(1, 1 - timer / duration));
}

function getFireMasterSecretDamage(attacker, damage) {
  return isFireMasterOverheat(attacker) ? damage * 1.35 : damage;
}

function getFireMasterSecretCooldown(attacker, cooldown) {
  return isFireMasterOverheat(attacker) ? cooldown * 0.7 : cooldown;
}

function getTankSecretDamage(attacker, damage) {
  return isTankIronWall(attacker) ? damage + 20 : damage;
}

function getCowboySecretDamage(attacker, damage) {
  return isCowboyDeadeye(attacker) ? damage + 4 : damage;
}

function getCowboySecretBurstShots(attacker) {
  return isCowboyDeadeye(attacker) ? cowboyBurstShots + 6 : cowboyBurstShots;
}

function shuffleCharacterTypes() {
  const availableTypes = getSelectableCharacterTypes();
  let shuffled = [...availableTypes];
  do {
    shuffled = [...availableTypes];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
  } while (shuffled.length > 1 && shuffled.some((characterType, index) => characterType === availableTypes[index]));

  return availableTypes.reduce((mix, characterType, index) => {
    mix[characterType] = shuffled[index];
    return mix;
  }, {});
}

function updateBlindCharacterLabels() {
  characterButtons.forEach(({ button, originalName }) => {
    const label = button.querySelector('span:first-child');
    label.innerText = blindMode ? 'guess who' : originalName;
  });
}

function applyBlindFighterLook(fighter) {
  fighter.width = 60;
  fighter.height = 120;
  fighter.moveSpeed = playerMoveSpeed;
  fighter.damageMultiplier = 1;
  fighter.attackDuration = 12;
  fighter.attackBox = {
    offset: { x: fighter.attacksToTheRight ? fighter.width : -70, y: 20 },
    width: 70,
    height: 30,
  };
  fighter.setMaxHealth(100);
  fighter.color = '#f5f5f5';
  fighter.attackColor = 'rgba(245, 245, 245, 0.65)';
}

function activateBlindMode() {
  blindMode = true;
  blindCharacterMix = shuffleCharacterTypes();
  document.body.classList.add('blind-mode');
  updateBlindCharacterLabels();
}

function deactivateBlindMode() {
  blindMode = false;
  blindCharacterMix = {};
  document.body.classList.remove('blind-mode');
  updateBlindCharacterLabels();
}

function unlockDarkRoomMap() {
  darkRoomUnlocked = true;
  darkRoomMapButton.classList.remove('hidden');
}

function lockDarkRoomMap() {
  darkRoomUnlocked = false;
  darkRoomMapButton.classList.add('hidden');
  if (selectedMap === 'darkRoom') {
    selectedMap = 'foundry';
  }
}

function clearActiveCodes() {
  Object.keys(characterSecretModes).forEach((secretKey) => {
    characterSecretModes[secretKey] = false;
  });
  deactivateBlindMode();
  lockDarkRoomMap();
  syncSecretBodyModes();

  [player1, player2].forEach((fighter) => {
    fighter.secretVariant = null;
    if (fighter.characterType === 'normal') {
      fighter.kaiokenTimer = 0;
      fighter.kaiokenCooldown = 0;
      fighter.kaiokenComboCooldown = 0;
      fighter.kaiokenComboHitsRemaining = 0;
      fighter.kaiokenComboTimer = 0;
      fighter.kaiokenComboVisualTimer = 0;
      fighter.setMaxHealth(100);
    } else if (fighter.characterType === 'reflecter') {
      fighter.setCharacterType('reflecter');
    } else if (fighter.characterType === 'tank') {
      fighter.setCharacterType('tank');
    } else if (fighter.characterType === 'switcher') {
      fighter.setCharacterType('switcher');
    } else if (fighter.characterType === 'divineGeneral') {
      fighter.setCharacterType('divineGeneral');
    }
  });

  resetDebugSettings();
  updateCooldownIndicators();
}

function handleCopycatShieldHit(defender, attacker) {
  if (
    !defender ||
    !attacker ||
    defender.characterType !== 'reflecter' ||
    defender.copycatShieldTimer <= 0
  ) {
    return false;
  }

  defender.copycatShieldTimer = 0;
  if (attacker.characterType === 'sorcerer') {
    triggerArcaneRift();
  }
  playSound('reflectShield');
  replicateAbility(defender, attacker);
  return true;
}

function getCopycatShieldBounds(defender) {
  const extraX = isReflecterUpgrade(defender) ? 54 : 24;
  const extraY = isReflecterUpgrade(defender) ? 40 : 18;
  return {
    position: {
      x: defender.position.x - extraX,
      y: defender.position.y - extraY,
    },
    width: defender.width + extraX * 2,
    height: defender.height + extraY * 2,
  };
}

function rectangularCopycatShieldCollision(defender, rectangle) {
  if (!defender || defender.characterType !== 'reflecter' || defender.copycatShieldTimer <= 0) return false;
  return rectangularCollision({ rectangle1: rectangle, rectangle2: getCopycatShieldBounds(defender) });
}

function replicateAbility(copycat, source) {
  fightAchievementFlags.copiedAbilityUsedBy = copycat;
  switch (source.characterType) {
    case 'fireMaster':
      copyFireMasterAbility(copycat, source);
      break;
    case 'tank':
      copyTankAbility(copycat, source);
      break;
    case 'cowboy':
      copyCowboyAbility(copycat, source);
      break;
    case 'switcher':
      copySwitcherAbility(copycat, source);
      break;
    case 'sorcerer':
      copySorcererAbility(copycat, source);
      break;
    case 'gambler':
      copyGamblerAbility(copycat);
      break;
    case 'chrono':
      copyChronoAbility(copycat, source);
      break;
    case 'divineGeneral':
      activateDivineAdaptation(copycat, true);
      break;
    case 'reflecter':
      activateCopycatShield(copycat);
      break;
    default:
      copyNormalAbility(copycat, source);
      break;
  }
}

function copyNormalAbility(copycat, source) {
  copycat.health = Math.min(copycat.maxHealth, copycat.health + reflecterHealAmount * getReflecterCopyDamageMultiplier(copycat));
  if (isReflecterUpgrade(copycat) && source && source.characterType === 'normal') {
    applyDamage(copycat, source, 20, { isSpecial: true, damageType: 'mirrorStrike' });
  }
}

function getJackpotAuraColors(fighter) {
  if (fighter.characterType === 'reflecter') {
    const lightColor = getReflecterLightColor(fighter);
    return {
      outer: hexToRgba(lightColor, 0.95),
      primary: hexToRgba(lightColor, 0.88),
      glow: hexToRgba(lightColor, 0.3),
      spark: 'rgba(227, 242, 253, 0.82)',
    };
  }

  return {
    outer: 'rgba(180, 255, 190, 0.95)',
    primary: 'rgba(0, 255, 90, 0.86)',
    glow: 'rgba(0, 255, 90, 0.28)',
    spark: 'rgba(200, 255, 120, 0.74)',
  };
}

function getOpponent(fighter) {
  return fighter === player1 ? player2 : player1;
}

function canFighterAct(fighter) {
  return fighter && fighter.chronoTimeStopTimer <= 0 && fighter.divineAdaptTimer <= 0;
}

function getPlayerStats(fighter) {
  return fighter === player1 ? fightStats.player1 : fightStats.player2;
}

function resetFightStats() {
  const freshStats = createEmptyFightStats();
  const freshAchievementFlags = createEmptyFightAchievementFlags();
  Object.assign(fightStats.player1, freshStats.player1);
  Object.assign(fightStats.player2, freshStats.player2);
  Object.assign(fightAchievementFlags, freshAchievementFlags);
  fightStartedAt = performance.now();
  currentFightStatisticsRecorded = false;
}

function recordSpecialUsed(attacker) {
  getPlayerStats(attacker).specialsUsed += 1;
}

function getDamageType(attacker, isSpecial, explicitDamageType) {
  if (explicitDamageType) return explicitDamageType;
  if (!isSpecial) return 'melee';
  if (!attacker) return 'special';

  switch (attacker.characterType) {
    case 'fireMaster':
      return 'fire';
    case 'cowboy':
      return 'ballistic';
    case 'tank':
      return 'shell';
    case 'sorcerer':
      return 'arcane';
    case 'chrono':
      return 'temporal';
    case 'ghost':
      return 'spirit';
    case 'gambler':
      return 'luck';
    case 'switcher':
      return 'prism';
    default:
      return 'special';
  }
}

function getDivineAdaptedDamage(target, damage, damageType) {
  if (!target || !target.divineAdaptations) return damage;

  const stacks = Math.max(0, Number(target.divineAdaptations[damageType]) || 0);
  if (stacks <= 0) return damage;

  const reduction = Math.min(divineGeneralAdaptReduction * stacks, divineGeneralAdaptReduction * divineGeneralMaxAdaptStacks);
  return damage * (1 - reduction);
}

function recordDivineAdaptation(target, damageType) {
  if (!target || !target.divineAdaptations || target.divineAdaptTimer <= 0) return;

  const currentStacks = Math.max(0, Number(target.divineAdaptations[damageType]) || 0);
  target.divineAdaptations[damageType] = Math.min(getDivineAdaptationStackLimit(target), currentStacks + 1);
}

function getDivineTotalAdaptationStacks(fighter) {
  if (!fighter || !fighter.divineAdaptations) return 0;

  return Object.values(fighter.divineAdaptations).reduce(
    (total, stacks) => total + Math.max(0, Number(stacks) || 0),
    0
  );
}

function getDivineBaseDamageMultiplier(fighter) {
  return 1 + getDivineTotalAdaptationStacks(fighter) * divineGeneralAdaptReduction;
}

function getDominantDivineAdaptation(fighter) {
  if (!fighter || !fighter.divineAdaptations) return null;

  return Object.entries(fighter.divineAdaptations).reduce((best, [damageType, stacks]) => {
    const normalizedStacks = Math.max(0, Number(stacks) || 0);
    if (normalizedStacks <= 0) return best;
    if (!best || normalizedStacks > best.stacks) return { damageType, stacks: normalizedStacks };
    return best;
  }, null);
}

function getDivineCounterType(attacker, target) {
  const dominantAdaptation = getDominantDivineAdaptation(attacker);
  if (dominantAdaptation) return dominantAdaptation.damageType;
  return getDamageType(target, true, null);
}

function getDivineCounterFamily(counterType) {
  if (counterType.includes('fire')) return 'fire';
  if (counterType.includes('bullet') || counterType.includes('ballistic')) return 'ballistic';
  if (counterType.includes('shell')) return 'shell';
  if (counterType.includes('arcane') || counterType.includes('gravity')) return 'arcane';
  if (counterType.includes('temporal')) return 'temporal';
  if (counterType.includes('spirit') || counterType.includes('ghost')) return 'spirit';
  if (counterType.includes('luck')) return 'luck';
  if (counterType.includes('prism')) return 'prism';
  return 'melee';
}

function getDivineAdaptationStacksByFamily(fighter, family) {
  if (!fighter || !fighter.divineAdaptations) return 0;

  return Object.entries(fighter.divineAdaptations).reduce((total, [damageType, stacks]) => {
    if (getDivineCounterFamily(damageType) !== family) return total;
    return total + Math.max(0, Number(stacks) || 0);
  }, 0);
}

function applyDamage(attacker, target, damage, { isSpecial = false, ignoreDebug = false, ignoreInvincible = false, recordStats = true, damageType = null } = {}) {
  if (!ignoreInvincible && target.gamblerInvincibleTimer > 0) return 0;
  if (!ignoreInvincible && target.ghostPhaseTimer > 0) return 0;

  const resolvedDamageType = getDamageType(attacker, isSpecial, damageType);
  if (!ignoreInvincible && target.characterType === 'divineGeneral' && target.divineAdaptTimer > 0) {
    recordDivineAdaptation(target, resolvedDamageType);
    return 0;
  }

  const adaptedDamage = getDivineAdaptedDamage(target, damage, resolvedDamageType);
  const previousHealth = Math.max(0, target.health);
  target.health = Math.max(0, target.health - (ignoreDebug ? adaptedDamage : getDebugDamage(adaptedDamage, attacker)));
  const actualDamage = previousHealth - target.health;

  if (actualDamage > 0) {
    recordDivineAdaptation(target, resolvedDamageType);
  }

  if (actualDamage > 0 && recordStats) {
    const stats = getPlayerStats(attacker);
    const targetStats = getPlayerStats(target);
    stats.damageDealt += actualDamage;
    targetStats.damageTaken += actualDamage;
    stats.hitsLanded += 1;
    if (isSpecial) {
      stats.specialsLanded += 1;
    }
    if (attacker.characterType === 'chrono' && target.chronoTimeStopTimer > 0) {
      fightAchievementFlags.timeStopDamageBy = attacker;
    }
  }

  return actualDamage;
}

function resetDesertCowboyDuel() {
  desertCowboyDuel.requiredStillFrames =
    desertCowboyDuelMinStillFrames +
    Math.floor(Math.random() * (desertCowboyDuelMaxStillFrames - desertCowboyDuelMinStillFrames + 1));
  desertCowboyDuel.stillFrames = 0;
  desertCowboyDuel.countdownFrames = 0;
  desertCowboyDuel.active = false;
  desertCowboyDuel.p1BulletAvailable = false;
  desertCowboyDuel.p2BulletAvailable = false;
}

function resetTankClash() {
  tankClash.closeFrames = 0;
  tankClash.active = false;
  tankClash.alertFrames = 0;
  tankClash.p1ShellAvailable = false;
  tankClash.p2ShellAvailable = false;
}

function resetArcaneRift() {
  arcaneRift.activeFrames = 0;
  arcaneRift.alertFrames = 0;
}

function resetMirrorCollapse() {
  mirrorCollapse.activeFrames = 0;
  mirrorCollapse.alertFrames = 0;
}

function resetCasinoRoyale() {
  casinoRoyale.triggered = false;
  casinoRoyale.activeFrames = 0;
  casinoRoyale.alertFrames = 0;
  casinoLuckyTileIndex = 2;
  casinoTileShiftTimer = casinoTileShiftFrames;
}

function resetManaMeltdown() {
  manaMeltdown.triggered = false;
  manaMeltdown.activeFrames = 0;
  manaMeltdown.alertFrames = 0;
}

function resetPrismOverdrive() {
  prismOverdrive.player1Uses = 0;
  prismOverdrive.player2Uses = 0;
  prismOverdrive.activeFrames = 0;
  prismOverdrive.alertFrames = 0;
}

function resetAbsoluteAdaptation() {
  absoluteAdaptation.triggered = false;
  absoluteAdaptation.activeFrames = 0;
  absoluteAdaptation.alertFrames = 0;
}

function resetFightEvents() {
  resetDesertCowboyDuel();
  resetTankClash();
  resetArcaneRift();
  resetMirrorCollapse();
  resetCasinoRoyale();
  resetManaMeltdown();
  resetPrismOverdrive();
  resetAbsoluteAdaptation();
}

function isDesertCowboyDuelMatch() {
  return (
    selectedMap === 'desert' &&
    player1.characterType === 'cowboy' &&
    player2.characterType === 'cowboy' &&
    !botEnabled
  );
}

function isFighterStill(fighter) {
  return Math.abs(fighter.velocity.x) < 0.05 && Math.abs(fighter.velocity.y) < 0.05;
}

function isDesertCowboyDuelPreparing() {
  return isDesertCowboyDuelMatch() && !desertCowboyDuel.active;
}

function isDesertCowboyDuelVisualActive() {
  return (
    isDesertCowboyDuelMatch() &&
    (desertCowboyDuel.stillFrames > 0 || desertCowboyDuel.countdownFrames > 0 || desertCowboyDuel.active)
  );
}

function isTankClashMatch() {
  return selectedMap === 'military' && player1.characterType === 'tank' && player2.characterType === 'tank';
}

function updateTankClash() {
  if (!isTankClashMatch() || gameOver) {
    resetTankClash();
    return;
  }

  if (tankClash.alertFrames > 0) tankClash.alertFrames -= 1;
  if (tankClash.active) return;

  const p1CenterX = player1.position.x + player1.width / 2;
  const p2CenterX = player2.position.x + player2.width / 2;
  const closeEnough = Math.abs(p1CenterX - p2CenterX) < 210;
  const bothGrounded = player1.velocity.y === 0 && player2.velocity.y === 0;

  if (closeEnough && bothGrounded) {
    tankClash.closeFrames += 1;
    if (tankClash.closeFrames >= tankClashRequiredFrames) {
      tankClash.active = true;
      tankClash.alertFrames = 210;
      fightAchievementFlags.tankClashActive = true;
      tankClash.p1ShellAvailable = true;
      tankClash.p2ShellAvailable = true;
      player1.tankShellCooldown = 0;
      player2.tankShellCooldown = 0;
    }
  } else {
    tankClash.closeFrames = 0;
  }
}

function isArcaneRiftMatch() {
  return (
    selectedMap === 'neon' &&
    ((player1.characterType === 'sorcerer' && player2.characterType === 'reflecter') ||
      (player1.characterType === 'reflecter' && player2.characterType === 'sorcerer'))
  );
}

function triggerArcaneRift() {
  if (!isArcaneRiftMatch()) return;

  arcaneRift.activeFrames = getDebugDuration(arcaneRiftDuration);
  arcaneRift.alertFrames = 210;
  player1.sorcererOrbCooldown = 0;
  player1.sorcererGravityCooldown = 0;
  player1.copycatShieldCooldown = 0;
  player2.sorcererOrbCooldown = 0;
  player2.sorcererGravityCooldown = 0;
  player2.copycatShieldCooldown = 0;
}

function updateArcaneRift() {
  if (!isArcaneRiftMatch() || gameOver) {
    resetArcaneRift();
    return;
  }

  if (arcaneRift.activeFrames > 0) arcaneRift.activeFrames -= 1;
  if (arcaneRift.alertFrames > 0) arcaneRift.alertFrames -= 1;
}

function getArcaneRiftOrbDamage() {
  return arcaneRift.activeFrames > 0 ? arcaneRiftOrbDamage : sorcererOrbDamage;
}

function isMirrorCollapseMatch() {
  return (
    (player1.characterType === 'sorcerer' && player2.characterType === 'reflecter') ||
    (player1.characterType === 'reflecter' && player2.characterType === 'sorcerer')
  );
}

function triggerMirrorCollapse(reflecter, sorcerer) {
  if (!isMirrorCollapseMatch()) return;

  mirrorCollapse.activeFrames = getDebugDuration(mirrorCollapseDuration);
  mirrorCollapse.alertFrames = 210;
  if (reflecter) reflecter.copycatShieldCooldown = 0;
  if (sorcerer) {
    sorcerer.sorcererSecretOrbCooldown = 0;
    sorcerer.sorcererGravityCooldown = 0;
  }
}

function updateMirrorCollapse() {
  if (!isMirrorCollapseMatch() || gameOver) {
    resetMirrorCollapse();
    return;
  }

  if (mirrorCollapse.activeFrames > 0) mirrorCollapse.activeFrames -= 1;
  if (mirrorCollapse.alertFrames > 0) mirrorCollapse.alertFrames -= 1;
}

function getSorcererSecretOrbDamage(orb) {
  const mirrorMultiplier = orb && orb.mirrorCollapsed ? mirrorCollapseSecretDamageMultiplier : 1;
  return sorcererSecretOrbDamage * mirrorMultiplier;
}

function isCasinoRoyaleMatch() {
  return selectedMap === 'casino' && player1.characterType === 'gambler' && player2.characterType === 'gambler' && !botEnabled;
}

function triggerCasinoRoyale() {
  casinoRoyale.triggered = true;
  casinoRoyale.activeFrames = getDebugDuration(casinoRoyaleDuration);
  casinoRoyale.alertFrames = 210;
  fightAchievementFlags.casinoRoyaleActive = true;
  [player1, player2].forEach((fighter) => {
    fighter.gamblerLuckBonus = Math.min(gamblerLuckCap, fighter.gamblerLuckBonus + casinoRoyaleLuckBonus);
    fighter.gamblerRollCooldown = 0;
    fighter.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(fighter);
  });
}

function updateCasinoRoyale() {
  if (!isCasinoRoyaleMatch() || gameOver) {
    if (!isCasinoRoyaleMatch()) resetCasinoRoyale();
    return;
  }

  if (casinoRoyale.activeFrames > 0) casinoRoyale.activeFrames -= 1;
  if (casinoRoyale.alertFrames > 0) casinoRoyale.alertFrames -= 1;
  if (casinoRoyale.triggered) return;

  if (player1.gamblerLuckBonus >= casinoRoyaleRequiredLuck && player2.gamblerLuckBonus >= casinoRoyaleRequiredLuck) {
    triggerCasinoRoyale();
  }
}

function isManaMeltdownMatch() {
  return (
    selectedMap === 'foundry' &&
    ((player1.characterType === 'fireMaster' && player2.characterType === 'sorcerer') ||
      (player1.characterType === 'sorcerer' && player2.characterType === 'fireMaster'))
  );
}

function triggerManaMeltdown() {
  manaMeltdown.triggered = true;
  manaMeltdown.activeFrames = getDebugDuration(manaMeltdownDuration);
  manaMeltdown.alertFrames = 210;
  fightAchievementFlags.manaMeltdownActive = true;
  player1.specialCooldown = 0;
  player1.fireBeamCooldown = 0;
  player1.sorcererOrbCooldown = 0;
  player1.sorcererGravityCooldown = 0;
  player2.specialCooldown = 0;
  player2.fireBeamCooldown = 0;
  player2.sorcererOrbCooldown = 0;
  player2.sorcererGravityCooldown = 0;
}

function updateManaMeltdown() {
  if (!isManaMeltdownMatch() || gameOver) {
    if (!isManaMeltdownMatch()) resetManaMeltdown();
    return;
  }

  if (manaMeltdown.activeFrames > 0) manaMeltdown.activeFrames -= 1;
  if (manaMeltdown.alertFrames > 0) manaMeltdown.alertFrames -= 1;
  if (manaMeltdown.triggered) return;

  const firePressure = fireballs.length > 0 || fireBeams.length > 0;
  const magicPressure = sorcererOrbs.length > 0 || sorcererGravityOrbs.length > 0 || sorcererSecretOrbs.length > 0;
  if (firePressure && magicPressure) {
    triggerManaMeltdown();
  }
}

function getElementalEventDamage(attacker, damage) {
  if (
    manaMeltdown.activeFrames > 0 &&
    (attacker.characterType === 'fireMaster' || attacker.characterType === 'sorcerer')
  ) {
    return damage * manaMeltdownDamageMultiplier;
  }

  return damage;
}

function isPrismOverdriveMatch() {
  return selectedMap === 'neon' && player1.characterType === 'switcher' && player2.characterType === 'switcher';
}

function triggerPrismOverdrive() {
  prismOverdrive.activeFrames = getDebugDuration(prismOverdriveDuration);
  prismOverdrive.alertFrames = 210;
  fightAchievementFlags.prismOverdriveActive = true;
  unlockAchievement('prismDriver');
  player1.switcherAbilityCooldown = 0;
  player2.switcherAbilityCooldown = 0;
}

function recordPrismSwitcherUse(attacker) {
  if (!isPrismOverdriveMatch() || gameOver || isPrismOverdriveActive() || attacker.characterType !== 'switcher') return;

  if (attacker === player1) {
    prismOverdrive.player1Uses += 1;
  } else if (attacker === player2) {
    prismOverdrive.player2Uses += 1;
  }

  if (prismOverdrive.player1Uses >= prismOverdriveRequiredUses && prismOverdrive.player2Uses >= prismOverdriveRequiredUses) {
    triggerPrismOverdrive();
  }
}

function updatePrismOverdrive() {
  if (!isPrismOverdriveMatch() || gameOver) {
    if (!isPrismOverdriveMatch()) resetPrismOverdrive();
    return;
  }

  if (prismOverdrive.activeFrames > 0) prismOverdrive.activeFrames -= 1;
  if (prismOverdrive.alertFrames > 0) prismOverdrive.alertFrames -= 1;
}

function isAbsoluteAdaptationMatch() {
  return (
    selectedMap === 'darkRoom' &&
    ((player1.characterType === 'divineGeneral' && player2.characterType === 'chrono') ||
      (player1.characterType === 'chrono' && player2.characterType === 'divineGeneral'))
  );
}

function getAbsoluteAdaptationFighters() {
  const divine = player1.characterType === 'divineGeneral' ? player1 : player2.characterType === 'divineGeneral' ? player2 : null;
  const chrono = player1.characterType === 'chrono' ? player1 : player2.characterType === 'chrono' ? player2 : null;
  return { divine, chrono };
}

function triggerAbsoluteAdaptation() {
  if (!isAbsoluteAdaptationMatch()) return;

  const { divine, chrono } = getAbsoluteAdaptationFighters();
  absoluteAdaptation.triggered = true;
  absoluteAdaptation.activeFrames = getDebugDuration(absoluteAdaptationDuration);
  absoluteAdaptation.alertFrames = 210;

  fillDivineAdaptations(divine, 2);
  if (divine) {
    divine.divineAdaptCooldown = 0;
    divine.divineCounterCooldown = 0;
    divine.divineAdaptTimer = Math.max(divine.divineAdaptTimer, getDebugDuration(60, divine));
  }
  if (chrono) {
    chrono.chronoBladeCooldown = 0;
    chrono.chronoSlowCooldown = 0;
    chrono.chronoTimeStopCooldown = 0;
  }
  playSound('secretOrb');
}

function updateAbsoluteAdaptation() {
  if (!isAbsoluteAdaptationMatch() || gameOver) {
    if (!isAbsoluteAdaptationMatch()) resetAbsoluteAdaptation();
    return;
  }

  if (absoluteAdaptation.activeFrames > 0) absoluteAdaptation.activeFrames -= 1;
  if (absoluteAdaptation.alertFrames > 0) absoluteAdaptation.alertFrames -= 1;
  if (absoluteAdaptation.triggered) return;

  const { divine } = getAbsoluteAdaptationFighters();
  if (divine && getDivineTotalAdaptationStacks(divine) >= absoluteAdaptationRequiredStacks) {
    triggerAbsoluteAdaptation();
  }
}

function getFighterCenterX(fighter) {
  return fighter.position.x + fighter.width / 2;
}

function isFighterGrounded(fighter) {
  return fighter.position.y + fighter.height >= ground - 1 && Math.abs(fighter.velocity.y) < 0.1;
}

function isCenterInRange(fighter, minX, maxX) {
  const centerX = getFighterCenterX(fighter);
  return centerX >= minX && centerX <= maxX;
}

function applyTerrainMoveModifiers() {
  if (selectedMap === 'alpha') return;

  [player1, player2].forEach((fighter) => {
    if (!isFighterGrounded(fighter)) return;

    if (
      selectedMap === 'desert' &&
      (isCenterInRange(fighter, 0, 250) || isCenterInRange(fighter, 760, canvas.width))
    ) {
      fighter.velocity.x *= 0.88;
    } else if (selectedMap === 'neon' && isCenterInRange(fighter, 364, 660)) {
      fighter.velocity.x *= 1.35;
    } else if (
      selectedMap === 'military' &&
      (isCenterInRange(fighter, 64, 282) || isCenterInRange(fighter, 714, 952))
    ) {
      fighter.velocity.x *= 0.72;
    }
  });
}

function updateCasinoTerrain() {
  if (selectedMap !== 'casino') return;

  casinoTileShiftTimer -= 1;
  if (casinoTileShiftTimer <= 0) {
    casinoLuckyTileIndex = (casinoLuckyTileIndex + 1) % 5;
    casinoTileShiftTimer = casinoTileShiftFrames;
  }

  const tileWidth = canvas.width / 5;
  const tileStart = casinoLuckyTileIndex * tileWidth;
  const tileEnd = tileStart + tileWidth;

  [player1, player2].forEach((fighter) => {
    if (!isFighterGrounded(fighter) || fighter.terrainEffectCooldown > 0 || !isCenterInRange(fighter, tileStart, tileEnd)) {
      return;
    }

    if (fighter.characterType === 'gambler') {
      fighter.gamblerLuckBonus = Math.min(gamblerLuckCap, fighter.gamblerLuckBonus + 0.08);
      fighter.gamblerRollCooldown = Math.max(0, fighter.gamblerRollCooldown - 90);
      fighter.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(fighter);
    } else {
    fighter.health = Math.min(fighter.maxHealth, fighter.health + getDebugMaxHealth(4, fighter));
    }
    fighter.terrainEffectCooldown = terrainEffectCooldownFrames;
  });
}

function updateTerrainInteractions() {
  if (selectedMap === 'alpha') return;

  updateCasinoTerrain();
}

function updateDesertCowboyDuel() {
  if (!isDesertCowboyDuelMatch() || gameOver) {
    resetDesertCowboyDuel();
    return;
  }

  if (desertCowboyDuel.active) return;

  if (desertCowboyDuel.countdownFrames > 0) {
    desertCowboyDuel.countdownFrames -= 1;
    if (desertCowboyDuel.countdownFrames === 0) {
      desertCowboyDuel.active = true;
      desertCowboyDuel.p1BulletAvailable = true;
      desertCowboyDuel.p2BulletAvailable = true;
      player1.cowboyBurstShotsRemaining = 0;
      player2.cowboyBurstShotsRemaining = 0;
      player1.cowboyBurstCooldown = 0;
      player2.cowboyBurstCooldown = 0;
    }
    return;
  }

  if (isFighterStill(player1) && isFighterStill(player2)) {
    desertCowboyDuel.stillFrames += 1;
    if (desertCowboyDuel.stillFrames >= desertCowboyDuel.requiredStillFrames) {
      desertCowboyDuel.countdownFrames = desertCowboyDuelCountdownFrames;
    }
  } else {
    desertCowboyDuel.stillFrames = 0;
  }
}

function getDesertCowboyDuelMessage() {
  if (!isDesertCowboyDuelMatch() || gameOver || desertCowboyDuel.active) return null;

  if (desertCowboyDuel.countdownFrames > 0) {
    const secondsLeft = Math.max(1, Math.ceil(desertCowboyDuel.countdownFrames / 60));
    return {
      title: 'Solo requerira una bala para acabar con el otro.',
      subtitle: secondsLeft === 1 ? 'LISTOS... DISPARA' : `LISTOS... ${secondsLeft}`,
    };
  }

  return null;
}

function drawDesertCowboyDuelAlert() {
  const message = getDesertCowboyDuelMessage();
  if (!message) return;

  ctx.save();
  ctx.fillStyle = 'rgba(17, 17, 17, 0.82)';
  ctx.fillRect(210, 70, 604, 96);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 5;
  ctx.strokeRect(210, 70, 604, 96);
  ctx.fillStyle = '#fff';
  ctx.font = '900 22px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(message.title, canvas.width / 2, 108);
  ctx.font = '900 24px Courier New, monospace';
  ctx.fillText(message.subtitle, canvas.width / 2, 140);
  ctx.restore();
}

function drawTankClashAlert() {
  if (tankClash.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(20, 24, 18, 0.86)';
  ctx.fillRect(252, 74, 520, 90);
  ctx.strokeStyle = '#ffeb3b';
  ctx.lineWidth = 5;
  ctx.strokeRect(252, 74, 520, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHOQUE DE TITANES', canvas.width / 2, 110);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('El proximo canon de cada Tank queda sobrecargado.', canvas.width / 2, 140);
  ctx.restore();
}

function drawArcaneRiftAlert() {
  if (arcaneRift.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(12, 8, 28, 0.88)';
  ctx.fillRect(234, 74, 556, 90);
  ctx.strokeStyle = '#ce93d8';
  ctx.lineWidth = 5;
  ctx.strokeRect(234, 74, 556, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RUPTURA ARCANA', canvas.width / 2, 110);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('La magia reflejada potencia las esferas rojas.', canvas.width / 2, 140);
  ctx.restore();
}

function drawMirrorCollapseAlert() {
  if (mirrorCollapse.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(7, 13, 32, 0.9)';
  ctx.fillRect(224, 174, 576, 86);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 5;
  ctx.strokeRect(224, 174, 576, 86);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 2;
  ctx.strokeRect(236, 186, 552, 62);
  ctx.fillStyle = '#fff';
  ctx.font = '900 24px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COLAPSO ESPEJO', canvas.width / 2, 208);
  ctx.font = '900 15px Courier New, monospace';
  ctx.fillText('La esfera secreta reflejada vuelve inestable el duelo.', canvas.width / 2, 236);
  ctx.restore();
}

function drawCasinoRoyaleAlert() {
  if (casinoRoyale.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(4, 20, 12, 0.88)';
  ctx.fillRect(242, 74, 540, 90);
  ctx.strokeStyle = '#66ff80';
  ctx.lineWidth = 5;
  ctx.strokeRect(242, 74, 540, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CASINO ROYALE', canvas.width / 2, 110);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Ambos Gambler ganan suerte y ruleta lista.', canvas.width / 2, 140);
  ctx.restore();
}

function drawManaMeltdownAlert() {
  if (manaMeltdown.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(36, 12, 8, 0.88)';
  ctx.fillRect(232, 74, 560, 90);
  ctx.strokeStyle = '#ff8f00';
  ctx.lineWidth = 5;
  ctx.strokeRect(232, 74, 560, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MANA MELTDOWN', canvas.width / 2, 110);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Fuego y magia hacen mas dano temporalmente.', canvas.width / 2, 140);
  ctx.restore();
}

function drawPrismOverdriveAlert() {
  if (prismOverdrive.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(8, 14, 28, 0.88)';
  ctx.fillRect(232, 74, 560, 90);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 5;
  ctx.strokeRect(232, 74, 560, 90);
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 2;
  ctx.strokeRect(244, 86, 536, 66);
  ctx.fillStyle = '#fff';
  ctx.font = '900 26px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PRISM OVERDRIVE', canvas.width / 2, 110);
  ctx.font = '900 16px Courier New, monospace';
  ctx.fillText('Switcher acelera sus cambios y habilidades.', canvas.width / 2, 140);
  ctx.restore();
}

function drawAbsoluteAdaptationAlert() {
  if (absoluteAdaptation.alertFrames <= 0) return;

  ctx.save();
  ctx.fillStyle = 'rgba(5, 7, 12, 0.9)';
  ctx.fillRect(216, 174, 592, 92);
  ctx.strokeStyle = '#e0f7fa';
  ctx.lineWidth = 5;
  ctx.strokeRect(216, 174, 592, 92);
  ctx.strokeStyle = '#ce93d8';
  ctx.lineWidth = 2;
  ctx.strokeRect(230, 188, 564, 64);
  ctx.fillStyle = '#fff';
  ctx.font = '900 25px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ABSOLUTE ADAPTATION', canvas.width / 2, 210);
  ctx.font = '900 15px Courier New, monospace';
  ctx.fillText('Divine entiende el tiempo; Chrono recupera sus herramientas.', canvas.width / 2, 238);
  ctx.restore();
}

function formatFightDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getVictoryPhrase(fighter, opponent) {
  const phraseSet = victoryPhrases[fighter.characterType] || victoryPhrases.normal;
  const phrases = phraseSet[opponent.characterType] || phraseSet.default || victoryPhrases.normal.default;
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, currentY);
  }
}

function drawVictoryCharacter(fighter, x, y, scale = 1) {
  const width = fighter.characterType === 'tank' ? 96 * scale : 58 * scale;
  const height = fighter.characterType === 'tank' ? 150 * scale : 118 * scale;
  const bodyColor = fighter.characterType === 'switcher' ? fighter.getSwitcherModeColor() : fighter.color;

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(x + width * 0.16, y + height * 0.1, width * 0.2, height * 0.78);

  if (fighter.characterType === 'fireMaster') {
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(x + width * 0.25, y - height * 0.16, width * 0.5, height * 0.16);
    ctx.fillStyle = '#d84315';
    ctx.fillRect(x + width * 0.36, y - height * 0.09, width * 0.28, height * 0.09);
  } else if (fighter.characterType === 'tank') {
    ctx.fillStyle = '#2f3526';
    ctx.fillRect(x + width * 0.08, y + height * 0.12, width * 0.84, height * 0.2);
    ctx.fillStyle = '#c9b458';
    ctx.fillRect(x + width * 0.7, y + height * 0.18, width * 0.52, height * 0.08);
    ctx.fillStyle = '#222';
    ctx.fillRect(x + width * 0.08, y + height * 0.82, width * 0.84, height * 0.12);
  } else if (fighter.characterType === 'cowboy') {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x - width * 0.12, y - height * 0.08, width * 1.24, height * 0.09);
    ctx.fillRect(x + width * 0.2, y - height * 0.2, width * 0.6, height * 0.13);
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(x + width, y + height * 0.36, width * 0.4, height * 0.08);
  } else if (fighter.characterType === 'reflecter') {
    ctx.strokeStyle = 'rgba(144, 202, 249, 0.82)';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(x - width * 0.18, y + height * 0.12, width * 1.36, height * 0.68);
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(x + width * 0.36, y + height * 0.34, width * 0.28, height * 0.18);
  } else if (fighter.characterType === 'switcher') {
    ctx.fillStyle = fighter.getSwitcherModeColor();
    ctx.fillRect(x - width * 0.1, y + height * 0.22, width * 1.2, height * 0.12);
    ctx.fillStyle = '#111';
    ctx.fillRect(x + width * 0.18, y + height * 0.12, width * 0.64, height * 0.08);
  } else if (fighter.characterType === 'sorcerer') {
    ctx.fillStyle = '#6a1b9a';
    ctx.fillRect(x - width * 0.12, y - height * 0.08, width * 1.24, height * 0.08);
    ctx.fillRect(x + width * 0.2, y - height * 0.24, width * 0.6, height * 0.18);
    ctx.fillStyle = '#ce93d8';
    ctx.beginPath();
    ctx.arc(x + width * 1.16, y + height * 0.34, width * 0.16, 0, Math.PI * 2);
    ctx.fill();
  } else if (fighter.characterType === 'gambler') {
    ctx.fillStyle = '#111';
    ctx.fillRect(x - width * 0.14, y - height * 0.08, width * 1.28, height * 0.08);
    ctx.fillRect(x + width * 0.2, y - height * 0.22, width * 0.6, height * 0.16);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(x + width * 0.22, y - height * 0.13, width * 0.56, height * 0.04);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - width * 0.1, y + height * 0.36, width * 0.34, height * 0.22);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(x - width * 0.04, y + height * 0.42, width * 0.2, height * 0.08);
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(x + width * 0.84, y + height * 0.34, width * 0.24, height * 0.16);
  }

  ctx.fillStyle = '#111';
  ctx.fillRect(x + width * 0.2, y + height * 0.18, width * 0.16, height * 0.06);
  ctx.fillRect(x + width * 0.64, y + height * 0.18, width * 0.16, height * 0.06);
}

function drawVictoryTaunt(winner, loser) {
  const phrase = getVictoryPhrase(winner, loser);
  const characterX = 90;
  const characterY = ground - 168;
  const bubbleX = 190;
  const bubbleY = 88;
  const bubbleWidth = 430;
  const bubbleHeight = 100;

  drawVictoryCharacter(winner, characterX, characterY, 1.25);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 4;
  ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
  ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);

  ctx.beginPath();
  ctx.moveTo(bubbleX + 38, bubbleY + bubbleHeight);
  ctx.lineTo(characterX + 70, characterY + 34);
  ctx.lineTo(bubbleX + 96, bubbleY + bubbleHeight);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#111';
  ctx.font = '900 22px Arial';
  ctx.textAlign = 'left';
  drawWrappedText(phrase, bubbleX + 22, bubbleY + 40, bubbleWidth - 44, 26);
}

function drawStage() {
  if (selectedMap === 'alpha') {
    drawAlphaStage();
    return;
  }

  if (selectedMap === 'desert') {
    drawDesertStage();
    return;
  }

  if (selectedMap === 'neon') {
    drawNeonStage();
    return;
  }

  if (selectedMap === 'casino') {
    drawCasinoStage();
    return;
  }

  if (selectedMap === 'military') {
    drawMilitaryStage();
    return;
  }

  if (selectedMap === 'darkRoom') {
    drawDarkRoomStage();
    return;
  }

  drawFoundryStage();
}

function drawAlphaStage() {
  ctx.fillStyle = '#1f1f1f';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#555';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
}

function drawRivets(y, color, spacing = 44) {
  ctx.fillStyle = color;
  for (let x = 18; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDarkRoomStage() {
  ctx.fillStyle = '#020202';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#070707';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let x = 0; x < canvas.width; x += 96) {
    ctx.fillRect(x, 0, 3, ground);
  }
}

function pushRectLight(lights, rectangle, radius, color) {
  pushLight(lights, {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2,
    radius,
    color,
  });
}

function pushFighterLight(lights, fighter, radius, color) {
  lights.push({
    x: fighter.position.x + fighter.width / 2,
    y: fighter.position.y + fighter.height / 2,
    radius,
    color,
  });
}

function pushNearbyFighterLights(lights, light) {
  [player1, player2].forEach((fighter) => {
    const fighterCenterX = fighter.position.x + fighter.width / 2;
    const fighterCenterY = fighter.position.y + fighter.height / 2;
    const distance = Math.hypot(light.x - fighterCenterX, light.y - fighterCenterY);
    if (distance <= light.radius + Math.max(fighter.width, fighter.height) * 0.45) {
      pushFighterLight(lights, fighter, Math.max(76, fighter.height * 0.72), light.color);
    }
  });
}

function pushLight(lights, light) {
  lights.push(light);
  pushNearbyFighterLights(lights, light);
}

function getDarkRoomLightSources() {
  const lights = [];

  [player1, player2].forEach((fighter) => {
    if (fighter.isAttacking) {
      pushRectLight(lights, fighter.attackArea, fighter.currentAttackDamage >= heavyAttackDamage ? 92 : 62, fighter.attackColor);
    }

    if (fighter.copycatShieldTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: fighter.height,
        color: hexToRgba(fighter.baseColor, 0.86),
      });
    }

    if (fighter.switcherArmorTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 110,
        color: 'rgba(253, 216, 53, 0.9)',
      });
    }

    if (fighter.switcherRedStrikeTimer > 0 && fighter.switcherRedStrikeArea) {
      pushRectLight(lights, fighter.switcherRedStrikeArea, 120, 'rgba(239, 83, 80, 0.9)');
    }

    if (fighter.gamblerRollTimer > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y - 24,
        radius: 94,
        color: 'rgba(253, 216, 53, 0.95)',
      });
    }

    if (fighter.gamblerLuckWaveTimer > 0) {
      const progress = getGamblerLuckWaveProgress(fighter.gamblerLuckWaveTimer, fighter);
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 92 + progress * 98,
        color: `rgba(102, 255, 128, ${0.9 * (1 - progress)})`,
      });
    }

    if (fighter.gamblerInvincibleTimer > 0) {
      const auraColors = getJackpotAuraColors(fighter);
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 190,
        color: auraColors.primary,
      });
    } else if (fighter.gamblerLuckBonus > 0) {
      pushLight(lights, {
        x: fighter.position.x + fighter.width / 2,
        y: fighter.position.y + fighter.height / 2,
        radius: 72 + fighter.gamblerLuckBonus * 58,
        color: 'rgba(102, 187, 106, 0.62)',
      });
    }
  });

  fireballs.forEach((fireball) => pushRectLight(lights, fireball, 82, 'rgba(255, 179, 0, 0.95)'));
  fireBeams.forEach((fireBeam) => pushRectLight(lights, fireBeam, 150, 'rgba(255, 109, 0, 0.95)'));
  tankShells.forEach((tankShell) =>
    pushRectLight(lights, tankShell, tankShell.empowered ? 115 : 72, tankShell.empowered ? 'rgba(255, 235, 59, 0.95)' : 'rgba(201, 180, 88, 0.9)')
  );
  cowboyBullets.forEach((cowboyBullet) => pushRectLight(lights, cowboyBullet, cowboyBullet.fixedDamage ? 92 : 58, 'rgba(253, 216, 53, 0.92)'));
  sorcererOrbs.forEach((orb) => pushRectLight(lights, orb, 96, 'rgba(255, 23, 68, 0.95)'));
  sorcererGravityOrbs.forEach((orb) =>
    pushLight(lights, { x: orb.centerX, y: orb.centerY, radius: orb.width / 2 + 70, color: 'rgba(33, 150, 243, 0.88)' })
  );
  sorcererSecretOrbs.forEach((orb) =>
    pushLight(lights, { x: orb.centerX, y: orb.centerY, radius: orb.size / 2 + 95, color: 'rgba(186, 104, 200, 0.95)' })
  );

  return lights;
}

function drawRadialLight(light, alphaMultiplier = 1) {
  const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
  gradient.addColorStop(0, light.color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalAlpha = alphaMultiplier;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawDarkRoomLightingOverlay() {
  if (selectedMap !== 'darkRoom') return;

  const lights = getDarkRoomLightSources();
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-out';
  lights.forEach((light) => drawRadialLight({ ...light, color: 'rgba(255, 255, 255, 0.96)' }));
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  lights.forEach((light) => drawRadialLight(light, 0.44));
  ctx.restore();
}

function drawFoundryStage() {
  const meltdownVisual = isManaMeltdownMatch() && (manaMeltdown.activeFrames > 0 || manaMeltdown.alertFrames > 0);
  const glow = ctx.createLinearGradient(0, 0, 0, ground);
  if (meltdownVisual) {
    glow.addColorStop(0, '#2b1234');
    glow.addColorStop(0.5, '#5b1d1b');
    glow.addColorStop(1, '#ff6d00');
  } else {
    glow.addColorStop(0, '#1b1c23');
    glow.addColorStop(0.55, '#30211f');
    glow.addColorStop(1, '#5b2417');
  }
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(255, 111, 0, 0.18)';
  ctx.fillRect(0, ground - 128, canvas.width, 128);

  ctx.fillStyle = '#151515';
  ctx.fillRect(108, 86, 54, ground - 98);
  ctx.fillRect(806, 62, 64, ground - 74);
  ctx.fillStyle = '#2b2b2b';
  ctx.fillRect(94, 76, 82, 14);
  ctx.fillRect(790, 52, 96, 14);

  ctx.strokeStyle = '#3d3d3d';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(150, 128);
  ctx.lineTo(426, 250);
  ctx.lineTo(760, 148);
  ctx.stroke();

  ctx.fillStyle = '#ff8f00';
  ctx.fillRect(206, 238, 76, 18);
  ctx.fillRect(642, 214, 92, 16);
  ctx.fillStyle = 'rgba(255, 183, 77, 0.5)';
  ctx.fillRect(0, ground - 58, canvas.width, 26);

  if (meltdownVisual) {
    ctx.fillStyle = 'rgba(186, 104, 200, 0.2)';
    ctx.fillRect(0, 0, canvas.width, ground);
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.72)';
    ctx.lineWidth = 4;
    for (let x = 70; x < canvas.width; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, 90);
      ctx.lineTo(x + 46, 190);
      ctx.lineTo(x - 14, 286);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#2a1712';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#5f4b43';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#ff6d00';
  ctx.fillRect(72, ground + 24, 224, 9);
  ctx.fillRect(678, ground + 32, 258, 8);
  ctx.fillStyle = '#1b100d';
  ctx.fillRect(0, ground + 42, canvas.width, 34);
  drawRivets(ground - 6, '#1d1d1d');
}

function drawDesertStage() {
  const sunsetDuel = isDesertCowboyDuelVisualActive();
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (sunsetDuel) {
    sky.addColorStop(0, '#3b1d4f');
    sky.addColorStop(0.48, '#c75b39');
    sky.addColorStop(1, '#f0a64a');
  } else {
    sky.addColorStop(0, '#78b9df');
    sky.addColorStop(0.62, '#f0c76d');
    sky.addColorStop(1, '#d79545');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = sunsetDuel ? '#ff8a3d' : '#fdd835';
  ctx.beginPath();
  ctx.arc(sunsetDuel ? 812 : 846, sunsetDuel ? 172 : 86, sunsetDuel ? 58 : 50, 0, Math.PI * 2);
  ctx.fill();

  if (sunsetDuel) {
    ctx.fillStyle = 'rgba(255, 214, 128, 0.22)';
    ctx.fillRect(0, ground - 170, canvas.width, 170);
  }

  ctx.fillStyle = '#b8873f';
  ctx.beginPath();
  ctx.moveTo(0, ground - 12);
  ctx.lineTo(246, ground - 92);
  ctx.lineTo(512, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c99a43';
  ctx.beginPath();
  ctx.moveTo(410, ground - 12);
  ctx.lineTo(736, ground - 126);
  ctx.lineTo(canvas.width, ground - 12);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(96, 62, 31, 0.24)';
  ctx.lineWidth = 4;
  for (let y = ground - 92; y < ground - 14; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(240, y - 20, 520, y + 28, canvas.width, y - 8);
    ctx.stroke();
  }

  ctx.fillStyle = '#456145';
  ctx.fillRect(126, ground - 82, 12, 70);
  ctx.fillRect(116, ground - 56, 34, 10);
  ctx.fillRect(874, ground - 98, 14, 86);
  ctx.fillRect(852, ground - 66, 50, 10);

  ctx.fillStyle = '#72533c';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#e2b45a';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(255, 243, 176, 0.42)';
  ctx.fillRect(0, ground - 30, 250, 18);
  ctx.fillRect(760, ground - 30, canvas.width - 760, 18);
  ctx.strokeStyle = 'rgba(96, 62, 31, 0.35)';
  ctx.lineWidth = 3;
  [70, 150, 830, 920].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x - 46, ground - 21);
    ctx.bezierCurveTo(x - 18, ground - 34, x + 18, ground - 34, x + 46, ground - 21);
    ctx.stroke();
  });
  drawRivets(ground - 6, 'rgba(99, 65, 30, 0.55)', 58);
}

function drawNeonStage() {
  const arcaneVisual = isArcaneRiftMatch() && (arcaneRift.activeFrames > 0 || arcaneRift.alertFrames > 0);
  const prismCharge = Math.min(prismOverdrive.player1Uses, prismOverdrive.player2Uses);
  const prismVisual = isPrismOverdriveMatch() && (prismCharge > 0 || prismOverdrive.activeFrames > 0 || prismOverdrive.alertFrames > 0);
  const night = ctx.createLinearGradient(0, 0, 0, ground);
  if (prismVisual) {
    night.addColorStop(0, '#061521');
    night.addColorStop(0.48, '#10224a');
    night.addColorStop(1, '#07111f');
  } else if (arcaneVisual) {
    night.addColorStop(0, '#16051f');
    night.addColorStop(0.5, '#35124f');
    night.addColorStop(1, '#07111f');
  } else {
    night.addColorStop(0, '#080c17');
    night.addColorStop(0.5, '#111827');
    night.addColorStop(1, '#07111f');
  }
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, canvas.width, ground);

  const towers = [
    [42, 150, 88, 360],
    [174, 86, 74, 424],
    [318, 132, 108, 378],
    [568, 108, 96, 402],
    [732, 76, 88, 434],
    [872, 142, 112, 368],
  ];

  towers.forEach(([x, y, width, height], index) => {
    ctx.fillStyle = index % 2 === 0 ? '#101827' : '#141f31';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(34, 211, 238, 0.68)' : 'rgba(236, 72, 153, 0.62)';
    for (let wy = y + 22; wy < y + height - 20; wy += 34) {
      ctx.fillRect(x + 14, wy, width - 28, 5);
    }
  });

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(0, ground - 20, canvas.width, 5);
  ctx.fillStyle = 'rgba(34, 211, 238, 0.36)';
  ctx.fillRect(364, ground - 30, 296, 10);
  if (prismVisual) {
    ctx.fillStyle = 'rgba(253, 216, 53, 0.72)';
    const chargeWidth = Math.min(1, prismCharge / prismOverdriveRequiredUses) * 296;
    ctx.fillRect(364, ground - 40, chargeWidth, 6);
  }
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
  ctx.lineWidth = 2;
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 12);
    ctx.lineTo(canvas.width / 2, 176);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
  for (let y = ground - 22; y > 176; y -= 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  if (arcaneVisual) {
    ctx.strokeStyle = 'rgba(206, 147, 216, 0.62)';
    ctx.lineWidth = 4;
    for (let x = 84; x < canvas.width; x += 170) {
      ctx.beginPath();
      ctx.arc(x, 150 + (x % 3) * 22, 42, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawCasinoStage() {
  const royaleVisual = isCasinoRoyaleMatch() && (casinoRoyale.activeFrames > 0 || casinoRoyale.alertFrames > 0);
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (royaleVisual) {
    sky.addColorStop(0, '#071f10');
    sky.addColorStop(0.5, '#18351d');
    sky.addColorStop(1, '#061a12');
  } else {
    sky.addColorStop(0, '#120914');
    sky.addColorStop(0.5, '#2a1023');
    sky.addColorStop(1, '#061a12');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = '#240d18';
  ctx.fillRect(70, 96, 154, ground - 108);
  ctx.fillRect(800, 86, 154, ground - 98);
  ctx.fillStyle = '#3a1427';
  ctx.fillRect(92, 126, 110, 22);
  ctx.fillRect(822, 116, 110, 22);

  ctx.save();
  ctx.fillStyle = 'rgba(17, 17, 17, 0.84)';
  ctx.fillRect(336, 82, 352, 112);
  ctx.strokeStyle = royaleVisual ? '#66ff80' : '#fdd835';
  ctx.lineWidth = 6;
  ctx.strokeRect(336, 82, 352, 112);
  ctx.fillStyle = royaleVisual ? '#66ff80' : '#fdd835';
  ctx.font = '900 42px Courier New, monospace';
  ctx.textAlign = 'center';
  ['7', 'BAR', '7'].forEach((symbol, index) => {
    ctx.fillText(symbol, 410 + index * 102, 148);
  });
  ctx.restore();

  ctx.fillStyle = '#111';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#fdd835';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = '#39ff88';
  ctx.fillRect(0, ground - 22, canvas.width, 5);

  const tileWidth = canvas.width / 5;
  for (let index = 0; index < 5; index += 1) {
    const x = index * tileWidth;
    ctx.fillStyle = index % 2 === 0 ? '#4a0d1a' : '#101010';
    ctx.fillRect(x, ground, tileWidth, canvas.height - ground);
    ctx.strokeStyle = 'rgba(253, 216, 53, 0.42)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, ground, tileWidth, canvas.height - ground);
  }

  const luckyX = casinoLuckyTileIndex * tileWidth;
  ctx.fillStyle = royaleVisual ? 'rgba(102, 255, 128, 0.52)' : 'rgba(253, 216, 53, 0.5)';
  ctx.fillRect(luckyX, ground - 34, tileWidth, 34);
  ctx.fillStyle = '#fff';
  ctx.font = '900 28px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('777', luckyX + tileWidth / 2, ground - 10);

  ctx.fillStyle = 'rgba(239, 83, 80, 0.18)';
  for (let x = 28; x < canvas.width; x += 76) {
    ctx.beginPath();
    ctx.arc(x, ground + 42, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMilitaryStage() {
  const clashVisual = isTankClashMatch() && (tankClash.closeFrames > 0 || tankClash.active || tankClash.alertFrames > 0);
  const sky = ctx.createLinearGradient(0, 0, 0, ground);
  if (clashVisual) {
    sky.addColorStop(0, '#4d2e2e');
    sky.addColorStop(0.55, '#4a3f2d');
    sky.addColorStop(1, '#252f21');
  } else {
    sky.addColorStop(0, '#5d6b58');
    sky.addColorStop(0.55, '#3e4b36');
    sky.addColorStop(1, '#252f21');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, ground);

  ctx.fillStyle = 'rgba(26, 34, 22, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, ground - 12);
  ctx.lineTo(120, ground - 102);
  ctx.lineTo(248, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(238, ground - 12);
  ctx.lineTo(472, ground - 152);
  ctx.lineTo(724, ground - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(690, ground - 12);
  ctx.lineTo(898, ground - 118);
  ctx.lineTo(canvas.width, ground - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#273322';
  ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
  ctx.fillStyle = '#6f7652';
  ctx.fillRect(0, ground - 12, canvas.width, 12);
  ctx.fillStyle = 'rgba(73, 54, 28, 0.58)';
  ctx.fillRect(64, ground - 34, 218, 22);
  ctx.fillRect(714, ground - 34, 238, 22);
  if (clashVisual) {
    ctx.fillStyle = 'rgba(255, 23, 68, 0.18)';
    ctx.fillRect(0, 0, canvas.width, ground);
    ctx.fillStyle = '#ffeb3b';
    for (let x = 24; x < canvas.width; x += 92) {
      ctx.fillRect(x, ground - 26, 44, 8);
    }
  }

  ctx.fillStyle = '#26321f';
  ctx.fillRect(64, 272, 218, ground - 284);
  ctx.fillRect(714, 238, 238, ground - 250);
  ctx.fillStyle = '#1b2418';
  ctx.fillRect(86, 248, 174, 28);
  ctx.fillRect(736, 212, 194, 30);

  ctx.fillStyle = '#1d2419';
  ctx.fillRect(112, 318, 44, 56);
  ctx.fillRect(190, 318, 44, 56);
  ctx.fillRect(770, 292, 48, 60);
  ctx.fillRect(856, 292, 48, 60);

  ctx.fillStyle = '#7e865f';
  ctx.fillRect(350, ground - 92, 140, 80);
  ctx.fillStyle = '#111';
  ctx.fillRect(364, ground - 60, 112, 18);
  ctx.fillStyle = '#8f966c';
  ctx.fillRect(386, ground - 116, 66, 24);
  ctx.fillStyle = '#1b2418';
  ctx.fillRect(410, ground - 148, 16, 32);

  ctx.strokeStyle = 'rgba(17, 17, 17, 0.36)';
  ctx.lineWidth = 5;
  for (let x = -40; x < canvas.width; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, ground - 12);
    ctx.lineTo(x + 150, ground - 94);
    ctx.stroke();
  }
  drawRivets(ground - 6, '#20251b', 52);
}

function displayWinner(text, winner, loser) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (winner && loser) {
    drawVictoryTaunt(winner, loser);
  }
  victoryTitle.innerText = text;
}

function updateVictoryStats() {
  document.getElementById('p1DamageDealt').innerText = Math.round(fightStats.player1.damageDealt);
  document.getElementById('p2DamageDealt').innerText = Math.round(fightStats.player2.damageDealt);
  document.getElementById('p1HitsLanded').innerText = fightStats.player1.hitsLanded;
  document.getElementById('p2HitsLanded').innerText = fightStats.player2.hitsLanded;
  document.getElementById('p1SpecialsUsed').innerText = fightStats.player1.specialsUsed;
  document.getElementById('p2SpecialsUsed').innerText = fightStats.player2.specialsUsed;
  document.getElementById('p1SpecialsLanded').innerText = fightStats.player1.specialsLanded;
  document.getElementById('p2SpecialsLanded').innerText = fightStats.player2.specialsLanded;
  document.getElementById('p1HealthLeft').innerText = Math.ceil(Math.max(0, player1.health));
  document.getElementById('p2HealthLeft').innerText = Math.ceil(Math.max(0, player2.health));
  fightDuration.innerText = formatFightDuration(performance.now() - fightStartedAt);
}

function updateFightAchievements(winnerPlayer, fightTime) {
  if (!winnerPlayer) return;

  unlockAchievement('firstWin');

  if (fightTime <= 30000) {
    unlockAchievement('fastWin');
  }

  if (winnerPlayer.health > 0 && winnerPlayer.health <= 10) {
    unlockAchievement('clutchWin');
  }

  if (winnerPlayer.health >= winnerPlayer.maxHealth) {
    unlockAchievement('flawlessWin');
  }

  if (getPlayerStats(winnerPlayer).specialsUsed >= 10) {
    unlockAchievement('specialist');
  }

  if (
    winnerPlayer.characterType === 'cowboy' &&
    selectedMap === 'desert' &&
    fightAchievementFlags.duelShotHitBy === winnerPlayer
  ) {
    unlockAchievement('perfectDuel');
  }

  if (
    winnerPlayer.characterType === 'reflecter' &&
    fightAchievementFlags.copiedAbilityUsedBy === winnerPlayer
  ) {
    unlockAchievement('reflectedWin');
  }

  if (fightAchievementFlags.casinoRoyaleActive && winnerPlayer.characterType === 'gambler') {
    unlockAchievement('casinoRoyalty');
  }

  if (
    fightAchievementFlags.manaMeltdownActive &&
    (winnerPlayer.characterType === 'fireMaster' || winnerPlayer.characterType === 'sorcerer')
  ) {
    unlockAchievement('meltdownMaster');
  }

  if (fightAchievementFlags.tankClashActive && winnerPlayer.characterType === 'tank') {
    unlockAchievement('tankCommander');
  }

  if (
    winnerPlayer.characterType === 'chrono' &&
    fightAchievementFlags.timeStopDamageBy === winnerPlayer
  ) {
    unlockAchievement('timeExecutioner');
  }

  if (
    winnerPlayer === player1 &&
    botEnabled &&
    botDifficulty === 'hard' &&
    fightTime <= 25000 &&
    fightStats.player1.damageTaken <= 0
  ) {
    unlockAchievement('absoluteDominance');
  }
}

function finishFight() {
  const fightTime = performance.now() - fightStartedAt;
  if (selectedMap === 'darkRoom') {
    lockDarkRoomMap();
  }
  gameOver = true;
  restartPanel.classList.remove('hidden');
  const winnerPlayer =
    player1.health <= 0 && player2.health <= 0 ? null : player1.health > player2.health ? player1 : player2;
  const loserPlayer = winnerPlayer === player1 ? player2 : winnerPlayer === player2 ? player1 : null;
  const winner =
    player1.health <= 0 && player2.health <= 0
      ? 'Empate'
      : player1.health > player2.health
        ? 'Jugador 1 gana'
        : 'Jugador 2 gana';
  displayWinner(winner, winnerPlayer, loserPlayer);
  updateVictoryStats();
  recordPersistentFightStatistics(winnerPlayer, fightTime);
  updateFightAchievements(winnerPlayer, fightTime);
}

function resetKeys() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });
}

function resetFight() {
  stopJackpotTrack();
  gameOver = false;
  gameStarted = true;
  resetFightStats();
  botAttackCooldown = 0;
  fireballs = [];
  fireBeams = [];
  tankShells = [];
  cowboyBullets = [];
  sorcererOrbs = [];
  sorcererGravityOrbs = [];
  sorcererSecretOrbs = [];
  chronoBlades = [];
  chronoZones = [];
  clearQfPendingSpecial(1);
  clearQfPendingSpecial(2);
  clearSorcererPendingSpecial(1);
  clearSorcererPendingSpecial(2);
  resetFightEvents();
  resetKeys();
  restartPanel.classList.add('hidden');
  applyBotDifficulty();
  player1.reset({ x: 120, y: 0 });
  player2.reset({ x: 820, y: 0 });
  updateHealthBars();
  if (!animationId) {
    animate();
  }
}

function returnToMenu() {
  const shouldConsumeDarkRoom = selectedMap === 'darkRoom';
  if (gameStarted && !gameOver) {
    recordPersistentPlayTimeOnly(performance.now() - fightStartedAt);
  }
  deactivateBlindMode();
  gameOver = false;
  gameStarted = false;
  resetFightStats();
  botAttackCooldown = 0;
  fireballs = [];
  fireBeams = [];
  tankShells = [];
  cowboyBullets = [];
  sorcererOrbs = [];
  sorcererGravityOrbs = [];
  sorcererSecretOrbs = [];
  chronoBlades = [];
  chronoZones = [];
  clearQfPendingSpecial(1);
  clearQfPendingSpecial(2);
  clearSorcererPendingSpecial(1);
  clearSorcererPendingSpecial(2);
  resetFightEvents();
  resetKeys();
  restartPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  document.body.classList.add('menu-open');
  stopJackpotTrack();
  startMenuMusic();
  titleScreen.classList.remove('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  characterSelectionPlayer = 1;
  characterSelectTitle.innerText = 'Personaje Jugador 1';
  characterScreen.classList.remove('selecting-player2');
  oldDaysScreen.classList.add('hidden');
  if (shouldConsumeDarkRoom) {
    lockDarkRoomMap();
  }
  player1.reset({ x: 120, y: 0 });
  player2.reset({ x: 820, y: 0 });
  updateHealthBars();
  if (!animationId) {
    animate();
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStage();

  if (!gameStarted) {
    player1.draw();
    player2.draw();
    return;
  }

  updateMovements();
  updateBot();
  applyTerrainMoveModifiers();
  player1.update();
  player2.update();
  updateTerrainInteractions();
  updateDesertCowboyDuel();
  updateTankClash();
  updateArcaneRift();
  updateMirrorCollapse();
  updateCasinoRoyale();
  updateManaMeltdown();
  updatePrismOverdrive();
  updateAbsoluteAdaptation();
  updateFireballs();
  updateFireBeams();
  updateTankShells();
  updateCowboyBullets();
  updateSorcererOrbs();
  updateSorcererGravityOrbs();
  updateSorcererSecretOrbs();
  updateChronoBlades();
  updateChronoZones();

  if (
    player1.isAttacking &&
    player1.kaiokenComboVisualTimer <= 0 &&
    rectangularCopycatShieldCollision(player2, player1.attackArea)
  ) {
    if (handleCopycatShieldHit(player2, player1)) {
      player1.isAttacking = false;
      return;
    }
  }

  if (
    player1.isAttacking &&
    player1.kaiokenComboVisualTimer <= 0 &&
    rectangularCollision({ rectangle1: player1.attackArea, rectangle2: player2 })
  ) {
    if (handleCopycatShieldHit(player2, player1)) {
      player1.isAttacking = false;
      return;
    }

    applyDamage(player1, player2, player1.currentAttackDamage, { damageType: 'melee' });
    player2.velocity.x = getDebugKnockback(8, player2);
    player2.velocity.y = getDebugKnockback(-8, player2);
    player1.isAttacking = false;
  }

  if (
    player2.isAttacking &&
    player2.kaiokenComboVisualTimer <= 0 &&
    rectangularCopycatShieldCollision(player1, player2.attackArea)
  ) {
    if (handleCopycatShieldHit(player1, player2)) {
      player2.isAttacking = false;
      return;
    }
  }

  if (
    player2.isAttacking &&
    player2.kaiokenComboVisualTimer <= 0 &&
    rectangularCollision({ rectangle1: player2.attackArea, rectangle2: player1 })
  ) {
    if (handleCopycatShieldHit(player1, player2)) {
      player2.isAttacking = false;
      return;
    }

    applyDamage(player2, player1, player2.currentAttackDamage, { damageType: 'melee' });
    player1.velocity.x = getDebugKnockback(-8, player1);
    player1.velocity.y = getDebugKnockback(-8, player1);
    player2.isAttacking = false;
  }

  drawDarkRoomLightingOverlay();
  drawChronoTimeStopEffect();
  updateHealthBars();
  drawDesertCowboyDuelAlert();
  drawTankClashAlert();
  drawArcaneRiftAlert();
  drawMirrorCollapseAlert();
  drawCasinoRoyaleAlert();
  drawManaMeltdownAlert();
  drawPrismOverdriveAlert();
  drawAbsoluteAdaptationAlert();

  if (player1.health <= 0 || player2.health <= 0) {
    cancelAnimationFrame(animationId);
    animationId = null;
    finishFight();
    return;
  }
}

function updateHealthBars() {
  const health1Value = Math.ceil(Math.max(0, player1.health));
  const health2Value = Math.ceil(Math.max(0, player2.health));
  const health1Progress = Math.min(100, (health1Value / player1.maxHealth) * 100);
  const health2Progress = Math.min(100, (health2Value / player2.maxHealth) * 100);
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');

  bar1.style.setProperty('--progress', `${health1Progress}%`);
  bar2.style.setProperty('--progress', `${health2Progress}%`);
  document.getElementById('health1').innerText = health1Value;
  document.getElementById('health2').innerText = health2Value;
  updateCombatHudIdentity();
  updateCooldownIndicators();
}

function getCharacterDisplayName(fighter) {
  const baseName = characterDisplayNames[fighter.characterType] || 'Normal';
  if (fighter.characterType === 'normal' && isNormalKaioken(fighter) && fighter.kaiokenTimer > 0) return 'Kaioken';
  if (fighter.characterType === 'fireMaster' && isFireMasterOverheat(fighter)) return 'Fire Master+';
  if (fighter.characterType === 'tank' && isTankIronWall(fighter)) return 'Iron Tank';
  if (fighter.characterType === 'reflecter' && isReflecterUpgrade(fighter)) return 'Reflecter EX';
  if (fighter.characterType === 'reflecter' && isReflecterMirrorLuck(fighter)) return 'Mirror Luck';
  if (fighter.characterType === 'switcher' && isSwitcherPrism(fighter)) return 'Prism Switcher';
  if (fighter.characterType === 'cowboy' && isCowboyDeadeye(fighter)) return 'Deadeye Cowboy';
  if (fighter.characterType === 'divineGeneral' && isDivineFullAdapt(fighter)) return 'Full Adapt';
  return baseName;
}

function updateCombatHudIdentity() {
  p1Portrait.dataset.character = player1.characterType;
  p2Portrait.dataset.character = player2.characterType;
  p1CharacterName.innerText = getCharacterDisplayName(player1);
  p2CharacterName.innerText = getCharacterDisplayName(player2);
  p1HudTag.innerText = 'P1';
  p2HudTag.innerText = botEnabled ? `Bot ${botDifficultyDisplayNames[botDifficulty] || 'media'}` : 'P2';
}

function updateCooldownIndicators() {
  updatePlayerCooldownIndicators(player1, {
    q: document.getElementById('p1CooldownQ'),
    f: document.getElementById('p1CooldownF'),
  });
  updatePlayerCooldownIndicators(player2, {
    q: document.getElementById('p2CooldownQ'),
    f: document.getElementById('p2CooldownF'),
  });
}

function updatePlayerCooldownIndicators(player, elements) {
  const cooldowns = getPlayerAbilityCooldowns(player);
  updateCooldownChip(elements.q, cooldowns.q);
  updateCooldownChip(elements.f, cooldowns.f);
}

function updateCooldownChip(element, cooldown) {
  if (!element) return;

  element.classList.toggle('disabled', !cooldown.active);
  if (!cooldown.active) {
    element.style.setProperty('--ready', '0%');
    element.title = 'Sin habilidad';
    return;
  }

  const readyPercent =
    cooldown.max <= 0 ? 100 : Math.max(0, Math.min(100, ((cooldown.max - cooldown.remaining) / cooldown.max) * 100));
  const isCooling = cooldown.remaining > 0;

  element.classList.toggle('cooling', isCooling);
  element.style.setProperty('--ready', `${readyPercent}%`);
  element.title = isCooling ? `${cooldown.name}: recargando` : `${cooldown.name}: listo`;
}

function getPlayerAbilityCooldowns(player) {
  switch (player.characterType) {
    case 'normal':
      return {
        q:
          isNormalKaioken(player) && player.kaiokenTimer > 0
            ? { active: true, name: 'Combo Kaioken', remaining: player.kaiokenComboCooldown, max: getDebugCooldown(kaiokenComboCooldown, player) }
            : { active: false },
        f: isNormalKaioken(player)
          ? { active: true, name: 'Kaioken', remaining: player.kaiokenCooldown, max: getDebugCooldown(kaiokenCooldown, player) }
          : { active: false },
      };
    case 'fireMaster':
      return {
        q: {
          active: true,
          name: 'Bola de fuego',
          remaining: player.specialCooldown,
          max: getDebugCooldown(getFireMasterSecretCooldown(player, fireballCooldown), player),
        },
        f: {
          active: true,
          name: 'Fire beam',
          remaining: player.fireBeamCooldown,
          max: getDebugCooldown(getFireMasterSecretCooldown(player, fireBeamCooldown), player),
        },
      };
    case 'tank':
      return {
        q: { active: true, name: 'Canon', remaining: player.tankShellCooldown, max: getDebugCooldown(tankShellCooldown, player) },
        f: { active: false },
      };
    case 'cowboy':
      return {
        q: {
          active: true,
          name: 'Rafaga',
          remaining: Math.max(player.cowboyBurstCooldown, player.cowboyBurstShotsRemaining > 0 ? getDebugCooldown(cowboyBurstCooldown, player) : 0),
          max: getDebugCooldown(cowboyBurstCooldown, player),
        },
        f: { active: false },
      };
    case 'reflecter':
      return {
        q: {
          active: true,
          name: isReflecterUpgrade(player) ? 'Escudo avanzado' : 'Escudo reflector',
          remaining: player.copycatShieldCooldown,
          max: getDebugCooldown(getReflecterShieldCooldown(player), player),
        },
        f: { active: false },
      };
    case 'switcher':
      return {
        q: { active: true, name: 'Cambiar modo', remaining: 0, max: 0 },
        f: { active: true, name: 'Habilidad de modo', remaining: player.switcherAbilityCooldown, max: getSwitcherAbilityCooldownMax(player) },
      };
    case 'sorcerer':
      return {
        q: {
          active: true,
          name: 'Esfera roja',
          remaining: Math.max(player.sorcererOrbCooldown, player.sorcererSecretOrbCooldown),
          max: Math.max(getDebugCooldown(sorcererOrbCooldown, player), getDebugCooldown(sorcererSecretOrbCooldown, player)),
        },
        f: {
          active: true,
          name: 'Esfera gravitatoria',
          remaining: Math.max(player.sorcererGravityCooldown, player.sorcererSecretOrbCooldown),
          max: Math.max(getDebugCooldown(sorcererGravityCooldown, player), getDebugCooldown(sorcererSecretOrbCooldown, player)),
        },
      };
    case 'gambler':
      return {
        q: { active: true, name: 'Ruleta', remaining: player.gamblerRollCooldown, max: getDebugCooldown(gamblerRollCooldown, player) },
        f: { active: true, name: 'Luck Incrementer', remaining: player.gamblerLuckCooldown, max: getDebugCooldown(gamblerLuckCooldown, player) },
      };
    case 'chrono':
      return {
        q: { active: true, name: 'Cuchilla temporal', remaining: player.chronoBladeCooldown, max: getDebugCooldown(chronoBladeCooldown, player) },
        f: { active: true, name: 'Campo lento', remaining: player.chronoSlowCooldown, max: getDebugCooldown(chronoSlowCooldown, player) },
      };
    case 'ghost':
      return {
        q: {
          active: true,
          name: 'Fase',
          remaining: Math.max(player.ghostPhaseCooldown, player.ghostPhaseTimer),
          max: getDebugDuration(ghostPhaseDuration, player) + getDebugCooldown(ghostPhaseCooldown, player),
        },
        f: { active: false },
      };
    case 'divineGeneral':
      return {
        q: {
          active: true,
          name: 'Adaptacion',
          remaining: Math.max(player.divineAdaptCooldown, player.divineAdaptTimer),
          max: getDebugDuration(divineGeneralAdaptDuration, player) + getDivineAdaptCooldownMax(player),
        },
        f: {
          active: true,
          name: 'Contra adaptativa',
          remaining: player.divineCounterCooldown,
          max: getDivineCounterCooldownMax(player),
        },
      };
    default:
      return {
        q: { active: false },
        f: { active: false },
      };
  }
}

function isTimeStoppedByChrono(fighter) {
  return fighter && fighter.chronoTimeStopTimer > 0;
}

function updateProjectileIfNotTimeStopped(projectile) {
  if (isTimeStoppedByChrono(projectile.attacker)) {
    projectile.draw();
    return false;
  }

  projectile.update();
  return true;
}

function updateFireballs() {
  fireballs.forEach((fireball) => {
    if (!updateProjectileIfNotTimeStopped(fireball)) return;

    if (
      fireball.active &&
      (rectangularCopycatShieldCollision(fireball.target, fireball) ||
        rectangularCollision({ rectangle1: fireball, rectangle2: fireball.target }))
    ) {
      if (handleCopycatShieldHit(fireball.target, fireball.attacker)) {
        fireball.active = false;
        return;
      }

      applyDamage(
        fireball.attacker,
        fireball.target,
        getElementalEventDamage(fireball.attacker, getFireMasterSecretDamage(fireball.attacker, fireballDamage) * fireball.damageMultiplier),
        { isSpecial: true, damageType: 'fireProjectile' }
      );
      fireball.target.velocity.x = getDebugKnockback(fireball.velocity.x > 0 ? 10 : -10, fireball.target);
      fireball.target.velocity.y = getDebugKnockback(-7, fireball.target);
      fireball.active = false;
    }
  });

  fireballs = fireballs.filter((fireball) => fireball.active);
}

function updateFireBeams() {
  fireBeams.forEach((fireBeam) => {
    if (!updateProjectileIfNotTimeStopped(fireBeam)) return;

    if (
      fireBeam.active &&
      (rectangularCopycatShieldCollision(fireBeam.target, fireBeam) ||
        rectangularCollision({ rectangle1: fireBeam, rectangle2: fireBeam.target }))
    ) {
      if (handleCopycatShieldHit(fireBeam.target, fireBeam.attacker)) {
        fireBeam.active = false;
        return;
      }

      applyDamage(
        fireBeam.attacker,
        fireBeam.target,
        getElementalEventDamage(fireBeam.attacker, getFireMasterSecretDamage(fireBeam.attacker, fireBeamDamage) * fireBeam.damageMultiplier),
        { isSpecial: true, damageType: 'fireBeam' }
      );
      fireBeam.target.velocity.x = getDebugKnockback(fireBeam.velocity.x > 0 ? 18 : -18, fireBeam.target);
      fireBeam.target.velocity.y = getDebugKnockback(-10, fireBeam.target);
      fireBeam.active = false;
    }
  });

  fireBeams = fireBeams.filter((fireBeam) => fireBeam.active);
}

function updateTankShells() {
  tankShells.forEach((tankShell) => {
    if (!updateProjectileIfNotTimeStopped(tankShell)) return;

    if (
      tankShell.active &&
      (rectangularCopycatShieldCollision(tankShell.target, tankShell) ||
        rectangularCollision({ rectangle1: tankShell, rectangle2: tankShell.target }))
    ) {
      if (handleCopycatShieldHit(tankShell.target, tankShell.attacker)) {
        tankShell.active = false;
        return;
      }

      applyDamage(tankShell.attacker, tankShell.target, tankShell.damage, { isSpecial: true, damageType: 'tankShell' });
      tankShell.target.velocity.x = getDebugKnockback(tankShell.velocity.x > 0 ? 14 : -14, tankShell.target);
      tankShell.target.velocity.y = getDebugKnockback(-8, tankShell.target);
      tankShell.active = false;
    }
  });

  tankShells = tankShells.filter((tankShell) => tankShell.active);
}

function updateCowboyBullets() {
  cowboyBullets.forEach((cowboyBullet) => {
    if (!updateProjectileIfNotTimeStopped(cowboyBullet)) return;

    if (
      cowboyBullet.active &&
      (rectangularCopycatShieldCollision(cowboyBullet.target, cowboyBullet) ||
        rectangularCollision({ rectangle1: cowboyBullet, rectangle2: cowboyBullet.target }))
    ) {
      if (handleCopycatShieldHit(cowboyBullet.target, cowboyBullet.attacker)) {
        cowboyBullet.active = false;
        return;
      }

      const actualDamage = applyDamage(cowboyBullet.attacker, cowboyBullet.target, cowboyBullet.damage, {
        isSpecial: true,
        ignoreDebug: cowboyBullet.fixedDamage,
        damageType: 'bullet',
      });
      if (actualDamage > 0 && cowboyBullet.fixedDamage && desertCowboyDuel.active) {
        fightAchievementFlags.duelShotHitBy = cowboyBullet.attacker;
      }
      cowboyBullet.target.velocity.x = getDebugKnockback(cowboyBullet.velocity.x > 0 ? 4 : -4, cowboyBullet.target);
      cowboyBullet.active = false;
    }
  });

  cowboyBullets = cowboyBullets.filter((cowboyBullet) => cowboyBullet.active);
}

function updateSorcererOrbs() {
  sorcererOrbs.forEach((sorcererOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererOrb)) return;

    if (
      sorcererOrb.active &&
      (rectangularCopycatShieldCollision(sorcererOrb.target, sorcererOrb) ||
        rectangularCollision({ rectangle1: sorcererOrb, rectangle2: sorcererOrb.target }))
    ) {
      if (handleCopycatShieldHit(sorcererOrb.target, sorcererOrb.attacker)) {
        sorcererOrb.active = false;
        return;
      }

      applyDamage(
        sorcererOrb.attacker,
        sorcererOrb.target,
        getElementalEventDamage(sorcererOrb.attacker, getArcaneRiftOrbDamage() * sorcererOrb.damageMultiplier),
        { isSpecial: true, damageType: 'arcaneOrb' }
      );
      sorcererOrb.target.velocity.x = getDebugKnockback(sorcererOrb.velocity.x > 0 ? 16 : -16, sorcererOrb.target);
      sorcererOrb.target.velocity.y = getDebugKnockback(-8, sorcererOrb.target);
      sorcererOrb.active = false;
    }
  });

  sorcererOrbs = sorcererOrbs.filter((sorcererOrb) => sorcererOrb.active);
}

function updateSorcererGravityOrbs() {
  sorcererGravityOrbs.forEach((sorcererGravityOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererGravityOrb)) return;
  });

  sorcererGravityOrbs = sorcererGravityOrbs.filter((sorcererGravityOrb) => sorcererGravityOrb.active);
}

function updateSorcererSecretOrbs() {
  sorcererSecretOrbs.forEach((sorcererSecretOrb) => {
    if (!updateProjectileIfNotTimeStopped(sorcererSecretOrb)) return;

    if (
      sorcererSecretOrb.active &&
      sorcererSecretOrb.launched &&
      rectangularCollision({ rectangle1: sorcererSecretOrb, rectangle2: sorcererSecretOrb.target })
    ) {
      if (reflectSorcererSecretOrb(sorcererSecretOrb)) {
        sorcererSecretOrb.active = false;
        return;
      }

      applyDamage(sorcererSecretOrb.attacker, sorcererSecretOrb.target, getElementalEventDamage(sorcererSecretOrb.attacker, getSorcererSecretOrbDamage(sorcererSecretOrb)), {
        isSpecial: true,
        damageType: 'arcaneSecret',
      });
      sorcererSecretOrb.target.velocity.x = getDebugKnockback(sorcererSecretOrb.velocity.x > 0 ? 22 : -22, sorcererSecretOrb.target);
      sorcererSecretOrb.target.velocity.y = getDebugKnockback(-12, sorcererSecretOrb.target);
      sorcererSecretOrb.active = false;
    }
  });

  sorcererSecretOrbs = sorcererSecretOrbs.filter((sorcererSecretOrb) => sorcererSecretOrb.active);
}

function updateChronoBlades() {
  chronoBlades.forEach((chronoBlade) => {
    if (!updateProjectileIfNotTimeStopped(chronoBlade)) return;
    const bladeCollisionArea = getChronoBladeCollisionArea(chronoBlade);

    if (
      chronoBlade.active &&
      (rectangularCopycatShieldCollision(chronoBlade.target, bladeCollisionArea) ||
        rectangularCollision({ rectangle1: bladeCollisionArea, rectangle2: chronoBlade.target }))
    ) {
      if (handleCopycatShieldHit(chronoBlade.target, chronoBlade.attacker)) {
        chronoBlade.active = false;
        return;
      }

      const wasAlreadySlowed = chronoBlade.target.chronoSlowTimer > 0;
      applyDamage(chronoBlade.attacker, chronoBlade.target, chronoBladeDamage, { isSpecial: true, damageType: 'temporalBlade' });
      chronoBlade.target.chronoSlowTimer = Math.max(chronoBlade.target.chronoSlowTimer, getDebugDuration(chronoBladeSlowDuration, chronoBlade.target));
      if (wasAlreadySlowed) {
        chronoBlade.target.chronoMarkTimer = getDebugDuration(chronoMarkDuration, chronoBlade.target);
        chronoBlade.target.chronoMarkedBy = chronoBlade.attacker;
      }
      chronoBlade.target.velocity.x = getDebugKnockback(chronoBlade.velocity.x > 0 ? 9 : -9, chronoBlade.target);
      chronoBlade.target.velocity.y = getDebugKnockback(-5, chronoBlade.target);
      chronoBlade.active = false;
    }
  });

  chronoBlades = chronoBlades.filter((chronoBlade) => chronoBlade.active);
}

function getChronoBladeCollisionArea(chronoBlade) {
  const minX = Math.min(chronoBlade.previousPosition.x, chronoBlade.position.x);
  const minY = Math.min(chronoBlade.previousPosition.y, chronoBlade.position.y);
  const maxX = Math.max(
    chronoBlade.previousPosition.x + chronoBlade.width,
    chronoBlade.position.x + chronoBlade.width
  );
  const maxY = Math.max(
    chronoBlade.previousPosition.y + chronoBlade.height,
    chronoBlade.position.y + chronoBlade.height
  );

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function updateChronoZones() {
  chronoZones.forEach((chronoZone) => {
    if (isTimeStoppedByChrono(chronoZone.attacker)) {
      chronoZone.draw();
      return;
    }
    chronoZone.update();
  });

  chronoZones = chronoZones.filter((chronoZone) => chronoZone.active);
}

function drawChronoTimeStopEffect() {
  const stoppedFighters = [player1, player2].filter((fighter) => fighter.chronoTimeStopTimer > 0);
  if (stoppedFighters.length === 0) return;

  const pulse = (Math.sin(performance.now() * 0.012) + 1) / 2;
  ctx.save();
  ctx.fillStyle = `rgba(6, 182, 212, ${0.08 + pulse * 0.04})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(224, 247, 250, 0.16)';
  ctx.lineWidth = 1;
  for (let x = -40; x < canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 120, canvas.height);
    ctx.stroke();
  }

  stoppedFighters.forEach((fighter) => {
    const progress = fighter.chronoTimeStopTimer / chronoTimeStopDuration;
    const centerX = fighter.position.x + fighter.width / 2;
    const centerY = fighter.position.y + fighter.height / 2;
    const radius = Math.max(fighter.width, fighter.height) * (0.72 + pulse * 0.08);

    ctx.fillStyle = `rgba(224, 247, 250, ${0.1 + progress * 0.08})`;
    ctx.fillRect(fighter.position.x - 18, fighter.position.y - 18, fighter.width + 36, fighter.height + 36);

    ctx.strokeStyle = 'rgba(224, 247, 250, 0.92)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(38, 198, 218, 0.72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const inner = radius - 8;
      const outer = radius + 8;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - radius * 0.58);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * 0.44, centerY + radius * 0.25);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const offset = i * 22 - 44;
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 28, centerY + offset);
      ctx.lineTo(centerX - radius * 0.35, centerY + offset - 14);
      ctx.lineTo(centerX + radius * 0.25, centerY + offset + 8);
      ctx.lineTo(centerX + radius + 30, centerY + offset - 10);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function reflectSorcererSecretOrb(sourceOrb) {
  const defender = sourceOrb.target;
  const originalAttacker = sourceOrb.attacker;

  if (
    !defender ||
    !originalAttacker ||
    defender.characterType !== 'reflecter' ||
    defender.copycatShieldTimer <= 0
  ) {
    return false;
  }

  defender.copycatShieldTimer = 0;
  triggerArcaneRift();
  triggerMirrorCollapse(defender, originalAttacker);

  const reflectedOrb = new SorcererSecretOrb({ attacker: defender, target: originalAttacker });
  reflectedOrb.size = sourceOrb.size * 1.18;
  reflectedOrb.finalSize = sourceOrb.finalSize * 1.18;
  reflectedOrb.position = { ...sourceOrb.position };
  reflectedOrb.chargeTimer = 0;
  reflectedOrb.launched = true;
  reflectedOrb.speed = sourceOrb.speed * 1.08;
  reflectedOrb.mirrorCollapsed = true;

  const targetCenterX = originalAttacker.position.x + originalAttacker.width / 2;
  const targetCenterY = originalAttacker.position.y + originalAttacker.height / 2;
  const distanceX = targetCenterX - reflectedOrb.centerX;
  const distanceY = targetCenterY - reflectedOrb.centerY;
  const distance = Math.max(1, Math.hypot(distanceX, distanceY));

  reflectedOrb.velocity.x = (distanceX / distance) * reflectedOrb.speed;
  reflectedOrb.velocity.y = (distanceY / distance) * reflectedOrb.speed;
  sorcererSecretOrbs.push(reflectedOrb);
  playSound('sorcererSecretLaunch');
  return true;
}

function handleMenuSecretInput(event) {
  const targetTag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
  if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;
  if (event.key.length !== 1) return;

  menuSecretBuffer = `${menuSecretBuffer}${event.key.toLowerCase()}`.slice(-32);
  const normalizedSecretBuffer = menuSecretBuffer.replace(/[^a-z0-9]/g, '');

  if (normalizedSecretBuffer.endsWith('secretguide1')) {
    menuSecretBuffer = '';
    openSecretGuide();
  } else if (normalizedSecretBuffer.endsWith('secretguide2')) {
    menuSecretBuffer = '';
    openEventGuide();
  } else if (normalizedSecretBuffer.endsWith('cheater')) {
    menuSecretBuffer = '';
    openDebug();
  } else if (normalizedSecretBuffer.endsWith('codex')) {
    menuSecretBuffer = '';
    unlockCodexOpinion();
  } else if (normalizedSecretBuffer.endsWith('old')) {
    menuSecretBuffer = '';
    openOldDays();
  } else if (normalizedSecretBuffer.endsWith('blind')) {
    menuSecretBuffer = '';
    activateBlindMode();
  } else if (normalizedSecretBuffer.endsWith('overheat')) {
    menuSecretBuffer = '';
    characterSecretModes.fireMasterOverheat = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('ironwall')) {
    menuSecretBuffer = '';
    characterSecretModes.tankIronWall = true;
    unlockAchievement('codeBreaker');
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'tank') {
        fighter.setCharacterType('tank', fighter.secretVariant);
      }
    });
    updateHealthBars();
  } else if (normalizedSecretBuffer.endsWith('deadeye')) {
    menuSecretBuffer = '';
    characterSecretModes.cowboyDeadeye = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('mirrorluck')) {
    menuSecretBuffer = '';
    characterSecretModes.reflecterMirrorLuck = true;
    unlockAchievement('codeBreaker');
  } else if (normalizedSecretBuffer.endsWith('kaioken')) {
    menuSecretBuffer = '';
    characterSecretModes.normalKaioken = true;
    unlockAchievement('codeBreaker');
    updateCooldownIndicators();
  } else if (normalizedSecretBuffer.endsWith('upgrade')) {
    menuSecretBuffer = '';
    characterSecretModes.reflecterUpgrade = true;
    unlockAchievement('codeBreaker');
    syncSecretBodyModes();
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'reflecter') {
        fighter.setCharacterType('reflecter', fighter.secretVariant);
      }
    });
    updateHealthBars();
  } else if (normalizedSecretBuffer.endsWith('prism')) {
    menuSecretBuffer = '';
    characterSecretModes.switcherPrism = true;
    unlockAchievement('codeBreaker');
    syncSecretBodyModes();
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'switcher') {
        fighter.setCharacterType('switcher', fighter.secretVariant);
      }
    });
    updateCooldownIndicators();
  } else if (normalizedSecretBuffer.endsWith('fulladapt')) {
    menuSecretBuffer = '';
    if (!isDivineGeneralUnlocked()) return;
    characterSecretModes.divineFullAdapt = true;
    unlockAchievement('codeBreaker');
    [player1, player2].forEach((fighter) => {
      if (fighter.characterType === 'divineGeneral') {
        fighter.secretVariant = 'divineFullAdapt';
        fighter.setMaxHealth(getDivineMaxHealth(fighter));
        fighter.health = fighter.maxHealth;
        fillDivineAdaptations(fighter);
        fighter.divineAdaptCooldown = 0;
        fighter.divineCounterCooldown = 0;
      }
    });
    syncDivineGeneralUnlockUI();
    updateCooldownIndicators();
  } else if (normalizedSecretBuffer.endsWith('lightsout')) {
    menuSecretBuffer = '';
    unlockDarkRoomMap();
  } else if (normalizedSecretBuffer.endsWith('clear')) {
    menuSecretBuffer = '';
    clearActiveCodes();
  }
}

window.addEventListener('keydown', (event) => {
  if (document.body.classList.contains('menu-open')) {
    startMenuMusic();
    handleMenuSecretInput(event);
  }

  if (!gameStarted) return;

  switch (event.key) {
    case 'a':
      keys.a = true;
      break;
    case 'd':
      keys.d = true;
      break;
    case 'w':
      if (canFighterAct(player1) && player1.gamblerStunTimer <= 0 && player1.velocity.y === 0) player1.velocity.y = getDebugJumpSpeed(-14, player1);
      break;
    case 's':
      player1.attack();
      break;
    case 'e':
    case 'E':
      player1.attack(true);
      break;
    case 'q':
    case 'Q':
      if (keys.q) break;
      keys.q = true;
      if (handleChronoSpecialKey(player1, player2, 'blade', keys.f, 1)) break;
      if (handleGamblerSpecialKey(player1, 'roll', keys.f, 1)) break;
      if (handleFireMasterSpecialKey(player1, player2, 'fireball', keys.f, 1)) break;
      activateKaiokenCombo(player1);
      if (handleSorcererSpecialKey(player1, player2, 'orb', keys.f, 1)) break;
      cycleSwitcherMode(player1);
      launchFireball(player1, player2);
      launchTankShell(player1, player2);
      launchCowboyBurst(player1);
      launchSorcererOrb(player1, player2);
      activateCopycatShield(player1);
      activateGamblerRoll(player1);
      launchChronoBlade(player1, player2);
      activateGhostPhase(player1);
      activateDivineAdaptation(player1);
      break;
    case 'f':
    case 'F':
      if (keys.f) break;
      keys.f = true;
      if (handleChronoSpecialKey(player1, player2, 'slow', keys.q, 1)) break;
      if (handleGamblerSpecialKey(player1, 'luck', keys.q, 1)) break;
      if (handleFireMasterSpecialKey(player1, player2, 'beam', keys.q, 1)) break;
      if (handleSorcererSpecialKey(player1, player2, 'gravity', keys.q, 1)) break;
      launchFireBeam(player1, player2);
      launchSorcererGravityOrb(player1, player2);
      activateSwitcherAbility(player1);
      activateGamblerLuckIncrementer(player1);
      activateKaioken(player1);
      activateChronoSlow(player1, player2);
      activateDivineCounter(player1, player2);
      break;
    case 'ArrowLeft':
      if (!botEnabled) keys.ArrowLeft = true;
      break;
    case 'ArrowRight':
      if (!botEnabled) keys.ArrowRight = true;
      break;
    case 'ArrowUp':
      if (!botEnabled && canFighterAct(player2) && player2.gamblerStunTimer <= 0 && player2.velocity.y === 0) player2.velocity.y = getDebugJumpSpeed(-14, player2);
      break;
    case 'ArrowDown':
      if (!botEnabled) player2.attack();
      break;
    case 'Shift':
      if (!botEnabled) player2.attack(true);
      break;
    case '/':
      if (keys.slash) break;
      keys.slash = true;
      if (!botEnabled) {
        if (handleChronoSpecialKey(player2, player1, 'blade', keys.period, 2)) break;
        if (handleGamblerSpecialKey(player2, 'roll', keys.period, 2)) break;
        if (handleFireMasterSpecialKey(player2, player1, 'fireball', keys.period, 2)) break;
        activateKaiokenCombo(player2);
        if (handleSorcererSpecialKey(player2, player1, 'orb', keys.period, 2)) break;
        launchFireball(player2, player1);
        launchTankShell(player2, player1);
        launchCowboyBurst(player2);
        launchSorcererOrb(player2, player1);
        activateCopycatShield(player2);
        cycleSwitcherMode(player2);
        activateGamblerRoll(player2);
        launchChronoBlade(player2, player1);
        activateGhostPhase(player2);
        activateDivineAdaptation(player2);
      }
      break;
    case '.':
      if (keys.period) break;
      keys.period = true;
      if (!botEnabled) {
        if (handleChronoSpecialKey(player2, player1, 'slow', keys.slash, 2)) break;
        if (handleGamblerSpecialKey(player2, 'luck', keys.slash, 2)) break;
        if (handleFireMasterSpecialKey(player2, player1, 'beam', keys.slash, 2)) break;
        if (handleSorcererSpecialKey(player2, player1, 'gravity', keys.slash, 2)) break;
        launchFireBeam(player2, player1);
        launchSorcererGravityOrb(player2, player1);
        activateSwitcherAbility(player2);
        activateGamblerLuckIncrementer(player2);
        activateKaioken(player2);
        activateChronoSlow(player2, player1);
        activateDivineCounter(player2, player1);
      }
      break;
    case 'r':
    case 'R':
      if (gameOver) resetFight();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a = false;
      break;
    case 'd':
      keys.d = false;
      break;
    case 'q':
    case 'Q':
      keys.q = false;
      break;
    case 'f':
    case 'F':
      keys.f = false;
      break;
    case '/':
      keys.slash = false;
      break;
    case '.':
      keys.period = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight = false;
      break;
  }
});

function updateMovements() {
  if (player1.gamblerStunTimer > 0) {
    player1.velocity.x = 0;
  } else if (keys.a) {
    player1.velocity.x = -getDebugMoveSpeed(player1);
  } else if (keys.d) {
    player1.velocity.x = getDebugMoveSpeed(player1);
  } else {
    player1.velocity.x = 0;
  }

  if (botEnabled) {
    return;
  }

  if (player2.gamblerStunTimer > 0) {
    player2.velocity.x = 0;
  } else if (keys.ArrowLeft) {
    player2.velocity.x = -getDebugMoveSpeed(player2);
  } else if (keys.ArrowRight) {
    player2.velocity.x = getDebugMoveSpeed(player2);
  } else {
    player2.velocity.x = 0;
  }
}

function launchFireball(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'fireMaster' || attacker.specialCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 34;
  const startY = attacker.position.y + 44;

  fireballs.push(new Fireball({ x: startX, y: startY, direction, target, attacker }));
  playSound('fireball');
  recordSpecialUsed(attacker);
  attacker.specialCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, fireballCooldown), attacker);
}

function launchFireBeam(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'fireMaster' || attacker.fireBeamCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 90;
  const startY = attacker.position.y + 36;

  fireBeams.push(new FireBeam({ x: startX, y: startY, direction, target, attacker }));
  playSound('fireBeam');
  recordSpecialUsed(attacker);
  attacker.fireBeamCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, fireBeamCooldown), attacker);
}

function launchInfernoSplit(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'fireMaster' ||
    attacker.specialCooldown > 0 ||
    attacker.fireBeamCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 90;
  const fireballX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 34;
  const baseY = attacker.position.y + 42;
  const fireballOffsets = [-28, 0, 28];

  fireballOffsets.forEach((offset) => {
    fireballs.push(
      new Fireball({
        x: fireballX,
        y: baseY + offset,
        direction,
        target,
        attacker,
        damageMultiplier: infernoSplitFireballDamageMultiplier,
      })
    );
  });
  fireBeams.push(
    new FireBeam({
      x: startX,
      y: attacker.position.y + 36,
      direction,
      target,
      attacker,
      damageMultiplier: infernoSplitBeamDamageMultiplier,
    })
  );

  playSound('fireBeam');
  recordSpecialUsed(attacker);
  attacker.specialCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, infernoSplitCooldown), attacker);
  attacker.fireBeamCooldown = getDebugCooldown(getFireMasterSecretCooldown(attacker, infernoSplitCooldown), attacker);
  return true;
}

function launchTankShell(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'tank' || attacker.tankShellCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 28;
  const startY = attacker.position.y + 84;
  const shellKey = attacker === player1 ? 'p1ShellAvailable' : 'p2ShellAvailable';
  const empowered = tankClash.active && tankClash[shellKey];
  const damage = empowered ? tankClashShellDamage : getTankSecretDamage(attacker, tankShellDamage);

  if (empowered) tankClash[shellKey] = false;
  if (tankClash.active && !tankClash.p1ShellAvailable && !tankClash.p2ShellAvailable) {
    tankClash.active = false;
    tankClash.closeFrames = 0;
  }
  tankShells.push(new TankShell({ x: startX, y: startY, direction, target, attacker, damage, empowered }));
  playSound('tankShell');
  recordSpecialUsed(attacker);
  attacker.tankShellCooldown = getDebugCooldown(tankShellCooldown, attacker);
}

function launchSorcererOrb(attacker, target, ignoreCooldown = false, damageMultiplier = 1) {
  if (!canFighterAct(attacker)) return;
  if (
    (attacker.characterType !== 'sorcerer' && !ignoreCooldown) ||
    (!ignoreCooldown && attacker.sorcererOrbCooldown > 0) ||
    gameOver
  ) {
    return;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 36;
  const startY = attacker.position.y + 42;

  sorcererOrbs.push(new SorcererOrb({ x: startX, y: startY, direction, target, attacker, damageMultiplier }));
  playSound('sorcererOrb');
  if (!ignoreCooldown) {
    recordSpecialUsed(attacker);
    attacker.sorcererOrbCooldown = getDebugCooldown(sorcererOrbCooldown, attacker);
  }
}

function launchSorcererGravityOrb(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'sorcerer' ||
    attacker.sorcererGravityCooldown > 0 ||
    gameOver
  ) {
    return;
  }

  const size = attacker.width * 3;
  const targetCenterX = target.position.x + target.width / 2;
  const targetCenterY = target.position.y + target.height / 2;
  const x = Math.max(0, Math.min(canvas.width - size, targetCenterX - size / 2));
  const y = Math.max(64, Math.min(ground - size, targetCenterY - size / 2));

  sorcererGravityOrbs.push(new SorcererGravityOrb({ x, y, target, attacker }));
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.sorcererGravityCooldown = getDebugCooldown(sorcererGravityCooldown, attacker);
}

function launchChronoBlade(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'chrono' || attacker.chronoBladeCooldown > 0 || gameOver) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 42;
  const startY = attacker.position.y + attacker.height / 2 - 7;

  chronoBlades.push(new ChronoBlade({ x: startX, y: startY, target, attacker }));
  playSound('sorcererOrb');
  recordSpecialUsed(attacker);
  attacker.chronoBladeCooldown = getDebugCooldown(chronoBladeCooldown, attacker);
}

function activateChronoSlow(attacker, target) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'chrono' || attacker.chronoSlowCooldown > 0 || gameOver) return;

  chronoZones.push(new ChronoZone({ attacker, target }));
  detonateChronoMark(attacker, target);
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  attacker.chronoSlowCooldown = getDebugCooldown(chronoSlowCooldown, attacker);
}

function detonateChronoMark(attacker, target) {
  if (!target || target.chronoMarkedBy !== attacker || target.chronoMarkTimer <= 0) return;

  const actualDamage = applyDamage(attacker, target, chronoMarkDamage, { isSpecial: true, damageType: 'temporalMark' });
  if (actualDamage > 0) {
    target.velocity.x = getDebugKnockback(target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 12 : -12, target);
    target.velocity.y = getDebugKnockback(-9, target);
  }
  target.chronoMarkTimer = 0;
  target.chronoMarkedBy = null;
}

function activateChronoTimeStop(attacker, target) {
  if (!canFighterAct(attacker)) return false;
  if (attacker.characterType !== 'chrono' || attacker.chronoTimeStopCooldown > 0 || gameOver) return false;

  target.chronoTimeStopTimer = Math.max(target.chronoTimeStopTimer, getDebugDuration(chronoTimeStopDuration, target));
  target.velocity.x = 0;
  target.velocity.y = 0;
  target.isAttacking = false;
  target.attackTimer = 0;
  attacker.chronoTimeStopCooldown = getDebugCooldown(chronoTimeStopCooldown, attacker);
  attacker.chronoBladeCooldown = Math.max(attacker.chronoBladeCooldown, getDebugCooldown(chronoBladeCooldown, attacker));
  attacker.chronoSlowCooldown = Math.max(attacker.chronoSlowCooldown, getDebugCooldown(chronoSlowCooldown, attacker));
  playSound('gravityOrb');
  recordSpecialUsed(attacker);
  return true;
}

function activateGhostPhase(attacker) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'ghost' ||
    attacker.ghostPhaseCooldown > 0 ||
    attacker.ghostPhaseTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.ghostPhaseTimer = getDebugDuration(ghostPhaseDuration, attacker);
  attacker.ghostPhaseCooldown = attacker.ghostPhaseTimer + getDebugCooldown(ghostPhaseCooldown, attacker);
  attacker.ghostPhaseContactTimer = 0;
  recordSpecialUsed(attacker);
  playSound('reflectShield');
  return true;
}

function activateDivineAdaptation(attacker, ignoreCharacterType = false) {
  if (!canFighterAct(attacker)) return false;
  if (
    (!ignoreCharacterType && attacker.characterType !== 'divineGeneral') ||
    attacker.divineAdaptCooldown > 0 ||
    attacker.divineAdaptTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  attacker.divineAdaptTimer = getDebugDuration(divineGeneralAdaptDuration, attacker);
  attacker.divineAdaptCooldown = attacker.divineAdaptTimer + getDivineAdaptCooldownMax(attacker);
  attacker.velocity.x = 0;
  attacker.isAttacking = false;
  attacker.attackTimer = 0;
  recordSpecialUsed(attacker);
  playSound('reflectShield');
  return true;
}

function tryActivateDivineCharacterCounter(attacker, target, direction) {
  const fireStacks = getDivineAdaptationStacksByFamily(attacker, 'fire');
  const shellStacks = getDivineAdaptationStacksByFamily(attacker, 'shell');
  const ballisticStacks = getDivineAdaptationStacksByFamily(attacker, 'ballistic');
  const prismStacks = getDivineAdaptationStacksByFamily(attacker, 'prism');
  const arcaneStacks = getDivineAdaptationStacksByFamily(attacker, 'arcane');
  const luckStacks = getDivineAdaptationStacksByFamily(attacker, 'luck');

  if (target.characterType === 'fireMaster' && fireStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, fireStacks);
    const damage = 18 + stacks * 5;
    const heal = 8 + stacks * 3;
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineFireJudgment' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + heal);
    target.specialCooldown = Math.max(target.specialCooldown, getDebugCooldown(180, target));
    target.fireBeamCooldown = Math.max(target.fireBeamCooldown, getDebugCooldown(220, target));
    target.velocity.x = getDebugKnockback(direction * (12 + stacks), target);
    target.velocity.y = getDebugKnockback(-8 - stacks, target);
    playSound('fireball');
    return true;
  }

  if (target.characterType === 'tank' && shellStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, shellStacks);
    const damage = 16 + stacks * 4;
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineArmorBreak' });
    target.tankShellCooldown = Math.max(target.tankShellCooldown, getDebugCooldown(260, target));
    target.tankAttackCooldown = Math.max(target.tankAttackCooldown, 38 + stacks * 4);
    target.velocity.x = getDebugKnockback(direction * (18 + stacks * 2), target);
    target.velocity.y = getDebugKnockback(-10, target);
    attacker.velocity.x = -direction * 8 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('tankShell');
    return true;
  }

  if (target.characterType === 'cowboy' && ballisticStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, ballisticStacks);
    const damage = 14 + stacks * 4;
    target.cowboyBurstShotsRemaining = 0;
    target.cowboyBurstCooldown = Math.max(target.cowboyBurstCooldown, getDebugCooldown(240, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineBulletReturn' });
    target.velocity.x = getDebugKnockback(direction * (16 + stacks), target);
    target.velocity.y = getDebugKnockback(-5 - Math.floor(stacks / 2), target);
    attacker.velocity.x = -direction * 10 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('cowboyBurst');
    return true;
  }

  if (target.characterType === 'switcher' && prismStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, prismStacks);
    const damage = 13 + stacks * 4;
    target.switcherDashTimer = 0;
    target.switcherRedStrikeTimer = 0;
    target.switcherRedStrikeArea = null;
    target.switcherArmorTimer = 0;
    target.setMaxHealth(switcherHealth);
    target.switcherAbilityCooldown = Math.max(target.switcherAbilityCooldown, getDebugCooldown(220 + stacks * 18, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divinePrismLock' });
    attacker.velocity.x = -direction * (10 + stacks) * getDebugMultiplier('moveMultiplier', attacker);
    target.velocity.x = getDebugKnockback(direction * (14 + stacks), target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('switcher');
    return true;
  }

  if (target.characterType === 'sorcerer' && arcaneStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, arcaneStacks);
    const damage = 15 + stacks * 4;
    target.sorcererOrbCooldown = Math.max(target.sorcererOrbCooldown, getDebugCooldown(240 + stacks * 20, target));
    target.sorcererGravityCooldown = Math.max(target.sorcererGravityCooldown, getDebugCooldown(280 + stacks * 24, target));
    target.sorcererSecretOrbCooldown = Math.max(target.sorcererSecretOrbCooldown, getDebugCooldown(320 + stacks * 30, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineArcaneSeal' });
    target.velocity.x = getDebugKnockback(direction * (9 + stacks), target);
    target.velocity.y = getDebugKnockback(-12 - stacks, target);
    playSound('sorcererOrb');
    return true;
  }

  if (target.characterType === 'gambler' && luckStacks > 0) {
    const stacks = Math.min(divineGeneralMaxAdaptStacks, luckStacks);
    const damage = 12 + stacks * 4;
    target.gamblerLuckBonus = Math.max(0, (target.gamblerLuckBonus || 0) - (0.12 + stacks * 0.04));
    target.gamblerRollCooldown = Math.max(target.gamblerRollCooldown, getDebugCooldown(180 + stacks * 18, target));
    target.gamblerLuckCooldown = Math.max(target.gamblerLuckCooldown, getDebugCooldown(220 + stacks * 20, target));
    target.gamblerStunTimer = Math.max(target.gamblerStunTimer, getDebugDuration(36 + stacks * 8, target));
    applyDamage(attacker, target, damage, { isSpecial: true, damageType: 'divineLuckBreak' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 5 + stacks * 2);
    target.velocity.x = getDebugKnockback(direction * (8 + stacks), target);
    target.velocity.y = getDebugKnockback(-5, target);
    playSound('gambler');
    return true;
  }

  return false;
}

function activateDivineCounter(attacker, target, ignoreCharacterType = false) {
  if (!canFighterAct(attacker)) return false;
  if (
    (!ignoreCharacterType && attacker.characterType !== 'divineGeneral') ||
    attacker.divineCounterCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const distance = Math.abs(attackerCenterX - targetCenterX);
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const counterType = getDivineCounterType(attacker, target);
  const counterFamily = getDivineCounterFamily(counterType);
  const adaptedStacks = getDominantDivineAdaptation(attacker)?.stacks || 0;
  const damageBonus = Math.min(10, adaptedStacks * 2);

  attacker.divineCounterCooldown = getDivineCounterCooldownMax(attacker);
  attacker.attacksToTheRight = direction > 0;
  recordSpecialUsed(attacker);

  if (distance > divineGeneralCounterRange) {
    attacker.velocity.x = direction * 18 * getDebugMultiplier('moveMultiplier', attacker);
    playSound('switcher');
    return true;
  }

  if (tryActivateDivineCharacterCounter(attacker, target, direction)) return true;

  if (counterFamily === 'temporal') {
    attacker.chronoTimeStopTimer = 0;
    target.chronoTimeStopTimer = Math.max(target.chronoTimeStopTimer, getDebugDuration(45 + adaptedStacks * 8, target));
    target.velocity.x = 0;
    target.velocity.y = 0;
    applyDamage(attacker, target, 10 + damageBonus, { isSpecial: true, damageType: 'divineTemporal' });
    playSound('gravityOrb');
    return true;
  }

  if (counterFamily === 'luck') {
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 8 + adaptedStacks);
    target.gamblerLuckBonus = Math.max(0, (target.gamblerLuckBonus || 0) - 0.2);
    applyDamage(attacker, target, 11 + damageBonus, { isSpecial: true, damageType: 'divineLuck' });
    target.velocity.x = getDebugKnockback(direction * 8, target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('gambler');
    return true;
  }

  if (counterFamily === 'spirit') {
    target.ghostPhaseTimer = 0;
    target.ghostPhaseContactTimer = 0;
    applyDamage(attacker, target, 13 + damageBonus, { isSpecial: true, damageType: 'divineSpirit', ignoreInvincible: true });
    target.velocity.x = getDebugKnockback(direction * 11, target);
    target.velocity.y = getDebugKnockback(-7, target);
    playSound('reflectShield');
    return true;
  }

  if (counterFamily === 'fire') {
    applyDamage(attacker, target, 18 + damageBonus, { isSpecial: true, damageType: 'divineFire' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 6 + adaptedStacks);
    target.velocity.x = getDebugKnockback(direction * 13, target);
    target.velocity.y = getDebugKnockback(-9, target);
    playSound('fireball');
    return true;
  }

  if (counterFamily === 'ballistic') {
    applyDamage(attacker, target, 16 + damageBonus, { isSpecial: true, damageType: 'divineBallistic' });
    target.cowboyBurstShotsRemaining = 0;
    target.velocity.x = getDebugKnockback(direction * 15, target);
    target.velocity.y = getDebugKnockback(-5, target);
    playSound('cowboyBurst');
    return true;
  }

  if (counterFamily === 'shell') {
    applyDamage(attacker, target, 15 + damageBonus, { isSpecial: true, damageType: 'divineShell' });
    attacker.health = Math.min(attacker.maxHealth, attacker.health + 10 + adaptedStacks);
    target.velocity.x = getDebugKnockback(direction * 17, target);
    target.velocity.y = getDebugKnockback(-8, target);
    playSound('tankShell');
    return true;
  }

  if (counterFamily === 'arcane') {
    applyDamage(attacker, target, 14 + damageBonus, { isSpecial: true, damageType: 'divineArcane' });
    target.velocity.x = getDebugKnockback(direction * 9, target);
    target.velocity.y = getDebugKnockback(-14, target);
    playSound('sorcererOrb');
    return true;
  }

  if (counterFamily === 'prism') {
    applyDamage(attacker, target, 15 + damageBonus, { isSpecial: true, damageType: 'divinePrism' });
    attacker.velocity.x = -direction * 12 * getDebugMultiplier('moveMultiplier', attacker);
    target.velocity.x = getDebugKnockback(direction * 14, target);
    target.velocity.y = getDebugKnockback(-6, target);
    playSound('switcher');
    return true;
  }

  applyDamage(attacker, target, 20 + damageBonus, { isSpecial: true, damageType: 'divineMelee' });
  target.velocity.x = getDebugKnockback(direction * 14, target);
  target.velocity.y = getDebugKnockback(-8, target);
  playSound('reflectShield');
  return true;
}

function handleFireMasterSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'fireMaster') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      launchInfernoSplit(attacker, target);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'fireMaster', () => {
    if (specialType === 'fireball') {
      launchFireball(attacker, target);
    } else {
      launchFireBeam(attacker, target);
    }
  });
  return true;
}

function handleChronoSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'chrono') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      activateChronoTimeStop(attacker, target);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'chrono', () => {
    if (specialType === 'blade') {
      launchChronoBlade(attacker, target);
    } else {
      activateChronoSlow(attacker, target);
    }
  });
  return true;
}

function handleGamblerSpecialKey(attacker, specialType, comboPressed, playerNumber) {
  if (attacker.characterType !== 'gambler') return false;

  if (comboPressed) {
    if (getQfPendingSpecial(playerNumber)) {
      clearQfPendingSpecial(playerNumber);
      activateGamblerLoadedDice(attacker);
      return true;
    }
  }

  queueQfPendingSpecial(playerNumber, attacker, 'gambler', () => {
    if (specialType === 'roll') {
      activateGamblerRoll(attacker);
    } else {
      activateGamblerLuckIncrementer(attacker);
    }
  });
  return true;
}

function queueQfPendingSpecial(playerNumber, attacker, characterType, action) {
  clearQfPendingSpecial(playerNumber);

  const pending = {
    timerId: window.setTimeout(() => {
      if (!gameOver && attacker.characterType === characterType && canFighterAct(attacker)) {
        action();
      }
      setQfPendingSpecial(playerNumber, null);
    }, qfComboWindow),
  };

  setQfPendingSpecial(playerNumber, pending);
}

function clearQfPendingSpecial(playerNumber) {
  const pending = getQfPendingSpecial(playerNumber);
  if (!pending) return;

  window.clearTimeout(pending.timerId);
  setQfPendingSpecial(playerNumber, null);
}

function getQfPendingSpecial(playerNumber) {
  return playerNumber === 1 ? player1QfPendingSpecial : player2QfPendingSpecial;
}

function setQfPendingSpecial(playerNumber, pending) {
  if (playerNumber === 1) {
    player1QfPendingSpecial = pending;
  } else {
    player2QfPendingSpecial = pending;
  }
}

function handleSorcererSpecialKey(attacker, target, specialType, comboPressed, playerNumber) {
  if (!canFighterAct(attacker)) {
    return false;
  }

  if (attacker.characterType !== 'sorcerer') {
    return false;
  }

  if (comboPressed) {
    clearSorcererPendingSpecial(playerNumber);
    launchSorcererSecretOrb(attacker, target, true);
    return true;
  }

  queueSorcererPendingSpecial(attacker, target, specialType, playerNumber);
  return true;
}

function queueSorcererPendingSpecial(attacker, target, specialType, playerNumber) {
  clearSorcererPendingSpecial(playerNumber);

  const pending = {
    timerId: window.setTimeout(() => {
      if (!gameOver && attacker.characterType === 'sorcerer') {
        if (specialType === 'orb') {
          launchSorcererOrb(attacker, target);
        } else {
          launchSorcererGravityOrb(attacker, target);
        }
      }
      setSorcererPendingSpecial(playerNumber, null);
    }, sorcererSecretComboWindow),
  };

  setSorcererPendingSpecial(playerNumber, pending);
}

function clearSorcererPendingSpecial(playerNumber) {
  const pending = getSorcererPendingSpecial(playerNumber);
  if (pending) {
    window.clearTimeout(pending.timerId);
    setSorcererPendingSpecial(playerNumber, null);
  }
}

function getSorcererPendingSpecial(playerNumber) {
  return playerNumber === 1 ? player1SorcererPendingSpecial : player2SorcererPendingSpecial;
}

function setSorcererPendingSpecial(playerNumber, pending) {
  if (playerNumber === 1) {
    player1SorcererPendingSpecial = pending;
  } else {
    player2SorcererPendingSpecial = pending;
  }
}

function launchSorcererSecretOrb(attacker, target, comboPressed) {
  if (!canFighterAct(attacker)) return false;
  if (
    !comboPressed ||
    attacker.characterType !== 'sorcerer' ||
    attacker.sorcererSecretOrbCooldown > 0 ||
    gameOver
  ) {
    return false;
  }

  const alreadyCharging = sorcererSecretOrbs.some(
    (sorcererSecretOrb) => sorcererSecretOrb.attacker === attacker && !sorcererSecretOrb.launched
  );
  if (alreadyCharging) {
    return true;
  }

  sorcererSecretOrbs.push(new SorcererSecretOrb({ attacker, target }));
  recordSpecialUsed(attacker);
  attacker.sorcererSecretOrbCooldown = getDebugCooldown(sorcererSecretOrbCooldown, attacker);
  playSound('sorcererSecretCharge');
  return true;
}

function activateCopycatShield(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'reflecter' ||
    attacker.copycatShieldCooldown > 0 ||
    attacker.copycatShieldTimer > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.copycatShieldTimer = getDebugDuration(getReflecterShieldDuration(attacker), attacker);
  recordSpecialUsed(attacker);
  attacker.copycatShieldCooldown = getDebugCooldown(getReflecterShieldCooldown(attacker), attacker);
  playSound('reflectShield');
}

function activateKaioken(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    !isNormalKaioken(attacker) ||
    attacker.characterType !== 'normal' ||
    attacker.kaiokenCooldown > 0 ||
    attacker.kaiokenTimer > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.kaiokenBaseMaxHealth = attacker.baseMaxHealth;
  attacker.kaiokenTimer = getDebugDuration(kaiokenSecretDuration, attacker);
  attacker.kaiokenCooldown = getDebugCooldown(kaiokenCooldown, attacker);
  attacker.setMaxHealth(attacker.kaiokenBaseMaxHealth + kaiokenSecretHealthBoost);
  attacker.health = Math.min(attacker.maxHealth, attacker.health + getDebugMaxHealth(kaiokenSecretHealthBoost, attacker));
  recordSpecialUsed(attacker);
}

function activateKaiokenCombo(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'normal' ||
    attacker.kaiokenTimer <= 0 ||
    attacker.kaiokenComboCooldown > 0 ||
    attacker.kaiokenComboHitsRemaining > 0 ||
    gameOver
  ) {
    return;
  }

  attacker.kaiokenComboHitsRemaining = isNormalKaioken(attacker) ? kaiokenSecretComboHits : kaiokenComboHits;
  attacker.kaiokenComboTimer = 0;
  attacker.kaiokenComboCooldown = getDebugCooldown(kaiokenComboCooldown, attacker);
  recordSpecialUsed(attacker);
}

function strikeKaiokenCombo(attacker, target) {
  if (!target) return;

  const direction = target.position.x + target.width / 2 >= attacker.position.x + attacker.width / 2 ? 1 : -1;
  const comboArea = {
    x: direction > 0 ? attacker.position.x + attacker.width - 4 : attacker.position.x - 92,
    y: attacker.position.y + 18,
    width: 96,
    height: 82,
  };

  attacker.attacksToTheRight = direction > 0;
  attacker.attackBox = {
    offset: { x: direction > 0 ? attacker.width - 4 : -92, y: 18 },
    width: 96,
    height: 82,
  };
  attacker.isAttacking = true;
  attacker.kaiokenComboVisualTimer = 3;
  attacker.attackTimer = Math.max(attacker.attackTimer, attacker.attackDuration - 3);
  const comboDamage = isNormalKaioken(attacker) ? kaiokenSecretComboDamage : kaiokenComboDamage;
  attacker.currentAttackDamage = comboDamage;

  if (rectangularCopycatShieldCollision(target, comboArea) || rectangularCollision({ rectangle1: comboArea, rectangle2: target })) {
    if (!handleCopycatShieldHit(target, attacker)) {
      applyDamage(attacker, target, comboDamage, { isSpecial: true, damageType: 'meleeCombo' });
      target.velocity.x = getDebugKnockback(direction > 0 ? 9 : -9, target);
      target.velocity.y = Math.min(target.velocity.y, getDebugKnockback(-5, target));
    }
  }
}

function copyFireMasterAbility(copycat, source) {
  const target = source;
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 34;
  const startY = copycat.position.y + 44;

  fireballs.push(new Fireball({ x: startX, y: startY, direction, target, attacker: copycat, damageMultiplier: getReflecterCopyDamageMultiplier(copycat) }));
}

function copyTankAbility(copycat, source) {
  const target = source;
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 28;
  const startY = copycat.position.y + 84;

  tankShells.push(
    new TankShell({
      x: startX,
      y: startY,
      direction,
      target,
      attacker: copycat,
      damage: getTankSecretDamage(source, tankShellDamage) * getReflecterCopyDamageMultiplier(copycat),
    })
  );
}

function copyCowboyAbility(copycat, source) {
  copycat.target = source;
  copycat.cowboyBurstShotsRemaining = getCowboySecretBurstShots(source) * getReflecterCopyDamageMultiplier(copycat);
  copycat.cowboyBurstTimer = 0;
}

function copySwitcherAbility(copycat, source) {
  const originalModeIndex = copycat.switcherModeIndex;
  const originalCopyMultiplier = copycat.reflecterCopyDamageMultiplier || 1;
  copycat.switcherModeIndex = source.switcherModeIndex;
  copycat.characterType = 'switcher';
  copycat.reflecterCopyDamageMultiplier = getReflecterCopyDamageMultiplier(copycat);
  activateSwitcherAbility(copycat, true);
  copycat.characterType = 'reflecter';
  copycat.switcherModeIndex = originalModeIndex;
  copycat.reflecterCopyDamageMultiplier = originalCopyMultiplier;
}

function copySorcererAbility(copycat, source) {
  launchSorcererOrb(copycat, source, true, getReflecterCopyDamageMultiplier(copycat));
}

function copyChronoAbility(copycat, source) {
  const attackerCenterX = copycat.position.x + copycat.width / 2;
  const targetCenterX = source.position.x + source.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? copycat.position.x + copycat.width : copycat.position.x - 42;
  const startY = copycat.position.y + copycat.height / 2 - 7;

  chronoBlades.push(new ChronoBlade({ x: startX, y: startY, target: source, attacker: copycat }));
  recordSpecialUsed(copycat);
  playSound('sorcererOrb');
}

function copyGamblerAbility(copycat) {
  const copiedLuckChance = isReflecterMirrorLuck(copycat) ? 0.88 + Math.random() * 0.12 : Math.random();
  const symbols = rollGamblerSymbols(copiedLuckChance);
  copycat.gamblerRollNumbers = symbols;
  copycat.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, copycat);
  copycat.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(copycat);
  recordSpecialUsed(copycat);
  playSound('slotRoll');
  applyGamblerRollEffect(copycat, symbols);
}

function rollGamblerSymbols(luckBonus = 0) {
  if (Math.random() < luckBonus) {
    const luckySymbols = ['3', '4', '5', '6', '7'];
    const luckySymbol = luckySymbols[Math.floor(Math.random() * luckySymbols.length)];
    return [luckySymbol, luckySymbol, luckySymbol];
  }

  const symbols = ['X', '1', '2', '3', '4', '5', '6', '7'];
  return Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
}

function rollLoadedDiceSymbols(gambler) {
  const jackpotChance = gamblerLoadedDiceJackpotChance + gambler.gamblerLuckBonus * 0.04;
  if (Math.random() < jackpotChance) {
    return ['7', '7', '7'];
  }

  const positiveSymbols = ['3', '4', '5', '6'];
  const symbol = positiveSymbols[Math.floor(Math.random() * positiveSymbols.length)];
  return [symbol, symbol, symbol];
}

function applyGamblerRollEffect(gambler, symbols) {
  const [first, second, third] = symbols;
  if (first !== second || second !== third) return;

  if (first === 'X') {
    gambler.gamblerStunTimer = getDebugDuration(gamblerStunDuration, gambler);
    applyDamage(gambler, gambler, 10, { ignoreDebug: true, ignoreInvincible: true, recordStats: false });
    return;
  }

  if (first === '1') {
    applyDamage(gambler, gambler, 5, { ignoreDebug: true, ignoreInvincible: true, recordStats: false });
    return;
  }

  if (first === '2') return;

  if (first === '3') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 20);
  } else if (first === '4') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 35);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.1);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '5') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 40);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.2);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '6') {
    gambler.health = Math.min(gambler.maxHealth, gambler.health + 50);
    gambler.gamblerSpeedBoost = Math.max(gambler.gamblerSpeedBoost, 0.5);
    gambler.gamblerSpeedBoostTimer = getDebugDuration(gamblerSpeedBoostDuration, gambler);
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 0.25);
    gambler.gamblerDamageBoostTimer = getDebugDuration(gamblerDamageBoostDuration, gambler);
  } else if (first === '7') {
    const jackpotDuration = getDebugDuration(
      gamblerJackpotMinDuration + Math.floor(Math.random() * (gamblerJackpotMaxDuration - gamblerJackpotMinDuration + 1)),
      gambler
    );
    playSound('jackpotFanfare', { durationFrames: jackpotDuration });
    if (gambler.characterType === 'gambler') {
      unlockAchievement('jackpot');
    }
    gambler.gamblerSpeedBoost = Math.max(gambler.gamblerSpeedBoost, 1);
    gambler.gamblerSpeedBoostTimer = jackpotDuration;
    gambler.gamblerDamageBoost = Math.max(gambler.gamblerDamageBoost, 1);
    gambler.gamblerDamageBoostTimer = jackpotDuration;
    gambler.gamblerInvincibleTimer = jackpotDuration;
  }
}

function activateGamblerLoadedDice(attacker) {
  if (!canFighterAct(attacker)) return false;
  if (
    attacker.characterType !== 'gambler' ||
    attacker.gamblerRollCooldown > 0 ||
    attacker.gamblerLuckCooldown > 0 ||
    attacker.gamblerStunTimer > 0 ||
    gameOver
  ) {
    return false;
  }

  const symbols = rollLoadedDiceSymbols(attacker);
  attacker.gamblerLuckBonus = Math.min(gamblerLuckCap, attacker.gamblerLuckBonus + gamblerLoadedDiceLuckBonus);
  attacker.gamblerRollNumbers = symbols;
  attacker.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, attacker);
  attacker.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(attacker);
  attacker.gamblerRollCooldown = getDebugCooldown(gamblerRollCooldown, attacker);
  attacker.gamblerLuckCooldown = getDebugCooldown(gamblerLuckCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('slotRoll');
  applyGamblerRollEffect(attacker, symbols);
  return true;
}

function activateGamblerRoll(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'gambler' || attacker.gamblerRollCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) {
    return;
  }

  const symbols = rollGamblerSymbols(attacker.gamblerLuckBonus);
  attacker.gamblerRollNumbers = symbols;
  attacker.gamblerRollTimer = getDebugDuration(gamblerRollDisplayDuration, attacker);
  attacker.gamblerRollCooldown = getDebugCooldown(gamblerRollCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('slotRoll');
  applyGamblerRollEffect(attacker, symbols);
}

function activateGamblerLuckIncrementer(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'gambler' || attacker.gamblerLuckCooldown > 0 || attacker.gamblerStunTimer > 0 || gameOver) {
    return;
  }

  attacker.gamblerLuckBonus = Math.min(gamblerLuckCap, attacker.gamblerLuckBonus + gamblerLuckStep);
  attacker.gamblerLuckWaveTimer = getGamblerLuckWaveDuration(attacker);
  attacker.gamblerLuckCooldown = getDebugCooldown(gamblerLuckCooldown, attacker);
  recordSpecialUsed(attacker);
  playSound('gambler');
}

function cycleSwitcherMode(attacker) {
  if (!canFighterAct(attacker)) return;
  if (attacker.characterType !== 'switcher' || gameOver) return;

  attacker.switcherModeIndex = (attacker.switcherModeIndex + 1) % switcherModes.length;
  recordSpecialUsed(attacker);
  recordPrismSwitcherUse(attacker);
  attacker.moveSpeed = switcherModeStats[attacker.getSwitcherMode()].moveSpeed;
  attacker.attackColor = hexToRgba(attacker.getSwitcherModeColor(), 0.65);
  playSound('switcher');

  if (attacker.getSwitcherMode() !== 'yellow' && attacker.switcherArmorTimer <= 0) {
    attacker.setMaxHealth(switcherHealth);
  }
}

function activateSwitcherAbility(attacker, ignoreCooldown = false) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'switcher' ||
    (!ignoreCooldown && attacker.switcherAbilityCooldown > 0) ||
    gameOver
  ) {
    return;
  }

  const mode = attacker.getSwitcherMode();
  const target = attacker.target || getOpponent(attacker);
  const prism = isSwitcherPrism(attacker);
  const overdrive = isPrismOverdriveActive();

  if (mode === 'red') {
    useSwitcherRedStrike(attacker, target);
  } else if (mode === 'blue') {
    useSwitcherBlueDash(attacker, target);
  } else if (mode === 'green') {
    attacker.health = Math.min(attacker.maxHealth, attacker.health + (prism ? 50 : 35) + (overdrive ? 10 : 0));
  } else if (mode === 'yellow') {
    attacker.switcherArmorTimer = getDebugDuration(prism ? 480 : 360, attacker);
    attacker.setMaxHealth((prism ? 170 : 150) + (overdrive ? 15 : 0));
    attacker.moveSpeed = switcherModeStats.yellow.moveSpeed;
    attacker.health = Math.min(attacker.maxHealth, attacker.health + (prism ? 55 : 40));
  }

  if (!ignoreCooldown) {
    recordSpecialUsed(attacker);
    recordPrismSwitcherUse(attacker);
    attacker.switcherAbilityCooldown = getSwitcherAbilityCooldownMax(attacker);
  }
  playSound('switcher');
}

function useSwitcherRedStrike(attacker, target) {
  if (!target) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const blast = {
    x: direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 110,
    y: attacker.position.y + 36,
    width: 110,
    height: 54,
  };

  attacker.switcherRedStrikeArea = blast;
  attacker.switcherRedStrikeTimer = getDebugDuration(16, attacker);

  if (rectangularCollision({ rectangle1: blast, rectangle2: target })) {
    if (!handleCopycatShieldHit(target, attacker)) {
      const prismDamage = isSwitcherPrism(attacker) ? 8 : 0;
      const overdriveDamage = isPrismOverdriveActive() ? 5 : 0;
      applyDamage(attacker, target, (22 + prismDamage + overdriveDamage) * (attacker.reflecterCopyDamageMultiplier || 1), { isSpecial: true, damageType: 'prismStrike' });
      target.velocity.x = getDebugKnockback(direction > 0 ? 13 : -13, target);
      target.velocity.y = getDebugKnockback(-6, target);
    }
  }
}

function useSwitcherBlueDash(attacker, target) {
  const targetCenterX = target ? target.position.x + target.width / 2 : attacker.position.x + attacker.width;
  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  attacker.switcherDashDirection = direction;
  attacker.switcherDashTimer = getDebugDuration(isSwitcherPrism(attacker) ? 14 : 10, attacker);
  attacker.velocity.x = direction * (isPrismOverdriveActive() ? 29 : isSwitcherPrism(attacker) ? 27 : 22) * getDebugMultiplier('moveMultiplier', attacker);
  attacker.velocity.y = Math.min(attacker.velocity.y, isSwitcherPrism(attacker) ? -6 : -3);
}

function launchCowboyBurst(attacker) {
  if (!canFighterAct(attacker)) return;
  if (
    attacker.characterType !== 'cowboy' ||
    attacker.cowboyBurstCooldown > 0 ||
    attacker.cowboyBurstShotsRemaining > 0 ||
    gameOver ||
    (isDesertCowboyDuelMatch() && !desertCowboyDuel.active)
  ) {
    return;
  }

  if (desertCowboyDuel.active) {
    const bulletKey = attacker === player1 ? 'p1BulletAvailable' : 'p2BulletAvailable';
    if (!desertCowboyDuel[bulletKey]) return;
    desertCowboyDuel[bulletKey] = false;
    attacker.cowboyBurstShotsRemaining = 1;
    attacker.cowboyBurstTimer = 0;
    recordSpecialUsed(attacker);
    attacker.cowboyBurstCooldown = getDebugCooldown(cowboyBurstCooldown, attacker);
    playSound('cowboyBurst');
    return;
  }

  attacker.cowboyBurstShotsRemaining = getCowboySecretBurstShots(attacker);
  attacker.cowboyBurstTimer = 0;
  recordSpecialUsed(attacker);
  attacker.cowboyBurstCooldown = getDebugCooldown(cowboyBurstCooldown, attacker);
  playSound('cowboyBurst');
}

function shootCowboyBullet(attacker, target) {
  if (!target) return;

  const attackerCenterX = attacker.position.x + attacker.width / 2;
  const targetCenterX = target.position.x + target.width / 2;
  const direction = targetCenterX >= attackerCenterX ? 1 : -1;
  const startX = direction > 0 ? attacker.position.x + attacker.width : attacker.position.x - 18;
  const startY = attacker.position.y + 54;
  const isDuelShot = desertCowboyDuel.active;
  const damage = desertCowboyDuel.active
    ? desertCowboyDuelDamage
    : getCowboySecretDamage(attacker, cowboyBulletDamage);

  cowboyBullets.push(
    new CowboyBullet({ x: startX, y: startY, direction, target, attacker, damage, fixedDamage: isDuelShot })
  );
}

function getBotDifficultyProfile() {
  return botDifficultySettings[botDifficulty] || botDifficultySettings.medium;
}

function getBotAttackRange() {
  if (player2.characterType === 'divineGeneral') return 150;
  return player2.characterType === 'tank' ? 128 : 82;
}

function getBotMoveSpeed() {
  return getDebugMoveSpeed(player2);
}

function getBotPreferredRange() {
  if (player2.characterType === 'cowboy') return 390;
  if (player2.characterType === 'chrono') return 340;
  if (player2.characterType === 'sorcerer') return 360;
  if (player2.characterType === 'fireMaster') return 320;
  if (player2.characterType === 'divineGeneral') return 135;
  if (player2.characterType === 'tank') return 118;
  if (player2.characterType === 'switcher') {
    const mode = player2.getSwitcherMode();
    if (mode === 'blue') return 260;
    if (mode === 'red') return 120;
    return 190;
  }
  return 150;
}

function getIncomingBotProjectileThreat(profile) {
  const botLeft = player2.position.x;
  const botRight = player2.position.x + player2.width;
  const botTop = player2.position.y;
  const botBottom = player2.position.y + player2.height;
  const projectiles = [
    ...fireballs,
    ...fireBeams,
    ...tankShells,
    ...cowboyBullets,
    ...sorcererOrbs,
    ...sorcererSecretOrbs,
    ...chronoBlades,
  ];

  for (const projectile of projectiles) {
    if (!projectile.active || projectile.target !== player2 || !projectile.velocity) continue;

    const projectileLeft = projectile.position.x;
    const projectileRight = projectile.position.x + projectile.width;
    const projectileTop = projectile.position.y;
    const projectileBottom = projectile.position.y + projectile.height;
    const overlapsY = projectileBottom > botTop + 8 && projectileTop < botBottom - 12;
    const approachingFromLeft = projectile.velocity.x > 0 && projectileRight <= botLeft;
    const approachingFromRight = projectile.velocity.x < 0 && projectileLeft >= botRight;
    const distance = approachingFromLeft ? botLeft - projectileRight : projectileLeft - botRight;

    if ((approachingFromLeft || approachingFromRight) && overlapsY && distance <= profile.reactionDistance) {
      return {
        type: 'projectile',
        centerX: projectile.position.x + projectile.width / 2,
        distance,
      };
    }
  }

  for (const orb of sorcererGravityOrbs) {
    if (!orb.active || orb.target !== player2) continue;

    const botCenterX = player2.position.x + player2.width / 2;
    const distance = Math.abs(orb.centerX - botCenterX);
    if (distance < 180 && Math.abs(orb.centerY - (player2.position.y + player2.height / 2)) < 160) {
      return {
        type: 'gravity',
        centerX: orb.centerX,
        distance,
      };
    }
  }

  return null;
}

function dodgeBotThreat(threat, profile) {
  if (!threat || Math.random() > profile.dodgeChance) return false;

  const botCenterX = player2.position.x + player2.width / 2;
  const dodgeDirection = threat.centerX < botCenterX ? 1 : -1;
  player2.velocity.x = getBotMoveSpeed() * dodgeDirection;

  if (player2.velocity.y === 0 && (threat.type === 'projectile' || Math.random() < 0.55)) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }

  return true;
}

function shouldBotUseSpecial(profile, multiplier = 1) {
  return Math.random() < Math.min(0.98, profile.specialChance * multiplier);
}

function updateBotSwitcher(profile, absDistance) {
  if (player2.characterType !== 'switcher' || player2.switcherAbilityCooldown > 0) return false;

  const currentMode = player2.getSwitcherMode();
  let wantedMode = 'red';

  if (player2.health < player2.maxHealth * 0.42) {
    wantedMode = 'green';
  } else if (absDistance > 230) {
    wantedMode = 'blue';
  } else if (player2.health < player2.maxHealth * 0.68 && profile.reactionChance > 0.7) {
    wantedMode = 'yellow';
  }

  if (currentMode !== wantedMode && Math.random() < profile.reactionChance) {
    cycleSwitcherMode(player2);
    return true;
  }

  if (currentMode === wantedMode && shouldBotUseSpecial(profile)) {
    activateSwitcherAbility(player2);
    return true;
  }

  return false;
}

function updateBotSpecials(profile, absDistance, threat) {
  const closePressure = absDistance < 180;
  const lowHealth = player2.health < player2.maxHealth * 0.45;

  if (
    player2.characterType === 'reflecter' &&
    player2.copycatShieldCooldown === 0 &&
    player2.copycatShieldTimer === 0 &&
    (threat || closePressure) &&
    shouldBotUseSpecial(profile, threat ? 1.25 : 0.75)
  ) {
    activateCopycatShield(player2);
    return true;
  }

  if (
    player2.characterType === 'normal' &&
    isNormalKaioken(player2) &&
    player2.kaiokenTimer > 0 &&
    player2.kaiokenComboCooldown === 0 &&
    player2.kaiokenComboHitsRemaining === 0 &&
    absDistance < 150 &&
    shouldBotUseSpecial(profile, 1.2)
  ) {
    activateKaiokenCombo(player2);
    return true;
  }

  if (
    player2.characterType === 'normal' &&
    isNormalKaioken(player2) &&
    player2.kaiokenCooldown === 0 &&
    player2.kaiokenTimer === 0 &&
    absDistance < 360 &&
    (lowHealth || shouldBotUseSpecial(profile, 0.6))
  ) {
    activateKaioken(player2);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.specialCooldown === 0 &&
    player2.fireBeamCooldown === 0 &&
    absDistance < 620 &&
    shouldBotUseSpecial(profile, 0.45)
  ) {
    launchInfernoSplit(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.fireBeamCooldown === 0 &&
    absDistance < 680 &&
    shouldBotUseSpecial(profile, 0.75)
  ) {
    launchFireBeam(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'fireMaster' &&
    player2.specialCooldown === 0 &&
    absDistance < 540 &&
    shouldBotUseSpecial(profile)
  ) {
    launchFireball(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'tank' &&
    player2.tankShellCooldown === 0 &&
    absDistance < 620 &&
    shouldBotUseSpecial(profile, absDistance > 140 ? 1 : 0.45)
  ) {
    launchTankShell(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'cowboy' &&
    player2.cowboyBurstCooldown === 0 &&
    player2.cowboyBurstShotsRemaining === 0 &&
    absDistance < 740 &&
    shouldBotUseSpecial(profile, absDistance > 120 ? 1 : 0.55)
  ) {
    launchCowboyBurst(player2);
    return true;
  }

  if (
    player2.characterType === 'sorcerer' &&
    player2.sorcererGravityCooldown === 0 &&
    absDistance < 540 &&
    shouldBotUseSpecial(profile, closePressure ? 0.9 : 0.45)
  ) {
    launchSorcererGravityOrb(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'sorcerer' &&
    player2.sorcererOrbCooldown === 0 &&
    absDistance < 780 &&
    shouldBotUseSpecial(profile)
  ) {
    launchSorcererOrb(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoTimeStopCooldown === 0 &&
    absDistance < 360 &&
    shouldBotUseSpecial(profile, closePressure ? 0.6 : 0.25)
  ) {
    activateChronoTimeStop(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoSlowCooldown === 0 &&
    absDistance < 420 &&
    shouldBotUseSpecial(profile, closePressure ? 0.95 : 0.45)
  ) {
    activateChronoSlow(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'chrono' &&
    player2.chronoBladeCooldown === 0 &&
    absDistance < 690 &&
    shouldBotUseSpecial(profile)
  ) {
    launchChronoBlade(player2, player1);
    return true;
  }

  if (updateBotSwitcher(profile, absDistance)) return true;

  if (
    player2.characterType === 'ghost' &&
    player2.ghostPhaseCooldown === 0 &&
    player2.ghostPhaseTimer === 0 &&
    (closePressure || lowHealth || shouldBotUseSpecial(profile, 0.5))
  ) {
    activateGhostPhase(player2);
    return true;
  }

  if (
    player2.characterType === 'divineGeneral' &&
    player2.divineCounterCooldown === 0 &&
    player2.divineAdaptTimer === 0 &&
    (closePressure || getDominantDivineAdaptation(player2)) &&
    shouldBotUseSpecial(profile, closePressure ? 0.85 : 0.45)
  ) {
    activateDivineCounter(player2, player1);
    return true;
  }

  if (
    player2.characterType === 'divineGeneral' &&
    player2.divineAdaptCooldown === 0 &&
    player2.divineAdaptTimer === 0 &&
    (threat || closePressure || lowHealth) &&
    shouldBotUseSpecial(profile, threat ? 1.1 : 0.45)
  ) {
    activateDivineAdaptation(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerRollCooldown === 0 &&
    player2.gamblerLuckCooldown === 0 &&
    player2.gamblerStunTimer === 0 &&
    shouldBotUseSpecial(profile, lowHealth ? 0.75 : 0.35 + player2.gamblerLuckBonus)
  ) {
    activateGamblerLoadedDice(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerLuckCooldown === 0 &&
    player2.gamblerLuckBonus < gamblerLuckCap &&
    (lowHealth || shouldBotUseSpecial(profile, 0.45))
  ) {
    activateGamblerLuckIncrementer(player2);
    return true;
  }

  if (
    player2.characterType === 'gambler' &&
    player2.gamblerRollCooldown === 0 &&
    shouldBotUseSpecial(profile, 0.35 + player2.gamblerLuckBonus)
  ) {
    activateGamblerRoll(player2);
    return true;
  }

  return false;
}

function updateBotMovement(profile, distanceX, absDistance) {
  const attackRange = getBotAttackRange();
  const preferredRange = getBotPreferredRange();
  const moveSpeed = getBotMoveSpeed();
  const canPlaySpacing = Math.random() < profile.spacingChance;
  const rangedBot =
    player2.characterType === 'cowboy' ||
    player2.characterType === 'fireMaster' ||
    player2.characterType === 'sorcerer' ||
    player2.characterType === 'chrono';

  if (rangedBot && absDistance < preferredRange && canPlaySpacing) {
    player2.velocity.x = distanceX > 0 ? -moveSpeed : moveSpeed;
    return;
  }

  if (absDistance > Math.max(attackRange, preferredRange) || absDistance > attackRange + 24) {
    player2.velocity.x = distanceX > 0 ? moveSpeed : -moveSpeed;
    return;
  }

  player2.velocity.x = 0;

  if (botAttackCooldown === 0 && absDistance <= attackRange) {
    const shouldUseStrongAttack =
      player2.strongAttackCooldown === 0 &&
      Math.random() < profile.strongAttackChance;
    player2.attack(shouldUseStrongAttack);
    botAttackCooldown = getDebugCooldown(profile.attackDelay, player2);
  }
}

function updateBotJumping(profile) {
  if (player2.velocity.y !== 0) return;

  const playerAbove = player1.position.y + player1.height < player2.position.y;
  if (playerAbove && Math.random() < profile.reactionChance) {
    player2.velocity.y = getDebugJumpSpeed(-13, player2);
  }
}

function updateBot() {
  if (!botEnabled || !gameStarted || gameOver) return;
  if (!canFighterAct(player2)) {
    player2.velocity.x = 0;
    return;
  }
  if (player2.gamblerStunTimer > 0) {
    player2.velocity.x = 0;
    return;
  }

  if (botAttackCooldown > 0) {
    botAttackCooldown -= 1;
  }

  const profile = getBotDifficultyProfile();
  const playerCenter = player1.position.x + player1.width / 2;
  const botCenter = player2.position.x + player2.width / 2;
  const distanceX = playerCenter - botCenter;
  const absDistance = Math.abs(distanceX);
  const threat = getIncomingBotProjectileThreat(profile);

  if (Math.random() < profile.reactionChance) {
    updateBotSpecials(profile, absDistance, threat);
  }

  if (dodgeBotThreat(threat, profile)) {
    updateBotJumping(profile);
    return;
  }

  updateBotMovement(profile, distanceX, absDistance);
  updateBotJumping(profile);
}

function startGame() {
  if (selectedMap === 'darkRoom') {
    unlockAchievement('darkRoom');
  }
  stopMenuMusic();
  stopJackpotTrack();
  mainMenu.classList.add('hidden');
  document.body.classList.remove('menu-open');
  resetFight();
}

function startOldDaysGame() {
  deactivateBlindMode();
  resetDebugSettings();
  player1.setCharacterType('normal');
  player2.setCharacterType('normal');
  selectedMap = 'alpha';
  characterSelectionPlayer = 1;
  startGame();
}

function getSelectableCharacterTypes() {
  return characterTypes.filter(
    (characterType) =>
      (!hiddenCharacterTypes.includes(characterType) || (characterType === 'divineGeneral' && isDivineGeneralUnlocked())) &&
      (characterType !== 'ghost' || isGhostUnlocked()) &&
      (characterType !== 'divineGeneral' || isDivineGeneralUnlocked())
  );
}

function getVisibleStatisticsCharacterTypes() {
  return characterTypes.filter(
    (characterType) => !hiddenCharacterTypes.includes(characterType) || (characterType === 'divineGeneral' && isDivineGeneralUnlocked())
  );
}

function selectCharacter(characterType) {
  const selectedCharacterType = blindMode ? blindCharacterMix[characterType] || characterType : characterType;
  if (selectedCharacterType === 'ghost' && !isGhostUnlocked()) return;
  if (selectedCharacterType === 'divineGeneral' && !isDivineGeneralUnlocked()) return;
  if (characterSelectionPlayer === 1) {
    player1.setCharacterType(selectedCharacterType);
    if (blindMode) applyBlindFighterLook(player1);
    characterSelectionPlayer = 2;
    characterSelectTitle.innerText = 'Personaje Jugador 2';
    characterScreen.classList.add('selecting-player2');
    return;
  }

  player2.setCharacterType(selectedCharacterType);
  if (blindMode) applyBlindFighterLook(player2);
  openMapSelect();
}

function selectRandomCharacter() {
  const selectableCharacters = getSelectableCharacterTypes();
  if (selectableCharacters.length === 0) return;

  const randomCharacter = selectableCharacters[Math.floor(Math.random() * selectableCharacters.length)];
  selectCharacter(randomCharacter);
}

function openMapSelect() {
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  mapScreen.classList.remove('hidden');
}

function closeMapSelect() {
  mapScreen.classList.add('hidden');
  characterScreen.classList.remove('hidden');
  characterSelectionPlayer = 2;
  characterSelectTitle.innerText = 'Personaje Jugador 2';
  characterScreen.classList.add('selecting-player2');
}

function selectMap(mapName) {
  selectedMap = mapName;
  mapScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  startGame();
}

function openCharacterSelect() {
  characterSelectionPlayer = 1;
  characterSelectTitle.innerText = 'Personaje Jugador 1';
  characterScreen.classList.remove('selecting-player2');
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  characterScreen.classList.remove('hidden');
}

function closeCharacterSelect() {
  deactivateBlindMode();
  characterSelectionPlayer = 1;
  characterScreen.classList.remove('selecting-player2');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSettings() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  settingsScreen.classList.remove('hidden');
}

function closeSettings() {
  settingsScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  guideScreen.classList.remove('hidden');
}

function closeGuide() {
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openAchievements() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  achievementsScreen.classList.remove('hidden');
}

function closeAchievements() {
  achievementsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openStatistics() {
  syncStatisticsUI();
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  statsScreen.classList.remove('hidden');
}

function closeStatistics() {
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openInfo() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  infoScreen.classList.remove('hidden');
}

function closeInfo() {
  infoScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openOpinion() {
  if (!codexOpinionUnlocked) return;

  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  opinionScreen.classList.remove('hidden');
}

function closeOpinion() {
  opinionScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openDebug() {
  unlockAchievement('debug');
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  debugScreen.classList.remove('hidden');
}

function closeDebug() {
  debugScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openOldDays() {
  unlockAchievement('oldDays');
  deactivateBlindMode();
  titleScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  oldDaysScreen.classList.remove('hidden');
}

function closeOldDays() {
  oldDaysScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSecretGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  secretGuideScreen.classList.remove('hidden');
}

function closeSecretGuide() {
  secretGuideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openSecretCharacters() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  eventGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.remove('hidden');
}

function closeSecretCharacters() {
  secretCharactersScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function openEventGuide() {
  titleScreen.classList.add('hidden');
  oldDaysScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  mapScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  guideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  opinionScreen.classList.add('hidden');
  debugScreen.classList.add('hidden');
  secretGuideScreen.classList.add('hidden');
  secretCharactersScreen.classList.add('hidden');
  eventGuideScreen.classList.remove('hidden');
}

function closeEventGuide() {
  eventGuideScreen.classList.add('hidden');
  achievementsScreen.classList.add('hidden');
  statsScreen.classList.add('hidden');
  infoScreen.classList.add('hidden');
  titleScreen.classList.remove('hidden');
}

function syncDebugControls() {
  debugControls.forEach(({ input, output, setting }) => {
    input.value = debugSettings[setting];
    output.innerText = formatDebugMultiplier(debugSettings[setting]);
  });
  debugAffectedCharacterInputs.forEach((input) => {
    input.checked = debugAffectedCharacters[input.dataset.debugCharacter] !== false;
  });
  if (debugAffectAllInput) {
    debugAffectAllInput.checked = Array.from(debugAffectedCharacterInputs).every((input) => input.checked);
  }
}

function applyDebugSettings() {
  player1.setMaxHealth(player1.baseMaxHealth);
  player2.setMaxHealth(player2.baseMaxHealth);
  updateHealthBars();
  syncDebugControls();
}

function resetDebugSettings() {
  Object.assign(debugSettings, defaultDebugSettings);
  Object.keys(debugAffectedCharacters).forEach((characterType) => {
    debugAffectedCharacters[characterType] = true;
  });
  applyDebugSettings();
}

function toggleSimpleTop() {
  const showingSimple = !categoryTopSimple.classList.contains('hidden');
  categoryTopSimple.classList.toggle('hidden', showingSimple);
  categoryTopDetailed.classList.toggle('hidden', !showingSimple);
  simpleTopButton.innerText = showingSimple ? 'Version simplificada' : 'Version detallada';
}

function updateBotSetting() {
  botEnabled = botToggle.checked;
  player2Instructions.innerText = botEnabled
    ? 'Jugador 2: bot activado'
    : 'Jugador 2: flechas mover/saltar, flecha abajo atacar, Shift golpe fuerte, / especial 1, . especial 2';

  applyBotDifficulty();

  if (botEnabled) {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
  }
}

function updateBotDifficulty() {
  const selectedDifficulty = document.querySelector('input[name="botDifficulty"]:checked');
  botDifficulty = selectedDifficulty ? selectedDifficulty.value : 'medium';
  applyBotDifficulty();
}

function applyBotDifficulty() {
  const difficultySettings = botDifficultySettings[botDifficulty];
  if (botEnabled) {
    player2.setMaxHealth(
      player2.characterType === 'tank' ||
      player2.characterType === 'cowboy' ||
      player2.characterType === 'reflecter' ||
      player2.characterType === 'switcher' ||
      player2.characterType === 'sorcerer' ||
      player2.characterType === 'gambler' ||
      player2.characterType === 'chrono' ||
      player2.characterType === 'ghost' ||
      player2.characterType === 'divineGeneral'
        ? getCharacterMaxHealth(player2.characterType, player2)
        : difficultySettings.maxHealth
    );
  } else {
    player2.setMaxHealth(getCharacterMaxHealth(player2.characterType, player2));
  }
  updateHealthBars();
}

function getCharacterMaxHealth(characterType, fighter = null) {
  if (characterType === 'fireMaster') return 120;
  if (characterType === 'tank') return isTankIronWall(fighter) ? 260 : 200;
  if (characterType === 'cowboy') return cowboyHealth;
  if (characterType === 'reflecter') return getReflecterHealth(fighter);
  if (characterType === 'switcher') return switcherHealth;
  if (characterType === 'sorcerer') return sorcererHealth;
  if (characterType === 'gambler') return gamblerHealth;
  if (characterType === 'chrono') return chronoHealth;
  if (characterType === 'ghost') return ghostHealth;
  if (characterType === 'divineGeneral') return getDivineMaxHealth(fighter);
  return 100;
}

function updatePlayerColor(player, color, cssVariable) {
  player.setColor(color);
  document.documentElement.style.setProperty(cssVariable, color);
}

player1ColorInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updatePlayerColor(player1, input.value, '--player1');
  });
});

player2ColorInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updatePlayerColor(player2, input.value, '--player2');
  });
});

botDifficultyInputs.forEach((input) => {
  input.addEventListener('change', updateBotDifficulty);
});

if (languageSelect) {
  languageSelect.addEventListener('change', () => {
    currentLanguage = supportedLanguages.includes(languageSelect.value) ? languageSelect.value : 'es';
    saveLanguageSetting();
    applyLanguage();
  });
}

[
  { input: masterVolumeControl, output: masterVolumeValue, setting: 'master' },
  { input: musicVolumeControl, output: musicVolumeValue, setting: 'music' },
  { input: sfxVolumeControl, output: sfxVolumeValue, setting: 'sfx' },
].forEach(({ input, output, setting }) => {
  if (!input || !output) return;
  input.addEventListener('input', () => {
    audioSettings[setting] = clampAudioVolume(input.value);
    output.innerText = formatAudioVolume(audioSettings[setting]);
    saveAudioSetting(setting);
    applyAudioSettings();
  });
});

debugControls.forEach(({ input, output, setting }) => {
  input.addEventListener('input', () => {
    debugSettings[setting] = Number(input.value);
    output.innerText = formatDebugMultiplier(debugSettings[setting]);
    applyDebugSettings();
  });
});

if (debugAffectAllInput) {
  debugAffectAllInput.addEventListener('change', () => {
    debugAffectedCharacterInputs.forEach((input) => {
      input.checked = debugAffectAllInput.checked;
      debugAffectedCharacters[input.dataset.debugCharacter] = input.checked;
    });
    applyDebugSettings();
  });
}

debugAffectedCharacterInputs.forEach((input) => {
  input.addEventListener('change', () => {
    debugAffectedCharacters[input.dataset.debugCharacter] = input.checked;
    if (debugAffectAllInput) {
      debugAffectAllInput.checked = Array.from(debugAffectedCharacterInputs).every((targetInput) => targetInput.checked);
    }
    applyDebugSettings();
  });
});

mapOptionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectMap(button.dataset.map);
  });
});

mainMenu.addEventListener('click', handleMenuAudioInteraction);
mainMenu.addEventListener('pointerover', (event) => {
  const hoveredButton = event.target && event.target.closest ? event.target.closest('button') : null;
  if (hoveredButton && !hoveredButton.contains(event.relatedTarget)) {
    playSound('menuMove');
  }
});

playButton.addEventListener('click', openCharacterSelect);
oldDaysPlayButton.addEventListener('click', startOldDaysGame);
oldDaysBackButton.addEventListener('click', closeOldDays);
normalCharacterButton.addEventListener('click', () => selectCharacter('normal'));
fireMasterCharacterButton.addEventListener('click', () => selectCharacter('fireMaster'));
tankCharacterButton.addEventListener('click', () => selectCharacter('tank'));
cowboyCharacterButton.addEventListener('click', () => selectCharacter('cowboy'));
reflecterCharacterButton.addEventListener('click', () => selectCharacter('reflecter'));
switcherCharacterButton.addEventListener('click', () => selectCharacter('switcher'));
sorcererCharacterButton.addEventListener('click', () => selectCharacter('sorcerer'));
gamblerCharacterButton.addEventListener('click', () => selectCharacter('gambler'));
chronoCharacterButton.addEventListener('click', () => selectCharacter('chrono'));
ghostCharacterButton.addEventListener('click', () => selectCharacter('ghost'));
divineGeneralCharacterButton.addEventListener('click', () => selectCharacter('divineGeneral'));
randomCharacterButton.addEventListener('click', selectRandomCharacter);
characterBackButton.addEventListener('click', closeCharacterSelect);
mapBackButton.addEventListener('click', closeMapSelect);
settingsButton.addEventListener('click', openSettings);
guideButton.addEventListener('click', openGuide);
achievementsButton.addEventListener('click', openAchievements);
statsButton.addEventListener('click', openStatistics);
infoButton.addEventListener('click', openInfo);
opinionButton.addEventListener('click', openOpinion);
backButton.addEventListener('click', closeSettings);
guideBackButton.addEventListener('click', closeGuide);
achievementsBackButton.addEventListener('click', closeAchievements);
statsBackButton.addEventListener('click', closeStatistics);
statsResetButton.addEventListener('click', resetPersistentStatistics);
infoBackButton.addEventListener('click', closeInfo);
opinionBackButton.addEventListener('click', closeOpinion);
debugBackButton.addEventListener('click', closeDebug);
debugResetButton.addEventListener('click', resetDebugSettings);
secretGuideBackButton.addEventListener('click', closeSecretGuide);
secretCharactersBackButton.addEventListener('click', closeSecretCharacters);
eventGuideBackButton.addEventListener('click', closeEventGuide);
simpleTopButton.addEventListener('click', toggleSimpleTop);
botToggle.addEventListener('change', updateBotSetting);
restartButton.addEventListener('click', resetFight);
menuButton.addEventListener('click', returnToMenu);

loadAudioSettings();
syncAudioSettingsUI();
syncDebugControls();
applyLanguage();
syncCodexOpinionUI();
migrateUnlocksFromExistingAchievements();
syncAchievementsUI();
syncStatisticsUI();
updateHealthBars();
animate();
