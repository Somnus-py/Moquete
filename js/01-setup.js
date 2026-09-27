// Moquete - Canvas, constantes, estado global, referencias del DOM, guardado, monedas y logros
// (parte 1 de 10; los archivos se cargan en orden desde index.html)

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
let omegaBattleTrack = null;
const jackpotTrackSource = 'assets/audio/jackpot.mp3';
const omegaBattleTrackSource = 'assetsaudio/34.wav';
const scammerBattleTrackSource = encodeURI('assetsaudio/NOWS YOUR CHANCE TO BE A.mp3');
let scammerBattleTrack = null;
const jesterDialogTrackSource = encodeURI('assetsaudio/Gallery.mp3');
const jesterBattleTrackSource = encodeURI('assetsaudio/THE WORLD REVOLVING.mp3');
const jesterTracks = { dialog: null, battle: null };
const jesterDialogCrossfadeSeconds = 0.3;
const jesterDialogLoop = { players: [], active: 0, fadeStart: null, timer: null, buffer: null, bufferState: 'idle', source: null, gain: null };
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
const basicAttackCooldown = 8;
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
const superFireMasterHealth = 160;
const superFireballDamage = 25;
const superFireBeamDamage = 85;
const superFireKamehamehaChargeDuration = 300;
const superFireKamehamehaDuration = 300;
const superFireKamehamehaSpeed = playerMoveSpeed * 10;
const superFireKamehamehaTickDamage = 5;
const superFireKamehamehaTickInterval = 3;
const lightWarriorBeamChargeDuration = 240;
const lightWarriorBeamDuration = 300;
const lightWarriorBeamTickDamage = 8;
const lightWarriorBeamTickInterval = 3;
const superFireMasterUnlockTimeMs = 45000;
const superFireMasterUnlockHealth = 80;
const cowboyHealth = 80;
const deadeyeCowboyHealth = 110;
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
const upgradedReflecterDamage = 15;
const upgradedReflecterShieldDuration = 300;
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
const switcherModeCooldown = 10;
const gamblerHealth = 150;
const gamblerRollCooldown = 120;
const gamblerLuckCooldown = 180;
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
const chronoSlowCooldown = 540;
const chronoSlowDuration = 300;
const chronoSlowFactor = 0.65;
const chronoSlowRadius = 390;
const chronoSlowLockDuration = 90;
const chronoSlowPull = 2.2;
const chronoMarkDuration = 360;
const chronoMarkDamage = 28;
const chronoTimeStopDuration = 150;
const chronoTimeStopCooldown = 1200;
const qfComboWindow = 110;
const ghostHealth = 60;
const ghostDamage = 1;
const ghostPhaseDuration = 300;
const ghostPhaseCooldown = 150;
const ghostPhaseContactDamage = 1.25;
const ghostPhaseContactInterval = 2;
const ghostPhaseSpeedMultiplier = 1.50;
const lightWarriorHealth = 160;
const lightWarriorDamage = 10;
const lightWarriorShotDamage = 25;
const lightWarriorOmegaHealth = 2000;
const lightWarriorOmegaDamage = 15;
const lightWarriorOmegaDamageMultiplier = 1.25;
const lightWarriorOmegaTransformationDuration = 600;
const lightWarriorOmegaAnnouncementTimer = 190;
const lightWarriorOmegaActivationDelay = 120;
const lightWarriorOmegaStateDuration = 3600;
const lightWarriorOmegaTransformationHealth = 2000;
const lightWarriorOmegaFlashDuration = 34;
const lightWarriorOmegaFlightUsesMax = 10;
const lightWarriorOmegaFlightChargeDuration = 90;
const lightWarriorOmegaFlightDuration = 110;
const lightWarriorOmegaFlightDamage = 500;
const lightWarriorShotSpeed = playerMoveSpeed * 6.4;
const lightWarriorBurstShots = 5;
const lightWarriorBurstInterval = 7;
const lightWarriorBurstCooldown = 720;
const lightWarriorSpeedDuration = 360;
const lightWarriorSpeedCooldown = 600;
const lightWarriorSpeedMultiplier = 2.25;
const lightWarriorHealAmount = 35;
const lightWarriorSolarFlashDamage = 40;
const lightWarriorSolarFlashRange = 165;
const lightWarriorSolarFlashCooldown = 500;
const lightWarriorSolarFlashVisualDuration = 24;
const lightWarriorRadiantPunchMinDamage = 45;
const lightWarriorRadiantPunchMaxDamage = 170;
const lightWarriorRadiantPunchMaxCharge = 215;
const lightWarriorRadiantPunchReadyDuration = 360;
const lightWarriorRadiantPunchCooldown = 800;
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
const divineWorldCutChargeDuration = 600;
const divineWorldCutCooldown = 1200;
const divineWorldCutDamagePerStack = 100;
const divineWorldCutSpeed = playerMoveSpeed * 10;
const divineWorldCutPhrases = [
  'Antes del primer reino,',
  'mi espada aprendio tu forma;',
  'cuando el juicio despierte,',
  'el mundo sera cortado.',
];
const divineFullAdaptTypes = [
  'melee',
  'meleeCombo',
  'mirrorStrike',
  'fireProjectile',
  'fireBeam',
  'tankShell',
  'bullet',
  'lightShot',
  'lightFlash',
  'radiantPunch',
  'arcaneOrb',
  'arcaneSecret',
  'temporalBlade',
  'temporalMark',
  'spiritPhase',
  'luck',
  'prismStrike',
  'divineWorldCut',
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
const characterTypes = ['normal', 'fireMaster', 'tank', 'cowboy', 'reflecter', 'switcher', 'sorcerer', 'gambler', 'chrono', 'ghost', 'lightWarrior', 'divineGeneral', 'monkey'];
const hiddenCharacterTypes = ['divineGeneral', 'monkey'];
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
  restoreAttackSpam: false,
};
const debugSettings = { ...defaultDebugSettings };
const achievementStorageKey = 'moqueteAchievements';
const coinStorageKey = 'moqueteCoins';
const normalArcadeProgressStorageKey = 'moqueteNormalArcadeProgress';
const fireArcadeProgressStorageKey = 'moqueteFireArcadeProgress';
const gamblerArcadeProgressStorageKey = 'moqueteGamblerArcadeProgress';
const gamblerArcadeLevelCount = 6;
const gamblerArcadePlayableLevels = 6;
const gamblerArcadeLuckPerLevel = 0.1;
const reflecterArcadeProgressStorageKey = 'moqueteReflecterArcadeProgress';
const reflecterArcadeLevelCount = 6;
const reflecterArcadePlayableLevels = 4;
const robotGlitchSparkColors = ['#ffee58', '#4fc3f7', '#ffffff'];
const robotDischargeDamage = 12;
const robotRivetDamage = 11;
const robotTickBombDamage = 16;
const robotScrapDamage = 7;
const robotChargeDamage = 15;
const robotChargeSpeed = 9;
const robotChargeFrames = 48;
let robotShots = [];
const hybridEnemyTypes = {
  armoredCowboy: {
    name: 'Vaquero Blindado',
    baseType: 'cowboy',
    health: 95,
    color: '#8d6e63',
    abilities: ['tankShell'],
    cooldown: 360,
  },
  fireSorcerer: {
    name: 'Mago Ardiente',
    baseType: 'sorcerer',
    health: 120,
    abilities: ['fireball'],
    cooldown: 330,
  },
  timeMirror: {
    name: 'Espejo Temporal',
    baseType: 'reflecter',
    health: 125,
    abilities: ['chronoBlade'],
    cooldown: 320,
  },
  chimera: {
    name: 'Quimera',
    baseType: 'tank',
    health: 160,
    abilities: ['fireball', 'chronoBlade'],
    cooldown: 260,
  },
  // Chapter 4: defective robots left behind in Tempus Corp.'s abandoned factory.
  // robot: true -> own body design (model), own abilities and random "glitches" that freeze them for a moment.
  // They use Normal as a plain base so no other character's kit or look leaks in.
  scrapDrone: {
    name: 'Dron de Chatarra',
    baseType: 'normal',
    model: 'drone',
    health: 80,
    color: '#78909c',
    abilities: ['discharge'],
    cooldown: 330,
    robot: true,
    glitchEvery: [220, 380],
    glitchFrames: 50,
  },
  rustyGuard: {
    name: 'Guardia Oxidado',
    baseType: 'normal',
    model: 'guard',
    health: 135,
    color: '#8d6e63',
    abilities: ['rivetShot', 'shieldCharge'],
    cooldown: 280,
    damageMultiplier: 1.2,
    size: { width: 82, height: 148 },
    robot: true,
    glitchEvery: [260, 420],
    glitchFrames: 45,
  },
  clockworkReject: {
    name: 'Prototipo T-0 (fallido)',
    baseType: 'normal',
    model: 'clockwork',
    health: 115,
    color: '#3949ab',
    abilities: ['tickBomb', 'rewind'],
    cooldown: 300,
    robot: true,
    glitchEvery: [240, 400],
    glitchFrames: 48,
  },
  overloadUnit: {
    name: 'Unidad Sobrecargada',
    baseType: 'normal',
    model: 'overload',
    health: 125,
    color: '#455a64',
    abilities: ['discharge', 'rivetShot'],
    cooldown: 290,
    robot: true,
    glitchEvery: [260, 440],
    glitchFrames: 40,
  },
  defectiveAssembler: {
    name: 'Ensambladora Defectuosa',
    baseType: 'normal',
    model: 'assembler',
    health: 240,
    color: '#546e7a',
    abilities: ['scrapBarrage', 'magnetPull', 'dualDischarge', 'discharge'],
    cooldown: 195,
    damageMultiplier: 1.4,
    size: { width: 116, height: 182 },
    scrapPieces: 5,
    robot: true,
    glitchEvery: [460, 660],
    glitchFrames: 32,
  },
};
const gamblerArcadeLevels = {
  1: { enemies: ['armoredCowboy'], difficulties: ['easy'] },
  2: { enemies: ['armoredCowboy', 'fireSorcerer'], difficulties: ['medium', 'medium'] },
  3: { enemies: ['fireSorcerer', 'timeMirror'], difficulties: ['medium', 'hard'] },
  4: { enemies: ['timeMirror', 'armoredCowboy', 'chimera'], difficulties: ['medium', 'hard', 'hard'] },
};
const reflecterArcadeLevels = {
  1: { enemies: ['scrapDrone'], difficulties: ['easy'] },
  2: { enemies: ['scrapDrone', 'rustyGuard'], difficulties: ['medium', 'medium'] },
  3: { enemies: ['clockworkReject', 'overloadUnit'], difficulties: ['medium', 'hard'] },
  4: { enemies: ['rustyGuard', 'overloadUnit', 'defectiveAssembler'], difficulties: ['medium', 'hard', 'hard'] },
};
const hybridTankShellDamage = 16;
const hybridFireballDamageMultiplier = 0.7;
const normalArcadeLevelButtons = document.querySelectorAll('[data-arcade-level]');
const normalArcadeEnemyName = 'Bruto Gris';
const normalArcadeEnemyHealth = 65;
const normalArcadeEnemyDamageMultiplier = 0.65;
const fireArcadeBruteName = 'Brutos Invernales';
const fireArcadeBruteHealthByLevel = [0, 78, 108, 115];
const fireArcadeBruteDamageMultiplierByLevel = [0, 0.78, 1.05, 1.08];
const normalArcadeBossName = 'Jefe de la Banda';
const fireArcadeBossName = 'Ice Master';
const fireArcadeMiniBossName = 'Maton Helado';
const fireArcadeMiniBossHealth = 115;
const fireArcadeMiniBossDamageMultiplier = 1.1;
const fireArcadeMiniBossDamageTakenMultiplier = 0.75;
const icedThugFrostFieldCooldown = 600;
const icedThugFrostFieldDuration = 270;
const icedThugFrostFieldRadius = 150;
const icedThugFrostSlowFactor = 0.7;
const icedThugFrostVulnerability = 1.25;
const icedThugFrostLingerDuration = 30;
const icedThugBladeDamage = 12;
const icedThugBladeSpeed = playerMoveSpeed * 3;
const icedThugBladeCooldown = 360;
const icedThugBladeSlowDuration = 110;
const iceMasterHealth = 130;
const scammerHealth = 185;
const scammerDamageMultiplier = 1.4;
const scammerOfferDamage = 10;
const scammerOfferCooldown = 300;
const scammerOfferLuckSteal = 0.15;
const scammerOfferHeal = 6;
const scammerItemDamage = 15;
const scammerItemLuckSteal = 0.1;
const scammerItemSpeed = 13;
const scammerItemCooldown = 420;
const scammerSlotCooldown = 720;
const scammerSlotLandingDamage = 12;
const scammerSlotEffectDamage = 15;
const scammerSlotEffectHeal = 15;
const scammerSlotGamblerLuckLoss = 0.1;
const scamDebuffDuration = 240;
const scamWeakDamageMultiplier = 0.8;
const scamWeakSpeedMultiplier = 0.85;
const scamVulnerableMultiplier = 1.2;
let scamSlotMachines = [];
const scammerRageHealth = 260;
const shadowJesterHealth = 360;
const jesterSuitDamage = 8;
const jesterSuitCooldown = 300;
const jesterChaosCooldown = 480;
const jesterBombSuitDamage = 7;
const jesterScytheDamage = 16;
const jesterScytheCooldown = 540;
const jesterIntroIdleFrames = 720;
const jesterRingUnlockHealth = 300;
const jesterStormUnlockHealth = 200;
const jesterRingSuitCount = 12;
const jesterRingSuitDamage = 6;
const jesterRingHitGrace = 14;
const jesterStormHitGrace = 50;
const jesterRingCooldown = 600;
const jesterStormScytheDamage = 8;
const jesterStormCooldown = 840;
const jesterStormCycles = 4;
const jesterStormCycleFrames = 72;
const jesterFinalUnlockHealth = 50;
const jesterTiredHealth = 100;
const jesterFinalHealthAfter = 5;
const jesterFinalDamagePercent = 0.1;
const jesterFinalIntroFrames = 70;
const jesterFinalRainFrames = 1200;
const jesterFinalGiantFrames = 170;
const jesterFinalWhiteFrames = 60;
const jesterFinal = {
  active: false,
  frame: 0,
  caster: null,
  target: null,
  soul: { x: 0, y: 0, width: 16, height: 40 },
  scythes: [],
  flashes: [],
  invulnerable: 0,
  nextSpawn: 0,
  sweep: 0,
  giant: null,
  shake: 0,
  hits: 0,
  saved: null,
};
let jesterWhiteFade = 0;
const versusCityCorruptionMs = 120000;
let jesterOutroPlayed = false;
let jesterLosePlayed = false;
const jesterImpatientDelay = 20000;
const jesterAngryDelay = 10000;
let jesterImpatientTimer = null;
let jesterScreenCrack = null;
let jesterPressOverlay = null;
const jesterAngryLines = [
  { speaker: 'jester', text: 'OTRA VEZ QUIETO?! NO... ME... IGNORES!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'jester', text: 'COBARDE! COBARDE, COBARDE, COBARDE, COBARDE!', mood: 'crazy', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'jester', text: 'QUE PASA? TE DA MIEDO JUGAR CONMIGO? NO MUERDO... MUCHO. JA JA!', mood: 'crazy' },
  { speaker: 'jester', text: 'BIEN! SI VOS NO APRETAS ESE BOTON...', mood: 'angry' },
  { speaker: 'jester', text: 'LO APRIETO YO!!!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
];
const jesterImpatientLines = [
  { speaker: 'jester', text: 'EY... EY, EY, EY! QUE ESTAS HACIENDO?!', emote: { who: 'scammer', symbol: '?!' } },
  { speaker: 'jester', text: 'POR QUE TE QUEDAS AHI QUIETO MIRANDO LA PANTALLA? EL SHOW NO TERMINO!', mood: 'crazy', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'jester', text: 'LEVANTATE, APOSTADOR! TODAVIA QUIERO SEGUIR DIVIRTIENDOME! OTRA RONDA! OTRA RONDA!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'jester', text: 'VAMOS... APRETA ESE BOTON DE REINICIAR. TE ESTOY ESPERANDO... JA JA JA!', emote: { who: 'scammer', symbol: '...' } },
];
const jesterLoseSplitHealth = 180;
const jesterLoseBoredLines = [
  { speaker: 'jester', text: 'EH? YA? YA TE CAISTE? TAN RAPIDO?', emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'jester', text: 'QUE DECEPCION... QUE ABURRIDO, ABURRIDO, ABURRIDO! PENSE QUE IBAS A SER MI JUGUETE FAVORITO!', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'gambler', text: 'N-no... todavia... puedo...', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'jester', text: 'SHHH. LOS JUGUETES ROTOS NO HABLAN.' },
  { speaker: 'jester', text: 'POR EL PODER DE LAS CARTAS... DEL CAOS... Y DE LA RISA ETERNA...', mood: 'crazy' },
  { speaker: 'jester', text: 'YO TE... EXORCISOOOOOOO!!!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
];
const jesterLoseFinalLines = [
  { speaker: 'jester', text: 'JA JA! NO PELEASTE NADA MAL, APOSTADOR! NADA, NADA MAL!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'jester', text: 'ME DIVERTI MUCHO... PERO NO LO SUFICIENTE! NO, NO, NO!', mood: 'crazy' },
  { speaker: 'gambler', text: 'Q-que... que vas a hacer...?', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'jester', text: 'EL ACTO FINAL! UN SHOW PRIVADO, SOLO PARA VOS! JA JA JA JA!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
];
let gamblerCityCorruptionOverride = null;
const jesterOutroLines = [
  { speaker: 'jester', text: 'JA... JA JA... INCREIBLE! INCREIBLE, INCREIBLE, INCREIBLE!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'jester', text: 'NADIE HABIA SOBREVIVIDO A MI ACTO FINAL! QUE REFLEJOS! QUE MANOS! QUE HABILIDAD, APOSTADOR!', mood: 'crazy' },
  { speaker: 'gambler', text: 'S-se termino...?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'jester', text: 'HACIA SIGLOS QUE NO ME DIVERTIA TANTO! GRACIAS, GRACIAS, GRACIAS POR EL SHOW!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'jester', text: 'ESTA BIEN... TE DEJO IR. GANASTE LA PARTIDA, Y UN TRATO ES UN TRATO.' },
  { speaker: 'jester', text: 'PERO NO LO OLVIDES, APOSTADOR...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'jester', text: 'YO REPARTO LAS CARTAS. PUEDO HACER LO QUE SEA... CUANDO SEA... DONDE SEA. JA JA JA JA!', mood: 'crazy', emote: { who: 'scammer', symbol: '?!' } },
  { speaker: 'gambler', text: 'E-espera...!', emote: { who: 'gambler', symbol: '!' } },
];
const jesterCityLines = [
  { speaker: 'gambler', text: '...Ciudad Cobalto?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'gambler', text: 'Esta toda deformada... Asi que no fue un sueno.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'gambler', text: '(Puede hacer lo que sea... Ojala nunca vuelva a cruzarme con ese bufon.)' },
];
const jesterTiredLines = [
  { speaker: 'jester', text: 'BASTA... BASTA, BASTA, BASTA! SUFICIENTE!', mood: 'crazy', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'jester', text: 'JA... JA... QUE RARO... MIS CASCABELES PESAN TANTO... ESTOY... CANSADO?', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'gambler', text: 'S-se acabo, Jester... Ya no podes seguir.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'jester', text: 'ACABAR? NO, NO, NO, NO! NINGUN SHOW TERMINA SIN SU GRAN FINAL!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'jester', text: 'ME QUEDA UN ULTIMO TRUCO... EL ACTO FINAL! MI MEJOR NUMERO! PREPARATE, APOSTADOR! JA JA JA JA!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
];
let jesterSuits = [];
let jesterBombs = [];
let jesterScythes = [];
let jesterAfterimages = [];
let jesterIntroDone = false;
const jesterLuckSteal = 0.5;
const jesterLuckStealDuration = 200;
const jesterLuckStealStart = 60;
const jesterLuckStealHit = 110;
let jesterLuckStealTimer = 0;
const jesterIntro = { active: false, phase: 'idle', frame: 0, progress: 0, shake: 0 };
let realityShards = null;
let fractureCanvas = null;
const jesterCutsceneLines = [
  { speaker: 'jester', text: 'JA JA JA JA! BIENVENIDO, BIENVENIDO! POR FIN LLEGO MI PIEZA FAVORITA AL TABLERO!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'gambler', text: 'Q-que... que es esto?! La ciudad desaparecio... Q-quien sos vos?!', emote: { who: 'gambler', symbol: '!!' }, gamblerStep: -50 },
  { speaker: 'jester', text: 'SOY SHADOW JESTER! EL QUE REPARTE LAS CARTAS! EL DUENO DE ESTE HERMOSO, HERMOSO JUEGO!', mood: 'crazy' },
  { speaker: 'gambler', text: 'J-juego?... Todo se hizo pedazos... V-vos rompiste la ciudad?!', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'jester', text: 'ROMPER? NO, NO, NO! LA MEZCLE! COMO UN MAZO! BARAJAR ES DIVERTIDO! BARAJAR ES VIVIR!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'jester', text: 'LOS LUCHADORES ERAN TAN ABURRIDOS... SIEMPRE LOS MISMOS GOLPES, LAS MISMAS CARAS! ASI QUE LOS JUNTE! UN VAQUERO CON UN TANQUE! UN MAGO CON FUEGO! JA JA JA!', mood: 'crazy' },
  { speaker: 'jester', text: 'CADA MEZCLA ERA UNA CARTA NUEVA! Y VOS, APOSTADOR, IBAS GANANDO RONDA TRAS RONDA! QUE EMOCION! QUE DIVERSION!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'gambler', text: '(Esta completamente loco...) E-esas eran personas... n-no eran cartas...', emote: { who: 'gambler', symbol: '...' }, gamblerStep: -30 },
  { speaker: 'jester', text: 'TODO ES UN JUEGO! Y LOS JUEGOS NO TERMINAN HASTA QUE ALGUIEN DEJA DE REIR!', mood: 'crazy', emote: { who: 'scammer', symbol: '?!' } },
  { speaker: 'gambler', text: '(Me tiemblan las manos... pero si no lo freno yo, nadie lo va a hacer.)', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'gambler', text: 'E-esta bien... Vamos a jugar. P-pero se termina hoy!', emote: { who: 'gambler', symbol: '!' }, brave: true, gamblerStep: 40 },
  { speaker: 'jester', text: 'UN RETO?! DE VERDAD?! OH, OH, OH! ESTO SI VA A SER DIVERTIDO! CAOS, CAOS!', mood: 'crazy', emote: { who: 'scammer', symbol: 'JA!' } },
  { speaker: 'jester', text: 'PERO ESA SUERTE TUYA... ES DEMASIADA PARA UN JUEGO JUSTO! ME QUEDO CON UN POQUITO! JA JA JA! QUE EMPIECE EL SHOW!', mood: 'crazy', emote: { who: 'scammer', symbol: '$' } },
];
let scammerOutroPlayed = false;
let pendingFightTime = null;
const scammerOutroLines = [
  { speaker: 'scammer', text: 'Q-que? Me... me ganaste?', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'scammer', text: 'Imposible... Si tenia la ficha de la suerte en el bolsillo!', emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'gambler', text: 'La suerte no se compra.' },
  { speaker: 'scammer', text: 'Je... je je. Esta bien, esta bien. Tuvimos una buena pelea, BIG SHOT.' },
  { speaker: 'scammer', text: 'Podes pasar. Pero si alguna vez necesitas un reloj de oro... ya sabes donde vivo.', prop: 'watch', emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'gambler', text: 'En la basura.' },
  { speaker: 'scammer', text: 'EN EL CONTENEDOR PREMIUM! ...Anda, anda. Segui tu camino.', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
];
const scammerRageOutroLines = [
  { speaker: 'scammer', text: '...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'scammer', text: '..........' },
  { speaker: 'scammer', text: 'M-ME GANASTE?! EN MI MODO FURIOSO?!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'scammer', text: 'No... no, no, no. Esto no fue habilidad.', mood: 'angry' },
  { speaker: 'scammer', text: 'Seguro volviste a tocar los numeros para ganar facil! O tuviste pura suerte de principiante, tramposo de cuarta!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'gambler', text: 'Otra vez con los numeros... Estas completamente loco.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'scammer', text: 'Andate! Pasa de una vez, estafador de estafadores! Ojala te muerda una rata en el camino!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'gambler', text: '(Que tipo tan raro...)' },
];
const scammerRageSpeedMultiplier = 1.3;
const scammerRageDamageMultiplier = 1.35;
const scammerRageCooldownMultiplier = 0.6;
let scamOffers = [];
let scamItems = [];
const gamblerCutsceneLines = [
  { speaker: 'gambler', text: 'Pero que...?!', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'scammer', text: 'Epa, epa! Tranquilo, amigo. No soy basura... bueno, vivo en ella, pero soy un emprendedor.' },
  { speaker: 'scammer', text: 'A ver, a ver... dejame mirarte bien.', scammerOffset: -95, emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'scammer', text: 'Sombrero fino, buena postura, mirada de apostador... Tenes cara de alguien con monedas.', scammerOffset: 115 },
  { speaker: 'scammer', text: 'Oferta exclusiva: un reloj de oro 100% autentico. Para vos, solo 500 monedas.', prop: 'watch', emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'gambler', text: 'Ese reloj es de plastico. Y esta pintado con marcador.', prop: 'watch' },
  { speaker: 'scammer', text: 'Detalles! Entonces llevate esta ficha de la suerte: nunca pierde. Garantia de por vida.', prop: 'chip', emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'gambler', text: 'No, gracias. Conozco a los de tu tipo.' },
  { speaker: 'scammer', text: 'Me estas diciendo ESTAFADOR?! ...Bah. Esta bien. Segui tu camino.', mood: 'angry', scammerOffset: 260, emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'gambler', text: '(Por fin...)', gamblerX: 470 },
  { speaker: 'scammer', text: 'Pero espera! Antes de irte... apostemos. Si me ganas, pasas. Si perdes... tu suerte es mia.', scammerOffset: 120, emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'gambler', text: 'Trato hecho. Reparti las cartas.', emote: { who: 'gambler', symbol: '...' } },
];
const arcadeCutscene = {
  active: false,
  phase: 'walk',
  frame: 0,
  lineIndex: 0,
  typed: 0,
  lineDoneFrames: 0,
  gamblerX: -80,
  gamblerTargetX: 330,
  gamblerHop: 0,
  scammerX: 700,
  scammerY: 0,
  scammerTargetX: 600,
  lidAngle: 0,
  shake: 0,
  particles: [],
  prop: null,
  mood: null,
  emote: null,
};
const monkeyHealth = 167;
const monkeyDamageMultiplier = 1.34;
const monkeyMoveSpeed = playerMoveSpeed * 1.1;
const monkeyUnlockWinRate = 67;
const monkeyBananaDamage = 13;
const monkeyBananaSpeed = playerMoveSpeed * 3;
const monkeyBananaCooldown = 280;
const monkeyPeelDamage = 8;
const monkeyPeelStunDuration = 55;
const monkeyPeelDuration = 600;
const monkeyPeelCooldown = 420;
const monkeyPeelMaxActive = 2;
const monkeyCoconutDamage = 9;
const monkeyCoconutCooldown = 840;
const iceMasterDamageMultiplier = 1.2;
const iceMasterDamageTakenMultiplier = 0.85;
const iceMasterAbilityDamageMultiplier = 0.6;
const iceMasterMoveSpeed = playerMoveSpeed * 0.9;
const iceMasterShardSlowDuration = 120;
const iceMasterBeamSlowDuration = 200;
const normalArcadeBossHealth = 140;
const normalArcadeBossDamageMultiplier = 1.3;
const normalArcadeBossSpeed = 3.1;
const normalArcadeBossShockwaveDamage = 20;
const normalArcadeBossShockwaveCooldown = 420;
let selectedNormalArcadeLevel = 1;
let normalArcadeActive = false;
let arcadeChapter = 'normal';
let normalArcadeEnemiesRemaining = 0;
let arcadeBossesUnlocked = false;
const arcadeBossVariants = ['arcadeBoss', 'icedThug', 'iceMaster', 'scammer', 'shadowJester'];
let normalArcadeEnemyIndex = 0;
const statisticsStorageKey = 'moqueteStatistics';
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
  'heroOfLight',
  'ghostUnlocked',
  'divineGeneralUnlocked',
  'superFireMasterUnlocked',
  'normalArcadeCompleted',
  'fireArcadeCompleted',
  'scammerDefeated',
  'gamblerArcadeCompleted',
];
const achievementCoinRewards = {
  firstWin: 100,
  fastWin: 250,
  clutchWin: 300,
  perfectDuel: 500,
  jackpot: 750,
  reflectedWin: 500,
  darkRoom: 300,
  oldDays: 300,
  debug: 150,
  codeBreaker: 400,
  prismDriver: 600,
  casinoRoyalty: 900,
  meltdownMaster: 900,
  tankCommander: 600,
  flawlessWin: 350,
  specialist: 300,
  timeExecutioner: 1000,
  absoluteDominance: 1200,
  heroOfLight: 1500,
  ghostUnlocked: 1000,
  divineGeneralUnlocked: 2500,
  superFireMasterUnlocked: 1800,
  normalArcadeCompleted: 3000,
  fireArcadeCompleted: 3500,
  scammerDefeated: 2500,
  gamblerArcadeCompleted: 4000,
};
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
    heroOfLight: {
      title: 'Heroe de la luz',
      description: 'Desbloquea a Light Warrior: gana con Normal contra un bot dificil en menos de 20 segundos sin recibir dano.',
    },
    ghostUnlocked: {
      title: 'Espectro del Dark Room',
      description: 'Desbloquea a Ghost despues de jugar una partida en Dark Room.',
    },
    divineGeneralUnlocked: {
      title: 'Juicio del general',
      description: 'Completa los 7 sellos dificiles para desbloquear a Divine General.',
    },
    superFireMasterUnlocked: {
      title: 'Super Fire Master',
      description: 'Gana Mana Meltdown con Fire Master en menos de 45 segundos y con 80+ vida.',
    },
    normalArcadeCompleted: {
      title: 'El desafio de Normal',
      description: 'Completa el capitulo de Normal en el modo Arcade.',
    },
    gamblerArcadeCompleted: {
      title: 'EL MUNDO GIRA Y GIRA!',
      description: 'Derrota a Shadow Jester y completa el capitulo de Gambler en el modo Arcade. El show termino... por ahora.',
    },
    scammerDefeated: {
      title: '[[BIG SHOT]]',
      description: 'Derrota a Scammer en el capitulo 3 de Arcade. Ahora es TU oportunidad de jugar con el.',
    },
    fireArcadeCompleted: {
      title: 'Deshielo total',
      description: 'Completa el capitulo de Fire Master en el modo Arcade derrotando a Ice Master.',
    },
  },
};
const uiTranslations = {
  es: {
    achievementToastLabel: 'Logro obtenido',
    menuSubtitle: 'Juego de pelea local',
    play: 'Jugar',
    gameModes: 'Modos de juego',
    guide: 'Guia',
    achievements: 'Logros',
    stats: 'Estadisticas',
    information: 'Changelog',
    opinion: 'Opinion de Claude',
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
    lightWarriorUnlockedTitle: 'Light Warrior desbloqueado',
    lightWarriorLockedTitle: 'Logro Heroe de la luz: gana con Normal contra bot dificil en menos de 20s sin recibir dano',
    divineUnlockedTitle: 'Divine General desbloqueado',
    divineLockedTitle: 'Completa los 7 sellos dificiles para usar Divine General',
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
  lightWarriorOmega: false,
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
const arcaneRuneSpots = [180, 512, 844];
const arcaneRuneRadius = 62;
const arcaneRuneShiftFrames = 360;
const arcaneRuneCooldownReduction = 45;
let arcaneRuneIndex = 1;
let arcaneRuneTimer = arcaneRuneShiftFrames;
const clockTowerZoneStart = 384;
const clockTowerZoneEnd = 640;
const clockTowerSlowFactor = 0.72;
const ruinsEruptionInterval = 420;
const ruinsEruptionWarning = 90;
const ruinsEruptionHalfWidth = 62;
const ruinsEruptionDamage = 10;
const ruinsEruption = { timer: ruinsEruptionInterval, warnTimer: 0, x: 512, flashTimer: 0 };
const jungleBananaInterval = 420;
const jungleBananaMaxActive = 2;
const jungleBananaHeal = 6;
const jungleBananaMonkeyHeal = 10;
let jungleBananas = [];
let jungleBananaTimer = 240;
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
let animationId = null;
let fireballs = [];
let fireBeams = [];
let lightShots = [];
let superFireKamehamehaCharges = [];
let superFireKamehamehas = [];
let tankShells = [];
let arcadeBossShockwaves = [];
let lightWarriorOmegaTransformation = null;
let cowboyBullets = [];
let sorcererOrbs = [];
let sorcererGravityOrbs = [];
let sorcererSecretOrbs = [];
let chronoBlades = [];
let chronoZones = [];
let icedThugBlades = [];
let icedThugFrostFields = [];
let monkeyBananas = [];
let monkeyPeels = [];
let monkeyCoconuts = [];
let divineWorldCutCharges = [];
let divineWorldCuts = [];
let characterSelectionPlayer = 1;
let selectedMap = 'foundry';
let player1QfPendingSpecial = null;
let player2QfPendingSpecial = null;
let player1FrPendingSpecial = null;
let player2FrPendingSpecial = null;
let player1SorcererPendingSpecial = null;
let player2SorcererPendingSpecial = null;
const mainMenu = document.getElementById('mainMenu');
const titleScreen = document.getElementById('titleScreen');
const oldDaysScreen = document.getElementById('oldDaysScreen');
const characterScreen = document.getElementById('characterScreen');
const characterSelectTitle = document.getElementById('characterSelectTitle');
const mapScreen = document.getElementById('mapScreen');
const darkRoomMapButton = document.getElementById('darkRoomMapButton');
const gangBossCharacterButton = document.getElementById('gangBossCharacterButton');
const icedThugCharacterButton = document.getElementById('icedThugCharacterButton');
const iceMasterCharacterButton = document.getElementById('iceMasterCharacterButton');
const monkeyCharacterButton = document.getElementById('monkeyCharacterButton');
const scammerCharacterButton = document.getElementById('scammerCharacterButton');
const shadowJesterCharacterButton = document.getElementById('shadowJesterCharacterButton');
const arcadeBossCharacterButtons = [gangBossCharacterButton, icedThugCharacterButton, iceMasterCharacterButton, shadowJesterCharacterButton];
const arcadeMapButtons = document.querySelectorAll('.arcade-map-option');
const settingsScreen = document.getElementById('settingsScreen');
const gameModesScreen = document.getElementById('gameModesScreen');
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
const lightWarriorCharacterButton = document.getElementById('lightWarriorCharacterButton');
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
const gameModesButton = document.getElementById('gameModesButton');
const guideButton = document.getElementById('guideButton');
const achievementsButton = document.getElementById('achievementsButton');
const statsButton = document.getElementById('statsButton');
const infoButton = document.getElementById('infoButton');
const opinionButton = document.getElementById('opinionButton');
const backButton = document.getElementById('backButton');
const gameModesBackButton = document.getElementById('gameModesBackButton');
const arcadeModeButton = document.getElementById('arcadeModeButton');
const arcadeChaptersScreen = document.getElementById('arcadeChaptersScreen');
const normalArcadeChapterButton = document.getElementById('normalArcadeChapterButton');
const fireArcadeChapterButton = document.getElementById('fireArcadeChapterButton');
const gamblerArcadeChapterButton = document.getElementById('gamblerArcadeChapterButton');
const reflecterArcadeChapterButton = document.getElementById('reflecterArcadeChapterButton');
const arcadeLevelSixButton = document.querySelector('[data-arcade-level="6"]');
const arcadeChaptersBackButton = document.getElementById('arcadeChaptersBackButton');
const arcadeLevelsScreen = document.getElementById('arcadeLevelsScreen');
const arcadeLevelsTitle = document.getElementById('arcadeLevelsTitle');
const arcadeStoryKicker = document.getElementById('arcadeStoryKicker');
const arcadeStoryParagraphOne = document.getElementById('arcadeStoryParagraphOne');
const arcadeStoryParagraphTwo = document.getElementById('arcadeStoryParagraphTwo');
const arcadeLevelsBackButton = document.getElementById('arcadeLevelsBackButton');
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
const menuCoinBalance = document.getElementById('menuCoinBalance');
const statsCoinBalance = document.getElementById('statsCoinBalance');
const secretTrashButton = document.getElementById('secretTrashButton');
const scammerIntroScreen = document.getElementById('scammerIntroScreen');
const scammerIntroDialog = document.getElementById('scammerIntroDialog');
const scammerIntroSpeaker = document.getElementById('scammerIntroSpeaker');
const scammerIntroText = document.getElementById('scammerIntroText');
const scammerShopScreen = document.getElementById('scammerShopScreen');
const shopItemsContainer = document.getElementById('shopItems');
const shopCoinBalance = document.getElementById('shopCoinBalance');
const shopVendorLine = document.getElementById('shopVendorLine');
const shopScammer = document.getElementById('shopScammer');
const shopQuestions = document.getElementById('shopQuestions');
const scammerShopBackButton = document.getElementById('scammerShopBackButton');
const menuShopBadges = document.getElementById('menuShopBadges');
const player1ColorInputs = document.querySelectorAll('input[name="player1Color"]');
const player2ColorInputs = document.querySelectorAll('input[name="player2Color"]');
const botDifficultyInputs = document.querySelectorAll('input[name="botDifficulty"]');
const debugAffectAllInput = document.getElementById('debugAffectAll');
const debugRestoreAttackSpamInput = document.getElementById('debugRestoreAttackSpam');
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
  { button: lightWarriorCharacterButton, originalName: 'Light Warrior', characterType: 'lightWarrior' },
  { button: divineGeneralCharacterButton, originalName: 'Divine General', characterType: 'divineGeneral' },
  { button: monkeyCharacterButton, originalName: 'Monkei', characterType: 'monkey' },
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
  lightWarrior: 'Light Warrior',
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
  monkey: 'Monkei',
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
  lightWarrior: {
    default: [
      'Peleaste bien. Con un poco mas de calma, vas a llegar lejos.',
      'Tenes buena energia. Solo te falto elegir mejor el momento de atacar.',
      'Fue una buena pelea. Segui practicando la defensa y vas a mejorar rapido.',
    ],
    normal: ['Tus fundamentos son buenos. Trabaja un poco el timing y vas a ser peligroso.'],
    lightWarrior: ['Llevas bien la luz. Solo te falto paciencia para cargar el golpe correcto.'],
    fireMaster: ['Tu fuego fue fuerte. Si cuidas mas la distancia, vas a quemar mejor.'],
    tank: ['Tu resistencia es admirable. Proba variar el ritmo para que no te lean tan facil.'],
    cowboy: ['Tenes buena punteria. Si esperas medio segundo mas, tus disparos van a doler mas.'],
    reflecter: ['Tu defensa fue inteligente. Te falto elegir mejor que habilidad reflejar.'],
    switcher: ['Cambiaste muy bien de plan. Solo necesitabas cerrar mejor la oportunidad.'],
    sorcerer: ['Tu magia tiene potencial. Protegete mejor mientras preparas tus hechizos.'],
    gambler: ['Jugaste con confianza. Equilibra mejor riesgo y defensa y vas a ganar mas.'],
    chrono: ['Tu control del tiempo fue bueno. Te falto aprovechar mejor cada segundo.'],
    ghost: ['Te moviste muy bien. Si atacas despues de desaparecer, vas a sorprender mas.'],
    divineGeneral: ['Tu adaptacion fue impresionante. Contra la luz, solo necesitabas esperar menos.'],
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
  monkey: {
    default: [
      'Uh uh ah ah. Seis, siete.',
      'Te resbalaste con la vida.',
      'La banana siempre gana.',
    ],
    ghost: ['Ni los fantasmas esquivan una buena cascara.'],
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
const unlockedAchievements = loadAchievements();
const coinWallet = loadCoinWallet();
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

function t(key) {
  return uiTranslations.es[key] || key;
}

function getAchievementDetails(achievementId) {
  return achievementDetailsByLanguage.es[achievementId] || {
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
  document.documentElement.lang = 'es';

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.innerText = t(element.dataset.i18n);
  });

  syncAchievementText();
  syncGhostUnlockUI();
  syncDivineGeneralUnlockUI();
  syncMonkeyUnlockUI();
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

function createEmptyCoinWallet() {
  return {
    balance: 0,
    achievements: {},
    arcadeLevels: {},
    arcadeChapters: {},
  };
}

function normalizeCoinWallet(savedWallet) {
  const wallet = createEmptyCoinWallet();
  if (!savedWallet || typeof savedWallet !== 'object') return wallet;

  wallet.balance = Math.max(0, Math.floor(Number(savedWallet.balance) || 0));
  ['achievements', 'arcadeLevels', 'arcadeChapters'].forEach((rewardGroup) => {
    if (!savedWallet[rewardGroup] || typeof savedWallet[rewardGroup] !== 'object') return;
    Object.keys(savedWallet[rewardGroup]).forEach((rewardKey) => {
      if (savedWallet[rewardGroup][rewardKey]) wallet[rewardGroup][rewardKey] = true;
    });
  });

  return wallet;
}

function loadCoinWallet() {
  try {
    return normalizeCoinWallet(JSON.parse(localStorage.getItem(coinStorageKey) || 'null'));
  } catch (error) {
    return createEmptyCoinWallet();
  }
}

function saveCoinWallet() {
  try {
    localStorage.setItem(coinStorageKey, JSON.stringify(coinWallet));
  } catch (error) {
    // Coins still work for the current session if storage is blocked.
  }
}

function syncCoinWalletUI() {
  if (menuCoinBalance) menuCoinBalance.innerText = coinWallet.balance.toLocaleString('es-ES');
  const shopBalance = document.getElementById('shopCoinBalance');
  if (shopBalance) shopBalance.innerText = coinWallet.balance.toLocaleString('es-ES');
  if (statsCoinBalance) statsCoinBalance.innerText = coinWallet.balance.toLocaleString('es-ES');
}

function awardCoins(amount) {
  const reward = Math.max(0, Math.floor(Number(amount) || 0));
  if (reward <= 0) return;

  coinWallet.balance += reward;
  saveCoinWallet();
  syncCoinWalletUI();
}

function awardAchievementCoins(achievementId) {
  if (coinWallet.achievements[achievementId]) return;

  coinWallet.achievements[achievementId] = true;
  awardCoins(achievementCoinRewards[achievementId] || 0);
  saveCoinWallet();
}

function awardArcadeReward(rewardGroup, rewardKey, amount) {
  if (coinWallet[rewardGroup][rewardKey]) return;

  coinWallet[rewardGroup][rewardKey] = true;
  awardCoins(amount);
  saveCoinWallet();
}

function syncAchievementsUI() {
  document.querySelectorAll('[data-achievement]').forEach((achievementCard) => {
    const achievementId = achievementCard.dataset.achievement;
    achievementCard.classList.toggle('unlocked', Boolean(unlockedAchievements[achievementId]));
  });
  syncAchievementText();
  syncSuperFireMasterUnlockUI();
  syncGhostUnlockUI();
  syncLightWarriorUnlockUI();
  syncDivineGeneralUnlockUI();
  syncScammerUnlockUI();
}

function isGhostUnlocked() {
  return Boolean(unlockedAchievements.ghostUnlocked);
}

function isDivineGeneralUnlocked() {
  return Boolean(unlockedAchievements.divineGeneralUnlocked);
}

function isLightWarriorUnlocked() {
  return Boolean(unlockedAchievements.heroOfLight);
}

function getMonkeyUnlockCharacter() {
  return characterTypes.find((characterType) => {
    if (characterType === 'monkey') return false;
    const characterStats = persistentStatistics.characters[characterType];
    if (!characterStats || characterStats.wins + characterStats.losses <= 0) return false;
    return formatWinRate(characterStats.wins, characterStats.losses) === `${monkeyUnlockWinRate}%`;
  }) || null;
}

function isMonkeyUnlocked() {
  return Boolean(getMonkeyUnlockCharacter());
}

