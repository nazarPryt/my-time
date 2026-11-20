# Sentence builder content brief

Every topic writer follows this. This is a language-learning app: correct English and natural Ukrainian are the whole point. Accept nothing doubtful.

## Ground rules
- Topics live in the API (the database is synced from these files on every API start). Edit ONLY your own topic file under `apps/api/src/features/english-quiz/content/topics/<level>/`. Other threads may be editing other topic files in the same checkout.
- Do not commit or push; the coordinator commits after review.
- Keep the existing sentences and their ids unchanged. New ids continue `<topic-id>-<n>` and are permanent and unique.

## How the exercise works
- The learner sees a Ukrainian `prompt` and builds the English `answer` from word tiles.
- The check is exact word by word, case-sensitive except for the first word. Punctuation is never a tile and is never checked.
- Accepted answers = `answer` + expanded `accept` patterns + automatic contractions (`packages/contracts/src/features/english-quiz/answers/contractions.ts`):
  - negatives swap both ways (don't/do not, isn't, wasn't, haven't, hadn't, won't, can't/cannot…), but never in questions;
  - pronoun forms only expand (I'm → I am, they're, I'll, I've…), so write the contraction in `answer` where natural. At a clause end ("Yes, I am.") keep the full form;
  - `'s` (is/has) and `'d` (had/would) are NOT automatic. List them in `accept` when wanted.
- A sentence is **bad** if a learner could write a different correct English sentence and be marked wrong. Rewrite the prompt so only one English is natural, or list the real alternatives in `accept` (`{a|b}` = choice, empty option = optional words).
- **No accepted answer may be the start of another** ("I know" vs "I know it"). The content test enforces this, and the API refuses to seed content that breaks it.

## Read first
- `apps/english-quiz/AGENTS.md` and `apps/english-quiz/docs/architecture.md` ("Sentence content", "Sentence builder flow").
- `packages/contracts/src/features/english-quiz/schemas.ts` (the `Sentence` and rule shapes).
- `content/topics/beginner/present-simple.ts` and `present-simple-for-beginners.ts` (under `apps/api/src/features/english-quiz/`), the reference for quality and format, including full rule sections.
- `apps/api/src/features/english-quiz/content/validate-content.ts` (content checks, run by `__tests__/content.test.ts`), and in `apps/english-quiz/src/modes/sentence-builder/`: `model/word-tiles.ts` and `data/word-pool.ts` (traps and distractors).

## Quality rules
1. **Natural Ukrainian**, as a native speaker writes it: correct cases, natural verb aspect, apostrophes (п'є, м'ясо), and the letters і/ї/є/ґ. Always include the subject.
2. **Every prompt makes the topic's tense or form the only natural choice.** Use time markers, context and two-clause prompts where needed.
3. **Unambiguous word order.** Frequency adverbs go before the main verb. Time phrases go where the Ukrainian puts them.
4. **One natural translation.** Avoid:
   - synonym choices (film/movie, shop/store);
   - have vs have got;
   - articles the Ukrainian doesn't make clear;
   - possessives English needs but Ukrainian drops.
5. **Traps** on most sentences, for the topic's key word:
   - plausible learner mistakes that are never correct in that slot, including via contractions or `accept`;
   - the key must be a word of the answer; never use the key itself as a trap, and don't repeat a trap;
   - capitalise traps for the first word.
6. No duplicate prompts or answers within your own file. Don't scan other topic files: similar sentences in different topics are fine.
7. You may replace a one-line `rule` with full rule sections (affirmative / question / negative / usage), with examples that are not your sentences.

## Verify before reporting
1. From the repo root, run `bunx biome check --write <your file>` (only your file), then `bunx biome check apps/api/src/features/english-quiz`. In `apps/api`, run `bun test src/features/english-quiz/__tests__/content.test.ts` (no database needed) and `bun run typecheck`. Ignore failures in other threads' files; your own file must be clean.
2. Write a small script in your scratchpad, never in the repo. It imports `ALL_TOPICS` (`apps/api/src/features/english-quiz/content/index.ts`), and `acceptedAnswers` and `formatAnswer` (`packages/contracts/src/features/english-quiz/index.ts`), and prints every accepted variant of your topic. Read all of them: each must be correct English.
3. Re-read every new sentence as a strict reviewer. Replace anything doubtful instead of defending it.

## Report back
Keep it short. Don't list or table the sentences; they are in the file. Give only:
- the check results;
- each sentence you replaced during self-review, and why;
- any decision you want the user to make.

Don't commit.
