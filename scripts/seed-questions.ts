/**
 * Seed script: creates 28 daily questions in Strapi (today through today+27).
 * Categories interleaved: fun, values, deep, future (7 each).
 * Idempotent: checks scheduledDate before inserting to avoid duplicates.
 *
 * Usage:
 *   STRAPI_ADMIN_TOKEN=<token> npx ts-node scripts/seed-questions.ts
 */

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://127.0.0.1:1337';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('Error: STRAPI_ADMIN_TOKEN env var is required.');
  console.error('  Get it from Strapi Admin → Settings → API Tokens');
  process.exit(1);
}

type Category = 'fun' | 'values' | 'deep' | 'future';

interface QuestionSeed {
  title: string;
  body: string;
  category: Category;
  tags: string[];
}

// 28 questions — 7 per category, interleaved (fun/values/deep/future cycling per day)
const QUESTIONS: QuestionSeed[] = [
  // Day 0 — fun
  {
    title: 'What is your most cherished childhood memory and why does it still make you smile?',
    body: 'Think back to a moment from your childhood that fills you with warmth. Share the full story — what you were doing, who was there, and why it has stayed with you.',
    category: 'fun',
    tags: ['childhood', 'memories', 'joy'],
  },
  // Day 1 — values
  {
    title: 'When you feel hurt in our relationship, what is the best way for me to respond?',
    body: 'Everyone needs something different when they are hurting. Share honestly what you need from your partner in those vulnerable moments — words, space, physical comfort, or something else entirely.',
    category: 'values',
    tags: ['communication', 'support', 'emotional-needs'],
  },
  // Day 2 — deep
  {
    title: 'What small gesture from me makes you feel most loved and desired?',
    body: 'Sometimes the smallest things speak the loudest. Describe a moment — big or small — when something your partner did made you feel deeply cherished.',
    category: 'deep',
    tags: ['love-language', 'affection', 'intimacy'],
  },
  // Day 3 — future
  {
    title: 'What is one fear about our relationship you have never told me?',
    body: 'Vulnerability is the foundation of deep connection. Share a fear or worry about your relationship that you have kept hidden — and what it would mean to finally say it out loud.',
    category: 'future',
    tags: ['vulnerability', 'honesty', 'fears'],
  },
  // Day 4 — fun
  {
    title: 'If you could relive one day from your past with me, which day would you choose and why?',
    body: 'Look back through your shared memories. Which single day would you hit replay on — and what made it so perfect that you would want to live it again?',
    category: 'fun',
    tags: ['memories', 'nostalgia', 'connection'],
  },
  // Day 5 — values
  {
    title: 'What is one thing you wish I would say more often that lets you know I truly hear you?',
    body: 'Words of acknowledgment can be profoundly powerful. Think about the phrases or responses that make you feel genuinely listened to and understood — not just heard, but truly understood.',
    category: 'values',
    tags: ['communication', 'listening', 'validation'],
  },
  // Day 6 — deep
  {
    title: 'Is there a moment in our relationship where you felt closest to me? What made it so meaningful?',
    body: 'Think of a specific moment — large or small — when you felt an extraordinary sense of closeness and connection with your partner. What was happening and what created that feeling?',
    category: 'deep',
    tags: ['connection', 'intimacy', 'bonding'],
  },
  // Day 7 — future
  {
    title: 'Is there a version of our future that excites you most — what does it look like?',
    body: 'Close your eyes and picture the future you dream of for us. Describe it in detail — where we are, how we spend our days, and what makes that vision feel so alive.',
    category: 'future',
    tags: ['dreams', 'future', 'goals'],
  },
  // Day 8 — fun
  {
    title: 'What was the first thing about me that made you think "this person is special"?',
    body: 'Cast your mind back to when we first met. What was it — a word, a look, a laugh, an act of kindness — that made you think there was something uniquely special about me?',
    category: 'fun',
    tags: ['first-impressions', 'love-story', 'beginnings'],
  },
  // Day 9 — values
  {
    title: 'When we disagree, what helps you feel respected even when we do not see eye to eye?',
    body: 'Conflict is inevitable in any relationship. Describe what your partner can do during a disagreement — in tone, words, or actions — that helps you feel respected even when you are on opposite sides.',
    category: 'values',
    tags: ['conflict', 'respect', 'communication'],
  },
  // Day 10 — deep
  {
    title: 'What kind of physical affection do you crave most when you are stressed or overwhelmed?',
    body: 'When life feels heavy, touch can be the most grounding gift. Share what kind of physical comfort — a long hug, holding hands, a quiet cuddle — speaks most deeply to you when you are struggling.',
    category: 'deep',
    tags: ['physical-touch', 'comfort', 'stress'],
  },
  // Day 11 — future
  {
    title: 'What part of yourself do you worry I might stop loving if you showed it fully?',
    body: 'Most of us carry parts of ourselves we hide, fearing they are unlovable. Which aspect of who you are do you keep guarded, and what would it mean if your partner embraced it completely?',
    category: 'future',
    tags: ['vulnerability', 'acceptance', 'self-worth'],
  },
  // Day 12 — fun
  {
    title: 'Which hobby or interest of yours do you most wish I shared with you?',
    body: 'Think about the things you love doing most. Which one do you wish you could share with your partner — and what would it look like if we dove into it together?',
    category: 'fun',
    tags: ['hobbies', 'shared-interests', 'togetherness'],
  },
  // Day 13 — values
  {
    title: 'What does feeling emotionally safe with me look like to you in a difficult conversation?',
    body: 'Emotional safety allows honesty to flourish. Describe the conditions — the words, the body language, the absence of judgment — that make you feel safe enough to share your hardest truths with me.',
    category: 'values',
    tags: ['emotional-safety', 'trust', 'communication'],
  },
  // Day 14 — deep
  {
    title: 'What does feeling truly seen by your partner mean to you, and do I make you feel that way?',
    body: 'Being truly seen — not just noticed, but deeply known and accepted — is one of our most profound needs. Describe what "being seen" means to you, and share a moment when you felt most seen by me.',
    category: 'deep',
    tags: ['visibility', 'acceptance', 'intimacy'],
  },
  // Day 15 — future
  {
    title: 'What would make you feel most proud of us as a couple ten years from now?',
    body: 'Imagine the two of you a decade from today, looking back on your journey together. What would you need to have built, survived, or grown into for you to feel deeply proud of who we became?',
    category: 'future',
    tags: ['pride', 'legacy', 'long-term'],
  },
  // Day 16 — fun
  {
    title: 'What is a quirky tradition from your family that you secretly hope we adopt together?',
    body: 'Every family has its rituals — from holiday quirks to weekly habits. Share one tradition from your upbringing that you love and would love to carry forward into our life together.',
    category: 'fun',
    tags: ['traditions', 'family', 'rituals'],
  },
  // Day 17 — values
  {
    title: 'How do you prefer I bring up a concern — in the moment or after we have both cooled down?',
    body: 'Timing matters enormously in difficult conversations. Share what works best for you — do you prefer to address issues while they are still fresh, or do you need time and space first?',
    category: 'values',
    tags: ['communication', 'conflict-resolution', 'timing'],
  },
  // Day 18 — deep
  {
    title: 'What is something about your inner world that you have never shared with anyone but wish I knew?',
    body: 'We all carry private thoughts, feelings, and stories we have never spoken aloud. Is there something in your inner world — a belief, a longing, a wound — that you have kept secret but wish your partner understood?',
    category: 'deep',
    tags: ['vulnerability', 'inner-world', 'honesty'],
  },
  // Day 19 — future
  {
    title: 'Is there something you secretly hope will change between us, and what is holding you back from saying it?',
    body: 'Growth in a relationship often starts with a wish we are afraid to voice. Share one thing you quietly hope might shift or evolve between us — and what makes it hard to say out loud.',
    category: 'future',
    tags: ['growth', 'hope', 'change'],
  },
  // Day 20 — fun
  {
    title: 'If we were characters in a movie, what genre would it be and what would our story look like?',
    body: 'If your relationship were a film, what genre would capture it best — a romantic comedy, an epic adventure, a quiet indie drama? Describe the story: how it begins, the key scenes, and how it ends.',
    category: 'fun',
    tags: ['creativity', 'humor', 'storytelling'],
  },
  // Day 21 — values
  {
    title: 'What topic have you held back from discussing because you were unsure how I would react?',
    body: 'Sometimes we self-censor out of fear of how our partner might respond. Is there a subject, concern, or question you have avoided raising with me — and what outcome were you afraid of?',
    category: 'values',
    tags: ['honesty', 'openness', 'vulnerability'],
  },
  // Day 22 — deep
  {
    title: 'How do you feel our emotional intimacy has grown, and what would deepen it even more?',
    body: 'Reflect on the emotional closeness between us since the beginning. In what ways has it deepened? And if you could wish for one thing that would bring us even closer, what would it be?',
    category: 'deep',
    tags: ['emotional-intimacy', 'growth', 'connection'],
  },
  // Day 23 — future
  {
    title: 'When you imagine us growing old together, what is the first image that comes to mind?',
    body: 'Picture yourself decades from now, beside your partner. What do you see? Where are you? What are you doing? And what does that image tell you about what matters most to you?',
    category: 'future',
    tags: ['aging', 'long-term', 'togetherness'],
  },
  // Day 24 — fun
  {
    title: 'What is one thing you have always wanted to try but have never told me about?',
    body: 'We all carry unexpressed dreams and curiosities. Share one experience, adventure, or activity you have long wanted to try but have kept to yourself — and what has held you back from sharing it.',
    category: 'fun',
    tags: ['adventure', 'dreams', 'discovery'],
  },
  // Day 25 — values
  {
    title: 'When do you feel most understood by me — and what am I doing in those moments?',
    body: 'Think of times when you felt completely understood by your partner — not just heard, but genuinely comprehended. What were the circumstances? What was your partner doing that created that feeling?',
    category: 'values',
    tags: ['understanding', 'empathy', 'connection'],
  },
  // Day 26 — deep
  {
    title: 'What is one way I could show you love this week that would genuinely surprise you?',
    body: 'Love expressed in unexpected ways can reignite connection. Think about what would feel surprisingly meaningful to you right now — an act of service, a spontaneous gesture, an honest conversation — and share it.',
    category: 'deep',
    tags: ['love-language', 'surprise', 'affection'],
  },
  // Day 27 — future
  {
    title: 'What is the bravest thing you have ever done for love, and did it lead you here?',
    body: 'Love sometimes calls us to leap — to risk rejection, leave comfort behind, or open our hearts after they have been broken. Share the bravest act of love in your life and whether it shaped the path to us.',
    category: 'future',
    tags: ['bravery', 'love-story', 'reflection'],
  },
];

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function checkExists(scheduledDate: string): Promise<boolean> {
  const url = `${STRAPI_URL}/api/questions?filters[scheduledDate][$eq]=${scheduledDate}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!res.ok) throw new Error(`GET failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { data: unknown[] };
  return json.data.length > 0;
}

async function createQuestion(
  seed: QuestionSeed,
  scheduledDate: string,
): Promise<void> {
  const url = `${STRAPI_URL}/api/questions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        title: seed.title,
        body: seed.body,
        category: seed.category,
        scheduledDate,
        tags: seed.tags,
        isActive: true,
        publishedAt: new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`POST failed (${res.status}): ${await res.text()}`);
}

async function main(): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(`\nSeeding ${QUESTIONS.length} questions starting ${addDays(today, 0)}…`);
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < QUESTIONS.length; i++) {
    const scheduledDate = addDays(today, i);
    const seed = QUESTIONS[i];

    const exists = await checkExists(scheduledDate);
    if (exists) {
      console.log(`  SKIP  [${scheduledDate}] already exists — "${seed.title.slice(0, 50)}…"`);
      skipped++;
    } else {
      await createQuestion(seed, scheduledDate);
      console.log(`  CREATE [${scheduledDate}] (${seed.category}) "${seed.title.slice(0, 50)}…"`);
      created++;
    }
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped (already existed).\n`);
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  if (err.cause) console.error('Caused by:', err.cause);
  process.exit(1);
});
