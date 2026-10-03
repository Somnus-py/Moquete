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
// Chapter 4 fights: level 5 (Chrono Potenciado), level 6 robots + Chrono, and the Titan
const reflecterBattleTrackSources = {
  chronoBoost: 'assetsaudio/chrono-potenciado-fight.ogg',
  factory: 'assetsaudio/factory-epic-boss-battle.wav',
  titan: 'assetsaudio/titan-boss-battle-metal.wav',
  judge: encodeURI('assetsaudio/58. Hammer of Justice (DELTARUNE Chapter 3+4 Soundtrack) - Toby Fox.mp3'),
};
const reflecterBattleTrackVolumes = { chronoBoost: 0.6, factory: 0.5, titan: 0.6, judge: 0.6, scamNormal: 0.6, scamNeo: 0.6 };
// Scammer's challenge (the Maquina Rara): his usual theme, then BIG SHOT against NEO SCAMMER
reflecterBattleTrackSources.scamNormal = scammerBattleTrackSource;
reflecterBattleTrackSources.scamNeo = encodeURI('assetsaudio/39. BIG SHOT (DELTARUNE Chapter 2 Soundtrack) - Toby Fox.mp3');
// Hammer of Justice ends in ~5 seconds of silence: it is looped by hand right where the music stops
const reflecterBattleTrackLoops = { judge: { start: 0.036, end: 133.38 }, scamNeo: { start: 0.035, end: 137.25 } };
// Chapter 5 (original tracks made for the game): the Bush Monster fight and Light Warrior's hero theme
reflecterBattleTrackSources.bushMonster = 'assetsaudio/bush-monster.wav';
reflecterBattleTrackSources.lightTheme = 'assetsaudio/light-warrior-theme.wav';
reflecterBattleTrackVolumes.bushMonster = 0.55;
reflecterBattleTrackVolumes.lightTheme = 0.6;
reflecterBattleTrackSources.darkOrder = 'assetsaudio/dark-order.wav';
reflecterBattleTrackVolumes.darkOrder = 0.55;
reflecterBattleTrackSources.petalDance = encodeURI('assetsaudio/Petal Dance.mp3');
reflecterBattleTrackVolumes.petalDance = 0.6;
reflecterBattleTrackSources.madMuse = 'assetsaudio/mad-muse.wav';
reflecterBattleTrackVolumes.madMuse = 0.5;
reflecterBattleTrackSources.furiousChef = 'assetsaudio/furious-chef.wav';
reflecterBattleTrackVolumes.furiousChef = 0.5;
reflecterBattleTrackSources.sheriffShowdown = 'assetsaudio/sheriff-showdown.wav';
reflecterBattleTrackVolumes.sheriffShowdown = 0.55;
reflecterBattleTrackSources.lastStand = 'assetsaudio/last-stand.wav';
reflecterBattleTrackVolumes.lastStand = 0.55;
reflecterBattleTrackSources.lanternGuardian = 'assetsaudio/lantern-guardian.wav';
reflecterBattleTrackVolumes.lanternGuardian = 0.55;
reflecterBattleTrackSources.lightFinal = 'assetsaudio/34.wav';
reflecterBattleTrackSources.worldRoaring = 'assetsaudio/DELTARUNE - The World Roaring (The World Revolving + Black Knife).mp3';
reflecterBattleTrackVolumes.worldRoaring = 0.55;
// where each track really starts (seconds), also when it loops
const reflecterBattleTrackStartOffsets = { worldRoaring: 4.5 };
reflecterBattleTrackVolumes.lightFinal = 0.6;
const reflecterBattleMusic = { tracks: {}, current: null, restart: true };
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
const reflecterArcadePlayableLevels = 6;
const robotGlitchSparkColors = ['#ffee58', '#4fc3f7', '#ffffff'];
const robotDischargeDamage = 12;
const robotRivetDamage = 11;
const robotTickBombDamage = 16;
const robotScrapDamage = 7;
const robotChargeDamage = 15;
const robotChargeSpeed = 9;
const robotChargeFrames = 48;
let robotShots = [];
// Chapter 4, level 5: Chrono comes back upgraded by Tempus Corp.
const chronoRivalHealth = 260;
const chronoRivalDamageMultiplier = 1.35;
const chronoRivalRewindCooldown = 900;
const chronoRivalRewindFrames = 600;
const chronoRivalRewindMinGain = 25;
let chronoRivalHistory = [];
let chronoRewindFx = 0;
let chronoIntroDummies = null;
const chronoAscentFrames = 330;
const chronoAscentLines = [
  { speaker: 'chrono', text: 'Todavia no entendiste? Esta fabrica tiene muchos pisos... y vamos a subirlos TODOS.', power: true },
  { speaker: 'reflecter', text: 'Ugh... Que... que eran todas esas cosas ahi abajo?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'chrono', text: 'Los secretos de Tempus. Y ahora que me hiciste enojar... el tiempo es MIO.', power: true },
  { speaker: 'reflecter', text: 'Esto no cambia nada, Chrono. Aca arriba tambien te voy a ganar.' },
];
const chronoRivalLines = [
  { speaker: 'reflecter', text: 'Demasiado facil. Estos robots se caen solos... Cuantos mas habra en esta fabrica?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'chrono', text: 'REFLECTER! Sabia que Prisma Dynamics iba a mandar a su espejito a meter las narices en MI fabrica.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'reflecter', text: 'Chrono... Tendria que haberlo imaginado. Tempus Corp. sigue escondiendo cosas aca adentro.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'chrono', text: 'Esta vez no va a ser como las otras. Esta vez te voy a derrotar.' },
  { speaker: 'reflecter', text: 'Siempre decis lo mismo. No te creo. Y te voy a volver a ganar.' },
  { speaker: 'chrono', text: 'Jeje... Mira bien, Reflecter. Tempus me mejoro. Ahora estoy MAS PREPARADO que nunca.', power: true },
  { speaker: 'reflecter', text: 'Q-que es esa energia...?', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'reflecter', text: '...No importa. Si tengo que romperte otra vez, lo voy a hacer.' },
  { speaker: 'chrono', text: 'Veamos cuanto aguanta tu espejo.', power: true },
];
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
  // Chapter 4 final boss: the giant prototype kept on floor 4 ("PROYECTO ?? - CLASIFICADO")
  titanUnit: {
    name: 'Proyecto Titan',
    baseType: 'normal',
    model: 'titan',
    health: 420,
    color: '#37474f',
    abilities: ['laserEyes', 'fistSlam', 'missileSwarm', 'dualDischarge'],
    cooldown: 170,
    damageMultiplier: 1.6,
    moveSpeedMultiplier: 0.55,
    size: { width: 176, height: 250 },
    robot: true,
    glitchEvery: [700, 900],
    glitchFrames: 45,
  },
  // Chapter 4 secret boss (level 7): Omegarius, an old Prisma Dynamics robot that a teleport error left inside
  // Tempus Corp.'s factory, where it was locked up. Not defective: it never glitches.
  omegarius: {
    name: 'Omegarius',
    baseType: 'normal',
    model: 'bronze',
    health: 560,
    color: '#4a2e16',
    // its three abilities (hammer boomerang, parry, energy shot) are driven by their own bot logic
    abilities: [],
    cooldown: 200,
    // 10 base damage (a light hit is attackDamage 5 x 2; a strong hit, 30)
    damageMultiplier: 2,
    size: { width: 70, height: 132 },
    robot: true,
    glitchEvery: [999999, 999999],
    glitchFrames: 0,
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
reflecterArcadeLevels[6] = {
  enemies: ['scrapDrone', 'rustyGuard', 'clockworkReject', 'overloadUnit', 'scrapDrone', 'rustyGuard'],
  difficulties: ['medium', 'medium', 'hard', 'hard', 'hard', 'hard'],
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
let chronoOutroPlayed = false;
// Chapter 4 level 6: 'robots' (six robots) -> 'chrono' (normal Chrono) -> 'titan' (the giant)
let ch6Stage = 'robots';
let ch6OutroPlayed = false;
// secret level 7: finish level 6 in one clean run (entered from the level menu), never dying and never using the shield
let ch6RunClean = false;
const reflecterSecretLevelStorageKey = 'moqueteReflecterSecretLevel';
const ch6OutroLines = [
  { speaker: 'reflecter', text: 'LO... LO HICE! LE GANE AL PROYECTO TITAN!', emote: { who: 'gambler', symbol: '!!' } },
  { speaker: 'reflecter', text: 'Uff... seis robots, Chrono y esa cosa gigante. Creo que me estoy cansando un poco...', emote: { who: 'gambler', symbol: '...' } },
];
const ch6TitanTriggerHealth = 50;
const titanLaserDamage = 18;
const titanFistDamage = 24;
const titanMissileDamage = 9;
// Chapter 4 secret level 7: the hidden sector (Sector 0) and Omegarius
// 1) hammer boomerang: hits on the way out and again on the way back
const judgeHammerThrowDamage = 25;
const judgeHammerDropDamage = 15;
const omegariusThrowCooldown = 240;
// 2) parry: a real (not holographic) bronze shield; hitting it gets you a strong counter that sends you flying
const omegariusParryFrames = 60;
const omegariusParryCooldown = 300;
const omegariusParryCounterDamage = 35;
// 3) energy shot from the hammer: locked until Omegarius is down to 400 health; Reflecter's shield bounces it back weaker
const omegariusBeamUnlockHealth = 400;
const omegariusBeamChargeFrames = 55;
const omegariusBeamCooldown = 540;
const omegariusBeamDamage = 120;
const omegariusBeamReflectDamage = 40;
const omegariusBeamSpeed = 15;
// the small armor Omegarius gives Reflecter before their fight
const omegariusArmorHealth = 50;
// when Reflecter is almost beaten Omegarius stops the sparring and gives him a better armor
const omegariusMercyHealth = 40;
const omegariusArmorPlusHealth = 120;
const omegariusArmorPlusDamageTaken = 0.65;
// at 250 health Omegarius is impressed and fights harder (gold aura, faster, shorter cooldowns)
const omegariusExcitedHealth = 250;
const omegariusExcitedCooldownMultiplier = 0.7;
// at 100 health: the secret ability (. + Enter), a stronger energy shot that Reflecter and Omegarius
// bounce back and forth (Reflecter's shield barely has a cooldown here) until Omegarius catches it and slams it down
const omegariusSecretHealth = 100;
const omegariusSecretChargeFrames = 120;
const omegariusSecretDamage = 150;
const omegariusSecretSpeed = 12;
const omegariusSecretVolleys = 5;
const omegariusSecretShieldCooldown = 12;
// at 10 health: the final act "ULTIMO ASALTO" (. + /). Like Shadow Jester's, but with two modes inside a box:
// 'free' (move around and dodge) and 'shield' (stay still in the middle and point a shield to parry)
const omegariusFinalHealth = 10;
const omegariusFinalIntroFrames = 130;
const omegariusFinalTransitionFrames = 70;
const omegariusFinalWhiteFrames = 60;
const omegariusFinalDamagePercent = 0.1;
const omegariusFinalBoxes = {
  free: { x: 262, y: 185, width: 420, height: 290 },
  shield: { x: 402, y: 265, width: 140, height: 140 },
};
// about 140 seconds in total (the finale lasts as long as its giant hammer sequence)
const omegariusFinalPhases = [
  { mode: 'free', frames: 1000, pattern: 'boomerangs' },
  { mode: 'shield', frames: 1000, pattern: 'singles' },
  { mode: 'free', frames: 1000, pattern: 'rainWaves' },
  { mode: 'shield', frames: 1000, pattern: 'mixed' },
  { mode: 'free', frames: 1150, pattern: 'chaos' },
  { mode: 'shield', frames: 1150, pattern: 'fury' },
  { mode: 'free', frames: 1200, pattern: 'storm' },
  { mode: 'shield', frames: 0, pattern: 'finale' },
];
const omegariusFinal = { active: false };
// scenes during the level 7 fight: the music keeps playing through them
const ch7MidFightScenes = ['ch7Mercy', 'ch7Excited', 'ch7Slam', 'ch7FinalEnd', 'scamTired', 'scamFinalStart', 'scamFinalEnd', 'knightDarkDeal', 'knightMochiChef'];
const ch7FinalEndLines = [
  { speaker: 'omegarius', text: 'Uff... uff... Eso era todo lo que me quedaba, hermanito.' },
  { speaker: 'omegarius', text: 'Ningun robot de Tempus aguanto tanto como vos. Vamos... dame el ultimo golpe. Te lo ganaste.' },
  { speaker: 'reflecter', text: 'Gracias por el sparring, Omegarius. Aca va!', emote: { who: 'gambler', symbol: '!' } },
];
const ch7ExcitedLines = [
  { speaker: 'omegarius', text: 'Ja... JA JA JA! Increible!', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'omegarius', text: 'Hace años que nadie me hacia retroceder asi. Prisma hizo un gran trabajo con vos, hermanito.' },
  { speaker: 'reflecter', text: 'Eh... gracias? Pense que ya te estabas cansando...', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'omegarius', text: 'Cansado? Al contrario! Ahora si tengo ganas de pelear en serio. Preparate!' },
];
const ch7SlamLines = [
  { speaker: 'omegarius', text: 'Suficiente! Jeje...' },
  { speaker: 'omegarius', text: 'Cinco veces me la devolviste. CINCO. No vas nada mal, hermanito.' },
  { speaker: 'omegarius', text: 'Si que sabes pelear. Prisma puede estar orgullosa de vos.' },
  { speaker: 'reflecter', text: 'Vos tampoco estas nada mal, eh... Terminemos esto!', emote: { who: 'gambler', symbol: '!' } },
];
const ch7MercyLines = [
  { speaker: 'omegarius', text: 'Alto, alto! Hermanito, respira un poco.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'omegarius', text: 'No quiero destruirte, ni nada parecido. Esto es un sparring: quiero ver como peleas, no romperte.' },
  { speaker: 'reflecter', text: '...Un sparring? Casi me partis en dos con ese martillo!', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'omegarius', text: 'Jeje... perdon. Llevo años sin pelear con nadie y me entusiasme.' },
  { speaker: 'omegarius', text: 'Toma, esta es mejor: mas resistente y absorbe parte de los golpes. Asi estamos mas parejos.' },
  { speaker: 'reflecter', text: 'Otra armadura...? Wow... Me siento como nuevo.', armorPlus: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'omegarius', text: 'Asi me gusta. Segundo asalto, hermanito!' },
  { speaker: 'reflecter', text: 'Esta vez no me vas a agarrar desprevenido!' },
];
const ch7IntroLines = [
  { speaker: 'reflecter', text: 'Ugh... Donde estamos? Esta parte de la fabrica no aparecia en ningun plano.', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'chrono', text: 'Ni yo sabia que existia... Mejor. Aca abajo nadie va a ver como te destruyo.', power: true },
  { speaker: 'reflecter', text: 'Chrono, ya te gane tres veces. Ni siquiera te queda energia.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'chrono', text: 'Sin robots. Sin titanes. Solo vos y yo, espejito. EN GUAR...', power: true, mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
];
const ch7OmegariusLines = [
  { speaker: 'omegarius', text: 'Ah... perdon por la interrupcion. Ese relojito volador hacia demasiado ruido para un lugar tan tranquilo.' },
  { speaker: 'reflecter', text: 'Q-que...? Quien sos? ...Espera. Te pareces a mi!', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'omegarius', text: 'Me llamo Omegarius. Y el parecido no es casualidad, pequeño: a mi tambien me creo Prisma Dynamics.' },
  { speaker: 'reflecter', text: 'Prisma?! Y que hace un robot de Prisma escondido en la fabrica de Tempus Corp.?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'omegarius', text: 'Un error de teletransporte, hace muchos años. Tenia que aparecer en casa... y aparecí aca, en el corazon de la competencia.' },
  { speaker: 'omegarius', text: 'Tempus creyo que era un espia. Me encerraron en este sector y lo borraron de todos los planos. Desde entonces... espero.' },
  { speaker: 'reflecter', text: 'Eso es horrible... Vamos, te saco de aca. Prisma tiene que saber que seguis vivo.' },
  { speaker: 'omegarius', text: 'Paciencia, hermanito. Antes de irnos quiero ver de que esta hecho el nuevo modelo de Prisma. Un pequeño combate, nada mas.' },
  { speaker: 'reflecter', text: 'Un combate? Pero... estamos del mismo lado, no?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'omegarius', text: 'Justamente por eso. A un hermano se lo conoce de verdad cruzando golpes con el. Toma, no quiero que sea injusto.' },
  { speaker: 'reflecter', text: 'Una armadura...? Es liviana... y me siento mucho mas resistente.', armor: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'omegarius', text: 'Bronce de Prisma, forjado con mis propias manos en estos años de encierro. Ahora si... en guardia.' },
  { speaker: 'reflecter', text: '...No entiendo nada de lo que esta pasando. Pero esta bien: acepto!' },
];
const ch6IntroLines = [
  { speaker: 'chrono', text: 'NO! NO, NO, NO! Esto no se termina asi, Reflecter!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'reflecter', text: 'Ugh... Todavia no aprendiste? Ya te gane dos veces.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'chrono', text: 'UNIDADES DE LA PLANTA 7! TODAS! DESPIERTEN Y ACABEN CON EL!', mood: 'angry', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'chrono', text: 'Y mientras te entretienen... yo voy a buscar mas poder. Mucho mas.' },
];
const ch6ChronoLines = [
  { speaker: 'chrono', text: 'Bienvenido al piso cuatro, espejito. La parte mas importante de toda la fabrica.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'reflecter', text: 'Otra vez vos? Ni siquiera estas potenciado. Esto va a ser rapido.' },
  { speaker: 'chrono', text: 'Rapido? Jeje... Esta vez no tenes NI IDEA de lo que te espera.' },
  { speaker: 'reflecter', text: 'Siempre decis lo mismo, Chrono.', emote: { who: 'gambler', symbol: '...' } },
];
const ch6GiantLines = [
  { speaker: 'chrono', text: 'Basta. Basta de juegos. Vos te buscaste esto, Reflecter.', mood: 'angry' },
  { speaker: 'reflecter', text: 'Que... que estas por hacer?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'chrono', text: 'Te presento el secreto mejor guardado de Tempus Corp.: el PROYECTO TITAN. Que lo disfrutes.', emote: { who: 'scammer', symbol: '!!' } },
];
const chronoOutroLines = [
  { speaker: 'chrono', text: 'No... no puede ser. Me potenciaron, me mejoraron... y AUN ASI estoy perdiendo?!', emote: { who: 'scammer', symbol: '?!' } },
  { speaker: 'reflecter', text: 'JA! Te lo dije, Chrono! TE DIJE que te iba a ganar otra vez!', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'reflecter', text: 'Podes tener toda la energia que quieras. Un espejo siempre te devuelve lo que le tiras.' },
  { speaker: 'chrono', text: 'Callate... CALLATE! No te vas a reir de mi, espejito!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'chrono', text: 'SI NO TE PUEDO GANAR PELEANDO... TE APLASTO DESDE EL CIELO!!!', mood: 'angry', power: true, emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'reflecter', text: 'E-espera... que vas a hacer?!', emote: { who: 'gambler', symbol: '!!' } },
];
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
const arcadeBossVariants = ['arcadeBoss', 'icedThug', 'iceMaster', 'scammer', 'shadowJester', 'neoScammer', 'knight', 'mossBeast', 'darkKnight', 'darkKnightBoss', 'celesteGirl', 'setoBoy', 'mochiMouse', 'chefBoss', 'lanternGuard', 'shaolinMaster'];
// ---------------- Scammer's challenge: insisting on the Maquina Rara without the coins ----------------
const scamChallenge = { active: false, stage: 'normal', hero: 'normal', pickedByScammer: false, prevBot: false, prevDifficulty: 'medium', timer: null, timeLeft: 0 };
// any character except Light Warrior and Divine General
const scamChallengeRoster = ['normal', 'fireMaster', 'tank', 'cowboy', 'reflecter', 'switcher', 'sorcerer', 'gambler', 'chrono', 'ghost', 'monkey'];
const scamChallengeSeconds = 10;
// NEO SCAMMER (reference sheet): 500 health, takes 30% less damage, 8 base damage (attackDamage 5 x 1.6)
const neoScammerHealth = 500;
const neoScammerDamageMultiplier = 1.6;
const neoScammerDamageTaken = 0.7;
const neoBigShotDamage = 28;
const neoSmallShotDamage = 12;
const neoPipisDamage = 14;
const neoBurstHeadDamage = 8;
const neoHomingHeadDamage = 12;
const neoDealDamage = 16;
const neoBigShotCooldown = 250;
const neoPipisCooldown = 280;
const neoHeadsCooldown = 400;
const scamMachineInsistLines = [
  'EH, EH! NO TE ALCANZA, KID! ESA MAQUINA NO ES PARA [[BOLSILLOS FLACOS]]!',
  'OTRA VEZ?! TE DIJE QUE NO TE ALCANZA! DEJA DE TOCAR ESE BOTON!',
  'KID... TE LO ADVIERTO. NO. LO. HAGAS.',
  'ULTIMA ADVERTENCIA!!! SI APRETAS ESE BOTON UNA VEZ MAS, VAS A CONOCER AL VERDADERO [[SCAMMER]]!!!',
  'YA ESTA!!! NO AGUANTO MAS!!! SI TANTO LA QUERES... [[GANATELA]]!!! PELEA CONMIGO, KID!!!',
];
const scamIntroLines = [
  { speaker: 'scammer', text: 'BIENVENIDO A MI SALA DE VENTAS [[VIP]]! ACA SE CIERRAN LOS [[GRANDES NEGOCIOS]]!', emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'scammer', text: 'QUERIAS LA MAQUINA SIN PAGAR? ENTONCES VAS A PAGAR CON [[SUDOR]]! (Y TAL VEZ CON UN RINON)' },
  { speaker: 'scammer', text: 'SI ME GANAS, LA MAQUINA ES TUYA. SI PIERDO... NO VOY A PERDER! JA JA JA!', mood: 'mock' },
];
const scamIntroGamblerLines = [
  { speaker: 'scammer', text: 'GAMBLER?! JA JA JA! MI CLIENTE [[FAVORITO]]! EL QUE ME DEJO EN LA [[BANCARROTA]] EN EL CALLEJON!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'gambler', text: 'Scammer... todavia no superaste eso?', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'scammer', text: 'SUPERARLO? KID, YO SUPERO TODO! QUIEBRAS, DEMANDAS, CONTENEDORES... PERO VOS ME DEBES UNA [[REVANCHA]]!' },
  { speaker: 'scammer', text: 'HAGAMOS UNA APUESTA: SI GANAS, LA MAQUINA ES TUYA. SI GANO YO... ME QUEDO CON TU SUERTE! TODA!', mood: 'mock' },
  { speaker: 'gambler', text: 'La casa siempre gana, eh? Veamos cuanta suerte te queda a vos.' },
];
// the talk before the fight, one for each fighter (Living Tank does not talk: Scammer talks alone)
const scamClosingLine = { speaker: 'scammer', text: 'SI ME GANAS, LA MAQUINA ES TUYA. SI PIERDO... NO VOY A PERDER! JA JA JA!', mood: 'mock' };
const scamHeroIntroLines = {
  normal: [
    { speaker: 'scammer', text: 'UN LUCHADOR [[NORMAL]]! EL CLIENTE PROMEDIO! MI FAVORITO PARA VENDERLE COSAS QUE NO NECESITA!', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'normal', text: 'Soy normal, pero no soy tonto. Esa maquina no vale nueve millones.' },
    { speaker: 'scammer', text: 'NO VALE NUEVE MILLONES... VALE [[9.999.999]]! ES MUY DISTINTO, KID!' },
    { speaker: 'normal', text: 'Bueno. Entonces te la gano a las piñas.' },
    scamClosingLine,
  ],
  fireMaster: [
    { speaker: 'scammer', text: 'FIRE MASTER! CUIDADO CON EL FUEGO, KID! MI SALA NO TIENE [[SEGURO CONTRA INCENDIOS]]! ...NI NINGUN SEGURO.', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'fireMaster', text: 'Tranquilo. Solo voy a quemar tus precios inflados.' },
    { speaker: 'scammer', text: 'MIS PRECIOS NO ESTAN INFLADOS, ESTAN [[AL ROJO VIVO]]! JA JA! ENTENDISTE? ROJO! FUEGO! ...' },
    { speaker: 'fireMaster', text: 'No fue gracioso.', emote: { who: 'gambler', symbol: '...' } },
    scamClosingLine,
  ],
  tank: [
    { speaker: 'scammer', text: 'UN TANQUE?! QUE CLIENTE MAS [[BLINDADO]]! BIENVENIDO A MI SALA [[VIP]]!', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'scammer', text: '...HOLA? ...NO HABLA? UN CLIENTE QUE NO REGATEA! EL CLIENTE [[PERFECTO]]!', emote: { who: 'gambler', symbol: '...' } },
    { speaker: 'scammer', text: 'TE DOY UN [[DESCUENTO]] SI TE RENDIS! ...NADA? NI UN "BRRRM"? QUE [[FRIALDAD]]!', emote: { who: 'gambler', symbol: '...' } },
    { speaker: 'scammer', text: 'BUENO, KID! SI NO VAS A HABLAR, VAMOS A LO QUE VINIMOS: A LOS [[CAÑONAZOS]]!' },
    scamClosingLine,
  ],
  cowboy: [
    { speaker: 'scammer', text: 'HOWDY, VAQUERO! EN ESTE [[SALOON]] EL UNICO QUE COBRA SOY YO!', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'cowboy', text: 'Este pueblo es chico para los dos, estafador.' },
    { speaker: 'scammer', text: 'ESTE PUEBLO ES MIO, KID! LO COMPRE A PRECIO DE [[REMATE]]!' },
    { speaker: 'cowboy', text: 'Entonces desenfunda. A la cuenta de tres.' },
    scamClosingLine,
  ],
  reflecter: [
    { speaker: 'scammer', text: 'REFLECTER! EL ROBOT ESPEJO DE PRISMA DYNAMICS! TE INTERESA UN [[ESPEJO DE REPUESTO]]? CASI SIN RAYONES!', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'reflecter', text: 'Mi escudo devuelve todo, Scammer. Incluso tus estafas.' },
    { speaker: 'scammer', text: 'ENTONCES NO TE VOY A VENDER NADA... TE LO VOY A [[REGALAR]]! (UN GOLPE EN LA CARA)' },
    scamClosingLine,
  ],
  switcher: [
    { speaker: 'scammer', text: 'SWITCHER! EL QUE CAMBIA DE MODO! YO TAMBIEN CAMBIO: DE [[VENDEDOR]] A [[LUCHADOR]]!', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'switcher', text: 'Rojo, azul o verde... cualquiera de mis modos alcanza para vos.' },
    { speaker: 'scammer', text: 'YO TAMBIEN TENGO TRES MODOS, KID: [[CARO]], [[MUY CARO]] Y [[NO HAY DEVOLUCIONES]]!' },
    scamClosingLine,
  ],
  sorcerer: [
    { speaker: 'scammer', text: 'UN HECHICERO! TENGO VARITAS MAGICAS [[CERTIFICADAS]]! ...SON PALITOS PINTADOS.', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'sorcerer', text: 'La verdadera magia no se vende, Scammer.' },
    { speaker: 'scammer', text: 'TODO SE VENDE, KID! HASTA LA MAGIA! HASTA TU [[ALMA]]! (ACEPTO EFECTIVO)' },
    { speaker: 'sorcerer', text: 'Entonces te voy a mostrar un truco: hacer desaparecer tu sonrisa.' },
    scamClosingLine,
  ],
  chrono: [
    { speaker: 'scammer', text: 'CHRONO! EL SEÑOR DEL TIEMPO! Y EL TIEMPO ES [[DINERO]]! ASI QUE SOS MILLONARIO, KID?', emote: { who: 'scammer', symbol: '$' } },
    { speaker: 'chrono', text: 'Tengo todo el tiempo del mundo. Y lo voy a usar para derrotarte.' },
    { speaker: 'scammer', text: 'PODES REBOBINAR LA PELEA? ENTONCES PODES PAGARME [[DOS VECES]]! JA JA JA!' },
    scamClosingLine,
  ],
  ghost: [
    { speaker: 'scammer', text: 'U-UN FANTASMA?! ...ESPERA. LOS FANTASMAS PAGAN? TENGO [[SABANAS DE LUJO]] A MITAD DE PRECIO!', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'ghost', text: 'Boooo... Te voy a perseguir hasta que termines de pagar tus deudas.' },
    { speaker: 'scammer', text: 'MIS DEUDAS NO TERMINAN NUNCA, KID! VAS A ESTAR OCUPADO TODA LA [[ETERNIDAD]]!' },
    scamClosingLine,
  ],
  monkey: [
    { speaker: 'scammer', text: 'UN MONO?! QUIEN DEJO ENTRAR A UN MONO A MI SALA [[VIP]]?!', emote: { who: 'scammer', symbol: '#!' } },
    { speaker: 'monkey', text: 'Uh uh! AH AH! *señala la maquina*' },
    { speaker: 'scammer', text: 'QUE? QUE LA MAQUINA TIENE BANANAS ADENTRO? NO! ...BUENO, TAL VEZ. NI YO SE QUE TIENE ADENTRO.' },
    { speaker: 'monkey', text: 'UUH UUH AH AH AH!!', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'scammer', text: 'OK, OK! UN DESAFIO ENTRE [[PRIMATES DE NEGOCIOS]]! QUE GANE EL MAS ASTUTO!' },
    scamClosingLine,
  ],
};
// what each fighter says when Scammer laughs and turns into NEO SCAMMER
const scamHeroNeoReactions = {
  normal: 'Que? Todavia no terminaste?',
  fireMaster: 'Mas grande... solo significa mas para quemar.',
  cowboy: 'Maldicion... el forastero tenia un as bajo la manga.',
  reflecter: 'Otra transformacion? Hoy es el dia de los jefes finales...',
  switcher: 'Ah, asi que vos tambien cambias de modo. Veamos cual es mejor.',
  sorcerer: 'Esa energia... no es magia. Es algo mucho peor.',
  gambler: 'Sabia que la casa guardaba una carta mas.',
  chrono: 'Si pudiera, rebobinaria esto hasta antes de entrar a la tienda.',
  ghost: 'Ni siquiera muerto me dejan en paz...',
  monkey: 'UUH?! AH AH AH?!',
};
const scamPickedLine = { speaker: 'scammer', text: 'NO ELEGISTE NADA?! EL TIEMPO ES DINERO, KID! Y VOS ME HICISTE PERDER [[10 SEGUNDOS]]!', emote: { who: 'scammer', symbol: '#!' } };
const scamNeoMockLines = [
  { speaker: 'scammer', text: 'JA... JA JA JA JA! QUE CARA, KID! EN SERIO CREISTE QUE ESO ERA TODO?!', mood: 'mock' },
  { speaker: 'scammer', text: 'ESO FUE LA [[VERSION DE PRUEBA]]! AHORA... DEJAME MOSTRARTE EL MODELO [[PREMIUM]]!', emote: { who: 'scammer', symbol: '$' } },
];
// NEO SCAMMER at 200 health: tired, but he will not give up (or give you the machine)
const neoScammerTiredHealth = 200;
const scamTiredLines = [
  { speaker: 'neoScammer', text: 'HAH... HAH... [[BATERIA BAJA]]... [[BATERIA BAJA]]...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'neoScammer', text: 'RENDIRME? YO? JA... JA JA! UN [[BIG SHOT]] NUNCA SE RINDE, KID!' },
  { speaker: 'neoScammer', text: 'LA MAQUINA ES MIA! MIA! NI POR TODO EL [[DINERO]] DEL MUNDO TE LA ENTREGO!', emote: { who: 'scammer', symbol: '#!' } },
];
// at 10 health: his best attack, ULTIMA OFERTA (you are shrunk inside a box and move freely to dodge)
const neoScammerFinalHealth = 10;
const scamFinalStartLines = [
  { speaker: 'neoScammer', text: 'SUFICIENTE!!! YA ME [[HARTASTE]], KID!!!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'neoScammer', text: 'VAS A CONOCER MI [[MEJOR OFERTA]]... MI ULTIMO, MAS GRANDE Y MAS CARO [[BIG SHOT]]!!!' },
  { speaker: 'neoScammer', text: 'AHORA ES TU OPORTUNIDAD DE SER... [[CHIQUITO]]!!! JA JA JA JA JA!', mood: 'mock' },
];
const scamFinalEndLines = [
  { speaker: 'neoScammer', text: 'N-NO... MI MEJOR OFERTA... [[RECHAZADA]]...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'neoScammer', text: 'M-MIS BATERIAS... MI [[BIG SHOT]]... KID... NI SE TE OCURRA...' },
];
const scamFinalBox = { x: 262, y: 185, width: 420, height: 290 };
const scamFinalIntroFrames = 130;
const scamFinalTransitionFrames = 60;
const scamFinalWhiteFrames = 60;
const scamFinalDamagePercent = 0.1;
const scamFinalPhases = [
  { frames: 800, pattern: 'eggs', title: '[[PIPIS]] GRATIS!', subtitle: 'Esquiva los huevos... y lo que sale de adentro' },
  { frames: 800, pattern: 'chasers', title: 'CLIENTES INSISTENTES', subtitle: 'Las cabezas te persiguen: no te quedes quieto' },
  { frames: 900, pattern: 'phones', title: '[[LLAMADA ENTRANTE]]', subtitle: 'Telefonos y ofertas por todos lados' },
  { frames: 900, pattern: 'lanes', title: 'LLUVIA DE [[BIG SHOTS]]', subtitle: 'Busca el hueco y quedate en el' },
  { frames: 900, pattern: 'diamonds', title: 'ALAS DE [[NEO]]', subtitle: 'Abanicos de disparos directo hacia vos' },
  { frames: 900, pattern: 'spinner', title: 'LA RULETA DEL [[DEAL]]', subtitle: 'Movete alrededor de los brazos que giran' },
  { frames: 1000, pattern: 'mix', title: '[[LIQUIDACION TOTAL]]', subtitle: 'TODO DEBE DESAPARECER! (VOS TAMBIEN)' },
  { frames: 0, pattern: 'finale', title: 'MI ULTIMO [[BIG SHOT]]', subtitle: 'Quedate en la franja segura!' },
];
// shorter grace after each hit than in the other final acts
const scamFinalInvulnerableFrames = 34;
const scamFinal = { active: false };
// the "dodge round" of chapter 5: Knight is shrunk inside a box and has to dodge (level 4: the chef and Mochi,
// level 5: the sheriff's justice). Each hit takes a percentage of his health, so it can never finish him.
const dodgeRound = { active: false };
const dodgeRoundBox = { x: 312, y: 200, width: 400, height: 270 };
const dodgeRoundDamagePercent = 0.08;
const dodgeRoundInvulnerableFrames = 36;
const dodgeRoundPhaseFrames = 380;
// the sheriff's round is longer (6 attacks) with shorter, harder phases
const dodgeRoundSheriffPhaseFrames = 330;
// the furious chef calls Mochi for the special round when Knight is winning and he is under half health
const chefSpecialRoundRatio = 0.5;
const dodgeRoundThemes = {
  spa: {
    title: 'RONDA ESPECIAL DE LA CASA',
    border: ['#ff8a65', '#fff59d'],
    phases: [
      { pattern: 'pastryRain', caption: 'CHEF: LLUVIA DE PASTELES!' },
      { pattern: 'glovePunches', caption: 'MOCHI: RAFAGA DE GUANTES!' },
      { pattern: 'mouseDash', caption: 'MOCHI: CARRERA DEL CAMPEON!' },
      { pattern: 'giantCake', caption: 'CHEF Y MOCHI: EL PASTEL GIGANTE!' },
    ],
  },
  sheriff: {
    title: 'JUSTICIA DEL SHERIFF',
    border: ['#fdd835', '#ff7043'],
    phases: [
      { pattern: 'lawBullets', caption: 'BALAS DE LA LEY!' },
      { pattern: 'starBounce', caption: 'ESTRELLAS DE SHERIFF!' },
      { pattern: 'bigRevolver', caption: 'EL REVOLVER DE LA JUSTICIA!' },
      { pattern: 'wantedRain', caption: 'SE BUSCA: VOS!' },
      { pattern: 'crossfire', caption: 'FUEGO CRUZADO!' },
      { pattern: 'judgment', caption: 'JUICIO FINAL DEL SHERIFF!' },
    ],
  },
};
const knightSheriffJusticeChance = 0.35;
// chapter 5, level 7: Light Warrior's BOX ATTACKS. Knight is shrunk into the box again, now with the
// CHARGED MODE: holding Q dashes, and a dash through a BLUE attack parries it (and hurts Light Warrior a little).
const lightBoxFirstDelay = 480;
const lightBoxInterval = 540;
const lightBoxPhaseFrames = 620;
// holding Q charges the dash: time slows down so you can aim (at the nearest blue attack, or with W A S D);
// letting go of Q launches the dash
const lightBoxSlowScale = 0.25;
const lightBoxChargeMaxFrames = 80;
const lightBoxDashSpeed = 12;
const lightBoxDashFrames = 12;
const lightBoxDashCooldown = 26;
const lightBoxParryDamage = 3;
// each parry also gives Knight back a little health
const lightBoxParryHealRatio = 0.02;
// after every BOX ATTACK the light heals Knight a lot
const lightBoxHealRatio = 0.35;
dodgeRoundThemes.lightBox1 = {
  title: 'BOX ATTACK!',
  border: ['#fff59d', '#4fc3f7'],
  charged: true,
  blueChance: 0.35,
  phaseFrames: lightBoxPhaseFrames,
  helpers: [{ variant: 'celesteGirl', color: '#4fc3f7', x: 110, confused: true }, { variant: 'setoBoy', color: '#66bb6a', x: 200, confused: true }],
  talk: [
    { speaker: 'lightWarrior', text: 'BOX ATTACK! ...Y para esta, voy a necesitar un poco de ayuda.' },
    { speaker: 'celeste', text: 'Eh? Donde estamos? Hace un segundo estabamos en la plaza...' },
    { speaker: 'seto', text: 'Y-yo estaba leyendo... Por que estamos arriba de las nubes?' },
    { speaker: 'lightWarrior', text: 'Despues les explico, chicos. Ahora... ataquen al caballero!' },
    { speaker: 'celeste', text: '...Bueno. Perdon, senor caballero!' },
  ],
  phases: [
    { pattern: 'chargedTutorial', caption: 'MODO CARGADO: MANTENE Q PARA EL DASH!' },
    { pattern: 'celesteKnives', caption: 'CELESTE: CUCHILLOS AL VUELO!' },
    { pattern: 'setoBooks', caption: 'SETO: LA BIBLIOTECA VOLADORA!' },
  ],
};
dodgeRoundThemes.lightBox2 = {
  title: 'BOX ATTACK 2!',
  border: ['#fff59d', '#ff8a65'],
  charged: true,
  blueChance: 0.3,
  phaseFrames: lightBoxPhaseFrames,
  helpers: [{ variant: 'chefBoss', color: '#ffffff', x: 100 }, { variant: 'mochiMouse', color: '#9e9e9e', x: 210, powered: true }],
  talk: [
    { speaker: 'lightWarrior', text: 'BOX ATTACK numero dos! Vengan, ustedes dos!' },
    { speaker: 'mochi', text: 'Eh!? Estaba en medio de mi entrenamiento!' },
    { speaker: 'chef', text: 'Y yo tengo pasteles en el horno, sabes!?' },
    { speaker: 'knight', text: 'Espera... Por que solo traes gente contra la que ya pelee?' },
    { speaker: 'lightWarrior', text: 'Eh... porque son los unicos que me atendieron el telefono! El resto me dejo en visto.' },
    { speaker: 'chef', text: 'Yo vine por las propinas. Que sean generosas!' },
  ],
  phases: [
    { pattern: 'pastryRain', caption: 'CHEF: LLUVIA DE PASTELES!' },
    { pattern: 'glovePunches', caption: 'MOCHI: RAFAGA DE GUANTES!' },
    { pattern: 'giantCake', caption: 'CHEF Y MOCHI: EL PASTEL GIGANTE!' },
  ],
};
dodgeRoundThemes.lightBox3 = {
  title: 'BOX ATTACK 3!',
  border: ['#fff59d', '#ffffff'],
  charged: true,
  blueChance: 0.3,
  phaseFrames: lightBoxPhaseFrames,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'Esta vez nada de invitados. Solo vos, yo... y la luz.' },
  ],
  phases: [
    { pattern: 'lightShots', caption: 'DISPAROS DE LUZ!' },
    { pattern: 'lightBeams', caption: 'COLUMNAS DE LUZ!' },
    { pattern: 'radiantRing', caption: 'ANILLO RADIANTE!' },
  ],
};
dodgeRoundThemes.lightBox4 = {
  title: 'BOX ATTACK 4!',
  border: ['#fff59d', '#ff7043'],
  charged: true,
  blueChance: 0.25,
  phaseFrames: lightBoxPhaseFrames,
  helpers: [{ variant: 'cowboy', color: '#c62828', x: 150, sheriff: true }],
  talk: [
    { speaker: 'lightWarrior', text: 'Para esta necesito a alguien con buena punteria...' },
    { speaker: 'cowboy', text: 'Yii-ha! Otra vez vos, forastero? ...Bueno, la ley es la ley.' },
    { speaker: 'knight', text: 'El tambien...?' },
    { speaker: 'lightWarrior', text: 'Me debia un favor. No preguntes.' },
    { speaker: 'cowboy', text: 'Vos pone la luz, yo pongo el plomo. A la cuenta de tres!' },
  ],
  phases: [
    { pattern: 'lawAndLight', caption: 'COMBO: BALAS Y COLUMNAS DE LUZ!' },
    { pattern: 'revolverPrism', caption: 'COMBO: EL REVOLVER BAJO LA LLUVIA DE LUZ!' },
    { pattern: 'crossfireRing', caption: 'COMBO: FUEGO CRUZADO RADIANTE!' },
  ],
};
// Shadow Jester's final act (chapter 5, level 8)
dodgeRoundThemes.jesterFinale = {
  title: 'ACTO FINAL: SIN TELON!',
  border: ['#b388ff', '#fdd835'],
  phaseFrames: 420,
  onEnd: 'riftClash',
  phases: [
    { pattern: 'suitStorm', caption: 'NAIPES ENVENENADOS!' },
    { pattern: 'jesterBombs', caption: 'BOMBAS DE RISA!' },
    { pattern: 'jesterDash', caption: 'CLONES DEL BUFON!' },
    // the big finale: the box grows to the whole screen for a long scythe shower... ending with the giant one
    { pattern: 'grandFinale', caption: 'EL GRAN FINAL: LLUVIA DE GUADANAS!', frames: 960 },
  ],
};
dodgeRoundThemes.lightBox5 = {
  title: 'BOX ATTACK FINAL!',
  border: ['#ffffff', '#fdd835'],
  charged: true,
  // after the last phase: the giant disc of light that has to be parried
  finale: true,
  blueChance: 0.35,
  phaseFrames: lightBoxPhaseFrames,
  helpers: [],
  talk: [
    { speaker: 'lightWarrior', text: 'Ultimo BOX ATTACK, caballero. Todo lo que me queda... va aca.' },
    { speaker: 'knight', text: 'Entonces lo voy a resistir todo.' },
  ],
  phases: [
    { pattern: 'cuttingDiscs', caption: 'DISCOS CORTANTES!' },
    { pattern: 'sunSphere', caption: 'EL SOL ERRANTE!' },
    { pattern: 'prismRain', caption: 'LLUVIA PRISMATICA!' },
    { pattern: 'discStorm', caption: 'TORMENTA DE DISCOS Y LUZ!' },
    { pattern: 'finalLight', caption: 'LA ULTIMA LUZ!' },
  ],
};
// Light Warrior cannot fall before the end of his last BOX ATTACK (he stays at this share of his health)
const lightWarriorBoxFloorRatio = 0.1;
// the climb up the Gran Farol, on the discs of light
const farolClimb = { active: false };
const farolClimbGravity = 0.62;
const farolClimbJump = -13.6;
const farolClimbSpeed = 4.8;
const farolClimbHitRatio = 0.04;
const farolClimbFallRatio = 0.05;
const farolClimbTaunts = ['No vas a llegar!', 'Bajate de ahi, caballero!', 'Esos discos son mios!', 'Detenete de una vez!', 'El farol no es tuyo!'];
// on top of the farol: Light Warrior uses the power of friendship
// the final round keeps the original health of the omega form
const omegaFinalHealth = lightWarriorOmegaTransformationHealth;
// OMEGA LIGHT WARRIOR's flying kicks: 10 of them. After the 5th he gives his spirits to Knight and fights
// for a while; the 10th ends in a clash (5 timed presses)
const omegaKickFight = { active: false };
const omegaKickTotal = 10;
const omegaKickBreakAfter = 5;
const omegaKickChargeFrames = 90;
const omegaKickLockFrames = 24;
const omegaKickSpeed = 17;
const omegaKickDamage = 40;
const omegaKickBreakFrames = 1200;
// with the 6 spirits Knight hits twice as hard and takes much less damage
const omegaSpiritDamageBoost = 2;
const omegaSpiritArmor = 0.55;
// the clash: how fast the line runs each time (the 5th is extremely slow)
const omegaClashSpeeds = [6, 8, 10.5, 13, 1.6];
const omegaClashMissRatio = 0.08;
// parrying a flying kick: Knight's swing has to have started at most this many frames before the kick reaches him
const omegaKickParryWindow = 10;
const omegaKickParryReach = 36;
const omegaKickParryDamage = 80;
const omegaKickStunFrames = 140;
let lightClashMusicFade = 1;
// what each side shouts in each clash (the 5th one, in slow motion)
const omegaClashShouts = ['EMPUJA!', 'MAS!', 'NO TE RINDAS!', 'AHORA, CABALLERO!', 'TODO LO QUE TENES!'];
// after the clash: both standing by a thread, and a talk
const knightFarolEndLines = [
  { speaker: 'lightWarrior', text: 'Je... jeje... Que pelea, caballero.' },
  { speaker: 'lightWarrior', text: 'Hace mucho que no me divertia tanto. En serio... la disfrute.' },
  { speaker: 'knight', text: 'Haah... haah...' },
  { speaker: 'lightWarrior', text: 'Pero dale, levantate. Esto todavia no termino. Te queda algo de fuerza, no?' },
  { speaker: 'knight', text: 'No... Ya no.' },
  { speaker: 'knight', text: 'No voy a destruir el farol. Y no voy a matarte, Light Warrior.' },
  { speaker: 'lightWarrior', text: '...Que?', emote: { who: 'scammer', symbol: '?' } },
  { speaker: 'knight', text: 'Vine hasta aca porque alguien me lo pidio... pero ya no se si era lo correcto.' },
  { speaker: 'darkWhisper', text: 'LEVANTATE. TERMINA EL TRABAJO. APAGA ESA LUZ.', possess: true },
  { speaker: 'knight', text: 'N-no... otra vez no... salite de mi cabeza...', possess: true },
  { speaker: 'lightWarrior', text: 'Ey, ey... estas bien? Te pusiste palido de golpe.', erase: true },
  { speaker: 'knight', text: '...Se fue. La voz... se fue.' },
  { speaker: 'lightWarrior', text: 'Que voz? Debe ser el cansancio, amigo. Le pasa a cualquiera.' },
  { speaker: 'lightWarrior', text: 'Bueno... si no vas a apagar el farol, que te parece si bajamos y comemos algo? Invito yo.' },
  { speaker: 'knight', text: '...Me parece bien.' },
];
const knightFarolTopLines = [
  { speaker: 'lightWarrior', text: '...Llegaste. Hasta la cima del Gran Farol.' },
  { speaker: 'knight', text: 'No pienso retroceder ahora, Light Warrior.' },
  { speaker: 'lightWarrior', text: 'Lo se. Por eso esta vez... no voy a pelear solo.' },
  { speaker: 'lightWarrior', text: 'Celeste, Seto, Mochi, el chef, el sheriff... y los espiritus de Robledal. Todos me prestaron algo hoy.' },
  { speaker: 'lightWarrior', text: 'Y eso tiene un nombre, caballero. Se llama... EL PODER DE LA AMISTAD!' },
  { speaker: 'knight', text: '...En serio vas a decir eso?', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'lightWarrior', text: 'Si! Y va a funcionar! AMIGOS... PRESTENME SU LUZ!', transform: true },
  { speaker: 'lightWarrior', text: 'OMEGA LIGHT WARRIOR. La luz de todos... en un solo guerrero.' },
  { speaker: 'knight', text: '...Funciono.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Entonces voy a tener que ser mas fuerte que todos ellos juntos.', glow: true },
];
const scamNeoLines = [
  { speaker: 'neoScammer', text: 'AHORA ES TU [[OPORTUNIDAD]] DE SER UN [[BIG SHOT]]!!!' },
  { speaker: 'neoScammer', text: 'CONTEMPLA A [[NEO SCAMMER]]! MAS GRANDE! MAS FUERTE! 100% MENOS [[REEMBOLSOS]]!' },
  { speaker: 'neoScammer', text: 'PREPARATE, KID! ESTA OFERTA ES POR TIEMPO [[LIMITADO]]!!!', emote: { who: 'scammer', symbol: '!!' } },
];
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
  'reflecterArcadeCompleted',
  'omegariusDefeated',
  'knightUnlocked',
  'shaolinDefeated',
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
  reflecterArcadeCompleted: 4500,
  omegariusDefeated: 5000,
  knightUnlocked: 3000,
  shaolinDefeated: 4000,
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
    reflecterArcadeCompleted: {
      title: 'Espejo irrompible',
      description: 'Destrui al Proyecto Titan y completa el capitulo de Reflecter en el modo Arcade.',
    },
    omegariusDefeated: {
      title: 'MARTILLO DE LA JUSTICIA',
      description: 'Derrota a Omegarius en el nivel secreto del capitulo de Reflecter en el modo Arcade. El veredicto: buen sparring, hermanito.',
    },
    shaolinDefeated: {
      title: '谢谢指教 (GRACIAS POR LA LECCION)',
      description: 'Derrota a Shang Ting, el maestro Shaolin, en su templo. Como llegaste hasta ahi? Nadie sabe. (Dicen que un vendedor muy insistente podria convencerlo de unirse...)',
    },
    knightUnlocked: {
      title: 'POR VALDORIA!',
      description: 'Vence al Caballero Guardian en el Castillo de Valdoria y reclama la recompensa. Knight ahora lucha a tu lado.',
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
    classicBot: 'Bot clasico (mas facil de vencer)',
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
// chapter 4 bosses, unlocked with bossrush too
const assemblerCharacterButton = document.getElementById('assemblerCharacterButton');
// the BIGSHOT code: NEO SCAMMER and his VIP sales room
const neoScammerCharacterButton = document.getElementById('neoScammerCharacterButton');
const scamShowroomMapButton = document.getElementById('scamShowroomMapButton');
let neoScammerCodeActive = false;
// the MEDIEVAL code: the Castillo de Valdoria map and the Knight's challenge
const knightCharacterButton = document.getElementById('knightCharacterButton');
const medievalCastleMapButton = document.getElementById('medievalCastleMapButton');
let medievalCodeActive = false;
// the MAGICTOWN code: (almost) everyone from chapter 5 and their maps
let magicTownCodeActive = false;
const magicTownVariants = ['mossBeast', 'darkKnight', 'darkKnightBoss', 'celesteGirl', 'setoBoy', 'mochiMouse', 'chefBoss', 'lanternGuard'];
const magicTownCharacterButtons = document.querySelectorAll('[data-magic-variant]');
const magicTownMapButtons = document.querySelectorAll('.magic-town-map');
const knightChallenge = { active: false };
// ---------------- the arcade's HARDCORE mode ----------------
// a whole chapter in a row: HARDCORE with 3 lives, HARDERCORE with 1 life and the health carried from level to level
const hardcoreRun = { active: false, mode: 'normal', chapter: 'normal', lives: 3, carry: null, pending: null };
const hardcoreStorageKey = 'moqueteHardcore';
const hardcoreRewards = { normal: 3000, harder: 7000 };
// ---------------- the secret boss: SHANG TING, the Shaolin master ----------------
// the way in: 8 fortune cookies from Scammer's shop (the 8th one has a note in Chinese), then the code KUNGFUTEA
const shaolinChallenge = { active: false };
let shaolinCodeActive = false;
const shaolinTempleMapButton = document.getElementById('shaolinTempleMapButton');
const shaolinHealth = 350;
// 5 x 1.6 = 8 base damage
const shaolinDamageMultiplier = 1.6;
const shaolinChallengeReward = 2500;
const shaolinCookiesNeeded = 8;
// playable after beating him with Scammer (with less health than the boss)
const shaolinUnlockStorageKey = 'moqueteShaolinUnlocked';
const playableShaolinHealth = 180;
const shaolinCharacterButton = document.getElementById('shaolinCharacterButton');
const shaolinForbiddenText = '不。(No.)';
const shaolinIntroLines = {
  generic: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: '...Eh? Perdon, que?', emote: { who: 'gambler', symbol: '?' } },
    { speaker: 'shang', text: '你的气很乱。(Tu chi esta muy desordenado.)' },
    { speaker: 'hero', text: 'No entiendo nada... me esta insultando? Parece que me esta insultando.' },
    { speaker: 'shang', text: '只有战斗才能让你明白。(Solo el combate te hara entender.)' },
    { speaker: 'hero', text: 'Bueno... eso fue un si a pelear? Lo voy a tomar como un si.' },
    { speaker: 'shang', text: '来吧！(Ven!)', emote: { who: 'scammer', symbol: '!' } },
  ],
  monkey: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: '哈哈！你好，师父！(Jaja! Hola, maestro!)', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'shang', text: '...你会说中文？(...Hablas chino?)', emote: { who: 'scammer', symbol: '?!' } },
    { speaker: 'hero', text: '猴子什么都会。(Los monos sabemos de todo.)' },
    { speaker: 'shang', text: '终于有人听得懂了... 那就让我看看你的功夫！(Por fin alguien me entiende... Entonces mostrame tu kung fu!)' },
  ],
  sorcerer: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'Gracias, maestro. Lei mucho sobre este templo en mis libros.' },
    { speaker: 'shang', text: '你听得懂？(Me entendes?)', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'hero', text: 'Un hechicero estudia todos los idiomas. Hasta los que no le sirven para nada.' },
    { speaker: 'shang', text: '你的气很强。我们来试试。(Tu chi es fuerte. Probemoslo.)' },
    { speaker: 'hero', text: 'Con mucho gusto. Pero no me rompa los anteojos... digo, el sombrero.' },
  ],
  gambler: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'No entendi nada... pero escuche algo que sonaba a "ocho". El ocho es de la suerte!' },
    { speaker: 'shang', text: '运气不是功夫。(La suerte no es kung fu.)' },
    { speaker: 'hero', text: 'Exacto, lo que yo decia! Apostemos: si gano, me das tu galleta de la fortuna.' },
    { speaker: 'shang', text: '...来吧。(...Ven.)' },
  ],
  fireMaster: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'No entendi ni una palabra. Pero si es un desafio... YO SOY EL FUEGO!', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'shang', text: '你的火太急了。(Tu fuego es demasiado impaciente.)' },
    { speaker: 'hero', text: 'Si, si, impaciente, lo que sea. Empezamos ya?' },
    { speaker: 'shang', text: '...就是太急了。(...Justamente por eso.)', emote: { who: 'scammer', symbol: '...' } },
  ],
  tank: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: '[ TRADUCTOR ACTIVADO ] ... [ ERROR: IDIOMA NO ENCONTRADO ]' },
    { speaker: 'shang', text: '铁做的？(Hecho de hierro?)', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'hero', text: '[ ERROR ] [ ERROR ] [ ...OBJETIVO: PELADO CON BIGOTE. INICIANDO COMBATE ]' },
    { speaker: 'shang', text: '铁也会碎。(El hierro tambien se rompe.)' },
  ],
  reflecter: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'Puedo reflejar cualquier ataque... pero no las palabras. Que dijo?' },
    { speaker: 'shang', text: '镜子只能反射，不能理解。(Un espejo refleja, pero no entiende.)' },
    { speaker: 'hero', text: '...Siento que me dijo algo profundo y no me entere de nada.' },
  ],
  chrono: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'Viaje por cientos de epocas... y nunca aprendi chino. Que verguenza.' },
    { speaker: 'shang', text: '时间不等人。(El tiempo no espera a nadie.)' },
    { speaker: 'hero', text: 'Eso me sono a algo sobre el tiempo. Ese es MI tema, abuelo.' },
  ],
  switcher: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'Modo rojo... modo azul... no, ninguno es modo traductor. Que dijiste?' },
    { speaker: 'shang', text: '心要专一。(La mente debe ser una sola.)' },
    { speaker: 'hero', text: 'Voy a fingir que entendi y voy a cambiar al modo rojo.' },
  ],
  ghost: [
    { speaker: 'shang', text: '...鬼？(...Un fantasma?)', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'hero', text: 'Booo...?' },
    { speaker: 'shang', text: '我不怕鬼。(No le temo a los fantasmas.)' },
    { speaker: 'hero', text: '...No se asusto. Nadie se asusta nunca. Que triste ser fantasma.' },
  ],
  scammer: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'NI HAO! ES LO UNICO QUE SE! ...TE INTERESA UNA GALLETA DE LA FORTUNA? 88 MONEDAS!', emote: { who: 'gambler', symbol: '$' } },
    { speaker: 'shang', text: '...你就是卖那些饼干的人？(...Vos sos el que vende esas galletas?)', emote: { who: 'scammer', symbol: '#!' } },
    { speaker: 'hero', text: 'ESO FUE UN SI? ESO SONO A UN SI!' },
    { speaker: 'shang', text: '不！那张纸条是我的！(NO! Ese papelito era MIO!)', mood: 'angry' },
    { speaker: 'hero', text: '...TE DOY UN 10% DE DESCUENTO EN TU PROPIO PAPELITO?' },
  ],
  cowboy: [
    { speaker: 'shang', text: '欢迎来到少林寺，年轻人。(Bienvenido al templo Shaolin, joven.)' },
    { speaker: 'hero', text: 'Howdy, forastero. No hablo... eso. Pero los duelos se entienden en cualquier idioma.' },
    { speaker: 'shang', text: '枪没有用。(Las pistolas no te van a servir.)' },
    { speaker: 'hero', text: 'Si, si, lo que digas, compadre. A la cuenta de tres.' },
  ],
};
const shaolinFortunes = [
  'TU NUMERO DE LA SUERTE ES EL QUE ESTA EN MI CUENTA BANCARIA.',
  'PRONTO VAS A RECIBIR DINERO... PARA GASTARLO ACA.',
  'UN DESCONOCIDO TE VA A VENDER ALGO. COMPRALO.',
  'ESTA GALLETA ESTA VENCIDA. IGUAL ESTABA RICA, NO?',
  'AYUDA, ESTOY ATRAPADO EN UNA FABRICA DE GALLETAS. (ES BROMA) (NO ES BROMA)',
  'EL QUE COMPRA UNA GALLETA, COMPRA DOS. ...VOS COMPRA DOS.',
  'HOY ES UN BUEN DIA PARA NO PEDIR REEMBOLSOS.',
];
const knightHealth = 260;
// the playable Knight (anyone except the castle's guardian in his own challenge) is weaker
const playableKnightHealth = 150;
const knightDamageMultiplier = 1.25;
const knightLungeDamage = 16;
const knightSlamDamage = 18;
const knightWaveDamage = 12;
const knightShieldDamageTaken = 0.2;
const knightLungeCooldown = 150;
const knightShieldCooldown = 330;
const knightSlamCooldown = 420;
const knightShieldFrames = 80;
// the Juicio del Rey cannot be stopped: a fixed leap (frames, height) with super armor while in the air
const knightSlamAirFrames = 44;
const knightSlamHeight = 150;
const knightSlamArmor = 0.5;
const knightChallengeReward = 1000;
// Arcade chapter 5: Knight's mission in the Bosque Lumina (7 levels, only the first one playable for now)
const knightArcadeProgressStorageKey = 'moqueteKnightArcadeProgress';
const knightArcadeLevelCount = 7;
const knightArcadePlayableLevels = 7;
// chapter 5 secret level 8: unlocked by the chapter 4 secret level, the Maquina Rara and Knight (Valdoria)
const knightSecretLevel = 8;
// (its content comes later: until then it shows as "coming soon" once the requirements are met)
const knightSecretLevelReady = true;
const knightSecretBeatenStorageKey = 'moqueteKnightSecretBeaten';
// level 8: SHADOW JESTER, stronger than in chapter 3; Knight hits a little softer but takes the hits better
const riftJesterHealth = 520;
const riftJesterDamage = 1.3;
const riftKnightDamage = 0.9;
const riftKnightArmor = 0.65;
// at this much health Shadow Jester gets angry and goes for his FINAL ACT (a box attack, then a clash he wins)
const riftFinalHealth = 300;
const riftClash = { active: false };
// after the giant scythe the ground at the foot of the farol is broken
let riftTerrainBroken = false;
const grandFinaleBox = { x: 40, y: 110, width: 944, height: 400 };
// after his victory: Shadow Jester takes Knight... and Light Warrior gets in the way
const knightRiftAbductLines = [
  { speaker: 'jester', text: 'Jijiji... Que siesta mas linda. Te venis conmigo, caballerito: en mi dimension el show NUNCA termina.', act: 'flash' },
  { speaker: 'jester', text: '...QUE?! MI PORTAL!', mood: 'angry', act: 'lwArrive' },
  { speaker: 'lightWarrior', text: 'Ey, ey, EY! No tengo la menor idea de que esta pasando aca...' },
  { speaker: 'lightWarrior', text: '...pero ese caballero tiene un te esperandolo. Soltalo.' },
  { speaker: 'jester', text: 'Ugh... el heroe de turno. Que ABURRIDO. Toma, un regalito: BOMBA SEGADORA!', mood: 'crazy', act: 'bomb' },
  { speaker: 'lightWarrior', text: 'AAAH! No veo nada! Que clase de bomba segadora es esa?!', act: 'chase' },
  { speaker: 'jester', text: '...Ay. AY. Quien puso una pared aca?!', mood: 'angry', act: 'bubble' },
  { speaker: 'jester', text: 'Quieto ahi, caballerito. Nada de despertarse antes del final.', act: 'lwAmbush' },
  { speaker: 'lightWarrior', text: 'Solta al caballero. AHORA.' },
  { speaker: 'jester', text: 'Venis a buscarlo, lucecita? JIJIJI... ADELANTE!', mood: 'crazy', act: 'brawl' },
  { speaker: 'lightWarrior', text: 'Se... ACABO!', act: 'clashBreak' },
  { speaker: 'jester', text: 'NO... NO, NO, NO! Por que no te caes?! ESTE NO ES TU SHOW!', mood: 'angry', act: 'scytheStorm' },
  { speaker: 'lightWarrior', text: 'Ugh... c-caballero...' },
  { speaker: 'jester', text: 'Haah... haah... Que... MOLESTO. Me hiciste sudar el maquillaje, lucecita.', mood: 'angry' },
  { speaker: 'jester', text: 'Esto no termina aca. Solo... se suspende la funcion.', act: 'escape' },
  { speaker: 'jester', text: '...Fin del primer acto. Jijiji... ji.' },
];
const riftAbductActFrames = { grab: 150, flash: 150, lwArrive: 100, bomb: 120, chase: 580, bubble: 100, lwAmbush: 90, brawl: 1020, clashBreak: 140, scytheStorm: 440, escape: 210 };
const riftWallX = 930;
const riftLampX = 470;
const knightRiftAngryLines = [
  { speaker: 'jester', text: '...Todavia de pie? TODAVIA?!', mood: 'angry' },
  { speaker: 'jester', text: 'Que caballero mas TERCO. Me estas arruinando el ritmo de toda la funcion.', mood: 'angry' },
  { speaker: 'jester', text: 'Se acabo el ensayo. Nada de risas, nada de bises... vamos directo al ACTO FINAL!', mood: 'crazy', emote: { who: 'scammer', symbol: '#!' } },
];
const knightRiftIntroLines = [
  { speaker: 'lightWarrior', text: 'Uf... que noche. Bajar todas esas escaleras despues de semejante pelea deberia ser ilegal.' },
  { speaker: 'knight', text: 'Todavia me tiemblan las piernas... y los brazos... y todo.' },
  { speaker: 'lightWarrior', text: 'Espera aca. Voy a buscarte algo para que te relajes: un te de las termas, de esos que te dejan nuevo. No te muevas, eh!', lwLeave: true },
  { speaker: 'knight', text: '...No pensaba ir a ningun lado.' },
  { speaker: 'darkKnightBoss', text: 'Vaya, vaya. El caballero de Valdoria... tomando aire como si nada.', captainIn: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Vos...! Fuiste vos el que se metio en mi cabeza.' },
  { speaker: 'darkKnightBoss', text: 'Fallaste, caballero. El farol sigue encendido, Light Warrior sigue libre... y rompiste nuestro trato.' },
  { speaker: 'knight', text: 'Nunca quise hacerlo! Me obligaron con amenazas... y ya no voy a seguir sus ordenes.' },
  { speaker: 'darkKnightBoss', text: 'Querer o no querer no importa. Las deudas con la Orden se pagan.' },
  { speaker: 'darkKnightBoss', text: 'Y yo no soy quien las cobra.', slam: true },
  { speaker: 'darkKnightBoss', text: 'Mi senor. El caballero de Valdoria es todo suyo.' },
  { speaker: 'knight', text: 'Q-que... que fue eso? De donde salio...?', captainGone: true, emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'knight', text: '(Ese... es su superior? Que clase de cosa es...?)' },
  { speaker: 'jester', text: 'JIJIJI... JAJAJAJAJA! Miren nada mas... el caballerito que no sabe cumplir sus promesas!', mood: 'crazy' },
  { speaker: 'knight', text: 'Quien... o que sos vos?' },
  { speaker: 'jester', text: 'Yo? Soy el que tira de los hilos, cariño. La Orden, el trato, esa vocecita en tu cabeza... todo, TODO era mi funcion!', mood: 'crazy' },
  { speaker: 'jester', text: 'Y vos me arruinaste el segundo acto. Sabes que les pasa a los actores que arruinan el show?' },
  { speaker: 'jester', text: 'Se los corta. Hilito... por hilito... por hilito. Jijiji.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'knight', text: 'Valdoria... Que le hicieron a Valdoria?!', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'jester', text: 'Valdoria? Ah, ese reinito de carton. Todavia nada. TODAVIA. Depende de cuanto me hagas reir antes de romperte.' },
  { speaker: 'knight', text: 'No se que sos... pero no te tengo miedo.' },
  { speaker: 'jester', text: 'JA! Te tiembla la armadura y todo! Me ENCANTA. QUE EMPIECE LA FUNCION... Y QUE NO QUEDE NADIE EN PIE!', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
];
// level 2: four dark knights of the Orden Sombria and their captain
const knightArcadeLevels = {
  2: { enemies: ['darkKnight', 'darkKnight', 'darkKnight', 'darkKnight', 'darkKnightBoss'], difficulties: ['medium', 'medium', 'medium', 'hard', 'hard'] },
  // level 3: Light Warrior's friends in Robledal
  3: { enemies: ['celesteGirl', 'setoBoy', 'robledalDuo'], difficulties: ['medium', 'medium', 'hard'] },
  // level 4: the hot springs... and their tiny champion
  4: { enemies: ['mochiMouse'], difficulties: ['hard'] },
  // level 5: Robledal's new sheriff... a cowboy
  5: { enemies: ['sheriffCowboy'], difficulties: ['hard'] },
  // level 6: the guard of the Gran Farol
  6: { enemies: ['lanternGuard'], difficulties: ['hard'] },
};
// Celeste: a troublesome little girl in light blue with a red bow... and knives
const celesteHealth = 120;
const celesteDamageMultiplier = 0.85;
const celesteThrowCooldown = 150;
const celesteBlinkCooldown = 300;
const celesteRainCooldown = 420;
const celesteThrowDamage = 7;
const celesteBlinkDamage = 14;
const celesteRainDamage = 9;
// Seto: her friend, a bit weaker... with stranger tricks, all of them from his magic books
// (a bouncing rune, a water spell that leaves a slippery puddle and a trap book with a ghostly fist)
const setoHealth = 105;
const setoDamageMultiplier = 0.8;
const setoTopCooldown = 200;
const setoBalloonCooldown = 260;
const setoBoxCooldown = 380;
const setoTopDamage = 6;
const setoBalloonDamage = 5;
const setoBoxDamage = 14;
const knightPlazaIntroLines = [
  { speaker: 'knight', text: 'Robledal, por fin... Que plaza tan linda. Y eso... es una nota clavada en el cartel?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'lightNote', text: '"A quien llegue al pueblo: hola! Soy Light Warrior. Aca viven unos amigos mios. Son buenos chicos... pero un poquito locos."' },
  { speaker: 'lightNote', text: '"Casi nunca viene alguien nuevo a Robledal, asi que se entusiasman MUCHO cuando ven una cara nueva."' },
  { speaker: 'lightNote', text: '"Ah, y les ENCANTA pelear. Mi consejo: mejor evitalos. Firmado: L.W."' },
  { speaker: 'knight', text: 'Evitarlos? Un caballero de Valdoria no es ningun cobarde.', glow: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Si quieren pelear, que vengan. ...Ademas, quizas ellos sepan donde encontrar a Light Warrior.', walk: 420 },
  { speaker: 'celeste', text: 'HOLAAAA! Una cara nueva! UNA CARA NUEVA!', girl: 'in', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'celeste', text: 'Sos un caballero de verdad? Con armadura y todo? ...Ya se! Vas a ser mi NUEVO AMIGO!' },
  { speaker: 'knight', text: 'Eh... un nuevo amigo? Supongo que...', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'celeste', text: 'Y los amigos JUEGAN conmigo! Mi juego favorito se llama... ESTE!', knives: true, emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'knight', text: 'Cuchillos?! ...Asi que de esto hablaba la nota. Esta bien, pequeña: juguemos.', emote: { who: 'gambler', symbol: '?!' } },
];
// Mochi: a tiny boxing mouse, champion of the hot springs (after a magic cake from the chef)
const mochiHealth = 140;
const mochiDamageMultiplier = 0.9;
const mochiFlurryCooldown = 190;
const mochiUppercutCooldown = 260;
const mochiCakeCooldown = 900;
const mochiJabDamage = 3;
const mochiUppercutDamage = 10;
const mochiCakeHeal = 12;
// at 10% health Mochi refuses to lose and calls the chef, who helps him from his stall by throwing pastries
// (a power pastry for Mochi, a sticky one for Knight)... as long as nothing gets broken
const mochiChefCallRatio = 0.1;
const mochiChefThrowFrames = 150;
const mochiPastryHeal = 8;
const mochiPastryDamage = 6;
// the "second round" cake the chef gives Mochi when he joins: back to half health
const mochiSecondRoundRatio = 0.5;
const mochiShieldFrames = 200;
const mochiCreamDamage = 9;
// what the chef throws, in this order: a power pastry, a sticky one, a cream shield, another sticky one, a cream bomb
const mochiPastryOrder = ['heal', 'sticky', 'shield', 'sticky', 'bomb'];
// the hot tubs of level 4 (x, size): Knight's Juicio del Rey can break them... and the chef will NOT like it
const hotSpringTubs = [[150, 1], [360, 1.1], [600, 1], [760, 0.9]];
let hotSpringTubsBroken = [false, false, false, false];
let knightChefFuryDone = false;
let knightSpaOutroPlayed = false;
// level 5: the jail of Robledal and its brand new sheriff (if Knight already met Cowboy at Valdoria, they remember)
const knightMetCowboyStorageKey = 'moqueteKnightMetCowboy';
// level 6: the guard of the Gran Farol (a halberd sweep, a long thrust and a blinding lantern flash)
const lanternGuardHealth = 180;
const lanternGuardDamageMultiplier = 1;
const guardSweepCooldown = 230;
const guardThrustCooldown = 170;
const guardFlashCooldown = 420;
const guardSweepDamage = 13;
const guardThrustDamage = 11;
const guardFlashDamage = 6;
const guardFallRatio = 0.1;
// level 7: the spirits of Robledal (each one gives a lot of health and the cooldowns are a little shorter)
const spiritKnightHealthBonus = 60;
const spiritLightHealthBonus = 70;
const spiritCooldownMultiplier = 0.8;
const spiritDamageTakenMultiplier = 0.75;
// Light Warrior steps back after every warning (his x on the bridge), and speaks when Knight gets this close
const knightApproachRetreatX = [470, 620, 760, 860];
const knightApproachWarnDistance = 210;
const knightApproachFinalDistance = 170;
const knightSpiritNames = ['Espiritu del Bosque', 'Espiritu del Camino', 'Espiritu de la Plaza', 'Espiritu de las Termas', 'Espiritu de la Ley', 'Espiritu del Farol'];
const knightSpiritColors = ['#9ccc65', '#b39ddb', '#4fc3f7', '#f48fb1', '#ffca28', '#fff59d'];
const knightApproachWarnings = [
  [{ speaker: 'lightWarrior', text: 'Caballero... Por favor, no sigas. Todavia estas a tiempo de irte.' }],
  [{ speaker: 'lightWarrior', text: 'Te lo pido de buena manera, amigo: date la vuelta. No quiero lastimarte.' }],
  [{ speaker: 'lightWarrior', text: 'Es la ultima vez que te lo digo. Si das un paso mas... no me vas a dejar otra opcion.' }],
];
const knightApproachFinalLines = [
  { speaker: 'lightWarrior', text: '...Esta bien.' },
  { speaker: 'lightWarrior', text: 'Vos te lo buscaste, caballero.' },
  { speaker: 'lightWarrior', text: 'Espiritus de Robledal... PRESTENME SU PODER!', summon: true },
  { speaker: 'lightWarrior', text: '...' },
  { speaker: 'lightWarrior', text: 'No. Asi no seria una pelea justa.' },
  { speaker: 'lightWarrior', text: 'Toma, caballero: tres de ellos son tuyos. Que gane el que tenga el corazon mas fuerte.', gift: true },
  { speaker: 'knight', text: '...Por que me ayudas?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'lightWarrior', text: 'Porque la luz nunca pelea con ventaja. Ahora... vamos arriba. Lejos del pueblo.', ascend: true },
  { speaker: 'lightWarrior', text: 'Aca arriba nadie mas va a salir lastimado. Solo vos y yo... y el farol mirandonos desde abajo.' },
  { speaker: 'knight', text: 'Entonces terminemos con esto, Light Warrior.', glow: true },
];
const knightGuardIntroLines = [
  { speaker: 'knight', text: 'Ahi esta... el Gran Farol. Desde aca su luz llega hasta el cielo.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'lanternGuard', text: 'ALTO AHI! Nadie se acerca al Gran Farol a esta hora de la noche.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Escuchame, por favor. La Orden Sombria amenaza a mi reino. Me pidieron destruir el farol... y entregarles a Light Warrior. Si no lo hago, Valdoria...' },
  { speaker: 'lanternGuard', text: 'DESTRUIR EL FAROL?!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'lanternGuard', text: 'Jamas. JAMAS te voy a dejar hacer eso. Ni a vos ni a nadie. Este farol es la vida de Robledal!' },
  { speaker: 'knight', text: '...No quiero pelear con vos.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'lanternGuard', text: 'Entonces date la vuelta. Si das un paso mas... en guardia.' },
  { speaker: 'knight', text: '(No tengo opcion... Perdoname.)' },
];
const knightGuardFallLines = [
  { speaker: 'knight', text: 'Basta... Ya basta.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Lo reconsidere. No voy a destruir el farol... y no voy a entregar a Light Warrior. Tiene que haber otra forma.' },
  { speaker: 'lanternGuard', text: 'Caballero...? ...Gracias.' },
  { speaker: 'darkWhisper', text: '(Que decepcion... Un trato es un trato, caballero.)', possess: true },
  { speaker: 'knight', text: 'Q-que...? Mi cuerpo... no me responde...!', possess: true, emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'knight', text: 'NO... DETENTE...!', possess: true },
  { speaker: 'knight', text: ' ', strike: true },
  { speaker: 'lanternGuard', text: 'El... farol... Cuidalo... por... favor...', dying: true },
  { speaker: 'knight', text: '...No. No, no, no... Yo no... YO NO QUERIA...', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'lightWarrior', text: 'Caballero...?', lw: 'in' },
  { speaker: 'lightWarrior', text: '...Que hiciste?' },
  { speaker: 'knight', text: 'No fui yo! Algo... alguien controlo mi cuerpo! Fue la Orden Sombria, ellos...', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'lightWarrior', text: '...', stare: true },
  { speaker: 'lightWarrior', text: 'Te perdono. Pero solo si te vas. Ahora mismo. Y no vuelvas a acercarte al farol.' },
  { speaker: 'knight', text: 'No puedo irme... Tengo un trato con los caballeros oscuros. Si no lo cumplo, Valdoria va a pagar las consecuencias.' },
  { speaker: 'lightWarrior', text: 'Te mintieron, caballero. El farol no le hace mal a nadie.' },
  { speaker: 'lightWarrior', text: 'Su luz es la que hace florecer el bosque, la que le da magia a los pasteles del chef... y la que hace que la gente de Robledal aguante golpes que tumbarian a cualquiera.' },
  { speaker: 'lightWarrior', text: 'Por eso el sheriff no se rendia. Por eso Celeste y Seto se levantaban una y otra vez. Esa luz los protege a todos.' },
  { speaker: 'lightWarrior', text: 'Voy a cuidar el farol. Pensa bien de que lado estas, caballero.', lw: 'leave' },
  { speaker: 'knight', text: '...', emote: { who: 'gambler', symbol: '...' } },
];
const sheriffCowboyHealth = 150;
// beaten, the sheriff refuses to give up: 25 seconds at 1 health, fighting harder than ever
// (Knight heals a little with every hit, and the screen turns red)
const sheriffStandFrames = 25 * 60;
const sheriffStandHealPerHit = 4;
const sheriffStandDamageBoost = 1.35;
const sheriffStandSpeedBoost = 1.2;
// if Knight won the first round with more than 80% health, the sheriff loses it: a much harder last round
const sheriffFuriousHealthRatio = 0.8;
const sheriffFuriousDamageBoost = 1.6;
const sheriffFuriousSpeedBoost = 1.4;
const sheriffFuriousHealPerHit = 2;
const sheriffFuriousBurstCooldown = 200;
const knightSheriffFuriousLines = [
  { speaker: 'cowboy', text: 'Ugh... No... NO. Ni siquiera te despeinaste el casco...', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'cowboy', text: 'Todo un pueblo confia en mi... y vos me barres como si fuera polvo del camino?!' },
  { speaker: 'cowboy', text: 'Je... jeje... JA JA JA JA! Esta bien, compañero. Esta bien...', mood: 'crazy', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'cowboy', text: 'Cargue el revolver hasta la ultima bala. Y no pienso caer hasta vaciarlo entero en esa armadura!', mood: 'crazy' },
  { speaker: 'knight', text: 'Sheriff... te estas pasando de la raya.', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'cowboy', text: 'VEINTICINCO SEGUNDOS, CABALLERO! VEINTICINCO! Y ESTA VEZ NO PIENSO PERDONARTE!', mood: 'crazy', emote: { who: 'scammer', symbol: '#!' } },
];
const knightSheriffFuriousEndLines = [
  { speaker: 'cowboy', text: 'Je... je... todavia... de pie... Casi... CASI te tenia...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'cowboy', text: 'Perdon por lo de recien, compañero. Hacia años que nadie me hacia perder la cabeza asi.' },
  { speaker: 'knight', text: 'Casi, sheriff. Fue el duelo mas dificil de mi viaje... y un honor.', glow: true },
];
const knightSheriffStandLines = [
  { speaker: 'cowboy', text: 'Ugh... Buen golpe, compañero...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'cowboy', text: 'Pero un sheriff no se rinde. No mientras este pueblo cuente conmigo.' },
  { speaker: 'cowboy', text: 'Puede que tu espada pegue mas fuerte... pero yo tengo algo que vos no: un pueblo entero detras de mi.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Apenas te mantenes en pie... Sos muy valiente, sheriff.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'cowboy', text: 'Una ultima ronda, compañero. Veinticinco segundos. Mientras siga de pie... este duelo no termino!', emote: { who: 'scammer', symbol: '!' } },
];
const knightSheriffEndLines = [
  { speaker: 'cowboy', text: 'Je... Veinticinco segundos... y todavia de pie.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'cowboy', text: 'Ganaste vos, compañero. Pero nadie va a decir que el sheriff de Robledal se rindio.' },
  { speaker: 'knight', text: 'Nadie lo va a decir. Fue un honor, sheriff.', glow: true },
];
const knightJailIntroLines = [
  { speaker: 'knight', text: 'La prision de Robledal... Dicen que aca encierran a los peores bandidos del reino.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'cowboy', text: 'Howdy, compañero. Lindo dia para pasear, eh?', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Y vos quien sos? ...Que es esa estrella en tu pecho?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'cowboy', text: 'Iba caminando por aca, de paso nomas... y los pueblerinos me adoptaron como su nuevo sheriff. Parece que nadie mas sabia usar un revolver.' },
  { speaker: 'cowboy', text: 'Y hablando de trabajo... alguien puso una recompensa por un caballero de armadura y capa roja. Te suena?', poster: true, emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'knight', text: 'Una recompensa... por MI?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'knight', text: '(Primero me piden favores... y ahora ponen precio a mi cabeza. Esto huele a la Orden Sombria.)' },
  { speaker: 'cowboy', text: 'Nada personal, compañero. Pero un sheriff cumple con su deber. Y la recompensa paga muy bien.' },
  { speaker: 'knight', text: 'Entonces vas a tener que ganartela.', glow: true },
];
const knightJailReunionLines = [
  { speaker: 'knight', text: 'La prision de Robledal... Dicen que aca encierran a los peores bandidos del reino.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'cowboy', text: 'Bueno, bueno, bueno... Pero si es el guardian de Valdoria en persona!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Vos... el pistolero del castillo. El que vino por mis mil monedas.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'cowboy', text: 'El mismo. Iba caminando por aca, de paso nomas... y los pueblerinos me adoptaron como su nuevo sheriff.' },
  { speaker: 'cowboy', text: 'Y que casualidad: alguien puso una recompensa por un caballero de armadura y capa roja. Esta vez el cartel de SE BUSCA es tuyo, compañero.', poster: true, emote: { who: 'scammer', symbol: '$' } },
  { speaker: 'knight', text: '(Una recompensa por mi... Esto huele a la Orden Sombria.)', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Asi que la historia se repite. Espada contra revolver... otra vez.' },
  { speaker: 'cowboy', text: 'Pero esta vez en MI pueblo. A la cuenta de tres, compañero.' },
  { speaker: 'knight', text: 'En guardia, sheriff.', glow: true },
];
// level 4 ending: a short victory at the hot springs...
const knightSpaVictoryLines = [
  { speaker: 'mochi', text: 'Ugh... me... ganaste... Ni con los pasteles del chef...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'mochi', text: 'Esta bien, lata con patas. Sos el nuevo campeon de las Aguas Termales.' },
  { speaker: 'chef', text: 'Bien peleado, caballero. Ahora si: pasa y relajate. La casa invita.' },
  { speaker: 'knight', text: 'Por fin... un baño caliente. Gracias.', emote: { who: 'gambler', symbol: '...' } },
];
const knightSpaChefVictoryLines = [
  { speaker: 'chef', text: 'Uff... uff... Esta bien. ESTA BIEN. Ganaste, caballero.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'mochi', text: 'Wow... le ganaste al CHEF! Nadie le gana al chef!' },
  { speaker: 'chef', text: 'Pero el jacuzzi... lo pagas vos.' },
  { speaker: 'knight', text: 'Si... me parece justo. Perdon.', emote: { who: 'gambler', symbol: '...' } },
];
// ...and on the way out, a dark knight waiting in an alley with a new order
const knightAlleyLines = [
  { speaker: 'knight', text: 'Que noche tan tranquila... Y ese farol gigante sigue brillando hasta el cielo.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'darkKnight', text: 'Psst... Caballero de Valdoria. Por aca.', dark: 'out', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'knight', text: 'Vos... uno de la Orden Sombria.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'darkKnight', text: 'Traigo un mensaje del capitan. Ves ese farol, el que ilumina el cielo? Es el Gran Farol de Robledal.', lantern: true },
  { speaker: 'darkKnight', text: 'Todos creen que es una bendicion... pero es una maldicion. Su luz hechiza a todo el pueblo. Por eso aca nadie es normal.' },
  { speaker: 'darkKnight', text: 'Ratones que boxean, chefs que cocinan magia, chicos que no se cansan nunca... Lo viste con tus propios ojos, no?' },
  { speaker: 'darkKnight', text: 'El capitan quiere que lo destruyas. Ya sabes... para liberar al pueblo. Y para asegurarnos de que a Valdoria no le pase NADA malo. *guiño, guiño*', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'knight', text: 'Destruir su luz... para salvarlos? Algo en todo esto no tiene sentido.', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'darkKnight', text: 'Tenemos un trato, recuerdas? Seria una pena que Valdoria tuviera un... accidente.' },
  { speaker: 'knight', text: '(Algo no me cierra... pero no puedo arriesgarme.)', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: '...Esta bien. Lo voy a hacer. Por las dudas.' },
  { speaker: 'darkKnight', text: 'Excelente. La Orden te estara mirando, caballero.', retreat: true },
];
// the furious chef: pastry bombs from the sky, a boomerang rolling pin and a boiling pot slam
const chefBossHealth = 200;
const chefBossDamageMultiplier = 1.1;
const chefRainCooldown = 320;
const chefPinCooldown = 220;
const chefPotCooldown = 360;
const chefRainDamage = 8;
const chefPinDamage = 10;
const chefPotDamage = 12;
const knightChefFuryLines = [
  { speaker: 'chef', text: '...', emote: { who: 'scammer', symbol: '!' }, chef: 'look' },
  { speaker: 'chef', text: 'Mi... jacuzzi...' },
  { speaker: 'chef', text: 'UNA SOLA CONDICION! UNA! NADA DE ROMPER NADA... Y LA ROMPISTE!!!', chef: 'in', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'mochi', text: 'Uh oh... Caballero, corre. Cuando el chef se enoja... nadie lo para.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'chef', text: 'Mochi, al costado. Este cliente es MIO.' },
  { speaker: 'knight', text: 'Fue... fue un accidente!', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'chef', text: 'EN MI COCINA NO EXISTEN LOS ACCIDENTES! A PELEAR!!!' },
];
const mochiChefShouts = { heal: 'TOMA, MOCHI!', sticky: 'CUIDADO, CABALLERO!', shield: 'ESCUDO DE CREMA!', bomb: 'BOMBA DE MERENGUE!' };
const knightMochiChefLines = [
  { speaker: 'mochi', text: 'N-no... NO! NO VOY A PERDER! NO EN MIS JACUZZIS!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'mochi', text: 'CHEEEEEF! AYUDAME! Por favor, por favor, POR FAVOR!' },
  { speaker: 'chef', text: 'Ay, Mochi... Esta bien, te voy a ayudar. PERO con una condicion.' },
  { speaker: 'chef', text: 'Nada de romper los jacuzzis, ni los faroles, ni mi puesto. NADA. Entendido?' },
  { speaker: 'chef', text: 'Toma, primero esto: un pastel de SEGUNDA RONDA. Y yo te cubro desde el puesto.', secondRound: true },
  { speaker: 'mochi', text: 'Entendido, chef! ...Preparate, lata con patas!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Dos contra uno otra vez? ...En este reino nadie conoce el juego limpio.', emote: { who: 'gambler', symbol: '...' } },
];
const knightSpaIntroLines = [
  { speaker: 'knight', text: 'Despues de esos dos... necesito relajarme. Las Aguas Termales del Loto: dicen que son las mejores del reino.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Jacuzzis, faroles, vapor, flores de cerezo... Esto es justo lo que necesitaba.' },
  { speaker: 'mochi', text: 'ALTO AHI, LATA CON PATAS!', mouse: 'in', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Eh? ...Quien dijo eso?', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'mochi', text: 'ACA ABAJO! Soy Mochi, el campeon de boxeo de las Aguas Termales! Nadie entra a MIS jacuzzis sin pelear conmigo!' },
  { speaker: 'knight', text: 'Un raton... con guantes de boxeo... me esta desafiando a MI?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'knight', text: '...Esta bien, pequeño. Acepto tu desafio.' },
];
const knightMochiLines = [
  { speaker: 'knight', text: '...', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Vaya. Que fuerza tan... asombrosa. Casi senti algo.' },
  { speaker: 'mochi', text: 'NO ES JUSTO! Esa armadura es TRAMPA! TRAMPA!', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'mochi', text: 'CHEF! CHEEEEF! Necesito uno de tus pasteles! YA!' },
  { speaker: 'chef', text: 'Ay, Mochi... otra vez peleando con los clientes? Esta bien, toma: un pastelito de loto. Solo uno, eh.', chef: 'in' },
  { speaker: 'mochi', text: 'ÑAM! ...MMMMM! SIENTO EL PODER!!!', cake: true, emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'knight', text: 'Que...? Su fuerza aumento?! Que clase de pastel era ese?!', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'chef', text: 'Mis pasteles son magicos, caballero. Que lo disfruten... y no me rompan los jacuzzis, por favor.', chef: 'back' },
  { speaker: 'mochi', text: 'AHORA SI, LATA CON PATAS! ROUND DOS!', emote: { who: 'scammer', symbol: '!' } },
];
// at the end Celeste insists and both of them team up, taking turns every few seconds
const robledalDuoHealth = 170;
const robledalDuoTurnFrames = 390;
const knightKidsTeamLines = [
  { speaker: 'seto', text: 'Uff... perdi yo tambien... Este caballero es MUY fuerte.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'celeste', text: 'NO! No se vale! Seto, juguemos JUNTOS contra el!', seto: 'in' },
  { speaker: 'seto', text: 'Juntos? ...Celeste, eso es trampa.' },
  { speaker: 'celeste', text: 'No es trampa si es entre AMIGOS! Porfa, porfa, porfa, PORFAAA!', emote: { who: 'scammer', symbol: '!!' } },
  { speaker: 'seto', text: '...Esta bien. Pero por turnos, eh. Una y uno.' },
  { speaker: 'knight', text: 'Los dos a la vez? ...De acuerdo. Vengan, pequeños.', glow: true, emote: { who: 'gambler', symbol: '!' } },
];
const knightSetoIntroLines = [
  { speaker: 'celeste', text: 'Jiji... perdi... Pero fue DIVERTIDISIMO! Sos el mejor amigo nuevo del mundo!', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'seto', text: 'CELESTE! Otra vez jugando con cuchillos?! Te dije que asi nadie quiere ser tu amigo!', seto: 'in' },
  { speaker: 'celeste', text: 'Pero el SI quiso! Mira, Seto: un caballero de verdad!' },
  { speaker: 'seto', text: 'Un caballero...? Y le ganaste a Celeste? Nadie le gana a Celeste!' },
  { speaker: 'seto', text: '...Bueno. Entonces ahora jugas conmigo. Y te aviso: mis juegos son MUCHO mas raros.' },
  { speaker: 'knight', text: 'Otro mas? Que pueblo tan... energico.', emote: { who: 'gambler', symbol: '...' } },
];
const darkKnightHealth = 70;
const darkKnightDamageMultiplier = 0.7;
const darkKnightBossHealth = 210;
const darkKnightBossDamageMultiplier = 1.05;
// before he falls, the captain stops the fight to make Knight an offer
const darkKnightDealRatio = 0.3;
const knightVillageIntroLines = [
  { speaker: 'knight', text: 'Por fin, fuera del bosque... Y eso de alla es... un pueblo enorme!', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Ahi voy a encontrar provisiones. Y quizas alguna noticia que llevarle al rey.' },
  { speaker: 'darkKnight', text: 'Alto ahi, caballerito de Valdoria.', dark: 'in', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Caballeros... oscuros?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'darkKnight', text: 'Nadie llega al pueblo sin pagar el peaje de la Orden Sombria. Y tu peaje... es tu espada.' },
  { speaker: 'knight', text: 'Un caballero de verdad jamas entrega su espada. Vengan de a uno... o todos juntos!', glow: true },
  { speaker: 'darkKnightBoss', text: 'Que arrogante. Muchachos... acaben con el.' },
];
const knightDarkDealLines = [
  { speaker: 'darkKnightBoss', text: 'BASTA! ...Sos fuerte, caballero de Valdoria. Mas de lo que pensaba.', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'darkKnightBoss', text: 'Pero esto no termina aca. Si me derrotas, voy a llamar a mi superior... y creeme: el no tiene piedad. Acabaria con vos en un instante.' },
  { speaker: 'knight', text: 'Que venga. No le temo a nadie.', glow: true, emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'darkKnightBoss', text: 'Ah, no? Entonces escucha bien, porque hay otra salida. Encontra a Light Warrior... y entreganoslo.' },
  { speaker: 'knight', text: 'Light Warrior? ...El me salvo la vida en ese bosque.', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'darkKnightBoss', text: 'Su luz es una molestia para la Orden, y lo queremos vivo. Traelo ante nosotros... y te dejamos en paz. A vos, y a tu querido reino de Valdoria.' },
  { speaker: 'knight', text: '...', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: '(Si su superior es tan fuerte como dice, Valdoria correria peligro... No puedo arriesgarme. No todavia.)' },
  { speaker: 'knight', text: 'Esta bien. Tenemos un trato.' },
  { speaker: 'darkKnightBoss', text: 'Sabia decision. La Orden te estara vigilando, caballero... No nos decepciones.', retreat: true },
];
const mossBeastHealth = 170;
const mossBeastDamageMultiplier = 0.9;
const mossRootCooldown = 230;
const mossRootDamage = 12;
const mossRootWarnFrames = 45;
// a little under half of its health, the Light Warrior's blast sends it flying
const mossBeastRescueRatio = 0.45;
const knightForestIntroLines = [
  { speaker: 'knight', text: 'Asi que este es el Bosque Lumina... El rey me envio a investigar los rumores sobre este lugar.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'En el castillo decian que era aterrador. Que nadie que entraba volvia a ser el mismo.' },
  { speaker: 'knight', text: 'Pero... esto no es para nada aterrador. Luciernagas, flores que brillan, un arroyo que suena como musica... Es casi agradable.', emote: { who: 'gambler', symbol: '?' } },
  { speaker: 'mossBeast', text: 'GRRRROOOOOAAAAAAR!!!', monster: 'in', emote: { who: 'scammer', symbol: '#!' } },
  { speaker: 'knight', text: 'Ahi esta. Sabia que tanta calma no podia durar.', emote: { who: 'gambler', symbol: '!' } },
  { speaker: 'knight', text: 'Atras, bestia! Por Valdoria... EN GUARDIA!', glow: true },
];
const knightLightLines = [
  { speaker: 'lightWarrior', text: 'Uff, justo a tiempo! Estas bien, caballero?', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Quien... quien sos? Y que fue esa luz?', emote: { who: 'gambler', symbol: '?!' } },
  { speaker: 'lightWarrior', text: 'Soy Light Warrior! Y eso fue un saludito de luz, jeje. Tranquilo: ese bicho solo estaba de mal humor. Ya va a volver a su cueva.' },
  { speaker: 'lightWarrior', text: 'Bienvenido al Bosque Lumina! Es uno de mis lugares favoritos, lo vengo a visitar siempre que puedo. De noche las flores brillan y los arroyos parecen cantar.' },
  { speaker: 'knight', text: 'En el castillo me dijeron que era un lugar maldito... lleno de peligros.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'lightWarrior', text: 'Peligroso? Naaa! Bueno... no TAN peligroso. Algun que otro monstruo gruñon, nada mas. No tenes que temerle.', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'knight', text: 'Un caballero de Valdoria no le teme a nada. ...Pero te agradezco la ayuda, guerrero de luz.' },
  { speaker: 'lightWarrior', text: 'De nada! Si vas a recorrer el bosque, cuidate mucho. Y si alguna vez necesitas luz... ya sabes a quien llamar!', emote: { who: 'scammer', symbol: '!' } },
];
// the Knight's welcome, the same for everyone
const knightHalt = { speaker: 'knight', text: 'Alto ahi, forastero! Nadie cruza las puertas de Valdoria sin pasar antes por mi espada.', emote: { who: 'scammer', symbol: '!' } };
const knightRewardRule = { speaker: 'knight', text: 'Esa recompensa es para quien venza al guardian del castillo. Y el guardian... soy yo.' };
const knightEnGuard = { speaker: 'knight', text: 'En guardia! Que el acero decida quien merece el oro.', emote: { who: 'scammer', symbol: '!' } };
const knightIntroGenericLines = [knightHalt, knightRewardRule, knightEnGuard];
// each fighter arrives at Valdoria for the reward (Sorcerer has the real story with the Knight)
const knightIntroHeroLines = {
  normal: [
    { speaker: 'normal', text: 'Aca es... "SE BUSCA CAMPEON. RECOMPENSA: 1000 MONEDAS DE ORO". Mil monedas por una pelea? Anotame.', emote: { who: 'gambler', symbol: '$' } },
    knightHalt,
    { speaker: 'normal', text: 'Un caballero de verdad? Con armadura y todo? ...Bueno, yo tengo puños.' },
    knightRewardRule,
    knightEnGuard,
  ],
  lightWarrior: [
    { speaker: 'lightWarrior', text: 'La luz me guio hasta este castillo. Dicen que aca espera una recompensa digna de un heroe.' },
    knightHalt,
    { speaker: 'lightWarrior', text: 'Luchas con honor, caballero. Lo veo en tu postura. Sera un combate justo.' },
    { speaker: 'knight', text: 'Al fin un rival con honor. Pero la luz no te va a salvar del acero, guerrero.' },
    knightEnGuard,
  ],
  fireMaster: [
    { speaker: 'fireMaster', text: 'MIL monedas de oro! Con eso me compro un volcan. Uno chiquito.', emote: { who: 'gambler', symbol: '$' } },
    knightHalt,
    { speaker: 'fireMaster', text: 'Esa armadura se ve pesada... y el metal se calienta MUY rapido, eh.' },
    { speaker: 'knight', text: 'Mi acero fue templado en el fuego de la forja real, muchacho. No le temo a tus llamas.' },
    knightRewardRule,
    knightEnGuard,
  ],
  tank: [
    knightHalt,
    { speaker: 'knight', text: 'Que... que clase de bestia de hierro sos vos? Nunca vi un carro de guerra tan extraño.', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'knight', text: 'No hablas, eh? Esta bien. Las armaduras se entienden a golpes.' },
    knightEnGuard,
  ],
  cowboy: [
    { speaker: 'cowboy', text: 'Vi el cartel en el pueblo. Mil monedas de oro... mas de lo que paga cualquier recompensa del desierto.' },
    knightHalt,
    { speaker: 'knight', text: 'Un arma de fuego... Que forma tan cobarde de pelear. Te voy a enseñar el valor del acero.' },
    { speaker: 'cowboy', text: 'Espada contra revolver, compañero. Veamos quien desenfunda primero.' },
    knightEnGuard,
  ],
  reflecter: [
    { speaker: 'reflecter', text: 'Coordenadas confirmadas: Castillo de Valdoria. Recompensa: 1000 monedas de oro. A Prisma le vendrian bien.' },
    knightHalt,
    { speaker: 'knight', text: 'Un golem de espejo! Mi reflejo en tu pecho no me asusta, criatura.', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'reflecter', text: 'Analizando... armadura de acero forjada a mano. Interesante. Te devuelvo cada golpe.' },
    knightRewardRule,
    knightEnGuard,
  ],
  switcher: [
    { speaker: 'switcher', text: 'Un castillo, una recompensa y un caballero. Que modo uso? ...Mejor todos.' },
    knightHalt,
    { speaker: 'knight', text: 'Cambias de forma como un duende del bosque. Da igual: todos caen ante mi espada.' },
    knightRewardRule,
    knightEnGuard,
  ],
  // the main story: the Sorcerer and the Knight already know each other
  sorcerer: [
    { speaker: 'sorcerer', text: 'Valdoria... Hace cien años que no pisaba este castillo. Y todavia tienen ese horrible cartel de recompensa.', emote: { who: 'gambler', symbol: '...' } },
    knightHalt,
    { speaker: 'knight', text: 'Esa tunica... ese baston... No puede ser.', emote: { who: 'scammer', symbol: '?!' } },
    { speaker: 'knight', text: 'EL HECHICERO DE LA TORRE NEGRA! El que convirtio al rey en sapo y desaparecio con el Grimorio Real!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
    { speaker: 'sorcerer', text: '"Sapo" es una palabra muy fea. Yo prefiero "anfibio real". Y el grimorio... lo tome prestado.' },
    { speaker: 'knight', text: 'Mi orden te busco durante un siglo entero. Esta recompensa... la puse YO, para que volvieras.' },
    { speaker: 'sorcerer', text: 'Una trampa? Que tierno. Vine por el oro, caballero, no por tus rencores viejos.', emote: { who: 'gambler', symbol: '...' } },
    { speaker: 'knight', text: 'Esta espada fue bendecida para cortar hechizos. Hoy vas a pagar por cada maldicion.', glow: true },
    { speaker: 'sorcerer', text: 'Entonces vamos. Mostrame si tu acero puede contra mi magia.', emote: { who: 'gambler', symbol: '!' } },
    { speaker: 'knight', text: 'POR VALDORIA Y POR EL REY! EN GUARDIA, HECHICERO!', glow: true, mood: 'angry', emote: { who: 'scammer', symbol: '!' } },
  ],
  gambler: [
    { speaker: 'gambler', text: 'MIL monedas de oro?! Eso es un JACKPOT medieval!', emote: { who: 'gambler', symbol: '$' } },
    knightHalt,
    { speaker: 'gambler', text: 'Te apuesto el doble a que no me ganas, caballero.' },
    { speaker: 'knight', text: 'Un apostador... El honor no se apuesta, bufon.' },
    knightEnGuard,
  ],
  chrono: [
    { speaker: 'chrono', text: 'Un castillo antiguo... Tempus nunca me dejo viajar tan atras en el tiempo. Y encima hay una recompensa.' },
    knightHalt,
    { speaker: 'knight', text: 'Un reloj que habla y vuela?! BRUJERIA!', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'chrono', text: 'No es brujeria, caballero. Es tecnologia. Y te va a dar una paliza.' },
    knightRewardRule,
    knightEnGuard,
  ],
  ghost: [
    { speaker: 'ghost', text: 'Uuuh... un castillo viejo y frio. Me siento como en casa. Y hay oro.' },
    knightHalt,
    { speaker: 'knight', text: 'Un espectro! Mi espada atraviesa almas en pena, fantasma.' },
    knightRewardRule,
    knightEnGuard,
  ],
  divineGeneral: [
    { speaker: 'divineGeneral', text: 'Este reino pide un campeon. Un General Divino responde al llamado.' },
    knightHalt,
    { speaker: 'knight', text: 'Tu presencia es... abrumadora. Pero un caballero de Valdoria no retrocede ante nadie.', emote: { who: 'scammer', symbol: '...' } },
    knightEnGuard,
  ],
  monkey: [
    { speaker: 'monkey', text: 'UH UH! AH AH! (señala el cartel con una banana)', emote: { who: 'gambler', symbol: '!' } },
    knightHalt,
    { speaker: 'knight', text: 'Un... mono? Vino un MONO a reclamar la recompensa?', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'monkey', text: 'UH UH AH AH!!!' },
    { speaker: 'knight', text: 'Muy bien, pequeña bestia. El reglamento no dice nada sobre monos. En guardia!' },
  ],
  knight: [
    knightHalt,
    { speaker: 'knight', text: 'Esa armadura... ese escudo... Sos igual a mi! Un impostor en mi propio castillo!', mood: 'angry', emote: { who: 'scammer', symbol: '#!' } },
    knightEnGuard,
  ],
  // the arcade bosses and mini bosses (bossrush) also come for the reward
  arcadeBoss: [
    { speaker: 'gangBoss', text: 'Asi que aca pagan mil monedas por romperle la cara a alguien? Mi banda y yo vivimos de eso.', emote: { who: 'gambler', symbol: '$' } },
    knightHalt,
    { speaker: 'knight', text: 'Un rufian de los barrios bajos. En Valdoria a los bandidos los echamos por encima de la muralla.' },
    { speaker: 'gangBoss', text: 'Ja! Lindo disfraz de lata. Cuando termine con vos, lo vendo por partes.' },
    knightEnGuard,
  ],
  icedThug: [
    { speaker: 'icedThug', text: 'Brrr... que frio hace en este castillo. Perfecto para mi. Vine por el oro.' },
    knightHalt,
    { speaker: 'knight', text: 'Tu aliento congela el aire... Sos un demonio del invierno?', emote: { who: 'scammer', symbol: '?' } },
    { speaker: 'icedThug', text: 'Un maton, nada mas. Pero tu armadura se va a quedar pegada de frio.' },
    knightEnGuard,
  ],
  iceMaster: [
    { speaker: 'iceMaster', text: 'Un castillo de piedra... Muy pronto va a ser un castillo de hielo. Y la recompensa, mia.' },
    knightHalt,
    { speaker: 'knight', text: 'El amo del hielo de las viejas leyendas... Pense que era un cuento para asustar niños.', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'iceMaster', text: 'Los cuentos tambien congelan, caballero.' },
    knightEnGuard,
  ],
  scammer: [
    { speaker: 'scammer', text: 'HOLA HOLA, CABALLERO! VENGO POR LA [[RECOMPENSA]]... Y DE PASO, TE INTERESA UN [[SEGURO CONTRA DRAGONES]]?', emote: { who: 'gambler', symbol: '$' } },
    knightHalt,
    { speaker: 'knight', text: 'Un mercader charlatan. El rey me advirtio sobre los de tu calaña.' },
    { speaker: 'scammer', text: 'CALAÑA? YO PREFIERO [[EMPRENDEDOR]]! MIL MONEDAS DE ORO... MENOS MI COMISION, CLARO.' },
    knightEnGuard,
  ],
  shadowJester: [
    { speaker: 'jester', text: 'JA JA JA! UN CASTILLO! UN REY! UN CABALLERO! ESTO ES UNA OBRA DE TEATRO... Y YO SOY EL BUFON!', mood: 'crazy' },
    knightHalt,
    { speaker: 'knight', text: 'Un bufon hecho de sombras... Esa risa me hiela la sangre.', emote: { who: 'scammer', symbol: '...' } },
    { speaker: 'jester', text: 'TRANQUI, CABALLERITO. SOLO QUIERO JUGAR UN RATO... Y LLEVARME TU ORO. JA JA!', mood: 'crazy' },
    knightEnGuard,
  ],
  neoScammer: [
    { speaker: 'neoScammer', text: 'AHORA ES TU [[OPORTUNIDAD]] DE CONOCER A UN [[BIG SHOT]], CABALLERO!!!' },
    knightHalt,
    { speaker: 'knight', text: 'Por todos los santos... Que clase de dragon de metal sos vos?!', emote: { who: 'scammer', symbol: '?!' } },
    { speaker: 'neoScammer', text: 'UN DRAGON? JA! SOY UN [[INVERSOR]]! Y ESTE CASTILLO SE VE COMO UNA [[OFERTA IMPERDIBLE]]!' },
    knightEnGuard,
  ],
  defectiveAssembler: [
    { speaker: 'assembler', text: '[ ENSAMBLAR... ENSAM... BLAR ] OBJETIVO: CA-CA-CABALLERO. PIEZAS... RECUPERABLES.' },
    knightHalt,
    { speaker: 'knight', text: 'Un golem roto que habla en acertijos... Pobre criatura. Te voy a dar un final digno.' },
    knightEnGuard,
  ],
  chronoRival: [
    { speaker: 'chronoBoost', text: 'Un castillo medieval... Con este poder podria viajar a cualquier epoca. Y elegi la que tenia recompensa.' },
    knightHalt,
    { speaker: 'knight', text: 'Esa energia azul... Un brujo del tiempo!', emote: { who: 'scammer', symbol: '!' } },
    { speaker: 'chronoBoost', text: 'Tempus me potencio para ganar, caballero. Y hoy no pienso perder contra nadie.' },
    knightEnGuard,
  ],
  titanUnit: [
    { speaker: 'titan', text: '[ PROYECTO TITAN EN LINEA ] [ OBJETIVO DETECTADO: CABALLERO MEDIEVAL ] [ AMENAZA: BAJA ]' },
    { speaker: 'knight', text: 'Por... por el rey... UN GIGANTE DE HIERRO!', emote: { who: 'scammer', symbol: '?!' } },
    { speaker: 'knight', text: 'No me importa tu tamaño, coloso. Un caballero de Valdoria no retrocede. Nunca!' },
    { speaker: 'titan', text: '[ AMENAZA RECALCULADA: MODERADA ]' },
    knightEnGuard,
  ],
  omegarius: [
    { speaker: 'omegarius', text: 'Que lindo castillo! Me recuerda a los sectores viejos de Prisma... pero con muchas mas banderas.' },
    knightHalt,
    { speaker: 'knight', text: 'Un caballero de bronce con un martillo enorme... Venis de alguna orden lejana?' },
    { speaker: 'omegarius', text: 'Algo asi, jeje. Pero no vine por el oro: quiero ver como pelea un caballero de verdad. Un sparring, nada mas.' },
    { speaker: 'knight', text: 'Un duelo de honor... Acepto con gusto, hermano de armas. En guardia!', emote: { who: 'scammer', symbol: '!' } },
  ],
};
// the Sorcerer wins: "you fought well, but you are still weak"... and the Knight swears to get stronger
const knightSorcererOutroLines = [
  { speaker: 'sorcerer', text: 'Ja... Peleaste bien, caballero. Mejor de lo que esperaba de un hombre de lata.', emote: { who: 'gambler', symbol: '...' } },
  { speaker: 'knight', text: 'Ugh... Cien años... Cien años entrenando para este momento... y aun asi...', emote: { who: 'scammer', symbol: '...' } },
  { speaker: 'sorcerer', text: 'Y aun asi sos debil. Tu acero no corta mi magia. Ni hoy, ni en cien años mas.' },
  { speaker: 'knight', text: 'Disfrutalo mientras puedas, hechicero...', stand: true },
  { speaker: 'knight', text: 'Juro por mi espada y por el rey que me voy a hacer mas fuerte. Y el dia que vuelvas a cruzar esa puerta... te voy a vencer.', stand: true, glow: true, mood: 'angry', emote: { who: 'scammer', symbol: '!' } },
  { speaker: 'sorcerer', text: 'Te espero, caballero. Mientras tanto, me llevo mis mil monedas. Y saludame al sapo.', emote: { who: 'gambler', symbol: '$' } },
];
const chronoBoostCharacterButton = document.getElementById('chronoBoostCharacterButton');
const titanCharacterButton = document.getElementById('titanCharacterButton');
const omegariusCharacterButton = document.getElementById('omegariusCharacterButton');
const chapterFourBossVariants = ['defectiveAssembler', 'chronoRival', 'titanUnit', 'omegarius'];
const arcadeBossCharacterButtons = [gangBossCharacterButton, icedThugCharacterButton, iceMasterCharacterButton, shadowJesterCharacterButton, assemblerCharacterButton, chronoBoostCharacterButton, titanCharacterButton, omegariusCharacterButton];
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
const knightArcadeChapterButton = document.getElementById('knightArcadeChapterButton');
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
const classicBotToggle = document.getElementById('classicBotToggle');
// "classic bot" setting: the older, simpler bot AI (easier to beat), for anyone stuck in the arcade
const classicBotStorageKey = 'moqueteClassicBot';
let classicBotAI = false;
try {
  classicBotAI = localStorage.getItem(classicBotStorageKey) === '1';
} catch (error) {
  classicBotAI = false;
}
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
const shopRadioButton = document.getElementById('shopRadioButton');
const scamChallengeScreen = document.getElementById('scamChallengeScreen');
const scamChallengePortrait = document.getElementById('scamChallengePortrait');
const scamChallengeLine = document.getElementById('scamChallengeLine');
const scamChallengeGrid = document.getElementById('scamChallengeGrid');
const scamChallengeTimerBar = document.getElementById('scamChallengeTimerBar');
const scamChallengeTimerText = document.getElementById('scamChallengeTimerText');
const shopRadioPanel = document.getElementById('shopRadioPanel');
const shopRadioList = document.getElementById('shopRadioList');
const shopRadioLinkInput = document.getElementById('shopRadioLink');
const shopRadioStatus = document.getElementById('shopRadioStatus');
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

