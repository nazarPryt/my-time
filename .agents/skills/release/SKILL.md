---
name: release
description: Release the product end to end — on dev run `bun run release`, rewrite the drafted release notes in plain language for users, commit, and open the dev → main release PR. TRIGGER when the user asks to "prepare a release", "make a release", "cut a release", "bump the version", "release to main", "write release notes", or invokes /release.
user-invocable: true
args: "[major|minor|patch|x.y.z] — optional bump override; default is detected from commits."
---

# Release

Follow "Releasing" in the root `AGENTS.md`. This skill is the whole release:
it prepares the release commit on `dev` and opens the `dev → main` PR. It is
self-contained; don't use a generic PR skill for the release PR.

## 1. Prepare

1. Be on `dev`, up to date with `origin/dev`, with no uncommitted tracked
   changes. Stop and ask otherwise.
2. `bun run release --dry-run [override]`. Show the user the version change
   and drafted items. Ask before continuing if the bump looks wrong (e.g. a
   `feat` that is really internal, or a breaking change that isn't marked).
3. `bun run release [override]`. It updates `package.json` and adds a draft
   entry to `contracts/src/features/releases/release-notes.data.ts`.

## 2. Research what actually changed

The draft holds commit titles only. For each item, find what the user
gets:

- Feature branches merged since the last tag:
  `git log --first-parent --merges v<previous>..HEAD --format='%h %s'`,
  then `git log --no-merges <sha>^1..<sha>^2` and the diff for each merge.
- Direct commits on `dev`: `git show --stat <sha>`, and read the diff when the
  title isn't enough.
- Look for user-visible changes the titles missed: UI (`apps/web/src`), the
  browser extension, the GNOME extension, and behaviour changes in the API.

## 3. Rewrite the entry

Edit only the new entry, keeping `version` and `date`.

- Write for someone who uses my·time, not for developers. Say what they can
  now do or what got better: "See a loading preview on every dashboard tab
  instead of a blank screen", not "add loading skeletons".
- `features`: new things and noticeable improvements. `fixes`: bugs users
  could hit, phrased as the symptom that is gone ("Timer no longer resets when
  the desktop app reconnects").
- Each item is one sentence, under ~100 characters, starting with a verb or
  the thing that changed. No trailing period, no PR numbers, no scopes, no
  file or package names, no jargon (SSE, FSD, refactor, migration, CI).
- Leave out purely internal work: refactors, tests, CI, dependencies, docs,
  tooling. If nothing user-facing remains, use empty arrays; the dialog and
  GitHub Release then say it's a maintenance release.
- Merge items that describe one feature; put the most important first.
- English, unless the user asks otherwise.

## 4. Verify and commit

1. `bun run check` (formats the data file), `bun --filter contracts test`.
2. `bun run release:check origin/main` (after `git fetch origin main --tags`).
3. Show the user the final entry and wait for approval or edits.
4. Commit `package.json` and the notes file as `chore(release): v<version>`.

## 5. Open the release PR

Only when the user asks for it.

1. Run `bun run ci:local` on `dev` (it includes the release check). Fix
   failures and rerun; if a prerequisite blocks the full run, report it and
   stop — `AGENTS.md` forbids opening the PR on partial checks.
2. `git push origin dev`.
3. Fill `.github/pull_request_template.md` verbatim (keep every section and
   checklist item, replace the `<!-- -->` prompts, tick only boxes you
   verified):
   - `## What`: "Release v<version>" and the output of
     `bun scripts/release/print-notes.ts <version>`.
   - `## Why`: ship the listed changes to production.
   - `## How it was tested`: the `ci:local` run.
4. Create it:

   ```bash
   gh pr create --base main --head dev \
     --title "chore(release): v<version>" --body-file <filled-template-file>
   ```

5. Share the PR link. Tell the user to merge with **Create a merge commit**
   (never squash). After the merge passes CI, `release.yml` creates the tag
   and GitHub Release and fast-forwards `dev` to `main`; the user then pulls
   `dev` locally. Never merge yourself.
