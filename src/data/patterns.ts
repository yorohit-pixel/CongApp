import type { PatternInfo, PatternTag } from "@/lib/types";

/** Child-friendly descriptions for every pattern tag in the word bank. */
export const PATTERNS: Record<PatternTag, PatternInfo> = {
  "short-vowel": {
    tag: "short-vowel",
    label: "Short Vowel Sounds",
    tip: "Short vowels say their quick sound, like the a in cat.",
    example: "cat, bed, sit",
  },
  "silent-e": {
    tag: "silent-e",
    label: "Magic e",
    tip: "An e at the end is quiet, but it makes the vowel say its name.",
    example: "cap → cape",
  },
  "vowel-team-ai-ay": {
    tag: "vowel-team-ai-ay",
    label: "Vowel team ai / ay",
    tip: "ai and ay both say the long a sound. ay usually comes at the end.",
    example: "rain, play",
  },
  "vowel-team-ee-ea": {
    tag: "vowel-team-ee-ea",
    label: "Vowel team ee / ea",
    tip: "ee and ea often say the long e sound.",
    example: "tree, beach",
  },
  "vowel-team-oa-ow": {
    tag: "vowel-team-oa-ow",
    label: "Vowel team oa / ow",
    tip: "oa and ow can both say the long o sound.",
    example: "boat, snow",
  },
  "r-controlled": {
    tag: "r-controlled",
    label: "Bossy r (ar, er, ir, or, ur)",
    tip: "When r follows a vowel, it changes the vowel's sound.",
    example: "car, bird, fur",
  },
  "digraph-sh-ch-th": {
    tag: "digraph-sh-ch-th",
    label: "Letter pairs sh / ch / th",
    tip: "Two letters work together to make one new sound.",
    example: "ship, chin, thumb",
  },
  blend: {
    tag: "blend",
    label: "Consonant Blends",
    tip: "Two or three consonants side by side, and you hear each one.",
    example: "stop, frog, splash",
  },
  "double-consonant": {
    tag: "double-consonant",
    label: "Double Letters",
    tip: "After a short vowel, we often double the next consonant.",
    example: "rabbit, hopping",
  },
  "suffix-ing-ed": {
    tag: "suffix-ing-ed",
    label: "Endings -ing and -ed",
    tip: "-ing and -ed are added to the end of action words.",
    example: "jump → jumped, jumping",
  },
  "suffix-tion": {
    tag: "suffix-tion",
    label: "Ending -tion",
    tip: "The ending that sounds like 'shun' is usually spelled -tion.",
    example: "station, action",
  },
  "silent-letter": {
    tag: "silent-letter",
    label: "Silent Letters",
    tip: "Some words have a letter you can't hear, like the k in knee.",
    example: "knee, write, lamb",
  },
  multisyllable: {
    tag: "multisyllable",
    label: "Longer Words",
    tip: "Clap the word into chunks and spell one chunk at a time.",
    example: "fan-tas-tic",
  },
  "letter-reversal": {
    tag: "letter-reversal",
    label: "Look-alike letters b / d / p",
    tip: "b, d and p are easy to mix up. Make a bed with your fists: b is the headboard, d is the footboard.",
    example: "bed, dog, pond",
  },
};

export function getPattern(tag: PatternTag): PatternInfo {
  return PATTERNS[tag];
}
