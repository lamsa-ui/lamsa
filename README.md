# Lamsa

Lamsa (لمسة, "a touch") is an open-source design system: accessible, Arabic and English from the start, and built to work with any frontend.

**[Read the docs](https://lamsa-ui.github.io/lamsa/)** ([setup guide](https://lamsa-ui.github.io/lamsa/getting-started)): every component live, with the code for your framework.

| Package                                 | What it is                                                                                          | Status                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| [`@lamsa-ui/css`](packages/css)         | Fonts, design tokens and every component style, in plain CSS. Works in any stack, framework or not. | Ready                          |
| [`@lamsa-ui/angular`](packages/angular) | Angular 22 components on the Angular CDK.                                                           | Ready: all 61 components below |
| [`@lamsa-ui/react`](packages/react)     | React 19 components on React Aria.                                                                  | Ready: all 61 components below |
| [`@lamsa-ui/icons`](packages/icons)     | The kit's icon set, as SVG, CSS masks and typed names. Arrows flip in right-to-left text.           | Ready                          |
| [`@lamsa-ui/vue`](packages/vue)         | Vue 3 components on Reka UI, styled by the shared CSS package.                                      | Ready: all 61 components below |

## Components

Every one ships in Angular, React and Vue with the same name, the same options and the same markup, and in plain HTML through `@lamsa-ui/css`.

- **Actions:** button, button group, toggle, toolbar
- **Forms:** calendar, checkbox, chip input, combobox, date picker, fieldset, file field, input group, number field, phone field, PIN input, radio group, rating, search field, segmented control, select, slider, switch, text field, textarea
- **Feedback:** alert, badge, empty state, meter, progress, skeleton, spinner, status dot, toast
- **Navigation:** app shell, breadcrumbs, language switcher, navigation, pagination, stepper, tabs
- **Overlays:** alert dialog, bottom sheet, command palette, context menu, dialog, drawer, menu, popover, tooltip
- **Content:** accordion, card, divider, keyboard key, timeline
- **Data:** avatar, avatar group, data table, property list, stat, tag, tree

## How it fits together

- **One source for how it looks.** Every visual decision lives in [`packages/css/ui.css`](packages/css/ui.css). Framework packages write markup and class names only, never styles, so a fix there reaches every framework at once.
- **Behaviour from tested headless libraries.** Keyboard, focus and screen reader behaviour come from the standard headless library of each framework, not from code written again here.
- **The same component in every framework.** Same name, same options, same stories. A component is done when it ships in all of them.

## The look

Every value comes from the Lamsa palette:

- **Colour.** Brand blue `#0059FF` is the primary colour, brand red `#DC4B4B` carries danger, on ink `#0B1020` and paper `#F6F7FB` grounds, with slate `#586087` for secondary text. Product UI needs shades the palette doesn't name. Each one is the brand colour darkened or lightened along its own hue until small text reaches 7:1. Red and blue never meet as large areas.
- **Type.** IBM Plex Sans and IBM Plex Sans Arabic for body text, Archivo Expanded and Alexandria for headlines, IBM Plex Mono for labels. The font files ship in the package (SIL Open Font License). Arabic is never letter-spaced.
- **Light and dark.** Every colour is a `light-dark()` pair. The theme follows the user's system setting; set `data-theme="light"` or `"dark"` on any ancestor to force one.
- **Measured contrast.** A unit test reads `ui.css` and fails if any text pair falls under 7:1, or any border or focus ring under 3:1, in either theme.
- **Audited on every push.** CI runs axe (WCAG 2.2 AA and best practice) on every docs page, in both themes and every framework view, and with dialogs, alerts and lists open in the Angular and HTML views. Any problem fails the build.
- **Right to left without a second stylesheet.** All spacing and alignment use logical properties, so `dir="rtl"` is enough.

## Use it

Any stack, on Tailwind CSS 4 (the kit's tokens become the Tailwind theme: `p-4`, `bg-primary`, `head-md`):

```css
@import 'tailwindcss';
@import '@lamsa-ui/css/tailwind.css';
```

Without Tailwind, `@import '@lamsa-ui/css/ui.css';` and the kit's own `ui-*` classes.

Icons: `<ui-icon>` in Angular and `<Icon>` in React come with those packages. In plain HTML, add `@lamsa-ui/icons` and `@import '@lamsa-ui/icons/icons.css';`, then write `<i class="ui-icon ui-icon-search"></i>`.

Angular:

```shell
pnpm add @lamsa-ui/angular @lamsa-ui/css @angular/cdk
pnpm add -D tailwindcss @tailwindcss/postcss
```

```css
/* styles.css; .postcssrc.json: { "plugins": { "@tailwindcss/postcss": {} } } */
@import 'tailwindcss';
@import '@lamsa-ui/css/tailwind.css';
@import '@angular/cdk/overlay-prebuilt.css';
@import '@angular/cdk/a11y-prebuilt.css';
```

```ts
import { ButtonComponent, SelectComponent, TextFieldComponent } from '@lamsa-ui/angular';
```

React:

```shell
pnpm add @lamsa-ui/react @lamsa-ui/css
pnpm add -D tailwindcss @tailwindcss/vite
```

```css
/* src/index.css; add tailwindcss() from @tailwindcss/vite to the Vite plugins */
@import 'tailwindcss';
@import '@lamsa-ui/css/tailwind.css';
```

```tsx
import './index.css';
import { Button, Select, TextField } from '@lamsa-ui/react';
```

Vue:

```shell
pnpm add @lamsa-ui/vue @lamsa-ui/css vue
```

```ts
import { Button, TextField } from '@lamsa-ui/vue';
```

The Vue package ships every component, on Reka UI where Angular uses the CDK and React uses React Aria.

A client re-brands by overriding `--ui-primary`, `--ui-focus`, `--ui-highlight` and their `--ui-on-*` pairs on `:root`; Tailwind classes and kit components follow. The [theme builder](https://lamsa-ui.github.io/lamsa/foundations/theme) makes those values from one brand colour and checks every pair.

## Work on it

Requires Node 22 and pnpm 10.

```shell
pnpm install
pnpm nx serve docs           # the docs site on http://localhost:4200
pnpm nx run-many -t test     # Vitest, including the contrast check
pnpm nx run-many -t lint     # ESLint, including the Angular template accessibility rules
pnpm llms --check            # verify checked-in AI docs match their source pages
pnpm nx build css            # package styles and fonts into dist/packages/css
pnpm nx build angular        # package into dist/packages/angular
pnpm nx build vue            # package into dist/packages/vue
pnpm nx e2e docs             # Playwright on the built docs: axe (WCAG 2.2 AA) on every page,
                             # keyboard checks in Chromium/Firefox/WebKit, screenshots
                             # report: dist/.playwright/report/index.html
pnpm nx e2e docs -- --update-snapshots visual   # accept new screenshots
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org), checked by commitlint on every commit. CI runs lint, unit and browser interaction tests, builds the packages and docs, checks screenshot regressions, and audits accessibility on every push and pull request. It publishes the docs site from `main`.

## Release

Each package (`css`, `angular`, `react`, `icons`, `vue`) is versioned on its own by [Nx Release](https://nx.dev/features/manage-releases), from the conventional commits that touch it (`feat` = minor, `fix` = patch). [`tools/release.mjs`](tools/release.mjs) versions, publishes to npm, then writes the changelog, tags and GitHub releases, so a failed publish leaves nothing pushed.

```shell
pnpm release:dry                                   # see what would happen, for every package
pnpm release:react --dry-run                       # one package
pnpm release:vue --dry-run                          # Vue package
node tools/release.mjs --first-release --specifier=0.1.0 --dry-run
```

Real releases are off until `RELEASE_ENABLED=true` is set (locally, or as a repository variable for the release workflow). The first release needs `--first-release` and a `--specifier`, because there is no earlier tag to compare with.

## Licence

Code: [MIT](LICENSE). Fonts: SIL Open Font License, see [`packages/css/fonts/licenses`](packages/css/fonts/licenses).
