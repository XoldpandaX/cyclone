# Cyclone

A production-ready React application scaffold built with modern tooling and strict TypeScript.

## Tech Stack

| Layer             | Tool                                           |
| ----------------- | ---------------------------------------------- |
| UI Framework      | React 19                                       |
| Language          | TypeScript 5 (strict)                          |
| Bundler           | Vite 6                                         |
| State             | Zustand 5                                      |
| Component Library | Mantine 7                                      |
| Data Grid         | Mantine DataTable 7                            |
| Styling           | Sass + CSS Modules                             |
| Linting           | ESLint 9 (flat config, `@antfu/eslint-config`) |
| Formatting        | Prettier 3                                     |
| Testing           | Vitest 3 + Testing Library                     |
| Git Hooks         | Husky 9 + lint-staged                          |

## Requirements

- **Node.js** >= 20.x
- **npm** >= 10.x (or pnpm / yarn)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Husky hooks are initialized automatically via the `prepare` script
#    (runs on npm install)

# 3. Start the dev server
npm run dev
```

## Available Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Vite dev server with HMR       |
| `npm run build`    | Type-check then build for production |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint across the project        |
| `npm run lint:fix` | Run ESLint with auto-fix             |
| `npm run format`   | Format all files with Prettier       |
| `npm run test`     | Run Vitest in watch mode             |
| `npm run test:run` | Run Vitest once (CI mode)            |
| `npm run generate` | Scaffold a new feature module        |

## Code Generation

The project uses [Plop](https://plopjs.com) to scaffold new feature modules.

```bash
npm run generate
```

You will be prompted for a feature name (e.g. `my-feature`). This generates:

```
src/features/my-feature/
├── index.ts                              # barrel export (add UI exports here)
├── model/
│   ├── index.ts                          # public API — useMyFeature() hook
│   ├── my-feature-store.ts               # Zustand store with HMR + initMyFeature()
│   └── my-feature-store-selectors.ts     # selectors (empty, ready to fill)
├── ui/                                   # add your React components here
└── use-case/                             # add business logic here
```

After generating:

1. Add state and actions to `my-feature-store.ts`
2. Expose them via `toPublicApi` in `model/index.ts`
3. Add use cases under `use-case/`
4. Wire `initMyFeature()` in `src/app/bootstrap.ts`

## Project Structure

```
src/
├── app/                  # App root: providers, root component
│   ├── App.tsx
│   ├── App.module.scss
│   └── providers.tsx
├── features/             # Feature slices (co-located store + UI)
│   └── users/
│       ├── components/
│       │   └── UsersTable.tsx
│       ├── store/
│       │   └── usersStore.ts
│       └── index.ts
├── pages/                # Route-level page components
│   └── UsersPage/
│       ├── UsersPage.tsx
│       └── UsersPage.module.scss
├── shared/               # Shared across features
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.module.scss
│   │       └── Button.test.tsx
│   └── types/
│       └── index.ts
├── test/
│   └── setup.ts          # Vitest global setup
├── main.tsx
└── vite-env.d.ts
```

## Key Configuration Notes

- **TypeScript**: Maximum strictness — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, and more.
- **ESLint**: Flat config (`eslint.config.ts`) via `@antfu/eslint-config`; stylistic rules disabled — Prettier owns formatting.
- **Prettier**: Source of truth for all formatting. `eslint-config-prettier` ensures no ESLint/Prettier conflicts.
- **Git hooks**: Pre-commit runs `lint-staged` — ESLint + Prettier on staged files only.
- **Path alias**: `@/` maps to `src/` in both TypeScript and Vite.
