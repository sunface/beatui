# BeatUI

BeatUI is an admin template built on [shadcn/ui](https://ui.shadcn.com) + Vite, following the shadcn philosophy end to end: **the code is yours**. Clone it, delete what you don't need, and edit anything — there is no package to install, no version to upgrade, no configuration API to learn. Editing the source _is_ the configuration.

Based on [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) (MIT), restructured into a layered template.

![alt text](public/images/beatui.png)

## The four concepts

| Concept                  | Where                      | What it is                                                                                                                                                                                                                                            |
| ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base components**      | `src/components/ui/`       | shadcn primitives + our shadcn-style additions. Stateless/controlled; never touch context or routing. Managed by the shadcn CLI.                                                                                                                      |
| **Framework components** | `src/components/features/` | Admin scenario components composed from base ones: data-table suite, layout shell, auth pages, settings, errors, command menu… May use framework providers and routing, but contain **zero project-specific business** — usable by any project as-is. |
| **Demo**                 | `src/demo/`                | Reference pages built by filling framework components with fake business data. Not a component tier. Delete the whole directory and nothing breaks.                                                                                                   |
| **Starter**              | generated                  | This repo minus the demo. What you actually clone to start a project.                                                                                                                                                                                 |

**The one red line**: anything carrying project-specific business attributes (fields, enums, copy) never enters the component tiers. Scenario semantics (login, table, settings) are not business attributes — the test is: _could another company use this component unchanged?_

**One-way dependency rule** (enforced by ESLint):

```
components/ui  ←  components/features  ←  demo  ←  routes (assembly)
```

`src/config/` holds app fill-in config (`sidebar-data.ts`). Framework components never import it — routes inject it via props.

### Where does new code go?

1. Does it have project business attributes? → `src/demo/` (in your project: your feature folder)
2. Does it touch context or routing? → `src/components/features/`
3. Otherwise → `src/components/ui/`

## Getting started

**Start a project** — generate the starter (layout shell + sidebar/top nav + routing + theme switching + auth pages + settings + error pages + empty home):

```bash
node scripts/create-starter.mjs ../my-admin
cd ../my-admin && git init && pnpm install && pnpm dev
```

**Explore the full demo** — run this repo directly:

```bash
pnpm install && pnpm dev
```

## Building a CRUD page (copy the exemplar)

`src/demo/users/` is the canonical CRUD pattern: table + URL-synced state + faceted filters + bulk actions + row actions + add/edit/invite/import/delete dialogs. To create your own page:

1. Copy `src/demo/users/` to your feature folder and rename.
2. Add a route under `src/routes/_authenticated/<your-page>/` (copy `users/index.tsx`, adjust the search schema).
3. Add a nav entry in `src/config/sidebar-data.ts`.

What you then edit is exactly the fill-in surface: column defs, filter options, form fields + zod schema, action menus, copy. Everything else comes from `@/components/features/data-table`.

## Theming

Styles are split by ownership in `src/styles/`:

| File            | Owner         | Content                                                                                                                                    |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `shadcn.css`    | shadcn CLI    | The standard token contract (`:root`/`.dark` + `@theme inline`). `components.json` points here, so CLI updates land here and nowhere else. |
| `framework.css` | this template | Base styles, utilities, animations, font variables.                                                                                        |
| `themes/`       | you           | **One theme = one CSS file** — only token value overrides, imported last.                                                                  |

To reskin: design at [tweakcn.com](https://tweakcn.com), export, save the `:root`/`.dark` blocks as `src/styles/themes/<name>.css`, and import it at the end of `index.css`.

## Updating from upstream

- **shadcn components**: `npx shadcn@latest add <component>` keeps working — `components.json` ships with the template. Note: some ui components are customized (scroll-area, sonner, separator and RTL tweaks inherited from upstream); diff before overwriting.
- **This template**: it's a git fork — add this repo as `upstream` and `git merge` / cherry-pick. Conflicts mark exactly the places you customized; that's the model working as intended.

## Tech stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · TanStack Router/Query/Table · react-hook-form + Zod · Zustand · Vitest (browser mode)

## Known exemptions

- `ui/sonner.tsx` imports the theme context (shadcn's own implementation requires it) — the only sanctioned upward dependency from the ui tier.
- The auth pages ship with a fake submit (`sleep` + toast). Wire your real auth in `components/features/auth/*-form.tsx` and `src/stores/auth-store.ts` — both are yours to edit.

## License

MIT — see [LICENSE](LICENSE). Original work © [@satnaing](https://github.com/satnaing).
