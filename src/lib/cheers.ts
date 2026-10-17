/** Friendly, varied words for Buzz and the feedback lines. */

export const PRAISE = [
  "Correct! Great spelling.",
  "Correct! You're buzzing!",
  "Correct! Bee-autiful spelling!",
  "Correct! Sweet as honey!",
  "Correct! Hive five!",
  "Correct! You nailed it!",
];

export const TIPS = [
  "Stuck on a word? Clap it into chunks, then spell one chunk at a time.",
  "b and d mix-up? Make a bed with your fists: b is the headboard, d is the footboard.",
  "Say the word slowly out loud before you spell it.",
  "Mistakes help your brain learn. Every try counts!",
  "Tap the speaker as many times as you like.",
  "Short practice every day beats one long practice.",
  "Try tracing the letters with your finger while you say them.",
];

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Same tip for the whole day, a new one tomorrow. */
export function tipOfTheDay(date = new Date()): string {
  const day = Math.floor(date.getTime() / 86_400_000);
  return TIPS[day % TIPS.length];
}

export function hello(name: string): string {
  return name ? `Hi ${name}!` : "Hi there!";
}
