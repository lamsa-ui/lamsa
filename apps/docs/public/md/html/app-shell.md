# App shell

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The frame every screen of an app sits in: a header across the top, the main links in a side bar, the page beside them. When the shell is narrower than 64rem the side bar folds behind a menu button and opens over the page. Escape, the shade, or following a link closes it again.

Docs: https://ghazal-ui.github.io/ghazal/components/app-shell

```html
<div class="ui-shell">
  <header class="ui-shell__header">...</header>
  <div class="ui-shell__body">
    <div class="ui-shell__sidebar" id="sidebar">...</div>
    <main class="ui-shell__main" id="main">...</main>
  </div>
</div>
```

When to use something else:

- Links in a side bar only, inside your own layout: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Show where the page sits in the site: [Breadcrumbs](https://ghazal-ui.github.io/ghazal/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-shell \| ui-shell--open` | `class` |  | The frame; --open shows the folded side bar. |
| `ui-shell__header \| __body \| __sidebar \| __main` | `class` |  | Its parts. |
| `--ui-shell-header \| --ui-shell-sidebar` | `token` | `4rem \| 16rem` | Header height and side bar width. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space: On the menu button, open the side bar on a narrow screen.
- Escape: Close the side bar.
- The header, the side bar and the page are landmarks, so screen readers can jump between them.

## Examples

### An app

This preview is narrower than 64rem, so the side bar starts folded. Press Menu. On a wide screen it stays open beside the page.

```html
<div class="ui-shell">
  <header class="ui-shell__header">
    <!-- Toggle .ui-shell--open on .ui-shell and aria-expanded here with a script. -->
    <button type="button" class="ui-button ui-button--ghost ui-button--icon ui-shell__menu"
      aria-label="Menu" aria-expanded="false" aria-controls="sidebar">
      <i class="ui-icon ui-icon-menu"></i>
    </button>
    <a class="ui-shell__brand" href="/">Ghazal</a>
  </header>
  <div class="ui-shell__body">
    <div class="ui-shell__sidebar" id="sidebar">
      <nav class="ui-nav" aria-label="Main">…</nav>
    </div>
    <main class="ui-shell__main" id="main" tabindex="-1">…</main>
  </div>
</div>
```

### In Arabic

```html
<!-- dir="rtl": the side bar sits on the right and opens from there. -->
```
