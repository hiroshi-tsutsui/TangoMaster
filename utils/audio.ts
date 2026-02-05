// Simple synth for UI sounds to avoid external assets for now
class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(on: boolean) {
    this.enabled = on;
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPop() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    this.playTone(800, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1200, 'sine', 0.2, 0.05), 100);
  }

  playHard() {
    this.playTone(200, 'square', 0.15, 0.03);
  }

  playLevelUp() {
    this.playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(500, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(600, 'sine', 0.1, 0.1), 200);
    setTimeout(() => this.playTone(800, 'sine', 0.4, 0.1), 300);
  }

  playChime() {
    if (!this.enabled) return;
    const now = this.ctx?.currentTime || 0;
    // Magical Arpeggio
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.5, 0.05), i * 80);
    });
  }
}

export const audio = new AudioEngine();
