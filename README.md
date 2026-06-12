# BeatUI

A layered admin template built on [shadcn/ui](https://ui.shadcn.com) + Vite, following the shadcn philosophy end to end: **the code is yours**. There is no package to install, no version to upgrade, no configuration API to learn — clone it, delete what you don't need, and edit anything. Editing the source _is_ the configuration.

![BeatUI](public/images/beatui.png)

Based on [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) (MIT), restructured into strict tiers so you always know where new code belongs — and what you can safely delete.

## Features

- **Layered architecture** — base UI / framework components / demo, with one-way dependencies enforced by ESLint
- **Starter generator** — one command derives a clean project skeleton (all the framework, none of the demo)
- **CRUD exemplar** — a complete users page: data table, URL-synced state, faceted filters, bulk & row actions, add/edit/invite/import/delete dialogs
- **Auth pages** — sign-in, sign-up, forgot password, OTP; UI + store skeleton, bring your own backend
- **Settings & error pages** — profile/account/appearance/display/notifications, 401/403/404/500/503
- **Skins** — one CSS file per skin, auto-registered, runtime switcher with live previews; ships with `default`, `claude`, `sunset-horizon`, `amethyst-haze`, design more at [tweakcn.com](https://tweakcn.com)
- Light/dark mode, RTL, font & layout switching via config drawer, ⌘K command menu
- Component tests with Vitest browser mode (real Chromium via Playwright)

## Quick start

**Start a project** — generate the starter (layout shell + sidebar/top nav + routing + theme switching + auth pages + settings + error pages + empty home):

```bash
node scripts/create-starter.mjs ../my-admin
cd ../my-admin && git init && pnpm install && pnpm dev
```

**Explore the full demo** — run this repo directly:

```bash
pnpm install && pnpm dev
```

## Architecture

Four concepts, three of them directories:

| Concept                  | Where                      | What it is                                                                                          |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------- |
| **Base components**      | `src/components/ui/`       | shadcn primitives + shadcn-style additions. Stateless/controlled; never touch context or routing.   |
| **Framework components** | `src/components/features/` | Admin scenario components: data-table suite, layout shell, auth, settings, errors, command menu…    |
| **Demo**                 | `src/demo/`                | Reference pages filling framework components with fake business data. Delete it and nothing breaks. |
| **Starter**              | generated                  | This repo minus the demo — what you actually start a project from.                                  |

**The one red line**: anything carrying project-specific business attributes (fields, enums, copy) never enters the component tiers. Scenario semantics (login, table, settings) are not business attributes — the test is: _could another company use this component unchanged?_

**One-way dependency rule** (enforced by ESLint):

```
components/ui  ←  components/features  ←  demo  ←  routes (assembly)
```

`src/config/` holds app fill-in config (`sidebar-data.ts`). Framework components never import it — routes inject it via props.

**Where does new code go?**

1. Does it have project business attributes? → `src/demo/` (in your project: your feature folder)
2. Does it touch context or routing? → `src/components/features/`
3. Otherwise → `src/components/ui/`

## Building a CRUD page

`src/demo/users/` is the canonical pattern. To create your own page:

1. Copy `src/demo/users/` to your feature folder and rename.
2. Add a route under `src/routes/_authenticated/<your-page>/` (copy `users/index.tsx`, adjust the search schema).
3. Add a nav entry in `src/config/sidebar-data.ts`.

What you then edit is exactly the fill-in surface: column defs, filter options, form fields + zod schema, action menus, copy. Everything else comes from `@/components/features/data-table`.

## Theming

Styles are split by ownership in `src/styles/`:

| File            | Owner         | Content                                                                                         |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `shadcn.css`    | shadcn CLI    | The standard token contract (`:root`/`.dark` + `@theme inline`). `components.json` points here. |
| `framework.css` | this template | Base styles, utilities, animations, font variables.                                             |
| `themes/`       | you           | **One skin = one CSS file** — token value overrides only, auto-registered.                      |

Four skins ship built in: `default` (shadcn/ui defaults), plus `claude`, `sunset-horizon`, and `amethyst-haze` (from [tweakcn](https://tweakcn.com)). Users switch them at runtime in the Theme Settings drawer — the choice is cookie-persisted and applied as `<html data-skin>`. To add your own: design at [tweakcn.com](https://tweakcn.com), export, keep only the contract tokens, rescope `:root` → `:root[data-skin='<name>'], [data-skin='<name>']` and `.dark` → `:root[data-skin='<name>'].dark`, and drop the file into `src/styles/themes/` — it auto-appears in the picker (see `src/styles/themes/README.md`).

## Staying up to date

- **shadcn components**: `npx shadcn@latest add <component>` keeps working — `components.json` ships with the template. Some ui components are customized (scroll-area, sonner, separator, RTL tweaks); diff before overwriting.
- **This template**: it's a git fork — add this repo as `upstream` and merge / cherry-pick. Conflicts mark exactly the places you customized; that's the model working as intended.

## Tech stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · TanStack Router/Query/Table · react-hook-form + Zod · Zustand · Vitest (browser mode)

## Known exemptions

- `ui/sonner.tsx` imports the theme context (shadcn's own implementation requires it) — the only sanctioned upward dependency from the ui tier.
- The auth pages ship with a fake submit (`sleep` + toast). Wire your real auth in `components/features/auth/*-form.tsx` and `src/stores/auth-store.ts` — both are yours to edit.

## License

MIT — see [LICENSE](LICENSE). Original work © [@satnaing](https://github.com/satnaing).
