# English quiz: architecture

How the remote is organised internally. For how it is built, served and loaded
by the host, see [`docs/micro-frontends.md`](../../../docs/micro-frontends.md).

## Hub and modes

The remote opens on a **hub** that lists every practice **mode** as a card,
grouped by category. Each card shows the mode's levels, rough duration and
last score (kept in localStorage on this device).
Opening a mode shows it full width under an `All exercises / <mode>`
breadcrumb.

The host owns the URL (see "Routing" in `docs/micro-frontends.md`): the
remote renders the `mode` prop (undefined = hub) and asks for another one
with a `mode-changed` event. It never switches mode by itself.

| Mode | Folder | What it does |
| --- | --- | --- |
| Level quiz | `modes/level-quiz/` | Original multiple-choice quiz (A2/B1/B2). Reports results to the host. |
| Sentence builder | `modes/sentence-builder/` | Pick a grammar topic, translate Ukrainian sentences by assembling English words from tiles. |

### Adding a mode

1. Add its id to `ENGLISH_QUIZ_MODES` in `packages/mfe-contracts` (this is
   also its URL value, so the host accepts it with no other change).
2. Create `src/modes/<id>/` with its root component, and an `index.ts` that
   exports a `PracticeModeDefinition` (title, description, category, levels,
   minutes, `lazyModeComponent(() => import('./<id>.vue'), <Id>Skeleton)`,
   optional `props`).
3. Register it in `DEFINITIONS` in `src/catalog/practice-catalog.ts`. The
   map is typed against the contract, so forgetting this step fails the
   typecheck.
4. Register its CSS in `src/styles.ts`. Use a new category only by adding it
   to `PRACTICE_CATEGORIES` (`src/shared/practice/practice-categories.ts`).

A mode's `index.ts` exports only its definition. The component behind it is
lazy, so each mode is its own chunk, downloaded the first time it is opened.
Modes never import from each other or from the catalog; shared code goes to
`src/shared/`.

## Folder layout

```
src/
├── mount.ts              Public MF surface (the only thing the host loads)
├── styles.ts             Collects every stylesheet into the shadow root
├── app/                  Shell: hub ↔ mode screen, turns clicks into mode-changed
│   └── components/       mode-screen (breadcrumb + lazy mode), mode-breadcrumb
├── hub/                  Hub screen: category sections, mode cards
│   └── model/            Pure formatting of a card's details (+ tests)
├── catalog/              Contract mode id → definition; grouping by category (+ tests)
├── progress/             Last score per mode (pure model, storage adapter,
│                         composable; + tests)
├── shared/               Used by several modes; depends on nothing above it
│   ├── composables/      use-async-data (loading/error/stale-response guard)
│   ├── lib/              random, format-level-range
│   ├── practice/         PracticeModeDefinition, categories, lazyModeComponent
│   ├── styles/base.css   Tokens + primitives (.btn, .card, .stack…)
│   └── ui/               quiz-icon, skeleton-block, skeleton-status (+ skeleton.css)
└── modes/
    ├── level-quiz/
    └── sentence-builder/
        ├── index.ts              Mode definition (the only public surface)
        ├── sentence-builder.vue  Screen switch: topic list ↔ practice
        ├── data/                 Where topics come from (swap point for the API)
        ├── model/                Pure TS: types, state machines, tile logic (+ tests)
        ├── composables/          Vue state wrapping the model
        └── components/           Rendering only, grouped by screen (+ one CSS file each)
```

Imports between the top-level folders only point down:
`app → hub → catalog → modes → shared`, and `progress` is used by `app` and
`hub` and depends only on the contract.

### Layers inside a mode

Imports only point **down**:

```
components  →  composables  →  model
                    ↓
                  data  →  model (types)
```

