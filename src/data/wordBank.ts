import type { BankWord, Difficulty, Language, PatternTag } from "@/lib/types";

/**
 * MOCK predefined word bank.
 *
 * In production this lives in the backend database. Every word is tagged
 * with spelling/reading patterns, difficulty and grade so the backend can
 * pick related words for Personalized Practice. Nothing here is generated.
 */
function w(
  id: string,
  text: string,
  definition: string,
  exampleSentence: string,
  partOfSpeech: string,
  syllables: string[],
  patterns: PatternTag[],
  difficulty: Difficulty,
  gradeLevel: number,
  category: string,
  language: Language = "en",
): BankWord {
  return { id, text, definition, exampleSentence, partOfSpeech, syllables, patterns, difficulty, gradeLevel, category, language };
}

export const WORD_BANK: BankWord[] = [
  // Short vowels and blends
  w("w-cat", "cat", "A small furry pet that says meow.", "The cat napped in the sun.", "noun", ["cat"], ["short-vowel"], 1, 0, "animals"),
  w("w-bed", "bed", "A soft place where you sleep.", "I made my bed this morning.", "noun", ["bed"], ["short-vowel", "letter-reversal"], 1, 0, "home"),
  w("w-frog", "frog", "A small green animal that hops and lives near water.", "The frog jumped into the pond.", "noun", ["frog"], ["short-vowel", "blend"], 1, 1, "animals"),
  w("w-stop", "stop", "To not move anymore.", "Please stop at the red light.", "verb", ["stop"], ["short-vowel", "blend"], 1, 1, "actions"),
  w("w-plant", "plant", "A living thing that grows in soil, like a flower.", "We watered the plant every day.", "noun", ["plant"], ["blend", "short-vowel"], 2, 1, "nature"),
  w("w-splash", "splash", "To hit water so it flies up.", "The kids splash in the pool.", "verb", ["splash"], ["blend", "digraph-sh-ch-th"], 3, 2, "actions"),
  w("w-crust", "crust", "The hard outside part of bread or pie.", "I saved the crust for last.", "noun", ["crust"], ["blend", "short-vowel"], 2, 1, "food"),

  // Digraphs
  w("w-ship", "ship", "A big boat that sails on the sea.", "The ship sailed across the ocean.", "noun", ["ship"], ["digraph-sh-ch-th", "short-vowel"], 1, 1, "travel"),
  w("w-chin", "chin", "The part of your face below your mouth.", "He rested his chin on his hand.", "noun", ["chin"], ["digraph-sh-ch-th"], 1, 1, "body"),
  w("w-thumb", "thumb", "The short, thick finger on your hand.", "She gave a thumbs up.", "noun", ["thumb"], ["digraph-sh-ch-th", "silent-letter"], 3, 2, "body"),
  w("w-lunch", "lunch", "The meal you eat in the middle of the day.", "We ate lunch under a tree.", "noun", ["lunch"], ["digraph-sh-ch-th", "blend"], 2, 1, "food"),
  w("w-shell", "shell", "The hard outside cover of a snail, turtle or egg.", "I found a shell at the beach.", "noun", ["shell"], ["digraph-sh-ch-th", "double-consonant"], 2, 1, "nature"),

  // Magic e
  w("w-cake", "cake", "A sweet baked food for parties.", "Mom baked a cake for my birthday.", "noun", ["cake"], ["silent-e"], 2, 1, "food"),
  w("w-bike", "bike", "A ride with two wheels and pedals.", "I ride my bike to school.", "noun", ["bike"], ["silent-e"], 2, 1, "travel"),
  w("w-home", "home", "The place where you live.", "We walked home together.", "noun", ["home"], ["silent-e"], 2, 1, "home"),
  w("w-flute", "flute", "A musical instrument you blow across.", "She plays the flute in band.", "noun", ["flute"], ["silent-e", "blend"], 3, 2, "music"),
  w("w-smile", "smile", "A happy look on your face.", "His smile made me laugh.", "noun", ["smile"], ["silent-e", "blend"], 2, 1, "feelings"),
  w("w-stone", "stone", "A small rock.", "He skipped a stone across the lake.", "noun", ["stone"], ["silent-e", "blend"], 2, 1, "nature"),
  w("w-shape", "shape", "The outline of something, like a circle or square.", "A triangle is a shape with three sides.", "noun", ["shape"], ["silent-e", "digraph-sh-ch-th"], 3, 2, "math"),
  w("w-whale", "whale", "A very large animal that lives in the ocean.", "We saw a whale from the boat.", "noun", ["whale"], ["silent-e", "digraph-sh-ch-th"], 3, 2, "animals"),

  // Vowel teams
  w("w-rain", "rain", "Water that falls from clouds.", "The rain tapped on the window.", "noun", ["rain"], ["vowel-team-ai-ay"], 2, 1, "weather"),
  w("w-play", "play", "To have fun with toys or games.", "We play tag at recess.", "verb", ["play"], ["vowel-team-ai-ay", "blend"], 2, 1, "actions"),
  w("w-train", "train", "A long line of cars that rides on tracks.", "The train went through the tunnel.", "noun", ["train"], ["vowel-team-ai-ay", "blend"], 3, 2, "travel"),
  w("w-snail", "snail", "A slow animal that carries a shell.", "A snail crawled up the wall.", "noun", ["snail"], ["vowel-team-ai-ay", "blend"], 3, 2, "animals"),
  w("w-crayon", "crayon", "A stick of colored wax for drawing.", "I need a blue crayon.", "noun", ["cray", "on"], ["vowel-team-ai-ay", "multisyllable"], 3, 2, "school"),
  w("w-tree", "tree", "A tall plant with a trunk and branches.", "A bird built a nest in the tree.", "noun", ["tree"], ["vowel-team-ee-ea", "blend"], 2, 1, "nature"),
  w("w-beach", "beach", "Sandy land next to the ocean.", "We built a sandcastle at the beach.", "noun", ["beach"], ["vowel-team-ee-ea", "digraph-sh-ch-th"], 3, 2, "places"),
  w("w-sheep", "sheep", "A farm animal with thick wool.", "The sheep ate the green grass.", "noun", ["sheep"], ["vowel-team-ee-ea", "digraph-sh-ch-th"], 3, 2, "animals"),
  w("w-dream", "dream", "Pictures and stories in your mind while you sleep.", "I had a dream about flying.", "noun", ["dream"], ["vowel-team-ee-ea", "blend"], 3, 2, "feelings"),
  w("w-teacher", "teacher", "A person who helps you learn.", "Our teacher reads us a story.", "noun", ["teach", "er"], ["vowel-team-ee-ea", "digraph-sh-ch-th", "r-controlled"], 3, 2, "school"),
  w("w-boat", "boat", "Something that floats and carries people on water.", "We rowed the boat to shore.", "noun", ["boat"], ["vowel-team-oa-ow"], 2, 1, "travel"),
  w("w-snow", "snow", "Soft white flakes of frozen water.", "Snow covered the whole yard.", "noun", ["snow"], ["vowel-team-oa-ow", "blend"], 2, 1, "weather"),
  w("w-toast", "toast", "Bread that is browned with heat.", "I like butter on my toast.", "noun", ["toast"], ["vowel-team-oa-ow", "blend"], 3, 2, "food"),
  w("w-window", "window", "An opening in a wall with glass in it.", "Look out the window!", "noun", ["win", "dow"], ["vowel-team-oa-ow", "multisyllable"], 3, 2, "home"),

  // Bossy r
  w("w-car", "car", "A machine with four wheels that people drive.", "Dad parked the car.", "noun", ["car"], ["r-controlled"], 1, 1, "travel"),
  w("w-bird", "bird", "An animal with feathers and wings.", "A bird sang outside.", "noun", ["bird"], ["r-controlled"], 2, 1, "animals"),
  w("w-turtle", "turtle", "A slow animal with a hard shell.", "The turtle hid in its shell.", "noun", ["tur", "tle"], ["r-controlled", "multisyllable"], 3, 2, "animals"),
  w("w-storm", "storm", "Very strong wind and rain.", "The storm knocked down a branch.", "noun", ["storm"], ["r-controlled", "blend"], 3, 2, "weather"),
  w("w-garden", "garden", "A place where flowers or vegetables grow.", "We planted carrots in the garden.", "noun", ["gar", "den"], ["r-controlled", "multisyllable"], 3, 2, "nature"),
  w("w-thirsty", "thirsty", "Needing something to drink.", "Running made me thirsty.", "adjective", ["thirst", "y"], ["r-controlled", "digraph-sh-ch-th", "multisyllable"], 4, 3, "feelings"),

  // Double consonants and endings
  w("w-rabbit", "rabbit", "A small animal with long ears that hops.", "The rabbit ate a carrot.", "noun", ["rab", "bit"], ["double-consonant", "multisyllable"], 3, 2, "animals"),
  w("w-kitten", "kitten", "A baby cat.", "The kitten chased a ball of yarn.", "noun", ["kit", "ten"], ["double-consonant", "multisyllable"], 3, 2, "animals"),
  w("w-hopping", "hopping", "Jumping on one or two feet.", "The bunny is hopping across the yard.", "verb", ["hop", "ping"], ["double-consonant", "suffix-ing-ed"], 4, 3, "actions"),
  w("w-jumped", "jumped", "Pushed off the ground into the air (in the past).", "She jumped over the puddle.", "verb", ["jumped"], ["suffix-ing-ed", "blend"], 3, 2, "actions"),
  w("w-planted", "planted", "Put a seed or plant in the ground (in the past).", "We planted a tree last spring.", "verb", ["plant", "ed"], ["suffix-ing-ed", "blend"], 3, 2, "nature"),
  w("w-reading", "reading", "Looking at words and understanding them.", "I am reading a book about bees.", "verb", ["read", "ing"], ["suffix-ing-ed", "vowel-team-ee-ea"], 3, 2, "school"),
  w("w-swimming", "swimming", "Moving through water using your arms and legs.", "We went swimming at the lake.", "verb", ["swim", "ming"], ["suffix-ing-ed", "double-consonant", "blend"], 4, 3, "actions"),
  w("w-station", "station", "A place where trains or buses stop.", "We waited at the train station.", "noun", ["sta", "tion"], ["suffix-tion", "multisyllable"], 4, 3, "places"),
  w("w-action", "action", "Something that is done.", "The movie was full of action.", "noun", ["ac", "tion"], ["suffix-tion", "multisyllable"], 4, 3, "words"),
  w("w-vacation", "vacation", "A break from school or work for fun or rest.", "We went camping on vacation.", "noun", ["va", "ca", "tion"], ["suffix-tion", "multisyllable"], 4, 4, "places"),
  w("w-question", "question", "Something you ask to find out an answer.", "Raise your hand if you have a question.", "noun", ["ques", "tion"], ["suffix-tion", "multisyllable"], 5, 4, "school"),

  // Silent letters and longer words
  w("w-knee", "knee", "The joint in the middle of your leg.", "I scraped my knee on the sidewalk.", "noun", ["knee"], ["silent-letter", "vowel-team-ee-ea"], 3, 2, "body"),
  w("w-write", "write", "To put letters and words on paper.", "Write your name at the top.", "verb", ["write"], ["silent-letter", "silent-e"], 3, 2, "school"),
  w("w-lamb", "lamb", "A baby sheep.", "The lamb stayed close to its mother.", "noun", ["lamb"], ["silent-letter", "short-vowel"], 3, 2, "animals"),
  w("w-knock", "knock", "To hit a door to let people know you are there.", "Please knock before you come in.", "verb", ["knock"], ["silent-letter", "short-vowel"], 4, 3, "actions"),
  w("w-honey", "honey", "A sweet, sticky food made by bees.", "Bees make honey in the hive.", "noun", ["hon", "ey"], ["multisyllable"], 3, 2, "food"),
  w("w-butterfly", "butterfly", "An insect with large, colorful wings.", "A butterfly landed on the flower.", "noun", ["but", "ter", "fly"], ["multisyllable", "double-consonant", "r-controlled"], 4, 3, "animals"),
  w("w-fantastic", "fantastic", "Very, very good.", "The show was fantastic!", "adjective", ["fan", "tas", "tic"], ["multisyllable", "short-vowel"], 4, 3, "feelings"),
  w("w-adventure", "adventure", "An exciting trip or experience.", "Our hike was a real adventure.", "noun", ["ad", "ven", "ture"], ["multisyllable", "r-controlled"], 5, 4, "words"),
  w("w-pollinate", "pollinate", "To move pollen from one flower to another.", "Bees pollinate flowers as they fly.", "verb", ["pol", "li", "nate"], ["multisyllable", "double-consonant", "silent-e"], 5, 4, "nature"),

  // Look-alike letters (b / d / p) — a common mix-up for students with dyslexia
  w("w-dog", "dog", "A pet that barks and wags its tail.", "The dog fetched the ball.", "noun", ["dog"], ["letter-reversal", "short-vowel"], 1, 0, "animals"),
  w("w-big", "big", "Large; not small.", "An elephant is a big animal.", "adjective", ["big"], ["letter-reversal", "short-vowel"], 1, 0, "words"),
  w("w-dig", "dig", "To make a hole in the ground.", "The puppy likes to dig in the sand.", "verb", ["dig"], ["letter-reversal", "short-vowel"], 1, 0, "actions"),
  w("w-bat", "bat", "A stick used to hit a ball, or an animal that flies at night.", "He swung the bat and hit the ball.", "noun", ["bat"], ["letter-reversal", "short-vowel"], 1, 0, "sports"),
  w("w-duck", "duck", "A bird that swims and says quack.", "A duck paddled across the pond.", "noun", ["duck"], ["letter-reversal", "short-vowel"], 2, 1, "animals"),
  w("w-desk", "desk", "A table where you sit to read or write.", "My pencil is on my desk.", "noun", ["desk"], ["letter-reversal", "blend"], 2, 1, "school"),
  w("w-pond", "pond", "A small, calm body of water.", "Frogs live in the pond.", "noun", ["pond"], ["letter-reversal", "blend"], 2, 1, "nature"),
  w("w-puddle", "puddle", "A small pool of water on the ground.", "She jumped in the puddle.", "noun", ["pud", "dle"], ["letter-reversal", "double-consonant", "multisyllable"], 3, 2, "weather"),
];

const byId = new Map(WORD_BANK.map((word) => [word.id, word]));
const byText = new Map(WORD_BANK.map((word) => [`${word.language}:${word.text.toLowerCase()}`, word]));

export function findBankWord(id: string): BankWord | undefined {
  return byId.get(id);
}

export function findBankWordByText(text: string, language: Language): BankWord | undefined {
  return byText.get(`${language}:${text.trim().toLowerCase()}`);
}
