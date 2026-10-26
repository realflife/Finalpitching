// Pure playback clock: one source of truth for the scene, captions and controls.
export class LegacyPlayback {
  constructor(count = 6, motion = 3600, hold = 2000) { this.count = count; this.motion = motion; this.hold = hold; this.step = 0; this.elapsed = motion; this.running = false; this.auto = false; this.resumable = false; }
  get progress() { return Math.min(this.elapsed / this.motion, 1); }
  select(step) { this.step = Math.max(0, Math.min(this.count - 1, step)); this.elapsed = this.motion; this.running = this.auto = this.resumable = false; }
  restart() { this.select(0); }
  play(reduced = false) {
    if (reduced) { this.elapsed = this.motion; this.running = this.resumable = false; return; }
    if (!this.resumable) { this.elapsed = 0; this.auto = false; }
    this.running = true; this.resumable = false;
  }
  playAll() { this.step = this.elapsed = 0; this.running = this.auto = true; this.resumable = false; }
  pause() { if (this.running) { this.running = false; this.resumable = true; } }
  finishMotion() { this.elapsed = this.motion; this.running = this.auto = this.resumable = false; }
  advance(ms) {
    if (!this.running || !Number.isFinite(ms) || ms < 0) return;
    this.elapsed += ms;
    const duration = this.auto ? this.motion + this.hold : this.motion;
    while (this.elapsed >= duration && this.running) {
      if (this.auto && this.step < this.count - 1) { this.elapsed -= duration; this.step++; }
      else { this.elapsed = this.motion; this.running = this.auto = this.resumable = false; }
    }
  }
}