- **model/** — plain functions over immutable state, no Vue. Every rule of
  the exercise (what a wrong pick does, how tiles are chosen, scoring) lives
  here and is unit-tested with `bun:test`.
- **composables/** — hold reactive state (`shallowRef` of a model state),
  expose read-only `computed` values and named actions. One per stateful
  responsibility: `use-topic-catalog`, `use-topic`, `use-round`,
  `use-topic-practice`, `use-sentence-attempt`.
- **components/** — props down, events up. Each owns at most one composable;
  the rest only render what they receive.
- **data/** — `TopicSource` is async and maps one method to one future
  endpoint: `listTopics` (`GET /topics`), `getTopic` (`GET /topics/:id`, the
  rule without sentences) and `getRound` (`GET /topics/:id/round?size=10`).
  Today `createLocalTopicSource` serves the hard-coded topics and picks
  rounds with `pickRound`; when the API exists, implement the same interface
  with fetch calls and replace `topicSource`. Components and composables
  already handle loading/error states, so nothing else changes.

### Sentence content

- One file per topic in `data/topics/<level>/<topic-id>.ts`, written with
  `defineTopic` (later the database seed). The level's `index.ts` sets the
  display order.
- A topic holds a **bank** of sentences (aim for 100+); each attempt gets a
  **round** of `ROUND_SIZE` (10) picked by `pickRound`: random, taking
  affirmative / question / negative in turn so a round is never one kind.
- Every sentence has a permanent `id` (`<topic-id>-<n>`; never renumber or
  reuse one — progress history will be keyed by it) and a `form`.
- A one-line `rule` becomes a "usage" section illustrated by the first three
  sentences; write full sections for anything bigger.
- `data/topic-source.test.ts` checks the content: unique ids, known forms,
  traps that belong to the answer and differ from it.

## Sentence builder flow

```
TopicList ──select──▶ PracticeScreen (loads the topic + a round)
                         └─ TopicPractice (sentence index, progress dots, rule toggle)
                              ├─ SentenceExercise (one sentence; keyed → fresh state per sentence)
                              │    ├─ building: AnswerLine + WordTileGrid
                              │    ├─ wrong:    WrongAnswer (whole sentence, wrong words struck + fix above, Try again)
                              │    └─ correct:  CorrectAnswer (Next)
                              ├─ TopicComplete (score, Practice again = new round / Back to topics)
                              └─ RulePage (sidebar sections + examples)
```

- Picks are not checked one by one: the learner fills every slot (undo is
  available while building) and the sentence is checked, position by
  position, when the last word is placed. A wrong sentence shows every picked
  word, striking the wrong ones with the right word above; **Try again**
  restarts the same sentence. One wrong sentence counts as one mistake, and a
  sentence counts toward the score only if solved without mistakes.
- The rule page is shown with `v-if` while the exercise is hidden with
  `v-show`, so the picked words survive opening the rule.
- Punctuation is never a tile and never checked: `parseAnswer` splits
  "Yes, I do." into the words `Yes` `I` `do`, each with the punctuation
  printed `before`/`after` it. Apostrophes and hyphens stay inside words
  (`doesn't`, `twenty-one`), and known abbreviations keep their dots (`Mr.`).
- Tiles per step: the expected word + hand-picked `traps` for that word +
  other words of the sentence + the shared `WORD_POOL`, deduplicated
  case-insensitively, shuffled. The first step capitalises every tile.

## Skeletons

Every screen that loads something has its own skeleton component next to
it, shaped like the real screen (`level-quiz-skeleton`, `topic-list-skeleton`,
`practice-skeleton`). Build them from `SkeletonBlock` inside one
`SkeletonStatus`, and reuse layout constants (`QUIZ_LEVELS`,
`TILES_PER_STEP`, `TOPIC_LEVELS`) instead of guessing counts. A mode's
skeleton is also shown while its lazy code downloads. The host shows its own
`HubSkeleton` while the remote itself loads.

## Test ids

Every `data-testid` the remote renders comes from
`ENGLISH_QUIZ_REMOTE_TEST_IDS` in `packages/mfe-contracts`. The host's
Playwright tests (`apps/web/e2e/dashboard/english-quiz/`) find elements
only by these ids, never by role, text or CSS. When a test needs a new
element, add its id to the contract and render it here.

## Content

Topics live in `data/topics/{beginner,intermediate,advanced}.ts`, written with
the `defineTopics` helper:

```ts
{
	id: 'past-simple',
	title: 'Past Simple',
	subtitle: 'Минулий простий час',          // learner's language (Ukrainian)
	rule: 'One-line explanation…',            // or full RuleSection[] (see present-simple)
	sentences: [
		['Я бачив його вчора.', 'I saw him yesterday.', { saw: ['see', 'seen'] }],
	],
}
```

A string `rule` becomes a single "Usage" section illustrated by the topic's
own sentences. `data/topic-source.test.ts` checks ids are unique, every topic
has sentences and a rule, and every trap key is a word of its answer.

## Not built yet

Premium/locked topics, saving progress inside a mode (only the last level
quiz score is kept, on this device), reporting
sentence-builder results to the host (would be an additive contract event;
the hub would then show its last score too), search/filter on the hub
(worth adding past ~12 modes),
audio, and more than two sentences per topic.
