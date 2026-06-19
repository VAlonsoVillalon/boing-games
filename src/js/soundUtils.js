const soundUtils = {
  _ctx: null,

  get ctx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  },

  _tone(freq, duration, type = 'sine', gainVal = 0.3) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  },

  playClick() {
    this._tone(800, 0.05, 'sine', 0.12);
  },

  playCorrect() {
    this._tone(523, 0.15, 'sine', 0.25);
    setTimeout(() => this._tone(659, 0.2, 'sine', 0.25), 120);
  },

  playWrong() {
    this._tone(300, 0.08, 'square', 0.2);
    setTimeout(() => this._tone(220, 0.15, 'square', 0.15), 80);
  },

  playFanfare() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.25, 'sine', 0.3), i * 120);
    });
  }
};
