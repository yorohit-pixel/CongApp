/**
 * Audio helpers.
 *
 * Playback uses the browser's built-in speech synthesis (no API keys, no
 * server). The backend may later supply recorded audio files instead —
 * keep the same function names so the UI does not change.
 */
import type { Language, SpeechRate } from "@/lib/types";

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

const LANG_CODES: Record<Language, string> = { en: "en-US", es: "es-ES" };
// Not too slow: very slow synthetic speech sounds dragged out and spooky.
const RATES: Record<SpeechRate, number> = { slow: 0.82, normal: 1 };
/** A little higher than normal so Buzz sounds bright and friendly. */
const BUZZ_PITCH = 1.15;

/**
 * Warm, kid-friendly voices, best first. Natural (neural) voices sound the
 * most human; "Ana" in Microsoft Edge is a child's voice.
 */
const FRIENDLY_VOICES = [
  /Ana Online/i,
  /Jenny Online/i,
  /Aria Online/i,
  /Emma Online/i,
  /Ava Online/i,
  /Michelle Online/i,
  /Libby Online/i,
  /Sonia Online/i,
  /Google US English/i,
  /Google UK English Female/i,
  /\bSamantha\b/i,
  /\bAva\b/i,
  /\bAllison\b/i,
  /\bKaren\b/i,
  /\bMoira\b/i,
  /\bTessa\b/i,
  /\bZira\b/i,
  /\bHazel\b/i,
  /\bSusan\b/i,
];
/** Deep or robotic voices that can sound scary to young children. */
const AVOID_VOICES = /\b(David|Mark|George|Fred|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Hysterical|Pipe Organ|Trinoids|Whisper|Zarvox|Jester|Organ|Superstar|Wobble|Junior|Ralph)\b/i;

function rank(voice: SpeechSynthesisVoice): number {
  const i = FRIENDLY_VOICES.findIndex((re) => re.test(voice.name));
  if (i >= 0) return i;
  if (AVOID_VOICES.test(voice.name)) return 1000;
  return 100;
}

/** Voices load in the background in some browsers; wait briefly for them. */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", done);
    setTimeout(done, 1200);
  });
}

function sameLanguage(voice: SpeechSynthesisVoice, lang: string) {
  return voice.lang.replace("_", "-").toLowerCase().startsWith(lang.slice(0, 2).toLowerCase());
}

async function pickVoice(lang: string, preferred?: string | null): Promise<SpeechSynthesisVoice | undefined> {
  const voices = (await loadVoices()).filter((v) => sameLanguage(v, lang));
  if (preferred) {
    const chosen = voices.find((v) => v.name === preferred);
    if (chosen) return chosen;
  }
  return [...voices].sort((a, b) => rank(a) - rank(b) || Number(b.lang === lang) - Number(a.lang === lang))[0];
}

export interface VoiceOption {
  name: string;
  /** A short friendly label, e.g. "Jenny (natural)". */
  label: string;
  recommended: boolean;
}

/** English voices this browser offers, friendliest first (for the Settings voice picker). */
export async function getVoiceOptions(): Promise<VoiceOption[]> {
  if (!isSpeechAvailable()) return [];
  const voices = (await loadVoices()).filter((v) => sameLanguage(v, "en") && !AVOID_VOICES.test(v.name));
  const seen = new Set<string>();
  return voices
    .sort((a, b) => rank(a) - rank(b))
    .filter((v) => (seen.has(v.name) ? false : (seen.add(v.name), true)))
    .slice(0, 8)
    .map((v) => ({
      name: v.name,
      label: friendlyLabel(v.name),
      recommended: rank(v) < FRIENDLY_VOICES.length,
    }));
}

function friendlyLabel(name: string): string {
  const natural = /Online|Natural|Neural/i.test(name);
  const short = name
    .replace(/^(Microsoft|Google|Apple)\s+/i, "")
    .replace(/\s*Online.*$/i, "")
    .replace(/\s*\(.*\)$/, "")
    .replace(/\s+-\s+.*$/, "")
    .replace(/\s+Desktop$/i, "")
    .trim();
  return natural ? `${short} (natural)` : short;
}

/**
 * The utterance being spoken. Chrome can garbage-collect an utterance mid-speech
 * (then it never fires onend), so we keep a reference until it finishes.
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;
/** Bumped by every new speak() / stopSpeaking(), so older chunked speech knows to stop. */
let speechToken = 0;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Speaks text out loud in Buzz's friendly voice.
 * Resolves true when it finished, false if it was interrupted, failed, or speech isn't available.
 * A false result does NOT mean speech is broken — the next call works again.
 */
export async function speak(
  text: string,
  opts: { language?: Language; rate?: SpeechRate; voiceName?: string | null } = {},
): Promise<boolean> {
  if (!isSpeechAvailable()) return false;
  const token = ++speechToken;
  const lang = LANG_CODES[opts.language ?? "en"];
  const voice = await pickVoice(lang, opts.voiceName);
  if (token !== speechToken) return false; // a newer request came in while voices loaded

  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) {
    synth.cancel();
    // Chrome drops a speak() that comes in the same moment as cancel().
    await wait(80);
    if (token !== speechToken) return false;
  }
  // Chrome sometimes leaves the queue paused; speak() then silently does nothing.
  synth.resume();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang ?? lang;
    utterance.rate = RATES[opts.rate ?? "slow"];
    utterance.pitch = BUZZ_PITCH;
    if (voice) utterance.voice = voice;

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(safety);
      if (currentUtterance === utterance) currentUtterance = null;
      resolve(ok);
    };
    // If the browser never reports the end, don't leave the app waiting forever.
    const safety = setTimeout(() => finish(true), 3000 + text.length * 250);
    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);
    currentUtterance = utterance;
    synth.speak(utterance);
  });
}

/** Audio hint: says each chunk slowly with a pause, then the whole word. */
export async function speakInChunks(
  word: string,
  syllables: string[] | undefined,
  language: Language = "en",
  voiceName?: string | null,
): Promise<boolean> {
  const chunks = syllables && syllables.length > 1 ? syllables : Array.from(word);
  for (const chunk of chunks) {
    const ok = await speak(chunk, { language, rate: "slow", voiceName });
    if (!ok) return false;
    await wait(250);
  }
  return speak(word, { language, rate: "slow", voiceName });
}

/** Says a word one syllable at a time ("fam … i … ly"), without the whole word. */
export async function speakSyllables(
  word: string,
  syllables: string[] | undefined,
  language: Language = "en",
  voiceName?: string | null,
): Promise<boolean> {
  const chunks = syllables && syllables.length > 1 ? syllables : [word];
  for (const chunk of chunks) {
    const ok = await speak(chunk, { language, rate: "slow", voiceName });
    if (!ok) return false;
    await wait(350);
  }
  return true;
}

export function stopSpeaking(): void {
  speechToken++;
  if (isSpeechAvailable()) window.speechSynthesis.cancel();
}
