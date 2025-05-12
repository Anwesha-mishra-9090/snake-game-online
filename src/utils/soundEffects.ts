
export enum SoundEffect {
  EAT = 'eat',
  GAME_OVER = 'gameOver',
  MOVE = 'move',
}

// Audio contexts and buffers
let audioContext: AudioContext | null = null;
const buffers: Record<string, AudioBuffer> = {};

// Create simple sounds using the Web Audio API
export function initializeSounds(): void {
  if (audioContext) return;
  
  try {
    audioContext = new AudioContext();
    createEatSound();
    createGameOverSound();
    createMoveSound();
  } catch (e) {
    console.error('Web Audio API is not supported in this browser', e);
  }
}

function createEatSound(): void {
  if (!audioContext) return;
  
  const duration = 0.1;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < buffer.length; i++) {
    // Create a simple "blip" sound
    const t = i / sampleRate;
    const frequency = 800 + 500 * Math.sin(2 * Math.PI * 10 * t);
    data[i] = 0.5 * Math.sin(2 * Math.PI * frequency * t) * Math.pow(1 - t / duration, 2);
  }
  
  buffers[SoundEffect.EAT] = buffer;
}

function createGameOverSound(): void {
  if (!audioContext) return;
  
  const duration = 0.5;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < buffer.length; i++) {
    // Create a descending "wah wah" sound
    const t = i / sampleRate;
    const frequency = 300 - 200 * (t / duration);
    data[i] = 0.5 * Math.sin(2 * Math.PI * frequency * t) * Math.pow(1 - t / duration, 1);
  }
  
  buffers[SoundEffect.GAME_OVER] = buffer;
}

function createMoveSound(): void {
  if (!audioContext) return;
  
  const duration = 0.05;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < buffer.length; i++) {
    // Create a very subtle tick sound
    const t = i / sampleRate;
    data[i] = 0.1 * Math.sin(2 * Math.PI * 200 * t) * Math.pow(1 - t / duration, 4);
  }
  
  buffers[SoundEffect.MOVE] = buffer;
}

export function playSound(sound: SoundEffect): void {
  if (!audioContext || !buffers[sound]) return;
  
  // Resume audio context if it's suspended (needed for browsers that require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffers[sound];
  
  // Connect to output
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5; // 50% volume
  
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  source.start();
}

export function toggleMute(muted: boolean): void {
  // This function would control global muting
  // For simplicity, we're not implementing full mute functionality in this version
}
