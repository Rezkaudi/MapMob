# MapMob

Angular 21 app. Standalone components, Vitest for tests, Tailwind CSS 4 for styles.

## Commands

| Command | What it does |
|---|---|
| `npm start` | Dev server on http://localhost:4200 |
| `npm test` | Run tests once (Vitest) |
| `npm run build` | Production build into `dist/mapmob/browser` |
| `npm run env` | Rebuild `src/environments/environment.ts` from `.env` |
| `ng generate component <path>` | Make a new component |
| `docker compose up dev` | Dev server in Docker on http://localhost:4200 |
| `docker compose up --build web` | Production build behind nginx on http://localhost:8080 |

`start`, `build`, and `test` run `npm run env` first, so the environment file is
always fresh.

## Backend API settings

The backend URL lives in `.env`. It is not committed.

1. Copy `.env.example` to `.env`.
2. Set `NG_APP_API_BASE_URL`.

`scripts/generate-environment.mjs` reads that file and writes
`src/environments/environment.ts`, which is generated and git-ignored. A value
already set in the shell wins over the file, so Docker build args and CI
variables override it.

Read the URL through the `API_BASE_URL` token, never from `environment` directly:

```ts
private readonly apiBaseUrl = inject(API_BASE_URL);
```

Add a new setting in three places: `.env.example`, the script, and the token
file that exposes it.

## CI

`.github/workflows/ci.yml` runs on every push to `main`/`master` and on every
pull request: `npm ci`, `npm test`, then `npm run build`. Keep the build green.
Set the repository variable `NG_APP_API_BASE_URL` in GitHub if the build needs a
real URL; without it the workflow falls back to `.env.example`.

## How to work in this repo

Follow these rules on every change. They are not optional.

### 1. Test first (TDD)

Always write the test before the code.

1. Write a failing test that says what the code must do.
2. Run it. See it fail.
3. Write the smallest code that makes it pass.
4. Run it. See it pass.
5. Clean up the code. Keep the test green.

Never write production code without a failing test for it first.
Never skip step 2 — a test that was never red proves nothing.

### 2. One responsibility per file

A file does one thing. If a file has two reasons to change, split it.

- One component per file.
- One service per file.
- One model, type, or interface per file.
- Keep HTML, CSS, and TypeScript in their own files.

If a file grows past ~150 lines, it is probably doing too much. Split it.

### 3. Clear names

The name must say what the thing is or does. No short forms, no puzzles.

Good: `userLocation`, `loadNearbyStops`, `MapMarkerService`
Bad: `data`, `tmp`, `handleIt`, `mgr`, `x`

Rules:
- Variables and properties: nouns.
- Functions and methods: verb first (`getRoute`, `saveTrip`, `isVisible`).
- Booleans start with `is`, `has`, `can`, or `should`.
- Files use the Angular 2025 style guide. No type suffix: `map-view.ts`, not
  `map-view.component.ts`. `trip-api.ts`, not `trip.service.ts`.
- Never name a file `utils.ts`, `helpers.ts`, or `common.ts`. Say what is inside.

### 4. Small comments only

Write code that explains itself. Do not write big comment blocks.

- No comment that repeats the code.
- No header banners, no file-description blocks, no `@author` tags.
- No commented-out code. Delete it.
- Write a short comment only when the *why* is not obvious. One line.

### 5. Clean code

- Small functions. One job each.
- Return early instead of deep `if` nesting.
- No magic numbers or strings. Name them as constants.
- No duplicate logic. Pull it into one place.
- Delete dead code instead of keeping it.
- Use `readonly` and `const` when a value does not change.

### 6. Simple English

Use plain, common words in code, comments, commit messages, and replies.
Short sentences. No long or rare words when a simple one works.

## State management (NgRx)

State lives in the NgRx store, not in components. We use the classic store:
`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, and `@ngrx/store-devtools`, all
pinned to version 21 to match Angular 21.

A feature keeps one file per job. `src/app/trips` is the pattern to copy:

| File | Job |
|---|---|
| `trip.ts` | The model |
| `trip-api.ts` | Talks to the backend. Nothing else |
| `state/trip.state.ts` | Shape of the state, feature key, starting values |
| `state/trip.actions.ts` | Actions only |
| `state/trip.reducer.ts` | Turns actions into new state |
| `state/trip.selectors.ts` | Reads state. All derived values go here |
| `state/trip.effects.ts` | Side effects, one per action |
| `trip.providers.ts` | `provideTripsFeature()`, wires the feature into the store |

Rules:

- Name actions `[Feature] What Happened`, in plain English.
- Every load gets three actions: start, success, failure.
- Reducers stay pure. No HTTP, no dates, no random values.
- Derived values belong in selectors, never in components or templates.
- Components read state with `store.selectSignal(...)` and send actions with
  `store.dispatch(...)`. They hold no state of their own.
- Register a feature with its `provide<Feature>Feature()` function. Move that
  call from `app.config.ts` to a lazy route when the feature gets its own route.

Test every part on its own, before writing it:

- Reducer: call it with a state and an action, check the new state.
- Selectors: call `selector.projector(...)` with plain values.
- Effects: give a fake API and a fake action stream, check the action that comes out.
- API service: use `provideHttpClientTesting` and `HttpTestingController`.

Vitest 4 has no `done` callback. Write async tests with `async`/`await` and
`firstValueFrom`.

## Angular rules

- Use standalone components. Do not add NgModules.
- Use signals for component state.
- Use `inject()` instead of constructor injection.
- Keep logic out of templates. Templates only show data.
- Business logic lives in services, not components.
- Style with Tailwind classes. Use a `.css` file only when Tailwind cannot do it.
