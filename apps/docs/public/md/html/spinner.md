# Spinner

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Shows that something is loading and says what, in words, to screen readers. Keep it for waits of more than a second. With reduced motion it stops turning and stays as a faint ring.

Docs: https://lamsa-ui.github.io/lamsa/components/spinner

```html
<span class="ui-loading" role="status">
  <span class="ui-spinner" aria-hidden="true"></span>
  <span class="ui-visually-hidden">Loading orders</span>
</span>
```

When to use something else:

- Work with a known length: [Progress](https://lamsa-ui.github.io/lamsa/components/progress)
- A whole page or card that is loading: [Skeleton](https://lamsa-ui.github.io/lamsa/components/skeleton)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-loading` | `class` |  | The spinner and its words, with role="status". |
| `ui-loading--lg` | `class` |  | The big one, over its label. |
| `ui-spinner` | `class` |  | The ring; hide it from screen readers. |

## Examples

### Sizes and labels

```html
<span class="ui-loading" role="status">
  <span class="ui-spinner" aria-hidden="true"></span>
  <span>Loading orders</span>
</span>
<span class="ui-loading ui-loading--lg" role="status">…</span>
```

### In a button

A busy button already has a spinner: use its loading input, not a second spinner.

```html
<button class="ui-button ui-button--primary" disabled aria-busy="true">
  <span class="ui-spinner" aria-hidden="true"></span> Saving
</button>
```

### In Arabic

```html
<!-- dir="rtl" on the page; the markup is the same -->
```
