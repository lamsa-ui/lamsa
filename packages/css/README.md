# @ghazal-ui/css

The Ghazal design system in plain CSS: the brand fonts, light and dark design tokens measured to 7:1, and the styles of every component. Works in any stack.

With Tailwind CSS 4 (recommended): one import after Tailwind loads the kit and makes its tokens the Tailwind theme, so `p-4` is `--ui-space-4`, `bg-primary` is `--ui-primary`, `rounded-xl` is `--ui-radius-xl`, and `head-md`, `z-dialog`, `duration-fast`, `ease-ui`, `shadow-ui` and `focus-visible:focus-ring` read the kit too. The kit sits in the `components` layer, so a Tailwind class always wins over a kit class. Extend it in your own `@theme`.

```css
@import 'tailwindcss';
@import '@ghazal-ui/css/tailwind.css';
```

Without Tailwind:

```css
@import '@ghazal-ui/css/ui.css';
```

The component markup uses icon classes such as `<i class="ui-icon ui-icon-chevron-down">`. Add `@ghazal-ui/icons` and `@import '@ghazal-ui/icons/icons.css';` to draw them.

Tokens are `--ui-*` custom properties; the theme follows the system setting, or `data-theme="light"` / `"dark"` on any ancestor. Type styles: one class for face, weight, size and line height, `ui-head-3xl` … `ui-head-2xs` and `ui-body-lg` / `md` / `sm` (weight suffix `-m` `-s` `-b`), with a token of the same name for `font: var(--ui-head-md)` in your own CSS. Labels: `class="ui-label"`. Padding, margin and gap classes for every space step: `ui-p-4`, `ui-mx-auto`, `ui-ms-2`, `ui-gap-3` (sides `x y t b s e`, logical, so they flip in Arabic; `ui-gap-x-*` / `ui-gap-y-*` for columns / rows). Breakpoints are Tailwind's (`--ui-breakpoint-sm` 40rem to `--ui-breakpoint-2xl` 96rem); put `class="ui-container"` on a box and query it with `@container (width >= 48rem)`. Page layout: `class="ui-page"` on the wrapper gives a centred 12-column grid with side padding and gap that grow with the screen; children take `ui-col-6`, `ui-col-md-4` … (`sm md lg xl 2xl`), and `ui-grid` splits a column again.

[Source and docs](https://github.com/ghazal-ui/ghazal). Code MIT; fonts SIL Open Font License (see `fonts/licenses`).
