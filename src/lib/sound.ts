"use client";

const KEY = "aa-sound";
export const SOUND_EVENT = "aa-sound:change";

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent<boolean>(SOUND_EVENT, { detail: on }));
}

let ctx: AudioContext | null = null;
let filter: BiquadFilterNode | null = null;

function ensureGraph() {
  ctx ??= new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
  filter ??= ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2400;
  filter.Q.value = 0.6;
  filter.connect(ctx.destination);
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(
  freq: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
  delay = 0,
) {
  if (!soundEnabled()) return;
  try {
    ensureGraph();
    const t0 = ctx!.currentTime + delay;
    const osc = ctx!.createOscillator();
    const g = ctx!.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(filter!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch {
    /* audio unavailable — stay silent */
  }
}

export const sfx = {
  tick: () => tone(920, 0.035, 0.012, "triangle"),
  confirm: () => {
    tone(494, 0.1, 0.028, "sine");
    tone(740, 0.14, 0.024, "sine", 0.08);
  },
  open: () => {
    tone(392, 0.09, 0.024, "triangle");
    tone(587, 0.12, 0.022, "triangle", 0.07);
  },
};
