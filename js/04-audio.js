// Moquete - Audio: efectos, musica del menu y temas de pelea
// (parte 4 de 10; los archivos se cargan en orden desde index.html)

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
  if (scammerBattleTrack) scammerBattleTrack.volume = 0.7 * audioSettings.master * audioSettings.music;
  if (jesterTracks.battle) jesterTracks.battle.volume = getJesterBattleVolume();
  if (jesterDialogLoop.gain) jesterDialogLoop.gain.gain.value = getJesterMusicVolume();
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

function playOmegaBattleTrack() {
  if (typeof Audio === 'undefined') return;
  if (!omegaBattleTrack) {
    omegaBattleTrack = new Audio(omegaBattleTrackSource);
    omegaBattleTrack.preload = 'auto';
    omegaBattleTrack.loop = true;
  }
  omegaBattleTrack.volume = audioSettings.master * audioSettings.music;
  omegaBattleTrack.currentTime = 0;
  const playPromise = omegaBattleTrack.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

function playScammerBattleTrack() {
  if (typeof Audio === 'undefined') return;
  if (!scammerBattleTrack) {
    scammerBattleTrack = new Audio(scammerBattleTrackSource);
    scammerBattleTrack.preload = 'auto';
    scammerBattleTrack.loop = true;
  }
  scammerBattleTrack.volume = 0.7 * audioSettings.master * audioSettings.music;
  try {
    scammerBattleTrack.currentTime = 0;
  } catch (error) {
    // Some browsers reject seeking before metadata loads; playback still starts from the beginning.
  }
  const playPromise = scammerBattleTrack.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

function stopScammerBattleTrack() {
  if (!scammerBattleTrack) return;
  scammerBattleTrack.pause();
}

function getJesterMusicVolume() {
  return 0.7 * audioSettings.master * audioSettings.music;
}

function getJesterBattleVolume() {
  return 0.5 * audioSettings.master * audioSettings.music;
}

function startJesterAudio(track) {
  try {
    track.currentTime = 0;
  } catch (error) {
    // Seeking can fail before metadata loads; playback still starts from the beginning.
  }
  const playPromise = track.play();
  if (playPromise && playPromise.catch) playPromise.catch(() => {});
}

// Dialog music. Preferred path: the decoded song loops sample-accurately through Web Audio (no gap at all).
// When the file can't be fetched (e.g. the game opened straight from disk), two copies of the song
// crossfade briefly near the end so the repeat is not noticeable.
function loadJesterDialogBuffer() {
  const loop = jesterDialogLoop;
  if (loop.bufferState !== 'idle' || typeof fetch === 'undefined') return;
  const audio = ensureAudio();
  if (!audio) return;
  loop.bufferState = 'loading';
  fetch(jesterDialogTrackSource)
    .then((response) => {
      if (!response.ok) throw new Error('music fetch failed');
      return response.arrayBuffer();
    })
    .then((data) => new Promise((resolve, reject) => audio.decodeAudioData(data, resolve, reject)))
    .then((buffer) => {
      loop.buffer = buffer;
      loop.bufferState = 'ready';
    })
    .catch(() => {
      loop.bufferState = 'failed';
    });
}

function getJesterDialogLoopPoints(buffer) {
  // skip the few milliseconds of silence mp3 encoders pad at both ends (never more than 0.1s)
  const channel = buffer.getChannelData(0);
  const limit = Math.floor(buffer.sampleRate * 0.1);
  let first = 0;
  while (first < limit && Math.abs(channel[first]) < 0.0005) first += 1;
  let last = channel.length - 1;
  while (channel.length - 1 - last < limit && Math.abs(channel[last]) < 0.0005) last -= 1;
  return { start: first / buffer.sampleRate, end: (last + 1) / buffer.sampleRate };
}

function playJesterDialogBuffer() {
  const loop = jesterDialogLoop;
  const audio = ensureAudio();
  if (!audio || !loop.buffer) return false;
  if (loop.source) return true;
  const points = getJesterDialogLoopPoints(loop.buffer);
  loop.gain = audio.createGain();
  loop.gain.gain.value = getJesterMusicVolume();
  loop.gain.connect(audio.destination);
  loop.source = audio.createBufferSource();
  loop.source.buffer = loop.buffer;
  loop.source.loop = true;
  loop.source.loopStart = points.start;
  loop.source.loopEnd = points.end;
  loop.source.connect(loop.gain);
  loop.source.start(0, points.start);
  return true;
}

function tickJesterDialogLoop() {
  const loop = jesterDialogLoop;
  const current = loop.players[loop.active];
  const next = loop.players[1 - loop.active];
  const volume = getJesterMusicVolume();
  if (!current) return;
  if (loop.fadeStart === null) {
    if (current.paused) return;
    current.volume = volume;
    const duration = current.duration;
    // start a little before the real end so the tick interval can never miss it
    if (Number.isFinite(duration) && duration > 2 && current.currentTime >= duration - jesterDialogCrossfadeSeconds - 0.15) {
      loop.fadeStart = performance.now();
      next.volume = 0;
      startJesterAudio(next);
    }
    return;
  }
  const progress = Math.min(1, (performance.now() - loop.fadeStart) / (jesterDialogCrossfadeSeconds * 1000));
  // equal-power curve keeps the overall loudness steady during the overlap
  current.volume = volume * Math.cos(progress * Math.PI / 2);
  next.volume = volume * Math.sin(progress * Math.PI / 2);
  if (progress >= 1 || current.ended) {
    next.volume = volume;
    current.pause();
    loop.active = 1 - loop.active;
    loop.fadeStart = null;
  }
}

function playJesterDialogLoop() {
  const loop = jesterDialogLoop;
  if (!loop.players.length) {
    loop.players = [0, 1].map(() => {
      const track = new Audio(jesterDialogTrackSource);
      track.preload = 'auto';
      track.loop = false;
      return track;
    });
    jesterTracks.dialog = loop.players[0];
  }
  if (loop.source) return;
  if (loop.bufferState === 'ready' && playJesterDialogBuffer()) {
    loop.players.forEach((track) => track.pause());
    return;
  }
  if (loop.timer && !loop.players[loop.active].paused) return;
  loop.players.forEach((track) => track.pause());
  loop.active = 0;
  loop.fadeStart = null;
  loop.players[0].volume = getJesterMusicVolume();
  startJesterAudio(loop.players[0]);
  if (!loop.timer) loop.timer = setInterval(tickJesterDialogLoop, 50);
}

function stopJesterDialogLoop() {
  const loop = jesterDialogLoop;
  if (loop.timer) {
    clearInterval(loop.timer);
    loop.timer = null;
  }
  loop.fadeStart = null;
  loop.players.forEach((track) => track.pause());
  if (loop.source) {
    try {
      loop.source.stop();
    } catch (error) {
      // already stopped
    }
    loop.source.disconnect();
    loop.gain.disconnect();
    loop.source = null;
    loop.gain = null;
  }
}

function playJesterTrack(kind) {
  if (typeof Audio === 'undefined') return;
  if (kind === 'dialog') {
    if (jesterTracks.battle) jesterTracks.battle.pause();
    playJesterDialogLoop();
    return;
  }
  stopJesterDialogLoop();
  if (!jesterTracks.battle) {
    jesterTracks.battle = new Audio(jesterBattleTrackSource);
    jesterTracks.battle.preload = 'auto';
    jesterTracks.battle.loop = true;
  }
  jesterTracks.battle.volume = getJesterBattleVolume();
  jesterTracks.battle.pause();
  startJesterAudio(jesterTracks.battle);
}

function stopJesterTracks() {
  stopJesterDialogLoop();
  if (jesterTracks.battle) jesterTracks.battle.pause();
}

function isJesterArcadeFight() {
  return normalArcadeActive && arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 6;
}

function isScammerArcadeFight() {
  return normalArcadeActive && arcadeChapter === 'gambler' && selectedNormalArcadeLevel === 5;
}

function stopOmegaBattleTrack() {
  if (!omegaBattleTrack) return;
  omegaBattleTrack.pause();
  omegaBattleTrack.currentTime = 0;
}

function playSound(soundName, options = {}) {
  if (soundName === 'scamItemWhoosh') {
    playNoise({ duration: 0.12, volume: 0.06, filterFrequency: 2400 });
    playTone({ frequency: 900, duration: 0.1, type: 'triangle', volume: 0.035, slideTo: 420 });
  } else if (soundName === 'cutsceneStep') {
    playNoise({ duration: 0.05, volume: 0.05, filterFrequency: 380 });
    playTone({ frequency: 90, duration: 0.05, type: 'sine', volume: 0.05, slideTo: 60 });
  } else if (soundName === 'dumpsterRattle') {
    playNoise({ duration: 0.07, volume: 0.07, filterFrequency: 2600 });
    playTone({ frequency: 170 + Math.random() * 60, duration: 0.06, type: 'square', volume: 0.035, slideTo: 120 });
  } else if (soundName === 'dumpsterBurst') {
    playKick({ volume: 0.24 });
    playNoise({ duration: 0.45, volume: 0.14, filterFrequency: 1800 });
    playTone({ frequency: 520, duration: 0.5, type: 'triangle', volume: 0.07, slideTo: 480 });
    playTone({ frequency: 780, duration: 0.42, type: 'triangle', volume: 0.05, slideTo: 740, delay: 0.02 });
    playTone({ frequency: 240, duration: 0.3, type: 'sawtooth', volume: 0.06, slideTo: 90, delay: 0.05 });
  } else if (soundName === 'cutsceneLand') {
    playKick({ volume: 0.2 });
    playNoise({ duration: 0.12, volume: 0.07, filterFrequency: 700 });
  } else if (soundName === 'cutsceneSurprise') {
    playTone({ frequency: 520, duration: 0.09, type: 'square', volume: 0.06, slideTo: 1040 });
    playTone({ frequency: 1040, duration: 0.1, type: 'square', volume: 0.05, delay: 0.08 });
  } else if (soundName === 'cutsceneQuestion') {
    playTone({ frequency: 420, duration: 0.08, type: 'triangle', volume: 0.06, slideTo: 520 });
    playTone({ frequency: 620, duration: 0.12, type: 'triangle', volume: 0.05, slideTo: 760, delay: 0.09 });
  } else if (soundName === 'cutsceneCash') {
    playNoise({ duration: 0.05, volume: 0.06, filterFrequency: 3200 });
    playTone({ frequency: 1320, duration: 0.12, type: 'square', volume: 0.05, delay: 0.04 });
    playTone({ frequency: 1760, duration: 0.24, type: 'triangle', volume: 0.06, delay: 0.12 });
  } else if (soundName === 'cutsceneAngry') {
    playTone({ frequency: 110, duration: 0.4, type: 'sawtooth', volume: 0.09, slideTo: 70 });
    playTone({ frequency: 116, duration: 0.4, type: 'sawtooth', volume: 0.07, slideTo: 74 });
    playNoise({ duration: 0.3, volume: 0.05, filterFrequency: 500 });
  } else if (soundName === 'cutsceneLaugh') {
    [0, 0.12, 0.24].forEach((delay, index) => {
      playTone({ frequency: 520 - index * 40, duration: 0.08, type: 'square', volume: 0.05, slideTo: 440 - index * 40, delay });
    });
  } else if (soundName === 'realityCrack') {
    playNoise({ duration: 0.4, volume: 0.16, filterFrequency: 3000 });
    playTone({ frequency: 70, duration: 0.6, type: 'sawtooth', volume: 0.1, slideTo: 35 });
    playTone({ frequency: 1400, duration: 0.15, type: 'square', volume: 0.04, slideTo: 300 });
  } else if (soundName === 'jesterSuitSummon') {
    [0, 0.05, 0.1, 0.15, 0.2, 0.25].forEach((delay, index) => {
      playTone({ frequency: 660 + index * 110, duration: 0.12, type: 'triangle', volume: 0.13, delay });
    });
    playTone({ frequency: 220, duration: 0.4, type: 'sine', volume: 0.16, slideTo: 330 });
  } else if (soundName === 'jesterSuitLaunch') {
    playNoise({ duration: 0.18, volume: 0.22, filterFrequency: 2600 });
    playTone({ frequency: 1200, duration: 0.18, type: 'square', volume: 0.11, slideTo: 400 });
  } else if (soundName === 'jesterSuitHit') {
    playNoise({ duration: 0.08, volume: 0.32, filterFrequency: 3800 });
    playTone({ frequency: 880, duration: 0.08, type: 'square', volume: 0.16, slideTo: 1320 });
  } else if (soundName === 'jesterTeleport') {
    playTone({ frequency: 1500, duration: 0.14, type: 'sine', volume: 0.22, slideTo: 200 });
    playTone({ frequency: 200, duration: 0.14, type: 'triangle', volume: 0.16, slideTo: 1600, delay: 0.1 });
    playNoise({ duration: 0.12, volume: 0.13, filterFrequency: 5000, delay: 0.08 });
  } else if (soundName === 'jesterBoxTick') {
    playTone({ frequency: 1800, duration: 0.025, type: 'square', volume: 0.1 });
  } else if (soundName === 'jesterBoxPop') {
    playTone({ frequency: 180, duration: 0.3, type: 'triangle', volume: 0.32, slideTo: 720 });
    playTone({ frequency: 720, duration: 0.25, type: 'sine', volume: 0.19, slideTo: 360, delay: 0.12 });
    playNoise({ duration: 0.25, volume: 0.34, filterFrequency: 1400 });
    playKick({ volume: 0.18 });
  } else if (soundName === 'jesterScytheThrow') {
    playNoise({ duration: 0.3, volume: 0.32, filterFrequency: 1800 });
    playTone({ frequency: 300, duration: 0.3, type: 'sawtooth', volume: 0.13, slideTo: 900 });
  } else if (soundName === 'jesterScytheSpin') {
    playNoise({ duration: 0.12, volume: 0.16, filterFrequency: 1200 });
  } else if (soundName === 'jesterScytheHit') {
    playNoise({ duration: 0.14, volume: 0.34, filterFrequency: 4500 });
    playTone({ frequency: 1600, duration: 0.3, type: 'triangle', volume: 0.19, slideTo: 1400 });
    playTone({ frequency: 2400, duration: 0.25, type: 'sine', volume: 0.13, delay: 0.02 });
  } else if (soundName === 'jesterScytheCatch') {
    playTone({ frequency: 520, duration: 0.08, type: 'square', volume: 0.16 });
    playTone({ frequency: 780, duration: 0.12, type: 'square', volume: 0.16, delay: 0.07 });
  } else if (soundName === 'jesterLuckSteal') {
    [0, 0.07, 0.14, 0.21, 0.28].forEach((delay, index) => {
      playTone({ frequency: 1320 - index * 180, duration: 0.1, type: 'triangle', volume: 0.16, delay });
    });
    playTone({ frequency: 110, duration: 0.6, type: 'sawtooth', volume: 0.19, slideTo: 60, delay: 0.3 });
  } else if (soundName === 'jesterStormClash') {
    playNoise({ duration: 0.2, volume: 0.3, filterFrequency: 5200 });
    playTone({ frequency: 1900, duration: 0.4, type: 'triangle', volume: 0.16, slideTo: 1700 });
    playTone({ frequency: 2850, duration: 0.35, type: 'sine', volume: 0.1, delay: 0.02 });
    playKick({ volume: 0.16 });
  } else if (soundName === 'jesterUnlock') {
    [0, 0.08, 0.16, 0.24].forEach((delay, index) => {
      playTone({ frequency: [523, 659, 784, 1047][index], duration: 0.14, type: 'square', volume: 0.13, delay });
    });
    playTone({ frequency: 90, duration: 0.7, type: 'sawtooth', volume: 0.14, slideTo: 45, delay: 0.3 });
    [0.35, 0.44, 0.53, 0.62, 0.71].forEach((delay, index) => {
      playTone({ frequency: index % 2 ? 660 : 880, duration: 0.07, type: 'square', volume: 0.12, slideTo: index % 2 ? 520 : 700, delay });
    });
  } else if (soundName === 'jesterFinalWarn') {
    playTone({ frequency: 1480, duration: 0.07, type: 'square', volume: 0.12 });
    playTone({ frequency: 1480, duration: 0.07, type: 'square', volume: 0.1, delay: 0.1 });
  } else if (soundName === 'jesterFinalFall') {
    playNoise({ duration: 0.35, volume: 0.18, filterFrequency: 1600 });
    playTone({ frequency: 900, duration: 0.35, type: 'sawtooth', volume: 0.08, slideTo: 180 });
  } else if (soundName === 'jesterFinalImpact') {
    playKick({ volume: 0.3 });
    playNoise({ duration: 0.3, volume: 0.32, filterFrequency: 3500 });
    playTone({ frequency: 1800, duration: 0.4, type: 'sine', volume: 0.2, slideTo: 900 });
    playTone({ frequency: 2700, duration: 0.3, type: 'triangle', volume: 0.1, delay: 0.03 });
  } else if (soundName === 'jesterFinalHurt') {
    playNoise({ duration: 0.18, volume: 0.3, filterFrequency: 5200 });
    playTone({ frequency: 320, duration: 0.25, type: 'square', volume: 0.18, slideTo: 90 });
  } else if (soundName === 'jesterFinalShrink') {
    playTone({ frequency: 1200, duration: 0.8, type: 'sine', volume: 0.2, slideTo: 180 });
    playTone({ frequency: 600, duration: 0.8, type: 'triangle', volume: 0.12, slideTo: 90, delay: 0.1 });
    playNoise({ duration: 0.6, volume: 0.1, filterFrequency: 900 });
  } else if (soundName === 'jesterFinalRumble') {
    playNoise({ duration: 0.45, volume: 0.3, filterFrequency: 260 });
    playTone({ frequency: 45, duration: 0.45, type: 'sawtooth', volume: 0.24, slideTo: 36 });
  } else if (soundName === 'jesterFinalGiantSpin') {
    playNoise({ duration: 0.25, volume: 0.2, filterFrequency: 700 });
    playTone({ frequency: 140, duration: 0.25, type: 'sawtooth', volume: 0.1, slideTo: 260 });
  } else if (soundName === 'jesterHeartbeat') {
    playKick({ volume: 0.28 });
    setTimeout(() => playKick({ volume: 0.2 }), 170);
  } else if (soundName === 'jesterFinalWhite') {
    playNoise({ duration: 1.3, volume: 0.36, filterFrequency: 6000 });
    playTone({ frequency: 220, duration: 1.4, type: 'sine', volume: 0.3, slideTo: 1760 });
    playChord([523, 659, 784], { duration: 1.4, type: 'triangle', volume: 0.14, delay: 0.3 });
  } else if (soundName === 'jesterFinalReturn') {
    playTone({ frequency: 1760, duration: 0.6, type: 'sine', volume: 0.18, slideTo: 330 });
    playChord([392, 494, 587], { duration: 0.5, type: 'triangle', volume: 0.1, delay: 0.1 });
  } else if (soundName === 'jesterSnap') {
    playNoise({ duration: 0.05, volume: 0.35, filterFrequency: 4500 });
    playTone({ frequency: 2200, duration: 0.05, type: 'square', volume: 0.12 });
  } else if (soundName === 'cobaltWind') {
    playNoise({ duration: 2.4, volume: 0.12, filterFrequency: 500 });
    playNoise({ duration: 2, volume: 0.07, filterFrequency: 1400, delay: 0.6 });
    playTone({ frequency: 180, duration: 2, type: 'sine', volume: 0.06, slideTo: 140, delay: 0.3 });
  } else if (soundName === 'jesterExorcismCharge') {
    playTone({ frequency: 60, duration: 2.6, type: 'sawtooth', volume: 0.2, slideTo: 240 });
    playTone({ frequency: 90, duration: 2.6, type: 'sawtooth', volume: 0.12, slideTo: 360, delay: 0.1 });
    playChord([220, 262, 311], { duration: 2.4, type: 'triangle', volume: 0.08, delay: 0.4 });
    playNoise({ duration: 2.4, volume: 0.1, filterFrequency: 700 });
  } else if (soundName === 'screenShatter') {
    playNoise({ duration: 0.6, volume: 0.4, filterFrequency: 7000 });
    playNoise({ duration: 0.9, volume: 0.2, filterFrequency: 2500, delay: 0.05 });
    playKick({ volume: 0.3 });
    [0, 0.05, 0.11, 0.18, 0.26, 0.35].forEach((delay, index) => {
      playTone({ frequency: 3200 - index * 350, duration: 0.07, type: 'triangle', volume: 0.12, delay });
    });
  } else if (soundName === 'robotDischarge') {
    playNoise({ duration: 0.25, volume: 0.2, filterFrequency: 5200 });
    playTone({ frequency: 1200, duration: 0.2, type: 'sawtooth', volume: 0.08, slideTo: 300 });
  } else if (soundName === 'robotRivet') {
    playTone({ frequency: 220, duration: 0.1, type: 'square', volume: 0.14, slideTo: 90 });
    playNoise({ duration: 0.12, volume: 0.16, filterFrequency: 1800 });
  } else if (soundName === 'robotHit') {
    playTone({ frequency: 520, duration: 0.12, type: 'triangle', volume: 0.12, slideTo: 380 });
    playNoise({ duration: 0.08, volume: 0.14, filterFrequency: 3000 });
  } else if (soundName === 'robotTick') {
    playTone({ frequency: 1600, duration: 0.03, type: 'square', volume: 0.08 });
  } else if (soundName === 'robotBoom') {
    playKick({ volume: 0.3 });
    playNoise({ duration: 0.5, volume: 0.3, filterFrequency: 1200 });
    playTone({ frequency: 90, duration: 0.5, type: 'sawtooth', volume: 0.16, slideTo: 40 });
  } else if (soundName === 'robotRewind') {
    playTone({ frequency: 300, duration: 0.45, type: 'sine', volume: 0.16, slideTo: 1200 });
    playTone({ frequency: 1200, duration: 0.3, type: 'triangle', volume: 0.08, slideTo: 300, delay: 0.2 });
  } else if (soundName === 'robotScrap') {
    playNoise({ duration: 0.3, volume: 0.18, filterFrequency: 2400 });
    playTone({ frequency: 160, duration: 0.2, type: 'square', volume: 0.1, slideTo: 260 });
  } else if (soundName === 'robotCharge') {
    playTone({ frequency: 660, duration: 0.18, type: 'square', volume: 0.1 });
    playTone({ frequency: 440, duration: 0.18, type: 'square', volume: 0.1, delay: 0.18 });
    playNoise({ duration: 0.5, volume: 0.12, filterFrequency: 600, delay: 0.05 });
  } else if (soundName === 'robotMagnet') {
    playTone({ frequency: 70, duration: 1.1, type: 'sawtooth', volume: 0.16, slideTo: 110 });
    playTone({ frequency: 140, duration: 1.1, type: 'square', volume: 0.05, slideTo: 220 });
  } else if (soundName === 'robotGlitch') {
    playTone({ frequency: 180, duration: 0.25, type: 'square', volume: 0.12, slideTo: 60 });
    playNoise({ duration: 0.2, volume: 0.16, filterFrequency: 4200 });
    playTone({ frequency: 1400, duration: 0.05, type: 'square', volume: 0.06, delay: 0.08 });
    playTone({ frequency: 900, duration: 0.05, type: 'square', volume: 0.06, delay: 0.16 });
  } else if (soundName === 'bubblePop') {
    playTone({ frequency: 900, duration: 0.06, type: 'sine', volume: 0.3, slideTo: 1800, attack: 0.002 });
    playNoise({ duration: 0.03, volume: 0.12, filterFrequency: 6000 });
  } else if (soundName === 'jesterGiantSlam') {
    playKick({ volume: 0.4 });
    playNoise({ duration: 1.2, volume: 0.4, filterFrequency: 2000 });
    playTone({ frequency: 70, duration: 1.2, type: 'sawtooth', volume: 0.3, slideTo: 25 });
    playTone({ frequency: 1500, duration: 0.8, type: 'triangle', volume: 0.14, slideTo: 300 });
  } else if (soundName === 'realityShatter') {
    playNoise({ duration: 0.9, volume: 0.22, filterFrequency: 4200 });
    playNoise({ duration: 1.2, volume: 0.14, filterFrequency: 900, delay: 0.1 });
    playTone({ frequency: 55, duration: 1.2, type: 'sawtooth', volume: 0.14, slideTo: 25 });
    [0, 0.08, 0.17, 0.3, 0.44].forEach((delay, index) => {
      playTone({ frequency: 2400 - index * 300, duration: 0.09, type: 'square', volume: 0.04, slideTo: 600, delay });
    });
  } else if (soundName === 'jesterLaugh') {
    [0, 0.09, 0.18, 0.27, 0.36].forEach((delay, index) => {
      playTone({ frequency: index % 2 ? 660 : 880, duration: 0.07, type: 'square', volume: 0.13, slideTo: index % 2 ? 520 : 700, delay });
    });
  } else if (soundName === 'cutsceneBlip' && options.speaker === 'jester') {
    playTone({ frequency: 500 + Math.random() * 500, duration: 0.03, type: 'square', volume: 0.035 });
  } else if (soundName === 'cutsceneBlip') {
    const baseFrequency = options.speaker === 'scammer' ? 460 : 230;
    playTone({ frequency: baseFrequency + Math.random() * 60, duration: 0.035, type: options.speaker === 'scammer' ? 'square' : 'triangle', volume: 0.035 });
  } else if (soundName === 'cutsceneVersus') {
    playKick({ volume: 0.26 });
    playNoise({ duration: 0.35, volume: 0.12, filterFrequency: 1200 });
    playChord([196, 294, 392], { duration: 0.5, type: 'sawtooth', volume: 0.05, delay: 0.05 });
    playChord([262, 392, 523], { duration: 0.6, type: 'square', volume: 0.045, delay: 0.55 });
  } else if (soundName === 'menuMove') {
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
  if (typeof shopMusic !== 'undefined' && shopMusic.timer) return;
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
  r: false,
  slash: false,
  period: false,
  enter: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

