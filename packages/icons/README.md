# @lamsa-ui/icons

Icons for the Lamsa design system. 24 px stroke SVGs that follow the text colour, with arrows and chevrons that flip in right-to-left pages.

The icons are [Lucide](https://lucide.dev) icons (ISC licence, see `NOTICE`), vendored in `svg/` so the set is ours to change.

## Use it in plain HTML

```html
<link rel="stylesheet" href="node_modules/@lamsa-ui/css/ui.css" />
<link rel="stylesheet" href="node_modules/@lamsa-ui/icons/icons.css" />

<i class="ui-icon ui-icon-search" role="img" aria-label="Search"></i>
<i class="ui-icon ui-icon-check ui-icon--lg" aria-hidden="true"></i>
```

Icons drawn this way are masks, so they take the current text colour and one stroke weight.

## Use it in Angular or React

```html
<ui-icon name="search" label="Search" />
```

```tsx
<Icon name="search" label="Search" />
```

Both come from `@lamsa-ui/angular` and `@lamsa-ui/react`, which depend on this package.

## Use the data

```ts
import { ICONS, searchIcon, type IconName } from '@lamsa-ui/icons';
```

`ICONS` holds every icon by name. Import a single `xIcon` constant to keep the rest out of your bundle.

## Add or change an icon

1. Add the Lucide name to `icons.json`.
2. Run `pnpm nx run icons:sync`.

Edit an SVG in `svg/` and run `pnpm nx run icons:generate` to rebuild `src/data.ts` and `icons.css`.
